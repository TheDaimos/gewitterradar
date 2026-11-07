import test from 'node:test';
import assert from 'node:assert/strict';
import {parseWindField,sampleWindField,windFieldColor,windFieldViewport,WIND_FIELD,WIND_FIELD_COLORS} from '../frontend/modules/weather/wind-field.js';
import {BEAUFORT_LIMITS,normalizeWindConfig} from '../frontend/modules/weather/wind-data.js';
import {WindCanvas,projectedWind,windScreenBasis} from '../frontend/modules/weather/wind-canvas.js';
import {installWeatherWind} from '../frontend/modules/weather/wind-display.js';
const fixture=()=>({schema:'weather_router.consumer.wind_field.v2',contract_version:2,capability:WIND_FIELD,status:'ready',frame:{id:'synthetic-field',capability:WIND_FIELD,unit:'m/s',height_m:10,kind:'model_forecast',model:'Synthetic coherent grid',valid_at:'2030-01-01T00:00:00Z',model_run:'2029-12-31T18:00:00Z',valid_until:new Date(Date.now()+600000).toISOString(),refresh_after_seconds:300,provenance:{provider_id:'synthetic',attribution:'Synthetic windfield test only'},grid:{crs:'EPSG:4326',layout:'row_major_south_first',latitudes:[-10,0,10],longitudes:[-20,0,20],u:[0,10,20,0,10,20,0,10,20],v:Array(9).fill(6),valid_mask:Array(9).fill(1),cyclic:false}}});

