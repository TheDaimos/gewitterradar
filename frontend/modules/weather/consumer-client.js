import { defineModule } from '../core/runtime.js?v=41106r1';
export const MODULE_META=Object.freeze({id:'weather.consumer-client',version:'1.1.0',group:'Weather-Engine',function:'WeatherRouter Consumer V1',subfunctions:['Discovery','Capability-Katalog','Resolve','Quellenstatus','Diagnose-Trace','Weather Engine Diagnose'],file:'modules/weather/consumer-client.js'});
/* WeatherRouter Consumer V1 – independent, read-only adapter.
 * No provider binding, no internal WeatherRouter import, no implicit HA/home location.
 * WeatherRouter is optional; this client never touches the existing Blitzortung pipeline.
 */
export const WEATHER_ROUTER_LOGO_IMAGE = new URL('../../assets/weather-router-emblem-v004-256.png', import.meta.url).href;
export const WEATHER_ROUTER_CONTRACT=1;
export const WEATHER_ROUTER_CAPABILITIES=Object.freeze({
  lightningEvents:'weather.lightning.observed.events',
  lightningDensity:'weather.lightning.observed.density',
  precipitation:'weather.radar.precipitation',
  warnings:'weather.warning.official'
});
export const WEATHER_ROUTER_RESOURCE_TYPES=Object.freeze([
  'value','raster_tile','hazard_feed','event_feed','image_sequence',
  'live_stream','planetary_tile','data_file'
]);
const validId=id=>typeof id==='string'&&/^[a-z][a-z0-9_]*(?:\.[a-z0-9_]+)+$/.test(id);
const numberBetween=(n,min,max)=>typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max;
const absent=(code,message,retryable=false)=>({status:'unavailable',unavailable:{code,message,retryable}});
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
  const {type,payload}=response.resource;
  if(type==='event_feed'&&(!Array.isArray(payload.events)||!Number.isInteger(payload.event_count)))throw new TypeError('Invalid event feed');
  if(type==='hazard_feed'&&!Array.isArray(payload.events))throw new TypeError('Invalid hazard feed');
  if(type==='raster_tile'&&(!payload.tile_url||!numberBetween(payload.tile_size,1,Number.MAX_SAFE_INTEGER)||!numberBetween(payload.max_zoom,0,Number.MAX_SAFE_INTEGER)))throw new TypeError('Invalid radar tile descriptor');
  if(type==='value'&&(!payload.values||typeof payload.values!=='object'))throw new TypeError('Invalid value payload');
  if(type==='image_sequence'&&(!Array.isArray(payload.frames)||typeof payload.georeferenced!=='boolean'))throw new TypeError('Invalid image sequence');
  return {status:'ready',capability,resource:response.resource,provenance:response.provenance,freshness:response.freshness??null,routing:response.routing,profile:response.profile??null};
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
        discovery={present:false,compatible:false,ready:false,router:null,domains:[],reason:'discovery_failed'};
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
  async function resolve(capability,context,{requirements,eventFilter}={}){
    if(!validId(capability))throw new TypeError('Invalid public capability');
    const spatial=validateWeatherContext(context);
    const state=await discover();
    if(!state.ready)return absent(state.compatible?'router_not_ready':'capability_not_supported','WeatherRouter not ready');
    const request={type:'weather_router/consumer/resolve',contract_version:WEATHER_ROUTER_CONTRACT,capability,context:spatial,time:{mode:'latest'}};
    if(profile)request.profile_id=profile;
    if(requirements!==undefined)request.requirements=requirements;
    if(eventFilter!==undefined)request.event_filter=eventFilter;
    try{return parseWeatherResolution(await callWS(request),capability);}
    catch(error){return absent('temporarily_unavailable','WeatherRouter request or response failed',true);}
  }
  function reset(){discovery=null;catalogCache.clear();}
  return Object.freeze({discover,capabilities,resolve,reset,get discovery(){return discovery;},get profileId(){return profile;}});
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
export const installWeatherRouter=defineModule(MODULE_META,()=>({
  _weatherRouterClient(){
    if(!this.__weatherRouterClient)this.__weatherRouterClient=createWeatherRouterClient(message=>{
      if(!this._hass||typeof this._hass.callWS!=='function')throw new Error('Home Assistant WebSocket unavailable');
      return this._hass.callWS(message);
    });
    return this.__weatherRouterClient;
  },
  _weatherEngineTraceStore(){
    if(!this.__weatherEngineTraceStore)this.__weatherEngineTraceStore={items:[],max:80,sequence:0,lastDiscovery:null,lastCatalog:null};
    return this.__weatherEngineTraceStore;
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
  _weatherRouterReset(){this.__weatherRouterClient?.reset();const store=this._weatherEngineTraceStore();store.lastDiscovery=null;store.lastCatalog=null;},
_weatherEngineDiagnosticPayload(){
    const store=this.__weatherEngineTraceStore||{items:[]};
    const radar=typeof this._weatherRadarState==='function'?this._weatherRadarState():null;
    const currentLayer=radar?{
      enabled:Boolean(radar.enabled),
      layer_present:Boolean(radar.layer),
      current_provider:radar.lastReady?.answer?.provenance?.provider_name||null,
      current_capability:radar.lastReady?.answer?.capability||'weather.radar.precipitation',
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
      preload_entries:radar.preloadCache?.size||0
    }:null;
    return sanitize({
      schema:'gewitterradar.weather_engine_diagnostic.v1',
      generated_at:new Date().toISOString(),
      application:globalThis.__GEWITTERRADAR_BOOT_DIAGNOSTICS||null,
      discovery:store.lastDiscovery||null,
      capability_catalog:store.lastCatalog||null,
      traces:[...(store.items||[])],
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
          <div style="overflow:auto"><table class="we-diagnostic-table"><thead><tr><th>Zeit</th><th>Bereich</th><th>Capability</th><th>Kontext</th><th>WR-Antwort</th><th>Provider</th><th>Dauer</th></tr></thead><tbody id="weather-engine-diagnostic-rows"></tbody></table></div>
          <div class="we-diagnostic-actions"><button id="weather-engine-diagnostic-resolve" type="button">Radar neu auflösen</button><button id="weather-engine-diagnostic-copy" type="button">Diagnose kopieren</button><button id="weather-engine-diagnostic-json" type="button">JSON exportieren</button></div>
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
    if(router)router.textContent=!discovery?'Noch nicht geprüft':discovery.ready?'bereit · Consumer API V1':discovery.present?'vorhanden, nicht bereit':'nicht erreichbar';
    const response=root.getElementById('weather-engine-diagnostic-response');
    if(response)response.textContent=last?statusLabel(last.answer)+' · '+last.capability:'Noch keine passende Anfrage aufgezeichnet';
    const layer=root.getElementById('weather-engine-diagnostic-layer');
    if(layer)layer.textContent=!radar?'—':radar.layer_present?(radar.current_provider||'Layer vorhanden')+(radar.retained_previous_layer?' · Rückfall/letzten Stand gehalten':' · aktuell'):'kein WeatherRouter-Raster sichtbar';

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
    const root=this.shadow,backdrop=root?.getElementById('weather-engine-diagnostic-backdrop'),toggle=root?.getElementById('settings-weather-engine-diagnostics-toggle');
    if(backdrop){backdrop.classList.remove('open');backdrop.setAttribute('aria-hidden','true');}
    toggle?.setAttribute('aria-checked','false');
  },

  _mountWeatherEngineDiagnostics(){this._weatherEngineDiagnosticEnsureUi();,
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
    const show=value=>{status.textContent=value;};
    let currentCatalog=null;
    check.addEventListener('click',async()=>{
      check.disabled=true;inspect.disabled=true;currentCatalog=null;
      show('WeatherRouter: prüfe die Home-Assistant-Verbindung …');
      try{
        this._weatherRouterReset();
        const state=await this._weatherRouterDiscovery({refresh:true});
        if(!state.present){show('WeatherRouter nicht erreichbar oder nicht installiert. Blitzortung bleibt unverändert.');return;}
        if(!state.compatible){show('WeatherRouter vorhanden, Consumer API V1 nicht kompatibel.');return;}
        if(!state.ready){show('WeatherRouter vorhanden, aber noch nicht betriebsbereit oder deaktiviert.');return;}
        const found=await this._weatherRouterCapabilities({filter:{domains:['weather']}});
        if(found.status!=='ready'){show('Consumer API erreichbar, Capability-Katalog derzeit nicht verfügbar.');return;}
        currentCatalog=found.capabilities;
        const usable=currentCatalog.filter(item=>item.enabled&&item.available);
        show('WeatherRouter bereit · Consumer API V1 · '+usable.length+' verfügbare Wetterfähigkeiten im Katalog.');
        inspect.disabled=false;
      }catch(_error){show('Die Routerabfrage ist fehlgeschlagen. Blitzortung bleibt unverändert.');}
      finally{check.disabled=false;}
    });
    inspect.addEventListener('click',async()=>{
      if(!currentCatalog)return;
      const map=this._map;
      if(!map||typeof map.getBounds!=='function'){results.textContent='Die Karte ist noch nicht bereit. Bitte später erneut prüfen.';return;}
      const bounds=map.getBounds(),center=map.getCenter();
      const wrap=n=>((n+180)%360+360)%360-180;
      const bbox={type:'bbox',west:wrap(bounds.getWest()),south:Math.max(-90,bounds.getSouth()),east:wrap(bounds.getEast()),north:Math.min(90,bounds.getNorth())};
      const point={type:'point',latitude:center.lat,longitude:wrap(center.lng)};
      results.textContent='Frage drei Wetterinformationen für den sichtbaren Kartenausschnitt ab …';
      inspect.disabled=true;
      const wanted=[
        ['weather.radar.precipitation','Niederschlag'],
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
