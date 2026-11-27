"""MA-022: profile share/transfer + own preferences, with backend authorization."""
import importlib
from pathlib import Path
import sys
import tempfile
import types
import unittest
from uuid import uuid4

ROOT=Path(__file__).resolve().parents[1]
pkg=types.ModuleType("_ma022")
pkg.__path__=[str(ROOT/"custom_components/gewitterradar")]
sys.modules[pkg.__name__]=pkg
Database=importlib.import_module("_ma022.monitored_areas.storage.database").Database
api_mod=importlib.import_module("_ma022.monitored_areas.api")
Api=api_mod.Api

def uid():return str(uuid4())

class Vault:
    def __init__(self):self.owners={}
    async def async_profile_belongs_to(self,user,profile):
        return profile in self.owners.get(user,set())

class Profiles(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        tmp=tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        base=Path(tmp.name)
        self.db=Database(base/"gewitterradar/monitored_areas/monitored_areas.sqlite3",
                         config_root=base)
        await self.db.async_start()
        self.alice_profile=uid()
        self.bob_profile=uid()
        self.carol_profile=uid()
        self.vault=Vault()
        self.vault.owners={"alice":{self.alice_profile},
                           "bob":{self.bob_profile},
                           "carol":{self.carol_profile}}
        async def target_active(user):return user in self.vault.owners
        self.api=Api(self.db,self.vault,target_user_active=target_active)
    async def asyncTearDown(self):
        await self.db.async_stop()
    async def call(self,op,payload=None,*,actor="alice",profile=None,
                   request_id=None,revision=None):
        data={"profile_id":profile or getattr(self,actor+"_profile"),
              "payload":payload or {}}
        if request_id:data["request_id"]=request_id
        if revision is not None:data["expected_revision"]=revision
        return await self.api.dispatch(actor_user_id=actor,is_admin=False,
                                       op=op,request=data)
    async def create(self):
        result=await self.call("location_create",
                               {"name":"Havanna","lat":23.1136,"lon":-82.3666},
                               request_id=uid())
        return result["location"]["location_id"],result["link_id"]

    async def test_share_and_transfer_isolated_profiles(self):
        location,alice_link=await self.create()
        own=await self.call("links_list",{"location_id":location})
        self.assertEqual(own["own_link_id"],alice_link)
        self.assertEqual(own["shared_link_count"],1)
        with self.assertRaisesRegex(api_mod.ApiError,"not_found"):
            await self.call("preferences_get",{"location_id":location},actor="bob")
        prefs=(await self.call("preferences_get",{"location_id":location}))["preferences"]
        self.assertEqual(prefs["link_id"],alice_link)
        self.assertEqual(prefs["revision"],1)
        patched=(await self.call("preferences_update",
                {"link_id":alice_link,"quiet_minutes":20,
                 "notification_mode":"storm","push_enabled":1},
                request_id=uid(),revision=1))["preferences"]
        self.assertEqual(patched["quiet_minutes"],20)
        self.assertEqual(patched["revision"],2)
        with self.assertRaisesRegex(api_mod.ApiError,"not_found"):
            await self.call("preferences_get",{"location_id":location},actor="bob")
        with self.assertRaisesRegex(api_mod.ApiError,"target_is_source"):
            await self.call("links_share",{"location_id":location,
                "target_user_id":"alice","target_profile_id":self.alice_profile},
                revision=1,request_id=uid())
        shared=await self.call("links_share",{"location_id":location,
            "target_user_id":"bob","target_profile_id":self.bob_profile},
            revision=1,request_id=uid())
        self.assertEqual(shared["location_revision"],2)
        self.assertEqual((await self.call("links_list",{"location_id":location}))["shared_link_count"],2)
        b=(await self.call("preferences_get",{"location_id":location},actor="bob"))["preferences"]
        self.assertEqual(b["push_enabled"],0,"Personal settings must not leak on sharing")
        self.assertEqual(b["quiet_minutes"],15)
        with self.assertRaisesRegex(api_mod.ApiError,"revision_conflict"):
            await self.call("links_transfer",{"location_id":location,
                "target_user_id":"carol","target_profile_id":self.carol_profile},
                revision=1,request_id=uid())
        moved=await self.call("links_transfer",{"location_id":location,
            "target_user_id":"carol","target_profile_id":self.carol_profile},
            revision=2,request_id=uid())
        self.assertEqual(moved["location_revision"],3)
        with self.assertRaisesRegex(api_mod.ApiError,"not_found"):
            await self.call("links_list",{"location_id":location})
        self.assertEqual((await self.call("links_list",{"location_id":location},actor="bob"))["shared_link_count"],2)
        self.assertEqual((await self.call("links_list",{"location_id":location},actor="carol"))["shared_link_count"],2)

    async def test_denies_forged_target_and_own_preferences(self):
        location,link=await self.create()
        with self.assertRaisesRegex((api_mod.ApiError,ValueError),"profile_not_found"):
            await self.call("links_share",{"location_id":location,
                "target_user_id":"bob","target_profile_id":uid()},
                request_id=uid(),revision=1)
        with self.assertRaisesRegex((api_mod.ApiError,ValueError),"profile_not_found"):
            await self.call("links_share",{"location_id":location,
                "target_user_id":"removed","target_profile_id":uid()},
                request_id=uid(),revision=1)
        with self.assertRaisesRegex(api_mod.ApiError,"not_found"):
            await self.call("preferences_update",{"link_id":link,"quiet_minutes":25},
                actor="bob",revision=1,request_id=uid())
        fresh=await self.call("location_get",{"location_id":location})
        self.assertEqual(fresh["location"]["revision"],1)
        mine=await self.call("preferences_get",{"location_id":location})
        self.assertEqual(mine["preferences"]["quiet_minutes"],15)
        self.assertEqual((await self.call("links_list",{"location_id":location}))["shared_link_count"],1)

    async def test_receipt_replay_share_and_conflict(self):
        location,_=await self.create()
        request_id=uid()
        payload={"location_id":location,"target_user_id":"bob",
                 "target_profile_id":self.bob_profile}
        first=await self.call("links_share",payload,revision=1,request_id=request_id)
        second=await self.call("links_share",payload,revision=1,request_id=request_id)
        self.assertEqual(first,second,"same request must be idempotent")
        self.assertEqual((await self.call("links_list",{"location_id":location}))["shared_link_count"],2)
        with self.assertRaisesRegex(api_mod.ApiError,"request_conflict"):
            await self.call("links_share",{**payload,"target_profile_id":self.carol_profile},
                revision=1,request_id=request_id)

if __name__=="__main__":
    unittest.main(verbosity=2)
