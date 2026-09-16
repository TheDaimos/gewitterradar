# Artwork – Location Search

Dieser Ordner enthält die Premium-Grafikfamilie der **Weltweiten Ortssuche**.

## Verbindliche Regel
- Die Dateien in `hires/` sind die **einzige maßgebliche Quelle**.
- Alle Laufzeitgrafiken in `runtime/` und die produktiven Dateien in `assets/` sind **nur abgeleitete Exporte**.
- Änderungen an Darstellung, Farbe, Materialität oder Details erfolgen **immer zuerst in `hires/`**.
- Ableitungen werden anschließend neu exportiert; sie werden **nicht manuell als Primärquelle weiterbearbeitet**.

## Inhalt
- Globus / Weltkugel
- Lupe für `Ort / PLZ`
- Zielscheibe / Dart für `Lat / Lon`
- Glühbirne / Hinweis
- Info-Medaillon
- Schließen-X

## Zielstruktur
- `hires/` → freigestellte Hi-Res-Master
- `runtime/` → optimierte Exportdateien für UI und Tests

## Direkter Testbetrieb
Die produktiven Premium-Symbole werden für V4.07.45 zusätzlich direkt in die JavaScript-Datei eingebettet. Dadurch funktioniert ein reiner JS-Austausch im Home-Assistant-Testsystem ohne separate Asset-Pfade. Die Dateien in `hires/` bleiben trotzdem die alleinige Master-Quelle; `runtime/` und eingebettete Daten sind nur reproduzierbare Ableitungen.
