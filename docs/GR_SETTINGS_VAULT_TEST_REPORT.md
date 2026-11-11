# Settings Vault · Abnahme GR 4.11.182 DEV

| Identität | Wert |
|---|---|
| Gewitterradar / HA | 4.11.182 DEV / 0.25.89 |
| Runtime / Module | `411182r1` / `E411-182A1` |
| Branch und DRA | `TheDaimos/gewitterradar@deploy/dev` |
| Geschützte Basis | `v4.11.181-dev` · `4587b76ca254fdc62cf179560fca9f61c1214133` |
| Release-Prüfungen | [öffentliche Vault-CI](https://github.com/TheDaimos/gewitterradar/actions/workflows/gr-settings-vault.yml) und [HA-Integrations-CI](https://github.com/TheDaimos/gewitterradar/actions/workflows/validate.yml) |

## Abnahmematrix

| Szenario | Prüfung und Nachweis |
|---|---|
| Individualisiertes V181-Profil → Vault | `tests/settings-vault-v181.json` und `scripts/test-settings-vault-browser.cjs` vergleichen wirksame Eye-Gruppierung, beide Ringabstände, Gold/Chrome, Energie, Snake, Wind-Studio, Temperaturfläche und Labels, effektive Opacity, Legende und Layout gegen V181. |
| Hydration vor Renderer und Write | Browser hält den ersten Vault-Read zurück und prüft, dass weder Karte noch Patch gestartet wurden. |
| Leerer Erstclient und drei getrennte Geräte | Desktop-Standardprofil, individuell migriertes Android- und abweichendes iPad-Profil im Browser-Fixture. |
| Verlust der Gerätezuordnung | Browserkontext mit leerem Clientzustand zeigt beide Entscheidungen. Explizite Wiederzuordnung lädt die bestätigten Werte. |
| WS-Ausfall, Retry und Reload | Browser-Fixture und Node-Tests prüfen sichtbaren Offline-Status, begrenztes Session-Pending, unveränderte Request-ID und bestätigte Wiederaufnahme. |
| Konflikt und zwei Schreibende | Python prüft disjunkte Merge-Pfade auch im selben Opacity-Objekt, Konflikt bei Überlappung und Wiederholung derselben Transaktion. Node prüft die explizite Auflösung und den Erhalt beider Fassungen. |
| HA-Store, Neustart, Benutzerisolation | `tests/test_settings_vault.py` nutzt den HA-Store und einen neuen Manager. Zwei authentifizierte WS-Clients prüfen gegenseitige Zugriffssperre, auch für Admin. |
| Teilweise ungültige Altwerte, zukünftiges Schema, Store-Fehler | Python prüft gültige Geschwisterfelder, Prototypfelder, Versionssperre, Prüfsummen, simulierten unbestätigten Write, Read-only-Recovery und Wiederholung. |
| Preset-Export, Import und Wiederherstellung | Python prüft Integrität, Vorschau, selektive Kopie, Import-Commit und Snapshot-Restore. |
| Optische Referenz | `test-eye-wow-browser.cjs` prüft 180 V177-Nullmodusframes und Geometrie. `test-eye-energy-browser.cjs` prüft 54 pixelidentische V180-Frames, zehn Farben, vier Modi, Kontakt und Lebensdauer in drei Browser-Viewports. |
| Lieferparität | `verify-frontend.mjs` und `test-frontend-build.mjs` prüfen kanonische Kennungen, Lieferkopien, Prüfsummen und Erkennung veränderter Dateien. `build-dev-packages.py`, `verify-eye-organic-packages.py` und `verify-hacs-integration-package.py` prüfen die Installationsartefakte. |

Die Browser-Fixtures verwenden Chromium mit Desktop-, Android- und iPad-Viewport und synthetischem HA-/WR-Transport. Die HA-Python-Tests prüfen Store und WebSocket getrennt. Die physische Android-Companion-Cachebereinigung, die Geräteabnahme und die Installation auf VM109 stehen als Betreiberprüfung aus. Siehe [Abnahmeprotokoll](GR_SETTINGS_VAULT_MIGRATION_AND_RECOVERY.md#betreiberabnahme-auf-android).

## Reproduktion

```powershell
node scripts/build-frontend.mjs
node --test tests/settings-vault-client.test.mjs
node scripts/test-eye-hub-model.mjs
node scripts/test-eye-wow-model.mjs
node scripts/verify-frontend.mjs
node scripts/test-frontend-build.mjs
node scripts/test-v411-identity.mjs
python -m pytest -q tests/test_settings_vault.py
node scripts/test-settings-vault-browser.cjs
node scripts/test-eye-wow-browser.cjs
node scripts/test-eye-energy-browser.cjs
python scripts/build-dev-packages.py <Ausgabeverzeichnis>
python scripts/verify-eye-organic-packages.py <Ausgabeverzeichnis>
python scripts/verify-hacs-integration-package.py
```

Python-Pins stehen in `validate.yml`. Die Browserprüfung verwendet Playwright 1.56.1, Leaflet 1.9.4 und Chromium. Das Paketwerkzeug baut aus einem Commit auf `deploy/dev`; `deployment.json` und `SHA256SUMS.txt` gehören zu den Lieferartefakten.

Ein zusätzlicher Lauf älterer, release-spezifischer Quellvergleiche wurde gegen den unveränderten V181-Stand gegengeprüft. Fünf der Vergleiche waren bereits in V181 rot, weil sie unveränderten Quelltext aus älteren Ständen voraussetzen. Die V177-/V180-Rendervergleiche und die aktuellen V181-Vergleiche prüfen die geschützte Referenz für den Vault.
