"""V4.11.69 read-only Blitzortung diagnostics for multiple HA config entries."""

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.gewitterradar.const import DOMAIN, NAME


async def test_blitzortung_multi_location_websocket_read_only(
    hass: HomeAssistant, hass_ws_client
) -> None:
    """Per-entry settings and tracker association must never modify Blitzortung."""
    first = MockConfigEntry(
        domain="blitzortung",
        title="Kaltenkirchen",
        data={
            "config_type": "entity",
            "location_entity": "device_tracker.gewitterradar",
        },
        options={"radius": 1000, "time_window": 120, "max_tracked_lightnings": 100},
    )
    second = MockConfigEntry(
        domain="blitzortung",
        title="Zweiter Ort",
        data={
            "config_type": "coordinates",
            "latitude": 52.5,
            "longitude": 13.4,
        },
        options={"radius": 250, "time_window": 90, "max_tracked_lightnings": 0},
    )
    for foreign in (first, second):
        foreign.add_to_hass(hass)
    old_data = {x.entry_id: dict(x.data) for x in (first, second)}
    old_options = {x.entry_id: dict(x.options) for x in (first, second)}

    product = MockConfigEntry(domain=DOMAIN, title=NAME, data={}, options={})
    product.add_to_hass(hass)
    assert await hass.config_entries.async_setup(product.entry_id)
    await hass.async_block_till_done()

    client = await hass_ws_client(hass)
    await client.send_json({"id": 19, "type": "gewitterradar/data_sources"})
    answer = await client.receive_json()
    assert answer["success"], answer
    result = answer["result"]
    assert result["schema"] == "gewitterradar.data-sources.v1"
    assert result["integrationInstalled"] is True
    assert result["linkedEntries"] == 1
    assert result["referenceTrackers"] == ["device_tracker.gewitterradar"]

    entries = {entry["name"]: entry for entry in result["entries"]}
    assert len(entries) == 2
    assert entries["Kaltenkirchen"]["referenceTrackerLinked"] is True
    assert entries["Kaltenkirchen"]["settings"]["radius"] == 1000
    assert entries["Kaltenkirchen"]["settings"]["timeWindow"] == 120
    assert entries["Kaltenkirchen"]["settings"]["maxTrackedLightnings"] == 100
    assert entries["Zweiter Ort"]["referenceTrackerLinked"] is False
    assert entries["Zweiter Ort"]["coordinates"]["latitude"] == 52.5
    assert entries["Zweiter Ort"]["settings"]["maxTrackedLightnings"] == 0

    for foreign in (first, second):
        assert dict(foreign.data) == old_data[foreign.entry_id]
        assert dict(foreign.options) == old_options[foreign.entry_id]
