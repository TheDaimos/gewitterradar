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
def test_expected_module_versions_match_self_registration():
 manifest=(FRONTEND/"module-manifest.js").read_text(encoding="utf-8")
 expected=dict(re.findall(r'"id": "([^"]+)",\s*"version": "([^"]+)"',manifest))
 assert len(expected)==22
 picker_data_modules={
  "modules/fullscreen/compass-picker-chevron-left-brass.js",
  "modules/fullscreen/compass-picker-chevron-right-brass.js",
  "modules/fullscreen/compass-picker-chevron-left-silver.js",
  "modules/fullscreen/compass-picker-chevron-right-silver.js",
 }
 actual={}
 for name in CONTRACT["moduleFiles"]:
  if name in picker_data_modules or name=="module-manifest.js":
   continue
  text=(FRONTEND/name).read_text(encoding="utf-8")
  id_match=re.search(r'(?:"id"|id)\s*:\s*"([^"]+)"',text)
  version_match=re.search(r'(?:"version"|version)\s*:\s*"([^"]+)"',text)
  assert id_match and version_match, name
  actual[id_match.group(1)]=version_match.group(1)
 self_match=re.search(r'export const MODULE_META=.*?id:"core\.manifest",version:"([^"]+)"',manifest,re.S)
 assert self_match
 actual["core.manifest"]=self_match.group(1)
 assert actual==expected

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
 assert "GEWITTERRADAR_MODULE_CACHE = '41002r9'" in main
 assert '`${path}?v=${GEWITTERRADAR_MODULE_CACHE}`' in main
 assert 'runtimeRevision:"41002r9"' in manifest
 assert 'moduleSetId:"9EBD-F27E"' in manifest
 assert runtime["runtimeRevision"]=="41002r9"
 assert runtime["moduleSetId"]=="9EBD-F27E"
 expected_core=next(item["version"] for item in runtime["modules"] if item["id"]=="core.manifest")
 expected_manifest=re.search(r'"id": "core\.manifest",[\s\S]*?"version": "([^"]+)"',manifest).group(1)
 self_manifest=re.search(r'id:"core\.manifest",version:"([^"]+)"',manifest).group(1)
 assert expected_manifest==expected_core==self_manifest
 assert "moduleRuntimeManifestUrl" in view
 assert 'cache:"no-store"' in view
 assert "_refreshModuleRuntimeProbe(result)" in view


def test_module_deviation_popup_contract():
 registry=(FRONTEND/"modules/core/registry.js").read_text(encoding="utf-8")
 view=(FRONTEND/"modules/diagnostics/module-view.js").read_text(encoding="utf-8")
 i18n=(FRONTEND/"modules/ui/i18n-settings.js").read_text(encoding="utf-8")
 for marker in (
  "duplicateDetails:Object.freeze(duplicateDetails)",
  "registrations:Object.freeze(registrations)",
  'version:"1.0.1"',
 ):
  assert marker in registry
 for marker in (
  "settings-modules-deviations-backdrop",
  "gr-mod-deviation-trigger",
  "_moduleDeviationIssues(",
  "_renderModuleDeviationDialog(",
  "_openModuleDeviations()",
  "_copyModuleDeviationDiagnostics()",
  "_downloadModuleDeviationDiagnostics()",
  "gewitterradar-module-deviations-",
 ):
  assert marker in view
 for marker in (
  "modules.status.duplicate",
  "modules.deviation.registrations",
  "modules.deviation.active_matches",
 ):
  assert i18n.count(marker)==19

def test_picker_diagnostics_are_design_aware_and_top_layer_local():
 diagnostics=(FRONTEND/"modules/diagnostics/cockpit.js").read_text(encoding="utf-8")
 map_display=(FRONTEND/"modules/fullscreen/map-display.js").read_text(encoding="utf-8")
 base=(FRONTEND/"modules/core/base-context.js").read_text(encoding="utf-8")
 for marker in (
  "_measureCompassPickerDiagnostics()",
  "_measureMedallionPickerDiagnostics()",
  "_syncPickerDiagnostics()",
  "_medallionDiagnosticDescriptor()",
  "_medallionDiagnosticProfile(",
  "pickers:{compass:this._pickerDiagnostics?.compass||null,medallion:this._pickerDiagnostics?.medallion||null}",
 ):
  assert marker in diagnostics
 for marker in (
  "data-compass-picker-diagnostic-stage",
  "data-compass-picker-diagnostic-nav",
  "data-compass-picker-diagnostic-readout",
  "data-medallion-picker-diagnostic-stage",
  "data-medallion-picker-diagnostic-nav",
  "data-medallion-picker-diagnostic-readout",
  "this._clearPickerDiagnostic?.('compass')",
  "this._clearPickerDiagnostic?.('medallion')",
 ):
  assert marker in map_display
 for marker in (
  "diagnosticProfile:{",
  "geometryVersion:'round-medallion-v1'",
  "sourceWidth:512,sourceHeight:512",
  "arrow:{centerXPercent:50.012238,centerYPercent:50.452396,widthPercent:59.667391,heightPercent:59.667391}",
 ):
  assert marker in base
 assert "design=MEDALLION_DESIGNS[0]" not in diagnostics
 assert "inner.aperture.centerX/512" not in diagnostics
 for marker in (
  "angleConvention:'0° North, 90° East, clockwise'",
  "assetZeroOffsetDeg:-45",
  "_renderDiagnosticFullscreenGrid(overlay)",
  "namespace:'KP'",
  "namespace:'MP'",
  "FS-A1–FS-J10",
 ):
  assert marker in diagnostics
 for marker in (
  "rotate(calc(var(--medallion-picker-diagnostic-angle,45deg) - 45deg))",
  "rotate(-45deg)",
  "rotate(135deg)",
  "_setPickerDiagnosticTopLayerHost",
  "'diagnostic-overlay','diagnostic-console'",
  ':not([data-diagnostic-mode="animation"])',
 ):
  assert marker in map_display


def test_picker_diagnostic_state_persistence_and_exports_contract():
 diagnostics=(FRONTEND/"modules/diagnostics/cockpit.js").read_text(encoding="utf-8")
 map_display=(FRONTEND/"modules/fullscreen/map-display.js").read_text(encoding="utf-8")
 for marker in (
  "_pickerDiagnosticPayload(kind)",
  "_pickerDiagnosticCsv(kind)",
  "_downloadPickerDiagnostic(kind,format='json')",
  "_copyPickerDiagnostic: async function(kind,button=null)",
  "_bindPickerDiagnosticActions(shell,kind)",
  "if(!this._diagnostics?.enabled)this._setMedallionDiagnosticMode('normal');",
  "this._syncMedallionPicker?.();this._syncPickerDiagnostics?.();",
 ):
  assert marker in diagnostics
 assert diagnostics.count("node.style?.removeProperty('display')")==2
 assert diagnostics.count("if(node.matches?.('svg'))node.replaceChildren();")==2
 for marker in (
  "data-compass-picker-diagnostic-tools",
  "data-medallion-picker-diagnostic-tools",
  "data-picker-diagnostic-copy",
  "data-picker-diagnostic-json",
  "data-picker-diagnostic-csv",
  "data-medallion-preset=\"empty\"",
  "data-medallion-preset=\"static\"",
  "data-medallion-preset=\"animation\"",
  "data-medallion-preset=\"freeze\"",
  "data-medallion-preset=\"normal\"",
  "data-medallion-angle=\"270\"",
  "medallion-picker-diagnostic-sweep",
  "stage.dataset.diagnosticMode=diagnosticState.mode",
 ):
  assert marker in map_display
