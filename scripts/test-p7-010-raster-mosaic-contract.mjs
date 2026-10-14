import assert from "node:assert/strict";
import {validateRasterMosaicV2} from "../src/p7-010/raster-mosaic-contract.js";
const BASE={contract_version:2,capability:"weather.precipitation.layer",
 status:"partial",viewport:{west:-180,south:-70,east:180,north:70},
 reference_time:"2026-10-14T15:00:00Z"};
const mk=(name,scope="bbox")=>({
 source_id:name,resource_type:"raster_tile",coverage_verified:true,
 coverage_scope:scope,coverage:scope==="global"
 ?{west:-180,south:-90,east:180,north:90}
 :{west:5,south:46,east:16,north:56},
 tile_url:"https://example.invalid/{z}/{x}/{y}.png",
 attribution:name,legend:{title:"Niederschlag"},
 semantics:{quantity:"precipitation_rate",unit:"mm/h",
  measurement_method:"radar",observation_kind:"observation"},
 times:{valid_at:"2026-10-14T15:00:00Z",retrieved_at:"2026-10-14T15:01:00Z",
  reference_delta_seconds:0},
});
const one={...BASE,layers:[mk("broad","global"),mk("regional")]};
assert.equal(validateRasterMosaicV2(one),one);
assert.throws(()=>validateRasterMosaicV2({...one,contract_version:1}));
assert.throws(()=>validateRasterMosaicV2({...one,layers:Array(5).fill(mk("x"))}));
assert.throws(()=>validateRasterMosaicV2({...one,layers:[{...mk("x"),coverage_verified:false}]}));
assert.throws(()=>validateRasterMosaicV2({...one,layers:[{...mk("x"),tile_url:"https://example.invalid?access_token=x"}]}));
assert.throws(()=>validateRasterMosaicV2({...one,layers:[{...mk("x"),times:{...mk("x").times,valid_at:null}}]}));
assert.throws(()=>validateRasterMosaicV2({...one,layers:[mk("x"),mk("x")]}));
assert.throws(()=>validateRasterMosaicV2({...one,layers:[{...mk("x"),coverage_scope:"imaginary"}]}));
const empty={...BASE,status:"unavailable",layers:[]};
assert.equal(validateRasterMosaicV2(empty),empty);
assert.throws(()=>validateRasterMosaicV2({...empty,layers:[mk("bad")]}));
console.log("P7-010 pure GR V2 response contract validation PASS");
