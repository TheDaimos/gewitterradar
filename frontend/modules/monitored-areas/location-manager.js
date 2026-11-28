// MA-023: additive profile-aware place manager. No automatic migration or tracker mutation.
const maPremiumClose = () => new URL("../../assets/gewitterradar-about-close-premium.webp", import.meta.url).href;
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
export function sortedLocations(records=[],sort='name'){
  const items=[...records], byName=(a,b)=>String(a.name||a.summary||'').localeCompare(String(b.name||b.summary||''),undefined,{sensitivity:'base',numeric:true})||
    String(a.uid||'').localeCompare(String(b.uid||''));
  if(sort==='recent')items.sort((a,b)=>(Number(b.updated_at)||0)-(Number(a.updated_at)||0)||byName(a,b));
  else if(sort==='name_desc')items.sort((a,b)=>-byName(a,b));
  else items.sort(byName);
  return items;
}
export function batchLocationPlan({mode='legacy',active=[],archived=[],selected=[],operation='archive'}={}){
  if(mode!=='db_active'||!['archive','restore'].includes(operation))return [];
  const selectedIds=new Set(selected.filter(id=>typeof id==='string'));
  const source=operation==='archive'?active:archived;
  // No implicit mass action on filtered or hidden rows: selection only.
  return source.filter(item=>selectedIds.has(item.uid)&&typeof item.uid==='string'&&
    Number.isInteger(item.revision)&&item.revision>=1).map(item=>({...item}));
}
// MA-021: pure responsive positioning and read-only location descriptor.
// No persistence: panel position is scoped to the current manager instance.
// MA-021: responsive device profiles are a pure layout decision.
export function detailLayoutProfile({width=360,height=640}={}){
  width=Number.isFinite(width)?Math.max(1,width):360;
  height=Number.isFinite(height)?Math.max(1,height):640;
  if(width<680)return Object.freeze({mode:'mobile',width:Math.max(1,width-20),columns:1});
  if(width<1180)return Object.freeze({mode:'tablet',width:Math.min(810,width-32),columns:2});
  return Object.freeze({mode:'desktop',width:Math.min(920,width-48),columns:2});
}
const detailPlacementCache=new WeakMap();
export function clampDetailPosition(position,{width,height,panelWidth,panelHeight,margin=10}={}){
  const finite=(v,fallback)=>Number.isFinite(v)?v:fallback;
  width=Math.max(1,finite(width,360));height=Math.max(1,finite(height,640));
  panelWidth=Math.max(1,finite(panelWidth,Math.min(width,420)));
  panelHeight=Math.max(1,finite(panelHeight,Math.min(height,400)));
  margin=Math.max(0,finite(margin,10));
  const minX=Math.min(margin,Math.max(0,width-panelWidth));
  const minY=Math.min(margin,Math.max(0,height-panelHeight));
  const maxX=Math.max(minX,width-panelWidth-margin);
  const maxY=Math.max(minY,height-panelHeight-margin);
  return {x:Math.min(maxX,Math.max(minX,finite(position?.x,minX))),
          y:Math.min(maxY,Math.max(minY,finite(position?.y,minY)))};
}
export function detailLocation(place){
  const latitude=Number(place?.latitude),longitude=Number(place?.longitude);
  if(!Number.isFinite(latitude)||!Number.isFinite(longitude)||
     Math.abs(latitude)>90||Math.abs(longitude)>180)throw new TypeError('MA_INVALID_COORDINATES');
  return Object.freeze({name:String(place?.name||place?.summary||''),
    latitude,longitude,archived:place?.archived===true,
    revision:Number.isInteger(place?.revision)?place.revision:null,
    origin:String(place?.location_origin||place?.provider||'unknown')});
}
const COPY={
 de:{title:'Standortverwaltung',subtitle:'Monitored Areas · V4.14',db:'SQLite-Verwaltung aktiv',
  pending:'Migration ausstehend · Local To-do bleibt maßgeblich',
  legacy:'Local To-do · bisherige Standortverwaltung',off:'Monitored Areas deaktiviert · alte Orte bleiben unverändert',
  filter:'Standorte filtern',sort:'Sortieren',sortName:'Name A–Z',sortReverse:'Name Z–A',sortRecent:'Zuletzt geändert',select:'Auswählen',selected:'ausgewählt',selectAll:'Sichtbare auswählen',clearSelection:'Auswahl aufheben',archiveSelected:'Ausgewählte archivieren',restoreSelected:'Ausgewählte wiederherstellen',batchConfirm:'ausgewählte Standorte bearbeiten? Nur bestätigte Änderungen werden gespeichert.',batchDone:'Standorte erfolgreich bearbeitet',batchPartial:'Sammelaktion gestoppt; übrige Standorte unverändert',refresh:'Aktualisieren',close:'Schließen',active:'Gespeicherte Orte',
  archived:'Archivierte Orte',empty:'Keine passenden Standorte',details:'Details',back:'Zurück',
  focus:'Auf Karte zeigen',rename:'Umbenennen',archive:'Archivieren',restore:'Wiederherstellen',
  profiles:'Profile & Freigaben',overview:'Sichtfenster',createNew:'Neuer Standort',overviewHint:'Standorte geografisch ansehen',
  coordinates:'Koordinaten',revision:'Revision',detailHint:'Überwachungs- und Freigabeoptionen folgen in den nächsten MA-Modulen.',
  detailTitle:'Standortdetails',detailOrigin:'Herkunft',detailState:'Zustand',detailActive:'Aktiv',detailArchived:'Archiviert',detailCollapse:'Details ein-/ausklappen',detailMove:'Fenster verschieben',detailCopy:'Koordinaten kopieren',detailCopied:'Koordinaten kopiert',detailNoCopy:'Kopieren nicht verfügbar',detailGeo:'GeoPoint',detailGeoError:'GeoPoint Inspector nicht verfügbar – Wetterquelle und Karte prüfen.',detailMonitoring:'Überwachung',detailPaused:'Pausiert',detailRecording:'Aufzeichnung',detailRadius:'Aufzeichnungsradius',detailAlarmRadius:'Alarmradius',detailMode:'Erfassungsmodus',detailOn:'Ein',detailOff:'Aus',detailNoData:'Erweiterte Daten nicht verfügbar',
  renamePrompt:'Neuen Namen eingeben',archiveConfirm:'Standort archivieren? Er bleibt wiederherstellbar.',
  error:'Aktion nicht abgeschlossen',busy:'Bitte warten …',migration:'SQLite-Übernahme prüfen',
  setupHint:'Aktiviere Monitored Areas unter Einstellungen → Geräte & Dienste → GewitterRadar → Konfigurieren. Deine Local-To-do-Liste bleibt bis zur gesonderten Bestätigung unverändert.',
  legacyHint:'Die alte Local-To-do-Liste bleibt maßgeblich. Eine Migration wird nicht automatisch gestartet.',
  dbHint:'Änderungen werden nur nach Bestätigung durch Home Assistant übernommen.'},
 en:{title:'Manage locations',subtitle:'Monitored Areas · V4.14',db:'SQLite management active',
  pending:'Migration pending · Local To-do remains authoritative',
  legacy:'Local To-do · existing place management',off:'Monitored Areas disabled · existing places untouched',
  filter:'Filter locations',sort:'Sort',sortName:'Name A–Z',sortReverse:'Name Z–A',sortRecent:'Recently modified',select:'Select',selected:'selected',selectAll:'Select visible',clearSelection:'Clear selection',archiveSelected:'Archive selected',restoreSelected:'Restore selected',batchConfirm:'selected locations? Only acknowledged changes are saved.',batchDone:'locations updated successfully',batchPartial:'Batch stopped; remaining locations unchanged',refresh:'Refresh',close:'Close',active:'Saved places',
  archived:'Archived places',empty:'No matching locations',details:'Details',back:'Back',
  focus:'Show on map',rename:'Rename',archive:'Archive',restore:'Restore',
  profiles:'Profiles & sharing',overview:'Overview',createNew:'New location',overviewHint:'View locations geographically',
  coordinates:'Coordinates',revision:'Revision',detailHint:'Monitoring and sharing controls follow in the next MA modules.',
  detailTitle:'Location details',detailOrigin:'Origin',detailState:'Status',detailActive:'Active',detailArchived:'Archived',detailCollapse:'Expand/collapse details',detailMove:'Move window',detailCopy:'Copy coordinates',detailCopied:'Coordinates copied',detailNoCopy:'Copy unavailable',detailGeo:'GeoPoint',detailGeoError:'GeoPoint Inspector unavailable – check the weather source and map.',detailMonitoring:'Monitoring',detailPaused:'Paused',detailRecording:'Recording',detailRadius:'Recording radius',detailAlarmRadius:'Alert radius',detailMode:'Capture mode',detailOn:'On',detailOff:'Off',detailNoData:'Extended data unavailable',
  renamePrompt:'Enter new name',archiveConfirm:'Archive location? It can be restored.',
  error:'Action not completed',busy:'Please wait …',migration:'Review SQLite migration',
  setupHint:'Enable Monitored Areas in Settings → Devices & services → GewitterRadar → Configure. Local To-do remains unchanged until separately confirmed.',
  legacyHint:'Local To-do remains authoritative. No migration starts automatically.',
  dbHint:'Changes are only applied following Home Assistant confirmation.'}
};
const STYLES='.gr-ma-manager{position:fixed;inset:0;display:grid;place-items:center;z-index:2147483598;background:#02070bdc;padding:12px;box-sizing:border-box;backdrop-filter:blur(7px)}'+
'.gr-ma-panel{box-sizing:border-box;width:min(760px,100%);height:min(820px,calc(100dvh - 24px));max-height:calc(100dvh - 24px);overflow:hidden;display:flex;flex-direction:column;padding:17px;border-radius:22px;border:1px solid rgba(201,160,80,.34);color:#e7eef6;background:radial-gradient(circle at 15% 0%,rgba(230,184,85,.09),transparent 34%),linear-gradient(180deg,rgba(20,28,38,.99),rgba(7,12,18,.995));box-shadow:0 30px 90px rgba(0,0,0,.72),inset 0 0 0 1px rgba(255,235,184,.055),inset 0 1px rgba(255,244,213,.08),0 0 30px rgba(207,159,60,.065);font:14px/1.5 system-ui,sans-serif}'+
'.gr-ma-panel header,.gr-ma-tools,.gr-ma-row,.gr-ma-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.gr-ma-panel header,.gr-ma-row{justify-content:space-between}.gr-ma-panel h2{color:#f4dfb6;font:25px Georgia,serif;margin:0}.gr-ma-panel small{color:#b4cadb}'+
'.gr-ma-panel>header,.gr-ma-panel>.gr-ma-tools,.gr-ma-panel>.gr-ma-status,.gr-ma-panel>.gr-ma-feedback{flex:0 0 auto}.gr-ma-panel>header{position:relative;z-index:2;padding-bottom:10px;border-bottom:1px solid #947748}.gr-ma-panel>.gr-ma-tools{margin:8px 0}.gr-ma-panel>.gr-ma-status{max-height:4.5em;overflow:auto}.gr-ma-panel>.gr-ma-list{flex:1 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain;contain:paint;scrollbar-gutter:stable;padding-right:3px}.gr-ma-panel>.gr-ma-feedback{max-height:4em;overflow:auto;border-top:1px solid #947748;padding-top:8px}.gr-ma-panel .gr-ma-close{width:44px;height:44px;min-width:44px;min-height:44px;flex-shrink:0;display:grid;place-items:center;border:0!important;border-radius:8px!important;background:transparent!important;box-shadow:none!important;padding:0!important;touch-action:manipulation}.gr-ma-panel .gr-ma-close img{display:block;width:34px;height:34px;object-fit:contain;pointer-events:none;transition:transform .16s ease,filter .16s ease}@media(hover:hover) and (pointer:fine){.gr-ma-panel .gr-ma-close:hover img{filter:brightness(1.12) drop-shadow(0 0 2px #dba34c70)}}.gr-ma-panel .gr-ma-close:active img{transform:scale(.97);filter:brightness(.92)}'+
'.gr-ma-panel button,.gr-ma-panel input{font:inherit;border:1px solid #91a8ba;border-radius:9px;background:#11283a;color:#eff4fa;padding:8px 11px;min-height:44px;box-sizing:border-box}.gr-ma-panel button{cursor:pointer}.gr-ma-panel button:disabled{opacity:.55}.gr-ma-panel button:focus-visible,.gr-ma-panel input:focus-visible{outline:2px solid #ffe6af;outline-offset:2px}'+
'.gr-ma-accordion{margin:10px 0;border:1px solid rgba(201,160,80,.26);border-radius:11px;overflow:hidden;background:#0d1a26}.gr-ma-accordion>summary{cursor:pointer;list-style:none;padding:11px 12px;color:#edcf98;font-weight:700;display:flex;align-items:center;justify-content:space-between}.gr-ma-accordion>summary::-webkit-details-marker{display:none}.gr-ma-accordion>summary::after{content:"";width:9px;height:9px;border-right:2px solid #d6b66e;border-bottom:2px solid #d6b66e;transform:rotate(45deg);transition:transform .16s}.gr-ma-accordion[open]>summary::after{transform:rotate(225deg)}.gr-ma-accordion .gr-ma-group-content{padding:0 7px 7px}.gr-ma-accordion>summary:focus-visible{outline:2px solid #ffe6af;outline-offset:-2px}'+
'.gr-ma-tools{margin:12px 0}.gr-ma-tools input{flex:1;min-width:120px}.gr-ma-row{padding:10px;border:1px solid #647c936a;border-radius:12px;background:#101d2ad9;margin:6px 0}.gr-ma-row strong{display:block;overflow-wrap:anywhere}.gr-ma-row small{display:block}.gr-ma-group{margin:14px 0 6px;color:#edcf98}.gr-ma-status{margin:10px 0;padding:10px;border:1px solid #7895a260;border-radius:11px;background:#0b1c2b9c}.gr-ma-feedback{color:#cbd9e6;font-size:12px}.gr-ma-error{color:#ffb5a8}.gr-ma-panel p{overflow-wrap:anywhere}'+
'@media(max-width:540px){.gr-ma-panel{padding:12px}.gr-ma-row{align-items:stretch;flex-direction:column}.gr-ma-actions{justify-content:start}}'+
"\n/* MA V4.14.16: embossed GR metal frame, settings-grade chevrons, symmetric content. */\n.gr-ma-panel{border:2px solid transparent;\n background:radial-gradient(circle at 15% 0%,rgba(230,184,85,.09),transparent 34%) padding-box,\n linear-gradient(180deg,rgba(20,28,38,.99),rgba(7,12,18,.995)) padding-box,\n linear-gradient(145deg,#e3c17d,#80602d 16%,#f9e3ad 29%,#735024 45%,#ba9144 57%,#ffe5a0 74%,#614723 86%,#cba35c) border-box;\n box-shadow:0 30px 90px rgba(0,0,0,.72),inset 0 0 0 1px rgba(255,236,181,.08),inset 0 1px rgba(255,244,213,.10),0 0 12px rgba(215,164,67,.12)}\n.gr-ma-panel>.gr-ma-list{scrollbar-gutter:auto;padding-inline:0;scrollbar-width:thin;scrollbar-color:#826b46 transparent}\n.gr-ma-panel>.gr-ma-list::-webkit-scrollbar{width:6px}\n.gr-ma-panel>.gr-ma-list::-webkit-scrollbar-thumb{background:#826b46;border-radius:20px}\n.gr-ma-panel .gr-ma-accordion{border:1px solid #997749;border-radius:11px;\n background:linear-gradient(180deg,#152838,#0b1722);\n box-shadow:inset 0 1px #ffdf9924,0 3px 8px #0005}\n.gr-ma-panel .gr-ma-accordion>summary{color:#f5dc9c;\n background:linear-gradient(180deg,#2b3540 0%,#152634 15%,#0d1d2b 82%,#4a3c2a 100%);\n border-bottom:1px solid transparent;text-shadow:0 1px 2px #000a}\n.gr-ma-panel .gr-ma-accordion[open]>summary{border-bottom-color:#b08a4d66}\n.gr-ma-panel .gr-ma-accordion>summary::after{width:13px;height:13px;margin:-6px 10px 0 0;\n border-right:2px solid #d6b66e;border-bottom:2px solid #d6b66e;\n filter:drop-shadow(0 1px .5px #4c301c) drop-shadow(0 0 3px #d8a74a66);\n transition:transform .42s cubic-bezier(.22,1,.36,1),filter .28s ease}\n.gr-ma-panel .gr-ma-accordion[open]>summary::after{margin-top:7px;\n filter:brightness(1.14) drop-shadow(0 1px .5px #4c301c) drop-shadow(0 0 4px #d8a74a88)}\n.gr-ma-panel .gr-ma-row{border:1px solid #86724f99;background:linear-gradient(130deg,#142837,#091923);\n box-shadow:inset 0 1px #e6ca8b21,0 2px 6px #0004}\n.gr-ma-panel .gr-ma-actions button,.gr-ma-panel .gr-ma-tools button{\n border:1px solid #aa854d;background:linear-gradient(180deg,#d2b078 0%,#5a472d 7%,#213441 18%,#132431 80%,#574326 94%,#d1a96a 100%);\n color:#f7e6bf;box-shadow:inset 0 1px #fbe4b17a,0 2px 7px #0007;text-shadow:0 1px 1px #000}\n.gr-ma-panel button:hover:not(:disabled){filter:brightness(1.10)}\n.gr-ma-panel .gr-ma-status{border-color:#9c7d4d80;background:linear-gradient(180deg,#122633,#0a1a25)}\n";
const DETAIL_STYLES="\n/* MA-021 Havanna detail: separate draggable, viewport-clamped read-only window. */\n.gr-ma-detail{position:fixed;z-index:2147483605;width:min(430px,calc(100vw - 20px));\n max-height:calc(100dvh - 20px);overflow:hidden;display:flex;flex-direction:column;\n box-sizing:border-box;border:2px solid transparent;border-radius:20px;\n background:linear-gradient(180deg,#111e2b,#07121b) padding-box,\n linear-gradient(145deg,#e3c17d,#80602d 16%,#f9e3ad 29%,#735024 45%,#ba9144 57%,#ffe5a0 74%,#614723 86%,#cba35c) border-box;\n box-shadow:0 28px 75px #000d,inset 0 1px #fff3,0 0 16px #b0843f33;\n color:#f2e8d2;font:14px/1.5 system-ui,sans-serif}\n.gr-ma-detail-head{display:flex;align-items:center;justify-content:space-between;gap:8px;\n padding:13px 13px 10px 15px;cursor:grab;touch-action:none;user-select:none;\n background:linear-gradient(180deg,#222c37,#111c29);border-bottom:1px solid #b18b5488}\n.gr-ma-detail-head:active{cursor:grabbing}\n.gr-ma-detail-head strong{font:21px Georgia,serif;color:#f5dcad;overflow-wrap:anywhere}\n.gr-ma-detail-head .gr-ma-detail-x{width:44px;height:44px;min-width:44px;min-height:44px;\n padding:0!important;display:grid;place-items:center;cursor:pointer;background:transparent!important;\n border:0!important;box-shadow:none!important}\n.gr-ma-detail-x img{width:34px;height:34px;object-fit:contain;pointer-events:none}\n.gr-ma-detail-details{overflow-y:auto;min-height:0;overscroll-behavior:contain;\n padding:12px 15px 16px;scrollbar-width:thin;scrollbar-color:#826b46 transparent}\n.gr-ma-detail-details summary{cursor:pointer;list-style:none;padding:10px 5px;\n display:flex;align-items:center;justify-content:space-between;color:#efcf90;font-weight:700}\n.gr-ma-detail-details summary::-webkit-details-marker{display:none}\n.gr-ma-detail-details summary::after{content:\"\";width:13px;height:13px;flex-shrink:0;\n margin:-6px 9px 0 0;border-right:2px solid #d6b66e;border-bottom:2px solid #d6b66e;\n transform:rotate(45deg);filter:drop-shadow(0 1px .5px #4c301c) drop-shadow(0 0 3px #d8a74a66);\n transition:transform .35s ease}\n.gr-ma-detail-details details[open]>summary::after{transform:rotate(225deg);margin-top:7px}\n.gr-ma-detail-grid{display:grid;grid-template-columns:110px minmax(0,1fr);gap:10px;\n padding:8px 2px;border-top:1px solid #b18b5444;overflow-wrap:anywhere}\n.gr-ma-detail-grid small{color:#abc2d1}.gr-ma-detail-grid span{font-variant-numeric:tabular-nums}\n.gr-ma-detail-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}\n.gr-ma-detail-actions button{min-height:42px;border:1px solid #b38b51;border-radius:10px;\n background:linear-gradient(180deg,#6e532f,#162e3e 22%,#0f2330 83%,#83663b);\n box-shadow:inset 0 1px #ffe2a34d,0 2px 6px #0008;color:#f7e6bf;padding:8px 12px}\n.gr-ma-detail-message{color:#e8c788;min-height:1em;font-size:12px}\n@media(max-width:540px){.gr-ma-detail{width:calc(100vw - 20px)}\n .gr-ma-detail-grid{grid-template-columns:95px minmax(0,1fr)}}\n";
const GEOPOINT_BUTTON_STYLES=".gr-ma-batch-toolbar{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid #94774855}.gr-ma-batch-toolbar[hidden]{display:none!important}.gr-ma-batch-toolbar button{min-height:38px;border:1px solid #947748;border-radius:8px;background:#1a303d;color:#f5dcad;padding:7px}.gr-ma-batch-toolbar button:disabled{opacity:.45}.gr-ma-tools select{min-height:44px;background:#122938;color:#f5dcad;border:1px solid #947748;border-radius:9px;padding:8px}.gr-ma-row>input[type=checkbox]{width:20px;height:20px;accent-color:#c3a15e;flex:0 0 20px}.gr-ma-detail-shortcuts{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px}\n.gr-ma-detail-shortcuts button{min-height:44px;border:1px solid #e3b765;border-radius:11px;\n background:linear-gradient(180deg,#f6dfa4 0%,#a17a3e 6%,#283e4a 19%,#122938 77%,#815d30 95%,#f0c983 100%);\n color:#f6dfa7;font-weight:720;text-shadow:0 1px 2px #000;box-shadow:inset 0 1px #fff5,0 4px 11px #0008;\n cursor:pointer;padding:9px 16px}\n.gr-ma-detail-shortcuts button:disabled{opacity:.55;cursor:progress}\n.gr-ma-detail-shortcuts button:focus-visible{outline:2px solid #ffe4a0;outline-offset:3px}\n";
const MOBILE_USABILITY_STYLES="\n/* MA 4.14.25: mobile location controls, locally scoped. */\n.gr-ma-panel .gr-ma-row > input[type=\"checkbox\"]{appearance:auto!important;display:block!important;position:static!important;width:18px!important;height:18px!important;min-width:18px!important;min-height:18px!important;max-width:18px!important;max-height:18px!important;flex:0 0 18px!important;padding:0!important;margin:3px 0 0!important;transform:none!important;align-self:flex-start;border-radius:4px;box-shadow:none!important;accent-color:#c3a15e}\n@media(max-width:540px){\n.gr-ma-panel .gr-ma-row.gr-ma-row-selectable{display:grid;grid-template-columns:20px minmax(0,1fr);align-items:start;gap:8px 9px}\n.gr-ma-panel .gr-ma-row.gr-ma-row-selectable > div:first-of-type{grid-column:2;min-width:0}\n.gr-ma-panel .gr-ma-row .gr-ma-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;width:100%}\n.gr-ma-panel .gr-ma-row.gr-ma-row-selectable > .gr-ma-actions{grid-column:1 / -1}\n.gr-ma-panel .gr-ma-row .gr-ma-actions button{width:100%;min-width:0;min-height:44px;padding:7px 6px;font-size:13px;line-height:1.25;white-space:normal;overflow-wrap:normal}\n.gr-ma-panel .gr-ma-batch-toolbar{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}\n.gr-ma-panel .gr-ma-batch-toolbar > span{grid-column:1 / -1}\n.gr-ma-panel .gr-ma-batch-toolbar > button{width:100%;min-width:0;min-height:44px;padding:7px 5px;font-size:12px;line-height:1.3;white-space:normal}\n.gr-ma-panel .gr-ma-tools{gap:7px}\n.gr-ma-panel .gr-ma-tools button{min-height:44px;padding:7px 9px;font-size:13px}\n.gr-ma-detail-grid.gr-ma-detail-grid-long{grid-template-columns:minmax(0,1fr);gap:3px}\n.gr-ma-detail-grid.gr-ma-detail-grid-long small{white-space:normal;overflow-wrap:normal}\n}\n";
const RESPONSIVE_DETAIL_STYLES="\n/* MA-021 responsive Havanna extension: broad desktop and iPad landscape layouts. */\n.gr-ma-detail{width:min(920px,calc(100vw - 48px));min-width:0}\n.gr-ma-detail-head{padding:16px 16px 13px 22px;gap:14px}\n.gr-ma-detail-head strong{font-size:clamp(21px,2.4vw,27px);line-height:1.15}\n.gr-ma-detail-head-copy{min-width:0;display:flex;flex-direction:column;gap:4px}\n.gr-ma-detail-head-copy small{color:#d6b57d;font-size:12px;letter-spacing:.035em}\n.gr-ma-detail-state{align-self:flex-start;border:1px solid #a68a5780;border-radius:20px;padding:3px 10px;\n background:linear-gradient(180deg,#394a52,#14232c);color:#e9cf9b;font-size:12px;font-weight:650}\n.gr-ma-detail-details{padding:14px 22px 18px}\n.gr-ma-detail-intro{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;\n margin-bottom:12px}\n.gr-ma-detail-plate{border:1px solid #9777498c;border-radius:13px;\n background:linear-gradient(160deg,#2c3f4b,#122330 72%,#14232d);\n box-shadow:inset 0 1px #fff3,0 6px 12px #0005;padding:12px 14px;min-width:0}\n.gr-ma-detail-plate small{display:block;color:#abc2d1;letter-spacing:.035em;font-size:11px}\n.gr-ma-detail-plate strong{display:block;color:#f5dcad;margin-top:3px;\n font-size:clamp(14px,1.7vw,18px);overflow-wrap:anywhere;font-variant-numeric:tabular-nums}\n.gr-ma-detail-details details{border:1px solid #896d4388;border-radius:12px;\n background:linear-gradient(180deg,#122533,#091924);overflow:hidden}\n.gr-ma-detail-details summary{padding:12px 16px;min-height:44px;box-sizing:border-box;\n background:linear-gradient(180deg,#293641,#12212d);border-bottom:1px solid transparent}\n.gr-ma-detail-details details[open]>summary{border-bottom-color:#96774a77}\n.gr-ma-detail-grid-wrap{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 18px;padding:8px 14px}\n.gr-ma-detail-grid{grid-template-columns:110px minmax(0,1fr);align-content:start}\n.gr-ma-detail-actions{padding:4px 14px 14px;margin-top:4px}\n.gr-ma-detail-message{margin:0;padding:0 14px 12px}\n.gr-ma-detail-hint{margin:0;padding:0 14px 14px;color:#b8c8d2;font-size:12px}\n.gr-ma-detail-head:focus-visible,.gr-ma-detail-details summary:focus-visible{outline:2px solid #f5ce83;outline-offset:-3px}\n@media(min-width:680px) and (max-width:1179px){\n .gr-ma-detail{width:min(810px,calc(100vw - 32px))}\n .gr-ma-detail-head{padding-inline:19px}\n .gr-ma-detail-details{padding-inline:18px}\n .gr-ma-detail-grid-wrap{gap:0 10px}\n}\n@media(max-width:679px){\n .gr-ma-detail{width:calc(100vw - 20px)}\n .gr-ma-detail-head{padding:10px 10px 10px 14px}\n .gr-ma-detail-head strong{font-size:21px}\n .gr-ma-detail-details{padding:10px 12px 13px}\n .gr-ma-detail-intro{grid-template-columns:minmax(0,1fr);gap:8px}\n .gr-ma-detail-plate{padding:9px 11px}\n .gr-ma-detail-grid-wrap{grid-template-columns:minmax(0,1fr);padding:4px 10px}\n .gr-ma-detail-grid{grid-template-columns:95px minmax(0,1fr)}\n .gr-ma-detail-actions{padding-inline:10px}\n}\n@media(max-height:500px){\n .gr-ma-detail-head{padding-block:7px}\n .gr-ma-detail-details{padding-block:7px}\n .gr-ma-detail-intro{gap:6px;margin-bottom:6px}\n .gr-ma-detail-plate{padding-block:7px}\n}\n";
const node=(tag,value,cls)=>{const x=document.createElement(tag);x.textContent=String(value??'');if(cls)x.className=cls;return x;};
const button=(text,handler)=>{const x=node('button',text);x.type='button';x.addEventListener('click',handler);return x;};
export function openLocationManager(owner,{enabled=false,mode='legacy',places=[],removed=[],refresh,readDetails,openGeoPoint,openProfiles,createPlace,verifyContext,rename,archive,restore,focus,migrate}={}){
  if(!owner?.shadow||typeof refresh!=='function')return null;
  const previous=owner.shadow.getElementById('gr-ma-location-manager');
  if(previous){previous.__dispose?.();previous.remove();}
  const t=/Deutsch|Boarisch|Platt|Sächs|Schwäb/i.test(owner._languageValue?.()||'Deutsch')?COPY.de:COPY.en;
  const root=document.createElement('div');root.id='gr-ma-location-manager';root.className='gr-ma-manager';
  const style=document.createElement('style');style.textContent=STYLES+MOBILE_USABILITY_STYLES;
  const panel=document.createElement('section');panel.className='gr-ma-panel';
  panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label',t.title);
  let detailWindow=null,disposeDetail=()=>{};
  const close=()=>{
    owner.shadow.getElementById('gr-ma-location-overview')?.remove();
    owner.shadow.getElementById('gr-ma-location-create')?.remove();
    disposeDetail();detailWindow?.remove();detailWindow=null;root.remove();
  };
  root.__dispose=close;
  const header=document.createElement('header'),heading=document.createElement('div');
  heading.append(node('h2',t.title),node('small',t.subtitle));
  const x=button('',close);x.className='gr-ma-close';x.setAttribute('aria-label',t.close);const xImg=document.createElement('img');xImg.src=owner.shadow.getElementById('settings-close')?.querySelector('img')?.src || maPremiumClose();xImg.alt='';xImg.draggable=false;x.append(xImg);header.append(heading,x);
  const status=node('div','', 'gr-ma-status'),tools=node('div','', 'gr-ma-tools');
  const filter=document.createElement('input');filter.type='search';filter.placeholder=t.filter;filter.setAttribute('aria-label',t.filter);
  const reloadButton=button(t.refresh,()=>{void reload();});
  const sorter=document.createElement('select');sorter.setAttribute('aria-label',t.sort);
  for(const [key,label] of [['name',t.sortName],['name_desc',t.sortReverse],['recent',t.sortRecent]]){
    const option=node('option',label);option.value=key;sorter.append(option);
  }
  tools.append(filter,sorter,reloadButton);
  const overviewButton=button(t.overview,()=>void openOverview());
  overviewButton.title=t.overviewHint;
  const createButton=button(t.createNew,()=>void openCreator());
  tools.append(overviewButton,createButton);
  const profileButton=button(t.profiles,async()=>{
    if(state.busy||!state.enabled||state.mode!=='db_active'||typeof openProfiles!=='function')return;
    profileButton.disabled=true;
    try{
      const current=planLocations(state);
      await openProfiles({places:[...current.active,...current.archived],mode:current.mode,
        refreshManager:reload});
    }catch{notice(t.error,true);}
    finally{if(root.isConnected)profileButton.disabled=false;}
  });
  profileButton.className='gr-ma-profile-action';
  profileButton.disabled=mode!=='db_active'||typeof openProfiles!=='function';
  tools.append(profileButton);
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
  const selected=new Set();
  const selectionToolbar=node('div','', 'gr-ma-batch-toolbar');
  const selectionStatus=node('span','');
  const selectVisibleButton=button(t.selectAll,()=>{for(const place of visibleRows())selected.add(place.uid);render();});
  const clearSelectionButton=button(t.clearSelection,()=>{selected.clear();render();});
  const archiveSelectedButton=button(t.archiveSelected,()=>void batch('archive'));
  const restoreSelectedButton=button(t.restoreSelected,()=>void batch('restore'));
  selectionToolbar.append(selectionStatus,selectVisibleButton,clearSelectionButton,archiveSelectedButton,restoreSelectedButton);
  panel.insertBefore(selectionToolbar,list);
  const visibleRows=()=>{
    const p=planLocations(state),q=filter.value.trim().toLocaleLowerCase();
    return [...(expanded.active?p.active:[]),...(expanded.archived?p.archived:[])].filter(item=>
      String(item.name||item.summary||'').toLocaleLowerCase().includes(q));
  };
  const expanded={active:true,archived:false};
  const notice=(message,error=false)=>{feedback.textContent=message;feedback.classList.toggle('gr-ma-error',error);};
  const render=()=>{
    if(!root.isConnected)return;
    const plan=planLocations(state),term=filter.value.trim().toLocaleLowerCase();
    const availableIds=new Set([...plan.active,...plan.archived].map(p=>p.uid));
    for(const id of selected)if(!availableIds.has(id))selected.delete(id);
    const selectionActive=plan.mode==='db_active';
    selectionToolbar.hidden=!selectionActive;
    selectionStatus.textContent=selected.size+' '+t.selected;
    selectVisibleButton.disabled=state.busy||!visibleRows().length;
    clearSelectionButton.disabled=state.busy||!selected.size;
    archiveSelectedButton.disabled=state.busy||!batchLocationPlan({...plan,selected:[...selected],operation:'archive'}).length||typeof archive!=='function';
    restoreSelectedButton.disabled=state.busy||!batchLocationPlan({...plan,selected:[...selected],operation:'restore'}).length||typeof restore!=='function';
    status.textContent=plan.mode==='db_active'?t.db:plan.mode==='migration_pending'?t.pending:
      enabled?t.legacy:t.off;
    migrationButton.hidden=!(plan.mode==='migration_pending'&&typeof migrate==='function');
    profileButton.disabled=state.busy||plan.mode!=='db_active'||typeof openProfiles!=='function';
    overviewButton.disabled=state.busy||![...plan.active,...plan.archived].length;
    createButton.disabled=state.busy||plan.mode!=='db_active'||typeof createPlace!=='function';
    profileButton.title=profileButton.disabled?t.pending||t.legacyHint:t.profiles;
    if(!migrationButton.hidden&&!migrationButton.parentNode)tools.append(migrationButton);
    list.replaceChildren();
    const addGroup=(title,records)=>{
      const filtered=sortedLocations(records.filter(p=>String(p.name||p.summary||'').toLocaleLowerCase().includes(term)),sorter.value);
      const key=records===plan.active?'active':'archived';
      const section=document.createElement('details');section.className='gr-ma-accordion';section.open=expanded[key];
      section.addEventListener('toggle',()=>{if(section.isConnected)expanded[key]=section.open;});
      const summary=node('summary',`${title} · ${filtered.length}`);section.append(summary);
      const content=node('div','', 'gr-ma-group-content');
      if(!filtered.length)content.append(node('p',t.empty));
      for(const place of filtered){
        const row=node('div','', 'gr-ma-row'),copy=document.createElement('div');
        if(selectionActive){
          row.classList.add('gr-ma-row-selectable');
          const check=document.createElement('input');check.type='checkbox';check.checked=selected.has(place.uid);
          check.setAttribute('aria-label',t.select+': '+String(place.name||place.summary||''));
          check.disabled=state.busy;
          check.addEventListener('change',()=>{if(check.checked)selected.add(place.uid);else selected.delete(place.uid);render();});
          row.append(check);
        }
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
        row.append(copy,actions);content.append(row);
      }
      section.append(content);list.append(section);
    };
    addGroup(t.active,plan.active);addGroup(t.archived,plan.archived);
    if(!list.children.length)list.append(node('p',t.empty));
    if(!feedback.textContent)notice(!state.enabled?t.setupHint:plan.canRename?t.dbHint:t.legacyHint);
  };
  const openOverview=async()=>{
    if(state.busy||!root.isConnected||typeof verifyContext!=='function'||!verifyContext())return;
    const profileAtOpen=String(owner._settingsVault?.profile?.id||'legacy');
    const before=planLocations(state);
    const module=await import('./location-overview.js?v=41424r1');
    if(!root.isConnected||state.busy||!verifyContext()||String(owner._settingsVault?.profile?.id||'legacy')!==profileAtOpen)return;
    module.openLocationOverview(owner,{
      places:[...before.active,...before.archived],
      verifyContext:()=>root.isConnected&&verifyContext()&&String(owner._settingsVault?.profile?.id||'legacy')===profileAtOpen,
      onDetails:place=>showDetails(place),
      onMap:place=>{
        if(typeof focus==='function'){focus({latitude:place.latitude,longitude:place.longitude});close();}
      },
      onGeoPoint:typeof openGeoPoint==='function'?async place=>{
        await openGeoPoint({latitude:place.latitude,longitude:place.longitude});
        close();
      }:undefined
    });
  };
  const openCreator=async()=>{
    if(state.busy||state.mode!=='db_active'||typeof createPlace!=='function'||!root.isConnected||typeof verifyContext!=='function'||!verifyContext())return;
    const profileAtOpen=String(owner._settingsVault?.profile?.id||'legacy');
    const module=await import('./location-create.js?v=41424r1');
    if(!root.isConnected||state.busy||!verifyContext()||String(owner._settingsVault?.profile?.id||'legacy')!==profileAtOpen)return;
    module.openLocationCreate(owner,{
      places:[...planLocations(state).active,...planLocations(state).archived],
      verifyContext:()=>root.isConnected&&!state.busy&&state.mode==='db_active'&&verifyContext()&&
        String(owner._settingsVault?.profile?.id||'legacy')===profileAtOpen,
      create:async candidate=>{
        if(state.busy)throw Error('MA_BUSY');
        state.busy=true;render();
        try{return await createPlace(candidate);}finally{state.busy=false;render();}
      },
      onCreated:reload
    });
  };
  const showDetails=place=>{
    if(detailWindow){disposeDetail();detailWindow.remove();detailWindow=null;}
    const data=detailLocation(place);
    const widget=document.createElement('section');widget.className='gr-ma-detail';
    widget.setAttribute('role','dialog');widget.setAttribute('aria-modal','false');
    widget.setAttribute('aria-label',t.detailTitle+': '+data.name);
    widget.tabIndex=-1;
    const stylesheet=document.createElement('style');stylesheet.textContent=DETAIL_STYLES+RESPONSIVE_DETAIL_STYLES+GEOPOINT_BUTTON_STYLES+MOBILE_USABILITY_STYLES;
    const heading=document.createElement('div');heading.className='gr-ma-detail-head';
    heading.setAttribute('aria-label',t.detailMove);
    const headCopy=node('div','', 'gr-ma-detail-head-copy');
    const caption=node('strong',data.name||t.detailTitle);
    headCopy.append(caption,node('small',t.subtitle));
    const stateBadge=node('span',data.archived?t.detailArchived:t.detailActive,'gr-ma-detail-state');
    headCopy.append(stateBadge);
    const exit=button('',()=>{disposeDetail();widget.remove();detailWindow=null;});
    exit.className='gr-ma-detail-x';exit.setAttribute('aria-label',t.close);
    const icon=document.createElement('img');
    icon.src=owner.shadow.getElementById('settings-close')?.querySelector('img')?.src||maPremiumClose();
    icon.alt='';icon.draggable=false;exit.append(icon);heading.append(headCopy,exit);
    heading.tabIndex=0;heading.setAttribute('role','toolbar');
    const content=document.createElement('div');content.className='gr-ma-detail-details';
    const intro=node('div','', 'gr-ma-detail-intro');
    const plate=(title,value)=>{const box=node('div','', 'gr-ma-detail-plate');
      box.append(node('small',title),node('strong',value));intro.append(box);};
    plate(t.coordinates,data.latitude.toFixed(5)+'°, '+data.longitude.toFixed(5)+'°');
    plate(t.detailState,data.archived?t.detailArchived:t.detailActive);
    content.append(intro);
    const shortcuts=node('div','', 'gr-ma-detail-shortcuts');
    if(typeof openGeoPoint==='function'){
      const geoButton=button(t.detailGeo,async()=>{
        if(geoButton.disabled)return;
        geoButton.disabled=true;
        try{
          await openGeoPoint({latitude:data.latitude,longitude:data.longitude});
          // Original weather popup is part of the map; only dismiss this
          // overlay after successful launch, without changing map or tracker.
          close();
        }catch{message.textContent=t.detailGeoError;}
        finally{if(geoButton.isConnected)geoButton.disabled=false;}
      });
      geoButton.dataset.maGeopoint='true';
      shortcuts.append(geoButton);
    }
    if(state.enabled&&state.mode==='db_active'&&typeof openProfiles==='function'){
      const profileAction=button(t.profiles,async()=>{
        if(profileAction.disabled)return;
        profileAction.disabled=true;
        try{
          await openProfiles({places:[place],mode:state.mode,
            refreshManager:reload,initialLocationIds:[place.uid]});
        }catch{message.textContent=t.error;}
        finally{if(profileAction.isConnected)profileAction.disabled=false;}
      });
      shortcuts.append(profileAction);
    }
    content.append(shortcuts);
    const accordion=document.createElement('details'); // intentionally closed initially
    const summary=node('summary',t.detailTitle);summary.setAttribute('aria-label',t.detailCollapse);
    accordion.append(summary);
    const gridWrap=node('div','', 'gr-ma-detail-grid-wrap');
    accordion.append(gridWrap);
    const add=(label,value)=>{
      const line=node('div','', 'gr-ma-detail-grid');
      if(label===t.detailRadius)line.classList.add('gr-ma-detail-grid-long');
      line.append(node('small',label),node('span',value));gridWrap.append(line);
    };
    add(t.coordinates,data.latitude.toFixed(6)+', '+data.longitude.toFixed(6));
    add(t.detailState,data.archived?t.detailArchived:t.detailActive);
    add(t.detailOrigin,data.origin);
    if(data.revision!==null)add(t.revision,data.revision);
    if(typeof readDetails==='function'&&state.mode==='db_active'&&typeof place.uid==='string'){
      const profileAtRead=String(owner._settingsVault?.profile?.id||'legacy');
      Promise.resolve().then(()=>readDetails(place)).then(server=>{
        if(!widget.isConnected||detailWindow!==widget||
           String(owner._settingsVault?.profile?.id||'legacy')!==profileAtRead)return;
        if(!server||server.location_id!==place.uid||
           server.name!==data.name||server.lat!==data.latitude||server.lon!==data.longitude)return;
        const bool=v=>v===true||v===1?t.detailOn:t.detailOff;
        add(t.detailMonitoring,bool(server.monitor_enabled));
        add(t.detailPaused,bool(server.paused));
        add(t.detailRecording,bool(server.record_enabled));
        if(typeof server.mode==='string')add(t.detailMode,server.mode);
        if(Number.isFinite(server.record_radius_m))add(t.detailRadius,(server.record_radius_m/1000).toFixed(1)+' km');
        if(Number.isFinite(server.alarm_radius_m))add(t.detailAlarmRadius,(server.alarm_radius_m/1000).toFixed(1)+' km');
      }).catch(()=>{if(widget.isConnected&&detailWindow===widget)message.textContent=t.detailNoData;});
    }
    const actions=node('div','', 'gr-ma-detail-actions');
    const copy=button(t.detailCopy,async()=>{
      try{
        if(!globalThis.navigator?.clipboard?.writeText)throw Error('clipboard_unavailable');
        await globalThis.navigator.clipboard.writeText(data.latitude.toFixed(6)+', '+data.longitude.toFixed(6));
        message.textContent=t.detailCopied;
      }catch{message.textContent=t.detailNoCopy;}
    });
    actions.append(copy);
    if(typeof focus==='function')actions.append(button(t.focus,()=>{
      focus({latitude:data.latitude,longitude:data.longitude});
    }));
    accordion.append(actions,node('p',t.detailHint,'gr-ma-detail-hint'));
    const message=node('p','', 'gr-ma-detail-message');
    content.append(accordion,message);widget.append(stylesheet,heading,content);
    root.append(widget);detailWindow=widget;
    const profileId=String(owner._settingsVault?.profile?.id||'legacy');
    const placeId=String(place.uid||data.name);
    const positionKey=profileId+'|'+placeId;
    let positions=detailPlacementCache.get(owner);
    if(!positions){positions=new Map();detailPlacementCache.set(owner,positions);}
    const viewportWidth=globalThis.visualViewport?.width||globalThis.innerWidth||360;
    const viewportHeight=globalThis.visualViewport?.height||globalThis.innerHeight||640;
    const layout=detailLayoutProfile({width:viewportWidth,height:viewportHeight});
    let pos=positions.get(positionKey)||{
      x:Math.round((viewportWidth-layout.width)/2),
      y:Math.max(10,Math.round((viewportHeight-Math.min(500,viewportHeight-20))/2))};
    const placeWindow=()=>{
      const viewport={width:globalThis.visualViewport?.width||globalThis.innerWidth||360,
                      height:globalThis.visualViewport?.height||globalThis.innerHeight||640,
                      panelWidth:widget.offsetWidth||layout.width,
                      panelHeight:widget.offsetHeight||400};
      pos=clampDetailPosition(pos,viewport);
      widget.style.left=pos.x+'px';widget.style.top=pos.y+'px';
      positions.set(positionKey,{...pos});
    };
    placeWindow();
    accordion.addEventListener('toggle',placeWindow); // expansion must remain on-screen
    let drag=null;
    heading.addEventListener('pointerdown',event=>{
      if(event.target.closest('button')||event.button!==0)return;
      drag={x:event.clientX,y:event.clientY,origin:pos};
      heading.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    });
    heading.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;
      const offsets={ArrowLeft:[-16,0],ArrowRight:[16,0],ArrowUp:[0,-16],ArrowDown:[0,16]};
      const [dx,dy]=offsets[event.key];pos={x:pos.x+dx,y:pos.y+dy};placeWindow();
      event.preventDefault();event.stopPropagation();
    });
    heading.addEventListener('pointermove',event=>{
      if(!drag)return;
      pos={x:drag.origin.x+event.clientX-drag.x,y:drag.origin.y+event.clientY-drag.y};
      placeWindow();
    });
    for(const ev of ['pointerup','pointercancel'])heading.addEventListener(ev,()=>{drag=null;});
    const onResize=()=>{if(widget.isConnected)placeWindow();else disposeDetail();};
    globalThis.addEventListener?.('resize',onResize);
    globalThis.visualViewport?.addEventListener?.('resize',onResize);
    disposeDetail=()=>{globalThis.removeEventListener?.('resize',onResize);
      globalThis.visualViewport?.removeEventListener?.('resize',onResize);};
    widget.addEventListener('keydown',event=>{if(event.key==='Escape'){event.stopPropagation();disposeDetail();widget.remove();detailWindow=null;}});
    widget.focus({preventScroll:true});
  };
  const consume=next=>{if(!root.isConnected)return;
    // Never leave stale details visible after a profile/mode/list reload.
    if(detailWindow){disposeDetail();detailWindow.remove();detailWindow=null;}
    state.places=next.places;state.removed=next.removed;state.mode=next.mode;selected.clear();notice('');render();};
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
  const batch=async operation=>{
    if(state.busy||state.mode!=='db_active')return;
    const plan=planLocations(state);
    const candidates=batchLocationPlan({...plan,selected:[...selected],operation});
    if(!candidates.length)return;
    if(!window.confirm(candidates.length+' '+t.batchConfirm))return;
    state.busy=true;filter.disabled=true;sorter.disabled=true;reloadButton.disabled=true;
    notice(t.busy);render();
    let done=0,stopped=false;
    try{
      // Stop after the first failed HA acknowledgement; never assume success.
      for(const location of candidates){
        if(!root.isConnected){stopped=true;break;}
        try{
          if(operation==='archive')await archive(location);
          else await restore(location);
          done++;
        }catch{stopped=true;break;}
      }
      const next=await refresh();
      consume(next);
      notice(stopped? t.batchPartial+': '+done+'/'+candidates.length:
        done+' '+t.batchDone,stopped);
    }catch{notice(t.batchPartial+': '+done+'/'+candidates.length,true);}
    finally{state.busy=false;filter.disabled=false;sorter.disabled=false;reloadButton.disabled=false;render();}
  };
  const reload=async()=>{
    if(state.busy)return;
    state.busy=true;reloadButton.disabled=true;notice(t.busy);
    try{consume(await refresh());}
    catch(error){notice(t.error,true);}
    finally{state.busy=false;reloadButton.disabled=false;}
  };
  filter.addEventListener('input',render);sorter.addEventListener('change',render);render();filter.focus({preventScroll:true});return root;
}
