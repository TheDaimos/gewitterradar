"""P01 cross-boundary integration gate: real files, worker, repositories, restart."""
import asyncio
import importlib
from pathlib import Path
import sqlite3
import sys
import tempfile
import threading
import types
import unittest
from unittest.mock import patch
from uuid import uuid4

root=Path(__file__).resolve().parents[1]
parent=types.ModuleType("_p01")
parent.__path__=[str(root/"custom_components/gewitterradar")]
sys.modules[parent.__name__]=parent
ma=importlib.import_module("_p01.monitored_areas")
schema=importlib.import_module("_p01.monitored_areas.storage.schema")
db=importlib.import_module("_p01.monitored_areas.storage.database")
repo=importlib.import_module("_p01.monitored_areas.storage.repositories")
errors=importlib.import_module("_p01.monitored_areas.storage.errors")

def uid(): return str(uuid4())

class Gate(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root=Path(self.temp.name).resolve()
        self.path=self.root/"gewitterradar/monitored_areas/monitored_areas.sqlite3"
        self.store=db.Database(self.path,config_root=self.root,queue_size=4)
        self.r=repo.Repositories(self.store)
        self.loc,self.link=uid(),uid()

    async def asyncTearDown(self):
        try: await self.store.async_stop()
        except errors.StorageError: pass

    def location(self,loc=None):
        return dict(location_id=loc or self.loc,name="fixture",lat=12,lon=34,created_at=1,updated_at=1)

    def profile(self):
        return dict(link_id=self.link,location_id=self.loc,ha_user_id="synthetic",vault_profile_id="test")

    def report(self,**kw):
        return dict(dict(report_id=uid(),location_id=self.loc,source_key="source-a",replay_key="stable",observed_at=None,received_at=10,time_quality="unknown",strike_lat=12,strike_lon=34,location_lat=12,location_lon=34,distance_m=0,record_radius_m=10000,alarm_radius_m=10000,location_revision=1),**kw)

    async def snapshot(self):
        return await self.store.async_execute(lambda c: {name:c.execute("SELECT * FROM "+name+" ORDER BY 1").fetchall() for name in schema.DDL if schema.DDL[name].startswith("CREATE TABLE")})

    async def test_end_to_end_restart_and_off(self):
        await self.store.async_start()
        worker=self.store._thread
        await self.store.async_start()
        self.assertIs(self.store._thread,worker)
        self.assertEqual(await self.store.async_execute(lambda c:tuple(c.execute("PRAGMA "+p).fetchone()[0] for p in ("foreign_keys","journal_mode","synchronous","user_version"))),(1,"wal",2,9))
        self.assertNotEqual(await self.store.async_execute(lambda c:threading.get_ident()),threading.get_ident())
        await self.r.create_location(self.location(),link=self.profile())
        await self.r.create_tracker(dict(location_id=self.loc,stable_slug="fixture",unique_id="ma_"+self.loc+"_tracker",display_name="fixture"))
        session=uid()
        await self.r.create_session(dict(session_id=session,location_id=self.loc,started_at=10,last_event_at=10))
        report=self.report()
        await self.r.store_report(report,session_id=session,session_revision=1,session_values=dict(event_count=1))
        await self.r.store_report(dict(report,report_id=uid(),source_key="source-b"))
        await self.r.update_preferences(self.link,1,dict(push_enabled=1))
        await self.r.update_location(self.loc,1,dict(name="renamed",updated_at=2,record_radius_m=20000,alarm_radius_m=20000))
        await self.r.create_gap(dict(gap_id=uid(),location_id=self.loc,source_key="source-a",started_at=11,cause="fixture"))
        await self.r.update_checkpoint(expected_generation=None,last_observed_at=10,clean_shutdown=1,generation=1)
        before=await self.snapshot()
        await self.store.async_stop()
        await self.store.async_stop()
        self.assertFalse(worker.is_alive())
        # OFF must not touch an existing file or create a worker.
        data=await asyncio.to_thread(self.path.read_bytes)
        with patch.object(ma,"MonitoredAreasRuntime",side_effect=AssertionError("OFF constructed runtime")):
            self.assertIsNone(await ma.async_setup_monitored_areas(None,types.SimpleNamespace(options={})))
        self.assertEqual(await asyncio.to_thread(self.path.read_bytes),data)
        await self.store.async_start()
        self.assertEqual(await self.snapshot(),before)
        stored=await self.r.get_report(report["report_id"])
        self.assertEqual((stored["observed_at"],stored["location_lat"],stored["record_radius_m"],stored["location_revision"]),(None,12,10000,1))
        self.assertEqual(await self.store.async_execute(lambda c:(c.execute("PRAGMA integrity_check").fetchall(),c.execute("PRAGMA foreign_key_check").fetchall())),([("ok",)],[]))

    async def test_file_migrations_and_rollback(self):
        for version in (1,2):
            def seed():
                self.path.parent.mkdir(parents=True,exist_ok=True)
                with sqlite3.connect(self.path) as c:
                    for stmt in schema.DDL_V1.values(): c.execute(stmt)
                    if version==2:
                        for stmt in schema.DDL_V2_ADDITIONS.values(): c.execute(stmt)
                    c.execute("PRAGMA user_version="+str(version))
                    c.execute("INSERT INTO locations(location_id,name,lat,lon,created_at,updated_at) VALUES(?,?,?,?,1,1)",(self.loc,"fixture",12,34))
                    c.execute("INSERT INTO profile_links(link_id,location_id,ha_user_id,vault_profile_id) VALUES(?,?,?,?)",(self.link,self.loc,"test","test"))
                    if version==2: c.execute("INSERT INTO tracker_refs(location_id,stable_slug,unique_id,display_name) VALUES(?,?,?,?)",(self.loc,"fixture","ma_"+self.loc+"_tracker","fixture"))
                c.close()
            await asyncio.to_thread(seed)
            with patch.dict(schema.DDL_V3_ADDITIONS,{"invalid":"INVALID SQL"}):
                with self.assertRaises(sqlite3.DatabaseError): await self.store.async_start()
            self.assertIsNone(self.store._thread)
            def inspect():
                with sqlite3.connect(self.path) as c:
                    return c.execute("PRAGMA user_version").fetchone(),c.execute("SELECT name FROM locations").fetchone()
            self.assertEqual(await asyncio.to_thread(inspect),((version,),("fixture",)))
            await self.store.async_start()
            self.assertEqual((await self.r.get_location(self.loc))["name"],"fixture")
            self.assertEqual((await self.r.get_link(self.link))["location_id"],self.loc)
            self.assertEqual(await self.store.async_execute(lambda c:c.execute("SELECT count(*) FROM tracker_refs").fetchone()),(version-1,))
            await self.store.async_stop()
            await asyncio.to_thread(self.path.unlink)

    async def test_conflicts_and_atomic_session(self):
        await self.store.async_start()
        with self.assertRaises(repo.ConstraintViolation):
            await self.r.create_location(self.location(),link=self.profile(),preferences=dict(link_id=self.link,quiet_minutes=16))
        self.assertIsNone(await self.r.get_location(self.loc))
        await self.r.create_location(self.location(),link=self.profile())
        results=await asyncio.gather(*(self.r.update_location(self.loc,1,dict(name=str(i),updated_at=2)) for i in range(2)),return_exceptions=True)
        self.assertEqual(sum(isinstance(x,repo.RevisionConflict) for x in results),1)
        other=uid()
        await self.r.create_location(self.location(other))
        session=uid()
        await self.r.create_session(dict(session_id=session,location_id=other,started_at=10,last_event_at=10))
        report=self.report()
        before=await self.snapshot()
        with self.assertRaises(repo.ConstraintViolation):
            await self.r.store_report(report,session_id=session,session_revision=1,session_values=dict(event_count=1))
        self.assertEqual(await self.snapshot(),before)
        await self.r.store_report(report)
        self.assertFalse((await self.r.store_report(dict(report,report_id=uid(),received_at=20)))["inserted"])
        for patch_values in (dict(strike_lat=99),dict(provenance_json="[]"),dict(distance_m=-1),dict(report_id="bad")):
            with self.assertRaises(repo.ConstraintViolation): await self.r.store_report(self.report(replay_key=None,**patch_values))
        with self.assertRaises(sqlite3.IntegrityError):
            await self.store.async_execute(lambda c:c.execute("DELETE FROM locations WHERE location_id=?",(self.loc,)).rowcount)

    async def test_faults_and_recovery(self):
        await self.store.async_start()
        await self.r.create_location(self.location())
        before=await self.snapshot()
        for number,code in ((sqlite3.SQLITE_FULL,"storage_full"),(sqlite3.SQLITE_READONLY,"storage_readonly"),(sqlite3.SQLITE_LOCKED,"busy")):
            def fail(c):
                c.execute("BEGIN IMMEDIATE")
                c.execute("UPDATE locations SET name='not committed'")
                exc=sqlite3.OperationalError("synthetic")
                exc.sqlite_errorcode=number
                raise exc
            with self.assertRaises(errors.StorageError) as cm: await self.store.async_execute(fail,kind="write")
            self.assertEqual(cm.exception.code,code)
            self.assertEqual(await self.snapshot(),before)
        await self.store.async_execute(lambda c:c.execute("PRAGMA user_version=99").rowcount)
        await self.store.async_stop()
        with self.assertRaises(schema.UnsupportedSchema): await self.store.async_start()
        self.assertEqual(self.store.status.code,"unsupported_schema")
        self.assertIsNone(self.store._thread)
        with self.assertRaises(db.DatabaseUnavailable): await self.r.get_location(self.loc)
        def repair_fixture():
            with sqlite3.connect(self.path) as c: c.execute("PRAGMA user_version=9")
        await asyncio.to_thread(repair_fixture)
        await self.store.async_start()
        self.assertEqual(await self.snapshot(),before)
        await self.store.async_stop()
        # Separate deliberately corrupt fixture, never replace a real database.
        await asyncio.to_thread(self.path.unlink)
        await asyncio.to_thread(self.path.write_bytes,b"not sqlite")
        with self.assertRaises(errors.StorageError) as cm: await self.store.async_start()
        self.assertEqual(cm.exception.code,"storage_corrupt")
        self.assertEqual(await asyncio.to_thread(self.path.read_bytes),b"not sqlite")

if __name__=="__main__":
    unittest.main(verbosity=2)
