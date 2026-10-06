# Project: WR-Vision

> **Projekt:** Gewitterradar V4.11 / WeatherRouter-Visualisierung  
> **Dokumenttyp:** lebendes Planungs-, Übergabe- und Entscheidungsdokument  
> **Repository:** `TheDaimos/gewitterradar`  
> **Entwicklungszweig:** `feature/v4.11-development`  
> **Stand:** 2026-10-06  
> **Ausgangs-HEAD vor Anlage dieses Dokuments:** `8d0d30767d0d30466b4b616d51b3ac5d681b9a93`

---

## 1. Zweck dieses Dokuments

Dieses Dokument hält die gemeinsam ausgearbeitete Vision für die **Darstellung von WeatherRouter-Daten innerhalb von Gewitterradar** vollständig fest.

Es ist ausdrücklich als **mehrchatfähige Projektgrundlage** gedacht. Die Funktion wird voraussichtlich über mehrere Arbeitsphasen und Chats hinweg entstehen. Deshalb enthält dieses Dokument nicht nur die grobe Idee, sondern auch die bereits verfeinerten Bedienwege, Zustände, Abhängigkeiten, Darstellungsprinzipien, Bilddaten und noch offenen Punkte.

Aktuell handelt es sich um eine **Planung/Vision**, nicht um eine bereits umgesetzte Funktion.

---

## 2. Grundidee

Gewitterradar soll WeatherRouter-Daten nicht einfach nur als zusätzliche Layer einblenden, sondern dem Benutzer ermöglichen, die **optische Darstellung** geeigneter Wetter- und Ereignisdaten selbst zu wählen.

Ausgangspunkt war die Beobachtung, dass der aktuelle Niederschlagslayer bewusst rasterartig/pixelig dargestellt wird. Das ist fachlich sauber und zeigt die tatsächliche Rasterstruktur, wirkt aber technisch. Eine deutlich weichere, modernere Darstellung kann visuell attraktiver sein, darf jedoch nicht die fachliche Datenbasis verändern oder eine Genauigkeit vortäuschen, die nicht vorhanden ist.

Daraus folgt:

- Die Daten bleiben unverändert.
- Die Routinglogik des WeatherRouter bleibt unverändert.
- Die gewählte Darstellung ist ausschließlich eine **optische Aufbereitung**.
- Eine geglättete Darstellung ist optional und ersetzt die präzise Rasterdarstellung nicht.
- Der Benutzer entscheidet selbst, welche Darstellungsform er bevorzugt.

Leitsatz:

> **Ohne Daten keine Kekse.**

Die gesamte Funktion ist an WeatherRouter gekoppelt.

---

## 3. WeatherRouter-Abhängigkeit

Die Visualisierungsfunktion ist nur dann wirklich nutzbar, wenn WeatherRouter verfügbar ist und mindestens eine geeignete Darstellungsfähigkeit bereitstellt.

### 3.1 WeatherRouter nicht vorhanden

Wenn WeatherRouter nicht installiert bzw. nicht erkannt wird:

- Es gibt **kein aktives Darstellungsmenü auf der Karte**.
- Es erscheint **kein funktionsloses Augen-Bedienelement auf der Karte**.
- Die Funktion wird in den Einstellungen jedoch bewusst **angeteasert**.
- Der Einstellungsbereich erscheint dort im deaktivierten/Offline-Stil.
- Ein Hinweis erklärt, dass WeatherRouter zur Nutzung benötigt wird.

Beispielinhalt:

> **Darstellungsmenü**  
> Für diese Funktion wird WeatherRouter benötigt.  
> Sobald WeatherRouter verfügbar ist, können hier Niederschlag, Wolken, Wind und weitere geeignete Ebenen optisch angepasst werden.

Damit ist die Funktion sichtbar, ohne dem Benutzer eine wirkungslose Bedienung anzubieten.

### 3.2 WeatherRouter vorhanden, aber nicht erreichbar

Dieser Zustand soll vom Zustand „nicht installiert“ unterscheidbar sein.

In den Einstellungen kann beispielsweise angezeigt werden:

- WeatherRouter erkannt
- derzeit nicht erreichbar / offline
- Darstellungsfunktionen vorübergehend nicht verfügbar

Auf der Karte bleibt das Bedienfeld in diesem Zustand nicht aktiv.

### 3.3 WeatherRouter verfügbar

Wenn WeatherRouter erreichbar ist und geeignete Darstellungsfähigkeiten meldet:

- Der Einstellungsbereich wird vollständig aktiv.
- Das Augen-Bedienelement kann als Kartenbedienung eingeblendet werden.
- Das schwebende Darstellungsmenü steht zur Verfügung.
- Nur tatsächlich sinnvolle/verfügbare Rubriken werden angezeigt.

### 3.4 Keine leeren Rubriken

Das Darstellungsmenü soll **keinen Friedhof ausgegrauter Funktionen** enthalten.

