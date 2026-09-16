import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {readAboutLocaleModel} from './verify-about-locales.mjs';
export const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const acceptedFrontendSha='249485f4bcf68c9b23b821cae9b507030ae09cff5a56f7e28d3d7f3b02eb4a1a';
const acceptedFrontendSize=1955141;
export async function expectedPayload(){
 const contract=JSON.parse(await readFile(resolve(root,'tests/contracts/diagnostic-contract-v4.07.56.json'),'utf8'));
 const accepted=contract?.acceptedSource;
 if(accepted?.sha256!==acceptedFrontendSha||accepted?.sizeBytes!==acceptedFrontendSize)throw Error('Accepted V4.07.56 source contract changed');
 const source=await readFile(resolve(root,'frontend/gewitterradar.js'));
 if(source.length!==acceptedFrontendSize||hash(source)!==acceptedFrontendSha)throw Error('Frontend differs from accepted V4.07.56 baseline');
 const localeSource=await readFile(resolve(root,'frontend/locales/about-locales.js'));
 readAboutLocaleModel(source.toString(),localeSource.toString());
 const inventory=JSON.parse(await readFile(resolve(root,'frontend/assets.json'),'utf8'));
 const referenced=[...new Set([...source.toString().matchAll(/new URL\('\.\/(assets\/[^'?]+)(?:\?[^']*)?', import.meta.url\)/g)].map(m=>m[1]))].sort();
 if(inventory.length!==17||new Set(inventory.map(a=>a.file)).size!==17||JSON.stringify(referenced)!==JSON.stringify(inventory.map(a=>a.file).sort()))throw Error('Asset inventory/reference mismatch');
 const actual=(await readdir(resolve(root,'frontend/assets'))).map(n=>'assets/'+n).sort();
 if(JSON.stringify(actual)!==JSON.stringify(referenced))throw Error('Unexpected/missing source assets');
 const frozenHashes=await readFile(resolve(root,'docs/V4_05_FRONTEND_REFERENCE_SHA256SUMS.txt'),'utf8');
 const payload=new Map([['gewitterradar.js',source],['locales/about-locales.js',localeSource]]);
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
 const pkgText=(await readFile(resolve(root,'home-assistant/app_gewitterradar_v4_06_pkg.yaml'),'utf8')).replace(/\r\n?/g,'\n');
 const pkg=Buffer.from(pkgText,'utf8');
 await writeFile(resolve(root,'dashboard/dist/app_gewitterradar_v4_06_pkg.yaml'),pkg);
 const rows=[];
 for(const dest of destinations)for(const [name,bytes] of payload)rows.push(hash(bytes)+'  '+dest+'/'+name);
 rows.push(hash(pkg)+'  dashboard/dist/app_gewitterradar_v4_06_pkg.yaml');
 await writeFile(resolve(root,'SHA256SUMS_FRONTEND.txt'),rows.sort().join('\n')+'\n');
 console.log('Built accepted V4.07.56 frontend, one lazy About-locale module and 17 common assets into both deliveries. Protected legacy assets preserved.');
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await build();
