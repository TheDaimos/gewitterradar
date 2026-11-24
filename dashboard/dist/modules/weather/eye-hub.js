import {settingsStorage} from '../core/settings-vault.js?v=4133r1';
import {EYE_HUB_KEY,normalizeEyeConfig,assignEyeSlot,resizeEyeSlots,visibleEyeSlots,eyeBubbleLayout,eyePagerPosition,eyeIconBox,eyeIconTarget} from './eye-hub-model.js?v=4121r1';
import {EyeNeonWow as EyeNeon} from './eye-neon-wow.js?v=4121r1';
import {createEyeRegistry,eyeEntryEnabled,EYE_MASTERS} from './eye-hub-registry.js?v=411230r1';
import {EYE_HUB_CSS,eyeVisual,eyeBubble,EyeConfigurator,syncEyeVisual} from './eye-hub-view.js?v=4133r1';
import {stormLayout} from './storm-bubble.js?v=4133r1';

const eyeFixedControls='#map-display-control,#map-instrument-controls';
const quickControlObstacles = 'button,.leaflet-control,#map-location-overlay,[role=alert],#weather-legend-overlay,#weather-wind-legend-overlay';
const eyeIconObstacles = '.leaflet-control,#map-location-overlay,#compass-instrument,.map-instrument,#map-medallion-overlay,#map-compass-overlay,.medallion-instrument,#weather-display-eye-control';
const clampPosition = (value, min, max) => Math.max(min, Math.min(max, value));
const controlRect = (x, y, size) => ({left:x, top:y, right:x+size, bottom:y+size});
const overlaps = (a, b, gap) => a.left<b.right+gap && a.right>b.left-gap && a.top<b.bottom+gap && a.bottom>b.top-gap;

// Both drag and restored positions use local coordinates of the card's padding box.
function measureEyeLayout(eye,card,map){
 const m=map.getBoundingClientRect(),c=card.getBoundingClientRect(),r=eye.getBoundingClientRect();
 if(!m.width||!m.height||!r.width||!r.height||!card.offsetWidth||!card.offsetHeight)return null;
 const scaleX=c.width/card.offsetWidth,scaleY=c.height/card.offsetHeight;
 const originX=c.left+card.clientLeft*scaleX,originY=c.top+card.clientTop*scaleY;
 const width=r.width/scaleX,height=r.height/scaleY;
 const local=rect=>({left:(rect.left-originX)/scaleX,top:(rect.top-originY)/scaleY,
  right:(rect.right-originX)/scaleX,bottom:(rect.bottom-originY)/scaleY});
 const range=bounds=>({left:bounds.left,top:bounds.top,
  right:Math.max(bounds.left,bounds.right-width),bottom:Math.max(bounds.top,bounds.bottom-height)});
 const win=eye.ownerDocument.defaultView,vv=win.visualViewport,css=win.getComputedStyle(eye);
 const safe=side=>parseFloat(css.getPropertyValue('--eye-safe-'+side))||0;
 const vx=vv?.offsetLeft||0,vy=vv?.offsetTop||0;
 const viewport={left:Math.max(m.left,vx+safe('left')),top:Math.max(m.top,vy+safe('top')),
  right:Math.min(m.right,vx+(vv?.width??win.innerWidth)-safe('right')),
  bottom:Math.min(m.bottom,vy+(vv?.height??win.innerHeight)-safe('bottom'))};
 // When the page scrolls the entire control out of view, keep the anchor on the map.
 const fitX=viewport.right-viewport.left>=r.width,fitY=viewport.bottom-viewport.top>=r.height;
 const visible={left:fitX?viewport.left:m.left,top:fitY?viewport.top:m.top,
  right:fitX?viewport.right:m.right,bottom:fitY?viewport.bottom:m.bottom};
 const clip=local(visible);
 const fixed=[...card.querySelectorAll(eyeFixedControls)].map(node=>({node,left:node.offsetLeft,top:node.offsetTop,
  width:node.offsetWidth,height:node.offsetHeight}));
 return {originX,originY,scaleX,scaleY,width,height,clip,range:range(clip),storage:range(local(m)),fixed};
}

