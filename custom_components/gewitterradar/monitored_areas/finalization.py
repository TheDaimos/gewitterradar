"""MA-020: recoverable, fail-closed Local To-do finalization.

The journal records a delete intent BEFORE any external Home Assistant action.
Neither a successful service call nor a lost connection is proof of deletion:
only a fresh HA readback may confirm absence. The list entity is never deleted.
"""
from __future__ import annotations

import asyncio
from dataclasses import dataclass
import json
import secrets
import time
from uuid import uuid4

from .migration import _hash, _parse
from .storage.repositories import Repositories

SOURCE_ENTITY = "todo.gewitterradar_orte"
TTL_SECONDS = 300


class FinalizationError(RuntimeError):
    def __init__(self, code):
        self.code = code
        super().__init__(code)


@dataclass(frozen=True)
class Approval:
    actor: str
    profile: str
    source_digest: str
    deadline: float


def _canonical(items):
    if not isinstance(items, list) or len(items) > 10000:
        raise FinalizationError("migration_source_invalid")
    records = {}
    for item in items:
        record, reason = _parse(item)
        if reason or record is None or record["status"] != "needs_action":
            raise FinalizationError("migration_incomplete")
        uid = record["uid"]
        if len(uid) > 160 or uid in records:
            raise FinalizationError("migration_duplicate_uid")
        # HA's item argument may resolve a summary as well as a UID. Avoid
        # ambiguous selectors, even if HA's internal lookup order changes.
        records[uid] = {
            "uid": uid,
            "summary": item.get("summary"),
            "description": item.get("description"),
            "status": item.get("status"),
            "record": record,
        }
    if not records:
        raise FinalizationError("migration_empty_source")
    names = [r["summary"] for r in records.values()]
    if any(uid in names and records[uid]["summary"] != uid for uid in records):
        raise FinalizationError("migration_ambiguous_selector")
    return records


def _source_digest(records):
    return _hash(sorted(
        ({"uid": x["uid"], "summary": x["summary"],
          "description": x["description"], "status": x["status"]}
         for x in records.values()), key=lambda x: x["uid"]))


def _item_digest(item):
    return _hash({k: item[k] for k in ("uid", "summary", "description", "status")})


def _lookup_receipt(c, actor, profile, digest, records):
    matches = []
    for (blob,) in c.execute(
        "SELECT result_json FROM request_receipts "
        "WHERE actor_user_id=? AND operation='migration_commit'", (actor,)
    ):
        result = json.loads(blob)
        if result.get("source_digest") != digest:
            continue
        imported = result.get("imported", [])
        if len(imported) != len(records):
            continue
        if {x.get("uid") for x in imported} != set(records):
            continue
        if any(x.get("action") not in ("create", "use_existing", "replace")
               for x in imported):
            continue
        mapping = {}
        for entry in imported:
            uid, location_id = entry["uid"], entry["location_id"]
            row = c.execute(
                "SELECT l.name,l.lat,l.lon FROM locations l "
                "JOIN profile_links p ON p.location_id=l.location_id "
                "WHERE l.location_id=? AND p.ha_user_id=? AND p.vault_profile_id=?",
                (location_id, actor, profile)).fetchone()
            rec = records[uid]["record"]
            # Source coordinates/names must actually match the durable target.
            if row is None or row[0] != rec["name"] or (
                abs(row[1] - rec["lat"]) > 1e-9 or
                abs(row[2] - rec["lon"]) > 1e-9
            ):
                break
            mapping[uid] = location_id
        if len(mapping) == len(records):
            matches.append(mapping)
    if not matches or any(m != matches[0] for m in matches[1:]):
        raise FinalizationError("migration_unverified_import")
    return matches[0]


