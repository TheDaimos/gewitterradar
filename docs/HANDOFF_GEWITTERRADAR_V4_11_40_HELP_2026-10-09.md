# Übergabe – Gewitterradar V4.11.40 DEV: Android-Realabnahme abgeschlossen, „Hilfe und Hinweise“ offen

**Erstellt:** 2026-10-09  
**Typ:** Dokumentation / Übergabe ohne Änderungen an der Laufzeit  
**Produkt:** Gewitterradar · kanonisches Repository `TheDaimos/gewitterradar`  
**Entwicklungszweig:** `feature/v4.11-development`  
**DRA-/Auslieferungszweig:** `deploy/dev`  
**Prüfstand vor dieser reinen Dokumentationsübergabe:** beide Zweige auf `df118237de73c121ab356b21b702d233c7e245b9`  
**Schutz:** `main`, V4.10 FINAL und eingefrorene Referenzstände unangetastet lassen.

## 0. Wichtigste Botschaft an den nächsten Chat

1. **„3-Finger-Joe“ ist nach vielen Iterationen auf Android real abgenommen.** Die funktionierende Touch-/Pointer-/Gestenlogik **nicht** erneut auf Verdacht verändern.
2. **Die Moduldiagnose V4.11.40 ist auf dem echten Gerät konsistent:** 31/31 Module geladen, „Versionssatz konsistent“, Modulsatz-ID `E411-40A1`; vorherige Manifestabweichung beseitigt.
3. **Neuer, separater aktueller Defekt:** Der Nutzer meldete nach V4.11.40: **„Hilfe und Hinweise funktioniert aber trotzdem nicht mehr.“** Fehlersymptom bislang nur als Funktionsausfall beschrieben. Ursache **nicht** bestimmt; kein Fix begonnen oder abgenommen. Das ist der **nächste Arbeitsauftrag**.
4. Der vollständige historische Android-Fall liegt inzwischen dauerhaft im privaten gemeinsamen Dev-Tools-Repository und ist von dessen README, Einstieg, Projektgedächtnis, Werkzeugkatalog und Prüfliste verlinkt.
5. Mehrere ältere allgemeine CI-Tests sind noch rot. Nicht mit dem grünen gezielten Mobil-/Modulregistertest verwechseln und Fehlermeldungen nicht ohne Untersuchung als harmlos abtun.

## 1. Verifizierte technische Identität

| Merkmal | Wert |
| --- | --- |
| Produktversion | **V4.11.40 DEV** |
| `version` | `4.11.40` |
| Build | `V4.11.40-DEV-2026-10-08` |
| Runtime | `41140r1` |
| Modulsatz | `E411-40A1` |
| Integration | `0.25.0` |
| Module | **31** |
| `core.manifest` | **1.2.110**, registriert aus dem verbindlichen Sollstand |
| `core.registry` | 1.0.2 |
| `core.runtime` | 1.0.2 |
| `location.radii-map` | **1.0.19** |
| `diagnostics.map` | **1.0.5** |
| `ui.i18n-settings` | **1.3.6** |
| `diagnostics.module-view` | 1.3.6 |
| `weather.display-menu` | 0.4.9 |
| Vorheriger Produkt-Code-Checkpoint | `df118237de73c121ab356b21b702d233c7e245b9` |

**Wichtig:** Die nachfolgende reine Dokumentationsübergabe fügt einen neuen Git-Commit hinzu. Die obigen technischen Kennungen ändern sich dabei **nicht**. Zu Beginn eines neuen Chats unbedingt die *neuen* Zweig-HEADs prüfen und nicht den Produkt-Code-Checkpoint als aktuellen Branch-HEAD missverstehen.

### Echte HA-Abnahmen

- **V4.11.39:** Nutzer bestätigt nach Test des fehlerhaften Android-WebView-Gestenpfads ausdrücklich, dass die Kartenbedienung insgesamt funktioniert: Ein-Finger-Verschiebung, Zwei-Finger-Zoom beider Richtungen, gleichzeitiges Zoomen+Verschieben, Doppeltipp mit Zentrierung des angetippten Orts sowie Bedienbarkeit nach Drei-Finger-Bildschirmfoto; Kartenknöpfe/Geo waren im Testablauf berücksichtigt.
- **V4.11.40:** vom Nutzer gezeigte reale Darstellung unter „Module & Versionen“: **31 / 31 Module geladen**, grüner **„Versionssatz konsistent“**, **„Modulsatz-ID E411-40A1“**. Die vorangegangene Warnung „1 Abweichung“ beim Modulmanifest ist weg.
- **Nicht** als mit abgenommen kennzeichnen: „Hilfe und Hinweise“; für diese Funktion wurde im Gegenteil der Defekt gemeldet.

