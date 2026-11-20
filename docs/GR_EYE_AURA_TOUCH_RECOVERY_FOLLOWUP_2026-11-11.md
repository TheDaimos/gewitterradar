# Codex-Auftrag – 3-Finger-Joe: verbleibender Eye-/Aura-Touch-Lock nach V4.11.186

**Datum:** 11.11.2026  
**Projekt:** GewitterRadar Pro – powered by WeatherRouter  
**Repository / Branch:** `TheDaimos/gewitterradar@deploy/dev`  
**Betreiberstand:** GR 4.11.186 DEV / HA 0.25.93  
**Priorität:** P0 für Eye-/Aura-Bedienbarkeit  
**Referenzschutz:** V4.11.181 visuell geschützt; funktionierende V186-Kartengesten-Recovery und Settings Vault erhalten

## Neuer echter Android-Befund

Nach V186 funktioniert der Drei-Finger-Screenshot häufig, jedoch **nicht zuverlässig**. Betreiber hat mehrfach hintereinander geprüft, bei Versagen die Android-Companion-App geschlossen und neu gestartet. Nach der Android-/HyperOS-Drei-Finger-Screenshot-Wischgeste kann das **Aura-/Eye-Symbol vollständig unbedienbar** werden: weder Verschieben noch Antippen/Aktivieren funktionieren. Gelegentlich ist es im **kleinen Kartenmodus tot**, aber nach dem **Wechsel in Vollbild** wieder bedienbar. **Kompass und Trend-Medaillon waren nie betroffen.** Die Regression begann nach Betreiberbeobachtung schon während Aura- oder Wind-/Temperatur-Entwicklung, zunächst schwächer/seltener.

**Schlussfolgerung:** Nicht mehr nur allgemeine Leaflet-/Karten-Gesture-Recovery untersuchen. Die Eye-/Aura-eigene Pointer- und Klick-Zustandsmaschine und die unterschiedlichen Lifecycle-Pfade im kleinen und Vollbildmodus sind jetzt Hauptverdächtige. Der genaue Root Cause ist noch nicht nachgewiesen.

## Konkrete Code-Hinweise (Stand deploy/dev zum Auftragszeitpunkt)

- `frontend/modules/weather/display-menu.js`: `_weatherDisplayBindEyeDrag` registriert Pointerdown/-move/-up/-cancel und `lostpointercapture`; die `begin`-Routine verwirft neue Kontakte solange `state.eyeDrag` existiert. Wenn der alte Kontakt nach der OS-Screenshot-Geste weder `pointerup` noch eine korrekt zugestellte Cancel-/Capture-Abbruchsequenz erhält, kann ein verwaister Zustand Tap **und** Drag verhindern.
- `_weatherDisplayCancelEyeDrag` bereinigt `eyeDrag`, Capture, Long-Press-Timer und CSS-Klassen. **Prüfen**, ob es bei OS-Abbruch zuverlässig aufgerufen wird und ob sein `options`-/State-Scope korrekt ist.
- `eyeSuppressClickUntil` und `blockEyeReleaseClick` bilden eine zweite Interaktionssperre. Prüfen, ob Klick-Blocker oder deren Cleanup nach Capture-Verlust hängen bleiben oder später auftretende Pointer-/Click-Sequenzen ungewollt blockieren.
- `frontend/modules/weather/eye-hub.js` bindet den Eye-Control per `_weatherDisplayBindEyeDrag`; Gruppierung, Bubble-Drag, Open/Close/Suspend und externe `pointerdown`-Listener können weitere Zustandsübergänge erzeugen.
- `frontend/modules/fullscreen/map-display.js` ruft beim Moduswechsel `_recoverMapGestureState('display-mode-change',{force:true})` auf. **Prüfen, ob diese Operation zugleich Eye-/Aura-State zurücksetzt oder indirekt neu bindet.** Das könnte erklären, warum Vollbild den Fehler gelegentlich löst.
- Kompass und Trend sind nicht betroffen. Ihre Gesten-/Lifecycle-Mechanismen als Kontrastfälle analysieren, ohne sie umzubauen.

