# Gewitterradar – verbindliche Chat-Übergabe: R40, V4.10-Finalisierung und V4.11

Stand: 2026-09-30. Zweck: neuen Chat ohne verlorene Abnahmen und ohne erneute umfangreiche Rückfragen fortführen.

## 1. Einstieg / Schutzregeln
1. Zuerst den kanonischen Daimos-Bootstrap `TheDaimos/project-defaults/START_HERE.md` und `PROJECT_DEFAULTS.md` lesen; außerdem `docs/RELEASE_PROCESS.md`, `docs/GOLDEN_MASTER_POLICY.md`, `docs/ASSET_RETENTION_POLICY.md`, `docs/DIAGNOSTIC_PROTECTION_V4_07_56.md`.
2. Dieses Dokument ist die neueste operative Übergabe. Zur technischen Vertiefung siehe `docs/V4_10_CHAT_HANDOFF_2026-09-30_R39_MODULE_STATUS_CACHE.md` und `docs/V4_10_CHAT_HANDOFF_2026-09-30_R40_RELEASE_HISTORY_PLANNING.md`.
3. Keine Veröffentlichung, kein Merge nach `main`, kein Release, Tag, FINAL-Freeze oder Beginn der V4.11-Implementierung ohne entsprechende ausdrückliche Nutzerfreigabe. Dokumentationspflege ist nicht automatisch eine Release-Freigabe.
4. DRA ist zwingender Bereitstellungsweg. Die native Integration und die Dashboard-Auslieferung aus derselben kanonischen Quelle synchron/prüfsummenkonform halten. Keine unnötigen Umbauten bei Abschlusskorrekturen. Keine geschützten Hi-Res-Originale löschen.
5. Nutzer im Deutschen per Du ansprechen, nicht beim Vornamen nennen und nicht über ein Team sprechen. Kein unnötiges Denglisch. Frühzeitig vor knappem Chatkontext warnen, ohne erfundene Prozentzahl, und wesentliche Ergebnisse in Git sichern.

## 2. Git, Laufzeit und DRA – verifizierter Ausgangsstand
Repository: `TheDaimos/gewitterradar`.
- Technischer letzter R40-Kandidat auf `deploy/dev`: `bcf30fe2dc1b6b56625edf209b2373b956fb7fd4`. Dieser Commit ist der **Code-Kandidat** für DRA, enthält die vereinbarte Erweiterung der Release-History-Planung und eine reine Browser-Testkorrektur. Er wurde nach erfolgreichem CI ohne Force auf `deploy/dev` gesetzt und die Referenz geprüft.
- Produkt/Build: noch **DEV**, `V4.10.02-MODULAR-DEV-R40-2026-09-30`; sichtbare Kopf-Plakette noch `V4.10.02`; Feature-Cache `41002r40`; eingefrorene Runtime-Basis `41002r13`; Modulsatz-ID `D40A-5E9B`; `core.manifest` 1.2.46, `ui.skeleton` 1.1.15.
- Entwicklungszweig unmittelbar vor dieser Übergabedatei: `feature/v4.10.02-modularization` HEAD `f0c0087b4f30c6576ae2cce9b2e850fbae3cd408`; nach R40 nur dokumentarischer V4.11-Versionsregel-Commit. Entwicklungszweig und DRA-Zweig dürfen deshalb unterschiedliche HEADs haben. Die jeweils aktuelle Referenz zu Beginn der neuen Sitzung nochmals abfragen.
- `main` bei letzter Prüfung: `17f8e7be5f41d7a4f27bf2343f3c462be8a6e28c` (öffentliche V4.09-Basis); **unverändert**, kein V4.10-Merge, Release oder Tag.
- Benutzer meldete nach der R40-DRA-Umschaltung zunächst „Update steht noch nicht zur Verfügung“, dann ausdrücklich „Ist jetzt verfügbar.“ Damit ist **Sichtbarkeit in DRA** bestätigt. Installation von R40 und explizite Real-Sichtabnahme der neuen Planungssektion wurden im Chat noch **nicht** bestätigt; keinesfalls behaupten, diese seien erledigt.
- Technische zentrale R40-Prüfpfade alle SUCCESS für den exakten technischen Commit: Shared Frontend Runs `36709178850`, `36709173150` und `36709666918`; Integration `36709178862`, `36709173109` und `36709666949`; Diagnostic contract `36709178853`; Source archive contract `36709178867`; Hi-Res asset retention `36709178830` und `36709173211`. Die Frontend-Prüfungen umfassen beide Auslieferungsformen und Browserprüfungen.
- Die erste R40-CI-Fassung scheiterte ausschließlich an einer im R39-Browser-Test fest codierten Release-ID `D39A-5E9B` nach planmäßigem Versionswechsel zu `D40A-5E9B`. Der finale technische Commit `bcf30fe...` bezieht diese ID stattdessen aus dem aktuellen Laufzeitmanifest. Produktivfunktionen wurden dafür nicht verändert.

