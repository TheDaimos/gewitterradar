import test from 'node:test';
import assert from 'node:assert/strict';
import {validateSpatialPolicy,sourceTileGrant,leaseNasaTiles} from '../frontend/modules/weather/p7-010/nasa-spatial.js';
import {createRasterMosaicGridLayer} from '../frontend/modules/weather/p7-010/raster-mosaic-grid-layer.js';
import {buildRasterMosaicV2Request} from '../frontend/modules/weather/p7-010/raster-mosaic-consumer.js';
import {readFileSync} from 'node:fs';
import {installWeatherRadar} from '../frontend/modules/weather/precipitation-layer.js';
const NASA='nasa_gibs/satellite_precipitation_imerg_30min';
const future=new Date(Date.now()+3600000).toISOString(),now=new Date().toISOString();
const policy={kind:'exclusive_tiles_v1',zoom:2,tiles:[[0,1],[1,1]],padding_factor:1.3,reservation_status:'verified_envelopes'};
const source={source_id:NASA,spatial_policy:policy,resource_type:'raster_tile',coverage_verified:true,coverage_scope:'global',
 coverage:{west:-180,east:180,south:-90,north:90},tile_url:'https://example.invalid/{z}/{x}/{y}.png',attribution:'Synthetic',legend:{unit:'mm/h'},
 semantics:{quantity:'precipitation_rate',unit:'mm/h',measurement_method:'satellite_precipitation_estimate',observation_kind:'estimate'},
 times:{valid_at:now,retrieved_at:now,reference_delta_seconds:0,valid_until:future},render:{tile_size:256,min_zoom:0,max_zoom:2,opacity:1}};
