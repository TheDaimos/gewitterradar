"""MA-015 authenticated WebSocket commands over the MA v4 transactional store.

No WebSocket identity fields grant rights. All actor/admin properties come from
the Home Assistant connection. A missing or unverifiable Vault denies access.
"""
from __future__ import annotations

import hashlib
import json
import time
from uuid import UUID, uuid4

from .identity import Links, ProfileNotVerified
from .locations import _coord, _name
from .migration import MigrationPreview, MigrationSourceError, _hash as _migration_hash
from .finalization import Finalizer, FinalizationError
from .permissions import Protection, ConfirmationRequired, ProtectionDenied, _snapshot_digest
from .storage import repositories as sql
from .storage.database import DatabaseUnavailable
from .storage.errors import StorageError

PREFIX = "gewitterradar/monitored_areas/"
OPS = (
    "status", "locations_list", "places_list", "migration_preview", "migration_commit",
    "migration_finalize_preview", "migration_finalize_commit", "location_get", "location_create", "location_update",
    "location_archive", "location_restore",
    "monitoring_update", "links_list", "links_share", "links_transfer", "links_remove",
    "links_remove_preview", "history_reset_preview", "history_reset_commit", "preferences_update",
)
MUTATIONS = {"migration_commit","location_create", "location_update", "monitoring_update",
             "location_archive", "location_restore",
             "links_share", "links_transfer", "links_remove", "history_reset_commit", "preferences_update"}
MA_API_REGISTERED = "gewitterradar_ma_api_registered"


class ApiError(RuntimeError):
    def __init__(self, code):
        self.code = code
        super().__init__(code)


def _uuid(value):
    try:
        parsed = UUID(value, version=4)
    except (ValueError, AttributeError, TypeError) as exc:
        raise ApiError("invalid_request") from exc
    if parsed.version != 4 or str(parsed) != value:
        raise ApiError("invalid_request")
    return value


def _payload(request, expected):
    value = request.get("payload", {})
    if not isinstance(value, dict) or not set(value) <= set(expected):
        raise ApiError("invalid_request")
    return value


def _hash(op, request):
    try:
        blob = json.dumps([op, request], sort_keys=True, allow_nan=False,
                          separators=(",", ":"), ensure_ascii=True).encode("ascii")
    except (TypeError, ValueError, OverflowError) as exc:
        raise ApiError("invalid_request") from exc
    if len(blob) > 16384:
        raise ApiError("invalid_request")
    return hashlib.sha256(blob).hexdigest()


def _actor_link(c, location_id, actor_user_id, profile_id):
    row = c.execute(
        "SELECT link_id FROM profile_links WHERE location_id=? AND ha_user_id=? AND vault_profile_id=?",
        (location_id, actor_user_id, profile_id)).fetchone()
    if row is None:
        raise ApiError("not_found")
    return row[0]


def _location(c, location_id):
    item = sql._read(c, "locations", location_id)
    if item is None:
        raise ApiError("not_found")
    return item


def _revision(request):
    value = request.get("expected_revision")
    if type(value) is not int or value < 1:
        raise ApiError("invalid_request")
    return value


def _authorize_cached_result(c, actor, profile, op, request, result, is_admin):
    """Re-check CURRENT location/link ownership before revealing a prior result.

    A receipt proves a prior commit, not continued authorization. In particular
    destructive operations cannot replay private data after the last link
    disappeared. Check on the worker in the same transaction as receipt reading.
    """
    payload = request.get("payload", {})
    if ((op == "history_reset_commit" or
         (op == "links_remove" and payload.get("explicit_final") is True))
         and is_admin is not True):
        raise ApiError("forbidden")
    if op == "migration_commit":
        for imported in result.get("imported",[]):
            location_id = imported.get("location_id")
            if location_id is not None:
                _actor_link(c, location_id, actor, profile)
        return
    if op == "location_create":
        location_id = result.get("location", {}).get("location_id")
    elif op == "preferences_update":
        link_id = payload.get("link_id")
        row = c.execute(
            "SELECT location_id FROM profile_links WHERE link_id=? AND ha_user_id=? AND vault_profile_id=?",
            (link_id, actor, profile)).fetchone()
        if row is None:
            raise ApiError("not_found")
        location_id = row[0]
    else:
        location_id = payload.get("location_id")
    if not isinstance(location_id, str):
        raise ApiError("not_found")
    _actor_link(c, location_id, actor, profile)


