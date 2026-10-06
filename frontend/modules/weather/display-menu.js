import { defineModule } from "../core/runtime.js?v=41110r1";
import { WEATHER_ROUTER_CAPABILITIES } from "./consumer-client.js?v=41109r1";

export const MODULE_META=Object.freeze({
  id:"weather.display-menu",
  version:"0.2.0",
  group:"Weather-Engine",
  function:"WeatherRouter-Darstellung",
  subfunctions:["gemeinsamer Darstellungszustand","Offline-Teaser","Augen-Bedienelement","schwebendes Kartenmenü","Pointer-Drag","Positionsspeicherung","Niederschlagsstile","Legendenmodus","Layer-Schnellzugriff"],
  file:"modules/weather/display-menu.js"
});

const STORAGE_KEY="gewitterradar:weather-display:v1";
const DEFAULT_POSITION=Object.freeze({x:.72,y:.16});
const DEFAULT_STATE=Object.freeze({
  enabled:false,
  controlVisible:true,
  minimized:false,
  rememberPosition:true,
  legendMode:"auto",
  position:DEFAULT_POSITION,
  styles:Object.freeze({precipitation:"precise"})
});
export const WEATHER_DISPLAY_STYLES=Object.freeze({
  precipitation:Object.freeze(["precise","balanced","soft"])
});
const LABELS=Object.freeze({
  precise:"Präzise",
  balanced:"Ausgewogen",
  soft:"Weich"
});
const safeObject=value=>value&&typeof value==="object"&&!Array.isArray(value)?value:{};
const clamp=(value,min,max)=>Math.min(max,Math.max(min,Number(value)||0));
const bool=(value,fallback)=>typeof value==="boolean"?value:fallback;
const cloneDefault=()=>({
  enabled:DEFAULT_STATE.enabled,
  controlVisible:DEFAULT_STATE.controlVisible,
  minimized:DEFAULT_STATE.minimized,
  rememberPosition:DEFAULT_STATE.rememberPosition,
  legendMode:DEFAULT_STATE.legendMode,
  position:{...DEFAULT_POSITION},
  styles:{precipitation:"precise"}
});
const normalizeState=input=>{
  const source=safeObject(input),styles=safeObject(source.styles),position=safeObject(source.position);
  const precipitation=WEATHER_DISPLAY_STYLES.precipitation.includes(styles.precipitation)?styles.precipitation:"precise";
  const legendMode=["auto","on","off"].includes(source.legendMode)?source.legendMode:"auto";
  return {
    enabled:bool(source.enabled,false),
    controlVisible:bool(source.controlVisible,true),
    minimized:bool(source.minimized,false),
    rememberPosition:bool(source.rememberPosition,true),
    legendMode,
    position:{x:clamp(position.x??DEFAULT_POSITION.x,0,1),y:clamp(position.y??DEFAULT_POSITION.y,0,1)},
    styles:{precipitation}
  };
};
const errorStatus=discovery=>{
  if(!discovery)return "checking";
  if(discovery.present===false)return "missing";
  if(discovery.compatible===false)return "incompatible";
  if(!discovery.ready)return "offline";
  return "ready";
};
const eyeSvg=open=>{
  const lid=open
    ? '<path d="M9.5 24c5-7.2 11.2-10.8 18.5-10.8S41.5 16.8 46.5 24C41.5 31.2 35.3 34.8 28 34.8S14.5 31.2 9.5 24Z" fill="none" stroke="currentColor" stroke-width="2.7"/><circle cx="28" cy="24" r="5.4" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="28" cy="24" r="1.9" fill="currentColor"/>'
    : '<path d="M10.2 28.6c5.6-6.1 11.5-9.2 17.8-9.2s12.2 3.1 17.8 9.2" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><path d="M14.4 30.4 11.8 34M21 33l-1.1 4.2M28 34.1v4.3M35 33l1.1 4.2M41.6 30.4l2.6 3.6" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>';
  return '<span class="weather-display-eye-glyph" data-weather-display-eye-placeholder="true" aria-hidden="true"><svg viewBox="0 0 56 48" focusable="false"><defs><radialGradient id="wdg" cx="34%" cy="25%" r="72%"><stop offset="0" stop-color="#fff2b8"/><stop offset=".28" stop-color="#d8a84d"/><stop offset=".72" stop-color="#8c5b20"/><stop offset="1" stop-color="#3a2410"/></radialGradient></defs><circle cx="28" cy="24" r="21.2" fill="#090b0e" stroke="url(#wdg)" stroke-width="4.2"/><g color="#efd07a">'+lid+'</g></svg></span>';
};

