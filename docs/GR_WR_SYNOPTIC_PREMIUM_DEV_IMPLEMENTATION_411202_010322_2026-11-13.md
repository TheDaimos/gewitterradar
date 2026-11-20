# Synoptik Premium – tatsächlicher DEV-Implementierungsstand (13.11.2026)

**Kanonische Quellen:** `TheDaimos/gewitterradar@deploy/dev` und `TheDaimos/weather-router-dev@deploy/dev`.
**Aktuelle neu versionierte Implementierung:** GewitterRadar **4.11.202 DEV**, HA-Integration **0.25.109**, Runtime `411202r1`, Modulset `E411-202A1`; WeatherRouter **0.10.322 DEV**, Loader **325**.
**Schutzreferenz (unverändert):** WR 0.10.320/Loader 323 + GR 4.11.195/HA 0.25.102. Kein Eingriff in PROD VM101.

## Tatsächlich implementiert

- Isoliertes GR-Modul `frontend/modules/weather/synoptic-display.js`, separates Consumer-V2-Resolve für `weather.synoptic.pressure_centers` (ECCC GDPS) und `weather.synoptic.isobars` (NOAA GFS), GeoJSON-Punkt- und Linienprüfung, geografische Leaflet-Marker und Linien, WR-gesteuerte Gültigkeit, unabhängige Fehlerbehandlung.
- H/T-Schriftzeichen, Druckbeschriftungen in hPa, Symbolgrößen, gesonderte Farben, Isobarenlinienbreite und Beschriftungsdichte, Gesamt-/Teil-Deckkraft, optionales Glow.
- Autoritatives unverändertes Master-Icon aus `artwork/help-icons/hires/gr-synoptic-high-low-isobars-premium-original.png` als gespiegeltes Runtime-Asset. Eye-Registry als fünfte **optionale** Funktion: alte vier Default-Slots bleiben **unangetastet**. Short-Tap, Long-Press, Drag über bestehende gemeinsame Interaktions-/Positionslogik.
- Eigenständiges Premium-Einstellungsfenster mit vorhandenen Premium-UI-Funktionen, Premium-Schließen-Asset, Minimierung und Sektionen. Eigene `gewitterradar:synoptic-ui:v1`-Settings-Vault-Speicherung.
- H/T-spezifische, fachlich unpassende Felder aus dem Windmenü entfernt; gespeicherte `gewitterradar:wind-ui:v1`-Werte bleiben rückwärtskompatibel erhalten und werden idempotent in Synoptikfarben übernommen.
- Unveränderte autoritative Aura-Farbwerte aus `eye-hub-model.js` plus separate klassische Farbpalette; Farbänderung zeichnet geladene Geometrien neu ohne neue WR-Abfrage.
- Zentrale Transparenzsteuerung für Synoptik gesamt, H/T und Isobaren. Interne kompositorische Teilgruppen `centers`, `isobars`, `frontLines`, `frontSymbols`, `frontNeon` erlauben spätere granulare UI-Erweiterung ohne Renderer-Umbau.
- WR 0.10.322: neues, isoliertes `synoptic_wpc_fronts.py`, autoritative NOAA-WPC-`coded_sfc`-Fronttypen **cold / warm / occluded / stationary**, streng begrenzte Parsing-/Coverage-/Transportpfade, eigener `weather.synoptic.fronts`-Consumer-V2-Vertrag und NOAA-NWS-Provideranschluss. Regionaler Dienst für Nordamerika, keine synthetischen Fronten.
- GR zeichnet die tatsächlich von WR gelieferten regionalen Frontlinien optional mit Glow, stationsgebundene Rot-/Blau-Abschnitte, getrennten Frontenfarben, Neon-/Fronten-Hauptschaltern und eigener Deckkraft.
- Kein Frontsymbol wird ohne nachgewiesene Frontseite gezeichnet. Die WPC-Bulletins geben hier Typ und Linienverlauf, jedoch keine autorisierte Ausrichtung für Dreiecke/Halbkreise. Die separaten Symbol-Einstellungen sind vorbereitet, aber das tatsächliche Symbolrendering bleibt offen.
- Frontend-Quellcode, HA-Spiegel und Dashboard-`dist` sind synchronisiert; `build_info.py`, Manifest, Runtime-Manifest, DRA-Provenienz und Asset-Inventar stimmen mit der neuen Entwicklungsidentität überein. Build- und Inventarregeln auf 37 registrierte Module erweitert.

