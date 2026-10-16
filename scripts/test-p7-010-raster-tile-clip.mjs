import assert from "node:assert/strict";
import {rasterTileCropRectangles,rasterTilePixelCrops}
 from "../src/p7-010/raster-tile-clip.js";

const global={scope:"global",verified:true};
const germany={scope:"bbox",verified:true,
  bbox:{west:5,east:16,south:46,north:56}};
const dateline={scope:"bbox",verified:true,
  bbox:{west:175,east:-175,south:-15,north:15}};
const rootTile={x:0,y:0,z:0};
const world=rasterTileCropRectangles(rootTile,global);
assert.deepEqual(world,[{left:0,top:0,width:1,height:1}]);
const regional=rasterTileCropRectangles(rootTile,germany);
assert.equal(regional.length,1);
assert.ok(regional[0].width<0.04,"Germany must not paint the full world tile");
assert.ok(regional[0].left>.5&&regional[0].left<.6);
assert.ok(regional[0].height<.08);
const crossing=rasterTileCropRectangles(rootTile,dateline);
assert.equal(crossing.length,2,"dateline region crops into two separated edges");
assert.ok(crossing.some(r=>r.left<.02));
assert.ok(crossing.some(r=>r.left>.98));
assert.ok(rasterTileCropRectangles({x:4,y:0,z:0},dateline).length===2,
  "wrapped world must preserve split masks");
assert.deepEqual(rasterTileCropRectangles(rootTile,{...germany,verified:false}),[],
  "unverified coverage may never paint pixels");
assert.deepEqual(rasterTileCropRectangles(rootTile,{scope:"global"}),[],
  "unverified global scope may never paint pixels");
const pixels=rasterTilePixelCrops(rootTile,germany,256);
assert.ok(pixels[0].sw<11,"only a local horizontal part may be painted");
assert.ok(pixels[0].sh<21);
assert.deepEqual(rasterTileCropRectangles({x:0,y:-1,z:1},global),[]);
assert.deepEqual(rasterTileCropRectangles({x:0,y:0,z:19},global),[]);
const nonoverlap={scope:"bbox",verified:true,
  bbox:{west:30,east:50,south:-10,north:10}};
assert.deepEqual(rasterTileCropRectangles({x:0,y:0,z:2},nonoverlap),[]);
console.log("P7-010 antimeridian-safe geographic tile cropping PASS");
