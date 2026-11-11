import {settingsStorage} from '../core/settings-vault.js?v=411183r1';
import {EYE_HUB_KEY,normalizeEyeConfig,assignEyeSlot,resizeEyeSlots,visibleEyeSlots,eyeRingRadius,eyeBubbleLayout,eyeGlowExtent,eyeIconBox,eyeIconTarget,eyeStudioExtent,eyeBackdropDiameter} from './eye-hub-model.js?v=411181r1';
import {EyeNeonWow as EyeNeon} from './eye-neon-wow.js?v=411181r1';
import {createEyeRegistry,EYE_MASTERS} from './eye-hub-registry.js?v=411176r1';
import {EYE_HUB_CSS,eyeVisual,eyeBubble,EyeConfigurator,syncEyeVisual} from './eye-hub-view.js?v=411183r1';
export const eyeHubMethods={
 _eyeHubState(){
  if(this.__eyeHub)return this.__eyeHub;let input=null;try{input=JSON.parse(settingsStorage(this).getItem(EYE_HUB_KEY));}catch(_){}
  const registry=createEyeRegistry(this);return this.__eyeHub={registry,config:normalizeEyeConfig(input,[...registry.entries.keys()]),open:false,signature:null,frame:null,bubbleOptions:[],suspended:false};
 },
 _eyeHubStatuses(){const s=this._eyeHubState(),out={};for(const [id,entry] of s.registry.entries){try{out[id]=entry.status();}catch(_){out[id]={active:false,available:false,detail:''};}}return out;},
 _eyeHubPatch(patch){
  const s=this._eyeHubState(),grouped=s.config.grouped;s.config=normalizeEyeConfig({...s.config,...patch},[...s.registry.entries.keys()]);
  try{settingsStorage(this).setItem(EYE_HUB_KEY,JSON.stringify(s.config));}catch(_){}
  if(grouped!==s.config.grouped){this._weatherDisplayCancelEyeDrag();this._weatherDisplayCancelControlDrag();this._weatherWindCancelToggleDrag?.();this._weatherTemperatureCancelToggleDrag?.();this._weatherPrecipitationCancelDrag?.();this._eyeHubClose();}
  s.signature=null;this._eyeHubSync();
 },
 _eyeHubAssign(index,id){const s=this._eyeHubState();this._eyeHubPatch(assignEyeSlot(s.config,index,id,[...s.registry.entries.keys()]));},
 _eyeHubResize(delta){const s=this._eyeHubState(),result=resizeEyeSlots(s.config,delta,[...s.registry.entries.keys()]);if(result.blocked)return s.view?.message(this._t('eye.blocked',{slot:result.blocked}));this._eyeHubPatch(result.config);},
 _eyeHubReset(){this._eyeHubPatch(normalizeEyeConfig(null,[...this._eyeHubState().registry.entries.keys()]));},
 _eyeHubToggle(){const s=this._eyeHubState();if(!s.config.grouped)return this._eyeHubOpen();s.open=!s.open;s.signature=null;this._eyeHubSync();},
 _eyeHubClose(){const s=this.__eyeHub;if(!s)return;for(const options of s.bubbleOptions)this._weatherDisplayCancelEyeDrag(options,{keepReleaseClick:!s.suspended&&!!options.state().eyeReleaseCleanup});s.bubbleOptions=[];s.open=false;s.signature=null;const root=this.shadow?.getElementById('eye-hub-bubbles');if(root){root.hidden=true;root.replaceChildren();}if(!s.suspended)this._eyeHubSync();},
 _eyeHubOpen(){const s=this._eyeHubState();this._eyeHubClose();const backdrop=this.shadow?.getElementById('settings-backdrop');if(backdrop?.classList.contains('open'))this.shadow.getElementById('settings-close')?.click();if(!s.view)s.view=new EyeConfigurator(this);s.view.open();},
 _eyeHubEnsureEye(card){
  const s=this._eyeHubState();s.suspended=false;
  if(!this.shadow.getElementById('eye-hub-style')){const style=document.createElement('style');style.id='eye-hub-style';style.textContent=EYE_HUB_CSS;this.shadow.append(style);}
  let eye=this.shadow.getElementById('weather-display-eye-control');if(!eye){eye=document.createElement('button');eye.type='button';eye.id='weather-display-eye-control';eye.className='weather-display-eye-control gr-eye-hub';eye.setAttribute('aria-controls','eye-hub-bubbles');eye.setAttribute('aria-label',this._t('eye.title'));card.append(eye);
   const options={element:eye,state:()=>this._weatherDisplayState(),activate:()=>this._eyeHubToggle(),longPress:()=>this._eyeHubOpen(),position:()=>this._eyeHubPosition(),save:p=>{if(this._weatherDisplayState().config.rememberPosition)this._weatherDisplayPatch({eyePosition:p});}};
   s.eyeOptions=options;this._weatherDisplayBindEyeDrag(eye,options);eye.addEventListener('pointermove',()=>{if(this._weatherDisplayState().eyeDrag?.moved&&s.open)this._eyeHubClose();});eye.addEventListener('keydown',e=>{if(e.key==='F2'||e.key==='ContextMenu'||e.shiftKey&&e.key==='F10'){e.preventDefault();this._eyeHubOpen();}});for(const type of ['mousedown','dblclick'])eye.addEventListener(type,e=>e.stopPropagation());
  }
  if(!this.shadow.getElementById('eye-hub-bubbles')){const root=document.createElement('div');root.id='eye-hub-bubbles';root.className='eye-hub-bubbles';root.hidden=true;root.setAttribute('role','group');root.setAttribute('aria-label',this._t('eye.title'));card.append(root);}
  const section=this.shadow.querySelector('#settings-map-section>.settings-section-content');if(section&&!this.shadow.getElementById('settings-eye-hub-open')){const row=document.createElement('div');row.className='settings-row';const button=document.createElement('button');button.id='settings-eye-hub-open';button.className='settings-control eye-metal-button';button.type='button';button.textContent=this._t('eye.title');button.addEventListener('click',e=>{e.stopPropagation();this._eyeHubOpen();});row.append(button);section.append(row);}
  if(!s.observer){
   const queue=()=>{if(s.suspended||s.frame!==null)return;s.frame=requestAnimationFrame(()=>{s.frame=null;this._eyeHubSync();});};
   s.observer=new MutationObserver(records=>{if(records.some(r=>{const n=r.target.nodeType===1?r.target:r.target.parentElement;return !n?.closest?.('#weather-display-eye-control,#eye-hub-bubbles');}))queue();});
   s.observer.observe(card,{subtree:true,childList:true,attributes:true,attributeFilter:['aria-pressed','hidden','data-status']});
   s.outside=e=>{const path=e.composedPath();if(s.open&&!path.includes(this.shadow.getElementById('weather-display-eye-control'))&&!path.includes(this.shadow.getElementById('eye-hub-bubbles')))this._eyeHubClose();};
   s.key=e=>{if(e.key==='Escape'&&s.open){e.stopPropagation();e.preventDefault();this._eyeHubClose();this.shadow.getElementById('weather-display-eye-control')?.focus();}};
   s.abort=()=>{this._eyeHubClose();s.view?.cancelDrag();if(document.hidden)s.view?.close();};
   document.addEventListener('pointerdown',s.outside,true);window.addEventListener('keydown',s.key,true);window.addEventListener('blur',s.abort);window.addEventListener('pagehide',s.abort);document.addEventListener('visibilitychange',s.abort);
  }
 },
 _eyeHubSync(){
  const s=this.__eyeHub;if(!s||s.suspended)return;const card=this.shadow?.getElementById('map-card'),eye=this.shadow?.getElementById('weather-display-eye-control');if(!card||!eye)return;
  if(s.view&&s.view.language!==this._languageValue?.()){const open=s.view.dialog.open;s.view.destroy();s.view=new EyeConfigurator(this);if(open)s.view.open();}
  const c=s.config,statuses=this._eyeHubStatuses(),entry=this.shadow.getElementById('settings-eye-hub-open');if(entry)entry.textContent=this._t('eye.title');
  card.dataset.eyeGrouped=String(c.grouped);
  // CSS controls presentation only; never overwrite the original hidden flags,
  // quickVisibility, per-view positions or meteorological settings.
  const assigned=new Set(visibleEyeSlots(c).map(v=>v.functionId));for(const [id,f] of s.registry.entries){const button=this.shadow.getElementById(f.button);if(button)button.classList.toggle('eye-hub-unassigned',!assigned.has(id));}
  eye.hidden=false;eye.setAttribute('aria-label',this._t('eye.title'));eye.setAttribute('aria-expanded',String(s.open));eye.title=this._t('eye.title')+' · '+this._t('eye.settings')+': 600 ms / F2';
  const signature=JSON.stringify([c,statuses,s.open,this._languageValue?.()]);
  if(signature!==s.signature){s.signature=signature;syncEyeVisual(eye,c,s.open,statuses);eye.style.setProperty('--eye-size',c.size+'px');eye.style.setProperty('--eye-target',Math.max(50,c.size)+'px');
   const root=this.shadow.getElementById('eye-hub-bubbles'),ids=visibleEyeSlots(c).filter(v=>v.functionId).map(v=>v.functionId);
   root.hidden=!c.grouped||!s.open;
   const rebuild=JSON.stringify([...root.querySelectorAll(':scope>.eye-hub-bubble')].map(b=>b.dataset.function))!==JSON.stringify(root.hidden?[]:ids);
   if(rebuild){for(const options of s.bubbleOptions)this._weatherDisplayCancelEyeDrag(options);s.bubbleOptions=[];root.replaceChildren();}
   if(!root.hidden){for(const id of ids){const f=s.registry.entries.get(id);if(!f)continue;const template=document.createElement('template');template.innerHTML=eyeBubble(f,statuses[id],c,k=>this._t('eye.'+k));const fresh=template.content.firstElementChild;let button=[...root.querySelectorAll(':scope>.eye-hub-bubble')].find(b=>b.dataset.function===id);
    if(button){for(const attr of ['data-active','data-available','aria-label','title','style'])if(button.getAttribute(attr)!==fresh.getAttribute(attr))button.setAttribute(attr,fresh.getAttribute(attr));const oldImage=button.querySelector('img'),nextImage=fresh.querySelector('img');if(oldImage.getAttribute('style')!==nextImage.getAttribute('style'))oldImage.setAttribute('style',nextImage.getAttribute('style'));const oldWarning=button.querySelector('.eye-warning'),warning=fresh.querySelector('.eye-warning');if(!warning)oldWarning?.remove();else if(!oldWarning)button.append(warning);continue;}
    button=fresh;root.append(button);
    const state={eyeDrag:null,eyeSuppressClickUntil:0},run=hold=>{this._eyeHubClose();(hold?f.hold:f.tap)();queueMicrotask(()=>this._eyeHubSync());};
    const options={element:button,state:()=>state,activate:()=>run(false),longPress:()=>run(true),position:()=>this._eyeHubPosition(),save:()=>{}};s.bubbleOptions.push(options);this._weatherDisplayBindEyeDrag(button,options);
   }}
   s.view?.update();
  }
  this._eyeHubSyncIcons();this._eyeHubPosition();this._eyeHubGlowSync();this._weatherQuickSync?.();
 },
 _eyeHubGlowSync(){
  const s=this.__eyeHub;if(!s||s.suspended)return;const items=[],eye=this.shadow?.getElementById('weather-display-eye-control');
  if(eye&&!s.open&&!s.view?.dialog.open)items.push({host:eye,config:s.config,statuses:this._eyeHubStatuses()});
  const view=s.view;if(view?.dialog.open&&!view.dialog.classList.contains('minimized')){const host=view.dialog.querySelector('[data-preview=closed] .eye-visual');if(host)items.push({host,config:s.config,statuses:view.simulation||this._eyeHubStatuses()});}
  if(!s.neon)s.neon=new EyeNeon();s.neon.sync(items);
 },
 _eyeHubPosition(){
  const s=this.__eyeHub,eye=this.shadow?.getElementById('weather-display-eye-control'),card=this.shadow?.getElementById('map-card'),map=this.shadow?.getElementById('map');if(!s||!eye||!card||!map)return;
  const m=map.getBoundingClientRect(),cr=card.getBoundingClientRect(),width=eye.offsetWidth||50;if(!m.width||!m.height)return;
  if(!this._weatherDisplayState().eyeDrag){const c=s.config,p=this._weatherDisplayState().config.rememberPosition?this._weatherDisplayState().config.eyePosition:{x:0,y:1},extent=Math.max(width/2,c.size*.725,((c.grouped&&(c.neonBloom||c.eyeAuraGap||c.auraRingGap))||c.backdropExtent)?Math.min(c.grouped?eyeStudioExtent(c):eyeBackdropDiameter(c)/2,Math.min(m.width,m.height)/2-10):(c.grouped?eyeGlowExtent(c):0)),pad=10;
   const left=m.left-cr.left+pad+(Math.max(0,m.width-width-pad*2))*p.x,top=m.top-cr.top+pad+Math.max(0,m.height-width-pad*2)*p.y;
   eye.style.left=Math.max(m.left-cr.left+extent+pad-width/2,Math.min(m.right-cr.left-extent-pad-width/2,left))+'px';eye.style.top=Math.max(m.top-cr.top+extent+pad-width/2,Math.min(m.bottom-cr.top-extent-pad-width/2,top))+'px';eye.style.bottom='auto';
  }
  const root=this.shadow.getElementById('eye-hub-bubbles');if(!root||root.hidden)return;const r=eye.getBoundingClientRect(),obstacles=[...card.querySelectorAll('.leaflet-control,#map-location-overlay,#compass-instrument,.map-instrument,#map-medallion-overlay,#map-compass-overlay,.medallion-instrument')].map(n=>n.getBoundingClientRect()).filter(r=>r.width&&r.height);
  const buttons=[...root.querySelectorAll(':scope>.eye-hub-bubble')],target=eyeIconTarget(s.config.iconSize),points=eyeBubbleLayout(buttons.length,{x:r.left+r.width/2,y:r.top+r.height/2},m,obstacles,s.config.size,s.config.iconSize),capacity=Math.max(1,points.length),pages=Math.ceil(buttons.length/capacity);s.bubblePages=pages;s.bubblePage=Math.min(s.bubblePage||0,pages-1);
  buttons.forEach((b,i)=>{const index=i-s.bubblePage*capacity,p=points[index];b.hidden=!p;if(p){b.style.left=p.x-cr.left-target/2+'px';b.style.top=p.y-cr.top-target/2+'px';}});
  let pager=root.querySelector('.eye-page-controls');if(pages>1){if(!pager){pager=document.createElement('div');pager.className='eye-page-controls';pager.innerHTML='<button type="button" data-eye-page="-1"></button><span></span><button type="button" data-eye-page="1"></button>';root.append(pager);pager.addEventListener('click',e=>{const b=e.target.closest('[data-eye-page]');if(!b)return;e.stopPropagation();s.bubblePage=(s.bubblePage+Number(b.dataset.eyePage)+s.bubblePages)%s.bubblePages;this._eyeHubPosition();});}
   const prev=pager.querySelector('[data-eye-page="-1"]'),next=pager.querySelector('[data-eye-page="1"]');prev.textContent='‹';next.textContent='›';prev.setAttribute('aria-label',this._t('eye.previous'));next.setAttribute('aria-label',this._t('eye.next'));pager.querySelector('span').textContent=(s.bubblePage+1)+' / '+pages;
  }else pager?.remove();

 },
 _eyeHubSyncIcons(){
  const s=this.__eyeHub;if(!s)return;const size=s.config.iconSize,target=eyeIconTarget(size),map=this.shadow?.getElementById('map'),card=this.shadow?.getElementById('map-card');if(!map||!card)return;
  const m=map.getBoundingClientRect(),cr=card.getBoundingClientRect(),buttons=[],seen=new Set();
  for(const [id,f] of s.registry.entries){const button=this.shadow.getElementById(f.button),img=button?.querySelector('img');if(!button||!img||seen.has(button))continue;seen.add(button);const box=eyeIconBox(id,size);
   for(const k of ['width','height','minWidth','minHeight'])if(button.style[k]!==target+'px')button.style[k]=target+'px';
   const sig=id+':'+size;if(img.dataset.eyeIconScale!==sig){img.style.cssText=`position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:${box}px!important;height:${box}px!important;max-width:none;pointer-events:none`;img.dataset.eyeIconScale=sig;}
   buttons.push({id,button});
  }
  if(s.config.grouped||!m.width)return;
  const d=this.__weatherDisplayState,w=this.__weatherWind,temp=this.__weatherTemperature;
  if(w?.quickDrag?.eyeDrag||temp?.quickDrag?.eyeDrag||d?.precipitationDrag?.eyeDrag||d?.displayControlDrag?.eyeDrag)return;
  const key=JSON.stringify([size,m.left,m.top,m.width,m.height,this._mapDisplayMode,this._mapWindowMode,w?.config.quickPositions,temp?.config.quickPositions,d?.config.precipitationControl,d?.config.displayControlPosition]);
  if(s.iconLayoutKey!==key){s.iconLayoutKey=key;s.iconPlacements=new Map();this._weatherWindPositionToggle?.();this._weatherTemperaturePositionToggle?.();this._weatherPrecipitationPositionToggle?.();this._weatherDisplayPositionControl?.();}
  const occupied=[],obstacles=[...card.querySelectorAll('.leaflet-control,#map-location-overlay,#compass-instrument,.map-instrument,#map-medallion-overlay,#map-compass-overlay,.medallion-instrument,#weather-display-eye-control')].map(n=>n.getBoundingClientRect()).filter(r=>r.width&&r.height),overlap=(p,r)=>p.x<r.right+5&&p.x+target>r.left-5&&p.y<r.bottom+5&&p.y+target>r.top-5;
  for(const {id,button} of buttons){if(button.hidden)continue;let p=s.iconPlacements.get(id);
   if(!p){const r=button.getBoundingClientRect(),layout=this._weatherWindToggleLayout?.(),saved=id==='wind'?w?.config.quickPositions?.[layout]:id==='temperature'?temp?.config.quickPositions?.[layout]:id==='precipitation'?this._weatherPrecipitationConfig().quickPositions?.[layout]:d?.config.displayControlPosition,preferred={x:Math.max(m.left+8,Math.min(m.right-target-8,saved?m.left+10+Math.max(0,m.width-target-20)*saved.x:r.left)),y:Math.max(m.top+8,Math.min(m.bottom-target-8,saved?m.top+10+Math.max(0,m.height-target-20)*saved.y:r.top))};p=preferred;
    if(size!==100&&(occupied.some(o=>overlap(p,o))||obstacles.some(o=>overlap(p,o)))){const candidates=[];for(let y=m.top+8;y<=m.bottom-target-8;y+=target+8)for(let x=m.left+8;x<=m.right-target-8;x+=target+8)candidates.push({x,y});candidates.sort((a,b)=>Math.hypot(a.x-preferred.x,a.y-preferred.y)-Math.hypot(b.x-preferred.x,b.y-preferred.y));p=candidates.find(p=>![...occupied,...obstacles].some(o=>overlap(p,o)))||candidates.find(p=>!occupied.some(o=>overlap(p,o)))||preferred;}
    s.iconPlacements.set(id,p);
   }
   for(const [k,v] of Object.entries({right:'auto',bottom:'auto',left:p.x-cr.left+'px',top:p.y-cr.top+'px'}))if(button.style[k]!==v)button.style[k]=v;occupied.push({left:p.x,top:p.y,right:p.x+target,bottom:p.y+target});
  }
 },
 _eyeHubLegacyEyeRect(){
  const card=this.shadow?.getElementById('map-card'),map=this.shadow?.getElementById('map');if(!card||!map)return null;const c=card.getBoundingClientRect(),m=map.getBoundingClientRect(),p=this._weatherDisplayState().config.eyePosition,width=matchMedia('(max-width:720px)').matches?46:44;
  const left=m.left+10+Math.max(0,m.width-width-20)*p.x,top=m.top+10+Math.max(0,m.height-width-20)*p.y;return {left,top,right:left+width,bottom:top+width,width,height:width};
 },
 _eyeHubSuspend(){const s=this.__eyeHub;if(!s)return;s.suspended=true;s.neon?.destroy();s.neon=null;this._eyeHubClose();if(s.frame!==null)cancelAnimationFrame(s.frame);s.frame=null;s.observer?.disconnect();s.observer=null;document.removeEventListener('pointerdown',s.outside,true);window.removeEventListener('keydown',s.key,true);window.removeEventListener('blur',s.abort);window.removeEventListener('pagehide',s.abort);document.removeEventListener('visibilitychange',s.abort);s.view?.destroy();s.view=null;}
};