## 3. Reale V4.10-Abnahmen (Nutzer bestätigt; NICHT ohne neuen Befund wiederholen)
- R37-Kompasslayout vom Nutzer geräteübergreifend als einheitlich bestätigt (Desktop, Android, iPads): Kompassinstrument oben, „Letzter Treffer“ und „Kompass“ darunter, danach Gradzahl/Himmelsrichtung, Legende, untere Karten. Frühere Schalter-über-dem-Kompass-Variante verworfen.
- R38: Hilfe „Kompass, Medaillon & Pfeile“ besteht aus genau **vier** Einträgen in 19 Sprach-/Dialektvarianten: „Kompass auswählen“, „Medaillon & Pfeil auswählen“, „Vollbilddarstellung“, „Aura-Effekte“. Bedienungshilfetexte enthalten keine festen Designmengen. Leaflet-Plus/Minus-Mouse-over und zugängliche Beschriftungen werden lokalisiert, bei Kartenstart und Sprachwechsel synchronisiert.
- Nutzer hat die sechs vereinbarten V4.10-Prüfpunkte ausdrücklich bestätigt:
  1. „Module & Versionen“ nach notwendigem Neustart als fehlerfrei gemeldet (R39, zuvor 23/23, aber Cache-Abweichung `location.radii-map` 1.0.2 statt 1.0.3; Nutzer: „Übrigens sind die Module nun fehlerfrei.“); keine zusätzliche JSON-Gerätediagnose behaupten.
  2. Goldenes Hilfe-Icon, Reihenfolge und vier mengenfreie Hilfeeinträge.
  3. Sprach-/Mouse-over-Texte inkl. Kartenzoom +/− und separatem Fenster.
  4. Aura/Kompass-Regression: Design wählen → Aura AUS, Design bleibt → anderes Design bei Aura AUS → Aura AN, neues Design bleibt.
  5. Medaillon-/Pfeil-Auswahl unabhängig und persistent.
  6. Größenwahl für Vollbild und separates Kartenfenster ohne Beeinträchtigung der normalen Ansicht.
- R39 reparierte zwei tatsächliche Modulversions-/Diagnoseursachen: geänderte Module `location.radii-map` und `diagnostics.module-view` mit Feature-Cache importieren; berechneten Versions-Fingerabdruck nicht mehr mit freier Modulsatz-Release-ID verwechseln. R39 vom Nutzer real abgenommen, R40 führte keine Änderungen an diesen Funktionen durch.
- Die **separate Sichtabnahme von R40-Release-History-Planung** steht noch aus. Hierzu nur kurz bitten, die deutsche und englische Planungssektion im installierten R40 zu prüfen, wenn der Nutzer dazu bereit ist.

## 4. R40 – freigegebene reine Erweiterung im sichtbaren Versionsverlauf
Auf Wunsch des Nutzers **ausschließlich** die Sektion oberhalb der öffentlichen Historie „Zukünftige Entwicklungen · Geplant“ / „Future Developments · Planned“ in `frontend/modules/ui/skeleton.js` von einem Satz auf die folgenden sieben V4.11-Vorhaben ergänzt, beide Sprachen:
1. Zusätzliche Wetterdienste, Wetterereignisse und Gefahreninformationen durch WeatherRouter.
2. Zentraler Systemstatus mit zustandsabhängigen Hinweisen, Fehlern und Lösungsvorschlägen.
3. Erweiterte Blitzortung-/Tracker-Diagnose für Kopplung, Datenquellen und Erfassungsprobleme.
4. Thematisch strukturierte Fehlerbehebung unter „Hilfe & Hinweise“.
5. Verbesserte Prüfung von gespeicherten Standorten und lokaler To-do-Liste.
6. Monitored Areas mit eigener Hintergrundüberwachung, optionaler Protokollierung, Löschschutz und CSV-/PDF-Export.
7. Mehrsprachige Status-, Warn- und Fehlermeldungen über alle Funktionen.
Verbindlicher Nutzerwunsch: Der **historische V4.10-Release-Rückblick** mit „28 Medaillon-Designs und 18 Pfeilvarianten“ bleibt mit Mengenangaben erhalten. Das ist eine historische Aussage zum Umfang eines Releases, keine sich dynamisch ändernde Bedienhilfe. Historische Release Notes nicht deshalb „mengenfrei“ umschreiben. Nutzer wies ausdrücklich darauf hin, dass eine reine Textergänzung nicht zu einem unnötig umfangreichen Umbau aufgeblasen werden soll.

