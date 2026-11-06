import test from 'node:test';
import assert from 'node:assert/strict';
import {installWeatherLegendOverlay,PRECIPITATION_LEGEND_ENTRIES} from '../frontend/modules/weather/legend-overlay.js';
class Card{}
installWeatherLegendOverlay(Card);
const normalized=PRECIPITATION_LEGEND_ENTRIES.map(entry=>({...entry,value:String(entry.value)}));
test('existing legend manager handles forced on, auto, off and metadata-free V2 models',()=>{
 const card=new Card();let mode='auto';
 card._weatherDisplayLegendMode=()=>mode;
 card._weatherLegendSyncUi=()=>{};
 assert.equal(card._weatherLegendVisibleModels().length,0);
 mode='on';assert.equal(card._weatherLegendVisibleModels()[0].unit,'mm/h');
 mode='auto';
 card._weatherLegendSetModel('precipitation',{title:'Niederschlag',active:true});
 assert.deepEqual(card._weatherLegendVisibleModels()[0].entries,normalized);
 card._weatherLegendSetModel('precipitation',{title:'DWD',legendUrl:'https://example.org/legend.png'});
 assert.deepEqual(card._weatherLegendVisibleModels()[0].entries,normalized);
 mode='off';assert.equal(card._weatherLegendVisibleModels().length,0);
 card._weatherLegendClear('precipitation');mode='auto';assert.equal(card._weatherLegendVisibleModels().length,0);
});
test('normalized saved positions survive recreation and malformed storage is ignored',()=>{
 const previous=globalThis.localStorage;
 try{
 globalThis.localStorage={getItem:()=>'{"x":0.25,"y":0.75}'};
 assert.deepEqual(new Card()._weatherLegendState().position,{x:.25,y:.75});
 globalThis.localStorage={getItem:()=>'{"x":null,"y":2}'};
 assert.equal(new Card()._weatherLegendState().position,null);
 }finally{globalThis.localStorage=previous;}
});
