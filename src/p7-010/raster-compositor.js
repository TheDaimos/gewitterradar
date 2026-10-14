/*
 * P7-010 isolated Canvas composition helper; not wired into active GR.
 * Requires preloaded, provider-eligible, verified raster tiles. The rendering
 * order and provider decisions must come from WeatherRouter V2, not this file.
 */
import {rasterTilePixelCrops} from "./raster-tile-clip.js";

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
 const drawn=[],rejected=[];
 for(const layer of layers){
   const id=typeof layer?.source_id==="string"?layer.source_id:"unbekannt";
   if(!layer||!layer.image||layer.resource_type!=="raster_tile"
     ||layer.coverage_verified!==true||!layer.attribution
     ||!layer.semantics||!layer.times||!layer.legend){
     rejected.push({source_id:id,reason:"unverified_or_incomplete_source"});
     continue;
   }
   const coverage=layer.coverage?.scope==="global"
     ?{scope:"global",verified:true}
     :layer.coverage?.scope==="bbox"&&layer.coverage.bbox
       ?{scope:"bbox",bbox:layer.coverage.bbox,verified:true}
       :null;
   if(!coverage){
     rejected.push({source_id:id,reason:"unknown_geographic_mask"});
     continue;
   }
   const crops=rasterTilePixelCrops(tile,coverage,tileSize);
   if(!crops.length){
     rejected.push({source_id:id,reason:"outside_tile_coverage"});
     continue;
   }
   let cropsPainted=0;
   for(const r of crops){
     // Draw source pixels 1:1; do not spread a regional image beyond bounds.
     context.drawImage(layer.image,r.sx,r.sy,r.sw,r.sh,r.sx,r.sy,r.sw,r.sh);
     cropsPainted++;
   }
   drawn.push({
     source_id:id,rectangles:cropsPainted,
     attribution:layer.attribution,times:layer.times,
     semantics:layer.semantics,legend:layer.legend,
   });
 }
 return {drawn,rejected,no_pixel_blending:true,tile_size:tileSize};
}
