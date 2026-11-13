// Current releases use their canonical metadata, not historical version strings.
// Older exact-snapshot checks remain in verify-frontend.mjs for their own releases.
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {APPLICATION_RELEASE as release} from '../frontend/version.js';
import {root,hash,expectedPayload,expectedHelpPayload,expectedDashboardPackages,destinations} from './build-frontend.mjs';
const read=p=>readFile(resolve(root,p),'utf8');
const entry=await read('frontend/gewitterradar.js'),manifest=await read('frontend/module-manifest.js');
const runtime=JSON.parse(await read('frontend/assets/gewitterradar-runtime-manifest.json'));
const modules=JSON.parse(manifest.match(/EXPECTED_MODULES=Object\.freeze\((\[[\s\S]+?\])\.map\(item=>Object\.freeze\(item\)\)\)/)[1]);
assert.equal(modules.length,37);assert.equal(new Set(modules.map(m=>m.id)).size,modules.length);
for(const [k,v] of Object.entries({productVersion:release.version,displayVersion:release.displayVersion,build:release.build,runtimeRevision:release.runtimeRevision,moduleSetId:release.moduleSetId}))assert.equal(runtime[k],v,'Runtime identity: '+k);
assert.deepEqual(runtime.modules,modules.map(({id,version})=>({id,version})));
for(const m of modules){
 if(m.id==='core.manifest')continue;
 const text=await read('frontend/'+m.file),meta=text.match(/(?:export\s+)?const\s+MODULE_META\s*=\s*Object\.freeze\(\{([\s\S]*?)\}\)/)?.[1]||(m.id==='core.registry'?text.match(/registerModule\(\{(id:"core\.registry"[\s\S]*?)\}\)/)?.[1]:null);
 assert(meta,'Registered module metadata missing: '+m.file);
 const f=name=>meta.match(new RegExp('["\']?'+name+'["\']?\\s*:\\s*["\']([^"\']+)["\']'))?.[1];
 assert.equal(f('id'),m.id,m.file);assert.equal(f('version'),m.version,m.id);
}
assert(entry.includes('const GEWITTERRADAR_MODULE_CACHE = APPLICATION_RELEASE.runtimeRevision;'));
assert(!entry.includes('GEWITTERRADAR_FEATURE_CACHE'));
for(const p of ['frontend/gewitterradar.js','frontend/module-manifest.js','frontend/panel.js'])assert((await read(p)).includes('version.js?v='+release.runtimeRevision),'Stale release import '+p);
assert((await read('custom_components/gewitterradar/build_info.py')).includes('BUILD_VERSION = "'+release.version+'"'));
assert.equal(JSON.parse(await read('custom_components/gewitterradar/manifest.json')).version,release.integrationVersion);
const provenance=JSON.parse(await read('custom_components/gewitterradar/dra-deployment-provenance.json'));
for(const k of ['build','runtimeRevision','moduleSetId'])assert.equal(provenance[k],release[k]);
assert.equal(provenance.productVersion,release.version);assert.equal(provenance.deployment.channel,'deploy/dev');
const deploy=JSON.parse(await read('deploy-relay.json')),channel=JSON.parse(await read('deploy-relay-channel.json'));
assert.equal(deploy.source.repository,'TheDaimos/gewitterradar');
assert(JSON.stringify(channel).includes('deploy/dev'));
const payload=await expectedPayload(),help=await expectedHelpPayload(),packages=await expectedDashboardPackages();
async function files(dir,prefix=''){const out=[];for(const e of await readdir(resolve(root,dir,prefix),{withFileTypes:true})){const p=prefix+e.name;if(e.isDirectory())out.push(...await files(dir,p+'/'));else out.push(p);}return out.sort();}
const rows=[];
for(const dest of destinations){
 const wanted=[...payload.keys(),...help.keys(),...(dest==='dashboard/dist'?[...packages.keys()]:[])].sort();
 assert.deepEqual(await files(dest),wanted,'Delivery inventory '+dest);
 for(const [p,b] of [...payload,...help])assert((await readFile(resolve(root,dest,p))).equals(b),'Delivery bytes '+dest+'/'+p);
 for(const [p,b] of payload)rows.push(hash(b)+'  '+dest+'/'+p);
}
for(const [p,b] of packages){assert((await readFile(resolve(root,'dashboard/dist',p))).equals(b));rows.push(hash(b)+'  dashboard/dist/'+p);}
assert.equal(await read('SHA256SUMS_FRONTEND.txt'),rows.sort().join('\n')+'\n','Stale checksum inventory');
assert.equal(JSON.parse(await read('dashboard/hacs.json')).filename,'gewitterradar.js');
console.log(`PASS: ${release.displayVersion}, ${release.moduleSetId}, all ${modules.length} registered modules, canonical DRA metadata, ${payload.size} frontend files and exact delivery/checksum parity.`);
