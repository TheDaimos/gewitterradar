import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const candidatePath=resolve(root,'artifacts/v407/gewitterradar-v4.07.19.js');
const localePath=resolve(root,'artifacts/v407/locales/about-locales.js');
const source=await readFile(candidatePath,'utf8');

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
const {HELP_EXTERNAL_LOCALES}=await import(pathToFileURL(localePath).href+'?test19');
const externalNames=['Dansk','Español','Français','Nederlands','Polski','Português','Svenska','Italiano','Norsk bokmål','Suomi','Čeština','Ελληνικά','Magyar','Boarisch','Plattdüütsch','Sächs’sch','Schwäbisch'];
if(JSON.stringify(Object.keys(HELP_EXTERNAL_LOCALES))!==JSON.stringify(externalNames))throw new Error('External Help locale registry is not the expected 17-language set');
if(JSON.stringify(Object.keys(V407_HELP_COPY))!==JSON.stringify(externalNames))throw new Error('V4.07 Help patch is not the expected 17-language set');

const patch=(name,help)=>{
  const copy=V407_HELP_COPY[name];
  const location={key:'location',title:copy.lt,paragraphs:copy.lp,notes:[copy.ln.join(' ')]};
  const external={key:'external_services',title:copy.et,paragraphs:copy.ep,entries:copy.lab.map((label,index)=>[label,copy.d[index]]),notes:copy.en};
  const sections=[];
  for(const section of help.sections||[]){
    if(section.key==='location'){sections.push(location,external);continue;}
    if(section.key==='external_services')continue;
    sections.push(section);
  }
  return {...help,sections};
};
const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const sameShape=(value,reference)=>{
  if(typeof reference==='string')return typeof value==='string'&&!!value.trim();
  if(typeof reference==='boolean')return value===reference;
  if(Array.isArray(reference))return Array.isArray(value)&&value.length===reference.length&&reference.every((item,index)=>sameShape(value[index],item));
  return object(reference)&&object(value)&&Object.keys(value).length===Object.keys(reference).length&&Object.keys(reference).every(key=>Object.hasOwn(value,key)&&sameShape(value[key],reference[key]));
};
for(const name of externalNames){
  const patched=patch(name,HELP_EXTERNAL_LOCALES[name]);
  if(!sameShape(patched,HELP_STRINGS.Deutsch))throw new Error(`Runtime Help schema mismatch: ${name}`);
  if(patched.sections.some((section,index)=>section.key!==HELP_STRINGS.Deutsch.sections[index].key))throw new Error(`Runtime Help section identity mismatch: ${name}`);
}
console.log(`V4.07.19 Help runtime locale contract PASS: 19 languages (2 native + ${externalNames.length} external)`);
