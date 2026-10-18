import { defineModule } from "../core/runtime.js?v=41113r1";
import {prepareRasterMosaicV2} from "./p7-010/raster-mosaic-consumer.js?v=41196r1";
import {measureRasterViewportCoverage,measureV1RasterCoverage,decideV1RasterSwap} from "./p7-010/raster-mosaic-coverage.js?v=41190r1";
import {rasterTilePixelCrops} from "./p7-010/raster-tile-clip.js?v=41188r1";

export const MODULE_META=Object.freeze({
  id:"weather.precipitation-layer",
  version:"1.3.17",
  group:"Weather-Engine",
  function:"Niederschlags-Kartenebene",
  subfunctions:["Raster-Kacheladapter","Web-Mercator-BBOX","Quelle & Aktualität","Abdeckung","Darstellungslegende","Darstellungstransparenz","Flächenglättung","Anfragebegrenzung","einstellbares Wetter-Aktualisierungsintervall","Räumlicher Vorladepuffer","Niederschlags-Zeitplayer","Frame-Doppelpuffer","Zeitachse ein/aus","verschiebbare Zeitachse","Ressourcenschutz"],
  file:"modules/weather/precipitation-layer.js"
});

const CAPABILITY="weather.precipitation.layer";
const STORAGE_KEY="gewitterradar:weather-engine:precipitation-enabled";
const BACKGROUND_STORAGE_KEY="gewitterradar:weather-engine:allow-older-satellite-background";
const BACKGROUND_MAX_AGE_SECONDS=43200;
const REGIONAL_HOLD_LIMIT_MS=45000;
const REGIONAL_HOLD_RETRY_MS=15000;
const PRELOAD_PROFILE_STORAGE_KEY="gewitterradar:weather-engine:precipitation-preload-profile";
const PRELOAD_CUSTOM_STORAGE_KEY="gewitterradar:weather-engine:precipitation-preload-custom-percent";
const REFRESH_MS=300000;
const VIEWPORT_REFRESH_INTERVAL_STORAGE_KEY="gewitterradar:weather-engine:viewport-refresh-interval-seconds";
const VIEWPORT_REFRESH_INTERVAL_DEFAULT_SECONDS=15;
const VIEWPORT_REFRESH_INTERVAL_MIN_SECONDS=2;
const VIEWPORT_REFRESH_INTERVAL_MAX_SECONDS=60;
const SAME_VIEW_MIN_MS=240000;
const PRELOAD_CONCURRENCY=4;
const TIMELINE_STAGE_TIMEOUT_MS=6000;
const V1_LAYER_STAGE_TIMEOUT_MS=8000;
const TIMELINE_PLAY_INTERVAL_MS=950;
const TIMELINE_VISIBLE_STORAGE_KEY="gewitterradar:weather-engine:timeline-visible";
const TIMELINE_POSITION_STORAGE_KEY="gewitterradar:weather-engine:timeline-position";

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
  const timeline=payload?.timeline&&typeof payload.timeline==="object"?payload.timeline:{};
  const raw=Array.isArray(timeline.frames)?timeline.frames:[];
  const frames=raw.map((frame,index)=>{
    const time=typeof frame?.time==="string"?frame.time:null;
    const tileUrl=typeof frame?.tile_url==="string"?frame.tile_url:null;
    const timeMs=time?Date.parse(time):NaN;
    const declaredKind=typeof frame?.kind==="string"&&frame.kind.trim()?frame.kind.trim().toLowerCase():null;
    return time&&tileUrl&&Number.isFinite(timeMs)?{time,tile_url:tileUrl,timeMs,sourceIndex:index,declaredKind}:null;
  }).filter(Boolean).sort((a,b)=>a.timeMs-b.timeMs||a.sourceIndex-b.sourceIndex);
  if(!frames.length)return {frames:[],currentIndex:-1,loop:false};
  let currentIndex=frames.findIndex(frame=>frame.tile_url===payload?.tile_url);
  if(currentIndex<0&&Number.isInteger(timeline.current_index))currentIndex=frames.findIndex(frame=>frame.sourceIndex===timeline.current_index);
  if(currentIndex<0&&Number.isInteger(timeline.default_index))currentIndex=frames.findIndex(frame=>frame.sourceIndex===timeline.default_index);
  if(currentIndex<0){
    const ref=Number.isFinite(Number(referenceTime))?Number(referenceTime):Date.now();
    const notFuture=frames.map((frame,index)=>({frame,index})).filter(item=>item.frame.timeMs<=ref);
    currentIndex=notFuture.length?notFuture.at(-1).index:frames.reduce((best,frame,index)=>Math.abs(frame.timeMs-ref)<Math.abs(frames[best].timeMs-ref)?index:best,0);
  }
  return {frames:frames.map((frame,index)=>({...frame,kind:frame.declaredKind||(index<currentIndex?"past":index===currentIndex?"current":"forecast")})),currentIndex,loop:timeline.loop!==false};
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

/** Verified present-day geographic overlap is mandatory for a retained raster.
 * No provider-name heuristics: consume only structured WR coverage evidence.
 * Zero overlap or unknown coverage cannot justify displaying a stale source.
 */
export function weatherRadarActiveCoverage(state,viewport,zoom=0,now=Date.now()){
  if(!state?.layer||!viewport)return {fraction:0,verified:false,reason:"no_active_layer"};
  if(state.v2Snapshot){
    const elapsed=state.v2SnapshotAt?Math.max(0,(now-state.v2SnapshotAt)/1000):0;
    const layers=state.v2Snapshot.layers?.filter(layer=>{
      const age=layer?.times?.age_seconds;
      const older=layer?.freshness_class==="older_background";
      const limit=older&&state.allowOlderSatelliteBackground?BACKGROUND_MAX_AGE_SECONDS:900;
      return typeof age==="number"&&Number.isFinite(age)&&age>=0&&age+elapsed<=limit;
    })||[];
    const result=measureRasterViewportCoverage(layers,viewport,zoom);
    return {fraction:result.fraction,verified:result.covered_sources>0,
      reason:layers.length?"v2_geographic_coverage":"v2_sources_expired"};
  }
  const record=state.lastReady;
  if(!record?.answer)return {fraction:0,verified:false,reason:"no_v1_record"};
  const age=record.answer.freshness?.age_seconds;
  const sem=record.answer.resource?.semantics||{};
  const isOlderSatellite=sem.observation_kind==="estimate"&&
    String(sem.measurement_method||"").includes("satellite");
  const limit=isOlderSatellite&&state.allowOlderSatelliteBackground?BACKGROUND_MAX_AGE_SECONDS:900;
  if(typeof age!=="number"||!Number.isFinite(age)||age<0||
     age+Math.max(0,(now-(record.at??now))/1000)>limit)
    return {fraction:0,verified:false,reason:"v1_age_invalid"};
  const result=measureV1RasterCoverage(record.answer.provenance,viewport,zoom);
  return {fraction:result.fraction,verified:result.verified===true,
    reason:result.verified?"v1_geographic_coverage":"v1_coverage_unverified"};
}

/** Fail-open for a small number of *recorded* image errors only when
 * actual in-coverage images were loaded. Empty expected geography is not
 * a successful image and never contributes to this decision.
 */

/** GR-RF-02: read-only safety check for already rendered WR-selected sources.
 * No provider resolution, new candidate scoring or extension of data age.
 * A Canvas painted successfully does not prove nontransparent weather pixels.
 */
export function v2RenderedSourceValidity(layer,snapshotAt,{now=Date.now(),satelliteConsent=false}={}){
  const age=layer?.times?.age_seconds;
  const validAt=Date.parse(layer?.times?.valid_at||"");
  const elapsed=(now-snapshotAt)/1000;
  const older=layer?.freshness_class==="older_background";
  const method=layer?.semantics?.measurement_method;
  const satellite=layer?.semantics?.observation_kind==="estimate"
    &&["satellite_precipitation_estimate","satellite_estimate"].includes(method);
  const maxAge=older&&satellite&&satelliteConsent?BACKGROUND_MAX_AGE_SECONDS:900;
  if(older&&(!satelliteConsent||!satellite))return {valid:false,reason:"consent_revoked"};
  if(layer?.coverage_verified!==true||!layer?.coverage||!layer?.render
    ||layer.render.opacity<=0)return {valid:false,reason:"coverage_unverified"};
  if(!Number.isFinite(age)||age<0||!Number.isFinite(validAt)
    ||!Number.isFinite(snapshotAt)||elapsed<0)
    return {valid:false,reason:"time_unverified"};
  // Check the absolute UTC source timestamp and the original WR age. Neither
  // clock is permitted to reset merely because a later V2 request succeeded.
  const actualAge=Math.max(age+elapsed,(now-validAt)/1000);
  const expiresAt=Math.min(snapshotAt+(maxAge-age)*1000,validAt+maxAge*1000);
  return {valid:actualAge<=maxAge&&now<expiresAt,
    reason:actualAge<=maxAge&&now<expiresAt?"current":"source_expired",
    expiresAt,age_seconds:actualAge};
}

/** Decide if a previously verified, painted WR mosaic may temporarily survive
 * a replacement with only opt-in older satellite imagery.
 * The V2 response exposes a GENERIC coverage warning, not the underlying
 * per-provider timeout: retention is provisional, never labelled a proven
 * 'coverage_timeout' unless WR explicitly reports that code.
 */
export function decideV2RegionalRetention({
  previous,next,viewport,zoom=0,now=Date.now(),previousAt=null,
  satelliteConsent=false,drawnTiles=0,uncoveredTiles=0,
  existingHold=null,previousMounted=false
}={}){
  const no=reason=>({retain:false,reason});
  if(!previousMounted||!previous?.layers?.length||!next?.layers?.length)
    return no("no_mounted_mosaic");
  if(next.status!=="partial")return no("replacement_not_degraded");
  if(!satelliteConsent)return no("consent_revoked");
  if(!(drawnTiles>0)||uncoveredTiles!==0)return no("previous_image_incomplete");
  if(!Array.isArray(next.limitations)||!next.limitations.some(
    x=>typeof x==="string"&&x.includes("regionale Coverage-Anfragen waren nicht nutzbar")))
    return no("no_transient_coverage_evidence");
  const old=previous.layers;
  const measured=old.filter(l=>l.freshness_class!=="older_background"
    &&["observation","observation_forecast"].includes(l.semantics?.observation_kind)
    &&typeof l.semantics?.measurement_method==="string"
    &&l.semantics.measurement_method.includes("radar"));
  const older=old.filter(l=>l.freshness_class==="older_background");
  if(!measured.length||!older.length)return no("no_previous_radar_and_satellite");
  if(!next.layers.every(l=>l.freshness_class==="older_background"
     &&l.semantics?.observation_kind==="estimate"
     &&["satellite_precipitation_estimate","satellite_estimate"].includes(
       l.semantics?.measurement_method)))
    return no("replacement_has_live_sources");
  if(measured.some(l=>next.layers.some(n=>n.source_id===l.source_id)))
    return no("regional_source_present");
  // The consumer MUST keep the WeatherRouter drawing order. A retained
  // composition is only safe when its live radar was painted after satellite.
  if(Math.max(...older.map(l=>old.indexOf(l)))>=
     Math.min(...measured.map(l=>old.indexOf(l))))
    return no("prior_compositing_order_unverified");
  const nextUnits=new Set(next.layers.map(l=>
    String(l.semantics?.quantity)+"|"+String(l.semantics?.unit)));
  if(nextUnits.size!==1||measured.some(l=>!nextUnits.has(
    String(l.semantics?.quantity)+"|"+String(l.semantics?.unit))))
    return no("precipitation_semantics_changed");
  // Respect any *explicit* public reason if WR gains such a field later;
  // current WR 0.10.158 puts granular preflight in diagnostics, not V2 replies.
  const routing=next.routing||{};
  const evidence=[...(Array.isArray(routing.coverage_preflight)?routing.coverage_preflight:[]),
    ...(Array.isArray(routing.source_rejections)?routing.source_rejections:[])];
  for(const l of measured){
    if(evidence.some(item=>item.source_id===l.source_id&&
      ["outside_coverage","outside_time_tolerance","no_fresh_verified_frame",
        "profile_filtered","consent_revoked","source_stale","not_permitted",
        "coverage_unverified"].includes(item.result||item.reason)))
      return no("explicit_regional_rejection");
  }
  const used=measureRasterViewportCoverage(measured,viewport,zoom);
  if(used.covered_sources<=0||used.fraction<=0)return no("regional_outside_viewport");
  const expiry=old.map(l=>v2RenderedSourceValidity(l,previousAt,{
    now,satelliteConsent}));
  if(expiry.some(x=>!x.valid))return no(
    expiry.find(x=>!x.valid)?.reason||"source_expired");
  // The hold is tied to the exact installed old layer. Repeated NASA-only
  // responses may not extend the original deadline.
  const startedAt=existingHold?.startedAt??now;
  const deadlineAt=Math.min(startedAt+REGIONAL_HOLD_LIMIT_MS,
    ...expiry.map(x=>x.expiresAt));
  if(now>=deadlineAt)return no("hold_expired");
  return {retain:true,reason:"regional_coverage_unavailable_provisional",
    startedAt,deadlineAt,remaining_ms:Math.round(deadlineAt-now),
    retained_source_ids:measured.map(x=>x.source_id),
    regional_coverage_fraction:Number(used.fraction.toFixed(5)),
    current_age_seconds:Math.ceil(Math.max(...expiry.filter((v,i)=>measured.includes(old[i]))
      .map(x=>x.age_seconds))),
    // Do not infer 'coverage_timeout' merely from an unavailable source.
    coverage_timeout_proven:evidence.some(x=>
      measured.some(m=>m.source_id===x.source_id)&&x.result==="coverage_timeout"),
    render_order:old.map(x=>({source_id:x.source_id,
      freshness_class:x.freshness_class||"current"}))};
}