## Verbindlicher Auftrag

1. Vorher/Nachher-Traces für eine Drei-Finger-Geste auswerten: Pointer-ID, `isPrimary`, `pointercancel`, `lostpointercapture`, `touchcancel`, fehlende `pointerup`, `blur`, `visibilitychange`; dokumentieren, ob Eye-Kontakte, Release-Click-Blocker, Drag-/Long-Press-CSS oder Captures hängen bleiben.
2. Kleinmodus versus Vollbild: Unterschiede in Eye-Element, Z-Index/Hit-Testing, `pointer-events`, Overlay, Event-Listener, Card-/Map-/Eye-Lifecycle und Recovery gezielt prüfen. **Nicht allein von einem stale `eyeDrag` ausgehen** – auch überlagernde Hit-Targets oder ein unbereinigt gebliebenes Click-Blocking könnten Tap und Drag gemeinsam verhindern.
3. Eye-State deterministisch und idempotent bereinigen, wenn ein Pointer verloren ist oder eine OS-Geste abgebrochen wurde. Der **nächste neue gültige Kontakt** muss nach Abbruch wieder Tap oder Drag auslösen; nie die neue legitime Geste zusammen mit der alten verwerfen.
4. Die bekannte V186-Karten-Gesture-Recovery erhalten und die Eye-Recovery kompatibel ergänzen; keine pauschalen globalen Touch-Handler, keine OS-Screenshot-Geste blockieren, keine leeren periodischen Timer-Heilungen.
5. Click-Suppression auf erforderliche Lebensdauer begrenzen; Capture/Global Listener symmetrisch entfernen, auch bei `disconnect`, `suspend`, Moduswechsel und erneuter Kartenmontage.
6. Eye-/Aura-Gruppierung, Hi-Res-Icons, Tap, Long-Press, Position/Drag und sämtliche geschützten Darstellungen sowie Settings Vault vollständig bewahren.

## Regressionen

- Drei-Finger-Beginn und OS-ähnliches `pointercancel`/`touchcancel` mit anschließendem gültigem Eye-Tap, Eye-Drag und Long-Press.
- `lostpointercapture` ohne `pointerup` und ohne korrekt zugestellten Cancel, anschließend direkt neuer Eye-Kontakt.
- Vollbildwechsel darf keine Voraussetzung zur Selbstheilung sein; dennoch kleiner Modus → Vollbild → zurück, mehrfach.
- Capture-/Event-Verlust **am Eye** sowie gleichzeitig auf Karten-/Wind-/Temperatur-Overlay.
- Wiederholte Screenshot-Sequenzen ohne App-Neustart. Kontrolle: Kompass, Trend, Karte, Eye, Wind, Temperatur.
- Prüfen, dass alte Click-Suppression nicht zukünftige gültige Klicks abfängt und `eyeDrag` nach Abbruch leer ist.
- Bestehende V186-Gestenregressionen, Settings-Vault-Profil-/Cache-Wiederzuordnung und alle visuellen V177/V180/V181-Referenzvergleiche bewahren.

## Durchführung und Release

**Quellursache isolieren, gezielt korrigieren, vollständig testen und installierbaren neuen DEV-Vorabrelease über DRA `deploy/dev` veröffentlichen.** Vor Änderung unbenutzte GR-/HA-Versionsnummern prüfen; jede Quelländerung erhält neue Kennungen. Frontend-Lieferkopien synchron halten, ZIPs und SHA-256 prüfen, öffentliche CI nur öffentlich. Keine PROD-Änderung (VM101), keine Wetterrouter-Vertragsänderungen.

Die echte Android-/HyperOS-Abnahme (mehrfach Drei-Finger-Screenshot → **Eye sofort antippen und verschieben** in kleiner Karte und Vollbild) bleibt bis zum Betreiber-Nachweis **OFFEN**. Implementierungsbericht muss Root Cause, geänderte Touch-Pfade, Regressionen, Version, Commit und Release-Link nennen. Keine vorgetäuschte physische Android-Prüfung.
