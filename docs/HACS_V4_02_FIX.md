# HACS packaging note — V4.02 (superseded)

V4.02 removed the V4.01 standalone `gewitterradar.js` release asset, but the field test showed that this was not sufficient.

Current HACS prioritizes custom assets attached to the selected GitHub release before the tagged repository `dist/` tree. Because V4.02 still published `app_gewitterradar_pkg.yaml`, the full release ZIP and its checksum as custom release assets, HACS copied those files into `/config/www/community/gewitterradar/` and did not install `dist/gewitterradar.js` or `dist/assets/`.

V4.03 supersedes this approach. See `docs/HACS_V4_03_FIX.md`.
