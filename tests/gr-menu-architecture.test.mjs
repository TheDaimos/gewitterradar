import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {SETTINGS_MENU_TREE} from '../frontend/modules/ui/controls.js';
import {APPLICATION_RELEASE} from '../frontend/version.js';
const base='7213b7aeffba5c6bc6fd2afb6bd74f84c88632b6',read=p=>readFileSync(p),original=p=>execFileSync('git',['show',base+':'+p],{maxBuffer:25*1024*1024});
test('one immutable tree defines exactly seven root entries and four numbered diagnostic leaves',()=>{
 assert.deepEqual(SETTINGS_MENU_TREE.map(m=>[m.number,m.title]),[['1','Weather-Engine'],['2','Sprache'],['3','Standort'],['4','Kartendarstellung'],['5','Effekte & Animationen'],['6','Radien'],['7','Diagnose Tools']]);
 assert.deepEqual(SETTINGS_MENU_TREE.at(-1).children.map(m=>[m.number,m.title]),[['7.1','Kalibrierung'],['7.2','Weather-Engine'],['7.3','Datenquellen & Verbindungen'],['7.4','Module & Versionen']]);
 const all=SETTINGS_MENU_TREE.flatMap(x=>[x,...(x.children||[])]);assert.equal(new Set(all.map(x=>x.id)).size,11);
 assert(Object.isFrozen(SETTINGS_MENU_TREE));for(const item of all)assert(Object.isFrozen(item));
});
test('release, runtime and DRA metadata identify the same new delivery',()=>{
 const r=APPLICATION_RELEASE,rt=JSON.parse(read('frontend/assets/gewitterradar-runtime-manifest.json')),p=JSON.parse(read('custom_components/gewitterradar/dra-deployment-provenance.json'));
 assert.notEqual(r.version,original('frontend/version.js').toString().match(/version:"([^"]+)"/)[1]);
 for(const [k,v] of Object.entries({productVersion:r.version,build:r.build,runtimeRevision:r.runtimeRevision,moduleSetId:r.moduleSetId})){assert.equal(rt[k],v);assert.equal(p[k],v);}
 assert.equal(JSON.parse(read('custom_components/gewitterradar/manifest.json')).version,r.integrationVersion);
 assert(read('custom_components/gewitterradar/build_info.py').toString().includes('BUILD_VERSION = "'+r.version+'"'));
});
test('all wind, temperature, precipitation/mosaic and vector data/rendering files remain byte-identical',()=>{
 for(const name of ['wind-data.js','wind-field.js','wind-canvas.js','wind-display.js','wind-studio.js','wind-studio-data.js','snake-config.js','snake-geometry.js','snake-canvas.js','temperature-data.js','temperature-field.js','temperature-canvas.js','temperature-display.js','temperature-units.js','frame-clock.js','legend-overlay.js','precipitation-layer.js','p7-010/raster-tile-url.js','p7-010/raster-tile-clip.js','p7-010/raster-mosaic-consumer.js','p7-010/raster-mosaic-contract.js','p7-010/raster-mosaic-grid-layer.js','p7-010/raster-mosaic-tile-loader.js','p7-010/raster-mosaic-coverage.js','p7-010/nasa-spatial.js','p7-010/radar-mask.js']){const p='frontend/modules/weather/'+name;assert(read(p).equals(original(p)),name);}
});
test('DRA source/channel, licenses, historical references and original icon bytes stay untouched',()=>{
 for(const p of ['deploy-relay.json','deploy-relay-channel.json','LICENSE','docs/GR_SNAKE_FLOW_PROTECTED_REFERENCE_2026-11-08.md','docs/GR_WR_TEMPERATURE_WORLD_USER_REFERENCE_2026-11-08.md'])assert.equal(read(p).toString().replaceAll('\r\n','\n'),original(p).toString().replaceAll('\r\n','\n'),p);
 const assets=JSON.parse(read('artwork/help-icons/gr-precipitation-ASSET_MANIFEST.json'));
 for(const p of [assets.master,'frontend/'+assets.runtime.file])assert(read(p).equals(original(p)),p);
});
test('module runtime/stale guard stays intact while its menu page gains natural height',()=>{
 const p='frontend/modules/diagnostics/module-view.js',old=original(p).toString();
 const oldVersion=old.match(/version:"([^"]+)"/)[1];
 const current=read(p).toString().replace(/version:"[^"]+"/,'version:"'+oldVersion+'"').replace('      section.dataset.grDynamicHeight="true";\n','');
 assert.equal(current,old);
 for(const p of ['frontend/modules/map/strikes-warnings.js','frontend/modules/map/clusters-recent.js'])assert(read(p).equals(original(p)),p);
});
test('card lifecycle changes only optional settings navigation cleanup/resume hooks',()=>{
 const p='frontend/modules/core/card-lifecycle.js',old=original(p).toString(),v=old.match(/"version": "([^"]+)"/)[1];
 const now=read(p).toString().replace(/"version": "[^"]+"/,'"version": "'+v+'"')
  .replace('      this._resumeSettingsNavigation?.();\n','').replace('      this._teardownSettingsNavigation?.();\n','');
 assert.equal(now,old);
});
