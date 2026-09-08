import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {approvedDelta} from './frontend-delta.mjs';
export const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
export async function expectedPayload(){
 const baseline=await readFile(resolve(root,'tests/fixtures/v4_05/gewitterradar.js'));
 if(hash(baseline)!=='9f594d5c23c5af5bdabf90749eb2639457a4cc14307407e20674036a02565e9b')throw Error('Frozen V4.05 fixture changed');
 const source=await readFile(resolve(root,'frontend/gewitterradar.js'));
 if(source.toString()!==approvedDelta(baseline.toString()))throw Error('Frontend exceeds approved close/copy/DEV delta');
 const inventory=JSON.parse(await readFile(resolve(root,'frontend/assets.json'),'utf8'));
 const referenced=[...new Set([...source.toString().matchAll(/new URL\('\.\/(assets\/[^'?]+)(?:\?[^']*)?', import.meta.url\)/g)].map(m=>m[1]))].sort();
 if(inventory.length!==17||new Set(inventory.map(a=>a.file)).size!==17||JSON.stringify(referenced)!==JSON.stringify(inventory.map(a=>a.file).sort()))throw Error('Asset inventory/reference mismatch');
 const actual=(await readdir(resolve(root,'frontend/assets'))).map(n=>'assets/'+n).sort();
 if(JSON.stringify(actual)!==JSON.stringify(referenced))throw Error('Unexpected/missing source assets');
 const frozenHashes=await readFile(resolve(root,'docs/V4_05_FRONTEND_REFERENCE_SHA256SUMS.txt'),'utf8');
 const payload=new Map([['gewitterradar.js',source]]);
 for(const asset of inventory){
  const bytes=await readFile(resolve(root,'frontend',asset.file));
  if(hash(bytes)!==asset.sha256)throw Error('Asset SHA mismatch '+asset.file);
  if(asset.protected&&!frozenHashes.includes(asset.sha256+'  dist/'+asset.file))throw Error('Protected V4.05 asset changed '+asset.file);
  payload.set(asset.file,bytes);
 }
 return payload;
}
export const destinations=['custom_components/gewitterradar/frontend','dashboard/dist'];
export async function build(){
 const payload=await expectedPayload();
 for(const destination of destinations)for(const [name,bytes] of payload){const target=resolve(root,destination,name);await mkdir(dirname(target),{recursive:true});await writeFile(target,bytes);}
 const pkg=await readFile(resolve(root,'home-assistant/app_gewitterradar_pkg.yaml'));
 await writeFile(resolve(root,'dashboard/dist/app_gewitterradar_pkg.yaml'),pkg);
 const rows=[];
 for(const dest of destinations)for(const [name,bytes] of payload)rows.push(hash(bytes)+'  '+dest+'/'+name);
 rows.push(hash(pkg)+'  dashboard/dist/app_gewitterradar_pkg.yaml');
 await writeFile(resolve(root,'SHA256SUMS_FRONTEND.txt'),rows.sort().join('\n')+'\n');
 console.log('Built one frontend and 17 common assets into both deliveries. Frozen V4.05 preserved.');
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await build();
