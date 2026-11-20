# Gewitterradar V4.11 – Ausführliche Chatübergabe: Niederschlagsdarstellung Weich / Auto

**Stand:** 14.10.2026. **Projekt:** Gewitterradar V4.11. **Entwickler:** C.K.
**Art:** Technische Chatübergabe, nur Dokumentation – keine neue Anwendungsfassung.
**Leitproblem:** Rasterkanten im Wetter-Layer bei hohen Zoomstufen beseitigen, ohne „Weich“ so wolkig wie „Auto“ zu machen.

## 1. Verbindlicher GitHub-Ausgangspunkt

- Repository (öffentlich): `TheDaimos/gewitterradar`.
- Entwicklungszweig: `feature/v4.11.74-soft-zoom-smoothing`.
- DRA-Auslieferungszweig: `deploy/dev`.
- Verifizierter Stand BEIDER Zweige **vor Erstellung dieser nur dokumentierenden Übergabe**:
  `2a3e4136e983b4ab701616e0508784b14bb40bcf`.
- Vergleich: `deploy/dev` und Entwicklungszweig sind an diesem Stand **identisch**.
- **Produkt:** V4.11.74 DEV.
- **Build:** `V4.11.74-DEV-2026-10-14`.
- **Laufzeit:** `41174r1`.
- **Modulsatz:** `E411-74A1`.
- **33 Module**, darunter `weather.display-menu` Version `0.4.11`.
- Native Integration: `0.25.1`.
- **V4.11.68** ist die besonders wichtige Leistungsreferenz nach Behebung schwerer iPad-/Desktop-Leistungsprobleme. Nicht regressieren.
- Referenzdokument: `docs/RELEASE_NOTES_V4_11_74_DEV.md`.
- Weitere relevante Vorgänger: `docs/RELEASE_NOTES_V4_11_73_DEV.md` und `docs/RELEASE_NOTES_V4_11_72_DEV.md`.
- Nach der Dokumentationsänderung kann nur der Entwicklungszweig um einen Docs-Commit voraus sein; **funktionaler V4.11.74-Stand bleibt gleich**.

## 2. Explizite Nutzerabsicht (höchste Priorität)

> „Im Modus Auto haben wir bzw. Du das bereits umgesetzt. Dort ist es nur zu stark für den Modus weich.“

Die Benutzeranforderung ist damit NICHT „noch mehr unspezifischen Weichzeichner“:
- **Präzise:** Rohes Quellraster, Rasterzellen sichtbar; muss erhalten bleiben.
- **Ausgewogen:** strukturerhaltender Modus; verwendet seit V4.11.73 die Werte des früheren „Weich“-Profils.
- **Weich:** soll Rasterkanten und gerade Begrenzungen zuverlässig beseitigen, erkennbar sanft, aber **nicht so wolkig/flächig wie Auto**. Die Formen der einzelnen Niederschlagsgebiete sollen erkennbar bleiben.
- **Auto:** zeigt bereits die technisch gelungene weitgehende Entpixelung im Nahzoom, ist aus Nutzersicht für Weich jedoch zu stark. Zoomabhängig und unverändert halten, soweit möglich.
- Bei Änderungen niedrige Latenz und stabiler Speicherverbrauch auf iPad, Desktop und Android; keine zusätzliche permanente Render-Schleife und keine unnötigen doppelten Zoomhandler.

**Abnahme** soll bei identischem Kartenausschnitt, demselben Radarbild und vergleichbarer Transparenz erfolgen – insbesondere Zoom 8, 9, 10, mit „Weich“ gegenüber Auto, Ausgewogen, Präzise. Screenshot-Aufnahmen zeitlich wechselnder Radarframes sind nur bedingt direkt vergleichbar.

## 3. Nutzerbeobachtungen und Bildvergleich (14.10.2026)

Es wurden zahlreiche Bilder aus dem Testgebiet in der Karibik geteilt. **Die originalen Gerätefotos bleiben ausschließlich im Chat und werden nicht in das öffentliche Repository übernommen.**

1. Zunächst V4.11.73: Zoom 8 „Weich“ weitgehend akzeptabel; Zoom 9 erste Raster-/Kantenstruktur; Zoom 10 stark sichtbare gerade Kanten.
2. Das Problem wurde auf **iPad und Desktop** reproduziert. Es ist also nicht allein Safari/WebKit zuzuordnen.
3. V4.11.74: spürbare Verbesserung bei Zoom 10; die farbigen Übergänge sind fließender, **kantige und rechteckige Bereiche aber teilweise weiter sichtbar**.
4. Der Nutzer hat bei früheren Aufnahmen Niederschlag **absichtlich ein- und ausgeschaltet**, damit Basiskartenlinien und Seezeichen von Niederschlagsstrukturen unterschieden werden können. **Keine spontane Layer-Ausblendung behaupten**.
5. Der neueste Vierfachvergleich bei Zoom 10 zeigt visuell:
   - Niederschlag ausgeschaltet: Hintergrundkarte und separate Blitzsymbole ohne Wetterraster.
   - „Weich“: deutlich sanfter als Rohdaten, aber erkennbare geometrische Grenzen.
   - „Ausgewogen“: große Rasterfelder bleiben trotz abgemilderter Kanten gut erkennbar.
   - „Präzise“: bewusst harte, große rechteckige Pixelzellen.
   - „Auto“ auf anderen unmittelbar vorher gezeigten Aufnahmen glättet die Rasterzellen deutlich stärker, aber wirkt zu wolkig.
