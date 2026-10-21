# Gewitterradar – Niederschlagsweichzeichner: Ursachenprüfung V4.11.100

**Datum:** 21.10.2026 · **Repository:** `TheDaimos/gewitterradar` · **Zweig:** `deploy/dev` · **untersuchter HEAD:** `d6be4d2809f9a63285c9432d191525990e82aed2`.

## Ziel und eindeutige Abgrenzung

Erst die bestehenden vier Niederschlagsmodi **Auto / Präzise / Ausgewogen / Weich** fachlich wiederherstellen und anhand echter Browserbilder verifizieren. Erst **danach** den separaten Auftrag für Wolken, gemeinsame/individuelle Deckkraft und Windfahnen weiterführen: [Entwicklungsauftrag vom 21.10.2026](ENTWICKLUNGSAUFTRAG_GR_DARSTELLUNG_RASTER_DECKKRAFT_WINDFAHNEN_2026-10-21.md).

**Status dieses Berichts:** Codeursachen eingegrenzt; **keine sichere technische Reparatur abgeschlossen**, **kein neuer Installationskandidat** und **keine HA-Realabnahme**. Kein nachweisbarer PASS aus statischer Sicht allein.

## 1. Tatsächlich untersuchter Programmcode

`frontend/modules/weather/display-menu.js`, Modulversion **0.4.18**:

- `weatherDisplayAutoRasterTuning(zoom,nativeZoom)`, Zeilen 58–73: Zoomabhängige Glättung `relativeZoom=zoom-nativeZoom+2`; bei hohem Quell-`maxNativeZoom` im Verhältnis zum aktuellen Kartenzoom kann `blur` fast bei **1.05 px** bleiben, selbst wenn die Karte bei Zoom 8 visuell grobe Quellraster zeigt. Die CSS-Filterung hängt folglich nicht nur vom Benutzerzoom, sondern von einer potenziell ungeeigneten Ersatzgröße für die reale sichtbare Pixelstruktur ab.
- `weatherDisplayBalancedRasterTuning`, Zeilen 74–78: separates CSS-Glättungsprofil mit Grundwert **5.6 px**, Kontrast **1.34**.
- `weatherDisplaySoftRasterTuning`, Zeilen 84–118: benutzt **Auto bei Zoom 6** als Referenz; bei Zoom 8 ist `extraZoom=0` und `previousBlur=Math.min(Math.max(48,base.blur),base.blur)`, also **genau `base.blur`**, nicht mindestens 48 px. Wenn die Quelle eine hohe native Zoomstufe ausweist, kann „Weich“ deshalb ebenfalls nur ungefähr 1 px glätten. Die Formulierung des 48-px-Budgets darf nicht als wirksame Mindestglättung missverstanden werden.
- `_weatherDisplayApplyRasterPaneStyle`, Zeilen 364–402: „Weich“ probiert auf Chromium zusätzlich den **SVG-Mehrskalenfilter**; die Prüfung `pane.style.filter.includes("url(")` bestätigt lediglich die akzeptierte CSS-Zeichenfolge, **nicht** dessen tatsächliche Pixelwirkung. Die Diagnose `weatherDisplaySoftFilter=multiscale` ist daher kein Bildnachweis.
- `_weatherDisplayRasterTuning`, Zeilen 286–305: die tatsächlich übergebene native Zoomstufe wird aus `this._weatherRadarState().layer.options.maxNativeZoom` gelesen. Dieses Feld wird in `frontend/modules/weather/precipitation-layer.js` Zeilen 733–755 durch `payload.max_zoom` bestimmt und als `maxNativeZoom` eingetragen. Eine gültige Provider-Zoomobergrenze ist aber nicht notwendigerweise ein verlässlicher Schätzwert für die **meteorologische Bildauflösung** der angezeigten Kachel.

