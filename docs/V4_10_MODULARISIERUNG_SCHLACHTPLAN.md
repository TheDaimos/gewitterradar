# Gewitterradar V4.10 – Schlachtplan Modularisierung

> **Status:** AKTIV  
> **Arbeitszweig:** `feature/v4.10.02-modularization`  
> **Start:** 2026-09-21  
> **Ziel:** Die bisherige große Gewitterradar-JavaScript-Datei in klar abgegrenzte ES-Module zerlegen, ohne die Installation als eine Home-Assistant-/HACS-Integration zu verändern. Die dauerhaft registrierte Hauptdatei bleibt als stabiler Einstiegspunkt bestehen. Jedes Modul trägt seine eigene Version und registriert seine tatsächlich geladene Identität selbst.

---

## 0. Verbindliche Arbeitsregeln

Diese Datei ist der **persistente Arbeitsstand** für die Modularisierung.

Nach jedem abgeschlossenen Arbeitsschritt wird eine Schleife ausgeführt:

1. Änderung implementieren.
2. Syntax-/Struktur-/Regressionstests ausführen.
3. Ergebnis und Auffälligkeiten prüfen.
4. Diesen Schlachtplan aktualisieren:
   - Checkbox des erledigten Punkts setzen,
   - `NÄCHSTER SCHRITT` aktualisieren,
   - Arbeitsprotokoll ergänzen,
   - falls nötig neue Folgepunkte aufnehmen.
5. Erst danach mit dem nächsten Punkt beginnen.

Wenn ein Chat endet oder der Kontext knapp wird, gilt:
> **„Schau in den Schlachtplan und führe ihn weiter fort.“**

Dann ist diese Datei die maßgebliche Fortsetzungsquelle.

### Sicherheitsregel

Die Modularisierung erfolgt **verhaltensneutral in kleinen Schritten**. Keine große gleichzeitige Neuimplementierung. Zuerst wird bestehende Logik 1:1 ausgelagert, getestet und erst danach funktional weiterentwickelt.

---

# NÄCHSTER SCHRITT

**M12 – DRA-Ende-zu-Ende vollständig durchführen.**

Aktuell:
- M03 ist nach vollständigem gemeinsamen Frontend-/Browser-Gate abgeschlossen,
- aktueller vollständig geprüfter auslieferbarer Feature-Stand: `ced692d9a81fc863c5406abee876b0d2ec5fc78d`,
- alle 5 PR-Workflows sind auf diesem Head grün: Source archive, Diagnostic contract, Hi-Res asset retention, Integration und gemeinsames Frontend,
- `deploy/dev` ist nach der Modul-Details-Iteration exakt auf `ced692d9a81fc863c5406abee876b0d2ec5fc78d` promoviert,
- der automatisierte DRA-Vertragsnachweis einschließlich V4.09-Rückfallquelle ist grün,
- reale M12-Abnahme auf Home Assistant DEV gestartet: DRA V0.15.5 nutzt ein reines Lesetoken, erkennt Gewitterradar als `ready`, übernimmt den empfohlenen Kanal `deploy/dev` und friert ihn auf `6223081c127baad5dae084aec2bb0a6061865416` ein,
- erste reale Vorschau auf HA DEV erfolgreich: **24 neu / 3 geändert / 0 entfernt / 30 unverändert**,
- der Versionswächter fällt beim ersten Übergang erwartungsgemäß auf den stärksten lokal gemeinsam vorhandenen Marker `CONF_LEGACY_IMPORT_VERSION` zurück; der neue Quellmarker `BUILD_VERSION = "4.10.02"` besitzt im bisherigen lokalen Stand noch kein Gegenstück,
- reale DRA-Installation des vollständigen verwalteten Baums ist erfolgreich abgeschlossen; Staging, Sicherung, Installation und `verify_install` liefen ohne Fehler,
- DRA meldet ausdrücklich **NEUSTART ERFORDERLICH** und führt keinen stillen Neustart aus,
- Home Assistant wurde vollständig neu gestartet; DRA sperrte sich danach automatisch wieder,
- post-install DRA-Datei-/Versionsprüfung ist erfolgreich: **0 neu / 0 geändert / 0 entfernt / 57 unverändert**, Quelle **4.10.02** = lokal **4.10.02** über `BUILD_VERSION`,
- Gewitterradar-Laufzeit-Soll/Ist ist real bestätigt: **V4.10.02**, **22/22 Module geladen**, **Versionssatz konsistent**,
- offen bleiben Cache-/Mischstandprüfung, Einzelmodul-Delta, Erkennung veralteter/fehlender Module sowie der reale DRA-Rückfall auf `deploy/v4.09`.

---

# 1. Zielarchitektur

Geplanter Grundaufbau:

```text
frontend/
├── gewitterradar.js
├── core/
│   ├── app.js
│   ├── registry.js
│   ├── state.js
│   └── constants.js
├── map/
│   ├── map.js
│   ├── layers.js
│   ├── clusters.js
│   └── lightning.js
├── fullscreen/
│   ├── fullscreen.js
│   ├── instruments.js
│   └── location-pill.js
├── instruments/
│   ├── compass.js
│   ├── compass-selector.js
│   └── medallion.js
├── ui/
│   ├── settings.js
│   ├── dialogs.js
│   ├── controls.js
│   └── styles.js
├── providers/
│   ├── providers.js
│   ├── nasa.js
│   └── eumetview.js
├── diagnostics/
│   ├── logging.js
│   └── diagnostics.js
└── utils/
    ├── storage.js
    ├── geometry.js
    └── helpers.js
```

Der genaue Baum wird nach M01 verbindlich eingefroren.

---

# 2. Versionsmodell

## 2.1 Anwendungsversion

Gewitterradar behält seine sichtbare Gesamtversion:

```text
V4.10.01
V4.10.02
...
```

## 2.2 Modulversion

Jedes eigenständige Modul besitzt zusätzlich eine **eigene Version**.

Beispiel:

```text
Gewitterradar V4.10.07

core/app             1.0.0
map/clusters         1.3.0
fullscreen           2.1.1
compass              2.0.0
compass-selector     1.2.0
location-pill        1.4.2
settings             3.0.1
```

Die Modulversion wird **im jeweiligen Modul selbst** geführt.

Verbindliche Metadaten je Modul:

```javascript
export const MODULE_META = {
  id: "compass-selector",
  version: "1.0.0",
  group: "instruments",
  function: "Kompassauswahl",
  subfunctions: [
    "Popup-Steuerung",
    "Vorheriger Kompass",
    "Nächster Kompass"
  ]
};
```

Das Modul registriert sich beim tatsächlichen Laden selbst.

---

# 3. Modulregister

Ein zentrales Laufzeitregister sammelt ausschließlich die von den **tatsächlich geladenen Modulen** gemeldeten Informationen.

Anforderungen:

- [x] eindeutige Modul-ID
- [x] Modulversion
- [x] Funktionsgruppe
- [x] Hauptfunktion
- [x] Unterfunktionen
- [x] Dateipfad
- [x] Build-Kennung auf Anwendungsebene
- [x] Ladezeitpunkt
- [x] Doppeltregistrierung erkennen
- [x] fehlende erwartete Module erkennen
- [x] Versionsabweichungen erkennen
- [x] Registry blockiert den Start bei rein diagnostischen Fehlern nicht unnötig

---

# 4. Hauptmenü „Module & Versionen“

Neuer Hauptmenü-Unterpunkt:

**Module & Versionen**

Er zeigt nach Funktionsbereichen gruppiert die tatsächlich geladenen Module.

Beispiel:

```text
Module & Versionen

Gewitterradar V4.10.07
18 / 18 Module geladen
✓ Versionssatz konsistent

Karte
  map                 1.2.0
  clusters            1.3.0
  lightning           1.1.2

Vollbild
  fullscreen          2.1.1
  location-pill       1.4.2

Instrumente
  compass             2.0.0
  compass-selector    1.2.0
  medallion           1.5.0
```

Detailansicht je Modul:

- [x] Name / ID
- [x] geladene Modulversion
- [x] Funktion
- [x] Unterfunktionen
- [x] Dateipfad
- [x] Ladezeitpunkt
- [x] erwartete Version
- [x] Status Soll/Ist
- [x] Build-Kennung über Anwendungsmetadaten im Diagnoseexport

