# Gewitterradar V4.11.22 DEV

Stand: **2026-10-07**

## Auto reagiert jetzt tatsächlich auf die Zoomstufe

Der Realtest von V4.11.21 zeigte, dass die Auto-Kennlinie zwar korrekt berechnet wurde, beim Zoomen aber nicht erneut auf die bereits gerenderte Wetterebene angewendet wurde. Dadurch blieb die Darstellung über mehrere Zoomstufen nahezu gleich.

V4.11.22 ergänzt deshalb einen eigenen `zoomend`-Trigger für den Auto-Modus:

- bei jeder abgeschlossenen Zoomänderung wird ausschließlich die optische Aufbereitung neu berechnet
- keine neue WeatherRouter-Anfrage
- kein Layer-Neuaufbau
- keine Änderung an Leaflet-`transform` oder `transformOrigin`

## Auto-Nahdarstellung stärker wolkenartig

Auto bleibt in der Fernsicht strukturbetont und wird beim Hineinzoomen zunehmend flächiger:

- Fernsicht: kleine Wetterzellen bleiben erhalten
- mittlere Zoomstufen: gleitender Übergang
- Nahsicht: stärkere Glättung und weichere Übergänge
- starke rote/orange Kerne bleiben durch steigenden Kontrast sichtbar

Aktuelle Kennlinie:

- Zoom ca. **4,5 → 11,5**
- Blur ca. **1,25 px → 7,4 px**
- Sättigung ca. **1,06 → 1,20**
- zusätzlicher Nahbereich ab ca. Zoom **7**
- Kontrast ca. **1,12 → 1,38**
- Helligkeit ca. **1,00 → 0,985**

Ziel ist ausdrücklich eine komfortable, zusammenhängende Wetterfeld-/Wolkenwirkung und nicht lediglich ein immer unschärferes Pixelraster.

## Darstellungsmenü

Zusätzlich aus dem Realtest übernommen:

- Transparenz-Prozentwert mit mehr Abstand zum rechten Rand
- kleineres `+` im minimierten Darstellungsmenü
- minimierte Plus-Schaltfläche etwas kompakter

## Unverändert

- WeatherRouter-Routing
- Providerwahl
- Wetterdaten
- feste Modi `Präzise`, `Ausgewogen`, `Weich`
- Kartenlegende `Darstellung: …`
- Touch-/Pan-/Pinch-Zoom-Logik
- finale Augenassets

## Stand

- Produkt **V4.11.22 DEV**
- Build **V4.11.22-DEV-2026-10-07**
- Runtime **41122r1**
- Modulsatz **E411-22A1**
- `core.manifest` **1.2.93**
- `weather.display-menu` **0.4.4**
- Integration **0.25.0**

**C.K. – Eine Idee weiter gedacht.**
