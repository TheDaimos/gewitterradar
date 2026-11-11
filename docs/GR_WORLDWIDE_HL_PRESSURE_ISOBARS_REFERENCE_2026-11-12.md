# GewitterRadar Pro — Weltweite Hoch-/Tiefdruckgebiete und Isobaren

**Stand:** 12.11.2026 · **Status:** Fach- und Architekturplanung; **nicht implementiert**.  
**Hintergrund:** Betreiberwunsch für V4.11 FINAL; prioritäres Ziel: **WELTWEITE**, hochwertige Darstellung, nicht auf Deutschland/Europa/Nordics/Nordamerika begrenzt.

## GR-Prinzip

**WeatherRouter (WR) beschafft, validiert und entscheidet. GR rendert.** GR darf weder Modellprovider priorisieren noch Druckzentrum- oder Isobarenwerte aus optischer Schätzung erzeugen. WR liefert ausschließlich echte geografische, mit Provenienz, Modelllauf, Forecastzeit, Gültigkeit und Druckreferenz ausgewiesene Druckgeometrien. Ein einzelner Luftdruck-Punktwert ist keine Isobare. Nach Providerwechsel werden alte gültige Geometrien erst ersetzt, wenn der neue Satz vollständig geprüft ist. Keine GR-eigene 900-s-Datengültigkeitsgrenze.

Bereits im Premium-Menü vorbereitet: **Hochdruck Gold**, **Tiefdruck Violett**. Zukünftige UI: frei konfigurierbare hochwertige H/T-Symbole mit **hPa-Zentrum**, sauber abstands-/zoomabhängig beschriftete geschwungene Isobaren, unabhängige Sichtbarkeit/Opacity, optional Zeit-/Vorhersagewechsel. Bestehende Eye-/Neon-/Wind-/Temperatur-Referenzen und Premium-Icons unverändert bewahren. Neue Einstellungen über den bereits entwickelten und weiterhin erprobten **GR Settings Vault** speichern.

## Ergebnisse der amtlichen Recherchen

