import assert from "node:assert/strict";
import {createRasterMosaicGridLayer,expectedRasterTileGeometry,classifyRasterTileResult}
  from "../src/p7-010/raster-mosaic-grid-layer.js";
import {measureRasterViewportCoverage} from "../src/p7-010/raster-mosaic-coverage.js";
import {installWeatherRadar,decideV1TileStage,weatherRadarActiveCoverage}
  from "../frontend/modules/weather/precipitation-layer.js";
import {readFile} from "node:fs/promises";

// GR-RF-01-01/02/03/04/15: a verified DWD region is valid at zoom 5, 7,
// and high display zooms, but it must never claim the surrounding world.
const full={west:-180,east:180,south:-90,north:90};
const dwd={west:5,east:16,south:46,north:56};
const viewportWide={west:-10,east:25,south:35,north:65};
const layer=(source_id,scope,coverage)=>({
  source_id,resource_type:"raster_tile",coverage_scope:scope,
  coverage_verified:true,coverage,
  tile_url:"https://example.invalid/wms?layer="+source_id+"&bbox={bbox-epsg-3857}",
  render:{tile_size:256,min_zoom:0,max_zoom:11,opacity:0.58},
  attribution:source_id,legend:{title:source_id},
  semantics:{quantity:"precipitation_rate",unit:"mm/h",
    observation_kind:"observation",measurement_method:"radar"},
  times:{valid_at:"2026-10-18T12:00:00Z",retrieved_at:"2026-10-18T12:00:00Z",
    reference_delta_seconds:0,age_seconds:0}
});
const regional=layer("dwd/radar_precipitation","bbox",dwd);
const foundation=layer("nasa_gibs/satellite_precipitation_imerg_30min","bbox",full);
for(const zoom of [5,7,10,11,12,13,15,17]){
 const cover=measureRasterViewportCoverage([regional],viewportWide,zoom);
 assert.ok(cover.fraction>0&&cover.fraction<1,"regional DWD stays partial at "+zoom);
 assert.equal(cover.complete,false);
 assert.equal(measureRasterViewportCoverage([foundation],viewportWide,zoom).complete,true);
}
const selected={x:16,y:10,z:5}; // tile intersects the verified DWD region
const outside={x:0,y:10,z:5};
const part=expectedRasterTileGeometry([regional],selected);
assert.ok(part.fraction>0&&part.fraction<1,"DWD edge must be pixel-masked");
assert.equal(expectedRasterTileGeometry([regional],outside).fraction,0);
assert.equal(classifyRasterTileResult([regional],outside,256,{drawn:[]}).tile_status,"expected_transparent");
assert.equal(classifyRasterTileResult([regional],selected,256,{drawn:[]}).tile_status,"image_load_failed");
assert.equal(classifyRasterTileResult([regional],selected,256,{
 drawn:[{source_id:regional.source_id}],tile_coverage:{fraction:part.fraction}
}).tile_status,"complete_verified_coverage");

// GR-RF-01-05/06: outside-coverage tiles are expected transparent, while
// failed image requests INSIDE the envelope keep a real error.
const draws=[],diagnostics=[],requests=[];
const L={GridLayer:{extend(spec){return class FakeGrid {
 constructor(options){this.options=options;}
 createTile(...args){return spec.createTile.apply(this,args);}
 on(){return this;}
 };}}};
const make=loadImage=>createRasterMosaicGridLayer(L,{
 contract_version:2,capability:"weather.precipitation.layer",
 status:"partial",viewport:viewportWide,
 reference_time:"2026-10-18T12:00:00Z",layers:[regional]
},{
 maxTileRequests:12,
 createCanvas:()=>({width:0,height:0,getContext:()=>({
   globalAlpha:1,drawImage:(...args)=>draws.push(args)
 })}),
 loadImage,
 onTileDiagnostics:e=>diagnostics.push(e)
});
const show=(layer,coords)=>new Promise(resolve=>{
 layer.createTile(coords,(error,canvas)=>resolve({error,canvas}));
});
const tileLayer=make(async(url,source)=>{requests.push({url,id:source.source_id});return {width:256};});
const empty=await show(tileLayer,outside);
assert.equal(empty.error,null);
assert.equal(requests.length,0,"outside-of-envelope tiles must not fetch WMS images");
assert.equal(diagnostics.at(-1).tile_status,"expected_transparent");
const inside=await show(tileLayer,selected);
assert.equal(inside.error,null);
assert.equal(requests.length,1);
assert.equal(diagnostics.at(-1).tile_status,"complete_verified_coverage");
assert.ok(draws.length>0,"only verified in-envelope canvas crops may be drawn");
const offline=make(async()=>{throw new Error("network down");});
const broken=await show(offline,selected);
assert.ok(broken.error,"real network failures are never relabeled as transparent");
assert.equal(diagnostics.at(-1).tile_status,"image_load_failed");
assert.equal((await show(offline,outside)).error,null);

// GR-RF-01-07/08/09: never accept an all-blank stage; one verifiable
// broken tile is tolerable when 14/15 or 19/20 raster tiles are painted.
assert.deepEqual([decideV1TileStage({loaded:14,failed:1}).accepted,
 decideV1TileStage({loaded:14,failed:1}).partial],[true,true]);
