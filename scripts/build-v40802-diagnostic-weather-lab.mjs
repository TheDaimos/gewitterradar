#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');
const sourcePath = path.join(root, 'frontend', 'gewitterradar.js');
const integrationPath = path.join(root, 'custom_components', 'gewitterradar', 'frontend', 'gewitterradar.js');
const dashboardPath = path.join(root, 'dashboard', 'dist', 'gewitterradar.js');

// V4.08.02 is deliberately a second deterministic transform. The first step
// must successfully reproduce the already accepted V4.08.01 test candidate.
await import('./build-v40801-cluster-test.mjs');

const V40801_SHA256 = '8e069b743ce483b55a634079dc5e1d31165214018aeee24764d819a7ebadee00';
const sha256 = (value) => createHash('sha256').update(value).digest('hex');

let card = await readFile(sourcePath, 'utf8');
const inputHash = sha256(card);
if (inputHash !== V40801_SHA256) {
  throw new Error(`V4.08.02 builder refuses unknown V4.08.01 input: ${inputHash}`);
}

function replaceOnce(label, needle, replacement) {
  const first = card.indexOf(needle);
  if (first < 0) throw new Error(`Missing V4.08.02 anchor: ${label}`);
  if (card.indexOf(needle, first + needle.length) >= 0) throw new Error(`Non-unique V4.08.02 anchor: ${label}`);
  card = card.slice(0, first) + replacement + card.slice(first + needle.length);
}

replaceOnce(
  'header version',
  '/* Gewitterradar Card V4.08.01 TEST – zonenabhängige Cluster-Auflösung auf Basis des unveränderten V4.07.56 Golden Masters.',
  '/* Gewitterradar Card V4.08.02 TEST – Diagnose- und Wetter-Labor auf Basis der reproduzierbaren V4.08.01 Cluster-Testversion.'
);
replaceOnce("CARD_VERSION", "const CARD_VERSION = '4.08.01';", "const CARD_VERSION = '4.08.02';");
replaceOnce("CARD_DISPLAY_VERSION", "const CARD_DISPLAY_VERSION = '4.08.01';", "const CARD_DISPLAY_VERSION = '4.08.02';");
replaceOnce("GEWITTERRADAR_BUILD", "const GEWITTERRADAR_BUILD = 'V4.08.01-CLUSTER-TEST-2026-09-16';", "const GEWITTERRADAR_BUILD = 'V4.08.02-DIAGNOSTIC-WEATHER-LAB-2026-09-16';");
replaceOnce('cluster test label', 'Cluster-Auflösung · V4.08.01 TEST', 'Cluster-Auflösung · V4.08 TEST');

replaceOnce(
  'cluster browse timeout state',
  '      this._statusClusterBrowseActive = !!this._statusClusterBrowseActive;\n\n      this._renderedMapClusters = Array.isArray(this._renderedMapClusters)',
  `      this._statusClusterBrowseActive = !!this._statusClusterBrowseActive;\n      this._statusClusterBrowseTimeoutMs = Number.isFinite(this._statusClusterBrowseTimeoutMs) ? this._statusClusterBrowseTimeoutMs : 10000;\n      this._statusClusterBrowseLastInteraction = Number(this._statusClusterBrowseLastInteraction)||0;\n      this._statusClusterBrowseTimer = this._statusClusterBrowseTimer || null;\n      this._statusClusterBrowseUiTimer = this._statusClusterBrowseUiTimer || null;\n      try {\n        const savedBrowseTimeout = Number(localStorage.getItem('gewitterradar:v40802:cluster-jump-timeout'));\n        if ([0,5000,10000,20000].includes(savedBrowseTimeout)) this._statusClusterBrowseTimeoutMs = savedBrowseTimeout;\n      } catch (_error) {}\n\n      this._renderedMapClusters = Array.isArray(this._renderedMapClusters)`
);

