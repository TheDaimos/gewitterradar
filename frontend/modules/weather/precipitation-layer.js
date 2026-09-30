import { defineModule } from "../core/runtime.js?v=41102r1";

export const MODULE_META=Object.freeze({
  id:"weather.precipitation-layer",
  version:"1.1.0",
  group:"Weather-Engine",
  function:"Niederschlagsradar-Kartenebene",
  subfunctions:["Raster-Kacheladapter","Web-Mercator-BBOX","Quelle & Aktualität","Abdeckung","Legende","Anfragebegrenzung","Räumlicher Vorladepuffer","Ressourcenschutz"],
  file:"modules/weather/precipitation-layer.js"
});

const CAPABILITY="weather.radar.precipitation";
const STORAGE_KEY="gewitterradar:weather-engine:precipitation-enabled";
const PRELOAD_PROFILE_STORAGE_KEY="gewitterradar:weather-engine:precipitation-preload-profile";
const PRELOAD_CUSTOM_STORAGE_KEY="gewitterradar:weather-engine:precipitation-preload-custom-percent";
const REFRESH_MS=300000;
const VIEWPORT_MIN_MS=15000;
const SAME_VIEW_MIN_MS=240000;
const PRELOAD_CONCURRENCY=4;

export const WEATHER_RADAR_PRELOAD_PROFILES=Object.freeze({
  off:Object.freeze({label:"Aus",percent:0,maxTiles:0,maxBytes:0}),
  small:Object.freeze({label:"Klein",percent:15,maxTiles:24,maxBytes:8*1024*1024}),
  normal:Object.freeze({label:"Normal",percent:30,maxTiles:48,maxBytes:16*1024*1024}),
  large:Object.freeze({label:"Groß",percent:50,maxTiles:96,maxBytes:32*1024*1024}),
  custom:Object.freeze({label:"Benutzerdefiniert",percent:null,maxTiles:128,maxBytes:40*1024*1024})
});

