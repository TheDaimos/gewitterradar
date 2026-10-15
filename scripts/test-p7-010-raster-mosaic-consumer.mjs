import assert from "node:assert/strict";
import {buildRasterMosaicV2Request,prepareRasterMosaicV2}
 from "../src/p7-010/raster-mosaic-consumer.js";

const viewport={west:-90,south:15,east:8,north:56};
const focus={latitude:21,longitude:-76};
const request=buildRasterMosaicV2Request({
 viewport,focus,maxLayers:3,maxTileRequests:36
});
assert.equal(request.type,"weather_router/consumer/resolve_mosaic");
assert.equal(request.contract_version,2);
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
const L={GridLayer:{extend:spec=>class Grid{
 constructor(options){this.options=options;}
 createTile(...args){return spec.createTile.apply(this,args);}
}}};
const calls=[];
const active=await prepareRasterMosaicV2({
 callWS:async q=>{calls.push(q);return response;},
 Leaflet:L,viewport,focus,maxTileRequests:4,
 layerOptions:{createCanvas:()=>({width:0,height:0,getContext:()=>({
   globalAlpha:1,drawImage:()=>{}
 })}),loadImage:async ()=>({width:256})}
});
assert.equal(active.mode,"v2");
assert.equal(calls.length,1);
assert.equal(calls[0].limits.max_tile_requests,4);
assert.ok(active.layer._p7RasterRequestBudget);
assert.equal(active.layer._p7RasterRequestBudget.maxRequests,4);
await new Promise((resolve,reject)=>{
 active.layer.createTile({x:0,y:0,z:0},(err,tile)=>
   err?reject(err):resolve(tile));
});
assert.equal(active.layer._p7RasterRequestBudget.used,1);

const failing=await prepareRasterMosaicV2({
 callWS:async()=>{throw Error("V2 unknown endpoint");},
 Leaflet:L,viewport,focus
});
assert.equal(failing.mode,"fallback");
assert.equal(failing.reason,"v2_unavailable_or_invalid");
assert.equal("layer" in failing,false,
 "caller must retain its existing V1 precipitation layer");

const empty=await prepareRasterMosaicV2({
 callWS:async()=>({...response,status:"unavailable",layers:[]}),
 Leaflet:L,viewport,focus
});
assert.equal(empty.mode,"fallback");
assert.equal(empty.reason,"no_usable_mosaic_source");

const wrong=await prepareRasterMosaicV2({
 callWS:async()=>({...response,contract_version:1}),
 Leaflet:L,viewport,focus
});
assert.equal(wrong.mode,"fallback");
console.log("P7-010 opt-in V2 WS to Leaflet bridge and non-destructive V1 fallback PASS");
