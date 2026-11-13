import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import vm from 'node:vm';

const root=resolve(import.meta.dirname,'..');
const read=path=>readFileSync(resolve(root,path),'utf8');
const base='frontend/modules/weather/synoptic-display.js';
const cleaned=read(base).replace(/^import .*?;\s*$/gm,'').replace(/\bexport\s+/g,'').replaceAll('import.meta.url','"https://example.invalid"');
const api=vm.runInNewContext(cleaned+';({normalizeSynopticConfig,parseSynopticFrame,synopticOpacity,SYNOPTIC_CAPABILITIES,SYNOPTIC_OPACITY_GROUPS})',{
 EYE_COLORS:['#FF00CC','#B000FF','#0066FF','#00FFF0','#39FF14','#FFFF00','#FF5F00','#FF003C','#FFC442','#D8E6F3'],defineModule:()=>()=>{}
});
const {normalizeSynopticConfig:normalize,parseSynopticFrame:parse,SYNOPTIC_CAPABILITIES:cap,synopticOpacity:opacity}=api;
const valid=new Date(Date.now()+3600e3).toISOString(),run=new Date(Date.now()-3600e3).toISOString();
const response=(capability,geometry,properties)=>({schema:'weather_router.consumer.synoptic.v2',contract_version:2,capability,status:'ready',frame:{
 capability,unit:'hPa',model_run:run,valid_at:run,valid_until:valid,coverage:{crs:'EPSG:4326'},provenance:{provider_id:'test_authorized'},geometry:{type:'FeatureCollection',features:[{type:'Feature',geometry,properties}]}
}});
test('legacy Wind H/T colours migrate without overwriting explicit new values',()=>{
 const a=normalize(null,{highColor:'gold',lowColor:'violet'});assert.equal(a.highColor,'#FFC442');assert.equal(a.lowColor,'#B000FF');
 assert.equal(normalize({highColor:'#123456',opacity:0},{highColor:'gold'}).highColor,'#123456');
 assert.equal(normalize({opacity:0}).opacity,0);
});
test('composed opacity groups are independent and compatible with future fronts',()=>{
 const c=normalize({opacity:.6,centerOpacity:.5,isobarOpacity:.4,frontLineOpacity:.7,frontSymbolOpacity:.9,neonOpacity:.2});
 assert.equal(opacity(c,'centers'),.3);assert.ok(Math.abs(opacity(c,'isobars')-.24)<1e-12);
 assert.ok(Math.abs(opacity(c,'frontLines')-.42)<1e-12);assert.ok(Math.abs(opacity(c,'frontSymbols')-.54)<1e-12);
 assert.ok(Math.abs(opacity(c,'frontNeon')-.12)<1e-12);
});
test('ECCC H/T GeoJSON and NOAA MultiLineString are parsed',()=>{
 const h=response(cap.centers,{type:'Point',coordinates:[9,53]},{kind:'H',pressure_hpa:1024});
 const l=response(cap.centers,{type:'Point',coordinates:[12,50]},{kind:'L',pressure_hpa:992});
 assert.equal(parse(h,cap.centers)?.geometry.features[0].properties.kind,'H');
 assert.equal(parse(l,cap.centers)?.geometry.features[0].properties.kind,'L');
 const contours=response(cap.isobars,{type:'MultiLineString',coordinates:[[[9,53],[10,54],[11,54]]]},{pressure_hpa:1008});
 assert.equal(parse(contours,cap.isobars)?.geometry.features.length,1);
});
test('invalid meteorological geometry, wrong capability and expired grant are rejected',()=>{
 const a=response(cap.centers,{type:'Point',coordinates:[9,53]},{kind:'X',pressure_hpa:1024});assert.equal(parse(a,cap.centers),null);
 const b=response(cap.isobars,{type:'MultiLineString',coordinates:[[[9,53],[210,54]]]},{pressure_hpa:1008});assert.equal(parse(b,cap.isobars),null);
 const c=response(cap.centers,{type:'Point',coordinates:[9,53]},{kind:'H',pressure_hpa:1024});c.frame.valid_until=run;assert.equal(parse(c,cap.centers),null);
 assert.equal(parse(response(cap.centers,{type:'Point',coordinates:[9,53]},{kind:'H',pressure_hpa:1024}),cap.isobars),null);
});
test('frontend mirrors, version and Eye registration match canonical build',()=>{
 for(const prefix of ['custom_components/gewitterradar/frontend','dashboard/dist']){
  for(const name of ['modules/weather/synoptic-display.js','modules/weather/eye-hub-model.js','modules/weather/eye-hub-registry.js','modules/weather/eye-hub-view.js','modules/weather/display-menu.js','module-manifest.js','version.js']){
   assert.equal(read(prefix+'/'+name),read('frontend/'+name),name+' mismatch in '+prefix);
  }
 }
 const version=JSON.parse(JSON.stringify(read('frontend/version.js')));
 assert.match(version,/4\.11\.199/);assert.match(version,/411200r1/);
 assert.match(read('frontend/modules/weather/eye-hub-registry.js'),/id:'synoptic'/);
 assert.match(read('frontend/modules/weather/eye-hub-view.js'),/\.weather-synoptic-toggle/);
 assert.ok(!read('frontend/modules/weather/wind-display.js').includes('Gespeicherte Hoch-/Tiefdruckfarben (inaktiv)'));
 const runtime=JSON.parse(read('frontend/assets/gewitterradar-runtime-manifest.json'));
 const manifest=read('frontend/module-manifest.js');
 assert.equal(runtime.productVersion,'4.11.200');
 assert.ok(runtime.modules.some(v=>v.id==='weather.synoptic-display'&&v.version==='0.1.4'));
 assert.match(manifest,/weather\.synoptic-display/);
});

test('NOAA/WPC front geoJSON is typed and rejected on invented symbol side',()=>{
 const a=response(cap.fronts,{type:'LineString',coordinates:[[-80,37],[-81,36],[-82,35]]},{front_type:'cold',intensity:null,symbol_side:null,symbol_side_authorized:false});
 a.frame.unit='feature';assert.equal(parse(a,cap.fronts)?.geometry.features.length,1);
 const b=response(cap.fronts,{type:'LineString',coordinates:[[-80,37],[-81,36]]},{front_type:'stationary',symbol_side:null,symbol_side_authorized:false});
 b.frame.unit='feature';assert.equal(parse(b,cap.fronts)?.geometry.features[0].properties.front_type,'stationary');
 b.frame.geometry.features[0].properties.front_type='fake';assert.equal(parse(b,cap.fronts),null);
 const c=response(cap.fronts,{type:'LineString',coordinates:[[-80,37],[-81,36]]},{front_type:'warm',symbol_side:'left',symbol_side_authorized:true});
 c.frame.unit='feature';assert.equal(parse(c,cap.fronts),null);
});
