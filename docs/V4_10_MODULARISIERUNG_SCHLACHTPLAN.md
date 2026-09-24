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

**M12 – Cache-/Mischstand und veraltetes Modul vollständig real abschließen.**

Aktueller Testzweig:
- `test/dra-v4.10.02-cache-mixed-state`
- Commit `274d9304823be7a1ec8620ec6f157493813d0e47`
- Basis: `deploy/dev` `08eec9c3f19c2680ede86336931be8f8e0029424`
- gegenüber `deploy/dev` exakt **eine geänderte Datei**:
  `custom_components/gewitterradar/frontend/modules/fullscreen/map-display.js`
- geladene Modulversion dort absichtlich **1.0.1**; Manifest/Sollstand bleibt **1.0.2**.

Bereits real sichtbar:
- **22 / 22 Module geladen**,
- **1 Abweichung erkannt**.

Für das formale Setzen der beiden M12-Haken fehlen noch die ausdrücklich dokumentierten Einzelbelege:
1. **Browsercache-/Mischstand:** nach DRA-Installation im bereits geöffneten Browser vor einem harten Neuladen muss der zuvor geladene Stand weiter sichtbar sein; erst nach `Strg+Shift+R` darf der neue Dateistand aktiv werden.
2. **Veraltetes Modul:** Detailzeile von `fullscreen.map-display` bestätigen:
   - geladen **1.0.1**,
   - erwartet **1.0.2**,
   - Status Versionsabweichung.
3. Danach in DRA wieder `deploy/dev` installieren und nach Frontend-Neuladen **1.0.2 / korrekt** bestätigen.
4. Anschließend M12 mit **fehlendem Modul** und danach **Rollback auf `deploy/v4.09` + Rückkehr auf `deploy/dev`** fortsetzen.

Nach M12 folgt ausschließlich die kompakte M13-Endabnahme. Die eigentliche Medaillon-Auswahl/-Bearbeitung und eine mögliche Auslagerung nach `instruments.medallion` bleiben bewusst ein Thema **nach M12**.

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
- [x] Deployment nur eines geänderten Moduls
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

Realer M12-Stand:
- kompletter Modulbaum über DRA installiert,
- genau **ein geändertes Modul** real mit **0 neu / 1 geändert / 0 entfernt / 56 unverändert** installiert und funktional nachgewiesen,
- Soll-/Ist-Metadaten real geprüft,
- Frontend-/Companion-Neuladehinweis für reine Frontend-Änderung real bestätigt,
- Cache-/Mischstand und veraltetes Modul sind teilweise nachgewiesen: die Laufzeit meldet bereits **22 / 22 Module** und **1 Abweichung**; die Detailzeile sowie der ausdrücklich dokumentierte Vorher/Nachher-Cachezustand fehlen noch,
- fehlendes Modul und realer Rollback auf `deploy/v4.09` bleiben offen.

Temporäre M12-Testfunktionen sind **keine Produktfreigabe**: Das Medaillon-Popup des Einzelmodul-Tests bleibt auf dem Testzweig, einschließlich des bekannten unerwünschten Rahmens/Fokusrahmens am Schließen-Symbol. Die eigentliche Medaillon-Funktion wird erst nach M12 weiterentwickelt.

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


## Schleife 026 – DRA-Export nach Frontend-only-Update ausgewertet

**Datum:** 2026-09-22  
**Status:** fehlender HA-Neustart blockiert Folgeupdate nicht

Ausgewerteter Git-Export:
- `.deploy-relay/diagnostics/gewitterradar/2026-09-22/20260922T113501Z-deploy-dev-f33b9a988277-4ffa9839.json`,
- DRA V0.15.5, Home Assistant 2026.9.2,
- ausgewählte Quelle: `deploy/dev` / `f33b9a9882774a38191c64edf842e1f2f9fec1e2`,
- empfohlener Kanal wird korrekt als `recommended_current` erkannt,
- Projektstatus `ready`,
- `restart_pending: false` – kein offener Neustartzustand blockiert das nächste Deployment,
- `deployment_writes_enabled: false` – Schreibzugriffe sind aktuell separat gesperrt; für eine Installation muss der Entwicklungsmodus/Schreibzugriff erneut explizit aktiviert werden,
- der Export wurde während einer laufenden Vorschau erzeugt: `preview/start` und validiertes Manifest sind enthalten, der Preview-Abschluss lag zum Exportzeitpunkt noch nicht im Bundle,
- Manifest-Lifecycle steht weiterhin pauschal auf `home_assistant_restart`, weshalb DRA auch bei reinen Frontend-Änderungen weiterhin unnötig einen Neustart fordert.

**Nächster Schritt:** Vorschau gegen den aktuellen `deploy/dev`-Stand vollständig berechnen lassen, Entwicklungsmodus explizit aktivieren und Frontend-only-Delta installieren. Kein HA-Neustart ist als Voraussetzung für dieses Folgeupdate erforderlich.


## Schleife 027 – Einzelnes Modul-Neuladen bewusst verworfen

**Datum:** 2026-09-22  
**Status:** Architekturentscheidung getroffen

