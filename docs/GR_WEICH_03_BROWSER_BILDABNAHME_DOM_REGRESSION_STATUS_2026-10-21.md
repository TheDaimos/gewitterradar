# GR-WEICH-03 – Historischer Browservergleich, Laufzeitfilter und Raster-Labor

**Datum:** 21.10.2026  
**Repository/Zweig:** `TheDaimos/gewitterradar@deploy/dev`  
**Eingangs-HEAD:** `0ddc9f292e026f5b584b9e6cdd8eeaa49cbe450c`  
**Ausgangsversion:** V4.11.100 DEV  
**Status:** **Ergänzende technische Regression durchgeführt, historischer Browser-Bildvergleich NICHT abgenommen. Keine Installation, kein VISUAL-/HA-REAL-PASS.**

## 1. Eingang und tatsächlicher historischer Quellnachweis

Zuerst wurde der vollständige Entwicklungsbericht `docs/GR_WEICH_02_ZOOMVERTRAG_REPARATUR_CI_UND_OFFENE_BROWSERREFERENZ_2026-10-21.md` gelesen. Die verknüpften GR-WEICH-01-Berichte und die Differenzanalyse liefern den historischen V4.11.81-Referenzcommit `46754f6689b0b01f1a45287e21572ae04b90f3bd`. Ein direkter erneuter GitHub-Abruf des dortigen `frontend/modules/weather/display-menu.js` ergab Blob `f32b467fb69bd338d87d3878add266b5bf3a5a89` (140452 Zeichen). Der zuletzt vor GR-WEICH-03 veröffentlichte heutige Quelltext enthält `__grRadarVisualNativeZoom`, der historische nicht. Es handelt sich damit **nachweislich um echte, verschiedene Git-Quellstände**, jedoch nicht um zwei in einem Browser gerenderte komplette Anwendungen.

V4.11.82 wird weiterhin nur als fachlich vom Nutzer beobachtete Referenz bewertet. Die früher im Raster-Labor fest codierte Versionsangabe war kein Beleg für den real laufenden Build. Die GR-WEICH-01- und GR-WEICH-02-Korrekturen wurden beibehalten.

## 2. Bereits geschützter Zoomvertrag

Der GR-WEICH-02-Fix trennt die Leaflet-Kachel-URL-Zoomobergrenze von einer behaupteten physikalischen Niederschlagsbildauflösung: V2 benutzt `maxNativeZoom:18`, während die zugrunde liegenden Provider-Kacheln aus niedrigeren Quellzoomstufen stammen können. Die Darstellungsfunktionen nutzen ohne gesicherte visuelle Messung weiterhin die historische Referenzstufe 7. Der Rechenwert bei Kartenzoom 8 entspricht dann **Auto 92 px, Ausgewogen etwa 7,92 px, Weich etwa 18,44 px, Präzise 0 px**. Die vier Profilberechnungsfunktionen wurden durch GR-WEICH-03 nicht verändert; höhere Unschärferadien wurden nicht pauschal eingeführt.

**Wichtig:** Diese Werte sind Profilberechnungen, keine empirischen Browserpixel, und eine über Quellen hinweg einheitliche visuelle Referenz ist kein Beleg für physikalisch identische Datenauflösung.

## 3. Neuer ausführbarer DOM-/Laufzeitvertrag

**Neue Datei:** `scripts/test-gr-weich-03-dom-lifecycle.mjs`. Sie lädt die **tatsächlichen Frontendmodule** über deren `installWeatherDisplayMenu`-/`installRasterLab`-Registrierung in einen deterministischen Node-Laufzeithalter. Verwendet werden ein nachgeahmter Leaflet-Kartenzustand, ein veränderlicher sichtbarer Pane, Zoom-Ereignisempfänger, V1-/V2-artige URL-Zoomobergrenzen sowie die reale Raster-Labor-Filter- und Exportlogik.

