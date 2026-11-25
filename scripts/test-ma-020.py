"""MA-020 T0/T1: durable journal schema only; no HA To-do deletion is attempted."""
import importlib
import sqlite3
import sys
import types
import unittest
from pathlib import Path
from uuid import uuid4

root = Path(__file__).resolve().parents[1]
p = types.ModuleType("_ma020")
p.__path__ = [str(root / "custom_components/gewitterradar")]
sys.modules[p.__name__] = p
schema = importlib.import_module("_ma020.monitored_areas.storage.schema")


class JournalSchemaTests(unittest.TestCase):
    def database(self):
        c = sqlite3.connect(":memory:", isolation_level=None)
        c.execute("PRAGMA foreign_keys=ON")
        self.addCleanup(c.close)
        return c

    def test_new_database_has_journal_and_no_rows(self):
        c = self.database()
        schema.initialize_schema(c)
        self.assertEqual(c.execute("PRAGMA user_version").fetchone()[0], 6)
        self.assertEqual(c.execute("SELECT count(*) FROM migration_finalizations").fetchone()[0], 0)
        self.assertEqual(c.execute("SELECT count(*) FROM migration_finalization_items").fetchone()[0], 0)
        self.assertEqual(c.execute("SELECT count(*) FROM migration_source_backups").fetchone()[0], 0)
        self.assertEqual(c.execute("PRAGMA foreign_key_check").fetchall(), [])
        schema.initialize_schema(c)

    def test_upgrade_v4_keeps_prior_objects_and_rows(self):
        c = self.database()
        old = {**schema.DDL_V1, **schema.DDL_V2_ADDITIONS,
               **schema.DDL_V3_ADDITIONS, **schema.DDL_V4_ADDITIONS}
        for stmt in old.values():
            c.execute(stmt)
        c.execute("PRAGMA user_version=4")
        c.execute("INSERT INTO request_receipts VALUES(?,?,?,?,?,?)",
                  ("alice", str(uuid4()), "migration_commit", "0" * 64, "{}", 1))
        schema.initialize_schema(c)
        self.assertEqual(c.execute("PRAGMA user_version").fetchone()[0], 6)
        self.assertEqual(c.execute("SELECT count(*) FROM request_receipts").fetchone()[0], 1)
        self.assertEqual(c.execute("PRAGMA foreign_key_check").fetchall(), [])

    def test_upgrade_v5_preserves_existing_journal_rows(self):
        c = self.database()
        old = {**schema.DDL_V1, **schema.DDL_V2_ADDITIONS,
               **schema.DDL_V3_ADDITIONS, **schema.DDL_V4_ADDITIONS,
               **schema.DDL_V5_ADDITIONS}
        for statement in old.values():
            c.execute(statement)
        c.execute("PRAGMA user_version=5")
        fid = str(uuid4())
        c.execute("INSERT INTO migration_finalizations VALUES(?,?,?,?,?,?,?,?,?)",
                  (fid,"alice","profile","todo.gewitterradar_orte","a"*64,1,"prepared",1,1))
        schema.initialize_schema(c)
        self.assertEqual(c.execute("PRAGMA user_version").fetchone()[0], 6)
        self.assertEqual(c.execute("SELECT finalization_id FROM migration_finalizations").fetchone()[0],fid)
        self.assertEqual(c.execute("PRAGMA foreign_key_check").fetchall(), [])

    def test_journal_rejects_missing_location_and_unverified_status(self):
        c = self.database()
        schema.initialize_schema(c)
        fid, lid = str(uuid4()), str(uuid4())
        c.execute("INSERT INTO migration_finalizations VALUES(?,?,?,?,?,?,?,?,?)",
                  (fid, "alice", "profile", "todo.gewitterradar_orte", "a" * 64,
                   1, "prepared", 1, 1))
        with self.assertRaises(sqlite3.IntegrityError):
            c.execute("INSERT INTO migration_finalization_items VALUES(?,?,?,?,?,?)",
                      (fid, "uid", "b" * 64, lid, "absence_verified", 1))
        with self.assertRaises(sqlite3.IntegrityError):
            c.execute("UPDATE migration_finalizations SET state='deleted' WHERE finalization_id=?", (fid,))
        self.assertEqual(c.execute("SELECT count(*) FROM migration_finalization_items").fetchone()[0], 0)


if __name__ == "__main__":
    unittest.main(verbosity=2)
