# GewitterRadar 4.11.244 – DRA-Testbereitstellung (20.11.2026)

## Status
**Auf `deploy/dev` bereitgestellt**: GewitterRadar **4.11.244 DEV**, Home-Assistant-Integration **0.25.151**, Runtime **411244r1**, Module-Set **E411-244A1**.

Die Änderung betrifft ausschließlich den Willkommensdialog von GewitterRadar PRO: Nach dem automatischen Öffnen wird der Fokus auf den Dialog selbst gesetzt, nicht auf das goldene Schließen-X. Der unerwünschte blaue Fokusring beim Öffnen entfällt. Die sichtbare Tastatur-Fokusmarkierung bleibt für die Tastaturbedienung erhalten. Das vorhandene Logo, die Gestaltung und Funktionen bleiben unverändert.

## Technische Prüfungen
- PRO-Welcome-Fokustest: **PASS**
- Aktueller Frontend-/DRA-Spiegel: **PASS** (37 Module, 195 Frontend-Dateien)
- HACS-Integrationspaket: **PASS** (234 identische Dateien)
- Deterministischer Frontend-Build und Schutztests: **PASS**
- WeatherRouter-/Provider-Isolation: **PASS** (3 Tests)
- Modulmanifest, Touch-/Gesten- und Spiegelverträge: **PASS**
- `git diff --check`: **PASS**

Quellcommit: [`1be0ba6`](https://github.com/TheDaimos/gewitterradar/commit/1be0ba651775aabca1e84cfde1e965d72ec22fa1).

## Test auf der DEV-Maschine
1. GewitterRadar über den vorgesehenen **DRA-/DEV-Updateweg** auf **4.11.244 / 0.25.151** aktualisieren; Home Assistant bei Bedarf neu starten und den Browsercache neu laden.
2. Auf der DEV-Maschine ohne aktive WeatherRouter-Erkennung den GewitterRadar-PRO-Hinweis öffnen.
3. Prüfen: Das goldene **X** zeigt beim Öffnen **keinen blauen Ring**. Bei gezielter Tastaturnavigation ist die Fokusmarkierung weiterhin möglich.
4. Funktion, Bedienung und Darstellung auf Notebook, iPad und Smartphone gegenprüfen.

**Keine Änderung an PROD, kein FINAL-Tag, keine öffentliche FINAL-Veröffentlichung.** Die separat vorbereitete Lizenzumstellung auf dem Release-Vorbereitungsbranch wurde nicht in `deploy/dev` übernommen.