// The fixed map buttons yield only when the Eye would cover them. Read their
// unshifted layout coordinates once per drag and apply a compositor translation.
function clearEyeControls(fixed,clip,eye){
 const gap=5,placed=[];
 for(const control of fixed){
  const {node,left,top,width,height}=control;
  const rect={left,top,right:left+width,bottom:top+height};
  let move=null;
  if(width&&height&&overlaps(rect,eye,gap)){
   const shifts=[[0,eye.top-rect.bottom-gap],[eye.left-rect.right-gap,0],
    [eye.right-rect.left+gap,0],[0,eye.bottom-rect.top+gap]];
   const options=shifts.map(([x,y])=>({x,y,left:left+x,right:rect.right+x,top:top+y,bottom:rect.bottom+y}));
   move=options.sort((a,b)=>Math.abs(a.x+a.y)-Math.abs(b.x+b.y)).find(r=>
    r.left>=clip.left&&r.right<=clip.right&&r.top>=clip.top&&r.bottom<=clip.bottom&&
    !placed.some(o=>overlaps(r,o,gap))&&!fixed.some(o=>o!==control&&o.width&&o.height&&
     overlaps(r,{left:o.left,right:o.left+o.width,top:o.top,bottom:o.top+o.height},gap)));
  }
  const translate=move?`${move.x}px ${move.y}px`:'';
  if(node.style.translate!==translate)node.style.translate=translate;
  if(node.id==='map-display-control'){
   node.toggleAttribute('data-eye-clearance',Boolean(move));
   const room=move?Math.max(44,move.bottom-clip.top-60)+'px':'';
   if(node.style.getPropertyValue('--eye-menu-room')!==room)node.style.setProperty('--eye-menu-room',room);
  }
  if(width&&height)placed.push(move||rect);
 }
}

function placeEye(eye,layout,left,top,paintClip){
 const {clip,width,height,range}=layout;
 left=clampPosition(left,range.left,range.right);
 top=clampPosition(top,range.top,range.bottom);
 const right=left+width,bottom=top+height;
 Object.assign(paintClip,{left:clip.left-left-width/2,top:clip.top-top-height/2,
  right:clip.right-left-width/2,bottom:clip.bottom-top-height/2});
 clearEyeControls(layout.fixed,clip,{left,top,right,bottom});
 const position={left:left+'px',top:top+'px',bottom:'auto',
  clipPath:`inset(${clip.top-top}px ${right-clip.right}px ${bottom-clip.bottom}px ${clip.left-left}px)`};
 for(const [key,value] of Object.entries(position))if(eye.style[key]!==value)eye.style[key]=value;
}

function defaultQuickPosition(bounds, obstacles) {
 const {left, top, right, bottom} = bounds;
 for(let y=top;y<=bottom;y+=54)for(let x=left;x<=Math.min(right,left+216);x+=50){
  if(!obstacles.some(rect=>overlaps(controlRect(x,y,50),rect,3)))return {x,y};
 }
 return {x:left,y:top};
}

function defaultDisplayPosition(bounds, eye, size) {
 let left=bounds.left,top=bounds.bottom;
 if(eye){
  left=eye.left;top=eye.top-size-12;
  if(top<bounds.top){
   top=eye.top;left=eye.right+12;
   if(left>bounds.right)left=eye.left-size-12;
  }
 }
 return {x:clampPosition(left,bounds.left,bounds.right),y:clampPosition(top,bounds.top,bounds.bottom)};
}

function resolveIconCollision(preferred, bounds, target, occupied, obstacles) {
 const rect=controlRect(preferred.x,preferred.y,target);
 if(!occupied.some(o=>overlaps(rect,o,5))&&!obstacles.some(o=>overlaps(rect,o,5)))return preferred;
 const candidates=[];
 for(let y=bounds.top;y<=bounds.bottom;y+=target+8)for(let x=bounds.left;x<=bounds.right;x+=target+8)candidates.push({x,y});
 const distance=p=>Math.hypot(p.x-preferred.x,p.y-preferred.y);
 candidates.sort((a,b)=>distance(a)-distance(b));
 const free=candidates.filter(p=>!occupied.some(o=>overlaps(controlRect(p.x,p.y,target),o,5)));
 return free.find(p=>!obstacles.some(o=>overlaps(controlRect(p.x,p.y,target),o,5)))||free[0]||preferred;
}

