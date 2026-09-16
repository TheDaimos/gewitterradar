#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { copyFile, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');
const sourcePath = path.join(root, 'frontend', 'gewitterradar.js');
const integrationPath = path.join(root, 'custom_components', 'gewitterradar', 'frontend', 'gewitterradar.js');
const dashboardPath = path.join(root, 'dashboard', 'dist', 'gewitterradar.js');

const BASE_SHA256 = '249485f4bcf68c9b23b821cae9b507030ae09cff5a56f7e28d3d7f3b02eb4a1a';
const BASE_SIZE = 1955141;

const sha256 = (value) => createHash('sha256').update(value).digest('hex');

let card = await readFile(sourcePath, 'utf8');
const baseBytes = Buffer.byteLength(card);
const baseHash = sha256(card);
if (baseBytes !== BASE_SIZE || baseHash !== BASE_SHA256) {
  throw new Error(`V4.08.01 builder refuses unknown frontend base: ${baseBytes} bytes / ${baseHash}`);
}

function replaceOnce(label, needle, replacement) {
  const first = card.indexOf(needle);
  if (first < 0) throw new Error(`Missing V4.08.01 anchor: ${label}`);
  if (card.indexOf(needle, first + needle.length) >= 0) throw new Error(`Non-unique V4.08.01 anchor: ${label}`);
  card = card.slice(0, first) + replacement + card.slice(first + needle.length);
}

replaceOnce(
  'header version',
  '/* Gewitterradar Card V4.07.56 – Diagnose-Erweiterung: Mehrzellen- und Extremtest auf Basis des abgenommenen V4.07.54 Produktstands.',
  '/* Gewitterradar Card V4.08.01 TEST – zonenabhängige Cluster-Auflösung auf Basis des unveränderten V4.07.56 Golden Masters.'
);
replaceOnce("CARD_VERSION", "const CARD_VERSION = '4.07.56';", "const CARD_VERSION = '4.08.01';");
replaceOnce("CARD_DISPLAY_VERSION", "const CARD_DISPLAY_VERSION = '4.07.56';", "const CARD_DISPLAY_VERSION = '4.08.01';");
replaceOnce("GEWITTERRADAR_BUILD", "const GEWITTERRADAR_BUILD = 'V4.07-TEST56-2026-09-16';", "const GEWITTERRADAR_BUILD = 'V4.08.01-CLUSTER-TEST-2026-09-16';");

replaceOnce(
  'cluster policy state',
  '      this._showMainRadii = this._showMainRadii ?? false;\n',
  `      this._showMainRadii = this._showMainRadii ?? false;\n\n      // V4.08.01 TEST – Vergleichsschalter bleibt bewusst lokal im Browser.\n      // OFF = exakt die V4.07.56-Auflösung; ON = zonenabhängige Testlogik.\n      if (this._clusterPolicyV40801 == null) {\n        try {\n          this._clusterPolicyV40801 = localStorage.getItem('gewitterradar:v40801:cluster-policy') === 'zoned' ? 'zoned' : 'legacy';\n        } catch (_error) {\n          this._clusterPolicyV40801 = 'legacy';\n        }\n      }\n`
);

const radiiToggleNeedle = `                  <div class=\"settings-row settings-radius-main-toggle-row\">\n                    <div class=\"settings-row-label\">\n                      Radien in Hauptansicht anzeigen\n                    </div>\n                    <button class=\"settings-switch\" id=\"settings-radii-toggle\" type=\"button\"\n                            role=\"switch\" aria-checked=\"false\" aria-label=\"Radien in Hauptansicht anzeigen\"></button>\n                  </div>\n\n                  <div class=\"settings-radius observation\">`;
const radiiToggleReplacement = `                  <div class=\"settings-row settings-radius-main-toggle-row\">\n                    <div class=\"settings-row-label\">\n                      Radien in Hauptansicht anzeigen\n                    </div>\n                    <button class=\"settings-switch\" id=\"settings-radii-toggle\" type=\"button\"\n                            role=\"switch\" aria-checked=\"false\" aria-label=\"Radien in Hauptansicht anzeigen\"></button>\n                  </div>\n\n                  <div class=\"settings-row settings-radius-main-toggle-row\">\n                    <div class=\"settings-row-label\">\n                      <div>Cluster-Auflösung · V4.08.01 TEST</div>\n                      <div style=\"font-size:.76rem;opacity:.68;margin-top:3px\">AUS: V4.07.56 · EIN: zonenabhängig</div>\n                    </div>\n                    <button class=\"settings-switch\" id=\"settings-cluster-v40801-toggle\" type=\"button\"\n                            role=\"switch\" aria-checked=\"false\" aria-label=\"Zonenabhängige Cluster-Auflösung V4.08.01 testen\"></button>\n                  </div>\n\n                  <div class=\"settings-radius observation\">`;
replaceOnce('radii settings test toggle', radiiToggleNeedle, radiiToggleReplacement);

replaceOnce(
  'settings toggle lookup',
  "      const settingsRadiiToggle = this.shadow.getElementById('settings-radii-toggle');\n",
  "      const settingsRadiiToggle = this.shadow.getElementById('settings-radii-toggle');\n      const settingsClusterV40801Toggle = this.shadow.getElementById('settings-cluster-v40801-toggle');\n"
);

