"""V0.19 HACS Integration packaging contract."""

import json
import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location(
    "verify_hacs_integration_package",
    ROOT / "scripts" / "verify-hacs-integration-package.py",
)
assert SPEC and SPEC.loader
PACKAGING = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(PACKAGING)


def test_hacs_manifest_describes_standard_integration_repository() -> None:
    hacs = json.loads((ROOT / "hacs.json").read_text(encoding="utf-8"))
    assert hacs == {
        "name": "Gewitterradar Integration",
        "homeassistant": "2026.9.0",
    }
    assert "filename" not in hacs
    assert "zip_release" not in hacs
    assert "content_in_root" not in hacs


def test_standard_hacs_staging_is_complete_and_byte_identical(tmp_path: Path) -> None:
    hashes = PACKAGING.verify(tmp_path)
    assert set(hashes) == PACKAGING.REQUIRED
    assert (tmp_path / "custom_components" / "gewitterradar" / "frontend" / "gewitterradar.js").is_file()
    assert (tmp_path / "custom_components" / "gewitterradar" / "frontend" / "locales" / "about-locales.js").is_file()
    assert len([name for name in hashes if name.startswith("frontend/")]) == 19


def test_repository_contains_exactly_one_custom_integration() -> None:
    integrations = sorted(
        path.name
        for path in (ROOT / "custom_components").iterdir()
        if path.is_dir() and not path.name.startswith("__")
    )
    assert integrations == ["gewitterradar"]
