import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {buildV407Test29ExternalHelpLocales} from './v4-07-test29-build-external-help-locales.mjs';
import {buildV40731ExternalHelpLocales,replaceV40729RegistryWithV40731,v407Test31HelpI18nDelta} from './v4-07-test31-help-i18n-r2.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outDir=resolve(root,'artifacts/v407');
const source=await readFile(resolve(outDir,'gewitterradar-v4.07.31.js'),'utf8');
const input30=await readFile(resolve(outDir,'gewitterradar-v4.07.30.js'),'utf8');
const regenerated=v407Test31HelpI18nDelta(input30).replace(/\r\n?/g,'\n');
if(source!==regenerated)throw new Error('TEST31 main JS is not a deterministic delta from exact TEST30');
if(!source.includes("const CARD_DISPLAY_VERSION = '4.07.31';")||!source.includes("const GEWITTERRADAR_BUILD = 'V4.07-TEST31-2026-09-14';"))throw new Error('TEST31 version/build marker missing');
if(!source.includes('module.HELP_EXTERNAL_LOCALES_V40731')||source.includes('module.HELP_EXTERNAL_LOCALES_V40729'))throw new Error('TEST31 external Help registry loader is not exclusively V40731');

for(const fingerprint of [
  'Nutzen übernimmt den gewählten Ort sofort als Bezugsstandort, schließt die Ortssuche automatisch und fährt die Karte direkt zum neuen Standort.',
  'Use applies the selected place immediately, closes place search and moves the map directly to the new reference location.',
  "section.key==='location'&&entryIndex===2",
  "action.className='help-action-token help-action-use'",
  '.help-action-use{height:1.56em;min-height:1.56em;padding:0 .52em;border:1px solid #5d849c;border-radius:.29em;color:#e5edf2!important',
  '.help-process-highlight{display:inline-block;padding:1px 6px;border:1px solid rgba(225,190,110,.46)',
  "{key:'radii',title:'Die Radien',paragraphs:['Die Radien bauen aufeinander auf:",
  "if(section.key==='radii')ul.className='help-radius-list'",
  "li.dataset.radiusTone=['observation','storm','danger'][itemIndex]||''",
  '.help-radius-bullet'
])if(!source.includes(fingerprint))throw new Error(`Accepted TEST30 UI fingerprint missing: ${fingerprint}`);

const extractObject=(text,marker)=>{let start=text.indexOf(marker);if(start<0)throw new Error(`Missing marker: ${marker}`);start+=marker.length;while(/\s/.test(text[start]))start++;if(text.startsWith('Object.freeze(',start))start+='Object.freeze('.length;while(/\s/.test(text[start]))start++;if(text[start]!=='{')throw new Error(`Object start missing for ${marker}`);let depth=0,quote='',escaped=false;for(let i=start;i<text.length;i++){const ch=text[i];if(quote){if(escaped){escaped=false;continue;}if(ch==='\\'){escaped=true;continue;}if(ch===quote)quote='';continue;}if(ch==='"'||ch==="'"||ch==='`'){quote=ch;continue;}if(ch==='{')depth++;else if(ch==='}'&&--depth===0)return text.slice(start,i+1);}throw new Error(`Unterminated object for ${marker}`);};
const nativeHelp=Function(`return (${extractObject(source,'const HELP_STRINGS =')});`)();
if(JSON.stringify(Object.keys(nativeHelp))!==JSON.stringify(['Deutsch','English']))throw new Error('TEST31 requires exactly Deutsch and English as native Help locales');
const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const sameShape=(v,r)=>{if(typeof r==='string')return typeof v==='string'&&!!v.trim();if(typeof r==='boolean')return v===r;if(Array.isArray(r))return Array.isArray(v)&&v.length===r.length&&r.every((x,i)=>sameShape(v[i],x));return object(r)&&object(v)&&Object.keys(v).length===Object.keys(r).length&&Object.keys(r).every(k=>Object.hasOwn(v,k)&&sameShape(v[k],r[k]));};
if(!sameShape(nativeHelp.English,nativeHelp.Deutsch))throw new Error('Native English Help schema differs from Deutsch');
const stringify=value=>JSON.stringify(value);
const deText=stringify(nativeHelp.Deutsch), enText=stringify(nativeHelp.English);
for(const marker of ['Prerequisites','Reference location','Important functions','Recommended basic settings','Close help'])if(deText.includes(marker))throw new Error(`English fallback leaked into native Deutsch Help: ${marker}`);
for(const marker of ['Voraussetzungen','Referenzstandort','Wichtige Funktionen','Empfohlene Grundeinstellungen','Hilfe schließen'])if(enText.includes(marker))throw new Error(`German fallback leaked into native English Help: ${marker}`);

const flatten=(value,path='',out=[])=>{if(typeof value==='string'){out.push([path,value]);return out;}if(Array.isArray(value)){value.forEach((item,index)=>flatten(item,`${path}[${index}]`,out));return out;}if(value&&typeof value==='object')for(const [key,item] of Object.entries(value))flatten(item,path?`${path}.${key}`:key,out);return out;};
const deLeaves=new Map(flatten(nativeHelp.Deutsch));
for(const [path,text] of flatten(nativeHelp.English)){
  const german=deLeaves.get(path);
  if(typeof german!=='string'||text!==german||text.length<36)continue;
  if(/(?:device_tracker\.|person\.\*|zone\.\*|geo_location\.|sensor\.\*|recorder:|configuration\.yaml|https?:\/\/|\.org|\.com|\.pl|MQTT\/TCP|HTTPS\/TCP)/.test(text))continue;
  throw new Error(`Native DE/EN Help contains identical long prose at ${path}: ${text.slice(0,80)}`);
}

