import assert from 'node:assert/strict';
import {createWeatherRouterClient,validateWeatherContext,parseWeatherResolution,WEATHER_ROUTER_CAPABILITIES} from '../frontend/modules/weather/consumer-client.js';

const calls=[];
const mock=async request=>{
  calls.push(request);
  if(request.type==='weather_router/consumer/discovery')return {schema:'weather_router.consumer.discovery.v1',contract:{name:'weather_router.consumer',supported_versions:[1],preferred_version:1},router:{ready:true,enabled:true},domains:[{id:'weather',enabled:true}]};
  if(request.type==='weather_router/consumer/capabilities')return {schema:'weather_router.consumer.capabilities.v1',contract_version:1,capabilities:[{id:'weather.radar.precipitation',enabled:true,available:true}],filter_options:{},applied_filter:{}};
  if(request.type==='weather_router/consumer/resolve')return {schema:'weather_router.consumer.resolution.v1',contract_version:1,status:'ready',capability:request.capability,resource:{type:'event_feed',payload:{events:[],event_count:0}},provenance:{mode:'single',provider_id:'mock',provider_name:'Mock',source_class:'observation',attribution:null},routing:{reason_code:'eligible_candidate',fallback_available:false,degraded:false}};
  throw Error('Unexpected WebSocket request');
};
const client=createWeatherRouterClient(mock);
assert.equal((await client.discover()).ready,true);
assert.equal((await client.discover()).ready,true);
assert.equal(calls.filter(x=>x.type.endsWith('/discovery')).length,1,'Discovery must be cached');
assert.equal((await client.capabilities()).capabilities.length,1);
const radarFilter={domains:['weather'],resource_types:['raster_tile'],available_only:true};
assert.equal((await client.capabilities({filter:radarFilter})).capabilities.length,1);
assert.equal(calls.filter(x=>x.type.endsWith('/capabilities')).length,2,'Different capability filters need independent cache entries');
await client.capabilities({filter:radarFilter});
assert.equal(calls.filter(x=>x.type.endsWith('/capabilities')).length,2,'Identical capability filter must reuse its cache entry');
const context={type:'point',latitude:0,longitude:0};
let result=await client.resolve(WEATHER_ROUTER_CAPABILITIES.lightningEvents,context);
assert.equal(result.status,'ready');assert.equal(result.resource.type,'event_feed');assert.equal(result.resource.payload.event_count,0,'Empty observations are not failures');
assert.equal(calls.at(-1).time.mode,'latest');
assert.deepEqual(calls.at(-1).context,context);
assert.equal(Object.hasOwn(calls.at(-1),'provider'),false);
assert.equal(Object.hasOwn(calls.at(-1),'profile_id'),false);
assert.deepEqual(validateWeatherContext({type:'bbox',west:170,east:-170,south:-20,north:20}),{type:'bbox',west:170,east:-170,south:-20,north:20},'Dateline crossing is permitted');
for(const invalid of [null,{}, {type:'point',latitude:91,longitude:0},{type:'point',latitude:0,longitude:0,home:true},{type:'bbox',west:0,east:1,south:5,north:4}]){
  assert.throws(()=>validateWeatherContext(invalid),TypeError);
}
assert.throws(()=>parseWeatherResolution({schema:'weather_router.consumer.resolution.v1',contract_version:1,status:'ready',capability:'weather.lightning.observed.events',resource:{type:'other',payload:{}},provenance:{},routing:{}},'weather.lightning.observed.events'),TypeError);
const unavailable=parseWeatherResolution({schema:'weather_router.consumer.resolution.v1',contract_version:1,status:'unavailable',capability:WEATHER_ROUTER_CAPABILITIES.lightningEvents,unavailable:{code:'outside_coverage',retryable:false,message:'Outside coverage'}},WEATHER_ROUTER_CAPABILITIES.lightningEvents);
assert.equal(unavailable.status,'unavailable');
const missing=createWeatherRouterClient(async()=>{throw Error('unknown_command')});
assert.equal((await missing.discover()).present,false);
assert.equal((await missing.resolve(WEATHER_ROUTER_CAPABILITIES.lightningEvents,context)).status,'unavailable');
const unsupported=createWeatherRouterClient(async()=>({schema:'weather_router.consumer.discovery.v1',contract:{name:'weather_router.consumer',supported_versions:[2]},router:{ready:true,enabled:true},domains:[]}));
assert.equal((await unsupported.discover()).compatible,false);
assert.equal((await unsupported.resolve(WEATHER_ROUTER_CAPABILITIES.lightningEvents,context)).status,'unavailable');
const filtered=createWeatherRouterClient(mock,{profileId:'gewitterradar'});await filtered.discover();await filtered.resolve(WEATHER_ROUTER_CAPABILITIES.lightningEvents,context);
assert.equal(calls.at(-1).profile_id,'gewitterradar');
assert.equal(calls.some(x=>Object.hasOwn(x,'provider')),false,'No provider selection in consumer requests');
console.log('PASS: WeatherRouter Consumer V1 discovery, cache, explicit coordinates, read-only resolves, compatibility and controlled degradation.');
