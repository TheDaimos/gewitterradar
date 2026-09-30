# Chat-Übergabe – Gewitterradar V4.10.02 / Medaillons R13

**Stand:** 2026-09-26  
**Repository:** `TheDaimos/gewitterradar`  
**Arbeitszweig:** `feature/v4.10.02-modularization`  
**DRA-Verteilzweig:** `deploy/dev`

## 1. Verbindlicher Ausgangsstand

Der letzte vollständig geprüfte Produktkandidat ist:

- Commit: `fca0b95929359fac06c465c678ac9e130341a623`
- Runtime: `41002r13`
- Build: `V4.10.02-MODULAR-DEV-R13-2026-09-26`
- Modulsatz: `C91E-5A27`
- `fullscreen.map-display`: `1.0.14`
- `core.manifest`: `1.2.17`
- `core.base-context`: `1.0.7`

CI für diesen Kandidaten: **5/5 grün**

- Validate shared Gewitterradar frontend ✅
- Validate Gewitterradar integration ✅
- Diagnostic contract ✅
- Source archive contract ✅
- Hi-Res asset retention ✅

`deploy/dev` zeigt zum Zeitpunkt dieser Übergabe exakt auf den geprüften Kandidaten `fca0b959...`.

Keine Veröffentlichung, kein Merge nach `main` und kein Release ohne ausdrückliche Benutzerfreigabe.

## 2. Medaillon-Stand

Der Medaillon-Picker enthält nun **18 eindeutig identifizierbare Varianten**:

- `trend_01` = bestehendes Referenzmedaillon; darf nicht ersetzt werden.
- `trend_02` bis `trend_10` = R12-Erweiterung.
- `trend_11` bis `trend_18` = R13-Erweiterung aus den zuletzt gelieferten acht Grafiken.

Die eindeutige Zuordnung von ID, Laufzeitdatei und Quelle steht verbindlich in:

- `docs/MEDALLION_CATALOG.md`

Der Picker zeigt ab R13 die ID direkt an, z. B.:

`trend_14 · 14 / 18`

Das ist absichtlich so umgesetzt, damit spätere Aussortierungen eindeutig nur über die ID erfolgen können.

## 3. Laufzeitgrafiken / Bildregeln

Für neue Medaillons gilt verbindlich:

- Laufzeitgröße: **264 × 264 px**
- entspricht **2× Retina** für die 132-px-Instrumentdarstellung
- Format: **verlustfreies WebP / VP8L**
- Transparenz / Freistellung erhalten
- kein inhaltlicher Beschnitt
- keine Seitenverhältnisverzerrung
- identische Bytes in:
  - `frontend/assets`
  - `dashboard/dist/assets`
  - `custom_components/gewitterradar/frontend/assets`

Sonderfall `trend_18`:
- Quelle: 1284 × 1225 px
- proportional auf 264 × 252 px skaliert
- mittig auf transparenter 264 × 264-px-Fläche platziert
- dadurch weder Beschnitt noch Verzerrung

## 4. Verbindliche Master-Regel

Die gelieferten Hi-Res-Originale sind **geschützte Masterquellen**.

Verbindlich:
- Hi-Res-Originale später separat im vorgesehenen Master-Repository ablegen.
- Laufzeit-Ableitungen ersetzen niemals die Master.
- Mastergrafiken nicht löschen oder überschreiben.
- Auch aussortierte Laufzeitvarianten bedeuten nicht automatisch, dass das Hi-Res-Original gelöscht werden darf.

## 5. Implementierte technische Änderungen R13

- `trend_11` bis `trend_18` in den bestehenden Mehrvarianten-Picker integriert.
- eindeutige ID-Ausgabe im Picker ergänzt.
- Runtime/Cache von R12 auf R13 angehoben.
- Modulsatz auf `C91E-5A27` angehoben.
- Asset-Inventar, Runtime-Manifest, Frontend-Verträge und Prüfsummen nachgeführt.
- Medaillon-Regressionstest auf 18 Varianten erweitert.
- `docs/MEDALLION_CATALOG.md` angelegt.
- Schlachtplan, bestehende Chat-Übergabe und Changelog wurden auf R13 nachgeführt.
- Alle drei Auslieferungsbäume enthalten die neuen Grafiken.
- DRA-Kandidat wurde nach grüner CI auf `deploy/dev` bereitgestellt.

## 6. Nächste reale Abnahme

Als nächstes soll Christian die Medaillons über DRA installieren und **alle 18 Varianten real durchschalten**.

Dabei besonders prüfen:

- richtige Grafik zur angezeigten ID
- saubere Transparenz
- keine sichtbaren Ränder / Canvas-Artefakte
- Schauglas optisch korrekt
- Trendpfeil korrekt zentriert
- Popup / Vor / Zurück
- Auswahl bleibt nach Frontend-Neuladen erhalten
- Anzeige der ID `trend_XX` eindeutig lesbar

Danach kann Christian einzelne Medaillons ausdrücklich über ihre IDs aussortieren, z. B.:
- „`trend_07` entfernen“
- „`trend_14` behalten“
- „`trend_18` Schauglas korrigieren“

IDs bestehender Varianten **nicht umnummerieren**, auch wenn später Varianten entfallen. Eine entfernte ID bleibt historisch eindeutig.

## 7. Noch offener älterer Abschlussgate

Unabhängig vom Medaillon-Block ist aus dem Modularisierungs-Schlachtplan noch offen:

- Cluster-Jump / Infinity auf **iPad** real abnehmen.

Android/HA Companion und Desktop waren bereits bestanden.

Danach kann der Modularisierungs-Schlachtplan formal auf **ABGESCHLOSSEN** gesetzt werden, sofern keine neue Regression auftritt.

## 8. Arbeitsweise im Folgechat

Zuerst vollständig lesen:

1. `PROJECT_DEFAULTS.md`
2. `docs/V4_10_MODULARISIERUNG_SCHLACHTPLAN.md`
3. `docs/V4_10_CHAT_HANDOFF_2026-09-22.md`
4. `docs/V4_10_CHAT_HANDOFF_2026-09-26_R13_MEDALLIONS.md`
5. `docs/MEDALLION_CATALOG.md`

Danach den aktuellen Branch-Head und `deploy/dev` verifizieren.

Weiterhin die Schlachtplan-Schleife verwenden:

**implementieren → prüfen → CI → korrigieren → Schlachtplan aktualisieren → DRA bereitstellen**

Bei neuen Medaillon-Grafiken:
- zuerst Freistellung / Alpha prüfen,
- neue fortlaufende ID vergeben,
- Katalog sofort mitführen,
- mindestens 2× Retina,
- Master-Regel einhalten,
- nach CI über DRA bereitstellen.

