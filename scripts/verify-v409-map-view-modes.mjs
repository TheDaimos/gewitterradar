import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

const root=process.cwd();
const files=['frontend/gewitterradar.js','custom_components/gewitterradar/frontend/gewitterradar.js','dashboard/dist/gewitterradar.js'];
const sources=await Promise.all(files.map(file=>readFile(resolve(root,file),'utf8')));
if(!sources.every(source=>source===sources[0]))throw Error('V4.09.01 delivery parity failed');

const source=sources[0];
const contract=JSON.parse(await readFile(resolve(root,'tests/contracts/frontend-candidate-v4.09.01.json'),'utf8'));
const digest=createHash('sha256').update(Buffer.from(source,'utf8')).digest('hex');
const size=Buffer.byteLength(source,'utf8');
if(digest!==contract.sha256||size!==contract.sizeBytes)throw Error('V4.09.01 candidate identity mismatch');

const required=[
  "const CARD_VERSION = '4.09.01';",
  "const CARD_DISPLAY_VERSION = '4.09.01 DEV';",
  "const GEWITTERRADAR_BUILD = 'V4.09.01-MAP-VIEW-MODES-2026-09-20';",
  'id="map-view-standard"',
  'id="map-view-large"',
  'id="map-view-fullscreen"',
  'id="settings-map-window"',
  'id="fullscreen-compass-overlay"',
  'id="fullscreen-compass-drag"',
  '.map-card.map-view-large #map',
  '.map-card.map-view-fullscreen',
  'height:100dvh',
  "_setMapViewMode('standard')",
  "_setMapViewMode('large')",
  "_setMapViewMode('fullscreen')",
  '_mountFullscreenCompassOverlay()',
  '_restoreFullscreenCompassOverlay()',
  "localStorage.setItem('gewitterradar:v409:fullscreen-compass-position'",
  'fullscreenCompassDrag.setPointerCapture(event.pointerId)',
  "fullscreenCompassDrag?.addEventListener('pointermove'",
  "targetUrl.searchParams.set('gewitterradar_window','map')",
  "window.open(targetUrl.toString(),'gewitterradar-map-window'",
  "this.shadow.getElementById('map-view-switch')",
];
for(const marker of required)if(!source.includes(marker))throw Error('V4.09.01 feature guard missing: '+marker);

for(const key of ['map.view_standard','map.view_large','map.view_fullscreen','map.view_size_aria','settings.map_display','settings.map_display_sub','settings.map_window_label','settings.open_map_window']){
  const needle1="'"+key+"':";
  const needle2='"'+key+'":';
  const count=source.split(needle1).length-1 + source.split(needle2).length-1;
  if(count!==19)throw Error('V4.09.01 locale coverage for '+key+': expected 19, got '+count);
}

const release=JSON.parse(await readFile(resolve(root,'tests/contracts/frontend-release-v4.08.json'),'utf8'));
if(release.version!=='4.08'||release.sha256!=='b75390652fae4aa98c77162fb207d97ece408ab617bbf107bcb0f3b9466a691f')throw Error('Frozen V4.08 release contract changed');

console.log('PASS: V4.09.01 map view modes, separate-window path, movable fullscreen compass, 19-locale coverage and delivery parity verified.');