Entscheidung:
- keine generische Schaltfläche **Neu laden** pro Modul,
- Grund: einzelne Module installieren Methoden auf bestehende Karteninstanzen; bereits erzeugte UI-Zustände, Event-Listener, Timer oder Kartenobjekte würden dadurch nicht automatisch sauber entfernt,
- ein Hot-Reload einzelner Module würde damit zusätzliche Lifecycle-/Dispose-Verträge pro Modul erfordern und die Architektur unnötig verkomplizieren,
- Risiko von Mischständen, doppelten Listenern und schwer reproduzierbaren Laufzeitfehlern ist größer als der praktische Nutzen,
- **Module & Versionen** bleibt Diagnose- und Transparenzoberfläche,
- Aktualisierung erfolgt weiterhin kontrolliert über DRA; bei reinen Frontend-Änderungen genügt Frontend-/Browser-Neuladen, bei Integrations-/Python-Änderungen vollständiger Home-Assistant-Neustart.

**Nächster Schritt:** M12 ohne Hot-Reload-Sonderpfad fortsetzen: Delta-/Fehlerfälle und Rollback sauber über DRA prüfen.


## Schleife 028 – Settings-Scrollregression iPad/Android behoben und abgesichert

**Datum:** 2026-09-23  
**Status:** vollständig umgesetzt, automatisiert geprüft und nach `deploy/dev` promoviert

Reale Regression:
- iPad: im Bereich **Radien** war der Gefahrenradius nicht vollständig sichtbar und der Inhalt ließ sich an dieser Stelle nicht zuverlässig weiter nach unten scrollen,
- Android Hochformat: Gefahrenradius war teilweise gar nicht erreichbar; Scrollen innerhalb des geöffneten Bereichs schlug ebenfalls fehl,
- **Kalibrierung & Diagnose** zeigte dasselbe Grundproblem bei nicht vollständig in den Viewport passendem Inhalt,
- **Kartendarstellung** hatte zu wenig Innenabstand zwischen Cluster-Navigation und äußerem Bereichsrahmen.

Technische Ursache:
- historisch existierten mehrere vertikale Scroll-Eigentümer gleichzeitig: äußerer `.settings-body`, allgemeine geöffnete Accordion-Inhalte und zusätzlich ein eigener Radien-Scroller,
- verschachtelte Touch-Scroller führten auf iPad/WebKit und Android-WebView zu abgeschnittenen bzw. nicht mehr erreichbaren unteren Bedienelementen.

Korrektur:
- Einstellungsdialog besitzt jetzt genau **einen vertikalen Scroll-Eigentümer**: `.settings-body`,
- geöffnete `.settings-section-content`-Bereiche wachsen vollständig in diesen Scroller hinein,
- historischer Radien-Innenscroller wird im finalen Vertrag neutralisiert,
- `.settings-body` nutzt `grid-auto-rows:max-content`, `align-content:start`, `overflow-y:auto!important`, `touch-action:pan-y` und WebKit Momentum-Scrolling,
- großzügiges unteres Scroll-Padding stellt sicher, dass letzte Bedienelemente vollständig über die Dialogkante gezogen werden können,
- **Kartendarstellung** erhält 6 px oberen und 8 px unteren Innenraum; Cluster-Navigation erhält zusätzlichen rechten Abstand (10 px, schmal 8 px),
- `ui.skeleton` wurde wegen der eigenständigen UI-/Layoutänderung auf **1.0.3** angehoben.

Regressionstest:
- Settings/Help-Profiltest erzwingt für iPad, iPad Pro und Android Hochformat einen künstlich nur 320 px hohen Einstellungsdialog,
- **Radien** muss den Gefahrenradius über den äußeren Settings-Scroller vollständig erreichbar machen,
- **Kalibrierung & Diagnose** muss das letzte Test-/Diagnoseelement vollständig erreichbar machen,
- innere Accordion-Inhalte dürfen keinen eigenen vertikalen Scrollcontainer mehr bilden,
- Test bestätigt tatsächliche Scrollbewegung des äußeren Settings-Scrollers,
- Kartendarstellung wird zusätzlich auf Mindestabstand der Cluster-Navigation sowie oberen/unteren Innenraum geprüft,
- erster CI-Lauf fand ausschließlich einen veralteten `ui.skeleton 1.0.2`-Marker im neuen Frontend-Prüfvertrag; Produktionscode war nicht betroffen,
- Marker auf **1.0.3** korrigiert,
- anschließend alle fünf Gates auf Commit `eb9d7fe042079b120292cabab88bca8acf38c335` vollständig grün,
- insbesondere Settings/Help-Profile, Golden-Geometrie, beide vollständigen Browser-Auslieferungssuiten sowie HACS, hassfest, HA-Runtime und DRA-Paketvertrag erfolgreich,
- `deploy/dev` zeigt exakt auf `eb9d7fe042079b120292cabab88bca8acf38c335`.

**Nächster Schritt:** diesen Stand auf HA DEV über DRA installieren und die drei realen Fälle gegenprüfen: iPad Radien, Android Hochformat Radien sowie Kalibrierung & Diagnose. Danach M12 mit Einzelmodul-Delta, Cache-/Mischstand, veraltet/fehlend und Rollback fortsetzen.


## Schleife 029 – Cluster-/Einstellungsübersetzungen vollständig auf 19 Sprachen erweitert

**Datum:** 2026-09-23  
**Status:** abgeschlossen und automatisiert geprüft

Umgesetzt:
- **Cluster-Auflösung**, Beschreibung, **Cluster-Navigation · Sitzungszeit**, Zeitbereich und **unendlich** vollständig in die bestehende App-Lokalisierung aufgenommen,
- Cluster-Profile **Früh / Ausgewogen / Spät / Klassisch** für alle 19 registrierten Sprachen hinterlegt,
- aktuell ausgewähltes Cluster-Profil synchronisiert sich beim Sprachwechsel ebenfalls sofort,
- **Module & Versionen** einschließlich Titel, Untertitel, Modul-Details, Statusmeldungen, Gruppenbezeichnungen, Detailfelder, Schließen, Diagnose kopieren und JSON-Download vollständig lokalisiert,
- technische Modul-IDs und technische Manifest-Metadaten bleiben bewusst unverändert,
- `core.base-context` → **1.0.1**,
- `ui.i18n-settings` → **1.1.1**,
- `diagnostics.module-view` enthält den lokalisierten UI-Vertrag.

