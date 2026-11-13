# Verbindlicher Entwicklungsauftrag: Eigenes Synoptik-Premiummenü, Eye-Icon und vollständige Windmenü-Migration

**Datum:** 13. November 2026 · **Ziel:** `TheDaimos/gewitterradar@deploy/dev` und WR-Anbindung `TheDaimos/weather-router-dev@deploy/dev`.

**Betreiberforderung:** Das bereits im Master-Repo gespeicherte H/T-/Isobaren-Icon erhält einen eigenen Kartenschalter, ein **per Long-Press öffnendes eigenständiges Premiummenü im exakt gleichen hochwertigen Stil** wie das Windmenü. Die bisher im Windmenü falsch untergebrachte H/T-Farbsteuerung ist vollständig und verlustfrei in das neue Synoptikmenü zu migrieren.

## 1. Master-Asset ist verbindlich

Original-Icon: `artwork/help-icons/hires/gr-synoptic-high-low-isobars-premium-original.png`  
Quellcommit: `2b066d190ace941f315942f78ad017dc1c250be9`  
Original SHA-256 (vom Codex-Asset-Commit gemeldet): `ed600af5c6d7cfeeb053a1442cca5126a905b453193530e2f553898a99a80437`  
GitHub: https://github.com/TheDaimos/gewitterradar/blob/2b066d190ace941f315942f78ad017dc1c250be9/artwork/help-icons/hires/gr-synoptic-high-low-isobars-premium-original.png

Das Original unverändert bewahren; kein zweiter Master, kein Redesign, keine Anpassung der H-/T-Pfeile. Für die tatsächliche Laufzeitdarstellung gegebenenfalls deterministisch abgeleitete optimierte Assets bauen, die zu diesem unveränderten Original rückverfolgbar sind.

## 2. Das existierende Windmenü ist die Design- und Verhaltensreferenz

Die Betreiber-Screenshot-Referenz zeigt dunkel gehaltene Premium-Flächen mit goldfarbenem feinem Metallrahmen, goldenen Abschnittsüberschriften, kompakten Controls, hochwertigen Chevron-/Minimieren-/Maximieren-/Schließen-Icons und einklappbaren Sektionen.

**Keine optisch ähnliche Neuimplementierung:** Die tatsächlich vorhandenen Premium-Komponenten und CSS-Klassen der Wind- und Temperaturmenüs verwenden. Abstände, Header, Typografie, Rahmen, Goldakzente, Chevron-Animation, Schließen, Minimieren/Maximieren, Verschieben, Z-Index, Scrolling und Touch-/Pointer-Behandlung müssen dem Windmenü entsprechen. Bestehende Animationseinstellungen und die geschützten Hi-Res-Steuericons respektieren.

Quellbeispiele:
- `frontend/modules/weather/wind-display.js` – `_weatherWindEnsureUi`, `_weatherWindOpen`, `_weatherWindRender`;
- `frontend/modules/weather/premium-ui.js` – `ensurePremiumUi`, `bindPremiumPanelDrag`, `premiumAction`, `enhancePremiumSections`, `syncPremiumPanel`, `togglePremiumPanel`;
- `frontend/modules/weather/eye-hub-registry.js` – vorhandene Registrierungs- und Short-/Long-Press-Semantik;
- `frontend/modules/weather/display-menu.js` – gemeinsame Transparenzsteuerung und Persistenz.

## 3. Verbindliche Migration der bisherigen H/T-Felder aus Wind

Aktuell stehen in `frontend/modules/weather/wind-display.js`, im Wind-Menü-Renderer unterhalb der Windfarben:
- `Farbmodus`: `Einheitliche Farbe` / `Hoch-/Tiefdruck (nicht verfügbar)`;
- erklärender Windhinweis `WR liefert keine autoritative Hoch-/Tiefdruckklassifikation. Windrichtung allein ist dafür ungeeignet.`;
- `Gespeicherte Hoch-/Tiefdruckfarben (inaktiv)` mit `Hochdruck` und `Tiefdruck`, siehe Screenshot des Betreibers.

Diese **drei zusammenhängenden H/T-spezifischen UI-Elemente vollständig aus dem Windmenü herausnehmen** und fachlich korrekt in das neue Synoptik-Premiummenü integrieren. Im Windmenü verbleiben ausschließlich legitime Windfunktionen und die normale Wind-Symbolfarbe. **Windanimation, Windfahnen, Windfarbfläche, Windlegende und alle Schlangen-Parameter müssen optisch und funktional unverändert bleiben.**

