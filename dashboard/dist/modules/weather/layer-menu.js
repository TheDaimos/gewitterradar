import { defineModule } from "../core/runtime.js?v=41108r1";
import { WEATHER_ROUTER_CAPABILITIES, WEATHER_ROUTER_LOGO_IMAGE } from "./consumer-client.js?v=41108r1";

export const MODULE_META=Object.freeze({
  id:"weather.layer-menu",version:"1.0.0",group:"Weather-Engine",function:"WeatherRouter Layer Hub",
  subfunctions:["Consumer-V1-Erkennung","Kartenfähigkeiten","Schnellzugriff","Fachbereiche","Niederschlags-Layer","Status & Rücknavigation"],
  file:"modules/weather/layer-menu.js"
});

const CATALOG_REFRESH_MS=30000;
const MAP_RESOURCE_TYPES=Object.freeze(new Set(["raster_tile","hazard_feed","event_feed","planetary_tile"]));
const MAP_SPATIAL_CONTEXTS=Object.freeze(new Set(["bbox","global"]));
const DOMAIN_ORDER=Object.freeze(["weather","space","pollen","natural_hazards","civil_protection","aviation","biological_hazards","security"]);
const DOMAIN_LABELS=Object.freeze({weather:"Wetter",space:"Weltraum",pollen:"Umwelt & Pollen",natural_hazards:"Naturgefahren",civil_protection:"Bevölkerungsschutz",aviation:"Luftfahrt",biological_hazards:"Biologische Gefahren",security:"Sicherheit"});
const QUICK_ACCESS=Object.freeze([
  Object.freeze({id:"precipitation",label:"Niederschlag",phenomena:["precipitation","rain"],preferredCapability:WEATHER_ROUTER_CAPABILITIES.precipitation}),
  Object.freeze({id:"clouds",label:"Wolken",phenomena:["clouds"]}),
  Object.freeze({id:"wind",label:"Wind",phenomena:["wind"]}),
  Object.freeze({id:"uv",label:"UV",phenomena:["uv"]})
]);
const RESOURCE_LABELS=Object.freeze({raster_tile:"Kartenraster",hazard_feed:"Gefahren",event_feed:"Ereignisse",planetary_tile:"Planetenkacheln",image_sequence:"Bildfolge"});
const safeArray=value=>Array.isArray(value)?value:[];
const escapeHtml=value=>String(value??"").replace(/[&<>"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));
const labelDomain=id=>DOMAIN_LABELS[id]||String(id||"Weitere").replaceAll("_"," ").replace(/(^|\s)\S/g,char=>char.toUpperCase());
const rendererId=capability=>capability?.id===WEATHER_ROUTER_CAPABILITIES.precipitation?"precipitation":null;
const resourceSummary=capability=>safeArray(capability?.resource_types).filter(type=>type in RESOURCE_LABELS).map(type=>RESOURCE_LABELS[type]).join(" · ")||"Kartenfähigkeit";

export function isWeatherLayerCapability(capability){
  if(!capability||capability.enabled!==true||capability.available!==true)return false;
  const spatial=safeArray(capability.spatial_contexts);
  if(!spatial.some(context=>MAP_SPATIAL_CONTEXTS.has(context)))return false;
  const resources=safeArray(capability.resource_types);
  if(resources.some(type=>MAP_RESOURCE_TYPES.has(type)))return true;
  if(resources.includes("image_sequence")){
    const intent=capability.intent_contract;
    return Boolean(intent&&intent.kind==="visual_layer"&&intent.resource_type==="image_sequence");
  }
  return false;
}

export function buildWeatherLayerCatalog(capabilities){
  const usable=safeArray(capabilities).filter(isWeatherLayerCapability).map(item=>({...item,phenomena:safeArray(item.phenomena),resource_types:safeArray(item.resource_types),spatial_contexts:safeArray(item.spatial_contexts)}));
  const byDomain=new Map();
  for(const capability of usable){const domain=String(capability.domain||"other");if(!byDomain.has(domain))byDomain.set(domain,[]);byDomain.get(domain).push(capability);}
  const order=new Map(DOMAIN_ORDER.map((id,index)=>[id,index]));
  const categories=[...byDomain.entries()].map(([id,items])=>({id,label:labelDomain(id),capabilities:items.sort((a,b)=>String(a.name||a.id).localeCompare(String(b.name||b.id),"de"))})).sort((a,b)=>(order.get(a.id)??999)-(order.get(b.id)??999)||a.label.localeCompare(b.label,"de"));
  const quick=QUICK_ACCESS.map(definition=>{
    const matches=usable.filter(item=>definition.phenomena.some(phenomenon=>item.phenomena.includes(phenomenon)));
    if(!matches.length)return null;
    const capability=matches.find(item=>item.id===definition.preferredCapability)||matches.find(item=>rendererId(item))||matches[0];
    return {...definition,capability,count:matches.length,renderer:rendererId(capability)};
  }).filter(Boolean);
  return {capabilities:usable,categories,quick};
}

export const installWeatherLayerMenu=defineModule(MODULE_META,()=>({
  _weatherLayerMenuState(){
    if(!this.__weatherLayerMenuState)this.__weatherLayerMenuState={bound:false,view:"map-display",category:null,focusCapability:null,discovery:null,catalog:null,model:{capabilities:[],categories:[],quick:[]},probing:false,lastProbeAt:0,generation:0,busyCapability:null};
    return this.__weatherLayerMenuState;
  },

  _weatherLayerMenuEnsureStyle(){
    const root=this.shadow;if(!root||root.getElementById("weather-layer-menu-style"))return;
    const style=document.createElement("style");style.id="weather-layer-menu-style";style.textContent=`
      .weather-layer-entry-wrap{display:grid;gap:4px;margin-top:3px;padding-top:5px;border-top:1px solid rgba(255,95,126,.16)}
      .weather-layer-entry{appearance:none;border:1px solid rgba(255,91,128,.24);min-height:40px;padding:6px 8px;border-radius:9px;display:flex;align-items:center;gap:7px;background:linear-gradient(135deg,rgba(92,22,43,.22),rgba(71,23,91,.16));color:#efbac8;font:780 10px/1.15 inherit;cursor:pointer;touch-action:manipulation;text-align:left;box-shadow:inset 0 0 0 1px rgba(214,89,255,.025),0 0 13px rgba(199,55,255,.04)}
      .weather-layer-entry:hover,.weather-layer-action:hover,.weather-layer-category:hover{border-color:rgba(255,104,144,.40);background-color:rgba(255,92,137,.075)}
      .weather-layer-entry:focus-visible,.weather-layer-back:focus-visible,.weather-layer-action:focus-visible,.weather-layer-category:focus-visible,.weather-layer-refresh:focus-visible{outline:2px solid rgba(255,122,173,.78);outline-offset:1px}
      .weather-layer-entry img{width:22px;height:22px;object-fit:contain;flex:0 0 22px;filter:drop-shadow(0 0 7px rgba(216,78,255,.18))}
      .weather-layer-entry-label{min-width:0;flex:1}.weather-layer-entry-label b{display:block;font-size:10.5px}.weather-layer-entry-label small{display:block;margin-top:2px;font-size:8px;opacity:.67;font-weight:650;white-space:normal}
      .weather-layer-dot{width:7px;height:7px;border-radius:50%;flex:0 0 7px;background:#b17447;box-shadow:0 0 7px rgba(231,151,74,.36)}.weather-layer-dot.ready{background:#6bd9a3;box-shadow:0 0 8px rgba(82,223,157,.52)}.weather-layer-dot.busy{background:#d28cff;box-shadow:0 0 8px rgba(204,96,255,.58)}
      .map-display-menu.weather-layer-view{width:min(304px,calc(100vw - 28px));min-width:min(304px,calc(100vw - 28px));max-width:min(304px,calc(100vw - 28px));padding:8px;border-color:rgba(255,88,126,.34);background:radial-gradient(circle at 86% 10%,rgba(174,55,225,.14),transparent 46%),linear-gradient(160deg,rgba(55,12,27,.97),rgba(17,11,28,.97) 58%,rgba(9,13,19,.98));box-shadow:0 18px 46px rgba(0,0,0,.55),0 0 28px rgba(205,57,242,.12),inset 0 1px 0 rgba(255,174,199,.055);backdrop-filter:blur(18px)}
      .map-display-menu.weather-layer-view::after{background:rgba(22,11,24,.98);border-right-color:rgba(255,88,126,.34);border-bottom-color:rgba(255,88,126,.34)}
      .weather-layer-panel{display:grid;gap:8px;min-width:0;color:#ebdfe6;font-family:inherit}
      .weather-layer-head{display:grid;grid-template-columns:34px 1fr 26px;gap:6px;align-items:center;min-height:38px}.weather-layer-back{appearance:none;width:34px;height:34px;border:1px solid rgba(255,118,151,.22);border-radius:9px;background:rgba(255,255,255,.035);color:#efb3c4;font:900 18px/1 inherit;cursor:pointer;touch-action:manipulation}.weather-layer-head-main{min-width:0;text-align:center}.weather-layer-kicker{font-size:7.5px;font-weight:850;letter-spacing:.10em;text-transform:uppercase;color:#d989b2}.weather-layer-title{margin-top:2px;font-size:12px;font-weight:860;color:#ffe4ec;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.weather-layer-logo{width:25px;height:25px;object-fit:contain;opacity:.92;filter:drop-shadow(0 0 8px rgba(211,74,255,.22))}
      .weather-layer-status{padding:7px 9px;border:1px solid rgba(255,106,145,.14);border-radius:10px;background:rgba(255,255,255,.025);font-size:9px;line-height:1.35;color:#d7c9d0}.weather-layer-status b{color:#ffb8cb}.weather-layer-status.ready b{color:#8be7b8}.weather-layer-status.warn b{color:#f2b377}
      .weather-layer-section{display:grid;gap:5px}.weather-layer-section-title{padding:0 3px;font-size:7.5px;font-weight:850;letter-spacing:.10em;text-transform:uppercase;color:#b989a3}
      .weather-layer-quick{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px}.weather-layer-action,.weather-layer-category{appearance:none;border:1px solid rgba(255,112,149,.18);border-radius:10px;background:rgba(255,255,255,.028);color:#e8dce2;min-height:44px;padding:7px 8px;font:760 9.5px/1.2 inherit;cursor:pointer;touch-action:manipulation;text-align:left}.weather-layer-action[disabled]{cursor:default;opacity:.72}.weather-layer-action strong,.weather-layer-category strong{display:block;color:#ffd5e0;font-size:10px}.weather-layer-action small,.weather-layer-category small{display:block;margin-top:3px;opacity:.65;font-size:7.8px;font-weight:650}.weather-layer-action.active{border-color:rgba(103,226,168,.38);background:rgba(46,141,102,.12)}.weather-layer-action.busy{border-color:rgba(210,140,255,.42);box-shadow:0 0 14px rgba(203,84,255,.08)}
      .weather-layer-categories{display:grid;gap:4px}.weather-layer-category{display:grid;grid-template-columns:1fr auto;align-items:center;min-height:42px}.weather-layer-category-count{font-size:8px;color:#cb92ad;padding-left:8px}
      .weather-layer-capabilities{display:grid;gap:5px;max-height:min(48vh,390px);overflow:auto;overscroll-behavior:contain}.weather-layer-capability{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:7px;align-items:center;padding:7px 8px;border:1px solid rgba(255,255,255,.07);border-radius:10px;background:rgba(5,7,12,.22)}.weather-layer-capability.focus{border-color:rgba(255,115,151,.35);box-shadow:0 0 16px rgba(203,84,255,.08)}.weather-layer-capability-name{font-size:9.5px;font-weight:800;color:#f8dae3}.weather-layer-capability-meta{margin-top:3px;font-size:7.5px;line-height:1.3;color:#ad9da5;overflow-wrap:anywhere}.weather-layer-capability-state{font-size:7.4px;line-height:1.25;text-align:right;color:#a98d9b;white-space:nowrap}
      .weather-layer-empty{padding:10px;border:1px dashed rgba(255,114,151,.17);border-radius:10px;font-size:8.5px;line-height:1.4;color:#bfaab4}.weather-layer-refresh{appearance:none;border:0;background:transparent;color:#b788a0;font:720 8px/1 inherit;padding:5px;cursor:pointer}
      @media(max-width:720px){.map-display-menu.weather-layer-view{width:min(290px,calc(100vw - 20px));min-width:min(290px,calc(100vw - 20px));max-width:min(290px,calc(100vw - 20px))}.weather-layer-entry,.weather-layer-action,.weather-layer-category{min-height:46px}.weather-layer-capabilities{max-height:min(43vh,330px)}}
      #card-root.ipad-device .weather-layer-entry,#card-root.ipad-device .weather-layer-action,#card-root.ipad-device .weather-layer-category,#card-root.ipad-device .weather-layer-back{touch-action:manipulation;-webkit-tap-highlight-color:transparent}
    `;root.append(style);
  },

  _weatherLayerMenuSyncEntry(){
    const state=this._weatherLayerMenuState(),menu=this.shadow?.getElementById("map-display-switch");if(!menu)return;
    const shouldShow=Boolean(state.discovery?.present&&state.discovery?.compatible);
    let wrap=menu.querySelector('[data-weather-layer-entry-wrap="true"]');
    if(!shouldShow){wrap?.remove();return;}
    if(!wrap){wrap=document.createElement("div");wrap.className="weather-layer-entry-wrap";wrap.dataset.weatherLayerEntryWrap="true";const button=document.createElement("button");button.type="button";button.className="weather-layer-entry";button.dataset.weatherLayerEntry="true";button.addEventListener("click",event=>{event.preventDefault();event.stopPropagation();this._weatherLayerMenuOpenHub();});wrap.append(button);menu.append(wrap);}
    const button=wrap.querySelector("[data-weather-layer-entry]"),ready=Boolean(state.discovery?.ready),busy=state.probing;
    if(button){button.innerHTML=`<img src="${escapeHtml(WEATHER_ROUTER_LOGO_IMAGE)}" alt="" aria-hidden="true"><span class="weather-layer-entry-label"><b>WeatherRouter</b><small>${ready?"Kartenebenen & Fachbereiche":"vorhanden · noch nicht bereit"}</small></span><span class="weather-layer-dot${ready?" ready":busy?" busy":""}" aria-hidden="true"></span>`;button.setAttribute("aria-label",ready?"WeatherRouter-Kartenebenen öffnen":"WeatherRouter-Status öffnen");}
    wrap.hidden=state.view!=="map-display";
  },

  async _weatherLayerMenuProbe({refresh=false}={}){
    const state=this._weatherLayerMenuState(),now=Date.now();
    if(state.probing)return;
    const due=refresh||!state.discovery||(now-state.lastProbeAt)>=CATALOG_REFRESH_MS;
    if(!due){this._weatherLayerMenuSyncEntry();return;}
    const generation=++state.generation;state.probing=true;state.lastProbeAt=now;this._weatherLayerMenuSyncEntry();if(state.view!=="map-display")this._weatherLayerMenuRender();
    try{
      const discovery=await this._weatherRouterDiscovery?.({refresh:true});
      if(generation!==state.generation)return;
      state.discovery=discovery||null;state.catalog=null;state.model={capabilities:[],categories:[],quick:[]};
      if(discovery?.present&&discovery?.compatible&&discovery?.ready){
        const catalog=await this._weatherRouterCapabilities?.({refresh:true,filter:{available_only:true}});
        if(generation!==state.generation)return;
        state.catalog=catalog||null;
        if(catalog?.status==="ready")state.model=buildWeatherLayerCatalog(catalog.capabilities);
      }
    }catch(_error){if(generation===state.generation){state.discovery=state.discovery||{present:false,compatible:false,ready:false};state.catalog=null;state.model={capabilities:[],categories:[],quick:[]};}}
    finally{if(generation===state.generation){state.probing=false;this._weatherLayerMenuSyncEntry();if(state.view!=="map-display")this._weatherLayerMenuRender();}}
  },

  _weatherLayerMenuSetView(view,{category=null,focusCapability=null}={}){
    const state=this._weatherLayerMenuState(),menu=this.shadow?.getElementById("map-display-switch");if(!menu)return;
    state.view=view;state.category=category;state.focusCapability=focusCapability;
    const weatherView=view!=="map-display";menu.classList.toggle("weather-layer-view",weatherView);
    const title=this.shadow?.getElementById("map-display-menu-title");if(title)title.hidden=weatherView;
    menu.querySelectorAll("[data-map-display-mode]").forEach(node=>{node.hidden=weatherView;});
    const entry=menu.querySelector('[data-weather-layer-entry-wrap="true"]');if(entry)entry.hidden=weatherView;
    let panel=menu.querySelector('[data-weather-layer-panel="true"]');
    if(!weatherView){panel?.remove();return;}
    if(!panel){panel=document.createElement("div");panel.className="weather-layer-panel";panel.dataset.weatherLayerPanel="true";panel.addEventListener("click",event=>this._weatherLayerMenuHandleAction(event));panel.addEventListener("keydown",event=>{if(event.key==="Escape"){event.preventDefault();event.stopPropagation();this._setMapDisplayMenuOpen?.(false);}});menu.append(panel);}
    this._weatherLayerMenuRender();
  },

  _weatherLayerMenuOpenHub(){this._weatherLayerMenuSetView("weather-router");this._weatherLayerMenuProbe();},

  _weatherLayerMenuStatusMarkup(){
    const state=this._weatherLayerMenuState(),discovery=state.discovery;
    if(state.probing)return '<div class="weather-layer-status"><b>WeatherRouter</b> · Status und Kartenfähigkeiten werden geprüft …</div>';
    if(!discovery)return '<div class="weather-layer-status"><b>WeatherRouter</b> · noch nicht geprüft</div>';
    if(!discovery.ready){const version=escapeHtml(discovery.router?.integration_version||"");return `<div class="weather-layer-status warn"><b>Vorhanden, aber noch nicht bereit</b>${version?` · ${version}`:""}<br>Gewitterradar läuft unverändert weiter.</div>`;}
    if(state.catalog?.status!=="ready")return '<div class="weather-layer-status warn"><b>WeatherRouter bereit</b> · Kartenkatalog derzeit nicht verfügbar.</div>';
    return `<div class="weather-layer-status ready"><b>Bereit</b> · ${state.model.capabilities.length} kartentaugliche Fähigkeiten · Providerwahl automatisch durch WeatherRouter.</div>`;
  },

  _weatherLayerMenuPrecipitationState(){
    const radar=typeof this._weatherRadarState==="function"?this._weatherRadarState():null;if(!radar)return {enabled:false,label:"nicht angebunden"};
    if(this._weatherLayerMenuState().busyCapability===WEATHER_ROUTER_CAPABILITIES.precipitation)return {enabled:Boolean(radar.enabled),label:"wird geschaltet …",busy:true};
    if(!radar.enabled)return {enabled:false,label:"Aus"};
    const code=radar.lastUnavailable?.code;if(code==="outside_coverage")return {enabled:true,label:"Ein · hier keine Abdeckung"};
    if(radar.layer)return {enabled:true,label:"Ein"};if(code)return {enabled:true,label:"Ein · Daten warten"};return {enabled:true,label:"Ein · lädt"};
  },

  _weatherLayerMenuQuickMarkup(){
    const state=this._weatherLayerMenuState();if(!state.model.quick.length)return "";
    return `<div class="weather-layer-section"><div class="weather-layer-section-title">Schnellzugriff</div><div class="weather-layer-quick">${state.model.quick.map(item=>{const capability=item.capability;if(item.renderer==="precipitation"){const layerState=this._weatherLayerMenuPrecipitationState();return `<button class="weather-layer-action${layerState.enabled?" active":""}${layerState.busy?" busy":""}" type="button" data-weather-layer-action="toggle" data-capability="${escapeHtml(capability.id)}" ${layerState.busy?"disabled":""}><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(layerState.label)}</small></button>`;}return `<button class="weather-layer-action" type="button" data-weather-layer-action="focus" data-category="${escapeHtml(capability.domain)}" data-capability="${escapeHtml(capability.id)}"><strong>${escapeHtml(item.label)}</strong><small>${item.count>1?`${item.count} passende Kartenfähigkeiten`:`verfügbar · ${escapeHtml(resourceSummary(capability))}`}</small></button>`;}).join("")}</div></div>`;
  },

  _weatherLayerMenuCategoriesMarkup(){
    const categories=this._weatherLayerMenuState().model.categories;if(!categories.length)return '<div class="weather-layer-empty">Der Katalog enthält derzeit keine aktivierten und kartentauglichen Fähigkeiten.</div>';
    return `<div class="weather-layer-section"><div class="weather-layer-section-title">Fachbereiche</div><div class="weather-layer-categories">${categories.map(category=>`<button class="weather-layer-category" type="button" data-weather-layer-action="category" data-category="${escapeHtml(category.id)}"><span><strong>${escapeHtml(category.label)}</strong><small>${category.capabilities.some(item=>rendererId(item))?"mindestens ein Layer direkt schaltbar":"Katalog · Renderer folgen schrittweise"}</small></span><span class="weather-layer-category-count">${category.capabilities.length} ›</span></button>`).join("")}</div></div>`;
  },

  _weatherLayerMenuCategoryMarkup(categoryId){
    const state=this._weatherLayerMenuState(),category=state.model.categories.find(item=>item.id===categoryId);if(!category)return '<div class="weather-layer-empty">Fachbereich ist im aktuellen Katalog nicht mehr verfügbar.</div>';
    return `<div class="weather-layer-capabilities">${category.capabilities.map(capability=>{const focus=state.focusCapability===capability.id;if(rendererId(capability)==="precipitation"){const layerState=this._weatherLayerMenuPrecipitationState();return `<div class="weather-layer-capability${focus?" focus":""}"><div><div class="weather-layer-capability-name">${escapeHtml(capability.name||"Niederschlag")}</div><div class="weather-layer-capability-meta">${escapeHtml(resourceSummary(capability))} · ${escapeHtml(safeArray(capability.phenomena).join(", ")||capability.family||"")}</div></div><button class="weather-layer-action${layerState.enabled?" active":""}${layerState.busy?" busy":""}" type="button" data-weather-layer-action="toggle" data-capability="${escapeHtml(capability.id)}" ${layerState.busy?"disabled":""}>${escapeHtml(layerState.label)}</button></div>`;}return `<div class="weather-layer-capability${focus?" focus":""}"><div><div class="weather-layer-capability-name">${escapeHtml(capability.name||capability.id)}</div><div class="weather-layer-capability-meta">${escapeHtml(resourceSummary(capability))} · ${escapeHtml(safeArray(capability.phenomena).join(", ")||capability.family||"")}</div></div><div class="weather-layer-capability-state">verfügbar<br>Renderer folgt</div></div>`;}).join("")}</div>`;
  },

  _weatherLayerMenuRender(){
    const state=this._weatherLayerMenuState();if(state.view==="map-display")return;
    const panel=this.shadow?.querySelector('[data-weather-layer-panel="true"]');if(!panel)return;
    const category=state.view.startsWith("weather-router-category:")?state.category:null,title=category?(state.model.categories.find(item=>item.id===category)?.label||"Fachbereich"):"WeatherRouter";
    panel.innerHTML=`<div class="weather-layer-head"><button class="weather-layer-back" type="button" data-weather-layer-action="${category?"back-hub":"back-map"}" aria-label="Zurück">‹</button><div class="weather-layer-head-main"><div class="weather-layer-kicker">Kartenebenen</div><div class="weather-layer-title">${escapeHtml(title)}</div></div><img class="weather-layer-logo" src="${escapeHtml(WEATHER_ROUTER_LOGO_IMAGE)}" alt="" aria-hidden="true"></div>${this._weatherLayerMenuStatusMarkup()}${category?this._weatherLayerMenuCategoryMarkup(category):`${this._weatherLayerMenuQuickMarkup()}${state.discovery?.ready&&state.catalog?.status==="ready"?this._weatherLayerMenuCategoriesMarkup():""}`}${state.discovery?.present&&state.discovery.compatible?'<button class="weather-layer-refresh" type="button" data-weather-layer-action="refresh">WeatherRouter neu prüfen</button>':""}`;
  },

  async _weatherLayerMenuToggle(capabilityId){
    if(capabilityId!==WEATHER_ROUTER_CAPABILITIES.precipitation||typeof this._setWeatherRadarEnabled!=="function")return;
    const state=this._weatherLayerMenuState();if(state.busyCapability)return;state.busyCapability=capabilityId;this._weatherLayerMenuRender();
    try{const radar=this._weatherRadarState?.();await this._setWeatherRadarEnabled(!radar?.enabled);}catch(_error){}finally{state.busyCapability=null;this._weatherLayerMenuRender();this._weatherLayerMenuSyncEntry();}
  },

  _weatherLayerMenuHandleAction(event){
    const button=event.target?.closest?.("[data-weather-layer-action]");if(!button)return;event.preventDefault();event.stopPropagation();const action=button.dataset.weatherLayerAction;
    if(action==="back-map"){this._weatherLayerMenuSetView("map-display");return;}if(action==="back-hub"){this._weatherLayerMenuSetView("weather-router");return;}if(action==="refresh"){this._weatherLayerMenuProbe({refresh:true});return;}if(action==="toggle"){this._weatherLayerMenuToggle(button.dataset.capability);return;}
    if(action==="category"||action==="focus"){const category=button.dataset.category;if(!category)return;this._weatherLayerMenuSetView(`weather-router-category:${category}`,{category,focusCapability:action==="focus"?button.dataset.capability:null});requestAnimationFrame(()=>this.shadow?.querySelector(".weather-layer-capability.focus")?.scrollIntoView?.({block:"nearest"}));}
  },

  _bindMapDisplayMenuExtension(){const state=this._weatherLayerMenuState();if(state.bound||!this.shadow)return;state.bound=true;this._weatherLayerMenuEnsureStyle();this._weatherLayerMenuSyncEntry();if(this._hass)this._weatherLayerMenuProbe();},
  _mapDisplayMenuExtensionOpenChanged(open){const state=this._weatherLayerMenuState();if(!open){if(state.view!=="map-display")this._weatherLayerMenuSetView("map-display");return;}this._weatherLayerMenuProbe();},
  _syncMapDisplayMenuExtension(){this._weatherLayerMenuSyncEntry();if(this._weatherLayerMenuState().view!=="map-display")this._weatherLayerMenuRender();},
  _teardownMapDisplayMenuExtension(){const state=this._weatherLayerMenuState();state.generation+=1;state.probing=false;state.bound=false;state.view="map-display";state.category=null;state.focusCapability=null;}
}));