assert.equal(decideV1TileStage({loaded:19,failed:1}).accepted,true);
assert.equal(decideV1TileStage({loaded:14,failed:2}).accepted,false);
assert.equal(decideV1TileStage({loaded:0,failed:1,expected_empty:19}).accepted,false);
assert.equal(decideV1TileStage({loaded:0,failed:0,expected_empty:20}).accepted,false);
assert.equal(decideV1TileStage({loaded:15,failed:0}).partial,false);

// GR-RF-01-10/11/12: old regional sources cannot migrate to Cuba or
// bypass 900-second radar freshness or explicit older satellite consent.
const cuba={west:-82,east:-75,south:19,north:24};
const now=Date.now();
const oldDwd={
 layer:{},v2SnapshotAt:now,allowOlderSatelliteBackground:false,
 v2Snapshot:{layers:[{...regional,times:{age_seconds:110}}]}
};
assert.equal(weatherRadarActiveCoverage(oldDwd,cuba,5,now).fraction,0);
assert.ok(weatherRadarActiveCoverage(oldDwd,viewportWide,5,now).fraction>0);
oldDwd.v2Snapshot.layers[0].times.age_seconds=1000;
assert.equal(weatherRadarActiveCoverage(oldDwd,viewportWide,5,now).fraction,0);
const oldSatellite={
 layer:{},v2SnapshotAt:now,allowOlderSatelliteBackground:false,
 v2Snapshot:{layers:[{...foundation,times:{age_seconds:25500},
 freshness_class:"older_background"}]}
};
assert.equal(weatherRadarActiveCoverage(oldSatellite,cuba,5,now).fraction,0);
oldSatellite.allowOlderSatelliteBackground=true;
assert.equal(weatherRadarActiveCoverage(oldSatellite,cuba,5,now).fraction,1);

// GR-RF-01-05/06/13: use the real V1 tile factory and simulate browser images.
class Card {}
installWeatherRadar(Card,{loadLeafletJs:async()=>({})});
const card=new Card(),observed=[];
card._map={getPane:()=>({style:{}})};
card.__weatherRadarState={preloadCache:new Map()};
card._weatherEngineMonitorEvent=(name,detail)=>observed.push({name,detail});
card._weatherRadarUpdatePreloadControls=()=>{};
card._weatherDisplayApplyRasterStyle=()=>{};
let failImage=false,drawnV1=[];
const previousDocument=globalThis.document;
globalThis.document={createElement:kind=>{
 if(kind==="canvas")return {style:{},width:0,height:0,getContext:()=>({
   drawImage:(...args)=>drawnV1.push(args)})};
 const img={style:{},setAttribute(){}};
 Object.defineProperty(img,"src",{set(){queueMicrotask(()=>{
    if(failImage)img.onerror?.();else img.onload?.();
 })}});
 return img;
}};
try{
 const fakeL={gridLayer:options=>({options})};
 const v1=card._weatherRadarCreateLayer(fakeL,{tile_size:256,min_zoom:0,max_zoom:11,
 tile_url:"https://example.invalid/wms?bbox={bbox-epsg-3857}"},"DWD",0.58,
 {scope:"bbox",bbox:dwd,verified:true});
 const blank=await new Promise(resolve=>v1.createTile(outside,(error,tile)=>resolve({error,tile})));
 assert.equal(blank.error,null);
 assert.equal(v1.__grRadarTileMetrics.expected_empty,1);
 const painted=await new Promise(resolve=>v1.createTile(selected,(error,tile)=>resolve({error,tile})));
 assert.equal(painted.error,null);
 assert.equal(v1.__grRadarTileMetrics.loaded,1);
 assert.ok(drawnV1.length>0);
 failImage=true;
 const failed=await new Promise(resolve=>v1.createTile(selected,(error,tile)=>resolve({error,tile})));
 assert.ok(failed.error);
 assert.equal(v1.__grRadarTileMetrics.failed,1);
 assert.ok(observed.some(e=>e.name==="v1_tile_error"
   &&e.detail.reason==="image_load_failed_unclassified"));
 assert.equal(v1.__grRadarTileMetrics.tile_errors.length,1);
 assert.ok(!v1.__grRadarTileMetrics.tile_errors[0].url,
   "private WMS URLs must never enter the diagnostics");
}finally{if(previousDocument===undefined)delete globalThis.document;
 else globalThis.document=previousDocument;}

// GR-RF-01-14/16: no additional requests are created by mere
// geographic checks. Both delivery mirrors must match exactly.
for(const path of ["modules/weather/precipitation-layer.js",
 "modules/weather/p7-010/raster-mosaic-grid-layer.js"]){
 const files=await Promise.all(["frontend","dashboard/dist",
  "custom_components/gewitterradar/frontend"].map(root=>readFile(root+"/"+path)));
 assert.ok(files.every(x=>x.equals(files[0])),"frontend mirror differs: "+path);
}
console.log("PASS: GR-RF-01 regional partial mask, true tile errors, V1 limited tolerance, zoom, UTC/consent and mirrors");