Rubriken werden dynamisch nur dann eingeblendet, wenn die dafür notwendige WeatherRouter-Fähigkeit grundsätzlich verfügbar ist.

Eine kurzfristig leere Einzelantwort oder ein momentan leerer Kartenausschnitt soll jedoch nicht dazu führen, dass die komplette Bedienoberfläche hektisch erscheint und verschwindet. Die Verfügbarkeit soll an die gemeldete Fähigkeit bzw. nutzbare Datenquelle gekoppelt werden, nicht an jedes einzelne leere Rasterbild.

---

## 4. Zwei Bedienebenen

Die Funktion erhält bewusst zwei Bedienebenen:

1. **Einstellungen** – vollständig, dauerhaft und erklärend.
2. **Karte** – schnell, direkt und für häufige Umschaltungen.

Beide Bedienwege greifen auf **dieselben gespeicherten Werte** zu. Es darf keine voneinander unabhängigen Doppelkonfigurationen geben.

Eine Änderung im schnellen Kartenmenü wirkt sofort und wird zugleich als aktueller Zustand gespeichert.

---

## 5. Einstellungen

In den Gewitterradar-Einstellungen wird ein eigener Bereich für die WeatherRouter-Darstellung angelegt.

Arbeitstitel:

- **Darstellung**
- alternativ genauer: **WeatherRouter-Darstellung**

„Darstellung“ ist derzeit der bevorzugte Benutzerbegriff, weil nicht die Datenquelle, sondern nur deren visuelle Aufbereitung verändert wird.

### 5.1 Inhalte des Einstellungsbereichs

Vorgesehen sind mindestens:

- Aktivierung/Deaktivierung des schnellen Darstellungsmenüs auf der Karte
- Standard-Darstellungsstil je geeigneter Rubrik
- Startzustand des schwebenden Menüs: geöffnet oder minimiert
- Position des Menüs merken
- gespeicherte Position zurücksetzen
- Darstellungsoptionen je verfügbarer Rubrik
- **Auf Standard zurücksetzen**
- WeatherRouter-Status bzw. verständlicher Hinweis bei fehlender Verfügbarkeit

### 5.2 Offline-Teaser

Ohne WeatherRouter bleibt dieser Einstellungsbereich sichtbar, aber optisch deaktiviert.

Das geschlossene Auge kann dabei entsättigt bzw. abgedunkelt dargestellt werden. Dafür ist **kein eigenes drittes Bildmotiv** notwendig.

---

## 6. Augen-Symbol als zentrale Bildsprache

Für die Funktion wurde ein eigenes Icon-Paar festgelegt:

- **geschlossenes Auge** = Darstellungsmenü deaktiviert
- **geöffnetes Auge** = Darstellungsmenü aktiviert

Das ist ein bewusstes kleines Gimmick: Der Zustand ist bereits am Symbol erkennbar.

### 6.1 Zustände

Es existieren logisch drei Zustände, aber nur zwei Grundgrafiken:

| Zustand | Darstellung |
|---|---|
| WR nicht verfügbar | geschlossenes Auge, in den Einstellungen deaktiviert/entsättigt; auf der Karte kein aktives Bedienelement |
| WR verfügbar, Menü deaktiviert | normales geschlossenes Auge |
| WR verfügbar, Menü aktiviert | normales geöffnetes Auge |

### 6.2 Benennung der Bilddaten

Festgelegte Familie:

- `help-display-eye-open`
- `help-display-eye-closed`

---

## 7. Augen-Bedienelement auf der Karte

Das Auge wird als eigenes Kartenbedienelement behandelt, ähnlich den bereits konfigurierbaren Elementen wie Kompass oder Medaillon.

Der Benutzer soll entscheiden können, ob dieses Bedienelement auf der Karte sichtbar sein soll.

Damit gibt es zwei Ebenen:

- **Bedienelement anzeigen/verstecken**
- **Darstellungsmenü geöffnet/deaktiviert**

Ist das Bedienelement selbst ausgeblendet, erscheint natürlich weder geöffnetes noch geschlossenes Auge auf der Karte.

---

## 8. Schneller Einstieg über den Layer-Schalter

Zusätzlich zur direkten Kartenplatzierung bekommt die Funktion einen **Schnellzugriff über den Layer-Schalter**.

Der bereits geplante WeatherRouter-Bereich im Layer-Menü bleibt dabei zentral:

- WeatherRouter kann als eigener Bereich im Layer-Menü erscheinen.
- Der Bereich darf sich optisch leicht vom klassischen Layer-Menü absetzen, beispielsweise mit dem bereits diskutierten rötlich-transparenten bis leicht violetten Charakter.
- Darunter können WeatherRouter-Rubriken wie Wetter, Space, Pollen und weitere fachliche Bereiche angeboten werden.
- Innerhalb dieses WeatherRouter-Bereichs erhält **Darstellung** einen direkten Schnellzugriff.
- Dieser Schnellzugriff öffnet bzw. aktiviert das schwebende Darstellungsmenü, ohne dass der Benutzer erst in die Einstellungen wechseln muss.

