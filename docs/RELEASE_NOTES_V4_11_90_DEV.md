# Gewitterradar V4.11.90 DEV – Weather-Engine Darstellungsmonitor und V1-Löschschutz

**Datum:** 17.10.2026 · **Repository:** `TheDaimos/gewitterradar` · **Auslieferungszweig:** `deploy/dev`
**Laufzeitkennung:** `41190r1` · **Modulsatz:** `E411-90A1` · **Integration:** `0.25.8`

## Anlass / Fehlernachweis

Realer HA-Export aus V4.11.89: regionales DWD-Radar gewinnt bei minimalem Randkontakt über Consumer API V1 und ersetzt eine weiträumige NASA-IMERG-Grundlage. V2 hatte beispielsweise nur 0,84 % des Sichtfeldes mit DWD beantwortet und korrekt auf V1 zurückgefallen. Die V1-Ebenenübernahme prüfte bislang lediglich Leaflet-`tileload`, nicht räumliche Gültigkeit.

## Implementierte Korrekturen

1. **Providerneutraler V1-Löschschutz:** Vor dem Austausch wird die maschinenlesbare, von WeatherRouter übermittelte `provenance.spatial_coverage` gegenüber dem aktuellen Sichtfeld bewertet. Eine verifizierte, mehr als 90 % deckende bestehende Karte wird nicht durch eine deutlich kleinere regionale neue Quelle (unter 90 %, um mehr als 10 Prozentpunkte geringer) ersetzt. Auch eine bereits aktive vollständige V2-Ebene ist vor einer drastisch kleineren V1-Ausgabe geschützt. Keine Annahmen aus Providernamen oder erfolgreichen Bilddownloads.
2. **Frische- und Einwilligungsprüfung:** Die bestehende Ebene wird nur dann gehalten, wenn sie noch geladen, eingebunden und innerhalb der nachgewiesenen zeitlichen Höchstgrenze liegt (Radar 900 s; bei ausdrücklich zugelassener, fachlich passender globaler Satellitenschätzung maximal 43.200 s). Der Zeitablauf seit der letzten erfolgreichen Übernahme wird mitgerechnet. Keine automatische Einwilligung.
3. **V1/V2-Beobachtbarkeit:** Getrennter Ringpuffer für bis zu 160 Darstellungsereignisse, darunter Karten-/Zoomänderung, Aktualisierungswartezeit, V2-Anfragezeit, V2-Teilquelle und Sichtfeldgeometrie, V1-Rückfall, Anbieter-/Deckungsvergleich, Kachel-Ladefehler, Ebenenübernahme und zurückgehaltene Ebene.
4. **Sichtbarkeitsprüfung:** Vorhandensein der Ebene, Kartenanbindung, Deckkraft, Pane-Sichtbarkeit und Zahl bereits geladener Grid-Kacheln werden ohne Bildaufnahme erfasst. Ein offensichtlicher Ebenenverlust wird gesondert markiert. **Wichtig:** Ohne echte Pixel-/NoData-Maske ist ein geladenes transparentes WMS-Bild kein Nachweis von sichtbarem Regen.
5. **Erweiterte Messung** im vorhandenen Weather-Engine-Diagnosefenster: höhere, aber begrenzte Kachelzählung und V2-Fehlerdetails; standardmäßig aus. Keine zusätzliche WeatherRouter-Anfrage durch die passive Messung.
6. **„Bildverlust jetzt markieren“:** Nutzer markiert den Fehlerzeitpunkt, Korrelationskennung und Zoom. Die Exportmetadaten erfassen Zeitmarke plus Fenster von 40 Ereignissen vor und nach der Markierung. Puffer und Markierungen sind sitzungsbezogen; kein dauerhaftes Aufzeichnen.
7. **JSON-Export:** Zusätzliches `display_monitor`-Objekt mit `events`, `markers`, `recent_counts`, Puffergrenzen und letztem partiellen V2-Ergebnis. Bestehende `traces`, `raw_consumer_exchanges`, `v2_attempts` und Diagnose-API unverändert enthalten.
8. **Abnahmetests:** Isolierte geometrische Regressionen auf Zoom 3, 5, 10, 12, 17, volle NASA-BBOX vs. minimale regionale DWD-Deckung, keine Sperre beim Kaltstart, Erweiterung auf breitere Quelle und vollständig regionale Deutschlandansicht.

## Technische Grenzen

- **Kein allgemeines V1+V2-Bildmischen:** V2-Teilresultate bleiben als Diagnose-/Provenienzinformation erhalten, werden außerhalb einer nachgewiesen vollständig nutzbaren V2-Grundversorgung weiterhin nicht als unvollständige Ersatzebene aktiviert. Erst nach WR-Reparatur und erfolgreichem Realtest kann die vorhandene V2-Mosaikarchitektur hierfür erweitert werden.
- Ein regionaler DWD-Neustart **ohne zuvor vorhandene gültige globale Ebene** darf weiterhin die regionale Karte zeigen. Der Löschschutz kann keine nicht gelieferte NASA-Quelle erzeugen.
- Die V1-Routingentscheidung bleibt Aufgabe von WeatherRouter; insbesondere der gemeldete NASA-`scope=bbox`-/12-Stunden-Zeitvertrag muss dort korrigiert werden.
- HA-Realabnahme, Bildpixelnachweise und geräteübergreifende Bedienung erfolgen nach Installation über DRA.

## Empfohlene HA-Realabnahme

Bei aktivierter Niederschlagsebene und **bewusst** gesetzter Satellitenfreigabe zunächst über Atlantik mit NASA-V1-Grundlage navigieren. Dann so schwenken, dass DWD nur am Bildrand liegt, bei Zoom 3–5 und 10–17. Die Satellitengrundlage darf nicht verschwinden; im Monitor muss `v1_regional_replacement_prevented` mit alter und neuer Deckungsquote erscheinen. Danach Deutschland zentral prüfen: regionaler DWD muss bei echter regionaler Deckung nutzbar bleiben. „Bildverlust jetzt markieren“ bei visuellen Auffälligkeiten aktivieren und vollständigen Weather-Engine-JSON-Export für die Untersuchung sichern.

**C.K. – Eine Idee weiter gedacht.**
