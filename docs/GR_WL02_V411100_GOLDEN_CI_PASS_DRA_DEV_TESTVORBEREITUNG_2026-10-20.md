# Gewitterradar WL-02 – Golden-Version korrigiert, CI vollständig grün, kontrollierter DRA-HA-DEV-Testkandidat

**Datum:** 20.10.2026 · **Repository:** `TheDaimos/gewitterradar` · **Zweig:** ausschließlich `deploy/dev`

## Verbindliche Entscheidung

**DEV-Testversion vorbereitet: JA. CODE-PASS: JA. Öffentlicher CI-PASS: JA. Kontrollierter DRA-HA-DEV-Testkandidat: technisch freigabefähig, aber die tatsächliche Installation bleibt bis zur ausdrücklichen Zustimmung des Benutzers gesperrt. HA-REAL-PASS: NEIN. Produktionsfreigabe: NEIN.**

**Exakt geprüfter Code-/Paketcommit:** `72a65d309f91d8e257d312165bd9f312f53d5a19`. Version **V4.11.100 DEV** (Funktion **DEV-TEST-Kandidat**, kein neuer Produktstatus in der UI), Runtime **411100r1**, Modulset **E411-100A1**, HA-Integration **0.25.18**. Bereits vorhandene Versionsanhebung `42a222544d552e7e83643df7d03c89324e0cd692` **nicht wiederholt**. Die abschließende Berichtserstellung fügt nur Dokumentation hinzu und verändert das zu prüfende Paket nicht.

## Nachgewiesene und behobene CI-Fehler

