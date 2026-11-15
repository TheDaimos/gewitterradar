import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

for (const root of ['frontend', 'dashboard/dist', 'custom_components/gewitterradar/frontend']) {
  const text = readFileSync(`${root}/modules/weather/wind-display.js`, 'utf8');
  const performance = text.indexOf('<details><summary>Performance-Diagnose</summary>');
  const status = text.indexOf('class="weather-wind-source-status"');
  const refresh = text.indexOf('>Winddaten jetzt aktualisieren</button>');
  assert(performance >= 0 && status > performance && refresh > status, `${root}: wind status and refresh must follow final menu section`);
  assert(text.includes("${s.field?'Numerisches WR-Windfeld':'WR-Windpunktdaten'}"), `${root}: descriptive status label`);
  assert(text.includes('data-wind-action="refresh"'), `${root}: retain existing refresh dispatch`);
  assert(!text.includes('>WR-Wind aktualisieren</button>'), `${root}: obsolete refresh wording`);
}
console.log('PASS: Winddaten-Status und Aktualisieren am Menüende; Labels und Refresh-Aktion in allen drei Lieferungen identisch.');
