"""MA-018 read-only Local To-do preview and inventory fingerprint contracts."""
import importlib
import json
from pathlib import Path
import sys
import tempfile
import types
import unittest
from uuid import uuid4

root=Path(__file__).resolve().parents[1]
p=types.ModuleType("_ma018");p.__path__=[str(root/"custom_components/gewitterradar")]
sys.modules[p.__name__]=p
Database=importlib.import_module("_ma018.monitored_areas.storage.database").Database
Api=importlib.import_module("_ma018.monitored_areas.api").Api
migration=importlib.import_module("_ma018.monitored_areas.migration")

def uid():return str(uuid4())
def item(name,lat,lon,*,status="needs_action",identifier=None):
    value=dict(version=1,name=name,latitude=lat,longitude=lon)
    return {"uid":identifier or uid(),"summary":name,"status":status,
            "description":"GEWITTERRADAR_PLACE_V1\n"+json.dumps(value)}

class Vault:
    def __init__(self):self.owners={}
    async def async_profile_belongs_to(self,user,profile):
        return profile in self.owners.get(user,set())

class Tests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        base=Path(self.temp.name)
        self.database=Database(base/"gewitterradar/monitored_areas/monitored_areas.sqlite3",config_root=base)
        await self.database.async_start()
        self.profile=uid();self.vault=Vault()
        self.vault.owners["alice"]={self.profile}
        self.items=[item("Alpha",52.1,9.1),item("Alpha duplicate",52.1,9.1),
                    item("Invalid",99,9.1),{"uid":uid(),"summary":"other","status":"needs_action","description":"not GR"}]
        async def fetch():return list(self.items)
        self.api=Api(self.database,self.vault,fetch_legacy_items=fetch)
    async def asyncTearDown(self):
        await self.database.async_stop()
    async def call(self,op,payload=None):
        return await self.api.dispatch(actor_user_id="alice",is_admin=False,op=op,
                                       request={"profile_id":self.profile,"payload":payload or {}})
    async def test_preview_is_read_only_and_flags_source_duplicates(self):
        before=await self.database.async_execute(lambda c:c.total_changes,kind="read")
        result=await self.call("migration_preview")
        self.assertEqual((result["valid"],result["invalid"]),(2,2))
        self.assertEqual(result["candidates"][1]["source_coordinate_duplicate"],self.items[0]["uid"])
        self.assertFalse(result["write_performed"])
        self.assertEqual(await self.database.async_execute(lambda c:c.total_changes,kind="read"),before)
        self.assertEqual((await self.call("migration_preview"))["preview_id"],result["preview_id"])
    async def test_source_or_db_changes_invalidate_fingerprint(self):
        old=await self.call("migration_preview")
        self.items.append(item("Added",1,2))
        changed=await self.call("migration_preview")
        self.assertNotEqual(old["preview_id"],changed["preview_id"])
        self.items.pop()
        # Actual location in the authorized DB changes preview baseline.
        await self.api.dispatch(actor_user_id="alice",is_admin=False,op="location_create",
            request={"profile_id":self.profile,"request_id":uid(),
                     "payload":{"name":"Alpha","lat":52.1,"lon":9.1}})
        next_state=await self.call("migration_preview")
        self.assertNotEqual(old["db_digest"],next_state["db_digest"])
        self.assertTrue(next_state["candidates"][0]["coordinate_matches"])
    async def test_foreign_profile_cannot_read_preview(self):
        with self.assertRaises(PermissionError):
            await self.api.dispatch(actor_user_id="bob",is_admin=True,op="migration_preview",
                request={"profile_id":self.profile,"payload":{}})
        with self.assertRaises(Exception):
            await self.call("migration_preview",{"items":self.items})
    async def test_no_source_fails_closed_not_empty_import(self):
        self.api=Api(self.database,self.vault)
        with self.assertRaises(Exception):
            await self.call("migration_preview")

if __name__=="__main__":
    unittest.main(verbosity=2)