Gesamtzustände:

- [x] **grün:** geladen und erwartete Version
- [x] **gold:** geladen, aber andere Version
- [x] **rot:** Modul fehlt / Ladefehler

Diagnoseausgabe:

- [x] Diagnose kopieren
- [x] JSON herunterladen
- [x] vollständige Soll-/Ist-Liste ausgeben

---

# 5. Stabiler Einstiegspunkt

`gewitterradar.js` bleibt der dauerhaft registrierte Einstiegspunkt.

Ziele:

- [x] Home Assistant kennt weiterhin nur **eine** Gewitterradar-Ressource.
- [x] Keine manuelle Registrierung einzelner Module.
- [x] Module werden über ES-Module geladen.
- [x] HACS/Integration installiert weiterhin das Gesamtpaket.
- [x] Der Ressourcenpfad bleibt stabil.
- [x] Cache-Strategie verhindert Mischstände verschiedener Builds.

Zu prüfen:

- [x] versionsbewusster Loader festgelegt
- [x] Cache-Busting für abhängige Module
- [ ] Verhalten Home-Assistant-App / Android-WebView
- [ ] Verhalten Desktop-Browser
- [ ] Verhalten nach HACS-/DRA-Update

---

# 6. DRA-Kompatibilität – HARTE ABNAHMEBEDINGUNG

Die neue Struktur wird von Beginn an für Deploy Relay Agent ausgelegt.

> **Pflicht:** Keine V4.10-Iteration der Modularisierung gilt als abgeschlossen, wenn sie nicht vollständig über DRA installiert, geprüft und wiederhergestellt werden kann. Manuelles JS-Kopieren ist kein regulärer Entwicklungsweg mehr.

Gewitterradar-Anforderungen an DRA:

- [ ] kompletten Modulbaum deployen können
- [ ] nur geänderte Dateien erkennen können
- [ ] Deployment als konsistenten Versionssatz behandeln
- [ ] installierte Anwendungsversion erkennen
- [ ] Modulmanifest/Soll-Liste bereitstellen
- [ ] Frontend-only-Änderungen erkennen
- [ ] notwendigen HA-Neustart korrekt melden
- [ ] Browser-/Frontend-Neuladen von HA-Neustart unterscheiden
- [ ] stabilen Einstiegspunkt ohne manuelle Ressourcenänderung über DRA aktualisieren
- [ ] kompletten Modulstand atomar/konsistent installieren
- [ ] installierten Soll-Modulstand für Gewitterradar bereitstellen
- [ ] DRA-Deployment als Pflichtprüfung jeder Iteration durchführen

DRA-seitige Zusatzanforderungen aus der V4.10-Planung:

- [ ] zuletzt verfügbare/installierte Versionen pro Projekt anzeigen
- [ ] gezielte Wiederherstellung einer älteren Version
- [ ] lokale Snapshots mit Version + Commit verknüpfen
- [ ] Snapshot-Aufbewahrungszahl **pro Projekt** einstellbar
- [ ] Bereinigung alter Snapshots erst nach erfolgreichem Deployment
- [ ] unmittelbar vorherigen funktionierenden Stand schützen
- [ ] Snapshot-Integrität vor Wiederherstellung prüfen

Hinweis: Die konkrete DRA-Implementierung wird im DRA-Repository separat dokumentiert; dieser Abschnitt definiert die Gewitterradar-Schnittstellenanforderungen.

---

# 7. Migrationsphasen

## M01 – Bestandsaufnahme

- [x] aktuelle V4.10.01-Dateistruktur erfassen
- [x] aktuelle Haupt-JS ermitteln
- [x] Größe / grobe Funktionsblöcke bestimmen
- [x] globale Zustände erfassen
- [x] direkte DOM-Abhängigkeiten erfassen
- [x] Home-Assistant-Abhängigkeiten erfassen
- [x] Map-/Provider-Abhängigkeiten erfassen
- [x] Ziel-Modulbaum finalisieren
- [x] Reihenfolge der Extraktion festlegen

**Abschlusskriterium:** Modulgrenzen und Abhängigkeiten sind dokumentiert.

## M02 – Registry & Modulmetadaten

- [x] `core/registry.js` erstellen
- [x] Metadatenschema definieren
- [x] Registrierungsfunktion erstellen
- [x] Diagnosefunktion erstellen
- [x] Soll-/Ist-Vergleich vorbereiten
- [x] Test-Dummy oder erstes echtes Modul registrieren

**Abschlusskriterium:** Ein geladenes Modul kann seine eigene Version zuverlässig melden.

## M03 – Stabiler Loader

- [x] `gewitterradar.js` als stabilen Einstiegspunkt vorbereiten
- [x] erste Imports auslagern
- [x] Ladefehlerbehandlung
- [x] Cache-Konzept implementieren
- [x] App-/Desktop-Test

**Abschlusskriterium:** Gewitterradar startet über den neuen Loader ohne Funktionsverlust.

**Stand:** abgeschlossen. Der gemeinsame Frontend-Workflow auf Head `15f007a32b4c424302eacbb865da224af84b32ff` besteht die vollständigen Dashboard-/Integrations-Browsersuiten einschließlich Desktop, iPad und Android-Portrait/-Landscape.

## M04 – Core auslagern

- [x] Konstanten
- [~] Zustandsverwaltung – gemeinsame Basis ausgelagert, fachlicher Karten-/UI-Zustand bleibt bewusst in Funktionsmodulen
- [x] allgemeine Helfer
- [x] Speicher-/Persistenzgrundlagen
- [x] Geometriehelfer
- [x] Leaflet-/Asset-Grundlagen

**Abschlusskriterium:** Core-Bausteine sind getrennt, bestehendes Verhalten unverändert.

**Stand:** technisch weitgehend umgesetzt über `modules/core/base-context.js`, `runtime.js`, `registry.js`, `card-lifecycle.js` und `source-status.js`. Browserregression bleibt Release-Gate.

## M05 – UI auslagern

- [x] Dialoge
- [x] Bedienelemente
- [x] Einstellungen
- [x] Styles soweit sinnvoll modularisiert
- [x] Hauptmenü-Anbindung

**Abschlusskriterium:** UI läuft vollständig aus Modulen.

**Stand:** technisch umgesetzt über `ui/skeleton.js`, `ui/controls.js`, `ui/i18n-settings.js`, `ui/render.js` und `ui/scroll-guard.js`. Browser-/Geräteabnahme bleibt M13.

## M06 – Instrumente auslagern

- [x] Kompass
- [x] Kompassauswahl / Popup
- [x] Medaillon
- [x] Verschieben / Touch
- [x] Sichtbarkeit
- [x] Instrument-Metadaten

**Abschlusskriterium:** technische Auslagerung abgeschlossen; Desktop-/Android-Regressionsabnahme bleibt M13.

**Stand:** Kompass/Design/Skala/Selector liegen in Instrument-Modulen; Medaillon-, Touch- und Sichtbarkeitslogik ist funktionsgerecht auf Instrument-, UI-, Vollbild- und Diagnosemodule verteilt.

## M07 – Vollbild auslagern

- [x] Vollbildsteuerung
- [x] Standort-Pille
- [x] Instrumentintegration
- [x] Layer-Prioritäten
- [x] Drag-/Touch-Logik
- [x] responsive Mehrspaltigkeit

**Abschlusskriterium:** technische Auslagerung abgeschlossen; Vollbildregression bleibt M13.

**Stand:** zentral in `fullscreen/map-display.js` und den zugehörigen UI-/Kartenmodulen umgesetzt.

## M08 – Karte auslagern

- [x] Kartenkern
- [x] Layer
- [x] Cluster-Auflösung
- [x] Cluster-Navigation
- [x] Blitzdarstellung
- [x] Radien
- [x] Aura

**Abschlusskriterium:** technische Auslagerung abgeschlossen; Kartenregression bleibt M13.

**Stand:** umgesetzt über `location/radii-map.js`, `map/strikes-warnings.js`, `map/clusters-recent.js` sowie die gemeinsamen Karten-/Vollbildbausteine.

## M09 – Provider auslagern – NICHT ANWENDBAR

