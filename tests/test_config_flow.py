"""Test the Gewitterradar config flow against Home Assistant."""

from homeassistant.config_entries import SOURCE_USER, ConfigEntryState
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType

from custom_components.gewitterradar.const import (
    CONF_LEGACY_IMPORT_VERSION,
    CONF_TRACKER_LATITUDE,
    CONF_TRACKER_LONGITUDE,
    CONF_TRACKER_NAME,
    DEFAULT_TRACKER_NAME,
    DOMAIN,
    LEGACY_IMPORT_VERSION,
    NAME,
)


async def test_user_flow_creates_one_neutral_loaded_entry(
    hass: HomeAssistant,
) -> None:
    """Test the UI form and creation of an installation-neutral entry."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN,
        context={"source": SOURCE_USER},
    )

    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "user"

    result = await hass.config_entries.flow.async_configure(result["flow_id"], {})
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == NAME
    assert result["data"] == {}
    entry = result["result"]
    assert entry.data[CONF_LEGACY_IMPORT_VERSION] == LEGACY_IMPORT_VERSION
    assert entry.data[CONF_TRACKER_NAME] == DEFAULT_TRACKER_NAME
    assert entry.data[CONF_TRACKER_LATITUDE] == hass.config.latitude
    assert entry.data[CONF_TRACKER_LONGITUDE] == hass.config.longitude
    assert set(entry.data) == {
        CONF_LEGACY_IMPORT_VERSION,
        CONF_TRACKER_LATITUDE,
        CONF_TRACKER_LONGITUDE,
        CONF_TRACKER_NAME,
    }
    assert entry.state is ConfigEntryState.LOADED
    assert len(hass.config_entries.async_entries(DOMAIN)) == 1


async def test_single_config_entry_blocks_second_flow(hass: HomeAssistant) -> None:
    """Test Home Assistant's manifest-level single-entry enforcement."""
    first = await hass.config_entries.flow.async_init(
        DOMAIN,
        context={"source": SOURCE_USER},
    )
    first = await hass.config_entries.flow.async_configure(first["flow_id"], {})
    await hass.async_block_till_done()

    assert first["type"] is FlowResultType.CREATE_ENTRY

    second = await hass.config_entries.flow.async_init(
        DOMAIN,
        context={"source": SOURCE_USER},
    )

    assert second["type"] is FlowResultType.ABORT
    assert second["reason"] == "single_instance_allowed"
    assert len(hass.config_entries.async_entries(DOMAIN)) == 1