Regression:
- Frontend-Vertrag prüft alle 19 Sprachbündel und alle neuen Pflichtschlüssel auf Vorhandensein und nichtleere Werte,
- Cluster-Profilregister wird für alle 19 Sprachen auf `early/balanced/late/classic` geprüft,
- Browserprofiltest durchläuft alle 19 Sprachen und vergleicht sichtbare Cluster-/Modulüberschriften mit dem aktiven Übersetzungswert.

## Schleife 030 – Module & Versionen vollständig ins Einstellungs-Akkordeon integriert

**Datum:** 2026-09-23  
**Status:** abgeschlossen und automatisiert geprüft

Ursache:
- das Einstellungs-Akkordeon hatte beim Start nur einen statischen Snapshot der vorhandenen `details.settings-collapsible`-Elemente,
- **Module & Versionen** wird modular erst später dynamisch erzeugt und war deshalb nicht Teil des Ein-Abschnitt-offen-Vertrags.

Korrektur:
- Akkordeonverwaltung nutzt jetzt ein dynamisches `Set`,
- neue Methode `_registerSettingsAccordionSection` registriert später erzeugte Einstellungsbereiche,
- `diagnostics.module-view` meldet seinen Bereich nach dem Einfügen dort an,
- Öffnen von **Module & Versionen** schließt andere Bereiche; Öffnen eines anderen Bereichs schließt **Module & Versionen**,
- `ui.controls` → **1.1.1**,
- `diagnostics.module-view` → **1.2.1**.

Regression:
- Browserprofiltest öffnet zuerst Diagnose, danach Module und danach Kartendarstellung,
- beide Richtungen des gegenseitigen Schließens werden explizit geprüft.

## Schleife 031 – Medaillon-Diagnose auf iPad verbreitert und Kopfaktionen abgesichert

**Datum:** 2026-09-23  
**Status:** abgeschlossen und automatisiert geprüft

Ursache:
- Medaillon-Diagnose war auf 430 px begrenzt,
- zusätzlich erbte die Kopfzeile von `.compass-calibration-close` eine generische Mindestbreite von 150 px je Schaltfläche,
- dadurch konnten die rechten Kopfaktionen auf dem iPad außerhalb des sichtbaren Dialogbereichs liegen.

Korrektur:
- normale Medaillon-Diagnose auf maximal **560 px** verbreitert,
- kompakte Ansicht auf maximal **520 px**,
- Kopfzeilen-Schaltflächen erhalten medaillonspezifisch kompakte Mindestbreiten und Innenabstände,
- Titel kann flexibel Platz abgeben; auf schmalen Ansichten darf die Kopfzeile umbrechen,
- `ui.skeleton` ist Bestandteil des finalen **1.1.0**-Stands.

Regression:
- iPad und iPad Pro öffnen den Medaillon-Diagnosedialog im Browserprofiltest,
- alle Kopf-Schaltflächen müssen vollständig innerhalb des Dialograhmens liegen,
- kein horizontaler Überlauf des Dialogs oder der Kopfzeile erlaubt.

## Schleife 032 – Chevron-Animation des Versionsverlaufs auf Einstellungen übernommen

**Datum:** 2026-09-23  
**Status:** abgeschlossen und automatisiert geprüft

Umgesetzt:
- Einstellungs-Akkordeon verwendet jetzt dieselbe weiche Chevron-Bewegung wie der Versionsverlauf,
- Übergang: **0,42 s** mit `cubic-bezier(.22,1,.36,1)`,
- Gold-/Leuchteffekt beim Öffnen/Schließen an den Versionsverlauf angeglichen,
- vorhandene Position und 45°/225°-Geometrie bleiben unverändert,
- `ui.skeleton` final → **1.1.0**.

Regression:
- Browserprofiltest prüft Dauer und Beschleunigungskurve des Pseudo-Element-Chevrons.

## Schleife 033 – Gesamtprüfung grün und DRA-DEV-Stand promoviert

**Datum:** 2026-09-23  
**Status:** vollständig grün und für HA DEV über DRA bereit

Final geprüfter Code-Stand:
- Commit `9605a11aa2c2fc98a00f1e79d1d28e42fbfe4507`,
- `deploy/dev` zeigt exakt auf diesen Commit,
- aktualisierte Modulversionen:
  - `core.base-context 1.0.1`,
  - `ui.skeleton 1.1.0`,
  - `ui.controls 1.1.1`,
  - `ui.i18n-settings 1.1.1`,
  - `diagnostics.module-view 1.2.1`,
- deterministischer V4.10.02-Frontendvertrag und `SHA256SUMS_FRONTEND.txt` aktualisiert.

Alle fünf Gates erfolgreich:
- Validate shared Gewitterradar frontend,
- Diagnostic contract,
- Hi-Res asset retention,
- Source archive contract,
- Validate Gewitterradar integration.

Insbesondere erfolgreich:
- vollständige 19-Sprachen-Verträge,
- Settings/Help-Profile,
- dynamisches Modul-Akkordeon,
- Medaillon-iPad-Geometrie,
- Chevron-Animation,
- Golden-Geometrie,
- beide vollständigen Browser-Auslieferungssuiten,
- HACS, hassfest, Home-Assistant-Runtime und DRA-Paketvertrag.