replaceOnce(
  'diagnostic weather lab state',
  "        virtualStorm:{scenario:'off',ownedIds:[],startedAt:0,count:0,cells:0,cellCount:1,extreme:false,extremeCells:0}\n      };",
  `        virtualStorm:{scenario:'off',ownedIds:[],startedAt:0,count:0,cells:0,cellCount:1,extreme:false,extremeCells:0},\n        weatherLab:{\n          version:'4.08.02',seed:40802,\n          lightning:{densityMultiplier:1,ageProfile:'mixed',boundaryCases:false,lastStressRenders:0},\n          precipitation:{prepared:true,enabled:false,model:'organic-scalar-field'},\n          clouds:{prepared:true,enabled:false,model:'layered-density-field'}\n        }\n      };`
);

replaceOnce(
  'diagnostic cockpit css',
  '          .diagnostic-console-section-title { margin-bottom:6px;color:#8edfff;font-size:9px;font-weight:850;letter-spacing:.08em;text-transform:uppercase; }\n',
  `          .diagnostic-console-section-title { margin-bottom:6px;color:#8edfff;font-size:9px;font-weight:850;letter-spacing:.08em;text-transform:uppercase; }\n          .diagnostic-lab-group { grid-column:1 / -1;min-width:0;border:1px solid rgba(126,211,255,.14);border-radius:9px;background:rgba(4,12,19,.44);overflow:clip; }\n          .diagnostic-lab-group > summary { list-style:none;display:flex;align-items:center;gap:8px;padding:8px 10px;cursor:pointer;color:#9de9ff;font:850 9px/1.2 system-ui,sans-serif;letter-spacing:.07em;text-transform:uppercase;background:rgba(13,35,49,.72);user-select:none; }\n          .diagnostic-lab-group > summary::-webkit-details-marker { display:none; }\n          .diagnostic-lab-group > summary::before { content:'▸';color:#ff62c6;font-size:11px;transform-origin:center;transition:transform .16s ease; }\n          .diagnostic-lab-group[open] > summary::before { transform:rotate(90deg); }\n          .diagnostic-lab-group-body { display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px;padding:8px; }\n          .diagnostic-lab-field { display:flex;align-items:center;gap:5px;min-width:0;color:#9cc9dc;font:800 8px/1 system-ui,sans-serif; }\n          .diagnostic-lab-field select { min-width:0;max-width:150px;border:1px solid rgba(126,211,255,.34);border-radius:6px;background:#0b1b27;color:#e8f7ff;padding:5px 7px;font:700 9px/1.2 system-ui,sans-serif; }\n          .diagnostic-lab-note,.diagnostic-cluster-browser-state { margin-top:6px;color:#b9d2df;font:650 8px/1.4 ui-monospace,monospace;white-space:pre-wrap; }\n          .diagnostic-weather-lab-section,.diagnostic-cluster-browser-section { grid-column:1 / -1; }\n`
);

replaceOnce(
  'diagnostic mobile cockpit css',
  '            .diagnostic-console-section { margin-bottom:8px; }\n            .diagnostic-primary-section { top:-8px; }',
  `            .diagnostic-console-section { margin-bottom:8px; }\n            .diagnostic-lab-group { margin-bottom:8px; }\n            .diagnostic-lab-group-body { grid-template-columns:minmax(0,1fr); }\n            .diagnostic-primary-section { top:-8px; }`
);

