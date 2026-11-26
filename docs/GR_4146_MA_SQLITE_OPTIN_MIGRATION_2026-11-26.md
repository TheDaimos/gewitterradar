# GewitterRadar V4.14.6 DEV — kontrollierter SQLite-Opt-in und MA-020-Migrationszugang

Datum: 26.11.2026
Branch: `feature/v4.14-monitored-areas`
Status: DEV; VM109-Realabnahme ausstehend; niemals PROD automatisch aktualisieren.

## Referenzen und Schutzgrenzen

- V4.14.4 DEV: bestätigte 38/38-Registrierung und funktionsfähige Wetter-Referenzmodule.
- V4.14.5 DEV: auf VM109 sichtbar abgenommenes Monitored-Areas-Standortverwaltungsfenster einschließlich Teilstringsuche („burg“ → „Hamburg“) und Erhalt der Local-To-do-Liste.
- V4.14.6 baut **additiv** darauf auf. Kein WeatherRouter-Provider, Radar-/Wind-/Temperatur-/Mond-Renderer, Blitzortung-Tracker oder bestehender Eye-/Legend-Hub wird verändert.
- SQLite ist eine **eingebettete lokale Datenbank**, kein Microsoft SQL Server; kein externer Dienst erforderlich.

## Umfang

### 1. HA-Administrator aktiviert die optionale SQLite-Runtime

`custom_components/gewitterradar/config_flow.py` bietet die native Integrationsoption
`monitored_areas_enabled` (Checkbox, **standardmäßig aus**), in DE/EN übersetzt.
Der bisherige Sidebar-Schalter bleibt bestehen; sämtliche anderen Optionen werden erhalten.
`monitored_areas/__init__.py` liest ausschließlich explizites Python-Boolean `True`;
das Starten der Datenbank durch die Option importiert **keine** Local-To-do-Orte,
löscht keine Liste und stellt kein SQLite als aktive Quelle dar.
Der HA-OptionsFlow nutzt den vorhandenen Reloadvertrag.

### 2. Bestehende Standortverwaltung zeigt den Migrationsmodus an

`frontend/modules/ui/controls.js` fragt die HA-WebSocket-API über die bestehende
`createLocationPort`-Schnittstelle ab. Die API ist nur registriert, wenn die HA-Integration
explizit aktiviert wurde und der zugehörige Vault-Backendzugang vorhanden ist.
Bei fehlender API und ohne vorherigen bestätigten `db_active`-Modus bleibt
**Local To-do maßgeblich**. Kritische Backendfehler werden nicht als Berechtigung
interpretiert; eine bekannte aktive DB fällt nicht still auf Local To-do zurück.
Die UI-Modusentscheidung wird ausschließlich aus `status.capabilities.saved_places_mode`
bezogen, niemals aus einem Browserflag.

Im Status `migration_pending` erscheint im neuen Standortmanager
**„SQLite-Übernahme prüfen“**. Der Klick prüft HA-Benutzer und Vault-Profil unmittelbar
vor der Öffnung erneut und lädt erst dann den bereits implementierten
`migration-wizard.js`. Es gibt keinen automatischen Aufruf beim Start.

### 3. MA-020: dreistufige Migration mit bestehenden Backend-Schutzmechanismen

1. **Schreibgeschützte Vorschau:** Der HA-Server liest ausschließlich die exakt
   verifizierte Local-To-do-Entity `todo.gewitterradar_orte`, zeigt gültige, ungültige,
   doppelte und konfliktbehaftete Einträge. Keine Client-Koordinaten werden direkt in
   SQL übernommen. Andere ähnlich benannte To-do-Entities werden nicht verwendet.
2. **Expliziter Import:** Der Nutzer wählt für jeden gültigen Ort die Behandlung;
   Überspringen/ungültige Einträge blockieren den vollständigen Abschluss.
   Die vorhandene SQLite-Migrations-API prüft den unveränderten Quell-Digest, die
   aktuelle Profilberechtigung, Konflikte, Revisionen und Request-IDs erneut.
   Local To-do wird dadurch noch **nicht** gelöscht.
