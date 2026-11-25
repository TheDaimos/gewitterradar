"""MA-010: internal transactional repositories; no HA authorization or live ingestion."""
from collections.abc import Mapping
import sqlite3

from .database import Database


class RepositoryError(RuntimeError):
    """Stable technical error without SQL values or private payloads."""


class RevisionConflict(RepositoryError):
    pass


class MissingRecord(RepositoryError):
    pass


class ConstraintViolation(RepositoryError):
    pass


class ReplayConflict(RepositoryError):
    pass


# Only internal static identifiers can enter SQL. Values are always bound.
_FIELDS = {
    "locations": "location_id name lat lon created_at updated_at monitor_enabled paused record_enabled mode record_radius_m alarm_radius_linked alarm_radius_m entities_enabled",
    "profile_links": "link_id location_id ha_user_id vault_profile_id",
    "profile_preferences": "link_id push_enabled critical_enabled notification_mode closure_enabled quiet_minutes status_push display_settings_json",
    "notification_targets": "link_id target_key verified_state",
    "tracker_refs": "location_id stable_slug unique_id actual_entity_id display_name lifecycle_state",
    "lightning_reports": "report_id location_id source_key source_event_id replay_key observed_at received_at time_quality strike_lat strike_lon location_lat location_lon distance_m record_radius_m alarm_radius_m location_revision provenance_json",
    "possible_duplicates": "location_id report_a report_b reason evidence_json rule_version",
    "sessions": "session_id location_id started_at last_event_at status closed_at event_count min_distance_m gap_seen",
    "session_reports": "location_id session_id report_id",
    "source_gaps": "gap_id source_key location_id started_at ended_at cause coverage_confidence",
    "runtime_checkpoint": "singleton last_observed_at clean_shutdown generation",
}
_FIELDS = {name: frozenset(fields.split()) for name, fields in _FIELDS.items()}
_KEYS = {"locations":"location_id", "profile_links":"link_id", "profile_preferences":"link_id",
         "tracker_refs":"location_id", "lightning_reports":"report_id", "sessions":"session_id",
         "source_gaps":"gap_id", "runtime_checkpoint":"singleton"}
_PATCH = {
    "locations": _FIELDS["locations"] - {"location_id","created_at"},
    "profile_preferences": _FIELDS["profile_preferences"] - {"link_id"},
    "tracker_refs": frozenset({"actual_entity_id","display_name","lifecycle_state"}),
    "sessions": _FIELDS["sessions"] - {"session_id","location_id","started_at"},
}


def _values(table, values, *, patch=False):
    data = dict(values)
    allowed = _PATCH[table] if patch else _FIELDS[table]
    if not data or not data.keys() <= allowed:
        raise ValueError("invalid repository fields")
    if any(type(v) not in (str,int,float,bool,type(None)) for v in data.values()):
        raise ValueError("only SQLite scalar values permitted")
    return data


def _insert(c, table, data):
    fields = ",".join(data)
    c.execute(f"INSERT INTO {table} ({fields}) VALUES ({','.join('?' for _ in data)})", tuple(data.values()))


def _read(c, table, key):
    cursor = c.execute(f"SELECT * FROM {table} WHERE {_KEYS[table]}=?", (key,))
    row = cursor.fetchone()
    return None if row is None else dict(zip((d[0] for d in cursor.description), row))


def _update(c, table, key, expected, data):
    if type(expected) is not int or expected < 1:
        raise ValueError("invalid expected revision")
    old = _read(c, table, key)
    if old is None:
        raise MissingRecord("record not found")
    if old["revision"] != expected:
        raise RevisionConflict("revision_conflict")
    if table == "locations":
        if any(k in data and data[k] != old[k] for k in ("lat","lon")):
            if c.execute("SELECT 1 FROM lightning_reports WHERE location_id=? LIMIT 1",(key,)).fetchone():
                raise ConstraintViolation("history_exists")
        if "updated_at" not in data or data["updated_at"] < old["updated_at"]:
            raise ValueError("explicit nondecreasing updated_at required")
    assignments = ",".join(k+"=?" for k in data)
    cursor = c.execute(f"UPDATE {table} SET {assignments},revision=revision+1 WHERE {_KEYS[table]}=? AND revision=?",
                       (*data.values(),key,expected))
    if cursor.rowcount != 1:
        raise RevisionConflict("revision_conflict")
    return _read(c,table,key)


