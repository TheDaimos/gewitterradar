# Gewitterradar V4.11.05 DEV

Stand: 01.10.2026

## Ziel

V4.11.05 erweitert den in V4.11.04 real abgenommenen providerneutralen Niederschlagsradar um einen echten **Radar-Zeitverlauf**. Wenn WeatherRouter für die gewählte Rasterquelle mehrere Zeitstände liefert, können Vergangenheit, aktueller Zeitpunkt und Vorhersage direkt auf derselben Gewitterradar-Karte betrachtet und abgespielt werden.

Der bestehende Blitzortung-Datenpfad bleibt vollständig unabhängig.

## Datenvertrag

Gewitterradar fordert weiterhin ausschließlich die öffentliche Capability:

`weather.radar.precipitation`

mit Ressourcentyp `raster_tile` an. Ein Provider wird nicht fest verdrahtet.

Liefert der geroutete Provider im Raster-Payload eine Consumer-V1-Timeline mit mehreren `frames`, aktiviert Gewitterradar den Zeitverlauf automatisch. Liefert die Quelle nur ein Einzelbild, bleibt die bisherige Radaransicht ohne Player vollständig funktionsfähig.

Für den aktuell verwendeten DWD-Radar kann WeatherRouter derzeit bis zu 72 Analyse-/Vorhersageframes liefern. V4.11.05 kennt und erzwingt diese Zahl jedoch nicht; verwendet wird ausschließlich die tatsächlich gelieferte Timeline.

## Bedienung auf der Karte

Der Zeitplayer erscheint nur bei mindestens zwei gültigen Radarzeitpunkten und bietet:

- vorheriger Zeitpunkt;
- Wiedergabe / Pause;
- nächster Zeitpunkt;
- **Jetzt**;
- Zeitregler über alle gelieferten Frames;
- sichtbare Kennzeichnung **Vergangenheit**, **Jetzt** oder **Vorhersage**;
- lokale Uhrzeit des gewählten Radarzeitpunkts;
- aktuelle Position innerhalb der gelieferten Folge.

Die Radarlegende wird parallel aktualisiert und zeigt Provider, Zeittyp und Uhrzeit des gewählten Frames.

## Doppelpufferung

Ein Framewechsel ersetzt die sichtbare Kartenebene nicht sofort.

1. Der Ziel-Frame wird zunächst als zweite Leaflet-Rasterebene mit praktisch unsichtbarer Deckkraft angelegt.
2. Gewitterradar wartet, bis die für den sichtbaren Kartenausschnitt erforderlichen Kacheln geladen wurden.
3. Erst dann wird die neue Ebene sichtbar geschaltet.
4. Nach zwei Browser-Zeichenzyklen wird die vorherige Ebene entfernt.

Für das Vorbereiten eines Frames gilt ein Zeitlimit von 6 Sekunden. Kann der Ziel-Frame nicht sicher geladen werden, bleibt der bisherige sichtbare Radarstand erhalten und die Wiedergabe wird angehalten.

## Ressourcenpriorisierung

Der in V4.11.03/04 eingeführte räumliche Radar-Puffer bleibt vollständig erhalten.

Während einer laufenden Zeitanimation erhält jedoch der **nächste Radarzeitpunkt** Vorrang vor dem großflächigen räumlichen Zusatzpuffer. Dadurch konkurrieren auf mobilen Geräten nicht gleichzeitig viele zeitliche Frames und ein großer Kartenrand um Netzwerk und Bildspeicher.

Nach Pause, manueller Auswahl oder Sprung auf **Jetzt** wird der konfigurierte räumliche Puffer wieder für den aktuell gewählten Zeitstand aufgebaut.

## Karten- und Gerätegeometrie

Der Player wird innerhalb der vorhandenen Karte eingeblendet und richtet seinen unteren Abstand dynamisch an der tatsächlich gerenderten Höhe der Kartenlegende aus. Damit bleibt er in Hochformat, Querformat und Vollbild oberhalb der Legende.

Der Geräteprofiltest setzt den Zeitplayer für beide Auslieferungen testweise auf:

- Desktop;
- iPad;
- iPad Pro;
- Android Hochformat;
- Android Querformat.

Geprüft werden unter anderem linke/rechte Kartenbegrenzung, Abstand zur Legende, Wiedergabeschaltfläche, Jetzt-Schaltfläche und Zeitregler.

## Weather-Engine-Einstellungen

Unter **Radar-Zeitverlauf** wird angezeigt, ob die aktuelle Quelle eine mehrteilige Zeitreihe liefert. Bei vorhandener Timeline nennt Gewitterradar die tatsächlich verfügbare Anzahl der Radarzeitpunkte und weist auf Vergangenheit, Jetzt und Vorhersage hin.

## Kanonische Identität

- Produkt: `4.11.05`
- Anzeige: `V4.11.05 DEV`
- Build: `V4.11.05-DEV-2026-10-01`
- Runtime: `41105r1`
- Modulsatz: `E411-05A1`
- Native Integration: `0.23.4`
- Laufzeitmodule: `26`
- `core.manifest`: `1.2.51`
- `weather.precipitation-layer`: `1.2.0`

## Reale Abnahme

Nach Veröffentlichung über den bestehenden DRA-Kanal `deploy/dev` ist insbesondere zu prüfen:

1. V4.11.04 erkennt V4.11.05 automatisch und lädt die Oberfläche kontrolliert neu.
2. Sichtbare Version ist `V4.11.05 DEV`.
3. Weather-Engine zeigt **Radar-Zeitverlauf** und eine reale Framezahl.
4. Der Zeitplayer erscheint auf der Karte.
5. **Jetzt** springt auf den aktuellen Rasterzeitpunkt.
6. Vorher/Nachher wechselt jeweils genau einen Frame.
7. Der Regler kann Vergangenheit und Vorhersage direkt anwählen.
8. Wiedergabe/Pause läuft stabil.
9. Zwischen Frames entsteht kein weißes/leeres Kartenbild.
10. Zeittyp und Uhrzeit in Player und Radarlegende passen zum gewählten Frame.
11. Nach Pause oder manueller Auswahl wird der räumliche Vorladepuffer für den gewählten Zeitpunkt wieder aufgebaut.
12. Standardansicht, Vollbild, Verschieben und Zoomen bleiben stabil.
13. Blitzortung, Radien, Standort, Cluster, Kompass und Medaillon bleiben unabhängig funktionsfähig.

V4.10 FINAL und `main` bleiben unverändert.
