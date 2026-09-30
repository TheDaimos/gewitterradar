import { defineModule } from '../core/runtime.js?v=41104r1';
export const MODULE_META=Object.freeze({id:'weather.consumer-client',version:'1.0.3',group:'Weather-Engine',function:'WeatherRouter Consumer V1',subfunctions:['Discovery','Capability-Katalog','Resolve','Quellenstatus'],file:'modules/weather/consumer-client.js'});
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

/* Lazily bound to the CURRENT Home Assistant connection; no calls during boot. */
export const installWeatherRouter=defineModule(MODULE_META,()=>({
  _weatherRouterClient(){
    if(!this.__weatherRouterClient)this.__weatherRouterClient=createWeatherRouterClient(message=>{
      if(!this._hass||typeof this._hass.callWS!=='function')throw new Error('Home Assistant WebSocket unavailable');
      return this._hass.callWS(message);
    });
    return this.__weatherRouterClient;
  },
  _weatherRouterDiscovery(options){return this._weatherRouterClient().discover(options);},
  _weatherRouterCapabilities(options){return this._weatherRouterClient().capabilities(options);},
  _weatherRouterResolve(capability,context,options){return this._weatherRouterClient().resolve(capability,context,options);},
  _weatherRouterReset(){this.__weatherRouterClient?.reset();},
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
