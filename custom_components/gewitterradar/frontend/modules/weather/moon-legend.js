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
export const moonImage=file=>new URL('../../assets/moon/'+file,import.meta.url).href;
export const moonIcon=moonImage(PHASES[4][3]);
export const MOON_MIN_ZOOM=7;
const mapOf=o=>{const m=o._map||o.map;return m?.getCenter&&m?.getZoom?m:null;};
const isDE=o=>String(o._languageValue?.()||'').toLowerCase().startsWith('de');
const name=(id,de)=>{const p=PHASES.find(p=>p[0]===id);return p?p[de?1:2]:'—';};
const time=event=>event?.utc?new Intl.DateTimeFormat(undefined,{timeZone:'UTC',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(event.utc)):'—';
function row(target,label,value){const div=document.createElement('div'),a=document.createElement('span'),b=document.createElement('strong');div.className='gr-moon-row';a.textContent=label;b.textContent=value;div.append(a,b);target.append(div);}
function style(shadow){if(shadow.getElementById('gr-moon-style'))return;const el=document.createElement('style');el.id='gr-moon-style';el.textContent='.gr-moon-dialog{box-sizing:border-box;width:min(760px,calc(100vw - 20px));max-height:calc(100dvh - 20px);overflow:auto;border:3px solid transparent;border-radius:25px;padding:0;color:#eff8ff;background:linear-gradient(145deg,#243f5cf7,#051327fa) padding-box,linear-gradient(125deg,#617b92,#f4fbff 18%,#8aa4ba 31%,#e7f3ff 48%,#4b6079 71%,#e4f6ff 90%,#70889b) border-box;box-shadow:0 25px 70px #000b,inset 0 0 0 2px #f5fbff25;font:14px/1.45 system-ui;backdrop-filter:blur(16px)}.gr-moon-dialog::backdrop{background:#010916ac}.gr-moon-header{display:flex;align-items:center;gap:12px;padding:13px 17px;background:linear-gradient(110deg,#395b77,#0d2039);border-bottom:1px solid #bcd8f17c}.gr-moon-header img{width:46px;height:46px;object-fit:contain}.gr-moon-header h2{margin:0;font-size:21px}.gr-moon-header small{color:#c4d5e5}.gr-moon-header button{margin-left:auto;width:44px;height:44px;min-width:44px;border:1px solid #cfe8ff;border-radius:50%;background:radial-gradient(circle at 30% 20%,#87a5be,#0e233c);color:#fff;font-size:24px;cursor:pointer}.gr-moon-body{display:grid;grid-template-columns:minmax(120px,1fr) minmax(210px,1.3fr);gap:15px;align-items:center;padding:17px}.gr-moon-hero{width:100%;max-width:300px;aspect-ratio:1;object-fit:contain;filter:drop-shadow(0 0 12px #b4d9fa77)}.gr-moon-details{display:grid;gap:6px}.gr-moon-row{display:flex;justify-content:space-between;gap:10px;align-items:baseline;padding:8px 10px;border:1px solid #a9cde066;border-radius:10px;background:#112b4399}.gr-moon-row span{color:#d2e2ef}.gr-moon-row strong{text-align:right;font-variant-numeric:tabular-nums}.gr-moon-track{height:5px;border-radius:9px;background:#4a6980;overflow:hidden}.gr-moon-track div{height:100%;background:linear-gradient(90deg,#7397b9,#f4faff,#97bad2)}.gr-moon-body[hidden],.gr-moon-phases[hidden],.gr-moon-note[hidden],.gr-moon-status[hidden]{display:none!important}.gr-moon-status{text-align:center;padding:20px;color:#dce9f7}.gr-moon-phases{padding:12px;border-top:1px solid #b8d0e35c}.gr-moon-phases h3{font-size:14px;margin:0 0 8px}.gr-moon-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:5px}.gr-moon-tile{min-width:0;padding:6px 2px;text-align:center;border:1px solid transparent;border-radius:11px;font-size:10px;line-height:1.2}.gr-moon-tile img{width:100%;max-width:62px;aspect-ratio:1;object-fit:contain}.gr-moon-tile span{display:block}.gr-moon-tile[aria-current=true]{border-color:#d4edff;box-shadow:0 0 15px #c0e6ff88;background:#94b9d525}.gr-moon-note{font-size:11px;color:#c0d2e0;padding:0 16px 12px;margin:0}@media(max-width:540px){.gr-moon-body{grid-template-columns:1fr;justify-items:center}.gr-moon-hero{max-width:150px}.gr-moon-details{width:100%}.gr-moon-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}@media(prefers-reduced-motion:reduce){.gr-moon-dialog *{animation:none!important;transition:none!important}}';shadow.append(el);}
export const moonOpen=o=>!!o.__grMoon?.dialog?.open;
export const closeMoon=o=>o.__grMoon?.dialog?.close();
export function openMoon(o){
 if(!o.shadow)return;style(o.shadow);
 const de=isDE(o),title=de?'Mond':'Moon',map=mapOf(o);
 let state=o.__grMoon;
 if(state?.dialog.open){state.update();return;}
 if(!state){
  const d=document.createElement('dialog');d.className='gr-moon-dialog';d.setAttribute('aria-label',title);
  const head=document.createElement('header');head.className='gr-moon-header';const badge=document.createElement('img');badge.src=moonIcon;badge.alt='';const names=document.createElement('div'),h=document.createElement('h2'),sub=document.createElement('small');h.textContent=title;sub.textContent=de?'Astronomie zur Kartenmitte':'Astronomy at map center';names.append(h,sub);const x=document.createElement('button');x.type='button';x.textContent='×';x.setAttribute('aria-label',de?'Schließen':'Close');x.addEventListener('click',()=>d.close());head.append(badge,names,x);
  const status=document.createElement('p');status.className='gr-moon-status';status.setAttribute('role','status');
  const body=document.createElement('section');body.className='gr-moon-body';const hero=document.createElement('img');hero.className='gr-moon-hero';hero.src=moonIcon;hero.alt=title;const details=document.createElement('div');details.className='gr-moon-details';body.append(hero,details);
  const phases=document.createElement('section');phases.className='gr-moon-phases';const ph=document.createElement('h3');ph.textContent=de?'Mondphasen':'Moon phases';const grid=document.createElement('div');grid.className='gr-moon-grid';for(const p of PHASES){const tile=document.createElement('div'),image=document.createElement('img'),label=document.createElement('span');tile.className='gr-moon-tile';tile.dataset.phase=p[0];image.src=moonImage(p[3]);image.alt='';label.textContent=p[de?1:2];tile.append(image,label);grid.append(tile);}phases.append(ph,grid);
  const note=document.createElement('p');note.className='gr-moon-note';note.textContent=de?'Uhrzeiten in UTC':'Times in UTC';d.append(head,status,body,phases,note);o.shadow.append(d);
  state={dialog:d,status,body,hero,details,phases,grid,note,seq:0,map:null,timer:null,update:null,schedule:null};o.__grMoon=state;
  d.addEventListener('close',()=>{state.seq++;clearTimeout(state.timer);if(state.map){state.map.off('moveend',state.schedule);state.map.off('zoomend',state.schedule);state.map=null;}o._legendHubRefresh?.();});
 }
 const s=state;
 s.update=async()=>{
  const serial=++s.seq,m=mapOf(o),position=m?.getCenter?.(),zoom=m?.getZoom?.();
  s.status.hidden=false;s.body.hidden=true;s.phases.hidden=true;s.note.hidden=true;
  if(!position||!Number.isFinite(zoom)){s.status.textContent=de?'Karte nicht verfügbar':'Map unavailable';return;}
  if(zoom<MOON_MIN_ZOOM){s.status.textContent=de?'Für diese Zoomstufe nicht verfügbar. Bitte weiter hineinzoomen.':'Unavailable at this zoom level. Please zoom in.';return;}
  s.status.textContent=de?'Monddaten werden geladen …':'Loading Moon data …';
  try{
   if(typeof o.hass?.callWS!=='function')throw Error('WeatherRouter unavailable');
   const data=await o.hass.callWS({type:'weather_router/consumer/moon',contract_version:1,latitude:position.lat,longitude:position.lng,timezone:'UTC'});
   if(serial!==s.seq||!s.dialog.open)return;
   if(data?.schema!=='weather_router.moon.v1'||data?.status!=='ready')throw Error('Moon schema mismatch');
   s.details.replaceChildren();row(s.details,de?'Koordinaten':'Coordinates',Number(data.latitude).toFixed(3)+'°, '+Number(data.longitude).toFixed(3)+'°');
   row(s.details,de?'Phase':'Phase',name(data.phase,de));
   row(s.details,de?'Mondalter / Zyklus':'Age / cycle',Number(data.moon_age_days).toFixed(2)+' / '+Number(data.cycle_days).toFixed(2)+' d');
   const track=document.createElement('div'),fill=document.createElement('div');track.className='gr-moon-track';fill.style.width=(100*Math.max(0,Math.min(1,Number(data.cycle_fraction)||0)))+'%';track.append(fill);s.details.append(track);
   row(s.details,de?'Beleuchtung':'Illumination',Number(data.illumination_percent).toFixed(1)+' %');
   row(s.details,de?'Aufgang':'Moonrise',time(data.moonrise));row(s.details,de?'Untergang':'Moonset',time(data.moonset));
   row(s.details,de?'Nächste Hauptphase':'Next major phase',name(data.next_major_phase?.phase,de)+' · '+time(data.next_major_phase));
   s.hero.src=moonImage((PHASES.find(p=>p[0]===data.phase)||PHASES[4])[3]);
   for(const tile of s.grid.children)tile.setAttribute('aria-current',String(tile.dataset.phase===data.phase));
   s.status.hidden=true;s.body.hidden=false;s.phases.hidden=false;s.note.hidden=false;
  }catch(error){if(serial!==s.seq)return;s.status.textContent=de?'Monddaten nicht verfügbar – WeatherRouter prüfen.':'Moon data unavailable – check WeatherRouter.';console.warn('[Moon Legend]',error);}
 };
 s.schedule=()=>{clearTimeout(s.timer);s.timer=setTimeout(s.update,250);};
 s.dialog.showModal();if(map?.on){s.map=map;map.on('moveend',s.schedule);map.on('zoomend',s.schedule);}s.update();o._legendHubRefresh?.();
}
