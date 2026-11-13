"""Validation for the profile-owned GR presentation settings in schema 1."""

import hashlib
import json
import re

SCHEMA = 1
MAX_SETTINGS_BYTES = 192 * 1024
MAX_EXPORT_BYTES = 2 * 1024 * 1024
BLOCKED_KEYS = {"__proto__", "prototype", "constructor"}
ID_PATTERN = re.compile(r"[a-zA-Z0-9:_-]{1,80}")


class VaultError(Exception):
    """An error safe to return to the authenticated client."""

    def __init__(self, code, message):
        super().__init__(message)
        self.code = code


def invalid(message="Invalid settings payload"):
    raise VaultError("invalid_settings", message)


def canonical(value):
    try:
        return json.dumps(
            value, sort_keys=True, ensure_ascii=True, separators=(",", ":"), allow_nan=False
        ).encode("ascii")
    except (ValueError, TypeError, RecursionError, OverflowError):
        invalid()


def digest(value):
    return hashlib.sha256(canonical(value)).hexdigest()


def same(left, right):
    # JS serializes 1.0 as 1. A boolean and a number still differ.
    if type(left) in (int, float) and type(right) in (int, float):
        return left == right
    if type(left) is not type(right):
        return False
    if isinstance(left, dict):
        return left.keys() == right.keys() and all(same(left[key], right[key]) for key in left)
    if isinstance(left, list):
        return len(left) == len(right) and all(same(a, b) for a, b in zip(left, right))
    return left == right


def number(low, high):
    return lambda value: type(value) in (int, float) and low <= value <= high


def choice(*choices):
    return lambda value: any(type(value) is type(item) and value == item for item in choices)


def identifier(value):
    return isinstance(value, str) and ID_PATTERN.fullmatch(value) is not None and value not in BLOCKED_KEYS


def name(value):
    if (
        not isinstance(value, str) or not 1 <= len(value.strip()) <= 64
        or re.search(r"[<>\x00-\x1f\x7f\u202a-\u202e\u2066-\u2069]", value)
        or value.strip()[0] in "=+-@"
    ):
        invalid("Invalid profile name")
    return value.strip()


def valid_name(value):
    name(value)
    return True


def fields(schema, required=()):
    def validate(value):
        return (type(value) is dict and set(required) <= value.keys()
                and all(key in schema and schema[key](item) for key, item in value.items()))
    validate.members = schema
    return validate


def mapping(check, limit):
    def validate(value):
        return (type(value) is dict and len(value) <= limit
                and all(identifier(key) and check(item) for key, item in value.items()))
    validate.entries = (check, limit)
    return validate


def sequence(check, maximum, minimum=0):
    return lambda value: (
        type(value) is list and minimum <= len(value) <= maximum and all(map(check, value))
    )


def nullable(check):
    return lambda value: value is None or check(value)