Der bisherige Persistenzort ist `WIND_STORAGE='gewitterradar:wind-ui:v1'` in `frontend/modules/weather/wind-data.js`, inklusive `colorMode`, `highColor`, `lowColor`; die bisherigen Standardwerte sind `highColor:'gold'` und `lowColor:'violet'`.

**Migration ist verlustfrei und idempotent**:
1. Beim ersten Erzeugen der Synoptik-Einstellungen die bereits gespeicherten H/T-Farben aus Wind übernehmen, wenn noch keine expliziten Synoptik-Farben gespeichert sind.
2. Vorhandene explizite Synoptik-Farben niemals durch Altwerte überschreiben; auch `0`/false/andere gültige falsy-Einstellungen anderer Felder nicht durch Truthiness-Logik verwerfen.
3. Die ursprünglichen Wind-Speicherwerte in Alt-/Rollback-Profilen zunächst erhalten und in der Wind-UI nicht mehr zur H/T-Steuerung verwenden; keine Datenverluste bei Downgrade/Settings-Vault/Neustart.
4. Die alte Wind-`colorMode='pressure'`-Option **nicht** einfach auf echtes H/T-Rendering umdeuten: Windrichtung klassifiziert keine Hoch- und Tiefdruckgebiete. Wind-Farbmodus fachlich neutralisieren/legacy-kompatibel interpretieren, ohne gespeicherte Winddarstellung oder Farbpalette unbeabsichtigt zu ändern.
5. Nach Migration H/T- und Isobarenfarben ausschließlich im neuen Synoptik-Modul verwalten. Einheitliche, gut unterscheidbare gespeicherte Farben sowie ggf. zusätzliche individuelle Isobarenlinienfarben anbieten.
6. Bisherige H/T-Abschnitte dürfen im Windmenü nicht als Duplikat oder „inaktiv“ verbleiben.

## 4. Synoptik-Bedienelement und Eye

Das neue Icon als **reguläre fünfte Eye-Funktion** zusätzlich zu Wind, Temperatur, Niederschlag und Transparenz registrieren. Nicht vorhandene Slots/Icons überschreiben oder versteckt wiederverwenden. Bestands-Slotzuweisungen, frei positionierbare Icons, persistierte Positionen und der in GR 4.11.195 reparierte gemeinsame Layoutpfad bleiben erhalten.

- **Short-Tap:** Synoptik-Gesamtdarstellung umschalten, ohne die getrennt gespeicherten Ein/Aus-Zustände von H/T und Isobaren zu verlieren.
- **Long-Press:** eigenes Synoptik-Premiummenü öffnen, ohne gleichzeitig umzuschalten oder die Karte zu verschieben.
- Drag: gleiche Geste, Positionsspeicherung und Kollisionsbehandlung wie andere ungruppierte WR-Icons.
- Eye-Bubble: in der Hi-Res-Icon-Sammlung als wählbarer Slot registrieren, auch auf Android per Tippen auf leeren Slot und per Drag & Drop.
- Kompatibel mit Gruppierung, Vollbild, Standard/Groß, Hoch-/Querformat, Close-/Minimize-/Chevron-Animationen. Keine Regression des Android-Icon-Flapping-Fixes.

## 5. Eigenständiges Synoptik-Premiummenü

Sinnvolle, getrennte Bereiche im vorhandenen Premium-Stil:
1. **Hoch-/Tiefdruckgebiete**: Ein/Aus; H-/T-Symbolik, Druckwerte, Symboldarstellungsoptionen, gespeicherte Hoch- und Tiefdruckfarben aus Wind migriert.
2. **Isobaren**: Ein/Aus; echte GeoJSON-Konturen, Druckbeschriftung, Liniendicke/-farbe, Beschriftungsdichte, Sichtbarkeit und Opazität.
3. **Druckraster**: eigener Schalter/Option und Deckkraft nur bei nachgewiesener unterstützter WR-Quell- und Renderfähigkeit; ohne echte Daten als nicht verfügbar anzeigen, niemals synthetische Karte als READY.
4. **Darstellung/Transparenz**: eigener Synoptik-Layer im gemeinsamen zentralen Transparenzsystem mit Semantik `0 % = unsichtbar` und `100 % = vollständig sichtbar`; dabei getrennte Regler für H/T-Zentren, Isobaren und ggf. Druckraster, sofern die vorhandene Architektur dies ermöglicht.
5. **Quelle/Zeit/Status**: WR-gelieferter Provider, Modelllauf, Gültigkeit, Quelle/Attribution sowie echte `ready`/`unavailable`-Zustände.
6. **Speichern/Zurücksetzen**: eigene Synoptik-Einstellungen updatefest und mit Settings-Vault kompatibel, ohne Windwerte zurückzusetzen.

