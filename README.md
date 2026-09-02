# Gewitterradar

**Gewitterradar** is a Home Assistant dashboard card for live lightning and thunderstorm visualization using data supplied by the Home Assistant Blitzortung.org integration.

Current stable release: **V4.01**

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

The JavaScript card is registered as:

```yaml
type: custom:gewitterradar-card
```

## Release

V4.01 is a maintenance release that conservatively optimizes the four external PNG assets while preserving the V4.00 feature set and Home Assistant helper interface.

See [V4.01 release notes](RELEASE_NOTES_V4_01.md), the [asset verification report](docs/ASSET_OPTIMIZATION_V4_01.md) and [CHANGELOG.md](CHANGELOG.md).

## Data source

The live lightning data displayed by Gewitterradar is supplied through the Home Assistant Blitzortung.org integration. The number of simultaneously available lightning events depends on the integration configuration, including detection radius, time window and maximum number of lightning events.

## License

No software license has been selected for this repository yet. Until a license is added, the source remains subject to the default copyright rules applicable to the repository owner.
