# GR 4.11.180 DEV · Premium UI und Eye-Geometrie

## Ausgangsstand

Arbeitsbasis ist `deploy/dev` bei `037b9d0c04d334d73820c495c1694d95d60f1cc5`. Die geschützte Android-Referenz GR 4.11.179 / HA 0.25.86 ist bei `51fe26380bdd97b46fe7d979a2ef994b483cc430` veröffentlicht. Ihr Betreiberbefund ist in `GR_DEV_REFERENCE_4_11_179_2026-11-11.md` festgehalten.

Beide MP4-Dateien wurden in Chromium geöffnet. Für jede Aufnahme wurden sechs zeitlich verteilte Einzelbilder extrahiert. In `77803.mp4` (158,68 s) zeigen die Stichproben bei etwa 13 und 116 s die mehrfarbige Aura im Studio und auf der Android-Karte mit Wind. Die Einschätzung zur flüssigen Bewegung stammt aus der Betreiberabnahme von V179. In `77804.mp4` (8,69 s) zeigen die Stichproben bei etwa 0,7, 3,4 und 6,3 s den Rückgang der sichtbaren Eye-Größe bei Bloom 100 %, obwohl der Eye-Größenregler auf 100 % steht. `77814.png` zeigt die bestehenden Premium-Bedienelemente und die bisherige Transparenzbeschriftung. Die Stichproben erlauben einen Vergleich von Größen und Einstellungen. Sie liefern keine Geräte-Framerate. Die Medien verbleiben außerhalb des Releases.

## Aura-Abstände und Bloom

- **Eye–Aura-Abstand** (`eyeAuraGap`, 0–30 px) verschiebt alle Radien um denselben Betrag. **Aura-Ringabstand** (`auraRingGap`, 0–8 px) vergrößert den Abstand pro benachbartem Slot. Beide Regler haben 1-px-Schritte, starten bei 0 und verwenden den vorhandenen Eye-Speicher sowie DE-/EN-Labels. Der V177-Restore behält seinen bisherigen Umfang von vier Lichtreglern.
- Die gemeinsame Funktion `eyeRingRadius` liefert `size / 2 + 5 + eyeAuraGap + index * (4 + size / 42 + auraRingGap)`. CSS-Ringe, Canvas-Ringe, Basis- und Zusatzfilamente und Lichtperlen verwenden diese Geometrie. Die Abstände gehen in die Cache-Identität ein, damit ein Radiuswechsel auch bei gleicher Canvas-Ausdehnung verarbeitet wird.
- Energiebrücken bleiben an tatsächliche Filamentpositionen gebunden. Bei größerem Ringabstand wachsen Suchradius und Ausblendgrenze um `0,75 × auraRingGap`. Die Abstandsauswahl und die begrenzte Kontaktzahl aus V179 bleiben in Kraft. Der Transfer folgt der tatsächlich gezeichneten Zielbahn. Die Anzahl plausibler Kontakte kann bei großen Abständen sinken.
- Canvas-Ausdehnung und Kartenrandbegrenzung berücksichtigen die Abstände. Die bestehenden Puffergrenzen von 640 px für die Zeichenflächen und 192 px für die Bloom-Maske bleiben in Kraft. Eine am Rand eingeblendete Aura bleibt auf die sichtbare Karte begrenzt. Frame-Clock, Bloom-Cache und adaptive Qualität stammen aus V179.
- Die Vorschau koppelte ihre Projektion an die aktuelle Bloom-Ausdehnung. Sie reserviert jetzt für die geschlossene Aura-Vorschau den Platz für 100 % Bloom. Die Canvas-Maske verwendet weiter den eingestellten Bloom-Wert. Das hält Eye-Größe und Ringradien beim Verstellen konstant. Die 0%-Bloom-Vorschau kann deshalb kleiner gerahmt erscheinen als in V179. Die offene Vorschau verwendet den Platzbedarf ihrer Eye- und Bubble-Geometrie.

## Fenster und Ebenenregler

- Wind- und Temperaturfenster verwenden `bindPremiumPanelDrag` aus `premium-ui.js`. Der Fenstertitel lässt sich mit der Maus ziehen. Schalter, Links und Eingaben behalten ihre eigene Interaktion. Pointer-Capture verhindert gleichzeitiges Verschieben der Karte. Das Fenster bleibt innerhalb der Schnittfläche aus Karte und Viewport und nutzt bei geringer verfügbarer Höhe seinen internen Scrollbereich.
- Die normalisierten Positionen werden getrennt in den bestehenden UI-Speicherbereichen `wind-settings` und `temperature-settings` abgelegt. Beim Wiederöffnen, Neuladen, Minimieren und Größenwechsel werden sie auf den sichtbaren Bereich angewendet. Die Funktion gilt für eigenständige Mausfenster. Eingebettete und mobile Menüs verwenden ihre bisherige Positionierung.
- Im WR-Darstellungsmenü steht weiterhin **Transparenz**. Für Niederschlag, Wolken, Wind und Temperatur bedeutet der Reglerwert jetzt den sichtbaren Anteil. Der Hilfehinweis lautet „0 % = unsichtbar · 100 % = vollständig sichtbar“. Die älteren Niederschlagsfelder im Einstellungsbereich zeigen dieselbe Prozentzahl.
- Gespeicherte Opacitywerte werden ohne Migration gelesen. Eine vorhandene Opacity von 0,70 erscheint als 70 % und ergibt dieselbe Kartenfarbe. Der Standard-Button stellt die bisherige Vorgabeopacity wieder her. Der Windregler behält die Auswahl zwischen Symbol- und Farbfeldopacity. Die Temperaturregelung betrifft die Farbfläche.

