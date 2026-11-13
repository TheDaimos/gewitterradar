import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read = path => readFileSync(new URL('../'+path,import.meta.url),'utf8');
const synoptic=read('frontend/modules/weather/synoptic-display.js');
const premium=read('frontend/modules/weather/premium-ui.js');
const wind=read('frontend/modules/weather/wind-display.js');
const display=read('frontend/modules/weather/display-menu.js');

test('P1 round Synoptic close uses exactly the established shared Hi-Res original and touch target',()=>{
 assert.match(premium,/PREMIUM_CLOSE=new URL\('\.\.\/\.\.\/assets\/gewitterradar-about-close-premium\.webp'/);
 assert.match(wind,/deps\.ABOUT_CLOSE_IMAGE/);
 assert.match(display,/deps\.ABOUT_CLOSE_IMAGE/);
 assert.match(synoptic,/class="gr-premium-action weather-synoptic-close" data-premium-action="close"/);
 assert.match(synoptic,/esc\(deps\.ABOUT_CLOSE_IMAGE\|\|PREMIUM_CLOSE\)/);
 assert.match(synoptic,/\.weather-synoptic-panel>header \.weather-synoptic-close\{[^\n]*width:44px;height:44px;[^\n]*border-radius:50%!important/);
 assert.match(synoptic,/\.weather-synoptic-panel>header \.weather-synoptic-close img\{[^\n]*width:34px!important;height:34px!important;[^\n]*pointer-events:none/);
});

test('Synoptic close tap is still routed through the existing panel listener and preserves menu controls',()=>{
 assert.match(synoptic,/panel\.addEventListener\('click',event=>\{/);
 assert.match(synoptic,/if\(button\.dataset\.premiumAction==='close'\)this\._weatherSynopticClose\(\)/);
 assert.match(synoptic,/_weatherSynopticClose\(\)\{[\s\S]*?if\(panel\)panel\.hidden=true;/);
 assert.match(synoptic,/premiumAction\('minimize','Synoptik minimieren','minimize'\)/);
 assert.match(synoptic,/bindPremiumPanelDrag\(panel,[^\n]*\{touch:true\}\)/);
 assert.match(synoptic,/for\(const name of \['pointerdown','mousedown','dblclick','touchstart','wheel'\]\)panel\.addEventListener\(name,e=>e\.stopPropagation\(\),\{passive:true\}\)/);
 assert.match(synoptic,/this\._weatherSynopticOpenColors\(button\)/);
});
