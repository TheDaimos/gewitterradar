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
const INPUT_SHA256 = 'fe71f1c5a5c432bace0ebf7b85baa49110c1800ee00c2e964ca5b6316550d092';
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
let card = await readFile(sourcePath, 'utf8');
if (sha256(card) !== INPUT_SHA256) throw new Error(`V4.08.02 pass2 refuses unknown input: ${sha256(card)}`);
function replaceOnce(label, needle, replacement) {
  const first = card.indexOf(needle);
  if (first < 0) throw new Error(`Missing pass2 anchor: ${label}`);
  if (card.indexOf(needle, first + needle.length) >= 0) throw new Error(`Non-unique pass2 anchor: ${label}`);
  card = card.slice(0, first) + replacement + card.slice(first + needle.length);
}

replaceOnce(
  'weather lab state patterns',
  "lightning:{densityMultiplier:1,ageProfile:'mixed',boundaryCases:false,lastStressRenders:0}",
  "lightning:{densityMultiplier:1,ageProfile:'mixed',pattern:'standard',boundaryCases:false,lastStressRenders:0,stressSerial:0,lastStressAction:'none'}"
);

replaceOnce(
  'weather lab pattern ui',
  '<label class="diagnostic-lab-field">Alter <select id="diagnostic-lab-age"><option value="mixed">gemischt</option><option value="fresh">nur frisch</option><option value="stale">nur alt</option></select></label>\n          <button id="diagnostic-lab-boundaries" type="button" aria-pressed="false">Radius-Grenzen</button>',
  '<label class="diagnostic-lab-field">Alter <select id="diagnostic-lab-age"><option value="mixed">gemischt</option><option value="fresh">nur frisch</option><option value="stale">nur alt</option></select></label>\n          <label class="diagnostic-lab-field">Raumform <select id="diagnostic-lab-pattern"><option value="standard">Standard</option><option value="compact">Kompakt</option><option value="wide">Breit</option><option value="line">Linie</option><option value="ring">Ring</option><option value="overlap">Überlappend</option><option value="duplicate">Doppelpunkt</option></select></label>\n          <button id="diagnostic-lab-boundaries" type="button" aria-pressed="false">Radius-Grenzen</button>\n          <button id="diagnostic-lab-split-merge" type="button">Split/Merge ×10</button>\n          <button id="diagnostic-lab-danger-burst" type="button">Gefahr-Burst</button>\n          <button id="diagnostic-lab-new-cells" type="button">Neue Zellen</button>'
);

replaceOnce(
  'weather lab sync fields',
  "const density=this.shadow?.getElementById('diagnostic-lab-density'),age=this.shadow?.getElementById('diagnostic-lab-age'),boundaries=this.shadow?.getElementById('diagnostic-lab-boundaries'),state=this.shadow?.getElementById('diagnostic-weather-lab-state');\n      if(density)density.value=String(lightning.densityMultiplier||1);if(age)age.value=lightning.ageProfile||'mixed';",
  "const density=this.shadow?.getElementById('diagnostic-lab-density'),age=this.shadow?.getElementById('diagnostic-lab-age'),pattern=this.shadow?.getElementById('diagnostic-lab-pattern'),boundaries=this.shadow?.getElementById('diagnostic-lab-boundaries'),state=this.shadow?.getElementById('diagnostic-weather-lab-state');\n      if(density)density.value=String(lightning.densityMultiplier||1);if(age)age.value=lightning.ageProfile||'mixed';if(pattern)pattern.value=lightning.pattern||'standard';"
);
replaceOnce(
  'weather lab sync text',
  "if(state)state.textContent=`Blitze/Cluster aktiv · Last ${lightning.densityMultiplier||1}× · Alter ${lightning.ageProfile||'mixed'} · Grenzen ${lightning.boundaryCases?'EIN':'AUS'}\\nNiederschlag: vorbereitet (organisches Intensitätsfeld) · Wolken: vorbereitet (Dichtefeld)`;",
  "if(state)state.textContent=`Blitze/Cluster aktiv · Last ${lightning.densityMultiplier||1}× · Alter ${lightning.ageProfile||'mixed'} · Form ${lightning.pattern||'standard'} · Grenzen ${lightning.boundaryCases?'EIN':'AUS'}\\nStress: ${lightning.lastStressAction||'none'} · Niederschlag vorbereitet · Wolken vorbereitet`;"
);

