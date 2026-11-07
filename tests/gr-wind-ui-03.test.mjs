import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {WIND_SPEED,WIND_DIRECTION,WIND_COLORS,BEAUFORT_LIMITS,WIND_STORAGE,normalizeWindConfig,readWindConfig,windBarbParts,windVector,windDestination,beaufort,combineWindPoint,windQueryPoints,windSpeedText} from '../frontend/modules/weather/wind-data.js';
import {WindCanvas,projectedWind,visibleWindCopies} from '../frontend/modules/weather/wind-canvas.js';
import {installWeatherWind} from '../frontend/modules/weather/wind-display.js';
const answer=(id,value)=>({status:'ready',capability:id,resource:{type:'value',semantics:{quantity:id===WIND_SPEED?'wind_speed':'wind_from_direction',observation_kind:'forecast'},payload:{values:{[id]:{value,unit:id===WIND_SPEED?'m/s':'°',valid_at:'2026-11-06T21:00:00Z'}}}},provenance:{provider_id:'fixture',attribution:'Synthetic test provider'},freshness:{stale:false}});
const point={type:'point',latitude:50,longitude:8};
test('wind barbs: calm, nearest five knots, half/full/pennant and combined speeds',()=>{
 const at=kn=>windBarbParts(kn*1.852/3.6);
 assert.equal(at(0).calm,true);assert.equal(at(2.49).rounded,0);assert.equal(at(2.51).rounded,5);
 assert.deepEqual([at(5).half,at(10).full,at(50).pennants],[1,1,1]);
 for(const kn of [5,10,15,25,50,65,100,155]){const b=at(kn);assert.equal(b.pennants*50+b.full*10+b.half*5,kn);}
 assert.equal(windBarbParts(NaN),null);assert.equal(windBarbParts(-1),null);
});
test('meteorological FROM becomes flow TO; geodesic projection respects cardinal directions and rotation',()=>{
 for(const [from,u,v] of [[0,0,-10],[90,-10,0],[180,0,10],[270,10,0]]){const got=windVector(10,from);assert(Math.abs(got.u-u)<1e-10);assert(Math.abs(got.v-v)<1e-10);}
 assert(windDestination(50,8,0).lat<50);assert(windDestination(50,8,270).lng>8);
 const map={latLngToContainerPoint:([lat,lon])=>({x:lon,y:-lat})},p={lat:0,lon:0,from:0};
 assert(Math.abs(projectedWind(map,p).angle-Math.PI/2)<1e-6);
 map.latLngToContainerPoint=([lat,lon])=>({x:lat,y:lon});assert(Math.abs(Math.abs(projectedWind(map,p).angle)-Math.PI)<1e-6);
});
test('Beaufort intervals and exact unit conversion do not mutate source values',()=>{
 BEAUFORT_LIMITS.forEach((v,i)=>{assert.equal(beaufort(v),i);if(i)assert.equal(beaufort(v-1e-8),i-1);});
 assert.equal(beaufort(-1),null);assert.equal(beaufort(NaN),null);assert.equal(beaufort(80),12);
 assert.match(windSpeedText(1.852/3.6,'kn'),/^1 kn$/);assert.equal(windSpeedText(10,'km/h'),'36 km/h');
});
test('WR point pairs require ready state, proper units, quantity, provider, instant and quality',()=>{
 const speed=answer(WIND_SPEED,10),direction=answer(WIND_DIRECTION,270),result=combineWindPoint(speed,direction,point);
 assert.equal(result.u,10);assert.equal(result.height,10);assert.equal(result.kind,'forecast');
 assert.equal(combineWindPoint(answer(WIND_SPEED,0),null,point).speed,0);
 for(const change of [d=>d.status='unavailable',d=>d.freshness.stale=true,d=>d.resource.payload.values[WIND_DIRECTION].unit='rad',d=>d.resource.payload.values[WIND_DIRECTION].value=NaN,d=>d.resource.payload.values[WIND_DIRECTION].value=null,d=>d.resource.payload.values[WIND_DIRECTION].value=-1,d=>d.resource.payload.values[WIND_DIRECTION].valid=false,d=>d.resource.payload.values[WIND_DIRECTION].nodata=true,d=>d.provenance.provider_id='other',d=>d.resource.payload.values[WIND_DIRECTION].valid_at='2026-11-06T22:00:00Z',d=>d.resource.semantics.observation_kind='observation',d=>d.resource.semantics.quantity='gust_direction']){
  const d=structuredClone(direction);change(d);assert.throws(()=>combineWindPoint(speed,d,point));
 }
 assert.throws(()=>combineWindPoint(answer(WIND_SPEED,-1),direction,point));assert.throws(()=>combineWindPoint(speed,direction,{...point,latitude:NaN}));
 // No GR age cutoff: WR can authorize a forecast time; ready is authoritative.
 speed.resource.payload.values[WIND_SPEED].valid_at='2030-01-01T00:00:00Z';direction.resource.payload.values[WIND_DIRECTION].valid_at='2030-01-01T00:00:00Z';assert.equal(combineWindPoint(speed,direction,point).validAt,'2030-01-01T00:00:00.000Z');
});
test('eight central colours, opt-in defaults and durable settings preserve independent preferences',()=>{
 assert.equal(WIND_COLORS.length,8);assert.equal(new Set(WIND_COLORS.map(v=>v.hex)).size,8);
 assert.equal(normalizeWindConfig().visible,false);assert.equal(normalizeWindConfig().mode,'barbs');assert.equal(normalizeWindConfig().animationExplicit,false);
 const all={enabled:true,mode:'animated',color:'violet',colorMode:'pressure',highColor:'gold',lowColor:'blue',tempo:'fast',density:'high',paused:true,colorField:true,fieldOpacity:64,unit:'kn',animationExplicit:true,legendPosition:{x:.3,y:.7},legendUi:{view:'classes',rain:true,snow:false}};
 const saved=normalizeWindConfig(all);assert.deepEqual(readWindConfig({getItem:key=>{assert.equal(key,WIND_STORAGE);return JSON.stringify(saved);}}),saved);
 assert.equal(normalizeWindConfig({fieldOpacity:999}).fieldOpacity,100);assert.equal(normalizeWindConfig({mode:'junk',color:'red'}).mode,'barbs');
});
test('viewport query points canonicalize identical world copies; rendering uses copies without extra point resolves',()=>{
 const map={getSize:()=>({x:900,y:600}),containerPointToLatLng:([x,y])=>({lat:y/100,lng:x/100+360})};
 const a=windQueryPoints(map);map.containerPointToLatLng=([x,y])=>({lat:y/100,lng:x/100});assert.deepEqual(windQueryPoints(map),a);assert.equal(a.length,9);
 map.getBounds=()=>({getWest:()=>-360,getEast:()=>360});map.latLngToContainerPoint=([lat,lon])=>({x:450+lon,y:300-lat});
 assert.equal(visibleWindCopies(map,[{lat:0,lon:0,from:0}]).length,3);
 map.getBounds=()=>({getWest:()=>3600,getEast:()=>3960});map.latLngToContainerPoint=([lat,lon])=>({x:lon-3600,y:300-lat});assert.equal(visibleWindCopies(map,[{lat:0,lon:0,from:0}]).length,2,'far-away world copies remain visible');
});
test('one delta-time scheduler: motion, pause, reduced motion, hidden tab, calm, density and disposal',()=>{
 const listeners=new Map();globalThis.document={hidden:false,addEventListener:(k,v)=>listeners.set(k,v),removeEventListener:k=>listeners.delete(k)};
 const queue=new Map();let id=0,reduced=false,removed=false;
 const ctx=new Proxy({},{get:(_t,k)=>()=>{}}),canvas={getContext:()=>ctx,style:{},remove:()=>removed=true};
 const bound=new Map(),map={on:(k,v)=>bound.set(k,v),off:k=>bound.delete(k),getSize:()=>({x:800,y:600}),getBounds:()=>({getWest:()=>-180,getEast:()=>180}),latLngToContainerPoint:([lat,lon])=>({x:400+lon,y:300-lat})};
 let metrics;const painter=new WindCanvas(map,canvas,{raf:fn=>{queue.set(++id,fn);return id;},cancel:n=>queue.delete(n),now:()=>0,reduced:()=>reduced,onMetrics:m=>metrics=m});
 const frame=time=>{const [key,fn]=queue.entries().next().value;queue.delete(key);fn(time);};
 const p=combineWindPoint(answer(WIND_SPEED,10),answer(WIND_DIRECTION,270),{...point,latitude:0,longitude:0}),c=normalizeWindConfig({enabled:true,mode:'animated',density:'low'});
 painter.update([p],c);painter.schedule();assert.equal(queue.size,1);frame(0);frame(100);assert(painter.clock>0);assert(metrics.segments>0);const low=metrics.segments,clock=painter.clock;
 painter.update([p],{...c,paused:true});frame(200);assert.equal(queue.size,0);assert.equal(painter.clock,clock);
 reduced=true;painter.update([p],c);frame(300);assert.equal(queue.size,0);
 painter.update([p],{...c,animationExplicit:true,density:'high'});frame(400);assert(metrics.segments>low);assert.equal(queue.size,1);
 document.hidden=true;listeners.get('visibilitychange')();assert.equal(queue.size,0);document.hidden=false;listeners.get('visibilitychange')();frame(500);assert.equal(queue.size,1);
 painter.update([{...p,speed:0}],c);frame(600);assert.equal(metrics.segments,0);assert.equal(queue.size,0);
 painter.destroy();assert(removed);assert.equal(bound.size,0);assert.equal(listeners.size,0);assert.equal(canvas.width,1);
 delete globalThis.document;
});
test('point batching ignores obsolete responses and never queries on animation frames',async()=>{
 globalThis.document={hidden:false};class Card{};installWeatherWind(Card);const card=new Card();card._weatherWindRender=()=>{};
 const s=card._weatherWindState();s.config.visible=true;s.config.enabled=true;s.map={getSize:()=>({x:900,y:600}),containerPointToLatLng:([x,y])=>({lat:y/100,lng:x/100})};
 const deferred=[];let active=0,maxActive=0;
 card._weatherRouterResolve=(id,p)=>{active++;maxActive=Math.max(active,maxActive);return new Promise(resolve=>deferred.push(()=>{active--;resolve(answer(id,id===WIND_SPEED?8:270));}));};
 s.pending=true;const pending=card._weatherWindFetch();assert.equal(deferred.length,4);assert.equal(maxActive,4);
 s.generation++;s.suspended=true;deferred.splice(0).forEach(f=>f());await pending;assert.equal(s.points.length,0);assert.equal(s.requests,4);assert.equal(s.batch,null);delete globalThis.document;
});
test('protected precipitation, V2 transport, mosaics, palettes and time policy stay byte-identical',async()=>{
 const base='d975a94be5d63eb09242a54920d8c3417205b41f',root='frontend/modules/weather/';
 for(const file of ['consumer-client.js','p7-010/raster-compositor.js','p7-010/raster-mosaic-grid-layer.js','p7-010/raster-mosaic-tile-loader.js','p7-010/raster-mosaic-contract.js','p7-010/raster-mosaic-consumer.js','p7-010/nasa-spatial.js','p7-010/radar-mask.js','p7-010/raster-mosaic-coverage.js']){
  let current=(await readFile(root+file,'utf8')).replaceAll('\r\n','\n');
  // The only authorized consumer addition is local temperature diagnostics and
  // its module version; retain the exact comparison of every transport/policy line.
  if(file==='consumer-client.js')current=current.replace("version:'1.2.15'","version:'1.2.14'").replace(',temperature:this._weatherTemperatureDiagnostics?.()||null','');
  assert.equal(current,execFileSync('git',['show',base+':'+root+file],{encoding:'utf8'}).replaceAll('\r\n','\n'),file);
 }
 const path=root+'precipitation-layer.js';assert.equal((await readFile(path,'utf8')).replace('legend-overlay.js?v=411149r1','legend-overlay.js?v=411148r1').replaceAll('\r\n','\n'),execFileSync('git',['show',base+':'+path],{encoding:'utf8'}).replaceAll('\r\n','\n'));
 const old=execFileSync('git',['show',base+':'+root+'legend-overlay.js'],{encoding:'utf8'}),current=await readFile(root+'legend-overlay.js','utf8');
 for(const name of ['PRECIPITATION_LEGEND_ENTRIES','LEGACY_OPERA_ENTRIES'])assert.equal(current.split('\n').find(s=>s.startsWith('export const '+name)).trim(),old.split('\n').find(s=>s.startsWith('export const '+name)).trim());
 for(const name of ['groupIdenticalLegendScales','radarLegendIntervals']){
  const method=text=>{const start=text.indexOf('export function '+name);return text.slice(start,text.indexOf('\n}',start)+2).replaceAll('\r\n','\n');};assert.equal(method(current),method(old));
 }
});
