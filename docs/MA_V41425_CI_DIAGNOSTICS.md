# MA V4.14.25 CI regression diagnostics

Branch: feature/v4.14-monitored-areas
Workflow: ma-v41425-dev-build-sync.yml
These are test results, not operator database data.

~~~
TAP version 13
# Subtest: default OFF / invalid flags: no runtime start, no owner writes or listeners
ok 1 - default OFF / invalid flags: no runtime start, no owner writes or listeners
  ---
  duration_ms: 13.650083
  type: 'test'
  ...
# Subtest: ON: one runtime start, idempotent teardown and restart
ok 2 - ON: one runtime start, idempotent teardown and restart
  ---
  duration_ms: 5.83113
  type: 'test'
  ...
# Subtest: disconnect and OFF terminate active runtime, no restart
ok 3 - disconnect and OFF terminate active runtime, no restart
  ---
  duration_ms: 0.854795
  type: 'test'
  ...
# Subtest: optional initialization and teardown failures remain isolated
ok 4 - optional initialization and teardown failures remain isolated
  ---
  duration_ms: 0.813875
  type: 'test'
  ...
# Subtest: regular optional registration and exact inventory/mirror hashes
ok 5 - regular optional registration and exact inventory/mirror hashes
  ---
  duration_ms: 8.801747
  type: 'test'
  ...
1..5
# tests 5
# suites 0
# pass 5
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 82.654873
PASS MA-023 model, mode gate, no implicit migration, UI integration and mirror
PASS MA-021 Havanna detail read-only geometry, drag and safety
PASS MA-021 Desktop/iPad portrait+landscape/mobile layout, session positioning and read-only profile guard
PASS MA-021 profile-scoped SQLite detail read gate, no pending access and no mutation receipt
node:internal/modules/run_main:123
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: close only after provider ACK
    at file:///home/runner/work/gewitterradar/gewitterradar/tests/test_ma021_geopoint_launch.mjs:18:8
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5) {
  generatedMessage: false,
  code: 'ERR_ASSERTION',
  actual: false,
  expected: true,
  operator: '==',
  diff: 'simple'
}

Node.js v22.23.5
~~~
