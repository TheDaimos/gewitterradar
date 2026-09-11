"""V4.06 dashboard-package release contract."""

from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[1]
PACKAGE_NAME = "app_gewitterradar_v4_06_pkg.yaml"
LANGUAGES = [
    "Deutsch", "English", "Dansk", "Español", "Français", "Nederlands",
    "Polski", "Português", "Svenska", "Italiano", "Norsk bokmål", "Suomi",
    "Čeština", "Ελληνικά", "Magyar", "Boarisch", "Plattdüütsch", "Sächs’sch",
    "Schwäbisch",
]


def test_v406_package_is_unique_complete_and_identical() -> None:
    source = ROOT / "home-assistant" / PACKAGE_NAME
    delivery = ROOT / "dashboard" / "dist" / PACKAGE_NAME
    assert source.is_file() and delivery.is_file()
    assert not (ROOT / "home-assistant" / "app_gewitterradar_pkg.yaml").exists()
    assert not (ROOT / "dashboard" / "dist" / "app_gewitterradar_pkg.yaml").exists()
    assert source.read_bytes() == delivery.read_bytes()

    text = source.read_text(encoding="utf-8")
    package = yaml.safe_load(text)
    language = package["input_select"]["lightning_detection_language"]
    marker = package["input_boolean"]["lightning_detection_language_initialized"]
    assert language["options"] == LANGUAGES
    assert "initial" not in marker
    assert "# input_boolean.lightning_detection_language_initialized" in text
    assert "Release baseline: V4.06" in text
    assert "/config/packages/app_gewitterradar_v4_06_pkg.yaml" in text
