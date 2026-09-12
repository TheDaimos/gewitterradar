"""V4.07 product-owned reference-tracker contract tests."""

from homeassistant.const import ATTR_LATITUDE, ATTR_LONGITUDE
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.gewitterradar.const import (
    BLITZORTUNG_DOMAIN,
    BLITZORTUNG_LOCATION_ENTITY_KEY,
    CONF_REFERENCE_LOCATION,
    CONF_TRACKER_LATITUDE,
    CONF_TRACKER_LONGITUDE,
    CONF_TRACKER_NAME,
    DOMAIN,
    NAME,
    SERVICE_FIELD_LATITUDE,
    SERVICE_FIELD_LONGITUDE,
    SERVICE_FIELD_NAME,
    SERVICE_SET_REFERENCE_COORDINATES,
)


async def test_coordinate_service_moves_only_owned_tracker(
    hass: HomeAssistant,
) -> None:
    """Move the owned tracker without mutating a foreign Blitzortung entry."""
    foreign = MockConfigEntry(
        domain=BLITZORTUNG_DOMAIN,
        title="Blitzortung",
        data={
            "latitude": 53.0,
            "longitude": 10.0,
            BLITZORTUNG_LOCATION_ENTITY_KEY: "zone.home",
        },
        options={"radius": 100},
    )
    foreign.add_to_hass(hass)
    foreign_data_before = dict(foreign.data)
    foreign_options_before = dict(foreign.options)

    entry = MockConfigEntry(domain=DOMAIN, title=NAME, data={}, options={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    tracker_entity_id = entry.runtime_data.tracker_entity_id
    assert tracker_entity_id == "device_tracker.gewitterradar"

    await hass.services.async_call(
        DOMAIN,
        SERVICE_SET_REFERENCE_COORDINATES,
        {
            SERVICE_FIELD_LATITUDE: 69.6492,
            SERVICE_FIELD_LONGITUDE: 18.9553,
            SERVICE_FIELD_NAME: "Tromsø",
        },
        blocking=True,
    )
    await hass.async_block_till_done()

    assert entry.data[CONF_TRACKER_LATITUDE] == 69.6492
    assert entry.data[CONF_TRACKER_LONGITUDE] == 18.9553
    assert entry.data[CONF_TRACKER_NAME] == "Tromsø"
    assert entry.options[CONF_REFERENCE_LOCATION] == tracker_entity_id

    tracker = hass.states.get(tracker_entity_id)
    assert tracker is not None
    assert tracker.attributes[ATTR_LATITUDE] == 69.6492
    assert tracker.attributes[ATTR_LONGITUDE] == 18.9553
    assert tracker.attributes["reference_name"] == "Tromsø"
    assert tracker.attributes["installed"] is True
    assert tracker.attributes["linked"] is False
    assert tracker.attributes["setup_required"] is True
    assert tracker.attributes["matching_entries"] == 0
    assert tracker.attributes["tracker_entity_id"] == tracker_entity_id

    assert dict(foreign.data) == foreign_data_before
    assert dict(foreign.options) == foreign_options_before
