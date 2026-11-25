import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {cleanupReminderReady,initializeMonitoredAreas,CLEANUP_DISMISSED,LEGACY_LIST,MODULE_META} from '../frontend/modules/monitored-areas/index.js';

assert.equal(CLEANUP_DISMISSED,'gewitterradar-ma020-cleanup-dismissed');
assert.equal(LEGACY_LIST,'todo.gewitterradar_orte');
assert.equal(MODULE_META.version,'0.2.0');
assert.equal(cleanupReminderReady({mode:'migration_pending',listPresent:true,dismissed:false}),false);
assert.equal(cleanupReminderReady({mode:'db_active',listPresent:true,dismissed:false}),true);
assert.equal(cleanupReminderReady({mode:'db_active',listPresent:true,dismissed:true}),false);
assert.equal(cleanupReminderReady({mode:'db_active',listPresent:false,dismissed:false}),false);
assert.equal(cleanupReminderReady({mode:'db_active',listPresent:null,dismissed:false}),false);
const owner={};
assert.equal(initializeMonitoredAreas(owner,false),null);
const src=readFileSync(resolve('frontend/modules/monitored-areas/index.js'),'utf8');
for (const path of [
  'dashboard/dist/modules/monitored-areas/index.js',
  'custom_components/gewitterradar/frontend/modules/monitored-areas/index.js'
]) assert.equal(readFileSync(resolve(path),'utf8'),src,path+' mirror drift');
for (const path of ['frontend/module-manifest.js','dashboard/dist/module-manifest.js',
                    'custom_components/gewitterradar/frontend/module-manifest.js']) {
  const content=readFileSync(resolve(path),'utf8');
  assert.match(content,/"id": "monitored-areas.lifecycle",\s*"version": "0.2.0"/);
}
const ui=readFileSync(resolve('frontend/modules/ui/controls.js'),'utf8');
for (const path of ['dashboard/dist/modules/ui/controls.js','custom_components/gewitterradar/frontend/modules/ui/controls.js'])
  assert.equal(readFileSync(resolve(path),'utf8'),ui,path+' mirror drift');
assert.match(ui,/maPort\.listPlaces/);
assert.match(ui,/maPort\.saveCandidate/);
assert.match(ui,/MA_DB_SOFT_DELETE_NOT_YET_AVAILABLE/);
console.log('MA-020 optional startup reminder, location cutover and mirror contracts PASS');