Dieser Punkt stammte aus einer WeatherRouter-Architekturvorlage. Im Gewitterradar-Repository existieren keine NASA-/EUMETView-Provider und kein Satelliten-Playback. Es werden deshalb **keine fachfremden Provider künstlich in Gewitterradar eingeführt**.

- [x] Repository auf NASA/EUMETView/Provider-Verweise geprüft
- [x] Punkt als nicht anwendbar dokumentiert

**Abschlusskriterium:** erfüllt – keine Provider-Migration für Gewitterradar erforderlich.

## M10 – Diagnose & Logging auslagern

- [x] Ereignisprotokoll
- [x] Diagnosefunktionen
- [x] Export
- [x] Moduldiagnose integriert

**Abschlusskriterium:** Diagnose ist vollständig modular.

**Stand:** `diagnostics/cockpit.js` enthält Diagnose-/Logging-/Exportfunktionen; `diagnostics/module-view.js` ergänzt die Laufzeit-Moduldiagnose.

## M11 – Menü „Module & Versionen“

- [x] Menüeintrag
- [x] Gruppenansicht
- [x] Unterfunktionen
- [x] Modulversionen
- [x] Soll-/Ist-Prüfung
- [x] Statusfarben
- [x] Detailansicht
- [x] Diagnose kopieren
- [x] JSON herunterladen

**Abschlusskriterium:** Der Nutzer kann nach einem Update eindeutig sehen, welche Modulversion tatsächlich geladen wurde.

## M12 – DRA-Ende-zu-Ende-Test – RELEASE-GATE

- [x] Deployment des kompletten Modulbaums
- [ ] Deployment nur eines geänderten Moduls
- [x] Soll-/Ist-Metadaten prüfen
- [ ] Browsercache-Fall simulieren
- [ ] veraltetes Modul erkennen
- [ ] fehlendes Modul erkennen
- [ ] Rollback testen
- [x] Neustart-/Frontend-Reload-Hinweis prüfen

**Automatisierter Repository-Vorabnachweis (kein Ersatz für die reale DRA-/HA-DEV-Abnahme):**
- [x] Default-Branch besitzt DRA-Manifest und empfohlenen Kanal `deploy/dev`.
- [x] DRA-Zentralkatalog führt Gewitterradar als `ready` / `dev`.
- [x] `deploy/v4.09` existiert als manifestfähiger älterer Rückfallstand.
- [x] `BUILD_VERSION` ist für V4.10.02 und V4.09 DRA-lesbar und vergleichbar.
- [x] Paketvertrag simuliert Komplettbaum, genau ein geändertes Modul, fehlendes Modul, veraltete Zusatzdatei und saubere Rückfall-Konvergenz ohne Mischstand.
- [x] Home-Assistant-StaticPath-Vertrag bestätigt deaktivierte Cache-Header.
- [x] DRA-Lifecycle bleibt `home_assistant_restart`; kein stiller Neustart ist erlaubt.
- [x] aktueller verwalteter V4.10-Baum liegt mit 57 Dateien / 11.246.740 Bytes deutlich innerhalb der DRA-Policy (5.000 Dateien / 157.286.400 Bytes).

Zwei reale M12-Abnahmepunkte sind inzwischen nachgewiesen: kompletter DRA-Installationslauf und korrekter manueller Neustarthinweis. Die übrigen sechs Haken bleiben offen, bis der neu gestartete HA-DEV-Stand geprüft, die verbleibenden Diagnose-/Deltafälle real nachgewiesen und anschließend über DRA auf `deploy/v4.09` zurückgesetzt wurde.

**Abschlusskriterium:** DRA und Gewitterradar liefern gemeinsam eine belastbare Ende-zu-Ende-Versionsprüfung.

## M13 – Regression & Freigabe

- [ ] Desktop
- [ ] Android / HA Companion
- [ ] Kartenansichten
- [ ] Vollbild
- [ ] Kompass
- [ ] Medaillon
- [ ] Standort-Pille
- [ ] Layer-Menü
- [ ] Cluster
- [ ] Einstellungen
- [ ] Provider
- [ ] Logging
- [ ] HACS
- [ ] DRA
- [ ] Cache-/Update-Pfade
- [ ] Syntax/Lint/Tests
- [ ] Checksummen
- [ ] CHANGELOG
- [ ] HISTORY / Release Notes

**Abschlusskriterium:** modularer V4.10-Stand ist releasefähig.

---

# 8. Nicht verhandelbare Regressionen

Während der Modularisierung dürfen insbesondere nicht verloren gehen:

- bestehende Kartenfunktionen
- Vollbildmodus
- frei verschiebbare Instrumente
- Touch-Unterstützung Android
- Standort-Pille inklusive Öffnungsrichtung und Mehrspaltigkeit
- Layer-Anzeige immer im Vordergrund
- Diagnosemodus-Sichtbarkeitsregeln
- Kompass-/Medaillon-Ein-/Ausblenden
- gespeicherte Orte
- bestehende Einstellungen
- Provider/Playback
- Logging
- HACS-Installierbarkeit
- DRA-Installierbarkeit

---

# 9. Entscheidungsprotokoll

| Datum | Entscheidung | Grund |
|---|---|---|
| 2026-09-21 | Gewitterradar wird ab V4.10 modularisiert. | Monolithische JS-Datei ist zu groß und erschwert Wartung/gezielte Änderungen. |
| 2026-09-21 | Nur ein stabiler HA-Einstiegspunkt bleibt registriert. | Keine Registrierung vieler Einzeldateien nötig. |
| 2026-09-21 | Jedes Modul trägt seine eigene Version. | Geladene Teilstände werden unabhängig nachvollziehbar. |
| 2026-09-21 | Module registrieren ihre Version selbst zur Laufzeit. | Anzeige soll tatsächlichen Browser-Ladestand statt nur Sollzustand zeigen. |
| 2026-09-21 | Hauptmenü erhält „Module & Versionen“. | Direkte Prüfung nach Updates. |
| 2026-09-21 | Modularisierung wird DRA-fähig entworfen. | Gezieltes Deployment und Rollback sollen möglich sein. |
| 2026-09-21 | DRA-Snapshot-Aufbewahrung wird projektbezogen. | Unterschiedliche Projekte benötigen unterschiedliche Historientiefen. |

---

# 10. Arbeitsprotokoll

## Schleife 000 – Schlachtplan angelegt

**Datum:** 2026-09-21  
**Status:** erledigt

Ergebnis:
- persistenter V4.10-Schlachtplan angelegt,
- Zielarchitektur beschrieben,
- Modulversionsmodell festgelegt,
- Laufzeit-Selbstregistrierung verbindlich aufgenommen,
- Menü „Module & Versionen“ spezifiziert,
- DRA-Schnittstellenanforderungen aufgenommen,
- Migrationsphasen M01–M13 definiert,
- Fortsetzungsregel für neue Chats festgelegt.

**Nächster Schritt:** M01 – Bestandsaufnahme.


## Schleife 001 – Schlüsselwort „Schlachtplan“ verankert

**Datum:** 2026-09-21  
**Status:** erledigt

Ergebnis:
- `PROJECT_DEFAULTS.md` kennt „Schlachtplan“ jetzt als verbindlichen Projektbegriff,
- Verweis auf `docs/V4_10_MODULARISIERUNG_SCHLACHTPLAN.md` ist fest hinterlegt,
- neuer Chat muss den Repository-Stand laden und an `NÄCHSTER SCHRITT` fortsetzen,
- Schleifenregel ist als verbindlicher Fortsetzungsmechanismus dokumentiert.

Commit: `660707a4efffcdef8ffb7ca2e81d7e494ec3ff87`

## Schleife 002 – DRA als Pflichtpfad festgeschrieben

**Datum:** 2026-09-21  
**Status:** erledigt

Ergebnis:
- DRA ist für V4.10 kein optionaler Zusatz mehr, sondern harte Abnahmebedingung,
- reguläre Installation/Aktualisierung/Rollback müssen vollständig über DRA funktionieren,
- manueller Austausch einzelner JS-Dateien ist nur Notfall-/Diagnoseweg,
- DRA-Sollstand und Gewitterradar-Iststand der geladenen Module werden als Ende-zu-Ende-Prüfung gekoppelt,
- M12 ist ausdrücklich als Release-Gate markiert.

