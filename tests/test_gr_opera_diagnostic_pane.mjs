import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {test} from "node:test";

const src=readFileSync(new URL("../src/p7-010/opera-diagnostic-tile.js",import.meta.url),"utf8");
const frontend=readFileSync(new URL("../frontend/modules/weather/p7-010/opera-diagnostic-tile.js",import.meta.url),"utf8");

test("OPERA diagnostic source is actually shipped in frontend tree",()=>{
 assert.equal(src,frontend);
 assert.match(frontend,/requestOperaDiagnosticPane/);
 assert.match(frontend,/mountOperaDiagnosticPane/);
});

test("diagnostic requires explicit server identity and scientific denial",()=>{
 assert.match(frontend,/source\.diagnostic!==true/);
 assert.match(frontend,/diagnostic_only!==true/);
 assert.match(frontend,/raster_approved!==false/);
 assert.match(frontend,/scientific_status!=="UNVERIFIED_DIAGNOSTIC"/);
 assert.match(frontend,/diagnostic_unverified/);
});

test("private HA URL uses bearer fetch without caching or redirects",()=>{
 assert.match(frontend,/^const TEMPLATE=\/\^\\\/api/m);
 assert.match(frontend,/Authorization:"Bearer "\+token/);
 assert.match(frontend,/credentials:"omit",cache:"no-store",redirect:"error"/);
 assert.match(frontend,/x-weatherrouter-scientific-status/);
 assert.match(frontend,/arrayBuffer\(\)/);
});

test("PNG stays bounded and resources are revoked on teardown",()=>{
 assert.match(frontend,/512\*1024/);
 assert.match(frontend,/new Blob/);
 assert.match(frontend,/URLRef\.createObjectURL/);
 assert.match(frontend,/URLRef\.revokeObjectURL/);
 assert.match(frontend,/controller\.abort\(\)/);
 assert.match(frontend,/map\.removeLayer\(layer\)/);
});

test("diagnostic is explicit, visibly marked, and normal mosaic remains separate",()=>{
 assert.match(frontend,/GEOGRAFISCHE PIXELPOSITION UNGEPRÜFT/);
 assert.match(frontend,/maxLayers:1,maxTileRequests:16/);
 assert.match(frontend,/diagnostic:true/);
 assert.doesNotMatch(frontend,/raster_approved:true/);
});
