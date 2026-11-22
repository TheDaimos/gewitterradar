import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {normaliseGeneratedModule} from '../tests/with-settings-vault.mjs';
import {withoutLegendPresentation} from '../tests/with-legend-presentation.mjs';
const aura='b184aa475d7dede993bf9ed7e699c9dfffba7248',final='af70fe2bf85a88fdea402cf46e3bd6a11903189b';
const old=(ref,path)=>execFileSync('git',['show',ref+':'+path],{encoding:'utf8',maxBuffer:30*1024*1024});
for(const name of ['eye-hub.js','eye-hub-model.js','eye-hub-registry.js','eye-hub-view.js','eye-hub-locales.js','eye-neon.js','eye-neon-wow.js','eye-neon-energy.js','control-touch.js','storm-bubble.js','display-menu.js','display-quick.js','premium-ui.js']){
 const path='frontend/modules/weather/'+name;assert.equal(normaliseGeneratedModule(readFileSync(path,'utf8')),normaliseGeneratedModule(old(aura,path)),name+' protected technical Aura body');
}
for(const name of ['wind-display.js','temperature-display.js','synoptic-display.js','precipitation-layer.js','wind-data.js','wind-field.js','wind-canvas.js','temperature-data.js','temperature-field.js','temperature-canvas.js','snake-canvas.js','snake-geometry.js','snake-config.js']){
 const path='frontend/modules/weather/'+name;assert.equal(normaliseGeneratedModule(withoutLegendPresentation(readFileSync(path,'utf8'),path)),normaliseGeneratedModule(old(final,path)),name+' protected FINAL weather logic');
}
const path='frontend/modules/core/card-lifecycle.js';assert.equal(normaliseGeneratedModule(withoutLegendPresentation(readFileSync(path,'utf8'),path)),normaliseGeneratedModule(old(aura,path)),'lifecycle changed only by the three explicit Hub hooks');
console.log('PASS: exact protected Aura bodies and complete FINAL weather modules outside the explicit presentation-only adapters');
