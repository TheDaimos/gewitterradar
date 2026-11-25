"""Optional Monitored Areas lifecycle facade; no import-time HA actions."""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING

from .config import is_enabled
from .runtime import MonitoredAreasRuntime

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry
    from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)


async def async_setup_monitored_areas(
    hass: HomeAssistant, entry: ConfigEntry
) -> MonitoredAreasRuntime | None:
    """Start only on explicit opt-in; isolate failures from the GR entry."""
    runtime = None
    try:
        if not is_enabled(entry.options):
            return None
        runtime = MonitoredAreasRuntime()
        await runtime.async_start()
    except Exception:
        _LOGGER.exception("Monitored Areas startup failed; Gewitterradar continues")
        await async_unload_monitored_areas(runtime)
        return None
    return runtime


async def async_unload_monitored_areas(
    runtime: MonitoredAreasRuntime | None,
) -> None:
    """Stop only the optional runtime; None is a no-op."""
    if runtime is None:
        return
    try:
        await runtime.async_stop()
    except Exception:
        _LOGGER.exception("Monitored Areas shutdown failed")
