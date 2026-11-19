import {settingsStorage} from '../core/settings-vault.js?v=411243r1';
import {SnakePreview,SNAKE_SCENARIOS} from './snake-preview.js?v=411211r1';
import {SNAKE_DEFAULTS,SNAKE_LIMITS,snakeSettingText} from './snake-config.js?v=411211r1';
import {WindStudioModel,importPreset,exportPresetJSON,exportPresetCSV,MAX_PRESET_BYTES} from './wind-studio-data.js?v=411211r1';
import {PREMIUM_INFO,enhancePremiumSections,premiumEscape} from './premium-ui.js?v=411243r1';
const button=(action,label)=>`<button type="button" data-studio-action="${action}">${label}</button>`;
const sections=(id,title,body,open=false)=>`<details data-section="studio-${id}" ${open?'open':''}><summary>${title}</summary>${body}</details>`;
export function ensureWindStudioStyle(shadow){
 if(shadow.getElementById('wind-studio-style'))return;const style=document.createElement('style');style.id='wind-studio-style';style.textContent=`
 .wind-studio{min-width:0;width:100%;box-sizing:border-box}.wind-studio h3{color:#f1d38a;font-size:13px;margin:8px 0}.wind-studio .studio-head{display:flex;align-items:center;gap:6px}.wind-studio .studio-head h3{flex:1;min-width:0}.wind-studio .studio-icon{width:40px;height:40px;min-width:40px;padding:0!important;background:transparent!important;border:0!important}.wind-studio .studio-icon img{width:30px;height:30px;object-fit:contain}
 .wind-studio .studio-preview{position:relative;width:100%;height:220px;max-height:34vh;min-height:120px;border:1px solid #b5985a;border-radius:9px;box-sizing:border-box;background:radial-gradient(ellipse at center,#18314a,#080f19);overflow:hidden}.wind-studio .studio-preview canvas{display:block;pointer-events:none}.wind-studio .studio-actions{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0;min-width:0}.wind-studio .studio-actions button{min-height:38px;max-width:100%;overflow-wrap:anywhere}.wind-studio .studio-block{display:grid;gap:5px;min-width:0}.wind-studio .studio-block input,.wind-studio .studio-block select,.wind-studio textarea{width:100%;max-width:100%;min-width:0;box-sizing:border-box;font:inherit;color:inherit;background:#111d29;border:1px solid #b5985a66;border-radius:6px;padding:7px}.wind-studio textarea{min-height:110px;resize:vertical;display:block}.wind-studio .studio-block select{max-width:100%}.wind-studio input[type=file]{font-size:11px}.wind-studio .studio-error{color:#ffb5a5}.wind-studio .studio-message{color:#e9ce91;overflow-wrap:anywhere}.wind-studio [hidden]{display:none!important}.wind-studio .studio-import-values{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 8px;font-variant-numeric:tabular-nums;overflow-wrap:anywhere}.wind-studio .studio-confirm{border:1px solid #cc9870;padding:8px;border-radius:7px;background:#281c16}.wind-studio .studio-warning{color:#f1d38a;font-weight:600}
 `;shadow.append(style);
}
export class WindStudio{
 constructor(owner,panel){
  Object.assign(this,{owner,panel});ensureWindStudioStyle(owner.shadow);this.model=new WindStudioModel(owner._weatherWindState().config.snake,{storage:settingsStorage(owner)});this.urls=new Set();this.root=document.createElement('section');this.root.className='wind-studio';this.staged=null;this.destroyed=false;
  const caption=key=>`<span data-studio-copy="${key}"></span>`;
  const range=key=>{const [min,max,step]=SNAKE_LIMITS[key];return `<label class="snake-slider"><span>${premiumEscape(this.sliderLabel(key))}</span><input type="range" data-studio-param="${key}" min="${min}" max="${max}" step="${step}" aria-label="${premiumEscape(this.text('draftSlider',{name:this.sliderLabel(key)}))}"><output></output></label>`;};
  const geometry=['minLength','maxLength','lengthScale','headSize','bodyWidth','taper','tailStart','opacity'];
  this.root.innerHTML=`<div class="studio-head"><h3><span data-studio-copy="title"></span></h3><button type="button" class="studio-icon" data-studio-action="info" data-studio-aria="hints" aria-expanded="false"><img src="${PREMIUM_INFO}" alt=""></button><button type="button" class="studio-icon" data-studio-action="close" data-studio-aria="close"><img alt="" data-studio-close></button></div>
  <p class="weather-wind-note" data-studio-info hidden><span data-studio-copy="intro"></span></p>
  <p class="weather-wind-note"><span data-studio-copy="scope"></span></p><p class="studio-warning"><span data-studio-copy="previewWarning"></span></p>
  ${sections('preview',caption('preview'),'<div class="studio-preview"></div><div class="studio-actions">'+button('start',caption('start'))+button('stop',caption('stop'))+button('pause',caption('pause'))+button('restart',caption('restart'))+'</div><p class="weather-wind-note" data-studio-metrics></p>',true)}
  ${sections('conditions',caption('conditions'),'<label class="studio-block"><span><span data-studio-copy="scenario"></span></span><select data-studio-scenario>'+Object.keys(SNAKE_SCENARIOS).map(k=>`<option value="${k}" data-studio-copy="${k}"></option>`).join('')+'</select></label>',true)}
  ${sections('geometry',caption('geometry'),geometry.map(range).join(''),true)}
  ${sections('animation','<span data-studio-shared-copy="weather.menu.animation"></span>',['density','speed','response'].map(range).join('')+'<p class="weather-wind-note"><span data-studio-copy="particleNote"></span></p>')}
  ${sections('profiles',caption('profiles'),'<label class="studio-block"><span><span data-studio-copy="pickProfile"></span></span><select data-studio-profile></select></label><label class="studio-block"><span data-studio-shared-copy="vault.profileName"></span><input type="text" maxlength="64" data-studio-name autocomplete="off"></label><div class="studio-actions">'+button('new',caption('new'))+button('save',caption('save'))+button('load',caption('load'))+button('rename',caption('rename'))+button('duplicate',caption('duplicate'))+button('delete',caption('delete'))+button('reset',caption('reset'))+button('factory',caption('factory'))+'</div><p class="weather-wind-note"><span data-studio-copy="profileNote"></span></p><div class="studio-confirm" data-studio-confirm hidden role="alertdialog" data-studio-aria="deletePrompt"><p></p><div class="studio-actions">'+button('confirm-delete',caption('deletePermanently'))+button('cancel-delete','<span data-studio-shared-copy="eye.cancel"></span>')+'</div></div>')}
  ${sections('transfer',caption('transfer'),'<div class="studio-actions">'+button('json',caption('json'))+button('csv',caption('csv'))+'</div><label class="studio-block"><span><span data-studio-copy="file"></span></span><input type="file" accept=".json,.csv,application/json,text/csv" data-studio-file></label><label class="studio-block"><span><span data-studio-copy="csvPaste"></span></span><textarea data-studio-csv maxlength="65536" spellcheck="false" placeholder="parameter,value"></textarea></label><div class="studio-actions">'+button('csv-text',caption('csvReview'))+'</div><p class="weather-wind-note"><span data-studio-copy="transferNote"></span></p><div data-studio-import hidden><strong data-studio-import-title></strong><dl class="studio-import-values"></dl><div class="studio-actions">'+button('accept-import',caption('acceptImport'))+button('cancel-import',caption('cancelImport'))+'</div></div><label class="studio-block" data-studio-export hidden><span><span data-studio-copy="exportLabel"></span></span><textarea readonly data-studio-export-text spellcheck="false"></textarea></label>')}
  <p class="weather-wind-note" data-studio-state></p><div class="studio-actions">${button('apply',caption('apply'))}${button('discard',caption('discard'))}</div><p class="studio-message" role="status" data-studio-message></p>`;
  this.root.querySelector('[data-studio-close]').src=owner._weatherPremiumCloseAsset?.()||'';this.name=this.root.querySelector('[data-studio-name]');this.name.value=this.model.name;
  this.root.addEventListener('input',event=>{const key=event.target.dataset.studioParam;if(key)this.act(()=>{this.model.setDraft({[key]:Number(event.target.value)});this.syncDraft();});else if(event.target===this.name){try{this.model.commit({name:this.name.value.trim()});}catch(_){/* Incomplete names are validated when a command uses them. */}}});
  this.root.addEventListener('change',event=>{if(event.target.matches('[data-studio-file]'))this.readFile(event.target.files?.[0]);else if(event.target.matches('[data-studio-scenario]'))this.act(()=>{this.preview?.setScenario(event.target.value);});else if(event.target.matches('[data-studio-profile]'))this.act(()=>{this.model.select(event.target.value||null);if(this.model.profile)this.name.value=this.model.profile.name;this.syncProfiles();});});
  this.root.addEventListener('click',event=>{const action=event.target.closest('[data-studio-action]')?.dataset.studioAction;if(action){event.stopPropagation();this.act(()=>this.action(action));}});
  this.previewHost=this.root.querySelector('.studio-preview');this.observer=new MutationObserver(records=>{if(!this.root.isConnected||records.some(r=>r.target===panel||r.target.contains?.(this.previewHost)))this.syncVisibility();});this.observer.observe(owner.shadow,{attributes:true,subtree:true,childList:true,attributeFilter:['hidden','class','open','aria-expanded']});
  this.activeSync=event=>{if(!this.root.contains(event.target))this.syncActive();};panel.addEventListener('input',this.activeSync);panel.addEventListener('change',this.activeSync);
  this.syncLanguage();this.syncProfiles();this.syncDraft();if(this.model.warning)this.message(this.model.warning,true);
 }
 attach(slot){if(this.root.parentElement!==slot)slot.append(this.root);this.syncLanguage();enhancePremiumSections(this.panel,'wind-settings');this.syncVisibility();this.syncActive();const color=this.owner._weatherWindSymbolColor?.()||'#ffffff';if(this.preview&&this.preview.color!==color)this.preview.setColor(color);}
 text(key,vars){return this.owner._t('weather.studio.'+key,vars);}
 sliderLabel(key){
  if(key==='opacity')return this.owner._t('eye.quick.transparency');
  return this.owner._t('weather.wind.'+(({density:'particleDensity',speed:'animationSpeed'})[key]||key));
 }
 syncLanguage(){
  const language=this.owner._languageValue();
  if(this.root.dataset.language===language)return;
  this.root.dataset.language=language;
  this.root.setAttribute('aria-label',this.text('title'));
  for(const node of this.root.querySelectorAll('[data-studio-copy]'))node.textContent=this.text(node.dataset.studioCopy);
  for(const node of this.root.querySelectorAll('[data-studio-shared-copy]'))node.textContent=this.owner._t(node.dataset.studioSharedCopy);
  for(const node of this.root.querySelectorAll('[data-studio-aria]'))node.setAttribute('aria-label',this.text(node.dataset.studioAria));
  for(const input of this.root.querySelectorAll('[data-studio-param]')){
   const name=this.sliderLabel(input.dataset.studioParam);
   input.previousElementSibling.textContent=name;
   input.setAttribute('aria-label',this.text('draftSlider',{name}));
  }
  if(this.preview?.paused)this.root.querySelector('[data-studio-action=pause] [data-studio-copy]').textContent=this.text('resume');
  const draft=this.root.querySelector('[data-studio-profile] option[value=""]');
  if(draft)draft.textContent=this.text('unsaved');
 }
 act(fn){try{return fn();}catch(error){this.syncDraft();this.message(error.message||this.text('failure'),true);}}
 message(text,error=false){const node=this.root.querySelector('[data-studio-message]');node.textContent=text;node.classList.toggle('studio-error',error);}
 syncDraft(){for(const input of this.root.querySelectorAll('[data-studio-param]')){const key=input.dataset.studioParam;input.value=this.model.draft[key];input.nextElementSibling.textContent=snakeSettingText(key,this.model.draft[key]);}this.preview?.setParameters(this.model.draft);this.syncActive();}
 syncActive(){const c=this.owner._weatherWindState().config,same=Object.keys(SNAKE_LIMITS).every(k=>c.snake[k]===this.model.draft[k]);this.root.querySelector('[data-studio-state]').textContent=(same?this.text('sameDraft'):this.text('changedDraft'))+(c.mode!=='snake'?' '+this.text('otherMode'):'');}
 syncProfiles(){const select=this.root.querySelector('[data-studio-profile]');select.replaceChildren();const empty=document.createElement('option');empty.value='';empty.textContent=this.text('unsaved');select.append(empty);for(const p of this.model.profiles){const option=document.createElement('option');option.value=p.id;option.textContent=p.name+(p.builtin?' · '+this.owner._t('eye.quick.reset'):'');select.append(option);}select.value=this.model.selected||'';const profile=this.model.profile;for(const action of ['save','rename','delete'])this.root.querySelector(`[data-studio-action=${action}]`).disabled=!profile||profile.builtin;for(const action of ['load','duplicate','reset'])this.root.querySelector(`[data-studio-action=${action}]`).disabled=!profile;this.root.querySelector('[data-studio-confirm]').hidden=true;}
 visible(){const target=this.root.querySelector('.studio-preview');return this.root.isConnected&&!target.closest('details:not([open]),.gr-closing,.minimized,[hidden]')&&target.getClientRects().length>0&&getComputedStyle(target).visibility!=='hidden';}
 syncVisibility(){if(this.destroyed)return;const visible=this.visible();if(visible&&!this.preview){const c=this.owner._weatherWindState().config;this.preview=new SnakePreview(this.root.querySelector('.studio-preview'),{parameters:this.model.draft,color:this.owner._weatherWindSymbolColor?.()||'#ffffff',onMetrics:m=>{this.root.querySelector('[data-studio-metrics]').textContent=`${m.segments} Partikel · Render Ø ${m.meanRenderMs.toFixed(1)} ms · Historien ${(m.historyBytes/1024).toFixed(0)} KiB · max. ${m.historyCapacity} Punkte/Partikel`;} });}if(this.preview&&visible!==this.preview.visible)this.preview.setVisible(visible);}
 action(action){
  const m=this.model,profile=m.profile;
  if(action==='close'){this.root.closest('details[data-section=experts]').querySelector(':scope>summary').click();return;}
  if(action==='info'){const node=this.root.querySelector('[data-studio-info]');node.hidden=!node.hidden;this.root.querySelector('[data-studio-action=info]').setAttribute('aria-expanded',String(!node.hidden));return;}
  if(['start','stop','restart'].includes(action)){this.preview?.[action]();return;}
  if(action==='pause'){if(this.preview){this.preview.pause(!this.preview.paused);this.root.querySelector('[data-studio-action=pause] [data-studio-copy]').textContent=this.preview.paused?this.text('resume'):this.text('pause');}return;}
  if(action==='new')m.create(this.name.value);
  else if(action==='save')m.save();
  else if(action==='load'||action==='reset')m.load();
  else if(action==='rename')m.rename(this.name.value);
  else if(action==='duplicate'){let name=this.name.value;if(profile&&name===profile.name){const base=name.slice(0,48)+' Kopie';name=base;for(let i=2;m.profiles.some(p=>p.name===name);i++)name=base+' '+i;}m.duplicate(name);}
  else if(action==='delete'){m.writable();const confirm=this.root.querySelector('[data-studio-confirm]');confirm.querySelector('p').textContent=this.text('deleteConfirm',{name:profile.name});confirm.hidden=false;confirm.querySelector('button').focus();return;}
  else if(action==='cancel-delete'){this.root.querySelector('[data-studio-confirm]').hidden=true;return;}
  else if(action==='confirm-delete')m.remove(true);
  else if(action==='factory')m.replaceDraft(SNAKE_DEFAULTS,'Werkseinstellung',{unselect:true});
  else if(action==='discard')m.replaceDraft(this.owner._weatherWindState().config.snake,'Aktives Kartendesign',{unselect:true});
  else if(action==='apply'){this.owner._weatherWindSet({snake:{...m.draft}},{render:false});this.syncActive();this.message(this.text('applied'));return;}
  else if(action==='json'||action==='csv'){this.download(action);return;}
  else if(action==='csv-text'){this.clearImport();this.stage(importPreset(this.root.querySelector('[data-studio-csv]').value,{format:'csv',partial:true,base:m.draft,fallbackName:m.name}));return;}
  else if(action==='accept-import'){if(!this.staged)throw Error(this.text('missingImport'));m.replaceDraft(this.staged.parameters,this.staged.name,{unselect:true});this.staged=null;this.root.querySelector('[data-studio-import]').hidden=true;}
  else if(action==='cancel-import'){this.staged=null;this.root.querySelector('[data-studio-import]').hidden=true;return;}
  else return;
  this.name.value=m.name;this.syncProfiles();this.syncDraft();this.message(this.text('draftSaved'));
 }
 stage(p){this.staged=p;const box=this.root.querySelector('[data-studio-import]'),dl=box.querySelector('dl');box.querySelector('strong').textContent=p.name+' · '+this.text('importPreview',{count:p.importedKeys.length});dl.replaceChildren();for(const key of Object.keys(SNAKE_LIMITS)){const term=document.createElement('dt'),value=document.createElement('dd');term.textContent=this.sliderLabel(key);value.textContent=snakeSettingText(key,p.parameters[key]);dl.append(term,value);}box.hidden=false;this.message(this.text('reviewed'));}
 clearImport(){this.staged=null;this.root.querySelector('[data-studio-import]').hidden=true;}
 async readFile(file){if(!file)return;this.clearImport();const ticket=this.fileTicket=Symbol();try{if(file.size>MAX_PRESET_BYTES)throw Error(this.text('fileTooLarge'));const ext=file.name.split('.').at(-1).toLowerCase();if(!['json','csv'].includes(ext))throw Error(this.text('fileChoose'));const text=await file.text();if(this.destroyed||this.fileTicket!==ticket)return;this.stage(importPreset(text,{format:ext}));}catch(error){if(!this.destroyed)this.message(error.message,true);}finally{if(!this.destroyed)this.root.querySelector('[data-studio-file]').value='';}}
 download(format){const name=this.name.value,text=format==='json'?exportPresetJSON(name,this.model.draft):exportPresetCSV(name,this.model.draft);this.root.querySelector('[data-studio-export-text]').value=text;this.root.querySelector('[data-studio-export]').hidden=false;const blob=new Blob([text],{type:format==='json'?'application/json;charset=utf-8':'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');this.urls.add(url);a.href=url;a.download=(name.replace(/[^a-z0-9_-]/gi,'-').slice(0,64)||'wind-design')+'.'+format;this.root.append(a);a.click();a.remove();setTimeout(()=>{URL.revokeObjectURL(url);this.urls.delete(url);},1000);this.message(this.text('downloaded'));}
 get editing(){const active=this.owner.shadow.activeElement;return this.root.contains(active)&&active?.matches('input,textarea,select');}
 destroy(){this.destroyed=true;this.fileTicket=null;this.observer.disconnect();this.panel.removeEventListener('input',this.activeSync);this.panel.removeEventListener('change',this.activeSync);this.preview?.destroy();for(const url of this.urls)URL.revokeObjectURL(url);this.urls.clear();this.root.remove();}
}
