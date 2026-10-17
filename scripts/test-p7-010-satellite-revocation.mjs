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
console.log("PASS: revocation detaches old satellites and invalidates outstanding V2 work");