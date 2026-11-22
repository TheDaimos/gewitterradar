# GR V4.12 DEV – Arbeits- und Schutzakte

## Ausgangsbasis vor Implementierung

GR `deploy/dev`: `ad521c476a046d53ef8308bb252243d9c584ea35`, intern 4.11.254 / HA 0.25.161. Geschützte öffentliche Ausgangsreferenz: `v4.11.3`, V4.11.03 FINAL, `af70fe2bf85a88fdea402cf46e3bd6a11903189b`, ebenfalls intern 4.11.254 / HA 0.25.161. Der funktionale Frontend-Unterschied besteht nur in Kommentaren; Builddatum und Veröffentlichungsmetadaten unterscheiden sich. Kein Rücksetzen des neueren DEV-HEAD.

WR `deploy/dev` lesend geprüft: `728cf9ff8291fdb2e56b95e62ca1d48af7217039`. GR-Bootstrap, beide Modul-/Provider-Schutzregeln, Referenzpaar vom 13.11. und Eye-Randpositionierung 4.11.215 gelesen. Bestehende Betreiberreferenzen bleiben geschützt. Eine neue technische Aura-Referenz ersetzt keine ausstehende HA-/Android-Betreiberabnahme.

## Eingriffsbereich und Regressionsrisiken

Teil 1 betrifft ausschließlich Eye-UI-Geometrie, sichtbare Aura-Zuordnung, endliche Übergänge, Konfiguration und Versions-/Buildwerkzeuge. Die vorhandene Slotbelegung bleibt von der visuellen Zuordnung getrennt. Ausgeschaltete Wetter-Layer behalten ihr Icon. Gemeinsame Ressourcen: Eye-DOM, Canvas-/Frame-Scheduler, Settings Vault, Frontend-Importrevisionen. Deshalb Neon-Fusion, Profilwechsel, Touch-Recovery, Randpositionen und Modulidentität erneut prüfen.

Unbetroffen bleiben WR-Providerwahl, Freshness/Coverage, DWD-/OPERA-/NASA-Kacheln, Wind-Schlangenrenderer, Temperatur- und Synoptikdaten. Keine Datenverträge oder Wetterentscheidungen ändern. Bestehende Vertragsregressionen ausführen. PROD VM101 bleibt unverändert.

Teil 2 beginnt erst nach separat dokumentiertem, geprüftem und installierbar bereitgestelltem Aura-Zwischenstand. Ergebnisse, Versionen, Quellcommits und tatsächliche Testgrenzen werden hier beziehungsweise im zugehörigen Prüfbericht ergänzt.