| Quelle | Für H/T nutzbar | Für Isobaren nutzbar | Abdeckung / Einschränkung |
|---|---|---|---|
| DWD ICON-EU | Druckextrema aus numerischem PMSL/QFF ableitbar | PMSL/Meereshöhenluftdruck GRIB2, WMS | Europa; weder fertiges Zentrum-GeoJSON noch Vektor-Isobaren bestätigt |
| DWD ICON Global | Druckextrema aus globalem PMSL ableitbar | Globales PMSL numerisch | Weltweit |
| ECCC GDPS | **Bereits fertig berechnete globale H/L-Zentren als GeoJSON (hPa), amtlich bestätigt** | GDPS-GRIB2 / GeoMet WCS/WMS; fertige Isobaren-Vektoren noch unbestätigt | Weltweit; sehr wichtiger Ansatz |
| ECCC RDPS und HRDPS | Ebenfalls fertige H/L-GeoJSON (amtlich bestätigt) | Regionale Modellfelder | Regionale Ergänzung in Kanada |
| ECMWF IFS | Druckextrema aus \`msl\`-Raster ableitbar | Globales \`msl\`-GRIB2, frei nutzbar mit Attribution | Weltweit, unabhängige Modellfamilie |
| MET Norway | Regional ggf. fachliche Wetterkarte (PNG) | THREDDS numerische Raster | Regionale Zusatzquelle, kein bestätigter Kontur-Vektorfeed |
| FMI | bisher keine fertigen H/T-GeoJSON bestätigt | HARMONIE/MEPS \`Pressure\`-GRIB2/NetCDF | Nordics; Referenz des Druckparameters erst prüfen |
| SMHI | bisher keine fertigen H/T-GeoJSON bestätigt | SNOW1G MultiPoint Raster, Feldparameter prüfen | Nordics/Regional |
| NOAA WPC | Bodenanalyse mit H/T und kodierten Bulletins, Parser unbestätigt | Wetterkarten inkl. Isobaren, KML enthält z. T. Rasterbilder | Nordamerika und angrenzende Gewässer, nicht global |

**Konkreter amtlicher ECCC-Dateinamensnachweis (Mai 2026):**

\`20260526T12Z_MSC_GDPS_HighLowPressure_MSL_LatLon0.15_PT012H.json\`

Quelle: [Offizielle ECCC-Mitteilung mit GDPS, RDPS und HRDPS GeoJSON](https://comm.collab.science.gc.ca/mailman3/hyperkitty/list/dd_info%40comm.collab.science.gc.ca/thread/PN4MKVVFV72TXSSW3G37WC4IZBPCMWGV/). Die echte Dateiverfügbarkeit und GeoJSON-Propertystruktur müssen noch am WR-Server geprüft werden.

**Optionale bezahlte Komplettanbieter:** [The Weather Company Surface Analysis Global](https://developer.weather.com/docs/openapi/surface-analysis-global-2-0) bietet komplette globale GeoJSON-Vektoren für H/L, Isobaren und Fronten, 3-stündlich; [Meteomatics Isolines / Highs-Lows](https://www.meteomatics.com/en/api/request/advanced-requests/isolines/) ebenso. Kostenpflichtige/API-Key-Zugänge nie ungefragt aktivieren.

## Ziel-Vertrag GR → WR

GR konsumiert getrennt nach Datenart, aber mit kohärenten Zeit-/Provenienzmetadaten:

- **\`pressure_centers\`**: GeoJSON Point H/L, Modell/Analyse, \`pressure_hpa\`, \`valid_at\`, \`valid_until\`, Modelllauf, Quellenangabe, Qualitätsstatus.
- **\`isobars\`**: GeoJSON Linien mit konstantem Druckwert (hPa) und für den gewünschten Zoom sinnvoller Kontur-Dichte.
- Optional **\`surface_analysis_raster\`**: WMS/PNG als rein optischer Fallback, niemals als interaktive Vektorzentren ausgeben.
- WR steuert weltweiten Modell-/Providerwechsel, Coverage-Gates, Freshness und Seamless Handover. Kein globales „ready“ bei ausschließlich regionaler Abdeckung.
- Browser/GR berechnet keine GRIB2-Druckkonturen. Einmaliges serverseitiges Berechnen und Cachen pro Modelllauf bei fehlenden Vektoren, wenn unter Ressourcenbudget möglich.

**ECCC GDPS H/L-Punkte** ermöglichen voraussichtlich globale H/T-Zentren ohne eigene numerische Extremwertsuche; die globale Isobarenversorgung kann über **DWD ICON Global, ECMWF IFS oder ECCC GDPS** mit kompaktem WR-Worker erfolgen. ICON-EU und nordische Modelle ergänzen für Detailregionen. **Keine feste Modellpriorität im GR.**

## Fachliche und visuelle Pflichtprüfungen

- Weltkarte einschließlich Pazifik, Südhemisphäre und Datumsgrenze, nicht nur EU-/Kanadazoom.
- Reale hPa-Werte und regionale/global kohärente Daten, keine gekachelten H/T-Dubletten, falsche Eigenminima oder frei erfundene geschlossene Isobaren.
- Korrekte Antimeridian-Geometrie, wenig Label-Kollisionen, minimale Bild-/Rendering-Last.
- Neuer gültiger Datensatz vollständig prüfen, bis dahin alten gültigen Stand behalten.
- Android, Desktop, iPad, HA DEV-VM109; PROD VM101 nicht automatisch verändern.
- Settings-Vault-Persistenz der neuen Darstellungsoptionen über weitere DRA-Updates.
- Alle bestehenden genehmigten V181-/späteren Referenzstände visuell unverändert.

## Kanonische Arbeitsdokumente

1. **WeatherRouter (privat):** [WR-SYNOPTIC-PMSL-GLOBAL-01 – Providerforschung und technischer Plan](https://github.com/TheDaimos/weather-router-dev/blob/deploy/dev/docs/p7-010-coordination/WR_SYNOPTIC_PMSL_GLOBAL_PROVIDER_RESEARCH_2026-11-12.md).
2. **DEV-Toolkit (privat):** [Wiederverwendbares Welt-Synoptik-Providerwissen](https://github.com/TheDaimos/home-assistant-dev-toolkit/blob/main/knowledge/weather/SYNOPTIC_PRESSURE_GLOBAL_PROVIDER_REFERENCE_2026-11-12.md).
3. **Offizielle Open-Data-Referenzen:** [ECCC GDPS](https://github.com/ECCC-MSC/open-data/blob/master/docs/msc-data/nwp_gdps/readme_gdps-datamart_en.md), [ECMWF Open Data](https://www.ecmwf.int/en/forecasts/datasets/open-data), [FMI Modelldaten](https://en.ilmatieteenlaitos.fi/open-data-manual-forecast-models), [DWD NWP v1](https://opendata.dwd.de/weather/nwp/v1/m/).

**Status bei Anlage:** Es wurden ausschließlich Recherche- und Architekturdateien erstellt. Kein WR-PMSL-/H/T-Datenabruf implementiert, keine neue WR-Capability offiziell live registriert, keine neue DRA-Version oder HA DEV-Installation behauptet. Weiteres Vorgehen: tatsächliche ECCC-GDPS GeoJSON auf WR DEV verifizieren, anschließend providerneutralen H/T-Vertrag und globale Isobaren-Fallbacks implementieren und testen.
