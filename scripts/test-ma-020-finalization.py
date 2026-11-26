"""MA-020 targeted failure/restart tests for authenticated HA-to-SQLite finalization."""
import importlib
import json
from pathlib import Path
import sys
import tempfile
import types
import unittest
from uuid import uuid4

root = Path(__file__).resolve().parents[1]
p = types.ModuleType("_ma020final")
p.__path__ = [str(root / "custom_components/gewitterradar")]
sys.modules[p.__name__] = p
Database = importlib.import_module("_ma020final.monitored_areas.storage.database").Database
api_mod = importlib.import_module("_ma020final.monitored_areas.api")
final_mod = importlib.import_module("_ma020final.monitored_areas.finalization")
Api = api_mod.Api


def uid():
    return str(uuid4())


def item(name, lat, lon):
    return {"uid":uid(),"summary":name,"status":"needs_action",
            "description":"GEWITTERRADAR_PLACE_V1\n"+json.dumps({
                "version":1,"name":name,"latitude":lat,"longitude":lon})}


class Vault:
    def __init__(self):
        self.owners = {}
    async def async_profile_belongs_to(self, user, profile):
        return profile in self.owners.get(user, set())


class FinalizationContracts(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.folder = Path(tmp.name)
        self.db = Database(self.folder / "gewitterradar/monitored_areas/monitored_areas.sqlite3",
                           config_root=self.folder)
        await self.db.async_start()
        self.profile = uid()
        self.vault = Vault()
        self.vault.owners = {"alice":{self.profile}}
        self.items = [item("Alpha",52,9),item("Beta",53,10)]
        self.removed = []
        self.fail_once = False
        async def source():
            return list(self.items)
        async def remove(ref):
            matches = [x for x in self.items if x["uid"] == ref]
            if len(matches) != 1:
                raise RuntimeError("missing")
            self.items = [x for x in self.items if x["uid"] != ref]
            self.removed.append(ref)
            if self.fail_once:
                self.fail_once = False
                raise RuntimeError("ack lost after removal")
        self.source, self.remove = source, remove
        self.api = Api(self.db,self.vault,fetch_legacy_items=source,remove_legacy_item=remove)

    async def asyncTearDown(self):
        await self.db.async_stop()

    async def call(self, op, payload=None, *, actor="alice", admin=False, request_id=None):
        request = {"profile_id":self.profile,"payload":payload or {}}
        if request_id:
            request["request_id"] = request_id
        return await self.api.dispatch(
            actor_user_id=actor,is_admin=admin,op=op,request=request)

    async def imported(self, *, skip=False):
        preview = await self.call("migration_preview")
        decisions = [{"uid":x["uid"],"action":"skip" if skip and idx else "create"}
                     for idx,x in enumerate(self.items)]
        return await self.call("migration_commit",
                               {"preview_id":preview["preview_id"],"decisions":decisions},
                               request_id=uid())

    async def approved(self):
        return await self.call("migration_finalize_preview",admin=True)

    async def commit(self, preview, *, admin=True):
        return await self.call("migration_finalize_commit",
                               {"nonce":preview["nonce"],"explicit_final":True},
                               admin=admin,request_id=uid())

    async def test_complete_cutover_requires_verified_absence(self):
        await self.imported()
        self.assertEqual((await self.call("status"))["capabilities"]["saved_places_mode"],"migration_pending")
        approval = await self.approved()
        self.assertEqual(approval["item_count"],2)
        self.assertEqual((await self.commit(approval))["mode"],"db_active")
        self.assertEqual(len(self.items),0)
        self.assertEqual(len(set(self.removed)),2)
        status = await self.call("status")
        self.assertEqual(status["capabilities"]["saved_places_mode"],"db_active")
        places = await self.call("places_list")
        self.assertEqual(places["mode"],"db_active")
        self.assertEqual(len(places["places"]),2)
        self.assertEqual(await self.db.async_execute(lambda c:
            c.execute("SELECT count(*) FROM migration_finalization_items WHERE state='absence_verified'").fetchone()[0]),2)
        backups = await self.db.async_execute(lambda c:
            c.execute("SELECT source_json FROM migration_source_backups ORDER BY item_uid").fetchall())
        self.assertEqual(len(backups),2)
        self.assertEqual({json.loads(row[0])["summary"] for row in backups},{"Alpha","Beta"})
        self.assertTrue(all(json.loads(row[0])["description"].startswith("GEWITTERRADAR_PLACE_V1")
                            for row in backups))

    async def test_archived_and_active_legacy_places_survive_verified_cutover(self):
        # The real V4.14.5 operator list has both saved and removed places.
        # Neither must vanish or silently become an active monitored area.
        self.items[1]["status"] = "completed"
        preview = await self.call("migration_preview")
        self.assertEqual(preview["valid"], 2)
        self.assertEqual(preview["invalid"], 0)
        self.assertEqual({x["status"] for x in preview["candidates"]},
                         {"needs_action", "completed"})
        await self.imported()
        self.assertEqual(len(self.items), 2, "import must not remove Local To-do")
        # A profile-level archive exists BEFORE any source deletion.
        by_name = await self.db.async_execute(lambda c: [
            (row[0], row[1]) for row in c.execute(
                "SELECT l.name,CASE WHEN a.link_id IS NULL THEN 0 ELSE 1 END "
                "FROM locations l JOIN profile_links p ON p.location_id=l.location_id "
                "LEFT JOIN archived_profile_links a ON a.link_id=p.link_id "
                "ORDER BY l.name").fetchall()])
        self.assertEqual(by_name, [("Alpha", 0), ("Beta", 1)])
        approval = await self.approved()
        self.assertEqual(approval["item_count"], 2)
        self.assertEqual((await self.commit(approval))["mode"], "db_active")
        self.assertEqual(len(self.items), 0)
        places = (await self.call("places_list", {"include_archived": True}))["places"]
        self.assertEqual(len(places), 2)
        self.assertEqual({x["name"]: x["archived"] for x in places},
                         {"Alpha": False, "Beta": True})

    async def test_three_archived_same_name_coordinates_preserve_distinct_uids(self):
        # Mirrors the operator's legacy "ENTFERNTE ORTE: afrika" duplicates.
        self.items = [item("afrika", 34.17331, 3.28326) for _ in range(3)]
        for row in self.items:
            row["status"] = "completed"
        preview = await self.call("migration_preview")
        self.assertEqual(preview["valid"], 3)
        self.assertTrue(any(x.get("source_coordinate_duplicate") for x in preview["candidates"]))
        await self.imported()
        self.assertEqual(len(self.items), 3)
        approval = await self.approved()
        self.assertEqual(approval["item_count"], 3)
        self.assertEqual((await self.commit(approval))["mode"], "db_active")
        self.assertEqual(len(self.removed), 3)
        places = (await self.call("places_list", {"include_archived": True}))["places"]
        self.assertEqual(len(places), 3)
        self.assertTrue(all(x["archived"] for x in places))
        self.assertEqual(len({x["location_id"] for x in places}), 3)

    async def test_tampering_with_archived_link_blocks_source_deletion(self):
        self.items[1]["status"] = "completed"
        await self.imported()
        # The finalized data must preserve the archived state exactly.
        def corrupt(c):
            c.execute("DELETE FROM archived_profile_links")
        await self.db.async_execute(corrupt)
        with self.assertRaises(final_mod.FinalizationError) as err:
            await self.approved()
        self.assertEqual(err.exception.code, "migration_unverified_import")
        self.assertEqual(len(self.items), 2)
        self.assertEqual(self.removed, [])

    async def test_mixed_status_source_drift_blocks_finalization(self):
        self.items[1]["status"] = "completed"
        await self.imported()
        approval = await self.approved()
        self.items[1]["status"] = "needs_action"
        with self.assertRaises(final_mod.FinalizationError) as err:
            await self.commit(approval)
        self.assertEqual(err.exception.code, "migration_source_changed")
        self.assertEqual(self.removed, [])

    async def test_sqlite_archive_restore_profile_scope_and_idempotency(self):
        await self.imported()
        await self.commit(await self.approved())
        before = (await self.call("places_list"))["places"]
        self.assertEqual(len(before),2)
        place = before[0]
        reqid = uid()
        request = {"profile_id":self.profile,
                   "payload":{"location_id":place["location_id"]},
                   "request_id":reqid,"expected_revision":place["revision"]}
        archived = await self.api.dispatch(actor_user_id="alice",is_admin=False,
                                           op="location_archive",request=request)
        self.assertTrue(archived["archived"])
        self.assertEqual(archived,await self.api.dispatch(
            actor_user_id="alice",is_admin=False,op="location_archive",request=request))
        self.assertEqual(len((await self.call("places_list"))["places"]),1)
        all_places=(await self.call("places_list",{"include_archived":True}))["places"]
        self.assertEqual(len(all_places),2)
        self.assertEqual(sum(p["archived"] for p in all_places),1)
        self.assertEqual(await self.db.async_execute(lambda c:
            c.execute("SELECT count(*) FROM locations").fetchone()[0]),2)
        request["request_id"]=uid()
        restored=await self.api.dispatch(actor_user_id="alice",is_admin=False,
                                         op="location_restore",request=request)
        self.assertFalse(restored["archived"])
        self.assertEqual(len((await self.call("places_list"))["places"]),2)

    async def test_archive_isolated_to_profile_link(self):
        await self.imported()
        await self.commit(await self.approved())
        place = (await self.call("places_list"))["places"][0]
        other_profile=uid()
        self.vault.owners["alice"].add(other_profile)
        link_id=uid()
        def share_test_link(c):
            c.execute("INSERT INTO profile_links(link_id,location_id,ha_user_id,vault_profile_id)"
                      " VALUES(?,?,?,?)",
                      (link_id,place["location_id"],"alice",other_profile))
            c.execute("INSERT INTO profile_preferences(link_id) VALUES(?)",(link_id,))
        await self.db.async_execute(share_test_link)
        request={"profile_id":self.profile,"payload":{"location_id":place["location_id"]},
                 "request_id":uid(),"expected_revision":place["revision"]}
        await self.api.dispatch(actor_user_id="alice",is_admin=False,
                                op="location_archive",request=request)
        primary=(await self.call("places_list"))["places"]
        second=await self.api.dispatch(actor_user_id="alice",is_admin=False,
                   op="places_list",request={"profile_id":other_profile,"payload":{}})
        self.assertTrue(all(p["location_id"]!=place["location_id"] for p in primary))
        self.assertTrue(any(p["location_id"]==place["location_id"] for p in second["places"]))
        self.assertEqual(await self.db.async_execute(lambda c:
            c.execute("SELECT count(*) FROM archived_profile_links").fetchone()[0]),1)

    async def test_archive_disallowed_before_cutover(self):
        await self.imported()
        data=(await self.call("locations_list"))["locations"][0]
        request={"profile_id":self.profile,
                 "payload":{"location_id":data["location_id"]},
                 "request_id":uid(),"expected_revision":data["revision"]}
        with self.assertRaises(api_mod.ApiError) as exc:
            await self.api.dispatch(actor_user_id="alice",is_admin=False,
                                    op="location_archive",request=request)
        self.assertEqual(exc.exception.code,"migration_pending")
        self.assertEqual(await self.db.async_execute(lambda c:
            c.execute("SELECT count(*) FROM archived_profile_links").fetchone()[0]),0)

    async def test_admin_and_confirmation_required_without_deletion(self):
        await self.imported()
        with self.assertRaises(final_mod.FinalizationError):
            await self.call("migration_finalize_preview")
        approval = await self.approved()
        with self.assertRaises(final_mod.FinalizationError):
            await self.commit(approval,admin=False)
        self.assertEqual(len(self.items),2)
        self.assertEqual((await self.call("status"))["capabilities"]["saved_places_mode"],"migration_pending")

    async def test_skipped_item_and_changed_source_are_blocked(self):
        await self.imported(skip=True)
        with self.assertRaises(final_mod.FinalizationError):
            await self.approved()
        self.assertEqual(len(self.items),2)
        self.assertEqual(self.removed,[])

    async def test_stale_source_after_approval_cannot_delete(self):
        await self.imported()
        approval = await self.approved()
        self.items[0] = {**self.items[0],"summary":"Changed"}
        with self.assertRaises(final_mod.FinalizationError):
            await self.commit(approval)
        self.assertEqual(self.removed,[])
        self.assertEqual(len(self.items),2)

    async def test_partial_delete_recoverable_after_new_api_instance(self):
        await self.imported()
        approval = await self.approved()
        self.fail_once = True
        with self.assertRaises(final_mod.FinalizationError) as err:
            await self.commit(approval)
        self.assertEqual(err.exception.code,"migration_remove_uncertain")
        self.assertEqual(len(self.items),1)
        self.assertEqual((await self.call("status"))["capabilities"]["saved_places_mode"],"migration_pending")
        self.api = Api(self.db,self.vault,fetch_legacy_items=self.source,
                       remove_legacy_item=self.remove)
        resumed = await self.approved()
        self.assertTrue(resumed["resume"])
        result = await self.commit(resumed)
        self.assertEqual(result["mode"],"db_active")
        self.assertEqual(len(self.removed),2)
        self.assertEqual(len(self.items),0)

    async def test_removed_item_target_changed_after_restart_blocks_resume(self):
        await self.imported()
        self.fail_once = True
        with self.assertRaises(final_mod.FinalizationError):
            await self.commit(await self.approved())
        self.assertEqual(len(self.items),1)
        deleted_uid = self.removed[0]
        def corrupt_target(c):
            lid = c.execute(
                "SELECT location_id FROM migration_finalization_items WHERE item_uid=?",
                (deleted_uid,)).fetchone()[0]
            c.execute("UPDATE locations SET lat=lat+1 WHERE location_id=?", (lid,))
        await self.db.async_execute(corrupt_target)
        self.api = Api(self.db,self.vault,fetch_legacy_items=self.source,
                       remove_legacy_item=self.remove)
        with self.assertRaises(final_mod.FinalizationError) as error:
            await self.approved()
        self.assertEqual(error.exception.code,"migration_target_changed")
        self.assertEqual(self.removed,[deleted_uid])
        self.assertEqual((await self.call("status"))["capabilities"]["saved_places_mode"],
                         "migration_pending")

    async def test_removed_item_backup_tampering_blocks_resume(self):
        await self.imported()
        self.fail_once = True
        with self.assertRaises(final_mod.FinalizationError):
            await self.commit(await self.approved())
        removed_uid = self.removed[0]
        await self.db.async_execute(lambda c: c.execute(
            "UPDATE migration_source_backups SET source_json=? WHERE item_uid=?",
            (json.dumps({"uid":removed_uid,"summary":"tampered"}),removed_uid)).rowcount)
        self.api = Api(self.db,self.vault,fetch_legacy_items=self.source,
                       remove_legacy_item=self.remove)
        with self.assertRaises(final_mod.FinalizationError) as error:
            await self.approved()
        self.assertEqual(error.exception.code,"migration_backup_incomplete")
        self.assertEqual(len(self.removed),1)

    async def test_no_import_no_deletion_and_no_db_active(self):
        with self.assertRaises(final_mod.FinalizationError):
            await self.approved()
        self.assertEqual(len(self.items),2)
        self.assertEqual(self.removed,[])
        self.assertEqual((await self.call("status"))["capabilities"]["saved_places_mode"],"migration_pending")

    async def test_metadata_change_after_approval_cannot_delete(self):
        await self.imported()
        approval = await self.approved()
        self.items[0]["due"] = "2026-12-31"
        # A metadata edit invalidates the operator's confirmation even when
        # name/coordinates and the original MA-019 source digest are unchanged.
        with self.assertRaises(final_mod.FinalizationError):
            await self.commit(approval)
        self.assertEqual(self.removed,[])
        self.assertEqual(await self.db.async_execute(lambda c:
            c.execute("SELECT count(*) FROM migration_source_backups").fetchone()[0]),0)

    async def test_source_uid_summary_collision_fail_closed(self):
        await self.imported()
        self.items[0]["summary"] = self.items[1]["uid"]
        with self.assertRaises(final_mod.FinalizationError):
            await self.approved()
        self.assertEqual(self.removed,[])

    async def test_resume_approval_invalidated_by_external_removal(self):
        await self.imported()
        self.fail_once = True
        with self.assertRaises(final_mod.FinalizationError):
            await self.commit(await self.approved())
        self.api = Api(self.db,self.vault,fetch_legacy_items=self.source,
                       remove_legacy_item=self.remove)
        approval = await self.approved()
        self.items[0]["due"] = "2026-12-31"
        with self.assertRaises(final_mod.FinalizationError):
            await self.commit(approval)
        self.assertEqual(len(self.removed),1)
        self.assertEqual(len(self.items),1)
        self.assertEqual((await self.call("status"))["capabilities"]["saved_places_mode"],
                         "migration_pending")

    async def test_concurrent_confirmation_cannot_repeat_deletion(self):
        import asyncio
        await self.imported()
        first, second = await self.approved(), await self.approved()
        results = await asyncio.gather(self.commit(first),self.commit(second),
                                       return_exceptions=True)
        self.assertEqual(sum(isinstance(x,dict) and x.get("mode")=="db_active"
                             for x in results),1)
        self.assertEqual(len(self.removed),2)
        self.assertEqual(len(set(self.removed)),2)


if __name__ == "__main__":
    unittest.main(verbosity=2)
