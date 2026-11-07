import { WindFieldCache,windFieldSnapshot,windFieldGeneration } from './wind-field.js?v=411153r1';
export const TEMPERATURE_FIELD='weather.temperature.field_2m',TEMPERATURE_COMMAND='weather_router/consumer/resolve_temperature_field';
export function prepareScalarGrid(g){const x=g.longitudes,y=g.latitudes;return {nx:x.length,ny:y.length,x0:x[0],y0:y[0],x1:x.at(-1),y1:y.at(-1),center:(x[0]+x.at(-1))/2,ix:1/(x[1]-x[0]),iy:1/(y[1]-y[0])};}
function validateGrid(g,names){
 if(g?.crs!=='EPSG:4326'||g.layout!=='row_major_south_first'||typeof g.cyclic!=='boolean')throw Error('temperature_invalid_grid');
 for(const axis of [g.longitudes,g.latitudes]){if(!Array.isArray(axis)||axis.length<2||axis.length>1500||axis.some(v=>typeof v!=='number'||!Number.isFinite(v)))throw Error('temperature_invalid_axis');const step=axis[1]-axis[0];if(step<=0||axis.some((v,i)=>i&&Math.abs(v-axis[i-1]-step)>1e-5))throw Error('temperature_irregular_axis');}
 const n=g.longitudes.length*g.latitudes.length;if(n>16000||g.latitudes[0]<-90||g.latitudes.at(-1)>90||g.longitudes.at(-1)-g.longitudes[0]>360.00001)throw Error('temperature_grid_budget');
 if(!Array.isArray(g.valid_mask)||g.valid_mask.length!==n||g.valid_mask.some(m=>m!==0&&m!==1))throw Error('temperature_invalid_mask');
 for(const name of names)if(!Array.isArray(g[name])||g[name].length!==n||g[name].some((v,i)=>g.valid_mask[i]&&(typeof v!=='number'||!Number.isFinite(v))))throw Error('temperature_invalid_values');
 if(g.cyclic){if(Math.abs(g.longitudes.at(-1)-g.longitudes[0]-360)>1e-5)throw Error('temperature_invalid_seam');const nx=g.longitudes.length;for(let r=0;r<g.latitudes.length;r++){const a=r*nx,b=a+nx-1;if(g.valid_mask[a]!==g.valid_mask[b]||names.some(k=>g.valid_mask[a]&&g[k][a]!==g[k][b]))throw Error('temperature_incoherent_seam');}}
 const result={...g,valid_mask:Uint8Array.from(g.valid_mask)};for(const name of names)result[name]=Float32Array.from(g[name],(v,i)=>g.valid_mask[i]?v:0);result.lookup=prepareScalarGrid(result);return result;
}
export function parseTemperatureField(answer){
 if(answer?.schema!=='weather_router.consumer.temperature_field.v2'||answer.contract_version!==2||answer.capability!==TEMPERATURE_FIELD||answer.status!=='ready')throw Error('temperature:'+String(answer?.unavailable?.code||'not_supported').replace(/[^a-z0-9_:-]/gi,'').slice(0,100));
 const f=answer.frame;if(f?.capability!==TEMPERATURE_FIELD||f.unit!=='K'||f.height_m!==2||f.kind!=='model_forecast'||typeof f.id!=='string'||!f.id||typeof f.provenance?.provider_id!=='string'||!f.provenance.provider_id)throw Error('temperature_invalid_metadata');
 for(const key of ['model_run','valid_at','valid_until'])if(typeof f[key]!=='string'||!/(?:Z|[+-]\d\d:\d\d)$/i.test(f[key])||!Number.isFinite(Date.parse(f[key])))throw Error('temperature_invalid_time');
 if(Date.parse(f.valid_until)<=Date.now()||!Number.isFinite(f.refresh_after_seconds)||f.refresh_after_seconds<=0)throw Error('temperature_expired');
 const grid=validateGrid(f.grid,['values']);if(grid.values.some((v,i)=>grid.valid_mask[i]&&v<=0)||!grid.valid_mask.some(Boolean))throw Error('temperature_invalid_kelvin');
 let advection=f.advection||{status:'unavailable',unavailable:{code:'not_provided'}};
 if(advection.status==='ready'){
  if(advection.unit!=='K/h'||advection.level?.type!=='isobaric'||advection.level.value!==850||advection.level.unit!=='hPa'||advection.model_run!==f.model_run||advection.valid_at!==f.valid_at||!Number.isFinite(Date.parse(advection.valid_until))||Date.parse(advection.valid_until)<Date.now())throw Error('temperature_incoherent_advection');
  const g=validateGrid(advection.grid,['u','v','rate']);if(JSON.stringify(g.longitudes)!==JSON.stringify(grid.longitudes)||JSON.stringify(g.latitudes)!==JSON.stringify(grid.latitudes)||g.cyclic!==grid.cyclic)throw Error('temperature_incoherent_advection_geometry');advection={...advection,grid:g};
 }
 return {...f,grid,advection,deadline:Math.min(Date.parse(f.valid_until),advection.status==='ready'?Date.parse(advection.valid_until):Infinity)};
}
const SCALAR_NAMES=Object.freeze(['values']);
export function sampleScalarInto(g,lat,lon,out,names=SCALAR_NAMES){
 const s=g.lookup;lon+=360*Math.round((s.center-lon)/360);if(!Number.isFinite(lat)||!Number.isFinite(lon)||lon<s.x0-1e-8||lon>s.x1+1e-8||lat<s.y0-1e-8||lat>s.y1+1e-8)return false;
 const px=Math.max(0,Math.min(s.nx-1,(lon-s.x0)*s.ix)),py=Math.max(0,Math.min(s.ny-1,(lat-s.y0)*s.iy)),col=Math.min(s.nx-2,Math.floor(px)),row=Math.min(s.ny-2,Math.floor(py)),i=row*s.nx+col,j=i+s.nx,m=g.valid_mask;
 if(!m[i]||!m[i+1]||!m[j]||!m[j+1])return false;const fx=px-col,fy=py-row;
 for(let k=0;k<names.length;k++){const a=g[names[k]];out[k]=(a[i]*(1-fx)+a[i+1]*fx)*(1-fy)+(a[j]*(1-fx)+a[j+1]*fx)*fy;}return true;
}
// Reuse the existing bounded LRU, spatial lookup, expiry and refresh-advice logic.
// Only insertion's byte accounting differs for scalar/advection field arrays.
export class TemperatureFieldCache extends WindFieldCache{
 put(field,zoom=0,{authoritative=true}={}){this.prune();const snapshot=windFieldSnapshot(field);if(authoritative){if(this.snapshot&&this.snapshot!==snapshot)this.clear();this.snapshot=snapshot;}else if(this.snapshot&&this.snapshot!==snapshot)return;
  const key=windFieldGeneration(field)+'/'+field.id,old=this.entries.get(key),g=field.grid,a=field.advection?.grid,bytes=g.values.byteLength+g.valid_mask.byteLength+(g.latitudes.length+g.longitudes.length)*8+(a?a.u.byteLength+a.v.byteLength+a.rate.byteLength+a.valid_mask.byteLength:0)+4096;
  if(old){this.bytes-=old.bytes;this.entries.delete(key);}if(bytes>this.budgetBytes)return;this.entries.set(key,{field,bytes,zoom,refreshAt:Math.min(field.deadline,Date.now()+field.refresh_after_seconds*1000)});this.bytes+=bytes;
  while(this.entries.size>this.maxEntries||this.bytes>this.budgetBytes){const [k,v]=this.entries.entries().next().value;this.entries.delete(k);this.bytes-=v.bytes;this.evictions++;}
 }
}
