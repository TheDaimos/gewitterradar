// MA-023 contract and pure model tests. Runs without browser or Home Assistant.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const root=new URL('../',import.meta.url);
const file=readFileSync(new URL('frontend/modules/monitored-areas/location-manager.js',root),'utf8');
const mirror=readFileSync(new URL('custom_components/gewitterradar/frontend/modules/monitored-areas/location-manager.js',root),'utf8');
assert.equal(file,mirror,'installed source mirror must be identical');
const module=await import('data:text/javascript;base64,'+Buffer.from(file).toString('base64'));
const place={uid:'a',name:'Havanna',latitude:23.1136,longitude:-82.3666,revision:1};
const archived={...place,uid:'b',name:'Kiel'};
let result=module.planLocations({enabled:false,mode:'db_active',places:[place],removed:[archived]});
assert.equal(result.mode,'legacy','browser flags alone cannot activate database mode');
assert.equal(result.canRename,false);
result=module.planLocations({enabled:true,mode:'migration_pending',places:[place],removed:[]});
assert.equal(result.mode,'migration_pending');
assert.equal(result.canRename,false,'migration must remain read-only');
result=module.planLocations({enabled:true,mode:'db_active',
  places:[place,{...place}, {...place,uid:'bad',latitude:900}],removed:[archived]});
assert.equal(result.mode,'db_active');
assert.equal(result.active.length,1,'deduplicate and reject invalid coordinates');
assert.equal(result.archived.length,1,'archived places remain visible and restorable');
assert.equal(result.canRename,true);
assert.equal(module.planLocations({enabled:true,mode:'db_active',places:[{uid:'x',latitude:NaN,longitude:10}]}).active.length,0);
for(const term of ['refresh','rename','archive','restore','focus']){
 assert.match(file,new RegExp('\\b'+term+'\\b'));
}
const controls=readFileSync(new URL('frontend/modules/ui/controls.js',root),'utf8');
assert.match(controls,/import \{openLocationManager\} from '\.\.\/monitored-areas\/location-manager\.js\?v=41421r1'/);
assert.match(controls,/gr-ma-manage-action/);
assert.match(controls,/this\._config\?\.monitored_areas_enabled === true/);
assert.match(controls,/port\?\.mode !== 'db_active'/);
assert.match(controls,/this\._map\.flyTo\(\[position\.latitude,position\.longitude\]/);
assert.doesNotMatch(file,/callWS\(|callService\(|localStorage|todo\.update_item|migration_commit/);
assert.doesNotMatch(file,/innerHTML/,'render user-supplied names via textContent only');
console.log('PASS MA-023 model, mode gate, no implicit migration, UI integration and mirror');
