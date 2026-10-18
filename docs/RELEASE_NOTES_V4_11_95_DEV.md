# Gewitterradar V4.11.95 DEV – Niederschlag nach App-Wiederaufnahme

**18.10.2026 · `deploy/dev` · Integration `0.25.13` · Runtime `41195r1` · Modulsatz `E411-95A1`**

## Anlass: Android-Realbeobachtung

Bei nahezu identischem Kartenausschnitt (Zoom 5, Kuba/Florida) zeigte die laufende Home-Assistant-App keine Niederschlagsflächen. **Erst das vollständige Beenden der Home-Assistant-App und ihr erneuter Start** ließ farbige Niederschlagsgebiete sichtbar werden. Nur die Karte zu verlassen, die App im Hintergrund zu lassen oder die Home-Assistant-Ansicht neu zu laden ist dabei nicht dasselbe. Die zwei Screenshots beweisen, dass die Ausgabe nach Neubeginn funktioniert, aber nicht, ob die Ursache WebView-Zwischenspeicher, eine ausgesetzte Abfrage oder verzögerte WR-Bilddaten waren.

## Korrekturen

- Das Niederschlagsmodul reagiert nun auf `visibilitychange`, `pageshow` aus dem Dokument-Zwischenspeicher und gedrosseltes `focus` nach längerer Inaktivität. Bei Wiederaufnahme werden Kartengröße und geografische Gültigkeit erneut kontrolliert und eine **erzwungene neue V2-Auflösung** vorgemerkt. Eine noch gültige alte Rasterebene bleibt bis zum vollständigen neuen Bild sichtbar.
- Ein durch Unterbrechung mehr als 35 Sekunden hängengebliebener V1-/V2-Vorgang wird per Generationsschutz entwertet. Der neue Vorgang kann beginnen. Trifft die alte Antwort später ein, darf sie weder die neue Abfrage entsperren noch eine alte Verfügbarkeitsmeldung zurückschreiben.
- Wiederholte `focus`- und Sichtbarkeitsereignisse innerhalb von zwei Sekunden erzeugen keine mehrfachen erzwungenen Abfragen. Alle Ereignisbehandler werden beim Entfernen der Karte wieder abgemeldet.
- Die regionale DWD-Bereinigung von V4.11.94 sowie die bewusst aktivierbare 12-Stunden-NASA-Grenze bleiben unverändert.
- Fehlt trotz einer erfolgreichen Antwortprüfung noch eine verwendbare Rasterebene, erfolgt ein gebündelter erneuter Versuch frühestens nach 15 Sekunden statt erst nach der normalen 4–5-Minuten-Ruhezeit. Bei bestehendem gültigem Bild bleibt die längere Schonfrist erhalten. Das Wiederaufnehmen einer schon existierenden Karte fordert ebenfalls eine Erneuerung an. Ein Abfrageschwall entsteht dadurch nicht.
- Neuer Regressionstest: `scripts/test-v41195-android-foreground.mjs` einschließlich geografisch unveränderter Karte ohne Niederschlagsbild.

## Abnahmegrenze

Dieser Stand wird automatisiert geprüft, ist aber **noch nicht auf dem betroffenen Android-Gerät real erprobt**. Für den Realtest die App nach DRA-Installation und vollständigem HA-Neustart öffnen, dann ohne erzwungenes Beenden zwischen Home und Gewitterradar wechseln sowie einmal in den Hintergrund und wieder in den Vordergrund gehen. Die Regenebene muss sich ohne vollständiges App-Beenden aktualisieren. Vorhandene Farbpixel nach echtem App-Neustart belegen nicht rückwirkend die Genauigkeit oder Aktualität der NASA-Aufnahme.

*C.K. – Eine Idee weiter gedacht.*
