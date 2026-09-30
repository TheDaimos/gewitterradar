# Chat-Übergabe – Gewitterradar V4.10.02 Modularisierung – R31 iPad Focus-Ring

Stand: 2026-09-29 12:10 CEST

## Bootstrap / Arbeitsweise

Bootstrap: **Daimos**

Repository: `TheDaimos/gewitterradar`  
Arbeitsbranch: `feature/v4.10.02-modularization`

Verbindliche Arbeitsweise:

**implementieren → prüfen → CI → korrigieren → Schlachtplan aktualisieren → DRA**

Wichtige Regeln:

- nicht nach `main` mergen und keinen Release veröffentlichen ohne ausdrückliche Freigabe,
- reale Geräte-Abnahmen nur nach ausdrücklicher Nutzerbestätigung abhaken,
- `deploy/dev` nur auf einen vollständig geprüften technischen Kandidaten setzen,
- Hi-Res-Assets nicht löschen oder umnummerieren,
- `arrow_00` bleibt geschützter Default,
- Diagnose-/Kalibrierungswerte nicht stillschweigend verändern,
- Schlachtplan: `docs/V4_10_MODULARISIERUNG_SCHLACHTPLAN.md`.

## Aktueller Repository-Stand

Feature-HEAD:

`a5e984cac07f71089e4f15201f920c7b79aa61eb`

Aktueller Build:

- Build: `V4.10.02-MODULAR-DEV-R31-2026-09-29`
- Feature-Cache: `41002r31`
- Runtime-Cache: `41002r13`
- Modulsatz: `D31A-5E9B`
- `core.manifest`: **1.2.37**
- `fullscreen.map-display`: **1.0.29**
- `ui.skeleton`: **1.1.7**
- `diagnostics.cockpit`: **1.5.1**

`deploy/dev` steht weiterhin auf dem letzten vollständig freigegebenen technischen Kandidaten:

`64b8805a661b7f7e7212fc1017ed1ece58cfe98c`

Das ist der R27-DRA-Stand. **R31 ist noch nicht nach DRA promotet.**

## Letzter Nutzerfehler – iPad blaue Umrandung der Trendanzeige

### Fehlerbild

Auf dem iPad wird in der Hauptansicht nach einmaligem Tippen auf die Trendanzeige eine blaue Fokus-/Tap-Umrandung um die Trendanzeige sichtbar.

Beim Kompass tritt diese störende Darstellung nicht in gleicher Form auf.

Der Nutzer möchte ausdrücklich, dass diese blaue Umrandung der Trendanzeige verschwindet.

### Bereits in R31 umgesetzt

Die Korrektur ist auf dem Feature-Branch bereits implementiert.

Relevante Commits:

- `492336ffb933cd52647b54ae4d242e611278d650` – **fix: suppress iPad trend focus ring reliably**
- `76b8a82066b1a31866fcc610c93a7177d697ee01` – **fix: clear iPad trend focus before picker tap**

Wesentliche technische Änderungen:

1. In `frontend/modules/ui/skeleton.js` wurden für die Tendenz auf iPad/WebKit explizite Fokus-/Tap-Regeln ergänzt:
   - `-webkit-tap-highlight-color: transparent`
   - `outline: none`
   - `box-shadow: none`
   - `-webkit-focus-ring-color: transparent`
   - Regeln für `#trend-box`, `#trend-icon` und relevante Focus-/Focus-visible-Zustände.

2. In `frontend/modules/fullscreen/map-display.js` wird vor dem Öffnen des Medaillon-/Pfeil-Pickers auf Touch-Geräten der Fokus der Trendanzeige explizit entfernt.
   - zusätzlicher `pointerdown`-/`touchstart`-Schutz,
   - beim Schließen des Pickers wird auf groben Touch-Geräten der frühere Trend-Fokus nicht wieder künstlich hergestellt.

3. Frontend, Home-Assistant-Ausleitung und Dashboard-Ausleitung wurden gespiegelt.

