import {moonIcon} from './moon-legend.js?v=4134r1';
import {temperatureUnitSymbol} from './temperature-units.js?v=411156r1';
import {BEAUFORT_LIMITS,windSpeedText} from './wind-data.js?v=411159r1';
import {WIND_FIELD_COLORS} from './wind-field.js?v=411211r1';
import {temperatureColor,temperatureText,temperatureLegendRange,advectionLegendClasses} from './temperature-data.js?v=411159r1';
// Read authoritative native configurations/palettes at render time. Never keep
// a second weather-data registry or convert palette coordinates into new values.
export function legendDescriptor(owner,id){
 if(id==='wind'){const c=owner._weatherWindState().config;return {unit:c.unit,gradient:'linear-gradient(90deg,'+WIND_FIELD_COLORS.join(',')+')',entries:BEAUFORT_LIMITS.map((v,i)=>({value:v,color:WIND_FIELD_COLORS[i],label:windSpeedText(v,c.unit)})),ticks:BEAUFORT_LIMITS.map((v,i)=>({position:i/12,label:(i===12?'≥':'')+windSpeedText(v,c.unit)}))};}
 if(id==='temperature'){const s=owner._weatherTemperatureState(),c=s.config,[min,max0]=temperatureLegendRange(s.field,c),max=max0,fmt=v=>temperatureText(v+273.15,c.unit,true,owner._locale()),sample=p=>temperatureColor(273.15+min+(max-min)*p,c);return {unit:temperatureUnitSymbol(c.unit),entries:c.stops.map(v=>({value:v,color:temperatureColor(v+273.15,c),label:fmt(v)})),gradient:'linear-gradient(90deg,'+Array.from({length:65},(_,i)=>sample(i/64)+' '+i/64*100+'%').join(',')+')',sample,ticks:[...new Set([min,max,(min+max)/2,min+(max-min)/4,min+(max-min)*.75,...c.stops.filter(v=>v>min&&v<max)])].sort((a,b)=>a-b).map(v=>({position:max===min?.5:(v-min)/(max-min),label:fmt(v)}))};}
 if(id==='advection'){const c=owner._weatherTemperatureState().config,values=[-.4,-.05,0,.05,.4,2],entries=advectionLegendClasses(c.advectionStrength).map(entry=>{const [low,high]=entry.label.split(' bis ');return high?{...entry,label:owner._t('weather.status.interval',{low,high})}:entry;});return {unit:'K/h',entries,ticks:values.map((v,i)=>({position:[0,2/6,2.5/6,3/6,4/6,5/6][i],center:i===2,label:(i===0?'≤':i===5?'≥':'')+Number((v/c.advectionStrength).toFixed(3)).toLocaleString(owner._locale(),{maximumFractionDigits:3})}))};}
 return null;
}
export const legendTitle=(owner,id)=>id==='moon'?owner._t('legendHub.moonTitle'):owner._t(id==='advection'?'weather.legend.advection850':id==='other'?'weather.legend.legend':'eye.'+id);
export function legendEntries(owner){const entries=owner._eyeHubState().registry.entries;return ['precipitation','wind','temperature','advection','synoptic','other','moon'].map(id=>({id,title:legendTitle(owner,id),icon:id==='moon'?moonIcon:entries.get(id==='advection'?'temperature':id==='other'?'weather-display':id)?.icon}));}
