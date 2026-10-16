# Gewitterradar V4.11.84 DEV – FLK-01 und Weather-Engine-Überarbeitung

**Datum:** 16.10.2026 · **Vorversion:** V4.11.83 DEV · **Status:** DEV-Auslieferung über DRA; Geräte-Realabnahme ausstehend.

## FLK-01 – flackerfreier Niederschlagswechsel (Consumer API V1)

- Beobachteter Fehler: Beim geografischen Verschieben und bei regelmäßiger Aktualisierung blinkte die gesamte Niederschlagsebene kurzzeitig. Das Blinkintervall folgte dem eingestellten Wetter-Aktualisierungsintervall.
- Ursache im bisherigen Gewitterradar-Frontend: Die bisherige V1-Rasterebene wurde beim Austausch sofort entfernt, bevor die neuen Bildkacheln erfolgreich geladen waren.
- Identische neue Raster-Bildadresse und Rasterparameter führen zu **keinem Neuaufbau**; die vorhandene Ebene bleibt erhalten, nur Metadaten werden aktualisiert.
- Bei echten Rasteränderungen wird die neue Ebene zunächst **unsichtbar vorbereitet**. Die bisherige bleibt aktiv, bis der neue sichtbare Bildkachelsatz vollständig und erfolgreich geladen wurde. Bei fehlgeschlagenen Kacheln, Zeitüberschreitung, deaktivierter Niederschlagsanzeige und überholter Kartenposition wird die neue Ebene verworfen.
- Quellennachweis, Zeitleiste und Status werden erst mit der tatsächlich übernommenen Ebene aktualisiert.
- Die Rückfallversorgung über Consumer API V1 bleibt bestehen. Die bestehende V2-Anbindung wird nicht ersetzt oder neu aufgebaut.
- Keine Änderungen an der Weichzeichnung, Blitzortung, Standortsteuerung oder am WeatherRouter selbst.

## Weather Engine – Bedienbarkeit und tatsächliche API

- Kompakteres, gleichmäßigeres zweispaltiges Einstellungsraster; bei schmalen Geräten einspaltig.
- Abstände, Statuszeilen und Bedienfelder vereinheitlicht.
- **WeatherRouter-Verbindung über Consumer-Schnittstelle V1** und **tatsächlich aktive Niederschlagsauflösung über API V1 oder V2** werden sprachlich getrennt angezeigt, damit ein funktionierender V1-Verbindungstest nicht als aktive V2-Darstellung missverstanden wird.

## Version und Deployment

- **Produkt:** V4.11.84 DEV
- **Build:** `V4.11.84-DEV-2026-10-16`
- **Runtime:** `41184r1`
- **Modulsatz:** `E411-84A1`
- **Native Home-Assistant-Integration:** `0.25.2`
- **Module:** `core.manifest 1.2.144`, `ui.skeleton 1.1.25`, `weather.precipitation-layer 1.3.6`, `weather.consumer-client 1.2.2`.
- **Bereitstellung:** `deploy/dev` via Deploy Relay Agent; native Integration und Dashboard spiegelgleich.
- **Prüfung:** statische Modul-/Buildverträge, FLK-01-Lebenszyklustests (Erfolg/Abbruch/Fehler/Timeout/identischer Raster), Home-Assistant- und Browserregressionen.
- **Noch offen:** Realtest auf Desktop, Android und iPad sowie V2-Niederschlagsmosaik mit betriebsbereitem WeatherRouter V2.

## Empfohlene Realtest-Reihenfolge

1. WeatherRouter mit bereitgestellter Consumer API V2 installieren und Home Assistant gemäß DRA-Anforderung neu starten.
2. Gewitterradar V4.11.84 DEV über DRA installieren; Frontend vollständig aktualisieren.
3. Aktiven Niederschlags-API-Status in Weather Engine prüfen.
4. **FLK-01:** Kuba/Atlantik und Deutschland bei unterschiedlichen Wetter-Aktualisierungsintervallen beobachten; prüfen, ob die Niederschlagsebene beim Neuladen blinkt.
5. **P7-010:** Von Kuba über Atlantik nach Europa navigieren; DWD nur innerhalb geeigneter regionaler Kacheln verwenden; V2-Aufrufe mit dem WeatherRouter-API-Monitor nachweisen.
6. Weather-Engine-Oberfläche und Karte auf Desktop, Android und iPad prüfen. Diagnose-JSON bei Abweichung exportieren.

**C.K. – Eine Idee weiter gedacht.**
