# GR TEST70-55 – Unified precipitation switch

Date 2026-11-04. Repository TheDaimos/gewitterradar, branch deploy/dev.

## Implemented in GR frontend
- Turning on Niederschlag via WR map menu still runs established V2 mosaic and V1 fallback.
- It also requests the existing explicit admin-authorized OPERA DEV diagnostic overlay north_first; no extra Weather Engine toggle needed.
- Turning off Niederschlag removes running OPERA pane. A late asynchronous pane is rejected and closed.
- WR server permissions, preview consent, freshness and scientific gates are unchanged. No GR expiry limits.
- Three frontend copies synchronized.
- Public GR CI: .github/workflows/test70-55-unified-precipitation.yml; tests/test70-55-unified-precipitation.test.mjs.

## Upstream blocker
WeatherRouter still classifies OPERA as diagnostic-only and scientifically UNVERIFIED. Ordinary V2 mosaic cannot automatically select it as an approved raster provider. DWD vs operational OPERA geographic selection is therefore NOT released. It requires independent scientific WR admission; never bypass gates.

## Verification
Code committed. CI configured, result not yet separately verified. HA DEV VM109 realtest of the change pending. WR code and HA PROD unchanged. No private GitHub Actions.

## Public release verification, 2026-11-04
The public GitHub Actions release flow created verified branch commit `2eed122d35641defeafa2e55767d0684170be5b3` with message `release(test70-55): GR 4.11.134 unified precipitation`. The branch includes `frontend/version.js` V4.11.134 DEV, runtime 411134r1 and integration 0.25.43. This establishes published source/dev release, not HA VM109 installation or live acceptance.
