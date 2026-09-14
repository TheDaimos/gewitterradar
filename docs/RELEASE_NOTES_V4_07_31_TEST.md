# Release Notes – V4.07.31 TEST CANDIDATE

**Datum:** 2026-09-14  
**Status:** Near-Final-Testkandidat / nicht veröffentlicht  
**Geschätzter Reifegrad:** ca. **95 %**  
**Native Integration:** 0.19.0  
**Branch:** `feature/v4.07.31-help-i18n-complete`  
**Rückfallbasis:** V4.06 bleibt unverändert veröffentlicht und eingefroren.

> Die 95-%-Angabe ist eine interne Projektabschätzung des aktuellen Funktions- und Abnahmestands. Sie ist keine Release-Garantie und ersetzt nicht die verbleibenden realen Geräte-, Netzwerk- und Freigabeprüfungen.

## Einordnung

V4.07.31 bündelt den nahezu vollständigen V4.07-Funktionsstand. Schwerpunkt der V4.07-Linie ist die weltweite Standortarchitektur: Ortssuche, dynamischer Gewitterradar-Bezugsstandort, gespeicherte Orte, Kopplung an Blitzortung über eine `Location entity`, umfangreiche Hilfe-/Netzwerkdiagnose sowie die vollständige 19-Varianten-Sprachschicht.

Die Detailhistorie der vorangegangenen TEST-Stufen bleibt in `docs/RELEASE_NOTES_V4_07_TEST.md` erhalten. Dieses Dokument beschreibt den aktuellen Near-Final-Stand V4.07.31 und die noch verbleibenden Freigabegates.

## Funktionsumfang V4.07

- Weltweite Orts-/PLZ-Suche direkt im bestehenden Standortmenü.
- Open-Meteo als primärer Geocoding-Dienst; kontrollierter Nominatim-Rückfall.
- Lokale Länder-Autovervollständigung mit 249 ISO-3166-1-alpha-2-Ländercodes.
- Explizite Länderauswahl als harter Filter; automatisch ermitteltes Heimatland nur als weiche Präferenz.
- Gruppierung von Suchtreffern nach Ländern mit direkter Länderfilterung.
- Gewitterradar-eigener dynamischer GPS-`device_tracker` für den Bezugsstandort.
- Service `gewitterradar.set_reference_coordinates` für die native Integration.
- Separater Dashboard-Tracker und Setz-Script für die Dashboard-Auslieferung.
- Bewusste Trennung von **Bezugsstandort** und **aktivem Blitzdatenbereich**.
- Halbautomatischer Blitzortung-Einrichtungsweg über eine einmalig konfigurierte `Location entity`.
- `Nutzen` übernimmt den gewählten Ort, schließt die Suche und fokussiert die Karte.
- Lokale Ortsbibliothek `Gewitterradar Orte` über Local-To-do.
- `★ Speichern` für eigene Orte.
- Reversibles Entfernen mit `×` durch Statuswechsel auf `completed` statt physischem Löschen.
- Bereich „Entfernte Orte“ und Wiederherstellung mit `↶`.
- Erneutes Speichern eines weich entfernten Ortes reaktiviert den vorhandenen Eintrag statt ein Duplikat anzulegen.
- Standortmenü schließt bei Klick/Tap außerhalb, ohne interne Interaktionen zu stören.
- Release History mit vollständiger DE-/EN-Darstellung und eigenem Sprachumschalter.

## Hilfe, Diagnose und Netzwerktransparenz

