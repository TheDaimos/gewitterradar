# GewitterRadar V4.14.8 DEV – MA-020 Android UUID Hotfix

## Reale Reproduktion (VM109, Betreiber, 27.11.2026)

- V4.14.7 / HA 0.25.193 installiert; SQLite opt-in aktiv.
- Local To-do Vorschau erfolgreich: 43 Einträge, 43 gültig, 4 archiviert, 0 ungültig.
- Beim Klick auf **Auswahl importieren** erscheint clientseitig `crypto.randomUUID is not a function`.
- Die Fehlerstelle liegt **vor** `hass.callWS("migration_commit",...)` bei der Erzeugung der obligatorischen `request_id`. Dieser konkrete Klick hat daher keinen Import ausgelöst. Es darf daraus **nicht** geschlossen werden, dass alle künftigen API-Schreibversuche sicher scheitern.
- Browserkontext: Android/HA. In nicht als sicher betrachteten HTTP-Kontexten ist `crypto.getRandomValues` typischerweise vorhanden, `crypto.randomUUID` dagegen nicht.

## Additiver Fix

- `migrationRequestUUID(cryptoSource=globalThis.crypto)` in `frontend/modules/monitored-areas/migration-wizard.js`.
- Vorrangig vorhandenes `randomUUID()` verwenden; ansonsten 16 **kryptografisch zufällige** Bytes über `getRandomValues`, Versionsbits = 4, Variantenbits = RFC 4122, Ausgabe als UUID in kanonischer Bindestrich-Schreibweise.
- **Keine** Math.random-, Zeitstempel- oder deterministische ID als Fallback. Fehlt sichere Entropie, klare Fehlermeldung statt eines unsicheren Idempotenz-Schlüssels.
- Sowohl `migration_commit` als auch `migration_finalize_commit` nutzen denselben geprüften Generator. Die serverseitige UUID-Prüfung, Einmal-Quittungen, Berechtigungsprüfung, Archivierung, Vorschau-Digest und explizite Finalisierung bleiben unverändert.
- Neu: Regression für modernen und eingeschränkten Browser-API-Modus, UUID-Version/Variante und fehlende sichere Entropie.

## Auslieferung

- Version: **V4.14.8 DEV**, Integration **0.25.194**, Cache-/Runtime-Revision **4148r1**, Modulset **E414-8A1**.
- Der öffentliche DEV-Frontend-Spiegel wird regulär über `.github/workflows/ma-v4148-dev-build-sync.yml` gebaut, inklusive SHA256 und Integration-/Dashboard-Spiegel.
- `.github/workflows/ma-v9-consolidated-regression.yml` testet und erzeugt installierbare CI-Artefakte ausschließlich auf demselben geprüften SHA.
- Die nicht funktionale historische Version V4.14.7 bleibt als Referenz dokumentiert; PROD, WeatherRouter und Datenbestände dürfen nicht automatisch verändert werden.

## Reale Abnahme

1. V4.14.8 nur auf VM109 installieren und installierte HA-Integration 0.25.194 prüfen.
2. SQLite-Option und die alte Local To-do Liste unverändert lassen.
3. Migration erneut **schreibgeschützt** öffnen; 43/43/4/0 prüfen.
4. **Auswahl importieren** ausführen. Erwartet: Erfolgsmeldung mit 43 Orten und ausdrücklichem Hinweis, dass Local To-do weiter vorhanden ist.
5. Die irreversible Aktion **Jetzt Einträge leeren** noch nicht ausführen; zunächst DB-Inhalt, Archivzuordnung und Quelle separat prüfen.
