import assert from "node:assert/strict";
import {GEWITTERRADAR_ROUTING_INTENTS, resolveGewitterradarIntent} from "../src/p7-010/intent-contract.js";

const callLog = [];
const consumer = {
  async resolve(capability, context, options) {
    callLog.push({capability, context, options});
    const resourceType = Object.values(GEWITTERRADAR_ROUTING_INTENTS)
      .find(item=>item.capability===capability)?.resourceType;
    return {status:"ready", capability, resource:{type:resourceType, payload:{}},
      provenance:{provider_id:"opaque-test-value"}};
  }
};
const point = {type:"point",latitude:52.52,longitude:13.405};
const bbox = {type:"bbox",west:13.0,south:52.0,east:14.0,north:53.0};
const out = await resolveGewitterradarIntent(consumer,"officialTornadoWarnings",point);
assert.equal(out.status,"ready");
assert.equal(out.intentKey,"officialTornadoWarnings");
assert.deepEqual(callLog[0].options.eventFilter.hazard_types, ["tornado","waterspout"]);
assert.equal(callLog[0].capability,"weather.warning.official");
assert.equal(callLog[0].context,point);
assert.deepEqual(Object.keys(callLog[0].options),["eventFilter"]);
await resolveGewitterradarIntent(consumer,"observedLightningEvents",bbox);
assert.equal(callLog.at(-1).capability,"weather.lightning.observed.events");
assert.deepEqual(callLog.at(-1).options,{});
await resolveGewitterradarIntent(consumer,"observedLightningDensity",bbox);
assert.equal(callLog.at(-1).capability,"weather.lightning.observed.density");
assert.equal(callLog.at(-1).options.eventFilter,undefined);
const before = callLog.length;
assert.equal((await resolveGewitterradarIntent(consumer,"unknown",point)).unavailable.code,"unsupported_intent");
assert.equal((await resolveGewitterradarIntent(consumer,"thunderProbability",bbox)).unavailable.code,"unsupported_context");
assert.equal(callLog.length,before);
const denied = await resolveGewitterradarIntent({resolve: async()=>({status:"unavailable",unavailable:{code:"profile_filtered"}})},"observedLightningEvents",point);
assert.equal(denied.unavailable.code,"profile_filtered");
const wrong = await resolveGewitterradarIntent({resolve:async()=>({status:"ready",capability:"weather.warning.official",resource:{type:"value",payload:{}}})},"officialHailWarnings",point);
assert.equal(wrong.unavailable.code,"resource_type_mismatch");
const exception = await resolveGewitterradarIntent({resolve:async()=>{throw Error("offline")}},"officialHailWarnings",point);
assert.equal(exception.unavailable.code,"resolver_error");
assert.equal((await resolveGewitterradarIntent({resolve:async()=>null},"officialHailWarnings",point)).unavailable.code,"invalid_response");
assert.deepEqual(GEWITTERRADAR_ROUTING_INTENTS.precipitation.contexts,["bbox"]);
assert.equal(Object.values(GEWITTERRADAR_ROUTING_INTENTS).some(x=>x.capability.includes("dwd")||x.capability.includes("noaa_nws")),false);
console.log("P7-010: 10 providerneutrale Intent-Verträge, Filter, Profil-Ausschlüsse und Fail-Closed: PASS");
