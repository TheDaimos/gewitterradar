"""V4.07 upgrade, rollback and re-enable validation."""

from homeassistant.config_entries import ConfigEntryState
from homeassistant.const import ATTR_ENTITY_ID, STATE_UNAVAILABLE
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.gewitterradar.const import (
    CONF_LANGUAGE,
    CONF_LEGACY_IMPORT_VERSION,
    CONF_STORM_SIMULATION,
    DOMAIN,
    LEGACY_ENTITIES,
    LEGACY_IMPORT_VERSION,
    NAME,
)


LEGACY_VALUES = {
    "language": "Deutsch",
    "distance_unit": "MI",
    "compass_design": "Compass A",
    "reference_location": "person.rollback_user",
    "observation_radius": "75",
    "storm_radius": "30",
    "danger_radius": "15",
    "aura_width": "45",
    "aura_intensity": "65",
    "aura_effects": "off",
    "warning_animation": "off",
    "storm_simulation": "on",
    "show_location_selector": "on",
    "compass_nearest_strike": "on",
    "compass_device_orientation": "on",
    "map_grouping": "off",
}


def _install_legacy_states(hass: HomeAssistant) -> dict[str, str]:
    """Install the complete legacy contract and return its immutable snapshot."""
    hass.states.async_set("person.rollback_user", "home")
    for key, value in LEGACY_VALUES.items():
        hass.states.async_set(LEGACY_ENTITIES[key], value)
    return {
        entity_id: hass.states.get(entity_id).state
        for entity_id in LEGACY_ENTITIES.values()
    }


def _legacy_snapshot(hass: HomeAssistant) -> dict[str, str]:
    return {
        entity_id: hass.states.get(entity_id).state
        for entity_id in LEGACY_ENTITIES.values()
    }


async def test_upgrade_unload_reenable_and_remove_preserve_legacy(
    hass: HomeAssistant,
) -> None:
    """Prove upgrade, reversible unload and destructive-entry removal semantics."""
    legacy_before = _install_legacy_states(hass)
    entry = MockConfigEntry(domain=DOMAIN, title=NAME, data={}, options={})
    entry.add_to_hass(hass)

    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.LOADED
    assert entry.options[CONF_LANGUAGE] == "Deutsch"
    assert entry.options[CONF_STORM_SIMULATION] is True
    assert entry.data[CONF_LEGACY_IMPORT_VERSION] == LEGACY_IMPORT_VERSION
    assert _legacy_snapshot(hass) == legacy_before

    await hass.services.async_call(
        "select",
        "select_option",
        {ATTR_ENTITY_ID: "select.gewitterradar_language", "option": "Suomi"},
        blocking=True,
    )
    native_before_rollback = dict(entry.options)
    assert native_before_rollback[CONF_LANGUAGE] == "Suomi"
    assert _legacy_snapshot(hass) == legacy_before

    assert await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.NOT_LOADED
    assert hass.states.get("select.gewitterradar_language").state == STATE_UNAVAILABLE
    assert dict(entry.options) == native_before_rollback
    assert _legacy_snapshot(hass) == legacy_before

    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.LOADED
    assert dict(entry.options) == native_before_rollback
    assert entry.options[CONF_LANGUAGE] == "Suomi"
    assert _legacy_snapshot(hass) == legacy_before

    assert await hass.config_entries.async_remove(entry.entry_id)
    await hass.async_block_till_done()
    assert _legacy_snapshot(hass) == legacy_before

    # Removing a Config Entry intentionally removes its native option store.
    # A genuinely new entry therefore imports the still-unchanged legacy source.
    readded = MockConfigEntry(domain=DOMAIN, title=NAME, data={}, options={})
    readded.add_to_hass(hass)
    assert await hass.config_entries.async_setup(readded.entry_id)
    await hass.async_block_till_done()
    assert readded.state is ConfigEntryState.LOADED
    assert readded.options[CONF_LANGUAGE] == "Deutsch"
    assert readded.options[CONF_STORM_SIMULATION] is True
    assert readded.data[CONF_LEGACY_IMPORT_VERSION] == LEGACY_IMPORT_VERSION
    assert _legacy_snapshot(hass) == legacy_before


async def test_device_tracker_legacy_location_is_non_blocking_and_untouched(
    hass: HomeAssistant, caplog
) -> None:
    """Keep foreign legacy device trackers non-blocking and untouched."""
    hass.states.async_set(
        LEGACY_ENTITIES["reference_location"], "device_tracker.rollback_phone"
    )
    entry = MockConfigEntry(domain=DOMAIN, title=NAME, data={}, options={})
    entry.add_to_hass(hass)

    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.LOADED
    assert entry.options["reference_location"] == "zone.home"
    assert (
        hass.states.get(LEGACY_ENTITIES["reference_location"]).state
        == "device_tracker.rollback_phone"
    )
    assert "Skipping legacy device_tracker reference location" in caplog.text
