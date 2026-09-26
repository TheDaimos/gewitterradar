"""V0.21 HACS Integration packaging contract."""
import json,importlib.util
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SPEC=importlib.util.spec_from_file_location("verify_hacs_integration_package",ROOT/"scripts"/"verify-hacs-integration-package.py");assert SPEC and SPEC.loader
PACKAGING=importlib.util.module_from_spec(SPEC);SPEC.loader.exec_module(PACKAGING)
def test_hacs_manifest_describes_standard_integration_repository():
 assert json.loads((ROOT/"hacs.json").read_text(encoding="utf-8"))=={"name":"Gewitterradar Integration","homeassistant":"2026.9.0"}
def test_standard_hacs_staging_is_complete_and_byte_identical(tmp_path):
 hashes=PACKAGING.verify(tmp_path);assert set(hashes)==PACKAGING.REQUIRED
 assert (tmp_path/"custom_components"/"gewitterradar"/"frontend"/"gewitterradar.js").is_file()
 assert (tmp_path/"custom_components"/"gewitterradar"/"frontend"/"module-manifest.js").is_file()
 expected=sum(1 for path in (ROOT/"frontend").rglob("*") if path.is_file() and path.name!="assets.json")
 assert len([name for name in hashes if name.startswith("frontend/")])==expected
def test_repository_contains_exactly_one_custom_integration():
 assert sorted(path.name for path in (ROOT/"custom_components").iterdir() if path.is_dir() and not path.name.startswith("__"))==["gewitterradar"]
