import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import vm from 'node:vm';

const roots=['custom_components/gewitterradar/frontend','frontend','dashboard/dist'];
const read=(root,file)=>readFileSync(join(root,file),'utf8');

test('all three shipped GR module graphs are exactly identical',()=>{
 for(const file of [
  'modules/weather/precipitation-layer.js',
  'modules/weather/p7-010/raster-mosaic-consumer.js',
  'modules/weather/p7-010/raster-mosaic-grid-layer.js',
  'modules/weather/p7-010/raster-mosaic-tile-loader.js',
  'version.js','gewitterradar.js','module-manifest.js'
 ]){
   const expected=read(roots[0],file);
   for(const root of roots.slice(1))assert.equal(read(root,file),expected,file);
 }
});

test('verified DWD event triggers only a WR V2 re-resolve, not GR provider selection',()=>{
 const source=read(roots[0],'modules/weather/precipitation-layer.js');
 assert.match(source,/event\?\.data\?\.dwd_coverage_verified===true/);
 assert.match(source,/this\._scheduleWeatherRadarRefresh\(event\.data\.dwd_coverage_verified===true/);
 assert.match(source,/weather_router_routing_changed/);
 assert.doesNotMatch(source,/dwd_coverage_verified===true\s*\?\s*this\._setWeatherRadarEnabled/);
});

test('immutable DWD in-memory image cache keys must include verified source frame',()=>{
 const source=read(roots[0],'modules/weather/p7-010/raster-mosaic-tile-loader.js');
 const start=source.indexOf('function dwdCompletedKey(');
 const end=source.indexOf('function getCompletedDWDImage(',start);
 assert.ok(start>=0&&end>start);
 const extract=source.slice(start,end);
 const key=vm.runInNewContext('(()=>{'+extract+'return dwdCompletedKey;})()');
 const url='https://maps.dwd.invalid/radar?TIME=2026-11-13T09%3A00%3A00Z';
 const a=key('dwd/radar_precipitation',url,'2026-11-13T09:00:00Z');
 const b=key('dwd/radar_precipitation',url,'2026-11-13T09:05:00Z');
 assert.ok(a);
 assert.notEqual(a,b);
 assert.equal(key('nasa_gibs/satellite_precipitation_imerg_30min',url,'2026-11-13T09:00:00Z'),null);
 assert.equal(key('dwd/radar_precipitation','http://untrusted/', '2026-11-13T09:00:00Z'),null);
 assert.equal(key('dwd/radar_precipitation',url,'no-time'),null);
 assert.match(source,/DWD_COMPLETED_LIMIT=96/);
 assert.match(source,/DWD_COMPLETED_TTL_MS=180000/);
 assert.match(source,/budget\.getCachedImage\(source_id,url,layer\?\.times\?\.valid_at\)/);
 assert.match(source,/budget\.cacheImage\(source_id,url,image,layer\?\.times\?\.valid_at\)/);
});

test('the complete importer chain is revision-bumped to avoid stale cached modules',()=>{
 assert.match(read(roots[0],'modules/weather/precipitation-layer.js'),/raster-mosaic-consumer\.js\?v=411190r1/);
 assert.match(read(roots[0],'modules/weather/p7-010/raster-mosaic-consumer.js'),/raster-mosaic-grid-layer\.js\?v=411190r1/);
 assert.match(read(roots[0],'modules/weather/p7-010/raster-mosaic-grid-layer.js'),/raster-mosaic-tile-loader\.js\?v=411190r1/);
});

test('manifest, HA integration and DRA build are distinct and synchronized',()=>{
 const rel=read(roots[0],'version.js');
 assert.match(rel,/version:"4\.11\.190"/);
 assert.match(rel,/runtimeRevision:"411190r1"/);
 assert.match(rel,/integrationVersion:"0\.25\.97"/);
 assert.match(read(roots[0],'module-manifest.js'),/"version": "1\.3\.32"/);
 const integration=JSON.parse(readFileSync('custom_components/gewitterradar/manifest.json','utf8'));
 assert.equal(integration.version,'0.25.97');
 assert.match(readFileSync('custom_components/gewitterradar/build_info.py','utf8'),/BUILD_VERSION = "4\.11\.190"/);
});
