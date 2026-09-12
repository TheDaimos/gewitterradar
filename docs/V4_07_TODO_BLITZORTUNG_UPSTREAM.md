# V4.07 To-do – Blitzortung Upstream

Stand: 12.09.2026

## Offener Punkt

- [ ] Entwickler von `mrk-its/homeassistant-blitzortung` kontaktieren.
- [ ] Vorschlagen bzw. anfragen, den offiziellen Reconfigure-Flow so zu erweitern, dass ein bestehender Blitzortung-ConfigEntry zwischen **festen Koordinaten** und einer **Standort-Entity** (`device_tracker`, `person`, `zone`) umgestellt werden kann.
- [ ] Idealerweise soll auch eine bestehende Standort-Entity über den offiziellen Reconfigure-Flow gewechselt werden können.

## Hintergrund

Gewitterradar V4.07 soll einen dynamischen virtuellen Standortadapter wie `device_tracker.gewitterradar` verwenden können. Blitzortung akzeptiert Standort-Entities bereits beim Neuanlegen, der aktuelle Reconfigure-Flow unterstützt jedoch nur Koordinaten-Einträge und kann nicht von Koordinaten auf eine Entity wechseln.

## Zwischenlösung für V4.07

Bis eine Upstream-Lösung verfügbar ist, gilt folgende akzeptierte Vorgehensweise:

1. Gewitterradar stellt den eigenen dynamischen Standortadapter bereit.
2. Gewitterradar erkennt, ob Blitzortung installiert ist und ob es bereits diesen Adapter als Standortquelle verwendet.
3. Falls nicht, führt Gewitterradar den Nutzer mit einem klaren einmaligen Hinweis durch die notwendige manuelle Umstellung bzw. Neueinrichtung.
4. Keine direkte Manipulation fremder ConfigEntries, keine `.storage`-Änderungen und keine privaten/undokumentierten Home-Assistant-APIs.
5. Nach erfolgreicher einmaliger Einrichtung erfolgen spätere Standortwechsel über den Gewitterradar-Tracker automatisch.

## Ziel

Eine möglichst automatische und robuste Kopplung, ohne die Eigentümerschaft des Blitzortung-ConfigFlows zu umgehen. Eine spätere offizielle Upstream-Reconfigure-Unterstützung soll den einmaligen manuellen Schritt weiter reduzieren.
