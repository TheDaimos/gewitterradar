import {pathToFileURL} from 'node:url';

import {gunzipSync} from 'node:zlib';
import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const translationsB64=(await readFile(resolve(root,'scripts/v4-07-test29-help-translations.b64'),'utf8')).trim();
const X=JSON.parse(gunzipSync(Buffer.from(translationsB64,'base64')).toString('utf8'))
const STD=['Dansk','Español','Français','Nederlands','Polski','Português','Svenska','Italiano','Norsk bokmål','Suomi','Čeština','Ελληνικά','Magyar'];
const DIA=['Boarisch','Plattdüütsch','Sächs’sch','Schwäbisch'];
const DIALECT_TITLES={
  'Boarisch':['Voraussetzungen','De Radien','Standort & gspeicherte Ort','Externe Dienste & Netzwerkzugriff','Wichtige Funktionen','Empfohlene Grundeinstellungen','Wenn wos ned stimmt','Home-Assistant-Recorder'],
  'Plattdüütsch':['Vörutsetten','De Radien','Standort & spiekerte Öörd','Buten-Deensten & Nettwark-Togrepen','Wichtige Funktionen','Anraadt Grundinstellen','Wenn wat nich stimmt','Home-Assistant-Recorder'],
  'Sächs’sch':['Voraussetzungen','De Radien','Standord & gespeicherde Orde','Exderne Diensde & Netzwerkzugriffe','Wicht’sche Funktionen','Empfohlene Grundeinstellungen','Wenn was nich stimmt','Home-Assistant-Recorder'],
  'Schwäbisch':['Voraussetzungen','D’Radien','Standort & gspeicherte Ort','Externe Dienschd & Netzwerkzugriff','Wichtige Funktionen','Empfohlene Grundeinstellungen','Wenn ebbes net stimmt','Home-Assistant-Recorder'],
};

const extractObject=(source,marker)=>{
  let start=source.indexOf(marker); if(start<0)throw new Error(`Missing marker: ${marker}`); start+=marker.length;
  while(/\s/.test(source[start]))start++;
  if(source.startsWith('Object.freeze(',start))start+='Object.freeze('.length;
  while(/\s/.test(source[start]))start++;
  if(source[start]!=='{')throw new Error(`Object start missing for ${marker}`);
  let depth=0,quote='',escaped=false;
  for(let i=start;i<source.length;i++){const ch=source[i];if(quote){if(escaped){escaped=false;continue;}if(ch==='\\'){escaped=true;continue;}if(ch===quote)quote='';continue;}if(ch==='"'||ch==="'"||ch==='`'){quote=ch;continue;}if(ch==='{')depth++;else if(ch==='}'&&--depth===0)return source.slice(start,i+1);}
  throw new Error(`Unterminated object for ${marker}`);
};
const clone=value=>JSON.parse(JSON.stringify(value));
const splitSentences=text=>text.split('. ');

