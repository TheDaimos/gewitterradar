import assert from "node:assert/strict";
import {RasterTileRequestBudget,drawRasterMosaicTileFromUrls}
 from "../src/p7-010/raster-mosaic-tile-loader.js";

const time="2026-10-14T15:00:00Z";
const full={west:-180,south:-90,east:180,north:90};
const germany={west:5,south:46,east:16,north:56};
function source(name,{coverage=full,scope="global",url=null,size=256}={}){
 return {
   source_id:name,resource_type:"raster_tile",
   coverage_verified:true,coverage_scope:scope,coverage,
   tile_url:url||"https://example.invalid/xyz/{z}/{x}/{y}.png",
   render:{tile_size:size,min_zoom:0,max_zoom:18,opacity:0.6},
   times:{valid_at:time,retrieved_at:time,reference_delta_seconds:0},
   semantics:{quantity:"precipitation_rate",unit:"mm/h",
      observation_kind:"observation",measurement_method:"radar"},
   legend:{title:name},attribution:name
 };
}
const tile={x:0,y:0,z:0};
const wms=source("world_wms",{
 url:"https://example.invalid/wms?bbox={bbox-epsg-3857}&layers=global"
});
const local=source("regional_dwd",{
 coverage:germany,scope:"bbox",
 url:"https://example.invalid/wms?bbox={bbox-epsg-3857}&layers=dwd"
});
const observed=[],paint=[];
const budget=new RasterTileRequestBudget(3,{maxConcurrent:2});
const loadImage=async (url,layer)=>{
 observed.push([layer.source_id,url]);
 return {width:layer.render.tile_size};
};
const result=await drawRasterMosaicTileFromUrls({
 context:{globalAlpha:1,drawImage:(...args)=>paint.push(args)},
 tile,layers:[wms,local],loadImage,budget
});
assert.deepEqual(result.drawn.map(x=>x.source_id),["world_wms","regional_dwd"]);
assert.equal(budget.used,2);
assert.ok(observed[0][1].includes("bbox=-20037508.3427892"));
assert.ok(observed[1][1].includes("layers=dwd"));
assert.ok(paint[1][7]<11,"DWD must only paint the German portion");
assert.equal(result.rejected.length,0);

const one=new RasterTileRequestBudget(1);
const drawnWithOne=await drawRasterMosaicTileFromUrls({
 context:{drawImage:()=>{}},tile,layers:[wms,local],loadImage,budget:one
});
assert.deepEqual(drawnWithOne.drawn.map(x=>x.source_id),["world_wms"]);
assert.equal(drawnWithOne.rejected[0].reason,"request_budget_exhausted");
const again=await drawRasterMosaicTileFromUrls({
 context:{drawImage:()=>{}},tile,layers:[wms],loadImage,budget:one
});
assert.equal(again.drawn.length,1,"identical downloaded ancestor can be reused");
assert.equal(one.used,1,"cache hit does not count as another image request");
const uncached=await drawRasterMosaicTileFromUrls({
 context:{drawImage:()=>{}},tile:{x:1,y:0,z:1},layers:[wms],loadImage,budget:one
});
assert.equal(uncached.drawn.length,0,"new source image still obeys budget");
assert.equal(uncached.rejected[0].reason,"request_budget_exhausted");

const failed=await drawRasterMosaicTileFromUrls({
 context:{drawImage:()=>{}},tile,layers:[wms,local],
 loadImage:async (_url,layer)=>{
   if(layer.source_id==="regional_dwd")throw Error("synthetic WMS outage");
   return {width:256};
 },budget:new RasterTileRequestBudget(2)
});
assert.deepEqual(failed.drawn.map(x=>x.source_id),["world_wms"]);
assert.equal(failed.rejected[0].reason,"image_request_failed");

const requestCount=observed.length;
const outside=await drawRasterMosaicTileFromUrls({
 context:{drawImage:()=>{}},tile:{x:0,y:0,z:2},layers:[local],
 loadImage,budget:new RasterTileRequestBudget(3)
});
assert.equal(outside.drawn.length,0);
assert.equal(outside.rejected[0].reason,"outside_tile_coverage");
assert.equal(observed.length,requestCount,"out-of-area providers must not consume network");

