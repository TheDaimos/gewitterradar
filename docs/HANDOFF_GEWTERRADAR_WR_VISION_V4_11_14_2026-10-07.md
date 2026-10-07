# Übergabe – Gewitterradar V4.11.14 DEV / WeatherRouter-Visualisierung

Stand: **2026-10-07**  
Repository: `TheDaimos/gewitterradar`  
Entwicklungszweig: `feature/v4.11-development`  
DRA-Zweig: `deploy/dev`

## 1. Verbindlicher technischer Code-Checkpoint

Letzter vollständig synchroner Runtime-/DRA-Stand vor dieser Übergabedokumentation:

- `feature/v4.11-development`: `a12c6176b0fafc52ec4119bac668aa4fc4318454`
- `deploy/dev`: `a12c6176b0fafc52ec4119bac668aa4fc4318454`
- Commit: **Refresh V4.11.14 frontend checksums**

Produktidentität:

- Produkt: **V4.11.14 DEV**
- Build: **V4.11.14-DEV-2026-10-07**
- Runtime: **41114r1**
- Modulsatz: **E411-14A1**
- Integration: **0.25.0**

Modulstände:

- `core.manifest` **1.2.85**
- `weather.display-menu` **0.3.1**
- `weather.legend-overlay` **0.1.1**
- `weather.precipitation-layer` **1.3.4**

`main` / V4.10 FINAL bleibt unangetastet.

## 2. Verbindliche Projektdokumentation

Vor Weiterarbeit vollständig lesen:

1. `docs/WR-Vison.md` — Schreibweise **WR-Vison.md** absichtlich beibehalten
2. `docs/RELEASE_NOTES_V4_11_14_DEV.md`
3. diese Übergabe
4. optional zur Vorgeschichte:
   - `docs/RELEASE_NOTES_V4_11_13_DEV.md`
   - `docs/RELEASE_NOTES_V4_11_12_DEV.md`
   - `docs/RELEASE_NOTES_V4_11_11_DEV.md`

## 3. Bereits im HA-Realtest bestätigt

Folgende Punkte wurden vom Nutzer real bestätigt:

- die finalen Entwurf-Nr.-4-Augen sind sichtbar
- Augen-Schaltfläche funktioniert
- schwebendes Darstellungsmenü lässt sich verschieben
- Menü lässt sich minimieren und wieder aufklappen
- Menü zeigt nur tatsächlich durch WeatherRouter erlaubte/verfügbare Darstellungen
- aktuell ist nur Niederschlag verfügbar; entsprechend bleibt die Capability-Liste kurz
- der frühere Fehler, dass das Auf-/Zuklappen des Darstellungsmenüs den Niederschlagslayer sichtbar neu aufbauen ließ, wurde nach V4.11.12 im Realtest als deutlich verbessert bestätigt
- Nutzerfeedback: **„Der Bildaufbau ist nun sooo viel besser und wird nicht mehr gestört!“**

Diese Punkte dürfen bei der weiteren Arbeit nicht regressieren.

## 4. Ursache und Schutzregel des früheren Layer-Neuaufbaus

Der frühere Fehler hatte zwei Ursachen:

1. reine UI-Zustandsänderungen lösten pauschal Raster-Stilaktualisierungen aus
2. optische Rasterstile überschrieben Leaflets eigenes `transform` der Kacheln

Seit V4.11.12 gilt verbindlich:

- Minimieren / Aufklappen → nur UI
- Menü verschieben / Position speichern → nur UI
- Auge aktiv/inaktiv → nur UI
- Legendenmodus → nur Legende
- Transparenz → nur `setOpacity()`
- nur ein echter Stilwechsel Präzise/Ausgewogen/Weich aktualisiert die optische Rasterdarstellung
- niemals `node.style.transform` auf Leaflet-Kacheln
- niemals `transformOrigin` im WeatherRouter-Rasterstil
- keine globalen `touchmove`-Listener
- Android-/Leaflet-Gestenwache in `location.radii-map` nicht beschädigen

## 5. Darstellungsprofile – aktueller Stand und Zielbild

### Präzise

- technische Referenz
- Rasterstruktur bleibt sichtbar
- keine Glättung

### Ausgewogen

- moderate flächige Glättung
- Datenstruktur noch erkennbar
- klarer Abstand zu Präzise

### Weich

Zielbild des Nutzers:

- **keine erkennbare pixelige Struktur mehr**
- Niederschlagsflächen sollen sichtbar ineinanderlaufen
- Außenkanten sollen weich auslaufen
- Farbübergänge sollen flächig wirken
- starke Hotspots / Starkregen- / Ereigniskerne müssen trotzdem klar identifizierbar bleiben
- Daten, Messwerte, Rasterauflösung und Routing bleiben unverändert

V4.11.14 setzt dafür bereits stärkeres Pane-weites Blur plus mehr Sättigung/Kontrast ein:

- `weather.display-menu` 0.3.1
- Weich: stärkere Blur-Radien bei Übervergrößerung
- Hotspot-Erhalt über moderat angehobene Sättigung und Kontrast

**Wichtig:** Dieser V4.11.14-Feinschliff ist nach der letzten Nutzeranforderung noch nicht real abgenommen. Nächster Schritt ist daher zuerst die optische Realabnahme, nicht sofort weitere Parameteränderung.

## 6. Legende – Nutzerfeedback und V4.11.14-Korrektur

Nutzerfeedback zur vorherigen Legende:

- die Leiste war viel zu breit
- die eigentliche vom WeatherRouter gelieferte Legendenabbildung war dagegen winzig
- Nutzerkommentar sinngemäß: „Ein Bild sagt mehr als 1000 Worte“

