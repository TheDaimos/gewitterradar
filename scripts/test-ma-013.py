"""MA-013: untrusted profile IDs cannot authorize a shared location."""
import importlib
from pathlib import Path
import sys
import tempfile
import types
import unittest
from uuid import uuid4

root=Path(__file__).resolve().parents[1]
p=types.ModuleType("_ma013"); p.__path__=[str(root/"custom_components/gewitterradar")]
sys.modules[p.__name__]=p
db=importlib.import_module("_ma013.monitored_areas.storage.database")
repo=importlib.import_module("_ma013.monitored_areas.storage.repositories")
identity=importlib.import_module("_ma013.monitored_areas.identity")

class FakeVault:
    def __init__(self):
        self.owners={}
    async def async_profile_belongs_to(self,user,profile):
        return profile in self.owners.get(user,set())

class Tests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.tmp=tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        root=Path(self.tmp.name).resolve()
        self.db=db.Database(root/"gewitterradar/monitored_areas/monitored_areas.sqlite3",config_root=root)
        await self.db.async_start()
        self.r=repo.Repositories(self.db)
        self.vault=FakeVault()
        self.links=identity.Links(self.r,self.vault)
        self.loc=str(uuid4()); self.profile=str(uuid4()); self.other=str(uuid4())
        await self.r.create_location(dict(location_id=self.loc,name="shared",lat=0,lon=0,created_at=1,updated_at=1))
    async def asyncTearDown(self):
        await self.db.async_stop()
    async def test_fail_closed_missing_owner(self):
        with self.assertRaises(identity.ProfileNotVerified):
            await self.links.create(location_id=self.loc,target_user_id="owner",target_profile_id=self.profile)
        self.assertEqual(await self.db.async_execute(lambda c:c.execute("SELECT count(*) FROM profile_links").fetchone()[0]),0)
    async def test_owned_multiple_profiles_and_private_read(self):
        self.vault.owners={"owner":{self.profile},"other":{self.other}}
        first=await self.links.create(location_id=self.loc,target_user_id="owner",target_profile_id=self.profile)
        second=await self.links.create(location_id=self.loc,target_user_id="other",target_profile_id=self.other)
        self.assertNotEqual(first["link_id"],second["link_id"])
        self.assertEqual((await self.links.get_verified_link(first["link_id"],actor_user_id="owner",actor_profile_id=self.profile))["location_id"],self.loc)
        with self.assertRaises(identity.ProfileNotVerified):
            await self.links.get_verified_link(first["link_id"],actor_user_id="other",actor_profile_id=self.other)
        with self.assertRaises(repo.ConstraintViolation):
            await self.links.create(location_id=self.loc,target_user_id="owner",target_profile_id=self.profile)
        self.assertEqual(await self.db.async_execute(lambda c:c.execute("SELECT count(*) FROM locations").fetchone()[0]),1)
    async def test_missing_port_not_authorized(self):
        self.links=identity.Links(self.r,object())
        with self.assertRaises(identity.ProfileNotVerified):
            await self.links.require_profile("owner",self.profile)

if __name__=="__main__":
    unittest.main(verbosity=2)
