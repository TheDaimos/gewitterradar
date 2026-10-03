"""V4.10.02 modular frontend contracts."""
import json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];FRONTEND=ROOT/"frontend";CONTRACT=json.loads((ROOT/"tests/contracts/frontend-dev-v4.10.02.json").read_text())
CALIBRATION_DATA_MODULES={
 "modules/instruments/medallion-arrow-calibration-1.js",
 "modules/instruments/medallion-arrow-calibration-2.js",
 "modules/instruments/medallion-arrow-calibration-3.js",
 "modules/instruments/medallion-arrow-calibration-4.js",
}
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
  if name in CALIBRATION_DATA_MODULES:
   assert text.startswith("export const MEDALLION_ARROW_CALIBRATION_")
   continue
  assert re.search(r'["\']?version["\']?\s*:\s*["\']\d+\.\d+\.\d+["\']',text)
def test_expected_module_versions_match_self_registration():
 manifest=(FRONTEND/"module-manifest.js").read_text(encoding="utf-8")
 expected=dict(re.findall(r'"id": "([^"]+)",\s*"version": "([^"]+)"',manifest))
 is_v41103='export const APPLICATION_META=APPLICATION_RELEASE;' in manifest
 is_v41101='version:"4.11.01"' in manifest
 is_v411=is_v41103 or is_v41101
 assert len(expected)==(28 if is_v41103 else 24 if is_v41101 else 23)
 picker_data_modules={
  "modules/fullscreen/compass-picker-chevron-left-brass.js",
  "modules/fullscreen/compass-picker-chevron-right-brass.js",
  "modules/fullscreen/compass-picker-chevron-left-silver.js",
  "modules/fullscreen/compass-picker-chevron-right-silver.js",
 }
 actual={}
 checked_files=list(CONTRACT["moduleFiles"])
 if is_v411: checked_files.append("modules/weather/consumer-client.js")
 if is_v41103: checked_files.extend(["modules/core/update-watch.js","modules/weather/precipitation-layer.js","modules/weather/layer-menu.js","modules/ui/project-hub.js"])
 for name in checked_files:
  if name in picker_data_modules or name in CALIBRATION_DATA_MODULES or name=="module-manifest.js":
   continue
  text=(FRONTEND/name).read_text(encoding="utf-8")
  id_match=re.search(r"""(?:["']?id["']?)\s*:\s*["']([^"']+)["']""",text)
  version_match=re.search(r"""(?:["']?version["']?)\s*:\s*["']([^"']+)["']""",text)
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
 is_v41103='export const APPLICATION_META=APPLICATION_RELEASE;' in manifest
 if is_v41103:
  version=(FRONTEND/"version.js").read_text(encoding="utf-8")
  assert "GEWITTERRADAR_MODULE_CACHE = APPLICATION_RELEASE.runtimeRevision" in main
  assert "GEWITTERRADAR_FEATURE_CACHE" not in main
  assert 'runtimeRevision:"41108r1"' in version
  assert 'moduleSetId:"E411-08A6"' in version
  assert 'import { APPLICATION_RELEASE } from "./version.js?v=41108r1";' in main
  assert 'import { APPLICATION_RELEASE } from "./version.js?v=41108r1";' in manifest
  assert runtime["runtimeRevision"]=="41108r1"
  assert runtime["moduleSetId"]=="E411-08A6"
  assert "gewitterradarImport('./module-manifest.js','41108r9')" in main
  assert "gewitterradarImport('./modules/fullscreen/map-display.js','41108r9')" in main
  assert "gewitterradarImport('./modules/weather/layer-menu.js','41108r9')" in main
  assert "gewitterradarImport('./modules/ui/project-hub.js','41108r8')" in main
  for path in (
   "./modules/instruments/compass-selector.js",
   "./modules/ui/i18n-settings.js","./modules/ui/controls.js","./modules/ui/skeleton.js",
   "./modules/instruments/medallion-designs.js","./modules/diagnostics/cockpit.js",
   "./modules/location/radii-map.js","./modules/diagnostics/module-view.js",
   "./modules/core/update-watch.js","./modules/weather/consumer-client.js","./modules/weather/precipitation-layer.js",
  ):
   assert f"gewitterradarImport('{path}')" in main
 else:
  assert "GEWITTERRADAR_MODULE_CACHE = '41002r13'" in main
 assert '`${path}?v=${revision}`'.replace("\\","") in main
 assert "Object.assign(__moduleDeps,{APPLICATION_META,EXPECTED_MODULES,moduleDiagnostics,moduleRegistrySnapshot,CARD_VERSION,CARD_DISPLAY_VERSION,GEWITTERRADAR_BUILD});" in main
 expected_core=next(item["version"] for item in runtime["modules"] if item["id"]=="core.manifest")
 expected_manifest=re.search(r'"id": "core\.manifest",[\s\S]*?"version": "([^"]+)"',manifest).group(1)
 self_manifest=re.search(r'id:"core\.manifest",version:"([^"]+)"',manifest).group(1)
 assert expected_manifest==expected_core==self_manifest
 assert "installedId!==loadedId" not in view
 assert "const fingerprintMismatch=loadedId!==expectedId;" in view
 assert "const installedReleaseMismatch=Boolean(installedId&&releaseId&&installedId!==releaseId);" in view
 assert "moduleRuntimeManifestUrl" in view
 assert 'cache:"no-store"' in view
 assert "_refreshModuleRuntimeProbe(result)" in view