**Nächster Schritt:** auf HA DEV mit DRA den empfohlenen Stand `deploy/dev` / `9605a11aa2c2fc98a00f1e79d1d28e42fbfe4507` installieren und die vier realen UI-Punkte kurz gegenprüfen. Danach M12 mit Einzelmodul-Delta, Cache-/Mischstand, veraltet/fehlend und Rollback fortsetzen.


## Schleife 034 – DRA-Einzelmodul-Testkandidat auf aktuellem DEV-Stand vorbereitet

**Datum:** 2026-09-23  
**Status:** Kandidat vorbereitet; reale DRA-Abnahme auf HA DEV steht aus

Ausgang:
- produktiver Entwicklungs-/Promotionsstand bleibt unverändert auf `deploy/dev` / `9605a11aa2c2fc98a00f1e79d1d28e42fbfe4507`,
- der vorhandene Testzweig `test/dra-v4.10.02-single-module` war noch auf einem alten M12-Zwischenstand und 133 Commits hinter `deploy/dev`.

Vorbereitung:
- Testzweig kontrolliert auf den aktuellen `deploy/dev`-Head zurückgesetzt,
- anschließend exakt eine verwaltete DRA-Datei geändert:
  `custom_components/gewitterradar/frontend/modules/core/source-status.js`,
- Änderung besteht nur aus einem Kommentar-Sentinel; kein Modulcode, keine Modulversion und kein Manifestverhalten wurden verändert,
- Testcommit: `be28062d60a531cbeef6f03d6fa92fa838c305bd`.

Verifikation:
- Vergleich `deploy/dev...test/dra-v4.10.02-single-module`: **ahead 1 / behind 0**,
- GitHub-Vergleich weist exakt **eine** geänderte Datei mit **+1 / -0** aus,
- damit ist der Zweig ein sauberer realer Kandidat für den M12-Punkt **Deployment nur eines geänderten Moduls**.

**Nächster Schritt:** zunächst den aktuellen `deploy/dev`-Stand `9605a11…` real auf HA DEV prüfen. Danach den Testzweig über DRA auswählen, Vorschau **1 geändert / 0 neu / 0 entfernt** bestätigen, installieren und anschließend wieder auf `deploy/dev` zurückkonvergieren.


## Schleife 035 – Moduldetails, Diagnose-Leerraum und Kartendarstellungs-Sprachen korrigiert

**Datum:** 2026-09-23  
**Status:** Code vollständig grün; Dokumentation abgeschlossen, DRA-Promotion folgt nach finalem Dokumentations-Gate

Reale Befunde:
- **Kalibrierung & Diagnose** zeigte am unteren Ende unnötig viel Leerraum,
- das **Modul-Details**-Fenster war auf Tablet/iPad zu breit und zu hoch,
- innere Modulzeilen öffneten kurz und schlossen unmittelbar wieder; anschließend war die Bedienung nicht zuverlässig wiederholbar,
- **Kartendarstellung** mischte in Portugiesisch und Griechisch übersetzte Clustertexte mit englischen UI-Texten wie *Map display*, *Default view*, *Last used* und *Separate map window*,
- Prüfung des Sprachregisters zeigte denselben fehlenden Map-Settings-Satz grundsätzlich in 17 nichtdeutschen/nichtenglischen Varianten.

Korrektur:
- Modul-Dialog Desktop/Tablet von 780 px auf **660 px** maximale Breite und von 860 px auf **760 px** maximale Höhe reduziert; mobiles Viewport-Verhalten bleibt erhalten,
- Parent-Toggle von **Module & Versionen** reagiert nur noch auf den eigenen Toggle-Event,
- innere Modul-Toggles werden nicht mehr in die äußere Akkordeonlogik weitergereicht,
- geöffnete Modul-IDs werden bei einer Diagnosesynchronisierung erhalten,
- Diagnose-Unterraum von 72 px auf **22 px** reduziert,
- neun Kartendarstellungs-Schlüssel in alle **19** Settings-Sprachbündel aufgenommen,
- Sprachwechsel ruft zusätzlich die Kartenanzeige-Synchronisierung auf,
- Portugiesisch **Tarde → Tardia**,
- neue Tests erzwingen für alle nichtenglischen Varianten, dass die Map-Settings nicht unbemerkt auf Englisch zurückfallen,
- Browserprofiltest prüft Modulzeilen jetzt ausdrücklich mit **öffnen → schließen → erneut öffnen**,
- Android behält bewusst die viewportfüllendere mobile Dialoghöhe; der Test unterscheidet deshalb Desktop/Tablet und Mobile.

Modulversionen:
- `core.base-context 1.0.2`,
- `ui.skeleton 1.1.1`,
- `ui.i18n-settings 1.2.0`,
- `diagnostics.module-view 1.2.2`.

Prüfschleife:
- erster Locale-Lauf deckte einen veralteten Alt-Test auf, der für die neuen Settings-Schlüssel weiterhin englischen Rückfall erwartete; Test auf den modularen Übersetzungsvertrag umgestellt,
- erster Browserprofil-Lauf deckte ausschließlich eine zu strenge neue 760-px-Höhenbedingung auf Android auf; die produktive mobile CSS-Regel war korrekt und nutzt bewusst den verfügbaren Viewport,
- Höhenvertrag gerätespezifisch korrigiert,
- anschließend auf Code-/Test-Head `7dfa477c2a7fbd5789189a32a47cb0db82328a34` alle fünf Gates vollständig grün:
  - Validate shared Gewitterradar frontend,
  - Validate Gewitterradar integration,
  - Diagnostic contract,
  - Hi-Res asset retention,
  - Source archive contract,