6. Geringe Unterschiede durch Fotografie eines Bildschirms (Moiré, Displaymatrix, Reflexion) sind möglich; die groben rechteckigen Radarstrukturen sind jedoch deutlich und zwischen Darstellungsarten konsistent.

**Stand der Nutzerabnahme:** Die Verbesserung V4.11.74 wird anerkannt; die eigentliche Forderung „sichtbare Pixel-/Geradkanten im Weich-Modus beseitigen“ ist **NICHT abgenommen**.

## 4. Tatsächlich geprüfter Implementierungsstand

**Dateien (kanonischer Frontend-Quelltext):**
- `frontend/modules/weather/display-menu.js` – Modusberechnung und Filteranwendung.
- `frontend/modules/weather/precipitation-layer.js` – Leaflet-Raster, Tile-Erzeugung, Zoomaktualisierung.
- `frontend/module-manifest.js` – Module und Sollversionen.
- `frontend/version.js`, `frontend/assets/gewitterradar-runtime-manifest.json` – Versionsidentität.
- `scripts/test-v411-weather-router.mjs` – Tests der Wetterdarstellungsberechnung.
- Gespiegelte Frontends: `dashboard/dist/` und `custom_components/gewitterradar/frontend/`.

**Filterberechnung in `display-menu.js`:**
- `weatherDisplayAutoRasterTuning(zoom,nativeZoom)`: Auto verwendet relative Zoomstufe, Overzoomfaktor, weiche Interpolation und einen deutlich ansteigenden `cloudBlur` (bis 220 px).
- `weatherDisplayBalancedRasterTuning(zoom,maxNative)`: aus altem Weich-Modus, `blur: clamp(5.6 * sqrt(overscale),5.6,11.5)`, Farbabstimmung: Sättigung 1.18, Kontrast 1.34, Helligkeit 0.99.
- `weatherDisplaySoftRasterTuning(zoom,nativeZoom)` in V4.11.74:
  ```js
  const base=weatherDisplayAutoRasterTuning(6,nativeZoom);
  const extraZoom=clamp(Number(zoom)-8,0,5);
  const additionalBlur=extraZoom*Math.max(4,Math.min(12,base.blur*.30));
  const blur=Math.min(Math.max(48,base.blur),base.blur+additionalBlur);
  return {...base,blur};
  ```
- Weich ist bis Zoom 8 auf Auto-Referenz Zoom 6; ab Zoom 9 moderater zusätzlicher Blur, mit Begrenzung zum Ressourcenschutz. Je nach ursprünglichem `base.blur` kann der Mehrwert ab einem Punkt gedeckelt sein.
- `_weatherDisplayRasterTuning` wählt zwischen `precise`, `balanced`, `soft`, `auto`.
- `_weatherDisplayApplyRasterPaneStyle`: **Filter auf dem gemeinsamen Leaflet-Pane**, mit `blur(...px) saturate(...) contrast(...) brightness(...)` sowie `willChange:filter`.
- `_weatherDisplayApplyRasterStyle`: für einzelne `img` explizit `imageRendering="auto"`, `-ms-interpolation-mode:bicubic`, `img.style.filter="none"`.
- `precipitation-layer.js` erstellt `L.gridLayer` mit `tileSize` und `maxNativeZoom:maxZoom` der gelieferten Quelle. Bildkacheln stammen aus WeatherRouter-raster_tile.
- Es gibt bereits einen Zoom-Ende-Handler im Radaradapter: `state.onZoom=()=>{this._weatherDisplayRefreshRenderedLayers?.();state.onMove?.();};`. Eine zunächst angedachte zweite Aktualisierung für Weich im Darstellungsmodul wurde bewusst wieder entfernt (keine Dopplung).
- Details zur Quellauflösung/`maxNativeZoom` und echten Rasterzellen im aktuellen Test müssen aus Laufzeit oder synthetischer Probe ermittelt werden – **nicht aus den Fotos allein behaupten**.

## 5. Technische Fragestellung für die Fortsetzung

Es ist **noch nicht nachgewiesen**, ob die hart wirkenden Grenzen aus
1. der nativen Auflösung / dem bereits quantisierten Quellraster,
2. Übervergrößerung ab `maxNativeZoom`,
3. Kachelgrenzen / transparenten Tile-Rändern bzw. Komposition,
4. CSS-Filterreihenfolge (Blur und nachfolgend Kontrast/Sättigung),
5. der begrenzten Weich-Zoomkurve
oder einer Kombination kommen.

