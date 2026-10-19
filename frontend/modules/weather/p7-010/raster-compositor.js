/*
 * P7-010 isolated Canvas composition helper; not wired into active GR.
 * Requires preloaded, provider-eligible, verified raster tiles. The rendering
 * eligibility and provider priority come from WR; freshness controls display stacking.
 */
import {rasterTilePixelCrops} from "./raster-tile-clip.js?v=41188r1";
import {measureRasterTileCoverage} from "./raster-mosaic-coverage.js?v=41189r1";

/** Presentation order only; WR still selects and prioritizes eligible sources.
 * Older satellite estimates paint first; within the same freshness class
 * preserve the original WR order. */
export function rasterMosaicRenderOrder(layers){
 if(!Array.isArray(layers))return [];
 const rank=l=>l?.freshness_class==="older_background"||
  (l?.semantics?.observation_kind==="estimate"&&
   String(l?.semantics?.measurement_method||"").includes("satellite"))?0:1;
 return layers.map((layer,index)=>({layer,index}))
   .sort((a,b)=>rank(a.layer)-rank(b.layer)||a.index-b.index)
   .map(x=>x.layer);
}
const MAX_LAYERS=4;
const MAX_TILE_SIZE=512;

/**
 * Draw independent raster images into one tile. The caller retains all
 * per-source legends, measurement semantics, provenance and data timestamps.
 * There is no numerical mixing, optical reconstruction or interpolation.
 *
 * @param {CanvasRenderingContext2D} context Destination Canvas 2D context
 * @param {object} tile Leaflet-compatible {x,y,z}
 * @param {Array<object>} layers Ordered WR mosaics, broad first
 * @param {number} tileSize Tile edge size, validated resource budget
 * @returns {object} Transparent audit of actually drawn layers
 */
export function drawVerifiedRasterMosaicTile(context,tile,layers,tileSize=256){
 if(!context||typeof context.drawImage!=="function")throw new TypeError("Canvas context required");
 if(!Array.isArray(layers)||layers.length>MAX_LAYERS)
   throw new RangeError("Too many simultaneous layers");
 if(!Number.isInteger(tileSize)||tileSize<1||tileSize>MAX_TILE_SIZE)
   throw new RangeError("Invalid resource-bounded tile size");
 const drawn=[],rejected=[],paintedRects=[];
 for(const layer of rasterMosaicRenderOrder(layers)){
   const id=typeof layer?.source_id==="string"?layer.source_id:"unbekannt";
   if(!layer||!layer.image||layer.resource_type!=="raster_tile"
     ||layer.coverage_verified!==true||!layer.attribution
     ||!layer.semantics||!layer.times||!layer.legend){
     rejected.push({source_id:id,reason:"unverified_or_incomplete_source"});
     continue;
   }
   const coverage=layer.coverage_scope==="global"
     ?{scope:"global",verified:true}
     :layer.coverage_scope==="bbox"&&layer.coverage
       ?{scope:"bbox",bbox:layer.coverage,verified:true}
       :null;
   if(!coverage){
     rejected.push({source_id:id,reason:"unknown_geographic_mask"});
     continue;
   }
   const render=layer.render||{
     tile_size:256,min_zoom:0,max_zoom:18,opacity:1
   };
   if(![128,256,512].includes(render.tile_size)
     ||![render.min_zoom,render.max_zoom,render.opacity].every(Number.isFinite)
     ||render.min_zoom<0||render.max_zoom>24
     ||render.min_zoom>render.max_zoom||render.opacity<0||render.opacity>1){
     rejected.push({source_id:id,reason:"invalid_render_parameters"});
     continue;
   }
   if(tile.z<render.min_zoom){
     rejected.push({source_id:id,reason:"outside_zoom_coverage"});
     continue;
   }
   const nativeTile=layer._p7SourceTile||tile;
   const nativeScale=2**Math.max(0,tile.z-nativeTile.z);
   const childX=((tile.x%nativeScale)+nativeScale)%nativeScale;
   const childY=((tile.y%nativeScale)+nativeScale)%nativeScale;
   const destCrops=rasterTilePixelCrops(tile,coverage,tileSize);
   // The crop geometry is always calculated in the DISPLAY tile's geographic
   // extent. For overzoom, transform it into the requested ancestor image's
   // native pixels. Never expand the provider's verified regional boundary.
   const sourceCrops=rasterTilePixelCrops(tile,coverage,render.tile_size)
     .map(crop=>({
       sx:(childX*render.tile_size+crop.sx)/nativeScale,
       sy:(childY*render.tile_size+crop.sy)/nativeScale,
       sw:crop.sw/nativeScale,sh:crop.sh/nativeScale
     }));
   if(!sourceCrops.length||sourceCrops.length!==destCrops.length){
     rejected.push({source_id:id,reason:"outside_tile_coverage"});
     continue;
   }
   const previousAlpha=Number.isFinite(context.globalAlpha)?context.globalAlpha:1;
   let cropsPainted=0;
   try{
     context.globalAlpha=previousAlpha*render.opacity;
     for(let index=0;index<sourceCrops.length;index++){
       const from=sourceCrops[index],to=destCrops[index];
       // Convert native tile pixel coordinates to viewport tile pixels.
       context.drawImage(layer.image,from.sx,from.sy,from.sw,from.sh,
         to.sx,to.sy,to.sw,to.sh);
       cropsPainted++;
       paintedRects.push({sx:to.sx,sy:to.sy,sw:to.sw,sh:to.sh});
     }
   }finally{
     context.globalAlpha=previousAlpha;
   }
   drawn.push({
     source_id:id,rectangles:cropsPainted,
     attribution:layer.attribution,times:layer.times,
     semantics:layer.semantics,legend:layer.legend,render,
   });
 }
 return {drawn,rejected,no_pixel_blending:true,tile_size:tileSize,
   tile_coverage:measureRasterTileCoverage(paintedRects,tileSize)};
}