Der Test prüft die vier Modi im Pane, die erneute Filteranwendung bei `zoomend`, die Trennung von angezeigter Zoomreferenz und URL-Obergrenze beim Wechsel von V2 auf V1, die Labor-Änderung von Blur und Deckkraft, Vorschau-Rücknahme, Wiederherstellung des ursprünglichen Filters und die aus dem zentralen `APPLICATION_RELEASE` übernommene Versions-/Laufzeitkennung. Er verwendet **keine Nutzerorte, echten Providerantworten oder privaten Diagnosen**.

Die Prüfung wurde als Schritt `Check GR-WEICH-03 DOM lifecycle regression` in den bestehenden Push-Workflow `.github/workflows/validate.yml` integriert; die vorherigen GR-WEICH-01/02-Tests bleiben bestehen. Der Test simuliert Kartenereignisse, **kein tatsächlicher Browser-CSS-Layout-/SVG-Renderprozess**. Auch V1-/V2-Staging unter Zeitüberschreitung, Regionwechsel und reale Kachellast sind nicht durch diese isolierte Prüfung abgenommen.

## 4. Echte technische Korrekturen und Zwischenfehler

| Commit | Inhalt |
| --- | --- |
| `58354c6fe535d164df9680dd29ecbb69d9128fd6` | Laufzeit-/DOM-Lebenszyklustest für alle vier Modi sowie Raster-Labor hinzugefügt |
| `8adf749fad177daa9f7dc42f3ab89b26fa16d6c5` | Test dem realen GitHub-Actions-Push-Gate zugeordnet |
| `e1ee463bf18899e2877d4c5a3fc76a5157f9640e` | Deterministische Fensterdaten im Node-Test ergänzt |
| `c74faa88ea8ceaec19d2fed51e950a4c9f208e3a` | Node-22-Navigator als schreibgeschützte Laufzeiteigenschaft korrekt per `Object.defineProperty` vorgegeben |

Zwei tatsächliche Zwischenläufe wurden untersucht: Die erste Testausführung scheiterte mit `ReferenceError: window is not defined`. Nach Korrektur scheiterte eine zweite mit `TypeError: Cannot set property navigator ... which has only a getter`. Beides betraf ausschließlich den neuen isolierten Testhaken, nicht eine reale Wetteranzeige. Die dritte Fassung korrigiert beide Voraussetzungen; ihr CI-Ergebnis steht unter Abschnitt 5.

**Produktivmodule unverändert in GR-WEICH-03:** Kein neuer Renderer, keine erneute Implementierung des visuellen Zoomvertrags, keine Quell-/API-Änderung. Entsprechend sind die drei Frontend-Auslieferungsspiegel und `SHA256SUMS_FRONTEND.txt` gegenüber GR-WEICH-02 unverändert.

## 5. Echte GitHub-Actions-Prüfungen

Finaler Test-/Workflow-Codecommit: `c74faa88ea8ceaec19d2fed51e950a4c9f208e3a`.

