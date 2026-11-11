import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {normalizeEyeConfig,eyeBackdropDiameter,eyeStudioExtent,eyeGlowExtent,eyeRingRadius} from '../frontend/modules/weather/eye-hub-model.js';
const base='2a644f206483ca696482a0b8f2396b264e7b040a',keys=['neonBrilliance','neonBloom','neonOrganics','backdropExtent'];
for(const key of keys){assert.equal(normalizeEyeConfig()[key],0);for(const [raw,value] of [[-3,0],[103,100],[Infinity,0],[NaN,0],[27,27],['54',54]])assert.equal(normalizeEyeConfig({[key]:raw})[key],value);}
const old={grouped:true,aura:true,size:72,iconSize:200,intensity:57,brightness:68,backdrop:33,glow:'living',slots:['wind',null,'precipitation'],colors:{wind:'#00FFF0',precipitation:'#FF00CC'}};
const config=normalizeEyeConfig(old),max=normalizeEyeConfig({...config,...Object.fromEntries(keys.map(k=>[k,100]))});
for(const key of Object.keys(config))if(!keys.includes(key))assert.deepEqual(max[key],config[key]);
assert.deepEqual(normalizeEyeConfig(JSON.parse(JSON.stringify(max))),max);
assert.equal(eyeBackdropDiameter(config),config.size*1.45);assert.equal(eyeStudioExtent(config),eyeGlowExtent(config));assert(eyeBackdropDiameter(max)>eyeBackdropDiameter(config)*2);
// The original V177 draw/tick/cache/lifecycle source is literally retained.
// Allow the geometry arguments and cache identity for the two opt-in offsets.
const strip=s=>s.replace(/\?v=[^'"\s]+/g,'').replace(/\r\n/g,'\n')
 .replace(/(export const MODULE_META\s*=\s*Object\.freeze\(\{\n\s*id:\s*"weather\.precipitation-layer",\n\s*version:\s*)"[\d.]+"/,'$1"generated"');
for(const file of ['frontend/modules/weather/eye-neon.js','frontend/modules/weather/snake-canvas.js','frontend/modules/weather/snake-geometry.js','frontend/modules/weather/snake-config.js','frontend/modules/weather/snake-preview.js','frontend/modules/weather/frame-clock.js','frontend/modules/ui/controls.js','frontend/modules/weather/precipitation-layer.js']){
 let reference;try{reference=execFileSync('git',['show',base+':'+file],{encoding:'utf8',stdio:['ignore','pipe','pipe']});}catch(e){if(file.endsWith('wind-snake.js'))continue;throw e;}
 if(file.endsWith('/eye-neon.js'))reference=reference
  .replace('config.brightness,config.glow,active','config.brightness,config.glow,config.eyeAuraGap||0,config.auraRingGap||0,active')
  .replace('eyeRingRadius(config.size,a.index)','eyeRingRadius(config.size,a.index,config.eyeAuraGap,config.auraRingGap)');
 assert.equal(strip(readFileSync(file,'utf8')),strip(reference),file+' protected V177 body');
}
for(const file of ['eye-hub-model.js','eye-hub-view.js','eye-hub-locales.js','eye-neon-wow.js'])assert(!/[\u00c3\u00c2\ufffd]/.test(readFileSync('frontend/modules/weather/'+file,'utf8')),'UTF-8 '+file);
assert.equal(config.eyeAuraGap,0);
assert.equal(config.auraRingGap,0);
assert.equal(normalizeEyeConfig({eyeAuraGap:80,auraRingGap:-2}).eyeAuraGap,30);
assert.equal(normalizeEyeConfig({auraRingGap:Infinity}).auraRingGap,0);
for(const size of [36,42,126])for(let index=0;index<8;index++){
 const original=size/2+5+index*(4+size/42);
 assert.equal(eyeRingRadius(size,index,0,0),original);
 for(const gap of [0,10,20,30])for(const spacing of [0,2,5,8]){
  assert(Math.abs(eyeRingRadius(size,index,gap,spacing)-original-gap-index*spacing)<1e-9);
 }
}
console.log('PASS WOW additive defaults/ranges, protected V177 rendering source, independent extent and persistence schema');
