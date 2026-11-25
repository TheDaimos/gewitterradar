"""Pure feature configuration for Monitored Areas."""

from collections.abc import Mapping

CONF_MONITORED_AREAS_ENABLED = "monitored_areas_enabled"


def is_enabled(options: Mapping[str, object]) -> bool:
    """Only explicit boolean True enables the optional module."""
    return options.get(CONF_MONITORED_AREAS_ENABLED) is True
