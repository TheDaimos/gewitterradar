# GewitterRadar V4.14.18 DEV — MA-021 Havanna-Detailfenster (Basis)

Datum: 27. November 2026  
Branch: `feature/v4.14-monitored-areas`  
Status: **MA-021 Teilpaket implementiert und DEV-Build aktiviert; Betreiber-Sichttest offen.** MA-020 bleibt weiterhin im bisherigen Zustand ohne automatische Finalisierung.

## Verbindlicher Auftrag

Gemäß `docs/MONITORED_AREAS_V412_IMPLEMENTIERUNGSPLAN.md` bedeutet **MA-021 das Havanna-Detailfenster** (frei bewegliches responsives Fenster mit initial geschlossenem Chevron und mobilem Akkordeon). **MA-022 ist die Profil-/Freigabe-UI**. Die Tracker-/Blitzortung-Konfiguration ist eine spätere separate Erweiterung und wird nicht irrtümlich mit MA-022 verwechselt.

Die vorhandene Standortliste und Ortssuche sind im DEV-Branch bereits umgesetzt. Die bisherige `Details`-Aktion zeigte nur einen Textabschnitt in der Liste. Für MA-021 wird dieser Abschnitt durch ein eigenständiges, auf der Standortverwaltung liegendes Detailfenster ersetzt.

## Implementierung

In `frontend/modules/monitored-areas/location-manager.js`:

1. Ein eigenständiges, **nicht modales** Detailfenster `.gr-ma-detail`, mobil 20px kleiner als der Viewport, mit dem bereits akzeptierten goldenen GR-Metallrahmen, Schließen-X aus dem echten Settings-Menü und goldfarbenem Chevron.
2. Verschiebbarkeit über den Titelkopf mittels Pointer-Capture; der Dialog ist bewusst **nicht frei skalierbar**. Die reine Hilfsfunktion `clampDetailPosition()` begrenzt alle Positionsänderungen und Resizes auf den sichtbaren Viewport; kleine Smartphones werden berücksichtigt.
3. Das Fenster nutzt ein **anfangs geschlossenes `<details>`-Akkordeon**. Nach Öffnen zeigt es Name, Koordinaten, aktiv/archiviert, Herkunft und ggf. Revision.
4. Über eine explizite Schaltfläche lassen sich Koordinaten über die Browser-Clipboard-API kopieren. Ist die API etwa in unsicheren HTTP-Kontexten nicht verfügbar, folgt ein Hinweis statt eines falschen Erfolgs. Kamerafokus ist optional und **ändert niemals den Referenztracker**.
5. Text ausschließlich via `textContent`, kein HTML-Injection-Pfad für importierte Ortsnamen.
6. Das Detailfenster ist **read-only**, nutzt bereits vorhandene, profilgebunden geladene Ortsdaten und führt keine HA-WebSocket- oder Local-To-do-Mutationen aus. Während `migration_pending` darf die UI angezeigt werden, ohne SQLite als aktive Quelle auszugeben.
7. Keine globalen Settings- oder Leaflet-/Legend-Hub-Änderungen. Resize-Listener werden beim Schließen, Austauschen und Escape entfernt; keine aufbewahrten globalen Positionswerte.

## Noch nicht Teil des MA-021-Basisblocks

- Profilbezogene Vault-Persistenz der Fensterposition und erweitertes Mehrfenster-Layout.
- Vollständige 19-sprachige Detailfenster-Lokalisierung (DE/EN als sichere Fallbacks vorhanden; bestehende 19 Sprach-Referenzmodule wurden nicht umgebaut).
- Persistente Radius-, Farben- und Überwachungskonfiguration, Recorder-Datenfelder sowie Freigabe-UI: gesonderte spätere MA-Module, nur mit Backend-Revision/ACK.
- Visueller Vergleich mit der vom Betreiber bezeichneten vollständigen Havanna-Designreferenz auf VM109.

Diese Punkte bleiben offen und werden nicht als bereits abgeschlossen ausgegeben.

## Versionsidentität und Tests

- `V4.14.18 DEV`, Runtime `41418r1`, ModuleSet `E414-18A1`, HA-Integration `0.25.204`, DRA-`BUILD_VERSION = "4.14.18"`.
- Automatische DEV-CI: `.github/workflows/ma-v41418-dev-build-sync.yml`, Build nur auf dem isolierten Feature-Branch und nur Delivery-Mirror-Synchronisierung nach erfolgreichen Tests. Die vorherige V4.14.17-Pipeline wurde auf manuelle historische Ausführung gestellt.
- `tests/test_ma021_havanna_detail.mjs`: gültige/ungültige WGS84-Koordinaten, dedizierte responsive Positionierung, initial geschlossenes Akkordeon, drag/clamp/cleanup und read-only-Sicherheitsverträge.
- Zusätzlich bestehende `tests/test_ma_location_manager.mjs`, MA-020-Migration/Finalisierung/Saga und Frontend-/Modul-/Cache-Regressionen in der Workflow-Datei.

## Betreiber-Sichttest nach bestätigter Installation auf DEV VM109

1. **Standorte verwalten** öffnen und bei einem Ort **Details** wählen. Das separate schimmernde Detailfenster muss sichtbar werden, ohne die Listenansicht zu löschen.
2. Titelkopf mit Maus beziehungsweise Touch verschieben, insbesondere zum Bildschirmrand; Fenster darf nicht verschwinden. Danach Gerät drehen beziehungsweise Browserfenster verkleinern.
3. Gold-Chevron anklicken: Informationen anfangs geschlossen, danach aufgeklappt. **Koordinaten kopieren** prüfen.
4. Schließen per goldenen X und Esc testen und das Fenster mehrfach nacheinander öffnen. Die Standortliste bleibt erreichbar; Änderungen an SQLite oder Local To-do dürfen nicht ausgelöst werden.
5. Für den ersten Test weiterhin **keinen Import und keine Finalisierung** durchführen.

**T2/DEV-/DRA-Abnahme:** noch nicht bestätigt. Kein PROD- oder öffentliches FINAL-Release.
