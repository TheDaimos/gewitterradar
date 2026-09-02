# Gewitterradar

**Gewitterradar** is a Home Assistant dashboard card for live lightning and thunderstorm visualization using data supplied by the Home Assistant Blitzortung.org integration.

Current stable release: **V4.03**

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

V4.03 is a focused HACS packaging hotfix based on the V4.02 field test. Current HACS prioritizes custom GitHub release assets over the tagged repository `dist/` tree. Therefore the V4.03 GitHub release intentionally publishes **zero custom release assets**. HACS falls through to `dist/gewitterradar.js` and installs the complete `dist/` tree including `dist/assets/`.

Application behavior, helper IDs, layouts, lightning processing and the optimized PNG files remain unchanged. The helper package remains available inside the tagged repository and GitHub's automatically generated source archive for manual installation.

See [V4.03 release notes](RELEASE_NOTES_V4_03.md), the [V4.01 asset verification report](docs/ASSET_OPTIMIZATION_V4_01.md) and [CHANGELOG.md](CHANGELOG.md).

## Data source

The live lightning data displayed by Gewitterradar is supplied through the Home Assistant Blitzortung.org integration. The number of simultaneously available lightning events depends on the integration configuration, including detection radius, time window and maximum number of lightning events.

## License

No software license has been selected for this repository yet. Until a license is added, the source remains subject to the default copyright rules applicable to the repository owner.