replaceOnce(
  'diagnostic cockpit methods',
  '    _bindDiagnosticControls() {\n      const consoleNode=this.shadow?.getElementById(\'diagnostic-console\');if(!consoleNode||consoleNode.dataset.bound)return;consoleNode.dataset.bound=\'true\';',
  `    _upgradeDiagnosticCockpitV40802() {\n      const consoleNode=this.shadow?.getElementById('diagnostic-console'),body=consoleNode?.querySelector('.diagnostic-console-body');\n      if(!body||body.dataset.v40802Cockpit==='true')return;\n      body.dataset.v40802Cockpit='true';\n      const allSections=[...body.querySelectorAll(':scope > .diagnostic-console-section')];\n      const sectionWith=(selector)=>allSections.find((section)=>section.querySelector(selector));\n      const grid=sectionWith('#diagnostic-grid-title'),overlays=sectionWith('#diagnostic-overlays-title'),presets=sectionWith('#diagnostic-presets-title');\n      const medallion=body.querySelector(':scope > .diagnostic-medallion-state-section');\n      const storm=body.querySelector(':scope > .diagnostic-virtual-storm-section');\n      const readout=sectionWith('#diagnostic-readout'),exportSection=body.querySelector(':scope > .diagnostic-export-section');\n\n      const weather=document.createElement('div');weather.className='diagnostic-console-section diagnostic-weather-lab-section';weather.innerHTML=\`\n        <div class="diagnostic-console-section-title">Wetter-Labor · V4.08.02</div>\n        <div class="diagnostic-controls">\n          <label class="diagnostic-lab-field">Blitzlast <select id="diagnostic-lab-density"><option value="1">1× normal</option><option value="5">5× hoch</option><option value="20">20× Stress</option></select></label>\n          <label class="diagnostic-lab-field">Alter <select id="diagnostic-lab-age"><option value="mixed">gemischt</option><option value="fresh">nur frisch</option><option value="stale">nur alt</option></select></label>\n          <button id="diagnostic-lab-boundaries" type="button" aria-pressed="false">Radius-Grenzen</button>\n        </div>\n        <div class="diagnostic-lab-note" id="diagnostic-weather-lab-state">Blitze/Cluster aktiv · Niederschlag vorbereitet · Wolken vorbereitet</div>\`;
\n      const browser=document.createElement('div');browser.className='diagnostic-console-section diagnostic-cluster-browser-section';browser.innerHTML=\`\n        <div class="diagnostic-console-section-title">Cluster-Sprung · Sitzung</div>\n        <div class="diagnostic-controls">\n          <label class="diagnostic-lab-field">Inaktivität <select id="diagnostic-cluster-jump-timeout"><option value="5000">5 s</option><option value="10000">10 s</option><option value="20000">20 s</option><option value="0">unbegrenzt</option></select></label>\n          <button id="diagnostic-cluster-jump-end" type="button">Sitzung beenden</button>\n          <button id="diagnostic-cluster-render-stress" type="button">20× Render</button>\n        </div>\n        <div class="diagnostic-cluster-browser-state" id="diagnostic-cluster-browser-state">Sitzung inaktiv</div>\`;
\n      if(storm){storm.before(weather);storm.after(browser);}\n\n      let saved={};try{saved=JSON.parse(localStorage.getItem('gewitterradar:v40802:diagnostic-sections')||'{}')||{};}catch(_error){}\n      const makeGroup=(key,title,nodes,defaultOpen=false)=>{\n        const items=nodes.filter(Boolean);if(!items.length)return null;const first=items[0],details=document.createElement('details'),summary=document.createElement('summary'),inner=document.createElement('div');\n        details.className='diagnostic-lab-group';details.dataset.diagnosticLabGroup=key;summary.textContent=title;inner.className='diagnostic-lab-group-body';\n        details.open=Object.prototype.hasOwnProperty.call(saved,key)?!!saved[key]:defaultOpen;first.before(details);details.append(summary,inner);items.forEach((node)=>inner.append(node));\n        details.addEventListener('toggle',()=>{\n          if(details.open&&matchMedia?.('(max-width:700px),(max-height:620px)')?.matches){body.querySelectorAll('.diagnostic-lab-group[open]').forEach((other)=>{if(other!==details)other.open=false;});}\n          const state={};body.querySelectorAll('.diagnostic-lab-group').forEach((group)=>{state[group.dataset.diagnosticLabGroup]=group.open;});try{localStorage.setItem('gewitterradar:v40802:diagnostic-sections',JSON.stringify(state));}catch(_error){}\n        });\n        return details;\n      };\n\n      makeGroup('weather','Blitze, Cluster & Wetter',[weather,storm,browser],true);\n      makeGroup('geometry','Anzeige & Geometrie',[grid,overlays,presets],false);\n      makeGroup('medallion','Medaillon',[medallion],false);\n      makeGroup('telemetry','Messwerte & Protokoll',[readout,exportSection],false);\n      this._syncDiagnosticWeatherLabV40802?.();\n      this._syncDiagnosticClusterBrowseV40802?.();\n    }\n\n    _syncDiagnosticWeatherLabV40802() {\n      const d=this._diagnostics,lab=d?.weatherLab,lightning=lab?.lightning;if(!lab||!lightning)return;\n      const density=this.shadow?.getElementById('diagnostic-lab-density'),age=this.shadow?.getElementById('diagnostic-lab-age'),boundaries=this.shadow?.getElementById('diagnostic-lab-boundaries'),state=this.shadow?.getElementById('diagnostic-weather-lab-state');\n      if(density)density.value=String(lightning.densityMultiplier||1);if(age)age.value=lightning.ageProfile||'mixed';\n      boundaries?.classList.toggle('active',!!lightning.boundaryCases);boundaries?.setAttribute('aria-pressed',lightning.boundaryCases?'true':'false');\n      if(state)state.textContent=\`Blitze/Cluster aktiv · Last \${lightning.densityMultiplier||1}× · Alter \${lightning.ageProfile||'mixed'} · Grenzen \${lightning.boundaryCases?'EIN':'AUS'}\\nNiederschlag: vorbereitet (organisches Intensitätsfeld) · Wolken: vorbereitet (Dichtefeld)\`;\n    }\n\n    _syncDiagnosticClusterBrowseV40802() {\n      const node=this.shadow?.getElementById('diagnostic-cluster-browser-state'),select=this.shadow?.getElementById('diagnostic-cluster-jump-timeout');if(select)select.value=String(this._statusClusterBrowseTimeoutMs??10000);if(!node)return;\n      const active=!!this._statusClusterBrowseActive,total=active?(this._statusClusterBrowseSnapshot?.length||0):(this._statusFocusList?.length||0),index=active&&Number.isInteger(this._statusFocusIndex)&&this._statusFocusIndex>=0?this._statusFocusIndex+1:0,timeout=Number(this._statusClusterBrowseTimeoutMs)||0;\n      let remaining='∞';if(active&&timeout>0&&this._statusClusterBrowseLastInteraction){remaining=\`${Math.max(0,(timeout-(Date.now()-this._statusClusterBrowseLastInteraction))/1000).toFixed(1)} s\`;}\n      node.textContent=active?\`AKTIV · \${index}/\${total} · N eingefroren \${total} · Rest \${remaining}\\nID \${this._statusFocusSelectedId||'—'}\`:\`INAKTIV · Live-Cluster \${total} · nächster Sprung startet neue Sitzung\`;\n    }\n\n    _bindDiagnosticControls() {\n      const consoleNode=this.shadow?.getElementById('diagnostic-console');if(!consoleNode||consoleNode.dataset.bound)return;this._upgradeDiagnosticCockpitV40802?.();consoleNode.dataset.bound='true';`
);

