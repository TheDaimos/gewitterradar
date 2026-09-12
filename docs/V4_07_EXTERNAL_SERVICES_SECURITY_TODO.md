# V4.07 – Externe Dienste & Netzwerkfreigaben

Status: in V4.07 TEST4 umgesetzt und als Laufzeitinventar geprüft.

## Ziel

Dieser Leitfaden beschreibt die externen Ziele, die für Gewitterradar V4.07 tatsächlich relevant sind. Er richtet sich besonders an Installationen mit Firewall, VLAN-/Netzsegmentierung, Proxy, DNS-Filter, TLS-Inspection oder strikten ausgehenden Freigabelisten.

Wichtig ist die Trennung zwischen zwei Netzwerkpfaden:

1. **Clientseitig:** Browser bzw. Home-Assistant-Companion-App laden Karte, Kartenkacheln und Geocoding-Daten direkt aus dem Internet.
2. **Serverseitig:** Die separate Home-Assistant-Blitzortung-Integration bezieht Live-Blitzdaten vom Home-Assistant-Server aus.

Eine Freigabe nur für den Home-Assistant-Server reicht deshalb für die Ortssuche und die aktuelle Leaflet-/OpenStreetMap-Karte nicht aus.

## Aktuelles V4.07-Laufzeitinventar

| Quelle | Ziel | Protokoll / Port | Zweck | Einordnung |
| --- | --- | --- | --- | --- |
| Browser / Companion-App | `geocoding-api.open-meteo.com` | HTTPS / TCP 443 | Primäre weltweite Orts-/PLZ-Suche | Laufzeit, primär |
| Browser / Companion-App | `nominatim.openstreetmap.org` | HTTPS / TCP 443 | Geocoding-Rückfall | Laufzeit, optionaler Rückfall |
| Browser / Companion-App | `unpkg.com` | HTTPS / TCP 443 | Leaflet 1.9.4 JavaScript + CSS | Laufzeit, für aktuellen Kartenpfad erforderlich |
| Browser / Companion-App | `a.tile.openstreetmap.org` | HTTPS / TCP 443 | OpenStreetMap-Grundkartenkacheln | Laufzeit |
| Browser / Companion-App | `b.tile.openstreetmap.org` | HTTPS / TCP 443 | OpenStreetMap-Grundkartenkacheln | Laufzeit |
| Browser / Companion-App | `c.tile.openstreetmap.org` | HTTPS / TCP 443 | OpenStreetMap-Grundkartenkacheln | Laufzeit |
| Home-Assistant-Server | `blitzortung.ha.sed.pl` | MQTT / TCP 1883 | Live-Blitzdaten der separaten Blitzortung-Integration v1.7.1 | Laufzeit, serverseitig |

### Kein Netzwerkziel

Die Zeichenfolge `http://www.w3.org/2000/svg` kommt im JavaScript als SVG-Namensraum vor. Sie löst keinen HTTP-Aufruf aus und ist **keine** Firewall-Freigabe.

## Dienstbeschreibung

### Open-Meteo Geocoding

- Host: `geocoding-api.open-meteo.com`
- HTTPS/TCP 443
- Aufrufer: Browser / Companion-App
- Zweck: primäre weltweite Orts- und PLZ-Suche
- Übertragen: Suchbegriff, Sprache und nur bei ausdrücklich gewähltem Land der ISO-Ländercode
- Die Länder-Autovervollständigung arbeitet lokal und erzeugt beim Tippen keine Provider-Anfragen.
- Bei Fehler oder ungeeignetem Ergebnis kann Nominatim als Rückfall verwendet werden.

**Bei Blockierung:** Die Ortssuche kann noch über Nominatim funktionieren. Ist auch Nominatim blockiert, schlägt die Online-Ortssuche fehl.

### OpenStreetMap Nominatim

- Host: `nominatim.openstreetmap.org`
- HTTPS/TCP 443
- Aufrufer: Browser / Companion-App
- Zweck: Rückfall-Geocoding
- Übertragen: Suchbegriff, Sprache und bei expliziter Länderauswahl ISO-Ländercode
- Öffentlicher Nominatim-Dienst: Gewitterradar begrenzt Anfragen auf mindestens eine Sekunde Abstand.
- Keine Nominatim-Abfragen während der lokalen Länder-Autovervollständigung.

