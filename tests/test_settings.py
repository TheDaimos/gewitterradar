"""Test the complete V0.14 native settings model against Home Assistant."""

import asyncio
import json

import pytest

from homeassistant.components.number import ATTR_MAX, ATTR_MIN, ATTR_MODE, ATTR_STEP
from homeassistant.config_entries import ConfigEntryState
from homeassistant.const import (
    ATTR_ENTITY_ID,
    ATTR_UNIT_OF_MEASUREMENT,
    STATE_OFF,
    STATE_ON,
    STATE_UNAVAILABLE,
    EntityCategory,
    EntityStateAttribute,
)
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.gewitterradar.const import (
    CONF_AURA_EFFECTS,
    CONF_AURA_INTENSITY,
    CONF_AURA_WIDTH,
    CONF_COMPASS_DESIGN,
    CONF_COMPASS_DEVICE_ORIENTATION,
    CONF_COMPASS_NEAREST_STRIKE,
    CONF_DANGER_RADIUS,
    CONF_DISTANCE_UNIT,
    CONF_LANGUAGE,
    CONF_LEGACY_IMPORT_VERSION,
    CONF_MAP_GROUPING,
    CONF_OBSERVATION_RADIUS,
    CONF_REFERENCE_LOCATION,
    CONF_SHOW_LOCATION_SELECTOR,
    CONF_STORM_RADIUS,
    CONF_STORM_SIMULATION,
    CONF_WARNING_ANIMATION,
    DEFAULT_OPTIONS,
    DOMAIN,
    LEGACY_IMPORT_VERSION,
    NAME,
)

