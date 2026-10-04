"""Test the Gewitterradar config flow against Home Assistant."""

from homeassistant.components import frontend
from homeassistant.config_entries import SOURCE_USER, ConfigEntryState
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType

from custom_components.gewitterradar.const import (
    CONF_LANGUAGE,
    CONF_LEGACY_IMPORT_VERSION,
    CONF_SHOW_SIDEBAR_PANEL,
    CONF_TRACKER_LATITUDE,
    CONF_TRACKER_LONGITUDE,
    CONF_TRACKER_NAME,
    DEFAULT_TRACKER_NAME,
    DOMAIN,
    LEGACY_IMPORT_VERSION,
    NAME,
    SIDEBAR_PANEL_URL_PATH,
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


async def test_options_flow_toggles_sidebar_preserves_options_and_reloads(
    hass: HomeAssistant,
) -> None:
    """Use Configure to control the sidebar while preserving all native options."""
    flow = await hass.config_entries.flow.async_init(
        DOMAIN,
        context={"source": SOURCE_USER},
    )
    created = await hass.config_entries.flow.async_configure(flow["flow_id"], {})
    await hass.async_block_till_done()
    entry = created["result"]

    hass.config_entries.async_update_entry(
        entry,
        options={
            **entry.options,
            CONF_LANGUAGE: "Deutsch",
            "future_option": "preserved",
        },
    )

    options = await hass.config_entries.options.async_init(entry.entry_id)
    assert options["type"] is FlowResultType.FORM
    assert options["step_id"] == "init"

    enabled = await hass.config_entries.options.async_configure(
        options["flow_id"],
        {CONF_SHOW_SIDEBAR_PANEL: True},
    )
    await hass.async_block_till_done()

    assert enabled["type"] is FlowResultType.CREATE_ENTRY
    assert entry.state is ConfigEntryState.LOADED
    assert entry.options[CONF_SHOW_SIDEBAR_PANEL] is True
    assert entry.options[CONF_LANGUAGE] == "Deutsch"
    assert entry.options["future_option"] == "preserved"
    assert frontend.async_panel_exists(hass, SIDEBAR_PANEL_URL_PATH)
    assert hass.states.get("switch.gewitterradar_show_sidebar_panel") is None

    options = await hass.config_entries.options.async_init(entry.entry_id)
    disabled = await hass.config_entries.options.async_configure(
        options["flow_id"],
        {CONF_SHOW_SIDEBAR_PANEL: False},
    )
    await hass.async_block_till_done()

    assert disabled["type"] is FlowResultType.CREATE_ENTRY
    assert entry.state is ConfigEntryState.LOADED
    assert entry.options[CONF_SHOW_SIDEBAR_PANEL] is False
    assert entry.options[CONF_LANGUAGE] == "Deutsch"
    assert entry.options["future_option"] == "preserved"
    assert not frontend.async_panel_exists(hass, SIDEBAR_PANEL_URL_PATH)
