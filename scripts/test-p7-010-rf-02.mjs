import assert from "node:assert/strict";
import {decideV2RegionalRetention,v2RenderedSourceValidity,
  installWeatherRadar,weatherRadarActiveCoverage} from "../frontend/modules/weather/precipitation-layer.js";
import {drawVerifiedRasterMosaicTile} from "../src/p7-010/raster-compositor.js";
import {readFile} from "node:fs/promises";

const now=Date.parse("2026-10-18T15:13:03Z");
const previousAt=Date.parse("2026-10-18T15:10:07Z");
const full={west:-180,east:180,south:-90,north:90};
const regional={west:5,east:16,south:46,north:56};
const germany={west:8,east:12,south:48,north:52};
const cuba={west:-82,east:-75,south:19,north:24};
const base=(id,kind,method,obs,coverage,unit="mm/h")=>({
  source_id:id,resource_type:"raster_tile",
  freshness_class:kind,coverage_scope:"bbox",coverage_verified:true,
  coverage,tile_url:"https://example.invalid/wms?bbox={bbox-epsg-3857}",
  render:{tile_size:256,min_zoom:0,max_zoom:11,opacity:0.58},
  attribution:id,legend:{title:id},
  semantics:{quantity:"precipitation_rate",unit,measurement_method:method,observation_kind:obs},
  times:{valid_at:kind==="older_background"?"2026-10-18T09:30:00Z":"2026-10-18T15:10:00Z",
    retrieved_at:"2026-10-18T15:10:06Z",
    age_seconds:kind==="older_background"?20407:7,
    reference_delta_seconds:0}
});
const nasa=base("nasa_gibs/satellite_precipitation_imerg_30min","older_background",
  "satellite_precipitation_estimate","estimate",full);
const dwd=base("dwd/radar_precipitation","current",
  "precipitation_rate_radar","observation_forecast",regional);
const combined={contract_version:2,capability:"weather.precipitation.layer",
 status:"partial",layers:[nasa,dwd]};
const nasaOnly={...combined,layers:[nasa],limitations:[
 "Rasterpixel und Datenluecken nicht vollstaendig verifiziert",
 "Einige regionale Coverage-Anfragen waren nicht nutzbar."]};
const args={previous:combined,next:nasaOnly,viewport:germany,zoom:5,
 now,previousAt,satelliteConsent:true,drawnTiles:15,uncoveredTiles:0,
 previousMounted:true};
const decide=more=>decideV2RegionalRetention({...args,...more});

// GR-RF02-01/02: actual WR 0.10.158 semantics include observation_forecast,
// and WR paints the NASA foundation BEFORE regional DWD radar.
const r=decide();assert.equal(r.retain,true,r.reason);
assert.deepEqual(r.retained_source_ids,["dwd/radar_precipitation"]);
assert.ok(r.current_age_seconds>=180&&r.current_age_seconds<220);
assert.ok(r.deadlineAt-now<=45000);
assert.equal(r.coverage_timeout_proven,false,
 "the WR generic limitation cannot prove a specific coverage_timeout");
assert.deepEqual(r.render_order.map(x=>x.source_id),
 [nasa.source_id,dwd.source_id]);

// Explicit structured preflight codes are honored only when present in the
// actual response, never guessed from a generic German warning.
const timed=decide({next:{...nasaOnly,routing:{coverage_preflight:[
 {source_id:dwd.source_id,result:"coverage_timeout"}]}}});
assert.equal(timed.retain,true);assert.equal(timed.coverage_timeout_proven,true);
for(const reason of ["outside_coverage","outside_time_tolerance",
 "no_fresh_verified_frame","profile_filtered","consent_revoked"]){
 const x=decide({next:{...nasaOnly,routing:{coverage_preflight:[
   {source_id:dwd.source_id,result:reason}]}}});
 assert.equal(x.retain,false,reason);assert.equal(x.reason,"explicit_regional_rejection");
}
// GR-RF02-03/04/05/06: expiry, geographic mismatch and consent revoke.
const previousVeryOld={...combined,layers:[nasa,
  {...dwd,times:{...dwd.times,age_seconds:805}}]};
