import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {createHash} from "node:crypto";

const read=path=>readFile(new URL("../"+path,import.meta.url),"utf8");
const skeleton=await read("frontend/modules/ui/skeleton.js");
const consumer=await read("frontend/modules/weather/consumer-client.js");
const radar=await read("frontend/modules/weather/precipitation-layer.js");
const marker=skeleton.indexOf('id="weather-engine-section"');
assert.ok(marker>=0,"Weather Engine section exists");
const overview=skeleton.slice(marker,skeleton.indexOf('id="settings-language-button"',marker));
for(const id of ["weather-engine-blitz-status","weather-engine-check","weather-engine-status",
  "weather-engine-active-api","weather-engine-inspect","weather-engine-results"]){
  assert.equal(overview.split('id="'+id+'"').length-1,1,id+" appears once");
}
const order=["weather-engine-blitz-status","weather-engine-check","weather-engine-active-api",
  "weather-radar-toggle","weather-engine-inspect"];
assert.ok(overview.indexOf("weather-engine-inspect")>overview.indexOf("weather-engine-active-api"));
assert.match(skeleton,/\.gr-weather-row\{[\s\S]*?grid-template-columns:minmax\(0,1fr\) 260px/);
assert.match(skeleton,/\[data-weather-radar-settings\]>\.settings-row\{[\s\S]*?grid-template-columns:minmax\(0,1fr\) 260px/);
assert.match(skeleton,/@media\(max-width:680px\)/);
assert.match(skeleton,/\.gr-weather-range-controls\{[\s\S]*?display:grid!important/);
assert.match(skeleton,/\.gr-weather-results-row\[hidden\]\{display:none!important\}/);
assert.match(consumer,/status\.dataset\.state=state/);
assert.match(consumer,/results\.closest\('#weather-engine-results-row'\)\?\.removeAttribute\('hidden'\)/);
assert.match(consumer,/Consumer-Schnittstelle V1/);
assert.match(radar,/activeApi\.dataset\.activeApi=kind/);
assert.match(radar,/Niederschlag: API V2/);
assert.match(radar,/Niederschlag: API V1/);
assert.match(radar,/async _weatherRadarApplyReady\(answer,viewport,token\)/);
assert.equal((radar.match(/className="gr-weather-range-controls"/g)||[]).length,2);
assert.equal((radar.match(/className="settings-row gr-weather-detail-status"/g)||[]).length,2);
for(const name of ["modules/ui/skeleton.js","modules/weather/consumer-client.js",
  "modules/weather/precipitation-layer.js"]){
  const content=await read("frontend/"+name);
  for(const dest of ["dashboard/dist","custom_components/gewitterradar/frontend"]){
    assert.equal(await read(dest+"/"+name),content,"mirror differs: "+dest+"/"+name);
  }
}
const sums=(await read("SHA256SUMS_FRONTEND.txt")).trim().split("\n");
assert.ok(sums.length>=246,"all existing integrity rows must remain present");
for(const name of ["modules/ui/skeleton.js","modules/weather/consumer-client.js",
  "modules/weather/precipitation-layer.js"]){
  for(const dest of ["dashboard/dist","custom_components/gewitterradar/frontend"]){
    const path=dest+"/"+name,bytes=await readFile(new URL("../"+path,import.meta.url));
    const wanted=createHash("sha256").update(bytes).digest("hex")+"  "+path;
    assert.ok(sums.includes(wanted),"invalid checksum: "+path);
  }
}
console.log("PASS: Weather Engine aligned rows, responsive layout, V1/V2 status and delivery parity.");
