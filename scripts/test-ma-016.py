"""MA-016: bounded SQLite places reader, no legacy cutover and no ACL leaks."""
import importlib
from pathlib import Path
import sys
import tempfile
import types
import unittest
from uuid import uuid4

root=Path(__file__).resolve().parents[1]
p=types.ModuleType("_ma016");p.__path__=[str(root/"custom_components/gewitterradar")]
sys.modules[p.__name__]=p
Database=importlib.import_module("_ma016.monitored_areas.storage.database").Database
Api=importlib.import_module("_ma016.monitored_areas.api").Api
ApiError=importlib.import_module("_ma016.monitored_areas.api").ApiError

def uuid():return str(uuid4())

class Vault:
    def __init__(self):self.owners={}
    async def async_profile_belongs_to(self,user,profile):
        return profile in self.owners.get(user,set())

class Tests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.tmp=tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        path=Path(self.tmp.name)
        self.db=Database(path/"gewitterradar/monitored_areas/monitored_areas.sqlite3",config_root=path)
        await self.db.async_start()
        self.owner=uuid();self.other=uuid();self.vault=Vault()
        self.vault.owners={"alice":{self.owner},"bob":{self.other}}
        self.api=Api(self.db,self.vault)
    async def asyncTearDown(self):
        await self.db.async_stop()
    async def dispatch(self,actor,profile,op,payload=None):
        req={"profile_id":profile,"payload":payload or {}}
        if op=="location_create":req["request_id"]=uuid()
        return await self.api.dispatch(actor_user_id=actor,is_admin=False,op=op,request=req)
    async def create(self,name,actor="alice",profile=None):
        return await self.dispatch(actor,profile or self.owner,"location_create",{
            "name":name,"lat":53.5,"lon":9.5})
    async def test_substring_filter_and_stable_paging(self):
        a=await self.create("Berlin West")
        b=await self.create("Berlin East")
        await self.create("Hamburg")
        r=await self.dispatch("alice",self.owner,"places_list",{"query":"berlin","limit":1})
        self.assertEqual(r["mode"],"migration_pending")
        self.assertEqual(len(r["places"]),1)
        self.assertTrue(r["next_cursor"])
        r2=await self.dispatch("alice",self.owner,"places_list",{"query":"berlin","cursor":r["next_cursor"],"limit":1})
        self.assertEqual(len(r2["places"]),1)
        self.assertIsNone(r2["next_cursor"])
        self.assertEqual({x["location_id"] for x in r["places"]+r2["places"]},
                         {a["location"]["location_id"],b["location"]["location_id"]})
        self.assertEqual(r["places"][0]["provider"],"monitored_areas_sqlite")
    async def test_escaped_wildcards_and_inaccessible_cursor(self):
        wild=await self.create("100% Rain")
        await self.create("1000 Rain")
        r=await self.dispatch("alice",self.owner,"places_list",{"query":"100%"})
        self.assertEqual([x["location_id"] for x in r["places"]],[wild["location"]["location_id"]])
        foreign=await self.create("private",actor="bob",profile=self.other)
        self.assertEqual((await self.dispatch("alice",self.owner,"places_list"))["mode"],"migration_pending")
        with self.assertRaises(ApiError):
            await self.dispatch("alice",self.owner,"places_list",
                    {"cursor":foreign["location"]["location_id"]})
        self.assertEqual((await self.dispatch("bob",self.other,"places_list",
                    {"query":"100%"}))["places"],[])
    async def test_invalid_queries_and_revoked_vault(self):
        for payload in ({"query":23},{"query":"x"*121},{"limit":0},{"limit":True},
                        {"cursor":"invalid"},{"unexpected":"field"}):
            with self.assertRaises(ApiError):
                await self.dispatch("alice",self.owner,"places_list",payload)
        self.vault.owners["alice"].clear()
        with self.assertRaises(PermissionError):
            await self.dispatch("alice",self.owner,"places_list")
    async def test_read_does_not_mutate_legacy_or_sqlite(self):
        await self.create("Saved")
        initial=await self.db.async_execute(lambda c:c.total_changes,kind="read")
        await self.dispatch("alice",self.owner,"places_list",{"query":"saved"})
        self.assertEqual(await self.db.async_execute(lambda c:c.total_changes,kind="read"),initial)
        self.assertEqual((await self.dispatch("alice",self.owner,"status"))["capabilities"]["saved_places_mode"],"migration_pending")

if __name__=="__main__":
    unittest.main(verbosity=2)