replaceOnce(
  'weather lab pattern controls',
  "this.shadow.getElementById('diagnostic-lab-age')?.addEventListener('change',(event)=>{const value=['mixed','fresh','stale'].includes(event.target.value)?event.target.value:'mixed';this._diagnostics.weatherLab.lightning.ageProfile=value;const scenario=this._diagnostics.virtualStorm?.scenario||'off';if(scenario!=='off')this._setDiagnosticVirtualStorm(scenario);else this._syncDiagnosticWeatherLabV40802();});\n      this.shadow.getElementById('diagnostic-lab-boundaries')?.addEventListener('click',()=>{",
  "this.shadow.getElementById('diagnostic-lab-age')?.addEventListener('change',(event)=>{const value=['mixed','fresh','stale'].includes(event.target.value)?event.target.value:'mixed';this._diagnostics.weatherLab.lightning.ageProfile=value;const scenario=this._diagnostics.virtualStorm?.scenario||'off';if(scenario!=='off')this._setDiagnosticVirtualStorm(scenario);else this._syncDiagnosticWeatherLabV40802();});\n      this.shadow.getElementById('diagnostic-lab-pattern')?.addEventListener('change',(event)=>{const allowed=['standard','compact','wide','line','ring','overlap','duplicate'];this._diagnostics.weatherLab.lightning.pattern=allowed.includes(event.target.value)?event.target.value:'standard';const scenario=this._diagnostics.virtualStorm?.scenario||'off';if(scenario!=='off')this._setDiagnosticVirtualStorm(scenario);else this._syncDiagnosticWeatherLabV40802();});\n      this.shadow.getElementById('diagnostic-lab-split-merge')?.addEventListener('click',()=>this._diagnosticClusterSplitMergeStressV40802?.());\n      this.shadow.getElementById('diagnostic-lab-danger-burst')?.addEventListener('click',()=>this._diagnosticInjectStressCellV40802?.('danger'));\n      this.shadow.getElementById('diagnostic-lab-new-cells')?.addEventListener('click',()=>{this._diagnosticInjectStressCellV40802?.('observation');this._diagnosticInjectStressCellV40802?.('outside');});\n      this.shadow.getElementById('diagnostic-lab-boundaries')?.addEventListener('click',()=>{"
);

