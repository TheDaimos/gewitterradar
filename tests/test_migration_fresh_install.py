"""Test V0.16 legacy import and V0.17 package-free installation."""

from homeassistant.config_entries import SOURCE_USER, ConfigEntryState
from homeassistant.const import ATTR_ENTITY_ID, STATE_ON
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.gewitterradar.const import (
    CONF_LANGUAGE,
    CONF_LEGACY_IMPORT_VERSION,
    CONF_OBSERVATION_RADIUS,
    CONF_STORM_SIMULATION,
    DEFAULT_OPTIONS,
    DOMAIN,
    LEGACY_ENTITIES,
    LEGACY_IMPORT_VERSION,
    NAME,
)

EXPECTED_LEGACY_ENTITIES = {
    "language": "input_select.lightning_detection_language",
    "distance_unit": "input_select.lightning_detection_distance_unit",
    "compass_design": "input_select.lightning_detection_compass_design",
    "reference_location": "input_select.lightning_detection_location",
    "observation_radius": "input_number.lightning_detection_observation_radius",
    "storm_radius": "input_number.lightning_detection_storm_radius",
    "danger_radius": "input_number.lightning_detection_danger_radius",
    "aura_width": "input_number.lightning_detection_aura_width",
    "aura_intensity": "input_number.lightning_detection_aura_intensity",
    "aura_effects": "input_boolean.lightning_detection_aura_effects",
    "warning_animation": "input_boolean.lightning_detection_warning_animation",
    "storm_simulation": "input_boolean.lightning_detection_storm_simulation",
    "show_location_selector": "input_boolean.lightning_detection_show_location_selector",
    "compass_nearest_strike": "input_boolean.lightning_detection_compass_nearest_strike",
    "compass_device_orientation": "input_boolean.lightning_detection_compass_device_orientation",
    "map_grouping": "input_boolean.lightning_detection_map_grouping",
}

EXPECTED_FRESH_DEFAULTS = {
    "language": "English",
    "distance_unit": "KM",
    "compass_design": "Compass C",
    "reference_location": "zone.home",
    "observation_radius": 200,
    "storm_radius": 80,
    "danger_radius": 10,
    "aura_width": 40,
    "aura_intensity": 55,
    "aura_effects": True,
    "warning_animation": True,
    "storm_simulation": False,
    "show_location_selector": False,
    "compass_nearest_strike": False,
    "compass_device_orientation": False,
    "map_grouping": True,
}

EXPECTED_NATIVE_ENTITY_IDS = {
    "select.gewitterradar_language",
    "select.gewitterradar_distance_unit",
    "select.gewitterradar_compass_design",
    "select.gewitterradar_reference_location",
    "number.gewitterradar_observation_radius",
    "number.gewitterradar_storm_radius",
    "number.gewitterradar_danger_radius",
    "number.gewitterradar_aura_width",
    "number.gewitterradar_aura_intensity",
    "switch.gewitterradar_aura_effects",
    "switch.gewitterradar_warning_animation",
    "switch.gewitterradar_storm_simulation",
    "switch.gewitterradar_show_location_selector",
    "switch.gewitterradar_compass_nearest_strike",
    "switch.gewitterradar_compass_device_orientation",
    "switch.gewitterradar_map_grouping",
}


def _set_legacy_states(hass: HomeAssistant, values: dict[str, str]) -> None:
    """Create only the requested legacy helper states."""
    for key, value in values.items():
        hass.states.async_set(EXPECTED_LEGACY_ENTITIES[key], value)


