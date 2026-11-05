import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {test} from "node:test";
import {v2RenderedSourceValidity,weatherRadarActiveCoverage} from "../frontend/modules/weather/precipitation-layer.js";

const root=new URL("../",import.meta.url);
const paths=[
 "frontend/modules/weather/precipitation-layer.js",
 "custom_components/gewitterradar/frontend/modules/weather/precipitation-layer.js",
 "dashboard/dist/modules/weather/precipitation-layer.js",
];

test("shipped modules are identical",()=>{
 const modules=paths.map(p=>readFileSync(new URL(p,root),"utf8"));
 assert.equal(modules[0],modules[1]);
 assert.equal(modules[1],modules[2]);
});

test("GR does not impose a fixed OPERA age deadline",()=>{
 const now=Date.now();
 const layer={coverage_verified:true,coverage:{west:5,east:20,south:45,north:60},
   render:{opacity:0.6,min_zoom:0},freshness_class:"current",
   times:{valid_at:new Date(now-1800_000).toISOString(),age_seconds:1800}};
 const validity=v2RenderedSourceValidity(layer,now,{now:now+5000});
 assert.equal(validity.valid,true);
 assert.equal(validity.expiresAt,null);
});

test("older satellite stays behind separate user consent",()=>{
 const now=Date.now();
 const layer={coverage_verified:true,coverage:{west:-180,east:180,south:-90,north:90},
   render:{opacity:0.6,min_zoom:0},freshness_class:"older_background",
   semantics:{observation_kind:"estimate",measurement_method:"satellite_precipitation_estimate"},
   times:{valid_at:new Date(now-36000_000).toISOString(),age_seconds:36000}};
 assert.equal(v2RenderedSourceValidity(layer,now,{now,satelliteConsent:false}).valid,false);
 assert.equal(v2RenderedSourceValidity(layer,now,{now,satelliteConsent:true}).valid,true);
});
