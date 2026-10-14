/*
 * P7-010: pure, optional multi-source raster plan.
 * NOT connected to the WeatherRouter V1 resolve endpoint or active renderer.
 * Provider selection will ultimately be owned by a versioned WR endpoint.
 * This unit only proves geographic and temporal composition invariants.
 */
const finite=n=>typeof n==="number"&&Number.isFinite(n);
const clamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
const meridian=lat=>Math.log(Math.tan(Math.PI/4+clamp(lat,-85.05112878,85.05112878)*Math.PI/360));
const segments=b=>b.west<=b.east?[[b.west,b.east]]:[[b.west,180],[-180,b.east]];

export function validMosaicBounds(bounds){
  return Boolean(bounds&&["west","east","south","north"].every(k=>finite(bounds[k]))
    &&bounds.west>=-180&&bounds.west<=180&&bounds.east>=-180&&bounds.east<=180
    &&bounds.south>=-90&&bounds.north<=90&&bounds.north>bounds.south
    &&segments(bounds).some(([w,e])=>e>w));
}

export function viewportOverlapFraction(viewport,coverage){
  if(!validMosaicBounds(viewport))throw new TypeError("Invalid viewport");
  if(coverage?.scope==="global")return 1;
  if(coverage?.scope!=="bbox"||!validMosaicBounds(coverage.bbox))return 0;
  const v=viewport,c=coverage.bbox;
  const north=Math.min(v.north,c.north),south=Math.max(v.south,c.south);
  if(north<=south)return 0;
  const height=meridian(north)-meridian(south);
  const viewHeight=meridian(v.north)-meridian(v.south);
  const width=b=>segments(b).reduce((sum,[w,e])=>sum+e-w,0);
  let overlap=0;
  for(const [vw,ve] of segments(v))for(const [cw,ce] of segments(c)){
    overlap+=Math.max(0,Math.min(ve,ce)-Math.max(vw,cw));
  }
  return clamp((overlap*height)/(width(v)*viewHeight),0,1);
}

function validTime(value){
  if(typeof value!=="string")return null;
  const ms=Date.parse(value);
  return Number.isFinite(ms)&&/Z$|[+-]\d\d:\d\d$/.test(value)?ms:null;
}
function usable(candidate,viewport,nowMs,maxAgeMs){
  if(!candidate||candidate.verified_coverage!==true||candidate.eligible!==true
    ||candidate.resource_type!=="raster_tile"||!candidate.source_id
    ||!candidate.attribution||!candidate.legend||!candidate.semantics)return null;
  if(typeof candidate.semantics.quantity!=="string"||!candidate.semantics.unit)return null;
  const fraction=viewportOverlapFraction(viewport,candidate.coverage);
  if(fraction<=0)return null;
  const timeMs=validTime(candidate.valid_at);
  // An unknown data time cannot satisfy a freshness guarantee.
  if(timeMs===null||timeMs>nowMs||nowMs-timeMs>maxAgeMs)return null;
  return {candidate,fraction,timeMs};
}

/*
 * Strictly excludes stale, unverified, non-raster candidates before ordering.
 * A broad layer is picked first, followed by local detail layers on their own
 * verified coverage. Distinct quantities/units remain separate; never blend.
 * The frontend still needs clipping and individual legends. No network calls.
 */
export function planRasterMosaic(candidates,{viewport,now,maxAgeMs,maxLayers=4,referenceTime=null}={}){
  if(!validMosaicBounds(viewport))throw new TypeError("Invalid viewport");
  const nowMs=validTime(now),targetMs=referenceTime===null?null:validTime(referenceTime);
  if(nowMs===null||!finite(maxAgeMs)||maxAgeMs<=0||!Number.isInteger(maxLayers)
    ||maxLayers<1||maxLayers>12||(referenceTime!==null&&targetMs===null))
    throw new TypeError("Invalid bounded plan parameters");
  if(!Array.isArray(candidates))throw new TypeError("Candidates must be an array");
  const rejected=[];
  const allowed=[];
  for(const c of candidates){
    const row=usable(c,viewport,nowMs,maxAgeMs);
    if(row)allowed.push(row);
    else rejected.push({source_id:c?.source_id??null,reason:"not_verified_fresh_raster_or_no_overlap"});
  }
  allowed.sort((a,b)=>b.fraction-a.fraction||b.timeMs-a.timeMs
    ||String(a.candidate.source_id).localeCompare(String(b.candidate.source_id)));
  const selected=allowed.slice(0,maxLayers);
  const omitted=allowed.slice(maxLayers);
  for(const x of omitted)rejected.push({source_id:x.candidate.source_id,reason:"resource_limit"});
  const reference=targetMs??(selected.length?Math.max(...selected.map(x=>x.timeMs)):null);
  const first=selected[0]?.candidate;
  return {
    contract_version:2,
    status:selected.length?"partial":"unavailable",
    reference_time:reference===null?null:new Date(reference).toISOString(),
    layers:selected.map((x,index)=>({
      source_id:x.candidate.source_id,
      role:index===0?"broad_foundation":"regional_overlay",
      coverage:x.candidate.coverage,
      overlap_fraction:x.fraction,
      valid_at:new Date(x.timeMs).toISOString(),
      reference_delta_seconds:reference===null?null:Math.abs(reference-x.timeMs)/1000,
      time_aligned:reference!==null&&reference===x.timeMs,
      semantics:x.candidate.semantics,
      attribution:x.candidate.attribution,
      legend:x.candidate.legend,
      method_compatible_with_foundation:!first||(
        x.candidate.semantics.quantity===first.semantics.quantity
        &&x.candidate.semantics.unit===first.semantics.unit
        &&x.candidate.semantics.measurement_method===first.semantics.measurement_method
      )
    })),
    // Conservative: area-union verification remains a separate future gate.
    coverage_complete_proven:false,
    rejected
  };
}