replaceOnce(
  'diagnostic lab controls',
  "      this.shadow.getElementById('diagnostic-storm-extreme')?.addEventListener('click',()=>this._setDiagnosticVirtualStormExtreme(!this._diagnostics.virtualStorm?.extreme));\n",
  `      this.shadow.getElementById('diagnostic-storm-extreme')?.addEventListener('click',()=>this._setDiagnosticVirtualStormExtreme(!this._diagnostics.virtualStorm?.extreme));\n      this.shadow.getElementById('diagnostic-lab-density')?.addEventListener('change',(event)=>{const value=Math.max(1,Math.min(20,Number(event.target.value)||1));this._diagnostics.weatherLab.lightning.densityMultiplier=value;const scenario=this._diagnostics.virtualStorm?.scenario||'off';if(scenario!=='off')this._setDiagnosticVirtualStorm(scenario);else this._syncDiagnosticWeatherLabV40802();});\n      this.shadow.getElementById('diagnostic-lab-age')?.addEventListener('change',(event)=>{const value=['mixed','fresh','stale'].includes(event.target.value)?event.target.value:'mixed';this._diagnostics.weatherLab.lightning.ageProfile=value;const scenario=this._diagnostics.virtualStorm?.scenario||'off';if(scenario!=='off')this._setDiagnosticVirtualStorm(scenario);else this._syncDiagnosticWeatherLabV40802();});\n      this.shadow.getElementById('diagnostic-lab-boundaries')?.addEventListener('click',()=>{this._diagnostics.weatherLab.lightning.boundaryCases=!this._diagnostics.weatherLab.lightning.boundaryCases;const scenario=this._diagnostics.virtualStorm?.scenario||'off';if(scenario!=='off')this._setDiagnosticVirtualStorm(scenario);else this._syncDiagnosticWeatherLabV40802();});\n      this.shadow.getElementById('diagnostic-cluster-jump-timeout')?.addEventListener('change',(event)=>this._setStatusClusterBrowseTimeoutV40802(Number(event.target.value)));\n      this.shadow.getElementById('diagnostic-cluster-jump-end')?.addEventListener('click',()=>this._expireStatusClusterBrowseSessionV40802('manual'));\n      this.shadow.getElementById('diagnostic-cluster-render-stress')?.addEventListener('click',()=>{for(let i=0;i<20;i++)this._renderMapMarkers?.();if(this._diagnostics?.weatherLab?.lightning)this._diagnostics.weatherLab.lightning.lastStressRenders=20;this._syncDiagnosticClusterBrowseV40802();});\n`
);

