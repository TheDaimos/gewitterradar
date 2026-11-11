# VERBINDLICHE WIEDERAUFNAHME – 3-Finger-Joe / Universal Touch Guard

**Projekt:** GewitterRadar Pro – powered by WeatherRouter  
**Stand der Übergabe:** 11. November 2026  
**Entwicklungsquelle:** `TheDaimos/gewitterradar@deploy/dev`  
**Installierter, real getesteter Stand:** **GR V4.11.187 DEV / HA V0.25.94**  
**Geschützte visuelle Referenz:** **GR V4.11.181 DEV**  
**Status:** **BEWUSST PAUSIERT** – Restbudget Codex-Wochenlimit **16 %**. **Kein unmittelbarer Implementierungsauftrag.**  
**Ziel bei Wiederaufnahme:** Funktionierender, wiederverwendbarer Android-WebView-Touch-only-Ersatz für die GR-Bedienelemente, beginnend mit Eye/Aura und gemeinsam genutzten Icon-Drag-Interaktionen; regressionsarm, ressourcenschonend.

> **Entscheidung des Betreibers:** Fehler jetzt nicht weiter mit Codex bearbeiten. Erst bei ausreichendem Budget gezielt wieder aufnehmen. Alle Erkenntnisse, nachgewiesenen Quellen und offenen Fragen hier konservieren. Kein erneutes Grundsatz-Rätselraten, keine Wiederholung abgeschlossener wissenschaftlicher Wetterprüfungen.

## 1. Aktuelle Android-Beobachtung und Abnahme

**Auslöser:** In der Home-Assistant-Companion-App auf Android/HyperOS einen Screenshot mit **drei Fingern nach unten wischen**. Betroffen: Android-WebView, nicht ausschließlich Leaflet.

- GR V4.11.186 verbesserte die Kartengesten-Recovery, aber nicht zuverlässig die Eye-Bedienung.
- **GR V4.11.187 ist auf dem echten Android-Gerät NICHT abgenommen:** Bereits der erste Drei-Finger-Screenshot führte zu einem Fehler. Die Karte lässt sich weiterhin ziehen und die Größenmodi **klein / groß / Vollbild** funktionieren. Das Eye/Aura-Symbol ist weder antippbar noch verschiebbar. Ein Größenmoduswechsel stellt die Funktion in dieser V187-Beobachtung nicht mehr her.
- V186-Realtests: zeitweise war Eye im kleinen Modus tot, nach Vollbildwechsel wieder erreichbar. Fehler entstand bereits **während Aura- bzw. Wind-/Temperaturentwicklung**, damals schwächer und unregelmäßiger, nicht erst mit Settings Vault.
- **Kompass und Trend-Medaillon** waren laut Betreiber nie betroffen. Das ist ein wertvoller Kontrollfall.
- Ein besonders guter V187-Realversuch mit geöffneter, etwas nach unten verschobener **Kartendiagnose**: Nach Drei-Finger-Screenshot bewegten sich Karte und zunächst Eye noch; ein nachfolgender Eye-Tap versagte, danach auch Eye-Drag. **Auch das Diagnosefenster ließ sich nicht mehr verschieben, sein Inhalt aber weiterhin scrollen**, sodass ein JSON-Export gelang. Gemeinsames Problem der Pointer-/Drag-Bedienung außerhalb der Karte plausibel; nicht nur Eye-internen State annehmen.
- Nicht durch App-Neustart oder Cache-Löschung „wegtesten“; Diagnose **bei kaputter Bedienung** exportieren, bevor Zustand verloren geht.

### Wichtig: separat positives Settings-Vault-Ergebnis

Unter V4.11.185 wurde in der Android Companion App ein Geräteprofil angelegt. Nach **Frontend-Cache löschen** ließ sich das bereits serverseitig vorhandene Profil erneut auswählen; Wetter-/UI-Darstellungen schienen erhalten. Der erste reale Wiederzuordnungstest war positiv. **Nicht** behaupten, damit seien alle Speicher-/Migrationsfälle vollständig abgenommen. Die Touch-Korrektur darf Vault-, Account-/Device-Profilbindung, Migration, Eye-Konfiguration und Cache-Wiederzuordnung nicht beeinflussen.

