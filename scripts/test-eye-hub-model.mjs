import assert from 'node:assert/strict';
import {normalizeEyeConfig,assignEyeSlot,resizeEyeSlots,EYE_COLORS,eyeAuraOn,eyeRingRadius,eyeBubbleLayout,eyeSizePercent,eyeSizePixels} from '../frontend/modules/weather/eye-hub-model.js';
import {compassPreviewHalo,compassDialogSurface} from '../frontend/modules/fullscreen/compass-preview-style.js';
import {createEyeRegistry} from '../frontend/modules/weather/eye-hub-registry.js';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const defaults=normalizeEyeConfig();assert.equal(defaults.grouped,false);assert.equal(defaults.aura,true);assert.deepEqual(defaults.slots.map(v=>v.functionId),['wind','temperature','precipitation','weather-display']);
let c=normalizeEyeConfig({...defaults,grouped:true,slots:['wind',null,'precipitation','weather-display']});assert.deepEqual(c.slots.map(v=>v.functionId),['wind',null,'precipitation','weather-display']);
assert.equal(eyeRingRadius(c.size,3),eyeRingRadius(defaults.size,3));assert.equal(resizeEyeSlots(defaults,-1).blocked,4);
c=resizeEyeSlots(defaults,1).config;assert.equal(c.slots.length,5);assert.equal(c.slots[4].functionId,null);c=resizeEyeSlots(c,-1).config;assert.equal(c.slots.length,4);
c=assignEyeSlot({...defaults,slots:['wind',null,'precipitation',null]},3,'wind');assert.deepEqual(c.slots.map(v=>v.functionId),[null,null,'precipitation','wind']);assert.equal(c.colors.wind,defaults.colors.wind);
assert.deepEqual(assignEyeSlot(defaults,1,'wind').slots,defaults.slots,'occupied target protected');
c=normalizeEyeConfig({slots:['wind','wind','unknown',null],colors:{wind:'#ff3dbb',temperature:'url(invalid)'},size:Infinity,brightness:-9});assert.deepEqual(c.slots.map(v=>v.functionId),['wind',null,null,null]);assert.equal(c.colors.wind,EYE_COLORS[0]);assert.equal(c.size,42);assert.equal(c.brightness,0);
for(let i=0;i<10;i++)c=resizeEyeSlots(c,1).config;assert.equal(c.slots.length,8);c=normalizeEyeConfig({slots:Array(20).fill(null)});assert.equal(c.slots.length,12);assert.equal(resizeEyeSlots(c,1).config.slots.length,12);
assert.equal(resizeEyeSlots(normalizeEyeConfig({slots:[null]}),-1).config.slots.length,1);
for(const grouped of [false,true])for(const aura of [false,true])for(const active of [false,true])for(const available of [false,true])assert.equal(eyeAuraOn({...defaults,grouped,aura},{active,available}),grouped&&aura&&active&&available);
for(const [width,height] of [[393,851],[851,393],[1280,900]])for(const count of [0,1,3,4,8,12]){const p=eyeBubbleLayout(count,{x:width/2,y:height/2},{left:0,top:0,right:width,bottom:height});assert.equal(p.length,count);p.forEach((a,i)=>{assert(a.x>=31&&a.x<=width-31&&a.y>=31&&a.y<=height-31);for(const b of p.slice(i+1))assert(Math.hypot(a.x-b.x,a.y-b.y)>=56);});}
for(const state of ['open','closed'])assert(readFileSync('frontend/assets/gr-eye-'+state+'-master-1254.png').equals(readFileSync('artwork/help-icons/hires/help-display-eye-'+state+'-master-1254.png')));
const roundtrip=normalizeEyeConfig(JSON.parse(JSON.stringify(defaults)));assert.deepEqual(roundtrip,defaults);
for(const [percent,pixels] of [[100,42],[200,84],[300,126]]){assert.equal(eyeSizePixels(percent),pixels);assert.equal(eyeSizePercent(pixels),percent);}
assert.equal(normalizeEyeConfig({size:72}).size,72);assert.equal(Math.round(eyeSizePercent(72)*10)/10,171.4);
assert.equal(normalizeEyeConfig({size:500}).size,126);assert.equal(normalizeEyeConfig({size:1}).size,36);
for(const [width,height] of [[393,851],[851,393],[1280,900]])for(const count of [1,4,8]){const radius=eyeRingRadius(126,count-1)+20;for(const x of [radius,width-radius])for(const y of [radius,height-radius]){const points=eyeBubbleLayout(count,{x,y},{left:0,top:0,right:width,bottom:height},[],126);assert.equal(points.length,count);for(const p of points)assert(Math.hypot(p.x-x,p.y-y)>100);}}
const old=execFileSync('git',['show','5cbf9ea07b536138661e1c8b83153fd99dc157d0:frontend/modules/fullscreen/map-display.js'],{encoding:'utf8'});
assert(old.includes(compassPreviewHalo('.compass-picker-stage')));assert(old.includes(compassDialogSurface('.compass-picker-dialog')));
assert(readFileSync('frontend/modules/ui/controls.js').equals(execFileSync('git',['show','5cbf9ea07b536138661e1c8b83153fd99dc157d0:frontend/modules/ui/controls.js'])),'modern menu source byte-identical');
const owner={__weatherWind:{config:{visible:true,enabled:true,mode:'barbs'},points:[],errors:['synthetic_transport_failure']},__weatherTemperature:{config:{visible:true,surface:false,labels:false,advection:false}},_weatherRadarState:()=>({enabled:false}),__weatherDisplayState:{status:'ready'}};const registry=createEyeRegistry(owner);assert.equal(registry.entries.get('wind').status().available,false);owner.__weatherWind.points=[{}];assert.equal(registry.entries.get('wind').status().available,true);assert.equal(registry.entries.get('temperature').status().active,false);owner.__weatherTemperature.config.labels=true;assert.equal(registry.entries.get('temperature').status().active,true);owner.__weatherGenericStates=new Map([['clouds',{enabled:true,status:'partial'}]]);assert.equal(registry.entries.get('weather-display').status().active,true);
console.log('PASS: Eye migration, slots 1–8/12, atomic moves, colors, ring identity, aura truth table, layout, original compass surface/halo and protected menu');
