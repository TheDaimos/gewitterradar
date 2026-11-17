import {settingsStorage} from '../core/settings-vault.js?v=411226r1';
import {CLOUD_CAPABILITY,CLOUD_EYE_ICON,cloudEyeStatus} from './eye-hub-registry.js?v=411213r1';
import {ensurePremiumUi,premiumAction,bindPremiumPanelDrag,syncPremiumPanel,togglePremiumPanel} from './premium-ui.js?v=411226r1';

const STORAGE_KEY='gewitterradar:clouds-ui:v1';
const PANEL_SCOPE='clouds-settings';
const HELP_ICON=new URL('../../assets/gr-clouds-help-premium-original.png',import.meta.url).href;
const validPosition=position=>position&&Number.isFinite(position.x)&&Number.isFinite(position.y)&&position.x>=0&&position.x<=1&&position.y>=0&&position.y<=1;

export const cloudsControlMethods={
 _weatherCloudsConfig(){
  if(this.__weatherCloudsConfig)return this.__weatherCloudsConfig;
  let stored;
  try{stored=JSON.parse(settingsStorage(this).getItem(STORAGE_KEY));}catch(_error){}
  const positions=Object.fromEntries(Object.entries(stored?.positions||{}).filter(([,position])=>validPosition(position)));
  return this.__weatherCloudsConfig={enabled:stored?.enabled===true,positions};
 },
 _weatherCloudsSave(){
  try{settingsStorage(this).setItem(STORAGE_KEY,JSON.stringify(this._weatherCloudsConfig()));}catch(_error){}
 },
 _weatherCloudsSaveVisibility(enabled){
  const config=this._weatherCloudsConfig();
  if(config.enabled===enabled)return;
  config.enabled=enabled;
  this._weatherCloudsSave();
 },
 _weatherCloudsResume(){
  const ready=this.__weatherLayerMenuState?.model?.capabilities?.some(item=>item.id===CLOUD_CAPABILITY&&item.available!==false);
  if(this._map&&ready&&this._weatherCloudsConfig().enabled&&!this._weatherGenericState(CLOUD_CAPABILITY).enabled)
   void this._weatherLayerMenuToggle(CLOUD_CAPABILITY);
 },
 _weatherCloudsEnsureToggle(){
  const card=this.shadow?.getElementById('map-card');
  if(!card||this.shadow.getElementById('weather-clouds-toggle'))return;
  const style=document.createElement('style');
  style.textContent=`
   .weather-clouds-toggle{position:absolute;left:10px;top:10px;z-index:650;width:50px;height:50px;padding:0;border:0;border-radius:50%;background:transparent;touch-action:none;cursor:grab}
   .weather-clouds-toggle img{display:block;width:100%;height:100%;object-fit:contain;pointer-events:none}
   .weather-clouds-toggle[aria-pressed=false] img{opacity:.68}
   .weather-clouds-toggle[data-unavailable] img{filter:grayscale(1)}
   .weather-clouds-toggle:focus-visible{outline:2px solid #f1d58c}
   #weather-clouds-panel{position:absolute;z-index:2147483644;top:12px;right:12px;width:min(360px,calc(100% - 24px));max-height:calc(100% - 24px);box-sizing:border-box;overflow:auto;overscroll-behavior:contain;touch-action:pan-y;color:#e4e9ef;font:12px/1.45 system-ui}
   #weather-clouds-panel[hidden]{display:none}
   #weather-clouds-panel>header.weather-display-panel-head{touch-action:none}
   #weather-clouds-panel .gr-premium-panel-actions>[data-premium-action="close"]{border-radius:50%!important;box-shadow:none}
   #weather-clouds-panel .gr-premium-panel-actions>[data-premium-action="close"] img{width:34px!important;height:34px!important}
   #weather-clouds-panel label{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:44px}
   #weather-clouds-panel [data-cloud-opacity]{min-width:0;width:48%;accent-color:#d5ab50}
   #weather-clouds-panel .clouds-description{display:flex;align-items:center;gap:8px}
   #weather-clouds-panel .clouds-description img{width:48px;height:34px;object-fit:contain}
  `;
  this.shadow.append(style);
  const button=document.createElement('button'),image=document.createElement('img');
  button.id='weather-clouds-toggle';
  button.className='weather-clouds-toggle';
  button.type='button';
  image.src=CLOUD_EYE_ICON;
  image.alt='';
  image.draggable=false;
  button.append(image);
  card.append(button);
  const drag={eyeDrag:null};
  this.__weatherCloudsDrag={element:button,state:()=>drag,position:()=>this._eyeHubSyncIcons(),
   activate:()=>this._weatherLayerMenuToggle(CLOUD_CAPABILITY),longPress:()=>this._weatherCloudsOpen(),
   save:position=>{
    this._weatherCloudsConfig().positions[this._weatherWindToggleLayout()]=position;
    this._weatherCloudsSave();
   }};
  this._weatherDisplayBindEyeDrag(button,this.__weatherCloudsDrag);
  for(const event of ['mousedown','dblclick','touchstart'])button.addEventListener(event,e=>e.stopPropagation(),{passive:true});
  this._weatherCloudsSync();
 },
 _weatherCloudsCancelDrag(){
  if(this.__weatherCloudsDrag)this._weatherDisplayCancelEyeDrag(this.__weatherCloudsDrag);
 },
 _weatherCloudsClose(){
  const panel=this.shadow?.getElementById('weather-clouds-panel');
  if(!panel)return;
  const restoreFocus=panel.contains(this.shadow.activeElement);
  panel.hidden=true;
  if(restoreFocus)this.__weatherCloudsFocus?.focus({preventScroll:true});
 },
 _weatherCloudsOpen(){
  const card=this.shadow?.getElementById('map-card');
  if(!card)return;
  ensurePremiumUi(this.shadow);
  let panel=this.shadow.getElementById('weather-clouds-panel');
  if(!panel){
   panel=document.createElement('section');
   panel.id='weather-clouds-panel';
   panel.className='weather-wind-panel gr-premium-metal-surface';
   panel.setAttribute('aria-label',this._t('eye.clouds'));
   panel.hidden=true;
   panel.innerHTML=`<header class="weather-display-panel-head"><img src="${CLOUD_EYE_ICON}" alt="" draggable="false"><strong data-cloud-title></strong><div class="gr-premium-panel-actions">${premiumAction('minimize',this._t('eye.minimize'),'minimize')}${premiumAction('close',this._t('eye.close'))}</div></header>
    <div class="weather-wind-panel-body"><p class="clouds-description"><img src="${HELP_ICON}" alt=""><span data-cloud-description></span></p>
    <label><span data-cloud-visible-label></span><input type="checkbox" data-cloud-visible></label>
    <label><span data-cloud-style-label></span><select class="weather-display-style-select" data-cloud-style><option value="original"></option><option value="balanced"></option></select></label>
    <label><span data-cloud-opacity-label></span><input type="range" min="0" max="100" step="1" data-cloud-opacity><output data-cloud-value></output></label>
    <button type="button" class="eye-metal-button" data-cloud-reset></button><p role="status" data-cloud-status></p></div>`;
   card.append(panel);
   bindPremiumPanelDrag(panel,this.shadow.getElementById('map'),PANEL_SCOPE,{touch:true});
   panel.addEventListener('click',event=>{
    const button=event.target.closest('button');
    if(!button)return;
    event.stopPropagation();
    if(button.dataset.premiumAction==='close')this._weatherCloudsClose();
    if(button.dataset.premiumAction==='minimize')togglePremiumPanel(panel,PANEL_SCOPE);
    if(button.hasAttribute('data-cloud-reset'))this._weatherDisplayResetTransparency('clouds');
   });
   panel.addEventListener('input',event=>{
    if(event.target.hasAttribute('data-cloud-opacity'))this._weatherDisplaySetTransparency('clouds',event.target.value);
   });
   panel.addEventListener('change',event=>{
    const input=event.target;
    if(input.hasAttribute('data-cloud-visible')&&input.checked!==this._weatherGenericState(CLOUD_CAPABILITY).enabled)
     void this._weatherLayerMenuToggle(CLOUD_CAPABILITY);
    if(input.hasAttribute('data-cloud-style'))this._weatherDisplayPatch({styles:{clouds:input.value}});
   });
   for(const type of ['pointerdown','mousedown','dblclick','touchstart','wheel'])panel.addEventListener(type,event=>event.stopPropagation(),{passive:true});
  }
  this._setMapDisplayMenuOpen?.(false);
  if(this._weatherDisplayState().config.enabled)this._weatherDisplayPatch({enabled:false});
  if(panel.hidden)this.__weatherCloudsFocus=this.shadow.activeElement;
  panel.hidden=false;
  syncPremiumPanel(panel,PANEL_SCOPE);
  this._weatherCloudsSync();
  panel.querySelector('button')?.focus({preventScroll:true});
 },
 _weatherCloudsSync(){
  const button=this.shadow?.getElementById('weather-clouds-toggle');
  const panel=this.shadow?.getElementById('weather-clouds-panel');
  if(!button&&!panel)return;
  const status=cloudEyeStatus(this),title=this._t('eye.clouds');
  const summary=this._t(status.available?(status.active?'eye.on':'eye.off'):'eye.unavailable');
  if(button){
   const pressed=String(status.active);
   if(button.getAttribute('aria-pressed')!==pressed)button.setAttribute('aria-pressed',pressed);
   button.setAttribute('aria-label',title);
   button.toggleAttribute('data-unavailable',!status.available);
   button.title=title+' · '+summary;
  }
  if(!panel||panel.hidden)return;
  for(const [action,key] of [['minimize','eye.minimize'],['close','eye.close']]){
   const control=panel.querySelector('[data-premium-action="'+action+'"]'),label=this._t(key);
   control.title=label;control.setAttribute('aria-label',label);
  }
  const text=(selector,value)=>{
   const node=panel.querySelector(selector);
   if(node.textContent!==value)node.textContent=value;
  };
  const t=key=>this._weatherQuickT(key);
  text('[data-cloud-title]',title);
  text('[data-cloud-description]',this._t('eye.cloudsHelp'));
  text('[data-cloud-visible-label]',t('visible'));
  text('[data-cloud-style-label]',t('mode'));
  text('[data-cloud-opacity-label]',t('transparency'));
  text('[data-cloud-reset]',t('reset'));
  text('option[value=original]',t('original'));
  text('option[value=balanced]',t('balanced'));
  const percent=String(this._weatherDisplayTransparencyPercent('clouds')),label=percent+' %';
  const opacity=panel.querySelector('[data-cloud-opacity]');
  if(opacity.value!==percent)opacity.value=percent;
  opacity.setAttribute('aria-valuetext',label);
  text('[data-cloud-value]',label);
  panel.querySelector('[data-cloud-style]').value=this._weatherDisplayStyle('clouds');
  panel.querySelector('[data-cloud-visible]').checked=status.active;
  text('[data-cloud-status]',status.active?this._weatherGenericDescribe(CLOUD_CAPABILITY):summary);
 }
};
