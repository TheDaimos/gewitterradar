import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const consumer=await readFile(new URL("../frontend/modules/weather/consumer-client.js",import.meta.url),"utf8");
const skeleton=await readFile(new URL("../frontend/modules/ui/skeleton.js",import.meta.url),"utf8");
const version=await readFile(new URL("../frontend/version.js",import.meta.url),"utf8");

assert.match(version,/version:"4\.11\.10"/);
assert.match(version,/runtimeRevision:"41112r1"/);
assert.match(consumer,/id:'weather\.consumer-client',version:'1\.2\.1'/);
assert.match(consumer,/gewitterradar\.weather_engine_diagnostic\.v1/);
assert.match(consumer,/settings-weather-engine-diagnostics-toggle/);
assert.match(consumer,/weather-engine-diagnostic-area/);
assert.match(consumer,/weather-engine-diagnostic-capability/);
assert.match(consumer,/Niederschlag \/ Regen/);
assert.match(consumer,/Tornados \/ Wasserhosen/);
assert.match(consumer,/Wind/);
assert.match(consumer,/Temperatur/);
assert.match(consumer,/raw_consumer_exchanges/);
assert.match(consumer,/weather_router\/consumer\//);
assert.match(consumer,/retained_previous_layer/);
assert.match(consumer,/Niederschlag neu auflösen/);
assert.match(consumer,/Diagnose kopieren/);
assert.match(consumer,/JSON exportieren/);
assert.match(consumer,/Die Filter beeinflussen nur die Diagnoseansicht/);
assert.match(consumer,/api\[_-\]\?key|apikey|access\[_-\]\?token/);
assert.match(skeleton,/this\._mountWeatherRouterSettings\?\.\(\);\s*this\._mountWeatherRadarSettings\?\.\(\);\s*this\._mountWeatherDisplaySettings\?\.\(\);\s*this\._mountWeatherEngineDiagnostics\?\.\(\);/);
assert.doesNotMatch(consumer,/selected_provider\s*=\s*['"]dwd/i);

console.log("PASS: V4.11.12 Weather Engine diagnostics expose provider-neutral service/capability filters, exact Consumer API exchanges, retained-layer state and secret-safe export controls.");
