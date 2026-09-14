import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const source=await readFile(resolve(root,'artifacts/v407/gewitterradar-v4.07.29.js'),'utf8');
const localePath=resolve(root,'artifacts/v407/locales/about-locales.js');
if(!source.includes("const CARD_DISPLAY_VERSION = '4.07.29';")||!source.includes("const GEWITTERRADAR_BUILD = 'V4.07-TEST29-2026-09-14';"))throw new Error('TEST29 version/build marker missing');
if(source.includes('V407_HELP_COPY')||source.includes('v407PatchExternalHelpLocales'))throw new Error('Bundled external Help copy still present in TEST29 main JS');
if(!source.includes('module.HELP_EXTERNAL_LOCALES_V40729'))throw new Error('TEST29 does not load the complete external Help registry');

const extractObject=(marker)=>{let start=source.indexOf(marker);if(start<0)throw new Error(`Missing marker: ${marker}`);start+=marker.length;while(/\s/.test(source[start]))start++;if(source.startsWith('Object.freeze(',start))start+='Object.freeze('.length;while(/\s/.test(source[start]))start++;if(source[start]!=='{')throw new Error(`Object start missing for ${marker}`);let depth=0,quote='',escaped=false;for(let i=start;i<source.length;i++){const ch=source[i];if(quote){if(escaped){escaped=false;continue;}if(ch==='\\'){escaped=true;continue;}if(ch===quote)quote='';continue;}if(ch==='"'||ch==="'"||ch==='`'){quote=ch;continue;}if(ch==='{')depth++;else if(ch==='}'&&--depth===0)return source.slice(start,i+1);}throw new Error(`Unterminated object for ${marker}`);};
const HELP_STRINGS=Function(`return (${extractObject('const HELP_STRINGS =')});`)();
if(JSON.stringify(Object.keys(HELP_STRINGS))!==JSON.stringify(['Deutsch','English']))throw new Error('Only Deutsch and English may remain native in HELP_STRINGS');
const {HELP_EXTERNAL_LOCALES,HELP_EXTERNAL_LOCALES_V40729}=await import(pathToFileURL(localePath).href+'?test29');
const names=['Dansk','Español','Français','Nederlands','Polski','Português','Svenska','Italiano','Norsk bokmål','Suomi','Čeština','Ελληνικά','Magyar','Boarisch','Plattdüütsch','Sächs’sch','Schwäbisch'];
if(JSON.stringify(Object.keys(HELP_EXTERNAL_LOCALES_V40729||{}))!==JSON.stringify(names))throw new Error('TEST29 complete external Help registry is not the expected 17-language set');
if(JSON.stringify(Object.keys(HELP_EXTERNAL_LOCALES||{}))!==JSON.stringify(names))throw new Error('Legacy external Help registry changed; historical candidate compatibility would be lost');
const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const sameShape=(v,r)=>{if(typeof r==='string')return typeof v==='string'&&!!v.trim();if(typeof r==='boolean')return v===r;if(Array.isArray(r))return Array.isArray(v)&&v.length===r.length&&r.every((x,i)=>sameShape(v[i],x));return object(r)&&object(v)&&Object.keys(v).length===Object.keys(r).length&&Object.keys(r).every(k=>Object.hasOwn(v,k)&&sameShape(v[k],r[k]));};
const master=HELP_STRINGS.Deutsch;
const keys=master.sections.map(s=>s.key);
if(JSON.stringify(keys)!==JSON.stringify(['prerequisites','radii','location','external_services','functions','defaults','troubleshooting','recorder']))throw new Error('Unexpected native TEST29 Help section order');
for(const name of names){
 const help=HELP_EXTERNAL_LOCALES_V40729[name];
 if(!sameShape(help,master))throw new Error(`External TEST29 Help schema mismatch: ${name}`);
 if(JSON.stringify(help.sections.map(s=>s.key))!==JSON.stringify(keys))throw new Error(`External TEST29 Help section order mismatch: ${name}`);
 const byKey=Object.fromEntries(help.sections.map(s=>[s.key,s]));
 if(byKey.location.entries.length!==5)throw new Error(`Location rollout incomplete: ${name}`);
 if(byKey.external_services.entries.length!==8||byKey.external_services.notes.length!==5)throw new Error(`External-services rollout incomplete: ${name}`);
 if(byKey.functions.entries.length!==6)throw new Error(`Function rollout incomplete: ${name}`);
 if(byKey.defaults.entries.length!==7)throw new Error(`Defaults rollout incomplete: ${name}`);
 if(byKey.troubleshooting.entries.length!==6)throw new Error(`Troubleshooting rollout incomplete: ${name}`);
 if(!byKey.location.entries[4][1].includes('×')||!byKey.location.entries[4][1].includes('↶')||!byKey.location.entries[4][1].includes('★'))throw new Error(`Saved-place action semantics missing: ${name}`);
 if(!byKey.defaults.entries[0][0].includes('500 km / 120 min / 200'))throw new Error(`Test-value heading missing: ${name}`);
 if(!byKey.recorder.recorder)throw new Error(`Recorder flag missing: ${name}`);
}
console.log('V4.07.29 external Help rollout PASS: 2 native + 17 external locales, complete eight-section schema.');