**Nächster Schritt bleibt:** M01 – Bestandsaufnahme und endgültige Modulgrenzen.


## Schleife 003 – M01 Bestandsaufnahme abgeschlossen

**Datum:** 2026-09-21  
**Status:** erledigt

Ergebnis:
- V4.10.01 als unveränderte Rückfallbasis erhalten,
- neuer Arbeitszweig `feature/v4.10.02-modularization` angelegt,
- Hauptdatei mit 2.249.312 Bytes / 24.896 Zeilen / 299 Methodenblöcken vermessen,
- funktionale Modulgrenzen und Extraktionsreihenfolge festgelegt,
- bestehende statische Ordnerbereitstellung der nativen Integration als kompatibel bestätigt,
- Architektur in `docs/V4_10_MODULE_ARCHITECTURE.md` dokumentiert,
- fehlendes `deploy-relay.json` als zwingender DRA-Arbeitspunkt identifiziert.

**Nächster Schritt:** M02 – Registry & Modulmetadaten.


## Schleife 004 – M02 Registry & Modulmetadaten abgeschlossen

**Datum:** 2026-09-21  
**Status:** erledigt

Ergebnis:
- `frontend/modules/core/registry.js` angelegt,
- Selbstregistrierung mit Modul-ID, eigener Version, Gruppe, Funktion, Unterfunktionen, Datei, Ladezeit und URL implementiert,
- Soll-/Ist-Diagnose mit `ok`, `missing`, `version_mismatch`, `unexpected` implementiert,
- Doppeltregistrierungen werden erkannt,
- `frontend/module-manifest.js` definiert Produktstand V4.10.02 und erwartete Funktionsmodule,
- `scripts/test-module-registry.mjs` prüft Selbstregistrierung und Diagnose.

**Nächster Schritt:** M03 – stabiler Loader + Build-/Auslieferungspfad.


## Schleife 005 – M03 Loader technisch umgesetzt, Browserabnahme läuft

**Datum:** 2026-09-22  
**Status:** technisch umgesetzt / Browserregression noch offen

Ergebnis:
- `gewitterradar.js` bleibt der einzige registrierte Home-Assistant-Einstiegspunkt,
- Module werden parallel über einen zentralen Cache-Token geladen,
- Ladefehler werden abgefangen und als sichtbarer Gewitterradar-Fehlerzustand dargestellt,
- Modulbaum bleibt über HACS und DRA vollständig auslieferbar,
- M09 als irrtümlich aus WeatherRouter übernommener Provider-Punkt identifiziert und als nicht anwendbar korrigiert.

Offen:
- Browser-Abnahmetest für den ersten About-Start; hierfür wurde der Testzustand erweitert protokolliert.

**Nächster Schritt:** Browserregression beheben, danach M03 schließen und M04 weiterführen.


## Schleife 006 – Modularer Browserpfad und Moduldiagnose konsolidiert

**Datum:** 2026-09-22  
**Status:** laufend / Browser-CI entscheidet M03-Abschluss

Ergebnis:
- modularer Loader bleibt einziger Home-Assistant-Einstiegspunkt,
- Ladefehler-Fallback und Cache-Token sind aktiv,
- Browserparser-Kompatibilität des Diagnosemoduls normalisiert,
- Build-/Asset-Inventarprüfung auf den modularen Quellverbund erweitert,
- About-Harness auf modulare Startzeiten erweitert und mit Browserdiagnose versehen,
- `core.base-context` bestätigt Konstanten, Sprache, Speichergrundlagen, Geometrie, Leaflet- und Asset-Helfer als ausgelagert,
- „Module & Versionen“ vollständig umgesetzt: Gruppen, Funktionen, Soll/Ist, Versionsstatus, Detailansicht, Kopieren und JSON-Export,
- DRA-Manifest liefert weiterhin den kompletten Integrations-/Modulbaum per `replace_directory`.

Offen:
- gemeinsamer Frontend-/Browser-Gate muss grün werden,
- danach M03 formell schließen,
- anschließend M05–M10 gegen realen Modulbestand formal nachziehen und M12 DRA-Ende-zu-Ende starten.

**Aktueller Prüfcommit:** `c6cf76277639907e2c306fa2242176dea9ca18da`


## Schleife 007 – Abgeschlossene Modularisierungspunkte nachgezogen

**Datum:** 2026-09-22  
**Status:** erledigt

Abgehakt wurden ausschließlich bereits im Repository nachweisbar umgesetzte Punkte:
- vollständiges Laufzeit-Modulregister,
- vollständige Modul-/Versionsdetailansicht,
- stabiler einzelner Home-Assistant-Einstiegspunkt samt ES-Modulen und Cache-Busting,
- M05 UI-Auslagerung,
- M06 Instrument-Auslagerung,
- M07 Vollbild-Auslagerung,
- M08 Karten-Auslagerung,
- M10 Diagnose-/Logging-Auslagerung,
- M11 „Module & Versionen“ bereits zuvor vollständig abgeschlossen.

Bewusst offen bleiben:
- M03 App-/Desktop-Browserabnahme,
- Android/HA-Companion-Regressionsprüfung,
- DRA-Ende-zu-Ende M12,
- vollständige Regression und Freigabe M13.

**Nächster Schritt:** laufenden gemeinsamen Browser-Gate auswerten und M03 nur bei grünem Ergebnis schließen.


## Schleife 008 – Chat-Übergabe und aktueller Blocker gesichert

**Datum:** 2026-09-22  
**Status:** Übergabepunkt / Arbeit läuft im nächsten Chat weiter

Ergebnis:
- vollständige Übergabe in `docs/V4_10_CHAT_HANDOFF_2026-09-22.md` angelegt,
- Arbeitsweise mit verbindlicher Schleife ausdrücklich dokumentiert,
- DRA erneut als harte Abnahmebedingung festgehalten,
- Draft-PR #24 bleibt offen,
- letzter geprüfter Arbeits-Head vor der Übergabe: `a18adb21a7581de4909bf178bcfb18ae1b923535`,
- 4/5 Gates grün: Source archive, Diagnostic contract, Hi-Res asset retention, Integration,
- einziges rotes Gate: `Validate shared Gewitterradar frontend`,
- aktueller konkreter Blocker: `ReferenceError: __moduleDeps is not defined` beim isolierten Ausführen von `gewitterradar.js` durch `scripts/verify-about-locales.mjs`,
- Ursache: Boot-Preflight referenziert `__moduleDeps`, während der Locale-Harness den eigentlichen modularen Bootstrap für die isolierte VM entfernt.

**Nächster Schritt:**
1. aktuellen Branch-Head und CI nach Chatstart neu prüfen,
2. `scripts/verify-about-locales.mjs` modular-runtime-fähig machen,
3. gemeinsames Frontend-Gate erneut laufen lassen,
4. M03 ausschließlich bei grünem Browser-/Frontend-Gate schließen,
5. danach M12 DRA-Ende-zu-Ende vollständig abarbeiten.

**Fortsetzung:** `docs/V4_10_CHAT_HANDOFF_2026-09-22.md`

## Schleife 009 – M03 Browser-Gate abgeschlossen

**Datum:** 2026-09-22  
**Status:** erledigt

Ergebnis:
- aktuellen PR-#24-Stand auf Head `f52b29eadbeffc9380b6ce487d5355fee0b7409a` neu verifiziert; der übergebene `__moduleDeps`-Fehler war weiterhin aktuell,
- `scripts/verify-about-locales.mjs` an den modularen Boot-Preflight angepasst, ohne die Produktionslogik in `gewitterradar.js` zurückzubauen,
- Browser-Harness in `scripts/test-about-locales.mjs` auf den realen modularen Laufzeitkontext `__moduleDeps` umgestellt,
- Android-Landscape-Fehlalarm im historischen Fokus-Stabilitätstest behoben: Scrollbewegung des kurzen Viewports wird nicht mehr als Reflow gewertet; echte Layout-/Größenänderungen bleiben blockierend,
- `Validate shared Gewitterradar frontend` vollständig grün: deterministischer Build, Syntax, About/Help-Locale-Verträge, Recorder-Audit, Diagnosevertrag, Sprach-Onboarding, Settings/Help, Golden-Geometrie und beide vollständigen Auslieferungs-Browsersuiten,
- Dashboard und Integration bestanden Desktop, iPad sowie Android Portrait/Landscape,
- alle fünf PR-Workflows auf Head `15f007a32b4c424302eacbb865da224af84b32ff` grün.