## 2. Unverzichtbare HISTORISCHE Dokumentation (am 11.11. erneut vollständig gelesen)

**DEV-TOOLKIT – ERSTE QUELLE BEI WIEDERAUFNAHME:**  
[Android-WebView: „3-Finger-Joe“ – Phantomkontakte nach Drei-Finger-Bildschirmfoto und sichere Karten-Gestenwiederherstellung, 08.10.2026](https://github.com/TheDaimos/home-assistant-dev-toolkit/blob/main/docs/ANDROID_WEBVIEW_THREE_FINGER_SCREENSHOT_GESTURE_RECOVERY_2026-10-08.md)

**Original real abgenommener Code:**  
- [GR V4.11.39 – Commit `1f5f5210d4f73c373fcb77296b54cf61b0564883`](https://github.com/TheDaimos/gewitterradar/commit/1f5f5210d4f73c373fcb77296b54cf61b0564883)
- [V4.11.40 – Commit `df118237de73c121ab356b21b702d233c7e245b9`](https://github.com/TheDaimos/gewitterradar/commit/df118237de73c121ab356b21b702d233c7e245b9) (Karten-Gesten unverändert)
- Historisch primär `frontend/modules/location/radii-map.js`, `frontend/modules/diagnostics/map-diagnostics.js`; Release Notes V4.11.30–40; `scripts/test-v41140-module-manifest.mjs`.

**Was damals technisch und durch Android-Realtest bewiesen wurde:**

1. Die WebView kann nach dem OS-Drei-Finger-Screenshot **Phantomkontakte** in `TouchEvent.touches` behalten. Die Gesamtzahl enthält dann alte Kontakte.
2. **`changedTouches` enthält reale neue/veränderte Kontakt-IDs**; die IDs plus Positionen sind im bestätigten Fehlerfall die bessere Quelle. Beispiel historisch: `touches.length=2`, `changedTouches.length=1`; die konkreten Zahlen sind **keine** universelle Konstante.
3. Manche spätere reale Touchkontakte erzeugen **überhaupt keinen `pointerdown` mehr** – ein ausschließlich auf Pointer-Events basierter Schalter/Drag wird dann faktisch unbedienbar.
4. Leaflet-Handler-Reset / `pointercancel` / `lostpointercapture` allein können nur lokale State-Hänger beheben, **nicht die WebView-internen Phantomkontakte**.
5. Erfolgreicher Karten-Fix V4.11.39: Fehlerzustand erst verifizieren; nur auf betroffener Kartenfläche einen gezielten Pointer- bzw. **Touch-only-Fallback** aktivieren, reale `changedTouches.identifier` verfolgen, Pan/Pinch und Doppeltipp korrekt durchführen; keine globalen Quarantäne-/Reset-Schleifen.
6. Historische Probleme der Zwischenstände V30–38: aggressive 650-ms-Quarantäne und wiederholte Handler-Neustarts, diagonale Zoomfehler, falsche geografische Zoomanker und unzuverlässiger Touch-only-Doppeltipp. Diese Fehlversuche **nicht wiederholen**.
7. V4.11.39 wurde am 08.10.2026 **auf dem betroffenen Android-Gerät** als funktionierend bestätigt; CI allein war ausdrücklich kein Ersatz.

**Dokumentationsregel:** Das ist eine bestätigte WebView-Ereignisanomalie im konkreten Gerät/App-Kontext, kein universell bewiesener Android- oder Chromium-Bug.

## 3. Aktueller forensischer V187-Android-Export (ERHALTEN, keine Rohdatei öffentlich veröffentlichen)

**Vom Betreiber hochgeladene Originaldatei im Chat:** `Eingefügter Text(20261111-220132).txt`  
**JSON-Schema:** `gewitterradar.map-diagnostic.v1`  
**Build:** `4.11.187` / `411187r1` / `E411-187A1`  
**Diagnosezeitraum (UTC):** 2026-11-11 **22:00:36.987 bis 22:01:25.095**; **68 Ereignisse**, vollständig innerhalb des 800er-Ringpuffers. Die lokale Uhrzeit lässt sich aus dem Export allein nicht zuverlässig ableiten; für den Vergleich die protokollierten UTC-Zeitstempel verwenden.  
**Umgebung:** Android 17, HA Companion App 2026.10.1 / WebView Chrome 156 (laut User-Agent). Mobile Viewport 400 × 821. Private Daten / Koordinaten stehen im Original-JSON, daher die Datei **nicht automatisch** in ein öffentliches Repo committen.

### Belegbare Ereignisfolge aus dem Original-JSON

| Seq / UTC-Zeit | Beobachtung | Bedeutung |
|---|---|---|
| 18–21 / 22:00:54–55 | `eye.gesture.begin` (pointer 8) → `eye.gesture.end`, `moved:true` | Eye-Drag **vor** Screenshot funktionsfähig |
| 22–34 / 22:00:56.178–56.184 | Pointer 9/10/11, drei Touchstarts, `gesture.system-gesture` (global-three-finger-pointer) | Drei-Finger-Screenshot erkannt |
| 35–39 / 22:00:56.184–56.187 | `input.touchcancel` → `gesture.recovery.begin` → `leaflet.moveend` → `gesture.recovery.end` → `gesture.interrupted` | Karten-Recovery wird tatsächlich abgeschlossen |
| 40–43 / 22:00:58.169–58.866 | **Noch ein erfolgreicher Eye-Drag** (`pointerId:9`, `moved:true`) und gleichzeitig `touches:3`, `changedTouches:1` | **WICHTIG:** Eye stirbt NICHT zwangsläufig in der Screenshot-Millisekunde; zunächst noch Pointer- und Eye-Bedienung |
| 44–57 / 22:00:59.277–22:01:05.939 | Weitere globale `pointerdown` (12–18) jeweils mit Touchstarts `touches:3`, `changedTouches:1` | Phantomkontakt-Widerspruch bleibt bestehen |
| 58–68 / 22:01:07.903–22:01:25.095 | Wiederholt `input.global-touchstart`, **ohne weitere entsprechende `input.global-pointerdown`** | **Touch-only-Phase:** Pointer-only-Controls können ausfallen |
| Snapshot 22:01:25 | `recovery.pointers=[]`, `touchIds=[]`, `globalPointers=[]`, `quarantineTouchSequence=false`, `blockUntilPrimaryUp=false`, `recovering=false`, `anomalyCount=0`, `lastRecovery.reason=touchcancel`; Leaflet `dragging.enabled=true`, `touchZoom.enabled=true` | Kein belegter dauerhafter Leaflet- oder Recovery-Lock; Kontaktdiskrepanz verbleibt außerhalb des GR-Trackers |

**Belastbare Schlussfolgerung:** Android-WebView meldet nach der Drei-Finger-Geste weiterhin drei Touchkontakte, jeweils nur einen geänderten Kontakt, und später keine passenden Pointerdowns mehr. Die Karten-Recovery läuft durch. Die Kombination **Eye-Tap+Drag tot, Diagnosefenster-Drag tot, Scrollen noch möglich, Karte funktionsfähig** passt zu fehlenden Pointerevents bei Pointer-basierten Controls.

**Noch nicht belegt:** Exakter Codepfad, der die Touch-only-Phase verursacht; genaue betroffene Schaltflächen; ob ein Overlay zusätzlich Trefferflächen verdeckt; native Android-/Chromium-Root-Cause. Die JSON-Kartendiagnose enthält keine lückenlose DOM-Hit-Test-Messung auf jedem Control.

## 4. Aktuelle technische Fundstellen (verifiziert auf deploy/dev)

| Datei | Was bei Wiederaufnahme prüfen ist |
|---|---|
| `frontend/modules/location/radii-map.js` | Bereits vorhandener Karten-Gestenschutz, `browserTouchFallback`, `changedTouches`, globale Pointer-/Touch-Zähler, Recovery-Scope. **Bewährten Ersatzpfad wiederverwenden, nicht kopieren oder umbauen.** |
| `frontend/modules/weather/display-menu.js` | `_weatherDisplayBindEyeDrag`, `_weatherDisplayCancelEyeDrag`, `eyeDrag`, `eyeSuppressClickUntil`, `blockEyeReleaseClick`, `pointerdown/move/up/cancel`, `lostpointercapture`, `touchstart`-Listener. Touchstart ist vorhanden, aber dessen primärer Zweck war Native-Callout-Verhinderung; tatsächlicher Eye-Tap/Drag startet aktuell pointerbasiert. |
| `frontend/modules/weather/eye-hub.js` | Gruppiertes Eye, ungruppierte Icons, Bubble-Optionen, `_weatherDisplayBindEyeDrag`, Eye-Hub-Bindings und Lifecycle; **beide Menü-Modi** schützen. |
| `frontend/modules/weather/wind-display.js` | Wind-Schnellschalter-Drag über gemeinsamen Eye-Bind; aktuelle Wind-Snake-Visualisierung strikt unverändert. |
| `frontend/modules/weather/temperature-display.js` | Temperatur-Schnellschalter mit gemeinsamer Eye-Drag-Anbindung. |
| `frontend/modules/fullscreen/map-display.js` | `_recoverMapGestureState('display-mode-change',{force:true})`, Moduswechsel, Overlay-Drag-Sonderpfade; nicht als universelle Problemlösung missbrauchen. |
| `frontend/modules/diagnostics/map-diagnostics.js` | `_mapDiagnosticSnapshot`, `_mapDiagnosticLog`, Pointer-/Touch-Protokoll und mobile verschiebbare Panel-UI. Touch-only-Fehlerbild im Diagnoseexport nachvollziehbar; Panel-Drag selbst wird vom Betreiber als betroffen beschrieben. |
| `frontend/modules/core/card-lifecycle.js` | Gesten-Recovery bei Resume/Teardown; Idempotenz und keine Listener-Leaks. |

Weitere ähnliche Drag-Controls und künftige Icon-Registrierungen bei Wiederaufnahme **per Inventar** erfassen, nicht stillschweigend als bereits geschützt markieren. Kompass und Trend als nachgewiesen unbetroffene Kontrollfälle erhalten.

## 5. Verbindliche Architekturentscheidung: schmaler „GR Universal Touch Guard“

**Langfristig:** Alle heutigen und zukünftigen interaktiven GR-Schaltflächen / verschiebbaren Controls sollen denselben robusten Eingabegrundvertrag nutzen. **Keine vollständige UI-Großmigration in einem knappen Codex-Durchlauf.**

**Erste ressourcenschonende Implementierungsetappe:**

1. Nur einen **kleinen gemeinsamen Eingabe-/Recovery-Helfer** für Control-Interaktionen anlegen; vorhandene Eye-/Icon-Handler daran anbinden, ohne alle individuellen Gesten neu zu schreiben. Architektur mit `tap`, `longPress`, `drag` als optionalen Fähigkeiten, nicht alle Fähigkeiten jedem Button aufzwingen.
2. **Normale Pointer-Events bleiben bevorzugt**; Touch-Events für normale Browser-Nutzer nicht doppelt auslösen.
3. Nach **nachgewiesenem** Android-WebView-Pointer-/Touch-Widerspruch Touch-only-Erkennung aktivieren: lokale IDs aus `changedTouches.identifier`, ihre Positionen aus `clientX/clientY`, keine unzuverlässige Gesamtkontaktzahl `touches.length` als reale Fingeranzahl verwenden.
4. **Genau eine Aktion pro realer Geste:** Pointer und Touch de-duplizieren, keine synthetischen `click`-Doppelaktionen, keine ungewollten Long-Presses oder Bewegungen nach Cancel.
5. Aufeinanderfolgende gültige Touch-only-Taps, Long-Press, Drag müssen auch **ohne neuerlichen `pointerdown`** funktionieren. Kontaktwechsel, `touchcancel`, `lostpointercapture`, Blur, Visibility, Remount symmetrisch bereinigen; keine endlosen globalen Listener/Timer, keine erzwungenen Android-Screenshot-Blockaden.
6. Schutz der **gruppierten Eye-Icons und ungruppierten individuellen Funktionen**, Wind- und Temperatur-Schnellschalter, Niederschlags-Controls sowie gemeinsame zukünftige Icon-API. Niederschlags- und sonstige Schalter zunächst auf verwendete Bindung/Mechanismen prüfen. Nicht automatisch behaupten, sie alle seien identisch implementiert.
7. Diagnosefenster-Drag **als gesonderten Kontrollfall** mitprüfen und möglichst denselben kleinen Helfer benutzen, ohne die gesamte Diagnoseoberfläche anzufassen. Native vertikale Scrollbarkeit darf nicht verlorengehen.
8. Bestehende Leaflet-Fallback-/Gesten-Recovery weder duplizieren noch entkoppeln; Kartenbedienung separat belassen. Keine globalen `preventDefault`-Sperren.
9. Desktop-, iPad-, Tastatur- und Barrierefreiheitsinteraktionen bewahren. Visuelle, Layout- und Konfigurationsänderungen sind **nicht Teil des Auftrags**.

**Wichtig:** Dies ist ein **Entwurfs-/Migrationsvertrag**, noch kein implementierter Universal Guard.

## 6. Zu vermeidende frühere Fehler

- Nicht erneut auf ausschließlich `pointercancel` und `lostpointercapture` setzen; wenn der Browser keine Pointerereignisse liefert, können diese nicht genügen.
- Kein Reset der kompletten Karte oder der Leaflet-Handler bei jeder Touch-Anomalie.
- Keine endlose 650-ms-Touch-Quarantäne, keine häufigen Handler-Neuinitialisierungen.
- Kein pauschales `touch-action:none` oder `preventDefault` auf sämtliche Buttons/Seiten; Native-Scroll und System-Screenshots müssen möglich bleiben.
- Nicht in jedem UI-Baustein einen separaten fehleranfälligen Touch-Fallback implementieren.
- Nicht ohne Beweis eine Overlay-/Z-Index- oder Eye-intern-stale-`eyeDrag`-Ursache als alleinige Erklärung fixieren.
- Nicht nur synthetische Chromiumszenarien als „Android-Fix bestanden“ melden.
- Nicht die bestehenden Snake-Wind-Partikel, Aura-Neon, Temperatur-/Niederschlagsgrafiken, Eye-Animationen, Premium-Icons, V181-Visualreferenz, WR-Provider-/Freshness-Vertrag oder Settings Vault ändern.

## 7. Effizienter neuer Codex-Prompt bei Wiederaufnahme (ein Auftrag, HIGH)

> Nutze zwingend die Original-Referenz `TheDaimos/home-assistant-dev-toolkit/docs/ANDROID_WEBVIEW_THREE_FINGER_SCREENSHOT_GESTURE_RECOVERY_2026-10-08.md`, den funktionierenden GR-V4.11.39-Code `1f5f5210...`, den aktuellen GR-`deploy/dev` und diese Wiederaufnahme-Übergabe.  
> Die letzte echte Android-Abnahme **V4.11.187 ist fehlgeschlagen**: Karte funktioniert, Eye-Tap und Eye-Drag sowie Diagnosefenster-Drag können nach Drei-Finger-Screenshot ausfallen. Der V187-Export beweist nach erfolgreicher Karten-Recovery `touches:3/changedTouches:1` und eine spätere Touch-only-Phase ohne `pointerdown`.  
> **Ohne erneute weiträumige Bestandsanalyse**: identifiziere die betroffenen Control-Eingabepfade; implementiere eine **kleine wiederverwendbare Pointer/Touch-Fallback-Komponente** für Eye, gruppierte und ungruppierte Icons, gemeinsame Schnellschalter und – soweit technisch identisch / risikoarm – Diagnosefenster-Drag. Realer Kontakt = aktive `changedTouches.identifier` im bestätigten Fehlerzustand. Keine Doppelaktivierung und keine Veränderung an Leaflet-/Wind-Snake-/Aura-/Vault-Verträgen.  
> Liefere Browser-/Node-Regressionsfälle für „drei Finger → touchcancel → phantom touches → pointerdown fehlt → einzelner Touch tap/drag/longpress funktioniert“, gemischte Pointer-/Touch-Sequenz, Wiederholung, mehrere Controls, Panel-Scroll und Lebenszyklus. Schreibe Root Cause und Abgrenzung nieder.  
> Verwende **neue unbenutzte GR- und HA-Versionsnummern**, baue kanonische Frontend-/Dashboard-/HA-Pakete, verifiziere SHA-256 und öffentliche CI, veröffentlicht installierbar über `deploy/dev`. **PROD VM101 unverändert**. **Die reale Android-/HyperOS-Abnahme ausdrücklich offen lassen**, bis sie der Betreiber bestätigt. Bei unklarer Root Cause als unbestätigt dokumentieren statt großflächig auf Verdacht umzubauen.

## 8. Verbindliche echte Android-Abnahme (nach künftiger Version)

1. **Zuerst Kontrollwerte notieren**: eingestelltes Eye gruppiert/ungroupiert, Wind-Snake, Temperatur und Vault-Profil.
2. Kartendiagnose öffnen und minimieren; soweit möglich **separaten Vorher-Export** erstellen.
3. Android/HyperOS Drei-Finger-Screenshot, danach **sofort Eye antippen, ziehen und Long-Press**; alle drei müssen in kleiner und voller Karte funktionieren.
4. **Nicht gruppierte** Wind-/Temperatur-/Niederschlagssymbole testen; später gruppierte Eye-Bubbles; prüfen, dass keinerlei Doppelaktionen auftreten.
5. Diagnosefenster nach oben/unten **verschieben** und darin **scrollen**. Beides muss möglich bleiben.
6. Karte einhändig pan, zwei Finger Pinch rein/raus, Doppeltipp +1 und Standort-/Kompass-/Trendsteuerung kontrollieren.
7. **Mindestens fünf bis zehn** Screenshot-Zyklen ohne App-Neustart; nochmals nach Karten-Moduswechsel und HA-Frontend-Neustart. Sobald Fehler: Diagnose-JSON **ohne Neustart** exportieren.
8. Kontrolle des Settings Vault: Profil wiederzuordnen; Wind-/Eye-/Temperaturzustände bleiben erhalten.
9. Ergebnis exakt trennen: **synthetische CI**, **echte Android-Geräteabnahme**, **iPad/Desktop-Bestätigung**.

## 9. Release-/Quellen-Links und Status

- [GR V4.11.186 DEV / HA 0.25.93 – GitHub Release](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.11.186-dev); V186: `lostpointercapture`-/fehlende `pointerup`-Abbruchsequenzen verbessert, Android-Eye-Bug weiterhin vorhanden.
- [GR V4.11.187 DEV / HA 0.25.94 – GitHub Release](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.11.187-dev); Release-Commit `7a54d390984bb4d00c949eed8c2a23a654260fde`. **Echte Android-Abnahme NICHT bestanden.**
- Frühere Entwicklungsaufträge: [GR_THREE_FINGER_JOE_TOUCH_REGRESSION_AFTER_AURA_WIND_TEMPERATURE_2026-11-11.md](https://github.com/TheDaimos/gewitterradar/blob/deploy/dev/docs/GR_THREE_FINGER_JOE_TOUCH_REGRESSION_AFTER_AURA_WIND_TEMPERATURE_2026-11-11.md) und [GR_EYE_AURA_TOUCH_RECOVERY_FOLLOWUP_2026-11-11.md](https://github.com/TheDaimos/gewitterradar/blob/deploy/dev/docs/GR_EYE_AURA_TOUCH_RECOVERY_FOLLOWUP_2026-11-11.md). Diese älteren Aufträge **nicht erneut wortgleich ausführen**; vorliegende Übergabe enthält die neuen, entscheidenden Touch-only-Daten.
- **Ablageprinzip:** Diese Master-Übergabe ist die **primäre Wiedereinstiegsquelle**. Bei späterer Fortsetzung zuerst aktuelle Version/Branch prüfen; offene Punkte übernehmen, aber keine bereits abgeschlossenen Analysen neu starten.

---

### Kurzer Neustart-Satz für einen neuen Chat/Codex

**„Bitte setze den pausierten 3-Finger-Joe aus `docs/GR_THREE_FINGER_JOE_WIEDERAUFNAHME_MASTER_2026-11-11.md` fort. Historische Originalreferenz ist das Dev-Toolkit-Dokument vom 08.10.2026, funktionierender V4.11.39-Commit `1f5f5210`; aktueller V187-Android-Export belegt Phantom-Touches und Touch-only ohne Pointerdown. Implementiere nach dem dortigen schmalen High-Vertrag einen wiederverwendbaren Guard für Eye, gruppierte und ungruppierte Icons sowie betroffene Drag-Controls, vollständig getestet und neu versioniert, ohne Referenzfunktionen oder Vault zu verändern. Echte Android-Abnahme bleibt offen.“**
