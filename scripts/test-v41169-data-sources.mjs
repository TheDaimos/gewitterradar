import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const read=path=>readFile(new URL("../"+path,import.meta.url),"utf8");
const [native,entry,skeleton,modules,dataSources,blitzortung,runtime]=await Promise.all([
  read("custom_components/gewitterradar/__init__.py"),
  read("frontend/gewitterradar.js"),
  read("frontend/modules/ui/skeleton.js"),
  read("frontend/modules/diagnostics/module-view.js"),
  read("frontend/modules/diagnostics/data-sources.js"),
  read("frontend/modules/sources/blitzortung.js"),
  read("frontend/assets/gewitterradar-runtime-manifest.json")
]);
const manifest=JSON.parse(runtime);
assert.equal(manifest.productVersion,"4.11.91");
assert.equal(manifest.modules.length,34);
for(const id of ["diagnostics.data-sources","sources.blitzortung"]){
  assert.equal(manifest.modules.filter(m=>m.id===id).length,1,id);
}
assert.match(entry,/installDataSourceDiagnostics\(GewitterradarCard/);
assert.match(entry,/installBlitzortungSource\(GewitterradarCard/);
assert.match(entry,/location\/radii-map\.js','41168r1'/);
assert.doesNotMatch(skeleton,/id="source-status"/);
assert.match(modules,/dataSources:this\._dataSourcesDiagnosticPayload/);
assert.match(modules,/await this\._refreshBlitzortungSources/);
assert.match(dataSources,/_ensureDataSourcesSection\(/);
assert.match(dataSources,/section\.dataset\.grDynamicHeight="true"/);
assert.match(dataSources,/data-sources-download/);
assert.match(dataSources,/gr-sources-tools\{[^}]*margin-bottom:10px\}/);
assert.match(modules,/_downloadModuleDiagnostics\(\)\{\s*\/\/[^\n]*\n\s*const payload=/);
assert.match(dataSources,/_downloadDataSourcesDiagnostics\(\)\{\s*\/\/[^\n]*\n\s*const content=/);
assert.match(dataSources,/savedLocations/);
assert.match(dataSources,/referenceTrackerLinked/);
assert.match(blitzortung,/gewitterradar\/data_sources/);
assert.match(blitzortung,/not_checked/);
assert.match(native,/@websocket_api\.require_admin/);
assert.match(native,/async_register_command\(hass, _ws_data_sources\)/);
const backend=native.split("def _ws_data_sources(")[1].split("async def async_setup(")[0];
assert.match(backend,/async_entries\(BLITZORTUNG_DOMAIN\)/);
assert.match(backend,/ConfigEntryState\.LOADED/);
for(const field of ['"radius"','"time_window"','"max_tracked_lightnings"','"location_entity"']){
  assert.ok(backend.includes(field),field);
}
assert.doesNotMatch(backend,/async_update_entry|async_unload_entry|async_reload/);
for(const file of ["gewitterradar.js","version.js","module-manifest.js","modules/ui/skeleton.js",
  "modules/diagnostics/module-view.js","modules/diagnostics/data-sources.js",
  "modules/sources/blitzortung.js","assets/gewitterradar-runtime-manifest.json"]){
  const primary=await read("frontend/"+file);
  for(const target of ["dashboard/dist/","custom_components/gewitterradar/frontend/"]){
    assert.equal(await read(target+file),primary,"Delivery parity: "+target+file);
  }
}
console.log("PASS: V4.11.78 sources, locations, read-only backend, admin control, dual frontend and V4.11.68 radius isolation.");