## 2. Android „3-Finger-Joe“ – gelöster Fehler, nicht erneut öffnen

### Historisches Fehlerbild

Auf Android/HyperOS im Home-Assistant-WebView führte die Drei-Finger-Wischgeste für einen Systemscreenshot zu einer für JavaScript widersprüchlichen Eingabefolge. Sichtbare Symptome in verschiedenen Entwicklungsständen:

- Karte bewegte sich nach Screenshot nicht mehr oder ein einzelner Finger verursachte Zoom.
- Zwei-Finger-Zoom wurde als diagonale Verschiebung umgesetzt.
- Kartenknöpfe +/− und Geo reagierten zwischenzeitlich nur jeden zweiten Tipp, während andere Oberflächenteile weiter bedienbar waren.
- TouchList meldete alte, scheinbar aktive Kontakte; echte neue Berührungen traten u. a. als `isPrimary=false`, später teils **ohne Pointer-Events**, aber mit `changedTouches` auf.
- Zu häufige Resets/650-ms-Quarantänen verstärkten die Blockade.
- Falsch verwendete Bildschirm-/Karteneingabekoordinaten beim Doppeltipp konnten die Karte bis Richtung Russland/Arktis versetzen.

**Keine universelle Android-Ursachenbehauptung:** Die aus der Anwendung beobachteten Browserereignisse und der erfolgreiche Gerätefix sind belegt; der genaue Android-/Chromium-Implementierungsfehler nicht.

### Erprobter Lösungsstand V4.11.39, unverändert in V4.11.40

- Karteneingaben über `composedPath()` auf die tatsächliche Kartenfläche beschränken; Leaflet-Schaltflächen, Links, Eingabefelder, Geo etc. vom Gesten-Fangbereich ausnehmen.
- Reale Touch-/Pointer-IDs getrennt verfolgen; gemeldete `touches.length` bei bestätigtem Phantomkontakt **nicht** als tatsächliche Zahl steuernder Finger interpretieren.
- Bei nicht klemmendem Leaflet-Zustand Widersprüche zuerst nur protokollieren; keine fortlaufenden Quarantäne-/Neuinitialisierungsschleifen.
- Ersatzsteuerung ausschließlich bei bereits bestätigtem WebView-Fehlerzustand: Pointer-Koordinaten **oder** Touch-only mit `changedTouches.identifier`.
- Ersatzbewegungen pro Bildaufbau zusammenfassen; Zwei-Finger-Zoom aus `log2(d_after / d_before)`, geografische Verschiebung aus dem Schwerpunktversatz; **eine** `map.setView(center,zoom,{animate:false})` pro Frame statt `setZoomAround()+panBy()`.
- Während Ersatzsteuerung `zoomSnap=0`; den bisherigen Wert bei Ende/Abbruch wiederherstellen.
- Doppeltipp aus gültigen kurzen, nahe aufeinanderfolgenden Pointer- oder Touch-only-Einzelfinger-Tipps; nach manuell ausgeführtem Doppeltipp nativen Doppelzoom unterdrücken.
- Bildschirm-Koordinaten gegen tatsächliches Kartenrechteck validieren; `map.containerPointToLatLng()`; geografischen Tipport **als neue Kartenmitte** setzen und +1 Zoomen. Ungültige Positionen vergrößern sicher um die bisherige Kartenmitte.
- Nicht sämtliche Android-/iOS-/Desktop-Bedienungen pauschal überschreiben, keinen globalen `touchmove`-Blocker einbauen.

### Unbedingt erhaltene Dateien

- `frontend/modules/location/radii-map.js` (abgenommener Gestenpfad; Modul 1.0.19)
- `frontend/modules/diagnostics/map-diagnostics.js` (mobile Diagnose, Modul 1.0.5)
- `scripts/test-v41140-module-manifest.mjs` (gezielter Karten-/Modulregister-Vertrag)
- `docs/RELEASE_NOTES_V4_11_34_DEV.md` bis `..._40_DEV.md` (historische Belege)
- Dashboard-/Integrations-Spiegel derselben Frontend-Dateien (müssen byteidentisch bleiben)

### **Kanonische vollständige, projektneutrale Entwicklungsdokumentation**

Privates Repository: **`TheDaimos/home-assistant-dev-toolkit`**

`docs/ANDROID_WEBVIEW_THREE_FINGER_SCREENSHOT_GESTURE_RECOVERY_2026-10-08.md`

