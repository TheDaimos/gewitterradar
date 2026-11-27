# GewitterRadar V4.14.19 DEV – MA-021 Responsive Havanna Consolidation

Stand: 27. November 2026  
Branch: `feature/v4.14-monitored-areas`
Status: **Entwickelt, DEV-Build synchronisieren und real abnehmen; exakte Bildreferenz-Prüfung offen.** Kein PROD-/FINAL-Release.

## Auftragsgrundlage und Referenz-Grenze

Verbindlich sind `docs/MONITORED_AREAS_V412_KONZEPT_2026-11-23.md`, `docs/MONITORED_AREAS_V414_MA002_ARCHITEKTUR.md` sowie der MA-021-Task in `docs/MONITORED_AREAS_V412_IMPLEMENTIERUNGSPLAN.md`. Dort ist das ursprüngliche Bild **`V4_11_Monitored_Area_UI_Referenz_Havanna.png`** als möglichst 1:1 zu übernehmende visuelle Referenz benannt (ursprünglich ChatGPT Library `/Gewitterradar/V4.11`). Das Bild ist in diesem Ausführungskontext nicht visuell verfügbar: eine gezielte Dateisuche sowohl in aktuellen Projektdateien als auch in der erlaubten Library ergab keinen Zugriff. Deshalb wird **keine ungeprüfte pixelgenaue Übereinstimmung behauptet**. Der Code setzt die dokumentierten Geräte-, Fenster-, Chevron-, Inhalt- und Sicherheitsverträge um; das optische 1:1-Finishing bleibt Teil der geplanten umfangreichen gemeinsamen Abnahme.

## Größerer zusammengefasster Funktionsblock

### Responsives Geräteprofil

`frontend/modules/monitored-areas/location-manager.js` exportiert die pure Hilfsfunktion `detailLayoutProfile({width,height})`:

| Gerät / Layout | Profil | Detailfenster / Anordnung |
|---|---|---|
| Smartphone 390 × 844 | `mobile` | Breite 370px, einspaltig |
| iPad Hochformat 768 × 1024 | `tablet` | Breite 736px, zweispaltig |
| iPad Querformat 1024 × 768 | `tablet` | Breite 810px, zweispaltig |
| Desktop 1440 × 900 | `desktop` | Breite 920px, zweispaltig |

Entsprechende Media-Queries mit Grenzen 680/1180px und eine zusätzliche Regel für niedrige Displays steuern tatsächliche CSS-Darstellung, inklusive Header, Datenübersicht, Zellen, Aktionen und Metallschatten. Es handelt sich um **eigenständige Wide-/Compact-Layouts**, nicht nur um eine Skalierung der früheren 430px-Karte.

### Fenster und Interaktion

- Zwei optisch abgesetzte, metallisch umrahmte Datenplatten (Koordinaten, aktiv/archiviert), hochwertiger Header mit Namen und Status-Badge.
- Darunter **initial geschlossenes** Detail-Akkordeon mit goldenem Chevron. Auf breiten Viewports zweispaltige Metadaten-Zeilen, auf kleinen Geräten einspaltig und mit begrenzter Höhe scrollbar. Die beiden Sektionen bleiben lesbar.
- Window-Drag mit Pointer-Capture über den Kopf; zusätzlich per Pfeiltasten in 16px-Schritten verschiebbar. Positionierung per `clampDetailPosition` nach Ziehen, Fenstergröße, Chevron-Umschalten und Screen-Orientation-/Visual-Viewport-Änderungen.
- Sitzungsbezogener Positionscache pro Card-Instanz, Vault-Profil und Ort (`WeakMap`); keine globale oder cross-profile Vermischung. **Keine dauerhafte Vault-Persistenz behauptet** — diese ist erst nach vertraglicher Prüfung zu integrieren.
- Listener werden beim Schließen, Profil-Reload, erneuten Öffnen und Entfernen alter Standortmanager bereinigt; eine veraltete Detailansicht darf nicht über einem frisch geladenen Profil verbleiben.
- Bereits vorhandenes originales Settings-Close-X und der Goldrahmen bleiben unverändert. Koordinatenkopie zeigt bei fehlender Clipboard-API eine ehrliche Fehlermeldung. Kartenfokus steuert **ausschließlich die Kamera**; der bestehende Referenztracker wird nicht umgeschaltet.

### Lesende Detaildaten

`frontend/modules/monitored-areas/location-port.js` enthält `getLocation(locationId)`: nur bei **serverbestätigtem `db_active`**, authentifiziert im bereits gebundenen Vault-Profil, über die existierende Backend-Operation `location_get`. Es gibt keinen Browser-Direktzugriff auf SQLite und keine Mutation/Receipt.

`frontend/modules/ui/controls.js` reicht den Detail-Reader **nur bei gültiger, aktivierter und vollständig verifizierter DB-Quelle** durch. Die HA-Benutzer- und Vault-Profilbindung wird **vor und nach** der asynchronen Anfrage überprüft. Die Antwort muss zum gleichen Standort und zu denselben Koordinaten passen, sonst bleibt die ursprüngliche read-only Ansicht erhalten.

