import {installWeatherLegendOverlay} from './legend-overlay.js?v=41215r1';
import {createLegendInstrument} from './legend-instrument.js?v=41215r1';
import {legendOptions} from './legend-preferences.js?v=41215r1';
import {legendDescriptor} from './legend-registry.js?v=4126r1';
import {renderLegendInformation,safeLegendParagraphs} from './legend-information.js?v=41210r1';
import {renderLegendScale} from './legend-scale.js?v=41213r1';
class ScientificLegend{}installWeatherLegendOverlay(ScientificLegend,{});
// Shared minimal instrument; native render callbacks still supply all scientific
// classes, symbols, provenance and explanatory content to the explicit info popup.
export function createScientificLegend(owner,{prefix,id=prefix.replace(/^weather-|-legend-$/g,''),ui,position,visible,saveUi,savePosition,close,title,render}){
 const view=new ScientificLegend();view._t=owner._t.bind(owner);view.shadow=owner.shadow;
 view.__weatherLegendState={models:new Map(),ui:{view:'bar',rain:false,snow:false,...ui},position,mounted:false};
 view._weatherLegendMode=()=>visible()?'auto':'off';view._weatherLegendSaveUi=saveUi;view._weatherLegendSavePosition=savePosition;view._weatherDisplaySetLegendMode=close;
 view._weatherLegendEnsureUi=function(){const state=this._weatherLegendState();state.instrument||=createLegendInstrument(owner,{id,elementId:prefix+'overlay',title,position:state.position,savePosition:p=>{state.position=p;savePosition(p);},onResize:()=>this._weatherLegendSyncUi()});state.mounted=true;return state.instrument.host;};
 view._weatherLegendSyncUi=function(){
  this._weatherLegendEnsureUi();const state=this._weatherLegendState(),instrument=state.instrument,shown=this._weatherLegendVisibleModels().length>0;instrument.setVisible(shown);owner._legendHubStatus?.();if(!shown)return;
  const c=legendOptions(owner,id),model=legendDescriptor(owner,id),native=model?null:render(state.ui.view),map=owner.shadow.getElementById('map'),available=c.orientation==='vertical'?map.clientHeight-(c.showCaption?76:55):map.clientWidth-74;
  const nodes=[model?renderLegendScale(model,{...c,unitInCaption:true},available):native.visual];
  // Native symbol examples and full class tables remain in the explicit info popup.
  instrument.update(nodes,box=>{const detail=render(state.ui.view);box.append(renderLegendInformation(owner,{visual:detail.visual,explanation:detail.explanation,sourceLines:detail.source?.__legendLines||[],technical:{models:[...state.models.values()]}}));});
 };
 view._weatherLegendPosition=()=>view._weatherLegendState().instrument?.place();
 view._teardownWeatherLegend=()=>{const state=view._weatherLegendState();state.instrument?.destroy();state.instrument=null;state.mounted=false;};
 return view;
}
export const legendParagraphs=safeLegendParagraphs;
export function legendScale(entries,view,{gradient=null,ticks=[]}={}){
 const box=document.createElement('div');box.className='gr-scientific-visual';
 if(view==='classes'){
  const grid=document.createElement('div');grid.className='gr-scale-classes';for(const entry of entries){const item=document.createElement('div');item.className='gr-scale-class';const swatch=document.createElement('i');swatch.style.setProperty('--scale-color',entry.color);const label=document.createElement('span');label.textContent=entry.label;item.append(swatch,label);grid.append(item);}box.append(grid);
 }else{
  const bar=document.createElement('div');bar.className='gr-scale-bar';bar.setAttribute('role','img');bar.setAttribute('aria-label',entries.map(e=>e.label).join(' · '));bar.style.background=gradient||'linear-gradient(90deg,'+entries.map((e,i)=>e.color+' '+(i/Math.max(1,entries.length-1)*100)+'%').join(',')+')';box.append(bar);
  const labels=document.createElement('div');labels.className='gr-scale-ticks';for(const tick of ticks){const span=document.createElement('span');span.textContent=tick;labels.append(span);}box.append(labels);
 }return box;
}
