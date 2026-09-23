import {readFile,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {root,hash,expectedPayload,expectedDashboardPackages,destinations} from './build-frontend.mjs';
const payload=await expectedPayload();
const moduleView=await readFile(resolve(root,'frontend/modules/diagnostics/module-view.js'),'utf8');
const skeleton=await readFile(resolve(root,'frontend/modules/ui/skeleton.js'),'utf8');
for(const marker of [
  '"id": "ui.skeleton"',
  '"version": "1.0.2"',
  '.settings-body {',
  'grid-auto-rows:max-content;',
  'align-content:start;',
  'overflow-y:auto!important;',
  '.settings-collapsible[open] > .settings-section-content,',
  '#settings-radii-section[open] > .settings-radius-list {',
  'max-height:none!important;',
  '#settings-map-section .settings-cluster-session-selector',
  'margin-right:10px'
]){
  if(!skeleton.includes(marker))throw Error('Settings scroll contract missing: '+marker);
}
for(const marker of [
  'version:"1.1.2"',
  '>Modul-Details</button>',
  'gr-mod-summary-compact',
  '@media(max-width:540px)',
  'width:min(780px,calc(100vw - 32px))',
  'if(backdrop)this.shadow.append(backdrop)',
  'id="settings-modules-backdrop"',
  '>Diagnose kopieren</button>',
  '>JSON herunterladen</button>',
  'if(diagnostic)diagnostic.after(section)'
]){
  if(!moduleView.includes(marker))throw Error('Module details UI contract missing: '+marker);
}
async function files(dir,prefix=''){const out=[];for(const entry of await readdir(dir,{withFileTypes:true})){const name=prefix+entry.name;if(entry.isDirectory())out.push(...await files(resolve(dir,entry.name),name+'/'));else out.push(name);}return out.sort();}
const checks=[];
for(const dest of destinations){
 const wanted=[...payload.keys()];
 if(dest==='dashboard/dist')wanted.push('app_gewitterradar_v4_06_pkg.yaml','app_gewitterradar_v4_07_pkg.yaml');
 if(JSON.stringify(await files(resolve(root,dest)))!==JSON.stringify(wanted.sort()))throw Error('Unexpected/missing payload file '+dest);
 for(const [name,bytes] of payload){const actual=await readFile(resolve(root,dest,name));if(!actual.equals(bytes))throw Error('Delivery parity failed '+dest+'/'+name);checks.push(hash(actual)+'  '+dest+'/'+name);}
}
const packages=await expectedDashboardPackages();
for(const [name,bytes] of packages){
 const actual=await readFile(resolve(root,'dashboard/dist',name));
 if(!actual.equals(bytes))throw Error('Dashboard package parity failed '+name);
 checks.push(hash(bytes)+'  dashboard/dist/'+name);
}
const expectedChecksums=checks.sort().join('\n')+'\n';
if(await readFile(resolve(root,'SHA256SUMS_FRONTEND.txt'),'utf8')!==expectedChecksums){
 console.error('Expected package checksum rows:');
 for(const row of checks.filter(row=>row.includes('_pkg.yaml')).sort())console.error(row);
 throw Error('Checksum inventory stale');
}
const hacs=JSON.parse(await readFile(resolve(root,'dashboard/hacs.json'),'utf8'));
if(hacs.filename!=='gewitterradar.js'||hacs.zip_release)throw Error('Dashboard HACS package contract changed');
console.log('PASS: V4.09 final validated against accepted V4.09.28 provenance plus diagnostic selector scope correction; exact delivery parity, assets and packages verified.');
