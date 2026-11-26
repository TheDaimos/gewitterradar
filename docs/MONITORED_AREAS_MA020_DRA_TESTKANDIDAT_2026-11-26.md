# MA-020 – DRA-Testkandidat GewitterRadar V4.14.2 DEV

**Datum:** 26.11.2026  
**Status:** Kandidat auf Feature-Branch bereitgestellt; `MA-020=IN_PROGRESS`, DEV-Realabnahme `NOT_RUN`.  
**Repository:** `TheDaimos/gewitterradar`  
**DRA-Quelle:** **Branch** `feature/v4.14-monitored-areas` (über DRA-Projekt „GewitterRadar“ → Git-Zweige/Tags → Branch auswählen → „Git-Zweige laden“).  
**Nicht die bisher installierte Tag-Referenz `v4.14.1-dev` verwenden.**  
**Programmstand vor Dokumentation:** `e6203922fdbfe926dd3cc42c7ab6b7fc4babd22b` – die endgültige DRA-Referenz ist stets der unmittelbar vor der Vorschau verifizierte Git-Branch-HEAD.

## Eindeutige Entwicklungsidentität

| Feld | DRA/Version |
| --- | --- |
| GewitterRadar Oberfläche | **V4.14.2 DEV** |
| Git-Source `build_info.py` | **4.14.2** |
| Native HA-Integration `manifest.json` | **0.25.188** |
| Build | `V4.14.2-DEV-2026-11-26` |
| Runtime/Cache-Busting | `4142r1` |
| Module-Set | `E414-2A1` |
| DRA-Kanal | **Expliziter Feature-Branch**, keine Promotion nach `deploy/dev` |
| Auslieferung | `custom_components/gewitterradar` nach `/config/custom_components/gewitterradar` |
| Veröffentlichung | **Kein GitHub Release, kein Tag, kein FINAL** |

Die Quellen `frontend`, `dashboard/dist`, `custom_components/gewitterradar/frontend`, DRA-Provenance, `build_info.py`, `const.py`, `manifest.json`, Runtime-Inventar und SHA256-Spiegel wurden synchronisiert. Es wurden keine Änderungen am WeatherRouter und keine Produktivinstallationen durchgeführt. Der DRA-Standardzweig `deploy/dev` bleibt unverändert.

## CI vor dem Einspielen

- Auf dem **tatsächlichen Deployment-HEAD** müssen die für die Versionsidentität relevanten Shared-Frontend-, Home-Assistant-Integrations-, MA-004-, MA-020- und Asset-Retention-Prüfungen erfolgreich abschließen. Ein grüner CI-Lauf eines älteren SHAs ist kein Ersatz.
- Im Fall von `queued`, `in_progress` oder `failure`: **nicht** als abgenommen darstellen. Fehler minimal beheben, neuen exakten SHA prüfen.
- Echte HA-/DRA-/Browserprüfungen auf VM109 bleiben Betreiber-Abnahme und sind nicht durch CI allein erledigt.

## Betreiberinstallation ausschließlich nach Sichtprüfung

1. **Unbedingt** prüfen, dass DRA auf **DEV VM109** zeigt, nicht auf PROD VM101. Einen wiederherstellbaren VM-/HA-Snapshot der DEV-Instanz erstellen.
2. Im DRA-Projekt GewitterRadar explizit `feature/v4.14-monitored-areas` als Zweig wählen und **„Git-Zweige laden“** ausführen; nicht den alten `v4.14.1-dev`-Tag als Ref stehen lassen.
3. **Schreibgeschützte Vorschau** erneut berechnen. Anzeigen vergleichen: `Git-Quelle: 4.14.2`; lokal `4.14.1` (falls unverändert); exakten Quellen-Commit und Datei-Diff prüfen; keine unerklärten Dateientfernungen oder Integrations-Pfade akzeptieren.
4. Nur bei korrektem DRA-Ziel, erfolgreicher CI, passender Quelle und funktionierender Rückfallsicherung den **bewusst vom Betreiber freigegebenen** DRA-Einzelupdateweg nutzen. Dieser Schritt wird **nicht** vom Entwickleragenten ausgelöst.
5. Vollständigen HA-DEV-Neustart durchführen. Oberfläche, native Integration, Cache-Revision, DRA-Commit-/Versions-Identität und Laufzeit prüfen.
6. Die zwölf Fälle D01–D12 aus [MONITORED_AREAS_MA020_DEV_ABNAHME.md](MONITORED_AREAS_MA020_DEV_ABNAHME.md) nacheinander prüfen, negative Tests nur in isolierter Testinstanz mit ausschließlich synthetischen Einträgen ausführen. Kein produktives oder persönliches Local-To-do-Material löschen.
7. Resultate, exakten Build/SHA, DRA-Audit und anonymisierte Nachweise protokollieren; bei Abweichung **STOP**, Snapshot sichern und Fehler beheben.

**Sicherheitsgrenze:** Der Code enthält eine autorisierte Eintragsentfernung via `todo.remove_item`. Die bloße Installation führt keine automatische Leerung aus; vor einer echten Finalisierung sind Quell-/Zielnachweise und die gesonderte Admin-Bestätigung zwingend. Eine bestehende echte Liste `todo.gewitterradar_orte` ist **kein** geeigneter Testfixture – bei echten Einträgen vor D02/D08 stoppen.

**Unverändert:** VM101, WR, FINAL, protected GR references, `deploy/dev`. Kein MA-021, MA-022 oder MA-GATE-P03. `next_task=MA-020`.
