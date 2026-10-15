/*
 * P7-010: provider-neutral tile URL expansion.
 * Supports WR's XYZ raster URLs and EPSG:3857 WMS BBOX templates.
 * Pure, opt-in helper; not yet connected to the active precipitation layer.
 */
const MERCATOR_LIMIT=20037508.342789244;
const finiteInt=x=>Number.isSafeInteger(x);
const bboxNumber=value=>{
 const rounded=Number(value.toFixed(7));
 return Object.is(rounded,-0)?"0":String(rounded);
};

/**
 * Return canonical source coordinates for a Leaflet XYZ tile. Repeated
 * worlds must reuse the original 0..2^z tile instead of requesting
 * impossible out-of-world WMS coordinates. A map's geographic clipping
 * still uses its original (possibly wrapped) tile coordinates.
 */
export function canonicalRasterTile(tile){
 if(!tile||![tile.x,tile.y,tile.z].every(finiteInt)
    ||tile.z<0||tile.z>18)throw new TypeError("Invalid raster tile");
 const columns=2**tile.z;
 if(tile.y<0||tile.y>=columns)throw new RangeError("Y outside world");
 const x=((tile.x%columns)+columns)%columns;
 return {x,y:tile.y,z:tile.z};
}

export function epsg3857TileBounds(tile){
 const {x,y,z}=canonicalRasterTile(tile);
 const count=2**z,span=2*MERCATOR_LIMIT/count;
 const west=-MERCATOR_LIMIT+x*span;
 const east=west+span;
 const north=MERCATOR_LIMIT-y*span;
 const south=north-span;
 return {west,south,east,north};
}

/**
 * Expands exactly the two tile-address forms currently used by WR providers:
 * XYZ {z}/{x}/{y} and WMS {bbox-epsg-3857}.
 * Unknown unexpanded placeholders fail closed rather than requesting a
 * location that was never authorized or has invalid geography.
 */
export function rasterTileUrl(template,tile){
 if(typeof template!=="string"||!template.startsWith("https://"))
   throw new TypeError("Expected a public HTTPS raster tile template");
 const canonical=canonicalRasterTile(tile);
 const valid=new Set(["z","x","y","bbox-epsg-3857"]);
 const placeholders=[...template.matchAll(/\{([^{}]+)\}/g)].map(m=>m[1]);
 if(placeholders.some(t=>!valid.has(t)))
   throw new TypeError("Unknown raster tile template placeholder");
 if(!placeholders.includes("bbox-epsg-3857")
    &&!(["z","x","y"].every(t=>placeholders.includes(t))))
   throw new TypeError("Raster tile template has no complete coordinate scheme");
 const b=epsg3857TileBounds(canonical);
 const values={
   z:canonical.z,x:canonical.x,y:canonical.y,
   "bbox-epsg-3857":[b.west,b.south,b.east,b.north].map(bboxNumber).join(",")
 };
 return template.replace(/\{(z|x|y|bbox-epsg-3857)\}/g,(_full,key)=>String(values[key]));
}
