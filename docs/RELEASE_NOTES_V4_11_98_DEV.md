# Gewitterradar V4.11.98 DEV – GR-RF-03

**19.10.2026 · deploy/dev · Integration 0.25.16 · Laufzeit 41198r1 · Modulsatz E411-98A1**

Die starre sechssekündige V2-Zeichenfrist konnte bereits laufende Bildabrufe vor deren eigener achtsekündiger Frist abbrechen. Der neue Stufenwächter wartet auf Ladefortschritt, endet nach neun Sekunden ohne Fortschritt und spätestens nach zwanzig Sekunden. Stufenlaufzeit, letzte Kachelfehler und wirkliche Zeichenreihenfolge werden erfasst. Eine vorhandene gültige Ebene bleibt bei fehlgeschlagenen Austauschversuchen erhalten.

Firefox-Hintergrundereignisse invalidieren laufende Ersatzversuche und bündeln die Wiederaufnahme. Die weiterhin gültige alte Ebene wird nicht allein durch das Ausblenden entfernt. Ältere Satellitenschätzungen werden für die Canvas-Darstellung unter aktuellere Radarmessungen eingeordnet, auch wenn die WR-Quellenfolge wechselt; WR bestimmt weiterhin die Quelleneignung.

Bestandsschutz für GR-RF-01/02, 45-Sekunden-Haltefrist, UTC, 900-Sekunden-Radargrenze, ausdrücklich freigegebene 12-Stunden-Satellitenbilder, API V1/V2, geografische Trennung und Zoom 17. Eine erfolgreich geladene Bildkachel beweist keine Niederschlagspixel.

**Regressionen:** `scripts/test-p7-010-rf-03.mjs` und die bestehenden P7-010-/RF-01-/RF-02-Tests. **Kein HA-REAL-PASS ohne korrelierte Exporte.** Nach DRA-Installation Zoom 5/7/8, 7→8→7, Firefox-Hintergrund mindestens zwei Minuten, langsame/hängende Bildkacheln, DWD/NASA-Priorität und Deutschland → Kuba → Deutschland gesondert testen.

**C.K. – Eine Idee weiter gedacht.**
