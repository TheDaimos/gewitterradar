import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {validateRasterMosaicV2} from "../src/p7-010/raster-mosaic-contract.js";
// Contract source is identical across source-of-truth and both delivered apps.
const validatorPaths=[
 "../src/p7-010/raster-mosaic-contract.js",
 "../frontend/modules/weather/p7-010/raster-mosaic-contract.js",
 "../dashboard/dist/modules/weather/p7-010/raster-mosaic-contract.js",
 "../custom_components/gewitterradar/frontend/modules/weather/p7-010/raster-mosaic-contract.js"
];
const validatorSource=await readFile(new URL(validatorPaths[0],import.meta.url),"utf8");
for(const path of validatorPaths.slice(1))
 assert.equal(await readFile(new URL(path,import.meta.url),"utf8"),validatorSource,
   "delivered V2 world-BBOX validator must match the source of truth: "+path);
const BASE={contract_version:2,capability:"weather.precipitation.layer",
 status:"partial",viewport:{west:-180,south:-70,east:180,north:70},
 reference_time:"2026-10-14T15:00:00Z"};
const mk=(name,scope="bbox")=>({
 source_id:name,resource_type:"raster_tile",coverage_verified:true,
 coverage_scope:scope,coverage:scope==="global"
 ?{west:-180,south:-90,east:180,north:90}
 :{west:5,south:46,east:16,north:56},
 render:{tile_size:256,min_zoom:0,max_zoom:18,opacity:1},
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
assert.throws(()=>validateRasterMosaicV2({...one,layers:[
  {...mk("bad-native"),render:{tile_size:4096,min_zoom:0,max_zoom:18,opacity:1}}
]}));
assert.throws(()=>validateRasterMosaicV2({...one,layers:[
  {...mk("bad-range"),render:{tile_size:256,min_zoom:17,max_zoom:7,opacity:1}}
]}));
assert.equal(validateRasterMosaicV2({...one,layers:[
  {...mk("native-512"),render:{tile_size:512,min_zoom:2,max_zoom:14,opacity:0.6}}
]}).layers[0].render.opacity,0.6);

assert.equal(validateRasterMosaicV2({...one,layers:[
  {...mk("reflectivity"),semantics:{...mk("x").semantics,
    quantity:"radar_reflectivity",unit:null}}
]}).layers[0].semantics.unit,null);
assert.throws(()=>validateRasterMosaicV2({...one,layers:[
  {...mk("badunit"),semantics:{...mk("x").semantics,unit:17}}
]}));
assert.throws(()=>validateRasterMosaicV2({...one,layers:[{...mk("x"),coverage_scope:"imaginary"}]}));
const empty={...BASE,status:"unavailable",layers:[]};
assert.equal(validateRasterMosaicV2(empty),empty);
assert.throws(()=>validateRasterMosaicV2({...empty,layers:[mk("bad")]}));
// Older global satellite images are permitted only by the explicitly
// requested separate background ceiling; never by relaxing live radar freshness.
const satellite={...mk("nasa_background","global"),
 semantics:{...mk("x").semantics,measurement_method:"satellite_precipitation_estimate",observation_kind:"estimate"},
 freshness_class:"older_background",quality_note:"older_satellite_background",
 times:{...mk("x").times,age_seconds:22000,reference_delta_seconds:22000,observed_at:null}
};
const partial={...one,layers:[satellite,mk("dwd_fresh")]};
assert.throws(()=>validateRasterMosaicV2(partial,{maxLayers:12}),TypeError);
assert.equal(validateRasterMosaicV2(partial,{maxLayers:12,maxDataAgeSeconds:900,maxBackgroundAgeSeconds:43200}),partial);

const world={west:-180,east:180,south:-90,north:90};
const olderWorldBbox={...satellite,coverage_scope:"bbox",coverage:{...world}};
const worldBboxMosaic={...partial,layers:[olderWorldBbox,mk("dwd_fresh")]};
// NASA's product-specific world BBOX remains a BBOX on the wire; it is
// eligible as an opt-in older satellite estimate but not reclassified.
assert.equal(validateRasterMosaicV2(worldBboxMosaic,{
 maxLayers:12,maxDataAgeSeconds:900,maxBackgroundAgeSeconds:43200
}),worldBboxMosaic);
assert.equal(worldBboxMosaic.layers[0].coverage_scope,"bbox");
assert.equal(worldBboxMosaic.status,"partial");
assert.throws(()=>validateRasterMosaicV2(worldBboxMosaic,{maxLayers:12}),TypeError,
 "never enable older background implicitly");
assert.throws(()=>validateRasterMosaicV2({...worldBboxMosaic,layers:[
 {...olderWorldBbox,coverage_verified:false},mk("fresh")
]},{maxLayers:12,maxBackgroundAgeSeconds:43200}),TypeError,
 "only WR-verified product BBOX is eligible");
// Keep the earlier regional-BBOX rejection explicitly in place.
assert.throws(()=>validateRasterMosaicV2({...partial,layers:[{...satellite,coverage_scope:"bbox",coverage:{west:5,east:16,south:46,north:56}}]},
 {maxLayers:12,maxBackgroundAgeSeconds:43200}),TypeError);
// Almost-full, half-world and non-product BBOX claims are NOT world coverages.
for(const coverage of [
 {...world,west:-179.999},
 {...world,east:179.999},
 {...world,south:-89.999},
 {...world,north:89.999},
 {west:-180,east:180,south:46,north:56},
]){
 assert.throws(()=>validateRasterMosaicV2({...worldBboxMosaic,layers:[
   {...olderWorldBbox,coverage},mk("fresh")
 ]},{maxLayers:12,maxBackgroundAgeSeconds:43200}),TypeError);
}
// An older *regional* DWD radar is never an eligible older satellite base.
assert.throws(()=>validateRasterMosaicV2({...partial,layers:[{
 ...mk("dwd_radar_old"),freshness_class:"older_background",
 quality_note:"older_satellite_background",
 times:{...mk("dwd_radar_old").times,age_seconds:22000}
}]},{maxLayers:12,maxBackgroundAgeSeconds:43200}),TypeError);
assert.throws(()=>validateRasterMosaicV2({...worldBboxMosaic,layers:[
 {...olderWorldBbox,times:{...olderWorldBbox.times,age_seconds:46800}}
]},{maxLayers:12,maxBackgroundAgeSeconds:43200}),TypeError,
 "older than 12 hours is forbidden");
assert.throws(()=>validateRasterMosaicV2({...worldBboxMosaic,layers:[
 {...olderWorldBbox,quality_note:"current"}
]},{maxLayers:12,maxBackgroundAgeSeconds:43200}),TypeError);
assert.throws(()=>validateRasterMosaicV2({...worldBboxMosaic,layers:[
 {...olderWorldBbox,semantics:{...olderWorldBbox.semantics,measurement_method:"radar"}}
]},{maxLayers:12,maxBackgroundAgeSeconds:43200}),TypeError);
assert.throws(()=>validateRasterMosaicV2({...partial,layers:[{...satellite,semantics:{...satellite.semantics,observation_kind:"observation"}}]},
 {maxLayers:12,maxBackgroundAgeSeconds:43200}),TypeError);
assert.throws(()=>validateRasterMosaicV2({...partial,layers:[{...satellite,times:{...satellite.times,age_seconds:50000}}]},
 {maxLayers:12,maxBackgroundAgeSeconds:43200}),TypeError);
assert.throws(()=>validateRasterMosaicV2(partial,{maxLayers:12,maxDataAgeSeconds:900,maxBackgroundAgeSeconds:800}),TypeError);
assert.throws(()=>validateRasterMosaicV2({...partial,layers:[{...satellite,times:{...satellite.times,valid_at:"2026-10-14T15:00:00"}}]},
 {maxLayers:12,maxBackgroundAgeSeconds:43200}),TypeError);

console.log("P7-010 pure GR V2 response contract validation PASS");
