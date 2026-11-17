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

Der WR-Originalexport vom 17.11.2026 enthält 114 V2-Antworten für WR 0.10.325. Median 132,6 ms, P95 351,9 ms, Maximum 780,2 ms. Der Export misst den WebSocket bis zur WR-Antwort. Separate Live-Messungen für den Provider-Bildabruf und die End-to-End-Anzeige auf VM109 fehlen. [Originalexport](https://github.com/TheDaimos/Project-Log-And-Export/commit/ba9147a16d)

## Verifikation und offene Abnahmen

- Gezielte GR-Tests für Masken, Grid, Kachellader, WR-Vertrag, geografische Abdeckung, NASA und Auslieferung. 37 registrierte Frontendmodule, die Quell-, HA- und Dashboard-Spiegel wurden bytegenau geprüft.
- WR-Regressionslauf mit Crop, DWD-Kaltstart, Maskencache, Teilstrom-Limit, NASA und V2-Vertrag. Der neue Teilstromtest prüft mehrere einzelne Leseabschnitte und die harte Obergrenze.
- VM109 und physisches Android sind offen. Die bereitgestellte Firefox-Sitzung kann mit der verfügbaren Computer-Use-URL-Durchsetzung nicht verifiziert werden. Insbesondere bleiben der echte Bildvergleich am violetten Rand, Live-Latenzen bei Europa- und Weltansicht, ein VM109-DRA-Installationslauf und der physische Eye-/Touch-Test offen.
