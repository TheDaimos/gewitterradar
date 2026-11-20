/* Shared, provider-neutral coordinate/time context and capability adapters. */
export function createGeoPointContext({latitude,longitude,selected_time=null,requested_capabilities=[]}={}){
 if(!Number.isFinite(latitude)||Math.abs(latitude)>90||!Number.isFinite(longitude))throw Error('geopoint_invalid_coordinate');
 if(selected_time!==null&&(typeof selected_time!=='string'||!/(?:Z|[+-]\d\d:\d\d)$/.test(selected_time)||!Number.isFinite(Date.parse(selected_time))))throw Error('geopoint_invalid_time');
 return {schema:'GeoPointContext',version:1,latitude,longitude:((longitude+180)%360+360)%360-180,selected_time,coordinate_reference:'EPSG:4326',requested_capabilities:[...new Set(requested_capabilities.filter(v=>typeof v==='string'))].slice(0,32),available_capabilities:[],source_metadata:{},validity_metadata:{},values:{},availability:{}};
}
export class GeoPointAdapters{
 constructor(){this.adapters=new Map();this.inflight=new Map();}
 register(capability,adapter){this.adapters.set(capability,adapter);return()=>this.adapters.delete(capability);}
 async query(input){const c=createGeoPointContext(input),key=JSON.stringify([c.latitude,c.longitude,c.selected_time,c.requested_capabilities]);if(this.inflight.has(key))return this.inflight.get(key);
  const task=(async()=>{await Promise.all(c.requested_capabilities.map(async capability=>{const adapter=this.adapters.get(capability);if(!adapter){c.availability[capability]={status:'unavailable',code:'capability_not_implemented'};return;}try{const r=await adapter(c);if(r?.status!=='ready'){c.availability[capability]={status:'unavailable',code:r?.code||'no_valid_data'};return;}c.available_capabilities.push(capability);c.values[capability]=r.value;c.source_metadata[capability]=r.source;c.validity_metadata[capability]=r.validity;c.availability[capability]={status:'ready'};}catch(error){c.availability[capability]={status:'error',code:String(error?.message||'query_failed').replace(/[^a-z0-9_:-]/gi,'').slice(0,80)};}}));return c;})();this.inflight.set(key,task);try{return await task;}finally{this.inflight.delete(key);}
 }
 clear(){this.adapters.clear();this.inflight.clear();}
}
