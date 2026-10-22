import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createWeatherRouterClient,validateWeatherContext,parseWeatherResolution,WEATHER_ROUTER_CAPABILITIES} from '../frontend/modules/weather/consumer-client.js';
import {buildWeatherLayerCatalog,isWeatherLayerCapability,formatWeatherLayerCapabilityLabel,weatherLayerSubcategory,parseGenericRasterCoverage,genericRasterCycleStatus,parseGenericRasterUtc,createGenericRasterTileBudget,genericRasterViewportBbox} from '../frontend/modules/weather/layer-menu.js';
import {rasterTileUrl} from '../frontend/modules/weather/p7-010/raster-tile-url.js';

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
  {id:'weather.satellite.clouds',domain:'weather',name:'Wolken',enabled:true,available:true,resource_types:['raster_tile'],spatial_contexts:['global'],phenomena:['clouds'],family:'satellite',intent_contract:{kind:'visual_layer',resource_type:'raster_tile'}},
  {id:'weather.model.wind_10m.layer',domain:'weather',name:'Wind',enabled:true,available:true,resource_types:['raster_tile'],spatial_contexts:['bbox'],phenomena:['wind'],family:'model'},
  {id:'weather.point.uv_index',domain:'weather',name:'UV',enabled:true,available:true,resource_types:['value'],spatial_contexts:['point'],phenomena:['uv'],family:'point'},
  {id:'space.moon.tiles',domain:'space',name:'Mond',enabled:true,available:true,resource_types:['planetary_tile'],spatial_contexts:['global'],phenomena:[],family:'moon'},
  {id:'natural_hazards.disabled',domain:'natural_hazards',name:'Aus',enabled:false,available:true,resource_types:['hazard_feed'],spatial_contexts:['bbox'],phenomena:[],family:'hazard'}
]);
assert.deepEqual(layerCatalog.quick.map(x=>x.id),['precipitation','clouds','wind'],'Quick access must be capability-driven and must not expose point-only UV as a map layer');
assert.deepEqual(layerCatalog.categories.map(x=>x.id),['weather','space'],'Categories must derive from catalog domain metadata');
assert.equal(layerCatalog.quick.find(x=>x.id==='precipitation')?.renderer,'precipitation','Existing precipitation renderer must be reused');
assert.equal(isWeatherLayerCapability({enabled:true,available:true,resource_types:['value'],spatial_contexts:['point']}),false,'Point values are not generic map layers');
assert.equal(layerCatalog.quick.find(x=>x.id==='clouds')?.renderer,'weather.satellite.clouds','Real WR satellite cloud raster must attach to the isolated generic renderer');
assert.equal(layerCatalog.quick.find(x=>x.id==='wind')?.renderer,'weather.model.wind_10m.layer','Real WR wind model raster must attach to the isolated generic renderer');
assert.equal(parseGenericRasterUtc('2026-10-19T13:40:00Z'),'2026-10-19T13:40:00.000Z');
assert.equal(parseGenericRasterUtc('2026-10-19T15:40:00+02:00'),'2026-10-19T13:40:00.000Z','Positive offset must become UTC');
assert.equal(parseGenericRasterUtc('2026-10-19T09:40:00-04:00'),'2026-10-19T13:40:00.000Z','Negative offset must become UTC');
for(const invalidTime of ['2026-10-19T13:40:00','2026-10-19T13:40:00+25:55','2026-10-19T13:40:00UTC','not-a-date',null,undefined])
  assert.equal(parseGenericRasterUtc(invalidTime),null,'Non-explicit or malformed source time must fail closed');
assert.equal(genericRasterCycleStatus({drawn:0,failed:0}),'unavailable','A complete Leaflet cycle of clipped transparent tiles is NOT a drawn map');
assert.equal(genericRasterCycleStatus({drawn:0,failed:2}),'failed','Failures without painted tiles cannot be reported as partial success');
assert.equal(genericRasterCycleStatus({drawn:1,failed:0}),'ready','A completed cycle with successful canvas draw operation is ready');
assert.equal(genericRasterCycleStatus({drawn:1,failed:1}),'partial','Painted tiles plus failed tiles form a partial map');

