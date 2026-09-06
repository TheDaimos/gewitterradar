"""Number platform for Gewitterradar."""

from homeassistant.components.number import NumberEntity, NumberMode
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import PERCENTAGE, EntityCategory, UnitOfLength
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import GewitterradarRuntimeData
from .const import (
    CONF_AURA_INTENSITY,
    CONF_AURA_WIDTH,
    CONF_DANGER_RADIUS,
    CONF_OBSERVATION_RADIUS,
    CONF_STORM_RADIUS,
    DOMAIN,
)

_NUMBERS = (
    (CONF_OBSERVATION_RADIUS, 10.0, 1000.0, UnitOfLength.KILOMETERS),
    (CONF_STORM_RADIUS, 5.0, 1000.0, UnitOfLength.KILOMETERS),
    (CONF_DANGER_RADIUS, 1.0, 250.0, UnitOfLength.KILOMETERS),
    (CONF_AURA_WIDTH, 15.0, 60.0, PERCENTAGE),
    (CONF_AURA_INTENSITY, 0.0, 70.0, PERCENTAGE),
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry[GewitterradarRuntimeData],
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the Gewitterradar numbers."""
    async_add_entities(
        GewitterradarNumber(entry.runtime_data, key, minimum, maximum, unit)
        for key, minimum, maximum, unit in _NUMBERS
    )


class GewitterradarNumber(NumberEntity):
    """Represent a Config Entry options-backed Gewitterradar number."""

    _attr_entity_category = EntityCategory.CONFIG
    _attr_has_entity_name = True
    _attr_mode = NumberMode.SLIDER
    _attr_native_step = 1
    _attr_should_poll = False

    def __init__(
        self,
        runtime: GewitterradarRuntimeData,
        key: str,
        minimum: float,
        maximum: float,
        unit: str,
    ) -> None:
        """Initialize a Gewitterradar number."""
        self._runtime = runtime
        self._key = key
        self._attr_native_min_value = minimum
        self._attr_native_max_value = maximum
        self._attr_native_unit_of_measurement = unit
        self._attr_translation_key = key
        self._attr_unique_id = key

    @property
    def suggested_object_id(self) -> str:
        """Return the supported default object ID suggestion."""
        return f"{DOMAIN}_{self._key}"

    @property
    def native_value(self) -> float:
        """Return the current native value."""
        return self._runtime.get(self._key)

    async def async_set_native_value(self, value: float) -> None:
        """Validate and persist a native value."""
        self._runtime.async_set(self._key, value)
        self.async_write_ha_state()
