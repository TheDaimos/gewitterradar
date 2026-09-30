/* WeatherRouter Consumer V1 – independent, read-only adapter.
 * No provider binding, no internal WeatherRouter import, no implicit HA/home location.
 * WeatherRouter is optional; this client never touches the existing Blitzortung pipeline.
 */
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
  let discovery=null,catalog=null,profile=profileId;
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
  async function capabilities({refresh=false,filter={domains:['weather'],families:['radar','lightning']}}={}){
    const state=await discover({refresh});
    if(!state.ready)return absent(state.compatible?'router_not_ready':'capability_not_supported','WeatherRouter not ready');
    if(catalog&&!refresh)return catalog;
    const query={type:'weather_router/consumer/capabilities',contract_version:WEATHER_ROUTER_CONTRACT,filter};
    if(profile)query.profile_id=profile;
    try{
      const response=await callWS(query);
      if(response?.schema!=='weather_router.consumer.capabilities.v1'||response.contract_version!==1||!Array.isArray(response.capabilities))throw new TypeError('Invalid capability response');
      catalog={status:'ready',capabilities:response.capabilities,generated_at:response.generated_at??null};
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
  function reset(){discovery=null;catalog=null;}
  return Object.freeze({discover,capabilities,resolve,reset,get discovery(){return discovery;},get profileId(){return profile;}});
}
