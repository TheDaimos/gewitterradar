/* Raster validity is supplied by WeatherRouter, independently of WMS colors. */
const DWD_RADAR="dwd/radar_precipitation";
const OPERA_RATE="opera/opera_rate_raster";
const MAX_CELLS=2_000_000;
const cache=new WeakMap();
let lastDecoded;

export function validateDwdFrameMask(layer){
 const mask=layer.dwd_nodata_mask;
 if(mask===undefined)return;
 const validAt=Date.parse(mask?.valid_at);
 if(layer.source_id!==DWD_RADAR||mask?.kind!=="dwd_wcs_nodata_v1"||
    !Number.isFinite(validAt)||validAt!==Date.parse(layer.times.valid_at)||validAt!==Date.parse(mask.reference_at)||
    ![mask.width,mask.height].every(n=>Number.isInteger(n)&&n>=1&&n<=4096)||
    mask.width*mask.height>MAX_CELLS||!Array.isArray(mask.bounds)||mask.bounds.length!==4||
    !mask.bounds.every(Number.isFinite))throw new TypeError("Invalid WR DWD validity mask");
 const [west,south,east,north]=mask.bounds;
 const expected=Math.ceil(mask.width*mask.height/8);
 const url=new URL(layer.tile_url);
 if(west< -180||east>180||west>=east||south< -85.052||north>85.052||south>=north||
    !["maps.dwd.de","brz-maps.dwd.de"].includes(url.hostname)||url.pathname!=="/geoserver/dwd/wms"||
    url.searchParams.get("layers")!=="Niederschlagsradar"||
    Date.parse(url.searchParams.get("time"))!==validAt||Date.parse(url.searchParams.get("dim_reference_time"))!==validAt||
    typeof mask.bits!=="string"||mask.bits.length!==4*Math.ceil(expected/3)||
    !/^[A-Za-z0-9+/]+={0,2}$/.test(mask.bits)||atob(mask.bits).length!==expected)
  throw new TypeError("Invalid WR DWD mask grid or frame");
}

export function bindDwdFrameMask(layers){
 const mask=layers.find(layer=>layer.source_id===DWD_RADAR)?.dwd_nodata_mask;
 if(!mask)return layers;
 return layers.map(layer=>layer.source_id===OPERA_RATE?{...layer,_p7DwdNoData:mask}:layer);
}

function decodedMask(mask){
 let state=cache.get(mask);
 if(state)return state;
 if(lastDecoded?.mask.valid_at===mask.valid_at&&lastDecoded.mask.width===mask.width&&
    lastDecoded.mask.height===mask.height&&lastDecoded.mask.bounds.every((value,index)=>value===mask.bounds[index])&&
    lastDecoded.mask.bits===mask.bits){
  cache.set(mask,lastDecoded.state);
  return lastDecoded.state;
 }
 const {width,height}=mask;
 const bytes=atob(mask.bits),stride=width+1;
 const sums=new Uint32Array(stride*(height+1));
 for(let y=0;y<height;y++){
  let row=0;
  for(let x=0;x<width;x++){
   const bit=y*width+x;
   row+=(bytes.charCodeAt(bit>>3)>>(bit&7))&1;
   sums[(y+1)*stride+x+1]=row+sums[y*stride+x+1];
  }
 }
 state={sums,stride,tiles:new Map()};
 cache.set(mask,state);
 lastDecoded={mask,state};
 return state;
}

const latitude=y=>Math.atan(Math.sinh(Math.PI*(1-2*y)))*180/Math.PI;
const interval=(start,end,limit)=>{
 const first=Math.floor(start+1e-9),last=Math.ceil(end-1e-9);
 return first>=0&&last<=limit&&last>first?[first,last]:null;
};

/** Map destination pixel footprints to the native grid. A mixed cell stays protected. */
export function dwdNoDataRows(mask,tile,size){
 const world=2**tile.z,x=((tile.x%world)+world)%world;
 const [west,south,east,north]=mask.bounds;
 const lonEdge=i=>(x+i/size)/world*360-180;
 const latEdge=i=>latitude((tile.y+i/size)/world);
 if(lonEdge(size)<=west||lonEdge(0)>=east||latEdge(0)<=south||latEdge(size)>=north)return [];
 const state=decodedMask(mask),key=tile.z+"/"+x+"/"+tile.y+"/"+size;
 if(state.tiles.has(key))return state.tiles.get(key);
 const {sums,stride}=state;
 const nativeX=i=>(lonEdge(i)-west)*mask.width/(east-west);
 const nativeY=i=>(north-latEdge(i))*mask.height/(north-south);
 const columns=Array.from({length:size},(_,i)=>interval(nativeX(i),nativeX(i+1),mask.width));
 const rows=Array.from({length:size},()=>[]);
 for(let y=0;y<size;y++){
  const vertical=interval(nativeY(y),nativeY(y+1),mask.height);
  if(!vertical)continue;
  const [top,bottom]=vertical;
  let start=null;
  for(let i=0;i<=size;i++){
   const pair=columns[i];
   let empty=false;
   if(pair){
    const [left,right]=pair;
    const count=sums[bottom*stride+right]-sums[bottom*stride+left]-sums[top*stride+right]+sums[top*stride+left];
    empty=count===(bottom-top)*(right-left);
   }
   if(empty&&start===null)start=i;
   if(!empty&&start!==null){rows[y].push([start,i]);start=null;}
  }
 }
 if(state.tiles.size>=96)state.tiles.delete(state.tiles.keys().next().value);
 state.tiles.set(key,rows);
 return rows;
}
