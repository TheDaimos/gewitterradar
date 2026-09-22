# Gewitterradar V4.10.02 – Chat-Übergabe Modularisierung

Stand: 2026-09-22  
Projekt: Gewitterradar  
Repository: `TheDaimos/gewitterradar`  
Arbeitszweig: `feature/v4.10.02-modularization`  
Draft-PR: #24 – `V4.10.02: modular frontend architecture`  
Letzter geprüfter Arbeits-Head vor dieser Übergabe: `a18adb21a7581de4909bf178bcfb18ae1b923535`

## 1. Startanweisung für den neuen Chat

Der neue Chat soll **nicht aus Erinnerung weiterarbeiten**, sondern zuerst den aktuellen Repository-Stand laden.

Verbindliche Reihenfolge:

1. Bootstrap Daimos laden, falls der Benutzer ihn aufruft.
2. Repository `TheDaimos/gewitterradar` lesen.
3. Aktiven Zweig `feature/v4.10.02-modularization` prüfen.
4. Zwingend `PROJECT_DEFAULTS.md` lesen.
5. Zwingend den **Schlachtplan** laden:
   `docs/V4_10_MODULARISIERUNG_SCHLACHTPLAN.md`
6. Danach diese Übergabe lesen:
   `docs/V4_10_CHAT_HANDOFF_2026-09-22.md`
7. Aktuellen Branch-Head und aktuelle PR-/CI-Ergebnisse neu verifizieren.
8. Am im Schlachtplan genannten `NÄCHSTER SCHRITT` fortsetzen.

Wenn Christian sagt:

> „Schau in den Schlachtplan und führe ihn weiter fort.“

ist damit ohne Rückfrage
`docs/V4_10_MODULARISIERUNG_SCHLACHTPLAN.md`
gemeint.

## 2. Verbindliche Arbeitsweise

Die Modularisierung wird **nicht als großer einmaliger Umbau** behandelt, sondern als fortlaufende, fail-closed Arbeitsschleife.

Nach jedem abgeschlossenen Teilpunkt:

1. aktuellen Repository-Stand lesen,
2. genau einen fachlich zusammenhängenden Punkt umsetzen,
3. Syntax-/Struktur-/Regressionstests ausführen,
4. GitHub-CI/PR-Gates prüfen,
5. Fehler zuerst beheben – keinen roten Gate-Zustand als erledigt markieren,
6. Ergebnis im Schlachtplan dokumentieren,
7. Checkboxen nur für im Repository nachweisbar erledigte Punkte setzen,
8. `NÄCHSTER SCHRITT` aktualisieren,
9. Arbeitsprotokoll um eine neue Schleife ergänzen,
10. erst danach den nächsten Punkt beginnen.

Wichtig:

- Nicht aus altem Chatgedächtnis auf vermeintlich erledigte Schritte schließen.
- Der aktuelle Branch + Schlachtplan sind die maßgebliche Wahrheit.
- Bei Widerspruch gilt die ausdrückliche neue Benutzeranweisung vor dem Schlachtplan.
- Bestehende Funktionen werden bei der Modularisierung zunächst **1:1 verhaltensneutral** ausgelagert.
- Keine fachfremden Funktionen ergänzen, nur um einen Planpunkt abzuhaken.
- Frühere Provider-Punkte NASA/EUMETView waren aus WeatherRouter übernommen und sind für Gewitterradar ausdrücklich **nicht anwendbar**.
- Keine Veröffentlichung/kein Merge, solange die Release-Gates nicht erfüllt sind.
- V4.10.01 bleibt Rückfallbasis.

## 3. DRA ist Pflicht, nicht optional

Deploy Relay Agent ist für diese Modularisierung eine **harte Abnahmebedingung**.

Die reguläre weitere Entwicklung soll über DRA funktionieren. Manuelles Kopieren einzelner JS-Dateien ist nur Notfall-/Diagnoseweg.

