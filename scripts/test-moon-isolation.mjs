import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {normaliseGeneratedModule as norm} from '../tests/with-settings-vault.mjs';
const baseline='c70faed47e1a888f3bcbebc62fd7bbcef202e453';
const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:40*1024*1024});
const old=p=>git('show',baseline+':'+p),now=p=>readFileSync(p,'utf8');
const modules=git('ls-tree','-r','--name-only',baseline,'frontend/modules').trim().split('\n');
let protectedModules=0;
for(const file of modules){
 if(file.endsWith('/moon-legend.js'))continue;
 let current=now(file);
 if(file.endsWith('/legend-hub.js')){
  const restore=" if(s.config.slots.includes('moon')&&s.config.legends.moon.mode==='on'&&owner.__proBranding?.eyeReady&&!moonOpen(owner))openMoon(owner);\n";
  assert.equal(current.split(restore).length,2,'exactly one guarded ready-time restore');
  current=current.replace(restore,'');
  const readiness='if(s.button.hidden!==hidden){s.button.hidden=hidden;if(!hidden)refresh(owner);}';
  assert.equal(current.split(readiness).length,2,'exactly one readiness hook');
  current=current.replace(readiness,'if(s.button.hidden!==hidden)s.button.hidden=hidden;');
 }
 assert.equal(norm(current),norm(old(file)),file+' body protected except explicit Moon restore hooks');
 protectedModules++;
}
assert.equal(now('custom_components/gewitterradar/vault_schema.py').replaceAll('\r\n','\n'),old('custom_components/gewitterradar/vault_schema.py').replaceAll('\r\n','\n'));
for(const file of git('ls-tree','-r','--name-only',baseline,'frontend/assets').trim().split('\n')){
 if(file.endsWith('gewitterradar-runtime-manifest.json'))continue;
 assert(readFileSync(file).equals(execFileSync('git',['show',baseline+':'+file],{maxBuffer:40*1024*1024})),file+' existing graphic unchanged');
}
assert(readFileSync('frontend/assets/moon/moon_full_silver_platinum_master.png').equals(readFileSync('docs/design/legend-hub/moon/references/moon_full_silver_platinum_master.png')),'hero is the exact original master');
console.log(`PASS Moon isolation: ${protectedModules} complete protected module bodies, exact Vault schema and all existing runtime assets; only two enumerated Hub restore hooks`);
