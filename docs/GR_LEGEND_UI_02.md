# GR-LEGEND-UI-02 · 2026-11-06

WR 0.10.290 DEV / Loader 293; GR 4.11.143 DEV / HA 0.25.50.
Kanonische Arbeit ausschließlich deploy/dev; keine privaten Actions.

## Vergleich und Entscheidung

DWD GetStyles am 06.11.2026 erneut gelesen:
https://maps.dwd.de/geoserver/dwd/wms?service=WMS&request=GetStyles&version=1.1.1&layers=dwd:Niederschlagsradar
SLD SHA256 c8cc8ccbc7da636f1f56e7ab923b6ffd6419b5a046be9eeee360ac5b809bb61f.
17 Einträge: keine Daten, transparent/trocken, 15 Niederschlagsfarben.
OPERA bisher 13, künftig 15 Niederschlagsklassen. Die zwei zusätzlichen Grenzen
0.2 und 0.4 mm/h unterscheiden schwachen Niederschlag. Ab1 mm/h sind die
nominalen Grenzen bereits gleich; dort werden keine zusätzlichen Grenzen erfunden.

Die Priorität C des Auftrags (abgenommene Grün–Dunkelrot-Charakteristik) bestimmt
die Farbwahl. Die ebenfalls genannte Vorliebe für DWD-Türkis/Violett/Blau wird
bei der DWD-Originallegende erhalten, aber nicht als stillschweigende Ablösung
der ausdrücklich zu bewahrenden OPERA-Referenz interpretiert.

| Nominaler Bereich mm/h | DWD Original | OPERA bisher | OPERA neu |
|---|---|---|---|
| 0.1–<0.2 | #33ffff | #019934 | #9ae6a5 |
| 0.2–<0.4 | #1acc9a | #019934 | #46bf68 |
| 0.4–<1 | #019934 | #019934 | #019934 |
| 1–<2 | #4db31b | #4db31b | #4db31b |
| 2–<3 | #99cc01 | #99cc01 | #99cc01 |
| 3–<5 | #cce601 | #cce601 | #cce601 |
| 5–<7.5 | #ffff01 | #ffff01 | #ffff01 |
| 7.5–<10 | #ffc401 | #ffc401 | #ffc401 |
| 10–<15 | #ff8901 | #ff8901 | #ff8901 |
| 15–<30 | #ff4501 | #ff4501 | #ff4501 |
| 30–<45 | #fe0000 | #fe0000 | #fe0000 |
| 45–<75 | #e5004c | #b20000 | #b20000 |
| 75–<100 | #cc0098 | #8b0000 | #8b0000 |
| 100–<150 | #6600cb | #6e0000 | #6e0000 |
| ≥150 | #0000fe | #500000 | #500000 |

OPERA färbt weiterhin alle positiven gültigen Werte: auch >0 bis<0.1 mm/h
erhalten das erste Hellgrün. DWD ist dort weitgehend transparent. Kein Messwert
wird erhöht, gekappt oder aus RGB rekonstruiert. NoData/Undetect/NaN/Inf und
Null bleiben transparent. Volles Pixelalpha und die bestehende Layerdeckkraft bleiben.

Die beiden neuen Grüntöne unterscheiden sich in Helligkeit und Sättigung deutlich
vom bisherigen Grün. Die ursprünglichen Dunkelrottöne besitzen geringeren
Farbtonkontrast als DWDs Rot–Violett–Blau, behalten aber die abgenommene Folge.
Das ist eine begründete Darstellungsentscheidung, keine neue wissenschaftliche
Freigabe oder Behauptung über optimale menschliche Farberkennung.

Die nominalen mm/h-Grenzen stammen aus DWD-Legendenlabels. Die SLD-quantities
0.008,0.017,0.033,0.083,0.167,0.250,0.417,0.625,0.833,1.250,2.500,3.750,
6.250,8.333,12.500,25.000 sind gerundete Fünf-Minuten-Mengen. ×12 ergibt
z.B. .096/.204/.396/.996 statt der beschrifteten .1/.2/.4/1. Diese gerundeten
Mengen werden nicht unverändert als RATE-mm/h-Grenzen eingesetzt. Die wirkliche
DWD-WMS-Legende kommt weiter direkt vom Dienst und beschreibt dessen Stil.

## Daten und Legende

Numerische Auflösung folgt der jeweiligen ODIM-Kalibrierung gain/offset, nicht
der Zahl von Farbstufen. Mehr Farben bedeuten keine höhere Messgenauigkeit.
Die Dekodierung raw*gain+offset und die wissenschaftliche Grundlage bleiben
unverändert; TEST69 wird nicht geändert oder wiederholt.

OPERA: rate_legend erzeugt die Metadaten direkt aus der Renderer-Tabelle;
WR V2 liefert sie im bereits vorhandenen legend-Objekt. Keine API-Version,
Providerwahl, Zeitpolitik, Transport- oder Kacheländerung. GR zeigt diese Daten
unverändert. Historische WR289-Frames ohne Einträge erhalten die passende alte
13-Farben-Referenz, niemals die neue Tabelle. Ein ohne aktive Quellen zeigt eine
aus der aktuellen WR-Tabelle generierte Referenz. Das ist keine Rasterumfärbung.

DWD: Im vorhandenen Consumerpfad sind eingefärbte WMS-Raster verfügbar, keine
numerischen Zellen. Es gibt hier keinen verifizierten numerischen DWD-Renderer
und keinen freigegebenen gemeinsamen serverseitigen WMS-Stil. Deshalb bleiben
Datenquelle und Kacheln unverändert. Das Overlay zeigt die vom WR gelieferte
DWD-Originallegende, für den bekannten Niederschlagsradar-Layer nötigenfalls
GetLegendGraphic direkt vom selben Dienst. Andere Provider bekommen ihre eigenen
Metadaten; fehlende Angaben werden nicht durch eine erfundene OPERA-Skala ersetzt.
Bei gemischten Mosaiken sind alle jeweiligen Skalen in derselben bestehenden
Legendenverwaltung sichtbar. Eine gemeinsame Verwaltung bedeutet keine falsche
Behauptung identischer Rasterfarben.

## UI, Nachweise und Referenz

Eye-Menü, Auto/Ein/Aus, gespeicherter Maus-/Touch-Drag und relative Kartenposition
aus UI-01 bleiben erhalten. Alle Intervalle sind ausgeschrieben; mobil drei,
Desktop fünf Spalten, bei Platzmangel scrollt das vorhandene Overlay innerhalb
der Karte. Keine Änderung an Weich/Ausgewogen/Präzise, Blitzortung oder Rasterfiltern.

Unveränderte Ausgangstags: WR v0.10.289-dev (29aa35ac), GR v4.11.141-dev (bf6d9e12).
UI-01 v4.11.142-dev (274cb03c) wird fortgeführt. Keine Tags oder Referenzen ersetzt.
Beide DEV-Pakete auf VM109 installieren, HA neu starten und GR vollständig neu
laden. Die neue visuelle Realabnahme steht aus; VM101 blieb unangetastet.
Technische Checks sind gezielt auf Palette, Metadatentransport und Legenden-UI
beschränkt. Bestehende öffentliche Push-Prüfungen bleiben aktiv, keine privaten.
