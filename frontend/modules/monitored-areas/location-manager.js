// MA-023: additive profile-aware place manager. No automatic migration or tracker mutation.
const MA_PREMIUM_CLOSE = new URL("../../assets/gewitterradar-about-close-premium.webp", import.meta.url).href;
export const planLocations=({enabled=false,mode='legacy',places=[],removed=[]}={})=>{
  const authority=enabled&&mode==='db_active'?'db_active':enabled&&mode==='migration_pending'?'migration_pending':'legacy';
  const seen=new Set(),items=[];
  for(const [records,archived] of [[places,false],[removed,true]]){
    for(const place of records||[]){
      const uid=String(place?.uid||''),latitude=Number(place?.latitude),longitude=Number(place?.longitude);
      if(!uid||seen.has(uid)||!Number.isFinite(latitude)||!Number.isFinite(longitude)||
        Math.abs(latitude)>90||Math.abs(longitude)>180)continue;
      seen.add(uid);items.push({...place,uid,latitude,longitude,archived});
    }
  }
  return {mode:authority,canRename:authority==='db_active',
    active:items.filter(x=>!x.archived),archived:items.filter(x=>x.archived)};
};
const COPY={
 de:{title:'Standorte verwalten',subtitle:'Monitored Areas · V4.14',db:'SQLite-Verwaltung aktiv',
  pending:'Migration ausstehend · Local To-do bleibt maßgeblich',
  legacy:'Local To-do · bisherige Standortverwaltung',off:'Monitored Areas deaktiviert · alte Orte bleiben unverändert',
  filter:'Standorte filtern',refresh:'Aktualisieren',close:'Schließen',active:'Gespeicherte Orte',
  archived:'Archivierte Orte',empty:'Keine passenden Standorte',details:'Details',back:'Zurück',
  focus:'Auf Karte zeigen',rename:'Umbenennen',archive:'Archivieren',restore:'Wiederherstellen',
  coordinates:'Koordinaten',revision:'Revision',detailHint:'Überwachung und Havanna-Details folgen in einem weiteren Entwicklungsschritt.',
  renamePrompt:'Neuen Namen eingeben',archiveConfirm:'Standort archivieren? Er bleibt wiederherstellbar.',
  error:'Aktion nicht abgeschlossen',busy:'Bitte warten …',migration:'SQLite-Übernahme prüfen',
  setupHint:'Aktiviere Monitored Areas unter Einstellungen → Geräte & Dienste → GewitterRadar → Konfigurieren. Deine Local-To-do-Liste bleibt bis zur gesonderten Bestätigung unverändert.',
  legacyHint:'Die alte Local-To-do-Liste bleibt maßgeblich. Eine Migration wird nicht automatisch gestartet.',
  dbHint:'Änderungen werden nur nach Bestätigung durch Home Assistant übernommen.'},
 en:{title:'Manage locations',subtitle:'Monitored Areas · V4.14',db:'SQLite management active',
  pending:'Migration pending · Local To-do remains authoritative',
  legacy:'Local To-do · existing place management',off:'Monitored Areas disabled · existing places untouched',
  filter:'Filter locations',refresh:'Refresh',close:'Close',active:'Saved places',
  archived:'Archived places',empty:'No matching locations',details:'Details',back:'Back',
  focus:'Show on map',rename:'Rename',archive:'Archive',restore:'Restore',
  coordinates:'Coordinates',revision:'Revision',detailHint:'Monitoring and Havanna details will follow in a later development step.',
  renamePrompt:'Enter new name',archiveConfirm:'Archive location? It can be restored.',
  error:'Action not completed',busy:'Please wait …',migration:'Review SQLite migration',
  setupHint:'Enable Monitored Areas in Settings → Devices & services → GewitterRadar → Configure. Local To-do remains unchanged until separately confirmed.',
  legacyHint:'Local To-do remains authoritative. No migration starts automatically.',
  dbHint:'Changes are only applied following Home Assistant confirmation.'}
};
const STYLES='.gr-ma-manager{position:fixed;inset:0;display:grid;place-items:center;z-index:2147483598;background:#02070bdc;padding:12px;box-sizing:border-box;backdrop-filter:blur(7px)}'+
'.gr-ma-panel{box-sizing:border-box;width:min(760px,100%);height:min(820px,calc(100dvh - 24px));max-height:calc(100dvh - 24px);overflow:hidden;display:flex;flex-direction:column;padding:17px;border-radius:20px;border:2px solid #c5a773;color:#e7eef6;background:radial-gradient(ellipse at 12% 0%,#345267,#111b29 68%);box-shadow:0 20px 70px #000b;font:14px/1.5 system-ui,sans-serif}'+
'.gr-ma-panel header,.gr-ma-tools,.gr-ma-row,.gr-ma-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.gr-ma-panel header,.gr-ma-row{justify-content:space-between}.gr-ma-panel h2{color:#f4dfb6;font:25px Georgia,serif;margin:0}.gr-ma-panel small{color:#b4cadb}'+
'.gr-ma-panel>header,.gr-ma-panel>.gr-ma-tools,.gr-ma-panel>.gr-ma-status,.gr-ma-panel>.gr-ma-feedback{flex:0 0 auto}.gr-ma-panel>header{position:relative;z-index:2;padding-bottom:10px;border-bottom:1px solid #947748}.gr-ma-panel>.gr-ma-tools{margin:8px 0}.gr-ma-panel>.gr-ma-status{max-height:4.5em;overflow:auto}.gr-ma-panel>.gr-ma-list{flex:1 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain;contain:paint;scrollbar-gutter:stable;padding-right:3px}.gr-ma-panel>.gr-ma-feedback{max-height:4em;overflow:auto;border-top:1px solid #947748;padding-top:8px}.gr-ma-panel .gr-ma-close{width:44px;height:44px;min-height:44px;flex-shrink:0;display:grid;place-items:center;border:0!important;background:transparent!important;box-shadow:none;padding:4px!important;touch-action:manipulation}.gr-ma-panel .gr-ma-close img{display:block;width:36px;height:36px;object-fit:contain;filter:grayscale(1) brightness(1.4) contrast(.85);pointer-events:none}.gr-ma-panel .gr-ma-close:hover img{filter:grayscale(1) brightness(1.7) contrast(.9)}'+
'.gr-ma-panel button,.gr-ma-panel input{font:inherit;border:1px solid #91a8ba;border-radius:9px;background:#11283a;color:#eff4fa;padding:8px 11px;min-height:44px;box-sizing:border-box}.gr-ma-panel button{cursor:pointer}.gr-ma-panel button:disabled{opacity:.55}.gr-ma-panel button:focus-visible,.gr-ma-panel input:focus-visible{outline:2px solid #ffe6af;outline-offset:2px}'+
'.gr-ma-tools{margin:12px 0}.gr-ma-tools input{flex:1;min-width:120px}.gr-ma-row{padding:10px;border:1px solid #647c936a;border-radius:12px;background:#101d2ad9;margin:6px 0}.gr-ma-row strong{display:block;overflow-wrap:anywhere}.gr-ma-row small{display:block}.gr-ma-group{margin:14px 0 6px;color:#edcf98}.gr-ma-status{margin:10px 0;padding:10px;border:1px solid #7895a260;border-radius:11px;background:#0b1c2b9c}.gr-ma-feedback{color:#cbd9e6;font-size:12px}.gr-ma-error{color:#ffb5a8}.gr-ma-panel p{overflow-wrap:anywhere}'+
'@media(max-width:540px){.gr-ma-panel{padding:12px}.gr-ma-row{align-items:stretch;flex-direction:column}.gr-ma-actions{justify-content:start}}';
const node=(tag,value,cls)=>{const x=document.createElement(tag);x.textContent=String(value??'');if(cls)x.className=cls;return x;};
const button=(text,handler)=>{const x=node('button',text);x.type='button';x.addEventListener('click',handler);return x;};
export function openLocationManager(owner,{enabled=false,mode='legacy',places=[],removed=[],refresh,rename,archive,restore,focus,migrate}={}){
  if(!owner?.shadow||typeof refresh!=='function')return null;
  const previous=owner.shadow.getElementById('gr-ma-location-manager');
  if(previous){previous.remove();}
  const t=/Deutsch|Boarisch|Platt|Sächs|Schwäb/i.test(owner._languageValue?.()||'Deutsch')?COPY.de:COPY.en;
  const root=document.createElement('div');root.id='gr-ma-location-manager';root.className='gr-ma-manager';
  const style=document.createElement('style');style.textContent=STYLES;
  const panel=document.createElement('section');panel.className='gr-ma-panel';
  panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label',t.title);
  const close=()=>root.remove(),header=document.createElement('header'),heading=document.createElement('div');
  heading.append(node('h2',t.title),node('small',t.subtitle));
  const x=button('',close);x.className='gr-ma-close';x.setAttribute('aria-label',t.close);const xImg=document.createElement('img');xImg.src=MA_PREMIUM_CLOSE;xImg.alt='';xImg.draggable=false;x.append(xImg);header.append(heading,x);
  const status=node('div','', 'gr-ma-status'),tools=node('div','', 'gr-ma-tools');
  const filter=document.createElement('input');filter.type='search';filter.placeholder=t.filter;filter.setAttribute('aria-label',t.filter);
  const reloadButton=button(t.refresh,()=>{void reload();});tools.append(filter,reloadButton);
  const migrationButton=button(t.migration,async()=>{
    if(state.busy||!state.enabled||state.mode!=='migration_pending'||typeof migrate!=='function')return;
    state.busy=true;migrationButton.disabled=true;
    try {
      await migrate();
      if(root.isConnected)close(); // migration wizard owns its own explicit approvals
    } catch {notice(t.error,true);state.busy=false;migrationButton.disabled=false;}
  });
  migrationButton.hidden=true;
  const list=document.createElement('div');list.className='gr-ma-list';list.setAttribute('role','region');list.setAttribute('aria-label',t.active);list.tabIndex=0;
  const feedback=node('p','', 'gr-ma-feedback');
  feedback.setAttribute('role','status');panel.append(header,status,tools,list,feedback);root.append(style,panel);
  const fullscreen=owner.shadow.getElementById('map-fullscreen-dialog');
  const host=fullscreen?.open ? fullscreen : owner.shadow;
  host.append(root);
  root.addEventListener('click',e=>{if(e.target===root)close();});
  root.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close();}});
  const state={enabled,mode,places,removed,busy:false};
  const notice=(message,error=false)=>{feedback.textContent=message;feedback.classList.toggle('gr-ma-error',error);};
  const render=()=>{
    if(!root.isConnected)return;
    const plan=planLocations(state),term=filter.value.trim().toLocaleLowerCase();
    status.textContent=plan.mode==='db_active'?t.db:plan.mode==='migration_pending'?t.pending:
      enabled?t.legacy:t.off;
    migrationButton.hidden=!(plan.mode==='migration_pending'&&typeof migrate==='function');
    if(!migrationButton.hidden&&!migrationButton.parentNode)tools.append(migrationButton);
    list.replaceChildren();
    const addGroup=(title,records)=>{
      const filtered=records.filter(p=>String(p.name||p.summary||'').toLocaleLowerCase().includes(term));
      if(!filtered.length)return;
      list.append(node('h3',title,'gr-ma-group'));
      for(const place of filtered){
        const row=node('div','', 'gr-ma-row'),copy=document.createElement('div');
        copy.append(node('strong',place.name||place.summary));
        copy.append(node('small',place.latitude.toFixed(5)+'°, '+place.longitude.toFixed(5)+'°'));
        const actions=node('div','', 'gr-ma-actions');
        const add=(name,fn)=>{const b=button(name,fn);b.disabled=state.busy;actions.append(b);};
        add(t.details,()=>showDetails(place));
        if(typeof focus==='function')add(t.focus,()=>{focus({latitude:place.latitude,longitude:place.longitude});close();});
        if(plan.canRename&&!place.archived&&typeof rename==='function')
          add(t.rename,()=>void mutate('rename',place));
        if(place.archived&&typeof restore==='function')add(t.restore,()=>void mutate('restore',place));
        else if(!place.archived&&typeof archive==='function')add(t.archive,()=>void mutate('archive',place));
        row.append(copy,actions);list.append(row);
      }
    };
    addGroup(t.active,plan.active);addGroup(t.archived,plan.archived);
    if(!list.children.length)list.append(node('p',t.empty));
    if(!feedback.textContent)notice(!state.enabled?t.setupHint:plan.canRename?t.dbHint:t.legacyHint);
  };
  const showDetails=place=>{
    list.replaceChildren();tools.hidden=true;
    list.append(node('h3',place.name||place.summary));
    list.append(node('p',t.coordinates+': '+place.latitude.toFixed(6)+', '+place.longitude.toFixed(6)));
    if(Number.isInteger(place.revision))list.append(node('p',t.revision+': '+place.revision));
    list.append(node('p',t.detailHint));
    list.append(button(t.back,()=>{tools.hidden=false;render();}));
    if(typeof focus==='function')
      list.append(button(t.focus,()=>{focus({latitude:place.latitude,longitude:place.longitude});close();}));
  };
  const consume=next=>{if(!root.isConnected)return;state.places=next.places;state.removed=next.removed;state.mode=next.mode;notice('');render();};
  const mutate=async(kind,place)=>{
    if(state.busy)return;
    if(kind==='rename'&&state.mode!=='db_active')return;
    let name=null;
    if(kind==='rename'){
      name=window.prompt(t.renamePrompt,place.name||place.summary||'');
      if(name===null)return;
      name=name.trim();if(!name||name.length>120)return notice(t.error,true);
      if(name===place.name)return;
    }else if(kind==='archive'&&!window.confirm(t.archiveConfirm))return;
    state.busy=true;filter.disabled=true;reloadButton.disabled=true;notice(t.busy);render();
    try{
      if(kind==='rename')await rename(place,name);
      else if(kind==='archive')await archive(place);
      else await restore(place);
      consume(await refresh());
    }catch(error){notice(t.error,true);}
    finally{state.busy=false;filter.disabled=false;reloadButton.disabled=false;render();}
  };
  const reload=async()=>{
    if(state.busy)return;
    state.busy=true;reloadButton.disabled=true;notice(t.busy);
    try{consume(await refresh());}
    catch(error){notice(t.error,true);}
    finally{state.busy=false;reloadButton.disabled=false;}
  };
  filter.addEventListener('input',render);render();filter.focus({preventScroll:true});return root;
}
