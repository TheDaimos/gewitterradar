"""Inert entry-owned runtime; no resources are acquired in MA-003."""

from .contracts import LifecycleStatus


class MonitoredAreasRuntime:
    """Lifecycle only. READY means the skeleton has started."""

    def __init__(self) -> None:
        self._status = LifecycleStatus.STOPPED

    @property
    def status(self) -> LifecycleStatus:
        return self._status

    async def async_start(self) -> None:
        """Idempotent, non-suspending transition on the HA event loop."""
        if self._status is LifecycleStatus.READY:
            return
        self._status = LifecycleStatus.STARTING
        self._status = LifecycleStatus.READY

    async def async_stop(self) -> None:
        """Idempotent, non-suspending transition; no resources to release."""
        if self._status is LifecycleStatus.STOPPED:
            return
        self._status = LifecycleStatus.STOPPING
        self._status = LifecycleStatus.STOPPED
