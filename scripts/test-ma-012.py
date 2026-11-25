"""MA-012 isolated location CRUD and optimistic concurrency tests."""
import importlib
from pathlib import Path
import sys
import tempfile
import types
import unittest

root = Path(__file__).resolve().parents[1]
p = types.ModuleType("_ma012")
p.__path__ = [str(root / "custom_components/gewitterradar")]
sys.modules[p.__name__] = p
Database = importlib.import_module("_ma012.monitored_areas.storage.database").Database
Repositories = importlib.import_module("_ma012.monitored_areas.storage.repositories")
Locations = importlib.import_module("_ma012.monitored_areas.locations").Locations


class Tests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        root = Path(self.tmp.name).resolve()
        self.db = Database(root / "gewitterradar/monitored_areas/monitored_areas.sqlite3", config_root=root)
        await self.db.async_start()
        self.locations = Locations(Repositories.Repositories(self.db))

    async def asyncTearDown(self):
        await self.db.async_stop()

    async def test_create_rename_revision_and_read(self):
        loc = await self.locations.create(name="  Example  ", lat=53.7, lon=9.8)
        self.assertEqual((loc["name"], loc["revision"]), ("Example", 1))
        self.assertEqual(await self.locations.get(loc["location_id"]), loc)
        updated = await self.locations.update(loc["location_id"], 1, {"name": "New"})
        self.assertEqual((updated["revision"], updated["name"]), (2, "New"))
        with self.assertRaises(Repositories.RevisionConflict):
            await self.locations.update(loc["location_id"], 1, {"name": "Stale"})
        self.assertEqual((await self.locations.get(loc["location_id"]))["name"], "New")

    async def test_invalid_inputs_never_create(self):
        for values in (
            dict(name="", lat=0, lon=0), dict(name="x", lat=float("nan"), lon=0),
            dict(name="x", lat=91, lon=0), dict(name="x", lat=0, lon=181),
            dict(name="x", lat=True, lon=0),
        ):
            with self.assertRaises(ValueError):
                await self.locations.create(**values)
        self.assertEqual(await self.db.async_execute(
            lambda c: c.execute("SELECT count(*) FROM locations").fetchone()[0]), 0)

    async def test_no_public_api_or_side_effects(self):
        loc = await self.locations.create(name="N", lat=0, lon=0)
        with self.assertRaises(ValueError):
            await self.locations.update(loc["location_id"], 1, {"monitor_enabled": True})
        self.assertEqual((await self.locations.get(loc["location_id"]))["revision"], 1)


if __name__ == "__main__":
    unittest.main(verbosity=2)
