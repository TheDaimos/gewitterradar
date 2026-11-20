# GewitterRadar 4.11.244 DEV – PRO-Welcome-Schließen ohne anfänglichen Fokus-Ring

**Datum:** 20.11.2026 · **Ausgangsreferenz:** 4.11.243 DEV / HA 0.25.150 · **Neuer Kandidat:** 4.11.244 DEV / HA 0.25.151 / Runtime `411244r1` · **Branch:** `release/v4.11-final-prep`

## Anlass und Betreiberentscheidung

Der Betreiber hat den PRO-Welcome-Dialog auf einem DEV-Klon ohne WeatherRouter erfolgreich getestet. Nach dem Neustart von Home Assistant und Browser-Cache-Bereinigung wurde der Dialog korrekt angezeigt. Visuell bevorzugt der Betreiber das originale goldene Schließen-X **ohne** den zufällig beim Öffnen erscheinenden blauen CSS-Fokusring.

## Umsetzung

- Die originale Hi-Res-X-Grafik und die Dialoggestaltung bleiben unverändert.
- Das automatische Fokussieren des Schließen-Buttons (`autofocus`) wurde entfernt.
- Der Dialog selbst ist programmatisch fokussierbar (`tabindex="-1"`); nach `showModal()` wird der Fokus auf den Dialog gesetzt, ohne Scrollsprung.
- Die bestehende `:focus-visible`-Markierung bleibt bei tatsächlicher Tastaturnavigation auf interaktiven Bedienelementen erhalten. Es wird **keine** globale Fokusregel deaktiviert.
- Produkt- und HA-Version, Runtime-Cachekennung, 37 Modulidentitäten, DRA-Provenienz und beide Frontend-Spiegel wurden synchronisiert. Wetter- und Providerlogik sind unverändert.

## Lokale Prüfungen

| Prüfung | Befund |
| --- | --- |
| `node scripts/test-v411244-pro-welcome-focus.mjs` | PASS – Fokus-Ziel, fehlendes `autofocus` am X, erhaltenes `:focus-visible`, Spiegel |
| `node scripts/build-frontend.mjs` | PASS |
| `node scripts/verify-current-frontend.mjs` | PASS – 37 Module, 195 Dateien, Runtime-/DRA-/Mirror-Parität |
| `node scripts/test-frontend-build.mjs` | PASS – deterministischer Build und Fail-Closed-Proben |
| `node scripts/test-v411-final-active-gates.mjs` | PASS – 23 aktuelle V4.11-Skripttests; 8 historische Tests bleiben erhalten |
| `node scripts/test-v411-final-license-help.mjs` | PASS – 15 Sprachtexte, Lizenz-/Help-Spiegel |
| `python scripts/verify-hacs-integration-package.py` | PASS – 235 byteidentische Installationsdateien |

**Abgrenzung:** Dies sind Quell-/Vertragsprüfungen. Der Browser-Screenshot des Betreibers belegt das **Vorher** und die gewünschte Referenz, noch keinen Realtest des neuen Fokusverhaltens. Ein HA-DEV-Realtest nach Installation der 4.11.244 steht aus. Kein FINAL-Tag und keine PROD-Änderung.