class Repositories:
    """Technical ports for trusted callers, with no external SQL or authorization."""
    def __init__(self, database: Database):
        self._db = database

    async def _write(self, operation):
        def transaction(c):
            c.execute("BEGIN IMMEDIATE")
            try:
                result = operation(c)
                c.commit()
                return result
            except sqlite3.IntegrityError as exc:
                c.rollback()
                code = getattr(exc,"sqlite_errorname","SQLITE_CONSTRAINT")
                raise ConstraintViolation(code) from None
            except BaseException:
                c.rollback()
                raise
        return await self._db.async_execute(transaction, kind="write")

    async def _get(self, table, key):
        return await self._db.async_execute(lambda c: _read(c,table,key), kind="read")

    async def _create(self, table, values):
        data = _values(table,values)
        key = data[_KEYS[table]]
        def op(c):
            _insert(c,table,data)
            return _read(c,table,key)
        return await self._write(op)

    async def _change(self, table, key, expected_revision, values):
        data = _values(table,values,patch=True)
        return await self._write(lambda c: _update(c,table,key,expected_revision,data))

    async def create_location(self, values, *, link=None, preferences=None):
        data = _values("locations",values)
        linked = None if link is None else _values("profile_links",link)
        prefs = None if preferences is None else _values("profile_preferences",preferences)
        if linked is not None and linked.get("location_id") != data["location_id"]:
            raise ValueError("location/link mismatch")
        if prefs is not None and (linked is None or prefs.get("link_id") != linked.get("link_id")):
            raise ValueError("link/preferences mismatch")
        def op(c):
            _insert(c,"locations",data)
            if linked is not None:
                _insert(c,"profile_links",linked)
                _insert(c,"profile_preferences",prefs if prefs is not None else {"link_id":linked["link_id"]})
            return _read(c,"locations",data["location_id"])
        return await self._write(op)

    async def get_location(self, location_id):
        return await self._get("locations",location_id)

    async def update_location(self, location_id, expected_revision, values):
        return await self._change("locations",location_id,expected_revision,values)

    async def create_link(self, values, *, preferences=None):
        data = _values("profile_links",values)
        prefs = _values("profile_preferences",preferences) if preferences is not None else {"link_id":data["link_id"]}
        if prefs.get("link_id") != data["link_id"]:
            raise ValueError("link/preferences mismatch")
        def op(c):
            _insert(c,"profile_links",data)
            _insert(c,"profile_preferences",prefs)
            return _read(c,"profile_links",data["link_id"])
        return await self._write(op)

    async def get_link(self, link_id):
        return await self._get("profile_links",link_id)

    async def get_preferences(self, link_id):
        return await self._get("profile_preferences",link_id)

    async def update_preferences(self, link_id, expected_revision, values):
        return await self._change("profile_preferences",link_id,expected_revision,values)

    async def replace_notification_targets(self, link_id, expected_revision, targets):
        # Preferences revision serializes target-set changes as well.
        data = [_values("notification_targets",target) for target in targets]
        if any(t.get("link_id") != link_id for t in data):
            raise ValueError("target/link mismatch")
        def op(c):
            old = _read(c,"profile_preferences",link_id)
            if old is None:
                raise MissingRecord("record not found")
            result = _update(c,"profile_preferences",link_id,expected_revision,{"push_enabled":old["push_enabled"]})
            c.execute("DELETE FROM notification_targets WHERE link_id=?",(link_id,))
            for target in data:
                _insert(c,"notification_targets",target)
            return result
        return await self._write(op)

    async def create_tracker(self, values):
        return await self._create("tracker_refs",values)

    async def get_tracker(self, location_id):
        return await self._get("tracker_refs",location_id)

    async def update_tracker(self, location_id, expected_revision, values):
        return await self._change("tracker_refs",location_id,expected_revision,values)

    async def get_report(self, report_id):
        return await self._get("lightning_reports",report_id)

    async def store_report(self, values, *, session_id=None, session_revision=None, session_values=None):
        """Immutable report; exact replay returns original row, no repeated session mutation."""
        data = _values("lightning_reports",values)
        change = None if session_values is None else _values("sessions",session_values,patch=True)
        if (session_id is None) != (change is None) or (session_id is None) != (session_revision is None):
            raise ValueError("session update requires identity, revision and values")
        if data.get("replay_key") == "":
            raise ValueError("empty replay key")
        def op(c):
            if data.get("replay_key") is not None:
                row = c.execute("SELECT report_id FROM lightning_reports WHERE location_id=? AND source_key=? AND replay_key=?",
                                (data["location_id"],data["source_key"],data["replay_key"])).fetchone()
                if row:
                    original = _read(c,"lightning_reports",row[0])
                    # Delivery timestamp and locally allocated report ID can differ on replay.
                    if any(original[k] != v for k,v in data.items() if k not in ("report_id","received_at")):
                        raise ReplayConflict("replay_conflict")
                    return {"report":original,"inserted":False}
            _insert(c,"lightning_reports",data)
            result = {"report":_read(c,"lightning_reports",data["report_id"]),"inserted":True}
            if session_id is not None:
                _insert(c,"session_reports",{"location_id":data["location_id"],"session_id":session_id,"report_id":data["report_id"]})
                result["session"] = _update(c,"sessions",session_id,session_revision,change)
            return result
        return await self._write(op)

    async def record_possible_duplicate(self, values):
        data = _values("possible_duplicates",values)
        return await self._write(lambda c: (_insert(c,"possible_duplicates",data),dict(data))[1])

    async def create_session(self, values):
        return await self._create("sessions",values)

    async def get_session(self, session_id):
        return await self._get("sessions",session_id)

    async def update_session(self, session_id, expected_revision, values):
        return await self._change("sessions",session_id,expected_revision,values)

    async def create_gap(self, values):
        return await self._create("source_gaps",values)

    async def close_gap(self, gap_id, ended_at):
        def op(c):
            cursor = c.execute("UPDATE source_gaps SET ended_at=? WHERE gap_id=? AND ended_at IS NULL",(ended_at,gap_id))
            if cursor.rowcount != 1:
                raise RevisionConflict("gap missing or already closed")
            return _read(c,"source_gaps",gap_id)
        if type(ended_at) is not int:
            raise ValueError("explicit end timestamp required")
        return await self._write(op)

    async def get_checkpoint(self):
        return await self._get("runtime_checkpoint",1)

    async def update_checkpoint(self, *, expected_generation, last_observed_at, clean_shutdown, generation):
        data = _values("runtime_checkpoint",dict(singleton=1,last_observed_at=last_observed_at,clean_shutdown=clean_shutdown,generation=generation))
        def op(c):
            old = _read(c,"runtime_checkpoint",1)
            if old is None:
                if expected_generation is not None:
                    raise RevisionConflict("checkpoint_conflict")
                _insert(c,"runtime_checkpoint",data)
            else:
                if old["generation"] != expected_generation or generation <= expected_generation:
                    raise RevisionConflict("checkpoint_conflict")
                c.execute("UPDATE runtime_checkpoint SET last_observed_at=?,clean_shutdown=?,generation=? WHERE singleton=1",
                          (last_observed_at,clean_shutdown,generation))
            return _read(c,"runtime_checkpoint",1)
        return await self._write(op)