const localePath=resolve(outDir,'locales/about-locales.js');
const moduleText=await readFile(localePath,'utf8');
const imported=await import(pathToFileURL(localePath).href+'?v40731-test');
const help31=imported.HELP_EXTERNAL_LOCALES_V40731;
const names=['Dansk','Español','Français','Nederlands','Polski','Português','Svenska','Italiano','Norsk bokmål','Suomi','Čeština','Ελληνικά','Magyar','Boarisch','Plattdüütsch','Sächs’sch','Schwäbisch'];
if(JSON.stringify(Object.keys(help31||{}))!==JSON.stringify(names))throw new Error('TEST31 external Help registry is not the expected 17-language set');
if(Object.hasOwn(imported,'HELP_EXTERNAL_LOCALES_V40729'))throw new Error('TEST31 locale module still exports the superseded V40729 complete registry');
const keys=nativeHelp.Deutsch.sections.map(section=>section.key);
for(const name of names){
  const help=help31[name];
  if(!sameShape(help,nativeHelp.Deutsch))throw new Error(`TEST31 Help schema mismatch: ${name}`);
  if(JSON.stringify(help.sections.map(section=>section.key))!==JSON.stringify(keys))throw new Error(`TEST31 Help section order mismatch: ${name}`);
  const byKey=Object.fromEntries(help.sections.map(section=>[section.key,section]));
  if(byKey.location.entries.length!==5||byKey.external_services.entries.length!==8||byKey.external_services.notes.length!==5||byKey.functions.entries.length!==6||byKey.defaults.entries.length!==7||byKey.troubleshooting.entries.length!==6)throw new Error(`TEST31 complete Help rollout count mismatch: ${name}`);
  if(!byKey.location.entries[4][1].includes('×')||!byKey.location.entries[4][1].includes('↶')||!byKey.location.entries[4][1].includes('★'))throw new Error(`TEST31 saved-place semantics missing: ${name}`);
}
const germanSentinels=[
  'Gewitterradar verarbeitet die Blitzdaten',
  'Die Radien bauen aufeinander auf',
  'Der Referenzstandort bestimmt',
  'Für einen stabilen Start empfehlen wir',
  'Blitzdaten können sehr viele Zustandsänderungen erzeugen',
  'In Home Assistant darf nur EINE Gewitterradar-Modulressource aktiv sein',
  'Die folgenden Ziele sind der aktuelle V4.07-Laufzeitbestand'
];
for(const name of names){
  const text=stringify(help31[name]);
  for(const marker of germanSentinels)if(text.includes(marker))throw new Error(`Standard-German Help fallback remains in ${name}: ${marker}`);
}
const dialectMarkers={
  'Boarisch':/\b(?:ned|san|de|da|werdn|muaß|kenna|gspeichert|Suach|derf|bloß|sei|ham|hod|oda|ois)\b/g,
  'Plattdüütsch':/\b(?:nich|warrt|un|för|vun|Oort|Koort|spiekert|dörv|bloots|wesen|hebben|hett|as|bruukt)\b/g,
  'Sächs’sch':/\b(?:nich|un|dr|Ord|Standord|werdn|keene|derf|bloß|ham|odder|bidde)\b/g,
  'Schwäbisch':/\b(?:net|ond|dr|isch|send|gspeichert|Suach|derf|bloß|sei|hen|hot)\b/g,
};
for(const [name,pattern] of Object.entries(dialectMarkers)){
  const hits=stringify(help31[name]).match(pattern)?.length||0;
  if(hits<20)throw new Error(`TEST31 dialect localization signal too weak for ${name}: ${hits}`);
}

const test28Source=await readFile(resolve(outDir,'gewitterradar-v4.07.28.js'),'utf8');
const sourceLocalePath=resolve(root,'frontend/locales/about-locales.js');
const sourceLocaleText=await readFile(sourceLocalePath,'utf8');
const rebuilt29=await buildV407Test29ExternalHelpLocales(test28Source,sourceLocaleText,sourceLocalePath);
const rebuilt31=buildV40731ExternalHelpLocales(rebuilt29.result);
const expectedModule=replaceV40729RegistryWithV40731(rebuilt29.moduleText.replace(/\r\n?/g,'\n'),rebuilt31).replace(/\r\n?/g,'\n');
if(moduleText!==expectedModule)throw new Error('TEST31 locale module is not a deterministic transform of exact TEST29 locale output');

const mainBytes=Buffer.from(source,'utf8');
const localeBytes=Buffer.from(moduleText,'utf8');
console.log(`V4.07.31 complete Help i18n PASS: ${mainBytes.length} main bytes / ${createHash('sha256').update(mainBytes).digest('hex')}`);
console.log(`V4.07.31 locale module PASS: ${localeBytes.length} bytes / ${createHash('sha256').update(localeBytes).digest('hex')}`);
console.log('Coverage: 2 native locales audited + 17 external locales schema-checked; four dialects no longer inherit Standard-German Help prose.');