export function decideV1TileStage(stats){
  const loaded=Number(stats?.loaded)||0,failed=Number(stats?.failed)||0;
  const eligible=loaded+failed;
  const threshold=Math.min(2,Math.max(1,Math.floor(eligible*0.1)));
  const partial=loaded>0&&failed>0&&failed<=threshold&&loaded/eligible>=0.85;
  return {accepted:loaded>0&&(failed===0||partial),partial,
    loaded,failed,expected_empty:Number(stats?.expected_empty)||0,
    failure_ratio:eligible?failed/eligible:0};
}

export function weatherRadarNeedsConsentDetach(state,now=Date.now()){
  if(!state?.layer)return false;
  if(state.v2Snapshot?.layers?.some(l=>l?.freshness_class==="older_background"))return true;
  const a=state.lastReady?.answer;
  if(!a)return false;
  // A revoked age exception also invalidates V1 imagery without satellite labels.
  const age=a.freshness?.age_seconds;
  return typeof age!=="number"||!Number.isFinite(age)||age<0||
    age+Math.max(0,(now-(state.lastReady?.at??now))/1000)>900;
}
export const installWeatherRadar=defineModule(MODULE_META,(deps)=>{const {loadLeafletJs}=deps;return ({
  _weatherRadarState(){
    if(!this.__weatherRadarState){
      let enabled=false,allowOlderSatelliteBackground=false,preloadProfile="normal",preloadCustomPercent=30,timelineVisible=true,timelinePosition=null,viewportRefreshIntervalSeconds=VIEWPORT_REFRESH_INTERVAL_DEFAULT_SECONDS;
      try{
        enabled=localStorage.getItem(STORAGE_KEY)==="1";
        allowOlderSatelliteBackground=localStorage.getItem(BACKGROUND_STORAGE_KEY)==="1";
        const storedProfile=localStorage.getItem(PRELOAD_PROFILE_STORAGE_KEY);
        if(storedProfile&&WEATHER_RADAR_PRELOAD_PROFILES[storedProfile])preloadProfile=storedProfile;
        const storedCustom=finite(localStorage.getItem(PRELOAD_CUSTOM_STORAGE_KEY));
        if(storedCustom!=null)preloadCustomPercent=clamp(Math.round(storedCustom),0,100);
        const storedViewportRefreshInterval=finite(localStorage.getItem(VIEWPORT_REFRESH_INTERVAL_STORAGE_KEY));
        if(storedViewportRefreshInterval!=null)viewportRefreshIntervalSeconds=clamp(Math.round(storedViewportRefreshInterval),VIEWPORT_REFRESH_INTERVAL_MIN_SECONDS,VIEWPORT_REFRESH_INTERVAL_MAX_SECONDS);
        const storedTimelineVisible=localStorage.getItem(TIMELINE_VISIBLE_STORAGE_KEY);
        if(storedTimelineVisible==="0")timelineVisible=false;
        if(storedTimelineVisible==="1")timelineVisible=true;
        const storedTimelinePosition=JSON.parse(localStorage.getItem(TIMELINE_POSITION_STORAGE_KEY)||"null");
        if(storedTimelinePosition&&finite(storedTimelinePosition.x)!=null&&finite(storedTimelinePosition.y)!=null){
          timelinePosition={x:clamp(finite(storedTimelinePosition.x),0,1),y:clamp(finite(storedTimelinePosition.y),0,1)};
        }
      }catch(_error){}
      this.__weatherRadarState={
        enabled,allowOlderSatelliteBackground,preloadProfile,preloadCustomPercent,viewportRefreshIntervalSeconds,layer:null,map:null,onMove:null,refreshTimer:null,debounceTimer:null,mapWaitTimer:null,
        preloadTimer:null,preloadQueue:[],preloadCache:new Map(),preloadActive:0,preloadGeneration:0,preloadMetrics:null,
        timelineVisible,timelinePosition,timelineDragging:null,timelineResizeObserver:null,timelineModel:null,timelineIndex:-1,timelinePlaying:false,timelineTimer:null,timelineStageLayer:null,timelineStageIndex:-1,timelineStageToken:0,timelineStageReady:false,timelineStagePromise:null,timelineLoadMessage:null,v2Generation:0,v2Snapshot:null,v2PendingLayer:null,v1PendingLayer:null,v1PendingCancel:null,
        inFlight:false,inFlightToken:null,inFlightStartedAt:0,pending:false,pendingForce:false,
        appHiddenAt:0,lastForegroundRefreshAt:0,visibilityHandler:null,pageShowHandler:null,focusHandler:null,
        v2BudgetPending:false,v2BudgetTimer:null,v2LastBudgetRecovery:0,lastRequestAt:0,lastViewport:"",lastReady:null,lastUnavailable:null,v2LastPartial:null,v2RenderMetrics:null,
        regionalHold:null,regionalHoldTimer:null,regionalRecoveryTimer:null
      };
    }
    return this.__weatherRadarState;
  },

  /** No screenshot required: inspect mounted grid, pane visibility and tile state.
   * Loaded images are NOT proof of nontransparent precipitation pixels.
   */
  _weatherRadarVisualAudit(phase,detail={}){
    const state=this._weatherRadarState(),layer=state.layer,map=this._map;
    const tiles=Object.values(layer?._tiles||{});
    const loaded=tiles.filter(t=>t?.loaded&&t?.el).length;
    const total=tiles.length;
    const mapAttached=Boolean(layer&&map?.hasLayer?.(layer));
    const pane=map?.getPane?.("gr-weather-radar");
    const opacity=layer?Number(layer.options?.opacity??1):0;
    const visible=Boolean(state.enabled&&mapAttached&&opacity>0
      &&pane?.style?.display!=="none"&&pane?.style?.visibility!=="hidden");
    const stats=layer?.__grRadarTileMetrics||state.v2RenderMetrics||null;
    const details={api_version:state.v2Snapshot?2:state.lastReady?1:null,
      provider_id:state.lastReady?.answer?.provenance?.provider_id||null,
      source_ids:state.v2Snapshot?.layers?.map(x=>x.source_id).slice(0,12)||[],
      diagnostic_detail_enabled:Boolean(this.__weatherEngineTraceStore?.displayExtended),
      layer_present:!!layer,map_attached:mapAttached,pane_visible:pane?.style?.display!=="none",
      opacity:Number.isFinite(opacity)?opacity:null,visible_possible:visible,
      loaded_tiles:loaded,known_tiles:total,zoom:Number(map?.getZoom?.()??NaN),
      native_max_zoom:layer?.__grRadarNativeMaxZoom??null,
      image_pixels_verified:false,tile_metrics:stats?{...stats}:null,
      retained_previous_layer:Boolean(state.regionalHold),
      retained_until:state.regionalHold?new Date(state.regionalHold.deadlineAt).toISOString():null,
      ...detail};
    this._weatherEngineMonitorEvent?.(phase,details);
    if(layer&&!visible)this._weatherEngineMonitorEvent?.("display_gap_suspected",{
      reason:"layer_unmounted_or_hidden",phase,zoom:details.zoom,
      api_version:details.api_version,correlation_id:state.v2CorrelationId||null});
    return details;
  },

  _weatherRadarClearRegionalHold(){
    const state=this._weatherRadarState();
    if(state.regionalHoldTimer)clearTimeout(state.regionalHoldTimer);
    if(state.regionalRecoveryTimer)clearTimeout(state.regionalRecoveryTimer);
    state.regionalHoldTimer=null;state.regionalRecoveryTimer=null;
    state.regionalHold=null;
  },
  _weatherRadarExpireRegionalHold(now=Date.now()){
    const state=this._weatherRadarState(),hold=state.regionalHold;
    if(!hold)return false;
    // A missing, replaced or old source is never a reason to detach a newer
    // layer. Staged callbacks and visibility changes are free to race.
    if(state.layer!==hold.layer||state.v2Snapshot!==hold.snapshot){
      this._weatherRadarClearRegionalHold();return false;
    }
    const invalid=state.v2Snapshot.layers.some(l=>
      !v2RenderedSourceValidity(l,state.v2SnapshotAt,{
        now,satelliteConsent:state.allowOlderSatelliteBackground}).valid);
    if(!invalid&&now<hold.deadlineAt)return false;
    const reason=invalid?"retained_source_expired":"regional_hold_limit";
    this._weatherEngineMonitorEvent?.("v2_regional_hold_expired",{
      reason,retained_source_ids:hold.retainedSourceIds,
      correlation_id:hold.correlationId,elapsed_ms:now-hold.startedAt});
    this._weatherRadarClearRegionalHold();
    // Tile canvases are not independently removable by source. The whole old
    // composite must go before any single component can become stale.
    this._weatherRadarRemoveLayer();
    state.v2Snapshot=null;state.v2SnapshotAt=null;state.v2RenderMetrics=null;
    state.lastReady=null;state.lastUnavailable={code:"source_stale"};
    this._weatherRadarUpdateControls();
    this._weatherRadarVisualAudit("v2_regional_hold_expired");
    this._scheduleWeatherRadarRefresh("regional-hold-expired",200,{force:true});
    return true;
  },
  _weatherRadarRetainRegionalMosaic(result,viewport,correlationId,report){
    const state=this._weatherRadarState(),now=Date.now();
    const existing=state.regionalHold?.layer===state.layer
      &&state.regionalHold?.snapshot===state.v2Snapshot?state.regionalHold:null;
    const decision=decideV2RegionalRetention({
      previous:state.v2Snapshot,next:result.response,viewport:viewport.context,
      zoom:Number(this._map?.getZoom?.()??0),now,previousAt:state.v2SnapshotAt,
      satelliteConsent:state.allowOlderSatelliteBackground,
      previousMounted:Boolean(state.layer&&this._map?.hasLayer?.(state.layer)),
      drawnTiles:state.v2RenderMetrics?.drawn_tiles??0,
      uncoveredTiles:state.v2RenderMetrics?.uncovered_tiles??Infinity,
      existingHold:existing
    });
    if(!decision.retain){
      if(existing&&["source_expired","time_unverified","hold_expired",
        "explicit_regional_rejection","consent_revoked",
        "regional_outside_viewport"].includes(decision.reason)){
        this._weatherEngineMonitorEvent?.("v2_regional_hold_invalidated",{
          reason:decision.reason,correlation_id:correlationId});
        this._weatherRadarExpireRegionalHold(Math.max(now,existing.deadlineAt));
      }
      return false;
    }
    result.layer._p7AbortPending?.();
    this._weatherRadarClearRegionalHold();
    const hold={layer:state.layer,snapshot:state.v2Snapshot,
      startedAt:decision.startedAt,deadlineAt:decision.deadlineAt,
      retainedSourceIds:decision.retained_source_ids,correlationId};
    state.regionalHold=hold;
    const expiryMs=Math.max(1,decision.deadlineAt-Date.now());
    state.regionalHoldTimer=setTimeout(()=>{
      if(state.regionalHold===hold)
        this._weatherRadarExpireRegionalHold();
    },expiryMs+1);
    const retryMs=Math.max(REGIONAL_HOLD_RETRY_MS,
      (state.viewportRefreshIntervalSeconds||15)*1000);
    if(retryMs<expiryMs){
      state.regionalRecoveryTimer=setTimeout(()=>{
        if(state.regionalHold!==hold)return;
        this._weatherRadarExpireRegionalHold();
        if(state.regionalHold===hold)
          void this._refreshWeatherRadar({reason:"regional-provider-retry",force:true});
      },retryMs);
    }
    this._weatherEngineMonitorEvent?.("v2_regional_previous_retained",{
      correlation_id:correlationId,
      reason:decision.reason,
      retained_source_ids:decision.retained_source_ids,
      current_age_seconds:decision.current_age_seconds,
      until:new Date(decision.deadlineAt).toISOString(),
      remaining_ms:decision.remaining_ms,
      geographic_fraction:decision.regional_coverage_fraction,
      coverage_timeout_proven:decision.coverage_timeout_proven,
      source_order:decision.render_order,
      pixels_verified:false});
    report("v2_regional_previous_retained",{
      reason:decision.reason,remaining_ms:decision.remaining_ms,
      coverage_timeout_proven:decision.coverage_timeout_proven});
    this._weatherRadarUpdateControls();
    return true;
  },

  _weatherRadarPreviousValid(){
    const state=this._weatherRadarState(),viewport=this._weatherRadarViewport();
    if(!state.layer||!viewport||!this._map?.hasLayer?.(state.layer))return false;
    const coverage=weatherRadarActiveCoverage(state,viewport.context,
      Number(this._map.getZoom?.()??0));
    return coverage.verified&&coverage.fraction>0;
  },

  _weatherRadarCullOutsideViewport(viewport=this._weatherRadarViewport()){
    const state=this._weatherRadarState();
    if(!state.layer||!viewport)return false;
    if(this._weatherRadarExpireRegionalHold())return true;
    const compositeExpired=state.v2Snapshot?.layers?.some(l=>
      !v2RenderedSourceValidity(l,state.v2SnapshotAt,{
        satelliteConsent:state.allowOlderSatelliteBackground}).valid);
    const coverage=weatherRadarActiveCoverage(state,viewport.context,
      Number(this._map?.getZoom?.()??0));
    if(!compositeExpired&&coverage.verified&&coverage.fraction>0)return false;
    const previousApi=state.v2Snapshot?2:1;
    const sourceIds=state.v2Snapshot?.layers?.map(x=>x.source_id)||[];
    this._weatherEngineMonitorEvent?.("raster_detached_outside_coverage",{
      reason:compositeExpired?"v2_component_expired":coverage.reason,previous_api:previousApi,
      geographic_fraction:Number(coverage.fraction.toFixed(5)),
      source_ids:sourceIds.slice(0,12)});
    this._weatherRadarClearRegionalHold();
    this._weatherRadarRemoveLayer();
    this._weatherRadarClearPreload();
    state.v2Snapshot=null;state.v2SnapshotAt=null;state.v2RenderMetrics=null;
    state.lastReady=null;
    if(state.v2BudgetTimer)clearTimeout(state.v2BudgetTimer);
    state.v2BudgetTimer=null;state.v2BudgetPending=false;
    state.lastUnavailable={code:compositeExpired||["v1_age_invalid","v2_sources_expired"].includes(coverage.reason)
      ?"source_stale":"outside_coverage"};
    this._weatherRadarUpdateControls();
    this._weatherRadarVisualAudit("raster_detached_outside_coverage");
    return true;
  },

  _weatherRadarViewport(){
    const map=this._map;
    if(!map||typeof map.getBounds!=="function")return null;
    const bounds=map.getBounds();
    const west=Number(bounds.getWest()),east=Number(bounds.getEast());
    if(!Number.isFinite(west)||!Number.isFinite(east)||east<west)return null;
    const wrap=n=>((Number(n)+180)%360+360)%360-180;
    const world=east-west>=360;
    const context={type:"bbox",west:world?-180:wrap(west),south:Math.max(-90,bounds.getSouth()),east:world?180:wrap(east),north:Math.min(90,bounds.getNorth())};
    if(context.north<=context.south||context.west===context.east)return null;
    const center=map.getCenter?.();
    const focus=Number.isFinite(Number(center?.lat))&&Number.isFinite(Number(center?.lng))
      ?{latitude:Math.max(-90,Math.min(90,Number(center.lat))),longitude:wrap(center.lng)}:null;
    const signature=[context.west,context.south,context.east,context.north,focus?.longitude??"",focus?.latitude??""].map(n=>typeof n==="number"?n.toFixed(2):n).join("|");
    return {context,focus,signature,world};
  },

  _weatherRadarEnsureMapHooks(){
    const state=this._weatherRadarState();
    if(!this._map){
      if(!state.mapWaitTimer&&this.isConnected!==false)state.mapWaitTimer=setTimeout(()=>{state.mapWaitTimer=null;this._weatherRadarEnsureMapHooks();},500);
      return false;
    }
    if(state.map===this._map)return true;
    if(state.map){
      try{if(state.onMove)state.map.off("moveend",state.onMove);if(state.onZoom)state.map.off("zoomend",state.onZoom);}catch(_error){}
    }
    state.map=this._map;
    state.onMove=()=>{
      const next=this._weatherRadarViewport()?.signature;
      if(next&&state.lastViewport&&next!==state.lastViewport){
        state.v2Generation++;
        state.v1PendingCancel?.();
        if(state.v2PendingLayer){
          try{state.v2PendingLayer._p7AbortPending?.();state.v2PendingLayer.remove();}catch(_){}
          state.v2PendingLayer=null;
        }
      }
      // Detach regionally invalid imagery immediately, before asynchronous
      // WR requests return. A German WMS must not travel with the map to Cuba.
      this._weatherRadarCullOutsideViewport();
      this._weatherRadarVisualAudit("viewport_changed");
      this._scheduleWeatherRadarRefresh("viewport",900);
      this._scheduleWeatherRadarPreload("viewport",220);
    };
    state.onZoom=()=>{this._weatherDisplayRefreshRenderedLayers?.();state.onMove?.();};
    state.map.on("moveend",state.onMove);
    state.map.on("zoomend",state.onZoom);
    return true;
  },

  _scheduleWeatherRadarRefresh(reason="timer",delay=0,{force=false}={}){
    const state=this._weatherRadarState();
    if(!state.enabled)return;
    if(state.debounceTimer)clearTimeout(state.debounceTimer);
    state.debounceTimer=setTimeout(()=>{
      state.debounceTimer=null;void this._refreshWeatherRadar({reason,force});
    },Math.max(0,delay));
  },
  _weatherRadarScheduleBudgetRecovery(snapshot){
    const state=this._weatherRadarState();
    if(!state.enabled||state.v2Snapshot!==snapshot||state.v2BudgetPending)return;
    const delay=Math.max(250,15000-(Date.now()-(state.v2LastBudgetRecovery||0)));
    state.v2BudgetPending=true;
    state.v2BudgetTimer=setTimeout(()=>{
      state.v2BudgetTimer=null;state.v2BudgetPending=false;
      if(!state.enabled||state.v2Snapshot!==snapshot)return;
      state.v2LastBudgetRecovery=Date.now();
      this._weatherEngineMonitorEvent?.("v2_budget_recovery_requested",{minimum_interval_s:15});
      void this._refreshWeatherRadar({reason:"raster-budget-recovery",force:true});
    },delay);
  },
  
  _weatherRadarRecoverExpiredRequest(now=Date.now(),reason="request-watchdog"){
    const state=this._weatherRadarState();
    if(!state.inFlight||!state.inFlightStartedAt||now-state.inFlightStartedAt<35000)return false;
    const elapsed=now-state.inFlightStartedAt;
    state.v2Generation++;
    state.v1PendingCancel?.();
    if(state.v2PendingLayer){
      try{state.v2PendingLayer._p7AbortPending?.();state.v2PendingLayer.remove();}catch(_error){}
      state.v2PendingLayer=null;
    }
    // The old promise may settle later; its finally clause checks inFlightToken.
    state.inFlight=false;state.inFlightToken=null;state.inFlightStartedAt=0;
    state.pending=false;state.pendingForce=false;
    this._weatherEngineMonitorEvent?.("radar_inflight_watchdog_recovered",{
      reason,elapsed_ms:elapsed});
    return true;
  },
  _weatherRadarOnAppVisible(source="visibilitychange"){
    const state=this._weatherRadarState();
    if(!state.enabled||this.isConnected===false)return false;
    if(typeof document!=="undefined"&&document.visibilityState==="hidden"){
      state.appHiddenAt=Date.now();return false;
    }
    const now=Date.now();
    const awayMs=state.appHiddenAt?Math.max(0,now-state.appHiddenAt):0;
    // Some Android WebViews suppress visibilitychange: focus can recover an
    // idle visible app, but must not create a refresh storm during UI focus.
    const idleFocus=source==="focus"&&now-(state.lastRequestAt||0)>=30000;
    if(!state.appHiddenAt&&source!=="pageshow-persisted"&&!idleFocus)return false;
    if(now-(state.lastForegroundRefreshAt||0)<2000)return false;
    state.appHiddenAt=0;state.lastForegroundRefreshAt=now;
    const unstuck=this._weatherRadarRecoverExpiredRequest(now,"app-foreground");
    this._weatherRadarEnsureMapHooks();
    this._weatherRadarCullOutsideViewport();
    try{this._map?.invalidateSize?.({pan:false,animate:false});}catch(_error){}
    this._weatherEngineMonitorEvent?.("weather_radar_app_foreground",{
      source,away_ms:awayMs,expired_request_recovered:unstuck,
      in_flight:state.inFlight});
    // Keep a valid previous layer visible until a replacement is painted.
    // An active request will preserve this forced refresh in pendingForce.
    this._scheduleWeatherRadarRefresh("app-foreground",250,{force:true});
    return true;
  },
  _weatherRadarAttachAppEvents(){
    const state=this._weatherRadarState();
    if(typeof document!=="undefined"&&!state.visibilityHandler){
      state.visibilityHandler=()=>{
        if(document.visibilityState==="hidden")state.appHiddenAt=Date.now();
        else if(document.visibilityState==="visible")this._weatherRadarOnAppVisible("visibilitychange");
      };
      document.addEventListener("visibilitychange",state.visibilityHandler);
      if(document.visibilityState==="hidden")state.appHiddenAt=Date.now();
    }
    if(typeof window!=="undefined"&&!state.pageShowHandler){
      state.pageShowHandler=event=>{
        if(event?.persisted)this._weatherRadarOnAppVisible("pageshow-persisted");
      };
      window.addEventListener("pageshow",state.pageShowHandler);
    }
    if(typeof window!=="undefined"&&!state.focusHandler){
      state.focusHandler=()=>this._weatherRadarOnAppVisible("focus");
      window.addEventListener("focus",state.focusHandler);
    }
  },
  _weatherRadarDetachAppEvents(){
    const state=this._weatherRadarState();
    if(state.visibilityHandler&&typeof document!=="undefined")
      document.removeEventListener("visibilitychange",state.visibilityHandler);
    if(state.pageShowHandler&&typeof window!=="undefined")
      window.removeEventListener("pageshow",state.pageShowHandler);
    if(state.focusHandler&&typeof window!=="undefined")
      window.removeEventListener("focus",state.focusHandler);
    state.visibilityHandler=state.pageShowHandler=state.focusHandler=null;
    state.appHiddenAt=0;
  },
  async _setWeatherRadarEnabled(enabled,{persist=true}={}){
    const state=this._weatherRadarState();
    state.enabled=Boolean(enabled);
    if(persist)try{localStorage.setItem(STORAGE_KEY,state.enabled?"1":"0");}catch(_error){}
    this._weatherRadarUpdateControls();
    if(!state.enabled){
      state.v2Generation++;
      state.v1PendingCancel?.();
      if(state.v2PendingLayer){try{state.v2PendingLayer.remove();}catch(_){}state.v2PendingLayer=null;}
      this._weatherRadarRemoveLayer();
      this._weatherRadarClearPreload();
      if(state.refreshTimer){clearInterval(state.refreshTimer);state.refreshTimer=null;}
      return;
    }
    this._weatherRadarEnsureMapHooks();
    if(!state.refreshTimer)state.refreshTimer=setInterval(()=>this._scheduleWeatherRadarRefresh("timer",0),REFRESH_MS);
    await this._refreshWeatherRadar({reason:"enable",force:true});
  },

  _setWeatherRadarOlderSatelliteBackground(enabled){
    const state=this._weatherRadarState(),next=Boolean(enabled);
    if(state.allowOlderSatelliteBackground===next)return;
    state.allowOlderSatelliteBackground=next;
    try{localStorage.setItem(BACKGROUND_STORAGE_KEY,next?"1":"0");}catch(_error){}
    state.v2Generation++; // Invalidate all in-flight V1/V2 replies on consent change.
    state.v1PendingCancel?.();
    if(state.v2PendingLayer){
      try{state.v2PendingLayer._p7AbortPending?.();state.v2PendingLayer.remove();}catch(_error){}
      state.v2PendingLayer=null;
    }
    if(!next&&weatherRadarNeedsConsentDetach(state)){
      this._weatherEngineMonitorEvent?.("satellite_consent_revoked",{reason:"older_satellite_layer_invalid"});
      this._weatherRadarRemoveLayer();
      state.v2Snapshot=null;state.v2SnapshotAt=null;state.v2RenderMetrics=null;state.lastReady=null;
      if(state.v2BudgetTimer)clearTimeout(state.v2BudgetTimer);
      state.v2BudgetTimer=null;state.v2BudgetPending=false;
      this._weatherRadarVisualAudit("satellite_consent_revoked");
    }
    state.lastRequestAt=0;
    this._weatherRadarUpdateControls();
    if(!state.enabled)return;
    if(state.inFlight){state.pending=true;state.pendingForce=true;}
    else void this._refreshWeatherRadar({reason:"background-policy-change",force:true});
  },

  _weatherRadarNaturalOpacity(){
    const state=this._weatherRadarState();
    const live=finite(state.layer?.__grRadarNaturalOpacity);
    if(live!=null)return clamp(live,0,1);
    const payload=state.lastReady?.answer?.resource?.payload;
    return clamp(finite(payload?.default_opacity)??0.58,0,1);
  },

  _weatherRadarEffectiveOpacity(naturalOpacity=this._weatherRadarNaturalOpacity()){
    return this._weatherDisplayOpacity?.("precipitation",naturalOpacity)??clamp(naturalOpacity,0,1);
  },

  _weatherRadarApplyDisplayOpacity(){
    const state=this._weatherRadarState();
    if(!state.layer)return;
    try{state.layer.setOpacity?.(this._weatherRadarEffectiveOpacity(state.layer.__grRadarNaturalOpacity??0.58));}catch(_error){}
    this._weatherDisplaySyncUi?.();
  },

  _weatherRadarCreateLayer(L,payload,attribution,opacityOverride=null,coverage=null){
    const tileSize=Math.max(1,Math.round(finite(payload.tile_size)||256));
    const minZoom=Math.max(0,finite(payload.min_zoom)||0);
    const maxZoom=Math.max(minZoom,finite(payload.max_zoom)||18);
    const naturalOpacity=clamp(finite(payload.default_opacity)??0.58,0,1);
    const effectiveOpacity=this._weatherRadarEffectiveOpacity(naturalOpacity);
    const opacity=opacityOverride==null?effectiveOpacity:clamp(finite(opacityOverride)??effectiveOpacity,0,1);
    const map=this._map;
    if(!map.getPane("gr-weather-radar")){
      const pane=map.createPane("gr-weather-radar");
      pane.style.zIndex="230";
      pane.style.pointerEvents="none";
    }
    this._weatherDisplayApplyRasterPaneStyle?.("precipitation",map.getPane("gr-weather-radar"));
    // Do not set GridLayer.maxZoom to the source's native max zoom.
    // Omitting the display ceiling lets the map keep its own zoom limits.
    // Leaflet reuses the source's native tiles at higher display zooms.
    const layer=L.gridLayer({pane:"gr-weather-radar",tileSize,minZoom,maxNativeZoom:maxZoom,opacity,attribution:attribution||"",updateWhenIdle:true,keepBuffer:1});
    layer.__grRadarNativeMaxZoom=maxZoom;
    layer.__grRadarNaturalOpacity=naturalOpacity;
    layer.__grRadarTileMetrics={requested:0,loaded:0,failed:0,cached:0,expected_empty:0,
      max_tile_ms:0,tile_errors:[]};
    layer.__grRadarTileIdentity=[String(payload.tile_url||""),tileSize,minZoom,maxZoom,
      coverage?.scope||"",JSON.stringify(coverage?.bbox||null)].join("|");
    const template=String(payload.tile_url||"");
    layer.createTile=(coords,done)=>{
      const started=performance.now();
      const stats=layer.__grRadarTileMetrics;
      stats.requested++;
      // The WR-verified geographic envelope is the sole basis for masking.
      // A tile entirely outside is expected transparency, NOT a network error.
      const crops=coverage?rasterTilePixelCrops(coords,coverage,tileSize):null;
      const canvas=crops?document.createElement("canvas"):null;
      if(canvas){canvas.width=tileSize;canvas.height=tileSize;
        this._weatherDisplayApplyRasterStyle?.("precipitation",canvas);}
      const maskImage=image=>{
        if(!canvas)return image;
        const ctx=canvas.getContext("2d");
        if(!ctx)throw new Error("canvas_context_unavailable");
        for(const c of crops)
          ctx.drawImage(image,c.sx,c.sy,c.sw,c.sh,c.sx,c.sy,c.sw,c.sh);
        return canvas;
      };
      const recordFailure=(reason,element)=>{
        stats.failed++;
        const detail={zoom:coords.z,x:coords.x,y:coords.y,
          reason,within_verified_coverage:Boolean(crops?.length),
          duration_ms:Math.round(performance.now()-started)};
        stats.tile_errors.push(detail);
        if(stats.tile_errors.length>8)stats.tile_errors.shift();
        this._weatherEngineMonitorEvent?.("v1_tile_error",{
          ...detail,failed:stats.failed,requested:stats.requested});
        done?.(new Error(reason),element);
      };
      if(crops&&!crops.length){
        stats.expected_empty++;
        queueMicrotask(()=>done?.(null,canvas));
        return canvas;
      }
      const url=expandWeatherRasterTileUrl(String(payload.tile_url||""),coords);
      const state=this._weatherRadarState();
      const cached=state.preloadCache.get(url);
      if(cached?.status==="ready"&&cached.img){
        state.preloadCache.delete(url);
        cached.lastUsed=Date.now();
        stats.cached++;
        const image=cached.img;
        image.onload=null;image.onerror=null;
        if(!canvas)this._weatherDisplayApplyRasterStyle?.("precipitation",image);
        queueMicrotask(()=>{
          try{const element=maskImage(image);stats.loaded++;done?.(null,element);}
          catch(_error){recordFailure("canvas_draw_failed",canvas||image);}
        });
        this._weatherRadarUpdatePreloadControls();
        return canvas||image;
      }
      const img=document.createElement("img");
      img.alt="";
      img.setAttribute("role","presentation");
      img.referrerPolicy="strict-origin-when-cross-origin";
      img.style.width="100%";img.style.height="100%";
      if(!canvas)this._weatherDisplayApplyRasterStyle?.("precipitation",img);
      img.onload=()=>{
        let element;
        try{element=maskImage(img);}
        catch(_error){recordFailure("canvas_draw_failed",canvas||img);return;}
        stats.loaded++;stats.max_tile_ms=Math.max(stats.max_tile_ms,
          Math.round(performance.now()-started));
        if(stats.loaded===1||stats.loaded%(this.__weatherEngineTraceStore?.displayExtended?4:32)===0)
          this._weatherEngineMonitorEvent?.("v1_tile_progress",{
            provider_api:1,zoom:coords.z,requested:stats.requested,
            loaded:stats.loaded,failed:stats.failed,expected_empty:stats.expected_empty,
            max_tile_ms:stats.max_tile_ms});
        done?.(null,element);
      };
      img.onerror=()=>recordFailure("image_load_failed_unclassified",canvas||img);
      img.src=url;
      return canvas||img;
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
    if(state.v2BudgetTimer)clearTimeout(state.v2BudgetTimer);
    state.v2BudgetTimer=null;state.v2BudgetPending=false;
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

  _setWeatherRadarViewportRefreshInterval(value){
    const state=this._weatherRadarState();
    state.viewportRefreshIntervalSeconds=clamp(Math.round(finite(value)??VIEWPORT_REFRESH_INTERVAL_DEFAULT_SECONDS),VIEWPORT_REFRESH_INTERVAL_MIN_SECONDS,VIEWPORT_REFRESH_INTERVAL_MAX_SECONDS);
    try{localStorage.setItem(VIEWPORT_REFRESH_INTERVAL_STORAGE_KEY,String(state.viewportRefreshIntervalSeconds));}catch(_error){}
    this._weatherRadarUpdateRefreshIntervalControls();
  },

  _weatherRadarUpdateRefreshIntervalControls(){
    const state=this._weatherRadarState();
    const range=this.shadow?.getElementById("weather-radar-refresh-interval-range");
    const number=this.shadow?.getElementById("weather-radar-refresh-interval-number");
    const status=this.shadow?.getElementById("weather-radar-refresh-interval-status");
    if(range)range.value=String(state.viewportRefreshIntervalSeconds);
    if(number)number.value=String(state.viewportRefreshIntervalSeconds);
    if(status)status.textContent=state.viewportRefreshIntervalSeconds+" Sek. · "+(state.viewportRefreshIntervalSeconds<=5?"schnell":state.viewportRefreshIntervalSeconds<=20?"ausgewogen":"schonend");
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

  _setWeatherRadarTimelineVisible(visible,{persist=true}={}){
    const state=this._weatherRadarState();
    state.timelineVisible=Boolean(visible);
    if(persist)try{localStorage.setItem(TIMELINE_VISIBLE_STORAGE_KEY,state.timelineVisible?"1":"0");}catch(_error){}
    if(state.timelineVisible){
      if(state.timelineModel?.frames?.length>1)this._weatherRadarMountTimelinePlayer();
    }else{
      this._weatherRadarRemoveTimelinePlayer();
    }
    this._weatherRadarUpdateControls();
    this._syncMapDisplayMenuExtension?.();
  },

  _weatherRadarPersistTimelinePosition(){
    const position=this._weatherRadarState().timelinePosition;
    try{
      if(position)localStorage.setItem(TIMELINE_POSITION_STORAGE_KEY,JSON.stringify(position));
      else localStorage.removeItem(TIMELINE_POSITION_STORAGE_KEY);
    }catch(_error){}
  },

  _weatherRadarApplyTimelinePosition(root){
    const state=this._weatherRadarState(),card=this.shadow?.getElementById("map-card");
    if(!root||!card)return;
    if(!state.timelinePosition){
      const legend=this.shadow?.getElementById("map-legend");
      const legendHeight=Math.max(0,Math.round(legend?.getBoundingClientRect?.().height||legend?.offsetHeight||48));
      const weatherLegend=this.shadow?.getElementById("weather-legend-overlay");
      const weatherLegendHeight=weatherLegend&&!weatherLegend.hidden?Math.max(0,Math.round(weatherLegend.getBoundingClientRect?.().height||weatherLegend.offsetHeight||0)):0;
      root.style.left="50%";root.style.top="auto";root.style.bottom=(legendHeight+10+(weatherLegendHeight?weatherLegendHeight+8:0))+"px";root.style.transform="translateX(-50%)";
      return;
    }
    const maxX=Math.max(0,card.clientWidth-root.offsetWidth),maxY=Math.max(0,card.clientHeight-root.offsetHeight);
    const px=Math.round(clamp(state.timelinePosition.x,0,1)*maxX),py=Math.round(clamp(state.timelinePosition.y,0,1)*maxY);
    root.style.left=px+"px";root.style.top=py+"px";root.style.bottom="auto";root.style.transform="none";
  },

  _weatherRadarBindTimelineDrag(root,handle){
    if(!root||!handle||handle.dataset.timelineDragBound==="1")return;
    handle.dataset.timelineDragBound="1";
    const move=event=>{
      const state=this._weatherRadarState(),drag=state.timelineDragging;
      if(!drag||drag.pointerId!==event.pointerId)return;
      const card=this.shadow?.getElementById("map-card");if(!card)return;
      const cardRect=card.getBoundingClientRect(),maxX=Math.max(0,card.clientWidth-root.offsetWidth),maxY=Math.max(0,card.clientHeight-root.offsetHeight);
      const px=clamp(event.clientX-cardRect.left-drag.offsetX,0,maxX),py=clamp(event.clientY-cardRect.top-drag.offsetY,0,maxY);
      state.timelinePosition={x:maxX>0?px/maxX:0.5,y:maxY>0?py/maxY:0.5};
      root.style.left=Math.round(px)+"px";root.style.top=Math.round(py)+"px";root.style.bottom="auto";root.style.transform="none";
      event.preventDefault();event.stopPropagation();
    };
    const finish=event=>{
      const state=this._weatherRadarState(),drag=state.timelineDragging;
      if(!drag||drag.pointerId!==event.pointerId)return;
      state.timelineDragging=null;
      try{handle.releasePointerCapture?.(event.pointerId);}catch(_error){}
      this._weatherRadarPersistTimelinePosition();
      event.preventDefault();event.stopPropagation();
    };
    handle.addEventListener("pointerdown",event=>{
      if(event.button!=null&&event.button!==0)return;
      const card=this.shadow?.getElementById("map-card");if(!card)return;
      const rect=root.getBoundingClientRect(),state=this._weatherRadarState();
      state.timelineDragging={pointerId:event.pointerId,offsetX:event.clientX-rect.left,offsetY:event.clientY-rect.top};
      try{handle.setPointerCapture?.(event.pointerId);}catch(_error){}
      event.preventDefault();event.stopPropagation();
    });
    handle.addEventListener("pointermove",move);
    handle.addEventListener("pointerup",finish);
    handle.addEventListener("pointercancel",finish);
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
    const state=this._weatherRadarState();
    this._weatherRadarStopTimelinePlayback();
    this._weatherRadarClearTimelineStage();
    if(state.timelineResizeObserver){try{state.timelineResizeObserver.disconnect();}catch(_error){}state.timelineResizeObserver=null;}
    state.timelineDragging=null;
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
    const frame=state.timelineModel?.frames?.[index];
    const kind=String(frame?.kind||"").toLowerCase();
    const labels={observation:"Beobachtung",estimate:"Schätzung",forecast:"Vorhersage",nowcast:"Nowcast",analysis:"Analyse",past:"Vergangenheit",current:"Jetzt"};
    if(labels[kind])return labels[kind];
    const current=state.timelineModel?.currentIndex??-1;
    return index<current?"Vergangenheit":index===current?"Jetzt":"Vorhersage";
  },

  _weatherRadarMountTimelinePlayer(){
    const state=this._weatherRadarState();
    const model=state.timelineModel;
    const card=this.shadow?.getElementById("map-card");
    if(!card||!model||model.frames.length<2||!state.timelineVisible){this._weatherRadarRemoveTimelinePlayer();return;}
    let root=this.shadow?.querySelector('[data-weather-radar-player="true"]');
    if(!root){
      root=document.createElement("div");
      root.dataset.weatherRadarPlayer="true";
      root.id="weather-radar-player";
      root.setAttribute("role","group");
      root.setAttribute("aria-label","Niederschlags-Zeitverlauf");
      root.style.cssText="position:absolute;left:50%;bottom:58px;transform:translateX(-50%);z-index:750;width:min(560px,calc(100% - 22px));box-sizing:border-box;padding:7px 9px 8px;border:1px solid rgba(125,184,239,.36);border-radius:14px;background:rgba(8,13,20,.88);box-shadow:0 8px 26px rgba(0,0,0,.38),inset 0 1px 0 rgba(255,255,255,.04);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);color:#e7edf5;pointer-events:auto;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
      const top=document.createElement("div");top.style.cssText="display:flex;align-items:center;gap:6px;min-width:0";
      const drag=document.createElement("button");drag.type="button";drag.dataset.timelineDrag="true";drag.textContent="⠿";drag.title="Zeitachse verschieben";drag.setAttribute("aria-label","Zeitachse verschieben");drag.style.cssText="appearance:none;-webkit-appearance:none;width:30px;min-width:30px;height:30px;padding:0;border-radius:9px;border:1px solid rgba(125,184,239,.26);background:rgba(16,22,31,.92);color:#a9cceb;font-weight:900;font-size:15px;line-height:1;cursor:grab;touch-action:none";
      const prev=document.createElement("button");prev.type="button";prev.dataset.timelineAction="prev";prev.textContent="‹";prev.title="Vorheriger Niederschlagszeitpunkt";
      const play=document.createElement("button");play.type="button";play.dataset.timelineAction="play";play.title="Niederschlagsfolge abspielen";
      const next=document.createElement("button");next.type="button";next.dataset.timelineAction="next";next.textContent="›";next.title="Nächster Niederschlagszeitpunkt";
      const now=document.createElement("button");now.type="button";now.dataset.timelineAction="now";now.textContent="Jetzt";now.title="Zum aktuellen Niederschlagszeitpunkt";
      [prev,play,next,now].forEach(button=>button.style.cssText="appearance:none;-webkit-appearance:none;min-width:34px;height:30px;padding:0 9px;border-radius:9px;border:1px solid rgba(246,195,68,.34);background:rgba(16,22,31,.92);color:#f3d16d;font-weight:850;font-size:13px;line-height:1;cursor:pointer;touch-action:manipulation");
      const label=document.createElement("div");label.dataset.timelineLabel="true";label.style.cssText="min-width:0;flex:1;text-align:center;font-size:12px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis";
      top.append(drag,prev,play,next,label,now);
      const range=document.createElement("input");range.type="range";range.min="0";range.step="1";range.value="0";range.dataset.timelineRange="true";range.setAttribute("aria-label","Radarzeitpunkt");range.style.cssText="display:block;width:100%;height:22px;margin:2px 0 0;accent-color:#79bfff";
      const footer=document.createElement("div");footer.style.cssText="display:flex;justify-content:space-between;gap:8px;margin-top:-1px;font-size:9.5px;font-weight:700;letter-spacing:.02em;opacity:.68";
      footer.innerHTML="<span>Vergangenheit</span><span>Jetzt</span><span>Vorhersage</span>";
      root.append(top,range,footer);
      this._weatherRadarBindTimelineDrag(root,drag);
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
      if(typeof ResizeObserver==="function"&&!state.timelineResizeObserver){state.timelineResizeObserver=new ResizeObserver(()=>this._weatherRadarRenderTimelinePlayer());state.timelineResizeObserver.observe(card);}
    }
    this._weatherRadarRenderTimelinePlayer();
  },

  _weatherRadarRenderTimelinePlayer(){
    const state=this._weatherRadarState(),model=state.timelineModel;
    const root=this.shadow?.querySelector('[data-weather-radar-player="true"]');
    if(!root||!model?.frames?.length)return;
    this._weatherRadarApplyTimelinePosition(root);
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
    if(play){play.textContent=state.timelinePlaying?"❚❚":"▶";play.title=state.timelinePlaying?"Wiedergabe anhalten":"Niederschlagsfolge abspielen";}
  },

  _weatherRadarRenderCurrentLegend(){
    const state=this._weatherRadarState(),answer=state.lastReady?.answer;
    if(state.v2Snapshot){
      const layers=state.v2Snapshot.layers;
      const older=layers.filter(layer=>layer.freshness_class==="older_background");
      const label="Niederschlag · "+layers.length+" Mosaikquellen"+(older.length?" · ältere Satellitengrundlage":"");
      this._weatherRadarRenderLegend({
        family:"precipitation",capability:CAPABILITY,heading:"Niederschlag",
        label,subtitle:"WeatherRouter V2 · partielle Bildabdeckung"+(older.length?" · ältere Satellitenschätzung (kein aktuelles Radar)":""),
        title:[label,"Herkunft: "+layers.map(x=>x.attribution).join(" / "),
          "Bezugszeit (UTC): "+(state.v2Snapshot.reference_time||"unbekannt"),
          ...layers.map(layer=>"Quelle: "+layer.source_id+
            " · "+(layer.freshness_class==="older_background"?"Ältere Satellitengrundlage":"aktuelle Quelle")+
            " · Bildzeit (UTC): "+layer.times.valid_at+
            " · Alter: "+(typeof layer.times.age_seconds==="number"?Math.round(layer.times.age_seconds/60)+" Min.":"unbekannt")+
            " · Methode: "+layer.semantics.measurement_method+
            (layer.quality_note?" · Hinweis: "+layer.quality_note:"")),
          ...(state.v2Snapshot.limitations||[])].join(" · "),
        legendTitle:"Niederschlagslegende",priority:100
      });
      return;
    }
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
    const semantics=answer.resource?.semantics&&typeof answer.resource.semantics==="object"?answer.resource.semantics:{};
    const entries=Array.isArray(legend?.entries)?legend.entries:Array.isArray(legend?.stops)?legend.stops:[];
    this._weatherRadarRenderLegend({
      family:"precipitation",
      capability:CAPABILITY,
      heading:"Niederschlag",
      label,
      subtitle:description.provider+" · "+timePart,
      title,
      legendUrl:legend?.url||null,
      legendTitle:legend?.title||"Niederschlagslegende",
      unit:typeof semantics.unit==="string"?semantics.unit:"",
      entries,
      priority:100
    });
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
    state.timelineLoadMessage="Lade Niederschlagszeitpunkt …";this._weatherRadarRenderTimelinePlayer();
    const staged=await this._weatherRadarStageTimelineFrame(target);
    if(!staged||!state.timelineStageLayer){
      state.timelineLoadMessage="Niederschlagszeitpunkt konnte nicht geladen werden";
      state.timelinePlaying=false;
      this._weatherRadarRenderTimelinePlayer();
      return false;
    }
    const next=state.timelineStageLayer,old=state.layer;
    state.timelineStageLayer=null;state.timelineStageIndex=-1;state.timelineStageReady=false;state.timelineStagePromise=null;
    try{next.setOpacity?.(this._weatherRadarEffectiveOpacity(next.__grRadarNaturalOpacity??0.58));}catch(_error){}
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
    this._weatherRadarClearRegionalHold();
    this._weatherRadarRemoveTimelinePlayer();
    state.timelineModel=null;state.timelineIndex=-1;state.timelineLoadMessage=null;
    if(state.layer){try{state.layer.remove();}catch(_error){}state.layer=null;}
    this._weatherRadarRenderLegend(null);
  },

  _weatherRadarRenderLegend(model){
    const legacy=this.shadow?.querySelector?.('[data-weather-radar-legend="true"]');legacy?.remove?.();
    if(typeof this._weatherLegendSetModel==="function"){
      if(!model){this._weatherLegendClear?.("precipitation");return;}
      this._weatherLegendSetModel("precipitation",{
        family:model.family||"precipitation",
        capability:model.capability||CAPABILITY,
        title:model.heading||"Niederschlag",
        subtitle:model.subtitle||model.label||"",
        details:model.title||model.label||"",
        legendUrl:model.legendUrl||"",
        legendTitle:model.legendTitle||"Niederschlagslegende",
        unit:model.unit||"",
        entries:Array.isArray(model.entries)?model.entries:[],
        priority:Number.isFinite(Number(model.priority))?Number(model.priority):100,
        active:true
      });
      return;
    }
    const host=this.shadow?.getElementById("map-legend");
    if(!host)return;
    let item=host.querySelector('[data-weather-radar-legend="true"]');
    if(!model){item?.remove();return;}
    item=document.createElement("span");
    item.className="legend-item";
    item.dataset.weatherRadarLegend="true";
    const text=document.createElement("span");text.textContent=model.label||"Niederschlag";
    item.append(text);host.append(item);item.title=model.title||model.label||"";
  },

  _weatherRadarDescribe(answer){
    const provider=answer?.provenance?.provider_name||"WeatherRouter";
    const age=finite(answer?.freshness?.age_seconds);
    const ageText=age==null?"Alter unbekannt":age<90?Math.round(age)+" s":Math.round(age/60)+" min";
    const coverage=answer?.provenance?.coverage||"aktueller Kartenausschnitt";
    const limitations=Array.isArray(answer?.provenance?.limitations)?answer.provenance.limitations.filter(Boolean):[];
    return {provider,ageText,coverage,limitations};
  },

  async _weatherRadarApplyReady(answer,viewport,token){
    const state=this._weatherRadarState();
    const payload=answer?.resource?.payload;
    if(!payload?.tile_url)return false;
    // Fail closed for V1: radar is current for 900 s, older satellite
    // estimates require an explicit opt-in and positive semantic evidence.
    const sem=answer?.resource?.semantics||{};
    const age=answer?.freshness?.age_seconds;
    const currentAge=typeof age==="number"&&Number.isFinite(age)&&age>=0&&age<=900;
    const permittedSatellite=typeof age==="number"&&Number.isFinite(age)&&age>=0&&
      age<=BACKGROUND_MAX_AGE_SECONDS&&state.allowOlderSatelliteBackground===true&&
      sem.observation_kind==="estimate"&&
      String(sem.measurement_method||"").includes("satellite");
    if(!currentAge&&!permittedSatellite){
      this._weatherEngineMonitorEvent?.("v1_raster_age_rejected",{
        older_background_opt_in:state.allowOlderSatelliteBackground,
        age_seconds:Number.isFinite(age)?age:null});
      return false;
    }
    const current=()=>state.enabled&&state.v2Generation===token&&Boolean(this._map)
      &&this._weatherRadarViewport()?.signature===viewport.signature;
    if(!current())return false;
    // V1 does not promise every selected source intersects the BBOX. A
    // no-coverage/unknown-coverage answer is never a valid replacement.
    const v1Coverage=measureV1RasterCoverage(answer?.provenance,viewport.context,
      Number(this._map?.getZoom?.()??0));
    if(v1Coverage.verified!==true||v1Coverage.fraction<=0){
      this._weatherEngineMonitorEvent?.("v1_outside_coverage_rejected",{
        provider_id:answer?.provenance?.provider_id||null,
        reason:v1Coverage.verified?"outside_coverage":"coverage_unverified",
        geographic_fraction:Number(v1Coverage.fraction.toFixed(5))});
      return false;
    }
    const description=this._weatherRadarDescribe(answer);
    const attribution=payload.attribution||answer.provenance?.attribution||description.provider;
    const spatial=answer?.provenance?.spatial_coverage;
    const verifiedMask=spatial?.scope==="global"?{scope:"global",verified:true}
      :spatial?.scope==="bbox"&&spatial.bbox
        ?{scope:"bbox",bbox:spatial.bbox,verified:true}:null;
    const tileIdentity=[String(payload.tile_url||""),Math.max(1,Math.round(finite(payload.tile_size)||256)),
      Math.max(0,finite(payload.min_zoom)||0),
      Math.max(Math.max(0,finite(payload.min_zoom)||0),finite(payload.max_zoom)||18),
      verifiedMask?.scope||"",JSON.stringify(verifiedMask?.bbox||null)].join("|");
    const previous=state.layer;
    const decision=decideV1RasterSwap({
      previous:state.v2Snapshot?{layers:state.v2Snapshot.layers}
        :state.lastReady?.answer||null,
      next:answer,viewport:viewport.context,
      zoom:Number(this._map?.getZoom?.()??0),
      previousUsable:this._weatherRadarPreviousValid()
    });
    this._weatherEngineMonitorEvent?.("v1_candidate_evaluated",{
      provider_id:answer.provenance?.provider_id||null,
      correlation_id:state.v2CorrelationId||null,
      coverage_fraction:decision.new_fraction,
      previous_coverage_fraction:decision.old_fraction,
      previous_api:state.v2Snapshot?2:state.lastReady?1:null,
      decision:decision.reason});
    // Retain the proven broad source instead of replacing a continent-sized
    // image with a tiny regional WMS tile. V1 remains usable on cold start.
    if(!decision.allow){
      this._weatherEngineMonitorEvent?.("v1_regional_replacement_prevented",{
        correlation_id:state.v2CorrelationId||null,
        provider_id:answer.provenance?.provider_id||null,
        previous_provider:state.lastReady?.answer?.provenance?.provider_id||null,
        old_coverage_fraction:decision.old_fraction,
        new_coverage_fraction:decision.new_fraction,
        zoom:Number(this._map?.getZoom?.()??0),
        reason:decision.reason});
      this._weatherRadarVisualAudit("broad_layer_retained");
      this._weatherRadarUpdateControls();
      return true;
    }
    // Identical image addresses represent the same raster: refresh metadata,
    // but never destroy/recreate a fully loaded layer on every V1 resolution.
    const unchanged=Boolean(previous&&!state.v2Snapshot
      &&previous.__grRadarTileIdentity===tileIdentity
      &&!(previous.__grRadarTileMetrics?.failed>0));
    let next=null;
    const stageStarted=performance.now();
    this._weatherEngineMonitorEvent?.("v1_stage_started",{
      provider_id:answer.provenance?.provider_id||null,
      coverage_fraction:decision.new_fraction,
      correlation_id:state.v2CorrelationId||null});
    if(!unchanged){
      let L;
      try{L=await loadLeafletJs();}catch(_error){return false;}
      if(!current())return false;
      // Stage verified regional pixels; errors are distinct from expected
      // transparent tiles. The previous valid layer stays visible meanwhile.
      next=this._weatherRadarCreateLayer(L,payload,attribution,0,verifiedMask);
      const ready=await new Promise(resolve=>{
        let settled=false,loaded=0,failed=0,timer=null;
        const finish=ok=>{
          if(settled)return;
          settled=true;
          if(timer!==null)clearTimeout(timer);
          next.off?.("tileload",onLoaded);
          next.off?.("tileerror",onError);
          next.off?.("load",onComplete);
          if(state.v1PendingLayer===next){state.v1PendingLayer=null;state.v1PendingCancel=null;}
          resolve(ok);
        };
        const onLoaded=()=>{loaded++;};
        const onError=()=>{failed++;};
        const onComplete=()=>{
          const stats=next.__grRadarTileMetrics;
          const decision=decideV1TileStage(stats);
          this._weatherEngineMonitorEvent?.(decision.partial&&decision.accepted
            ?"v1_partial_stage_accepted":"v1_stage_completion",{
            correlation_id:state.v2CorrelationId||null,
            loaded_tiles:decision.loaded,failed_tiles:decision.failed,
            expected_empty_tiles:decision.expected_empty,
            image_pixels_verified:false,partial:decision.partial,
            accepted:decision.accepted,tile_errors:stats.tile_errors.slice(0,8)});
          finish(decision.accepted);
        };
        state.v1PendingLayer=next;
        state.v1PendingCancel=()=>finish(false);
        next.on("tileload",onLoaded);
        next.on("tileerror",onError);
        next.on("load",onComplete);
        timer=setTimeout(()=>finish(false),V1_LAYER_STAGE_TIMEOUT_MS);
        try{next.addTo(this._map);}catch(_error){finish(false);}
      });
      if(ready&&this._weatherRadarPreviousValid()&&decision.old_fraction>=0.90
        &&next.__grRadarTileMetrics.failed>0){
        this._weatherEngineMonitorEvent?.("v1_partial_broad_layer_preserved",{
          correlation_id:state.v2CorrelationId||null,failed_tiles:next.__grRadarTileMetrics.failed});
        try{next.remove();}catch(_error){}
        return true;
      }
      if(!ready||!current()){
        this._weatherEngineMonitorEvent?.("v1_stage_rejected",{
          ready,stale:!current(),elapsed_ms:Math.round(performance.now()-stageStarted),
          tile_metrics:{...next.__grRadarTileMetrics}});
        try{next.remove();}catch(_error){}
        return false;
      }
    }
    // Commit the layer and source/timeline metadata as one coherent update.
    // Only now is it safe to remove the previous raster.
    if(next){
      next.setOpacity(this._weatherRadarEffectiveOpacity(next.__grRadarNaturalOpacity));
      state.layer=next;
      this._weatherEngineMonitorEvent?.("v1_layer_swapped",{
        from_api:state.v2Snapshot?2:state.lastReady?1:null,
        to_api:1,previous_provider:state.lastReady?.answer?.provenance?.provider_id||null,
        provider_id:answer.provenance?.provider_id||null,
        old_coverage_fraction:decision.old_fraction,
        new_coverage_fraction:decision.new_fraction,
        elapsed_ms:Math.round(performance.now()-stageStarted),
        tile_metrics:{...next.__grRadarTileMetrics},
        correlation_id:state.v2CorrelationId||null});
      if(previous)try{previous.remove();}catch(_error){}
    }
    this._weatherRadarClearRegionalHold();
    state.v2Snapshot=null;state.v2SnapshotAt=null;state.v2RenderMetrics=null;
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
    this._rasterLabRefreshOptions?.();
    this._weatherDisplayRefreshRenderedLayers?.();
    this._weatherDisplaySyncUi?.();
    this._weatherRadarUpdateControls();
    this._weatherRadarVisualAudit("v1_active");
    return true;
  },

  async _weatherRadarTryMosaic(viewport,token){
    const state=this._weatherRadarState();
    const correlationId="gr-p7-"+Date.now().toString(36)+"-"+String(token);
    state.v2CorrelationId=correlationId;
    const report=(phase,detail={})=>{
      const store=this._weatherEngineTraceStore?.();
      if(!store)return;
      store.v2Events??=[];
      store.v2Events.push({at:new Date().toISOString(),api_version:2,consumer_id:"gewitterradar",correlation_id:correlationId,phase,...detail});
      if(store.v2Events.length>80)store.v2Events.splice(0,store.v2Events.length-80);
    };
    if(!viewport.focus||typeof this._hass?.callWS!=="function"){
      report("skipped",{reason:!viewport.focus?"missing_focus":"websocket_unavailable"});
      return false;
    }
    report("started",{live_max_data_age_seconds:900,
      background_max_age_seconds:state.allowOlderSatelliteBackground?BACKGROUND_MAX_AGE_SECONDS:null,
      satellite_background_opt_in:state.allowOlderSatelliteBackground===true});
    const current=()=>state.enabled&&state.v2Generation===token
      &&this._weatherRadarViewport()?.signature===viewport.signature;
    let timeout=null,staged=null;
    try{
      const L=await loadLeafletJs();
      if(!current()){report("stale_before_request");return false;}
      const size=this._map.getSize?.()||{x:800,y:600};
      const count=Math.ceil(Math.max(256,size.x)/256+2)*Math.ceil(Math.max(256,size.y)/256+2);
      let painted;
      const firstPaint=new Promise(resolve=>{painted=resolve;});
      const readyTiles=new Set();
      const foundationTiles=new Set();
      const geometricallyCompleteTiles=new Set();
      let gridLoaded=false;
      const markReady=()=>{if(gridLoaded&&readyTiles.size>=minReadyTiles)painted(true);};
      // A single painted tile does not establish a usable replacement view.
      // At world zoom zero there can genuinely be only one tile.
      let minReadyTiles=(this._map.getZoom?.()??0)<1?1:2;
      const settledGeographicTiles=new Set();
      const expectedEmptyTiles=new Set();
      const expectedEligibleTiles=new Set();
      const result=await prepareRasterMosaicV2({
        callWS:query=>new Promise((resolve,reject)=>{
          // Finite client ceiling while WR may perform multiple bounded stages.
          const budgetMs=20000;
          const timer=setTimeout(()=>{
            const error=new Error("V2 client deadline exceeded");
            error.code="gr_v2_client_timeout";
            report("timeout",{elapsed_ms:budgetMs,error_code:error.code});
            reject(error);
          },budgetMs);
          report("callws_dispatched",{timeout_ms:budgetMs});
          Promise.resolve().then(()=>this._hass.callWS(query)).then(
            value=>{clearTimeout(timer);resolve(value);},
            error=>{clearTimeout(timer);reject(error);}
          );
        }),
        Leaflet:L,viewport:viewport.context,focus:viewport.focus,
        consumerId:"gewitterradar",correlationId,onDiagnostic:event=>report(event.phase,{status:event.status,error_code:event.error_code||null,layers:event.layers??null,time_deviating:event.time_deviating===true,source_ids:Array.isArray(event.source_ids)?event.source_ids:[],older_background_count:event.older_background_count??0,freshness_classes:Array.isArray(event.freshness_classes)?event.freshness_classes.slice(0,12):[],limitations_count:event.limitations_count??null,limitations:Array.isArray(event.limitations)?event.limitations.slice(0,8):[]}),
        maxLayers:12,maxTileRequests:clamp(count*4,48,256),
        maxDataAgeSeconds:900,
        maxBackgroundAgeSeconds:state.allowOlderSatelliteBackground?BACKGROUND_MAX_AGE_SECONDS:null,
        layerOptions:{maxConcurrent:4,
          onTileDiagnostics:item=>{
            if(this.__weatherEngineTraceStore?.displayExtended&&item?.rejected?.length)
               this._weatherEngineMonitorEvent?.("v2_tile_rejection",{
                 zoom:item.tile?.z??null,count:item.rejected.length,
                 correlation_id:correlationId,reason:item.rejected[0]?.reason||"unknown"});
             if(item?.rejected?.some(x=>x.reason==="request_budget_exhausted")&&
              state.layer===staged&&state.v2Snapshot===result?.response)
              this._weatherRadarScheduleBudgetRecovery(result.response);
            if(!item?.tile)return;
            const world=2**item.tile.z;
            const tileKey=[item.tile.z,((item.tile.x%world)+world)%world,item.tile.y].join("/");
            if(item.expected_fraction>0)expectedEligibleTiles.add(tileKey);
            if(item.tile_status==="expected_transparent"){
              expectedEmptyTiles.add(tileKey);settledGeographicTiles.add(tileKey);
              geometricallyCompleteTiles.add(tileKey);
              return;
            }
            if(item.tile_status!=="complete_verified_coverage")return;
            readyTiles.add(tileKey);settledGeographicTiles.add(tileKey);
            geometricallyCompleteTiles.add(tileKey);
            if(item.drawn.some(drawn=>result?.response?.layers?.some(source=>
              source.coverage_verified===true&&
              (source.coverage_scope==="global"||
                (source.coverage_scope==="bbox"&&
                 source.coverage?.west===-180&&source.coverage?.east===180&&
                 source.coverage?.south===-90&&source.coverage?.north===90))&&
              source.source_id===drawn.source_id)))foundationTiles.add(tileKey);
            markReady();
          }}
      });
      if(result.mode!=="v2"){report("fallback",{reason:result.reason,error_code:result.errorCode||null,response_status:result.responseStatus||null});return false;}
      if(!current()){report("stale_after_response");return false;}
      if(this._weatherRadarRetainRegionalMosaic(result,viewport,correlationId,report))return true;
      const footprint=measureRasterViewportCoverage(
        result.response.layers,viewport.context,this._map.getZoom?.()??0);
      report("viewport_coverage",{
        geographic_fraction:Number(footprint.fraction.toFixed(4)),
        geographic_complete:footprint.complete,covered_sources:footprint.covered_sources,
        coverage_type:"verified_envelopes_only"
      });
      if(footprint.fraction<=0){
        report("v2_no_geographic_overlap",{reason:"outside_coverage"});
        result.layer._p7AbortPending?.();
        return false;
      }
      if(!footprint.complete){
        minReadyTiles=1; // A small regional source can occupy only one visible tile.
        state.v2LastPartial={at:new Date().toISOString(),
          correlation_id:correlationId,status:result.response.status,
          layers:result.response.layers.map(l=>({source_id:l.source_id,
            coverage:l.coverage,freshness_class:l.freshness_class,
            valid_at:l.times?.valid_at||null,age_seconds:l.times?.age_seconds??null})),
          geographic_fraction:Number(footprint.fraction.toFixed(5))};
        report("v2_partial_available",{
          geographic_fraction:state.v2LastPartial.geographic_fraction,
          source_ids:state.v2LastPartial.layers.map(l=>l.source_id),
          reason:"verified_partial_display_candidate"});
      }
      // Never replace an existing broad and still valid raster with a narrow
      // partial snapshot; a later combined mosaic can supersede it.
      const previousCoverage=this._weatherRadarPreviousValid()
        ?weatherRadarActiveCoverage(state,viewport.context,this._map.getZoom?.()??0).fraction:0;
      if(previousCoverage>=0.90&&footprint.fraction<0.90){
        report("v2_partial_broad_layer_preserved",{
          old_coverage_fraction:previousCoverage,
          new_coverage_fraction:Number(footprint.fraction.toFixed(5))});
        result.layer._p7AbortPending?.();
        return false;
      }
      if(!this._map.getPane("gr-weather-radar")){
        const pane=this._map.createPane("gr-weather-radar");
        pane.style.zIndex="230";pane.style.pointerEvents="none";
      }
      staged=result.layer;
      staged.options.pane="gr-weather-radar";
      staged.options.opacity=0;
      staged.__grRadarNaturalOpacity=0.58;
      state.v2PendingLayer=staged;
      // Leaflet's load event means all currently required visible tiles have
      // settled; two successful tiles alone could expose an incomplete map.
      staged.on?.("load",()=>{gridLoaded=true;markReady();});
      staged.addTo(this._map);
      const ready=await Promise.race([firstPaint,
        new Promise(resolve=>{timeout=setTimeout(()=>resolve(false),6000);})]);
      if(!ready||!current()){this._weatherEngineMonitorEvent?.("v2_stage_rejected",{correlation_id:correlationId,reason:ready?"stale_during_render":"insufficient_painted_tiles",painted_tiles:readyTiles.size});report("fallback",{reason:ready?"stale_during_render":"insufficient_painted_tiles",painted_tiles:readyTiles.size});return false;}
      // A successful Leaflet load and two painted tiles are not a proof
      // that all currently visible grid tiles have usable raster content.
      const mapZoom=Math.round(this._map.getZoom?.()??-1);
      const zoom=Math.min(mapZoom,18);
      const mapBounds=this._map.getBounds?.();
      const nw=mapBounds&&this._map.project?.(mapBounds.getNorthWest(),zoom);
      const se=mapBounds&&this._map.project?.(mapBounds.getSouthEast(),zoom);
      const bounds=nw&&se?{min:nw,max:se}:null;
      const visible=new Set();
      if(bounds&&zoom>=0&&zoom<=18){
        const world=2**zoom;
        const minX=Math.floor(bounds.min.x/256),maxX=Math.floor((bounds.max.x-0.000001)/256);
        const minY=Math.floor(bounds.min.y/256),maxY=Math.floor((bounds.max.y-0.000001)/256);
        for(let y=minY;y<=maxY;y++){
          if(y<0||y>=world)continue;
          for(let x=minX;x<=maxX;x++)visible.add(zoom+"/"+(((x%world)+world)%world)+"/"+y);
        }
      }
      const uncovered=[...visible].filter(key=>!settledGeographicTiles.has(key));
      const visibleDrawn=[...visible].filter(key=>readyTiles.has(key));
      const visibleEmpty=[...visible].filter(key=>expectedEmptyTiles.has(key));
      const visibleEligible=[...visible].filter(key=>expectedEligibleTiles.has(key));
      const tolerableGaps=Math.min(2,Math.max(1,Math.floor(visibleEligible.length*0.1)));
      const gapsAccepted=uncovered.length>0&&visibleDrawn.length>0
        &&uncovered.length<=tolerableGaps&&
        visibleDrawn.length/Math.max(1,visibleEligible.length)>=0.8
        &&previousCoverage<0.90;
      report("staged_tiles_actual_coverage",{visible_tiles:visible.size,
        painted_tiles:readyTiles.size,foundation_tiles:foundationTiles.size,
        geometrically_complete_tiles:geometricallyCompleteTiles.size,
        coverage_type:"drawn_crop_geometry_not_nodata_pixels",
        uncovered_tiles:uncovered.length,expected_empty_tiles:visibleEmpty.length,
        eligible_tiles:visibleEligible.length,drawn_eligible_tiles:visibleDrawn.length,
        missing_eligible_tiles:uncovered.length,gaps_accepted:gapsAccepted});
      this._weatherEngineMonitorEvent?.("v2_draw_audit",{
        correlation_id:correlationId,zoom:Number(this._map?.getZoom?.()??0),
        visible_tiles:visible.size,drawn_tiles:readyTiles.size,
        complete_tiles:geometricallyCompleteTiles.size,uncovered_tiles:uncovered.length,
        expected_empty_tiles:visibleEmpty.length,eligible_tiles:visibleEligible.length,
        missing_eligible_tiles:uncovered.length,gaps_accepted:gapsAccepted,
        images_are_not_pixel_masks:true});
      if(!visible.size||!visibleDrawn.length||(uncovered.length&&!gapsAccepted)){
        report("v2_swap_prevented_uncovered_tiles",{visible_tiles:visible.size,
          uncovered_tiles:uncovered.length});
        report("v1_fallback_started",{reason:"uncovered_visible_tiles"});
        return false;
      }
      if(gapsAccepted)this._weatherEngineMonitorEvent?.("v2_partial_tile_errors_accepted",{
        correlation_id:correlationId,missing_eligible_tiles:uncovered.length,
        drawn_eligible_tiles:visibleDrawn.length,image_pixels_verified:false});
      if(previousCoverage>=0.90&&uncovered.length){
        report("v2_previous_broad_layer_preserved",{
          old_coverage_fraction:previousCoverage,missing_tiles:uncovered.length});
        return false;
      }
      report("raster_ready",{painted_tiles:visibleDrawn.length,
        partial_geography:!footprint.complete,missing_tiles:uncovered.length});
      const old=state.layer;
      const oldApi=state.v2Snapshot?2:state.lastReady?1:null;
      const oldHold=state.regionalHold;
      this._weatherRadarClearRegionalHold();
      state.layer=staged;state.v2PendingLayer=null;
      state.v2RenderMetrics={drawn_tiles:visibleDrawn.length,complete_tiles:geometricallyCompleteTiles.size,
        uncovered_tiles:uncovered.length,visible_tiles:visible.size,
        expected_empty_tiles:visibleEmpty.length,eligible_tiles:visibleEligible.length,
        partial_geography:!footprint.complete,
        geographic_fraction:Number(footprint.fraction.toFixed(5)),
        image_pixels_verified:false};
      state.v2Snapshot=result.response;state.v2SnapshotAt=Date.now();
      if(footprint.complete)state.v2LastPartial=null;
      state.lastReady=null;state.lastUnavailable=null;
      if(state.v2BudgetTimer)clearTimeout(state.v2BudgetTimer);
      state.v2BudgetTimer=null;state.v2BudgetPending=false;
      this._weatherRadarRemoveTimelinePlayer();
      state.timelineModel=null;state.timelineIndex=-1;
      this._weatherRadarClearPreload();
      report("active",{status:result.response?.status||"ready",layers:result.response?.layers?.length||0,
        painted_tiles:visibleDrawn.length,partial_geography:!footprint.complete,
        missing_tiles:uncovered.length,time_deviating:result.response?.layers?.some(layer=>layer.quality_note==="zeitlich_abweichend")===true,older_background_count:result.response?.layers?.filter(layer=>layer.freshness_class==="older_background").length||0});
      staged.setOpacity(this._weatherRadarEffectiveOpacity(0.58));
      this._weatherEngineMonitorEvent?.("v2_layer_swapped",{
        correlation_id:correlationId,source_ids:result.response.layers.map(l=>l.source_id),
        from_api:old?oldApi:null,to_api:2,visible_tiles:visible.size,
        retained_previous_replaced:Boolean(oldHold),
        render_order:result.response.layers.map(l=>({source_id:l.source_id,
          freshness_class:l.freshness_class||"current"})),
        pixels_verified:false,
        complete_tiles:geometricallyCompleteTiles.size,zoom:Number(this._map?.getZoom?.()??0)});
      if(old)try{old.remove();}catch(_){}
      this._weatherDisplayRefreshRenderedLayers?.();
      this._weatherRadarRenderCurrentLegend();
      this._rasterLabRefreshOptions?.();
      this._weatherRadarUpdateControls();
      this._weatherRadarVisualAudit("v2_active");
      return true;
    }catch(error){report("exception",{error_code:typeof error?.code==="string"?error.code:error?.name||"unknown"});return false;}
    finally{
      if(timeout!==null)clearTimeout(timeout);
      if(staged&&state.v2PendingLayer===staged){
        try{staged.remove();}catch(_){}
        state.v2PendingLayer=null;
      }
    }
  },

  _weatherRadarHandleUnavailable(answer){
    const state=this._weatherRadarState();
    state.lastUnavailable=answer?.unavailable||{code:"temporarily_unavailable"};
    // Retain previous raster only while its time AND coverage remain valid
    // for the present map view, even when WR returns 'unavailable'.
    if(this._weatherRadarCullOutsideViewport())return;
    this._weatherRadarUpdateControls();
  },

  async _refreshWeatherRadar({reason="manual",force=false}={}){
    const state=this._weatherRadarState();
    if(!state.enabled)return;
    if(!this._weatherRadarEnsureMapHooks()){this._scheduleWeatherRadarRefresh(reason,600);return;}
    const viewport=this._weatherRadarViewport();if(!viewport)return;
    // Geographic validity is independent of request throttling, in-flight
    // resolution, satellite consent and HTTP tile loading.
    this._weatherRadarCullOutsideViewport(viewport);
    const now=Date.now();
    this._weatherRadarRecoverExpiredRequest(now);
    // With no mounted raster, the historic four-minute stable-image
    // cooldown is inappropriate. Retry missing imagery at a bounded pace.
    const incomplete=Boolean(state.regionalHold||state.v2RenderMetrics?.partial_geography
      ||state.v2RenderMetrics?.uncovered_tiles
      ||state.layer?.__grRadarTileMetrics?.failed);
    const minWait=!state.layer||incomplete
      ?Math.max(15000,state.viewportRefreshIntervalSeconds*1000)
      :state.lastViewport===viewport.signature?SAME_VIEW_MIN_MS:state.viewportRefreshIntervalSeconds*1000;
    if(!force&&state.lastRequestAt&&now-state.lastRequestAt<minWait){
      this._weatherEngineMonitorEvent?.("refresh_deferred",{
        reason,wait_ms:Math.round(minWait-(now-state.lastRequestAt)),
        zoom:Number(this._map?.getZoom?.()??0)});
      this._scheduleWeatherRadarRefresh(reason,minWait-(now-state.lastRequestAt)+50);
      return;
    }
    if(state.inFlight){state.pending=true;state.pendingForce=state.pendingForce||force;return;}
    const token=++state.v2Generation;
    state.inFlight=true;state.inFlightToken=token;state.inFlightStartedAt=now;
    state.pending=false;state.lastRequestAt=now;state.lastViewport=viewport.signature;
    this._weatherEngineMonitorEvent?.("refresh_started",{
      reason,zoom:Number(this._map?.getZoom?.()??0),viewport:viewport.signature,
      older_background_opt_in:state.allowOlderSatelliteBackground,interval_s:state.viewportRefreshIntervalSeconds});
    this._weatherRadarUpdateControls("Niederschlag wird aktualisiert …");
    try{
      const discovery=await this._weatherRouterDiscovery();
      if(state.v2Generation!==token||this._weatherRadarViewport()?.signature!==viewport.signature){
        if(state.inFlightToken===token)state.pending=true;
        return;
      }
      if(!discovery?.ready){this._weatherRadarHandleUnavailable({unavailable:{code:discovery?.compatible?"router_not_ready":"capability_not_supported"}});return;}
      const v2Started=performance.now();
      const v2Used=await this._weatherRadarTryMosaic(viewport,token);
      this._weatherEngineMonitorEvent?.("v2_attempt_completed",{
        correlation_id:state.v2CorrelationId||null,
        elapsed_ms:Math.round(performance.now()-v2Started),active:v2Used});
      if(v2Used)return;
      if(state.v2Generation!==token||this._weatherRadarViewport()?.signature!==viewport.signature){state.pending=true;return;}
      const catalog=await this._weatherRouterCapabilities({filter:{domains:["weather"],resource_types:["raster_tile"],available_only:true}});
      const capability=catalog?.status==="ready"?catalog.capabilities.find(item=>item.id===CAPABILITY&&item.enabled&&item.available):null;
      if(!capability){this._weatherRadarHandleUnavailable({unavailable:{code:"capability_not_supported"}});return;}
      const contexts=Array.isArray(capability.spatial_contexts)?capability.spatial_contexts:[];
      const context=contexts.includes("bbox")?viewport.context:contexts.includes("global")?{type:"global"}:null;
      if(!context){this._weatherRadarHandleUnavailable({unavailable:{code:"requirements_not_met"}});return;}
      const v1Started=performance.now();
      this._weatherEngineMonitorEvent?.("v1_fallback_started",{
        correlation_id:state.v2CorrelationId||null,
        zoom:Number(this._map?.getZoom?.()??0)});
      const answer=await this._weatherRouterResolve(CAPABILITY,context,{requirements:{resource_types:["raster_tile"]},consumerId:"gewitterradar",correlationId:state.v2CorrelationId||null});
      this._weatherEngineMonitorEvent?.("v1_answer",{
        correlation_id:state.v2CorrelationId||null,
        elapsed_ms:Math.round(performance.now()-v1Started),status:answer.status,
        provider_id:answer.provenance?.provider_id||null,age_seconds:answer.freshness?.age_seconds??null});
      if(state.v2Generation!==token||this._weatherRadarViewport()?.signature!==viewport.signature){state.pending=true;return;}
      if(answer.status!=="ready"){this._weatherRadarHandleUnavailable(answer);return;}
      const applied=await this._weatherRadarApplyReady(answer,viewport,token);
      if(!applied&&state.v2Generation===token&&state.enabled){
        this._weatherRadarHandleUnavailable({unavailable:{code:"replacement_not_ready"}});
      }
    }catch(_error){
      if(state.v2Generation===token){
        state.lastUnavailable={code:"temporarily_unavailable"};
        this._weatherRadarUpdateControls();
      }
    }finally{
      // An expired pre-suspension request must never reset the lock of the
      // replacement request started after foreground recovery.
      if(state.inFlightToken===token){
        state.inFlight=false;state.inFlightToken=null;state.inFlightStartedAt=0;
        if(state.pending){
          const forcePending=state.pendingForce;state.pending=false;state.pendingForce=false;
          this._scheduleWeatherRadarRefresh("pending",250,{force:forcePending});
        }else if(state.enabled&&!state.layer&&this.isConnected!==false&&
          (typeof document==="undefined"||document.visibilityState!=="hidden")){
          // An unavailable first image must not stay blank until the next
          // five-minute timer. One coalesced retry, no concurrent WS calls.
          const delay=Math.max(15000,state.viewportRefreshIntervalSeconds*1000);
          this._weatherEngineMonitorEvent?.("missing_raster_retry_scheduled",{delay_ms:delay});
          this._scheduleWeatherRadarRefresh("missing-raster-retry",delay);
        }
      }
    }
  },

  _weatherRadarUpdateControls(message=null){
    const state=this._weatherRadarState();
    const toggle=this.shadow?.getElementById("weather-radar-toggle");
    const satelliteToggle=this.shadow?.getElementById("weather-radar-background-toggle");
    if(satelliteToggle){satelliteToggle.setAttribute("aria-pressed",state.allowOlderSatelliteBackground?"true":"false");satelliteToggle.textContent=state.allowOlderSatelliteBackground?"Ein · bis 12 Std.":"Aus · nur aktuelle Daten";}
    const status=this.shadow?.getElementById("weather-radar-status");
    const activeApi=this.shadow?.getElementById("weather-engine-active-api");
    if(activeApi){
      const active=state.enabled&&Boolean(state.layer);
      const kind=active?(state.v2Snapshot?"v2":"v1"):"none";
      activeApi.dataset.activeApi=kind;
      activeApi.textContent=!state.enabled?"Niederschlag: ausgeschaltet"
        :!active?"Niederschlag: wartet auf Darstellung"
        :kind==="v2"?"Niederschlag: API V2 · "+state.v2Snapshot.layers.length+" Mosaikquellen"
        :"Niederschlag: API V1 · "+this._weatherRadarDescribe(state.lastReady?.answer).provider;
    }
    const timelineStatus=this.shadow?.getElementById("weather-radar-timeline-status");
    const timelineToggle=this.shadow?.getElementById("weather-radar-timeline-toggle");
    if(toggle){
      toggle.setAttribute("aria-pressed",state.enabled?"true":"false");
      toggle.textContent=state.enabled?"Ein":"Aus";
      toggle.dataset.active=state.enabled?"1":"0";
    }
    if(timelineToggle){timelineToggle.setAttribute("aria-pressed",state.timelineVisible?"true":"false");timelineToggle.textContent=state.timelineVisible?"Ein":"Aus";timelineToggle.dataset.active=state.timelineVisible?"1":"0";}
    if(timelineStatus){
      const frames=state.timelineModel?.frames?.length||0;
      timelineStatus.textContent=!state.timelineVisible
        ?"Aus · Zeitachse bleibt ausgeblendet"
        :!state.enabled
          ?"Ein · erscheint, sobald Niederschlag und eine Zeitreihe aktiv sind"
          :frames>1
            ?"Ein · "+frames+" Niederschlagszeitpunkte · Vergangenheit, Jetzt und Vorhersage"
            :"Ein · aktive Quelle liefert derzeit keine mehrteilige Niederschlags-Zeitreihe";
    }
    if(!status)return;
    if(message){status.textContent=message;return;}
    if(!state.enabled){status.textContent="Aus · keine zusätzlichen Niederschlags-Anfragen";return;}
    if(state.v2Snapshot){
      if(state.regionalHold){
        const remaining=Math.max(0,Math.ceil((state.regionalHold.deadlineAt-Date.now())/1000));
        status.textContent="Aktiv · bisherige gültige Radar-/Satelliten-Ebene vorübergehend beibehalten · "
          +"erneute Quellenprüfung · maximal "+remaining+" s · UTC-Alter wird überwacht";
        return;
      }
      status.textContent="Aktiv · WeatherRouter V2 · "+state.v2Snapshot.layers.length+
        " räumlich abgegrenzte Quellen"+
        (state.v2RenderMetrics?.partial_geography
          ?" · TEILWEISE · "+Math.round((state.v2RenderMetrics.geographic_fraction||0)*100)+" % geografisch"
          :" · geprüfte Sichtfeldgeometrie")+
        (state.v2RenderMetrics?.uncovered_tiles?" · "+state.v2RenderMetrics.uncovered_tiles+" Kachelfehler":"")+
        (state.v2Snapshot.layers.some(layer=>layer.freshness_class==="older_background")?" · ältere Satellitenschätzung, kein aktuelles Radar":"");
      return;
    }
    if(state.lastReady){
      const d=this._weatherRadarDescribe(state.lastReady.answer);
      const frames=state.timelineModel?.frames?.length||0;
      status.textContent="Aktiv · API V1 · "+d.provider+" · "+d.ageText+(frames>1?" · "+frames+" Niederschlagszeitpunkte":"")+" · Abdeckung: "+d.coverage+
        (state.layer?.__grRadarTileMetrics?.failed?" · TEILWEISE · "+state.layer.__grRadarTileMetrics.failed+" Kachelfehler":"")+
        (state.lastReady.answer.routing?.degraded?" · eingeschränkt":"");
      return;
    }
    const code=state.lastUnavailable?.code;
    const label={
      outside_coverage:"Für diesen Kartenausschnitt keine Niederschlags-Abdeckung",
      source_stale:"Niederschlagsquelle derzeit zu alt",
      router_not_ready:"WeatherRouter nicht betriebsbereit",
      router_disabled:"WeatherRouter deaktiviert",
      no_eligible_provider:"Keine geeignete Niederschlagsquelle verfügbar",
      requirements_not_met:"Niederschlagsquelle erfüllt die Anforderungen nicht",
      capability_not_supported:"Niederschlags-Layer derzeit nicht verfügbar"
    }[code];
    status.textContent=label||"Aktiv · wartet auf Niederschlagsdaten";
  },

  _mountWeatherRadarSettings(){
    const section=this.shadow?.getElementById("weather-engine-section");
    const content=section?.querySelector(".settings-section-content");
    if(!content||content.querySelector('[data-weather-radar-settings="true"]'))return;
    const block=document.createElement("div");block.dataset.weatherRadarSettings="true";
    const row=document.createElement("div");row.className="settings-row";
    const label=document.createElement("div");label.className="settings-row-label";
    const title=document.createElement("div");title.textContent="Niederschlag · Kartenebene";
    const hint=document.createElement("div");hint.textContent="WeatherRouter wählt die geeignete Quelle. Blitzortung bleibt unabhängig aktiv.";hint.style.cssText="font-size:.76rem;opacity:.68;margin-top:3px";
    label.append(title,hint);
    const toggle=document.createElement("button");toggle.className="settings-language-button settings-control";toggle.id="weather-radar-toggle";toggle.type="button";
    toggle.addEventListener("click",()=>this._setWeatherRadarEnabled(!this._weatherRadarState().enabled));
    row.append(label,toggle);
    const backgroundRow=document.createElement("div");
    backgroundRow.className="settings-row";
    const backgroundLabel=document.createElement("div");
    backgroundLabel.className="settings-row-label";
    const backgroundTitle=document.createElement("div");
    backgroundTitle.textContent="Ältere globale Satellitenschätzungen zulassen";
    const backgroundHint=document.createElement("div");
    backgroundHint.textContent="Freiwillig: bis 12 Stunden alte globale Satellitenschätzungen als eingeschränkte Grundversorgung. Kein aktuelles Radar. Regionale Radardaten bleiben auf 15 Minuten begrenzt.";
    backgroundHint.style.cssText="font-size:.76rem;opacity:.75;margin-top:3px";
    backgroundLabel.append(backgroundTitle,backgroundHint);
    const backgroundToggle=document.createElement("button");
    backgroundToggle.id="weather-radar-background-toggle";
    backgroundToggle.type="button";
    backgroundToggle.className="settings-language-button settings-control";
    backgroundToggle.addEventListener("click",()=>this._setWeatherRadarOlderSatelliteBackground(!this._weatherRadarState().allowOlderSatelliteBackground));
    backgroundRow.append(backgroundLabel,backgroundToggle);

    const preloadRow=document.createElement("div");preloadRow.className="settings-row";
    const preloadLabel=document.createElement("div");preloadLabel.className="settings-row-label";
    const preloadTitle=document.createElement("div");preloadTitle.textContent="Niederschlags-Vorladebereich";
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
    const customControls=document.createElement("div");customControls.className="gr-weather-range-controls";customControls.style.cssText="display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-end";
    const customRange=document.createElement("input");customRange.type="range";customRange.min="0";customRange.max="100";customRange.step="5";customRange.id="weather-radar-preload-custom-range";customRange.setAttribute("aria-label","Benutzerdefinierter Niederschlags-Kartenrand in Prozent je Seite");
    const customNumber=document.createElement("input");customNumber.type="number";customNumber.min="0";customNumber.max="100";customNumber.step="5";customNumber.id="weather-radar-preload-custom-number";customNumber.className="settings-control";customNumber.style.cssText="width:78px";
    const percent=document.createElement("span");percent.textContent="% je Seite";percent.style.cssText="font-size:.78rem;opacity:.72";
    const syncCustom=value=>{this._setWeatherRadarPreloadCustomPercent(value);};
    customRange.addEventListener("input",()=>{customNumber.value=customRange.value;});
    customRange.addEventListener("change",()=>syncCustom(customRange.value));
    customNumber.addEventListener("change",()=>syncCustom(customNumber.value));
    customControls.append(customRange,customNumber,percent);customRow.append(customLabel,customControls);

    const preloadStatusRow=document.createElement("div");preloadStatusRow.className="settings-row gr-weather-detail-status";
    const preloadStatus=document.createElement("div");preloadStatus.className="settings-row-label";preloadStatus.id="weather-radar-preload-status";preloadStatus.setAttribute("role","status");preloadStatus.setAttribute("aria-live","polite");
    preloadStatusRow.append(preloadStatus);

    const refreshIntervalRow=document.createElement("div");refreshIntervalRow.className="settings-row";
    const refreshIntervalLabel=document.createElement("div");refreshIntervalLabel.className="settings-row-label";
    const refreshIntervalTitle=document.createElement("div");refreshIntervalTitle.textContent="Aktualisierungsintervall – Wetterinformationen";
    const refreshIntervalHint=document.createElement("div");refreshIntervalHint.textContent="Legt fest, wie schnell WeatherRouter nach einer Kartenbewegung neue Wetterinformationen anfordern darf. Kürzer reagiert schneller, erzeugt aber mehr Anfragen.";refreshIntervalHint.style.cssText="font-size:.76rem;opacity:.68;margin-top:3px";
    const refreshIntervalStatus=document.createElement("div");refreshIntervalStatus.id="weather-radar-refresh-interval-status";refreshIntervalStatus.style.cssText="font-size:.76rem;opacity:.82;margin-top:5px";
    refreshIntervalLabel.append(refreshIntervalTitle,refreshIntervalHint,refreshIntervalStatus);
    const refreshIntervalControls=document.createElement("div");refreshIntervalControls.className="gr-weather-range-controls";refreshIntervalControls.style.cssText="display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-end";
    const refreshIntervalRange=document.createElement("input");refreshIntervalRange.type="range";refreshIntervalRange.min=String(VIEWPORT_REFRESH_INTERVAL_MIN_SECONDS);refreshIntervalRange.max=String(VIEWPORT_REFRESH_INTERVAL_MAX_SECONDS);refreshIntervalRange.step="1";refreshIntervalRange.id="weather-radar-refresh-interval-range";refreshIntervalRange.setAttribute("aria-label","Aktualisierungsintervall Wetterinformationen in Sekunden");
    const refreshIntervalNumber=document.createElement("input");refreshIntervalNumber.type="number";refreshIntervalNumber.min=String(VIEWPORT_REFRESH_INTERVAL_MIN_SECONDS);refreshIntervalNumber.max=String(VIEWPORT_REFRESH_INTERVAL_MAX_SECONDS);refreshIntervalNumber.step="1";refreshIntervalNumber.id="weather-radar-refresh-interval-number";refreshIntervalNumber.className="settings-control";refreshIntervalNumber.style.cssText="width:72px";
    const refreshIntervalUnit=document.createElement("span");refreshIntervalUnit.textContent="Sek.";refreshIntervalUnit.style.cssText="font-size:.78rem;opacity:.72";
    refreshIntervalRange.addEventListener("input",()=>{refreshIntervalNumber.value=refreshIntervalRange.value;refreshIntervalStatus.textContent=refreshIntervalRange.value+" Sek.";});
    refreshIntervalRange.addEventListener("change",()=>this._setWeatherRadarViewportRefreshInterval(refreshIntervalRange.value));
    refreshIntervalNumber.addEventListener("change",()=>this._setWeatherRadarViewportRefreshInterval(refreshIntervalNumber.value));
    refreshIntervalControls.append(refreshIntervalRange,refreshIntervalNumber,refreshIntervalUnit);refreshIntervalRow.append(refreshIntervalLabel,refreshIntervalControls);

    const timelineRow=document.createElement("div");timelineRow.className="settings-row";
    const timelineLabel=document.createElement("div");timelineLabel.className="settings-row-label";
    const timelineTitle=document.createElement("div");timelineTitle.textContent="Niederschlags-Zeitverlauf";
    const timelineHint=document.createElement("div");timelineHint.textContent="Ein-/ausblendbar, zusätzlich im WeatherRouter-Menü schaltbar und direkt auf der Karte verschiebbar.";timelineHint.style.cssText="font-size:.76rem;opacity:.68;margin-top:3px";
    const timelineStatus=document.createElement("div");timelineStatus.id="weather-radar-timeline-status";timelineStatus.setAttribute("role","status");timelineStatus.setAttribute("aria-live","polite");timelineStatus.style.cssText="font-size:.76rem;opacity:.82;margin-top:5px";
    const timelineToggle=document.createElement("button");timelineToggle.className="settings-language-button settings-control";timelineToggle.id="weather-radar-timeline-toggle";timelineToggle.type="button";timelineToggle.addEventListener("click",()=>this._setWeatherRadarTimelineVisible(!this._weatherRadarState().timelineVisible));
    timelineLabel.append(timelineTitle,timelineHint,timelineStatus);timelineRow.append(timelineLabel,timelineToggle);

    const statusRow=document.createElement("div");statusRow.className="settings-row gr-weather-detail-status";
    const status=document.createElement("div");status.className="settings-row-label";status.id="weather-radar-status";status.setAttribute("role","status");status.setAttribute("aria-live","polite");
    statusRow.append(status);block.append(row,backgroundRow,preloadRow,customRow,preloadStatusRow,refreshIntervalRow,timelineRow,statusRow);
    const dataRow=this.shadow?.getElementById("weather-engine-inspect")?.closest(".settings-row");
    if(dataRow?.parentNode===content)content.insertBefore(block,dataRow);else content.append(block);
    this._weatherRadarUpdateControls();
    this._weatherRadarUpdatePreloadControls();
    this._weatherRadarUpdateRefreshIntervalControls();
    this._weatherRadarEnsureMapHooks();
    if(this._weatherRadarState().enabled)this._setWeatherRadarEnabled(true,{persist:false});
  },

  _resumeWeatherRadar(){
    const state=this._weatherRadarState();
    this._weatherRadarAttachAppEvents();
    this._weatherRadarEnsureMapHooks();
    if(state.enabled){
      if(!state.refreshTimer)state.refreshTimer=setInterval(()=>this._scheduleWeatherRadarRefresh("timer",0),REFRESH_MS);
      this._scheduleWeatherRadarRefresh("resume",1200,{force:true});
      this._scheduleWeatherRadarPreload("resume",1500);
    }
  },

  _teardownWeatherRadar(){
    const state=this._weatherRadarState();
    this._weatherRadarClearRegionalHold();
    this._weatherRadarDetachAppEvents();
    if(state.debounceTimer)clearTimeout(state.debounceTimer);
    if(state.mapWaitTimer)clearTimeout(state.mapWaitTimer);
    if(state.refreshTimer)clearInterval(state.refreshTimer);
    if(state.preloadTimer)clearTimeout(state.preloadTimer);
    if(state.timelineTimer)clearTimeout(state.timelineTimer);
    if(state.timelineResizeObserver){try{state.timelineResizeObserver.disconnect();}catch(_error){}state.timelineResizeObserver=null;}
    state.debounceTimer=state.mapWaitTimer=state.refreshTimer=state.preloadTimer=state.timelineTimer=null;
    state.timelinePlaying=false;
    state.v2Generation++;
    state.v1PendingCancel?.();
    if(state.v2PendingLayer){try{state.v2PendingLayer.remove();}catch(_){}state.v2PendingLayer=null;}
    this._weatherRadarClearTimelineStage();
    this.shadow?.querySelector('[data-weather-radar-player="true"]')?.remove();
    state.preloadGeneration+=1;state.preloadQueue=[];state.preloadCache.clear();
    if(state.map)try{if(state.onMove)state.map.off("moveend",state.onMove);if(state.onZoom)state.map.off("zoomend",state.onZoom);}catch(_error){}
    state.map=null;state.onMove=null;state.onZoom=null;
    state.inFlight=false;state.inFlightToken=null;state.inFlightStartedAt=0;
    state.pending=false;state.pendingForce=false;
  }
});});
