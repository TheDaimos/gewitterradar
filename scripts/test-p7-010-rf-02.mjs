import assert from "node:assert/strict";
import {decideV2RegionalRetention,v2RenderedSourceValidity,weatherRadarActiveCoverage}
  from "../frontend/modules/weather/precipitation-layer.js";
import {drawVerifiedRasterMosaicTile} from "../src/p7-010/raster-compositor.js";

// RF02: WR is the sole time authority. No local 900-second or 45-second limit.
const now=Date.parse("2026-10-18T15:13:03Z");
const expiry=new Date(now+120000).toISOString();
const region={west:5,east:16,south:46,north:56};
const world={west:-180,east:180,south:-90,north:90};
function layer(id,coverage,kind="current"){
 return {source_id:id,resource_type:"raster_tile",coverage_scope:"bbox",
  coverage_verified:true,coverage,
  tile_url:"https://example.invalid/wms?bbox={bbox-epsg-3857}",
  render:{tile_size:256,min_zoom:0,max_zoom:11,opacity:0.58},
  attribution:id,legend:{title:id},freshness_class:kind,
  semantics:{quantity:"precipitation_rate",unit:"mm/h",
    observation_kind:kind==="older_background"?"estimate":"observation",
    measurement_method:kind==="older_background"?"satellite_estimate":"radar"},
  times:{valid_at:"2026-10-18T09:30:00Z",retrieved_at:"2026-10-18T15:10:06Z",
    age_seconds:21000,reference_delta_seconds:0,valid_until:expiry}};
}
const nasa=layer("nasa/background",world,"older_background");
const dwd=layer("dwd/radar",region);
const previous={status:"partial",layers:[nasa,dwd]};
const next={status:"partial",layers:[nasa]};
const viewport={west:8,east:12,south:48,north:52};
assert.equal(v2RenderedSourceValidity(dwd,now-60000,{now}).valid,true);
assert.equal(v2RenderedSourceValidity({...dwd,times:{...dwd.times,age_seconds:50000}},now-60000,{now}).valid,true,
 "GR must never reject WR-approved data based on local age");
assert.equal(v2RenderedSourceValidity({...dwd,times:{...dwd.times,valid_until:new Date(now-1).toISOString()}},now-60000,{now}).valid,false);
assert.equal(v2RenderedSourceValidity({...dwd,times:{...dwd.times,valid_until:undefined}},now-60000,{now}).reason,"wr_expiry_missing");
const params={previous,next,viewport,zoom:5,now,previousAt:now-60000,
 drawnTiles:15,uncoveredTiles:0,previousMounted:true};
const held=decideV2RegionalRetention(params);
assert.equal(held.retain,false,"same geographic foundation is not a degraded replacement");
const less={...next,layers:[{...nasa,coverage:region}]};
const retained=decideV2RegionalRetention({...params,next:less});
assert.equal(retained.retain,true,retained.reason);
assert.equal(retained.deadlineAt,Date.parse(expiry));
assert.equal(retained.reason,"waiting_for_complete_replacement");
assert.equal(decideV2RegionalRetention({...params,next:less,now:Date.parse(expiry)+1}).retain,false);
assert.equal(decideV2RegionalRetention({...params,next:less,drawnTiles:0}).retain,false);
assert.equal(decideV2RegionalRetention({...params,next:less,previousMounted:false}).retain,false);
assert.equal(decideV2RegionalRetention({...params,next:{...less,status:"unavailable"}}).retain,false);
const painted=[];
const ctx={globalAlpha:1,drawImage:img=>painted.push(img.name)};
drawVerifiedRasterMosaicTile(ctx,{x:16,y:10,z:5},[
 {...nasa,image:{name:"nasa"}},{...dwd,image:{name:"dwd"}}
]);
assert.deepEqual(painted,["nasa","dwd"]);
const shown=weatherRadarActiveCoverage({layer:{},v2Snapshot:previous,v2SnapshotAt:now},viewport,5,now);
assert.ok(shown.fraction>0);
assert.equal(weatherRadarActiveCoverage({layer:{},v2Snapshot:previous,v2SnapshotAt:now},viewport,5,Date.parse(expiry)+1).fraction,0);
console.log("RF02 WR-authorized validity, geographic retention, compositing and explicit expiry PASS");
