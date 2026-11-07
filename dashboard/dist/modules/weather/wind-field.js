/* Additive WR Consumer V2 numeric-field contract and bounded spatial sampling.
 * No provider selection, model-age policy, field extrapolation or image decoding.
 */
import { BEAUFORT_LIMITS } from './wind-data.js?v=411151r1';
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
 return {...f,grid:{...g,u:Float32Array.from(g.u,(v,i)=>g.valid_mask[i]?v:0),v:Float32Array.from(g.v,(v,i)=>g.valid_mask[i]?v:0),valid_mask:Uint8Array.from(g.valid_mask)},hasMotion:g.u.some((v,i)=>g.valid_mask[i]&&(v!==0||g.v[i]!==0)),deadline:Date.parse(f.valid_until)};
}
export function sampleWindField(field,lat,lon){
 const g=field?.grid;if(!g||!Number.isFinite(lat)||!Number.isFinite(lon))return null;
 const x=g.longitudes,y=g.latitudes,nx=x.length,ny=y.length;
 lon+=360*Math.round(((x[0]+x[nx-1])/2-lon)/360);
 if(lon<x[0]-1e-8||lon>x[nx-1]+1e-8||lat<y[0]-1e-8||lat>y[ny-1]+1e-8)return null;
 const px=Math.max(0,Math.min(nx-1,(lon-x[0])/(x[1]-x[0]))),py=Math.max(0,Math.min(ny-1,(lat-y[0])/(y[1]-y[0])));
 const col=Math.min(nx-2,Math.floor(px)),row=Math.min(ny-2,Math.floor(py)),fx=px-col,fy=py-row;
 const indices=[row*nx+col,row*nx+col+1,(row+1)*nx+col,(row+1)*nx+col+1];
 if(indices.some(i=>g.valid_mask[i]!==1))return null;
 const blend=a=>(a[indices[0]]*(1-fx)+a[indices[1]]*fx)*(1-fy)+(a[indices[2]]*(1-fx)+a[indices[3]]*fx)*fy;
 const u=blend(g.u),v=blend(g.v),speed=Math.hypot(u,v);
 return {u,v,speed,from:speed?((Math.atan2(-u,-v)*180/Math.PI)%360+360)%360:null};
}
export function windFieldColor(speed){
 if(!Number.isFinite(speed)||speed<0)return [0,0,0,0];
 let i=0;while(i<12&&speed>=BEAUFORT_LIMITS[i+1])i++;
 const t=i===12?0:Math.max(0,Math.min(1,(speed-BEAUFORT_LIMITS[i])/(BEAUFORT_LIMITS[i+1]-BEAUFORT_LIMITS[i])));
 const a=WIND_FIELD_COLORS[i],b=WIND_FIELD_COLORS[Math.min(12,i+1)];
 return [1,3,5].map(j=>Math.round(parseInt(a.slice(j,j+2),16)*(1-t)+parseInt(b.slice(j,j+2),16)*t)).concat(255);
}
export function windFieldViewport(map){
 const b=map.getBounds(),south=Math.max(-85,b.getSouth()),north=Math.min(85,b.getNorth()),span=Math.min(360,Math.max(.01,b.getEast()-b.getWest()));
 const west=((b.getWest()+180)%360+360)%360-180;
 // Whole-degree outward bounds suppress redundant tiny drags without global downloads.
 return {west:span>=360?-180:Math.floor(west),east:span>=360?180:Math.ceil(west+span),south:Math.floor(south),north:Math.ceil(north)};
}
export function windFieldGlyphs(map,field){
 const s=map.getSize(),points=[];
 for(let sy=45;sy<s.y;sy+=100)for(let sx=45;sx<s.x;sx+=100){
  const ll=map.containerPointToLatLng([sx,sy]),value=sampleWindField(field,ll.lat,ll.lng);
  if(value)points.push({key:'field/'+sy+'/'+sx,lat:ll.lat,lon:ll.lng,...value,provider:field.provenance.provider_id,attribution:field.provenance.attribution,validAt:field.valid_at,kind:field.kind,height:10});
 }
 return points;
}
