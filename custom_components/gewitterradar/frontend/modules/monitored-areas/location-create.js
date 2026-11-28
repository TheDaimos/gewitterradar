/** MA-023: explicit manual SQLite location create, no implicit tracker creation. */
import {parseCoordinates} from './location-port.js';
const node=(tag,value='')=>{const el=document.createElement(tag);el.textContent=String(value);return el;};
const button=(text,handler)=>{const el=node('button',text);el.type='button';el.addEventListener('click',handler);return el;};
export function candidateMatches(places,candidate,epsilon=0.00001){
  return places.filter(p=>Number.isFinite(p.latitude)&&Number.isFinite(p.longitude)&&
    Math.abs(p.latitude-candidate.latitude)<=epsilon&&Math.abs(p.longitude-candidate.longitude)<=epsilon);
}
export function validateManualLocation(name,coordinates){
  const clean=typeof name==='string'?name.trim():'';
  if(!clean||clean.length>120)throw new TypeError('MA_INVALID_NAME');
  return {name:clean,...parseCoordinates(coordinates)};
}
export function openLocationCreate(owner,{places=[],create,verifyContext,onCreated}={}){
  if(!owner?.shadow||typeof create!=='function'||typeof verifyContext!=='function')return null;
  owner.shadow.getElementById('gr-ma-location-create')?.remove();
  const de=/Deutsch|Boarisch|Platt|Sächs|Schwäb/i.test(owner._languageValue?.()||'Deutsch');
  const t=de?{title:'Neuer SQLite-Standort',back:'Zurück',name:'Standortname',coords:'Breitengrad, Längengrad',preview:'Vorschau prüfen',
    save:'Standort speichern',close:'Schließen',invalid:'Name oder Koordinaten ungültig',
    same:'Bestehende Einträge mit diesen Koordinaten',sameHint:'Mehrere physische Standorte am selben Ort sind zulässig; keine automatische Zusammenführung',
    ready:'Speichern erfordert eine ausdrückliche Bestätigung',confirm:'Diesen Standort dauerhaft in SQLite anlegen?',
    success:'Standort gespeichert',error:'Speichern fehlgeschlagen oder Profil gewechselt',
    warning:'Diese Aktion legt keinen HA-Tracker und keine Blitzortung-Verknüpfung an'}:{
    title:'New SQLite location',back:'Back',name:'Location name',coords:'Latitude, longitude',preview:'Check preview',
    save:'Save location',close:'Close',invalid:'Invalid name or coordinates',
    same:'Existing entries at these coordinates',sameHint:'Multiple physical locations may share coordinates; never merged automatically',
    ready:'Saving requires explicit confirmation',confirm:'Create this location in SQLite?',
    success:'Location saved',error:'Saving failed or profile changed',
    warning:'This action does not create an HA tracker or Blitzortung binding'};
  const root=node('div');root.id='gr-ma-location-create';
  const style=node('style');style.textContent=`#gr-ma-location-create{position:fixed;inset:0;z-index:2147483609;background:#02070be0;display:grid;place-items:center;padding:12px;box-sizing:border-box}
#gr-ma-location-create .panel{width:min(510px,100%);max-height:calc(100dvh - 24px);overflow:hidden;display:flex;flex-direction:column;border:2px solid #d5b16b;border-radius:18px;background:linear-gradient(170deg,#26394a,#0a1823);color:#f6e8cd;padding:16px;box-sizing:border-box;font:14px/1.5 system-ui}
#gr-ma-location-create header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #a88958;padding-bottom:10px;flex:none}
#gr-ma-location-create header strong{font:23px Georgia,serif;color:#ffe1a0}
#gr-ma-location-create .close-premium{width:44px;min-width:44px;border:0!important;background:transparent!important;padding:0!important;display:grid;place-items:center}#gr-ma-location-create .close-premium img{width:34px;height:34px;object-fit:contain;pointer-events:none}
\n#gr-ma-location-overview .ma-back,#gr-ma-location-create .ma-back{appearance:none!important;background:transparent!important;border:0!important;box-shadow:none!important;display:inline-flex;align-items:center;gap:14px;padding:5px 13px;min-height:44px;color:#eed08a;font:700 14px system-ui;cursor:pointer;align-self:flex-start}\n#gr-ma-location-overview .ma-back span:first-child,#gr-ma-location-create .ma-back span:first-child{width:11px;height:11px;display:inline-block;border-left:3px solid #e6b961;border-bottom:3px solid #e6b961;transform:rotate(45deg);filter:drop-shadow(0 0 3px #d8a74a44)}\n#gr-ma-location-overview .ma-back:focus-visible,#gr-ma-location-create .ma-back:focus-visible{outline:2px solid #ffe4a0;outline-offset:2px}\n#gr-ma-location-create .body{min-height:0;overflow:auto;display:grid;gap:12px;padding-top:10px}
#gr-ma-location-create label{display:grid;gap:4px}#gr-ma-location-create input,#gr-ma-location-create button{font:inherit;min-height:44px;background:#122b3b;color:#ffe6bb;border:1px solid #b39156;border-radius:9px;padding:9px;box-sizing:border-box}
#gr-ma-location-create .actions{display:flex;gap:8px;flex-wrap:wrap}#gr-ma-location-create p{margin:4px 0;overflow-wrap:anywhere}#gr-ma-location-create button:disabled{opacity:.45}
`;
  const panel=node('section');panel.className='panel';panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label',t.title);
  const head=node('header'),title=node('strong',t.title),exit=button('',()=>root.remove());
  exit.setAttribute('aria-label',t.close);exit.className='close-premium';
  const closeIcon=node('img');closeIcon.src=owner.shadow.getElementById('settings-close')?.querySelector('img')?.src||new URL('../../assets/gewitterradar-about-close-premium.webp',import.meta.url).href;
  closeIcon.alt='';closeIcon.draggable=false;exit.append(closeIcon);head.append(title,exit);
  const back=button('',()=>root.remove());back.className='ma-back';back.setAttribute('aria-label',t.back);
  const chevron=node('span');chevron.setAttribute('aria-hidden','true');back.append(chevron,node('span',t.back));
  const body=node('div');body.className='body';
  const nameLabel=node('label',t.name),nameInput=node('input');nameInput.type='text';nameInput.maxLength=120;
  nameLabel.append(nameInput);
  const coordsLabel=node('label',t.coords),coordsInput=node('input');coordsInput.type='text';coordsInput.placeholder='53.5500, 10.0000';coordsInput.maxLength=100;
  coordsLabel.append(coordsInput);
  const preview=node('div');preview.setAttribute('role','status');
  const actions=node('div');actions.className='actions';
  let candidate=null;
  const saveButton=button(t.save,async()=>{
    if(!verifyContext()||!candidate)return;
    let now;try{now=validateManualLocation(nameInput.value,coordsInput.value);}catch{return;}
    if(JSON.stringify(now)!==JSON.stringify(candidate)){candidate=null;saveButton.disabled=true;return;}
    if(!window.confirm(t.confirm))return;
    saveButton.disabled=true;checkButton.disabled=true;
    try{
      await create(candidate);
      if(!root.isConnected||!verifyContext())return;
      root.remove();await onCreated?.();
    }catch{preview.textContent=t.error;}
    finally{if(root.isConnected){checkButton.disabled=false;saveButton.disabled=true;candidate=null;}}
  });saveButton.disabled=true;
  const checkButton=button(t.preview,()=>{
    candidate=null;saveButton.disabled=true;preview.replaceChildren();
    if(!verifyContext()){preview.append(node('p',t.error));return;}
    try{
      candidate=validateManualLocation(nameInput.value,coordsInput.value);
      preview.append(node('p',candidate.name+' · '+candidate.latitude.toFixed(6)+', '+candidate.longitude.toFixed(6)));
      const overlap=candidateMatches(places,candidate);
      if(overlap.length){
        preview.append(node('p',t.same+': '+overlap.map(p=>p.name||p.summary||'').join(', ')));
        preview.append(node('p',t.sameHint));
      }
      preview.append(node('p',t.ready),node('p',t.warning));saveButton.disabled=false;
    }catch{preview.append(node('p',t.invalid));}
  });
  const reset=()=>{candidate=null;saveButton.disabled=true;preview.replaceChildren();};
  nameInput.addEventListener('input',reset);coordsInput.addEventListener('input',reset);
  actions.append(checkButton,saveButton);
  body.append(nameLabel,coordsLabel,actions,preview);
  panel.append(head,back,body);root.append(style,panel);
  const fullscreen=owner.shadow.getElementById('map-fullscreen-dialog');
  (fullscreen?.open?fullscreen:owner.shadow).append(root);
  root.addEventListener('click',e=>{if(e.target===root)root.remove();});
  root.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();root.remove();}});
  nameInput.focus({preventScroll:true});return root;
}
