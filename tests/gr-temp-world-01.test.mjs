import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {normalizeTemperatureConfig,temperatureText,temperatureColor,writeTemperatureColor,readTemperatureConfig,TEMPERATURE_STORAGE} from '../frontend/modules/weather/temperature-data.js';
import {TEMPERATURE_UNIT_TRANSLATIONS,temperatureDisplayValue,temperatureKelvinValue,temperatureUnitSymbol,installTemperatureUnitTranslations} from '../frontend/modules/weather/temperature-units.js';
import {parseTemperatureField,sampleScalarInto,TemperatureFieldCache,TEMPERATURE_FIELD} from '../frontend/modules/weather/temperature-field.js';
import {GeoPointAdapters,createGeoPointContext} from '../frontend/modules/weather/geopoint-context.js';
import {requestWeatherFrame,cancelWeatherFrame,weatherFrameClockState} from '../frontend/modules/weather/frame-clock.js';
import {assertClassicWindPreserved} from './protected-wind-classic.mjs';
const c=normalizeTemperatureConfig();
const reply=()=>({schema:'weather_router.consumer.temperature_field.v2',contract_version:2,capability:TEMPERATURE_FIELD,status:'ready',frame:{id:'t',capability:TEMPERATURE_FIELD,unit:'K',height_m:2,kind:'model_forecast',model_run:'2026-11-07T12:00:00Z',valid_at:'2026-11-07T18:00:00Z',valid_until:new Date(Date.now()+600000).toISOString(),refresh_after_seconds:300,native_resolution_degrees:.25,provenance:{provider_id:'synthetic'},grid:{crs:'EPSG:4326',layout:'row_major_south_first',latitudes:[40,45,50],longitudes:[0,5,10],cyclic:false,valid_mask:Array(9).fill(1),values:[270,271,272,273,274,275,276,277,278]}}});
test('central C/F/K conversions and inverse preserve Kelvin; K has no degree sign',()=>{
 for(const [k,C,F] of [[273.15,0,32],[233.15,-40,-40],[323.15,50,122]])for(const [u,n] of [['C',C],['F',F],['K',k]]){assert(Math.abs(temperatureDisplayValue(k,u)-n)<1e-10);assert(Math.abs(temperatureKelvinValue(n,u)-k)<1e-10);}
 assert.equal(temperatureText(273.15,'K',true),'273 K');assert.equal(temperatureText(273.15,'F',true),'32 °F');assert.equal(temperatureUnitSymbol('K'),'K');assert.equal(temperatureText(NaN,'K'),'–');
});
test('units persist, default to C and share every registered language through existing I18N',()=>{
 assert.equal(c.unit,'C');for(const unit of ['C','F','K'])assert.equal(readTemperatureConfig({getItem:key=>{assert.equal(key,TEMPERATURE_STORAGE);return JSON.stringify({...c,unit});}}).unit,unit);
 const base=readFileSync(new URL('../frontend/modules/core/base-context.js',import.meta.url),'utf8'),part=base.slice(base.indexOf('const LANGUAGE_DEFINITIONS = ['),base.indexOf('const LANGUAGE_DEFINITIONS = [')+2200),languages=[...part.matchAll(/value\s*:\s*['"]([^'"]+)['"]/g)].map(m=>m[1]);
 assert.equal(languages.length,19);assert.deepEqual(Object.keys(TEMPERATURE_UNIT_TRANSLATIONS).sort(),languages.sort());const i18n={Deutsch:{strings:{existing:'retained'}}};installTemperatureUnitTranslations(i18n);assert.equal(i18n.Deutsch.strings.existing,'retained');for(const name of languages)assert.equal(Object.keys(i18n[name].strings).filter(k=>k.startsWith('temperature.unit.')).length,7);
});
test('palette and advection never depend on display unit; violet belongs to extreme heat',()=>{
 for(const k of [180,233.15,273.15,313.15,323.15,350])assert.equal(temperatureColor(k,{...c,unit:'K'}),temperatureColor(k,{...c,unit:'F'}));
 assert.equal(temperatureColor(180,c),'rgb(5,27,97)');assert.equal(temperatureColor(323.15,c),'rgb(139,56,217)');assert.deepEqual(normalizeTemperatureConfig({stops:[-100,-90,-80,-70,-60,-50,-40,-30,-20]}).stops,c.stops);
 for(const n of [NaN,0,-1]){const a=[];writeTemperatureColor(n,c,a);assert.deepEqual(a,[0,0,0,0]);}
});
test('scalar contract rejects wrong units/heights/expiry, masks cells and wraps world coordinates',()=>{
 const r=reply(),f=parseTemperatureField(r),out=new Float64Array(1);assert(sampleScalarInto(f.grid,42.5,2.5,out));assert.equal(out[0],272);assert(sampleScalarInto(f.grid,42.5,362.5,out));f.grid.valid_mask[4]=0;assert.equal(sampleScalarInto(f.grid,42.5,2.5,out),false);
 for(const patch of [{unit:'°C'},{height_m:10},{valid_until:new Date(Date.now()-1).toISOString()}])assert.throws(()=>parseTemperatureField({...r,frame:{...r.frame,...patch}}));
 const a={status:'ready',unit:'K/h',level:{type:'isobaric',value:850,unit:'hPa'},model_run:r.frame.model_run,valid_at:'2026-11-07T21:00:00Z',valid_until:r.frame.valid_until};assert.throws(()=>parseTemperatureField({...r,frame:{...r.frame,advection:a}}),/incoherent/);
});
test('temperature cache uses bounded existing LRU without extending grants',()=>{
 const cache=new TemperatureFieldCache({maxEntries:2,budgetBytes:15000}),f=parseTemperatureField(reply()),until=f.deadline;cache.put(f,6);assert.equal(cache.find({west:1,east:4,south:41,north:44},6),f);assert.equal(f.deadline,until);cache.put({...f,id:'two'},6);cache.put({...f,id:'three'},6);assert.equal(cache.entries.size,2);assert(cache.bytes<=cache.budgetBytes);f.deadline=Date.now()-1;cache.prune();cache.clear();assert.equal(cache.bytes,0);
});
test('GeoPoint schema normalizes coordinates, coalesces requests and isolates unsupported/error capabilities',async()=>{
 const adapters=new GeoPointAdapters();let calls=0;adapters.register('temperature',async()=>{calls++;await Promise.resolve();return {status:'ready',value:{value:273.15,unit:'K'},source:{provider_id:'test'},validity:{valid_at:'2026-11-07T18:00:00Z'}};});adapters.register('bad',()=>{throw Error('bad_data');});const query={latitude:48,longitude:368,requested_capabilities:['temperature','tides','bad']};const [a,b]=await Promise.all([adapters.query(query),adapters.query(query)]);assert.equal(a,b);assert.equal(calls,1);assert.equal(a.longitude,8);assert.deepEqual(a.available_capabilities,['temperature']);assert.equal(a.availability.tides.code,'capability_not_implemented');assert.equal(a.availability.bad.code,'bad_data');assert.throws(()=>createGeoPointContext({latitude:91,longitude:0}));
});
test('one native scheduler serves Wind and temperature, supports cancellation and cleanup',()=>{
 let next=0,callback=null,cancelled=0;globalThis.requestAnimationFrame=f=>{next++;callback=f;return next;};globalThis.cancelAnimationFrame=()=>cancelled++;const ran=[];requestWeatherFrame(()=>ran.push('wind'));const t=requestWeatherFrame(()=>ran.push('temperature'));assert.equal(next,1);assert.equal(weatherFrameClockState().nativeRequests,1);cancelWeatherFrame(t);callback(100);assert.deepEqual(ran,['wind']);assert.equal(weatherFrameClockState().pending,0);const a=requestWeatherFrame(()=>{});cancelWeatherFrame(a);assert.equal(cancelled,1);
});
test('protected Wind and precipitation code, reference and original temperature artwork remain exact',()=>{
 assertClassicWindPreserved();
 for(const path of ['frontend/modules/weather/wind-field.js','frontend/modules/weather/precipitation-layer.js','docs/GR_WR_TEMPERATURE_GEOPOINT_BASELINE_2026-11-07.md'])assert.equal(readFileSync(new URL('../'+path,import.meta.url),'utf8').replace(/\r\n/g,'\n').replace(/(\.js\?v=)\d+r\d+/g,'$1CACHE'),execFileSync('git',['show','04b751fd3962150ed0369dba4428959e4a8e98bd:'+path],{maxBuffer:10000000,encoding:'utf8'}).replace(/\r\n/g,'\n').replace(/(\.js\?v=)\d+r\d+/g,'$1CACHE'));
 assert.equal(createHash('sha256').update(readFileSync(new URL('../artwork/help-icons/hires/gr-temperature-premium-original.png',import.meta.url))).digest('hex'),'ea46df73c3590ef76c4a8afcd0693f3ed318f6943bf2b4c07e961613cd737f9e');
});
