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
const makeHooks = (initializer,warnings=[]) =>
  new Function('initializeMonitoredAreas','console',code+';return {syncMonitoredAreas,stopMonitoredAreas};')(
    initializer,{warn:(...args)=>warnings.push(args)});
const flush=()=>new Promise(resolve=>setImmediate(resolve));

test('default OFF / invalid flags: no runtime start, no owner writes or listeners',()=>{
  let starts=0;
  const {syncMonitoredAreas,stopMonitoredAreas}=makeHooks(()=>{starts++;throw Error('must not start')});
  for(const value of [undefined,false,1,'true',null]){
    const card=Object.freeze({isConnected:true,_config:Object.freeze({monitored_areas_enabled:value})});
    syncMonitoredAreas(card);stopMonitoredAreas(card);
  }
  assert.equal(starts,0);
  assert(!loadedModules().some(m=>m.id==='monitored-areas.lifecycle'));
  assert(!moduleDiagnostics(EXPECTED_MODULES).rows.some(m=>m.id==='monitored-areas.lifecycle'));
});
test('ON: one runtime start, idempotent teardown and restart',async()=>{
  const mod=await import('../frontend/modules/monitored-areas/index.js');
  let starts=0,stops=0;
  const {syncMonitoredAreas,stopMonitoredAreas}=makeHooks((card,enabled)=>{
    starts++;assert.equal(enabled,true);
    const runtime=mod.initializeMonitoredAreas(card,true);
    return {get status(){return runtime.status;},teardown(){stops++;runtime.teardown();}};
  });
  const card={isConnected:true,_config:{monitored_areas_enabled:true}};
  syncMonitoredAreas(card);syncMonitoredAreas(card);await flush();
  assert.equal(starts,1);
  stopMonitoredAreas(card);stopMonitoredAreas(card);assert.equal(stops,1);
  syncMonitoredAreas(card);await flush();assert.equal(starts,2);
  stopMonitoredAreas(card);assert.equal(stops,2);
});
test('disconnect and OFF terminate active runtime, no restart',async()=>{
  for(const disconnect of [true,false]){
    let starts=0,stops=0;
    const {syncMonitoredAreas,stopMonitoredAreas}=makeHooks(()=>{
      starts++;return {teardown(){stops++;}};
    });
    const card={isConnected:true,_config:{monitored_areas_enabled:true}};
    syncMonitoredAreas(card);await flush();
    if(disconnect){card.isConnected=false;stopMonitoredAreas(card);}
    else {card._config.monitored_areas_enabled=false;syncMonitoredAreas(card);}
    syncMonitoredAreas(card);await flush();
    assert.equal(starts,1);assert.equal(stops,1);
  }
});
test('optional initialization and teardown failures remain isolated',async()=>{
  const warnings=[],card={isConnected:true,_config:{monitored_areas_enabled:true}};
  let mode=0;
  const {syncMonitoredAreas,stopMonitoredAreas}=makeHooks(()=>{
    if(mode===0)throw Error('init');
    return {teardown(){throw Error('stop');}};
  },warnings);
  syncMonitoredAreas(card);await flush();assert.equal(warnings.length,1);
  mode=1;syncMonitoredAreas(card);await flush();stopMonitoredAreas(card);
  assert.equal(warnings.length,2);
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
