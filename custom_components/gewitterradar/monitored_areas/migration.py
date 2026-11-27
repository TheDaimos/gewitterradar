"""MA-018: read-only Local To-do migration preview.

A preview is NOT an import, a delete authorization or evidence of a cutover.
The source is read through a trusted HA service callback, not browser payloads
or HA private .storage files. No SQL write/side effect occurs.
"""
import hashlib
import json
import math

_PREFIX="GEWITTERRADAR_PLACE_V1\n"
_ALLOWED_STATUSES=frozenset(("needs_action","completed"))


class MigrationSourceError(RuntimeError):
    pass


def _hash(value):
    return hashlib.sha256(json.dumps(
        value,sort_keys=True,separators=(",",":"),ensure_ascii=True,
        allow_nan=False).encode("ascii")).hexdigest()


def _parse(item):
    if not isinstance(item,dict):
        return None,"invalid_item"
    raw=item.get("description","")
    if not isinstance(raw,str) or not raw.startswith(_PREFIX):
        return None,"not_gewitrradar_place"
    try:
        data=json.loads(raw[len(_PREFIX):])
        if not isinstance(data,dict):
            return None,"invalid_payload"
        lat=data.get("latitude")
        lon=data.get("longitude")
        if type(lat) not in (int,float) or type(lon) not in (int,float):
            return None,"invalid_coordinates"
        if not (math.isfinite(lat) and math.isfinite(lon) and -90<=lat<=90 and -180<=lon<=180):
            return None,"invalid_coordinates"
        name=str(data.get("name") or item.get("summary") or "").strip()
        if not name or len(name)>120:
            return None,"invalid_name"
        uid=item.get("uid")
        if not isinstance(uid,str) or not uid.strip():
            return None,"invalid_uid"
        status=item.get("status")
        if status not in _ALLOWED_STATUSES:
            return None,"invalid_status"
        return dict(uid=uid,name=name,lat=float(lat),lon=float(lon),
                    status=status,source_summary=str(item.get("summary",""))[:160]),None
    except (ValueError,TypeError,OverflowError):
        return None,"invalid_payload"


class MigrationPreview:
    def __init__(self, repositories, ownership, fetch_source):
        self._repositories=repositories
        self._ownership=ownership
        self._fetch_source=fetch_source

    async def build(self, *, actor_user_id, profile_id):
        await self._ownership.require_profile(actor_user_id,profile_id)
        # Trusted backend HA-service callback, never client-supplied candidates.
        items=await self._fetch_source()
        if not isinstance(items,list) or len(items)>10000:
            raise MigrationSourceError("migration_source_invalid")
        if any(not isinstance(i,dict) for i in items):
            raise MigrationSourceError("migration_source_invalid")
        normalized_source=[{"uid":i.get("uid"),"summary":i.get("summary"),
                            "description":i.get("description"),"status":i.get("status")}
                           for i in items]
        try:
            source_digest=_hash(sorted(normalized_source,key=lambda v:str(v.get("uid"))))
        except (ValueError,TypeError,OverflowError) as exc:
            raise MigrationSourceError("migration_source_invalid") from exc

        def read(c):
            rows=c.execute("""
                SELECT l.location_id,l.name,l.lat,l.lon,l.revision,
                    CASE WHEN a.link_id IS NULL THEN 0 ELSE 1 END
                FROM locations l JOIN profile_links p ON p.location_id=l.location_id
                LEFT JOIN archived_profile_links a ON a.link_id=p.link_id
                WHERE p.ha_user_id=? AND p.vault_profile_id=?
                ORDER BY l.location_id
            """,(actor_user_id,profile_id)).fetchall()
            return [dict(zip(("location_id","name","lat","lon","revision","archived"),row)) for row in rows]
        existing=await self._repositories._db.async_execute(read,kind="read")
        # Keep the preview digest compatible with the transactional importer:
        # only immutable identity/geometry/revision fields enter its current SQL hash.
        db_digest=_hash([{k:p[k] for k in ("location_id","name","lat","lon","revision")}
                         for p in existing])
        valid=[]
        rejected=[]
        seen={}
        for item in items:
            record,reason=_parse(item)
            if reason is not None:
                rejected.append({"uid":str(item.get("uid",""))[:100],"reason":reason})
                continue
            coordinate_key=(round(record["lat"],5),round(record["lon"],5))
            candidate_matches=[p["location_id"] for p in existing
                 if abs(p["lat"]-record["lat"])<0.00001 and abs(p["lon"]-record["lon"])<0.00001]
            collisions=[p["location_id"] for p in existing
                 if p["name"].casefold()==record["name"].casefold() and p["location_id"] not in candidate_matches]
            same_source=seen.get(coordinate_key)
            seen.setdefault(coordinate_key,record["uid"])
            exact_matches=[p["location_id"] for p in existing
                if p["location_id"] in candidate_matches
                and p["name"]==record["name"]
                and abs(p["lat"]-record["lat"])<=1e-9
                and abs(p["lon"]-record["lon"])<=1e-9
                and bool(p["archived"])==(record["status"]=="completed")]
            valid.append({**record,"coordinate_matches":candidate_matches,
                          "exact_matches":exact_matches,
                          "name_conflicts":collisions,
                          "source_coordinate_duplicate":same_source,
                          "decision_required":bool(candidate_matches or collisions or same_source)})
        # A suggestion is safe only when source coordinates are unique, a single
        # exact name/coordinate/archive match exists and no second To-do entry
        # competes for that target. Suggestions are never a write authorization.
        coordinate_counts={}
        target_counts={}
        for candidate in valid:
            key=(round(candidate["lat"],5),round(candidate["lon"],5))
            coordinate_counts[key]=coordinate_counts.get(key,0)+1
            for location_id in candidate["exact_matches"]:
                target_counts[location_id]=target_counts.get(location_id,0)+1
        safe_count=0
        for candidate in valid:
            key=(round(candidate["lat"],5),round(candidate["lon"],5))
            exact=candidate["exact_matches"]
            suggested=(exact[0] if len(exact)==1
                       and coordinate_counts[key]==1
                       and target_counts[exact[0]]==1 else None)
            candidate["suggested_existing_id"]=suggested
            if suggested is not None:
                safe_count+=1
        preview_id=_hash({"user":actor_user_id,"profile":profile_id,
                          "source":source_digest,"db":db_digest})
        return {"mode":"migration_pending","preview_id":preview_id,
                "source_digest":source_digest,"db_digest":db_digest,
                "candidates":valid,"rejected":rejected,
                "total":len(items),"valid":len(valid),"invalid":len(rejected),
                "safe_existing_suggestions":safe_count,
                "write_performed":False}
