# GewitterRadar PRO V4.13 FINAL – Mondlegende und erweiterter Legend Hub

**Release:** V4.13 FINAL · 2026/11  
**Interne Frontend-Version:** 4.13.7 (FINAL, Runtime `4137r2`)  
**Home-Assistant-Integration:** 0.25.186  
**Freigabe:** Die Betreiberabnahme erfolgte auf 4.13.7 DEV / HA 0.25.185; technische FINAL-Gates und signierte Release-Artefakte gelten nur, wenn der finale Veröffentlichungs-Commit geprüft ist.

## Erweiterungen

- Der bestehende Legend Hub erhält eine eigenständige Mondlegende mit Mondphasen- und Astronomie-Darstellung.
- Die Mondlegende bietet individuell konfigurierbare Darstellung, Material-/Rahmenoptik, Skala und Aura, eingebettet in die bestehende Premium-/Compact-Legendenarchitektur.
- Der Legend Hub unterstützt den zusätzlichen Mond-Slot unter Erhaltung der vorhandenen Wetterlegenden, der Drag-/Touch-/Keyboard-Bedienung und der unabhängigen Wetterlayer-Logik.
- Überarbeitete Einstellungs- und Auswahldarstellung sowie geräteübergreifende Anzeige, ohne die geschützten WeatherRouter-Datenquellen zu verändern.

## Stabilität und Prüfungen

- Historische Legend-Hub-Tests für neue Slots und die aktuelle Menüstruktur erweitert, ohne die ursprünglichen Schutzprüfungen zu entfernen.
- Deterministische Runtime-Identität, Asset-SHA256, identische Frontend-Auslieferungsbäume und HA/HACS-Metadaten als technische Release-Gates.
- Vorheriger `main`-Stand über PRE-MERGE-Quellarchiv und vollständiges Git-Bundle gesichert; unabhängige Kopie außerhalb von GitHub nach SHA256-Gleichheit verifiziert.
- Geschützte Aura-, Eye-, Synoptik-, Niederschlags-, Wind-, Temperatur-, Diagnose- und Hi-Res-Referenzen bleiben Bestandteil der Regressionsprüfungen.

## Installation

Dieses Release stellt eine native Home-Assistant-Integration und eine Dashboard-/Lovelace-Auslieferung bereit. Eine Installation ist über das benutzerdefinierte GitHub-/HACS-Repository möglich; damit ist keine Aufnahme in den offiziellen HACS-Katalog behauptet.

**PROD VM101 bleibt unverändert.** WeatherRouter ist ein eigenständiges Projekt und wird mit diesem Release nicht aktualisiert.
