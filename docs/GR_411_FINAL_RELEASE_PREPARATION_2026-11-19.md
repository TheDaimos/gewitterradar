# GewitterRadar 4.11 FINAL – Releasevorbereitung (19.11.2026)

**Branch:** `release/v4.11-final-prep` · **Basis:** `a70a4da38b993427067ad741d5b1f06758493c18` · **Lizenz-Commit:** `eac10147b329675645eb0cc1b278556ae4dc0fae`

## Erledigt

- Modell B als Releasekandidaten-Lizenz in `LICENSE` vorbereitet, Urheberangabe ausschließlich **Christian Köhler**. `COPYRIGHT.md`, `BRANDING.md` und README angepasst.
- Unveränderter früherer GPL-3.0-only-Lizenztext unter `docs/licenses/GPL-3.0-only-historical.txt` gesichert. Frühere GPL-Rechte werden nicht rückwirkend verändert.
- Standard-HACS-Staging mit **234 byte-identischen Dateien** bestanden.
- Frontend-/Modul-/DRA-Verträge bestanden: **37 Module, 195 Dateien**, exakte Parität und SHA256SUMS erfolgreich.
- PRE_MERGE-Quellarchiv aus der unveränderten Basis `a70a4da` erfolgreich erzeugt und lokal verifiziert (ZIP SHA-256 `e3a1758fc1d56f8b4cfdc4f1872530e84327623180e802fee84b98b905e8b637`; Bundle SHA-256 `e0198674b403816353f546a5aa56037192acc2213cba2abeb0af3e61bf1d5eae`).
- 31 zusätzliche V4.11-JavaScript-Skripttests ausgeführt: **23 bestanden, 8 fehlgeschlagen**. Mehrere Fehlschläge besitzen hart kodierte historische Versionsstände (z. B. 4.11.34/38/77); die laufenden aktuellen Schutztests blieben separat grün. Die acht Fehlschläge wurden **nicht** stillschweigend als PASS eingestuft.

## Noch verbindlich vor PUBLIC FINAL

1. **FINAL-Runtime- und HA-Identität** konsistent definieren und alle Installationspakete daraus reproduzierbar erzeugen. Der eingefrorene Quellstand ist noch `4.11.243 DEV / HA 0.25.150`; keine unbelegte Behauptung einer FINAL-Kennung.
2. **Lizenz-Außendarstellung** über alle derzeitigen Hilfe-/About-Oberflächen und den Releasezweig abgleichen: dort existieren noch ältere GPL-Texte. Keine unvollständige Neulizenzierung veröffentlichen.
3. **Python/HA-CI:** lokaler Versuch mit einem veralteten Home-Assistant-2025.1-Testharness endete bei der Testsammlung an nicht vorhandenen HA-2026-APIs. Diese Umgebung ist **nicht** repräsentativ. Die bereits vorhandene öffentliche `.github/workflows/validate.yml` verwendet Python 3.14 und HA 2026.9 und muss auf dem exakten Kandidaten erfolgreich laufen.
4. **Historische Test-Fixtures und Browser-/Touch-Regressionen** nachvollziehbar beurteilen, aktuelle Gates unverändert schützen. Kein realer HA-DEV-Installations-/Rollbacktest wurde in dieser lokalen Sitzung vorgenommen.
5. Erst mit dokumentierten grünen Gates: FINAL-Release auf stabiler Publikationslinie mit eindeutigem Tag, HACS- und DRA-Metadaten, unveränderlichem Golden-Master-Archiv und Release Notes. PROD VM101 bleibt ausdrücklich unberührt.

**Entscheidung: NO-GO für ein öffentliches FINAL bis zur Schließung der Punkte.** Die Betreiber-Sichtabnahme ist gültig, ersetzt aber keine fehlende technische Freigabe. Die neue Releasevorbereitungs-Branch ist nicht die bestehende `deploy/dev`-Referenz und kein produktiver Release.
