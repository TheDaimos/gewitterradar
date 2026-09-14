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

/* Accepted radius block is frozen for this review. */
if(!de.radii.notes[0].includes('Empfohlene Grundeinstellungen')||!de.radii.notes[0].includes('Blitzortung-App'))throw new Error('German radii cross-reference missing');
if(!en.radii.notes[0].includes('Recommended defaults')||!en.radii.notes[0].includes('Blitzortung app'))throw new Error('English radii cross-reference missing');
for(const marker of ['help-radius-list','help-radius-item','help-radius-bullet',"['observation','storm','danger']",'conic-gradient(from 215deg','#6fb7e866','#d65a5066'])if(!source.includes(marker))throw new Error(`Premium radius bullet marker missing: ${marker}`);
if(!source.includes('radii:HELP_REFINED_ICONS_V6.radii'))throw new Error('Accepted premium radii header icon regressed');

/* Location & saved places must be structured into scannable process steps. */
if(de.location.title!=='Standort & gespeicherte Orte')throw new Error('German location Help heading mismatch');
if(de.external_services.title!=='Externe Dienste & Netzwerkzugriffe')throw new Error('German network Help heading mismatch');
if(de.location.paragraphs.length!==1||de.location.entries.length!==5||de.location.notes.length!==1)throw new Error('German location Help structure mismatch');
for(const term of ['Standort','Blitzortung einrichten','Ort verwenden','Speicherliste einrichten','Gespeicherte Orte'])if(!de.location.entries.some(([entry])=>entry===term))throw new Error(`German location process heading missing: ${term}`);
if(JSON.stringify(de.location).includes('500 km')||JSON.stringify(de.location).includes('120 min')||JSON.stringify(de.location).includes('200 Blitze'))throw new Error('Example values still live in German location Help');
if(!de.location.paragraphs[0].includes('Ortsbibliothek liegt lokal in Home Assistant')||!de.location.paragraphs[0].includes('Name und Koordinaten'))throw new Error('German local place-library explanation missing');

if(en.location.title!=='Location & saved places')throw new Error('English location Help heading mismatch');
if(en.external_services.title!=='External services & network access')throw new Error('English network Help heading regressed');
if(en.location.paragraphs.length!==1||en.location.entries.length!==5||en.location.notes.length!==1)throw new Error('English location Help structure mismatch');
for(const term of ['Location','Set up Blitzortung','Use location','Set up saved-place list','Saved places'])if(!en.location.entries.some(([entry])=>entry===term))throw new Error(`English location process heading missing: ${term}`);

/* Calibration/diagnostics wording remains accepted. */
if(de.functions.entries.length!==6||de.functions.entries.at(-1)[0]!=='Kalibrierung & Diagnose')throw new Error('German calibration/diagnostics Help entry missing');
if(de.functions.entries.some(([term])=>term==='Gewittersimulation'))throw new Error('Storm simulation remains a standalone German Help function');
if(!de.functions.entries.at(-1)[1].includes('Kompass- und Medaillon-Kalibrierung')||!de.functions.entries.at(-1)[1].includes('Gewittersimulation'))throw new Error('German calibration/diagnostics scope incomplete');
if(en.functions.entries.length!==6||en.functions.entries.at(-1)[0]!=='Calibration & diagnostics')throw new Error('English calibration/diagnostics Help entry missing');

/* Recommended defaults: actual decisions are headings, Recorder is a dedicated high-priority entry. */
if(de.defaults.items)throw new Error('German recommended defaults must no longer be an undifferentiated bullet list');
if(de.defaults.entries.length!==7)throw new Error('German recommended defaults structure mismatch');
const deDefaultTerms=de.defaults.entries.map(([term])=>term);
for(const term of ['Testwerte · 500 km / 120 min / 200','Standort & Tracker abstimmen','Radien abstimmen','Aktiv lassen','Normalbetrieb','Recorder – unbedingt prüfen'])if(!deDefaultTerms.includes(term))throw new Error(`German recommended-default priority heading missing: ${term}`);
const deRecorder=de.defaults.entries.find(([term])=>term.startsWith('Recorder'))?.[1]||'';
for(const marker of ['Recorder-Ausschlüsse','Datenbank','Backups','sehr schnell anwachsen','Home-Assistant-Recorder'])if(!deRecorder.includes(marker))throw new Error(`German Recorder priority copy missing: ${marker}`);

