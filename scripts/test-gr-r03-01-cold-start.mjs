import assert from "node:assert/strict";
import {installWeatherRadar} from "../frontend/modules/weather/precipitation-layer.js";

const Card=class {};
installWeatherRadar(Card,{loadLeafletJs:async()=>({})});
const card=new Card();
const calls=[],events=[],statuses=[];
let currentViewport="germany-z8",ready=true,mode="unavailable";
const state=card._weatherRadarState();
state.enabled=true;state.viewportRefreshIntervalSeconds=60;
card._map={getZoom:()=>8};
card._weatherRadarEnsureMapHooks=()=>true;
card._weatherRadarViewport=()=>({signature:currentViewport,context:{type:"bbox"},focus:{lat:50,lon:10}});
card._weatherRadarCullOutsideViewport=()=>false;
card._weatherRadarRecoverExpiredRequest=()=>false;
card._weatherRouterDiscovery=async()=>({ready,compatible:true});
card._weatherRadarTryMosaic=async()=>mode==="ready";
card._weatherRouterCapabilities=async()=>({status:"ready",capabilities:[]});
card._weatherRadarUpdateControls=message=>statuses.push(message||"");
card._weatherEngineMonitorEvent=(type,details)=>events.push({type,details});
card._scheduleWeatherRadarRefresh=(reason,delay,options={})=>calls.push({reason,delay,...options});
const savedDocument=globalThis.document;
globalThis.document={visibilityState:"visible"};
try{
  // No active predecessor: retry budget must be independent of the 60 s preference.
  for(let attempt=1;attempt<=4;attempt++){
    state.lastRequestAt=Date.now()-9000;
    await card._refreshWeatherRadar({reason:"cold-test"});
    assert.equal(state.inFlight,false);
    assert.equal(state.layer,null);
    assert.equal(state.coldStartRetries,Math.min(attempt,3));
  }
  assert.equal(calls.filter(x=>x.reason==="missing-raster-retry").length,3);
  assert.ok(calls.filter(x=>x.reason==="missing-raster-retry").every(x=>x.delay===8000));
  assert.ok(events.some(x=>x.type==="missing_raster_retry_exhausted"));
  assert.equal(state.lastUnavailable.code,"cold_start_retry_exhausted");
  assert.ok(statuses.some(x=>x.includes("konnte nicht geladen werden")));
  // On a warm valid image, no missing-image retry may be scheduled.
  calls.length=0;mode="ready";state.layer={remove(){}};
  state.lastRequestAt=Date.now()-9000;
  await card._refreshWeatherRadar({reason:"warm-refresh",force:true});
  assert.equal(state.coldStartRetries,0);
  assert.equal(calls.filter(x=>x.reason==="missing-raster-retry").length,0);
  // Stale discovery must not activate any mosaic and must request a new generation.
  mode="ready";state.layer=null;state.lastRequestAt=Date.now()-9000;
  card._weatherRouterDiscovery=async()=>{state.v2Generation++;return {ready:true,compatible:true};};
  let mosaicCalled=false;card._weatherRadarTryMosaic=async()=>{mosaicCalled=true;return true;};
  await card._refreshWeatherRadar({reason:"overlap"});
  assert.equal(mosaicCalled,false);
  assert.ok(calls.some(x=>x.reason==="pending"));
  // A never-settling first request must be released by the watchdog.
  const originalSetTimeout=globalThis.setTimeout,originalClearTimeout=globalThis.clearTimeout;
  const callbacks=[],fakeTimers=new Set();
  let nextFakeTimer=100000;
  globalThis.setTimeout=(fn,delay,...args)=>{
    if(delay===36000){const id=nextFakeTimer++;fakeTimers.add(id);callbacks.push(fn);return id;}
    return originalSetTimeout(fn,delay,...args);
  };
  globalThis.clearTimeout=id=>fakeTimers.has(id)?fakeTimers.delete(id):originalClearTimeout(id);
  let releases=[];
  card._weatherRouterDiscovery=()=>new Promise(resolve=>{releases.push(resolve)});
  card._weatherRadarRecoverExpiredRequest=(_now,reason)=>{
    assert.equal(reason,"cold-start-watchdog");
    state.v2Generation++;state.inFlight=false;state.inFlightToken=null;
    state.inFlightStartedAt=0;return true;
  };
  state.coldStartRetries=0;state.pending=false;state.layer=null;state.enabled=true;
  state.inFlight=false;state.inFlightToken=null;state.inFlightStartedAt=0;
  try{
    const scheduledBefore=calls.filter(x=>x.reason==="cold-start-watchdog").length;
    for(let attempt=1;attempt<=4;attempt++){
      state.lastRequestAt=Date.now()-9000;
      const pending=card._refreshWeatherRadar({reason:"watchdog-simulation",force:true});
      await Promise.resolve();
      const timer=callbacks.pop();
      assert.equal(typeof timer,"function","missing watchdog timer attempt "+attempt+" "+JSON.stringify({enabled:state.enabled,inFlight:state.inFlight,token:state.inFlightToken,lastRequestAt:state.lastRequestAt,callbacks:callbacks.length}));
      timer();
      assert.equal(state.coldStartRetries,Math.min(attempt,3));
      releases.pop()({ready:true});
      await pending;
    }
    assert.equal(calls.filter(x=>x.reason==="cold-start-watchdog").length-scheduledBefore,3);
    assert.ok(events.some(x=>x.type==="missing_raster_retry_exhausted"&&x.details.reason==="watchdog"));
  }finally{
    globalThis.setTimeout=originalSetTimeout;globalThis.clearTimeout=originalClearTimeout;
  }
  // Deactivation removes any cold-start retry allowance.
  await card._setWeatherRadarEnabled(false,{persist:false});
  assert.equal(state.coldStartRetries,0);
  console.log("PASS GR-R03-01 cold-start bounded retries, stale-generation guard, previous-layer protection");
}finally{globalThis.document=savedDocument;}
