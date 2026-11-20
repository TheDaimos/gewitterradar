# GewitterRadar DEV · Nachbesserung Sprache, UI und DWD/OPERA

Ausgangsstände am 17.11.2026 sind GR 4.11.225 / HA 0.25.132 auf `4db38fd6c41d327c6d4ece126168927accf536a4` und WeatherRouter `f748d214bd152d78a42c3041c84028881724e128`. Referenzen sind das freigegebene Paar WR 0.10.320 / GR 4.11.195 sowie die geschützten historischen GR-Stände.

Die UI-Arbeiten betreffen sichtbare Texte und Aktionen in Einstellungen, Diagnose, Temperatur, Wind, Wolken und Übersicht. Gemeinsame Risiken sind Spracheinstellungen, Fokus und Eye-Bedienung. Renderer, Provideraufrufe, Profile, Exportschema und Gesten bleiben außerhalb dieser UI-Arbeiten. Die Radarprüfung verfolgt getrennt die WR-Quellfreigabe und die GR-Ausführung von Rastermasken. Die gelieferten Vergleichsbilder sind eine visuelle Referenz ohne gemeinsam verifizierten Frame-Zeitstempel.

## GewitterRadar 4.11.226 DEV / HA 0.25.133

Runtime `411226r1`, Modulset `E411-226A1`, 37 registrierte Module. Der bestehende Katalog enthält 186 zusätzliche Einträge pro Variante, insgesamt 3.534 Werte. Der Audit vergleicht alle bisherigen Katalogwerte mit 4.11.225 und prüft Schlüssel, Platzhalter und Fallbacks in 19 Varianten. Griechisch wurde bei allen neuen Diagnoseeinträgen sprachlich überarbeitet. Für mehrere weitere Varianten wurden lokale maschinelle Entwürfe und manuell geprüfte Hauptbeschriftungen verwendet. Die idiomatische Endabnahme dieser übrigen Einträge und die Sichtung aller dynamischen Zustände im echten HA bleiben offen.

