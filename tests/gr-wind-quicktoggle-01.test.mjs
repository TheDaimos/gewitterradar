import test from 'node:test';
import {assertClassicWindPreserved} from './protected-wind-classic.mjs';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {normalizeWindConfig,effectiveWindConfig,windDisplayActive,readWindConfig} from '../frontend/modules/weather/wind-data.js';

test('schema 1 migration preserves visible combinations, pauses and preferences; default stays off',()=>{
 for(const [enabled,colorField] of [[true,true],[true,false],[false,true],[false,false]]){
  const old={schema:1,enabled,colorField,mode:'animated',color:'turquoise',tempo:'fast',density:'high',fieldOpacity:55,paused:true};
  const c=readWindConfig({getItem:()=>JSON.stringify(old)});assert.equal(c.schema,2);assert.equal(c.visible,enabled||colorField);
  for(const k of ['mode','color','tempo','density','fieldOpacity','paused','colorField'])assert.equal(c[k],old[k]);
  if(enabled||colorField)assert.equal(c.enabled,enabled);else assert(c.enabled,'stopped legacy view gets ready-to-use symbols behind the off gate');
 }
 assert.equal(windDisplayActive(normalizeWindConfig()),false);
});
test('global visibility gates both features without changing preferences or the paused state',()=>{
 for(const mode of ['barbs','arrows','animated']){
  const c=normalizeWindConfig({visible:true,enabled:true,colorField:true,mode,color:'gold',tempo:'fast',density:'high',fieldOpacity:55,paused:true});
  const off=normalizeWindConfig({...c,visible:false});assert(!windDisplayActive(off));assert(!effectiveWindConfig(off).enabled&&!effectiveWindConfig(off).colorField);
  const on=normalizeWindConfig({...off,visible:true});assert.deepEqual(on,c);assert.equal(effectiveWindConfig(on),on);
 }
 const colorsOnly=normalizeWindConfig({visible:true,enabled:false,colorField:true});assert(windDisplayActive(colorsOnly));assert.equal(effectiveWindConfig(colorsOnly).enabled,false);
});
test('normalized control positions are scoped and malformed entries cannot enter storage',()=>{
 const c=normalizeWindConfig({quickPositions:{'touch:phone:portrait:fullscreen':{x:.3,y:.7},bad:{x:Infinity,y:.4},'invalid<script>':{x:1,y:0}}});assert.deepEqual(c.quickPositions,{'touch:phone:portrait:fullscreen':{x:.3,y:.7}});
 assert.deepEqual(normalizeWindConfig(JSON.parse(JSON.stringify(c))),c);
});
test('all three original PNG masters retain their source identities; runtime files match the asset contract',async()=>{
 const manifest=JSON.parse(await readFile('artwork/help-icons/gr-wind-originals-ASSET_MANIFEST.json','utf8'));
 const expected=['4d664316ba1ef49d60330cbcff23de84e4ca03ee558deb891401ca10da0f0a26','e6ff489587c5ce3770e036997824b417868c523bdf1ee526ad9c55754d5a76d9','46030087a5490b60d56655f0faf0ac3fd6b548242877f08ffcc3c25a80ac1bbc'];
 assert.equal(manifest.originals.length,3);for(const [i,m] of manifest.originals.entries()){
  const bytes=await readFile(m.master);assert.equal(createHash('sha256').update(bytes).digest('hex'),expected[i]);assert.equal(bytes.toString('hex',0,8),'89504e470d0a1a0a');assert.deepEqual([bytes.readUInt32BE(16),bytes.readUInt32BE(20)],m.dimensions);
  for(const d of m.derivatives)assert.equal(createHash('sha256').update(await readFile('frontend/'+d.file)).digest('hex'),d.sha256);
 }
});
test('classic rendering, numeric interpolation and local field buffer remain protected',async()=>{
 assertClassicWindPreserved();
 for(const name of ['wind-field.js']){
  const file='frontend/modules/weather/'+name,before=execFileSync('git',['show','787497648a405bc27495d98ffdedd9206668fd4c:'+file],{encoding:'utf8'}).replaceAll('\r\n','\n'),after=(await readFile(file,'utf8')).replaceAll('\r\n','\n').replaceAll('411153r1','411152r1');assert.equal(after,before,name);
 }
 const wind=await readFile('frontend/modules/weather/wind-display.js','utf8'),menu=await readFile('frontend/modules/weather/layer-menu.js','utf8');assert(!/gr-wind-(barb|settings)-premium\.svg/.test(menu));assert.match(wind,/_weatherDisplayBindEyeDrag\?\.\(button,s.quickDragOptions\)/);
});
