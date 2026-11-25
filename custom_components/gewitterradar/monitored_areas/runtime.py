"""MA-006 entry-owned optional database lifecycle."""
import asyncio
from .contracts import LifecycleStatus
from .storage.database import Database


class MonitoredAreasRuntime:
    def __init__(self, hass) -> None:
        self._hass = hass
        self._status = LifecycleStatus.STOPPED
        self._lock = asyncio.Lock()
        self.database = None
        self._unsubscribe = None

    @property
    def status(self) -> LifecycleStatus:
        return self._status

    async def async_start(self) -> None:
        async with self._lock:
            if self._status is LifecycleStatus.READY:
                return
            self._status = LifecycleStatus.STARTING
            try:
                self.database = Database(
                    self._hass.config.path("gewitterradar", "monitored_areas", "monitored_areas.sqlite3"),
                    config_root=self._hass.config.config_dir,
                )
                await self.database.async_start()
                self._unsubscribe = self._hass.bus.async_listen_once(
                    "homeassistant_stop", self._async_shutdown)
                self._status = LifecycleStatus.READY
            except BaseException:
                try:
                    if self.database is not None:
                        await self.database.async_stop()
                finally:
                    self.database = None
                    self._status = LifecycleStatus.ERROR
                raise

    async def _async_shutdown(self, event) -> None:
        self._unsubscribe = None
        await self.async_stop()

    async def async_stop(self) -> None:
        async with self._lock:
            if self._status is LifecycleStatus.STOPPED:
                return
            self._status = LifecycleStatus.STOPPING
            try:
                if self._unsubscribe is not None:
                    self._unsubscribe()
                    self._unsubscribe = None
                if self.database is not None:
                    await self.database.async_stop()
            finally:
                self.database = None
                self._status = LifecycleStatus.STOPPED