replaceOnce(
  'outside storm button',
  '<button type="button" data-diagnostic-storm="off">AUS</button><button type="button" data-diagnostic-storm="observation">BEOBACHTUNG</button><button type="button" data-diagnostic-storm="storm">GEWITTER</button><button type="button" data-diagnostic-storm="danger">GEFAHR</button><button type="button" data-diagnostic-storm="all">GESAMT</button>',
  '<button type="button" data-diagnostic-storm="off">AUS</button><button type="button" data-diagnostic-storm="observation">BEOBACHTUNG</button><button type="button" data-diagnostic-storm="storm">GEWITTER</button><button type="button" data-diagnostic-storm="danger">GEFAHR</button><button type="button" data-diagnostic-storm="outside">AUSSEN</button><button type="button" data-diagnostic-storm="all">GESAMT</button>'
);

replaceOnce(
  'virtual storm centers outside',
  "      const centers={danger:Math.max(.2,Math.min(danger*.68,danger-.05)),storm:between(danger,storm,.58),observation:between(storm,observation,.58)};",
  "      const centers={danger:Math.max(.2,Math.min(danger*.68,danger-.05)),storm:between(danger,storm,.58),observation:between(storm,observation,.58),outside:observation+Math.max(1.5,observation*.18)};"
);
replaceOnce(
  'virtual storm outside spec',
  "        observation:{bearing:252,count:10,ages:[.6,1.4,3.1,6.7,11,18,31,47,68,96]}\n      };",
  "        observation:{bearing:252,count:10,ages:[.6,1.4,3.1,6.7,11,18,31,47,68,96]},\n        outside:{bearing:318,count:8,ages:[.8,1.8,3.6,7.2,14,29,54,88]}\n      };"
);
replaceOnce(
  'virtual storm lab profile',
  "      const zones=scenario==='all'?['observation','storm','danger']:[scenario],cellsPerZone=Math.max(1,Math.min(5,Math.round(Number(cellCount)||1))),zoom=Number(this._map?.getZoom?.())||7,extremeThreshold=this._clusterExtremeThreshold(zoom);",
  `      const zones=scenario==='all'?['observation','storm','danger']:[scenario],cellsPerZone=Math.max(1,Math.min(5,Math.round(Number(cellCount)||1))),zoom=Number(this._map?.getZoom?.())||7,extremeThreshold=this._clusterExtremeThreshold(zoom);\n      const lightningLab=this._diagnostics?.weatherLab?.lightning||{},densityMultiplier=[1,5,20].includes(Number(lightningLab.densityMultiplier))?Number(lightningLab.densityMultiplier):1,ageProfile=['mixed','fresh','stale'].includes(lightningLab.ageProfile)?lightningLab.ageProfile:'mixed',boundaryCases=!!lightningLab.boundaryCases;`
);
replaceOnce(
  'virtual storm outside bounds',
  "      const boundsFor=(zone)=>zone==='danger'?{low:.15,high:Math.max(.2,danger*.88)}:zone==='storm'?{low:Math.min(storm*.82,danger+Math.max(.25,(storm-danger)*.16)),high:Math.max(danger+.3,storm*.90)}:{low:Math.min(observation*.82,storm+Math.max(.35,(observation-storm)*.14)),high:Math.max(storm+.4,observation*.91)};",
  "      const boundsFor=(zone)=>zone==='danger'?{low:.15,high:Math.max(.2,danger*.88)}:zone==='storm'?{low:Math.min(storm*.82,danger+Math.max(.25,(storm-danger)*.16)),high:Math.max(danger+.3,storm*.90)}:zone==='outside'?{low:observation+Math.max(.25,observation*.025),high:observation+Math.max(3,observation*.35)}:{low:Math.min(observation*.82,storm+Math.max(.35,(observation-storm)*.14)),high:Math.max(storm+.4,observation*.91)};"
);
replaceOnce(
  'virtual storm stress count',
  "          const strikeCount=isExtreme?Math.max(spec.count,extremeThreshold+6):spec.count,freshTarget=isExtreme?extremeThreshold+2:0,tightSpread=Math.max(.025,Math.min(.24,cellCenter*.006));",
  "          const normalCount=Math.min(2000,spec.count*densityMultiplier),strikeCount=isExtreme?Math.max(normalCount,extremeThreshold+6):normalCount,freshTarget=isExtreme?extremeThreshold+2:0,tightSpread=Math.max(.025,Math.min(.24,cellCenter*.006));"
);
replaceOnce(
  'virtual storm age profile',
  "            const age=isExtreme?(i<freshTarget?(.35+(i%13)*.55):[14,34,58,92][(i-freshTarget)%4]):spec.ages[i%spec.ages.length];\n            result.push({id:`__gew_diag_storm__:${zone}:${cellIndex}:${index++}`,lat:point.lat,lon:point.lon,distance,azimuth:(bearing+360)%360,firstSeen:now-age*60000,lastSeen:now,diagnosticVirtualStorm:true,diagnosticZone:zone,diagnosticCell:cellIndex+1,diagnosticExtremeCell:isExtreme});",
  `            const mixedAge=isExtreme?(i<freshTarget?(.35+(i%13)*.55):[14,34,58,92][(i-freshTarget)%4]):spec.ages[i%spec.ages.length];\n            const age=ageProfile==='fresh'?(.15+(i%20)*.32):ageProfile==='stale'?(35+(i%24)*3.4):mixedAge;\n            result.push({id:\`__gew_diag_storm__:\${zone}:\${cellIndex}:\${index++}\`,lat:point.lat,lon:point.lon,distance,azimuth:(bearing+360)%360,firstSeen:now-age*60000,lastSeen:now,diagnosticVirtualStorm:true,diagnosticZone:zone,diagnosticCell:cellIndex+1,diagnosticExtremeCell:isExtreme,diagnosticDensityMultiplier:densityMultiplier,diagnosticAgeProfile:ageProfile});`
);
replaceOnce(
  'virtual storm boundary cases',
  "      return {strikes:result,radii:{observation,storm,danger},home,cells:cellsBuilt,extremeCells,cellCount:cellsPerZone,extreme:!!extreme,zoom,extremeThreshold};",
  `      if(boundaryCases){\n        const boundaries=[['danger',danger,14],['storm',storm,28],['observation',observation,42]];\n        for(const [name,radius,bearingBase] of boundaries){for(const [offset,label] of [[-.01,'inside'],[0,'exact'],[.01,'outside']]){const distance=Math.max(.05,radius+offset),bearing=bearingBase+(label==='inside'?-1:label==='outside'?1:0),point=this._diagnosticDestinationPoint(home.lat,home.lon,distance,bearing),age=ageProfile==='stale'?45:ageProfile==='fresh'?.25:2.5;result.push({id:\`__gew_diag_boundary__:\${name}:\${label}:\${index++}\`,lat:point.lat,lon:point.lon,distance,azimuth:(bearing+360)%360,firstSeen:now-age*60000,lastSeen:now,diagnosticVirtualStorm:true,diagnosticBoundary:name,diagnosticBoundaryPosition:label,diagnosticAgeProfile:ageProfile});}}\n      }\n      return {strikes:result,radii:{observation,storm,danger},home,cells:cellsBuilt,extremeCells,cellCount:cellsPerZone,extreme:!!extreme,zoom,extremeThreshold,densityMultiplier,ageProfile,boundaryCases};`
);
replaceOnce(
  'virtual storm outside allowed',
  "next=['off','observation','storm','danger','all'].includes(scenario)?scenario:'off'",
  "next=['off','observation','storm','danger','outside','all'].includes(scenario)?scenario:'off'"
);
replaceOnce(
  'virtual storm state lab metadata',
  "state.radii=built.radii;state.zoom=built.zoom;state.extremeThreshold=built.extremeThreshold;",
  "state.radii=built.radii;state.zoom=built.zoom;state.extremeThreshold=built.extremeThreshold;state.densityMultiplier=built.densityMultiplier;state.ageProfile=built.ageProfile;state.boundaryCases=built.boundaryCases;"
);

