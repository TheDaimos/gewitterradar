/*
 * P7-010: optional bridge from WeatherRouter Consumer V2 to Leaflet.
 *
 * No automatic map activation. The active V1 precipitation layer must remain
 * in place unless the caller explicitly installs a successfully prepared V2
 * result. Failed/unsupported V2 requests return "fallback" instead of
 * removing a working radar layer.
 */
import {validateRasterMosaicV2} from "./raster-mosaic-contract.js?v=41191r1";
import {createRasterMosaicGridLayer} from "./raster-mosaic-grid-layer.js?v=41198r1";

const finite=n=>typeof n==="number"&&Number.isFinite(n);

function validViewport(b){
 return b&&["west","south","east","north"].every(k=>finite(b[k]))
   &&b.west>=-180&&b.west<=180&&b.east>=-180&&b.east<=180
   &&b.south>=-90&&b.north<=90&&b.north>b.south
   &&b.west!==b.east;
}

/** Build one request using a pre-normalized map viewport (incl. full world). */
export function buildRasterMosaicV2Request({
 viewport,focus,maxLayers=4,maxTileRequests=48,
 maxDataAgeSeconds=900,maxBackgroundAgeSeconds=null,maxTimeDeltaSeconds=180,
 profileId=null,consumerId="gewitterradar",correlationId=null,sourceRequest=null
}={}){
 if(sourceRequest!==null&&(sourceRequest?.provider_id!=="opera"||sourceRequest?.product_id!=="RATE"||Object.keys(sourceRequest).length!==2||maxDataAgeSeconds>900)) throw new TypeError("Unsupported OPERA source");
 if(!validViewport(viewport)
   ||!focus||!finite(focus.latitude)||!finite(focus.longitude)
   ||focus.latitude< -90||focus.latitude>90
   ||focus.longitude< -180||focus.longitude>180
   ||!Number.isInteger(maxLayers)||maxLayers<1||maxLayers>12
   ||!Number.isInteger(maxTileRequests)
   ||maxTileRequests<1||maxTileRequests>256
   ||!Number.isInteger(maxDataAgeSeconds)
   ||maxDataAgeSeconds<1||maxDataAgeSeconds>86400
   ||(maxBackgroundAgeSeconds!==null&&(!Number.isInteger(maxBackgroundAgeSeconds)
      ||maxBackgroundAgeSeconds<maxDataAgeSeconds||maxBackgroundAgeSeconds>86400))
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
     ...(maxBackgroundAgeSeconds!==null?{max_background_age_seconds:maxBackgroundAgeSeconds}:{}),
     max_time_delta_seconds:maxTimeDeltaSeconds},
   limits:{max_layers:maxLayers,max_tile_requests:maxTileRequests},
   ...(profileId!==null?{profile_id:profileId}:{}),
   ...(sourceRequest!==null?{source_request:{provider_id:"opera",product_id:"RATE"}}:{}),
   consumer_id:consumerId,
   ...(correlationId?{correlation_id:correlationId}:{}),
 };
}

/**
 * @returns {Promise<object>} {mode:"v2",layer,response} or
 *   {mode:"fallback",reason} – the caller must retain its working V1 layer.
 * The V2 request never accepts any client-chosen provider list.
 */
export async function prepareRasterMosaicV2({
 callWS,Leaflet,viewport,focus,profileId=null,
 maxLayers=4,maxTileRequests=48,maxDataAgeSeconds=900,
 maxBackgroundAgeSeconds=null,maxTimeDeltaSeconds=180,layerOptions={},consumerId="gewitterradar",correlationId=null,sourceRequest=null,onDiagnostic=null
}={}){
 const request=buildRasterMosaicV2Request({
   viewport,focus,profileId,maxLayers,maxTileRequests,
   maxDataAgeSeconds,maxBackgroundAgeSeconds,maxTimeDeltaSeconds,consumerId,correlationId,sourceRequest,
 });
 if(typeof callWS!=="function"||!Leaflet?.GridLayer?.extend)
   throw new TypeError("WeatherRouter WebSocket and Leaflet required");
 let stage="transport";
 try{
   onDiagnostic?.({phase:"request",status:"sent",correlation_id:correlationId});
   const response=await callWS(request);
   onDiagnostic?.({phase:"response",status:String(response?.status||"missing"),layers:Array.isArray(response?.layers)?response.layers.length:null,correlation_id:correlationId});
   if(sourceRequest!==null){
     const identityOk=response?.source_request?.provider_id==="opera"
       &&response?.source_request?.product_id==="RATE"
       &&response?.provider_id==="opera"&&response?.product_id==="RATE"
       &&response?.correlation_id===correlationId;
     const reason=!identityOk?"opera_identity_mismatch":
       response?.raster_approved===true?"opera_positive_raster_not_yet_supported":
       response?.status==="disabled"?"provider_disabled":
       response?.status==="active_blocked"?"opera_raster_not_scientifically_approved":
       "opera_unverified_response";
     onDiagnostic?.({phase:"opera_status",status:String(response?.status||"invalid"),
       provider_id:"opera",product_id:"RATE",block_reason:String(response?.block_reason||reason),
       raster_approved:response?.raster_approved===true,correlation_id:correlationId});
     return {mode:"opera_blocked",reason,status:response?.status||"invalid",
       blockReason:response?.block_reason||reason,rasterApproved:false,
       providerId:"opera",productId:"RATE",fallbackPerformed:false};
   }
   stage="contract_validation";
   validateRasterMosaicV2(response,{maxLayers,maxDataAgeSeconds,maxBackgroundAgeSeconds});
   onDiagnostic?.({
     phase:"validated",status:response.status,layers:response.layers.length,
     time_deviating:response.layers.some(layer=>layer.quality_note==="zeitlich_abweichend"),
     older_background_count:response.layers.filter(layer=>layer.freshness_class==="older_background").length,
     freshness_classes:response.layers.slice(0,12).map(layer=>({
       source_id:layer.source_id,freshness_class:layer.freshness_class||"unknown",
       age_seconds:layer.times?.age_seconds??null,
       valid_at:layer.times?.valid_at||null,
       quality_note:layer.quality_note||null,
       measurement_method:layer.semantics?.measurement_method||null
     })),
     source_ids:response.layers.map(layer=>layer.source_id).slice(0,12),
     limitations_count:Array.isArray(response.limitations)?response.limitations.length:0,
     limitations:Array.isArray(response.limitations)?response.limitations.slice(0,8).filter(x=>typeof x==="string").map(x=>x.slice(0,180)):[]
   });
   if(response.status==="unavailable"||response.layers.length===0){
     onDiagnostic?.({phase:"unavailable",status:response.status,layers:0});
     return {mode:"fallback",reason:"no_usable_mosaic_source",responseStatus:response.status};
   }
   stage="layer_preparation";
   const layer=createRasterMosaicGridLayer(Leaflet,response,{
     ...layerOptions,maxLayers,maxTileRequests,maxDataAgeSeconds,maxBackgroundAgeSeconds
   });
   onDiagnostic?.({phase:"layer_prepared",status:response.status,layers:response.layers.length});
   return {mode:"v2",layer,response};
 }catch(error){
   const code=typeof error?.code==="string"?error.code:"";
   const reason=stage==="transport"?"websocket_or_contract":stage==="contract_validation"?"validation_or_render":"layer_preparation_failed";
   onDiagnostic?.({phase:stage,status:"error",error_code:code||error?.name||"unknown",correlation_id:correlationId});
   return {mode:"fallback",reason,errorCode:code||error?.name||"unknown"};
 }
}
