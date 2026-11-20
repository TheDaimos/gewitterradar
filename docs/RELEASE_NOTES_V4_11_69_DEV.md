# Gewitterradar V4.11.69 DEV – Datenquellen & Verbindungen

**Datum:** 13.10.2026 · **Basis:** V4.11.68 DEV · **Entwicklungszweig:** `feature/v4.11.69-data-sources` · **Freigabe:** noch nicht realabgenommen.

## Neue Diagnosearchitektur

Unter Einstellungen → Diagnose entsteht ein eigener Bereich **Datenquellen & Verbindungen**. Er verwendet zwei registrierte Laufzeitmodule:

- `diagnostics.data-sources@0.1.0` – gemeinsame, aufklappbare Diagnoseübersicht mit Aktualisierung, JSON-Kopie und JSON-Download.
- `sources.blitzortung@0.1.0` – eigenständige Blitzortung-Konfigurations-, Verbindungs- und Standortdiagnose.
- WeatherRouter wird ausschließlich aus dem bereits vorhandenen Consumer-V1-Diagnosezustand angezeigt; es finden durch diese Anzeige keine neuen Router-Abfragen statt.

Die bisherige prominent platzierte Zeile „Blitzortung.org · Live“ samt rotem Punkt entfällt aus dem Hauptfenster. Ihre vorherige Prüfung der nicht vorhandenen Standardentität `sensor.home_lightning_counter` wurde als falsch positiv identifiziert, während bei der realen HA-Installation `sensor.gewitterradar_lightning_counter` existiert. Der unabhängige Blitzdatenpfad selbst wird nicht verändert.

## Blitzortung: mehrere Orte und Tracker getrennt

**Pro vorhandenem Blitzortung-Konfigurationseintrag** werden folgende Daten read-only ausgewiesen:

- Konfigurationsname und -kennung
- HA-Integrationszustand (geladen/nicht geladen)
- Standortmodus (Standortentität oder feste Koordinaten)
- zugeordnete Standortentität und deren Verfügbarkeit beziehungsweise hinterlegte Koordinaten
- Kopplung mit dem tatsächlich eingerichteten Gewitterradar-Referenztracker
- Erfassungsradius und Einheit, Zeitfenster, maximal verfolgte Blitzereignisse
- Herkunft von Standardwerten, falls Einstellungen im Konfigurationseintrag fehlen
- zugeordnete Sensorentitäten und deren Betriebszustände

Zusätzlich werden die vorhandene Gewitterradar-Standortauswahl und ihre Einträge **gesondert** dargestellt; sie sind nicht automatisch identisch mit den eingerichteten Blitzortung-Konfigurationen. Die Zahl der `geo_location.lightning_strike_*`-Entitäten ist als globale Bestandsinformation gekennzeichnet, nicht als Beweis einer aktiven Datenverbindung.

## Native Schnittstelle und Datenschutz

Die native Integration `0.25.1` bietet die neue, über Home Assistant authentifizierte und auf Administratoren beschränkte WebSocket-Abfrage `gewitterradar/data_sources`.

- Nur ausdrücklich benötigte, bekannte Felder werden geliefert.
- Es werden keinerlei fremde Blitzortung-Konfigurationswerte verändert.
- Einträge werden weder neu angelegt noch automatisch verknüpft.
- Fehlt die native Backend-Schnittstelle (z. B. reine Dashboard-Variante), wird dies als **nicht geprüft** statt als „Integration fehlt“ dargestellt.
- Keine neuen wiederkehrenden Hintergrundabfragen; Prüfung erfolgt beim Öffnen der Diagnose beziehungsweise auf ausdrückliche Aktualisierung oder einen Diagnoseexport hin.

## Moduldiagnose und Export

Der bestehende Modul-JSON-Export enthält jetzt zusätzlich `dataSources` einschließlich Blitzortung-Standorten und WeatherRouter-Prüfstand. Vor dem Kopieren oder Herunterladen wird eine aktuelle Blitzortung-Abfrage versucht. **Betriebszustand der Quelle und geladener Modulstand werden separat ausgewiesen.**

**Versionsidentität:** V4.11.69 DEV · Build `V4.11.69-DEV-2026-10-13` · Runtime `41169r1` · Modulsatz `E411-69A1` · native Integration `0.25.1` · **33 Laufzeitmodule**. Modulmanifest `core.manifest@1.2.130`, `ui.skeleton@1.1.23`, `diagnostics.module-view@1.3.8`.

## Regression und Realabnahme

- V4.11.68-Kartenkreis-Schutz, Aura, Cluster, Radien, Kamerafahrt, Zoom 5–18, mobile Gestenerholung, moderne Menüanimation und Wetterdarstellung bleiben funktional unverändert.
- Quell- und ausgelieferte Frontends der nativen und Dashboard-Variante müssen bytegleich sein.
- Automatischer Kontrakt: `node scripts/test-v41169-data-sources.mjs` zusätzlich zu bestehender CI.
- **Native Integration aktualisieren und Home Assistant neu starten**, damit der neue WebSocket-Befehl serverseitig registriert wird.
- Mehrere Blitzortung-Einträge kontrollieren; Konfigurationen, Standortzuordnungen, Werte und die Kopplung gegen Home Assistant überprüfen. JSON aus „Module & Versionen“ und „Datenquellen & Verbindungen“ prüfen.
- Vertrauliche Diagnoserohdaten gehören ins private Exportrepository, nicht in öffentliche GitHub-Commits.
- Keine Aussage zur **realen** Abnahme vor Tests in Home Assistant und grüner CI. Weder `main` noch `deploy/dev` wird durch dieses Entwurfs-/Feature-Vorgehen verändert.

**C.K. – Eine Idee weiter gedacht.**
