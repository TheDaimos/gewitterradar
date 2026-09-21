import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {readAboutLocaleModel} from './verify-about-locales.mjs';

export const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export const hash=bytes=>createHash('sha256').update(bytes).digest('hex');

const acceptedCandidateFrontendSha='0f85dd6866339745c9daabbf7356badf9c49e683a02d16856d86fdc998117fd8';
const acceptedCandidateFrontendSize=2238844;
const normalizeV409FinalToAcceptedCandidate=text=>text
 .replace('Gewitterradar Card V4.09 FINAL','Gewitterradar Card V4.09.28 DEV')
 .replace("const CARD_VERSION = '4.09';","const CARD_VERSION = '4.09.28';")
 .replace("const CARD_DISPLAY_VERSION = '4.09';","const CARD_DISPLAY_VERSION = '4.09.28';")
 .replace("const GEWITTERRADAR_BUILD = 'V4.09-RELEASE-2026-09-21';","const GEWITTERRADAR_BUILD = 'V4.09.28-DEV-2026-09-21';");

export async function expectedPayload(){
 const release=JSON.parse(await readFile(resolve(root,'tests/contracts/frontend-release-v4.09.json'),'utf8'));
 if(release?.version!=='4.09'||release?.nativeIntegration!=='0.21.0')throw Error('V4.09 release contract identity changed');
 if(release?.acceptedCandidateVersion!=='4.09.28'||release?.acceptedCandidateSha256!==acceptedCandidateFrontendSha||release?.acceptedCandidateSizeBytes!==acceptedCandidateFrontendSize)throw Error('Accepted V4.09.28 provenance changed');

 const source=await readFile(resolve(root,'frontend/gewitterradar.js'));
 if(source.length!==release.sizeBytes||hash(source)!==release.sha256)throw Error('Frontend differs from V4.09 final release contract');
 const sourceText=source.toString('utf8');
 if(!sourceText.includes("const CARD_VERSION = '4.09';")||!sourceText.includes("const CARD_DISPLAY_VERSION = '4.09';")||!sourceText.includes("const GEWITTERRADAR_BUILD = 'V4.09-RELEASE-2026-09-21';"))throw Error('V4.09 final version/build markers missing');
 const normalized=Buffer.from(normalizeV409FinalToAcceptedCandidate(sourceText),'utf8');
 if(normalized.length!==acceptedCandidateFrontendSize||hash(normalized)!==acceptedCandidateFrontendSha)throw Error('V4.09 final frontend contains changes beyond approved V4.09.26 release metadata');

 const localeSource=await readFile(resolve(root,'frontend/locales/about-locales.js'));
 if(localeSource.length!==release.localeSizeBytes||hash(localeSource)!==release.localeSha256)throw Error('V4.09 locale differs from accepted V4.09.28');
 readAboutLocaleModel(sourceText,localeSource.toString());

 const inventory=JSON.parse(await readFile(resolve(root,'frontend/assets.json'),'utf8'));
 const referenced=[...new Set([...sourceText.matchAll(/new URL\('\.\/(assets\/[^'?]+)(?:\?[^']*)?', import.meta.url\)/g)].map(m=>m[1]))].sort();
 const activeInventory=inventory.filter(a=>a.referenced!==false).map(a=>a.file).sort();
 const retainedInventory=inventory.filter(a=>a.referenced===false);
 if(inventory.length!==18||new Set(inventory.map(a=>a.file)).size!==18||activeInventory.length!==17||JSON.stringify(referenced)!==JSON.stringify(activeInventory))throw Error('Asset inventory/reference mismatch');
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
 for(const destination of destinations)for(const [name,bytes] of payload){
  const target=resolve(root,destination,name);
  await mkdir(dirname(target),{recursive:true});
  await writeFile(target,bytes);
 }
 const packages=await expectedDashboardPackages();
 for(const [name,bytes] of packages)await writeFile(resolve(root,'dashboard/dist',name),bytes);

 const rows=[];
 for(const dest of destinations)for(const [name,bytes] of payload)rows.push(hash(bytes)+'  '+dest+'/'+name);
 for(const [name,bytes] of packages)rows.push(hash(bytes)+'  dashboard/dist/'+name);
 await writeFile(resolve(root,'SHA256SUMS_FRONTEND.txt'),rows.sort().join('\n')+'\n');

 console.log('Built Gewitterradar V4.09 final from the accepted V4.09.28 candidate with release-metadata-only normalization.');
 for(const [name,bytes] of packages)console.log(`Dashboard package ${name}: ${bytes.length} bytes, SHA256 ${hash(bytes)}`);
 console.log('Protected diagnostic/assets baseline preserved; V4.06 fallback and V4.07 package retained.');
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await build();
