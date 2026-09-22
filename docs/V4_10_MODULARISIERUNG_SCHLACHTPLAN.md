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
- aktueller vollständig geprüfter Feature-Head: `6223081c127baad5dae084aec2bb0a6061865416`,
- alle 5 PR-Workflows sind auf diesem Head grün: Source archive, Diagnostic contract, Hi-Res asset retention, Integration und gemeinsames Frontend,
- `deploy/dev` ist exakt auf diesen vollständig grünen Commit promoviert,
- der automatisierte DRA-Vertragsnachweis einschließlich V4.09-Rückfallquelle ist grün,
- reale M12-Abnahme auf Home Assistant DEV gestartet: DRA V0.15.5 nutzt ein reines Lesetoken, erkennt Gewitterradar als `ready`, übernimmt den empfohlenen Kanal `deploy/dev` und friert ihn auf `6223081c127baad5dae084aec2bb0a6061865416` ein,
- erste reale Vorschau auf HA DEV erfolgreich: **24 neu / 3 geändert / 0 entfernt / 30 unverändert**,
- der Versionswächter fällt beim ersten Übergang erwartungsgemäß auf den stärksten lokal gemeinsam vorhandenen Marker `CONF_LEGACY_IMPORT_VERSION` zurück; der neue Quellmarker `BUILD_VERSION = "4.10.02"` besitzt im bisherigen lokalen Stand noch kein Gegenstück,
- reale DRA-Installation des vollständigen verwalteten Baums ist erfolgreich abgeschlossen; Staging, Sicherung, Installation und `verify_install` liefen ohne Fehler,
- DRA meldet ausdrücklich **NEUSTART ERFORDERLICH** und führt keinen stillen Neustart aus,
- offen bleiben jetzt der manuelle Home-Assistant-Neustart, post-install Soll/Ist-/Versionsprüfung, Cache-/Mischstandprüfung, Einzelmodul-Delta sowie der reale DRA-Rückfall auf `deploy/v4.09`.

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
- [ ] Soll-/Ist-Metadaten prüfen
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