Der Paketquellcommit ist `57b6ee5ef8a96f7dae88613656d1d6c09e9a5236`. Die Archivprüfung am Paketcommit `391f69103e65556a32132929711fafb747312b9b` validierte 204 bytegleiche gemeinsame Frontend-Dateien. Die GitHub-Digests stimmen mit den lokalen Prüfsummen überein. [GitHub-DEV-Entwurf](https://github.com/TheDaimos/gewitterradar/releases/tag/untagged-06985327ee611b200ea7)

| Installationsarchiv | Dateien | SHA-256 |
|---|---:|---|
| `gewitterradar-0.25.133-dev.zip` | 222 | `d784e5daa23fb6b1eb072b669cf3fbd07f2d4c720c575c7102db705b1dd33aee` |
| `gewitterradar-dashboard-4.11.226-dev.zip` | 206 | `effe0a09dcf87589892150eed76f57e40fc4e528bf7846f0ecccdd1b77926603` |

| Nr. | Änderung | Nachweis |
|---|---|---|
| 001 | Wetterdaten, Diagnosewerkzeuge, Layout, Kartendiagnose und Testfunktionen in Menüs, Navigation und relevanten Beschriftungen | Chromium-Sprachmatrix, 19 Varianten |
| 002 | Bedientexte, Filter, Tabellen und Statusanzeigen in 7.2 und 7.3. Objektfelder, Anfragen, Ergebniscodes und der JSON-Export behalten ihre maschinenlesbaren Werte. | Browser-Sichtprobe, Quelldiagnose und V2-Transportvertrag |
| 003 | Lokalisierte Überschrift der Temperaturdiagnose, numerisches Diagnoseobjekt weiterhin als JSON | Chromium-Sprachmatrix und JSON-Parse |
| 004 | Lokalisierte Wind-Leistungsdiagnose einschließlich Messwertbezeichnungen und ausgeschalteter Messung | Chromium-Sprachmatrix und Wind-/Renderer-Quellvergleich |
| 005 | Das vorhandene runde Premium-Schließen-Asset sitzt in einer runden Hitbox. Das Bereitstellen der Wolkenebene und Minimieren verblieben in den bestehenden Pfaden. | Chromium-Wolkenlauf mit Tap, Hold und Drag |
| 006 | PRO-Wortmarke und Signatur nutzen denselben Project-Hub-Einstieg. Das nach der WeatherRouter-Erkennung geladene Logo erhält Click- und Tastaturbedienung. | Chromium auf Desktop und touchfähigem Profil, übereinstimmendes Iframe-Ziel |

Die Matrix lief mit dem gepackten HA-Frontend bei 320 px und dem Dashboard bei 1.177 px. Die Node-Suite bestand mit 182 von 203 Tests und denselben 21 Fehlernamen wie 4.11.225 sowie 4.11.222. Fünf synthetische Eye-Durchläufe mit Bedienung nach 0, 1, 2, 3, 5 und 10 Sekunden sowie verspätetem Capture-Verlust bestanden. Der Betreiber bestätigte die VM109-Sitzung in Mozilla Firefox. Computer Use blockierte die Browserprüfung, weil die URL-Policy für Firefox in dieser Windows-Sitzung nicht unterstützt wird. Damit bleiben HA-Installation, physische Android-Abnahme und Real-Screenshots offen.

Neun von zwölf GitHub-Workflows bestanden. Die drei verbleibenden Fehler reproduzieren die dokumentierten 4.11.225-Befunde. Der WEICH-05-Stub lädt `import.meta` als klassisches Skript, die ältere Vault-Abnahme erwartet den unveränderten Consumer-Quelltext und HACS meldet SPDX `NOASSERTION`. Die gezielten Diagnose-, Wind-, Radar- und Paketprüfungen bestanden lokal. [Shared Frontend](https://github.com/TheDaimos/gewitterradar/actions/runs/44083642353), [Vault](https://github.com/TheDaimos/gewitterradar/actions/runs/44083642359), [HACS](https://github.com/TheDaimos/gewitterradar/actions/runs/44083642171)

## DWD/OPERA · reproduzierter Abdeckungsfehler

1. Im geprüften WR-DEV-Quellcode erzeugt `complete_spatial_plan()` in `raster_mosaic_spatial.py` die OPERA-`draw_exclusions` aus der gesamten `machine_coverage` jedes zugelassenen DWD-Layers. Der GR-Renderer `protectedRasterRects()` in `radar-mask.js` setzt diese Rechtecke um. Das Rechteck entscheidet auch dann, wenn die DWD-Zelle keine Daten enthält. Der echte OPERA-Wert ist für die Maskenentscheidung unerheblich.
2. Der DWD veröffentlicht für seinen Layer `Niederschlagsradar` eine rechteckige Grenze von 1,4633° bis 18,7316° Ost und 45,6846° bis 56,2194° Nord. Die DWD-Stichprobe vom 17.11.2026 um 10:45 UTC verglich WCS-GeoTIFF und WMS-PNG desselben Layers mit gleichem räumlichen Raster und gleicher angeforderter Gültigkeitszeit. Das WCS-Produkt enthält getrennt positive Werte, echte Nullwerte und NoData. Die Publikation weist für den Layer zusätzlich eine Modelllauf-Dimension aus. Die GR-Betreiberaufnahme ließ sich keinem konkreten DWD-/OPERA-Lauf zuordnen. [DWD-WMS-Metadaten](https://maps.dwd.de/geoserver/dwd/wms?service=WMS&version=1.3.0&request=GetCapabilities), [DWD-WCS-Rasterschema](https://maps.dwd.de/geoserver/dwd/wcs?service=WCS&version=2.0.1&request=DescribeCoverage&coverageId=dwd__Niederschlagsradar)
3. Das isolierte WMS-PNG enthält selbst violette Konturpixel. Der offizielle WMS-Stil weist der Klasse „Keine Daten“ ein teiltransparentes Grau zu. In der Stichprobe hatten 229.336 von 229.343 Zellen mit Rohwert −999 sichtbare Alpha-Werte. Alle 136 Roh-Nullzellen waren transparent. Auch zahlreiche mit dem TIFF-NoData-Sentinel gekennzeichnete Zellen waren transparent. Transparenz allein kann daher trockene Zellen und fehlende Werte nicht auseinanderhalten. [DWD-WMS-Stil](https://maps.dwd.de/geoserver/dwd/wms?service=WMS&version=1.1.1&request=GetStyles&layers=Niederschlagsradar)

| Position, °E / °N | DWD-WCS-Rohwert | DWD-PNG RGBA | GR-Sperre bei veröffentlichter DWD-BBox |
|---|---:|---|---|
| 4,55 / 51,75 | −999 | 126, 126, 126, 77 | OPERA gesperrt |
| 5,50 / 51,90 | 0,242 | 153, 204, 1, 255 | OPERA gesperrt |
| 7,60 / 49,98 | 0 | 255, 255, 255, 0 | OPERA gesperrt |
| 13,80 / 50,60 | −999 | 126, 126, 126, 77 | OPERA gesperrt |
| 14,20 / 48,70 | TIFF-NoData | 126, 126, 126, 77 | OPERA gesperrt |

Der Sperrtest verwendet die veröffentlichte DWD-BBox und die tatsächliche GR-Maskenfunktion bei Zoom 6. Er reproduziert den Fehlerfall unter der Voraussetzung, dass WeatherRouter beide Quellen zulässt. Die tatsächlich autorisierten OPERA-Pixel und der konkrete WR-Antwortsatz des Betreiberframes fehlen. Der zeitnahe Export2Git-Eintrag enthielt nur Diagnosen des Deploy Relay Agent. Ein neuer gemeinsamer Export2Git-Nachweis steht aus.

**Radarstatus offen.** Es wurde keine Laufzeitkorrektur ausgeliefert. Eine Freigabe allein anhand der Grau- oder Alphawerte würde transparente Nullwerte und ungültige Werte außerhalb der ausdrücklich markierten Klasse falsch behandeln. Für die vollständige Reparatur braucht WR eine framegenaue Gültigkeitsmaske für denselben DWD-Lauf und einen budgetneutralen Ladepfad. Die bisherige WMS-Abfrage liefert der laufenden Anwendung kein solches Validitätsfeld. Der öffentlich abrufbare WCS-Ausschnitt belegt die Trennbarkeit der Rohwerte, benötigt im aktuellen Aufbau allerdings einen zusätzlichen Datenabruf. Die verifizierte DEV-Abnahme muss danach OPERA-Zuordnung, Panning, Zoom und beide Ladefolgen über dieselben Grenzpunkte einschließen.
