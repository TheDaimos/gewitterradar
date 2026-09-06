"""Regression tests from the first public HACS real-install review."""

from custom_components.gewitterradar.select import GewitterradarReferenceLocationSelect


class _ReferenceLocationProbe(GewitterradarReferenceLocationSelect):
    """Minimal probe which exercises only the location-change callback."""

    def __init__(self) -> None:
        self.scheduled_updates = 0

    def schedule_update_ha_state(self, force_refresh: bool = False) -> None:
        """Record use of Home Assistant's thread-safe scheduling API."""
        self.scheduled_updates += 1

    def async_write_ha_state(self) -> None:
        """Fail if the event-loop-only writer is reintroduced here."""
        raise AssertionError(
            "location change callbacks must not call async_write_ha_state directly"
        )


def test_reference_location_change_uses_threadsafe_state_scheduler() -> None:
    """Keep location add/remove callbacks safe when HA dispatches off-loop."""
    entity = _ReferenceLocationProbe()

    entity._locations_changed(None)  # type: ignore[arg-type]

    assert entity.scheduled_updates == 1
