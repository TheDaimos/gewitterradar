import assert from "node:assert/strict";
import {rasterMosaicRenderOrder,drawVerifiedRasterMosaicTile} from "../src/p7-010/raster-compositor.js";
import {RasterTileRequestBudget,drawRasterMosaicTileFromUrls} from "../src/p7-010/raster-mosaic-tile-loader.js";
import {installWeatherRadar} from "../frontend/modules/weather/precipitation-layer.js";
const geo={west:-180,east:180,south:-90,north:90};
const src=(id,cls,kind,method)=>({source_id:id,resource_type:"raster_tile",freshness_class:cls,
 coverage_scope:"global",coverage_verified:true,coverage:geo,
 tile_url:"https://example.invalid/{z}/{x}/{y}/"+id+".png",
 render:{tile_size:256,min_zoom:0,max_zoom:18,opacity:0.6},
 attribution:id,legend:{title:id},semantics:{quantity:"precipitation_rate",unit:"mm/h",observation_kind:kind,measurement_method:method},
 times:{valid_at:"2026-10-19T08:00:00Z",retrieved_at:"2026-10-19T08:00:00Z",reference_delta_seconds:0}});
const dwd=src("dwd","current","observation","precipitation_rate_radar");
const nasa=src("nasa","older_background","estimate","satellite_precipitation_estimate");
for(const input of [[nasa,dwd],[dwd,nasa]])assert.deepEqual(rasterMosaicRenderOrder(input).map(x=>x.source_id),["nasa","dwd"]);
const draws=[],ctx={globalAlpha:1,drawImage:im=>draws.push(im.name)};
drawVerifiedRasterMosaicTile(ctx,{x:0,y:0,z:0},[{...dwd,image:{name:"dwd"}},{...nasa,image:{name:"nasa"}}]);
assert.deepEqual(draws,["nasa","dwd"]);
const out=await drawRasterMosaicTileFromUrls({context:{globalAlpha:1,drawImage:()=>{}},tile:{x:0,y:0,z:0},
 layers:[dwd,nasa],budget:new RasterTileRequestBudget(4,{maxConcurrent:2}),
 timeoutMs:150,loadImage:async()=>{await new Promise(r=>setTimeout(r,30));return {width:256,height:256}}});
assert.deepEqual(out.render_order,["nasa","dwd"]);assert.ok(out.duration_ms>=25);
const hung=await drawRasterMosaicTileFromUrls({context:{globalAlpha:1,drawImage:()=>{}},tile:{x:0,y:0,z:0},
 layers:[dwd],budget:new RasterTileRequestBudget(1),timeoutMs:20,loadImage:()=>new Promise(()=>{})});
assert.equal(hung.drawn.length,0);assert.equal(hung.rejected[0].reason,"image_request_failed");
const listeners=new Map(),windowListeners=new Map();
globalThis.document={visibilityState:"visible",addEventListener:(k,f)=>listeners.set(k,f),removeEventListener:k=>listeners.delete(k)};
globalThis.window={addEventListener:(k,f)=>windowListeners.set(k,f),removeEventListener:k=>windowListeners.delete(k)};
class Card{}installWeatherRadar(Card,{loadLeafletJs:async()=>({})});
const card=new Card(),oldLayer={},scheduled=[];let aborted=0;
card.__weatherRadarState={enabled:true,layer:oldLayer,inFlight:true,v2Generation:2,
 v2PendingLayer:{_p7AbortPending:()=>aborted++},pending:false,pendingForce:false,
 appHiddenAt:0,lastForegroundRefreshAt:0,lastRequestAt:Date.now()};
card._map={invalidateSize:()=>{}};card._weatherRadarEnsureMapHooks=()=>true;card._weatherRadarCullOutsideViewport=()=>false;
card._weatherEngineMonitorEvent=()=>{};card._scheduleWeatherRadarRefresh=(...args)=>scheduled.push(args);
card._weatherRadarAttachAppEvents();
document.visibilityState="hidden";listeners.get("visibilitychange")();
assert.equal(card.__weatherRadarState.layer,oldLayer);assert.equal(card.__weatherRadarState.v2Generation,3);
assert.equal(card.__weatherRadarState.pendingForce,true);assert.equal(aborted,1);
document.visibilityState="visible";listeners.get("visibilitychange")();windowListeners.get("focus")();
assert.equal(scheduled.length,1);assert.equal(scheduled[0][0],"app-foreground");
card._weatherRadarDetachAppEvents();
console.log("GR-RF-03 tile ordering, image timeout and background safety PASS");
