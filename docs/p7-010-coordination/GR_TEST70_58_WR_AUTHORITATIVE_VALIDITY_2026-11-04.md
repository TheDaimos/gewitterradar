# GR TEST70-58 – WR ist alleinige Autorität für Niederschlagsquellen und Gültigkeit

**04.11.2026 · `deploy/dev` · P0 · NICHT RELEASE-FREIGEGEBEN**

## Ursachen und Korrekturen

GR V4.11.135 und WR 0.10.284 waren ohne die späteren GR-Transportänderungen gemeinsam installiert. Die echten Exporte vom 04.11.2026 zeigten DWD-V2, aber keine OPERA-Flächengrundlage. WR hatte für RATE 1.650 Sekunden eingestellt; GR und WR besaßen mehrere versteckte feste 900-Sekunden-Sperren.

**Vertrag ab TEST70-58:** WR entscheidet alle Quellen, Datenalter, Bereitstellung, Reihenfolge und absolute Gültigkeit; GR übermittelt Kartenansicht und allenfalls ein binäres Opt-in für ältere Satelliten als Nutzerwunsch. WR wertet es aus. GR lädt die genehmigten Kacheln, retried nur fehlgeschlagene Kacheln und tauscht die sichtbare Ebene erst nach erfolgreicher Bereitstellung aus.

**Umgesetzt im GR-Quellcode:**
- `precipitation-layer.js`: keine lokalen V1/V2-900s-Verwerfungen, keine lokale Satelliten-/Providerpriorisierung in der Handover-Retention, keine eigenständige 45s-Haltefrist; Verwendung des WR-Felds `times.valid_until`. Die normale Ansicht abonniert WR-`weather_router_opera_cycle_available` als bloßen Aktualisierungshinweis und erstellt **keine** separate OPERA-Ebene.
- `p7-010/raster-mosaic-consumer.js`: V2-Anfrage ohne `max_data_age_seconds`, `max_background_age_seconds` oder `max_time_delta_seconds`. Nur `allow_older_satellite_background` als boolesche Benutzerpräferenz; WR entscheidet.
- `p7-010/raster-mosaic-contract.js` / `raster-mosaic-grid-layer.js`: keine clientseitigen Wetterdatenalter-Limits; obligatorisches `times.valid_until`, technische URL-/Coverage-/Renderer-Sicherheitsprüfungen bleiben erhalten.
- `consumer-client.js` und `p7-010/opera-diagnostic-tile.js`: diagnostische 900s-Filter und alte 15-Minuten-Beschriftungen entfernt.
- Die **drei** Lieferbäume `frontend/`, `custom_components/gewitterradar/frontend/`, `dashboard/dist/` wurden für alle geänderten Module synchronisiert.
- `tests/test70-58-wr-validity-authority.test.mjs` kontrolliert WR-only-Request ohne Alter, 1.650s gültigen Source bis zum WR-Deadline, sowie verbotene 900s-Regressionen. Integration in bestehende öffentliche CI über `scripts/test-v411-weather-router.mjs`.
- Legacy-Identitätstests in `scripts/test-v411-weather-router.mjs` und `scripts/test-v411-identity.mjs` auf aktuell ableitbare Versionsidentität korrigiert, historische exakte Snapshot-Verträge bleiben für damalige Version erhalten.

**Breitenprüfung:** Alle 55 `frontend/**/*.js` durchsucht, zusätzlich 114 WR-Python-Quelldateien auf starre Altersregeln. Verbleibende 900 in UI-Debounce/CSS/sonstigen Größen sind **keine** Datenalter-Sperren.

## Öffentliche CI und aktuelle Sperre

GitHub Actions auf `TheDaimos/gewitterradar@deploy/dev` tatsächlich ausgeführt. Mehrere Kernläufe sind **nicht grün**; aktuelle Fehlschläge umfassen historische Versionsannahmen auf GR 4.11.106 und sollten weiter bereinigt werden, ohne Tests künstlich abzuschalten. Es gibt **keinen** freigegebenen GR-V4.11.136-Release und keinen neuen HA-DEV-VM109-Realtest.

Die GitHub-Quellkopien und die syntaktisch geprüften JavaScript-Module ersetzen keine reale Browser-/HA-Abnahme. Die installierte Version GR 4.11.135 erhält diese Source-Änderungen **nicht** automatisch.

**Keine privaten GitHub Actions**; nur öffentliche Workflows im Public-Repo. Kein Eingriff in HA PROD VM101. Exporte nur `TheDaimos/Project-Log-And-Export@main`.

## Noch nicht abgenommen

- Python-Gesamtregression und aktiver WR-Consumer-V2-Vertrag nach Wegfall der clientseitigen Altersparameter.
- GR-V2 Browser-Authentifizierung für interne OPERA-Rate-Kacheln.
- Räumlich gemischte DWD/OPERA-Abdeckung (Deutschland/Europa), neue Frame-Events, 0 Fehler beim Seamless-Handover, selektiver Kachelretry, alle Gerätetypen.
- Grün bestätigte öffentliche GR-CI, konsistenter neuer GR-Release und kontrollierte DRA-V2-Vorschau.
