import {temperatureUnitSymbol} from './temperature-units.js?v=411156r1';
import {createScientificLegend,legendParagraphs,legendScale} from './premium-legend.js?v=411224r1';
import {temperatureColor,temperatureText,temperatureLegendRange,advectionColor,advectionLegendClasses} from './temperature-data.js?v=411159r1';
export function createTemperatureLegend(owner,kind){
 const s=owner._weatherTemperatureState(),temperature=kind==='temperature',narrow=(owner._map?.getSize().x||800)<720;
 const t=(key,vars)=>owner._t('weather.legend.'+key,vars);
 return createScientificLegend(owner,{prefix:'weather-'+kind+'-legend-',ui:s.config.legendUi[kind],position:s.config.legendPositions[kind]||{x:temperature||narrow?0:1,y:narrow&&!temperature?.48:.98},
  visible:()=>s.config.visible&&s.config[temperature?'temperatureLegend':'advectionLegend']&&(temperature||s.config.advection),
  saveUi:ui=>{s.config.legendUi[kind]={...ui};owner._weatherTemperatureSave();},savePosition:p=>{s.config.legendPositions[kind]=p;owner._weatherTemperatureSave();},close:()=>owner._weatherTemperatureSet({[temperature?'temperatureLegend':'advectionLegend']:false}),title:()=>t(temperature?'temperature2m':'advection850'),
  render:view=>{
   const c=s.config,f=s.field,fmt=v=>temperatureText(v+273.15,c.unit,true,owner._locale());let visual,explanation;
   if(temperature){
    const [min,max]=temperatureLegendRange(f,c),entries=c.stops.map((v,i)=>({color:temperatureColor(v+273.15,c),label:i>0&&i<8?t('range',{low:fmt(v),high:fmt(c.stops[i+1])}):(i===0?'≤':'≥')+fmt(v)}));
    entries[0].label='<'+fmt(c.stops[1]);
    visual=legendScale(entries,view,{gradient:'linear-gradient(90deg,'+Array.from({length:49},(_,i)=>temperatureColor(273.15+min+(max-min)*i/48,c)+' '+i/48*100+'%').join(',')+')',ticks:[min,(min+max)/2,max].map(fmt)});
    explanation=legendParagraphs([t('temperatureScale'),t('temperatureViolet',{temperature:fmt(c.stops[8])}),t('temperatureModel')]);
   }else{
    const entries=advectionLegendClasses(c.advectionStrength).map(entry=>{
     const [low,high]=entry.label.split(' bis ');
     return high?{...entry,label:owner._t('weather.status.interval',{low,high})}:entry;
    });visual=legendScale(entries,view,{gradient:'linear-gradient(90deg,'+entries.map(e=>e.color).join(',')+')',ticks:[-.4,-.05,0,.05,.4,2].map((n,i)=>(i===0?'≤':i===5?'≥':'')+(n>0?'+':'')+Number((n/c.advectionStrength).toFixed(3)).toLocaleString(owner._locale(),{maximumFractionDigits:3}))});
    const unit=document.createElement('strong');
    unit.textContent=t('advectionScale');visual.prepend(unit);
    explanation=legendParagraphs([owner._t('flow.advectionHelp'),t('advectionThresholds'),t('advectionModel'),
      c.flowForm!=='classic'?owner._t('flow.'+(c.flowForm==='curved_arrows'?'arrowsHelp':'linesHelp')):'',
      t('visuallyScaled')+' '+(c.paused?t('paused'):t('animationControls',c)+'.'),
      f?.advection.status!=='ready'?t('unavailableReason',{reason:f?.advection.unavailable?.code||s.error||owner._weatherStatusText(s.status)}):''
    ]);
   }
   const source=legendParagraphs([f?.provenance.attribution,f?t('modelValidity',{run:f.model_run,valid:f.valid_at,until:f.valid_until}):owner._weatherStatusText(s.status)]);source.className='gr-legend-source';return {visual,explanation,source};
  }
 });
}
export function updateTemperatureLegends(owner){const s=owner._weatherTemperatureState();for(const kind of ['temperature','advection']){if(!s.legends[kind]&&s.config.visible&&s.config[kind==='temperature'?'temperatureLegend':'advectionLegend'])s.legends[kind]=createTemperatureLegend(owner,kind);s.legends[kind]?._weatherLegendSetModel(kind,{family:'temperature',title:kind,unit:kind==='temperature'?temperatureUnitSymbol(s.config.unit):'K/h',entries:[{label:kind,color:'#fff'}],active:true});}}
