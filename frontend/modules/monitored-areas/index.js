// MA-004: inert optional frontend lifecycle. No HA, DOM, storage or timers.
import { registerModule } from "../core/registry.js?v=4141r1";
export const MODULE_META=Object.freeze({"id":"monitored-areas.lifecycle","version":"0.1.0","group":"Monitored Areas","function":"Optional lifecycle","subfunctions":["Initialize","Teardown"],"file":"modules/monitored-areas/index.js","optional":true});
registerModule(MODULE_META);
const active = new WeakMap();
export function initializeMonitoredAreas(owner, enabled = false) {
  if (enabled !== true) return null;
  let runtime = active.get(owner);
  if (!runtime) {
    let stopped = false;
    runtime = Object.freeze({
      get status() { return stopped ? "stopped" : "ready"; },
      teardown() {
        if (stopped) return;
        stopped = true;
        if (active.get(owner) === runtime) active.delete(owner);
      }
    });
    active.set(owner, runtime);
  }
  return runtime;
}
