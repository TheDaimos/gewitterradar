"""MA-011: reproducible SQLite error codes and real temporary storage."""
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

root=Path(__file__).resolve().parents[1]
parent=types.ModuleType("_ma011")
parent.__path__=[str(root/"custom_components/gewitterradar")]
sys.modules[parent.__name__]=parent
db=importlib.import_module("_ma011.monitored_areas.storage.database")
errors=importlib.import_module("_ma011.monitored_areas.storage.errors")
schema=importlib.import_module("_ma011.monitored_areas.storage.schema")

def injected(code):
    e=sqlite3.OperationalError("injected")
    e.sqlite_errorcode=code
    return e

class Tests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root=Path(self.temp.name).resolve()
        self.path=self.root/"gewitterradar/monitored_areas/monitored_areas.sqlite3"
        self.store=db.Database(self.path,config_root=self.root,queue_size=1)

    async def asyncTearDown(self):
        try:
            await self.store.async_stop()
        except errors.StorageError:
            pass

    async def test_codes_and_rollback(self):
        await self.store.async_start()
        for code,expected in ((sqlite3.SQLITE_FULL,"storage_full"),(sqlite3.SQLITE_READONLY | 256,"storage_readonly"),(sqlite3.SQLITE_BUSY,"busy"),(sqlite3.SQLITE_LOCKED,"busy")):
            def operation(c):
                c.execute("BEGIN IMMEDIATE")
                c.execute("INSERT INTO runtime_checkpoint(singleton) VALUES(1)")
                raise injected(code)
            with self.assertRaises(errors.StorageError) as cm:
                await self.store.async_execute(operation,kind="write")
            self.assertEqual(cm.exception.code,expected)
            self.assertTrue(self.store.status.reusable)
            self.assertEqual(self.store.status.operation,"write")
            self.assertEqual(await self.store.async_execute(lambda c:c.execute("SELECT count(*) FROM runtime_checkpoint").fetchone()),(0,))
            self.assertEqual(self.store.status.state,errors.StorageState.READY)
        self.assertNotEqual(await self.store.async_execute(lambda c:threading.get_ident()),threading.get_ident())

    async def test_fatal_drains_pending(self):
        await self.store.async_start()
        entered, release=threading.Event(),threading.Event()
        def bad(c):
            entered.set()
            if not release.wait(3): raise TimeoutError()
            raise injected(sqlite3.SQLITE_CORRUPT)
        first=asyncio.create_task(self.store.async_execute(bad))
        try:
            self.assertTrue(await asyncio.to_thread(entered.wait,2))
            second=asyncio.create_task(self.store.async_execute(lambda c:1))
            await asyncio.sleep(0)
            with self.assertRaises(db.DatabaseOverloaded) as cm:
                await self.store.async_execute(lambda c:2)
            self.assertEqual(cm.exception.code,"busy")
        finally:
            release.set()
        with self.assertRaises(errors.StorageError) as cm:
            await asyncio.wait_for(first,3)
        self.assertEqual(cm.exception.code,"storage_corrupt")
        with self.assertRaises(db.DatabaseUnavailable):
            await asyncio.wait_for(second,3)
        self.assertEqual(self.store.status.state,errors.StorageState.DEGRADED)
        with self.assertRaises(errors.StorageError):
            await self.store.async_stop()
        await self.store.async_stop()
        self.assertIsNone(self.store._thread)

    async def test_corrupt_file_preserved(self):
        self.path.parent.mkdir(parents=True)
        self.path.write_bytes(b"not sqlite")
        with self.assertRaises(errors.StorageError) as cm:
            await self.store.async_start()
        self.assertEqual(cm.exception.code,"storage_corrupt")
        self.assertEqual(self.path.read_bytes(),b"not sqlite")
        self.assertIsNone(self.store._thread)

    async def test_future_version_preserved(self):
        await self.store.async_start()
        await self.store.async_execute(lambda c:c.execute("PRAGMA user_version=99").rowcount)
        await self.store.async_stop()
        with self.assertRaises(schema.UnsupportedSchema):
            await self.store.async_start()
        self.assertEqual(self.store.status.code,"unsupported_schema")
        self.assertIsNone(self.store._thread)
        def verify():
            with sqlite3.connect(self.path) as c:
                return c.execute("PRAGMA user_version").fetchone()
        self.assertEqual(await asyncio.to_thread(verify),(99,))

    async def test_recovery_and_constraints(self):
        with patch.object(self.store,"_open",side_effect=PermissionError("injected")):
            with self.assertRaises(PermissionError):
                await self.store.async_start()
        self.assertEqual(self.store.status.code,"storage_readonly")
        await self.store.async_start()
        with self.assertRaises(sqlite3.IntegrityError):
            await self.store.async_execute(lambda c:c.execute("INSERT INTO runtime_checkpoint(singleton) VALUES(2)").rowcount)
        self.assertEqual(self.store.status.state,errors.StorageState.READY)
        await self.store.async_stop()
        await self.store.async_stop()
        self.assertEqual(self.store.status.state,errors.StorageState.STOPPED)

if __name__=="__main__":
    unittest.main(verbosity=2)
