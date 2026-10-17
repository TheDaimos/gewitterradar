import assert from "node:assert/strict";
import {buildRasterMosaicV2Request,prepareRasterMosaicV2}
 from "../src/p7-010/raster-mosaic-consumer.js";
import {validateRasterMosaicV2} from "../src/p7-010/raster-mosaic-contract.js";

const viewport={west:-90,south:15,east:8,north:56};
const focus={latitude:21,longitude:-76};
const request=buildRasterMosaicV2Request({
 viewport,focus,maxLayers:3,maxTileRequests:36
});
assert.equal(request.type,"weather_router/consumer/resolve_mosaic");
assert.equal(request.contract_version,2);
assert.equal(request.consumer_id,"gewitterradar");
assert.equal(buildRasterMosaicV2Request({viewport,focus,correlationId:"gr-p7-test"}).correlation_id,"gr-p7-test");
assert.equal(request.context.focus.longitude,-76);
assert.equal(request.limits.max_tile_requests,36);
assert.equal("preferred_provider" in request,false);
assert.equal("profile_id" in request,false);
assert.equal(buildRasterMosaicV2Request({
 viewport,focus,profileId:"gewitterradar"
}).profile_id,"gewitterradar");
assert.throws(()=>buildRasterMosaicV2Request({
 viewport:{...viewport,west:1000},focus
}));
assert.throws(()=>buildRasterMosaicV2Request({
 viewport,focus,maxTileRequests:9999
}));
assert.equal(buildRasterMosaicV2Request({
 viewport:{west:-180,south:-80,east:180,north:80},focus
}).context.east,180);
assert.equal(buildRasterMosaicV2Request({
 viewport:{west:170,south:-20,east:-170,north:20},focus
}).context.west,170);

const time="2026-10-14T15:00:00Z";
const source={
 source_id:"synthetic_global",resource_type:"raster_tile",
 coverage_verified:true,coverage_scope:"global",
 coverage:{west:-180,south:-90,east:180,north:90},
 tile_url:"https://example.invalid/tiles/{z}/{x}/{y}.png",
 render:{tile_size:256,min_zoom:0,max_zoom:18,opacity:0.7},
 attribution:"Public provider",legend:{title:"Rain"},
 times:{valid_at:time,retrieved_at:time,reference_delta_seconds:0},
 semantics:{quantity:"precipitation_rate",unit:"mm/h",
   observation_kind:"observation",measurement_method:"satellite_estimate"}
};
const response={
 contract_version:2,capability:"weather.precipitation.layer",
 status:"partial",viewport,reference_time:time,layers:[source]
};
// All offset-aware provider instants must describe one absolute UTC instant.
// They must not be shifted by the weather map's geographic center.
const utc="2026-10-16T12:00:00Z";
const germany="2026-10-16T14:00:00+02:00";
const honduras="2026-10-16T06:00:00-06:00";
assert.equal(Date.parse(utc),Date.parse(germany));
assert.equal(Date.parse(utc),Date.parse(honduras));
const timezoneResponse={...response,reference_time:germany,layers:[
 {...source,times:{...source.times,valid_at:honduras,retrieved_at:germany}}
]};
assert.equal(validateRasterMosaicV2(timezoneResponse,{maxLayers:12}),timezoneResponse);
assert.equal(Date.parse(timezoneResponse.layers[0].times.valid_at),
 Date.parse(timezoneResponse.reference_time));
assert.throws(()=>validateRasterMosaicV2({...timezoneResponse,layers:[
 {...source,times:{...source.times,valid_at:"2026-10-16T14:00:00"}}
]},{maxLayers:12}),TypeError,"V2 must not silently assume timezone for naive data");
assert.throws(()=>validateRasterMosaicV2({...timezoneResponse,reference_time:"2026-10-16T14:00:00"},
 {maxLayers:12}),TypeError,"V2 reference time requires an offset");

const L={GridLayer:{extend:spec=>class Grid{
 constructor(options){this.options=options;}
 createTile(...args){return spec.createTile.apply(this,args);}
}}};
const calls=[];
const v2Phases=[];
const active=await prepareRasterMosaicV2({
 callWS:async q=>{calls.push(q);return response;},
 onDiagnostic:item=>v2Phases.push(item.phase),
 Leaflet:L,viewport,focus,maxTileRequests:4,
 layerOptions:{createCanvas:()=>({width:0,height:0,getContext:()=>({
   globalAlpha:1,drawImage:()=>{}
 })}),loadImage:async ()=>({width:256})}
});
assert.equal(active.mode,"v2");
assert.deepEqual(v2Phases,["request","response","validated","layer_prepared"]);
assert.equal(calls.length,1);
assert.equal(calls[0].limits.max_tile_requests,4);
assert.ok(active.layer._p7RasterRequestBudget);
assert.equal(active.layer._p7RasterRequestBudget.maxRequests,4);
await new Promise((resolve,reject)=>{
 active.layer.createTile({x:0,y:0,z:0},(err,tile)=>
   err?reject(err):resolve(tile));
});
assert.equal(active.layer._p7RasterRequestBudget.used,1);