export const eyeHubMethods={
 _eyeHubState(){
  if(this.__eyeHub)return this.__eyeHub;let input=null;try{input=JSON.parse(settingsStorage(this).getItem(EYE_HUB_KEY));}catch(_){}
  const registry=createEyeRegistry(this);return this.__eyeHub={registry,config:normalizeEyeConfig(input,[...registry.entries.keys()]),open:false,signature:null,frame:null,bubbleOptions:[],paintClip:{},suspended:false};
 },
 _eyeHubStatuses(){const s=this._eyeHubState(),out={};for(const [id,entry] of s.registry.entries){try{out[id]=entry.status();}catch(_){out[id]={active:false,available:false,detail:''};}}return out;},
 _eyeHubPatch(patch){
  const s=this._eyeHubState(),grouped=s.config.grouped;s.config=normalizeEyeConfig({...s.config,...patch},[...s.registry.entries.keys()]);
  try{settingsStorage(this).setItem(EYE_HUB_KEY,JSON.stringify(s.config));s.saveError=null;}catch(error){s.saveError=error;s.view?.message?.(this._t('eye.title')+': Einstellungen konnten nicht gespeichert werden ('+(error?.code||error?.message||'Settings Vault')+').');}
  if(grouped!==s.config.grouped){this._weatherDisplayCancelEyeDrag();this._weatherDisplayCancelControlDrag();this._weatherWindCancelToggleDrag?.();this._weatherTemperatureCancelToggleDrag?.();this._weatherDisplayCancelEyeDrag?.(this.__weatherSynoptic?.quickDragOptions);this._weatherPrecipitationCancelDrag?.();this._weatherCloudsCancelDrag?.();this._eyeHubClose();}
  s.signature=null;this._eyeHubSync();
 },
 _eyeHubSetBubbleAura(id,visible){
  const s=this._eyeHubState();
  if(eyeEntryEnabled(s.registry.entries.get(id)))this._eyeHubPatch({bubbleAura:{...s.config.bubbleAura,[id]:visible}});
 },
 _eyeHubAssign(index,id){const s=this._eyeHubState();if(eyeEntryEnabled(s.registry.entries.get(id)))this._eyeHubPatch(assignEyeSlot(s.config,index,id,[...s.registry.entries.keys()]));},
 _eyeHubResize(delta){const s=this._eyeHubState(),result=resizeEyeSlots(s.config,delta,[...s.registry.entries.keys()]);if(result.blocked)return s.view?.message(this._t('eye.blocked',{slot:result.blocked}));this._eyeHubPatch(result.config);},
 _eyeHubReset(){
  const {registry,config}=this._eyeHubState();
  this._eyeHubPatch({...normalizeEyeConfig(null,[...registry.entries.keys()]),stormVisible:config.stormVisible,stormPositions:config.stormPositions});
 },
 _eyeHubToggle(){if(!this.__proBranding?.eyeReady)return;const s=this._eyeHubState();if(!s.config.grouped)return this._eyeHubOpen();s.open=!s.open;s.signature=null;this._eyeHubSync();},
 _eyeHubClose(){const s=this.__eyeHub;if(!s)return;for(const options of s.bubbleOptions)this._weatherDisplayCancelEyeDrag(options,{keepReleaseClick:!s.suspended&&this._weatherControlRelease?.drag.state===options.state()});s.bubbleOptions=[];s.open=false;s.signature=null;const root=this.shadow?.getElementById('eye-hub-bubbles');if(root){root.hidden=true;root.replaceChildren();}if(!s.suspended)this._eyeHubSync();},
 _eyeHubOpen(){if(!this.__proBranding?.eyeReady)return;const s=this._eyeHubState();this._eyeHubClose();const backdrop=this.shadow?.getElementById('settings-backdrop');if(backdrop?.classList.contains('open'))this.shadow.getElementById('settings-close')?.click();if(!s.view)s.view=new EyeConfigurator(this);s.view.open();},
 _eyeHubEnsureEye(card){
  const s=this._eyeHubState();s.suspended=false;
  if(!this.shadow.getElementById('eye-hub-style')){const style=document.createElement('style');style.id='eye-hub-style';style.textContent=EYE_HUB_CSS;this.shadow.append(style);}
  let eye=this.shadow.getElementById('weather-display-eye-control');if(!eye){eye=document.createElement('button');eye.type='button';eye.id='weather-display-eye-control';eye.className='weather-display-eye-control gr-eye-hub';eye.hidden=true;eye.setAttribute('aria-controls','eye-hub-bubbles');eye.setAttribute('aria-label',this._t('eye.title'));card.append(eye);
   const options={element:eye,state:()=>this._weatherDisplayState(),activate:()=>this._eyeHubToggle(),longPress:()=>this._eyeHubOpen(),position:()=>this._eyeHubPosition(),save:p=>{if(this._weatherDisplayState().config.rememberPosition)this._weatherDisplayPatch({eyePosition:p});}};
   options.measure=()=>{const map=this.shadow.getElementById('map');return map&&measureEyeLayout(eye,card,map);};
   options.place=(layout,left,top)=>placeEye(eye,layout,left,top,s.paintClip);
   s.eyeOptions=options;this._weatherDisplayBindEyeDrag(eye,options);eye.addEventListener('pointermove',()=>{if(this._weatherDisplayState().eyeDrag?.moved&&s.open)this._eyeHubClose();});eye.addEventListener('keydown',e=>{if(e.key==='F2'||e.key==='ContextMenu'||e.shiftKey&&e.key==='F10'){e.preventDefault();this._eyeHubOpen();}});for(const type of ['mousedown','dblclick'])eye.addEventListener(type,e=>e.stopPropagation());
  }
  if(!this.shadow.getElementById('eye-hub-bubbles')){const root=document.createElement('div');root.id='eye-hub-bubbles';root.className='eye-hub-bubbles';root.hidden=true;root.setAttribute('role','group');root.setAttribute('aria-label',this._t('eye.title'));card.append(root);}
  const section=this.shadow.querySelector('#settings-map-section>.settings-section-content');if(section&&!this.shadow.getElementById('settings-eye-hub-open')){const row=document.createElement('div');row.className='settings-row';const button=document.createElement('button');button.id='settings-eye-hub-open';button.className='settings-control eye-metal-button';button.type='button';button.textContent=this._t('eye.title');button.addEventListener('click',e=>{e.stopPropagation();this._eyeHubOpen();});row.append(button);section.append(row);}
  if(!s.observer){
   const queue=()=>{if(s.suspended||s.frame!==null)return;s.frame=requestAnimationFrame(()=>{s.frame=null;this._eyeHubSync();});};
   s.observer=new MutationObserver(records=>{if(records.some(r=>{const n=r.target.nodeType===1?r.target:r.target.parentElement;return !n?.closest?.('#weather-display-eye-control,#eye-hub-bubbles');}))queue();});
   s.observer.observe(card,{subtree:true,childList:true,attributes:true,attributeFilter:['aria-pressed','hidden','data-status']});
   s.viewportChange=()=>{if(s.viewportFrame!=null)return;s.viewportFrame=requestAnimationFrame(()=>{s.viewportFrame=null;this._eyeHubPosition();});};
   s.resizeObserver=new ResizeObserver(s.viewportChange);
   const map=this.shadow.getElementById('map');
   if(map)s.resizeObserver.observe(map);
   window.addEventListener('scroll',s.viewportChange,{capture:true,passive:true});
   window.visualViewport?.addEventListener('scroll',s.viewportChange,{passive:true});
   s.outside=e=>{const path=e.composedPath();if(s.open&&!path.includes(this.shadow.getElementById('weather-display-eye-control'))&&!path.includes(this.shadow.getElementById('eye-hub-bubbles')))this._eyeHubClose();};
   s.key=e=>{if(e.key==='Escape'&&s.open){e.stopPropagation();e.preventDefault();this._eyeHubClose();this.shadow.getElementById('weather-display-eye-control')?.focus();}};
   s.abort=()=>{this._eyeHubClose();s.view?.cancelDrag();if(document.hidden)s.view?.close();};
   document.addEventListener('pointerdown',s.outside,true);window.addEventListener('keydown',s.key,true);window.addEventListener('blur',s.abort);window.addEventListener('pagehide',s.abort);document.addEventListener('visibilitychange',s.abort);
  }
 },
 _eyeHubSync(){
  const s=this.__eyeHub;if(!s||s.suspended)return;const card=this.shadow?.getElementById('map-card'),eye=this.shadow?.getElementById('weather-display-eye-control');if(!card||!eye)return;
  const available=this.__proBranding?.eyeReady===true;
  card.dataset.eyeProReady=String(available);
  eye.hidden=!available;
  const root=this.shadow.getElementById('eye-hub-bubbles'),entry=this.shadow.getElementById('settings-eye-hub-open');
  if(entry?.parentElement)entry.parentElement.hidden=!available;
  if(!available){
   if(s.open)this._eyeHubClose();
   if(root)root.hidden=true;
   if(s.view?.dialog.open)s.view.close();
   s.neon?.sync([]);
   return;
  }
  this._weatherStormSync?.(card,s);
  if(s.view&&s.view.language!==this._languageValue?.()){const open=s.view.dialog.open;s.view.destroy();s.view=new EyeConfigurator(this);if(open)s.view.open();}
  const c=s.config,statuses=this._eyeHubStatuses();if(entry)entry.textContent=this._t('eye.title');
  card.dataset.eyeGrouped=String(c.grouped);
  // CSS controls presentation only; never overwrite the original hidden flags,
  // quickVisibility, per-view positions or meteorological settings.
  const assigned=new Set(visibleEyeSlots(c).map(v=>v.functionId));for(const [id,f] of s.registry.entries){const button=this.shadow.getElementById(f.button);if(button)button.classList.toggle('eye-hub-unassigned',!assigned.has(id));}
  eye.hidden=false;eye.setAttribute('aria-label',this._t('eye.title'));eye.setAttribute('aria-expanded',String(s.open));eye.title=this._t('eye.title')+' · '+this._t('eye.settings')+': 600 ms / F2';
  const signature=JSON.stringify([c,statuses,s.open,this._languageValue?.()]);
  if(signature!==s.signature){s.signature=signature;syncEyeVisual(eye,c,s.open,statuses);eye.style.setProperty('--eye-size',c.size+'px');eye.style.setProperty('--eye-target',Math.max(50,c.size)+'px');
   const root=this.shadow.getElementById('eye-hub-bubbles'),ids=visibleEyeSlots(c).map(v=>v.functionId).filter(id=>eyeEntryEnabled(s.registry.entries.get(id)));
   root.hidden=!c.grouped||!s.open;
   const rebuild=JSON.stringify([...root.querySelectorAll(':scope>.eye-hub-bubble')].map(b=>b.dataset.function))!==JSON.stringify(root.hidden?[]:ids);
   if(rebuild){
    const keep=new Set(root.hidden?[]:ids);
    s.bubbleOptions=s.bubbleOptions.filter(options=>{if(keep.has(options.element.dataset.function))return true;this._weatherDisplayCancelEyeDrag(options);options.element.remove();return false;});
   }
   if(!root.hidden){for(const id of ids){const f=s.registry.entries.get(id);if(!f)continue;const template=document.createElement('template');template.innerHTML=eyeBubble(f,statuses[id],c,k=>this._t('eye.'+k));const fresh=template.content.firstElementChild;let button=[...root.querySelectorAll(':scope>.eye-hub-bubble')].find(b=>b.dataset.function===id);
    if(button){for(const attr of ['data-active','data-available','aria-pressed','aria-label','title']){const value=fresh.getAttribute(attr);if(value!==null&&button.getAttribute(attr)!==value)button.setAttribute(attr,value);}for(const property of fresh.style)if(button.style.getPropertyValue(property)!==fresh.style.getPropertyValue(property))button.style.setProperty(property,fresh.style.getPropertyValue(property));const oldImage=button.querySelector('img'),nextImage=fresh.querySelector('img');if(oldImage.getAttribute('style')!==nextImage.getAttribute('style'))oldImage.setAttribute('style',nextImage.getAttribute('style'));const oldWarning=button.querySelector('.eye-warning'),warning=fresh.querySelector('.eye-warning');if(!warning)oldWarning?.remove();else if(!oldWarning)button.append(warning);continue;}
    button=fresh;root.append(button);
    const state={eyeDrag:null},run=hold=>{this._eyeHubClose();(hold?f.hold:f.tap)();queueMicrotask(()=>this._eyeHubSync());};
    const options={element:button,state:()=>state,activate:()=>run(false),longPress:()=>run(true),position:()=>this._eyeHubPosition(),save:()=>{},onDecision:f.onDecision};s.bubbleOptions.push(options);this._weatherDisplayBindEyeDrag(button,options);
   }}
   if(!root.hidden&&JSON.stringify([...root.querySelectorAll(':scope>.eye-hub-bubble')].map(b=>b.dataset.function))!==JSON.stringify(ids)){
    const nodes=new Map([...root.querySelectorAll(':scope>.eye-hub-bubble')].map(b=>[b.dataset.function,b]));
    for(const id of ids)root.append(nodes.get(id));
   }
   s.view?.update();
  }
  this._eyeHubPosition();this._eyeHubSyncIcons();this._eyeHubGlowSync();this._weatherQuickSync?.();
 },
 _eyeHubGlowSync(){
  const s=this.__eyeHub;if(!s||s.suspended)return;const items=[],eye=this.shadow?.getElementById('weather-display-eye-control');
  if(eye&&!s.open&&!s.view?.dialog.open)items.push({host:eye,config:s.config,statuses:this._eyeHubStatuses(),clip:s.paintClip});
  const view=s.view;if(view?.dialog.open&&!view.dialog.classList.contains('minimized')){const host=view.dialog.querySelector('[data-preview=closed] .eye-visual');if(host)items.push({host,config:s.config,statuses:view.simulation||this._eyeHubStatuses()});}
  if(!s.neon)s.neon=new EyeNeon();s.neon.sync(items);
 },
 _eyeHubPosition(){
  const s=this.__eyeHub,eye=this.shadow?.getElementById('weather-display-eye-control');
  if(!s||!eye||s.suspended)return;
  const state=this._weatherDisplayState();
  if(state.eyeDrag)return;
  const layout=s.eyeOptions?.measure();
  if(!layout)return;
  const p=state.config.rememberPosition?state.config.eyePosition:{x:0,y:1};
  const {storage,originX,originY,scaleX,scaleY}=layout;
  s.eyeOptions.place(layout,storage.left+(storage.right-storage.left)*p.x,storage.top+(storage.bottom-storage.top)*p.y);
  const root=this.shadow.getElementById('eye-hub-bubbles');
  if(!root||root.hidden)return;
  const r=eye.getBoundingClientRect(),card=root.parentElement;
  const obstacles=[...card.querySelectorAll('.leaflet-control,#map-location-overlay,.map-compass-overlay,.map-medallion-overlay,.map-top-controls,#map-display-control,#map-instrument-controls,#weather-legend-overlay,#weather-wind-legend-overlay,#map-cluster-jump-overlay')]
   .map(n=>n.getBoundingClientRect()).filter(rect=>rect.width&&rect.height);
  const buttons=[...root.querySelectorAll(':scope>.eye-hub-bubble')];
  const center={x:r.left+r.width/2,y:r.top+r.height/2};
  // The same hit sizes apply in layout pixels, including scaled embeddings.
  const bounds=layout.clip,toLocal=rect=>({left:(rect.left-originX)/scaleX,top:(rect.top-originY)/scaleY,
   right:(rect.right-originX)/scaleX,bottom:(rect.bottom-originY)/scaleY});
  const localCenter={x:(center.x-originX)/scaleX,y:(center.y-originY)/scaleY};
  const blockers=[toLocal(r),...obstacles.map(toLocal)];
  let iconSize=s.config.iconSize;
  const bubblePoints=()=>eyeBubbleLayout(buttons.length,localCenter,bounds,blockers,layout.width,iconSize,{gap:s.config.eyeAuraGap,balanced:s.config.auraLayout==='dynamic'});
  let points=bubblePoints(),pagerSlot=null;
  if(points.length<buttons.length){
   pagerSlot=eyePagerPosition(bounds,blockers);
   if(pagerSlot){blockers.push(pagerSlot);points=bubblePoints();}
   if(iconSize>100&&(!points.length||!pagerSlot)){iconSize=100;points=bubblePoints();}
  }
  const capacity=Math.max(1,points.length),pages=Math.max(1,Math.ceil(buttons.length/capacity));
  s.bubblePages=pages;s.bubblePage=Math.min(s.bubblePage||0,pages-1);
  const previousRects=buttons.map(b=>toLocal(b.getBoundingClientRect())),settle=[];
  buttons.forEach((b,i)=>{
   const point=points[i-s.bubblePage*capacity];
   b.hidden=!point;
   if(point){
    const target=eyeIconTarget(iconSize),box=eyeIconBox(b.dataset.function,iconSize);
    const previous=previousRects[i],next={left:point.x-target/2,top:point.y-target/2,right:point.x+target/2,bottom:point.y+target/2};
    const swept={left:Math.min(previous.left,next.left),top:Math.min(previous.top,next.top),right:Math.max(previous.right,next.right),bottom:Math.max(previous.bottom,next.bottom)};
    // An obstacle can appear under a settled bubble. Never leave its tap target
    // blocked during a CSS transition, or animate through a fixed map control.
    if(previous.right>previous.left&&blockers.some(o=>overlaps(swept,o,0))){b.style.transition='none';settle.push(b);}
    b.style.left=point.x-target/2+'px';b.style.top=point.y-target/2+'px';
    b.style.width=b.style.height=target+'px';
    const image=b.querySelector('img');image.style.width=image.style.height=box+'px';
   }
  });
  if(settle.length){root.getBoundingClientRect();for(const b of settle)b.style.removeProperty('transition');}
  let pager=root.querySelector('.eye-page-controls');if(pages>1&&pagerSlot){if(!pager){pager=document.createElement('div');pager.className='eye-page-controls';pager.innerHTML='<button type="button" data-eye-page="-1"></button><span></span><button type="button" data-eye-page="1"></button>';root.append(pager);pager.addEventListener('click',e=>{const b=e.target.closest('[data-eye-page]');if(!b)return;e.stopPropagation();s.bubblePage=(s.bubblePage+Number(b.dataset.eyePage)+s.bubblePages)%s.bubblePages;this._eyeHubPosition();});}
   pager.style.left=pagerSlot.left+'px';pager.style.top=pagerSlot.top+'px';
   const prev=pager.querySelector('[data-eye-page="-1"]'),next=pager.querySelector('[data-eye-page="1"]');prev.textContent='‹';next.textContent='›';prev.setAttribute('aria-label',this._t('eye.previous'));next.setAttribute('aria-label',this._t('eye.next'));pager.querySelector('span').textContent=(s.bubblePage+1)+' / '+pages;
  }else pager?.remove();

 },
 _eyeHubSyncIcons(){
  const s=this.__eyeHub;if(!s||s.suspended)return;const size=s.config.iconSize,target=eyeIconTarget(size),map=this.shadow?.getElementById('map'),card=this.shadow?.getElementById('map-card');if(!map||!card)return;
  const buttons=[],seen=new Set(),assigned=new Set(visibleEyeSlots(s.config).map(slot=>slot.functionId));
  for(const [id,f] of s.registry.entries){const button=this.shadow.getElementById(f.button),img=button?.querySelector('img');if(!button||!img||seen.has(button))continue;seen.add(button);const box=eyeIconBox(id,size);
   for(const k of ['width','height','minWidth','minHeight'])if(button.style[k]!==target+'px')button.style[k]=target+'px';
   const sig=id+':'+size;if(img.dataset.eyeIconScale!==sig){img.style.cssText=`position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:${box}px!important;height:${box}px!important;max-width:none;pointer-events:none`;img.dataset.eyeIconScale=sig;}
   if(assigned.has(id)&&!button.hidden)buttons.push({id,button});
  }
  if(s.config.grouped){s.iconLayoutKey=null;return;}
  const d=this.__weatherDisplayState,w=this.__weatherWind,temp=this.__weatherTemperature;
  if(w?.quickDrag?.eyeDrag||temp?.quickDrag?.eyeDrag||this.__weatherSynoptic?.quickDrag?.eyeDrag||this.__weatherCloudsDrag?.state().eyeDrag||d?.precipitationDrag?.eyeDrag||d?.displayControlDrag?.eyeDrag||d?.eyeDrag||this.__stormQuick?.eyeDrag)return;
  const mapRect=map.getBoundingClientRect(),cr=card.getBoundingClientRect();
  if(!mapRect.width||!mapRect.height)return;
  const relative=rect=>({left:rect.left-cr.left,top:rect.top-cr.top,right:rect.right-cr.left,bottom:rect.bottom-cr.top});
  const m=relative(mapRect),layout=this._weatherWindToggleLayout?.(mapRect);
  const saved={
   wind:w?.config.quickPositions?.[layout],
   temperature:temp?.config.quickPositions?.[layout],
   synoptic:this.__weatherSynoptic?.config?.quickPositions?.[layout],
   precipitation:d?.config.precipitationControl?.quickPositions?.[layout],
   clouds:this._weatherCloudsConfig?.().positions[layout],
   'weather-display':d?.config.rememberPosition?d.config.displayControlPosition:null,
   storm:s.config.stormPositions?.[stormLayout(this)]
  };
  const eye=this.shadow.getElementById('weather-display-eye-control');
  const display=buttons.some(({id})=>id==='weather-display');
  const anchor=display&&!saved['weather-display']&&eye&&!eye.hidden?relative(eye.getBoundingClientRect()):null;
  const clearance=anchor?[...card.querySelectorAll(eyeFixedControls)].filter(node=>node.style.translate).map(node=>relative(node.getBoundingClientRect())):[];
  const key=JSON.stringify([size,m,layout,this._mapWindowMode,buttons.map(({id})=>[id,saved[id]]),anchor,clearance]);
  const sameLayout=s.iconLayoutKey===key&&buttons.every(({id,button})=>s.iconPlacements.get(id)?.button===button);
  if(!sameLayout){
   const left=Math.max(0,m.left+10),top=Math.max(0,m.top+10);
   const bounds={left,top,right:Math.max(left,m.right-target-10),bottom:Math.max(top,m.bottom-target-10)};
   const grid={left:m.left+8,top:m.top+8,right:m.right-target-8,bottom:m.bottom-target-8};
   const rects=nodes=>Array.from(nodes,n=>n.getBoundingClientRect()).filter(r=>r.width&&r.height).map(relative);
   // Plan against fixed controls and this pass's placements, never a sibling's old DOM position.
   const quick=rects([...card.querySelectorAll(quickControlObstacles)].filter(n=>!seen.has(n)&&!n.closest('.weather-wind-panel,.weather-display-panel,#map-display-menu')));
   const obstacles=size===100?[]:rects(card.querySelectorAll(eyeIconObstacles));
   const preferred=new Map(buttons.filter(({id})=>saved[id]).map(({id})=>[id,{
    x:left+(bounds.right-left)*saved[id].x,y:top+(bounds.bottom-top)*saved[id].y
   }]));
   if(display&&!preferred.has('weather-display'))preferred.set('weather-display',defaultDisplayPosition(bounds,anchor,target));
   const occupied=[],placements=new Map();
   for(const {id,button} of buttons){
    const reserved=[...preferred].filter(([other])=>other!==id&&!placements.has(other)).map(([,p])=>controlRect(p.x,p.y,target));
    const point=preferred.get(id)||defaultQuickPosition(bounds,[...quick,...occupied,...reserved]);
    const avoidsEyeClearance=id==='weather-display'&&anchor&&clearance.some(rect=>overlaps(controlRect(point.x,point.y,target),rect,5));
    const position=avoidsEyeClearance?resolveIconCollision(point,grid,target,occupied,[...obstacles,...clearance,anchor]):
     size===100?point:resolveIconCollision(point,grid,target,occupied,obstacles);
    placements.set(id,{button,...position});
    occupied.push(controlRect(position.x,position.y,target));
   }
   s.iconLayoutKey=key;
   s.iconPlacements=placements;
  }
  for(const {button,x,y} of s.iconPlacements.values()){
   for(const [k,v] of Object.entries({right:'auto',bottom:'auto',left:x+'px',top:y+'px'}))if(button.style[k]!==v)button.style[k]=v;
  }
 },
 _eyeHubSuspend(reason='eye-suspend'){
  this._recoverWeatherControlGesture(reason);
  const s=this.__eyeHub;
  if(!s)return;
  s.suspended=true;s.neon?.destroy();s.neon=null;this._eyeHubClose();
  if(s.frame!==null)cancelAnimationFrame(s.frame);
  if(s.viewportFrame!=null)cancelAnimationFrame(s.viewportFrame);
  s.frame=s.viewportFrame=null;
  s.observer?.disconnect();s.observer=null;s.resizeObserver?.disconnect();
  for(const node of this.shadow?.querySelectorAll(eyeFixedControls)||[]){
   node.style.removeProperty('translate');
   node.style.removeProperty('--eye-menu-room');
   node.removeAttribute('data-eye-clearance');
  }
  window.removeEventListener('scroll',s.viewportChange,true);
  window.visualViewport?.removeEventListener('scroll',s.viewportChange);
  document.removeEventListener('pointerdown',s.outside,true);
  window.removeEventListener('keydown',s.key,true);
  window.removeEventListener('blur',s.abort);
  window.removeEventListener('pagehide',s.abort);
  document.removeEventListener('visibilitychange',s.abort);
  s.view?.destroy();s.view=null;
  this._weatherStormClose?.(false);
 }
};
