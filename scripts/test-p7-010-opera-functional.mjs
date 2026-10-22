import assert from "node:assert/strict";
import {test} from "node:test";
import {buildRasterMosaicV2Request,prepareRasterMosaicV2} from "../src/p7-010/raster-mosaic-consumer.js";

const viewport={west:8,south:48,east:12,north:55};
const focus={latitude:51,longitude:10};
const sourceRequest={provider_id:"opera",product_id:"RATE"};
const Leaflet={GridLayer:{extend(){throw Error("OPERA must never construct a raster layer");}}};
const makeReply=(overrides={})=>({
 contract_version:2,capability:"weather.precipitation.layer",
 source_request:{...sourceRequest},provider_id:"opera",product_id:"RATE",
 correlation_id:"opera-test-1",status:"active_blocked",
 block_reason:"opera_raster_not_scientifically_approved",
 raster_approved:false,layers:[],tile_urls:[],fallback_performed:false,
 ...overrides
});
async function probe(reply){
 const requests=[],events=[];
 const result=await prepareRasterMosaicV2({
  callWS:async request=>{requests.push(request);return reply;},
  Leaflet,viewport,focus,sourceRequest,
  correlationId:"opera-test-1",
  onDiagnostic:event=>events.push(event)
 });
 return {result,requests,events};
}
test("OPERA request uses existing bounded V2 WebSocket contract",()=>{
 const r=buildRasterMosaicV2Request({viewport,focus,sourceRequest,correlationId:"opera-test-1"});
 assert.equal(r.type,"weather_router/consumer/resolve_mosaic");
 assert.deepEqual(r.source_request,sourceRequest);
 assert.equal(r.time.max_data_age_seconds,900);
 assert.equal(r.correlation_id,"opera-test-1");
 assert.throws(()=>buildRasterMosaicV2Request({viewport,focus,sourceRequest,maxDataAgeSeconds:901}),TypeError);
});
test("automatic V2 does not set source_request",()=>{
 const r=buildRasterMosaicV2Request({viewport,focus,correlationId:"auto-test"});
 assert.equal(Object.hasOwn(r,"source_request"),false);
 assert.equal(r.type,"weather_router/consumer/resolve_mosaic");
});
test("deactivated OPERA stays non-renderable",async()=>{
 const p=await probe(makeReply({status:"disabled",block_reason:"provider_disabled"}));
 assert.equal(p.result.mode,"opera_blocked");
 assert.equal(p.result.reason,"provider_disabled");
 assert.equal(p.result.rasterApproved,false);
 assert.ok(p.events.some(x=>x.phase==="opera_status"));
});
test("active but unapproved OPERA stays non-renderable",async()=>{
 const p=await probe(makeReply());
 assert.equal(p.result.mode,"opera_blocked");
 assert.equal(p.result.reason,"opera_raster_not_scientifically_approved");
 assert.equal(p.result.fallbackPerformed,false);
});
test("wrong provider or product identity is rejected",async()=>{
 for(const changes of [{provider_id:"dwd"},{product_id:"WRONG"},{source_request:{provider_id:"dwd",product_id:"RATE"}}]){
  const p=await probe(makeReply(changes));
  assert.equal(p.result.mode,"opera_blocked");
  assert.equal(p.result.reason,"opera_identity_mismatch");
 }
});
test("missing or mismatched correlation identity is rejected",async()=>{
 for(const correlation_id of [null,"stale"]){
  const p=await probe(makeReply({correlation_id}));
  assert.equal(p.result.reason,"opera_identity_mismatch");
 }
});
test("unexpected raster approval and nonempty tiles never create a layer",async()=>{
 const p=await probe(makeReply({raster_approved:true,status:"active",layers:[{source_id:"untrusted"}],tile_urls:["https://invalid.example/tile"]}));
 assert.equal(p.result.mode,"opera_blocked");
 assert.equal(p.result.reason,"opera_positive_raster_not_yet_supported");
 assert.equal(p.result.rasterApproved,false);
});
test("unrecognized status is never renderable",async()=>{
 const p=await probe(makeReply({status:"unknown",block_reason:null}));
 assert.equal(p.result.mode,"opera_blocked");
 assert.equal(p.result.reason,"opera_unverified_response");
});
test("WebSocket transport failure remains a safe fallback",async()=>{
 const result=await prepareRasterMosaicV2({
  callWS:async()=>{throw Error("offline");},Leaflet,viewport,focus,sourceRequest,correlationId:"opera-test-1"
 });
 assert.equal(result.mode,"fallback");
 assert.equal(result.reason,"websocket_or_contract");
});