- zehn Kapitel, 295 Zeilen, vollständige Chronologie V4.11.30–40;
- Phantomkontakt-Ursache auf Beobachtungsebene und API-Abgrenzung `TouchEvent.touches` / `TouchEvent.changedTouches` / `PointerEvent`;
- verworfene Fixversuche;
- konkrete Pan/Pinch/Doppeltipp-Mathematik;
- Kartendiagnose, exportierbarer Ereignisringpuffer und minimierbares Fenster;
- Sicherheits-/Lifecycle-/Cleanup-Regeln;
- Vorher-/Nachher-Realtest mit Drei-Finger-Screenshot und Negativproben;
- Portierungsgrenzen für andere Kartenanwendungen.

Link: https://github.com/TheDaimos/home-assistant-dev-toolkit/blob/main/docs/ANDROID_WEBVIEW_THREE_FINGER_SCREENSHOT_GESTURE_RECOVERY_2026-10-08.md

Dev-Tools-Dokumentations-HEAD nach Abschluss: `2009466441ddc5cf8d435d71d85470d4aa843c2e` (kann später weiterlaufen). Dort wurden auch `AGENTS.md`, `README.md`, `START_HERE.md`, `docs/PROJECT_MEMORY.md`, `docs/TOOL_CATALOG.md`, `docs/CONSUMERS.md`, `docs/ACCEPTANCE_CHECKLIST.md` und `CHANGELOG.md` ergänzt. Das Dev-Toolkit ist **keine produktive Laufzeitabhängigkeit**.

## 3. Nächster Arbeitsauftrag: „Hilfe und Hinweise“ funktioniert nicht

**Benutzerbefund am 08.10.2026:** Obwohl die Moduldiagnose unter V4.11.40 vollständig grün ist, funktioniert **„Hilfe und Hinweise“** weiterhin nicht mehr. Nutzer hat ausdrücklich entschieden, die Untersuchung am nächsten Tag fortzuführen.

### Nicht behaupten

- **Nicht** behaupten, dass der Fehler durch eine Modulversionsabweichung verursacht sei. Die vorherige konkrete `core.manifest`-Abweichung ist behoben und die Module sind konsistent.
- **Nicht** behaupten, dass bereits klar ist, ob der Knopf gar nicht reagiert, ob der Dialog nicht sichtbar wird, ob er leeren Inhalt zeigt oder ob eine JavaScript-Ausnahme entsteht. Dazu liegt noch kein Fehlerprotokoll vor.
- Nicht wieder an „3-Finger-Joe“ schrauben, nur um den Hilfe-Dialog zu reparieren.
- Keine „Lösung“ durch Weglassen von Sprachen, Hilfetexten, geschützten Ansichten oder Vereinfachung des Dialogs.

### Bekannte Quellcodepunkte zum Einstieg

1. `frontend/modules/ui/controls.js`: in `_bindControls` Bindung `this.shadow.getElementById('settings-help')?.addEventListener('click', () => this._openHelp());` (zuletzt Zeile ~19).
2. `frontend/modules/ui/skeleton.js`: tatsächliche Anlage des Schalters `settings-help` in den Einstellungen prüfen (zusammen mit `settings-help-label`).
3. `frontend/modules/ui/i18n-settings.js`: `_syncHelpMenu` (zuletzt ~2425), `_openHelp` (~2437), `_syncHelp` (~2473) und `_closeHelp` sowie die lokalen/externen Hilfesprachen.
4. `frontend/modules/core/base-context.js` und About-Locale-Modul: Abhängigkeiten/Locale-Lader sowie `resolveAboutLocale` / `requestAboutLocale` prüfen, **nur** wenn ein tatsächlicher Fehler darauf hinweist.
5. `frontend/gewitterradar.js`: Bootstrapping, Reihenfolge der `installControls` / `installI18nSettings` und Import-Revisionen.
6. `docs/RELEASE_NOTES_V4_11_28_DEV.md`: Älterer Hilfe-Ausfall durch `ui.i18n-settings` 1.3.3 bei erwartetem 1.3.6 und veraltetem Import-Cache-Buster `41123r1`; in V4.11.28 korrigiert. Dieser historische Befund ist **ein Anhaltspunkt**, kein Nachweis derselben Ursache unter V4.11.40.
7. Geschützte Qualitätsbaseline: `PROJECT_DEFAULTS.md`, `docs/ABOUT_GEWITTERRADAR_ACCEPTANCE_BASELINE_V4_05.md` und vorhandene Hilfetext-/Sprach-/Dialog-Tests. Hilfe war in V4.07.54 ausdrücklich geschütztes Verhalten.

### Empfohlener Ablauf