replaceOnce(
  'weather lab generator pattern state',
  "const lightningLab=this._diagnostics?.weatherLab?.lightning||{},densityMultiplier=[1,5,20].includes(Number(lightningLab.densityMultiplier))?Number(lightningLab.densityMultiplier):1,ageProfile=['mixed','fresh','stale'].includes(lightningLab.ageProfile)?lightningLab.ageProfile:'mixed',boundaryCases=!!lightningLab.boundaryCases;",
  "const lightningLab=this._diagnostics?.weatherLab?.lightning||{},densityMultiplier=[1,5,20].includes(Number(lightningLab.densityMultiplier))?Number(lightningLab.densityMultiplier):1,ageProfile=['mixed','fresh','stale'].includes(lightningLab.ageProfile)?lightningLab.ageProfile:'mixed',pattern=['standard','compact','wide','line','ring','overlap','duplicate'].includes(lightningLab.pattern)?lightningLab.pattern:'standard',boundaryCases=!!lightningLab.boundaryCases;"
);
replaceOnce(
  'weather lab pattern cell bearing',
  "const isExtreme=!!extreme&&cellIndex===cellsPerZone-1,baseCenter=centers[zone],cellCenter=Math.max(bounds.low,Math.min(bounds.high,baseCenter*(1+radialOffsets[cellIndex]))),cellBearing=(spec.bearing+bearingOffsets[cellIndex])%360;",
  "const isExtreme=!!extreme&&cellIndex===cellsPerZone-1,baseCenter=centers[zone],cellCenter=Math.max(bounds.low,Math.min(bounds.high,baseCenter*(1+radialOffsets[cellIndex]))),cellBearing=(pattern==='overlap'?spec.bearing:(spec.bearing+bearingOffsets[cellIndex]))%360;"
);
replaceOnce(
  'weather lab spatial generator',
  "const clustered=i<Math.max(4,strikeCount-2),ring=clustered?((i%7)-3)*(tightSpread/3):Math.max(.55,cellCenter*.065)*(i%2?1:-1),bearing=cellBearing+(clustered?((i%11)-5)*.08:(i%2?19:-23)),distance=Math.max(.12,Math.min(bounds.high,Math.max(bounds.low,cellCenter+ring))),point=this._diagnosticDestinationPoint(home.lat,home.lon,distance,bearing);",
  "const clustered=i<Math.max(4,strikeCount-2),baseRing=clustered?((i%7)-3)*(tightSpread/3):Math.max(.55,cellCenter*.065)*(i%2?1:-1),baseBearingOffset=clustered?((i%11)-5)*.08:(i%2?19:-23);\n            let ring=baseRing,bearing=cellBearing+baseBearingOffset;\n            if(pattern==='compact'){ring*=.25;bearing=cellBearing+baseBearingOffset*.22;}\n            else if(pattern==='wide'){ring*=3.4;bearing=cellBearing+baseBearingOffset*2.8+((i%9)-4)*1.1;}\n            else if(pattern==='line'){ring=((i%31)-15)*Math.max(tightSpread*.42,.035);bearing=cellBearing+((i%5)-2)*.05;}\n            else if(pattern==='ring'){ring=((i%3)-1)*tightSpread*.18;bearing=cellBearing-10+(i%29)*(20/28);}\n            else if(pattern==='overlap'){ring*=.48;bearing=cellBearing+baseBearingOffset*.35;}\n            else if(pattern==='duplicate'){ring=(i%4===0)?0:baseRing*.18;bearing=(i%4===0)?cellBearing:cellBearing+baseBearingOffset*.16;}\n            const distance=Math.max(.12,Math.min(bounds.high,Math.max(bounds.low,cellCenter+ring))),point=this._diagnosticDestinationPoint(home.lat,home.lon,distance,bearing);"
);
replaceOnce(
  'weather lab pattern strike metadata',
  "diagnosticDensityMultiplier:densityMultiplier,diagnosticAgeProfile:ageProfile});",
  "diagnosticDensityMultiplier:densityMultiplier,diagnosticAgeProfile:ageProfile,diagnosticPattern:pattern});"
);
replaceOnce(
  'weather lab return pattern',
  "extremeThreshold,densityMultiplier,ageProfile,boundaryCases};",
  "extremeThreshold,densityMultiplier,ageProfile,pattern,boundaryCases};"
);
replaceOnce(
  'weather lab state pattern metadata',
  "state.densityMultiplier=built.densityMultiplier;state.ageProfile=built.ageProfile;state.boundaryCases=built.boundaryCases;",
  "state.densityMultiplier=built.densityMultiplier;state.ageProfile=built.ageProfile;state.pattern=built.pattern;state.boundaryCases=built.boundaryCases;"
);

replaceOnce(
  'cluster browser richer telemetry',
  "node.textContent=active?`AKTIV · ${index}/${total} · N eingefroren ${total} · Rest ${remaining}\\nID ${this._statusFocusSelectedId||'—'}`:`INAKTIV · Live-Cluster ${total} · nächster Sprung startet neue Sitzung`;",
  "const zoom=Number(this._map?.getZoom?.())||0,policy=this._clusterV40801Enabled?.()?'V4.08':'V4.07.56',selected=(this._renderedMapClusters||[]).find((cluster)=>cluster?.id===this._statusFocusSelectedId);\n      const detail=selected?` · Cluster ${selected.count||selected.items?.length||'?'} · ${Number(selected.distance||0).toFixed(1)} km`:'';\n      node.textContent=active?`AKTIV · ${index}/${total} · N eingefroren ${total} · Rest ${remaining}\\nZoom ${zoom} · Policy ${policy} · ID ${this._statusFocusSelectedId||'—'}${detail}`:`INAKTIV · Live-Cluster ${total} · Zoom ${zoom} · Policy ${policy} · nächster Sprung startet neue Sitzung`;"
);

