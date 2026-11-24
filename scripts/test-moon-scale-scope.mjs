import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {normalizeMoonUi} from '../frontend/modules/weather/legend-hub-model.js';
import {LEGEND_HUB_TRANSLATIONS} from '../frontend/modules/weather/legend-hub-locales.js';
const base='656df5036b7110714cc15726044b0bc0ff227f03',git=(...a)=>execFileSync('git',a,{encoding:'utf8',maxBuffer:25*1024*1024});
const normalize=s=>s.replace(/\r\n/g,'\n').replace(/\d+r\d+/g,'REV').replace(/["']?version["']?\s*:\s*["'][0-9.]+["']/g,'version:"VERSION"');
const allowed=new Set(['moon-legend.js','legend-hub-model.js','legend-hub-view.js','legend-hub-locales.js']);
for(const p of git('ls-tree','-r','--name-only',base,'frontend/modules').trim().split('\n'))if(!allowed.has(p.split('/').at(-1)))assert.equal(normalize(readFileSync(p,'utf8')),normalize(git('show',base+':'+p)),p+' unchanged implementation');
const oldLocale=await import('data:text/javascript;base64,'+Buffer.from(git('show',base+':frontend/modules/weather/legend-hub-locales.js')).toString('base64'));
for(const [language,words] of Object.entries(oldLocale.LEGEND_HUB_TRANSLATIONS)){
 for(const [key,value] of Object.entries(words))assert.equal(LEGEND_HUB_TRANSLATIONS[language][key],value);
 for(const key of ['moonScaleIcon','moonScaleIcon_expand','moonScaleIcon_moon','moonScaleIcon_ruler'])assert(LEGEND_HUB_TRANSLATIONS[language][key]);
}
assert.equal(normalizeMoonUi().scaleIcon,'ruler');assert.equal(normalizeMoonUi().scaleMode,'auto');assert.equal(normalizeMoonUi({scaleIcon:'unknown'}).scaleIcon,'ruler');
for(const scaleIcon of ['expand','moon','ruler'])assert.equal(normalizeMoonUi({scaleIcon,scalePercent:130}).scaleIcon,scaleIcon);
assert.equal(normalizeMoonUi({scalePercent:130}).scalePercent,130);
const manifest=JSON.parse(readFileSync('docs/design/legend-hub/moon/manifest.json','utf8')),sha=b=>createHash('sha256').update(b).digest('hex');
for(const a of manifest.premium_scale_icons){
 for(const [key,checksum] of [['master_path','sha256'],['optimized_path','optimized_sha256']])assert.equal(sha(readFileSync('docs/design/legend-hub/moon/'+a[key])),a[checksum]);
 assert.deepEqual(readFileSync(a.runtime_path),readFileSync('docs/design/legend-hub/moon/'+a.optimized_path));
 assert.deepEqual(readFileSync('docs/design/legend-hub/moon/'+a.master_path),execFileSync('git',['show',base+':docs/design/legend-hub/moon/'+a.master_path],{maxBuffer:10*1024*1024}));
}
console.log('PASS focused scope: unrelated module implementations unchanged; old translations preserved in 19 locales; icon defaults/selection; original and runtime checksums');