Damit existieren drei natürliche Zugänge:

1. Einstellungen
2. direktes Augen-Bedienelement auf der Karte
3. Schnellzugriff über Layer-Schalter → WeatherRouter → Darstellung

Der Layer-Schalter ist dabei ein **Schnellzugriff**, nicht die einzige Heimat der Funktion.

---

## 9. Schwebendes Darstellungsmenü auf der Karte

Das Herzstück der schnellen Bedienung ist ein eigenes, modern gestaltetes, schwebendes Kartenmenü.

### 9.1 Grundverhalten

Das Menü soll:

- auf der Karte frei verschiebbar sein
- überall innerhalb des sicheren Kartenbereichs platziert werden können
- seine Position speichern können
- minimierbar/einklappbar sein
- wieder aufklappbar sein
- auf Desktop, Tablet und Mobilgeräten funktionieren
- nicht dauerhaft unnötig Kartenfläche blockieren
- optisch zum bestehenden Gewitterradar passen

### 9.2 Minimierter Zustand

Im minimierten Zustand bleibt nur ein sehr kompakter Bedienkopf bzw. das Augen-Symbol sichtbar.

Der Benutzer kann das Menü jederzeit wieder aufklappen.

Die Minimierung ist etwas anderes als die vollständige Deaktivierung:

- **minimiert** = Funktion weiterhin aktiv, Menü nur platzsparend zusammengeklappt
- **deaktiviert** = geschlossenes Auge, schwebendes Menü nicht aktiv

### 9.3 Verschieben

Das aufgeklappte Menü soll an einer klaren Griff-/Kopfzone verschoben werden können.

Wichtig für Mobilgeräte:

- Verschieben des Menüs darf nicht mit Karten-Zoom/Pan kollidieren.
- Touch-Ereignisse müssen sauber auf Menü und Karte getrennt werden.
- Das Menü darf nicht außerhalb des sichtbaren Bereichs „verloren“ gehen.

### 9.4 Positionsspeicherung

Wenn der Benutzer das Menü verschiebt, soll die Position gespeichert werden können.

Zusätzlich ist ein Rücksetzen auf eine definierte Standardposition vorzusehen.

---

## 10. Aufbau des schwebenden Menüs

Das Menü wird in kleine, leicht erfassbare **Rubriken** unterteilt.

Wichtig: Nicht jede Rubrik erhält zwanghaft dieselben Darstellungsmodi.

Jede Datenart bekommt nur die Darstellungsformen, die fachlich und visuell sinnvoll sind.

Die Rubriken sollen dynamisch mit den verfügbaren WeatherRouter-Fähigkeiten wachsen.

Beispielhafte Rubriken:

- Niederschlag
- Wolken
- Temperatur / Hitze / Kälte
- Wind
- Warnungen
- Ereignisse
- später weitere geeignete WeatherRouter-Fachbereiche

Nicht verfügbare Rubriken werden nicht angezeigt.

---

## 11. Darstellungsstile – Grundprinzip

Für raster- bzw. flächenbasierte Layer entstand als Ausgangsidee eine einfache Dreiteilung:

### Präzise

- möglichst originalgetreue Darstellung
- Rasterstruktur bleibt sichtbar
- technisch, direkt, nachvollziehbar
- höchste Nähe zum gelieferten Raster

### Ausgewogen

- leichte Glättung
- sanftere Übergänge
- moderneres Erscheinungsbild
- Datenstruktur bleibt weiterhin erkennbar
- wahrscheinlich der interessanteste Kompromiss zwischen Fachlichkeit und Optik

### Weich

- starke optische Glättung
- fließende Übergänge
- moderner, ruhiger und stärker „App-artiger“ Eindruck
- ausdrücklich nur Darstellungseffekt

**Weich** soll nicht als zwangsläufiger Standard gesetzt werden.

Der endgültige Standard zwischen **Präzise** und **Ausgewogen** ist noch festzulegen.

---

## 12. Vorgesehene Darstellungslogik je Datentyp

### 12.1 Niederschlag

Vorgesehene Auswahl:

- Präzise
- Ausgewogen
- Weich

Der aktuelle rasterartige Niederschlag ist ausdrücklich eine gültige und fachlich saubere Darstellungsform und bleibt erhalten.

### 12.2 Gefrierender Regen / Glätte

Geeignete Varianten können sich an Niederschlag orientieren, müssen aber Warncharakter und Lesbarkeit erhalten.

Mögliche Richtung:

- Präzise
- Ausgewogen
- Weich bzw. Warnfokus

Die endgültigen Bezeichnungen werden erst mit realen WR-Daten optisch abgenommen.

### 12.3 Wolken

Wolken dürfen stärker flächig bzw. weich wirken.

