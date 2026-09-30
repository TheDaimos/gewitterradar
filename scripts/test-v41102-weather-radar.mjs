import assert from "node:assert/strict";
import {expandWeatherRasterTileUrl,weatherRasterBbox3857} from "../frontend/modules/weather/precipitation-layer.js";

assert.equal(
  weatherRasterBbox3857({x:0,y:0,z:0}),
  "-20037508.342789,-20037508.342789,20037508.342789,20037508.342789"
);
assert.equal(
  weatherRasterBbox3857({x:1,y:0,z:1}),
  "0,0,20037508.342789,20037508.342789"
);
assert.equal(
  expandWeatherRasterTileUrl("https://tiles.example/{z}/{x}/{y}/{-y}.png",{x:3,y:4,z:5}),
  "https://tiles.example/5/3/4/27.png"
);
const wms=expandWeatherRasterTileUrl(
  "https://example.test/wms?bbox={bbox-epsg-3857}&width=256&height=256",
  {x:1,y:1,z:1}
);
assert.equal(wms,"https://example.test/wms?bbox=0,-20037508.342789,20037508.342789,0&width=256&height=256");

console.log("PASS: V4.11.02 provider-neutral raster adapter expands XYZ and EPSG:3857 BBOX tile templates.");
