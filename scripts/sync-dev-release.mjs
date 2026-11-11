// Canonical release source is frontend/version.js. Regenerate its delivery metadata
// and registered module versions from the explicit pre-change deploy/dev commit.
import {readFile,readdir} from 'node:fs/promises';
import {writeFile} from './write-release-file.mjs';
import {resolve,posix} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const base=process.argv[2];
if(!/^[0-9a-f]{40}$/.test(base||''))throw Error('Usage: node scripts/sync-dev-release.mjs <pre-change commit SHA>');
const read=p=>readFile(p,'utf8'),write=(p,t)=>writeFile(p,t.replace(/\r\n/g,'\n'));
const before=p=>execFileSync('git',['show',base+':'+p],{encoding:'utf8',maxBuffer:20*1024*1024});
const field=(s,key)=>s.match(new RegExp(key+':"([^"]+)"'))?.[1];
const bump=s=>{const p=s.split('.').map(Number);if(p.length!==3||p.some(x=>!Number.isInteger(x)))throw Error('Invalid version '+s);p[2]++;return p.join('.');};
const old=before('frontend/version.js'),version=bump(field(old,'version')),patch=version.split('.')[2],integrationVersion=bump(field(old,'integrationVersion'));
const release={id:'gewitterradar',version,displayVersion:`V${version} DEV`,build:`V${version}-DEV-${new Date().toISOString().slice(0,10)}`,runtimeRevision:`411${patch}r1`,moduleSetId:`E411-${patch}A1`,integrationVersion};
const source='export const APPLICATION_RELEASE=Object.freeze({\n'+Object.entries(release).map(([k,v])=>'  '+k+':'+JSON.stringify(v)).join(',\n')+'\n});\n';
const manifestPath='frontend/module-manifest.js',manifest=await read(manifestPath),matcher=/EXPECTED_MODULES=Object\.freeze\((\[[\s\S]+?\])\.map\(item=>Object\.freeze\(item\)\)\)/;
const oldModules=JSON.parse(before(manifestPath).match(matcher)[1]),modules=JSON.parse(manifest.match(matcher)[1]);
const modified=new Set(execFileSync('git',['diff','--name-only',base,'--','frontend'],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean).map(p=>p.slice('frontend/'.length)));
modified.add('module-manifest.js');modified.add('version.js');
modified.add('gewitterradar.js');modified.add('panel.js');
// Include importers before generating module versions: a cache-only importer
// change must be reflected in the manifest during this same synchronization.
const jsPaths=await files('frontend');
for(let grew=true;grew;){
 grew=false;
 for(const path of jsPaths){
  const own=posix.relative('frontend',path);if(modified.has(own))continue;
  const text=await read(path);
  const dependencies=[...text.matchAll(/(["'])(\.\.?\/[^"'?]+\.js)\?v=[^"']+\1/g)].map(m=>posix.relative('frontend',posix.normalize(posix.join(posix.dirname(path),m[2]))));
  if(dependencies.some(p=>modified.has(p))){modified.add(own);grew=true;}
 }
}
for(const item of modules){
 if(item.id==='core.manifest'){item.version=bump(oldModules.find(m=>m.id===item.id).version);continue;}
 if(!modified.has(item.file))continue;
 const oldModule=oldModules.find(m=>m.id===item.id);if(!oldModule)throw Error('New registered modules need explicit review: '+item.id);
 item.version=bump(oldModule.version);
 const path='frontend/'+item.file,text=await read(path),meta=/((?:export\s+)?const\s+MODULE_META\s*=\s*Object\.freeze\(\{[\s\S]*?\b["']?version["']?\s*:\s*["'])([^"']+)(["'])/;
 if(!meta.test(text))throw Error('Cannot update registered metadata '+path);
 await write(path,text.replace(meta,(_,a,_v,c)=>a+item.version+c));
}
await write('frontend/version.js',source);
await write(manifestPath,manifest.replace(matcher,'EXPECTED_MODULES=Object.freeze('+JSON.stringify(modules,null,2)+'.map(item=>Object.freeze(item)))'));
async function files(dir){const out=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=posix.join(dir,e.name);if(e.isDirectory())out.push(...await files(p));else if(p.endsWith('.js'))out.push(p);}return out;}
for(const path of await files('frontend')){
 let text=await read(path);
 text=text.replace(/(["'])(\.\.?\/[^"'?]+\.js)\?v=[^"']+\1/g,(all,q,relative)=>modified.has(posix.relative('frontend',posix.normalize(posix.join(posix.dirname(path),relative))))?q+relative+'?v='+release.runtimeRevision+q:all);
 if(path==='frontend/gewitterradar.js'){
  text=text.replace(/gewitterradarImport\((['"])([^'"]+\.js)\1(?:,\s*['"][^'"]*['"])?\)/g,(all,q,p)=>modified.has(p.replace(/^\.\//,''))?`gewitterradarImport(${q}${p}${q},'${release.runtimeRevision}')`:all);
  text=text.replace(/Gewitterradar Card V4\.11\.\d+ DEV/,'Gewitterradar Card '+release.displayVersion);
 }
 if(text!==await read(path))await write(path,text);
}
const runtimePath='frontend/assets/gewitterradar-runtime-manifest.json',runtime=JSON.parse(await read(runtimePath));
Object.assign(runtime,{productVersion:release.version,displayVersion:release.displayVersion,build:release.build,runtimeRevision:release.runtimeRevision,moduleSetId:release.moduleSetId,modules:modules.map(({id,version})=>({id,version}))});
await write(runtimePath,JSON.stringify(runtime,null,2)+'\n');
const assetInventoryPath='frontend/assets.json',assetInventory=JSON.parse(await read(assetInventoryPath));
const runtimeAsset=assetInventory.find(a=>a.file==='assets/gewitterradar-runtime-manifest.json');
if(!runtimeAsset)throw Error('Runtime asset inventory missing');
const runtimeBytes=await readFile(runtimePath);
runtimeAsset.sha256=createHash('sha256').update(runtimeBytes).digest('hex');
runtimeAsset.sizeBytes=runtimeBytes.length;
await write(assetInventoryPath,JSON.stringify(assetInventory,null,2)+'\n');
const manifestHa='custom_components/gewitterradar/manifest.json',ha=JSON.parse(await read(manifestHa));ha.version=release.integrationVersion;await write(manifestHa,JSON.stringify(ha,null,2)+'\n');
await write('custom_components/gewitterradar/build_info.py',(await read('custom_components/gewitterradar/build_info.py')).replace(/BUILD_VERSION = "[^"]+"/,'BUILD_VERSION = "'+release.version+'"'));
const provenancePath='custom_components/gewitterradar/dra-deployment-provenance.json',provenance=JSON.parse(await read(provenancePath));
Object.assign(provenance,{productVersion:release.version,build:release.build,runtimeRevision:release.runtimeRevision,moduleSetId:release.moduleSetId,baselineFeatureHead:base});
provenance.deployment.purpose='Menu navigation, existing diagnostics separation and Premium UI alignment; WeatherRouter data paths unchanged.';
await write(provenancePath,JSON.stringify(provenance,null,2)+'\n');
console.log(JSON.stringify({release,updatedModules:modules.filter(m=>modified.has(m.file)).map(m=>({id:m.id,version:m.version}))},null,2));
