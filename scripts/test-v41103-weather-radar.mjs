import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {
  expandWeatherRasterTileUrl,
  weatherRasterBbox3857,
  weatherRadarPreloadPolicy,
  weatherRadarPreloadTilePlan,
  WEATHER_RADAR_PRELOAD_PROFILES
} from "../frontend/modules/weather/precipitation-layer.js";

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

assert.deepEqual(Object.keys(WEATHER_RADAR_PRELOAD_PROFILES),["off","small","normal","large","custom"]);

const normal=weatherRadarPreloadPolicy("normal",30,256);
assert.equal(normal.percent,30);
assert.equal(normal.maxTiles,48);
assert.equal(normal.maxBytes,16*1024*1024);
assert.equal(normal.bytesPerTile,256*256*4);
assert.equal(normal.areaFactor,2.56);

const custom512=weatherRadarPreloadPolicy("custom",100,512);
assert.equal(custom512.percent,100);
assert.equal(custom512.maxTiles,40);
assert.equal(custom512.areaFactor,9);

const plan=weatherRadarPreloadTilePlan({
  minX:256,minY:256,maxX:768,maxY:768,z:3,tileSize:256
},normal);
assert.equal(plan.visibleCount,4);
assert.equal(plan.availableExtra,12);
assert.equal(plan.selectedExtra,12);
assert.equal(plan.tiles.length,12);

const capped=weatherRadarPreloadTilePlan({
  minX:0,minY:0,maxX:2048,maxY:2048,z:5,tileSize:512
},custom512);
assert.equal(capped.tiles.length,40);
assert.equal(capped.selectedExtra,40);

const source=await readFile(new URL("../frontend/modules/weather/precipitation-layer.js",import.meta.url),"utf8");
assert.match(source,/requirements:\{resource_types:\["raster_tile"\]\}/);
assert.doesNotMatch(source,/source_classes:\["observation"\]/);
assert.match(source,/maxNativeZoom:maxZoom/);
assert.match(source,/PRELOAD_CONCURRENCY=4/);
assert.match(source,/precipitation-preload-profile/);
assert.match(source,/precipitation-preload-custom-percent/);
assert.match(source,/Normal · \+30 % je Seite · empfohlen/);
assert.match(source,/Groß · \+50 % je Seite/);
assert.match(source,/document\.hidden/);
assert.match(source,/_weatherRadarPumpPreload/);
assert.match(source,/maxTiles:48,maxBytes:16\*1024\*1024/);

console.log("PASS: V4.11.03 provider-neutral precipitation radar supports bounded configurable spatial preloading with explicit percentage, tile and memory guards.");
