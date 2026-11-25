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
                    from .finalization import SOURCE_ENTITY

                    def source_exists():
                        # Never choose the first of several similarly named lists.
                        # Only the exact Local To-do list may be touched.
                        state = self._hass.states.get(SOURCE_ENTITY)
                        if state is None:
                            return False
                        if state.state in ("unknown", "unavailable"):
                            raise MigrationSourceError("migration_source_unavailable")
                        from homeassistant.helpers import entity_registry as er
                        record = er.async_get(self._hass).async_get(SOURCE_ENTITY)
                        if record is None or record.platform != "local_todo":
                            raise MigrationSourceError("migration_source_unverified")
                        return True

                    async def fetch_legacy_items():
                        if not source_exists():
                            raise MigrationSourceError("migration_source_missing")
                        result = await self._hass.services.async_call(
                            "todo", "get_items", {"status": ["needs_action", "completed"]},
                            target={"entity_id": SOURCE_ENTITY}, blocking=True,
                            return_response=True)
                        if not isinstance(result, dict) or set(result) != {SOURCE_ENTITY}:
                            raise MigrationSourceError("migration_source_invalid")
                        entry = result[SOURCE_ENTITY]
                        if not isinstance(entry, dict) or not isinstance(entry.get("items"), list):
                            raise MigrationSourceError("migration_source_invalid")
                        return entry["items"]

                    async def remove_legacy_item(uid):
                        # Delete one verified UID at a time; never delete the list
                        # entity or modify Home Assistant's private storage.
                        if not source_exists():
                            raise MigrationSourceError("migration_source_missing")
                        await self._hass.services.async_call(
                            "todo", "remove_item", {"item": uid},
                            target={"entity_id": SOURCE_ENTITY}, blocking=True)

                    self.api = Api(self.database, vault, target_user_active=target_active,
                                   fetch_legacy_items=fetch_legacy_items,
                                   remove_legacy_item=remove_legacy_item)
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
