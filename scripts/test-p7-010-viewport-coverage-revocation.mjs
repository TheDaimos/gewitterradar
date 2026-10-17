import assert from "node:assert/strict";
import {installWeatherRadar,weatherRadarActiveCoverage} from "../frontend/modules/weather/precipitation-layer.js";
import {measureV1RasterCoverage} from "../src/p7-010/raster-mosaic-coverage.js";

const germany={type:"bbox",west:7,south:47,east:13,north:55};
const cuba={type:"bbox",west:-82,south:18,east:-75,north:24};
const dwdExtent={west:1.46,south:45.68,east:18.73,north:56.21};
const dwd={resource:{payload:{tile_url:"https://example.invalid/dwd/{z}/{x}/{y}.png"},
  semantics:{observation_kind:"observation",measurement_method:"radar"}},
  freshness:{age_seconds:120},
  provenance:{provider_id:"dwd",spatial_coverage:{scope:"bbox",bbox:dwdExtent}}};
const t=Date.now();
const v1={layer:{},lastReady:{answer:dwd,at:t},allowOlderSatelliteBackground:false};
assert.equal(weatherRadarActiveCoverage(v1,germany,7,t).fraction,1);
assert.equal(weatherRadarActiveCoverage(v1,cuba,7,t).fraction,0);
assert.equal(weatherRadarActiveCoverage(v1,cuba,7,t).verified,true);
assert.equal(measureV1RasterCoverage(dwd.provenance,cuba,7).fraction,0);

class Card {}
installWeatherRadar(Card,{loadLeafletJs:async()=>({})});
const events=[];
const card=new Card();
let removed=0,cleared=0,refresh=0;
let bounds=germany;
card._map={getZoom:()=>7,hasLayer:()=>true};
card._weatherRadarViewport=()=>({context:bounds,signature:bounds===germany?"Germany":"Cuba"});
card._weatherEngineMonitorEvent=(name,details)=>events.push({name,details});
card._weatherRadarVisualAudit=()=>{};
card._weatherRadarUpdateControls=()=>{};
card._weatherRadarClearPreload=()=>{cleared++};
card._weatherRadarRemoveLayer=()=>{removed++;card.__weatherRadarState.layer=null};
card._scheduleWeatherRadarRefresh=()=>{refresh++};
card._scheduleWeatherRadarPreload=()=>{};
card.__weatherRadarState={
 enabled:true,allowOlderSatelliteBackground:false,layer:{},lastReady:{answer:dwd,at:t},
 v2Snapshot:null,lastUnavailable:null,inFlight:false,lastViewport:"Germany",v2Generation:3,
 v2PendingLayer:null,v1PendingCancel:null
};
assert.equal(card._weatherRadarPreviousValid(),true);
bounds=cuba;
assert.equal(card._weatherRadarPreviousValid(),false);
assert.equal(card._weatherRadarCullOutsideViewport(),true);
assert.equal(removed,1);
assert.equal(cleared,1);
assert.equal(card.__weatherRadarState.layer,null);
assert.equal(card.__weatherRadarState.lastReady,null);
assert.equal(card.__weatherRadarState.lastUnavailable.code,"outside_coverage");
assert.ok(events.some(x=>x.name==="raster_detached_outside_coverage"));
assert.equal(card._weatherRadarCullOutsideViewport(),false);

card.__weatherRadarState.layer={};
card.__weatherRadarState.v2Snapshot={layers:[{
 source_id:"dwd/radar_precipitation",coverage_verified:true,coverage_scope:"bbox",
 coverage:dwdExtent,render:{min_zoom:0,opacity:0.6},
 times:{age_seconds:110},freshness_class:"current"
}]};
card.__weatherRadarState.v2SnapshotAt=t;
assert.equal(weatherRadarActiveCoverage(card.__weatherRadarState,cuba,7,t).fraction,0);
assert.equal(card._weatherRadarCullOutsideViewport(),true);
assert.equal(removed,2);
assert.equal(card.__weatherRadarState.v2Snapshot,null);

// NASA's older world satellite must never bypass explicit consent.
const nasaGlobal={
 layer:{},allowOlderSatelliteBackground:false,v2SnapshotAt:t,
 v2Snapshot:{layers:[{
  source_id:"nasa_gibs/satellite_precipitation_imerg_30min",
  coverage_verified:true,coverage_scope:"bbox",
  coverage:{west:-180,east:180,south:-90,north:90},
  render:{min_zoom:0,opacity:0.6},
  times:{age_seconds:25500},freshness_class:"older_background"
 }]}
};
assert.equal(weatherRadarActiveCoverage(nasaGlobal,cuba,7,t).fraction,0,
  "old NASA background cannot bypass disabled 12h consent");
nasaGlobal.allowOlderSatelliteBackground=true;
assert.equal(weatherRadarActiveCoverage(nasaGlobal,cuba,7,t).fraction,1,
  "verified world NASA envelope may be used only after explicit consent");

// WR may return 'ready' for an old regional candidate even when the user's BBOX
// is Cuba. Never stage its WMS URL outside verified spatial coverage.
card.__weatherRadarState.lastReady=null;
card.__weatherRadarState.enabled=true;
card.__weatherRadarState.v2Generation=4;
assert.equal(await card._weatherRadarApplyReady(dwd,{context:cuba,signature:"Cuba"},4),false);
assert.ok(events.some(x=>x.name==="v1_outside_coverage_rejected"));
const noGeometry={...dwd,provenance:{provider_id:"unknown"}};
assert.equal(await card._weatherRadarApplyReady(noGeometry,{context:cuba,signature:"Cuba"},4),false);
assert.ok(events.some(x=>x.name==="v1_outside_coverage_rejected"
  &&x.details.reason==="coverage_unverified"));
bounds=germany;
assert.equal(weatherRadarActiveCoverage({...v1,layer:{},lastReady:{answer:dwd,at:t}},germany,7,t).fraction,1);
assert.equal(measureV1RasterCoverage(dwd.provenance,germany,7).fraction,1);

// An unavailable reply must not re-enable an out-of-area layer, even without a
// prior moveend callback.
bounds=cuba;
card.__weatherRadarState.layer={};
card.__weatherRadarState.lastReady={answer:dwd,at:t};
card._weatherRadarHandleUnavailable({unavailable:{code:"no_eligible_provider"}});
assert.equal(card.__weatherRadarState.layer,null);
assert.equal(card.__weatherRadarState.lastUnavailable.code,"outside_coverage");

console.log("PASS: Germany→Cuba DWD V1/V2 detach; Cuba fallback rejection; Germany overlap retained");