1. Frische Git-HEADs und aktuelle Modul-/Dateistände prüfen; mit V4.11.40-Realtest vergleichen.
2. Statisch die Kette **Schalter existiert → Klickbindung registriert → `_openHelp` wird aufgerufen → `dialog.showModal()` → `_syncHelp` → aktive Locale/Abschnitte** nachvollziehen. Insbesondere auf unbemerkte frühzeitige Rückkehr, fehlendes Element, abgekoppelte Karte, Ausnahmen oder Überschneidungen durch andere Dialoge/Überlagerungen prüfen.
3. Den Nutzer **nur dann** um eine konkrete Reproduktionsangabe oder Konsole/Diagnose bitten, wenn eine statische Prüfung keine klare Ursache liefert. Geeignete kurze Rückfrage: „Passiert beim Klick gar nichts, erscheint ein leerer Dialog oder wird etwas nur überlagert? Tritt es auf Android und Desktop auf?“
4. Kleinsten belegbaren Fix in `feature/v4.11-development` entwickeln; die bestehenden Hilfe-Texte, Dialoggestaltung, Mehrsprachigkeit, About-Baselines und funktionierenden Android-Kartengesten erhalten.
5. Vollständige Spiegelgleichheit zwischen `frontend/`, `dashboard/dist/` und `custom_components/gewitterradar/frontend/` sichern; die sichtbare DEV-Version, Build-/Laufzeit-/Modulsatzkennung und DRA-Kennung **für jede Runtime-Iteration** konsistent erhöhen.
6. Gezielt automatisiert und auf echtem HA in Hauptansicht/Seitenleiste testen, einschließlich Hilfe öffnen/schließen und mehrsprachigem Inhalt, Mobile/Desktop sowie Kartenbedienung als Regression.
7. Erst nach geeigneter Prüfung beide Zweige kontrolliert synchronisieren und dem Nutzer konkrete Realtestschritte geben.

## 4. Bisherige Moduldiagnose-Reparatur V4.11.40

V4.11.39-JSON zeigte zeitweise mehrere alte `core.runtime`-Registrierungen und Manifest `core.manifest` 1.2.108 bei erwartet 1.2.110. Ein späterer sauberer Realexport enthielt **keine** Doppelregistrierungen mehr, aber weiterhin **eine** Manifest-Abweichung.

V4.11.40 korrigierte genau diese letzte Quelle, indem `MODULE_META.version` im Manifest direkt auf den `EXPECTED_MODULES`-Eintrag für `core.manifest` zurückgreift statt den veralteten Versionsliteral zu wiederholen. Dazu kam der eigene `scripts/test-v41140-module-manifest.mjs`. Zweige anschließend synchronisiert.

Vom Nutzer nach Installation bestätigt: **31/31**, „Versionssatz konsistent“, `E411-40A1`. **Keine weitere Modulregistrierungsänderung notwendig**, solange neue Diagnosen nicht das Gegenteil zeigen.

## 5. CI-Status – gezielte Gates grün, alte allgemeine Prüfungen nicht grün

**Für Produkt-Code-Checkpoint `df118237`**, beide Zweige später auf exakt diesem Stand:

| Workflow | Letzter bekannter Zustand | Beleg |
| --- | --- | --- |
| V4.11.40 module consistency and Android map preservation | **SUCCESS** | https://github.com/TheDaimos/gewitterradar/actions/runs/37800044475 |
| Gleicher gezielter Test auf `deploy/dev` | **SUCCESS** | https://github.com/TheDaimos/gewitterradar/actions/runs/37800138760 |
| Diagnostic contract | **SUCCESS** | https://github.com/TheDaimos/gewitterradar/actions/runs/37800044109 |
| Hi-Res asset retention | **SUCCESS** | https://github.com/TheDaimos/gewitterradar/actions/runs/37800044051 |
| Validate shared Gewitterradar frontend | **FAILURE** | https://github.com/TheDaimos/gewitterradar/actions/runs/37800138642 |
| Validate Gewitterradar integration | **FAILURE** | https://github.com/TheDaimos/gewitterradar/actions/runs/37800139012 |

### Konkrete offene Testabweichungen

- `scripts/test-v411-weather-router.mjs` erwartet noch Zeichenfolge `version:"0.3.1"` für `weather.display-menu`, obwohl aktueller Stand **0.4.9** ist.
- `scripts/build-frontend.mjs`: „Frontend version is not covered by an active contract“ bei **4.11.40**.
- Integrations-Paketvertrag: „Unexpected integration manifest identity“; zugehörige Testidentität ist veraltet bzw. muss gegen reale `0.25.0`/DRA-Build-Kennungen geprüft werden.
- Home-Assistant-Runtime-Tests: **42 bestanden, sieben fehlgeschlagen**, unter anderem historische `4.10.02`/`41108r1`-Erwartungen, 23/28 statt 31 Module, `0.21.0` statt `0.25.0` sowie eine Prüfung der internen Import-Cache-Kohärenz.

