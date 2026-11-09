// Presentation only. Shared Eye-menu controls; no weather requests or policy.
export const PREMIUM_CLOSE=new URL('../../assets/gewitterradar-about-close-premium.webp',import.meta.url).href;
export const PREMIUM_INFO=new URL('../../assets/gewitterradar-help-info-premium-v1.webp',import.meta.url).href;
export const premiumEscape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function premiumAction(action,label,icon='close'){
 return `<button type="button" class="gr-premium-action ${icon==='minimize'?'weather-display-minimize gr-premium-metal-surface':''}" data-premium-action="${action}" aria-label="${premiumEscape(label)}">${icon==='minimize'?'<span class="gr-minimize-glyph" aria-hidden="true"></span>':`<img src="${icon==='info'?PREMIUM_INFO:PREMIUM_CLOSE}" alt="" draggable="false">`}</button>`;
}
const key=scope=>'gewitterradar:premium-ui:v1:'+scope;
export function readPremiumUi(scope){try{return JSON.parse(localStorage.getItem(key(scope)))||{};}catch(_){return {};}}
export function savePremiumUi(scope,ui){try{localStorage.setItem(key(scope),JSON.stringify(ui));}catch(_){}}
export function ensurePremiumUi(shadow){
 if(shadow.getElementById('gr-premium-ui-style'))return;
 const style=document.createElement('style');style.id='gr-premium-ui-style';style.textContent=`
 .weather-wind-panel:not(.embedded),.weather-display-panel{z-index:2147483647!important}.gr-legend-actions .gr-premium-action{width:40px;height:40px;min-width:40px;flex:0 0 40px}
 .gr-premium-action{display:grid;place-items:center;flex:0 0 40px;width:40px;height:40px;min-width:40px;padding:0!important;cursor:pointer;touch-action:manipulation}.gr-premium-action:not(.weather-display-minimize){border:0!important;background:transparent!important}
 .gr-premium-action img{display:block!important;width:32px!important;height:32px!important;object-fit:contain;pointer-events:none}
 .gr-premium-action:focus-visible,.gr-premium-collapse>summary:focus-visible{outline:2px solid #f1d58c;outline-offset:-2px}
 .gr-minimize-glyph{position:relative;display:block;width:14px;height:14px;pointer-events:none}.gr-minimize-glyph::before,.gr-minimize-glyph::after{content:'';position:absolute;left:0;top:6px;width:14px;height:2px;background:currentColor;border-radius:1px}.gr-minimize-glyph::after{transform:rotate(90deg);opacity:0}.minimized .gr-minimize-glyph::after,.gr-legend-minimized .gr-minimize-glyph::after{opacity:1}
 .gr-premium-collapse{min-width:0;margin:8px 0;border-top:1px solid #b5985a44}.gr-premium-collapse>summary{list-style:none;display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:44px;box-sizing:border-box;padding:6px 2px;color:#f1d58c;cursor:pointer;touch-action:manipulation;font-weight:750}.gr-premium-collapse>summary::-webkit-details-marker{display:none}.gr-premium-collapse>summary::marker{content:''}.gr-premium-collapse>summary .release-history-future-chevron{flex:0 0 14px;width:14px;height:14px;margin:0 5px;transform:rotate(45deg);transition:transform .42s cubic-bezier(.22,1,.36,1)}
 .gr-premium-collapse:not([open])>summary .release-history-future-chevron{transform:rotate(45deg)}.gr-premium-collapse[open]>summary .release-history-future-chevron{transform:rotate(225deg)}.gr-premium-collapse.gr-closing>summary .release-history-future-chevron{transform:rotate(45deg)}
 .gr-collapse-body{display:grid;grid-template-rows:1fr;transition:grid-template-rows .42s cubic-bezier(.22,1,.36,1)}.gr-closing>.gr-collapse-body{grid-template-rows:0fr}.gr-collapse-inner{min-height:0;overflow:hidden;min-width:0}
 .weather-wind-panel>header.weather-display-panel-head{display:grid;grid-template-columns:34px minmax(0,1fr) auto;margin:0;cursor:default;touch-action:pan-y}.weather-wind-panel>header>img{width:34px;height:34px;object-fit:contain}.gr-premium-panel-actions{display:flex;align-items:center;gap:4px;flex-shrink:0}.weather-wind-panel-body{padding:9px;min-width:0}.weather-wind-panel.embedded>.weather-wind-panel-body{padding:0}.weather-wind-panel.embedded>header{background:transparent}.weather-wind-panel .gr-premium-collapse{padding:0;border-width:1px;box-shadow:none;border-radius:11px}.weather-wind-panel .gr-premium-collapse>summary{padding:8px clamp(14px,3vw,18px);gap:12px;min-height:46px}.weather-wind-panel .gr-premium-collapse>summary .release-history-future-chevron{margin:0;align-self:center}.gr-premium-section-title{min-width:0;flex:1;white-space:normal;overflow-wrap:anywhere;line-height:1.35}.weather-wind-panel .gr-collapse-inner{padding:0 9px 9px;box-sizing:border-box}.weather-wind-panel header strong{min-width:0;overflow-wrap:anywhere}.weather-wind-panel.minimized>:not(header){display:none!important}.weather-wind-panel.minimized header{margin:0}.weather-wind-panel fieldset{min-width:0}.weather-wind-panel label{min-width:0;overflow-wrap:anywhere}.weather-wind-panel label select{flex-shrink:1}.weather-wind-panel label output{flex-shrink:0}.weather-wind-panel .gr-premium-action{border-radius:8px}.weather-wind-panel.embedded [data-premium-action=minimize]{display:none}
 .weather-legend-overlay.gr-scientific-legend{font:11px/1.45 system-ui}.gr-scientific-legend .weather-legend-title{font-size:12px;line-height:1.3}.gr-scientific-legend .weather-legend-global-head{padding-bottom:4px}
 .gr-scientific-visual{width:100%;min-width:0;display:grid;gap:8px}.gr-scale-bar{height:14px;border-radius:4px;margin-top:6px}.gr-scale-ticks{display:flex;flex-wrap:wrap;justify-content:space-between;gap:5px;font-size:11px;font-variant-numeric:tabular-nums}.gr-scale-classes{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(108px,100%),1fr));gap:7px;width:100%;box-sizing:border-box}.gr-scale-class{display:grid;gap:4px;min-width:0;border:1px solid #b5985a44;border-radius:6px;padding:7px;box-sizing:border-box;background:#101a25;font-size:11px;overflow-wrap:anywhere;font-variant-numeric:tabular-nums}.gr-scale-class i{height:7px;border-radius:3px;background:var(--scale-color)}.gr-legend-explanation{font:11px/1.5 system-ui;color:#bac6d4;overflow-wrap:anywhere}.gr-legend-explanation p{margin:6px 0}.gr-legend-source{font:10px/1.5 system-ui;color:#bac6d4;overflow-wrap:anywhere}.weather-legend-overlay.gr-scientific-legend{z-index:2147483647!important}#map-card:has(.weather-display-panel:not([hidden])) .gr-scientific-legend,#map-card:has(.weather-wind-panel:not([hidden]):not(.embedded)) .gr-scientific-legend{z-index:2147483643!important}.gr-scientific-legend .weather-legend-view-picker button{min-height:36px}.gr-scientific-legend .weather-legend-list{max-height:var(--weather-legend-list-max,45vh)}
 .weather-wind-panel:not(.embedded)>header.weather-display-panel-head{grid-template-columns:34px minmax(0,1fr) auto!important;column-gap:10px!important;padding:5px 14px 5px 10px!important}.weather-wind-panel:not(.embedded)>header .gr-premium-panel-actions>button{width:40px!important;min-width:40px!important;height:40px!important;min-height:40px!important;flex:0 0 40px!important}.weather-wind-panel:not(.embedded)>header .gr-premium-panel-actions{gap:4px}
 @media(prefers-reduced-motion:reduce){.gr-collapse-body,.gr-premium-collapse>summary .release-history-future-chevron{transition:none}}
 `;shadow.append(style);
}
// Keep native details/summary semantics and keyboard activation. Closing stays
// mounted until its grid transition ends; updates use the saved target state.
export function enhancePremiumSections(panel,scope){
 const ui=readPremiumUi(scope);let index=0;
 for(const detail of panel.querySelectorAll('details')){
  if(detail.dataset.premiumSection)continue;
  const summary=detail.querySelector(':scope>summary');if(!summary)continue;
  const id=detail.dataset.section||String(index++);detail.dataset.premiumSection=id;detail.classList.add('gr-premium-collapse','release-history-future');
  if(panel.classList.contains('weather-wind-panel')){detail.classList.add('gr-premium-metal-surface','weather-display-card');const title=document.createElement('span');title.className='gr-premium-section-title';title.dataset.premiumSectionTitle='true';while(summary.firstChild)title.append(summary.firstChild);summary.append(title);}
  const chevron=document.createElement('span');chevron.className='release-history-future-chevron';chevron.setAttribute('aria-hidden','true');summary.append(chevron);
  const body=document.createElement('div'),inner=document.createElement('div');body.className='gr-collapse-body';inner.className='gr-collapse-inner';while(summary.nextSibling)inner.append(summary.nextSibling);body.append(inner);detail.append(body);
  if(typeof ui.sections?.[id]==='boolean')detail.open=ui.sections[id];summary.setAttribute('aria-expanded',String(detail.open));inner.inert=!detail.open;
 }
 if(panel.dataset.premiumSectionsBound)return;panel.dataset.premiumSectionsBound='true';
 panel.addEventListener('click',event=>{
  const summary=event.target.closest('summary');if(!summary||!panel.contains(summary))return;
  const detail=summary.parentElement;if(!detail.dataset.premiumSection)return;
  event.preventDefault();event.stopPropagation();
  const ui=readPremiumUi(scope),expanded=summary.getAttribute('aria-expanded')!=='true',inner=detail.querySelector(':scope>.gr-collapse-body>.gr-collapse-inner');
  clearTimeout(detail.__premiumTimer);ui.sections={...ui.sections,[detail.dataset.premiumSection]:expanded};savePremiumUi(scope,ui);summary.setAttribute('aria-expanded',String(expanded));inner.inert=!expanded;detail.dispatchEvent(new CustomEvent('premiumsectionchange',{bubbles:true,detail:{id:detail.dataset.premiumSection,expanded}}));
  if(expanded){detail.open=true;detail.classList.add('gr-closing');requestAnimationFrame(()=>{if(detail.isConnected)detail.classList.remove('gr-closing');});}
  else{detail.classList.add('gr-closing');detail.__premiumTimer=setTimeout(()=>{if(summary.getAttribute('aria-expanded')==='false'){detail.open=false;detail.classList.remove('gr-closing');}},matchMedia('(prefers-reduced-motion: reduce)').matches?0:420);}
 });
}
export function syncPremiumPanel(panel,scope){const ui=readPremiumUi(scope);panel.classList.toggle('minimized',ui.minimized===true);const b=panel.querySelector('[data-premium-action=minimize]');b?.setAttribute('aria-expanded',String(!ui.minimized));b?.setAttribute('aria-label',ui.minimized?'Menü maximieren':'Menü minimieren');}
export function togglePremiumPanel(panel,scope){const ui=readPremiumUi(scope);ui.minimized=!ui.minimized;savePremiumUi(scope,ui);syncPremiumPanel(panel,scope);}
