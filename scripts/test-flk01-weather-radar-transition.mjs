import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {runInNewContext} from "node:vm";

const source=await readFile(new URL("../frontend/modules/weather/precipitation-layer.js",import.meta.url),"utf8");
const start=source.indexOf("  async _weatherRadarApplyReady(answer,viewport,token){");
const end=source.indexOf("\n  async _weatherRadarTryMosaic(",start);
assert.ok(start>0&&end>start,"real V1 transition method can be located");
const methods=runInNewContext("({"+source.slice(start,end)+"})",{
  loadLeafletJs:async()=>({}),setTimeout,clearTimeout,Date,Number,Math,
  finite:value=>Number.isFinite(Number(value))?Number(value):null,
  weatherRadarTimelineModel:()=>({frames:[],currentIndex:-1}),
  V1_LAYER_STAGE_TIMEOUT_MS:90
});
const answer={
  resource:{payload:{tile_url:"https://tiles.example/raster-new/{z}/{x}/{y}",tile_size:256,
    min_zoom:0,max_zoom:7,default_opacity:.58}},
  provenance:{provider_name:"Testquelle"},freshness:{data_time:"2026-10-16T10:00:00Z"}
};
const viewport={signature:"v1",context:{type:"bbox",west:-20,east:20,south:0,north:40}};
class FakeLayer{
  constructor(name){this.name=name;this.handlers=new Map();this.removed=false;this.added=false;this.opacity=-1;}
  on(event,cb){if(!this.handlers.has(event))this.handlers.set(event,new Set());this.handlers.get(event).add(cb);return this;}
  off(event,cb){this.handlers.get(event)?.delete(cb);return this;}
  emit(event){for(const cb of [...(this.handlers.get(event)||[])])cb();}
  addTo(){this.added=true;return this;}
  setOpacity(value){this.opacity=value;return this;}
  remove(){this.removed=true;return this;}
}
const make=()=>{
  const old=new FakeLayer("previous");const layers=[];
  const state={enabled:true,v2Generation:7,v2Snapshot:null,layer:old,
    lastReady:{answer:{provenance:{provider_name:"Vorher"}},at:99},lastUnavailable:null,
    v1PendingLayer:null,v1PendingCancel:null};
  const events=[];
  const view=()=>viewport;
  const ui={
    _map:{},
    _weatherRadarState:()=>state,
    _weatherRadarViewport:view,
    _weatherRadarDescribe:()=>({provider:"Testquelle"}),
    _weatherRadarCreateLayer:(_L,_payload,_attribution,opacity)=>{
      const next=new FakeLayer("next");next.opacity=opacity;next.__grRadarNaturalOpacity=.58;
      layers.push(next);return next;
    },
    _weatherRadarEffectiveOpacity:()=>.64,
    _weatherRadarStopTimelinePlayback:()=>events.push("stop"),
    _weatherRadarClearTimelineStage:()=>events.push("clear-stage"),
    _weatherRadarMountTimelinePlayer:()=>events.push("mount-timeline"),
    _scheduleWeatherRadarPreload:()=>events.push("preload"),
    _weatherRadarRenderCurrentLegend:()=>events.push("legend"),
    _rasterLabRefreshOptions:()=>events.push("lab"),
    _weatherDisplayRefreshRenderedLayers:()=>events.push("style"),
    _weatherDisplaySyncUi:()=>events.push("sync"),
    _weatherRadarUpdateControls:()=>events.push("controls"),
    ...methods
  };
  return {ui,state,old,layers,events};
};
const stage=async fixture=>{
  const done=fixture.ui._weatherRadarApplyReady(answer,viewport,7);
  // Cross-context async module loading settles on a later microtask in Node VM.
  await new Promise(resolve=>setTimeout(resolve,0));
  assert.equal(fixture.layers.length,1,"one staged replacement created");
  assert.equal(fixture.layers[0].added,true,"staged layer already in map");
  return done;
};
{
  const f=make();const done=await stage(f);
  assert.equal(f.old.removed,false,"old raster remains during staging");
  assert.equal(f.state.layer,f.old,"active raster remains unchanged");
  assert.equal(f.layers[0].opacity,0,"new raster remains invisible before tiles load");
  f.layers[0].emit("tileload");
  f.layers[0].emit("tileload");
  f.layers[0].emit("load");
  assert.equal(await done,true);
  assert.equal(f.old.removed,true,"old raster removed only after readiness");
  assert.equal(f.state.layer,f.layers[0],"new layer committed");
  assert.equal(f.layers[0].opacity,.64,"committed raster restored to configured opacity");
  assert.equal(f.state.lastReady.answer,answer,"metadata committed with layer");
  assert.equal(f.state.v1PendingLayer,null);
  assert.equal(f.state.v1PendingCancel,null);
}
{
  const f=make();f.old.__grRadarTileIdentity=[answer.resource.payload.tile_url,256,0,7].join("|");
  assert.equal(await f.ui._weatherRadarApplyReady(answer,viewport,7),true);
  assert.equal(f.layers.length,0,"identical URL never triggers raster recreation");
  assert.equal(f.old.removed,false,"identical raster remains visible");
  assert.equal(f.state.layer,f.old);
  assert.equal(f.state.lastReady.answer,answer,"metadata may refresh without reloading images");
}
{
  const f=make(),original=f.state.lastReady;const done=await stage(f);
  f.layers[0].emit("tileerror");f.layers[0].emit("load");
  assert.equal(await done,false);
  assert.equal(f.old.removed,false);
  assert.equal(f.layers[0].removed,true);
  assert.equal(f.state.layer,f.old);
  assert.equal(f.state.lastReady,original,"failed replacement must not change provider metadata");
}
{
  const f=make(),original=f.state.lastReady;const done=await stage(f);
  f.state.v1PendingCancel();
  assert.equal(await done,false);
  assert.equal(f.layers[0].removed,true);
  assert.equal(f.old.removed,false);
  assert.equal(f.state.lastReady,original);
}
{
  const f=make(),original=f.state.lastReady;const done=await stage(f);
  f.state.v2Generation++;
  f.layers[0].emit("tileload");f.layers[0].emit("load");
  assert.equal(await done,false,"stale map generation does not replace active raster");
  assert.equal(f.layers[0].removed,true);
  assert.equal(f.state.layer,f.old);
  assert.equal(f.state.lastReady,original);
}
{
  const f=make();const done=await stage(f);
  assert.equal(await done,false,"timed out replacement must not be committed");
  assert.equal(f.layers[0].removed,true);
  assert.equal(f.old.removed,false);
  assert.equal(f.state.layer,f.old);
}
{
  const f=make();const done=await stage(f);
  f.state.enabled=false;f.state.v1PendingCancel();
  assert.equal(await done,false,"disabled layer must never be resurrected");
  assert.equal(f.old.removed,false);
  assert.equal(f.layers[0].removed,true);
}
console.log("PASS FLK-01: ready/failed/stale/timeout/canceled/disabled/identical V1 raster transitions");
