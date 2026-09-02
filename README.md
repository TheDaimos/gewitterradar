# Gewitterradar

**Gewitterradar** is a Home Assistant dashboard card for live lightning and thunderstorm visualization using data supplied by the Home Assistant Blitzortung.org integration.

Current stable release: **V4.04**

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

HACS installs `gewitterradar.js`, the four required visual assets and a staged copy of `app_gewitterradar_pkg.yaml` below `/config/www/community/gewitterradar/` (exposed by Home Assistant as `/hacsfiles/gewitterradar/`).

The package still requires one manual step: copy or move

```text
/config/www/community/gewitterradar/app_gewitterradar_pkg.yaml
```

to

```text
/config/packages/app_gewitterradar_pkg.yaml
```

and restart Home Assistant. This cannot be automated by the HACS Dashboard installation because HACS installs this repository only inside its own `/config/www/community/gewitterradar/` directory and does not deploy configuration files into `/config/packages/`.

The canonical package source remains `home-assistant/app_gewitterradar_pkg.yaml`; V4.04 places a byte-identical convenience copy at `dist/app_gewitterradar_pkg.yaml` so HACS delivers it together with the card.

The JavaScript card is registered as:

```yaml
type: custom:gewitterradar-card
```

## Release

V4.04 keeps the working V4.03 HACS distribution model: the GitHub release publishes **zero custom release assets**, forcing current HACS to use the tagged `dist/` tree. V4.04 adds `dist/app_gewitterradar_pkg.yaml` to that tree, so users no longer need to download the helper package separately before installing it manually under `/config/packages/`.

Application behavior, helper IDs/defaults, layouts, lightning processing, compass behavior and the optimized PNG files remain unchanged.

See [V4.04 release notes](RELEASE_NOTES_V4_04.md), the [HACS packaging note](docs/HACS_V4_02_FIX.md), the [V4.01 asset verification report](docs/ASSET_OPTIMIZATION_V4_01.md) and [CHANGELOG.md](CHANGELOG.md).

## Data source

The live lightning data displayed by Gewitterradar is supplied through the Home Assistant Blitzortung.org integration. The number of simultaneously available lightning events depends on the integration configuration, including detection radius, time window and maximum number of lightning events.

## License

No software license has been selected for this repository yet. Until a license is added, the source remains subject to the default copyright rules applicable to the repository owner.
