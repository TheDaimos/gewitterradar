import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const sha=b=>createHash('sha256').update(b).digest('hex');
const load=async p=>readFile(p,'utf8'),save=async(p,s)=>writeFile(p,s,'utf8');
const change=(s,a,b,p)=>{const n=s.split(a).length-1;if(n!==1)throw Error(p+': expected exactly one '+a+'; found '+n);return s.replace(a,b)};
const dev=JSON.parse(await load('tests/contracts/frontend-dev-v4.10.02.json'));
const sourcePath='frontend/gewitterradar.js',modulePath='frontend/module-manifest.js';
const old=await readFile(sourcePath);
if(sha(old)!==dev.sha256||dev.build!=='V4.10.02-MODULAR-DEV-R40-2026-09-30')throw Error('Not exact accepted R40');
let s=old.toString('utf8');
for(const [a,b] of [
 ['/* Gewitterradar Card V4.10.02 MODULAR DEV','/* Gewitterradar Card V4.10 FINAL'],
 ["const CARD_VERSION = '4.10.02';","const CARD_VERSION = '4.10';"],
 ["const CARD_DISPLAY_VERSION = '4.10.02';","const CARD_DISPLAY_VERSION = '4.10';"],
 ["const GEWITTERRADAR_BUILD = 'V4.10.02-MODULAR-DEV-R40-2026-09-30';","const GEWITTERRADAR_BUILD = 'V4.10-RELEASE-2026-09-30';"],
 ['Gewitterradar V4.10.02 · Modul-Ladefehler','Gewitterradar V4.10 · Modul-Ladefehler']
])s=change(s,a,b,sourcePath);
await save(sourcePath,s);
let m=await load(modulePath);
m=change(m,'version:"4.10.02",displayVersion:"V4.10.02",build:"V4.10.02-MODULAR-DEV-R40-2026-09-30"','version:"4.10",displayVersion:"V4.10",build:"V4.10-RELEASE-2026-09-30"',modulePath);
await save(modulePath,m);
const rp='frontend/assets/gewitterradar-runtime-manifest.json';
const runtime=JSON.parse(await load(rp));
if(runtime.productVersion!=='4.10.02'||runtime.build!==dev.build||runtime.moduleSetId!=='D40A-5E9B')throw Error('Runtime drift');
runtime.productVersion='4.10';runtime.build='V4.10-RELEASE-2026-09-30';
await save(rp,JSON.stringify(runtime,null,2)+'\n');
const assets=JSON.parse(await load('frontend/assets.json'));
const item=assets.find(x=>x.file==='assets/gewitterradar-runtime-manifest.json');
if(!item)throw Error('Runtime asset missing');item.sha256=sha(await readFile(rp));
await save('frontend/assets.json',JSON.stringify(assets,null,2)+'\n');
let build=await load('scripts/build-frontend.mjs');
const needle=" if(text.includes(\"const CARD_VERSION = '4.10.02';\")){";
const release=[
 " if(text.includes(\"const CARD_VERSION = '4.10';\")){",
 "  const final=JSON.parse(await readFile(resolve(root,'tests/contracts/frontend-release-v4.10.json'),'utf8'));",
 "  if(final.version!=='4.10'||final.status!=='FINAL'||final.acceptedCandidateSha256!=='c9940895892e05d0c424cc2d2b6d27f43c24d345f81f1227c4716f3d6404943e')throw Error('V4.10 contract provenance mismatch');",
 "  if(source.length!==final.sizeBytes||hash(source)!==final.sha256)throw Error('V4.10 frontend checksum mismatch');",
 "  if(!text.includes(\"const CARD_DISPLAY_VERSION = '4.10';\")||!text.includes('V4.10-RELEASE-2026-09-30'))throw Error('V4.10 release markers missing');",
 "  modular=await modularPayload(final);localeSha=final.localeSha256;localeSize=final.localeSizeBytes;",
 " }else if(text.includes(\"const CARD_VERSION = '4.10.02';\")){"
].join('\n');
build=change(build,needle,release,'scripts/build-frontend.mjs');
await save('scripts/build-frontend.mjs',build);
const contract=structuredClone(dev);
Object.assign(contract,{version:'4.10',status:'FINAL',acceptedCandidateVersion:'4.10.02-R40',acceptedCandidateCommit:'bcf30fe2dc1b6b56625edf209b2373b956fb7fd4',acceptedCandidateSha256:dev.sha256,acceptedCandidateSizeBytes:dev.sizeBytes,build:'V4.10-RELEASE-2026-09-30',sha256:sha(await readFile(sourcePath)),sizeBytes:(await readFile(sourcePath)).length});
for(const [name,entry]of Object.entries(contract.moduleFiles)){const bytes=await readFile('frontend/'+name);entry.sha256=sha(bytes);entry.sizeBytes=bytes.length}
await save('tests/contracts/frontend-release-v4.10.json',JSON.stringify(contract,null,2)+'\n');
let v=await load('custom_components/gewitterradar/build_info.py');v=change(v,'BUILD_VERSION = "4.10.02"','BUILD_VERSION = "4.10"','build_info');await save('custom_components/gewitterradar/build_info.py',v);
const native=JSON.parse(await load('custom_components/gewitterradar/manifest.json'));if(native.version!=='0.21.0')throw Error('Previous native version drift');native.version='0.22.0';await save('custom_components/gewitterradar/manifest.json',JSON.stringify(native,null,2)+'\n');
let readme=await load('README.md');readme=change(readme,'Gewitterradar-V4.09-c9a45b','Gewitterradar-V4.10-c9a45b','README.md');await save('README.md',readme);
let verify=await load('scripts/verify-frontend.mjs');verify=change(verify,'PASS: V4.09 final validated against accepted V4.09.28 provenance plus diagnostic selector scope correction; exact delivery parity, assets and packages verified.','PASS: active version contract, exact delivery parity, assets and packages verified.','verify-frontend');await save('scripts/verify-frontend.mjs',verify);
execFileSync(process.execPath,['scripts/build-frontend.mjs'],{stdio:'inherit'});
execFileSync(process.execPath,['scripts/verify-frontend.mjs'],{stdio:'inherit'});
console.log('V4.10 FINAL public metadata normalized; accepted R40 source checksum '+dev.sha256+'; release checksum '+contract.sha256);
