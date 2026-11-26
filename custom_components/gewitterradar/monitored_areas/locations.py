"""MA-012: internal location business port; no HA API exposure."""
from datetime import datetime, timezone
from math import isfinite
from uuid import UUID, uuid4

from .storage.repositories import Repositories


def _uuid(value):
    try:
        parsed = UUID(value, version=4)
    except (ValueError, TypeError, AttributeError) as exc:
        raise ValueError("invalid_location_id") from exc
    if parsed.version != 4 or str(parsed) != value:
        raise ValueError("invalid_location_id")
    return value


def _name(value):
    if not isinstance(value, str) or not 1 <= len(value.strip()) <= 120:
        raise ValueError("invalid_name")
    return value.strip()


def _coord(value, low, high):
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise ValueError("invalid_coordinates")
    value = float(value)
    if not isfinite(value) or not low <= value <= high:
        raise ValueError("invalid_coordinates")
    return value


def _now_us():
    return int(datetime.now(timezone.utc).timestamp() * 1_000_000)


class Locations:
    """Internal service. Authorization MUST precede entry via future API layer."""

    def __init__(self, repositories: Repositories):
        self._repo = repositories

    async def create(self, *, name, lat, lon, location_id=None, link=None):
        data = dict(location_id=_uuid(location_id) if location_id is not None else str(uuid4()),
                    name=_name(name), location_origin="gr_manual", lat=_coord(lat, -90, 90),
                    lon=_coord(lon, -180, 180),
                    created_at=_now_us(), updated_at=_now_us())
        return await self._repo.create_location(data, link=link)

    async def get(self, location_id):
        return await self._repo.get_location(_uuid(location_id))

    async def update(self, location_id, expected_revision, changes):
        if type(expected_revision) is not int or expected_revision < 1:
            raise ValueError("invalid_revision")
        if not isinstance(changes, dict) or not changes or not changes.keys() <= {"name", "lat", "lon"}:
            raise ValueError("invalid_changes")
        patch = {}
        for field, value in changes.items():
            patch[field] = (_name(value) if field == "name" else
                            _coord(value, -90 if field == "lat" else -180,
                                   90 if field == "lat" else 180))
        patch["updated_at"] = _now_us()
        return await self._repo.update_location(_uuid(location_id), expected_revision, patch)
