import assert from "node:assert/strict";
import {createRasterMosaicGridLayer}
 from "../src/p7-010/raster-mosaic-grid-layer.js";

const full={west:-180,south:-90,east:180,north:90};
const germany={west:5,south:46,east:16,north:56};
const time="2026-10-14T15:00:00Z";
const layer=(source_id,coverage_scope,coverage)=>({
 source_id,resource_type:"raster_tile",
 coverage_verified:true,coverage_scope,coverage,
 tile_url:"https://example.invalid/wms?bbox={bbox-epsg-3857}&layer="+source_id,
 render:{tile_size:256,min_zoom:0,max_zoom:18,opacity:0.65},
 attribution:source_id,legend:{title:source_id},
 semantics:{quantity:"precipitation_rate",unit:"mm/h",
  observation_kind:"observation",measurement_method:"radar"},
 times:{valid_at:time,retrieved_at:time,reference_delta_seconds:0}
});
const response={
 contract_version:2,capability:"weather.precipitation.layer",
 status:"partial",viewport:{west:-90,south:15,east:8,north:56},
 reference_time:time,
 layers:[layer("wide","global",full),layer("local","bbox",germany)]
};
const FakeLeaflet={GridLayer:{extend(spec){
 return class FakeGridLayer {
   constructor(options){this.options=options;}
   createTile(...args){return spec.createTile.apply(this,args);}
 };
}}};
const painted=[],requests=[],diagnostics=[];
const context={globalAlpha:1,drawImage:(...args)=>painted.push(args)};
const createCanvas=()=>({
 width:0,height:0,
 getContext:kind=>kind==="2d"?context:null
});
const L=createRasterMosaicGridLayer(FakeLeaflet,response,{
 maxTileRequests:2,
 createCanvas,
 loadImage:async (url,src)=>{
   requests.push({url,source:src.source_id});
   return {width:src.render.tile_size};
 },
 onTileDiagnostics:diag=>diagnostics.push(diag)
});
assert.equal(L.options.tileSize,256);
assert.equal(L.options.maxNativeZoom,18,"mosaic canvas must stay visible above provider native z11");
assert.equal(L.options.maxZoom,undefined,"mosaic must not impose a new map maximum zoom");
const tileResult=await new Promise((resolve,reject)=>{
 const tile=L.createTile({x:0,y:0,z:0},(err,canvas)=>
   err?reject(err):resolve(canvas));
 assert.equal(tile.width,256,"synchronous Leaflet Canvas tile must be allocated");
});
assert.equal(tileResult.height,256);
assert.deepEqual(requests.map(x=>x.source),["wide","local"]);
assert.equal(painted.length,2);
assert.ok(painted[1][7]<11,"local WMS only paints its verified area");
assert.equal(diagnostics[0].requests_used,2);
assert.equal(L._p7RasterRequestBudget.used,2);
const afterExhaustion=await new Promise(resolve=>{
  L.createTile({x:1,y:0,z:1},(err,tile)=>resolve({err,tile}));
});
assert.ok(afterExhaustion.err,"budget exhaustion reports tileerror, not a loaded blank image");
assert.ok(afterExhaustion.tile);
assert.equal(requests.length,2,"shared V2 request budget must block further fetches");

const noLocal=createRasterMosaicGridLayer(FakeLeaflet,response,{
 maxTileRequests:2,createCanvas,
 loadImage:async (url,src)=>{
   if(src.source_id==="local")throw Error("Regional WMS offline");
   return {width:256};
 },
 onTileDiagnostics:diag=>diagnostics.push(diag)
});
await new Promise((resolve,reject)=>{
 noLocal.createTile({x:0,y:0,z:0},(err,tile)=>err?reject(err):resolve(tile));
});
assert.deepEqual(diagnostics.at(-1).drawn.map(x=>x.source_id),["wide"],
 "bad regional source must not blank the global foundation");
assert.throws(()=>createRasterMosaicGridLayer(FakeLeaflet,
 {...response,contract_version:1},{createCanvas,loadImage:async()=>({})}));
assert.throws(()=>createRasterMosaicGridLayer(FakeLeaflet,
 {...response,layers:[{...response.layers[0],coverage_verified:false}]},
 {createCanvas,loadImage:async()=>({})}));

const cancelledImages=[];
let signalReady;
const hasStarted=new Promise(resolve=>{signalReady=resolve;});
const cancellable=createRasterMosaicGridLayer(FakeLeaflet,response,{
 createCanvas,
 loadImage:(_url,_src,{signal})=>{
   cancelledImages.push(signal);
   signalReady();
   return new Promise(()=>{});
 }
});
const cancellationFinished=new Promise(resolve=>{
 const tile=cancellable.createTile({x:0,y:0,z:0},(error)=>resolve(error));
 cancellable._testTile=tile;
});
await hasStarted;
cancellable._p7AbortPending();
const cancellationError=await cancellationFinished;
assert.ok(cancellationError,"removed layer must report cancelled pending tile");
assert.ok(cancelledImages.every(signal=>signal.aborted));
assert.equal(cancellable._p7RasterRequestBudget.active,0);
assert.equal(cancellable._p7RasterRequestBudget.closed,true);
assert.equal(await cancellable._p7RasterRequestBudget.reserve(),null,
 "removed raster cannot restart requests");

console.log("P7-010 isolated Leaflet GridLayer V2 contract, budget and fallback PASS");
