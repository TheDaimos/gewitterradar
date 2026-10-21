# Gewitterradar: Gezielte Regressionsanalyse des Niederschlagsweichzeichners (V4.11.81 → V4.11.100)

**Datum:** 21.10.2026  
**Repository/Zweig:** `TheDaimos/gewitterradar@deploy/dev`  
**Status:** **Statische und historische Differenzprüfung durchgeführt; Fehler noch nicht durch einen echten Bildtest abschließend bewiesen und noch nicht behoben.**  
**Priorität:** P1 – Wiederherstellung der bestehenden Modi Auto / Präzise / Ausgewogen / Weich. Wolken, Deckkraftumbau und Windfahnen bis dahin zurückgestellt.

## 1. Bestätigte Beobachtungen und richtige Vergleichsbasis

Der Benutzer bestätigt, dass die Niederschlagsweichzeichnung **unmittelbar nach Einführung des Raster-Labor-Diagnosemodus** korrekt funktionierte. Aktuell in **V4.11.100** zeigen **Android und Desktop** bei vergleichbaren Ansichten **Auto** und **Weich** deutlich zu kantig; **Ausgewogen** erscheint weicher als **Weich**. Der letzte exakt gute Zwischenstand nach V4.11.81 ist noch nicht ermittelt; **V4.11.99 darf nicht ohne Nachweis als gut gelten**. Der iPad-Befund wurde nicht real getestet. Daraus folgt: zuerst eine versions- und datenpfadbezogene Regression prüfen, nicht Chromium als Ursache behaupten.

Als festes Referenzcommit wurde die tatsächlich auf GitHub vorhandene V4.11.81-Änderung **`46754f6689b0b01f1a45287e21572ae04b90f3bd`** geprüft; die aktuelle `deploy/dev`-Fassung wurde ebenfalls gelesen.

## 2. Harte Prüfbefunde aus der GitHub-Dateihistorie

| Baustein | V4.11.81 | aktueller Stand | Relevanz |
| --- | --- | --- | --- |
| `frontend/modules/weather/display-menu.js` | Git-Blob `f32b467fb69bd338d87d3878add266b5bf3a5a89` | **identischer Git-Blob `f32b467fb69bd338d87d3878add266b5bf3a5a89`** | **Beweis:** Die Berechnungs- und Anwendungsfunktionen des eigentlichen Darstellungsmoduls sind seit dem überprüften V4.11.81-Commit **bytegleich**. Der Fehler muss sich daher nicht aus einer neuen Formel im Modul selbst ergeben. |
| `frontend/modules/diagnostics/raster-lab.js` | Blob `cc18dc593da297a00049498d35f7164db546c078` | Blob `f4c86125ee9d5a8fe51f62a802af459b9727a7cf` | **Geändert:** unter anderem Vorschaurücksetzung und zusätzliche Flächenverschmelzung; Wechselwirkungen mit Live-Vorschau sind möglich. |
| `frontend/modules/weather/precipitation-layer.js` | Blob `1166de0b1e0378b3b897312f52a825bf522d0e8e`, circa 63 kB | Blob `8e4ea1795a247c3282966ad656360876f1265d99`, circa 129 kB | **Stark verändert:** V1-/V2-Kachelanlieferung, Mehrquellenmosaik, Abdeckung und Layerwechsel sind vorrangige Untersuchungsfelder. |

Die Commitfolge des Darstellungsmoduls enthält zuletzt am 15.10.2026 die beiden V4.11.81-Änderungen `115fb751c6e7a28563214a9fa3706b114ad853a9` und `46754f6689b0b01f1a45287e21572ae04b90f3bd`. Spätere Abweichungen in der Anzeige trotz **identischen Modulblobs** sprechen für einen geänderten **Datenvertrag, Layerzustand oder Seiteneffekt**.

## 3. Konkreter Hauptverdacht A – native Quellenzoomstufe verändert die Modusstärke

`display-menu.js`:

- `_weatherDisplayRasterTuning` ermittelt `maxNative` über `Number(this._weatherRadarState?.().layer?.options?.maxNativeZoom)` und übergibt ihn für **Auto** und **Weich** an die Berechnungsfunktionen.
- `weatherDisplayAutoRasterTuning` berechnet `relativeZoom = zoom - nativeZoom + 2`; bei Zoom 8 und hohen `nativeZoom`-Werten wird dadurch die berechnete Glättung gegen die untere Grenze von etwa **1.05 px** gedrückt.
- `weatherDisplaySoftRasterTuning` benutzt bei Zoom 8 das **Auto-Profil für Zoom 6**. Die zusätzliche Glättung greift erst bei Zoomstufen oberhalb 8. Für hohe native Quellenzoomstufen ist deshalb gerade **Weich** bei Zoom 8 sehr klein, obwohl **Ausgewogen** unabhängig davon eine Grundglättung von **5.6 px** anwendet.
- In `precipitation-layer.js` wird die native Zoomgrenze des V1-Layers beim Anlegen aus `payload.max_zoom` übernommen (`maxNativeZoom:maxZoom`). Der aktive V2-Mosaiklayer kann andere native Zoommetadaten liefern.

**Testbare Hypothese:** Nicht die vier Modi haben sich geändert, sondern der neue Rasterpfad liefert dem unveränderten Auto-/Weich-Profil **eine andere native Zoomgrenze**. Der sichtbare Befund „Weich kantiger als Ausgewogen“ passt unmittelbar zu dieser Rechenabhängigkeit. Eine **größere zulässige URL-Zoomstufe beweist nicht die tatsächliche räumliche Bildschärfe** der meteorologischen Daten.

**Fehlernachweis erforderlich:** Bei exakt gleicher Szene, Zoom 8, gleicher Quelle/Bildzeit für V4.11.81 und V4.11.100 `layer.options.maxNativeZoom`, `_weatherDisplayRasterTuning('precipitation')`, aktiven V1-/V2-Pfad und Filter am Pane protokollieren; verschiedene `maxNativeZoom`-Werte 6/7/8/9/10/11 in reproduzierbarem Test durchspielen. Die gegenwärtige Datenlage beweist noch nicht, welcher native Zoom im Screenshot wirksam war.

## 4. Verdacht B – V1-/V2-Wechsel und Pane-Lebenszyklus

Der aktuelle `precipitation-layer.js` nutzt dasselbe Pane `gr-weather-radar`, aber einen wesentlich erweiterten **V2-Mosaikpfad**. Beim Anlegen von V1 wird `_weatherDisplayApplyRasterPaneStyle` sofort aufgerufen. Im V2-Pfad wird der fertige Tausch erst nach den Sichtbarkeits-/Ladeprüfungen durch `_weatherDisplayRefreshRenderedLayers` wieder formatiert. Ebenso aktualisiert der Zoom-Handler in `display-menu.js` nur für den Modus **Auto** automatisch die ganze Layerdarstellung.

**Testbare Hypothese:** Während der V2-Vorbereitung, nach einem Quellenwechsel, bei Beibehaltung einer regionalen Ebene oder nach Zoom-/Kartenbewegung ist der im Menü angezeigte Modus korrekt, aber der **Filter auf dem sichtbaren Rasterpane** fehlt, ist veraltet oder wurde temporär überschrieben. Das muss zeitlich direkt am DOM und am final sichtbaren Canvas/Pane ermittelt werden; die bloße Prüfung `pane.style.filter` zum Zeitpunkt des Einstellungswechsels genügt nicht.

Zu prüfen: `v1_active`, `v2_active`, laufende Staging-Phase, `_weatherDisplayRefreshRenderedLayers`-Aufruf nach tatsächlichem Quellenwechsel, `zoomend`, Anzeige der genutzten Quelle, native Zoomgrenze, CSS-`filter` und `rasterLabPreview`-Kennung.

## 5. Verdacht C – Raster-Labor-Vorschau verändert Stil vorübergehend

`raster-lab.js` wurde nach V4.11.81 nachweislich geändert:

