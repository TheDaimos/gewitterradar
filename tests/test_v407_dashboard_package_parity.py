"""Regression guards for the corrected V4.07 Dashboard package."""

from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
CANONICAL = ROOT / "home-assistant" / "app_gewitterradar_v4_07_pkg.yaml"
DERIVED = ROOT / "dashboard" / "dist" / "app_gewitterradar_v4_07_pkg.yaml"

LEGACY_MIGRATION_MARKERS = (
    "input_boolean.blitzortung_warnanimation",
    "input_boolean.blitzortung_gewittersimulation",
    "input_boolean.blitzortung_standortwahl_hauptansicht",
    "input_boolean.blitzortung_kompass_nachster_treffer",
    "input_boolean.blitzortung_kompass_geraeteausrichtung",
    "input_boolean.blitzortung_karte_gruppierung",
)


def test_v407_dashboard_package_is_byte_identical_to_canonical_source() -> None:
    """The derived staging copy must be the exact canonical package bytes."""
    assert CANONICAL.read_bytes() == DERIVED.read_bytes()


def test_v407_dashboard_package_preserves_v406_migrations_and_tracker() -> None:
    """Prevent the regression that removed legacy migrations from the first V4.07 draft."""
    text = CANONICAL.read_text(encoding="utf-8")
    for marker in LEGACY_MIGRATION_MARKERS:
        assert marker in text

    assert "device_tracker.gewitterradar_dashboard" in text
    assert "gewitterradar_set_reference_coordinates_dashboard" in text
    assert "device_tracker.see" not in text

    parsed = yaml.safe_load(text)
    assert isinstance(parsed, dict)
    assert "template" in parsed
    assert "script" in parsed
    assert "automation" in parsed
