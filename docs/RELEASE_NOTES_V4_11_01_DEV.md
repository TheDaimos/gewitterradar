# Gewitterradar V4.11.01 DEV · Kandidatenhinweise (nicht öffentlich)

Status: **Entwicklungsfassung / reale WeatherRouter-Consumer-Abnahme noch ausstehend**  
Zweig: `feature/v4.11-development`  
Ursprung: V4.10 FINAL, Tag `v4.10`, Commit `3111e9d27a62adf97d37cccb8066cc9a0803c128`.  
Bereitstellung nur über bestehenden Kanal `deploy/dev` nach vollständiger Prüfung; kein neuer Entwicklungskanal.

## Neu im ersten Entwicklungspaket

- Einheitliche sichtbare Kennung `V4.11.01 DEV` und technisch prüfbare Build-/Modul-/DRA-Identität.
- Zusätzliches WeatherRouter-Consumer-V1-Modul (optional, lesender Home-Assistant-WebSocket-Zugriff). Discovery, Version, dynamischer Capability-Katalog und gezielte Resolve-Abfragen; keine Providerfestverdrahtung und keine direkte WeatherRouter-interne Abhängigkeit.
- „Weather-Engine“ in Einstellungen: Verbindung prüfen, Wetterangebot für aktuellen Kartenausschnitt abfragen, Ressourcentyp, Quellangaben und Datenalter sehen. Kein stiller Ersatz des bestehenden Blitzdatenstroms.
- WeatherRouter-V004-Logo in verlustfrei kodierter PNG-256-Ableitung, geschützte separate 512px-Rendition. Originale bleiben unverändert.
- 24 Module mit lokalisierten Modulmetadaten für alle 19 Varianten; DRA- und Frontend-Schutzprüfungen erweitert.

## Nicht Bestandteil dieser DEV-Fassung

Keine produktiven Niederschlags-/Satelliten-Layer, keine automatische Ersatzversorgung, keine Zusammenführung und Deduplizierung verschiedener Einzelblitzquellen, keine neue Backend-Monitored-Area-Verarbeitung. Diese Funktionen bleiben Folgeaufgaben gemäß beschlossenem Weather-Engine-Konzept.

## Reale Abnahme nach erfolgreicher DRA-Bereitstellung

1. Im Hauptfenster `V4.11.01 DEV` und in „Module & Versionen“ 24/24 mit erwarteter WeatherRouter-Modulversion sehen.
2. Im Einstellungsbereich „Weather-Engine“ bei fehlender Integration „nicht erreichbar“ prüfen; Blitzortung und normale Karte müssen funktionieren.
3. Bei installierter und aktiver WeatherRouter-Integration „Verbindung prüfen“, Consumer-Vertragsversion 1 und erkannten Wetterkatalog prüfen.
4. Für aktuellen Kartenausschnitt „Abfragen“ testen; Niederschlag, beobachtete Blitze und amtliche Warnungen jeweils mit Ressourcentyp, Quelle, Aktualität oder konkreter Nichtverfügbarkeit anzeigen.
5. Leeres Ereignis-Feed ist kein Fehler; Quellen dürfen nicht doppelt in den Blitzortung-Zähler wandern. Browser- und HA-Neuladen darf keine bisherigen Einstellungen oder Diagnosefunktionen beschädigen.
6. Desktop, Android und iPad sowie vollständiger DRA-Rollback bleiben reale Abnahmebedingungen.

Die Consumer-API V1 darf erst nach tatsächlicher externer Gewitterradar-/Home-Assistant-Verprobung als abgenommen gelten.
