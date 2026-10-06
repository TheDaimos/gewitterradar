import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createWeatherRouterClient,validateWeatherContext,parseWeatherResolution,WEATHER_ROUTER_CAPABILITIES} from '../frontend/modules/weather/consumer-client.js';
import {buildWeatherLayerCatalog,isWeatherLayerCapability,formatWeatherLayerCapabilityLabel,weatherLayerSubcategory} from '../frontend/modules/weather/layer-menu.js';

const calls=[];
const mock=async request=>{
  calls.push(request);
  if(request.type==='weather_router/consumer/discovery')return {schema:'weather_router.consumer.discovery.v1',contract:{name:'weather_router.consumer',supported_versions:[1],preferred_version:1},router:{ready:true,enabled:true},domains:[{id:'weather',enabled:true}]};
  if(request.type==='weather_router/consumer/capabilities')return {schema:'weather_router.consumer.capabilities.v1',contract_version:1,capabilities:[{id:'weather.radar.precipitation',enabled:true,available:true}],filter_options:{},applied_filter:{}};
  if(request.type==='weather_router/consumer/resolve')return {schema:'weather_router.consumer.resolution.v1',contract_version:1,status:'ready',capability:request.capability,resource:{type:'event_feed',payload:{events:[],event_count:0}},provenance:{mode:'single',provider_id:'mock',provider_name:'Mock',source_class:'observation',attribution:null},routing:{reason_code:'eligible_candidate',fallback_available:false,degraded:false}};
  throw Error('Unexpected WebSocket request');
};
const client=createWeatherRouterClient(mock);
assert.equal((await client.discover()).ready,true);
assert.equal((await client.discover()).ready,true);
assert.equal(calls.filter(x=>x.type.endsWith('/discovery')).length,1,'Discovery must be cached');
assert.equal((await client.capabilities()).capabilities.length,1);
const radarFilter={domains:['weather'],resource_types:['raster_tile'],available_only:true};
assert.equal((await client.capabilities({filter:radarFilter})).capabilities.length,1);
assert.equal(calls.filter(x=>x.type.endsWith('/capabilities')).length,2,'Different capability filters need independent cache entries');
await client.capabilities({filter:radarFilter});
assert.equal(calls.filter(x=>x.type.endsWith('/capabilities')).length,2,'Identical capability filter must reuse its cache entry');
const context={type:'point',latitude:0,longitude:0};
let result=await client.resolve(WEATHER_ROUTER_CAPABILITIES.lightningEvents,context);
assert.equal(result.status,'ready');assert.equal(result.resource.type,'event_feed');assert.equal(result.resource.payload.event_count,0,'Empty observations are not failures');
assert.equal(calls.at(-1).time.mode,'latest');
assert.deepEqual(calls.at(-1).context,context);
assert.equal(Object.hasOwn(calls.at(-1),'provider'),false);
assert.equal(Object.hasOwn(calls.at(-1),'profile_id'),false);
assert.deepEqual(validateWeatherContext({type:'bbox',west:170,east:-170,south:-20,north:20}),{type:'bbox',west:170,east:-170,south:-20,north:20},'Dateline crossing is permitted');
for(const invalid of [null,{}, {type:'point',latitude:91,longitude:0},{type:'point',latitude:0,longitude:0,home:true},{type:'bbox',west:0,east:1,south:5,north:4}]){
  assert.throws(()=>validateWeatherContext(invalid),TypeError);
}
assert.throws(()=>parseWeatherResolution({schema:'weather_router.consumer.resolution.v1',contract_version:1,status:'ready',capability:'weather.lightning.observed.events',resource:{type:'other',payload:{}},provenance:{},routing:{}},'weather.lightning.observed.events'),TypeError);
const unavailable=parseWeatherResolution({schema:'weather_router.consumer.resolution.v1',contract_version:1,status:'unavailable',capability:WEATHER_ROUTER_CAPABILITIES.lightningEvents,unavailable:{code:'outside_coverage',retryable:false,message:'Outside coverage'}},WEATHER_ROUTER_CAPABILITIES.lightningEvents);
assert.equal(unavailable.status,'unavailable');
const missing=createWeatherRouterClient(async()=>{throw Error('unknown_command')});
assert.equal((await missing.discover()).present,false);
assert.equal((await missing.resolve(WEATHER_ROUTER_CAPABILITIES.lightningEvents,context)).status,'unavailable');
const offline=createWeatherRouterClient(async()=>{throw Error('connection_lost')});
const offlineState=await offline.discover();assert.equal(offlineState.present,true);assert.equal(offlineState.ready,false);assert.equal(offlineState.reason,'discovery_unreachable');
const unsupported=createWeatherRouterClient(async()=>({schema:'weather_router.consumer.discovery.v1',contract:{name:'weather_router.consumer',supported_versions:[2]},router:{ready:true,enabled:true},domains:[]}));
assert.equal((await unsupported.discover()).compatible,false);
assert.equal((await unsupported.resolve(WEATHER_ROUTER_CAPABILITIES.lightningEvents,context)).status,'unavailable');
const filtered=createWeatherRouterClient(mock,{profileId:'gewitterradar'});await filtered.discover();await filtered.resolve(WEATHER_ROUTER_CAPABILITIES.lightningEvents,context);
assert.equal(calls.at(-1).profile_id,'gewitterradar');
assert.equal(calls.some(x=>Object.hasOwn(x,'provider')),false,'No provider selection in consumer requests');
const layerCatalog=buildWeatherLayerCatalog([
  {id:WEATHER_ROUTER_CAPABILITIES.precipitation,domain:'weather',name:'Niederschlag',enabled:true,available:true,resource_types:['raster_tile'],spatial_contexts:['bbox'],phenomena:['precipitation'],family:'precipitation'},
  {id:'weather.satellite.clouds',domain:'weather',name:'Wolken',enabled:true,available:true,resource_types:['image_sequence'],spatial_contexts:['global'],phenomena:['clouds'],family:'satellite',intent_contract:{kind:'visual_layer',resource_type:'image_sequence'}},
  {id:'weather.model.wind_10m.layer',domain:'weather',name:'Wind',enabled:true,available:true,resource_types:['raster_tile'],spatial_contexts:['bbox'],phenomena:['wind'],family:'model'},
  {id:'weather.point.uv_index',domain:'weather',name:'UV',enabled:true,available:true,resource_types:['value'],spatial_contexts:['point'],phenomena:['uv'],family:'point'},
  {id:'space.moon.tiles',domain:'space',name:'Mond',enabled:true,available:true,resource_types:['planetary_tile'],spatial_contexts:['global'],phenomena:[],family:'moon'},
  {id:'natural_hazards.disabled',domain:'natural_hazards',name:'Aus',enabled:false,available:true,resource_types:['hazard_feed'],spatial_contexts:['bbox'],phenomena:[],family:'hazard'}
]);
assert.deepEqual(layerCatalog.quick.map(x=>x.id),['precipitation','clouds','wind'],'Quick access must be capability-driven and must not expose point-only UV as a map layer');
assert.deepEqual(layerCatalog.categories.map(x=>x.id),['weather','space'],'Categories must derive from catalog domain metadata');
assert.equal(layerCatalog.quick.find(x=>x.id==='precipitation')?.renderer,'precipitation','Existing precipitation renderer must be reused');
assert.equal(isWeatherLayerCapability({enabled:true,available:true,resource_types:['value'],spatial_contexts:['point']}),false,'Point values are not generic map layers');
assert.equal(isWeatherLayerCapability({enabled:true,available:true,resource_types:['image_sequence'],spatial_contexts:['global'],intent_contract:{kind:'visual_layer',resource_type:'image_sequence'}}),true,'Explicit visual image sequences are map-suitable');
const biologicalFixture=[
  {id:'biological_hazards.occurrence.false_morel.density',domain:'biological_hazards',name:'GBIF · Vorkommensdichte · Frühjahrs-Giftlorchel',enabled:true,available:true,resource_types:['raster_tile'],spatial_contexts:['global'],phenomena:['toxic_fungus','toxic'],family:'biological_occurrence_density'},
  {id:'biological_hazards.occurrence.cheetah.density',domain:'biological_hazards',name:'GBIF · Vorkommensdichte · Gepard',enabled:true,available:true,resource_types:['raster_tile'],spatial_contexts:['global'],phenomena:['wildlife','predator'],family:'biological_occurrence_density'},
  {id:'biological_hazards.occurrence.elapidae.density',domain:'biological_hazards',name:'GBIF · Vorkommensdichte · Giftnattern (Elapidae)',enabled:true,available:true,resource_types:['raster_tile'],spatial_contexts:['global'],phenomena:['wildlife','snake','venomous'],family:'biological_occurrence_density'},
];
const hierarchyCatalog=buildWeatherLayerCatalog([
  ...biologicalFixture,
  {id:'natural_hazards.flood.warning',domain:'natural_hazards',name:'Hochwasserwarnungen',enabled:true,available:true,resource_types:['hazard_feed'],spatial_contexts:['bbox'],phenomena:[],family:'flood'},
  {id:'natural_hazards.tsunami.warnings',domain:'natural_hazards',name:'Tsunamiwarnungen',enabled:true,available:true,resource_types:['hazard_feed'],spatial_contexts:['bbox'],phenomena:[],family:'tsunami'},
]);
const biologicalCategory=hierarchyCatalog.categories.find(x=>x.id==='biological_hazards');
const naturalCategory=hierarchyCatalog.categories.find(x=>x.id==='natural_hazards');
assert.equal(biologicalCategory?.grouped,true,'Large biological catalog must be split into subcategories');
assert.deepEqual(biologicalCategory?.groups.map(x=>x.id),['predators','venomous_snakes','toxic_fungi'],'Biological grouping must follow public phenomena');
assert.deepEqual(naturalCategory?.groups.map(x=>x.id),['flood','tsunami'],'Natural-hazard grouping must follow public families');
assert.equal(weatherLayerSubcategory(biologicalFixture[0]),'toxic_fungi');
assert.equal(weatherLayerSubcategory(biologicalFixture[1]),'predators');
assert.equal(weatherLayerSubcategory(biologicalFixture[2]),'venomous_snakes');
assert.deepEqual(
  formatWeatherLayerCapabilityLabel(biologicalFixture[0]),
  {primary:'Frühjahrs-Giftlorchel',secondary:'Vorkommensdichte · GBIF',full:'Frühjahrs-Giftlorchel · Vorkommensdichte · GBIF'},
  'Provider-led capability names must be reordered for human scanning'
);
const displayMenuSource=await readFile(new URL('../frontend/modules/weather/display-menu.js',import.meta.url),'utf8');
for(const marker of ['id:"weather.display-menu"','version:"0.2.0"','data-weather-display-eye-placeholder','_weatherDisplayBindPanelDrag','_weatherDisplayCancelDrag','lostpointercapture','lifecycleAbortHandler','incompatible','_weatherDisplayLegendMode','_weatherDisplaySetLegendMode','data-weather-display-legend-mode','WEATHER_DISPLAY_STYLES','balanced','soft'])assert.ok(displayMenuSource.includes(marker),'WeatherRouter display menu contract missing: '+marker);
const legendOverlaySource=await readFile(new URL('../frontend/modules/weather/legend-overlay.js',import.meta.url),'utf8');
for(const marker of ['id:"weather.legend-overlay"','version:"0.1.0"','_weatherLegendSetModel','_weatherLegendClear','_weatherLegendVisibleModels','_weatherLegendRenderVisual','weather-legend-overlay','data-weather-legend-hide','strict-origin-when-cross-origin'])assert.ok(legendOverlaySource.includes(marker),'WeatherRouter legend overlay contract missing: '+marker);
const precipitationSource=await readFile(new URL('../frontend/modules/weather/precipitation-layer.js',import.meta.url),'utf8');
for(const marker of ['version:"1.3.3"','_weatherLegendSetModel','_weatherLegendClear?.("precipitation")','legend?.entries','legend?.stops','semantics.unit','weather-legend-overlay'])assert.ok(precipitationSource.includes(marker),'Precipitation legend handoff missing: '+marker);
const layerMenuSource=await readFile(new URL('../frontend/modules/weather/layer-menu.js',import.meta.url),'utf8');
for(const marker of ['renderSignature','overflow-y:auto','overscroll-behavior:contain','scrollbar-gutter:stable','panel.addEventListener("wheel"','panel.addEventListener("touchmove"','weather-layer-back-slot','data-weather-layer-action="subcategory"','.weather-layer-view [data-weather-layer-entry-wrap]{display:none!important}','grid-template-columns:42px 1fr 42px','min-height:52px','width:calc(100% + 5px)','margin-right:-5px','padding-right:8px','.weather-layer-logo{width:27px;height:27px;justify-self:start']){
  assert.ok(layerMenuSource.includes(marker),'WeatherRouter Layer Hub must keep stable DOM and own its scrolling: '+marker);
}
console.log('PASS: WeatherRouter Consumer V1, missing/offline distinction, hierarchical Layer Hub, WR display-menu and generic legend overlay.');