if(en.defaults.items)throw new Error('English recommended defaults must no longer be an undifferentiated bullet list');
if(en.defaults.entries.length!==7)throw new Error('English recommended defaults structure mismatch');
const enRecorder=en.defaults.entries.find(([term])=>term.startsWith('Recorder'))?.[1]||'';
for(const marker of ['Recorder exclusions','database','backups','grow very quickly','Home Assistant Recorder'])if(!enRecorder.includes(marker))throw new Error(`English Recorder priority copy missing: ${marker}`);

/* Backup growth is now a first-class troubleshooting case. */
const deBackup=de.troubleshooting.entries.find(([term])=>term==='Backup wächst ungewöhnlich schnell')?.[1]||'';
for(const marker of ['Recorder-Ausschlüsse','Datenbank','Backups','Home-Assistant-Recorder'])if(!deBackup.includes(marker))throw new Error(`German backup troubleshooting missing: ${marker}`);
const enBackup=en.troubleshooting.entries.find(([term])=>term==='Backup grows unusually fast')?.[1]||'';
for(const marker of ['Recorder exclusions','database','backups','Home Assistant Recorder'])if(!enBackup.includes(marker))throw new Error(`English backup troubleshooting missing: ${marker}`);

/* Highlight priority and icon semantics. */
if(!source.includes("troubleshooting:HELP_PREMIUM_ICONS.sections.recorder,recorder:HELP_REFINED_ICONS_V5.troubleshooting"))throw new Error('Recorder/troubleshooting Help icon swap missing');
if(!source.includes("section.key==='defaults'&&/^Recorder\\b/i.test(String(term))"))throw new Error('Recorder priority renderer missing');
if(!source.includes('help-recorder-priority'))throw new Error('Recorder priority visual treatment missing');
const patternStart=source.indexOf('const helpNetworkTokenPattern='),patternEnd=source.indexOf(';',patternStart);
if(patternStart<0||patternEnd<0)throw new Error('Help network token pattern missing');
if(source.slice(patternStart,patternEnd).includes('Blitzortung(?:'))throw new Error('Blitzortung is still globally gold-highlighted');

/* Settings diagnostic accordion needs real bottom travel, not only a nominal max-height. */
if(!source.includes('max-height:clamp(132px,calc(100dvh - 440px),520px);'))throw new Error('TEST22 zoom-safe Settings scroll regressed');
if(!source.includes('#settings-diagnostic-section[open]>.settings-section-content{padding-bottom:72px!important;scroll-padding-bottom:72px}'))throw new Error('Diagnostic accordion bottom scroll clearance missing');

if(source.includes("title:'Externe Dienste & Netzwerkfreigaben'"))throw new Error('Old German network heading still present');
if(source.includes("{key:'location',title:'Referenzstandort'"))throw new Error('Old German location heading still present');

/* Architecture freeze: DE/EN stay native; the 17 other locales stay in the external module. */
if(!source.includes("Deutsch: {")||!source.includes("English: {")||!source.includes('ABOUT_EXTERNAL_LANGUAGE_NAMES'))throw new Error('Native/external locale architecture markers missing');
const {HELP_EXTERNAL_LOCALES}=await import(pathToFileURL(resolve(root,'artifacts/v407/locales/about-locales.js')).href+'?test23-review2');
const externalNames=['Dansk','Español','Français','Nederlands','Polski','Português','Svenska','Italiano','Norsk bokmål','Suomi','Čeština','Ελληνικά','Magyar','Boarisch','Plattdüütsch','Sächs’sch','Schwäbisch'];
const patch=(name,help)=>{
  const copy=V407_HELP_COPY[name];
  const location={key:'location',title:copy.lt,paragraphs:copy.lp,notes:[copy.ln.join(' ')]};
  const external={key:'external_services',title:copy.et,paragraphs:copy.ep,entries:copy.lab.map((label,index)=>[label,copy.d[index]]),notes:copy.en};
  const out=[];
  for(const section of help.sections||[]){if(section.key==='location'){out.push(location,external);continue;}if(section.key==='external_services')continue;out.push(section);}
  return {...help,sections:out};
};
for(const name of externalNames){
  const locale=HELP_EXTERNAL_LOCALES[name];
  if(!locale||!locale.sections)throw new Error(`External Help locale missing: ${name}`);
  const runtime=patch(name,locale);
  for(const key of ['prerequisites','radii','location','external_services','functions','defaults','troubleshooting','recorder'])if(!runtime.sections.some(section=>section.key===key))throw new Error(`External runtime Help section missing (${name}): ${key}`);
}

console.log('V4.07.23 Help review-2 contract PASS');
console.log('DE/EN review content updated; 17 external locales remain external and intentionally await global rollout.');
