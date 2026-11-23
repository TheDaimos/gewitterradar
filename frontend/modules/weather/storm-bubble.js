import {STORM_EYE_ICON} from './eye-hub-registry.js?v=411230r1';
import {eyeBubbleAuraEnabled,visibleEyeSlots} from './eye-hub-model.js?v=4121r1';
import {bindPremiumPanelDrag,enhancePremiumSections,ensurePremiumUi,premiumAction,premiumEscape as escape} from './premium-ui.js?v=41212r1';

export const stormLayout=owner=>owner._mapWindowMode?'window':owner._mapDisplayMode==='fullscreen'?'fullscreen':'standard';

const stormLayers=owner=>[owner._individualStrikeLayer,owner._markerLayer,owner._clusterBubbleLayer,
 owner._stormCircle,owner._dangerCircle];

export const stormBubbleMethods={
 _weatherStormAvailable(){
  const discovery=this.__weatherDisplayState?.discovery;
  return discovery?.present===true&&discovery.compatible===true&&discovery.ready===true;
 },

 _weatherStormVisible(){
  return !this._weatherStormAvailable()||this.__eyeHub?.config.stormVisible!==false;
 },

 _weatherStormSetVisible(visible){
  if(this._weatherStormAvailable())this._eyeHubPatch({stormVisible:visible});
 },

 _weatherStormSyncPresentation(){
  const visible=this._weatherStormVisible();
  if(this.__stormPresentation?.map===this._map&&this.__stormPresentation?.ready===this._mapReady&&
     this.__stormPresentation?.visible===visible)return;
  const wasVisible=this.__stormPresentation?.visible??true;
  this.__stormPresentation={map:this._map,ready:this._mapReady,visible};
  const map=this._map;
  if(this._mapReady&&map){
   for(const layer of stormLayers(this)){
    if(!layer)continue;
    const attached=map.hasLayer(layer);
    if(visible&&!attached)map.addLayer(layer);
    if(!visible&&attached)map.removeLayer(layer);
   }
   if(visible&&!wasVisible)this._applyRecentRadiusMapEmphasis?.();
   if(!visible||!wasVisible)this._syncRadiusAuraSvg?.();
  }
  const card=this.shadow?.getElementById('map-card');
  if(card)card.dataset.stormVisible=String(visible);
  if(!visible){
   this.__stormFlashRevision=(this.__stormFlashRevision??0)+1;
   for(const overlay of [this.shadow?.getElementById('alert-flash'),this._fullscreenWarningOverlay,this._mobileViewportWarningOverlay]){
    if(!overlay)continue;
    overlay.classList.remove('fire');
    for(const element of overlay.children){
     element.getAnimations?.().forEach(animation=>animation.cancel());
     if(element.style.opacity)element.style.opacity='0';
    }
   }
  }
 },

 _weatherStormSync(card,state){
  this._weatherStormSyncPresentation();
  const available=this._weatherStormAvailable();
  const assigned=visibleEyeSlots(state.config).some(slot=>slot.functionId==='storm');
  let button=this.shadow.getElementById('weather-storm-toggle');
  if(!button&&available&&assigned){
   button=document.createElement('button');
   button.type='button';
   button.id='weather-storm-toggle';
   button.className='weather-storm-toggle eye-hub-bubble';
   button.dataset.function='storm';
   button.setAttribute('aria-controls','weather-storm-panel');
   const icon=document.createElement('img');
   icon.src=STORM_EYE_ICON;icon.alt='';icon.draggable=false;
   button.append(icon);
   card.append(button);
   this.__stormQuick={eyeDrag:null};
   this.__stormQuickOptions={
    element:button,state:()=>this.__stormQuick,position:()=>this._eyeHubSyncIcons(),
    activate:()=>this._weatherStormSetVisible(!this._weatherStormVisible()),
    longPress:()=>this._weatherStormOpen(),
    save:position=>this._eyeHubPatch({stormPositions:{...this._eyeHubState().config.stormPositions,[stormLayout(this)]:position}})
   };
   this._weatherDisplayBindEyeDrag(button,this.__stormQuickOptions);
   for(const type of ['mousedown','dblclick','touchstart'])button.addEventListener(type,event=>event.stopPropagation(),{passive:true});
  }
  if(button){
   const hidden=!available||!assigned||state.config.grouped;
   if(hidden&&this.__stormQuick?.eyeDrag)this._weatherDisplayCancelEyeDrag(this.__stormQuickOptions);
   if(button.hidden!==hidden)button.hidden=hidden;
   const visible=this._weatherStormVisible();
   const label=this._t('eye.storm')+' · '+this._t(visible?'eye.on':'eye.off');
   if(button.getAttribute('aria-pressed')!==String(visible))button.setAttribute('aria-pressed',String(visible));
   if(button.getAttribute('aria-label')!==label){button.setAttribute('aria-label',label);button.title=label;}
  }
  if(available)this._weatherStormSyncPanel();
  else this._weatherStormClose(false);
 },

 _weatherStormOpen(){
  if(!this._weatherStormAvailable())return;
  const card=this.shadow?.getElementById('map-card');
  if(!card)return;
  this._setMapDisplayMenuOpen?.(false);
  this.__stormOpener=this.shadow.activeElement;
  ensurePremiumUi(this.shadow);
  let panel=this.shadow.getElementById('weather-storm-panel');
  if(!panel){
   panel=document.createElement('section');
   panel.id='weather-storm-panel';
   panel.className='weather-wind-panel gr-premium-metal-surface weather-storm-panel';
   panel.setAttribute('role','region');
   panel.addEventListener('change',event=>this._weatherStormChange(event.target));
   panel.addEventListener('click',event=>{
    if(event.target.closest('[data-premium-action=close]'))this._weatherStormClose();
   });
   panel.addEventListener('keydown',event=>{
    if(event.key==='Escape'){event.preventDefault();event.stopPropagation();this._weatherStormClose();}
   });
   for(const type of ['pointerdown','mousedown','dblclick','wheel','touchstart'])panel.addEventListener(type,event=>event.stopPropagation(),{passive:true});
   card.append(panel);
  }
  panel.hidden=false;
  this._weatherStormSyncPanel();
  if(!panel.dataset.stormDragBound){
   bindPremiumPanelDrag(panel,this.shadow.getElementById('map'),'storm');
   panel.dataset.stormDragBound='true';
  }
  panel.querySelector('[data-premium-action=close]')?.focus({preventScroll:true});
 },

 _weatherStormClose(restoreFocus=true){
  const panel=this.shadow?.getElementById('weather-storm-panel');
  if(!panel||panel.hidden)return;
  panel.hidden=true;
  if(restoreFocus){
   const opener=this.__stormOpener;
   (opener?.isConnected&&!opener.hidden?opener:this.shadow.getElementById('weather-display-eye-control'))?.focus({preventScroll:true});
  }
  this.__stormOpener=null;
 },

 _weatherStormSyncPanel(){
  const panel=this.shadow?.getElementById('weather-storm-panel');
  if(!panel||panel.hidden)return;
  const language=this._languageValue?.();
  if(!panel.firstElementChild||this.__stormPanelLanguage!==language){
   this.__stormPanelLanguage=language;
   const t=key=>escape(this._t(key));
   const section=(id,title,content)=>`<details data-section="${id}" open><summary>${t(title)}</summary>${content}</details>`;
   const toggle=(id,label)=>`<label class="storm-toggle-setting"><span>${t(label)}</span><input type="checkbox" role="switch" data-storm-setting="${id}"></label>`;
   const select=(id,label,items)=>`<label class="storm-select-setting"><span>${t(label)}</span><select data-storm-setting="${id}">${items.map(([value,name])=>`<option value="${value}">${escape(name)}</option>`).join('')}</select></label>`;
   const radius=kind=>`<label class="storm-radius-setting"><span>${t('radius.'+kind)}</span><input type="range" data-storm-setting="${kind}" aria-label="${t('radius.'+kind)}"><output></output></label>`;
   panel.setAttribute('aria-label',this._t('eye.storm'));
   panel.innerHTML=`<header class="weather-display-panel-head"><img src="${STORM_EYE_ICON}" alt=""><strong>${t('eye.storm')}</strong><div class="gr-premium-panel-actions">${premiumAction('close',this._t('eye.close'))}</div></header>
    <div class="weather-wind-panel-body">
     ${section('visibility','map.display_aria',toggle('visible','eye.stormVisible')+select('grouping','map.display_aria', [['grouped',this._t('map.grouped')],['individual',this._t('map.individual')]]))}
     ${section('cluster','settings.cluster_resolution',select('resolution','settings.cluster_resolution',this._clusterResolutionOptions())+toggle('navigation','eye.stormNavigation'))}
     ${section('session','settings.cluster_navigation_session',`<label class="storm-timeout-setting"><span>${t('settings.cluster_navigation_range')}</span><input type="number" data-storm-setting="timeout" min="5" max="3600" step="1" inputmode="numeric"></label>`+toggle('infinite','settings.cluster_navigation_infinite'))}
     ${section('effects','eye.stormEffects',toggle('animation','warning.animation')+radius('storm')+radius('danger'))}
     ${section('aura','eye.aura',toggle('aura','eye.bubbleAura'))}
    </div>`;
   panel.querySelector('[data-premium-action=close] img').src=this._eyeHubHeaderCloseIcon();
   enhancePremiumSections(panel,'storm',this);
  }
  const states=this._hass?.states;
  const grouping=states?.[this._mapGroupingEntity()];
  const animation=states?.[this._animationEntity()];
  const field=name=>panel.querySelector(`[data-storm-setting="${name}"]`);
  field('visible').checked=this._weatherStormVisible();
  field('grouping').disabled=!grouping;
  field('grouping').value=grouping?.state==='off'?'individual':'grouped';
  field('resolution').value=this._clusterResolutionProfileV40822||'balanced';
  field('navigation').checked=this._mapClusterJumpVisible!==false;
  field('infinite').checked=Number(this._statusClusterBrowseTimeoutMs)===0;
  field('timeout').disabled=field('infinite').checked;
  if(this.shadow.activeElement!==field('timeout')){
   field('timeout').value=Math.round((this._statusClusterBrowseTimeoutMs||this._statusClusterBrowseFiniteTimeoutMs||10000)/1000);
  }
  field('animation').disabled=!animation;
  field('animation').checked=animation?.state==='on';
  field('aura').checked=eyeBubbleAuraEnabled(this._eyeHubState().config,'storm');
  for(const kind of ['storm','danger']){
   const input=field(kind),source=this.shadow.getElementById(`settings-${kind}-slider`);
   input.disabled=!source||source.disabled;
   if(!source)continue;
   for(const key of ['min','max','step'])input[key]=source[key];
   if(this.shadow.activeElement!==input)input.value=source.value;
   const text=input.value+' km';
   if(input.nextElementSibling.textContent!==text)input.nextElementSibling.textContent=text;
  }
 },

 _weatherStormChange(input){
  if(!this._weatherStormAvailable())return;
  switch(input.dataset.stormSetting){
   case 'visible': this._weatherStormSetVisible(input.checked);break;
   case 'grouping': this.shadow.getElementById(input.value==='grouped'?'map-mode-grouped':'map-mode-individual')?.click();break;
   case 'resolution': this._setClusterResolutionProfile(input.value);break;
   case 'navigation': this._setMapInstrumentVisible('clusterJump',input.checked);break;
   case 'timeout': {
    const source=this.shadow.getElementById('settings-cluster-jump-seconds');
    if(source){source.value=input.value;source.dispatchEvent(new Event('change',{bubbles:true}));input.value=source.value;}
    break;
   }
   case 'infinite': this.shadow.getElementById('settings-cluster-jump-infinite')?.click();break;
   case 'animation': this._switchSetting(this._animationEntity(),input.checked);break;
   case 'storm':
   case 'danger': {
    const source=this.shadow.getElementById(`settings-${input.dataset.stormSetting}-slider`);
    if(source){source.value=input.value;source.dispatchEvent(new Event('input',{bubbles:true}));source.dispatchEvent(new Event('change',{bubbles:true}));}
    break;
   }
   case 'aura': this._eyeHubSetBubbleAura('storm',input.checked);break;
   default:return;
  }
  this._weatherStormSyncPanel();
 }
};
