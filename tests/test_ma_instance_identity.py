"""V9 cluster/instance identity: explicit bindings, no coordinate inference."""
import importlib.util
import sqlite3
import sys
import types
import unittest
from pathlib import Path
from uuid import uuid4

ROOT = Path(__file__).resolve().parents[1] / "custom_components" / "gewitterradar" / "monitored_areas"
for pkg, folder in (("ma_instance_test", ROOT), ("ma_instance_test.storage", ROOT / "storage")):
    module = types.ModuleType(pkg)
    module.__path__ = [str(folder)]
    sys.modules[pkg] = module


def load(name, file):
    spec = importlib.util.spec_from_file_location(name, file)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


load("ma_instance_test.storage.errors", ROOT / "storage" / "errors.py")
schema = load("ma_instance_test.storage.schema", ROOT / "storage" / "schema.py")


class InstanceIdentityTests(unittest.TestCase):
    def connection(self):
        c = sqlite3.connect(":memory:")
        c.execute("PRAGMA foreign_keys=ON")
        self.addCleanup(c.close)
        return c

    def test_v8_to_v9_preserves_manual_location_and_adds_no_guess(self):
        c = self.connection()
        for statement in schema.DDL.values():
            c.execute(statement)
        c.execute("ALTER TABLE locations ADD COLUMN " + schema.LOCATION_ORIGIN_COLUMN)
        c.execute("PRAGMA user_version=8")
        lid = str(uuid4())
        c.execute("INSERT INTO locations(location_id,name,lat,lon,created_at,updated_at,location_origin) "
                  "VALUES(?,?,?,?,?,?,?)", (lid, "manual", 53.8, 9.9, 1, 1, "gr_manual"))
        c.commit()
        schema.initialize_schema(c)
        self.assertEqual(c.execute("PRAGMA user_version").fetchone()[0], 9)
        self.assertEqual(c.execute("SELECT location_origin FROM locations WHERE location_id=?", (lid,)).fetchone()[0], "gr_manual")
        self.assertEqual(c.execute("SELECT count(*) FROM source_instances").fetchone()[0], 0)
        self.assertEqual(c.execute("SELECT count(*) FROM location_source_refs").fetchone()[0], 0)
        schema.initialize_schema(c)

    def test_two_instances_same_entity_and_coordinates_are_distinct(self):
        c = self.connection()
        schema.initialize_schema(c)
        lids = [str(uuid4()), str(uuid4())]
        for lid in lids:
            c.execute("INSERT INTO locations(location_id,name,lat,lon,created_at,updated_at) VALUES(?,?,?,?,?,?)",
                      (lid, "same coordinates", 53.8, 9.9, 1, 1))
        instances = [str(uuid4()), str(uuid4())]
        cluster = str(uuid4())
        for inst in instances:
            c.execute("INSERT INTO source_instances(instance_id,cluster_id,label) VALUES(?,?,?)",
                      (inst, cluster, "HA"))
        for lid, inst in zip(lids, instances):
            c.execute("INSERT INTO location_source_refs(reference_id,location_id,instance_id,entity_id,physical_device_id) "
                      "VALUES(?,?,?,?,?)", (str(uuid4()), lid, inst, "device_tracker.phone", "user-confirmed-phone"))
        self.assertEqual(c.execute("SELECT count(*) FROM location_source_refs").fetchone()[0], 2)
        self.assertEqual(c.execute("SELECT count(DISTINCT instance_id) FROM location_source_refs").fetchone()[0], 2)
        self.assertEqual(c.execute("SELECT count(*) FROM locations WHERE lat=53.8 AND lon=9.9").fetchone()[0], 2)
        with self.assertRaises(sqlite3.IntegrityError):
            c.execute("INSERT INTO location_source_refs(reference_id,location_id,instance_id,entity_id) VALUES(?,?,?,?)",
                      (str(uuid4()), lids[0], instances[0], "device_tracker.phone"))
        with self.assertRaises(sqlite3.IntegrityError):
            c.execute("INSERT INTO location_source_refs(reference_id,location_id,instance_id,entity_id) VALUES(?,?,?,?)",
                      (str(uuid4()), lids[0], str(uuid4()), "device_tracker.orphan"))
        c.rollback()
        self.assertEqual(c.execute("PRAGMA foreign_key_check").fetchall(), [])

    def test_new_database_canonical_schema(self):
        c = self.connection()
        schema.initialize_schema(c)
        self.assertEqual(c.execute("PRAGMA user_version").fetchone()[0], 9)
        schema.initialize_schema(c)


if __name__ == "__main__":
    unittest.main()
