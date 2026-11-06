# GR-LEGEND-UI-06 · Gemeinsame Radarlegende

2026-11-06 · **GR 4.11.148 DEV / HA 0.25.55 DEV** · `deploy/dev`.
**WeatherRouter 0.10.295 DEV / Loader 298 bleibt unverändert.**

## Tatsächlicher Metadatenvergleich

Quelle: die vorhandenen öffentlichen Consumer-Legenden `dwd_rate_legend()` und
`rate_legend()` des geschützten WR295-Commits
`0857a9920bbfeed3d512c4f7896c175a66518598`. Kein neuer WR-Vertrag erforderlich.
Beide besitzen 15 Klassen in mm/h mit derselben RGB-Folge. Alle Obergrenzen,
die Grenzen ab 0,2 mm/h und die offene höchste Klasse ≥150 mm/h stimmen überein.
Nur die erste Untergrenze unterscheidet sich: DWD einschließlich 0,1 mm/h,
OPERA ausschließlich 0 mm/h.

| Klasse: DWD / OPERA | Gemeinsames RGB |
|---|---|
| 0,1–<0,2 / >0–<0,2 | 51, 255, 255 |
| 0,2–<0,4 | 26, 204, 154 |
| 0,4–<1 | 1, 153, 52 |
| 1–<2 | 77, 179, 27 |
| 2–<3 | 153, 204, 1 |
| 3–<5 | 204, 230, 1 |
| 5–<7,5 | 255, 255, 1 |
| 7,5–<10 | 255, 196, 1 |
| 10–<15 | 255, 137, 1 |
| 15–<30 | 255, 69, 1 |
| 30–<45 | 254, 0, 0 |
| 45–<75 | 229, 0, 76 |
| 75–<100 | 204, 0, 152 |
| 100–<150 | 102, 0, 203 |
| ≥150 | 0, 0, 254 |

Diese Tabelle dokumentiert den Vergleich; sie ist keine neue Frontend-Farbtabelle.
Die vorhandenen aktiven WR-Metadaten bleiben die Quelle der dargestellten Farben
und Werte. Beide bestehenden GR-Referenzpaletten bleiben bytegleich.

## Umsetzung in der bestehenden Premium-Legende

`frontend/modules/weather/legend-overlay.js`, Modulversion 0.1.2:

- Nur die eindeutig identifizierten DWD-/OPERA-Radarskalen werden verglichen.
  Einheit, physikalische Größe, RGB-Reihenfolge, Klassenanzahl, numerische
  Grenzen, offene/geschlossene Intervalle, höchste Klasse und Tick-Metadaten
  müssen kompatibel sein. Fehlende, widersprüchliche oder unbekannte Angaben
  führen zur bisherigen getrennten Darstellung.
- Identische Skalen oder ausschließlich abweichende erste Untergrenzen erhalten
  eine Darstellung **DWD / OPERA · Radar-Niederschlag**. Eine der empfangenen
  Tabellen wird unverändert wiederverwendet; keine Interpolation, neue Farbe
  oder Änderung eines numerischen Klassenwertes.
- Bei unterschiedlichen Untergrenzen kennzeichnet `*` die erste Klasse und
  den ersten Balkentick. Darunter steht sichtbar
  **DWD ab 0,1 mm/h · OPERA >0 mm/h**. Das Sternchen ist eine Beschriftung,
  kein geänderter Klassenwert. Der Hinweis funktioniert in beiden Ansichten.
- WR-`times.valid_at` bleibt jeder Quelle zugeordnet, beispielsweise
  **DWD 19:40 UTC · OPERA 19:30 UTC**. UTC-Offsets werden nur zur Anzeige
  formatiert; bei unterschiedlichen UTC-Daten erscheinen auch beide Datumswerte.
  Sekunden bleiben erhalten. Fehlende Zeitpunkte werden ausdrücklich benannt.
  Es gibt keine eigene GR-Zeit- oder Aktualitätsregel.
- NASA-Regen bleibt unabhängig, auch wenn Farben zufällig übereinstimmen.
  Schnee bleibt eine eigene einklappbare Familie mit mm/h SWE.
  Einzelprovider behalten ihre vorhandenen eigenen Legendentitel.
- Premium-CSS, Chevron, Größenbegrenzung, Maus-/Touch-Drag, Positionsspeicherung
  und Klassen-/Balken-Speicherung sind unverändert. Es entstehen keine externen
  Originalfarbskalen oder neuen Legendenfenster.

## Betroffene Dateien und geschützte Grenzen

