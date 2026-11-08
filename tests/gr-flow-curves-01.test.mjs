import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {FlowGeometry,flowLength,flowVelocity} from '../frontend/modules/weather/flow-geometry.js';
import {windMercatorY,windMercatorLatitude} from '../frontend/modules/weather/wind-canvas.js';
import {prepareWindFieldLookup} from '../frontend/modules/weather/wind-field.js';
import {normalizeWindConfig} from '../frontend/modules/weather/wind-data.js';
import {normalizeTemperatureConfig,advectionColor} from '../frontend/modules/weather/temperature-data.js';
import {FLOW_TRANSLATIONS,installFlowTranslations} from '../frontend/modules/weather/flow-locales.js';
import {assertClassicWindPreserved} from './protected-wind-classic.mjs';
const projection=(angle=0)=>{const c=Math.cos(angle),s=Math.sin(angle);return {ox:0,oy:0,ex:100*c,ey:100*s,nx:100*s,ny:-100*c,ax:c/100,ay:s/100,bx:s/100,by:-c/100,eastX:c,eastY:s,northX:s,northY:-c,screen(lon,my,out){out[0]=lon*this.ex+my*this.nx;out[1]=lon*this.ey+my*this.ny;return out;}};};
const field=(fn=()=>[10,0],{min=-2,max=2,step=.1,cyclic=false}={})=>{const n=Math.round((max-min)/step)+1,latitudes=Array.from({length:n},(_,i)=>min+i*step),longitudes=[...latitudes],u=[],v=[],valid_mask=[];for(const lat of latitudes)for(const lon of longitudes){const a=fn(lon,windMercatorY(lat));u.push(a[0]);v.push(a[1]);valid_mask.push(1);}const f={grid:{latitudes,longitudes,u,v,valid_mask,cyclic}};prepareWindFieldLookup(f);return f;};
const particle=(lon=.1,my=.1)=>({lon,my,lat:windMercatorLatitude(my)});
test('constant field gives a straight bounded trajectory without artificial waves',()=>{
 const f=field(),p=particle(),engine=new FlowGeometry(),pr=projection();for(let i=0;i<240;i++){assert(engine.advance(f,p,pr,.016,'normal',1));engine.build(f,p,pr,flowLength(engine.speed));}
 assert(Math.abs(p.my-.1)<1e-12);assert.equal(p.flowPath.coords.length,48);assert(p.flowPath.count<=24);for(let i=0;i<engine.count;i++)assert(Math.abs(engine.xy[i*2+1]+10)<1e-8);
});
test('rotating field bends a moving body; head tangent follows local vectors',()=>{
 const f=field((x,y)=>[-12*y,12*x]),p=particle(1,0),engine=new FlowGeometry(),pr=projection();for(let i=0;i<270;i++){assert(engine.advance(f,p,pr,.016,'normal',1));engine.build(f,p,pr,flowLength(engine.speed));}
 assert(Math.abs(Math.hypot(p.lon,p.my)-1)<.002);assert(engine.count>3);assert(Math.abs(engine.xy[1]-engine.xy[(engine.count-1)*2+1])>2);const u=-p.my,v=p.lon,mag=Math.hypot(u,v);assert(Math.abs(engine.dx-u/mag)<.002);assert(Math.abs(engine.dy+v/mag)<.002);
 const before=Array.from(engine.xy.slice(0,engine.count*2));engine.advance(f,p,pr,.04,'normal',1);engine.build(f,p,pr,flowLength(engine.speed));assert.notDeepEqual(Array.from(engine.xy.slice(0,engine.count*2)),before);
});
test('small vortices shorten the visible tail instead of completing an artificial loop',()=>{
 const f=field((x,y)=>[-400*y,400*x],{min:-.2,max:.2,step:.01}),p=particle(.025,0),engine=new FlowGeometry(),pr=projection();for(let i=0;i<300;i++){assert(engine.advance(f,p,pr,.008,'normal',1));engine.build(f,p,pr,55);}
 let length=0;for(let i=1;i<engine.count;i++)length+=Math.hypot(engine.xy[i*2]-engine.xy[(i-1)*2],engine.xy[i*2+1]-engine.xy[(i-1)*2+1]);assert(length<20);assert(engine.count<=25);assert([...engine.xy].every(Number.isFinite));
});
test('length and motion respond independently to wind speed, stay bounded and respect pause/frame drops',()=>{
 assert(flowLength(1)<flowLength(10));assert(flowLength(10)<flowLength(40));assert(flowLength(1000,150)<=64);assert.equal(flowLength(0),0);assert.equal(flowVelocity(0),0);assert(flowVelocity(1)<flowVelocity(10));assert(flowVelocity(10)<flowVelocity(40));
 const f=field(),a=particle(),b=particle(),e=new FlowGeometry(),pr=projection();e.advance(f,a,pr,0,'normal',1);const start=[a.lon,a.my];e.advance(f,a,pr,0,'normal',1);assert.deepEqual([a.lon,a.my],start);e.advance(f,a,pr,5,'normal',1);e.advance(f,b,pr,.05,'normal',1);assert.deepEqual([a.lon,a.my],[b.lon,b.my]);
 const c=particle(),d=particle();for(let i=0;i<50;i++)e.advance(f,c,pr,.02,'normal',1);for(let i=0;i<100;i++)e.advance(f,d,pr,.01,'normal',1);assert(Math.abs(c.lon-d.lon)<1e-10);
});
test('adaptive RK2 substeps retain a subpixel vortex without a growing spiral',()=>{
 const f=field((x,y)=>[-2000*y,2000*x],{min:-.05,max:.05,step:.002}),p=particle(.01,0),e=new FlowGeometry(),pr=projection();for(let i=0;i<160;i++)assert(e.advance(f,p,pr,.02,'normal',1));assert(Math.hypot(p.lon,p.my)<.02);assert(e.stats.steps>160);
});
test('mask holes and nonfinite or calm vectors never gain curves; swept cells remain authoritative',()=>{
 const f=field(),p=particle(0,0),e=new FlowGeometry(),pr=projection();const nx=f.grid.longitudes.length;f.grid.valid_mask[20*nx+20]=0;delete f.lookup;assert.equal(e.advance(f,p,pr,.016,'normal',1),false);assert.equal(e.advance(field(()=>[0,0]),particle(),pr,.016,'normal',1),false);assert.equal(e.advance(f,{lon:NaN,my:0},pr,.01,'normal',1),false);
 const edge=particle(-.3,0);let stopped=false;for(let i=0;i<120;i++){if(!e.advance(f,edge,pr,.02,'normal',1)){stopped=true;break;}}assert(stopped);
});
test('world copies use the same vector field, rotation changes screen geometry only',()=>{
 const f=field(()=>[10,0],{min:-180,max:180,step:10,cyclic:true}),a=particle(179.99,0),b=particle(539.99,0),e=new FlowGeometry(),pr=projection();for(let i=0;i<10;i++){assert(e.advance(f,a,pr,.02,'normal',1));assert(e.advance(f,b,pr,.02,'normal',1));}assert(Math.abs(b.lon-a.lon-360)<1e-10);assert(a.lon>180);
 const c=particle(),d=particle();e.advance(f,c,projection(),.02,'normal',1);e.advance(f,d,projection(Math.PI/2),.02,'normal',1);assert(Math.abs(c.lon-d.lon)<1e-10);assert(Math.abs(c.my-d.my)<1e-10);
});
test('a changed mask cannot be rounded across an off-axis historical curve corner',()=>{
 const f=field(()=>[-4.472,-8.944],{min:-1,max:1,step:.05}),nx=f.grid.longitudes.length;f.grid.valid_mask[22*nx+22]=0;delete f.lookup;prepareWindFieldLookup(f);
 const p=particle(-.3,-.3),e=new FlowGeometry();p.flowPath={coords:new Float64Array(48),cursor:1,count:2,epoch:1};p.flowPath.coords.set([.3,-.3,0,.3]);e.dx=-1/Math.sqrt(5);e.dy=2/Math.sqrt(5);assert.equal(e.build(f,p,projection(),100),2,'the unsafe older corner is truncated before Bezier smoothing');
});
test('smoothing uses bounded quadratic control points and a tangential end, no large line-mode head',()=>{
 const f=field((x,y)=>[10,y*4]),p=particle(),e=new FlowGeometry(),pr=projection();for(let i=0;i<50;i++)e.advance(f,p,pr,.02,'normal',1);e.build(f,p,pr,30);
 const ops=[],ctx=new Proxy({},{set:(o,k,v)=>(o[k]=v,true),get:(o,k)=>k in o?o[k]:(...a)=>ops.push([k,...a])});e.draw(ctx,'curved_lines','#fff',.8);assert(ops.some(x=>x[0]==='quadraticCurveTo'));assert(!ops.some(x=>x[0]==='lineTo'));const last=ops.filter(x=>x[0]==='quadraticCurveTo').at(-1);assert(Math.abs((last[3]-last[1])*e.dy-(last[4]-last[2])*e.dx)<1e-8);ops.length=0;e.draw(ctx,'curved_arrows','#fff',.8);assert.equal(ops.filter(x=>x[0]==='lineTo').length,2);
});
test('existing configurations migrate to classic; wind and temperature choices remain independent',()=>{
 const w=normalizeWindConfig({schema:2,visible:true,mode:'animated',color:'gold',paused:true}),t=normalizeTemperatureConfig({visible:true,unit:'K'});assert.equal(w.flowForm,'classic');assert.equal(t.flowForm,'classic');assert.equal(w.color,'gold');assert(w.paused);assert.equal(t.unit,'K');assert.equal(normalizeWindConfig({...w,flowForm:'curved_lines',flowLength:150}).flowLength,150);assert.equal(normalizeTemperatureConfig({...t,flowForm:'curved_arrows'}).flowForm,'curved_arrows');assert.equal(normalizeWindConfig({flowForm:'unknown'}).flowForm,'classic');
});
test('all registered languages receive complete flow controls and help through existing I18N',()=>{
 const base=readFileSync(new URL('../frontend/modules/core/base-context.js',import.meta.url),'utf8'),part=base.slice(base.indexOf('const LANGUAGE_DEFINITIONS = ['),base.indexOf('const LANGUAGE_DEFINITIONS = [')+2200),languages=[...part.matchAll(/value\s*:\s*['"]([^'"]+)['"]/g)].map(m=>m[1]);assert.deepEqual(Object.keys(FLOW_TRANSLATIONS).sort(),languages.sort());const i18n={};installFlowTranslations(i18n);for(const l of languages){assert.equal(Object.keys(i18n[l].strings).length,12);assert(Object.values(i18n[l].strings).every(x=>typeof x==='string'&&x.length>0));}
});
test('temperature units and advection colours do not influence geometric length, speed or masks',()=>{
 for(const unit of ['C','F','K']){const c=normalizeTemperatureConfig({unit,flowForm:'curved_lines'});assert.equal(flowLength(12,c.flowLength),flowLength(12,100));assert.equal(advectionColor(-1),'#247aff');assert.equal(advectionColor(1),'#fa413b');}
});
test('providers, data contracts, palettes, time policy, cache, scheduler and reference remain exact',()=>{
 assertClassicWindPreserved();
 for(const path of ['frontend/modules/weather/frame-clock.js','frontend/modules/weather/temperature-field.js','frontend/modules/weather/temperature-units.js','frontend/modules/weather/consumer-client.js','frontend/modules/weather/precipitation-layer.js','frontend/modules/weather/legend-overlay.js','docs/GR_WR_TEMPERATURE_WORLD_USER_REFERENCE_2026-11-08.md']){
  const current=readFileSync(new URL('../'+path,import.meta.url),'utf8').replace(/\r\n/g,'\n'),old=execFileSync('git',['show','70422b2b04e0865b19449ada5235c0a130dcfa63:'+path],{encoding:'utf8',maxBuffer:10000000}).replace(/\r\n/g,'\n');assert.equal(current,old,path);
 }
});
