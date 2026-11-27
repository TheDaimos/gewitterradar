// MA-022: profile share/transfer UI; never mutate Local To-do or remove final links.
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const PROFILE=/^[0-9a-f]{32}$/;
export function ma022Choices(places=[],filter="",selected=new Set()){
 const term=String(filter).trim().toLocaleLowerCase(),seen=new Set();
 return places.filter(p=>{
  const id=String(p?.uid||"");
  if(!UUID.test(id)||seen.has(id)||!Number.isInteger(p.revision)||p.revision<1)return false;
  seen.add(id);return !term||String(p.name||p.summary||"").toLocaleLowerCase().includes(term);
 }).map(p=>({...p,selected:selected.has(p.uid)}));
}
export function ma022Target(user,profile){
 const u=String(user||"").trim(),p=String(profile||"").trim();
 if(!u||u.length>128||!PROFILE.test(p))throw new TypeError("MA_INVALID_TARGET");
 return Object.freeze({user:u,profile:p});
}
const LANG={
 de:{title:"Profile & Freigaben",subtitle:"Monitored Areas · MA-022",close:"Schließen",
 note:"Freigaben sind erst nach geprüftem SQLite-Cutover erlaubt. Die Local-To-do-Liste bleibt unangetastet.",
 pending:"SQLite noch nicht aktiviert – keine Freigabe und keine Übertragung möglich.",
 filter:"Standorte suchen",selectVisible:"Sichtbare auswählen",clear:"Auswahl aufheben",
 selected:"ausgewählt",none:"Keine passenden Standorte",active:"Aktiv",archived:"Archiviert",
 targetUser:"Ziel: HA-Benutzer-ID",targetProfile:"Ziel: Vault-Profil-ID",
 myAccount:"Eigenes HA-Konto",ownProfiles:"Eigenes Vault-Profil wählen",
 targetInfo:"Fremde Profilnamen bleiben privat. Für andere Benutzer sind die HA-Benutzer-ID und die 32-stellige Vault-Profil-ID erforderlich.",
 share:"Auswahl freigeben",transfer:"Auswahl übertragen",
 confirmShare:"Ausgewählte Standorte wirklich freigeben?",
 confirmTransfer:"Ausgewählte Standorte übertragen? Der Zugriff dieses Vault-Profils wird dadurch entfernt.",
 missing:"Bitte Standorte auswählen.",invalidTarget:"Ungültige Benutzer-/Profil-ID.",
 same:"Quell- und Zielprofil dürfen nicht identisch sein.",
 success:"erfolgreich",failure:"fehlgeschlagen",done:"Von Home Assistant bestätigt.",
 partial:"Teilweise erfolgreich – bitte aktualisieren und Fehler prüfen; erfolgreiche Freigaben bleiben bestehen.",
 busy:"Übertrage mit HA-Bestätigung …",check:"Verknüpfungen prüfen",own:"Eigene Verknüpfung",
 links:"verbundene Profile",prefs:"Persönliche Vorgaben",load:"Vorgaben für einen Ort laden",
 one:"Bitte genau einen Standort wählen.",save:"Vorgaben speichern",
 disclaimer:"Nur die Einstellungen werden gespeichert. Die automatische Benachrichtigung ist noch nicht aktiv.",
 push:"Push vorbereiten",critical:"Kritische Hinweise vorbereiten",closure:"Entwarnung vorbereiten",
 statusPush:"Statusmeldungen vorbereiten",quiet:"Ruhezeit (Minuten)",mode:"Ereignistyp",
 both:"Blitze und Gewitter",strikes:"Blitze",storm:"Gewitter",
 saved:"Einstellungen von Home Assistant bestätigt",profileError:"Zielprofil nicht verifiziert.",
 conflict:"Standortdaten wurden geändert. Bitte neu laden.",failed:"Aktion fehlgeschlagen",
 unavailable:"Freigabeverwaltung noch nicht verfügbar."},
 en:{title:"Profiles & sharing",subtitle:"Monitored Areas · MA-022",close:"Close",
 note:"Sharing is only available after verified SQLite cutover. Local To-do stays untouched.",
 pending:"SQLite is not active – sharing and transfer are disabled.",
 filter:"Filter locations",selectVisible:"Select visible",clear:"Clear selection",
 selected:"selected",none:"No matching locations",active:"Active",archived:"Archived",
 targetUser:"Target HA user ID",targetProfile:"Target Vault profile ID",
 myAccount:"My HA account",ownProfiles:"Choose my Vault profile",
 targetInfo:"Other users' profiles remain private. Enter the HA user ID and 32-character Vault profile ID.",
 share:"Share selection",transfer:"Transfer selection",
 confirmShare:"Really share the selected locations?",
 confirmTransfer:"Transfer the selected locations? Access for this Vault profile will be removed.",
 missing:"Select locations.",invalidTarget:"Invalid user/profile ID.",same:"Source and target must differ.",
 success:"successful",failure:"failed",done:"Confirmed by Home Assistant.",
 partial:"Partial success – refresh and check errors; successful changes remain.",
 busy:"Waiting for Home Assistant acknowledgements …",check:"Inspect links",own:"Own link",
 links:"linked profiles",prefs:"Personal preferences",load:"Load preferences for one location",
 one:"Select exactly one location.",save:"Save preferences",
 disclaimer:"Only settings are saved. Automated notifications are not yet active.",
 push:"Prepare push",critical:"Prepare critical alerts",closure:"Prepare all-clear",
 statusPush:"Prepare status updates",quiet:"Quiet time (minutes)",mode:"Event type",
 both:"Strikes and storms",strikes:"Strikes",storm:"Storms",
 saved:"Settings confirmed by Home Assistant",profileError:"Target profile not verified.",
 conflict:"Location changed. Refresh first.",failed:"Action failed",unavailable:"Sharing is unavailable."}
};
const CSS=".gr-ma022-overlay{position:fixed;inset:0;z-index:2147483611;padding:12px;box-sizing:border-box;display:grid;place-items:center;background:#03090ee0;backdrop-filter:blur(8px)}"+
".gr-ma022-panel{width:min(920px,100%);height:min(820px,calc(100dvh - 24px));min-height:0;display:flex;flex-direction:column;overflow:hidden;border:2px solid transparent;border-radius:22px;background:linear-gradient(180deg,#172b3b,#08141e) padding-box,linear-gradient(145deg,#e3c17d,#80602d 16%,#f9e3ad 29%,#735024 45%,#ba9144 57%,#ffe5a0 74%,#614723 86%,#cba35c) border-box;box-shadow:0 30px 90px #000d;color:#eef3f6;font:14px/1.5 system-ui,sans-serif;box-sizing:border-box}"+
".gr-ma022-panel *{box-sizing:border-box}.gr-ma022-head,.gr-ma022-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-shrink:0;padding:13px 17px;background:linear-gradient(180deg,#283641,#111e2a);border-bottom:1px solid #aa874b}.gr-ma022-foot{border-top:1px solid #aa874b;border-bottom:0}"+
".gr-ma022-head strong{font:24px Georgia,serif;color:#f4d8a1}.gr-ma022-head small{display:block;color:#a8bed0}.gr-ma022-close{flex:none;width:44px;height:44px;background:transparent;border:0;padding:0;cursor:pointer}.gr-ma022-close img{width:39px;height:39px;object-fit:contain;pointer-events:none}"+
".gr-ma022-scroll{overflow:auto;min-height:0;flex:1;padding:14px 17px;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#917449 transparent}.gr-ma022-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}.gr-ma022-card{min-width:0;overflow:hidden;border:1px solid #aa874b88;border-radius:12px;background:linear-gradient(140deg,#1d3242,#0e1e2c)}.gr-ma022-card h3{margin:0;padding:11px 12px;color:#edcb90;font:18px Georgia,serif;border-bottom:1px solid #a68a5677}"+
".gr-ma022-field{padding:9px 12px;display:grid;gap:5px}.gr-ma022-field label{font-size:12px;color:#ead19d}.gr-ma022-field input,.gr-ma022-field select{width:100%;min-width:0;min-height:40px;border-radius:9px;border:1px solid #9a7a4d;background:#0a1a26;color:#f4e8d7;padding:8px}.gr-ma022-place-list{max-height:320px;overflow:auto;scrollbar-width:thin;scrollbar-color:#90774b transparent}.gr-ma022-place{display:flex;align-items:flex-start;gap:8px;padding:10px 12px;border-bottom:1px solid #9c794844;cursor:pointer}.gr-ma022-place input{width:18px;height:18px;flex:none;accent-color:#d4a75d}.gr-ma022-place small{display:block;color:#adbdc9}.gr-ma022-hint{margin:8px 12px;color:#b5c5ce;font-size:12px;overflow-wrap:anywhere}"+
".gr-ma022-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:9px 12px}.gr-ma022-button{border:1px solid #c9a263;border-radius:10px;min-height:41px;padding:8px 12px;background:linear-gradient(180deg,#d2b077,#59462d 8%,#273947 22%,#142633 78%,#795b33 95%,#e0be7d);color:#f5e1b5;font-weight:650;cursor:pointer;text-shadow:0 1px #000}.gr-ma022-button:disabled{opacity:.42;cursor:not-allowed}.gr-ma022-button:focus-visible{outline:2px solid #ffe6aa;outline-offset:3px}.gr-ma022-button[data-danger=true]{border-color:#e2a68a}"+
".gr-ma022-status{flex:1;min-width:0;max-height:96px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere}.gr-ma022-status[data-error=true]{color:#ffbcb0}.gr-ma022-pref{padding:10px 12px}.gr-ma022-pref label{display:flex;gap:8px;margin:6px 0}.gr-ma022-pref input[type=checkbox]{accent-color:#d4a75d}.gr-ma022-pref select{width:100%;min-height:39px;padding:7px;background:#0a1a26;color:#f5e8d4;border:1px solid #aa8b56;border-radius:9px}.gr-ma022-pref p{font-size:12px;color:#b6c4cf}"+
"@media(max-width:700px){.gr-ma022-grid{grid-template-columns:minmax(0,1fr)}.gr-ma022-scroll{padding:10px}.gr-ma022-panel{height:calc(100dvh - 20px)}.gr-ma022-place-list{max-height:190px}.gr-ma022-head,.gr-ma022-foot{padding:9px 12px}.gr-ma022-head strong{font-size:20px}}";
const el=(tag,value,cls)=>{const n=document.createElement(tag);if(value!==null&&value!==undefined)n.textContent=String(value);if(cls)n.className=cls;return n};
const button=(txt,fn)=>{const n=el("button",txt,"gr-ma022-button");n.type="button";n.addEventListener("click",fn);return n};
const message=(err,t)=>{const code=String(err?.code||err?.message||err);return /profile_not_found|MA_INVALID_TARGET|target_is_source/.test(code)?t.profileError:/revision_conflict/.test(code)?t.conflict:t.failed+" ("+code.slice(0,90)+")"};
export function openProfileSharing(owner,{mode="legacy",places=[],listLinks,getPreferences,
 shareLocation,updatePreferences,refresh,verifyContext,makeRequestId,initialLocationIds=[]}={}){
 if(!owner?.shadow||typeof verifyContext!=="function")return null;
 owner.shadow.getElementById("gr-ma022-overlay")?.__dispose?.();
 const t=/Deutsch|Boarisch|Platt|Sächs|Schwäb/i.test(owner._languageValue?.()||"Deutsch")?LANG.de:LANG.en;
 const overlay=el("div",null,"gr-ma022-overlay");overlay.id="gr-ma022-overlay";
 const panel=el("section",null,"gr-ma022-panel");panel.setAttribute("role","dialog");panel.setAttribute("aria-modal","true");panel.setAttribute("aria-label",t.title);
 const head=el("header",null,"gr-ma022-head"),headCopy=el("div");
 headCopy.append(el("strong",t.title),el("small",t.subtitle));
 const exit=button("",()=>closeOverlay());exit.className="gr-ma022-close";exit.setAttribute("aria-label",t.close);
 const img=el("img");img.alt="";img.draggable=false;
 img.src=owner.shadow.getElementById("settings-close")?.querySelector("img")?.src||new URL("../../assets/gewitterradar-about-close-premium.webp",import.meta.url).href;
 exit.append(img);head.append(headCopy,exit);
 const scroll=el("div",null,"gr-ma022-scroll");
 scroll.append(el("p",mode==="db_active"?t.note:t.pending,"gr-ma022-hint"));
 const grid=el("div",null,"gr-ma022-grid"),left=el("section",null,"gr-ma022-card");
 left.append(el("h3",t.selected));
 const filterWrap=el("div",null,"gr-ma022-field"),filter=el("input");
 filter.type="search";filter.placeholder=t.filter;filter.setAttribute("aria-label",t.filter);filterWrap.append(filter);
 const choiceBtns=el("div",null,"gr-ma022-row"),list=el("div",null,"gr-ma022-place-list");
 const count=el("p","0 "+t.selected,"gr-ma022-hint");
 const allowedIds=new Set(ma022Choices(places).map(p=>p.uid));
 const picked=new Set((Array.isArray(initialLocationIds)?initialLocationIds:[])
   .filter(id=>allowedIds.has(id)));let busy=false,pref=null,prefLocation=null,seq=0;
 const setStatus=(s,error=false)=>{status.textContent=s;status.dataset.error=String(error)};
 const permitted=()=>mode==="db_active"&&verifyContext()===true;
 const all=button(t.selectVisible,()=>{for(const p of ma022Choices(places,filter.value))picked.add(p.uid);render()});
 const clear=button(t.clear,()=>{picked.clear();render()});choiceBtns.append(all,clear);
 left.append(filterWrap,choiceBtns,list,count);
 const right=el("div"),target=el("section",null,"gr-ma022-card");target.append(el("h3",t.title));
 const makeField=(label)=>{const wrapper=el("div",null,"gr-ma022-field"),input=el("input");input.type="text";input.autocomplete="off";wrapper.append(el("label",label),input);return [wrapper,input]};
 const [userWrap,user]=makeField(t.targetUser),[profileWrap,profile]=makeField(t.targetProfile);user.maxLength=128;profile.maxLength=32;
 const ownBtn=button(t.myAccount,()=>{user.value=String(owner._hass?.user?.id||"");syncOwnProfiles()});
 const ownRow=el("div",null,"gr-ma022-row");ownRow.append(ownBtn);
 const ownSelect=el("select"),ownBox=el("div",null,"gr-ma022-field");ownBox.append(el("label",t.ownProfiles),ownSelect);
 const syncOwnProfiles=()=>{const own=user.value.trim()===String(owner._hass?.user?.id||"");
  ownSelect.replaceChildren();const blank=el("option",t.ownProfiles);blank.value="";ownSelect.append(blank);
  for(const entry of own&&Array.isArray(owner._settingsVault?.profiles)?owner._settingsVault.profiles:[]){
   if(!PROFILE.test(String(entry?.id||"")))continue;
   const o=el("option",entry.name||entry.id);o.value=entry.id;ownSelect.append(o);
  }ownBox.hidden=!own||ownSelect.options.length<=1;
 };
 ownSelect.addEventListener("change",()=>{if(ownSelect.value)profile.value=ownSelect.value});
 user.addEventListener("input",syncOwnProfiles);
 target.append(userWrap,profileWrap,ownRow,ownBox,el("p",t.targetInfo,"gr-ma022-hint"));
 const prefsBox=el("section",null,"gr-ma022-card");prefsBox.append(el("h3",t.prefs));
 const prefsRow=el("div",null,"gr-ma022-row");
 const linksBtn=button(t.check,()=>void loadLinks()),prefBtn=button(t.load,()=>void loadPrefs());
 prefsRow.append(linksBtn,prefBtn);
 const prefsContent=el("div",t.one,"gr-ma022-pref");prefsBox.append(prefsRow,prefsContent);
 right.append(target,prefsBox);grid.append(left,right);scroll.append(grid);
 const foot=el("footer",null,"gr-ma022-foot"),status=el("div",null,"gr-ma022-status");
 status.setAttribute("role","status");status.setAttribute("aria-live","polite");
 const footBtns=el("div",null,"gr-ma022-row"),shareBtn=button(t.share,()=>void execute(false));
 const transferBtn=button(t.transfer,()=>void execute(true));transferBtn.dataset.danger="true";
 footBtns.append(shareBtn,transferBtn);foot.append(status,footBtns);
 panel.append(head,scroll,foot);overlay.append(el("style",CSS),panel);
 const fullscreen=owner.shadow.getElementById("map-fullscreen-dialog");
 (fullscreen?.open?fullscreen:owner.shadow).append(overlay);
 const selectedPlace=()=>{if(!permitted()||picked.size!==1)throw Error(t.one);
  const x=places.find(p=>p.uid===[...picked][0]);if(!x)throw Error(t.one);return x};
 const setBusy=value=>{busy=value;for(const x of [all,clear,linksBtn,prefBtn,ownBtn,user,profile,ownSelect])
  x.disabled=value||mode!=="db_active";
  for(const x of list.querySelectorAll("input"))x.disabled=value||mode!=="db_active";
 };
 function render(){
  list.replaceChildren();const shown=ma022Choices(places,filter.value,picked);
  for(const p of shown){
   const label=el("label",null,"gr-ma022-place"),box=el("input");
   box.type="checkbox";box.checked=picked.has(p.uid);box.disabled=busy||mode!=="db_active";
   box.addEventListener("change",()=>{if(box.checked)picked.add(p.uid);else picked.delete(p.uid);render()});
   const content=el("span");content.append(el("strong",p.name||p.summary||p.uid));
   content.append(el("small",(p.archived?t.archived:t.active)+" · Revision "+p.revision));
   label.append(box,content);list.append(label);
  }if(!shown.length)list.append(el("p",t.none,"gr-ma022-hint"));
  count.textContent=picked.size+" "+t.selected;
  for(const x of [linksBtn,prefBtn])x.disabled=busy||mode!=="db_active"||picked.size!==1;
  for(const x of [shareBtn,transferBtn])x.disabled=busy||mode!=="db_active"||!picked.size;
  if(prefLocation&&!picked.has(prefLocation)){pref=null;prefLocation=null;prefsContent.replaceChildren(el("p",t.one))}
 }
 async function loadLinks(){
  let place;try{place=selectedPlace()}catch(e){setStatus(e.message,true);return}
  setBusy(true);setStatus(t.busy);const n=++seq;
  try{const response=await listLinks(place.uid);
   if(permitted()&&overlay.isConnected&&n===seq)
    setStatus(t.own+": "+response.own_link_id+" · "+t.links+": "+response.shared_link_count);
  }catch(e){setStatus(message(e,t),true)}finally{setBusy(false);render()}
 }
 async function loadPrefs(){
  let place;try{place=selectedPlace()}catch(e){setStatus(e.message,true);return}
  if(typeof getPreferences!=="function"||typeof updatePreferences!=="function")return setStatus(t.unavailable,true);
  setBusy(true);setStatus(t.busy);const n=++seq;
  try{const loaded=await getPreferences(place.uid);
   if(permitted()&&overlay.isConnected&&n===seq){pref=loaded;prefLocation=place.uid;renderPrefs();setStatus(t.prefs+": "+(place.name||place.summary))}
  }catch(e){setStatus(message(e,t),true)}finally{setBusy(false);render()}
 }
 function renderPrefs(){
  prefsContent.replaceChildren();
  if(!pref||!prefLocation){prefsContent.append(el("p",t.one));return}
  prefsContent.append(el("p",t.disclaimer));
  const controls={};
  for(const [key,label] of [["push_enabled",t.push],["critical_enabled",t.critical],["closure_enabled",t.closure],["status_push",t.statusPush]]){
   const row=el("label"),box=el("input");box.type="checkbox";box.checked=pref[key]===true||pref[key]===1;
   row.append(box,el("span",label));controls[key]=box;prefsContent.append(row);
  }
  const quiet=el("select");for(let x=15;x<=60;x+=5){const o=el("option",x);o.value=String(x);quiet.append(o)}
  quiet.value=String(pref.quiet_minutes||15);prefsContent.append(el("p",t.quiet),quiet);
  const eventMode=el("select");for(const [v,label] of [["both",t.both],["strikes",t.strikes],["storm",t.storm]]){
   const o=el("option",label);o.value=v;eventMode.append(o);
  }eventMode.value=pref.notification_mode||"both";prefsContent.append(el("p",t.mode),eventMode);
  const saveBtn=button(t.save,async()=>{
   if(busy||!pref||!permitted())return;
   const link=pref.link_id,revision=pref.revision;
   const patch=Object.fromEntries(Object.entries(controls).map(([k,input])=>[k,input.checked?1:0]));
   patch.quiet_minutes=Number(quiet.value);patch.notification_mode=eventMode.value;
   setBusy(true);saveBtn.disabled=true;setStatus(t.busy);
   try{const result=await updatePreferences(link,patch,revision,makeRequestId());
    if(permitted()&&overlay.isConnected&&pref?.link_id===link){pref=result;setStatus(t.saved);renderPrefs()}
   }catch(e){setStatus(message(e,t),true)}finally{setBusy(false);render()}
  });prefsContent.append(saveBtn);
 }
 async function execute(transfer){
  if(busy||!permitted()||!picked.size||typeof shareLocation!=="function")return setStatus(t.missing,true);
  let target;try{target=ma022Target(user.value,profile.value)}catch{return setStatus(t.invalidTarget,true)}
  if(target.user===String(owner._hass?.user?.id||"")&&target.profile===String(owner._settingsVault?.profile?.id||""))
    return setStatus(t.same,true);
  const chosen=places.filter(p=>picked.has(p.uid)&&UUID.test(p.uid));
  const action=(transfer?t.confirmTransfer:t.confirmShare)+"\n"+chosen.map(p=>p.name||p.summary||p.uid).join(", ").slice(0,480)+"\n"+target.user+" / "+target.profile;
  if(!globalThis.confirm?.(action))return;
  setBusy(true);setStatus(t.busy);const successes=[],failures=[];
  for(const p of chosen){
   if(!permitted()||!overlay.isConnected){closeOverlay();return}
   try{await shareLocation(p.uid,target.user,target.profile,p.revision,makeRequestId(),{transfer});
    if(!permitted())throw Error("MA_PROFILE_CHANGED");
    successes.push(p.uid);picked.delete(p.uid);
   }catch(e){failures.push((p.name||p.uid)+": "+message(e,t))}
  }
  if(successes.length&&typeof refresh==="function"){try{await refresh()}catch{failures.push(t.conflict)}}
  setStatus(successes.length+" "+t.success+" · "+failures.length+" "+t.failure+"\n"+
    (failures.length?t.partial+"\n"+failures.join("\n").slice(0,1000):t.done),failures.length>0);
  setBusy(false);render();
 }
 filter.addEventListener("input",render);
 overlay.addEventListener("click",event=>{if(event.target===overlay&&!busy)closeOverlay()});
 overlay.addEventListener("keydown",event=>{if(event.key==="Escape"&&!busy){event.stopPropagation();closeOverlay()}});
 const onVaultChange=()=>{if(!verifyContext())closeOverlay()};
 function closeOverlay(){
  owner._settingsVault?.removeEventListener?.("change",onVaultChange);
  overlay.remove();
 }
 overlay.__dispose=closeOverlay;
 owner._settingsVault?.addEventListener?.("change",onVaultChange);
 syncOwnProfiles();render();if(mode!=="db_active")setStatus(t.pending,true);
 filter.focus({preventScroll:true});return overlay;
}
