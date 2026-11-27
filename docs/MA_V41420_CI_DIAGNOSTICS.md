# MA V4.14.20 CI regression diagnostics

Branch: feature/v4.14-monitored-areas
Workflow: ma-v41420-dev-build-sync.yml
These are test results, not operator database data.

~~~
  duration_ms: 12.294425
  type: 'test'
  ...
# Subtest: ON: one runtime start, idempotent teardown and restart
ok 2 - ON: one runtime start, idempotent teardown and restart
  ---
  duration_ms: 5.095911
  type: 'test'
  ...
# Subtest: disconnect and OFF terminate active runtime, no restart
ok 3 - disconnect and OFF terminate active runtime, no restart
  ---
  duration_ms: 0.620058
  type: 'test'
  ...
# Subtest: optional initialization and teardown failures remain isolated
ok 4 - optional initialization and teardown failures remain isolated
  ---
  duration_ms: 0.72923
  type: 'test'
  ...
# Subtest: regular optional registration and exact inventory/mirror hashes
ok 5 - regular optional registration and exact inventory/mirror hashes
  ---
  duration_ms: 9.152831
  type: 'test'
  ...
1..5
# tests 5
# suites 0
# pass 5
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 78.992736
PASS MA-023 model, mode gate, no implicit migration, UI integration and mirror
PASS MA-021 Havanna detail read-only geometry, drag and safety
PASS MA-021 Desktop/iPad portrait+landscape/mobile layout, session positioning and read-only profile guard
PASS MA-021 profile-scoped SQLite detail read gate, no pending access and no mutation receipt
node:internal/modules/run_main:123
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: GeoPoint button must be visible above the collapsed details
    at file:///home/runner/work/gewitterradar/gewitterradar/tests/test_ma021_geopoint_launch.mjs:11:8
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5) {
  generatedMessage: false,
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
    " de:{title:'Standorte verwalten',subtitle:'Monitored Areas · V4.14',db:'SQLite-Verwaltung aktiv',\n" +
    "  pending:'Migration ausstehend · Local To-do bleibt maßgeblich',\n" +
    "  legacy:'Local To-do · bisherige Standortverwaltung',off:'Monitored Areas deaktiviert · alte Orte bleiben unverändert',\n" +
    "  filter:'Standorte filtern',refresh:'Aktualisieren',close:'Schließen',active:'Gespeicherte Orte',\n" +
    "  archived:'Archivierte Orte',empty:'Keine passenden Standorte',details:'Details',back:'Zurück',\n" +
    "  focus:'Auf Karte zeigen',rename:'Umbenennen',archive:'Archivieren',restore:'Wiederherstellen',\n" +
    "  coordinates:'Koordinaten',revision:'Revision',detailHint:'Überwachungs- und Freigabeoptionen folgen in den nächsten MA-Modulen.',\n" +
    "  detailTitle:'Standortdetails',detailOrigin:'Herkunft',detailState:'Zustand',detailActive:'Aktiv',detailArchived:'Archiviert',detailCollapse:'Details ein-/ausklappen',detailMove:'Fenster verschieben',detailCopy:'Koordinaten kopieren',detailCopied:'Koordinaten kopiert',detailNoCopy:'Kopieren nicht verfügbar',detailGeo:'GeoPoint Inspector öffnen',detailGeoError:'GeoPoint Inspector nicht verfügbar – Wetterquelle und Karte prüfen.',detailMonitoring:'Überwachung',detailPaused:'Pausiert',detailRecording:'Aufzeichnung',detailRadius:'Aufzeichnungsradius',detailAlarmRadius:'Alarmradius',detailMode:'Erfassungsmodus',detailOn:'Ein',detailOff:'Aus',detailNoData:'Erweiterte Daten nicht verfügbar',\n" +
    "  renamePrompt:'Neuen Namen eingeben',archiveConfirm:'Standort archivieren? Er bleibt wiederherstellbar.',\n" +
    "  error:'Aktion nicht abgeschlossen',busy:'Bitte warten …',migration:'SQLite-Übernahme prüfen',\n" +
    "  setupHint:'Aktiviere Monitored Areas unter Einstellungen → Geräte & Dienste → GewitterRadar → Konfigurieren. Deine Local-To-do-Liste bleibt bis zur gesonderten Bestätigung unverändert.',\n" +
    "  legacyHint:'Die alte Local-To-do-Liste bleibt maßgeblich. Eine Migration wird nicht automatisch gestartet.',\n" +
    "  dbHint:'Änderungen werden nur nach Bestätigung durch Home Assistant übernommen.'},\n" +
    " en:{title:'Manage locations',subtitle:'Monitored Areas · V4.14',db:'SQLite management active',\n" +
    "  pending:'Migration pending · Local To-do remains authoritative',\n" +
    "  legacy:'Local To-do · existing place management',off:'Monitored Areas disabled · existing places untouched',\n" +
    "  filter:'Filter locations',refresh:'Refresh',close:'Close',active:'Saved places',\n" +
    "  archived:'Archived places',empty:'No matching locations',details:'Details',back:'Back',\n" +
    "  focus:'Show on map',rename:'Rename',archive:'Archive',restore:'Restore',\n" +
    "  coordinates:'Coordinates',revision:'Revision',detailHint:'Monitoring and sharing controls follow in the next MA modules.',\n" +
    "  detailTitle:'Location details',detailOrigin:'Origin',detailState:'Status',detailActive:'Active',detailArchived:'Archived',detailCollapse:'Expand/collapse details',detailMove:'Move window',detailCopy:'Copy coordinates',detailCopied:'Coordinates copied',detailNoCopy:'Copy unavailable',detailGeo:'Open GeoPoint Inspector',detailGeoError:'GeoPoint Inspector unavailable – check the weather source and map.',detailMonitoring:'Monitoring',detailPaused:'Paused',detailRecording:'Recording',detailRadius:'Recording radius',detailAlarmRadius:'Alert radius',detailMode:'Capture mode',detailOn:'On',detailOff:'Off',detailNoData:'Extended data unavailable',\n" +
    "  renamePrompt:'Enter new name',archiveConfirm:'Archive location? It can be restored.',\n" +
    "  error:'Action not completed',busy:'Please wait …',migration:'Review SQLite migration',\n" +
    "  setupHint:'Enable Monitored Areas in Settings → Devices & services → GewitterRadar → Configure. Local To-do remains unchanged until separately confirmed.',\n" +
    "  legacyHint:'Local To-do remains authoritative. No migration starts automatically.',\n" +
    "  dbHint:'Changes are only applied following Home Assistant confirmation.'}\n" +
    '};\n' +
    "const STYLES='.gr-ma-manager{position:fixed;inset:0;display:grid;place-items:center;z-index:2147483598;background:#02070bdc;padding:12px;box-sizing:border-box;backdrop-filter:blur(7px)}'+\n" +
    "'.gr-ma-panel{box-sizing:border-box;width:min(760px,100%);height:min(820px,calc(100dvh - 24px));max-height:calc(100dvh - 24px);overflow:hidden;display:flex;flex-direction:column;padding:17px;border-radius:22px;border:1px solid rgba(201,160,80,.34);color:#e7eef6;background:radial-gradient(circle at 15% 0%,rgba(230,184,85,.09),transparent 34%),linear-gradient(180deg,rgba(20,28,38,.99),rgba(7,12,18,.995));box-shadow:0 30px 90px rgba(0,0,0,.72),inset 0 0 0 1px rgba(255,235,184,.055),inset 0 1px rgba(255,244,213,.08),0 0 30px rgba(207,159,60,.065);font:14px/1.5 system-ui,sans-serif}'+\n" +
    "'.gr-ma-panel header,.gr-ma-tools,.gr-ma-row,.gr-ma-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.gr-ma-panel header,.gr-ma-row{justify-content:space-between}.gr-ma-panel h2{color:#f4dfb6;font:25px Georgia,serif;margin:0}.gr-ma-panel small{color:#b4cadb}'+\n" +
    "'.gr-ma-panel>header,.gr-ma-panel>.gr-ma-tools,.gr-ma-panel>.gr-ma-status,.gr-ma-panel>.gr-ma-feedback{flex:0 0 auto}.gr-ma-panel>header{position:relative;z-index:2;padding-bottom:10px;border-bottom:1px solid #947748}.gr-ma-panel>.gr-ma-tools{margin:8px 0}.gr-ma-panel>.gr-ma-status{max-height:4.5em;overflow:auto}.gr-ma-panel>.gr-ma-list{flex:1 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain;contain:paint;scrollbar-gutter:stable;padding-right:3px}.gr-ma-panel>.gr-ma-feedback{max-height:4em;overflow:auto;border-top:1px solid #947748;padding-top:8px}.gr-ma-panel .gr-ma-close{width:44px;height:44px;min-width:44px;min-height:44px;flex-shrink:0;display:grid;place-items:center;border:0!important;border-radius:8px!important;background:transparent!important;box-shadow:none!important;padding:0!important;touch-action:manipulation}.gr-ma-panel .gr-ma-close img{display:block;width:34px;height:34px;object-fit:contain;pointer-events:none;transition:transform .16s ease,filter .16s ease}@media(hover:hover) and (pointer:fine){.gr-ma-panel .gr-ma-close:hover img{filter:brightness(1.12) drop-shadow(0 0 2px #dba34c70)}}.gr-ma-panel .gr-ma-close:active img{transform:scale(.97);filter:brightness(.92)}'+\n" +
    "'.gr-ma-panel button,.gr-ma-panel input{font:inherit;border:1px solid #91a8ba;border-radius:9px;background:#11283a;color:#eff4fa;padding:8px 11px;min-height:44px;box-sizing:border-box}.gr-ma-panel button{cursor:pointer}.gr-ma-panel button:disabled{opacity:.55}.gr-ma-panel button:focus-visible,.gr-ma-panel input:focus-visible{outline:2px solid #ffe6af;outline-offset:2px}'+\n" +
    `'.gr-ma-accordion{margin:10px 0;border:1px solid rgba(201,160,80,.26);border-radius:11px;overflow:hidden;background:#0d1a26}.gr-ma-accordion>summary{cursor:pointer;list-style:none;padding:11px 12px;color:#edcf98;font-weight:700;display:flex;align-items:center;justify-content:space-between}.gr-ma-accordion>summary::-webkit-details-marker{display:none}.gr-ma-accordion>summary::after{content:"";width:9px;height:9px;border-right:2px solid #d6b66e;border-bottom:2px solid #d6b66e;transfo`... 25674 more characters,
  expected: /content\\.append\\(shortcuts\\)/,
  operator: 'match',
  diff: 'simple'
}

Node.js v22.23.5
~~~
