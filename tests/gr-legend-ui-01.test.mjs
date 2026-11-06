import test from 'node:test';
import assert from 'node:assert/strict';
import {installWeatherLegendOverlay,PRECIPITATION_LEGEND_ENTRIES,precipitationLegendScales} from '../frontend/modules/weather/legend-overlay.js';
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
 const scales=precipitationLegendScales([
  {source_id:'opera/opera_rate_raster',legend:{entries:PRECIPITATION_LEGEND_ENTRIES,unit:'mm/h'}},
  {source_id:'dwd/radar_precipitation',legend:{url:'https://example.org/dwd-actual.png'}}]);
 card._weatherLegendSetModel('precipitation',{family:'precipitation',title:'Niederschlag',active:true,scales});
 const visible=card._weatherLegendVisibleModels();
 assert.equal(visible.length,2);
 assert.deepEqual(visible.find(model=>model.source.includes('opera/')).entries,normalized);
 assert.equal(visible.find(model=>model.source.includes('dwd/')).legendUrl,'https://example.org/dwd-actual.png');
 assert.equal(visible.find(model=>model.source.includes('dwd/')).entries.length,0);
 mode='off';assert.equal(card._weatherLegendVisibleModels().length,0);
 card._weatherLegendClear('precipitation');mode='auto';assert.equal(card._weatherLegendVisibleModels().length,0);
});
test('WR metadata is authoritative; legacy frames and unknown providers never inherit a new palette',()=>{
 const custom=[{value:1,label:'WR live',color:'#123456'}];
 assert.equal(precipitationLegendScales([{source_id:'opera/opera_rate_raster',legend:{entries:custom}}])[0].entries,custom);
 assert.equal(precipitationLegendScales([{source_id:'opera/opera_rate_raster'}])[0].entries.length,13);
 assert.equal(PRECIPITATION_LEGEND_ENTRIES.length,15);
 assert.match(precipitationLegendScales([{source_id:'dwd/radar_precipitation'}])[0].legendUrl,/GetLegendGraphic/);
 assert.equal(precipitationLegendScales([{source_id:'unknown/provider'}])[0].entries[0].color,'');
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
