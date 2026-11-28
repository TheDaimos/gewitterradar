# MA V4.14.25 CI regression diagnostics

Branch: feature/v4.14-monitored-areas
Workflow: ma-v41425-dev-build-sync.yml
These are test results, not operator database data.

~~~
  "  filter:'Standorte filtern',sort:'Sortieren',sortName:'Name A–Z',sortReverse:'Name Z–A',sortRecent:'Zuletzt geändert',select:'Auswählen',selected:'ausgewählt',selectAll:'Sichtbare auswählen',clearSelection:'Auswahl aufheben',archiveSelected:'Ausgewählte archivieren',restoreSelected:'Ausgewählte wiederherstellen',batchConfirm:'ausgewählte Standorte bearbeiten? Nur bestätigte Änderungen werden gespeichert.',batchDone:'Standorte erfolgreich bearbeitet',batchPartial:'Sammelaktion gestoppt; übrige Standorte unverändert',refresh:'Aktualisieren',close:'Schließen',active:'Gespeicherte Orte',\n" +
  "  archived:'Archivierte Orte',empty:'Keine passenden Standorte',details:'Details',back:'Zurück',\n" +
  "  focus:'Auf Karte zeigen',rename:'Umbenennen',archive:'Archivieren',restore:'Wiederherstellen',\n" +
  "  profiles:'Profile & Freigaben',overview:'Sichtfenster',createNew:'Neuer Standort',overviewHint:'Standorte geografisch ansehen',\n" +
  "  coordinates:'Koordinaten',revision:'Revision',detailHint:'Überwachungs- und Freigabeoptionen folgen in den nächsten MA-Modulen.',\n" +
  "  detailTitle:'Standortdetails',detailOrigin:'Herkunft',detailState:'Zustand',detailActive:'Aktiv',detailArchived:'Archiviert',detailCollapse:'Details ein-/ausklappen',detailMove:'Fenster verschieben',detailCopy:'Koordinaten kopieren',detailCopied:'Koordinaten kopiert',detailNoCopy:'Kopieren nicht verfügbar',detailGeo:'GeoPoint',detailGeoError:'GeoPoint Inspector nicht verfügbar – Wetterquelle und Karte prüfen.',detailMonitoring:'Überwachung',detailPaused:'Pausiert',detailRecording:'Aufzeichnung',detailRadius:'Aufzeichnungsradius',detailAlarmRadius:'Alarmradius',detailMode:'Erfassungsmodus',detailOn:'Ein',detailOff:'Aus',detailNoData:'Erweiterte Daten nicht verfügbar',\n" +
  "  renamePrompt:'Neuen Namen eingeben',archiveConfirm:'Standort archivieren? Er bleibt wiederherstellbar.',\n" +
  "  error:'Aktion nicht abgeschlossen',busy:'Bitte warten …',migration:'SQLite-Übernahme prüfen',\n" +
  "  setupHint:'Aktiviere Monitored Areas unter Einstellungen → Geräte & Dienste → GewitterRadar → Konfigurieren. Deine Local-To-do-Liste bleibt bis zur gesonderten Bestätigung unverändert.',\n" +
  "  legacyHint:'Die alte Local-To-do-Liste bleibt maßgeblich. Eine Migration wird nicht automatisch gestartet.',\n" +
  "  dbHint:'Änderungen werden nur nach Bestätigung durch Home Assistant übernommen.'},\n" +
  " en:{title:'Manage locations',subtitle:'Monitored Areas · V4.14',db:'SQLite management active',\n" +
  "  pending:'Migration pending · Local To-do remains authoritative',\n" +
  "  legacy:'Local To-do · existing place management',off:'Monitored Areas disabled · existing places untouched',\n" +
  "  filter:'Filter locations',sort:'Sort',sortName:'Name A–Z',sortReverse:'Name Z–A',sortRecent:'Recently modified',select:'Select',selected:'selected',selectAll:'Select visible',clearSelection:'Clear selection',archiveSelected:'Archive selected',restoreSelected:'Restore selected',batchConfirm:'selected locations? Only acknowledged changes are saved.',batchDone:'locations updated successfully',batchPartial:'Batch stopped; remaining locations unchanged',refresh:'Refresh',close:'Close',active:'Saved places',\n" +
  "  archived:'Archived places',empty:'No matching locations',details:'Details',back:'Back',\n" +
  "  focus:'Show on map',rename:'Rename',archive:'Archive',restore:'Restore',\n" +
  "  profiles:'Profiles & sharing',overview:'Overview',createNew:'New location',overviewHint:'View locations geographically',\n" +
  "  coordinates:'Coordinates',revision:'Revision',detailHint:'Monitoring and sharing controls follow in the next MA modules.',\n" +
  "  detailTitle:'Location details',detailOrigin:'Origin',detailState:'Status',detailActive:'Active',detailArchived:'Archived',detailCollapse:'Expand/collapse details',detailMove:'Move window',detailCopy:'Copy coordinates',detailCopied:'Coordinates copied',detailNoCopy:'Copy unavailable',detailGeo:'GeoPoint',detailGeoError:'GeoPoint Inspector unavailable – check the weather source and map.',detailMonitoring:'Monitoring',detailPaused:'Paused',detailRecording:'Recording',detailRadius:'Recording radius',detailAlarmRadius:'Alert radius',detailMode:'Capture mode',detailOn:'On',detailOff:'Off',detailNoData:'Extended data unavailable',\n" +
  "  renamePrompt:'Enter new name',archiveConfirm:'Archive location? It can be restored.',\n" +
  "  error:'Action not completed',busy:'Please wait …',migration:'Review SQLite migration',\n" +
  "  setupHint:'Enable Monitored Areas in Settings → Devices & services → GewitterRadar → Configure. Local To-do remains unchanged until separately confirmed.',\n" +
  "  legacyHint:'Local To-do remains authoritative. No migration starts automatically.',\n" +
  "  dbHint:'Changes are only applied following Home Assistant confirmation.'}\n" +
  '};\n' +
  "const STYLES='.gr-ma-manager{position:fixed;inset:0;display:grid;place-items:center;z-index:2147483598;background:#02070bdc;padding:12px;box-sizing:border-box;backdrop-filter:blur(7px)}'+\n" +
  "'.gr-ma-panel{box-sizing:border-box;width:min(760px,100%);height:min(820px,calc(100dvh - 24px));max-height:calc(100dvh - 24px);overflow:hidden;display:flex;flex-direction:column;padding:17px;border-radius:22px;border:1px solid rgba(201,160,80,.34);color:#e7eef6;background:radial-gradient(circle at 15% 0%,rgba(230,184,85,.09),transparent 34%),linear-gradient(180deg,rgba(20,28,38,.99),rgba(7,12,18,.995));box-shadow:0 30px 90px rgba(0,0,0,.72),inset 0 0 0 1px rgba(255,235,184,.055),inset 0 1px rgba(255,244,213,.08),0 0 30px rgba(207,159,60,.065);font:14px/1.5 system-ui,sans-serif}'+\n" +
  "'.gr-ma-panel header,.gr-ma-tools,.gr-ma-row,.gr-ma-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.gr-ma-panel header,.gr-ma-row{justify-content:space-be"... 38069 more characters

    at file:///home/runner/work/gewitterradar/gewitterradar/tests/test_ma021_geopoint_launch.mjs:8:8
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5) {
  generatedMessage: true,
  code: 'ERR_ASSERTION',
  actual: '// MA-023: additive profile-aware place manager. No automatic migration or tracker mutation.\n' +
    'const maPremiumClose = () => new URL("../../assets/gewitterradar-about-close-premium.webp", import.meta.url).href;\n' +
    "export const planLocations=({enabled=false,mode='legacy',places=[],removed=[]}={})=>{\n" +
    "  const authority=enabled&&mode==='db_active'?'db_active':enabled&&mode==='migration_pending'?'migration_pending':'legacy';\n" +
    '  const seen=new Set(),items=[];\n' +
    '  for(const [records,archived] of [[places,false],[removed,true]]){\n' +
    '    for(const place of records||[]){\n' +
    "      const uid=String(place?.uid||''),latitude=Number(place?.latitude),longitude=Number(place?.longitude);\n" +
    '      if(!uid||seen.has(uid)||!Number.isFinite(latitude)||!Number.isFinite(longitude)||\n' +
    '        Math.abs(latitude)>90||Math.abs(longitude)>180)continue;\n' +
    '      seen.add(uid);items.push({...place,uid,latitude,longitude,archived});\n' +
    '    }\n' +
    '  }\n' +
    "  return {mode:authority,canRename:authority==='db_active',\n" +
    '    active:items.filter(x=>!x.archived),archived:items.filter(x=>x.archived)};\n' +
    '};\n' +
    "export function sortedLocations(records=[],sort='name'){\n" +
    "  const items=[...records], byName=(a,b)=>String(a.name||a.summary||'').localeCompare(String(b.name||b.summary||''),undefined,{sensitivity:'base',numeric:true})||\n" +
    "    String(a.uid||'').localeCompare(String(b.uid||''));\n" +
    "  if(sort==='recent')items.sort((a,b)=>(Number(b.updated_at)||0)-(Number(a.updated_at)||0)||byName(a,b));\n" +
    "  else if(sort==='name_desc')items.sort((a,b)=>-byName(a,b));\n" +
    '  else items.sort(byName);\n' +
    '  return items;\n' +
    '}\n' +
    "export function batchLocationPlan({mode='legacy',active=[],archived=[],selected=[],operation='archive'}={}){\n" +
    "  if(mode!=='db_active'||!['archive','restore'].includes(operation))return [];\n" +
    "  const selectedIds=new Set(selected.filter(id=>typeof id==='string'));\n" +
    "  const source=operation==='archive'?active:archived;\n" +
    '  // No implicit mass action on filtered or hidden rows: selection only.\n' +
    "  return source.filter(item=>selectedIds.has(item.uid)&&typeof item.uid==='string'&&\n" +
    '    Number.isInteger(item.revision)&&item.revision>=1).map(item=>({...item}));\n' +
    '}\n' +
    '// MA-021: pure responsive positioning and read-only location descriptor.\n' +
    '// No persistence: panel position is scoped to the current manager instance.\n' +
    '// MA-021: responsive device profiles are a pure layout decision.\n' +
    'export function detailLayoutProfile({width=360,height=640}={}){\n' +
    '  width=Number.isFinite(width)?Math.max(1,width):360;\n' +
    '  height=Number.isFinite(height)?Math.max(1,height):640;\n' +
    "  if(width<680)return Object.freeze({mode:'mobile',width:Math.max(1,width-20),columns:1});\n" +
    "  if(width<1180)return Object.freeze({mode:'tablet',width:Math.min(810,width-32),columns:2});\n" +
    "  return Object.freeze({mode:'desktop',width:Math.min(920,width-48),columns:2});\n" +
    '}\n' +
    'const detailPlacementCache=new WeakMap();\n' +
    'export function clampDetailPosition(position,{width,height,panelWidth,panelHeight,margin=10}={}){\n' +
    '  const finite=(v,fallback)=>Number.isFinite(v)?v:fallback;\n' +
    '  width=Math.max(1,finite(width,360));height=Math.max(1,finite(height,640));\n' +
    '  panelWidth=Math.max(1,finite(panelWidth,Math.min(width,420)));\n' +
    '  panelHeight=Math.max(1,finite(panelHeight,Math.min(height,400)));\n' +
    '  margin=Math.max(0,finite(margin,10));\n' +
    '  const minX=Math.min(margin,Math.max(0,width-panelWidth));\n' +
    '  const minY=Math.min(margin,Math.max(0,height-panelHeight));\n' +
    '  const maxX=Math.max(minX,width-panelWidth-margin);\n' +
    '  const maxY=Math.max(minY,height-panelHeight-margin);\n' +
    '  return {x:Math.min(maxX,Math.max(minX,finite(position?.x,minX))),\n' +
    '          y:Math.min(maxY,Math.max(minY,finite(position?.y,minY)))};\n' +
    '}\n' +
    'export function detailLocation(place){\n' +
    '  const latitude=Number(place?.latitude),longitude=Number(place?.longitude);\n' +
    '  if(!Number.isFinite(latitude)||!Number.isFinite(longitude)||\n' +
    "     Math.abs(latitude)>90||Math.abs(longitude)>180)throw new TypeError('MA_INVALID_COORDINATES');\n" +
    "  return Object.freeze({name:String(place?.name||place?.summary||''),\n" +
    '    latitude,longitude,archived:place?.archived===true,\n' +
    '    revision:Number.isInteger(place?.revision)?place.revision:null,\n' +
    "    origin:String(place?.location_origin||place?.provider||'unknown')});\n" +
    '}\n' +
    'const COPY={\n' +
    " de:{title:'Standortverwaltung',subtitle:'Monitored Areas · V4.14',db:'SQLite-Verwaltung aktiv',\n" +
    "  pending:'Migration ausstehend · Local To-do bleibt maßgeblich',\n" +
    "  legacy:'Local To-do · bisherige Standortverwaltung',off:'Monitored Areas deaktiviert · alte Orte bleiben unverändert',\n" +
    "  filter:'Standorte filtern',sort:'Sortieren',sortName:'Name A–Z',sortReverse:'Name Z–A',sortRecent:'Zuletzt geändert',select:'Auswählen',selected:'ausgewählt',selectAll:'Sichtbare auswählen',clearSelection:'Auswahl aufheben',archiveSelected:'Ausgewählte archivieren',restoreSelected:'Ausgewählte wiederherstellen',batchConfirm:'ausgewählte Standorte bearbeiten? Nur bestätigte Änderungen werden gespeichert.',batchDone:'Standorte erfolgreich bearbeitet',batchPartial:'Sammelaktion gestoppt; übrige Standorte unverändert',refresh:'Aktualisieren',close:'Schließen',active:'Gespeicherte Orte',\n" +
    "  archived:'Archivierte Orte',empty:'Keine passenden Standorte',details:'Details',back:'Zurück',\n" +
    "  focus:'Auf Karte zeigen',rename:'Umbenennen',archive:'Archivieren',restore:'Wiederherstellen',\n" +
    "  profiles:'Profile & Freigaben',overview:'Sichtfenster',createNew:'Neuer Standort',overviewHint:'Standorte geografisch ansehen',\n" +
    "  coordinates:'Koordinaten',revision:'Revision',detailHint:'Überwachungs- und Freigabeoptionen folgen in den nächsten MA-Modulen.',\n" +
    "  detailTitle:'Standortdetails',detailOrigin:'Herkunft',detailState:'Zustand',detailActive:'Aktiv',detailArchived:'Archiviert',detailCollapse:'Details ein-/ausklappen',detailMove:'Fenster verschieben',detailCopy:'Koordinaten kopieren',detailCopied:'Koordinaten kopiert',detailNoCopy:'Kopieren nicht verfügbar',detailGeo:'GeoPoint',detailGeoError:'GeoPoint Inspector nicht verfügbar – Wetterquelle und Karte prüfen.',detailMonitoring:'Überwachung',detailPaused:'Pausiert',detailRecording:'Aufzeichnung',detailRadius:'Aufzeichnungsradius',detailAlarmRadius:'Alarmradius',detailMode:'Erfassungsmodus',detailOn:'Ein',detailOff:'Aus',detailNoData:'Erweiterte Daten nicht verfügbar',\n" +
    "  renamePrompt:'Neuen Namen eingeben',archiveConfirm:'Standort archivieren? Er bleibt wiederherstellbar.',\n" +
    "  error:'Aktion nicht abgeschlossen',busy:'Bitte warten …',migration:'SQLite-Übernahme prüfen',\n" +
    "  setupHint:'Aktiviere Monitored Areas unter Einstellungen → Geräte & Dienste → GewitterRadar → Konfigurieren. Deine Local-To-do-Liste bleibt bis zur gesonderten Bestätigung unverändert.',\n" +
    "  legacyHint:'Die alte Local-To-do-Liste bleibt maßgeblich. Eine Migration wird nicht automatisch gestartet.',\n" +
    "  dbHint:'Änderungen werden nur nach Bestätigung durch Home Assistant übernommen.'},\n" +
    " en:{title:'Manage locations',subtitle:'Monitored Areas · V4.14',db:'SQLite management active',\n" +
    "  pending:'Migration pending · Local To-do remains authoritative',\n" +
    "  legacy:'Local To-do · existing place management',off:'Monitored Areas disabled · existing places untouched',\n" +
    "  filter:'Filter locations',sort:'Sort',sortName:'Name A–Z',sortReverse:'Name Z–A',sortRecent:'Recently modified',select:'Select',selected:'selected',selectAll:'Select visible',clearSelection:'Clear selection',archiveSelected:'Archive selected',restoreSelected:'Restore selected',batchConfirm:'selected locations? Only acknowledged changes are saved.',batchDone:'locations updated successfully',batchPartial:'Batch stopped; remaining locations unchanged',refresh:'Refresh',close:'Close',active:'Saved places',\n" +
    "  archived:'Archived places',empty:'No matching locations',details:'Details',back:'Back',\n" +
    "  focus:'Show on map',rename:'Rename',archive:'Archive',restore:'Restore',\n" +
    "  profiles:'Profiles & sharing',overview:'Overview',createNew:'New location',overviewHint:'View locations geographically',\n" +
    "  coordinates:'Coordinates',revision:'Revision',detailHint:'Monitoring and sharing controls follow in the next MA modules.',\n" +
    "  detailTitle:'Location details',detailOrigin:'Origin',detailState:'Status',detailActive:'Active',detailArchived:'Archived',detailCollapse:'Expand/collapse details',detailMove:'Move window',detailCopy:'Copy coordinates',detailCopied:'Coordinates copied',detailNoCopy:'Copy unavailable',detailGeo:'GeoPoint',detailGeoError:'GeoPoint Inspector unavailable – check the weather source and map.',detailMonitoring:'Monitoring',detailPaused:'Paused',detailRecording:'Recording',detailRadius:'Recording radius',detailAlarmRadius:'Alert radius',detailMode:'Capture mode',detailOn:'On',detailOff:'Off',detailNoData:'Extended data unavailable',\n" +
    "  renamePrompt:'Enter new name',archiveConfirm:'Archive location? It can be restored.',\n" +
    "  error:'Action not completed',busy:'Please wait …',migration:'Review SQLite migration',\n" +
    "  setupHint:'Enable Monitored Areas in Settings → Devices & services → GewitterRadar → Configure. Local To-do remains unchanged until separately confirmed.',\n" +
    "  legacyHint:'Local To-do remains authoritative. No migration starts automatically.',\n" +
    "  dbHint:'Changes are only applied following Home Assistant confirmation.'}\n" +
    '};\n' +
    "const STYLES='.gr-ma-manager{position:fixed;inset:0;display:grid;place-items:center;z-index:2147483598;background:#02070bdc;padding:12px;box-sizing:border-box;backdrop-filter:blur(7px)}'+\n" +
    "'.gr-ma-panel{box-sizing:border-box;width:min(760px,100%);height:min(820px,calc(100dvh - 24px));max-height:calc(100dvh - 24px);overflow:hidden;display:flex;flex-direction:column;padding:17px;border-radius:22px;border:1px solid rgba(201,160,80,.34);color:#e7eef6;background:radial-gradient(circle at 15% 0%,rgba(230,184,85,.09),transparent 34%),linear-gradient(180deg,rgba(20,28,38,.99),rgba(7,12,18,.995));box-shadow:0 30px 90px rgba(0,0,0,.72),inset 0 0 0 1px rgba(255,235,184,.055),inset 0 1px rgba(255,244,213,.08),0 0 30px rgba(207,159,60,.065);font:14px/1.5 system-ui,sans-serif}'+\n" +
    "'.gr-ma-panel header,.gr-ma-tools,.gr-ma-row,.gr-ma-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.gr-ma-panel header,.gr-ma-row{justify-content:space-be"... 38069 more characters,
  expected: /detailGeo:'GeoPoint Inspector öffnen'/,
  operator: 'match',
  diff: 'simple'
}

Node.js v22.23.5
~~~