class Finalizer:
    def __init__(self, repositories: Repositories, ownership, fetch_source,
                 remove_item, *, source_entity=SOURCE_ENTITY):
        self._repo = repositories
        self._ownership = ownership
        self._fetch = fetch_source
        self._remove = remove_item
        self._source_entity = source_entity
        self._lock = asyncio.Lock()
        self._approvals = {}

    async def _read_source(self):
        try:
            return _canonical(await self._fetch())
        except FinalizationError:
            raise
        except Exception as exc:
            raise FinalizationError("migration_source_unavailable") from exc

    async def mode(self, actor, profile):
        await self._ownership.require_profile(actor, profile)
        def read(c):
            return c.execute(
                "SELECT 1 FROM migration_finalizations WHERE actor_user_id=? "
                "AND vault_profile_id=? AND state='verified' LIMIT 1",
                (actor, profile)).fetchone() is not None
        return "db_active" if await self._repo._db.async_execute(read, kind="read") else "migration_pending"

    async def preview(self, *, actor, profile, is_admin):
        if is_admin is not True:
            raise FinalizationError("forbidden")
        await self._ownership.require_profile(actor, profile)
        async with self._lock:
            records = await self._read_source()
            digest = _source_digest(records)
            def inspect(c):
                existing = c.execute(
                    "SELECT finalization_id,source_digest,state FROM migration_finalizations "
                    "WHERE actor_user_id=? AND vault_profile_id=? "
                    "ORDER BY created_at DESC LIMIT 1", (actor, profile)).fetchone()
                if existing and existing[2] == "verified":
                    raise FinalizationError("migration_already_finalized")
                if existing:
                    if existing[1] != digest and existing[2] == "prepared":
                        raise FinalizationError("migration_source_changed")
                    self._reconcile(c, existing[0], records, mutate=False)
                    return existing[0], True
                _lookup_receipt(c, actor, profile, digest, records)
                return None, False
            saga_id, resume = await self._repo._db.async_execute(inspect, kind="read")
            token = secrets.token_urlsafe(32)
            self._approvals[token] = Approval(actor, profile, digest, time.monotonic() + TTL_SECONDS)
            self._approvals = {k:v for k,v in self._approvals.items()
                               if v.deadline > time.monotonic()}
            return {"nonce":token, "expires_in_seconds":TTL_SECONDS,
                    "source_entity_id":self._source_entity,
                    "item_count":len(records), "resume":resume,
                    "requires_admin":True, "explicit_confirmation_required":True}

    def _reconcile(self, c, saga_id, records, *, mutate):
        rows = c.execute(
            "SELECT item_uid,item_digest,location_id,state FROM migration_finalization_items "
            "WHERE finalization_id=?", (saga_id,)).fetchall()
        if not rows:
            raise FinalizationError("migration_journal_incomplete")
        known = {uid:(digest,lid,state) for uid,digest,lid,state in rows}
        if not set(records).issubset(known):
            raise FinalizationError("migration_source_changed")
        changes = []
        for uid, (digest,lid,state) in known.items():
            row = c.execute(
                "SELECT l.location_id FROM locations l JOIN profile_links p "
                "ON p.location_id=l.location_id WHERE l.location_id=? "
                "AND p.ha_user_id=(SELECT actor_user_id FROM migration_finalizations WHERE finalization_id=?) "
                "AND p.vault_profile_id=(SELECT vault_profile_id FROM migration_finalizations WHERE finalization_id=?)",
                (lid,saga_id,saga_id)).fetchone()
            if row is None:
                raise FinalizationError("migration_target_changed")
            if uid in records:
                if _item_digest(records[uid]) != digest or state == "absence_verified":
                    raise FinalizationError("migration_source_changed")
            elif state == "pending":
                raise FinalizationError("migration_unexpected_absence")
            elif state == "requested":
                changes.append(uid)
        if mutate:
            for uid in changes:
                c.execute(
                    "UPDATE migration_finalization_items SET state='absence_verified',updated_at=? "
                    "WHERE finalization_id=? AND item_uid=?",
                    (time.time_ns()//1000,saga_id,uid))
        return known

    async def commit(self, *, actor, profile, is_admin, nonce, explicit):
        if is_admin is not True:
            raise FinalizationError("forbidden")
        await self._ownership.require_profile(actor, profile)
        if explicit is not True or not isinstance(nonce, str):
            raise FinalizationError("confirmation_required")
        async with self._lock:
            approval = self._approvals.pop(nonce, None)
            if (approval is None or approval.actor != actor or approval.profile != profile
                    or approval.deadline <= time.monotonic()):
                raise FinalizationError("confirmation_expired")
            records = await self._read_source()
            digest = _source_digest(records)
            # For a resumable, partially deleted saga the current digest differs.
            def begin(c):
                existing = c.execute(
                    "SELECT finalization_id,source_digest,state FROM migration_finalizations "
                    "WHERE actor_user_id=? AND vault_profile_id=? "
                    "ORDER BY created_at DESC LIMIT 1", (actor,profile)).fetchone()
                if existing:
                    if existing[2] == "verified":
                        return existing[0]
                    self._reconcile(c,existing[0],records,mutate=True)
                    return existing[0]
                if digest != approval.source_digest:
                    raise FinalizationError("migration_source_changed")
                mapping = _lookup_receipt(c,actor,profile,digest,records)
                saga_id = str(uuid4())
                now = time.time_ns()//1000
                c.execute(
                    "INSERT INTO migration_finalizations VALUES(?,?,?,?,?,?,?,?,?)",
                    (saga_id,actor,profile,self._source_entity,digest,
                     len(records),"prepared",now,now))
                for uid,loc in mapping.items():
                    c.execute(
                        "INSERT INTO migration_finalization_items VALUES(?,?,?,?,?,?)",
                        (saga_id,uid,_item_digest(records[uid]),loc,"pending",now))
                return saga_id
            saga_id = await self._repo._write(begin)
            while True:
                # Each step is reconciled against the latest supported HA read.
                records = await self._read_source()
                def select(c):
                    known = self._reconcile(c,saga_id,records,mutate=True)
                    next_uid = next((uid for uid,(_,_,s) in known.items()
                                     if s != "absence_verified" and uid in records), None)
                    if next_uid is not None:
                        now = time.time_ns()//1000
                        c.execute("UPDATE migration_finalization_items "
                                  "SET state='requested',updated_at=? "
                                  "WHERE finalization_id=? AND item_uid=?", (now,saga_id,next_uid))
                        c.execute("UPDATE migration_finalizations SET state='removing',updated_at=? "
                                  "WHERE finalization_id=?", (now,saga_id))
                    return next_uid
                uid = await self._repo._write(select)
                if uid is None:
                    if records:
                        raise FinalizationError("migration_incomplete")
                    def finish(c):
                        remaining = self._reconcile(c,saga_id,{},mutate=True)
                        if not remaining or any(x[2] != "absence_verified" for x in remaining.values()):
                            raise FinalizationError("migration_journal_incomplete")
                        c.execute("UPDATE migration_finalizations SET state='verified',updated_at=? "
                                  "WHERE finalization_id=?", (time.time_ns()//1000,saga_id))
                        return {"mode":"db_active","legacy_list_preserved":True,
                                "items_removed":len(remaining)}
                    return await self._repo._write(finish)
                try:
                    await self._remove(uid)
                except Exception as exc:
                    # Service call might have completed before disconnect. Preserve
                    # requested and let a subsequent authorized preview reconcile.
                    raise FinalizationError("migration_remove_uncertain") from exc
                after = await self._read_source()
                if uid in after:
                    raise FinalizationError("migration_remove_unverified")
                await self._repo._write(
                    lambda c: self._reconcile(c,saga_id,after,mutate=True))
