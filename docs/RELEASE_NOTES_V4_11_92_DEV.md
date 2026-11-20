# Gewitterradar V4.11.92 DEV – P7-010 Einwilligung und Kachelschutz

**17.10.2026 · deploy/dev · HA-Integration 0.25.10 · Runtime 41192r1 · Modulsatz E411-92A1**

## Korrekturen
- Ein Widerruf des 12-Stunden-Satelliten-Opt-ins entwertet alte laufende V1-/V2-Anfragen sofort und entfernt ältere bereits sichtbare Satellitenbilder. Aktuelle, zulässige Bilder können bestehen bleiben.
- Der V1-Rückfall kann die Satellitenfreigabe nicht umgehen: ohne Einwilligung höchstens 900 Sekunden, mit expliziter Freigabe maximal 43200 Sekunden und nur mit bekanntem Datenalter.
- Bis zu 24 bereits geladene identische native Quellbilder werden innerhalb eines V2-Snapshots erneut verwendet. Neue Bildanfragen bleiben streng begrenzt; der Speicher wird beim Entfernen der Ebene freigegeben.
- Eine Canvas-Kachel ohne tatsächlich gezeichnete Quelle meldet einen Fehler statt ein leeres Bild als erfolgreich geladen auszugeben. Erschöpfte aktive Kachelbudgets können begrenzt, frühestens nach 15 Sekunden, eine neue Auflösung auslösen.
- Frontend-Module und Auslieferungsspiegel, Versionsangaben, Manifest-/Bildprüfsummen und DRA-Provenienz wurden aktualisiert. Regressionen: Satellitenwiderruf, Kachelfehler, Bildwiederverwendung und V1/V2-Vertrag.

**Noch nicht real abgenommen:** Gleichzeitige NASA-DWD-V2-Darstellung mit WR 0.10.156 / Loader 159, optisch nachgewiesene Wetterpixel, mobile Darstellung/Flackern, Zoom 12–17 und vollständige Opt-in-AUS-/EIN-Laufzeitmatrix. Nach DRA-Installation jeweils einen korrelierten WR-/GR-Export prüfen; keine HA-Real-PASS-Behauptung aus CI.

*C.K. – Eine Idee weiter gedacht.*
