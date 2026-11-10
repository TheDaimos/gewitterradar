// Existing public UI actions and authoritative consumer/UI states only.
const asset=name=>new URL('../../assets/'+name,import.meta.url).href;
export const EYE_MASTERS=Object.freeze({open:new URL('../../assets/gr-eye-open-master-1254.png', import.meta.url).href,closed:new URL('../../assets/gr-eye-closed-master-1254.png', import.meta.url).href});
const knownFailure=s=>Boolean(s?.fieldError||s?.error||s?.lastUnavailable||['failed','unavailable','error'].includes(s?.status));
export function createEyeRegistry(owner){
 const entries=new Map(),add=entry=>{if(!/^[a-z][a-z0-9-]*$/.test(entry.id)||entries.has(entry.id))throw Error('Invalid/duplicate Eye function');entries.set(entry.id,Object.freeze(entry));};
 add({id:'wind',key:'wind',icon:asset('gr-wind-animation-toggle-premium-v1-272.webp'),button:'weather-wind-toggle',tap:()=>owner._weatherWindToggle(),hold:()=>owner._weatherWindOpen(),status:()=>{const s=owner.__weatherWind,c=s?.config;return {active:!!(c?.visible&&(c.enabled||c.colorField)),available:(!knownFailure(s)&&!(s?.errors?.length&&!s?.points?.length&&!s?.field))||!!s?.field||!!(s?.points?.length&&!['animated','snake'].includes(c?.mode)),detail:s?.status||''};}});
 add({id:'temperature',key:'temperature',icon:asset('gr-temperature-premium-v1-272.webp'),button:'weather-temperature-toggle',tap:()=>{const s=owner._weatherTemperatureState();owner._weatherTemperatureSet({visible:!s.config.visible});},hold:()=>owner._weatherTemperatureOpen(),status:()=>{const s=owner.__weatherTemperature;return {active:!!(s?.config?.visible&&(s.config.surface||s.config.labels||s.config.advection)),available:!knownFailure(s)||!!s?.field,detail:s?.status||''};}});
 add({id:'precipitation',key:'precipitation',icon:asset('gr-precipitation-premium-original.png'),button:'weather-precipitation-toggle',tap:()=>owner._weatherLayerMenuToggle('weather.precipitation.layer'),hold:()=>owner._weatherPrecipitationOpen(),status:()=>{const s=owner._weatherRadarState?.(),catalog=owner.__weatherLayerMenuState?.model?.capabilities?.find(c=>c.id==='weather.precipitation.layer');return {active:!!s?.enabled,available:catalog?.available!==false&&!knownFailure(s),detail:s?.lastUnavailable?.code||''};}});
 add({id:'weather-display',key:'display',icon:asset('gr-weather-display-premium-original.png'),button:'weather-display-control',tap:()=>owner._weatherDisplayOpenFromLayerMenu(),hold:()=>owner._weatherDisplayOpenFromLayerMenu(),status:()=>{
  const radar=owner._weatherRadarState?.(),states=[...(owner.__weatherGenericStates?.values?.()||[])],enabled=[...(radar?.enabled?[radar]:[]),...states.filter(s=>s.enabled)],d=owner.__weatherDisplayState;
  // This menu manages radar and generic WR raster layers, not numeric Wind/Temp.
  return {active:enabled.length>0,available:enabled.length?enabled.some(s=>!knownFailure(s)):!['missing','offline','incompatible'].includes(d?.status),detail:d?.status||''};
 }});
 return {entries,add};
}
