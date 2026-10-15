/*
 * P7-010 opt-in geographic raster-tile crop geometry.
 * Pure, unregistered preview helper. It does not download or draw images.
 * A future renderer may use the returned rectangles as Canvas source and
 * destination rectangles; never extend regional pixels beyond verified bounds.
 */
const MAX_LAT=85.05112878;
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
const finite=v=>typeof v==="number"&&Number.isFinite(v);
const mercY=lat=>{
 const p=clamp(lat,-MAX_LAT,MAX_LAT)*Math.PI/180;
 return (1-Math.log(Math.tan(Math.PI/4+p/2))/Math.PI)/2;
};
const valid=b=>b&&["west","east","south","north"].every(k=>finite(b[k]))
 &&b.west>=-180&&b.west<=180&&b.east>=-180&&b.east<=180
 &&b.south>=-90&&b.north<=90&&b.north>b.south&&b.west!==b.east;
const segments=b=>b.west<b.east?[[b.west,b.east]]:[[b.west,180],[-180,b.east]];
function cropRectangle(left,top,right,bottom){
 const x=clamp(left,0,1),y=clamp(top,0,1);
 const x2=clamp(right,0,1),y2=clamp(bottom,0,1);
 if(x2-x<1e-9||y2-y<1e-9)return null;
 return {left:x,top:y,width:x2-x,height:y2-y};
}
/**
 * @param {object} tile {x, y, z} EPSG:3857 tile coordinates, x may repeat world
 * @param {object} coverage {scope:"bbox",bbox:{...}} or VERIFIED global scope
 * @returns {Array<object>} crop rectangles in 0..1 tile fractions. Empty=hidden.
 */
export function rasterTileCropRectangles(tile,coverage){
 if(!tile||!Number.isInteger(tile.x)||!Number.isInteger(tile.y)
   ||!Number.isInteger(tile.z)||tile.z<0||tile.z>18)return [];
 const n=2**tile.z;
 if(tile.y<0||tile.y>=n)return [];
 if(!coverage||typeof coverage!=="object")return [];
 if(coverage.scope==="global"&&coverage.verified===true)
   return [{left:0,top:0,width:1,height:1}];
 if(coverage.scope!=="bbox"||coverage.verified!==true||!valid(coverage.bbox))
   return [];
 const b=coverage.bbox;
 const tileWest=-180+360*tile.x/n,tileEast=-180+360*(tile.x+1)/n;
 const top=mercY(b.north)*n-tile.y;
 const bottom=mercY(b.south)*n-tile.y;
 if(bottom<=0||top>=1||bottom<=top)return [];
 const rectangles=[];
 for(const [west,east] of segments(b)){
   // The requested map may repeat the world; compare nearby 360-degree shifts.
   const first=Math.floor((tileWest-east)/360);
   const last=Math.ceil((tileEast-west)/360);
   for(let shift=first;shift<=last;shift++){
     const left=Math.max(tileWest,west+360*shift);
     const right=Math.min(tileEast,east+360*shift);
     if(right<=left)continue;
     const rect=cropRectangle((left-tileWest)/(tileEast-tileWest),top,
       (right-tileWest)/(tileEast-tileWest),bottom);
     if(rect)rectangles.push(rect);
   }
 }
 return rectangles;
}

/** Expand each geographic crop into pixel coordinates for an existing tile. */
export function rasterTilePixelCrops(tile,coverage,tileSize=256){
 if(!Number.isInteger(tileSize)||tileSize<1||tileSize>2048)
   throw new RangeError("invalid tile size");
 return rasterTileCropRectangles(tile,coverage).map(rect=>({
   sx:rect.left*tileSize,sy:rect.top*tileSize,
   sw:rect.width*tileSize,sh:rect.height*tileSize,
 }));
}
