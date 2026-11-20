# P1-Folgeauftrag – Synoptik-Verfügbarkeit und fünfter Eye-Slot

**Stand:** 13.11.2026 · **GR 4.11.206 DEV / HA 0.25.113** · Branch `deploy/dev` · WR weiterhin 0.10.322 DEV.

## Reale Fehlerursachen

1. In `eye-hub-registry.js` wurde `available` ursprünglich ausschließlich durch geladene H/T- oder Isobarenframes bestimmt. Da die Synoptik standardmäßig deaktiviert ist und beim Start keine Frames anfordert, zeigte Eye ein Warnsymbol ohne belegten WR-Fehler. Der Status wird nun explizit nach `off`, `not-loaded`, `loading`, `available` und `unavailable` bestimmt. Die unbekannten Zustände erhalten **kein** Nichtverfügbarkeits-Warnsymbol; sie werden als **ungeprüft** bezeichnet, nicht als bestätigte Live-Verfügbarkeit.
2. Die Frontend-Funktionsliste enthielt bereits `synoptic`, die serverseitige `vault_schema.py` ließ jedoch nur vier Eye-Funktionen zu. `SettingsVaultClient.change()` muss den validierten Schlüssel akzeptieren; der bisherige Catch im Eye-Patch verbarg den Fehler. Nun ist die fünfte Funktion mit eigener Farbe im serverseitigen Schema enthalten; Speicherausfälle werden im Konfigurator angezeigt. Auch `gewitterradar:synoptic-ui:v1` wird nun von der Vault-Validierung akzeptiert.
3. Bestehendes Conflict-Merge `merge_fields` schützt unveränderte Slot-Arrays bei konkurrierenden alten Einstellungen, ersetzt aber ein bereits geändertes Array nicht stillschweigend. Spezifische P1-Regressionen decken beide Fälle ab.

## Schutzbereich

Die ersten vier Eye-Slots, Aura-Farben, Ringgeometrie, Gruppierung, Positionen, Gesten und Wind-/Temperatur-/Niederschlags-Darstellungen wurden nicht zurückgesetzt. Kein Schreibzugriff auf PROD VM101. Nur GR-DEV auf `deploy/dev`; WR unverändert.

## WR V2 Vertrag und Grenzen

GR ruft nach Aktivierung `weather_router/consumer/resolve_synoptic` mit `contract_version:2`, jeweiliger Synoptik-Capability, `context:{bbox}`, `time:{mode:'latest'}` und optionalem `profile_id` ab. Der WR-Consumer antwortet mit `schema:'weather_router.consumer.synoptic.v2'`, `status:'ready'` und validiertem Frame oder `status:'unavailable'` samt Code. GR rendert nur passende gültige EPSG:4326-Features und übernimmt WR-Provider- und Zeitentscheidung. Ein abgeschaltetes Overlay löst keine Abfrage aus; das ist **kein** bestätigter verfügbarer Provider. Ein erfolgreicher Live-Abruf auf DEV VM109 ist allein aus CI-/Quellprüfungen nicht nachgewiesen.

## Tests und Installation

Die öffentlichen Tests `tests/synoptic-dev-v411198.test.mjs` und `tests/test_synoptic_p1_schema.py` prüfen die Statusfälle, gültige und ungültige Frames, Slot-Konfiguration, Server-Validierung, Serialisierung/erneute Hydration, einen konkurrierenden alten Vier-Slot-Stand und echten Conflict-Merge. `tests/test_settings_vault.py` enthält zusätzlich eine asynchrone End-to-End-Vault-Reboot-Regression mit isoliertem FakeDisk. Die vollständige HA-DEV-Abnahme und echter Providerabruf müssen nach der installierbaren DEV-Veröffentlichung auf VM109 erfolgen. Den ersten fehlerhaften Android-Sichttest ausdrücklich nicht als bestanden markieren.

Die CI zur öffentlichen DEV-Auslieferung synchronisiert `frontend`, `custom_components/gewitterradar/frontend`, `dashboard/dist`, Asset-Prüfsummen und Packagemetadaten. Kein privater WR-Actions-Job.

## Weiterführung und tatsächliche Abnahme

Der zusätzliche Android-nahe Chromium-Test belegt den fünften Slot über `_eyeHubAssign(4, 'synoptic')`, prüft die abgeschlossene Settings-Vault-Speicherung, den wieder geöffneten Eye-Konfigurator, Reload auf demselben Gerät und Profil-Hydration in einem zweiten Browserkontext. Dies ist eine simulierte Browser-Abnahme mit gemocktem HA-Vault, **kein** echter Android-/VM109-Remotezugriff.

Mit GR 4.11.206 werden **getypte** WR-V2-Ergebnisse pro Capability gespeichert (`ready`/`unavailable`). Erfolgreiche Herkunftstexte wie `ECCC · Uhrzeit` gelten nicht fälschlich als Fehler; ein ausgeschaltetes Overlay bleibt `off`, auch wenn vor dem Abschalten ein WR-Fehler vorlag. Nur bestätigte negative WR-Rückgaben, fehlgeschlagene Abfragen, abgelaufene Frames oder ein belegter Leaflet-Ausfall ergeben bei aktiviertem Overlay eine Nichtverfügbarkeitswarnung. Der bestehende GR-900-Sekunden-Verzicht und die WR-Providerentscheidung bleiben unverändert.

Öffentliche, für GR 4.11.206 gezielte Synoptik-Regression: [Actions Run 43460752908](https://github.com/TheDaimos/gewitterradar/actions/runs/43460752908) **SUCCESS**. Öffentliche DEV-Auslieferung mit aktualisierten Spiegeln und Integritätsprüfsummen: [Actions Run 43460752888](https://github.com/TheDaimos/gewitterradar/actions/runs/43460752888) **SUCCESS**. HACS meldet weiterhin das vorbestehende `SPDX: NOASSERTION` der vereinbarten Modell-B-Lizenz; die Lizenz wurde ausdrücklich **nicht** geändert.
