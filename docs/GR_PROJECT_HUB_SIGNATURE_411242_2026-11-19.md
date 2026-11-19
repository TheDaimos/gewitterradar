# GR 4.11.242 DEV – Signatur im Project Hub

**Baseline:** GR 4.11.241 DEV, GitHub-Commit `d42d081a717a7b31889ab618963561c180d5e99d` (unverändert). **Folgestand:** GR 4.11.242 DEV / HA 0.25.149 / Runtime `411242r1` / Modulset `E411-242A1`.

## Gezielter Änderungsumfang

In der lokal mitgelieferten Project-Hub-Ansicht steht direkt unter „Eine Idee weiter gedacht.“ die kleine Signatur **„Konzept und Entwicklung: Christian Köhler“**. Dafür wurde nur ein neues Text-Element und seine eigene Schrift-/Abstandsregel ergänzt. Das vorhandene CK-Logo, die Original-Sprite-Dateien, sämtliche Linien-, Rahmen- und Verzierungsregeln, die Projekteinträge und die Navigation bleiben unverändert.

Die übrigen Funktionsbereiche (Niederschlag, Wind, Temperatur, Synoptik, Eye, Touch und WR-Anbindung) sind vom Quellcode-Änderungsumfang ausgenommen. Weitere Quelländerungen betreffen nur Versions- und Cache-Revisionen sowie generierte Frontend-Spiegel.

## Verifikation

- `node scripts/build-frontend.mjs`: PASS.
- `node scripts/test-frontend-build.mjs`: PASS, deterministischer Rebuild und DRA-/Frontend-Spiegel.
- `node scripts/test-v41108-project-hub.mjs`: PASS, vorhandener Project-Hub-Runtime-Vertrag.
- `git diff --check`: PASS.
- Sichtprüfung auf HA DEV VM109 / Android: **offen**, nicht simuliert oder behauptet.

**Lieferweg:** `TheDaimos/gewitterradar@deploy/dev`, DRA V2 DEV. Die bisherige 4.11.241 bleibt unangetastet; PROD VM101 und WeatherRouter wurden nicht geändert. Keine Referenz-Promotion ohne Betreiberabnahme.
