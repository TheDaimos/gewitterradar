import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {test} from "node:test";
const filename=new URL("../frontend/modules/weather/p7-010/raster-mosaic-consumer.js",import.meta.url);
const content=readFileSync(filename,"utf8");
test("GR explicit OPERA selection has fixed exact provider/product",()=>{
 assert.match(content,/source_request:\{provider_id:"opera",product_id:"RATE"\}/);
 assert.match(content,/maxDataAgeSeconds>900/);
});
test("OPERA blocks every response including unexpected positive raster",()=>{
 assert.match(content,/response\?\.raster_approved===true/);
 assert.match(content,/mode:"opera_blocked"/);
 assert.match(content,/fallbackPerformed:false/);
 assert.match(content,/opera_identity_mismatch/);
});
test("legacy V2 request without sourceRequest remains unchanged",()=>{
 assert.match(content,/sourceRequest=null/);
 assert.match(content,/\.\.\.\(sourceRequest!==null\?/);
});
