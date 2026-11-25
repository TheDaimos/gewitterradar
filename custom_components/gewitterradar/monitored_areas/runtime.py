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
        self.api = None
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
                # API remains unavailable unless the private Vault ownership port
                # is registered. No fallback to browser-supplied profile IDs.
                vault = getattr(self._hass, "data", {}).get("gewitterradar_settings_vault")
                checker = getattr(vault, "async_profile_belongs_to", None)
                if callable(checker):
                    from .api import Api

                    async def target_active(user_id):
                        user = await self._hass.auth.async_get_user(user_id)
                        return bool(user is not None and user.is_active)

                    from .migration import MigrationSourceError

                    async def fetch_legacy_items():
                        # Home Assistant's supported To-do service is the sole
                        # legacy source. Never open HA .storage files directly.
                        states = getattr(self._hass, "states", None)
                        candidates = ("todo.gewitterradar_orte",
                                      "todo.gewitterradar_saved_places",
                                      "todo.gewitterradar")
                        available = [eid for eid in candidates if states is not None and states.get(eid)]
                        if not available:
                            raise MigrationSourceError("migration_source_missing")
                        entity_id = available[0]
                        result = await self._hass.services.async_call(
                            "todo", "get_items", {"status":["needs_action","completed"]},
                            target={"entity_id":entity_id}, blocking=True,
                            return_response=True)
                        if not isinstance(result, dict):
                            raise MigrationSourceError("migration_source_invalid")
                        entry = result.get(entity_id)
                        if not isinstance(entry,dict) or not isinstance(entry.get("items"),list):
                            raise MigrationSourceError("migration_source_invalid")
                        return entry["items"]

                    self.api = Api(self.database, vault, target_user_active=target_active,
                                   fetch_legacy_items=fetch_legacy_items)
                self._unsubscribe = self._hass.bus.async_listen_once(
                    "homeassistant_stop", self._async_shutdown)
                self._status = LifecycleStatus.READY
            except BaseException:
                try:
                    if self.database is not None:
                        await self.database.async_stop()
                finally:
                    self.database = None
                    self.api = None
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
                self.api = None
                self._status = LifecycleStatus.STOPPED