V4.11.14 enthält bereits die Korrektur in `weather.legend-overlay` **0.1.1**:

- Desktopbreite auf ca. **430 px** begrenzt
- kompakte Kopfzeile mit Titel, Quelle/Zeit, Einheit und Schließen
- eigentliche WR-Legendenabbildung darunter
- Legendenbild deutlich größer
- mehrere aktive Legenden weiterhin stapelbar
- responsive mobile Breiten

**Noch offen:** HA-Realabnahme dieser neuen V4.11.14-Legendenansicht.

Keine Fantasie-Skalen erzeugen. Primär WeatherRouter-`payload.legend` bzw. strukturierte `legend.entries` / `legend.stops` verwenden.

## 7. Transparenz – Einstellungen und Kartenmenü

Verbindliche Nutzerforderung:

Transparenz muss für WeatherRouter-Flächenlayer anpassbar sein, damit darunterliegende Basiskarten/-layer wie OpenStreetMap, Meteo, Earth usw. sichtbar bleiben können.

Architektur:

- persistenter gemeinsamer Zustand `opacities`
- aktuell implementiert: `precipitation`
- vorbereitet für:
  - Wolken
  - Satellitenbilder
  - Schnee
  - Temperatur
  - UV
  - Luftqualität
  - weitere WR-Flächenlayer

Bereits umgesetzt:

- Regler **Niederschlag · Transparenz** in den Einstellungen
- Bereich 0–100 %
- `0 %` = deckend
- `100 %` = unsichtbar
- **WR** setzt Benutzerwert zurück auf die vom WeatherRouter gelieferte Standarddeckkraft
- Änderung wirkt live über `setOpacity()`
- keine WeatherRouter-Neuanfrage
- kein Layer-Neuaufbau
- gemeinsame Zustandsquelle

Zusätzliche letzte Nutzerforderung:

> Transparenz soll auch direkt im schwebenden Darstellungsmenü konfigurierbar sein.

V4.11.14 hat dies bereits umgesetzt:

- Transparenzregler direkt im Niederschlagsblock des schwebenden Darstellungsmenüs
- Regler im Kartenmenü und Einstellungen sind synchron
- ebenfalls mit **WR**-Reset

**Noch offen:** HA-Realabnahme dieser Kartenmenü-Steuerung.

## 8. Unmittelbar nächster Pflicht-Realtest

Zuerst **V4.11.14 DEV über DRA installieren** und exakt diesen Stand testen.

### Test A – Weichprofil

Gleicher Kartenausschnitt / gleiche Radarzeit:

1. Präzise
2. Ausgewogen
3. Weich

Abnahmeziel Weich:

- Raster-/Pixelstruktur weitgehend verschwunden
- Flächen laufen sichtbar ineinander
- Außenkanten wirken weicher
- rote/orange Starkkerne bleiben klar lokalisierbar
- keine geometrischen Kachelfehler
- kein Layer-Neuaufbau durch bloßes Öffnen/Minimieren des Menüs

### Test B – neue kompakte Legende

Prüfen:

- deutlich kompakter als vorher
- keine überbreite Leiste
- WR-Legendenabbildung gut lesbar und deutlich größer
- Titel / Quelle / Zeit / Einheit / Schließen sinnvoll angeordnet
- auf Desktop und Mobil keine Überlagerung mit Zeitachse oder Kartenrand

### Test C – Transparenz im schwebenden Darstellungsmenü

Prüfen:

- Regler sichtbar
- 0 / 25 / 50 / 75 / 100 % testen
- darunterliegende Karte wird entsprechend sichtbar
- Regler in Einstellungen spiegelt den Wert sofort
- Änderung in Einstellungen spiegelt Kartenmenü sofort
- **WR** stellt Provider-Standard wieder her
- keine Ladeanimation / keine neue WR-Anfrage / kein Layer-Neuaufbau

### Test D – Regression / Android

Nach mehrfacher Bedienung:

- Menü öffnen/minimieren/verschieben
- Stil wechseln
- Transparenz ändern
- Legende Auto/Ein/Aus
- Karte verschieben
- Pinch-Zoom
- wieder Karte verschieben

Android-Touch darf nicht wieder in den Zustand geraten, in dem nur noch Zoom möglich ist.

## 9. Nicht ungeprüft verändern

- `location.radii-map` Android-Gestenwache
- Leaflet-Kachel-`transform`
- Consumer API / WeatherRouter Routing
- Providerwahl
- Messwerte / Rasterauflösung / Warnlogik
- finale Augenassets
- `main`
- V4.10 FINAL

## 10. Branch-Regel

Zum Zeitpunkt des technischen Checkpoints waren:

`feature/v4.11-development == deploy/dev == a12c6176b0fafc52ec4119bac668aa4fc4318454`

Diese Übergabedokumentation darf den Entwicklungszweig danach gegenüber `deploy/dev` vorauslaufen lassen.

**deploy/dev nicht automatisch nachziehen**, solange keine ausdrückliche Freigabe für einen neuen DRA-Kandidaten erfolgt.

## 11. Arbeitsweise im Folgechat

- zuerst Repository-HEAD prüfen, da parallele Chats den Zweig weiterentwickelt haben können
- vorhandene V4.11.14-Implementierung nicht blind erneut bauen
- zuerst HA-Realtest des bestehenden V4.11.14-Kandidaten auswerten
- sichtbare neue Iteration nur bei tatsächlicher Codeänderung
- bei jeder Iteration Identität, Runtime, Modulsatz, Module, Mirrors, Build-/Verify-Verträge, Asset-Inventar und SHA-256 konsistent halten
- keine Behauptung „CI grün“, wenn kein Lauf vorliegt

**C.K. – Eine Idee weiter gedacht.**
