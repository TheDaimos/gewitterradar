import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const source=await readFile(resolve(root,'artifacts/v407/gewitterradar-v4.07.23.js'),'utf8');

const extractObject=(marker)=>{
  let start=source.indexOf(marker);
  if(start<0)throw new Error(`Missing marker: ${marker}`);
  start+=marker.length;
  while(/\s/.test(source[start]))start++;
  if(source.startsWith('Object.freeze(',start))start+='Object.freeze('.length;
  while(/\s/.test(source[start]))start++;
  if(source[start]!=='{')throw new Error(`Object start missing for ${marker}`);
  let depth=0,quote='',escaped=false;
  for(let i=start;i<source.length;i++){
    const ch=source[i];
    if(quote){
      if(escaped){escaped=false;continue;}
      if(ch==='\\'){escaped=true;continue;}
      if(ch===quote)quote='';
      continue;
    }
    if(ch==='"'||ch==="'"||ch==='`'){quote=ch;continue;}
    if(ch==='{')depth++;
    else if(ch==='}'&&--depth===0)return source.slice(start,i+1);
  }
  throw new Error(`Unterminated object for ${marker}`);
};

const HELP_STRINGS=Function(`return (${extractObject('const HELP_STRINGS =')});`)();
const V407_HELP_COPY=JSON.parse(extractObject('const V407_HELP_COPY ='));
const sections=(language)=>Object.fromEntries(HELP_STRINGS[language].sections.map(section=>[section.key,section]));
const de=sections('Deutsch'),en=sections('English');

if(!source.includes("const CARD_DISPLAY_VERSION = '4.07.23';")||!source.includes('V4.07-TEST23-2026-09-14'))throw new Error('TEST23 version/build marker missing');
if(de.location.title!=='Standort & gespeicherte Orte')throw new Error('German location Help heading mismatch');
if(de.external_services.title!=='Externe Dienste & Netzwerkzugriffe')throw new Error('German network Help heading mismatch');
if(de.location.paragraphs.length!==4||de.location.notes.length!==1)throw new Error('German location Help schema changed unexpectedly');
if(JSON.stringify(de.location).includes('500 km')||JSON.stringify(de.location).includes('120 min')||JSON.stringify(de.location).includes('200 Blitze'))throw new Error('Example values still live in German location Help');
if(!de.location.paragraphs.some(text=>text.includes('Ortsbibliothek liegt lokal in Home Assistant')&&text.includes('Name und Koordinaten')))throw new Error('German local place-library explanation missing');
if(!de.radii.notes[0].includes('Empfohlene Grundeinstellungen')||!de.radii.notes[0].includes('Blitzortung-App'))throw new Error('German radii cross-reference missing');
if(de.functions.entries.length!==6||de.functions.entries.at(-1)[0]!=='Kalibrierung & Diagnose')throw new Error('German calibration/diagnostics Help entry missing');
if(de.functions.entries.some(([term])=>term==='Gewittersimulation'))throw new Error('Storm simulation remains a standalone German Help function');
if(!de.functions.entries.at(-1)[1].includes('Kompass- und Medaillon-Kalibrierung')||!de.functions.entries.at(-1)[1].includes('Gewittersimulation'))throw new Error('German calibration/diagnostics scope incomplete');
if(de.defaults.items.length!==6)throw new Error('German recommended-defaults schema changed unexpectedly');
const deDefaults=de.defaults.items.join(' ');
for(const marker of ['500 km','120 Minuten','200 Blitze','keine zwingenden Vorgaben','Blitzortung-App','konfigurierten Standort','Tracker','Recorder-Ausschlüsse','Home-Assistant-Recorder'])if(!deDefaults.includes(marker))throw new Error(`German recommended defaults missing: ${marker}`);

