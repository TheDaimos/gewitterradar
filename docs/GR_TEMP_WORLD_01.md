# GR-TEMP-WORLD-01 · Temperatur, thermische Advektion und GeoPointContext

Stand: 07.11.2026. Gemeinsame Auslieferung mit GR-TEMP-WORLD-ICON-01 und GR-TEMP-UNITS-01. Entwicklungs- und Installationskanal ausschließlich `deploy/dev`. Keine automatische Installation und keine Änderungen an PROD VM101.

## Ausgangspunkt und Versionsumfang

Gewitterradar: 4.11.155 DEV / HA 0.25.62, Ausgangscommit `04b751fd3962150ed0369dba4428959e4a8e98bd`. Dieser ergänzt gegenüber `ca90c9010cb5093e435e1d1914c85815986f0b5b` ausschließlich die geschützte Temperatur-Baseline. Die Datei `GR_WR_TEMPERATURE_GEOPOINT_BASELINE_2026-11-07.md` bleibt unverändert. Die bestätigte Android-Windreferenz 4.11.152 / HA 0.25.59 bleibt erhalten.

WeatherRouter: 0.10.297 / Loader 300, Ausgangscommit `97a4974e8fc1ac5bcd6d4e5220fdcfc0a6d919e1`. Kanonisch bleibt das private `TheDaimos/weather-router-dev@deploy/dev`. Der öffentliche WR-Prüfstand ist keine Installationsquelle.

Neue gemeinsame Linie: **GR 4.11.156 DEV / HA 0.25.63 / Runtime 411156r1 / Modulsatz E411-156A1 (36 registrierte Module)** und **WR 0.10.298 DEV / Loader 301**. Kein Zwischenrelease für Icon oder Temperatureinheiten.

Bereits im Ausgangsstand gesondert nachgewiesene CI-Fehler: Der allgemeine Frontendtest erwartete noch 34 statt 35 Module (Lauf 42394807601); der HA-Identitätstest pinnt auf 4.11.148 (Lauf 42394807553, 1 Fehler / 62 bestanden). Beide Prüfannahmen beziehen sich jetzt auf die aktuelle autoritative Versions-/Modulquelle. Die geschützten meteorologischen Assertions bleiben bestehen. Der Ausgangsstand 155 wird nicht rückwirkend als vollständig grün oder physisch abgenommen bezeichnet.

## Datenvertrag und Quelle

Die vorhandenen Winddaten sind ein globales numerisches GFS-10-m-Windfeld sowie getrennte WR-Punktwerte. Ein globales numerisches Temperaturfeld war im Ausgangsstand nicht vorhanden. Die neue Capability ist additiv:

* HA-authentifizierter WebSocket-Befehl `weather_router/consumer/resolve_temperature_field`.
* `contract_version: 2`, Capability `weather.temperature.field_2m`, Kontext `{bbox:{west,east,south,north}}`.
* Zeit `{mode:"latest"}` oder `{mode:"at_time",at:ISO8601_mit_Zeitzone}`; keine zeitliche Interpolation. Die aktuelle GR-Oberfläche verwendet `latest`.
* `include_advection` fordert zusätzlich `weather.temperature.advection_850hpa` an. Profile können diese gesondert verweigern.
* Providerneutrales Routing über registrierte Provider-Fähigkeiten; vorhandener NOAA-Adapter liefert globale NOAA/NCEP-GFS-0,25°-Originalwerte über den bestehenden Unidata-NCSS-Endpunkt. Keine Punktabfragematrix und keine Auswertung von Bildfarben.
* Frame: numerische Kelvinwerte, 2-m-Höhe, EPSG:4326, reguläre Achsen, südlichste Zeile zuerst, Maske, Modelllauf, Gültigkeitszeitpunkt, serverseitiges Ablaufdatum, native und gelieferte Auflösung, Quellenangaben und WR-Aktualisierungshinweis.

WeatherRouter prüft Einheit, Höhe, CF-Koordinaten, Projektion, Zeit, Qualitätsmasken und Modellkohärenz. Router-, Domain-, Provider- und restriktive Profilregeln gelten vor und nach dem Abruf. Eine Freigabeänderung während des Transports kann keinen zuvor erlaubten Frame nachträglich einschleusen. GR prüft den Liefervertrag und die tatsächliche WR-Freigabe; es führt keine meteorologische Altersgrenze ein.

