# TEST70-50 – OPERA lifecycle diagnosis (diagnostic-only)

Date: 2026-11-04. Repository: TheDaimos/gewitterradar@deploy/dev. Test target: HA DEV VM109. Reference: GR 4.11.128 DEV. Diagnostic release: **GR V4.11.129 DEV / integration 0.25.38 / runtime 411129r1**.

## Reproduction
Desktop: sometimes seamless, sometimes ~10 second gap. Android: often ~10–15 seconds. iPad Pro: intermittently seamless. OPERA status age ~27–28 min when a gap happens. WR preview expiry changed from 1650 to 1700 seconds in user test; the gap persisted on a different client. Hypothesis: non-synchronized 30-second GR poll and per-pane WR-authorized expiry; not yet proven.

## Code added
The existing weather-engine diagnostic export contains a bounded **opera_cycle_lifecycle** array, with max 120 event entries. It is in-memory, not a new download system; event timestamps use UTC ISO and monotonic performance.now() milliseconds. Event types: initial_pane_ready, cycle_poll_started, cycle_poll_response, cycle_unchanged, cycle_staging_started, pane_mounted, first_png_decoded, png_ready, readiness_timeout, opacity_changed, cycle_swap_complete, expiry_timer_fired, pane_closed (reason user_toggle / wr_not_authorized / cycle_swap / expiry / auth_blocked / staging_error / staging_not_ready), cycle_poll_error.

The OPERA tile module uses an optional onLifecycle callback, passed through both the initial request and auto-cycle staging. No access token, Bearer header, signed URL or raster PNG is logged. GR's existing visual expiration and swap mechanics are unchanged, as are WR data validity and availability authority.

## Public verifications
- Versioning and existing regression tests passed on public GitHub Actions run 41792356306: https://github.com/TheDaimos/gewitterradar/actions/runs/41792356306
- Post-release final callback and build/SHA reconciliation passed on public GitHub Actions run 41792521236: https://github.com/TheDaimos/gewitterradar/actions/runs/41792521236
- No private GitHub Actions. WR and PROD unchanged.

## HA real-test instructions
1. Install GR V4.11.129 DEV only on HA DEV VM109 via DRA V2, branch deploy/dev.
2. Activate the OPERA diagnostic once. Leave GR open across at least one cycle expiration on desktop/Android/iPad.
3. After the gap or successful swap, export the GR weather-engine JSON on each client and compare opera_cycle_lifecycle (especially expiry_timer_fired vs cycle_poll_response vs first_png_decoded and cycle_swap_complete).
4. Export2Git evidence belongs exclusively in TheDaimos/Project-Log-And-Export@main.

## Freigabegrenze
Public build/regressions verified. HA-DEV actual diagnosis **not yet tested**. Existing 4.11.128 is still the proven display reference; 4.11.129 is an observation candidate.
