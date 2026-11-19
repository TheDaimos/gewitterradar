# GewitterRadar 4.11.243 – FINAL-Gate-Reparatur ohne Produktänderung

**Quellbaseline:** GR 4.11.243 DEV / HA 0.25.150, Runtime `411243r1`, Modulset `E411-243A1`. Originaler Produktstand `a6d78afc3b641e76f044dddba45ff387d0c6389d`. Release-Freeze aktiv.

## Korrigierte Prüfverträge

- Modulregister-Test: Versionsvergleich erfolgt mit dem tatsächlich ausgelieferten `APPLICATION_RELEASE` statt fest codiertem `4.10.02`.
- Übersetzungs-Audit: Die **genau 30 bekannten** redaktionellen Änderungen gegenüber dem 4.11.223-Snapshot (11 Eye-Hilfe-Pfade und 19 `Eye Control`-Fenstertitel) werden ausdrücklich zugelassen und vollständig aufgezählt; andere Änderungen bleiben unzulässig. Vollständige 19-Sprachen-Schlüssel-, Platzhalter-, Leerwert- und Fallback-Kontrolle bleibt erhalten.
- FLK-01 V1-Rasterübergang: Die isolierte Test-VM enthält nun die vorhandenen WR-Abdeckungs-/Raster-Swap-Hilfsfunktionen, den aktuellen Tile-Staging-Entscheider und realistische Metadaten/Tile-Zähler. Die Tests für Erfolg, Fehler, veraltete Generation, Abbruch, Timeout und identische Bilder bestehen wieder; der produktive Rastercode wurde nicht geändert.
- Der Master `artwork/help-icons/hires/gr-storm-premium-original.png` (Git-Blob `e1d3ef5dd3b2af56fb12a46223ef09baa31f20a0`, 2.114.584 Bytes, eingeführt mit GR 4.11.230) ist nun zusätzlich im unveränderlichen Hi-Res-Retention-Vertrag registriert. Keine Grafik wurde ersetzt oder editiert.
- Der historische Weather-Engine-Overview-Test prüft die heutigen lokalisierten V1-/V2-Beschriftungen; die beiden V4.11.03/04-Tests prüfen die heutigen übersetzten Preload-Profilschlüssel.

## Tatsächlich ausgeführte Prüfungen

- **PASS:** `test-module-registry.mjs`, `audit-frontend-i18n.mjs` (19 Sprachen, keine leeren Werte/Fallbacks), `test-flk01-weather-radar-transition.mjs`, `test-v41184-weather-engine-overview.mjs`, `test-v41103-weather-radar.mjs`, `test-v41104-weather-radar.mjs`.
- **PASS:** `verify-current-frontend.mjs`, `verify-frontend.mjs`, `test-frontend-build.mjs`, `test-v41140-module-manifest.mjs`, `verify-about-locales.mjs`, `test-about-locales.mjs`, `test-v411-weather-router.mjs`, `test-v41108-project-hub.mjs`, `verify-source-archive-contract.mjs`, `test-v41102-weather-radar.mjs`, `test-v41105-weather-radar-player.mjs`, `test-v41106-weather-engine-diagnostics.mjs`, `test-recorder-locales.mjs`.
- **Nach diesem Commit erneut prüfen:** `verify-hires-asset-retention.mjs`, da dessen Vertrag den Git-HEAD statt uncommitteter Dateien einliest.

## Unveränderte Restgrenzen

- Ältere V4.07-Tests benötigen nicht vorhandene `artifacts/v407`-Quellartefakte; sie werden nicht fälschlich als aktuelle Release-Gates grün deklariert.
- In dieser Umgebung fehlen `pytest` und Browser-Testabhängigkeiten. Ein realer Android-/HA-Test und die breite CI nach dem Prüfcommit sind gesondert nachzuweisen.
- **Keine Produkt-/Frontend-/Runtimeänderungen**, keine neue Versionsnummer, keine Installation und keine PROD-Promotion. Die umfassende Betreiber-Sichtabnahme von GR 4.11.243 ist dokumentiert, die abschließende technische FINAL-Freigabe benötigt die noch offenen Gate-Nachweise.