- insbesondere Settings/Help-Profile, Golden-Geometrie, beide vollständigen Browser-Auslieferungssuiten, HACS, hassfest und Home-Assistant-Runtime erfolgreich.

**Nächster Schritt:** finalen dokumentierten Branch-Head nach grünem Dokumentations-Gate auf `deploy/dev` promoten und die oben genannten fünf realen UI-/Sprachpunkte auf HA DEV über DRA abnehmen.


## Schleife 036 – Tooltip-Audit und Modulzeilen gegen Hintergrund-Neuaufbau stabilisiert

**Datum:** 2026-09-23  
**Status:** Code/Test vollständig grün; finale Dokumentationsprüfung und DRA-Promotion folgen

Reale Befunde:
- im griechischen Kartenbereich war der sichtbare Profilwert korrekt übersetzt, der Mouse-over-Text enthielt aber weiterhin den deutschen Präfix **„Cluster-Auflösung“**,
- weitere dynamische `title`-/`aria-label`-Pfade verwendeten teils fest codierte deutsche oder englische Ausgangstexte,
- die Modulzeilen ließen sich nach Schleife 035 grundsätzlich wieder öffnen und schließen, reagierten aber bei einzelnen Klicks noch unzuverlässig,
- Ursache der Modulunzuverlässigkeit bestätigt: `_applyStaticTranslations()` kann bei geöffnetem Modulbereich `_syncModuleView()` ausführen; die bisherige Methode ersetzte dabei die komplette Modulliste auch dann, wenn sich überhaupt keine Diagnosedaten geändert hatten. Ein Klick konnte dadurch zeitlich mit einem DOM-Neuaufbau kollidieren.

Korrektur Modulansicht:
- `diagnostics.module-view` → **1.2.3**,
- neue `_moduleListSignature(result)` aus aktiver Sprache, Modulstatus, Soll-/Ist-Versionen, Ladezeitpunkt, Gruppe, Funktion, Datei und Unterfunktionen,
- die Liste wird nur noch bei einer tatsächlich geänderten Signatur oder explizitem `forceList` neu erzeugt,
- gewöhnliche Render-/Übersetzungssynchronisierungen aktualisieren Zusammenfassung und Texte, lassen die vorhandenen Modul-`<details>`-Knoten jedoch bestehen,
- damit kann ein Benutzer-Klick nicht mehr von einem unmittelbar folgenden Hintergrund-Neuaufbau überschrieben werden.

Korrektur Mouse-over / dynamische Attribute:
- `ui.i18n-settings` → **1.2.1**,
- `ui.render` → **1.0.1**,
- `fullscreen.map-display` → **1.0.1**,
- `map.clusters-recent` → **1.0.1**,
- zwölf zusätzliche Pflichtschlüssel in allen **19 Sprachvarianten** für:
  - Versionsverlauf,
  - Cluster-Auflösung-Auswahl,
  - Cluster-Navigations-Sitzungszeit / Sekunden / unbegrenzt,
  - Umschaltung Sitzungszeit ↔ unbegrenzt,
  - Standardansicht-Auswahl,
  - Medaillon verschieben,
  - Kompassauswahl / Kompass wechseln,
- zusätzlich bestehende Übersetzungsschlüssel für Gerätekompass, Kartenansicht, separates Kartenfenster und weitere dynamische Mouse-over-Texte an den tatsächlichen Renderpfad gebunden,
- die konkret gemeldete griechische Kombination wird jetzt aus **übersetztem Präfix + übersetztem Profilwert** zusammengesetzt.

Regression:
- Quellvertrag verlangt alle neuen Tooltip-Schlüssel für alle 19 Varianten,
- Quellvertrag verbietet die bekannten fest codierten deutschen Runtime-Tooltips,
- Browserprofiltest kontrolliert die tatsächlich im DOM gesetzten `title`-/`aria-label`-Werte je Sprache,
- nichtenglische Sprachen dürfen auch bei diesen dynamischen Attributen nicht auf Englisch zurückfallen,
- Modul-Stresstest führt nach dem ersten Öffnen/Schließen zusätzlich **10 Klickzyklen** aus und ruft zwischen jedem Klick sowohl `_syncModuleView()` als auch `_applyStaticTranslations()` auf,
- dabei muss derselbe Modul-DOM-Knoten erhalten bleiben und der Offen-/Geschlossen-Zustand bei jedem einzelnen Klick korrekt wechseln.

Geprüfter Code-/Test-Head:
- `60846e16bcec19ba2b9cfa9f516777bb69635c41`.

Alle fünf Gates grün:
- Validate shared Gewitterradar frontend,
- Validate Gewitterradar integration,
- Diagnostic contract,
- Hi-Res asset retention,
- Source archive contract.

Insbesondere erfolgreich:
- Settings/Help-Profile einschließlich Tooltip-/Sprachmatrix,
- Golden-Geometrie,
- beide vollständigen Browser-Auslieferungssuiten,
- HACS, hassfest und Home-Assistant-Runtime,
- deterministische Dashboard-/Integrations-Ausleitung.

**Nächster Schritt:** Dokumentation committen, denselben vollständigen Gate-Satz auf dem Dokumentations-Head abwarten und erst danach exakt diesen Head auf `deploy/dev` promoten.