- [GitHub Actions – Einstellungen und Laufzeitidentität, 39578834100](https://github.com/TheDaimos/gewitterradar/actions/runs/39578834100)
- [GitHub Actions – Gewitterradar-Integration, 39578834014](https://github.com/TheDaimos/gewitterradar/actions/runs/39578834014)
- [GitHub Actions – Gemeinsames Frontend, 39578833992](https://github.com/TheDaimos/gewitterradar/actions/runs/39578833992)

Die finale Statusnotiz wird anhand tatsächlicher GitHub-Laufdaten am Ende ergänzt. **Ein erfolgreiches Browser-Schutzgate des Projekts zählt nicht als historischer Niederschlags-Pixelvergleich**, solange historische und aktuelle synthetische Kacheln in diesem Gate nicht wirklich gerendert und verglichen werden.

## 6. Tatsächliche Browser-/Bildbefunde und technische Grenze

Es wurde versucht, lokal Chromium Headless mit einer synthetischen RGBA-Kachel und CSS-`blur(18.44px)` auszuführen. **Dieser Prozess wurde nicht erfolgreich abgeschlossen; keine Browser-Bilddatei und keine verwertbare Pixelmessung wurden erzeugt**. Deshalb existiert aus diesem Versuch weder ein visueller PASS noch ein Pixelvergleich der historischen und aktuellen Frontendstände. Historischer und aktueller vollständiger Browserbuild wurden nicht nebeneinander gestartet. Insbesondere gibt es keinen authentisch gemessenen SVG-vs.-CSS-Filtervergleich an echten Browserpixeln. Kein entsprechender Erfolg wird aus DOM-/Quelltests abgeleitet.

Damit bleibt der Kern der Nutzerforderung — **tatsächliche, historische visuelle Gleichwertigkeit aller vier Modi** — noch offen. Auch die Ursache eines möglichen SVG-Mehrskalen-Fehlers auf einem bestimmten Android- oder Desktopbrowser wurde nicht visuell nachgewiesen; hier wird nichts auf Verdacht geändert.

## 7. Nächste zwingende technische Nachweise

1. Historische V4.11.81- und tatsächlich identifizierte V4.11.82-Auslieferung aus Git isoliert ausführbar machen und mit dem aktuellen Branch-Build **identische synthetische Kacheln**, identische Zoom-/Skalierungs-/Browservoraussetzungen und dieselbe Filterfamilie zeichnen.
2. Über echte gerenderte Pixel die Randgradienten, Flächenverläufe, Alpha/NoData und optisch wirksamen SVG-/CSS-Filter getrennt je Modus messen. Keine Freigabe allein auf Basis CSS-Eigenschaftswerten.
3. In einem vollwertigen Browser automatisierte V1/V2- und Mosaik-Wechsel einschließlich Abbrüchen, Verzögerungen, Bewegung, Quellen-/Regionwechsel und tatsächlich sichtbarem Filter verifizieren.
4. Raster-Labor Referenz/Versuch/Flächenverschmelzung, Schließen und erneuten Quellenwechsel im realen DOM/Bild verifizieren, ohne gespeicherte Optionen zu beschädigen.
5. Bei **nachgewiesenen** verbleibenden Darstellungsfehlern nur den kleinsten ursächlichen Fix ausführen, alle drei Spiegel und Prüfsummen konsistent aktualisieren, sämtliche Push-Gates am neuen Programmcommit prüfen.
6. Home Assistant DEV/PROD und DRA bleiben ohne ausdrückliche Zustimmung vollständig unangetastet.

## 8. Freigabestatus

| Prüffeld | Status |
| --- | --- |
| Historische Git-Quellenreferenz | **Bestätigt** (echter historischer Blob) |
| GR-WEICH-01/02-Codezustand | **Unverändert erhalten** |
| Isolierter GR-WEICH-03-DOM-/Node-Test | **In CI eingebunden, Ergebnis siehe Schlussnotiz** |
| Historischer vollständiger Browser-Bildvergleich | **NICHT ausgeführt** |
| SVG-/CSS-Pixelgleichwertigkeit | **NICHT nachgewiesen** |
| Vollständiger GR-WEICH-03-VISUAL-PASS | **NEIN** |
| DRA-DEV-READY / HA-REAL-PASS / PROD | **NEIN** |

Wolken, Deckkraftumbau, Windfahnen, WeatherRouter, UTC, V1-/V2-Fachverträge, DWD, NASA und Sicherheitsregeln bleiben unverändert.

**C.K. – Eine Idee weiter gedacht.**

## 9. Verifizierter CI-Zwischenstand am finalen Testcommit

GitHub Actions `39578834100` (Einstellungen/Laufzeitversion) **completed/success**, `39578834014` (Integration) **completed/success** einschließlich des tatsächlichen neuen GR-WEICH-03-DOM-Tests im erfolgreichen Job `package-contract`. Gemeinsames Frontend `39578833992` war bei der letzten Abfrage noch **in_progress**, daher zu diesem Zeitpunkt **kein Gesamt-CI-PASS**. Auch ein späterer Erfolg wäre nicht gleichbedeutend mit der fehlenden historischen Pixelabnahme.
