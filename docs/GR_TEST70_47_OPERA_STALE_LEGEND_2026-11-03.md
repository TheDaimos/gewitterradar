# TEST70-47 – OPERA-Warnsymbole in der Legende

Nur HA DEV VM 109, kein PROD-Eingriff.

- OPERA-Diagnoselegende zeigt für vom WeatherRouter als `preview_age_status=stale` markierte, freigegebene Daten die kleinen Symbole **⚠️ 🕒**.
- Native Mouseover-Information: **OPERA Daten veraltet**. Zusätzlich `aria-label` für Zugänglichkeit.
- Die Symbole erscheinen im vorhandenen OPERA-Status-/Legendenbalken der Karte, nicht als Marker auf der Karte.
- GR berechnet keinen eigenen Schwellwert; die Warnung hängt ausschließlich vom WR-Antwortfeld ab.
- Bei `current` werden keine Warnsymbole angezeigt. Ein WR-Block bleibt ein Block; keine lokale Stale-Freigabe.
- Alle drei Modul-Kopien synchronisiert.

## Nachweis

Öffentlicher GitHub Actions Lauf https://github.com/TheDaimos/gewitterradar/actions/runs/41661883088 – **SUCCESS**.

Release-Commit `9e354f69353a928786d989f928ba2462eb28d466`.
GR **V4.11.127 DEV**, Integration **0.25.36**. Installationsquelle `TheDaimos/gewitterradar@deploy/dev` in DRA V2.

**Offen:** Realtest der Anzeige erfordert eine WR-Antwort mit `preview_age_status=stale`; letzte bekannte WR-Konfiguration `serve_stale=false` liefert möglicherweise kein solches Bild. Für alte Daten niemals GR-seitig die Bereitstellung erzwingen. Die automatische Zyklusübernahme aus TEST70-46 ist ebenfalls erst nach HA-Realtest bestätigt.

Keine privaten GitHub Actions; öffentliche Actions freigegeben.