if(en.location.title!=='Location & saved places')throw new Error('English location Help heading mismatch');
if(en.external_services.title!=='External services & network access')throw new Error('English network Help heading regressed');
if(en.location.paragraphs.length!==4||en.location.notes.length!==1)throw new Error('English location Help schema changed unexpectedly');
if(JSON.stringify(en.location).includes('500 km')||JSON.stringify(en.location).includes('120 minutes')||JSON.stringify(en.location).includes('200 lightnings'))throw new Error('Example values still live in English location Help');
if(!en.radii.notes[0].includes('Recommended defaults')||!en.radii.notes[0].includes('Blitzortung app'))throw new Error('English radii cross-reference missing');
if(en.functions.entries.length!==6||en.functions.entries.at(-1)[0]!=='Calibration & diagnostics')throw new Error('English calibration/diagnostics Help entry missing');
if(en.functions.entries.some(([term])=>term==='Storm simulation'))throw new Error('Storm simulation remains a standalone English Help function');
const enDefaults=en.defaults.items.join(' ');
for(const marker of ['500 km','120 minute','200 lightnings','not mandatory','Blitzortung app','tracker used by Gewitterradar','Recorder exclusions','Home Assistant Recorder'])if(!enDefaults.includes(marker))throw new Error(`English recommended defaults missing: ${marker}`);

for(const marker of ['help-radius-list','help-radius-item','help-radius-bullet',"['observation','storm','danger']",'conic-gradient(from 215deg','#6fb7e866','#d65a5066'])if(!source.includes(marker))throw new Error(`Premium radius bullet marker missing: ${marker}`);
if(source.includes("title:'Externe Dienste & Netzwerkfreigaben'"))throw new Error('Old German network heading still present');
if(source.includes("{key:'location',title:'Referenzstandort'"))throw new Error('Old German location heading still present');
if(!source.includes('max-height:clamp(132px,calc(100dvh - 440px),520px);'))throw new Error('TEST22 zoom-safe Settings scroll regressed');
if(!source.includes('radii:HELP_REFINED_ICONS_V6.radii'))throw new Error('Accepted premium radii header icon regressed');

const {HELP_EXTERNAL_LOCALES}=await import(pathToFileURL(resolve(root,'artifacts/v407/locales/about-locales.js')).href+'?test23');
const externalNames=['Dansk','Español','Français','Nederlands','Polski','Português','Svenska','Italiano','Norsk bokmål','Suomi','Čeština','Ελληνικά','Magyar','Boarisch','Plattdüütsch','Sächs’sch','Schwäbisch'];
const patch=(name,help)=>{
  const copy=V407_HELP_COPY[name];
  const location={key:'location',title:copy.lt,paragraphs:copy.lp,notes:[copy.ln.join(' ')]};
  const external={key:'external_services',title:copy.et,paragraphs:copy.ep,entries:copy.lab.map((label,index)=>[label,copy.d[index]]),notes:copy.en};
  const out=[];
  for(const section of help.sections||[]){if(section.key==='location'){out.push(location,external);continue;}if(section.key==='external_services')continue;out.push(section);}
  return {...help,sections:out};
};
const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const sameShape=(value,reference)=>{
  if(typeof reference==='string')return typeof value==='string'&&!!value.trim();
  if(typeof reference==='boolean')return value===reference;
  if(Array.isArray(reference))return Array.isArray(value)&&value.length===reference.length&&reference.every((item,index)=>sameShape(value[index],item));
  return object(reference)&&object(value)&&Object.keys(value).length===Object.keys(reference).length&&Object.keys(reference).every(key=>Object.hasOwn(value,key)&&sameShape(value[key],reference[key]));
};
for(const name of externalNames){if(!sameShape(patch(name,HELP_EXTERNAL_LOCALES[name]),HELP_STRINGS.Deutsch))throw new Error(`TEST23 external Help schema mismatch: ${name}`);}

console.log('V4.07.23 bundled Help content + premium radius bullet contract PASS');
console.log(`V4.07.23 Help schema remains valid for 19 runtime languages (2 native + ${externalNames.length} external).`);
