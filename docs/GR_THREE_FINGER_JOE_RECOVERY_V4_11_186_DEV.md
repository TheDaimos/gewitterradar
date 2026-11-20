# GR 4.11.186 DEV · Wiederherstellung nach Drei-Finger-Screenshot

Der Betreiber beobachtete die erneute Störung in der Android-/HyperOS-Companion-App bereits während der Eye-/Aura-, Wind- oder Temperaturentwicklung. V4.11.185 ist der zuletzt beobachtete Stand.

## Historie und reproduzierter Quellbefund

Die Geräteabnahme für V4.11.39 ist dem Commit `1f5f5210d4f73c373fcb77296b54cf61b0564883` zugeordnet. V4.11.40 übernimmt dieselbe Gestenlogik. Der damalige Fix unterscheidet aktive Pointer, geänderte Touch-IDs und die von der WebView gemeldete Kontaktliste. Bei bestätigten Phantomkontakten übernimmt ein auf die Kartenfläche begrenzter Fallback Pan, Pinch und Doppeltipp. [Historische Übergabe](HANDOFF_GEWITTERRADAR_V4_11_40_HELP_2026-10-09.md#2-android-3-finger-joe--gelöster-fehler-nicht-erneut-öffnen)

Der erste relevante Unterschied im Gestencode seit V4.11.39 ist die in `7097f534` geänderte Behandlung von Fokus- und Sichtbarkeitswechseln, die laufende Standort-Kamerafahrten schützt. Die alte und die aktuelle Fassung haben keinen Kartenpfad für `lostpointercapture`. In V185 hält der Browsertest nach einem echten Leaflet-Pinch, einem dritten Kontakt und einem kontrollierten `lostpointercapture` ohne finales `pointerup` weiterhin aktive Kontakte. Außerdem konnten `pointercancel`, `touchcancel` und der verzögerte Mehrfinger-Reset dieselbe Geste getrennt bereinigen. Ein vor dem nächsten Input eingeplanter Neuaufbau konnte mit der neuen Geste kollidieren. Welcher Commit oder welche konkrete WebView-Ereignisfolge das Wiederauftreten auf dem Gerät auslöste, ist offen. [Historische Fokusänderung](https://github.com/TheDaimos/gewitterradar/commit/7097f534)

Wind-Snake- und Temperatur-Canvas lassen Hit-Tests zur Karte durch. Eye-Bubble, Schalter, Legenden und Premium-Drag verwenden eigene Pointer-Handler und teils Pointer-Capture. Kartenkontakte werden weiterhin nur auf der Kartenfläche aufgenommen. Abbruchereignisse für diese Kontakte sind in der Capture-Phase am Fenster erkennbar, auch wenn ihr Ziel ein Overlay ist und dessen eigener Handler die Weiterleitung stoppt.

## Quellvergleich

| Pfad | V185 | V186 |
| --- | --- | --- |
| Drei Kontakte, Teilende, Cancel | Verzögerter System-Reset und getrennte Cancel-Pfade | Markierte Mehrfinger-Sequenz endet beim ersten zugehörigen End- oder Abbruchereignis. Fehlt dieses, räumt der nächste neue Kontakt auf. |
| Pointer, Capture und Phantomkontakte | Karten-, globale Pointer- und Touch-Zustände konnten an verschiedenen Stellen enden. Synthetische Pointer-Cancels blieben im Shadow DOM. | Ein Abbruch leert die zur Karte gehörenden Kontaktmengen, beendet eigenes Capture und verwirft alte Folgearbeiten. Leaflets Pointer-Adapter erhält bei Bedarf ein nicht bubbelndes, über die Shadow-Grenze sichtbares Cancel. Beobachtete alte Touch-IDs können den vorhandenen Touch-only-Fallback bestätigen. |
| Leaflet 1.9.4 | Ein erzwungener Reset konnte auch globalen Drag-Zustand fremder Handler berühren. Ein manuell beendeter Pinch konnte sein `zoomend` und `moveend` verlieren. | Nur der Drag der eigenen Karte wird beendet. Der laufende Pinch verliert Listener und ausstehendes Frame, schließt seine gestarteten Zoom-/Move-Ereignisse und erzeugt keine zusätzliche Zoomanimation. |
| Lebenszyklus und Kartenmodus | Ein Blur innerhalb der Karte konnte den globalen Fokuspfad auslösen. Geplante Arbeit prüfte teilweise nur die Karteninstanz. | Nur Fenster-Blur und echte Seiten-/Sichtbarkeitsereignisse nutzen den Lebenszykluspfad. Moduswechsel und Teardown behalten den vorhandenen Recovery-Hook. Aufgeschobene Arbeit prüft zusätzlich die Eingabesequenz. |

## Prüfungen und reale Abnahme

Der Regressionstest verwendet Leaflet 1.9.4, die vollständige Karte, kontrollierte Touch-/Pointer-Abbrüche und native Chromium-Eingabe. Er prüft verspäteten dritten Kontakt, Teilende, verlorenes Capture, fehlendes Pointer-Ende, Blur, Sichtbarkeit, unmittelbar folgende Gesten, minimierte Bedienelemente, Kartenmodus und Remount. Die öffentlichen Prüfungen umfassen außerdem Vault-Profilzuordnung und Migration, V177/V180-Pixelvergleiche, V181-Einstellungsvergleich und Wind-/Temperatur-/Niederschlagsbedienung.

Pakete, Commit, SHA-256 und öffentliche Prüfnachweise stehen im [DRA-Vorabrelease](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.11.186-dev).

**OFFEN · Physische Android-/HyperOS-Abnahme.** In der Companion App in Standard-, Groß- und Vollbildmodus jeweils wiederholt einen Drei-Finger-Screenshot auslösen. Direkt danach ziehen, hinein- und herauspinchen, Eye antippen, lange drücken und verschieben. Wind und Temperatur umschalten und ein minimiertes Premium-Fenster bedienen. Bei einer erneuten Störung nach Möglichkeit die Kartendiagnose vor und nach der Geste exportieren. VM109 bleibt Teil dieser Betreiberprüfung.
