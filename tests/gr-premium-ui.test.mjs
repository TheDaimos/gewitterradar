import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {normalizeWindConfig,effectiveWindConfig} from '../frontend/modules/weather/wind-data.js';
import {normalizeTemperatureConfig,advectionColor,advectionLegendClasses} from '../frontend/modules/weather/temperature-data.js';
import {installWeatherDisplayMenu} from '../frontend/modules/weather/display-menu.js';
import {premiumAction,readPremiumUi,savePremiumUi} from '../frontend/modules/weather/premium-ui.js';
const source=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8').replace(/\r/g,'');
test('barb visibility is independent of global Wind, arrows, field, pause and stored colors',()=>{
 for(const mode of ['barbs','arrows','animated']){const c=normalizeWindConfig({visible:false,enabled:true,mode,colorField:true,paused:true,color:'gold',barbsVisible:false});assert(!c.visible);assert(c.colorField&&c.paused);const on=normalizeWindConfig({...c,visible:true});assert.equal(effectiveWindConfig(on).enabled,mode!=='barbs');assert(effectiveWindConfig(on).colorField);assert.equal(on.mode,mode);assert.equal(on.color,'gold');}
 assert(normalizeWindConfig({schema:2}).barbsVisible,'legacy default remains visible');
});
test('legend view, explanation and minimized state survive independent config normalization',()=>{
 const ui={view:'classes',minimized:true,explanation:true,rain:false};assert.deepEqual(normalizeWindConfig({legendUi:ui}).legendUi,{...ui,snow:false});const c=normalizeTemperatureConfig({unit:'K',legendUi:{temperature:ui,advection:{view:'bar',minimized:false,explanation:false}}});assert(c.legendUi.temperature.minimized&&c.legendUi.temperature.explanation);assert.equal(c.legendUi.advection.minimized,false);assert.equal(c.unit,'K');
});
test('existing advection colors are exact for dense boundary-adjacent values and strengths',()=>{
 const old=(r,s)=>{const n=r*s,a=Math.abs(n);return a<.05?'#e8edf1':n<0?(a<.4?'#6edbff':'#247aff'):(a<.4?'#ffab50':a<2?'#fa413b':'#e9449a');};
 for(const strength of [.25,.5,1,2,4])for(const value of [-100,-2,-.400001,-.4,-.399999,-.050001,-.05,-.049999,0,.049999,.05,.050001,.399999,.4,.400001,1.99999,2,2.000001,100])assert.equal(advectionColor(value,strength),old(value,strength));
 const a=advectionLegendClasses(1),b=advectionLegendClasses(2);assert.equal(a.length,6);assert(a[2].label.includes('0,05'));assert(b[2].label.includes('0,025'));assert.deepEqual(a.map(x=>x.color),b.map(x=>x.color));assert(a.every(x=>x.label.includes('K/h')));
});
test('premium control markup uses original assets and existing metallic minimize component',()=>{
 assert(premiumAction('close','Schließen').includes('gewitterradar-about-close-premium.webp'));assert(premiumAction('info','Info','info').includes('gewitterradar-help-info-premium-v1.webp'));const m=premiumAction('minimize','Minimieren','minimize');assert(m.includes('weather-display-minimize'));assert(!/[−+×]/.test(m));assert(!m.includes('<svg'));
});
test('collapsible UI storage is isolated without replacing existing weather preferences',()=>{
 const old=globalThis.localStorage,map=new Map();globalThis.localStorage={getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)};try{savePremiumUi('wind-settings',{sections:{animation:false,field:true},minimized:true});savePremiumUi('temperature-settings',{sections:{advection:true}});assert.equal(readPremiumUi('wind-settings').sections.animation,false);assert(readPremiumUi('temperature-settings').sections.advection);assert(!readPremiumUi('temperature-settings').minimized);assert([...map.keys()].every(k=>k.startsWith('gewitterradar:premium-ui:v1:')));}finally{globalThis.localStorage=old;}
});
test('one pointer gesture discriminates click, 600ms long press, drag, cancel and capture loss',()=>{
 class Owner {}
 installWeatherDisplayMenu(Owner,{});
 const owner=new Owner(),win=new EventTarget(),root=new EventTarget(),button=new EventTarget();
 const rect={left:0,top:0,right:800,bottom:600,width:800,height:600};
 const state={eyeDrag:null},timers=new Map();
 let captured=false,id=0,opened=0,saved=0,positioned=0;
 owner.shadow=Object.assign(root,{ownerDocument:{defaultView:win},getElementById:()=>({getBoundingClientRect:()=>rect})});
 Object.assign(button,{ownerDocument:root.ownerDocument,dataset:{},offsetWidth:50,offsetHeight:50,style:{left:'10px',top:'10px'},
  classList:{add(){},remove(){}},getBoundingClientRect:()=>({...rect,left:10,top:10,width:50,height:50}),
  setPointerCapture(){captured=true;},releasePointerCapture(){captured=false;},hasPointerCapture:()=>captured});
 const send=(target,type,x=10,y=10)=>target.dispatchEvent(Object.assign(new Event(type,{cancelable:true}),{
  button:0,pointerId:1,pointerType:'mouse',isPrimary:true,clientX:x,clientY:y,composedPath:()=>[button,root,win]
 }));
 const down=()=>{send(win,'pointerdown');send(button,'pointerdown');};
 const set=globalThis.setTimeout,clear=globalThis.clearTimeout;
 globalThis.setTimeout=(fn,ms)=>{timers.set(++id,{fn,ms});return id;};
 globalThis.clearTimeout=key=>timers.delete(key);
 try{
  owner._weatherDisplayBindEyeDrag(button,{element:button,state:()=>state,longPress:()=>opened++,position(){positioned++;},save:()=>saved++});
  down();
  const [key,hold]=[...timers][0];
  assert.equal(hold.ms,600);
  timers.delete(key);hold.fn();
  send(button,'pointerup');
  assert.equal(opened,1);
  assert(owner._weatherControlRelease);
  assert.equal(saved,0);
  assert.equal(positioned,0);
  down();send(button,'pointermove',30,30);
  assert.equal(timers.size,0);
  send(button,'pointerup',30,30);
  assert.equal(saved,1);
  down();send(win,'pointercancel');
  assert.equal(timers.size,0);
  assert.equal(state.eyeDrag,null);
  down();captured=false;send(win,'lostpointercapture');
  assert.equal(timers.size,0);
  assert.equal(state.eyeDrag,null);
  down();send(button,'pointerup');
  assert.equal(saved,1,'a short click does not move or save the control');
  assert.equal(positioned,1,'only a completed drag repositions the control');
 }finally{
  owner._recoverWeatherControlGesture('test-cleanup');
  globalThis.setTimeout=set;globalThis.clearTimeout=clear;
 }
});
test('protected data acquisition, numeric rendering, masks, scheduler and reference remain exact except import cache keys',()=>{
 const files=['wind-canvas.js','wind-field.js','temperature-canvas.js','temperature-field.js','temperature-units.js','frame-clock.js','consumer-client.js','precipitation-layer.js','p7-010/raster-compositor.js','p7-010/raster-mosaic-consumer.js','p7-010/raster-mosaic-tile-loader.js','p7-010/radar-mask.js'];const norm=s=>s.replace(/\r/g,'').replace(/(\.js\?v=)\d+r\d+/g,'$1CACHE');
 for(const name of files){const p='frontend/modules/weather/'+name,before=execFileSync('git',['show','ecad2624:'+p],{encoding:'utf8',maxBuffer:10000000});assert.equal(norm(source(p)),norm(before),name);}
 for(const [name,start,end] of [['display-menu.js','export const WEATHER_DISPLAY_STYLES','export const installWeatherDisplayMenu'],['wind-data.js','export function beaufort',null],['temperature-data.js','export function writeTemperatureColor','export function advectionColor']]){
  const p='frontend/modules/weather/'+name,before=execFileSync('git',['show','ecad2624:'+p],{encoding:'utf8',maxBuffer:10000000});const slice=s=>{s=norm(s);const a=s.indexOf(start);assert(a>=0,start);const b=end?s.indexOf(end,a):s.length;assert(b>a);return s.slice(a,b);};assert.equal(slice(source(p)),slice(before),name+' protected numerical/color/style functions');
 }
 const p='docs/GR_WR_TEMPERATURE_WORLD_USER_REFERENCE_2026-11-08.md';assert.equal(source(p),execFileSync('git',['show','ecad2624:'+p],{encoding:'utf8'}).replace(/\r/g,''));
});
