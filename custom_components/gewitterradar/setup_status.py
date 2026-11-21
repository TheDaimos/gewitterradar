"""Read-only onboarding checks, isolated from weather and rendering paths."""

from fnmatch import fnmatchcase
from typing import Any

from homeassistant.components import websocket_api
from homeassistant.config import async_hass_config_yaml
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

SOURCE_GLOBS = (
    "geo_location.lightning_strike*",
    "sensor.*_lightning_distance",
    "sensor.*_lightning_azimuth",
    "sensor.*_lightning_counter",
)
PROBES = (
    "geo_location.lightning_strike_gewitterradar_setup",
    "sensor.gewitterradar_setup_lightning_distance",
    "sensor.gewitterradar_setup_lightning_azimuth",
    "sensor.gewitterradar_setup_lightning_counter",
)


def recorder_config_covers_sources(config: dict[str, Any]) -> bool:
    """Conservatively prove all four source families are excluded in YAML.

    Explicit entity/glob includes can override exclusions. Unknown broader
    patterns deliberately do not count as proof; exact canonical globs,
    domain-wide and universal exclusions do.
    """
    recorder = config.get("recorder", {})
    if not isinstance(recorder, dict):
        return False
    exclude, include = recorder.get("exclude", {}), recorder.get("include", {})
    if not isinstance(exclude, dict) or not isinstance(include, dict):
        return False
    if include.get("entity_globs") or any(
        fnmatchcase(entity, pattern)
        for entity in include.get("entities", [])
        for pattern in SOURCE_GLOBS
    ):
        return False
    domains = exclude.get("domains", [])
    globs = exclude.get("entity_globs", [])
    return all(
        pattern in globs or "*" in globs or pattern.split(".")[0] + ".*" in globs
        or pattern.split(".")[0] in domains
        for pattern in SOURCE_GLOBS
    )


@websocket_api.websocket_command({"type": "gewitterradar/setup_status"})
@websocket_api.async_response
async def ws_setup_status(hass: HomeAssistant, connection, msg) -> None:
    """Expose only setup booleans; never foreign config, YAML or credentials."""
    entries = hass.config_entries.async_entries("blitzortung")
    registry = er.async_get(hass)
    trackers = {
        item.entity_id for item in registry.entities.values()
        if item.domain == "device_tracker"
        and (item.platform == "gewitterradar" or (
            item.platform == "template" and item.entity_id == "device_tracker.gewitterradar_dashboard"
        ))
    }
    # Dashboard trackers may be script-created states without registry entries.
    if hass.states.get("device_tracker.gewitterradar_dashboard") is not None:
        trackers.add("device_tracker.gewitterradar_dashboard")
    local_places = any(
        item.domain == "todo" and item.platform == "local_todo"
        and (item.name or item.original_name or "").strip().casefold() == "gewitterradar orte"
        and item.disabled_by is None and hass.states.get(item.entity_id) is not None
        for item in registry.entities.values()
    )
    recorder = None
    # Reading configuration is reserved for administrators; other checks remain
    # useful to ordinary authenticated users, with Recorder explicitly unknown.
    if connection.user.is_admin and "recorder" in hass.config.components:
        try:
            from homeassistant.components.recorder import is_entity_recorded

            config = await async_hass_config_yaml(hass)
            entities = set(PROBES) | {
                entity_id for entity_id in registry.entities
                if any(fnmatchcase(entity_id, pattern) for pattern in SOURCE_GLOBS)
            } | {
                state.entity_id for state in hass.states.async_all()
                if any(fnmatchcase(state.entity_id, pattern) for pattern in SOURCE_GLOBS)
            }
            # Verify the active filter too: edited YAML awaiting restart does
            # not count as completed setup.
            recorder = recorder_config_covers_sources(config) and all(
                not is_entity_recorded(hass, entity_id) for entity_id in entities
            )
        except Exception:  # Optional Recorder/config failures must stay isolated.
            recorder = None
    connection.send_result(msg["id"], {
        "schema": "gewitterradar.setup-status.v1",
        "blitzortungInstalled": bool(entries),
        "trackerLinked": any(
            item.data.get("config_type", "entity") == "entity"
            and item.data.get("location_entity") in trackers for item in entries
        ),
        "recorderExcluded": recorder,
        "localTodoCreated": local_places,
    })