Relevante Commits:
- `0d3680957e971d88c6697dbfbc47046dff4faec2` – About-/Locale-Harness für modularen Preflight,
- `b3b290fb491394976d171229fa4c67fa285b67b1` – Browser-Harness nutzt modularen Laufzeitkontext,
- `15f007a32b4c424302eacbb865da224af84b32ff` – Fokus-Scroll von echtem About-Reflow getrennt.

**Nächster Schritt:** M12 – DRA-Ende-zu-Ende vollständig durchführen.

## Schleife 010 – M12 DRA-Vertrag vorbereitet und automatisiert abgesichert

**Datum:** 2026-09-22  
**Status:** automatisierter Vorabnachweis erledigt; reale DRA-/HA-DEV-Abnahme bleibt offen

Ergebnis:
- Gewitterradar-Default-Branch um reine DRA-Metadaten ergänzt; V4.09-Produktionscode blieb dabei unverändert,
- DRA-Katalog in `TheDaimos/deploy-relay-agent` nach grünem CI auf `ready` / `dev` aktualisiert,
- empfohlener Gewitterradar-Kanal auf den DRA-Promotionszweig `deploy/dev` umgestellt,
- manifestfähiger Rückfallzweig `deploy/v4.09` angelegt,
- deklarative DRA-Buildmarker `4.10.02` und `4.09` ergänzt, damit Upgrade/Downgrade semantisch erkannt werden kann,
- `scripts/verify-deploy-relay-contract.py` ergänzt: Komplettbaum, Einzelmodul-Delta, fehlendes Modul, veraltete Zusatzdatei, Cachevertrag und Rollback-Konvergenz,
- CI lädt für den Rückfalltest den echten Zweig `deploy/v4.09` und verlangt das Entfernen sämtlicher V4.10-Modulreste,
- DRA-Paketvertrag auf dem Zwischenstand grün; HACS-Paketvertrag wurde anschließend um den neuen Buildmarker erweitert,
- Feature-DRA-Manifest bytegleich zur auf `main` veröffentlichten Metadatenfassung ausgerichtet, um den späteren PR-Base-Abgleich zu entschärfen.

Bewusst **nicht** als M12 erledigt markiert:
- reale Installation von V4.10.02 über DRA auf HA DEV,
- reale Soll-/Ist-Prüfung nach Installation,
- realer Neustart und anschließende Prüfung,
- realer Rückfall über DRA auf `deploy/v4.09`,
- erneute Prüfung auf fehlende/veraltete Module nach dem realen Rückfall.

**Nächster Schritt:** finalen CI-Head vollständig grün bekommen, anschließend als `deploy/dev` promoten und danach M12 auf der realen HA-DEV-Instanz über DRA ausführen.

## Schleife 011 – DRA DEV-Promotion nach vollständigem CI

**Datum:** 2026-09-22  
**Status:** Promotion erledigt; reale M12-Abnahme weiterhin offen

Nachweis:
- exakter Kandidat `6223081c127baad5dae084aec2bb0a6061865416` bestand alle fünf PR-Gates,
- gemeinsames Frontend-Gate einschließlich beider vollständigen Browser-Auslieferungssuiten grün,
- Integrations-Gate einschließlich HACS, hassfest, Home-Assistant-2026.9.0-Runtime und DRA-Paketvertrag grün,
- Source-Archive-, Diagnostic- und Hi-Res-Verträge grün,
- PR #24 auf diesem Stand mergeable,
- `deploy/dev` neu angelegt und exakt auf `6223081c127baad5dae084aec2bb0a6061865416` gesetzt,
- Default-Branch-Policy `deploy-relay-channel.json` empfiehlt `branch: deploy/dev`,
- Rückfallquelle `deploy/v4.09` steht auf `421426be1b98fd96bf1642a7601d2ceee02e11d9` und besitzt ein eigenes DRA-Manifest sowie `BUILD_VERSION = "4.09"`,
- empfohlener V4.10-Stand besitzt `BUILD_VERSION = "4.10.02"`.

**Harte Restbedingung M12:** auf der realen HA-DEV-Instanz Gewitterradar über DRA aus `deploy/dev` installieren/aktualisieren, Soll/Ist prüfen, Home Assistant manuell neu starten, anschließend über DRA auf `deploy/v4.09` zurücksetzen und erneut auf Mischstände/fehlende Module prüfen.

**M13 bleibt gesperrt**, bis diese reale DRA-Abnahme nachweisbar erfolgreich ist.

## Schleife 011 – DRA-DEV-Kandidat vollständig grün und promoviert

**Datum:** 2026-09-22  
**Status:** Vorbereitung abgeschlossen; reale DRA-/HA-DEV-Abnahme bleibt M12-Gate

Ergebnis:
- finalen Feature-Head `6223081c127baad5dae084aec2bb0a6061865416` nach den M12-Vertragsänderungen neu geprüft,
- alle fünf PR-Workflows auf exakt diesem Head grün,
- Integrationsworkflow einschließlich Home-Assistant-Laufzeittests, HACS-Prüfung und `Verify Deploy Relay consumer contract` grün,
- gemeinsamer Frontend-Workflow einschließlich beider Dashboard-/Integrations-Browsersuiten grün,
- DRA-Promotionsregel eingehalten: `deploy/dev` zeigt exakt auf den vollständig geprüften Commit `6223081c127baad5dae084aec2bb0a6061865416`,
- `deploy/v4.09` bleibt die manifestfähige ältere Rückfallquelle,
- keine der acht realen M12-Abnahme-Checkboxen wurde allein aufgrund von CI/Simulation abgehakt.

**Nächster Schritt:** reale M12-Abnahme auf Home Assistant DEV ausschließlich über DRA durchführen: `deploy/dev` installieren, Neustart/Frontend-Neuladen und Modul-Soll/Ist prüfen, Fehler-/Mischstände nachweisen und anschließend über DRA auf `deploy/v4.09` zurücksetzen und erneut prüfen.


## Schleife 012 – Reale DRA-Vorschau auf HA DEV erfolgreich

**Datum:** 2026-09-22  
**Status:** erster realer M12-Teilnachweis erledigt; noch keine Schreiboperation ausgeführt

Nachweis auf der realen Home-Assistant-DEV-Instanz:
- Deploy Relay V0.15.5 ist im gesperrten Betrieb aktiv; Vorschau und Diagnose funktionieren ohne Schreibfreigabe,
- Gewitterradar wird mit Repository `TheDaimos/gewitterradar`, Manifest `deploy-relay.json`, Status `ready` und vorhandenem **Lesetoken** erkannt,
- empfohlener Kanal `dev` / Ref `deploy/dev` wurde übernommen,
- DRA hat die Quelle auf den exakten Commit `6223081c127baad5dae084aec2bb0a6061865416` eingefroren,
- reale Dateivorschau: **24 neu, 3 geändert, 0 entfernt, 30 unverändert**,
- Versions-/Regressionswächter meldet Quelle und lokalen Altstand noch über `CONF_LEGACY_IMPORT_VERSION`; das ist vor der ersten V4.10.02-Installation erwartbar, weil der neue `BUILD_VERSION`-Marker lokal noch fehlt,
- deshalb wurde noch keine M12-Installationscheckbox vorzeitig abgehakt.

**Nächster Schritt:** Entwicklungsmodus explizit aktivieren, Installation des eingefrorenen `deploy/dev`-Commits über **Staging + Sicherung + Installieren** ausführen, DRA-Ergebnis und Neustarthinweis prüfen; erst danach Home Assistant manuell neu starten und die post-install Versions-/Moduldiagnose kontrollieren.


## Schleife 013 – Reale DRA-Installation auf HA DEV erfolgreich

**Datum:** 2026-09-22  
**Status:** Installationspfad erfolgreich; Neustart und Laufzeitprüfung folgen

