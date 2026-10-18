# Gewitterradar V4.11 – primärer Schwerpunkt: europäische Niederschlagsradare

Stand: 18.10.2026 · Beschluss: **Neue funktionale Priorität für den verbleibenden V4.11-Entwicklungszeitraum**

## Versions- und Historiengrenze

Die bereits erreichten V4.11-DEV-Stände, implementierte Funktionen, Regressionstests und Freigabegrenzen bleiben **unverändert historisch gültig**; dieser Planungsbeschluss setzt die bisherige Entwicklung nicht zurück und veröffentlicht keine neue Version.

Die bisherigen **noch offenen** V4.11-To-do-Themen (Systemstatus, Tracker-/Blitzortung-Diagnose, Hilfe/Fehlerbehebung, gespeicherte/überwachte Orte, Local-To-do sowie sonstige Punkte) sind nach [V4_12_TODO.md](V4_12_TODO.md) verschoben. Bereits erledigte V4.11-Aufgaben sind dort nur historische Nachweise; nicht wiederholen. Der verbindlich geplante V4.12-Bereich **Geo-Sonde** bleibt ebenfalls erhalten.

## 0. Harte Voraussetzung – laufende gemeinsame Realabnahme

- [ ] Bestehenden WR-/GR-P7-010-Realtest mit dem installierten Versionspaar **abschließen**, bevor neue europäische Provider installiert oder in das produktive Routing aufgenommen werden.
- [ ] Bekannte Ausfallfehler WR-01c (DWD-Abdeckungsbeschaffung/Timeout) und GR-RF-02 (gültige aktuelle DWD-Daten nicht durch ausschließlich ältere NASA-Daten ersetzen) korrigieren und separat regressionsprüfen.
- [ ] Nachweislich stabiles, reproduzierbares gemeinsames DEV-Referenzpaar einschließlich V1-Rückfallschutz, V2-Mosaik, UTC-Zeitvertrag, Diagnose und Rückfall sichern. **Kein stilles Überspringen dieser Abnahme.**
- [ ] Erweiterungsarbeiten erst danach sequenziell und ohne parallele Entwicklungszweige im jeweiligen `deploy/dev` angehen.

## 1. Primärer neuer V4.11-Arbeitsauftrag: europäische Regenradarversorgung

Die **eigentlichen Provider, Datenadapter, Routing- und Coverage-Entscheidungen gehören in WeatherRouter** (`TheDaimos/weather-router-dev`, `deploy/dev`). Gewitterradar bleibt ausschließlich providerneutraler Consumer von `weather.precipitation.layer` und der bestehenden V2-Mosaik-API; **keine nationalen Provider-Sonderfälle in GR**.

