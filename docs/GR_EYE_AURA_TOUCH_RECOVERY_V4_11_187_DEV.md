# GR 4.11.187 DEV · Eye-/Aura-Eingabe nach Drei-Finger-Screenshot

Der Betreiber meldete nach V186 weiterhin einen sporadischen Ausfall von Tap und Drag am Eye. Der Ausfall konnte im Standardmodus bestehen und nach dem Wechsel zu Vollbild verschwinden. Kompass und Trend-Medaillon waren im Gerätetest des Betreibers bedienbar.

## Reproduzierter Zustand

Die vollständige V186-Karte im Chromium-Test erhält im Standardmodus einen primären Touch-Pointer `301` am Eye. Es folgen weder `pointerup` noch `pointercancel` oder `lostpointercapture`. Ein neuer primärer `pointerdown` mit derselben ID erreicht das Eye. In V186 bleibt der erste `eyeDrag` stehen und `begin` verwirft den neuen Kontakt. Die CSS-Klasse `pressing` bleibt gesetzt, obwohl der Test keinen aktiven Capture und keinen Release-Klickblocker feststellt. Dieser Zustand genügt für den Lock. V187 beendet den alten Zustand mit `new-primary`, entfernt dessen Listener und übernimmt denselben neuen Kontakt. Das folgende `pointerup` aktiviert das Eye im Standardmodus.

Separat konnte der V186-Long-Press einen Koordinatenfilter bis zu zehn Sekunden aktiv halten, wenn das Endereignis fehlte. Dieser Filter konnte einen späteren Klick an derselben Stelle in der Capture-Phase abfangen. V187 begrenzt den Filter auf die Ursprungsgeste. Er kennt ihre Pointer-ID oder den beobachteten Freigabepunkt. Neue Pointer- und Touch-Starts räumen den Filter sofort ab. Nach beobachteter Freigabe läuft der kurze Filter für Kompatibilitätsklicks aus. Die Tests prüfen sowohl den retargeteten Klick nach einem Long-Press als auch einen unabhängigen Klick an derselben Stelle.

## Standard, Vollbild und Overlays

Beide Kartenmodi verwenden dieselbe Eye-DOM-Instanz. Im Test erreicht der Hit-Test in beiden Modi den Eye-Button mit `pointer-events: auto` und `z-index: 2147483645`. Vollbild hängt den Kartencontainer in ein natives Dialogelement um. Die V186-Karten-Recovery arbeitet auf Leaflets Fläche. Sie übernimmt den Eye-eigenen Kontakt nicht. Das Umhängen oder ein Fokuswechsel kann Capture und Zielverteilung ändern. Der konkrete Auslöser der beobachteten Geräteheilung bleibt offen. Bei aktiven Wind-, Temperatur- und Niederschlagslayern vergleicht der Test das Eye-Hit-Target vor und nach dem Kartenabbruch. Eine Überdeckung auf dem Betreibergerät erfordert dessen eigene Hit-Test- und Ereignisspur.

Kompass und Trend-Medaillon haben getrennte Eingabepfade mit nativer Touch-Übernahme. Die Matrix öffnet nach der Abbruchsequenz beide Picker mit einem Touch. Eye-Canvas, Aura, Icons und Ebenen haben weiterhin ihre vorhandenen Darstellungspfade.

## Eingabepfade in V187

- Der gemeinsame Handler für Eye, Eye-Bubbles und Wetter-Kurzschalter beobachtet Abbruchereignisse während einer laufenden Eingabe in der Capture-Phase. Er zählt neu beobachtete Pointer oder geänderte Touch-IDs. Ein dritter Kontakt kann den alten Eye-Drag beenden, auch wenn er auf Karte oder Overlay beginnt.
- Zugehörige `pointercancel`, `lostpointercapture` und `touchcancel`, ein ersetzender Primärkontakt sowie tatsächlicher Fenster- oder Sichtbarkeitsverlust beenden die alte Eingabe. Ein isoliertes `touchend` wartet bis zum nächsten Frame auf das gewöhnliche `pointerup`. Die Bereinigung beendet Listener, Capture, Long-Press-Timer und CSS-Zustand. Ein bestätigter Phantomkontakt kann bei fehlendem oder nicht primärem Pointer über einen neuen nativen Touch-Identifier umgangen werden.
- Moduswechsel, Suspend und Disconnect verwenden dieselbe Bereinigung. Ein neuer gültiger Kontakt beginnt im aktuellen Modus. Die V186-Leaflet-Recovery hat weiterhin ihren eigenen Lebenszyklus.
- Die Kartendiagnose protokolliert `eye.gesture.begin`, `eye.gesture.interrupted` und `eye.gesture.end` mit Pointer-/Touch-ID, soweit vorhanden, sowie Ursache, Capture- und Release-Zustand. [Reproduzierbare Browser-Matrix](../scripts/test-map-gesture-recovery-browser.cjs)

## Release und Betreiberabnahme

[DEV-Vorabrelease mit Commit, SHA-256 und CI-Nachweisen](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.11.187-dev)

**OFFEN · Physische Android-/HyperOS-Abnahme.** In der Companion App wiederholt einen Drei-Finger-Screenshot auslösen und direkt im selben Modus das Eye antippen, ziehen und lange drücken. Den Ablauf in Standard und Vollbild durchführen und zwischen beiden Modi wechseln. Karte, Kompass, Trend, Wind und Temperatur prüfen. Bei einem Ausfall die Kartendiagnose vor dem App-Neustart exportieren und den Kartenmodus sowie sichtbare Overlays festhalten.
