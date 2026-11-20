import assert from "node:assert/strict";
import {canonicalRasterTile,epsg3857TileBounds,rasterTileUrl}
 from "../src/p7-010/raster-tile-url.js";

const M=20037508.342789244;
const bbox=epsg3857TileBounds({x:0,y:0,z:0});
assert.ok(Math.abs(bbox.west+M)<.001);
assert.ok(Math.abs(bbox.south+M)<.001);
assert.ok(Math.abs(bbox.east-M)<.001);
assert.ok(Math.abs(bbox.north-M)<.001);

const wms="https://example.invalid/wms?service=WMS&version=1.1.1&bbox={bbox-epsg-3857}&layers=rain";
const first=rasterTileUrl(wms,{x:0,y:0,z:1});
assert.ok(first.includes("bbox=-20037508.3427892,0,0,20037508.3427892"));
assert.ok(first.includes("service=WMS"));
assert.equal(first,rasterTileUrl(wms,{x:2,y:0,z:1}),
 "wrapped world must request the canonical WMS tile");

const xyz="https://example.invalid/radar/256/{z}/{x}/{y}/2/1_1.png";
assert.equal(rasterTileUrl(xyz,{x:3,y:1,z:1}),
 "https://example.invalid/radar/256/1/1/1/2/1_1.png");
assert.deepEqual(canonicalRasterTile({x:-1,y:0,z:1}),{x:1,y:0,z:1});

const antiLeft=rasterTileUrl(wms,{x:3,y:1,z:2});
const antiRight=rasterTileUrl(wms,{x:0,y:1,z:2});
assert.notEqual(antiLeft,antiRight,"antimeridian neighbors retain separate tiles");
assert.throws(()=>rasterTileUrl("http://insecure.invalid/{z}/{x}/{y}",{x:0,y:0,z:0}));
assert.throws(()=>rasterTileUrl("https://example.invalid/{bad}",{x:0,y:0,z:0}));
assert.throws(()=>rasterTileUrl("https://example.invalid/{z}/{x}",{x:0,y:0,z:0}));
assert.throws(()=>rasterTileUrl(wms,{x:0,y:-1,z:1}),RangeError);
assert.throws(()=>rasterTileUrl(wms,{x:0,y:0,z:19}),TypeError);
console.log("P7-010 WMS EPSG3857 and XYZ raster tile template expansion PASS");
