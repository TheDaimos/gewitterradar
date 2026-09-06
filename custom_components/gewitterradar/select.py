"""Select platform for Gewitterradar."""

from homeassistant.components.select import SelectEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EntityCategory
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.helpers.event import (
    async_track_state_added_domain,
    async_track_state_removed_domain,
)

from . import GewitterradarRuntimeData
from .const import (
    COMPASS_DESIGN_OPTIONS,
    CONF_COMPASS_DESIGN,
    CONF_DISTANCE_UNIT,
    CONF_LANGUAGE,
    CONF_REFERENCE_LOCATION,
    DEFAULT_REFERENCE_LOCATION,
    DISTANCE_UNIT_OPTIONS,
    DOMAIN,
    LANGUAGE_OPTIONS,
    LOCATION_DOMAINS,
)

_FIXED_SELECTS = (
    (CONF_LANGUAGE, LANGUAGE_OPTIONS),
    (CONF_DISTANCE_UNIT, DISTANCE_UNIT_OPTIONS),
    (CONF_COMPASS_DESIGN, COMPASS_DESIGN_OPTIONS),
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry[GewitterradarRuntimeData],
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the Gewitterradar selects."""
    runtime = entry.runtime_data
    entities: list[SelectEntity] = [
        GewitterradarSelect(runtime, key, options) for key, options in _FIXED_SELECTS
    ]
    entities.append(GewitterradarReferenceLocationSelect(runtime))
    async_add_entities(entities)


class GewitterradarSelect(SelectEntity):
    """Represent a Config Entry options-backed Gewitterradar select."""

    _attr_entity_category = EntityCategory.CONFIG
    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(
        self,
        runtime: GewitterradarRuntimeData,
        key: str,
        options: tuple[str, ...],
    ) -> None:
        """Initialize a Gewitterradar select."""
        self._runtime = runtime
        self._key = key
        self._attr_options = list(options)
        self._attr_translation_key = key
        self._attr_unique_id = key

    @property
    def suggested_object_id(self) -> str:
        """Return the supported default object ID suggestion."""
        return f"{DOMAIN}_{self._key}"

    @property
    def current_option(self) -> str:
        """Return the currently selected option."""
        return self._runtime.get(self._key)

    async def async_select_option(self, option: str) -> None:
        """Persist an option selection."""
        self._runtime.async_set(self._key, option)
        self.async_write_ha_state()


class GewitterradarReferenceLocationSelect(GewitterradarSelect):
    """Select a dynamically discovered Home Assistant location entity."""

    def __init__(self, runtime: GewitterradarRuntimeData) -> None:
        """Initialize the reference-location select."""
        super().__init__(runtime, CONF_REFERENCE_LOCATION, ())

    @property
    def options(self) -> list[str]:
        """Return zone and person entity IDs currently known to Home Assistant."""
        current = self.current_option
        discovered = set(self.hass.states.async_entity_ids(LOCATION_DOMAINS))
        discovered.update((DEFAULT_REFERENCE_LOCATION, current))
        return [DEFAULT_REFERENCE_LOCATION, *sorted(discovered - {DEFAULT_REFERENCE_LOCATION})]

    async def async_added_to_hass(self) -> None:
        """Track additions and removals of supported location entities."""
        await super().async_added_to_hass()
        self.async_on_remove(
            async_track_state_added_domain(
                self.hass, LOCATION_DOMAINS, self._async_locations_changed
            )
        )
        self.async_on_remove(
            async_track_state_removed_domain(
                self.hass, LOCATION_DOMAINS, self._async_locations_changed
            )
        )

    @callback
    def _async_locations_changed(self, _: Event) -> None:
        """Publish changed dynamic location options."""
        self.async_write_ha_state()
