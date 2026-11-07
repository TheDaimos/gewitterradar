/* Additive WR Consumer V2 numeric-field contract and bounded spatial sampling.
 * No provider selection, model-age policy, field extrapolation or image decoding.
 */
import { BEAUFORT_LIMITS } from './wind-data.js?v=411152r1';
export const WIND_FIELD='weather.wind.field_10m';
export const WIND_FIELD_COMMAND='weather_router/consumer/resolve_wind_field';
export const WIND_FIELD_COLORS=Object.freeze(['#7750b3','#6751cc','#465bce','#2987d1','#20a9bd','#32b49c','#6fba71','#b8be55','#d9b84f','#e89a43','#ea7444','#df494b','#bb2a58']);
const instant=value=>typeof value==='string'&&/(?:Z|[+-]\d\d:\d\d)$/i.test(value)&&Number.isFinite(Date.parse(value));
export function parseWindField(answer){
 if(answer?.schema!=='weather_router.consumer.wind_field.v2'||answer.contract_version!==2||answer.capability!==WIND_FIELD||answer.status!=='ready')throw new Error('wr_wind_field:'+String(answer?.unavailable?.code||'not_supported').replace(/[^a-z0-9_:-]/gi,'').slice(0,80));
 const f=answer.frame,g=f?.grid;
 if(f?.capability!==WIND_FIELD||f.unit!=='m/s'||f.height_m!==10||f.kind!=='model_forecast'||typeof f.id!=='string'||!f.id||!instant(f.valid_at)||!instant(f.model_run)||!instant(f.valid_until)||Date.parse(f.valid_until)<=Date.now()||typeof f.provenance?.provider_id!=='string'||!f.provenance.provider_id)throw new Error('wr_wind_field:invalid_metadata');
 if(g?.crs!=='EPSG:4326'||g.layout!=='row_major_south_first'||typeof g.cyclic!=='boolean')throw new Error('wr_wind_field:invalid_grid');
 for(const axis of [g.latitudes,g.longitudes]){
  if(!Array.isArray(axis)||axis.length<2||axis.length>1500||axis.some(v=>typeof v!=='number'||!Number.isFinite(v)))throw new Error('wr_wind_field:invalid_axis');
  const step=axis[1]-axis[0];if(step<=0||axis.some((v,i)=>i&&Math.abs(v-axis[i-1]-step)>1e-5))throw new Error('wr_wind_field:irregular_axis');
 }
 const x=g.longitudes,y=g.latitudes,n=x.length*y.length;
 if(n>16000||y[0]<-90||y.at(-1)>90||x.at(-1)-x[0]>360.00001||g.cyclic&&Math.abs(x.at(-1)-x[0]-360)>1e-5)throw new Error('wr_wind_field:grid_budget_or_bounds');
 for(const a of [g.u,g.v,g.valid_mask])if(!Array.isArray(a)||a.length!==n)throw new Error('wr_wind_field:incoherent_components');
 if(!g.valid_mask.some(v=>v===1)||g.valid_mask.some(v=>v!==0&&v!==1)||g.u.some((v,i)=>g.valid_mask[i]&&(typeof v!=='number'||!Number.isFinite(v)))||g.v.some((v,i)=>g.valid_mask[i]&&(typeof v!=='number'||!Number.isFinite(v))))throw new Error('wr_wind_field:invalid_values');
 if(g.cyclic)for(let row=0;row<y.length;row++){const first=row*x.length,last=first+x.length-1;if(g.valid_mask[first]!==g.valid_mask[last]||g.valid_mask[first]&&(g.u[first]!==g.u[last]||g.v[first]!==g.v[last]))throw new Error('wr_wind_field:incoherent_seam');}
 if(!Number.isFinite(f.refresh_after_seconds)||f.refresh_after_seconds<=0)throw new Error('wr_wind_field:invalid_refresh');
 // Typed arrays bound hot-loop memory. Masked values are never sampled.
 const field={...f,grid:{...g,u:Float32Array.from(g.u,(v,i)=>g.valid_mask[i]?v:0),v:Float32Array.from(g.v,(v,i)=>g.valid_mask[i]?v:0),valid_mask:Uint8Array.from(g.valid_mask)},hasMotion:g.u.some((v,i)=>g.valid_mask[i]&&(v!==0||g.v[i]!==0)),deadline:Date.parse(f.valid_until)};
 prepareWindFieldLookup(field);return field;
}
export function prepareWindFieldLookup(field){
 if(field.lookup)return field.lookup;const g=field.grid,x=g.longitudes,y=g.latitudes,nx=x.length,ny=y.length;
 const cells=new Uint8Array((nx-1)*(ny-1));let allValid=true;
 for(let row=0;row<ny-1;row++)for(let col=0;col<nx-1;col++){const i=row*nx+col,valid=g.valid_mask[i]&&g.valid_mask[i+1]&&g.valid_mask[i+nx]&&g.valid_mask[i+nx+1];cells[row*(nx-1)+col]=valid?1:0;if(!valid)allValid=false;}
 return field.lookup={nx,ny,x0:x[0],y0:y[0],x1:x[nx-1],y1:y[ny-1],center:(x[0]+x[nx-1])/2,ix:1/(x[1]-x[0]),iy:1/(y[1]-y[0]),cells,allValid};
}
// Same bilinear numeric operation as before, without transient arrays/closures or angle round trips.
export function sampleWindFieldInto(field,lat,lon,out){
 if(!field?.grid||!Number.isFinite(lat)||!Number.isFinite(lon))return false;
 const s=field.lookup||prepareWindFieldLookup(field),g=field.grid;lon+=360*Math.round((s.center-lon)/360);
 if(lon<s.x0-1e-8||lon>s.x1+1e-8||lat<s.y0-1e-8||lat>s.y1+1e-8)return false;
 const px=Math.max(0,Math.min(s.nx-1,(lon-s.x0)*s.ix)),py=Math.max(0,Math.min(s.ny-1,(lat-s.y0)*s.iy));
 const col=Math.min(s.nx-2,Math.floor(px)),row=Math.min(s.ny-2,Math.floor(py));
 const at=row*s.nx+col;if(s.cells[row*(s.nx-1)+col]!==1||!g.valid_mask[at]||!g.valid_mask[at+1]||!g.valid_mask[at+s.nx]||!g.valid_mask[at+s.nx+1])return false;
 const fx=px-col,fy=py-row,i=row*s.nx+col,j=i+s.nx,u=g.u,v=g.v;
 out[0]=(u[i]*(1-fx)+u[i+1]*fx)*(1-fy)+(u[j]*(1-fx)+u[j+1]*fx)*fy;
 out[1]=(v[i]*(1-fx)+v[i+1]*fx)*(1-fy)+(v[j]*(1-fx)+v[j+1]*fx)*fy;
 out[2]=Math.hypot(out[0],out[1]);out[3]=px;out[4]=py;return true;
}
export function sampleWindField(field,lat,lon){
 const value=new Float64Array(5);if(!sampleWindFieldInto(field,lat,lon,value))return null;
 const [u,v,speed]=value;return {u,v,speed,from:speed?((Math.atan2(-u,-v)*180/Math.PI)%360+360)%360:null};
}
export function windFieldStepValid(field,lat0,lon0,lat1,lon1){
 const s=field.lookup||prepareWindFieldLookup(field);lon0+=360*Math.round((s.center-lon0)/360);lon1+=360*Math.round((lon0-lon1)/360);
 if(lat1<s.y0||lat1>s.y1||!field.grid.cyclic&&(lon1<s.x0||lon1>s.x1))return false;
 if(s.allValid)return true;
 const crosses=field.grid.cyclic&&(lon1<s.x0||lon1>s.x1);if(crosses)lon1+=lon1>s.x1?-360:360;
 const c0=Math.max(0,Math.min(s.nx-2,Math.floor((lon0-s.x0)*s.ix))),c1=Math.max(0,Math.min(s.nx-2,Math.floor((lon1-s.x0)*s.ix))),r0=Math.max(0,Math.min(s.ny-2,Math.floor((lat0-s.y0)*s.iy))),r1=Math.max(0,Math.min(s.ny-2,Math.floor((lat1-s.y0)*s.iy)));
 // Conservative swept-cell box: may reject a corner near a hole, never crosses one.
 for(let row=Math.min(r0,r1);row<=Math.max(r0,r1);row++){if(crosses){for(let col=0;col<=Math.min(c0,c1);col++)if(!s.cells[row*(s.nx-1)+col])return false;for(let col=Math.max(c0,c1);col<s.nx-1;col++)if(!s.cells[row*(s.nx-1)+col])return false;}else for(let col=Math.min(c0,c1);col<=Math.max(c0,c1);col++)if(!s.cells[row*(s.nx-1)+col])return false;}return true;
}
const RGB=WIND_FIELD_COLORS.map(hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)));
export function writeWindFieldColor(speed,target,offset){
 if(!Number.isFinite(speed)||speed<0){target[offset]=target[offset+1]=target[offset+2]=target[offset+3]=0;return;}
 let i=0;while(i<12&&speed>=BEAUFORT_LIMITS[i+1])i++;
 const t=i===12?0:Math.max(0,Math.min(1,(speed-BEAUFORT_LIMITS[i])/(BEAUFORT_LIMITS[i+1]-BEAUFORT_LIMITS[i]))),a=RGB[i],b=RGB[Math.min(12,i+1)];
 target[offset]=Math.round(a[0]*(1-t)+b[0]*t);target[offset+1]=Math.round(a[1]*(1-t)+b[1]*t);target[offset+2]=Math.round(a[2]*(1-t)+b[2]*t);target[offset+3]=255;
}
export function windFieldColor(speed){
 const out=[0,0,0,0];writeWindFieldColor(speed,out,0);return out;
}
export function windFieldViewport(map,padding=1){
 if(padding!==1){const s=map.getSize(),dx=s.x*(padding-1)/2,dy=s.y*(padding-1)/2,corners=[[-dx,-dy],[s.x+dx,-dy],[-dx,s.y+dy],[s.x+dx,s.y+dy]].map(p=>map.containerPointToLatLng(p)),west=Math.min(...corners.map(p=>p.lng)),east=Math.max(...corners.map(p=>p.lng));return canonicalWindBounds({west,east,south:Math.max(-85,Math.min(...corners.map(p=>p.lat))),north:Math.min(85,Math.max(...corners.map(p=>p.lat)))});}
 const b=map.getBounds(),south=Math.max(-85,b.getSouth()),north=Math.min(85,b.getNorth()),span=Math.min(360,Math.max(.01,b.getEast()-b.getWest()));
 const west=((b.getWest()+180)%360+360)%360-180;
 // Whole-degree outward bounds suppress redundant tiny drags without global downloads.
 return {west:span>=360?-180:Math.floor(west),east:span>=360?180:Math.ceil(west+span),south:Math.floor(south),north:Math.ceil(north)};
}
export function canonicalWindBounds(bounds){const span=Math.min(360,Math.max(.000001,bounds.east-bounds.west)),west=((bounds.west+180)%360+360)%360-180;return {west:span>=360?-180:west,east:span>=360?180:west+span,south:bounds.south,north:bounds.north};}
export function windFieldVisibleBounds(map){const b=map.getBounds();return canonicalWindBounds({west:b.getWest(),east:b.getEast(),south:Math.max(-85,b.getSouth()),north:Math.min(85,b.getNorth())});}
export function windFieldContains(field,bounds){
 const g=field.grid,x=g.longitudes,y=g.latitudes;
 if(bounds.south<y[0]-1e-8||bounds.north>y.at(-1)+1e-8)return false;
 if(g.cyclic)return true;const offset=360*Math.round(((x[0]+x.at(-1))/2-(bounds.west+bounds.east)/2)/360);return bounds.west+offset>=x[0]-1e-8&&bounds.east+offset<=x.at(-1)+1e-8;
}
export function windFieldOverlaps(field,bounds){const g=field.grid,x=g.longitudes,y=g.latitudes;if(bounds.north<y[0]||bounds.south>y.at(-1))return false;if(g.cyclic)return true;const shift=360*Math.round(((x[0]+x.at(-1))/2-(bounds.west+bounds.east)/2)/360);return bounds.east+shift>=x[0]&&bounds.west+shift<=x.at(-1);}
export function windFieldSnapshot(field){const p=field.provenance;return JSON.stringify([p.provider_id,field.model||p.model||'',field.model_run,field.valid_at,field.height_m,field.unit,field.grid.crs]);}
export function windFieldGeneration(field){const g=field.grid;return windFieldSnapshot(field)+'/'+JSON.stringify([g.longitudes[1]-g.longitudes[0],g.latitudes[1]-g.latitudes[0]].map(v=>Math.round(v*1e9)/1e9));}
export class WindFieldCache{
 constructor({budgetBytes=8*1024*1024,maxEntries=6}={}){this.budgetBytes=budgetBytes;this.maxEntries=maxEntries;this.entries=new Map();this.bytes=0;this.hits=0;this.misses=0;this.evictions=0;}
 prune(now=Date.now()){for(const [key,item] of this.entries)if(item.field.deadline<=now){this.entries.delete(key);this.bytes-=item.bytes;}}
 put(field,zoom=0,{authoritative=true}={}){this.prune();const snapshot=windFieldSnapshot(field);if(authoritative){if(this.snapshot&&this.snapshot!==snapshot)this.clear();this.snapshot=snapshot;}else if(this.snapshot&&this.snapshot!==snapshot)return;const key=windFieldGeneration(field)+'/'+field.id,old=this.entries.get(key),g=field.grid,bytes=g.u.byteLength+g.v.byteLength+g.valid_mask.byteLength+g.latitudes.length*8+g.longitudes.length*8+(field.lookup?.cells.byteLength||0)+2048;if(old){this.bytes-=old.bytes;this.entries.delete(key);}if(bytes>this.budgetBytes)return;this.entries.set(key,{field,bytes,zoom,refreshAt:Math.min(field.deadline,Date.now()+field.refresh_after_seconds*1000)});this.bytes+=bytes;while(this.entries.size>this.maxEntries||this.bytes>this.budgetBytes){const [oldKey,item]=this.entries.entries().next().value;this.entries.delete(oldKey);this.bytes-=item.bytes;this.evictions++;}}
 find(bounds,zoom=0,{count=true}={}){this.prune();const candidates=[...this.entries].reverse();for(const [key,item] of candidates){const f=item.field,g=f.grid,coarse=Math.max(g.longitudes[1]-g.longitudes[0],g.latitudes[1]-g.latitudes[0])>(f.native_resolution_degrees||.25)+1e-6;if(item.refreshAt<=Date.now()||!windFieldContains(f,bounds)||coarse&&zoom>item.zoom+1)continue;this.entries.delete(key);this.entries.set(key,item);if(count)this.hits++;return f;}if(count)this.misses++;return null;}
 refreshAt(field){for(const item of this.entries.values())if(item.field===field)return item.refreshAt;return Date.now()+(field.refresh_after_seconds||300)*1000;}
 clear(){this.entries.clear();this.bytes=0;this.snapshot=null;}
 summary(){return {entries:this.entries.size,bytes:this.bytes,budgetBytes:this.budgetBytes,hits:this.hits,misses:this.misses,evictions:this.evictions};}
}
export function windFieldGlyphs(map,field){
 const s=map.getSize(),points=[];
 for(let sy=45;sy<s.y;sy+=100)for(let sx=45;sx<s.x;sx+=100){
  const ll=map.containerPointToLatLng([sx,sy]),value=sampleWindField(field,ll.lat,ll.lng);
  if(value)points.push({key:'field/'+sy+'/'+sx,lat:ll.lat,lon:ll.lng,...value,provider:field.provenance.provider_id,attribution:field.provenance.attribution,validAt:field.valid_at,kind:field.kind,height:10});
 }
 return points;
}