Nachweis aus der realen Deploy-Relay-Oberfläche:
- Entwicklungsmodus wurde explizit aktiviert; Schreibzugriff war nur für die ausdrücklich bestätigte Installation freigegeben,
- Quelle blieb auf `deploy/dev` und den exakten Commit `6223081c127baad5dae084aec2bb0a6061865416` eingefroren,
- DRA meldet **Installation erfolgreich**,
- Transaktion wurde abgeschlossen und eine Sicherung unter `/config/deploy_relay/backups/gewitterradar/...` angelegt,
- Diagnoseprotokoll zeigt die Phasen `staging`, `backup`, `install`, `verify_install` und `success` sowie anschließend `complete`,
- Fehlerhistorie: **0 Fehler**; die vorhandene Versionswarnung stammt weiterhin aus dem erwarteten ersten Legacy-Marker-Vergleich vor dem Neustart,
- DRA zeigt projektweit und im Gewitterradar-Eintrag deutlich **Neustart erforderlich** an und weist ausdrücklich darauf hin, dass Home Assistant manuell neu gestartet werden muss,
- damit sind die realen M12-Punkte **Deployment des kompletten Modulbaums** und **Neustart-/Frontend-Reload-Hinweis prüfen** abgeschlossen.

**Nächster Schritt:** Home Assistant jetzt manuell vollständig neu starten. Danach zuerst DRA erneut öffnen und prüfen, dass es wie vorgesehen wieder **GESPERRT** ist; anschließend Gewitterradar starten und die reale `BUILD_VERSION = 4.10.02`- sowie Modul-Soll/Ist-Diagnose prüfen.


## Schleife 014 – DRA-Diagnoseexport der realen Installation ausgewertet

**Datum:** 2026-09-22  
**Status:** Diagnose-/Transaktionsnachweis erfolgreich

Ausgewerteter Export:
- `.deploy-relay/diagnostics/gewitterradar/2026-09-22/20260922T085322Z-deploy-dev-6223081c127b-d24ccae2.json`
- Deploy Relay V0.15.5 / Home Assistant 2026.9.2,
- `error_history` ist leer,
- empfohlener Kanal wurde vor Installation erneut erfolgreich gegen `deploy/dev` und Commit `6223081c127baad5dae084aec2bb0a6061865416` verifiziert,
- eingefrorenes Quellinventar: **57 Dateien / 11.246.740 Bytes**,
- frischer Zielvergleich direkt vor Installation: **24 neu / 3 geändert / 0 entfernt / 30 unverändert**,
- Versionswächter meldete nur die bereits bekannte erwartete Legacy-Marker-Warnung; `regression=false`,
- Staging vollständig, Sicherung erstellt, anschließend **27 betroffene Dateien** installiert,
- `verify_install` bestätigte **27 geänderte Dateien**,
- Transaktion endete mit `state=success`, `status=success`, `restart_required=true`,
- Sicherungspfad: `/config/deploy_relay/backups/gewitterradar/dra-20260922T084812Z-gewitterradar-6223081c127b`,
- Git-Export-Konfiguration und Export selbst wurden erfolgreich abgeschlossen; im Protokoll ist der übergebene Token als `<redacted>` maskiert.

**Bewertung:** Der reale DRA-Installationspfad ist nicht nur optisch, sondern auch über den strukturierten Diagnoseexport konsistent und ohne Fehler nachgewiesen. Der laufende Home-Assistant-Neustart bleibt der nächste harte Prüfschritt; erst danach werden Laufzeitversion und Modul-Soll/Ist bewertet.


## Schleife 015 – Neustart und erneute DRA-Sperre real bestätigt

**Datum:** 2026-09-22  
**Status:** Neustart erfolgreich; post-install Laufzeitprüfung läuft

Nachweis nach vollständigem Home-Assistant-DEV-Neustart:
- Deploy Relay V0.15.5 ist erwartungsgemäß wieder **GESPERRT**,
- Deployment-Schreibzugriffe sind damit nach dem Neustart automatisch deaktiviert,
- Gewitterradar bleibt im DRA-Katalog auf Status `ready`,
- ausgewählte Quelle bleibt `branch: deploy/dev` auf Commit `6223081c127baad5dae084aec2bb0a6061865416`,
- der vorherige Hinweis **Neustart erforderlich** ist nach dem Neustart verschwunden,
- damit ist der reale Neustartpfad inklusive automatischer Rückkehr in den gesperrten Zustand bestätigt.

**Nächster Schritt:** im gesperrten DRA-Betrieb eine neue Vorschau gegen denselben eingefrorenen `deploy/dev`-Stand berechnen. Erwartung: keine Dateidifferenzen mehr und Versionswächter erkennt nun den installierten `BUILD_VERSION = 4.10.02`-Stand. Anschließend Gewitterradar öffnen und `Module & Versionen` auf vollständigen Soll-/Ist-Gleichstand prüfen.


## Schleife 016 – Post-Install-Konvergenz und BUILD_VERSION real bestätigt

**Datum:** 2026-09-22  
**Status:** DRA-Dateibaum und Versionsidentität nach Neustart vollständig bestätigt

Nachweis auf der realen Home-Assistant-DEV-Instanz im wieder gesperrten DRA-Betrieb:
- neue Vorschau gegen den weiterhin eingefrorenen Stand `deploy/dev` / `6223081c127baad5dae084aec2bb0a6061865416`,
- Ergebnis: **0 neu / 0 geändert / 0 entfernt / 57 unverändert**,
- Versions- und Regressionsprüfung meldet **Versionsstand identisch**,
- Git-Quelle: **4.10.02**,
- lokal: **4.10.02**,
- erkannt über **BUILD_VERSION**,
- damit ist nach dem Neustart ausgeschlossen, dass im von DRA verwalteten Integrationsbaum ein Datei-Mischstand verblieben ist.

**Bewusst noch nicht abgehakt:** `Soll-/Ist-Metadaten prüfen` auf M12-Ebene, weil zusätzlich die tatsächlich im Browser geladenen Gewitterradar-Module über **Module & Versionen** geprüft werden müssen. DRA-Dateisystemzustand und Gewitterradar-Laufzeitregister bleiben zwei getrennte Nachweise.

**Nächster Schritt:** Gewitterradar auf HA DEV öffnen → **Module & Versionen** aufrufen → prüfen, dass alle erwarteten Module geladen sind und keine Zustände `missing`, `version_mismatch` oder `unexpected` vorliegen. Danach den M12-Soll-/Ist-Punkt abschließen.


## Schleife 017 – Alte Lovelace-Ressourcenregistrierung als realer Migrationsblocker erkannt

**Datum:** 2026-09-22  
**Status:** reale Migrationsauffälligkeit erkannt; Laufzeitprüfung pausiert bis Ressourcenpfad korrigiert ist

Nachweis auf der realen Home-Assistant-DEV-Instanz:
- unter **Einstellungen → Dashboards → Ressourcen** ist noch die historische Dashboard-/HACS-Ressource `/hacsfiles/gewitterradar-dashboard/gewitterradar-v4.09.28.js?v=28` registriert,
- DRA hat zwar den nativen V4.10.02-Integrationsbaum vollständig und bytegleich installiert, aber der Browser würde mit diesem alten Ressourceneintrag weiterhin die V4.09.28-Karte laden,
- die native Integration stellt den stabilen Pfad `/gewitterradar/gewitterradar.js` bereit; dieser Pfad ist laut Installationsvertrag der kanonische Ressourceneintrag für die native Variante,
- die Integration registriert die Lovelace-Ressource bewusst nicht automatisch und verändert keine privaten Home-Assistant-`.storage`-Dateien,
- deshalb darf die M12-Laufzeit-Soll/Ist-Prüfung erst nach manueller Umstellung auf genau eine aktive native Ressource fortgesetzt werden.

**Nächster Schritt:** historischen Ressourceneintrag entfernen und `/gewitterradar/gewitterradar.js` als **JavaScript-Modul** eintragen. Danach Browser/Companion vollständig neu laden und erst dann Gewitterradar → **Module & Versionen** prüfen.


## Schleife 018 – DRA-Dateibaum vorhanden, statische HA-Route liefert real 404

**Datum:** 2026-09-22  
**Status:** Ursache weiter eingegrenzt; kein Produktionsfix auf Verdacht