// WR V0.10.152: older NASA satellite is opt-in; fresh regional DWD stays separate.
const olderGlobal={...source,
 source_id:"nasa_gibs/satellite_precipitation_imerg_30min",
 semantics:{...source.semantics,observation_kind:"estimate",
 measurement_method:"satellite_precipitation_estimate"},
 freshness_class:"older_background",quality_note:"older_satellite_background",
 times:{...source.times,age_seconds:24000,reference_delta_seconds:24000,observed_at:null}
};
const freshRegional={...source,source_id:"dwd/radar",
 coverage_scope:"bbox",coverage:{west:5,south:47,east:16,north:56},
 freshness_class:"current",quality_note:"zeitlich_passend",
 times:{...source.times,age_seconds:180,reference_delta_seconds:0},
 semantics:{...source.semantics,observation_kind:"observation",measurement_method:"radar"}
};
const combined={...response,layers:[olderGlobal,freshRegional],status:"partial"};
const opts={
 callWS:async()=>combined,Leaflet:L,viewport,focus,
 maxLayers:12,maxTileRequests:12,maxDataAgeSeconds:900,maxBackgroundAgeSeconds:43200,
 layerOptions:{createCanvas:()=>({width:0,height:0,getContext:()=>({
  globalAlpha:1,drawImage:()=>{}
 })}),loadImage:async()=>({width:256})}
};
const mixed=await prepareRasterMosaicV2(opts);
assert.equal(mixed.mode,"v2","older global background and fresh regional overlay may be prepared");
assert.deepEqual(mixed.response.layers.map(x=>x.source_id),
 ["nasa_gibs/satellite_precipitation_imerg_30min","dwd/radar"]);
await new Promise((resolve,reject)=>mixed.layer.createTile(
 {x:8,y:5,z:4},(err,tile)=>err?reject(err):resolve(tile)));
assert.equal(mixed.layer._p7RasterRequestBudget.used,2,
 "one Germany tile needs the broad satellite and verified regional radar");
// WR V0.10.155: a verified product-specific NASA world BBOX, not
// coverage_scope="global", is the valid older background on the wire.
const olderBbox={...olderGlobal,coverage_scope:"bbox",coverage:{
 west:-180,east:180,south:-90,north:90
}};
const combinedBbox={...combined,layers:[olderBbox,freshRegional]};
const bboxResult=await prepareRasterMosaicV2({...opts,callWS:async()=>combinedBbox});
assert.equal(bboxResult.mode,"v2","verified full-world BBOX must survive GR validation and staging");
assert.equal(bboxResult.response.layers[0].coverage_scope,"bbox");
assert.deepEqual(bboxResult.response.layers.map(x=>x.source_id),[
 "nasa_gibs/satellite_precipitation_imerg_30min","dwd/radar"
]);
await new Promise((resolve,reject)=>bboxResult.layer.createTile(
 {x:8,y:5,z:4},(err,tile)=>err?reject(err):resolve(tile)));
assert.equal(bboxResult.layer._p7RasterRequestBudget.used,2,
 "NASA world BBOX and current regional DWD contribute to same tile");
const bboxWithoutOptIn=await prepareRasterMosaicV2({
 ...opts,maxBackgroundAgeSeconds:null,callWS:async()=>combinedBbox});
assert.equal(bboxWithoutOptIn.mode,"fallback");
const bboxUnverified=await prepareRasterMosaicV2({
 ...opts,callWS:async()=>({...combinedBbox,layers:[
  {...olderBbox,coverage_verified:false},freshRegional
 ]})});
assert.equal(bboxUnverified.mode,"fallback");
const bboxRegional=await prepareRasterMosaicV2({
 ...opts,callWS:async()=>({...combinedBbox,layers:[
  {...olderBbox,coverage:{west:5,east:16,south:46,north:56}},freshRegional
 ]})});
assert.equal(bboxRegional.mode,"fallback");
assert.equal((await prepareRasterMosaicV2({...opts,maxBackgroundAgeSeconds:null})).mode,"fallback");
assert.equal(buildRasterMosaicV2Request({
 viewport,focus,maxDataAgeSeconds:900,maxBackgroundAgeSeconds:43200
}).time.max_background_age_seconds,43200);
assert.throws(()=>buildRasterMosaicV2Request({
 viewport,focus,maxDataAgeSeconds:900,maxBackgroundAgeSeconds:800
}),TypeError);

const failing=await prepareRasterMosaicV2({
 callWS:async()=>{throw Error("V2 unknown endpoint");},
 Leaflet:L,viewport,focus
});
assert.equal(failing.mode,"fallback");
assert.equal(failing.reason,"websocket_or_contract");
assert.equal(failing.errorCode,"Error");
assert.equal("layer" in failing,false,
 "caller must retain its existing V1 precipitation layer");

const emptyEvents=[];
const empty=await prepareRasterMosaicV2({
 callWS:async()=>({...response,status:"unavailable",layers:[],limitations:["Keine frischen Daten", "Coverage ungeprüft"]}),
 onDiagnostic:event=>emptyEvents.push(event),
 Leaflet:L,viewport,focus
});
assert.deepEqual(emptyEvents.find(event=>event.phase==="validated")?.limitations,["Keine frischen Daten","Coverage ungeprüft"]);
assert.equal(emptyEvents.find(event=>event.phase==="validated")?.limitations_count,2);
assert.equal(empty.mode,"fallback");
assert.equal(empty.reason,"no_usable_mosaic_source");

const wrong=await prepareRasterMosaicV2({
 callWS:async()=>({...response,contract_version:1}),
 Leaflet:L,viewport,focus
});
assert.equal(wrong.mode,"fallback");
assert.equal(wrong.reason,"validation_or_render");
const renderedFail=await prepareRasterMosaicV2({
 callWS:async()=>response,Leaflet:{GridLayer:{extend:()=>{throw new TypeError("grid failure");}}},viewport,focus
});
assert.equal(renderedFail.mode,"fallback");
assert.equal(renderedFail.reason,"layer_preparation_failed");
console.log("P7-010 opt-in V2 WS to Leaflet bridge and non-destructive V1 fallback PASS");