const url=t=>`https://example.invalid/${t.z}/${t.x}/${t.y}.png`;
const tick=()=>new Promise(resolve=>setImmediate(resolve));
test('WR grants alone control NASA tiles including overzoom, dateline and expiry',()=>{
 validateSpatialPolicy(source);
 assert.deepEqual(sourceTileGrant(source,{z:4,x:1,y:5}),{z:2,x:0,y:1});
 assert.deepEqual(sourceTileGrant(source,{z:2,x:4,y:1}),{z:2,x:0,y:1});
 assert.equal(sourceTileGrant(source,{z:2,x:3,y:1}),null);
 assert.equal(sourceTileGrant(source,{z:1,x:0,y:0}),null);
 assert.equal(sourceTileGrant(source,{z:2,x:0,y:1},Date.parse(future)),null);
 assert.throws(()=>validateSpatialPolicy({...source,source_id:'dwd/radar_precipitation'}));
 assert.throws(()=>validateSpatialPolicy({...source,spatial_policy:{...policy,reservation_status:'unknown_primary_coverage'}}));
 assert.throws(()=>validateSpatialPolicy({...source,spatial_policy:{...policy,tiles:[[0,1],[0,1]]}}));
});
test('temporary live owners deduplicate and release, with two global transports',async()=>{
 let calls=0,active=0,peak=0;const release=[];
 const load=async()=>{calls++;active++;peak=Math.max(peak,active);await new Promise(r=>release.push(r));active--;return {width:256,height:256};};
 const a=leaseNasaTiles(source,url,load),b=leaseNasaTiles(source,url,load);
 await tick();assert.equal(calls,2);assert.equal(peak,2);assert.equal(a.diagnostic().live_entries,2);
 release.splice(0).forEach(r=>r());await Promise.all([a.image({x:0,y:1}),b.image({x:0,y:1})]);
 a.release();assert.equal(b.diagnostic().live_entries,2);b.release();assert.equal(b.diagnostic().live_entries,0);
 const c=leaseNasaTiles(source,url,async()=>({width:256,height:256}));await c.image({x:0,y:1});c.release();
 assert.equal(c.diagnostic().live_entries,0,'no retained historical frame cache');
});
test('only failed NASA source coordinate retries; release aborts pending images',async()=>{
 const calls=new Map();
 const a=leaseNasaTiles(source,url,async u=>{calls.set(u,(calls.get(u)||0)+1);if(u.includes('/0/')&&calls.get(u)===1)throw Error('synthetic');return {width:256,height:256};});
 await Promise.all([a.image({x:0,y:1}),a.image({x:1,y:1})]);
 assert.equal(calls.get(url({z:2,x:0,y:1})),2);assert.equal(calls.get(url({z:2,x:1,y:1})),1);a.release();
 let aborted=0;
 const b=leaseNasaTiles(source,url,(_u,_s,{signal})=>new Promise((_r,reject)=>signal.addEventListener('abort',()=>{aborted++;reject(Error('cancelled'));},{once:true})));
 const image=b.image({x:0,y:1});await tick();b.release();await assert.rejects(image);await tick();
 assert.equal(aborted,2);assert.equal(b.diagnostic().live_entries,0);
});
test('NASA settles grid immediately, paints asynchronously, and cancelled generations cannot paint',async()=>{
 const callbacks=[],resolvers=[];let paints=0,done=0;
 const L={GridLayer:{extend(methods){return class{constructor(){Object.assign(this,methods);}on(){}};}}};
 const context={drawImage(){paints++;},globalAlpha:1};
 const snapshot={contract_version:2,capability:'weather.precipitation.layer',status:'partial',viewport:source.coverage,layers:[source],nasa_mosaic:{enabled:true}};
 const layer=createRasterMosaicGridLayer(L,snapshot,{createCanvas:()=>({getContext:()=>context}),onTileDiagnostics:item=>callbacks.push(item),
  loadImage:()=>new Promise(resolve=>resolvers.push(resolve))});
 layer.createTile({z:2,x:0,y:1},error=>{assert.equal(error,null);done++;});await tick();
 assert.equal(done,1);assert.equal(paints,0);assert.equal(callbacks[0].tile_status,'deferred_authorized');
 resolvers.splice(0).forEach(r=>r({width:256,height:256}));await tick();assert.equal(paints,1);
 assert.equal(callbacks.at(-1).tile_status,'complete_verified_coverage');layer._p7AbortPending();
 const old=createRasterMosaicGridLayer(L,snapshot,{createCanvas:()=>({getContext:()=>context}),loadImage:()=>new Promise(r=>resolvers.push(r))});
 old.createTile({z:2,x:0,y:1},()=>{});await tick();old._p7AbortPending();resolvers.splice(0).forEach(r=>r({width:256,height:256}));await tick();assert.equal(paints,1);
});
test('geometry is additive; GR adds no NASA age threshold or provider list',()=>{
 const args={viewport:source.coverage,focus:{latitude:0,longitude:0}};
 assert.equal(buildRasterMosaicV2Request(args).context.tile_zoom,undefined);
 const request=buildRasterMosaicV2Request({...args,renderZoom:5});assert.equal(request.context.tile_zoom,5);
 assert.deepEqual(Object.keys(request.time).sort(),['allow_older_satellite_background','mode']);
 assert.equal(request.providers,undefined);
});
test('all live generations share the finite decoded-image bound; retired grants clear only NASA canvases',async()=>{
 const tiles=Array.from({length:48},(_v,i)=>[i%8,Math.floor(i/8)]);
 const owners=Array.from({length:4},(_v,i)=>leaseNasaTiles({...source,times:{...source.times,valid_at:String(i)},spatial_policy:{...policy,zoom:3,tiles}},url,async()=>({width:256,height:256})));
 assert.equal(owners[0].diagnostic().live_entries,128);assert.equal(owners[0].diagnostic().estimated_decoded_bytes,33554432);
 owners.forEach(o=>o.release());await tick();assert.equal(owners[0].diagnostic().live_entries,0);
 let clears=0;
 const L={GridLayer:{extend(methods){return class{constructor(){Object.assign(this,methods);}on(){}};}}};
 const layer=createRasterMosaicGridLayer(L,{contract_version:2,capability:'weather.precipitation.layer',status:'partial',viewport:source.coverage,layers:[source]},
  {createCanvas:()=>({getContext:()=>({globalAlpha:1,drawImage(){},clearRect(){clears++;}})}),loadImage:async()=>({width:256,height:256})});
 layer.createTile({z:2,x:0,y:1},()=>{});await tick();layer._p7RevokeDeferredNASA();assert.equal(clears,1);assert.equal(layer._p7NASADiagnostics().live_entries,0);layer._p7AbortPending();
 const runtime=readFileSync(new URL('../frontend/modules/weather/precipitation-layer.js',import.meta.url),'utf8');
 const method=runtime.slice(runtime.indexOf('  async _weatherRadarTryMosaic('),runtime.indexOf('\n  _',runtime.indexOf('  async _weatherRadarTryMosaic(')+40));
 assert.doesNotMatch(method,/return false;/,'active WR spatial policy must never fall through to unrestricted V1 imagery');
 assert.match(method,/state\.nasaMosaicEnabled=result\.response\.nasa_mosaic\?\.enabled===true/);
});
test('real GR staging waits for first NASA-only paint, but mixed radar mounts without waiting for NASA',async()=>{
 const priorImage=globalThis.Image,priorDocument=globalThis.document;
 let delay=450;
 globalThis.Image=class{width=256;height=256;set src(value){if(value)setTimeout(()=>this.onload?.(),value.includes('/radar/')?0:delay);}};
 globalThis.document={createElement:()=>({getContext:()=>({globalAlpha:1,drawImage(){},clearRect(){}})})};
 try{for(const mixed of [false,true]){
  const coords=mixed?[{z:2,x:0,y:1},{z:2,x:1,y:1},{z:2,x:2,y:1}]:[{z:2,x:0,y:1}];
  const L={GridLayer:{extend(methods){return class{
   constructor(options){this.options=options;this.events=new Map();Object.assign(this,methods);}
   on(type,handler){this.events.set(type,handler);}
   addTo(){let settled=0;coords.forEach(tile=>this.createTile(tile,()=>{if(++settled===coords.length)this.events.get('load')?.();}));}
   setOpacity(){}remove(){this.events.get('remove')?.();}
  };}}};
  class Card{};installWeatherRadar(Card,{loadLeafletJs:async()=>L});const card=new Card();
  const state={enabled:true,v2Generation:1,layer:null};card._weatherRadarState=()=>state;
  const viewport={signature:'synthetic',context:{west:-180,east:mixed?90:-90,south:0,north:66.51326044311186},focus:{latitude:20,longitude:-130}};
  card._weatherRadarViewport=()=>viewport;
  card._map={getSize:()=>({x:mixed?768:256,y:256}),getZoom:()=>2,getPane:()=>true,
   getBounds:()=>({getNorthWest:()=>({x:0,y:256}),getSouthEast:()=>({x:mixed?768:256,y:512})}),project:value=>value};
  const layers=[{...source,spatial_policy:{...policy,tiles:[[0,1]]}}];
  if(mixed)layers.unshift({...source,source_id:'dwd/radar_precipitation',tile_url:'https://example.invalid/radar/{z}/{x}/{y}.png',spatial_policy:undefined,coverage_scope:'bbox',coverage:{west:0,east:90,south:0,north:66.51326044311186}});
  const answer={contract_version:2,capability:'weather.precipitation.layer',status:'partial',viewport:viewport.context,layers,nasa_mosaic:{enabled:true}};
  card._hass={callWS:async()=>answer};
  for(const method of ['_weatherRadarClearRegionalHold','_weatherRadarRemoveTimelinePlayer','_weatherRadarClearPreload','_weatherRadarRenderCurrentLegend','_weatherRadarUpdateControls','_weatherRadarVisualAudit','_scheduleWeatherRadarRefresh'])card[method]=()=>{};
  card._weatherRadarPreviousValid=()=>false;card._weatherRadarRetainRegionalMosaic=()=>false;card._weatherRadarEffectiveOpacity=()=>1;
  const events=[];card._weatherEngineMonitorEvent=(name,value)=>events.push({name,...value});
  delay=mixed?1400:450;const start=Date.now();
  assert.equal(await card._weatherRadarTryMosaic(viewport,1),true);
  assert.equal(state.v2Snapshot,answer,JSON.stringify(events));
  if(mixed){assert(Date.now()-start<1000,'slow NASA must not block radar');assert.equal(state.v2RenderMetrics.painted_nasa_tiles,0);}
  else{assert.equal(state.v2RenderMetrics.painted_nasa_tiles,1);assert(Date.now()-start>=400);}
  state.layer._p7AbortPending();
  card._hass.callWS=async()=>({...answer,status:'unavailable',layers:[],nasa_mosaic:{enabled:true,metadata_pending:true,planning_cycle:'synthetic'}});
  assert.equal(await card._weatherRadarTryMosaic(viewport,1),true,'pending spatial policy blocks legacy V1 fallback');
 }}finally{if(priorImage===undefined)delete globalThis.Image;else globalThis.Image=priorImage;if(priorDocument===undefined)delete globalThis.document;else globalThis.document=priorDocument;}
});