assert.equal(decide({previous:previousVeryOld}).retain,false);
assert.equal(decide({viewport:cuba}).reason,"regional_outside_viewport");
assert.equal(decide({satelliteConsent:false}).reason,"consent_revoked");
assert.equal(decide({next:{...nasaOnly,limitations:[]}}).reason,"no_transient_coverage_evidence");
assert.equal(decide({next:{...nasaOnly,status:"ready"}}).reason,"replacement_not_degraded");
assert.equal(decide({now:now+46000,existingHold:{startedAt:now}}).reason,"hold_expired");
assert.equal(decide({existingHold:{startedAt:now-25000}}).startedAt,now-25000,
 "a repeated degraded response cannot restart the hold");
assert.equal(decide({drawnTiles:0}).reason,"previous_image_incomplete");
assert.equal(decide({uncoveredTiles:1}).reason,"previous_image_incomplete");
assert.equal(decide({previousMounted:false}).reason,"no_mounted_mosaic");
const misorder={...combined,layers:[dwd,nasa]};
assert.equal(decide({previous:misorder}).reason,"prior_compositing_order_unverified");
const incompatible={...combined,layers:[nasa,
 {...dwd,semantics:{...dwd.semantics,quantity:"accumulation"}}]};
assert.equal(decide({previous:incompatible}).reason,"precipitation_semantics_changed");
const live={...combined,layers:[dwd]};
assert.equal(decide({next:live}).reason,"replacement_has_live_sources");

// GR-RF02-09: UTC time stays bounded by BOTH original WR age and valid_at.
// Age is never 'renewed' by a later NASA-only resolution.
const validDwd=v2RenderedSourceValidity(dwd,previousAt,{
 now,satelliteConsent:true});
assert.equal(validDwd.valid,true);
assert.ok(validDwd.expiresAt>now);
assert.equal(v2RenderedSourceValidity(dwd,previousAt,{
 now:previousAt+901000,satelliteConsent:true}).valid,false);
assert.equal(v2RenderedSourceValidity(nasa,previousAt,{
 now,satelliteConsent:false}).valid,false);
assert.equal(v2RenderedSourceValidity({...dwd,times:{...dwd.times,
 valid_at:"2026-10-18T10:00:00Z"}},previousAt,{now,satelliteConsent:true}).valid,false);
assert.equal(v2RenderedSourceValidity({...dwd,times:{...dwd.times,
 age_seconds:undefined}},previousAt,{now,satelliteConsent:true}).valid,false);

// GR-RF02-10: test the real compositor order, not the order of source_ids
// in a diagnostic string. Pixel opacity/content remains unverified.
const drawOrder=[];
const context={globalAlpha:1,drawImage:(image)=>drawOrder.push(
 {name:image.name,alpha:context.globalAlpha})};
const source=(v,name)=>({...v,image:{name}});
const tile={x:16,y:10,z:5};
const result=drawVerifiedRasterMosaicTile(context,tile,
 [source(nasa,"nasa"),source(dwd,"dwd")]);
assert.deepEqual(drawOrder.map(x=>x.name),["nasa","dwd"]);
assert.equal(drawOrder[0].alpha,0.58);
assert.equal(drawOrder[1].alpha,0.58);
assert.equal(result.drawn.length,2);
assert.equal(result.no_pixel_blending,true);

// GR-RF02-07/08/09/11: exercise the production retention state machine,
// timer allocation, one-shot expiration and recovery, not just a mock decision.
class Card {}
installWeatherRadar(Card,{loadLeafletJs:async()=>({})});
const card=new Card(),events=[],refreshes=[];
let removed=0,abortCalls=0,activeLayer={};
card._map={hasLayer:layer=>layer===activeLayer,
 getZoom:()=>5};
card._weatherEngineMonitorEvent=(name,detail)=>events.push({name,detail});
card._weatherRadarUpdateControls=()=>{};
card._weatherRadarVisualAudit=()=>{};
card._scheduleWeatherRadarRefresh=(reason,delay,opts)=>refreshes.push({reason,delay,opts});
card._weatherRadarRemoveLayer=()=>{
  removed++;card._weatherRadarClearRegionalHold();
  card.__weatherRadarState.layer=null;
};
const current=Date.now();
const freshNasa={...nasa,times:{...nasa.times,
 valid_at:new Date(current-18000000).toISOString(),age_seconds:18000}};
