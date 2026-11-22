import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {SETTINGS_MENU_TREE} from '../frontend/modules/ui/controls.js';
import {APPLICATION_RELEASE} from '../frontend/version.js';
import {normaliseGeneratedModule} from './with-settings-vault.mjs';
import {withoutLegendPresentation} from './with-legend-presentation.mjs';
const base='1919bb739ecce256f6953ce250e47b90384d6086',read=p=>readFileSync(p),original=p=>execFileSync('git',['show',base+':'+p],{maxBuffer:25*1024*1024});
test('one immutable tree preserves the seven numbered entries and adds the Vault page',()=>{
 assert.deepEqual(SETTINGS_MENU_TREE.map(m=>[m.number,m.title]),[['1','Weather-Engine'],['2','Sprache'],['3','Standort'],['4','Kartendarstellung'],['5','Effekte & Animationen'],['6','Radien'],['','Userprofile & Sicherungen'],['7','Diagnose Tools']]);
 assert.deepEqual(SETTINGS_MENU_TREE.at(-1).children.map(m=>[m.number,m.title]),[['7.1','Kalibrierung'],['7.2','Weather-Engine'],['7.3','Datenquellen & Verbindungen'],['7.4','Module & Versionen']]);
 const all=SETTINGS_MENU_TREE.flatMap(x=>[x,...(x.children||[])]);assert.equal(new Set(all.map(x=>x.id)).size,12);
 assert(Object.isFrozen(SETTINGS_MENU_TREE));for(const item of all)assert(Object.isFrozen(item));
});
test('release, runtime and DRA metadata identify the same new delivery',()=>{
 const r=APPLICATION_RELEASE,rt=JSON.parse(read('frontend/assets/gewitterradar-runtime-manifest.json')),p=JSON.parse(read('custom_components/gewitterradar/dra-deployment-provenance.json'));
 const baselineVersion=original('frontend/version.js').toString().match(/version:"([^"]+)"/)[1];
 assert.equal(baselineVersion,'4.11.249','protected FINAL source identity');
 assert.match(r.version,/^4\.(11|12)\.\d+$/);
 assert(r.version.localeCompare('4.11.249',undefined,{numeric:true})>=0,'new deliveries must not replace the protected FINAL with an older version');
 for(const [k,v] of Object.entries({productVersion:r.version,build:r.build,runtimeRevision:r.runtimeRevision,moduleSetId:r.moduleSetId})){assert.equal(rt[k],v);assert.equal(p[k],v);}
 assert.equal(JSON.parse(read('custom_components/gewitterradar/manifest.json')).version,r.integrationVersion);
 assert(read('custom_components/gewitterradar/build_info.py').toString().includes('BUILD_VERSION = "'+r.version+'"'));
});
test('all wind, temperature, precipitation/mosaic and vector logic remains identical apart from generated module metadata',()=>{
 for(const name of ['wind-data.js','wind-field.js','wind-canvas.js','wind-display.js','wind-studio.js','wind-studio-data.js','snake-config.js','snake-geometry.js','snake-canvas.js','temperature-data.js','temperature-field.js','temperature-canvas.js','temperature-display.js','temperature-units.js','frame-clock.js','precipitation-layer.js','p7-010/raster-tile-url.js','p7-010/raster-tile-clip.js','p7-010/raster-mosaic-consumer.js','p7-010/raster-mosaic-contract.js','p7-010/raster-mosaic-grid-layer.js','p7-010/raster-mosaic-tile-loader.js','p7-010/raster-mosaic-coverage.js','p7-010/nasa-spatial.js','p7-010/radar-mask.js']){const p='frontend/modules/weather/'+name;assert.equal(normaliseGeneratedModule(withoutLegendPresentation(read(p).toString(),p)),normaliseGeneratedModule(original(p).toString()),name);}
});
test('legend palettes, WR metadata, source grouping and model normalization remain exact',()=>{
 const p='frontend/modules/weather/legend-overlay.js',science=s=>s.slice(s.indexOf('// Presentation snapshot'),s.indexOf('export const installWeatherLegendOverlay'));
 assert.equal(science(read(p).toString()).replaceAll('\r\n','\n'),science(original(p).toString()).replaceAll('\r\n','\n'));
});
test('DRA source/channel, licenses, historical references and original icon bytes stay untouched',()=>{
 for(const p of ['deploy-relay.json','deploy-relay-channel.json','docs/GR_SNAKE_FLOW_PROTECTED_REFERENCE_2026-11-08.md','docs/GR_WR_TEMPERATURE_WORLD_USER_REFERENCE_2026-11-08.md'])assert.equal(read(p).toString().replaceAll('\r\n','\n'),original(p).toString().replaceAll('\r\n','\n'),p);
 assert.match(read('LICENSE').toString(),/Gemeinschaftslizenz/,'main Modell B must survive V4.11 promotion');
 const assets=JSON.parse(read('artwork/help-icons/gr-precipitation-ASSET_MANIFEST.json'));
 for(const p of [assets.master,'frontend/'+assets.runtime.file])assert(read(p).equals(original(p)),p);
});
test('module runtime/stale guard stays intact in the accepted final source',()=>{
 const p='frontend/modules/diagnostics/module-view.js',old=original(p).toString();
 const current=read(p).toString();
 assert.equal(current,old);
 const strikes='frontend/modules/map/strikes-warnings.js';
 assert(read(strikes).equals(original(strikes)),strikes);
 const clusters='frontend/modules/map/clusters-recent.js';
 const expected=original(clusters).toString();
 assert.equal(normaliseGeneratedModule(read(clusters).toString()),normaliseGeneratedModule(expected),clusters);
});
test('card lifecycle preserves the accepted navigation and vault hooks',()=>{
 const p='frontend/modules/core/card-lifecycle.js',old=original(p).toString(),now=read(p).toString();
 const expected=old.replace('    disconnectedCallback() {','    disconnectedCallback() {\n      this._firstStepsDialog?.close();\n      this._proWelcomeDialog?.close();');
 assert.equal(normaliseGeneratedModule(withoutLegendPresentation(now,p)),normaliseGeneratedModule(expected));
 assert.match(now,/settingsStorage/);
 assert.match(now,/_resumeSettingsNavigation/);
 assert.match(now,/_teardownSettingsNavigation/);
});