## 5. Wichtige NEUE Produktentscheidung: sichtbare Versionsnummer ab V4.11
Der Nutzer bemängelt, dass die kleine goldene Hauptfenster-Plakette während vieler Rxx-DRA-Updates unverändert `V4.10.02` zeigte und so die installierte Iteration nicht erkennbar war. Ursache bestätigt:
`frontend/gewitterradar.js` verwendet `CARD_VERSION='4.10.02'`, `CARD_DISPLAY_VERSION='4.10.02'`, aber `GEWITTERRADAR_BUILD='V4.10.02-MODULAR-DEV-R40-2026-09-30'`; die Plakette in `frontend/modules/ui/skeleton.js` bindet `V${CARD_DISPLAY_VERSION}`, nicht die R40-Buildkennung.
- **Öffentliches V4.10 FINAL** soll in der Plakette **V4.10** zeigen; dies ist als Ziel bestätigt, jedoch noch **nicht umgesetzt/final veröffentlicht**.
- Für **V4.11** muss jede neue DRA-DEV-Auslieferung die kleine sichtbare Nummer eindeutig weiterschalten, z. B. `V4.11.01 DEV` → `V4.11.02 DEV` (konkrete Darstellung zum Start festlegen). Über, Einstellungen, Release-History-Kopf, Diagnose, Manifest, kanonische Buildkennung und DRA dürfen nicht auseinanderlaufen. Kompakte Plakette; präziser Build/Commit in Detailansicht. Maschineller Versions-Gleichlauf einschließlich beider Auslieferungsformen, kein vorgetäuschter öffentlicher Release.
- Dieser neue Bereich **8** ist bereits in `docs/V4_11_TODO.md` gespeichert; vorheriger Dokumentations-Commit `f0c0087b4f30c6576ae2cce9b2e850fbae3cd408`.
- Diese Regel ist ein V4.11-Pflichtpunkt. Für V4.10-FINAL notwendige öffentliche Versionsnormalisierung gehört ausschließlich in den freizugebenden FINAL-Abschluss, nicht als ungefragter neuer DEV-Funktionsumbau.

## 6. V4.11 – acht geplante Bereiche, noch keine Implementierungsfreigabe
Kanonische Liste `docs/V4_11_TODO.md`, mit Detailanforderungen und Abgrenzung:
1. WeatherRouter-Integration, Anbieter-/Capability-/Abdeckung-/Ausfalldaten; Blitzortung-Livedaten davon sauber getrennt; Quellen/Attribution/Verfügbarkeit sichtbar.
2. Zentraler Systemstatus am Zahnrad: kein Symbol ohne Befund, orange Warnung für Einschränkung, rot für echten Fehler, Anzahl, priorisiert, eigenes Pop-up „Systemstatus & Hinweise“ mit konkreten Maßnahmen.
3. Blitzortung-/Tracker-Diagnose inkl. nicht gekoppeltem Tracker, Radiusprüfung, keine Aktivität ≠ Fehler, dynamische Sensorzuordnung bei mehreren Einträgen.
4. „Hilfe & Hinweise“ mit thematisch strukturierten Fehlerbildern, direkten Links aus Statusmeldungen.
5. Standorte & Speichern: Existenz/Verfügbarkeit der lokalen To-do-Liste prüfen, eindeutige kontextuelle Warnungen und automatische Rücknahme.
6. Überwachte Orte (Monitored Areas): gespeicherter Favorit erst bei Aktivierung überwacht; eigener permanenter Standorttracker, mehrere Orte parallel, Überwachung und Protokollierung unabhängig; Verarbeitung in nativer HA-Integration auch bei geschlossenem Frontend; bei aktivem Log Löschschutz, erst nach Deaktivierung löschbar; Protokoll bleibt; CSV/PDF, Filter, ausdrücklich bestätigtes Zurücksetzen ohne Löschen des Ortes/Trackers; sparsame Ressourcen, MQTT/Deduplizierung/Überlappung prüfen. Verbindliche UI-Vorlage `/Gewitterradar/V4.11/V4_11_Monitored_Area_UI_Referenz_Havanna.png` in ChatGPT Library, möglichst 1:1.
7. Konsistente mehrsprachige Fehler-/Status-/Warntexte: Quelle benennen, sinnvoller Lösungsweg, keine eigenmächtige Bearbeitung fremder HA-ConfigEntries oder `.storage`.
8. Durchgängige, eindeutig fortgeschriebene **sichtbare** Versionskennung bei jeder DEV-Bereitstellung (siehe Abschnitt 5).
Weitere Roadmap-Ideen werden nicht automatisch Teil von V4.11; `docs/ROADMAP.md` getrennt lesen.