- V4.11.81-Vorschau: CSS-Filter direkt mit `v.blur` auf dem Pane.
- Aktuell: `effectiveBlur = info.base.blur + (v.blur - info.base.blur) * clamp(v.blend ?? 100, 0, 100) / 100`; daher ändert der neue Regler **Flächenverschmelzung** die wirksame Glättung der Vorschau.
- Der aktuelle Rückfallpfad setzt zum Schutz den Vorschaumodus beim Wiederherstellen kurz aus und stellt die Pane-Deckkraft wieder her. Das ist grundsätzlich sinnvoll, benötigt aber einen Regressionstest für Öffnen/Schließen, Referenz/Versuch, Kartenwechsel und erneute V1-/V2-Layeranwendung.

**Wichtig:** Der Raster-Labor-Export identifiziert sich im aktuellen Quelltext weiterhin statisch mit `version:"4.11.82", runtimeRevision:"41182r1"` (`raster-lab.js` Zeilen 195–199). **Diese Exportfelder sind keine verlässlichen Belege für die aktuell installierte Gewitterradar-Version.** Vor einem Versionsvergleich die tatsächliche App-/Runtime-Identität gesondert erfassen. Dies ist ein **konkret nachgewiesener Diagnose-Metadatenfehler**, jedoch **kein Beweis** für die Glättungsregression.

## 6. Gezielt auszuführende reproduzierbare Prüfmatrix

| Prüfung | Was wird beobachtet? | Erwartete Entscheidung |
| --- | --- | --- |
| Gleiche Quelle, Zoom 8, `nativeZoom` 6 bis 11 | Effektive Zahlenwerte und tatsächlich sichtbare Rasterkante für alle 4 Modi | Numerische Fehlzuordnung vom nicht wirksamen DOM-Filter trennen |
| V4.11.81 gegen V4.11.100 bei gleicher synthetischer Kachel | Pixel-/Filtervergleich | Erste konkrete Änderung des Bildpfads identifizieren |
| V1 gegen V2 bei gleicher sichtbarer Datenauflösung | `maxNativeZoom`, Pane-Filter, Quellmetadaten, NoData | Zoommetadaten-/V2-Wechsel als Ursache bestätigen oder ausschließen |
| Kartenbewegung, Zoom, V2-Staging/Tausch | Filter vor und nach `v2_active` und `zoomend` | Verlorene Stilaktualisierung finden |
| Raster-Labor öffnen/Referenz/Versuch/Schließen | `pane.style.filter`, `rasterLabPreview`, Deckkraft, Werte aus dem Menü | Vorschau-Seiteneffekt finden |
| Android und Desktop, gleiche Szene | Browser-Pixelvergleich | Geräteübergreifende Abnahme statt Browserannahme |

### Priorisierung

**Priorität 1:** `maxNativeZoom`/V1-/V2-Metadaten in der bestehenden Auto-/Weich-Formel verifizieren (passt direkt zu zwei zu kantigen Modi bei gleichzeitig weichem „Ausgewogen“).  
**Priorität 2:** Filter-/Pane-Lebenszyklus bei V2-Layerwechseln nachmessen.  
**Priorität 3:** Raster-Labor-Vorschaueinfluss und Versionserfassung isoliert untersuchen.  
Ein früherer SVG-Filterversuch ist historisch dokumentiert, ist aber angesichts des plattformübergreifenden Befunds **nicht ohne zusätzlichen Bildbeweis** zur Hauptursache zu erklären.

## 7. Umsetzungssperren und nächster Arbeitsschritt

Eine gezielte Reparatur darf erst vorgenommen werden, wenn der jeweilige Fehler in einem Test (numerischer Renderingvertrag **und**, wo die Frage Pixelwirkung betrifft, visuelle Browserprüfung) reproduziert ist. **Nicht** pauschal Blur-Werte hochsetzen, nicht die vier Modi vertauschen, keine alten Regressionstests entfernen, keine weitere Rendererarchitektur erfinden. Nach gezieltem Fix: neue Tests, öffentliche CI-Gates auf dem **echten Codecommit**, kanonische Dateispiegel und Integrationsprüfsummen, erst danach gegebenenfalls kontrollierter DRA-Testkandidat.

**Kein Codefix, kein CI-PASS für einen Fix, keine HA-DEV-Installation oder HA-Realabnahme in dieser Untersuchung.**

**C.K. – Eine Idee weiter gedacht.**
