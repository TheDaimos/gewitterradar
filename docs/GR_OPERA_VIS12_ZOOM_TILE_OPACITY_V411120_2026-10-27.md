# GR VIS-12 – OPERA-Kacheln bei Zoomwechsel sichtbar halten

**2026-10-27 · V4.11.120 DEV · deploy/dev · nur HA DEV VM109**

## Realbefund
Android-Aufnahmen mit OPERA `north_first`, Rasterdatum 2026-10-27T12:30:00Z, Zoom 4 **109 PNG geladen**, Zoom 3 **115 PNG geladen**. Pixelbild in Zoom 4 sichtbar, Zoom 3 weitgehend abgeschnitten. Die OPERA-Rasterorientierung ist nicht wissenschaftlich freigegeben.

## Quellcodebefund und Reparatur
`modules/weather/p7-010/opera-diagnostic-tile.js` stellte zuvor beim Start **jedes** Leaflet-`loading`-Events den gesamten GridLayer auf `opacity:0`. Bei `load` wurde die Deckkraft wieder hergestellt. Das kann beim Wechsel des Zoomlevels trotz geladener Tiles eine leere Karte erzeugen. Entfernt wurden die beiden globalen Opacity-Eventhandler. Die Ebene startet nun mit der konfigurierten Deckkraft, während jedes einzelne `img` bis zum erfolgreichen `onload` unsichtbar bleibt. Der Transparenzschieber ist nicht länger vom Pending-Zähler abhängig. Keine Daten-, Geo-, Provider- oder wissenschaftliche Freigabeänderung.

## Versionierung
Synchronisiert: V4.11.120 DEV, Runtime 411120r1, Modulsatz E411-120A1, native 0.25.29, BUILD_VERSION 4.11.120, core.manifest 1.2.168; drei Frontend-Auslieferungsspiegel.

## Freigabestatus
GitHub-Rücklesen vorgesehen. Kein selbst ausgeführter HA-DEV-Realtest. **Nicht belegt**, dass der Zoom-3-Datenbeschnitt hierdurch beseitigt ist: Auch Pixelgeoreferenzierung, Zoom-Reprojektion oder Transparenz/Nodata sind möglich. Realtest bei frischem OPERA-Frame Zoom 3/4, Tile-PNG Erfolgs-/Fehlbilanz und Nichttransparentpixel je Kachel nötig. Wissenschaftliche Sperren bleiben aktiv, PROD VM101 unverändert.

C.K. – Eine Idee weiter gedacht.
