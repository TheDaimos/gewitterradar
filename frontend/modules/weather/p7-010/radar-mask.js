/* Execute WR observation grants. No inference from weather pixels or GR age policy. */
import {rasterTilePixelCrops} from './raster-tile-clip.js?v=41188r1';
const decoded=new WeakMap();
const box=b=>b&&['west','east','south','north'].every(k=>Number.isFinite(b[k]))&&b.west>=-180&&b.west<=180&&b.east>=-180&&b.east<=180&&b.south>=-90&&b.north<=90&&b.north>b.south&&b.west!==b.east;
export function validateExclusions(items){
 if(!Array.isArray(items)||items.length>12||items.some(b=>b?.scope!=='global'&&(b?.scope!=='bbox'||!box(b.bbox))))throw new TypeError('Invalid WR exclusion envelopes');
}
export function validateRadarMask(mask){
 if(!mask||mask.kind!=='radar_observation_mask_v1'||!Number.isInteger(mask.zoom)||mask.zoom<0||mask.zoom>6||mask.size!==128||mask.encoding!=='base64_lsb'||typeof mask.unknown!=='boolean'||!Array.isArray(mask.tiles)||mask.tiles.length>256)throw new TypeError('Invalid WR observation mask');
 validateExclusions(mask.exclusions);
 if(mask.valid_until!==null&&!Number.isFinite(Date.parse(mask.valid_until)))throw new TypeError('Invalid WR mask expiry');
 const keys=new Set();
 for(const t of mask.tiles){
  const key=t.x+'/'+t.y;
  if(![t.x,t.y].every(v=>Number.isInteger(v)&&v>=0&&v<2**mask.zoom)||keys.has(key)||typeof t.bits!=='string'||t.bits.length!==2732||!/^[A-Za-z0-9+/]+=$/.test(t.bits))throw new TypeError('Invalid WR mask tile');
  keys.add(key);
  if(!decoded.has(t)){const bytes=Uint8Array.from(atob(t.bits),c=>c.charCodeAt(0));if(bytes.length!==2048)throw new TypeError('Invalid WR bitmap length');decoded.set(t,bytes);}
 }
 if(mask.opera!==null&&(!mask.opera||!/^[a-f0-9]{64}$/.test(mask.opera.generation)||!Number.isFinite(Date.parse(mask.opera.valid_at))||mask.opera.orientation!=='north_first'))throw new TypeError('Invalid WR mask generation');
}
export function validateSourcePlan(plan){
 if(plan===undefined)return;
 if(plan?.kind!=='source_tiles_v1'||!Number.isInteger(plan.zoom)||plan.zoom<0||plan.zoom>18||typeof plan.plan_complete!=='boolean'||!Array.isArray(plan.tiles)||plan.tiles.length>256||plan.padding_factor!==1.3||plan.tiles.some(t=>!Array.isArray(t)||t.length!==2||!t.every(v=>Number.isInteger(v)&&v>=0&&v<2**plan.zoom))||new Set(plan.tiles.map(t=>t.join('/'))).size!==plan.tiles.length)throw new TypeError('Invalid WR source plan');
}
export function plannedSourceTiles(source,tile){
 const p=source.raster_plan||source.spatial_policy;if(!p)return null;
 const world=2**tile.z,x=((tile.x%world)+world)%world;if(tile.y<0||tile.y>=world)return [];
 if(tile.z>=p.zoom){const scale=2**(tile.z-p.zoom),sx=Math.floor(x/scale),sy=Math.floor(tile.y/scale);return p.tiles.some(t=>t[0]===sx&&t[1]===sy)?[{x:sx,y:sy,z:p.zoom}]:[];}
 const scale=2**(p.zoom-tile.z);return p.tiles.filter(([sx,sy])=>Math.floor(sx/scale)===x&&Math.floor(sy/scale)===tile.y).map(([x,y])=>({x,y,z:p.zoom}));
}
export function protectedRasterRects(layer,tile,size=256){
 const mask=layer.spatial_policy?.radar_mask,rects=[];
 for(const exclusion of [...(layer.draw_exclusions||[]),...(mask?.exclusions||[])])for(const r of rasterTilePixelCrops(tile,{...exclusion,verified:true},size)){
  const l=Math.floor(r.sx),t=Math.floor(r.sy);rects.push({sx:l,sy:t,sw:Math.ceil(r.sx+r.sw)-l,sh:Math.ceil(r.sy+r.sh)-t});
 }
 if(!mask)return rects;
 if(mask.unknown||(mask.valid_until&&Date.now()>=Date.parse(mask.valid_until)))return [{sx:0,sy:0,sw:size,sh:size}];
 const world=2**tile.z,cx=((tile.x%world)+world)%world,scale=2**(tile.z-mask.zoom)*size/128;
 for(const t of mask.tiles){
  const left=(t.x*2**(tile.z-mask.zoom)-cx)*size,top=(t.y*2**(tile.z-mask.zoom)-tile.y)*size;
  if(left>=size||left+128*scale<=0||top>=size||top+128*scale<=0)continue;
  const bytes=decoded.get(t)||Uint8Array.from(atob(t.bits),c=>c.charCodeAt(0));decoded.set(t,bytes);
  const x0=Math.max(0,Math.floor(-left/scale)),x1=Math.min(128,Math.ceil((size-left)/scale));
  const y0=Math.max(0,Math.floor(-top/scale)),y1=Math.min(128,Math.ceil((size-top)/scale));
  for(let y=y0;y<y1;y++){
   let start=null;
   for(let x=x0;x<=x1;x++){
    const bit=x<x1&&((bytes[(y*128+x)>>3]>>(x&7))&1);
    if(bit&&start===null)start=x;
    if(!bit&&start!==null){const l=Math.max(0,Math.floor(left+start*scale)),r=Math.min(size,Math.ceil(left+x*scale)),t0=Math.max(0,Math.floor(top+y*scale)),b=Math.min(size,Math.ceil(top+(y+1)*scale));if(r>l&&b>t0)rects.push({sx:l,sy:t0,sw:r-l,sh:b-t0});start=null;}
   }
  }
 }
 return rects;
}
export function maskedRasterTarget(context,layer,tile,size){
 if(!layer.spatial_policy?.radar_mask&&!layer.draw_exclusions?.length)return null;
 const create=context.canvas?.ownerDocument||globalThis.document;
 const canvas=context._p7MaskCanvas??=create?.createElement('canvas');
 if(!canvas)throw new Error('WR mask canvas unavailable');
 if(canvas.width!==size||canvas.height!==size){canvas.width=size;canvas.height=size;}
 const scratch=canvas.getContext('2d');scratch.clearRect(0,0,size,size);scratch.globalAlpha=1;
 return {context:scratch,finish(){const rects=protectedRasterRects(layer,tile,size);for(const r of rects)scratch.clearRect(r.sx,r.sy,r.sw,r.sh);context.drawImage(canvas,0,0);return rects.length;}};
}
export function retainProtectedRasterAreas(context,layer,tile,size){
 if(!context)return;
 const doc=context.canvas?.ownerDocument||globalThis.document,canvas=doc.createElement('canvas');canvas.width=canvas.height=size;
 const mask=canvas.getContext('2d');mask.fillStyle='#fff';
 for(const r of protectedRasterRects(layer,tile,size))mask.fillRect(r.sx,r.sy,r.sw,r.sh);
 const mode=context.globalCompositeOperation,alpha=context.globalAlpha;
 try{context.globalCompositeOperation='destination-in';context.globalAlpha=1;context.drawImage(canvas,0,0);}finally{context.globalCompositeOperation=mode;context.globalAlpha=alpha;}
}
