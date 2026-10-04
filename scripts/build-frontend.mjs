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
 const versionSource=await readFile(resolve(root,'frontend/version.js')).catch(()=>null),versionText=versionSource?.toString('utf8')||'';
 let modular=new Map(),localeSha=release.localeSha256,localeSize=release.localeSizeBytes;
 if(text.includes("APPLICATION_RELEASE")&&versionText.includes('version:"4.11.08"')){
  const final=JSON.parse(await readFile(resolve(root,'tests/contracts/frontend-release-v4.10.json'),'utf8'));
  const manifestText=await readFile(resolve(root,'frontend/module-manifest.js'),'utf8');
  if(!versionText.includes('displayVersion:"V4.11.08 DEV"')||!versionText.includes('build:"V4.11.08-DEV-2026-10-02"')||!versionText.includes('runtimeRevision:"41108r1"')||!versionText.includes('moduleSetId:"E411-08A6"'))throw Error('V4.11.08 canonical version mismatch');
  if(!manifestText.includes('export const APPLICATION_META=APPLICATION_RELEASE;')||!text.includes("const GEWITTERRADAR_MODULE_CACHE = APPLICATION_RELEASE.runtimeRevision;")||text.includes("GEWITTERRADAR_FEATURE_CACHE"))throw Error('V4.11.08 runtime revision source mismatch');
  const old=final.moduleFiles,additional=['modules/weather/consumer-client.js','modules/core/update-watch.js','modules/weather/precipitation-layer.js','modules/weather/layer-menu.js','modules/ui/project-hub.js'];
  const actual=(await walk(resolve(root,'frontend'))).filter(name=>name==='module-manifest.js'||name.startsWith('modules/')).sort();
  const expected=[...Object.keys(old),...additional].sort();
  if(JSON.stringify(actual)!==JSON.stringify(expected))throw Error('V4.11.08 module inventory mismatch');
  const consumer=await readFile(resolve(root,'frontend/modules/weather/consumer-client.js'),'utf8');
  const radar=await readFile(resolve(root,'frontend/modules/weather/precipitation-layer.js'),'utf8');
  const layerMenu=await readFile(resolve(root,'frontend/modules/weather/layer-menu.js'),'utf8');
  const watch=await readFile(resolve(root,'frontend/modules/core/update-watch.js'),'utf8');
  if(!consumer.includes("id:'weather.consumer-client',version:'1.2.0'")||!manifestText.includes('"id": "weather.consumer-client"'))throw Error('WeatherRouter module identity mismatch');
  if(!radar.includes('id:"weather.precipitation-layer"')||!radar.includes('version:"1.3.1"')||!radar.includes('{bbox-epsg-3857}')||!radar.includes('WEATHER_RADAR_PRELOAD_PROFILES')||!manifestText.includes('"id": "weather.precipitation-layer"'))throw Error('Precipitation raster module identity mismatch');
  if(!layerMenu.includes('id:"weather.layer-menu"')||!layerMenu.includes('version:"1.0.2"')||!layerMenu.includes('buildWeatherLayerCatalog')||!manifestText.includes('"id": "weather.layer-menu"'))throw Error('WeatherRouter layer-menu module identity mismatch');
  if(!watch.includes('id:"core.update-watch"')||!watch.includes('cache:"no-store"')||!manifestText.includes('"id": "core.update-watch"'))throw Error('Runtime update-watch identity mismatch');
  const projectHub=await readFile(resolve(root,'frontend/modules/ui/project-hub.js'),'utf8');
  if(!projectHub.includes('id:"ui.project-hub"')||!projectHub.includes('version:"1.1.13"')||!projectHub.includes('createElement("iframe")')||!manifestText.includes('"id": "ui.project-hub"'))throw Error('Project Hub module identity/security mismatch');
  const allowedModified=new Set(['module-manifest.js','modules/ui/skeleton.js','modules/diagnostics/module-view.js','modules/core/card-lifecycle.js','modules/fullscreen/map-display.js','modules/weather/precipitation-layer.js']);
  for(const name of actual){
    const bytes=await readFile(resolve(root,'frontend',name));
    if(old[name]&&!allowedModified.has(name)){
      const normalized=Buffer.from(bytes.toString('utf8').replaceAll('41108r1','41002r13'),'utf8');
      if(normalized.length!==old[name].sizeBytes||hash(normalized)!==old[name].sha256)throw Error('V4.10 protected module changed beyond runtime revision: '+name);
    }
    modular.set(name,bytes);
  }
  localeSha=final.localeSha256;localeSize=final.localeSizeBytes;
 }else if(text.includes("const CARD_VERSION = '4.10';")){
  const final=JSON.parse(await readFile(resolve(root,'tests/contracts/frontend-release-v4.10.json'),'utf8'));
  if(final.version!=='4.10'||final.status!=='FINAL'||final.acceptedCandidateSha256!=='c9940895892e05d0c424cc2d2b6d27f43c24d345f81f1227c4716f3d6404943e')throw Error('V4.10 contract provenance mismatch');
  if(source.length!==final.sizeBytes||hash(source)!==final.sha256)throw Error('V4.10 frontend checksum mismatch');
  if(!text.includes("const CARD_DISPLAY_VERSION = '4.10';")||!text.includes('V4.10-RELEASE-2026-09-30'))throw Error('V4.10 release markers missing');
  modular=await modularPayload(final);localeSha=final.localeSha256;localeSize=final.localeSizeBytes;
 }else if(text.includes("const CARD_VERSION = '4.10.02';")){
  const dev=JSON.parse(await readFile(resolve(root,'tests/contracts/frontend-dev-v4.10.02.json'),'utf8'));
  if(dev.version!=='4.10.02'||dev.status!=='DEV'||dev.baseVersion!=='4.10.01')throw Error('V4.10.02 contract identity changed');
  if(source.length!==dev.sizeBytes||hash(source)!==dev.sha256)throw Error('V4.10.02 frontend contract mismatch');
  if(!text.includes("const CARD_DISPLAY_VERSION = '4.10.02';")||!text.includes("V4.10.02-MODULAR-DEV-R40-2026-09-30"))throw Error('V4.10.02 markers missing');
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
 const projectHubRuntime=new Map([
  ['project-hub/project-hub-config.json',await readFile(resolve(root,'frontend/project-hub/project-hub-config.json'))],
  ['project-hub/asset-manifest.json',await readFile(resolve(root,'frontend/project-hub/asset-manifest.json'))],
  ['project-hub/offline/index.html',await readFile(resolve(root,'frontend/project-hub/offline/index.html'))],
  ['project-hub/offline/assets/ck-logo.webp',await readFile(resolve(root,'frontend/project-hub/offline/assets/ck-logo.webp'))],
  ['project-hub/offline/assets/project-icons.webp',await readFile(resolve(root,'frontend/project-hub/offline/assets/project-icons.webp'))]
 ]);
 const payload=new Map([['gewitterradar.js',source],...(versionSource?[['version.js',versionSource]]:[]),['locales/about-locales.js',locale],...modular,...projectHubRuntime]);
 for(const asset of inventory){const bytes=await readFile(resolve(root,'frontend',asset.file));if(hash(bytes)!==asset.sha256)throw Error('Asset SHA mismatch '+asset.file);payload.set(asset.file,bytes);}
 return payload;
}
export async function expectedHelpPayload(){
 const payload=new Map([['help/index.html',await readFile(resolve(root,'docs/gewitterradar-overview.html'))]]);
 for(const name of await walk(resolve(root,'docs/assets')))payload.set('help/assets/'+name,await readFile(resolve(root,'docs/assets',name)));
 return payload;
}
export const destinations=['custom_components/gewitterradar/frontend','dashboard/dist'];
export const dashboardPackages=[['home-assistant/app_gewitterradar_v4_06_pkg.yaml','app_gewitterradar_v4_06_pkg.yaml'],['home-assistant/app_gewitterradar_v4_07_pkg.yaml','app_gewitterradar_v4_07_pkg.yaml']];
export async function expectedDashboardPackages(){const packages=new Map();for(const[sourceName,targetName]of dashboardPackages){packages.set(targetName,Buffer.from((await readFile(resolve(root,sourceName),'utf8')).replace(/\r\n?/g,'\n'),'utf8'));}return packages;}
export async function build(){const payload=await expectedPayload(),help=await expectedHelpPayload();for(const destination of destinations)for(const[name,bytes]of [...payload,...help]){const target=resolve(root,destination,name);await mkdir(dirname(target),{recursive:true});await writeFile(target,bytes);}const packages=await expectedDashboardPackages();for(const[name,bytes]of packages)await writeFile(resolve(root,'dashboard/dist',name),bytes);const checksumRows=[];for(const dest of destinations)for(const[name,bytes]of payload)checksumRows.push(hash(bytes)+'  '+dest+'/'+name);for(const[name,bytes]of packages)checksumRows.push(hash(bytes)+'  dashboard/dist/'+name);await writeFile(resolve(root,'SHA256SUMS_FRONTEND.txt'),checksumRows.sort().join('\n')+'\n');console.log('Built modular Gewitterradar frontend.');}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await build();
