// Run with: node scripts/test-moon-legend-contract.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base='custom_components/gewitterradar/frontend/';
const moon=fs.readFileSync(base+'modules/weather/moon-legend.js','utf8');
const model=fs.readFileSync(base+'modules/weather/legend-hub-model.js','utf8');
const hub=fs.readFileSync(base+'modules/weather/legend-hub.js','utf8');
const registry=fs.readFileSync(base+'modules/weather/legend-registry.js','utf8');
assert.match(moon,/weather_router\/consumer\/moon/);
assert.match(moon,/contract_version:1/);
assert.match(moon,/weather_router\.moon\.v1/);
assert.match(moon,/moveend/);
assert.match(moon,/zoomend/);
assert.match(moon,/MOON_MIN_ZOOM=7/);
assert.match(moon,/\.gr-moon-body\[hidden\]/);
assert.match(model,/'other','moon'/);
assert.match(hub,/if\(id==='moon'\)return moonOpen/);
assert.match(hub,/if\(id==='moon'\)\{if\(visible\)openMoon/);
assert.match(registry,/icon:id==='moon'\?moonIcon/);
const files=['00_neumond','01_zunehmende_sichel','02_erstes_viertel','03_zunehmender_mond','04_vollmond','05_abnehmender_mond','06_letztes_viertel','07_abnehmende_sichel'];
for(const name of files){
 assert.match(moon,new RegExp(name+'_512\\.png'));
 for(const dir of [base,'frontend/','dashboard/dist/'])
  assert.ok(fs.statSync(dir+'assets/moon/'+name+'_512.png').size>0,dir+name);
}
for(const relative of ['modules/weather/moon-legend.js','modules/weather/legend-hub.js','modules/weather/legend-hub-model.js','modules/weather/legend-registry.js']){
 const reference=fs.readFileSync(base+relative);
 for(const dir of ['frontend/','dashboard/dist/'])assert.ok(reference.equals(fs.readFileSync(dir+relative)),relative+' mirrored');
}
console.log('Moon Legend integration/asset checks: OK');