assert.deepEqual(genericRasterViewportBbox({west:170,east:190,south:-20,north:20}),{type:'bbox',west:170,south:-20,east:-170,north:20},'Unwrapped Leaflet date line must become WR antimeridian bbox');
assert.deepEqual(genericRasterViewportBbox({west:190,east:210,south:-20,north:20}),{type:'bbox',west:-170,south:-20,east:-150,north:20},'Repeated longitude stays regional');
assert.deepEqual(genericRasterViewportBbox({west:-190,east:190,south:-90,north:90}),{type:'bbox',west:-180,south:-85,east:180,north:85},'Full-world extent remains bounded');
assert.equal(genericRasterViewportBbox({west:20,east:20,south:0,north:10}),null,'Invalid zero width');
assert.deepEqual(parseGenericRasterCoverage({spatial_coverage:{scope:'bbox',bbox:{west:5,south:47,east:16,north:56}}}),
  {scope:'bbox',west:5,south:47,east:16,north:56,antimeridian:false},'WR coverage must accept the canonical machine-readable bbox object');
assert.deepEqual(parseGenericRasterCoverage({spatial_coverage:{scope:'bbox',bbox:{west:170,south:-20,east:-170,north:20}}}),
  {scope:'bbox',west:170,south:-20,east:-170,north:20,antimeridian:true},'A legitimate WR antimeridian crossing must not be misreported as an invalid bbox');
assert.deepEqual(parseGenericRasterCoverage({spatial_coverage:{scope:'global'}}),{scope:'global'},'A verified global scope is distinct from a made-up world bbox');
for(const spatial_coverage of [
  {scope:'bbox',bbox:[5,47,16,56]}, {scope:'bbox',bbox:{west:5,east:5,south:47,north:56}},
  {scope:'bbox',bbox:{west:5,east:16,south:57,north:56}},
  {scope:'bbox',bbox:{west:Infinity,east:16,south:47,north:56}},
  {scope:'bbox',bbox:{west:5,east:181,south:47,north:56}}, {scope:'future_scope'},
  null
]){
  assert.equal(parseGenericRasterCoverage({spatial_coverage}),null,'Invalid or unsupported machine coverage must fail closed');
}

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
// WL-02: pending image tasks must wait for capacity, and queued cancels free slots.
const wl02Budget=createGenericRasterTileBudget({maxInFlight:2,maxQueued:4});
const wl02Started=[],wl02Tickets=[];
for(let i=0;i<4;i++)wl02Tickets.push(wl02Budget.request(()=>wl02Started.push(i)));
assert.equal(wl02Budget.request(()=>wl02Started.push(99)),null,'Queue overflow is bounded');
await Promise.resolve();
assert.deepEqual(wl02Started,[0,1],'No more than two image tasks may start');
wl02Budget.finish(wl02Tickets[3]); // cancel before any image request
wl02Budget.finish(wl02Tickets[0]);await Promise.resolve();
assert.deepEqual(wl02Started,[0,1,2],'Pending task begins after release');
wl02Budget.finish(wl02Tickets[1]);wl02Budget.finish(wl02Tickets[2]);await Promise.resolve();
assert.deepEqual(wl02Budget.snapshot(),{inFlight:0,queued:0,maxInFlight:2,maxQueued:4},'No leaked capacity on cancel/finish');
assert.throws(()=>createGenericRasterTileBudget({maxInFlight:0}),TypeError);
const wl02Source=await readFile(new URL('../frontend/modules/weather/layer-menu.js',import.meta.url),'utf8');
for(const token of ['GENERIC_TILE_BUDGET.request(', 'GENERIC_TILE_BUDGET.finish(ticket)', 'tile_queue_full','map!==this._map','noWrap:false','genericRasterViewportBbox(','const drawnTiles=new WeakSet()','drawnTiles.add(canvas)','drawnTiles.has(tile)','genericRasterCycleStatus({drawn,failed})','drawn_means:"canvas_draw_operation_not_pixel_verification"']){
  assert.ok(wl02Source.includes(token),'The live WL-02 canvas path must not treat clipped transparent tiles as drawn imagery: '+token);
}