## Aktueller CI-Status R31

Für Feature-HEAD `a5e984cac07f71089e4f15201f920c7b79aa61eb`:

- ✅ Source archive contract
- ✅ Hi-Res asset retention
- ✅ Diagnostic contract
- ✅ Validate Gewitterradar integration
- ❌ Validate shared Gewitterradar frontend

Der verbleibende Fehler ist **kein funktionaler Focus-Ring-Fehler**, sondern ein veralteter Testvertrag.

Exakter CI-Fehler:

`Settings scroll contract missing: "version": "1.1.6"`

Aktuell ist `ui.skeleton` bereits **1.1.7**.

Der fehlgeschlagene Lauf war:

- Workflow: `Validate shared Gewitterradar frontend`
- Run-ID: `36553083918`
- Job-ID: `109355684681`

Der Lauf prüft einen PR-Merge-Ref und erwartet noch den alten Skeleton-Stand 1.1.6.

## Nächster technischer Schritt

1. Den veralteten Shared-Frontend-Test finden, der noch explizit `"version": "1.1.6"` erwartet.
2. Erwartung auf `ui.skeleton 1.1.7` aktualisieren.
3. Keine Produktlogik verändern, solange die Focus-Ring-Korrektur selbst keinen weiteren Fehler zeigt.
4. Vollständige CI erneut laufen lassen.
5. Erst bei **5/5 grün** den exakten R31-Kandidaten nach `deploy/dev` promoten.
6. `deploy/dev` danach per Compare als `identical` verifizieren.
7. Schlachtplan und Changelog auf den finalen R31-Kandidaten aktualisieren.
8. Nutzer über DRA testen lassen.

## Reale Abnahme R31

Noch nicht bestätigt:

- [ ] R31 über DRA installieren.
- [ ] Frontend auf dem iPad vollständig neu laden.
- [ ] einmal auf die Trendanzeige tippen.
- [ ] prüfen, dass keine blaue Umrandung / kein WebKit-Focus-Ring zurückbleibt.
- [ ] Medaillon-/Pfeil-Popup öffnen und schließen.
- [ ] prüfen, dass beim Schließen kein blauer Fokusrahmen wiederhergestellt wird.
- [ ] Kompass unverändert gegenprüfen.
- [ ] Desktop und Android kurz auf Regressionen prüfen.

## Relevante unmittelbar vorherige Änderungen

Die vorherigen Iterationen beinhalten bereits:

- produktive 504/504 Medaillon-/Pfeil-Kalibrierung,
- gleiche Kalibrierung in Hauptansicht und Picker,
- Vollbild-Skalierung für Kompass und Medaillon,
- Schnellwahl 50 / 75 / 100 / 125 / 150 %,
- freie Skalierung 15–300 % sowie Schieberegler,
- kompakte `x / xx`-Navigation,
- Starr-/Animations-Vorschau auch ohne aktuellen Gewittertrend,
- weiß-warmen Glow in Medaillon- und Kompassauswahl,
- Drag-Schutz für Lokations-Pille, Kompass und Trend/Medaillon während Blitz-/Render-Updates.

Diese Punkte nicht zurückbauen.

## Für den nächsten Chat zuerst lesen

1. `PROJECT_DEFAULTS.md`
2. `docs/V4_10_MODULARISIERUNG_SCHLACHTPLAN.md`
3. diese Datei
4. bei Bedarf:
   - `docs/R27_DRAG_GUARD_AND_PREVIEW_POLISH_2026-09-29.md`
   - letzte Einträge in `CHANGELOG.md`

## Wichtig

Der aktuelle Feature-Branch ist **weiter als deploy/dev**. Nicht versehentlich `deploy/dev` als Entwicklungsbasis behandeln.

Der nächste Chat soll **nicht erneut die Focus-Ring-Ursache untersuchen**, sondern zuerst den veralteten Shared-Frontend-Testvertrag korrigieren, danach CI vollständig grün machen und erst dann R31 nach DRA promoten.
