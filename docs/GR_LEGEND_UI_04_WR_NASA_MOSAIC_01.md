# GR-LEGEND-UI-04 / WR-NASA-MOSAIC-01 · 2026-11-06

WR **0.10.292 DEV / Loader 295**, GR **4.11.145 DEV / HA 0.25.52**.
Kanonisch: privates `TheDaimos/weather-router-dev@deploy/dev` und
öffentliches `TheDaimos/gewitterradar@deploy/dev`. Öffentliche Actions nur im
GR-Repository; private Actions bleiben deaktiviert. Technische Diagnose- und
HA-Realtestexporte ausschließlich `TheDaimos/Project-Log-And-Export@main`.
VM109-Realabnahme ausstehend; VM101 nicht berührt. Referenzstände WR289/GR141
werden nicht verschoben. Keine Wiederholung oder Änderung von TEST69.

## Legende und Eye-Menü

Die vorhandene Legendenverwaltung zeigt native diskrete Farbklassen; keine
externen Links, WMS-Bilder, Popups oder RGB-Rückrechnung. Gemeinsamer Metallrahmen
aus der bestehenden Settings-Komponente für Eye und Legende, einschließlich
Rahmenstärke und Schatten. Originaler Chevron und seine vorhandene .42-s-Animation.
Regen und Schnee unabhängig einklappbar, Position unverändert beim Einklappen.
Klassen/Balken und beide Abschnittszustände werden im vorhandenen UI-Zustand
gespeichert. Maus-/Touch-Drag und relative Position bleiben erhalten.
Normale Desktop-/Mobilkarten benötigen keinen Scrollbalken; kleine Sonderformate
behalten notwendigen Zugang zu allen Inhalten. Die 110 NASA-Originalklassen sind
im Klassenmodus per Klassenwahl und Farbprobe vollständig zugänglich; der Balken
enthält genau dieselben diskreten Segmente. Segmentbreite ist keine lineare
Messwertachse. Modi, Interpolation, Deckkraft und Auflösung bleiben unverändert.

OPERA: unveränderte 15 WR-Rendererklassen und mm/h-Grenzen. DWD: originale
Stilmetadaten; Raster bleiben unverändert. Der öffentliche Raster-Normalisierer
erhält nun begrenzte native Klassen/Einheiten/Ticks und höchstens zwei Phasen.
Er überträgt keine beliebigen geschachtelten Providerinformationen.

