import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {buildRasterMosaicV2Request} from "../frontend/modules/weather/p7-010/raster-mosaic-consumer.js";
import {validateRasterMosaicV2} from "../frontend/modules/weather/p7-010/raster-mosaic-contract.js";
import {v2RenderedSourceValidity} from "../frontend/modules/weather/precipitation-layer.js";

const viewport={west:1,east:25,south:42,north:58};
const focus={latitude:50,longitude:10};
const get=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");

test("GR sends geography and boolean preference, never source or time thresholds",()=>{
 const request=buildRasterMosaicV2Request({viewport,focus,allowOlderSatelliteBackground:true});
 assert.deepEqual(request.time,{mode:"latest_coherent",allow_older_satellite_background:true});
 assert.equal(Object.hasOwn(request,"source_request"),false);
 assert.equal(Object.hasOwn(request.time,"max_data_age_seconds"),false);
 assert.equal(Object.hasOwn(request.time,"max_background_age_seconds"),false);
});

function snapshot(validUntil){
 const t="2026-11-04T14:30:00Z";
 return {
  contract_version:2,capability:"weather.precipitation.layer",
  status:"partial",viewport,layers:[{
   source_id:"opera/opera_rate_raster",resource_type:"raster_tile",
   coverage_verified:true,coverage_scope:"bbox",coverage:viewport,
   tile_url:"/api/weather_router/opera_tile/RATE/20261104T143000Z/{z}/{x}/{y}.png",
   attribution:"EUMETNET OPERA",legend:{title:"RATE"},
   render:{tile_size:256,min_zoom:0,max_zoom:18,opacity:1},
   semantics:{quantity:"precipitation_rate",unit:"mm/h",
     measurement_method:"precipitation_rate_radar",observation_kind:"observation"},
   times:{valid_at:t,valid_until:validUntil,retrieved_at:t,
     reference_delta_seconds:0,age_seconds:1500},
  }]
 };
}

test("WR metadata, not GR 900s rule, governs existing V2 tiles",()=>{
 const deadline="2026-11-04T14:57:30Z";
 const result=snapshot(deadline);
 assert.equal(validateRasterMosaicV2(result),result);
 const layer=result.layers[0];
 assert.equal(v2RenderedSourceValidity(layer,Date.parse(layer.times.retrieved_at),
   {now:Date.parse("2026-11-04T14:55:10Z")}).valid,true);
 assert.equal(v2RenderedSourceValidity(layer,Date.parse(layer.times.retrieved_at),
   {now:Date.parse("2026-11-04T14:57:31Z")}).valid,false);
});

test("GR source modules have no operational 900-second age rules",()=>{
 const modules=[
  "frontend/modules/weather/precipitation-layer.js",
  "frontend/modules/weather/consumer-client.js",
  "frontend/modules/weather/p7-010/raster-mosaic-consumer.js",
  "frontend/modules/weather/p7-010/raster-mosaic-contract.js",
  "frontend/modules/weather/p7-010/raster-mosaic-grid-layer.js",
  "frontend/modules/weather/p7-010/opera-diagnostic-tile.js"
 ];
 for(const path of modules){
  const src=get(path);
  assert.doesNotMatch(src,/maxDataAgeSeconds\s*[:=]\s*900\b/,path);
  assert.doesNotMatch(src,/max_data_age_seconds\s*:\s*900\b/,path);
  assert.doesNotMatch(src,/age_seconds\s*[<]=?\s*900\b/,path);
  assert.doesNotMatch(src,/\bREGIONAL_HOLD_LIMIT_MS\b/,path);
 }
});
