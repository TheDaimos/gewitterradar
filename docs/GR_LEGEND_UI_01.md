# GR-LEGEND-UI-01 · 2026-11-06

GR 4.11.142 DEV / HA 0.25.49; WR bleibt 0.10.289 unverändert. Ausschließlich deploy/dev.

V2-Legenden wurden verworfen, weil sie weder Bild noch Einträge enthielten.
Die vorhandene weather.legend-overlay-Verwaltung ergänzt nun die gemeinsamen
mm/h-Stufen. Ein erzwingt sie auch ohne aktive Daten, Auto benötigt ein aktives
Modell, Aus verbirgt sie. Keine neue Ebenen-/Providerverwaltung.

Die Legendenwerte sind aus RATE_COLORS in WR 0.10.289 generiert: >0,1,2,3,5,7.5,
10,15,30,45,75,100,150 mm/h. Sie verändern keine Rasterpixel.
Die originale DWD-WMS-Palette weicht unter .4 und ab45 mm/h von OPERA ab;
die gemeinsame Intensitätsreferenz kennzeichnet diese Grenze sichtbar.
Eine pixelgenau identische DWD-/OPERA-Farbskala ist bei unveränderten DWD-Kacheln
nicht behauptbar. Die Quellen und die Rasterdarstellung bleiben unverändert.

Drag an der Legendenkopfzeile per Pointer Capture, Maus und Touch.
Normalisierte Position in lokalem Browser-Speicher wie beim Eye-Menü; validierte
Werte und Clamping an die aktuelle Kartenfläche, auch nach Reload/Resize.

Eye-Kopfzeile erhält vier explizite Gridspalten mit Minimieren links vom i.
Transparenz verwendet ein schrumpfbares Grid mit eigener Beschriftungszeile.
Erklärung unter Legende entfernt; Niederschlags-Erklärung mit sicherem Umbruch.

Keine WR-Änderung, keine Änderung von Daten, Modi, Transport oder Kachelwechsel.
TEST69 bleibt unangetastet; VM101 nicht berührt. Neue visuelle VM109-Abnahme
ausstehend. Öffentliche bestehende Releaseprüfungen und gezielte UI-Prüfungen.

Gezielte lokale Chromium-Prüfung bei 1280 und 375 px bestanden: Kopfzeilen-Reihenfolge,
unbeschnittene Regler/Erklärungen, 13 Farbstufen, Drag, gespeicherte Position nach
Reload und Ein/Aus. Zwei fokussierte Node-Fälle prüfen zusätzlich Auto/Ein/Aus,
V2 ohne Bildlegende, identische DWD-/OPERA-Modelle und ungültigen Positionsspeicher.
