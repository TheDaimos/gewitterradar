import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const copies=[
"frontend/modules/weather/p7-010/opera-diagnostic-tile.js",
"custom_components/gewitterradar/frontend/modules/weather/p7-010/opera-diagnostic-tile.js",
"dashboard/dist/modules/weather/p7-010/opera-diagnostic-tile.js"
];
test("OPERA tile fanout is gated by one HA bearer preflight on all shipped adapters",()=>{
 const content=copies.map(x=>readFileSync(new URL("../"+x,import.meta.url),"utf8"));
 assert.equal(new Set(content).size,1,"shipped adapters differ");
 const s=content[0];
 assert.match(s,/const authProbe=await fetchImpl\("\/api\/",\{/);
 assert.match(s,/Authorization:"Bearer "\+accessToken/);
 assert.match(s,/if\(!authProbe\.ok\)/);
 assert.ok(s.indexOf("if(!authProbe.ok)")<s.indexOf("return mountOperaDiagnosticPane({"),"must gate before grid");
 assert.match(s,/opera_diagnostic_auth_preflight_failed/);
 assert.match(s,/if\(error\.httpStatus===401\|\|error\.httpStatus===403\)/);
 assert.match(s,/authRejected=true;for\(const pending of controllers\)pending\.abort\(\)/);
});
