"""Config flow and integration options for Gewitterradar."""

from typing import Any

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.config_entries import ConfigEntry, ConfigFlowResult, OptionsFlowWithReload
from homeassistant.core import callback

from .const import CONF_SHOW_SIDEBAR_PANEL, DOMAIN, NAME

SIDEBAR_OPTIONS_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_SHOW_SIDEBAR_PANEL): bool,
    }
)


class GewitterradarConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a Gewitterradar config flow."""

    VERSION = 1

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: ConfigEntry,
    ) -> "GewitterradarOptionsFlow":
        """Return the native integration options flow."""
        return GewitterradarOptionsFlow()

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Create the single, installation-neutral config entry."""
        if user_input is not None:
            return self.async_create_entry(title=NAME, data={})

        return self.async_show_form(step_id="user")


class GewitterradarOptionsFlow(OptionsFlowWithReload):
    """Manage Gewitterradar integration options and reload after changes."""

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure direct sidebar access without exposing a helper entity."""
        if user_input is not None:
            options = {
                **self.config_entry.options,
                CONF_SHOW_SIDEBAR_PANEL: user_input[CONF_SHOW_SIDEBAR_PANEL],
            }
            return self.async_create_entry(data=options)

        return self.async_show_form(
            step_id="init",
            data_schema=self.add_suggested_values_to_schema(
                SIDEBAR_OPTIONS_SCHEMA,
                self.config_entry.options,
            ),
        )
