# GR-MENU-ANIMATION-RESTORE-02

Stand: 09.11.2026. GR **4.11.171 DEV**, HA **0.25.78**, Runtime
**411171r1**, zentraler Modulsatz **E411-171A1**.

## Basis und Befund

Aufgebaut auf dem aktuellen `deploy/dev`-HEAD
`c65bcff0ec5439487b277078129bba01f8e84fc0`. Dieser ergänzt ausschließlich
die Referenzdokumentation zur geschützten Version 4.11.170. Deren Codecommit
`e18d6a3499d379e797c0ce27b5fdaaa5ea2efd84`, Tag, Release und Dokumentation
bleiben unverändert. Vergleichsstand vor dem Seitenumbau:
`7213b7aeffba5c6bc6fd2afb6bd74f84c88632b6`.

Die historische WAAPI-Navigation war weiterhin vorhanden. Der Seitenumbau
verwendet jedoch `hidden`-Zustände für die echten Seiten sowie wiederhergestellte
Scrollpositionen im gemeinsamen Inhaltscontainer. `cloneNode()` übernahm den
versteckten Zustand in die Animationskopien. Gleichzeitig lag die absolute
Animationsebene am Ursprung des scrollbaren Inhalts statt zuverlässig am
sichtbaren Ausschnitt. Das Verbergen des echten Inhalts während der Animation
kann dessen Scrollgeometrie zusätzlich verändern. Die Animationsuhren starteten
bereits vor dem ersten Paint der synchron vorbereiteten Zielseite.

Der Desktop-Ausgangsstand zeigte in der gezielten Untersuchung durchaus noch
Transformationsbewegungen. Eine generelle Unsichtbarkeit in jedem Browser wird
deshalb nicht behauptet. Repariert werden die konkret vorhandenen Abhängigkeiten
von versteckten Seitenzuständen, Scrollgeometrie und Paint-Reihenfolge. Ein
ursächlicher Nachweis auf dem betroffenen physischen Android-Gerät steht aus.

## Umsetzung

`frontend/modules/ui/controls.js` verwendet weiterhin dieselbe horizontale
Animation mit gegenläufigen Seiten, spiegelbildlicher Zurückrichtung,
`cubic-bezier(.22,.7,.2,1)`, vorhandener Höhen-/Gegenskalierung und abschließendem
110-ms-Übergang zur echten Seite. Keine neue Animationsengine und kein Rückbau
der gemeinsamen sieben Hauptseiten und vier Diagnoseseiten.

Die reinen, inerten Animationskopien erhalten einen sichtbaren Wurzelzustand;
versteckte Unterelemente bleiben unverändert. Ihre vertikale Inhaltsposition
entspricht der jeweiligen gespeicherten Scrollposition. Die Animationsebene
wird am sichtbaren Inhaltsausschnitt verankert, auch nach Layout-/Scrolländerungen.
Die bestehenden WAAPI-Zeitachsen werden gemeinsam im nächsten vorbereiteten
Animationsframe gestartet. Abbruch entfernt auch diesen noch ausstehenden Frame.

Die gemeinsame Optionsliste versorgt die vorhandene Geschwindigkeitseinstellung
beider Menüpräsentationen; es gibt keinen zweiten Speicherzustand:

| Auswahl | Horizontale Laufzeit |
| --- | ---: |
| Schnell | 220 ms |
| Mittel | 440 ms |
| Langsam | 760 ms |
| Ohne Animation | 0 ms |

Die drei animierten Modi behalten den bestehenden abschließenden 110-ms-Crossfade;
die Tabelle bezeichnet die tatsächliche horizontale WAAPI-Dauer. Bei 0 ms werden
Snapshot-Erzeugung, WAAPI, Größenanimation, Crossfade und deren Zeitgeber vollständig
übersprungen. Der Seitenwechsel erfolgt synchron im modernen Menü.
`prefers-reduced-motion: reduce` benutzt ebenfalls diesen direkten Pfad.
`gr-horizontal-navigation-speed` und vorhandene Werte bleiben kompatibel;
ungültige/fehlende Werte verwenden weiterhin **Mittel**. Die gespeicherte Wahl
wird bei Bewegungsreduzierung nicht überschrieben.

## Gezielte Prüfung

