import assert from 'node:assert/strict';
import {createWeatherRouterClient} from '../frontend/modules/weather/consumer-client.js';

const capability='natural_hazards.volcano.activity';
const options={mode:'events_intersecting_window',class:'long_running_event',
 max_window_days:366,default_max_feed_update_age_seconds:172800,
 max_feed_update_age_seconds:691200,max_ongoing_update_age_seconds:604800,
 max_pages:5,max_results:200,include_ongoing_supported:true};
const recorded=[];
const client=createWeatherRouterClient(async request=>{
 recorded.push(request);
 if(request.type==='weather_router/consumer/discovery')
  return {schema:'weather_router.consumer.discovery.v1',contract:{name:'weather_router.consumer',supported_versions:[1]},
   router:{enabled:true,ready:true},domains:[]};
 if(request.type==='weather_router/consumer/capabilities')
  return {schema:'weather_router.consumer.capabilities.v1',contract_version:1,capabilities:[
    {id:capability,enabled:true,available:true,resource_types:['hazard_feed'],
     time_modes:['latest','events_intersecting_window'],event_time_options:options},
    {id:'no.time.support',enabled:true,available:true,resource_types:['event_feed'],time_modes:['latest']}
   ]};
 if(request.type==='weather_router/consumer/resolve')
  return {schema:'weather_router.consumer.resolution.v1',contract_version:1,
   status:'ready',capability:request.capability,
   resource:{type:'hazard_feed',payload:{events:[{id:'volcano',temporal_status:'ongoing'}],
    event_count:1,event_time_policy:{class:'long_running_event',feed_status:'stale',
    feed_age_seconds:7200,page:request.time.page,page_size:request.time.page_size,
    has_more:true}}},
   provenance:{mode:'single'},routing:{reason_code:'eligible_candidate'}};
 throw Error('unexpected WebSocket command');
});
const context={type:'global'};
const start='2026-10-01T00:00:00+02:00';
const end='2026-10-16T12:00:00Z';
let response=await client.resolveEventWindow(capability,context,{
 start,end,includeOngoing:true,maxFeedUpdateAgeSeconds:86400,
 page:2,pageSize:100,correlationId:'gr-event-p7-1'});
assert.equal(response.status,'ready');
assert.equal(response.resource.payload.event_time_policy.feed_status,'stale');
assert.equal(response.resource.payload.events[0].temporal_status,'ongoing');
const request=recorded.find(x=>x.type==='weather_router/consumer/resolve');
assert.equal(request.contract_version,1);
assert.equal(request.time.mode,'events_intersecting_window');
assert.equal(request.time.window.start,'2026-09-30T22:00:00.000Z');
assert.equal(request.time.page,2);
assert.equal(request.time.page_size,100);
assert.equal(request.time.include_ongoing,true);
assert.equal(response.resource.payload.event_time_policy.has_more,true);
assert.equal(request.time.max_feed_update_age_seconds,86400);
assert.equal(request.correlation_id,'gr-event-p7-1');
assert.equal(Object.hasOwn(request,'provider'),false);
assert.equal((await client.resolveEventWindow('no.time.support',context,{start,end})).status,'unavailable');
for(const invalid of [
 {start:'2026-10-16T12:00:00',end},
 {start,end,page:6},
 {start,end,pageSize:201},
 {start,end,page:false},
 {start,end,maxFeedUpdateAgeSeconds:900000},
 {start,end,includeOngoing:'yes'}
])await assert.rejects(()=>client.resolveEventWindow(capability,context,invalid),TypeError);
assert.equal(recorded.filter(x=>x.type==='weather_router/consumer/resolve').length,1,
 'invalid or unadvertised event ranges must not contact providers');
console.log('P7-010 bounded V1 event-window contract PASS');
