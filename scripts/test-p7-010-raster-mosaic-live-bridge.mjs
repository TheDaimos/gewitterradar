import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const source=readFileSync(new URL("../frontend/modules/weather/precipitation-layer.js",import.meta.url),"utf8");
const signature="  async _weatherRadarTryMosaic(viewport){";
const begin=source.indexOf(signature);
const end=source.indexOf("\n  _weatherRadarNaturalOpacity(){",begin);
assert.ok(begin>=0&&end>begin,"V4.11.82 must contain opt-in V2 renderer path");
const body=source.slice(begin+signature.length,end).replace(/\n  \},\s*$/,"");
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
const execute=new AsyncFunction(
  "viewport","loadLeafletJs","prepareRasterMosaicV2",
  "promotePreparedRasterMosaic",body
);
const viewport={context:{type:"bbox",west:-180,south:-80,east:180,north:80},
 signature:"world|DE",focus:{latitude:12,longitude:23}};
const reply={
 mode:"v2",layer:{removed:0,remove(){this.removed++;}},
 response:{contract_version:2,status:"partial",reference_time:"2026-10-15T19:00:00Z",
  layers:[{source_id:"test-global",attribution:"synthetic",
    semantics:{quantity:"precipitation_rate",unit:"mm/h",measurement_method:"radar"},
    times:{valid_at:"2026-10-15T19:00:00Z"}}],limitations:["Pixels partially verified"]}
};
function harness({optIn=true,ready=true,promoted=true,stale=false}={}){
 const map={getPane:()=>({style:{}})};
 const old={removed:0,remove(){this.removed++;}};
 const state={enabled:true,mosaicOptIn:optIn,layer:old,mosaicSnapshot:null};
 const counters={ws:0,prepared:0,staged:0,rendered:0};
 const context={
  _map:map,_hass:ready?{callWS:async()=>{counters.ws++;return {};}}:{},
  _weatherRadarState:()=>state,
  _weatherRadarViewport:()=>({...viewport,signature:stale?"moved":viewport.signature}),
  _weatherRadarEffectiveOpacity:()=>.7,
  _weatherRadarRemoveTimelinePlayer:()=>{},
  _weatherRadarClearPreload:()=>{},
  _weatherDisplayRefreshRenderedLayers:()=>{},
  _rasterLabRefreshOptions:()=>{},
  _weatherRadarRenderCurrentLegend:()=>{},
  _weatherRadarUpdateControls:()=>{}
 };
 const loadLeafletJs=async()=>({});
 const prepareRasterMosaicV2=async q=>{
  counters.prepared++;
  assert.equal(q.maxLayers,12);
  assert.equal(q.maxTileRequests,48);
  assert.deepEqual(q.focus,viewport.focus);
  if(!ready)return {mode:"fallback",reason:"endpoint_not_available"};
  q.layerOptions.onTileDiagnostics({
    drawn:[{source_id:"test-global"}],requests_used:3
  });
  return {...reply,layer:{...reply.layer}};
 };
 const promotePreparedRasterMosaic=async arg=>{
   counters.staged++;
   assert.equal(arg.timeoutMs,9000);
   assert.equal(arg.hasPainted(),true);
   return promoted;
 };
 return {context,state,old,counters,loadLeafletJs,
  prepareRasterMosaicV2,promotePreparedRasterMosaic};
}
async function run(settings){
 const h=harness(settings);
 const result=await execute.call(h.context,viewport,h.loadLeafletJs,
   h.prepareRasterMosaicV2,h.promotePreparedRasterMosaic);
 return {h,result};
}
const off=await run({optIn:false});
assert.equal(off.result,false);
assert.equal(off.h.counters.prepared,0);
assert.equal(off.h.old.removed,0);

const missing=await run({ready:false});
assert.equal(missing.result,false);
assert.equal(missing.h.old.removed,0);

const failed=await run({promoted:false});
assert.equal(failed.result,false);
assert.equal(failed.h.old.removed,0);
assert.equal(failed.h.state.mosaicSnapshot,null);

const stale=await run({stale:true});
assert.equal(stale.result,false);
assert.equal(stale.h.old.removed,0);

const good=await run({});
assert.equal(good.result,true);
assert.equal(good.h.old.removed,1);
assert.equal(good.h.state.mosaicSnapshot.sourceCount,1);
assert.equal(good.h.state.mosaicSnapshot.paintedTiles,1);
assert.equal(good.h.state.mosaicSnapshot.requestsUsed,3);
assert.equal(good.h.state.mosaicSnapshot.status,"partial");
assert.equal(good.h.counters.prepared,1);
assert.equal(good.h.counters.staged,1);
console.log("P7-010 real GR method opt-in, V1 fallback, and V2 promotion PASS");
