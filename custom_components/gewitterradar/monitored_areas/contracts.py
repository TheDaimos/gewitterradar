"""Minimal lifecycle contract for MA-003."""

from enum import StrEnum


class LifecycleStatus(StrEnum):
    """Lifecycle state, not evidence of active monitoring."""

    DISABLED = "disabled"
    STARTING = "starting"
    READY = "ready"
    DEGRADED = "degraded"
    STOPPING = "stopping"
    STOPPED = "stopped"
    ERROR = "error"
