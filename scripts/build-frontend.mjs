import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {readAboutLocaleModel} from './verify-about-locales.mjs';

export const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export const hash=bytes=>createHash('sha256').update(bytes).digest('hex');

const acceptedRcFrontendSha='2c94af487b1142fd9da450e3bbe9751c3ac17631a621b3878fd9665b557d9570';
const acceptedRcFrontendSize=2028691;
const normalizeV408FinalToAcceptedRc=text=>text
 .replace('Gewitterradar Card V4.08 FINAL','Gewitterradar Card V4.08.40 RELEASE CANDIDATE')
 .replace("const CARD_VERSION = '4.08';","const CARD_VERSION = '4.08.40';")
 .replace("const CARD_DISPLAY_VERSION = '4.08';","const CARD_DISPLAY_VERSION = '4.08.40';")
 .replace("const GEWITTERRADAR_BUILD = 'V4.08-RELEASE-2026-09-18';","const GEWITTERRADAR_BUILD = 'V4.08.40-RELEASE-CANDIDATE-2026-09-18';")
 .replaceAll('<div class="release-history-version">V4.08 · 2026/09</div>','<div class="release-history-version">V4.08 · 2026/09 · RC</div>');

export async function expectedPayload(){
 const release=JSON.parse(await readFile(resolve(root,'tests/contracts/frontend-release-v4.08.json'),'utf8'));
 if(release?.version!=='4.08'||release?.nativeIntegration!=='0.20.0')throw Error('V4.08 release contract identity changed');
 if(release?.acceptedCandidateVersion!=='4.08.40'||release?.acceptedCandidateSha256!==acceptedRcFrontendSha||release?.acceptedCandidateSizeBytes!==acceptedRcFrontendSize)throw Error('Accepted V4.08.40 provenance changed');

 const source=await readFile(resolve(root,'frontend/gewitterradar.js'));
 const sourceText=source.toString('utf8');
 const sourceSha=hash(source);
 const isV408Final=source.length===release.sizeBytes&&sourceSha===release.sha256;
 let activeContract=release;
 let activeLabel='V4.08 final';

 if(isV408Final){
  if(!sourceText.includes("const CARD_VERSION = '4.08';")||!sourceText.includes("const CARD_DISPLAY_VERSION = '4.08';")||!sourceText.includes("const GEWITTERRADAR_BUILD = 'V4.08-RELEASE-2026-09-18';"))throw Error('V4.08 final version/build markers missing');
  const normalized=Buffer.from(normalizeV408FinalToAcceptedRc(sourceText),'utf8');
  if(normalized.length!==acceptedRcFrontendSize||hash(normalized)!==acceptedRcFrontendSha)throw Error('V4.08 final frontend contains changes beyond approved RC40 release metadata');
 }else{
  const candidate=JSON.parse(await readFile(resolve(root,'tests/contracts/frontend-candidate-v4.09.01.json'),'utf8'));
  if(candidate?.contractVersion!==1||candidate?.version!=='4.09.01'||candidate?.status!=='development-candidate')throw Error('V4.09.01 candidate contract identity changed');
  if(candidate?.baseReleaseVersion!=='4.08'||candidate?.baseReleaseSha256!==release.sha256)throw Error('V4.09.01 candidate no longer anchored to V4.08');
  if(source.length!==candidate.sizeBytes||sourceSha!==candidate.sha256)throw Error('Frontend differs from locked V4.09.01 development candidate');
  if(candidate.build!=='V4.09.01-MAP-VIEW-MODES-2026-09-20'||!sourceText.includes(`const GEWITTERRADAR_BUILD = '${candidate.build}';`))throw Error('V4.09.01 build marker missing');
  if(!Array.isArray(candidate.requiredMarkers)||candidate.requiredMarkers.length<1)throw Error('V4.09.01 requiredMarkers missing');
  for(const marker of candidate.requiredMarkers)if(!sourceText.includes(marker))throw Error('V4.09.01 required marker missing: '+marker);
  activeContract=candidate;
  activeLabel='V4.09.01 development candidate';
 }

 const localeSource=await readFile(resolve(root,'frontend/locales/about-locales.js'));
 if(localeSource.length!==activeContract.localeSizeBytes||hash(localeSource)!==activeContract.localeSha256)throw Error(activeLabel+' locale differs from protected locale contract');
 readAboutLocaleModel(sourceText,localeSource.toString());

 const inventory=JSON.parse(await readFile(resolve(root,'frontend/assets.json'),'utf8'));
 const referenced=[...new Set([...sourceText.matchAll(/new URL\('\.\/(assets\/[^'?]+)(?:\?[^']*)?', import.meta.url\)/g)].map(m=>m[1]))].sort();
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
 payload.contractLabel=activeLabel;
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

 console.log(`Built Gewitterradar ${payload.contractLabel || 'current frontend contract'} with exact delivery parity.`);
 for(const [name,bytes] of packages)console.log(`Dashboard package ${name}: ${bytes.length} bytes, SHA256 ${hash(bytes)}`);
 console.log('Protected diagnostic/assets baseline preserved; V4.06 fallback and V4.07 package retained.');
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await build();
