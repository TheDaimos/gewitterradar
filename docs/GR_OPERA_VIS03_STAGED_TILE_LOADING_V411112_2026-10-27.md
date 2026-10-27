# GR OPERA VIS-03 – Kachelplatzhalter entfernen und Ladevorgang zurückhalten

**Version:** Gewitterradar V4.11.112 DEV · Build V4.11.112-DEV-2026-10-27 · Runtime 411112r1 · Modulsatz E411-112A1 · Native 0.25.21 · `deploy/dev`.

## Realbefund
Auf HA DEV VM109 konnten OPERA-north_first und south_first separat echte PNG-Bilder laden; während des Ladens erschienen zeitweise gebrochene Bildsymbole und der lange wissenschaftliche Warntext innerhalb der Kachelfläche. Die Statusanzeige enthielt nur einen kumulierten PNG-Zähler.

## Codekorrektur
- `modules/weather/p7-010/opera-diagnostic-tile.js`: `img.alt` ist leer; Kachel bleibt bis zu erfolgreichem Bilddecode unsichtbar, Fehlerkacheln bleiben ohne große Ersatztextanzeige.
- Registriere `onload` und `onerror` vor der Blob-URL-Zuweisung; erfasse `metrics.pending` und melde die Zahl fertiger/offener Kacheln.
- Leaflet-OPERA-Ebene startet mit Deckkraft 0; `loading` blendet unvollständige Kachelgruppen aus; erst `load` zeigt das fertig bearbeitete Kachelbündel mit gewählter Transparenz. Dies ist eine Sichtbarkeitskorrektur des getrennten DEV-Vorschaupfads, keine Freigabe wissenschaftlicher OPERA-Daten.
- Versionen, native Integration, Modulmanifest, Runtime-Manifest und alle drei Auslieferungsspiegel synchronisiert. Die sechs zentralen Dateien wurden aus GitHub zurückgelesen; alle drei Blob-SHA je Datei sind identisch.

## Grenzen
**Keine ausgeführten automatisierten Tests; keine neue HA-DEV-Realabnahme.** Das Ladeverhalten bei vielen Kacheln, fehlenden Kacheln und Zoom muss auf VM109 praktisch kontrolliert werden. Die Anzeige einer gemeinsamen North/South-Überlagerung wurde nicht implementiert: beide Orientierungen bleiben separat auswählbar. Wissenschaftliche OPERA-Sperren bleiben bestehen; PROD VM101 nicht verändert.

**Gezielter Realtest:** Nach DRA-Installation GR V4.11.112 / WR V0.10.249 auf DEV VM109 OPERA mit einer Orientierung starten, Ladeanzeige/Platzhalter prüfen, Orientierung umschalten, Ladezustand prüfen.

C.K. – Eine Idee weiter gedacht.