replaceOnce(
  'outside scenario sync',
  "const stormTitle=this.shadow?.getElementById('diagnostic-virtual-storm-title');if(stormTitle)stormTitle.textContent=this._diagnosticStormText(0);const stormIndexes={off:1,observation:2,storm:3,danger:4,all:5};this.shadow?.querySelectorAll('[data-diagnostic-storm]').forEach((button)=>{const scenario=button.dataset.diagnosticStorm;button.textContent=this._diagnosticStormText(stormIndexes[scenario]);button.classList.toggle('active',virtualStorm.scenario===scenario);button.setAttribute('aria-pressed',virtualStorm.scenario===scenario?'true':'false');});",
  "const stormTitle=this.shadow?.getElementById('diagnostic-virtual-storm-title');if(stormTitle)stormTitle.textContent=this._diagnosticStormText(0);const stormIndexes={off:1,observation:2,storm:3,danger:4,all:5};this.shadow?.querySelectorAll('[data-diagnostic-storm]').forEach((button)=>{const scenario=button.dataset.diagnosticStorm;button.textContent=scenario==='outside'?'AUSSEN':this._diagnosticStormText(stormIndexes[scenario]);button.classList.toggle('active',virtualStorm.scenario===scenario);button.setAttribute('aria-pressed',virtualStorm.scenario===scenario?'true':'false');});"
);
replaceOnce(
  'diagnostic lab ui sync',
  "      if(d.enabled){if(d.live)this._scheduleDiagnosticMeasure();else this._renderDiagnosticOverlay();}\n    }",
  `      this._syncDiagnosticWeatherLabV40802?.();this._syncDiagnosticClusterBrowseV40802?.();\n      if(d.enabled){if(d.live)this._scheduleDiagnosticMeasure();else this._renderDiagnosticOverlay();}\n    }`
);

