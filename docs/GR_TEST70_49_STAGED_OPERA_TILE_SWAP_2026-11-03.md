# TEST70-49 – Staged OPERA tile-swap

Date 2026-11-03. Target HA DEV VM109 only.

## Real-test motivation
On WR automatic cycle 15:15 -> 15:30 UTC, GR showed an empty layer for approximately 10–15 seconds until 20 fresh PNGs appeared. Prior GR code mounted the new GridLayer and immediately invoked `current.close()` without waiting for the new PNGs to decode.

## Change
- OPERA pane offers `waitUntilReady(15000)`. Waits for at least one decoded PNG and completion of pending tile work, with a bounded 15-second wait; no arbitrary age decision in GR.
- New authorized cycle mounted with opacity 0 as a staging layer; opacity restored and previous pane closed only after readiness.
- If no usable tiles within timeout, new staging pane is closed and UI reports not ready. The old pane remains only until its pre-existing WR-authorized expiry.
- WR remains sole provider of max age, valid_at, stale status, and authorization. Existing HA bearer preflight and per-tile 401/403 abort remain.
- Three GR source/HA integration/dashboard frontend copies updated; no WR/PROD modification.

## Evidence
Public GitHub Actions SUCCESS: https://github.com/TheDaimos/gewitterradar/actions/runs/41668126679
GR V4.11.128 DEV; integration 0.25.37; runtime 411128r1.
Release commit `9b1e644e6c476a0314b4b2635ab7194d89d82c3b` on `deploy/dev`.

## Known limits and real-test gate
- Not yet verified on HA DEV. A short map flicker can still occur if the previous pane expired before the new cycle arrived (WR did not permit continuation).
- Partial readiness is bounded; the swap does not claim that all map tiles are populated. Test empty/partially loaded, zoom/pan, tab suspension, and 401/403 behavior.
- A 15-second wait may still finish before some slow tiles load; report any visible seams with diagnostics.
- Do not disable HA authentication or IP bans.
- Export2Git destinations always `TheDaimos/Project-Log-And-Export@main`.
- Public Actions only; NO private GitHub Actions.
