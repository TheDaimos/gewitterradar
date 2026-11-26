import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {test} from "node:test";
import {createLocationPort} from "../frontend/modules/monitored-areas/location-port.js";

const legacy={listPlaces:async()=>[{name:"Legacy"}],saveCandidate:async()=>({saved:true})};
const calls=[];
const hass={callWS:async(request)=>{
  calls.push(request);
  if(request.type.endsWith("/status"))return {capabilities:{saved_places_mode:"migration_pending"}};
  if(request.type.endsWith("/places_list"))return {mode:"migration_pending",places:[],next_cursor:null};
  throw new Error("UNEXPECTED_COMMAND");
}};

test("OFF/legacy remains authoritative, no DB call",async()=>{
  calls.length=0;
  const port=createLocationPort({hass,profileId:"verified-by-server",legacy});
  assert.deepEqual(await port.listPlaces("Hamburg"),[{name:"Legacy"}]);
  assert.deepEqual(await port.saveCandidate({name:"Hamburg"}),{saved:true});
  assert.equal(calls.length,0);
});
test("pending migration exposes read preview but does not switch saved search",async()=>{
  calls.length=0;
  const port=createLocationPort({hass,profileId:"verified-by-server",legacy});
  assert.equal(await port.reconcileMode(),"migration_pending");
  assert.deepEqual(await port.listPlaces("test"),[{name:"Legacy"}]);
  const preview=await port.previewDbPlaces("test");
  assert.equal(preview.mode,"migration_pending");
  assert.equal(calls.length,2);
});
test("unverified db_active response fails closed without To-do fallback",async()=>{
  const fake={callWS:async req=>req.type.endsWith("/status")?
    {capabilities:{saved_places_mode:"db_active"}}:{mode:"migration_pending",places:[]}};
  const port=createLocationPort({hass:fake,profileId:"profile",legacy});
  assert.equal(await port.reconcileMode(),"db_active");
  await assert.rejects(port.listPlaces("A"),/MA_PLACE_CUTOVER_NOT_VERIFIED/);
});
test("camera-only focus never silently changes reference tracker",()=>{
  let camera=0,tracker=0;
  const port=createLocationPort({legacy,focusMap:()=>{camera++;},selectReference:()=>{tracker++;}});
  port.focusMap({latitude:52,longitude:9,zoomHint:10});
  assert.equal(camera,1);assert.equal(tracker,0);
  port.selectReference({name:"Explicit"});assert.equal(tracker,1);
  assert.throws(()=>port.focusMap({latitude:91,longitude:0}),/MA_INVALID_COORDINATES/);
});
test("runtime mirror content stays byte-identical",()=>{
  const name="modules/monitored-areas/location-port.js";
  const frontend=readFileSync(new URL("../frontend/"+name,import.meta.url),"utf8");
  for(const base of ["../dashboard/dist/","../custom_components/gewitterradar/frontend/"]){
    assert.equal(readFileSync(new URL(base+name,import.meta.url),"utf8"),frontend);
  }
});

test("SQLite archive/restore and archived listing never touch legacy To-do",async()=>{
  const seen=[];
  const db={callWS:async req=>{
    seen.push(req);
    if(req.type.endsWith("/status"))return {capabilities:{saved_places_mode:"db_active"}};
    if(req.type.endsWith("/places_list"))return {mode:"db_active",places:[{location_id:"id",archived:true}],next_cursor:null};
    if(req.type.endsWith("/location_archive"))return {archived:true};
    if(req.type.endsWith("/location_restore"))return {archived:false};
    throw Error("INVALID_CALL");
  }};
  const protectedLegacy={listPlaces:()=>{throw Error("LEGACY_READ");},saveCandidate:()=>{throw Error("LEGACY_WRITE");}};
  const port=createLocationPort({hass:db,profileId:"authorized-profile",legacy:protectedLegacy});
  assert.equal(await port.reconcileMode(),"db_active");
  const records=await port.listPlaces("",null,true);
  assert.equal(records.places[0].archived,true);
  assert.equal(seen.at(-1).request.payload.include_archived,true);
  assert.deepEqual(await port.archivePlace("location-id",3,"request-a"),{archived:true});
  assert.equal(seen.at(-1).type,"gewitterradar/monitored_areas/location_archive");
  assert.equal(seen.at(-1).request.expected_revision,3);
  assert.deepEqual(await port.restorePlace("location-id",3,"request-b"),{archived:false});
  assert.equal(seen.at(-1).type,"gewitterradar/monitored_areas/location_restore");
  await assert.rejects(port.archivePlace("location-id",0,"r"),/MA_INVALID_REQUEST/);
  await assert.rejects(port.listPlaces("",null,"true"),/MA_PLACE_INVALID_REQUEST/);
});
