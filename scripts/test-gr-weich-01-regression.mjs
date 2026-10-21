// GR-WEICH-01: regression guards for zoom lifecycle and central raster-lab version.
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {weatherDisplayAutoRasterTuning,weatherDisplayBalancedRasterTuning,weatherDisplaySoftRasterTuning} from "../frontend/modules/weather/display-menu.js";
import {APPLICATION_RELEASE} from "../frontend/version.js";
const display=await readFile(new URL("../frontend/modules/weather/display-menu.js",import.meta.url),"utf8");
const lab=await readFile(new URL("../frontend/modules/diagnostics/raster-lab.js",import.meta.url),"utf8");
assert.doesNotMatch(display,/if\(this\._weatherDisplayStyle\("precipitation"\)!=="auto"\)return;/);
assert.match(display,/state\.zoomHandler=\(\)=>\{[\s\S]*?this\._weatherDisplayRefreshRenderedLayers\(\);/);
assert.match(lab,/APPLICATION_RELEASE\.displayVersion/);
assert.match(lab,/version:APPLICATION_RELEASE\.version,runtimeRevision:APPLICATION_RELEASE\.runtimeRevision/);
assert.doesNotMatch(lab,/(?:version:"4\.11\.82"|runtimeRevision:"41182r1"|gewitterradar_raster-lab_4\.11\.82\.json)/);
assert.match(APPLICATION_RELEASE.version,/^\d+\.\d+\.\d+$/);
for(let native=5;native<=12;native++)for(let zoom=6;zoom<=13;zoom++){
 const v=[weatherDisplayAutoRasterTuning(zoom,native),weatherDisplayBalancedRasterTuning(zoom,native),weatherDisplaySoftRasterTuning(zoom,native)];
 for(const tuning of v)assert.ok(Number.isFinite(tuning.blur)&&tuning.blur>=0&&tuning.blur<=220);
}
assert.equal(weatherDisplayBalancedRasterTuning(8,11).blur,5.6);
// Historical visual parity requires real browser pixels; not asserted here.
console.log("PASS: zoom refresh guard, central version, numeric matrix; historical visual mismatch explicitly open");
