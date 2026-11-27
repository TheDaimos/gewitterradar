"""MA-025: read-only, scoped inventory of installed Blitzortung config entries.

Only public config-entry titles and entity IDs are included. Never return
entry.data, options, secrets, event payloads, coordinates or foreign providers.
This is diagnostic discovery, NOT a binding or proof of a functioning subscription.
"""
from __future__ import annotations
import re

_DOMAINS = frozenset(("blitzortung", "blitzortung_org"))
_ID = re.compile(r"(?:sensor|device_tracker|binary_sensor|geo_location)\.[a-z0-9_]+\Z")

def collect_inventory(entries, entities_for_entry, state_lookup):
    results=[]
    for entry in entries:
        if getattr(entry,"domain",None) not in _DOMAINS:
            continue
        if len(results)>=100:
            break
        entry_id=getattr(entry,"entry_id",None)
        if not isinstance(entry_id,str) or not entry_id:
            continue
        result={"entry_id":entry_id,"title":str(getattr(entry,"title","") or "Blitzortung")[:120],
                "trackers":[],"counters":[],"distances":[],"other_sensors":[]}
        for item in list(entities_for_entry(entry_id))[:200]:
            entity_id=getattr(item,"entity_id",None)
            if not isinstance(entity_id,str) or not _ID.fullmatch(entity_id):
                continue
            # Include registered but currently unavailable entities, without
            # claiming they are active. Never read or return state attributes.
            state_lookup(entity_id)
            name=entity_id.rsplit(".",1)[-1]
            if entity_id.startswith("device_tracker."):
                category="trackers"
            elif "distance" in name or "distanz" in name or "entfernung" in name:
                category="distances"
            elif any(word in name for word in ("lightning","strike","count","blitz")):
                category="counters"
            else:
                category="other_sensors"
            result[category].append(entity_id)
        for key in ("trackers","counters","distances","other_sensors"):
            result[key].sort()
        results.append(result)
    results.sort(key=lambda x:(x["title"].casefold(),x["entry_id"]))
    return {"read_only":True,"locations":results}
