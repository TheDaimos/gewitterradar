"""Gewitterradar native integration."""

from __future__ import annotations

import logging
from dataclasses import dataclass
from math import isfinite
from pathlib import Path
from typing import Any

from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback, valid_entity_id
from homeassistant.exceptions import ConfigEntryError, ServiceValidationError
from homeassistant.helpers.typing import ConfigType

from .const import (
    COMPASS_DESIGN_OPTIONS,
    CONF_COMPASS_DESIGN,
    CONF_DANGER_RADIUS,
    CONF_DISTANCE_UNIT,
    CONF_LEGACY_IMPORT_VERSION,
    CONF_LANGUAGE,
    CONF_LANGUAGE_INITIALIZED,
    CONF_OBSERVATION_RADIUS,
    CONF_REFERENCE_LOCATION,
    CONF_STORM_RADIUS,
    DEFAULT_OPTIONS,
    DISTANCE_UNIT_OPTIONS,
    LANGUAGE_OPTIONS,
    LEGACY_ENTITIES,
    LEGACY_IMPORT_VERSION,
    LOCATION_DOMAINS,
    NUMBER_LIMITS,
    PLATFORMS,
    SWITCH_KEYS,
)

_LOGGER = logging.getLogger(__name__)
_NO_LEGACY_VALUE = object()
_RADIUS_KEYS = (
    CONF_OBSERVATION_RADIUS,
    CONF_STORM_RADIUS,
    CONF_DANGER_RADIUS,
)

_FIXED_SELECT_OPTIONS = {
    CONF_LANGUAGE: LANGUAGE_OPTIONS,
    CONF_DISTANCE_UNIT: DISTANCE_UNIT_OPTIONS,
    CONF_COMPASS_DESIGN: COMPASS_DESIGN_OPTIONS,
}


def _validate_options(options: dict[str, Any]) -> None:
    """Validate the complete canonical options model."""
    for key, allowed in _FIXED_SELECT_OPTIONS.items():
        if options[key] not in allowed:
            raise ValueError(f"Invalid {key}: {options[key]!r}")

    reference = options[CONF_REFERENCE_LOCATION]
    if (
        not isinstance(reference, str)
        or not valid_entity_id(reference)
        or reference.split(".", 1)[0] not in LOCATION_DOMAINS
    ):
        raise ValueError(f"Invalid reference_location: {reference!r}")

    for key, (minimum, maximum, _) in NUMBER_LIMITS.items():
        value = options[key]
        if (
            isinstance(value, bool)
            or not isinstance(value, (int, float))
            or not isfinite(value)
            or not minimum <= value <= maximum
        ):
            raise ValueError(f"Invalid {key}: {value!r}")

    danger = options[CONF_DANGER_RADIUS]
    storm = options[CONF_STORM_RADIUS]
    observation = options[CONF_OBSERVATION_RADIUS]
    if not danger <= storm <= observation:
        raise ValueError(
            "Radius values must satisfy danger_radius <= storm_radius "
            "<= observation_radius"
        )

    for key in SWITCH_KEYS:
        if not isinstance(options[key], bool):
            raise ValueError(f"Invalid {key}: {options[key]!r}")


def _options_with_defaults(existing: dict[str, Any]) -> dict[str, Any]:
    """Add missing defaults while preserving valid existing settings."""
    options = {**DEFAULT_OPTIONS, **existing}

    # V0.13 entries may only contain observation_radius. Derive missing dependent
    # defaults without changing any radius which the user already stored.
    if CONF_OBSERVATION_RADIUS not in existing:
        options[CONF_OBSERVATION_RADIUS] = max(
            DEFAULT_OPTIONS[CONF_OBSERVATION_RADIUS],
            existing.get(CONF_STORM_RADIUS, 0),
            existing.get(CONF_DANGER_RADIUS, 0),
        )
    if CONF_STORM_RADIUS not in existing:
        options[CONF_STORM_RADIUS] = min(
            options[CONF_OBSERVATION_RADIUS],
            max(
                DEFAULT_OPTIONS[CONF_STORM_RADIUS],
                existing.get(CONF_DANGER_RADIUS, 0),
            ),
        )
    if CONF_DANGER_RADIUS not in existing:
        options[CONF_DANGER_RADIUS] = min(
            DEFAULT_OPTIONS[CONF_DANGER_RADIUS], options[CONF_STORM_RADIUS]
        )

    _validate_options(options)
    return options


