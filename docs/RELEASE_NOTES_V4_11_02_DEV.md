# Gewitterradar V4.11.02 DEV

Stand: 30.09.2026

## Ziel dieses DEV-Kandidaten

V4.11.02 führt erstmals eine produktive Wetterkartenebene über WeatherRouter Consumer V1 ein: den providerneutralen Niederschlagsradar. Gleichzeitig wird der Versions-, Cache- und Updatepfad so vereinheitlicht, dass zukünftige DRA-Aktualisierungen ohne erneute Home-Assistant-Ressourcenregistrierung zuverlässig erkannt werden können.

## Kanonische Identität

- Produkt: `4.11.02`
- Anzeige: `V4.11.02 DEV`
- Build: `V4.11.02-DEV-2026-09-30`
- Runtime: `41102r1`
- Modulsatz: `E411-02A1`
- Laufzeitmodule: `26`
- Native Integration: `0.23.1`
- DRA-Kanal: bestehendes `deploy/dev`

## Niederschlagsradar

- öffentliche Capability: `weather.radar.precipitation`
- erwarteter Ressourcentyp: `raster_tile`
- Providerwahl bleibt vollständig Aufgabe von WeatherRouter;
- keine DWD-spezifische Routinglogik in Gewitterradar;
- unterstützt klassische XYZ-Kacheln sowie WMS/BBOX-Kacheln mit Web-Mercator-Berechnung;
- eigene Leaflet-Ebene `gr-weather-radar` mit getrenntem Darstellungsbereich;
- native Provider-Zoomgrenze wird respektiert; darüber kann Leaflet vorhandene Kacheln hochskalieren;
- Radar kann unabhängig ein- und ausgeschaltet werden;
- Quelle, Datenalter, Abdeckung, Attribution, eingeschränkte Route und fachliche Nichtverfügbarkeit werden sichtbar gemacht;
- eine vom Consumer gelieferte Legende wird dargestellt, sofern verfügbar;
- Abfragen sind durch getrennte Mindestintervalle und entprellte Kartenbewegungen ressourcenschonend begrenzt.

## WeatherRouter-Ergänzung

Beim Realisieren des Radar-Layers wurde festgestellt, dass DWD bereits eine gültige Legende liefert und der Consumer-V1-Vertrag diese vorsieht, `_normalize_raster()` sie jedoch verworfen hat. WeatherRouter wurde deshalb additiv korrigiert: sichere öffentliche Legendendaten werden nun providerneutral bis zum Consumer weitergereicht. Gewitterradar bleibt dadurch unabhängig vom tatsächlich ausgewählten Provider.

WeatherRouter-Entwicklungszweig: `feature/global-hazard-feeds`  
zugehöriger Schutztest zuletzt ergänzt mit Commit `b86872c64fe32d0b6a63c26e6f339b0056f4d81b`.

## Versions-, Cache- und Updatepfad

- `frontend/version.js` ist die kanonische Quelle der V4.11.02-Frontendidentität;
- normaler Modulgraph verwendet einheitlich Runtime `41102r1`;
- `core.update-watch@1.0.0` lädt das installierte Laufzeitmanifest mit `cache: no-store`;
- Unterschiede zwischen geladenem und installiertem Produkt, Build, Runtime oder Modulsatz werden erkannt;
- bei einer neuen installierten Version wird ein kontrolliertes einmaliges Neuladen vorbereitet;
- ein Session-Guard verhindert Neuladeschleifen;
- bei nicht sichtbarer Anwendung wird das automatische Neuladen bis zur nächsten Sichtbarkeit zurückgestellt;
- die Home-Assistant-Ressource bleibt stabil unter `/gewitterradar/gewitterradar.js` registriert.

> Übergangshinweis: Der Wechsel von V4.11.01 auf V4.11.02 kann auf einem Client, der den alten Root-Code gar nicht neu lädt, noch einmal ein vollständiges Schließen und erneutes Öffnen der Companion App erfordern. Sobald V4.11.02 tatsächlich geladen ist, steht der neue Updatewächter für nachfolgende Versionen zur Verfügung. Eine erneute Ressourcenregistrierung ist dafür nicht vorgesehen.

## Neue Module

- `core.update-watch@1.0.0`
- `weather.precipitation-layer@1.0.0`

Die Modulansicht umfasst damit 26 Module. Namen und Funktionen der beiden neuen Module sind in allen 19 unterstützten Sprach-/Dialektvarianten hinterlegt.

## Schutzverträge

- V4.10 FINAL bleibt unverändert und eingefroren.
- Blitzortung bleibt als unabhängiger Datenpfad erhalten.
- Der historische About-/Release-Vertrag bleibt geschützt: stabile Veröffentlichungen dürfen weiterhin kein `DEV` tragen.
- Der Browservertrag erkennt nun kanonische DEV-Laufzeiten über das Laufzeitmanifest, statt ausschließlich V4.11.01 fest zu verdrahten.
- Geschützte About-Geometrie, Diagnose-, Hi-Res- und Instrumentverträge bleiben unverändert aktiv.

## Reale Abnahme nach DRA-Bereitstellung

1. V4.11.02 DEV über den bestehenden DRA-Kanal `deploy/dev` installieren.
2. Prüfen, dass sichtbar `V4.11.02 DEV` geladen ist.
3. Unter „Module & Versionen“ 26/26 Module prüfen.
4. Weather Engine öffnen und „Niederschlagsradar · Kartenebene“ aktivieren.
5. Prüfen, ob die Niederschlagsdarstellung auf der Karte erscheint.
6. Quelle, Datenalter, Abdeckung und Attribution kontrollieren.
7. Falls WeatherRouter eine Legende liefert, deren Darstellung kontrollieren.
8. Karte verschieben und zoomen; Radar muss stabil mitlaufen.
9. Radar ausschalten; die Ebene muss vollständig verschwinden.
10. Gegenprobe: Blitzortung, Cluster, Radien, Kompass und bisherige Kartenfunktionen bleiben unverändert funktionsfähig.
11. Desktop und Android zuerst prüfen; anschließend iPad-Gegenprobe.

## Noch nicht Bestandteil dieses Kandidaten

- keine automatische Ablösung von Blitzortung durch WeatherRouter-Blitze;
- keine Monitored-Area-Backendaktivierung;
- kein zentraler Systemstatus aus den weiteren V4.11-To-dos;
- keine öffentliche Veröffentlichung und kein Merge nach `main`.

## Freigaberegel

`deploy/dev` darf erst auf diesen V4.11.02-Kandidaten verschoben werden, wenn die vollständigen Gewitterradar-CI-Prüfungen des endgültigen Entwicklungs-HEADs erfolgreich abgeschlossen sind. Die reale Geräteabnahme folgt danach.
