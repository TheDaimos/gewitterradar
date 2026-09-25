import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {readAboutLocaleModel} from './verify-about-locales.mjs';
export const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
async function walk(dir,prefix=''){const out=[];for(const entry of await readdir(dir,{withFileTypes:true})){const name=prefix+entry.name;if(entry.isDirectory())out.push(...await walk(resolve(dir,entry.name),name+'/'));else out.push(name);}return out.sort();}
async function modularPayload(contract){const wanted=Object.keys(contract.moduleFiles||{}).sort();const actual=(await walk(resolve(root,'frontend'))).filter(name=>name==='module-manifest.js'||name.startsWith('modules/')).sort();if(JSON.stringify(actual)!==JSON.stringify(wanted))throw Error('Modular source inventory mismatch');const payload=new Map();for(const name of wanted){const bytes=await readFile(resolve(root,'frontend',name)),expected=contract.moduleFiles[name];if(bytes.length!==expected.sizeBytes||hash(bytes)!==expected.sha256)throw Error('Module contract mismatch '+name);payload.set(name,bytes);}return payload;}
export async function expectedPayload(){
 const release=JSON.parse(await readFile(resolve(root,'tests/contracts/frontend-release-v4.09.json'),'utf8'));
 const source=await readFile(resolve(root,'frontend/gewitterradar.js')),text=source.toString('utf8');
 let modular=new Map(),localeSha=release.localeSha256,localeSize=release.localeSizeBytes;
 if(text.includes("const CARD_VERSION = '4.10.02';")){
  const dev=JSON.parse(await readFile(resolve(root,'tests/contracts/frontend-dev-v4.10.02.json'),'utf8'));
  if(dev.version!=='4.10.02'||dev.status!=='DEV'||dev.baseVersion!=='4.10.01')throw Error('V4.10.02 contract identity changed');
  if(source.length!==dev.sizeBytes||hash(source)!==dev.sha256)throw Error('V4.10.02 frontend contract mismatch');
  if(!text.includes("const CARD_DISPLAY_VERSION = '4.10.02';")||!text.includes("V4.10.02-MODULAR-DEV-R7-2026-09-25"))throw Error('V4.10.02 markers missing');
  modular=await modularPayload(dev);localeSha=dev.localeSha256;localeSize=dev.localeSizeBytes;
 }else if(text.includes("const CARD_VERSION = '4.10.01';")){
  const dev=JSON.parse(await readFile(resolve(root,'tests/contracts/frontend-dev-v4.10.01.json'),'utf8'));
  if(source.length!==dev.sizeBytes||hash(source)!==dev.sha256)throw Error('V4.10.01 contract mismatch');
 }else if(text.includes("const CARD_VERSION = '4.09';")){
  if(source.length!==release.sizeBytes||hash(source)!==release.sha256)throw Error('V4.09 release contract mismatch');
 }else throw Error('Frontend version is not covered by an active contract');
 const locale=await readFile(resolve(root,'frontend/locales/about-locales.js'));
 if(locale.length!==localeSize||hash(locale)!==localeSha)throw Error('Locale contract mismatch');
 readAboutLocaleModel(text,locale.toString(),await readFile(resolve(root,'frontend/modules/core/base-context.js'),'utf8'));
 const inventory=JSON.parse(await readFile(resolve(root,'frontend/assets.json'),'utf8'));
  const assetScanText=[text,...[...modular.values()].map(bytes=>bytes.toString('utf8'))].join('\n');
  const referenced=[...new Set([...assetScanText.matchAll(/new URL\('(?:\.\/|\.\.\/\.\.\/)assets\/([^'?]+)(?:\?[^']*)?', (?:import\.meta\.url|rootModuleUrl)\)/g)].map(m=>'assets/'+m[1]))].sort();
 const active=inventory.filter(a=>a.referenced!==false).map(a=>a.file).sort();
 if(JSON.stringify(referenced)!==JSON.stringify(active))throw Error('Asset inventory/reference mismatch');
 const payload=new Map([['gewitterradar.js',source],['locales/about-locales.js',locale],...modular]);
 for(const asset of inventory){const bytes=await readFile(resolve(root,'frontend',asset.file));if(hash(bytes)!==asset.sha256)throw Error('Asset SHA mismatch '+asset.file);payload.set(asset.file,bytes);}
 return payload;
}
export const destinations=['custom_components/gewitterradar/frontend','dashboard/dist'];
export const dashboardPackages=[['home-assistant/app_gewitterradar_v4_06_pkg.yaml','app_gewitterradar_v4_06_pkg.yaml'],['home-assistant/app_gewitterradar_v4_07_pkg.yaml','app_gewitterradar_v4_07_pkg.yaml']];
export async function expectedDashboardPackages(){const packages=new Map();for(const[sourceName,targetName]of dashboardPackages){packages.set(targetName,Buffer.from((await readFile(resolve(root,sourceName),'utf8')).replace(/\r\n?/g,'\n'),'utf8'));}return packages;}
export async function build(){const payload=await expectedPayload();for(const destination of destinations)for(const[name,bytes]of payload){const target=resolve(root,destination,name);await mkdir(dirname(target),{recursive:true});await writeFile(target,bytes);}const packages=await expectedDashboardPackages();for(const[name,bytes]of packages)await writeFile(resolve(root,'dashboard/dist',name),bytes);const checksumRows=[];for(const dest of destinations)for(const[name,bytes]of payload)checksumRows.push(hash(bytes)+'  '+dest+'/'+name);for(const[name,bytes]of packages)checksumRows.push(hash(bytes)+'  dashboard/dist/'+name);await writeFile(resolve(root,'SHA256SUMS_FRONTEND.txt'),checksumRows.sort().join('\n')+'\n');console.log('Built modular Gewitterradar frontend.');}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await build();
