# Gewitterradar Dashboard delivery

Derived from the shared source in `TheDaimos/gewitterradar`.
Do not edit `dist/` independently. Run `node scripts/build-frontend.mjs` and
`node scripts/verify-frontend.mjs` from the canonical repository.

HACS Dashboard metadata uses `gewitterradar.js` from `dist/`. This directory is
a staging delivery tree, not a published release. The frozen public `v4.05`
release remains unchanged. Future publishing must pass canonical CI and explicit
user approval; no custom release assets are needed for the tagged-dist model.

Legacy package users still copy the staged YAML package to their configuration
explicitly. Native installations do not require that package. Install only one
card module resource to avoid duplicate custom-element definitions.