replaceOnce(
  'stress helper insertion',
  "    _setDiagnosticVirtualStorm(scenario,{sync=true,render=true}={}) {",
  `    _diagnosticInjectStressCellV40802(zone='danger') {
      const d=this._diagnostics,lab=d?.weatherLab?.lightning,state=d?.virtualStorm;if(!d?.enabled||!lab||!state)return;
      const built=this._buildDiagnosticVirtualStorm(zone,{cellCount:1,extreme:zone==='danger'}),serial=++lab.stressSerial,limit=zone==='danger'?Math.min(40,built.strikes.length):Math.min(24,built.strikes.length);
      for(let i=0;i<limit;i++){const source=built.strikes[i],id=\`__gew_diag_stress__:\${zone}:\${serial}:\${i}\`,strike={...source,id,diagnosticStress:true,diagnosticStressSerial:serial};this._strikes.set(id,strike);state.ownedIds.push(id);}
      state.count=(state.ownedIds||[]).length;lab.lastStressAction=zone==='danger'?\`Gefahr-Burst \${limit}\`:\`Neue Zelle \${zone} \${limit}\`;this._render();this._renderMapMarkers?.();this._syncDiagnosticUi();
    }

    _diagnosticClusterSplitMergeStressV40802() {
      const d=this._diagnostics,lab=d?.weatherLab?.lightning,state=d?.virtualStorm;if(!d?.enabled||!lab||!state||state.scenario==='off')return;
      const original=lab.pattern||'standard';for(let i=0;i<10;i++){lab.pattern=i%2===0?'compact':'wide';this._setDiagnosticVirtualStorm(state.scenario,{sync:false,render:false});this._renderMapMarkers?.();}
      lab.pattern=original;this._setDiagnosticVirtualStorm(state.scenario,{sync:false,render:true});lab.lastStressAction='Split/Merge ×10';this._syncDiagnosticUi();
    }

    _setDiagnosticVirtualStorm(scenario,{sync=true,render=true}={}) {`
);

replaceOnce(
  'hard stop extended stress reset',
  "this._diagnostics.weatherLab.lightning.densityMultiplier=1;this._diagnostics.weatherLab.lightning.ageProfile='mixed';this._diagnostics.weatherLab.lightning.boundaryCases=false;this._diagnostics.weatherLab.lightning.lastStressRenders=0;",
  "this._diagnostics.weatherLab.lightning.densityMultiplier=1;this._diagnostics.weatherLab.lightning.ageProfile='mixed';this._diagnostics.weatherLab.lightning.pattern='standard';this._diagnostics.weatherLab.lightning.boundaryCases=false;this._diagnostics.weatherLab.lightning.lastStressRenders=0;this._diagnostics.weatherLab.lightning.stressSerial=0;this._diagnostics.weatherLab.lightning.lastStressAction='none';"
);

for (const marker of [
  'diagnostic-lab-pattern', 'Split/Merge ×10', 'Gefahr-Burst', 'Neue Zellen',
  "pattern=['standard'", "pattern==='compact'", "pattern==='wide'", "pattern==='line'", "pattern==='ring'", "pattern==='overlap'", "pattern==='duplicate'",
  '_diagnosticInjectStressCellV40802', '_diagnosticClusterSplitMergeStressV40802', 'diagnosticPattern:pattern', 'Policy ${policy}'
]) if (!card.includes(marker)) throw new Error(`Missing pass2 result marker: ${marker}`);

await writeFile(sourcePath, card, 'utf8');
await copyFile(sourcePath, integrationPath);
await copyFile(sourcePath, dashboardPath);
console.log(`V4.08.02 diagnostic lab pass2 built: ${Buffer.byteLength(card)} bytes`);
console.log(`SHA256 ${sha256(card)}`);
console.log('Patterns: standard, compact, wide, line, ring, overlap, duplicate');
console.log('Stress: split/merge x10, danger burst, new observation+outside cells');