async def _setup_entry(
    hass: HomeAssistant, *, options: dict | None = None, data: dict | None = None
) -> MockConfigEntry:
    """Set up one mock config entry."""
    entry = MockConfigEntry(
        domain=DOMAIN,
        title=NAME,
        options=options or {},
        data=data or {},
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_complete_valid_legacy_import_is_non_destructive(
    hass: HomeAssistant,
) -> None:
    """Import all 16 valid historical values and leave helpers untouched."""
    assert LEGACY_ENTITIES == EXPECTED_LEGACY_ENTITIES
    legacy_values = {
        "language": "Deutsch",
        "distance_unit": "MI",
        "compass_design": "Compass A",
        "reference_location": "person.test_user",
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
    hass.states.async_set("person.test_user", "home")
    _set_legacy_states(hass, legacy_values)
    before = {
        entity_id: hass.states.get(entity_id).state
        for entity_id in EXPECTED_LEGACY_ENTITIES.values()
    }

    entry = await _setup_entry(hass, data={"future_marker": "preserved"})

    assert entry.options == {
        "language": "Deutsch",
        "distance_unit": "MI",
        "compass_design": "Compass A",
        "reference_location": "person.test_user",
        "observation_radius": 75,
        "storm_radius": 30,
        "danger_radius": 15,
        "aura_width": 45,
        "aura_intensity": 65,
        "aura_effects": False,
        "warning_animation": False,
        "storm_simulation": True,
        "show_location_selector": True,
        "compass_nearest_strike": True,
        "compass_device_orientation": True,
        "map_grouping": False,
    }
    assert entry.data == {
        "future_marker": "preserved",
        CONF_LEGACY_IMPORT_VERSION: LEGACY_IMPORT_VERSION,
    }
    assert {
        entity_id: hass.states.get(entity_id).state
        for entity_id in EXPECTED_LEGACY_ENTITIES.values()
    } == before


async def test_native_option_wins_and_import_is_idempotent(
    hass: HomeAssistant,
) -> None:
    """Never replace native values and never re-import after the marker."""
    _set_legacy_states(
        hass,
        {
            "language": "English",
            "observation_radius": "75",
            "storm_radius": "30",
            "danger_radius": "15",
        },
    )
    entry = await _setup_entry(hass, options={CONF_LANGUAGE: "Suomi"})

    assert entry.options[CONF_LANGUAGE] == "Suomi"
    assert entry.options[CONF_OBSERVATION_RADIUS] == 75
    imported_options = dict(entry.options)

    hass.states.async_set(EXPECTED_LEGACY_ENTITIES["language"], "Deutsch")
    hass.states.async_set(EXPECTED_LEGACY_ENTITIES["observation_radius"], "900")
    assert await hass.config_entries.async_unload(entry.entry_id)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    assert entry.options == imported_options
    assert entry.data[CONF_LEGACY_IMPORT_VERSION] == LEGACY_IMPORT_VERSION


async def test_invalid_legacy_values_and_radii_do_not_block_setup(
    hass: HomeAssistant, caplog
) -> None:
    """Skip invalid helpers and discard an inconsistent imported radius group."""
    _set_legacy_states(
        hass,
        {
            "language": "unavailable",
            "distance_unit": "yards",
            "reference_location": "device_tracker.phone",
            "observation_radius": "75",
            "storm_radius": "100",
            "danger_radius": "15",
            "aura_width": "nan",
            "aura_effects": "maybe",
        },
    )
    before = {
        key: hass.states.get(entity_id).state
        for key, entity_id in EXPECTED_LEGACY_ENTITIES.items()
        if hass.states.get(entity_id) is not None
    }

    entry = await _setup_entry(hass)

    assert entry.state is ConfigEntryState.LOADED
    assert entry.options == EXPECTED_FRESH_DEFAULTS
    assert entry.data == {CONF_LEGACY_IMPORT_VERSION: LEGACY_IMPORT_VERSION}
    assert "device_tracker migration is not supported yet" in caplog.text
    assert "Ignoring inconsistent legacy radius values" in caplog.text
    assert {
        key: hass.states.get(entity_id).state for key, entity_id in LEGACY_ENTITIES.items()
        if hass.states.get(entity_id) is not None
    } == before


async def test_package_free_config_flow_setup_reload_and_service(
    hass: HomeAssistant,
) -> None:
    """Prove the complete fresh-install path without any YAML helper state."""
    assert DEFAULT_OPTIONS == EXPECTED_FRESH_DEFAULTS
    assert all(hass.states.get(entity_id) is None for entity_id in LEGACY_ENTITIES.values())

    flow = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": SOURCE_USER}
    )
    result = await hass.config_entries.flow.async_configure(flow["flow_id"], {})
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.CREATE_ENTRY
    entry = result["result"]
    assert entry.state is ConfigEntryState.LOADED
    assert entry.options == EXPECTED_FRESH_DEFAULTS
    assert entry.data == {CONF_LEGACY_IMPORT_VERSION: LEGACY_IMPORT_VERSION}
    registry = er.async_get(hass)
    assert {
        item.entity_id for item in er.async_entries_for_config_entry(registry, entry.entry_id)
    } == EXPECTED_NATIVE_ENTITY_IDS
    assert all(hass.states.get(entity_id) is None for entity_id in LEGACY_ENTITIES.values())

    await hass.services.async_call(
        "switch",
        "turn_on",
        {ATTR_ENTITY_ID: "switch.gewitterradar_storm_simulation"},
        blocking=True,
    )
    assert entry.options[CONF_STORM_SIMULATION] is True
    assert hass.states.get("switch.gewitterradar_storm_simulation").state == STATE_ON

    expected_options = dict(entry.options)
    assert await hass.config_entries.async_unload(entry.entry_id)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.LOADED
    assert entry.options == expected_options
    assert all(hass.states.get(entity_id) is None for entity_id in LEGACY_ENTITIES.values())
