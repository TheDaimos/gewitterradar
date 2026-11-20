import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {installWeatherRouter} from '../frontend/modules/weather/consumer-client.js';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('normal RATE status and refresh use Consumer V2 without a preview request',async()=>{
 class Card{}
 installWeatherRouter(Card,{});
 const card=new Card(),calls=[];
 const state={enabled:false,v2Snapshot:{layers:[{source_id:'opera/opera_rate_raster',
   times:{valid_at:'2024-01-01T00:00:00Z',valid_until:'2024-01-01T00:30:00Z',stale:true}}],
   source_outcomes:[{source_id:'opera/opera_rate_raster',result:'selected'}]}};
 card._weatherRadarState=()=>state;
 card._setWeatherRadarEnabled=async value=>{state.enabled=value;calls.push('enable');};
 card._refreshWeatherRadar=async args=>calls.push(args);
 card._weatherEngineOperaDiagnosticToggle=()=>{throw Error('preview must not be requested');};
 card._weatherEngineDiagnosticRender=()=>{};
 await card._weatherEngineRefreshPrecipitation();
 await card._weatherEngineRefreshPrecipitation();
 assert.equal(calls[0],'enable');
 assert.deepEqual(calls[1],{reason:'regular-consumer-v2-refresh',force:true});
 const status=card._weatherEngineOperaProviderState();
 assert.equal(status.selected,true);
 assert.equal(status.scope,'regular_consumer_v2');
 assert.equal(status.routing_result,'selected');
 assert.equal(status.stale,true);
 assert.equal(status.valid_until,'2024-01-01T00:30:00Z','GR reports WR metadata without imposing a local age test');
});
test('GR precipitation delegates provider choice to WR and does not overlay OPERA',()=>{
 const p=read('frontend/modules/weather/precipitation-layer.js');
 assert.match(p,/this\.__grPrecipitationWantsOpera=state\.enabled/);
 assert.match(p,/if\(this\.__operaDiagnosticEnabled\)this\._weatherEngineOperaDiagnosticToggle/);
 assert.doesNotMatch(p,/this\._weatherEngineOperaDiagnosticToggle\?\.\(\{autoFromPrecipitation:true\}\)/);
});
test('received OPERA remains reported when the hidden raster candidate is rejected',()=>{
 class Card{}
 installWeatherRouter(Card,{});
 const card=new Card();
 const response={layers:[{source_id:'opera/opera_rate_raster',times:{valid_at:'2026-11-05T15:30:00Z'}}],
   source_outcomes:[{source_id:'opera/opera_rate_raster',result:'selected'}]};
 const state={enabled:true,v2Snapshot:{layers:[{source_id:'dwd/radar_precipitation'}]},
   v2ReceivedSnapshot:response,v2OperaTransport:{status:'image_policy_rejected',
     http_status:403,tile_denial_code:'insecure_transport'}};
 card._weatherRadarState=()=>state;
 const status=card._weatherEngineOperaProviderState();
 assert.equal(status.returned_by_wr,true);
 assert.equal(status.selected,false,'received pixels have not yet been mounted');
 assert.equal(status.routing_result,'selected');
 assert.equal(status.tile_http_status,403);
 assert.equal(status.tile_denial_code,'insecure_transport');
 state.v2Snapshot=response;
 state.v2OperaTransport={status:'displayed',http_status:200};
 assert.equal(card._weatherEngineOperaProviderState().selected,true);
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
