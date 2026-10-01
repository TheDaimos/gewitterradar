import { defineModule } from "../core/runtime.js?v=41105r1";

export const MODULE_META=Object.freeze({
  id:"weather.precipitation-layer",
  version:"1.2.0",
  group:"Weather-Engine",
  function:"Niederschlagsradar-Kartenebene",
  subfunctions:["Raster-Kacheladapter","Web-Mercator-BBOX","Quelle & Aktualität","Abdeckung","Legende","Anfragebegrenzung","Räumlicher Vorladepuffer","Radar-Zeitplayer","Frame-Doppelpuffer","Ressourcenschutz"],
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
const TIMELINE_STAGE_TIMEOUT_MS=6000;
const TIMELINE_PLAY_INTERVAL_MS=950;

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
export const weatherRadarTimelineModel=(payload,referenceTime=Date.now())=>{
  const raw=Array.isArray(payload?.timeline?.frames)?payload.timeline.frames:[];
  const frames=raw.map((frame,index)=>{
    const time=typeof frame?.time==="string"?frame.time:null;
    const tileUrl=typeof frame?.tile_url==="string"?frame.tile_url:null;
    const timeMs=time?Date.parse(time):NaN;
    return time&&tileUrl&&Number.isFinite(timeMs)?{time,tile_url:tileUrl,timeMs,sourceIndex:index}:null;
  }).filter(Boolean).sort((a,b)=>a.timeMs-b.timeMs||a.sourceIndex-b.sourceIndex);
  if(!frames.length)return {frames:[],currentIndex:-1,loop:false};
  let currentIndex=frames.findIndex(frame=>frame.tile_url===payload?.tile_url);
  if(currentIndex<0){
    const ref=Number.isFinite(Number(referenceTime))?Number(referenceTime):Date.now();
    const notFuture=frames.map((frame,index)=>({frame,index})).filter(item=>item.frame.timeMs<=ref);
    currentIndex=notFuture.length?notFuture.at(-1).index:frames.reduce((best,frame,index)=>Math.abs(frame.timeMs-ref)<Math.abs(frames[best].timeMs-ref)?index:best,0);
  }
  return {
    frames:frames.map((frame,index)=>({...frame,kind:index<currentIndex?"past":index===currentIndex?"current":"forecast"})),
    currentIndex,
    loop:payload?.timeline?.loop!==false
  };
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
        timelineModel:null,timelineIndex:-1,timelinePlaying:false,timelineTimer:null,timelineStageLayer:null,timelineStageIndex:-1,timelineStageToken:0,timelineStageReady:false,timelineStagePromise:null,timelineLoadMessage:null,
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

  _weatherRadarCreateLayer(L,payload,attribution,opacityOverride=null){
    const tileSize=Math.max(1,Math.round(finite(payload.tile_size)||256));
    const minZoom=Math.max(0,finite(payload.min_zoom)||0);
    const maxZoom=Math.max(minZoom,finite(payload.max_zoom)||18);
    const naturalOpacity=clamp(finite(payload.default_opacity)??0.58,0,1);
    const opacity=opacityOverride==null?naturalOpacity:clamp(finite(opacityOverride)??naturalOpacity,0,1);
    const map=this._map;
    if(!map.getPane("gr-weather-radar")){
      const pane=map.createPane("gr-weather-radar");
      pane.style.zIndex="230";
      pane.style.pointerEvents="none";
    }
    const displayMaxZoom=Math.max(maxZoom,finite(map.getMaxZoom?.())??maxZoom);
    const layer=L.gridLayer({pane:"gr-weather-radar",tileSize,minZoom,maxZoom:displayMaxZoom,maxNativeZoom:maxZoom,opacity,attribution:attribution||"",updateWhenIdle:true,keepBuffer:1});
    layer.__grRadarNaturalOpacity=naturalOpacity;
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

  _weatherRadarActivePayload(){
    const state=this._weatherRadarState();
    const payload=state.lastReady?.answer?.resource?.payload;
    const frame=state.timelineModel?.frames?.[state.timelineIndex];
    return payload&&frame?{...payload,tile_url:frame.tile_url}:payload||null;
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
    const payload=this._weatherRadarActivePayload();
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

  _weatherRadarStopTimelinePlayback(){
    const state=this._weatherRadarState();
    const wasPlaying=state.timelinePlaying;
    state.timelinePlaying=false;
    if(state.timelineTimer){clearTimeout(state.timelineTimer);state.timelineTimer=null;}
    this._weatherRadarRenderTimelinePlayer();
    if(wasPlaying&&state.enabled)this._scheduleWeatherRadarPreload("timeline-stop",120);
  },

  _weatherRadarClearTimelineStage(){
    const state=this._weatherRadarState();
    state.timelineStageToken+=1;
    if(state.timelineStageLayer){try{state.timelineStageLayer.remove();}catch(_error){}}
    state.timelineStageLayer=null;state.timelineStageIndex=-1;state.timelineStageReady=false;state.timelineStagePromise=null;
  },

  _weatherRadarRemoveTimelinePlayer(){
    this._weatherRadarStopTimelinePlayback();
    this._weatherRadarClearTimelineStage();
    this.shadow?.querySelector('[data-weather-radar-player="true"]')?.remove();
  },

  _weatherRadarTimelineTimeLabel(frame){
    if(!frame)return "—";
    try{
      const date=new Date(frame.timeMs);
      const now=new Date();
      const sameDay=date.getFullYear()===now.getFullYear()&&date.getMonth()===now.getMonth()&&date.getDate()===now.getDate();
      return new Intl.DateTimeFormat(undefined,sameDay?{hour:"2-digit",minute:"2-digit"}:{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}).format(date);
    }catch(_error){return frame.time||"—";}
  },

  _weatherRadarTimelineKindLabel(index){
    const state=this._weatherRadarState();
    const current=state.timelineModel?.currentIndex??-1;
    return index<current?"Vergangenheit":index===current?"Jetzt":"Vorhersage";
  },

  _weatherRadarMountTimelinePlayer(){
    const state=this._weatherRadarState();
    const model=state.timelineModel;
    const card=this.shadow?.getElementById("map-card");
    if(!card||!model||model.frames.length<2){this._weatherRadarRemoveTimelinePlayer();return;}
    let root=this.shadow?.querySelector('[data-weather-radar-player="true"]');
    if(!root){
      root=document.createElement("div");
      root.dataset.weatherRadarPlayer="true";
      root.id="weather-radar-player";
      root.setAttribute("role","group");
      root.setAttribute("aria-label","Niederschlagsradar-Zeitverlauf");
      root.style.cssText="position:absolute;left:50%;bottom:58px;transform:translateX(-50%);z-index:750;width:min(560px,calc(100% - 22px));box-sizing:border-box;padding:7px 9px 8px;border:1px solid rgba(125,184,239,.36);border-radius:14px;background:rgba(8,13,20,.88);box-shadow:0 8px 26px rgba(0,0,0,.38),inset 0 1px 0 rgba(255,255,255,.04);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);color:#e7edf5;pointer-events:auto;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
      const top=document.createElement("div");top.style.cssText="display:flex;align-items:center;gap:6px;min-width:0";
      const prev=document.createElement("button");prev.type="button";prev.dataset.timelineAction="prev";prev.textContent="‹";prev.title="Vorheriger Radarzeitpunkt";
      const play=document.createElement("button");play.type="button";play.dataset.timelineAction="play";play.title="Radarfolge abspielen";
      const next=document.createElement("button");next.type="button";next.dataset.timelineAction="next";next.textContent="›";next.title="Nächster Radarzeitpunkt";
      const now=document.createElement("button");now.type="button";now.dataset.timelineAction="now";now.textContent="Jetzt";now.title="Zum aktuellen Radarzeitpunkt";
      [prev,play,next,now].forEach(button=>button.style.cssText="appearance:none;-webkit-appearance:none;min-width:34px;height:30px;padding:0 9px;border-radius:9px;border:1px solid rgba(246,195,68,.34);background:rgba(16,22,31,.92);color:#f3d16d;font-weight:850;font-size:13px;line-height:1;cursor:pointer;touch-action:manipulation");
      const label=document.createElement("div");label.dataset.timelineLabel="true";label.style.cssText="min-width:0;flex:1;text-align:center;font-size:12px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis";
      top.append(prev,play,next,label,now);
      const range=document.createElement("input");range.type="range";range.min="0";range.step="1";range.value="0";range.dataset.timelineRange="true";range.setAttribute("aria-label","Radarzeitpunkt");range.style.cssText="display:block;width:100%;height:22px;margin:2px 0 0;accent-color:#79bfff";
      const footer=document.createElement("div");footer.style.cssText="display:flex;justify-content:space-between;gap:8px;margin-top:-1px;font-size:9.5px;font-weight:700;letter-spacing:.02em;opacity:.68";
      footer.innerHTML="<span>Vergangenheit</span><span>Jetzt</span><span>Vorhersage</span>";
      root.append(top,range,footer);
      root.addEventListener("click",event=>{
        const action=event.target?.closest?.("[data-timeline-action]")?.dataset?.timelineAction;
        if(!action)return;
        if(action==="play"){this._weatherRadarToggleTimelinePlayback();return;}
        this._weatherRadarStopTimelinePlayback();
        const s=this._weatherRadarState(),m=s.timelineModel;if(!m?.frames?.length)return;
        if(action==="now"){this._weatherRadarSetTimelineFrame(m.currentIndex);return;}
        const delta=action==="prev"?-1:1;
        const target=clamp((s.timelineIndex<0?m.currentIndex:s.timelineIndex)+delta,0,m.frames.length-1);
        this._weatherRadarSetTimelineFrame(target);
      });
      range.addEventListener("change",()=>{
        this._weatherRadarStopTimelinePlayback();
        this._weatherRadarSetTimelineFrame(Number(range.value));
      });
      card.append(root);
    }
    this._weatherRadarRenderTimelinePlayer();
  },

  _weatherRadarRenderTimelinePlayer(){
    const state=this._weatherRadarState(),model=state.timelineModel;
    const root=this.shadow?.querySelector('[data-weather-radar-player="true"]');
    if(!root||!model?.frames?.length)return;
    const index=clamp(state.timelineIndex<0?model.currentIndex:state.timelineIndex,0,model.frames.length-1);
    const frame=model.frames[index];
    const range=root.querySelector('[data-timeline-range="true"]');
    if(range){range.max=String(model.frames.length-1);range.value=String(index);}
    const label=root.querySelector('[data-timeline-label="true"]');
    if(label){
      const status=state.timelineLoadMessage||this._weatherRadarTimelineKindLabel(index);
      label.textContent=status+" · "+this._weatherRadarTimelineTimeLabel(frame)+" · "+(index+1)+"/"+model.frames.length;
      label.title=frame.time;
    }
    const play=root.querySelector('[data-timeline-action="play"]');
    if(play){play.textContent=state.timelinePlaying?"❚❚":"▶";play.title=state.timelinePlaying?"Wiedergabe anhalten":"Radarfolge abspielen";}
  },

  _weatherRadarRenderCurrentLegend(){
    const state=this._weatherRadarState(),answer=state.lastReady?.answer;
    if(!answer)return;
    const payload=answer.resource?.payload||{},description=this._weatherRadarDescribe(answer);
    const frame=state.timelineModel?.frames?.[state.timelineIndex];
    const timePart=frame?this._weatherRadarTimelineKindLabel(state.timelineIndex)+" · "+this._weatherRadarTimelineTimeLabel(frame):description.ageText;
    const legend=payload.legend&&typeof payload.legend==="object"?payload.legend:null;
    const label="Niederschlag · "+description.provider+" · "+timePart;
    const title=[
      label,
      "Datenalter: "+description.ageText,
      "Abdeckung: "+description.coverage,
      answer.routing?.degraded?"Datenweg eingeschränkt":null,
      ...description.limitations
    ].filter(Boolean).join(" · ");
    this._weatherRadarRenderLegend({label,title,legendUrl:legend?.url||null,legendTitle:legend?.title||"Niederschlagslegende"});
  },

  async _weatherRadarStageTimelineFrame(index){
    const state=this._weatherRadarState(),model=state.timelineModel;
    if(!state.enabled||!this._map||!model?.frames?.[index])return false;
    if(state.timelineStageLayer&&state.timelineStageIndex===index){
      if(state.timelineStageReady)return true;
      if(state.timelineStagePromise)return state.timelineStagePromise;
    }
    this._weatherRadarClearTimelineStage();
    const token=state.timelineStageToken;
    const base=state.lastReady?.answer?.resource?.payload;
    if(!base)return false;
    const frame=model.frames[index],payload={...base,tile_url:frame.tile_url};
    const attribution=base.attribution||state.lastReady?.answer?.provenance?.attribution||state.lastReady?.answer?.provenance?.provider_name||"";
    const promise=(async()=>{
      try{
        const L=await loadLeafletJs();
        if(token!==state.timelineStageToken||!state.enabled||!this._map)return false;
        const layer=this._weatherRadarCreateLayer(L,payload,attribution,0.001);
        state.timelineStageLayer=layer;state.timelineStageIndex=index;state.timelineStageReady=false;
        const loaded=await new Promise(resolve=>{
          let settled=false;
          const finish=value=>{if(settled)return;settled=true;clearTimeout(timeout);resolve(value);};
          const timeout=setTimeout(()=>finish(false),TIMELINE_STAGE_TIMEOUT_MS);
          layer.once?.("load",()=>finish(true));
          layer.addTo(this._map);
        });
        if(token!==state.timelineStageToken||state.timelineStageLayer!==layer){
          try{layer.remove();}catch(_error){}
          return false;
        }
        if(!loaded){
          try{layer.remove();}catch(_error){}
          state.timelineStageLayer=null;state.timelineStageIndex=-1;state.timelineStageReady=false;
          return false;
        }
        state.timelineStageReady=true;
        return true;
      }catch(_error){
        if(token===state.timelineStageToken){
          state.timelineStageLayer=null;state.timelineStageIndex=-1;state.timelineStageReady=false;
        }
        return false;
      }finally{
        if(token===state.timelineStageToken)state.timelineStagePromise=null;
      }
    })();
    state.timelineStagePromise=promise;
    return promise;
  },

  async _weatherRadarSetTimelineFrame(index){
    const state=this._weatherRadarState(),model=state.timelineModel;
    if(!model?.frames?.length)return false;
    const target=clamp(Math.round(Number(index)||0),0,model.frames.length-1);
    if(target===state.timelineIndex){this._weatherRadarRenderTimelinePlayer();return true;}
    state.timelineLoadMessage="Lade Radarzeitpunkt …";this._weatherRadarRenderTimelinePlayer();
    const staged=await this._weatherRadarStageTimelineFrame(target);
    if(!staged||!state.timelineStageLayer){
      state.timelineLoadMessage="Radarzeitpunkt konnte nicht geladen werden";
      state.timelinePlaying=false;
      this._weatherRadarRenderTimelinePlayer();
      return false;
    }
    const next=state.timelineStageLayer,old=state.layer;
    state.timelineStageLayer=null;state.timelineStageIndex=-1;state.timelineStageReady=false;state.timelineStagePromise=null;
    try{next.setOpacity?.(next.__grRadarNaturalOpacity??0.58);}catch(_error){}
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    if(old&&old!==next)try{old.remove();}catch(_error){}
    state.layer=next;state.timelineIndex=target;state.timelineLoadMessage=null;
    this._weatherRadarClearPreload({resetMetrics:false});
    if(!state.timelinePlaying)this._scheduleWeatherRadarPreload("timeline",120);
    this._weatherRadarRenderTimelinePlayer();
    this._weatherRadarRenderCurrentLegend();
    if(state.timelinePlaying)this._weatherRadarPrimeNextTimelineFrame();
    return true;
  },

  _weatherRadarNextTimelineIndex(){
    const state=this._weatherRadarState(),model=state.timelineModel;
    if(!model?.frames?.length)return -1;
    const current=state.timelineIndex<0?model.currentIndex:state.timelineIndex;
    if(current<model.frames.length-1)return current+1;
    return model.loop?0:-1;
  },

  _weatherRadarPrimeNextTimelineFrame(){
    const next=this._weatherRadarNextTimelineIndex();
    if(next>=0)this._weatherRadarStageTimelineFrame(next);
  },

  _weatherRadarScheduleTimelinePlayback(){
    const state=this._weatherRadarState();
    if(!state.timelinePlaying)return;
    if(state.timelineTimer)clearTimeout(state.timelineTimer);
    state.timelineTimer=setTimeout(async()=>{
      state.timelineTimer=null;
      if(!state.timelinePlaying)return;
      const next=this._weatherRadarNextTimelineIndex();
      if(next<0){this._weatherRadarStopTimelinePlayback();return;}
      const ok=await this._weatherRadarSetTimelineFrame(next);
      if(!ok){this._weatherRadarStopTimelinePlayback();return;}
      this._weatherRadarScheduleTimelinePlayback();
    },TIMELINE_PLAY_INTERVAL_MS);
  },

  _weatherRadarToggleTimelinePlayback(){
    const state=this._weatherRadarState(),model=state.timelineModel;
    if(!model?.frames?.length)return;
    if(state.timelinePlaying){this._weatherRadarStopTimelinePlayback();return;}
    state.timelinePlaying=true;state.timelineLoadMessage=null;
    this._weatherRadarRenderTimelinePlayer();
    this._weatherRadarPrimeNextTimelineFrame();
    this._weatherRadarScheduleTimelinePlayback();
  },

  _weatherRadarRemoveLayer(){
    const state=this._weatherRadarState();
    this._weatherRadarRemoveTimelinePlayer();
    state.timelineModel=null;state.timelineIndex=-1;state.timelineLoadMessage=null;
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
    this._weatherRadarStopTimelinePlayback();
    this._weatherRadarClearTimelineStage();
    const referenceTime=Date.parse(answer?.freshness?.data_time||"");
    state.timelineModel=weatherRadarTimelineModel(payload,Number.isFinite(referenceTime)?referenceTime:Date.now());
    state.timelineIndex=state.timelineModel.currentIndex;
    this._weatherRadarMountTimelinePlayer();
    this._scheduleWeatherRadarPreload("ready",180);
    this._weatherRadarRenderCurrentLegend();
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
    const timelineStatus=this.shadow?.getElementById("weather-radar-timeline-status");
    if(toggle){
      toggle.setAttribute("aria-pressed",state.enabled?"true":"false");
      toggle.textContent=state.enabled?"Ein":"Aus";
      toggle.dataset.active=state.enabled?"1":"0";
    }
    if(timelineStatus){
      const frames=state.timelineModel?.frames?.length||0;
      timelineStatus.textContent=!state.enabled
        ?"Aus · Zeitverlauf wird mit dem Radar aktiviert"
        :frames>1
          ?"Verfügbar · "+frames+" Radarzeitpunkte · Vergangenheit, Jetzt und Vorhersage"
          :"Aktive Quelle liefert derzeit keine mehrteilige Radarzeitreihe";
    }
    if(!status)return;
    if(message){status.textContent=message;return;}
    if(!state.enabled){status.textContent="Aus · keine zusätzlichen Radar-Anfragen";return;}
    if(state.lastReady){
      const d=this._weatherRadarDescribe(state.lastReady.answer);
      const frames=state.timelineModel?.frames?.length||0;
      status.textContent="Aktiv · "+d.provider+" · "+d.ageText+(frames>1?" · "+frames+" Radarzeitpunkte":"")+" · Abdeckung: "+d.coverage+(state.lastReady.answer.routing?.degraded?" · eingeschränkt":"");
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

    const timelineRow=document.createElement("div");timelineRow.className="settings-row";
    const timelineLabel=document.createElement("div");timelineLabel.className="settings-row-label";
    const timelineTitle=document.createElement("div");timelineTitle.textContent="Radar-Zeitverlauf";
    const timelineHint=document.createElement("div");timelineHint.textContent="Die Zeitsteuerung erscheint automatisch auf der Karte, wenn WeatherRouter mehrere Radarzeitpunkte liefert.";timelineHint.style.cssText="font-size:.76rem;opacity:.68;margin-top:3px";
    const timelineStatus=document.createElement("div");timelineStatus.id="weather-radar-timeline-status";timelineStatus.setAttribute("role","status");timelineStatus.setAttribute("aria-live","polite");timelineStatus.style.cssText="font-size:.76rem;opacity:.82;margin-top:5px";
    timelineLabel.append(timelineTitle,timelineHint,timelineStatus);timelineRow.append(timelineLabel);

    const statusRow=document.createElement("div");statusRow.className="settings-row";
    const status=document.createElement("div");status.className="settings-row-label";status.id="weather-radar-status";status.setAttribute("role","status");status.setAttribute("aria-live","polite");
    statusRow.append(status);block.append(row,preloadRow,customRow,preloadStatusRow,timelineRow,statusRow);
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
    if(state.timelineTimer)clearTimeout(state.timelineTimer);
    state.debounceTimer=state.mapWaitTimer=state.refreshTimer=state.preloadTimer=state.timelineTimer=null;
    state.timelinePlaying=false;
    this._weatherRadarClearTimelineStage();
    this.shadow?.querySelector('[data-weather-radar-player="true"]')?.remove();
    state.preloadGeneration+=1;state.preloadQueue=[];state.preloadCache.clear();
    if(state.map&&state.onMove)try{state.map.off("moveend",state.onMove);state.map.off("zoomend",state.onMove);}catch(_error){}
    state.map=null;state.onMove=null;state.inFlight=false;state.pending=false;
  }
});});
