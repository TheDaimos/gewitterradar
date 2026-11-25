"""MA-007: version-one schema, initialized only by the SQLite owner thread."""
import sqlite3

SCHEMA_VERSION = 1


class UnsupportedSchema(sqlite3.DatabaseError):
    """Unknown or noncanonical schema; never reset or downgrade."""


def _uuid(column):
    return (f"length({column})=36 AND substr({column},9,1)='-' "
            f"AND substr({column},14,1)='-' AND substr({column},19,1)='-' "
            f"AND substr({column},24,1)='-' AND substr({column},15,1)='4' "
            f"AND substr({column},20,1) IN ('8','9','a','b') "
            f"AND length(replace({column},'-',''))=32 "
            f"AND replace({column},'-','') NOT GLOB '*[^0-9a-f]*'")


DDL = {
    "locations": f"""CREATE TABLE locations (
        location_id TEXT NOT NULL PRIMARY KEY CHECK ({_uuid('location_id')}),
        name TEXT NOT NULL CHECK (length(trim(name))>0),
        lat REAL NOT NULL CHECK (lat BETWEEN -90 AND 90),
        lon REAL NOT NULL CHECK (lon BETWEEN -180 AND 180),
        revision INTEGER NOT NULL DEFAULT 1 CHECK (revision>=1),
        created_at INTEGER NOT NULL CHECK (created_at>=0),
        updated_at INTEGER NOT NULL CHECK (updated_at>=created_at),
        monitor_enabled INTEGER NOT NULL DEFAULT 0 CHECK (monitor_enabled IN (0,1)),
        paused INTEGER NOT NULL DEFAULT 0 CHECK (paused IN (0,1)),
        record_enabled INTEGER NOT NULL DEFAULT 0 CHECK (record_enabled IN (0,1)),
        mode TEXT NOT NULL DEFAULT 'both' CHECK (mode IN ('strikes','storm','both')),
        record_radius_m INTEGER NOT NULL DEFAULT 10000 CHECK (record_radius_m BETWEEN 0 AND 50000),
        alarm_radius_linked INTEGER NOT NULL DEFAULT 1 CHECK (alarm_radius_linked IN (0,1)),
        alarm_radius_m INTEGER NOT NULL DEFAULT 10000 CHECK (alarm_radius_m BETWEEN 0 AND 50000),
        entities_enabled INTEGER NOT NULL DEFAULT 0 CHECK (entities_enabled IN (0,1)),
        CHECK (alarm_radius_linked=0 OR alarm_radius_m=record_radius_m)
    ) STRICT""",
    "profile_links": f"""CREATE TABLE profile_links (
        link_id TEXT NOT NULL PRIMARY KEY CHECK ({_uuid('link_id')}),
        location_id TEXT NOT NULL REFERENCES locations(location_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
        ha_user_id TEXT NOT NULL CHECK (length(trim(ha_user_id))>0),
        vault_profile_id TEXT NOT NULL CHECK (length(trim(vault_profile_id))>0),
        revision INTEGER NOT NULL DEFAULT 1 CHECK (revision>=1),
        UNIQUE(location_id,ha_user_id,vault_profile_id)
    ) STRICT""",
    "profile_preferences": """CREATE TABLE profile_preferences (
        link_id TEXT NOT NULL PRIMARY KEY REFERENCES profile_links(link_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
        push_enabled INTEGER NOT NULL DEFAULT 0 CHECK (push_enabled IN (0,1)),
        critical_enabled INTEGER NOT NULL DEFAULT 0 CHECK (critical_enabled IN (0,1)),
        notification_mode TEXT NOT NULL DEFAULT 'both' CHECK (notification_mode IN ('strikes','storm','both')),
        closure_enabled INTEGER NOT NULL DEFAULT 0 CHECK (closure_enabled IN (0,1)),
        quiet_minutes INTEGER NOT NULL DEFAULT 15 CHECK (quiet_minutes BETWEEN 15 AND 60 AND quiet_minutes%5=0),
        status_push INTEGER NOT NULL DEFAULT 0 CHECK (status_push IN (0,1)),
        display_settings_json TEXT NOT NULL DEFAULT '{}' CHECK (CASE WHEN json_valid(display_settings_json) THEN json_type(display_settings_json)='object' ELSE 0 END),
        revision INTEGER NOT NULL DEFAULT 1 CHECK (revision>=1)
    ) STRICT""",
    "notification_targets": """CREATE TABLE notification_targets (
        link_id TEXT NOT NULL REFERENCES profile_links(link_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
        target_key TEXT NOT NULL CHECK (length(trim(target_key))>0),
        verified_state TEXT NOT NULL DEFAULT 'unverified' CHECK (verified_state IN ('unverified','verified','unavailable')),
        PRIMARY KEY(link_id,target_key)
    ) STRICT""",
    "idx_profile_links_user_profile": """CREATE INDEX idx_profile_links_user_profile ON profile_links(ha_user_id,vault_profile_id)""",
}


def _objects(conn):
    return dict(conn.execute("SELECT name,sql FROM sqlite_schema WHERE name NOT LIKE 'sqlite_%'"))


def initialize_schema(conn: sqlite3.Connection) -> None:
    """Create only an empty v0 database; validate v1 without changing it."""
    conn.execute("BEGIN IMMEDIATE")
    try:
        version = conn.execute("PRAGMA user_version").fetchone()[0]
        objects = _objects(conn)
        if version == 0:
            if objects:
                raise UnsupportedSchema("nonempty unversioned database")
            for statement in DDL.values():
                conn.execute(statement)
            conn.execute("PRAGMA user_version=1")
        elif version != SCHEMA_VERSION:
            raise UnsupportedSchema(f"unsupported schema version {version}")
        if _objects(conn) != DDL:
            raise UnsupportedSchema("schema identity mismatch")
        if conn.execute("PRAGMA foreign_key_check").fetchone() is not None:
            raise sqlite3.DatabaseError("schema foreign key check failed")
        if conn.execute("PRAGMA quick_check").fetchall() != [("ok",)]:
            raise sqlite3.DatabaseError("schema integrity check failed")
        conn.commit()
    except BaseException:
        conn.rollback()
        raise
