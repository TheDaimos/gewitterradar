"""MA-014: deletion is bounded by owner link, admin confirmation, revision and history."""
import importlib
from pathlib import Path
import sys
import tempfile
import types
import unittest
from uuid import uuid4

root=Path(__file__).resolve().parents[1]
p=types.ModuleType("_ma014");p.__path__=[str(root/"custom_components/gewitterradar")]
sys.modules[p.__name__]=p
db=importlib.import_module("_ma014.monitored_areas.storage.database")
repo=importlib.import_module("_ma014.monitored_areas.storage.repositories")
acl=importlib.import_module("_ma014.monitored_areas.permissions")

class Tests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.tmp=tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        root=Path(self.tmp.name).resolve()
        self.db=db.Database(root/"gewitterradar/monitored_areas/monitored_areas.sqlite3",config_root=root)
        await self.db.async_start()
        self.r=repo.Repositories(self.db)
        self.protect=acl.Protection(self.r)
        self.loc=str(uuid4());self.link=str(uuid4());self.profile=str(uuid4())
        await self.r.create_location(dict(location_id=self.loc,name="shared",lat=0,lon=0,created_at=1,updated_at=1),
            link=dict(link_id=self.link,location_id=self.loc,ha_user_id="owner",vault_profile_id=self.profile))
    async def asyncTearDown(self):
        await self.db.async_stop()
    async def test_last_link_denies_unconfirmed_non_admin_and_wrong_actor(self):
        kw=dict(link_id=self.link,location_id=self.loc,actor_user_id="owner",
                actor_profile_id=self.profile,expected_revision=1)
        with self.assertRaises(acl.ConfirmationRequired):
            await self.protect.remove_link(**kw)
        with self.assertRaises(PermissionError):
            await self.protect.preview_final_delete(actor_user_id="owner",is_admin=False,location_id=self.loc)
        proof=await self.protect.preview_final_delete(actor_user_id="owner",is_admin=True,location_id=self.loc)
        with self.assertRaises(acl.ConfirmationRequired):
            await self.protect.remove_link(**{**kw,"actor_user_id":"other"},is_admin=True,
                                           explicit_final=True,confirmation_nonce=proof.nonce)
        self.assertIsNotNone(await self.r.get_link(self.link))
    async def test_confirmation_and_atomic_final_delete(self):
        proof=await self.protect.preview_final_delete(actor_user_id="owner",is_admin=True,location_id=self.loc)
        response=await self.protect.remove_link(link_id=self.link,location_id=self.loc,
            actor_user_id="owner",actor_profile_id=self.profile,is_admin=True,
            explicit_final=True,confirmation_nonce=proof.nonce,expected_revision=1)
        self.assertTrue(response["deleted_location"])
        self.assertIsNone(await self.r.get_location(self.loc))
    async def test_existing_history_and_stale_revision_fail_closed(self):
        data=dict(report_id=str(uuid4()),location_id=self.loc,source_key="source",received_at=10,
            time_quality="unknown",strike_lat=0,strike_lon=0,location_lat=0,location_lon=0,
            distance_m=0,record_radius_m=10000,alarm_radius_m=10000,location_revision=1)
        await self.r.store_report(data)
        proof=await self.protect.preview_final_delete(actor_user_id="owner",is_admin=True,location_id=self.loc)
        with self.assertRaises(repo.ConstraintViolation):
            await self.protect.remove_link(link_id=self.link,location_id=self.loc,
                actor_user_id="owner",actor_profile_id=self.profile,is_admin=True,
                explicit_final=True,confirmation_nonce=proof.nonce,expected_revision=1)
        self.assertIsNotNone(await self.r.get_link(self.link))
        with self.assertRaises(repo.ConstraintViolation):
            await self.r.update_location(self.loc,1,{"lat":20,"updated_at":2})
    async def test_nonfinal_shared_unlink_retains_common_record(self):
        another=str(uuid4());other_profile=str(uuid4())
        await self.r.create_link(dict(link_id=another,location_id=self.loc,
            ha_user_id="other",vault_profile_id=other_profile))
        with self.assertRaises(repo.MissingRecord):
            await self.protect.remove_link(link_id=another,location_id=self.loc,
                actor_user_id="owner",actor_profile_id=self.profile,expected_revision=1)
        result=await self.protect.remove_link(link_id=self.link,location_id=self.loc,
            actor_user_id="owner",actor_profile_id=self.profile,expected_revision=1)
        self.assertFalse(result["deleted_location"])
        self.assertIsNotNone(await self.r.get_link(another))
        self.assertEqual((await self.r.get_location(self.loc))["revision"],2)

if __name__=="__main__":
    unittest.main(verbosity=2)
