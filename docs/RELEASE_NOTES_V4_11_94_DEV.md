# Gewitterradar V4.11.94 DEV – P7-010 geografische Rastergültigkeit

**18.10.2026 · deploy/dev · HA-Integration 0.25.12 · Runtime 41194r1 · Modulsatz E411-94A1**

## Echter Befund (GR 4.11.93, 17.10.2026)
Die Diagnoseexporte 23:35:21Z und 23:37:19Z belegten eine alte DWD-V2- bzw. DWD-V1-Bildebene, obwohl der Kartenausschnitt wieder bei Kuba lag. Aufeinanderfolgende V2-Antworten meldeten keine dort nutzbare aktuelle Quelle. GR behielt die vorherige Ebene aufgrund der bisherigen Regel `replacement_not_ready`. Bei V1 war die Altersprüfung erfüllt, aber die aktive Ebene wurde trotz geometrischer Nichtüberdeckung weitergeführt. Der neue V1-Kandidat wurde bisher auch dann zum Laden zugelassen, wenn sein strukturiert belegter geografischer Geltungsbereich null Überdeckung hatte.

## Korrektur
- Die vorhandene geometrische Abdeckungsprüfung wird sowohl auf **aktive V1-/V2-Ebenen** als auch auf neu ausgewählte V1-Raster angewendet. Ohne nachgewiesene geografische Überschneidung wird die Ebene sofort bei Kartenbewegung oder vor einem verzögerten Ersatz abgehängt. Abdeckung darf nicht allein aus dem Provider-Namen oder erfolgreichem HTTP-Kachelladen abgeleitet werden.
- Beim Entfernen werden V1-Zeitachse, Rasteranzeige, V2-Abbild und Vorladepuffer konsistent geleert. Eine WR-`unavailable`-Antwort darf nur eine im neuen Ausschnitt weiterhin räumlich und zeitlich gültige Ebene erhalten.
- Regression: Deutschland → Kuba (V1 und V2), ungültige V1-Neuanwahl, unbelegte V1-Geometrie, zurück zu Deutschland und `unavailable` während des Wechsels.
- Bestehende Mehrquellenarchitektur und Zeitvertrag bleiben unverändert: **900 Sekunden** für aktuelle Daten, **43200 Sekunden nur nach expliziter Satellitenfreigabe**.

## Unabhängig offen
In beiden GR-Exporten war die zwölfstündige Satellitenfreigabe **AUS**. NASAs über Kuba nachgewiesene V1-Schätzung war ungefähr 7 Stunden alt und wurde zurecht abgelehnt. Ohne bewusstes Opt-in kann dieser Datensatz nicht als aktueller Niederschlag dargestellt werden. Ein weltweiter gültiger räumlicher Satelliten-BBOX belegt außerdem noch keine tatsächlich eingefärbten Niederschlagspixel. Kombinierte NASA+DWD-Mosaikrealabnahme mit WR bleibt offen. Die reine CI-Abnahme ist kein HA-Realtest.

*C.K. – Eine Idee weiter gedacht.*
