# GewitterRadar DEV · DWD-Priorität und fortlaufender Kachelaustausch

| | Ausgangsstand | DEV-Kandidat |
|---|---|---|
| GewitterRadar | 4.11.228 / HA 0.25.135 · `541ae3ca672e3117e8db2d0a23beb110e1189e85` | 4.11.229 / HA 0.25.136 · Runtime `411229r1` · Modulset `E411-229A1` |
| WeatherRouter | 0.10.325 / Loader 328 · `bafe93bd39eb16476ad73d180fb046a8d091da6f` | 0.10.326 / Loader 329 |

## Befund und Korrekturen

1. **OPERA-Sperre.** WR publizierte das DWD-Abdeckungsrechteck als `draw_exclusions`. Bei fehlender Maske und außerhalb eines vorbereiteten Maskenausschnitts löschte GR damit freigegebene OPERA-Pixel. GR löst diese eine DWD-Sperre auf. Erst ein gezeichnetes DWD-Fragment mit passendem WCS-Gültigkeitsraster verdrängt OPERA. Maßgeblich sind die geografischen Pixelzentren im nativen DWD-Raster und der wirklich belegte Kachelausschnitt. Ein gültiger DWD-Nullwert verdrängt OPERA, NoData sowie der Bereich außerhalb der Maske bleiben dafür frei. Der bisherige DWD-WMS-Stil liefert weiter die violette Kontur. Die übrigen WR-Sperren gelten weiter.
2. **WCS-Transport.** `StreamReader.read(n)` konnte bereits nach dem ersten verfügbaren Teil eines TIFF antworten. Die automatische Vorbereitung liest nun die vollständige HTTP-Antwort unter demselben Byte- und Zeitlimit. Ein fertig geschriebener Frame löst ein Routing-Ereignis aus. WR meldet Maskenstatus, Cache-Treffer und Suchzeit. Der Abruf bleibt unabhängig von der V2-Antwort. Die additive DWD-Quellenreferenz erhält das bestehende Rechteckformat für ältere Clients.
3. **Kachelwechsel.** Das aktive Raster wird ab dem ersten neuen, autorisierten Fragment übernommen. Neue Kacheln übernehmen weiterhin zugelassene und gültige Bildfragmente aus dem vorherigen Grid. Neue dekodierte Fragmente ersetzen nur die Fläche ihres Providers, auch bei transparentem Ersatz. Die Kartenebene bleibt nach fehlgeschlagenen Nachbarabrufen aktiv. Ein alter Request kann nach Abbruch oder Tile-Unload kein neues Canvas mehr ändern. Providerablauf und expliziter NASA-Widerruf lösen eine Neuzusammensetzung aus. Leaflets Einblendung einzelner Canvas-Kacheln ist für dieses Radar-Grid deaktiviert, damit übernommene Pixel beim Wechsel unmittelbar sichtbar sind.
4. **Laden und Diagnose.** OPERA und DWD erhalten getrennte Transportplätze im unveränderten regulären Gesamtlimit. NASA verwendet seine bestehende unabhängige Transportsteuerung. Das V2-Kachelbudget reserviert bei der Planung Platz für folgende Quellen. Ein vollflächiger zweiter Audit-Canvas entfällt. Erfolgreiche Fragmente werden in einer Microtask zusammengefasst; ein reiner Fehler führt nur bei widerrufener Freigabe zu einer neuen Komposition. Bestehende GR-Diagnosen enthalten jetzt Transport-, Empfangs-, Dekodier- und Kompositionsdaten, Maskenmetadaten sowie gezeichnete und entfernte Quellen mit Kachel und Korrelation. Beim DWD-HTML-Bild misst der Browser Abruf und Dekodierung gemeinsam. Die Diagnose kann bei realen Drittanbieterbildern den gezeichneten Bereich und die Maskierung erfassen. Die Prüfung tatsächlich dargestellter Pixel erfolgt separat im Browser-Test.

Die Änderung betrifft den Niederschlagsrenderer und dessen V2-Planung. Wind, Temperatur, Synoptik, Sprachen, Eye, Touch, Palette und Legende liegen außerhalb der fachlichen Änderung. Die geschützten Referenzen GR 4.11.222 / HA 0.25.129 und WR 0.10.320 / GR 4.11.195 bleiben an ihren bestehenden Identitätsankern.

## Messungen

Realer Chromium-Canvas und Leaflet 1.9.4, mobiles Browserprofil, kontrollierte Transportverzögerungen von 35 ms (OPERA), 180 ms (NASA) und 350 ms (DWD). Die Messung beginnt beim Erstellen des GridLayers und prüft montierte RGBA-Pixel einschließlich berechneter Kacheldeckkraft.

| Messpunkt | GR 4.11.228 | GR 4.11.229 |
|---|---:|---:|
| OPERA außerhalb der DWD-Maske | bis 650 ms vollständig ausgespart | 55,3 ms |
| NASA erstmals sichtbar | 296,6 ms | 199,1 ms |
| DWD erstmals sichtbar | 376,2 ms | 372,5 ms |
| Alle drei Testpixel sichtbar | bis 650 ms nicht erreicht | 372,5 ms |

Ein zweiter Browser-Durchlauf bestätigte nach einem Generationswechsel den DWD-Niederschlag, die transparente DWD-Nullzelle und das durchgehende OPERA-Band außerhalb der gültigen DWD-Zellen. Der nachfolgende OPERA-HTTP-404 änderte die sichtbaren Pixel und die Kacheldeckkraft nicht. Der Node-Test deckt außerdem umgekehrte Ladefolgen, NoData, gültige Nullwerte, kalte Masken, gekachelten Zoom, Weltkopien und verspätete alte Antworten ab.

