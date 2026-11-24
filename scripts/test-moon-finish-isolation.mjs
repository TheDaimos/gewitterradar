import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {normaliseGeneratedModule as norm} from '../tests/with-settings-vault.mjs';
const baseline='617d40466a65097458047cc3fc0771d7d46465ca';
const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:40*1024*1024});
const old=p=>git('show',baseline+':'+p),now=p=>readFileSync(p,'utf8');
const modelLine="export const normalizeMoonUi=(v={})=>({phasesExpanded:v?.phasesExpanded!==false,scaleMode:v?.scaleMode==='manual'?'manual':'auto',scalePercent:Math.round(clamp(v?.scalePercent,50,125,100)/5)*5});\n";
let count=0;
for(const file of git('ls-tree','-r','--name-only',baseline,'frontend/modules').trim().split('\n')){
 if(file.endsWith('/moon-legend.js'))continue;
 let current=now(file);
 if(file.endsWith('/legend-hub-model.js')){assert.equal(current.split(modelLine).length,2);current=current.replace(modelLine,'');assert.equal(current.split('moonUi:normalizeMoonUi(v?.moonUi),').length,2);current=current.replace('moonUi:normalizeMoonUi(v?.moonUi),','');}
 assert.equal(norm(current),norm(old(file)),file+' protected functional body');count++;
}
const schemaLine='        "moonUi": fields({"phasesExpanded": BOOL, "scaleMode": choice("auto", "manual"), "scalePercent": choice(*range(50, 126, 5))}),\n';
const schema=now('custom_components/gewitterradar/vault_schema.py').replaceAll('\r\n','\n');assert.equal(schema.split(schemaLine).length,2);assert.equal(schema.replace(schemaLine,''),old('custom_components/gewitterradar/vault_schema.py').replaceAll('\r\n','\n'));
for(const file of git('ls-tree','-r','--name-only',baseline,'frontend/assets').trim().split('\n')){
 if(file.endsWith('gewitterradar-runtime-manifest.json'))continue;
 assert(readFileSync(file).equals(execFileSync('git',['show',baseline+':'+file],{maxBuffer:40*1024*1024})),file+' original image unchanged');
}
const moon=now('frontend/modules/weather/moon-legend.js'),oldMoon=old('frontend/modules/weather/moon-legend.js');
for(const [start,end] of [['function validate(', 'export const moonOpen'],['  if(zoom<MOON_MIN_ZOOM)','   const zone='],[' s.invalidate=()=>',' const resize=']]){
 const section=text=>text.slice(text.indexOf(start),text.indexOf(end,text.indexOf(start)));
 assert.equal(norm(section(moon)),norm(section(oldMoon)),'unchanged astronomy validation/request/lifecycle '+start);
}
assert.match(moon,/import SILVER_CHEVRON from '\.\.\/fullscreen\/compass-picker-chevron-right-silver\.js/);
console.log('PASS Moon finish isolation: '+count+' other module bodies, only three optional Moon Vault fields; original graphics and Moon transport/validation remain exact');