Reproduzierbar mit `scripts/test-gr-menu-animation-restore.cjs`, Playwright,
lokalem Chromium und der bestehenden vollständigen GR-/Leaflet-Browserfixture.
Die Fixture ersetzt HA-/Wetter-I/O, lädt aber den tatsächlichen GR-Modulbaum.

- Desktop 1280 x 900, Android-Touch-Viewport 393 x 851 und iPad-Touch-Viewport
  820 x 1180; alle vier Modi.
- Tatsächliche WAAPI-Dauern und berechnete Transformationsmatrizen bei 12 % und
  58 % der Laufzeit, mit entgegengesetzter Bewegung bei Vorwärts/Zurück.
  Sichtbare Kopien, ausreichende Höhe und Ausrichtung am Inhaltsviewport geprüft.
  Zwischenbilder lokal visuell betrachtet; keine bloße Erreichbarkeitsprüfung.
- Weather-Engine vor/zurück einschließlich wiedergeöffneter gescrollter Seite;
  Diagnose Tools mit allen vier Unterseiten; Schließen/Wiederöffnen und
  Browser-Zurück während laufender Navigation; keine verbleibenden Overlays/Sperren.
- Alle vier Dropdownoptionen und Wechsel zwischen Schnell und Ohne Animation
  im geöffneten Menü; Persistenz von Geschwindigkeit und modernem Menüstil nach Reload.
- Ohne Animation: unmittelbarer Zustand ohne Overlay oder WAAPI-Aufruf.
  Bewegungsreduziertes modernes Menü und klassisches Menü ebenfalls ohne WAAPI;
  gespeicherte Geschwindigkeit bleibt erhalten.
- JavaScript-Syntax, `git diff --check` und `scripts/verify-frontend.mjs`:
  Versions-/Modulregistrierung, DRA-Metadaten und bytegleiche Frontend-Auslieferung
  mit Prüfsummen geprüft.

Keine umfassende CI-Serie und kein Workflow-Dispatch. Chromium-Viewportemulation
ist keine physische Android-/iPad-/Companion-Abnahme. WebKit und eine reale
Installation auf VM109 sind nicht geprüft. Keine gemessene Gerätebildrate behauptet.

## Dateien und Bestandsschutz

Verhaltensänderung ausschließlich in `frontend/modules/ui/controls.js`;
gezielter Browsernachweis in `scripts/test-gr-menu-animation-restore.cjs`.
Release-Synchronisierung aktualisiert `frontend/version.js`, `module-manifest.js`,
`assets.json`, das Runtime-Manifest und Cacheimporte in `gewitterradar.js`,
`panel.js` und `modules/diagnostics/raster-lab.js` (dort nur Importkennung und
Modulversion). Außerdem HA-Manifest, `build_info.py`, DRA-Provenienz,
`SHA256SUMS_FRONTEND.txt` und die erzeugten Kopien unter
`custom_components/gewitterradar/frontend/` und `dashboard/dist/`.

Keine Änderung an WeatherRouter, Wetterdatenpfaden, Wetterrenderern oder deren
Parametern. Keine Änderung der DRA-Projekt-/Kanaldateien, historischen Referenzen,
Tags/Releases oder des stabilen Hauptbranches. Keine automatische HA-Installation.
Keine Diagnose-/Realtestexporte in diesem Repository hinzugefügt.

## Bereitstellung

Bestehender DRA-Kanal: **TheDaimos/gewitterradar, deploy/dev**, unverändert.

- [Installierbares DEV-Release](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.11.171-dev)
- [HA-Installationspaket](https://github.com/TheDaimos/gewitterradar/releases/download/v4.11.171-dev/gewitterradar-0.25.78-dev.zip)
- [Dashboard-Paket](https://github.com/TheDaimos/gewitterradar/releases/download/v4.11.171-dev/gewitterradar-dashboard-4.11.171-dev.zip)
- [SHA256SUMS.txt](https://github.com/TheDaimos/gewitterradar/releases/download/v4.11.171-dev/SHA256SUMS.txt)
- [Deployment-Nachweis mit vollständigem Releasecommit](https://github.com/TheDaimos/gewitterradar/releases/download/v4.11.171-dev/deployment.json)

Die Betreiberinstallation und visuelle Realabnahme auf VM109 bleiben offen.
