# V4.07.56 promotion audit

This document records the controlled promotion checkpoint for the user-accepted Gewitterradar V4.07.56 candidate.

## Accepted product identity

- Product version: `4.07.56`
- Accepted frontend size: `1,955,141` bytes
- Accepted frontend SHA256: `249485f4bcf68c9b23b821cae9b507030ae09cff5a56f7e28d3d7f3b02eb4a1a`
- Accepted external About/Help locale SHA256: `997c4fe9b357935888fdb7bedc43cdd17f105b97241a000324891cea575dd436`
- Diagnostic acceptance includes virtual storm scenarios, deterministic 1–5 cells, EXTREM through the production path, grouped/individual rendering, child-tool hiding, hard teardown, and Medallion LEER/PFEIL/TREND/FREEZE/NORMAL.

## Promotion safeguards

- `main` remains unchanged until the finalization branch is fully green and the controlled merge is executed.
- V4.07.56 is the canonical frontend build baseline; historical V4.06 transformation scripts remain preserved but are not replayed against the accepted V4.07.56 source.
- The runtime inventory contains 16 referenced assets plus the retained legacy premium close asset. Retention is intentional and protected by the permanent Hi-Res/legacy asset policy.
- All 19 language variants remain under strict schema/runtime validation.
- The protected diagnostic contract remains a release gate.
- A PRE-MERGE snapshot of the old `main` has already been created and retained outside GitHub.
- A Golden Master may only be generated from the fully tested post-merge `main` state.

## Current CI purpose

This checkpoint intentionally triggers the normal GitHub validation chain after stale historical test assumptions were aligned with the already accepted V4.07.56 behavior. No normal map, search, Help, radius, language, artwork, control, or diagnostic product behavior is changed by this checkpoint.