assert.ok(wl02Source.includes('rasterTileUrl(payload.tile_url,coords)'),'WL-02 must use the existing canonical tile URL expansion for WMS and XYZ');
assert.ok(wl02Source.includes('rasterTileUrl(url,{x:0,y:0,z:0})'),'WL-02 must validate the complete raster template before creating a tile');
assert.ok(wl02Source.includes('maxNativeZoom:Math.min(maxZoom,18)'),'WL-02 must respect the established maximum canonical tile zoom');
for(const marker of [
  'GENERIC_REFRESH_MS=300000','state.pollTimer=setInterval(', 'clearInterval(state.pollTimer)',
  'document.visibilityState==="hidden"', 'weather-layer-legend-link',
  'safeLegendUrl(payload?.legend?.url)', 'rel="noopener noreferrer"'
])assert.ok(wl02Source.includes(marker),'WL-02 must retain bounded foreground refresh and an attributable touch-friendly legend: '+marker);

assert.equal(rasterTileUrl('https://example.invalid/{z}/{x}/{y}.png',{z:1,x:1,y:1}),'https://example.invalid/1/1/1.png');
const wl02WmsUrl=rasterTileUrl('https://example.invalid/wms?bbox={bbox-epsg-3857}',{z:0,x:0,y:0});
assert.ok(wl02WmsUrl.startsWith('https://example.invalid/wms?bbox='),'WR EPSG:3857 WMS tiles must be expandable without a new architecture');
assert.equal(wl02WmsUrl.includes('{bbox-epsg-3857}'),false,'No WMS placeholder may be passed through to the browser');
assert.throws(()=>rasterTileUrl('https://example.invalid/wms?bbox={unknown}',{z:0,x:0,y:0}),TypeError,'Unknown WMS tokens must fail closed');
const displayMenuSource=await readFile(new URL('../frontend/modules/weather/display-menu.js',import.meta.url),'utf8');
for(const marker of ['id:"weather.display-menu"','version:"0.4.19"','data-weather-display-eye="','_weatherDisplayBindPanelDrag','_weatherDisplayCancelDrag','lostpointercapture','lifecycleAbortHandler','incompatible','_weatherDisplayLegendMode','_weatherDisplaySetLegendMode','data-weather-display-legend-mode','WEATHER_DISPLAY_EYE_ASSETS','WEATHER_DISPLAY_STYLES','balanced','soft'])assert.ok(displayMenuSource.includes(marker),'WeatherRouter display menu contract missing: '+marker);
for(const marker of ['78ff501e77c7969ec69ec96e9149913692d4d53c4b800cf131090af32f582066','e92e2920cfe449c72b334989528b176c89c00dd2cbeb0354a60a7d05fcc21047','help-display-eye-open-master-1254.png','help-display-eye-closed-master-1254.png'])assert.ok(displayMenuSource.includes(marker),'Final WeatherRouter eye asset contract missing: '+marker);
assert.equal(displayMenuSource.includes('data-weather-display-eye-placeholder'),false,'Final WeatherRouter eye assets must replace the placeholder SVG');
for(const marker of ['precipitationStyleChanged','precipitationOpacityChanged','if(precipitationStyleChanged)this._weatherDisplayRefreshRenderedLayers();','_weatherDisplayOpacity','_weatherDisplaySetTransparency','_weatherDisplayResetTransparency','data-weather-display-transparency','weather-display-panel .weather-display-opacity','_weatherDisplayApplyRasterPaneStyle','pane.style.willChange=style==="precise"?"auto":"filter"','5.6*zoomFactor','saturate:1.18,contrast:1.34'])assert.ok(displayMenuSource.includes(marker),'WeatherRouter smoothing/transparency contract missing: '+marker);
assert.equal(displayMenuSource.includes('node.style.transform='),false,'WeatherRouter raster styling must not overwrite Leaflet tile transforms');
assert.equal(displayMenuSource.includes('transformOrigin'),false,'WeatherRouter raster styling must not set Leaflet tile transform origin');
const legendOverlaySource=await readFile(new URL('../frontend/modules/weather/legend-overlay.js',import.meta.url),'utf8');
for(const marker of ['id:"weather.legend-overlay"','version:"0.1.1"','_weatherLegendSetModel','_weatherLegendClear','_weatherLegendVisibleModels','_weatherLegendRenderVisual','weather-legend-overlay','weather-legend-header','width:min(430px','width:min(240px,100%)','data-weather-legend-hide','strict-origin-when-cross-origin'])assert.ok(legendOverlaySource.includes(marker),'WeatherRouter compact legend overlay contract missing: '+marker);
const precipitationSource=await readFile(new URL('../frontend/modules/weather/precipitation-layer.js',import.meta.url),'utf8');
for(const marker of ['version:"1.3.20"','_weatherLegendSetModel','_weatherLegendClear?.("precipitation")','legend?.entries','legend?.stops','semantics.unit','weather-legend-overlay','_weatherRadarNaturalOpacity','_weatherRadarEffectiveOpacity','_weatherRadarApplyDisplayOpacity','opacityOverride==null?effectiveOpacity','state.onZoom=()=>{this._weatherDisplayRefreshRenderedLayers?.();'])assert.ok(precipitationSource.includes(marker),'Precipitation legend/opacity/smoothing handoff missing: '+marker);
const layerMenuSource=await readFile(new URL('../frontend/modules/weather/layer-menu.js',import.meta.url),'utf8');
for(const marker of ['renderSignature','overflow-y:auto','overscroll-behavior:contain','scrollbar-gutter:stable','panel.addEventListener("wheel"','panel.addEventListener("touchmove"','weather-layer-back-slot','data-weather-layer-action="subcategory"','.weather-layer-view [data-weather-layer-entry-wrap]{display:none!important}','grid-template-columns:42px 1fr 42px','min-height:52px','width:calc(100% + 5px)','margin-right:-5px','padding-right:8px','.weather-layer-logo{width:27px;height:27px;justify-self:start']){
  assert.ok(layerMenuSource.includes(marker),'WeatherRouter Layer Hub must keep stable DOM and own its scrolling: '+marker);
}
const profiles=await import(new URL('../frontend/modules/weather/display-menu.js',import.meta.url));
for(const nativeZoom of [5,7,9]){
  const autoAtSix=profiles.weatherDisplayAutoRasterTuning(6,nativeZoom);
  assert.deepEqual(profiles.weatherDisplaySoftRasterTuning(6,nativeZoom),autoAtSix,
    'Weich muss im Ausgangszoom dem bisherigen Auto bei Zoom 6 entsprechen');
  assert.deepEqual(profiles.weatherDisplaySoftRasterTuning(8,nativeZoom),autoAtSix,
    'Weich bei Zoom 8 ist der abgenommene optische Referenzstand');
  const nine=profiles.weatherDisplaySoftRasterTuning(9,nativeZoom);
  const ten=profiles.weatherDisplaySoftRasterTuning(10,nativeZoom);
  if(autoAtSix.blur<48){
    assert.ok(nine.blur>autoAtSix.blur&&ten.blur>nine.blur,
      'Weich muss die Pixelvergroesserung ab Zoom 9 zunehmend glaetten');
  }else{
    assert.equal(nine.blur,autoAtSix.blur,'Schon sehr stark geglaettete Quellen bleiben begrenzt');
    assert.equal(ten.blur,autoAtSix.blur,'Nahzoom darf das Leistungsbudget nicht erhoehen');
  }
  assert.ok(ten.blur<=Math.max(48,autoAtSix.blur),
    'Leistungsschutz: Weich nie ueber das begrenzte Budget glaetten');
}
assert.deepEqual(profiles.weatherDisplaySoftRasterTuning(8,7).contrast,
  profiles.weatherDisplayAutoRasterTuning(6,7).contrast);