// A world source natively ending at zoom 11 must not disappear at zoom 12.
// Per-source overzoom requests the z11 ancestor while fresh DWD keeps z12.
const highZoom={x:2161,y:1371,z:12}; // 10°E, 51°N (German interior)
const olderGlobal=source("satellite_global",{scope:"global"});
olderGlobal.render.max_zoom=11;
olderGlobal.semantics.observation_kind="estimate";
olderGlobal.semantics.measurement_method="satellite_precipitation_estimate";
const detailedRegional=source("regional_dwd_highzoom",{
  scope:"bbox",coverage:germany,
  url:"https://example.invalid/dwd/{z}/{x}/{y}.png"
});
detailedRegional.render.max_zoom=16;
const overzoomUrls=[],overzoomDraws=[];
const overzoom=await drawRasterMosaicTileFromUrls({
 context:{globalAlpha:1,drawImage:(...args)=>overzoomDraws.push(args)},
 tile:highZoom,layers:[olderGlobal,detailedRegional],
 budget:new RasterTileRequestBudget(4),
 loadImage:async (url,layer)=>{
   overzoomUrls.push({url,source:layer.source_id});
   return {width:256,height:256};
 }
});
assert.deepEqual(overzoom.drawn.map(x=>x.source_id),
 ["satellite_global","regional_dwd_highzoom"]);
assert.ok(overzoomUrls[0].url.includes("/11/1080/685.png"),
 "global satellite must request its native z11 ancestor");
assert.ok(overzoomUrls[1].url.includes("/12/2161/1371.png"),
 "regional radar must preserve its independent higher native zoom");
assert.equal(overzoomDraws[0][1],128,"odd display x uses right half of z11 source");
assert.equal(overzoomDraws[0][2],128,"odd display y uses lower half of z11 source");
assert.equal(overzoomDraws[0][3],128,"global native source crop should halve at z12");
assert.equal(overzoomDraws[0][7],256,"global image must cover full output tile");
assert.equal(overzoomDraws[1][3],256,"regional radar stays at full native detail");
// The same contract must remain displayable through the app's z17 range.
const z17={x:Math.floor((10+180)/360*2**17),
  y:Math.floor((1-Math.asinh(Math.tan(51*Math.PI/180))/Math.PI)/2*2**17),z:17};
const z17Loads=[];
const z17Result=await drawRasterMosaicTileFromUrls({
 context:{globalAlpha:1,drawImage:()=>{}},tile:z17,
 layers:[olderGlobal,detailedRegional],budget:new RasterTileRequestBudget(2),
 loadImage:async (url,layer)=>{z17Loads.push({url,source:layer.source_id});return {width:256,height:256};}
});
assert.deepEqual(z17Result.drawn.map(x=>x.source_id),
 ["satellite_global","regional_dwd_highzoom"]);
assert.ok(z17Loads[0].url.includes("/11/"),"z17 global remains native z11");
assert.ok(z17Loads[1].url.includes("/16/"),"z17 DWD remains at own native z16");
assert.equal(z17Result.requests_used,2);

const highZoomOverOcean=await drawRasterMosaicTileFromUrls({
 context:{globalAlpha:1,drawImage:()=>{}},
 tile:{x:1122,y:1766,z:12},
 layers:[olderGlobal,detailedRegional],budget:new RasterTileRequestBudget(2),
 loadImage:async()=>({width:256,height:256})
});
assert.deepEqual(highZoomOverOcean.drawn.map(x=>x.source_id),["satellite_global"],
 "regional coverage cannot leak outside Europe at high zoom");

let active=0,maximum=0;
const parallel=Array.from({length:4},(_,i)=>source("source_"+i));
const limit=new RasterTileRequestBudget(4,{maxConcurrent:2});
const concurrent=await drawRasterMosaicTileFromUrls({
 context:{drawImage:()=>{}},tile,layers:parallel,budget:limit,
 loadImage:async ()=>{
   active++;maximum=Math.max(maximum,active);
   await new Promise(resolve=>setTimeout(resolve,4));
   active--;return {width:256};
 }
});
assert.equal(concurrent.drawn.length,4);
assert.equal(maximum,2);
assert.equal(limit.active,0);

const stallBudget=new RasterTileRequestBudget(1);
const stallSignals=[];
const stalled=await drawRasterMosaicTileFromUrls({
 context:{drawImage:()=>{}},tile,layers:[wms],
 budget:stallBudget,timeoutMs:15,
 loadImage:(_url,_layer,{signal})=>{
   stallSignals.push(signal);
   return new Promise(()=>{}); // simulated permanently hung WMS
 }
});
assert.equal(stallSignals.length,1);
assert.equal(stallSignals[0]?.aborted,true,
 "hanging WMS must receive an abort signal");
