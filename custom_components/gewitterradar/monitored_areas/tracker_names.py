"""MA-023: read-only tracker-name candidate and collision contracts.

Do not create HA entities, reserve names or enumerate foreign registry entries.
Actual collisions are checked against the HA entity registry, state machine and
the MA tracker_refs table by an authenticated location-scoped API call.
"""
from __future__ import annotations
import re

_VALID_SLUG = re.compile(r"[a-z0-9_]{1,100}\Z")

def tracker_candidate(name, slugify):
    if not isinstance(name, str) or not name.strip() or len(name) > 120:
        raise ValueError("invalid_request")
    slug = slugify(name.strip())
    if not isinstance(slug, str) or not _VALID_SLUG.fullmatch(slug):
        raise ValueError("invalid_request")
    return "device_tracker." + slug, slug

def name_availability(entity_id, occupied):
    if type(occupied) is not bool:
        raise ValueError("invalid_request")
    if occupied:
        # Never disclose which other integration/actor owns the name.
        return {"available": False, "reason": "name_unavailable"}
    return {"available": True, "entity_id": entity_id}
