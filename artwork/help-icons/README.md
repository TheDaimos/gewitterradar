# Gewitterradar – Premium Help Icons

V4.07.11 test assets for **Hilfe & Hinweise**.

## Master policy

All assets in `hires/` are the canonical originals for this visual family. The historical vector masters use a 2048×2048 SVG canvas with transparent background. Raster-native premium masters retain their native resolution and transparent PNG format. All masters are kept in the canonical `TheDaimos/gewitterradar` repository. The test build embeds browser-rendered derivatives of these masters; the original artwork remains untouched.

## Variants

- `help-external-shield2.svg` — TEST11A, premium Shield variant 2 / firewall motif.
- `help-external-rj45.svg` — TEST11B, premium shield with RJ45/network-plug motif.

All other icons are shared by both V4.07.11 variants.


## V4.10 instrument icon

- `help-instruments-v410-compass.svg` — Hi-Res/Vektor-Master für den Hilfeabschnitt **Kompass, Medaillon & Pfeile**.
- Master-Canvas: **2048×2048**, transparenter Hintergrund.
- Laufzeitdarstellung: verlustfreies **68×68 PNG** als 2×-Retina-Ableitung für 34×34 CSS-Pixel; die PNG-Ableitung wird direkt in die Hilfe eingebettet.
- Der Master bleibt gemäß Retentionsrichtlinie dauerhaft erhalten.


## V4.11 hero backgrounds

Die folgenden PNG-Dateien werden als kanonische Hi-Res-Master für den Gewitterradar-Hero-Bereich dauerhaft aufbewahrt:

- `Gewitter über dem alpinen Abendtal.png` — eigenständige alpine Gewittervariante.
- `Goldenes Tal zwischen Sonne und Sturm.png` — warme Panorama-Variante mit Übergang zum Gewitter.
- `gewitterradar-hero-forest-storm-master-v1.png` — kanonischer Wald/Lagerfeuer- und Gewitter/Kirche-Master für die aktuelle Hero-Variante.

Alle drei Dateien sind geschützte Hi-Res-Master gemäß `docs/ASSET_RETENTION_POLICY.md`. Laufzeitkopien oder konvertierte Webvarianten ersetzen die Master ausdrücklich nicht.

## V4.11 WeatherRouter display-eye icons

The WeatherRouter visualization uses a dedicated premium eye-icon pair derived
from the accepted design variant **Nr. 4**.

Canonical transparent Hi-Res masters:

- `help-display-eye-open-master-1254.png` — open eye; display menu enabled.
- `help-display-eye-closed-master-1254.png` — closed eye; display menu disabled.

Both masters are native **1254×1254 RGBA PNG** assets and are protected by the
Hi-Res asset-retention contract. They must remain in the canonical repository
and must not be replaced by smaller runtime derivatives.

Runtime derivatives are kept under `artwork/help-icons/runtime/`:

- 34×34 — 1× reference size
- 68×68 — 2× Retina for 34×34 CSS pixels
- 136×136 — 4× Retina
- 256×256
- 512×512

The derived files preserve transparency and use lossless PNG encoding.
Resizing uses high-quality LANCZOS resampling.

WeatherRouter state semantics:

- open eye = display menu enabled
- closed eye = display menu disabled
- WeatherRouter unavailable = closed-eye artwork may appear disabled/desaturated
  in settings; no non-functional active eye control should be shown on the map.

The asset metadata and SHA-256 identities are recorded in
`help-display-eye-ASSET_MANIFEST.json` and `provenance.json`.

