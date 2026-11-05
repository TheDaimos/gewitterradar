# OPERA – authentifizierter regulärer Rastertransport · 2026-11-05

WR **0.10.288 DEV / Loader 291**, GR **4.11.140 DEV / HA 0.25.47**.

## Konkreter Fehler und Korrektur

Der reguläre V2-Planer liefert OPERA RATE bereits. Der gemeinsame WR-Kachelendpunkt
verlangte jedoch bedingungslos `request.secure`, bevor er die Registrierung prüfte,
und erneut vor Rendern und Auslieferung. Deshalb erhielt ein gültiger HA-Bearer-
Request über HA-HTTP (einschließlich TLS-Terminierung vor HA) trotzdem 403.
GR bezeichnete bisher jede 401/403-Antwort als `image_auth_rejected`.

Regulär wissenschaftlich zugelassenes RATE übernimmt jetzt den authentifizierten
HA-Transportvertrag. Es gibt keine zusätzliche HTTPS-Pflicht aus der Diagnose.
`requires_auth`, angemeldeter Nutzer, Provider-/Profilfreigabe, vertrauenswürdige
Registrierung, exakter Produkt-/Zeit-/URL-Vertrag, Zulassungsmetadaten und die
WR-Altersprüfung bleiben zwingend. Sperren werden nach der Warteschlange und vor
Auslieferung erneut geprüft. Diagnose und DBZH behalten ihre bisherigen HTTPS-
und Administratorbedingungen. Forwarded-Header erteilen keine Freigabe.

GR fordert ausschließlich exakt validierte relative RATE-URLs mit dem aktuellen
HA-Bearer im Authorization-Header an. Keine Zugangsdaten stehen in URLs oder
Diagnosen. PNG-Antworten werden als Blob dekodiert und als Image in dieselbe
reguläre Canvas-Kachelebene gezeichnet; temporäre Objekt-URLs werden freigegeben.
WR liefert bei Ablehnung einen festen `X-WeatherRouter-Tile-Denial`-Code. GR
übernimmt ausschließlich bekannte Enumwerte und unterscheidet Authentifizierung
von Frame-/Transport-/Providerrichtlinien. HTTP-Status und Code bleiben im
Stage-Fehler und Providerstatus sichtbar. Endgültige 401/403 starten keine
Kachel-Retry-Schleife. Temporäre Fehler behalten das gezielte Nachladen.

Der letzte validierte V2-Eingang wird getrennt vom tatsächlich montierten Mosaik
gehalten. Damit bedeutet ein nicht gemalter Kandidat nicht mehr
`not_returned_by_wr`. `returned_by_wr`, `selected`, Transportstatus und aktive
Framemetadaten sind getrennt. Ein fehlgeschlagener Kandidat ersetzt keine
funktionierende Ebene. Vollständiger atomarer Generationswechsel bleibt erhalten.

## Nachweisgrenze und Installation

Die vom Nutzer genannten GR-Realbefunde (15:44 UTC) sind Ausgangspunkt. Im
privaten Exportziel war bei der Untersuchung nur der WR-Export 14:18 UTC
auffindbar; der GR-Export wurde daher nicht als selbst eingesehene Quelle behauptet.
Gezielte Ergänzungen vorhandener HTTP-, Transport- und Consumer-Prüfungen nutzen
ausschließlich synthetische Daten. Keine neue allgemeine oder wissenschaftliche
Testserie; keine Wiederholung von TEST69. Wissenschaftliche Module unverändert.

Der gezielte authentifizierte HTTP-Fall schlägt mit dem installierten WR-Quellstand
mit 403 fehl und passiert mit der Korrektur. Vorhandene WR-Prüfungen: 159 bestanden
plus 16 Unterfälle. GR-Transport-/Consumerprüfungen: 19 bestanden; bestehende
Lifecycle-/Navigationprüfungen: 13 bestanden. Kanonischer Build und Lieferparität
bestanden. Isolierte Stubs und synthetische Bilder ersetzen keine HA-Realabnahme.

Beide Pakete zusammen auf VM109 installieren, HA neu starten und GR vollständig
neu laden. Die reguläre Niederschlagsebene verwenden. Die neue reale Darstellung
auf VM109 ist noch nicht abgenommen. VM101 blieb unangetastet. Private Actions
bleiben deaktiviert; GR-Prüfungen laufen ausschließlich im öffentlichen Repository.

Die Integrations- und `deploy/dev`-Stände waren vor der Änderung in beiden
Projekten identisch (WR `59a863c`, GR `1b39a177`); keine zusätzlichen oder
konkurrierenden Änderungen wurden übernommen. Release-ZIPs enthalten genau die
versionierten Komponenten samt Installationsmanifesten; SHA256SUMS und
deployment.json benennen Prüfsummen und exakte Quellcommits.