**Damit sind zwei separate technisch plausible Mechanismen für den Nutzerbefund nachgewiesen:** (A) sehr kleine tatsächlich berechnete Auto-/Weich-Weichzeichnung bei bestimmten `max_zoom`-Werten und (B) fehlender browserbasierter visueller Erfolg eines formal zugelassenen SVG-Filters. Welche Kombination die vier echten Screenshots verursacht, muss mit den **tatsächlichen WR-Kachelmetadaten und einem Bildtest derselben Szene** korreliert werden.

## 2. Historische Sicherheits- und Abnahmeverträge

Vor einer Programmänderung wurden die vorhandenen Regressionstests gelesen:

- `scripts/test-v41175-soft-raster.mjs` hält insbesondere historische Zoom-8-/Zoom-10-Budgets und die Quellzoom-Grenzen fest.
- `scripts/test-v41177-restore-soft-raster.mjs` dokumentiert ausdrücklich, dass ein SVG-Filter auf dem iPad trotz unterstützter CSS-Syntax **sichtbar ungeglättet** war; deshalb wurde damals das CSS-Profil wiederhergestellt.
- `scripts/test-v41178-platform-soft-raster.mjs` führte danach **nur** für Chromium erneut eine Mehrskalen-SVG-Verarbeitung ein und weist gleichzeitig darauf hin, dass Safari/iOS den CSS-Rückfallweg benötigt.
- Alle diese historischen Eigenschaften müssen bei der Abhilfe überprüft statt pauschal aus den Tests gelöscht werden.

Ein neuer bloßer `blur(48px)`-Minimalwert oder eine pauschale Umstellung auf `blur(220px)` wäre **keine belegte Wiederherstellung**: Solche Eingriffe könnten Messkerne zerstören, den Zoom-Vertrag brechen und vorhandene Leistungsgrenzen verändern. Zuerst die alte abgenommene Bilddarstellung gegen die neue Bilderzeugung vergleichen.

## 3. Nächster verbindlicher Reparaturschritt

1. **Reproduzierbaren Regressionstest** für identische synthetische Quellkacheln bei Zoom 8 und unterschiedlichen gültigen `max_zoom`-Metadaten ergänzen; nachweisen, wann `Auto` und `Weich` faktisch geringere optische Glättung als `Ausgewogen` erhalten. Die berechneten Werte und den tatsächlich im Browser wirksamen Filter zusammen dokumentieren.
2. **Historisch akzeptiertes Verhalten** (insbesondere V4.11.75, V4.11.77 und V4.11.78) anhand des vorhandenen Quellcodes und möglichst eines echten Chromium-/Firefox-/Safari-Bildvergleichs nachvollziehen. Nicht die bloße CSS-Filterzeichenfolge als Pixelbeweis werten.
3. Den tatsächlichen Fehler **mit minimalem Eingriff** beheben: verlässlich wirksamer CSS-Rückfall für nicht rendernde SVG-Filter, semantisch belastbare Zoom-/Quellauflösungsbehandlung; das Profil **Präzise** unverändert lassen und den akzeptierten Farbraum/Alpha bewahren.
4. Bestehende geschützte Regressionen und erforderliche neue Browser-/Zoomtests ausführen; echte CI-Push-Läufe und Job-IDs am finalen Code-/Paketcommit prüfen. Spiegelauslieferung und Prüfsummen konsistent halten. Ein altes grünes Gate ersetzt kein neues nach Codeänderung.
5. **Keine DRA-/HA-DEV-Installation ohne ausdrückliche Benutzerfreigabe.** Für echten HA-REAL-PASS reale Kacheln, gleiche Bildzeit und reale Browseraufnahmen korrelieren.

## 4. Freigabezustände

| Gate | Zustand |
| --- | --- |
| Bestands-/Ursachenprüfung | **Teilweise abgeschlossen, konkrete verdächtige Rechen- und Filterpfade lokalisiert** |
| Produktivcode repariert | **NEIN** |
| CODE-PASS des Fixes | **NEIN** |
| CI-PASS des Fixes | **NEIN** |
| DRA-Freigabe des Fixes | **NEIN** |
| Installation / HA-REAL-PASS / PROD | **NEIN** |

**C.K. – Eine Idee weiter gedacht.**
