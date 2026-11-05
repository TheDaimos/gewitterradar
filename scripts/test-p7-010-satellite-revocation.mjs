import assert from "node:assert/strict";
import {installWeatherRadar,weatherRadarNeedsConsentDetach}
 from "../frontend/modules/weather/precipitation-layer.js";
globalThis.localStorage={setItem(){}};
const older={freshness_class:"older_background",times:{age_seconds:21000}};
const fresh={freshness_class:"current",times:{age_seconds:55}};
for(const layers of [[older,fresh],[fresh],[older]])
 assert.equal(weatherRadarNeedsConsentDetach({layer:{},v2Snapshot:{layers}}),false,
  "Only WR may revoke an already authorized mosaic");
class Card{};installWeatherRadar(Card,{loadLeafletJs:async()=>({})});
const card=new Card();let removed=0,cancelled=0;
const live={remove(){removed++}};
const state={enabled:true,allowOlderSatelliteBackground:true,layer:live,
 v2Snapshot:{layers:[older]},v2Generation:4,
 v2PendingLayer:{remove(){removed++},_p7AbortPending(){cancelled++}},
 v1PendingCancel(){cancelled++},inFlight:true,pending:false,pendingForce:false};
card.__weatherRadarState=state;
card._weatherRadarUpdateControls=()=>{};
card._setWeatherRadarOlderSatelliteBackground(false);
assert.equal(state.v2Generation,5);
assert.equal(state.layer,live,"a preference change cannot evict a WR-authorized layer");
assert.ok(state.v2Snapshot);
assert.equal(state.pending,true);
assert.equal(state.pendingForce,true);
assert.equal(removed,1,"only in-flight candidate is discarded");
assert.equal(cancelled,2);
const next=new Card();let refresh;
next.__weatherRadarState={enabled:true,allowOlderSatelliteBackground:true,layer:live,
 v2Snapshot:{layers:[fresh]},v2Generation:7,inFlight:false};
next._weatherRadarUpdateControls=()=>{};
next._refreshWeatherRadar=async a=>{refresh=a};
next._setWeatherRadarOlderSatelliteBackground(false);
assert.equal(next.__weatherRadarState.layer,live);
assert.equal(next.__weatherRadarState.v2Generation,8);
assert.deepEqual(refresh,{reason:"background-policy-change",force:true});
console.log("PASS: WR-exclusive revocation, satellite preference triggers refresh without discarding mounted tiles");
