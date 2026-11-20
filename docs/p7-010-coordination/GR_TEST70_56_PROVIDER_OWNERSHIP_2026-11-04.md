# GR TEST70-56 — WeatherRouter owns precipitation provider selection

**Date:** 2026-11-04. **Branch:** `deploy/dev`. **Scope:** GR overlay regression.

## Confirmed root cause
GR V4.11.134 automatically called `_weatherEngineOperaDiagnosticToggle({autoFromPrecipitation:true})` when Niederschlag was enabled. That created an independent OPERA pane on top of the WR-selected raster and could visually mask DWD regardless of the actual V2 routing result.

## Implemented
- Removed the automatic OPERA diagnostic pane start from `_setWeatherRadarEnabled`.
- The single precipitation switch now refreshes the existing WR V2 mosaic, with WR V1 fallback; no second OPERA layer is forced.
- Existing standalone administrative OPERA diagnostic UI remains available independently for explicit diagnostics.
- Kept OPERA teardown when precipitation is switched off, with asynchronous late-pane guard.
- Exact source parity confirmed in original and two delivery copies.
- Regression updated to explicitly reject `autoFromPrecipitation:true` on the regular precipitation path.
- Public CI release workflow `.github/workflows/test70-56-release.yml` created targeting GR V4.11.135 DEV / integration 0.25.44. Check actual workflow outcome/branch HEAD before claiming release.

## Remaining blocker (WR)
The normal WR V2 provider catalogue still exposes OPERA discovery-only and its delivery registers diagnostic frames, not operational approved candidate resources. No automatic DWD→OPERA geographic transition can truthfully be declared ready under the current WR contract. Existing completed TEST69 scientific evidence should be reused rather than repeated. A dedicated trusted WR RATE admission, V2 candidate integration and runtime regression remain necessary. GR must never override this via an extra preview pane.

**No private GitHub Actions; no production VM change. No HA DEV realtest claimed.**
