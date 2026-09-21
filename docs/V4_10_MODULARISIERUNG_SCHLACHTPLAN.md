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

**M03 – Stabilen Loader und modulare Build-Auslieferung herstellen.**

Dabei:
- aktuelle Einstiegspunkte und Registrierungslogik erfassen,
- große Funktionsblöcke der bestehenden JS-Datei inventarisieren,
- Abhängigkeiten zwischen Karte, Vollbild, Instrumenten, Einstellungen, Providern und Diagnose dokumentieren,
- endgültigen Zielbaum der Module festlegen.

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

- [ ] eindeutige Modul-ID
- [ ] Modulversion
- [ ] Funktionsgruppe
- [ ] Hauptfunktion
- [ ] Unterfunktionen
- [ ] Dateipfad
- [ ] optional Build-/Commit-Kennung
- [ ] Ladezeitpunkt
- [ ] Doppeltregistrierung erkennen
- [ ] fehlende erwartete Module erkennen
- [ ] Versionsabweichungen erkennen
- [ ] Registry darf den Start von Gewitterradar bei rein diagnostischen Fehlern nicht unnötig blockieren

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

- [ ] Name / ID
- [ ] geladene Modulversion
- [ ] Funktion
- [ ] Unterfunktionen
- [ ] Dateipfad
- [ ] Ladezeitpunkt
- [ ] erwartete Version
- [ ] Status Soll/Ist
- [ ] optional Git-/Build-Kennung

Gesamtzustände:

- [ ] **grün:** geladen und erwartete Version
- [ ] **gold:** geladen, aber andere Version
- [ ] **rot:** Modul fehlt / Ladefehler

Diagnoseausgabe:

- [ ] Diagnose kopieren
- [ ] JSON herunterladen
- [ ] vollständige Soll-/Ist-Liste ausgeben

---

# 5. Stabiler Einstiegspunkt

`gewitterradar.js` bleibt der dauerhaft registrierte Einstiegspunkt.

Ziele:

- [ ] Home Assistant muss weiterhin nur **eine** Gewitterradar-Ressource kennen.
- [ ] Keine manuelle Registrierung einzelner Module.
- [ ] Module werden über ES-Module geladen.
- [ ] HACS/Integration installiert weiterhin das Gesamtpaket.
- [ ] Der Ressourcenpfad bleibt stabil.
- [ ] Cache-Strategie verhindert Mischstände verschiedener Builds.

Zu prüfen:

- [ ] statischer Loader vs. versionsbewusster Loader
- [ ] Cache-Busting für abhängige Module
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

- [ ] `gewitterradar.js` als stabilen Einstiegspunkt vorbereiten
- [ ] erste Imports auslagern
- [ ] Ladefehlerbehandlung
- [ ] Cache-Konzept implementieren
- [ ] App-/Desktop-Test

**Abschlusskriterium:** Gewitterradar startet über den neuen Loader ohne Funktionsverlust.

## M04 – Core auslagern

- [ ] Konstanten
- [ ] Zustandsverwaltung
- [ ] allgemeine Helfer
- [ ] Speicher-/Persistenzhelfer
- [ ] Geometriehelfer

**Abschlusskriterium:** Core-Bausteine sind getrennt, bestehendes Verhalten unverändert.

## M05 – UI auslagern

- [ ] Dialoge
- [ ] Bedienelemente
- [ ] Einstellungen
- [ ] Styles soweit sinnvoll modularisieren
- [ ] Hauptmenü-Anbindung

**Abschlusskriterium:** UI läuft vollständig aus Modulen.

## M06 – Instrumente auslagern

- [ ] Kompass
- [ ] Kompassauswahl / Popup
- [ ] Medaillon
- [ ] Verschieben / Touch
- [ ] Sichtbarkeit
- [ ] Instrument-Metadaten

**Abschlusskriterium:** Desktop und Android funktionieren unverändert.

## M07 – Vollbild auslagern

- [ ] Vollbildsteuerung
- [ ] Standort-Pille
- [ ] Instrumentintegration
- [ ] Layer-Prioritäten
- [ ] Drag-/Touch-Logik
- [ ] responsive Mehrspaltigkeit

**Abschlusskriterium:** Vollbildregressionen ausgeschlossen.

## M08 – Karte auslagern

- [ ] Kartenkern
- [ ] Layer
- [ ] Cluster-Auflösung
- [ ] Cluster-Navigation
- [ ] Blitzdarstellung
- [ ] Radien
- [ ] Aura

**Abschlusskriterium:** Kartenverhalten entspricht dem Ausgangsstand.

## M09 – Provider auslagern

- [ ] Provider-Basis
- [ ] NASA
- [ ] EUMETView
- [ ] Playback
- [ ] Pufferung / Wiederaufnahme
- [ ] Provider-Informationen

**Abschlusskriterium:** alle Provider-Testfälle bestanden.

## M10 – Diagnose & Logging auslagern

- [ ] Ereignisprotokoll
- [ ] Diagnosefunktionen
- [ ] Export
- [ ] Moduldiagnose integrieren

**Abschlusskriterium:** Diagnose ist vollständig modular.

## M11 – Menü „Module & Versionen“

- [ ] Menüeintrag
- [ ] Gruppenansicht
- [ ] Unterfunktionen
- [ ] Modulversionen
- [ ] Soll-/Ist-Prüfung
- [ ] Statusfarben
- [ ] Detailansicht
- [ ] Diagnose kopieren
- [ ] JSON herunterladen

**Abschlusskriterium:** Der Nutzer kann nach einem Update eindeutig sehen, welche Modulversion tatsächlich geladen wurde.

## M12 – DRA-Ende-zu-Ende-Test – RELEASE-GATE

- [ ] Deployment des kompletten Modulbaums
- [ ] Deployment nur eines geänderten Moduls
- [ ] Soll-/Ist-Metadaten prüfen
- [ ] Browsercache-Fall simulieren
- [ ] veraltetes Modul erkennen
- [ ] fehlendes Modul erkennen
- [ ] Rollback testen
- [ ] Neustart-/Frontend-Reload-Hinweis prüfen

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
