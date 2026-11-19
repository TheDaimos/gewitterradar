# GewitterRadar 4.11.243 – FINAL-Gate-Auflösung, Nachlauf

**19.11.2026 · `TheDaimos/gewitterradar@deploy/dev` · 4.11.243 DEV / HA 0.25.150 / Runtime 411243r1**

## Ergebnis

Die zuvor beanstandeten aktuellen JavaScript-Gates sind in der erneut geprüften Version **grün**. Die technische FINAL-Freigabe bleibt jedoch **gesperrt**, solange Lizenzaktivierung, Python-/Browser-Testabdeckung und das tatsächliche FINAL-Paket nicht abgeschlossen sind.

## Positiv ausgeführte Prüfungen

| Prüfung | Ergebnis |
| --- | --- |
| `audit-frontend-i18n.mjs` | PASS: alle 19 Sprachkataloge, keine entfernten Schlüssel, keine leeren Werte, keine App-/Eye-Fallback-Lücken; 7 ausdrücklich erlaubte Umformulierungen; alle übrigen Schutzvergleiche bestanden |
| `test-about-locales.mjs` | PASS: 19 Sprachen, Fallback, About-Isolation und 5.168 unveränderte I18N-Auflösungen |
| `test-module-registry.mjs` | PASS |
| `test-flk01-weather-radar-transition.mjs` | PASS |
| `verify-hires-asset-retention.mjs` | PASS: 58 geschützte Blob-Identitäten, 59 aktuelle Artwork-Dateien, 11 Metadaten-Dateien |
| `test-v41140-module-manifest.mjs` | PASS |
| `test-v411-weather-router.mjs` | PASS: Providertrennung und WR-Verträge, 3 Untertests |
| `test-v41108-project-hub.mjs` | PASS |
| `test-v411-identity.mjs` | PASS |
| `verify-source-archive-contract.mjs` | PASS nach Einlesen der `.github`-Quellen |
| `verify-current-frontend.mjs`, `verify-frontend.mjs` | PASS: 37 Module, 195 Dateien, DRA-/Mirror-Parität |
| `test-frontend-build.mjs` | PASS: deterministischer Build und Fail-Closed-Proben |

**Abgrenzung:** Diese Resultate sind lokale Quell-/Vertragsprüfungen, keine Behauptung eines realen Home-Assistant- oder Mobilgerätetests.

## Noch offen (FINAL-NO-GO)

1. **Python-Suite:** `pytest` ist in dieser Umgebung nicht installiert. Ohne vollständige Tests darf keine pauschale grüne Python-Freigabe eingetragen werden.
2. **Browser-Regressionen:** Automatisierte HA-/Chromium- und Touch-Tests sowie ein tatsächlicher HA-DEV-Installations-/DRA-Rollback-Durchlauf sind für diesen Nachlauf nicht nachgewiesen; die Betreiber-Sichtabnahme bleibt separat gültig.
3. **Historische V4.07-Tests:** `test-v407-full-i18n-candidate.mjs` und `test-v407-help-runtime-locales.mjs` referenzieren zwei im aktuellen Branch fehlende historische `artifacts/v407/`-Dateien. Beide sind derzeit **nicht lauffähig**. Archiv-Fixtures nachprüfbar bereitstellen oder archivische Tests ausdrücklich von aktuellen FINAL-Gates trennen; keine aktuellen Schutztests entfernen.
4. **Lizenz:** Die aktive Repository-Datei `LICENSE` enthält noch GPLv3. Die Modell-B-Fassung steht bislang nur in `docs/PROPOSED_COMMUNITY_LICENSE_CHRISTIAN_KOEHLER.md` mit ausdrücklichem Entwurfsstatus. Die bestätigte Neulizenzierung für die neue Version muss vor der FINAL-Veröffentlichung konsistent in `LICENSE`, README, Metadaten, Hilfeseite und Release-Archiv umgesetzt werden. Frühere GPL-Veröffentlichungen verlieren ihre Rechte dadurch nicht rückwirkend.
5. **FINAL-Artefakte:** Erst nach Gate-Abschluss eine endgültige Versions-/DRA-Identität und reproduzierbare Installationspakete erstellen, Hashes/Metadaten prüfen und dann die eigentliche FINAL-Veröffentlichung freigeben.

## Schutzgrenzen

Keine funktionalen Wetter-/Eye-/Provider-Änderungen, kein FINAL-Tag, keine Veröffentlichung und keine Änderungen an PROD VM101. Die geschützte 4.11.243-Referenz bleibt DEV. Der neue Offline-Hilfebereich wurde zuvor additiv eingebaut und nicht als neue Funktionsversion ausgegeben.
