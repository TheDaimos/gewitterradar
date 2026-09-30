import {readFile,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {root,hash,expectedPayload,expectedDashboardPackages,destinations} from './build-frontend.mjs';
const payload=await expectedPayload();
const moduleView=await readFile(resolve(root,'frontend/modules/diagnostics/module-view.js'),'utf8');
const skeleton=await readFile(resolve(root,'frontend/modules/ui/skeleton.js'),'utf8');
const controls=await readFile(resolve(root,'frontend/modules/ui/controls.js'),'utf8');
const i18nSettings=await readFile(resolve(root,'frontend/modules/ui/i18n-settings.js'),'utf8');
const baseContext=await readFile(resolve(root,'frontend/modules/core/base-context.js'),'utf8');
const render=await readFile(resolve(root,'frontend/modules/ui/render.js'),'utf8');
const mapDisplay=await readFile(resolve(root,'frontend/modules/fullscreen/map-display.js'),'utf8');
const clustersRecent=await readFile(resolve(root,'frontend/modules/map/clusters-recent.js'),'utf8');
const diagnostics=await readFile(resolve(root,'frontend/modules/diagnostics/cockpit.js'),'utf8');
const compassSelector=await readFile(resolve(root,'frontend/modules/instruments/compass-selector.js'),'utf8');
const radiiMap=await readFile(resolve(root,'frontend/modules/location/radii-map.js'),'utf8');
for(const marker of [
  '"id": "ui.skeleton"',
  '"version": "1.1.16"',
  '.settings-body {',
  'grid-auto-rows:max-content;',
  'align-content:start;',
  'overflow-y:auto!important;',
  '.settings-collapsible[open] > .settings-section-content,',
  '#settings-radii-section[open] > .settings-radius-list {',
  'max-height:none!important;',
  '#settings-map-section .settings-cluster-session-selector',
  'margin-right:10px',
  'width:min(560px,calc(100vw - 20px))',
  'min-width:32px;width:auto;padding:5px 7px',
  'width:min(520px,calc(100vw - 20px))',
  'transition:transform .42s cubic-bezier(.22,1,.36,1),filter .28s ease',
  '-webkit-tap-highlight-color:transparent',
  '.trend-icon:focus-visible',
  '#trend-box:focus-visible',
  'R33 – sehr schmale Touch-Anzeigen',
  'R34: Auf dem iPad im Querformat',
  'R37: Einheitliche Android-Reihenfolge',
  'Die R35-Umordnung',
  '.compass-corner-controls gelten jetzt auch hier unveraendert.',
  '#card-root:not(.ipad-device) .compass-panel',
  'R36: Die bisherige untere Reserve',
  'padding-bottom:16px;',
  '#card-root.ipad-device .compass-readout',
  'margin-top:20px;',
  '#card-root.ipad-device .compass-chips',
  'margin-top:calc(clamp(34px,6vh,64px) + 11px);',
  '#card-root:not(.ipad-device) .compass-readout',
  '#card-root:not(.ipad-device) .compass-chips',
  'margin-top:25px;',
  '.compass-head:not(:has([data-warning-test]:not([hidden])))',
  'Integration zusätzlicher Wetterdienste, Wetterereignisse und Gefahreninformationen durch WeatherRouter.',
  'Einführung eines zentralen Systemstatus mit zustandsabhängigen Hinweisen, Fehlermeldungen und konkreten Lösungsvorschlägen.',
  'Erweiterte Blitzortung- und Tracker-Diagnose zur Erkennung von Kopplungs-, Datenquellen- und Erfassungsproblemen.',
  'Ausbau von „Hilfe &amp; Hinweise“ um eine thematisch strukturierte Fehlerbehebung.',
  'Verbesserte Prüfung und Fehlererkennung für gespeicherte Standorte und die zugehörige lokale To-do-Liste.',
  'Einführung überwachter Standorte (Monitored Areas) mit eigenständiger Hintergrundüberwachung, optionaler Ereignisprotokollierung, Löschschutz sowie CSV- und PDF-Export.',
  'Vereinheitlichung der mehrsprachigen Status-, Warn- und Fehlermeldungen über sämtliche Funktionen hinweg.',
  'Integrate additional weather services, weather events and hazard information through WeatherRouter.',
  'Introduce a central system status with context-sensitive notices, error messages and concrete suggestions for resolving problems.',
  'Expand Blitzortung and tracker diagnostics to identify coupling, data-source and detection-range problems.',
  'Extend Help &amp; Notes with a troubleshooting section organized by topic.',
  'Improve checks and error detection for saved locations and the associated local To-do list.',
  'Introduce monitored areas with independent background monitoring, optional event logging, deletion protection, and CSV/PDF export.',
  'Standardize multilingual status, warning and error messages across all functions.',
  'Vom Monolithen zum modularen Gewitterradar',
  '23 klar abgegrenzte Module',
  'Weitere Verbesserungen an Oberfläche und Bedienung:',
  '28 Medaillon-Designs und 18 Pfeilvarianten'
]){
  if(!skeleton.includes(marker))throw Error('Settings scroll contract missing: '+marker);
}
for(const marker of [
  'version:"1.3.6"',
  '>Modul-Details</button>',
  'gr-mod-summary-compact',
  '@media(max-width:540px)',
  'width:min(660px,calc(100vw - 32px))',
  'if(backdrop)this.shadow.append(backdrop)',
  'id="settings-modules-backdrop"',
  '>Diagnose kopieren</button>',
  '>JSON herunterladen</button>',
  'if(diagnostic)diagnostic.after(section)',
  'this._registerSettingsAccordionSection?.(section)',
  '_syncModuleTranslations',
  '"modules.title"',
  '"modules.detail.functions"',
  '_moduleListSignature(result)',
  'list.dataset.moduleSignature!==signature',
  'const MODULE_VIEW_IDS=Object.freeze(',
  'const MODULE_VIEW_META=Object.freeze(',
  'const modulePresentation=(language,row)=>',
  'moduleRuntimeManifestUrl',
  '_refreshModuleRuntimeProbe(result)',
  'const fingerprintMismatch=loadedId!==expectedId;',
  'const installedReleaseMismatch=Boolean(installedId&&releaseId&&installedId!==releaseId);',
  'if(probe?.installedReleaseMismatch||probe?.revisionMismatch)',
  'cache:"no-store"',
  'modules.runtime_stale',
  'modules.set_id',
  'settings-modules-deviations-backdrop',
  'gr-mod-deviation-trigger',
  '_moduleDeviationPayload()',
  '_renderModuleDeviationDialog(',
  '_copyModuleDeviationDiagnostics()',
  '_downloadModuleDeviationDiagnostics()'
]){
  if(!moduleView.includes(marker))throw Error('Module details UI contract missing: '+marker);
}

for(const marker of [
  '"id": "ui.controls"',
  '"version": "1.1.5"',
  'const settingsSections = new Set()',
  'this._registerSettingsAccordionSection = registerSettingsSection',
  'this._closeMapStartupDropdown?.(false)'
]){
  if(!controls.includes(marker))throw Error('Dynamic settings accordion contract missing: '+marker);
}
for(const marker of [
  '"id": "ui.i18n-settings"',
  '"version": "1.3.3"',
  'const SETTINGS_UI_TRANSLATIONS=Object.freeze(',
  'this._syncMapDisplayUi?.()',
  'modules.status.duplicate',
  'modules.deviation.registrations',
  'modules.deviation.active_matches',
  'const V410_UI_TRANSLATIONS=Object.freeze(',
  'const V410_HELP_INSTRUMENTS=Object.freeze(',
  '_syncV410Tooltips()',
  '_syncMapZoomTooltips()',
  "'.leaflet-control-zoom-in'",
  "'.leaflet-control-zoom-out'",
  "'tooltip.map_zoom_in'",
  "'tooltip.map_zoom_out'",
  '_helpWithV410(language,help)',
  "help=this._helpWithV410(language,locale.help)",
  "const v410InstrumentHelpIcon='data:image/png;base64,",
  "'instruments-v410':v410InstrumentHelpIcon"
]){
  if(!i18nSettings.includes(marker))throw Error('Settings i18n contract missing: '+marker);
}
for(const marker of [
  '"id": "location.radii-map"',
  '"version": "1.0.3"',
  'zoomControl:true',
  'this._syncMapZoomTooltips?.();'
]){
  if(!radiiMap.includes(marker))throw Error('Translated Leaflet zoom initialization missing: '+marker);
}
{
  const entry=await readFile(resolve(root,'frontend/gewitterradar.js'),'utf8');
  const version=await readFile(resolve(root,'frontend/version.js'),'utf8');
  if(!entry.includes("const GEWITTERRADAR_MODULE_CACHE = APPLICATION_RELEASE.runtimeRevision;")||entry.includes("GEWITTERRADAR_FEATURE_CACHE"))throw Error('V4.11.03 must use one canonical module runtime revision');
  for(const marker of ['version:"4.11.03"','displayVersion:"V4.11.03 DEV"','runtimeRevision:"41103r1"','moduleSetId:"E411-03A1"']){
    if(!version.includes(marker))throw Error('V4.11.03 canonical identity missing: '+marker);
  }
  const runtimeImport=/\?v=(\d+r\d+)/g;
  for(const relative of (await (async function walkJs(dir,prefix=''){const out=[];for(const e of await readdir(dir,{withFileTypes:true})){const n=prefix+e.name;if(e.isDirectory())out.push(...await walkJs(resolve(dir,e.name),n+'/'));else if(n.endsWith('.js'))out.push(n);}return out;})(resolve(root,'frontend/modules')))){
    const moduleText=await readFile(resolve(root,'frontend/modules',relative),'utf8');
    for(const match of moduleText.matchAll(runtimeImport))if(match[1].startsWith('41')&&match[1]!== '41103r1'&&!['41002r14','41002r15'].includes(match[1])){
      const line=moduleText.slice(0,match.index).split('\n').length;
      const context=moduleText.slice(Math.max(0,match.index-140),Math.min(moduleText.length,match.index+220)).replace(/\s+/g,' ');
      throw Error('Stale module runtime revision in '+relative+': '+match[1]+' @ line '+line+' · '+context);
    }
  }
}
for(const marker of [
  '"id": "ui.render"','"version": "1.0.2"',
  "this._t('app.release_history')",
  "this._t('settings.cluster_resolution_select')",
  "this._t('settings.cluster_navigation_session_aria')"
]){
  if(!render.includes(marker))throw Error('Rendered tooltip contract missing: '+marker);
}
for(const marker of [
  '"id": "fullscreen.map-display"','"version": "1.0.30"',
  "this._t('compass.picker_title')",
  "this._t('compass.picker_change')",
  "this._t('map.medallion_move')",
  "this._t('settings.map_startup_select')",
  "this._t('picker.fullscreen_size')",
  "this._t('picker.fullscreen_size_range')",
  "this._t('picker.custom_size')",
  "this._t('picker.selection')",
  "this._t('picker.medallion')",
  "this._t('picker.arrow')",
  "this._t('picker.preview')",
  "this._t('picker.static')",
  "this._t('picker.animation')",
  '_closeMapStartupDropdown(returnFocus = false)',
  'data-medallion-scale',
  'data-medallion-center-x',
  'data-medallion-center-y',
  'data-medallion-scale-auto',
  'data-medallion-scale-accept',
  'data-medallion-scale-next',
  'data-medallion-calibration-json',
  'data-medallion-calibration-csv',
  'data-medallion-eye-circle',
  'data-medallion-eye-x',
  'data-medallion-eye-y',
  'data-medallion-eye-radius',
  'data-medallion-eye-auto',
  'data-medallion-eye-accept',
  'data-medallion-eye-next',
  'data-medallion-eye-json',
  'data-medallion-diagnostic-group="display"',
  'data-medallion-diagnostic-group="eye"',
  'data-medallion-diagnostic-group="arrow"',
  'data-medallion-diagnostic-group="fit"',
  'gewitterradar:v41002:medallion-diagnostic-accordion',
  'data-fullscreen-scale-preset="50"',
  'data-fullscreen-scale-preset="150"',
  'data-fullscreen-scale-custom',
  'data-fullscreen-scale-range',
  'input.dataset.fullscreenScaleEditing',
  'data-medallion-selection-mode="medallion"',
  'data-medallion-selection-mode="arrow"',
  'data-medallion-preview-mode="static"',
  'data-medallion-preview-mode="animation"',
  'gewitterradar:v41002:medallion-picker-preview-mode',
  'if (this._mapCompassDragState) return;',
  'if (this._mapMedallionDragState) return;',
  'if (this._mapLocationDragState) return;',
  'rgba(255,255,255,.40)',
  'drop-shadow(0 0 11px rgba(255,255,255,.32))',
  "previousFocus.id === 'trend-icon'",
  "classList.contains('ipad-device')",
  "trendIcon.removeAttribute('tabindex')",
  "requestAnimationFrame(()=>trendIcon.blur?.())",
  "stage.dataset.trendState='diagnostic'",
  "previewMode==='animation'?'animation':'preview-static'",
  'type="text" inputmode="numeric" pattern="[0-9]*" maxlength="3"',
  "input?.dataset?.fullscreenScaleEditing==='1'",
  "output.textContent = (index + 1) + ' / ' + designs.length",
  "arrowOutput.textContent = (arrowIndex + 1) + ' / ' + arrowDesigns.length",
  "'Pfeil: '+arrowDescriptor.id+' · '",
  'stage.style.setProperty(\'--medallion-diagnostic-scale\',String(productScale))',
  'gewitterradar:v41002:fullscreen-compass-scale',
  'gewitterradar:v41002:fullscreen-medallion-scale',
  'MEDALLION_ARROW_PRODUCTION_CALIBRATION'
]){
  if(!mapDisplay.includes(marker))throw Error('Map tooltip contract missing: '+marker);
}
for(const marker of [
  '"id": "diagnostics.cockpit"','"version": "1.5.1"',
  '_syncPickerDiagnostics()',
  '_measureCompassPickerDiagnostics()',
  '_measureMedallionPickerDiagnostics()',
  '_medallionDiagnosticProfile(',
  'pickers:{compass:this._pickerDiagnostics?.compass||null,medallion:this._pickerDiagnostics?.medallion||null}',
  'productCalibration=this._productMedallionCalibration?.()',
  'previewScale=!diagnosticActive&&Number.isFinite(productScale)?productScale:state.effectiveScale',
  '_pickerDiagnosticPayload(kind)',
  '_pickerDiagnosticCsv(kind)',
  "_downloadPickerDiagnostic: async function(kind,format='json')",
  '_bindPickerDiagnosticActions(shell,kind)',
  "schema:'gewitterradar.picker-diagnostic.v2'",
  '_measureMedallionArrowFitMatrix: async function',
  '_computeMedallionArrowFit(eye,arrow)',
  '_measureMedallionEyeAsset: async function',
  '_measureTrendArrowAsset: async function',
  '_copyTextReliable: async function',
  'gewitterradar.medallion-arrow-geometry.v2',
  'data-medallion-fit-matrix',
  'data-medallion-fit-db-json',
  'gewitterradar.medallion-arrow-visual-calibration-export.v2',
  'recommendedCenter',
  'arrowToEyeRatioCentered',
  'eye-center-plus-render-origin-v1',
  'gewitterradar.medallion-eye-calibration.v1',
  'manual-user-circle-v1',
  '_resolvedMedallionEyeReference(',
  '_bindMedallionEyeCircleDrag(',
  'manualEyeReferenceCount',
  "if(!this._diagnostics?.enabled)this._setMedallionDiagnosticMode('normal');",
  "node.style?.removeProperty('display')",
  "if(node.matches?.('svg'))node.replaceChildren();"
]){
  if(!diagnostics.includes(marker))throw Error('Picker diagnostic contract missing: '+marker);
}
for(const marker of [
  '"id": "map.clusters-recent"','"version": "1.0.3"',
  "this._t('settings.cluster_navigation_to_session')",
  "this._t('settings.cluster_navigation_to_infinite')"
]){
  if(!clustersRecent.includes(marker))throw Error('Cluster hover contract missing: '+marker);
}
for(const [source,label] of [[render,'render'],[mapDisplay,'map-display'],[clustersRecent,'clusters-recent']]){
  for(const forbidden of ['Cluster-Auflösung auswählen','Cluster-Auflösung ·','Zur Sitzungszeit wechseln','Auf unbegrenzt wechseln',' · verschieben']){
    if(source.includes(forbidden))throw Error('Hard-coded German tooltip remains in '+label+': '+forbidden);
  }
}
for(const marker of [
  'id:"core.base-context"',
  'version:"1.0.7"',
  'const CLUSTER_RESOLUTION_LABELS=Object.freeze(',
  "['Cluster-Auflösung','settings.cluster_resolution']",
  "['Cluster-Navigation · Sitzungszeit','settings.cluster_navigation_session']"
]){
  if(!baseContext.includes(marker))throw Error('Cluster locale contract missing: '+marker);
}

const registeredLanguages=['Deutsch','English','Dansk','Español','Français','Nederlands','Polski','Português','Svenska','Italiano','Norsk bokmål','Suomi','Čeština','Ελληνικά','Magyar','Boarisch','Plattdüütsch','Sächs’sch','Schwäbisch'];
const requiredSettingsKeys=[
  'settings.cluster_resolution','settings.cluster_resolution_note','settings.cluster_navigation_session','settings.cluster_navigation_range','settings.cluster_navigation_infinite',
  'settings.cluster_resolution_select','settings.cluster_navigation_session_aria','settings.cluster_navigation_seconds_aria','settings.cluster_navigation_infinite_aria','settings.cluster_navigation_to_session','settings.cluster_navigation_to_infinite',
  'settings.map_display','settings.map_startup','settings.map_startup_note','settings.map_startup_last','settings.map_startup_select','settings.map_display_sub','settings.map_window','settings.map_window_note','settings.map_window_open','settings.map_window_open_aria',
  'app.release_history','app.release_history_open','map.medallion_move','compass.picker_title','compass.picker_change',
  'modules.title','modules.subtitle','modules.details','modules.kicker','modules.close','modules.copy','modules.download','modules.loaded','modules.consistent','modules.deviations','modules.set_id','modules.runtime_stale','modules.installed',
  'modules.status.ok','modules.status.missing','modules.status.version_mismatch','modules.status.unexpected',
  'modules.group.other','modules.group.core','modules.group.fullscreen','modules.group.ui','modules.group.instruments','modules.group.diagnostics','modules.group.location','modules.group.map','modules.group.history',
  'modules.detail.status','modules.detail.version','modules.detail.expected','modules.detail.file','modules.detail.loaded','modules.detail.functions'
];
const extractFrozenJson=(source,prefix,suffix)=>{
  const start=source.indexOf(prefix);
  if(start<0)throw Error('Locale registry prefix missing: '+prefix);
  const from=start+prefix.length;
  const end=source.indexOf(suffix,from);
  if(end<0)throw Error('Locale registry suffix missing: '+suffix);
  return JSON.parse(source.slice(from,end));
};
const settingsUiTranslations=extractFrozenJson(
  i18nSettings,
  'const SETTINGS_UI_TRANSLATIONS=Object.freeze(',
  ');\nconst V410_UI_TRANSLATIONS'
);
const v410UiTranslations=extractFrozenJson(
  i18nSettings,
  'const V410_UI_TRANSLATIONS=Object.freeze(',
  ');\nconst V410_HELP_INSTRUMENTS'
);
const v410HelpInstruments=extractFrozenJson(
  i18nSettings,
  'const V410_HELP_INSTRUMENTS=Object.freeze(',
  ');\n\nexport const installI18nSettings'
);
const clusterResolutionLabels=extractFrozenJson(
  baseContext,
  'const CLUSTER_RESOLUTION_LABELS=Object.freeze(',
  ');\n\n  function getClusterResolutionProfileLabel'
);
const moduleViewIds=extractFrozenJson(
  moduleView,
  'const MODULE_VIEW_IDS=Object.freeze(',
  ');\n  const MODULE_VIEW_META'
);
const moduleViewMeta=extractFrozenJson(
  moduleView,
  'const MODULE_VIEW_META=Object.freeze(',
  ');\n  const modulePresentation'
);
if(moduleViewIds.length!==26)throw Error('Unexpected module-view metadata id count');
if(Object.keys(moduleViewMeta).length!==registeredLanguages.length)throw Error('Unexpected module-view language count');
for(const language of registeredLanguages){
  const entries=moduleViewMeta[language];
  if(!Array.isArray(entries)||entries.length!==moduleViewIds.length)throw Error('Incomplete module-view locale: '+language);
  for(let index=0;index<entries.length;index+=1){
    const entry=String(entries[index]||'');
    const divider=entry.indexOf('|');
    if(divider<=0||!entry.slice(divider+1).trim())throw Error('Invalid module-view locale entry: '+language+' / '+moduleViewIds[index]);
  }
}
for(const entry of moduleViewMeta['Ελληνικά']){
  const [name,functions]=String(entry).split(/\|(.+)/).filter(Boolean);
  if(!/[\u0370-\u03ff\u1f00-\u1fff]/u.test(name||''))throw Error('Greek module name lacks Greek text: '+entry);
  if(!/[\u0370-\u03ff\u1f00-\u1fff]/u.test(functions||''))throw Error('Greek module functions lack Greek text: '+entry);
}
for(const language of registeredLanguages){
  const settingsBundle=settingsUiTranslations[language];
  if(!settingsBundle)throw Error('Missing settings UI language: '+language);
  for(const key of requiredSettingsKeys){
    if(typeof settingsBundle[key]!=='string'||!settingsBundle[key].trim())throw Error('Missing settings UI translation: '+language+' / '+key);
  }
  const v410UiBundle=v410UiTranslations[language];
  if(!v410UiBundle)throw Error('Missing V4.10 UI language: '+language);
  for(const key of ['picker.fullscreen_size','picker.fullscreen_size_range','picker.custom_size','picker.selection','picker.medallion','picker.arrow','picker.preview','picker.static','picker.animation','tooltip.animation_toggle','tooltip.test_storm','tooltip.test_danger','tooltip.settings_open','tooltip.compass_north','tooltip.card_version','tooltip.map_zoom_in','tooltip.map_zoom_out']){
    if(typeof v410UiBundle[key]!=='string'||!v410UiBundle[key].trim())throw Error('Missing V4.10 UI translation: '+language+' / '+key);
  }
  const helpBundle=v410HelpInstruments[language];
  if(!helpBundle||typeof helpBundle.title!=='string'||!helpBundle.title.trim()||typeof helpBundle.intro!=='string'||!helpBundle.intro.trim())throw Error('Missing V4.10 help translation: '+language);
  if(!Array.isArray(helpBundle.entries)||helpBundle.entries.length!==4||helpBundle.entries.some((entry)=>!Array.isArray(entry)||entry.length!==2||entry.some((value)=>typeof value!=='string'||!value.trim())))throw Error('Incomplete R38 four-entry instrument help: '+language);
  // All four R38 descriptions remain independent of growing design/arrow catalogs.
  if(helpBundle.entries.some((entry)=>/\d/u.test(entry[1])))throw Error('Fixed instrument quantity in help: '+language);
  if(!/(?:aur|αύρ)/i.test(String(helpBundle.entries[3]?.[0]||'')))throw Error('Aura help entry must be last: '+language);
  if(!/(?:&| und | and | og | et | y | en | i | e | och | ja | a | και | és | un | ond )/iu.test(String(helpBundle.entries[1]?.[0]||'')))throw Error('Medallion/arrow help must be combined: '+language);
    const clusterBundle=clusterResolutionLabels[language];
  if(!clusterBundle)throw Error('Missing cluster profile language: '+language);
  for(const key of ['early','balanced','late','classic']){
    if(typeof clusterBundle[key]!=='string'||!clusterBundle[key].trim())throw Error('Missing cluster profile translation: '+language+' / '+key);
  }
}
if(Object.keys(settingsUiTranslations).length!==registeredLanguages.length)throw Error('Unexpected settings UI language count');
if(Object.keys(v410UiTranslations).length!==registeredLanguages.length)throw Error('Unexpected V4.10 UI language count');
if(Object.keys(v410HelpInstruments).length!==registeredLanguages.length)throw Error('Unexpected V4.10 help language count');
if(Object.keys(clusterResolutionLabels).length!==registeredLanguages.length)throw Error('Unexpected cluster profile language count');
for(const forbidden of ['if(!this._auraEnabled())return \'A\';','if(!this._auraEnabled()&&!calibrationNavigation)return']){
  if(compassSelector.includes(forbidden))throw Error('Aura still blocks compass selection: '+forbidden);
}
for(const forbidden of ['id="compass-design-selector"','id="settings-selector-design-row"','id="settings-selector-preview"','id="selector-frame-prev"','id="selector-frame-next"']){
  if(skeleton.includes(forbidden))throw Error('Obsolete compass selector UI remains: '+forbidden);
}
for(const marker of ['animation-toggle','warning-test-top-storm','warning-test-top-danger','settings-open','warning-test-map-storm','warning-test-map-danger','warning-test-history-storm','warning-test-history-danger','warning-test-compass-storm','warning-test-compass-danger','settings-cluster-jump-infinite']){
  if(!i18nSettings.includes("'"+marker+"'"))throw Error('V4.10 tooltip mapping missing: '+marker);
}
async function files(dir,prefix=''){const out=[];for(const entry of await readdir(dir,{withFileTypes:true})){const name=prefix+entry.name;if(entry.isDirectory())out.push(...await files(resolve(dir,entry.name),name+'/'));else out.push(name);}return out.sort();}
const checks=[];
for(const dest of destinations){
 const wanted=[...payload.keys()];
 if(dest==='dashboard/dist')wanted.push('app_gewitterradar_v4_06_pkg.yaml','app_gewitterradar_v4_07_pkg.yaml');
 if(JSON.stringify(await files(resolve(root,dest)))!==JSON.stringify(wanted.sort()))throw Error('Unexpected/missing payload file '+dest);
 for(const [name,bytes] of payload){const actual=await readFile(resolve(root,dest,name));if(!actual.equals(bytes))throw Error('Delivery parity failed '+dest+'/'+name);checks.push(hash(actual)+'  '+dest+'/'+name);}
}
const packages=await expectedDashboardPackages();
for(const [name,bytes] of packages){
 const actual=await readFile(resolve(root,'dashboard/dist',name));
 if(!actual.equals(bytes))throw Error('Dashboard package parity failed '+name);
 checks.push(hash(bytes)+'  dashboard/dist/'+name);
}
const expectedChecksums=checks.sort().join('\n')+'\n';
if(await readFile(resolve(root,'SHA256SUMS_FRONTEND.txt'),'utf8')!==expectedChecksums){
 console.error('Expected package checksum rows:');
 for(const row of checks.filter(row=>row.includes('_pkg.yaml')).sort())console.error(row);
 throw Error('Checksum inventory stale');
}
const hacs=JSON.parse(await readFile(resolve(root,'dashboard/hacs.json'),'utf8'));
if(hacs.filename!=='gewitterradar.js'||hacs.zip_release)throw Error('Dashboard HACS package contract changed');
console.log('PASS: active version contract, exact delivery parity, assets and packages verified.');