1. **Historischer Golden-Identitätsvalidator:** Der vorherige Frontend-CI-Lauf [39387873805](https://github.com/TheDaimos/gewitterradar/actions/runs/39387873805) war an `scripts/verify-about-golden-v408.cjs` mit `Frontend is not covered by V4.09/V4.10 historical or V4.11 DEV identity contracts` gescheitert. Der Prüfer berücksichtigte nur bis V4.11.99. **Korrektur:** [Commit `8805b9f22765b9fb90f03bb8e6b7d1b428b9ce6f`](https://github.com/TheDaimos/gewitterradar/commit/8805b9f22765b9fb90f03bb8e6b7d1b428b9ce6f) ergänzt genau den neuen V4.11.100-Fall, prüft explizit Version, Anzeigeversion, Build-Datum, Runtime, Modulset, Integrationsversion sowie Runtime-Manifest mit 34 Modulen. Das bestehende historische Golden-/Hash-/Browser-/Geometriegate bleibt vollständig aktiv. Im nachfolgenden Lauf [39388865137](https://github.com/TheDaimos/gewitterradar/actions/runs/39388865137) bestand die Golden-Geometrieprüfung.
2. **Unabhängige Browser-Timing-Regression:** Im selben nachfolgenden Lauf [39388865137](https://github.com/TheDaimos/gewitterradar/actions/runs/39388865137) schlug ein späterer, anderer Test `scripts/test-picker-diagnostics.cjs` bei `integration/desktop medallion diagnostic animation visibly changes transform` fehl: Zwei nach 420 ms verglichene Phasen ergaben denselben Matrixwert. Ohne Rendereränderung wurde die empfindliche Einmalstichprobe durch bis zu 18 zeitversetzte CSS-Transformationsprüfungen ersetzt; jede echte Nichtänderung bleibt ein Fehler. **Korrektur:** [Commit `72a65d309f91d8e257d312165bd9f312f53d5a19`](https://github.com/TheDaimos/gewitterradar/commit/72a65d309f91d8e257d312165bd9f312f53d5a19). Der daraufhin ausgelöste Frontend-Workflow einschließlich Instrument-/Golden-Tests ist **SUCCESS**.

**Tatsächlich geänderte Dateien dieser Fortsetzung:** `scripts/verify-about-golden-v408.cjs`, `scripts/test-picker-diagnostics.cjs` und diese reine Markdown-Dokumentation. Keine Provider-, Runtime-, Frontend-Renderer-, WR-, DRA- oder HA-Betriebsdatei verändert. Alte roten Runs bleiben in GitHub sichtbar und werden nicht als PASS deklariert.

## Vollständig abgeschlossene öffentliche GitHub-Actions-Pushprüfungen

Alle drei nachfolgenden Läufe haben **denselben** zu installierenden Quellcommit `72a65d309f91d8e257d312165bd9f312f53d5a19`, jeweils `completed/success`:

- [**V4.11.100 Settings und Runtime – Run 39389344224**](https://github.com/TheDaimos/gewitterradar/actions/runs/39389344224): `settings-navigation` Job **118516811525** = **SUCCESS**.
- [**Validate Gewitterradar integration – Run 39389344307**](https://github.com/TheDaimos/gewitterradar/actions/runs/39389344307): `home-assistant-runtime` Job **118516812346** = **SUCCESS**; `package-contract` Job **118516812360** = **SUCCESS**; `hassfest` Job **118516812419** = **SUCCESS**; `hacs-integration` Job **118516812570** = **SUCCESS**.
- [**Validate shared Gewitterradar frontend – Run 39389344260**](https://github.com/TheDaimos/gewitterradar/actions/runs/39389344260): `shared-frontend` Job **118516811613** = **SUCCESS**.

Die Prüfabläufe enthalten die bestehenden Integrations-/Paket-, Identitäts-, Frontend-/Asset-, Browser-/Golden- und Auslieferungskontrollen. Die bestehenden historisch grünen isolierten WL-02-/P7-010-Regressionsläufe vom fachlichen Quellcommit `169bac89850b6c5fe542d9f90897041bc3ebb199` wurden nicht blind neu implementiert; sie bleiben Teil der dokumentierten Abnahmekette. **Der öffentliche CI-PASS ist kein realer Wetterbild-/HA-PASS.**

## DRA: nur kontrollierte Vorbereitung, keine Ausführung

- **Umgebung:** ausschließlich Home Assistant **DEV**, **nicht** PROD.
- **DRA-Quellrepository/Ref:** `TheDaimos/gewitterradar` / **`deploy/dev`**, nicht `main`.
- **Exakter Zielcommit:** `72a65d309f91d8e257d312165bd9f312f53d5a19`; vor Auslösung in der DRA-Zusammenfassung erneut gegen die ausgewählte Ref und den Quellstand abgleichen. Keine stillschweigende Installation eines späteren Zweig-HEADs unter derselben Versionsnummer.
- **Sollidentität:** GR **V4.11.100 DEV**, Runtime **411100r1**, Modulset **E411-100A1**, Integration **0.25.18**. Die Rolle **DEV-TEST** ist eine Installations-/Freigabestufe und verlangt keine Änderung des ehrlichen Anzeige-Texts `V4.11.100 DEV`.
- **Vorher sichern:** tatsächlich installierte Version, Codecommit, GR-/WR-Status, HA-DEV-Sicherung und die DRA-Zusammenfassung *Installierte Version → neue Version · Commit · ausgewählte Ref*. Nach Installation erst durch Benutzer: HA-Neustart falls erforderlich, Browsercache prüfen, Identitäten/Prüfsummen kontrollieren. Jede Abweichung bedeutet Stopp/Rollback.
- **Rückfall:** auf den **tatsächlich zuvor auf HA DEV installierten und gesicherten** funktionierenden GR-Stand zurückgehen; dessen exakten DRA-Installationscommit vorab aus dem Gerät/Installationsprotokoll ablesen. Zuletzt fachlich mit fünf grünen WL-02-Programmläufen dokumentiert: GR V4.11.99 DEV, Code `169bac89850b6c5fe542d9f90897041bc3ebb199`. Dies ersetzt **nicht** die Ermittlung des wirklich vorher installierten Commits.

**Installation wurde NICHT gestartet und ist weiterhin von der ausdrücklichen Zustimmung des Benutzers abhängig.** Ein verwechslungsfreier Commit-Pin und eine passende DRA-Installationsvorschau sind unmittelbar vor Ausführung zusätzlich zu kontrollieren.

## HA-Realtest – bleibt getrennt offen

WR Consumer V1 für `weather.satellite.clouds` und `weather.model.wind_10m.layer` jeweils authentifiziert über `discovery`, `capabilities`, `resolve` (Profil `gewitterradar`, BBOX, `time:{mode:"latest"}`) untersuchen. `available` garantiert weder `ready` noch Pixel. Bei `unavailable` keine erfundenen Tiles anzeigen. Bei tatsächlichem `ready/raster_tile` HTTPS/CORS-Kacheln, echte nichtleere Bildpixel, semantische Einheit/Quelle/Attribution, UTC-Datenalter, Geografie/Datumsgrenze/NoData, Zoom, Sichtbarkeit/Abbruch/Reconnect und gemeinsame WL-02+P7-010-CPU-/RAM-/Netzlast in HA DEV prüfen. Mobile/Desktop, Vollbild und Rückfall dokumentieren. GR-RF04-DWD-`coverage_timeout` bleibt ein gesonderter natürlicher Echtfall. Private Diagnosen ausschließlich `TheDaimos/Project-Log-And-Export@main`.

**Sechs Gate-Zustände:** CODE-PASS **JA** · öffentlicher CI-PASS **JA** · DRA-Paket-/Testkandidat **VORBEREITET, Zustimmung ausstehend** · tatsächliche Installation **NEIN** · HA-REAL-PASS **NEIN** · PROD **NEIN**.

**C.K. – Eine Idee weiter gedacht.**
