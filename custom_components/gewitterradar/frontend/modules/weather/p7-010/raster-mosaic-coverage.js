/* P7-010: conservative geographic and drawn-pixel-geometry coverage audits.
 * A bounding box proves only a geographic envelope, NOT nontransparent
 * precipitation pixels or a provider's undisclosed NoData mask.
 * No source ranking, live HTTP or provider-specific special cases.
 */
const finite=n=>typeof n==="number"&&Number.isFinite(n);
const clamp=(n,low,high)=>Math.max(low,Math.min(high,n));

function unionArea(rectangles){
  if(!rectangles.length)return 0;
  const xs=[...new Set(rectangles.flatMap(r=>[r.x0,r.x1]))].sort((a,b)=>a-b);
  let area=0;
  for(let i=1;i<xs.length;i++){
    const low=xs[i-1],high=xs[i];
    if(high<=low)continue;
    const ys=rectangles.filter(r=>r.x0<high&&r.x1>low)
      .map(r=>[r.y0,r.y1]).sort((a,b)=>a[0]-b[0]);
    let ylow=null,yhigh=null;
    for(const [start,end] of ys){
      if(ylow===null){ylow=start;yhigh=end;continue;}
      if(start<=yhigh)yhigh=Math.max(yhigh,end);
      else{area+=(high-low)*(yhigh-ylow);ylow=start;yhigh=end;}
    }
    if(ylow!==null)area+=(high-low)*(yhigh-ylow);
  }
  return area;
}

function segments(bounds){
  if(!bounds||!["west","east","south","north"].every(k=>finite(bounds[k]))
    ||bounds.south>=bounds.north||bounds.west===bounds.east)return [];
  return bounds.west<bounds.east?
    [[bounds.west,bounds.east]]:
    [[bounds.west,180],[-180,bounds.east]];
}

/** Union of verified geographic envelopes across the requested viewport.
 * full_viewport merely asserts geometry, never provider pixel availability.
 */
export function measureRasterViewportCoverage(layers,viewport,zoom=0){
  const views=segments(viewport),height=viewport?.north-viewport?.south;
  if(!views.length||!finite(height)||height<=0||!Array.isArray(layers))
    return {fraction:0,complete:false,covered_sources:0,geometric_only:true};
  let total=0,covered=0,used=new Set();
  for(const [vw,ve] of views){
    const width=ve-vw;
    total+=width*height;
    const rectangles=[];
    for(const layer of layers){
      if(layer?.coverage_verified!==true||!layer.render
         ||layer.render.opacity<=0||zoom<layer.render.min_zoom)continue;
      const source=segments(layer.coverage);
      if(layer.coverage_scope==="global"&&!source.length)continue;
      if(!["global","bbox"].includes(layer.coverage_scope))continue;
      const south=Math.max(viewport.south,layer.coverage.south);
      const north=Math.min(viewport.north,layer.coverage.north);
      if(north<=south)continue;
      for(const [sw,se] of source){
        const west=Math.max(vw,sw),east=Math.min(ve,se);
        if(east>west){rectangles.push({x0:west,x1:east,y0:south,y1:north});used.add(layer.source_id);}
      }
    }
    covered+=unionArea(rectangles);
  }
  const fraction=total>0?clamp(covered/total,0,1):0;
  return {fraction,complete:fraction>=1-1e-9,covered_sources:used.size,geometric_only:true};
}

/** Union of genuinely drawn destination crop rectangles inside a canvas tile. */
export function measureRasterTileCoverage(rectangles,tileSize=256){
  if(!finite(tileSize)||tileSize<=0||!Array.isArray(rectangles))
    return {fraction:0,complete:false,geometric_only:true};
  const clipped=[];
  for(const r of rectangles){
    if(!r||![r.sx,r.sy,r.sw,r.sh].every(finite))continue;
    const x0=clamp(r.sx,0,tileSize),y0=clamp(r.sy,0,tileSize);
    const x1=clamp(r.sx+r.sw,0,tileSize),y1=clamp(r.sy+r.sh,0,tileSize);
    if(x1>x0&&y1>y0)clipped.push({x0,y0,x1,y1});
  }
  const fraction=clamp(unionArea(clipped)/(tileSize*tileSize),0,1);
  return {fraction,complete:fraction>=1-1e-6,geometric_only:true};
}
