# Gewitterradar V4.11.76 DEV – Weich: gebundene Mehrskalenglättung

**Datum:** 14.10.2026. **Ausgangsbasis:** V4.11.75 DEV. **Status:** Entwicklungsstand, echte iPad-/Desktop-Abnahme erforderlich.

## Beobachtung
Die iPad-Bilder von Zoom 10 zeigen im Modus Weich nach V4.11.75 eine deutliche Verbesserung, jedoch weiterhin erkennbare lineare, L-, U- und T-förmige Rasterstrukturen. Präzise ist korrekt kantig, Ausgewogen deutlich strukturiert und Auto sichtbar wolkiger. Gerätebilder und Standortdiagnosen bleiben außerhalb des öffentlichen Repositorys.

## Technische Änderung
- Ausschließlich **Weich ab Zoom 9**, auf der bestehenden zusammengesetzten Leaflet-Niederschlagsebene. Die V4.11.75-Kurve und der Zoom-8-Wert bleiben unverändert.
- Statt pauschaler zusätzlicher Einzelunschärfe werden zwei begrenzte, gewichtete Gauß-Skalen per SVG-Filter **innerhalb desselben Kartenpanes** verrechnet: das bisherige Detailprofil und eine höchstens 64 px breite Strukturskala (mit höchstens 32 % Gewicht).
- Bewusst **kein** zweiter Leaflet-Layer, keine zweiten Kachelabfragen, keine neue Ereignis- oder Animationsschleife.
- Wenn die zusammengesetzte Filterfunktion nicht verfügbar ist, fällt die Karte auf das V4.11.75-Einzelprofil zurück. Die übrigen Modi werden nicht umgestellt.
- Die zusätzliche Filterdurchführung kann auf leistungsschwachen Geräten Kosten verursachen. Der Schutz der V4.11.68-Leistungsreferenz muss deshalb zusätzlich in einem echten iPad-Test bestätigt werden; synthetische und CI-Tests können diesen nicht ersetzen.

## Prüfungen
- Neue synthetische Mehrskalen-Regressionsfälle: gemischter Detail-/Strukturfilter, Zoom 8/9/10, native Zoomstufen, Begrenzungen, Rückfallprofil und Modustrennung.
- Aktuelle Quell- und Zielkopien sowie Inventar-Prüfsummen. Keine privaten Bilder, GPS-Positionen oder Exporte.

**Release:** V4.11.76 DEV · 41176r1 · E411-76A1 · weather.display-menu 0.4.13 · 33 Module · Integration 0.25.1.

C.K. – Eine Idee weiter gedacht.
