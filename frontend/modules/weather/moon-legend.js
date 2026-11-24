import {COMPASS_DIALOG_FRAME} from '../fullscreen/compass-preview-style.js?v=4132r1';
import {LEGEND_FRAME_GRADIENTS} from './legend-instrument.js?v=4132r1';
import {legendHubState,saveLegendHub,patchLegend} from './legend-preferences.js?v=4132r1';
import SILVER_CHEVRON from '../fullscreen/compass-picker-chevron-right-silver.js?v=41108r1';

// Isolated read-only Moon Engine v1 consumer; no radar/provider mutations.
export const PHASES=[
 ['new_moon','Neumond','New moon','00_neumond_512.png'],
 ['waxing_crescent','Zunehmende Sichel','Waxing crescent','01_zunehmende_sichel_512.png'],
 ['first_quarter','Erstes Viertel','First quarter','02_erstes_viertel_512.png'],
 ['waxing_gibbous','Zunehmender Mond','Waxing gibbous','03_zunehmender_mond_512.png'],
 ['full_moon','Vollmond','Full moon','04_vollmond_512.png'],
 ['waning_gibbous','Abnehmender Mond','Waning gibbous','05_abnehmender_mond_512.png'],
 ['last_quarter','Letztes Viertel','Last quarter','06_letztes_viertel_512.png'],
 ['waning_crescent','Abnehmende Sichel','Waning crescent','07_abnehmende_sichel_512.png']
];
const MOON_IMAGES=Object.freeze({
 '00_neumond_512.png':new URL('../../assets/moon/00_neumond_512.png',import.meta.url).href,
 '01_zunehmende_sichel_512.png':new URL('../../assets/moon/01_zunehmende_sichel_512.png',import.meta.url).href,
 '02_erstes_viertel_512.png':new URL('../../assets/moon/02_erstes_viertel_512.png',import.meta.url).href,
 '03_zunehmender_mond_512.png':new URL('../../assets/moon/03_zunehmender_mond_512.png',import.meta.url).href,
 '04_vollmond_512.png':new URL('../../assets/moon/04_vollmond_512.png',import.meta.url).href,
 '05_abnehmender_mond_512.png':new URL('../../assets/moon/05_abnehmender_mond_512.png',import.meta.url).href,
 '06_letztes_viertel_512.png':new URL('../../assets/moon/06_letztes_viertel_512.png',import.meta.url).href,
 '07_abnehmende_sichel_512.png':new URL('../../assets/moon/07_abnehmende_sichel_512.png',import.meta.url).href
});
export const moonImage=file=>MOON_IMAGES[file];
export const moonIcon=moonImage(PHASES[4][3]);
export const MOON_MIN_ZOOM=7;
export const REFRESH_MS=60000;
export const REQUEST_TIMEOUT_MS=15000;
const mapOf=o=>{const m=o._map||o.map;return m?.getCenter&&m?.getZoom?m:null;};
const isDE=o=>/^(de|boarisch|platt|sächs|schwäb)/i.test(String(o._languageValue?.()||''));
const phaseName=(id,de)=>PHASES.find(p=>p[0]===id)?.[de?1:2]||'—';
export function formatMoonDistance(km,unit='auto',globalUnit='KM',locale='en-GB'){
 if(typeof km!=='number'||!Number.isFinite(km)||km<300000||km>450000)return null;
 const selected=unit==='auto'?(globalUnit==='MI'?'mi':'km'):unit,factors={km:1,m:1000,mi:1/1.609344,ft:1000/.3048};
 if(!Object.hasOwn(factors,selected))return null;
 // Whole-km source resolution; converted units do not imply extra accuracy.
 return '≈ '+new Intl.NumberFormat(locale,{maximumFractionDigits:0}).format(Math.round(km)*factors[selected])+' '+selected;
}
export const normalizeLongitude=lng=>((lng+180)%360+360)%360-180;
const clamp=(n,max)=>Math.max(0,Math.min(max,n));
const MOON_CLOSE_SMALL=new URL('../../assets/moon/gr-moon-close-platinum-premium-128.png',import.meta.url).href;
const MOON_CLOSE=new URL('../../assets/moon/gr-moon-close-platinum-premium-256.png',import.meta.url).href;
const MOON_CLOSE_HI=new URL('../../assets/moon/gr-moon-close-platinum-premium-512.png',import.meta.url).href;
const MINERAL=new URL('../../assets/moon/mineral-glass.svg',import.meta.url).href;
const MOON_HERO=new URL('../../assets/moon/moon_full_silver_platinum_master.png',import.meta.url).href;
const HERO_IMAGES=Object.freeze({
 'new_moon':new URL('../../assets/moon/00_neumond.png',import.meta.url).href,
 'waxing_crescent':new URL('../../assets/moon/01_zunehmende_sichel.png',import.meta.url).href,
 'first_quarter':new URL('../../assets/moon/02_erstes_viertel.png',import.meta.url).href,
 'waxing_gibbous':new URL('../../assets/moon/03_zunehmender_mond.png',import.meta.url).href,
 'full_moon':MOON_HERO,
 'waning_gibbous':new URL('../../assets/moon/05_abnehmender_mond.png',import.meta.url).href,
 'last_quarter':new URL('../../assets/moon/06_letztes_viertel.png',import.meta.url).href,
 'waning_crescent':new URL('../../assets/moon/07_abnehmende_sichel.png',import.meta.url).href,
});
const icons={distance:'<path d="M3 12h18M6 9l-3 3 3 3m12-6 3 3-3 3"/>',close:'<path d="M6 6l12 12M18 6 6 18"/>',coordinates:'<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 1v4m0 14v4M1 12h4m14 0h4"/>',cycle:'<path d="M20 8a8 8 0 1 0 0 8M20 3v5h-5"/>',phase:'<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor"/>',rise:'<path d="M2 20h20M5 17a7 7 0 0 1 14 0M12 12V2m-4 4 4-4 4 4"/>',set:'<path d="M2 20h20M5 17a7 7 0 0 1 14 0M12 2v10m-4-4 4 4 4-4"/>',calendar:'<rect x="3" y="5" width="18" height="17" rx="2"/><path d="M3 10h18M7 2v6m10-6v6"/>'};
function icon(type){const el=document.createElementNS('http://www.w3.org/2000/svg','svg');el.setAttribute('viewBox','0 0 24 24');el.setAttribute('fill','none');el.setAttribute('stroke','currentColor');el.setAttribute('stroke-width','1.5');el.setAttribute('aria-hidden','true');el.innerHTML=icons[type]||icons.phase;return el;}
// Width and height are in the map card's untransformed coordinate space.
export function moonScalePlan({width,height,naturalWidth,naturalHeight,preference,mobile=false}){
 const w=Math.max(0,width),h=Math.max(0,height),widthFit=w/Math.max(1,naturalWidth),heightFit=h/Math.max(1,naturalHeight);
 const automatic=preference.scaleMode!=='manual',requested=automatic?1:preference.scalePercent/100;
 const fit=Math.min(widthFit,heightFit),readable=mobile?.76:.72;
 const scale=Math.max(.01,Math.min(widthFit,requested,Math.max(fit,Math.min(requested,readable))));
 return {scale,fit,scroll:naturalHeight*scale>h+.5,visibleHeight:Math.min(naturalHeight,h/scale)};
}
function bounds(o,s=o.__grMoon){
 const card=o.shadow.getElementById('map-card'),map=o.shadow.getElementById('map');if(!card||!map)return null;
 const a=card.getBoundingClientRect(),b=map.getBoundingClientRect(),win=card.ownerDocument.defaultView,v=win.visualViewport;
 const sx=a.width/card.offsetWidth||1,sy=a.height/card.offsetHeight||1,css=s?.host?win.getComputedStyle(s.host):null;
 const safe=side=>parseFloat(css?.getPropertyValue('--moon-safe-'+side))||0;
 const left=Math.max(b.left,(v?.offsetLeft||0)+safe('left'))+14,top=Math.max(b.top,(v?.offsetTop||0)+safe('top'))+14;
 const right=Math.min(b.right,(v?.offsetLeft||0)+(v?.width||win.innerWidth)-safe('right'))-14;
 const bottom=Math.min(b.bottom,(v?.offsetTop||0)+(v?.height||win.innerHeight)-safe('bottom'))-14;
 return {x:(left-a.left)/sx,y:(top-a.top)/sy,w:Math.max(0,(right-left)/sx),h:Math.max(0,(bottom-top)/sy),sx,sy};
}
const heightFor=b=>Math.max(0,b.h-(b.w<1040||b.h<600?42:0));
function storedPosition(s,b){return {x:clamp((parseFloat(s.host.style.left)-b.x)/Math.max(1,b.w-parseFloat(s.host.style.width)),1),y:clamp((parseFloat(s.host.style.top)-b.y)/Math.max(1,heightFor(b)-parseFloat(s.host.style.height)),1)};}
function place(o,s,p=legendHubState(o).config.extraPositions.moon){
 const b=bounds(o,s);if(!b||!s.open||s.placing||s.dragging)return;if(!b.w||!b.h){s.host.hidden=true;return;}s.host.hidden=false;s.placing=true;
 try{
  const mobile=b.w<600&&b.h>b.w*1.15,zoom=s.dialog.dataset.view==='zoom',width=zoom?345:mobile?420:1004;
  const availableHeight=heightFor(b);
  s.dialog.dataset.layout=mobile?'portrait':'wide';s.dialog.style.width=width+'px';
  const scrollTop=s.surface.scrollTop;s.surface.style.maxHeight='';s.surface.style.overflowY='hidden';
  const naturalWidth=s.dialog.offsetWidth,naturalHeight=s.dialog.offsetHeight,frame=s.dialog.offsetHeight-s.surface.offsetHeight;
  const pref=legendHubState(o).config.moonUi,plan=moonScalePlan({width:b.w,height:availableHeight,naturalWidth,naturalHeight,preference:zoom?{...pref,scaleMode:'auto'}:pref,mobile});
  if(plan.scroll){s.surface.style.maxHeight=Math.max(0,plan.visibleHeight-frame)+'px';s.surface.style.overflowY='auto';}s.surface.scrollTop=scrollTop;
  s.scale=plan.scale;s.fit=plan.fit;s.naturalHeight=naturalHeight;s.dialog.dataset.scrollFallback=String(plan.scroll);
  s.dialog.style.setProperty('--moon-render-scale',String(plan.scale*b.sx));
  s.dialog.style.transform='scale('+plan.scale+')';
  const w=s.dialog.offsetWidth*plan.scale,h=s.dialog.offsetHeight*plan.scale;
  s.host.style.width=w+'px';s.host.style.height=h+'px';
  s.host.style.left=(b.x+Math.max(0,b.w-w)*p.x)+'px';s.host.style.top=(b.y+Math.max(0,availableHeight-h)*p.y)+'px';
  if(s.controlAnchor){const a=s.controlAnchor,r=a.element.getBoundingClientRect();s.host.style.left=b.x+clamp(parseFloat(s.host.style.left)-b.x+(a.x-r.left-r.width/2)/b.sx,Math.max(0,b.w-w))+'px';s.host.style.top=b.y+clamp(parseFloat(s.host.style.top)-b.y+(a.y-r.top-r.height/2)/b.sy,Math.max(0,availableHeight-h))+'px';const next=storedPosition(s,b),old=legendHubState(o).config.extraPositions.moon;if(Math.abs(next.x-old.x)>1e-6||Math.abs(next.y-old.y)>1e-6)saveLegendHub(o,{extraPositions:{...legendHubState(o).config.extraPositions,moon:next}});}
  if(s.sizeSelect){s.sizeSelect.value=pref.scaleMode==='auto'?'auto':String(pref.scalePercent);s.sizeSelect.options[0].textContent='Auto · '+Math.round(plan.scale*100)+' %';}
  s.scaleOutput.textContent=Math.round(plan.scale*100)+' %';
  s.scaleOutput.title=(isDE(o)?'Gespeicherte Größe: ':'Saved size: ')+(pref.scaleMode==='auto'?'Auto':pref.scalePercent+' %');
  s.autoButton.setAttribute('aria-pressed',String(pref.scaleMode==='auto'));
  s.minusButton.disabled=pref.scaleMode==='manual'&&pref.scalePercent<=50;
  s.plusButton.disabled=plan.scale>=Math.min(1.25,plan.fit)-.005;
 }finally{s.placing=false;}
}
function schedulePlace(o,s){if(!s.open||s.fitFrame)return;s.fitFrame=requestAnimationFrame(()=>{s.fitFrame=null;place(o,s);});}
function drag(o,s,head){
 let start=null;const options={signal:s.abort.signal};
 head.addEventListener('pointerdown',e=>{
  if(e.button!==0||e.target.closest('button,select')||start)return;const b=bounds(o,s);if(!b)return;
  start={id:e.pointerId,x:e.clientX,y:e.clientY,left:s.host.offsetLeft,top:s.host.offsetTop};
  s.controlAnchor=null;s.dragging=true;cancelAnimationFrame(s.fitFrame);s.fitFrame=null;
  if(head.hasPointerCapture?.(e.pointerId)===false)try{head.setPointerCapture(e.pointerId);}catch{}
  e.preventDefault();e.stopPropagation();
 },options);
 head.addEventListener('pointermove',e=>{
  if(!start||e.pointerId!==start.id)return;const b=bounds(o,s);if(!b)return;
  s.host.style.left=b.x+clamp(start.left-b.x+(e.clientX-start.x)/b.sx,Math.max(0,b.w-s.host.offsetWidth))+'px';
  s.host.style.top=b.y+clamp(start.top-b.y+(e.clientY-start.y)/b.sy,Math.max(0,heightFor(b)-s.host.offsetHeight))+'px';
  e.preventDefault();
 },options);
 const end=e=>{
  if(!start||start.id!==e.pointerId)return;const id=start.id;start=null;s.dragging=false;
  if(head.hasPointerCapture?.(id))head.releasePointerCapture(id);
  const b=bounds(o,s);if(!b||!s.open)return;
  const p=storedPosition(s,b);
  saveLegendHub(o,{extraPositions:{...legendHubState(o).config.extraPositions,moon:p}});
  place(o,s,p);
 };
 for(const type of ['pointerup','pointercancel','lostpointercapture'])head.addEventListener(type,end,options);
}
export function ensureMoonStyle(shadow){if(shadow.getElementById('gr-moon-style'))return;const el=document.createElement('style');el.id='gr-moon-style';el.textContent=`
.gr-moon-window{--moon-safe-top:env(safe-area-inset-top,0px);--moon-safe-right:env(safe-area-inset-right,0px);--moon-safe-bottom:env(safe-area-inset-bottom,0px);--moon-safe-left:env(safe-area-inset-left,0px);position:absolute;inset:auto;z-index:2147483647;margin:0;isolation:isolate}
.gr-moon-material{position:relative;box-sizing:border-box;width:1004px;margin:0;padding:4px;border:1px solid #b4bdcd;border-radius:48px;color:#f1f1fa;background:linear-gradient(130deg,#1c2940aa,#080f22a8 55%,#15233aaa);box-shadow:0 0 0 1px #10192b,0 0 0 2px #b8c4dc80,0 1px 0 3px #3a465f99,0 15px 42px #0009,0 0 18px #ccdcfa16;font:17px/1.35 system-ui,sans-serif;transform-origin:0 0;isolation:isolate;container-type:inline-size;overflow:hidden}
.gr-moon-material::before{content:'';position:absolute;inset:1px;padding:2px;border-radius:inherit;z-index:4;pointer-events:none;background:linear-gradient(132deg,#e9f5ffad,#9299b520 15%,#f0f0ff9c 26%,#a1b2c536 44%,#f5faffcd 64%,#858fa336 80%,#eff1ff9c);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude}
.gr-moon-material::after{content:'';position:absolute;inset:0;padding:5px;border-radius:inherit;z-index:5;pointer-events:none;background:radial-gradient(ellipse 78px 5px at 13% 0,#fff 0%,#eff5ff96 26%,transparent 100%),radial-gradient(ellipse 126px 4px at 76% 0,#fff 0%,#cce2ff88 35%,transparent 100%),radial-gradient(ellipse 4px 46px at 0 12%,#fff 0%,#d9eaff66 38%,transparent 100%),radial-gradient(ellipse 65px 4px at 78% 100%,#fff,transparent),radial-gradient(ellipse 50px 4px at 14% 100%,#f5f8ff,transparent),radial-gradient(circle 24px at 98% 95%,#dcecff60,transparent);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude}
.gr-moon-surface{position:relative;box-sizing:border-box;border:1px solid #d9e3f0a6;border-radius:42px;overflow:hidden;scrollbar-width:thin;scrollbar-color:#aebdd5 #11192b;overscroll-behavior:contain;background:linear-gradient(132deg,transparent 7%,#c3d7f711 18%,transparent 30%,#bdccec08 65%,transparent 78%),radial-gradient(ellipse at 18% 38%,#7b93ba20,transparent 48%),radial-gradient(ellipse at 92% 4%,#bbcce326,transparent 42%),radial-gradient(ellipse at 73% 91%,#6b7eac26,transparent 54%),linear-gradient(126deg,#232b3de8,#0b1122ed 53%,#1f2941e8);box-shadow:inset 0 0 0 1px #404d68,inset 0 0 0 3px #8e9db419,inset 0 0 28px #b7c8eb1c,inset 0 -8px 24px #01081538;backdrop-filter:blur(22px) saturate(.88)}
.gr-moon-header{position:sticky;top:0;z-index:3;display:flex;align-items:center;gap:20px;padding:17px 25px 14px 35px;border-bottom:1px solid transparent;background:linear-gradient(110deg,#939fb733,#27334b9c 57%,#8190ab1f) padding-box,linear-gradient(90deg,#7e8ba52b,#f4f3ffb3 22%,#c5d0e866 58%,#8a9cb526) border-box;box-shadow:inset 0 1px #fff5,0 1px 0 #081020b3,0 3px 12px #0003;backdrop-filter:blur(22px);cursor:grab;touch-action:none;user-select:none}
.gr-moon-header:active{cursor:grabbing}.gr-moon-badge{display:grid;place-items:center;flex:none;width:76px;height:72px;border:1px solid #c5d0e3bd;border-radius:18px;background:radial-gradient(ellipse at 20% 0%,#fff6,transparent 55%),linear-gradient(140deg,#b6c0d440,#303a5266 54%,#8796b540);box-shadow:inset 0 1px 2px #f6f7ffcf,inset 0 0 0 2px #525f7a6b,inset 0 -6px 13px #b8cce51a,0 3px 9px #0005}.gr-moon-badge img{width:64px;height:64px;object-fit:contain}.gr-moon-header h2{font:40px/1.1 Georgia,serif;letter-spacing:.015em;margin:0 0 7px;text-shadow:0 2px 3px #0008}.gr-moon-header small{display:block;font-size:12px;letter-spacing:.43em;text-transform:uppercase;color:#d8daeb;white-space:nowrap}
.gr-moon-header .gr-moon-close{display:grid;place-items:center;flex:none;margin-left:12px;padding:0;width:46px;height:46px;border:1px solid #d2daedac;border-radius:50%;background:radial-gradient(ellipse at 23% 8%,#f7faff38,transparent 55%),linear-gradient(135deg,#b7c9e21c,#101c32a6 60%,#a7b6d12b);box-shadow:inset 0 1px 2px #fff8,inset 0 0 0 2px #42516b66,0 1px 6px #0006;color:#f3f3fc;cursor:pointer}.gr-moon-close svg{width:27px;height:27px;filter:drop-shadow(0 1px 2px #0008)}
.gr-moon-size-controls{display:flex;align-items:center;gap:3px;margin-left:auto;padding:4px 5px;border:1px solid #c4d4ed47;border-radius:19px;background:linear-gradient(135deg,#d8e4fb16,#101b2c9c);box-shadow:inset 0 1px #f1f6ff2e,0 2px 6px #0003}.gr-moon-size-controls button{display:grid;place-items:center;box-sizing:border-box;min-width:30px;height:32px;padding:0 7px;border:1px solid #bdcfe637;border-radius:12px;color:#e3ebfa;background:linear-gradient(145deg,#8da9ca27,#18263e72);box-shadow:inset 0 1px #e6f1ff26;font:15px/1 system-ui;cursor:pointer}.gr-moon-size-controls button[data-moon-scale=auto]{font-size:11px;letter-spacing:.04em}.gr-moon-size-controls button[aria-pressed=true]{border-color:#e1e9fa80;background:linear-gradient(145deg,#a6c0df3d,#263a5266)}.gr-moon-size-controls button:disabled{opacity:.32;cursor:default}.gr-moon-size-controls output{min-width:43px;text-align:center;font:11px/1 system-ui;color:#c7d2e6;font-variant-numeric:tabular-nums}.gr-moon-dialog button:focus-visible{outline:2px solid #eff5ff;outline-offset:3px}
.gr-moon-body{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.08fr);gap:9px;align-items:center;padding:16px 14px 14px 12px}.gr-moon-hero-wrap{position:relative;min-width:0;height:412px;background:radial-gradient(ellipse at 50% 50%,#9cb7e51a,transparent 67%)}.gr-moon-hero-wrap::before{content:'';position:absolute;inset:8% -2%;pointer-events:none;background:radial-gradient(ellipse,#b7d4f50e,transparent 68%);filter:blur(10px)}.gr-moon-hero{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:block;width:126%;max-width:none;aspect-ratio:1;object-fit:contain;filter:drop-shadow(0 0 10px #b8d3fc2a)}
.gr-moon-details{display:grid;gap:5px;min-width:0}.gr-moon-row{position:relative;display:grid;grid-template-columns:27px minmax(140px,.83fr) minmax(0,1.17fr);align-items:center;gap:10px;padding:8px 12px;border:0;border-radius:16px 8px 8px 16px;background:linear-gradient(100deg,#a3b2cb25,#52658117 27%,#0913263d 66%,#53648202);box-shadow:inset 1px 0 #ccd8ec58,inset 4px 0 7px #9badcb09,0 2px 4px #0002;isolation:isolate}.gr-moon-row::before{content:'';position:absolute;inset:0;border-radius:inherit;padding:1px;background:linear-gradient(90deg,#b5c7e864,#b7c7e344 34%,#a4b9d81a 69%,transparent 97%);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}.gr-moon-row::after{content:'';position:absolute;inset:1px 0;z-index:-1;border-radius:inherit;background:linear-gradient(100deg,#f1f5ff06,transparent 54%),linear-gradient(90deg,transparent 2%,#0b132613 20%,transparent);pointer-events:none}.gr-moon-row svg{width:25px;height:25px;color:#e4eaf7}.gr-moon-row>span{font-size:16px;overflow-wrap:anywhere}.gr-moon-row strong{font-size:17px;font-weight:500;min-width:0;overflow-wrap:anywhere;font-variant-numeric:tabular-nums}.gr-moon-row[data-row=phase] strong,.gr-moon-row[data-row=calendar] strong{font-weight:600}.gr-moon-secondary{display:block;font-weight:400;font-size:.86em;color:#cbd4e6;margin-top:1px}.gr-moon-track-line{display:flex;align-items:center;gap:9px;margin-top:4px;font-size:12px}.gr-moon-track{flex:1;height:8px;border:1px solid #d6d9e56b;border-radius:10px;background:#ffffff0d;box-shadow:inset 0 1px 3px #0009;overflow:hidden}.gr-moon-track div{height:100%;border-radius:inherit;background:linear-gradient(#f7faff,#9faabd 60%,#f0f4ff);box-shadow:0 0 8px #d1e3ff73}
.gr-moon-phases{margin:0 10px 7px;border:1px solid #c6d2e353;border-radius:27px;background:radial-gradient(ellipse at 65% 100%,#a8b6d30c,transparent 69%),linear-gradient(155deg,#a0aec21c,#0d15274d 60%,#8699be17);box-shadow:inset 0 1px #e9edff33,inset 0 0 0 2px #29374a66,0 2px 8px #0002;overflow:hidden}.gr-moon-phases-head{display:flex;align-items:center;gap:15px;padding:10px 17px 10px 22px;border-bottom:1px solid #c8d6ee61;box-shadow:0 1px #0a1227a6}.gr-moon-phases h3{display:flex;align-items:center;gap:12px;flex:none;margin:0;font-size:16px;font-weight:400;letter-spacing:.29em;text-transform:uppercase}.gr-moon-phase-emblem{width:30px;height:30px;padding:2px;border:1px solid #a2b9dc55;border-radius:50%;background:radial-gradient(circle at 28% 15%,#c7d9f62b,#14223d66 70%);box-shadow:inset 0 1px #ddeaff40,0 0 7px #bbd4fb20;object-fit:contain}.gr-moon-cycle-label{margin-left:auto;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#e0e5f3;text-align:right}.gr-moon-toggle{display:grid;place-items:center;flex:none;box-sizing:border-box;width:44px;height:36px;padding:6px 10px;border:1px solid #b3c6e04d;border-radius:12px;background:linear-gradient(135deg,#a9c2e51a,#17263c70);box-shadow:inset 0 1px #eff7ff40,0 1px 5px #0003;cursor:pointer}.gr-moon-toggle img{display:block;width:20px;height:20px;object-fit:contain;filter:grayscale(1) brightness(1.45) contrast(.9);transform:rotate(-90deg);transition:transform .42s cubic-bezier(.22,1,.36,1);pointer-events:none}.gr-moon-toggle[aria-expanded=false] img{transform:rotate(90deg)}
.gr-moon-phase-body{display:grid;grid-template-rows:1fr;transition:grid-template-rows .42s cubic-bezier(.22,1,.36,1)}.gr-moon-phases[data-expanded=false] .gr-moon-phase-body{grid-template-rows:0fr}.gr-moon-phase-inner{min-height:0;overflow:hidden}.gr-moon-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:5px;padding:12px 12px 10px}.gr-moon-tile{min-width:0;padding:5px 2px 10px;text-align:center;border:1px solid transparent;border-radius:19px;font-size:14px;line-height:1.3}.gr-moon-tile img{display:block;width:100%;aspect-ratio:1;object-fit:contain;margin-bottom:6px}.gr-moon-tile span{display:block;overflow-wrap:anywhere}.gr-moon-tile[aria-current=true]{border-color:#e1e8fb;background:linear-gradient(145deg,#b8c8e02e,#424f6939 60%,#969fb522);box-shadow:inset 0 0 0 1px #cbdcf333,inset 0 0 15px #cadfff24,0 0 9px #b5cbff4a;position:relative}.gr-moon-tile[aria-current=true]::after{content:'';position:absolute;bottom:-1px;left:27%;right:27%;height:2px;background:linear-gradient(90deg,transparent,#f6faff,transparent);box-shadow:0 0 5px #e9f6ff}
.gr-moon-note{font-size:11px;color:#c7d2e5;text-align:center;padding:0 20px 9px;margin:0}.gr-moon-status{padding:24px;text-align:center;white-space:pre-line;color:#dde5f4}.gr-moon-status img{display:block;width:174px;height:174px;object-fit:contain;margin:5px auto 16px}.gr-moon-status strong{display:block;font:28px/1.2 Georgia,serif;font-weight:400;margin:0 auto 16px;max-width:290px}.gr-moon-status small{display:block;font-size:16px;max-width:290px;margin:auto;line-height:1.5;color:#cbd6e8}.gr-moon-dialog[data-view=zoom]{border-radius:36px}.gr-moon-dialog[data-view=zoom] .gr-moon-surface{border-radius:30px}.gr-moon-dialog[data-view=zoom] .gr-moon-header{padding:12px 16px;gap:9px}.gr-moon-dialog[data-view=zoom] .gr-moon-badge,.gr-moon-dialog[data-view=zoom] .gr-moon-header small,.gr-moon-dialog[data-view=zoom] .gr-moon-size-controls{display:none}.gr-moon-dialog[data-view=zoom] h2{font-size:24px;margin:0}.gr-moon-dialog[data-view=zoom] .gr-moon-close{margin-left:auto}.gr-moon-dialog[data-view=zoom] .gr-moon-status{padding:12px 20px 29px}.gr-moon-zoom-image{position:relative;display:block;width:180px;margin:auto}.gr-moon-zoom-image::after{content:'⌕';position:absolute;right:3px;bottom:4px;border:1px solid #e2eeffcf;border-radius:50%;width:50px;height:50px;line-height:46px;font-size:44px;background:linear-gradient(135deg,#859db942,#233047ba);box-shadow:inset 0 1px 4px #fff5,0 2px 8px #0005}
.gr-moon-dialog[hidden],.gr-moon-body[hidden],.gr-moon-phases[hidden],.gr-moon-note[hidden],.gr-moon-status[hidden]{display:none!important}
@container(max-width:540px){.gr-moon-header{padding:10px 13px;gap:5px 12px;flex-wrap:wrap}.gr-moon-header h2{font-size:32px}.gr-moon-header small{font-size:10px;letter-spacing:.43em}.gr-moon-badge{width:52px;height:52px;border-radius:14px}.gr-moon-badge img{width:46px;height:46px}.gr-moon-header .gr-moon-close{margin-left:auto;width:50px;height:50px}.gr-moon-size-controls{order:4;justify-content:center;width:100%;padding:3px;margin:0}.gr-moon-size-controls button{height:24px;min-width:40px}.gr-moon-body{grid-template-columns:1fr;gap:2px;padding:5px 11px 11px}.gr-moon-hero-wrap{height:196px;width:100%;margin:auto}.gr-moon-hero{width:72%;}.gr-moon-details{gap:2px;width:100%}.gr-moon-row{padding:5px 10px;gap:8px;grid-template-columns:23px minmax(125px,.85fr) minmax(0,1.15fr);border-radius:13px}.gr-moon-row svg{width:23px;height:23px}.gr-moon-row>span{font-size:15px}.gr-moon-row strong{font-size:16px}.gr-moon-phases{margin:0 7px 6px;border-radius:20px}.gr-moon-phases-head{padding:6px 12px;gap:9px}.gr-moon-phases h3{font-size:12px;letter-spacing:.18em;gap:6px}.gr-moon-phase-emblem{width:25px;height:25px}.gr-moon-cycle-label{font-size:9px;letter-spacing:.05em;max-width:116px}.gr-moon-toggle{width:38px;height:32px;padding:5px 8px}.gr-moon-grid{grid-template-columns:repeat(4,minmax(0,1fr));padding:6px;gap:4px}.gr-moon-tile{font-size:12px;padding:2px 1px 3px;line-height:1.25;border-radius:14px}.gr-moon-note{font-size:10px}.gr-moon-dialog[data-view=zoom] .gr-moon-header{flex-wrap:nowrap}}

@container(max-width:540px){.gr-moon-tile img{width:min(100%,72px);margin-inline:auto;margin-bottom:4px}}
@media(prefers-reduced-motion:reduce){.gr-moon-dialog,.gr-moon-dialog *{animation:none!important;transition:none!important}}
.gr-moon-material{--moon-metal-base:#aebdcd;--moon-metal-dark:#354359;--moon-glint:#ecf4ff;--moon-light-rgb:216,233,255;border-color:var(--moon-metal-base);background:var(--moon-metal-gradient);box-shadow:0 0 0 1px #081020,0 0 0 2px #c5d8ef59,0 14px 42px #0009,inset 0 1px 2px #fff9,inset 0 -2px 4px #03091499}
.gr-moon-material[data-frame=gold]{--moon-metal-base:#cfab65;--moon-metal-dark:#594221;--moon-glint:#fff0c4;--moon-light-rgb:255,224,165}
.gr-moon-material::before{inset:1px;padding:3px;background:linear-gradient(180deg,#ffffffa3,transparent 18%,#0005 46%,transparent 67%,#ffffff88),var(--moon-metal-gradient);box-shadow:inset 0 0 2px #fff}
.gr-moon-material::after{background:radial-gradient(ellipse 90px 5px at 13% 0,var(--moon-glint),transparent),radial-gradient(ellipse 126px 5px at 76% 0,var(--moon-glint),transparent),radial-gradient(ellipse 5px 56px at 0 12%,var(--moon-glint),transparent),radial-gradient(ellipse 70px 5px at 78% 100%,var(--moon-glint),transparent),radial-gradient(ellipse 55px 4px at 14% 100%,var(--moon-glint),transparent),radial-gradient(circle 24px at 98% 95%,rgba(var(--moon-light-rgb),.5),transparent)}
.gr-moon-material[data-reflections=false]::after{opacity:0}
.gr-moon-material .gr-moon-surface{border-color:var(--moon-metal-base);box-shadow:inset 0 0 0 1px var(--moon-metal-dark),inset 0 0 0 3px #aabed41c,inset 0 0 26px #b7c8eb1c,inset 0 -8px 24px #01081538}
.gr-moon-material .gr-moon-surface::before{content:'';position:absolute;inset:0;pointer-events:none;border-radius:inherit;background-image:var(--moon-mineral);background-size:100% 100%;background-repeat:no-repeat;opacity:0;z-index:0}
.gr-moon-material[data-glass=mineral] .gr-moon-surface::before{opacity:.46}
.gr-moon-material .gr-moon-surface>*{position:relative;z-index:1}.gr-moon-material .gr-moon-surface>.gr-moon-header{position:sticky;z-index:3}
.gr-moon-material[data-glass=mineral] .gr-moon-row::after{background-image:linear-gradient(90deg,#0c152b66,#0c152b99),var(--moon-mineral);background-size:cover;opacity:.45}
.gr-moon-material .gr-moon-hero-wrap::before{background:radial-gradient(ellipse,rgba(186,210,249,var(--moon-halo-alpha)),transparent 67%);filter:blur(14px);inset:0}
.gr-moon-material .gr-moon-hero{filter:drop-shadow(0 0 var(--moon-halo-blur) rgba(184,211,252,var(--moon-halo-alpha)))}
.gr-moon-header .gr-moon-close{box-sizing:border-box;width:max(46px,calc(44.1px / var(--moon-render-scale,1)));height:max(46px,calc(44.1px / var(--moon-render-scale,1)));border:0;padding:0;border-radius:50%;background:transparent;box-shadow:none;outline:0;transition:transform .18s ease}
.gr-moon-close img{display:block;width:100%;height:100%;object-fit:contain;pointer-events:none;filter:none}.gr-moon-close:hover{transform:translateY(-1px)}.gr-moon-close:active{transform:scale(.96)}.gr-moon-header .gr-moon-close:focus-visible{outline:2px solid #eff5ff;outline-offset:2px}
.gr-moon-preview{width:100%;height:132px;min-height:0;padding:4px;border-radius:23px;container-type:normal;font:14px/1.4 system-ui;transform:none;box-sizing:border-box;position:relative;overflow:hidden;isolation:isolate}
.gr-moon-preview .gr-moon-surface{border-radius:18px;height:100%;display:flex;align-items:center;justify-content:center;gap:18px;overflow:hidden}.gr-moon-preview .gr-moon-hero-wrap{height:110px;width:110px;flex:none}.gr-moon-preview .gr-moon-hero{width:145%}.gr-moon-preview strong{font:24px Georgia,serif;color:#edf3ff}.gr-moon-preview small{display:block;color:#c9d4e7;font-size:11px}
.lh-dialog.lh-moon-settings .lh-form{grid-template-columns:1fr}.lh-moon-settings .lh-preview{padding:6px}.lh-moon-settings .lh-moon-reset{justify-self:end;min-height:44px}.lh-moon-settings label:has([data-lh-key=aura]),.lh-moon-settings label:has([data-lh-key=scalePercent]){grid-template-columns:minmax(0,1fr) minmax(130px,50%)}


.gr-moon-size-controls{border:1px solid transparent;padding:4px 5px;border-radius:20px;background:linear-gradient(150deg,#42546ac9,#142237ed 55%,#303b50bb) padding-box,linear-gradient(140deg,#e6efffaa,#52617a66,#c5d7edbb) border-box;box-shadow:inset 0 1px #fff5,inset 0 -2px 5px #060d1ccc,0 2px 7px #0006}
.gr-moon-size-controls button{min-width:max(36px,calc(44px / var(--moon-render-scale,1)));height:max(36px,calc(44px / var(--moon-render-scale,1)));border:1px solid #bccde16b;background:radial-gradient(ellipse at 25% 0,#eef7ff2b,transparent 65%),linear-gradient(145deg,#60748c66,#17263dbb 60%,#6a7b9240);box-shadow:inset 0 1px #f0f7ff88,inset 0 -1px #09132499,0 2px 4px #0004;font-weight:600}
.gr-moon-percent-choice{position:relative;display:grid;place-items:center;min-width:54px;height:max(36px,calc(44px / var(--moon-render-scale,1)));border-radius:10px;cursor:pointer;background:linear-gradient(135deg,#e5f1ff12,#07152c44);box-shadow:inset 0 1px #dbeaff29}
.gr-moon-percent-choice output{font-size:13px;color:#edf4ff;font-weight:600}.gr-moon-percent-choice select{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;color-scheme:dark;font:14px system-ui}.gr-moon-percent-choice:has(select:focus-visible){outline:2px solid #eff5ff;outline-offset:2px}


.gr-moon-toggle{border:0;background:transparent;box-shadow:none;width:44px;height:44px;padding:7px 8px}.gr-moon-toggle img{width:27px;height:27px}
/* 7: same non-repeating, translucent mineral layer in window and preview. */
.gr-moon-material[data-glass=mineral] .gr-moon-surface::before{opacity:.76;background-size:cover}
/* 8: unchanged elegant title, just a very fine top light. */
.gr-moon-header h2{text-shadow:0 -1px 0 #eff7ff26,0 2px 3px #0008}
/* 9: exact classical menu border/shadow tokens, no new gold material. */
.gr-moon-material[data-frame=goldClassic]{padding:1px;border:var(--moon-classic-border);box-shadow:var(--moon-classic-shadow);background:#091219;--moon-metal-base:#c9a050;--moon-metal-dark:#302612}
.gr-moon-material[data-frame=goldClassic]::before,.gr-moon-material[data-frame=goldClassic]::after{display:none}.gr-moon-material[data-frame=goldClassic] .gr-moon-surface{border-color:#c9a05044}


@container(max-width:540px){.gr-moon-header{row-gap:3px;padding-block:8px}.gr-moon-phases{margin-bottom:3px}.gr-moon-note{padding-bottom:6px}.gr-moon-grid{row-gap:2px}.gr-moon-details{gap:1px}.gr-moon-row{padding-block:4px}.gr-moon-body{padding-bottom:8px}.gr-moon-tile img{width:min(100%,64px);margin-bottom:3px}.gr-moon-phases-head{padding-block:4px}}

`;shadow.append(el);}
function row(target,type,label,value){const div=document.createElement('div'),a=document.createElement('span'),b=document.createElement('strong');div.className='gr-moon-row';div.dataset.row=type;a.textContent=label;if(typeof value==='string')b.textContent=value;else b.append(value);div.append(icon(type),a,b);target.append(div);return b;}
function eventTime(event,zone,de,missing){if(!event?.utc)return missing;return new Intl.DateTimeFormat(de?'de-DE':'en-GB',{timeZone:zone,hour:'2-digit',minute:'2-digit'}).format(new Date(event.utc))+(de?' Uhr':'');}
function validate(data,position){
 if(data?.schema!=='weather_router.moon.v1'||data?.status!=='ready'||!PHASES.some(p=>p[0]===data.phase))throw Error('Moon schema mismatch');
 for(const key of ['latitude','longitude','moon_age_days','cycle_days','cycle_fraction','illumination_percent'])if(!Number.isFinite(data[key]))throw Error('Invalid Moon number');
 if(Math.abs(data.latitude-position.lat)>.001||Math.abs(data.longitude-normalizeLongitude(position.lng))>.001||data.moon_age_days<0||data.cycle_days<=0||data.cycle_fraction<0||data.cycle_fraction>1||data.illumination_percent<0||data.illumination_percent>100)throw Error('Invalid Moon range');
 if(![0,2,4,6].some(i=>PHASES[i][0]===data.next_major_phase?.phase)||!data.next_major_phase?.utc)throw Error('Missing next phase');
 for(const event of [data.moonrise,data.moonset,data.next_major_phase])if(event!=null&&(!event.utc||!Number.isFinite(Date.parse(event.utc))))throw Error('Invalid Moon event');
 new Intl.DateTimeFormat('en',{timeZone:data.timezone||'UTC'}).format();
 return data;
}
// One material application for the real instrument and its configuration preview.
export function applyMoonMaterial(element,pref){
 element.style.setProperty('--moon-classic-border',COMPASS_DIALOG_FRAME.border);element.style.setProperty('--moon-classic-shadow',COMPASS_DIALOG_FRAME.shadow);
 element.dataset.frame=pref.frameMaterial;element.dataset.glass=pref.glass;element.dataset.reflections=String(pref.reflections);
 element.style.setProperty('--moon-metal-gradient',LEGEND_FRAME_GRADIENTS[pref.frameMaterial==='goldClassic'?'gold':pref.frameMaterial]);
 element.style.setProperty('--moon-mineral','url("'+MINERAL+'")');
 element.style.setProperty('--moon-halo-alpha',String(pref.aura/100*.22));element.style.setProperty('--moon-halo-blur',pref.aura/100*18+'px');
}
export function refreshMoonAppearance(owner){owner.__grMoon?.refreshAppearance?.();}
export function createMoonPreview(owner){ensureMoonStyle(owner.shadow);const frame=document.createElement('div');frame.className='gr-moon-material gr-moon-preview';const surface=document.createElement('div'),wrap=document.createElement('div'),image=document.createElement('img'),title=document.createElement('strong');surface.className='gr-moon-surface';wrap.className='gr-moon-hero-wrap';image.className='gr-moon-hero';image.src=MOON_HERO;image.alt='';wrap.append(image);title.textContent=owner._t('legendHub.moonTitle');surface.append(wrap,title);frame.append(surface);applyMoonMaterial(frame,legendHubState(owner).config.moonUi);return frame;}
export const moonOpen=o=>!!o.__grMoon?.open;
export function closeMoon(o,persist=true){
 const s=o.__grMoon;if(!s?.open)return;s.open=false;s.seq++;clearTimeout(s.timer);clearTimeout(s.requestTimer);s.cancelRequest?.();clearInterval(s.interval);s.abort.abort();s.observer?.disconnect();s.contentObserver?.disconnect();cancelAnimationFrame(s.fitFrame);
 if(s.map){s.map.off('movestart zoomstart',s.invalidate);s.map.off('moveend zoomend',s.schedule);s.map=null;}
 s.host.remove();delete o.__grMoon;if(persist)patchLegend(o,'moon',{mode:'off'});o._legendHubStatus?.();
}
export function openMoon(o){
 if(!o.shadow||moonOpen(o))return;const card=o.shadow.getElementById('map-card');if(!card)return;ensureMoonStyle(o.shadow);
 const de=isDE(o),title=de?'Mond':'Moon',d=document.createElement('section');d.className='gr-moon-dialog gr-moon-material';d.setAttribute('role','region');d.setAttribute('aria-label',title);const host=document.createElement('div');host.className='gr-moon-window';host.append(d);
 const surface=document.createElement('div');surface.className='gr-moon-surface';d.append(surface);
 const head=document.createElement('header');head.className='gr-moon-header';const badge=document.createElement('div');badge.className='gr-moon-badge';const badgeImage=document.createElement('img');badgeImage.src=MOON_HERO;badgeImage.alt='';badge.append(badgeImage);
 const names=document.createElement('div'),h=document.createElement('h2'),sub=document.createElement('small');h.textContent=title;sub.textContent=de?'Legende · Astronomie':'Legend · Astronomy';names.append(h,sub);
 const x=document.createElement('button');x.type='button';x.className='gr-moon-close';const closeIcon=document.createElement('img');closeIcon.src=MOON_CLOSE;closeIcon.srcset=MOON_CLOSE_SMALL+' 128w, '+MOON_CLOSE+' 256w, '+MOON_CLOSE_HI+' 512w';closeIcon.sizes='64px';closeIcon.alt='';x.append(closeIcon);x.setAttribute('aria-label',de?'Schließen':'Close');x.addEventListener('click',()=>closeMoon(o));const controls=document.createElement('div');controls.className='gr-moon-size-controls';controls.setAttribute('role','group');controls.setAttribute('aria-label',de?'Fenstergröße':'Window size');
 const minus=document.createElement('button'),plus=document.createElement('button'),auto=document.createElement('button'),scaleOutput=document.createElement('output');
 for(const [button,value,label,text] of [[minus,'minus',de?'Verkleinern':'Smaller','−'],[plus,'plus',de?'Vergrößern':'Larger','+'],[auto,'auto',de?'Automatische Größe':'Automatic size','Auto']]){button.type='button';button.dataset.moonScale=value;button.setAttribute('aria-label',label);button.textContent=text;}
 scaleOutput.setAttribute('aria-live','polite');const sizeSelect=document.createElement('select'),percentChoice=document.createElement('label');percentChoice.className='gr-moon-percent-choice';sizeSelect.dataset.moonSize='';sizeSelect.setAttribute('aria-label',o._t('legendHub.size'));for(const value of ['auto',...Array.from({length:16},(_,i)=>50+i*5)]){const option=document.createElement('option');option.value=String(value);option.textContent=value==='auto'?'Auto':value+' %';sizeSelect.append(option);}percentChoice.append(scaleOutput,sizeSelect);controls.append(minus,percentChoice,plus,auto);head.append(badge,names,controls,x);
 const status=document.createElement('div');status.className='gr-moon-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 const body=document.createElement('section');body.className='gr-moon-body';const hero=document.createElement('img');hero.className='gr-moon-hero';hero.src=MOON_HERO;hero.alt=title;const details=document.createElement('div');details.className='gr-moon-details';const heroWrap=document.createElement('div');heroWrap.className='gr-moon-hero-wrap';heroWrap.append(hero);body.append(heroWrap,details);
 const phases=document.createElement('section');phases.className='gr-moon-phases';const phHead=document.createElement('div');phHead.className='gr-moon-phases-head';const ph=document.createElement('h3');const emblem=document.createElement('img');emblem.className='gr-moon-phase-emblem';emblem.src=moonImage(PHASES[2][3]);emblem.alt='';ph.append(emblem,document.createTextNode(de?'Mondphasen':'Moon phases'));const cycleLabel=document.createElement('span');cycleLabel.className='gr-moon-cycle-label';const grid=document.createElement('div');grid.className='gr-moon-grid';
 for(const p of PHASES){const tile=document.createElement('div'),image=document.createElement('img'),label=document.createElement('span');tile.className='gr-moon-tile';tile.dataset.phase=p[0];image.src=moonImage(p[3]);image.alt='';label.textContent=p[de?1:2];tile.append(image,label);grid.append(tile);}const toggle=document.createElement('button');toggle.type='button';toggle.className='gr-moon-toggle';toggle.setAttribute('aria-label',de?'Mondphasen ein- oder ausklappen':'Expand or collapse Moon phases');const chevron=document.createElement('img');chevron.src=SILVER_CHEVRON;chevron.alt='';toggle.append(chevron);
 const phaseBody=document.createElement('div'),phaseInner=document.createElement('div');phaseBody.className='gr-moon-phase-body';phaseBody.id='gr-moon-phase-body';phaseInner.className='gr-moon-phase-inner';phaseInner.append(grid);phaseBody.append(phaseInner);toggle.setAttribute('aria-controls',phaseBody.id);phHead.append(ph,cycleLabel,toggle);phases.append(phHead,phaseBody);
 const note=document.createElement('p');note.className='gr-moon-note';surface.append(head,status,body,phases,note);card.append(host);
 const s={dialog:d,host,surface,status,body,hero,details,phases,grid,note,cycleLabel,phaseBody,toggle,minusButton:minus,plusButton:plus,autoButton:auto,scaleOutput,sizeSelect,seq:0,map:mapOf(o),timer:null,interval:null,open:true,abort:new AbortController(),hasData:false};o.__grMoon=s;
 const setExpanded=(expanded,persist=false)=>{phases.dataset.expanded=String(expanded);toggle.setAttribute('aria-expanded',String(expanded));phaseBody.inert=!expanded;if(persist)saveLegendHub(o,{moonUi:{...legendHubState(o).config.moonUi,phasesExpanded:expanded}});schedulePlace(o,s);};
 s.setExpanded=setExpanded;s.refreshAppearance=()=>{const pref=legendHubState(o).config.moonUi;applyMoonMaterial(d,pref);s.renderDistance?.();setExpanded(pref.phasesExpanded);schedulePlace(o,s);};s.refreshAppearance();
 toggle.addEventListener('click',()=>setExpanded(toggle.getAttribute('aria-expanded')!=='true',true));
 const setScale=(patch,anchor)=>{const r=anchor?.getBoundingClientRect();s.controlAnchor=r?{element:anchor,x:r.left+r.width/2,y:r.top+r.height/2}:null;saveLegendHub(o,{moonUi:{...legendHubState(o).config.moonUi,...patch}});place(o,s);};
 minus.addEventListener('click',()=>{const pref=legendHubState(o).config.moonUi,base=Math.min(pref.scaleMode==='manual'?pref.scalePercent:125,Math.ceil(s.scale*20-1e-8)*5);setScale({scaleMode:'manual',scalePercent:Math.max(50,base-5)},minus);});
 plus.addEventListener('click',()=>{const pref=legendHubState(o).config.moonUi;setScale({scaleMode:'manual',scalePercent:Math.min(125,(pref.scaleMode==='manual'?pref.scalePercent:Math.round(s.scale*20)*5)+5)},plus);});
 auto.addEventListener('click',()=>setScale({scaleMode:'auto'}));
 sizeSelect.addEventListener('change',()=>setScale(sizeSelect.value==='auto'?{scaleMode:'auto'}:{scaleMode:'manual',scalePercent:Number(sizeSelect.value)}));controls.addEventListener('pointerleave',()=>{s.controlAnchor=null;});
 drag(o,s,head);const options={signal:s.abort.signal};
 // Sibling overlay: stop only its own events; leave map handlers enabled.
 for(const type of ['pointerdown','click','dblclick','wheel','touchstart','touchmove'])d.addEventListener(type,e=>e.stopPropagation(),{...options,passive:type==='wheel'||type.startsWith('touch')});
 d.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();closeMoon(o);}},options);
 function unavailable(message,zoom=false){
  s.hasData=false;s.status.hidden=false;s.body.hidden=true;s.phases.hidden=true;s.note.hidden=true;s.status.dataset.zoom=String(zoom);d.dataset.view=zoom?'zoom':'status';status.replaceChildren();
  if(zoom){const motif=document.createElement('span');motif.className='gr-moon-zoom-image';const image=document.createElement('img');image.src=MOON_HERO;image.alt='';motif.append(image);const strong=document.createElement('strong'),hint=document.createElement('small');strong.textContent=de?'Für aktuelle Zoomstufe nicht verfügbar':'Unavailable at the current zoom level';hint.textContent=de?'Bitte weiter hineinzoomen, um mondbezogene Standortdaten zu sehen.':'Please zoom in to see Moon data for this location.';status.append(motif,strong,hint);}else status.textContent=message;
  place(o,s);
 }
 s.update=async()=>{
  if(!s.open)return;s.cancelRequest?.();clearTimeout(s.requestTimer);const serial=++s.seq,m=mapOf(o);let position=null,zoom;
  try{const center=m?.getCenter?.();position=center?{lat:center.lat,lng:center.lng}:null;zoom=m?.getZoom?.();}catch{} // Persisted window may precede Leaflet readiness.
  if(m&&m!==s.map){s.map?.off('movestart zoomstart',s.invalidate);s.map?.off('moveend zoomend',s.schedule);s.map=m;m.on('movestart zoomstart',s.invalidate);m.on('moveend zoomend',s.schedule);}
  if(!position||!Number.isFinite(position.lat)||!Number.isFinite(position.lng)||!Number.isFinite(zoom)){unavailable(de?'Karte nicht verfügbar':'Map unavailable');if((s.mapWaitAttempts=(s.mapWaitAttempts||0)+1)<=40){clearTimeout(s.timer);s.timer=setTimeout(s.update,250);}return;}
  s.mapWaitAttempts=0;
  if(zoom<MOON_MIN_ZOOM){unavailable('',true);return;}
  if(!s.hasData)unavailable(de?'Monddaten werden geladen …':'Loading Moon data …');
  try{
   if(typeof o.hass?.callWS!=='function')throw Error('WeatherRouter unavailable');
   const timeout=new Promise((_,reject)=>{s.cancelRequest=()=>reject(Error('Moon request superseded'));s.requestTimer=setTimeout(()=>reject(Error('Moon request timeout')),REQUEST_TIMEOUT_MS);});
   const data=await Promise.race([o.hass.callWS({type:'weather_router/consumer/moon',contract_version:1,latitude:position.lat,longitude:normalizeLongitude(position.lng)}),timeout]);
   if(serial!==s.seq||!s.open)return;validate(data,position);
   const zone=data.timezone||'UTC',locale=o._locale?.()||(de?'de-DE':'en-GB'),number=(v,digits=2)=>v.toLocaleString(locale,{maximumFractionDigits:digits,minimumFractionDigits:digits});
   s.details.replaceChildren();row(s.details,'coordinates',de?'Koordinaten':'Coordinates',number(data.latitude,4)+'° · '+number(data.longitude,4)+'°');
   const cycle=document.createElement('div');cycle.textContent=(de?'Tag ':'Day ')+number(data.moon_age_days,1)+(de?' von ':' of ')+number(data.cycle_days,2);
   const line=document.createElement('div');line.className='gr-moon-track-line';const track=document.createElement('div'),fill=document.createElement('div'),percent=document.createElement('span');track.className='gr-moon-track';fill.style.width=(data.cycle_fraction*100)+'%';track.setAttribute('role','meter');track.setAttribute('aria-label',de?'Mondzyklus':'Moon cycle');track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax','100');track.setAttribute('aria-valuenow',String(Math.round(data.cycle_fraction*100)));track.append(fill);percent.textContent=number(data.cycle_fraction*100,0)+' %';line.append(track,percent);cycle.append(line);row(s.details,'cycle',de?'Mondzyklus':'Moon cycle',cycle);
   const phase=phaseName(data.phase,de)+' · '+new Intl.NumberFormat(locale,{style:'percent',minimumFractionDigits:1,maximumFractionDigits:1}).format(data.illumination_percent/100);row(s.details,'phase',de?'Aktuelle Mondphase':'Current Moon phase',phase);
   const absent=de?'Kein Ereignis heute':'No event today';row(s.details,'rise',de?'Mondaufgang':'Moonrise',eventTime(data.moonrise,zone,de,absent));row(s.details,'set',de?'Monduntergang':'Moonset',eventTime(data.moonset,zone,de,absent));
   const next=document.createElement('div');next.textContent=phaseName(data.next_major_phase.phase,de);const nextDate=document.createElement('small');nextDate.className='gr-moon-secondary';nextDate.textContent=new Intl.DateTimeFormat(locale,{timeZone:zone,day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(data.next_major_phase.utc));next.append(nextDate);row(s.details,'calendar',de?'Nächste Hauptphase':'Next major phase',next);
   s.data=data;s.distanceValue=row(s.details,'distance',o._t('legendHub.moonDistance'),'—');
   s.renderDistance=()=>{const text=formatMoonDistance(s.data?.distance_km,legendHubState(o).config.moonUi.distanceUnit,o._distanceUnitValue?.(),o._locale?.()||(de?'de-DE':'en-GB'))||o._t('weather.layer.unavailable');if(s.distanceValue.textContent!==text){s.distanceValue.textContent=text;schedulePlace(o,s);}};s.renderDistance();
   s.hero.src=HERO_IMAGES[data.phase];s.hero.alt=phaseName(data.phase,de);
   for(const tile of s.grid.children)tile.setAttribute('aria-current',String(tile.dataset.phase===data.phase));
   s.cycleLabel.textContent=(de?'Kompletter Zyklus':'Complete cycle')+' ('+number(data.cycle_days)+' '+(de?'Tage':'days')+')';
   s.note.textContent=(de?'Ortszeit zur Kartenmitte: ':'Map center local time: ')+zone+(zone==='UTC'?(de?' · UTC / Fallback':' · UTC / fallback'):'')+' · '+(data.local_date||'');
   s.status.hidden=true;s.status.dataset.zoom='false';s.body.hidden=false;s.phases.hidden=false;s.note.hidden=false;s.hasData=true;d.dataset.view='ready';place(o,s);
  }catch(error){if(serial!==s.seq||!s.open)return;unavailable(de?'Monddaten nicht verfügbar – WeatherRouter prüfen.':'Moon data unavailable – check WeatherRouter.');}
  finally{if(serial===s.seq){clearTimeout(s.requestTimer);s.cancelRequest=null;}}
 };
 s.invalidate=()=>{s.seq++;clearTimeout(s.timer);clearTimeout(s.requestTimer);s.cancelRequest?.();s.cancelRequest=null;};
 s.schedule=()=>{if(!s.open)return;s.invalidate();s.timer=setTimeout(s.update,250);};
 if(s.map?.on){s.map.on('movestart zoomstart',s.invalidate);s.map.on('moveend zoomend',s.schedule);}
 const resize=()=>schedulePlace(o,s);s.contentObserver=new ResizeObserver(resize);s.contentObserver.observe(phaseBody);window.addEventListener('scroll',event=>{if(!event.composedPath().includes(s.host))resize();},{...options,capture:true,passive:true});const windowResize=()=>{s.controlAnchor=null;resize();};s.observer=new ResizeObserver(windowResize);s.observer.observe(o.shadow.getElementById('map'));window.addEventListener('resize',windowResize,options);window.visualViewport?.addEventListener('resize',resize,options);window.visualViewport?.addEventListener('scroll',resize,options);
 s.interval=setInterval(()=>{if(s.open&&!d.ownerDocument.hidden&&!s.cancelRequest)s.schedule();},REFRESH_MS);
 d.ownerDocument.addEventListener('visibilitychange',()=>{if(!d.ownerDocument.hidden)s.schedule();},options);
 place(o,s);s.update();patchLegend(o,'moon',{mode:'on'});o._legendHubStatus?.();
}
