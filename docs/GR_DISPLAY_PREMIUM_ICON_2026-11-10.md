# Original-Premium-Kartenschalter für Darstellung

Datum: 10.11.2026. GR **4.11.172 DEV**, HA **0.25.79**, Runtime
**411172r1**, zentraler Modulsatz **E411-172A1**.
Basis: aktueller `deploy/dev`-HEAD
`6b066bd01a5c4484f6340057b416f2d17ed3e355` mit geschützter Referenz 4.11.171.

## Originalgrafik und Größe

Die bereitgestellte Datei **Glänzendes Wetterkarten-Emblem mit Regler.png**
wurde bytegleich als `frontend/assets/gr-weather-display-premium-original.png`
übernommen: 1254 × 1254 Pixel, Transparenz erhalten, keine Neuzeichnung,
Komprimierung, Farbänderung oder Bildbearbeitung.

Original-/Auslieferungs-SHA256:
`c0c18f4f283e350fb9612ed620af426f2ac9f8d270e8a36016c29b1fc48cecf2`.

Der vorhandene Augen-Kartenschalter verwendet jetzt dieses Original-Emblem.
Das Eye-Icon innerhalb des bestehenden Darstellungsmenüs bleibt erhalten.
Es gibt keinen zusätzlichen parallelen Dialog oder Konfigurationszustand.

Der bisherige Kartenschalter hatte unterschiedliche Desktop-/Mobilgrößen
(44 bzw. 46 Pixel). Jetzt messen seine Bedienfläche sowie die von Wind,
Temperatur und Niederschlag **50 × 50 CSS-Pixel** auf allen geprüften Geräten.
Das neue Bild erhält 49,5 × 49,5 CSS-Pixel, um seinen geringeren transparenten
Rand auszugleichen. Der sichtbare Goldring misst horizontal ca. **44,88 Pixel**;
Wind ca. 44,85 und Niederschlag ca. 44,91 Pixel. Die bestehenden Temperaturassets
liegen je nach ausgewählter Auflösung bei ca. 44,12–44,49 Pixeln. Keine
abweichende Desktop-/Touch-Mediaregel für den neuen Schalter.

## Bedienung

- Klick/Tap öffnet das bestehende Menü **Darstellung**.
- Long Press nach **600 ms** öffnet dasselbe Menü bereits vor dem Loslassen.
- Auch ein erneuter Klick öffnet/maximiert das Menü; er schaltet es nicht aus.
- Drag verschiebt das Icon, unterdrückt Klick und Long Press und bewegt nicht
  gleichzeitig die Karte.
- Die gemeinsame vorhandene Pointer-Steuerung von Wind/Temperatur/Niederschlag
  wird wiederverwendet, einschließlich Pointer Capture, Abbruch, Touch-Callout-
  Unterdrückung und Schutz gegen nachfolgende Kompatibilitätsklicks.
- Tastaturaktivierung bleibt möglich; Fokusmarkierung und `aria-expanded`/
  `aria-controls` sind vorhanden.
- Bestehende normalisierte Position unter
  `gewitterradar:weather-display:v1` / `eyePosition` wird weiterverwendet.
  Keine Migration oder Rücksetzung. Speicherung folgt der vorhandenen Option
  **Position merken**. Resize begrenzt die Position auf den sichtbaren Kartenbereich.
- Laufende Gesten/Timer werden beim Entfernen der Oberfläche bereinigt.

## Gezielt geänderte Dateien

Verhaltensänderung in `frontend/modules/weather/display-menu.js`; neue Original-
PNG und Eintrag in `frontend/assets.json`; gezielter Test
`scripts/test-gr-display-icon-browser.cjs`. Versions-/Cache-Synchronisierung in
`frontend/version.js`, `module-manifest.js`, Runtime-Manifest, Einstiegsskripten
und abhängigen Modulkennungen. HA-Manifest, Buildinfo und DRA-Provenienz aktualisiert.
Frontendkopien unter `custom_components/gewitterradar/frontend/` und
`dashboard/dist/` sowie `SHA256SUMS_FRONTEND.txt` über den bestehenden Build erzeugt.