Mögliche Richtung:

- Klar
- Ausgewogen
- Weich

### 12.4 Temperatur / Hitze / Kälte

Hier sind andere Darstellungen sinnvoller als ein reiner Weichzeichner.

Mögliche Richtung:

- Konturen
- Fläche
- Weich

### 12.5 Wind

Wind soll **nicht einfach als weiterer bunter Flächenlayer** behandelt werden.

Geeignete visuelle Ansätze:

- Pfeile
- Strömungslinien
- reduzierte Darstellung

Animierte oder dezente Strömungslinien wurden als besonders interessante Richtung angesehen.

### 12.6 Warnungen

Warngebiete sollten nicht weichgespült werden.

Sinnvoller sind:

- klare Polygone
- transparente Flächen
- definierte Konturen
- Gefahrenstufe über Farbe/Intensität

Mögliche Bedienvarianten:

- Klar
- Hervorgehoben
- Dezent

### 12.7 Ereignisse / Punktdaten

Beispielsweise:

- Erdbeben
- Vulkane
- Tornados
- weitere Einzelereignisse

Geeignete Darstellung:

- normale Marker
- kompakte Marker
- hervorgehobene Marker

---

## 13. Kleine Darstellungsgrammatik statt unendlich vieler Einzelstile

Langfristig soll Gewitterradar nicht für jeden WeatherRouter-Dienst eine komplett neue visuelle Sprache erfinden.

Die Daten werden vielmehr wenigen grundlegenden Darstellungsfamilien zugeordnet:

### Flächendaten

Beispiele:

- Niederschlag
- Wolken
- Temperatur
- UV
- Luftqualität

Darstellung:

- Raster
- Flächen
- sanfte Übergänge

### Bewegungsdaten

Beispiel:

- Wind

Darstellung:

- Pfeile
- Partikel
- Strömungslinien

### Gefahrengebiete

Beispiele:

- amtliche Warnungen
- Sturmgebiete
- Tornadogebiete
- Hochwasserwarnungen

Darstellung:

- transparente Polygone
- klare Umrandung
- Gefahrenstufe

### Punktereignisse

Beispiele:

- Erdbeben
- Vulkane
- einzelne Ereignisse

Darstellung:

- Symbole
- Marker
- Priorisierung/Hervorhebung

---

## 14. Visuelle Hierarchie auf der Karte

WeatherRouter darf die eigentliche Gewitterradar-Logik nicht optisch verdrängen.

Die wichtigsten Benutzerbezüge müssen weiterhin klar über allgemeinen Wetterinformationen liegen:

- Tracker
- gespeicherte bzw. überwachte Orte
- aktive Gefahrenbezüge
- Gewitter-/Beobachtungsradien
- relevante Blitz-/Gewitterinformationen
- unmittelbar nutzerbezogene Warnungen

Allgemeine WeatherRouter-Flächen dürfen darunter liegen und diese Elemente nicht verdecken.

Der aktuelle Niederschlagslayer ist dafür eine gute Referenz: großflächige Wetterinformation im Hintergrund, scharfe Gewitterradar-Informationen darüber.

---

## 15. Fachliche Ehrlichkeit der Glättung

Eine geglättete Darstellung darf niemals so kommuniziert werden, als wäre sie eine genauere Datenquelle.

Im Hilfetext soll klar erläutert werden:

> **Präzise** zeigt die Daten möglichst originalgetreu.  
> **Ausgewogen** verbessert die Lesbarkeit mit sanfter Glättung.  
> **Weich** glättet Übergänge stärker und verändert nur die optische Darstellung.

Wichtig:

- Messwerte bleiben identisch.
- Rasterauflösung bleibt identisch.
- Routing bleibt identisch.
- Warnstatus bleibt identisch.
- Nur die Visualisierung ändert sich.

---

## 16. Dynamisches Verhalten des Menüs

Das schwebende Menü soll sich automatisch an die vorhandenen Fähigkeiten anpassen.

Beispiele:

- Kein Winddienst verfügbar → keine Wind-Rubrik.
- Keine geeigneten Temperaturdaten → keine Temperatur-Rubrik.
- Nur Niederschlag vorhanden → kleines Menü nur mit Niederschlag.
- Später weitere WR-Dienste → Menü wächst kontrolliert mit.

Damit bleibt die Oberfläche auch dann kompakt, wenn WeatherRouter langfristig sehr viele Provider und Fähigkeiten enthält.

---

## 17. Speicherung und Rücksetzen

Die folgenden Werte sollen dauerhaft gespeichert werden können:

- Darstellungsstil pro Rubrik
- Sichtbarkeit des Augen-Bedienelements
- aktiviert/deaktiviert
- minimiert/aufgeklappt
- Position des schwebenden Menüs

Zusätzlich:

- **Auf Standard zurücksetzen**
- Position separat zurücksetzen können