Funktionale UI-Änderung ausschließlich im bestehenden `legend-overlay.js`.
`precipitation-layer.js` erhält ausschließlich die Cachekennung des importierten
Legendenmoduls (411147r1 → 411148r1); der vollständige übrige Dateiinhalt bleibt
gleich. Das verhindert die Mischung alter und neuer UI-Module nach dem Update.
Keine Änderung an Wetterdatenlogik, V2-Rastervertrag, Providerwahl, Masken,
Compositor, Generationen, World-Wrap, Transport, Speicher oder Zeitpolitik.

Weitere Änderungen betreffen ausschließlich Versions-/DRA-Metadaten,
Modulmanifest und Runtime-Manifest, Frontend-Build-/Versionsprüfungen und deren
vorhandene Integrations-/Dashboardkopien und Prüfsummen. Neue gezielte Prüfungen:
`tests/gr-legend-ui-06.test.mjs` und der manuell gestartete öffentliche Workflow
`.github/workflows/gr-legend-ui-06.yml`. Der vorhandene öffentliche Dispatcher
`shared-frontend.yml` ruft für GR148 ausschließlich diesen gezielten Prüfpfad
auf; die allgemeine Wetterdatenkampagne wird für diese UI-Version übersprungen.
Andere Versionen behalten den bisherigen Workflow. Keine Änderung an `main`.
Die bestehende Paketstruktur bleibt gleich.

Die geschützte Referenz
`weather-router-dev@deploy/dev:docs/p7-010-coordination/WR_GR_MOSAIC_REFERENCE_2026-11-06.md`
bleibt unverändert (Blob `3bc119cf16f10d32ef8f038a13be8266495aa269`).
GR147-Tag/Commit `ab55f7b2bfee4a35511b2e95359572e8f2cae6da` und WR295-Tag/Commit
bleiben erhalten. Keine privaten Actions, keine TEST69-Ausführung, keine VM101-Aktion.
Diagnose-/Realtestexporte bleiben ausschließlich im privaten
`TheDaimos/Project-Log-And-Export@main`; hier liegen nur synthetische UI-Testbilder.

## Gezielte Prüfungen

- 13 Legendenfälle: fünf bestehende und acht unmittelbar ergänzte Prüfungen.
  Positive Zusammenführung, Untergrenzen, UTC-Zuordnung/Datumswechsel,
  Einzelprovider, NASA/SWE, abweichende Farben/Grenzen/Einheiten/Intervallsemantik
  und fehlerhafte Metadaten. Quellenmodelle werden nicht verändert.
- Git-Bytevergleich der geschützten Rastermodule gegen GR147, abgesehen von
  der einzigen genannten UI-Importkennung. Ebenso geprüft: unveränderte
  Referenzpaletten und vollständige CSS-, Drag-, Positions- und Bounds-Methoden.
- Chromium mit echtem DOM, unveränderten Premium-Stilen und den vorhandenen
  WR-Legendenmetadaten: Desktop 1280×900, Android 375×812 und 812×375,
  iPad 768×1024 und 1024×768, zusätzlich 320×740. Die tatsächliche CSS-Breite
  wurde jeweils geprüft. Ein gemeinsamer Radar-Balken plus zwei NASA-Balken;
  15 gemeinsame Radar-Farbklassen und unveränderte 110+110 NASA-Klassen.
- Keine horizontalen Überläufe oder abgeschnittenen Quellenhinweise.
  Beide Ansichten, unabhängiges Einklappen, Chevron-Animation, Schließen/Öffnen,
  Maus/Touch, gespeicherte Position und Ansichtsmodus über Reload bestanden.
  Testbilder unter `artwork/acceptance/legend-ui06/` enthalten ausschließlich
  synthetische Zeitpunkte und keine realen Wetterraster oder Instanzdaten.
- Vorhandene Build-, Versions-, Prüfsummen- und Installationspaketverträge.
  Öffentliche CI prüft ausschließlich diese Legenden-/Paketänderung.

Die Browser-Viewport-/Touch-Emulation ist keine physische Android-/iPad-
Companion-Abnahme. Die anschließende UI-Realabnahme erfolgt auf HA DEV VM109.
Keine erneute Wetterdaten-, NASA- oder wissenschaftliche Testkampagne.

## Installation

GR 4.11.148 DEV / HA 0.25.55 DEV über den vorhandenen DRA-Kanal `deploy/dev`
oder die neuen Release-ZIPs installieren; Frontend vollständig neu laden.
WR295 / Loader298 bleibt installiert. Release-ZIPs enthalten Integration und
Dashboard sowie SHA256SUMS und deployment.json mit dem exakten Quellcommit.
Die bisherigen Releases werden nicht überschrieben.
