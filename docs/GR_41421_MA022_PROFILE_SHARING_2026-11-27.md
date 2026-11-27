# GewitterRadar V4.14.21 DEV – MA-022 Profil- und Freigabeoberfläche

Stand: 27. November 2026  
Branch: `feature/v4.14-monitored-areas`
Status: **MA-022 Quellimplementierung abgeschlossen; DEV-Workflow und Tests verankert. Build-Readback und HA-DEV-T2-Abnahme separat nachweisen.**

## Verbindlicher Auftrag

Nach `docs/MONITORED_AREAS_V412_IMPLEMENTIERUNGSPLAN.md` umfasst **MA-022**: *Mehrfachauswahl, Verknüpfen/Freigeben/Übertragen, direkte Speicherung und Fehlerfeedback*. MA-021 bezeichnet das Havanna-Detailfenster. MA-020 (Local-To-do/SQLite-Finalisierung) ist weiterhin nicht durch Betreiber freigegeben.

## Implementiert

### 1. Neue eigenständige Premium-UI

`frontend/modules/monitored-areas/profile-sharing.js`: Goldmetall-Rahmen und originales Settings-Close-WebP, fester Titel/Footer mit unabhängig scrollbarerer Inhaltsebene, zweispaltiges Desktop-/iPad-Layout und einspaltige Mobile-Darstellung.

Der neue Eintrag **„Profile & Freigaben“** befindet sich in der Toolbar von **„Standorte verwalten“** (`location-manager.js`) und ist sichtbar, jedoch bis zur serverbestätigten SQLite-Finalisierung **deaktiviert**.

- Aktive und archivierte Profil-Standorte werden angezeigt; Mehrfachauswahl, Teilstringsuche, „Sichtbare auswählen“ und „Auswahl aufheben“ sind möglich.
- Benutzer und Ziel-Vault-Profil werden explizit gewählt. Für das eigene HA-Konto können bestehende eigene Vault-Profile im Dropdown ausgewählt werden. Fremde Profilnamen werden nicht offengelegt; dafür werden die zugehörigen Benutzer-/Profil-IDs benötigt, die serverseitig überprüft werden.
- **Freigeben** erstellt zusätzliche Links zu den ausgewählten Standorten; **Übertragen** entfernt nach bestätigter Übertragung den bisherigen Profil-Link. Beide Aktionen verlangen eine gesonderte zusammenfassende Bestätigung mit Ziel und Standorten. Es gibt **keine** Aktion zum Entfernen der letzten Verknüpfung in dieser Oberfläche.
- Im Dialog können Linkanzahl und eigene Link-ID eingesehen werden, ohne fremde Profil-IDs offenzulegen.
- Persönliche Benachrichtigungsvorgaben pro Profil-Link können gelesen und mit Revision/ACK gespeichert werden. Die DEV-UI erklärt ausdrücklich, dass **der Benachrichtigungsversand noch nicht aktiv** ist.
- Bei Batch-Aktionen wird jeder Datensatz separat mit eigener UUID4 und erwarteter Revision bestätigt; **keine stillen oder automatischen Wiederholungen**. Teilfehler und bereits erfolgreiche Freigaben werden getrennt angezeigt. Keine voreilige Erfolgsmeldung.
- Geprüfter HA-Benutzer und aktive Vault-Profil-ID werden in `frontend/modules/ui/controls.js` **vor und nach** jedem API-Aufruf erneut kontrolliert.

### 2. Bestehende Backend-Rechte wiederverwenden, ergänzen

`custom_components/gewitterradar/monitored_areas/api.py` hatte bereits die atomaren `links_share`, `links_transfer`, `links_list` und `preferences_update`-Operationen mit Zielprofil-/HA-Benutzerprüfung, ACL, Revisionskontrolle und idempotenten Receipts.

Ergänzt:
- `preferences_get`: **ausschließlich** Einstellungen der aktuellen authentifizierten HA-Benutzer- und Vault-Profilverknüpfung; keine Enumeration von anderen Profilen.
- Backend-Sperre: `links_share`, `links_transfer`, `preferences_update` **vor bestätigtem `db_active` gesperrt**, wenn der produktive MA-020-Finalisierer konfiguriert ist. Ein bloßes Frontend-Flag reicht nicht.
- Identisches Quell-/Zielprofil wird mit `target_is_source` verweigert; UI prüft diesen Fall ebenfalls.
- `frontend/modules/monitored-areas/location-port.js` ergänzt `listLinks`, `getPreferences`, `updatePreferences`, `shareLocation` mit strikten UUID-, Revision-, Zielprofil-, DB-Mode- und Antwortverträgen. Direkte SQLite- oder Local-To-do-Aufrufe aus dem Browser existieren nicht.

