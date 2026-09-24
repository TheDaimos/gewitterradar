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
 picker_data_modules={
  "modules/fullscreen/compass-picker-chevron-left-brass.js",
  "modules/fullscreen/compass-picker-chevron-right-brass.js",
  "modules/fullscreen/compass-picker-chevron-left-silver.js",
  "modules/fullscreen/compass-picker-chevron-right-silver.js",
 }
 for name in CONTRACT["moduleFiles"]:
  text=(FRONTEND/name).read_text(encoding="utf-8")
  if name in picker_data_modules:
   assert text.startswith('export default "data:image/webp;base64,')
   continue
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

def test_radius_cascade_uses_persisted_state_before_dependent_write():
 controls=(FRONTEND/"modules/ui/controls.js").read_text(encoding="utf-8")
 radii=(FRONTEND/"modules/location/radii-map.js").read_text(encoding="utf-8")
 assert "const storedDanger = finiteNumber(this._hass?.states?.[this._dangerEntity()]?.state) ?? dangerValue;" in controls
 assert "if (storedDanger != null && storedDanger > value)" in controls
 assert "const currentDanger = dangerStateValue ?? danger;" in radii
 assert "if (currentDanger != null && currentDanger > next)" in radii

def test_fullscreen_cluster_jump_pill_contract():
 source="\n".join(path.read_text(encoding="utf-8") for path in sorted(FRONTEND.rglob("*.js")))
 for marker in (
  "map-cluster-jump-toggle",
  "map-cluster-jump-overlay",
  "map-cluster-jump-toggle-icon",
  "GEWITTERRADAR_INFINITY_GFX",
  "gewitterradar:v41002:map-cluster-jump-visible",
  "gewitterradar:v41002:map-cluster-jump-position",
  "_syncFullscreenClusterJumpUi",
  "_activateFullscreenClusterJump",
  "_persistMapClusterJumpPosition",
  "bindMapInstrumentDrag(clusterJumpOverlay,'clusterJump')",
 ): assert marker in source


def test_runtime_revision_and_module_set_probe_contract():
 main=(FRONTEND/"gewitterradar.js").read_text(encoding="utf-8")
 manifest=(FRONTEND/"module-manifest.js").read_text(encoding="utf-8")
 view=(FRONTEND/"modules/diagnostics/module-view.js").read_text(encoding="utf-8")
 runtime=json.loads((FRONTEND/"assets"/"gewitterradar-runtime-manifest.json").read_text(encoding="utf-8"))
 assert "GEWITTERRADAR_MODULE_CACHE = '41002r2'" in main
 assert '`${path}?v=${GEWITTERRADAR_MODULE_CACHE}`' in main
 assert 'runtimeRevision:"41002r2"' in manifest
 assert 'moduleSetId:"A6C8-9983"' in manifest
 assert runtime["runtimeRevision"]=="41002r2"
 assert runtime["moduleSetId"]=="A6C8-9983"
 assert "moduleRuntimeManifestUrl" in view
 assert 'cache:"no-store"' in view
 assert "_refreshModuleRuntimeProbe(result)" in view
