import assert from "node:assert/strict";
import {installWeatherRadar} from "../frontend/modules/weather/precipitation-layer.js";

const documentListeners=new Map(),windowListeners=new Map();
globalThis.localStorage={getItem:()=>null,setItem(){}};
globalThis.document={
  visibilityState:"visible",
  addEventListener:(name,fn)=>documentListeners.set(name,fn),
  removeEventListener:(name,fn)=>{if(documentListeners.get(name)===fn)documentListeners.delete(name);}
};
globalThis.window={
  addEventListener:(name,fn)=>windowListeners.set(name,fn),
  removeEventListener:(name,fn)=>{if(windowListeners.get(name)===fn)windowListeners.delete(name);}
};
class Card{}
installWeatherRadar(Card,{loadLeafletJs:async()=>({})});
const card=new Card(),state=card._weatherRadarState();
state.enabled=true;
const schedules=[],events=[];let resize=0;
card._weatherRadarEnsureMapHooks=()=>true;
card._weatherRadarCullOutsideViewport=()=>false;
card._map={invalidateSize:()=>{resize++}};
card._scheduleWeatherRadarRefresh=(reason,delay,options={})=>schedules.push({reason,delay,options});
card._scheduleWeatherRadarPreload=()=>{};
card._weatherEngineMonitorEvent=(name,details)=>events.push({name,details});
card._weatherRadarClearTimelineStage=()=>{};
card._resumeWeatherRadar();
assert.ok(documentListeners.has("visibilitychange"));
assert.ok(windowListeners.has("focus"));
assert.ok(windowListeners.has("pageshow"));
const base=schedules.length;
document.visibilityState="hidden";
documentListeners.get("visibilitychange")();
assert.ok(state.appHiddenAt>0);
document.visibilityState="visible";
documentListeners.get("visibilitychange")();
assert.equal(schedules.length,base+1);
assert.deepEqual(schedules.at(-1),{reason:"app-foreground",delay:250,options:{force:true}});
assert.equal(resize,1);
windowListeners.get("focus")();
assert.equal(schedules.length,base+1,"visibility/focus must coalesce into one forced refresh");

state.lastForegroundRefreshAt=0;
state.appHiddenAt=Date.now()-40000;
state.inFlight=true;state.inFlightToken=7;state.inFlightStartedAt=Date.now()-42000;state.v2Generation=7;
let cancelled=0,stages=0;
state.v1PendingCancel=()=>{cancelled++};
state.v2PendingLayer={_p7AbortPending(){cancelled++},remove(){stages++}};
documentListeners.get("visibilitychange")();
assert.equal(state.inFlight,false,"request frozen by Android suspension is retired");
assert.equal(state.inFlightToken,null);
assert.equal(state.v2Generation,8);
assert.equal(stages,1);
assert.equal(cancelled,2);
assert.equal(schedules.length,base+2);
assert.ok(events.some(x=>x.name==="radar_inflight_watchdog_recovered"));
assert.ok(events.some(x=>x.name==="weather_radar_app_foreground"));
card._teardownWeatherRadar();
assert.equal(documentListeners.size,0);
assert.equal(windowListeners.size,0);

// An obsolete suspended promise settling later cannot unlock a newer request.
const second=new Card(),s=second._weatherRadarState();
s.enabled=true;second._weatherRadarEnsureMapHooks=()=>true;
second._weatherRadarViewport=()=>({signature:"Cuba",context:{west:-82,east:-75,south:18,north:24}});
second._weatherRadarCullOutsideViewport=()=>false;
second._weatherRadarUpdateControls=()=>{};
second._weatherRadarHandleUnavailable=()=>{};
second._weatherEngineMonitorEvent=()=>{};
const resolves=[];
second._weatherRouterDiscovery=()=>new Promise(resolve=>resolves.push(resolve));
const obsolete=second._refreshWeatherRadar({force:true});
assert.equal(s.inFlight,true);const oldToken=s.inFlightToken;
s.inFlightStartedAt=Date.now()-42000;
assert.equal(second._weatherRadarRecoverExpiredRequest(Date.now()),true);
const replacement=second._refreshWeatherRadar({force:true});
assert.equal(s.inFlight,true);const nextToken=s.inFlightToken;
assert.ok(nextToken>oldToken);
resolves[0]({ready:false});
await obsolete;
assert.equal(s.inFlight,true,"old finally must not clear the new request lock");
assert.equal(s.inFlightToken,nextToken);
resolves[1]({ready:false});
await replacement;
assert.equal(s.inFlight,false);
assert.equal(s.inFlightToken,null);
// A failed cold raster must be retried on the same viewport without waiting
// four minutes; this also tests that the retry cannot spin faster than 15 s.
const third=new Card(),state3=third._weatherRadarState();
state3.enabled=true;
state3.layer=null;
state3.lastViewport="Cuba";
state3.lastRequestAt=Date.now()-16000;
third._weatherRadarEnsureMapHooks=()=>true;
third._weatherRadarCullOutsideViewport=()=>false;
third._weatherRadarViewport=()=>({signature:"Cuba",context:{west:-82,east:-75,south:18,north:24}});
third._weatherRadarUpdateControls=()=>{};
third._weatherRadarHandleUnavailable=()=>{};
third._weatherEngineMonitorEvent=()=>{};
third._weatherRouterDiscovery=async()=>({ready:false});
const missing=[];
third._scheduleWeatherRadarRefresh=(reason,delay,options)=>missing.push({reason,delay,options});
await third._refreshWeatherRadar({reason:"timer"});
assert.ok(missing.some(x=>x.reason==="missing-raster-retry"&&x.delay>=15000),
  "missing raster must retry within the bounded 15-second interval");
assert.equal(state3.inFlight,false);
missing.length=0;
state3.lastRequestAt=Date.now()-1000;
await third._refreshWeatherRadar({reason:"timer"});
assert.ok(missing.some(x=>x.reason==="timer"&&x.delay>10000),
  "same-viewport retries are throttled, not continuous");
console.log("PASS: Android foreground refresh, deduplication, cleanup and stale in-flight watchdog");