const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const finite=value=>Number.isFinite(Number(value))?Number(value):null;
export const weatherRadarPreloadPolicy=(profile="normal",customPercent=30,tileSize=256)=>{
  const selected=WEATHER_RADAR_PRELOAD_PROFILES[profile]||WEATHER_RADAR_PRELOAD_PROFILES.normal;
  const percent=selected.percent==null?clamp(Math.round(finite(customPercent)??30),0,100):selected.percent;
  const normalizedTileSize=Math.max(1,Math.round(finite(tileSize)||256));
  const bytesPerTile=normalizedTileSize*normalizedTileSize*4;
  const memoryLimitedTiles=selected.maxBytes>0?Math.max(1,Math.floor(selected.maxBytes/bytesPerTile)):0;
  const maxTiles=percent>0?Math.min(selected.maxTiles,memoryLimitedTiles):0;
  const areaFactor=Number(((1+(2*percent/100))**2).toFixed(2));
  return Object.freeze({profile:WEATHER_RADAR_PRELOAD_PROFILES[profile]?profile:"normal",label:selected.label,percent,maxTiles,maxBytes:selected.maxBytes,bytesPerTile,areaFactor});
};
export const weatherRadarPreloadTilePlan=(pixelBounds,policy)=>{
  const z=Math.max(0,Math.round(finite(pixelBounds?.z)||0));
  const tileSize=Math.max(1,Math.round(finite(pixelBounds?.tileSize)||256));
  const minX=finite(pixelBounds?.minX),minY=finite(pixelBounds?.minY),maxX=finite(pixelBounds?.maxX),maxY=finite(pixelBounds?.maxY);
  if([minX,minY,maxX,maxY].some(value=>value==null)||maxX<=minX||maxY<=minY||!policy||policy.percent<=0||policy.maxTiles<=0){
    return {tiles:[],visibleCount:0,expandedCount:0,availableExtra:0,selectedExtra:0,percent:policy?.percent||0,areaFactor:policy?.areaFactor||1};
  }
  const marginX=(maxX-minX)*(policy.percent/100);
  const marginY=(maxY-minY)*(policy.percent/100);
  const toRange=(a,b)=>[Math.floor(a/tileSize),Math.floor((b-0.000001)/tileSize)];
  const [visibleMinX,visibleMaxX]=toRange(minX,maxX);
  const [visibleMinY,visibleMaxY]=toRange(minY,maxY);
  const [expandedMinX,expandedMaxX]=toRange(minX-marginX,maxX+marginX);
  const [expandedMinY,expandedMaxY]=toRange(minY-marginY,maxY+marginY);
  const world=2**z,maxIndex=world-1;
  const wrapX=x=>((x%world)+world)%world;
  const visible=new Set();
  for(let y=visibleMinY;y<=visibleMaxY;y++){
    if(y<0||y>maxIndex)continue;
    for(let x=visibleMinX;x<=visibleMaxX;x++)visible.add(wrapX(x)+"|"+y);
  }
  const centerX=(visibleMinX+visibleMaxX)/2,centerY=(visibleMinY+visibleMaxY)/2;
  const candidates=new Map();
  for(let y=expandedMinY;y<=expandedMaxY;y++){
    if(y<0||y>maxIndex)continue;
    for(let x=expandedMinX;x<=expandedMaxX;x++){
      const nx=wrapX(x),key=nx+"|"+y;
      if(visible.has(key))continue;
      const distance=Math.abs(x-centerX)+Math.abs(y-centerY);
      const existing=candidates.get(key);
      if(!existing||distance<existing.distance)candidates.set(key,{x:nx,y,z,distance});
    }
  }
  const ordered=[...candidates.values()].sort((a,b)=>a.distance-b.distance||a.y-b.y||a.x-b.x);
  const tiles=ordered.slice(0,policy.maxTiles).map(({x,y,z})=>({x,y,z}));
  return {tiles,visibleCount:visible.size,expandedCount:visible.size+candidates.size,availableExtra:candidates.size,selectedExtra:tiles.length,percent:policy.percent,areaFactor:policy.areaFactor};
};
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
      let enabled=false,preloadProfile="normal",preloadCustomPercent=30;
      try{
        enabled=localStorage.getItem(STORAGE_KEY)==="1";
        const storedProfile=localStorage.getItem(PRELOAD_PROFILE_STORAGE_KEY);
        if(storedProfile&&WEATHER_RADAR_PRELOAD_PROFILES[storedProfile])preloadProfile=storedProfile;
        const storedCustom=finite(localStorage.getItem(PRELOAD_CUSTOM_STORAGE_KEY));
        if(storedCustom!=null)preloadCustomPercent=clamp(Math.round(storedCustom),0,100);
      }catch(_error){}
      this.__weatherRadarState={
        enabled,preloadProfile,preloadCustomPercent,layer:null,map:null,onMove:null,refreshTimer:null,debounceTimer:null,mapWaitTimer:null,
        preloadTimer:null,preloadQueue:[],preloadCache:new Map(),preloadActive:0,preloadGeneration:0,preloadMetrics:null,
        inFlight:false,pending:false,lastRequestAt:0,lastViewport:"",lastReady:null,lastUnavailable:null
      };
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
    state.onMove=()=>{this._scheduleWeatherRadarRefresh("viewport",900);this._scheduleWeatherRadarPreload("viewport",220);};
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
      this._weatherRadarClearPreload();
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
    const displayMaxZoom=Math.max(maxZoom,finite(map.getMaxZoom?.())??maxZoom);
    const layer=L.gridLayer({pane:"gr-weather-radar",tileSize,minZoom,maxZoom:displayMaxZoom,maxNativeZoom:maxZoom,opacity,attribution:attribution||"",updateWhenIdle:true,keepBuffer:1});
    const template=String(payload.tile_url||"");
    layer.createTile=(coords,done)=>{
      const url=expandWeatherRasterTileUrl(template,coords);
      const state=this._weatherRadarState();
      const cached=state.preloadCache.get(url);
      if(cached?.status==="ready"&&cached.img){
        state.preloadCache.delete(url);
        cached.lastUsed=Date.now();
        const img=cached.img;
        img.onload=null;img.onerror=null;
        queueMicrotask(()=>done?.(null,img));
        this._weatherRadarUpdatePreloadControls();
        return img;
      }
      const img=document.createElement("img");
      img.alt="";
      img.setAttribute("role","presentation");
      img.referrerPolicy="strict-origin-when-cross-origin";
      img.style.width="100%";img.style.height="100%";
      img.onload=()=>done?.(null,img);
      img.onerror=()=>done?.(new Error("Raster tile failed"),img);
      img.src=url;
      return img;
    };
    return layer;
  },

  _weatherRadarPreloadPolicy(payload=null){
    const state=this._weatherRadarState();
    return weatherRadarPreloadPolicy(state.preloadProfile,state.preloadCustomPercent,payload?.tile_size||256);
  },

  _weatherRadarPreloadPixelBounds(tileZoom){
    const map=this._map;
    if(!map||typeof map.getPixelBounds!=="function")return null;
    const bounds=map.getPixelBounds(),currentZoom=finite(map.getZoom?.());
    if(currentZoom==null)return null;
    const scale=2**(tileZoom-currentZoom);
    return {minX:bounds.min.x*scale,minY:bounds.min.y*scale,maxX:bounds.max.x*scale,maxY:bounds.max.y*scale,z:tileZoom};
  },

  _weatherRadarClearPreload({resetMetrics=true}={}){
    const state=this._weatherRadarState();
    state.preloadGeneration+=1;
    state.preloadQueue=[];
    if(state.preloadTimer){clearTimeout(state.preloadTimer);state.preloadTimer=null;}
    for(const entry of state.preloadCache.values()){
      if(entry?.img){entry.img.onload=null;entry.img.onerror=null;}
    }
    state.preloadCache.clear();
    if(resetMetrics)state.preloadMetrics=null;
    this._weatherRadarUpdatePreloadControls();
  },

  _scheduleWeatherRadarPreload(_reason="viewport",delay=180){
    const state=this._weatherRadarState();
    if(!state.enabled)return;
    if(state.preloadTimer)clearTimeout(state.preloadTimer);
    state.preloadTimer=setTimeout(()=>{state.preloadTimer=null;this._weatherRadarRunPreload();},Math.max(0,delay));
  },

  _weatherRadarPumpPreload(generation,payload,policy){
    const state=this._weatherRadarState();
    if(generation!==state.preloadGeneration)return;
    while(state.preloadActive<PRELOAD_CONCURRENCY&&state.preloadQueue.length){
      const coords=state.preloadQueue.shift();
      const url=expandWeatherRasterTileUrl(String(payload.tile_url||""),coords);
      if(state.preloadCache.has(url))continue;
      const img=document.createElement("img");
      img.alt="";img.setAttribute("role","presentation");img.referrerPolicy="strict-origin-when-cross-origin";
      const entry={img,status:"loading",coords,lastUsed:Date.now(),generation};
      state.preloadCache.set(url,entry);
      state.preloadActive+=1;
      const finish=(ok)=>{
        state.preloadActive=Math.max(0,state.preloadActive-1);
        const current=state.preloadCache.get(url);
        if(current===entry){
          if(ok&&generation===state.preloadGeneration){entry.status="ready";entry.lastUsed=Date.now();}
          else state.preloadCache.delete(url);
        }
        this._weatherRadarUpdatePreloadControls();
        this._weatherRadarPumpPreload(generation,payload,policy);
      };
      img.onload=()=>finish(true);
      img.onerror=()=>finish(false);
      img.src=url;
    }
  },

  _weatherRadarRunPreload(){
    const state=this._weatherRadarState();
    const answer=state.lastReady?.answer,payload=answer?.resource?.payload;
    if(!state.enabled||!payload||!this._map)return;
    const policy=this._weatherRadarPreloadPolicy(payload);
    if(policy.percent<=0||policy.maxTiles<=0){this._weatherRadarClearPreload();return;}
    if(typeof document!=="undefined"&&document.hidden)return;
    const minZoom=Math.max(0,Math.round(finite(payload.min_zoom)||0));
    const maxZoom=Math.max(minZoom,Math.round(finite(payload.max_zoom)||18));
    const currentZoom=Math.round(finite(this._map.getZoom?.())??minZoom);
    const tileZoom=clamp(currentZoom,minZoom,maxZoom);
    const pixelBounds=this._weatherRadarPreloadPixelBounds(tileZoom);
    if(!pixelBounds)return;
    const plan=weatherRadarPreloadTilePlan({...pixelBounds,tileSize:payload.tile_size||256},policy);
    const template=String(payload.tile_url||"");
    const desired=new Set(plan.tiles.map(coords=>expandWeatherRasterTileUrl(template,coords)));
    const stale=[...state.preloadCache.entries()]
      .filter(([url,entry])=>!desired.has(url)&&entry?.status==="ready")
      .sort((a,b)=>(a[1].lastUsed||0)-(b[1].lastUsed||0));
    while(state.preloadCache.size>Math.max(0,policy.maxTiles-plan.selectedExtra)&&stale.length){
      const [url]=stale.shift();state.preloadCache.delete(url);
    }
    state.preloadGeneration+=1;
    const generation=state.preloadGeneration;
    state.preloadQueue=plan.tiles.filter(coords=>!state.preloadCache.has(expandWeatherRasterTileUrl(template,coords)));
    while(state.preloadCache.size+state.preloadQueue.length>policy.maxTiles)state.preloadQueue.pop();
    state.preloadMetrics={...plan,policy,tileZoom,requested:state.preloadQueue.length,updatedAt:Date.now()};
    this._weatherRadarUpdatePreloadControls();
    this._weatherRadarPumpPreload(generation,payload,policy);
  },

  _setWeatherRadarPreloadProfile(profile){
    const state=this._weatherRadarState();
    state.preloadProfile=WEATHER_RADAR_PRELOAD_PROFILES[profile]?profile:"normal";
    try{localStorage.setItem(PRELOAD_PROFILE_STORAGE_KEY,state.preloadProfile);}catch(_error){}
    this._weatherRadarClearPreload();
    this._weatherRadarUpdatePreloadControls();
    this._scheduleWeatherRadarPreload("profile",80);
  },

  _setWeatherRadarPreloadCustomPercent(value){
    const state=this._weatherRadarState();
    state.preloadCustomPercent=clamp(Math.round(finite(value)??30),0,100);
    try{localStorage.setItem(PRELOAD_CUSTOM_STORAGE_KEY,String(state.preloadCustomPercent));}catch(_error){}
    this._weatherRadarClearPreload();
    this._weatherRadarUpdatePreloadControls();
    if(state.preloadProfile==="custom")this._scheduleWeatherRadarPreload("custom",120);
  },

  _weatherRadarUpdatePreloadControls(){
    const state=this._weatherRadarState();
    const select=this.shadow?.getElementById("weather-radar-preload-profile");
    const customRow=this.shadow?.querySelector('[data-weather-radar-preload-custom="true"]');
    const range=this.shadow?.getElementById("weather-radar-preload-custom-range");
    const number=this.shadow?.getElementById("weather-radar-preload-custom-number");
    const status=this.shadow?.getElementById("weather-radar-preload-status");
    if(select)select.value=state.preloadProfile;
    if(customRow)customRow.hidden=state.preloadProfile!=="custom";
    if(range)range.value=String(state.preloadCustomPercent);
    if(number)number.value=String(state.preloadCustomPercent);
    if(!status)return;
    const payload=state.lastReady?.answer?.resource?.payload;
    const policy=this._weatherRadarPreloadPolicy(payload);
    if(policy.percent<=0){status.textContent="Aus · nur der aktuell benötigte Kartenbereich wird geladen.";return;}
    const maxMb=Math.round(policy.maxBytes/1024/1024);
    const metrics=state.preloadMetrics;
    const ready=[...state.preloadCache.values()].filter(entry=>entry.status==="ready").length;
    const loading=[...state.preloadCache.values()].filter(entry=>entry.status==="loading").length;
    const memoryMb=(ready*policy.bytesPerTile/1024/1024).toFixed(1);
    const prefix=policy.label+" · +"+policy.percent+" % je Seite · theoretisch bis "+policy.areaFactor.toFixed(2).replace(".",",")+"× Fläche";
    const guard=" · Grenze "+policy.maxTiles+" Kacheln / ca. "+maxMb+" MB";
    const live=metrics?" · aktuell "+metrics.selectedExtra+" Zusatzkacheln, "+ready+" bereit"+(loading?", "+loading+" laden":"")+" (~"+memoryMb+" MB)":"";
    status.textContent=prefix+guard+live;
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
    this._scheduleWeatherRadarPreload("ready",180);
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
      const answer=await this._weatherRouterResolve(CAPABILITY,context,{requirements:{resource_types:["raster_tile"]}});
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

    const preloadRow=document.createElement("div");preloadRow.className="settings-row";
    const preloadLabel=document.createElement("div");preloadLabel.className="settings-row-label";
    const preloadTitle=document.createElement("div");preloadTitle.textContent="Radar-Vorladebereich";
    const preloadHint=document.createElement("div");preloadHint.textContent="Zusätzlicher Rand um den sichtbaren Kartenausschnitt. Sicherheitsgrenzen begrenzen Kacheln und geschätzten Bildspeicher.";preloadHint.style.cssText="font-size:.76rem;opacity:.68;margin-top:3px";
    preloadLabel.append(preloadTitle,preloadHint);
    const preloadSelect=document.createElement("select");preloadSelect.id="weather-radar-preload-profile";preloadSelect.className="settings-control";
    [
      ["off","Aus · nur sichtbar"],
      ["small","Klein · +15 % je Seite"],
      ["normal","Normal · +30 % je Seite · empfohlen"],
      ["large","Groß · +50 % je Seite"],
      ["custom","Benutzerdefiniert"]
    ].forEach(([value,text])=>{const option=document.createElement("option");option.value=value;option.textContent=text;preloadSelect.append(option);});
    preloadSelect.addEventListener("change",()=>this._setWeatherRadarPreloadProfile(preloadSelect.value));
    preloadRow.append(preloadLabel,preloadSelect);

    const customRow=document.createElement("div");customRow.className="settings-row";customRow.dataset.weatherRadarPreloadCustom="true";
    const customLabel=document.createElement("div");customLabel.className="settings-row-label";customLabel.textContent="Benutzerdefinierter Kartenrand";
    const customControls=document.createElement("div");customControls.style.cssText="display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-end";
    const customRange=document.createElement("input");customRange.type="range";customRange.min="0";customRange.max="100";customRange.step="5";customRange.id="weather-radar-preload-custom-range";customRange.setAttribute("aria-label","Benutzerdefinierter Radar-Kartenrand in Prozent je Seite");
    const customNumber=document.createElement("input");customNumber.type="number";customNumber.min="0";customNumber.max="100";customNumber.step="5";customNumber.id="weather-radar-preload-custom-number";customNumber.className="settings-control";customNumber.style.cssText="width:78px";
    const percent=document.createElement("span");percent.textContent="% je Seite";percent.style.cssText="font-size:.78rem;opacity:.72";
    const syncCustom=value=>{this._setWeatherRadarPreloadCustomPercent(value);};
    customRange.addEventListener("input",()=>{customNumber.value=customRange.value;});
    customRange.addEventListener("change",()=>syncCustom(customRange.value));
    customNumber.addEventListener("change",()=>syncCustom(customNumber.value));
    customControls.append(customRange,customNumber,percent);customRow.append(customLabel,customControls);

    const preloadStatusRow=document.createElement("div");preloadStatusRow.className="settings-row";
    const preloadStatus=document.createElement("div");preloadStatus.className="settings-row-label";preloadStatus.id="weather-radar-preload-status";preloadStatus.setAttribute("role","status");preloadStatus.setAttribute("aria-live","polite");
    preloadStatusRow.append(preloadStatus);

    const statusRow=document.createElement("div");statusRow.className="settings-row";
    const status=document.createElement("div");status.className="settings-row-label";status.id="weather-radar-status";status.setAttribute("role","status");status.setAttribute("aria-live","polite");
    statusRow.append(status);block.append(row,preloadRow,customRow,preloadStatusRow,statusRow);
    const results=this.shadow?.getElementById("weather-engine-results")?.closest(".settings-row");
    if(results?.parentNode===content)content.insertBefore(block,results);else content.append(block);
    this._weatherRadarUpdateControls();
    this._weatherRadarUpdatePreloadControls();
    this._weatherRadarEnsureMapHooks();
    if(this._weatherRadarState().enabled)this._setWeatherRadarEnabled(true,{persist:false});
  },

  _resumeWeatherRadar(){
    const state=this._weatherRadarState();
    this._weatherRadarEnsureMapHooks();
    if(state.enabled){
      if(!state.refreshTimer)state.refreshTimer=setInterval(()=>this._scheduleWeatherRadarRefresh("timer",0),REFRESH_MS);
      this._scheduleWeatherRadarRefresh("resume",1200);
      this._scheduleWeatherRadarPreload("resume",1500);
    }
  },

  _teardownWeatherRadar(){
    const state=this._weatherRadarState();
    if(state.debounceTimer)clearTimeout(state.debounceTimer);
    if(state.mapWaitTimer)clearTimeout(state.mapWaitTimer);
    if(state.refreshTimer)clearInterval(state.refreshTimer);
    if(state.preloadTimer)clearTimeout(state.preloadTimer);
    state.debounceTimer=state.mapWaitTimer=state.refreshTimer=state.preloadTimer=null;
    state.preloadGeneration+=1;state.preloadQueue=[];state.preloadCache.clear();
    if(state.map&&state.onMove)try{state.map.off("moveend",state.onMove);state.map.off("zoomend",state.onMove);}catch(_error){}
    state.map=null;state.onMove=null;state.inFlight=false;state.pending=false;
  }
});});
