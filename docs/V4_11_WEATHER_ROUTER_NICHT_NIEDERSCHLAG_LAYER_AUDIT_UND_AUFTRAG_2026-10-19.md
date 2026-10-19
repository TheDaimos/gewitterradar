# V4.11 – WeatherRouter-Katalog sichtbar, aber weitere Wetterebenen nicht bedienbar

**Datum:** 19.10.2026 · **Stand:** Gewitterradar V4.11.99 DEV, WeatherRouter V0.10.161 DEV  
**Geltungsbereich:** Gewitterradar-Entwicklung auf `TheDaimos/gewitterradar@deploy/dev`; Abstimmung mit WeatherRouter über das vorhandene private Koordinationsverzeichnis.  
**Status:** **BEFUND BESTÄTIGT – ENTWICKLUNGSAUFTRAG VORBEREITET; CODE NICHT GEÄNDERT.**

## Nutzerbefund

Die WeatherRouter-Layer-Navigation zeigt beispielsweise `Satellit & Fernerkundung` (GOES, MODIS, Himawari, IMERG) und `Wind` (`ICON · Wind 10 m`). Die Listeneinträge tragen **„verfügbar / Renderer folgt“**; tatsächlich kann bisher nur **Niederschlag** direkt in der Gewitterradarkarte eingeschaltet werden. Nutzer möchte Wolken, Wind, UV und weitere Wetterdienste ebenfalls nutzen. Der Zustand betrifft den ursprünglichen, weiter gültigen V4.11-Auftrag „Implementierung von Wetterdiensten & Wetterereignissen durch WeatherRouter“ und wird **nicht** allein durch mehr Niederschlagsquellen in P7-010 behoben.

## Nachgewiesene Codeursache (kein nachgewiesener WR-Ausfall)

- `frontend/modules/weather/layer-menu.js` definiert in `rendererId` ausschließlich `weather.precipitation.layer` als Renderer `precipitation`; alle übrigen katalogfähigen Einträge erhalten in `_weatherLayerMenuCapabilitiesMarkup` hartcodiert `verfügbar<br>Renderer folgt`.
- `_weatherLayerMenuToggle` nimmt ausschließlich die Niederschlags-Capability an; alle anderen Katalogeinträge sind keine Ein-/Aus-Schalter für eine Wetterkartenebene.
- `frontend/modules/weather/display-menu.js` bezeichnet Niederschlag ausdrücklich als **ersten Renderer**. Der aktuelle Consumer-Client kann bereits allgemeine V1-Capabilities auflösen (`createWeatherRouterClient().resolve(capability, context)`), die Kartenanzeige nutzt dies jedoch noch nicht als universelles Rendering.
- WeatherRouter `consumer_capability_map.json` führt `weather.model.wind_10m.layer` und `weather.satellite.clouds` als `raster_tile`; daneben `weather.point.uv_index` und `weather.point.cloud_cover` als **`value`**, nicht als Raster. Mehrere Satellitenbildprodukte haben eigene Bild-/Rendersemantik.
- **Katalog-`available` ≠ aktueller V1-Resolve-Status `ready` ≠ tatsächlich vollständig gezeichnete Kacheln**. Ein Kartenmenü darf diese drei Stufen nicht gleichsetzen. Keine aktuelle reale Providerverfügbarkeit aus bloßer Kataloganzeige ableiten.

## Klarer Zuschnitt: zwei getrennte Arbeitsstränge

| Arbeitsstrang | Eigentümer | Inhalt |
| --- | --- | --- |
| **P7-010-S01 ff.** | WeatherRouter, danach GR | Quelleninventar und tatsächlich nutzbares weltweites Niederschlagsmosaik bis zu zwölf Quellen gesamt / vier je Kachel; serverseitige Mosaik-Zeitfolge separat |
| **V4.11-WL-01 ff.** | Gewitterradar, mit WR-Vertragsprüfung | Allgemeine Wetterkarten-Anbindung jenseits Niederschlag; passende Raster-/Punkt-/Ereignisrenderer, bedienbares Menü, Status-/Zeit-/Coverage-/Legendenwahrheit |

**Nicht** den bestehenden, unter HA bereits real abgenommenen Niederschlagsrenderer für fremde Datentypen verbiegen oder V1-/V2-Semantik vermischen.

## Vorschlag für kleinste sinnvolle Ausbaustufen

### V4.11-WL-01 – Katalogwahrheit und Vertragsinventur

