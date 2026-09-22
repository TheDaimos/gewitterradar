"""V4.10.02 modular frontend contracts."""
import json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];FRONTEND=ROOT/"frontend";CONTRACT=json.loads((ROOT/"tests/contracts/frontend-dev-v4.10.02.json").read_text())
def test_declared_modules_exist_in_all_delivery_trees():
 for name in CONTRACT["moduleFiles"]:
  payload=(FRONTEND/name).read_bytes()
  assert (ROOT/"custom_components"/"gewitterradar"/"frontend"/name).read_bytes()==payload
  assert (ROOT/"dashboard"/"dist"/name).read_bytes()==payload
def test_modules_carry_own_versions():
 for name in CONTRACT["moduleFiles"]:
  text=(FRONTEND/name).read_text(encoding="utf-8")
  assert re.search(r'["\']?version["\']?\s*:\s*["\']\d+\.\d+\.\d+["\']',text)
def test_main_is_loader_not_monolithic_class():
 main=(FRONTEND/"gewitterradar.js").read_text(encoding="utf-8")
 assert "class GewitterradarCard extends HTMLElement {}" in main
 assert "installSkeleton(GewitterradarCard,__moduleDeps);" in main
 assert len(main.encode("utf-8"))<100_000

def test_module_version_view_is_part_of_the_contract():
 assert "modules/diagnostics/module-view.js" in CONTRACT["moduleFiles"]
 text=(FRONTEND/"modules/diagnostics/module-view.js").read_text(encoding="utf-8")
 assert "Module & Versionen" in text
 assert "moduleDiagnostics(EXPECTED_MODULES)" in text
 assert "moduleRegistrySnapshot(EXPECTED_MODULES)" in text

def test_core_context_is_extracted_from_loader():
 assert "modules/core/base-context.js" in CONTRACT["moduleFiles"]
 main=(FRONTEND/"gewitterradar.js").read_text(encoding="utf-8")
 core=(FRONTEND/"modules/core/base-context.js").read_text(encoding="utf-8")
 assert "createBaseContext(import.meta.url)" in main
 assert "BEGIN GEWITTERRADAR LEGACY CORE" in core
 assert "new URL('./assets/" in core
