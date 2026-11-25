"""MA-015 authenticated service contracts: scoped access, idempotency, and v3→v4."""
import importlib
from pathlib import Path
import sqlite3
import sys
import tempfile
import types
import unittest
from unittest.mock import patch
from uuid import uuid4

root=Path(__file__).resolve().parents[1]
p=types.ModuleType("_ma015");p.__path__=[str(root/"custom_components/gewitterradar")]
sys.modules[p.__name__]=p
db=importlib.import_module("_ma015.monitored_areas.storage.database")
repos=importlib.import_module("_ma015.monitored_areas.storage.repositories")
api=importlib.import_module("_ma015.monitored_areas.api")
schema=importlib.import_module("_ma015.monitored_areas.storage.schema")


def uid():return str(uuid4())

class Vault:
    def __init__(self):
        self.owners={}
    async def async_profile_belongs_to(self,user,profile):
        return profile in self.owners.get(user,set())

class Tests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        root=Path(self.temp.name).resolve()
        self.db=db.Database(root/"gewitterradar/monitored_areas/monitored_areas.sqlite3",config_root=root)
        await self.db.async_start()
        self.vault=Vault()
        self.alice=uid();self.bob=uid()
        self.vault.owners={"alice":{self.alice},"bob":{self.bob}}
        async def active(user):
            return user in ("alice","bob")
        self.api=api.Api(self.db,self.vault,target_user_active=active)
    async def asyncTearDown(self):
        await self.db.async_stop()
    async def call(self,op,payload=None,*,actor="alice",profile=None,expected=None,request_id=None,admin=False):
        r={"profile_id":profile or (self.alice if actor=="alice" else self.bob),
           "payload":payload or {}}
        if expected is not None:r["expected_revision"]=expected
        if request_id is not None:r["request_id"]=request_id
        return await self.api.dispatch(actor_user_id=actor,is_admin=admin,op=op,request=r)
    async def create(self):
        return await self.call("location_create",dict(name="A",lat=52.5,lon=9.1),request_id=uid())
    async def test_v4_receipt_atomic_idempotency_and_conflict(self):
        request=uid()
        first=await self.call("location_create",dict(name="A",lat=52.5,lon=9.1),request_id=request)
        again=await self.call("location_create",dict(name="A",lat=52.5,lon=9.1),request_id=request)
        self.assertEqual(first,again)
        with self.assertRaises(api.ApiError) as cm:
            await self.call("location_create",dict(name="Other",lat=52.5,lon=9.1),request_id=request)
        self.assertEqual(cm.exception.code,"request_conflict")
        self.assertEqual(await self.db.async_execute(lambda c:c.execute("SELECT count(*) FROM locations").fetchone()[0]),1)
        self.assertEqual(await self.db.async_execute(lambda c:c.execute("SELECT count(*) FROM request_receipts").fetchone()[0]),1)
    async def test_private_read_and_verified_profile(self):
        result=await self.create()
        loc=result["location"]["location_id"]
        self.assertEqual(len((await self.call("locations_list"))["locations"]),1)
        self.assertEqual(len((await self.call("locations_list",actor="bob"))["locations"]),0)
        with self.assertRaises(api.ApiError) as cm:
            await self.call("location_get",{"location_id":loc},actor="bob")
        self.assertEqual(cm.exception.code,"not_found")
        with self.assertRaises(api.ProfileNotVerified):
            await self.call("locations_list",profile=self.bob)
        with self.assertRaises(api.ApiError):
            await self.call("status",actor="")
    async def test_revision_and_personal_preferences(self):
        first=await self.create(); loc=first["location"]["location_id"]
        update=await self.call("location_update",{"location_id":loc,"name":"Renamed"},expected=1,request_id=uid())
        self.assertEqual(update["location"]["revision"],2)
        with self.assertRaises(repos.RevisionConflict):
            await self.call("location_update",{"location_id":loc,"name":"stale"},expected=1,request_id=uid())
        pref=await self.call("preferences_update",{"link_id":first["link_id"],"push_enabled":1},expected=1,request_id=uid())
        self.assertEqual(pref["preferences"]["revision"],2)
        self.assertEqual((await self.call("location_get",{"location_id":loc}))["location"]["revision"],2)
    async def test_share_and_transfer_requires_target_vault(self):
        first=await self.create();loc=first["location"]["location_id"]
        bad_user=uid()
        with self.assertRaises(api.ApiError):
            await self.call("links_share",{"location_id":loc,"target_user_id":"unknown",
                "target_profile_id":bad_user},expected=1,request_id=uid())
        with self.assertRaises(api.ProfileNotVerified):
            await self.call("links_share",{"location_id":loc,"target_user_id":"bob",
                "target_profile_id":bad_user},expected=1,request_id=uid())
        shared=await self.call("links_share",{"location_id":loc,"target_user_id":"bob",
            "target_profile_id":self.bob},expected=1,request_id=uid())
        self.assertEqual(shared["location_revision"],2)
        self.assertEqual(len((await self.call("locations_list",actor="bob"))["locations"]),1)
        with self.assertRaises(repos.ConstraintViolation):
            await self.call("links_share",{"location_id":loc,"target_user_id":"bob",
                "target_profile_id":self.bob},expected=2,request_id=uid())
    async def test_last_link_admin_confirmation_and_receipt(self):
        first=await self.create();loc=first["location"]["location_id"]
        with self.assertRaises(api.ApiError):
            await self.call("links_remove",{"location_id":loc,"link_id":first["link_id"]},expected=1,request_id=uid())
        with self.assertRaises(api.ApiError):
            await self.call("links_remove_preview",{"location_id":loc,"link_id":first["link_id"]})
        proof=await self.call("links_remove_preview",{"location_id":loc,"link_id":first["link_id"]},admin=True)
        rid=uid()
        payload={"location_id":loc,"link_id":first["link_id"],"explicit_final":True,"confirmation_nonce":proof["nonce"]}
        removed=await self.call("links_remove",payload,expected=1,request_id=rid,admin=True)
        self.assertTrue(removed["location_deleted"])
        self.assertEqual(await self.call("links_remove",payload,expected=1,request_id=rid,admin=True),removed)
    async def test_v3_to_v4_rollback_preserves_data(self):
        c=sqlite3.connect(":memory:",isolation_level=None)
        self.addCleanup(c.close)
        c.execute("PRAGMA foreign_keys=ON")
        for ddl in (*schema.DDL_V1.values(),*schema.DDL_V2_ADDITIONS.values(),*schema.DDL_V3_ADDITIONS.values()):
            c.execute(ddl)
        c.execute("PRAGMA user_version=3")
        loc=uid()
        c.execute("INSERT INTO locations(location_id,name,lat,lon,created_at,updated_at) VALUES(?,?,?,?,?,?)",
                  (loc,"kept",0,0,1,1))
        with patch.dict(schema.DDL_V4_ADDITIONS,{"invalid":"NOT SQL"}):
            with self.assertRaises(sqlite3.DatabaseError):schema.initialize_schema(c)
        self.assertEqual(c.execute("PRAGMA user_version").fetchone(),(3,))
        self.assertEqual(c.execute("SELECT name FROM locations").fetchone(),("kept",))
        schema.initialize_schema(c)
        self.assertEqual(c.execute("PRAGMA user_version").fetchone(),(4,))
        self.assertEqual(c.execute("SELECT name FROM locations").fetchone(),("kept",))


if __name__=="__main__":
    unittest.main(verbosity=2)