Verbindliche technische Planungs-/Prüfliste: [WeatherRouter – Europa-Niederschlagsradar](https://github.com/TheDaimos/weather-router-dev/blob/deploy/dev/docs/EUROPA_NIEDERSCHLAGSRADAR_TODO_2026-10-18.md).

- [ ] **OPERA / EUMETNET MeteoGate ORD**: europäische Verbundradar-Mosaike als erster Integrationskandidat, einschließlich Datenzugang, Lizenzprüfung, ODIM-HDF5/Produktumsetzung und maschinenlesbarer geografischer Abdeckung.
- [ ] **Alle öffentlich bereitgestellten und rechtlich für die Integration nutzbaren nationalen Niederschlagsradarsysteme in sämtlichen europäischen Ländern tatsächlich implementieren**, nicht nur die fünf zunächst genannten Länder. **Kanada** gehört zusätzlich ausdrücklich dazu. Nationale Produkte auch bei OPERA-Abdeckung aufnehmen; keine ungeprüfte Doppelüberlagerung.
- [ ] Je Land tatsächliche Verfügbarkeit, Radarqualität/Auflösung, zeitliches Raster, Messmethode, Zugangsbedingungen, Nutzungsrechte, Attribution, regionale Abdeckung und Aktualität prüfen; **kein Provider allein wegen Ländername oder Existenz als einsatzbereit markieren**.
- [ ] **RainViewer** als **bereits vorhandenen Provider** fachlich und technisch nachbessern; V2-Mosaikzulassung nur nach zuverlässiger Coverage-/Aktualitäts- und Lizenzprüfung. Keine Umgehung der vorhandenen `machine_coverage_required`-Schutzregel.
- [ ] DWD, neue nationale Radare, OPERA, RainViewer und NASA-IMERG für **jeweils geeignete Kacheln** fachlich sauber routen; Radar-Messung, Satellitenschätzung und Modellwerte unterscheidbar halten. NASA bleibt legitime globale Ergänzung statt standardmäßiger Ersatz für verfügbare frische europäische Radardaten.
- [ ] GR-V2-Mosaik an typischen Grenzen und Kombinationen prüfen (Deutschland→Dänemark, Österreich/Schweiz/Italien, Spanien/Portugal, Regionen ohne Verbund-Abdeckung) sowie mit 0/1/mehreren gültigen Quellen, Neustart, Provider-Ausfall, Kachelwechsel, Zoom und Wiederherstellung.
- [ ] Quellen/Attribution/UTC-Zeit und Routingentscheidungen in beiden Diagnosen überprüfbar halten; neue echte Exportdateien **ausschließlich** ins private `TheDaimos/Project-Log-And-Export`.
- [ ] Nationale Quellen erst nach Tests in einer gemeinsamen Regionalabnahme als tatsächlich nutzbar ausweisen. Kritische V1- und V2-Baselines dürfen nicht verschlechtert werden.

## 1a. Verbindlicher Vollumfang – alle europäischen nationalen Radare, Kanada und weitere Wetterdaten

**Präzisierung vom 18.10.2026:** Nicht nur OPERA und fünf exemplarische Staaten. Das Mindestgebiet umfasst ausdrücklich:

- **Britische Inseln / Nordwesteuropa:** Vereinigtes Königreich mit England, Schottland, Wales und Nordirland; Irland; Frankreich (auch Korsika), Belgien, Niederlande und Luxemburg.
- **Iberische Halbinsel / Atlantikinseln:** Spanien (Festland, Balearen, **Kanarische Inseln**, Ceuta/Melilla); Portugal (Festland, **Azoren**, **Madeira**); Andorra.
- **Mitteleuropa:** Deutschland (DWD und zusätzliche öffentlich angebotene Radarprodukte), Österreich, Schweiz, Liechtenstein, Polen, Tschechien, Slowakei, Ungarn.
- **Skandinavien / nordische Länder / Baltikum:** **Dänemark, Schweden, Norwegen, Finnland, Island**, außerdem Färöer, Grönland (außereuropäische Ergänzung), Estland, Lettland, Litauen; Svalbard/Spitzbergen auf tatsächliche Radardaten prüfen.
- **Süd- und Südosteuropa:** Italien (einschließlich Sizilien/Sardinien), San Marino, Vatikanstadt, Malta, Slowenien, Kroatien, Bosnien und Herzegowina, Serbien, Montenegro, Kosovo, Nordmazedonien, **Albanien**, Rumänien, **Bulgarien**, **Griechenland**, Zypern und **Türkei** einschließlich ihrer relevante Radarregionen.
- **Osteuropa / Grenzräume:** Ukraine, Moldau, Belarus, europäisches Russland/Kaliningrad; Kaukasus-Grenzräume Georgien, Armenien und Aserbaidschan zusätzlich prüfen. Sanktionen, Sicherheit und Nutzungsvorschriften strikt beachten.
- **Außerhalb Europas ausdrücklich zusätzlich:** **Kanada** (Environment and Climate Change Canada / MSC GeoMet einschließlich nationaler Radardaten und anderer offizieller Quellen); vorhandener ECCC-Provider allein ist kein Nachweis einer implementierten Radar-V2-Quelle.
- **Vollständigkeitsregel:** Dies ist ein verpflichtender Mindestkatalog, keine abschließende Länderliste. **Alle weiteren europäischen Länder, öffentlich zugänglichen nationalen/regionamtlichen Radarprodukte, Inselregionen, nationalen Verbünde und zulässigen Angebote aufnehmen**. Nicht für jede Region eine eigenständige Radarstation behaupten; auch tatsächliche grenzüberschreitende Abdeckung gesondert belegen.

- [ ] **Sämtliche** öffentlich und rechtlich nutzbaren nationalen Niederschlagsradarprodukte der oben genannten und zusätzlich gefundenen Länder/Regionen in WeatherRouter implementieren; 5-Minuten-Hochauflösungsdaten in originaler Präzision und Zeitauflösung nutzen, sofern angeboten.
- [ ] **OPERA zuerst** als europaweites synchronisiertes Komposit (CIRRUS/NIMBUS), nationale Radarangebote aber **unabhängig davon** als ergänzende oder redundante Candidates bereitstellen. Keine Pflicht zum gleichzeitigen Rendern überlappender Bilder.
- [ ] Bei jedem nationalen Wetterdienst **auch sämtliche weiteren nutzbaren veröffentlichten Produkte** inventarisieren: Stationswerte/Temperatur/Luftfeuchtigkeit, Wind/Böen, Gewitter/Blitze/Hagel, amtliche Sturm- und Gefahrenwarnungen, Vorhersagen/Nowcasts, Schnee, Hochwasser, Küsten-/Meeresdaten und fachliche Sonderangebote.
- [ ] Nicht nur Radar: geeignete zusätzliche Wetterprodukte nach Produkt-/Lizenz-/Schnittstellenprüfung in **bestehende WeatherRouter-Topics und Capabilities** integrieren, ohne parallele Architektur oder Consumer-spezifische Providerlogik.
- [ ] Messung vs. Analyse vs. Satellitenschätzung vs. Modell/Prognose vs. amtliche Warnung streng trennen; die europäische 5-Minuten-Kompositzeit ist **kein Beleg** für identisches Alter aller beteiligten Einzelradare.
- [ ] Quellenvollständigkeit pro Land und Datenprodukt mit Zugriffsrechten, Aktualität, Auflösung, Coverage, Status und Einzelabnahme dokumentieren. Bei fehlenden Schnittstellen, Lizenzhürden oder Sanktionen als **BLOCKIERT** nachvollziehbar kennzeichnen, nicht erfunden implementieren.
- [ ] Stufenplan bleibt verbindlich: zuerst bekannte P7-010-Fehler und gemeinsame Realabnahme, danach OPERA, nationale Radarangebote, zusätzliche nationale Fähigkeiten. Kein Umbau des GR-Consumers zu einer Länder-/Provider-Matrix.

**Technisch verbindliche Details und vollständige Prüfliste:** [WeatherRouter-Radar- und Wetterdatenauftrag](https://github.com/TheDaimos/weather-router-dev/blob/deploy/dev/docs/EUROPA_NIEDERSCHLAGSRADAR_TODO_2026-10-18.md).

## 1b. Quellen und Informationen vollständig entdecken – WeatherRouter als Datenzentrale

**Neuer verbindlicher Zusatzauftrag:** Alle bereits in WeatherRouter vorhandenen Themen, Datenarten und Provider gegen die aktuellen, öffentlich zugänglichen nationalen Datenkataloge prüfen – **jede Fähigkeit gegen jede Quelle; jede Quelle gegen jede Fähigkeit**. Wenn ein Dienst neue sachlich erfassbare Informationen (z. B. UV, Sonneneinstrahlung, Sonnenauf-/untergang, Wind, Temperatur, Schnee, Pollen, Luftqualität, zusätzliche Warnungen oder Umwelt-/Naturgefahren-Daten) anbietet, den zentralen Themenkatalog erweitern und rückwirkend **alle bekannten Quellen** auf diese neu entdeckten Fähigkeiten untersuchen.

Die verbindlichen Inventare liegen **nur zentral in WeatherRouter**, nicht dupliziert im Gewitterradar:
- [Universeller Quellen- und Fähigkeitenkatalog](https://github.com/TheDaimos/weather-router-dev/blob/deploy/dev/docs/QUELLEN_UND_FAEHIGKEITEN_KATALOG_2026-10-18.md)
- [Maschinenlesbarer Ausgangsbestand](https://github.com/TheDaimos/weather-router-dev/blob/deploy/dev/docs/quellen_faehigkeiten_katalog.v1.json)

- [ ] Alle geeigneten, rechtlich erlaubten nationalen Datenprodukte nach fachlicher Prüfung in WeatherRouter-Capabilities integrieren, auch wenn der ursprüngliche Anlass das Regenradar war.
- [ ] Eine neue Kategorie muss einen dokumentierten **erneuten Abgleich sämtlicher bereits bekannter Provider** auslösen.
- [ ] GR bleibt Consumer der providerneutralen WeatherRouter-API; kein heimlicher Umbau der GR-Kartenschicht in ein Direkt-API-Sammelprogramm.
- [ ] Die konkrete Radar-/P7-010-Realabnahme bleibt weiterhin vorgeschaltet; die Katalogarbeit ist **kein** Anlass für unkontrollierte parallele Runtime-Änderungen.

## 2. Klare Abgrenzung

**V4.11** = stabile Gewitterradar-/WeatherRouter-Niederschlagsdarstellung **plus Erweiterung um Europas echte Radarmessungen**.  
**V4.12** = bisherige offene V4.11-Nebenthemen **plus** bereits fest zugesagte Geo-Sonde.

**Planung allein ersetzt weder Codeimplementierung noch erfolgreiche HA-Realabnahme.**