**Warnung:** Ein Teil sind nachweisbar veraltete harte Testannahmen. Die Import-Cache-Kohärenz **nicht pauschal** als harmlos erklären: historische `?v=...`-Varianten waren beteiligt an doppelten Modulladungen. Den tatsächlichen Befund gesondert prüfen. Geschützte Baselines/Golden-Tests nicht aufweichen oder willkürlich löschen. Keine pauschale CI-Grünbehauptung.

**Priorität:** Zuerst den vom Nutzer gemeldeten Hilfe-Ausfall reproduzieren/diagnostizieren, sofern der nächste Auftrag nicht ausdrücklich etwas anderes vorgibt. CI-Altlasten anschließend kontrolliert und getrennt bereinigen.

## 6. Weitere erhaltene V4.11-Funktionen

- WeatherRouter-Integration Consumer API V1; keine Duplikation des Provider-Routings im Produkt.
- Niederschlagsdarstellung mit **Präzise / Ausgewogen / Weich / Auto**, transparenzabhängigen Wetterebenen und Darstellungslegende.
- Auto-Glättung so abgestimmt, dass früher bei Zoom ~11 sichtbarer weicher Effekt bereits bei Zoom ~9 erreicht wird.
- Verschiebbares Augen-Symbol mit eigener Position; Layer-Menü und Schnellzugriffe.
- Mobile Kartendiagnose: **Voll / Kompakt / Minimiert**, minimierte Ansicht wiederherstellbar, maximal **800** Ereignisse; JSON kopieren und herunterladen.
- Gewitterradar als native Home-Assistant-Integration mit direkter Seitenleistenanzeige und gemeinsamer Dashboard-Auslieferungsform.
- Project Hub, Kompass, Medaillon, GPS/Standort, Radien, Cluster und „Letzte Treffer“ beibehalten.
- V4.10 FINAL eingefroren und nicht für V4.11-DEV-Probleme umschreiben.

## 7. Unveränderliche Entwicklungsregeln / Release-Gates

- Ein Gewitterradar, zwei Auslieferungsformen; Produktquellen nur im kanonischen `TheDaimos/gewitterradar`.
- DRA ist der reguläre Installations-/Rollbackweg; keine Anleitungen zum manuellen Patchen einzelner JS-Dateien, solange GitHub/DRA verwendbar ist.
- Niemals direkt `main`, V4.10 FINAL oder eingefrorene Referenzen umbauen, ohne ausdrückliche Freigabe.
- Vor jedem Schreibzugriff HEAD von `feature/v4.11-development` und `deploy/dev` neu lesen; **keine parallelen Änderungen überschreiben**. Im Streitfall keine erzwungenen Updates.
- Keine Veränderung an Leaflet-Tile-`transform`, `transformOrigin` für WeatherRouter-Raster oder globalem `touchmove`.
- Keine Provider-/Wetter-Routing-Logik im Gewitterradar verdoppeln.
- Android-Recovery-/Doppeltipp nicht ohne konkreten neuen Beleg ändern.
- Keine Hi-Res-Master löschen. Diagnose- und About-Golden-Schutzverträge erhalten.
- „Hilfe und Hinweise“ sowie „Über Gewitterradar“, Mehrsprachigkeit und die abgenommenen Layouts nicht für schnellen Fix vereinfachen.
- Relevante Checks inklusive Realgeräteprüfung berichten; jedes nicht-grüne Gate offenlegen.
- Gemeinsame Dev-Tools-Dokumentation projektneutral halten; keine privaten Geräte-/Standortdaten oder IP-Adressen übertragen.

## 8. Fortsetzung in neuem Chat

1. Übergebenen Startprompt `docs/HANDOFF_PROMPT_GEWITTERRADAR_V4_11_40_HELP_2026-10-09.md` verwenden.
2. Im neuen Chat aktuelle globale Defaults aus `TheDaimos/project-defaults/START_HERE.md` prüfen; danach `PROJECT_DEFAULTS.md` und beide Übergabedokumente des Gewitterradar-Repos.
3. Relevante Module und die kanonische private Android-Fallstudie im Dev-Toolkit laden.
4. Hilfe-Defekt eigenständig und minimalinvasiv untersuchen. Keine erneute Android-Gestenentwicklung ohne tatsächlichen neuen Befund.

**C.K. – Eine Idee weiter gedacht.**