replaceOnce(
  'cluster browse session methods',
  `    _resetStatusClusterBrowse() {\n      this._statusClusterBrowseSnapshot = [];\n      this._statusClusterBrowseActive = false;\n    }\n`,
  `    _resetStatusClusterBrowse() {\n      if(this._statusClusterBrowseTimer)clearTimeout(this._statusClusterBrowseTimer);this._statusClusterBrowseTimer=null;\n      if(this._statusClusterBrowseUiTimer)clearInterval(this._statusClusterBrowseUiTimer);this._statusClusterBrowseUiTimer=null;\n      this._statusClusterBrowseSnapshot = [];\n      this._statusClusterBrowseActive = false;\n      this._statusClusterBrowseLastInteraction = 0;\n      this._syncDiagnosticClusterBrowseV40802?.();\n    }\n\n    _setStatusClusterBrowseTimeoutV40802(timeoutMs) {\n      const next=[0,5000,10000,20000].includes(Number(timeoutMs))?Number(timeoutMs):10000;this._statusClusterBrowseTimeoutMs=next;try{localStorage.setItem('gewitterradar:v40802:cluster-jump-timeout',String(next));}catch(_error){}\n      if(this._statusClusterBrowseActive)this._touchStatusClusterBrowseSessionV40802();else this._syncDiagnosticClusterBrowseV40802?.();\n    }\n\n    _touchStatusClusterBrowseSessionV40802() {\n      if(!this._statusClusterBrowseActive)return;this._statusClusterBrowseLastInteraction=Date.now();\n      if(this._statusClusterBrowseTimer)clearTimeout(this._statusClusterBrowseTimer);this._statusClusterBrowseTimer=null;\n      const timeout=Number(this._statusClusterBrowseTimeoutMs)||0;if(timeout>0)this._statusClusterBrowseTimer=setTimeout(()=>this._expireStatusClusterBrowseSessionV40802('timeout'),timeout);\n      if(this._statusClusterBrowseUiTimer)clearInterval(this._statusClusterBrowseUiTimer);this._statusClusterBrowseUiTimer=null;if(this._diagnostics?.enabled)this._statusClusterBrowseUiTimer=setInterval(()=>this._syncDiagnosticClusterBrowseV40802?.(),250);\n      this._syncDiagnosticClusterBrowseV40802?.();\n    }\n\n    _expireStatusClusterBrowseSessionV40802(reason='timeout') {\n      const wasActive=!!this._statusClusterBrowseActive;this._resetStatusClusterBrowse();this._statusFocusIndex=-1;this._statusFocusSelectedId=null;\n      if(this._diagnostics?.weatherLab)this._diagnostics.weatherLab.lastClusterBrowseEndReason=reason;\n      if(wasActive){this._renderMapMarkers?.();this._render?.();}\n      this._syncDiagnosticClusterBrowseV40802?.();\n    }\n`
);

