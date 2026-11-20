import {createScientificLegend,legendParagraphs,legendScale} from './premium-legend.js?v=411247r1';
import {WIND_COLORS,BEAUFORT_LIMITS,windSpeedText} from './wind-data.js?v=411211r1';
import {WIND_FIELD_COLORS} from './wind-field.js?v=411211r1';
import {drawWindGlyph} from './wind-canvas.js?v=411211r1';
export function createWindLegend(owner){
 const state=owner._weatherWindState();
 const t=(key,vars)=>owner._t('weather.legend.'+key,vars);
 return createScientificLegend(owner,{prefix:'weather-wind-legend-',ui:state.config.legendUi,position:state.config.legendPosition,
  visible:()=>state.legendOpen&&state.config.visible,saveUi:ui=>{state.config.legendUi={...ui};owner._weatherWindSave();},savePosition:p=>{state.config.legendPosition=p;owner._weatherWindSave();},close:()=>{state.legendOpen=false;state.legend?._weatherLegendSyncUi();},title:()=>t('wind10m'),
  render:view=>{
   const c=state.config,f=state.field,color=WIND_COLORS.find(v=>v.id===c.color)?.hex||'#fff';
   const entries=BEAUFORT_LIMITS.map((v,i)=>({color:WIND_FIELD_COLORS[i],label:i+' Bft · '+(i<12
    ?t('range',{low:windSpeedText(v,c.unit),high:windSpeedText(BEAUFORT_LIMITS[i+1],c.unit)})
    :t('andAbove',{low:windSpeedText(v,c.unit)}))}));
   const visual=document.createElement('div');visual.className='gr-scientific-visual';
   if(c.mode==='barbs'){
    const row=document.createElement('div');row.style.cssText='display:flex;flex-wrap:wrap;gap:10px';
    for(const [kn,label] of [[0,t('calm')+'*'],[5,'5 kn'],[10,'10 kn'],[50,'50 kn'],[65,'65 kn']]){const item=document.createElement('span'),canvas=document.createElement('canvas');canvas.width=90;canvas.height=65;canvas.style.cssText='width:55px;height:40px;display:block';const ctx=canvas.getContext('2d');ctx.translate(45,48);drawWindGlyph(ctx,'barbs',kn*1.852/3.6,Math.PI/2,color);item.append(canvas,document.createTextNode(label));row.append(item);}visual.append(row);
   }
   visual.append(legendScale(entries,view,{ticks:[0,4,8,12].map(i=>windSpeedText(BEAUFORT_LIMITS[i],c.unit))}));
   const modeKey={snake:'windSnake',barbs:'windBarbs',arrows:'windArrows'}[c.mode] || (f?'windSegmentsField':'windSegmentsPoints');
   const explanation=legendParagraphs([
    t(modeKey),
    c.mode==='animated'?[t('visuallyScaled'),t('animationControls',c)+'.',t(c.paused?'paused':'noWind')].join(' '):'',
    c.mode==='animated'&&c.flowForm!=='classic'?owner._t('flow.'+(c.flowForm==='curved_arrows'?'arrowsHelp':'linesHelp')):'',
    t('windScale'),t('highLowColors'),
    c.colorField&&!f?t('noWindShading',{reason:state.fieldError||owner._weatherStatusText(state.status)}):''
   ]);
   const source=legendParagraphs([
    f?.provenance.attribution,
    f?t('modelValidity',{run:f.model_run,valid:f.valid_at,until:f.valid_until}):owner._weatherStatusText(state.status),
    ...state.points.map(p=>[p.lat.toFixed(3)+'°, '+p.lon.toFixed(3)+'°',windSpeedText(p.speed,c.unit),
      t('from',{value:p.from===null?t('calm'):p.from+'°'}),p.attribution,p.validAt].join(' · '))
   ]);
   source.className='gr-legend-source';
   return {visual,explanation,source};
  }
 });
}
export function updateWindLegend(view,owner){const state=owner._weatherWindState();view._weatherLegendSetModel('wind',{family:'wind',title:owner._t(state.field?'weather.legend.windField':'weather.legend.windPoints'),unit:state.config.unit,entries:[{label:owner._t('eye.wind'),color:'#fff'}],active:true});}
