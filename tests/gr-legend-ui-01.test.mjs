import test from 'node:test';
import assert from 'node:assert/strict';
import {installWeatherLegendOverlay,PRECIPITATION_LEGEND_ENTRIES,precipitationLegendScales,legendProviders,groupIdenticalLegendScales} from '../frontend/modules/weather/legend-overlay.js';
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
 assert.equal(visible.find(model=>model.source.includes('dwd/')).legendUrl,'');
 assert.equal(visible.find(model=>model.source.includes('dwd/')).entries[0].color,'');
 mode='off';assert.equal(card._weatherLegendVisibleModels().length,0);
 card._weatherLegendClear('precipitation');mode='auto';assert.equal(card._weatherLegendVisibleModels().length,0);
});
test('one dynamic heading and identical scales are grouped without hiding different provider colors',()=>{
 const models=[{source:'precipitation:dwd/radar_precipitation',title:'DWD',unit:'mm/h',entries:normalized},
 {source:'precipitation:opera/opera_rate_raster',title:'OPERA',unit:'mm/h',entries:normalized},
 {source:'precipitation:nasa_gibs/satellite_precipitation_imerg_30min',title:'NASA',unit:'mm/h',entries:[],legendUrl:'https://example.org/nasa'}];
 assert.deepEqual(legendProviders(models),['DWD','OPERA','NASA']);
 assert.equal(groupIdenticalLegendScales(models).length,2);
 assert.equal(models[0].title,'DWD','grouping must not mutate live source metadata');
 const different={...models[0],entries:[{label:'other',value:'1',color:'#ff0000'}]};
 assert.equal(groupIdenticalLegendScales([different,models[1]]).length,2);
});
test('WR metadata is authoritative; legacy frames and unknown providers never inherit a new palette',()=>{
 const custom=[{value:1,label:'WR live',color:'#123456'}];
 assert.equal(precipitationLegendScales([{source_id:'opera/opera_rate_raster',legend:{entries:custom}}])[0].entries,custom);
 assert.equal(precipitationLegendScales([{source_id:'opera/opera_rate_raster'}])[0].entries.length,13);
 assert.equal(PRECIPITATION_LEGEND_ENTRIES.length,15);
 assert.equal(precipitationLegendScales([{source_id:'dwd/radar_precipitation'}])[0].entries[0].color,'');
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
test('snow requires a matching physical quantity and unit; rain stays independent',()=>{
 const entry={value:.1,label:'0.1–<0.2',color:'#123456'};
 const result=precipitationLegendScales([{source_id:'nasa_gibs/satellite_precipitation_imerg_30min',legend:{scales:[
  {kind:'rain',unit:'mm/h',quantity:'precipitation_rate',entries:[entry]},
  {kind:'snow',unit:'mm/h SWE',quantity:'liquid_water_equivalent_snowfall_rate',entries:[entry]}
 ]}}]);
 assert.equal(result.length,2);assert.match(result[1].subtitle,/Wasseräquivalent/);
 const invalid=precipitationLegendScales([{source_id:'fixture',legend:{scales:[
  {kind:'rain',unit:'mm/h',quantity:'precipitation_rate',entries:[entry]},
  {kind:'snow',unit:'cm',quantity:'snow_depth',entries:[entry]}
 ]}}]);assert.equal(invalid.length,1);assert.equal(invalid[0].kind,'rain');
 const previous=globalThis.localStorage;
 try{globalThis.localStorage={getItem:key=>key.endsWith('ui:v1')?'{"view":"classes","rain":true,"snow":false}':null};
 assert.deepEqual(new Card()._weatherLegendState().ui,{view:'classes',rain:true,snow:false,minimized:false});}finally{globalThis.localStorage=previous;}
});