Realer Nachweis:
- unter `/config/custom_components/gewitterradar/frontend/` liegen `gewitterradar.js`, `module-manifest.js`, `assets/`, `locales/` und `modules/` vollständig am erwarteten DRA-Ziel,
- direkter Aufruf `/gewitterradar/gewitterradar.js` liefert auf HA DEV dennoch **404 Not Found**,
- damit ist ein falscher DRA-Zielpfad ausgeschlossen,
- aktueller Integrationscode registriert `/gewitterradar` bereits in `async_setup()` über `StaticPathConfig(..., False)`,
- vorhandener Home-Assistant-HTTP-Test `tests/test_frontend_delivery.py` prüft genau diesen Pfad erfolgreich nach `async_setup_component(hass, "gewitterradar", {})`,
- deshalb muss vor einer Codeänderung real geprüft werden, ob die native Gewitterradar-Integration auf HA DEV tatsächlich geladen ist bzw. ob ihr Setup beim Start fehlgeschlagen ist.

**Nächster Schritt:** Home Assistant → **Einstellungen → Geräte & Dienste → Integrationen** öffnen und den Status des nativen Eintrags **Gewitterradar** prüfen. Falls kein Eintrag vorhanden ist, native Integration hinzufügen; falls der Eintrag fehlerhaft/nicht geladen ist, den konkreten Setup-Fehler aus HA ermitteln. Erst bei geladenem Config Entry + weiterhin 404 wird die Routenregistrierung im Produktionscode geändert.


## Schleife 019 – Vorhandene HA-Core-Logs gegen den 404 geprüft

**Datum:** 2026-09-22  
**Status:** kein Gewitterradar-Setupfehler im vorhandenen Logauszug nachgewiesen

Ergebnis:
- aktueller Arbeitszweig-Head `7c3223dd9ed61c17475987f6745fb74a801c4fb5` erneut geprüft,
- PR #24 weiterhin offen/Draft und mergebar,
- alle fünf PR-Workflows auf diesem Head grün,
- vorhandener HA-Memory-/Core-Logreport enthält im erfassten letzten Logfenster keinen Treffer für Gewitterradar bzw. `custom_components.gewitterradar`,
- damit ist ein konkreter Setup-Trace bislang nicht belegt; der reale 404 bleibt mit einem nicht geladenen/noch nicht angelegten nativen Config Entry vereinbar,
- kein Produktionscode wird ohne realen Setupfehler auf Verdacht geändert.

**Nächster Schritt:** auf HA DEV unter **Einstellungen → Geräte & Dienste → Integrationen** prüfen, ob ein nativer Gewitterradar-Config-Entry existiert und geladen ist. Fehlt er, Gewitterradar einmal als native Integration hinzufügen; ist er fehlerhaft, den angezeigten Setupfehler auswerten. Danach `/gewitterradar/gewitterradar.js` erneut direkt testen.


## Schleife 020 – Native Integration und Modul-Soll/Ist real bestätigt

**Datum:** 2026-09-22  
**Status:** realer Laufzeitnachweis erfolgreich

Nachweis auf Home Assistant DEV:
- native Gewitterradar-Integration wurde erfolgreich als Config Entry eingerichtet,
- der zuvor beobachtete 404 auf `/gewitterradar/gewitterradar.js` war damit auf den noch fehlenden nativen Integrationseintrag zurückzuführen, nicht auf einen DRA-Zielpfad- oder Frontend-Buildfehler,
- Gewitterradar startet anschließend sichtbar als **V4.10.02**,
- Bereich **Module & Versionen** meldet **22 / 22 Module geladen**,
- Status: **Versionssatz konsistent**,
- damit ist die reale Kopplung aus DRA-Dateisystemstand und tatsächlich geladenem Browser-Modulregister bestätigt,
- M12-Punkt **Soll-/Ist-Metadaten prüfen** ist abgeschlossen.

**Nächster Schritt:** M12 weiter mit kontrolliertem Delta-/Fehlerfall: genau ein geändertes Modul über DRA nachweisen und danach gezielt Cache-/Mischstand sowie fehlendes/veraltetes Modul prüfen. Anschließend realer Rollback auf `deploy/v4.09`.


## Schleife 021 – Modulübersicht kompakt + Modul-Details-Pop-up umgesetzt

**Datum:** 2026-09-22  
**Status:** Implementierung und Strukturvertrag abgeschlossen; CI-Auswertung folgt

Umgesetzt:
- Hauptmenü **Module & Versionen** zeigt nur noch den kompakten Gesamtstatus: Anwendungsversion, geladene Module und Versionskonsistenz,
- keine eingebettete Modulliste und keine innere Scrollfläche mehr im Hauptblock,
- neue goldene Schaltfläche **Modul-Details**,
- großer responsiver Detaildialog im bestehenden Premium-/Metallstil mit Hi-Res-Schließen-Symbol,
- vollständige Modulliste ausschließlich im Detaildialog,
- Diagnosegruppe wird im Detaildialog zuerst dargestellt,
- jedes Modul besitzt eine kompakte Zeile mit eigener Version/Status und eine aufklappbare Detailansicht für Status, Ist-Version, Soll-Version, Dateipfad, Ladezeitpunkt und Funktionen,
- **Diagnose kopieren** und **JSON herunterladen** befinden sich im Detaildialog,
- Einstellungsbereich **Module & Versionen** wurde im Hauptmenü unter **Kalibrierung & Diagnose** verschoben,
- `diagnostics.module-view` wurde wegen der eigenständigen Änderung von **1.0.0 auf 1.1.0** angehoben,
- kanonisches Frontend, native Integrationsauslieferung und Dashboard-Auslieferung sind bytegleich,
- V4.10.02-Modulvertrag und `SHA256SUMS_FRONTEND.txt` wurden auf die neuen Bytes aktualisiert,
- `scripts/verify-frontend.mjs` erzwingt künftig Schaltfläche, Pop-up, Exportaktionen und die Reihenfolge unter Diagnose als CI-Vertrag.

Technischer Stand vor CI:
- Feature-Head: `31663a77282720419417b32319e65abaa9ffa973`,
- `diagnostics.module-view`: **1.1.0**, SHA256 `75e5b9facd376765635979038c68200a39ee2862b88d0c435716c609318745af`, 16.777 Bytes,
- `module-manifest.js`: SHA256 `8b60aa3b9b736463c5e14110beda1f5da320f37793419301745c2d4e6654c70a`, 6.575 Bytes.

**Nächster Schritt:** alle PR-/Frontend-/Integrations-Gates auf dem neuen Head auswerten und Fehler sofort beheben. Erst bei vollständig grünem Stand `deploy/dev` auf den neuen geprüften Commit promoten; anschließend real über DRA auf HA DEV installieren und die neue Modul-Details-Ansicht prüfen.


## Schleife 022 – Modul-Details vollständig grün und nach deploy/dev promoviert

**Datum:** 2026-09-22  
**Status:** Implementierung abgeschlossen und DRA-DEV-Kandidat promoviert

Ergebnis der Prüfschleife:
- erster CI-Lauf deckte einen zu whitespace-sensitiven neuen Strukturtest auf; Test auf inhaltliche Marker reduziert,
- zweiter Lauf deckte ein unsortiertes Prüfsummen-Inventar auf; `SHA256SUMS_FRONTEND.txt` deterministisch neu sortiert,
- Browser-Regressionslauf deckte anschließend einen echten Erstöffnungsfehler auf: `_syncModuleView()` erzeugte den dynamischen Modulbereich nicht mehr selbst,
- Lazy-Erzeugung wiederhergestellt; beim ersten Öffnen wird **Module & Versionen** wieder zuverlässig angelegt,
- anschließend alle fünf PR-Gates auf Commit `ced692d9a81fc863c5406abee876b0d2ec5fc78d` vollständig grün,
- gemeinsames Frontend-Gate grün einschließlich Syntax, deterministischem Build, Locale-/Recorder-/Diagnosevertrag, Settings/Help-Profilen, Golden-Geometrie und beiden vollständigen Browser-Auslieferungssuiten,
- Integrations-Gate grün einschließlich HACS, hassfest, Home-Assistant-Runtime und DRA-Vertrag,
- Source-Archive-, Diagnose- und Hi-Res-Gates grün,
- `deploy/dev` wurde exakt auf den vollständig geprüften Commit `ced692d9a81fc863c5406abee876b0d2ec5fc78d` verschoben.

