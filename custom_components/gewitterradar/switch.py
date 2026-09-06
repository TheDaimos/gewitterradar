"""Switch platform for Gewitterradar."""

from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import GewitterradarRuntimeData
from .const import DOMAIN, SWITCH_KEYS


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry[GewitterradarRuntimeData],
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the Gewitterradar switches."""
    async_add_entities(
        GewitterradarSwitch(entry.runtime_data, key) for key in SWITCH_KEYS
    )


class GewitterradarSwitch(SwitchEntity):
    """Represent a Config Entry options-backed Gewitterradar switch."""

    _attr_entity_category = EntityCategory.CONFIG
    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, runtime: GewitterradarRuntimeData, key: str) -> None:
        """Initialize a Gewitterradar switch."""
        self._runtime = runtime
        self._key = key
        self._attr_translation_key = key
        self._attr_unique_id = key

    @property
    def suggested_object_id(self) -> str:
        """Return the supported default object ID suggestion."""
        return f"{DOMAIN}_{self._key}"

    @property
    def is_on(self) -> bool:
        """Return whether this setting is enabled."""
        return self._runtime.get(self._key)

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Enable this setting."""
        self._runtime.async_set(self._key, True)
        self.async_write_ha_state()

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Disable this setting."""
        self._runtime.async_set(self._key, False)
        self.async_write_ha_state()