assert.ok(profiles.weatherDisplaySoftRasterTuning(10,7).blur<
  profiles.weatherDisplayAutoRasterTuning(10,7).blur,
  'Weich muss erkennbar weniger wolkig bleiben als Auto');
assert.ok(displayMenuSource.includes('state.onZoom=')===false ||
  displayMenuSource.includes('_weatherDisplayRefreshRenderedLayers'),
  'Rasterstil darf Zoom-Aktualisierung nicht entfernen');
const balancedAtNine=profiles.weatherDisplayBalancedRasterTuning(9,7);
assert.equal(balancedAtNine.blur,11.2,'Ausgewogen muss die bisherige Weich-Glättung übernehmen');
assert.equal(balancedAtNine.saturate,1.18);
assert.equal(balancedAtNine.contrast,1.34);
assert.ok(profiles.weatherDisplaySoftRasterTuning(9,7).blur>balancedAtNine.blur,
  'Weich muss stärker glätten als Ausgewogen');
assert.ok(profiles.weatherDisplayAutoRasterTuning(10,7).blur>profiles.weatherDisplayAutoRasterTuning(6,7).blur,
  'Auto muss weiterhin zoomabhängig sein');
console.log('PASS: WeatherRouter Consumer V1, missing/offline distinction, hierarchical Layer Hub, WR display-menu and generic legend overlay.');