- Erweiterter Bereich **Externe Dienste & Netzwerkfreigaben**.
- Klare Trennung zwischen clientseitigen Browser-/Companion-Zielen und serverseitigen Home-Assistant-/Blitzortung-Zielen.
- Dokumentierte Laufzeitziele für Open-Meteo, Nominatim, Leaflet/unpkg, OpenStreetMap-Kacheln und den Blitzortung-MQTT-Broker.
- Fail-closed URL-Inventar: neue feste externe URL-Ziele müssen bewusst dokumentiert werden.
- Premium-Hilfe-Icons und deterministische eingebettete SVGs ohne neue Laufzeitabhängigkeit.
- Hervorhebung relevanter Domains, Ports, Protokolle, Dienste und Entity-/Service-Bezeichner in der Hilfe.
- Zoom-/Viewport-sichere Scrolllogik in Einstellungen und Hilfe.
- Überarbeitete Hilfetexte für Referenzstandort, Radien, Diagnose, empfohlene Grundeinstellungen und Netzwerkpfade.
- Premium-Aktionsdarstellung für Speichern, Entfernen, Wiederherstellen und `Nutzen`.
- `Location entity` bleibt als wichtiges Konzept hervorgehoben, wurde in V4.07.30 visuell bewusst zurückgenommen.
- Akzeptierte Radien-Semantik und Radien-Darstellung bleiben unverändert.

## Internationalisierung – V4.07.31

V4.07.31 schließt die letzte bekannte Lücke der Hilfe-Internationalisierung.

- Deutsch und Englisch bleiben nativ im Haupt-JavaScript verfügbar.
- 17 weitere Sprachvarianten werden über das externe Locale-Modul geladen.
- Gesamtumfang bleibt **15 Sprachen + 4 deutsche Dialektvarianten = 19 Varianten**.
- Vollständige Schema- und Abschnittsprüfung über alle 19 Varianten.
- Alle vier Dialekte – **Boarisch, Plattdüütsch, Sächs’sch und Schwäbisch** – erhalten vollständige eigene Hilfetexte statt großer geerbter Standarddeutsch-Blöcke.
- Technische Eigennamen, Domains, Protokolle, Entity-IDs und Service-Namen werden bewusst nicht künstlich übersetzt.
- Neuer Regressionstest verhindert bekannte vollständige Standarddeutsch-Rückfälle in den Dialektfassungen.
- Bereits korrekt dialektisierte Alttexte werden akzeptiert und nicht nur deshalb künstlich verändert, weil sie aus einer vorherigen Stufe stammen.
- Die frühere komplette V4.07.29-Registry wird durch die V4.07.31-Registry ersetzt und nicht zusätzlich dupliziert.

## Deterministische Build-Identität

### Haupt-JavaScript V4.07.31

- Größe: **1.779.464 Bytes**
- SHA256: `2d13746361d52af29be279f0c273d7fc3ca381a531a82f26efe8c82f3a871b31`

### Externes Locale-Modul V4.07.31

- Größe: **401.387 Bytes**
- SHA256: `898182f61b59682cd34607219018437999081b67e171e7f8955df454ec3d7ccb`

### GitHub-Actions-Komplettartefakt

- Name: `v407-test31-complete`
- Artifact-ID: `10366237921`
- Größe: **2.238.710 Bytes**
- Artifact-ZIP SHA256: `91f4e615029040c1f01498355071871c693c771c5bf9d82efadc1586cf9d6917`
- Inhalt: sechs Dateien einschließlich V4.07.30-Vergleichsstand, V4.07.31, Locale-Modul und `SHA256SUMS.txt`.

## Automatisierte Prüfung

Der V4.07.31-spezifische Komplettlauf ist erfolgreich.

Bestätigt sind unter anderem:

- deterministische Rekonstruktion der Kandidatenkette;
- exakte V4.07.29-/V4.07.30-Ausgangsidentitäten;
- Syntaxprüfung;
- V4.07.31-Hauptdatei deterministisch aus der exakten V4.07.30-Basis erzeugt;
- 2 native + 17 externe Hilfevarianten geprüft;
- vollständige Acht-Abschnitt-Struktur der Hilfe;
- Dialekt-Rückfallprüfung;
- V4.07.31-Registry ohne parallele alte V4.07.29-Komplett-Registry;
- HACS-Integration-Validierung erfolgreich;
- Paketvertrag erfolgreich;
- Hassfest erfolgreich;
- Home-Assistant-2026.9.0-Laufzeittests erfolgreich.

## Sicherheits- und Kompatibilitätsregeln

