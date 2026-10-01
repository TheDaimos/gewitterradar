import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {
  expandWeatherRasterTileUrl,
  weatherRasterBbox3857,
  weatherRadarPreloadPolicy,
  weatherRadarPreloadTilePlan,
  weatherRadarTimelineModel,
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

const timelinePayload={
  tile_url:"https://radar.example/current/{z}/{x}/{y}.png",
  timeline:{
    loop:true,
    frames:[
      {time:"2026-10-01T06:30:00Z",tile_url:"https://radar.example/past-2/{z}/{x}/{y}.png"},
      {time:"2026-10-01T06:40:00Z",tile_url:"https://radar.example/past-1/{z}/{x}/{y}.png"},
      {time:"2026-10-01T06:50:00Z",tile_url:"https://radar.example/current/{z}/{x}/{y}.png"},
      {time:"2026-10-01T07:00:00Z",tile_url:"https://radar.example/future-1/{z}/{x}/{y}.png"},
      {time:"2026-10-01T07:10:00Z",tile_url:"https://radar.example/future-2/{z}/{x}/{y}.png"}
    ]
  }
};
const timeline=weatherRadarTimelineModel(timelinePayload,Date.parse("2026-10-01T06:52:00Z"));
assert.equal(timeline.currentIndex,2);
assert.equal(timeline.loop,true);
assert.deepEqual(timeline.frames.map(frame=>frame.kind),["past","past","current","forecast","forecast"]);

const fallback=weatherRadarTimelineModel({
  tile_url:"https://radar.example/unmatched/{z}/{x}/{y}.png",
  timeline:{
    loop:false,
    frames:[
      {time:"2026-10-01T06:30:00Z",tile_url:"a"},
      {time:"2026-10-01T06:40:00Z",tile_url:"b"},
      {time:"2026-10-01T07:00:00Z",tile_url:"c"}
    ]
  }
},Date.parse("2026-10-01T06:45:00Z"));
assert.equal(fallback.currentIndex,1);
assert.equal(fallback.loop,false);

const source=await readFile(new URL("../frontend/modules/weather/precipitation-layer.js",import.meta.url),"utf8");
const skeleton=await readFile(new URL("../frontend/modules/ui/skeleton.js",import.meta.url),"utf8");
assert.match(source,/requirements:\{resource_types:\["raster_tile"\]\}/);
assert.doesNotMatch(source,/source_classes:\["observation"\]/);
assert.doesNotMatch(source,/\bdwd\b/i);
assert.match(source,/maxNativeZoom:maxZoom/);
assert.match(source,/PRELOAD_CONCURRENCY=4/);
assert.match(source,/TIMELINE_STAGE_TIMEOUT_MS=6000/);
assert.match(source,/TIMELINE_PLAY_INTERVAL_MS=950/);
assert.match(source,/data\.weatherRadarPlayer="true"/);
assert.match(source,/aria-label","Niederschlagsradar-Zeitverlauf"/);
assert.match(source,/_weatherRadarStageTimelineFrame/);
assert.match(source,/timelineStagePromise/);
assert.match(source,/_weatherRadarPrimeNextTimelineFrame/);
assert.match(source,/requestAnimationFrame\(\(\)=>requestAnimationFrame\(resolve\)\)/);
assert.match(source,/Radar-Zeitverlauf/);
assert.match(source,/Vergangenheit, Jetzt und Vorhersage/);
assert.match(source,/precipitation-preload-profile/);
assert.match(source,/Normal · \+30 % je Seite · empfohlen/);
assert.match(source,/maxTiles:48,maxBytes:16\*1024\*1024/);
assert.match(skeleton,/this\._mountWeatherRouterSettings\?\.\(\);\s*this\._mountWeatherRadarSettings\?\.\(\);/);

console.log("PASS: V4.11.05 provider-neutral precipitation radar exposes a past/current/forecast timeline player with guarded double-buffered frame switching and retained spatial preload controls.");
