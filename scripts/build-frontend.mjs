import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {readAboutLocaleModel} from './verify-about-locales.mjs';
export const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const acceptedFrontendSha='b433b8d20a865f6a2fd507d37ca320818fbecb0a00d1d7633ab43906e4db80c8';
const acceptedFrontendSize=1977250;
export async function expectedPayload(){
 const contract=JSON.parse(await readFile(resolve(root,'tests/contracts/diagnostic-contract-v4.07.56.json'),'utf8'));
 const accepted=contract?.acceptedSource;
 if(accepted?.sha256!==acceptedFrontendSha||accepted?.sizeBytes!==acceptedFrontendSize)throw Error('Accepted V4.08 map-view source contract changed');
 const source=await readFile(resolve(root,'frontend/gewitterradar.js'));
 if(source.length!==acceptedFrontendSize||hash(source)!==acceptedFrontendSha)throw Error('Frontend differs from accepted V4.08 map-view baseline');
 const localeSource=await readFile(resolve(root,'frontend/locales/about-locales.js'));
 readAboutLocaleModel(source.toString(),localeSource.toString());
 const inventory=JSON.parse(await readFile(resolve(root,'frontend/assets.json'),'utf8'));
 const referenced=[...new Set([...source.toString().matchAll(/new URL\('\.\/(assets\/[^'?]+)(?:\?[^']*)?', import.meta.url\)/g)].map(m=>m[1]))].sort();
 const activeInventory=inventory.filter(a=>a.referenced!==false).map(a=>a.file).sort();
 const retainedInventory=inventory.filter(a=>a.referenced===false);
 if(inventory.length!==17||new Set(inventory.map(a=>a.file)).size!==17||activeInventory.length!==16||JSON.stringify(referenced)!==JSON.stringify(activeInventory))throw Error('Asset inventory/reference mismatch');
 if(retainedInventory.length!==1||retainedInventory[0].file!=='assets/gewitterradar-about-close-premium.webp'||retainedInventory[0].retention!=='legacy')throw Error('Retained legacy asset contract changed');
 const actual=(await readdir(resolve(root,'frontend/assets'))).map(n=>'assets/'+n).sort();
 const inventoried=inventory.map(a=>a.file).sort();
 if(JSON.stringify(actual)!==JSON.stringify(inventoried))throw Error('Unexpected/missing source assets');
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
export const dashboardPackages=[
 ['home-assistant/app_gewitterradar_v4_06_pkg.yaml','app_gewitterradar_v4_06_pkg.yaml'],
 ['home-assistant/app_gewitterradar_v4_07_pkg.yaml','app_gewitterradar_v4_07_pkg.yaml'],
];
export async function expectedDashboardPackages(){
 const packages=new Map();
 for(const [sourceName,targetName] of dashboardPackages){
  const text=(await readFile(resolve(root,sourceName),'utf8')).replace(/\r\n?/g,'\n');
  packages.set(targetName,Buffer.from(text,'utf8'));
 }
 return packages;
}
export async function build(){
 const payload=await expectedPayload();
 for(const destination of destinations)for(const [name,bytes] of payload){const target=resolve(root,destination,name);await mkdir(dirname(target),{recursive:true});await writeFile(target,bytes);}
 const packages=await expectedDashboardPackages();
 for(const [name,bytes] of packages)await writeFile(resolve(root,'dashboard/dist',name),bytes);
 const rows=[];
 for(const dest of destinations)for(const [name,bytes] of payload)rows.push(hash(bytes)+'  '+dest+'/'+name);
 for(const [name,bytes] of packages)rows.push(hash(bytes)+'  dashboard/dist/'+name);
 await writeFile(resolve(root,'SHA256SUMS_FRONTEND.txt'),rows.sort().join('\n')+'\n');
 console.log('Built accepted V4.08 map-view frontend, one lazy About-locale module, 16 referenced assets and 1 retained legacy asset into both deliveries.');
 for(const [name,bytes] of packages)console.log(`Dashboard package ${name}: ${bytes.length} bytes, SHA256 ${hash(bytes)}`);
 console.log('Protected legacy assets preserved; V4.06 fallback package retained and V4.07 package built deterministically.');
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await build();
