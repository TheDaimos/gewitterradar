# Offizieller geschützter DEV-Referenzstand – WeatherRouter 0.10.320 / GewitterRadar 4.11.195

**Betreiberfreigabe:** 13.11.2026: „Augenscheinlich alles in Ordnung. Bitte Versionsstand jetzt als referenz hinterlegen.“

**Status:** **OFFIZIELL GESCHÜTZTES REFERENZPAAR** für weitere DEV-Entwicklung. Reale qualitative Sichtabnahme des Betreibers nach Installation; keine erfundene vollständige Android-/Browser-/HA-Testmatrix. Frühere Referenzen bleiben als historische Rückfallstände bestehen.

| Bereich | Verbindliche Referenz |
|---|---|
| WeatherRouter | **0.10.320 DEV**, Loader **0.10-loader-323**, DRA `2026-11-13-progressive-dwd-v010320` |
| GewitterRadar | **4.11.195 DEV**, HA-Integration **0.25.102** |
| GR-Runtime | `411195r1` |
| GR-Modulset | `E411-195A1`, 36 registrierte Module |
| Installation / reale Sichtung | **HA DEV VM109**, Android-Betreiberfeedback: augenscheinlich in Ordnung |
| PROD | **VM101 nicht verändern** |
| WR Repository-HEAD unmittelbar vor dieser Dokumentation | `71b9c9ec4e9cf889220fb52f79869dba91095e87` |
| GR Repository-HEAD unmittelbar vor dieser Dokumentation | `b6cca8b707f73767ba26bfbf27ae5d5d608a9400` |
| GR 4.11.195 Paket- und Implementierungsquellcommit | `cd8b26895ad40e5154e2a242e0437d4fba45eadd` |

**Unveränderlicher Identitätsanker:** Die oben genannten 40-stelligen Commit-SHAs und veröffentlichten Release-/Build-Identitäten; spätere Dokumentations-Commits am HEAD sind **keine neuen installierten Versionen**. Diese Referenzdokumentation erzeugt kein neues Release, keinen neuen Quellcode-Build, kein Release-Tag und keine PROD-Änderung.

## Abgenommener Funktionsumfang

- Niederschlag: DWD, OPERA und NASA in der bisherigen WR-gesteuerten Mosaik-/Coverage-/Freshness-Architektur; Provider bleiben voneinander isoliert.
- WR 0.10.320: schnelle cache-first DWD-Coverage-Bereitschaft ohne mehrsekündiges Cold-Preflight-Blockieren der übrigen V2-Antwort.
- GR: schon vorhandene Kacheln erhalten, Cache-/Seamless-Handover-Verhalten und vorhandene Wind-, Temperatur- und sonstige Wetterfunktionen geschützt.
- GR 4.11.195: Reparatur konkurrierender Layoutpfade bei ungruppierten WR-Icons Wind/Temperatur/Niederschlag; einheitlicher Positionspfad einschließlich Transparenz; gespeicherte individuelle Positionen und Gruppierung bleiben erhalten.
- Optik und Interaktion: freigegebene Hi-Res-Icons, Eye, Touch/Drag/Short-Tap/Long-Press, Premium-Menüs, Wind-Schlangenrenderer mitsamt Einstellungen, Temperatur- und Niederschlagsdarstellung schützen.
- WR entscheidet allein über Providerzulässigkeit und meteorologische Aktualität. GR darf keine zusätzliche feste 900-s-Freshnessregel einführen.
- H/T-/Isobaren-Provider und Module, soweit im aktuellen DEV enthalten, werden als Codebestand bewahrt, **nicht** ohne separaten Nachweis als vollständig live-abgenommen erklärt.

## Realer und automatisierter Nachweis

**Betreiber:** Nach Installation der GR-4.11.195-Aktualisierung: „Augenscheinlich alles in Ordnung.“ Das ist die ausdrückliche qualitative Freigabe und Grundlage dieser Referenz, aber **keine ausdrückliche Bestätigung jeder einzelnen Moduldiagnosekennung oder eines neuen vollständigen Inkognito-Exports**.

