# Gewitterradar OPERA VIS-04 – Verschiebbare „Loading Tiles…“-Fortschrittsanzeige

**27.10.2026 · deploy/dev · V4.11.113 DEV**  
**Runtime:** 411113r1 · **Modulsatz:** E411-113A1 · **Native Integration:** 0.25.22.

## Umsetzung
- In der getrennten OPERA-Entwicklungsvorschau gibt es ein kompaktes Fortschrittsfeld **„Loading Tiles… N % (erledigt/angefordert)“**, ergänzt um eine Fehlerzahl, falls Kacheln nicht laden.
- Standardposition innerhalb der Karte oben links mit Abstand zum Kartenrand; nicht in der bestehenden OPERA-Warn-/Statusleiste.
- Drag-and-drop per Pointer-Events mit Maus **und Touch**, mit Pointer-Capture, begrenzt auf den Kartencontainer. Kein blockierender Vollflächen-Dialog.
- Die Prozentanzeige verwendet die erledigten/angeforderten Kacheln je Ladezyklus. `loading` startet ein neues Kachelbündel, erfolgreicher PNG-Decode und Fehler erhöhen die Erledigt-Zahl; bei vollständigem Bündel verschwindet das Feld.
- Die OPERA-Kachelebene wird während der Ladephase verborgen und anschließend eingeblendet. Wissenschaftliche Warnung und Auswahl `north_first` / `south_first` bleiben erhalten.
- Die Laufzeit- und Versionsmetadaten wurden konsistent auf V4.11.113 DEV aktualisiert; die sechs relevanten Dateien `version.js`, `module-manifest.js`, `gewitterradar.js`, `panel.js`, `assets/gewitterradar-runtime-manifest.json`, `modules/weather/p7-010/opera-diagnostic-tile.js` wurden in `frontend/`, `custom_components/gewitterradar/frontend/`, `dashboard/dist/` nach GitHub-Rücklesen jeweils **3/3 bytegleich** verifiziert.

## Offene Prüfung
Noch **keine echten Browser-/HA-DEV-Laufzeittests** und **keine automatisierten Regressionstests**. Insbesondere der Fortschritt bei Zoom- und Kartenschwenk-Ereignissen muss praktisch geprüft werden; nach Verlagerung der Anzeige bleibt die Position für diese Vorschau bestehen, wird nach Schließen/Neustarten der Vorschau jedoch nicht dauerhaft gespeichert. Fehlgeschlagene Kacheln zählen als abgeschlossen, nicht als erfolgreich; dadurch ist 100 % kein Bildqualitätsversprechen.

## Ziel-Realtest
Nach kontrollierter DRA-Installation auf HA DEV VM109 OPERA starten, Bewegung mit Finger/Maus prüfen, Orientierung wechseln und kontrollieren, dass Fortschrittsfeld und Warnleiste sich nicht verdecken. WeatherRouter und HA PROD VM101 wurden nicht geändert. Wissenschaftliche OPERA-Freigabe bleibt gesperrt.
