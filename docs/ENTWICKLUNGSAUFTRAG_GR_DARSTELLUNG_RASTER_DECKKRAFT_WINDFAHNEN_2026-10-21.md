# Gewitterradar – Entwicklungsauftrag: Rasterdarstellung, Deckkraft und Windfahnen

**Datum:** 21.10.2026  
**Zielrepository:** `TheDaimos/gewitterradar`  
**Entwicklungszweig:** `deploy/dev`  
**Ausgangskontext:** Gewitterradar V4.11.100 DEV; tatsächlichen aktuellen Repository-/Versions-/CI-Stand vor Beginn erneut lesen.  
**Status:** Abgestimmte Zielvorgabe, **noch keine Implementierung oder Realabnahme**.

## 1. Ziel und verbindliche Architektur

Die vorhandene Niederschlagsdarstellung wird ohne parallele Rendererarchitektur zu einer einheitlichen **Darstellungssteuerung für geeignete Wetter-Rasterebenen** erweitert. Die Steuerungen **Rasterglättung** und **Deckkraft** bleiben unabhängig voneinander. Windfahnen/Vektorsymbole gehören **nicht** zur Rasterglättung.

Bestehende Consumer-V1/V2-Verträge, UTC-Zeitbasis, Quellenprovenienz, NoData, Lizenzangaben, Berechtigungen, geografische Abdeckung, Niederschlagsmosaik, Cache- und Leistungsgrenzen bleiben geschützt. Keine künstliche Freischaltung bislang nicht verfügbarer Layer.

## 2. Rasterglättung: Gemeinsam oder Individuell

**Übergeordnetes Auswahlfeld „Darstellung“** mit folgenden Optionen:

| Einstellung | Verhalten |
| --- | --- |
| **Auto** | Vorhandene fachlich korrekte, zoomabhängige automatische Aufbereitung auf alle unterstützten aktiven Rasterebenen anwenden |
| **Präzise** | Pixel-/Rasterkanten bewusst präzise und ohne zusätzliche Weichzeichnung darstellen |
| **Ausgewogen** | Moderate Glättung |
| **Weich** | Deutliche Glättung, ohne Inhalte oder Messwerte zu verfälschen |
| **Individuell** | Pro unterstützter Rasterebene einen der vier vorgenannten Modi speichern und auswählen |

Bei „Individuell“ können die tatsächlich verfügbaren Layer – zunächst insbesondere **Niederschlag** und **Wolken** – über ein Auswahlfeld ausgewählt und mit **Auto / Präzise / Ausgewogen / Weich** konfiguriert werden. Nicht verfügbare Layer nicht als funktionsfähig vortäuschen.

Beim Wechsel zu einem gemeinsamen Modus bleiben individuelle Layerwerte gespeichert und werden beim erneuten Umschalten wiederhergestellt. Änderungen sollen ohne manuelles Neuladen der Karte wirksam werden; keine veralteten Kacheln oder widersprüchlichen Statusmeldungen stehen lassen.

**Wichtige Regressionsprüfung V4.11.100:** In den Nutzeraufnahmen bei **Zoom 8** erscheint „Auto“ beinahe so kantig wie „Präzise“, während „Weich“ deutlich kantiger als „Ausgewogen“ wirkt. Ursache in Moduszuordnung, Stilen, Interpolation, Kachelcache und gegebenenfalls Renderpfad reproduzierbar untersuchen. Das frühere Auto-Verhalten und die sachgerechte Zuordnung der Weichzeichnung wiederherstellen, statt unbegründet einen beliebigen Blur-Wert zu erhöhen. Screenshots zeigen den sichtbaren Befund, beweisen aber noch keine konkrete Codeursache. Automatisierte Modus-/Zoom-/Layerwechseltests und echte Browserprüfung vor einem PASS.

## 3. Deckkraft: ausschließlich Gemeinsam / Individuell

**Unabhängige Einstellung „Deckkraft“** mit genau **zwei** Betriebsarten:

1. **Gemeinsam:** Ein einziger Regler steuert die Deckkraft sämtlicher aktivierter und geeigneter Wetter-Rasterebenen.
2. **Individuell:** Jede geeignete Wetter-Rasterebene besitzt ihren eigenen Regler (zunächst Niederschlag und Wolken, bei tatsächlicher Unterstützung später weitere).

**Verbindliche Werteabbildung für sämtliche Regler:**

| Angezeigter Wert | Bedeutung | Technischer Alpha-/Opacity-Wert |
| --- | --- | --- |
| 0 % | vollständig transparent / unsichtbar | 0.00 |
| 40 % | 40 % Deckkraft | 0.40 |
| 100 % | vollständig deckend, vorbehaltlich quellseitig transparenter Pixel | 1.00 |

Der bisherige als „Transparenz“ bezeichnete Schieber erhält die umgekehrte, verständliche Semantik **„Deckkraft“**. Vorhandene gespeicherte Werte **migrieren**, sofern diese tatsächlich bisher „Transparenz“ bezeichneten; ansonsten könnte ein Update das Erscheinungsbild unbeabsichtigt umkehren. Datenmodell, Defaultwerte und bestehende Benutzerpräferenzen zuerst lesen und gezielte Migrationstests ergänzen.

**Keine** zusätzlichen Deckkraftvarianten „Auto“, „Präzise“, „Ausgewogen“ oder „Weich“. Die Deckkraft ist unabhängig vom eingestellten Glättungsmodus: beispielsweise alle Layer „Weich“, aber Niederschlag 80 % und Wolken 45 % Deckkraft. Beim Wechsel zwischen gemeinsamer und individueller Deckkraft bleiben die jeweils gespeicherten Einstellungen erhalten. Quellseitiges NoData/Alpha bleibt erhalten; 100 % Deckkraft macht transparent fehlende Daten nicht künstlich sichtbar.

## 4. Wolken

Den vorhandenen Rasterdarstellungsmechanismus **für echte, unterstützte Wolkenkacheln** verwenden und dieselben vier Darstellungsmodi wie beim Niederschlag anbieten. Gemeinsame und individuelle Glättung sowie gemeinsame und individuelle Deckkraft wirken auf Wolken ebenso wie auf Niederschlag. Wetterdaten/Pixel nicht erzeugen, falls WR Consumer V1 `weather.satellite.clouds` aktuell `unavailable` meldet. Keine Vermischung verschiedener Wettergrößen durch den optischen Filter.

## 5. Windfahnen und Pfeile: separate Vektorsteuerung

Windfahnen und Pfeile werden **niemals durch den Rasterweichzeichner geglättet**. Stattdessen eigener Menübereich **„Windfahnen“**:

- Symbolform: **klassische Fieder-Windfahnen** oder **Windrichtungspfeile**.
- Knallige Farbpalette: **Schwarz, Weiß, Gold, Türkis, Violett, Magenta, Blau und Grün**.
- Im Auswahlmenü primär **eingefärbte kleine Farbbalken**, nicht bloß ausgeschriebene Farbwörter; barrierefreie zugängliche Farbnamen für Bildschirmleser und Tastaturbedienung beibehalten.
- Farbmodus **einheitlich** oder **getrennt für Hoch-/Tiefdrucksituationen**, **nur soweit** der tatsächlich vorhandene Datenvertrag eine verlässliche Zuordnung erlaubt. **Windrichtung und -stärke allein belegen kein Hoch- oder Tiefdruckgebiet**. Ohne belastbare Klassifikation keine erfundene Hoch-/Tief-Farbe; stattdessen neutralen/einheitlichen Fallback anzeigen und die fehlende Zuordnung diagnostizieren.
- Ausreichender Kontrast auch auf grauen/hellen Karten durch zurückhaltende Kontur oder Schatten; gewählte Grundfarbe erhalten.
- Auswahl dauerhaft speichern und bei Layer-/Kartenwechsel wiederverwenden.
- Ein bereits im Repository vorhandenes hochauflösendes kreisförmiges **Info-Icon (ⓘ)** verwenden; kein neues Asset erfinden, bevor das vorhandene identifiziert wurde.
- Klick auf ⓘ öffnet eine gut lesbare, auch mobil bedienbare **Windfahnenlegende** mit Windstille, Halbfieder, Vollfieder, Dreieck und der korrekten Windgeschwindigkeitsumrechnung. Übliche meteorologische Fiederwerte **5/10/50 kn** fachlich prüfen und km/h konsistent angeben. Referenzbild als gestalterische Hilfe, nicht ungeprüft als Normtabelle übernehmen.

