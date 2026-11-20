# GR – Premium-Legenden Wind und Temperatur – DEV Zwischenstand (08.11.2026)

## Nutzerauftrag
Direkte Quellcode-Anpassung statt Bildgenerierung. Gemeinsames Premium-Schließen-Asset, Minimieren/Maximieren, funktionierende Klassen/Balken-Umschaltung, Advektionswerte am Farbverlauf, einklappbare Hilfetexte/Skala und gespeicherte Wahl. Bestehende Wind-, Temperatur- und Niederschlagsfunktionen schützen.

## Implementierung auf deploy/dev
- `frontend/modules/weather/legend-overlay.js`: vorhandenes `gewitterradar-about-close-premium.webp` als Schließen-Symbol, neue Minimieren-/Maximieren-Schaltfläche und Premium-Zustandsdesign. Änderungsparität in drei Auslieferungsverzeichnissen hergestellt.
- `frontend/modules/weather/temperature-legend.js`: Klassen/Balken-Auswahl aktiv, Legendeneintrag inklusive Farbmarken, Advektionsmarken in K/h und Chevron-Bereich. Wahl wird gespeichert.
- `frontend/modules/weather/temperature-data.js`: Persistenz und Validierung der Unteransicht für Temperatur- und Advektionslegende.
- `scripts/test-v41140-module-manifest.mjs`: Erwartung an tatsächliche 36 Module der bestehenden 4.11.157-Runtime angepasst (vorher eingefrorene 35).

## CI-Status / keine Freigabe behaupten
Die öffentliche CI läuft nach den Quelländerungen erneut an. Zuletzt beobachtet: TEST70-76 SUCCESS, V4.11.106 settings SUCCESS; Modul-Konsistenz hatte eine veraltete 35-Modul-Assertion, nun angepasst. Shared frontend FAIL: bestehende Tests in `tests/gr-flow-curves-01.test.mjs`, `tests/gr-temp-world-01.test.mjs` und `tests/gr-wind-fix-01.test.mjs` enthalten unveränderte Volltextvergleiche der `legend-overlay.js` mit älteren Commits. Diese Schutztests müssen in einen präzisen Vertrags-/Regressionsschutz umgebaut werden, der absichtliche Legenden-UI-Erweiterungen zulässt, meteorologische und Niederschlags-Funktionen aber weiter schützt.

**Keine bestätigte installierbare neue DRA-Version und keine Endgeräte-Realabnahme für diese Änderungen.** Bereits bestehende Versionskennung in `frontend/version.js`: GR 4.11.157 DEV, HA 0.25.64. Kein eigenständiger Versionsbump im Zuge dieses Zwischenstands durchgeführt.

## Offene Freigabearbeiten
1. Zielgerichtete Tests für Klassen/Balken, Chevron, Minimierung, Premium-Close sowie Temperatur/Advektion.
2. Legacy-Volltext-Schutztests ohne Schwächung der fachlichen Schutzkriterien aktualisieren.
3. Frontend-Parität einschließlich Release-Verträgen, Hashes und installierbarer DRA-Pakete verifizieren.
4. Öffentliche CI vollständig grün und gezielte Realtests auf DEV mit Android/iPad.

## CI-Nachtrag: 08.11.2026 – Paketkonsistenz erfolgreich

Die vollständigen 308 SHA-256-Paketzeilen wurden direkt aus der öffentlichen CI ermittelt und in `SHA256SUMS_FRONTEND.txt` übernommen (Commit `2c32b03775e676a61b27c547e78feb13b3f7e3ce`). Der kurzzeitig erweiterte Diagnoseausdruck wurde anschließend zurückgenommen.

**Vollständig grün am geprüften Commit `f2376531302386122c92d9e2bdd9b29650631e5a`:**

- Validate Gewitterradar integration: SUCCESS.
- Validate shared Gewitterradar frontend: SUCCESS.
- V4.11.106 settings navigation and runtime identity: SUCCESS.
- TEST70-76 full repository 900-second audit: SUCCESS.

CI: https://github.com/TheDaimos/gewitterradar/actions/runs/42467413368

**Freigabebeschränkung:** Die DRA-Produktversion ist weiterhin `4.11.157 DEV` / HA `0.25.64`. Diese Arbeit hat die Versionsnummer nicht erhöht, somit ist **keine neue Versionsnummer in DRA nachgewiesen**. Die Geräterealtests und die Bestätigung einer neuen installierbaren DRA-Version sind offen. Diese Angaben sind absichtlich von der bestandenen öffentlichen CI getrennt.

## Nachtrag – Premium-Schließen und lesbare Klassen / neue Versionskennung

Die von Benutzer-Screenshots belegten Folgeprobleme wurden auf `deploy/dev` behoben:
- Die gemeinsame Legende lädt das vorhandene Premium-Schließen-Asset relativ zum ausgelieferten Frontend-Modul (`new URL('../../assets/gewitterradar-about-close-premium.webp', import.meta.url)`), statt eines je nach Hosting unzutreffenden absoluten `/local/`-Pfads.
- Temperaturklassen sind in einer dreispaltigen, mobil lesbaren Farbchip-Rasterdarstellung mit eigenem Wert je Klasse organisiert. Advektionswerte erhalten eigene, voneinander getrennte Felder statt aneinandergeklebter Texte.
- Neue **Gewitterradar V4.11.158 DEV / HA V0.25.65**, Runtime `411158r1`, Modulsatz `E411-158A1` in Frontend, Integrationsmanifest, Build-Info, DRA-Provenance und Build-Vertrag angeglichen.
- Laufzeitmanifest-Asset-SHA sowie das SHA256SUMS-Verzeichnis mit 308 Paketdateien anhand öffentlicher CI berechnet und angeglichen.
- Historische CI-Prüfungen für 36 vorhandene Module und dynamische V4.11-DEV-Identität angepasst, ohne den geschützten About-Golden-/Browservergleich zu entfernen.

**Öffentliche CI: vollständig SUCCESS** für Implementierungscommit `dac628002b18136f83f9e96a490d3cd265649bd2`:
- Shared Frontend: https://github.com/TheDaimos/gewitterradar/actions/runs/42469743114
- Integration: https://github.com/TheDaimos/gewitterradar/actions/runs/42469743093
- Settings / Runtime Identity: https://github.com/TheDaimos/gewitterradar/actions/runs/42469743089
- 900s Audit: https://github.com/TheDaimos/gewitterradar/actions/runs/42469743084

Die installierbare DRA-Metadatenkennung wurde auf V4.11.158 angehoben. **Die Anzeige eines Updates im DRA-Client und ein Gerätetest sind nicht direkt verifiziert.** WR wurde nicht verändert; die vorherige reale Funktionsreferenz bleibt geschützt.
