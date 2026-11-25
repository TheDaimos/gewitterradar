import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {EXPECTED_MODULES} from '../frontend/module-manifest.js';
import {moduleDiagnostics, loadedModules, registerModule} from '../frontend/modules/core/registry.js?v=4141r1';
const base = new URL('../', import.meta.url);
const source = await readFile(new URL('frontend/gewitterradar.js',base),'utf8');
const code = source.slice(source.indexOf('  const maSlots = new WeakMap();'),source.indexOf('  window.__GEWITTERRADAR_BOOT_DIAGNOSTICS={phase:'));
assert(code.includes('syncMonitoredAreas') && code.includes('stopMonitoredAreas'));
const makeHooks = (importer, warnings = []) => new Function('gewitterradarImport','console',code+';return {syncMonitoredAreas,stopMonitoredAreas};')(importer,{warn:(...args)=>warnings.push(args)});
const flush=()=>new Promise(resolve=>setImmediate(resolve));
test('default OFF / invalid flags: no import, no owner writes or listeners',()=>{
  let calls=0;const {syncMonitoredAreas,stopMonitoredAreas}=makeHooks(()=>{calls++;throw Error('must not import')});
  for(const value of [undefined,false,1,'true',null]){
    const card=Object.freeze({isConnected:true,_config:Object.freeze({monitored_areas_enabled:value})});
    syncMonitoredAreas(card);stopMonitoredAreas(card);
  }
  assert.equal(calls,0);
  assert(!loadedModules().some(m=>m.id==='monitored-areas.lifecycle'));
  assert(!moduleDiagnostics(EXPECTED_MODULES).rows.some(m=>m.id==='monitored-areas.lifecycle'));
});
test('ON inert: actual lazy import, one start, repeated teardown and restart',async()=>{
  const mod=await import('../frontend/modules/monitored-areas/index.js');
  let imports=0;const {syncMonitoredAreas,stopMonitoredAreas}=makeHooks(async()=>{imports++;return mod});
  const card=Object.freeze({isConnected:true,_config:Object.freeze({monitored_areas_enabled:true})});
  syncMonitoredAreas(card);syncMonitoredAreas(card);await flush();
  assert.equal(imports,1);
  const runtime=mod.initializeMonitoredAreas(card,true);
  assert.equal(runtime.status,'ready');assert.equal(mod.initializeMonitoredAreas(card,true),runtime);
  stopMonitoredAreas(card);stopMonitoredAreas(card);assert.equal(runtime.status,'stopped');
  syncMonitoredAreas(card);await flush();assert.equal(imports,2);
  const again=mod.initializeMonitoredAreas(card,true);assert.notEqual(again,runtime);stopMonitoredAreas(card);assert.equal(again.status,'stopped');
});
test('pending import cannot start after disconnect or OFF',async()=>{
  for(const disconnect of [true,false]){
    let resolve,starts=0;const {syncMonitoredAreas,stopMonitoredAreas}=makeHooks(()=>new Promise(r=>resolve=r));
    const card={isConnected:true,_config:{monitored_areas_enabled:true}};
    syncMonitoredAreas(card);
    if(disconnect){card.isConnected=false;stopMonitoredAreas(card)}else{card._config.monitored_areas_enabled=false;syncMonitoredAreas(card)}
    resolve({initializeMonitoredAreas(){starts++}});await flush();assert.equal(starts,0);
  }
});
test('import, initialization and teardown failures isolated',async()=>{
  const warnings=[];const card={isConnected:true,_config:{monitored_areas_enabled:true}};
  let mode=0;const {syncMonitoredAreas,stopMonitoredAreas}=makeHooks(async()=>{
    if(mode===0)throw Error('import');
    if(mode===1)return {initializeMonitoredAreas(){throw Error('init')}};
    return {initializeMonitoredAreas(){return {teardown(){throw Error('stop')}}}};
  },warnings);
  for(mode=0;mode<3;mode++){syncMonitoredAreas(card);await flush();stopMonitoredAreas(card)}
  assert.equal(warnings.length,3);
});
test('regular optional registration and exact inventory/mirror hashes',async()=>{
  const mod=await import('../frontend/modules/monitored-areas/index.js');
  const meta=EXPECTED_MODULES.find(m=>m.id===mod.MODULE_META.id);
  assert.deepEqual(meta,mod.MODULE_META);assert.equal(EXPECTED_MODULES.length,38);
  assert.equal(EXPECTED_MODULES.filter(m=>!m.optional).length,37);
  const runtime=JSON.parse(await readFile(new URL('frontend/assets/gewitterradar-runtime-manifest.json',base),'utf8'));
  assert.deepEqual(runtime.modules,EXPECTED_MODULES.map(({id,version,optional})=>optional?{id,version,optional:true}:{id,version}));
  const diag=moduleDiagnostics(EXPECTED_MODULES);assert.equal(diag.rows.find(m=>m.id===meta.id).status,'ok');
  assert(diag.rows.some(m=>m.status==='missing')); // required missing remains an error
  registerModule({...mod.MODULE_META,version:'wrong'});
  assert.equal(moduleDiagnostics(EXPECTED_MODULES).rows.find(m=>m.id===meta.id).status,'version_mismatch');
  const checks=await readFile(new URL('SHA256SUMS_FRONTEND.txt',base),'utf8');
  for(const p of ['gewitterradar.js','module-manifest.js','version.js','panel.js','modules/core/registry.js','modules/core/runtime.js','modules/core/card-lifecycle.js','modules/ui/settings-vault-view.js','modules/monitored-areas/index.js','assets/gewitterradar-runtime-manifest.json']){
    const content=await readFile(new URL('frontend/'+p,base));const hash=createHash('sha256').update(content).digest('hex');
    for(const dest of ['dashboard/dist','custom_components/gewitterradar/frontend']){
      assert.deepEqual(await readFile(new URL(dest+'/'+p,base)),content);
      assert(checks.includes(hash+'  '+dest+'/'+p+'\n'));
    }
  }
  const assets=JSON.parse(await readFile(new URL('frontend/assets.json',base),'utf8'));
  const item=assets.find(a=>a.file==='assets/gewitterradar-runtime-manifest.json');
  const raw=await readFile(new URL('frontend/'+item.file,base));assert.equal(item.sha256,createHash('sha256').update(raw).digest('hex'));assert.equal(item.sizeBytes,raw.length);
});
