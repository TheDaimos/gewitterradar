# Gewitterradar V4.11.99 DEV – GR-RF-04

**19.10.2026 · deploy/dev · Integration 0.25.17 · Laufzeit 41199r1 · Modulsatz E411-99A1**

## Fehler A: Diagnosewahrheit für Canvas-Zeichenfolge

Die korrelierten GR-Rohereignisse der gemeinsamen Realabnahme enthalten bei `v2_layer_swapped` gleichzeitig `render_order_verified: true`, `render_order: []` und `observed_draw_orders: []`. Der tatsächliche Fehler lag in der kompakten Diagnoseaufzeichnung: `_weatherEngineMonitorEvent` entfernte Objekte und verschachtelte Arrays aus diesen Feldern, ließ aber den getrennt gelieferten booleschen Verifikationswert bestehen. Das erklärt den Widerspruch innerhalb derselben Korrelationskennung. Der Canvas-Renderer wird deshalb **nicht** wegen einer unbewiesenen Zeichenreihenfolgenstörung umgebaut.

Die Diagnose bewahrt jetzt beschränkte, ausdrücklich erlaubte Quellenobjekte (`render_order`, `source_order`) und tatsächlich aus den Kachel-Ergebnissen abgeleitete Zeichenfolgen (`observed_draw_orders`). Ohne eine beobachtete Folge bleibt `render_order_verified` negativ. Allgemeine Diagnosedaten bleiben streng begrenzt und zugangssicher. `drawImage` beweist weder undurchsichtige noch meteorologisch gültige Niederschlagspixel.

## Fehler B: RF02-Ausfallschutz – bestätigte regionale Ungültigkeit

Der neue kontrollierte Produktionspfadtest fand einen tatsächlichen RF02-Sicherheitsfehler: Kam `outside_coverage` explizit in `source_outcomes` an, aber ohne zusätzliche transiente Warnung, konnte `decideV2RegionalRetention` zunächst `no_transient_coverage_evidence` ausgeben. Eine bereits laufende Zurückhaltung wurde dann nicht sofort beendet.

Die Reihenfolge wurde korrigiert: **explizite Quell-Ungültigkeit vor transienter Nichtverfügbarkeitsprüfung**. Bestehende regionale Ebenen dürfen bei `outside_coverage`, `source_stale` und weiteren fachlichen Ablehnungsgründen nicht weiter zurückgehalten werden. Unverändert: höchstens 45 Sekunden ab ursprünglichem Beginn, keine Fristverlängerung durch Folgeversuche, ursprüngliche UTC-Altersgrenzen, opt-in und geografischer Löschschutz.

## Regressionen und Nachweise

- `scripts/test-p7-010-rf-04.mjs`: sichere Diagnoseaufzeichnung, getrennte Korrelationskennungen, echte Aufrufreihenfolge von Canvas-`drawImage`, kein Pixelnachweis.
- `scripts/test-p7-010-rf-04-regional-hold.mjs`: sieben reproduzierbare RF02-Szenarien einschließlich produktivem Halte- und Ablaufzustand; keine Störung realer WR-/Wetterdienste.
- Bestehende `scripts/test-p7-010-rf-01.mjs`, `scripts/test-p7-010-rf-02.mjs`, `scripts/test-p7-010-rf-03.mjs` und die übrigen P7-010-Regressionsfälle bleiben aktiv.
- Frühere akzeptierte HA-Realtests (insbesondere DWD-/NASA-Mosaik, Firefox und Deutschland→Kuba→Deutschland) behalten Bestandsschutz. **Der tatsächliche HA-Live-Nachweis eines DWD-Coverage-Timeouts bleibt ausstehend.**
- **Kein HA-REAL-PASS aus automatisierten Tests ableiten.**

WeatherRouter-Code und öffentliche Repository-Inhalte zu privaten Exports bleiben unverändert. Exportablage ausschließlich `TheDaimos/Project-Log-And-Export`.

**C.K. – Eine Idee weiter gedacht.**
