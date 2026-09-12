# V4.07 – Externe Dienste & Netzwerkfreigaben

Status: verbindlicher V4.07-To-do-Punkt vor Freigabe.

## Ziel

Unter **Hilfe & Hinweise** einen eigenen Abschnitt **Externe Dienste & Netzwerkfreigaben** bereitstellen, damit Installationen mit Firewall, VLAN-/Netzsegmentierung, Proxy, DNS-Filter oder sonstigen Sicherheitsrichtlinien gezielt freigeschaltet und diagnostiziert werden können.

## Dokumentationsanforderungen

Für jeden externen Dienst müssen mindestens dokumentiert werden:

- Ziel-Domain / Hostname
- Zweck
- Protokoll und Port
- Aufrufer / Netzwerkpfad: Browser bzw. Companion-App oder Home-Assistant-Server
- Pflichtdienst oder optionaler Rückfall
- übertragene Daten in verständlicher Form
- Verhalten bei Blockierung / Zeitüberschreitung
- Datenschutz-/Attributionshinweis, soweit relevant

## Bereits bestätigte V4.07-Laufzeitdienste

### Open-Meteo Geocoding

- Host: `geocoding-api.open-meteo.com`
- Protokoll: HTTPS, TCP 443
- Zweck: primäre weltweite Orts-/PLZ-Suche
- Aufrufer: Gewitterradar-Frontend im Browser / in der Home-Assistant-Companion-App
- Übertragung: Suchbegriff, Sprache und – nur bei expliziter Länderauswahl – ISO-Ländercode
- Kein Aufruf während der lokalen Länder-Autovervollständigung
- Bei ungeeignetem/fehlendem Ergebnis kann Nominatim als Rückfall verwendet werden

### OpenStreetMap Nominatim

- Host: `nominatim.openstreetmap.org`
- Protokoll: HTTPS, TCP 443
- Zweck: Rückfall-Geocoding, wenn Open-Meteo kein hinreichendes Ergebnis liefert
- Aufrufer: Gewitterradar-Frontend im Browser / in der Home-Assistant-Companion-App
- Übertragung: Suchbegriff, Sprache und bei expliziter Länderauswahl ISO-Ländercode
- Öffentlicher Dienst: niedrige Abfragerate; Gewitterradar begrenzt Nominatim-Aufrufe auf mindestens 1 Sekunde Abstand
- Keine Nominatim-Anfragen während der Eingabe der lokalen Länder-Autovervollständigung

## Noch vollständig zu inventarisieren

Vor Abschluss der Hilfe müssen zusätzlich alle tatsächlich verwendeten externen Laufzeitziele geprüft werden, insbesondere:

- Karten-/Kachel-Dienst(e) der aktuellen Leaflet-/OpenStreetMap-Darstellung
- Blitzortung.org-Abhängigkeit: klar trennen zwischen Gewitterradar selbst und der separaten Home-Assistant-Blitzortung-Integration; deren Netzwerkzugriffe erfolgen serverseitig
- HACS/GitHub nur dort aufnehmen, wo für Installation/Aktualisierung relevant; nicht als Gewitterradar-Laufzeitdienst darstellen, wenn zur Laufzeit keine Verbindung benötigt wird
- mögliche weitere externe Assets/API-Endpunkte aus Frontend, nativer Integration und Dashboard-Paket

## Wichtige Sicherheitsdarstellung

Die Hilfe muss ausdrücklich zwischen **clientseitigen** und **serverseitigen** Freigaben unterscheiden:

- Geocoding und Kartenabrufe aus dem Gewitterradar-Frontend können vom Endgerät mit Browser/Companion-App ausgehen. Eine reine Firewall-Freigabe für den Home-Assistant-Server reicht dann nicht zwingend.
- Blitzortung-Netzwerkverkehr stammt von der Home-Assistant-Integration und damit vom Home-Assistant-Server.

## Abnahmekriterien

- Eigener Abschnitt unter `Hilfe & Hinweise` vorhanden.
- Alle Runtime-Hosts aus dem V4.07-Code inventarisiert und gegen den tatsächlichen Code geprüft.
- Client-/Server-Pfad pro Dienst angegeben.
- HTTPS/443 und ggf. weitere tatsächlich benötigte Ports korrekt dokumentiert.
- Fehlerbilder bei geblocktem Open-Meteo, Nominatim, Karten-Dienst und Blitzortung beschrieben.
- Keine Domain als erforderlich dokumentiert, die Gewitterradar nicht tatsächlich anspricht.
- Deutsche und englische Grundfassung vorhanden; anschließend Übertragung in die vollständige Sprachmatrix.