## Nachweise

- **Vorherige echte DEV-Quelltests:** 231 ECCC H/T (fünf Zentren), 232 NOAA-GFS-Isobaren (zwölf Konturen) unter WR 0.10.320; 233 DWD-QFF-WMS-Descriptor unter WR 0.10.321; 234 ECMWF-GRIB2-Datenreferenz, `decoded:false`. Nachweise in privaten Export2Git-Originalen `TheDaimos/Project-Log-And-Export@main`. Keine neue pauschale 231–234-Testserie durchgeführt.
- **Gezielte neue GR-Regression:** `tests/synoptic-dev-v411198.test.mjs` für GeoJSON, ungültige Frontrichtungen, Migration, Opazität, Asset-/Quellspiegel und Runtime-Kontrakt. Erfolgreicher öffentlicher CI-Lauf [43450302776](https://github.com/TheDaimos/gewitterradar/actions/runs/43450302776).
- **Auslieferungs-Build:** Workflow [43450948942](https://github.com/TheDaimos/gewitterradar/actions/runs/43450948942) erfolgreich nach Reaktivierung des vorhandenen Premium-Close-Assets und Ergänzung des Synoptik-Master-Icons im Asset-Inventar. Erzeugt identische installierbare Quellspiegel und `SHA256SUMS_FRONTEND.txt`.
- **WR WPC-Tests:** `tests/test_synoptic_fronts_322.py` mit synthetischen autoritativen Formaten im privaten Repo vorhanden. Keine private GitHub Action ausgelöst. Reale Netzwerk-/HA-DEV-Abnahme des Frontendienstes **nicht erfolgt**.
- **Keine vollständige Browser-/Android-/VM109-End-to-End-Abnahme behauptet.** Andere bestehende öffentliche CI-Suiten enthielten zwischenzeitlich fehlgeschlagene alte Referenz-/Inventarannahmen. Ein erfolgreicher Build und gezielte Regression sind **keine** vollständige HA-Realabnahme.

## Noch nicht fertig / externe Datenabhängigkeiten

1. **Meteorologische Frontensymbole:** Dreiecke und Halbkreise sowie ihre korrekte Bewegungsseite benötigen einen WR-genehmigten Richtungsvertrag oder eine andere offizielle Datenquelle mit Frontausrichtung; nicht aus Linienreihenfolge ableiten.
2. **DWD ICON-EU QFF-GetMap:** Descriptor real `ready`, aber HTTP-PNG-Abruf und Kartendarstellung bislang nicht als erfolgreich dokumentiert; kein falsches Raster-READY.
3. **ECMWF IFS GRIB2:** Datenreferenz bestätigt, numerisches `msl`-Decoding und Isobaren-/Rasterrendering noch offen.
4. **Echte Geräteabnahme:** WR 0.10.322 und GR 4.11.202 auf **HA DEV VM109** installieren, Sichtprüfung H/T, Isobaren, WPC-Nordamerika-Fronten, Eye, Menüs, Smartphone-Gesten; bestehende Regen-, Wind- und Temperaturanzeigen beobachten. PROD VM101 unangetastet.
5. **Weitere Premium-UI:** Feinabstimmung der identischen Windmenü-Optik und vollständige eigenständige Teiltransparenz-Regler für Frontsymbole/Frontgrenzen/Neon im zentralen Transparenzmenü sind noch nicht fertig. Vorhandene Opazitätsdomänen sind dafür vorbereitet.

**Keine Freigabe als neues geschütztes Referenzpaar:** Diese erfordert die ausdrückliche Betreiber-Abnahme auf DEV. Die gespeicherte Referenz 0.10.320/4.11.195 bleibt geschützt.