replaceOnce(
  'cluster browse touch',
  `            this._statusClusterBrowseActive = true;\n          }\n          list = this._statusClusterBrowseSnapshot;`,
  `            this._statusClusterBrowseActive = true;\n          }\n          this._touchStatusClusterBrowseSessionV40802?.();\n          list = this._statusClusterBrowseSnapshot;`
);

replaceOnce(
  'diagnostic hard stop lab cleanup',
  "      this._setDiagnosticVirtualStorm('off',{sync:false,render:false});\n      if(this._diagnostics.virtualStorm){this._diagnostics.virtualStorm.cellCount=1;this._diagnostics.virtualStorm.extreme=false;this._diagnostics.virtualStorm.cells=0;this._diagnostics.virtualStorm.extremeCells=0;}\n",
  `      this._setDiagnosticVirtualStorm('off',{sync:false,render:false});\n      if(this._diagnostics.virtualStorm){this._diagnostics.virtualStorm.cellCount=1;this._diagnostics.virtualStorm.extreme=false;this._diagnostics.virtualStorm.cells=0;this._diagnostics.virtualStorm.extremeCells=0;}\n      if(this._statusClusterBrowseUiTimer)clearInterval(this._statusClusterBrowseUiTimer);this._statusClusterBrowseUiTimer=null;\n      if(this._diagnostics.weatherLab?.lightning){this._diagnostics.weatherLab.lightning.densityMultiplier=1;this._diagnostics.weatherLab.lightning.ageProfile='mixed';this._diagnostics.weatherLab.lightning.boundaryCases=false;this._diagnostics.weatherLab.lightning.lastStressRenders=0;}\n`
);

for (const required of [
  "const CARD_VERSION = '4.08.02';",
  'diagnostic-lab-group',
  'diagnostic-lab-density',
  'diagnostic-lab-age',
  'diagnostic-lab-boundaries',
  'diagnostic-cluster-jump-timeout',
  '_touchStatusClusterBrowseSessionV40802',
  '_expireStatusClusterBrowseSessionV40802',
  'diagnosticBoundaryPosition',
  "outside:{bearing:318",
  "precipitation:{prepared:true",
  "clouds:{prepared:true",
  '_statusClusterBrowseSnapshot',
  '_statusFocusIndex'
]) {
  if (!card.includes(required)) throw new Error(`V4.08.02 guard missing after transform: ${required}`);
}

await writeFile(sourcePath, card, 'utf8');
await copyFile(sourcePath, integrationPath);
await copyFile(sourcePath, dashboardPath);

console.log(`V4.08.02 frontend built: ${Buffer.byteLength(card)} bytes`);
console.log(`SHA256 ${sha256(card)}`);
console.log('Diagnostic Weather Lab: accordion cockpit, 1x/5x/20x load, age profiles, radius boundaries, outside zone');
console.log('Cluster browser session: configurable 5s/10s/20s/infinite inactivity timeout + manual stop + 20x render stress');
console.log('Future weather architecture prepared: organic precipitation scalar field + layered cloud density field');
