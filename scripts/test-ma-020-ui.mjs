import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {cleanupReminderReady,initializeMonitoredAreas,CLEANUP_DISMISSED,LEGACY_LIST,MODULE_META} from '../frontend/modules/monitored-areas/index.js';

assert.equal(CLEANUP_DISMISSED,'gewitterradar-ma020-cleanup-dismissed');
assert.equal(LEGACY_LIST,'todo.gewitterradar_orte');
assert.equal(MODULE_META.version,'0.2.1');
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
  assert.match(content,/"id": "monitored-areas.lifecycle",\s*"version": "0.2.1"/);
}
const ui=readFileSync(resolve('frontend/modules/ui/controls.js'),'utf8');
for (const path of ['dashboard/dist/modules/ui/controls.js','custom_components/gewitterradar/frontend/modules/ui/controls.js'])
  assert.equal(readFileSync(resolve(path),'utf8'),ui,path+' mirror drift');
assert.match(ui,/maPort\.listPlaces/);
assert.match(ui,/maPort\.saveCandidate/);
assert.match(ui,/maPort\.archivePlace/);
assert.match(ui,/maPort\.restorePlace/);
assert.doesNotMatch(ui,/MA_DB_SOFT_DELETE_NOT_YET_AVAILABLE/);
console.log('MA-020 optional startup reminder, location cutover and mirror contracts PASS');

const wizard=readFileSync(resolve('frontend/modules/monitored-areas/migration-wizard.js'),'utf8');
for (const path of [
  'dashboard/dist/modules/monitored-areas/migration-wizard.js',
  'custom_components/gewitterradar/frontend/modules/monitored-areas/migration-wizard.js'
]) assert.equal(readFileSync(resolve(path),'utf8'),wizard,path+' mirror drift');
assert.match(wizard,/migration_preview/);
assert.match(wizard,/migration_commit/);
assert.match(wizard,/migration_finalize_preview/);
assert.match(wizard,/migration_finalize_commit/);
assert.match(wizard,/explicit_final:true/);
assert.match(wizard,/migrationRequestUUID\(\)/);
assert.doesNotMatch(wizard,/Math\.random\(/);
const {migrationRequestUUID}=await import('data:text/javascript;base64,'+Buffer.from(wizard).toString('base64'));
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const fakeCrypto={getRandomValues(bytes){for(let i=0;i<bytes.length;i++)bytes[i]=i;return bytes;}};
const id=migrationRequestUUID(fakeCrypto);
assert.match(id,uuid);
assert.equal(id,'00010203-0405-4607-8809-0a0b0c0d0e0f');
assert.notEqual(migrationRequestUUID({randomUUID:()=> 'from-native'}),'not-native');
assert.equal(migrationRequestUUID({randomUUID:()=> 'from-native'}),'from-native');
assert.throws(()=>migrationRequestUUID({}),/Sichere UUID-Erzeugung nicht verfügbar/);

