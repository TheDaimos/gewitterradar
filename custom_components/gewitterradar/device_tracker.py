"""Device tracker platform for Gewitterradar V4.07."""

from __future__ import annotations

from typing import Any

from homeassistant.components.device_tracker import TrackerEntity
from homeassistant.components.device_tracker.const import SourceType
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import GewitterradarRuntimeData
from .const import (
    CONF_TRACKER_LATITUDE,
    CONF_TRACKER_LONGITUDE,
    CONF_TRACKER_NAME,
    DOMAIN,
    SIGNAL_REFERENCE_COORDINATES_UPDATED,
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry[GewitterradarRuntimeData],
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the Gewitterradar product-owned reference tracker."""
    async_add_entities([GewitterradarReferenceTracker(entry.runtime_data)])


class GewitterradarReferenceTracker(TrackerEntity):
    """Virtual GPS tracker used as the movable Gewitterradar reference."""

    _attr_name = "Gewitterradar"
    _attr_has_entity_name = False
    _attr_should_poll = False
    _attr_source_type = SourceType.GPS
    _attr_location_accuracy = 0

    def __init__(self, runtime: GewitterradarRuntimeData) -> None:
        """Initialize the tracker."""
        self._runtime = runtime
        self._attr_unique_id = f"{runtime.entry.entry_id}_reference_tracker"
        self._attr_suggested_object_id = DOMAIN

    @property
    def latitude(self) -> float:
        """Return the current product-owned latitude."""
        return float(self._runtime.tracker_value(CONF_TRACKER_LATITUDE))

    @property
    def longitude(self) -> float:
        """Return the current product-owned longitude."""
        return float(self._runtime.tracker_value(CONF_TRACKER_LONGITUDE))

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Expose human-readable reference and read-only Blitzortung setup status."""
        return {
            "reference_name": self._runtime.tracker_value(CONF_TRACKER_NAME),
            **self._runtime.blitzortung_status(),
        }

    async def async_added_to_hass(self) -> None:
        """Publish the final entity ID and listen for coordinate moves."""
        await super().async_added_to_hass()
        self._runtime.tracker_entity_id = self.entity_id
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass,
                f"{SIGNAL_REFERENCE_COORDINATES_UPDATED}_{self._runtime.entry.entry_id}",
                self._handle_reference_update,
            )
        )
        self.async_write_ha_state()

    async def async_will_remove_from_hass(self) -> None:
        """Forget the runtime entity ID when the platform is unloaded."""
        if self._runtime.tracker_entity_id == self.entity_id:
            self._runtime.tracker_entity_id = None
        await super().async_will_remove_from_hass()

    @callback
    def _handle_reference_update(self) -> None:
        """Publish changed coordinates and setup status immediately."""
        self.async_write_ha_state()