EXPECTED_DEFAULT_OPTIONS = {
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
EXPECTED_LANGUAGE_OPTIONS = (
    "Deutsch",
    "English",
    "Dansk",
    "Español",
    "Français",
    "Nederlands",
    "Polski",
    "Português",
    "Svenska",
    "Italiano",
    "Norsk bokmål",
    "Suomi",
    "Čeština",
    "Ελληνικά",
    "Magyar",
    "Boarisch",
    "Plattdüütsch",
    "Sächs’sch",
    "Schwäbisch",
)
EXPECTED_DISTANCE_UNIT_OPTIONS = ("KM", "MI")
EXPECTED_COMPASS_DESIGN_OPTIONS = ("Compass A", "Compass B", "Compass C")

ENTITY_IDS_BY_KEY = {
    "language": "select.gewitterradar_language",
    "distance_unit": "select.gewitterradar_distance_unit",
    "compass_design": "select.gewitterradar_compass_design",
    "reference_location": "select.gewitterradar_reference_location",
    "observation_radius": "number.gewitterradar_observation_radius",
    "storm_radius": "number.gewitterradar_storm_radius",
    "danger_radius": "number.gewitterradar_danger_radius",
    "aura_width": "number.gewitterradar_aura_width",
    "aura_intensity": "number.gewitterradar_aura_intensity",
    "aura_effects": "switch.gewitterradar_aura_effects",
    "warning_animation": "switch.gewitterradar_warning_animation",
    "storm_simulation": "switch.gewitterradar_storm_simulation",
    "show_location_selector": "switch.gewitterradar_show_location_selector",
    "compass_nearest_strike": "switch.gewitterradar_compass_nearest_strike",
    "compass_device_orientation": "switch.gewitterradar_compass_device_orientation",
    "map_grouping": "switch.gewitterradar_map_grouping",
}
ENTITY_IDS = set(ENTITY_IDS_BY_KEY.values())

EXPECTED_NUMBER_CAPABILITIES = {
    "number.gewitterradar_observation_radius": (10, 1000, 1, "slider", "km"),
    "number.gewitterradar_storm_radius": (5, 1000, 1, "slider", "km"),
    "number.gewitterradar_danger_radius": (1, 250, 1, "slider", "km"),
    "number.gewitterradar_aura_width": (15, 60, 1, "slider", "%"),
    "number.gewitterradar_aura_intensity": (0, 70, 1, "slider", "%"),
}


async def _setup_entry(
    hass: HomeAssistant, *, options: dict | None = None, data: dict | None = None
) -> MockConfigEntry:
    """Add and set up a Gewitterradar config entry."""
    entry = MockConfigEntry(
        domain=DOMAIN,
        title=NAME,
        data=data or {},
        options=options or {},
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def _call_service(
    hass: HomeAssistant,
    domain: str,
    service: str,
    entity_id: str,
    **data: object,
) -> None:
    """Call an entity service and wait for completion."""
    await hass.services.async_call(
        domain,
        service,
        {ATTR_ENTITY_ID: entity_id, **data},
        blocking=True,
    )


async def test_defaults_entities_ids_and_unique_ids(hass: HomeAssistant) -> None:
    """Test all defaults and exactly 16 stable native entities."""
    entry = await _setup_entry(hass)

    assert DEFAULT_OPTIONS == EXPECTED_DEFAULT_OPTIONS
    assert entry.options == EXPECTED_DEFAULT_OPTIONS
    assert len(entry.options) == 16
    assert entry.data == {CONF_LEGACY_IMPORT_VERSION: LEGACY_IMPORT_VERSION}

    registry = er.async_get(hass)
    registry_entries = er.async_entries_for_config_entry(registry, entry.entry_id)
    assert {registry_entry.entity_id for registry_entry in registry_entries} == ENTITY_IDS
    assert len(registry_entries) == 16
    for key, entity_id in ENTITY_IDS_BY_KEY.items():
        registry_entry = registry.async_get(entity_id)
        assert registry_entry is not None
        assert registry_entry.unique_id == key
        assert registry_entry.config_entry_id == entry.entry_id
        assert registry_entry.entity_category is EntityCategory.CONFIG

        state = hass.states.get(entity_id)
        assert state is not None
        expected = EXPECTED_DEFAULT_OPTIONS[key]
        if isinstance(expected, bool):
            assert state.state == (STATE_ON if expected else STATE_OFF)
        elif isinstance(expected, (int, float)):
            assert float(state.state) == expected
        else:
            assert state.state == expected

    assert tuple(
        hass.states.get(ENTITY_IDS_BY_KEY[CONF_LANGUAGE]).attributes["options"]
    ) == EXPECTED_LANGUAGE_OPTIONS
    assert tuple(
        hass.states.get(ENTITY_IDS_BY_KEY[CONF_DISTANCE_UNIT]).attributes["options"]
    ) == EXPECTED_DISTANCE_UNIT_OPTIONS
    assert tuple(
        hass.states.get(ENTITY_IDS_BY_KEY[CONF_COMPASS_DESIGN]).attributes["options"]
    ) == EXPECTED_COMPASS_DESIGN_OPTIONS

    for entity_id, expected in EXPECTED_NUMBER_CAPABILITIES.items():
        attributes = hass.states.get(entity_id).attributes
        minimum, maximum, step, mode, unit = expected
        assert attributes[ATTR_MIN] == minimum
        assert attributes[ATTR_MAX] == maximum
        assert attributes[ATTR_STEP] == step
        assert attributes[ATTR_MODE] == mode
        assert attributes[ATTR_UNIT_OF_MEASUREMENT] == unit


async def test_existing_options_and_unknown_keys_are_preserved(
    hass: HomeAssistant,
) -> None:
    """Test missing defaults adapt without overwriting stored options or data."""
    original_data = {"future_neutral_marker": "unchanged"}
    entry = await _setup_entry(
        hass,
        data=original_data,
        options={
            CONF_LANGUAGE: "Deutsch",
            CONF_OBSERVATION_RADIUS: 20,
            "future_option": "preserved",
        },
    )

    assert entry.data == {
        **original_data,
        CONF_LEGACY_IMPORT_VERSION: LEGACY_IMPORT_VERSION,
    }
    assert entry.options[CONF_LANGUAGE] == "Deutsch"
    assert entry.options[CONF_OBSERVATION_RADIUS] == 20
    assert entry.options[CONF_STORM_RADIUS] == 20
    assert entry.options[CONF_DANGER_RADIUS] == 10
    assert entry.options["future_option"] == "preserved"


async def test_inconsistent_stored_radii_reject_setup_without_changes(
    hass: HomeAssistant,
) -> None:
    """Test controlled setup rejection without repairing stored radii."""
    original_options = {
        **EXPECTED_DEFAULT_OPTIONS,
        "observation_radius": 50,
        "storm_radius": 60,
        "future_option": "preserved",
    }
    original_data = {"future_neutral_marker": "unchanged"}
    serialized_options = json.dumps(
        original_options, ensure_ascii=False, sort_keys=True, separators=(",", ":")
    )
    entry = MockConfigEntry(
        domain=DOMAIN,
        title=NAME,
        data=original_data,
        options=original_options,
    )
    entry.add_to_hass(hass)

    assert not await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    assert entry.state is ConfigEntryState.SETUP_ERROR
    assert dict(entry.options) == original_options
    assert (
        json.dumps(
            dict(entry.options),
            ensure_ascii=False,
            sort_keys=True,
            separators=(",", ":"),
        )
        == serialized_options
    )
    assert dict(entry.data) == original_data


async def test_all_select_number_and_switch_service_writes(
    hass: HomeAssistant,
) -> None:
    """Test representative writes across every setting and persistence."""
    hass.states.async_set("person.test_user", "home")
    entry = await _setup_entry(hass)

    select_values = {
        CONF_LANGUAGE: "Suomi",
        CONF_DISTANCE_UNIT: "MI",
        CONF_COMPASS_DESIGN: "Compass A",
        CONF_REFERENCE_LOCATION: "person.test_user",
    }
    for key, value in select_values.items():
        await _call_service(
            hass,
            "select",
            "select_option",
            ENTITY_IDS_BY_KEY[key],
            option=value,
        )

    number_values = {
        CONF_OBSERVATION_RADIUS: 200,
        CONF_STORM_RADIUS: 100,
        CONF_DANGER_RADIUS: 50,
        CONF_AURA_WIDTH: 60,
        CONF_AURA_INTENSITY: 70,
    }
    for key, value in number_values.items():
        await _call_service(
            hass, "number", "set_value", ENTITY_IDS_BY_KEY[key], value=value
        )

    for key in (
        CONF_AURA_EFFECTS,
        CONF_WARNING_ANIMATION,
        CONF_MAP_GROUPING,
    ):
        await _call_service(hass, "switch", "turn_off", ENTITY_IDS_BY_KEY[key])
    for key in (
        CONF_STORM_SIMULATION,
        CONF_SHOW_LOCATION_SELECTOR,
        CONF_COMPASS_NEAREST_STRIKE,
        CONF_COMPASS_DEVICE_ORIENTATION,
    ):
        await _call_service(hass, "switch", "turn_on", ENTITY_IDS_BY_KEY[key])

    assert all(entry.options[key] == value for key, value in select_values.items())
    assert all(entry.options[key] == value for key, value in number_values.items())
    assert entry.options[CONF_AURA_EFFECTS] is False
    assert entry.options[CONF_WARNING_ANIMATION] is False
    assert entry.options[CONF_MAP_GROUPING] is False
    assert entry.options[CONF_STORM_SIMULATION] is True
    assert entry.options[CONF_SHOW_LOCATION_SELECTOR] is True
    assert entry.options[CONF_COMPASS_NEAREST_STRIKE] is True
    assert entry.options[CONF_COMPASS_DEVICE_ORIENTATION] is True

    valid_options = dict(entry.options)
    with pytest.raises(ServiceValidationError):
        await _call_service(
            hass,
            "select",
            "select_option",
            ENTITY_IDS_BY_KEY[CONF_LANGUAGE],
            option="Klingon",
        )
    assert entry.options == valid_options


async def test_number_bounds_and_radius_invariants_are_lossless(
    hass: HomeAssistant,
) -> None:
    """Test all number bounds and reject inconsistent radius writes."""
    entry = await _setup_entry(hass)

    invalid_calls = (
        (CONF_OBSERVATION_RADIUS, 9),
        (CONF_OBSERVATION_RADIUS, 1001),
        (CONF_STORM_RADIUS, 4),
        (CONF_STORM_RADIUS, 1001),
        (CONF_DANGER_RADIUS, 0),
        (CONF_DANGER_RADIUS, 251),
        (CONF_AURA_WIDTH, 14),
        (CONF_AURA_WIDTH, 61),
        (CONF_AURA_INTENSITY, -1),
        (CONF_AURA_INTENSITY, 71),
        (CONF_OBSERVATION_RADIUS, 29),
        (CONF_STORM_RADIUS, 201),
        (CONF_STORM_RADIUS, 9),
        (CONF_DANGER_RADIUS, 81),
    )
    for key, value in invalid_calls:
        valid_options = dict(entry.options)
        with pytest.raises(ServiceValidationError):
            await _call_service(
                hass, "number", "set_value", ENTITY_IDS_BY_KEY[key], value=value
            )
        assert entry.options == valid_options

    await _call_service(
        hass,
        "number",
        "set_value",
        ENTITY_IDS_BY_KEY[CONF_AURA_WIDTH],
        value=15,
    )
    await _call_service(
        hass,
        "number",
        "set_value",
        ENTITY_IDS_BY_KEY[CONF_AURA_INTENSITY],
        value=0,
    )
    assert entry.options[CONF_AURA_WIDTH] == 15
    assert entry.options[CONF_AURA_INTENSITY] == 0

    await _call_service(
        hass,
        "number",
        "set_value",
        ENTITY_IDS_BY_KEY[CONF_OBSERVATION_RADIUS],
        value=1000,
    )
    await _call_service(
        hass,
        "number",
        "set_value",
        ENTITY_IDS_BY_KEY[CONF_STORM_RADIUS],
        value=1000,
    )
    await _call_service(
        hass,
        "number",
        "set_value",
        ENTITY_IDS_BY_KEY[CONF_DANGER_RADIUS],
        value=250,
    )
    assert entry.options[CONF_DANGER_RADIUS] == 250

    await _call_service(
        hass,
        "number",
        "set_value",
        ENTITY_IDS_BY_KEY[CONF_DANGER_RADIUS],
        value=1,
    )
    await _call_service(
        hass,
        "number",
        "set_value",
        ENTITY_IDS_BY_KEY[CONF_STORM_RADIUS],
        value=5,
    )
    await _call_service(
        hass,
        "number",
        "set_value",
        ENTITY_IDS_BY_KEY[CONF_OBSERVATION_RADIUS],
        value=10,
    )
    assert (
        1
        <= entry.options[CONF_DANGER_RADIUS]
        <= entry.options[CONF_STORM_RADIUS]
        <= entry.options[CONF_OBSERVATION_RADIUS]
        <= 1000
    )


async def test_dynamic_reference_location_options(hass: HomeAssistant) -> None:
    """Test dynamic person/zone discovery without production hard-coding."""
    hass.states.async_set("zone.office", "zoning")
    hass.states.async_set("person.test_user", "home")
    entry = await _setup_entry(hass)
    entity_id = ENTITY_IDS_BY_KEY[CONF_REFERENCE_LOCATION]

    options = hass.states.get(entity_id).attributes["options"]
    assert options[0] == "zone.home"
    assert "zone.office" in options
    assert "person.test_user" in options
    assert all(option.split(".", 1)[0] in {"person", "zone"} for option in options)

    hass.states.async_set("person.second_test_user", "not_home")
    await hass.async_block_till_done()
    assert "person.second_test_user" in hass.states.get(entity_id).attributes["options"]

    hass.states.async_remove("zone.office")
    await hass.async_block_till_done()
    assert "zone.office" not in hass.states.get(entity_id).attributes["options"]

    await _call_service(
        hass, "select", "select_option", entity_id, option="person.test_user"
    )
    hass.states.async_remove("person.test_user")
    await hass.async_block_till_done()
    options = hass.states.get(entity_id).attributes["options"]
    assert "person.test_user" in options
    assert entry.options[CONF_REFERENCE_LOCATION] == "person.test_user"


async def test_mixed_updates_unload_and_reload_preserve_every_option(
    hass: HomeAssistant,
) -> None:
    """Test lossless rapid writes and HA 2026.9 unload/reload semantics."""
    entry = await _setup_entry(hass, options={"future_option": "preserved"})

    await asyncio.gather(
        _call_service(
            hass,
            "select",
            "select_option",
            ENTITY_IDS_BY_KEY[CONF_LANGUAGE],
            option="Dansk",
        ),
        _call_service(
            hass,
            "number",
            "set_value",
            ENTITY_IDS_BY_KEY[CONF_AURA_WIDTH],
            value=45,
        ),
        _call_service(
            hass, "switch", "turn_off", ENTITY_IDS_BY_KEY[CONF_WARNING_ANIMATION]
        ),
        _call_service(
            hass, "switch", "turn_on", ENTITY_IDS_BY_KEY[CONF_STORM_SIMULATION]
        ),
    )
    expected_options = {
        **DEFAULT_OPTIONS,
        CONF_LANGUAGE: "Dansk",
        CONF_AURA_WIDTH: 45,
        CONF_WARNING_ANIMATION: False,
        CONF_STORM_SIMULATION: True,
        "future_option": "preserved",
    }
    assert entry.options == expected_options

    assert await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.NOT_LOADED
    for entity_id in ENTITY_IDS:
        unloaded_state = hass.states.get(entity_id)
        assert unloaded_state is not None
        assert unloaded_state.state == STATE_UNAVAILABLE
        assert unloaded_state.attributes[EntityStateAttribute.RESTORED] is True
    assert entry.options == expected_options

    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.LOADED
    assert entry.options == expected_options
    for key, entity_id in ENTITY_IDS_BY_KEY.items():
        state = hass.states.get(entity_id)
        assert state is not None
        expected = expected_options[key]
        if isinstance(expected, bool):
            assert state.state == (STATE_ON if expected else STATE_OFF)
        elif isinstance(expected, (int, float)):
            assert float(state.state) == expected
        else:
            assert state.state == expected