Aktueller Funktionsstand **Module & Versionen**:
- kompakter Hauptblock ohne eingebettete Modulliste/innere Scrollfläche,
- Gesamtstatus direkt im Hauptmenü sichtbar,
- Hauptmenü-Reihenfolge: **Kalibrierung & Diagnose** vor **Module & Versionen**,
- goldene Schaltfläche **Modul-Details**,
- responsives großes Pop-up mit Premium-Metallrahmen und Hi-Res-Schließen-Symbol,
- Diagnosegruppe zuerst, danach vollständige gruppierte Modulliste,
- Modulzeilen zeigen eigene Modulversion + Status; technische Angaben sind je Modul aufklappbar,
- **Diagnose kopieren** und **JSON herunterladen** im Detaildialog,
- `diagnostics.module-view` steht auf **1.1.0**.

**Nächster Schritt:** auf HA DEV in DRA den empfohlenen Stand `deploy/dev` neu übernehmen, Vorschau berechnen und installieren. Dabei ist der neue Kandidat exakt `ced692d9a81fc863c5406abee876b0d2ec5fc78d`. Nach Neustart die neue kompakte Hauptansicht und das **Modul-Details**-Pop-up real prüfen; anschließend M12 mit Delta-/Fehlerfällen und Rollback fortsetzen.


## Schleife 023 – Modul-Details real auf HA DEV bestätigt; Frontend-only-Neustarthinweis als DRA-Restpunkt erkannt

**Datum:** 2026-09-22  
**Status:** neue Modulansicht real erfolgreich; DRA-Lifecycle noch zu grob

Realer HA-DEV-Nachweis nach DRA-Aktualisierung auf `deploy/dev` / `ced692d9a81fc863c5406abee876b0d2ec5fc78d`:
- neue kompakte Hauptansicht **Module & Versionen** ist verfügbar,
- **Modul-Details**-Pop-up ist verfügbar,
- die reine Frontend-Aktualisierung wurde ohne Home-Assistant-Neustart wirksam,
- DRA meldet dennoch pauschal **Neustart erforderlich**, weil der aktuelle Gewitterradar-Lifecycle noch global `home_assistant_restart` vorgibt,
- damit ist funktional bestätigt, dass Frontend-only-Änderungen keinen HA-Neustart benötigen; offen bleibt die DRA-Unterscheidung **Frontend neu laden** vs. **Home Assistant neu starten**.

**Folgepunkt für M12/DRA:** Deployment-Art bzw. geänderte Dateiklasse auswerten. Bei ausschließlich Frontend-Dateien darf DRA künftig nur Frontend-/Browser-Neuladen verlangen; bei Python-/Integrationsänderungen bleibt der vollständige Home-Assistant-Neustart erforderlich. Dieser Punkt bleibt bis zur DRA-Anpassung ausdrücklich offen.

**Nächster Schritt:** M12 mit den verbleibenden realen Delta-/Fehlerfällen fortsetzen: Einzelmodul-Delta, Cache-/Mischstand, veraltetes Modul, fehlendes Modul und anschließend echter Rollback auf `deploy/v4.09`. Danach M13 Regression & Freigabe.


## Schleife 024 – Modul-Details Variante A umgesetzt und freigegeben

**Datum:** 2026-09-22  
**Status:** vollständig umgesetzt, geprüft und nach `deploy/dev` promoviert

Umgesetzt:
- Schaltfläche **Modul-Details** aus dem unteren Außenbereich in den inneren Statuskasten verschoben,
- Desktop-/Breitansicht: Schaltfläche rechts mittig neben Anwendungsversion, Modulanzahl und Gesamtstatus,
- schmale Ansichten bis 540 px: Schaltfläche springt unter den Statustext, bleibt aber innerhalb desselben Statuskastens,
- dynamisches Status-Rendering trennt Statusinhalt und Schaltfläche, damit Statusaktualisierungen die Schaltfläche nicht überschreiben,
- `diagnostics.module-view` wegen der eigenständigen UI-Änderung von **1.1.0 auf 1.1.1** angehoben,
- kanonisches Frontend, native Integration und Dashboard-Auslieferung bleiben bytegleich,
- V4.10.02-Modulvertrag und SHA256-Inventar aktualisiert,
- Frontend-Vertrag prüft jetzt zusätzlich die responsive Kompaktansicht und den 540-px-Umbruch.

Prüfschleife:
- erster CI-Anlauf fand ausschließlich einen Syntaxfehler im neu erweiterten Prüfskript (fehlendes Komma); Produktionscode war davon nicht betroffen,
- Prüfskript korrigiert,
- anschließend alle fünf Gates auf Commit `ea97a11e90db3e99e9e649d33435174aafb429c0` vollständig grün,
- gemeinsames Frontend-Gate grün inklusive deterministischem Build, Syntax, Locale-/Diagnosevertrag, Settings/Help, Golden-Geometrie und beiden vollständigen Browser-Auslieferungssuiten,
- Integrations-Gate grün inklusive HACS, hassfest, Home-Assistant-Runtime und DRA-Vertrag,
- Hi-Res-, Diagnose- und Source-Archive-Gates grün,
- `deploy/dev` zeigt exakt auf `ea97a11e90db3e99e9e649d33435174aafb429c0`.

**Nächster Schritt:** bei Bedarf über DRA auf HA DEV aktualisieren und die Position auf Desktop sowie schmaler Android-Ansicht real ansehen; anschließend M12 mit den verbleibenden Delta-/Fehlerfällen und Rollback fortsetzen.


## Schleife 025 – iPad Modul-Details isoliert und Breite reduziert

**Datum:** 2026-09-22  
**Status:** realer iPad-Fund behoben, automatisiert abgesichert und nach `deploy/dev` promoviert

Realer Befund auf iPad:
- bei geöffnetem **Modul-Details**-Dialog schien der darunterliegende Gewitterradar-Einstellungsdialog sichtbar durch,
- der Detaildialog wirkte auf der iPad-Breite zusätzlich zu großzügig.

Ursache und Korrektur:
- Modul-Overlay war als `position:fixed` innerhalb des Einstellungsdialogs/Backdrop-Baums verschachtelt; diese Kombination ist für WebKit/iPad mit `backdrop-filter` stacking-/compositing-anfällig,
- Overlay wird jetzt nach Erzeugung aus dem Einstellungsbereich herausgelöst und direkt an die Shadow-Root gehängt,
- Dialog- und Kopfbereich besitzen jetzt vollständig deckende Hintergründe,
- maximale Dialogbreite von **920 px auf 780 px** reduziert,
- auf schmalen Ansichten bleibt die mobile Breite dynamisch bei `100vw - 14px`,
- Status-/Listen-Synchronisierung greift nach dem Reparenting direkt über die Shadow-Root auf den Dialog zu,
- `diagnostics.module-view` von **1.1.1 auf 1.1.2** angehoben.

Regression:
- Settings/Help-Browsertest prüft jetzt zusätzlich, dass der Modul-Backdrop direkter Shadow-Root-Nachbar ist,
- maximale Breite <= 780 px,
- kein horizontaler Überlauf,
- deckender Dialog-/Header-Hintergrund,
- erster CI-Anlauf scheiterte ausschließlich an einem Syntaxfehler im neu ergänzten Prüfskript (fehlendes Komma); Produktionscode war nicht betroffen,
- Prüfskript korrigiert,
- anschließend alle fünf Gates auf `f33b9a9882774a38191c64edf842e1f2f9fec1e2` vollständig grün,
- insbesondere **Settings/Help profiles** inklusive iPad-Profil und beide vollständigen Browser-Auslieferungssuiten erfolgreich,
- `deploy/dev` zeigt exakt auf `f33b9a9882774a38191c64edf842e1f2f9fec1e2`.

**Nächster Schritt:** auf HA DEV über DRA auf den aktuellen `deploy/dev`-Stand aktualisieren und den iPad-Dialog real visuell gegenprüfen. Da ausschließlich Frontend-/Moduldateien geändert wurden, ist für diese Iteration technisch kein Home-Assistant-Neustart erforderlich; ein Frontend-/Browser-Neuladen genügt. Danach M12 mit Delta-/Fehlerfällen und Rollback fortsetzen.
