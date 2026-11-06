import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {installWeatherLegendOverlay,precipitationLegendScales,groupIdenticalLegendScales,PRECIPITATION_LEGEND_ENTRIES} from '../frontend/modules/weather/legend-overlay.js';
// Reuse the existing presentation reference, verified against WR295 metadata.
// No new runtime colour table. These timestamps are synthetic UI fixtures.
const opera=()=>PRECIPITATION_LEGEND_ENTRIES.map(e=>({...e}));
const dwd=()=>opera().map((e,i)=>i?e:{...e,value:.1,label:'0.1–<0.2'});
const layer=(source_id,entries,time)=>({source_id,legend:{title:source_id,unit:'mm/h',entries},semantics:{quantity:'precipitation_rate',unit:'mm/h'},times:{valid_at:time}});
const layers=()=>[layer('dwd/radar_precipitation',dwd(),'2026-11-06T19:40:00Z'),layer('opera/opera_rate_raster',opera(),'2026-11-06T19:30:00Z')];
function models(input=layers()){
 class Card{};installWeatherLegendOverlay(Card);const card=new Card();card._weatherLegendSyncUi=()=>{};
 card._weatherLegendSetModel('precipitation',{family:'precipitation',title:'Niederschlag',active:true,scales:precipitationLegendScales(input)});
 return card._weatherLegendActiveModels();
}
test('actual 15-class WR-compatible tables combine only their lower boundary difference',()=>{
 const active=models(),before=JSON.stringify(active),result=groupIdenticalLegendScales(active);
 assert.equal(result.length,1);assert.equal(result[0].title,'DWD / OPERA · Radar-Niederschlag');
 assert.equal(result[0].lowerBoundaryNote,'* DWD ab 0,1 mm/h · OPERA >0 mm/h');
 assert.equal(result[0].timeNote,'DWD 19:40 UTC · OPERA 19:30 UTC');
 assert.deepEqual(result[0].entries,active.find(m=>m.source.includes('opera/')).entries);
 assert.equal(JSON.stringify(active),before,'never mutate the separate authoritative source models');
 assert.equal(result[0].entries.length,15);assert.equal(result[0].entries.at(-1).label,'≥150');
});
test('identical radar intervals merge without a false lower-boundary disclaimer',()=>{
 const input=layers();input[1].legend.entries=dwd();
 const [shared]=groupIdenticalLegendScales(models(input));
 assert.equal(shared.sharedRadar,true);assert.equal(shared.lowerBoundaryNote,'');assert.match(shared.timeNote,/DWD 19:40.*OPERA 19:30/);
});
test('changes in RGB, order, counts, interior bounds, interval semantics, top class or unit stay separate',()=>{
 const changes=[
  l=>{l.legend.entries[4].color='#123456';},
  l=>{[l.legend.entries[3],l.legend.entries[4]]=[l.legend.entries[4],l.legend.entries[3]];},
  l=>{l.legend.entries.pop();},
  l=>{l.legend.entries[2].value=.5;l.legend.entries[2].label='0.5–<1';l.legend.entries[1].label='0.2–<0.5';},
  l=>{l.legend.entries[4].label='>2–<3';},
  l=>{l.legend.entries.at(-1).label='150–<200';},
  l=>{l.legend.unit='dBZ';},
  l=>{l.legend.entries[1].upperInclusive=true;},
  l=>{l.semantics.quantity='snowfall_rate';},
  l=>{l.legend.ticks=[{position:.5,label:'3'}];}
 ];
 for(const change of changes){const input=layers();change(input[1]);assert.equal(groupIdenticalLegendScales(models(input)).length,2);}
});
test('NASA stays independent even with coincidentally identical radar colours; snow is a separate family',()=>{
 const input=layers();input.push(layer('nasa_gibs/satellite_precipitation_imerg_30min',opera(),'2026-11-06T16:00:00Z'));
 input[2].legend.scales=[{kind:'rain',quantity:'precipitation_rate',unit:'mm/h',entries:opera()},
  {kind:'snow',quantity:'liquid_water_equivalent_snowfall_rate',unit:'mm/h SWE',entries:opera()}];
 const grouped=groupIdenticalLegendScales(models(input));assert.equal(grouped.length,3);
 assert.equal(grouped.filter(m=>m.sharedRadar).length,1);
 assert.equal(grouped.filter(m=>m.source.includes('nasa_gibs/')).length,2);
 assert.equal(grouped.find(m=>m.family==='snow').unit,'mm/h SWE');
});
test('single-provider labels and original times remain untouched; unknown time is explicit',()=>{
 for(const single of layers()){
  const [model]=models([single]);const [result]=groupIdenticalLegendScales([model]);
  assert.equal(result.title,single.source_id);assert.equal(result.legendTime,single.times.valid_at);assert.equal(result.sharedRadar,undefined);
 }
 const input=layers();delete input[1].times;
 assert.match(groupIdenticalLegendScales(models(input))[0].timeNote,/OPERA Zeitpunkt nicht angegeben/);
});
test('UTC offsets and date changes remain assigned to their own source',()=>{
 const input=layers();input[0].times.valid_at='2026-11-07T00:40:00+01:00';input[1].times.valid_at='2026-11-07T00:30:12Z';
 const [shared]=groupIdenticalLegendScales(models(input));
 assert.equal(shared.timeNote,'DWD 06.11.2026 23:40 UTC · OPERA 07.11.2026 00:30:12 UTC');
});
test('missing, inconsistent or unverifiable WR intervals never gain a shared scale',()=>{
 for(const mutate of [l=>delete l.legend.entries,l=>{l.legend.entries[0].value=.1;},l=>{l.legend.entries[0].value=null;},l=>{l.legend.entries[0].value='';},l=>{l.legend.entries[0].label='unknown';},l=>{l.legend.entries[0].color='';}]){
  const input=layers();mutate(input[1]);assert.equal(groupIdenticalLegendScales(models(input)).length,2);
 }
});
test('reference palette and the protected weather data modules remain unchanged',async()=>{
 const {execFileSync}=await import('node:child_process');
 const baseline='ab55f7b2bfee4a35511b2e95359572e8f2cae6da';
 const files=['precipitation-layer.js','display-menu.js','layer-menu.js','p7-010/raster-compositor.js','p7-010/raster-mosaic-grid-layer.js','p7-010/raster-mosaic-tile-loader.js','p7-010/raster-mosaic-contract.js','p7-010/raster-mosaic-consumer.js','p7-010/nasa-spatial.js','p7-010/radar-mask.js'];
 for(const name of files){const path='frontend/modules/weather/'+name;
  // Only the imported UI legend's cache revision changes in the radar entry.
  const actual=(await readFile(path,'utf8')).replace('legend-overlay.js?v=411148r1','legend-overlay.js?v=411147r1');
  assert.equal(actual,execFileSync('git',['show',baseline+':'+path],{encoding:'utf8'}),path);
 }
 const old=execFileSync('git',['show',baseline+':frontend/modules/weather/legend-overlay.js'],{encoding:'utf8'});
 const current=await readFile('frontend/modules/weather/legend-overlay.js','utf8');
 for(const declaration of ['PRECIPITATION_LEGEND_ENTRIES','LEGACY_OPERA_ENTRIES']){
  const line=text=>text.split('\n').find(s=>s.startsWith('export const '+declaration+'='));assert.equal(line(current),line(old));
 }
 for(const name of ['_weatherLegendEnsureStyle','_weatherLegendEnsureUi','_weatherLegendPosition','_weatherLegendBounds','_weatherLegendBindDrag']){
  const method=text=>{const start=text.indexOf('  '+name+'(');return text.slice(start,text.indexOf('\n  },',start));};
  assert.equal(method(current),method(old),name+' must retain premium design, viewport bounds and persisted dragging');
 }
});
