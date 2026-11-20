# Gewitterradar – ausführliche Chatübergabe: Standort-Kamerafahrt / V4.11.63 DEV

**Übergabe:** 13.10.2026, morgens (Europe/Berlin)  
**Projekt:** Gewitterradar V4.11, Bootstrap Daimos  
**Repository:** `TheDaimos/gewitterradar`  
**Entwicklung:** `feature/v4.11-development`  
**DRA-V1-Bereitstellung:** `deploy/dev`  
**Letztes vom Nutzer bestätigtes Problem:** **V4.11.62 DEV – Standortwechsel ohne frühere herauszoomende/überfliegende/heranzoomende Kartenfahrt.**  
**WICHTIG:** Ein GitHub-Erfolg ist keine Android-Realabnahme. **V4.11.63 ist bereits im Repository bereitgestellt, aber vom Nutzer noch nicht abgenommen.**

## 1. Verbindlicher GitHub-Stand beim Erstellen

Vor dieser **reinen Dokumentationsübergabe** zeigten BEIDE Zweige denselben Software-Commit:

- `1c67d06ba5caec27d7bb61997c32ce9ab82bf0ef`
- Produktversion **V4.11.63 DEV**, Build `V4.11.63-DEV-2026-10-12`
- Runtime `41163r1`, Modulsatz `E411-63A1`, Home-Assistant-Integration `0.25.0`
- `location.radii-map` **1.0.21**, `ui.controls` **1.1.22**, `core.manifest` **1.2.124**
- `map.clusters-recent` **1.0.6**, `ui.skeleton` **1.1.22**; ursprünglich 31 Module.
- Alle **vier** `deploy/dev`-Prüfungen zu diesem Commit waren abgeschlossen und erfolgreich:
  - [Frontend, Lauf 38314884393](https://github.com/TheDaimos/gewitterradar/actions/runs/38314884393)
  - [Home Assistant / Integration, Lauf 38314884275](https://github.com/TheDaimos/gewitterradar/actions/runs/38314884275)
  - [Menünavigation und Versionsidentität, Lauf 38314884287](https://github.com/TheDaimos/gewitterradar/actions/runs/38314884287)
  - [Android-Karten-/Modulschutz, Lauf 38314884280](https://github.com/TheDaimos/gewitterradar/actions/runs/38314884280)
- Entwicklerprüfungen ebenfalls grün.
- [Release Notes V4.11.63](RELEASE_NOTES_V4_11_63_DEV.md).

**Achtung bei dieser Dokumentationsübergabe:** Der anschließend erzeugte Dokumentations-Commit darf **nur** `feature/v4.11-development` verändern. `deploy/dev` bleibt auf dem geprüften Software-Commit `1c67d06…`. Die Übergabe ist **kein** Softwareupdate. Wenn im nächsten Chat die Zweige deshalb abweichen, ist das zunächst zu erwarten. Vor einer weiteren Codeänderung immer erneut den echten Git-Stand abfragen.

## 2. Nutzerergebnisse – verbindliche Android-Realbeobachtungen

### Erfolgreich / ausdrücklich bestätigt

1. **V4.11.58:** Horizontale Einstellungsanimation erheblich besser. Ein geringer Rest an Unruhe ist akzeptabel; Animation nicht erneut ohne neuen Fehler umbauen. Die Signatur wurde stabilisiert. Vorherige V4.11.57 hatte noch ein einmaliges Flackern beim Abschluss; V4.11.58 führte einen überblendeten Übergang ein.
2. **V4.11.59:** Ein sichtbares Zahnrad; Gold = klassischer aufklappbarer Einstellungsbaum, Blau = moderne animierte horizontale Navigation; Auswahl wird lokal gespeichert.
3. **V4.11.60:** Standort-Auswahllisten auf Android in Standard/Groß/Vollbild gegen Zurückspringen und Wischgestenkonflikte geschützt; Scrollposition bleibt bei Aktualisierung/Neupositionierung erhalten.
4. **V4.11.61:** Einstellungen **Menüdarstellung** (Klassisch/Modern) und **Menügeschwindigkeit** unter **5. Effekte & Animationen** in denselben hochwertigen Auswahllisten wie andere App-Einstellungen. Geschwindigkeit ausschließlich in Modern sichtbar.
5. **Unmittelbar vor der Kamerafahrt-Diskussion sagte der Nutzer ausdrücklich:** „**Und die Standortmenus funktionieren übrigens wieder wie sie sollen und auch die einsortierung der Menüpunkte innerhalb der Einstellungen ist gut.**“ Das sind **abgenommene Bedienungsverbesserungen**, die geschützt bleiben müssen.

### Noch offen / vom Nutzer klar widerlegt

Der Nutzer meldete, dass beim Umschalten des Karten-Bezugsstandorts die frühere Kartenfahrt fehlt: Früher **herauszoomen → zum neuen Standort fliegen → heranzoomen**; aktuell wird der Bezug oft lediglich gewechselt, die Karte schwenkt manchmal teilweise mit, aber der sichtbare Reiseeffekt fehlt.

- Vor V4.11.62 Video: **`72687.mp4`**; zeigt Verhalten vor Kamera-Fix.
- V4.11.62 wurde nach Umsetzung von `flyTo` vom Nutzer real ausprobiert.
- Explizites Ergebnis: **„Hat nicht funktioniert, keine Änderung“**.
- Hierzu lieferte der Nutzer **`72689.mp4`** als Android-Video.
- **Diesen Befund nicht als „behoben“ markieren.** Das Video `72689.mp4` wurde noch nicht gesondert umfassend ausgewertet; die Nutzerbeobachtung ist jedoch eindeutig.
- Danach kam V4.11.63 in GitHub. **Es liegt derzeit keine Android-Realabnahme dieser neueren Fassung vor.** Nicht als installiert behaupten.

## 3. Bisherige technische Untersuchung / warum V4.11.62 nicht reichte

### 3.1 Allgemeiner Referenzwechsel in `location.radii-map`

In `frontend/modules/location/radii-map.js` übernimmt `_syncReferenceMap(reference)` regelmäßig Marker-/Radiuspositionen und prüft `_mapReferenceOption` gegen die neue Referenzoption.

Historisch stand dort bei Optionsänderung:

```js
this._map.setView(latLng,this._map.getZoom(),{animate:false});
```

Das ist ein **sofortiger** Kameraversatz. Diese Zeile stammt aus älteren V4.10/V4.05-Ständen und wurde **nicht** erst durch die V4.11.60-Standortlisten-Korrektur eingeführt. Eine vorschnelle Schuldzuweisung an die Dropdown-Korrektur ist daher unbelegt.

V4.11.62 ersetzte den unmittelbaren Sprung bei echter Optionsänderung mit `map.flyTo(latLng,zoom,{animate:true,duration})`, abgestuft nach Distanz; normale Home-Assistant-Aktualisierungen sollten keinen weiteren Flug auslösen. Diese isolierte Änderung **brachte real keinen Erfolg**.

### 3.2 Zweiter Kamerapfad bei gespeicherten Orten

Der Weg für **gespeicherte Orte** läuft über `frontend/modules/ui/controls.js`, insbesondere:

1. Standortlisten-Klick mit gespeicherter Koordinate (und womöglich ein gesonderter Weg für Person-/Zonen-Optionen).
2. `v407UseCandidate(candidate)`: Aufruf des HA-Dienstes `gewitterradar.set_reference_coordinates` oder des vorhandenen Skript-Fallbacks.
3. Home Assistant meldet neue Bezugskoordinaten zurück und triggert `_syncReferenceMap`.
4. Nach erfolgreicher Bestätigung wird `v407FocusCandidate(candidate)` aufgerufen.
5. Diese Methode startet mittels `requestAnimationFrame` `_focusReferenceStormRadius(reference)`.
6. `_focusReferenceStormRadius` liegt in `frontend/modules/map/clusters-recent.js` und fährt üblicherweise über Leaflet-`flyToBounds` zum neuen Gewitterradius: `padding:[34,34]`, `animate:true`, `duration:1.22`, `easeLinearity:.22`; Fallback `flyTo`, danach `setView`.

**Vermutete V4.11.62-Konfliktursache:** Für denselben Nutzerwechsel können `flyTo` aus dem HA-Referenzupdate und direkt danach `flyToBounds` aus der bestätigten UI-Aktion aufgerufen werden. Die zweite Bewegung ersetzt bzw. bricht die erste ab. Dies ist die explizite technische Hypothese der V4.11.63-Release Notes und passt zum Ausbleiben der sichtbaren V4.11.62-Verbesserung. **Die Hypothese darf nicht als auf Android endgültig bewiesen beschrieben werden.**

### 3.3 Neue V4.11.63-Gegenmaßnahme (bereits eingecheckt)

V4.11.63 markiert **vor dem HA-Dienstaufruf** einen begrenzten Handoff-Zustand:
- `_referenceFlightSequence` und `_referenceFlightHandoff={id,lat,lon,phase,until}`, anfänglich etwa 12 s, um veraltete Dienstantworten/konkurrierende Nutzeraktionen einzuordnen.
- `_syncReferenceMap` aktualisiert Marker/Radien immer, unterdrückt aber **während eines gültigen Handoffs** seine parallele `flyTo`-Bewegung.
- Die bestätigte UI-Aktion `v407FocusCandidate` startet weiter die bestehende `_focusReferenceStormRadius`-/`flyToBounds`-Kamerafahrt; die Handoff-Phase wird auf `flying` gesetzt, mit begrenzter Gültigkeit.
- Alte/abweichende Kandidaten werden geschützt; direkter Person-/Zonenwechsel hat weiterhin den getrennten `flyTo`-Pfad.
- Neue Kartendiagnose-Ereignisse: `geo.reference.handoff.prepared`, `geo.reference.handoff.deferred`, `geo.reference.handoff.flight`, `geo.reference.handoff.superseded`.
- Implementiert durch Software-Commit `1c67d06ba5caec27d7bb61997c32ce9ab82bf0ef`, vier grüne deploy-Prüfungen.
- **Android-Funktionsnachweis noch ausstehend.**

## 4. Genaues Ziel und Abnahmekriterien

Ein **gespeicherter Bezugsstandort** (am besten zwei weit entfernte Orte, z. B. Deutschland → Japan oder Deutschland → Nordamerika) muss über die reguläre Android-Standortliste gewechselt werden können. Erwartet:

1. Der gewählte Ort wird tatsächlich als Bezugsstandort übernommen (HA-Status, Marker/Radien/Label).
2. **Genau eine**, ununterbrochene, eindeutig sichtbare Kamerafahrt: Herauszoomen / räumliche Bewegung / am Ziel wieder Heranzoomen, ohne überraschenden Zwischensprung.
3. Bei `flyToBounds` ist die Ziel-Zoomstufe an den Gewitterradius angepasst. **Achtung:** Das unterscheidet sich vom direkten `flyTo` auf bisheriger Zoomstufe – beide Semantiken nicht versehentlich vermischen.
4. **Kein** wiederholtes Fliegen bei nachfolgenden Wetter-/HA-Aktualisierungen.
5. Manueller Zoom und Verschieben nach dem Flug bleiben vollständig beim Nutzer, auch wenn der gewählte Bezug außerhalb des Ausschnitts liegt.
6. Standortliste bleibt bis zu gespeicherten/gelöschten Orten scrollbar – Standard, Groß, Vollbild.
7. Keine Regression bei Kartengesten und 3-Finger-/Screenshot-Schutz, Cluster-/Einzelblitzmarkern, WeatherRouter, animiertem Einstellungsmenü und Gold/Blau-Zahnrad.
8. Zugänglichkeit bei `prefers-reduced-motion` beachten; Vorzugsbewegung nur bei zulässiger/unterstützter Animation.

Ein grün laufender Mock-`flyTo`-Test reicht **nicht**. Der Android-Realtest des echten HA-Dienst- und Kartenpfads entscheidet.

## 5. Präzise Fortsetzungsreihenfolge – kein blinder neuer Fix

1. **Erst** die beiden Branch-Heads live abfragen. Stand vor dieser Dokumentation siehe Abschnitt 1. Dokumentations-Commit kann Entwicklungszweig zusätzlich vorziehen.
2. `frontend/version.js`, `docs/RELEASE_NOTES_V4_11_63_DEV.md`, diese Übergabe, `frontend/modules/ui/controls.js`, `frontend/modules/location/radii-map.js` und `frontend/modules/map/clusters-recent.js` lesen.
3. **Nicht** V4.11.62 noch einmal blind reparieren. Aktuelle codebasierte V4.11.63-Änderung zuerst bewerten.
4. Nächster praktischer Schritt: Nutzer eine **einzige**, klare Realabnahme des bereits über DRA V1 verfügbaren Standes **V4.11.63 DEV** ermöglichen, falls noch nicht installiert. Nicht behaupten, sie sei installiert.
5. Vorschlag für aussagekräftigen Test: Auf Android einen bekannten gespeicherten Ort auswählen, anschließend einen deutlich entfernten anderen gespeicherten Ort. Prüfen, ob die zuvor fehlende Herauszoom-Überflug-Heranzzoom-Animation nun sichtbar ist. Danach ein Wechsel zurück. **Keinen umfangreichen Einzeltest-Marathon.**
6. **Falls wieder defekt**: Vor Codeänderung das frische Video und den Export der mobilen **Kartendiagnose** ansehen, sofern der Nutzer sie bereitstellen kann. Insbesondere die vier neuen `geo.reference.handoff.*`-Ereignisse, `geo.focus.request`, `geo.focus.method`, `geo.focus.skipped` sowie Leaflet `movestart/zoomstart/moveend/zoomend`, tatsächlich installierte Version und Art des Standortes korrelieren.
7. Unterscheiden zwischen **gespeicherten Koordinaten** und **Person-/Zonen-`input_select`-Weg**. Ihre HA-Dienstflüsse sind nicht notwendigerweise gleich.
8. Nur bei nachgewiesener Ursache die kleinste gezielte Korrektur durchführen; vollständige Version in Fenster, Modulregister, DRA, Diagnose und Auslieferungen; CI und Android-Abnahme. Benutzermenüs und Kartenbedienung nicht umbauen.
9. Nicht in die Entwicklung anderer Projekte abgleiten (WeatherRouter, DRA V2, Project Hub).

## 6. Zentrale Dateien / Schutzverträge

- `frontend/modules/ui/controls.js` – Standortlisten, Touch-/Scrollschutz, gespeicherte Kandidaten, `v407UseCandidate`, `v407FocusCandidate`, Handoff.
- `frontend/modules/location/radii-map.js` – `_syncReferenceMap`, Marker und Radien, HA-gesteuerter Standortwechsel, Fallback-Flug, Android-Kartengestenschutz.
- `frontend/modules/map/clusters-recent.js` – `_focusReferenceStormRadius` mit `flyToBounds`; daneben stabile Marker.
- `frontend/modules/ui/render.js` – ruft `_syncReferenceMap(reference)` im allgemeinen Rendering auf.
- `frontend/modules/fullscreen/map-display.js` – Kartendarstellungen Standard/Groß/Vollbild/Eigenes Fenster, Android-Overlays.
- `frontend/modules/diagnostics/map-diagnostics.js` – mobile Diagnoseexporte und Kartenereignisprotokolle.
- `scripts/test-v41154-settings-motion.cjs` – Browser-Vertragsprüfung für Menüs und Kamera-Handoff.
- `scripts/test-v411-identity.mjs`, `scripts/test-v41140-module-manifest.mjs`, `scripts/verify-frontend.mjs`, `tests/test_settings_navigation_v41150.py` – Versions- und Regressionsverträge.
- `frontend/version.js`, `frontend/module-manifest.js`, `frontend/assets/gewitterradar-runtime-manifest.json`, `frontend/assets.json`, `SHA256SUMS_FRONTEND.txt`, `custom_components/gewitterradar/build_info.py`, `custom_components/gewitterradar/dra-deployment-provenance.json` – Bereitstellung.
- Synchronisierte Frontends: `frontend/`, `dashboard/dist/`, `custom_components/gewitterradar/frontend/`.
- `docs/RELEASE_NOTES_V4_11_58_DEV.md` bis `docs/RELEASE_NOTES_V4_11_63_DEV.md` – letzte Fortschritte.

## 7. Einordnung und Regeln

- Nutzer arbeitet **allein**. Bitte keine Team-Ansprache.
- Antworten auf Deutsch, keine unnötigen Anglizismen.
- Nutzer hat zahlreiche enge Einzeltests erlebt und möchte **gezielte Ursache-Fix-Abnahme-Zyklen**, keine endlosen Schleifen.
- Neue Softwareversion **nur bei echter Laufzeit-Codeänderung**, nicht bei dieser Übergabedokumentation.
- Wenn eine Änderung erfolgt: sauberer Git-Commit, nur geprüfter Fast-Forward nach `deploy/dev`, alle CI-Prüfungen, DRA V1; Home Assistant aktualisiert der Nutzer selbst.
- Die wirklich bestätigte Aussage lautet **V4.11.62 funktioniert nicht**, nicht „V4.11.63 funktioniert nicht“.
- **Nächster Nutzerbericht nach V4.11.63** muss Vorrang vor jeder Hypothese aus GitHub bekommen.

**Signatur:** C.K. – Eine Idee weiter gedacht.
