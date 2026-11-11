import {WindStudio} from './wind-studio.js?v=411180r1';
import {SnakeCanvas} from './snake-canvas.js?v=411162r1';
import {SNAKE_LIMITS,SNAKE_LABELS,snakeSettingText} from './snake-config.js?v=411162r1';
import {bindPremiumPanelDrag,ensurePremiumUi,premiumAction,enhancePremiumSections,syncPremiumPanel,togglePremiumPanel} from './premium-ui.js?v=411180r1';
import {installFlowTranslations,flowOptions} from './flow-locales.js?v=411157r1';
import {requestWeatherFrame,cancelWeatherFrame} from './frame-clock.js?v=411156r1';
import { defineModule } from '../core/runtime.js?v=41114r1';
import { WIND_COLORS,WIND_STORAGE,WIND_SPEED,WIND_DIRECTION,readWindConfig,normalizeWindConfig,combineWindPoint,windQueryPoints,windSpeedText,windDisplayActive,effectiveWindConfig } from './wind-data.js?v=411162r1';
import { WindCanvas } from './wind-canvas.js?v=411162r1';
import { createWindLegend,updateWindLegend } from './wind-legend.js?v=411180r1';
import { WIND_FIELD,WIND_FIELD_COMMAND,parseWindField,windFieldViewport,windFieldVisibleBounds,WindFieldCache } from './wind-field.js?v=411162r1';

