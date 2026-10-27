import {buildRasterMosaicV2Request} from './p7-010/raster-mosaic-consumer.js?v=41191r1';
import {validateRasterMosaicV2} from './p7-010/raster-mosaic-contract.js?v=41191r1';
import { defineModule } from '../core/runtime.js?v=41109r1';
export const MODULE_META=Object.freeze({id:'weather.consumer-client',version:'1.2.14',group:'Weather-Engine',function:'WeatherRouter Consumer V1/V2',subfunctions:['Discovery','Capability-Katalog','Resolve','Quellenstatus','Diagnose-Trace','Weather Engine Diagnose'],file:'modules/weather/consumer-client.js'});
/* WeatherRouter Consumer V1 – independent, read-only adapter.
 * No provider binding, no internal WeatherRouter import, no implicit HA/home location.
 * WeatherRouter is optional; this client never touches the existing Blitzortung pipeline.
 */
export const WEATHER_ROUTER_LOGO_IMAGE = new URL('../../assets/weather-router-emblem-v004-256.png', import.meta.url).href;
export const WEATHER_ROUTER_CONTRACT=1;
export const WEATHER_ROUTER_CAPABILITIES=Object.freeze({
  lightningEvents:'weather.lightning.observed.events',
  lightningDensity:'weather.lightning.observed.density',
  precipitation:'weather.precipitation.layer',
  warnings:'weather.warning.official'
});
export const WEATHER_ROUTER_RESOURCE_TYPES=Object.freeze([
  'value','raster_tile','hazard_feed','event_feed','image_sequence',
  'live_stream','planetary_tile','data_file'
]);
const validId=id=>typeof id==='string'&&/^[a-z][a-z0-9_]*(?:\.[a-z0-9_]+)+$/.test(id);
const numberBetween=(n,min,max)=>typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max;
const absent=(code,message,retryable=false)=>({status:'unavailable',unavailable:{code,message,retryable}});
const discoveryFailure=error=>{
  const code=String(error?.code??error?.error?.code??error?.data?.code??'').trim().toLowerCase();
  const message=String(error?.message??error??'').trim().toLowerCase();
  const missing=code==='unknown_command'||code==='not_found'||message.includes('unknown_command')||message.includes('unknown command')||message.includes('command not found');
  if(missing)return {present:false,compatible:false,ready:false,router:null,domains:[],reason:'integration_not_installed',error_code:code||'unknown_command'};
  return {present:true,compatible:true,ready:false,router:null,domains:[],reason:'discovery_unreachable',error_code:code||'transport_error'};
};
export function validateWeatherContext(context){
  if(!context||typeof context!=='object')throw new TypeError('Explicit spatial context required');
  if(context.type==='global'&&Object.keys(context).length===1)return {...context};
  if(context.type==='point'&&Object.keys(context).length===3&&numberBetween(context.latitude,-90,90)&&numberBetween(context.longitude,-180,180))return {...context};
  if(context.type==='bbox'&&Object.keys(context).length===5&&numberBetween(context.west,-180,180)&&numberBetween(context.east,-180,180)&&numberBetween(context.south,-90,90)&&numberBetween(context.north,-90,90)&&context.south<=context.north)return {...context};
  throw new TypeError('Invalid WeatherRouter spatial context');
}
export function parseWeatherResolution(response,capability){
  if(!response||response.schema!=='weather_router.consumer.resolution.v1'||response.contract_version!==1||response.capability!==capability)throw new TypeError('Invalid Consumer V1 resolution');
  if(response.status==='unavailable'&&response.unavailable&&typeof response.unavailable.code==='string')return {status:'unavailable',capability,unavailable:{...response.unavailable}};
  if(response.status!=='ready'||!response.resource||!WEATHER_ROUTER_RESOURCE_TYPES.includes(response.resource.type)||!response.resource.payload||typeof response.resource.payload!=='object'||!response.provenance||!response.routing)throw new TypeError('Invalid Consumer V1 ready resource');
  const {type,payload,semantics}=response.resource;
  if(type==='event_feed'&&(!Array.isArray(payload.events)||!Number.isInteger(payload.event_count)))throw new TypeError('Invalid event feed');
  if(type==='hazard_feed'&&!Array.isArray(payload.events))throw new TypeError('Invalid hazard feed');
  if(type==='raster_tile'&&(!payload.tile_url||!numberBetween(payload.tile_size,1,Number.MAX_SAFE_INTEGER)||!numberBetween(payload.max_zoom,0,Number.MAX_SAFE_INTEGER)))throw new TypeError('Invalid raster tile descriptor');
  if(type==='value'&&(!payload.values||typeof payload.values!=='object'))throw new TypeError('Invalid value payload');
  if(type==='image_sequence'&&(!Array.isArray(payload.frames)||typeof payload.georeferenced!=='boolean'))throw new TypeError('Invalid image sequence');

  if(capability===WEATHER_ROUTER_CAPABILITIES.precipitation){
    const intent=response.intent_contract;
    const requiredSemantics=['data_origin','measurement_method','observation_kind','quantity','unit'];
    if(type!=='raster_tile'||!intent||intent.kind!=='visual_layer'||intent.resource_type!=='raster_tile'||intent.render_interchangeable!==true||intent.numeric_interchangeable!==false)throw new TypeError('Invalid precipitation visual-layer intent contract');
    if(!semantics||typeof semantics!=='object'||requiredSemantics.some(key=>!Object.hasOwn(semantics,key)))throw new TypeError('Incomplete precipitation candidate semantics');
    if(!payload.legend||typeof payload.legend!=='object'||typeof payload.legend.url!=='string'||!payload.legend.url)throw new TypeError('Precipitation layer requires a legend');
    if(typeof payload.attribution!=='string'||!payload.attribution.trim())throw new TypeError('Precipitation layer requires attribution');
  }

  return {status:'ready',capability,resource:response.resource,provenance:response.provenance,freshness:response.freshness??null,routing:response.routing,profile:response.profile??null,intent_contract:response.intent_contract??null};
}
export function createWeatherRouterClient(callWS,{profileId=null}={}){
  if(typeof callWS!=='function')throw new TypeError('Home Assistant callWS function required');
  let discovery=null,catalogCache=new Map(),profile=profileId;
  let inFlightDiscovery=null;
  async function discover({refresh=false}={}){
    if(discovery&&!refresh)return discovery;
    if(inFlightDiscovery)return inFlightDiscovery;
    inFlightDiscovery=(async()=>{
      try{
        const answer=await callWS({type:'weather_router/consumer/discovery'});
        if(answer?.schema!=='weather_router.consumer.discovery.v1'||answer.contract?.name!=='weather_router.consumer')throw new TypeError('Invalid discovery response');
        const compatible=Array.isArray(answer.contract.supported_versions)&&answer.contract.supported_versions.includes(WEATHER_ROUTER_CONTRACT);
        discovery={present:true,compatible,ready:compatible&&answer.router?.ready===true&&answer.router?.enabled===true,router:answer.router??null,domains:answer.domains??[]};
        return discovery;
      }catch(error){
        // A missing optional integration never breaks Gewitterradar.
        discovery=discoveryFailure(error);
        return discovery;
      }finally{inFlightDiscovery=null;}
    })();
    return inFlightDiscovery;
  }
  async function capabilities({refresh=false,filter={domains:['weather']}}={}){
    const state=await discover({refresh});
    if(!state.ready)return absent(state.compatible?'router_not_ready':'capability_not_supported','WeatherRouter not ready');
    const catalogKey=JSON.stringify(filter||{});
    if(!refresh&&catalogCache.has(catalogKey))return catalogCache.get(catalogKey);
    const query={type:'weather_router/consumer/capabilities',contract_version:WEATHER_ROUTER_CONTRACT,filter};
    if(profile)query.profile_id=profile;
    try{
      const response=await callWS(query);
      if(response?.schema!=='weather_router.consumer.capabilities.v1'||response.contract_version!==1||!Array.isArray(response.capabilities))throw new TypeError('Invalid capability response');
      const catalog={status:'ready',capabilities:response.capabilities,generated_at:response.generated_at??null};
      catalogCache.set(catalogKey,catalog);
      return catalog;
    }catch(error){return absent('temporarily_unavailable','Capability discovery failed',true);}
  }
  async function resolve(capability,context,{requirements,eventFilter,consumerId='gewitterradar',correlationId=null,time=null}={}){
    if(!validId(capability))throw new TypeError('Invalid public capability');
    const spatial=validateWeatherContext(context);
    const state=await discover();
    if(!state.ready)return absent(state.compatible?'router_not_ready':'capability_not_supported','WeatherRouter not ready');
    const request={type:'weather_router/consumer/resolve',contract_version:WEATHER_ROUTER_CONTRACT,capability,context:spatial,time:time||{mode:'latest'}};
    if(profile)request.profile_id=profile;
    request.consumer_id=consumerId;
    if(correlationId)request.correlation_id=correlationId;
    if(requirements!==undefined)request.requirements=requirements;
    if(eventFilter!==undefined)request.event_filter=eventFilter;
    try{return parseWeatherResolution(await callWS(request),capability);}
    catch(error){return absent('temporarily_unavailable','WeatherRouter request or response failed',true);}
  }
  async function resolveEventWindow(capability,context,{
    start,end,includeOngoing=false,maxFeedUpdateAgeSeconds=null,
    page=1,pageSize=100,consumerId='gewitterradar',correlationId=null
  }={}){
    if(!validId(capability))throw new TypeError('Invalid event capability');
    const catalog=await capabilities({filter:{resource_types:['event_feed','hazard_feed'],available_only:true}});
    if(catalog.status!=='ready')return catalog;
    const item=catalog.capabilities.find(row=>row.id===capability&&row.enabled&&row.available);
    const policy=item?.event_time_options;
    if(!item||!Array.isArray(item.time_modes)||!item.time_modes.includes('events_intersecting_window')
      ||!policy||policy.mode!=='events_intersecting_window'
      ||!Array.isArray(item.resource_types)||item.resource_types.length!==1
      ||!['event_feed','hazard_feed'].includes(item.resource_types[0]))
      return absent('capability_not_supported','Event time window not advertised');
    const instant=value=>typeof value==='string'&&/[zZ]$|[+-]\d\d:\d\d$/.test(value)&&Number.isFinite(Date.parse(value));
    if(!instant(start)||!instant(end)||Date.parse(start)>Date.parse(end)
      ||Date.parse(end)>Date.now()+300000
      ||!Number.isFinite(policy.max_window_days)
      ||Date.parse(end)-Date.parse(start)>policy.max_window_days*86400000
      ||typeof includeOngoing!=='boolean'
      ||!Number.isInteger(page)||page<1||page>Math.min(5,policy.max_pages||5)
      ||!Number.isInteger(pageSize)||pageSize<1||pageSize>Math.min(200,policy.max_results||200)
      ||(maxFeedUpdateAgeSeconds!==null&&
          (!Number.isInteger(maxFeedUpdateAgeSeconds)||maxFeedUpdateAgeSeconds<60
          ||maxFeedUpdateAgeSeconds>policy.max_feed_update_age_seconds)))
      throw new TypeError('Invalid bounded UTC event window');
    const time={
      mode:'events_intersecting_window',
      window:{start:new Date(Date.parse(start)).toISOString(),end:new Date(Date.parse(end)).toISOString()},
      include_ongoing:includeOngoing,page,page_size:pageSize,
      ...(maxFeedUpdateAgeSeconds===null?{}:{max_feed_update_age_seconds:maxFeedUpdateAgeSeconds})
    };
    const answer=await resolve(capability,context,{consumerId,correlationId,time});
    if(answer?.status==='ready'){
      const payload=answer.resource?.payload;
      const metadata=payload?.event_time_policy;
      if(!Array.isArray(payload?.events)||!metadata
        ||!['fresh','stale','future','unknown'].includes(metadata.feed_status)
        ||!Number.isInteger(metadata.page)||metadata.page!==page
        ||!Number.isInteger(metadata.page_size)||metadata.page_size!==pageSize
        ||typeof metadata.has_more!=='boolean'
        ||payload.events.length>pageSize
        ||payload.events.some(event=>typeof event.temporal_status!=='string'))
        return absent('consumer_contract_invalid','Invalid event time response');
    }
    return answer;
  }
  function reset(){discovery=null;catalogCache.clear();}
  return Object.freeze({discover,capabilities,resolve,resolveEventWindow,reset,get discovery(){return discovery;},get profileId(){return profile;}});
}

