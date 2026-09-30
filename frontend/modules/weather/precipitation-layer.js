import { defineModule } from "../core/runtime.js?v=41102r1";

export const MODULE_META=Object.freeze({
  id:"weather.precipitation-layer",
  version:"1.0.0",
  group:"Weather-Engine",
  function:"Niederschlagsradar-Kartenebene",
  subfunctions:["Raster-Kacheladapter","Web-Mercator-BBOX","Quelle & Aktualität","Abdeckung","Legende","Anfragebegrenzung"],
  file:"modules/weather/precipitation-layer.js"
});

const CAPABILITY="weather.radar.precipitation";
const STORAGE_KEY="gewitterradar:weather-engine:precipitation-enabled";
const REFRESH_MS=300000;
const VIEWPORT_MIN_MS=15000;
const SAME_VIEW_MIN_MS=240000;

const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const finite=value=>Number.isFinite(Number(value))?Number(value):null;
export const weatherRasterBbox3857=({x,y,z})=>{
  const origin=20037508.342789244;
  const span=(origin*2)/(2**z);
  const west=-origin+x*span;
  const east=west+span;
  const north=origin-y*span;
  const south=north-span;
  return [west,south,east,north].map(value=>Number(value.toFixed(6))).join(",");
};
export const expandWeatherRasterTileUrl=(template,coords)=>{
  const max=(2**coords.z)-1;
  return String(template)
    .replaceAll("{z}",String(coords.z))
    .replaceAll("{x}",String(coords.x))
    .replaceAll("{y}",String(coords.y))
    .replaceAll("{-y}",String(max-coords.y))
    .replaceAll("{s}","a")
    .replaceAll("{r}","")
    .replaceAll("{bbox-epsg-3857}",weatherRasterBbox3857(coords));
};