Verbindliche DRA-Ziele:

- kompletter modularer Frontendbaum muss über DRA installierbar sein,
- DRA muss einen konsistenten Versionssatz installieren,
- stabiler Einstiegspunkt bleibt erhalten,
- keine Einzelregistrierung der Unter-Module in Home Assistant,
- DRA muss den installierten Sollstand kennen,
- Gewitterradar zeigt den tatsächlich im Browser geladenen Iststand,
- Soll/Ist-Vergleich muss möglich sein,
- Snapshot vor Änderungen,
- gezielte Wiederherstellung älterer Stände,
- Snapshot-Aufbewahrung pro Projekt konfigurierbar,
- unmittelbar vorheriger funktionierender Stand darf nicht automatisch verloren gehen,
- DRA soll Frontend-Neuladen, Integrations-Neuladen und vollständigen HA-Neustart unterscheiden,
- M12 ist ein Release-Gate.

Aktuell vorhanden:

`deploy-relay.json`

mit Deployment des kompletten
`custom_components/gewitterradar`
nach
`/config/custom_components/gewitterradar`
im Modus `replace_directory`.

Außerdem:

`deploy-relay-channel.json`

mit DEV-Referenz auf
`feature/v4.10.02-modularization`.

## 4. Architekturentscheidung

Home Assistant registriert weiterhin **nur eine einzige Datei**:

`gewitterradar.js`

Diese bleibt der stabile Einstiegspunkt/Loader.

Die Funktionslogik liegt inzwischen in echten ES-Modulen unter:

`frontend/modules/`

Die Integration stellt weiterhin den vollständigen Frontendordner statisch bereit. Unter-Module müssen **nicht einzeln in Home Assistant registriert** werden.

Die gleiche Struktur wird byte-identisch in den Auslieferungsbäumen gehalten:

- `frontend/`
- `custom_components/gewitterradar/frontend/`
- `dashboard/dist/`

## 5. Eigenständige Modulversionierung

Jedes Modul trägt seine **eigene Version im Modul selbst**.

Beispielprinzip:

```javascript
export const MODULE_META = {
  id: "instruments.compass-selector",
  version: "1.0.0",
  group: "Instrumente",
  function: "Kompassauswahl",
  subfunctions: [...]
};
```

Beim Laden registriert sich jedes Modul selbst.

Die Registry liegt unter:

`frontend/modules/core/registry.js`

Sie erfasst unter anderem:

- ID,
- Modulversion,
- Funktionsgruppe,
- Hauptfunktion,
- Unterfunktionen,
- Dateipfad,
- Ladezeitpunkt,
- geladene URL,
- Doppeltregistrierung,
- fehlende Module,
- Versionsabweichungen,
- unerwartete Module.

## 6. „Module & Versionen“

Der gewünschte neue Bereich ist technisch umgesetzt.

Modul:

`frontend/modules/diagnostics/module-view.js`

Funktionen:

- Gruppierung nach Funktion,
- Modul-ID,
- geladene Modulversion,
- erwartete Modulversion,
- Funktion,
- Unterfunktionen,
- Dateipfad,
- Ladezeit,
- Soll-/Ist-Status,
- grün = korrekt,
- gold = Versionsabweichung/unerwartet,
- rot = fehlt/Ladefehler,
- Diagnose kopieren,
- JSON herunterladen.

Ziel ist ausdrücklich, **die tatsächlich im Browser geladenen Modulversionen** zu sehen – nicht nur eine zentrale Solltabelle.

## 7. Bereits umgesetzte Modularisierung

Im Schlachtplan sind bereits als technisch umgesetzt markiert:

- M01 Bestandsaufnahme,
- M02 Registry & Modulmetadaten,
- M04 Core weitgehend,
- M05 UI,
- M06 Instrumente,
- M07 Vollbild,
- M08 Karte,
- M09 nicht anwendbar,
- M10 Diagnose & Logging,
- M11 Module & Versionen.

