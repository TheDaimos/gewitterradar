/* WR-authorized source-tile leases. No provider ranking, pixel inference or disk cache. */
const NASA="nasa_gibs/satellite_precipitation_imerg_30min";
export function validateSpatialPolicy(source){
 const p=source?.spatial_policy;
 if(p===undefined)return;
 if(source.source_id!==NASA||p?.kind!=="exclusive_tiles_v1"||!Number.isInteger(p.zoom)||p.zoom<0||p.zoom>6
   ||p.padding_factor!==1.3||!Array.isArray(p.tiles)||p.tiles.length>48
   ||p.reservation_status!=="verified_envelopes"
   ||p.tiles.some(t=>!Array.isArray(t)||t.length!==2||t.some(v=>!Number.isInteger(v)||v<0||v>=2**p.zoom))
   ||new Set(p.tiles.map(t=>t.join('/'))).size!==p.tiles.length)
   throw new TypeError("Invalid WR exclusive source tile grant");
}
export function sourceTileGrant(source,tile,now=Date.now()){
 if(!source?.spatial_policy)return null;
 const p=source.spatial_policy;
 if(tile.z<p.zoom||!Number.isFinite(Date.parse(source.times?.valid_until))||now>=Date.parse(source.times.valid_until))return null;
 const scale=2**(tile.z-p.zoom),world=2**tile.z;
 if(tile.y<0||tile.y>=world)return null;
 const x=Math.floor(((tile.x%world)+world)%world/scale),y=Math.floor(tile.y/scale);
 return p.tiles.some(t=>t[0]===x&&t[1]===y)?{z:p.zoom,x,y}:null;
}
export function spatialTileBounds(z,x,y){
 const n=2**z,lat=y=>Math.atan(Math.sinh(Math.PI*(1-2*y/n)))*180/Math.PI;
 return {west:x/n*360-180,east:(x+1)/n*360-180,north:lat(y),south:lat(y+1)};
}
export function spatialCoverageLayers(layers){
 return layers.flatMap(layer=>layer?.spatial_policy?layer.spatial_policy.tiles.map(([x,y])=>
   ({...layer,coverage_scope:"bbox",coverage:spatialTileBounds(layer.spatial_policy.zoom,x,y)})):layer);
}
// Only live display leases retain decoded images, with two total transports.
// 128 x 256x256 RGBA = 32 MiB estimated decoded cache; no persisted bytes.
const live=new Map(),queue=[];let active=0;
const LIMIT=128;
function cancelled(){return new Error("nasa_tile_cancelled");}
function pump(){
 while(active<2&&queue.length){
  const rec=queue.shift();if(!rec.owners.size){rec.reject(cancelled());continue;}
  active++;rec.started=true;
  (async()=>{
   try{
    for(let attempt=0;attempt<3;attempt++){
     if(!rec.owners.size)throw cancelled();
     const controller=new AbortController();rec.controller=controller;
     const timer=setTimeout(()=>controller.abort(),8000);
     try{const decoded=await rec.load(rec.url,rec.source,{signal:controller.signal});
      if(decoded.width!==256||decoded.height!==256)throw new Error("nasa_tile_dimensions_invalid");
      rec.image=decoded;rec.resolve(rec.image);return;}
     catch(error){if(!rec.owners.size||attempt===2)throw error;}
     finally{clearTimeout(timer);}
     await new Promise(r=>setTimeout(r,250*(attempt+1)));
    }
   }catch(error){rec.failed=true;rec.reject(error);}
   finally{active--;rec.controller=null;pump();}
  })();
 }
}
export function leaseNasaTiles(source,urlForTile,load){
 validateSpatialPolicy(source);
 const owner=Symbol("live_snapshot"),records=new Map();let released=false;
 const acquire=tile=>{
  const url=urlForTile(tile),key=source.source_id+'\n'+source.times.valid_at+'\n'+url;
  let rec=live.get(key);
  if(!rec||rec.failed){
   if(live.size>=LIMIT&&!rec)return null;
   rec={key,url,source,load,owners:new Set(),controller:null,started:false,failed:false};
   rec.promise=new Promise((resolve,reject)=>{rec.resolve=resolve;rec.reject=reject;});
   rec.promise.catch(()=>{});live.set(key,rec);queue.push(rec);
  }
  rec.owners.add(owner);records.set(tile.x+'/'+tile.y,rec);return rec;
 };
 for(const [x,y] of source.spatial_policy.tiles)acquire({z:source.spatial_policy.zoom,x,y});
 queueMicrotask(pump);
 return {
  image(tile){
   if(released||!sourceTileGrant(source,{...tile,z:source.spatial_policy.zoom}))return Promise.reject(cancelled());
   const rec=records.get(tile.x+'/'+tile.y);return rec?rec.promise:Promise.reject(new Error("nasa_live_tile_limit"));
  },
  release(){
   if(released)return;released=true;
   for(const rec of records.values()){
    rec.owners.delete(owner);
    if(!rec.owners.size){rec.controller?.abort();if(!rec.started)rec.reject(cancelled());if(live.get(rec.key)===rec)live.delete(rec.key);}
   }
   records.clear();for(let i=queue.length-1;i>=0;i--)if(!queue[i].owners.size)queue.splice(i,1);
  },
  diagnostic(){return {active_transports:active,live_entries:live.size,max_live_entries:LIMIT,estimated_decoded_bytes:live.size*256*256*4,owned_tiles:records.size,persistent:false};}
 };
}