Die kontrollierten Browser-Transporte meldeten 38,9 ms für OPERA, 181,5 ms für NASA und 355,8 ms für DWD. Sie verwendeten Testbilder mit festen Verzögerungen. Im lokalen WR-Planungstest (25 Durchläufe mit identischer Europaansicht) dauerte die V2-Auflösung im Median 2,18 ms im Ausgangsstand und 1,89 ms im Kandidaten. Die neue interne Planmessung ergab 1,50 ms. Ein archiviertes offizielles DWD-WCS-Raster mit 1.164 × 620 Zellen wurde in 437,4 ms dekodiert. Der erste Cache-Zugriff dauerte 14,63 ms, folgende Zugriffe im Median 0,045 ms.

Der WR-Originalexport vom 17.11.2026 enthält 114 V2-Antworten für WR 0.10.325. Median 132,6 ms, P95 351,9 ms, Maximum 780,2 ms. Der Export misst den WebSocket bis zur WR-Antwort. Live-Messungen der neuen Version für Provider-Netzwerk, Bilddekodierung, Canvas und End-to-End-Anzeige auf VM109 stehen aus. [Originalexport](https://github.com/TheDaimos/Project-Log-And-Export/commit/ba9147a16d) · [Export2Git-Prüfnachweis](https://github.com/TheDaimos/Project-Log-And-Export/commit/ec5cf58a65492dd763426839a53d4a43e0101491)

## Verifikation und offene Abnahmen

- Gezielte GR-Tests für Masken, Grid, Kachellader, WR-Vertrag, geografische Abdeckung, NASA und Auslieferung erfolgreich. Komplette Node-Suite: **183/203** nach **181/203** auf dem unveränderten Commit 4.11.228. Alle 20 verbleibenden Fehler stimmen namentlich mit der Basis überein. Betroffen sind historische Quelltextvergleiche, vier ältere Touch-Fixtures und zwei alte Retry-Erwartungen. Versionsmanifest und Importkette bestehen zusätzlich. Die Sprachprüfung bestätigt 19 Varianten. Das Installationsarchiv enthält 37 registrierte Module. 205 gemeinsame Dateien von HA und Dashboard wurden bytegenau verglichen.
- WR-Regressionslauf mit Crop, DWD-Kaltstart, Maskencache, Teilstrom-Limit, NASA und V2-Vertrag **69/69**. Der unveränderte WR-Basisstand hatte **66/68**. Die zwei V2-Stubfehler der Basis sind behoben und der neue Teilstromtest bestätigt mehrere Leseabschnitte sowie die harte Obergrenze.
- Öffentliche CI auf `deploy/dev` besteht in **10/13** Workflows, einschließlich Raster-Mosaik, OPERA-Authentifizierung, WR-Autorität, Synoptik und Modul-/Android-Kartenschutz. Die drei bekannten Fehler betreffen den WEICH-05-Stub (`window.installDisplay`), den historischen Vault-Quellvergleich (`consumer-client.js`) und die HACS-SPDX-Abfrage (`NOASSERTION`). [Raster-Mosaik](https://github.com/TheDaimos/gewitterradar/actions/runs/44133194623) · [WEICH-05](https://github.com/TheDaimos/gewitterradar/actions/runs/44133194902) · [Settings Vault](https://github.com/TheDaimos/gewitterradar/actions/runs/44133194667) · [HACS](https://github.com/TheDaimos/gewitterradar/actions/runs/44133194573)
- Der bestehende regionale Haltepfad greift weiterhin, wenn WR eine räumlich schmalere Ersatzantwort liefert. Das geprüfte fortlaufende Ersetzen gilt für Kacheln eines angenommenen WR-Plans. Solange WR keine exakte DWD-Maske liefert, kann der unveränderte WMS-Stil seine graue Fläche einblenden. GR löscht in dieser Phase keine OPERA-Pixel aufgrund des DWD-Rechtecks.
- VM109 und physisches Android sind offen. Die bereitgestellte Firefox-Sitzung kann mit der verfügbaren Computer-Use-URL-Durchsetzung nicht verifiziert werden. Insbesondere bleiben der echte Bildvergleich am violetten Rand, Live-Latenzen bei Europa- und Weltansicht, ein VM109-DRA-Installationslauf und der physische Eye-/Touch-Test offen.

## Bereitstellung

GR-Paketquellcommit `fbd94e3c9bf4dfd93e71d387bd70b8289672a14e`. WR-Paketquellcommit `e488d7c21b889bcc5df65de5d7adf38d446be76f`. Die Prüfsummen der GitHub-Assets entsprechen den lokal verifizierten Archiven. Beide DEV-Zweige sind die bestehenden DRA-Quellen. [GR-DRA](https://github.com/TheDaimos/gewitterradar/tree/deploy/dev) · [WR-DRA](https://github.com/TheDaimos/weather-router-dev/tree/deploy/dev)

| Archiv | Dateien | SHA-256 |
|---|---:|---|
| GewitterRadar HA 0.25.136 DEV | 223 | `c9b7fbf427e5154a53518f2394aca32adf094510333a15981d97b428ad4bba31` |
| GewitterRadar Dashboard 4.11.229 DEV | 207 | `1d23fb0a7858a94ea3be5afd127c9c599f159f17351dec188bd3dd1e15b919d5` |
| WeatherRouter 0.10.326 DEV | 180 | `7242209455b906f1ed6c05dcb55f26b640eead7fe6b3d17e9729a054bf86bb0c` |

[GR-Installationspakete und SHA256SUMS](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.11.229-dev) · [WR-Installationspaket und SHA256SUMS](https://github.com/TheDaimos/weather-router-dev/releases/tag/v0.10.326-dev)
