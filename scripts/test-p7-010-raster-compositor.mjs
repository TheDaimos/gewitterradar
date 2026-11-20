import assert from "node:assert/strict";
import {drawVerifiedRasterMosaicTile} from "../src/p7-010/raster-compositor.js";

const tile={x:0,y:0,z:0};
const world={west:-180,east:180,south:-90,north:90};
const germany={west:5,east:16,south:46,north:56};
const dateline={west:175,east:-175,south:-15,north:15};
const base={
  source_id:"world_source",resource_type:"raster_tile",image:{},
  coverage:world,coverage_verified:true,coverage_scope:"global",
  attribution:"Welt",semantics:{unit:"mm/h",quantity:"precipitation_rate",
    observation_kind:"observation",measurement_method:"satellite_estimate"},
  times:{valid_at:"2026-10-14T15:00:00Z"},legend:{unit:"mm/h"},
};
const regional={...base,source_id:"regional_source",coverage:germany,
  coverage_scope:"bbox",attribution:"Regional",
  semantics:{...base.semantics,measurement_method:"radar"}};
const draws=[];
const context={drawImage:(...args)=>draws.push(args)};
const result=drawVerifiedRasterMosaicTile(context,tile,[base,regional]);
assert.equal(draws.length,2,"world background and geographic regional overlay");
assert.equal(draws[0][3],256,"base width spans complete tile");
assert.ok(draws[1][3]<11,"regional must be clipped to narrow geographic area");
assert.ok(draws[1][4]<21,"regional must be vertically clipped");
assert.equal(result.drawn.length,2);
assert.equal(result.no_pixel_blending,true);
assert.equal(result.drawn[1].semantics.measurement_method,"radar");
assert.equal(result.drawn[0].semantics.measurement_method,"satellite_estimate");
const invalid=drawVerifiedRasterMosaicTile(context,tile,[{...regional,coverage_verified:false}]);
assert.equal(invalid.drawn.length,0);
assert.equal(invalid.rejected[0].reason,"unverified_or_incomplete_source");
const count=draws.length;
const crossing=drawVerifiedRasterMosaicTile(context,tile,[{...regional,coverage:dateline}]);
assert.equal(crossing.drawn[0].rectangles,2);
assert.equal(draws.length,count+2,"antimeridian draws two separate rectangles");
const native512={...regional,render:{
  tile_size:512,min_zoom:0,max_zoom:15,opacity:0.4
}};
const nativeDraws=[],opacitySeen=[];
const ctxNative={
  globalAlpha:1,
  drawImage:(...args)=>{nativeDraws.push(args);opacitySeen.push(ctxNative.globalAlpha);}
};
const nativeResult=drawVerifiedRasterMosaicTile(ctxNative,tile,[native512],256);
assert.equal(nativeResult.drawn.length,1);
assert.equal(nativeDraws.length,1);
assert.ok(nativeDraws[0][3]>nativeDraws[0][7]*1.99,
 "512 native pixel coordinates must be scaled to 256 output tile");
assert.equal(opacitySeen[0],0.4);
assert.equal(ctxNative.globalAlpha,1,"source alpha must not leak into other providers");
const zoomRejected=drawVerifiedRasterMosaicTile(ctxNative,{x:0,y:0,z:0},[
  {...native512,render:{...native512.render,min_zoom:4}}
]);
assert.equal(zoomRejected.drawn.length,0);
assert.equal(zoomRejected.rejected[0].reason,"outside_zoom_coverage");
assert.throws(()=>drawVerifiedRasterMosaicTile(context,tile,Array(5).fill(base)),RangeError);
assert.throws(()=>drawVerifiedRasterMosaicTile(context,tile,[base],2048),RangeError);
const nothing=drawVerifiedRasterMosaicTile(context,{x:0,y:-1,z:1},[regional]);
assert.equal(nothing.drawn.length,0);
console.log("P7-010 canvas mosaic, regional masks and independent source provenance PASS");
