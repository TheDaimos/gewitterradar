# Gewitterradar Dashboard delivery

Derived from the shared source in `TheDaimos/gewitterradar`.
Do not edit `dist/` independently. Run `node scripts/build-frontend.mjs` and
`node scripts/verify-frontend.mjs` from the canonical repository.

HACS Dashboard metadata uses `gewitterradar.js` from `dist/`. Deploy the complete
directory, including all 17 assets, `locales/about-locales.js`, and
`app_gewitterradar_v4_06_pkg.yaml`. This is the derived V4.06 staging tree; the
frozen public V4.05 release remains unchanged.

Legacy package users copy the staged YAML package to
`/config/packages/app_gewitterradar_v4_06_pkg.yaml` and remove the old
unversioned package first. Native installations do not require that package.
Install only one card module resource to avoid duplicate custom-element definitions.
