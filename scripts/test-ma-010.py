"""MA-010 real worker transactions, conflict and consistent backup tests."""
import asyncio
import importlib
from pathlib import Path
import sqlite3
import sys
import tempfile
import types
import unittest
from uuid import uuid4

root = Path(__file__).resolve().parents[1]
parent = types.ModuleType("_ma010")
parent.__path__ = [str(root/"custom_components/gewitterradar")]
sys.modules[parent.__name__] = parent
db = importlib.import_module("_ma010.monitored_areas.storage.database")
repo = importlib.import_module("_ma010.monitored_areas.storage.repositories")

def uid(): return str(uuid4())

class Tests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root=Path(self.temp.name).resolve()
        self.path=self.root/"gewitterradar/monitored_areas/monitored_areas.sqlite3"
        self.db=db.Database(self.path,config_root=self.root)
        await self.db.async_start()
        self.r=repo.Repositories(self.db)
        self.loc=uid()
        self.link=uid()

    async def asyncTearDown(self):
        await self.db.async_stop()

    def location(self, key=None):
        return dict(location_id=key or self.loc,name="test",lat=0,lon=0,created_at=1,updated_at=1)

    def profile(self):
        return dict(link_id=self.link,location_id=self.loc,ha_user_id="user",vault_profile_id="profile")

    def report(self, **kwargs):
        return dict(dict(report_id=uid(),location_id=self.loc,source_key="source",replay_key="replay",observed_at=None,received_at=1,time_quality="unknown",strike_lat=0,strike_lon=0,location_lat=0,location_lon=0,distance_m=0,record_radius_m=10000,alarm_radius_m=10000,location_revision=1),**kwargs)

    async def test_create_atomic_and_preferences(self):
        with self.assertRaises(repo.ConstraintViolation):
            await self.r.create_location(self.location(),link=self.profile(),preferences=dict(link_id=self.link,quiet_minutes=16))
        self.assertIsNone(await self.r.get_location(self.loc))
        loc=await self.r.create_location(self.location(),link=self.profile())
        self.assertEqual(await self.r.get_location(self.loc),loc)
        changed=await self.r.update_preferences(self.link,1,dict(push_enabled=1))
        self.assertEqual(changed["revision"],2)
        self.assertEqual(await self.r.get_location(self.loc),loc)
        with self.assertRaises(repo.ConstraintViolation):
            await self.r.create_link(dict(self.profile(),link_id=uid()))
        targets=[dict(link_id=self.link,target_key="one")]
        self.assertEqual((await self.r.replace_notification_targets(self.link,2,targets))["revision"],3)
        with self.assertRaises(repo.ConstraintViolation):
            await self.r.replace_notification_targets(self.link,3,targets*2)
        self.assertEqual((await self.r.get_preferences(self.link))["revision"],3)

    async def test_concurrent_revision(self):
        await self.r.create_location(self.location())
        results=await asyncio.gather(*(self.r.update_location(self.loc,1,dict(name=str(i),updated_at=2)) for i in range(2)),return_exceptions=True)
        self.assertEqual(sum(isinstance(x,repo.RevisionConflict) for x in results),1)
        self.assertEqual((await self.r.get_location(self.loc))["revision"],2)
        with self.assertRaises(ValueError):
            await self.r.update_location(self.loc,2,{"name=1; DROP TABLE locations":1})
        self.assertEqual((await self.r.update_location(self.loc,2,dict(name="valid",updated_at=3)))["revision"],3)

    async def test_reports_sessions_replay_and_rollback(self):
        await self.r.create_location(self.location())
        other=uid()
        await self.r.create_location(self.location(other))
        session=uid()
        await self.r.create_session(dict(session_id=session,location_id=other,started_at=1,last_event_at=1))
        data=self.report()
        with self.assertRaises(repo.ConstraintViolation):
            await self.r.store_report(data,session_id=session,session_revision=1,session_values=dict(event_count=1))
        self.assertIsNone(await self.r.get_report(data["report_id"]))
        session=uid()
        await self.r.create_session(dict(session_id=session,location_id=self.loc,started_at=1,last_event_at=1))
        result=await self.r.store_report(data,session_id=session,session_revision=1,session_values=dict(event_count=1))
        self.assertTrue(result["inserted"])
        self.assertEqual(result["session"]["revision"],2)
        replay=await self.r.store_report(dict(data,report_id=uid(),received_at=2))
        self.assertFalse(replay["inserted"])
        self.assertEqual(replay["report"],result["report"])
        with self.assertRaises(repo.ReplayConflict):
            await self.r.store_report(dict(data,strike_lat=1))
        second=self.report(replay_key=None)
        with self.assertRaises(repo.RevisionConflict):
            await self.r.store_report(second,session_id=session,session_revision=1,session_values=dict(event_count=2))
        self.assertIsNone(await self.r.get_report(second["report_id"]))
        await self.r.store_report(second)
        a,b=sorted((data["report_id"],second["report_id"]))
        await self.r.record_possible_duplicate(dict(location_id=self.loc,report_a=a,report_b=b,reason="candidate",rule_version=1))
        with self.assertRaises(repo.ConstraintViolation):
            await self.r.update_location(self.loc,1,dict(lat=1,updated_at=2))

    async def test_tracker_gap_checkpoint(self):
        await self.r.create_location(self.location())
        await self.r.create_tracker(dict(location_id=self.loc,stable_slug="test",unique_id="ma_"+self.loc+"_tracker",display_name="test"))
        tracker=await self.r.update_tracker(self.loc,1,dict(actual_entity_id="device_tracker.test"))
        self.assertEqual(tracker["lifecycle_state"],"pending")
        gap=uid()
        await self.r.create_gap(dict(gap_id=gap,source_key="source",location_id=self.loc,started_at=1,cause="test"))
        self.assertEqual((await self.r.close_gap(gap,2))["ended_at"],2)
        with self.assertRaises(repo.RevisionConflict):
            await self.r.close_gap(gap,3)
        await self.r.update_checkpoint(expected_generation=None,last_observed_at=None,clean_shutdown=0,generation=0)
        await self.r.update_checkpoint(expected_generation=0,last_observed_at=2,clean_shutdown=1,generation=1)
        with self.assertRaises(repo.RevisionConflict):
            await self.r.update_checkpoint(expected_generation=0,last_observed_at=3,clean_shutdown=0,generation=2)

    async def test_backup_reopen(self):
        await self.r.create_location(self.location(),link=self.profile())
        expected=await self.r.update_location(self.loc,1,dict(name="changed",updated_at=2))
        backup=self.root/"test-backup.sqlite3"
        def snapshot(c):
            with sqlite3.connect(backup) as target:
                c.backup(target)
        await self.db.async_execute(snapshot)
        await self.db.async_stop()
        with self.assertRaises(db.DatabaseUnavailable):
            await self.r.get_location(self.loc)
        await self.db.async_start()
        self.assertEqual(await self.r.get_location(self.loc),expected)
        await self.db.async_stop()
        def verify():
            with sqlite3.connect(backup) as c:
                self.assertEqual(c.execute("PRAGMA integrity_check").fetchall(),[("ok",)])
                self.assertEqual(c.execute("PRAGMA foreign_key_check").fetchall(),[])
                self.assertEqual(c.execute("PRAGMA user_version").fetchone(),(3,))
                self.assertEqual(c.execute("SELECT name,revision FROM locations").fetchone(),("changed",2))
        await asyncio.to_thread(verify)

if __name__=="__main__":
    unittest.main(verbosity=2)
