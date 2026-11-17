import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {execFileSync} from 'node:child_process';
import {SNAKE_DEFAULTS,SNAKE_LIMITS} from '../frontend/modules/weather/snake-config.js';
import {WindStudioModel,FACTORY_PROFILES,exportPresetJSON,exportPresetCSV,importPreset,profileName,validateStudioParameters,MAX_PRESET_BYTES,STUDIO_STORAGE} from '../frontend/modules/weather/wind-studio-data.js';
const memory=()=>{const data=new Map();return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),data};};
const beforeRelease='253dafabf44e5412fe59d8270b12ef113acfbce0';
const readAt=(ref,path)=>execFileSync('git',['show',ref+':'+path],{encoding:'utf8',maxBuffer:10000000});
const withoutCache=s=>s.replace(/\r/g,'').replace(/(\.js\?v=)\d+r\d+/g,'$1CACHE');
const withNewOpacityFloor=(name,text)=>name==='snake-config.js'?text.replace('opacity:[10,100,1]','opacity:[0,100,1]'):text;
test('JSON roundtrip uses the actual eleven renderer keys and percent opacity',()=>{const p={...SNAKE_DEFAULTS,bodyWidth:2.5,opacity:85};const result=importPreset(exportPresetJSON('Rotation Europa',p));assert.equal(result.renderer,'snake-flow');assert.deepEqual(result.parameters,p);assert.equal(result.parameters.opacity,85);assert.deepEqual(Object.keys(result.parameters),Object.keys(SNAKE_LIMITS));});
test('CSV roundtrip preserves UTF-8 names, commas and quotes; decimal point and metadata',()=>{const name='Böen, "Gold"';const text=exportPresetCSV(name,SNAKE_DEFAULTS);assert(text.startsWith('\ufeffparameter,value\r\n'));assert(text.includes('"tailStart","0.67"'));const result=importPreset(text,{format:'csv'});assert.equal(result.name,name);assert.deepEqual(result.parameters,SNAKE_DEFAULTS);});
test('CSV pasted partial merges atomically without resetting unspecified values',()=>{const base={...SNAKE_DEFAULTS,bodyWidth:3.4};const p=importPreset('parameter,value\ndensity,2\nmaxLength,90\n',{format:'csv',partial:true,base});assert.equal(p.parameters.bodyWidth,3.4);assert.equal(p.parameters.density,2);assert.equal(p.parameters.maxLength,90);assert.equal(base.density,1);assert.equal(importPreset('parameter,value\ndensity,2',{format:'csv',partial:true,base,fallbackName:'Mein Entwurf'}).name,'Mein Entwurf');assert.throws(()=>importPreset('parameter,value\ndensity,2',{format:'csv'}),/fehlt/);});
test('invalid formats, schemas, types, unknown keys, NaN, infinity and ranges fail closed',()=>{
 const json=JSON.parse(exportPresetJSON('Sicher',SNAKE_DEFAULTS));for(const patch of [{format:'evil'},{schemaVersion:2},{renderer:'javascript:evil'},{parameters:{...SNAKE_DEFAULTS,opacity:-1}},{parameters:{...SNAKE_DEFAULTS,speed:'1'}},{parameters:{...SNAKE_DEFAULTS,unknown:1}},{parameters:{...SNAKE_DEFAULTS,maxLength:999}}])assert.throws(()=>importPreset(JSON.stringify({...json,...patch})));
 for(const value of [NaN,Infinity,-Infinity])assert.throws(()=>validateStudioParameters({...SNAKE_DEFAULTS,density:value}));assert.throws(()=>importPreset('{"format":"gr-wind-animation-preset","schemaVersion":1,"name":"X","renderer":"snake-flow","parameters":{"density":1e400}}'));
 assert.throws(()=>importPreset(' '.repeat(MAX_PRESET_BYTES+1)));assert.throws(()=>importPreset(JSON.stringify({...json,parameters:JSON.parse('{"__proto__":{}}')})));
});
test('opacity percentages including zero round-trip through JSON, CSV and saved profiles',()=>{
 const storage=memory(),studio=new WindStudioModel(SNAKE_DEFAULTS,{storage});studio.create('Deckkraft');
 for(const opacity of [0,25,50,75,100]){
  const params={...SNAKE_DEFAULTS,opacity};
  assert.equal(importPreset(exportPresetJSON('Deckkraft',params)).parameters.opacity,opacity);
  assert.equal(importPreset(exportPresetCSV('Deckkraft',params),{format:'csv'}).parameters.opacity,opacity);
  studio.setDraft({opacity});studio.save();
  assert.equal(new WindStudioModel(SNAKE_DEFAULTS,{storage}).draft.opacity,opacity);
 }
});
test('CSV rejects duplicate, unknown, missing, malformed and nonfinite numbers',()=>{for(const csv of ['density,1\ndensity,2','unknown,1','density,NaN','density,Infinity','density,','density,1,2','density,6','"density,1'])assert.throws(()=>importPreset('parameter,value\n'+csv,{format:'csv',partial:true}));assert.throws(()=>importPreset('parameter;value\ndensity;1',{format:'csv',partial:true}));});
test('profile names are plain bounded text and cannot introduce HTML or spreadsheet formulas',()=>{for(const name of ['','<img src=x onerror=1>','=WEBSERVICE("x")','+SUM(1)','@A1','A\nB','x'.repeat(65)])assert.throws(()=>profileName(name));assert.equal(profileName('  Meine Böen  '),'Meine Böen');});
test('first draft starts at active parameters; create/save/load/rename/duplicate/reset persist',()=>{const storage=memory(),active={...SNAKE_DEFAULTS,headSize:1.7},m=new WindStudioModel(active,{storage});assert.deepEqual(m.draft,active);m.create('Eigenes');m.setDraft({density:2});m.save();m.rename('Böen');const first=m.selected;m.duplicate('Böen Kopie');assert.notEqual(m.selected,first);assert.equal(m.users.length,2);m.setDraft({density:4});m.load();assert.equal(m.draft.density,2);const again=new WindStudioModel(SNAKE_DEFAULTS,{storage});assert.equal(again.users[0].name,'Böen');assert.equal(again.draft.density,2);assert.equal(again.selected,m.selected);assert.equal(active.density,1);});
test('factory profiles cannot be saved, renamed or deleted; deletion requires confirmation',()=>{const m=new WindStudioModel(SNAKE_DEFAULTS,{storage:memory()});m.select(FACTORY_PROFILES[0].id);m.load();for(const action of [()=>m.save(),()=>m.rename('X'),()=>m.remove(true)])assert.throws(action,/geschützt/);m.duplicate('Eigene Kopie');assert.throws(()=>m.remove(),/bestätigt/);m.remove(true);assert.equal(m.users.length,0);assert.equal(m.profiles.length,FACTORY_PROFILES.length);});
test('invalid imports and failed storage writes do not alter saved profiles or draft',()=>{const storage=memory(),m=new WindStudioModel(SNAKE_DEFAULTS,{storage});m.create('Vorhanden');const before=storage.getItem(STUDIO_STORAGE),draft={...m.draft};assert.throws(()=>importPreset('parameter,value\ndensity,500',{format:'csv',partial:true,base:m.draft}));assert.equal(storage.getItem(STUDIO_STORAGE),before);assert.deepEqual(m.draft,draft);storage.setItem=()=>{throw Error('quota');};assert.throws(()=>m.setDraft({density:2}),/gespeichert/);assert.deepEqual(m.draft,draft);});
test('the Studio and offline page share the same preview and renderer; protected render/data paths stay exact',()=>{
 const preview=readFileSync('frontend/modules/weather/snake-preview.js','utf8'),offline=readFileSync('docs/previews/snake-flow.html','utf8'),studio=readFileSync('frontend/modules/weather/wind-studio.js','utf8');assert(preview.includes('new SnakeCanvas('));assert(offline.includes('new SnakePreview('));assert(studio.includes('new SnakePreview('));assert(!studio.includes('new SnakeCanvas('));assert(!offline.includes('function makeField('));
 for(const name of ['snake-canvas.js','snake-geometry.js','snake-config.js','wind-canvas.js','wind-field.js','flow-geometry.js','temperature-canvas.js','consumer-client.js','frame-clock.js']){
  const path='frontend/modules/weather/'+name,ref=name==='consumer-client.js'?beforeRelease:'ac73cb59abeac399c9fc24dcb78194ecef0c3e0b';
  const current=readFileSync(path,'utf8'),reference=withNewOpacityFloor(name,readAt(ref,path));
  // Compare the transport byte-for-byte. The diagnostics labels and HTML are
  // presentation; the settings UI must still issue the same provider calls.
  const transport=source=>name==='consumer-client.js'
    ? source.replace(/const fmtDate[\s\S]*?(?=const capGroup)/,'')
      .replace(/const DIAGNOSTIC_GROUP_KEYS[^]*?\n};\n/,'')
      .replace(/  _weatherEngine(?:(?:DiagnosticEnsureUi)|(?:RenderSourceCards))\(\)\{[\s\S]*?(?=  _weatherEngine(?:DiagnosticOpen|EmbedDiagnostics)\(\))/g,'')
      .replace(/  _mountWeatherRouterSettings\(\)\{[^]*(?=\n}\)\);)/,'')
      .replace(/(id:'weather\.consumer-client',version:')[^']+/, '$1MODULE_VERSION') : source;
  assert.equal(withoutCache(transport(current)),withoutCache(transport(reference)),name);
  if(name==='consumer-client.js'){
   const providerCalls=source=>source.slice(source.indexOf('  _mountWeatherRouterSettings()')).match(/this\._weatherRouter(?:Reset|Discovery|Capabilities|Resolve)\([^\n]*?\)/g);
   assert.deepEqual(providerCalls(current),providerCalls(reference),'settings provider calls');
  }
 }
});

