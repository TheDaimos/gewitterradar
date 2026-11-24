import {legendHubState,saveLegendHub,patchLegend} from './legend-preferences.js?v=412moon2';
import {PREMIUM_CLOSE} from './premium-ui.js?v=41215r1';
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
const mapOf=o=>{const m=o._map||o.map;return m?.getCenter&&m?.getZoom?m:null;};
const isDE=o=>/^(de|boarisch|platt|sächs|schwäb)/i.test(String(o._languageValue?.()||''));
const name=(id,de)=>{const p=PHASES.find(p=>p[0]===id);return p?p[de?1:2]:'—';};
const time=(event,zone)=>event?.utc?new Intl.DateTimeFormat(undefined,{timeZone:zone,year:'numeric',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(event.utc)):'—';
export const normalizeLongitude=lng=>((lng+180)%360+360)%360-180;
const REFRESH_MS=60000;
const clamp=(n,max)=>Math.max(0,Math.min(max,n));
function bounds(o,s){const card=o.shadow.getElementById('map-card'),map=o.shadow.getElementById('map');if(!card||!map)return null;const a=card.getBoundingClientRect(),b=map.getBoundingClientRect(),sx=a.width/card.offsetWidth||1,sy=a.height/card.offsetHeight||1;return {x:(b.left-a.left)/sx+6,y:(b.top-a.top)/sy+6,w:Math.max(0,b.width/sx-12),h:Math.max(0,b.height/sy-12),sx,sy};}
function place(o,s,p=legendHubState(o).config.extraPositions.moon){const b=bounds(o,s);if(!b)return;s.dialog.style.maxWidth=b.w+'px';s.dialog.style.maxHeight=b.h+'px';const dx=Math.max(0,b.w-s.dialog.offsetWidth),dy=Math.max(0,b.h-s.dialog.offsetHeight);s.dialog.style.left=(b.x+dx*p.x)+'px';s.dialog.style.top=(b.y+dy*p.y)+'px';}
function drag(o,s,head){let start=null;head.addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('button'))return;const b=bounds(o,s);if(!b)return;start={id:e.pointerId,x:e.clientX,y:e.clientY,left:s.dialog.offsetLeft,top:s.dialog.offsetTop};head.setPointerCapture(e.pointerId);e.preventDefault();});head.addEventListener('pointermove',e=>{if(!start||e.pointerId!==start.id)return;const b=bounds(o,s);if(!b)return;s.dialog.style.left=b.x+clamp(start.left-b.x+(e.clientX-start.x)/b.sx,Math.max(0,b.w-s.dialog.offsetWidth))+'px';s.dialog.style.top=b.y+clamp(start.top-b.y+(e.clientY-start.y)/b.sy,Math.max(0,b.h-s.dialog.offsetHeight))+'px';});const end=e=>{if(!start||start.id!==e.pointerId)return;start=null;const b=bounds(o,s);if(!b)return;const p={x:clamp((s.dialog.offsetLeft-b.x)/Math.max(1,b.w-s.dialog.offsetWidth),1),y:clamp((s.dialog.offsetTop-b.y)/Math.max(1,b.h-s.dialog.offsetHeight),1)};saveLegendHub(o,{extraPositions:{...legendHubState(o).config.extraPositions,moon:p}});};head.addEventListener('pointerup',end);head.addEventListener('pointercancel',end);head.addEventListener('lostpointercapture',end);}
function row(target,label,value){const div=document.createElement('div'),a=document.createElement('span'),b=document.createElement('strong');div.className='gr-moon-row';a.textContent=label;b.textContent=value;div.append(a,b);target.append(div);}
function style(shadow){if(shadow.getElementById('gr-moon-style'))return;const el=document.createElement('style');el.id='gr-moon-style';el.textContent='.gr-moon-dialog{box-sizing:border-box;width:min(760px,calc(100vw - 20px));max-height:calc(100dvh - 20px);overflow:auto;border:3px solid transparent;border-radius:25px;padding:0;color:#eff8ff;background:linear-gradient(145deg,#243f5cf7,#051327fa) padding-box,linear-gradient(125deg,#617b92,#f4fbff 18%,#8aa4ba 31%,#e7f3ff 48%,#4b6079 71%,#e4f6ff 90%,#70889b) border-box;box-shadow:0 25px 70px #000b,inset 0 0 0 2px #f5fbff25;font:14px/1.45 system-ui;backdrop-filter:blur(16px)}.gr-moon-dialog::backdrop{background:#010916ac}.gr-moon-header{display:flex;align-items:center;gap:12px;padding:13px 17px;background:linear-gradient(110deg,#395b77,#0d2039);border-bottom:1px solid #bcd8f17c}.gr-moon-header img{width:46px;height:46px;object-fit:contain}.gr-moon-header h2{margin:0;font-size:21px}.gr-moon-header small{color:#c4d5e5}.gr-moon-header button{margin-left:auto;width:44px;height:44px;min-width:44px;border:1px solid #cfe8ff;border-radius:50%;background:radial-gradient(circle at 30% 20%,#87a5be,#0e233c);color:#fff;font-size:24px;cursor:pointer}.gr-moon-body{display:grid;grid-template-columns:minmax(120px,1fr) minmax(210px,1.3fr);gap:15px;align-items:center;padding:17px}.gr-moon-hero{width:100%;max-width:300px;aspect-ratio:1;object-fit:contain;filter:drop-shadow(0 0 12px #b4d9fa77)}.gr-moon-details{display:grid;gap:6px}.gr-moon-row{display:flex;justify-content:space-between;gap:10px;align-items:baseline;padding:8px 10px;border:1px solid #a9cde066;border-radius:10px;background:#112b4399}.gr-moon-row span{color:#d2e2ef}.gr-moon-row strong{text-align:right;font-variant-numeric:tabular-nums}.gr-moon-track{height:5px;border-radius:9px;background:#4a6980;overflow:hidden}.gr-moon-track div{height:100%;background:linear-gradient(90deg,#7397b9,#f4faff,#97bad2)}.gr-moon-body[hidden],.gr-moon-phases[hidden],.gr-moon-note[hidden],.gr-moon-status[hidden]{display:none!important}.gr-moon-status{text-align:center;padding:20px;color:#dce9f7}.gr-moon-phases{padding:12px;border-top:1px solid #b8d0e35c}.gr-moon-phases h3{font-size:14px;margin:0 0 8px}.gr-moon-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:5px}.gr-moon-tile{min-width:0;padding:6px 2px;text-align:center;border:1px solid transparent;border-radius:11px;font-size:10px;line-height:1.2}.gr-moon-tile img{width:100%;max-width:62px;aspect-ratio:1;object-fit:contain}.gr-moon-tile span{display:block}.gr-moon-tile[aria-current=true]{border-color:#d4edff;box-shadow:0 0 15px #c0e6ff88;background:#94b9d525}.gr-moon-note{font-size:11px;color:#c0d2e0;padding:0 16px 12px;margin:0}@media(max-width:540px){.gr-moon-body{grid-template-columns:1fr;justify-items:center}.gr-moon-hero{max-width:150px}.gr-moon-details{width:100%}.gr-moon-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}@media(prefers-reduced-motion:reduce){.gr-moon-dialog *{animation:none!important;transition:none!important}}';el.textContent+=`.gr-moon-dialog{position:absolute;inset:auto;margin:0;z-index:850;width:min(660px,100%);border:3px solid transparent;border-radius:25px;background:radial-gradient(ellipse at 10% 0%,#52708b88,transparent 40%),linear-gradient(150deg,#1d3953f5,#081a30fa 55%,#142d47f5) padding-box,linear-gradient(125deg,#516a80,#f8fdff 12%,#8ba4b9 23%,#eaf8ff 34%,#3e536a 48%,#effbff 62%,#7a95ad 78%,#f8fcff 90%,#526b83) border-box;box-shadow:0 0 0 1px #273c52,0 0 0 2px #c4deef,0 0 0 4px #58768e88,0 8px 28px #000b,inset 0 0 0 1px #e5f5ff9c,inset 0 0 0 4px #6f9bb744;backdrop-filter:blur(14px)}.gr-moon-dialog[hidden]{display:none!important}.gr-moon-header{cursor:grab;touch-action:none;user-select:none;box-shadow:inset 0 1px 1px #f7fbff9c,0 1px 5px #0008}.gr-moon-header:active{cursor:grabbing}.gr-moon-header button{display:grid;place-items:center;padding:0;border:0;background:none}.gr-moon-header button img{width:42px;height:42px}.gr-moon-row{background:linear-gradient(120deg,#46668144,#10263bcc 55%,#29455b55);box-shadow:inset 0 1px #edf8ff22,0 2px 5px #0003;border-color:#9fbfd459}.gr-moon-row span{overflow-wrap:anywhere}.gr-moon-hero{filter:drop-shadow(0 0 13px #b9d9fa66)}.gr-moon-tile[aria-current=true]{background:linear-gradient(155deg,#92b4cc44,#142d48);box-shadow:inset 0 0 0 1px #e6f5ff99,0 0 12px #b4dbff99}.gr-moon-status[data-zoom=true]{margin:14px;padding:14px;border:2px solid #c4d9e9;border-radius:14px;background:linear-gradient(140deg,#38536d,#091d33);box-shadow:0 0 0 1px #6a859c,inset 0 0 0 2px #abcce744}.gr-moon-status[data-zoom=true]::before{content:'☾  ⌕';display:block;font-size:30px;color:#dcefff} @media(max-width:540px){.gr-moon-body{padding:10px;gap:8px}.gr-moon-hero{max-width:120px}.gr-moon-row{padding:5px 8px}.gr-moon-dialog{font-size:12px}}`;shadow.append(el);}
export const moonOpen=o=>!!o.__grMoon?.open;
export function closeMoon(o,persist=true){const s=o.__grMoon;if(!s?.open)return;s.open=false;s.seq++;clearTimeout(s.timer);clearInterval(s.interval);s.observer?.disconnect();if(s.map){s.map.off('moveend',s.schedule);s.map.off('zoomend',s.schedule);s.map=null;}s.dialog.remove();delete o.__grMoon;if(persist)patchLegend(o,'moon',{mode:'off'});o._legendHubStatus?.();}
export function openMoon(o){
 if(!o.shadow)return;style(o.shadow);
 const de=isDE(o),title=de?'Mond':'Moon',map=mapOf(o);
 let state=o.__grMoon;
 if(state?.open)return;
 if(!state){
  const d=document.createElement('section');d.setAttribute('role','region');d.className='gr-moon-dialog';d.setAttribute('aria-label',title);
  const head=document.createElement('header');head.className='gr-moon-header';const badge=document.createElement('img');badge.src=moonIcon;badge.alt='';const names=document.createElement('div'),h=document.createElement('h2'),sub=document.createElement('small');h.textContent=title;sub.textContent=de?'Astronomie zur Kartenmitte':'Astronomy at map center';names.append(h,sub);const x=document.createElement('button');x.type='button';const closeIcon=document.createElement('img');closeIcon.src=PREMIUM_CLOSE;closeIcon.alt='';x.append(closeIcon);x.setAttribute('aria-label',de?'Schließen':'Close');x.addEventListener('click',()=>closeMoon(o));head.append(badge,names,x);
  const status=document.createElement('p');status.className='gr-moon-status';status.setAttribute('role','status');
  const body=document.createElement('section');body.className='gr-moon-body';const hero=document.createElement('img');hero.className='gr-moon-hero';hero.src=moonIcon;hero.alt=title;const details=document.createElement('div');details.className='gr-moon-details';body.append(hero,details);
  const phases=document.createElement('section');phases.className='gr-moon-phases';const ph=document.createElement('h3');ph.textContent=de?'Mondphasen':'Moon phases';const grid=document.createElement('div');grid.className='gr-moon-grid';for(const p of PHASES){const tile=document.createElement('div'),image=document.createElement('img'),label=document.createElement('span');tile.className='gr-moon-tile';tile.dataset.phase=p[0];image.src=moonImage(p[3]);image.alt='';label.textContent=p[de?1:2];tile.append(image,label);grid.append(tile);}phases.append(ph,grid);
  const note=document.createElement('p');note.className='gr-moon-note';note.textContent=de?'Uhrzeiten in UTC':'Times in UTC';d.append(head,status,body,phases,note);const card=o.shadow.getElementById('map-card');if(!card)return;card.append(d);
  state={dialog:d,status,body,hero,details,phases,grid,note,seq:0,map:null,timer:null,interval:null,open:true,update:null,schedule:null};o.__grMoon=state;
  drag(o,state,head);d.addEventListener('keydown',e=>{if(e.key==='Escape')closeMoon(o);});
 }
 const s=state;
 s.update=async()=>{
  if(!s.open)return;const serial=++s.seq,m=mapOf(o),position=m?.getCenter?.(),zoom=m?.getZoom?.();
  s.status.hidden=false;s.status.dataset.zoom='false';s.body.hidden=true;s.phases.hidden=true;s.note.hidden=true;
  if(!position||!Number.isFinite(zoom)){s.status.textContent=de?'Karte nicht verfügbar':'Map unavailable';return;}
  if(zoom<MOON_MIN_ZOOM){s.status.dataset.zoom='true';s.status.textContent=de?'Für diese Zoomstufe nicht verfügbar. Bitte weiter hineinzoomen.':'Unavailable at this zoom level. Please zoom in.';return;}
  s.status.textContent=de?'Monddaten werden geladen …':'Loading Moon data …';
  try{
   if(typeof o.hass?.callWS!=='function')throw Error('WeatherRouter unavailable');
   const data=await o.hass.callWS({type:'weather_router/consumer/moon',contract_version:1,latitude:position.lat,longitude:normalizeLongitude(position.lng)});
   if(serial!==s.seq||!s.open)return;
   if(data?.schema!=='weather_router.moon.v1'||data?.status!=='ready')throw Error('Moon schema mismatch');
   const zone=data.timezone||'UTC';s.note.textContent=(de?'Ortszeit: ':'Local time: ')+zone+(zone==='UTC'?(de?' (UTC-Fallback)':' (UTC fallback)'):'');s.details.replaceChildren();row(s.details,de?'Koordinaten':'Coordinates',Number(data.latitude).toFixed(3)+'°, '+Number(data.longitude).toFixed(3)+'°');
   row(s.details,de?'Phase':'Phase',name(data.phase,de));
   row(s.details,de?'Mondalter / Zyklus':'Age / cycle',Number(data.moon_age_days).toFixed(2)+' / '+Number(data.cycle_days).toFixed(2)+' d');
   const track=document.createElement('div'),fill=document.createElement('div');track.className='gr-moon-track';fill.style.width=(100*Math.max(0,Math.min(1,Number(data.cycle_fraction)||0)))+'%';track.append(fill);s.details.append(track);
   row(s.details,de?'Beleuchtung':'Illumination',Number(data.illumination_percent).toFixed(1)+' %');
   row(s.details,de?'Aufgang':'Moonrise',time(data.moonrise,zone));row(s.details,de?'Untergang':'Moonset',time(data.moonset,zone));
   row(s.details,de?'Nächste Hauptphase':'Next major phase',name(data.next_major_phase?.phase,de)+' · '+time(data.next_major_phase,zone));
   s.hero.src=moonImage((PHASES.find(p=>p[0]===data.phase)||PHASES[4])[3]);
   for(const tile of s.grid.children)tile.setAttribute('aria-current',String(tile.dataset.phase===data.phase));
   s.status.hidden=true;s.body.hidden=false;s.phases.hidden=false;s.note.hidden=false;place(o,s);
  }catch(error){if(serial!==s.seq||!s.open)return;s.status.textContent=de?'Monddaten nicht verfügbar – WeatherRouter prüfen.':'Moon data unavailable – check WeatherRouter.';console.warn('[Moon Legend]',error);}
 };
 s.schedule=()=>{if(!s.open)return;s.seq++;clearTimeout(s.timer);s.timer=setTimeout(s.update,250);};
 place(o,s);s.observer=new ResizeObserver(()=>place(o,s));s.observer.observe(o.shadow.getElementById('map'));s.interval=setInterval(()=>{if(s.open&&!s.dialog.ownerDocument.hidden)s.schedule();},REFRESH_MS);if(map?.on){s.map=map;map.on('moveend',s.schedule);map.on('zoomend',s.schedule);}s.update();patchLegend(o,'moon',{mode:'on'});o._legendHubStatus?.();
}
