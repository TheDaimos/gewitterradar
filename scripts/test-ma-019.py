"""MA-019: explicit source decisions, transaction and idempotency contracts."""
import importlib
import json
from pathlib import Path
import sys
import tempfile
import types
import unittest
from uuid import uuid4

root=Path(__file__).resolve().parents[1]
p=types.ModuleType("_ma019");p.__path__=[str(root/"custom_components/gewitterradar")]
sys.modules[p.__name__]=p
Database=importlib.import_module("_ma019.monitored_areas.storage.database").Database
api_module=importlib.import_module("_ma019.monitored_areas.api")
Api=api_module.Api

def uid():return str(uuid4())
def item(name,lat,lon):
    return {"uid":uid(),"summary":name,"status":"needs_action",
            "description":"GEWITTERRADAR_PLACE_V1\n"+json.dumps({
                "version":1,"name":name,"latitude":lat,"longitude":lon})}

class Vault:
    def __init__(self):self.owners={}
    async def async_profile_belongs_to(self,user,profile):
        return profile in self.owners.get(user,set())

class Tests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        base=Path(self.tmp.name)
        self.db=Database(base/"gewitterradar/monitored_areas/monitored_areas.sqlite3",config_root=base)
        await self.db.async_start()
        self.profile=uid();self.vault=Vault()
        self.vault.owners={"alice":{self.profile}}
        self.items=[item("Alpha",52,9),item("Beta",53,10)]
        self.source_reads=0
        async def source():
            self.source_reads+=1
            return list(self.items)
        self.api=Api(self.db,self.vault,fetch_legacy_items=source)
    async def asyncTearDown(self):
        await self.db.async_stop()
    async def call(self,op,payload=None,request_id=None,actor="alice",profile=None):
        request={"profile_id":profile or self.profile,"payload":payload or {}}
        if request_id:request["request_id"]=request_id
        return await self.api.dispatch(actor_user_id=actor,is_admin=False,op=op,request=request)
    async def preview(self):return await self.call("migration_preview")
    async def test_explicit_create_skip_is_atomic_idempotent_and_does_not_remove_todo(self):
        p=await self.preview()
        decision=[{"uid":self.items[0]["uid"],"action":"create"},
                  {"uid":self.items[1]["uid"],"action":"skip"}]
        rid=uid()
        result=await self.call("migration_commit",{"preview_id":p["preview_id"],"decisions":decision},rid)
        self.assertEqual(len(result["imported"]),1)
        self.assertTrue(result["legacy_preserved"])
        self.assertEqual(result["mode"],"migration_pending")
        self.assertEqual(len(self.items),2)
        self.assertEqual(await self.call("migration_commit",{"preview_id":p["preview_id"],"decisions":decision},rid),result)
        self.assertEqual(await self.db.async_execute(lambda c:c.execute("SELECT count(*) FROM locations").fetchone()[0]),1)
        self.assertEqual(await self.db.async_execute(lambda c:c.execute("SELECT count(*) FROM request_receipts").fetchone()[0]),1)
    async def test_changed_source_rejects_commit_without_write(self):
        p=await self.preview()
        self.items[0]["summary"]="Modified"
        dec=[{"uid":x["uid"],"action":"create"} for x in self.items]
        with self.assertRaises(api_module.ApiError) as err:
            await self.call("migration_commit",{"preview_id":p["preview_id"],"decisions":dec},uid())
        self.assertEqual(err.exception.code,"migration_preview_stale")
        self.assertEqual(await self.db.async_execute(lambda c:c.execute("SELECT count(*) FROM locations").fetchone()[0]),0)
    async def test_changed_database_rejects_stale_preview(self):
        p=await self.preview()
        await self.call("location_create",{"name":"Direct","lat":0,"lon":0},uid())
        dec=[{"uid":x["uid"],"action":"create"} for x in self.items]
        with self.assertRaises(api_module.ApiError):
            await self.call("migration_commit",{"preview_id":p["preview_id"],"decisions":dec},uid())
        self.assertEqual(await self.db.async_execute(lambda c:c.execute("SELECT count(*) FROM locations").fetchone()[0]),1)
    async def test_missing_decision_or_unauthorized_profile(self):
        p=await self.preview()
        with self.assertRaises(api_module.ApiError):
            await self.call("migration_commit",{"preview_id":p["preview_id"],
                                                 "decisions":[{"uid":self.items[0]["uid"],"action":"create"}]},uid())
        with self.assertRaises(PermissionError):
            await self.call("migration_commit",{"preview_id":p["preview_id"],"decisions":[]},
                            uid(),actor="bob")

if __name__=="__main__":
    unittest.main(verbosity=2)
