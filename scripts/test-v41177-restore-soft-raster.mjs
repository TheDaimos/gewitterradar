// V4.11.77: exakt abgenommenes V4.11.75-CSS-Profil wiederherstellen.
// V4.11.76 nutzte einen SVG-Filter: auf dem iPad wurde Weich sichtbar
// ungeglättet. CSS.supports und style.filter pruefen keine Bildausgabe.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {weatherDisplayAutoRasterTuning,weatherDisplaySoftRasterTuning,weatherDisplayBalancedRasterTuning} from '../frontend/modules/weather/display-menu.js';

const source=await readFile(new URL('../frontend/modules/weather/display-menu.js',import.meta.url),'utf8');
const expected75Sha256='18d22470b2a0acdf3e2daacf74a363bdfb5076334a4e232c953a4a3eb325309a';
const normalized=source.replace('version:"0.4.14"','version:"0.4.12"');
assert.notEqual(normalized,source,'V4.11.77 Modulversion fehlt');
assert.equal(createHash('sha256').update(normalized).digest('hex'),expected75Sha256,
 'Die gesamte produktive Weich-Darstellung muss exakt der V4.11.75-Quelle entsprechen');
assert.match(source,/pane\.style\.filter="blur\("/,'CSS-Pane-Glättung muss wieder aktiv sein');
assert.doesNotMatch(source,/_weatherDisplayEnsureSoftFilter|feGaussianBlur|feComposite|url\(#gr-weather-soft/,
 'Unsicherer SVG-Filter darf nicht aktiv sein');
assert.doesNotMatch(source,/setInterval\(/,'Keine zusätzliche Render-Schleife');
for(const nativeZoom of [5,6,7,8,9,10,11]){
 const base=weatherDisplayAutoRasterTuning(6,nativeZoom);
 assert.deepEqual(weatherDisplaySoftRasterTuning(8,nativeZoom),base,'Zoom 8 unverändert');
 for(const zoom of [9,10]){
  const now=weatherDisplaySoftRasterTuning(zoom,nativeZoom);
  assert.equal(now.multiscale,undefined,'Keine neue Mischung');
  assert.ok(now.blur<=Math.max(48,base.blur)+1e-9,'Bisheriges Leistungsbudget');
 }
}
assert.equal(weatherDisplayBalancedRasterTuning(9,7).blur,11.2);
assert.equal(weatherDisplayAutoRasterTuning(10,7).blur,220);
console.log('PASS: V4.11.77 wiederhergestellter V4.11.75-CSS-Filter ohne SVG; altes Filterbudget erhalten.');
