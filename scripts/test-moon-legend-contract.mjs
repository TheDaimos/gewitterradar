// Run with: node scripts/test-moon-legend-contract.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
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

assert.doesNotMatch(moon,/showModal\(/);
assert.match(moon,/setInterval/);
assert.match(moon,/clearInterval/);
assert.match(moon,/normalizeLongitude/);
assert.match(moon,/closeIcon=icon\('close'\)/);
assert.match(moon,/extraPositions/);

const assetManifest=JSON.parse(fs.readFileSync('docs/design/legend-hub/moon/manifest.json','utf8'));
for(const phase of assetManifest.phases){
 const original=phase.phase_id==='full_moon'?'references/moon_full_silver_platinum_master.png':phase.master.path;
 const filename=original.split('/').at(-1),source=fs.readFileSync('docs/design/legend-hub/moon/'+original);
 for(const dir of [base,'frontend/','dashboard/dist/']){
  const bytes=fs.readFileSync(dir+'assets/moon/'+filename);
  assert(bytes.equals(source),'byte-identical high-resolution Moon '+filename);
  assert.equal(bytes.readUInt32BE(16),1254);assert.equal(bytes.readUInt32BE(20),1254);assert.equal(bytes[25],6,'RGBA original');
  const entry=JSON.parse(fs.readFileSync('frontend/assets.json')).find(a=>a.file==='assets/moon/'+filename);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),entry.sha256);
 }
}
console.log('PASS: eight original 1254px RGBA hero graphics, runtime hashes and all three delivery trees');
