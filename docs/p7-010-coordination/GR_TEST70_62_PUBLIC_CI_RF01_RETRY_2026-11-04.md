# TEST70-62 – öffentliche P7-010-CI: RF01-Endloswarteursache beseitigt

Datum: 2026-11-04. Repository: `TheDaimos/gewitterradar`, ausschließlich `deploy/dev`.

## Belegte Ursache
Öffentlicher Lauf `41883399420` (`ecdf435a...`) startete erfolgreich und bestand die isolierten OPERA- und Rastertests bis einschließlich `scripts/test-p7-010-raster-tile-url.mjs`. Der nächste Test `scripts/test-p7-010-rf-01.mjs` blieb hängen. Nach exakt fünf Minuten beendete das Job-Timeout den Prozess als CANCELLED. Der parallel gestartete Settings-Lauf `41883399403` blieb am selben RF01-Testschritt hängen.

Der alte RF01-Test simulierte einen dauerhaft fehlgeschlagenen Bildabruf und wartete auf `done(error)`; die produktive V1-Einzelkachel-Retry-Implementierung dagegen wiederholt gezielt dieselbe fehlgeschlagene Koordinate und erzeugt bei einem vorübergehenden Transportfehler gerade keinen terminalen Fehler. Der Prüfvertrag und die Runtime waren dadurch inkonsistent.

## Korrektur
Commit `7ceec9d3b9d6e4d130924c8b34037ec65f325f2b`:
- RF01 simuliert jetzt einen einmaligen Netzwerkfehler, gefolgt vom erfolgreichen Neuladen **derselben Kachel**.
- Der Test prüft `v1_tile_retry_scheduled`, die erfolgreiche zweite Kacheldarstellung sowie das Ausbleiben eines permanenten Fehlerdatensatzes.
- Kein produktiver Tile-Retry verändert, keine lokale 900-Sekunden-Gültigkeit eingeführt und keine wissenschaftliche Prüfung wiederholt.
- Der Vorgänger `ecdf435a5a8816d27adef2de0c4ba93bc3ce6e46` hatte die P7-010-Auslösung bereits im **öffentlichen** Repository verankert.

## Öffentliche CI
Automatisch ausgelöste GitHub Actions auf Korrektur-Commit:
- `41885112705` – P7-010-Raster-Mosaik
- `41885112629` – Einstellungen/Runtime
- `41885112690` – Shared Frontend
- `41885112662` – HA-Integration

Bei Berichterstellung waren die Läufe noch nicht abschließend beurteilt. Kein PASS ohne SUCCESS der konkreten CI-Ausführung.

## Unveränderte Freigabegates
WR-Python-Gesamtregression, sämtliche relevante öffentliche GR-CIs auf identischem Code-Commit, Release-/Asset-Parität und HA-DEV VM109 Realtest einschließlich Desktop/Android/iPad. Kein Zugriff auf HA DEV/PROD in diesem Vorgang.

**GitHub Actions nur in öffentlichen Repositories; private GitHub Actions ausdrücklich verboten.** TEST69 ist abgeschlossen. Diagnose- und Realtest-Exporte ausschließlich nach `TheDaimos/Project-Log-And-Export@main`; PROD VM101 nicht verändern.