## Schleife 037 – komplette Modulmetadaten in 19 Sprachvarianten lokalisiert

**Datum:** 2026-09-23  
**Status:** Code/Test vollständig grün; Dokumentations-Head wird abschließend gegatet und danach auf `deploy/dev` promotet

Realer Befund aus der griechischen Modulansicht:
- Gruppen- und Detailfeldbezeichnungen waren bereits griechisch,
- die eigentlichen Modulnamen kamen weiterhin direkt aus den deutschen `MODULE_META`-/Manifestdaten,
- die Funktionslisten wurden ebenfalls unverändert deutsch gerendert,
- dadurch waren **sämtliche Module** sprachlich gemischt, nicht nur `diagnostics.cockpit` oder `diagnostics.module-view`,
- zusätzlich klebten im Dialogkopf Produktversion, Ladezahl und Konsistenztext optisch aneinander, weil die Dialog-Zusammenfassung nach dem Reparenting nicht mehr alle auf den Einstellungsabschnitt beschränkten Layoutregeln erbte.

Korrektur:
- `diagnostics.module-view` → **1.3.0**,
- vollständiges lokales Modulmetadaten-Sprachregister für exakt **22 Modul-IDs × 19 Sprachvarianten**,
- pro Modul werden Anzeigename und komplette Funktionsliste lokalisiert,
- interne IDs wie `diagnostics.module-view`, `instruments.compass` sowie Dateipfade bleiben als technische Diagnoseinformationen unverändert,
- Sortierung der Modulzeilen verwendet nun den lokalisierten Anzeigenamen,
- Sprachwechsel bleibt Teil der bestehenden Listensignatur und erzeugt deshalb genau dann einen neuen sprachgerechten Listensatz, wenn die aktive Sprache wirklich wechselt,
- Statuszusammenfassung des Dialogs besitzt eigene, nicht vom Einstellungsabschnitt abhängige Layoutregeln und explizite `·`-Trenner zwischen Version, Ladezahl und Status.

Regression:
- Quellvertrag parst das Modulmetadaten-Sprachregister direkt,
- exakt 22 IDs und exakt 19 Sprachvarianten sind Pflicht,
- jede Sprache muss für jede ID sowohl Anzeigename als auch Funktionsbeschreibung liefern,
- für Griechisch muss jeder einzelne Modulname und jede Funktionsliste tatsächlich griechische Zeichen enthalten,
- Browserprofiltest rendert die Modulansicht nacheinander in allen 19 Varianten und fordert **22 eindeutige, vollständig gefüllte Modulzeilen**,
- für Griechisch werden bekannte deutsche Resttexte wie `Diagnose & Kalibrierung`, `Module & Versionen`, `Kompass-Skala`, `Virtuelles Gewitter`, `Geladene Module`, `Soll/Ist-Vergleich`, `Bewegungsprofil` und `Trendberechnung` ausdrücklich ausgeschlossen,
- Browserprofiltest prüft außerdem die drei getrennten Kopfstatus-Segmente.

Geprüfter Code-/Test-Head:
- `dff8145bf6a724a43fd13798f2833480b8f7f72f`.

Alle fünf Gates grün:
- Validate shared Gewitterradar frontend,
- Validate Gewitterradar integration,
- Diagnostic contract,
- Hi-Res asset retention,
- Source archive contract.

**Nächster Schritt:** finalen Dokumentations-Head vollständig gaten und anschließend exakt diesen Stand auf `deploy/dev` promoten.


## Schleife 038 – Standardansicht-Dropdown an Einstellungs-Lifecycle gebunden

**Datum:** 2026-09-23  
**Status:** Code/Test vollständig grün; finaler Dokumentations-Head wird gegatet und danach auf `deploy/dev` promotet

Realer Befund:
- **Standardansicht**-Dropdown geöffnet,
- Klick außerhalb bzw. auf den Einstellungs-Hintergrund schloss den Einstellungsdialog,
- das separat positionierte Dropdown blieb danach sichtbar über der Karte stehen.

Ursache:
- die Standardansicht-Auswahl wird im Modul `fullscreen.map-display` als frei positioniertes Custom-Dropdown verwaltet,
- die Einstellungs-Schließlogik in `ui.controls` kannte bisher nur Sprache, Cluster-Auflösung, Standort und Radius-Ziffernblock,
- damit fehlte der Standardansicht ein expliziter gemeinsamer Lifecycle-Pfad beim Schließen des Settings-Backdrops.

Korrektur:
- `fullscreen.map-display` → **1.0.2**,
- zentrale Methode `_closeMapStartupDropdown(returnFocus)`,
- Teardown schließt die Standardansicht ebenfalls,
- `ui.controls` → **1.1.2**,
- Settings öffnen/schließen, Hintergrundklick sowie Ein-/Ausklappen bzw. Wechsel eines Akkordeonabschnitts schließen das Dropdown explizit,
- `aria-expanded` wird gleichzeitig zurückgesetzt.

Regression:
- Browserprüfung öffnet Einstellungen und Standardansicht,
- bestätigt den geöffneten Zustand,
- klickt den Settings-Backdrop und verlangt anschließend **Settings geschlossen + Dropdown geschlossen + aria-expanded=false**,
- öffnet Einstellungen und Dropdown erneut,
- wechselt auf **Radien** und verlangt ebenfalls **Dropdown geschlossen + aria-expanded=false**,
- Prüfung läuft in beiden Auslieferungen und allen Geräteprofilen der bestehenden Browsermatrix.

Geprüfter Code-/Test-Head:
- `a688ff38d18b90b38db88d586b217e1112347cde`,
- alle fünf Gates grün.

