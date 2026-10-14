// P7-010 synthetic proof only: no live provider/network request.
import assert from "node:assert/strict";
import {validMosaicBounds,viewportOverlapFraction,planRasterMosaic} from "../src/p7-010/mosaic-planner.js";

const viewport={west:-90,south:15,east:8,north:56};
const local={scope:"bbox",bbox:{west:5,south:46,east:16,north:56}};
assert.equal(validMosaicBounds(viewport),true);
assert.ok(viewportOverlapFraction(viewport,local)>0);
assert.ok(viewportOverlapFraction(viewport,local)<0.01,"tiny German edge may not be a world foundation");
const timestamp="2026-10-14T14:00:00Z";
const now="2026-10-14T14:06:00Z";
const metadata={quantity:"precipitation_rate",unit:"mm/h",measurement_method:"satellite_estimate",observation_kind:"observation"};
const mk=(source_id,coverage,valid_at=timestamp,semantics=metadata)=>({
  source_id,coverage,verified_coverage:true,eligible:true,resource_type:"raster_tile",
  valid_at,semantics,attribution:source_id,legend:{unit:semantics.unit}
});
const broad=mk("provider_region_earth",{scope:"global"});
const regional=mk("provider_region_one",local,timestamp,{...metadata,measurement_method:"radar"});
const result=planRasterMosaic([regional,broad],{viewport,now,maxAgeMs:900,maxLayers:4});
assert.equal(result.layers.length,2);
assert.equal(result.layers[0].source_id,"provider_region_earth");
assert.equal(result.layers[0].role,"broad_foundation");
assert.equal(result.layers[1].role,"regional_overlay");
assert.equal(result.layers[1].method_compatible_with_foundation,false);
assert.equal(result.layers[1].time_aligned,true);
assert.equal(result.coverage_complete_proven,false);
const old=mk("old_source",{scope:"global"},"2026-10-14T12:00:00Z");
const unknown=mk("no_time",{scope:"global"},null);
assert.equal(planRasterMosaic([old,unknown],{viewport,now,maxAgeMs:900}).layers.length,0);
assert.equal(planRasterMosaic([{...broad,verified_coverage:false}],{viewport,now,maxAgeMs:900}).layers.length,0);
const other=mk("provider_region_two",{scope:"bbox",bbox:{west:-85,south:16,east:-60,north:35}},"2026-10-14T14:02:00Z");
const fourth=mk("provider_region_three",{scope:"bbox",bbox:{west:-70,south:20,east:-50,north:42}},"2026-10-14T14:04:00Z");
const expanded=planRasterMosaic([broad,regional,other,fourth],{viewport,now,maxAgeMs:900,maxLayers:4});
assert.equal(expanded.layers.length,4,"dynamic regional providers must not be hardcoded");
assert.equal(expanded.layers[0].source_id,"provider_region_earth");
assert.equal(expanded.layers.find(x=>x.source_id==="provider_region_three").reference_delta_seconds,0);
const limited=planRasterMosaic([broad,regional,other,fourth],{viewport,now,maxAgeMs:900,maxLayers:2});
assert.equal(limited.layers.length,2);
assert.equal(limited.rejected.filter(x=>x.reason==="resource_limit").length,2);
assert.ok(viewportOverlapFraction({west:170,south:-20,east:-170,north:20},
 {scope:"bbox",bbox:{west:175,south:-5,east:-175,north:5}})>0);
assert.equal(viewportOverlapFraction({west:-180,south:-70,east:180,north:70},{scope:"global"}),1);
console.log("P7-010 provider-neutral geospatial and time-aware mosaic plan PASS");
