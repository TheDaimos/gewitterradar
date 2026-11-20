Bootstrap: Daimos

**Projekt:** Gewitterradar  
**Repository:** `TheDaimos/gewitterradar`  
**Entwicklungszweig:** `feature/v4.11-development`  
**Bereitstellung:** `deploy/dev`

Wir übernehmen aus dem Chat vom 12.10.2026 die Entwicklung der horizontalen Einstellungsanimation sowie der stabilen Cluster-/Einzelblitzmarker.

**Lies ZUERST vollständig:**

1. `docs/HANDOFF_GEWITTERRADAR_V4_11_55_MOTION_AND_MARKERS_2026-10-12.md`
2. `docs/RELEASE_NOTES_V4_11_55_DEV.md`
3. `docs/RELEASE_NOTES_V4_11_54_DEV.md`
4. `frontend/modules/ui/controls.js`
5. `frontend/modules/ui/skeleton.js`
6. `frontend/modules/map/clusters-recent.js`
7. `scripts/test-v41154-settings-motion.cjs`
8. `scripts/test-v41153-cluster-markers.mjs`
9. `scripts/test-v41154-individual-markers.mjs`
10. `tests/test_settings_navigation_v41150.py`

**Verbindlicher geprüfter Softwarestand vor Dokumentationsübergabe:**
- `V4.11.55 DEV`, Runtime `41155r1`, Modulsatz `E411-55A1`.
- Software-Commit `d6980c240c915b9ee6066fc08c5c5eaf9c732fc0`.
- `feature/v4.11-development` und `deploy/dev` waren beim Abgleich softwareseitig identisch.
- 4/4 Bereitstellungsprüfungen grün.
- Zusammengeführte Korrekturen: nummerierte Cluster (V4.11.53), rote Einzelblitze (V4.11.54) und horizontale Einstellungsanimation inklusive fest verankerter Signatur/Versionsangabe (V4.11.55).
- Die Übergabe ist eine Dokumentationsänderung, **kein weiteres Softwareupdate**.

**Dein nächster Auftrag:**
Prüfe die aktuelle Git-Basis, frage dann gezielt nach der tatsächlich in Home Assistant installierten Gewitterradar-Version und beginne die **Android-Realabnahme von V4.11.55**, sobald diese installiert ist. Hauptaugenmerk: `Mittel` und `Langsam` mit Hin- und Rücknavigation, vollständig sichtbarer Inhalt während der Bewegung, fließende Höhenänderung ohne Endruck, feste Signatur und korrektes `2026/10` am unteren Dialograhmen; zusätzlich `Schnell`, klassisches Menü, `8. Module & Versionen`, stabile Cluster und rote Einzelblitze.

Die Referenzvideos `72491.mp4` (Mittel) und `72503.mp4` (Langsam) dokumentieren das alte Verhalten. Bei den vier früheren Screenshots lautet die **korrigierte** Reihenfolge 1 → 2 → 4 → 3.

Die technische Korrektur und alle CI-Tests sind abgeschlossen. **Nicht erneut implementieren oder neue Testserien starten, solange kein konkreter neuer Fehler nachgewiesen ist.** Bei Abweichungen zuerst eingrenzen; nur dann kleinste notwendige Änderung mit vollständiger Versions- und CI-Kontrolle. Keine Veränderungen an WeatherRouter, keine Android-Gestenregression und keine unkontrollierte DRA-Bereitstellung.

Arbeite eigenständig soweit sinnvoll, aber unterscheide unbedingt **GitHub-Freigabe** und **tatsächlich durchgeführte HA-Realabnahme**.
