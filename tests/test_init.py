"""Test Gewitterradar Config Entry lifecycle behavior."""

from unittest.mock import patch

from homeassistant.config_entries import SOURCE_USER, ConfigEntryState
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType

from custom_components import gewitterradar
from custom_components.gewitterradar.const import (
    CONF_LEGACY_IMPORT_VERSION,
    DOMAIN,
    LEGACY_IMPORT_VERSION,
)


async def test_setup_unload_reload_preserves_entry(hass: HomeAssistant) -> None:
    """Test HA-managed setup, unload and equivalent restart reload persistence."""
    with patch(
        "custom_components.gewitterradar.async_setup_entry",
        wraps=gewitterradar.async_setup_entry,
    ) as setup_entry:
        flow = await hass.config_entries.flow.async_init(
            DOMAIN,
            context={"source": SOURCE_USER},
        )
        result = await hass.config_entries.flow.async_configure(flow["flow_id"], {})
        await hass.async_block_till_done()

        assert result["type"] is FlowResultType.CREATE_ENTRY
        entry = result["result"]
        assert setup_entry.await_count == 1
        assert entry.state is ConfigEntryState.LOADED
        assert entry.data == {CONF_LEGACY_IMPORT_VERSION: LEGACY_IMPORT_VERSION}

        with patch(
            "custom_components.gewitterradar.async_unload_entry",
            wraps=gewitterradar.async_unload_entry,
        ) as unload_entry:
            assert await hass.config_entries.async_unload(entry.entry_id)
            await hass.async_block_till_done()

        assert unload_entry.await_count == 1
        assert entry.state is ConfigEntryState.NOT_LOADED
        assert hass.config_entries.async_get_entry(entry.entry_id) is entry
        assert entry.data == {CONF_LEGACY_IMPORT_VERSION: LEGACY_IMPORT_VERSION}

        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()

        assert setup_entry.await_count == 2
        assert entry.state is ConfigEntryState.LOADED
        assert hass.config_entries.async_get_entry(entry.entry_id) is entry
        assert entry.data == {CONF_LEGACY_IMPORT_VERSION: LEGACY_IMPORT_VERSION}
