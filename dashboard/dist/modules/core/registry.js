const STORE_KEY = "__GEWITTERRADAR_MODULE_REGISTRY_V1__";

function store() {
  const root = globalThis;
  if (!root[STORE_KEY]) {
    Object.defineProperty(root, STORE_KEY, {
      configurable: false,
      enumerable: false,
      writable: false,
      value: {
        modules: new Map(),
        duplicates: new Map(),
        startedAt: new Date().toISOString(),
      },
    });
  }
  return root[STORE_KEY];
}

function normalizeList(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item) => String(item).trim()).filter(Boolean))];
}

function normalizeMeta(meta) {
  if (!meta || typeof meta !== "object") throw new TypeError("module metadata must be an object");
  const id = String(meta.id || "").trim();
  const version = String(meta.version || "").trim();
  if (!id) throw new TypeError("module metadata requires id");
  if (!version) throw new TypeError(`module ${id} requires version`);
  return Object.freeze({
    id,
    version,
    group: String(meta.group || "other").trim() || "other",
    function: String(meta.function || id).trim() || id,
    subfunctions: Object.freeze(normalizeList(meta.subfunctions)),
    file: String(meta.file || "").trim(),
    build: meta.build == null ? null : String(meta.build),
    commit: meta.commit == null ? null : String(meta.commit),
  });
}

export function registerModule(meta) {
  const normalized = normalizeMeta(meta);
  const target = store();
  const existing = target.modules.get(normalized.id);
  if (existing) {
    const duplicates = target.duplicates.get(normalized.id) || [];
    duplicates.push(existing);
    target.duplicates.set(normalized.id, duplicates);
  }
  const record = Object.freeze({
    ...normalized,
    loadedAt: new Date().toISOString(),
    url: typeof import.meta?.url === "string" ? import.meta.url : null,
  });
  target.modules.set(normalized.id, record);
  return record;
}

export function loadedModules() {
  return [...store().modules.values()].sort((a, b) =>
    a.group.localeCompare(b.group) || a.id.localeCompare(b.id)
  );
}

export function moduleDiagnostics(expected = []) {
  const target = store();
  const expectedMap = new Map(expected.map((item) => [String(item.id), item]));
  const loaded = loadedModules();
  const loadedMap = new Map(loaded.map((item) => [item.id, item]));
  const rows = [];

  for (const wanted of expectedMap.values()) {
    const actual = loadedMap.get(String(wanted.id));
    rows.push({
      id: String(wanted.id),
      group: String(wanted.group || actual?.group || "other"),
      expectedVersion: String(wanted.version || ""),
      loadedVersion: actual?.version || null,
      status: !actual ? "missing" : actual.version === String(wanted.version || "") ? "ok" : "version_mismatch",
      loadedAt: actual?.loadedAt || null,
      file: actual?.file || String(wanted.file || ""),
      function: actual?.function || String(wanted.function || wanted.id),
      subfunctions: actual?.subfunctions || normalizeList(wanted.subfunctions),
      url: actual?.url || null,
    });
  }

  for (const actual of loaded) {
    if (!expectedMap.has(actual.id)) {
      rows.push({
        id: actual.id,
        group: actual.group,
        expectedVersion: null,
        loadedVersion: actual.version,
        status: "unexpected",
        loadedAt: actual.loadedAt,
        file: actual.file,
        function: actual.function,
        subfunctions: actual.subfunctions,
        url: actual.url,
      });
    }
  }

  const duplicateIds = [...target.duplicates.keys()].sort();
  const duplicateDetails = duplicateIds.map((id) => {
    const previous = target.duplicates.get(id) || [];
    const active = target.modules.get(id);
    const registrations = [...previous, ...(active ? [active] : [])].map((entry,index) => Object.freeze({
      index:index+1,
      id:entry.id,
      version:entry.version,
      file:entry.file,
      loadedAt:entry.loadedAt,
      url:entry.url,
      build:entry.build,
      commit:entry.commit,
    }));
    return Object.freeze({id,count:registrations.length,registrations:Object.freeze(registrations)});
  });
  const ok = rows.every((row) => row.status === "ok") && duplicateIds.length === 0;
  return Object.freeze({
    ok,
    startedAt: target.startedAt,
    loadedCount: loaded.length,
    expectedCount: expectedMap.size,
    duplicateIds: Object.freeze(duplicateIds),
    duplicateDetails:Object.freeze(duplicateDetails),
    rows: Object.freeze(rows.map((row) => Object.freeze(row))),
  });
}

export function moduleRegistrySnapshot(expected = []) {
  return JSON.parse(JSON.stringify(moduleDiagnostics(expected)));
}

registerModule({id:"core.registry",version:"1.0.1",group:"Kern",function:"Modulregister",subfunctions:["Selbstregistrierung","Soll/Ist-Prüfung","Diagnoseexport"],file:"modules/core/registry.js"});
