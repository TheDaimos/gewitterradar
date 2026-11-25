"""MA-007 schema contracts using real SQLite and MA-006 worker."""
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
parent = types.ModuleType("_ma007")
parent.__path__ = [str(root / "custom_components/gewitterradar")]
sys.modules[parent.__name__] = parent
schema = importlib.import_module("_ma007.monitored_areas.storage.schema")
database = importlib.import_module("_ma007.monitored_areas.storage.database")

class SchemaTests(unittest.TestCase):
    def setUp(self):
        self.conn = sqlite3.connect(":memory:", isolation_level=None)
        self.addCleanup(self.conn.close)
        self.conn.execute("PRAGMA foreign_keys=ON")
        schema.initialize_schema(self.conn)
        self.loc, self.link = str(uuid4()), str(uuid4())
        self.conn.execute("INSERT INTO locations(location_id,name,lat,lon,created_at,updated_at) VALUES(?,?,?,?,?,?)",
                          (self.loc,"same",0,0,1,1))
        self.conn.execute("INSERT INTO profile_links(link_id,location_id,ha_user_id,vault_profile_id) VALUES(?,?,?,?)",
                          (self.link,self.loc,"user","profile"))
    def test_version_defaults_reopen(self):
        self.assertEqual(self.conn.execute("PRAGMA user_version").fetchone(),(1,))
        self.assertEqual(self.conn.execute("SELECT record_radius_m,entities_enabled,monitor_enabled FROM locations").fetchone(),(10000,0,0))
        schema.initialize_schema(self.conn)
        self.assertEqual(self.conn.execute("SELECT count(*) FROM locations").fetchone(),(1,))
    def test_constraints(self):
        for column,value in (("lat",91),("lon",-181),("lat",float("inf")),("lat",float("nan")),("revision",0),("paused",2),("mode","wrong"),("record_radius_m",50001),("updated_at",0),("location_id","bad")):
            with self.subTest(column=column,value=value), self.assertRaises(sqlite3.IntegrityError):
                self.conn.execute("UPDATE locations SET "+column+"=?",(value,))
        with self.assertRaises(sqlite3.IntegrityError):
            self.conn.execute("DELETE FROM locations")
        with self.assertRaises(sqlite3.IntegrityError):
            self.conn.execute("INSERT INTO profile_links VALUES(?,?,?,?,1)",(str(uuid4()),self.loc,"user","profile"))
    def test_multi_profile_preferences_targets(self):
        second=str(uuid4())
        self.conn.execute("INSERT INTO profile_links VALUES(?,?,?,?,1)",(second,self.loc,"user","other"))
        self.conn.execute("INSERT INTO profile_preferences(link_id) VALUES(?)",(self.link,))
        self.conn.execute("INSERT INTO profile_preferences(link_id,quiet_minutes) VALUES(?,?)",(second,60))
        for value in (14,16,65):
            with self.assertRaises(sqlite3.IntegrityError):
                self.conn.execute("UPDATE profile_preferences SET quiet_minutes=?",(value,))
        for value in ("bad","[]","null"):
            with self.assertRaises(sqlite3.IntegrityError):
                self.conn.execute("UPDATE profile_preferences SET display_settings_json=?",(value,))
        self.conn.execute("INSERT INTO notification_targets(link_id,target_key) VALUES(?,?)",(self.link,"target"))
        self.conn.execute("INSERT INTO notification_targets(link_id,target_key) VALUES(?,?)",(self.link,"other"))
        with self.assertRaises(sqlite3.IntegrityError):
            self.conn.execute("DELETE FROM profile_links WHERE link_id=?",(self.link,))
        with self.assertRaises(sqlite3.IntegrityError):
            self.conn.execute("INSERT INTO notification_targets(link_id,target_key) VALUES(?,?)",(str(uuid4()),"target"))
        self.assertEqual(self.conn.execute("SELECT quiet_minutes FROM profile_preferences ORDER BY quiet_minutes").fetchall(),[(15,),(60,)])
    def test_fail_closed(self):
        self.conn.execute("PRAGMA user_version=99")
        with self.assertRaises(schema.UnsupportedSchema):
            schema.initialize_schema(self.conn)
        self.assertEqual(self.conn.execute("PRAGMA user_version").fetchone(),(99,))
        self.conn.execute("PRAGMA user_version=1")
        self.conn.execute("DROP INDEX idx_profile_links_user_profile")
        with self.assertRaises(schema.UnsupportedSchema):
            schema.initialize_schema(self.conn)
        self.assertEqual(self.conn.execute("SELECT count(*) FROM locations").fetchone(),(1,))
    def test_unversioned_nonempty_and_atomic_failure(self):
        c=sqlite3.connect(":memory:",isolation_level=None)
        self.addCleanup(c.close)
        c.execute("CREATE TABLE legacy(x)")
        with self.assertRaises(schema.UnsupportedSchema):
            schema.initialize_schema(c)
        self.assertEqual(c.execute("PRAGMA user_version").fetchone(),(0,))
        c.execute("DROP TABLE legacy")
        from unittest.mock import patch
        with patch.dict(schema.DDL,{"bad":"invalid sql"}):
            with self.assertRaises(sqlite3.DatabaseError):
                schema.initialize_schema(c)
        self.assertEqual(c.execute("PRAGMA user_version").fetchone(),(0,))
        self.assertEqual(c.execute("SELECT name FROM sqlite_schema").fetchall(),[])

class WorkerTests(unittest.IsolatedAsyncioTestCase):
    async def test_existing_empty_v0_and_reopen(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp).resolve()
            path=root/"gewitterradar/monitored_areas/monitored_areas.sqlite3"
            path.parent.mkdir(parents=True)
            with sqlite3.connect(path) as c:
                c.execute("PRAGMA user_version=0")
            c.close()
            store=database.Database(path,config_root=root)
            try:
                await store.async_start()
                self.assertEqual(await store.async_execute(lambda c:c.execute("PRAGMA user_version").fetchone()),(1,))
                await store.async_stop()
                await store.async_start()
                self.assertEqual(await store.async_execute(lambda c:c.execute("SELECT count(*) FROM locations").fetchone()),(0,))
            finally:
                await store.async_stop()

if __name__=="__main__":
    unittest.main(verbosity=2)