export const installWeatherDisplayMenu=defineModule(MODULE_META,()=>({
  _weatherDisplayState(){
    if(this.__weatherDisplayState)return this.__weatherDisplayState;
    let saved=null;
    try{saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");}catch(_error){}
    this.__weatherDisplayState={
      config:normalizeState(saved),
      discovery:null,
      catalog:null,
      implementedCapabilities:[],
      status:"checking",
      probing:false,
      generation:0,
      drag:null,
      resizeHandler:null,
      lifecycleAbortHandler:null,
      mounted:false
    };
    return this.__weatherDisplayState;
  },

  _weatherDisplayPersist(){
    const state=this._weatherDisplayState();
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state.config));}catch(_error){}
  },

  _weatherDisplayPatch(patch,{persist=true}={}){
    const state=this._weatherDisplayState();
    const next=normalizeState({...state.config,...safeObject(patch),styles:{...state.config.styles,...safeObject(patch?.styles)},position:{...state.config.position,...safeObject(patch?.position)}});
    state.config=next;
    if(persist)this._weatherDisplayPersist();
    this._weatherDisplaySyncUi();
    this._weatherDisplayRefreshRenderedLayers();
    this._weatherLegendSyncUi?.();
    return next;
  },

  _weatherDisplayStyle(kind){
    return this._weatherDisplayState().config.styles?.[kind]||"precise";
  },

  _weatherDisplayLegendMode(){
    return this._weatherDisplayState().config.legendMode||"auto";
  },

  _weatherDisplaySetLegendMode(mode){
    if(!["auto","on","off"].includes(mode))return this._weatherDisplayLegendMode();
    this._weatherDisplayPatch({legendMode:mode});
    return mode;
  },

  _weatherDisplayApplyRasterStyle(kind,node){
    if(!node?.style)return;
    const style=this._weatherDisplayStyle(kind);
    node.dataset.weatherDisplayStyle=style;
    node.style.transformOrigin="50% 50%";
    node.style.willChange=style==="precise"?"auto":"filter,transform";
    if(style==="balanced"){
      node.style.imageRendering="auto";
      node.style.filter="blur(.32px)";
      node.style.transform="scale(1.004)";
    }else if(style==="soft"){
      node.style.imageRendering="auto";
      node.style.filter="blur(.72px) saturate(1.015)";
      node.style.transform="scale(1.008)";
    }else{
      node.style.imageRendering="auto";
      node.style.filter="none";
      node.style.transform="none";
    }
  },

  _weatherDisplayRefreshRenderedLayers(){
    const pane=this._map?.getPane?.("gr-weather-radar");
    if(!pane)return;
    pane.querySelectorAll("img").forEach(node=>this._weatherDisplayApplyRasterStyle("precipitation",node));
  },

  _weatherDisplayImplementedCapabilities(catalog){
    const items=Array.isArray(catalog?.capabilities)?catalog.capabilities:[];
    return items.filter(item=>item?.enabled===true&&item?.available===true&&item?.id===WEATHER_ROUTER_CAPABILITIES.precipitation);
  },

  _weatherDisplayApplyAvailability(discovery,catalog=null){
    const state=this._weatherDisplayState();
    state.discovery=discovery||null;
    state.catalog=catalog||null;
    state.implementedCapabilities=this._weatherDisplayImplementedCapabilities(catalog);
    const base=errorStatus(discovery);
    state.status=base==="ready"?(state.implementedCapabilities.length?"ready":"ready-empty"):base;
    this._weatherDisplaySyncUi();
  },

  _weatherDisplaySyncFromWeatherLayerMenu(discovery,catalog){
    this._weatherDisplayApplyAvailability(discovery,catalog);
  },

  async _weatherDisplayProbe({refresh=false}={}){
    const state=this._weatherDisplayState();
    if(state.probing)return;
    const generation=++state.generation;
    state.probing=true;
    state.status="checking";
    this._weatherDisplaySyncUi();
    try{
      const discovery=await this._weatherRouterDiscovery?.({refresh:true});
      if(generation!==state.generation)return;
      let catalog=null;
      if(discovery?.present&&discovery?.compatible&&discovery?.ready){
        catalog=await this._weatherRouterCapabilities?.({refresh:true,filter:{available_only:true}});
      }
      if(generation!==state.generation)return;
      this._weatherDisplayApplyAvailability(discovery,catalog);
    }catch(_error){
      if(generation===state.generation)this._weatherDisplayApplyAvailability({present:true,compatible:true,ready:false,reason:"discovery_unreachable"},null);
    }finally{
      if(generation===state.generation){state.probing=false;this._weatherDisplaySyncUi();}
    }
  },

  _weatherDisplayIsAvailable(){
    return this._weatherDisplayState().status==="ready";
  },

  _weatherDisplayEnsureStyle(){
    if(!this.shadow||this.shadow.getElementById("weather-display-style"))return;
    const style=document.createElement("style");
    style.id="weather-display-style";
    style.textContent=[
      ".weather-display-settings{margin:2px 0 8px;padding:9px 10px;border:1px solid rgba(218,173,82,.20);border-radius:12px;background:linear-gradient(135deg,rgba(211,157,49,.055),rgba(92,22,73,.035));}",
      ".weather-display-settings.offline{opacity:.68;filter:saturate(.72)}",
      ".weather-display-settings-head{display:flex;align-items:center;gap:9px;margin-bottom:7px}.weather-display-settings-head .weather-display-eye-glyph{width:36px;height:36px;flex:0 0 36px}.weather-display-settings-title{font-weight:850;font-size:12px;color:#f0d18b}.weather-display-settings-status{margin-top:2px;font-size:9px;line-height:1.35;opacity:.72}",
      ".weather-display-row{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:9px;min-height:42px;padding:5px 0;border-top:1px solid rgba(255,255,255,.055)}.weather-display-row:first-of-type{border-top:0}.weather-display-row-label{font-size:10px;font-weight:760;color:#e4e8ee}.weather-display-row-note{display:block;margin-top:2px;font-size:8px;font-weight:560;opacity:.62}",
      ".weather-display-switch{appearance:none;width:42px;height:24px;border:1px solid rgba(255,255,255,.16);border-radius:999px;background:#151b23;position:relative;cursor:pointer;touch-action:manipulation}.weather-display-switch::after{content:'';position:absolute;width:16px;height:16px;left:3px;top:3px;border-radius:50%;background:#86909b;transition:transform .16s ease,background .16s ease}.weather-display-switch.on{border-color:rgba(226,183,86,.56);background:rgba(151,108,30,.22)}.weather-display-switch.on::after{transform:translateX(18px);background:#f0ca70}.weather-display-switch:disabled{opacity:.38;cursor:default}",
      ".weather-display-action{appearance:none;min-height:32px;padding:6px 9px;border:1px solid rgba(225,181,83,.28);border-radius:8px;background:rgba(255,255,255,.025);color:#e8d39d;font:760 9px/1.1 inherit;cursor:pointer;touch-action:manipulation}.weather-display-action:disabled{opacity:.4;cursor:default}",
      ".weather-display-style-picker{display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-end}.weather-display-style-button{appearance:none;min-height:31px;padding:5px 8px;border:1px solid rgba(255,255,255,.11);border-radius:8px;background:#111820;color:#bfc8d2;font:720 8.5px/1 inherit;cursor:pointer;touch-action:manipulation}.weather-display-style-button.active{border-color:rgba(240,202,112,.58);background:rgba(145,105,31,.20);color:#f2d88e;box-shadow:0 0 12px rgba(223,173,68,.08)}",
      ".weather-display-legend-picker{display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-end}.weather-display-legend-button{appearance:none;min-height:31px;padding:5px 9px;border:1px solid rgba(255,255,255,.11);border-radius:8px;background:#111820;color:#bfc8d2;font:760 8.5px/1 inherit;cursor:pointer;touch-action:manipulation}.weather-display-legend-button.active{border-color:rgba(240,202,112,.58);background:rgba(145,105,31,.20);color:#f2d88e;box-shadow:0 0 12px rgba(223,173,68,.08)}",
      ".weather-display-eye-control{position:absolute;z-index:2147483645;left:10px;bottom:54px;width:44px;height:44px;padding:0;border:1px solid rgba(232,188,91,.35);border-radius:13px;background:rgba(10,14,20,.94);display:grid;place-items:center;box-shadow:0 8px 24px rgba(0,0,0,.34),0 0 15px rgba(222,166,58,.09);backdrop-filter:blur(10px);cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}.weather-display-eye-control[hidden]{display:none!important}.weather-display-eye-control.active{border-color:rgba(240,202,112,.68);box-shadow:0 8px 24px rgba(0,0,0,.34),0 0 18px rgba(240,202,112,.18)}",
      ".weather-display-eye-glyph{display:grid;place-items:center;width:34px;height:34px;color:#e8c56b;pointer-events:none}.weather-display-eye-glyph svg{display:block;width:100%;height:100%;filter:drop-shadow(0 2px 4px rgba(0,0,0,.7))}",
      ".weather-display-panel{position:absolute;z-index:2147483644;width:min(286px,calc(100% - 20px));box-sizing:border-box;border:1px solid rgba(231,190,96,.34);border-radius:15px;background:linear-gradient(155deg,rgba(17,20,27,.97),rgba(12,13,20,.95));box-shadow:0 18px 46px rgba(0,0,0,.52),0 0 22px rgba(219,161,51,.08);backdrop-filter:blur(15px);color:#e7ebf0;overflow:hidden;pointer-events:auto}.weather-display-panel[hidden]{display:none!important}.weather-display-panel.minimized{width:min(184px,calc(100% - 20px))}.weather-display-panel.minimized .weather-display-panel-body{display:none}",
      ".weather-display-panel-head{min-height:46px;padding:5px 6px 5px 9px;display:grid;grid-template-columns:34px minmax(0,1fr) auto;gap:7px;align-items:center;cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;overscroll-behavior:none;background:linear-gradient(90deg,rgba(177,128,36,.10),rgba(112,34,92,.08))}.weather-display-panel.dragging .weather-display-panel-head{cursor:grabbing}.weather-display-panel-title{font-size:11px;font-weight:860;color:#f1d38a}.weather-display-panel-sub{margin-top:2px;font-size:7.8px;opacity:.62;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.weather-display-minimize{appearance:none;width:36px;height:34px;border:1px solid rgba(255,255,255,.09);border-radius:9px;background:rgba(255,255,255,.025);color:#d9c999;font:900 18px/1 inherit;cursor:pointer;touch-action:manipulation}",
      ".weather-display-panel-body{display:grid;gap:8px;padding:9px}.weather-display-card{padding:8px;border:1px solid rgba(255,255,255,.07);border-radius:11px;background:rgba(255,255,255,.024)}.weather-display-card-title{font-size:10px;font-weight:840;color:#f1d48c;margin-bottom:6px}.weather-display-card-note{font-size:8px;line-height:1.42;opacity:.64;margin-top:6px}",
      ".weather-layer-display-entry{grid-column:1/-1;border-color:rgba(236,185,91,.27)!important;background:linear-gradient(135deg,rgba(126,86,22,.17),rgba(108,35,92,.12))!important}.weather-layer-display-entry strong{color:#f2d48c!important}",
      "@media(max-width:720px){.weather-display-panel{width:min(272px,calc(100% - 16px))}.weather-display-panel.minimized{width:min(172px,calc(100% - 16px))}.weather-display-panel-head{min-height:48px}.weather-display-style-button,.weather-display-legend-button{min-height:36px}.weather-display-eye-control{width:46px;height:46px;bottom:52px}}"
    ].join("");
    this.shadow.append(style);
  },

  _weatherDisplayStatusCopy(){
    const state=this._weatherDisplayState();
    if(state.probing||state.status==="checking")return {title:"WeatherRouter wird geprüft",note:"Status und Darstellungsfähigkeiten werden abgefragt."};
    if(state.status==="missing")return {title:"WeatherRouter nicht installiert",note:"Die Darstellung bleibt sichtbar angekündigt, wird auf der Karte aber nicht als funktionslose Bedienung angeboten."};
    if(state.status==="incompatible")return {title:"WeatherRouter erkannt, Consumer API nicht kompatibel",note:"Die Darstellungsfunktion bleibt deaktiviert, bis ein kompatibler Consumer-V1-Vertrag verfügbar ist."};
    if(state.status==="offline")return {title:"WeatherRouter erkannt, derzeit nicht bereit",note:"WeatherRouter ist offline, deaktiviert, startet noch oder die Consumer-Verbindung ist vorübergehend nicht erreichbar. Gewitterradar läuft unverändert weiter."};
    if(state.status==="ready-empty")return {title:"WeatherRouter bereit",note:"Der aktuelle Katalog enthält noch keine von dieser Ausbaustufe unterstützte Darstellungsfähigkeit."};
    return {title:"WeatherRouter bereit",note:"Darstellungsmenü verfügbar · aktuell Niederschlag als erster Renderer."};
  },

  _mountWeatherDisplaySettings(){
    if(!this.shadow)return;
    this._weatherDisplayEnsureStyle();
    const content=this.shadow.querySelector("#weather-engine-section > .settings-section-content");
    if(!content)return;
    let block=content.querySelector('[data-weather-display-settings="true"]');
    if(!block){
      block=document.createElement("div");
      block.className="weather-display-settings";
      block.dataset.weatherDisplaySettings="true";
      block.innerHTML=
        '<div class="weather-display-settings-head">'+eyeSvg(false)+'<div><div class="weather-display-settings-title">Darstellung</div><div class="weather-display-settings-status" data-weather-display-status></div></div></div>'+
        '<div class="weather-display-row"><div class="weather-display-row-label">Augen-Bedienelement<span class="weather-display-row-note">Direkter Zugriff auf der Karte</span></div><button class="weather-display-switch" type="button" role="switch" data-weather-display-setting="controlVisible" aria-label="Augen-Bedienelement auf der Karte anzeigen"></button></div>'+
        '<div class="weather-display-row"><div class="weather-display-row-label">Darstellungsmenü<span class="weather-display-row-note">Aktivieren ist nicht dasselbe wie Minimieren</span></div><button class="weather-display-switch" type="button" role="switch" data-weather-display-setting="enabled" aria-label="Darstellungsmenü aktivieren"></button></div>'+
        '<div class="weather-display-row"><div class="weather-display-row-label">Startzustand minimiert<span class="weather-display-row-note">Das Menü bleibt dabei aktiv</span></div><button class="weather-display-switch" type="button" role="switch" data-weather-display-setting="minimized" aria-label="Darstellungsmenü minimiert starten"></button></div>'+
        '<div class="weather-display-row"><div class="weather-display-row-label">Position merken<span class="weather-display-row-note">Nur auf diesem Gerät und in diesem Browserprofil</span></div><button class="weather-display-switch" type="button" role="switch" data-weather-display-setting="rememberPosition" aria-label="Position des Darstellungsmenüs merken"></button></div>'+
        '<div class="weather-display-row" data-weather-display-precipitation-row><div class="weather-display-row-label">Niederschlag<span class="weather-display-row-note">Nur optische Aufbereitung · Daten und Routing bleiben unverändert</span></div><div class="weather-display-style-picker">'+
          WEATHER_DISPLAY_STYLES.precipitation.map(id=>'<button class="weather-display-style-button" type="button" data-weather-display-style="'+id+'">'+LABELS[id]+'</button>').join("")+
        '</div></div>'+
        '<div class="weather-display-row"><div class="weather-display-row-label">Legende<span class="weather-display-row-note">Auto: passend zum aktiven Layer · Ein: alle aktiven WR-Legenden · Aus: verborgen</span></div><div class="weather-display-legend-picker"><button class="weather-display-legend-button" type="button" data-weather-display-legend-mode="auto">Auto</button><button class="weather-display-legend-button" type="button" data-weather-display-legend-mode="on">Ein</button><button class="weather-display-legend-button" type="button" data-weather-display-legend-mode="off">Aus</button></div></div>'+
        '<div class="weather-display-row"><div class="weather-display-row-label">Position zurücksetzen</div><button class="weather-display-action" type="button" data-weather-display-reset-position>Zurücksetzen</button></div>'+
        '<div class="weather-display-row"><div class="weather-display-row-label">Auf Standard zurücksetzen</div><button class="weather-display-action" type="button" data-weather-display-reset-all>Standard</button></div>'+
        '<div class="weather-display-row"><div class="weather-display-row-label">WeatherRouter-Status</div><button class="weather-display-action" type="button" data-weather-display-refresh>Neu prüfen</button></div>';
      const results=this.shadow.getElementById("weather-engine-results")?.closest(".settings-row");
      if(results?.parentNode===content)content.insertBefore(block,results);else content.append(block);
      block.querySelectorAll("[data-weather-display-setting]").forEach(button=>button.addEventListener("click",()=>{
        const key=button.dataset.weatherDisplaySetting,state=this._weatherDisplayState();
        if(key==="enabled"&&!this._weatherDisplayIsAvailable())return;
        this._weatherDisplayPatch({[key]:!state.config[key]});
      }));
      block.querySelectorAll("[data-weather-display-style]").forEach(button=>button.addEventListener("click",()=>{
        if(!this._weatherDisplayIsAvailable())return;
        this._weatherDisplayPatch({styles:{precipitation:button.dataset.weatherDisplayStyle}});
      }));
      block.querySelectorAll("[data-weather-display-legend-mode]").forEach(button=>button.addEventListener("click",()=>{
        if(!this._weatherDisplayIsAvailable())return;
        this._weatherDisplaySetLegendMode(button.dataset.weatherDisplayLegendMode);
      }));
      block.querySelector("[data-weather-display-reset-position]")?.addEventListener("click",()=>{
        this._weatherDisplayPatch({position:{...DEFAULT_POSITION}});
        requestAnimationFrame(()=>this._weatherDisplayPositionPanel());
      });
      block.querySelector("[data-weather-display-reset-all]")?.addEventListener("click",()=>{
        this._weatherDisplayState().config=cloneDefault();
        this._weatherDisplayPersist();
        this._weatherDisplaySyncUi();
        this._weatherDisplayRefreshRenderedLayers();
        this._weatherLegendSyncUi?.();
      });
      block.querySelector("[data-weather-display-refresh]")?.addEventListener("click",()=>this._weatherDisplayProbe({refresh:true}));
    }
    this._weatherDisplayEnsureMapUi();
    this._weatherDisplaySyncUi();
    this._weatherDisplayProbe();
  },

  _weatherDisplayEnsureMapUi(){
    const state=this._weatherDisplayState(),mapCard=this.shadow?.getElementById("map-card");
    if(!mapCard)return;
    this._weatherDisplayEnsureStyle();
    let eye=this.shadow.getElementById("weather-display-eye-control");
    if(!eye){
      eye=document.createElement("button");
      eye.id="weather-display-eye-control";
      eye.className="weather-display-eye-control";
      eye.type="button";
      eye.setAttribute("aria-label","WeatherRouter-Darstellungsmenü");
      eye.addEventListener("click",event=>{event.preventDefault();event.stopPropagation();if(!this._weatherDisplayIsAvailable())return;this._weatherDisplayPatch({enabled:!this._weatherDisplayState().config.enabled});});
      mapCard.append(eye);
    }
    let panel=this.shadow.getElementById("weather-display-panel");
    if(!panel){
      panel=document.createElement("section");
      panel.id="weather-display-panel";
      panel.className="weather-display-panel";
      panel.setAttribute("aria-label","WeatherRouter-Darstellung");
      panel.innerHTML=
        '<div class="weather-display-panel-head" data-weather-display-drag-handle>'+eyeSvg(true)+'<div><div class="weather-display-panel-title">Darstellung</div><div class="weather-display-panel-sub">WeatherRouter · optische Aufbereitung</div></div><button class="weather-display-minimize" type="button" data-weather-display-minimize aria-label="Darstellungsmenü minimieren">−</button></div>'+
        '<div class="weather-display-panel-body"><div class="weather-display-card" data-weather-display-precipitation-card><div class="weather-display-card-title">Niederschlag</div><div class="weather-display-style-picker">'+
        WEATHER_DISPLAY_STYLES.precipitation.map(id=>'<button class="weather-display-style-button" type="button" data-weather-display-style="'+id+'">'+LABELS[id]+'</button>').join("")+
        '</div><div class="weather-display-card-note">Präzise zeigt die gelieferten Rasterdaten möglichst unverändert. Ausgewogen und Weich glätten ausschließlich die Darstellung; Messwerte, Rasterauflösung, Routing und Warnstatus bleiben identisch.</div></div>'+
        '<div class="weather-display-card" data-weather-display-legend-card><div class="weather-display-card-title">Legende</div><div class="weather-display-legend-picker"><button class="weather-display-legend-button" type="button" data-weather-display-legend-mode="auto">Auto</button><button class="weather-display-legend-button" type="button" data-weather-display-legend-mode="on">Ein</button><button class="weather-display-legend-button" type="button" data-weather-display-legend-mode="off">Aus</button></div><div class="weather-display-card-note">Auto zeigt die wichtigste passende Legende. Ein zeigt alle aktiven WeatherRouter-Legenden. Aus blendet nur die Legende aus; Wetterlayer und Daten bleiben unverändert.</div></div></div>';
      panel.querySelector("[data-weather-display-minimize]")?.addEventListener("click",event=>{event.preventDefault();event.stopPropagation();this._weatherDisplayPatch({minimized:!this._weatherDisplayState().config.minimized});requestAnimationFrame(()=>this._weatherDisplayPositionPanel());});
      panel.querySelectorAll("[data-weather-display-style]").forEach(button=>button.addEventListener("click",event=>{event.preventDefault();event.stopPropagation();this._weatherDisplayPatch({styles:{precipitation:button.dataset.weatherDisplayStyle}});}));
      panel.querySelectorAll("[data-weather-display-legend-mode]").forEach(button=>button.addEventListener("click",event=>{event.preventDefault();event.stopPropagation();this._weatherDisplaySetLegendMode(button.dataset.weatherDisplayLegendMode);}));
      mapCard.append(panel);
      this._weatherDisplayBindPanelDrag(panel,panel.querySelector("[data-weather-display-drag-handle]"));
    }
    if(!state.resizeHandler){
      state.resizeHandler=()=>requestAnimationFrame(()=>this._weatherDisplayPositionPanel());
      window.addEventListener("resize",state.resizeHandler,{passive:true});
      window.visualViewport?.addEventListener?.("resize",state.resizeHandler,{passive:true});
    }
    if(!state.lifecycleAbortHandler){
      state.lifecycleAbortHandler=()=>this._weatherDisplayCancelDrag?.();
      window.addEventListener("blur",state.lifecycleAbortHandler,true);
      window.addEventListener("pagehide",state.lifecycleAbortHandler,true);
      document.addEventListener("visibilitychange",state.lifecycleAbortHandler,true);
    }
    state.mounted=true;
  },

  _weatherDisplayPositionPanel(position=this._weatherDisplayState().config.position){
    const state=this._weatherDisplayState();
    if(state.drag)return;
    const panel=this.shadow?.getElementById("weather-display-panel"),mapCard=this.shadow?.getElementById("map-card"),mapEl=this.shadow?.getElementById("map");
    if(!panel||panel.hidden||!mapCard||!mapEl)return;
    const cardRect=mapCard.getBoundingClientRect(),mapRect=mapEl.getBoundingClientRect(),width=panel.offsetWidth||panel.getBoundingClientRect().width,height=panel.offsetHeight||panel.getBoundingClientRect().height;
    if(!cardRect.width||!mapRect.width||!width||!height)return;
    const inset=10,minLeft=Math.max(0,mapRect.left-cardRect.left+inset),minTop=Math.max(0,mapRect.top-cardRect.top+inset);
    const maxLeft=Math.max(minLeft,mapRect.right-cardRect.left-width-inset),maxTop=Math.max(minTop,mapRect.bottom-cardRect.top-height-inset);
    const source=state.config.rememberPosition?position:DEFAULT_POSITION;
    panel.style.left=(minLeft+(maxLeft-minLeft)*clamp(source?.x??DEFAULT_POSITION.x,0,1))+"px";
    panel.style.top=(minTop+(maxTop-minTop)*clamp(source?.y??DEFAULT_POSITION.y,0,1))+"px";
  },

  _weatherDisplayCancelDrag(){
    const state=this.__weatherDisplayState;if(!state?.drag)return;
    const panel=this.shadow?.getElementById("weather-display-panel");
    const handle=panel?.querySelector?.("[data-weather-display-drag-handle]");
    const pointerId=state.drag.pointerId;
    state.drag=null;
    panel?.classList.remove("dragging");
    try{if(pointerId!=null&&handle?.hasPointerCapture?.(pointerId))handle.releasePointerCapture(pointerId);}catch(_error){}
    requestAnimationFrame(()=>this._weatherDisplayPositionPanel());
  },

  _weatherDisplayBindPanelDrag(panel,handle){
    if(!panel||!handle||handle.dataset.weatherDisplayDragBound==="1")return;
    handle.dataset.weatherDisplayDragBound="1";
    const begin=event=>{
      if(event.button!==undefined&&event.button!==0)return;
      if(event.target?.closest?.("button"))return;
      const state=this._weatherDisplayState(),mapCard=this.shadow?.getElementById("map-card"),mapEl=this.shadow?.getElementById("map");
      if(!mapCard||!mapEl)return;
      event.preventDefault();event.stopPropagation();
      const rect=panel.getBoundingClientRect(),cardRect=mapCard.getBoundingClientRect();
      state.drag={pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,startLeft:rect.left-cardRect.left,startTop:rect.top-cardRect.top};
      panel.classList.add("dragging");
      try{handle.setPointerCapture?.(event.pointerId);}catch(_error){}
    };
    const move=event=>{
      const state=this._weatherDisplayState(),drag=state.drag;if(!drag||drag.pointerId!==event.pointerId)return;
      event.preventDefault();event.stopPropagation();
      const mapCard=this.shadow?.getElementById("map-card"),mapEl=this.shadow?.getElementById("map");if(!mapCard||!mapEl)return;
      const cardRect=mapCard.getBoundingClientRect(),mapRect=mapEl.getBoundingClientRect(),width=panel.offsetWidth,height=panel.offsetHeight,inset=10;
      const minLeft=Math.max(0,mapRect.left-cardRect.left+inset),minTop=Math.max(0,mapRect.top-cardRect.top+inset);
      const maxLeft=Math.max(minLeft,mapRect.right-cardRect.left-width-inset),maxTop=Math.max(minTop,mapRect.bottom-cardRect.top-height-inset);
      panel.style.left=clamp(drag.startLeft+event.clientX-drag.startX,minLeft,maxLeft)+"px";
      panel.style.top=clamp(drag.startTop+event.clientY-drag.startY,minTop,maxTop)+"px";
    };
    const end=event=>{
      const state=this._weatherDisplayState(),drag=state.drag;if(!drag||drag.pointerId!==event.pointerId)return;
      event.preventDefault();event.stopPropagation();
      const mapCard=this.shadow?.getElementById("map-card"),mapEl=this.shadow?.getElementById("map");
      state.drag=null;panel.classList.remove("dragging");
      try{handle.releasePointerCapture?.(event.pointerId);}catch(_error){}
      if(!mapCard||!mapEl)return;
      const cardRect=mapCard.getBoundingClientRect(),mapRect=mapEl.getBoundingClientRect(),rect=panel.getBoundingClientRect(),inset=10;
      const minLeft=Math.max(0,mapRect.left-cardRect.left+inset),minTop=Math.max(0,mapRect.top-cardRect.top+inset);
      const maxLeft=Math.max(minLeft,mapRect.right-cardRect.left-rect.width-inset),maxTop=Math.max(minTop,mapRect.bottom-cardRect.top-rect.height-inset);
      const left=clamp(rect.left-cardRect.left,minLeft,maxLeft),top=clamp(rect.top-cardRect.top,minTop,maxTop);
      const x=maxLeft>minLeft?(left-minLeft)/(maxLeft-minLeft):0,y=maxTop>minTop?(top-minTop)/(maxTop-minTop):0;
      if(state.config.rememberPosition)this._weatherDisplayPatch({position:{x,y}});
      else this._weatherDisplayPositionPanel(DEFAULT_POSITION);
    };
    handle.addEventListener("pointerdown",begin);
    handle.addEventListener("pointermove",move);
    handle.addEventListener("pointerup",end);
    handle.addEventListener("pointercancel",end);
    handle.addEventListener("lostpointercapture",event=>{
      const state=this._weatherDisplayState();
      if(state.drag?.pointerId===event.pointerId)this._weatherDisplayCancelDrag();
    });
  },

  _weatherDisplaySyncUi(){
    if(!this.shadow)return;
    const state=this._weatherDisplayState(),available=state.status==="ready",copy=this._weatherDisplayStatusCopy(),config=state.config;
    const block=this.shadow.querySelector('[data-weather-display-settings="true"]');
    if(block){
      block.classList.toggle("offline",!available);
      const status=block.querySelector("[data-weather-display-status]");if(status)status.textContent=copy.title+" · "+copy.note;
      const headGlyph=block.querySelector(".weather-display-eye-glyph");if(headGlyph)headGlyph.outerHTML=eyeSvg(available&&config.enabled);
      block.querySelectorAll("[data-weather-display-setting]").forEach(button=>{
        const key=button.dataset.weatherDisplaySetting,on=Boolean(config[key]);
        button.classList.toggle("on",on);button.setAttribute("aria-checked",on?"true":"false");
        button.disabled=!available;
      });
      const precipRow=block.querySelector("[data-weather-display-precipitation-row]");
      if(precipRow)precipRow.hidden=!available;
      block.querySelectorAll("[data-weather-display-style]").forEach(button=>{const active=button.dataset.weatherDisplayStyle===config.styles.precipitation;button.classList.toggle("active",active);button.setAttribute("aria-pressed",active?"true":"false");button.disabled=!available;});
      block.querySelectorAll("[data-weather-display-legend-mode]").forEach(button=>{const active=button.dataset.weatherDisplayLegendMode===config.legendMode;button.classList.toggle("active",active);button.setAttribute("aria-pressed",active?"true":"false");button.disabled=!available;});
      const reset=block.querySelector("[data-weather-display-reset-position]");if(reset)reset.disabled=!available;
    }
    this._weatherDisplayEnsureMapUi();
    const eye=this.shadow.getElementById("weather-display-eye-control");
    if(eye){
      eye.hidden=!(available&&config.controlVisible);
      eye.classList.toggle("active",available&&config.enabled);
      eye.innerHTML=eyeSvg(available&&config.enabled);
      eye.setAttribute("aria-pressed",available&&config.enabled?"true":"false");
      eye.title=config.enabled?"Darstellungsmenü deaktivieren":"Darstellungsmenü aktivieren";
    }
    const panel=this.shadow.getElementById("weather-display-panel");
    if(panel){
      panel.hidden=!(available&&config.enabled);
      panel.classList.toggle("minimized",config.minimized);
      const minimize=panel.querySelector("[data-weather-display-minimize]");
      if(minimize){minimize.textContent=config.minimized?"+":"−";minimize.setAttribute("aria-label",config.minimized?"Darstellungsmenü aufklappen":"Darstellungsmenü minimieren");}
      const glyph=panel.querySelector(".weather-display-eye-glyph");if(glyph)glyph.outerHTML=eyeSvg(true);
      const precipCard=panel.querySelector("[data-weather-display-precipitation-card]");if(precipCard)precipCard.hidden=!available;
      panel.querySelectorAll("[data-weather-display-style]").forEach(button=>{const active=button.dataset.weatherDisplayStyle===config.styles.precipitation;button.classList.toggle("active",active);button.setAttribute("aria-pressed",active?"true":"false");});
      panel.querySelectorAll("[data-weather-display-legend-mode]").forEach(button=>{const active=button.dataset.weatherDisplayLegendMode===config.legendMode;button.classList.toggle("active",active);button.setAttribute("aria-pressed",active?"true":"false");});
      if(!panel.hidden)requestAnimationFrame(()=>this._weatherDisplayPositionPanel());
    }
  },

  _weatherDisplayLayerMenuMarkup(){
    if(!this._weatherDisplayIsAvailable())return "";
    const config=this._weatherDisplayState().config;
    return '<button class="weather-layer-action weather-layer-display-entry'+(config.enabled?' active':'')+'" type="button" data-weather-layer-action="display"><strong>Darstellung</strong><small>'+(
      config.enabled?(config.minimized?"aktiv · minimiert":"aktiv · geöffnet"):"Schnellmenü öffnen"
    )+'</small></button>';
  },

  _weatherDisplayOpenFromLayerMenu(){
    if(!this._weatherDisplayIsAvailable())return false;
    this._weatherDisplayPatch({enabled:true,minimized:false});
    this._setMapDisplayMenuOpen?.(false);
    requestAnimationFrame(()=>this._weatherDisplayPositionPanel());
    return true;
  },

  _resumeWeatherDisplay(){
    if(!this.shadow)return;
    this._weatherDisplayEnsureMapUi();
    this._weatherDisplaySyncUi();
    this._weatherDisplayProbe({refresh:true});
  },

  _teardownWeatherDisplay(){
    const state=this.__weatherDisplayState;if(!state)return;
    state.generation+=1;state.probing=false;
    this._weatherDisplayCancelDrag();
    if(state.resizeHandler){
      window.removeEventListener("resize",state.resizeHandler);
      window.visualViewport?.removeEventListener?.("resize",state.resizeHandler);
      state.resizeHandler=null;
    }
    if(state.lifecycleAbortHandler){
      window.removeEventListener("blur",state.lifecycleAbortHandler,true);
      window.removeEventListener("pagehide",state.lifecycleAbortHandler,true);
      document.removeEventListener("visibilitychange",state.lifecycleAbortHandler,true);
      state.lifecycleAbortHandler=null;
    }
    state.mounted=false;
  }
}));
