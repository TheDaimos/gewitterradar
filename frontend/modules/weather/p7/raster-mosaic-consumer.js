/*
 * P7-010: optional bridge from WeatherRouter Consumer V2 to Leaflet.
 *
 * No automatic map activation. The active V1 precipitation layer must remain
 * in place unless the caller explicitly installs a successfully prepared V2
 * result. Failed/unsupported V2 requests return "fallback" instead of
 * removing a working radar layer.
 */
import {validateRasterMosaicV2} from "./raster-mosaic-contract.js";
import {createRasterMosaicGridLayer} from "./raster-mosaic-grid-layer.js";

const finite=n=>typeof n==="number"&&Number.isFinite(n);

function validViewport(b){
 return b&&["west","south","east","north"].every(k=>finite(b[k]))
   &&b.west>=-180&&b.west<=180&&b.east>=-180&&b.east<=180
   &&b.south>=-90&&b.north<=90&&b.north>b.south
   &&b.west!==b.east;
}

/** Build one request using a pre-normalized map viewport (incl. full world). */
export function buildRasterMosaicV2Request({
 viewport,focus,maxLayers=12,maxTileRequests=48,
 maxDataAgeSeconds=900,maxTimeDeltaSeconds=180,
 profileId=null
}={}){
 if(!validViewport(viewport)
   ||!focus||!finite(focus.latitude)||!finite(focus.longitude)
   ||focus.latitude< -90||focus.latitude>90
   ||focus.longitude< -180||focus.longitude>180
   ||!Number.isInteger(maxLayers)||maxLayers<1||maxLayers>12
   ||!Number.isInteger(maxTileRequests)
   ||maxTileRequests<1||maxTileRequests>256
   ||!Number.isInteger(maxDataAgeSeconds)
   ||maxDataAgeSeconds<1||maxDataAgeSeconds>86400
   ||!Number.isInteger(maxTimeDeltaSeconds)
   ||maxTimeDeltaSeconds<0||maxTimeDeltaSeconds>86400
   ||(profileId!==null&&(typeof profileId!=="string"||!profileId.trim())))
   throw new TypeError("Invalid bounded V2 raster mosaic context");
 return {
   type:"weather_router/consumer/resolve_mosaic",
   contract_version:2,
   capability:"weather.precipitation.layer",
   context:{type:"bbox",...viewport,focus},
   time:{mode:"latest_coherent",
     max_data_age_seconds:maxDataAgeSeconds,
     max_time_delta_seconds:maxTimeDeltaSeconds},
   limits:{max_layers:maxLayers,max_tile_requests:maxTileRequests},
   ...(profileId!==null?{profile_id:profileId}:{}),
 };
}

/**
 * @returns {Promise<object>} {mode:"v2",layer,response} or
 *   {mode:"fallback",reason} – the caller must retain its working V1 layer.
 * The V2 request never accepts any client-chosen provider list.
 */
export async function prepareRasterMosaicV2({
 callWS,Leaflet,viewport,focus,profileId=null,
 maxLayers=12,maxTileRequests=48,maxDataAgeSeconds=900,
 maxTimeDeltaSeconds=180,layerOptions={}
}={}){
 const request=buildRasterMosaicV2Request({
   viewport,focus,profileId,maxLayers,maxTileRequests,
   maxDataAgeSeconds,maxTimeDeltaSeconds,
 });
 if(typeof callWS!=="function"||!Leaflet?.GridLayer?.extend)
   throw new TypeError("WeatherRouter WebSocket and Leaflet required");
 try{
   const response=await callWS(request);
   validateRasterMosaicV2(response,{maxLayers});
   if(response.status==="unavailable"||response.layers.length===0)
     return {mode:"fallback",reason:"no_usable_mosaic_source"};
   const layer=createRasterMosaicGridLayer(Leaflet,response,{
     ...layerOptions,maxLayers,maxTileRequests
   });
   return {mode:"v2",layer,response};
 }catch(_){
   return {mode:"fallback",reason:"v2_unavailable_or_invalid"};
 }
}