Keine Änderungen an Wind-, Temperatur- oder Niederschlagsrenderer/-daten,
WeatherRouter oder deren meteorologischen Einstellungen. Gemeinsame
Pointer-Implementierung und geschützte Menüanimation selbst unverändert.
DRA-Projekt-/Kanaldateien, frühere Referenzen, Tags/Releases und `main` unangetastet.

## Tatsächlich durchgeführte Prüfung

Vollständiger echter GR-/Leaflet-Modulbaum mit synthetischem Provider-I/O und
lokalem Chromium/Playwright:

| Ansicht | Viewport | Device Scale Factor | Ergebnis |
| --- | --- | ---: | --- |
| Desktop | 1280 × 900 | 1 | bestanden |
| Desktop HiDPI | 1920 × 1080 | 1,5 | bestanden |
| Android Hochformat | 393 × 851 | 3 | bestanden |
| Android Querformat | 851 × 393 | 3 | bestanden |
| iPad | 820 × 1180 | 2 | bestanden |

In jeder Ansicht: tatsächliche CSS-Abmessungen aller vier Schalter sowie
sichtbare Goldbreiten aus den geladenen Originalpixeln geprüft (Abweichung
horizontal unter 1 CSS-Pixel); native Maus-/Touch-Pointer für Klick, 600-ms-
Long-Press, Drag, Abbruch; kein nachfolgendes Menüschließen; kein Kartenverschieben;
Position nach Reload; Begrenzung nach Resize/Orientierungswechsel; gleiche
Menüinstanz; unveränderte Wetterkonfiguration. Screenshots auf Desktop und
Android zusätzlich visuell betrachtet. Desktop-Tastaturaktivierung geprüft.

JavaScript-Syntax, `git diff --check`, Versionskonsistenz und
`scripts/verify-frontend.mjs` bestanden: 36 registrierte Module, 164 Frontend-
Dateien, exakte Auslieferungs-/Prüfsummenparität.

Keine umfassende CI-Serie gestartet. Browseremulation ist keine echte Android-,
iPad- oder HA-Companion-Abnahme. WebKit und physische Geräte wurden nicht geprüft.
Keine automatische Installation auf VM109 oder Änderungen an PROD VM101.

## DEV-Bereitstellung

DRA unverändert: **TheDaimos/gewitterradar@deploy/dev**.

- [Release 4.11.172 DEV](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.11.172-dev)
- [HA-Paket 0.25.79](https://github.com/TheDaimos/gewitterradar/releases/download/v4.11.172-dev/gewitterradar-0.25.79-dev.zip)
- [Dashboard-Paket](https://github.com/TheDaimos/gewitterradar/releases/download/v4.11.172-dev/gewitterradar-dashboard-4.11.172-dev.zip)
- [SHA256SUMS](https://github.com/TheDaimos/gewitterradar/releases/download/v4.11.172-dev/SHA256SUMS.txt)
- [Deployment-Nachweis und vollständiger Releasecommit](https://github.com/TheDaimos/gewitterradar/releases/download/v4.11.172-dev/deployment.json)

Die physische Sichtabnahme und Betreiberinstallation bleiben offen.

## Paketnachweis

Implementierungscommit: `55f2d643c1ed3f2b3ff31a61bf14c4c4d16511f1`.

- `gewitterradar-0.25.79-dev.zip`: SHA256 `b3f1a701a6ceb77e16a476cb23953b77564677904d53355df8de9ea9edebb915`
- `gewitterradar-dashboard-4.11.172-dev.zip`: SHA256 `131e95754fb6081970786b5aae8795f89ae856c6a13532c8fd0d56fb79d4f8fe`

Der abschlieÃŸende Dokumentationscommit ist zugleich das Releaseziel; seine
volle SHA steht in `deployment.json` und im GitHub-Release. Die ZIP-Inhalte
bleiben gegenÃ¼ber dem Implementierungscommit unverÃ¤ndert.
