# V4.11.210 DEV – Synoptik-Minimieren im Wind-Premium-Design

**GR 4.11.210 DEV / HA 0.25.117**, Branch `deploy/dev`, 15.11.2026.

Die Synoptik verwendet weiterhin die gemeinsame `premiumAction('minimize', ...)`-Komponente. Ausschließlich die Stilregeln des Synoptik-Header-Buttons wurden an die bereits vorhandene Winddarstellung angeglichen: 40 Pixel Breite, 30 Pixel Höhe, 8 Pixel Rundung, Metall-Gold-Rahmen und dunkler Verlauf statt des großen eckigen Controls. Der Button bleibt im 40-Pixel-Touchbereich und behält `togglePremiumPanel(panel,'synoptic-settings')` bei. Das runde Hi-Res-Schließen-Icon, Farbpicker, Wind, Radar, Eye, Vault und Synoptik-Daten bleiben unverändert.

Gezielter Test: `node --test tests/synoptic-minimize-style-411210.test.mjs` (Quellcode-/Event-Wiring-Regressionscheck). Automatisierte Spiegelung, Prüfsummen und öffentliche DEV-Auslieferung durch vorhandenen `gr-synoptic-build-sync.yml`-Workflow. Reale Android-Sichtprüfung auf VM109 noch erforderlich. WR und PROD VM101 bleiben unverändert.
