import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {runtimeReloadUrl,installUpdateWatch} from "../frontend/modules/core/update-watch.js";

const original="https://ha.example.invalid/gewitterradar-panel?view=radar&keep=yes#zoom-8";
const next=runtimeReloadUrl(original,"E411-99A1",123456789);
const parsed=new URL(next);
assert.equal(parsed.pathname,"/gewitterradar-panel");
assert.equal(parsed.searchParams.get("view"),"radar");
assert.equal(parsed.searchParams.get("keep"),"yes");
assert.equal(parsed.searchParams.get("_gr_runtime"),"E411-99A1");
assert.equal(parsed.searchParams.get("_gr_reload"),"123456789");
assert.equal(parsed.hash,"#zoom-8");
const later=new URL(runtimeReloadUrl(next,"E411-99A1",987));
assert.equal(later.searchParams.getAll("_gr_runtime").length,1);
assert.equal(later.searchParams.get("_gr_runtime"),"E411-99A1");
assert.equal(runtimeReloadUrl(original,"",1),null);

class Card {}
installUpdateWatch(Card,{APPLICATION_META:{version:"4.11.99",runtimeRevision:"41199r1",moduleSetId:"E411-99A1"}});
const card=new Card(),navigations=[];
globalThis.window={location:{href:original,replace(url){navigations.push(url)}}};
card.shadow=null;
card.__runtimeUpdateWatchState={timer:null,autoReloadTimer:null,pending:false,
  last:{installed:{moduleSetId:"E411-99A1",runtimeRevision:"41199r1"}}};
assert.equal(card._reloadInstalledRuntime({source:"manual"}),true);
assert.equal(navigations.length,1);
assert.equal(new URL(navigations[0]).searchParams.get("_gr_runtime"),"E411-99A1");
assert.equal(new URL(navigations[0]).searchParams.get("view"),"radar");
assert.equal(new URL(navigations[0]).hash,"#zoom-8");
const panel=await readFile(new URL("../frontend/panel.js",import.meta.url),"utf8");
assert.ok(panel.includes('version.js?v=41199r1'));
assert.ok(panel.includes('gewitterradar.js?v='));
assert.equal(panel.includes('await import("./gewitterradar.js")'),false);
assert.ok(panel.includes('__GEWITTERRADAR_BOOT_DIAGNOSTICS'));
const native=await readFile(new URL("../custom_components/gewitterradar/const.py",import.meta.url),"utf8");
assert.ok(native.includes('panel.js?v=41199r1'));
console.log("PASS: versioned native sidebar, full navigation and finite-reload guard");
