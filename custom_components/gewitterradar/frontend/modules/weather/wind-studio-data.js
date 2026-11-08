import {SNAKE_DEFAULTS,SNAKE_LIMITS,normalizeSnakeConfig} from './snake-config.js?v=411162r1';
export const STUDIO_STORAGE='gewitterradar:wind-studio:v1',PRESET_FORMAT='gr-wind-animation-preset',PRESET_RENDERER='snake-flow',MAX_PRESET_BYTES=65536,MAX_USER_PROFILES=32;
const keys=Object.keys(SNAKE_LIMITS),meta=['format','schemaVersion','name','renderer'],plain=value=>value&&typeof value==='object'&&!Array.isArray(value)&&(Object.getPrototypeOf(value)===Object.prototype||Object.getPrototypeOf(value)===null);
const fail=message=>{throw Error(message);};
export function profileName(value){if(typeof value!=='string')fail('Ein Profilname als Text ist erforderlich.');const name=value.trim();if(!name||name.length>64||/[<>\x00-\x1f\x7f\u202a-\u202e\u2066-\u2069]/.test(value)||/^[=+\-@]/.test(name))fail('Profilname: 1–64 Zeichen, keine Steuerzeichen, HTML-Klammern oder Formelpräfixe.');return name;}
export function validateStudioParameters(input,{partial=false,base=SNAKE_DEFAULTS}={}){
 if(!plain(input))fail('Parameter müssen ein Objekt sein.');for(const key of Object.keys(input))if(!Object.hasOwn(SNAKE_LIMITS,key))fail('Unbekannter Parameter: '+key);
 if(!Object.keys(input).length)fail('Keine Parameter angegeben.');const result={...normalizeSnakeConfig(base)};
 for(const key of keys){if(!Object.hasOwn(input,key)){if(!partial)fail('Erforderlicher Parameter fehlt: '+key);continue;}const value=input[key],[min,max]=SNAKE_LIMITS[key];if(typeof value!=='number'||!Number.isFinite(value))fail('Ungültige Zahl für '+key);if(value<min||value>max)fail(key+': zulässig sind '+min+' bis '+max);result[key]=value;}
 if(result.minLength>result.maxLength)fail('Mindestlänge darf die Maximallänge nicht überschreiten.');return result;
}
function size(text){if(typeof text!=='string'||new TextEncoder().encode(text).length>MAX_PRESET_BYTES)fail('Datei/Text darf höchstens 64 KiB groß sein.');return text.replace(/^\ufeff/,'');}
export function preset(name,parameters){return {format:PRESET_FORMAT,schemaVersion:1,name:profileName(name),renderer:PRESET_RENDERER,parameters:validateStudioParameters(parameters)};}
export function exportPresetJSON(name,parameters){return JSON.stringify(preset(name,parameters),null,2)+'\n';}
const cell=value=>'"'+String(value).replaceAll('"','""')+'"';
export function exportPresetCSV(name,parameters){const p=preset(name,parameters);return '\ufeffparameter,value\r\n'+[...meta.map(k=>[k,p[k]]),...keys.map(k=>[k,p.parameters[k]])].map(row=>row.map(cell).join(',')).join('\r\n')+'\r\n';}
function csvRows(text){
 const rows=[];let row=[],value='',quoted=false,closed=false;
 for(let i=0;i<=text.length;i++){const ch=text[i]??'\n';if(quoted){if(ch==='"'){if(text[i+1]==='"'){value+='"';i++;}else{quoted=false;closed=true;}}else{if(i===text.length)fail('CSV: nicht geschlossenes Anführungszeichen.');value+=ch;}continue;}
  if(ch==='"'){if(value||closed)fail('CSV: ungültige Anführungszeichen.');quoted=true;continue;}if(ch===','||ch==='\n'||ch==='\r'){row.push(value);value='';closed=false;if(ch!==','){if(row.some(v=>v!==''))rows.push(row);row=[];if(ch==='\r'&&text[i+1]==='\n')i++;}continue;}if(closed)fail('CSV: Zeichen hinter geschlossenem Feld.');value+=ch;
 }if(rows.length>32)fail('CSV: zu viele Zeilen.');return rows;
}
export function importPreset(text,{format='json',partial=false,base=SNAKE_DEFAULTS,fallbackName='Importiertes Design'}={}){
 text=size(text);let object,parameters,name=fallbackName;
 if(format==='json'){try{object=JSON.parse(text);}catch(_){fail('JSON ist nicht lesbar.');}if(!plain(object)||Object.keys(object).some(k=>![...meta,'parameters'].includes(k)))fail('Ungültige JSON-Struktur.');for(const k of meta)if(!Object.hasOwn(object,k))fail('Metadaten fehlen: '+k);parameters=object.parameters;}
 else if(format==='csv'){
  const rows=csvRows(text);if(rows.shift()?.join(',')!=='parameter,value')fail('CSV-Kopf muss parameter,value lauten.');object={};parameters={};const seen=new Set();
  for(const row of rows){if(row.length!==2)fail('CSV: genau zwei Spalten erforderlich.');const key=row[0].trim(),value=row[1].trim();if(seen.has(key))fail('Doppelter Parameter: '+key);seen.add(key);if(meta.includes(key)){object[key]=key==='schemaVersion'?Number(value):value;continue;}if(!Object.hasOwn(SNAKE_LIMITS,key))fail('Unbekannter Parameter: '+key);if(!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/.test(value))fail('Ungültige Zahl für '+key);parameters[key]=Number(value);}
  if(Object.keys(object).length&&meta.some(k=>!Object.hasOwn(object,k)))fail('CSV-Metadaten sind unvollständig.');if(!Object.keys(object).length)object={format:PRESET_FORMAT,schemaVersion:1,name,renderer:PRESET_RENDERER};
 }else fail('Nicht unterstütztes Dateiformat.');
 if(object.format!==PRESET_FORMAT)fail('Unbekannte Formatkennung.');if(object.schemaVersion!==1)fail('Nicht unterstützte Schemaversion.');if(object.renderer!==PRESET_RENDERER)fail('Nur snake-flow-Profile werden unterstützt.');name=profileName(object.name);
 return {...preset(name,validateStudioParameters(parameters,{partial,base})),importedKeys:Object.keys(parameters)};
}
const builtin=(id,name,patch={})=>Object.freeze({id:'builtin:'+id,name,parameters:Object.freeze({...SNAKE_DEFAULTS,...patch}),builtin:true});
export const FACTORY_PROFILES=Object.freeze([builtin('default','Werkseinstellung'),builtin('subtle','Dezent',{maxLength:50,bodyWidth:1.6,density:.6}),builtin('rotation','Rotation',{maxLength:96,lengthScale:1.2,tailStart:.7,density:2,speed:1.1})]);
export class WindStudioModel{
 constructor(active,{storage=null}={}){
  this.storage=storage;this.users=[];this.draft=normalizeSnakeConfig(active);this.name='Aktuelles Design';this.selected=null;this.warning='';
  try{this.storage=storage??globalThis.localStorage;const saved=JSON.parse(this.storage.getItem(STUDIO_STORAGE)||'null');if(saved){if(saved.schemaVersion!==1||!Array.isArray(saved.users)||saved.users.length>MAX_USER_PROFILES)fail('Unbekannter Profilspeicher.');const ids=new Set();for(const p of saved.users){if(!plain(p)||typeof p.id!=='string'||!/^user:[a-z0-9-]{1,80}$/.test(p.id)||ids.has(p.id))fail('Ungültige Profilkennung.');ids.add(p.id);this.users.push({id:p.id,name:profileName(p.name),parameters:validateStudioParameters(p.parameters)});}if(saved.draft)this.draft=validateStudioParameters(saved.draft);if(saved.name)this.name=profileName(saved.name);if(this.profiles.some(p=>p.id===saved.selected))this.selected=saved.selected;}}
  catch(_){this.users=[];this.draft=normalizeSnakeConfig(active);this.name='Aktuelles Design';this.selected=null;this.warning='Gespeicherte Studiowerte sind nicht lesbar; die Karteneinstellungen bleiben erhalten.';}
 }
 get profiles(){return [...FACTORY_PROFILES,...this.users];}
 get profile(){return this.profiles.find(p=>p.id===this.selected)||null;}
 commit(patch){const next={users:this.users,draft:this.draft,name:this.name,selected:this.selected,...patch};next.name=profileName(next.name);try{this.storage.setItem(STUDIO_STORAGE,JSON.stringify({schemaVersion:1,...next}));}catch(_){fail('Studiowerte konnten nicht dauerhaft gespeichert werden.');}Object.assign(this,next);}
 setDraft(parameters){this.commit({draft:validateStudioParameters(parameters,{partial:true,base:this.draft})});}
 replaceDraft(parameters,name=this.name,{unselect=false}={}){this.commit({draft:validateStudioParameters(parameters),name:profileName(name),...(unselect?{selected:null}:{})});}
 create(name,parameters=this.draft){if(this.users.length>=MAX_USER_PROFILES)fail('Höchstens 32 eigene Profile sind möglich.');name=profileName(name);if(this.profiles.some(p=>p.name.toLocaleLowerCase()===name.toLocaleLowerCase()))fail('Dieser Profilname ist bereits vergeben.');const id='user:'+(globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));const p={id,name,parameters:validateStudioParameters(parameters)};this.commit({users:[...this.users,p],selected:id,name,draft:{...p.parameters}});return p;}
 select(id){if(id!==null&&!this.profiles.some(p=>p.id===id))fail('Profil nicht gefunden.');this.commit({selected:id});}
 load(){const p=this.profile;if(!p)fail('Bitte ein Profil auswählen.');this.replaceDraft(p.parameters,p.name);}
 writable(){const p=this.profile;if(!p||p.builtin)fail('Standardprofile sind geschützt. Bitte zuerst duplizieren.');return p;}
 save(){const p=this.writable();this.commit({users:this.users.map(v=>v.id===p.id?{...v,parameters:{...this.draft}}:v)});}
 rename(name){const p=this.writable();name=profileName(name);if(this.profiles.some(v=>v.id!==p.id&&v.name.toLocaleLowerCase()===name.toLocaleLowerCase()))fail('Dieser Profilname ist bereits vergeben.');this.commit({users:this.users.map(v=>v.id===p.id?{...v,name}:v),name});}
 duplicate(name){const p=this.profile;if(!p)fail('Bitte ein Profil auswählen.');return this.create(name,p.parameters);}
 remove(confirmed=false){const p=this.writable();if(!confirmed)fail('Löschen muss bestätigt werden.');this.commit({users:this.users.filter(v=>v.id!==p.id),selected:null});}
}
