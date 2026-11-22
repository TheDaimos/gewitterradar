import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {genericRasterRequest,genericRasterCycleStatus} from '../frontend/modules/weather/layer-menu.js';
test('generic raster resolve finishes, fails, times out or cancels; late responses never revive it',async()=>{
 assert.equal(await genericRasterRequest(Promise.resolve('ready'),{timeoutMs:100}),'ready');
 await assert.rejects(genericRasterRequest(Promise.reject(new Error('offline')),{timeoutMs:100}),/offline/);
 let finish;const late=new Promise(r=>finish=r);await assert.rejects(genericRasterRequest(late,{timeoutMs:5}),/raster_resolve_timeout/);finish('late');
 const abort=new AbortController(),request=genericRasterRequest(new Promise(()=>{}),{timeoutMs:100,signal:abort.signal});abort.abort();await assert.rejects(request,/raster_request_cancelled/);
 const already=new AbortController();already.abort();await assert.rejects(genericRasterRequest(Promise.resolve('ready'),{signal:already.signal}),/cancelled/);
 for(const [input,expected] of [[{},'unavailable'],[{drawn:1},'ready'],[{failed:1},'failed'],[{drawn:1,failed:1},'partial']])assert.equal(genericRasterCycleStatus(input),expected);
});
test('premium optical processing and unified rain/snow legend methods are unchanged',async()=>{
 const base='1919bb739ecce256f6953ce250e47b90384d6086',file='frontend/modules/weather/display-menu.js',before=execFileSync('git',['show',base+':'+file],{encoding:'utf8'}).replaceAll('\r\n','\n'),after=(await readFile(file,'utf8')).replaceAll('\r\n','\n');
 // Compare every meteorological optical helper, excluding only the new menu scaffolding.
 for(const method of ['_weatherDisplayStyle','_weatherDisplayOpacity','_weatherDisplaySetTransparency','_weatherDisplayResetTransparency','_weatherDisplayRasterTuning','_weatherDisplayApplyRasterPaneStyle','_weatherDisplayApplyRasterStyle','_weatherDisplayApplyCloudStyle','_weatherDisplayLegendMode','_weatherDisplaySetLegendMode']){
  const extract=text=>{const start=text.indexOf('  '+method+'(');assert(start>=0,method);return text.slice(start,text.indexOf('\n  },',start)+5);};assert.equal(extract(after),extract(before),method);
 }
 const cut=text=>text.slice(text.indexOf('export const weatherDisplayChromiumSoftFilterAllowed'),text.indexOf('const bool='));assert.equal(cut(after),cut(before));
 const legend=await readFile('frontend/modules/weather/legend-overlay.js','utf8');assert(legend.includes('groupIdenticalLegendScales')&&legend.includes('precipitationLegendScales'),'Precipitation legend contract preserved');const instrument=await readFile('frontend/modules/weather/legend-instrument.js','utf8');assert(legend.includes('createLegendInstrument')&&instrument.includes('host.append(body,info)'),'Shared minimal legend body and info available');for(const marker of ['data-weather-legend-hide','data-gr-legend-minimize','weather-legend-global-head'])assert(!legend.includes(marker)&&!instrument.includes(marker),'Removed window controls stay absent: '+marker);assert(instrument.includes('_weatherDisplayBindEyeDrag')&&instrument.includes('savePosition(p)'),'Native pointer recovery and position persistence available');
});
