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
        # The base import digest ignores due dates; the full-fidelity per-item
        # source backup must still protect this field before any removal.
        await self.commit(approval)
        self.assertEqual(await self.db.async_execute(lambda c:
            c.execute("SELECT count(*) FROM migration_source_backups").fetchone()[0]),2)

    async def test_source_uid_summary_collision_fail_closed(self):
        await self.imported()
        self.items[0]["summary"] = self.items[1]["uid"]
        with self.assertRaises(final_mod.FinalizationError):
            await self.approved()
        self.assertEqual(self.removed,[])


if __name__ == "__main__":
    unittest.main(verbosity=2)
