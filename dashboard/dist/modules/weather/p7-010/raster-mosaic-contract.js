/*
 * P7-010: isolated read-only WeatherRouter V2 raster response validation.
 * No provider scoring, spatial source selection or fallback routing in GR.
 * The live Consumer V1 client and precipitation renderer are unaffected.
 */
const number=n=>typeof n==="number"&&Number.isFinite(n);
const time=value=>typeof value==="string"&&/[zZ]$|[+-]\d\d:\d\d$/.test(value)
  &&Number.isFinite(Date.parse(value));
const bounds=b=>b&&["west","east","south","north"].every(k=>number(b[k]))
  &&b.west>=-180&&b.west<=180&&b.east>=-180&&b.east<=180
  &&b.south>=-90&&b.north<=90&&b.north>b.south&&b.west!==b.east;
const safeURL=value=>{
 if(typeof value!=="string"||!value.startsWith("https://"))return false;
 try{
   const u=new URL(value);
   if(u.protocol!=="https:"||!u.hostname||u.username||u.password||u.hash)return false;
   for(const key of u.searchParams.keys())
     if(["token","api_key","apikey","access_token","key","secret","password","authorization","appid"].includes(key.toLowerCase()))return false;
   return true;
 }catch(_){return false;}
};
// This is a narrowly bounded eligibility check for *older* satellite data,
// NOT a change of the reported spatial scope. WR must have verified the
// product-specific full-world coverage; a service-level/unchecked BBOX is
// never enough. No inference about actual nontransparent image pixels.
const fullWorldEnvelope=layer=>layer.coverage_scope==="global"
  ||(layer.coverage_scope==="bbox"
     &&layer.coverage_verified===true
     &&layer.coverage?.west===-180
     &&layer.coverage?.east===180
     &&layer.coverage?.south===-90
     &&layer.coverage?.north===90);
export function validateRasterMosaicV2(answer,{maxLayers=4,maxDataAgeSeconds=900,maxBackgroundAgeSeconds=null}={}){
 if(!Number.isInteger(maxLayers)||maxLayers<1||maxLayers>12
   ||!Number.isInteger(maxDataAgeSeconds)||maxDataAgeSeconds<1||maxDataAgeSeconds>86400
   ||(maxBackgroundAgeSeconds!==null&&(!Number.isInteger(maxBackgroundAgeSeconds)
       ||maxBackgroundAgeSeconds<maxDataAgeSeconds||maxBackgroundAgeSeconds>86400)))
   throw new TypeError("Invalid mosaic resource budget");
 if(!answer||answer.contract_version!==2
  ||answer.capability!=="weather.precipitation.layer"
  ||!["ready","partial","unavailable"].includes(answer.status)
  ||!bounds(answer.viewport)||!Array.isArray(answer.layers)
  ||answer.layers.length>maxLayers)
   throw new TypeError("Invalid or over-budget V2 raster mosaic");
 if(answer.reference_time!==undefined&&answer.reference_time!==null
  &&!time(answer.reference_time))throw new TypeError("Invalid mosaic reference time");
 if(answer.status==="unavailable"&&answer.layers.length)
   throw new TypeError("Unavailable mosaic cannot contain active layers");
 const seen=new Set();
 for(const layer of answer.layers){
   if(!layer||typeof layer.source_id!=="string"||!layer.source_id
      ||seen.has(layer.source_id)||layer.resource_type!=="raster_tile"
      ||layer.coverage_verified!==true
      ||!["bbox","global"].includes(layer.coverage_scope)
      ||!bounds(layer.coverage)||!safeURL(layer.tile_url)
      ||typeof layer.attribution!=="string"||!layer.attribution
      ||!layer.render||![128,256,512].includes(layer.render.tile_size)
      ||!number(layer.render.min_zoom)||!number(layer.render.max_zoom)
      ||layer.render.min_zoom<0||layer.render.max_zoom>24
      ||layer.render.min_zoom>layer.render.max_zoom
      ||!number(layer.render.opacity)||layer.render.opacity<0||layer.render.opacity>1
      ||!layer.legend||typeof layer.legend!=="object"
      ||!layer.semantics||!["quantity","measurement_method","observation_kind"]
          .every(k=>typeof layer.semantics[k]==="string"&&layer.semantics[k])
      ||!("unit" in layer.semantics)
      ||!(layer.semantics.unit===null||(typeof layer.semantics.unit==="string"
          &&layer.semantics.unit.length>0))
      ||!layer.times||!time(layer.times.valid_at)
      ||!time(layer.times.retrieved_at)
      ||!number(layer.times.reference_delta_seconds)
      ||layer.times.reference_delta_seconds<0
      ||(layer.times.observed_at!==undefined&&layer.times.observed_at!==null&&!time(layer.times.observed_at))
      ||(layer.times.age_seconds!==undefined&&(!number(layer.times.age_seconds)||layer.times.age_seconds<0))
      ||(layer.freshness_class!==undefined&&!["current","older_background"].includes(layer.freshness_class))
      ||(layer.quality_note!==undefined&&typeof layer.quality_note!=="string")
      ||(layer.freshness_class==="older_background"&&(
         maxBackgroundAgeSeconds===null
         ||!fullWorldEnvelope(layer)
         ||layer.semantics.observation_kind!=="estimate"
         ||!["satellite_precipitation_estimate","satellite_estimate"].includes(layer.semantics.measurement_method)
         ||layer.quality_note!=="older_satellite_background"
         ||!number(layer.times.age_seconds)
         ||layer.times.age_seconds<=maxDataAgeSeconds
         ||layer.times.age_seconds>maxBackgroundAgeSeconds)))
     throw new TypeError("Invalid, unverified or unsafe raster source");
   seen.add(layer.source_id);
 }
 return answer;
}
