# TEST70-37 · HA DEV IP ban – OPERA PNG Bearer preflight

Datum: 2026-11-03. Ziel: HA DEV VM 109; PROD VM 101 unverändert.

## Reale Befunde
- HA Core 2026.10.4 lebt; nicht abgestürzt.
- HA Log: `homeassistant.components.http.ban` meldet ungültige Authentifizierung für mehrere parallele Requests auf `/api/weather_router/opera_preview/RATE/.../north_first/...png` vom UltraBook 192.168.10.181; danach `Banned IP 192.168.10.181 for too many login attempts`, HTTP 403.
- Nutzer löschte den Ban-Eintrag und startete HA Core neu; Zugriff wiederhergestellt.
- Bisherige JSON-Diagnosen können vom Browsercache stammen; sie sind keine Belege für erreichbaren Core zum Störzeitpunkt.

## Quellcodebefund
- WR `opera_tile_http.py`: authentifizierte HA View, `requires_auth=True`, Admin- und Provider-Gates; auth darf nicht global abgeschaltet werden. Konkreter Preview-Endpunkt und sein Auth-Schutz müssen bei Folgeprüfung separat geprüft werden.
- GR `frontend/modules/weather/consumer-client.js`: liest `connection.options.auth.accessToken` oder `hass.auth.data.access_token` und übergibt diesen an OPERA-Diagnoseadapter.
- GR Adapter `fetchOperaDiagnosticPng`: pro Tile paralleler HTTP GET mit Bearer Token. Ungültiger Token verursacht gehäufte HA Auth-Fehlschläge.
- Warum der gelesene Token im Realtest ungültig war, ist NOCH NICHT NACHGEWIESEN.

## Interim-Sicherheitsfix (unversioniert; NICHT installieren)
- `requestOperaDiagnosticPane` prüft vor dem Anlegen der GridLayer ein einziges HTTP GET auf `/api/` mit demselben Bearer Token, `credentials: omit`, `no-store`, `redirect: error`.
- Beim HTTP-Fehler wird `opera_diagnostic_auth_preflight_failed` geworfen; keine parallele Kachelserie wird begonnen.
- Die drei ausgelieferten Adapter-Kopien sind bytegleich geändert.
- Regression: `tests/test70-opera-auth-preflight.test.mjs` hinzugefügt. Noch nicht ausgeführt.
- Dieser Fail-Closed-Mechanismus ist eine Sicherheitsbegrenzung, KEIN Nachweis einer korrekten Token-Lifecycle-Behandlung oder eines erfolgreichen Realtests.

## Offene Aufgaben
1. Authentifizierung von `opera_preview`-HTTP-View einschließlich `requires_auth` und HA Middleware vollständig auditieren.
2. Token-Herkunft und Aktualisierung in GR prüfen; ungültige, alte Tokens vermeiden statt lediglich parallele Wiederholungen begrenzen.
3. Nach Fail-Closed auch 401/403 während Kachelanforderung sofort stoppen, um spätere Revocations ohne Anfrageschwall zu handhaben.
4. Öffentliche CI-Regression, Frontend-Build, SHA256-Inventar, Versionskonsistenz erstellen und ausführen.
5. Nur nach erfolgreichen Tests neue GR DEV-Version bereitstellen; HA DEV Realtest und Auth-Logs auswerten.
6. Export2Git ausschließlich `TheDaimos/Project-Log-And-Export@main`.

GitHub Actions in privaten Repositories ausnahmslos verboten; nur öffentliche Actions im Public-Repo nach Freigabe.
