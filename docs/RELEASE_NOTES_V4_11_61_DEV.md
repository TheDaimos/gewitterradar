# Gewitterradar V4.11.61 DEV – Menübedienung unter Punkt 5

**Datum:** 12.10.2026 · **Basis:** V4.11.60 DEV (`267278c5fb9479e1eb35be616d8e543c9cecb12f`).

Auf ausdrücklichen Nutzerwunsch sind **Menüdarstellung** und **Menügeschwindigkeit** jetzt im Abschnitt **5. Effekte & Animationen** angeordnet, sowohl im klassischen Baum als auch in der modernen Detailansicht. Beide Optionen besitzen die hochwertige eigene Auswahlliste mit Auswahlpunkt, dunklem Dialog, Pfeil und ausreichend großer Touchfläche wie Sprache und andere Einstellungen. Einfache native Auswahlfelder im obersten Menürand sind entfernt.

- **Menüdarstellung:** Klassisch (goldenes Zahnrad) / Modern (blaues Zahnrad), dauerhafte Speicherung über `gr-settings-menu-style`. Der Wechsel wirkt sofort.
- **Menügeschwindigkeit:** Schnell (220 ms), Mittel (440 ms), Langsam (760 ms); **nur sichtbar wenn Modern ausgewählt**; dauerhaft gespeichert über `gr-horizontal-navigation-speed`.
- Die Auswahlzeilen verbleiben fest unter Punkt 5 und werden nicht zwischen Übersichts- und Detailseite bewegt. Die bestehenden Seitenanimationen und die V4.11.60-Standortlisten-Korrektur bleiben unangetastet.

**Identität:** V4.11.61 DEV, `41161r1`, `E411-61A1`; `ui.controls` 1.1.21, `core.manifest` 1.2.122; alle übrigen Module einschließlich `map.clusters-recent` unverändert, native Integration 0.25.0.

Die drei Frontend-Auslieferungen und DRA-Metadaten sind synchronisiert. Browserregression prüft beide Einstellungen direkt unter Abschnitt 5, keine doppelten Zahnräder, passenden Farbumschlag, bedingte Geschwindigkeit, Persistenz und die bestehende Animation. **Eine GitHub-Freigabe ersetzt keine Android-Realabnahme.**