const SENSITIVE_QUERY=/([?&](?:api[_-]?key|apikey|access[_-]?token|token|key|appid|password|secret)=)[^&#\s]+/gi;
const AUTH=/(authorization\s*[:=]\s*(?:bearer\s+)?)[^\s,;]+/gi;
const USERINFO=/(https?:\/\/[^:/@\s]+:)[^@/\s]+@/gi;
const redactString=value=>String(value).replace(SENSITIVE_QUERY,'$1<redacted>').replace(AUTH,'$1<redacted>').replace(USERINFO,'$1<redacted>@');
const sanitize=value=>{
  if(typeof value==='string')return redactString(value);
  if(value==null||typeof value==='number'||typeof value==='boolean')return value;
  if(Array.isArray(value))return value.map(sanitize);
  if(typeof value==='object'){
    const out={};
    for(const [key,item] of Object.entries(value)){
      if(/^(authorization|cookie|password|secret|token|api[_-]?key|access[_-]?token)$/i.test(key))out[key]='<redacted>';
      else out[key]=sanitize(item);
    }
    return out;
  }
  return redactString(value);
};
const pretty=value=>JSON.stringify(sanitize(value),null,2);
const fmtDate=value=>{
  if(!value)return '—';
  const date=new Date(value);
  return Number.isNaN(date.getTime())?String(value):date.toLocaleString('de-DE');
};
const capGroup=id=>{
  const value=String(id||'').toLowerCase();
  if(/tornado|waterspout/.test(value))return 'Tornados / Wasserhosen';
  if(/lightning|thunder|storm|hail|downburst|supercell/.test(value))return 'Gewitter & Blitze';
  if(/precip|rain|radar/.test(value))return 'Niederschlag / Regen';
  if(/snow|ice|freez/.test(value))return 'Schnee & Eis';
  if(/wind|gust/.test(value))return 'Wind';
  if(/temp/.test(value))return 'Temperatur';
  if(/cloud/.test(value))return 'Wolken';
  if(/pressure/.test(value))return 'Luftdruck';
  if(/uv/.test(value))return 'UV';
  if(/pollen/.test(value))return 'Pollen';
  if(/flood|hydro|river|tsunami/.test(value))return 'Wasser & Hochwasser';
  if(/earthquake|seismic|volcan/.test(value))return 'Erdbeben & Vulkane';
  if(/warning|hazard|alert/.test(value))return 'Warnungen & Gefahren';
  if(/satellite|meteosat|goes|gibs/.test(value))return 'Satellit';
  if(/sun|moon|aurora|space/.test(value))return 'Sonne, Mond & Weltraum';
  if(/biological|wildlife|species|animal|plant/.test(value))return 'Biologische Daten';
  return 'Weitere';
};
const statusLabel=answer=>{
  if(!answer)return 'Keine Antwort';
  if(answer.status==='ready')return 'ready';
  return answer.unavailable?.code||answer.status||'unbekannt';
};

/* Lazily bound to the CURRENT Home Assistant connection; no calls during boot. */
export const installWeatherRouter=defineModule(MODULE_META,(deps)=>({
  _weatherRouterClient(){
    if(!this.__weatherRouterClient)this.__weatherRouterClient=createWeatherRouterClient(async message=>{
      if(!this._hass||typeof this._hass.callWS!=='function')throw new Error('Home Assistant WebSocket unavailable');
      const capture=String(message?.type||'').startsWith('weather_router/consumer/');
      const store=capture?this._weatherEngineTraceStore():null;
      const started=performance.now(),startedAt=new Date().toISOString();
      try{
        const response=await this._hass.callWS(message);
        if(store){
          store.rawExchanges.push({
            id:'gr-ws-'+String(++store.exchangeSequence).padStart(5,'0'),
            started_at:startedAt,
            completed_at:new Date().toISOString(),
            duration_ms:Math.round((performance.now()-started)*1000)/1000,
            request:JSON.parse(JSON.stringify(message)),
            response:response==null?null:JSON.parse(JSON.stringify(response)),
            error:null
          });
          if(store.rawExchanges.length>store.max)store.rawExchanges.splice(0,store.rawExchanges.length-store.max);
        }
        return response;
      }catch(error){
        if(store){
          store.rawExchanges.push({
            id:'gr-ws-'+String(++store.exchangeSequence).padStart(5,'0'),
            started_at:startedAt,
            completed_at:new Date().toISOString(),
            duration_ms:Math.round((performance.now()-started)*1000)/1000,
            request:JSON.parse(JSON.stringify(message)),
            response:null,
            error:{name:error?.name||'Error',message:error?.message||String(error)}
          });
          if(store.rawExchanges.length>store.max)store.rawExchanges.splice(0,store.rawExchanges.length-store.max);
        }
        throw error;
      }
    });
    return this.__weatherRouterClient;
  },
  _weatherEngineTraceStore(){
    if(!this.__weatherEngineTraceStore)this.__weatherEngineTraceStore={items:[],rawExchanges:[],v2Events:[],v2TestResult:null,v2AgeComparison:null,lastEventWindow:null,max:80,sequence:0,exchangeSequence:0,lastDiscovery:null,lastCatalog:null,displayEvents:[],displaySequence:0,displayExtended:false,displayMarkers:[]};
    return this.__weatherEngineTraceStore;
  },
  // Compact ring buffer: no network traffic, raw URLs or screen captures.
  _weatherEngineMonitorEvent(phase,detail={}){
    const store=this._weatherEngineTraceStore();
    store.displayEvents??=[];
    const safe={};
    for(const [key,value] of Object.entries(detail||{}).slice(0,30)){
      if(/url|token|secret|password|authorization|apikey/i.test(key))continue;
      if(value===null||typeof value==="boolean"||
        (typeof value==="number"&&Number.isFinite(value))||
        (typeof value==="string"&&value.length<=180))safe[key]=value;
      // RF04: keep only bounded, explicitly allowed Canvas audit shapes.
      else if((key==="render_order"||key==="source_order")&&Array.isArray(value))
        safe[key]=value.slice(0,12).filter(x=>x&&typeof x==="object"&&
          typeof x.source_id==="string"&&x.source_id.length<=120)
          .map(x=>({source_id:x.source_id,
            freshness_class:typeof x.freshness_class==="string"
              ?x.freshness_class.slice(0,32):"unknown"}));
      else if(key==="observed_draw_orders"&&Array.isArray(value))
        safe[key]=value.slice(0,12).filter(Array.isArray).map(order=>
          order.slice(0,4).filter(id=>typeof id==="string"&&id.length<=120));
      else if(Array.isArray(value)&&value.length<=12)
        safe[key]=value.filter(x=>typeof x==="string"&&x.length<=120);
      else if(key==="tile_metrics"&&value&&typeof value==="object")
        safe[key]=Object.fromEntries(Object.entries(value).filter(([k,v])=>
          /^[a-z_]+$/.test(k)&&typeof v==="number"&&Number.isFinite(v)).slice(0,12));
    }
    if(phase==="v2_layer_swapped"&&safe.render_order_verified===true&&
      (!Array.isArray(safe.observed_draw_orders)||!safe.observed_draw_orders.length))
      safe.render_order_verified=false;
    const item={seq:++store.displaySequence,at:new Date().toISOString(),
      phase:String(phase).slice(0,90),...safe};
    store.displayEvents.push(item);
    if(store.displayEvents.length>160)store.displayEvents.splice(0,store.displayEvents.length-160);
    // A user-marked window is pinned, even after the ordinary ring overwrites
    // events. Only forty following events, and at most six marks, are held.
    for(const marker of store.displayMarkers||[]){
      if(item.seq>marker.seq&&item.seq<=marker.seq+40&&marker.events?.length<81)
        marker.events.push(item);
    }
    return item;
  },
  _weatherEngineMarkFailure(){
    const store=this._weatherEngineTraceStore();
    const marker=this._weatherEngineMonitorEvent("user_marked_visual_failure",{
      correlation_id:this._weatherRadarState?.().v2CorrelationId||null,
      zoom:Number(this._map?.getZoom?.()??NaN)
    });
    store.displayMarkers??=[];
    store.displayMarkers.push({at:marker.at,seq:marker.seq,
      window_from_seq:Math.max(1,marker.seq-40),window_to_seq:marker.seq+40,
      events:store.displayEvents.slice(-41)});
    if(store.displayMarkers.length>6)store.displayMarkers.shift();
    this._weatherRadarVisualAudit?.("user_marked_snapshot");
    this._weatherEngineDiagnosticRender?.();
  },
  async _weatherRouterDiscovery(options){
    const answer=await this._weatherRouterClient().discover(options);
    this._weatherEngineTraceStore().lastDiscovery={...answer,checked_at:new Date().toISOString()};
    return answer;
  },
  async _weatherRouterCapabilities(options){
    const answer=await this._weatherRouterClient().capabilities(options);
    this._weatherEngineTraceStore().lastCatalog=answer?.status==='ready'?{...answer,checked_at:new Date().toISOString()}:answer;
    return answer;
  },
  async _weatherRouterResolve(capability,context,options){
    const store=this._weatherEngineTraceStore();
    const started=performance.now(),startedAt=new Date().toISOString();
    let answer;
    try{
      answer=await this._weatherRouterClient().resolve(capability,context,options);
      return answer;
    }finally{
      const finished=performance.now();
      const entry={
        id:'gr-we-'+String(++store.sequence).padStart(5,'0'),
        started_at:startedAt,
        completed_at:new Date().toISOString(),
        duration_ms:Math.round((finished-started)*1000)/1000,
        capability,
        context:context?JSON.parse(JSON.stringify(context)):null,
        options:options?JSON.parse(JSON.stringify(options)):null,
        answer:answer?JSON.parse(JSON.stringify(answer)):{status:'unavailable',unavailable:{code:'client_exception',retryable:true,message:'Resolve failed before a valid answer was returned'}}
      };
      store.items.push(entry);
      if(store.items.length>store.max)store.items.splice(0,store.items.length-store.max);
      try{this._weatherEngineDiagnosticRender?.();}catch(_error){}
    }
  },
  async _weatherEngineOperaDiagnosticToggle(){
    const store=this._weatherEngineTraceStore();
    const status=this.shadow?.getElementById('weather-engine-opera-result');
    const show=value=>{if(status)status.textContent=value;};
    if(this.__operaDiagnosticPane?.active===false)this.__operaDiagnosticPane=null;
    if(this.__operaDiagnosticPane){
      this.__operaDiagnosticPane.close();this.__operaDiagnosticPane=null;
      store.operaDiagnostic={status:'closed',at:new Date().toISOString(),scientific_approval:false};
      show('OPERA-Testdarstellung entfernt');this._weatherEngineDiagnosticRender?.();return;
    }
    if(this._hass?.user?.is_admin!==true){show('Administratorberechtigung erforderlich');return;}
    if(this.__operaRequestRunning)return;
    this.__operaRequestRunning=true;
    // HA frontend exposes authenticated WebSocket connection options; the legacy
    // hass.auth.data location is not guaranteed in custom-card runtime.
    const connectionAuth=this._hass?.connection?.options?.auth;
    const token=connectionAuth?.accessToken || this._hass?.auth?.data?.access_token;
    const viewport=this._weatherRadarViewport?.();
    if(!token||!viewport?.focus||!viewport?.context||!this._map||typeof this._hass?.callWS!=='function'){
      this.__operaRequestRunning=false;show('Karte oder Home-Assistant-Anmeldung nicht verfügbar');return;
    }
    const orientation=this.shadow?.getElementById('weather-engine-opera-orientation')?.value||'north_first';
    const opacity=Number(this.shadow?.getElementById('weather-engine-opera-opacity')?.value??70)/100;
    const correlationId='gr-opera-preview-'+Date.now().toString(36);
    store.operaDiagnostic={status:'requesting',correlation_id:correlationId,at:new Date().toISOString(),scientific_approval:false};
    show('OPERA wird ausdrücklich diagnostisch angefordert …');
    try{
      const {requestOperaDiagnosticPane}=await import('./p7-010/opera-diagnostic-tile.js?v=411119r1');
      const pane=await requestOperaDiagnosticPane({
        callWS:request=>this._hass.callWS(request),
        Leaflet:await deps.loadLeafletJs(),map:this._map,viewport:viewport.context,focus:viewport.focus,
        accessToken:token,correlationId,orientation,opacity
      });
      this.__operaDiagnosticPane=pane;
      store.operaDiagnostic={status:'UNVERIFIED_DEV_PREVIEW',orientation,correlation_id:correlationId,
        at:new Date().toISOString(),scientific_approval:false,notice:pane.notice,
        valid_at:pane.validAt||null,metrics:pane.metrics||null};
      show('OPERA – ungeprüfte Testdarstellung');
    }catch(error){
      store.operaDiagnostic={status:'blocked',correlation_id:correlationId,
        at:new Date().toISOString(),scientific_approval:false,
        reason:String(error?.message||error).slice(0,160),
        code:String(error?.code||'opera_client_error').slice(0,64),
        server_diagnostic:error?.diagnostic||null};
      show('OPERA gesperrt: '+store.operaDiagnostic.reason);
    }finally{this.__operaRequestRunning=false;this._weatherEngineDiagnosticRender?.();}
  },
  async _weatherEngineV2InterfaceTest(){
    const store=this._weatherEngineTraceStore();
    if(this.__weatherEngineV2TestRunning||this.__weatherEngineV2ComparisonRunning)return;
    this.__weatherEngineV2TestRunning=true;
    const id="gr-v2-test-"+Date.now().toString(36);
    const started=performance.now();
    const result={consumer_id:"gewitterradar",correlation_id:id,api_version:2,
      started_at:new Date().toISOString(),status:"started",phases:[]};
    store.v2TestResult=result;
    const step=(phase,extra={})=>{result.phases.push({phase,at:new Date().toISOString(),...extra});};
    try{
      const viewport=this._weatherRadarViewport?.();
      if(!viewport?.focus||!viewport.context)throw Object.assign(new Error("Kartenkontext fehlt"),{code:"missing_viewport"});
      if(typeof this._hass?.callWS!=="function")throw Object.assign(new Error("Home Assistant WebSocket fehlt"),{code:"websocket_unavailable"});
      step("preconditions_ok");
      const request=buildRasterMosaicV2Request({
        viewport:viewport.context,focus:viewport.focus,maxLayers:12,
        maxTileRequests:12,maxDataAgeSeconds:900,
        maxBackgroundAgeSeconds:this._weatherRadarState?.()?.allowOlderSatelliteBackground?43200:null,
        consumerId:"gewitterradar",correlationId:id
      });
      step("request_validated");
      let timer=null;
      try{
        const response=await Promise.race([
          Promise.resolve().then(()=>{step("callws_dispatched");return this._hass.callWS(request);}),
          new Promise((_resolve,reject)=>{timer=setTimeout(()=>{
            reject(Object.assign(new Error("V2 client deadline exceeded"),{code:"gr_v2_client_timeout"}));
          },20000);})
        ]);
        step("response",{response_status:String(response?.status||"missing")});
        validateRasterMosaicV2(response,{maxLayers:12,maxDataAgeSeconds:900,maxBackgroundAgeSeconds:request.time.max_background_age_seconds??null});
        step("validated",{layers:response.layers.length});
        result.request_time_policy={mode:request.time.mode,max_data_age_seconds:request.time.max_data_age_seconds,max_background_age_seconds:request.time.max_background_age_seconds??null,max_time_delta_seconds:request.time.max_time_delta_seconds};
        result.status=response.status;
        result.layer_count=response.layers.length;
        result.source_ids=response.layers.map(layer=>layer.source_id).slice(0,12);
        result.background_source_count=response.layers.filter(layer=>layer.freshness_class==="older_background").length;
        result.freshness_classes=response.layers.map(layer=>({source_id:layer.source_id,freshness_class:layer.freshness_class??"unknown",age_seconds:layer.times?.age_seconds??null,valid_at:layer.times?.valid_at||null,quality_note:layer.quality_note||null}));
        result.time_deviating=response.layers.some(layer=>layer.quality_note==="zeitlich_abweichend");
        result.limitations_count=Array.isArray(response.limitations)?response.limitations.length:0;
        result.limitations=Array.isArray(response.limitations)?response.limitations.slice(0,8).filter(item=>typeof item==="string").map(item=>item.slice(0,180)):[];
        result.note="Schnittstellentest ohne Aktivierung des Kartenrenderers";
      }finally{if(timer!==null)clearTimeout(timer);}
    }catch(error){
      result.status="error";
      result.error_code=String(error?.code||error?.error?.code||error?.name||"unknown").slice(0,80);
      step("error",{error_code:result.error_code});
    }finally{
      result.completed_at=new Date().toISOString();
      result.duration_ms=Math.round(performance.now()-started);
      this.__weatherEngineV2TestRunning=false;
      this._weatherEngineDiagnosticRender?.();
    }
    return result;
  },
  async _weatherEngineV2AgeComparisonTest(){
    // Diagnostic-only A/B probe: the productive 900-s live policy remains untouched.
    if(this.__weatherEngineV2ComparisonRunning||this.__weatherEngineV2TestRunning)return;
    this.__weatherEngineV2ComparisonRunning=true;
    const store=this._weatherEngineTraceStore();
    const comparison={
      schema:"gewitterradar.weather_engine_v2_age_comparison.v1",
      consumer_id:"gewitterradar",api_version:2,
      started_at:new Date().toISOString(),status:"running",
      time_mode:"latest_coherent",max_time_delta_seconds:180,
      requests:[],map_unchanged:true
    };
    store.v2AgeComparison=comparison;
    const finish=()=>{
      this.__weatherEngineV2ComparisonRunning=false;
      comparison.completed_at=new Date().toISOString();
      this._weatherEngineDiagnosticRender?.();
    };
    try{
      const viewport=this._weatherRadarViewport?.();
      if(!viewport?.focus||!viewport.context)throw Object.assign(new Error("Kartenkontext fehlt"),{code:"missing_viewport"});
      if(typeof this._hass?.callWS!=="function")throw Object.assign(new Error("Home Assistant WebSocket fehlt"),{code:"websocket_unavailable"});
      // Both requests share the exact same spatial snapshot and all budgets.
      const id="gr-v2-age-"+Date.now().toString(36);
      for(const age of [null,43200]){
        const trial={
          max_data_age_seconds:900,max_background_age_seconds:age,max_time_delta_seconds:180,
          correlation_id:id+"-"+(age===null?"strict":"background"),status:"started",layer_count:0,
          sources:[],limitations:[],started_at:new Date().toISOString()
        };
        comparison.requests.push(trial);
        this._weatherEngineDiagnosticRender?.();
        const request=buildRasterMosaicV2Request({
          viewport:{...viewport.context},focus:{...viewport.focus},
          maxLayers:12,maxTileRequests:12,maxDataAgeSeconds:900,maxBackgroundAgeSeconds:age,
          maxTimeDeltaSeconds:180,consumerId:"gewitterradar",
          correlationId:trial.correlation_id
        });
        const started=performance.now();
        let timeout=null;
        try{
          const response=await Promise.race([
            Promise.resolve().then(()=>this._hass.callWS(request)),
            new Promise((_,reject)=>{timeout=setTimeout(()=>{
              reject(Object.assign(new Error("V2 comparison deadline"),{code:"gr_v2_client_timeout"}));
            },20000);})
          ]);
          validateRasterMosaicV2(response,{maxLayers:12,maxDataAgeSeconds:900,maxBackgroundAgeSeconds:age});
          trial.status=response.status;
          trial.layer_count=response.layers.length;
          trial.reference_time=response.reference_time||null;
          trial.limitations=Array.isArray(response.limitations)?
            response.limitations.filter(x=>typeof x==="string").slice(0,8)
              .map(x=>redactString(x.slice(0,180))):[];
          trial.sources=response.layers.slice(0,12).map(layer=>{
            const millis=Date.parse(layer.times.valid_at);
            return {
              source_id:String(layer.source_id).slice(0,120),
              valid_at:layer.times.valid_at,
              age_seconds:typeof layer.times.age_seconds==="number"?layer.times.age_seconds:(Number.isFinite(millis)?Math.round((Date.now()-millis)/1000):null),
              freshness_class:layer.freshness_class||"unknown",
              reference_delta_seconds:layer.times.reference_delta_seconds,
              observation_kind:layer.semantics.observation_kind,
              measurement_method:layer.semantics.measurement_method,
              quality_note:typeof layer.quality_note==="string"?layer.quality_note.slice(0,80):null
            };
          });
        }catch(error){
          trial.status="error";
          trial.error_code=String(error?.code||error?.error?.code||error?.name||"unknown").slice(0,80);
        }finally{
          if(timeout!==null)clearTimeout(timeout);
          trial.duration_ms=Math.round(performance.now()-started);
          trial.completed_at=new Date().toISOString();
          this._weatherEngineDiagnosticRender?.();
        }
      }
      const [strict,extended]=comparison.requests;
      comparison.age_filter_supported=
        strict?.status==="unavailable"&&strict.layer_count===0&&
        ["ready","partial"].includes(extended?.status)&&extended.layer_count>0;
      comparison.conclusion=comparison.age_filter_supported?
        "Der ausdrücklich freigegebene ältere Satellitenhintergrund ermöglicht im Diagnosetest V2-Quellen; die Karte bleibt unverändert.":
        strict?.status==="unavailable"&&extended?.status==="unavailable"?
          "Beide Anfragen unavailable; serverseitige Ablehnungsgründe prüfen.":
          "Ergebnisse einzeln anhand von Status, Alter und Quellen prüfen.";
      comparison.status="completed";
    }catch(error){
      comparison.status="error";
      comparison.error_code=String(error?.code||error?.name||"unknown").slice(0,80);
    }finally{finish();}
    return comparison;
  },
  async _weatherRouterResolveEventWindow(capability,context,options){
    // Reuse the existing V1 client and discovery; never introduce new routing.
    const result=await this._weatherRouterClient().resolveEventWindow(capability,context,options);
    const store=this._weatherEngineTraceStore();
    const policy=result?.status==='ready'?result.resource?.payload?.event_time_policy:null;
    store.lastEventWindow={
      at:new Date().toISOString(),capability,status:result?.status||'unknown',
      correlation_id:options?.correlationId||null,
      event_count:result?.status==='ready'?result.resource?.payload?.events?.length||0:0,
      page:policy?.page??null,page_size:policy?.page_size??null,
      has_more:policy?.has_more??null,feed_status:policy?.feed_status??null,
      feed_age_seconds:policy?.feed_age_seconds??null,
      rejected_counts:policy?.rejected_counts||null,
      temporal_statuses:result?.status==='ready'
        ?result.resource.payload.events.slice(0,200).map(event=>event.temporal_status||'unknown'):[],
      error_code:result?.unavailable?.code||null
    };
    return result;
  },
  _weatherRouterReset(){this.__weatherRouterClient?.reset();const store=this._weatherEngineTraceStore();store.lastDiscovery=null;store.lastCatalog=null;},
_weatherEngineDiagnosticPayload(){
    const store=this.__weatherEngineTraceStore||{items:[]};
    const radar=typeof this._weatherRadarState==='function'?this._weatherRadarState():null;
    const currentLayer=radar?{
      enabled:Boolean(radar.enabled),
      layer_present:Boolean(radar.layer),
      api_version:radar.v2Snapshot?2:radar.lastReady?1:null,
      mosaic_status:radar.v2Snapshot?.status||null,
      mosaic_layer_count:Array.isArray(radar.v2Snapshot?.layers)?radar.v2Snapshot.layers.length:0,
      mosaic_sources:Array.isArray(radar.v2Snapshot?.layers)?radar.v2Snapshot.layers.map(item=>item.source_id).filter(id=>typeof id==='string').slice(0,12):[],
      current_provider:radar.lastReady?.answer?.provenance?.provider_name||null,
      current_capability:radar.lastReady?.answer?.capability||'weather.precipitation.layer',
      last_ready_at:radar.lastReady?.at?new Date(radar.lastReady.at).toISOString():null,
      last_unavailable:radar.lastUnavailable||null,
      retained_previous_layer:Boolean(radar.layer&&radar.lastUnavailable),
      timeline_frames:radar.timelineModel?.frames?.length||0,
      timeline_index:Number.isInteger(radar.timelineIndex)?radar.timelineIndex:null,
      timeline_playing:Boolean(radar.timelinePlaying),
      in_flight:Boolean(radar.inFlight),
      pending:Boolean(radar.pending),
      last_request_at:radar.lastRequestAt?new Date(radar.lastRequestAt).toISOString():null,
      last_viewport:radar.lastViewport||null,
      preload_entries:radar.preloadCache?.size||0,
      last_v2_partial:radar.v2LastPartial||null,
      raster_display_monitor:{
        enabled:Boolean(radar.enabled),
        layer_mounted:Boolean(radar.layer&&this._map?.hasLayer?.(radar.layer)),
        tile_metrics:radar.layer?.__grRadarTileMetrics||radar.v2RenderMetrics||null,
        zoom:Number(this._map?.getZoom?.()??NaN)
      }
    }:null;
    return sanitize({
      schema:'gewitterradar.weather_engine_diagnostic.v1',
      generated_at:new Date().toISOString(),
      application:globalThis.__GEWITTERRADAR_BOOT_DIAGNOSTICS||null,
      discovery:store.lastDiscovery||null,
      capability_catalog:store.lastCatalog||null,
      traces:[...(store.items||[])],
      raw_consumer_exchanges:[...(store.rawExchanges||[])],
      v2_attempts:[...(store.v2Events||[])],
      v2_interface_test:store.v2TestResult||null,
       opera_diagnostic:store.operaDiagnostic||null,
      v2_age_comparison:store.v2AgeComparison||null,
      display_monitor:{
        schema:"gewitterradar.weather_engine_display_monitor.v1",
        limitations:["Kachelladen belegt keine deckenden Pixel/NoData-Maske"],
        events:[...(store.displayEvents||[])],
        markers:[...(store.displayMarkers||[])],
        event_count:store.displaySequence||0,
        dropped_events:Math.max(0,(store.displaySequence||0)-(store.displayEvents||[]).length),
        detail_enabled:store.displayExtended===true,
        recent_counts:(store.displayEvents||[]).reduce((acc,e)=>
          (acc[e.phase]=(acc[e.phase]||0)+1,acc),{})
      },
      event_window_last:store.lastEventWindow||null,
      local:{precipitation_radar:currentLayer}
    });
  },

  _weatherEngineDiagnosticFiltered(){
    const payload=this._weatherEngineDiagnosticPayload();
    const area=this.shadow?.getElementById('weather-engine-diagnostic-area')?.value||'Alle';
    const capability=this.shadow?.getElementById('weather-engine-diagnostic-capability')?.value||'Alle';
    const traces=(payload.traces||[]).filter(item=>{
      if(capability!=='Alle'&&item.capability!==capability)return false;
      if(area!=='Alle'&&capGroup(item.capability)!==area)return false;
      return true;
    });
    return {...payload,filter:{area,capability},traces};
  },

  _weatherEngineDiagnosticEnsureUi(){
    const root=this.shadow;
    if(!root)return;
    const section=root.getElementById('settings-diagnostic-section');
    const content=section?.querySelector('.settings-section-content');
    if(content&&!root.getElementById('settings-weather-engine-diagnostics-toggle')){
      const marker=[...content.children].find(node=>node.textContent?.trim()==='Testfunktionen');
      const row=document.createElement('div');
      row.className='settings-row';
      row.dataset.weatherEngineDiagnostics='true';
      row.innerHTML='<div class="settings-row-label"><div>Weather Engine</div><div style="font-size:.76rem;opacity:.68;margin-top:3px">WeatherRouter-Anfragen, Antworten, Routing, Coverage, Timeline und lokalen Rückfallzustand untersuchen.</div></div><button class="settings-switch" id="settings-weather-engine-diagnostics-toggle" type="button" role="switch" aria-checked="false" aria-label="Weather Engine Diagnose öffnen"></button>';
      if(marker)content.insertBefore(row,marker);else content.append(row);
      row.querySelector('button')?.addEventListener('click',()=>this._weatherEngineDiagnosticOpen());
    }
    if(root.getElementById('weather-engine-diagnostic-backdrop'))return;

    const backdrop=document.createElement('div');
    backdrop.id='weather-engine-diagnostic-backdrop';
    backdrop.setAttribute('aria-hidden','true');
    backdrop.innerHTML=`
      <style>
        #weather-engine-diagnostic-backdrop{position:fixed;inset:0;z-index:2147483645;display:none;align-items:center;justify-content:center;padding:14px;background:rgba(2,6,12,.78);backdrop-filter:blur(8px)}
        #weather-engine-diagnostic-backdrop.open{display:flex}
        .we-diagnostic-dialog{width:min(980px,100%);max-height:calc(100dvh - 24px);display:flex;flex-direction:column;overflow:hidden;border:1px solid rgba(246,195,68,.32);border-radius:20px;background:linear-gradient(180deg,#141b26,#080d14);box-shadow:0 28px 90px rgba(0,0,0,.72);color:var(--b-text)}
        .we-diagnostic-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.08)}
        .we-diagnostic-title{font-weight:860;font-size:17px}.we-diagnostic-sub{font-size:11px;opacity:.64;margin-top:2px}
        .we-diagnostic-close{width:38px;height:38px;border:0;border-radius:9px;background:rgba(255,255,255,.05);color:#fff;font-size:22px;cursor:pointer}
        .we-diagnostic-body{overflow:auto;padding:12px;display:grid;gap:10px}
        .we-diagnostic-filter{display:grid;grid-template-columns:1fr 1fr auto;gap:8px;align-items:end}
        .we-diagnostic-filter label{display:grid;gap:4px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;opacity:.8}
        .we-diagnostic-filter select,.we-diagnostic-filter button{min-height:38px;border:1px solid rgba(255,255,255,.12);border-radius:9px;background:#101722;color:#e8eef7;padding:7px 9px}
        .we-diagnostic-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
        .we-card{min-width:0;padding:9px 10px;border:1px solid rgba(255,255,255,.08);border-radius:12px;background:rgba(255,255,255,.025)}
        .we-card b{display:block;font-size:10px;color:#f6c344;text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px}.we-card span{font-size:12px;overflow-wrap:anywhere}
        .we-diagnostic-table{width:100%;border-collapse:collapse;font-size:11px}.we-diagnostic-table th,.we-diagnostic-table td{text-align:left;vertical-align:top;padding:6px;border-bottom:1px solid rgba(255,255,255,.07);overflow-wrap:anywhere}.we-diagnostic-table th{color:#f6c344}
        .we-diagnostic-actions{display:flex;gap:7px;flex-wrap:wrap}.we-diagnostic-actions button{min-height:36px;border:1px solid rgba(246,195,68,.24);border-radius:9px;background:rgba(246,195,68,.07);color:#f2dfa5;padding:7px 10px;cursor:pointer}
        .we-diagnostic-raw{margin:0;max-height:300px;overflow:auto;padding:10px;border-radius:10px;background:#05080d;border:1px solid rgba(255,255,255,.07);font-size:10px;white-space:pre-wrap;overflow-wrap:anywhere}
        .we-diagnostic-note{font-size:10px;opacity:.65}
        @media(max-width:720px){.we-diagnostic-filter{grid-template-columns:1fr}.we-diagnostic-summary{grid-template-columns:1fr}.we-diagnostic-table{font-size:10px}}
      </style>
      <section class="we-diagnostic-dialog" role="dialog" aria-modal="true" aria-labelledby="weather-engine-diagnostic-title">
        <div class="we-diagnostic-head">
          <div><div class="we-diagnostic-title" id="weather-engine-diagnostic-title">Weather Engine</div><div class="we-diagnostic-sub">Consumer Request → WeatherRouter → Antwort → lokaler Gewitterradar-Zustand</div></div>
          <button class="we-diagnostic-close" id="weather-engine-diagnostic-close" type="button" aria-label="Weather Engine schließen">×</button>
        </div>
        <div class="we-diagnostic-body">
          <div class="we-diagnostic-filter">
            <label>Bereich<select id="weather-engine-diagnostic-area"><option>Alle</option></select></label>
            <label>Capability<select id="weather-engine-diagnostic-capability"><option>Alle</option></select></label>
            <button id="weather-engine-diagnostic-refresh" type="button">Aktualisieren</button>
          </div>
          <div class="we-diagnostic-summary">
            <div class="we-card"><b>WeatherRouter</b><span id="weather-engine-diagnostic-router">—</span></div>
            <div class="we-card"><b>Letzte WR-Antwort</b><span id="weather-engine-diagnostic-response">—</span></div>
            <div class="we-card"><b>Sichtbarer Layer</b><span id="weather-engine-diagnostic-layer">—</span></div>
          </div>
          <div class="we-card">
            <b>V1/V2-Darstellungsmonitor · Ebenen und Kacheln</b>
            <div id="weather-engine-display-summary" style="font-size:11px;white-space:pre-wrap">Noch keine Darstellungsereignisse</div>
            <div class="we-diagnostic-actions" style="margin:9px 0">
              <button id="weather-engine-display-marker" type="button">Bildverlust jetzt markieren</button>
              <button id="weather-engine-display-detail" type="button" aria-pressed="false">Erweiterte Darstellungsmessung: Aus</button>
            </div>
            <div style="overflow:auto;max-height:240px">
              <table class="we-diagnostic-table"><thead><tr><th>Zeit</th><th>Ereignis</th><th>Zoom</th><th>API</th><th>Abdeckung / Ergebnis</th></tr></thead><tbody id="weather-engine-display-rows"></tbody></table>
            </div>
            <div class="we-diagnostic-note">Nur vorhandene Karten-/Kachel-Ereignisse. Keine zusätzlichen Wetterabfragen oder Bildaufnahmen. Markierung umfasst 40 Ereignisse davor und danach.</div>
          </div>
          <div class="we-card"><b>Consumer API V2 – Schnittstellentest</b><p style="font-size:11px;opacity:.8">Begrenzter WebSocket-Vertragstest ohne Veränderung der Karte oder zusätzliche Raster-Bildabrufe.</p><button id="weather-engine-v2-test" type="button">API V2 gezielt prüfen</button><div id="weather-engine-v2-test-result" style="margin-top:8px;font-size:11px;white-space:pre-wrap">Noch nicht geprüft</div><div class="we-diagnostic-actions" style="margin-top:9px"><button id="weather-engine-v2-compare" type="button">V2-Datenalter vergleichen (15 Min. / 12 Std.)</button></div><div class="we-diagnostic-note" style="margin-top:6px">Zwei getrennte, nacheinander ausgeführte V2-Anfragen mit gleichem Kartenausschnitt. Nur Diagnose: Die produktive 15-Minuten-Grenze und die Karte bleiben unverändert.</div><div id="weather-engine-v2-compare-result" style="margin-top:8px;font-size:11px;white-space:pre-wrap">Noch kein Vergleich durchgeführt</div></div>
          <div class="we-card"><b>OPERA-Vorschau – Entwicklungsvorschau</b><p class="we-diagnostic-note">Geografische Orientierung noch nicht wissenschaftlich bestätigt. Nur Administratoren auf HA DEV VM 109; WR-Vorschau muss dort zuvor ausdrücklich freigegeben sein. Keine Verwendung für Warnungen.</p><label>Orientierungshypothese <select id="weather-engine-opera-orientation"><option value="north_first">Variante A – erste HDF5-Zeile im Norden</option><option value="south_first">Variante B – erste HDF5-Zeile im Süden</option></select></label><label style="display:block;margin:8px 0">Deckkraft <input id="weather-engine-opera-opacity" type="range" min="0" max="100" value="70"></label><div class="we-diagnostic-note">RATE (mm/h): transparent = keine gültige Messung · farbige Pixel = Niederschlag; Maßstab und Georeferenz ungeprüft.</div><button id="weather-engine-opera-toggle" type="button">OPERA-Vorschau starten</button><div id="weather-engine-opera-result" role="status">Nicht gestartet</div></div><div style="overflow:auto"><table class="we-diagnostic-table"><thead><tr><th>Zeit</th><th>Bereich</th><th>Capability</th><th>Kontext</th><th>WR-Antwort</th><th>Provider</th><th>Dauer</th></tr></thead><tbody id="weather-engine-diagnostic-rows"></tbody></table></div>
          <div class="we-diagnostic-actions"><button id="weather-engine-diagnostic-resolve" type="button">Niederschlag neu auflösen</button><button id="weather-engine-diagnostic-copy" type="button">Diagnose kopieren</button><button id="weather-engine-diagnostic-json" type="button">JSON exportieren</button></div>
          <div class="we-diagnostic-note">Die Filter beeinflussen nur die Diagnoseansicht. Providerwahl und WeatherRouter-Routing werden nicht verändert.</div>
          <details><summary>Rohdaten</summary><pre class="we-diagnostic-raw" id="weather-engine-diagnostic-raw"></pre></details>
        </div>
      </section>`;
    root.append(backdrop);

    const close=()=>this._weatherEngineDiagnosticClose();
    backdrop.addEventListener('click',event=>{if(event.target===backdrop)close();});
    root.getElementById('weather-engine-diagnostic-close')?.addEventListener('click',close);
    root.getElementById('weather-engine-diagnostic-refresh')?.addEventListener('click',()=>this._weatherEngineDiagnosticRefresh({catalog:true}));
    root.getElementById('weather-engine-diagnostic-area')?.addEventListener('change',()=>this._weatherEngineDiagnosticRender());
    root.getElementById('weather-engine-diagnostic-capability')?.addEventListener('change',()=>this._weatherEngineDiagnosticRender());
    root.getElementById('weather-engine-display-marker')?.addEventListener('click',()=>this._weatherEngineMarkFailure());
    root.getElementById('weather-engine-display-detail')?.addEventListener('click',()=>{
      const store=this._weatherEngineTraceStore();
      store.displayExtended=!store.displayExtended;
      this._weatherEngineMonitorEvent("monitor_detail_changed",{detail_enabled:store.displayExtended});
      this._weatherEngineDiagnosticRender();
    });
    root.getElementById('weather-engine-opera-toggle')?.addEventListener('click',()=>this._weatherEngineOperaDiagnosticToggle());
    root.getElementById('weather-engine-opera-opacity')?.addEventListener('input',event=>{try{this.__operaDiagnosticPane?.setOpacity(Number(event.target.value)/100);}catch(_error){}});
    root.getElementById('weather-engine-opera-orientation')?.addEventListener('change',()=>{if(this.__operaDiagnosticPane?.active){this.__operaDiagnosticPane.close();this.__operaDiagnosticPane=null;this._weatherEngineDiagnosticRender?.();}});

     root.getElementById('weather-engine-v2-test')?.addEventListener('click',async()=>{await this._weatherEngineV2InterfaceTest();});
    root.getElementById('weather-engine-v2-compare')?.addEventListener('click',async()=>{await this._weatherEngineV2AgeComparisonTest();});
    root.getElementById('weather-engine-diagnostic-resolve')?.addEventListener('click',async()=>{if(typeof this._refreshWeatherRadar==='function')await this._refreshWeatherRadar({reason:'weather-engine-diagnostic',force:true});this._weatherEngineDiagnosticRender();});
    root.getElementById('weather-engine-diagnostic-copy')?.addEventListener('click',async()=>{
      const data=this._weatherEngineDiagnosticFiltered();
      const last=data.traces?.at(-1);
      const radar=data.local?.precipitation_radar;
      const text=[
        'Gewitterradar · Weather Engine Diagnose',
        'Erzeugt: '+fmtDate(data.generated_at),
        'Filter: '+data.filter.area+' / '+data.filter.capability,
        'Letzte Antwort: '+(last?statusLabel(last.answer):'—'),
        'Capability: '+(last?.capability||'—'),
        'Kontext: '+pretty(last?.context||null),
        'Provider: '+(last?.answer?.provenance?.provider_name||'—'),
        'Sichtbarer Layer: '+(radar?.layer_present?(radar.current_provider||'vorhanden'):'keiner'),
        'Rückfall gehalten: '+(radar?.retained_previous_layer?'ja':'nein'),
        '',
        pretty(data)
      ].join('\n');
      try{await navigator.clipboard.writeText(text);}catch(_error){}
    });
    root.getElementById('weather-engine-diagnostic-json')?.addEventListener('click',()=>{
      const data=this._weatherEngineDiagnosticFiltered();
      const blob=new Blob([pretty(data)],{type:'application/json'});
      const url=URL.createObjectURL(blob),a=document.createElement('a');
      a.href=url;a.download='gewitterradar-weather-engine-'+new Date().toISOString().replace(/[:.]/g,'-')+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    });
  },

  async _weatherEngineDiagnosticRefresh({catalog=false}={}){
    if(catalog&&typeof this._weatherRouterCapabilities==='function'){
      try{await this._weatherRouterCapabilities({refresh:true,filter:{}});}catch(_error){}
    }
    this._weatherEngineDiagnosticRender();
  },

  _weatherEngineDiagnosticRender(){
    this._weatherEngineDiagnosticEnsureUi();
    const root=this.shadow;if(!root)return;
    const store=this.__weatherEngineTraceStore||{items:[]};
    const operaButton=root.getElementById('weather-engine-opera-toggle');
    if(operaButton){operaButton.disabled=this.__operaRequestRunning===true||this._hass?.user?.is_admin!==true;operaButton.textContent=this.__operaRequestRunning?'OPERA-Testdarstellung wird geladen …':this.__operaDiagnosticPane?.active!==false&&this.__operaDiagnosticPane?'OPERA-Vorschau entfernen':'OPERA-Vorschau starten';}
    const operaResult=root.getElementById('weather-engine-opera-result');
    if(operaResult){
      const pane=this.__operaDiagnosticPane;
      const state=store.operaDiagnostic||{};
      operaResult.textContent=pane?.active?(
        'OPERA · '+String(pane.orientation||'')+' · '+String(pane.validAt||'')+' UTC · UNGEPRÜFT · '+(pane.metrics?.loaded||0)+' PNG geladen · '+
        (pane.metrics?.failed||0)+' Fehler'
      ):pane?.active===false?'OPERA-Raster abgelaufen oder entfernt':
        state.status==='blocked'?'OPERA gesperrt: '+String(state.reason||state.code||'unbekannt').slice(0,160):
        'OPERA-Testdarstellung nicht aktiv';
    }
    const capabilities=new Set((store.items||[]).map(item=>item.capability).filter(Boolean));
    for(const item of store.lastCatalog?.capabilities||[])if(item?.id)capabilities.add(item.id);
    const groups=[...new Set([...capabilities].map(capGroup))].sort((a,b)=>a.localeCompare(b,'de'));
    const area=root.getElementById('weather-engine-diagnostic-area');
    const capability=root.getElementById('weather-engine-diagnostic-capability');
    if(area){
      const selected=area.value||'Alle';area.replaceChildren(new Option('Alle','Alle'),...groups.map(x=>new Option(x,x)));area.value=[...area.options].some(o=>o.value===selected)?selected:'Alle';
    }
    if(capability){
      const selected=capability.value||'Alle';const areaValue=area?.value||'Alle';
      const caps=[...capabilities].filter(id=>areaValue==='Alle'||capGroup(id)===areaValue).sort();
      capability.replaceChildren(new Option('Alle','Alle'),...caps.map(id=>new Option(id,id)));capability.value=[...capability.options].some(o=>o.value===selected)?selected:'Alle';
    }
    const data=this._weatherEngineDiagnosticFiltered();
    const traces=data.traces||[];
    const last=traces.at(-1)||null;
    const discovery=data.discovery;
    const radar=data.local?.precipitation_radar;

    const router=root.getElementById('weather-engine-diagnostic-router');
    if(router)router.textContent=!discovery?'Noch nicht geprüft':discovery.ready?'bereit · V1 registriert, V2 separat prüfen':discovery.present?'vorhanden, nicht bereit':'nicht erreichbar';
    const response=root.getElementById('weather-engine-diagnostic-response');
    if(response)response.textContent=last?statusLabel(last.answer)+' · '+last.capability:'Noch keine passende Anfrage aufgezeichnet';
    const layer=root.getElementById('weather-engine-diagnostic-layer');
    if(layer)layer.textContent=!radar?'—':!radar.layer_present?'kein WeatherRouter-Raster sichtbar':radar.api_version===2?'API V2 · '+radar.mosaic_layer_count+' Mosaikquellen · sichtbar':('API V1 · '+(radar.current_provider||'Raster vorhanden')+(radar.retained_previous_layer?' · vorherige Darstellung gehalten':' · aktuell'));

    const monitor=data.display_monitor||{},displayRows=root.getElementById('weather-engine-display-rows');
    const monitorSummary=root.getElementById('weather-engine-display-summary');
    if(monitorSummary){
      const counts=monitor.recent_counts||{};
      monitorSummary.textContent="Ereignisse "+(monitor.events?.length||0)+
        " · Markierungen "+(monitor.markers?.length||0)+
        " · geschützte Wechsel "+(counts.v1_regional_replacement_prevented||0)+
        " · Darstellungsverlust-Verdacht "+(counts.display_gap_suspected||0)+
        "\\nV2-Versuche "+(counts.v2_attempt_completed||0)+
        " · V1-Rückfälle "+(counts.v1_fallback_started||0)+
        " · Kachelfehler "+(counts.v1_tile_error||0)+
        " · Verdrängte ältere Ereignisse "+(monitor.dropped_events||0);
    }
    const detailBtn=root.getElementById('weather-engine-display-detail');
    if(detailBtn){detailBtn.textContent="Erweiterte Darstellungsmessung: "+
      (monitor.detail_enabled?"Ein":"Aus");detailBtn.setAttribute("aria-pressed",String(monitor.detail_enabled));}
    if(displayRows){
      displayRows.replaceChildren();
      for(const e of (monitor.events||[]).slice(-36).reverse()){
        const tr=document.createElement("tr");
        const info=["coverage_fraction","old_coverage_fraction","new_coverage_fraction","uncovered_tiles","loaded_tiles","reason","elapsed_ms"]
          .filter(k=>e[k]!==undefined).map(k=>k+"="+e[k]).join(" · ");
        for(const value of [fmtDate(e.at),e.phase,e.zoom??"—",
          e.api_version??e.to_api??"—",info||e.provider_id||e.correlation_id||"—"]){
          const td=document.createElement("td");td.textContent=String(value);tr.append(td);
        }
        displayRows.append(tr);
      }
    }
    const rows=root.getElementById('weather-engine-diagnostic-rows');
    if(rows){
      rows.replaceChildren();
      for(const item of traces.slice(-30).reverse()){
        const tr=document.createElement('tr');
        const provider=item.answer?.provenance?.provider_name||((item.answer?.provenance?.sources||[]).map(x=>x.provider_name).filter(Boolean).join(', ')||'—');
        tr.innerHTML='<td>'+fmtDate(item.completed_at||item.started_at)+'</td><td>'+capGroup(item.capability)+'</td><td>'+String(item.capability||'—')+'</td><td>'+String(item.context?.type||'—')+'</td><td>'+statusLabel(item.answer)+'</td><td>'+String(provider)+'</td><td>'+String(item.duration_ms??'—')+' ms</td>';
        rows.append(tr);
      }
    }
    const v2Result=root.getElementById('weather-engine-v2-test-result');
    if(v2Result){
      const test=store.v2TestResult;
      v2Result.textContent=!test?"Noch nicht geprüft":
        "Status: "+test.status+" · "+(test.layer_count??0)+" Quellen · "+(test.duration_ms??"…")+" ms"+
        (test.error_code?" · Fehler: "+test.error_code:"")+
        "\\nKennung: "+test.correlation_id+
        (test.time_deviating?"\\nHinweis: zeitlich abweichende Quelle":"")+
        (Array.isArray(test.limitations)&&test.limitations.length?"\\nWR-Einschränkungen: "+test.limitations.join(" · "):"");
    }
    const v2Button=root.getElementById('weather-engine-v2-test');
    if(v2Button)v2Button.disabled=Boolean(this.__weatherEngineV2TestRunning||this.__weatherEngineV2ComparisonRunning);
    const compareButton=root.getElementById('weather-engine-v2-compare');
    if(compareButton)compareButton.disabled=Boolean(this.__weatherEngineV2TestRunning||this.__weatherEngineV2ComparisonRunning);
    const comparisonLabel=root.getElementById('weather-engine-v2-compare-result');
    if(comparisonLabel){
      const comparison=store.v2AgeComparison;
      comparisonLabel.textContent=!comparison?"Noch kein Vergleich durchgeführt":
        "Vergleich: "+comparison.status+
        "\\n"+(comparison.requests||[]).map(item=>
          (item.max_background_age_seconds===43200?"15 Min. Radar + 12 Std. globale Satellitengrundlage":"Nur 15 Min. Radar")+
          ": "+item.status+" · "+item.layer_count+" Quellen · "+(item.duration_ms??"…")+" ms"+
          (item.error_code?" · Fehler: "+item.error_code:"")+
          "\\nKennung: "+item.correlation_id+
          (item.sources||[]).map(source=>"\\n"+source.source_id+" · gültig "+source.valid_at+
            " · Alter "+source.age_seconds+" s · "+source.measurement_method).join("")+
          (item.limitations?.length?"\\nHinweise: "+item.limitations.join(" · "):"")
        ).join("\\n")+
        (comparison.conclusion?"\\nAuswertung: "+comparison.conclusion:"");
    }
    const raw=root.getElementById('weather-engine-diagnostic-raw');if(raw)raw.textContent=pretty(data);
  },

  _weatherEngineDiagnosticOpen(){
    this._weatherEngineDiagnosticEnsureUi();
    const root=this.shadow,backdrop=root?.getElementById('weather-engine-diagnostic-backdrop'),toggle=root?.getElementById('settings-weather-engine-diagnostics-toggle');
    if(backdrop){backdrop.classList.add('open');backdrop.setAttribute('aria-hidden','false');}
    toggle?.setAttribute('aria-checked','true');
    this._weatherEngineDiagnosticRefresh({catalog:true});
  },

  _weatherEngineDiagnosticClose(){
    // Closing the diagnostic WINDOW must never revoke the map-owned OPERA layer.
    const root=this.shadow,backdrop=root?.getElementById('weather-engine-diagnostic-backdrop'),toggle=root?.getElementById('settings-weather-engine-diagnostics-toggle');
    if(backdrop){backdrop.classList.remove('open');backdrop.setAttribute('aria-hidden','true');}
    toggle?.setAttribute('aria-checked','false');
  },

  _mountWeatherEngineDiagnostics(){this._weatherEngineDiagnosticEnsureUi();},
  _mountWeatherRouterSettings(){
    const root=this.shadow;
    const title=root?.querySelector('#weather-engine-section .settings-section-title');
    if(title&&!title.querySelector('[data-weather-router-logo]')){
      const logo=document.createElement('img');
      logo.src=WEATHER_ROUTER_LOGO_IMAGE;
      logo.alt='';
      logo.setAttribute('aria-hidden','true');
      logo.dataset.weatherRouterLogo='true';
      logo.style.cssText='width:34px;height:34px;object-fit:contain;vertical-align:middle;margin-right:9px;flex-shrink:0;';
      title.prepend(logo);
    }
    const check=root?.getElementById('weather-engine-check');
    const inspect=root?.getElementById('weather-engine-inspect');
    const status=root?.getElementById('weather-engine-status');
    const results=root?.getElementById('weather-engine-results');
    if(!check||!inspect||!status||!results)return;
    const show=(value,state='neutral')=>{status.textContent=value;status.dataset.state=state;};
    let currentCatalog=null;
    check.addEventListener('click',async()=>{
      check.disabled=true;inspect.disabled=true;currentCatalog=null;
      show('Verbindung zu WeatherRouter wird geprüft …','checking');
      try{
        this._weatherRouterReset();
        const state=await this._weatherRouterDiscovery({refresh:true});
        if(!state.present){show('Nicht erreichbar oder nicht installiert','error');return;}
        if(!state.compatible){show('Vorhanden · Consumer-Schnittstelle V1 nicht kompatibel','error');return;}
        if(!state.ready){show('Vorhanden · derzeit nicht betriebsbereit','error');return;}
        const found=await this._weatherRouterCapabilities({filter:{domains:['weather']}});
        if(found.status!=='ready'){show('Verbindung vorhanden · Wetterfähigkeiten nicht abrufbar','error');return;}
        currentCatalog=found.capabilities;
        const usable=currentCatalog.filter(item=>item.enabled&&item.available);
        show('Bereit · '+usable.length+' Wetterfähigkeiten · Consumer-Schnittstelle V1','ready');
        inspect.disabled=false;
      }catch(_error){show('Verbindungsprüfung fehlgeschlagen','error');}
      finally{check.disabled=false;}
    });
    inspect.addEventListener('click',async()=>{
      if(!currentCatalog)return;
      results.closest('#weather-engine-results-row')?.removeAttribute('hidden');
      const map=this._map;
      if(!map||typeof map.getBounds!=='function'){results.textContent='Die Karte ist noch nicht bereit. Bitte später erneut prüfen.';return;}
      const bounds=map.getBounds(),center=map.getCenter();
      const wrap=n=>((n+180)%360+360)%360-180;
      const bbox={type:'bbox',west:wrap(bounds.getWest()),south:Math.max(-90,bounds.getSouth()),east:wrap(bounds.getEast()),north:Math.min(90,bounds.getNorth())};
      const point={type:'point',latitude:center.lat,longitude:wrap(center.lng)};
      results.textContent='Frage drei Wetterinformationen für den sichtbaren Kartenausschnitt ab …';
      inspect.disabled=true;
      const wanted=[
        ['weather.precipitation.layer','Niederschlag'],
        ['weather.lightning.observed.events','Zusätzliche Blitzbeobachtungen'],
        ['weather.warning.official','Amtliche Warnungen']
      ];
      const output=[];
      try{
        for(const [id,label] of wanted){
          const entry=currentCatalog.find(item=>item.id===id);
          if(!entry||!entry.enabled||!entry.available){output.push(label+': derzeit kein verfügbarer Ressourcenadapter.');continue;}
          const supported=entry.spatial_contexts||[];
          const context=supported.includes('bbox')?bbox:supported.includes('point')?point:supported.includes('global')?{type:'global'}:null;
          if(!context){output.push(label+': kein passender räumlicher Anfragekontext.');continue;}
          const answer=await this._weatherRouterResolve(id,context);
          if(answer.status!=='ready'){output.push(label+': '+(answer.unavailable?.code||'nicht verfügbar'));continue;}
          const provider=answer.provenance?.mode==='aggregate'?(answer.provenance.sources||[]).map(x=>x.provider_name).join(', '):(answer.provenance?.provider_name||'Quelle nicht benannt');
          const count=answer.resource.type==='event_feed'?answer.resource.payload.event_count:answer.resource.type==='hazard_feed'?answer.resource.payload.events.length:null;
          const age=Number.isFinite(answer.freshness?.age_seconds)?' · Alter '+Math.round(answer.freshness.age_seconds)+' s':'';
          output.push(label+': '+answer.resource.type+(count===null?'':' · '+count+' Ereignisse')+' · '+provider+age+(answer.routing?.degraded?' · eingeschränkt':''));
        }
        results.textContent=output.join('\n');
      }catch(_error){results.textContent='Abfrage fehlgeschlagen. Die bestehende Blitzüberwachung bleibt unbeeinflusst.';}
      finally{inspect.disabled=false;}
    });
  }
}));
