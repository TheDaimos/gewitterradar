import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {normaliseGeneratedModule as norm} from '../tests/with-settings-vault.mjs';
const base='afea83c8c5e53e8cd93870e879d28aefa642d902',tested='77689b7eb4691cdc3f93600ffb882a23f9056ab9';
const git=(...a)=>execFileSync('git',a,{encoding:'utf8',maxBuffer:25*1024*1024}),old=p=>git('show',base+':'+p).replaceAll('\r\n','\n'),read=p=>readFileSync(p,'utf8').replaceAll('\r\n','\n');
const receipts=JSON.parse(old('docs/evidence/gr-moon-413/ci-results.json'));assert.equal(receipts.commit,tested);assert.equal(receipts.runs.length,12);assert(receipts.runs.every(r=>r.conclusion==='success'&&r.head_sha===tested));
for(const p of ['frontend','custom_components/gewitterradar','dashboard/dist','scripts','tests','.github'])assert.equal(git('rev-parse',base+':'+p),git('rev-parse',tested+':'+p),'baseline exact tested trees');
const allowed=new Set(['moon-legend.js','legend-hub.js','legend-hub-model.js','legend-hub-view.js','legend-hub-locales.js','render.js','compass-preview-style.js']);
const changed=git('diff','--name-only',base,'--','frontend/modules').trim().split('\n').filter(Boolean);
for(const p of changed)if(!allowed.has(p.split('/').at(-1)))assert.equal(norm(read(p)),norm(old(p)),p+' protected');
const path=n=>'frontend/modules/'+n;
let p=path('ui/render.js');assert.equal(norm(read(p).replace('      this.__grMoon?.renderDistance?.();\n','')),norm(old(p)),'single Moon-only unit render hook');
p=path('weather/legend-hub-model.js');const model=s=>s.replace(/^export const normalizeMoonUi=.*\n/m,'').replace("v.slots:['precipitation','wind','temperature','synoptic','moon']","v.slots:['precipitation','wind','temperature','synoptic']");assert.equal(norm(model(read(p))),norm(model(old(p))));
p=path('weather/legend-hub.js');const adapted=old(p).replace("'weather-display':[609.5,636]","'weather-display':[609.5,636],moon:[254,259]").replace('const metrics=EYE_ICON_METRICS[',"const metrics=id==='moon'?{source:512,motif:374}:EYE_ICON_METRICS[");assert.equal(norm(read(p)),norm(adapted),'Moon icon metrics only');
p=path('weather/legend-hub-view.js');const view=s=>s.replace(/^  select\(t\('moonDistanceUnit'\).*\n/m,'').replace('goldClassic:"#c9a050",','').replace("['platinum','gold','goldClassic'],c.frameMaterial,v=>v==='goldClassic'?t('moonClassicGold'):t('frame_'+v)","['platinum','gold'],c.frameMaterial,v=>t('frame_'+v)");assert.equal(norm(view(read(p))),norm(view(old(p))),'only two Moon menu additions');
p=path('fullscreen/compass-preview-style.js');const load=s=>import('data:text/javascript;base64,'+Buffer.from(s).toString('base64'));const a=await load(old(p)),b=await load(read(p));for(const selector of ['.eye-hub-config','.compass-picker']){assert.equal(a.compassDialogSurface(selector),b.compassDialogSurface(selector));assert.equal(a.compassPreviewHalo(selector),b.compassPreviewHalo(selector));}
p=path('weather/legend-hub-locales.js');const l=await load(old(p)),r=await load(read(p));assert.equal(Object.keys(r.LEGEND_HUB_TRANSLATIONS).length,19);for(const [lang,words]of Object.entries(l.LEGEND_HUB_TRANSLATIONS)){for(const [key,value]of Object.entries(words))assert.equal(r.LEGEND_HUB_TRANSLATIONS[lang][key],value);for(const key of ['moonDistance','moonDistanceUnit','moonMeter','moonFeet','moonClassicGold','moonKilometers','moonMiles'])assert(r.LEGEND_HUB_TRANSLATIONS[lang][key]);}
p='custom_components/gewitterradar/vault_schema.py';const schema=s=>s.replace(/^        "moonUi":.*\n/m,'');assert.equal(schema(read(p)),schema(old(p)),'other Vault schemas untouched');
p=path('weather/moon-legend.js');for(const [start,end]of [['function validate(','// One material'],['  if(zoom<MOON_MIN_ZOOM)','   const zone='],[' s.invalidate=()=>',' const resize=']]){const section=s=>s.slice(s.indexOf(start),s.indexOf(end,s.indexOf(start)));assert.equal(norm(section(read(p))),norm(section(old(p))),'unchanged astronomical validation/transport '+start);}
assert.equal(git('diff','--name-only',base,'--','frontend/assets').trim().split('\n').filter(p=>p&&!p.endsWith('gewitterradar-runtime-manifest.json')).length,0,'all existing images/textures byte-identical');
console.log('PASS targeted scope: unchanged unrelated module bodies/providers/assets; exact shared adapters and Eye CSS; reused 12 pinned 4.13.1 CI receipts (not rerun)');
