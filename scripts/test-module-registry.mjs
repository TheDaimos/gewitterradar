import assert from "node:assert/strict";
import { EXPECTED_MODULES, APPLICATION_META } from "../frontend/module-manifest.js";
import { registerModule, loadedModules, moduleDiagnostics, moduleRegistrySnapshot } from "../frontend/modules/core/registry.js";

assert.equal(APPLICATION_META.version, "4.10.02");
assert.ok(EXPECTED_MODULES.length >= 10);
assert.ok(loadedModules().some((item) => item.id === "core.manifest"));

registerModule({
  id: "test.self-register",
  version: "7.8.9",
  group: "Test",
  function: "Selbstregistrierung",
  subfunctions: ["Soll/Ist"],
  file: "test.js",
});

const expected = [
  { id: "test.self-register", version: "7.8.9", group: "Test", file: "test.js" },
];
const diag = moduleDiagnostics(expected);
const row = diag.rows.find((item) => item.id === "test.self-register");
assert.equal(row.status, "ok");
assert.equal(row.loadedVersion, "7.8.9");
assert.match(row.loadedAt, /^\d{4}-\d{2}-\d{2}T/);

const copy = moduleRegistrySnapshot(expected);
assert.equal(copy.rows.find((item) => item.id === "test.self-register").status, "ok");

console.log("PASS: module registry self-registration and Soll/Ist diagnostics");
