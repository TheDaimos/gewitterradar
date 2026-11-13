import {settingsStorage} from '../core/settings-vault.js?v=411187r1';
import {defineModule} from '../core/runtime.js?v=41114r1';
import {EYE_COLORS} from './eye-hub-model.js?v=411202r1';
import {ensurePremiumUi,premiumAction,bindPremiumPanelDrag,enhancePremiumSections,syncPremiumPanel,togglePremiumPanel} from './premium-ui.js?v=411207r1';
import {canonicalWindBounds} from './wind-field.js?v=411162r1';

export const MODULE_META=Object.freeze({id:'weather.synoptic-display',version:'0.1.9',group:'Weather-Engine',function:'Synoptik H/T und Isobaren',subfunctions:['WR V2 H/T','WR V2 Isobaren','geografische Vektordarstellung','Premium-Konfiguration'],file:'modules/weather/synoptic-display.js'});
export const SYNOPTIC_STORAGE='gewitterradar:synoptic-ui:v1';
export const SYNOPTIC_CAPABILITIES=Object.freeze({centers:'weather.synoptic.pressure_centers',isobars:'weather.synoptic.isobars',fronts:'weather.synoptic.fronts'});
export const CLASSIC_COLORS=Object.freeze(['#FFFFFF','#D8E6F3','#FFC442','#FFE17A','#FF9B48','#ED4343','#9F2333','#D94BA8','#8758CE','#377DFF','#36B7E9','#35C3B1','#4FBE76']);
export const SYNOPTIC_PALETTE=Object.freeze([...new Set([...EYE_COLORS,...CLASSIC_COLORS])]);
const defaults=Object.freeze({visible:false,centers:true,isobars:true,pressureLabels:true,highColor:'#FFC442',lowColor:'#B000FF',isobarColor:'#D8E6F3',highSize:28,lowSize:28,lineWidth:2,labelDensity:50,glow:false,opacity:1,centerOpacity:1,isobarOpacity:1,frontLineOpacity:1,frontSymbolOpacity:1,neonOpacity:1,fronts:false,frontNeon:true,frontSymbols:true,frontColors:{cold:'#0066FF',warm:'#FF003C',occluded:'#B000FF',stationaryCold:'#0066FF',stationaryWarm:'#FF003C'}});
const clamp=(v,lo,hi,fallback)=>Number.isFinite(Number(v))?Math.max(lo,Math.min(hi,Number(v))):fallback;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function normalizeSynopticConfig(v,legacy=null){
 const x=v&&typeof v==='object'&&!Array.isArray(v)?v:{};
 const legacyColor=(value,fallback)=>{if(typeof value!=='string')return fallback;const t=value.trim().toLowerCase();const named={gold:'#FFC442',violet:'#B000FF',purple:'#B000FF',blue:'#0066FF',red:'#FF003C',cyan:'#00FFF0',green:'#39FF14',orange:'#FF5F00',yellow:'#FFFF00',white:'#FFFFFF',silver:'#D8E6F3'};return named[t]||(/^#[0-9a-f]{6}$/i.test(t)?t.toUpperCase():fallback);};
 const color=(key,fallback)=>legacyColor(x[key]??legacy?.[key],fallback);
 return {visible:x.visible===true,centers:x.centers!==false,isobars:x.isobars!==false,pressureLabels:x.pressureLabels!==false,
 highColor:color('highColor',defaults.highColor),lowColor:color('lowColor',defaults.lowColor),isobarColor:color('isobarColor',defaults.isobarColor),
 highSize:clamp(x.highSize,14,60,28),lowSize:clamp(x.lowSize,14,60,28),lineWidth:clamp(x.lineWidth,.5,6,2),labelDensity:clamp(x.labelDensity,0,100,50),glow:x.glow===true,
 opacity:clamp(x.opacity,0,1,1),centerOpacity:clamp(x.centerOpacity,0,1,1),isobarOpacity:clamp(x.isobarOpacity,0,1,1),frontLineOpacity:clamp(x.frontLineOpacity,0,1,1),frontSymbolOpacity:clamp(x.frontSymbolOpacity,0,1,1),neonOpacity:clamp(x.neonOpacity,0,1,1),fronts:x.fronts===true,frontNeon:x.frontNeon!==false,frontSymbols:x.frontSymbols!==false,frontColors:{...defaults.frontColors,...(x.frontColors&&typeof x.frontColors==='object'?x.frontColors:{})},quickPositions:x.quickPositions&&typeof x.quickPositions==='object'?{...x.quickPositions}:{}};
}
export function parseSynopticFrame(answer,capability){
 if(answer?.schema!=='weather_router.consumer.synoptic.v2'||answer.contract_version!==2||answer.capability!==capability||answer.status!=='ready')return null;
 const f=answer.frame;if(!f||f.capability!==capability||f.unit!==(capability===SYNOPTIC_CAPABILITIES.fronts?'feature':'hPa')||f.coverage?.crs!=='EPSG:4326'||!f.provenance?.provider_id||f.geometry?.type!=='FeatureCollection'||!Array.isArray(f.geometry.features)||f.geometry.features.length>20000)return null;
 const [run,valid,until]=[f.model_run,f.valid_at,f.valid_until].map(Date.parse);
 if(![run,valid,until].every(Number.isFinite)||run>valid||valid>=until||until<=Date.now())return null;
 const centers=capability===SYNOPTIC_CAPABILITIES.centers,fronts=capability===SYNOPTIC_CAPABILITIES.fronts;
 const features=[];
 for(const entry of f.geometry.features){
  const g=entry?.geometry,p=entry?.properties;if(entry?.type!=='Feature'||!g||!p||!fronts&&!Number.isFinite(p.pressure_hpa))return null;
  if(fronts){if(g.type!=='LineString'||!['cold','warm','occluded','stationary'].includes(p.front_type)||p.symbol_side_authorized!==false||p.symbol_side!==null||!Array.isArray(g.coordinates)||g.coordinates.length<2||g.coordinates.length>240||g.coordinates.some(point=>!validCoord(point)))return null;}
  else if(centers){if(g.type!=='Point'||!['H','L'].includes(p.kind)||!validCoord(g.coordinates))return null;}
  else {if(!['LineString','MultiLineString'].includes(g.type))return null;const lines=g.type==='LineString'?[g.coordinates]:g.coordinates;if(!Array.isArray(lines)||lines.length>20000||lines.some(line=>!Array.isArray(line)||line.length<2||line.length>20000||line.some(point=>!validCoord(point,540))))return null;}
  features.push(entry);
 }
 return {...f,geometry:{type:'FeatureCollection',features}};
}
const validCoord=(p,maxLongitude=180)=>Array.isArray(p)&&p.length===2&&Number.isFinite(p[0])&&Number.isFinite(p[1])&&Math.abs(p[0])<=maxLongitude&&Math.abs(p[1])<=90;
const toLatLng=(p,shift=0)=>[p[1],p[0]+shift];
const activeParts=c=>Object.keys(SYNOPTIC_CAPABILITIES).filter(part=>c[part]);
const frameValid=f=>Date.parse(f?.valid_until)>Date.now();
const safeId=value=>typeof value==='string'&&/^[a-zA-Z0-9_.-]{1,80}$/.test(value)?value:null;
const safeTime=value=>typeof value==='string'&&Number.isFinite(Date.parse(value))?new Date(value).toISOString():null;
const roundedBbox=({west,east,south,north})=>({west:Math.floor(west),east:Math.ceil(east),south:Math.floor(south),north:Math.ceil(north)});
const viewport=map=>{const b=map.getBounds();return {west:b.getWest(),east:b.getEast(),south:Math.max(-90,b.getSouth()),north:Math.min(90,b.getNorth())};};
const replyMatches=(reply,cap)=>reply?.schema==='weather_router.consumer.synoptic.v2'&&reply.contract_version===2&&reply.capability===cap;
const wrapShift=(lon,bounds)=>360*Math.round(((bounds.west+bounds.east)/2-lon)/360);
function visibleLine(line,bounds,L,clip) {
 const [west,east]=line.reduce(([min,max],[lon])=>[Math.min(min,lon),Math.max(max,lon)],[Infinity,-Infinity]);
 const offset=wrapShift((west+east)/2,bounds);
 for(const shift of [offset,offset-360,offset+360]){
  if(east+shift<bounds.west||west+shift>bounds.east)continue;
  const points=line.map(p=>L.point(p[0]+shift,p[1]));
  if(points.some((p,i)=>i>0&&L.LineUtil.clipSegment(points[i-1],p,clip)))return line.map(p=>toLatLng(p,shift));
 }
 return null;
}
export const SYNOPTIC_OPACITY_GROUPS=Object.freeze({centers:'centerOpacity',isobars:'isobarOpacity',frontLines:'frontLineOpacity',frontSymbols:'frontSymbolOpacity',frontNeon:'neonOpacity'});
const opacity=(c,part)=>c.opacity*c[SYNOPTIC_OPACITY_GROUPS[part]||'isobarOpacity'];
const symbolHtml=(kind,pressure,c)=>{const high=kind==='H',color=high?c.highColor:c.lowColor,size=high?c.highSize:c.lowSize;return '<div style="font-weight:900;font-family:system-ui;text-align:center;white-space:nowrap;line-height:1.1;font-size:'+size+'px;color:'+color+';text-shadow:'+(c.glow?'0 0 8px '+color+',0 0 3px '+color:'0 1px 3px #07121b')+'">'+(high?'H':'T')+(c.pressureLabels?'<div style="font-size:11px">'+esc(pressure)+' hPa</div>':'')+'</div>';};
export function synopticOpacity(config,part){return opacity(config,part);}
export const installWeatherSynoptic=defineModule(MODULE_META,deps=>({
 _weatherSynopticState(){if(this.__weatherSynoptic)return this.__weatherSynoptic;const storage=settingsStorage(this);let saved=null,legacy=null;try{saved=JSON.parse(storage.getItem(SYNOPTIC_STORAGE));}catch(_){}try{legacy=JSON.parse(storage.getItem('gewitterradar:wind-ui:v1'));}catch(_){}return this.__weatherSynoptic={config:normalizeSynopticConfig(saved,legacy),frames:{},status:{},outcomes:{},requests:{},rendered:{},generation:0,map:null,layers:{},timer:null,refreshTimer:null,expiryTimer:null,pending:false};},
 _weatherSynopticSave(){const s=this._weatherSynopticState();try{settingsStorage(this).setItem(SYNOPTIC_STORAGE,JSON.stringify(s.config));s.saveError=null;}catch(error){s.saveError=error;s.status.storage=error?.code||'Settings Vault nicht verfügbar';}},
 _weatherSynopticSet(patch){
  const s=this._weatherSynopticState(),before=s.config;
  s.config=normalizeSynopticConfig({...before,...patch});
  this._weatherSynopticSave();
  const selectionChanged=['visible',...Object.keys(SYNOPTIC_CAPABILITIES)].some(key=>before[key]!==s.config[key]);
  if(selectionChanged){
   this._weatherSynopticCancelRequests(s);
   if(s.config.visible)this._weatherSynopticQueue();
  }
  this._weatherSynopticRender();
  this._weatherSynopticSync();
 },
 _weatherSynopticDecision(action,control){this._weatherSynopticState().gesture={action,control};},
 _weatherSynopticToggle(){const s=this._weatherSynopticState();this._weatherSynopticSet({visible:!s.config.visible});},
 _weatherSynopticEnsureToggle(){
 const card=this.shadow?.getElementById('map-card');if(!card)return;
 let b=this.shadow.getElementById('weather-synoptic-toggle');
 if(!b){const style=document.createElement('style');style.id='weather-synoptic-toggle-style';style.textContent='.weather-synoptic-toggle{position:absolute;left:10px;top:10px;z-index:650;width:50px;height:50px;padding:0;border:0;background:transparent;border-radius:50%;cursor:grab;touch-action:none}.weather-synoptic-toggle[hidden]{display:none!important}.weather-synoptic-toggle img{display:block;width:50px;height:50px;object-fit:contain;pointer-events:none;filter:brightness(.72) saturate(.8)}.weather-synoptic-toggle[aria-pressed=true] img{filter:drop-shadow(0 0 4px #FFC44288)}';this.shadow.append(style);b=document.createElement('button');b.type='button';b.id='weather-synoptic-toggle';b.className='weather-synoptic-toggle';const img=document.createElement('img');img.src=new URL('../../assets/gr-synoptic-high-low-isobars-premium-original.png',import.meta.url).href;img.draggable=false;img.alt='';b.append(img);card.append(b);
 const state=this._weatherSynopticState();state.quickDrag={eyeDrag:null};const options={element:b,state:()=>state.quickDrag,position:()=>this._eyeHubSyncIcons(),longPress:()=>this._weatherSynopticOpen(),activate:()=>this._weatherSynopticToggle(),onDecision:action=>this._weatherSynopticDecision(action,'standalone'),save:p=>{state.config.quickPositions[this._weatherWindToggleLayout()]=p;this._weatherSynopticSave();}};state.quickDragOptions=options;this._weatherDisplayBindEyeDrag?.(b,options);for(const name of ['mousedown','dblclick','touchstart'])b.addEventListener(name,e=>e.stopPropagation(),{passive:true});
 }this._weatherSynopticSync();
 },
 _weatherSynopticEnsureUi(){
  const card=this.shadow?.getElementById('map-card');if(!card)return null;ensurePremiumUi(this.shadow);
  if(!this.shadow.getElementById('weather-synoptic-style')){const style=document.createElement('style');style.id='weather-synoptic-style';style.textContent='.weather-synoptic-panel{position:absolute;z-index:2147483644;top:12px;right:12px;width:min(410px,calc(100% - 24px));max-height:calc(100% - 24px);overflow:auto;padding:12px;box-sizing:border-box;font:12px/1.45 system-ui;color:#e4e9ef;overscroll-behavior:contain;touch-action:pan-y}.weather-synoptic-panel[hidden],.weather-synoptic-panel.minimized>[data-premium-content]{display:none}.weather-synoptic-panel>header{touch-action:none}.weather-synoptic-panel strong{min-width:0;overflow-wrap:anywhere}.weather-synoptic-panel .gr-collapse-inner{padding:0 8px}.weather-synoptic-panel label{display:flex;justify-content:space-between;gap:10px;align-items:center;margin:10px 0}.weather-synoptic-panel select,.weather-synoptic-panel button{background:#14202d;color:#f1d38a;border:1px solid #b5985a66;border-radius:7px;padding:7px}.weather-synoptic-panel fieldset{border:1px solid #a5885355;border-radius:8px;margin:10px 0}.weather-synoptic-panel legend{color:#dfc081}.weather-synoptic-panel input[type=range]{width:46%}';this.shadow.append(style);}
  let panel=this.shadow.getElementById('weather-synoptic-panel');if(!panel){panel=document.createElement('section');panel.id='weather-synoptic-panel';panel.className='weather-synoptic-panel gr-premium-metal-surface';panel.hidden=true;card.append(panel);bindPremiumPanelDrag(panel,this.shadow?.getElementById('map'),'synoptic-settings',{touch:true});
   panel.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;e.stopPropagation();if(b.dataset.premiumAction==='minimize')togglePremiumPanel(panel,'synoptic-settings');if(b.dataset.premiumAction==='close')this._weatherSynopticClose();if(b.dataset.synopticAction==='refresh')this._weatherSynopticQueue(true);});
   const change=e=>{const n=e.target,k=n.dataset.synopticSetting,frontColor=n.dataset.synopticFrontColor;if((!k&&!frontColor)||(e.type==='input')!==(n.type==='range'))return;e.stopPropagation();if(frontColor){const c=this._weatherSynopticState().config;this._weatherSynopticSet({frontColors:{...c.frontColors,[frontColor]:n.value}});return;}this._weatherSynopticSet({[k]:n.type==='checkbox'?n.checked:n.type==='range'?Number(n.value):n.value});};
   panel.addEventListener('input',change);
   panel.addEventListener('change',change);
   for(const name of ['pointerdown','mousedown','dblclick','touchstart','wheel'])panel.addEventListener(name,e=>e.stopPropagation(),{passive:true});
  }return panel;
 },
 _weatherSynopticOpen(){
  const panel=this._weatherSynopticEnsureUi();
  if(!panel)return;
  this._setMapDisplayMenuOpen?.(false);
  if(this._weatherDisplayState?.().config.enabled)this._weatherDisplayPatch({enabled:false});
  if(!panel.firstElementChild)this._weatherSynopticRenderMenu();
  panel.hidden=false;
  this._weatherSynopticSyncMenu();
  panel.querySelector('button')?.focus({preventScroll:true});
 },
 _weatherSynopticClose(){const panel=this.shadow?.getElementById('weather-synoptic-panel');if(panel)panel.hidden=true;},
 _weatherSynopticRenderMenu(){const panel=this.shadow?.getElementById('weather-synoptic-panel');if(!panel)return;const s=this._weatherSynopticState(),c=s.config;const check=(k,label)=>'<label>'+label+'<input data-synoptic-setting="'+k+'" type="checkbox" '+(c[k]?'checked':'')+'></label>';const range=(k,label,max,step=1)=>'<label>'+label+'<input data-synoptic-setting="'+k+'" type="range" min="0" max="'+max+'" step="'+step+'" value="'+c[k]+'"></label>';const color=(k,label)=>'<label>'+label+'<select data-synoptic-setting="'+k+'">'+SYNOPTIC_PALETTE.map(v=>'<option value="'+v+'" '+(v===c[k]?'selected':'')+'>'+v+'</option>').join('')+'</select></label>';const frontColor=(k,label)=>'<label>'+label+'<select data-synoptic-front-color="'+k+'">'+SYNOPTIC_PALETTE.map(v=>'<option value="'+v+'" '+(v===c.frontColors[k]?'selected':'')+'>'+v+'</option>').join('')+'</select></label>';panel.innerHTML='<header class="weather-display-panel-head" data-premium-drag-handle><strong>Synoptik · H/T, Isobaren & Fronten</strong>'+premiumAction('minimize','Synoptik minimieren','minimize')+premiumAction('close','Synoptik schließen')+'</header><div data-premium-content>'+check('visible','Synoptik sichtbar')+'<details open data-section="centers"><summary>Hoch- und Tiefdruck</summary>'+check('centers','H/T anzeigen')+check('pressureLabels','Druckwerte')+color('highColor','Hochdruckfarbe')+color('lowColor','Tiefdruckfarbe')+range('highSize','H-Größe',60)+range('lowSize','T-Größe',60)+'</details><details open data-section="isobars"><summary>Isobaren</summary>'+check('isobars','Isobaren anzeigen')+color('isobarColor','Linienfarbe')+range('lineWidth','Linienbreite',6,.5)+range('labelDensity','Beschriftungsdichte',100,5)+'</details><details open data-section="opacity"><summary>Darstellung</summary>'+check('glow','Neon-Effekt')+range('opacity','Synoptik gesamt',1,.01)+range('centerOpacity','H/T-Deckkraft',1,.01)+range('isobarOpacity','Isobaren-Deckkraft',1,.01)+'</details><details open data-section="fronts"><summary>Wetterfronten · NOAA WPC regional</summary><p>Wetterfronten werden nur aus typisierten offiziellen NOAA-WPC-Linien gezeichnet (Nordamerika). Frontsymbole benötigen zusätzlich eine bestätigte Richtung zur Symbolseite; diese liefert WPC hier noch nicht.</p>'+check('fronts','Wetterfronten anzeigen')+check('frontNeon','Neon-Übergangslinie')+check('frontSymbols','Meteorologische Symbole')+frontColor('cold','Kaltfrontfarbe')+frontColor('warm','Warmfrontfarbe')+frontColor('occluded','Okklusionsfarbe')+frontColor('stationaryCold','Stationär: Kaltanteil')+frontColor('stationaryWarm','Stationär: Warmanteil')+range('frontLineOpacity','Frontlinien-Deckkraft',1,.01)+range('neonOpacity','Fronten-Neon-Deckkraft',1,.01)+'</details><button type="button" data-synoptic-action="refresh">WR-Daten aktualisieren</button><p role="status" data-synoptic-status>'+esc(Object.entries(s.status).map(([k,v])=>k+': '+v).join(' · ')||'Noch keine Daten geladen')+'</p></div>';enhancePremiumSections(panel,'synoptic-settings');syncPremiumPanel(panel,'synoptic-settings');},
 _weatherSynopticSyncMenu(){
  const panel=this.shadow?.getElementById('weather-synoptic-panel');
  if(!panel||panel.hidden)return;
  const s=this._weatherSynopticState(),c=s.config;
  for(const input of panel.querySelectorAll('[data-synoptic-setting]')){
   const value=c[input.dataset.synopticSetting];
   if(input.type==='checkbox')input.checked=value;
   else if(input.value!==String(value))input.value=String(value);
  }
  for(const select of panel.querySelectorAll('[data-synoptic-front-color]')){
   const value=c.frontColors[select.dataset.synopticFrontColor];
   if(select.value!==value)select.value=value;
  }
  const status=panel.querySelector('[data-synoptic-status]');
  const detail=Object.entries(s.status).map(([part,message])=>part+': '+message).join(' · ')||'Noch keine Daten geladen';
  if(status&&status.textContent!==detail)status.textContent=detail;
 },
 _weatherSynopticSync(){
  const s=this._weatherSynopticState(),b=this.shadow?.getElementById('weather-synoptic-toggle'),pressed=String(s.config.visible);
  if(b){
   if(b.getAttribute('aria-pressed')!==pressed)b.setAttribute('aria-pressed',pressed);
   b.title='Synoptik · '+(s.config.visible?'Ein':'Aus');
   b.setAttribute('aria-label',b.title);
  }
  this._weatherSynopticSyncMenu();
  this._weatherDisplaySyncSynopticTransparencies?.();
  this._eyeHubSync?.();
 },
 _weatherSynopticRender(onlyPart){
  const s=this._weatherSynopticState(),{L,map,config:c}=s;
  if(!L||!map)return;
  const bounds=viewport(map),clip=L.bounds([bounds.west,bounds.south],[bounds.east,bounds.north]);
  for(const part of onlyPart?[onlyPart]:Object.keys(SYNOPTIC_CAPABILITIES)){
   s.layers[part]?.remove();
   delete s.layers[part];
   delete s.rendered[part];
   const frame=s.frames[part];
   if(!c.visible||!c[part]||!frameValid(frame))continue;
   const group=L.layerGroup(),labels=[];
   let count=0;
   for(const {geometry,properties} of frame.geometry.features){
    if(part==='centers'){
     const p=geometry.coordinates,shift=wrapShift(p[0],bounds);
     if(!clip.contains([p[0]+shift,p[1]]))continue;
     const size=properties.kind==='H'?c.highSize:c.lowSize;
     const icon=L.divIcon({className:'gr-synoptic-center',html:symbolHtml(properties.kind,properties.pressure_hpa,c),iconSize:[size+24,size+18],iconAnchor:[(size+24)/2,(size+18)/2]});
     group.addLayer(L.marker(toLatLng(p,shift),{icon,opacity:opacity(c,'centers'),interactive:false,keyboard:false}));
     count++;
     continue;
    }
    const paths=geometry.type==='LineString'?[geometry.coordinates]:geometry.coordinates;
    let intersects=false;
    for(const path of paths){
     const points=visibleLine(path,bounds,L,clip);
     if(!points)continue;
     intersects=true;
     if(part==='isobars'){
      const style={color:c.isobarColor,weight:c.lineWidth,opacity:opacity(c,'isobars'),interactive:false,smoothFactor:1};
      if(c.glow)group.addLayer(L.polyline(points,{...style,weight:c.lineWidth+7,opacity:style.opacity*.13}));
      group.addLayer(L.polyline(points,style));
      if(c.pressureLabels&&points.length>2)labels.push([points[Math.floor(points.length/2)],properties.pressure_hpa]);
     }else{
      const kind=properties.front_type,colors=c.frontColors;
      const style={weight:Math.max(2,c.lineWidth+1),opacity:opacity(c,'frontLines'),interactive:false,smoothFactor:1};
      const addLine=(segment,color)=>{
       if(c.frontNeon)group.addLayer(L.polyline(segment,{...style,color,weight:style.weight+11,opacity:opacity(c,'frontNeon')*.14}));
       group.addLayer(L.polyline(segment,{...style,color}));
      };
      if(kind==='stationary')for(let i=1;i<points.length;i++)addLine([points[i-1],points[i]],i%2?colors.stationaryCold:colors.stationaryWarm);
      else addLine(points,colors[kind]);
      // WR supplies no authorized symbol side.
     }
    }
    if(intersects)count++;
   }
   for(const [ll,value] of labels.slice(0,Math.ceil(c.labelDensity/5))){
    const icon=L.divIcon({className:'gr-synoptic-isobar-label',html:'<span style="font:600 11px system-ui;color:'+c.isobarColor+';text-shadow:0 1px 3px #000">'+esc(value)+' hPa</span>',iconSize:[62,18],iconAnchor:[31,9]});
    group.addLayer(L.marker(ll,{icon,opacity:opacity(c,'isobars'),interactive:false,keyboard:false}));
   }
   if(count){
    group.addTo(map);
    s.layers[part]=group;
   }
   s.rendered[part]=count;
  }
 },
 _resumeWeatherSynoptic(leaflet){
  const s=this._weatherSynopticState(),map=this._map;
  if(!map)return;
  if(s.map&&s.map!==map)this._weatherSynopticDetach();
  if(s.map===map&&(s.L||s.loadingLeaflet))return;
  if(s.map!==map){
   s.map=map;
   this._weatherSynopticEnsureToggle();
   s.onMove=()=>{this._weatherSynopticRender();this._weatherSynopticQueue();};
   s.onUnload=()=>this._weatherSynopticDetach();
   s.onVisibility=()=>{if(!document.hidden){this._weatherSynopticRender();this._weatherSynopticQueue();}};
   map.on('moveend zoomend',s.onMove);
   map.on('unload',s.onUnload);
   document.addEventListener('visibilitychange',s.onVisibility);
  }
  const attach=L=>{
   s.L=L;
   delete s.status.connection;
   delete s.outcomes.connection;
   this._weatherSynopticRender();
   this._weatherSynopticScheduleExpiry(s);
   this._weatherSynopticQueue();
  };
  if(leaflet){attach(leaflet);return;}
  const loading=Promise.resolve().then(()=>deps.loadLeafletJs());
  s.loadingLeaflet=loading;
  loading.then(L=>{
   if(s.loadingLeaflet===loading)attach(L);
  }).catch(()=>{
   if(s.loadingLeaflet!==loading)return;
   s.status.connection='Leaflet nicht verfügbar';
   s.outcomes.connection='error';
   this._weatherSynopticSync();
  }).finally(()=>{if(s.loadingLeaflet===loading)s.loadingLeaflet=null;});
 },
 _weatherSynopticQueue(force=false){
  const s=this._weatherSynopticState();
  clearTimeout(s.timer);
  if(!s.map||!s.L||!s.config.visible||document.hidden||!activeParts(s.config).length)return;
  s.waitReason='scheduled';
  s.timer=setTimeout(()=>this._weatherSynopticFetch(),force?0:350);
 },
 _weatherSynopticCancelRequests(s){
  s.generation++;
  s.pending=false;
  s.queuedParts?.clear();
  clearTimeout(s.timer);
  clearTimeout(s.refreshTimer);
  for(const cancel of s.cancelRequests?.values()||[])cancel();
  s.cancelRequests?.clear();
  for(const request of Object.values(s.requests)){
   if(request.outcome==='loading'){
    request.completed=true;
    request.outcome='not-loaded';
    request.reason='superseded';
   }
  }
 },
 _weatherSynopticScheduleExpiry(s){
  clearTimeout(s.expiryTimer);
  const next=Math.min(...Object.values(s.frames).filter(frameValid).map(f=>Date.parse(f.valid_until)));
  if(!Number.isFinite(next))return;
  s.expiryTimer=setTimeout(()=>{
   for(const [part,frame] of Object.entries(s.frames)){
    if(frameValid(frame))continue;
    delete s.frames[part];
    s.status[part]='Gültigkeit abgelaufen';
    s.outcomes[part]='unavailable';
   }
   this._weatherSynopticRender();
   this._weatherSynopticSync();
   this._weatherSynopticQueue(true);
   this._weatherSynopticScheduleExpiry(s);
  },Math.min(2147483647,Math.max(1,next-Date.now())));
 },
 async _weatherSynopticFetch(onlyPart){
  const s=this._weatherSynopticState();
  if(!s.map||!s.L||!s.config.visible||document.hidden)return;
  const bounds=viewport(s.map);
  if(!Object.values(bounds).every(Number.isFinite)||bounds.west>=bounds.east||bounds.south>=bounds.north){
   s.waitReason='invalid_viewport';
   return;
  }
  s.waitReason=null;
  const bbox=canonicalWindBounds(bounds),parts=activeParts(s.config).filter(part=>!onlyPart||part===onlyPart);
  const gen=s.generation,profile=this._weatherRouterClient?.().profileId||null;
  s.cancelRequests??=new Map();
  s.queuedParts??=new Set();
  const requests=s.cancelRequests;
  const fetchOne=async part=>{
   if(requests.has(part)){s.queuedParts.add(part);return;}
   const capability=SYNOPTIC_CAPABILITIES[part];
   const entry=s.requests[part]={requested:true,started:false,completed:false,outcome:'loading',bbox:roundedBbox(bbox)};
   let timer;
   try{
    if(typeof this._hass?.callWS!=='function'){
     entry.reason='websocket_unavailable';
     throw Object.assign(new Error('websocket_unavailable'),{code:'websocket_unavailable'});
    }
    const request={type:'weather_router/consumer/resolve_synoptic',contract_version:2,capability,context:{bbox},time:{mode:'latest'},consumer_id:'gewitterradar',...(profile?{profile_id:profile}:{})};
    const limit=new Promise((_,reject)=>{
     requests.set(part,()=>reject(new Error('superseded')));
     timer=setTimeout(()=>reject(Object.assign(new Error('synoptic_timeout'),{code:'synoptic_timeout'})),80000);
    });
    s.pending=true;
    const reply=await Promise.race([limit,Promise.resolve().then(()=>{
     if(gen!==s.generation)return;
     entry.started=true;
     return this._hass.callWS(request);
    })]);
    if(gen!==s.generation)return;
    entry.provider=safeId(reply?.frame?.provenance?.provider_id??reply?.unavailable?.sources?.at(-1)?.provider_id);
    entry.model_run=safeTime(reply?.frame?.model_run);
    entry.valid_at=safeTime(reply?.frame?.valid_at);
    entry.valid_until=safeTime(reply?.frame?.valid_until);
    entry.featureCount=Array.isArray(reply?.frame?.geometry?.features)?reply.frame.geometry.features.length:0;
    const frame=parseSynopticFrame(reply,capability);
    if(frame?.geometry.features.length){
     s.frames[part]=frame;
     this._weatherSynopticRender(part);
     entry.outcome=s.rendered[part]?'ready':'unavailable';
     entry.reason=s.rendered[part]?null:'outside_viewport';
     s.status[part]=entry.outcome==='ready'?entry.provider+' · '+frame.valid_at:'Keine Geometrie im Kartenausschnitt';
    }else if(frame||replyMatches(reply,capability)&&reply.status==='unavailable'){
     delete s.frames[part];
     this._weatherSynopticRender(part);
     entry.outcome='unavailable';
     entry.wrCode=safeId(reply.unavailable?.code);
     entry.reason=frame?'empty_geometry':'wr_unavailable';
     s.status[part]=entry.wrCode||'Keine WR-Geometrie';
    }else{
     const expired=replyMatches(reply,capability)&&entry.valid_until&&Date.parse(entry.valid_until)<=Date.now();
     entry.outcome=expired?'unavailable':'error';
     entry.reason=expired?'expired_frame':'invalid_frame';
     if(expired){delete s.frames[part];this._weatherSynopticRender(part);}
     s.status[part]=entry.reason;
    }
   }catch(error){
    if(gen!==s.generation)return;
    entry.outcome='error';
    entry.wrCode=safeId(error?.code);
    entry.reason=entry.reason||'request_failed';
    s.status[part]=entry.wrCode||entry.reason;
   }finally{
    clearTimeout(timer);
    if(gen===s.generation){
     requests.delete(part);
     s.pending=requests.size>0;
     entry.completed=true;
     s.outcomes[part]=entry.outcome;
     this._weatherSynopticScheduleExpiry(s);
     this._weatherSynopticSync();
     if(s.queuedParts.delete(part))void this._weatherSynopticFetch(part);
    }
   }
  };
  if(!onlyPart){
   clearTimeout(s.refreshTimer);
   s.refreshTimer=setTimeout(()=>this._weatherSynopticQueue(true),600000);
  }
  const batch=parts.map(fetchOne);
  this._weatherSynopticSync();
  await Promise.all(batch);
 },
 _weatherSynopticDiagnostic(){
  const s=this._weatherSynopticState(),c=s.config;
  const router=this.__weatherEngineTraceStore?.lastDiscovery?.router??this.__weatherLayerMenuState?.discovery?.router;
  const capabilities=Object.fromEntries(Object.entries(SYNOPTIC_CAPABILITIES).map(([part,capability])=>{
   const request=s.requests[part],count=s.rendered[part]||0;
   const idle=!c.visible||!c[part]?'off':!s.map?'map_not_attached':!s.L?'leaflet_not_ready':document.hidden?'document_hidden':s.waitReason||'not_requested';
   const outcome=!c.visible||!c[part]?'off':request?.outcome==='loading'||request?.outcome==='error'?request.outcome:count?'ready':s.outcomes[part]==='unavailable'||request?.outcome==='ready'?'unavailable':request?.outcome||'not-loaded';
   return [part,{capability,requested:false,started:false,completed:false,wrCode:null,provider:null,model_run:null,valid_at:null,valid_until:null,bbox:null,featureCount:0,...request,outcome,
    reason:outcome==='off'?'off':!request?.started?request?.reason||idle:outcome==='unavailable'&&request.outcome==='ready'?(s.frames[part]?'no_visible_geometry':'expired_frame'):request.reason??null,
    renderedFeatures:count,layerCount:s.layers[part]?.getLayers().length||0}];
  }));
  const panel=this.shadow?.getElementById('weather-synoptic-panel');
  return {grVersion:deps.APPLICATION_META?.version??null,wrVersion:safeId(router?.integration_version),moduleLoaded:true,
   mapAttached:Boolean(s.map),leafletReady:Boolean(s.L),visible:c.visible,
   overlayAttached:Object.values(s.layers).some(layer=>s.map?.hasLayer(layer)),
   overlayVisible:c.visible&&activeParts(c).some(part=>s.layers[part]&&
    (part==='fronts'?(opacity(c,'frontLines')>0||c.frontNeon&&opacity(c,'frontNeon')>0):opacity(c,part)>0)),
   menuOpen:Boolean(panel&&!panel.hidden),lastGesture:s.gesture??null,capabilities,
   opacity:{total:c.opacity,centers:opacity(c,'centers'),isobars:opacity(c,'isobars')},
   centralControlsRegistered:this.shadow?.querySelectorAll('#weather-display-panel [data-synoptic-opacity]').length===3};
 },
 _weatherSynopticDetach(){
  const s=this._weatherSynopticState();
  this._weatherSynopticCancelRequests(s);
  clearTimeout(s.expiryTimer);
  s.map?.off('moveend zoomend',s.onMove);
  s.map?.off('unload',s.onUnload);
  if(s.onVisibility)document.removeEventListener('visibilitychange',s.onVisibility);
  for(const layer of Object.values(s.layers))layer.remove();
  s.layers={};s.rendered={};s.map=null;s.L=null;s.loadingLeaflet=null;
 },
 _teardownWeatherSynoptic(){
  const s=this.__weatherSynoptic;
  if(!s)return;
  if(s.quickDragOptions)this._weatherDisplayCancelEyeDrag?.(s.quickDragOptions);
  this._weatherSynopticClose();
  this._weatherSynopticDetach();
 }
}));
