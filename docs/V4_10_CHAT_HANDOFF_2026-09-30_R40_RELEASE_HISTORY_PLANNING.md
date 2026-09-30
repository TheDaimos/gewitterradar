# Gewitterradar V4.10 – R40 Versionsverlauf: geplante V4.11-Ausbaustufe

Stand: 2026-09-30

## Auftrag
Der Nutzer hat genau sieben Punkte für den Abschnitt „Geplante nächste Ausbaustufe“ im sichtbaren Versionsverlauf freigegeben. **Nur dieser Planungsabschnitt** wurde in den Sprachfeldern Deutsch und Englisch erweitert. Alle historischen Einträge und insbesondere der V4.10-Rückblick bleiben inhaltlich unverändert; die historischen Angaben „28 Medaillon-Designs und 18 Pfeilvarianten“ sind bewusst korrekte Release-History-Angaben und dürfen nicht zu mengenfreien Bedienhilfetexten umformuliert werden.

## Geplanter Inhalt
1. Integration zusätzlicher Wetterdienste, Wetterereignisse und Gefahreninformationen durch WeatherRouter.
2. Einführung eines zentralen Systemstatus mit zustandsabhängigen Hinweisen, Fehlermeldungen und konkreten Lösungsvorschlägen.
3. Erweiterte Blitzortung- und Tracker-Diagnose zur Erkennung von Kopplungs-, Datenquellen- und Erfassungsproblemen.
4. Ausbau von „Hilfe & Hinweise“ um eine thematisch strukturierte Fehlerbehebung.
5. Verbesserte Prüfung und Fehlererkennung für gespeicherte Standorte und die zugehörige lokale To-do-Liste.
6. Einführung überwachter Standorte (Monitored Areas) mit eigenständiger Hintergrundüberwachung, optionaler Ereignisprotokollierung, Löschschutz sowie CSV- und PDF-Export.
7. Vereinheitlichung der mehrsprachigen Status-, Warn- und Fehlermeldungen über sämtliche Funktionen hinweg.

## Technische Ausführung
- Ausgangsbasis: R39, technischer DRA-Kandidat `96c05aee98ec8cde89e6c3cf1934f1b83740b5dd`. Entwicklungszweig mit R39-Abnahmedokumentation vor R40: `bdb7540f6407f6325144f0ee0648979ba8710d6b`.
- Build `V4.10.02-MODULAR-DEV-R40-2026-09-30`, Feature-Cache `41002r40`, Laufzeit-Basis weiterhin `41002r13`, Modulsatz `D40A-5E9B`; `ui.skeleton` 1.1.15, `core.manifest` 1.2.46.
- `frontend/modules/ui/skeleton.js`: je sieben Punkte im deutschen und englischen Planungsabschnitt des Versionsverlaufs. Historische V4.10-Mengenangaben bleiben unverändert.
- Quellfassung sowie native Integration/Dashboard, Manifest und Laufzeitmanifest, Versionsvertrag, Assetindex und SHA256-Index synchron. `scripts/verify-frontend.mjs` prüft ausdrücklich die neuen deutschen und englischen Planungsformulierungen sowie den unveränderten historischen V4.10-Text.
- Keine Veränderung am Kompass-/Medaillonlayout, an den Instrumentassets, der Kalibrierung, der Blitzverarbeitung oder den R39-Modulcache-Korrekturen.

## Prüfung / Freigabe
- Technischen R40-Commit zuerst an allen fünf zentralen CI-Pfaden prüfen: Shared Frontend mit beiden Browserauslieferungen, Integration, Diagnostic contract, Source archive contract, Hi-Res asset retention.
- `deploy/dev` nur nach erfolgreicher CI-Prüfung, ohne Force und auf exakt den technischen Code-Commit setzen; spätere reine Abnahmedokumentation nicht auf DRA ausliefern.
- **R39-Realabnahme**: Nutzer hat die Moduldiagnose inzwischen ausdrücklich als fehlerfrei bestätigt. Damit sind sämtliche sechs vereinbarten V4.10-Realtests vom Nutzer bestätigt. R40 ist noch keine FINAL-Freigabe: Planungsfeld im Versionsverlauf vor Abschlussprüfung auf Deutsch und Englisch sichten.
- Vor V4.10 FINAL den technischen Kandidaten einfrieren. Für einen parallelen Folgechat einen **separaten V4.11-Entwicklungszweig** von genau dieser geprüften Basis verwenden; V4.10-Finalisierung und V4.11 nicht gleichzeitig auf denselben Entwicklungs- oder DRA-Zweig schreiben lassen. Notwendige V4.10-Nachkorrekturen bei Bedarf gezielt übernehmen. `main` unverändert lassen; kein Merge, Release oder Tag ohne ausdrückliches Go.

## Erinnerungsschutz
- Frühzeitig warnen, falls der Chatkontext knapp wird; alle verbindlichen Entscheidungen und Abnahmen rechtzeitig in Git sichern.
