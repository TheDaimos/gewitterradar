import test from 'node:test';
import assert from 'node:assert/strict';
import {installWeatherRadar} from '../frontend/modules/weather/precipitation-layer.js';
import {BoundedMosaicRequests} from '../frontend/modules/weather/p7-010/raster-mosaic-consumer.js';
import {sourceTileGrants} from '../frontend/modules/weather/p7-010/nasa-spatial.js';
import {createRasterMosaicGridLayer,loadRasterImage} from '../frontend/modules/weather/p7-010/raster-mosaic-grid-layer.js';
import {drawVerifiedRasterMosaicTile} from '../frontend/modules/weather/p7-010/raster-compositor.js';
import {groupIdenticalLegendScales} from '../frontend/modules/weather/legend-overlay.js';
const tick=()=>new Promise(r=>setImmediate(r));
const NASA='nasa_gibs/satellite_precipitation_imerg_30min';
const source={source_id:NASA,resource_type:'raster_tile',coverage_verified:true,coverage_scope:'global',coverage:{west:-180,east:180,south:-90,north:90},
 tile_url:'https://example.invalid/{z}/{x}/{y}.png',attribution:'Synthetic contract fixture',legend:{unit:'mm/h'},
 semantics:{quantity:'precipitation_rate',unit:'mm/h',measurement_method:'satellite_precipitation_estimate',observation_kind:'estimate'},
 times:{valid_at:new Date().toISOString(),retrieved_at:new Date().toISOString(),valid_until:new Date(Date.now()+3600000).toISOString(),reference_delta_seconds:0},
 render:{min_zoom:0,max_zoom:2,tile_size:256,opacity:1},spatial_policy:{kind:'exclusive_tiles_v1',zoom:2,tiles:[[0,1]],padding_factor:1.3,reservation_status:'verified_envelopes'},
 transport_policy:{max_parallel_downloads:6,settings_revision:1}};