export async function buildV407Test29ExternalHelpLocales(test28Source,sourceLocaleText,sourceLocaleUrl){
  const patch=Function(`return (${extractObject(test28Source,'const V407_HELP_COPY =')});`)();
  const diagnosticUi=Function(`return (${extractObject(test28Source,'const DIAGNOSTIC_UI =')});`)();
  const nativeHelp=Function(`return (${extractObject(test28Source,'const HELP_STRINGS =')});`)();
  const imported=await import(pathToFileURL(sourceLocaleUrl).href+'?v40729-build='+Date.now());
  const old=imported.HELP_EXTERNAL_LOCALES;
  const master=nativeHelp.Deutsch;
  const extSection=name=>{const p=patch[name];return {key:'external_services',title:p.et,paragraphs:p.ep,entries:p.lab.map((label,index)=>[label,p.d[index]]),notes:p.en};};
  const standard=name=>{
    const o=old[name], byKey=Object.fromEntries(o.sections.map(section=>[section.key,section])), p=patch[name], x=X[name];
    if(!o||!p||!x)throw new Error('Missing TEST29 locale source: '+name);
    const lp0=splitSentences(p.lp[0]), lp3=splitSentences(p.lp[3]);
    let locationEntry=lp0.slice(1).join('. ').trim(); if(locationEntry&&!locationEntry.endsWith('.'))locationEntry+='.';
    let useText=lp3[0].trim(); if(useText&&!useText.endsWith('.'))useText+='.';
    let setupText=lp3[1].trim(); if(setupText&&!setupText.endsWith('.'))setupText+='.';
    const functions=byKey.functions.entries.slice(0,5).map(entry=>[...entry]);
    functions.push([diagnosticUi[name][0],x.caldesc]);
    const troubleshooting=byKey.troubleshooting.entries.map(entry=>[...entry]); troubleshooting.splice(2,0,x.backup);
    return {menuTitle:o.menuTitle,title:o.title,subtitle:o.subtitle,close:o.close,copy:o.copy,copied:o.copied,copyFailed:o.copyFailed,sections:[
      clone(byKey.prerequisites),
      {...clone(byKey.radii),notes:[x.rnote]},
      {key:'location',title:x.lt,paragraphs:[x.lpara],entries:[[x.lh[0],locationEntry],[x.lh[1],p.lp[1]],[x.lh[2],useText],[x.lh[3],setupText],[x.lh[4],x.save]],notes:[p.ln[0]+' '+p.ln[1]]},
      extSection(name),
      {key:'functions',title:byKey.functions.title,entries:functions},
      {key:'defaults',title:byKey.defaults.title,paragraphs:clone(byKey.defaults.paragraphs),entries:x.dh.map((heading,index)=>[heading,x.dt[index]])},
      {key:'troubleshooting',title:byKey.troubleshooting.title,entries:troubleshooting},
      clone(byKey.recorder),
    ]};
  };
  const dialect=name=>{
    const base=clone(master), o=old[name];
    Object.assign(base,{menuTitle:o.menuTitle,title:o.title,subtitle:o.subtitle,close:o.close,copy:o.copy,copied:o.copied,copyFailed:o.copyFailed});
    base.sections.forEach((section,index)=>{section.title=DIALECT_TITLES[name][index];});
    base.sections[3]=extSection(name); base.sections[3].title=DIALECT_TITLES[name][3];
    base.sections[4].entries.at(-1)[0]=diagnosticUi[name][0];
    return base;
  };
  const result=Object.fromEntries([...STD.map(name=>[name,standard(name)]),...DIA.map(name=>[name,dialect(name)])]);
  const names=[...STD,...DIA];
  if(JSON.stringify(Object.keys(result))!==JSON.stringify(names))throw new Error('TEST29 external locale order changed');
  const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
  const sameShape=(value,reference)=>{if(typeof reference==='string')return typeof value==='string'&&!!value.trim();if(typeof reference==='boolean')return value===reference;if(Array.isArray(reference))return Array.isArray(value)&&value.length===reference.length&&reference.every((item,index)=>sameShape(value[index],item));return object(reference)&&object(value)&&Object.keys(value).length===Object.keys(reference).length&&Object.keys(reference).every(key=>Object.hasOwn(value,key)&&sameShape(value[key],reference[key]));};
  for(const [name,help] of Object.entries(result)){if(!sameShape(help,master))throw new Error('TEST29 Help shape mismatch: '+name);if(help.sections.some((section,index)=>section.key!==master.sections[index].key))throw new Error('TEST29 Help section order mismatch: '+name);}
  const moduleText=sourceLocaleText.replace(/\s*$/,'\n\n')+'// V4.07.29: approved V4.07.28 Help content fully rolled out to all 17 external locales.\nexport const HELP_EXTERNAL_LOCALES_V40729 = '+JSON.stringify(result,null,2)+';\n';
  return {moduleText,result};
}