test('protected reference, defaults, eleven existing sliders, quick bindings and storage logic remain exact',()=>{
 const before=p=>readAt(beforeRelease,p).replace(/\r/g,''),now=p=>readFileSync(p,'utf8').replace(/\r/g,'');
 for(const name of ['snake-canvas.js','snake-geometry.js','snake-config.js','wind-data.js']){const p='frontend/modules/weather/'+name;assert.equal(withoutCache(now(p)),withoutCache(withNewOpacityFloor(name,before(p))),name);}
 const p='frontend/modules/weather/wind-display.js',old=before(p),current=now(p);
 const line=(s,marker)=>s.split('\n').find(text=>text.includes(marker));
 assert.equal(line(current,'const snakeRange=').split('quick=false)')[1],line(old,'const snakeRange=').split('quick=false)')[1]);
 for(const marker of ['<details data-section="animation">','<details data-section="snake">']) {
  const controls=s=>Array.from(line(s,marker).matchAll(/snakeRange\('[^']+'|(?:data-section|data-wind-action|data-wind-setting)="[^"]+"|SNAKE_LIMITS\)\.map\(key=>snakeRange\(key\)\)/g),match=>match[0]);
  assert.deepEqual(controls(current),controls(old),marker);
 }
 const method=(s,a,b)=>s.slice(s.indexOf(a),s.indexOf(b));for(const [a,b] of [['_weatherWindSet(patch,',' _weatherWindUpdatePainters(points,field,'],['_weatherWindSyncSnakeControls(){','_weatherWindSnakeStatus(){']])assert.equal(withoutCache(method(current,a,b)),withoutCache(method(old,a,b)),a);
 const doc='docs/GR_SNAKE_FLOW_PROTECTED_REFERENCE_2026-11-08.md';assert.equal(now(doc),readAt('efadf2cc7e0fd708ac20cf391637e2ccf8f0e7e5',doc).replace(/\r/g,''));
});
