# TEST70-41 – GR V4.11.123 DEV OPERA-Authentifizierung

Datum 2026-11-03. Nur HA DEV VM 109; HA PROD VM 101 unverändert.

## Anlass / Realbefund
HA DEV war wegen vieler nicht authentifizierter `/api/weather_router/opera_preview`-PNG-Anfragen von 192.168.10.181 per IP-Ban nicht mehr erreichbar. Nach Sicherheitsfix GR 4.11.122 gab es einmal erfolgreich 20 Tiles, danach beim Start der Vorschau den Fehler `opera_diagnostic_auth_preflight_failed`. Diagnoseexport von 13:04:44Z bestätigt GR 4.11.122, WR 0.10.281. Noch kein HTTP-Status der Preflight-Antwort im vorhandenen Export.

## Implementierung
- `frontend/modules/weather/consumer-client.js`: vor Abruf des Tokens `connection.options.auth.refreshAccessToken()` asynchron aufrufen, sofern diese Methode vorhanden ist; bei Refresh-Fehler Vorschau fail-closed abbrechen.
- Kein Tokenlogging und keine Weitergabe der Zugangsdaten an Diagnoseexport.
- `frontend/modules/weather/p7-010/opera-diagnostic-tile.js`: beim Vorprüfungsfehler `error.httpStatus` und einen statuscodierten `error.code` setzen. Dieser Code wird bereits im GR-Diagnosetrace gespeichert.
- Bisherige Schutzmaßnahmen bleiben: einmalige authentifizierte `/api/`-Vorprüfung vor Tile-Fanout; bei 401/403 aus Tile-Anfragen Abbruch anderer ausstehender Tile-Fetches. HA-IP-Banning und Authentifizierung bleiben aktiv.
- Alle Frontend-, Dashboard- und HA-Integration-Kopien synchronisiert.

## CI-Nachweis
Öffentliche GitHub Actions (SUCCESS): https://github.com/TheDaimos/gewitterradar/actions/runs/41641981482

Version: GR V4.11.123 DEV; Integration 0.25.32; Runtime 411123r1; ModuleSet E411-123A1.
Release-Commit: `d64b3411463c9651a55da1117ccba0bc736627b0`, `deploy/dev`.
CI: deterministischer Versionswechsel, Frontend-Build, SHA-256-Prüfung, TEST70/Auth-Gate/WL02-Regression, Syntaxprüfung, Konsistenzprüfung; anschließend Commit durch github-actions[bot].

## Grenzen und Realtest
CI-Erfolg beweist nicht, dass die dynamische HA-Authentifizierung tatsächlich dauerhaft stabil ist. Falls HA-Auth-Objekt keine `refreshAccessToken`-Methode anbietet, wird diese vorsorgliche Aktualisierung übersprungen. Ein vom HTTP-Status unabhängiger Grund für Vorprüfungsfehler bleibt möglich. Die feste Vorlage ist noch eine explizite Diagnosevorschau ohne automatischen Wechsel zum nächsten OPERA-Zyklus.

### HA DEV TEST70-42
1. Via DRA V2 nur GR V4.11.123 DEV aus `TheDaimos/gewitterradar@deploy/dev` auf VM 109 installieren, WR 0.10.281 unverändert.
2. Version prüfen und Auth-Log per QEMU Guest Agent kontrollieren.
3. Vorschau einmal starten; bei Fehlermeldung genaue Textmeldung und neuen GR-Diagnoseexport erfassen.
4. Nach 401/403 keine weiteren wiederholten Starts.
5. Diagnoseexporte ausschließlich in `TheDaimos/Project-Log-And-Export@main`.

**Keine privaten GitHub Actions. Ausschließlich öffentliche Actions im Public-Repo.**
