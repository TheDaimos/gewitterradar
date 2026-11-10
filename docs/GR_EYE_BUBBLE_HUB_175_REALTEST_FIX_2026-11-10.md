# Eye Bubble Hub – gebündelte Realtestkorrektur 175

Datum: 10.11.2026. Arbeitsquelle ausschließlich `TheDaimos/gewitterradar@deploy/dev`.
Basis: `4aff02cdbc1ddc56cc37f1c33a895901d4d38eee` (174 plus Korrekturauftrag).
Neue Lieferung: **GR 4.11.175 DEV / HA 0.25.82 / Runtime 411175r1 / E411-175A1**.

## Ursache und gezielte Korrektur

Der Controller setzte `eye.hidden=!config.grouped` und positionierte das Eye nur
bei eingeschalteter Gruppierung. Das entsprach der alten Regel, widerspricht aber
der neuen verbindlichen Produktentscheidung. Das Eye ist nun unabhängig davon
sichtbar und positioniert. Gruppierung AUS bleibt Standard: kurzer Tap und
600-ms-Long-Press öffnen denselben vorhandenen Konfigurator. Gruppierung EIN:
Tap öffnet/schließt Bubbles, Long-Press öffnet den Konfigurator. Keine Wetterebene
wird durch das Eye aktiviert. Die eigenständigen Icons behalten ihre Regeln.

Der zweite Screenshot belegt einen eingeschalteten Gruppierungszustand. Ein
generell defekter Toggle wird daher nicht behauptet. Im vollständigen Modulbaum
wechseln AUS/EIN sofort und bleiben nach Reload erhalten. Derselbe deduplizierte
Handler akzeptiert jetzt `input` und `change`, auch für zugängliche bzw.
WebView-Bedienpfade, ohne doppelte Speicherung derselben Änderung.

Der Header verwendet das unveränderte runde `ABOUT_CLOSE_IMAGE`, das auch die
allgemeinen sowie Wind-/Temperatur-Einstellungen verwenden (112×112-WebP,
SHA256 `3c0c183a50ec7367e00098f201d1500d513475afe64d35aba4b4550cca4d93bb`).
Das freigegebene eckige `PREMIUM_CLOSE` zum Leeren der Slots bleibt erhalten.

## Größe, Layout und Darstellung

- UI und Screenreader verwenden Prozent: 42 CSS px = 100 %, 126 px = 300 %.
  Untergrenze 36 px (angezeigt 85,7 %), Schritt 0,1 Prozentpunkt. Eingaben werden
  auf 36–126 px begrenzt. Touchziel mindestens 50×50 px.
- Schema 1 und gespeichertes `size` in Pixeln bleiben kompatibel. Bestehende 72 px
  bleiben exakt 72 px, Anzeige 171,4 %. Nur eine ausdrückliche Regleränderung
  rechnet Prozent in Pixel um (auf sechs Dezimalstellen gerundet); keine Migration
  und kein Reset. Das UI rundet auf eine Dezimalstelle.
- Desktop: Gruppierung | Aura, darunter Größe | Intensität, darunter Schattierung |
  Helligkeit. Schmale Ansichten einspaltig. Gemeinsames Grid statt Einzeloffsets.
- Direkte Verwendung der unveränderten 1254×1254-Originalmaster offen/geschlossen,
  ohne verkleinerte Zwischenbilder. Vorschauen verwenden dieselbe Eye-/Bubble-
  Darstellung mit einer bei Bedarf skalierten Szene innerhalb ihrer Fläche.
- Ringradien bleiben slotindexbezogen, Farben funktionsbezogen. Geometrie und
  Bubble-Abstand berücksichtigen bis zu 126 px Eye-Größe. Die Position wird nur
  für die Darstellung innerhalb der Karte begrenzt; gespeicherte Positionen und
  `Position merken` bleiben unangetastet. Ein tatsächlicher Drag speichert wie bisher.
- Eye-Ringe nutzen feinere radiale Farb-/Transparenzverläufe und zurückhaltende
  Schatten; Intensität steuert Ausdehnung, Helligkeit separat die Deckkraft.
  Bubble-Auren sind schwächer. Gruppierung AUS oder Aura AUS unterdrückt sie.
- Die neutrale Schattierung ist separat, weich und auf 1,45× Eye-Größe begrenzt.
  Der dezente dekorative Vorschau-Halo ist nur für Eye definiert und in beiden
  Vorschauen gleich. **Originaler Kompass-Halo und Kompassoberfläche unverändert.**

## Betroffene Dateien und Bestandsschutz

Funktionale Änderungen ausschließlich:

- `frontend/modules/weather/eye-hub-model.js`: Prozentkonversion, Größenbereich,
  größenabhängige Ring-/Bubble-Geometrie.
