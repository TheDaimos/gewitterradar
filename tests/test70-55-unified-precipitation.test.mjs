import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
test('GR precipitation delegates provider choice to WR and does not overlay OPERA',()=>{
 const p=read('frontend/modules/weather/precipitation-layer.js');
 assert.match(p,/this\.__grPrecipitationWantsOpera=state\.enabled/);
 assert.match(p,/if\(this\.__operaDiagnosticEnabled\)this\._weatherEngineOperaDiagnosticToggle/);
 assert.match(p,/this\._weatherEngineOperaDiagnosticToggle\?\.\(\{autoFromPrecipitation:true\}\)/);
});
test('GR ignores auto preview after precipitation is turned off',()=>{
 const c=read('frontend/modules/weather/consumer-client.js');
 assert.match(c,/autoFromPrecipitation&&!this\.__grPrecipitationWantsOpera/);
 assert.match(c,/pane\.close\("precipitation_disabled_during_request"\)/);
});
test('All shipped GR source copies match',()=>{
 for(const name of ['precipitation-layer.js','consumer-client.js']){
  const original=read('frontend/modules/weather/'+name);
  assert.equal(read('custom_components/gewitterradar/frontend/modules/weather/'+name),original);
  assert.equal(read('dashboard/dist/modules/weather/'+name),original);
 }
});