const freshDwd={...dwd,times:{...dwd.times,
 valid_at:new Date(current-30000).toISOString(),age_seconds:30}};
const currentCombined={...combined,layers:[freshNasa,freshDwd]};
const currentNasaOnly={...nasaOnly,layers:[freshNasa]};
card.__weatherRadarState={
 enabled:true,layer:activeLayer,v2Snapshot:currentCombined,
 v2SnapshotAt:current,allowOlderSatelliteBackground:true,
 v2RenderMetrics:{drawn_tiles:15,uncovered_tiles:0},
 viewportRefreshIntervalSeconds:15,regionalHold:null,
 regionalHoldTimer:null,regionalRecoveryTimer:null
};
let aborted=false;const candidate={response:currentNasaOnly,
 layer:{_p7AbortPending:()=>{aborted=true}}};
const accepted=card._weatherRadarRetainRegionalMosaic(candidate,
 {context:germany,signature:"germany"},"gr-test-ref",()=>{});
assert.equal(accepted,true);
assert.equal(aborted,true,"replaced candidate must not consume tile budget");
assert.equal(card.__weatherRadarState.layer,activeLayer);
assert.equal(card.__weatherRadarState.v2Snapshot,currentCombined);
assert.equal(removed,0);
assert.ok(card.__weatherRadarState.regionalHold);
assert.ok(events.some(x=>x.name==="v2_regional_previous_retained"));
const firstDeadline=card.__weatherRadarState.regionalHold.deadlineAt;
card._weatherRadarRetainRegionalMosaic({response:currentNasaOnly,
 layer:{_p7AbortPending() {}}},{context:germany,signature:"germany"},
 "gr-test-retry",()=>{});
assert.equal(card.__weatherRadarState.regionalHold.deadlineAt,firstDeadline,
 "repeat responses must not extend retention");

// Premature scheduled expiry must not remove valid coverage.
assert.equal(card._weatherRadarExpireRegionalHold(current+1000),false);
assert.equal(removed,0);
assert.equal(card._weatherRadarExpireRegionalHold(firstDeadline+1),true);
assert.equal(removed,1);
assert.equal(card.__weatherRadarState.layer,null);
assert.equal(card.__weatherRadarState.v2Snapshot,null);
assert.equal(card.__weatherRadarState.regionalHold,null);
assert.ok(refreshes.some(x=>x.reason==="regional-hold-expired"&&x.opts.force));

// Recovery with a current DWD response is never held. The normal V2
// preparation then swaps the fresh composite, clearing previous retention.
const restored={...currentCombined,limitations:[]};
assert.equal(decideV2RegionalRetention({...args,previous:currentCombined,
 previousAt:current,now:current+1500,next:restored}).retain,false);

// GR-RF02-11/12: high zoom coverage remains regional; V1 remains unmodified.
for(const zoom of [5,7,5,10,11,12,13,15,17]){
 const x=decide({zoom});assert.equal(x.retain,true,
   "retention must not impose provider native zoom cutoff "+zoom);
}
for(const path of ["modules/weather/precipitation-layer.js"]){
 const files=await Promise.all(["frontend","dashboard/dist",
 "custom_components/gewitterradar/frontend"].map(root=>readFile(root+"/"+path)));
 assert.ok(files.every(x=>x.equals(files[0])),"mirror mismatch "+path);
}
assert.equal(weatherRadarActiveCoverage({
 layer:{},v2Snapshot:currentCombined,v2SnapshotAt:current,
 allowOlderSatelliteBackground:true},germany,5,current).fraction,1);
const contract=await readFile("src/p7-010/raster-mosaic-contract.js","utf8");
assert.match(contract,/maxBackgroundAgeSeconds/);
assert.match(contract,/maxDataAgeSeconds/);
assert.match(contract,/older_background/);
console.log("PASS: GR-RF02-01..12 | retention/rejection, expiry, priority, real compositor, UTC/consent, recovery, zoom/V1");
