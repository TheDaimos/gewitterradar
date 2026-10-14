# V4.11.73 DEV – Niederschlagsstile neu abgestuft

Datum: 14.10.2026. Grundlage: V4.11.72 DEV (bewaehrter Leistungsstand V4.11.68).

Der bisherige **Ausgewogen**-Modus war zu nah an **Praezise**. Die Profile wurden nach Realbildern aus Kuba (Zoom 6, 9 und 10) neu zugeordnet:

- **Praezise**: unveraendert, keine Filter.
- **Ausgewogen**: exakte fruehere Weich-Abstimmung (5.6–11.5 px, Saettigung 1.18, Kontrast 1.34, Helligkeit 0.99).
- **Weich**: eingefrorene Referenzoptik des bisherigen Auto-Modus bei Zoomstufe 6 fuer die jeweils native Radar-Rasteraufloesung. So bleibt Weich gezielt sanft, ohne selbst auf jede Zoomstufe umzuspringen.
- **Auto**: dieselbe bisherige zoom- und rasteraufloesungsabhaengige Berechnung; nur in eine gemeinsame reine Rechenfunktion ausgelagert.

Niederschlagsdaten, Tiles, Transparenz, Zeitplayer, Karte, Cluster, Kamerafahrt und Blitzortung wurden nicht veraendert. Auslieferung in drei identischen Frontend-Kopien, Modul weather.display-menu 0.4.10, core.manifest 1.2.134. Geschaetzte visuelle Wirkung muss noch an realen Endgeraeten geprueft werden.

V4.11.73 DEV · 41173r1 · E411-73A1 · 33 Module · native Integration 0.25.1.

Keine privaten Diagnose- oder Standortdaten im oeffentlichen Repository.

C.K. – Eine Idee weiter gedacht.
