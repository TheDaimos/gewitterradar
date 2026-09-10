import {readFile,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {root,hash,expectedPayload,destinations} from './build-frontend.mjs';
const payload=await expectedPayload();
async function files(dir,prefix=''){const out=[];for(const entry of await readdir(dir,{withFileTypes:true})){const name=prefix+entry.name;if(entry.isDirectory())out.push(...await files(resolve(dir,entry.name),name+'/'));else out.push(name);}return out.sort();}
const checks=[];
for(const dest of destinations){
 const wanted=[...payload.keys()];if(dest==='dashboard/dist')wanted.push('app_gewitterradar_v4_06_pkg.yaml');
 if(JSON.stringify(await files(resolve(root,dest)))!==JSON.stringify(wanted.sort()))throw Error('Unexpected/missing payload file '+dest);
 for(const [name,bytes] of payload){const actual=await readFile(resolve(root,dest,name));if(!actual.equals(bytes))throw Error('Delivery parity failed '+dest+'/'+name);checks.push(hash(actual)+'  '+dest+'/'+name);}
}
const pkgText=(await readFile(resolve(root,'home-assistant/app_gewitterradar_v4_06_pkg.yaml'),'utf8')).replace(/\r\n?/g,'\n');
const pkg=Buffer.from(pkgText,'utf8');
if(!(await readFile(resolve(root,'dashboard/dist/app_gewitterradar_v4_06_pkg.yaml'))).equals(pkg))throw Error('Legacy package parity failed');
checks.push(hash(pkg)+'  dashboard/dist/app_gewitterradar_v4_06_pkg.yaml');
if(await readFile(resolve(root,'SHA256SUMS_FRONTEND.txt'),'utf8')!==checks.sort().join('\n')+'\n')throw Error('Checksum inventory stale');
const hacs=JSON.parse(await readFile(resolve(root,'dashboard/hacs.json'),'utf8'));
if(hacs.filename!=='gewitterradar.js'||hacs.zip_release)throw Error('Dashboard HACS package contract changed');
console.log('PASS: frozen baseline, approved delta, both deliveries, 17 assets, exact inventory, YAML and SHA-256 parity.');