### 3. Tests

- `tests/test_ma022_profile_sharing.mjs`: Multi-Selection-/Filtermodell, Zielvalidierung, Zustimmungs-/Fehler-/Datenschutzverträge, keine To-do-/Löschpfade. Aus aktuell gelesenen Repositorydateien isoliert ausgeführt: **25/25 PASS**.
- `tests/test_ma022_port.mjs`: selbstständiger WebSocket-Porttest einschließlich `migration_pending`-Schreibsperre, Auth-Profil, UUID und erwarteter Revision. Aus aktuell gelesener Quelle isoliert ausgeführt: **23/23 PASS**.
- `scripts/test-ma-022-profiles.py`: SQLite-Integrationstests mit echten Versionstabellen und drei simulierten HA-Benutzern: Share/Transfer, Cross-Profil-Vertraulichkeit, persönliche Preferences, Revisionsfehler, Zielprofilvalidierung, Request-Receipt-Idempotenz.
- `scripts/test-ma-020-finalization.py`: Regression: bei noch nicht finalisierter SQLite-Datenmigration sind sämtliche MA-022-Mutationen serverseitig gesperrt; alte To-do-Liste bleibt unangetastet.
- CI: `.github/workflows/ma-v41421-dev-build-sync.yml`, danach Quell-/Installationsspiegel-/SHA-Vergleich. Bisherige V4.14.20-Pipeline historisch auf `workflow_dispatch` gestellt.

## Release-Identität und Abnahme

`V4.14.21 DEV`, Runtime `41421r1`, ModuleSet `E414-21A1`, HA-Integration `0.25.207`, DRA-`BUILD_VERSION = "4.14.21"`. Ausschließlich isolierter Feature-Branch, kein öffentlicher DEV-Release.

**Abnahmeschritte auf DEV VM109 nach DRA-Update und HA-Neustart (neue WebSocket-Operation):**
1. **MA-020 noch nicht finalisiert:** „Profile & Freigaben“ muss im Fenster „Standorte verwalten“ sichtbar, aber deaktiviert sein. Keine Standort-/Profilfreigabe darf stattfinden.
2. **Nach ausdrücklich autorisiertem MA-020-Cutover**: Aktive und archivierte Standorte prüfen, zwei Teststandorte auswählen, nach Teilstring filtern und Auswahl erhalten.
3. Mit zwei kontrollierten HA-Testbenutzern/Vault-Profilen einen Standort freigeben, Linkzähler nach ACK prüfen. Keine Fremdprofile auflisten.
4. Eine Übertragung bewusst bestätigen und den Zugriffsverlust im Quellprofil sowie den Empfang im Zielprofil prüfen; andere Freigaben bleiben erhalten.
5. Eigene Profilpräferenzen laden/ändern/speichern, Revision/ACK und Fehlerfall kontrollieren. Kein Benachrichtigungsversand wird vorweggenommen.
6. Ungültige Profil-ID, bereits vorhandener Link, Ziel=Quelle und veraltete Revision sollen ohne Änderung scheitern.
7. Mobile, iPad Hoch/Quer, Desktop: Goldrahmen, feststehender Header/Footer, bedienbare Liste und Close. Keine Local-To-do-Leerung.

**T2-Gate P03:** Ohne Live-Test, autorisierte SQLite-Finalisierung und echte HA-Testprofile kann MA-022 **nicht** als vom Betreiber abgenommen bezeichnet werden. MA-020 bleibt separat IN_PROGRESS. Kein PROD/FINAL.

## V4.15

Der vom Betreiber gewünschte spätere **Unified Settings & Profiles (SQLite)**-Umbau ist eigenständig für **V4.15** unter [GR_V415_TODO_UNIFIED_SETTINGS_PROFILES.md](GR_V415_TODO_UNIFIED_SETTINGS_PROFILES.md) vorgemerkt. Der bestehende SettingsVault wird in V4.14 nicht ersetzt.
