import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {test} from "node:test";
const root=new URL("../",import.meta.url);
const files=["frontend/","custom_components/gewitterradar/frontend/","dashboard/dist/"].map(p=>p+"modules/weather/p7-010/opera-diagnostic-tile.js");
test("all shipped OPERA adapters use WR authoritative freshness",()=>{
 const texts=files.map(p=>readFileSync(new URL(p,root),"utf8"));
 assert.equal(texts[0],texts[1]);assert.equal(texts[1],texts[2]);
 for(const src of texts){
  assert.match(src,/WeatherRouter alone owns freshness policy/);
  assert.doesNotMatch(src,/validMs\s*\+\s*approved\.maxAgeSeconds/);
  assert.doesNotMatch(src,/response\.max_age_seconds!==900/);
  assert.doesNotMatch(src,/validMs\+900000/);
 }
});
