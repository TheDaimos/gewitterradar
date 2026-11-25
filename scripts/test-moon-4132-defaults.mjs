import assert from 'node:assert/strict';
import {normalizeLegendHub} from '../frontend/modules/weather/legend-hub-model.js';
assert.deepEqual(normalizeLegendHub().slots,['precipitation','wind','temperature','synoptic','moon']);
for(const slots of [[],['wind',null,'moon'],['precipitation','wind','temperature','synoptic']])assert.deepEqual(normalizeLegendHub({slots}).slots,slots.length?slots:[null]);
console.log('PASS five defaults only without existing slots; configured order/empty slots retained; no migration');
