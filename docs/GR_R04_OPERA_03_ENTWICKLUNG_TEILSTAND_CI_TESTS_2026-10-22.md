# GR-R04-OPERA-03 – Entwicklungsstand nach Quellspiegel-Reparatur und ausführbaren OPERA-Vertragstests

**Datum:** 22.10.2026  
**Repository/Zweig:** `TheDaimos/gewitterradar@deploy/dev`  
**Ergebnis:** **NICHT ABGESCHLOSSEN – KEINE INSTALLATIONSFREIGABE**

## 1. Tatsächliche Programmänderungen

Der nachgewiesene CI-Fehler durch voneinander abweichende OPERA-V2-Verbraucherkopien wurde durch tatsächliche GitHub-Commits bearbeitet:

- `365004ac0633294144e4ef93a0644075f9a792b5` – `custom_components/gewitterradar/frontend/modules/weather/p7-010/raster-mosaic-consumer.js` auf kanonischen OPERA-V2-Stand synchronisiert.
- `af6ef962c15e710f020ac8fb3868e4d57c23e9d7` – `src/p7-010/raster-mosaic-consumer.js` synchronisiert.
- `4365826d6dd7b329ba65e37c55a3b1e42cd930a7` – `dashboard/dist/modules/weather/p7-010/raster-mosaic-consumer.js` synchronisiert.
- `04a57dd848ee7190f40c5a786ca9af3a72eaca95` – neue Hashwerte in `SHA256SUMS_FRONTEND.txt` eingetragen.
- `8fbb2bf561295010ce743e9f202998342690b047` – Prüfsummenliste in die vom Verifikationsskript verlangte deterministische Reihenfolge gebracht.
- `dd43831d802390ae41bdc7b4822571888b07b78f` – `scripts/test-p7-010-opera-functional.mjs` als neue echte JavaScript-Funktionsprüfung mit simulierten WebSocket-Antworten ergänzt.

Vier Consumerdateien wurden nach der Spiegelreparatur erneut aus GitHub gelesen. Sie hatten alle denselben Git-Blob-SHA `b958b56f96d4aaeb36445c19d96b21034c8853df`.

## 2. Durchgeführte Funktionstests

Die neue Testdatei prüft ausführbar, nicht nur über Textvergleiche:

1. Expliziten V2-WebSocket-Aufruf einschließlich `source_request`.
2. Unveränderten automatischen V2-Aufruf ohne Quellenwunsch.
3. Deaktivierten Provider.
4. Aktivierten Provider mit nicht freigegebenem Raster.
5. Falsche Provider- und Produktidentitäten.
6. Fehlende beziehungsweise abweichende Korrelationskennung.
7. Unerwartet positive Rasterfreigabe und Kachelantwort ohne Rasteraufbau.
8. Unbekannten Antwortzustand.
9. WebSocket-Transportausfall.

**Verifizierte Ausführung:** GitHub-Actions-Lauf [39785742899](https://github.com/TheDaimos/gewitterradar/actions/runs/39785742899), `P7-010 isolierte Raster-Mosaik-Abnahme`, für Commit `dd43831d802390ae41bdc7b4822571888b07b78f`: **SUCCESS**. Die bestehende Prüfschleife führt `scripts/test-p7-010-*.mjs` mit Node aus. Dieser Befund ersetzt keine echte Home-Assistant- oder Browserabnahme.

## 3. Weitere tatsächlich untersuchte CI-Probleme

Die älteren Läufe [39780079296](https://github.com/TheDaimos/gewitterradar/actions/runs/39780079296) und [39780079290](https://github.com/TheDaimos/gewitterradar/actions/runs/39780079290) hatten jeweils Auslieferungsabweichungen gemeldet. Nach dem ersten Spiegelabgleich scheiterte [39785198372](https://github.com/TheDaimos/gewitterradar/actions/runs/39785198372) im Schritt `Canonical frontend contract` mit `Checksum inventory stale`. Der GitHub-Actions-Ausdruck der tatsächlich neu gebauten Dateien wurde mit der gespeicherten Prüfsummenliste verglichen. Zunächst unterschieden sich zwei Raster-Verbraucherhashes; nach deren Korrektur stimmten die 248 Einträge als Menge überein, aber die Sortierreihenfolge nicht. Beide Ursachen wurden mit den oben angegebenen Commits bearbeitet.

Die übrigen Pflichtprüfungen auf dem aktuellen Testcommit waren zum Zeitpunkt der letzten bestätigten Abfrage noch nicht vollständig abgeschlossen. Daher **kein allgemeiner CI-PASS** und keine Releasefreigabe.

## 4. Weiterhin offene Implementierung

**Die vollständige OPERA-Integration wurde nicht fertiggestellt.** Offen bleiben insbesondere:

- Bedienbarer und gespeicherter OPERA-Menüeintrag in der bestehenden Ebenenverwaltung.
- Bindung dieser Auswahl an den vorhandenen V2-Verbraucher.
- End-to-End-Quellenwechsel Automatik ↔ OPERA mit Entwertung alter Antworten.
- Benutzerseitige OPERA-Statusanzeige und vollständige Einbindung in die Wetter-Engine-Diagnose.
- Wiederholte Menüwechsel, Kartenbewegung, Zoom, Kaltstart und V1-/V2-Regressionsnachweise in tatsächlicher Laufzeit.
- Sämtliche zugehörigen aktuellen erfolgreichen Pflicht-Workflows.
- Kontrollierte Realtests auf Home Assistant DEV VM 109.
- DEV-Version, freigegebener unveränderlicher Installationscommit und DRA-V2-Kandidat.

Der bereits vorhandene sichere OPERA-Verbraucher verweigert die Rasterdarstellung auch bei unerwartet positiven Antworten. **Dies ist ausdrücklich keine vollständige, bedienbare OPERA-Wetterebene.**

## 5. Schutz- und Freigabeentscheidung

WeatherRouter wurde nicht geändert. Es wurden weder HA DEV VM 109 noch HA PROD VM 101 neu gestartet oder aktualisiert. Kein automatisches Deployment. Es sind weiterhin keine wissenschaftlich freigegebenen OPERA-Rasterbytes nachgewiesen; OPERA-Raster bleibt gesperrt.

**Abnahme: NICHT BESTANDEN / GR-R04-OPERA-03 NICHT ABGESCHLOSSEN.** Die Code- und Testverbesserungen sind ein Teilergebnis, keine DRA-V2-Freigabe.

**C.K. – Eine Idee weiter gedacht.**
