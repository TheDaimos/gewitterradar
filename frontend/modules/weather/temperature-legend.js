import {temperatureUnitSymbol} from './temperature-units.js?v=411156r1';
import {createScientificLegend,legendParagraphs,legendScale} from './premium-legend.js?v=411180r1';
import {temperatureColor,temperatureText,temperatureLegendRange,advectionColor,advectionLegendClasses} from './temperature-data.js?v=411159r1';
export function createTemperatureLegend(owner,kind){
 const s=owner._weatherTemperatureState(),temperature=kind==='temperature',narrow=(owner._map?.getSize().x||800)<720;
 return createScientificLegend(owner,{prefix:'weather-'+kind+'-legend-',ui:s.config.legendUi[kind],position:s.config.legendPositions[kind]||{x:temperature||narrow?0:1,y:narrow&&!temperature?.48:.98},
  visible:()=>s.config.visible&&s.config[temperature?'temperatureLegend':'advectionLegend']&&(temperature||s.config.advection),
  saveUi:ui=>{s.config.legendUi[kind]={...ui};owner._weatherTemperatureSave();},savePosition:p=>{s.config.legendPositions[kind]=p;owner._weatherTemperatureSave();},close:()=>owner._weatherTemperatureSet({[temperature?'temperatureLegend':'advectionLegend']:false}),title:()=>temperature?'Temperatur · 2 m':'Thermische Advektion · 850 hPa',
  render:view=>{
   const c=s.config,f=s.field,fmt=v=>temperatureText(v+273.15,c.unit,true,owner._locale());let visual,explanation;
   if(temperature){
    const [min,max]=temperatureLegendRange(f,c),entries=c.stops.map((v,i)=>({color:temperatureColor(v+273.15,c),label:(i===0?'≤':i===8?'≥':'')+fmt(v)+(i>0&&i<8?' bis <'+fmt(c.stops[i+1]):'')}));
    entries[0].label='<'+fmt(c.stops[1]);
    visual=legendScale(entries,view,{gradient:'linear-gradient(90deg,'+Array.from({length:49},(_,i)=>temperatureColor(273.15+min+(max-min)*i/48,c)+' '+i/48*100+'%').join(',')+')',ticks:[min,(min+max)/2,max].map(fmt)});
    explanation=legendParagraphs(['Die Temperaturfarben verlaufen kontinuierlich zwischen den dargestellten Stützpunkten. Die Klassenansicht benennt diese Farbbereiche, ohne die Rasterwerte zu quantisieren.','Violett ausschließlich für extreme Hitze ab '+fmt(c.stops[8])+'. Darstellungsgrenzen sind keine Warnschwellen.','2-m-Modelltemperatur, keine Stationsmessung. Native Beschriftungen erhöhen die Datenauflösung nicht.']);
   }else{
    const entries=advectionLegendClasses(c.advectionStrength);visual=legendScale(entries,view,{gradient:'linear-gradient(90deg,'+entries.map(e=>e.color).join(',')+')',ticks:[-.4,-.05,0,.05,.4,2].map((n,i)=>(i===0?'≤':i===5?'≥':'')+(n>0?'+':'')+Number((n/c.advectionStrength).toFixed(3)).toLocaleString(owner._locale(),{maximumFractionDigits:3}))});
    const unit=document.createElement('strong');unit.textContent='Advektions-Farbstufen · K/h';visual.prepend(unit);explanation=legendParagraphs([owner._t('flow.advectionHelp'),'Farben und Grenzen stammen aus derselben Klassifizierung wie die Pfeile. Schwellen sind durch die eingestellte Farbdifferenzierung geteilt; Einheit bleibt K/h, unabhängig von °C/°F/K.','−v · ∇T auf gemeinsamer 850-hPa-Ebene. Richtung folgt dem Wind; Farbe beschreibt den horizontalen thermischen Transport. Keine tatsächliche lokale Temperaturänderung und kein 2-m-Trend. NoData und Bereiche unter Modellboden bleiben ausgespart.',c.flowForm!=='classic'?owner._t('flow.'+(c.flowForm==='curved_arrows'?'arrowsHelp':'linesHelp')):'','Bewegung visuell skaliert. '+(c.paused?'Animation pausiert.':'Tempo '+c.tempo+' · Dichte '+c.density+'.'),f?.advection.status!=='ready'?'Nicht verfügbar: '+(f?.advection.unavailable?.code||s.error||s.status):'']);
   }
   const source=legendParagraphs([f?.provenance.attribution,f?'Modelllauf UTC: '+f.model_run+' · Gültig UTC: '+f.valid_at+' · WR-Freigabe bis UTC: '+f.valid_until:s.status]);source.className='gr-legend-source';return {visual,explanation,source};
  }
 });
}
export function updateTemperatureLegends(owner){const s=owner._weatherTemperatureState();for(const kind of ['temperature','advection']){if(!s.legends[kind]&&s.config.visible&&s.config[kind==='temperature'?'temperatureLegend':'advectionLegend'])s.legends[kind]=createTemperatureLegend(owner,kind);s.legends[kind]?._weatherLegendSetModel(kind,{family:'temperature',title:kind,unit:kind==='temperature'?temperatureUnitSymbol(s.config.unit):'K/h',entries:[{label:kind,color:'#fff'}],active:true});}}
