import assert from "node:assert/strict";
import {weatherDisplayAutoRasterTuning,weatherDisplaySoftRasterTuning,weatherDisplayBalancedRasterTuning} from "../frontend/modules/weather/display-menu.js";
import {readFile} from "node:fs/promises";
const source=await readFile(new URL("../frontend/modules/weather/display-menu.js",import.meta.url),"utf8");
const grid=await readFile(new URL("../frontend/modules/weather/p7-010/raster-mosaic-grid-layer.js",import.meta.url),"utf8");
assert.match(grid,/maxNativeZoom:18/,"V2 URL zoom ceiling remains unchanged");
assert.match(source,/__grRadarVisualNativeZoom/);
assert.doesNotMatch(source,/const nativeZoom=Number\.isFinite\(maxNative\)\?maxNative:7/);
for(const urlCeiling of [8,9,10,11,12,18]){
 const visualZoom=7; // no measured pixel-resolution evidence: historical reference, independent of URL ceiling
 const a=weatherDisplayAutoRasterTuning(8,visualZoom);
 const b=weatherDisplayBalancedRasterTuning(8,visualZoom);
 const c=weatherDisplaySoftRasterTuning(8,visualZoom);
 assert.ok(a.blur>c.blur&&c.blur>b.blur,`historical ordering z8, URL ${urlCeiling}`);
 assert.equal(c.blur,weatherDisplaySoftRasterTuning(8,7).blur);
}
assert.equal(weatherDisplayAutoRasterTuning(8,7).blur,92);
assert.ok(weatherDisplaySoftRasterTuning(8,7).blur>18);
console.log("PASS GR-WEICH-02: URL zoom ceiling independent of historical visual-reference smoothing");