def test_internal_module_import_cache_is_coherent():
 main=(FRONTEND/"gewitterradar.js").read_text(encoding="utf-8")
 if "APPLICATION_RELEASE.runtimeRevision" in main:
  version=(FRONTEND/"version.js").read_text(encoding="utf-8")
  cache=re.search(r'runtimeRevision:"([^"]+)"',version).group(1)
 else:
  cache=re.search(r"GEWITTERRADAR_MODULE_CACHE = '([^']+)'",main).group(1)
 stale=[]
 for path in sorted(FRONTEND.rglob("*.js")):
  text=path.read_text(encoding="utf-8")
  for match in re.finditer(r'import[^\n]*?["\'][^"\']+\?v=(\d{5}r\d+)["\']',text):
   if match.group(1)!=cache and match.group(1) not in {"41002r14","41002r15"}:
    stale.append((str(path.relative_to(FRONTEND)),match.group(1),cache))
 assert stale==[]

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
  "_downloadPickerDiagnostic: async function(kind,format='json')",
  "_copyPickerDiagnostic: async function(kind,button=null)",
  "_bindPickerDiagnosticActions(shell,kind)",
  "_measureMedallionArrowFitMatrix: async function",
  "_computeMedallionArrowFit(eye,arrow)",
  "gewitterradar.medallion-arrow-geometry.v2",
  "eyeSearchMaxRatio:Number(config.eyeSearchMaxRatio)||0.36",
  "const centerX=data.width/2,centerY=data.height/2;",
  "first-consistent-eye-ring-ellipse-v2",
  "gewitterradar.medallion-arrow-visual-calibration-export.v2",
  "recommendedCenter",
  "arrowToEyeRatioCentered",
  "eye-center-plus-render-origin-v1",
  "_setMedallionVisualCalibrationCenter(",
  "_setMedallionEyeCalibration(",
  "_acceptMedallionEyeCalibration()",
  "_resolvedMedallionEyeReference(",
  "_bindMedallionEyeCircleDrag(",
  "previewScale=!diagnosticActive&&Number.isFinite(productScale)?productScale:state.effectiveScale",
  "previewCenterX=!diagnosticActive&&Number.isFinite(productCenterX)?productCenterX:state.effectiveCenterXPercent",
  "circle.hidden=!this._pickerDiagnosticEnabled()",
  "gewitterradar.medallion-eye-calibration.v1",
  "manual-user-circle-v1",
  "_nextUnreviewedMedallionVisualCalibration()",
  "mode:'ha-webview-r19-center-aware-fit'",
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
  "data-medallion-scale",
  "data-medallion-center-x",
  "data-medallion-center-y",
  "data-medallion-scale-auto",
  "data-medallion-scale-accept",
  "data-medallion-scale-next",
  "data-medallion-calibration-json",
  "data-medallion-calibration-csv",
  "data-medallion-eye-circle",
  "data-medallion-eye-x",
  "data-medallion-eye-y",
  "data-medallion-eye-radius",
  "data-medallion-eye-accept",
  "data-medallion-eye-next",
  "data-medallion-eye-json",
  'data-medallion-diagnostic-group="display"',
  'data-medallion-diagnostic-group="eye"',
  'data-medallion-diagnostic-group="arrow"',
  'data-medallion-diagnostic-group="fit"',
  "gewitterradar:v41002:medallion-diagnostic-accordion",
 ):
  assert marker in map_display
