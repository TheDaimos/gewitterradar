import { defineModule } from '../core/runtime.js?v=41114r1';
import { WIND_COLORS,WIND_STORAGE,WIND_SPEED,WIND_DIRECTION,readWindConfig,normalizeWindConfig,combineWindPoint,windQueryPoints,windSpeedText } from './wind-data.js?v=411150r1';
import { WindCanvas } from './wind-canvas.js?v=411150r1';
import { createWindLegend,updateWindLegend } from './wind-legend.js?v=411150r1';

export const MODULE_META=Object.freeze({id:'weather.wind-display',version:'0.1.1',group:'Weather-Engine',function:'Konfigurierbare WR-Windpunktdarstellung',subfunctions:['Windfahnen','Richtungspfeile','lokale Strömungssegmente','persistente Symbolfarben','Premium-Windlegende','datenabhängige Grenzen'],file:'modules/weather/wind-display.js'});
const MODES={barbs:'Klassische Windfahnen',arrows:'Statische Windrichtungspfeile',animated:'Animierte Windströmung'};
const INFO_URL=new URL('../../assets/gewitterradar-help-info-premium-v1.webp', import.meta.url).href;
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const installWeatherWind=defineModule(MODULE_META,()=>({
 _weatherWindState(){return this.__weatherWind||(this.__weatherWind={config:readWindConfig(),points:[],status:'Aus',errors:[],map:null,painter:null,batch:null,pending:false,generation:0,timer:null,refreshTimer:null,legend:null,legendOpen:false,metrics:null,suspended:false,requests:0});},
 _weatherWindSave(){try{localStorage.setItem(WIND_STORAGE,JSON.stringify(this._weatherWindState().config));}catch(_){}},
 _weatherWindMenuMarkup(){return '<button type="button" class="weather-layer-action" data-weather-layer-action="wind-settings"><strong>Winddarstellung</strong><small>Windfahnen · Pfeile · lokale Strömung</small></button>';},
 _weatherWindSet(patch){
  const s=this._weatherWindState(),was=s.config.enabled;
  s.config=normalizeWindConfig({...s.config,...patch});this._weatherWindSave();
  if(s.config.enabled){this._resumeWeatherWind();s.painter?.update(s.points,s.config);if(!was)this._weatherWindQueue();}
  else{this._weatherWindDetach();s.status='Aus';}
  this._weatherWindRender();if(s.legend)updateWindLegend(s.legend,this);
 },
 _weatherWindEnsureUi(){
  const card=this.shadow?.getElementById('map-card');if(!card)return null;
  if(!this.shadow.getElementById('weather-wind-style')){
   const style=document.createElement('style');style.id='weather-wind-style';style.textContent=`
   .weather-wind-panel{position:absolute;z-index:720;top:12px;right:12px;width:min(410px,calc(100% - 24px));max-height:calc(100% - 24px);overflow:auto;box-sizing:border-box;border:1px solid #cda85e88;border-radius:14px;padding:12px;background:linear-gradient(145deg,#121923f5,#080d14f7);box-shadow:0 14px 36px #0009;color:#e4e9ef;font:12px/1.45 system-ui;overscroll-behavior:contain;touch-action:pan-y}
   .weather-wind-panel[hidden]{display:none}.weather-wind-panel header{display:flex;align-items:center;gap:8px;color:#f1d38a;margin-bottom:10px}.weather-wind-panel header strong{flex:1}.weather-wind-panel button,.weather-wind-panel select{font:inherit;color:inherit;border:1px solid #b5985a66;background:#141e2a;border-radius:7px;padding:7px;cursor:pointer}.weather-wind-panel button:focus-visible,.weather-wind-panel select:focus-visible{outline:2px solid #f1d38a}.weather-wind-panel label{display:flex;justify-content:space-between;align-items:center;gap:8px;margin:9px 0}.weather-wind-panel select{max-width:65%;min-width:0}.weather-wind-note{font-size:11px;color:#bac6d4;overflow-wrap:anywhere;margin:7px 0}.weather-wind-swatches{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:6px}.weather-wind-panel .weather-wind-swatch{height:30px;padding:4px;border-width:2px}.weather-wind-swatch i{display:block;height:9px;border-radius:3px;background:var(--wind-color)}.weather-wind-swatch[aria-pressed=true]{border-color:#f4d791;box-shadow:0 0 7px #d9a74488}.weather-wind-panel fieldset{margin:10px 0;padding:8px;border:1px solid #a5885355;border-radius:8px;min-width:0}.weather-wind-panel legend{color:#dfc081}.weather-wind-panel input[type=range]{width:42%;min-width:0}.weather-wind-panel details{margin-top:10px}.weather-wind-points{font-size:11px;overflow-wrap:anywhere}.weather-wind-panel img{display:block;width:24px;height:24px;object-fit:contain}.weather-wind-canvas{position:absolute;left:0;top:0;z-index:440;pointer-events:none;filter:none;opacity:1}.weather-wind-panel :disabled{opacity:.5;cursor:default}@media(max-width:430px){.weather-wind-panel{font-size:11px;padding:10px}.weather-wind-panel select{max-width:61%;font-size:11px}.weather-wind-swatches{gap:4px}}
   `;style.textContent+='.weather-wind-panel{z-index:2147483644}#weather-wind-legend-overlay{z-index:2147483644}.weather-wind-panel.embedded{position:static;z-index:auto;width:100%;max-height:none;padding:5px 0;border:0;box-shadow:none;background:transparent;overflow:visible}.weather-wind-panel.embedded [data-wind-action=close]{display:none}.weather-wind-panel.embedded header{margin-top:5px}.weather-wind-panel.embedded select{max-width:65%}';this.shadow.append(style);
  }
  let panel=this.shadow.getElementById('weather-wind-panel');
  if(!panel){panel=document.createElement('section');panel.id='weather-wind-panel';panel.className='weather-wind-panel gr-premium-metal-surface';panel.hidden=true;panel.setAttribute('role','region');panel.setAttribute('aria-label','Winddarstellung');card.append(panel);
   panel.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;event.stopPropagation();
    if(button.dataset.windColor)this._weatherWindSet({color:button.dataset.windColor});
    if(button.dataset.windAction==='close'){panel.hidden=true;this.__windOpener?.focus?.();}
    if(button.dataset.windAction==='refresh')this._weatherWindQueue({force:true});
    if(button.dataset.windAction==='legend'){const s=this._weatherWindState();s.legendOpen=!s.legendOpen;s.legend||=createWindLegend(this);updateWindLegend(s.legend,this);if(s.legendOpen){panel.hidden=true;if(panel.classList.contains('embedded'))this._weatherDisplayPatch?.({enabled:false});}}
   });
   panel.addEventListener('change',event=>{const node=event.target,key=node.dataset.windSetting;if(!key)return;event.stopPropagation();const value=node.type==='checkbox'?node.checked:key==='fieldOpacity'?Number(node.value):node.value;
    this._weatherWindSet({[key]:value,...(key==='mode'&&value==='animated'?{animationExplicit:true}:{})});
   });
   panel.addEventListener('keydown',event=>{if(event.key==='Escape'){panel.hidden=true;this.__windOpener?.focus?.();event.stopPropagation();}});
   // Keep map gestures out of the panel without changing existing map controls.
   for(const event of ['pointerdown','mousedown','dblclick','wheel','touchstart'])panel.addEventListener(event,e=>e.stopPropagation(),{passive:true});
  }return panel;
 },
 _weatherWindOpen({container=null,focus=true}={}){
  this.__windOpener=this.shadow?.activeElement;const panel=this._weatherWindEnsureUi();if(!panel)return;
  this._setMapDisplayMenuOpen?.(false);
  const target=container||this.shadow.getElementById('map-card');if(panel.parentElement!==target)target.append(panel);panel.classList.toggle('embedded',Boolean(container));
  if(!container&&this._weatherDisplayState?.().config.enabled)this._weatherDisplayPatch?.({enabled:false});
  this._weatherWindRender();panel.hidden=false;if(focus)panel.querySelector('button')?.focus();this._resumeWeatherWind();
 },
 _weatherWindRender(){
  const panel=this.shadow?.getElementById('weather-wind-panel');if(!panel)return;const s=this._weatherWindState(),c=s.config;
  const active=panel.contains(this.shadow.activeElement)?this.shadow.activeElement:null,focusKey=active?.dataset.windSetting,focusColor=active?.dataset.windColor;
  const check=(key,label,disabled=false)=>`<label>${label}<input type="checkbox" data-wind-setting="${key}" ${c[key]?'checked':''} ${disabled?'disabled':''}></label>`;
  const select=(key,label,options,disabled=false)=>`<label>${label}<select data-wind-setting="${key}" ${disabled?'disabled':''}>${Object.entries(options).map(([id,name])=>`<option value="${id}" ${c[key]===id?'selected':''}>${name}</option>`).join('')}</select></label>`;
  panel.innerHTML=`<header><strong>Winddarstellung</strong><button type="button" data-wind-action="legend" aria-label="Windlegende"><img src="${INFO_URL}" alt=""></button><button type="button" data-wind-action="close" aria-label="Winddarstellung schließen">×</button></header>
  ${check('enabled','Windsymbole anzeigen')}${select('mode','Darstellungsart',MODES)}
  <div class="weather-wind-note">Lokale 10-m-Windvektoren an WR-Abfragepunkten. Kein flächendeckendes Strömungsfeld.</div>
  <div role="group" aria-label="Symbolfarbe" class="weather-wind-swatches">${WIND_COLORS.map(v=>`<button type="button" class="weather-wind-swatch" data-wind-color="${v.id}" aria-label="${v.label}" aria-pressed="${c.color===v.id}" title="${v.label}"><i style="--wind-color:${v.hex}"></i></button>`).join('')}</div>
  ${select('colorMode','Farbmodus',{uniform:'Einheitliche Farbe',pressure:'Hoch-/Tiefdruck (nicht verfügbar)'})}
  <div class="weather-wind-note">${c.colorMode==='pressure'?'Einheitliche Farbe aktiv: ':''}WR liefert keine autoritative Hoch-/Tiefdruckklassifikation. Windrichtung allein ist dafür ungeeignet.</div>
  <details><summary>Gespeicherte Hoch-/Tiefdruckfarben (inaktiv)</summary>${select('highColor','Hochdruck',Object.fromEntries(WIND_COLORS.map(v=>[v.id,v.label])))}${select('lowColor','Tiefdruck',Object.fromEntries(WIND_COLORS.map(v=>[v.id,v.label])))}</details>
  <fieldset><legend>Animation</legend>${select('tempo','Geschwindigkeit',{slow:'Langsam',normal:'Normal',fast:'Schnell'},c.mode!=='animated')}${select('density','Dichte',{low:'Gering',normal:'Normal',high:'Hoch'},c.mode!=='animated')}${check('paused','Animation pausieren',c.mode!=='animated')}<div class="weather-wind-note">Nur die Darstellung wird verändert. Keine zusätzlichen Wetterabfragen pro Bild.</div></fieldset>
  <fieldset><legend>Windgeschwindigkeits-Farbfläche</legend><label>Ein / Aus<input type="checkbox" disabled aria-describedby="wind-field-reason"></label><div id="wind-field-reason" class="weather-wind-note">Datenbedingt nicht verfügbar: kein numerisches WR-Windraster mit gültiger räumlicher Abdeckung und NoData-Maske. Vorhandene gerenderte Windkacheln sind kein numerisches Windfeld.</div><label>Eigene Deckkraft<input type="range" min="0" max="100" step="1" data-wind-setting="fieldOpacity" value="${c.fieldOpacity}" aria-label="Windfarbflächen-Deckkraft (gespeicherte Einstellung)"><output>${c.fieldOpacity} %</output></label></fieldset>
  ${select('unit','Geschwindigkeitseinheit',{'km/h':'km/h',kn:'kn',Bft:'Beaufort'})}
  <div role="status" class="weather-wind-note" data-wind-status>${escape(s.status)} · ${s.points.length} Punkte</div><button type="button" data-wind-action="refresh" ${!c.enabled?'disabled':''}>WR-Wind aktualisieren</button>
  <details><summary>Werte, Quellen und Zeitpunkte</summary><div class="weather-wind-points">${s.points.length?s.points.map(p=>`<p>${p.lat.toFixed(3)}°, ${p.lon.toFixed(3)}° · ${escape(windSpeedText(p.speed,c.unit))} · Herkunft ${p.from===null?'Windstille':p.from+'°'}<br>${escape(p.attribution)} · ${escape(p.validAt)} · ${escape(p.kind||'WR')}</p>`).join(''):'Keine kohärenten gültigen WR-Punktwerte.'}</div><div class="weather-wind-note">${escape([...new Set(s.errors)].join(' · '))}</div></details>`;
  if(focusKey)panel.querySelector(`[data-wind-setting="${focusKey}"]`)?.focus();else if(focusColor)panel.querySelector(`[data-wind-color="${focusColor}"]`)?.focus();
 },
 _resumeWeatherWind(){
  const s=this._weatherWindState();s.suspended=false;
  if(!s.config.enabled||!this._map||s.map===this._map)return;
  this._weatherWindEnsureUi();this._weatherWindDetach();s.map=this._map;
  const canvas=document.createElement('canvas');canvas.className='weather-wind-canvas';canvas.setAttribute('aria-label','WR-Windpunkte; Werte und Quellen in der Windlegende');canvas.setAttribute('role','img');s.map.getContainer().append(canvas);
  s.painter=new WindCanvas(s.map,canvas,{onMetrics:metrics=>s.metrics=metrics});
  s.onMove=()=>this._weatherWindQueue();s.map.on('moveend zoomend',s.onMove);
  s.onUnload=()=>this._weatherWindDetach();s.map.on('unload',s.onUnload);
  s.onVisibility=()=>{if(document.hidden){clearTimeout(s.refreshTimer);s.refreshTimer=null;s.generation++;s.pending=false;}else this._weatherWindQueue({force:true});};document.addEventListener('visibilitychange',s.onVisibility);
  s.painter.update(s.points,s.config);this._weatherWindQueue({force:true});if(s.legend&&s.legendOpen)updateWindLegend(s.legend,this);
 },
 _weatherWindQueue({force=false}={}){
  const s=this._weatherWindState();clearTimeout(s.timer);
  if(!s.config.enabled||s.suspended||!s.map||document.hidden)return;
  const signature=JSON.stringify(windQueryPoints(s.map));
  if(s.batch&&signature!==s.batchSignature)s.generation++;
  if(!force&&signature===s.lastQuerySignature&&s.points.length){s.painter?.schedule();if(!s.refreshTimer)s.refreshTimer=setTimeout(()=>this._weatherWindQueue({force:true}),300000);return;}
  clearTimeout(s.refreshTimer);s.refreshTimer=null;
  s.timer=setTimeout(()=>{s.timer=null;s.pending=true;this._weatherWindFetch();},250);
 },
 async _weatherWindFetch(){
  const s=this._weatherWindState();if(s.batch||!s.pending||!s.config.enabled||s.suspended||document.hidden||!s.map)return;
  s.pending=false;const generation=++s.generation,points=windQueryPoints(s.map),results=[],errors=[];let cursor=0;s.batchSignature=JSON.stringify(points);
  s.status='WR-Wind wird geladen';this._weatherWindRender();
  // At most two points (four existing WS requests) at once. An obsolete batch stops dispatching.
  const worker=async()=>{while(cursor<points.length&&generation===s.generation){const point=points[cursor++];s.requests+=2;
   try{const [speed,direction]=await Promise.all([this._weatherRouterResolve(WIND_SPEED,point),this._weatherRouterResolve(WIND_DIRECTION,point)]);if(generation!==s.generation)return;results.push(combineWindPoint(speed,direction,point));}
   catch(error){errors.push(error?.message||'wr_wind_unavailable');}
  }};
  s.batch=Promise.all([worker(),worker()]);
  try{await s.batch;if(generation!==s.generation||s.suspended)return;s.lastQuerySignature=s.batchSignature;s.points=results;s.errors=errors;s.status=results.length?'WR-Wind verfügbar · lokale Punktdarstellung':'Keine kohärenten WR-Windvektoren verfügbar';s.painter?.update(s.points,s.config);this._weatherWindRender();if(s.legend)updateWindLegend(s.legend,this);}
  finally{s.batch=null;if(s.pending)this._weatherWindFetch();else if(s.config.enabled&&!s.suspended&&!document.hidden){s.refreshTimer=setTimeout(()=>this._weatherWindQueue({force:true}),300000);}}
 },
 _weatherWindDetach(){
  const s=this._weatherWindState();s.generation++;s.pending=false;clearTimeout(s.timer);clearTimeout(s.refreshTimer);s.timer=s.refreshTimer=null;
  if(s.map&&s.onMove)s.map.off('moveend zoomend',s.onMove);if(s.map&&s.onUnload)s.map.off('unload',s.onUnload);if(s.onVisibility)document.removeEventListener('visibilitychange',s.onVisibility);
  s.painter?.destroy();s.painter=null;s.map=null;s.onMove=s.onUnload=s.onVisibility=null;
 },
 _teardownWeatherWind(){const s=this.__weatherWind;if(!s)return;this._weatherWindDetach();s.suspended=true;s.legend?._teardownWeatherLegend();const panel=this.shadow?.getElementById('weather-wind-panel');if(panel)panel.hidden=true;},
 _weatherWindDiagnostics(){const s=this._weatherWindState();return {config:{...s.config},status:s.status,points:s.points.map(({lat,lon,speed,from,provider,validAt,kind})=>({lat,lon,speed,from,provider,validAt,kind})),errors:[...s.errors],metrics:s.metrics,requests:s.requests,fieldCapability:'missing_numeric_spatial_wind_grid',pressureCapability:'missing_authoritative_pressure_classification'};}
}));
