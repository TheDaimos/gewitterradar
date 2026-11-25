import assert from 'node:assert/strict';
import {formatMoonDistance} from '../frontend/modules/weather/moon-legend.js';
for(const v of [undefined,null,NaN,Infinity,-1,0,1,1e9,'384388'])assert.equal(formatMoonDistance(v),null);
assert.equal(formatMoonDistance(384388,'km','KM','de-DE'),'≈ 384.388 km');
assert.equal(formatMoonDistance(384388,'m','KM','de-DE'),'≈ 384.388.000 m');
assert.equal(formatMoonDistance(384388,'auto','MI','en-GB'),formatMoonDistance(384388,'mi','KM','en-GB'));
for(const [u,f] of [['km',1],['m',1000],['mi',1/1.609344],['ft',1000/.3048]])assert.equal(formatMoonDistance(384388,u,'MI','en-GB'),'≈ '+new Intl.NumberFormat('en-GB',{maximumFractionDigits:0}).format(384388*f)+' '+u);
console.log('PASS numeric distance, legacy/malformed fallback, four exact factors, Auto KM/MI and DE/EN grouping; no extra apparent precision');
