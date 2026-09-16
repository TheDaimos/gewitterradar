# V4.07.56 promotion audit

This document records the controlled promotion checkpoint for the user-accepted Gewitterradar V4.07.56 candidate.

## Accepted product identity

- Product version: `4.07.56`
- Native integration version: `0.19.0`
- Accepted frontend size: `1,955,141` bytes
- Accepted frontend SHA256: `249485f4bcf68c9b23b821cae9b507030ae09cff5a56f7e28d3d7f3b02eb4a1a`
- Accepted external About/Help locale SHA256: `997c4fe9b357935888fdb7bedc43cdd17f105b97241a000324891cea575dd436`
- Canonical V4.07 dashboard package: `app_gewitterradar_v4_07_pkg.yaml`
- Canonical V4.07 dashboard package SHA256: `1b705c5686e6a7be6dfb36717903df551d4f9f93787c39bd12bddf00aefae694`
- Diagnostic acceptance includes virtual storm scenarios, deterministic 1–5 cells, EXTREM through the production path, grouped/individual rendering, child-tool hiding, hard teardown, and Medallion LEER/PFEIL/TREND/FREEZE/NORMAL.

## Promotion safeguards

- `main` remains unchanged until the finalization branch is fully green **and Christian explicitly approves the promotion**.
- V4.07.56 is the canonical frontend build baseline; historical V4.06 transformation scripts remain preserved but are not replayed against the accepted V4.07.56 source.
- V4.07.54 remains the locked normal UI/function baseline. Finalization must not alter normal map, search, Help, radius, language, artwork, control or interaction behavior.
- The runtime inventory contains 16 referenced assets plus the retained legacy premium close asset.
- The historical V4.06 dashboard package remains present as fallback/migration material; the V4.07 package is now also built deterministically and included in the canonical checksum inventory.
- All 19 language variants remain under strict schema/runtime validation.
- The protected diagnostic contract remains a release gate.
- The dedicated V4.07.56 Golden/geometry contract remains a release gate.
- The permanent Hi-Res/master retention contract remains a release gate.
- A PRE-MERGE snapshot of the old `main` has already been created and retained outside GitHub.
- A Golden Master may only be generated from the fully tested post-merge `main` state.
- The public tag/GitHub/HACS release must use the exact same verified post-merge `main` commit as the Golden Master.

## Hi-Res/master retention checkpoint

The V4.07.56 retention contract currently protects **32 unique master/legacy content identities** and permits approved path moves only when the exact protected content remains present in a protected master/legacy storage class.

The verifier additionally fails closed when new unique artwork appears in a protected Hi-Res/legacy area without first being registered in the retention contract. Runtime/package-derived copies do not satisfy master retention.

Binding sources:

- `docs/ASSET_RETENTION_POLICY.md`
- `tests/contracts/hires-asset-retention-v4.07.56.json`
- `scripts/verify-hires-asset-retention.mjs`
- `.github/workflows/hires-asset-retention.yml`

## V4.07.56 Golden/browser checkpoint

The historical V4.05 Golden test remains preserved. V4.07.56 has its own accepted Golden contract with:

- exact accepted frontend identity;
- seven fixed profiles;
- maximum geometry tolerance of `0.02 px`;
- same-run pixel comparison between Dashboard and Integration delivery;
- explicit separation of visible close-symbol geometry and the larger 44×44 touch target;
- Desktop and touch keyboard/focus paths matching the accepted browser behavior.

## Documentation/checksum checkpoint

The finalization branch has been synchronized to the V4.07.56 candidate in:

- `README.md`
- `CHANGELOG.md`
- `PROJECT_DEFAULTS.md`
- `docs/HISTORY.md`
- `docs/MILESTONES.md`
- `docs/INSTALLATION.md`
- `docs/RELEASE_NOTES_V4_07_56.md`
- `docs/V4_07_RELEASE_TODO.md`
- `docs/RELEASE_PROCESS.md`
- `SHA256SUMS_FRONTEND.txt`

Historical V4.07.31 and earlier TEST details remain preserved in their dedicated historical release-note files but are no longer described as the current candidate.

## External checks deliberately kept separate

The following are not falsely marked as completed product acceptance because they depend on the separately installed Blitzortung integration or special network environments:

- real small/large movement and Blitzortung data-region resubscription behavior;
- resubscription latency and restart/restore behavior with a configured Blitzortung `Location entity`;
- Recorder/database impact of repeated reference-location changes;
- real DNS-filter/proxy/TLS-inspection/segmented-network verification where such an environment is available.

The product rule remains: moving the Gewitterradar map/reference tracker must never be presented as proof that Blitzortung has already synchronized its live data region.

## Final pre-promotion gate sequence

1. Run the complete validation chain against the **final documentation/checksum commit** on `finalize/v4.07.56-main-promotion`.
2. Synchronize the derived `TheDaimos/gewitterradar-dashboard` repository from exactly that accepted canonical state.
3. Compare the current old `main` against the finalization branch and audit all expected/unexpected differences.
4. Obtain explicit user approval before changing `main`.
5. Perform the controlled promotion.
6. Re-run all relevant release gates against the actual new `main` commit.
7. Generate and independently retain the Golden Master from exactly that green post-merge `main` commit.
8. Tag/publish only that same verified commit.

## Current CI purpose

The next CI run is intended to be the final **pre-promotion** validation of the fully synchronized V4.07.56 candidate. No normal product or diagnostic behavior is changed by this documentation/audit checkpoint.