Die Datenfelder werden ausschließlich nachweisbar aus dem bestehenden Schema gelesen: Monitoring an/aus, Pausenstatus, Recorder-Status, Erfassungsmodus, Aufzeichnungs-/Alarmradius (in km). In `migration_pending` bleiben ausschließlich bestehende Legacy-Informationen sichtbar. Kein automatischer Cutover, kein Erfassen neuer Blitzereignisse und kein Eingriff in fremde Tracker.

## Test- und Delivery-Vertrag

- Neu: `tests/test_ma021_responsive_layout.mjs` (vier Geräteauflösungen, CSS-Wide-/Compact-Regeln, Profil-/Viewport-Positionierung, Keyboard/Pointer, read-only-Prüfung).
- Neu: `tests/test_ma021_port_readonly.mjs` (serverseitiger Modus-Gate, profilgebundene Leseoperation, invalide IDs und manipulierte Antwort).
- Weiterhin `tests/test_ma021_havanna_detail.mjs` (Havanna-Panel-Basis), `tests/test_ma_location_manager.mjs`, MA-020-Saga-Tests und die bisherigen UI-/Frontend-/Cache-Regressionsprüfungen.
- Isolierter Quellparser und direkt aus GitHub-Quellen ausgeführte Funktionsprobe `detailLayoutProfile`: **PASS**, exakte Geräteprofile siehe Tabelle. Isolierter Modus-/Profil-Lese-Test via tatsächlichem `location-port.js`: **PASS**, `migration_pending` kann `location_get` nicht auslösen.
- Build: `.github/workflows/ma-v41419-dev-build-sync.yml`, danach Abgleich von `frontend/`, `custom_components/gewitterradar/frontend/` und `dashboard/dist/`. Alle Releases nur als DEV-Branch-Artefakt, DRA-Bereitstellung muss separat bestätigt werden.
- **Version:** `V4.14.19 DEV`, Runtime `41419r1`, ModuleSet `E414-19A1`, HA-Integration `0.25.205`, DRA-`BUILD_VERSION = "4.14.19"`.

## Für die gemeinsame große Betreiberabnahme

Zunächst DRA-Update auf DEV VM109 bestätigen. Anschließend Desktop (breit), iPad Hochformat und Querformat, Android Hoch-/Querformat im selben Durchgang überprüfen: Metallrahmen, Datenplatten, zweispaltige Anordnung, Bedienbarkeit des Chevrons, Drag und Pfeiltasten, Landscape-Rotation, Offscreen-Clamp, Zwischenzustände, Scrollverhalten, Copy, Kamera-Fokus und Profilwechsel. Darstellung mit dem Originalbild abgleichen und alle optischen Unterschiede **gebündelt** erfassen.

**Weiterhin offen:** exakter 1:1-Designabgleich zum nicht verfügbaren Originalbild, vollständige 19-Sprachen-Lokalisierung und dauerhafte Vault-Positionspersistenz sowie MA-022-Freigaben/Profilverwaltung. MA-020 wartet unverändert auf den gesonderten Betreiber-Abgleich der 43 To-do-/SQLite-Datensätze; keine automatische Finalisierung und keine To-do-Leerung.

## Abgeschlossener Build-Readback

- Die neue GitHub-Actions-Pipeline `.github/workflows/ma-v41419-dev-build-sync.yml` hat die Canonical-/Delivery-Spiegel tatsächlich neu gebaut und den Delivery-only-Commit in denselben Feature-Branch gepusht. Die Jobpipeline führt vor dem Commit die MA-020-, MA-021-, Frontend-/Registrierungs- und Cache-Regressionstests aus. Eine gesonderte Run-ID ist aus dem zugänglichen Connector nicht auslesbar; der vollständige Spiegelcommit ist der überprüfbare Buildnachweis.
- Tatsächlicher GitHub-Readback: **11 von 11** repräsentative Dateien sind in `frontend/`, `custom_components/gewitterradar/frontend/` und `dashboard/dist/` jeweils byte-identisch nach Git-Blob-SHA (Version, Loader, Panel, Runtime-/Modul-Manifest, MA-Index, Manager, Read-Adapter, Migrationsassistent, Controls, Vault-View).
- `SHA256SUMS_FRONTEND.txt`: **acht** SHA256-Einträge für die vier MA-Moduldateien in den beiden Delivery-Mirrors.
- Metadaten stimmen überein: Produkt **4.14.19**, Runtime **41419r1**, HA-Integration **0.25.205**, DRA-Build **4.14.19**.
- Die reine Geometrie- und Security-Funktionsprobe aus den tatsächlich gelesenen Quellmodulen sowie **31/31 responsive Source-Assertions** verliefen erfolgreich. Die serverbestätigte `migration_pending`-Sperre des Port-Adapters wurde separat ausgeführt: keine `location_get`-Anfrage vor `db_active`.
- **Nicht als erledigt behauptet:** Live-DRA-Update auf VM109, Browser/iPad-Rendering, verbindlicher Bild-zu-Bild-Vergleich mit der unerreichbaren ursprünglichen Havanna-Referenz und dauerhafte Vault-Persistenz der Fensterposition. Diese Punkte gehören in die große gemeinsame Betreiberabnahme.
