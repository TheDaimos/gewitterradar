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
