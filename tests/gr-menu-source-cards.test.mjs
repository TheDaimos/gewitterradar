import test from 'node:test';
import assert from 'node:assert/strict';
import {weatherEngineSourceCards} from '../frontend/modules/weather/consumer-client.js';

const response=(status='ready',unavailable=null)=>({completed_at:'2026-11-09T15:00:00Z',response:{schema:'weather_router.consumer.resolution.v2',status,unavailable},error:null});
test('source cards never assume success before a trustworthy observation',()=>{
  assert.deepEqual(Object.values(weatherEngineSourceCards()).map(x=>x.state),['unknown','unknown']);
  assert.equal(weatherEngineSourceCards({lightningEntityStatus:'missing'}).blitzortung.state,'unknown');
  assert.equal(weatherEngineSourceCards({exchange:{...response(),response:{unexpected:true}}}).weatherRouter.state,'degraded');
});
test('Blitzortung cards distinguish local counter, restricted source and missing integration',()=>{
  const available=weatherEngineSourceCards({lightningEntityStatus:'available'}).blitzortung;
  assert.equal(available.state,'connected');assert.match(available.note,/HA-Blitzzähler/);assert.match(available.note,/kein Nachweis/);
  assert.equal(weatherEngineSourceCards({lightningEntityStatus:'degraded'}).blitzortung.state,'degraded');
  assert.equal(weatherEngineSourceCards({lightning:{status:'missing'}}).blitzortung.state,'unreachable');
  assert.equal(weatherEngineSourceCards({lightning:{status:'unknown',error:'forbidden'}}).blitzortung.state,'unknown');
});
test('router connection status does not decide meteorological availability or age',()=>{
  assert.equal(weatherEngineSourceCards({discovery:{ready:true,present:true,compatible:true,checked_at:'2001-01-01T00:00:00Z'}}).weatherRouter.state,'connected');
  assert.equal(weatherEngineSourceCards({exchange:response('unavailable',{code:'no_valid_source'})}).weatherRouter.state,'connected');
  assert.equal(weatherEngineSourceCards({exchange:response('unavailable',{code:'consumer_unauthorized'})}).weatherRouter.state,'degraded');
  assert.equal(weatherEngineSourceCards({discovery:{present:true,compatible:false}}).weatherRouter.state,'degraded');
  assert.equal(weatherEngineSourceCards({discovery:{present:true,compatible:false,checked_at:'2026-11-09T15:00:00Z'},exchange:response()}).weatherRouter.state,'degraded');
  assert.equal(weatherEngineSourceCards({exchange:{...response(),response:{schema:'weather_router.consumer.discovery.v1',present:true,compatible:true,ready:false}}}).weatherRouter.state,'degraded');
});
test('latest actual transport/discovery observation wins, and HA disconnect is explicit',()=>{
  const failed={...response(),response:null,error:{message:'offline'}};
  assert.equal(weatherEngineSourceCards({discovery:{ready:true,present:true,compatible:true,checked_at:'2026-11-09T14:00:00Z'},exchange:failed}).weatherRouter.state,'unreachable');
  assert.equal(weatherEngineSourceCards({discovery:{ready:true,present:true,compatible:true,checked_at:'2026-11-09T16:00:00Z'},exchange:failed}).weatherRouter.state,'connected');
  assert.deepEqual(Object.values(weatherEngineSourceCards({haConnected:false,lightningEntityStatus:'available',exchange:response()})).map(x=>x.state),['unreachable','unreachable']);
});
