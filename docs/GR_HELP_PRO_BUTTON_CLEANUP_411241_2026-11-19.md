# GR 4.11.241 DEV – redundante Hilfe-Schaltflächen entfernt

**Basis:** GR 4.11.240 DEV, `c46a2d2feb6404f57c83923253f1f55181e772d0` (unverändert). **Ziel:** GR 4.11.241 / HA 0.25.148 / Runtime `411241r1` / Modulset `E411-241A1`.

## Änderung

- In allen WeatherRouter-/PRO-Hilfethemen einschließlich der PRO-Featureliste entfällt die redundante Schaltfläche „Zur Übersicht“ bzw. ihre sprachabhängige Übersetzung. Die Abschnitte bleiben über die vorhandenen `summary`-/Chevron-Elemente schließbar.
- Die vorhandene Schaltfläche des Standard-Eye-Hilfethemas und ihre Fokus-Rückgabe bleiben unverändert.
- Die Browser-Testmatrix prüft, dass nur das Eye-Standardthema noch eine solche Schaltfläche besitzt und das PRO-Thema keine.
- Wetterprovider, Kartenrenderer, Eye-/Touch-Logik, WR-Schnittstelle und gespeicherte Profile bleiben funktional unverändert. Ausschließlich Hilfe-Markup und versionsbedingte Cache-/Paketmetadaten ändern sich.

## Prüfungen und offene Abnahme

- `node scripts/build-frontend.mjs`: bestanden.
- `node scripts/test-frontend-build.mjs`: bestanden (deterministischer Rebuild, Spiegel- und Lieferinventar).
- `node scripts/test-i18n-help-browser.cjs`: **nicht ausführbar**; Playwright-Chromium fehlt, System-Chromium bricht in dieser Umgebung beim Unix-Socket mit `Operation not permitted` ab. Teständerung vorhanden, aber nicht als bestanden gewertet.
- Android-/HA-Realabnahme auf DEV VM109: **offen**. PROD VM101 unverändert.

Der Feature-Freeze bleibt bestehen. Diese Version ist keine neue offiziell freigegebene Referenz; GR 4.11.240 bleibt erhalten.