Die WR-Temperaturpolitik autorisiert einen aktuellen Modelllauf für höchstens 24 Stunden, maximal zehn Minuten zukünftige Uhrabweichung und `latest` innerhalb von drei Stunden zum nativen Zeitpunkt. Ein expliziter Zukunftszeitpunkt muss exakt auf dem gelieferten Modellzeitpunkt liegen und innerhalb des maximalen Modellhorizonts von 384 Stunden bleiben. Die einzelne Lieferfreigabe ist auf maximal 30 Minuten und den jeweils strengeren verbleibenden Zeitraum begrenzt. Das sind ausschließlich Regeln der neuen WR-Capability; Wind- und Niederschlagszeitpolitik bleiben unverändert.

Die Einzelzeitantwort behauptet keine aus ihr abgeleitete konstante Modell-Ausgabefrequenz. Modelllauf und tatsächlicher nativer Zeitpunkt bleiben explizit. Die dokumentierte 6-Stunden-Modellzyklik ist von einem zeitlichen Abstand zweier Temperaturfelder zu unterscheiden.

Quelle und technische Primärreferenzen: [NOAA GFS-Produkte](https://www.nco.ncep.noaa.gov/pmb/products/gfs/), [Unidata NCSS](https://docs.unidata.ucar.edu/tds/current/userguide/netcdf_subset_service_ref.html), [Unidata Nutzungsbedingungen](https://assets.unidata.ucar.edu/data/data_usage.html). Unidata ist ein Forschungsdienst ohne betriebliche Verfügbarkeitsgarantie. Es werden keine Schlüssel in das Frontend übernommen.

## Farbfläche, Werte und Einheiten

Die unabhängigen Komponenten sind Temperaturfarbfläche, native Temperaturbeschriftungen und thermische Transportpfeile. Gesamtanzeige und Einzelkomponenten lassen sich getrennt schalten. Standardmäßig ist die neue Darstellung aus.

Die kontinuierlichen Ausgangsstützpunkte lauten:

| °C | Farbe |
|---:|---|
| −40 | `#051b61` |
| −20 | `#1254d7` |
| 0 | `#10cbe2` |
| 10 | `#36b86d` |
| 20 | `#f1dc45` |
| 30 | `#f28a26` |
| 40 | `#dc3030` |
| 45 | `#dd237b` |
| 50 | `#8b38d9` |

Außerhalb des Bereichs wird die jeweilige Endfarbe beibehalten. Ungültige, nichtpositive Kelvinwerte und NoData bleiben transparent. Anpassbare Stützpunkte müssen steigen; der rote Stützpunkt darf nicht unter 35 °C, Magenta nicht unter 40 °C und der violette Endpunkt nicht unter 45 °C liegen. Der automatische/manuelle Legendenausschnitt verändert keine absoluten Farbschwellen. Diese sind Darstellungsparameter, keine Warnschwellen.

Beschriftungen stammen ausschließlich von gültigen nativen Gitterpunkten. Zoombedingte Belegungszellen verhindern Zahlencluster; höhere Dichte erfindet keine zusätzliche Modellauflösung. Farbflächen verwenden bilineare Darstellung ausschließlich innerhalb vollständig gültiger nativer Zellen; es gibt kein Überbrücken von Maskenlücken. Kooperative Bildvorbereitung und anschließende Canvas-Glättung erzeugen kontinuierliche Übergänge.

**GR-TEMP-UNITS-01:** Das zentrale, gespeicherte Auswahlfeld „Temperatureinheit“ bietet Celsius (Standard), Fahrenheit und Kelvin. `temperature-units.js` ist der gemeinsame Darstellungsvertrag für Karte, Legende, Inspector, Menügrenzen und spätere Temperaturansichten:

* °C = K − 273,15; °F = (K − 273,15) × 1,8 + 32; K = K.
* Interne WR-Werte bleiben Kelvin. Einheitenwechsel verändern weder Frame noch Farben, Advektionswerte oder Providerabfragen.
* Kelvin wird als `K`, niemals mit Gradzeichen, dargestellt. Kartenbeschriftungen sind auf ganze Anzeigegrade bzw. Kelvin gerundet; editierbare Skalenwerte behalten ihre Genauigkeit.
* Auch manuelle Skalenbereiche und Farbstützpunkte werden in der gewählten Einheit angezeigt und beim Bearbeiten in ihre einheitenunabhängigen Celsius-Darstellungsparameter zurückgeführt.
* Einheitentexte aller 19 registrierten Sprachen sind über den vorhandenen `_t`-Vertrag eingebunden; Zahlen verwenden dessen `_locale`. Sprachwechsel benötigen ebenfalls keinen Wetterabruf.
* Advektion bleibt als Temperaturdifferenz pro Zeit ausdrücklich `K/h`, unabhängig von der Einheit absoluter Temperaturen. Exportierte Rohdiagnosen behalten die wissenschaftlichen Kelvinwerte.

## Thermische Advektion

Die Pfeile folgen **U/V-Wind auf 850 hPa**, ihre Farbe beschreibt `−u·∂T/∂x − v·∂T/∂y` auf derselben 850-hPa-Ebene, umgerechnet in K/h. Dies vermeidet eine ungekennzeichnete Mischung von 2-m-Temperatur und 10-m-Wind. Die Oberfläche zeigt weiterhin 2-m-Temperatur; die Advektionslegende benennt die andere Ebene ausdrücklich. Die getrennte Winddarstellung zeigt weiterhin 10-m-Wind.

WR berechnet zentrierte horizontale Gradienten mit sphärischen metrischen Abständen und dem nativen Erdradius. Modelllauf, Zeit und Gitter aller beteiligten Größen müssen exakt zusammenpassen. Oberflächendruck unter 850 hPa maskiert unterirdische Modellpunkte; Masken gelten auch für alle vier Nachbarpunkte des Gradienten. Rand- und Polstencils ohne belastbaren Gradienten bleiben ausgespart. Der globale Längengradübergang ist zyklisch.

Positiv bedeutet Warmluftadvektion, negativ Kaltluftadvektion. Die Größe ist **keine vollständige lokale Temperaturänderung und kein 2-m-Trend**. Zwei verschiedene Zeitfelder sind für `ΔT` erforderlich; ein einzelner Frame erzeugt keine erfundenen Prognosewerte. Fachlicher Bezug: [Penn State, horizontale Advektion](https://courses.ems.psu.edu/meteo300/book/export/html/2).

Farben: `#247aff`/`#6edbff` kalt, `#e8edf1` annähernd neutral, `#ffab50`/`#fa413b` warm, `#e9449a` stark warm. Die eigene Advektionslegende unterscheidet diese Skala von absoluter Temperatur. Tempo, Dichte, Größe, Deckkraft, Farbdifferenzierung, Warm-/Kaltfilter, Schwelle und Pause sind rein visuell. Bewegungsreduzierung und verborgene Browserseiten stoppen die Animation. Ohne kohärente Advektionsdaten bleibt die Temperaturfläche verfügbar und der Grund wird angezeigt.

## Rendering und Schutz der Wind-Performance

Der bestehende Windrenderer und seine numerische Interpolation bleiben unverändert. Lediglich seine bereits vorhandene Scheduler-Injection erhält den gemeinsamen `frame-clock.js`. Eine einzige native RAF-Anforderung bedient beide Wetterrenderer; Partikel und Datenfelder bleiben getrennt. Es gibt weder pro Frame Wetterabfragen noch neue Animationspoller.

Temperatur nutzt drei begrenzte Canvas-Ebenen: Farbfläche 210 unter Radar 230, Werte 432 und Advektionspfeile 433. Keine Veränderung von Radar-Kompositor, OPERA-Maske, NASA-Planung, World-Wrap, bestehenden Paletten oder nahtlosem Kachelwechsel. Datenauflösung und Pixelpuffer sind begrenzt; weder persistenter Temperaturringpuffer noch weltweites Punktabfrageraster.

WR: maximal 16.000 Knoten, 4 MB pro nativer Antwort, ein separater Upstream-Slot, maximal drei zusammengefasste/wartende Aufgaben, sechs RAM-Frames und konservatives 12-MiB-Budget. Der bestehende Windtransport wird nicht mit einem gemeinsamen Slot blockiert. Wiederverwendung gilt nur innerhalb tatsächlicher Auflösung/Abdeckung und ursprünglicher Freigabe; 429/503 mit Retry-After und Fehler-Cooldown verhindern wiederholte Dienstüberlastung.

GR: vorhandener räumlicher Wind-LRU-Mechanismus wird mit Temperatur-Bytezählung wiederverwendet, maximal sechs Felder/8 MiB. Vorbereiteter 130-%-Ausschnitt, wiederverwendete Bildpuffer und atomare Übernahme. Gültiges vorheriges Bild bleibt während Vorbereitung und vorübergehenden Transportfehlern sichtbar. Policy-Widerruf und Ablauf der WR-Freigabe räumen auf. World-Wrap fragt identische Daten nicht pro Weltkopie erneut ab.

Kontrollierte 4-Sekunden-Browser-Messfenster im selben Chrome-Prozess, jeweils feste Winddichte:

| Browserprofil | Windteilchen | Wind allein, Mittel / P95 ms | mit Temperatur | mit Advektion |
|---|---:|---:|---:|---:|
| Android-Viewport, CDP CPU×6 | 514 | 5,68 / 9,40 | 4,53 / 6,30 | 5,01 / 8,60 |
| Desktop | 1.747 | 2,24 / 3,80 | 1,78 / 2,50 | 1,79 / 2,80 |

Alle sechs Messfenster: null Wetterabfragen. Der stationäre Temperaturrenderer zeichnete sein Bild einmal; bei zusätzlicher Advektion waren 36 bzw. 123 Pfeile aktiv. Diese kurzen synthetischen Browsermessungen zeigen keine erkennbare Wind-Zeichenzeitregression; sie sind keine Geräte-/GPU-/FPS-Zusage. Die erstmalige Farbvorbereitung benötigt zusätzliche, kooperativ verteilte Arbeit und kann auf schwächeren Geräten länger dauern.

## Bedienung, Icon und Persistenz

„Wetter → Temperatur“ und das Premium-Darstellungsmenü öffnen denselben Zustand. Einstellungen bleiben auch ohne aktuell verfügbare Daten erreichbar. Vier Schnellschalter-Modi: nur Vollbild (Standard), alle Ansichten, nur Standard/Groß, nirgends. Der Schalter verwendet die bestehenden Maus-/Touch-Drag- und Positionsgrenzen; gespeicherte Positionen je Layout gewinnen gegenüber automatischer Kollisionsvermeidung.

Das vom Betreiber bereitgestellte Original `03_Thermischer_Hintergrund_Premium_Transparent.png` bleibt unverändert als 1254×1254-RGBA-Master unter `artwork/help-icons/hires/gr-temperature-premium-original.png`. SHA256: `ea46df73c3590ef76c4a8afcd0693f3ed318f6943bf2b4c07e961613cd737f9e`. Verlustfreie WebP-Derivate 136/272 px sind im Asset-Manifest geschützt. Sichtbare Schaltergröße 50×50 px; keine Neugenerierung, SVG-Nachzeichnung, Farbänderung, zusätzliche Rahmen oder Bildhintergründe.

Speicherung: `gewitterradar:temperature-ui:v1`, getrennt von bestehenden Wind-/Radarpräferenzen. Gespeichert werden sämtliche Temperaturkomponenten, Palette, Einheit, Deckkräfte, Skalenausschnitt, Beschriftungsdichte/-größe, Animation, Filter, Pause, Schnellschalter-Sichtbarkeit/-Positionen, Inspector und Legendenpositionen. Temperatur-/Advektionslegenden verwenden vorhandene Premium-Overlay-, Chevron-, Drag- und Viewport-Infrastruktur; die Niederschlagslegende wird nicht verändert.

## GeoPoint Inspector

`GeoPointContext` v1 enthält normalisierte Breite/Länge, EPSG:4326, ausgewählten Zeitpunkt, angefragte/verfügbare Capabilities, Werte, Herkunft, Gültigkeit und einheitliche Verfügbarkeits-/Fehlercodes. Adapterregistrierung ist erweiterbar und identische laufende Abfragen werden zusammengeführt.

Der erste Inspector verwendet ausschließlich bereits geladene, freigegebene Felder: 2-m-Temperatur, 850-hPa-U/V-Wind und horizontale Advektion. Die Ebene wird ausdrücklich genannt. Ein anderer Zeitpunkt ist `selected_time_not_loaded`; NoData bleibt `outside_or_nodata`. Es gibt keinen zusätzlichen externen Punktabruf. Geografische spätere Funktionen wie Gezeiten, Ortsname, Zeitzone oder Astronomie bleiben ohne geeigneten Adapter ausdrücklich nicht verfügbar. Keine erfundenen Orts-/Gezeitenwerte.

## Betroffene Dateien

Neu im Frontend: `weather/temperature-data.js`, `temperature-units.js`, `temperature-field.js`, `temperature-canvas.js`, `temperature-display.js`, `temperature-legend.js`, `geopoint-context.js` und `frame-clock.js`. Gezielte Einbindung in Bootloader, Modulmanifest, Weather-Menüs, Wind-Scheduler-Injection, Karten-Overlay-Lebenszyklus, Sprachwechsel und lokale Diagnose. Runtime-/DRA-/Integrationsmetadaten sowie HA-/Dashboard-Kopien und Prüfsummen sind synchronisiert. Originalmaster, Derivate und Asset-Aufbewahrungsvertrag sind erfasst.

Tests/CI: `gr-temp-world-01.test.mjs`, vollständiger Browserfixture/-test, Wind-Koexistenzbenchmark, gezielte Korrekturen historischer Versions-/Modulzahltests sowie öffentlicher Temperatur-CI-Scope. WR: neue Temperaturquelle und Consumer-Endpunkt, Registrierung, additive NOAA-Fähigkeit/Netzwerkmetadaten, Versionsdateien, gezielte Vertragstests und WR-Bericht. Die Release-Dateiliste nennt alle Pfade einschließlich generierter Kopien.

## Prüfung, Veröffentlichung und offene Realabnahme

Lokal: 49 gezielte GR-Tests bestanden, einschließlich zentraler C/F/K-Umrechnung, 19 Sprachverträge, Masken, Farbunabhängigkeit, GeoPoint und Scheduler. Vollständiger registrierter Modulbaum in Desktop, Android Hoch-/Querformat und iPad Hoch-/Querformat bestanden. Zusätzlich: alle 19 Einheitensprachen tatsächlich im Browser, sofortiger Wechsel ohne Fetch, echte Frameidentität, Inspector/Legendenwechsel, Persistenz nach Reload, bewegte Pfeile/Pause, paralleler Wind, Datumsgrenzen-Cache, NoData, fehlende Advektion, fehlgeschlagenes Nachladen und Policy-Widerruf. 180 bytegleiche HA-Stagingdateien geprüft.

WR lokal: 11 neue Temperaturtests, 8 bestehende Windfeldtests, 5 Windcachetests und 2 Versionsprüfungen bestanden. Die tatsächlichen nativen regionalen Temperatur-/850-hPa-Antworten wurden durch den neuen Decoder wiedergegeben (169 Knoten, 96 gültige Advektionsstencils). Zwei gezielte weltweite native Abrufe ergaben HTTP 200, 10.440 Knoten, zyklische Länge −180…180° und 8.763 gültige 850-hPa-Advektionspunkte. Die tatsächlichen gelieferten Breiten −87,75…89,75° umfassen die gesamte sichtbare Mercator-Karte; außerhalb nativer Abdeckung wird nicht extrapoliert.

Native Daten und lokale Messausgaben bleiben außerhalb der Quellcode-Repositories. Keine HA-Realtestexporte veröffentlicht. Private WR-Actions bleiben nachweislich deaktiviert. Öffentliche WR-CI enthält ausschließlich freigegebene synthetische Vertragsbeispiele und keine privaten Implementierungen oder native Originaldaten; deren Prüfumfang ist vom lokalen privaten Backendtest zu unterscheiden.

Die lokale Windows-Manipulationsprobe für den deterministischen Build scheiterte beim vorübergehenden Umschreiben einer JavaScriptdatei mit `UNKNOWN` im Dateisystem. Der Generator stellte die Auslieferung danach wieder her und die vollständige Paritätsprüfung bestand. Die öffentliche Linux-CI führt diese Manipulations-/Wiederherstellungsprüfung aus; der lokale Fehler wird nicht als bestandener Test ausgegeben.

**Veröffentlichungsnachweise werden nach erfolgreicher öffentlicher CI und Paketprüfung im folgenden Release-Abschnitt ergänzt. Bis dahin ist dies keine Fertigmeldung.** Physische Android-/iPad-/HA-Abnahme, Fresh Install/Update und visuelle Wetterrealabnahme auf VM109 bleiben ausdrücklich offen. TEST69, historische Niederschlagsprüfkampagnen, geschützte Referenzen, bestehende Tags und `main` bleiben unangetastet.
