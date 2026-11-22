import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {normalizeLegendHub,normalizeLegendOptions,assignLegendSlot,LEGEND_OPTIONS} from '../frontend/modules/weather/legend-hub-model.js';
import {legendHubLayout} from '../frontend/modules/weather/legend-hub-layout.js';
import {legendInk,contrastRatio} from '../frontend/modules/weather/legend-contrast.js';
import {fitLegendLabels} from '../frontend/modules/weather/legend-scale.js';
import {LEGEND_HUB_TRANSLATIONS} from '../frontend/modules/weather/legend-hub-locales.js';
import {legendDescriptor} from '../frontend/modules/weather/legend-registry.js';
import {DEFAULT_TEMPERATURE,temperatureColor} from '../frontend/modules/weather/temperature-data.js';
import {BEAUFORT_LIMITS} from '../frontend/modules/weather/wind-data.js';
import {WIND_FIELD_COLORS} from '../frontend/modules/weather/wind-field.js';
const c=normalizeLegendHub();assert.equal(c.icon,1);assert.equal(c.legends.wind.mode,'inherit');assert.deepEqual(normalizeLegendHub(JSON.parse(JSON.stringify(c))),c);
assert.deepEqual(assignLegendSlot(c,0,'wind').slots,['wind','precipitation','temperature','synoptic']);assert.deepEqual(assignLegendSlot(c,1,null).slots,['precipitation',null,'temperature','synoptic']);
for(const [key,values]of Object.entries(LEGEND_OPTIONS))for(const value of values)assert.equal(normalizeLegendOptions({[key]:value})[key],value);assert.equal(normalizeLegendOptions({size:'unsafe'}).size,'M');assert.equal(normalizeLegendHub({slots:[]}).slots.length,1);assert.equal(normalizeLegendHub({slots:Array(30).fill(null)}).slots.length,12);
let geometries=0;for(const [w,h]of [[1280,860],[393,780],[851,363]])for(let count=1;count<=13;count++)for(const direction of ['dynamic','left','right','up','down','horizontal','vertical'])for(const [x,y]of [[0,0],[1,0],[0,1],[1,1],[.5,0],[.5,1],[0,.5],[1,.5]]){
 const bounds={left:10,top:10,right:w-10,bottom:h-10},anchor={left:10+(w-74)*x,top:10+(h-74)*y,right:64+(w-74)*x,bottom:64+(h-74)*y},layout=legendHubLayout({anchor,bounds,count,direction});
 assert(layout.left>=bounds.left&&layout.top>=bounds.top&&layout.right<=bounds.right+.01&&layout.bottom<=bounds.bottom+.01,JSON.stringify({w,h,count,direction,layout}));assert.equal(legendHubLayout({anchor,bounds,count,direction,locked:layout.direction}).direction,layout.direction);geometries++;
}
for(const background of ['#000000','#ffffff','#b99c57','#e5e4e2','#0066ff','#39ff14','#ffff00','#ff003c','#b000ff']){const ink=legendInk(background);assert(ink.ratio>=4.5);assert(contrastRatio(background,ink.color)>=4.5);}
for(const color of ['white','black','ice','mint','champagne','gold'])for(const background of ['#000000','#ffffff','#b99c57','#39ff14'])assert(legendInk(background,color,true).ratio>=4.5,'local automatic inversion '+color);
const owner={_t:(_key,{low,high})=>low+' / '+high,_locale:()=> 'de-DE',_weatherWindState:()=>({config:{unit:'km/h'}}),_weatherTemperatureState:()=>({config:{...DEFAULT_TEMPERATURE}})};
const wind=legendDescriptor(owner,'wind');assert.deepEqual(wind.entries.map(e=>e.value),BEAUFORT_LIMITS);assert.deepEqual(wind.entries.map(e=>e.color),WIND_FIELD_COLORS);
const temp=legendDescriptor(owner,'temperature');for(const p of [0,.25,.5,.75,1])assert.equal(temp.sample(p),temperatureColor(273.15-40+90*p,DEFAULT_TEMPERATURE));assert.equal(temp.unit,'°C');
const advection=legendDescriptor(owner,'advection');assert.equal(advection.unit,'K/h');assert(advection.entries.every(e=>!e.label.includes(' bis ')),'localized intervals also reach aria labels and tooltips');assert.equal(advection.ticks.find(t=>t.center).label,'0');assert.equal(advection.ticks.find(t=>t.center).position,2.5/6,'zero stays in the neutral class, not a fictitious linear numeric axis');
const ticks=[0,.01,.02,.1,.25,.5,.75,.9,1].map(position=>({position,label:String(position*150)}));for(const length of [120,200,280,440])for(const density of ['coarse','medium','detailed']){const fit=fitLegendLabels(ticks,length,{density});assert.equal(fit[0],ticks[0]);assert.equal(fit.at(-1),ticks.at(-1));if(density==='coarse')assert.equal(fit.length,2);}
assert.equal(Object.keys(LEGEND_HUB_TRANSLATIONS).length,19);for(const [language,copy]of Object.entries(LEGEND_HUB_TRANSLATIONS)){assert.deepEqual(Object.keys(copy),Object.keys(LEGEND_HUB_TRANSLATIONS.English),language);assert(Object.values(copy).every(v=>typeof v==='string'&&v.length>0),language);}
for(const asset of JSON.parse(readFileSync('artwork/legend-hub/provenance.json')).assets){const a=readFileSync(asset.master),b=readFileSync(asset.runtime);assert(a.equals(b));assert.equal(createHash('sha256').update(a).digest('hex'),asset.sha256);assert.equal(asset.width,1254);assert.equal(asset.height,1254);assert.equal(asset.pngColorType,6);}
console.log('PASS Legend Hub: '+geometries+' layouts, locked directions, slots, all preferences, label priority, contrast >=4.5, 19 locales, byte-identical RGBA originals');
