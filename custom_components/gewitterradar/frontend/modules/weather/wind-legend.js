import {createScientificLegend,legendParagraphs,legendScale} from './premium-legend.js?v=411160r1';
import {WIND_COLORS,BEAUFORT_LIMITS,windSpeedText} from './wind-data.js?v=411161r1';
import {WIND_FIELD_COLORS} from './wind-field.js?v=411161r1';
import {drawWindGlyph} from './wind-canvas.js?v=411161r1';
export function createWindLegend(owner){
 const state=owner._weatherWindState();
 return createScientificLegend(owner,{prefix:'weather-wind-legend-',ui:state.config.legendUi,position:state.config.legendPosition,
  visible:()=>state.legendOpen&&state.config.visible,saveUi:ui=>{state.config.legendUi={...ui};owner._weatherWindSave();},savePosition:p=>{state.config.legendPosition=p;owner._weatherWindSave();},close:()=>{state.legendOpen=false;state.legend?._weatherLegendSyncUi();},title:()=> 'Wind · 10 m',
  render:view=>{
   const c=state.config,f=state.field,color=WIND_COLORS.find(v=>v.id===c.color)?.hex||'#fff';
   const entries=BEAUFORT_LIMITS.map((v,i)=>({color:WIND_FIELD_COLORS[i],label:i+' Bft · '+windSpeedText(v,c.unit)+(i<12?' bis <'+windSpeedText(BEAUFORT_LIMITS[i+1],c.unit):' und mehr')}));
   const visual=document.createElement('div');visual.className='gr-scientific-visual';
   if(c.mode==='barbs'){
    const row=document.createElement('div');row.style.cssText='display:flex;flex-wrap:wrap;gap:10px';
    for(const [kn,label] of [[0,'Windstille*'],[5,'5 kn'],[10,'10 kn'],[50,'50 kn'],[65,'65 kn']]){const item=document.createElement('span'),canvas=document.createElement('canvas');canvas.width=90;canvas.height=65;canvas.style.cssText='width:55px;height:40px;display:block';const ctx=canvas.getContext('2d');ctx.translate(45,48);drawWindGlyph(ctx,'barbs',kn*1.852/3.6,Math.PI/2,color);item.append(canvas,document.createTextNode(label));row.append(item);}visual.append(row);
   }
   visual.append(legendScale(entries,view,{ticks:[0,4,8,12].map(i=>windSpeedText(BEAUFORT_LIMITS[i],c.unit))}));
   const explanation=legendParagraphs([
    c.mode==='snake'?'Schlangenförmige Animation: ein eigener verjüngter Körper mit rundem Führungskopf. Die Körperbahn ist die begrenzte numerische Trajektorie; ihre Weglänge passt sich während der Bewegung weich an die lokale Windgeschwindigkeit an. Keine Tierbewegung, keine künstlichen Wirbel. Benötigt ein numerisches WR-Windfeld.':c.mode==='barbs'?'Der Schaft zeigt zur Windherkunft. Halbfieder 5 kn · Vollfieder 10 kn · Dreieck 50 kn. Kombinationen addieren sich. *Auf die nächsten 5 kn gerundet; unter 2,5 kn Windstillesymbol, nicht zwingend exakt 0 m/s. 1 kn = 1,852 km/h.':c.mode==='arrows'?'Die Pfeilspitze zeigt die Strömungsrichtung; die meteorologische Gradangabe bezeichnet die Herkunft.':f?'Segmente folgen dem numerischen 10-m-Windfeld. NoData wird nicht überbrückt.':'Segmente zeigen lokale WR-Punktvektoren; zwischen isolierten Punkten wird kein Feld erfunden.',
    c.mode==='animated'?'Die begrenzte, nichtlineare Bewegung ist visuell skaliert. Tempo '+c.tempo+' · Dichte '+c.density+(c.paused?' · pausiert.':'. Bei 0 m/s keine Strömung.'):'',
    c.mode==='animated'&&c.flowForm!=='classic'?owner._t('flow.'+(c.flowForm==='curved_arrows'?'arrowsHelp':'linesHelp')):'',
    'Die Farbskala zeigt gleich breite Beaufort-Stufen 0–12, keine lineare m/s-Achse. Innerhalb jeder Stufe verlaufen die Farben stetig. Symbolfarbe und Farbflächen-Deckkraft bleiben unabhängig.',
    'Hoch-/Tiefdruckfarben bleiben ohne autoritative WR-Klassifikation inaktiv.',
    c.colorField&&!f?'Farbfläche nicht verfügbar: '+(state.fieldError||state.status)+'. Keine Flächeninterpolation aus Punktwerten.':''
   ]);
   const source=legendParagraphs([f?.provenance.attribution,f?'Modelllauf UTC: '+f.model_run+' · Gültig UTC: '+f.valid_at+' · WR-Freigabe bis UTC: '+f.valid_until:state.status,...state.points.map(p=>p.lat.toFixed(3)+'°, '+p.lon.toFixed(3)+'° · '+windSpeedText(p.speed,c.unit)+' · Herkunft '+(p.from===null?'Windstille':p.from+'°')+' · '+p.attribution+' · '+p.validAt)]);source.className='gr-legend-source';
   return {visual,explanation,source};
  }
 });
}
export function updateWindLegend(view,owner){const state=owner._weatherWindState();view._weatherLegendSetModel('wind',{family:'wind',title:state.field?'WR-Windfeld · 10-m-Modellvorhersage':'WR-Windpunktwerte',unit:state.config.unit,entries:[{label:'Wind',color:'#fff'}],active:true});}
