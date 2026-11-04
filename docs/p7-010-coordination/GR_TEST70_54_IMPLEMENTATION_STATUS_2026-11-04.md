# GR TEST70-54 – Implementation and verification record

Date: 2026-11-04. Repository: TheDaimos/gewitterradar, branch deploy/dev.

## Scope
General project rule: retry only failed tile/source requests and retain successful siblings. WeatherRouter authority and existing OPERA authorization/safety gates are unchanged. GR may not introduce a local OPERA expiry deadline.

## Code changes committed
- frontend/modules/weather/p7-010/raster-mosaic-tile-loader.js: bounded, per-URL selective retries; success remains cached; auth 401/403 not retried; AbortSignal cancellation; backoff outside concurrency reservation.
- Mirrored to custom_components/gewitterradar/frontend and dashboard/dist.
- tests/test70-54-selective-raster-retry.test.mjs created for failed source retry, successful sibling retention, shared budget, auth stop, caching.
- Public-only workflow .github/workflows/test70-54-selective-retry.yml. No WR repository workflows for GR.

## Honest verification state
- GitHub changes committed; the exact action-run success and test results have NOT been verified.
- No local test execution or HA DEV VM109 real test proven.
- Version remains 4.11.132 DEV, not an approved 4.11.133 release.
- V1 / additional adapters have not been fully audited or migrated.
- Bounded V2 snapshot request budget means attempts stop when budget is exhausted; this is distinct from an OPERA data-age deadline.
- Existing source loader is experimental and isolated from active V1 precipitation, per its file header.
- Real acceptance on desktop, Android and iPad is pending.

## Required gates before release
1. Confirm public GitHub Actions run ID and successful tests; fix actual failures.
2. Audit remaining GR-owned tile adapters and their activation paths.
3. Build consistent version, runtime manifest, asset hashes, and shipped parity.
4. Install on HA DEV 109 and capture genuine selective-retry diagnostics.
5. Diagnostics exported only to TheDaimos/Project-Log-And-Export@main.

No private GitHub Actions. No production deployment.