BOOL = lambda value: type(value) is bool
POSITION = fields({"x": number(0, 1), "y": number(0, 1)}, ("x", "y"))
PERCENT = number(0, 100)
VISIBLE = choice("fullscreen", "all", "nonfullscreen", "hidden")
FLOW = choice("classic", "curved_arrows", "curved_lines")
TEMPO = choice("slow", "normal", "fast")
DENSITY = choice("low", "normal", "high")
LEGEND = fields({
    "view": choice("classes", "bar"), "rain": BOOL, "snow": BOOL,
    "minimized": BOOL, "explanation": BOOL,
})
SNAKE_FIELDS = {
    "minLength": number(8, 24), "maxLength": number(30, 120), "lengthScale": number(.25, 3),
    "headSize": number(1, 2), "bodyWidth": number(1, 5), "taper": number(.6, 2.5),
    "tailStart": number(.5, .8), "opacity": number(10, 100), "density": number(.35, 5),
    "speed": number(.25, 2.5), "response": number(.15, 3),
}
SNAKE = fields(SNAKE_FIELDS)
FULL_SNAKE = fields(SNAKE_FIELDS, SNAKE_FIELDS)
EYE_FUNCTIONS = ("wind", "temperature", "precipitation", "weather-display", "synoptic")
EYE_FUNCTION = choice(*EYE_FUNCTIONS)
EYE_SLOT = fields({"id": identifier, "functionId": nullable(EYE_FUNCTION)}, ("functionId",))
HEX = lambda value: isinstance(value, str) and re.fullmatch(r"#[0-9a-fA-F]{6}", value) is not None
EYE = fields({
    "schema": choice(1), "grouped": BOOL, "aura": BOOL, "glow": choice("living", "static"),
    "size": number(36, 126), "iconSize": number(25, 300),
    **dict.fromkeys(("intensity", "brightness", "backdrop", "neonBrilliance", "neonBloom",
                     "neonOrganics", "backdropExtent"), PERCENT),
    "eyeAuraGap": number(0, 30), "auraRingGap": number(0, 8),
    "energyAccents": choice("off", "subtle", "normal", "strong"),
    "slots": sequence(lambda value: EYE_FUNCTION(value) or EYE_SLOT(value), 12),
    "colors": fields(dict.fromkeys(EYE_FUNCTIONS, HEX)),
})
SYNOPTIC = fields({
    **dict.fromkeys(("visible", "centers", "isobars", "pressureLabels", "glow",
                     "fronts", "frontNeon", "frontSymbols"), BOOL),
    **dict.fromkeys(("highColor", "lowColor", "isobarColor"), HEX),
    "highSize": number(14, 60), "lowSize": number(14, 60),
    "lineWidth": number(.5, 6), "labelDensity": PERCENT,
    **dict.fromkeys(("opacity", "centerOpacity", "isobarOpacity",
                     "frontLineOpacity", "frontSymbolOpacity", "neonOpacity"), number(0, 1)),
    "frontColors": fields(dict.fromkeys(("cold", "warm", "occluded", "stationaryCold", "stationaryWarm"), HEX)),
    "quickPositions": mapping(POSITION, 24),
})
WIND_COLOR = choice("black", "white", "gold", "turquoise", "violet", "magenta", "blue", "green")
WIND = fields({
    "schema": choice(1, 2), "snake": SNAKE,
    **dict.fromkeys(("visible", "enabled", "snakeAnimationExplicit", "barbsVisible", "paused",
                     "animationExplicit", "colorField", "performanceDiagnostics"), BOOL),
    "mode": choice("barbs", "arrows", "animated", "snake"), "flowForm": FLOW,
    "flowLength": number(50, 150), **dict.fromkeys(("color", "highColor", "lowColor"), WIND_COLOR),
    "colorMode": choice("uniform", "pressure"), "tempo": TEMPO, "density": DENSITY,
    "unit": choice("km/h", "kn", "Bft"), "fieldOpacity": PERCENT,
    "quickVisibility": VISIBLE, "quickPositions": mapping(POSITION, 16),
    "legendPosition": nullable(POSITION), "legendUi": LEGEND,
})
TEMPERATURE_FIELDS = {
    "schema": choice(1),
    **dict.fromkeys(("visible", "surface", "labels", "advection", "labelBackground", "paused",
                     "temperatureLegend", "advectionLegend", "inspector"), BOOL),
    "flowForm": FLOW, "flowLength": number(50, 150), "opacity": PERCENT,
    "scheme": choice("premium", "contrast"), "range": choice("auto", "manual"),
    "minC": number(-100, 45), "maxC": number(-50, 80),
    "stops": lambda value: (
        sequence(number(-150, 100), 9, 9)(value)
        and all(a < b for a, b in zip(value, value[1:]))
        and value[6] >= 35 and value[7] >= 40 and value[8] >= 45
    ),
    "labelDensity": choice("low", "normal", "high", "auto"), "fontSize": number(10, 24),
    "unit": choice("C", "F", "K"), "quality": choice("balanced", "fine"),
    "contrast": number(.7, 1.3), "tempo": TEMPO, "density": DENSITY, "arrowSize": number(8, 28),
    "arrowOpacity": PERCENT, "advectionStrength": number(.25, 4),
    "transport": choice("both", "cold", "warm"), "threshold": number(0, 10),
    "quickVisibility": VISIBLE, "quickPositions": mapping(POSITION, 20),
    "legendPositions": mapping(POSITION, 20),
    "legendUi": fields({"temperature": LEGEND, "advection": LEGEND}),
}
TEMPERATURE = fields(TEMPERATURE_FIELDS)
USER_PRESET_ID = lambda value: (
    isinstance(value, str) and re.fullmatch(r"user:[a-z0-9-]{1,80}", value) is not None
)
PRESET = fields(
    {"id": USER_PRESET_ID, "name": valid_name, "parameters": FULL_SNAKE},
    ("id", "name", "parameters"),
)
STUDIO = fields({
    "schemaVersion": choice(1), "name": valid_name, "draft": FULL_SNAKE,
    "selected": nullable(lambda value: USER_PRESET_ID(value) or value in (
        "builtin:default", "builtin:subtle", "builtin:rotation"
    )),
    "users": sequence(PRESET, 32),
}, ("schemaVersion", "users"))
DISPLAY = fields({
    **dict.fromkeys(("enabled", "controlVisible", "minimized", "rememberPosition"), BOOL),
    "legendMode": choice("auto", "on", "off"), "position": POSITION, "eyePosition": POSITION,
    "displayControlPosition": nullable(POSITION),
    "styles": fields({"precipitation": choice("auto", "precise", "balanced", "soft"),
                      "clouds": choice("original", "balanced")}),
    "quickLayer": choice("precipitation", "clouds", "wind", "temperature"),
    "opacities": fields(dict.fromkeys(("precipitation", "clouds", "windSymbols"), nullable(number(0, 1)))),
    "precipitationControl": fields({
        "schema": choice(1), "quickVisibility": VISIBLE, "quickPositions": mapping(POSITION, 24),
    }),
})
PREMIUM = fields({"sections": mapping(BOOL, 128), "minimized": BOOL, "panelPosition": POSITION})
ISO_DATE = nullable(lambda value: isinstance(value, str) and re.fullmatch(r"[0-9T:.Z+-]{20,40}", value))
BUILD_LABEL = lambda value: isinstance(value, str) and re.fullmatch(r"V[0-9A-Za-z.-]{1,48}", value)


