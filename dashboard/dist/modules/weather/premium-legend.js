import {installWeatherLegendOverlay} from './legend-overlay.js?v=411182r1';
import {ensurePremiumUi,enhancePremiumSections,PREMIUM_INFO} from './premium-ui.js?v=411182r1';
class ScientificLegend{}installWeatherLegendOverlay(ScientificLegend,{});
// Reuse the existing overlay's event delegation, pointer drag, bounds and teardown.
// A scientific view must not pass through the precipitation-only family renderer.
export function createScientificLegend(owner,{prefix,ui,position,visible,saveUi,savePosition,close,title,render}){
 const view=new ScientificLegend(),ensure=view._weatherLegendEnsureUi;
 view.shadow={getElementById:id=>owner.shadow?.getElementById(id.startsWith('weather-legend-')?id.replace('weather-legend-',prefix):id),append:node=>{if(node.id==='weather-legend-style')node.id=prefix+'style';owner.shadow.append(node);}};
 view.__weatherLegendState={models:new Map(),resizeHandler:null,resizeObserver:null,collapsed:false,anchor:null,ui:{view:'bar',rain:false,snow:false,...ui},position,mounted:false};
 view._weatherLegendMode=()=>visible()?'auto':'off';view._weatherLegendSaveUi=saveUi;view._weatherLegendSavePosition=savePosition;view._weatherDisplaySetLegendMode=close;
 view._weatherPremiumCloseAsset=()=>owner._weatherPremiumCloseAsset?.();
 view._weatherLegendEnsureUi=function(){ensurePremiumUi(owner.shadow);const host=ensure.call(this);if(host){host.id=prefix+'overlay';host.classList.add('gr-scientific-legend');host.setAttribute('aria-label',title());}return host;};
 view._weatherLegendSyncUi=function(){
  const host=this._weatherLegendEnsureUi();if(!host)return;host.hidden=!this._weatherLegendVisibleModels().length;if(host.hidden)return;
  const ui=this._weatherLegendState().ui;host.querySelector('[data-weather-legend-heading]').textContent=title();host.classList.toggle('gr-legend-minimized',ui.minimized===true);
  const mini=host.querySelector('[data-gr-legend-minimize]');mini.setAttribute('aria-expanded',String(!ui.minimized));mini.setAttribute('aria-label',ui.minimized?'Legende maximieren':'Legende minimieren');
  host.querySelectorAll('[data-weather-legend-view]').forEach(b=>{const selected=b.dataset.weatherLegendView===ui.view;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});
  const {visual,explanation,source}=render(ui.view),list=host.querySelector('[data-weather-legend-list]');list.replaceChildren(visual);
  const detail=document.createElement('details');detail.dataset.section='explanation';detail.className='gr-legend-explanation';const summary=document.createElement('summary'),icon=document.createElement('img');icon.src=PREMIUM_INFO;icon.alt='';icon.style.cssText='width:28px;height:28px;object-fit:contain';summary.append(icon,document.createTextNode('Erklärung'));detail.append(summary,explanation);list.append(detail);if(source)list.append(source);
  // Explanation state belongs to this legend's stored UI, not its minimization.
  enhancePremiumSections(host,prefix);detail.open=ui.explanation===true;summary.setAttribute('aria-expanded',String(detail.open));detail.querySelector('.gr-collapse-inner').inert=!detail.open;
  requestAnimationFrame(()=>this._weatherLegendPosition());
 };
 // The common section enhancer animates independently; persist in the existing
 // legend config as well so config exports and normalization retain the state.
 const originalEnsure=view._weatherLegendEnsureUi;view._weatherLegendEnsureUi=function(){const host=originalEnsure.call(this);if(host&&!host.dataset.scientificBound){host.dataset.scientificBound='true';host.addEventListener('premiumsectionchange',event=>{if(event.detail.id!=='explanation')return;const ui=this._weatherLegendState().ui;ui.explanation=event.detail.expanded;this._weatherLegendSaveUi(ui);});host.querySelector('[data-premium-legend-info]')?.addEventListener('click',()=>{const ui=this._weatherLegendState().ui;if(ui.minimized){ui.minimized=false;this._weatherLegendSaveUi(ui);this._weatherLegendSyncUi();}host.querySelector('summary')?.click();});}return host;};
 return view;
}
export function legendParagraphs(lines){const box=document.createElement('div');for(const text of lines.filter(Boolean)){const p=document.createElement('p');p.textContent=text;box.append(p);}return box;}
export function legendScale(entries,view,{gradient=null,ticks=[]}={}){
 const box=document.createElement('div');box.className='gr-scientific-visual';
 if(view==='classes'){
  const grid=document.createElement('div');grid.className='gr-scale-classes';for(const entry of entries){const item=document.createElement('div');item.className='gr-scale-class';const swatch=document.createElement('i');swatch.style.setProperty('--scale-color',entry.color);const label=document.createElement('span');label.textContent=entry.label;item.append(swatch,label);grid.append(item);}box.append(grid);
 }else{
  const bar=document.createElement('div');bar.className='gr-scale-bar';bar.setAttribute('role','img');bar.setAttribute('aria-label',entries.map(e=>e.label).join(' · '));bar.style.background=gradient||'linear-gradient(90deg,'+entries.map((e,i)=>e.color+' '+(i/Math.max(1,entries.length-1)*100)+'%').join(',')+')';box.append(bar);
  const labels=document.createElement('div');labels.className='gr-scale-ticks';for(const tick of ticks){const span=document.createElement('span');span.textContent=tick;labels.append(span);}box.append(labels);
 }return box;
}
