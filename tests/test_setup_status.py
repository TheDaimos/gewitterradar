"""Read-only onboarding checks using the real Home Assistant WS boundary."""

from unittest.mock import patch

from homeassistant.helpers import entity_registry as er
from homeassistant.components import websocket_api
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.gewitterradar.const import DOMAIN, NAME
from custom_components.gewitterradar.setup_status import SOURCE_GLOBS, recorder_config_covers_sources
from custom_components.gewitterradar.setup_status import ws_setup_status


def test_recorder_configuration_coverage_and_include_precedence():
    config = {"recorder": {"exclude": {"entity_globs": list(SOURCE_GLOBS)}}}
    assert recorder_config_covers_sources(config)
    assert not recorder_config_covers_sources({})
    assert not recorder_config_covers_sources({"recorder": {"exclude": {"entity_globs": list(SOURCE_GLOBS[:-1])}}})
    assert recorder_config_covers_sources({"recorder": {"exclude": {"domains": ["sensor", "geo_location"]}}})
    config["recorder"]["include"] = {"entities": ["sensor.test_lightning_counter"]}
    assert not recorder_config_covers_sources(config)
    config["recorder"]["include"] = {"entities": ["sensor.unrelated_temperature"]}
    assert recorder_config_covers_sources(config)
    config["recorder"]["include"] = {"entity_globs": ["sensor.*"]}
    assert not recorder_config_covers_sources(config)


async def test_setup_status_independent_checks_and_no_foreign_mutation(hass, hass_ws_client):
    product = MockConfigEntry(domain=DOMAIN, title=NAME, data={}, options={})
    product.add_to_hass(hass)
    assert await hass.config_entries.async_setup(product.entry_id)
    await hass.async_block_till_done()
    foreign = MockConfigEntry(domain="blitzortung", data={"location_entity": "device_tracker.gewitterradar"})
    foreign.add_to_hass(hass)
    before = dict(foreign.data)
    todo = er.async_get(hass).async_get_or_create(
        "todo", "local_todo", "synthetic-places", original_name="Gewitterradar Orte"
    )
    hass.states.async_set(todo.entity_id, "0")
    hass.config.components.add("recorder")
    config = {"recorder": {"exclude": {"entity_globs": list(SOURCE_GLOBS)}}}
    client = await hass_ws_client(hass)
    with patch("custom_components.gewitterradar.setup_status.async_hass_config_yaml", return_value=config), patch(
        "homeassistant.components.recorder.is_entity_recorded", return_value=False
    ):
        await client.send_json({"id": 1, "type": "gewitterradar/setup_status"})
        answer = await client.receive_json()
    assert answer["success"], answer
    assert answer["result"] == {
        "schema": "gewitterradar.setup-status.v1", "blitzortungInstalled": True,
        "trackerLinked": True, "recorderExcluded": True, "localTodoCreated": True,
    }
    assert dict(foreign.data) == before
    # YAML awaiting restart: the active Recorder filter still records sources.
    with patch("custom_components.gewitterradar.setup_status.async_hass_config_yaml", return_value=config), patch(
        "homeassistant.components.recorder.is_entity_recorded", return_value=True
    ):
        await client.send_json({"id": 2, "type": "gewitterradar/setup_status"})
        answer = await client.receive_json()
    assert answer["result"]["recorderExcluded"] is False
    assert answer["result"]["blitzortungInstalled"] is True


async def test_nonadmin_gets_safe_status_without_reading_yaml(hass, hass_ws_client, hass_read_only_access_token):
    assert await async_setup_component(hass, "websocket_api", {})
    websocket_api.async_register_command(hass, ws_setup_status)
    hass.config.components.add("recorder")
    client = await hass_ws_client(hass, hass_read_only_access_token)
    with patch("custom_components.gewitterradar.setup_status.async_hass_config_yaml") as yaml:
        await client.send_json({"id": 1, "type": "gewitterradar/setup_status"})
        answer = await client.receive_json()
    assert answer["success"], answer
    assert answer["result"]["recorderExcluded"] is None
    yaml.assert_not_called()
