import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const read=relative=>readFile(resolve(root,relative));

const source=await read('frontend/gewitterradar.js');
const sourceText=source.toString('utf8');
const integration=await read('custom_components/gewitterradar/frontend/gewitterradar.js');
const dashboard=await read('dashboard/dist/gewitterradar.js');

assert.ok(source.equals(integration),'V4.09 integration frontend differs from canonical source');
assert.ok(source.equals(dashboard),'V4.09 dashboard frontend differs from canonical source');
assert.match(sourceText,/const CARD_VERSION = '4\.09\.03';/,'V4.09.03 card version missing');
assert.match(sourceText,/const CARD_DISPLAY_VERSION = '4\.09\.03';/,'V4.09.03 display version missing');
assert.match(sourceText,/V4\.09\.03-DEV-2026-09-20/,'V4.09.03 build marker missing');

for(const needle of [
  'data-map-display-mode="standard"',
  'data-map-display-mode="large"',
  'data-map-display-mode="fullscreen"',
  'id="settings-map-window-open"',
  'id="map-fullscreen-dialog"',
  'id="map-compass-overlay"',
  '_bindMapDisplayControls()',
  '_positionMapCompassOverlay',
  "MAP_WINDOW_QUERY_KEY = 'gewitterradar_window'",
  "MAP_WINDOW_VERSION_QUERY_KEY = 'gewitterradar_window_version'",
  "Kartenansicht",
  "map-window-host",
  "MAP_STARTUP_MODE_STORAGE_KEY = 'gewitterradar:v409:startup-map-display'",
  "MAP_LAST_DISPLAY_MODE_STORAGE_KEY = 'gewitterradar:v409:last-map-display-mode'",
  'id="map-display-menu-toggle"',
  'id="map-display-control"',
  'class="map-layer-symbol-layer gold"',
  'class="map-layer-symbol-layer blue"',
  'class="map-layer-symbol-layer red"',
  'id="settings-map-startup-mode"',
  '_setMapStartupMode(mode)',
  '_positionMapDisplayControl()',
  'id="map-location-overlay"',
  '_attachLocationToMapOverlay()',
  '_restoreLocationFromMapOverlay()',
  '.map-display-fab.menu-open',
  '[data-warning-test][hidden]',
  'width:clamp(189px,31.2vmin,390px)',
  'width:clamp(172px,46.8vmin,299px)',
  "MAP_COMPASS_VISIBLE_STORAGE_KEY = 'gewitterradar:v409:map-compass-visible'",
  "MAP_MEDALLION_POSITION_STORAGE_KEY = 'gewitterradar:v409:map-medallion-position'",
  "MAP_MEDALLION_VISIBLE_STORAGE_KEY = 'gewitterradar:v409:map-medallion-visible'",
  'id="map-instrument-controls"',
  'id="map-compass-toggle"',
  'id="map-medallion-toggle"',
  'id="map-medallion-overlay"',
  '_positionMapMedallionOverlay',
  '_persistMapMedallionPosition',
  '_setMapInstrumentVisible(kind,visible)',
  'position:absolute;z-index:2147483647;width:44px;height:44px',
  '#map-fullscreen-dialog .location-dropdown { z-index:2147483645; }'
]) assert.ok(sourceText.includes(needle),'V4.09 map-display contract missing: '+needle);
assert.ok(!sourceText.includes('Large, XL and Fullscreen'),'Removed XL map-size scope returned');
assert.ok(!sourceText.includes('class="map-display-bar"'),'Old wide map display bar returned');
assert.ok(!sourceText.includes('Standard, Groß, XL und Vollbild'),'Obsolete German XL release-history plan returned');
assert.ok(!sourceText.includes('Map size: Standard, Large and Fullscreen.'),'Obsolete V4.09 planning block returned');
assert.ok(sourceText.includes('V4.09.03 · DEV · 2026/09'),'V4.09.03 DEV release-history entry missing');

const frozenRelease=JSON.parse((await read('tests/contracts/frontend-release-v4.08.json')).toString('utf8'));
assert.equal(frozenRelease.version,'4.08','Frozen V4.08 release contract version changed');
assert.equal(frozenRelease.sha256,'b75390652fae4aa98c77162fb207d97ece408ab617bbf107bcb0f3b9466a691f','Frozen V4.08 release SHA changed');

const localeSource=await read('frontend/locales/about-locales.js');
for(const relative of [
  'custom_components/gewitterradar/frontend/locales/about-locales.js',
  'dashboard/dist/locales/about-locales.js'
]) assert.ok(localeSource.equals(await read(relative)),relative+' differs from canonical locale source');
assert.equal(hash(localeSource),frozenRelease.localeSha256,'Protected About locale payload changed');

const inventory=JSON.parse((await read('frontend/assets.json')).toString('utf8'));
for(const asset of inventory){
  const canonical=await read('frontend/'+asset.file);
  assert.equal(hash(canonical),asset.sha256,'Canonical asset hash changed: '+asset.file);
  assert.ok(canonical.equals(await read('custom_components/gewitterradar/frontend/'+asset.file)),'Integration asset differs: '+asset.file);
  assert.ok(canonical.equals(await read('dashboard/dist/'+asset.file)),'Dashboard asset differs: '+asset.file);
}

console.log('PASS: V4.09.03 floating map-view control, per-device startup contract, delivery parity and protected V4.08 assets/locales.');