Die genaue Speicherstruktur wird erst bei der Implementierung festgelegt.

---

## 18. Desktop, Tablet und Mobilgerät

Die Funktion muss von Anfang an responsiv gedacht werden.

### Desktop

- frei verschiebbares Menü
- ausreichend Platz für mehrere Rubriken
- schnelle Mausbedienung

### Tablet

- genügend große Berührungsflächen
- Verschieben ohne Kartenkonflikte
- minimierter Zustand besonders wichtig

### Mobilgerät

- sehr kompakter Aufbau
- Rubriken gegebenenfalls untereinander
- große Berührungsziele
- kein unbeabsichtigtes Karten-Zoomen beim Bedienen/Verschieben
- niemals außerhalb des sichtbaren Bereichs speicherbar

Die zuletzt beobachteten Android-Touch-Probleme im Gewitterradar sind bei dieser Funktion ausdrücklich als Risikopunkt mitzudenken.

---

## 19. Stil des schwebenden Menüs

Das Menü soll modern wirken, aber weiterhin eindeutig zu Gewitterradar gehören.

Gewünschte Richtung:

- dunkler Hintergrund
- hochwertige, leicht transparente Flächen
- goldene/warme Gewitterradar-Akzente
- klare aktive Zustände
- keine optische Überladung
- kompakte Rubriken
- gute Lesbarkeit auf bewegtem Kartenhintergrund

Der WeatherRouter-Schnellzugriff im Layer-Menü darf sich zusätzlich mit einem dezenten rötlich-transparenten bis leicht violetten Charakter von den klassischen Kartenlayern absetzen.

---

## 20. Hilfe & Hinweise

Wenn die Funktion implementiert wird, gehört sie zusätzlich in **Hilfe & Hinweise**.

Vorgesehener eigener Abschnitt:

- Bedeutung geöffnetes/geschlossenes Auge
- Unterschied Einstellungen / Schnellmenü
- WeatherRouter-Abhängigkeit
- Erklärung Präzise / Ausgewogen / Weich
- Hinweis, dass Glättung nur die Darstellung verändert
- Verschieben und Minimieren
- Position zurücksetzen
- Verhalten bei nicht verfügbarem WeatherRouter

Das neue Augen-Icon passt bewusst in die bestehende Premium-Hilfeicon-Familie.

---

# 21. Festgelegte Bildsprache des Augen-Icons

Nach mehreren Entwürfen wurde **Ausgangsbasis Nr. 4** ausgewählt.

Gewünschte Eigenschaften:

- hochwertiges Gold-/Bronze-Medaillon
- dunkle, nahezu schwarze Innenfläche
- warme Lichtreflexe
- plastische metallische Darstellung
- geöffnetes Auge mit ausgearbeiteter Iris
- geschlossenes Auge mit elegantem Lid und fünf Wimpernelementen
- frontal
- freigestellt
- als zusammengehöriges Paar

Wichtig: Die später erzeugten Einzelassets wurden als separate, freigestellte Fassungen aus dem akzeptierten Nr.-4-Stil abgeleitet.

---

## 22. Kanonische Bilddaten – akzeptierte Fassung

Die akzeptierten Einzelmaster liegen als transparente PNG-Bilddaten vor.

### 22.1 Offenes Auge

Datei:

`help-display-eye-open-master-1254.png`

Eigenschaften:

- 1254 × 1254 Pixel
- RGBA
- transparenter Hintergrund
- PNG
- Dateigröße: 1.697.307 Byte
- Alpha-Bereich: 0–255
- SHA-256:

`e6e5ea0ed5de3fd674088c99e6edf5dc68a5381ba56c1e16521b499380e74098`

### 22.2 Geschlossenes Auge

Datei:

`help-display-eye-closed-master-1254.png`

Eigenschaften:

- 1254 × 1254 Pixel
- RGBA
- transparenter Hintergrund
- PNG
- Dateigröße: 1.654.280 Byte
- Alpha-Bereich: 0–255
- SHA-256:

`db78b467fb2dc91bb469390b68bb98968e615d6f721f98a743394ab4dd50d49f`

Diese Hashes dienen als Identitätsprüfung. Eine spätere Ablage im Repository soll damit verifiziert werden können.

---

## 23. Erzeugte PNG-Ableitungen

Aus den akzeptierten 1254×1254-Mastern wurden folgende PNG-Größen vorbereitet.

Die PNG-Kompression selbst ist **verlustfrei**. Das Herunterskalieren ist naturgemäß eine Neuberechnung der Pixel und deshalb keine bitidentische „verlustfreie Verkleinerung“ des Bildinhalts. Für die Skalierung wurde hochwertiges LANCZOS-Resampling verwendet.

### Offenes Auge