class Api:
    def __init__(self, database, vault, *, target_user_active=None, fetch_legacy_items=None,
                 remove_legacy_item=None):
        self._repo = sql.Repositories(database)
        self._links = Links(self._repo, vault)
        self._protect = Protection(self._repo)
        self._target_active = target_user_active
        self._migration = (MigrationPreview(self._repo,self._links,fetch_legacy_items)
                           if callable(fetch_legacy_items) else None)
        self._finalizer = (Finalizer(self._repo,self._links,fetch_legacy_items,remove_legacy_item)
                           if callable(fetch_legacy_items) and callable(remove_legacy_item) else None)

    async def _write(self, actor, op, request, fn, *, is_admin=False):
        request_id = _uuid(request.get("request_id"))
        digest = _hash(op, request)
        def transaction(c):
            row = c.execute(
                "SELECT operation,payload_hash,result_json FROM request_receipts WHERE actor_user_id=? AND request_id=?",
                (actor, request_id)).fetchone()
            if row is not None:
                if row[0] != op or row[1] != digest:
                    raise ApiError("request_conflict")
                prior = json.loads(row[2])
                _authorize_cached_result(c, actor, request.get("profile_id"),
                                         op, request, prior, is_admin)
                return prior
            result = fn(c)
            if type(result) is not dict:
                raise RuntimeError("invalid mutation result")
            c.execute(
                "INSERT INTO request_receipts(actor_user_id,request_id,operation,payload_hash,result_json,created_at) VALUES(?,?,?,?,?,?)",
                (actor,request_id,op,digest,json.dumps(result,sort_keys=True,allow_nan=False),time.time_ns()//1000))
            return result
        return await self._repo._write(transaction)

    async def _existing_receipt(self, actor, op, request, *, is_admin=False):
        """Resolve a committed retry before access to a possibly deleted object."""
        request_id = _uuid(request.get("request_id"))
        digest = _hash(op, request)
        def read(c):
            row = c.execute(
                "SELECT operation,payload_hash,result_json FROM request_receipts "
                "WHERE actor_user_id=? AND request_id=?", (actor,request_id)
            ).fetchone()
            if row is None:
                return None
            if row[0]!=op or row[1]!=digest:
                raise ApiError("request_conflict")
            prior = json.loads(row[2])
            _authorize_cached_result(c, actor, request.get("profile_id"),
                                     op, request, prior, is_admin)
            return prior
        return await self._repo._db.async_execute(read,kind="read")

    async def dispatch(self, *, actor_user_id, is_admin, op, request):
        if not actor_user_id:
            raise ApiError("unauthorized")
        if op not in OPS or not isinstance(request,dict) or not set(request) <= {
            "profile_id", "payload", "request_id", "expected_revision"}:
            raise ApiError("invalid_request")
        if op=="status":
            mode = "migration_pending"
            if self._finalizer is not None and request.get("profile_id") is not None:
                mode = await self._finalizer.mode(actor_user_id,request["profile_id"])
            return {"schema":1,"enabled":True,"capabilities":{
                "locations":True,"links":True,"preferences":True,"tracker_create":False,
                "monitoring_active":False,"notifications":False,"exports":False,"history_reset":True,
                "saved_places_mode":mode,
                "migration_preview":self._migration is not None,
                "migration_finalize":self._finalizer is not None}}
        profile=request.get("profile_id")
        await self._links.require_profile(actor_user_id,profile)
        payload=_payload(request, {
            "location_id","link_id","name","lat","lon","monitor_enabled","paused",
            "record_enabled","mode","record_radius_m","alarm_radius_linked",
            "alarm_radius_m","target_user_id","target_profile_id","notification_mode",
            "push_enabled","critical_enabled","closure_enabled","quiet_minutes",
            "status_push","display_settings_json","confirmation_nonce",
            "explicit_final","limit","query","cursor","preview_id","decisions","nonce","include_archived"})
        if op in MUTATIONS:
            if not request.get("request_id"):
                raise ApiError("invalid_request")
            replay = await self._existing_receipt(actor_user_id,op,request,is_admin=is_admin)
            if replay is not None:
                return replay
        if op=="migration_finalize_preview":
            if payload or self._finalizer is None:
                raise ApiError("invalid_request" if payload else "migration_source_unavailable")
            return await self._finalizer.preview(actor=actor_user_id,profile=profile,is_admin=is_admin)
        if op=="migration_finalize_commit":
            if self._finalizer is None or set(payload)!={"nonce","explicit_final"}:
                raise ApiError("invalid_request")
            _uuid(request.get("request_id"))
            return await self._finalizer.commit(actor=actor_user_id,profile=profile,
                is_admin=is_admin,nonce=payload["nonce"],explicit=payload["explicit_final"])
        if op=="migration_preview":
            if payload:
                raise ApiError("invalid_request")
            if self._migration is None:
                raise ApiError("migration_source_unavailable")
            return await self._migration.build(actor_user_id=actor_user_id,profile_id=profile)
        if op=="migration_commit":
            if self._migration is None:
                raise ApiError("migration_source_unavailable")
            if set(payload)!={"preview_id","decisions"}:
                raise ApiError("invalid_request")
            old_id=payload["preview_id"]
            decisions=payload["decisions"]
            if (not isinstance(old_id,str) or len(old_id)!=64 or
                not isinstance(decisions,list) or len(decisions)>1000):
                raise ApiError("invalid_request")
            # Fresh HA source and worker-backed profile view. The client can
            # select decisions, never supply/import arbitrary coordinates.
            snapshot=await self._migration.build(actor_user_id=actor_user_id,profile_id=profile)
            if snapshot["preview_id"]!=old_id:
                raise ApiError("migration_preview_stale")
            candidates={x["uid"]:x for x in snapshot["candidates"]}
            if len(candidates)!=len(snapshot["candidates"]):
                raise ApiError("migration_duplicate_uid")
            if len(decisions)!=len(candidates):
                raise ApiError("migration_decisions_incomplete")
            choices={}
            for d in decisions:
                if not isinstance(d,dict) or not set(d) <= {"uid","action","location_id","expected_revision"}:
                    raise ApiError("invalid_request")
                uid=d.get("uid")
                if not isinstance(uid,str) or len(uid)>160:
                    raise ApiError("invalid_request")
                action=d.get("action")
                if uid not in candidates or uid in choices or action not in ("create","use_existing","replace","skip"):
                    raise ApiError("invalid_request")
                if action in ("use_existing","replace"):
                    location_id=_uuid(d.get("location_id"))
                    if action=="replace" and (
                        type(d.get("expected_revision")) is not int or d["expected_revision"]<1):
                        raise ApiError("invalid_request")
                elif set(d)!={"uid","action"}:
                    raise ApiError("invalid_request")
                choices[uid]=d
            if set(choices)!=set(candidates):
                raise ApiError("migration_decisions_incomplete")
            def mutate(c):
                # Bound to the SAME transaction as all INSERT/UPDATEs and
                # the idempotency receipt; no stale SQLite snapshot may import.
                rows=c.execute("""
                    SELECT l.location_id,l.name,l.lat,l.lon,l.revision
                    FROM locations l JOIN profile_links p ON p.location_id=l.location_id
                    WHERE p.ha_user_id=? AND p.vault_profile_id=?
                    ORDER BY l.location_id
                """,(actor_user_id,profile)).fetchall()
                current=[dict(zip(("location_id","name","lat","lon","revision"),row)) for row in rows]
                if _migration_hash(current)!=snapshot["db_digest"]:
                    raise ApiError("migration_preview_stale")
                imported=[]
                now=time.time_ns()//1000
                for uid,d in choices.items():
                    candidate=candidates[uid]
                    if candidate["status"]!="needs_action" and d["action"]!="skip":
                        raise ApiError("migration_inactive_source")
                    action=d["action"]
                    if action=="skip":
                        continue
                    if action=="create":
                        location_id=str(uuid4())
                        link_id=str(uuid4())
                        sql._insert(c,"locations",dict(location_id=location_id,
                            name=candidate["name"],lat=candidate["lat"],
                            lon=candidate["lon"],created_at=now,updated_at=now))
                        sql._insert(c,"profile_links",dict(link_id=link_id,
                            location_id=location_id,ha_user_id=actor_user_id,
                            vault_profile_id=profile))
                        sql._insert(c,"profile_preferences",{"link_id":link_id})
                    else:
                        location_id=d["location_id"]
                        _actor_link(c,location_id,actor_user_id,profile)
                        if action=="replace":
                            sql._update(c,"locations",location_id,d["expected_revision"],
                                {"name":candidate["name"],"lat":candidate["lat"],
                                 "lon":candidate["lon"],"updated_at":now})
                    imported.append({"uid":uid,"location_id":location_id,"action":action})
                return {"imported":imported,"profile_id":profile,
                        "source_digest":snapshot["source_digest"],
                        "legacy_preserved":True,"mode":"migration_pending"}
            return await self._write(actor_user_id,op,request,mutate,is_admin=is_admin)

        if op=="locations_list":
            limit=payload.get("limit",50)
            if type(limit) is not int or not 1<=limit<=100:
                raise ApiError("invalid_request")
            def read(c):
                cursor=c.execute("""SELECT l.location_id,l.name,l.lat,l.lon,l.revision
                    FROM locations l JOIN profile_links p ON p.location_id=l.location_id
                    WHERE p.ha_user_id=? AND p.vault_profile_id=?
                    ORDER BY l.location_id LIMIT ?""",(actor_user_id,profile,limit))
                return {"locations":[dict(zip(("location_id","name","lat","lon","revision"),row)) for row in cursor]}
            return await self._repo._db.async_execute(read,kind="read")
        if op=="places_list":
            active_mode = (await self._finalizer.mode(actor_user_id,profile)
                           if self._finalizer is not None else "migration_pending")
            # MA-016: DB is an opt-in read candidate source only. The legacy
            # Local-To-do store remains authoritative until MA-020 finalizes a
            # validated migration. Never silently substitute an empty DB list.
            if not set(payload) <= {"query","cursor","limit","include_archived"}:
                raise ApiError("invalid_request")
            query=payload.get("query","")
            cursor_id=payload.get("cursor")
            limit=payload.get("limit",50)
            include_archived=payload.get("include_archived",False)
            if type(include_archived) is not bool:
                raise ApiError("invalid_request")
            if (not isinstance(query,str) or len(query)>120 or
                type(limit) is not int or not 1<=limit<=100):
                raise ApiError("invalid_request")
            if cursor_id is not None:
                cursor_id=_uuid(cursor_id)
            def read_places(c):
                # Stable UUID ordering for race-resistant, server-side paging.
                if cursor_id is not None and c.execute(
                    "SELECT 1 FROM locations l JOIN profile_links p ON p.location_id=l.location_id "
                    "WHERE l.location_id=? AND p.ha_user_id=? AND p.vault_profile_id=?",
                    (cursor_id,actor_user_id,profile)).fetchone() is None:
                    raise ApiError("invalid_cursor")
                escaped=query.replace("!","!!").replace("%","!%").replace("_","!_")
                rows=c.execute(
                    "SELECT l.location_id,l.name,l.lat,l.lon,l.revision, "
                    "CASE WHEN a.link_id IS NULL THEN 0 ELSE 1 END "
                    "FROM locations l JOIN profile_links p ON p.location_id=l.location_id "
                    "LEFT JOIN archived_profile_links a ON a.link_id=p.link_id "
                    "WHERE p.ha_user_id=? AND p.vault_profile_id=? "
                    "AND (?=1 OR a.link_id IS NULL) "
                    "AND (?='' OR l.name LIKE ? ESCAPE '!' COLLATE NOCASE) "
                    "AND (? IS NULL OR l.location_id>?) "
                    "ORDER BY l.location_id LIMIT ?",
                    (actor_user_id,profile,int(include_archived),query,"%"+escaped+"%",cursor_id,cursor_id,limit+1)).fetchall()
                more=len(rows)>limit
                places=[{"location_id":lid,"name":name,"displayLabel":name,
                         "latitude":lat,"longitude":lon,"revision":revision,
                         "archived":bool(archived),
                         "provider":"monitored_areas_sqlite"}
                        for lid,name,lat,lon,revision,archived in rows[:limit]]
                return {"mode":active_mode,"places":places,
                        "next_cursor":places[-1]["location_id"] if more else None}
            return await self._repo._db.async_execute(read_places,kind="read")
        if op=="location_get":
            location_id=_uuid(payload.get("location_id"))
            def read(c):
                _actor_link(c,location_id,actor_user_id,profile)
                return {"location":_location(c,location_id)}
            return await self._repo._db.async_execute(read,kind="read")
        if op=="links_list":
            location_id=_uuid(payload.get("location_id"))
            def read(c):
                link_id=_actor_link(c,location_id,actor_user_id,profile)
                count=c.execute("SELECT count(*) FROM profile_links WHERE location_id=?",(location_id,)).fetchone()[0]
                return {"own_link_id":link_id,"shared_link_count":count}
            return await self._repo._db.async_execute(read,kind="read")
        if op=="links_remove_preview":
            location_id=_uuid(payload.get("location_id"))
            link_id=_uuid(payload.get("link_id"))
            def verify(c):
                return _actor_link(c,location_id,actor_user_id,profile)==link_id
            if not await self._repo._db.async_execute(verify,kind="read"):
                raise ApiError("not_found")
            if is_admin is not True:
                raise ApiError("forbidden")
            proof=await self._protect.preview_final_delete(actor_user_id=actor_user_id,is_admin=True,
                location_id=location_id,actor_profile_id=profile)
            return {"nonce":proof.nonce,"revision":proof.revision,"links":proof.links,
                    "reports":proof.reports,"expires_at_monotonic":proof.expires_at}

        if op=="history_reset_preview":
            if set(payload)!={"location_id"} or is_admin is not True:
                raise ApiError("forbidden")
            location_id=_uuid(payload["location_id"])
            await self._repo._db.async_execute(
                lambda c:_actor_link(c,location_id,actor_user_id,profile),kind="read")
            return await self._protect.preview_history_reset(
                actor_user_id=actor_user_id,is_admin=True,location_id=location_id,
                actor_profile_id=profile)

        if op=="history_reset_commit":
            if set(payload)!={"location_id","confirmation_nonce","explicit_final"}:
                raise ApiError("invalid_request")
            if is_admin is not True or payload["explicit_final"] is not True:
                raise ApiError("forbidden")
            location_id=_uuid(payload["location_id"])
            expected=_revision(request)
            nonce=payload["confirmation_nonce"]
            if not isinstance(nonce,str):
                raise ApiError("confirmation_expired")
            async with self._protect._lock:
                proof=self._protect._pending_resets.get(nonce)
            def mutate(c):
                _actor_link(c,location_id,actor_user_id,profile)
                current=_location(c,location_id)
                counts=(
                    c.execute("SELECT count(*) FROM lightning_reports WHERE location_id=?",(location_id,)).fetchone()[0],
                    c.execute("SELECT count(*) FROM sessions WHERE location_id=?",(location_id,)).fetchone()[0],
                    c.execute("SELECT count(*) FROM source_gaps WHERE location_id=?",(location_id,)).fetchone()[0],
                )
                if current["revision"]!=expected:
                    raise sql.RevisionConflict("revision_conflict")
                if (proof is None or proof[0]!=actor_user_id or proof[1]!=location_id or
                    proof[2]!=expected or proof[3:6]!=counts or proof[6]<=time.monotonic() or
                    proof[7]!=_snapshot_digest(c,location_id) or proof[8]!=profile):
                    raise ApiError("confirmation_stale")
                # A destructive action is all-or-nothing. Leave locations, links,
                # tracker refs and personal preferences intact.
                c.execute("DELETE FROM possible_duplicates WHERE location_id=?",(location_id,))
                c.execute("DELETE FROM session_reports WHERE location_id=?",(location_id,))
                c.execute("DELETE FROM lightning_reports WHERE location_id=?",(location_id,))
                c.execute("DELETE FROM sessions WHERE location_id=?",(location_id,))
                c.execute("DELETE FROM source_gaps WHERE location_id=?",(location_id,))
                c.execute("UPDATE locations SET revision=revision+1,updated_at=? WHERE location_id=?",
                          (max(time.time_ns()//1000,current["updated_at"]),location_id))
                return {"reset":True,"deleted_reports":counts[0],
                        "deleted_sessions":counts[1],"deleted_gaps":counts[2],
                        "location_revision":expected+1}
            result=await self._write(actor_user_id,op,request,mutate,is_admin=is_admin)
            async with self._protect._lock:
                self._protect._pending_resets.pop(nonce,None)
            return result

        if op in {"location_archive","location_restore"}:
            if set(payload)!={"location_id"}:
                raise ApiError("invalid_request")
            location_id=_uuid(payload["location_id"])
            expected=_revision(request)
            # Profile-only, reversible soft deletion; leave shared location,
            # sensor state and immutable observation history untouched.
            def mutate_archive(c):
                link_id=_actor_link(c,location_id,actor_user_id,profile)
                current=c.execute("SELECT revision FROM locations WHERE location_id=?",
                                  (location_id,)).fetchone()
                if current is None or current[0]!=expected:
                    raise ApiError("revision_conflict")
                if op=="location_archive":
                    c.execute("INSERT OR IGNORE INTO archived_profile_links(link_id,archived_at) VALUES(?,?)",
                              (link_id,time.time_ns()//1000))
                else:
                    c.execute("DELETE FROM archived_profile_links WHERE link_id=?",(link_id,))
                return {"location_id":location_id,"archived":op=="location_archive",
                        "revision":current[0]}
            if (await self._finalizer.mode(actor_user_id,profile)
                    if self._finalizer is not None else "migration_pending")!="db_active":
                raise ApiError("migration_pending")
            return await self._write(actor_user_id,op,request,mutate_archive,is_admin=is_admin)

        if op=="location_create":
            if set(payload) != {"name","lat","lon"}:
                raise ApiError("invalid_request")
            name=_name(payload["name"]);lat=_coord(payload["lat"],-90,90);lon=_coord(payload["lon"],-180,180)
            def mutate(c):
                now=time.time_ns()//1000
                location_id=str(uuid4());link_id=str(uuid4())
                sql._insert(c,"locations",dict(location_id=location_id,name=name,lat=lat,lon=lon,created_at=now,updated_at=now))
                sql._insert(c,"profile_links",dict(link_id=link_id,location_id=location_id,ha_user_id=actor_user_id,vault_profile_id=profile))
                sql._insert(c,"profile_preferences",dict(link_id=link_id))
                return {"location":sql._read(c,"locations",location_id),"link_id":link_id}
            return await self._write(actor_user_id,op,request,mutate,is_admin=is_admin)

        location_id=_uuid(payload.get("location_id")) if op!="preferences_update" else None
        # Always scope access to the real user + independently verified profile.
        if op in {"location_update","monitoring_update","links_share","links_transfer","links_remove"}:
            await self._repo._db.async_execute(
                lambda c:_actor_link(c,location_id,actor_user_id,profile),kind="read")

        if op in {"location_update","monitoring_update"}:
            expected=_revision(request)
            allowed=({"name","lat","lon"} if op=="location_update" else
                {"monitor_enabled","paused","record_enabled","mode","record_radius_m",
                 "alarm_radius_linked","alarm_radius_m"})
            if not payload.keys()-{"location_id"} or not set(payload)-{"location_id"}<=allowed:
                raise ApiError("invalid_request")
            patch={k:v for k,v in payload.items() if k!="location_id"}
            if "name" in patch: patch["name"]=_name(patch["name"])
            for key,lo,hi in (("lat",-90,90),("lon",-180,180)):
                if key in patch: patch[key]=_coord(patch[key],lo,hi)
            if op=="location_update":
                patch["updated_at"]=time.time_ns()//1000
            def mutate(c):
                _actor_link(c,location_id,actor_user_id,profile)
                return {"location":sql._update(c,"locations",location_id,expected,patch)}
            return await self._write(actor_user_id,op,request,mutate,is_admin=is_admin)

        if op=="preferences_update":
            link_id=_uuid(payload.get("link_id"))
            expected=_revision(request)
            allowed={"push_enabled","critical_enabled","notification_mode",
                     "closure_enabled","quiet_minutes","status_push","display_settings_json"}
            patch={k:v for k,v in payload.items() if k!="link_id"}
            if not patch or not set(patch)<=allowed: raise ApiError("invalid_request")
            def mutate(c):
                row=sql._read(c,"profile_links",link_id)
                if row is None or row["ha_user_id"]!=actor_user_id or row["vault_profile_id"]!=profile:
                    raise ApiError("not_found")
                return {"preferences":sql._update(c,"profile_preferences",link_id,expected,patch)}
            return await self._write(actor_user_id,op,request,mutate,is_admin=is_admin)

        if op in {"links_share","links_transfer"}:
            target_user=payload.get("target_user_id")
            target_profile=payload.get("target_profile_id")
            if not isinstance(target_user,str) or not target_user:
                raise ApiError("invalid_request")
            # The client supplies an ID to look up, not an authorization claim.
            if self._target_active is None or await self._target_active(target_user) is not True:
                raise ApiError("profile_not_found")
            await self._links.require_profile(target_user,target_profile)
            expected=_revision(request)
            if set(payload)!={"location_id","target_user_id","target_profile_id"}:
                raise ApiError("invalid_request")
            def mutate(c):
                old=_location(c,location_id)
                if old["revision"]!=expected: raise sql.RevisionConflict("revision_conflict")
                old_link=_actor_link(c,location_id,actor_user_id,profile)
                new_link=str(uuid4())
                sql._insert(c,"profile_links",dict(link_id=new_link,location_id=location_id,ha_user_id=target_user,vault_profile_id=target_profile))
                sql._insert(c,"profile_preferences",dict(link_id=new_link))
                if op=="links_transfer":
                    c.execute("DELETE FROM archived_profile_links WHERE link_id=?",(old_link,))
                    c.execute("DELETE FROM notification_targets WHERE link_id=?",(old_link,))
                    c.execute("DELETE FROM profile_preferences WHERE link_id=?",(old_link,))
                    c.execute("DELETE FROM profile_links WHERE link_id=?",(old_link,))
                c.execute("UPDATE locations SET revision=revision+1 WHERE location_id=?",(location_id,))
                return {"link_id":new_link,"location_revision":expected+1}
            return await self._write(actor_user_id,op,request,mutate,is_admin=is_admin)

        if op=="links_remove":
            expected=_revision(request)
            if not set(payload)<= {"location_id","link_id","explicit_final","confirmation_nonce"}:
                raise ApiError("invalid_request")
            link_id=_uuid(payload.get("link_id"))
            explicit=payload.get("explicit_final") is True
            nonce=payload.get("confirmation_nonce")
            proof=None
            if explicit:
                if is_admin is not True or not isinstance(nonce,str):
                    raise ApiError("last_link_confirmation_required")
                async with self._protect._lock:
                    proof=self._protect._pending.get(nonce)
            def mutate(c):
                link=_actor_link(c,location_id,actor_user_id,profile)
                if link != link_id: raise ApiError("not_found")
                old=_location(c,location_id)
                if old["revision"]!=expected: raise sql.RevisionConflict("revision_conflict")
                total=c.execute("SELECT count(*) FROM profile_links WHERE location_id=?",(location_id,)).fetchone()[0]
                reports=c.execute("SELECT count(*) FROM lightning_reports WHERE location_id=?",(location_id,)).fetchone()[0]
                if total==1:
                    if (is_admin is not True or not explicit or proof is None or
                        proof[0]!=actor_user_id or proof[1]!=location_id or
                        proof[2:5]!=(expected,total,reports) or proof[5]<=time.monotonic() or
                        proof[6]!=_snapshot_digest(c,location_id,include_links=True) or proof[7]!=profile):
                        raise ApiError("last_link_confirmation_required")
                    if reports or c.execute("SELECT 1 FROM tracker_refs WHERE location_id=?",(location_id,)).fetchone():
                        raise ApiError("history_exists")
                c.execute("DELETE FROM archived_profile_links WHERE link_id=?",(link_id,))
                c.execute("DELETE FROM notification_targets WHERE link_id=?",(link_id,))
                c.execute("DELETE FROM profile_preferences WHERE link_id=?",(link_id,))
                c.execute("DELETE FROM profile_links WHERE link_id=?",(link_id,))
                if total==1:
                    c.execute("DELETE FROM locations WHERE location_id=?",(location_id,))
                else:
                    c.execute("UPDATE locations SET revision=revision+1 WHERE location_id=?",(location_id,))
                return {"removed":True,"location_deleted":total==1}
            result=await self._write(actor_user_id,op,request,mutate,is_admin=is_admin)
            if explicit and nonce:
                async with self._protect._lock:
                    self._protect._pending.pop(nonce,None)
            return result
        raise ApiError("invalid_request")


def _stable_code(exc):
    if isinstance(exc,ApiError): return exc.code
    if isinstance(exc,FinalizationError): return exc.code
    if isinstance(exc,ProfileNotVerified): return "profile_not_found"
    if isinstance(exc,MigrationSourceError): return "migration_source_unavailable"
    if isinstance(exc,sql.RevisionConflict): return "revision_conflict"
    if isinstance(exc,sql.MissingRecord): return "not_found"
    if isinstance(exc,sql.ConstraintViolation): return "invalid_request"
    if isinstance(exc,sql.ReplayConflict): return "request_conflict"
    if isinstance(exc,StorageError): return exc.code
    if isinstance(exc,DatabaseUnavailable): return "storage_unavailable"
    if isinstance(exc,ValueError): return "invalid_request"
    return "internal_error"


def register_websocket_api(hass):
    """Register once, only after opted-in MA runtime has successfully started.

    HA's WS command registry is process-scoped. On OFF/unload, commands remain
    registered but strictly return feature_disabled with no DB interaction.
    """
    if hass.data.get(MA_API_REGISTERED):
        return
    import voluptuous as vol
    from homeassistant.components import websocket_api

    async def active_user(user_id):
        user=await hass.auth.async_get_user(user_id)
        return bool(user is not None and user.is_active)

    def runtime():
        for entry in hass.config_entries.async_entries("gewitterradar"):
            data=getattr(entry,"runtime_data",None)
            ma=getattr(data,"monitored_areas",None)
            if ma is not None and ma.database is not None and ma.database.running:
                return ma
        return None

    def register(op):
        @websocket_api.websocket_command({
            "type": PREFIX+op,
            vol.Required("schema"): int,
            vol.Optional("request",default=dict): dict,
        })
        @websocket_api.async_response
        async def command(_hass,connection,msg):
            user=connection.user
            if user is None or not user.is_active:
                connection.send_error(msg["id"],"unauthorized","Home Assistant sign-in required")
                return
            if msg["schema"]!=1:
                connection.send_error(msg["id"],"invalid_request","Unsupported API schema")
                return
            ma=runtime()
            if ma is None:
                connection.send_error(msg["id"],"feature_disabled","Monitored Areas disabled")
                return
            vault=hass.data.get("gewitterradar_settings_vault")
            if vault is None:
                connection.send_error(msg["id"],"not_ready","Verified Settings Vault unavailable")
                return
            try:
                # Avoid persistence/service-side errors being mistaken for user claims.
                api=ma.api if getattr(ma,"api",None) is not None else None
                if api is None:
                    raise ApiError("not_ready")
                result=await api.dispatch(actor_user_id=user.id,is_admin=user.is_admin,
                                          op=op,request=msg["request"])
            except Exception as exc:
                code=_stable_code(exc)
                connection.send_error(msg["id"],code,code)
                return
            connection.send_result(msg["id"],result)
        websocket_api.async_register_command(hass,command)
    for op in OPS:
        register(op)
    hass.data[MA_API_REGISTERED]=True