## Gezielt geprüfte Funktionen

- Modelltests für alle Kombinationen aus Eye–Aura-Abstand 0/10/20/30 und Ringabstand 0/2/5/8, Normalisierung, V177-Renderpfad, geschützte Snake-/Wind-/Temperaturquellen und Menülogik. Quellvergleiche berücksichtigen bei den betroffenen Modulen generierte Versions- und Importkennungen.
- Lokale Chromium-Tests mit vollständigem Frontend in Desktop- und Android-Emulation. Deterministische Vergleiche von Basis-Canvas, Zusatz-Canvas, Bloom-Puffer, Radien und Brückenzuständen mit V179 bei beiden Nullabständen. Statischer und lebender Glow wurden geprüft. Bei 30/8 px blieben Brücken und Farbtransfer aktiv und die Canvas-Grenze wurde eingehalten.
- Vorschau bei Bloom 0/25/50/75/100 %. Eye-Breite und Ringradien blieben gleich, die Leuchtfläche wurde größer. Geprüft wurden gespeicherte Abstände nach Reload, getrennte Fensterpositionen, Drag ohne Kartenbewegung, Wiederöffnen, Minimieren und Maximieren, Viewport-Wechsel, Bedienbarkeit des Temperaturreglers sowie eingebettete und mobile Positionierung.
- Opacityprüfung für alle vier Wetterebenen bei 0/30/50/70/100 %, zusätzlich für das Windfarbfeld. Geprüft wurden alte Opacitywerte, Dropdownwechsel, Standard-Reset und die Synchronisierung des älteren Niederschlagsreglers.
- `verify-frontend.mjs` prüfte Versionsidentität, Asset-Hashes und Parität zwischen Master-Frontend, Home-Assistant-Frontend und Dashboard.

## Lieferstand

GR **4.11.180 DEV** / HA **0.25.87**, Runtime `411180r1`, Modulsatz `E411-180A1`. Der Installationskanal ist `TheDaimos/gewitterradar@deploy/dev`. Eine physische Sichtabnahme von V180 auf Android, iPad und HA DEV VM109 steht aus. Die Auslieferung beinhaltet keine automatische Installation.

## Lokaler Leistungsvergleich

Windows, Chromium im Android-Viewport 393 × 851, DPR 3. Drei aufeinanderfolgende Läufe mit synthetischem Schlangenwindfeld, lebender Vierfarben-Vorschau und maximalen Neon-Zusatzeffekten. Jeweils 3,6 s mit regulärem Scheduler gemessen. Zusatz-JS bezeichnet die mittlere gemessene CPU-Zeit pro Zusatzzeichnung. Pufferbytes umfassen die Zeichenflächen des Zusatzrenderers. Sprite- und Geometriepuffer waren in allen drei Läufen 65.536 bzw. 15.360 Byte groß.

| Stand | RAF p50/p95 (ms) | Zusatz-JS (ms) | Zeichenflächen (Byte) | Brücken/Transfers am Messende | Adaptive Stufe am Messende |
|---|---:|---:|---:|---:|---:|
| V179 | 17,8 / 35,7 | 1,44 | 1.465.636 | 5 / 2 | 1 |
| V180, 0/0 px | 17,8 / 18,7 | 1,22 | 1.465.636 | 6 / 5 | 0 |
| V180, 30/8 px | 17,7 / 35,5 | 0,88 | 1.933.312 | 5 / 2 | 1 |

Die Puffergröße bei Nullabständen blieb gleich. Der Lauf bei maximalem Abstand zeichnete auf rund 32 % mehr Pufferfläche. Unterschiede in den Zeitwerten enthalten Schwankungen der Browserlast und der adaptiven Stufe. Die drei kurzen Läufe liefern keine belastbare Aussage über Geräte-FPS oder einen allgemeinen Geschwindigkeitsgewinn. In den lokalen Vorschau-Aufnahmen blieb der Halo bei 30/8 px mit vier aktiven Farben vollständig im Rahmen.

## Installationspakete

Implementierungscommit `763a54a8099e95a0cff5ef18db263bfba0be3494`.

- `gewitterradar-0.25.87-dev.zip` · SHA256 `3f216a9f1d4fbec4fef1ac1f02436485aac540b9356fb18a725972a987c27497`
- `gewitterradar-dashboard-4.11.180-dev.zip` · SHA256 `b605af80d13edcf3da551149379cc2f5c901e8c4f9ce90e9fc64dfab2a497b82`

Beide ZIPs stammen aus dem committed Git-Baum. Geprüft wurden CRC, Versionsidentität, UTF-8 und die Dateiparität zwischen HA-Frontend und Dashboard. `deployment.json` bezeichnet den Releasecommit.