test('V2 coherent numeric grid validation fails closed and applies only WR authorization deadline',()=>{
 const raw=fixture(),field=parseWindField(raw);assert.equal(field.valid_at,'2030-01-01T00:00:00Z','GR adds no independent model-age cutoff');assert(field.grid.u instanceof Float32Array);
 for(const change of [x=>x.status='unavailable',x=>x.frame.height_m=80,x=>x.frame.unit='kn',x=>x.frame.grid.u.pop(),x=>x.frame.grid.latitudes[1]=-10,x=>x.frame.grid.u[0]=null,x=>x.frame.grid.valid_mask[0]=2,x=>x.frame.valid_until='2000-01-01T00:00:00Z']){const bad=structuredClone(raw);change(bad);assert.throws(()=>parseWindField(bad));}
 const hole=fixture();hole.frame.grid.valid_mask[0]=0;hole.frame.grid.u[0]=null;assert.equal(parseWindField(hole).grid.u[0],0,'masked values are never interpreted as wind');
 const calm=fixture();calm.frame.grid.u.fill(0);calm.frame.grid.v.fill(0);assert.equal(parseWindField(calm).hasMotion,false);calm.frame.grid.valid_mask.fill(0);assert.throws(()=>parseWindField(calm));
});
test('bilinear U/V respects NoData, boundaries, direction and canonical world copies',()=>{
 const field=parseWindField(fixture()),sample=sampleWindField(field,5,10);assert.equal(sample.u,15);assert.equal(sample.v,6);assert.equal(sample.speed,Math.hypot(15,6));assert(sample.from>180&&sample.from<270);
 assert.deepEqual(sampleWindField(field,5,370),sample);assert.equal(sampleWindField(field,11,10),null);assert.equal(sampleWindField(field,0,40),null);
 field.grid.valid_mask[4]=0;assert.equal(sampleWindField(field,5,10),null,'all four corners must be valid');assert.equal(sampleWindField(field,-5,-10),null);
});
test('periodic global seam requires identical actual columns and never interpolates a gap',()=>{
 const raw=fixture();raw.frame.grid.longitudes=[-180,0,180];raw.frame.grid.u=[0,10,0,0,10,0,0,10,0];raw.frame.grid.cyclic=true;
 const f=parseWindField(raw);assert.deepEqual(sampleWindField(f,5,179),sampleWindField(f,5,-181));raw.frame.grid.u[2]=7;assert.throws(()=>parseWindField(raw),/seam/);
});
test('explicit Beaufort colour thresholds and speed units never depend on video pixels',()=>{
 BEAUFORT_LIMITS.forEach((speed,i)=>assert.deepEqual(windFieldColor(speed).slice(0,3),[1,3,5].map(j=>parseInt(WIND_FIELD_COLORS[i].slice(j,j+2),16))));
 assert.equal(windFieldColor(NaN)[3],0);assert.equal(windFieldColor(-1)[3],0);assert.equal(windFieldColor(0)[3],255,'calm is a valid background class');assert.deepEqual(windFieldColor(100),windFieldColor(32.7));
});
test('viewport plans reuse world copies without worldwide point downloads',()=>{
 const bounds={getWest:()=>170.2,getEast:()=>190.2,getSouth:()=>-20.1,getNorth:()=>20.1},map={getBounds:()=>bounds};const one=windFieldViewport(map);bounds.getWest=()=>530.2;bounds.getEast=()=>550.2;assert.deepEqual(windFieldViewport(map),one);assert.deepEqual(one,{west:170,east:191,south:-21,north:21});
});
test('continuous projection basis follows an actual rotated Mercator map',()=>{
 const map={options:{crs:{code:'EPSG:3857'}},getCenter:()=>({lat:0,lng:0}),project:ll=>({x:Array.isArray(ll)?ll[1]:ll.lng,y:-(Array.isArray(ll)?ll[0]:ll.lat)}),unproject:([x,y])=>({lat:-y,lng:x}),latLngToContainerPoint:ll=>{const lat=Array.isArray(ll)?ll[0]:ll.lat,lon=Array.isArray(ll)?ll[1]:ll.lng;return {x:lat,y:lon};}};
 const basis=windScreenBasis(map),angle=projectedWind(map,{lat:0,lon:0,from:225},0,basis).angle;assert(Math.abs(angle-Math.PI/4)<1e-8);
});
test('field scheduler advects actual vectors, preserves particles on pause, bounds density and disposes',()=>{
 const listeners=new Map();globalThis.document={hidden:false,addEventListener:(k,v)=>listeners.set(k,v),removeEventListener:k=>listeners.delete(k)};
 const queue=new Map();let serial=0,metrics;const ctx=new Proxy({},{get:()=>()=>{}}),canvas={style:{},getContext:()=>ctx,remove(){}};
 const events=new Map(),map={on:(k,v)=>events.set(k,v),off:k=>events.delete(k),getSize:()=>({x:600,y:400}),getBounds:()=>({getWest:()=>-20,getEast:()=>20}),containerPointToLatLng:([x,y])=>({lng:(x-300)/15,lat:(200-y)/20}),latLngToContainerPoint:value=>{const [lat,lon]=Array.isArray(value)?value:[value.lat,value.lng];return {x:300+lon*15,y:200-lat*20};}};
 const field=parseWindField(fixture()),config=normalizeWindConfig({enabled:true,mode:'animated',animationExplicit:true});
 const painter=new WindCanvas(map,canvas,{raf:fn=>{queue.set(++serial,fn);return serial;},cancel:key=>queue.delete(key),now:()=>0,onMetrics:m=>metrics=m});
 const frame=t=>{const [key,fn]=queue.entries().next().value;queue.delete(key);fn(t);};
 painter.update([],config,field);painter.schedule();assert.equal(queue.size,1);frame(0);const before=painter.particles.filter(Boolean).map(p=>({...p}));frame(40);assert(metrics.advected>0);assert(metrics.segments>50);assert(painter.particles.length<=900);assert(painter.particles.some((p,i)=>p&&before[i]&&(p.lat!==before[i].lat||p.lon!==before[i].lon)));
 painter.update([],{...config,paused:true},field);frame(80);assert.equal(queue.size,0);const paused=JSON.stringify(painter.particles);painter.schedule();frame(100);assert.equal(JSON.stringify(painter.particles),paused);
 painter.update([],config,field);frame(140);assert.equal(queue.size,1);document.hidden=true;listeners.get('visibilitychange')();assert.equal(queue.size,0);
 painter.destroy();assert.equal(painter.field,null);assert.equal(painter.particles.length,0);assert.equal(events.size,0);assert.equal(listeners.size,0);delete globalThis.document;
});
test('one field response serves animation without a point mesh; stale generation cannot replace active field',async()=>{
 globalThis.document={hidden:false};class Card{};installWeatherWind(Card);const card=new Card();card._weatherWindRender=()=>{};
 const s=card._weatherWindState();s.config=normalizeWindConfig({enabled:true,mode:'animated'});s.map={getBounds:()=>({getWest:()=>-20,getEast:()=>20,getSouth:()=>-10,getNorth:()=>10}),getSize:()=>({x:500,y:300}),containerPointToLatLng:()=>({lat:0,lng:0})};
 let resolve,calls=0;card._hass={callWS:request=>{calls++;assert.equal(request.type,'weather_router/consumer/resolve_wind_field');return new Promise(done=>resolve=done);}};card._weatherRouterResolve=()=>{throw new Error('no point mesh expected');};
 s.pending=true;const task=card._weatherWindFetch();resolve(fixture());await task;assert.equal(calls,1);assert.equal(s.points.length,0);assert(s.field);clearTimeout(s.refreshTimer);clearTimeout(s.expiryTimer);
 const original=s.field;s.pending=true;const obsolete=card._weatherWindFetch();s.generation++;s.suspended=true;resolve({...fixture(),frame:{...fixture().frame,id:'obsolete'}});await obsolete;assert.equal(s.field,original);assert.equal(s.batch,null);delete globalThis.document;
});
