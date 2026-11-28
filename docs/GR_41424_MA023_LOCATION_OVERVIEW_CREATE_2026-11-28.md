# GewitterRadar V4.14.24 – MA-023 Standort-Sichtfenster und manuelle SQLite-Neuanlage

## Architektur
Read-only **Standort-Sichtfenster** mit lokaler Mercator-Skizze (kein Straßenkarten-Layer), aktiven/archivierten/allen Orten, Filter, Tastatur-/Touch-Auswahl, Anzahl gleicher Koordinaten und Detail-/GeoPoint-/Hauptkarten-Schaltflächen. Referenztracker wird nicht geändert. Gleiche Koordinaten sind bei mehreren physisch getrennten Geräte-Standorten zulässig und werden angezeigt, **nie** dedupliziert oder zusammengeführt.

**Manueller neuer Standort** über bereits existierenden SQLite-WS-Befehl `location_create`; Name und Koordinaten explizit geprüft, sofortige Vorschau und doppelte Koordinatenwarnung, ausdrückliche Bestätigung, erneuter serverseitiger Readback nach Erfolg. Keine automatische To-do-Übernahme, keine tracker-Erstellung, keine Änderung an Blitzortung.org ConfigEntries.

V4.14.23-Grundlagen: CI für SHA `adabe194a58c9bf83b2cb55c6372999df7fb42dc` komplett grün (MA-V9, HA, Shared Frontend, Hi-Res). Neues V4.14.24 muss vor DRA VM109 erneut getestet, gebaut und auf exaktem finalen SHA geprüft werden. Keine PROD-Installation, keine FINAL-Freigabe.