assert.equal(stalled.drawn.length,0);
assert.equal(stalled.rejected[0].reason,"image_request_failed");
assert.equal(stallBudget.active,0,"timed-out request must release concurrency slot");
assert.equal(stallBudget.used,1,"network attempt must still count toward budget");
await assert.rejects(drawRasterMosaicTileFromUrls({
 context:{drawImage:()=>{}},tile,layers:[wms],
 budget:new RasterTileRequestBudget(1),timeoutMs:999999,loadImage
}),/Invalid/i);

const wrapped=await drawRasterMosaicTileFromUrls({
 context:{drawImage:()=>{}},tile:{x:2,y:0,z:1},
 layers:[source("xyz")],budget:new RasterTileRequestBudget(1),
 loadImage:async url=>{
   assert.ok(url.includes("/1/0/0.png"),"source request must canonicalize repeated world");
   return {width:256};
 }
});
assert.equal(wrapped.drawn.length,1);

const twelve=Array.from({length:12},(_,i)=>
  source("mosaic_"+i,{scope:i<8?"bbox":"global",
    coverage:i<8?germany:full}));
const globalOnly=[];
const worldMosaic=await drawRasterMosaicTileFromUrls({
 context:{drawImage:()=>{}},tile:{x:0,y:0,z:2},layers:twelve,
 budget:new RasterTileRequestBudget(12),
 loadImage:async (_url,layer)=>{
   globalOnly.push(layer.source_id);return {width:256};
 }
});
assert.equal(globalOnly.length,4,"only covering sources reach the network");
assert.deepEqual(globalOnly,["mosaic_8","mosaic_9","mosaic_10","mosaic_11"]);
assert.equal(worldMosaic.requests_used,4);
const allGlobal=Array.from({length:12},(_,i)=>source("global_"+i));
const localBound=await drawRasterMosaicTileFromUrls({
 context:{drawImage:()=>{}},tile,layers:allGlobal,
 budget:new RasterTileRequestBudget(12),
 loadImage:async ()=>({width:256})
});
assert.equal(localBound.drawn.length,4,"twelve-source snapshot cannot multiply a single tile");
assert.equal(localBound.rejected.filter(x=>x.reason==="tile_source_budget_exhausted").length,8);
assert.equal(localBound.requests_used,4);


const queuedBudget=new RasterTileRequestBudget(2,{maxConcurrent:1});
const firstSlot=await queuedBudget.reserve();
const queuedController=new AbortController();
const queuedRequest=queuedBudget.reserve(queuedController.signal);
await Promise.resolve();
queuedController.abort();
assert.equal(await queuedRequest,null,"aborted waiting tile must not acquire a slot");
assert.equal(queuedBudget.used,1,"cancelled queue entries cannot consume budget");
assert.equal(queuedBudget.queue.length,0,"cancelled tiles must leave the waiting queue");
firstSlot();
assert.equal(queuedBudget.active,0,"release must drain slots after queue cancellation");
const secondSlot=await queuedBudget.reserve();
assert.ok(secondSlot,"unused budget remains available after cancellation");
secondSlot();

const closedBudget=new RasterTileRequestBudget(4,{maxConcurrent:1});
const held=await closedBudget.reserve();
const queuedAfterClose=closedBudget.reserve();
await Promise.resolve();
closedBudget.close();
assert.equal(await queuedAfterClose,null,"closing a snapshot must resolve queued work");
assert.equal(await closedBudget.reserve(),null,"closed snapshot must reject new work");
assert.equal(closedBudget.used,1,"cancelled requests must not inflate tile budget");
held();
assert.equal(closedBudget.active,0,"closing pending work must release the last slot");

const inFlightController=new AbortController();
let launch;
const launched=new Promise(resolve=>{launch=resolve;});
const cancelledDrawing=drawRasterMosaicTileFromUrls({
 context:{drawImage:()=>{throw Error("aborted canvas must never be painted");}},
 tile,layers:[wms],budget:new RasterTileRequestBudget(1),
 signal:inFlightController.signal,
 loadImage:(_url,_layer,{signal})=>{
   launch(signal);
   return new Promise(()=>{});
 }
});
const cancellationSignal=await launched;
inFlightController.abort();
const cancelled=await cancelledDrawing;
assert.equal(cancellationSignal.aborted,true);
assert.equal(cancelled.drawn.length,0);
assert.equal(cancelled.rejected[0].reason,"tile_cancelled");

console.log("P7-010 bounded WMS/XYZ tile loading and fallback PASS");
