# TEST70-38 – Authenticated OPERA preview / Gewitterradar V4.11.122 DEV

Date: 2026-11-03. Environment: HA DEV VM 109 only; HA PROD VM 101 unchanged.

## Context
During TEST70-34, HA Core banned UltraBook IP 192.168.10.181 after repeated authentication failures on `/api/weather_router/opera_preview/RATE/...png`. HA was still running. User removed the ban and recovered access. Root cause of why the UI-provided token became invalid is not conclusively established.

## Changes
- Added single Bearer authentication preflight before any parallel OPERA diagnostic tile requests.
- Fail-closed after first observed HTTP 401 or 403: set `authRejected`, abort outstanding requests, block subsequent tiles.
- No changes to HA auth requirements or IP banning. No changes to WeatherRouter or scientific raster approval.
- Three shipped OPERA adapters synchronized.
- Tests: `tests/test70-opera-auth-preflight.test.mjs`, `tests/test_gr_opera_wr_authoritative_freshness.mjs`, `tests/wl02-coverage-contract.test.mjs`, `tests/wl02-raster-geometry.test.mjs`.
- Versioned frontend, integration manifest, DRA provenance, runtime manifest, asset inventory and SHA256 checksums through deterministic CI.

## Verified CI
Public run: https://github.com/TheDaimos/gewitterradar/actions/runs/41635580835
GitHub conclusion: **success**.
Verified release commit: `0d7a25651af207558f8f0c1a0351e465a2b2383f` on `deploy/dev`; author `github-actions[bot]`.
Versions: Gewitterradar `V4.11.122 DEV`, integration `0.25.31`, runtime `411122r1`, module set `E411-122A1`.
WeatherRouter remains `V0.10.281 DEV / Loader 284`.

## Boundaries and next real test
CI green does not prove the original stale/invalid-token cause is resolved and does not guarantee already-started HTTP requests can never reach HA; in-flight requests are aborted on first rejection, but a small initial parallel burst can occur. Preserve HA authentication and IP bans. The public CI workflow build and SHA validation passed, but **HA DEV real test not yet performed**.

1. Install only GR `V4.11.122 DEV / integration 0.25.31` from `deploy/dev` onto HA DEV VM 109 using DRA V2. Do not install anything on PROD.
2. Verify GR and WR version panels, and basic HA access.
3. With access logged in as HA admin, enable diagnostic OPERA preview once and monitor in parallel the HA Core auth logs for unauthorized requests and new bans.
4. If any 401/403 or invalid-auth occurs, stop preview and capture safe diagnostics. Do not disable HA auth or ban settings.
5. Export2Git real diagnostics ONLY to `TheDaimos/Project-Log-And-Export@main` and then determine whether automatic cycle refresh requires a separate change.

GitHub Actions in privaten Repositories ausnahmslos verboten; nur öffentliche Actions im Public-Repo nach Freigabe.
