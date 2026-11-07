import { installWeatherLegendOverlay } from './legend-overlay.js?v=411149r1';
import { WIND_COLORS,BEAUFORT_LIMITS,windSpeedText } from './wind-data.js?v=411153r1';
import { drawWindGlyph } from './wind-canvas.js?v=411153r1';
import { WIND_FIELD_COLORS } from './wind-field.js?v=411153r1';

// Reuse the existing premium overlay, drag, bounds and chevrons with isolated storage.
class WindLegend {}
installWeatherLegendOverlay(WindLegend,{});
export function createWindLegend(owner){
 const view=new WindLegend(),originalEnsure=view._weatherLegendEnsureUi,originalSync=view._weatherLegendSyncUi;
 const state=owner._weatherWindState();
 view.shadow={getElementById:id=>owner.shadow?.getElementById(id.startsWith('weather-legend-')?id.replace('weather-legend-','weather-wind-legend-'):id),
  append:node=>{if(node.id==='weather-legend-style')node.id='weather-wind-legend-style';owner.shadow?.append(node);}};
 view.__weatherLegendState={models:new Map(),resizeHandler:null,resizeObserver:null,collapsed:false,anchor:null,ui:state.config.legendUi,position:state.config.legendPosition,mounted:false};
 view._weatherLegendMode=()=>state.legendOpen&&state.config.visible?'auto':'off';
 view._weatherLegendSavePosition=position=>{state.config.legendPosition=position;owner._weatherWindSave();};
 view._weatherLegendSaveUi=ui=>{state.config.legendUi={...ui};owner._weatherWindSave();};
 view._weatherDisplaySetLegendMode=()=>{state.legendOpen=false;view._weatherLegendSyncUi();};
 view._weatherLegendEnsureUi=function(){const host=originalEnsure.call(this);if(host){host.id='weather-wind-legend-overlay';host.setAttribute('aria-label','Windlegende');}return host;};
 view._weatherLegendSyncUi=function(){originalSync.call(this);const host=owner.shadow?.getElementById('weather-wind-legend-overlay');if(!host)return;
  const heading=host.querySelector('[data-weather-legend-heading]');if(heading)heading.textContent='Wind · 10 m';
  const title=host.querySelector('.weather-legend-section-head strong');if(title)title.textContent='Windlegende';
  const toggle=host.querySelector('[data-weather-section-toggle]');toggle?.setAttribute('aria-label','Windlegende ein- oder ausklappen');
  // No colour-field scale exists without numeric spatial data. Hide the irrelevant scale-view picker.
  const picker=host.querySelector('.weather-legend-view-picker');if(picker){picker.hidden=true;picker.style.display='none';}
 };
 view._weatherLegendRenderVisual=()=>{
  const box=document.createElement('div');box.style.cssText='width:100%;font:11px/1.5 system-ui;overflow-wrap:anywhere;color:#dce3ec';
  const paragraph=text=>{const p=document.createElement('p');p.style.margin='5px 0';p.textContent=text;box.append(p);};
  const c=state.config,color=WIND_COLORS.find(v=>v.id===c.color)?.hex||'#fff';
  if(c.mode==='barbs'){
   const row=document.createElement('div');row.style.cssText='display:flex;flex-wrap:wrap;gap:10px';
   for(const [kn,label] of [[0,'Windstille*'],[5,'5 kn'],[10,'10 kn'],[50,'50 kn'],[65,'65 kn']]){
    const item=document.createElement('span'),canvas=document.createElement('canvas');canvas.width=90;canvas.height=65;canvas.style.cssText='width:55px;height:40px;display:block';const ctx=canvas.getContext('2d');ctx.translate(45,48);drawWindGlyph(ctx,'barbs',kn*1.852/3.6,Math.PI/2,color);item.append(canvas,document.createTextNode(label));row.append(item);
   }box.append(row);
   paragraph('Der Schaft zeigt zur Windherkunft. Halbfieder 5 kn · Vollfieder 10 kn · Dreieck 50 kn. Kombinationen addieren sich.');
   paragraph('*Fiederwerte werden auf die nächsten 5 kn gerundet; unter 2,5 kn erscheint das Windstillesymbol. Dies bedeutet nicht zwingend exakt 0 m/s. 1 kn = 1,852 km/h.');
  }else if(c.mode==='arrows')paragraph('Die Pfeilspitze zeigt die Strömungsrichtung: wohin die Luft zieht. Die meteorologische Gradangabe bezeichnet dagegen die Herkunft.');
  else{
   paragraph(state.field?'Kurze Segmente folgen dem zusammenhängenden numerischen 10-m-Windfeld. U-/V-Komponenten werden innerhalb gültiger Gitterzellen interpoliert; NoData wird nicht überbrückt.':'Kurze Segmente zeigen die Strömungsrichtung am jeweils durch WR aufgelösten Punkt. Zwischen isolierten Punkten wird kein Windfeld interpoliert.');
   paragraph('Mehr Wind bewegt die Segmente schneller; die begrenzte, nichtlineare Animation ist keine maßstäbliche Luftbewegung. Dichte: '+({low:'Gering',normal:'Normal',high:'Hoch'}[c.density])+'. Tempo: '+({slow:'Langsam',normal:'Normal',fast:'Schnell'}[c.tempo])+'.');
   paragraph(c.paused?'Animation pausiert.':!c.animationExplicit&&matchMedia('(prefers-reduced-motion: reduce)').matches?'Bewegung aufgrund der Systemeinstellung reduziert.':'Bei exakt 0 m/s wird keine Strömung erzeugt.');
  }
  paragraph('Symbolfarbe: '+WIND_COLORS.find(v=>v.id===c.color)?.label+'. Hoch-/Tiefdruckfarben sind ohne autoritative WR-Klassifikation nicht verfügbar.');
  if(c.colorField){
   const heading=document.createElement('strong');heading.textContent='Windgeschwindigkeit · '+c.unit;box.append(heading);
   if(state.field){
    const bar=document.createElement('div');bar.setAttribute('role','img');bar.setAttribute('aria-label','Windgeschwindigkeit von Beaufort 0 bis 12');bar.style.cssText='height:13px;margin:8px 0;border-radius:4px;border:1px solid #d0b16a66;background:linear-gradient(90deg,'+WIND_FIELD_COLORS.map((v,i)=>v+' '+i/12*100+'%').join(',')+')';box.append(bar);
    const labels=document.createElement('div');labels.style.cssText='display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px;font-size:10px';
    for(const i of [0,4,8,12]){const label=document.createElement('span');label.textContent=windSpeedText(BEAUFORT_LIMITS[i],c.unit);labels.append(label);}box.append(labels);
    paragraph('Der Balken zeigt gleich breite Beaufort-Stufen 0–12; die Beschriftung wird in die gewählte Einheit umgerechnet. Innerhalb jeder Stufe verlaufen die Farben stetig. Deckkraft '+c.fieldOpacity+' %; nur die Farbfläche ist betroffen.');
   }else paragraph('Farbfläche angefordert, aber kein autorisiertes numerisches WR-Windfeld verfügbar: '+(state.fieldError||state.status)+'. Keine Fläche aus Punktwerten.');
  }
  const details=document.createElement('details'),summary=document.createElement('summary');summary.textContent='Beaufort · Geschwindigkeitsklassen ('+c.unit+')';details.append(summary);
  paragraph('WR bestimmt Verfügbarkeit, Quelle und Gültigkeit. '+(state.field?'Dargestellt ist eine 10-m-Modellvorhersage; keine Stationsmessung. Native Auflösung '+state.field.native_resolution_degrees+'°, übertragenes Gitter '+(state.field.grid.longitudes[1]-state.field.grid.longitudes[0]).toFixed(2)+'° × '+(state.field.grid.latitudes[1]-state.field.grid.latitudes[0]).toFixed(2)+'°.':'Die Punktwerte sind 10-m-Vorhersagen am angefragten Ort; keine Stationsmessungen und kein zusammenhängendes Windfeld.'));
  if(state.field){
   const f=state.field;paragraph(f.provenance.attribution);paragraph('Modelllauf (UTC): '+f.model_run);paragraph('Gültiger Modellzeitpunkt (UTC): '+f.valid_at);paragraph('WR-Freigabe bis (UTC): '+f.valid_until);
   for(const [label,value] of [['Modellquelle',f.provenance.source_url],['Datenbereitstellung',f.provenance.delivery_url]]){try{const url=new URL(value);if(url.protocol!=='https:')continue;const link=document.createElement('a');link.href=url.href;link.textContent=label;link.target='_blank';link.rel='noopener noreferrer';link.style.cssText='color:#edce82;margin-right:12px';box.append(link);}catch(_){}}
  }
  for(let i=0;i<BEAUFORT_LIMITS.length;i++){const p=document.createElement('div');p.style.borderLeft='8px solid '+WIND_FIELD_COLORS[i];p.style.paddingLeft='6px';p.textContent=i+' Bft: '+(c.unit!=='Bft'?windSpeedText(BEAUFORT_LIMITS[i],c.unit)+(i<12?' bis <'+windSpeedText(BEAUFORT_LIMITS[i+1],c.unit):' und mehr')+' · ':'')+BEAUFORT_LIMITS[i]+' bis '+(i<12?'<'+BEAUFORT_LIMITS[i+1]:'unbegrenzt')+' m/s';details.append(p);}box.append(details);
  if(!state.points.length&&!state.field)paragraph('Derzeit keine kohärenten WR-Windpunktwerte verfügbar.');
  for(const p of state.points)paragraph(`${p.lat.toFixed(3)}°, ${p.lon.toFixed(3)}° · ${windSpeedText(p.speed,c.unit)} · Herkunft ${p.from===null?'Windstille':p.from+'°'} · ${p.attribution} · ${p.validAt} (${p.kind||'WR'})`);
  return box;
 };
 return view;
}
export function updateWindLegend(view,owner){
 const state=owner._weatherWindState();view._weatherLegendSetModel('wind',{family:'precipitation',title:state.field?'WR-Windfeld · 10-m-Modellvorhersage':'WR-Windpunktwerte · keine Flächeninterpolation',unit:state.config.unit,entries:[{label:'Wind',color:'#fff'}],active:true});
}