def calibration(schema, version, entries):
    return fields({
        "schema": choice(schema), "version": choice(version), "build": BUILD_LABEL,
        "updatedAt": ISO_DATE, "entries": mapping(fields(entries), 512),
    }, ("schema", "version", "entries"))


def numeric_string(low, high):
    def validate(value):
        try:
            return isinstance(value, str) and len(value) <= 32 and low <= float(value) <= high
        except ValueError:
            return False
    return validate


CORE = "gewitterradar:v41002:"
MAP = "gewitterradar:v409:"
RADAR = "gewitterradar:weather-engine:"
PREMIUM_PREFIX = "gewitterradar:premium-ui:v1:"
STUDIO_KEY = "gewitterradar:wind-studio:v1"
TEMPERATURE_KEY = "gewitterradar:temperature-ui:v1"
TIMEOUT = numeric_string(5000, 3600000)
MAP_MODE = choice("standard", "large", "fullscreen")
BIT = choice("0", "1")
MAP_VISIBILITY = choice("0", "1", "false", "true")
JSON_SETTINGS = {
    "gewitterradar:eye-bubble:v1": EYE,
    "gewitterradar:synoptic-ui:v1": SYNOPTIC,
    "gewitterradar:wind-ui:v1": WIND,
    STUDIO_KEY: STUDIO,
    TEMPERATURE_KEY: TEMPERATURE,
    "gewitterradar:weather-display:v1": DISPLAY,
    "gewitterradar:weather-legend-ui:v1": LEGEND,
    "gewitterradar:weather-legend-position:v1": POSITION,
    **dict.fromkeys((MAP + "map-compass-position", MAP + "map-medallion-position",
                     MAP + "map-location-position", CORE + "map-cluster-jump-position",
                     RADAR + "timeline-position"), POSITION),
    **{PREMIUM_PREFIX + scope: PREMIUM for scope in (
        "eye-hub", "wind-settings", "temperature-settings", "precipitation-control",
        "weather-wind-legend-", "weather-temperature-legend-", "weather-advection-legend-",
    )},
    "gewitterradar:v40802:diagnostic-sections": mapping(BOOL, 128),
    "gewitterradar-diagnostic-position": fields(
        {"left": number(-30000, 30000), "top": number(0, 30000)}, ("left", "top")
    ),
    CORE + "medallion-eye-calibration-v1": calibration("gewitterradar.medallion-eye-calibration.v1", 1, {
        **dict.fromkeys(("centerXPercent", "centerYPercent", "autoCenterXPercent", "autoCenterYPercent",
                         "radiusPercent", "autoRadiusPercent"), nullable(PERCENT)),
        "reviewed": BOOL, "updatedAt": ISO_DATE,
    }),
    CORE + "medallion-arrow-visual-calibration-v2": calibration(
        "gewitterradar.medallion-arrow-visual-calibration.v2", 2, {
            **dict.fromkeys(("manualCenterXPercent", "manualCenterYPercent", "autoCenterXPercent",
                             "autoCenterYPercent", "effectiveCenterXPercent", "effectiveCenterYPercent"),
                            nullable(PERCENT)),
            **dict.fromkeys(("manualScale", "autoScale", "effectiveScale"), nullable(number(.35, 1.10))),
            "reviewed": BOOL, "updatedAt": ISO_DATE, "eyeReferenceChangedAt": ISO_DATE,
        }
    ),
}
SCALAR_SETTINGS = {
    "gewitterradar-diagnostic-columns": choice("1", "2"),
    **dict.fromkeys((CORE + "fullscreen-compass-scale", CORE + "fullscreen-medallion-scale"),
                    numeric_string(.15, 3)),
    CORE + "trend-arrow-design": identifier,
    CORE + "medallion-design": identifier,
    CORE + "medallion-picker-preview-mode": choice("static", "animation"),
    CORE + "map-cluster-jump-visible": MAP_VISIBILITY,
    "gewitterradar:v40804:cluster-jump-timeout": lambda v: v == "0" or TIMEOUT(v),
    "gewitterradar:v40802:cluster-jump-timeout": lambda v: v == "0" or TIMEOUT(v),
    "gewitterradar:v40804:cluster-jump-finite-timeout": TIMEOUT,
    "gewitterradar:v40822:cluster-resolution-profile": choice("early", "balanced", "late", "classic"),
    "gewitterradar:v40801:cluster-policy": choice("zoned", "classic", "legacy", "normal"),
    "gr-reference-arrival-zoom": choice("auto", *(str(i) for i in range(5, 19))),
    "gr-settings-menu-style": choice("classic", "modern"),
    "gr-horizontal-navigation-speed": choice("Schnell", "Mittel", "Langsam", "Ohne Animation"),
    "gewitterradar-last-compass-design": choice("1", "2", "3", "4", "5", "6"),
    "gewitterradar-about-onboarding-version": numeric_string(0, 1000000),
    MAP + "map-display-mode": MAP_MODE,
    MAP + "last-map-display-mode": MAP_MODE,
    MAP + "startup-map-display": lambda v: v == "last" or MAP_MODE(v),
    MAP + "map-layer-symbol-style": choice("stack3d", "classic", "infinity"),
    MAP + "map-compass-visible": MAP_VISIBILITY,
    MAP + "map-medallion-visible": MAP_VISIBILITY,
    RADAR + "precipitation-enabled": BIT,
    RADAR + "allow-older-satellite-background": BIT,
    RADAR + "precipitation-preload-profile": choice("off", "small", "normal", "large", "custom"),
    RADAR + "precipitation-preload-custom-percent": numeric_string(0, 100),
    RADAR + "viewport-refresh-interval-seconds": numeric_string(2, 60),
    RADAR + "timeline-visible": BIT,
}
SETTINGS_KEYS = sorted(JSON_SETTINGS.keys() | SCALAR_SETTINGS.keys())