const urls=t=>`https://example.invalid/${t.z}/${t.x}/${t.y}.png`;
test('all map zooms 0..18 compose granted descendants or crop the correct ancestor',()=>{
 for(let z=0;z<=18;z++){
  const coords=z<2?{z,x:0,y:0}:{z,x:0,y:2**(z-2)};
  const grants=sourceTileGrants(source,coords);assert.equal(grants.length,1,'map zoom '+z);
  const calls=[],context={globalAlpha:1,drawImage:(...args)=>calls.push(args)};
  const result=drawVerifiedRasterMosaicTile(context,coords,[{...source,image:{width:256,height:256},_p7SourceTile:grants[0]}]);
  assert.equal(result.drawn.length,1,'map zoom '+z);
  const [,, ,sw,sh,dx,dy,dw,dh]=calls[0];
  assert(sw>0&&sh>0&&dw>0&&dh>0);assert(dx>=0&&dy>=0&&dx+dw<=256.00001&&dy+dh<=256.00001);
  if(z===0)assert.deepEqual(calls[0].slice(5),[0,64,64,64]);
 }
});
test('one low-zoom canvas keeps radar independent of NASA and revokes only granted NASA rectangles',async()=>{
 const draws=[],clears=[],events=[];let resolveNASA,done=0;
 const context={globalAlpha:1,drawImage:(...args)=>draws.push(args),clearRect:(...args)=>clears.push(args)};
 const L={GridLayer:{extend(methods){return class{constructor(){Object.assign(this,methods);}on(){}};}}};
 const radar={...source,source_id:'dwd/radar_precipitation',spatial_policy:undefined,transport_policy:undefined,coverage_scope:'bbox',coverage:{west:0,east:90,south:0,north:66.51326044311186}};
 const layer=createRasterMosaicGridLayer(L,{contract_version:2,capability:'weather.precipitation.layer',status:'partial',viewport:source.coverage,layers:[radar,source]},
 {createCanvas:()=>({getContext:()=>context}),loadImage:(_u,s)=>s.source_id===NASA?new Promise(r=>resolveNASA=r):Promise.resolve({width:256,height:256,id:'radar'}),onTileDiagnostics:v=>events.push(v)});
 layer.createTile({z:0,x:0,y:0},error=>{assert.equal(error,null);done++;});await tick();
 assert.equal(done,1);assert.equal(draws.length,1,'radar mounts before slow NASA');assert.equal(draws[0][0].id,'radar');
 assert(events.some(e=>e.deferred&&e.radar_expected));resolveNASA({width:256,height:256,id:'nasa'});await tick();
 assert.equal(draws.length,2);assert.deepEqual(draws[1].slice(5),[0,64,64,64]);
 layer._p7RevokeDeferredNASA();assert.deepEqual(clears,[[0,64,64,64]]);layer._p7AbortPending();
});
test('Karibik/Hamburg/Atlantik/Europa changes bypass periodic and cold retry intervals',async()=>{
 class Card{};installWeatherRadar(Card);const card=new Card(),state={enabled:true,lastRequestAt:Date.now(),lastViewport:'old',viewportRefreshIntervalSeconds:15,v2Generation:0};
 const planned=[];let view;
 card._weatherRadarState=()=>state;card._weatherRadarEnsureMapHooks=()=>true;card._weatherRadarViewport=()=>view;
 card._weatherRadarCullOutsideViewport=()=>{};card._weatherRadarRecoverExpiredRequest=()=>{};card._weatherRadarUpdateControls=()=>{};
 card._weatherRouterDiscovery=async()=>({ready:true});card._weatherRadarTryMosaic=async v=>{planned.push(v.signature);state.layer={};return true;};
 for(const signature of ['Karibik','Hamburg','Karibik','Europa','Atlantik','Europa']){view={signature};await card._refreshWeatherRadar({reason:'viewport'});}
 assert.deepEqual(planned,['Karibik','Hamburg','Karibik','Europa','Atlantik','Europa']);
 state.layer=null;view={signature:'new-cold-region'};await card._refreshWeatherRadar({reason:'viewport'});assert.equal(planned.at(-1),'new-cold-region');
});
test('map event bursts debounce once; zoom and size participate in the viewport key',t=>{
 t.mock.timers.enable({apis:['setTimeout']});class Card{};installWeatherRadar(Card);const card=new Card();
 const state={enabled:true,v2Generation:0},handlers=new Map(),calls=[];let zoom=5,width=800,west=-80;
 card._weatherRadarState=()=>state;card._weatherRadarCullOutsideViewport=()=>{};card._weatherRadarVisualAudit=()=>{};card._scheduleWeatherRadarPreload=()=>{};
 card._refreshWeatherRadar=async args=>calls.push(args);
 card._map={getBounds:()=>({getWest:()=>west,getEast:()=>west+10,getNorth:()=>30,getSouth:()=>10}),getCenter:()=>({lat:20,lng:west+5}),getZoom:()=>zoom,getSize:()=>({x:width,y:600}),on:(event,fn)=>handlers.set(event,fn)};
 card._weatherRadarEnsureMapHooks();handlers.get('moveend')();handlers.get('zoomend')();width=900;handlers.get('resize')();zoom=6;handlers.get('zoomend')();
 t.mock.timers.tick(249);assert.equal(calls.length,0);t.mock.timers.tick(1);assert.equal(calls.length,1);
 const key=card._weatherRadarViewport().signature;width++;assert.notEqual(card._weatherRadarViewport().signature,key);
});
test('superseded responses never hold the latest request behind an unbounded local lock',async()=>{
 const broker=new BoundedMosaicRequests(),a=new AbortController(),b=new AbortController();let ra,rb,starts=[];
 const pa=broker.run(()=>new Promise(r=>{starts.push('a');ra=r;}),{signal:a.signal}).catch(e=>e.code);
 await tick();a.abort();const pb=broker.run(()=>new Promise(r=>{starts.push('b');rb=r;}),{signal:b.signal}).catch(e=>e.code);
 await tick();b.abort();const pc=broker.run(async()=>{starts.push('obsolete');return 3;}).catch(e=>e.code);
 const pd=broker.run(async()=>{starts.push('latest');return 4;});await tick();assert.deepEqual(starts,['a','b']);assert.equal(broker.active,2);
 ra(1);assert.equal(await pd,4);rb(2);await Promise.all([pa,pb,pc]);assert.deepEqual(starts,['a','b','latest']);await tick();assert.equal(broker.active,0);
});
test('WR controls 6/32 concurrency independently of the 48-tile and 128-image limits; visible tiles lead',async()=>{
 const manager=await import('../frontend/modules/weather/p7-010/nasa-spatial.js?performance-limits');
 for(const max of [6,32]){
  const tiles=Array.from({length:48},(_v,i)=>[i%8,Math.floor(i/8)]),pending=[],started=[];let active=0,peak=0;
  const lease=manager.leaseNasaTiles({...source,spatial_policy:{...source.spatial_policy,zoom:3,tiles},transport_policy:{max_parallel_downloads:max,settings_revision:max}},urls,
   async url=>{active++;peak=Math.max(peak,active);started.push(url);await new Promise(r=>pending.push(r));active--;return {width:256,height:256};});
  const visible=lease.image({x:7,y:5});await tick();assert.equal(started.length,max);assert.equal(started[0],urls({z:3,x:7,y:5}));assert.equal(lease.diagnostic().configured_parallelism,max);
  for(let batch=0;batch<10&&started.length<48;batch++){pending.splice(0).forEach(r=>r());await tick();}
  pending.splice(0).forEach(r=>r());await visible;await tick();assert(peak<=max);assert.equal(lease.diagnostic().max_live_entries,128);lease.release();
 }
});
test('429/503/timeout overloads reduce actual concurrency, honor Retry-After and recover gradually',async()=>{
 for(const type of [429,503,'timeout']){
  const manager=await import('../frontend/modules/weather/p7-010/nasa-spatial.js?overload-'+type),counts=new Map(),times=[];
  const tiles=Array.from({length:16},(_v,i)=>[i%4,Math.floor(i/4)]);
  const lease=manager.leaseNasaTiles({...source,spatial_policy:{...source.spatial_policy,tiles},transport_policy:{max_parallel_downloads:6,settings_revision:1}},urls,
   async url=>{counts.set(url,(counts.get(url)||0)+1);times.push(Date.now());
    if(counts.get(url)===1&&(url.endsWith('/0/0.png')||type==='timeout'&&url.endsWith('/1/0.png')))throw type==='timeout'?Object.assign(Error('timeout'),{code:'nasa_transport_timeout'}):Object.assign(Error('overloaded'),{httpStatus:type,retryAfterMs:80});
    return {width:256,height:256};});
  const images=tiles.map(([x,y])=>lease.image({x,y}));await tick();const reduced=lease.diagnostic();assert(reduced.effective_parallelism<6);assert(reduced.overload_limit);
  await Promise.all(images);const after=lease.diagnostic();assert(after.effective_parallelism<=6);assert(after.effective_parallelism>reduced.effective_parallelism);assert(after.retried_attempts>=1);
  assert.equal(counts.get(urls({z:2,x:3,y:3})),1,'successful sibling is not redownloaded');lease.release();
 }
});
test('NASA HTTP errors expose status and Retry-After without HA credentials',async t=>{
 t.mock.method(globalThis,'fetch',async(_url,options)=>{assert.equal(options.cache,'no-store');assert.equal(options.credentials,'omit');assert.equal(options.headers,undefined);return new Response(null,{status:429,headers:{'Retry-After':'2'}});});
 await assert.rejects(loadRasterImage('https://example.invalid/0/0/0.png',source),e=>e.httpStatus===429&&e.retryAfterMs===2000);
});
test('legend grouping requires complete identical entries, including the lower trace boundary',()=>{
 const entry={value:.1,label:'0.1–<0.2',color:'#33ffff'},dwd={source:'dwd/radar_precipitation',family:'precipitation',quantity:'precipitation_rate',unit:'mm/h',title:'DWD',entries:[entry]};
 const opera={...dwd,source:'opera/opera_rate_raster',title:'OPERA'};assert.equal(groupIdenticalLegendScales([dwd,opera]).length,1);
 assert.equal(groupIdenticalLegendScales([dwd,{...opera,entries:[{...entry,value:0,label:'>0–<0.2'}]}]).length,2);
});
test('late metadata hints replan the current viewport and max-only updates preserve active pixels',async()=>{
 class Card{};installWeatherRadar(Card);const card=new Card(),callbacks=new Map(),refreshes=[],state={enabled:false,v2Generation:1};
 card._weatherRadarState=()=>state;card._weatherRadarUpdateControls=()=>{};card._weatherRadarEnsureMapHooks=()=>{};card._refreshWeatherRadar=async()=>{};
 card._scheduleWeatherRadarRefresh=(...args)=>refreshes.push(args);
 card._hass={connection:{subscribeEvents:async(fn,type)=>{callbacks.set(type,fn);return ()=>{};}}};
 await card._setWeatherRadarEnabled(true,{persist:false});await tick();clearInterval(state.refreshTimer);
 let revoked=0,configured=0;state.layer={_p7RevokeDeferredNASA(){revoked++;},_p7ConfigureNASATransport(p){configured=p.max_parallel_downloads;}};
 callbacks.get('weather_router_routing_changed')({data:{nasa_transport_changed:true,nasa_transport_policy:{max_parallel_downloads:32,settings_revision:2}}});
 assert.equal(configured,32);assert.equal(revoked,0);
 const abort=new AbortController();state.inFlight=true;state.requestAbort=abort;
 state.v2PendingLayer={_p7RasterRequestBudget:{imageCache:new Map([['successful-tile',{}]])},_p7Snapshot:{layers:[]},_p7AbortPending(){},remove(){}};
 callbacks.get('weather_router_routing_changed')({data:{nasa_metadata_ready:true}});
 assert(abort.signal.aborted);assert.equal(state.inFlight,false);assert(state.replacementCache.images.has('successful-tile'));
 assert.equal(refreshes.at(-1)[1],0);state.wrCycleSubscription?.unsubscribe?.();state.wrPolicySubscription?.unsubscribe?.();
});
test('NASA pending retry is not overwritten by the eight-second cold image retry',async t=>{
 t.mock.timers.enable({apis:['setTimeout']});class Card{};installWeatherRadar(Card,{loadLeafletJs:async()=>({GridLayer:{extend(){}}})});const card=new Card();
 const state={enabled:true,v2Generation:1,lastViewport:'before',coldStartRetries:0,viewportRefreshIntervalSeconds:15},view={signature:'current',context:source.coverage,focus:{latitude:20,longitude:-80}};let calls=0;
 card._weatherRadarState=()=>state;card._weatherRadarEnsureMapHooks=()=>true;card._weatherRadarViewport=()=>view;card._weatherRadarCullOutsideViewport=()=>{};card._weatherRadarRecoverExpiredRequest=()=>{};card._weatherRadarUpdateControls=()=>{};
 card._map={getSize:()=>({x:256,y:256}),getZoom:()=>2};
 card._weatherRouterDiscovery=async()=>({ready:true});
 card._hass={callWS:async()=>{calls++;return {contract_version:2,capability:'weather.precipitation.layer',status:'unavailable',viewport:source.coverage,layers:[],nasa_mosaic:{enabled:true,metadata_pending:true,planning_cycle:'same-shared-job'}};}};
 const trace={};card._weatherEngineTraceStore=()=>trace;
 await card._refreshWeatherRadar({reason:'viewport'});assert.equal(calls,1,JSON.stringify(trace));
 t.mock.timers.tick(2000);t.mock.timers.tick(1);await tick();assert.equal(calls,2,'replan at two seconds, not after eight seconds');state.enabled=false;
});
