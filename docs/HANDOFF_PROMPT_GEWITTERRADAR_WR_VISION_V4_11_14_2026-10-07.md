Bootstrap: Daimos

Projekt: Gewitterradar

Repository:
TheDaimos/gewitterradar

Entwicklungszweig:
feature/v4.11-development

Wir setzen die WeatherRouter-Visualisierung von Gewitterradar exakt beim aktuellen Stand **V4.11.14 DEV** fort.

Lies ZUERST vollständig:

1. docs/HANDOFF_GEWITTERRADAR_WR_VISION_V4_11_14_2026-10-07.md
2. docs/WR-Vison.md
3. docs/RELEASE_NOTES_V4_11_14_DEV.md
4. optional zur Vorgeschichte:
   - docs/RELEASE_NOTES_V4_11_13_DEV.md
   - docs/RELEASE_NOTES_V4_11_12_DEV.md
   - docs/RELEASE_NOTES_V4_11_11_DEV.md

WICHTIG:

- ZUERST aktuellen Repository-HEAD prüfen, weil parallele Chats den Zweig weiterentwickelt haben können.
- Nicht blind neu implementieren.
- Letzter vollständig synchroner technischer Runtime-/DRA-Code-Checkpoint vor der Übergabedokumentation:
  `a12c6176b0fafc52ec4119bac668aa4fc4318454`
- Zu diesem Zeitpunkt:
  `feature/v4.11-development == deploy/dev == a12c6176b0fafc52ec4119bac668aa4fc4318454`
- Die danach angelegten Übergabedokumente dürfen `feature/v4.11-development` gegenüber `deploy/dev` vorauslaufen lassen.
- `deploy/dev` NICHT automatisch aktualisieren. Nur nach ausdrücklicher Freigabe.
- `main` und V4.10 FINAL nicht verändern.

Aktueller Produktstand des technischen Kandidaten:

- V4.11.14 DEV
- Build V4.11.14-DEV-2026-10-07
- Runtime 41114r1
- Modulsatz E411-14A1
- Integration 0.25.0
- core.manifest 1.2.85
- weather.display-menu 0.3.1
- weather.legend-overlay 0.1.1
- weather.precipitation-layer 1.3.4

Bereits im HA-Realtest bestätigt:

- finale Augen sichtbar
- Augen-Schaltfläche funktioniert
- Darstellungsmenü frei verschiebbar
- minimieren / aufklappen funktioniert
- dynamische Capability-Liste zeigt nur tatsächlich verfügbare WR-Darstellungen
- aktuell nur Niederschlag verfügbar
- der frühere Layer-Neuaufbau beim Öffnen/Minimieren des Darstellungsmenüs ist nach V4.11.12 deutlich verbessert; Nutzer: „Der Bildaufbau ist nun sooo viel besser und wird nicht mehr gestört!“

Aktuelle fachliche Zielrichtung:

1. Präzise
   - roh / rastertreu
   - keine Glättung

2. Ausgewogen
   - moderat geglättet
   - Rasterstruktur noch erkennbar

3. Weich
   - keine sichtbare pixelige Struktur
   - Wetterflächen sollen deutlich ineinanderlaufen
   - Außenkanten weich auslaufen
   - Farbübergänge flächig
   - rote/orange Starkregen-/Ereigniskerne müssen klar identifizierbar bleiben
   - Daten, Messwerte, Rasterauflösung und Routing bleiben unverändert

V4.11.14 enthält bereits einen weiteren Weich-Feinschliff:
- stärkeres Pane-weites Blur
- stärkere Blur-Radien bei Übervergrößerung
- höhere Sättigung und moderat angehobener Kontrast für Hotspot-Erhalt

WICHTIG:
Dieser V4.11.14-Feinschliff ist noch NICHT real abgenommen.
Nicht sofort weiter drehen, sondern zuerst testen.

Legende:

Der Nutzer beanstandete die vorherige Kartenlegende:
- viel zu breite Leiste
- eigentliches WR-Legendenbild viel zu klein

V4.11.14 hat bereits umgesetzt:
- kompakte Legende, Desktop max. ca. 430 px
- Kopfzeile: Titel / Quelle-Zeit / Einheit / Schließen
- eigentliches WR-Legendenbild darunter und deutlich größer
- mobile Anpassung
- mehrere aktive Legenden weiterhin stapelbar

Auch diese Änderung ist noch nicht real abgenommen.

Transparenz:

Verbindliche Forderung:
WeatherRouter-Flächenlayer müssen in der Transparenz einstellbar sein, damit untergeordnete Basiskarten/-layer sichtbar werden können.

Bereits vorhanden:
- Einstellungen: Niederschlag · Transparenz 0–100 %
- live via Leaflet setOpacity()
- keine neue WR-Anfrage
- kein Layer-Neuaufbau
- persistenter gemeinsamer Zustand
- WR-Reset stellt Provider-Standard wieder her
- Architektur bereits für Wolken, Satellit, Schnee, Temperatur, UV, Luftqualität und weitere Flächenlayer vorbereitet

Letzte Nutzerforderung:
Die Transparenz muss auch direkt im schwebenden Darstellungsmenü einstellbar sein.

V4.11.14 hat dies bereits umgesetzt:
- Transparenzregler im Niederschlagsblock des Kartenmenüs
- synchron zu den Einstellungen
- ebenfalls mit WR-Reset

Auch dies ist noch nicht real abgenommen.

NÄCHSTER ARBEITSSCHRITT:

Zuerst V4.11.14 DEV im HA-Realtest prüfen.

Pflicht-Test A – Weich:
- gleicher Kartenausschnitt / gleiche Radarzeit
- Präzise / Ausgewogen / Weich vergleichen
- Weich soll pixelige Struktur weitgehend verlieren
- Flächen sollen ineinanderlaufen
- Hotspots müssen deutlich bleiben

Pflicht-Test B – kompakte Legende:
- keine überbreite Leiste
- WR-Legendenabbildung gut lesbar und deutlich größer
- Titel / Quelle / Zeit / Einheit / Schließen sinnvoll
- keine Überlagerung mit Zeitachse / Kartenrand

Pflicht-Test C – Transparenz im Darstellungsmenü:
- Regler sichtbar
- 0 / 25 / 50 / 75 / 100 % testen
- Einstellungen und Kartenmenü spiegeln sich sofort
- WR-Reset funktioniert
- keine Ladeanimation
- keine neue WeatherRouter-Anfrage
- kein Layer-Neuaufbau

Pflicht-Test D – Android-Regression:
- Menü öffnen/minimieren/verschieben
- Stil wechseln
- Transparenz ändern
- Legende Auto/Ein/Aus
- Karte verschieben
- Pinch-Zoom
- erneut verschieben
- Android-Touch darf nicht wieder in einen Zustand geraten, in dem nur noch Zoom funktioniert

Schutzregeln:

- niemals Leaflet-Kachel-`transform` überschreiben
- niemals `transformOrigin` im WR-Rasterstil setzen
- keine globalen `touchmove`-Listener
- `location.radii-map` Gestenwache nicht beschädigen
- Consumer API / WeatherRouter-Routing nicht verändern
- keine Providerwahl in Gewitterradar
- keine Fantasie-Legenden erzeugen
- finale Augenassets unverändert lassen
- keine Behauptung „CI grün“, wenn kein tatsächlicher Lauf vorliegt

Arbeite exakt ab diesem Stand weiter und warte für die optischen Punkte auf den nächsten HA-Realtest des Nutzers.