| Datei | Größe | SHA-256 |
|---|---:|---|
| `help-display-eye-open-512.png` | 512×512 | `7b9d451df1354bedc8a6e196411c787c2f767cb912098b91722ec84a5c42a2b8` |
| `help-display-eye-open-256.png` | 256×256 | `02e7d618e057a16f8f7e80cfb6af7111ba04a657238eff3f3806fea9b13b3f24` |
| `help-display-eye-open-@4x-136.png` | 136×136 | `78ff501e77c7969ec69ec96e9149913692d4d53c4b800cf131090af32f582066` |
| `help-display-eye-open-@2x-68.png` | 68×68 | `b9dbb76cc029b4539b5d3059d27c35d49d60d31f50d1970fdb30b7be3ec9269a` |
| `help-display-eye-open-34.png` | 34×34 | `b0f01381ad91505c80e321074c0cfdb606c18496bdcf2c3ff9642c0c10e53abc` |

### Geschlossenes Auge

| Datei | Größe | SHA-256 |
|---|---:|---|
| `help-display-eye-closed-512.png` | 512×512 | `cef4ac18ad2adbc249515f6b366b83b411c46816e6231df037b341122b6917aa` |
| `help-display-eye-closed-256.png` | 256×256 | `0c537a805fd4a37af80d9d99d4765c6ee43da5215817a11cce4f3b7edb51ce4b` |
| `help-display-eye-closed-@4x-136.png` | 136×136 | `e92e2920cfe449c72b334989528b176c89c00dd2cbeb0354a60a7d05fcc21047` |
| `help-display-eye-closed-@2x-68.png` | 68×68 | `4f6eddd0a564ebbf7cc6ea4e876af88f1f1fa45b0d436daa1120bf32cb2e8ee6` |
| `help-display-eye-closed-34.png` | 34×34 | `c334d95a818313e19da7110b415af944e2c5c74ecf31d2764ce29eab727111f5` |

### Retina-Ziel

Für eine Darstellung von 34×34 CSS-Pixeln ist mindestens vorgesehen:

- 34×34 = 1×
- 68×68 = 2× Retina
- 136×136 = 4× Retina

Zusätzlich stehen 256×256 und 512×512 für größere Darstellungen bzw. Auswahloberflächen zur Verfügung.

---

## 24. Asset-Paket

Die vorbereiteten Bilddaten wurden in einem Paket zusammengeführt:

`gewitterradar-help-display-eye-assets.zip`

Struktur:

```text
gewitterradar-help-display-eye-assets/
├── hires/
│   ├── help-display-eye-open-master-1254.png
│   └── help-display-eye-closed-master-1254.png
├── runtime/
│   ├── help-display-eye-open-34.png
│   ├── help-display-eye-open-@2x-68.png
│   ├── help-display-eye-open-@4x-136.png
│   ├── help-display-eye-open-256.png
│   ├── help-display-eye-open-512.png
│   ├── help-display-eye-closed-34.png
│   ├── help-display-eye-closed-@2x-68.png
│   ├── help-display-eye-closed-@4x-136.png
│   ├── help-display-eye-closed-256.png
│   └── help-display-eye-closed-512.png
└── ASSET_MANIFEST.json
```

Das Manifest enthält Auflösung, RGBA-Modus, Dateigröße, Alpha-Bereich und SHA-256 für alle vorbereiteten Dateien.

---

## 25. Geplante Repository-Ablage der Bilddaten

Die Bilddaten sind aktuell vorbereitet, aber die Binärdateien wurden zum Zeitpunkt der Erstellung dieses Dokuments **noch nicht in GitHub committed**.

Geplantes Vorgehen:

### Entwicklungszweig

Zunächst Ablage auf:

`feature/v4.11-development`

Kanonische Master:

`artwork/help-icons/hires/`

Vorgesehene Namen:

- `artwork/help-icons/hires/help-display-eye-open-master-1254.png`
- `artwork/help-icons/hires/help-display-eye-closed-master-1254.png`

Für Laufzeit-/Retina-Ableitungen ist eine saubere feste Ablagestruktur zu wählen, bevor die Funktion implementiert wird.

Naheliegend ist eine eigene Runtime-Ablage innerhalb der Help-Assets bzw. die direkte Bereitstellung in den Frontend-Assets, abhängig davon, wie die Einbindung umgesetzt wird.

### Hauptzweig

Die Hi-Res-Master sollen später bei der regulären Promotion ebenfalls dauerhaft im Hauptzweig erhalten bleiben.

Sie dürfen nicht durch kleine Runtime-Bilder ersetzt werden.

### Asset-Retention

Da die bestehenden Premium-Hilfeicons überwiegend als SVG-Hi-Res-Master geführt werden, die Augen jedoch als detaillierte Raster-Master vorliegen, gilt:

- den originalen 1254×1254-Master dauerhaft erhalten
- nicht künstlich auf 2048×2048 hochskalieren und diese Ableitung als „Original“ ausgeben
- kleinere Laufzeitbilder immer nur als Ableitungen behandeln
- Retentionsrichtlinie/Prüfung später um diese Master ergänzen

