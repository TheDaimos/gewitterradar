import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {rasterTileUrl} from "../frontend/modules/weather/p7-010/raster-tile-url.js";

const template="/api/weather_router/opera_tile/RATE/20261104T115500Z/{z}/{x}/{y}.png";

test("WR-authorised internal OPERA URL uses exact XYZ expansion",()=>{
 assert.equal(rasterTileUrl(template,{z:4,x:7,y:5}),
   "/api/weather_router/opera_tile/RATE/20261104T115500Z/4/7/5.png");
 assert.throws(()=>rasterTileUrl("/api/weather_router/opera_tile/RATE/abc/{z}/{x}/{y}.png",{z:4,x:7,y:5}));
 assert.throws(()=>rasterTileUrl("/api/other/{z}/{x}/{y}.png",{z:4,x:7,y:5}));
});

test("GR never treats an arbitrary internal URL as a raster source",()=>{
 const contract=readFileSync(new URL("../frontend/modules/weather/p7-010/raster-mosaic-contract.js",import.meta.url),"utf8");
 assert.match(contract,/source==="opera\/opera_rate_raster"/);
 assert.match(contract,/operaRateURL\(value,source\)/);
});

test("WR OPERA image transport never places a token in the tile URL",()=>{
 const grid=readFileSync(new URL("../frontend/modules/weather/p7-010/raster-mosaic-grid-layer.js",import.meta.url),"utf8");
 assert.match(grid,/getAccessToken/);
 assert.match(grid,/credentials:"omit"/);
 assert.match(grid,/Authorization:"Bearer "/);
 assert.match(grid,/URL\.revokeObjectURL/);
});
