import assert from 'node:assert/strict';
import {moonScalePlan} from '../frontend/modules/weather/moon-legend.js';
import {normalizeLegendHub,normalizeMoonUi} from '../frontend/modules/weather/legend-hub-model.js';
assert.deepEqual(normalizeMoonUi(),{phasesExpanded:true,scaleMode:'auto',scalePercent:100});
assert.deepEqual(normalizeMoonUi({phasesExpanded:false,scaleMode:'manual',scalePercent:123}),{phasesExpanded:false,scaleMode:'manual',scalePercent:125});
assert.deepEqual(normalizeMoonUi({scaleMode:'unknown',scalePercent:NaN}),{phasesExpanded:true,scaleMode:'auto',scalePercent:100});
const legacy={slots:['wind',null,'temperature'],position:{x:.2,y:.8},legends:{wind:{mode:'off'}},extraPositions:{moon:{x:.4,y:.7}}};
const normalized=normalizeLegendHub(legacy);assert.deepEqual(normalized.slots,legacy.slots);assert.deepEqual(normalized.position,legacy.position);assert.deepEqual(normalized.extraPositions.moon,legacy.extraPositions.moon);assert.equal(normalized.legends.wind.mode,'off');
let cases=0;
for(const width of [260,362,592,740,996,1252,1892])for(const height of [180,280,450,640,740,996])for(const mobile of [true,false])for(const expanded of [true,false])for(const scalePercent of [50,55,75,100,125])for(const scaleMode of ['auto','manual']){
 const naturalWidth=mobile?420:1004,naturalHeight=mobile?(expanded?900:650):(expanded?800:590),preference={scaleMode,scalePercent};
 const plan=moonScalePlan({width,height,naturalWidth,naturalHeight,preference,mobile});
 assert(plan.scale>0&&plan.scale<=1.25);assert(naturalWidth*plan.scale<=width+.001);assert(plan.visibleHeight*plan.scale<=height+.001);
 if(!plan.scroll)assert(naturalHeight*plan.scale<=height+.5);
 assert.equal(plan.scroll,naturalHeight*plan.scale>height+.5);cases++;
}
const normal=moonScalePlan({width:1300,height:700,naturalWidth:1004,naturalHeight:800,preference:{scaleMode:'auto',scalePercent:100}});assert.equal(normal.scroll,false);assert.equal(normal.scale,.875);
console.log('PASS Moon master fit: '+cases+' viewport/mode/collapse/scale combinations; optional defaults and unchanged legacy settings');