**Vernünftige Vorgehensweise (ein Schritt und eine Abnahme nach dem anderen):**
1. Mit dem nächsten Chat die zwei relevanten Module und die Testergebnisse anhand des verifizierten Git-Stands vollständig untersuchen.
2. Bewusst zwischen **Radar-Quellpixeln** und Basiskarten-/Seegrenzen unterscheiden. Für Tests gern dieselbe Niederschlagsansicht mit und ohne Overlay wie bisher.
3. Mit **synthetischen** Pixelrastern/Quellkacheln unterschiedlicher Auflösung kontrollieren, wo rechteckige Grenzen trotz Pane-Filter bestehen. Dabei keine privaten Standorte verwenden.
4. Evaluieren, ob eine *kontrollierte* Änderung von Weichs Blur-Kurve und/oder Kontrast/Filter-Komposition das gewünschte Mittelmaß erreicht; zunächst **kein** großflächiger Canvas-Neuaufbau, keine hochfrequente Renderpipeline und keine unbeschränkten Blurwerte.
5. Falls ein technischer Rasteradapter-Ansatz erforderlich erscheint, zuerst Aufwand, Speicher-/CPU-Kosten, iPad-Grenzen und Rückfallmöglichkeit einschätzen.
6. Erst nach plausibler Ursache eine gezielte Folgerevision (voraussichtlich V4.11.75 DEV) mit korrekter Versionierung, **allen drei Frontend-Kopien**, Prüfsummen, Build-/Native-Metadaten, CI und DRA. Nicht stillschweigend auf `main` oder eine stabile Fassung ausrollen.
7. Nutzer führt den Gerätevergleich durch; erst danach als abgenommen markieren.

## 6. Schutz- und Arbeitsregeln

- Kein Rückfall der in V4.11.68 erreichten iPad-Stabilität, der Menüleistung oder der Kamerafahrten.
- Keine Änderungen am Blitzortung- oder WeatherRouter-Backend ohne eigenständigen Auftrag.
- Keine echte Telemetrie / User-Export / HA-IP / Person / privater Standort oder Screenshot in diesem öffentlichen Repo. Verwende ausschließlich generische Testkoordinaten, neutrale Entitätsnamen und künstliche Daten.
- Bei Debugging/Export mit privaten Werten: dafür das vorhandene **private** Protokollarchiv statt eines öffentlichen Commits nutzen.
- Funktionale Änderungen nur über Entwicklungszweig, nach Prüfungen nach `deploy/dev`; DRA ist die etablierte Bereitstellung.
- Keine langen Serien irrelevanter Einzelupdates; Tests möglichst bündeln.
- Nutzer arbeitet allein; klare, schrittweise Anleitungen, möglichst ohne Denglisch.
- Der ältere Anzeigefehler einer roten Blitzortung-Statusleuchte ist ein **separater** Themenkomplex; Datenquellendiagnose seit V4.11.69, JSON-Downloads in V4.11.70 real abgenommen, moderne dynamische Datenquellenhöhe in V4.11.71, Abstand in V4.11.72. Nicht mit Wetter-Glättungsfehler vermischen.

## 7. Übergabeprompt für einen neuen Chat

```text
Bootstrap: Daimos

Projekt: Gewitterradar V4.11

Repository: TheDaimos/gewitterradar
Entwicklungszweig: feature/v4.11.74-soft-zoom-smoothing
DRA-Auslieferungszweig: deploy/dev

Wir setzen die Entwicklung bei V4.11.74 DEV fort.

Lies ZUERST vollständig:
docs/HANDOFF_GR_V4_11_74_WEICH_RASTER_2026-10-14.md

Prüfe danach den aktuellen Stand beider Zweige und die Implementierung in:
frontend/modules/weather/display-menu.js
frontend/modules/weather/precipitation-layer.js
scripts/test-v411-weather-router.mjs

Verbindliches Ziel: Der Modus „Weich“ soll die bei Zoom 9/10 weiterhin sichtbaren rechteckigen Niederschlags-Rasterkanten beseitigen, aber deutlich weniger wolkig als „Auto“ bleiben. Auto zeigt bereits, dass eine starke Entpixelung möglich ist; bitte seine Berechnung als technische Referenz analysieren, nicht einfach kopieren.

Die Gerätefotos dieses Gesprächs zeigen das Verhalten auf Desktop und iPad. Sie und alle privaten Standorte, Personen und HA-Diagnosedaten dürfen NICHT ins öffentliche Repository gelangen. Zur Gegenprobe existieren bewusst Aufnahmen mit ausgeschalteter Niederschlagsebene, damit Basiskartenlinien und Seezeichen nicht als Rasterfehler eingestuft werden.

Schütze die Leistungsreferenz V4.11.68, DRA, die Karten-/Trackerfunktion, Präzise, Ausgewogen sowie die bestehende Auto-Logik. Keine große Neugestaltung auf Verdacht; zuerst Ursachenanalyse und technisch begründeter Vorschlag. Danach gezielte Umsetzung mit korrekter Versionierung, Spiegelung, Prüfsummen, CI und gebündelter Geräteabnahme.

Arbeite ab dem letzten tatsächlich verifizierten Commit. Berichte zunächst kurz den ermittelten Stand und deinen Lösungsansatz.
```

**Übergabestatus:** Dokumentation erstellt. Das Wetterproblem selbst ist weiter offen; keine neue Funktion freigegeben.
