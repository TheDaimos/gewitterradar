import {legendHubState,saveLegendHub,patchLegend} from './legend-preferences.js?v=41216r1';

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
export const normalizeLongitude=lng=>((lng+180)%360+360)%360-180;
const clamp=(n,max)=>Math.max(0,Math.min(max,n));
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
const icons={close:'<path d="M6 6l12 12M18 6 6 18"/>',coordinates:'<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 1v4m0 14v4M1 12h4m14 0h4"/>',cycle:'<path d="M20 8a8 8 0 1 0 0 8M20 3v5h-5"/>',phase:'<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor"/>',rise:'<path d="M2 20h20M5 17a7 7 0 0 1 14 0M12 12V2m-4 4 4-4 4 4"/>',set:'<path d="M2 20h20M5 17a7 7 0 0 1 14 0M12 2v10m-4-4 4 4 4-4"/>',calendar:'<rect x="3" y="5" width="18" height="17" rx="2"/><path d="M3 10h18M7 2v6m10-6v6"/>'};
function icon(type){const el=document.createElementNS('http://www.w3.org/2000/svg','svg');el.setAttribute('viewBox','0 0 24 24');el.setAttribute('fill','none');el.setAttribute('stroke','currentColor');el.setAttribute('stroke-width','1.5');el.setAttribute('aria-hidden','true');el.innerHTML=icons[type]||icons.phase;return el;}
function bounds(o){
 const card=o.shadow.getElementById('map-card'),map=o.shadow.getElementById('map');if(!card||!map)return null;
 const a=card.getBoundingClientRect(),b=map.getBoundingClientRect(),win=card.ownerDocument.defaultView,v=win.visualViewport;
 const sx=a.width/card.offsetWidth||1,sy=a.height/card.offsetHeight||1;
 const left=Math.max(b.left,v?.offsetLeft||0)+8,top=Math.max(b.top,v?.offsetTop||0)+8;
 const right=Math.min(b.right,(v?.offsetLeft||0)+(v?.width||win.innerWidth))-8,bottom=Math.min(b.bottom,(v?.offsetTop||0)+(v?.height||win.innerHeight))-8;
 return {x:(left-a.left)/sx,y:(top-a.top)/sy,w:Math.max(0,(right-left)/sx),h:Math.max(0,(bottom-top)/sy),sx,sy};
}
function place(o,s,p=legendHubState(o).config.extraPositions.moon){
 const b=bounds(o);if(!b||!s.open)return;
 s.dialog.style.maxWidth=b.w+'px';s.dialog.style.maxHeight=Math.max(120,b.h-(b.h<900?56:0))+'px';
 // Preserve a usable map strip on small viewports; scale the wide composition
 // before falling back to the scrollable phone layout.
 s.dialog.style.width=s.dialog.dataset.view!=='zoom'&&b.w>700&&b.h>=600&&b.h<900?Math.min(900,b.w,b.h*1.2)+'px':'';
 s.dialog.style.left=(b.x+Math.max(0,b.w-s.dialog.offsetWidth)*p.x)+'px';
 s.dialog.style.top=(b.y+Math.max(0,b.h-s.dialog.offsetHeight)*p.y)+'px';
}
function drag(o,s,head){
 let start=null;const options={signal:s.abort.signal};
 head.addEventListener('pointerdown',e=>{
  if(e.button!==0||e.target.closest('button')||start)return;const b=bounds(o);if(!b)return;
  start={id:e.pointerId,x:e.clientX,y:e.clientY,left:s.dialog.offsetLeft,top:s.dialog.offsetTop};
  if(head.hasPointerCapture?.(e.pointerId)===false)try{head.setPointerCapture(e.pointerId);}catch{} // Synthetic events cannot capture.
  e.preventDefault();e.stopPropagation();
 },options);
 head.addEventListener('pointermove',e=>{
  if(!start||e.pointerId!==start.id)return;const b=bounds(o);if(!b)return;
  s.dialog.style.left=b.x+clamp(start.left-b.x+(e.clientX-start.x)/b.sx,Math.max(0,b.w-s.dialog.offsetWidth))+'px';
  s.dialog.style.top=b.y+clamp(start.top-b.y+(e.clientY-start.y)/b.sy,Math.max(0,b.h-s.dialog.offsetHeight))+'px';
  e.preventDefault();
 },options);
 const end=e=>{
  if(!start||start.id!==e.pointerId)return;const id=start.id;start=null;
  if(head.hasPointerCapture?.(id))head.releasePointerCapture(id);
  const b=bounds(o);if(!b||!s.open)return;
  const p={x:clamp((s.dialog.offsetLeft-b.x)/Math.max(1,b.w-s.dialog.offsetWidth),1),y:clamp((s.dialog.offsetTop-b.y)/Math.max(1,b.h-s.dialog.offsetHeight),1)};
  saveLegendHub(o,{extraPositions:{...legendHubState(o).config.extraPositions,moon:p}});
 };
 for(const type of ['pointerup','pointercancel','lostpointercapture'])head.addEventListener(type,end,options);
}
function style(shadow){
 if(shadow.getElementById('gr-moon-style'))return;const el=document.createElement('style');el.id='gr-moon-style';el.textContent=`
.gr-moon-dialog{position:absolute;inset:auto;margin:0;z-index:2147483647;box-sizing:border-box;width:min(1004px,100%);padding:5px;border:2px solid #d8dce8;border-radius:50px;color:#f4f3fc;background:linear-gradient(135deg,#fcfcff 0%,#565e72 6%,#f3f1ff 17%,#797e90 29%,#e3e9f8 49%,#50586e 68%,#fff 86%,#8d92a9 96%) border-box;box-shadow:0 0 0 1px #4e586d,0 0 0 3px #c6c8d580,0 15px 48px #0009,0 0 24px #d8e2ff20;font:18px/1.4 system-ui,sans-serif;isolation:isolate;container-type:inline-size;overflow:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#b9c2db #181d30}
.gr-moon-dialog::before{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:2;background:radial-gradient(ellipse 100px 5px at 13% 1px,#fff,transparent),radial-gradient(ellipse 180px 5px at 79% 1px,#fff,transparent),radial-gradient(ellipse 5px 65px at 1px 14%,#fff,transparent)}
.gr-moon-surface{position:relative;border:1px solid #e0e4f2a6;border-radius:42px;overflow:clip;background:radial-gradient(ellipse at 15% 0%,#bcc7e12c,transparent 47%),linear-gradient(132deg,#242a3dea,#0b1021ed 62%,#34394fe8);box-shadow:inset 0 0 0 2px #4e566e,inset 0 0 24px #c4ccec30;backdrop-filter:blur(22px) saturate(.85)}
.gr-moon-header{backdrop-filter:blur(22px);position:sticky;top:0;z-index:3;display:flex;align-items:center;gap:20px;padding:19px 25px 15px 37px;border-bottom:1px solid #d6d9edaa;background:linear-gradient(120deg,#a7afc631,#34384b47 45%,#858da13a);box-shadow:inset 0 1px #fff7,0 1px 5px #0008;cursor:grab;touch-action:none;user-select:none}
.gr-moon-header:active{cursor:grabbing}.gr-moon-badge{display:grid;place-items:center;flex:none;width:76px;height:72px;border:1px solid #d3d4e7b3;border-radius:18px;background:linear-gradient(140deg,#c8c9de8c,#4e52685c 50%,#b0afc24d);box-shadow:inset 0 1px 4px #fff9,0 4px 12px #0004}.gr-moon-badge img{width:62px;height:62px;object-fit:contain}.gr-moon-header h2{font:40px/1.1 Georgia,serif;letter-spacing:.01em;margin:0 0 7px;text-shadow:0 2px 3px #0008}.gr-moon-header small{display:block;font-size:12px;letter-spacing:.38em;text-transform:uppercase;color:#d5d7e7}.gr-moon-header button{display:grid;place-items:center;flex:none;margin-left:auto;padding:0;width:46px;height:46px;border:1px solid #d3d7e1a6;border-radius:50%;background:linear-gradient(135deg,#d2d7e52b,#151a2b7d);box-shadow:inset 0 1px 3px #fff5,0 2px 10px #0005;color:#f3f3fc;cursor:pointer}.gr-moon-header button svg{width:27px;height:27px;filter:drop-shadow(0 1px 2px #0008)}.gr-moon-header button:focus-visible{outline:2px solid #fff;outline-offset:4px}
.gr-moon-body{display:grid;grid-template-columns:minmax(0,.95fr) minmax(0,1.1fr);gap:13px;align-items:center;padding:25px 16px 24px 20px}.gr-moon-hero{display:block;width:100%;aspect-ratio:1;object-fit:contain;filter:drop-shadow(0 0 15px #c1d3ff40)}.gr-moon-details{display:grid;gap:6px;min-width:0}.gr-moon-row{display:grid;grid-template-columns:31px minmax(0,.95fr) minmax(0,1fr);align-items:center;gap:14px;padding:11px 13px;border:1px solid #b9c1d026;border-left-color:#b9c1d04a;border-radius:16px;background:linear-gradient(115deg,#9aa2b32c,#1518268c 72%,#5b647c15);box-shadow:inset 0 1px #fff1,0 2px 4px #0002}.gr-moon-row svg{width:28px;height:28px;color:#e8eaf4}.gr-moon-row span{font-size:17px;overflow-wrap:anywhere}.gr-moon-row strong{font-size:18px;font-weight:500;min-width:0;overflow-wrap:anywhere;font-variant-numeric:tabular-nums}.gr-moon-row[data-row=phase] strong,.gr-moon-row[data-row=calendar] strong{font-weight:600}.gr-moon-secondary{display:block;font-weight:400;font-size:.86em;color:#d5d8e5;margin-top:2px}.gr-moon-track-line{display:flex;align-items:center;gap:10px;margin-top:6px;font-size:13px}.gr-moon-track{flex:1;height:9px;border:1px solid #d6d9e56b;border-radius:10px;background:#ffffff12;box-shadow:inset 0 1px 3px #0008;overflow:hidden}.gr-moon-track div{height:100%;border-radius:inherit;background:linear-gradient(#f8f9ff,#959daf 60%,#f7f7ff);box-shadow:0 0 9px #e2ebff8c}
.gr-moon-phases{margin:0 10px 8px;border:1px solid #b9c2db55;border-radius:27px;background:linear-gradient(155deg,#a0aec21c,#1115244a 60%,#8699be17);box-shadow:inset 0 1px #e9edff1a,0 2px 8px #0002;overflow:hidden}.gr-moon-phases-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:15px 22px;border-bottom:1px solid #d5dbeb70}.gr-moon-phases h3{display:flex;align-items:center;gap:15px;margin:0;font-size:16px;font-weight:400;letter-spacing:.28em;text-transform:uppercase}.gr-moon-phases h3 svg{width:25px;height:25px}.gr-moon-cycle-label{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#e5e6f0;text-align:right}.gr-moon-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:5px;padding:14px 12px 10px}.gr-moon-tile{min-width:0;padding:5px 2px 12px;text-align:center;border:1px solid transparent;border-radius:19px;font-size:14px;line-height:1.3}.gr-moon-tile img{display:block;width:100%;aspect-ratio:1;object-fit:contain;margin-bottom:7px}.gr-moon-tile span{display:block;overflow-wrap:anywhere}.gr-moon-tile[aria-current=true]{border-color:#e1e3f7;background:linear-gradient(145deg,#b8bddc36,#42486039 60%,#9699b322);box-shadow:inset 0 0 0 1px #cbd0ef33,inset 0 0 16px #cad5ff2e,0 0 12px #b5cbff5c;position:relative}.gr-moon-tile[aria-current=true]::after{content:'';position:absolute;bottom:-1px;left:25%;right:25%;height:2px;background:linear-gradient(90deg,transparent,#fff,transparent);box-shadow:0 0 7px #fff}
.gr-moon-note{font-size:11px;color:#c7cdde;text-align:center;padding:0 20px 11px;margin:0}.gr-moon-status{padding:26px;text-align:center;white-space:pre-line;color:#dde0ee}.gr-moon-status img{display:block;width:170px;height:170px;object-fit:contain;margin:5px auto 16px}.gr-moon-status strong{display:block;font:28px/1.2 Georgia,serif;font-weight:400;margin:0 auto 16px;max-width:290px}.gr-moon-status small{display:block;font-size:16px;max-width:290px;margin:auto;line-height:1.5;color:#cbd0e0}.gr-moon-dialog[data-view=zoom]{width:345px;border-radius:36px}.gr-moon-dialog[data-view=zoom] .gr-moon-surface{border-radius:29px}.gr-moon-dialog[data-view=zoom] .gr-moon-header{padding:12px 16px;gap:12px}.gr-moon-dialog[data-view=zoom] .gr-moon-badge{display:none}.gr-moon-dialog[data-view=zoom] h2{font-size:24px;margin:0}.gr-moon-dialog[data-view=zoom] .gr-moon-header small{display:none}.gr-moon-dialog[data-view=zoom] .gr-moon-status{padding:15px 22px 30px}.gr-moon-zoom-image{position:relative;display:block;width:180px;margin:auto}.gr-moon-zoom-image::after{content:'⌕';position:absolute;right:3px;bottom:4px;border:1px solid #e8eafa;border-radius:50%;width:50px;height:50px;line-height:46px;font-size:44px;background:#3c4150bd;box-shadow:inset 0 1px 4px #fff5}
.gr-moon-dialog[hidden],.gr-moon-body[hidden],.gr-moon-phases[hidden],.gr-moon-note[hidden],.gr-moon-status[hidden]{display:none!important}
@container(max-width:900px){.gr-moon-header{padding:16px 22px;gap:15px}.gr-moon-header h2{font-size:32px}.gr-moon-header small{letter-spacing:.25em}.gr-moon-badge{width:60px;height:60px}.gr-moon-badge img{width:52px;height:52px}.gr-moon-body{grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);padding:16px 12px;gap:8px}.gr-moon-row{gap:8px;padding:9px 10px;grid-template-columns:24px minmax(0,.9fr) minmax(0,1fr)}.gr-moon-row svg{width:23px;height:23px}.gr-moon-row span{font-size:14px}.gr-moon-row strong{font-size:15px}.gr-moon-tile{font-size:12px}.gr-moon-phases h3{font-size:13px}.gr-moon-cycle-label{font-size:9px}}
@container(max-width:540px){.gr-moon-header{padding:13px 14px;gap:12px}.gr-moon-header h2{font-size:30px}.gr-moon-header small{font-size:9px;letter-spacing:.22em}.gr-moon-badge{width:50px;height:50px;border-radius:13px}.gr-moon-badge img{width:43px;height:43px}.gr-moon-header button{width:42px;height:42px}.gr-moon-body{grid-template-columns:1fr;gap:4px;padding:9px 10px 14px}.gr-moon-hero{width:min(66%,230px);margin:auto}.gr-moon-details{width:100%;gap:5px}.gr-moon-row{padding:8px 9px;border-radius:12px;grid-template-columns:23px minmax(0,.9fr) minmax(0,1fr)}.gr-moon-row span{font-size:13px}.gr-moon-row strong{font-size:14px}.gr-moon-phases{margin:0 7px 8px;border-radius:19px}.gr-moon-phases-head{padding:12px 10px}.gr-moon-phases h3{font-size:11px;letter-spacing:.18em;gap:6px}.gr-moon-cycle-label{font-size:8px;max-width:110px}.gr-moon-grid{grid-template-columns:repeat(4,minmax(0,1fr));padding:8px;gap:5px}.gr-moon-tile{font-size:11px;padding:3px 1px 8px;border-radius:13px}.gr-moon-note{font-size:10px}}
@media(prefers-reduced-motion:reduce){.gr-moon-dialog,.gr-moon-dialog *{animation:none!important;transition:none!important}}
`;shadow.append(el);
}
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
export const moonOpen=o=>!!o.__grMoon?.open;
export function closeMoon(o,persist=true){
 const s=o.__grMoon;if(!s?.open)return;s.open=false;s.seq++;clearTimeout(s.timer);clearTimeout(s.requestTimer);s.cancelRequest?.();clearInterval(s.interval);s.abort.abort();s.observer?.disconnect();
 if(s.map){s.map.off('movestart zoomstart',s.invalidate);s.map.off('moveend zoomend',s.schedule);s.map=null;}
 s.dialog.remove();delete o.__grMoon;if(persist)patchLegend(o,'moon',{mode:'off'});o._legendHubStatus?.();
}
export function openMoon(o){
 if(!o.shadow||moonOpen(o))return;const card=o.shadow.getElementById('map-card');if(!card)return;style(o.shadow);
 const de=isDE(o),title=de?'Mond':'Moon',d=document.createElement('section');d.className='gr-moon-dialog';d.setAttribute('role','region');d.setAttribute('aria-label',title);
 const surface=document.createElement('div');surface.className='gr-moon-surface';d.append(surface);
 const head=document.createElement('header');head.className='gr-moon-header';const badge=document.createElement('div');badge.className='gr-moon-badge';const badgeImage=document.createElement('img');badgeImage.src=moonIcon;badgeImage.alt='';badge.append(badgeImage);
 const names=document.createElement('div'),h=document.createElement('h2'),sub=document.createElement('small');h.textContent=title;sub.textContent=de?'Legende · Astronomie':'Legend · Astronomy';names.append(h,sub);
 const x=document.createElement('button');x.type='button';const closeIcon=icon('close');x.append(closeIcon);x.setAttribute('aria-label',de?'Schließen':'Close');x.addEventListener('click',()=>closeMoon(o));head.append(badge,names,x);
 const status=document.createElement('div');status.className='gr-moon-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 const body=document.createElement('section');body.className='gr-moon-body';const hero=document.createElement('img');hero.className='gr-moon-hero';hero.src=MOON_HERO;hero.alt=title;const details=document.createElement('div');details.className='gr-moon-details';body.append(hero,details);
 const phases=document.createElement('section');phases.className='gr-moon-phases';const phHead=document.createElement('div');phHead.className='gr-moon-phases-head';const ph=document.createElement('h3');ph.append(icon('phase'),document.createTextNode(de?'Mondphasen':'Moon phases'));const cycleLabel=document.createElement('span');cycleLabel.className='gr-moon-cycle-label';const grid=document.createElement('div');grid.className='gr-moon-grid';
 for(const p of PHASES){const tile=document.createElement('div'),image=document.createElement('img'),label=document.createElement('span');tile.className='gr-moon-tile';tile.dataset.phase=p[0];image.src=moonImage(p[3]);image.alt='';label.textContent=p[de?1:2];tile.append(image,label);grid.append(tile);}phHead.append(ph,cycleLabel);phases.append(phHead,grid);
 const note=document.createElement('p');note.className='gr-moon-note';surface.append(head,status,body,phases,note);card.append(d);
 const s={dialog:d,status,body,hero,details,phases,grid,note,cycleLabel,seq:0,map:mapOf(o),timer:null,interval:null,open:true,abort:new AbortController(),hasData:false};o.__grMoon=s;
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
  if(!s.open)return;s.cancelRequest?.();clearTimeout(s.requestTimer);const serial=++s.seq,m=mapOf(o),center=m?.getCenter?.(),position=center?{lat:center.lat,lng:center.lng}:null,zoom=m?.getZoom?.();
  if(!position||!Number.isFinite(position.lat)||!Number.isFinite(position.lng)||!Number.isFinite(zoom)){unavailable(de?'Karte nicht verfügbar':'Map unavailable');return;}
  if(zoom<MOON_MIN_ZOOM){unavailable('',true);return;}
  if(!s.hasData)unavailable(de?'Monddaten werden geladen …':'Loading Moon data …');
  try{
   if(typeof o.hass?.callWS!=='function')throw Error('WeatherRouter unavailable');
   const timeout=new Promise((_,reject)=>{s.cancelRequest=()=>reject(Error('Moon request superseded'));s.requestTimer=setTimeout(()=>reject(Error('Moon request timeout')),REQUEST_TIMEOUT_MS);});
   const data=await Promise.race([o.hass.callWS({type:'weather_router/consumer/moon',contract_version:1,latitude:position.lat,longitude:normalizeLongitude(position.lng)}),timeout]);
   if(serial!==s.seq||!s.open)return;validate(data,position);
   const zone=data.timezone||'UTC',locale=de?'de-DE':'en-GB',number=(v,digits=2)=>v.toLocaleString(locale,{maximumFractionDigits:digits,minimumFractionDigits:digits});
   s.details.replaceChildren();row(s.details,'coordinates',de?'Koordinaten':'Coordinates',number(data.latitude,4)+'° · '+number(data.longitude,4)+'°');
   const cycle=document.createElement('div');cycle.textContent=(de?'Tag ':'Day ')+number(data.moon_age_days,1)+(de?' von ':' of ')+number(data.cycle_days,2);
   const line=document.createElement('div');line.className='gr-moon-track-line';const track=document.createElement('div'),fill=document.createElement('div'),percent=document.createElement('span');track.className='gr-moon-track';fill.style.width=(data.cycle_fraction*100)+'%';track.setAttribute('role','meter');track.setAttribute('aria-label',de?'Mondzyklus':'Moon cycle');track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax','100');track.setAttribute('aria-valuenow',String(Math.round(data.cycle_fraction*100)));track.append(fill);percent.textContent=number(data.cycle_fraction*100,0)+' %';line.append(track,percent);cycle.append(line);row(s.details,'cycle',de?'Mondzyklus':'Moon cycle',cycle);
   const phase=document.createElement('div');phase.textContent=phaseName(data.phase,de);const illumination=document.createElement('small');illumination.className='gr-moon-secondary';illumination.textContent=number(data.illumination_percent,1)+' % '+(de?'beleuchtet':'illuminated');phase.append(illumination);row(s.details,'phase',de?'Aktuelle Mondphase':'Current Moon phase',phase);
   const absent=de?'Kein Ereignis heute':'No event today';row(s.details,'rise',de?'Mondaufgang':'Moonrise',eventTime(data.moonrise,zone,de,absent));row(s.details,'set',de?'Monduntergang':'Moonset',eventTime(data.moonset,zone,de,absent));
   const next=document.createElement('div');next.textContent=phaseName(data.next_major_phase.phase,de);const nextDate=document.createElement('small');nextDate.className='gr-moon-secondary';nextDate.textContent=new Intl.DateTimeFormat(locale,{timeZone:zone,day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(data.next_major_phase.utc));next.append(nextDate);row(s.details,'calendar',de?'Nächste Hauptphase':'Next major phase',next);
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
 const resize=()=>place(o,s);s.observer=new ResizeObserver(resize);s.observer.observe(o.shadow.getElementById('map'));window.addEventListener('resize',resize,options);window.visualViewport?.addEventListener('resize',resize,options);window.visualViewport?.addEventListener('scroll',resize,options);
 s.interval=setInterval(()=>{if(s.open&&!d.ownerDocument.hidden&&!s.cancelRequest)s.schedule();},REFRESH_MS);
 d.ownerDocument.addEventListener('visibilitychange',()=>{if(!d.ownerDocument.hidden)s.schedule();},options);
 place(o,s);s.update();patchLegend(o,'moon',{mode:'on'});o._legendHubStatus?.();
}
