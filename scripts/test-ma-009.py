"""MA-009 SQLite v3 event/session/gap schema and rollback contracts."""
import importlib
from pathlib import Path
import sqlite3
import sys
import types
import unittest
from unittest.mock import patch
from uuid import uuid4

root = Path(__file__).resolve().parents[1]
parent = types.ModuleType("_ma009")
parent.__path__ = [str(root / "custom_components/gewitterradar")]
sys.modules[parent.__name__] = parent
schema = importlib.import_module("_ma009.monitored_areas.storage.schema")


class Tests(unittest.TestCase):
    def setUp(self):
        self.c = sqlite3.connect(":memory:", isolation_level=None)
        self.addCleanup(self.c.close)
        self.c.execute("PRAGMA foreign_keys=ON")
        self.loc, self.other = str(uuid4()), str(uuid4())

    def init_v2(self):
        for stmt in (*schema.DDL_V1.values(), *schema.DDL_V2_ADDITIONS.values()):
            self.c.execute(stmt)
        self.c.execute("PRAGMA user_version=2")
        for loc in (self.loc, self.other):
            self.c.execute(
                "INSERT INTO locations(location_id,name,lat,lon,created_at,updated_at) VALUES(?,?,?,?,1,1)",
                (loc, "historical", 0, 0))
        link = str(uuid4())
        self.c.execute("INSERT INTO profile_links(link_id,location_id,ha_user_id,vault_profile_id) VALUES(?,?,?,?)",
                       (link, self.loc, "user", "vault"))
        self.c.execute("INSERT INTO tracker_refs(location_id,stable_slug,unique_id,display_name) VALUES(?,?,?,?)",
                       (self.loc, "historical", "ma_"+self.loc+"_tracker", "historical"))
        return link

    def report(self, location, rid=None, replay=None, observed=100, received=101, **changes):
        rid = rid or str(uuid4())
        values = dict(report_id=rid,location_id=location,source_key="blitzortung",
                      replay_key=replay, observed_at=observed,received_at=received,
                      time_quality="observed" if observed is not None else "received_only",
                      strike_lat=10, strike_lon=20,location_lat=10,location_lon=20,
                      distance_m=0,record_radius_m=10000,alarm_radius_m=10000,
                      location_revision=1,provenance_json='{}')
        values.update(changes)
        self.c.execute(
            "INSERT INTO lightning_reports("+",".join(values)+") VALUES("+",".join("?" for _ in values)+")",
            tuple(values.values()))
        return rid

    def test_fresh_v0_v1_v2_and_idempotence(self):
        schema.initialize_schema(self.c)
        self.assertEqual(self.c.execute("PRAGMA user_version").fetchone(),(4,))
        self.assertEqual(schema._objects(self.c), schema.DDL)
        schema.initialize_schema(self.c)
        self.assertEqual(schema._objects(self.c), schema.DDL)

    def test_existing_rows_preserved_and_read_only_schema(self):
        link=self.init_v2()
        before=self.c.execute("SELECT * FROM locations").fetchall()
        schema.initialize_schema(self.c)
        self.assertEqual(self.c.execute("PRAGMA user_version").fetchone(),(4,))
        self.assertEqual(self.c.execute("SELECT * FROM locations").fetchall(), before)
        self.assertEqual(self.c.execute("SELECT count(*) FROM profile_links WHERE link_id=?",(link,)).fetchone(),(1,))
        self.assertEqual(self.c.execute("SELECT count(*) FROM tracker_refs").fetchone(),(1,))
        schema.initialize_schema(self.c)

    def test_v1_to_v3(self):
        for stmt in schema.DDL_V1.values(): self.c.execute(stmt)
        self.c.execute("PRAGMA user_version=1")
        self.c.execute("INSERT INTO locations(location_id,name,lat,lon,created_at,updated_at) VALUES(?,?,?,?,1,1)",
                       (self.loc,"kept",1,2))
        schema.initialize_schema(self.c)
        self.assertEqual(self.c.execute("PRAGMA user_version").fetchone(),(4,))
        self.assertEqual(self.c.execute("SELECT name FROM locations").fetchone(),("kept",))

    def test_report_identity_nullable_time_and_validation(self):
        self.init_v2()
        schema.initialize_schema(self.c)
        self.report(self.loc,replay="source-key",observed=None,time_quality="received_only")
        self.report(self.loc,replay=None)
        self.report(self.loc,replay=None)
        self.report(self.other,replay="source-key")
        for changes in (
            dict(replay_key="source-key"),
            dict(strike_lat=99),
            dict(location_lon=-181),
            dict(distance_m=-1),
            dict(record_radius_m=50001),
            dict(received_at=-1),
            dict(provenance_json="[]"),
            dict(time_quality="fabricated"),
            dict(location_id=str(uuid4())),
        ):
            with self.subTest(changes=changes),self.assertRaises(sqlite3.IntegrityError):
                self.report(self.loc,**changes)

    def test_candidate_duplicates_cannot_cross_location(self):
        self.init_v2()
        schema.initialize_schema(self.c)
        a,b=sorted((self.report(self.loc),self.report(self.loc)))
        foreign=self.report(self.other)
        self.c.execute("INSERT INTO possible_duplicates VALUES(?,?,?,?,?,?)",
                       (self.loc,a,b,"candidate",'{}',1))
        with self.assertRaises(sqlite3.IntegrityError):
            self.c.execute("INSERT INTO possible_duplicates VALUES(?,?,?,?,?,?)",
                           (self.loc,b,a,"reversed",'{}',1))
        with self.assertRaises(sqlite3.IntegrityError):
            self.c.execute("INSERT INTO possible_duplicates VALUES(?,?,?,?,?,?)",
                           (self.loc,a,foreign,"wrong_location",'{}',1))
        with self.assertRaises(sqlite3.IntegrityError):
            self.c.execute("INSERT INTO possible_duplicates VALUES(?,?,?,?,?,?)",
                           (self.loc,a,a,"self",'{}',1))
        self.assertEqual(self.c.execute("SELECT count(*) FROM lightning_reports").fetchone(),(3,))

    def test_session_membership_same_location(self):
        self.init_v2()
        schema.initialize_schema(self.c)
        session=str(uuid4())
        self.c.execute("INSERT INTO sessions(session_id,location_id,started_at,last_event_at) VALUES(?,?,?,?)",
                       (session,self.loc,100,101))
        local=self.report(self.loc)
        remote=self.report(self.other)
        self.c.execute("INSERT INTO session_reports VALUES(?,?,?)",(self.loc,session,local))
        with self.assertRaises(sqlite3.IntegrityError):
            self.c.execute("INSERT INTO session_reports VALUES(?,?,?)",(self.loc,session,remote))
        with self.assertRaises(sqlite3.IntegrityError):
            self.c.execute("UPDATE sessions SET closed_at=90,status='closed' WHERE session_id=?",(session,))
        with self.assertRaises(sqlite3.IntegrityError):
            self.c.execute("DELETE FROM lightning_reports WHERE report_id=?",(local,))

    def test_open_gap_checkpoint_and_invalid_time(self):
        self.init_v2()
        schema.initialize_schema(self.c)
        self.c.execute("INSERT INTO source_gaps(gap_id,source_key,location_id,started_at,cause) VALUES(?,?,?,?,?)",
                       (str(uuid4()),"blitzortung",self.loc,101,"offline"))
        self.c.execute("INSERT INTO runtime_checkpoint(singleton,clean_shutdown,generation) VALUES(1,0,0)")
        with self.assertRaises(sqlite3.IntegrityError):
            self.c.execute("INSERT INTO runtime_checkpoint(singleton) VALUES(2)")
        with self.assertRaises(sqlite3.IntegrityError):
            self.c.execute("INSERT INTO source_gaps(gap_id,source_key,location_id,started_at,ended_at,cause) VALUES(?,?,?,?,?,?)",
                           (str(uuid4()),"blitzortung",self.loc,101,100,"bad"))
        self.assertEqual(self.c.execute("SELECT ended_at FROM source_gaps").fetchone(),(None,))

    def test_migration_rollback_future_and_tamper(self):
        self.init_v2()
        before=self.c.execute("SELECT * FROM locations").fetchall()
        with patch.dict(schema.DDL_V3_ADDITIONS,{"invalid":"NOT SQL"}):
            with self.assertRaises(sqlite3.DatabaseError): schema.initialize_schema(self.c)
        self.assertEqual(self.c.execute("PRAGMA user_version").fetchone(),(2,))
        self.assertEqual(schema._objects(self.c),{**schema.DDL_V1,**schema.DDL_V2_ADDITIONS})
        self.assertEqual(self.c.execute("SELECT * FROM locations").fetchall(),before)
        schema.initialize_schema(self.c)
        self.c.execute("PRAGMA user_version=99")
        with self.assertRaises(schema.UnsupportedSchema): schema.initialize_schema(self.c)
        self.c.execute("PRAGMA user_version=3")
        self.c.execute("DROP INDEX idx_reports_received")
        with self.assertRaises(schema.UnsupportedSchema): schema.initialize_schema(self.c)


if __name__=="__main__":
    unittest.main(verbosity=2)
