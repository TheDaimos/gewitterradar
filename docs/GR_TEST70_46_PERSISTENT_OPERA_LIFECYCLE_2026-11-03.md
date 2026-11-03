# TEST70-46 – Persistent OPERA intent with WR-authoritative cycle polling

Date: 2026-11-03. Target HA DEV VM109 exclusively.

## Verified development
GR V4.11.126 DEV, integration 0.25.35, runtime 411126r1, release commit `008114d018b3929e2c0a6949dd993b625c582056`.
Public GitHub Actions success: https://github.com/TheDaimos/gewitterradar/actions/runs/41659902233

### Changes
- Separate diagnostic preview user intention (`__operaDiagnosticEnabled`) from active Leaflet pane lifetime.
- Poll WR Consumer V2 diagnostic request every 30 seconds; explicit provider=opera, product=RATE, orientation=north_first; no GR age limit in the request.
- On changed WR-approved cycle create a fresh pane, close old pane. On WR denial close pane but leave user intention active.
- On HA authorization failure abort timer and close pane; do not repeatedly send unauthenticated requests.
- Three distributed copies synchronized in public CI.
- V1/V2 normal DWD provider path unchanged.

### Limits – not yet accepted as fully complete
- Existing pane still uses the WR response max_age_seconds to determine its own close time, so the current single pane closes before next poll. This is an authorization-bound display safety measure, not a new GR age threshold.
- No independent claim of a complete HA DEV realtest until DRA V2 installs the release.
- Explicit warning+clock symbols in the map legend for WR-approved stale previews are not yet implemented.
- Browser-tab navigation and component teardown may affect interval cleanup; verify with real tests.
- Formal persistent provider activation and exact stale-status contract should be verified with WR. WR currently configured serve_stale=false in recent exports.
- DRA V2 installation cannot be performed remotely through GitHub publication; operator must install verified commit.

## Installation candidate
Repo: TheDaimos/gewitterradar, branch deploy/dev, commit 008114d018b3929e2c0a6949dd993b625c582056, version V4.11.126 DEV / integration 0.25.35. WeatherRouter V0.10.281 DEV unchanged. HA PROD VM101 untouched.

Never use private GitHub Actions. Public GitHub Actions only.
