"""Static contract tests for the V0.12 integration skeleton."""

import ast
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "gewitterradar"


def test_manifest_is_valid_and_single_entry() -> None:
    """Validate manifest JSON and its minimal integration contract."""
    manifest = json.loads((INTEGRATION / "manifest.json").read_text(encoding="utf-8"))

    assert manifest["domain"] == "gewitterradar"
    assert manifest["version"] == "0.17.0"
    assert manifest["config_flow"] is True
    assert manifest["single_config_entry"] is True
    # Gewitterradar is a user-visible service integration, not a Helper-tab
    # entity factory. The Integrations dashboard filters helpers out.
    assert manifest["integration_type"] == "service"
    assert manifest["after_dependencies"] == [
        "input_boolean",
        "input_number",
        "input_select",
    ]
    assert manifest["requirements"] == []


def test_python_sources_parse() -> None:
    """Parse all integration Python modules without importing Home Assistant."""
    for path in INTEGRATION.glob("*.py"):
        ast.parse(path.read_text(encoding="utf-8"), filename=str(path))


def test_translation_files_are_valid_and_complete() -> None:
    """Validate English source strings and both shipped translations."""
    strings = json.loads((INTEGRATION / "strings.json").read_text(encoding="utf-8"))
    english = json.loads(
        (INTEGRATION / "translations" / "en.json").read_text(encoding="utf-8")
    )
    german = json.loads(
        (INTEGRATION / "translations" / "de.json").read_text(encoding="utf-8")
    )

    assert strings == english
    for translations in (english, german):
        assert translations["title"] == "Gewitterradar"
        assert "user" in translations["config"]["step"]
        assert "single_instance_allowed" in translations["config"]["abort"]


def test_exact_v0_14_entity_platforms_exist() -> None:
    """Validate the three platforms used by the V0.14 settings model."""
    for platform in ("number.py", "select.py", "switch.py"):
        assert (INTEGRATION / platform).is_file()