**Bei Blockierung:** Kein Problem, solange Open-Meteo ein brauchbares Ergebnis liefert. Sind beide Geocoding-Dienste blockiert, bleibt die Online-Suche ohne Ergebnis. Bereits gespeicherte Orte bleiben lokal verwendbar.

### Leaflet über unpkg

- Host: `unpkg.com`
- HTTPS/TCP 443
- Aufrufer: Browser / Companion-App
- Geladen werden aktuell:
  - `leaflet@1.9.4/dist/leaflet.js`
  - `leaflet@1.9.4/dist/leaflet.css`

**Bei Blockierung:** Bei einem Kaltstart ohne bereits vorhandene Leaflet-Laufzeit kann die Karte nicht initialisiert werden. Ein Browsercache oder eine bereits anderweitig geladene Leaflet-Instanz darf nicht als verlässliche Firewall-Strategie betrachtet werden.

Für besonders abgeschottete Umgebungen ist das spätere lokale Bündeln von Leaflet eine mögliche Härtungsoption; TEST4 ändert den bestehenden Kartenpfad jedoch bewusst nicht.

### OpenStreetMap-Kacheln

- Hosts:
  - `a.tile.openstreetmap.org`
  - `b.tile.openstreetmap.org`
  - `c.tile.openstreetmap.org`
- HTTPS/TCP 443
- Aufrufer: Browser / Companion-App
- Zweck: Grundkartenkacheln der aktuellen Leaflet-Darstellung

**Bei Blockierung:** Leaflet kann weiterhin laufen und Gewitterradar-Daten können vorhanden sein, die Grundkarte bleibt jedoch leer oder unvollständig.

Bei Firewalls ohne Wildcard-Unterstützung sollten die drei Hosts einzeln freigegeben werden.

### Blitzortung v1.7.1

Für den vom Nutzer real eingesetzten Blitzortung-Stand v1.7.1 wurde der Upstream-Code geprüft.

- Host: `blitzortung.ha.sed.pl`
- MQTT/TCP 1883
- Aufrufer: Home-Assistant-Server
- Zweck: Live-Blitzdaten
- Der Upstream-Code v1.7.1 erzeugt den MQTT-Client explizit für `blitzortung.ha.sed.pl` auf Port `1883`.
- Der aktuelle Pfad verwendet klassisches MQTT/TCP und nicht HTTPS.
- Die Integration berechnet aus Referenzposition und Erfassungsradius Geohash-Bereiche und richtet daran ihre MQTT-Abonnements aus.

**Bei Blockierung:** Die Blitzortung-Integration kann den Broker nicht verbinden bzw. keine neuen Live-Blitze empfangen. Gewitterradar-Ortssuche, gespeicherte Orte und Kartenabrufe sind davon technisch getrennt.

## Lokale Funktionen ohne zusätzliche Internetfreigabe

Folgende V4.07-Funktionen arbeiten innerhalb von Home Assistant:

- `device_tracker.gewitterradar`
- `device_tracker.gewitterradar_dashboard`
- `gewitterradar.set_reference_coordinates`
- `script.gewitterradar_set_reference_coordinates_dashboard`
- Local-To-do-Ortsbibliothek `Gewitterradar Orte`

Für diese Funktionen ist keine zusätzliche externe Domain erforderlich.

## Installation und Aktualisierung

GitHub/HACS sind für Installation und Aktualisierung relevant, aber **keine normale Gewitterradar-Laufzeitabhängigkeit** der geöffneten Karte. Die von HACS und GitHub verwendeten Download-/API-Ziele können sich ändern und sollten über die bestehende HACS-/Update-Freigaberichtlinie behandelt werden. Sie werden deshalb nicht als dauerhafte Gewitterradar-Laufzeitfreigaben in die obige Tabelle aufgenommen.

## DNS, Proxy, TLS-Inspection und Filter

Eine offene TCP-443-Regel allein garantiert nicht, dass die clientseitigen Funktionen arbeiten.

Zu prüfen sind zusätzlich:

- DNS-Auflösung auf dem Endgerät für Open-Meteo, Nominatim, unpkg und die OSM-Kachelhosts;
- DNS-Auflösung auf dem Home-Assistant-Server für `blitzortung.ha.sed.pl`;
- HTTPS-Proxy-Regeln;
- TLS-Inspection / Zertifikatsersetzung;
- CORS- oder Antwortfilterung bei den Geocoding-Endpunkten;
- DNS-/Werbe-/Tracking-Blocker;
- Browser-Erweiterungen oder Companion-WebView-Richtlinien.

