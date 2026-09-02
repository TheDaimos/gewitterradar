# Gewitterradar

**Gewitterradar** is a Home Assistant dashboard card for live lightning and thunderstorm visualization using data supplied by the Home Assistant Blitzortung.org integration.

Current stable release: **V4.02**

## Highlights

- Live lightning visualization
- Observation, storm and danger zones
- Stable cluster and individual-strike navigation
- Recent activity, KPI/status panels and 120-minute activity history
- Three compass designs with optional device orientation
- 19 selectable language variants
- Metric and imperial distance display
- Responsive layouts for phones, tablets, iPad and desktop

## Requirements

- Home Assistant
- Blitzortung.org integration with the required lightning/counter entities

## Installation

See:

- [Installation – Deutsch](docs/INSTALLATION_DE.md)
- [Installation – English](docs/INSTALLATION_EN.md)
- [Home Assistant Recorder recommendation](docs/RECORDER.md)

Gewitterradar can be installed as a custom **Dashboard** repository in HACS:

```text
https://github.com/TheDaimos/gewitterradar
```

HACS installs `gewitterradar.js` together with the four required visual assets below `/hacsfiles/gewitterradar/`.

The Home Assistant package in `home-assistant/app_gewitterradar_pkg.yaml` must still be copied manually to `/config/packages/app_gewitterradar_pkg.yaml`; a HACS Dashboard repository cannot install files into `/config/packages/`.

The JavaScript card is registered as:

```yaml
type: custom:gewitterradar-card
```

## Release

V4.02 is a focused HACS packaging hotfix. It corrects the V4.01 installation path that could cause HACS to install only the standalone JavaScript release asset while omitting `dist/assets/`.

The V4.02 GitHub release deliberately does **not** publish a standalone release asset named `gewitterradar.js`. HACS therefore resolves the stable entry point from `dist/gewitterradar.js` and installs the complete `dist/` tree, including all four PNG assets.

Application behavior, helper IDs, layouts, lightning processing and the V4.01 PNG files remain unchanged. The Home Assistant helper package is also unchanged and is included in the release ZIP and as a separate convenience release asset for manual installation.

See [V4.02 release notes](RELEASE_NOTES_V4_02.md), the [V4.01 asset verification report](docs/ASSET_OPTIMIZATION_V4_01.md) and [CHANGELOG.md](CHANGELOG.md).

## Data source

The live lightning data displayed by Gewitterradar is supplied through the Home Assistant Blitzortung.org integration. The number of simultaneously available lightning events depends on the integration configuration, including detection radius, time window and maximum number of lightning events.

## License

No software license has been selected for this repository yet. Until a license is added, the source remains subject to the default copyright rules applicable to the repository owner.
