import assert from "node:assert/strict";
import {decideV2RegionalRetention,v2RenderedSourceValidity}
 from "../frontend/modules/weather/precipitation-layer.js";

// RF04: retain a mounted, fully drawn mosaic only while WR explicitly
// authorizes it. GR must not invent 45s/900s age or consent deadlines.
const now=Date.now(),validUntil=new Date(now+1650000).toISOString();
const world={west:-180,east:180,south:-90,north:90};
const regional={west:5,east:16,south:46,north:56};
const wide={west:-10,east:25,south:35,north:65};
const layer=(id,coverage,cls="current")=>({
 source_id:id,resource_type:"raster_tile",freshness_class:cls,
 coverage_scope:"bbox",coverage_verified:true,coverage,
 tile_url:"https://example.invalid/{z}/{x}/{y}.png",
 render:{tile_size:256,min_zoom:0,max_zoom:11,opacity:.58},
 attribution:id,legend:{title:id},
 semantics:{quantity:"precipitation_rate",unit:"mm/h",
 measurement_method:cls==="current"?"radar":"satellite_estimate",
 observation_kind:cls==="current"?"observation":"estimate"},
 times:{valid_at:new Date(now-1200000).toISOString(),retrieved_at:new Date(now).toISOString(),
 age_seconds:1200,reference_delta_seconds:0,valid_until:validUntil}
});
const nasa=layer("nasa",world,"older_background");
const dwd=layer("dwd",regional);
const old={contract_version:2,status:"partial",layers:[nasa,dwd]};
const next={contract_version:2,status:"partial",layers:[dwd]};
const base={previous:old,next,viewport:wide,zoom:7,now,previousAt:now-500000,
 drawnTiles:12,uncoveredTiles:0,previousMounted:true};
const decide=extra=>decideV2RegionalRetention({...base,...extra});
const kept=decide();
assert.equal(kept.retain,true,kept.reason);
assert.equal(kept.deadlineAt,Date.parse(validUntil));
assert.equal(kept.reason,"waiting_for_complete_replacement");
assert.equal(decide({existingHold:{startedAt:now-15000}}).deadlineAt,kept.deadlineAt);
assert.equal(decide({now:now+900001}).retain,true,"local 900s must not expire authorized tiles");
assert.equal(decide({now:Date.parse(validUntil)+1}).retain,false);
assert.equal(decide({drawnTiles:0}).retain,false);
assert.equal(decide({uncoveredTiles:1}).retain,false);
assert.equal(decide({previousMounted:false}).retain,false);
assert.equal(decide({next:{...next,status:"ready"}}).retain,false);
assert.equal(decide({next:old}).retain,false,"do not hold if replacement coverage is complete");
assert.equal(v2RenderedSourceValidity(dwd,now-900000,{now}).valid,true);
assert.equal(v2RenderedSourceValidity({...dwd,times:{...dwd.times,valid_until:undefined}},now,{now}).valid,false);
console.log("RF04 WR-valid_until-driven retention and complete replacement PASS");
