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
export function sourceTileGrants(source,tile,now=Date.now()){
 if(!source?.spatial_policy)return [];
 const p=source.spatial_policy,world=2**tile.z;
 if(!Number.isFinite(Date.parse(source.times?.valid_until))||now>=Date.parse(source.times.valid_until)||tile.y<0||tile.y>=world)return [];
 const x=((tile.x%world)+world)%world;
 if(tile.z>=p.zoom){
  const scale=2**(tile.z-p.zoom),sx=Math.floor(x/scale),sy=Math.floor(tile.y/scale);
  return p.tiles.some(t=>t[0]===sx&&t[1]===sy)?[{z:p.zoom,x:sx,y:sy}]:[];
 }
 const scale=2**(p.zoom-tile.z);
 return p.tiles.filter(([sx,sy])=>Math.floor(sx/scale)===x&&Math.floor(sy/scale)===tile.y).map(([x,y])=>({z:p.zoom,x,y}));
}
export function sourceTileGrant(source,tile,now=Date.now()){
 const grants=sourceTileGrants(source,tile,now);return grants.length===1?grants[0]:null;
}
export function nasaTileDestination(tile,native,tileSize=256){
 if(native.z<=tile.z)return {x:0,y:0,width:tileSize,height:tileSize};
 const scale=2**(native.z-tile.z),size=tileSize/scale;
 return {x:(native.x%scale)*size,y:(native.y%scale)*size,width:size,height:size};
}
export function spatialTileBounds(z,x,y){
 const n=2**z,lat=y=>Math.atan(Math.sinh(Math.PI*(1-2*y/n)))*180/Math.PI;
 return {west:x/n*360-180,east:(x+1)/n*360-180,north:lat(y),south:lat(y+1)};
}
export function spatialCoverageLayers(layers){
 return layers.flatMap(layer=>layer?.spatial_policy?layer.spatial_policy.tiles.map(([x,y])=>
   ({...layer,coverage_scope:"bbox",coverage:spatialTileBounds(layer.spatial_policy.zoom,x,y)})):layer);
}
// The existing live-image lease manager: bounded independently of transport concurrency.
const live=new Map(),queue=[];let active=0,wake=null,generation=0;
const LIMIT=128;
let configured=2,effective=2,revision=-1,until=0,restriction=null,successRun=0,timeouts=0,lastTimeoutAt=0;
const totals={succeeded:0,failed:0,retried:0,overloads:0};
function cancelled(){return new Error("nasa_tile_cancelled");}
function configure(source){
 const p=source.transport_policy;
 if(!p)return;
 if(!Number.isInteger(p.max_parallel_downloads)||p.max_parallel_downloads<2||p.max_parallel_downloads>32||!Number.isInteger(p.settings_revision)||p.settings_revision<0)throw new TypeError("Invalid WR NASA transport policy");
 if(p.settings_revision<revision)return;
 if(p.max_parallel_downloads!==configured){effective=Math.min(p.max_parallel_downloads,restriction?effective:p.max_parallel_downloads);configured=p.max_parallel_downloads;}
 revision=p.settings_revision;
}
export function configureNasaTransport(policy){configure({transport_policy:policy});pump();}
function overload(error){
 const timeout=error?.code==="nasa_transport_timeout"||error?.name==="AbortError";
 if(timeout){timeouts=Date.now()-lastTimeoutAt<30000?timeouts+1:1;lastTimeoutAt=Date.now();}
 if(![429,503].includes(error?.httpStatus)&&timeouts<2)return;
 effective=Math.max(1,Math.floor(effective/2));successRun=0;totals.overloads++;
 restriction=error?.httpStatus===429?"http_429":error?.httpStatus===503?"http_503":"repeated_timeouts";
 timeouts=0;
 const retryAfter=Number.isFinite(error?.retryAfterMs)?Math.max(0,error.retryAfterMs):2000;
 until=Math.max(until,Date.now()+retryAfter);
}
function priority(rec){
 const owners=[...rec.owners.values()],visible=owners.filter(o=>o.visible);
 return [visible.length?0:1,-Math.max(...(visible.length?visible:owners).map(o=>o.generation))];
}
function schedule(delay){if(wake)clearTimeout(wake);wake=setTimeout(()=>{wake=null;pump();},Math.min(60000,Math.max(1,delay)));}
function pump(){
 if(wake){clearTimeout(wake);wake=null;}
 if(!queue.length)return;
 if(Date.now()<until){schedule(until-Date.now());return;}
 queue.sort((a,b)=>{const x=priority(a),y=priority(b);return x[0]-y[0]||x[1]-y[1];});
 while(active<effective&&queue.length){
  const index=queue.findIndex(r=>r.notBefore<=Date.now());
  if(index<0){schedule(Math.min(...queue.map(r=>r.notBefore))-Date.now());break;}
  const rec=queue.splice(index,1)[0];
  if(!rec.owners.size||Date.now()>=Date.parse(rec.source.times.valid_until)){rec.failed=true;rec.reject(cancelled());continue;}
  active++;rec.started=true;if(rec.attempts>0)totals.retried++;rec.attempts++;
  (async()=>{
   const controller=new AbortController();rec.controller=controller;let timedOut=false;
   const timer=setTimeout(()=>{timedOut=true;controller.abort();},8000);
   try{
    const image=await rec.load(rec.url,rec.source,{signal:controller.signal});
    if(image.width!==256||image.height!==256)throw new Error("nasa_tile_dimensions_invalid");
    rec.image=image;totals.succeeded++;successRun++;
    if(Date.now()>=until&&successRun>=Math.max(4,effective*2)&&effective<configured){effective++;successRun=0;if(effective===configured)restriction=null;}
    rec.resolve(image);
   }catch(error){
    if(timedOut)error=Object.assign(new Error("NASA transport timeout"),{code:"nasa_transport_timeout"});
    if(rec.owners.size){totals.failed++;overload(error);}
    if(rec.owners.size&&rec.attempts<3&&![401,403,404].includes(error?.httpStatus)&&Date.now()<Date.parse(rec.source.times.valid_until)){
      rec.started=false;rec.notBefore=Math.max(until,Date.now()+250*rec.attempts);queue.push(rec);
    }else{rec.failed=true;rec.reject(error);}
   }finally{clearTimeout(timer);rec.controller=null;active--;pump();}
  })();
 }
}
export function leaseNasaTiles(source,urlForTile,load){
 validateSpatialPolicy(source);configure(source);
 const owner=Symbol("live_snapshot"),records=new Map(),ownerGeneration=++generation;let released=false;
 for(const [x,y] of source.spatial_policy.tiles){
  const tile={z:source.spatial_policy.zoom,x,y},url=urlForTile(tile),key=source.source_id+'\n'+source.times.valid_at+'\n'+url;
  let rec=live.get(key);
  if(!rec||rec.failed){
   if(live.size>=LIMIT&&!rec)continue;
   rec={key,url,source,load,owners:new Map(),controller:null,started:false,failed:false,attempts:0,notBefore:0};
   rec.promise=new Promise((resolve,reject)=>{rec.resolve=resolve;rec.reject=reject;});rec.promise.catch(()=>{});live.set(key,rec);queue.push(rec);
  }
  rec.owners.set(owner,{visible:false,generation:ownerGeneration});records.set(x+'/'+y,rec);
 }
 queueMicrotask(pump);
 return {
  image(tile){
   if(released||!sourceTileGrant(source,{...tile,z:source.spatial_policy.zoom}))return Promise.reject(cancelled());
   const rec=records.get(tile.x+'/'+tile.y);if(!rec)return Promise.reject(new Error("nasa_live_tile_limit"));
   rec.owners.get(owner).visible=true;queueMicrotask(pump);return rec.promise;
  },
  release(){
   if(released)return;released=true;
   for(const rec of records.values()){
    rec.owners.delete(owner);
    if(!rec.owners.size){rec.controller?.abort();if(!rec.started)rec.reject(cancelled());if(live.get(rec.key)===rec)live.delete(rec.key);}
   }
   records.clear();for(let i=queue.length-1;i>=0;i--)if(!queue[i].owners.size)queue.splice(i,1);pump();
  },
  diagnostic(){return {configured_parallelism:configured,effective_parallelism:Date.now()<until?0:effective,adaptive_concurrency_limit:effective,active_transports:active,waiting_tiles:queue.length,
   successful_tiles:totals.succeeded,failed_attempts:totals.failed,retried_attempts:totals.retried,overload_events:totals.overloads,
   overload_limit:restriction,overload_until:until>Date.now()?new Date(until).toISOString():null,
   live_entries:live.size,max_live_entries:LIMIT,estimated_decoded_bytes:live.size*256*256*4,owned_tiles:records.size,persistent:false};}
 };
}
