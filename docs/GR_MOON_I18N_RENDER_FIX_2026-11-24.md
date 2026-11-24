# GR 4.13.6 DEV – Moon Legend: i18n Render-Fix

Datum: 2026-11-24

## Befund
Nach der 19-sprachigen Lokalisierung in GR 4.13.5 blieb im erfolgreichen Mond-Datenpfad `s.hero.alt=phaseName(data.phase,de)` stehen. Die Variable `de` war beim Umbau auf `owner._t('legendHub.*')` entfernt worden. Bei erfolgreicher WebSocket-Antwort löste das `ReferenceError: de is not defined` aus; der allgemeine Catch zeigte fälschlich „Monddaten nicht verfügbar – WeatherRouter prüfen.“ Wetterlayer waren davon nicht betroffen.

## Korrektur
- Einzige funktionelle Korrektur: `s.hero.alt=phaseName(data.phase,o)`.
- Alle drei Frontend-Spiegel byteidentisch gehalten, `SHA256SUMS_FRONTEND.txt` angepasst.
- Version/DRA-Kennung auf GR `4.13.6 DEV`, Integration `0.25.184`, Runtime `4136r1`, Module-Set `E413-6A1` angehoben.
- Frontend-Einstieg, Module Manifest, Panel und Legend-Hub-Moon-Import cachebusted, ohne Funktionalität anderer Module zu ändern.
- Kein WeatherRouter-, OPERA-, DWD- oder NASA-Code verändert. Kein privater GitHub-Actions-Lauf.

## Prüfstatus
Remote-Quellkontrolle: drei identische Moon-Dateien; veraltete `de`-Referenz im relevanten Renderpfad entfernt; Versions- und SHA-Metadaten gegen GitHub verifiziert. **Keine vollständige Testsuite, kein HA-Realtest ausgeführt.** Anwenderinstallation über DRA DEV und Neustart/Browser-Reload bleiben getrennt.

Für neue Fehlermeldungen nicht alle WebSocket-/Laufzeitfehler pauschal als WeatherRouter-Ausfall melden; `console.error` / Fehlerklassen sollten in einer späteren gezielten Verbesserung differenziert werden.
