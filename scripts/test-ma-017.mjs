import assert from "node:assert/strict";
import {test} from "node:test";
import {createLocationPort,formatCoordinates,parseCoordinates} from "../frontend/modules/monitored-areas/location-port.js";
const legacy={listPlaces:async()=>[{name:"Local To-do"}],saveCandidate:async()=>({source:"todo"})};
const calls=[];
const hass={callWS:async req=>{
  calls.push(req);
  if(req.type.endsWith("/status"))return {capabilities:{saved_places_mode:"db_active"}};
  if(req.type.endsWith("/places_list"))return {mode:"db_active",places:[]};
  return {location:{location_id:"opaque",revision:1}};
}};

test("copy/paste coordinates validates WGS84 and locale-style separators",()=>{
  assert.equal(formatCoordinates({latitude:53.125,longitude:9.5}),"53.125000, 9.500000");
  assert.deepEqual(parseCoordinates("53.125000, 9.500000"),{latitude:53.125,longitude:9.5});
  assert.deepEqual(parseCoordinates("-12.2; +100.4"),{latitude:-12.2,longitude:100.4});
  for(const x of ["", "NaN, 2", "91, 5", "0, 181", "52,5", "a, b"]) {
    assert.throws(()=>parseCoordinates(x),/MA_INVALID_COORDINATES/);
  }
});
test("DB-active create and revision update use P02 API, not client-side DB",async()=>{
  calls.length=0;
  const port=createLocationPort({hass,profileId:"profile-1",legacy});
  assert.equal(await port.reconcileMode(),"db_active");
  await port.saveCandidate({name:"Site",latitude:53,longitude:9},"request-uuid");
  const create=calls.at(-1);
  assert.equal(create.type,"gewitterradar/monitored_areas/location_create");
  assert.equal(create.request.request_id,"request-uuid");
  assert.deepEqual(create.request.payload,{name:"Site",lat:53,lon:9});
  await port.renamePlace("location-uuid","Renamed",3,"request-uuid2");
  const rename=calls.at(-1);
  assert.equal(rename.type,"gewitterradar/monitored_areas/location_update");
  assert.equal(rename.request.expected_revision,3);
  assert.equal(rename.request.request_id,"request-uuid2");
  assert.equal(rename.request.payload.name,"Renamed");
  assert.equal((await port.listPlaces("A")).mode,"db_active");
});
test("no premature SQLite writes, no silent fallback on DB error",async()=>{
  const port=createLocationPort({hass,profileId:"profile-1",legacy});
  assert.deepEqual(await port.saveCandidate({name:"old"}),{source:"todo"});
  await assert.rejects(port.renamePlace("loc","bad",1,"id"),/MA_PLACE_DB_NOT_ACTIVE/);
  const bad={callWS:async req=>req.type.endsWith("/status")?
    {capabilities:{saved_places_mode:"db_active"}}:Promise.reject(new Error("DB_OFFLINE"))};
  const active=createLocationPort({hass:bad,profileId:"profile-1",legacy});
  await active.reconcileMode();
  await assert.rejects(active.listPlaces("Site"),/DB_OFFLINE/);
  await assert.rejects(active.saveCandidate({name:"Bad",latitude:Infinity,longitude:3},"id"),
                       /MA_INVALID_COORDINATES/);
});