replaceOnce(
  'settings toggle synchronisation',
  `      const settingsRadiiToggle = $('settings-radii-toggle');\n      settingsRadiiToggle?.classList.toggle('on',this._showMainRadii);\n      settingsRadiiToggle?.setAttribute('aria-checked',this._showMainRadii ? 'true' : 'false');\n      $('card-root')?.classList.toggle('radii-visible',this._showMainRadii);\n`,
  `      const settingsRadiiToggle = $('settings-radii-toggle');\n      settingsRadiiToggle?.classList.toggle('on',this._showMainRadii);\n      settingsRadiiToggle?.setAttribute('aria-checked',this._showMainRadii ? 'true' : 'false');\n      $('card-root')?.classList.toggle('radii-visible',this._showMainRadii);\n\n      const settingsClusterV40801Toggle = $('settings-cluster-v40801-toggle');\n      const clusterV40801Enabled = this._clusterPolicyV40801 === 'zoned';\n      settingsClusterV40801Toggle?.classList.toggle('on',clusterV40801Enabled);\n      settingsClusterV40801Toggle?.setAttribute('aria-checked',clusterV40801Enabled ? 'true' : 'false');\n`
);

replaceOnce(
  'settings toggle click handler',
  `      settingsRadiiToggle?.addEventListener('click',() => {\n        this._showMainRadii = !this._showMainRadii;\n        const root = this.shadow.getElementById('card-root');\n        root?.classList.toggle('radii-visible',this._showMainRadii);\n        settingsRadiiToggle.classList.toggle('on',this._showMainRadii);\n        settingsRadiiToggle.setAttribute('aria-checked',this._showMainRadii ? 'true' : 'false');\n      });\n`,
  `      settingsRadiiToggle?.addEventListener('click',() => {\n        this._showMainRadii = !this._showMainRadii;\n        const root = this.shadow.getElementById('card-root');\n        root?.classList.toggle('radii-visible',this._showMainRadii);\n        settingsRadiiToggle.classList.toggle('on',this._showMainRadii);\n        settingsRadiiToggle.setAttribute('aria-checked',this._showMainRadii ? 'true' : 'false');\n      });\n\n      settingsClusterV40801Toggle?.addEventListener('click',() => {\n        this._clusterPolicyV40801 = this._clusterPolicyV40801 === 'zoned' ? 'legacy' : 'zoned';\n        const enabled = this._clusterPolicyV40801 === 'zoned';\n        try {\n          localStorage.setItem('gewitterradar:v40801:cluster-policy',this._clusterPolicyV40801);\n        } catch (_error) {}\n        settingsClusterV40801Toggle.classList.toggle('on',enabled);\n        settingsClusterV40801Toggle.setAttribute('aria-checked',enabled ? 'true' : 'false');\n        // Ein bewusster Policy-Wechsel startet eine neue Browser-Sitzung; normale\n        // Renderzyklen dürfen den eingefrorenen Cluster-Jump dagegen nicht zurücksetzen.\n        this._resetStatusClusterBrowse?.();\n        this._renderMapMarkers?.();\n      });\n`
);

replaceOnce(
  'cluster resolution policy',
  `      for (const s of allHistory) {\n        const inDanger = s.distance != null && s.distance <= dangerRadius;\n        const inObservation = s.distance != null && s.distance <= observationRadius;\n        if (inDanger || (inObservation && zoom >= 8) || (!inObservation && zoom >= 12)) individual.push(s);\n        else clusterCandidates.push({ strike:s,inObservation });\n      }\n`,
  `      // V4.08.01 TEST – die bisherige V4.07.56-Policy bleibt als direkter\n      // Vergleich erhalten. Die neue Policy benutzt erstmals alle drei Radien:\n      // Gefahr = immer Einzelblitz; Gewitter = Cluster bis Zoom 9; äußerer\n      // Beobachtungsbereich = Cluster bis Zoom 11; außerhalb unverändert.\n      // Damit bleibt ein per Cluster-Browser fokussierter Cluster auf dessen\n      // bisherigem Fokus-Zoom <= 9 tatsächlich als Cluster existent.\n      const useZonedClusterResolution = this._clusterPolicyV40801 === 'zoned';\n      for (const s of allHistory) {\n        const inDanger = s.distance != null && s.distance <= dangerRadius;\n        const inStorm = s.distance != null && s.distance <= stormRadius;\n        const inObservation = s.distance != null && s.distance <= observationRadius;\n        const renderIndividual = useZonedClusterResolution\n          ? (inDanger || (inStorm && zoom >= 10) || (inObservation && zoom >= 12) || (!inObservation && zoom >= 12))\n          : (inDanger || (inObservation && zoom >= 8) || (!inObservation && zoom >= 12));\n        if (renderIndividual) individual.push(s);\n        else clusterCandidates.push({ strike:s,inObservation });\n      }\n`
);

// Guardrails: the cluster browser session must remain render-independent.
for (const required of [
  '_statusClusterBrowseSnapshot',
  '_statusClusterBrowseIndex',
  '_resetStatusClusterBrowse()',
  'stabile Weltpixel-ID wiedergefunden'
]) {
  if (!card.includes(required)) throw new Error(`V4.08.01 browser guard missing after transform: ${required}`);
}

await writeFile(sourcePath, card, 'utf8');
await copyFile(sourcePath, integrationPath);
await copyFile(sourcePath, dashboardPath);

const resultHash = sha256(card);
console.log(`V4.08.01 frontend built: ${Buffer.byteLength(card)} bytes`);
console.log(`SHA256 ${resultHash}`);
console.log('Cluster test policy: legacy OFF / zoned ON');
console.log('Zoned thresholds: danger=individual; storm>=z10 individual; observation>=z12 individual; outside>=z12 individual');
