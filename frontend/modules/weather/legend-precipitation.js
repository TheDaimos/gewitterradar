import {renderLegendScale} from './legend-scale.js?v=41217r1';

// Presentation only: never sort/mutate the router snapshot or raster layers.
export const precipitationSourceId=model=>String(model.source_id||model.source||model.id||'').replace(/^precipitation:/,'').replace(/#(?:rain|snow)$/,'');
export const precipitationKind=model=>model.kind||(model.family==='snow'?'snow':'rain');
const isRy=model=>precipitationSourceId(model)==='dwd/radar_precipitation_quality_checked';
export function precipitationRank(model){const id=precipitationSourceId(model);return model.sharedRadar||['dwd/radar_precipitation','opera/opera_rate_raster'].includes(id)?0:id.startsWith('nasa_gibs/')&&precipitationKind(model)==='rain'?1:isRy(model)?2:id.startsWith('nasa_gibs/')&&precipitationKind(model)==='snow'?3:4;}
const compare=(a,b)=>precipitationRank(a)-precipitationRank(b)||precipitationSourceId(a).localeCompare(precipitationSourceId(b),'en')||precipitationKind(a).localeCompare(precipitationKind(b),'en');
export const hasPrecipitationColors=model=>!!model.entries?.length&&model.entries.every(e=>/^#(?:[a-f\d]{3}|[a-f\d]{6}|[a-f\d]{8})$/i.test(e.color||''));
const signature=m=>JSON.stringify([m.quantity,m.unit,precipitationKind(m),m.entries,m.ticks||[]]);
export function precipitationPresentation(models,group,t){
 const all=group([...models].sort(compare),t).sort(compare),visible=[],omitted=[];
 for(const model of all){
  if(!hasPrecipitationColors(model)){omitted.push({...model,presentationStatus:'missingColors'});continue;}
  // RY can share a scale only with complete, identical, explicitly specified
  // quantity/unit/classes/ticks. No equivalence follows from its provider name.
  const equivalent=isRy(model)&&model.quantity&&model.unit&&visible.find(other=>!isRy(other)&&other.quantity&&other.unit&&(signature(other)===signature(model)||other.sharedRadar&&models.some(member=>(other.sources||[]).includes(member.source||member.id)&&signature(member)===signature(model))));
  if(equivalent){equivalent.sources=[...new Set([...(equivalent.sources||[equivalent.source||equivalent.id]),model.source||model.id])];omitted.push({...model,presentationStatus:'coveredScale'});}else visible.push({...model});
 }
 return {models:visible,omitted,originals:[...models].sort(compare)};
}
export function precipitationMetadata(owner){
 const state=owner._weatherRadarState?.();
 if(Array.isArray(state?.v2Snapshot?.layers))return state.v2Snapshot.layers;
 const answer=state?.lastReady?.answer,payload=answer?.resource?.payload;
 if(!payload)return [];
 // Match the existing V1 renderer's identifier exactly; V1 keeps semantics in
 // resource and actual image time/age in freshness, unlike the V2 layer shape.
 const source_id=answer.provenance?.provider_name==='opera'?'opera/opera_rate_raster':(answer.provenance?.provider_id||'weather')+'/'+(answer.provenance?.layer_id||'precipitation');
 return [{source_id,legend:payload.legend,semantics:answer.resource.semantics,attribution:payload.attribution||answer.provenance?.attribution,times:{valid_at:answer.freshness?.data_time,age_seconds:answer.freshness?.age_seconds,stale:answer.freshness?.stale},freshness:answer.freshness,provenance:answer.provenance,quality:answer.quality,provider_metadata:payload.provider_metadata}];
}
export function lowerDetectionLimits(models,t,locale){
 const parts=[];
 for(const model of models){const id=precipitationSourceId(model),first=model.radarComparison?.[0];if(!first||!['dwd/radar_precipitation','opera/opera_rate_raster'].includes(id))continue;
  const name=id.startsWith('dwd/')?'DWD':'OPERA',number=Number(first.lower).toLocaleString(locale||undefined,{maximumFractionDigits:10});
  const boundary=first.lowerInclusive?t('weather.legend.fromThreshold',{low:number}):t('legendHub.greaterThan',{value:number});parts.push(name+' '+boundary+' '+model.unit);
 }
 return parts.length?t('legendHub.lowerLimits')+': '+parts.join('; ')+'.':'';
}
// Both the map instrument and the one existing settings preview use this path.
export function renderPrecipitationScales(models,c,{width=430,height=600,columns:preferredColumns}={}){
 const grid=document.createElement('div');grid.className='lh-precipitation-scales';
 const vertical=c.orientation==='vertical',columns=vertical?(preferredColumns||Math.min(models.length||1,Math.max(1,Math.floor(width/104)))):1,rows=Math.ceil(models.length/columns)||1;
 grid.style.cssText='display:grid;align-items:start;gap:8px;grid-template-columns:repeat('+columns+',minmax(0,max-content))';
 const available=vertical?Math.max(60,(height-16)/rows-(c.showCaption?56:8)-22):Math.max(60,width);
 for(const model of models){const item=document.createElement('div');item.className='lh-precipitation-scale';item.dataset.weatherLegendSource=model.source||model.id;item.dataset.weatherLegendSources=(model.sources||[model.source||model.id]).join(' ');
  const scale=renderLegendScale(model,{...c,unitInCaption:true},available);item.style.maxWidth=vertical?Math.max(96,parseFloat(scale.style.width)||96)+'px':'100%';
  if(c.showCaption){const caption=document.createElement('p');caption.className='lh-instrument-caption';caption.textContent=model.title+(model.unit?' · '+model.unit:'');caption.title=caption.textContent;item.append(caption);}
  if(!c.showCaption&&scale.dataset.needsUnit==='true'){const unit=document.createElement('span');unit.className='lh-instrument-unit';unit.textContent=model.unit;item.append(unit);}item.append(scale);grid.append(item);
 }
 return grid;
}
