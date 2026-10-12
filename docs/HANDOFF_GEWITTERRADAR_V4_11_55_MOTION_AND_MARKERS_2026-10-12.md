# Gewitterradar – verbindliche Chatübergabe V4.11.55 DEV
**Erstellt:** 2026-10-12  
**Projekt:** Gewitterradar – TheDaimos  
**Repository:** `TheDaimos/gewitterradar`  
**Entwicklung:** `feature/v4.11-development`  
**Bereitstellung:** `deploy/dev`  
**Übergabethema:** Horizontale Einstellungsanimation, Versions-/Signaturposition, stabile nummerierte Cluster und rote Einzelblitze, Android-Realabnahme.

## 1. Geprüfter Git-Status VOR Ablage dieser Übergabe
- Der tatsächliche Softwarestand auf beiden Zweigen war identisch: **`d6980c240c915b9ee6066fc08c5c5eaf9c732fc0`**.
- **`V4.11.55 DEV`**, Build `V4.11.55-DEV-2026-10-11`, Runtime `41155r1`, Modulsatz `E411-55A1`, Home-Assistant-Integration `0.25.0`.
- 31 Module. `ui.controls` 1.1.15, `ui.skeleton` 1.1.22, `core.manifest` 1.2.116, `map.clusters-recent` 1.0.6.
- V4.11.55 vereinigt die beiden **getrennten** V4.11.54-Änderungsstränge (Menüanimation / persistente rote Einzelblitze) ausdrücklich ohne Überschreiben.
- Bei diesem Commit waren alle vier relevanten `deploy/dev`-GitHub-Actions erfolgreich:
  1. [Frontend](https://github.com/TheDaimos/gewitterradar/actions/runs/38170444551)
  2. [Integration](https://github.com/TheDaimos/gewitterradar/actions/runs/38170444532)
  3. [Modul-/Android-Kartenvertrag](https://github.com/TheDaimos/gewitterradar/actions/runs/38170444553)
  4. [Einstellungen / Versionsidentität](https://github.com/TheDaimos/gewitterradar/actions/runs/38170444544)
- **Wichtig:** Der Commit dieser Übergabedokumente darf `feature/v4.11-development` anschließend als reine Dokumentationsänderung vor `deploy/dev` setzen. Das ist **keine neue Softwareversion** und **kein Grund für eine DRA-Aktualisierung**. Die hier angegebene Software-Referenz `d6980c…` bleibt gültig.

## 2. Nutzerbeobachtungen – chronologische und fachliche Einordnung

### 2.1 Gewitter-Cluster / markierte Einzelblitze
- Auf Android fiel ein sehr schnelles, synchrones Flackern sämtlicher nummerierter Clusterblasen bei starker Blitzaktivität auf.
- Zwei Videos: `72138.mp4` (Wetteranimationen aktiv) und `72139.mp4` (Wetteranimationen deaktiviert, gleicher Kartenausschnitt). Das Flackern blieb ohne Wetteranimationen bestehen.
- Ursächlich waren zuvor bei normalen Home-Assistant-Neuzeichnungen gelöschte und neu erzeugte Leaflet-Marker.
- V4.11.53 stabilisierte nummerierte Cluster durch identitätsbasierte Markerwiederverwendung.
- Nachfolgender Android-Test meldete: **„Die Cluster funktionieren scheinbar wieder“** – positives Indiz, **keine formelle endgültige Abnahme**.
- Separat blieben dicht stehende **rote Einzelblitzsymbole** im Gefahrenradius von ca. 30 km bei Pellaro/Italien, Zoom 7, instabil (`72143.mp4`). V4.11.54 stabilisierte die *separate* Einzelblitz-Marker-Ebene durch beständige `strike.id`. Beide Fixes sind in V4.11.55 enthalten.
- Kartensteuerung inklusive Android-Touch/Gesten darf nicht regressieren. Weder WeatherRouter-/Niederschlagslagen noch Kartenradien ohne konkreten Anlass umbauen.

### 2.2 Horizontaler Einstellungsdialog – Videos Mittel / Langsam
- Nutzer lieferte `72491.mp4` für `Mittel` und `72503.mp4` für `Langsam`; Videos wurden verglichen. Bei `Mittel` geringeres Ruckeln, bei `Langsam` deutlich sichtbar: zeitweise horizontal abgeschnittener Inhalt, große Leerflächen, zeitversetzte Höhe und Endkorrektur.
- Davor lieferte der Nutzer **vier aufeinanderfolgende Screenshots**. Die letzten beiden Aufnahmen waren versehentlich vertauscht; **korrekte chronologische Folge: Bild 1 → Bild 2 → Bild 4 → Bild 3** (gemessen an der Reihenfolge der Einreichung). Beim tatsächlichen Endzustand ist die Signatur wieder sichtbar und der Inhalt passend zentriert.
- Der Effekt darf **nicht** durch willkürliches Beschleunigen von `Langsam` kaschiert werden. Erwartet wird gleiches Bewegungsverhalten bei `Schnell`, `Mittel`, `Langsam`, nur mit verschiedener Dauer.
- Weitere festgestellte UI-Themen: Die spätere `8. Module & Versionen`-Rubrik fehlte früher in der horizontalen Navigation; inzwischen dynamische Neuerfassung beim Öffnen. Monatsangabe `2026/09` war fälschlich fixiert und ist inzwischen aus dem Builddatum abgeleitet (`2026/10`). Versionsangabe und Originalsignatur müssen in beiden Menüformen gleichmäßig am unteren äußeren Dialograhmen ausgerichtet sein.

## 3. Technischer Hintergrund / bereits realisierte Korrektur

### 3.1 Menübewegung
- **Datei:** `frontend/modules/ui/controls.js` (plus zwei gespiegelte Frontend-Auslieferungen).
- **Funktion:** `animateNavigation(outgoing,incoming,forward,complete)`; `speedOptions={Schnell:220,Mittel:440,Langsam:760}`.
- Die bisherige Übergangstechnik erzeugt aus der echten bestehenden Oberfläche zwei **temporäre Klone**, ohne echte Steuerelemente doppelt funktional zu registrieren.
- Fehlerursache: Aktivierung von `.gr-horizontal-detail` verbarg die auslaufende Übersichtskopie bereits während des Schiebens. Dazu kamen unterschiedliche Layout-Bezugssysteme zwischen Klonen/echten Steuerelementen und der dynamischen Dialoghöhe.
- In V4.11.55 werden beide Übergangskopien durch **eng begrenzte CSS-Selektoren innerhalb von `.gr-horizontal-transition`** trotz Wechsel des echten Detailmodus sichtbar gehalten. Die Kopien übernehmen die realen Innenabstände und `border-box`.
- Bewegung und Größenanimation verwenden dieselbe Dauer/Easing; temporäres Scrollbalkenflackern wird während des Übergangs verhindert. Die gemessene Endhöhe wird nach der Animation beibehalten; beim Schließen wird der Höhenverschluss entfernt. Spät beendete Übergänge dürfen einen geschlossenen Dialog nicht wieder auf feste Höhe setzen.
- **Datei:** `frontend/modules/ui/skeleton.js`. Signatur `.settings-signature-wrap` ist nun eigenständiges Kind von `.settings-dialog` außerhalb des scrollbaren `.settings-body`; die Versionsangabe ebenfalls. Die Signaturgrafik selbst wurde nicht verändert.
- Schutz bisheriger Funktionen: `Module & Versionen`, Projekt-Hub, Hilfe/Sprachen, klassische Menüdarstellung, Android-Touch, kartenspezifische Steuerung.

### 3.2 Cluster und individuelle Marker
- **Datei:** `frontend/modules/map/clusters-recent.js`.
- Schlüsselgebundene Wiederverwendung der nummerierten Cluster sowie der individuellen Gefahrenblitzmarker, keine flächendeckende `clearLayers`-Neuerstellung bei gewöhnlichem HA-Update.
- Relevante Tests: `scripts/test-v41153-cluster-markers.mjs` und `scripts/test-v41154-individual-markers.mjs`.
- Einzelfix wurde mit dem Menüzweig im Merge `d6980c…` zusammengeführt. Das ist keine offene Implementierungsaufgabe mehr.

## 4. Vollständig geprüfte Softwarebasis und Schutzprüfungen
- `docs/RELEASE_NOTES_V4_11_54_DEV.md` (Einzelblitz-Fix)
- `docs/RELEASE_NOTES_V4_11_55_DEV.md` (vereinigter Stand und Menü-Fix)
- `frontend/modules/ui/controls.js`
- `frontend/modules/ui/skeleton.js`
- `frontend/modules/map/clusters-recent.js`
- `frontend/module-manifest.js`, `frontend/version.js`
- `custom_components/gewitterradar/build_info.py`
- `custom_components/gewitterradar/dra-deployment-provenance.json`
- `tests/test_settings_navigation_v41150.py`
- `scripts/test-v41154-settings-motion.cjs` (**echte Chromium-Frontendprüfung:** zwei Lieferformen, Android/Desktop, alle drei Geschwindigkeiten, beide Richtungen).
- `scripts/test-v41153-cluster-markers.mjs`
- `scripts/test-v41154-individual-markers.mjs`
- `SHA256SUMS_FRONTEND.txt`, `frontend/assets.json`
- Workflows für Full Frontend, Integration, Modul-/Android-Kartenvertrag und Einstellungen/Versionsidentität.
- Die drei Auslieferungsvarianten `frontend/`, `dashboard/dist/`, `custom_components/gewitterradar/frontend/` müssen bei jeder Änderung synchron sein.

## 5. Nächste verbindliche Aufgabe – KEINE erneute Implementierungsrunde ohne Befund
1. **Zuerst** diesen Übergabestand mit den beiden Release-Notizen, der tatsächlichen Version und GitHub-Actions vergleichen. Kein Phasensprung, kein Zurücksetzen auf V4.11.53 oder eine der zwei konkurrierenden V4.11.54-Geschichten.
2. Nutzer gezielt zur **einmaligen Installation von V4.11.55 DEV per DRA V1** auffordern, **falls diese Version noch nicht installiert ist**. Bereits installierte Version vorab abfragen/prüfen. Nicht durch bloße Bereitstellung behaupten, der HA-Neustart und die Android-Browser-Neuladung seien erfolgt.
3. Android-Realabnahme mit realem Gerät: `Schnell`, `Mittel` und besonders `Langsam`, einmal hin und zurück, mindestens Startseite → `4. Kartendarstellung`, optional `8. Module & Versionen`; vollständig sichtbarer Inhalt während des Schiebens, kontinuierliche Höhenanpassung, kein Versatz oder Schlusssprung, stabiles Signatur-/Versionsfeld und richtiger `2026/10`-Wert. Klassisches Menü darf nicht regressieren.
4. **Zusammen** in einem geeigneten Gewittergebiet Clusterblasen und rote Einzelblitze beobachten; ein erneuter vollständiger Videosatz ist nicht nötig, sofern keine Abweichung besteht. Touchbedienung der Karte prüfen.
5. Realabnahme dokumentieren (welche Geräte/Versionen/Prüfpunkte, bestanden oder konkret fehlgeschlagen). Falls eine Abweichung bleibt: erst vorhandene HA-/Browser-Version und reproduzierbaren Schritt bzw. konkretes Video/Screenshot prüfen, **dann** gezielte Korrektur. Keine neue Testkaskade ohne neuen Befund.
6. Nur wenn neue Änderungen erforderlich werden: kleinster sauberer Commit, Modul-/Build-/DRA-Metadaten synchronisieren, volle grüne CI, kontrollierter Fast-Forward nach `deploy/dev`. **Keine unkontrollierte DRA-Aktualisierung**.

## 6. Was NICHT als abgeschlossen behauptet werden darf
- **Keine belegte finale Android-Realabnahme** von V4.11.55 in diesem Chat, obwohl CI grün ist.
- Nutzerinstallation ist hier zuletzt nicht mit genauer aktualisierter V4.11.55-Identität bestätigt. Frühere Angabe V4.11.51; spätere Aussage „Cluster funktionieren scheinbar wieder“ spricht für Test eines neueren Builds, beweist aber nicht V4.11.55.
- Browser-Tests prüfen technische Sichtbarkeit/Geometrieverträge; subjektive Android-Wahrnehmung eines minimalen Ruckelns wird erst vom Nutzer bestätigt.
- Der separate WeatherRouter-Arbeitsstrang und dessen Git-Export sind **nicht** Teil dieser Übergabe und sollen hier nicht nebenbei verändert werden.

## 7. Entscheidungsregel für den nächsten Chat
**Liegt V4.11.55 in Home Assistant vor und bestehen die gezielten Android-Prüfpunkte, gilt die Menü-/Clusterkorrektur als real abgenommen.** Andernfalls genau die fehlgeschlagenen Punkte eingrenzen. Keine erneute pauschale Umstrukturierung und keine massenhaften Wiederholungstests.

Entwicklersignatur: **C.K. – Eine Idee weiter gedacht.**
