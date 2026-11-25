"""P02 T2: adversarial integration tests for real SQLite + scoped API."""
import importlib
from pathlib import Path
import sys
import tempfile
import types
import unittest
from uuid import uuid4

root=Path(__file__).resolve().parents[1]
p=types.ModuleType("_p02t2")
p.__path__=[str(root/"custom_components/gewitterradar")]
sys.modules[p.__name__]=p
db=importlib.import_module("_p02t2.monitored_areas.storage.database")
api=importlib.import_module("_p02t2.monitored_areas.api")
repository=importlib.import_module("_p02t2.monitored_areas.storage.repositories")

def uid():return str(uuid4())

class Vault:
    def __init__(self):self.owners={"alice":set(),"bob":set()}
    async def async_profile_belongs_to(self,user,profile):
        return profile in self.owners.get(user,set())

class Tests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        root=Path(self.temp.name)
        self.database=db.Database(root/"gewitterradar/monitored_areas/monitored_areas.sqlite3",config_root=root)
        await self.database.async_start()
        self.vault=Vault()
        self.alice=uid();self.bob=uid()
        self.vault.owners["alice"].add(self.alice)
        self.vault.owners["bob"].add(self.bob)
        async def active(u):return u in ("alice","bob")
        self.svc=api.Api(self.database,self.vault,target_user_active=active)
    async def asyncTearDown(self):
        await self.database.async_stop()
    async def call(self,op,payload=None,*,actor="alice",profile=None,rid=None,rev=None,admin=False):
        req={"profile_id":profile or (self.alice if actor=="alice" else self.bob),"payload":payload or {}}
        if rid:req["request_id"]=rid
        if rev is not None:req["expected_revision"]=rev
        return await self.svc.dispatch(actor_user_id=actor,is_admin=admin,op=op,request=req)
    async def create(self):
        return await self.call("location_create",{"name":"Private","lat":1,"lon":2},rid=uid())
    async def test_receipt_replay_after_link_revocation_must_not_leak_private_result(self):
        created=await self.create();lid=created["location"]["location_id"]
        share=await self.call("links_share",{"location_id":lid,"target_user_id":"bob","target_profile_id":self.bob},rid=uid(),rev=1)
        rid=uid()
        payload={"location_id":lid,"name":"Secret Name"}
        result=await self.call("location_update",payload,rid=rid,rev=2,actor="alice")
        self.assertEqual(result["location"]["name"],"Secret Name")
        # Revoke Alice while her HA login and Vault profile still exist.
        await self.svc._repo._write(lambda c:(
            c.execute("DELETE FROM notification_targets WHERE link_id=?",(created["link_id"],)),
            c.execute("DELETE FROM profile_preferences WHERE link_id=?",(created["link_id"],)),
            c.execute("DELETE FROM profile_links WHERE link_id=?",(created["link_id"],))))
        with self.assertRaises(api.ApiError) as caught:
            await self.call("location_update",payload,rid=rid,rev=2,actor="alice")
        self.assertIn(caught.exception.code,("not_found","forbidden","authorization_revoked"))
    async def test_receipt_after_vault_revocation_is_inaccessible(self):
        rid=uid()
        await self.call("location_create",{"name":"Secret","lat":0,"lon":0},rid=rid)
        self.vault.owners["alice"].clear()
        with self.assertRaises(api.ProfileNotVerified):
            await self.call("location_create",{"name":"Secret","lat":0,"lon":0},rid=rid)
    async def test_changed_report_identity_same_count_invalidates_reset_nonce(self):
        created=await self.create();lid=created["location"]["location_id"]
        def insert(c,ident):
            c.execute("""INSERT INTO lightning_reports
                (report_id,location_id,source_key,received_at,time_quality,strike_lat,strike_lon,
                 location_lat,location_lon,distance_m,record_radius_m,alarm_radius_m,location_revision)
                 VALUES(?,?, 'synthetic',1,'unknown',1,2,1,2,0,10000,10000,1)""",(ident,lid))
        first=uid()
        await self.svc._repo._write(lambda c:insert(c,first))
        preview=await self.call("history_reset_preview",{"location_id":lid},admin=True)
        replacement=uid()
        await self.svc._repo._write(lambda c:(c.execute("DELETE FROM lightning_reports WHERE report_id=?",(first,)),insert(c,replacement)))
        with self.assertRaises(api.ApiError) as caught:
            await self.call("history_reset_commit",{"location_id":lid,"confirmation_nonce":preview["nonce"],"explicit_final":True},rid=uid(),rev=1,admin=True)
        self.assertIn(caught.exception.code,("confirmation_stale","revision_conflict"))
        self.assertEqual(await self.database.async_execute(lambda c:c.execute("SELECT report_id FROM lightning_reports").fetchone()[0],kind="read"),replacement)
    async def test_receipt_conflict_preserves_other_actor_scope(self):
        one=await self.create();lid=one["location"]["location_id"]
        await self.call("links_share",{"location_id":lid,"target_user_id":"bob","target_profile_id":self.bob},rid=uid(),rev=1)
        request_id=uid()
        a=await self.call("location_update",{"location_id":lid,"name":"A"},rid=request_id,rev=2)
        b=await self.call("location_update",{"location_id":lid,"name":"B"},rid=request_id,rev=3,actor="bob")
        self.assertNotEqual(a["location"]["name"],b["location"]["name"])
    async def test_admin_receipt_replay_revoked_admin_role_denied(self):
        created=await self.create()
        lid=created["location"]["location_id"]
        proof=await self.call("history_reset_preview",{"location_id":lid},admin=True)
        rid=uid()
        payload={"location_id":lid,"confirmation_nonce":proof["nonce"],"explicit_final":True}
        result=await self.call("history_reset_commit",payload,rid=rid,rev=1,admin=True)
        self.assertTrue(result["reset"])
        with self.assertRaises(api.ApiError) as caught:
            await self.call("history_reset_commit",payload,rid=rid,rev=1,admin=False)
        self.assertEqual(caught.exception.code,"forbidden")

    async def test_nonce_bound_to_vault_profile_even_same_ha_user(self):
        created=await self.create()
        lid=created["location"]["location_id"]
        alternate=uid()
        self.vault.owners["alice"].add(alternate)
        await self.call("links_share",{"location_id":lid,"target_user_id":"alice",
             "target_profile_id":alternate},rid=uid(),rev=1)
        proof=await self.call("history_reset_preview",{"location_id":lid},admin=True)
        with self.assertRaises(api.ApiError) as caught:
            await self.call("history_reset_commit",
                {"location_id":lid,"confirmation_nonce":proof["nonce"],"explicit_final":True},
                profile=alternate,rid=uid(),rev=2,admin=True)
        self.assertEqual(caught.exception.code,"confirmation_stale")

    async def test_concurrent_same_receipt_is_single_mutation(self):
        import asyncio
        rid=uid()
        request={"name":"Concurrent","lat":0,"lon":0}
        first,second=await asyncio.gather(
            self.call("location_create",request,rid=rid),
            self.call("location_create",request,rid=rid))
        self.assertEqual(first,second)
        self.assertEqual(await self.database.async_execute(
            lambda c:c.execute("SELECT count(*) FROM locations").fetchone()[0],kind="read"),1)
        self.assertEqual(await self.database.async_execute(
            lambda c:c.execute("SELECT count(*) FROM request_receipts").fetchone()[0],kind="read"),1)

    async def test_storage_restart_preserves_receipt_and_fk(self):
        result=await self.create()
        self.assertEqual(await self.database.async_execute(lambda c:c.execute("PRAGMA user_version").fetchone()[0],kind="read"),4)
        self.assertEqual(await self.database.async_execute(lambda c:c.execute("PRAGMA foreign_keys").fetchone()[0],kind="read"),1)
        await self.database.async_stop()
        await self.database.async_start()
        self.assertIsNotNone(await self.svc._repo.get_location(result["location"]["location_id"]))

if __name__=="__main__":
    unittest.main(verbosity=2)
