import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {normaliseGeneratedModule as norm} from '../tests/with-settings-vault.mjs';
const baseline='11a1376f9b9e1a9079ef62e80b87048341651e7f',tested='98fd56b0ca75ec06c95d9e8e14ab63f978015081';
const git=(...a)=>execFileSync('git',a,{encoding:'utf8',maxBuffer:30*1024*1024}),old=p=>git('show',baseline+':'+p).replaceAll('\r\n','\n'),now=p=>readFileSync(p,'utf8').replaceAll('\r\n','\n'),path=n=>'frontend/modules/weather/'+n+'.js';
const allowed=new Set(['legend-hub-view','legend-hub','legend-scale'].map(path)),unchanged=[];
const icons=JSON.parse(now('docs/evidence/gr-v412-polish/icon-bounds.json'));
for(const icon of icons)assert.equal(createHash('sha256').update(readFileSync('frontend/assets/'+icon.file)).digest('hex'),icon.sha256,'measured original icon unchanged');
for(const file of git('diff','--name-only',baseline,'--','frontend/modules').trim().split('\n').filter(Boolean))if(!allowed.has(file)){assert.equal(norm(now(file)),norm(old(file)),file+' functional body unchanged');unchanged.push(file);}
const slice=(s,a,b)=>{assert(s.includes(a)&&s.includes(b));return s.slice(s.indexOf(a),s.indexOf(b));};
const view=now(path('legend-hub-view')),previous=old(path('legend-hub-view'));
for(const [a,b]of [['const select=','export function openLegendConfig'],["render();form.addEventListener('change'",'export function openHubConfig']])assert.equal(slice(view,a,b),slice(previous,a,b),'native controls and individual persistence unchanged');
assert.equal(view.slice(view.indexOf(' const move=')),previous.slice(previous.indexOf(' const move=')),'all reorder/glass/drag/persistence handlers unchanged');
const hub=norm(now(path('legend-hub'))),before=norm(old(path('legend-hub')));
const addition="const center=SLOT_ICON_CENTERS[id==='advection'?'temperature':id==='other'?'weather-display':id];if(metrics&&center){b.style.setProperty('--lh-icon-x',(metrics.source/2-center[0])*40/metrics.motif+'px');b.style.setProperty('--lh-icon-y',(metrics.source/2-center[1])*40/metrics.motif+'px');}";
assert(hub.includes(addition));assert.equal(hub.slice(hub.indexOf('function refresh')).replace(addition,''),before.slice(before.indexOf('function refresh')),'native Hub gestures, geometry and slot lifecycle unchanged');
assert.equal(slice(hub,'function geometry','function extraLegend'),slice(before,'function geometry','function extraLegend'),'main symbol and placement unchanged');
const preview="options.preview?Math.max(SIZES[c.size],available*({S:.72,M:.82,L:.92,XL:1})[c.size]):SIZES[c.size]",scale=now(path('legend-scale'));assert(scale.includes(preview));assert.equal(norm(scale.replace(preview,'SIZES[c.size]')),norm(old(path('legend-scale'))),'nonpreview renderer, palettes, ticks, fitting and values unchanged');
for(const file of ['legend-overlay','legend-instrument','legend-precipitation','premium-legend','legend-information','legend-hub-model','legend-preferences','eye-hub-model'].map(path).concat(['frontend/modules/core/settings-vault.js','custom_components/gewitterradar/vault_schema.py'])){assert.equal(norm(now(file)),norm(old(file)),file+' protected body unchanged');unchanged.push(file);}
const ci=JSON.parse(old('docs/evidence/gr-v412-premium/ci-results.json'));assert.equal(ci.sourceCommit,tested);assert.equal(ci.workflowRuns.length,8);assert(ci.workflowRuns.every(r=>r.testedCommit===tested&&r.conclusion==='success'));
for(const tree of ['frontend','custom_components/gewitterradar','dashboard/dist','scripts','tests','.github'])assert.equal(git('rev-parse',baseline+':'+tree).trim(),git('rev-parse',tested+':'+tree).trim(),'exact tested baseline tree');
const proof={baselineSource:tested,baselineDocumentation:baseline,scope:'three presentation modules; preview-only length budget and cached slot centers',unchangedBodies:[...new Set(unchanged)],reusedBaselineRuns:ci.workflowRuns,guards:['original slot sizing and source assets','unchanged native Hub/form/drag handlers','exact nonpreview renderer','unchanged map overlay bodies','unchanged Eye/Vault/configuration contracts']};
if(process.env.GR_POLISH_PROOF){mkdirSync(dirname(process.env.GR_POLISH_PROOF),{recursive:true});writeFileSync(process.env.GR_POLISH_PROOF,JSON.stringify(proof,null,2)+'\n');}
console.log('PASS polish scope: three presentation bodies; native handlers, map renderers, Eye/Vault and eight baseline CI receipts protected');
