# Nutzerorientierter Versionsverlauf · V4.12.15 DEV

**Frontend 4.12.15 DEV / HA 0.25.176 · Runtime `41215r1` · Modulset `E412-15A1`.** Quellcommit `0484cfb6e77ae57100085d6450686eea7b7307a6`, Branch `deploy/dev`.

Der Einstieg der V4.12-Historie bleibt erhalten. Die internen Hinweise auf Sprachanzahl, geschützte Referenzen und Geräteabnahme wurden durch die für Nutzer sichtbaren Neuerungen ersetzt: schlanke, verschiebbare Wetterlegenden, Premium und Compact Glass, individuelle Rahmen und Glasflächen sowie die im Verlauf der Entwicklung verbesserte Bedienung. Die deutsche und englische Ansicht sind inhaltlich abgestimmt. Auch die beiden Sprachanzahl-Erwähnungen im V4.11-Absatz entfallen. Frühere historische Versionsabschnitte und die Sprachumschaltung bleiben erhalten.

## Gezielte Prüfung

- [Strikter Quellschutz](evidence/gr-v412-history/source-proof.json): nur diese Textbereiche unterscheiden sich nach Normalisierung der regulären Release-/Importmetadaten. Alle Funktions- und Stilblöcke der Module unverändert; insbesondere Eye/Aura, Legend-Hub-Slots, Drag, Einzellegenden, Glas/Rahmen, Vault und Wetterpfade. Keine neuen Assets oder Einstellungen.
- Einmalige lokale Sichtprüfung mit bestehender echter Kartenfixture und synthetischem Transport: Integration und Dashboard, jeweils Deutsch/Englisch auf Desktop 1280×900 und Android-Hochformat 393×851. Alle acht Ansichten ohne horizontalen Überlauf; Sprachumschaltung und Schließen funktionieren. [Prüfprotokoll](evidence/gr-v412-history/visual-review.json), [Android Deutsch](evidence/gr-v412-history/ha-android-de.png), [Desktop Englisch](evidence/gr-v412-history/dashboard-desktop-en.png). Repräsentative Bilder visuell kontrolliert; Android ist Browseremulation.
- Ein Build; Identität, 37 Module, 210 Kern-Frontenddateien, Spiegel/Inventar, Hi-Res-Retention, DRA- und statische Python/JSON/YAML-Prüfung bestanden. Zwölf aktuelle öffentliche Pflichtketten grün; [CI-Nachweis](evidence/gr-v412-history/ci-results.json). Die unveränderten funktionalen Browserprüfungen der V4.12.14 bleiben durch den strikten Quellvergleich gültig. Keine neue vollständige Wetter-/Aura-/Drag-Kampagne für diese Textkorrektur.

## DEV-Bereitstellung

[V4.12.15 DEV](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.12.15-dev).

| Installationspaket | SHA-256 |
| --- | --- |
| [gewitterradar-0.25.176-dev.zip](https://github.com/TheDaimos/gewitterradar/releases/download/v4.12.15-dev/gewitterradar-0.25.176-dev.zip) | `d075b48b050a1b3634319da9344e411680fa093b5d21714935b7c3cb6e589e37` |
| [gewitterradar-dashboard-4.12.15-dev.zip](https://github.com/TheDaimos/gewitterradar/releases/download/v4.12.15-dev/gewitterradar-dashboard-4.12.15-dev.zip) | `ef342c09ea7fdea4339bb8ffc071110ca4cc880c7fe480749158041275706cf8` |

Beide Archive gegen sämtliche ursprünglichen Git-Blobs und CRC geprüft; bytegleich mit Linux-CI. 250 Integrations- und 233 Dashboard-Dateien, 231 gemeinsame Frontenddateien identisch. [Deploymentmanifest](evidence/gr-v412-history/deployment.json), [Prüfsummen](evidence/gr-v412-history/SHA256SUMS.txt), [Original-/Linux-Abgleich](evidence/gr-v412-history/original-blob-verification.json). DRA weiterhin `TheDaimos/gewitterradar` / `deploy/dev`.

DEV-Prerelease, keine FINAL-Veröffentlichung. Geschützte Referenzen, WeatherRouter und VM101 unverändert. Keine physische HA-/Android-Installation behauptet; diese erfolgt durch den Betreiber.
