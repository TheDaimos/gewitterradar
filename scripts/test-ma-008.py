"""MA-008 migration, tracker identity and alarm constraints."""
import importlib
from pathlib import Path
import sqlite3
import sys
import types
import unittest
from uuid import uuid4
from unittest.mock import patch

root = Path(__file__).resolve().parents[1]
parent = types.ModuleType("_ma008")
parent.__path__ = [str(root / "custom_components/gewitterradar")]
sys.modules[parent.__name__] = parent
schema = importlib.import_module("_ma008.monitored_areas.storage.schema")


class Tests(unittest.TestCase):
    def setUp(self):
        self.c = sqlite3.connect(":memory:", isolation_level=None)
        self.addCleanup(self.c.close)
        self.c.execute("PRAGMA foreign_keys=ON")
        for ddl in schema.DDL_V1.values():
            self.c.execute(ddl)
        self.c.execute("PRAGMA user_version=1")
        self.loc, self.other, self.link = (str(uuid4()) for _ in range(3))
        for loc in (self.loc,self.other):
            self.c.execute("INSERT INTO locations(location_id,name,lat,lon,created_at,updated_at) VALUES(?,?,?,?,?,?)",(loc,"name",0,0,1,1))
        self.c.execute("INSERT INTO profile_links VALUES(?,?,?,?,1)",(self.link,self.loc,"user","profile"))
        self.c.execute("INSERT INTO profile_preferences(link_id) VALUES(?)",(self.link,))
        self.c.execute("INSERT INTO notification_targets(link_id,target_key) VALUES(?,?)",(self.link,"target"))

    def snapshot(self):
        return {name:self.c.execute("SELECT * FROM "+name).fetchall() for name in ("locations","profile_links","profile_preferences","notification_targets")}

    def test_migration_preserves_rows(self):
        before=self.snapshot()
        schema.initialize_schema(self.c)
        self.assertEqual(self.c.execute("PRAGMA user_version").fetchone(),(3,))
        self.assertEqual(self.snapshot(),before)
        self.assertEqual(self.c.execute("SELECT count(*) FROM tracker_refs").fetchone(),(0,))
        schema.initialize_schema(self.c)
        self.assertEqual(self.snapshot(),before)

    def test_rollback(self):
        before=self.snapshot()
        with patch.dict(schema.DDL_V2_ADDITIONS,{"bad":"invalid sql"}):
            with self.assertRaises(sqlite3.DatabaseError):
                schema.initialize_schema(self.c)
        self.assertEqual(self.c.execute("PRAGMA user_version").fetchone(),(1,))
        self.assertEqual(schema._objects(self.c),schema.DDL_V1)
        self.assertEqual(self.snapshot(),before)
        schema.initialize_schema(self.c)

    def test_tracker(self):
        schema.initialize_schema(self.c)
        def add(loc,slug="name",entity=None):
            self.c.execute("INSERT INTO tracker_refs(location_id,stable_slug,unique_id,actual_entity_id,display_name) VALUES(?,?,?,?,?)",(loc,slug,"ma_"+loc+"_tracker",entity,"name"))
        add(self.loc)
        add(self.other)
        self.assertEqual(self.c.execute("SELECT count(*) FROM tracker_refs WHERE actual_entity_id IS NULL AND lifecycle_state='pending'").fetchone(),(2,))
        with self.assertRaises(sqlite3.IntegrityError): add(self.loc)
        with self.assertRaises(sqlite3.IntegrityError): add(str(uuid4()))
        with self.assertRaises(sqlite3.IntegrityError):
            self.c.execute("UPDATE tracker_refs SET lifecycle_state='confirmed'")
        self.c.execute("UPDATE tracker_refs SET actual_entity_id='device_tracker.test',lifecycle_state='confirmed' WHERE location_id=?",(self.loc,))
        for sql in ("UPDATE tracker_refs SET actual_entity_id='device_tracker.test' WHERE location_id=?", "UPDATE tracker_refs SET actual_entity_id='sensor.bad' WHERE location_id=?", "UPDATE tracker_refs SET unique_id='wrong' WHERE location_id=?", "UPDATE tracker_refs SET lifecycle_state='unknown' WHERE location_id=?"):
            with self.assertRaises(sqlite3.IntegrityError): self.c.execute(sql,(self.other,))
        self.c.execute("UPDATE tracker_refs SET display_name='renamed' WHERE location_id=?",(self.loc,))
        self.assertEqual(self.c.execute("SELECT stable_slug,unique_id FROM tracker_refs WHERE location_id=?",(self.loc,)).fetchone(),("name","ma_"+self.loc+"_tracker"))
        with self.assertRaises(sqlite3.IntegrityError):
            self.c.execute("DELETE FROM locations WHERE location_id=?",(self.other,))

    def test_alarm_configuration(self):
        schema.initialize_schema(self.c)
        for value in (0,50000):
            self.c.execute("UPDATE locations SET record_radius_m=?,alarm_radius_m=? WHERE location_id=?",(value,value,self.loc))
        with self.assertRaises(sqlite3.IntegrityError):
            self.c.execute("UPDATE locations SET alarm_radius_m=1 WHERE location_id=?",(self.loc,))
        self.c.execute("UPDATE locations SET alarm_radius_linked=0,alarm_radius_m=1,monitor_enabled=0,record_enabled=1,paused=1 WHERE location_id=?",(self.loc,))
        before=self.c.execute("SELECT * FROM locations").fetchall()
        self.c.execute("UPDATE profile_preferences SET push_enabled=1 WHERE link_id=?",(self.link,))
        self.assertEqual(self.c.execute("SELECT * FROM locations").fetchall(),before)
        for value in (-1,50001):
            with self.assertRaises(sqlite3.IntegrityError):
                self.c.execute("UPDATE locations SET alarm_radius_m=? WHERE location_id=?",(value,self.loc,))

    def test_unknown_or_tampered_schema(self):
        self.c.execute("PRAGMA user_version=99")
        with self.assertRaises(schema.UnsupportedSchema): schema.initialize_schema(self.c)
        self.c.execute("PRAGMA user_version=1")
        self.c.execute("DROP INDEX idx_profile_links_user_profile")
        with self.assertRaises(schema.UnsupportedSchema): schema.initialize_schema(self.c)
        self.assertEqual(self.c.execute("PRAGMA user_version").fetchone(),(1,))

if __name__=="__main__":
    unittest.main(verbosity=2)