def object_pairs(pairs):
    result = {}
    for key, value in pairs:
        if key in result or key in BLOCKED_KEYS:
            invalid()
        result[key] = value
    return result


def read_json(raw, limit=MAX_SETTINGS_BYTES):
    if not isinstance(raw, str) or len(raw) > limit or len(raw.encode("utf-8", "surrogatepass")) > limit:
        invalid("Settings exceed the size limit")
    try:
        return json.loads(raw, object_pairs_hook=object_pairs, parse_constant=lambda _: invalid())
    except (ValueError, RecursionError):
        invalid("Invalid settings JSON")


def validate_value(key, value):
    validator = (JSON_SETTINGS if key in JSON_SETTINGS else SCALAR_SETTINGS).get(key)
    if validator is None or not validator(value):
        invalid(f"Unsupported value for {key}" if validator else "Unknown settings key")
    if key == STUDIO_KEY:
        ids = {preset["id"] for preset in value["users"]}
        names = {preset["name"].strip().lower() for preset in value["users"]}
        if len(ids) != len(value["users"]) or len(names) != len(ids):
            invalid("Duplicate wind preset")
        selected = value.get("selected")
        if USER_PRESET_ID(selected) and selected not in ids:
            invalid("Selected wind preset does not exist")
    if key == TEMPERATURE_KEY and value.get("minC", -40) >= value.get("maxC", 50):
        invalid("Invalid temperature range")


