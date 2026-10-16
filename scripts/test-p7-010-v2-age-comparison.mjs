import assert from "node:assert/strict";
import {installWeatherRouter} from "../frontend/modules/weather/consumer-client.js";

const viewport={west:-90,south:15,east:9,north:56};
const focus={latitude:21,longitude:-76};
const valid="2026-10-16T09:30:00Z";
const source={
 source_id:"synthetic/precipitation",resource_type:"raster_tile",
 coverage_verified:true,coverage_scope:"global",
 coverage:{west:-180,south:-90,east:180,north:90},
 tile_url:"https://example.invalid/tiles/{z}/{x}/{y}.png",
 render:{tile_size:256,min_zoom:0,max_zoom:18,opacity:0.7},
 attribution:"Synthetic",legend:{title:"Example"},
 semantics:{quantity:"precipitation_rate",unit:"mm/h",
 observation_kind:"observation",measurement_method:"satellite_estimate"},
 times:{valid_at:valid,retrieved_at:valid,reference_delta_seconds:0}
};
const base={
 contract_version:2,capability:"weather.precipitation.layer",
 viewport,reference_time:valid
};
class Card{}
installWeatherRouter(Card);
const card=new Card();
const requests=[];
card._weatherRadarViewport=()=>({context:viewport,focus});
card._weatherEngineDiagnosticRender=()=>{};
card._hass={callWS:async message=>{
 requests.push(message);
 if(message.time.max_data_age_seconds===900)
   return {...base,status:"unavailable",layers:[],
     limitations:["Synthetic image older than fifteen minutes"]};
 return {...base,status:"partial",layers:[source],
   limitations:["Synthetic global image; age must be disclosed"]};
}};
const beforeLayer={kept:true};
card._map={doNotTouch:true};
card._weatherRadarState=()=>({layer:beforeLayer});
const result=await card._weatherEngineV2AgeComparisonTest();
assert.equal(result.schema,"gewitterradar.weather_engine_v2_age_comparison.v1");
assert.equal(result.status,"completed");
assert.equal(result.map_unchanged,true);
assert.equal(result.age_filter_supported,true);
assert.deepEqual(requests.map(q=>q.time.max_data_age_seconds),[900,43200]);
assert.deepEqual(requests.map(q=>q.time.max_time_delta_seconds),[180,180]);
assert.equal(requests.length,2);
assert.notEqual(requests[0].correlation_id,requests[1].correlation_id);
assert.equal(requests[0].contract_version,2);
assert.equal(requests[1].limits.max_layers,12);
assert.equal(requests[1].limits.max_tile_requests,12);
assert.deepEqual(requests.map(q=>q.context),[
 {type:"bbox",...viewport,focus},{type:"bbox",...viewport,focus}
]);
assert.equal(result.requests[0].status,"unavailable");
assert.equal(result.requests[1].status,"partial");
assert.equal(result.requests[1].sources[0].valid_at,valid);
assert.equal(result.requests[1].sources[0].measurement_method,"satellite_estimate");
assert.equal(typeof result.requests[1].sources[0].age_seconds,"number");
assert.equal(card._weatherRadarState().layer,beforeLayer);
const exported=card._weatherEngineDiagnosticPayload();
assert.equal(exported.v2_age_comparison.requests.length,2);
assert.equal(JSON.stringify(exported).includes("example.invalid"),false,
 "comparison export must not contain tile URLs");
assert.equal(JSON.stringify(exported).includes("tile_url"),false);
assert.equal(card.__weatherEngineV2ComparisonRunning,false);

// Both unavailable must NOT be interpreted as proof of an age restriction.
requests.length=0;
card._hass.callWS=async query=>{
 requests.push(query);
 return {...base,status:"unavailable",layers:[],limitations:["Metadata incomplete"]};
};
const inconclusive=await card._weatherEngineV2AgeComparisonTest();
assert.equal(inconclusive.status,"completed");
assert.equal(inconclusive.age_filter_supported,false);
assert.equal(inconclusive.requests.length,2);
assert.match(inconclusive.conclusion,/serverseitige Ablehnungsgründe/);

// Validation errors remain diagnostic, do not modify the map or invoke V1.
card._hass.callWS=async()=>({...base,status:"partial",layers:[{...source,tile_url:"http://invalid"}]});
const invalid=await card._weatherEngineV2AgeComparisonTest();
assert.equal(invalid.status,"completed");
assert.deepEqual(invalid.requests.map(x=>x.status),["error","error"]);
assert.deepEqual(invalid.requests.map(x=>x.error_code),["TypeError","TypeError"]);
assert.equal(card._weatherRadarState().layer,beforeLayer);
assert.equal(card.__weatherEngineV2ComparisonRunning,false);
console.log("P7-010 V2 age comparison: sequential bounded probes, redacted export and non-rendering fallback PASS");