export const installWeatherRadar=defineModule(MODULE_META,(deps)=>{const {loadLeafletJs}=deps;return ({
  _weatherRadarState(){
    if(!this.__weatherRadarState){
      let enabled=false;
      try{enabled=localStorage.getItem(STORAGE_KEY)==="1";}catch(_error){}
      this.__weatherRadarState={enabled,layer:null,map:null,onMove:null,refreshTimer:null,debounceTimer:null,mapWaitTimer:null,inFlight:false,pending:false,lastRequestAt:0,lastViewport:"",lastReady:null,lastUnavailable:null};
    }
    return this.__weatherRadarState;
  },

  _weatherRadarViewport(){
    const map=this._map;
    if(!map||typeof map.getBounds!=="function")return null;
    const bounds=map.getBounds();
    const wrap=n=>((Number(n)+180)%360+360)%360-180;
    const context={type:"bbox",west:wrap(bounds.getWest()),south:Math.max(-90,bounds.getSouth()),east:wrap(bounds.getEast()),north:Math.min(90,bounds.getNorth())};
    const signature=[context.west,context.south,context.east,context.north].map(n=>n.toFixed(2)).join("|");
    return {context,signature};
  },

  _weatherRadarEnsureMapHooks(){
    const state=this._weatherRadarState();
    if(!this._map){
      if(!state.mapWaitTimer&&this.isConnected!==false)state.mapWaitTimer=setTimeout(()=>{state.mapWaitTimer=null;this._weatherRadarEnsureMapHooks();},500);
      return false;
    }
    if(state.map===this._map)return true;
    if(state.map&&state.onMove)try{state.map.off("moveend",state.onMove);state.map.off("zoomend",state.onMove);}catch(_error){}
    state.map=this._map;
    state.onMove=()=>this._scheduleWeatherRadarRefresh("viewport",900);
    state.map.on("moveend",state.onMove);
    state.map.on("zoomend",state.onMove);
    return true;
  },

  _scheduleWeatherRadarRefresh(reason="timer",delay=0){
    const state=this._weatherRadarState();
    if(!state.enabled)return;
    if(state.debounceTimer)clearTimeout(state.debounceTimer);
    state.debounceTimer=setTimeout(()=>{state.debounceTimer=null;this._refreshWeatherRadar({reason});},Math.max(0,delay));
  },

  async _setWeatherRadarEnabled(enabled,{persist=true}={}){
    const state=this._weatherRadarState();
    state.enabled=Boolean(enabled);
    if(persist)try{localStorage.setItem(STORAGE_KEY,state.enabled?"1":"0");}catch(_error){}
    this._weatherRadarUpdateControls();
    if(!state.enabled){
      this._weatherRadarRemoveLayer();
      if(state.refreshTimer){clearInterval(state.refreshTimer);state.refreshTimer=null;}
      return;
    }
    this._weatherRadarEnsureMapHooks();
    if(!state.refreshTimer)state.refreshTimer=setInterval(()=>this._scheduleWeatherRadarRefresh("timer",0),REFRESH_MS);
    await this._refreshWeatherRadar({reason:"enable",force:true});
  },

  _weatherRadarCreateLayer(L,payload,attribution){
    const tileSize=Math.max(1,Math.round(finite(payload.tile_size)||256));
    const minZoom=Math.max(0,finite(payload.min_zoom)||0);
    const maxZoom=Math.max(minZoom,finite(payload.max_zoom)||18);
    const opacity=clamp(finite(payload.default_opacity)??0.58,0,1);
    const map=this._map;
    if(!map.getPane("gr-weather-radar")){
      const pane=map.createPane("gr-weather-radar");
      pane.style.zIndex="230";
      pane.style.pointerEvents="none";
    }
    const layer=L.gridLayer({pane:"gr-weather-radar",tileSize,minZoom,maxZoom,opacity,attribution:attribution||"",updateWhenIdle:true,keepBuffer:1});
    const template=String(payload.tile_url||"");
    layer.createTile=(coords,done)=>{
      const img=document.createElement("img");
      img.alt="";
      img.setAttribute("role","presentation");
      img.referrerPolicy="strict-origin-when-cross-origin";
      img.style.width="100%";img.style.height="100%";
      img.onload=()=>done?.(null,img);
      img.onerror=()=>done?.(new Error("Raster tile failed"),img);
      img.src=expandWeatherRasterTileUrl(template,coords);
      return img;
    };
    return layer;
  },

  _weatherRadarRemoveLayer(){
    const state=this._weatherRadarState();
    if(state.layer){try{state.layer.remove();}catch(_error){}state.layer=null;}
    this._weatherRadarRenderLegend(null);
  },

  _weatherRadarRenderLegend(model){
    const host=this.shadow?.getElementById("map-legend");
    if(!host)return;
    let item=host.querySelector('[data-weather-radar-legend="true"]');
    if(!model){item?.remove();return;}
    if(!item){
      item=document.createElement("span");
      item.className="legend-item";
      item.dataset.weatherRadarLegend="true";
      item.style.cssText="align-items:center;gap:5px;max-width:100%;";
      host.append(item);
    }
    item.replaceChildren();
    const icon=document.createElement("span");icon.textContent="▦";icon.setAttribute("aria-hidden","true");icon.style.cssText="color:#8fc7ff;font-weight:900";
    const text=document.createElement("span");text.textContent=model.label;text.style.cssText="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:210px";
    item.append(icon,text);
    if(model.legendUrl){
      const img=document.createElement("img");
      img.src=model.legendUrl;img.alt=model.legendTitle||"Niederschlagslegende";img.loading="lazy";img.referrerPolicy="strict-origin-when-cross-origin";
      img.style.cssText="height:20px;max-width:120px;object-fit:contain;border-radius:3px;background:rgba(255,255,255,.86)";
      item.append(img);
    }
    item.title=model.title;
  },

  _weatherRadarDescribe(answer){
    const provider=answer?.provenance?.provider_name||"WeatherRouter";
    const age=finite(answer?.freshness?.age_seconds);
    const ageText=age==null?"Alter unbekannt":age<90?Math.round(age)+" s":Math.round(age/60)+" min";
    const coverage=answer?.provenance?.coverage||"aktueller Kartenausschnitt";
    const limitations=Array.isArray(answer?.provenance?.limitations)?answer.provenance.limitations.filter(Boolean):[];
    return {provider,ageText,coverage,limitations};
  },

  _weatherRadarApplyReady(answer,viewport){
    const state=this._weatherRadarState();
    const payload=answer.resource.payload;
    const description=this._weatherRadarDescribe(answer);
    const attribution=payload.attribution||answer.provenance?.attribution||description.provider;
    loadLeafletJs().then(L=>{
      if(!state.enabled||!this._map)return;
      const next=this._weatherRadarCreateLayer(L,payload,attribution);
      next.addTo(this._map);
      const old=state.layer;state.layer=next;
      if(old)try{old.remove();}catch(_error){}
    }).catch(()=>{});
    state.lastReady={answer,viewport,at:Date.now()};
    state.lastUnavailable=null;
    const legend=payload.legend&&typeof payload.legend==="object"?payload.legend:null;
    const label="Niederschlag · "+description.provider+" · "+description.ageText;
    const title=[
      label,
      "Abdeckung: "+description.coverage,
      answer.routing?.degraded?"Datenweg eingeschränkt":null,
      ...description.limitations
    ].filter(Boolean).join(" · ");
    this._weatherRadarRenderLegend({label,title,legendUrl:legend?.url||null,legendTitle:legend?.title||"Niederschlagslegende"});
    this._weatherRadarUpdateControls();
  },

  _weatherRadarHandleUnavailable(answer){
    const state=this._weatherRadarState();
    state.lastUnavailable=answer?.unavailable||{code:"temporarily_unavailable"};
    const code=state.lastUnavailable.code||"temporarily_unavailable";
    if(["outside_coverage","capability_not_supported","no_eligible_provider","router_disabled","router_not_ready","requirements_not_met","source_stale"].includes(code))this._weatherRadarRemoveLayer();
    this._weatherRadarUpdateControls();
  },

  async _refreshWeatherRadar({reason="manual",force=false}={}){
    const state=this._weatherRadarState();
    if(!state.enabled)return;
    if(!this._weatherRadarEnsureMapHooks()){this._scheduleWeatherRadarRefresh(reason,600);return;}
    const viewport=this._weatherRadarViewport();if(!viewport)return;
    const now=Date.now();
    const minWait=state.lastViewport===viewport.signature?SAME_VIEW_MIN_MS:VIEWPORT_MIN_MS;
    if(!force&&state.lastRequestAt&&now-state.lastRequestAt<minWait){
      this._scheduleWeatherRadarRefresh(reason,minWait-(now-state.lastRequestAt)+50);
      return;
    }
    if(state.inFlight){state.pending=true;return;}
    state.inFlight=true;state.pending=false;state.lastRequestAt=now;state.lastViewport=viewport.signature;
    this._weatherRadarUpdateControls("Niederschlagsradar wird aktualisiert …");
    try{
      const discovery=await this._weatherRouterDiscovery();
      if(!discovery?.ready){this._weatherRadarHandleUnavailable({unavailable:{code:discovery?.compatible?"router_not_ready":"capability_not_supported"}});return;}
      const catalog=await this._weatherRouterCapabilities({filter:{domains:["weather"],resource_types:["raster_tile"],available_only:true}});
      const capability=catalog?.status==="ready"?catalog.capabilities.find(item=>item.id===CAPABILITY&&item.enabled&&item.available):null;
      if(!capability){this._weatherRadarHandleUnavailable({unavailable:{code:"capability_not_supported"}});return;}
      const contexts=Array.isArray(capability.spatial_contexts)?capability.spatial_contexts:[];
      const context=contexts.includes("bbox")?viewport.context:contexts.includes("global")?{type:"global"}:null;
      if(!context){this._weatherRadarHandleUnavailable({unavailable:{code:"requirements_not_met"}});return;}
      const answer=await this._weatherRouterResolve(CAPABILITY,context,{requirements:{resource_types:["raster_tile"],source_classes:["observation"],max_age_seconds:900}});
      if(answer.status!=="ready"){this._weatherRadarHandleUnavailable(answer);return;}
      this._weatherRadarApplyReady(answer,viewport);
    }catch(_error){
      state.lastUnavailable={code:"temporarily_unavailable"};
      this._weatherRadarUpdateControls();
    }finally{
      state.inFlight=false;
      if(state.pending){state.pending=false;this._scheduleWeatherRadarRefresh("pending",250);}
    }
  },

  _weatherRadarUpdateControls(message=null){
    const state=this._weatherRadarState();
    const toggle=this.shadow?.getElementById("weather-radar-toggle");
    const status=this.shadow?.getElementById("weather-radar-status");
    if(toggle){
      toggle.setAttribute("aria-pressed",state.enabled?"true":"false");
      toggle.textContent=state.enabled?"Ein":"Aus";
      toggle.dataset.active=state.enabled?"1":"0";
    }
    if(!status)return;
    if(message){status.textContent=message;return;}
    if(!state.enabled){status.textContent="Aus · keine zusätzlichen Radar-Anfragen";return;}
    if(state.lastReady){
      const d=this._weatherRadarDescribe(state.lastReady.answer);
      status.textContent="Aktiv · "+d.provider+" · "+d.ageText+" · Abdeckung: "+d.coverage+(state.lastReady.answer.routing?.degraded?" · eingeschränkt":"");
      return;
    }
    const code=state.lastUnavailable?.code;
    const label={
      outside_coverage:"Für diesen Kartenausschnitt keine Radar-Abdeckung",
      source_stale:"Radarquelle derzeit zu alt",
      router_not_ready:"WeatherRouter nicht betriebsbereit",
      router_disabled:"WeatherRouter deaktiviert",
      no_eligible_provider:"Keine geeignete Radarquelle verfügbar",
      requirements_not_met:"Radarquelle erfüllt die Anforderungen nicht",
      capability_not_supported:"Niederschlagsradar derzeit nicht verfügbar"
    }[code];
    status.textContent=label||"Aktiv · wartet auf Radar-Daten";
  },

  _mountWeatherRadarSettings(){
    const section=this.shadow?.getElementById("weather-engine-section");
    const content=section?.querySelector(".settings-section-content");
    if(!content||content.querySelector('[data-weather-radar-settings="true"]'))return;
    const block=document.createElement("div");block.dataset.weatherRadarSettings="true";
    const row=document.createElement("div");row.className="settings-row";
    const label=document.createElement("div");label.className="settings-row-label";
    const title=document.createElement("div");title.textContent="Niederschlagsradar · Kartenebene";
    const hint=document.createElement("div");hint.textContent="WeatherRouter wählt die geeignete Quelle. Blitzortung bleibt unabhängig aktiv.";hint.style.cssText="font-size:.76rem;opacity:.68;margin-top:3px";
    label.append(title,hint);
    const toggle=document.createElement("button");toggle.className="settings-language-button settings-control";toggle.id="weather-radar-toggle";toggle.type="button";
    toggle.addEventListener("click",()=>this._setWeatherRadarEnabled(!this._weatherRadarState().enabled));
    row.append(label,toggle);
    const statusRow=document.createElement("div");statusRow.className="settings-row";
    const status=document.createElement("div");status.className="settings-row-label";status.id="weather-radar-status";status.setAttribute("role","status");status.setAttribute("aria-live","polite");
    statusRow.append(status);block.append(row,statusRow);
    const results=this.shadow?.getElementById("weather-engine-results")?.closest(".settings-row");
    if(results?.parentNode===content)content.insertBefore(block,results);else content.append(block);
    this._weatherRadarUpdateControls();
    this._weatherRadarEnsureMapHooks();
    if(this._weatherRadarState().enabled)this._setWeatherRadarEnabled(true,{persist:false});
  },

  _resumeWeatherRadar(){
    const state=this._weatherRadarState();
    this._weatherRadarEnsureMapHooks();
    if(state.enabled){
      if(!state.refreshTimer)state.refreshTimer=setInterval(()=>this._scheduleWeatherRadarRefresh("timer",0),REFRESH_MS);
      this._scheduleWeatherRadarRefresh("resume",1200);
    }
  },

  _teardownWeatherRadar(){
    const state=this._weatherRadarState();
    if(state.debounceTimer)clearTimeout(state.debounceTimer);
    if(state.mapWaitTimer)clearTimeout(state.mapWaitTimer);
    if(state.refreshTimer)clearInterval(state.refreshTimer);
    state.debounceTimer=state.mapWaitTimer=state.refreshTimer=null;
    if(state.map&&state.onMove)try{state.map.off("moveend",state.onMove);state.map.off("zoomend",state.onMove);}catch(_error){}
    state.map=null;state.onMove=null;state.inFlight=false;state.pending=false;
  }
});});