**GR Entwicklungsbericht:** [GR_P0_ANDROID_WR_ICON_POSITION_411195_2026-11-13.md](https://github.com/TheDaimos/gewitterradar/blob/deploy/dev/docs/GR_P0_ANDROID_WR_ICON_POSITION_411195_2026-11-13.md); Browserregression mit 0 Positions-/Style-Mutationen für alle 4 Icons bei gleichbleibender Geometrie, 36 registrierte Module, öffentliche [Icon-CI](https://github.com/TheDaimos/gewitterradar/actions/runs/43430234204/job/131901603623) erfolgreich. Bestehende historische Snapshot-Fehlschläge und nicht auf tatsächlichem Android-Gerät ausgeführte Entwicklerprüfungen nicht als grünes Ergebnis deklarieren.

**WR-V2-Export:** privates `TheDaimos/Project-Log-And-Export@main`, Datei `exports/weather-router/2026-11/diagnostics/2026-11-13T10-58-12Z__weather-router__0.10.320__diagnostics__untagged-48fc817709634085ac6c9d32fb70b08f.json`; 46 Anfragen, Median 101,42 ms, Max 612,81 ms, keine Anfrage über 1 s (nicht dieselbe Stichprobe wie WR 0.10.319). Damit ist die Beseitigung der zuvor beobachteten mehrsekündigen DWD-Preflight-Blockaden im Test dokumentiert. Kein vollständiger Nachweis der Browser-Kachel-End-to-End-Latenz.

## Verbindlicher Schutz ab dieser Referenz

1. **Kein neues Modul und kein neuer Provider darf bestehende funktionierende Module oder Provider einschränken** – unabhängig von Richtung, Datentyp, Renderer oder Geräteansicht.
2. Vor Änderungen an H/T, Isobaren, Fronten oder anderen Capabilities die unbetroffenen DWD-/OPERA-/NASA-, Wind-, Temperatur-, Eye-/Touch- und Cache-/Handover-Pfade auf ungewollte Regression prüfen.
3. Cross-Provider-/Cross-Modul-Verträge einhalten: [WR-Schutz](https://github.com/TheDaimos/weather-router-dev/blob/deploy/dev/docs/MODULE_PROVIDER_ISOLATION_GUARD_2026-11-13.md) und [GR-Schutz](https://github.com/TheDaimos/gewitterradar/blob/deploy/dev/docs/MODULE_PROVIDER_ISOLATION_GUARD_2026-11-13.md).
4. Änderungen nur in neu versionierten DEV-Releases, ausgehend vom aktuellen DEV-HEAD, niemals durch Überschreiben oder Rücksetzen dieser historischen Referenz. Geschützte optische Stände und Einstellungen unverändert lassen, außer nach ausdrücklicher Betreiberfreigabe.
5. Diese Freigabe ist **kein Abschlussnachweis** für noch offen ausgewiesene umfassende Progressive-Streaming-Implementierung, ältere Snapshot-Regressionen, eine vollständige Android-Gerätematrix oder eine neue detaillierte Inkognito-/Runtime-Diagnose. Solche Themen bei Bedarf separat nachprüfen; nicht als Erledigt buchen.
6. Die bloße Dokumentation ist noch kein automatisch erzwungenes technisches CI-Gate. Bestehende Schutzregeln durch ausführbare Regressionen weiter absichern, nicht durch wiederholte Bootstraps ersetzen.

## Verbindlicher Einstieg für zukünftige Chats/Codex

**Erst dieses Referenzpaar lesen und den aktuellen HEAD vergleichen.** Anschließend projektspezifischen `docs/PROJECT_BOOTSTRAP.md`, `AGENTS.md`, die Schutzdateien und betroffene Quellen öffnen. Diese Referenz nicht mit dem neuesten HEAD verwechseln; den Stand niemals stillschweigend als ungeprüft ersetzen.

**Frühere Referenz** WR 0.10.318 / GR 4.11.187 bleibt historisch erhalten, ist jedoch nicht mehr das aktuelle aktive geschützte Referenzpaar.