## 7. Nächste Schritte im Folgechat – V4.10 FINAL
1. Bootstrap, Defaults und diese Übergabe lesen; tatsächliche Branch-HEADs und CI-Kandidat bestätigen. Behandle `deploy/dev` als technischen R40-Stand und den Entwicklungszweig als Dokumentationsfortsetzung, nicht umgekehrt.
2. Wenn noch nicht vom Nutzer erledigt: kurze reale Sichtprüfung des installierten R40: sieben geplante Punkte in Release History (DE/EN), historischer V4.10-Text mit festen Mengen unverändert. Nutzer erst nach seinem tatsächlichen Feedback als R40-sichtabgenommen behandeln.
3. Bei ausdrücklichem Finalisierungs-Go einen genauen V4.10-FINAL-Plan nach `docs/RELEASE_PROCESS.md` erstellen: öffentliche Anzeige **V4.10** (Plakette/Welcome/Settings/History), Monatskennung `YYYY/MM`, Build-/Modul-/Laufzeit-Versionen, beide Lieferformen und Prüfsummen, Changelog/HISTORY/MILESTONES/Release Notes/README, HACS-/Integrationsevidenz und volle Release-Gates. Die V4.10-Funktionalität nicht unnötig erweitern.
4. Vor Veränderung von `main` PRE-MERGE-Snapshot des exakten alten `main` samt ZIP, Git-Bundle, SHA256, verifizieren und sichern. Danach nur mit ausdrücklicher Freigabe kontrolliert promoten. Vollständige CI/Browser-/HA-/Schutzprüfungen auf **neuem main**, danach Golden Master vom exakten finalen Commit, Git-Bundle, Inventar/Prüfsummen, Tag `v4.10` auf denselben Commit, erst dann GitHub/HACS-Release nach Freigabe. Nicht voreilig Golden Master eines bloßen Kandidaten nennen.
5. Nach eingefrorenem geprüften technischen Abschlussstand kann parallel in **separatem Folgechat und eigenem, klar benanntem V4.11-Feature-Zweig** gearbeitet werden. Beide Chats dürfen nicht auf denselben Feature-/DRA-Zweig schreiben; notwendige nachträgliche V4.10-Fixes bewusst nach V4.11 übernehmen. Kein unnötiger Wildwuchs an Backup-/Freeze-Branches; Branch-Lebensdauer gemäß Defaults.
6. Berichte knapp, transparent und bei tatsächlichen Schritten; nicht allein „Git-Ref geändert“ mit „in DRA sichtbar“ oder „auf Gerät installiert“ verwechseln. Sichtbarkeit in DRA wurde für R40 im Chat bestätigt, nicht dessen anschließende Installation.

## 8. Versions-/Freigabestatus im Moment dieser Übergabe
- Technisch R40 grün und DRA-Ref bestätigt.
- Sechs vereinbarte V4.10-Realtests bestätigt; separate R40-Versionsverlauf-Sichtprüfung nach letztem Stand offen.
- V4.10 FINAL **noch nicht** ausdrücklich freigegeben, noch nicht öffentlich veröffentlicht.
- V4.11 To-do erweitert, aber keine Featureimplementierung oder V4.11-Zweig in diesem Chat freigegeben.
- Der Nutzer möchte im Folgechat zuerst R40/Release Notes prüfen und dann bei Zufriedenheit finalisieren. Keine breite Wiederholung der bereits abgenommenen Fälle.
