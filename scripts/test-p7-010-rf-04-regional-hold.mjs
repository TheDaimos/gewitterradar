import assert from "node:assert/strict";
import {installWeatherRadar,decideV2RegionalRetention} from "../frontend/modules/weather/precipitation-layer.js";
const world={west:-180,east:180,south:-90,north:90};
const region={west:5,east:16,south:46,north:56};
const germany={west:8,east:12,south:48,north:52};
const utc=ms=>new Date(ms).toISOString();
const now=Date.now();
const make=(id,cls,cov,method,kind,age)=>({
 source_id:id,resource_type:"raster_tile",freshness_class:cls,
 coverage_scope:cls==="older_background"?"global":"bbox",coverage_verified:true,coverage:cov,
 tile_url:"https://example.invalid/{z}/{x}/{y}.png",
 render:{tile_size:256,min_zoom:0,max_zoom:11,opacity:.58},attribution:id,legend:{title:id},
 semantics:{quantity:"precipitation_rate",unit:"mm/h",measurement_method:method,observation_kind:kind},
 times:{valid_at:utc(now-age*1000),retrieved_at:utc(now),age_seconds:age,reference_delta_seconds:0}
});
const nasa=make("nasa","older_background",world,"satellite_precipitation_estimate","estimate",3600);
const dwd=make("dwd","current",region,"precipitation_rate_radar","observation",30);
const old={contract_version:2,status:"partial",layers:[nasa,dwd]};
const reply=(result)=>({contract_version:2,status:"partial",layers:[nasa],
 source_outcomes:[{source_id:"dwd",result}]});
const base={previous:old,next:reply("coverage_timeout"),viewport:germany,zoom:7,
 now,previousAt:now,satelliteConsent:true,drawnTiles:12,uncoveredTiles:0,
 previousMounted:true,renderOrder:[{source_id:"nasa"},{source_id:"dwd"}]};
const decide=(rest={})=>decideV2RegionalRetention({...base,...rest});
assert.equal(decide().retain,true,"1 initial timeout retained");
assert.equal(decide().coverage_timeout_proven,true);
assert.equal(decide({existingHold:{startedAt:now-15000}}).deadlineAt,now+30000,
 "2 repeated timeout must not extend 45s");
assert.equal(decide({now:now+45001,existingHold:{startedAt:now}}).retain,false,
 "3 must expire no later than 45s");
assert.equal(decide({previousAt:now-910000}).retain,false,
 "4 old radar age invalid");
assert.equal(decide({next:reply("outside_coverage")}).retain,false,
 "5 explicit invalid geography");
assert.equal(decide({satelliteConsent:false}).retain,false,
 "6 revoked opt-in");
const live={...old,layers:[nasa,dwd],status:"ready"};
assert.equal(decide({next:live}).retain,false,"7 recovered live DWD uses normal swap path");
class Card{} installWeatherRadar(Card,{loadLeafletJs:async()=>({})});
function setup(){
 const c=new Card(),events=[],refreshes=[];let removed=0,aborted=0;
 const layer={_p7RasterRenderOrder:[{source_id:"nasa"},{source_id:"dwd"}]};
 c._map={hasLayer:x=>x===layer,getZoom:()=>7};
 c._weatherEngineMonitorEvent=(phase,detail)=>events.push({phase,detail});
 c._weatherRadarUpdateControls=()=>{};c._weatherRadarVisualAudit=()=>{};
 c._scheduleWeatherRadarRefresh=(...a)=>refreshes.push(a);
 c._weatherRadarRemoveLayer=()=>{removed++;c._weatherRadarClearRegionalHold();c.__weatherRadarState.layer=null;};
 c.__weatherRadarState={layer,v2Snapshot:old,v2SnapshotAt:now,enabled:true,
 allowOlderSatelliteBackground:true,v2RenderMetrics:{drawn_tiles:12,uncovered_tiles:0},
 viewportRefreshIntervalSeconds:15,regionalHold:null,regionalHoldTimer:null,regionalRecoveryTimer:null};
 const call=next=>c._weatherRadarRetainRegionalMosaic({
 response:next,layer:{_p7AbortPending:()=>aborted++}},
 {context:germany,signature:"germany"},"rf04-simulated",()=>{});
 return {c,events,refreshes,call,get removed(){return removed},get aborted(){return aborted}};
}
const s=setup();
assert.equal(s.call(reply("coverage_timeout")),true);
const started=s.c.__weatherRadarState.regionalHold.startedAt;
const deadline=s.c.__weatherRadarState.regionalHold.deadlineAt;
assert.equal(s.aborted,1);assert.ok(deadline-started<=45000);
assert.equal(s.call(reply("coverage_timeout")),true);
assert.equal(s.c.__weatherRadarState.regionalHold.startedAt,started);
assert.equal(s.c.__weatherRadarState.regionalHold.deadlineAt,deadline);
assert.equal(s.c._weatherRadarExpireRegionalHold(deadline-1),false);
assert.equal(s.c._weatherRadarExpireRegionalHold(deadline+1),true);
assert.equal(s.removed,1);assert.equal(s.c.__weatherRadarState.regionalHold,null);
assert.ok(s.events.some(x=>x.phase==="v2_regional_previous_retained"));
assert.ok(s.events.some(x=>x.phase==="v2_regional_hold_expired"));
const geography=setup();
assert.equal(geography.call(reply("coverage_timeout")),true);
assert.equal(geography.call(reply("outside_coverage")),false);
assert.equal(geography.removed,1,"outside_coverage must revoke prior hold");
const consent=setup();
assert.equal(consent.call(reply("coverage_timeout")),true);
consent.c.__weatherRadarState.allowOlderSatelliteBackground=false;
assert.equal(consent.call(reply("coverage_timeout")),false);
assert.equal(consent.removed,1,"revoked consent must drop previous held composite");
const stale=setup();
stale.c.__weatherRadarState.v2SnapshotAt=now-910000;
assert.equal(stale.call(reply("coverage_timeout")),false);
assert.equal(stale.c.__weatherRadarState.regionalHold,null);
const recovery=setup();
assert.equal(recovery.call(reply("coverage_timeout")),true);
assert.equal(recovery.call(live),false,"new DWD should not be held");
assert.equal(recovery.c.__weatherRadarState.layer!==null,true);
recovery.c._weatherRadarClearRegionalHold();
console.log("GR-RF04-07..13 controlled regional hold transitions PASS; no external provider touched");
