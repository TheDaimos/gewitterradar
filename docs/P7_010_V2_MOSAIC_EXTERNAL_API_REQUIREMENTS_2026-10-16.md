# P7-010 – Gewitterradar-Anforderungen an die externe WeatherRouter-V2-Schnittstelle

**Stand:** 2026-10-16  
**Projektzuständigkeit:** ausschließlich Gewitterradar; dieses Dokument ändert keinen WeatherRouter-Code.  
**Status:** Schnittstellenanforderungen für den separaten WeatherRouter-Entwicklungsstrang; keine Aussage über eine bereits unterstützte Serverfunktion.

## Bestehender Vertrag

- WebSocket: `weather_router/consumer/resolve_mosaic`
- `contract_version: 2`, `capability: weather.precipitation.layer`
- Geprüfte BBOX und Fokus, zeitliche Anforderungen mit `latest_coherent`
- Bis zu zwölf Quellen **im Gesamtmosaik**; höchstens vier fachlich zulässige, räumlich überdeckende Quellen pro Kachel
- Getrenntes Anfragebudget `max_tile_requests`
- Quellen-/Abdeckungs-, Legenden-, Render-, Semantik- und Zeitmetadaten werden vom Server bereitgestellt.
- Gewitterradar wählt oder priorisiert keine Provider. V1 bleibt unabhängiger Rückfall.

## Noch erforderlicher V2-Zeitvertrag

Das aktuell in Gewitterradar validierte V2-Antwortformat beschreibt eine Momentaufnahme: `reference_time` und `layers[].times`. Es ist **keine einheitliche, vollständig spezifizierte Folge von Mosaikbildern** enthalten. Aus beliebigen Einzelquellenzeiten darf Gewitterradar keinen fiktiven gemeinsamen Zeitplayer bilden.

Benötigt wird ein **serverseitig kohärentes** Modell mit:

1. Expliziten, zeitlich sortierten Mosaikzeitpunkten und eindeutiger Kennzeichnung Vergangenheit / aktueller Stand / Vorhersage.
2. Einer vom Server gelieferten Referenzzeit, Aktualitäts-/Gültigkeitsangaben und einer fachlich verbindlichen Auswahl pro Zeitpunkt.
3. Je Zeitpunkt vollständigen, prüfbaren Quellendeskriptoren sowie derselben geografischen Deckungs- und Sicherheitssemantik wie beim statischen Mosaik.
4. Einer begrenzten Frame-Anzahl und klaren getrennten Kosten-/Anfragebudgets; im Client doppelt gepuffert, ohne undefinierte Bildersprünge.
5. Einem Verhalten bei fehlenden/partiell fehlgeschlagenen Bildern: vorheriges gültiges Bild beibehalten, als veraltet markieren, nicht als aktuell ausgeben.
6. Einer eindeutigen Kompatibilitätsangabe, damit Gewitterradar bei fehlender V2-Zeitunterstützung V1 weiterverwenden kann. Kein eigener Quellenwahlalgorithmus im Client.

Diese Punkte sind zunächst **Anforderungen**, keine rückwärtsinkompatible Erweiterung des bestehenden V2-Befehls durch Gewitterradar.

## Verbindliche Realprüfungen

- Eine Karte mit globaler und begrenzt regionaler Quelle zugleich; Kuba im Fokus, Deutschland nur marginal sichtbar.
- Zeitachse Vergangenheit → Jetzt → Vorhersage, kohärente Übergänge bei Karten- und Quellenwechsel.
- iPad/WebKit und Android: abgebrochene Bildanforderungen, keine überholten Canvas-Zeichnungen, stabile Speicher- und Bedienlast.
- Niederschlagsstil `Weich`, besonders Zoom 10, unverändert.
- Echte Home-Assistant-Abnahme ist separat erforderlich; künstliche Daten und grüne CI ersetzen sie nicht.

**Wichtig:** Diese Datei ist ein kopierbarer Auftrag an den eigenständigen WeatherRouter-Chat. In diesem Gewitterradar-Zweig wird kein WeatherRouter-Quellcode geändert.
