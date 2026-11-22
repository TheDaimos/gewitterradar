import {normaliseGeneratedModule} from '../tests/with-settings-vault.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {normalizeEyeConfig,eyeBackdropDiameter,eyeStudioExtent,eyeGlowExtent,eyeRingRadius} from '../frontend/modules/weather/eye-hub-model.js';
const keys=['neonBrilliance','neonBloom','neonOrganics','backdropExtent'];
for(const key of keys){assert.equal(normalizeEyeConfig()[key],0);for(const [raw,value] of [[-3,0],[103,100],[Infinity,0],[NaN,0],[27,27],['54',54]])assert.equal(normalizeEyeConfig({[key]:raw})[key],value);}
const old={grouped:true,aura:true,size:72,iconSize:200,intensity:57,brightness:68,backdrop:33,glow:'living',slots:['wind',null,'precipitation'],colors:{wind:'#00FFF0',precipitation:'#FF00CC'}};
const config=normalizeEyeConfig(old),max=normalizeEyeConfig({...config,...Object.fromEntries(keys.map(k=>[k,100]))});
for(const key of Object.keys(config))if(!keys.includes(key))assert.deepEqual(max[key],config[key]);
assert.deepEqual(normalizeEyeConfig(JSON.parse(JSON.stringify(max))),max);
assert.equal(eyeBackdropDiameter(config),config.size*1.45);assert.equal(eyeStudioExtent(config),eyeGlowExtent(config));assert(eyeBackdropDiameter(max)>eyeBackdropDiameter(config)*2);
// Protect the V177 draw/tick/cache/lifecycle with the approved geometric offsets,
// optional Aura color and conservative viewport check around the final sprites.
const strip=normaliseGeneratedModule;
for(const file of ['frontend/modules/weather/eye-neon.js','frontend/modules/weather/snake-canvas.js','frontend/modules/weather/snake-geometry.js','frontend/modules/weather/snake-config.js','frontend/modules/weather/snake-preview.js','frontend/modules/weather/frame-clock.js','frontend/modules/ui/controls.js','frontend/modules/weather/precipitation-layer.js']){
 // V4.12 deliberately changes only ring projection/finite layout transitions.
 // Keep exact FINAL guards on the filament math, halo cache and lifecycle;
 // test the modified orchestration with the pixel and V4.12 browser matrices.
 if(file.endsWith('/eye-neon.js')){
  const reference=execFileSync('git',['show','af70fe2bf85a88fdea402cf46e3bd6a11903189b:'+file],{encoding:'utf8'}),actual=readFileSync(file,'utf8');
  const exports=s=>s.slice(s.indexOf('export function filamentPointInto'),s.indexOf('function curve('));
  assert.equal(exports(actual),exports(reference),'protected filament geometry and adaptive quality');
  const method=(s,name)=>s.match(new RegExp('\\n '+name+'\\([^]*?(?=\\n [a-zA-Z]+\\(|\\n})'))?.[0];
  for(const name of ['visible','release','cacheHalo','stop','destroy']){assert(method(actual,name),'missing neon '+name);assert.equal(method(actual,name),method(reference,name),'protected neon '+name);}
  continue;
 }
 const reference=execFileSync('git',['show','af70fe2bf85a88fdea402cf46e3bd6a11903189b:'+file],{encoding:'utf8',maxBuffer:25*1024*1024});
 assert.equal(strip(readFileSync(file,'utf8')),strip(reference),file+' protected FINAL body');
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
console.log('PASS WOW additive defaults/ranges, protected FINAL filament math/cache/lifecycle, independent extent and persistence schema');
