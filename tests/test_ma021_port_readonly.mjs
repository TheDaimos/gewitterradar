// MA-021 authenticated location_get is available only after verified cutover.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const path=new URL('../frontend/modules/monitored-areas/location-port.js',import.meta.url);
const {createLocationPort}=await import('data:text/javascript;base64,'+Buffer.from(readFileSync(path)).toString('base64'));
const locationId='1d5e22ae-933f-4e51-9b51-7ad2a6a987ba';
const calls=[];
let mode='migration_pending';
const hass={callWS:async request=>{
  calls.push(request);
  if(request.type.endsWith('/status'))return {capabilities:{saved_places_mode:mode}};
  if(request.type.endsWith('/location_get'))return {location:{location_id:locationId,name:'Havanna',lat:23.1136,lon:-82.3666}};
  throw Error('unexpected_command');
}};
const nope=()=>{throw Error('legacy_not_ready')};
const port=createLocationPort({hass,profileId:'profile-one',legacy:{listPlaces:nope,saveCandidate:nope}});
await port.reconcileMode();
await assert.rejects(port.getLocation(locationId),/MA_PLACE_DB_NOT_ACTIVE/);
assert.equal(calls.filter(x=>x.type.endsWith('/location_get')).length,0,'no sqlite read before final cutover');
mode='db_active';
await port.reconcileMode();
const place=await port.getLocation(locationId);
assert.equal(place.name,'Havanna');
const request=calls.find(x=>x.type.endsWith('/location_get'));
assert.equal(request.request.profile_id,'profile-one');
assert.deepEqual(request.request.payload,{location_id:locationId});
assert.equal(request.request.request_id,undefined,'read-only request must never claim write receipt');
await assert.rejects(port.getLocation('not-a-uuid'),/MA_INVALID_REQUEST/);
const invalid=createLocationPort({hass:{callWS:async request=>
  request.type.endsWith('/status')?{capabilities:{saved_places_mode:'db_active'}}:
  {location:{location_id:'wrong'}}},profileId:'profile-two',
  legacy:{listPlaces:nope,saveCandidate:nope}});
await invalid.reconcileMode();
await assert.rejects(invalid.getLocation(locationId),/MA_PLACE_INVALID_RESPONSE/);
console.log('PASS MA-021 profile-scoped SQLite detail read gate, no pending access and no mutation receipt');