- Keine Manipulation fremder Blitzortung-ConfigEntries.
- Keine direkte `.storage`-Manipulation.
- Keine privaten/undokumentierten Home-Assistant-Frontend-APIs.
- Kein veraltetes `device_tracker.see`.
- Native Integration und Dashboard verwenden während der Testkoexistenz getrennte Tracker-IDs.
- Ein verschobener Gewitterradar-Tracker ist nicht automatisch der Nachweis eines bereits synchronisierten Blitzdatenbereichs.
- V4.06 bleibt bis zur V4.07-Freigabe unveränderte öffentliche Rückfallbasis.
- Kein Merge nach `main`, kein V4.07-Release-Tag und keine öffentliche Freigabe allein aufgrund des 95-%-Reifegrads.

## Noch offen bis 100 % / öffentliche V4.07-Freigabe

### Finaler V4.07.31-Gerätetest

- Deutsch/Englisch plus repräsentative externe Sprachen und mindestens die vier Dialekte real umschalten.
- „Hilfe & Hinweise“ vollständig durchscrollen; lange Texte, Sonderzeichen, Aktionsschaltflächen und Hervorhebungen prüfen.
- Ortssuche, Ländergruppierung, Ranking, Speichern/Entfernen/Wiederherstellen und `Nutzen` auf Desktop, Android und iPad/iPad Pro final regressionsprüfen; iPhone/iOS nach Möglichkeit ergänzen.
- Responsive Verhalten, Touch-Ziele, Dropdowns und Scrollgrenzen final prüfen.

### Blitzortung / Datenregion

- Neuabonnierung und Bewegungsschwelle nochmals real mit kleinen und großen Standortwechseln prüfen.
- Latenz des Datenregionswechsels dokumentieren.
- Neustart-/Restore-Verhalten prüfen.
- Belastbaren sichtbaren Status für Bezugsstandort versus tatsächlich synchronisierte Blitzdatenregion entscheiden/abschließen.
- Recorder-/Datenbankauswirkungen des finalen Standortwechsels beobachten.

### Netzwerk / abgeschottete Installationen

- Hilfehinweise in mindestens einem real segmentierten/gefilterten Szenario prüfen, soweit verfügbar: Firewall, DNS-Filter, Proxy oder TLS-Inspection.
- Sicherstellen, dass Fehlerbilder und Freigabehinweise den tatsächlichen Client-/Server-Pfaden entsprechen.

### Release-Freeze

- finalen Shared-Frontend-/Browserlauf auf dem vorgesehenen Freeze-Commit vollständig grün bestätigen;
- Dashboard und native Integration aus demselben akzeptierten Frontendstand synchronisieren;
- sichtbare Release History, README, Changelog, History, Milestones und finale Release Notes auf den endgültigen V4.07-Stand synchronisieren;
- finale Asset-/Package-/SHA256-Inventare erzeugen;
- exakt akzeptierten Commit einfrieren und taggen;
- HACS-/Release-Auslieferung aus exakt diesem Stand erzeugen;
- V4.06 als unveränderliche Rückfallbasis behalten.

## Nicht als V4.07-Blocker behandeln

Folgende Punkte bleiben wertvoll, sollen aber die aktuelle V4.07-Finalisierung nicht unnötig erweitern:

- Upstream-Anfrage an `mrk-its/homeassistant-blitzortung` für einen offiziellen Wechsel zwischen festen Koordinaten und `Location entity` im Reconfigure-Flow; V4.07 besitzt eine akzeptierte sichere Zwischenlösung.
- Globales Gewitter-Lagebild / Storm Feed.
- MapLibre als zweite Karten-Engine.
- Wetter-/Radarzellen und weitere Wetterebenen.
- 120-Minuten-Wiedergabe.
- Tornado-/Unwetter-/Alarmierungsfunktionen.
- weitere Cluster-Verfeinerung.
- Vollbild- und Earth-/3D-Ansichten.
- zusätzliche Komfortfunktionen der Standortverwaltung.

## Nächster sicherer Schritt

V4.07.31 nicht weiter funktional erweitern, sondern zunächst die verbleibenden finalen Realgeräte-/Datenregions-/Netzwerkprüfungen abschließen. Neue Produktideen bleiben bis zum Freeze im Backlog und werden erst danach separat priorisiert/versioniert.
