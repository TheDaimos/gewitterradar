# GR 4.11.245 DEV – Eye Hub nur bei aktiver PRO-Verbindung

**Stand:** 20.11.2026 · **Ziel:** `deploy/dev` / DRA · **HA:** `0.25.152` · **Runtime:** `411245r1`

## Änderung

- Der Eye Hub (zentrales goldenes Eye, Bubble-Menü und zugehöriger Zugang zu Eye Control in den Karteneinstellungen) ist bei fehlender, noch ungeklärter oder nicht betriebsbereiter WeatherRouter-Verbindung ausgeblendet.
- Erst die bereits vorhandene, authentifizierte Home-Assistant-Consumer-Discovery mit `router.ready === true`, `router.enabled === true` und `router.status === 'ready'` schaltet das Eye frei.
- Bei Verbindungsverlust, Timeout oder nicht betriebsbereitem Router wird das Eye wieder ausgeblendet. Bereits geöffnete Eye-Blasen und Eye Control schließen sich. Nach erneut bestätigter Verbindung wird der Eye Hub automatisch wieder sichtbar.
- Positionen, Slots, Auren und Profile bleiben gespeichert. Basisfunktionen einschließlich Blitzkarte, Standortsuche und Radiusanzeige sowie separate WeatherRouter-Layer-/Providerlogik bleiben unangetastet.
- Der PRO-Willkommenshinweis und die bereits abgenommene Korrektur des blauen Fokusrings bleiben erhalten.

## Prüfung

| Gate | Ergebnis |
| --- | --- |
| Neuer Eye-PRO-Statusschutztest | PASS |
| Consumer-/Provider-Isolation (3 Tests) | PASS |
| Aktueller Frontend-/DRA-Spiegel (37 Module / 195 Dateien) | PASS |
| HACS-Paket (234 Dateien) | PASS |
| Reproduzierbarer Frontend-Build | PASS |
| Modulmanifest-/Touch-Vertrag | PASS |
| `git diff --check` | PASS |

**Realtest auf HA DEV VM109 steht aus.** Vorgeschlagene Abnahme:

1. Ohne WeatherRouter: GR-Basisfunktionen sichtbar, Eye und Eye-Control-Zugang ausgeblendet; PRO-Willkommensdialog sichtbar, sofern nicht zuvor abgewählt.
2. WeatherRouter installieren/aktivieren: Nach erfolgreicher Consumer-Erkennung wird Eye inklusive gewohnter Belegung eingeblendet.
3. WR stoppen und wieder starten: Eye verschwindet bei festgestelltem Verbindungsverlust und kehrt nach erfolgreicher Erkennung zurück; gespeicherte Eye-Einstellungen bleiben unverändert.
4. Notebook, iPad und Smartphone auf sichtbares Verhalten und Touch-Bedienung prüfen.

**PROD VM101, FINAL-Tag, Lizenz und geschützte Referenzstände wurden nicht geändert.**
