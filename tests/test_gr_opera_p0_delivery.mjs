import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
const root=new URL('../',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8');
const copies=['frontend/','custom_components/gewitterradar/frontend/','dashboard/dist/'];
test('OPERA control and event wiring identical in all delivered trees',()=>{
 const texts=copies.map(p=>read(p+'modules/weather/consumer-client.js'));
 assert.equal(texts[0],texts[1]);assert.equal(texts[1],texts[2]);
 for(const item of ['OPERA-Testdarstellung starten','_weatherEngineOperaDiagnosticToggle()',
   "weather-engine-opera-toggle","opera_diagnostic:store.operaDiagnostic","diagnostic_unverified",
   'this.__operaDiagnosticPane.close()'])assert.ok(texts[0].includes(item),item);
});
test('OPERA adapter is delivered and remains isolated',()=>{
 const texts=copies.map(p=>read(p+'modules/weather/p7-010/opera-diagnostic-tile.js'));
 assert.equal(texts[0],texts[1]);assert.equal(texts[1],texts[2]);
 const content=texts[0];
 assert.match(content,/diagnostic:true/);
 assert.match(content,/raster_approved!==false/);
 assert.match(content,/Authorization:"Bearer "\+token/);
 assert.match(content,/URLRef\.revokeObjectURL/);
 assert.doesNotMatch(content,/raster_approved:true/);
});
test('runtime and module manifest match 4.11.107 build in all deliveries',()=>{
 const version=copies.map(p=>read(p+'version.js'));
 const manifests=copies.map(p=>read(p+'module-manifest.js'));
 const runtime=copies.map(p=>JSON.parse(read(p+'assets/gewitterradar-runtime-manifest.json')));
 assert.equal(version[0],version[1]);assert.equal(version[1],version[2]);
 assert.equal(manifests[0],manifests[1]);assert.equal(manifests[1],manifests[2]);
 assert.match(version[0],/4\.11\.107/);assert.match(version[0],/411107r1/);
 for(const m of runtime){
  assert.equal(m.productVersion,'4.11.107');assert.equal(m.moduleSetId,'E411-107A1');
  assert.equal(m.modules.length,34);
  assert.equal(m.modules.find(x=>x.id==='weather.consumer-client')?.version,'1.2.9');
  assert.equal(m.modules.find(x=>x.id==='core.manifest')?.version,'1.2.155');
 }
 assert.match(read('custom_components/gewitterradar/build_info.py'),/BUILD_VERSION = "4\.11\.107"/);
});
