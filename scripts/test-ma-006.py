"""MA-006 stdlib lifecycle tests, no HA installation."""
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

root = Path(__file__).resolve().parents[1]
parent = types.ModuleType("_ma006")
parent.__path__ = [str(root / "custom_components/gewitterradar")]
sys.modules[parent.__name__] = parent
ma = importlib.import_module("_ma006.monitored_areas")
db = importlib.import_module("_ma006.monitored_areas.storage.database")

class Tests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name).resolve()
        self.path = self.root / "gewitterradar/monitored_areas/monitored_areas.sqlite3"
        self.store = db.Database(self.path, config_root=self.root, queue_size=1)

    async def asyncTearDown(self):
        await self.store.async_stop()

    async def test_off(self):
        with patch.object(ma, "MonitoredAreasRuntime", side_effect=AssertionError):
            for options in ({}, {"monitored_areas_enabled": False}, {"monitored_areas_enabled": 1}):
                self.assertIsNone(await ma.async_setup_monitored_areas(None, types.SimpleNamespace(options=options)))
        self.assertFalse(self.path.parent.exists())

    async def test_pragmas_owner_restart(self):
        await self.store.async_start()
        worker = self.store._thread
        await self.store.async_start()
        self.assertIs(self.store._thread, worker)
        values = await self.store.async_execute(lambda c: (
            threading.get_ident(), *(c.execute("PRAGMA "+p).fetchone()[0]
              for p in ("foreign_keys","journal_mode","synchronous","busy_timeout"))))
        self.assertNotEqual(values[0], threading.get_ident())
        self.assertEqual(values[1:], (1,"wal",2,5000))
        self.assertTrue(self.path.is_file())
        self.assertEqual(await self.store.async_execute(lambda c: c.execute("PRAGMA user_version").fetchone()[0]),9)
        await self.store.async_stop()
        self.assertFalse(worker.is_alive())
        await self.store.async_stop()
        await self.store.async_start()
        self.assertEqual(await self.store.async_execute(lambda c: c.execute("PRAGMA user_version").fetchone()[0]),9)

    async def test_queue_and_drain(self):
        await self.store.async_start()
        entered, release = threading.Event(), threading.Event()
        def block(c):
            entered.set()
            if not release.wait(3):
                raise TimeoutError()
            return 1
        first = asyncio.create_task(self.store.async_execute(block))
        try:
            self.assertTrue(await asyncio.to_thread(entered.wait, 2))
            second = asyncio.create_task(self.store.async_execute(lambda c: 2))
            await asyncio.sleep(0)
            with self.assertRaises(db.DatabaseOverloaded):
                await self.store.async_execute(lambda c: 3)
            stop = asyncio.create_task(self.store.async_stop())
            await asyncio.sleep(0)
            with self.assertRaises(db.DatabaseUnavailable):
                await self.store.async_execute(lambda c: 4)
        finally:
            release.set()
        self.assertEqual(await first,1)
        self.assertEqual(await second,2)
        await stop

    async def test_failure(self):
        self.path.parent.mkdir(parents=True)
        self.path.write_bytes(b"not a database")
        with self.assertRaises(sqlite3.DatabaseError):
            await self.store.async_start()
        self.assertIsNone(self.store._thread)
        self.assertEqual(self.path.read_bytes(),b"not a database")

    async def test_cancel_start(self):
        entered, release = threading.Event(), threading.Event()
        original = self.store._open
        def slow():
            entered.set()
            if not release.wait(3):
                raise TimeoutError()
            return original()
        with patch.object(self.store, "_open", side_effect=slow):
            task = asyncio.create_task(self.store.async_start())
            try:
                self.assertTrue(await asyncio.to_thread(entered.wait,2))
                task.cancel()
            finally:
                release.set()
            with self.assertRaises(asyncio.CancelledError):
                await task
        self.assertIsNone(self.store._thread)

    async def test_runtime_shutdown(self):
        listeners = []
        def listen(event, callback):
            listeners.append(callback)
            return lambda: listeners.remove(callback)
        hass = types.SimpleNamespace(config=types.SimpleNamespace(
            config_dir=str(self.root), path=lambda *p: str(self.root.joinpath(*p))),
            bus=types.SimpleNamespace(async_listen_once=listen))
        runtime = await ma.async_setup_monitored_areas(hass, types.SimpleNamespace(options={"monitored_areas_enabled":True}))
        self.assertIsNotNone(runtime)
        self.assertEqual(len(listeners),1)
        callback = listeners.pop()
        worker = runtime.database._thread
        await callback(None)
        self.assertFalse(worker.is_alive())
        self.assertTrue(self.path.exists())
        await runtime.async_stop()
        await runtime.async_start()
        await runtime.async_stop()
        self.assertEqual(listeners,[])

    async def test_invalid_path_and_mkdir_failure(self):
        wrong = db.Database(self.root/"other.sqlite3", config_root=self.root)
        with self.assertRaises(ValueError):
            await wrong.async_start()
        self.assertIsNone(wrong._thread)
        with patch("pathlib.Path.mkdir", side_effect=PermissionError):
            with self.assertRaises(PermissionError):
                await self.store.async_start()
        self.assertIsNone(self.store._thread)

if __name__ == "__main__":
    unittest.main(verbosity=2)