**Nächster Schritt:** dokumentierten Head vollständig gaten und danach exakt auf `deploy/dev` promoten.


## Schleife 039 – reale Abnahme der fremdsprachigen Modulansicht

**Datum:** 2026-09-23  
**Status:** real auf HA DEV bestätigt

Reale Nutzerabnahme nach DRA-Installation:
- die **Moduldarstellung funktioniert in Fremdsprachen nun vollständig**,
- die zuvor gemischten Modulnamen und Funktionslisten sind in der realen Home-Assistant-Oberfläche sprachkonsistent,
- damit ist die reale UI-Abnahme der in Schleife 037 umgesetzten **22 Module × 19 Sprachvarianten** erfolgreich,
- technische IDs und Dateipfade bleiben erwartungsgemäß technisch und sind davon nicht betroffen.

Bewertung:
- der Lokalisierungsblock der Modulansicht ist **real bestätigt**,
- für diesen Punkt ist keine weitere Korrektur offen,
- M13 **Einstellungen** bleibt insgesamt noch offen, weil die vollständige Einstellungsregression mehr als nur die Modulansicht umfasst.

**Nächster realer UI-Punkt:** Standardansicht-Dropdown aus Schleife 038 prüfen; anschließend M12-DRA-Restfälle fortsetzen.


## Schleife 040 – Standardansicht-Dropdown real vollständig abgenommen

**Datum:** 2026-09-23  
**Status:** real auf HA DEV bestätigt

Reale Nutzerabnahme:
- Standardansicht-Dropdown geöffnet,
- Klick auf den Einstellungs-Hintergrund schließt **Einstellungen und Dropdown gemeinsam**,
- Dropdown erneut geöffnet,
- Wechsel auf einen anderen Einstellungsabschnitt schließt das Dropdown ebenfalls,
- kein verwaister Dropdown-Layer bleibt über der Karte stehen.

Bewertung:
- der Lifecycle-Fix aus Schleife 038 ist real bestätigt,
- Punkt 1 der abschließenden UI-Abnahme ist damit vollständig abgeschlossen,
- für diesen Fehler ist keine weitere Korrektur offen.

**Nächster Schritt:** M12-DRA-Restfälle real abarbeiten: Einzelmodul-Delta, Cache-/Mischstand, veraltet, fehlend, Rollback und Rückkehr auf aktuellen DEV-Stand.


## Schleife 041 – echter Ein-Modul-DRA-Test mit Medaillon-Popup vorbereitet

**Datum:** 2026-09-24  
**Status:** Testkandidat vorbereitet; reale DRA-Abnahme offen

Ziel:
- M12 nicht nur mit einem unsichtbaren Kommentar-Delta testen, sondern mit einer direkt sichtbaren, später sinnvoll weiterentwickelbaren Funktion.

Umsetzung ausschließlich im temporären DRA-Testzweig:
- Branch `test/dra-v4.10.02-single-module`,
- Basis exakt `deploy/dev`,
- Commit `a7ac91ed9880a0ba0ec60391b98cea4c33a6c325`,
- nur `custom_components/gewitterradar/frontend/modules/fullscreen/map-display.js` geändert,
- Vergleich gegen `deploy/dev`: **1 Datei geändert, 0 neu, 0 entfernt**.

Testfunktion:
- vorhandener gemeinsame Drag-/Tap-Pfad von Kompass und Medaillon genutzt,
- beim Medaillon führt eine echte Tap-Geste nun zu einem kleinen provisorischen Popup,
- echte Drag-Gesten behalten die bestehende Positionsspeicherung bei,
- Popup verwendet bereits vorhandene Medaillon-, Pfeil- und Schließen-Assets,
- keine neue Übersetzung, kein Manifest und keine Versionsnummer geändert, damit der DRA-Test absichtlich exakt **ein verwaltetes Modul** verändert.

Wichtig:
- dieser Zweig ist **nur** ein M12-Abnahmeträger,
- nach erfolgreichem Ein-Modul-Test wird auf `deploy/dev` zurückgekehrt,
- die eigentliche Medaillon-Auswahl/-Bearbeitung wird erst nach Abschluss von M12 als eigenes neues Thema sauber versioniert und vollständig umgesetzt.


## Schleife 042 – Ein-Modul-Testkandidat robuster gemacht

**Datum:** 2026-09-24  
**Status:** aktualisierter Testkandidat bereit; reale DRA-Abnahme offen

Realer Befund nach erster Installation:
- DRA erkannte korrekt **0 neu / 1 geändert / 0 entfernt / 56 unverändert**,
- Installation wurde durchgeführt,
- `fullscreen.map-display` blieb erwartungsgemäß auf **1.0.2**, da für den M12-Ein-Datei-Test bewusst weder Manifest noch Versionsnummer verändert werden,
- Medaillon blieb im Vollbild weiterhin nur verschiebbar; Popup öffnete sich noch nicht.

Nachschärfung ausschließlich im selben verwalteten Modul:
- Branch `test/dra-v4.10.02-single-module`,
- neuer Commit `26b935870e5e871ece26fb724d9ef67a019668e7`,
- gegenüber `deploy/dev` weiterhin exakt **eine geänderte Datei**:
  `custom_components/gewitterradar/frontend/modules/fullscreen/map-display.js`,
- zusätzlicher echter `click`-Pfad für das Medaillon,
- Drag-Gesten setzen eine kurze Klickunterdrückung, damit Verschieben kein Popup auslöst,
- temporärer Mouse-over-Hinweis **„Medaillon · M12 Ein-Modul-Test“** bestätigt sichtbar, dass die aktualisierte Testdatei tatsächlich im Browser aktiv ist.

