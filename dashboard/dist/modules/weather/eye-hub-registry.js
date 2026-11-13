// Existing public UI actions and authoritative consumer/UI states only.
const asset=name=>new URL('../../assets/'+name,import.meta.url).href;
export const EYE_MASTERS=Object.freeze({open:new URL('../../assets/gr-eye-open-master-1254.png', import.meta.url).href,closed:new URL('../../assets/gr-eye-closed-master-1254.png', import.meta.url).href});
const knownFailure=s=>Boolean(s?.fieldError||s?.error||s?.lastUnavailable||['failed','unavailable','error'].includes(s?.status));
// An unqueried/off weather layer is NOT a failed WR provider. Only a completed
// negative consumer response or an actual connection failure can warn the Eye.
export function synopticEyeStatus(state){
 const active=state?.config?.visible===true;
 const now=Date.now();
 const valid=Object.values(state?.frames||{}).some(f=>f&&Number.isFinite(Date.parse(f.valid_until))&&Date.parse(f.valid_until)>now);
 const error=Object.values(state?.status||{}).some(v=>typeof v==='string'&&v.length>0);
 const availability=valid?'available':state?.pending?'loading':error?'unavailable':active?'not-loaded':'off';
 return {active,available:availability!=='unavailable',availability,detail:availability==='off'?'Ausgeschaltet · Daten ungeprüft':availability==='not-loaded'?'Daten noch nicht geladen':availability==='loading'?'WR-V2-Abfrage läuft':availability==='unavailable'?'WR-V2: '+Object.values(state?.status||{}).filter(Boolean).join(' · '):Object.values(state?.status||{}).filter(Boolean).join(' · ')};
}
// Generic representations of these three main functions are already owned.
export const eyeLayerOwner=id=>/precipitation|radar/.test(id)?'precipitation':/wind/.test(id)?'wind':/temperature/.test(id)?'temperature':'weather-display';
export function createEyeRegistry(owner){
 const entries=new Map(),add=entry=>{if(!/^[a-z][a-z0-9-]*$/.test(entry.id)||entries.has(entry.id))throw Error('Invalid/duplicate Eye function');entries.set(entry.id,Object.freeze(entry));};
 add({id:'wind',key:'wind',icon:asset('gr-wind-animation-toggle-premium-v1-272.webp'),button:'weather-wind-toggle',tap:()=>owner._weatherWindToggle(),hold:()=>owner._weatherWindOpen(),status:()=>{const s=owner.__weatherWind,c=s?.config;return {active:!!(c?.visible&&(c.enabled||c.colorField)),available:(!knownFailure(s)&&!(s?.errors?.length&&!s?.points?.length&&!s?.field))||!!s?.field||!!(s?.points?.length&&!['animated','snake'].includes(c?.mode)),detail:s?.status||''};}});
 add({id:'temperature',key:'temperature',icon:asset('gr-temperature-premium-v1-272.webp'),button:'weather-temperature-toggle',tap:()=>{const s=owner._weatherTemperatureState();owner._weatherTemperatureSet({visible:!s.config.visible});},hold:()=>owner._weatherTemperatureOpen(),status:()=>{const s=owner.__weatherTemperature;return {active:!!(s?.config?.visible&&(s.config.surface||s.config.labels||s.config.advection)),available:!knownFailure(s)||!!s?.field,detail:s?.status||''};}});
 add({id:'precipitation',key:'precipitation',icon:asset('gr-precipitation-premium-original.png'),button:'weather-precipitation-toggle',tap:()=>owner._weatherLayerMenuToggle('weather.precipitation.layer'),hold:()=>owner._weatherPrecipitationOpen(),status:()=>{const s=owner._weatherRadarState?.(),catalog=owner.__weatherLayerMenuState?.model?.capabilities?.find(c=>c.id==='weather.precipitation.layer');return {active:!!s?.enabled,available:catalog?.available!==false&&!knownFailure(s),detail:s?.lastUnavailable?.code||''};}});
 add({id:'synoptic',key:'synoptic',icon:asset('gr-synoptic-high-low-isobars-premium-original.png'),button:'weather-synoptic-toggle',tap:()=>owner._weatherSynopticToggle(),hold:()=>owner._weatherSynopticOpen(),status:()=>synopticEyeStatus(owner.__weatherSynoptic||owner._weatherSynopticState?.())}});
 add({id:'weather-display',key:'display',icon:asset('gr-weather-display-premium-original.png'),button:'weather-display-control',tap:()=>owner._weatherDisplayOpenFromLayerMenu(),hold:()=>owner._weatherDisplayOpenFromLayerMenu(),status:()=>{
  const enabled=[...(owner.__weatherGenericStates?.entries?.()||[])].filter(([id,s])=>eyeLayerOwner(id)==='weather-display'&&s.enabled).map(([,s])=>s),d=owner.__weatherDisplayState;
  // Only additional visible layers (e.g. clouds), never a second Radar/Wind/Temp ring.
  return {active:enabled.length>0,available:enabled.length?enabled.some(s=>!knownFailure(s)):!['missing','offline','incompatible'].includes(d?.status),detail:d?.status||''};
 }});
 return {entries,add};
}
