import test from 'node:test';
import assert from 'node:assert/strict';
import {WindFieldCache,parseWindField,sampleWindField,sampleWindFieldInto,windFieldStepValid,windFieldContains,windFieldOverlaps,windFieldViewport,windFieldColor,writeWindFieldColor,windFieldSnapshot} from '../frontend/modules/weather/wind-field.js';
import {windMercatorY,windMercatorLatitude,windViewportProjection,WindCanvas,smoothWindDirection} from '../frontend/modules/weather/wind-canvas.js';
import {normalizeWindConfig} from '../frontend/modules/weather/wind-data.js';
const field=(id='f',provider='a',until=Date.now()+600000)=>parseWindField({schema:'weather_router.consumer.wind_field.v2',contract_version:2,capability:'weather.wind.field_10m',status:'ready',frame:{id,capability:'weather.wind.field_10m',kind:'model_forecast',unit:'m/s',height_m:10,model:'Synthetic',provenance:{provider_id:provider},model_run:'2026-11-07T06:00:00Z',valid_at:'2026-11-07T12:00:00Z',valid_until:new Date(until).toISOString(),refresh_after_seconds:300,native_resolution_degrees:.25,grid:{crs:'EPSG:4326',layout:'row_major_south_first',latitudes:[40,45,50,55,60],longitudes:[0,5,10,15,20],u:Array(25).fill(8),v:Array(25).fill(6),valid_mask:Array(25).fill(1),cyclic:false}}});
const bounds={west:5,east:10,south:45,north:50};
test('RAM LRU is bounded, canonical and retains WR expiration without extending it',()=>{
 const cache=new WindFieldCache({maxEntries:2,budgetBytes:20000}),a=field('a'),b=field('b'),c=field('c');cache.put(a,6);const grant=a.deadline;
 assert.equal(cache.find(bounds,6),a);assert.equal(cache.find({...bounds,west:365,east:370},6),a);assert.equal(a.deadline,grant);
 cache.put(b,6);cache.find(bounds,6);cache.put(c,6);assert.equal(cache.entries.size,2);assert.equal(cache.evictions,1);assert(cache.bytes<=cache.budgetBytes);
 c.deadline=Date.now()-1;cache.prune();assert.equal(cache.entries.size,1);cache.clear();assert.equal(cache.bytes,0);
});
test('cache cannot revive another provider/model epoch or reuse insufficient zoom detail',()=>{
 const cache=new WindFieldCache(),a=field('a'),b=field('b','other');cache.put(a,4);assert.equal(cache.find(bounds,6),null,'coarse field needs a more detailed authoritative request');assert.equal(cache.find(bounds,5),a);
 cache.put(b,5);assert.equal(cache.entries.size,1);assert.equal(cache.find(bounds,5),b);cache.put(a,4,{authoritative:false});assert.equal(cache.entries.size,1);assert.equal(cache.find(bounds,5),b,'obsolete reply cannot select an older provider from L2');
 const next=field('next','other');next.model_run='2026-11-07T12:00:00Z';next.valid_at='2026-11-07T15:00:00Z';assert.notEqual(windFieldSnapshot(next),windFieldSnapshot(b));cache.put(next,5);assert.equal(cache.entries.size,1);
});
test('WR refresh advice is retained across local hits and never reset by a pan',()=>{
 const cache=new WindFieldCache(),a=field();cache.put(a,6);const at=cache.refreshAt(a);cache.find(bounds,6);assert.equal(cache.refreshAt(a),at);for(const item of cache.entries.values())item.refreshAt=Date.now()-1;assert.equal(cache.find(bounds,6),null);assert(a.deadline>Date.now(),'renewal advice is distinct from authorization');
});
test('allocation-free sampler preserves numeric vectors and swept NoData safety',()=>{
 const f=field(),out=new Float64Array(5);assert(sampleWindFieldInto(f,47.5,7.5,out));assert.deepEqual(Array.from(out).slice(0,3),[8,6,10]);assert.deepEqual(sampleWindField(f,47.5,7.5),{u:8,v:6,speed:10,from:233.13010235415598});
 assert(windFieldStepValid(f,47.5,5.1,47.5,9.9));assert(!windFieldStepValid(f,47.5,5.1,47.5,25));
 f.grid.valid_mask[12]=0;delete f.lookup;assert.equal(sampleWindField(f,47.5,7.5),null);assert.equal(windFieldStepValid(f,42.5,2.5,57.5,17.5),false,'conservative swept cells cannot tunnel through a mask hole');
});
test('130 percent viewport uses screen margins and only authorized geographic coverage',()=>{
 const map={getSize:()=>({x:100,y:200}),containerPointToLatLng:([x,y])=>({lng:x/10,lat:60-y/20})};assert.deepEqual(windFieldViewport(map,1.3),{west:-1.5,east:11.5,south:48.5,north:61.5});
 const f=field();assert(windFieldContains(f,bounds));assert(!windFieldContains(f,{...bounds,east:25}));assert(windFieldOverlaps(f,{west:15,east:30,south:45,north:50}));assert(!windFieldOverlaps(f,{west:30,east:40,south:45,north:50}));
});
test('swept-cell mask follows a cyclic seam without a false world boundary',()=>{
 const f=field();f.grid.longitudes=[-180,-90,0,90,180];f.grid.cyclic=true;delete f.lookup;assert(windFieldStepValid(f,47.5,179,47.5,-179));f.grid.valid_mask[10]=f.grid.valid_mask[14]=0;delete f.lookup;assert.equal(windFieldStepValid(f,47.5,179,47.5,-179),false);
});
test('Mercator viewport preparation preserves projection and rotation without per-particle Leaflet calls',()=>{
 for(const lat of [-85,-60,0,48,85])assert(Math.abs(windMercatorLatitude(windMercatorY(lat))-lat)<1e-9);
 const map={options:{crs:{code:'EPSG:3857'}},getSize:()=>({x:800,y:600}),containerPointToLatLng:([x,y])=>({lng:8+x*.02,lat:windMercatorLatitude(50-y*.02)})};
 const p=windViewportProjection(map),out=new Float64Array(2);p.screen(10,48,out);assert(Math.abs(out[0]-100)<1e-8&&Math.abs(out[1]-100)<1e-8);
});
test('colour writes retain exact palette values and reuse the target buffer',()=>{
 const buffer=new Uint8ClampedArray(12);for(const speed of [0,.3,1.1,3.4,7.9,10.8,20,32.7,80,NaN]){writeWindFieldColor(speed,buffer,4);assert.deepEqual(Array.from(buffer.slice(4,8)),windFieldColor(speed));}assert.deepEqual(Array.from(buffer.slice(0,4)),[0,0,0,0]);
});
test('optional diagnostics do not reset existing preferences',()=>{
 const config=normalizeWindConfig({enabled:true,color:'gold',density:'high',fieldOpacity:72,legendPosition:{x:.2,y:.3}});assert.equal(config.performanceDiagnostics,false);assert.equal(normalizeWindConfig({...config,performanceDiagnostics:true}).fieldOpacity,72);
});
test('visual direction filtering takes the short 0/360 path and resets across model epochs',()=>{
 const radians=a=>a*Math.PI/180,p={du:Math.cos(radians(359)),dv:Math.sin(radians(359)),epoch:1};smoothWindDirection(p,Math.cos(radians(1)),Math.sin(radians(1)),.2,1);assert(Math.abs(Math.atan2(p.dv,p.du))<radians(2));
 for(let i=0;i<40;i++)smoothWindDirection(p,-1,0,.2,1);assert(p.du<-.999);smoothWindDirection(p,0,1,.1,2);assert.deepEqual([p.du,p.dv,p.epoch],[0,1,2],'a new authorized model epoch is not temporally blended');
});
test('a fully out-of-coverage viewport stops animation rather than repeatedly seeding invisible particles',()=>{
 const listeners=new Map();globalThis.document={hidden:false,addEventListener:(k,v)=>listeners.set(k,v),removeEventListener:k=>listeners.delete(k)};let callback=null;
 const map={on(){},off(){},getSize:()=>({x:300,y:300}),getBounds:()=>({getWest:()=>100,getEast:()=>110,getSouth:()=>40,getNorth:()=>50}),latLngToContainerPoint:()=>({x:-10000,y:0})},ctx=new Proxy({},{get:()=>()=>{}}),canvas={style:{},getContext:()=>ctx,remove(){}};
 const painter=new WindCanvas(map,canvas,{raf:fn=>(callback=fn,1),cancel:()=>callback=null,now:()=>0});painter.update([],normalizeWindConfig({enabled:true,mode:'animated',animationExplicit:true}),field());const fn=callback;callback=null;fn(0);assert.equal(callback,null);assert.equal(painter.metrics.segments,0);assert.equal(painter.lookups,0);painter.destroy();delete globalThis.document;
});
test('optional FPS counts animated frame intervals and clears a paused/hidden interval',()=>{
 const listeners=new Map();globalThis.document={hidden:false,addEventListener:(k,v)=>listeners.set(k,v),removeEventListener:k=>listeners.delete(k)};let callback=null;
 const map={on(){},off(){},getSize:()=>({x:300,y:300}),getBounds:()=>({getWest:()=>0,getEast:()=>20,getSouth:()=>40,getNorth:()=>60}),latLngToContainerPoint:([lat,lon])=>({x:lon*15,y:(lat-40)*15}),containerPointToLatLng:([x,y])=>({lng:x/15,lat:40+y/15})},ctx=new Proxy({},{get:()=>()=>{}}),canvas={style:{},getContext:()=>ctx,remove(){}};
 const painter=new WindCanvas(map,canvas,{raf:fn=>(callback=fn,1),cancel:()=>callback=null,now:()=>0}),config=normalizeWindConfig({enabled:true,mode:'animated',animationExplicit:true,performanceDiagnostics:true});painter.update([],config,field());
 for(let i=0;i<=10;i++){const fn=callback;callback=null;fn(i*100);}assert.equal(painter.metrics.fps,10);painter.update([],{...config,paused:true});const fn=callback;callback=null;fn(1100);assert.equal(painter.metrics.fps,null);document.hidden=true;listeners.get('visibilitychange')();assert.equal(painter.lastPerfTime,null);painter.destroy();delete globalThis.document;
});
