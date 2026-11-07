# Geschützte Entwicklungsbasis: Weltweite Temperaturkarte und GeoPoint Inspector

**Datum:** 07.11.2026 · **Repository:** TheDaimos/gewitterradar · **Branch:** deploy/dev

## Tatsächlich verifizierter Ist-Stand
- Aktueller GR-Quellstand: **4.11.155 DEV**, HA **0.25.62 DEV**, Runtime **411155r1**, Modulsatz **E411-155A1**.
- GR-Commit beim Referenzabgleich: **ca90c9010cb5093e435e1d1914c85815986f0b5b**.
- WeatherRouter weiterhin **0.10.297 DEV / Loader 300**, referenzierter Implementierungscommit **b81230457e3fbd8381da99fca797859d30509be0**; WR deploy/dev Dokumentations-HEAD **97a4974e8fc1ac5bcd6d4e5220fdcfc0a6d919e1**.
- Vorherige physisch bestätigte Performance-Referenz: **GR 4.11.152 DEV / HA 0.25.59**, Commit **787497648a405bc27495d98ffdedd9206668fd4c** zusammen mit WR 0.10.297.
- Die öffentliche GR-CI für HEAD ca90c901 meldete **TEST70-76** und **Settings/Runtime Identity** erfolgreich, aber **Frontend** und **HA-Integration** fehlgeschlagen. Deshalb: **GR 4.11.155 ist aktuelle Entwicklungsbasis, keine nachgewiesen installierte/abgenommene stabile Release-Referenz**. Nicht stillschweigend als erfolgreiche CI-Freigabe ausgeben.

## Geschützter Funktionsumfang
- Bestehende optimierte Windanimation, pausierbarer Zustand, Farbfläche, Partikelstärke, Deckkraft, Farbauswahl und Konfigurationspersistenz unverändert.
- Premium-Wind-Kartenschalter rahmenlos, 50×50 Pixel und verschiebbar; Sichtbarkeit im Windmenü wählbar: nur Vollbild / alle Ansichten / Standard und Groß / ausgeblendet.
- Premium-Originalicons nicht durch SVG-, Canvas- oder CSS-Nachzeichnungen ersetzen.
- WR bleibt autoritativ für Provider, Datenqualität, Zeitgültigkeit und Temperatur-/Winddaten; keine GR-internen 900-Sekunden-Freshness-Grenzen.
- Keine Änderungen an produktivem HA VM101, keine privaten Actions, DRA ausschließlich über deploy/dev. Alle Installationsfreigaben erst mit vollständiger öffentlicher CI und Paket-Nachweisen; VM109/Companion-Realabnahme separat kennzeichnen.
- **Ein Auftrag umfasst immer auch eine neue, über DRA installierbare DEV-Version**, nicht nur Quellcode und Dokumentation.

## Neue Produktentscheidung: Temperature World & GeoPoint Inspector
- Weltweites 2-m-Temperaturfeld, kontinuierlich verlaufende farbige Fläche mit konfigurierbarer Deckkraft; eingefärbte Temperaturwerte mit zoomabhängiger Dichte.
- **Extrem heiß = Violett**. Violett wird ausschließlich hohen Temperaturen zugeordnet; tiefe Temperaturen bleiben dunkel-/eisblau, damit keine semantische Verwechslung entsteht. Farbgrenzen sind zunächst Designvorschlag, kein festgelegter Messvertrag.
- Optional dezente thermische Advektionspfeile, deren **Richtung den Windvektor** und deren **Farbe den aus kohärenten Temperatur- und Windfeldern abgeleiteten Warm-/Kaltlufttransport** zeigt: blau für Kaltluftadvektion, orange/rot für Warmluftadvektion, neutral für geringe advektive Tendenz. Advektion nicht als unmittelbare lokale Temperaturprognose ausgeben.
- Globale Informations-Pipette als spätere Folgefunktion **GeoPoint Inspector** vorbereiten. Einheitliche Datenabfrage über geographische **Breite, Länge und gewählten Zeitpunkt**; perspektivisch Temperatur, Wind, lokale Zeit, Zeitzone, Jahreszeit, Sonne, Mond, Gezeiten, Höhenlage und Quellen-/Gültigkeitsinformationen. Gezeiten nur mit passendem Küsten-/Tidenmodell oder Provider; 'Ebbe/Flut überall' nicht behaupten.
- Temperaturebene und Inspector verwenden gemeinsame WR-Datenvertragslogik ohne zweiten unabhängigen Wetter-Provider/Renderer.

## Status und nächster Auftrag
Diese Datei ist eine **Referenz-/Anforderungsdokumentation**, noch keine Implementation der Temperaturkarte, keine DRA-Freigabe dafür. Nächster Schritt: Codex-Implementierung mit klar getrennten Prüfschritten, öffentlichen CI-Gates und installierbarem DRA-DEV-Release.
