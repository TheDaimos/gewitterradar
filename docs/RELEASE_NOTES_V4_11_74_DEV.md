# V4.11.74 DEV – Weich: Rasterstufen im Nahzoom vermindern

**Datum:** 14.10.2026. **Ausgangspunkt:** V4.11.73 DEV. **Status:** Implementiert, CI und echte Geraeteabnahme stehen aus.

## Beobachtung
Auf iPad UND Desktop bleiben im Modus **Weich** bei Zoom 8 die Niederschlagsuebergaenge glatt, bei Zoom 9 erscheint eine feine Rasterstruktur und bei Zoom 10 wird sie deutlich. Safari-spezifische Annahmen sind somit nicht ausreichend.

## Ursache und Korrektur
Die Berechnung von Weich nutzte fuer jede Zoomstufe denselben CSS-Filter, naemlich Auto bei Zoom 6. Die gerenderten Wetterkacheln werden aber bei hohen Zoomstufen zunehmend vergroessert. **Weich** erhaelt deshalb ab Zoom 9 eine vorsichtig ansteigende Glaettung (Referenz bei Zoom 8 unveraendert). Die Glaettung ist gedeckelt, um iPad-Leistungsprobleme zu vermeiden; Auto darf deutlich staerker sein. Der Radaradapter erneuert den Filter bei jedem Zoomwechsel bereits selbst – kein zweiter Handler noetig.

**Unveraendert:** Niederschlagsdaten, Quellkacheln, Kartenbewegung, Tracker, Radarplayer, Transparenz, Praezise, Ausgewogen und Auto sowie vorhandene Zoomereignisse.

## Automatische Pruefung
Regression fuer Zoom 6/8/9/10, native Radarzoomstufen, Glattungslimit, Bedienmodule, Frontend-Spiegel und Prüfsummen. Testdaten sind generisch; private Standort- und Diagnoseinformationen werden nicht ins oeffentliche Repo uebernommen.

**Stand:** V4.11.74 DEV · 41174r1 · E411-74A1 · 33 Module · weather.display-menu 0.4.11 · native Integration 0.25.1.

**C.K. – Eine Idee weiter gedacht.**
