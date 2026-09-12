"""Constants for the Gewitterradar integration."""

from typing import Final

from homeassistant.const import Platform

DOMAIN: Final = "gewitterradar"
NAME: Final = "Gewitterradar"
LEGACY_IMPORT_VERSION: Final = 1
CONF_LEGACY_IMPORT_VERSION: Final = "legacy_import_version"

PLATFORMS: Final = (
    Platform.SELECT,
    Platform.NUMBER,
    Platform.SWITCH,
    Platform.DEVICE_TRACKER,
)

CONF_LANGUAGE: Final = "language"
CONF_LANGUAGE_INITIALIZED: Final = "language_initialized"
CONF_DISTANCE_UNIT: Final = "distance_unit"
CONF_COMPASS_DESIGN: Final = "compass_design"
CONF_REFERENCE_LOCATION: Final = "reference_location"
CONF_OBSERVATION_RADIUS: Final = "observation_radius"
CONF_STORM_RADIUS: Final = "storm_radius"
CONF_DANGER_RADIUS: Final = "danger_radius"
CONF_AURA_WIDTH: Final = "aura_width"
CONF_AURA_INTENSITY: Final = "aura_intensity"
CONF_AURA_EFFECTS: Final = "aura_effects"
CONF_WARNING_ANIMATION: Final = "warning_animation"
CONF_STORM_SIMULATION: Final = "storm_simulation"
CONF_SHOW_LOCATION_SELECTOR: Final = "show_location_selector"
CONF_COMPASS_NEAREST_STRIKE: Final = "compass_nearest_strike"
CONF_COMPASS_DEVICE_ORIENTATION: Final = "compass_device_orientation"
CONF_MAP_GROUPING: Final = "map_grouping"

# V4.07 dynamic reference tracker. Coordinates are product-owned ConfigEntry data,
# deliberately separate from ConfigEntry options and from the user's saved places.
CONF_TRACKER_LATITUDE: Final = "tracker_latitude"
CONF_TRACKER_LONGITUDE: Final = "tracker_longitude"
CONF_TRACKER_NAME: Final = "tracker_name"
DEFAULT_TRACKER_NAME: Final = "Gewitterradar"
SERVICE_SET_REFERENCE_COORDINATES: Final = "set_reference_coordinates"
SERVICE_FIELD_LATITUDE: Final = "latitude"
SERVICE_FIELD_LONGITUDE: Final = "longitude"
SERVICE_FIELD_NAME: Final = "name"
SIGNAL_REFERENCE_COORDINATES_UPDATED: Final = f"{DOMAIN}_reference_coordinates_updated"

# Blitzortung is inspected read-only. Gewitterradar never mutates another
# integration's ConfigEntry or Home Assistant's .storage data.
BLITZORTUNG_DOMAIN: Final = "blitzortung"
BLITZORTUNG_LOCATION_ENTITY_KEY: Final = "location_entity"

LANGUAGE_OPTIONS: Final = (
    "Deutsch",
    "English",
    "Dansk",
    "Español",
    "Français",
    "Nederlands",
    "Polski",
    "Português",
    "Svenska",
    "Italiano",
    "Norsk bokmål",
    "Suomi",
    "Čeština",
    "Ελληνικά",
    "Magyar",
    "Boarisch",
    "Plattdüütsch",
    "Sächs’sch",
    "Schwäbisch",
)
DISTANCE_UNIT_OPTIONS: Final = ("KM", "MI")
COMPASS_DESIGN_OPTIONS: Final = ("Compass A", "Compass B", "Compass C")
DEFAULT_REFERENCE_LOCATION: Final = "zone.home"

# Valid native reference domains. Discovery intentionally remains restricted to
# people/zones; only the Gewitterradar-owned device_tracker is added explicitly.
LOCATION_DOMAINS: Final = ("person", "zone", "device_tracker")
LOCATION_DISCOVERY_DOMAINS: Final = ("person", "zone")

DEFAULT_OPTIONS: Final = {
    CONF_LANGUAGE_INITIALIZED: False,
    CONF_LANGUAGE: "English",
    CONF_DISTANCE_UNIT: "KM",
    CONF_COMPASS_DESIGN: "Compass C",
    CONF_REFERENCE_LOCATION: DEFAULT_REFERENCE_LOCATION,
    CONF_OBSERVATION_RADIUS: 200,
    CONF_STORM_RADIUS: 80,
    CONF_DANGER_RADIUS: 10,
    CONF_AURA_WIDTH: 40,
    CONF_AURA_INTENSITY: 55,
    CONF_AURA_EFFECTS: True,
    CONF_WARNING_ANIMATION: True,
    CONF_STORM_SIMULATION: False,
    CONF_SHOW_LOCATION_SELECTOR: False,
    CONF_COMPASS_NEAREST_STRIKE: False,
    CONF_COMPASS_DEVICE_ORIENTATION: False,
    CONF_MAP_GROUPING: True,
}

NUMBER_LIMITS: Final = {
    CONF_OBSERVATION_RADIUS: (10.0, 1000.0, "km"),
    CONF_STORM_RADIUS: (5.0, 1000.0, "km"),
    CONF_DANGER_RADIUS: (1.0, 250.0, "km"),
    CONF_AURA_WIDTH: (15.0, 60.0, "%"),
    CONF_AURA_INTENSITY: (0.0, 70.0, "%"),
}

SWITCH_KEYS: Final = (
    CONF_LANGUAGE_INITIALIZED,
    CONF_AURA_EFFECTS,
    CONF_WARNING_ANIMATION,
    CONF_STORM_SIMULATION,
    CONF_SHOW_LOCATION_SELECTOR,
    CONF_COMPASS_NEAREST_STRIKE,
    CONF_COMPASS_DEVICE_ORIENTATION,
    CONF_MAP_GROUPING,
)

LEGACY_ENTITIES: Final = {
    CONF_LANGUAGE: "input_select.lightning_detection_language",
    CONF_DISTANCE_UNIT: "input_select.lightning_detection_distance_unit",
    CONF_COMPASS_DESIGN: "input_select.lightning_detection_compass_design",
    CONF_REFERENCE_LOCATION: "input_select.lightning_detection_location",
    CONF_OBSERVATION_RADIUS: "input_number.lightning_detection_observation_radius",
    CONF_STORM_RADIUS: "input_number.lightning_detection_storm_radius",
    CONF_DANGER_RADIUS: "input_number.lightning_detection_danger_radius",
    CONF_AURA_WIDTH: "input_number.lightning_detection_aura_width",
    CONF_AURA_INTENSITY: "input_number.lightning_detection_aura_intensity",
    CONF_AURA_EFFECTS: "input_boolean.lightning_detection_aura_effects",
    CONF_WARNING_ANIMATION: "input_boolean.lightning_detection_warning_animation",
    CONF_STORM_SIMULATION: "input_boolean.lightning_detection_storm_simulation",
    CONF_SHOW_LOCATION_SELECTOR: "input_boolean.lightning_detection_show_location_selector",
    CONF_COMPASS_NEAREST_STRIKE: "input_boolean.lightning_detection_compass_nearest_strike",
    CONF_COMPASS_DEVICE_ORIENTATION: "input_boolean.lightning_detection_compass_device_orientation",
    CONF_MAP_GROUPING: "input_boolean.lightning_detection_map_grouping",
}