Windfahnen und andere Vektorsymbole sollen durch globale/individuelle Raster-Deckkraft **nicht** unbeabsichtigt ausgeblendet werden.

## 6. Raster-Labor / Diagnose

Das vorhandene **Raster-Labor** soll tatsächlich unterstützte Rasterebenen auswählbar diagnostizieren können, einschließlich Wolken, statt diese trotz vorhandenen Vertrages pauschal nur als „noch nicht verfügbar“ darzustellen. `ready` und `unavailable` sauber unterscheiden: eine Capability im Katalog genügt nicht als Beweis aktueller Bildlieferfähigkeit.

Die Diagnose zeigt je Rasterebene effektiv angewendeten Glättungsmodus, Deckkraft, Datenquelle, verfügbare Kachelgeometrie und begründeten Nichtverfügbarkeitsstatus. Die Diagnostik darf gespeicherte Einstellungen nicht unbemerkt verändern. Informationsanzeigen zu echter Bildzeit/UTC/Quellenherkunft sind ein getrennter, zuvor gewünschter UI-Folgewunsch und dürfen keine fingierten Zeiten anzeigen.

## 7. Prüf- und Freigabekriterien

1. Alle vier Glättungsmodi reproduzierbar unterscheidbar und korrekt zugeordnet; insbesondere **Auto** und **Weich** bei Zoom 8 sowie mehreren Zoomstufen und nach Cache-/Layerwechsel.
2. Globale Rasterglättung wirkt auf Niederschlag **und**, sofern verfügbar, Wolken; individuelle Modi je Ebene, gespeicherte Werte bleiben erhalten.
3. Gemeinsamer Deckkraftregler 0–100 % nach neuer Semantik; individueller Modus je Ebene, ohne Kopplung an Glättungsmodi. Altdatenmigration und Wiederherstellung ausdrücklich testen.
4. Windfahnen bleiben scharf, Symboltypen umschaltbar; alle **acht** Farben verfügbar, farbiges Auswahlmenü tastatur- und mobilbedienbar; getrennte Hoch-/Tief-Farben ausschließlich anhand echter fachlicher Grundlage.
5. Info-Icon aus dem Repository, zuverlässige Legende, Einheitenprüfung, Mobil-/Desktop-Bedienung.
6. NoData, Alpha, geographische Kachelgrenzen, WR-Vertragsgrenzen, V1/V2-Niederschlag, Echtzeit/UTC, Performance, Browser (Desktop/Android/iPad) und bestehende Tests ohne Regression.
7. Versions-/Runtime-/Modulset-/HA-Integration-/Asset-/SHA-/DRA-Identität nach tatsächlichen Projektverträgen konsistent; **GitHub-Actions-Pushprüfungen** am echten neuen Programmcommit mit vollständigen Lauf- und Jobkennungen überprüfen.
8. **Keine HA-Installation ohne ausdrückliche Zustimmung**, keine echte HA-Abnahme ohne korrelierte reale Geräte- und WR/GR-Diagnosen; keine Produktionsfreigabe aus simulierten Tests.

## 8. Entwicklungsabfolge

Bestehende aktuelle Implementierung und Version im Repository prüfen; gegen die V4.11.100-Nutzerbefunde die Auto-/Weich-Regression zuerst reproduzieren. Nur den tatsächlich erforderlichen Code korrigieren und die neue Darstellungs- und Deckkraftsteuerung darauf aufbauen. Bereits fertige WL-02-Funktionen nicht neu implementieren. Danach Windfahnenmenü/Legende, Raster-Labor-Anbindung, Migrations-/Regressionstests und CI-Gates ergänzen. Den vollständigen technischen Bericht auf `deploy/dev` als Markdown committen und von GitHub wieder einlesen.

**C.K. – Eine Idee weiter gedacht.**