- `frontend/modules/weather/eye-hub.js`: ständige Sichtbarkeit, Tap bei AUS,
  sichere Darstellung am Rand ohne Positionsmigration.
- `frontend/modules/weather/eye-hub-view.js`: Header-X, Grid, Prozentbedienung,
  Eye-Effekte und begrenzte Vorschauen.
- `frontend/modules/weather/display-menu.js`: bestehendes gemeinsames Headerasset
  über die vorhandene Modulabhängigkeit bereitstellen; Gestenlogik unverändert.

Hinzu kommen `scripts/test-eye-hub-model.mjs`,
`scripts/test-eye-hub-fix-browser.cjs`, die zwei vorhandenen öffentlichen
Workflow-Dateien und dieser Bericht. Der bestehende Build synchronisiert
Version, Runtime-/Modulmanifest, Importkennungen, DRA-Provenienz, HA-Manifest,
Buildinfo, Frontendkopien unter HA und Dashboard sowie `SHA256SUMS_FRONTEND.txt`.
`diagnostics/raster-lab.js` erhält ausschließlich Releaseimport-/Modulversionen.

Keine Änderung an WR, Wind-/Temperatur-/Niederschlagsdatenpfaden, Renderern,
Blitzen, Kompass-Halo, bestehender Menü-Navigationslogik oder DRA-Projekt/Kanal.
Geschützte Referenzdokumente, Tags und Releases 171/173/174 bleiben erhalten.

## Gezielte Nachweise

Modelltest: kompatible Pixelwerte, 100/200/300 %, Begrenzung, Aura-Wahrheitstabelle,
Slotidentität, acht Bubbles bei maximaler Größe, Originalmaster sowie bytegleiche
geschützte Navigation und originaler Kompassstil.

Browsertest lädt den **vollständigen tatsächlichen GR-Modulbaum** mit Leaflet.
Provider-I/O und zusätzliche Statusfunktionen für acht Ringe sind ausdrücklich
synthetische UI-Testfixtures, keine produktiven Ersatzwetterdaten.

Ansichten: Desktop 1280×900, Android 393×851 und 851×393, iPad 820×1180.
Geprüft: Eye und Einzelicons bei AUS, Tap/echter Pointer-/Touch-Hold, Toggle-
Persistenz, zwei vorhandene Einstellungsstile, Header-/Slot-X, Desktop-/Mobilgrid,
100/171/200/300 %, Tastatur Home/End, Screenreaderwert, Legacy-72-px-Erhalt nach
Reload, 1254-px-Quellen, 1/4/8 Ringe an allen vier Kartenrändern (12 Fälle je
Ansicht), bedienbare Bubbles ohne Eye-Überlappung, Vorschaugrenzen, Aura AUS,
separate Schattierung sowie Drag ohne Klick/Long-Press. Keine Browserfehler.

`verify-frontend.mjs`: alle 36 registrierten Module, Releaseidentität,
172 Frontenddateien, exakte HA-/Dashboard-/Prüfsummenparität.
Installationspakete werden zusätzlich aus dem committed Stand erzeugt und auf
Identität und CRC geprüft. Öffentliche CI wird gezielt über den vorhandenen
registrierten Workflow ausgelöst; fachfremde Jobs bleiben übersprungen.

**Keine physische Android-/iPad-/Companion-/VM109-Abnahme und keine echte
WebKit-Prüfung durchgeführt.** Browseransichten sind Chromium-Emulation.
Keine automatische Installation auf VM109 oder VM101; reale Sichtabnahme offen.

## Installation

Bestehende DRA-Quelle unverändert: `TheDaimos/gewitterradar`, `deploy/dev`.
[Installierbare neue DEV-Lieferung](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.11.175-dev).
HA-ZIP, Dashboard-ZIP, `deployment.json` und `SHA256SUMS.txt` werden als neue
Releaseassets veröffentlicht. Vollständige Commits, Paketprüfsummen und
CI-Nachweis folgen unten nach tatsächlicher Erstellung/Verifikation.

## Paketnachweis

Implementierungscommit: `3f824bbc514678a55f46d427438e7404a07b7418`.

- `gewitterradar-0.25.82-dev.zip`: SHA256 `183be92c4a74c86da65b7c8f36073cb301b6c76effbcd6e740c7fddf6e7ce713`
- `gewitterradar-dashboard-4.11.175-dev.zip`: SHA256 `0c7f4a1f9c88a950adebbf614e480c1c469ef34f44b53784da53f1ba9b799720`

The final documentation commit is the release target, recorded in deployment.json. ZIP payloads remain identical to the implementation commit.