## Datenschutz / übertragene Informationen

### Geocoding

Open-Meteo bzw. Nominatim erhalten den eingegebenen Suchbegriff, die Sprache und – nur bei explizitem Länderfilter – den ISO-Ländercode. Übliche Netzwerkmetadaten wie Quell-IP fallen beim jeweiligen Dienst ebenfalls an.

### Kartenkacheln

Die OpenStreetMap-Kachelserver erhalten die angeforderten Kachelkoordinaten. Daraus ist technisch der betrachtete Kartenausschnitt ableitbar; zusätzlich fallen übliche Verbindungsmetadaten an.

### Leaflet-CDN

`unpkg.com` erhält die Abrufe der festen Leaflet-1.9.4-Dateien und die üblichen Verbindungsmetadaten. Gewitterradar sendet an diesen Host keine Orts-Suchbegriffe.

### Blitzortung

Die separate Blitzortung-Integration abonniert MQTT-Themen passend zu den berechneten Geohash-Bereichen. Damit ist für den Broker technisch erkennbar, welche Region abonniert wird.

## Schnelldiagnose

| Fehlerbild | Zuerst prüfen |
| --- | --- |
| Ortssuche liefert Fehler/keine Ergebnisse, Karte funktioniert | `geocoding-api.open-meteo.com:443`, danach `nominatim.openstreetmap.org:443` |
| Karte startet überhaupt nicht | `unpkg.com:443`, Browser-Konsole / TLS-Inspection / Content-Filter |
| Kartenrahmen vorhanden, aber Grundkarte leer | `a/b/c.tile.openstreetmap.org:443` |
| Suche und Karte funktionieren, aber Live-Blitze fehlen oder bleiben alt | vom HA-Server `blitzortung.ha.sed.pl:1883`, Zustand/Logs der Blitzortung-Integration |
| Gespeicherte Orte funktionieren, Online-Suche nicht | Client-Freigaben für Open-Meteo/Nominatim prüfen |
| Tracker wechselt, Blitzdatenregion folgt nicht | Blitzortung muss den Gewitterradar-Tracker als `Location entity` verwenden; zusätzlich Bewegungsschwelle beachten |

## Minimale Freigabeprofile

### Vollständige V4.07-Nutzung

Client/Companion-App ausgehend:

- `geocoding-api.open-meteo.com` TCP 443
- `nominatim.openstreetmap.org` TCP 443
- `unpkg.com` TCP 443
- `a.tile.openstreetmap.org` TCP 443
- `b.tile.openstreetmap.org` TCP 443
- `c.tile.openstreetmap.org` TCP 443

Home-Assistant-Server ausgehend:

- `blitzortung.ha.sed.pl` TCP 1883

### Nur bereits gespeicherte Orte

Die Local-To-do-Ortsbibliothek und das Setzen des Gewitterradar-Trackers benötigen keinen externen Geocoding-Dienst. Für die Kartenanzeige gelten Leaflet- und OSM-Kachelziele weiterhin.

## Automatischer Sicherheitsvertrag

Der TEST4-Vertrag extrahiert die festen `http://`-/`https://`-URL-Literale aus der erzeugten JavaScript-Datei und vergleicht sie mit dem freigegebenen Inventar. Neue feste externe URL-Ziele führen damit zu einem fehlgeschlagenen Test, bis Code, Dokumentation und Freigabeliste bewusst gemeinsam aktualisiert wurden.

Aktuell erwartete URL-Literale:

- `https://geocoding-api.open-meteo.com/v1/search`
- `https://nominatim.openstreetmap.org/search`
- `https://unpkg.com/leaflet@1.9.4/dist/leaflet.css`
- `https://unpkg.com/leaflet@1.9.4/dist/leaflet.js`
- `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- `http://www.w3.org/2000/svg` – nur SVG-Namensraum, kein Netzwerkaufruf

Damit ist das zuvor offene V4.07-To-do zur Inventarisierung der externen Laufzeitziele für TEST4 abgeschlossen. Vor einem finalen Release muss die neue Hilfe noch in die vollständige Sprachmatrix übertragen und auf realen Firewall-/Filter-Szenarien verprobt werden.
