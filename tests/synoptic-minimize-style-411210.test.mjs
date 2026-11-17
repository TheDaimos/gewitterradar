import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../frontend/modules/weather/synoptic-display.js',import.meta.url),'utf8');
const wind=readFileSync(new URL('../frontend/modules/weather/premium-ui.js',import.meta.url),'utf8');
test('Synoptic minimize reuses wind-sized premium button and keeps header controls intact',()=>{
 assert.match(wind,/\.weather-wind-panel:not\(\.embedded\)>header\.weather-display-panel-head \.gr-premium-panel-actions>button\.weather-display-minimize/);
 assert.match(source,/\.weather-synoptic-panel>header \.gr-premium-panel-actions>button\.weather-display-minimize\{[^\n]*width:40px!important;min-width:40px!important;height:30px!important;min-height:30px!important;[^\n]*border-radius:8px!important/);
 assert.match(source,/premiumAction\('minimize',t\('minimize'\),'minimize'\)/);
 assert.match(source,/if\(button\.dataset\.premiumAction==='minimize'\)togglePremiumPanel\(panel,'synoptic-settings'\)/);
 assert.match(source,/class="gr-premium-action weather-synoptic-close" data-premium-action="close"/);
 assert.match(source,/bindPremiumPanelDrag\(panel,[^\n]*\{touch:true\}\)/);
});