Nächste reale Abnahme:
1. DRA-Vorschau des aktualisierten Testbranches berechnen,
2. weiterhin **1 geändert / 0 neu / 0 entfernt** erwarten,
3. installieren und Frontend neu laden,
4. Mouse-over am Vollbild-Medaillon muss den M12-Hinweis anzeigen,
5. Klick öffnet Popup,
6. Ziehen verschiebt nur.


## Schleife 043 – realer Ein-Modul-DRA-Test erfolgreich

**Datum:** 2026-09-24  
**Status:** real bestanden

Reale Abnahme:
- DRA erkannte den aktualisierten Testzweig korrekt als **0 neu / 1 geändert / 0 entfernt / 56 unverändert**,
- Installation wurde mit DRA durchgeführt,
- nach Frontend-Neuladen öffnet ein Klick/Tipp auf das frei bewegliche Vollbild-Medaillon das provisorische M12-Popup,
- damit ist die tatsächlich geänderte Einzeldatei im laufenden Home-Assistant-Frontend nachgewiesen,
- M12-Haken **Deployment nur eines geänderten Moduls** gesetzt.

Bekannter, bewusst aufgeschobener Darstellungsfehler des Testträgers:
- das Schließen-Symbol wird mit einem unerwünschten Rahmen/Fokusrahmen dargestellt,
- dies blockiert M12 nicht, weil der Dialog nur als sichtbarer Ein-Modul-Testträger dient,
- die eigentliche Medaillon-Funktion wird erst nach M12 weiterentwickelt.

Architekturhinweis für nach M12:
- das Medaillon besitzt inzwischen genügend eigene Verantwortlichkeiten, um eine spätere Auslagerung in ein eigenes Modul wie `instruments.medallion` zu prüfen.

**Nächster Schritt:** auf `deploy/dev` zurückkehren und danach M12 Browsercache-/Mischstand real prüfen.


## Schleife 044 – DEV wiederhergestellt und Cache-/Mischstand-Test vorbereitet

**Datum:** 2026-09-24  
**Status:** Rückkehr auf DEV real bestätigt; nächster Testkandidat bereit

Realer Befund:
- nach dem erfolgreichen Ein-Modul-Test wurde über DRA wieder auf den vorherigen Gewitterradar-Stand `deploy/dev` zurückgestellt,
- der ursprüngliche V4.10.02-Stand ist real wiederhergestellt.

Neuer Testkandidat:
- Branch `test/dra-v4.10.02-cache-mixed-state`,
- Commit `274d9304823be7a1ec8620ec6f157493813d0e47`,
- exakt eine geänderte Datei gegenüber `deploy/dev`,
- `fullscreen.map-display` meldet absichtlich **1.0.1**, während das Manifest weiterhin **1.0.2** erwartet.

Zweck:
- nach Installation ohne Browserneuladen muss der bereits geladene alte Laufzeitstand zunächst bestehen bleiben,
- nach hartem Frontend-Neuladen muss das absichtlich veraltete Modul **1.0.1** geladen werden,
- die Moduldiagnose muss den Soll-/Ist-Unterschied **1.0.2 erwartet / 1.0.1 geladen** erkennen,
- damit können die offenen M12-Punkte **Browsercache-Fall simulieren** und **veraltetes Modul erkennen** gemeinsam real abgenommen werden.

**Nächster Schritt:** Testzweig über DRA installieren und die beiden Zustände vor und nach hartem Frontend-Neuladen dokumentieren.


## Schleife 045 – Versionsabweichung im realen Laufzeitstand sichtbar

**Datum:** 2026-09-24  
**Status:** Teilnachweis erfolgreich; Detailzeile noch zu bestätigen

Realer Befund aus der Gewitterradar-Oberfläche:
- **22 / 22 Module geladen**,
- **1 Abweichung erkannt**,
- damit reagiert die reale Moduldiagnose auf den absichtlich erzeugten Soll-/Ist-Unterschied.

Für den vollständigen M12-Nachweis des veralteten Moduls fehlt nur noch die Detailzeile:
- `fullscreen.map-display`
- geladen **1.0.1**
- erwartet **1.0.2**
- Status Versionsabweichung.

Der Browsercache-/Mischstand-Haken wird erst gesetzt, wenn zusätzlich der Zustand vor dem harten Frontend-Neuladen bzw. dessen Verhalten real bestätigt ist.


## Schleife 046 – Dokumentation und Chat-Übergabe konsolidiert

**Datum:** 2026-09-24  
**Status:** erledigt

Dokumentationspflege ohne Doppelablage:
- dieser Schlachtplan bleibt die einzige Detailquelle für M01–M13, reale Abnahmen und Schleifen,
- die bereits vorhandene Datei `docs/V4_10_CHAT_HANDOFF_2026-09-22.md` wurde als **kanonische Übergabe fortgeschrieben**, statt eine zweite Übergabedatei anzulegen,
- temporäre M12-Testträger bleiben aus CHANGELOG/HISTORY heraus; dort werden nur dauerhafte Produktänderungen gepflegt,
- die Übergabe verweist für Details auf diesen Schlachtplan und enthält nur aktuellen Einstiegspunkt, Branch-/Teststand, offene Gates und einen Starttext für den nächsten Chat.

**Fortsetzung:** ausschließlich am Abschnitt **NÄCHSTER SCHRITT** oben weiterarbeiten.