Statt eines isolierten Synoptik-Transparenzschalters ist **auch die Integration in den existierenden zentralen Transparenzlayer** Pflicht. Alle Synoptik-Sichtbarkeiten sind auf Gesamtschalter, Layer-Schalter und einzelne Opazitäten logisch konsistent abzubilden.

## 6. Fachliche Datenversorgung: nicht länger auf alle Provider warten

- WR-Test 231 liefert real `ready` mit 5 ECCC-GDPS-H/T-Zentren.
- WR-Test 232 liefert real `ready` mit 12 NOAA-GFS-Isobaren.
- WR-Test 233 liefert seit WR 0.10.321 / Loader 324 real `ready` mit DWD ICON-EU WMS-**Descriptor** (nicht automatisch bestätigte GetMap-PNG-Auslieferung).
- WR-Test 234 liefert real `ready` mit index- und GRIB-Signatur-verifizierter ECMWF-IFS-**Dateireferenz**, `decoded:false`; kein automatisch fertiges Rendering.

**Erst die realen H/T- und Isobaren-Geometrien darstellen!** Anschließend ergänzen, soweit technisch verifiziert, DWD-Druckraster und ECMWF-Decoding; sie dürfen keine bereits funktionierende GeoJSON-Visualisierung verzögern. WR entscheidet über Quelle, Datenfreigabe, Zeit/Freshness und Providerpriorität; GR zeichnet ausschließlich autorisierte Daten, ohne eigene 900-s-Grenze. Meteorologisch falsche Ableitung von H/T aus Wind ist verboten.

## 7. Geschützter Stand und Regression

**Geschütztes Paar:** WR 0.10.320 / GR 4.11.195 (HA 0.25.102; Runtime `411195r1`, Modulset `E411-195A1`). Neuere synoptische Quelländerung WR 0.10.321 ist noch keine neue Gesamt-Betreiberreferenz.

Beide Repo-Guards `docs/MODULE_PROVIDER_ISOLATION_GUARD_2026-11-13.md` lesen. Kein Eingriff in OPERA/DWD/NASA-Niederschlag, Wind-Schlangenrenderer inkl. aller Einstellungen, Temperatur, Eye-Aura, Premium-Animation, Einstellungen oder gemeinsame Icon-Positionierung. Sicherstellen, dass die neue fünfte Funktion nicht die bestehenden vier Icons destabilisiert.

Neue eindeutige WR-/GR-/HA-/DRA-Versionsstände und konsistente synchronisierte Frontend-Artefakte nur wenn betroffene installierbare Dateien geändert werden. PROD VM101 unverändert. Quell- und fokussierte UI-/Touch-/Persistenz-/Modulregression selbstständig ausführen, **keine neue 237er-Testserie, keine 474-Dateien-Archivprüfung und keine erneute wissenschaftliche Gesamtprüfung**.

## 8. Definition of Done

- Masteroriginal bleibt bytegleich und eindeutig im Repo; neues Icon erscheint korrekt im Eye-Konfigurator und als einzelner Kartenschalter.
- Short-Tap steuert Gesamt-Synoptik; Long-Press öffnet tatsächlich ein **eigenständiges** Premiummenü mit identischem Metallrahmen, denselben Aktionen und gleichwertiger Touch-Bedienung wie Wind.
- Die bisherigen H/T-Farbcontrols sind aus dem Windmenü verschwunden, gespeicherte `highColor`/`lowColor` in Synoptik migriert, Einstellungen bleiben bei Reload/Update/Reset konsistent.
- Echte WR-GeoJSON-H/T-Zentren und Isobaren sind geografisch korrekt sichtbar, separat schaltbar und in der zentralen Transparenzebene steuerbar.
- Fehler und Nichtverfügbarkeit eines neuen Synoptikproviders haben keinerlei Einfluss auf bestehende Wetterlayer.
- Dokumentierte neue Version(en), Commits, installierbare DEV-Artefakte, fokussierte Regressionen und ehrliche reale Abnahmegrenzen. Betreiber prüft anschließend nur die sichtbare Karten- und Menüfunktion auf DEV VM109.

**Ausführung:** Entwicklungschat soll diese Anforderungen direkt in bestehendem Quellcode realisieren, nicht noch einmal nur analysieren oder planen.