M03 Loader ist technisch umgesetzt, aber **noch nicht formal abgeschlossen**, weil der gemeinsame Browser-/Frontend-Gate noch rot ist.

Noch zwingend offen:

- M03 Browser-/Desktop-Abnahme,
- M12 DRA-Ende-zu-Ende,
- M13 vollständige Regression/Freigabe,
- Android/HA Companion,
- reale HACS-/DRA-Updatepfade,
- Release Notes / History / Changelog,
- finale Checksummen/Freigabe.

## 8. Aktueller CI-Stand

Für den letzten geprüften Head
`a18adb21a7581de4909bf178bcfb18ae1b923535`
waren 4 von 5 Pull-Request-Gates grün:

- ✅ Source archive contract
- ✅ Diagnostic contract
- ✅ Hi-Res asset retention
- ✅ Validate Gewitterradar integration
- ❌ Validate shared Gewitterradar frontend

Draft-PR #24 ist offen und mergebar, aber ausdrücklich noch Draft.

## 9. Aktueller konkreter Blocker

Der aktuelle rote Gate-Fehler ist **nicht mehr** der frühere Browserparserfehler im Diagnosemodul.

Die früheren Probleme wurden bereits weiter eingegrenzt bzw. behoben:

- fehlende Methodenseparatoren nach Extraktion,
- `async`-Parserproblem in `diagnostics/cockpit.js`,
- deterministischer Modulimport,
- modularer Asset-Inventarscan,
- Root-Modul-URL,
- modularer About-Harness,
- modularer Core/Base-Context,
- Boot-Preflight-Diagnostik.

Der aktuell letzte bekannte Fehler im gemeinsamen Frontend-Gate lautet:

```text
ReferenceError: __moduleDeps is not defined
at gewitterradar.js:5979
```

Der Fehler tritt in:

`scripts/verify-about-locales.mjs`

beim isolierten VM-Ausführen des modularen Einstiegspunkts auf.

Die neu hinzugefügte Boot-Preflight-Prüfung in `gewitterradar.js` greift auf `__moduleDeps` zu. Der Locale-Prüfer entfernt für seine isolierte Laufzeit bereits Teile des modularen Bootstraps:

```javascript
.replace(/^\s*const __moduleDeps=.*;\s*$/gm,'')
.replace(/^\s*Object\.(?:defineProperties|assign)\(__moduleDeps,.*;\s*$/gm,'')
.replace(/^\s*install[A-Za-z0-9_]+\(GewitterradarCard,__moduleDeps\);\s*$/gm,'');
```

Dadurch bleibt aktuell die Boot-Preflight-Zeile, die `__moduleDeps` referenziert, übrig.

**Nächster technischer Schritt:**
Den isolierten Locale-/About-Prüfer modular-runtime-fähig machen, sodass die Boot-Preflight-Logik entweder

- im Test-Harness passend entfernt/neutralisiert wird, oder
- mit einem minimalen, echten `__moduleDeps`-Kontext ausgeführt wird,

ohne die Produktionslogik in `gewitterradar.js` wieder zurückzubauen.

Danach:

1. CI erneut laufen lassen,
2. „Validate shared Gewitterradar frontend“ muss grün werden,
3. M03 im Schlachtplan formell schließen,
4. erst dann M12 DRA-Ende-zu-Ende starten.

## 10. Wichtige zuletzt relevante Commits

Historischer Modularisierungszweig enthält unter anderem:

