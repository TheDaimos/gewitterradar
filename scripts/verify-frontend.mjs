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
for(const marker of [
  '"id": "ui.skeleton"',
  '"version": "1.1.3"',
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
  'transition:transform .42s cubic-bezier(.22,1,.36,1),filter .28s ease'
]){
  if(!skeleton.includes(marker))throw Error('Settings scroll contract missing: '+marker);
}
for(const marker of [
  'version:"1.3.3"',
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
  '"version": "1.1.4"',
  'const settingsSections = new Set()',
  'this._registerSettingsAccordionSection = registerSettingsSection',
  'this._closeMapStartupDropdown?.(false)'
]){
  if(!controls.includes(marker))throw Error('Dynamic settings accordion contract missing: '+marker);
}
for(const marker of [
  '"id": "ui.i18n-settings"',
  '"version": "1.2.4"',
  'const SETTINGS_UI_TRANSLATIONS=Object.freeze(',
  'this._syncMapDisplayUi?.()',
  'modules.status.duplicate',
  'modules.deviation.registrations',
  'modules.deviation.active_matches'
]){
  if(!i18nSettings.includes(marker))throw Error('Settings i18n contract missing: '+marker);
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
  '"id": "fullscreen.map-display"','"version": "1.0.14"',
  "this._t('compass.picker_title')",
  "this._t('compass.picker_change')",
  "this._t('map.medallion_move')",
  "this._t('settings.map_startup_select')",
  '_closeMapStartupDropdown(returnFocus = false)'
]){
  if(!mapDisplay.includes(marker))throw Error('Map tooltip contract missing: '+marker);
}
for(const marker of [
  '"id": "diagnostics.cockpit"','"version": "1.1.4"',
  '_syncPickerDiagnostics()',
  '_measureCompassPickerDiagnostics()',
  '_measureMedallionPickerDiagnostics()',
  '_medallionDiagnosticProfile(',
  'pickers:{compass:this._pickerDiagnostics?.compass||null,medallion:this._pickerDiagnostics?.medallion||null}',
  '_pickerDiagnosticPayload(kind)',
  '_pickerDiagnosticCsv(kind)',
  "_downloadPickerDiagnostic(kind,format='json')",
  '_bindPickerDiagnosticActions(shell,kind)',
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
  ');\nexport const installI18nSettings'
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
if(moduleViewIds.length!==22)throw Error('Unexpected module-view metadata id count');
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
  const clusterBundle=clusterResolutionLabels[language];
  if(!clusterBundle)throw Error('Missing cluster profile language: '+language);
  for(const key of ['early','balanced','late','classic']){
    if(typeof clusterBundle[key]!=='string'||!clusterBundle[key].trim())throw Error('Missing cluster profile translation: '+language+' / '+key);
  }
}
if(Object.keys(settingsUiTranslations).length!==registeredLanguages.length)throw Error('Unexpected settings UI language count');
if(Object.keys(clusterResolutionLabels).length!==registeredLanguages.length)throw Error('Unexpected cluster profile language count');
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
console.log('PASS: V4.09 final validated against accepted V4.09.28 provenance plus diagnostic selector scope correction; exact delivery parity, assets and packages verified.');
