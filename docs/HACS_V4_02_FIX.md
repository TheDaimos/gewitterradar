# HACS packaging note — V4.02

V4.02 fixes the V4.01 HACS single-file installation path.

The HACS manifest keeps `filename: gewitterradar.js`, while the tagged repository provides that file at `dist/gewitterradar.js` together with `dist/assets/`.

Do not publish a standalone GitHub release asset named `gewitterradar.js`. If such an asset exists, HACS may prefer it and install the card as a single file, omitting the PNG assets required by the compass and trend UI.

The V4.02 release may publish the full ZIP, its checksum and `app_gewitterradar_pkg.yaml`; none of those names collide with the HACS JavaScript entry point.
