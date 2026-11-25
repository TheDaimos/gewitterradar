"""P00: real HA test harness, no DEV deployment."""
import pytest
from homeassistant.config_entries import ConfigEntryState
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry
from custom_components.gewitterradar.const import DOMAIN, DEFAULT_OPTIONS
from custom_components.gewitterradar.monitored_areas.config import CONF_MONITORED_AREAS_ENABLED
from custom_components.gewitterradar import monitored_areas
from unittest.mock import patch

@pytest.mark.parametrize("flag", [None, False])
async def test_feature_off_native(hass, flag):
    options = dict(DEFAULT_OPTIONS)
    if flag is not None:
        options[CONF_MONITORED_AREAS_ENABLED] = flag
    entry = MockConfigEntry(domain=DOMAIN, title="Gewitterradar", options=options)
    entry.add_to_hass(hass)
    registry = er.async_get(hass)
    with patch.object(monitored_areas, "MonitoredAreasRuntime", side_effect=AssertionError("OFF constructed runtime")) as factory:
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
        assert entry.state is ConfigEntryState.LOADED
        assert entry.runtime_data.monitored_areas is None
        assert dict(entry.options) == options
        ids = {e.entity_id for e in er.async_entries_for_config_entry(registry, entry.entry_id)}
        from tests.test_migration_fresh_install import EXPECTED_NATIVE_ENTITY_IDS
        assert ids == EXPECTED_NATIVE_ENTITY_IDS
        assert all("monitored" not in key.lower() for key in hass.services.async_services().get(DOMAIN, {}))
        assert await hass.config_entries.async_reload(entry.entry_id)
        await hass.async_block_till_done()
        assert entry.runtime_data.monitored_areas is None
        assert await hass.config_entries.async_unload(entry.entry_id)
        await hass.async_block_till_done()
        factory.assert_not_called()
    from pathlib import Path
    assert not list(Path(hass.config.config_dir).rglob("*monitored*"))
