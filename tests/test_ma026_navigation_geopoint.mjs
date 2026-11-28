// V4.14.26 regressions: transparent Settings Chevron Back and visible
// provider-backed GeoPoint popup, with no tracker or database mutation.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const get=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const manager=get('frontend/modules/monitored-areas/location-manager.js');
const overview=get('frontend/modules/monitored-areas/location-overview.js');
const create=get('frontend/modules/monitored-areas/location-create.js');
const controls=get('frontend/modules/ui/controls.js');
const weather=get('frontend/modules/weather/temperature-display.js');
const portal=get('frontend/modules/monitored-areas/geopoint-window.js');
const mod=await import('data:text/javascript;base64,'+Buffer.from(portal).toString('base64'));
assert.match(manager,/managerBack=backNavigation\(t\.back,close\)/);
assert.match(manager,/detailBack=backNavigation\(t\.back/);
assert.match(manager,/navigation\.append\(detailBack,stateBadge\)/);
assert.match(manager,/widget\.append\(stylesheet,heading,navigation,content\)/);
assert.match(manager,/\.gr-ma-detail-nav \.gr-ma-nav-back\{/);
assert.match(manager,/\.gr-ma-panel>\.gr-ma-nav-back\{/);
assert.match(manager,/gr-ma-nav-back-chevron/);
assert.match(manager,/border:0!important;box-shadow:none!important;background:transparent!important/);
for(const source of [overview,create]){
  assert.match(source,/className='ma-back'/);
  assert.match(source,/setAttribute\('aria-label',t\.back\)/);
  assert.match(source,/chevron/);
  assert.match(source,/background:transparent!important;border:0!important/);
}
assert.match(overview,/#gr-ma-location-overview \.ma-back\{flex:0 0 auto;display:inline-flex!important/);
assert.match(overview,/panel\.append\(header,back,toolbar,main,footer\)/);
assert.match(controls,/await open\.call\(this,position\)/);
assert.match(controls,/geopoint-window\.js\?v=41426r1/);
assert.match(controls,/popup\.openGeoPointWindow\(this/);
assert.match(weather,/this\._weatherTemperaturePointRender\(\)/);
assert.match(portal,/readGeoPointSnapshot\(source\)/);
assert.match(portal,/source\.hidden=true/);
assert.match(portal,/source\.querySelectorAll\('p'\)/);
assert.doesNotMatch(portal,/fetch\(|callService\(|callWS\(|localStorage|innerHTML/);
assert.equal(mod.readGeoPointSnapshot(null),null);
const mock={hidden:false,querySelector(selector){
 return selector==='strong'?{textContent:'GeoPoint Inspector'}:null;
},querySelectorAll(selector){
 return selector==='p'?[{textContent:'34.173°, 3.283°'},{textContent:'temperature: no_authorized_field'}]:[];
}};
assert.deepEqual(mod.readGeoPointSnapshot(mock),{
 heading:'GeoPoint Inspector',lines:['34.173°, 3.283°','temperature: no_authorized_field']});
mock.hidden=true;assert.equal(mod.readGeoPointSnapshot(mock),null);
console.log('PASS MA-026 Chevron Back navigation and existing GeoPoint source overlay');