---

## 26. Geplante Umsetzung in Etappen

Die Funktion sollte nicht als ein großer unkontrollierter Umbau umgesetzt werden.

Sinnvolle Reihenfolge:

### Phase A – Daten-/Fähigkeitsprüfung

- festlegen, welche WR-Fähigkeiten visualisierbar sind
- Verfügbarkeitsschnittstelle definieren
- Zustände „nicht vorhanden / offline / verfügbar“ sauber unterscheiden

### Phase B – Einstellungen und Status

- Einstellungsbereich
- Offline-Teaser
- WeatherRouter-Status
- gespeicherte Darstellungswerte

### Phase C – Augen-Bedienelement

- Kartenbedienelement
- geöffnet/geschlossen
- Auswahl wie Kompass/Medaillon
- Position/Verhalten auf Mobilgeräten

### Phase D – schwebendes Menü

- auf-/zuklappen
- minimieren
- verschieben
- Position speichern
- Rücksetzen

### Phase E – erster echter Datentyp

Als erster Realtest bietet sich **Niederschlag** an, weil dafür bereits funktionierende Daten und eine bestehende optische Referenz vorhanden sind.

Umsetzung:

- Präzise
- Ausgewogen
- Weich

### Phase F – weitere WR-Datentypen

Erst nach Realabnahme der Menü-/Darstellungslogik:

- Wolken
- Temperatur
- Wind
- Warnungen
- Ereignisse
- weitere geeignete Fähigkeiten

### Phase G – Layer-Schalter-Schnellzugriff

- WeatherRouter-Bereich anbinden
- Darstellung-Schnellzugriff
- konsistente Zustände mit direktem Kartenauge und Einstellungen

---

## 27. Abnahmekriterien

Die Funktion ist erst dann als sauber integriert anzusehen, wenn mindestens folgende Punkte erfüllt sind:

- Ohne WeatherRouter keine funktionslose Kartenbedienung.
- Einstellungen teasern die Funktion verständlich an.
- WeatherRouter offline wird von „nicht installiert“ unterschieden.
- Augen-Symbol wechselt korrekt zwischen offen/geschlossen.
- Kartenmenü ist frei verschiebbar.
- Kartenmenü kann minimiert und wieder aufgeklappt werden.
- Position geht auf Mobilgeräten nicht außerhalb des sichtbaren Bereichs verloren.
- Touch-Gesten der Karte bleiben funktionsfähig.
- Schnellzugriff über den Layer-Schalter funktioniert.
- Änderungen aus Einstellungen und Kartenmenü bleiben synchron.
- Darstellungsstile ändern keine Mess-/Routingdaten.
- Nicht verfügbare Rubriken werden nicht als graue Leereinträge angezeigt.
- Tracker, Orte, Gefahrenbezüge und Gewitterradar-Kernelemente bleiben visuell priorisiert.
- Hi-Res-Augen-Master bleiben dauerhaft erhalten.
- mindestens 2×-Retina-Ableitungen stehen für kleine Karten-/Hilfeicons bereit.

---

## 28. Fest entschieden

Bereits festgelegt:

- WeatherRouter ist Voraussetzung für die aktive Kartenfunktion.
- In den Einstellungen wird die Funktion auch ohne WR sichtbar angeteasert.
- Auge offen = Menü aktiv.
- Auge geschlossen = Menü deaktiviert.
- ohne WR auf der Karte keine wirkungslose Bedienung.
- eigenes schwebendes Darstellungsmenü.
- Menü frei verschiebbar.
- Menü minimierbar und aufklappbar.
- Position soll gespeichert werden können.
- Schnellzugriff über den WeatherRouter-Bereich des Layer-Schalters.
- dauerhafte Einstellungen plus schneller Kartenzugriff.
- dynamische Rubriken nach WR-Verfügbarkeit.
- nicht jede Datenart erhält dieselben Darstellungsoptionen.
- Niederschlag erhält mindestens eine präzise und eine weichere Darstellungsrichtung.
- Ausgangsbasis für die Augen ist der akzeptierte **Entwurf Nr. 4**.
- Bildfamilie heißt `help-display-eye-*`.
- 2× Retina ist Mindestanforderung für kleine Darstellungen.
- Hi-Res-Master bleiben erhalten und werden später mit in den Hauptzweig promoviert.

---

## 29. Noch offen / bewusst erst mit Realtest entscheiden

Noch nicht endgültig festgelegt:

- endgültiger Standard: **Präzise** oder **Ausgewogen**
- endgültige Namen einzelner Darstellungsstile je Rubrik
- exakte Größe und Standardposition des schwebenden Menüs
- genaue Anordnung der Rubriken
- genaue Laufzeit-Ablage der PNG-Ableitungen
- technische Glättungsmethode je Raster-/Canvas-/Tile-Darstellung
- Animation/Partikeldarstellung bei Wind
- finale Farbe und Intensität des WeatherRouter-Bereichs im Layer-Menü
- Verhalten bei sehr vielen gleichzeitig verfügbaren WR-Rubriken
- ob einzelne Rubriken später eigene Favoriten/Schnellprofile erhalten