def decode_value(key, raw):
    value = read_json(raw) if key in JSON_SETTINGS else raw
    validate_value(key, value)
    return value


def _accepts(check, value):
    try:
        return check(value)
    except VaultError:
        return False


def _salvage(check, value):
    if _accepts(check, value):
        return value
    if not isinstance(value, dict):
        return None
    members = getattr(check, "members", {})
    for key in {"schema", "schemaVersion"} & value.keys() & members.keys():
        if not members[key](value[key]):
            return None
    if hasattr(check, "entries"):
        entry, limit = check.entries
        members = {key: entry for key in list(value)[:limit] if identifier(key)}
    result = {}
    for key in members.keys() & value.keys():
        item = _salvage(members[key], value[key])
        if item is not None or _accepts(members[key], None):
            if item is not None or value[key] is None:
                result[key] = item
    return result if result and _accepts(check, result) else None


def salvage_legacy(key, raw):
    """Keep valid siblings from damaged registered objects. Legacy raw remains on the device."""
    if key not in JSON_SETTINGS:
        return None
    try:
        value = read_json(raw)
        if key == STUDIO_KEY and isinstance(value, dict) and type(value.get("users")) is list:
            users = []
            for candidate in value["users"][:32]:
                if _accepts(PRESET, candidate) and not any(
                    saved["id"] == candidate["id"] or saved["name"].strip().lower() == candidate["name"].strip().lower()
                    for saved in users
                ):
                    users.append(candidate)
            value["users"] = users
            if USER_PRESET_ID(value.get("selected")) and not any(p["id"] == value["selected"] for p in users):
                value.pop("selected")
        if key == TEMPERATURE_KEY and isinstance(value, dict) and all(
            _accepts(TEMPERATURE_FIELDS[k], value.get(k)) for k in ("minC", "maxC")
        ) and value["minC"] >= value["maxC"]:
            value.pop("minC")
            value.pop("maxC")
        result = _salvage(JSON_SETTINGS[key], value)
        if result is not None:
            validate_value(key, result)
        return result
    except VaultError:
        return None


def encode_value(key, value):
    return canonical(value).decode("ascii") if key in JSON_SETTINGS else value


def validate_settings(values):
    if type(values) is not dict or not values.keys() <= set(SETTINGS_KEYS):
        invalid("Unknown settings key")
    if len(canonical(values)) > MAX_SETTINGS_BYTES:
        invalid("Profile exceeds the size limit")
    for key, value in values.items():
        validate_value(key, value)
    return values