3. **Gesonderte Finalisierung:** Nur nach serverseitiger Finalisierungsvorschau
   mit Nonce, ausdrücklicher Checkbox und HA-Administratorberechtigung kann die
   vorhandene HA-To-do-Liste **Eintrag für Eintrag** geleert werden. Das Backend
   prüft nach jeder Aktion durch frisches Readback, führt ein Recovery-Journal und
   lässt die Liste selbst immer bestehen. Erst nach vollständiger Verifikation
   darf `saved_places_mode` auf `db_active` wechseln. Ein nicht vollständiger
   Vorgang bleibt in `migration_pending`.

Die Finalisierungsengine und deren Sicherheits-/Readbackprüfungen sind **nicht umgebaut**.
Es wurden nur der native Opt-in und ein kontrollierter UI-Zugang ergänzt.

### 4. Keine automatische Tracking-Umschaltung

Die MA-023-Funktion „Auf Karte zeigen“ bleibt eine Kamerabewegung, keine
Referenztracker-Umschaltung. Archivierung ist im DB-Modus profilbezogen und reversibel;
bestehende Local-To-do-Operationen bleiben bis zum nachgewiesenen Cutover bestehen.
Bei HA-Benutzer-/Vault-Profilwechsel werden neue Operationen gesperrt.

## Geänderte / ergänzte Komponenten

- `custom_components/gewitterradar/config_flow.py`
- `custom_components/gewitterradar/strings.json`, `translations/de.json`,
  `translations/en.json`
- `frontend/modules/ui/controls.js` samt ausgeliefertem Spiegel
- `frontend/modules/monitored-areas/location-manager.js` samt Spiegel
- `tests/test_ma_v4146_optin_contract.py` und angepasster MA-Frontend-Test
- Produktidentität `4.14.6 DEV` / Integration `0.25.192` /
  Runtime `4146r1` / Modulset `E414-6A1` / DRA `BUILD_VERSION=4.14.6`.

## DEV-Tests und Releasegrenzen

Die öffentliche Workflow `.github/workflows/ma-v4146-dev-build-sync.yml`
führt den regulären Frontend-Build aus und generiert Dashboard- und Integration-Spiegel,
`frontend/assets.json`, `SHA256SUMS_FRONTEND.txt` und einen separaten Build-Commit.
Sie führt aus:

- `node --test scripts/test-ma-004.mjs`
- `node tests/test_ma_location_manager.mjs`
- `python -m unittest discover -s tests -p test_ma_frontend_module_registration.py -v`
- `python -m unittest discover -s tests -p test_ma_v4146_optin_contract.py -v`

**Der aktuelle Erfolg wird erst nach Abschluss dieser Aktion und nachgelagerter CI
pro finalem HEAD bestätigt.** Ohne grüne Builds keine sichere DEV-Installationsfreigabe.

## Betreiberabnahme auf DEV VM109

1. V4.14.6 per DRA V2 aus `feature/v4.14-monitored-areas` aktualisieren.
2. Bestehende Standortsuche, Teilstringsuche, Mond und Wetterdienste prüfen.
3. Home Assistant → Einstellungen → Geräte & Dienste → GewitterRadar →
   Konfigurieren → `Monitored Areas (SQLite) aktivieren`; Sidebar-Einstellung
   unverändert lassen. HA-Reload abwarten.
4. Zurück zu GR → Standort-Dropdown → `Standorte verwalten`.
   Erwartung: `Migration ausstehend`, bestehende Local-To-do-Orte noch sichtbar.
5. `SQLite-Übernahme prüfen` öffnen; Vorschau und Dubletten prüfen.
   **Für den ersten Test Import und insbesondere „Jetzt Einträge leeren“
   ausdrücklich NICHT bestätigen.**
6. Diagnoseexport / Screenshot von Vorschau, Quellanzahl, Konflikten, Modus und
   38/38 Modulen für die gemeinsam kontrollierte Freigabe erstellen.
7. Erst nach erfolgreicher Read-only-Abnahme, Backup und erneuter Zustimmung
   einen tatsächlichen Import und Cutover testen.

Eine HA-Realabnahme oder erfolgreiche Migration ist durch Repository-/CI-Tests
allein **nicht** nachgewiesen.
