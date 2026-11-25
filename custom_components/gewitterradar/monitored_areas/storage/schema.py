"""MA-009: versioned location, profile, tracker and event history schema, initialized only by the SQLite owner thread."""
import sqlite3

from .errors import StorageIntegrityError

SCHEMA_VERSION = 6


class UnsupportedSchema(sqlite3.DatabaseError):
    """Unknown or noncanonical schema; never reset or downgrade."""


def _uuid(column):
    return (f"length({column})=36 AND substr({column},9,1)='-' "
            f"AND substr({column},14,1)='-' AND substr({column},19,1)='-' "
            f"AND substr({column},24,1)='-' AND substr({column},15,1)='4' "
            f"AND substr({column},20,1) IN ('8','9','a','b') "
            f"AND length(replace({column},'-',''))=32 "
            f"AND replace({column},'-','') NOT GLOB '*[^0-9a-f]*'")


DDL_V1 = {
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


# These are persisted registry lifecycle states, not proof of source coupling.
DDL_V2_ADDITIONS = {
    "tracker_refs": """CREATE TABLE tracker_refs (
        location_id TEXT NOT NULL PRIMARY KEY REFERENCES locations(location_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
        stable_slug TEXT NOT NULL CHECK (length(stable_slug)>0 AND stable_slug NOT GLOB '*[^a-z0-9_]*'),
        unique_id TEXT NOT NULL UNIQUE CHECK (unique_id='ma_'||location_id||'_tracker'),
        actual_entity_id TEXT UNIQUE CHECK (actual_entity_id IS NULL OR (substr(actual_entity_id,1,15)='device_tracker.' AND length(actual_entity_id)>15 AND substr(actual_entity_id,16) NOT GLOB '*[^a-z0-9_]*')),
        display_name TEXT NOT NULL CHECK (length(trim(display_name))>0),
        lifecycle_state TEXT NOT NULL DEFAULT 'pending' CHECK (lifecycle_state IN ('pending','confirmed','error') AND (lifecycle_state<>'confirmed' OR actual_entity_id IS NOT NULL)),
        revision INTEGER NOT NULL DEFAULT 1 CHECK (revision>=1)
    ) STRICT""",
}

# MA-009: immutable observations, candidate duplicates, shared sessions and gaps.
# No source subscriptions, notification queues or user-facing mutations.
DDL_V3_ADDITIONS = {
    "lightning_reports": f"""CREATE TABLE lightning_reports (
        report_id TEXT NOT NULL PRIMARY KEY CHECK ({_uuid('report_id')}),
        location_id TEXT NOT NULL REFERENCES locations(location_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
        source_key TEXT NOT NULL CHECK (length(trim(source_key))>0),
        source_event_id TEXT,
        replay_key TEXT,
        observed_at INTEGER CHECK (observed_at IS NULL OR observed_at>=0),
        received_at INTEGER NOT NULL CHECK (received_at>=0),
        time_quality TEXT NOT NULL CHECK (time_quality IN ('observed','received_only','estimated','unknown')),
        strike_lat REAL NOT NULL CHECK (strike_lat BETWEEN -90 AND 90),
        strike_lon REAL NOT NULL CHECK (strike_lon BETWEEN -180 AND 180),
        location_lat REAL NOT NULL CHECK (location_lat BETWEEN -90 AND 90),
        location_lon REAL NOT NULL CHECK (location_lon BETWEEN -180 AND 180),
        distance_m REAL NOT NULL CHECK (distance_m>=0 AND distance_m<=50000000),
        record_radius_m INTEGER NOT NULL CHECK (record_radius_m BETWEEN 0 AND 50000),
        alarm_radius_m INTEGER NOT NULL CHECK (alarm_radius_m BETWEEN 0 AND 50000),
        location_revision INTEGER NOT NULL CHECK (location_revision>=1),
        provenance_json TEXT NOT NULL DEFAULT '{{}}' CHECK (CASE WHEN json_valid(provenance_json) THEN json_type(provenance_json)='object' ELSE 0 END),
        UNIQUE(location_id,report_id)
    ) STRICT""",
    "idx_reports_observed": """CREATE INDEX idx_reports_observed ON lightning_reports(location_id,observed_at,report_id)""",
    "idx_reports_received": """CREATE INDEX idx_reports_received ON lightning_reports(location_id,received_at,report_id)""",
    # Only non-null, source-scoped replay keys are unique. A missing replay identity
    # does not suppress distinct physical observations.
    "idx_reports_replay": """CREATE UNIQUE INDEX idx_reports_replay ON lightning_reports(location_id,source_key,replay_key) WHERE replay_key IS NOT NULL""",
    "possible_duplicates": """CREATE TABLE possible_duplicates (
        location_id TEXT NOT NULL REFERENCES locations(location_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
        report_a TEXT NOT NULL,
        report_b TEXT NOT NULL,
        reason TEXT NOT NULL CHECK (length(trim(reason))>0),
        evidence_json TEXT NOT NULL DEFAULT '{}' CHECK (CASE WHEN json_valid(evidence_json) THEN json_type(evidence_json)='object' ELSE 0 END),
        rule_version INTEGER NOT NULL CHECK (rule_version>=1),
        PRIMARY KEY(location_id,report_a,report_b),
        CHECK (report_a<report_b),
        FOREIGN KEY(location_id,report_a) REFERENCES lightning_reports(location_id,report_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
        FOREIGN KEY(location_id,report_b) REFERENCES lightning_reports(location_id,report_id) ON DELETE RESTRICT ON UPDATE RESTRICT
    ) STRICT""",
    "sessions": f"""CREATE TABLE sessions (
        session_id TEXT NOT NULL PRIMARY KEY CHECK ({_uuid('session_id')}),
        location_id TEXT NOT NULL REFERENCES locations(location_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
        started_at INTEGER NOT NULL CHECK (started_at>=0),
        last_event_at INTEGER NOT NULL CHECK (last_event_at>=started_at),
        status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed','interrupted')),
        closed_at INTEGER CHECK (closed_at IS NULL OR closed_at>=last_event_at),
        event_count INTEGER NOT NULL DEFAULT 0 CHECK (event_count>=0),
        min_distance_m REAL CHECK (min_distance_m IS NULL OR min_distance_m>=0),
        gap_seen INTEGER NOT NULL DEFAULT 0 CHECK (gap_seen IN (0,1)),
        revision INTEGER NOT NULL DEFAULT 1 CHECK (revision>=1),
        CHECK ((status='closed' AND closed_at IS NOT NULL) OR (status<>'closed' AND closed_at IS NULL)),
        UNIQUE(location_id,session_id)
    ) STRICT""",
    "idx_sessions_started": """CREATE INDEX idx_sessions_started ON sessions(location_id,started_at,session_id)""",
    "session_reports": """CREATE TABLE session_reports (
        location_id TEXT NOT NULL,
        session_id TEXT NOT NULL,
        report_id TEXT NOT NULL,
        PRIMARY KEY(session_id,report_id),
        FOREIGN KEY(location_id,session_id) REFERENCES sessions(location_id,session_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
        FOREIGN KEY(location_id,report_id) REFERENCES lightning_reports(location_id,report_id) ON DELETE RESTRICT ON UPDATE RESTRICT
    ) STRICT""",
    "source_gaps": f"""CREATE TABLE source_gaps (
        gap_id TEXT NOT NULL PRIMARY KEY CHECK ({_uuid('gap_id')}),
        source_key TEXT NOT NULL CHECK (length(trim(source_key))>0),
        location_id TEXT REFERENCES locations(location_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
        started_at INTEGER NOT NULL CHECK (started_at>=0),
        ended_at INTEGER CHECK (ended_at IS NULL OR ended_at>=started_at),
        cause TEXT NOT NULL CHECK (length(trim(cause))>0),
        coverage_confidence TEXT NOT NULL DEFAULT 'unknown' CHECK (coverage_confidence IN ('unknown','partial','confirmed')),
        CHECK (location_id IS NOT NULL OR source_key<>'')
    ) STRICT""",
    "idx_source_gaps_started": """CREATE INDEX idx_source_gaps_started ON source_gaps(location_id,started_at,gap_id)""",
    "runtime_checkpoint": """CREATE TABLE runtime_checkpoint (
        singleton INTEGER NOT NULL PRIMARY KEY CHECK (singleton=1),
        last_observed_at INTEGER CHECK (last_observed_at IS NULL OR last_observed_at>=0),
        clean_shutdown INTEGER NOT NULL DEFAULT 0 CHECK (clean_shutdown IN (0,1)),
        generation INTEGER NOT NULL DEFAULT 0 CHECK (generation>=0)
    ) STRICT""",
}
# MA-015: idempotency receipts committed in the SAME SQL transaction as mutation.
DDL_V4_ADDITIONS = {
    "request_receipts": f"""CREATE TABLE request_receipts (
        actor_user_id TEXT NOT NULL CHECK (length(trim(actor_user_id))>0),
        request_id TEXT NOT NULL CHECK ({_uuid('request_id')}),
        operation TEXT NOT NULL CHECK (length(trim(operation))>0),
        payload_hash TEXT NOT NULL CHECK (length(payload_hash)=64 AND payload_hash NOT GLOB '*[^0-9a-f]*'),
        result_json TEXT NOT NULL CHECK (CASE WHEN json_valid(result_json) THEN json_type(result_json)='object' ELSE 0 END),
        created_at INTEGER NOT NULL CHECK (created_at>=0),
        PRIMARY KEY(actor_user_id,request_id)
    ) STRICT""",
}
# MA-020: durable, item-level journal. This table does not authorize deletion.
# A source item is never considered removed merely because an external call was sent.
DDL_V5_ADDITIONS = {
    "migration_finalizations": f"""CREATE TABLE migration_finalizations (
        finalization_id TEXT NOT NULL PRIMARY KEY CHECK ({_uuid('finalization_id')}),
        actor_user_id TEXT NOT NULL CHECK (length(trim(actor_user_id))>0),
        vault_profile_id TEXT NOT NULL CHECK (length(trim(vault_profile_id))>0),
        source_entity_id TEXT NOT NULL CHECK (length(trim(source_entity_id))>0),
        source_digest TEXT NOT NULL CHECK (length(source_digest)=64 AND source_digest NOT GLOB '*[^0-9a-f]*'),
        item_count INTEGER NOT NULL CHECK (item_count>=0),
        state TEXT NOT NULL DEFAULT 'prepared' CHECK (state IN ('prepared','removing','verified','blocked')),
        created_at INTEGER NOT NULL CHECK (created_at>=0),
        updated_at INTEGER NOT NULL CHECK (updated_at>=created_at)
    ) STRICT""",
    "migration_finalization_items": """CREATE TABLE migration_finalization_items (
        finalization_id TEXT NOT NULL REFERENCES migration_finalizations(finalization_id) ON DELETE RESTRICT,
        item_uid TEXT NOT NULL CHECK (length(item_uid)>0),
        item_digest TEXT NOT NULL CHECK (length(item_digest)=64 AND item_digest NOT GLOB '*[^0-9a-f]*'),
        location_id TEXT NOT NULL REFERENCES locations(location_id) ON DELETE RESTRICT,
        state TEXT NOT NULL DEFAULT 'pending' CHECK (state IN ('pending','requested','absence_verified')),
        updated_at INTEGER NOT NULL CHECK (updated_at>=0),
        PRIMARY KEY(finalization_id,item_uid)
    ) STRICT""",
    "idx_migration_finalizations_actor": """CREATE INDEX idx_migration_finalizations_actor ON migration_finalizations(actor_user_id,vault_profile_id,created_at)""",
}
# MA-020: permanently preserve original Local To-do payloads before any
# irreversible service-side delete. Backup survives a process/HA restart.
DDL_V6_ADDITIONS = {
    "migration_source_backups": """CREATE TABLE migration_source_backups (
        finalization_id TEXT NOT NULL REFERENCES migration_finalizations(finalization_id) ON DELETE RESTRICT,
        item_uid TEXT NOT NULL,
        source_sha TEXT NOT NULL CHECK (length(source_sha)=64 AND source_sha NOT GLOB '*[^0-9a-f]*'),
        source_json TEXT NOT NULL CHECK (json_valid(source_json) AND json_type(source_json)='object'),
        PRIMARY KEY(finalization_id,item_uid),
        FOREIGN KEY(finalization_id,item_uid) REFERENCES migration_finalization_items(finalization_id,item_uid) ON DELETE RESTRICT
    ) STRICT""",
}
DDL = {**DDL_V1, **DDL_V2_ADDITIONS, **DDL_V3_ADDITIONS, **DDL_V4_ADDITIONS, **DDL_V5_ADDITIONS, **DDL_V6_ADDITIONS}


def _objects(conn):
    return dict(conn.execute("SELECT name,sql FROM sqlite_schema WHERE name NOT LIKE 'sqlite_%'"))


def initialize_schema(conn: sqlite3.Connection) -> None:
    """Atomically advance v0/v1; preserve and validate all existing rows."""
    conn.execute("BEGIN IMMEDIATE")
    try:
        version = conn.execute("PRAGMA user_version").fetchone()[0]
        objects = _objects(conn)
        if version == 0:
            if objects:
                raise UnsupportedSchema("nonempty unversioned database")
            for statement in DDL_V1.values():
                conn.execute(statement)
            conn.execute("PRAGMA user_version=1")
            version = 1
        if version == 1:
            if _objects(conn) != DDL_V1:
                raise UnsupportedSchema("v1 schema identity mismatch")
            if conn.execute("PRAGMA foreign_key_check").fetchone() is not None:
                raise StorageIntegrityError("v1 foreign key check failed")
            # Migration is additive; the transaction preserves all v1 data on failure.
            for statement in DDL_V2_ADDITIONS.values():
                conn.execute(statement)
            conn.execute("PRAGMA user_version=2")
            version = 2
        if version == 2:
            expected_v2 = {**DDL_V1, **DDL_V2_ADDITIONS}
            if _objects(conn) != expected_v2:
                raise UnsupportedSchema("v2 schema identity mismatch")
            if conn.execute("PRAGMA foreign_key_check").fetchone() is not None:
                raise StorageIntegrityError("v2 foreign key check failed")
            for statement in DDL_V3_ADDITIONS.values():
                conn.execute(statement)
            conn.execute("PRAGMA user_version=3")
            version = 3
        if version == 3:
            expected_v3 = {**DDL_V1, **DDL_V2_ADDITIONS, **DDL_V3_ADDITIONS}
            if _objects(conn) != expected_v3:
                raise UnsupportedSchema("v3 schema identity mismatch")
            if conn.execute("PRAGMA foreign_key_check").fetchone() is not None:
                raise StorageIntegrityError("v3 foreign key check failed")
            for statement in DDL_V4_ADDITIONS.values():
                conn.execute(statement)
            conn.execute("PRAGMA user_version=4")
            version = 4
        if version == 4:
            expected_v4 = {**DDL_V1, **DDL_V2_ADDITIONS, **DDL_V3_ADDITIONS, **DDL_V4_ADDITIONS}
            if _objects(conn) != expected_v4:
                raise UnsupportedSchema("v4 schema identity mismatch")
            if conn.execute("PRAGMA foreign_key_check").fetchone() is not None:
                raise StorageIntegrityError("v4 foreign key check failed")
            for statement in DDL_V5_ADDITIONS.values():
                conn.execute(statement)
            conn.execute("PRAGMA user_version=5")
            version = 5
        if version == 5:
            expected_v5 = {**DDL_V1, **DDL_V2_ADDITIONS, **DDL_V3_ADDITIONS, **DDL_V4_ADDITIONS, **DDL_V5_ADDITIONS}
            if _objects(conn) != expected_v5:
                raise UnsupportedSchema("v5 schema identity mismatch")
            if conn.execute("PRAGMA foreign_key_check").fetchone() is not None:
                raise StorageIntegrityError("v5 foreign key check failed")
            for statement in DDL_V6_ADDITIONS.values():
                conn.execute(statement)
            conn.execute("PRAGMA user_version=6")
            version = 6
        if version != SCHEMA_VERSION:
            raise UnsupportedSchema(f"unsupported schema version {version}")
        if _objects(conn) != DDL:
            raise UnsupportedSchema("schema identity mismatch")
        if conn.execute("PRAGMA foreign_key_check").fetchone() is not None:
            raise StorageIntegrityError("schema foreign key check failed")
        if conn.execute("PRAGMA quick_check").fetchall() != [("ok",)]:
            raise StorageIntegrityError("schema integrity check failed")
        conn.commit()
    except BaseException:
        conn.rollback()
        raise