export const MODULE_META=Object.freeze({id:'weather.wind-display',version:'0.4.12',group:'Weather-Engine',function:'Konfigurierbare WR-Winddarstellung',subfunctions:['Windfahnen','Richtungspfeile','numerisches Windfeld','Windgeschwindigkeits-Farbfläche','persistente Symbolfarben','Premium-Windlegende'],file:'modules/weather/wind-display.js'});
const MODES={barbs:'Klassische Windfahnen',arrows:'Statische Windrichtungspfeile',animated:'Animierte Windströmung',snake:'Schlangenförmige Animation'};
const INFO_URL=new URL('../../assets/gewitterradar-help-info-premium-v1.webp', import.meta.url).href;
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const installWeatherWind=defineModule(MODULE_META,(deps={})=>{installFlowTranslations(deps.I18N);return ({
 _weatherWindState(){return this.__weatherWind||(this.__weatherWind={config:readWindConfig(),points:[],field:null,fieldError:null,status:'Aus',errors:[],cache:new WindFieldCache({budgetBytes:((globalThis.innerWidth||1024)<650||(globalThis.navigator?.deviceMemory||8)<=4?8:16)*1024*1024}),cacheProfile:null,timing:{fetchMs:null,prepareMs:null},map:null,painter:null,batch:null,pending:false,generation:0,timer:null,refreshTimer:null,expiryTimer:null,legend:null,legendOpen:false,metrics:null,suspended:false,requests:0});},
 _weatherWindSave(){try{localStorage.setItem(WIND_STORAGE,JSON.stringify(this._weatherWindState().config));}catch(_){}},
 _weatherPremiumCloseAsset(){return deps.ABOUT_CLOSE_IMAGE;},
 _weatherWindMenuMarkup(){return '<button type="button" class="weather-layer-action" data-weather-layer-action="wind-settings"><strong>Winddarstellung</strong><small>Windfahnen · Pfeile · Windfeld</small></button>';},
 _weatherWindSet(patch,{render=true}={}){
  const s=this._weatherWindState(),was=windDisplayActive(s.config),oldField=(s.config.mode==='animated'||s.config.mode==='snake')||s.config.colorField;
  s.config=normalizeWindConfig({...s.config,...patch});this._weatherWindSave();
  if(windDisplayActive(s.config)){this._resumeWeatherWind();this._weatherWindUpdatePainters(s.points,s.field);if(!was||oldField!==((s.config.mode==='animated'||s.config.mode==='snake')||s.config.colorField)){const sameGrant=was&&s.field?.deadline>Date.now()&&s.cacheProfile===(this._weatherRouterClient?.().profileId||null);if(!sameGrant)this._weatherWindQueue({force:was});}}
  else{this._weatherWindHide();s.status=s.config.visible?'Keine Windsymbole oder Farbfläche ausgewählt':'Aus';}
  this._weatherWindSyncToggle();if(render){this._weatherLayerMenuRender?.();this._weatherWindRender();}else this._weatherWindSyncSnakeControls();if(s.legend)updateWindLegend(s.legend,this);
 },
 _weatherWindUpdatePainters(points,field,prepared=null){
  const s=this._weatherWindState(),c=effectiveWindConfig(s.config),snake=c.mode==='snake';
  s.painter?.update(points,snake?{...c,mode:'animated',enabled:false}:c,field,prepared);
  if(snake&&c.visible&&c.enabled&&s.map){
   if(!s.snakePainter){const canvas=document.createElement('canvas');canvas.className='weather-wind-snake-canvas';canvas.setAttribute('role','img');canvas.setAttribute('aria-label','Schlangenförmige Animation aus numerischen WR-Windvektoren');canvas.style.cssText='position:absolute;left:0;top:0;z-index:441;pointer-events:none';s.map.getContainer().append(canvas);s.snakePainter=new SnakeCanvas(s.map,canvas,{onMetrics:metrics=>{s.snakeMetrics=metrics;s.metrics=metrics;this._weatherWindSnakeStatus();if(s.config.performanceDiagnostics)this._weatherWindPerfUpdate();}});}
   s.snakePainter.update(field,{...c,animationExplicit:c.snakeAnimationExplicit,symbolColor:WIND_COLORS.find(v=>v.id===c.color)?.hex||'#ffffff'});
  }else if(s.snakePainter){s.snakePainter.destroy();s.snakePainter=null;s.snakeMetrics=null;}
 },
 _weatherWindSyncSnakeControls(){
  const s=this._weatherWindState(),panel=this.shadow?.getElementById('weather-wind-panel');if(!panel)return;
  for(const node of panel.querySelectorAll('[data-snake-setting]')){const value=s.config.snake[node.dataset.snakeSetting];node.value=value;const output=node.closest('label')?.querySelector('output');if(output)output.textContent=snakeSettingText(node.dataset.snakeSetting,value);}
  this._weatherWindSnakeStatus();
 },
 _weatherWindSnakeStatus(){const s=this._weatherWindState(),node=this.shadow?.querySelector('[data-snake-status]'),m=s.snakeMetrics;if(!node)return;node.textContent=m?'Dichte '+s.config.snake.density+' · '+m.particles+' Partikel · Ziel '+m.requestedParticles+' · Zoomfaktor '+m.zoomFactor.toFixed(2)+(m.temporaryDensityLimit?' · Temporäre Lastbegrenzung '+Math.round(m.temporaryDensityLimit*100)+' %; automatische Erholung aktiv.':'')+(m.capLimited?' · Speichergrenze '+m.particleCap+' Partikel.':'')+' · Zeichenintervall '+Math.round(m.frameIntervalMs)+' ms.':'';},
 _weatherWindSymbolColor(){const c=this._weatherWindState().config;return WIND_COLORS.find(v=>v.id===c.color)?.hex||'#ffffff';},
 _weatherWindStudioMount(panel){const s=this._weatherWindState(),detail=panel.querySelector('details[data-section=experts]'),slot=detail?.querySelector('[data-studio-slot]');if(!slot)return;if(!s.studio&&(detail.open||detail.querySelector('summary')?.getAttribute('aria-expanded')==='true'))s.studio=new WindStudio(this,panel);s.studio?.attach(slot);},
 _weatherWindTranslate(){const s=this.__weatherWind;if(!s)return;const language=this._languageValue();if(s.flowLanguage===language)return;s.flowLanguage=language;this._weatherWindRender({force:true});if(s.legend)updateWindLegend(s.legend,this);},
 _weatherWindToggle(){const c=this._weatherWindState().config;this._weatherWindSet({visible:!c.visible});},
 _weatherWindHide(){
  const s=this._weatherWindState();s.generation++;s.pending=false;clearTimeout(s.timer);clearTimeout(s.refreshTimer);s.timer=s.refreshTimer=null;
  // Retain the same painter, particle pool, prepared colour image and L2 cache.
  this._weatherWindUpdatePainters(s.points,s.field);s.painter?.stop();s.painter?.cancelPreparation();if(s.painter){s.painter.hidden=true;Object.assign(s.painter.metrics,{moving:false,segments:0,fps:null});}
  const canvas=s.painter?.canvas;if(canvas){canvas.hidden=true;s.painter.ctx.clearRect(0,0,canvas.width,canvas.height);}
 },
 _weatherWindToggleLayout(){const r=this.shadow?.getElementById('map')?.getBoundingClientRect();return [matchMedia('(pointer:coarse)').matches?'touch':'mouse',Math.min(innerWidth,innerHeight)<600?'phone':'large',r&&r.width>r.height?'landscape':'portrait',this._mapDisplayMode||'standard'].join(':');},
 _weatherWindEnsureToggle(){
  const card=this.shadow?.getElementById('map-card');if(!card)return;
  let button=this.shadow.getElementById('weather-wind-toggle');
  if(!button){
   const style=document.createElement('style');style.id='weather-wind-toggle-style';style.textContent=`
   .weather-wind-toggle{position:absolute;left:10px;top:10px;z-index:650;width:50px;height:50px;min-width:50px;min-height:50px;box-sizing:border-box;padding:0;border:0;background:transparent;border-radius:50%;box-shadow:none;touch-action:none;cursor:grab;-webkit-tap-highlight-color:transparent}.weather-wind-toggle[hidden]{display:none!important}
   .weather-wind-toggle img{display:block;width:50px;height:50px;object-fit:contain;pointer-events:none;user-select:none;-webkit-user-drag:none;filter:brightness(.7) saturate(.7)}
   .weather-wind-toggle[aria-pressed=true] img{filter:drop-shadow(0 0 3px #32b6e944)}.weather-wind-toggle.dragging{cursor:grabbing}.weather-wind-toggle:focus-visible{outline:2px solid #f4d791;outline-offset:2px}
   `;this.shadow.append(style);button=document.createElement('button');button.id='weather-wind-toggle';button.className='weather-wind-toggle';button.type='button';
   const image=document.createElement('img');image.src=new URL('../../assets/gr-wind-animation-toggle-premium-v1-136.webp', import.meta.url).href;image.srcset=new URL('../../assets/gr-wind-animation-toggle-premium-v1-272.webp', import.meta.url).href+' 4x';image.alt='';image.width=image.height=50;image.draggable=false;button.append(image);card.append(button);
   const s=this._weatherWindState();s.quickDrag={eyeDrag:null,eyeSuppressClickUntil:0};s.quickDragOptions={element:button,state:()=>s.quickDrag,position:()=>this._weatherWindPositionToggle(),longPress:()=>this._weatherWindOpen(),activate:()=>this._weatherWindToggle(),save:position=>{s.config=normalizeWindConfig({...s.config,quickPositions:{...s.config.quickPositions,[this._weatherWindToggleLayout()]:position}});this._weatherWindSave();}};
   this._weatherDisplayBindEyeDrag?.(button,s.quickDragOptions);
   for(const name of ['mousedown','dblclick','touchstart'])button.addEventListener(name,e=>e.stopPropagation(),{passive:true});
  }
  this._weatherWindSyncToggle();requestAnimationFrame(()=>this._weatherWindPositionToggle());
 },
 _weatherWindCancelToggleDrag(){const options=this.__weatherWind?.quickDragOptions;if(options)this._weatherDisplayCancelEyeDrag?.(options);},
 _weatherWindPositionToggle(){
  const s=this.__weatherWind,button=this.shadow?.getElementById('weather-wind-toggle'),card=this.shadow?.getElementById('map-card'),map=this.shadow?.getElementById('map');if(!button||!card||!map||s?.quickDrag?.eyeDrag)return;
  const r=map.getBoundingClientRect(),c=card.getBoundingClientRect();if(!r.width||!r.height)return;const x0=Math.max(0,r.left-c.left+10),y0=Math.max(0,r.top-c.top+10),x1=Math.max(x0,r.right-c.left-60),y1=Math.max(y0,r.bottom-c.top-60),position=s.config.quickPositions[this._weatherWindToggleLayout()];
  let left=x0,top=y0;
  if(position){left=x0+(x1-x0)*position.x;top=y0+(y1-y0)*position.y;}
  else{
   const obstacles=[...card.querySelectorAll('button,.leaflet-control,#map-location-overlay,[role=alert],#weather-legend-overlay,#weather-wind-legend-overlay')].filter(n=>n!==button&&!n.closest('.weather-wind-panel,.weather-display-panel,#map-display-menu')).map(n=>n.getBoundingClientRect()).filter(b=>b.width&&b.height);
   outer:for(let y=y0;y<=y1;y+=54)for(let x=x0;x<=Math.min(x1,x0+216);x+=50)if(!obstacles.some(b=>c.left+x<b.right+3&&c.left+x+50>b.left-3&&c.top+y<b.bottom+3&&c.top+y+50>b.top-3)){left=x;top=y;break outer;}
  }
  button.style.left=left+'px';button.style.top=top+'px';
 },
 _weatherWindSyncToggle(){const s=this._weatherWindState(),button=this.shadow?.getElementById('weather-wind-toggle');if(!button)return;const mode=s.config.quickVisibility||'fullscreen',fullscreen=this._mapDisplayMode==='fullscreen'||this._mapWindowMode;button.hidden=mode==='hidden'||(mode==='fullscreen'&&!fullscreen)||(mode==='nonfullscreen'&&fullscreen);button.setAttribute('aria-pressed',String(s.config.visible));button.setAttribute('aria-label','Winddarstellung '+(s.config.visible?'ausschalten':'einschalten'));button.title='Winddarstellung '+(s.config.visible?'ausschalten':'einschalten')+' · '+(s.config.visible?s.status:'Aus');if(s.painter?.canvas)s.painter.canvas.hidden=!windDisplayActive(s.config);},
 _weatherWindEnsureUi(){
  ensurePremiumUi(this.shadow);this._weatherDisplayEnsureStyle?.();
  const card=this.shadow?.getElementById('map-card');if(!card)return null;
  if(!this.shadow.getElementById('weather-wind-style')){
   const style=document.createElement('style');style.id='weather-wind-style';style.textContent=`
   .weather-wind-panel{position:absolute;z-index:720;top:12px;right:12px;width:min(410px,calc(100% - 24px));max-height:calc(100% - 24px);overflow:auto;box-sizing:border-box;padding:0;color:#e4e9ef;font:12px/1.45 system-ui;overscroll-behavior:contain;touch-action:pan-y}
   .weather-wind-panel[hidden]{display:none}.weather-wind-panel header{color:#f1d38a}.weather-wind-panel header strong{flex:1}.weather-wind-panel button,.weather-wind-panel select{font:inherit;color:inherit;border:1px solid #b5985a66;background:#141e2a;border-radius:7px;padding:7px;cursor:pointer}.weather-wind-panel button:focus-visible,.weather-wind-panel select:focus-visible{outline:2px solid #f1d38a}.weather-wind-panel label{display:flex;justify-content:space-between;align-items:center;gap:8px;margin:9px 0}.weather-wind-panel select{max-width:65%;min-width:0}.weather-wind-note{font-size:11px;color:#bac6d4;overflow-wrap:anywhere;margin:7px 0}.weather-wind-swatches{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:6px}.weather-wind-panel .weather-wind-swatch{height:30px;padding:4px;border-width:2px}.weather-wind-swatch i{display:block;height:9px;border-radius:3px;background:var(--wind-color)}.weather-wind-swatch[aria-pressed=true]{border-color:#f4d791;box-shadow:0 0 7px #d9a74488}.weather-wind-panel fieldset{margin:10px 0;padding:8px;border:1px solid #a5885355;border-radius:8px;min-width:0}.weather-wind-panel legend{color:#dfc081}.weather-wind-panel input[type=range]{width:42%;min-width:0}.weather-wind-panel details{margin-top:10px}.weather-wind-points{font-size:11px;overflow-wrap:anywhere}.weather-wind-panel img{display:block;width:24px;height:24px;object-fit:contain}.weather-wind-canvas{position:absolute;left:0;top:0;z-index:440;pointer-events:none;filter:none;opacity:1}.weather-wind-panel :disabled{opacity:.5;cursor:default}@media(max-width:430px){.weather-wind-panel{font-size:11px}.weather-wind-panel select{max-width:61%;font-size:11px}.weather-wind-swatches{gap:4px}}
   .weather-wind-panel .snake-slider{display:grid;grid-template-columns:minmax(0,1fr) minmax(75px,38%) auto;gap:8px}.weather-wind-panel .snake-slider>span{min-width:0;overflow-wrap:anywhere}.weather-wind-panel .snake-slider input[type=range]{width:100%;min-height:36px;touch-action:pan-y;padding:0}.weather-wind-panel .snake-slider output{min-width:40px;text-align:right;font-variant-numeric:tabular-nums}
   `;style.textContent+='.weather-wind-panel{z-index:2147483644}#weather-wind-legend-overlay{z-index:2147483644}.weather-wind-panel.embedded{position:static;z-index:auto;width:100%;max-height:none;padding:5px 0;border:0;box-shadow:none;background:transparent;overflow:visible}.weather-wind-panel.embedded [data-wind-action=close]{display:none}.weather-wind-panel.embedded header{margin-top:5px}.weather-wind-panel.embedded select{max-width:65%}';this.shadow.append(style);
  }
  const sheet=this.shadow.getElementById('weather-wind-style');if(!sheet.dataset.windIcons){sheet.textContent+='.weather-wind-panel .weather-wind-icon{display:grid;place-items:center;flex:0 0 44px;width:44px;height:44px;min-width:44px;min-height:44px;padding:0;border:0;background:transparent;box-shadow:none}.weather-wind-panel .weather-wind-icon img{width:34px;height:34px;object-fit:contain;pointer-events:none}.weather-wind-panel .weather-wind-icon:focus-visible{outline:2px solid #e7c16e;outline-offset:-2px}';sheet.dataset.windIcons='1';}
  let panel=this.shadow.getElementById('weather-wind-panel');
  if(!panel){panel=document.createElement('section');panel.id='weather-wind-panel';panel.className='weather-wind-panel gr-premium-metal-surface';panel.hidden=true;panel.setAttribute('role','region');panel.setAttribute('aria-label','Winddarstellung');card.append(panel);bindPremiumPanelDrag(panel,this.shadow?.getElementById('map'),'wind-settings');
   panel.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;event.stopPropagation();if(button.dataset.premiumAction==='minimize'){togglePremiumPanel(panel,'wind-settings');return;}
    if(button.dataset.windColor)this._weatherWindSet({color:button.dataset.windColor});
    if(button.dataset.windAction==='close'){panel.hidden=true;this.__windOpener?.focus?.();}
    if(button.dataset.windAction==='snake-pause')this._weatherWindSet({paused:!this._weatherWindState().config.paused});
    if(button.dataset.windAction==='refresh')this._weatherWindQueue({force:true});
    if(button.dataset.windAction==='legend'){const s=this._weatherWindState();s.legendOpen=!s.legendOpen;s.legend||=createWindLegend(this);updateWindLegend(s.legend,this);if(s.legendOpen){panel.hidden=true;if(panel.classList.contains('embedded'))this._weatherDisplayPatch?.({enabled:false});}}
   });
   const snakeInput=event=>{const node=event.target,key=node.dataset.snakeSetting;if(!key)return false;this._weatherWindSet({snake:{...this._weatherWindState().config.snake,[key]:Number(node.value)}},{render:false});event.stopPropagation();return true;};
   panel.addEventListener('input',snakeInput);
   panel.addEventListener('change',event=>{if(snakeInput(event))return;const node=event.target,key=node.dataset.windSetting;if(!key)return;event.stopPropagation();const value=node.type==='checkbox'?node.checked:['fieldOpacity','flowLength'].includes(key)?Number(node.value):node.value;
    this._weatherWindSet({[key]:value,...(key==='mode'&&value==='animated'?{animationExplicit:true}:key==='mode'&&value==='snake'?{snakeAnimationExplicit:true}:{})});
   });
   panel.addEventListener('premiumsectionchange',event=>{if(event.detail.id==='experts'&&event.detail.expanded)this._weatherWindStudioMount(panel);});
   panel.addEventListener('keydown',event=>{if(event.key==='Escape'){panel.hidden=true;this.__windOpener?.focus?.();event.stopPropagation();}});
   // Keep map gestures out of the panel without changing existing map controls.
   for(const event of ['pointerdown','mousedown','dblclick','wheel','touchstart'])panel.addEventListener(event,e=>e.stopPropagation(),{passive:true});
  }return panel;
 },
 _weatherWindOpen({container=null,focus=true}={}){
  const temperature=this.shadow?.getElementById('weather-temperature-panel');if(temperature)temperature.hidden=true;
  this.__windOpener=this.shadow?.activeElement;const panel=this._weatherWindEnsureUi();if(!panel)return;
  this._setMapDisplayMenuOpen?.(false);
  const target=container||this.shadow.getElementById('map-card');if(panel.parentElement!==target)target.append(panel);panel.classList.toggle('embedded',Boolean(container));
  if(!container&&this._weatherDisplayState?.().config.enabled)this._weatherDisplayPatch?.({enabled:false});
  this._weatherWindRender({force:true});panel.hidden=false;if(focus)panel.querySelector('button')?.focus();this._resumeWeatherWind();
 },
 _weatherWindRender({force=false}={}){
  const panel=this.shadow?.getElementById('weather-wind-panel');if(!panel)return;const s=this._weatherWindState(),c=s.config;
  if(!force&&(panel.hidden||panel.classList.contains('embedded')&&!this._weatherDisplayState?.().config.enabled))return;
  if(!force&&s.studio?.editing){s.studio.syncActive();return;}
  const expanded=new Set([...panel.querySelectorAll('details[open]')].map(d=>d.querySelector('summary')?.textContent)),scrollTop=panel.scrollTop;
  const active=panel.contains(this.shadow.activeElement)?this.shadow.activeElement:null,focusKey=active?.dataset.windSetting,focusColor=active?.dataset.windColor,focusSnake=active?.dataset.snakeSetting;
  const check=(key,label,disabled=false)=>`<label>${label}<input type="checkbox" data-wind-setting="${key}" ${c[key]?'checked':''} ${disabled?'disabled':''}></label>`;
  const select=(key,label,options,disabled=false)=>`<label>${label}<select data-wind-setting="${key}" ${disabled?'disabled':''}>${Object.entries(options).map(([id,name])=>`<option value="${id}" ${c[key]===id?'selected':''}>${name}</option>`).join('')}</select></label>`;
  const snakeRange=(key,label=SNAKE_LABELS[key],quick=false)=>{const [min,max,step]=SNAKE_LIMITS[key];return `<label class="snake-slider"><span>${label}</span><input type="range" min="${min}" max="${max}" step="${step}" data-snake-setting="${key}" ${quick?'data-snake-quick="true"':''} value="${c.snake[key]}" aria-label="${label}"><output>${snakeSettingText(key,c.snake[key])}</output></label>`;};
  s.studio?.root.remove();
  panel.innerHTML=`<header class="weather-display-panel-head"><img src="${new URL('../../assets/gr-wind-animation-toggle-premium-v1-136.webp',import.meta.url).href}" alt=""><strong>Winddarstellung</strong><div class="gr-premium-panel-actions">${premiumAction('minimize','Menü minimieren','minimize')}<button type="button" class="weather-wind-icon" data-wind-action="legend" aria-label="Windlegende"><img src="${INFO_URL}" alt="" width="34" height="34"></button><button type="button" class="weather-wind-icon" data-wind-action="close" aria-label="Winddarstellung schließen"><img src="${escape(deps.ABOUT_CLOSE_IMAGE||'')}" alt="" width="34" height="34" draggable="false"></button></div></header><div class="weather-wind-panel-body">
  ${check('visible','Winddarstellung ein / aus')}${select('quickVisibility','Kartenschalter anzeigen',{fullscreen:'Nur im Vollbild',all:'In allen Kartenansichten',nonfullscreen:'Nur Standard und Groß',hidden:'Nirgends (ausblenden)'})}${check('enabled','Windsymbole anzeigen')}${check('barbsVisible','Windfahnen anzeigen')}${select('unit','Geschwindigkeitseinheit',{'km/h':'km/h',kn:'kn',Bft:'Beaufort'})}${select('mode','Darstellungsart',MODES)}
  <div class="weather-wind-note">${s.field?'Zusammenhängendes numerisches 10-m-Modellwindfeld von WeatherRouter.':'Windfahnen und Pfeile verwenden WR-Punktwerte. Animation und Farbfläche fragen das numerische WR-Windfeld an.'}</div>
  <div role="group" aria-label="Symbolfarbe" class="weather-wind-swatches">${WIND_COLORS.map(v=>`<button type="button" class="weather-wind-swatch" data-wind-color="${v.id}" aria-label="${v.label}" aria-pressed="${c.color===v.id}" title="${v.label}"><i style="--wind-color:${v.hex}"></i></button>`).join('')}</div>
  ${select('colorMode','Farbmodus',{uniform:'Einheitliche Farbe',pressure:'Hoch-/Tiefdruck (nicht verfügbar)'})}
  <div class="weather-wind-note">${c.colorMode==='pressure'?'Einheitliche Farbe aktiv: ':''}WR liefert keine autoritative Hoch-/Tiefdruckklassifikation. Windrichtung allein ist dafür ungeeignet.</div>
  <details><summary>Gespeicherte Hoch-/Tiefdruckfarben (inaktiv)</summary>${select('highColor','Hochdruck',Object.fromEntries(WIND_COLORS.map(v=>[v.id,v.label])))}${select('lowColor','Tiefdruck',Object.fromEntries(WIND_COLORS.map(v=>[v.id,v.label])))}</details>
  <details data-section="animation"><summary>Animation</summary>${select('flowForm',escape(this._t('flow.shape')),flowOptions(this),c.mode!=='animated')}${c.mode==='snake'?`${snakeRange('maxLength','Partikellänge · Maximum',true)}${snakeRange('speed','Geschwindigkeit',true)}${snakeRange('density','Dichte',true)}<p class="weather-wind-note">Schnellzugriff auf dieselben gespeicherten Schlangenwerte. Die Partikelform wird im Bereich Schlangenförmige Animation gesteuert; Strömungsform bleibt hier ohne Wirkung.</p>`:`<label>${escape(this._t('flow.length'))}<input type="range" min="50" max="150" step="5" data-wind-setting="flowLength" value="${c.flowLength}" ${c.mode!=='animated'?'disabled':''}><output>${c.flowLength} %</output></label><p class="weather-wind-note" data-flow-help>${escape(this._t(c.flowForm==='curved_arrows'?'flow.arrowsHelp':'flow.linesHelp'))} ${!s.field&&c.flowForm!=='classic'?escape(this._t('flow.requiresField')):''}</p>${select('tempo','Geschwindigkeit',{slow:'Langsam',normal:'Normal',fast:'Schnell'},c.mode!=='animated')}${select('density','Dichte',{low:'Gering',normal:'Normal',high:'Hoch'},c.mode!=='animated')}`}${check('paused','Animation pausieren',!['animated','snake'].includes(c.mode))}<div class="weather-wind-note">Nur die Darstellung wird verändert. Keine zusätzlichen Wetterabfragen pro Bild.</div></details>
  <details data-section="snake"><summary>Schlangenförmige Animation</summary><p class="weather-wind-note">Eigener Renderer aus numerischen WR-Windvektoren. Kopf und langer Körper behalten ihre Breite; erst der einstellbare hintere Abschnitt läuft geometrisch und transparent aus. Die Länge passt sich während der Bewegung an.</p>${Object.keys(SNAKE_LIMITS).map(key=>snakeRange(key)).join('')}<button type="button" data-wind-action="snake-pause">${c.paused?'Animation fortsetzen':'Animation pausieren'}</button><p class="weather-wind-note">Größere Anpassungszeit bedeutet weichere Längenänderung. Schnellzugriffe und Detailregler verwenden jeweils denselben Wert. ${c.mode==='snake'&&!s.field?'Nicht verfügbar: numerisches WR-Windfeld erforderlich. Keine Flächenanimation aus Punktwerten.':''}</p><p class="weather-wind-note" data-snake-status></p></details>
  <details data-section="experts"><summary>Experteneinstellungen</summary><div data-studio-slot></div></details>
  <details data-section="field"><summary>Windgeschwindigkeits-Farbfläche</summary>${check('colorField','Ein / Aus')}<div id="wind-field-reason" class="weather-wind-note">${s.field?'Beaufort-basierte Geschwindigkeitsskala aus numerischen U-/V-Werten. NoData bleibt transparent.':s.fieldError?'Kein autorisiertes WR-Windfeld: '+escape(s.fieldError)+'. Punktdarstellung bleibt unabhängig verfügbar.':'Erfordert die additive numerische WR-Windfeldfähigkeit. Gerenderte Windkacheln werden nicht in Messwerte umgedeutet.'}</div><label>Eigene Deckkraft<input type="range" min="0" max="100" step="1" data-wind-setting="fieldOpacity" value="${c.fieldOpacity}" aria-label="Windfarbflächen-Deckkraft"><output>${c.fieldOpacity} %</output></label></details>
  <div role="status" class="weather-wind-note" data-wind-status>${escape(s.status)} · ${s.field?s.field.grid.u.length+' Gitterknoten':s.points.length+' Punkte'}</div><button type="button" data-wind-action="refresh" ${!c.enabled&&!c.colorField?'disabled':''}>WR-Wind aktualisieren</button>
  ${s.field?`<div class="weather-wind-note">${escape(s.field.provenance.attribution)}<br>Modelllauf ${escape(s.field.model_run)}<br>Gültig ${escape(s.field.valid_at)} · WR-Freigabe bis ${escape(s.field.valid_until)}</div>`:''}
  <details><summary>Werte, Quellen und Zeitpunkte</summary><div class="weather-wind-points">${s.points.length?s.points.map(p=>`<p>${p.lat.toFixed(3)}°, ${p.lon.toFixed(3)}° · ${escape(windSpeedText(p.speed,c.unit))} · Herkunft ${p.from===null?'Windstille':p.from+'°'}<br>${escape(p.attribution)} · ${escape(p.validAt)} · ${escape(p.kind||'WR')}</p>`).join(''):'Keine kohärenten gültigen WR-Punktwerte.'}</div><div class="weather-wind-note">${escape([...new Set(s.errors)].join(' · '))}</div></details>
  <details><summary>Performance-Diagnose</summary>${check('performanceDiagnostics','Messung einschalten')}<div class="weather-wind-note" data-wind-performance>Messung im Browser; keine Aussage zur Verbindungsart oder zu einem anderen Gerät.</div></details></div>`;
  enhancePremiumSections(panel,'wind-settings');syncPremiumPanel(panel,'wind-settings');this._weatherWindStudioMount(panel);
  this._weatherWindPerfUpdate(true);this._weatherWindSnakeStatus();
  panel.scrollTop=scrollTop;
  if(focusSnake)panel.querySelector(`[data-snake-setting="${focusSnake}"]`)?.focus();else if(focusKey)panel.querySelector(`[data-wind-setting="${focusKey}"]`)?.focus();else if(focusColor)panel.querySelector(`[data-wind-color="${focusColor}"]`)?.focus();
 },
 _resumeWeatherWind(){
  const s=this._weatherWindState();s.suspended=false;this._weatherWindEnsureToggle();this._resumeWeatherTemperature?.();
  if(!windDisplayActive(s.config)||!this._map)return;
  if(s.map===this._map){if(s.painter){s.painter.hidden=document.hidden;s.painter.canvas.hidden=false;}return;}
  this._weatherWindEnsureUi();this._weatherWindDetach();s.map=this._map;
  const canvas=document.createElement('canvas');canvas.className='weather-wind-canvas';canvas.setAttribute('aria-label','WR-Winddarstellung; Werte, Quellen und Zeitpunkte in der Windlegende');canvas.setAttribute('role','img');s.map.getContainer().append(canvas);
  s.painter=new WindCanvas(s.map,canvas,{raf:requestWeatherFrame,cancel:cancelWeatherFrame,onMetrics:metrics=>{s.legacyMetrics=metrics;if(s.config.mode!=='snake')s.metrics=metrics;if(s.config.performanceDiagnostics)this._weatherWindPerfUpdate();}});
  s.onMove=()=>this._weatherWindQueue();s.map.on('moveend zoomend',s.onMove);
  s.onUnload=()=>this._weatherWindDetach();s.map.on('unload',s.onUnload);
  s.onVisibility=()=>{if(document.hidden){clearTimeout(s.refreshTimer);s.refreshTimer=null;s.generation++;s.pending=false;}else if(!windDisplayActive(s.config))this._weatherWindHide();else this._weatherWindQueue({force:true});};document.addEventListener('visibilitychange',s.onVisibility);
  this._weatherWindUpdatePainters(s.points,s.field);this._weatherWindQueue();if(s.legend&&s.legendOpen)updateWindLegend(s.legend,this);
 },
 _weatherWindQueue({force=false}={}){
  const s=this._weatherWindState();clearTimeout(s.timer);
  if(!windDisplayActive(s.config)||s.suspended||!s.map||document.hidden)return;
  const needsField=(s.config.mode==='animated'||s.config.mode==='snake')||s.config.colorField,profile=this._weatherRouterClient?.().profileId||null;
  if(s.cacheProfile!==profile){s.cache.clear();s.cacheProfile=profile;s.field=null;this._weatherWindUpdatePainters(s.points,null);}
  const signature=JSON.stringify(needsField?[windFieldViewport(s.map,1.3),s.map.getZoom?.()||0]:windQueryPoints(s.map));
  if(s.batch&&signature===s.batchSignature){s.pending=s.batchGeneration!==s.generation;return;}
  if(s.batch&&signature!==s.batchSignature)s.generation++;
  if(needsField&&!force){const cached=s.cache.find(windFieldVisibleBounds(s.map),s.map.getZoom?.()||0);if(cached){s.pending=false;s.lastQuerySignature=signature;const generation=++s.generation;this._weatherWindApplyField(cached,[],generation).then(()=>this._weatherWindScheduleRefresh());return;}}
  if(!needsField&&!force&&signature===s.lastQuerySignature&&s.points.length){s.pending=false;s.status='WR-Wind verfügbar · lokale Punktdarstellung';s.painter?.schedule();this._weatherWindRender();this._weatherWindScheduleRefresh();return;}
  clearTimeout(s.refreshTimer);s.refreshTimer=null;
  s.timer=setTimeout(()=>{s.timer=null;s.pending=true;this._weatherWindFetch();},250);
 },
 _weatherWindScheduleRefresh(){const s=this._weatherWindState();clearTimeout(s.refreshTimer);if(windDisplayActive(s.config)&&!s.suspended&&!document.hidden){const next=s.retryAt||(s.field?s.cache.refreshAt(s.field):Date.now()+300000);s.refreshTimer=setTimeout(()=>this._weatherWindQueue({force:true}),Math.max(1000,next-Date.now()));}},
 async _weatherWindApplyField(field,points,generation,{fieldError=null,errors=[]}={}){
  const s=this._weatherWindState();let prepared=null;
  if(field&&field.id!==s.field?.id&&s.painter?.prepareField&&s.config.colorField&&s.config.visible)prepared=await s.painter.prepareField(field);
  if(generation!==s.generation||s.suspended||!windDisplayActive(s.config)||document.hidden||field&&field.deadline<=Date.now())return false;
  s.field=field;s.points=points;s.fieldError=fieldError;s.errors=errors;s.retryAt=fieldError?Date.now()+30000:0;
  s.status=field?(fieldError?'Nachladen fehlgeschlagen · vorhandenes WR-Windfeld bleibt freigegeben':'WR-Windfeld verfügbar · 10-m-Modellvorhersage'):points.length?'WR-Wind verfügbar · lokale Punktdarstellung':'Keine kohärenten WR-Windvektoren verfügbar';
  this._weatherWindUpdatePainters(s.points,field,prepared);clearTimeout(s.expiryTimer);
  s.expiryTimer=field?setTimeout(()=>{if(s.field===field){s.field=null;s.cache.prune();this._weatherWindUpdatePainters(s.points,null);s.status='WR-Windfeldfreigabe abgelaufen';this._weatherWindRender();if(s.legend)updateWindLegend(s.legend,this);if(!s.batch)this._weatherWindQueue({force:true});}},Math.max(1,field.deadline-Date.now())):null;
  if(s.config.mode==='snake'&&!field)s.status='Schlangenförmige Animation nicht verfügbar · kein freigegebenes numerisches WR-Windfeld';
  this._weatherWindSyncToggle();this._weatherLayerMenuRender?.();this._weatherWindRender();if(s.legend)updateWindLegend(s.legend,this);return true;
 },
 async _weatherWindFetch(){
  const s=this._weatherWindState();if(s.batch||!s.pending||!windDisplayActive(s.config)||s.suspended||document.hidden||!s.map)return;
  s.pending=false;const generation=++s.generation,points=windQueryPoints(s.map),results=[],errors=[],needsField=(s.config.mode==='animated'||s.config.mode==='snake')||s.config.colorField,zoom=s.map.getZoom?.()||0,bbox=needsField?windFieldViewport(s.map,1.3):null,profileKey=s.cacheProfile;let cursor=0;s.batchGeneration=generation;s.batchSignature=JSON.stringify(needsField?[bbox,zoom]:points);
  s.status=s.field?'WR-Windfeld wird im Hintergrund nachgeladen':'WR-Wind wird geladen';this._weatherWindSyncToggle();this._weatherLayerMenuRender?.();this._weatherWindRender();
  // At most two points (four existing WS requests) at once. An obsolete batch stops dispatching.
  const worker=async()=>{while(cursor<points.length&&generation===s.generation){const point=points[cursor++];s.requests+=2;
   try{const [speed,direction]=await Promise.all([this._weatherRouterResolve(WIND_SPEED,point),this._weatherRouterResolve(WIND_DIRECTION,point)]);if(generation!==s.generation)return;results.push(combineWindPoint(speed,direction,point));}
   catch(error){errors.push(error?.message||'wr_wind_unavailable');}
  }};
  let field=null,fieldError=null,revoked=false;
  const resolve=async()=>{
   if(needsField){
    let timeout;try{
     const request={type:WIND_FIELD_COMMAND,contract_version:2,capability:WIND_FIELD,context:{bbox},time:{mode:'latest'},consumer_id:'gewitterradar'};
     const profile=this._weatherRouterClient?.().profileId;if(profile)request.profile_id=profile;s.requests++;
     const started=performance.now();
     const answer=await Promise.race([this._hass.callWS(request),new Promise((_,reject)=>timeout=setTimeout(()=>reject(new Error('wind_field_transport_timeout')),35000))]);
     if(profileKey!==s.cacheProfile)return;s.timing.fetchMs=performance.now()-started;revoked=answer?.status==='unavailable'&&/^(router_disabled|domain_disabled|provider_disabled|profile_|wind_policy_changed)/.test(answer.unavailable?.code||'');
     if(revoked){s.cache.clear();s.field=null;this._weatherWindUpdatePainters([],null);}
     const preparing=performance.now();field=parseWindField(answer);s.timing.prepareMs=performance.now()-preparing;s.cache.put(field,zoom,{authoritative:generation===s.generation});
    }catch(error){fieldError=error?.message||error?.code||'wind_field_unavailable';errors.push(fieldError);}finally{clearTimeout(timeout);}
   }
   if(!field&&s.field?.deadline>Date.now()&&!revoked)field=s.field;
   if(!field&&s.config.enabled&&s.config.mode!=='snake'&&generation===s.generation)await Promise.all([worker(),worker()]);
  };
  s.batch=resolve();
  try{await s.batch;if(generation!==s.generation||s.suspended)return;s.lastQuerySignature=s.batchSignature;await this._weatherWindApplyField(field,results,generation,{fieldError,errors});
   this._weatherEngineMonitorEvent?.('wind_field_resolution',{status:field?'ready':'unavailable',code:fieldError,nodes:field?.grid.u.length||0,provider:field?.provenance.provider_id,valid_at:field?.valid_at});
  }
  finally{s.batch=null;if(s.pending)this._weatherWindQueue();else this._weatherWindScheduleRefresh();}
 },
 _weatherWindDetach(){
  const s=this._weatherWindState();s.generation++;s.pending=false;clearTimeout(s.timer);clearTimeout(s.refreshTimer);clearTimeout(s.expiryTimer);s.timer=s.refreshTimer=s.expiryTimer=null;
  if(s.map&&s.onMove)s.map.off('moveend zoomend',s.onMove);if(s.map&&s.onUnload)s.map.off('unload',s.onUnload);if(s.onVisibility)document.removeEventListener('visibilitychange',s.onVisibility);
  s.snakePainter?.destroy();s.snakePainter=null;s.painter?.destroy();s.painter=null;s.map=null;s.onMove=s.onUnload=s.onVisibility=null;
 },
 _teardownWeatherWind(){this._teardownWeatherTemperature?.();const s=this.__weatherWind;if(!s)return;s.studio?.destroy();s.studio=null;this._weatherWindCancelToggleDrag();this._weatherWindDetach();s.cache.clear();s.field=null;s.suspended=true;s.legend?._teardownWeatherLegend();const panel=this.shadow?.getElementById('weather-wind-panel');if(panel)panel.hidden=true;},
 _weatherWindPerfUpdate(force=false){const s=this._weatherWindState(),now=performance.now();if(!force&&now-(s.lastPerfUi||0)<1000)return;s.lastPerfUi=now;const node=this.shadow?.querySelector('[data-wind-performance]');if(!node)return;const m=s.metrics||{},cache=s.cache.summary(),n=v=>Number.isFinite(v)?v.toFixed(1):'–';node.textContent=s.config.performanceDiagnostics?`FPS ${n(m.fps)} · Render Ø ${n(m.meanRenderMs)} ms · P95 ${n(m.p95RenderMs)} ms · Max ${n(m.maxRenderMs)} ms · Sichtbar ${m.segments||0} / verwaltet ${m.particles||0} · Knoten ${m.fieldNodes||0} · Browsercache ${cache.hits} Treffer / ${cache.misses} Fehlzugriffe · ${cache.entries} Felder, ${(cache.bytes/1048576).toFixed(2)} MiB · Abruf ${n(s.timing.fetchMs)} ms · Aufbereitung ${n(s.timing.prepareMs)} ms · Farbfläche CPU ${n(m.colorPreparationCpuMs)} ms, gesamt ${n(m.colorPreparationWallMs)} ms · Generationen ${m.activeGenerations||0} aktiv, ${m.preparingGeneration?1:0} in Vorbereitung. Messung im aktuellen Browser; keine Erkennung von WLAN oder Mobilfunk.`:'Messung ausgeschaltet. Keine zusätzlichen Wetterabrufe.';},
 _weatherWindDiagnostics(){const s=this._weatherWindState();return {config:{...s.config},status:s.status,points:s.points.map(({lat,lon,speed,from,provider,validAt,kind})=>({lat,lon,speed,from,provider,validAt,kind})),errors:[...s.errors],metrics:s.metrics?{...s.metrics}:null,cache:s.cache.summary(),timing:{...s.timing},requests:s.requests,snake:s.snakePainter?{...s.snakePainter.metrics}:null,fieldCapability:s.field?'ready':s.fieldError||'not_requested',field:s.field?{id:s.field.id,nodes:s.field.grid.u.length,coverage:s.field.coverage,provider:s.field.provenance.provider_id,model_run:s.field.model_run,valid_at:s.field.valid_at,valid_until:s.field.valid_until,wrCache:s.field.delivery_diagnostics||null}:null,pressureCapability:'missing_authoritative_pressure_classification'};}});});
