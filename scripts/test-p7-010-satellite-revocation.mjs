import assert from "node:assert/strict";
import {installWeatherRadar,weatherRadarNeedsConsentDetach} from "../frontend/modules/weather/precipitation-layer.js";
globalThis.localStorage={setItem(){}};
class Card{}
installWeatherRadar(Card,{loadLeafletJs:async()=>({})});
const older={freshness_class:"older_background",times:{age_seconds:21000}};
const fresh={freshness_class:"current",times:{age_seconds:55}};
assert.equal(weatherRadarNeedsConsentDetach({layer:{},v2Snapshot:{layers:[older,fresh]}}),true);
assert.equal(weatherRadarNeedsConsentDetach({layer:{},v2Snapshot:{layers:[fresh]}}),false);
assert.equal(weatherRadarNeedsConsentDetach({layer:null,v2Snapshot:{layers:[older]}}),false);
const c=new Card();let removed=0,cancelled=0,forced=0;
const state={enabled:true,allowOlderSatelliteBackground:true,layer:{remove(){removed++;}},
 v2Snapshot:{layers:[older]},v2Generation:4,
 v2PendingLayer:{remove(){removed++;},_p7AbortPending(){cancelled++;}},
 v1PendingCancel(){cancelled++;},inFlight:true,pending:false,pendingForce:false};
c.__weatherRadarState=state;c._weatherRadarUpdateControls=()=>{};
c._weatherRadarRemoveTimelinePlayer=()=>{};c._weatherRadarRenderLegend=()=>{};
c._weatherEngineMonitorEvent=()=>{};c._weatherRadarVisualAudit=()=>{};
c._refreshWeatherRadar=async()=>{forced++;};
c._setWeatherRadarOlderSatelliteBackground(false);
assert.equal(state.v2Generation,5);
assert.equal(state.layer,null);
assert.equal(state.v2Snapshot,null);
assert.equal(state.pending,true);
assert.equal(state.pendingForce,true);
assert.equal(removed,2);
assert.equal(cancelled,2);
assert.equal(forced,0);
const n=new Card();const next={enabled:true,allowOlderSatelliteBackground:true,
 layer:{remove(){throw Error("do not remove fresh imagery");}},v2Snapshot:{layers:[fresh]},v2Generation:7,inFlight:false};
n.__weatherRadarState=next;n._weatherRadarUpdateControls=()=>{};
let options;n._refreshWeatherRadar=async x=>{options=x;};
n._setWeatherRadarOlderSatelliteBackground(false);
assert.ok(next.layer);assert.equal(next.v2Generation,8);
assert.deepEqual(options,{reason:"background-policy-change",force:true});
const v1=new Card();let rejects=0;
v1.__weatherRadarState={enabled:true,allowOlderSatelliteBackground:false};
v1._weatherEngineMonitorEvent=()=>{rejects++;};
const olderRadar={resource:{payload:{tile_url:"https://example.invalid/{z}/{x}/{y}.png"},
  semantics:{observation_kind:"observation",measurement_method:"radar"}},
  freshness:{age_seconds:20000}};
assert.equal(await v1._weatherRadarApplyReady(olderRadar,{signature:"sample"},0),false);
assert.equal(rejects,1,"stale radar must not evade the 900-second policy");
v1.__weatherRadarState.allowOlderSatelliteBackground=true;
assert.equal(await v1._weatherRadarApplyReady(olderRadar,{signature:"sample"},0),false,
  "satellite consent must not make stale regional radar valid");
const noSemantic={resource:{payload:{tile_url:"https://example.invalid/{z}/{x}/{y}.png"}},
  freshness:{age_seconds:20000}};
assert.equal(await v1._weatherRadarApplyReady(noSemantic,{signature:"sample"},0),false,
  "unverified V1 imagery cannot be upgraded to older satellite background");
assert.equal(weatherRadarNeedsConsentDetach({layer:{},lastReady:{at:Date.now(),answer:noSemantic}}),true,
  "revocation removes old imagery even without satellite metadata");
const freshV1={resource:{payload:{tile_url:"https://example.invalid/fresh"}},
  freshness:{age_seconds:120}};
assert.equal(weatherRadarNeedsConsentDetach({layer:{},lastReady:{at:Date.now(),answer:freshV1}}),false,
  "fresh V1 raster stays mounted when only older satellite consent is revoked");
console.log("PASS: revocation detaches old satellites and invalidates outstanding V2 work");