1. Bestehende WR-V1-Capabilities für Satelliten-Wolkenbilder, mindestens einen Wind-Rasterlayer, UV-Punktwert und Bewölkungs-Punktwert vollständig inventarisieren. Metadaten reichen nicht: pro Ressource `resolve`, `resource.type`, `payload`, `provenance`, `freshness`, UTC-`valid_at`, tatsächliche Coverage, `attribution`, Kachelgröße/Zoom und ggf. Legende prüfen. Test-/Echtdaten getrennt kennzeichnen.
2. UI-Zustände konsequent auseinanderhalten: **im Katalog vorhanden**, **Renderer noch nicht implementiert**, **Daten abrufbar**, **momentan keine gültigen Daten**, **Karte aktiv**. Nicht nutzbare Funktionen nicht als direkt aktivierbare Wetterebenen vermarkten.
3. Bestandsschutz für Niederschlag V1/V2, P7-010, DRA, Overlay-Lebenszyklus, Uhrzeiten, Opt-in, V4.11.99 und Schutzmechanismen dokumentieren.

### V4.11-WL-02 – Erster generischer WeatherRouter-V1-Rasterrenderer

- Über die **vorhandene** GR-Karten-/Layer-Architektur einen V1-`raster_tile`-Adapter für **fachlich geeignete** nicht-niederschlagsbezogene Kartenprodukte integrieren, zunächst Satelliten-/Wolkenebene und einen Wind-Rasterlayer, **nur nach erfolgreicher Payload-/Lizenz-/Coverage-Prüfung**.
- Jede Ebene getrennt schaltbar, abhängig von den korrekt übernommenen WR-Capabilities (keine fest codierte Providerwahl). Respektiere `coverage`, `max_zoom`, Zeit-/Frischeklassen, `attribution`, Legende, Transparenz, Bildanforderungsbudget, Mobilgeräte, Hintergrundwechsel und Teilausfälle. Ohne `ready` keine vermeintliche Erfolgsmeldung.
- Bei Satellitenprodukten Unterschiede (True Color, IR, Staub, Feuertemperatur, IMERG) klar kennzeichnen; keine falsche Interpretation als Niederschlagsradar, Wolken- oder Wetterprognose.
- Korrektes Overlay-/Zustandsmanagement einschließlich Wechsel der Ebenen, nicht achtfacher Doppelabruf und keine Kollision mit bestehender Niederschlagsdarstellung.

### V4.11-WL-03 – Wetterpunktwerte statt fingierter Flächenkarte

- UV-Index und Bewölkung über den dafür vorhandenen `value`-Vertrag im gewählten, vom Benutzer explizit angefragten Kartenausschnitt-/Punktkontext anzeigen.
- **Kein** Einfärben der ganzen Karte aus einem einzigen Punktwert; eine echte räumliche UV-/Wolkendarstellung benötigt eine passende, vertragsgetreu gelieferte Raster-/Feldquelle.
- Einheit, Vorhersage-/Beobachtungsstatus, UTC-Zeit, Alter, Quelle, `unavailable` und Attribution verständlich darstellen.

### V4.11-WL-04 – Weitere Kartendaten / Ereignisse

- Hazard-/Event-/Image-Sequence-/Planetary-Tile-Verträge einzeln nach Fachsemantik prüfen und passende Darstellungstypen planen. Nicht alle Katalog-Capabilities sind Kartenraster; Ereignisse benötigen z. B. Marker, Flächen oder Listen.
- Separater Abnahmeplan für Zoom, DWD/NASA-Regressionsschutz, Satelliten-Wind-Kombination, Android/iPad/Firefox, Berechtigungen und API-Monitor-/GR-Diagnosekorrelation.

## Verbindliche Freigaberegeln

Zunächst **WL-01-Code-/Vertragsinventur**, danach nur nach konkretem bestätigtem Datentyp WL-02/WL-03 in der bestehenden Architektur. Keine zusätzliche Version allein für Dokumentation, keine parallelen Zweige, keine WeatherRouter-Produktivänderungen im GR-Auftrag. WR-Gegenfragen ins **private** Koordinationsverzeichnis `TheDaimos/weather-router-dev/docs/p7-010-coordination`, Rohdiagnosen nur `TheDaimos/Project-Log-And-Export`.

**Abnahme:** pro Wetterfunktion mindestens ein real `ready` aufgelöster Wert bzw. Raster und eine in GR tatsächlich nachvollziehbar gerenderte/angezeigte Antwort (separater HA-REAL-PASS); reine Katalogsichtbarkeit oder grüne Syntaxprüfung sind keine Funktionsfreigabe.

**C.K. – Eine Idee weiter gedacht.**