def _legacy_value(hass: HomeAssistant, key: str) -> Any:
    """Return one valid legacy helper value, or a private missing sentinel."""
    state = hass.states.get(LEGACY_ENTITIES[key])
    if state is None or state.state in {"unknown", "unavailable"}:
        return _NO_LEGACY_VALUE

    raw = state.state
    if key in _FIXED_SELECT_OPTIONS:
        return raw if raw in _FIXED_SELECT_OPTIONS[key] else _NO_LEGACY_VALUE

    if key == CONF_REFERENCE_LOCATION:
        if valid_entity_id(raw) and raw.split(".", 1)[0] in LOCATION_DOMAINS:
            return raw
        if raw.startswith("device_tracker."):
            _LOGGER.warning(
                "Skipping unsupported legacy reference location %s; "
                "device_tracker migration is not supported yet",
                raw,
            )
        return _NO_LEGACY_VALUE

    if key in NUMBER_LIMITS:
        try:
            value = float(raw)
        except (TypeError, ValueError):
            return _NO_LEGACY_VALUE
        minimum, maximum, _ = NUMBER_LIMITS[key]
        if not isfinite(value) or not minimum <= value <= maximum:
            return _NO_LEGACY_VALUE
        return int(value) if value.is_integer() else value

    if key in SWITCH_KEYS:
        if raw == "on":
            return True
        if raw == "off":
            return False

    return _NO_LEGACY_VALUE


def _options_after_legacy_import(
    hass: HomeAssistant, existing: dict[str, Any]
) -> dict[str, Any]:
    """Import missing valid helper values once, preserving native options."""
    imported = dict(existing)

    for key in LEGACY_ENTITIES:
        if key in existing or key in _RADIUS_KEYS:
            continue
        value = _legacy_value(hass, key)
        if value is not _NO_LEGACY_VALUE:
            imported[key] = value

    radius_imports: dict[str, Any] = {}
    for key in _RADIUS_KEYS:
        if key in existing:
            continue
        value = _legacy_value(hass, key)
        if value is not _NO_LEGACY_VALUE:
            radius_imports[key] = value

    if radius_imports:
        try:
            return _options_with_defaults({**imported, **radius_imports})
        except ValueError:
            _LOGGER.warning(
                "Ignoring inconsistent legacy radius values; existing native "
                "radius options remain unchanged"
            )

    return _options_with_defaults(imported)


@dataclass(slots=True)
class GewitterradarRuntimeData:
    """Config-entry-backed runtime access for Gewitterradar settings."""

    hass: HomeAssistant
    entry: ConfigEntry[GewitterradarRuntimeData]

    def get(self, key: str) -> Any:
        """Return a setting from the canonical Config Entry options."""
        return self.entry.options[key]

    @callback
    def async_set(self, key: str, value: Any) -> None:
        """Atomically persist one setting from the Home Assistant event loop."""
        options = {**self.entry.options, key: value}
        try:
            _validate_options(options)
        except ValueError as err:
            raise ServiceValidationError(str(err)) from err
        self.hass.config_entries.async_update_entry(self.entry, options=options)


type GewitterradarConfigEntry = ConfigEntry[GewitterradarRuntimeData]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Serve the shared card once per HA lifecycle; resource registration is explicit."""
    await hass.http.async_register_static_paths([
        StaticPathConfig(
            "/gewitterradar",
            str(Path(__file__).parent / "frontend"),
            False,
        )
    ])
    return True


async def async_setup_entry(hass: HomeAssistant, entry: GewitterradarConfigEntry) -> bool:
    """Set up Gewitterradar from a config entry."""
    data = dict(entry.data)
    existing = dict(entry.options)
    # Preserve a confirmation from the global legacy helper on native migration.
    # Neither an existing language value nor any browser state implies consent.
    if CONF_LANGUAGE_INITIALIZED not in existing:
        marker = hass.states.get("input_boolean.lightning_detection_language_initialized")
        if marker is not None and marker.state == "on":
            existing[CONF_LANGUAGE_INITIALIZED] = True
    try:
        if data.get(CONF_LEGACY_IMPORT_VERSION) == LEGACY_IMPORT_VERSION:
            options = _options_with_defaults(existing)
        else:
            options = _options_after_legacy_import(hass, existing)
            data[CONF_LEGACY_IMPORT_VERSION] = LEGACY_IMPORT_VERSION
    except (TypeError, ValueError) as err:
        raise ConfigEntryError(f"Invalid Gewitterradar options: {err}") from err
    if options != entry.options or data != entry.data:
        hass.config_entries.async_update_entry(entry, data=data, options=options)

    entry.runtime_data = GewitterradarRuntimeData(hass, entry)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: GewitterradarConfigEntry) -> bool:
    """Unload a Gewitterradar config entry."""
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
