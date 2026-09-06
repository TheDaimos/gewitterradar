"""Config flow for Gewitterradar."""

from typing import Any

from homeassistant import config_entries
from homeassistant.config_entries import ConfigFlowResult

from .const import DOMAIN, NAME


class GewitterradarConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a Gewitterradar config flow."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Create the single, installation-neutral config entry."""
        if user_input is not None:
            return self.async_create_entry(title=NAME, data={})

        return self.async_show_form(step_id="user")