- `0527c4aa...` – erste echte Extraktion in selbstversionierte Module
- `5634281e...` – Build/HACS/Regression-Gates modularisiert
- `3a91e734...` – Module-&-Versionen-Ansicht + modularer Diagnosepfad
- `a3f787f7...` – fail-safe dynamischer Modul-Loader
- `30df9b19...` – Schlachtplan aktualisiert und fremder Provider-Scope entfernt
- `6d8c2abf...` – fehlender Diagnose-Methodenseparator repariert
- `a4d928a2...` – weitere extrahierte Methodenseparatoren repariert
- `a0d6e5aa...` – deterministische V4.10.02-Modulladung
- `904784e0...` – gemeinsamen Core-Kontext aus stabilem Loader extrahiert
- `2b4507a5...` – Diagnose-async-Methoden für Browserparser normalisiert
- `6c9db7ac...` – modularen Asset-Referenzscan erweitert
- `c6cf7627...` – modularen About-Harness erweitert
- `d2e9e795...` / `1faedf59...` – Schlachtplan mit verifiziertem Stand nachgezogen
- `0025568a...` – modularen Boot-Preflight-Diagnosecheck ergänzt
- `a18adb21...` – Loader-Vertrag nach Boot-Preflight aktualisiert

**Wichtig:** Beim Start eines neuen Chats immer den aktuellen Head neu lesen. Die oben genannte SHA ist nur der Stand unmittelbar vor dieser Übergabe.

## 11. Nicht verhandelbare Regressionen

Die Modularisierung darf insbesondere nicht beschädigen:

- bestehende Kartenfunktionen,
- Vollbildmodus,
- frei verschiebbare Instrumente,
- Touch-Unterstützung Android,
- Standort-Pille inklusive Öffnungsrichtung und Mehrspaltigkeit,
- Layer-Anzeige immer im Vordergrund,
- Diagnosemodus-Sichtbarkeitsregeln,
- Kompass-/Medaillon-Ein-/Ausblenden,
- gespeicherte Orte,
- bestehende Einstellungen,
- Cluster,
- Radien,
- Aura,
- Logging,
- Sprach-/About-/Help-System,
- HACS-Installierbarkeit,
- DRA-Installierbarkeit.

## 12. Release-Disziplin

Keine V4.10-Freigabe, solange:

- Browser-/Desktop-Gate nicht grün ist,
- Android/HA Companion nicht geprüft ist,
- M12 DRA nicht vollständig bestanden ist,
- Soll/Ist-Moduldiagnose nicht real getestet ist,
- Rollback nicht getestet ist,
- HACS/DRA-Pfade nicht geprüft sind,
- Checksummen/History/Release Notes nicht finalisiert sind.

## 13. Konkreter Starttext für den nächsten Chat

```text
Bootstrap Daimos.

Wir machen mit Gewitterradar V4.10.02 und der Modularisierung weiter.

Arbeite direkt im Repository TheDaimos/gewitterradar auf dem aktuellen Zweig
feature/v4.10.02-modularization.

Wichtig:
Lies zuerst PROJECT_DEFAULTS.md und anschließend den Schlachtplan
docs/V4_10_MODULARISIERUNG_SCHLACHTPLAN.md.
Lies danach
docs/V4_10_CHAT_HANDOFF_2026-09-22.md.

Führe den Schlachtplan exakt nach der dort festgelegten Schleife fort:
implementieren → prüfen → CI/Regression auswerten → Schlachtplan aktualisieren → nächsten Punkt nehmen.

DRA ist eine harte Abnahmebedingung. Keine Iteration gilt als fertig, solange sie nicht vollständig über DRA installierbar, prüfbar und wiederherstellbar ist.

Der letzte bekannte Blocker war im gemeinsamen Frontend-Gate:
ReferenceError: __moduleDeps is not defined
im isolierten About-/Locale-Prüfer scripts/verify-about-locales.mjs nach dem Boot-Preflight.

Prüfe zuerst den aktuellen Branch-Head und die aktuellen PR-#24-CI-Ergebnisse, da der Repository-Stand neuer als diese Übergabe sein kann. Dann behebe den noch aktuellen Blocker und fahre ohne Rückfrage nach Schlachtplan fort.
```