NASA-Originalquelle: [GIBS GPM_Precipitation_Rate.xml](https://gibs.earthdata.nasa.gov/colormaps/v1.3/GPM_Precipitation_Rate.xml),
durch [WMTS-Capabilities](https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/1.0.0/WMTSCapabilities.xml)
für `IMERG_Precipitation_Rate_30min` deklariert. SHA256 der abgerufenen Originaldatei:
`c62b5da425e1f831fe1cbe9119f7806c31922a5aa7d63134a94058c0929d11cd`.
Je 110 originale Regen-/Schneefarbklassen, von 0.1 bis ≥53.0884 mm/h.
Originaltickbeschriftungen bleiben erhalten. Schnee ist laut
[NASA Worldview-Fachbeschreibung](https://gpm.nasa.gov/data/visualization/worldview)
Flüssigwasseräquivalent: Anzeige **mm/h SWE**, ausdrücklich keine Schneehöhe.
Keine erfundenen Schneeschwellen. Unpassende Schnee-Messgrößen/Einheiten erzeugen
keine Skala; fehlende Metadaten blockieren nicht die Regenlegende.

## Tatsächlich implementierte NASA-Mosaikergänzung

Administratoreinstellung im WR Lab unter Niederschlagsmosaik:
**NASA IMERG als ergänzende Niederschlagsquelle**, Standard **Aus**.
Speicherung ausschließlich in WR-Optionen; neues adminpflichtiges WebSocket
`weather_router/precipitation/settings`. Bestehende Optionen bleiben erhalten.
`weather_router_routing_changed` meldet die Änderung an GR. Keine zweite
GR-Providerwahl oder zusätzliche Zeitpolitik. Bestehendes globales Provider- und
Consumer-Profil-Deny bleibt maßgeblich; der Schalter aktiviert keine gesperrte Quelle.

WRs bestehender V2-Service plant die Radarquellen unverändert. NASA wird danach
mit eigener WR-Zeitfreigabe und expliziten freien Quellkacheln ergänzt; die
relative DWD-/OPERA-Reihenfolge bleibt erhalten. Gültige trockene Radarbereiche
sind genauso reserviert wie nasse. Die erste Ausbaustufe reserviert die gesamte
verifizierte Hülle jeder autorisierten höherwertigen Quelle, selbst bei momentan
fehlgeschlagenem Rasterabruf. Letzte verifizierte Hüllen werden begrenzt im
HA-Arbeitsspeicher behalten. Fehlt bei einer autorisierten Quelle die geografische
Evidenz, bleibt NASA gesperrt. Auch wegen Kontaktbudget nicht untersuchte Quellen
werden nicht als freier Raum angenommen. Keine Transparenz-/NoData-Vermutungen.

**Bewusste Genauigkeitsgrenze:** Kachelstufe, keine Pixelmaske. Löcher innerhalb
einer Radar-Hülle werden nicht durch NASA gefüllt. NASA erscheint nur in ganzen
Quellkacheln außerhalb aller reservierten Hüllen; selbst Randkontakt ist gesperrt.
`spatial_policy.kind=exclusive_tiles_v1` trägt WRs exakte Freigaben; eine spätere
feinere Maske kann den additiven Vertrag erweitern. Andere Radarprovider können
ihre verifizierte Coverage in dieselbe Reservierung einbringen.

`context.tile_zoom` ist eine optionale geometrische V2-Erweiterung. Der Server
berechnet 1.30 × sichtbare Breite und 1.30 × Höhe in Web-Mercator, also 15 % pro
Seite und ungefähr 169 % Fläche. Datumsgrenze/Polargrenzen werden begrenzt.
Nur geschnittene, freigegebene XYZ-Quellkacheln werden angefordert, kein Weltabruf.
Höchstens 48 NASA-Quellkacheln pro Plan, bis zum nativen Zoom 6; nötigenfalls
reduziert WR den Quellzoom. GR schneidet beim Overzoom vorhandene Vorfahren aus.
Auflösung und Modi der Radarquellen werden dabei nicht verändert.

NASA-Metadaten starten in einem separaten HA-Job parallel zu Radar-Preflights;
höchstens ein Job, 15 s Deadline, frühestens nach 60 s erneut. Das ist eine
Kontaktbegrenzung, keine Verlängerung der Datengültigkeit. Der Radarpfad wartet
nicht auf diesen Job. V2 meldet begrenzte Pending-/Planungszyklus-Hinweise; GR
fragt bei Bedarf begrenzt erneut nach. Nach Eingang werden NASA-Kacheln parallel
zu Radar angefordert und unabhängig in ihre exklusiven Canvas-Kacheln gezeichnet.
Gemischte Generationen warten für die Freigabe nur auf die regulären Radar-
Kacheln. Eine ausschließlich aus NASA bestehende Ansicht benötigt ihr erstes
erfolgreich gezeichnetes Bild und hat eine endliche Transportfrist.

NASA übernimmt WRs bereits bestehenden 12-h-Satellitenrahmen. Eigenes valid_at,
valid_until, age_seconds und Abstand zur Radar-Referenzzeit bleiben sichtbar.
Kein gemeinsamer Beobachtungszeitpunkt wird vorgetäuscht. `at_time` wird nicht
aufgeweicht. GR prüft nur die absolute WR-Deadline. Die eingeschaltete räumliche
WR-Politik sperrt einen Fehlerfallback zu unbeschränkter V1-NASA-Darstellung.
Abschalten widerruft NASA-Bildleases und leert ausschließlich NASA-Canvases;
Radar bleibt erhalten, bis der neue WR-Plan bereitsteht.

## Temporäre Wiederverwendung und Speicher

Keine Dateispeicherung, kein NASA-Ringpuffer, kein IndexedDB/localStorage für
Raster, kein historischer Bildbestand. GIBS `Cache-Control: no-store` wird nicht
durch einen persistenten Cache umgangen. Nur laufende/aktive Rendergenerationen
halten Bildleases. Quelle, Framezeit und exakte URL bilden den gemeinsamen
Schlüssel; überschneidende aktive Generationen teilen erfolgreiche und laufende
Anfragen. Letzter Besitzer entfernt/annulliert die Referenz. Nicht mehr benötigte
Generation und Abschalten geben ihre Leases frei.

Zwei gleichzeitige NASA-Transporte insgesamt, höchstens drei Versuche je
fehlgeschlagener Quellkoordinate, je 8 s Transportdeadline. Erfolgreiche
Nachbarkacheln werden nicht erneut geladen. Global höchstens 128 aktive
256×256-Bilder über alle Karten/Generationen: **32 MiB geschätztes RGBA**.
Abweichende Bilddimensionen werden abgewiesen. Hinzu kommen begrenzte temporäre
komprimierte Antworten (höchstens zwei laufend), Browser-/GPU-Kopien und die
bereits viewportgebundenen Leaflet-Canvases. GPU-Kopien können nochmals ungefähr
denselben Bildspeicher beanspruchen; der Browser bestimmt den tatsächlichen
Texturspeicher. Die kleine frühere 8.517-Byte-PNG-Stichprobe ist ausdrücklich
keine allgemeine Obergrenze. Diagnose meldet Anzahl aktiver Bilder, Transporte
und RGBA-Schätzung; die 32 MiB sind keine Behauptung über den Gesamtprozess.
Der OPERA-HDF5-Ringpuffer bleibt vollständig unverändert.

## Gezielte Prüfungen und Bereitstellung

- 58 isolierte WR-Fälle: Mercator-Padding, Datumslinie, Reservierungen auch bei
  trockenem/fehlgeschlagenem Radar, Unknown-Coverage-Sperre, paralleler realer
  Handlerpfad, unveränderte Default-Planung, WR-Zeitgrenzen, originale Klassen,
  administrative Option einschließlich sofortigem Widerruf.
- 44 bestehende WR-Vertrags-/Versions-/HTTP-Fälle plus 16 Unterfälle bestanden;
  keine wissenschaftliche Neuberechnung und kein TEST69-Lauf.
- 22 gezielte GR-Fälle: bisherige 14 plus neue Schnee-/UI- und NASA-Pfade;
  echte Staging-Methode mit verzögerten synthetischen Bildern, Radar ohne NASA-
  Wartezeit, NASA-only-Erstbild, Retry, Deduplizierung, 128-Bilder-Grenze,
  Generation-Abbruch, Freigabewiderruf und fehlender Legacy-V1-Fallback.
- Lokales Chromium: 1280 und 375 px, echte ausgelieferte UI-Module und gemeinsame
  CSS-Regeln, originale Farbmetadaten auf synthetischer Karte. Rahmenparität,
  getrennte Animation, native Klassen, kein normaler Scrollbedarf, Touch-Drag,
  Reload/Ansicht/Position, keine externen Bilder/Links. Synthetische UI-Nachweise
  in GR `artwork/acceptance/gr-legend-ui-04/`; keine HA-/Provider-Realtestexporte.
- Bestehende öffentliche GR-Installations-/V2-/Frontendprüfungen sperren die
  Veröffentlichung bei Fehlern. Private WR-Actions bleiben deaktiviert.
- Installations-ZIPs, exakter Commit und SHA256SUMS werden als DEV-Prereleases
  über die bestehenden deploy/dev-DRA-Kanäle bereitgestellt. **Beide Projekte
  aktualisieren**, dann WR-Lab-Option einschalten. Alte V2-Clients ohne tile_zoom
  behalten den bisherigen Vertrag; neue GR-Version benötigt den passenden WR.

Installierbarkeit/Vertrag und synthetische Darstellung sind geprüft. Eine reale
NASA-/Radar-Überlagerungs- und visuelle Abnahme auf HA DEV VM109 wird damit nicht
behauptet; sie erfolgt anschließend durch den Anwender. Keine PROD-Verbindung.
