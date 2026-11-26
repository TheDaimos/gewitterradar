"""MA location origin: v7 -> v8 is additive, preserves identity and coordinates."""
import importlib.util
import sqlite3
import sys
import types
import unittest
from pathlib import Path
from uuid import uuid4

ROOT = Path(__file__).resolve().parents[1] / "custom_components" / "gewitterradar" / "monitored_areas"
for pkg, folder in (("ma_origin_test", ROOT), ("ma_origin_test.storage", ROOT / "storage")):
    module = types.ModuleType(pkg)
    module.__path__ = [str(folder)]
    sys.modules[pkg] = module


def load(name, file):
    spec = importlib.util.spec_from_file_location(name, file)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


load("ma_origin_test.storage.errors", ROOT / "storage" / "errors.py")
schema = load("ma_origin_test.storage.schema", ROOT / "storage" / "schema.py")


class LocationOriginTests(unittest.TestCase):
    def connection(self):
        db = sqlite3.connect(":memory:")
        db.execute("PRAGMA foreign_keys=ON")
        return db

    def test_new_database_is_v8(self):
        db = self.connection()
        schema.initialize_schema(db)
        self.assertEqual(db.execute("PRAGMA user_version").fetchone()[0], 8)
        self.assertEqual(db.execute("SELECT COUNT(*) FROM pragma_table_info('locations') WHERE name='location_origin'").fetchone()[0], 1)
        schema.initialize_schema(db)  # idempotent and canonical
        db.close()

    def test_v7_upgrade_preserves_two_independent_places_at_same_position(self):
        db = self.connection()
        for statement in schema.DDL.values():
            db.execute(statement)
        db.execute("PRAGMA user_version=7")
        ids = [str(uuid4()), str(uuid4())]
        for i, ident in enumerate(ids):
            db.execute("INSERT INTO locations(location_id,name,lat,lon,created_at,updated_at) VALUES(?,?,?,?,?,?)",
                       (ident, "Place " + str(i), 53.8, 9.9, 1, 1))
        db.commit()
        schema.initialize_schema(db)
        rows = db.execute("SELECT location_id,location_origin FROM locations ORDER BY name").fetchall()
        self.assertEqual(rows, [(ids[0], "unknown"), (ids[1], "unknown")])
        self.assertEqual(db.execute("SELECT COUNT(*) FROM locations WHERE lat=53.8 AND lon=9.9").fetchone()[0], 2)
        third = str(uuid4())
        db.execute("INSERT INTO locations(location_id,name,lat,lon,created_at,updated_at,location_origin) VALUES(?,?,?,?,?,?,?)",
                   (third, "GR place", 53.8, 9.9, 2, 2, "gr_manual"))
        self.assertEqual(db.execute("SELECT location_origin FROM locations WHERE location_id=?", (third,)).fetchone()[0], "gr_manual")
        with self.assertRaises(sqlite3.IntegrityError):
            db.execute("INSERT INTO locations(location_id,name,lat,lon,created_at,updated_at,location_origin) VALUES(?,?,?,?,?,?,?)",
                       (str(uuid4()), "invalid", 53.8, 9.9, 2, 2, "invalid"))
        db.rollback()
        schema.initialize_schema(db)
        db.close()


if __name__ == "__main__":
    unittest.main()