Diese Punkte sollen nicht theoretisch „fertig erfunden“, sondern mit echten WeatherRouter-Daten optisch abgenommen werden.

---

## 30. Fortsetzung in späteren Chats

Bei einer Chatübergabe ist dieses Dokument die zentrale Referenz für das Vorhaben.

Empfohlener Einstieg in einem Folgechat:

> **Bootstrap: Daimos**  
> **Projekt: Gewitterradar**  
> **Vorhaben: WeatherRouter-Visualisierung / Darstellungsmenü**  
> Lies zuerst vollständig `docs/WR-Vison.md` und setze die Planung bzw. Umsetzung exakt von dort fort. Keine bereits festgelegten Bedienwege oder Asset-Entscheidungen neu erfinden.

Neue Entscheidungen sollen anschließend wieder in dieses Dokument eingepflegt werden, damit die Vision über mehrere Chats konsistent bleibt.

---

## 31. Implementierungsstand V4.11.09 DEV

Die Umsetzung wurde am 2026-10-06 auf `feature/v4.11-development` begonnen.

### Technische Modulgrenze

Die Visualisierungssteuerung erhält bewusst ein eigenes Modul:

- `weather.display-menu` **0.1.1**
- Datei: `frontend/modules/weather/display-menu.js`
- persistenter gemeinsamer Zustand unter `gewitterradar:weather-display:v1`

Das Modul ist Eigentümer von Darstellungszustand, Einstellungen, Augen-Bedienelement, schwebendem Menü, Minimierung, Drag/Position und Darstellungsstil. Die eigentlichen Datenrenderer bleiben weiterhin in ihren Fachmodulen; Niederschlag bleibt in `weather.precipitation-layer`.

### WeatherRouter-Zustände

Der Consumer unterscheidet nun einen fehlenden Consumer-Endpunkt (`integration_not_installed`) von sonstigen Discovery-/Transportfehlern (`discovery_unreachable`). Damit kann die Oberfläche „nicht installiert“ von „vorhanden bzw. erreichbar gewesen, momentan nicht verfügbar“ trennen, ohne eine zweite WeatherRouter-Erkennung einzuführen.

### Temporäre Augen-Platzhalter

Bis die bereits abgenommenen PNG-Dateien in das Repository geladen werden, verwendet `weather.display-menu` ausschließlich klar markierte Inline-SVG-Platzhalter (`data-weather-display-eye-placeholder`). Diese Platzhalter sind **nicht** die finale Bildsprache und dürfen die dokumentierten Entwurf-Nr.-4-Master nicht ersetzen.

Nach Bereitstellung werden die Platzhalter gegen die kanonischen Dateien ausgetauscht und die Master-Hashes aus Abschnitt 22 geprüft.

### Touch-/Drag-Entscheidung

Das schwebende Menü verwendet Pointer Events und Pointer Capture ausschließlich an seiner Griffzone. Die Griffzone besitzt `touch-action:none`; normale Schaltflächen bleiben bei `touch-action:manipulation`. Es werden keine globalen `touchmove`-Listener eingeführt. Das schützt die bestehende Android-/Leaflet-Gesten-Selbstheilung vor einer zweiten konkurrierenden Touch-Logik.

Die gespeicherte Position wird normiert (0..1) und beim Rendern immer auf den tatsächlich sichtbaren Kartenbereich begrenzt. Dadurch kann das Menü nach Größen-, Geräte- oder Vollbildwechseln nicht außerhalb des sichtbaren Kartenbereichs verloren gehen.

### Erste Darstellungsfamilie

Niederschlag ist der erste angeschlossene Renderer. Die Zustände sind:

- `precise` → Präzise
- `balanced` → Ausgewogen
- `soft` → Weich

Die Umschaltung verändert ausschließlich CSS-Eigenschaften der gerenderten Rasterbilder. Consumer-Request, Capability, Tile-URL, Messwerte, Rasterauflösung, Routing und Warnstatus werden nicht verändert.

Der Standard bleibt in dieser ersten Implementierung **Präzise**, weil dies dem bisherigen Verhalten am nächsten kommt. Die endgültige Entscheidung „Präzise oder Ausgewogen“ bleibt weiterhin ein Realtest-Punkt.

### Noch ausstehend

- echte Entwurf-Nr.-4-Augenassets einspielen und Hashes prüfen
- visuelle Realabnahme der drei Niederschlagsstile
- Android/iPad/Desktop-Realabnahme von Drag, Minimieren, Karten-Pan und Pinch-Zoom
- weitere Darstellungsfamilien erst nach dieser Abnahme anschließen

---

**C.K. – Eine Idee weiter gedacht.**
