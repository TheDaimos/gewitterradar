# DEV · DWD/OPERA-Übergang mit framegenauer NoData-Maske

Ausgangsstände sind GR `67ff4ab276f3627528f8e12b43673dd147e0d27d` und WR `f748d214bd152d78a42c3041c84028881724e128`. Der [bisherige Befund](GR_I18N_DWD_OPERA_NACHBESSERUNG_2026-11-17.md) belegt die Sperre durch den veröffentlichten DWD-Abdeckungsrahmen.

Die Änderung betrifft den räumlichen V2-Pfad für gleichzeitig freigegebenes DWD-Niederschlagsradar und OPERA. Geteilte Risiken sind Kachelreihenfolge, Cache und räumliche Schutzmasken. Die Tests erfassen auch den separaten NASA-Pfad. Wind, Eye, Einstellungen und Übersetzungen liegen außerhalb dieses Eingriffs.

## DEV-Kandidat

GR 4.11.227 DEV / HA 0.25.134 verwendet Runtime `411227r1` und Modulset `E411-227A1`. Der dazugehörige WeatherRouter ist 0.10.324 DEV / Loader 327. Beide Zweige behalten die V2-API-Version. Bestandsclients können die bisherigen Rechtecke weiterhin lesen. GR verarbeitet die zusätzliche Maske nur bei einem nachweislich passenden DWD-Frame und einer zugeordneten OPERA-Sperre.

WR liest eine lokal vorbereitete Bitmaske für die exakt ausgewählte Zeit und fixiert denselben DWD-Referenzlauf im bestehenden WMS-URL. GR lässt die OPERA-Sperre nur für Zielpixel fallen, deren Fläche vollständig aus ausdrücklich belegtem DWD-NoData besteht. Es blendet dort auch den grauen DWD-NoData-Anteil aus. Gültiges trockenes DWD, Niederschlag, gemischte Randpixel und Bereiche außerhalb der vorbereiteten Maske bleiben geschützt. Der Cache löst keine Provider-Anfragen aus. WR meldet `spatial_planning.dwd_validity` als `verified`, `missing`, `invalid`, `frame_mismatch`, `unsupported_wms_frame` oder `not_configured`.

Der DWD-Endpunkt lehnte einen Test mit dynamischem WMS-Stil ab. Die lokal aus WCS erzeugte Maske enthält 120.502 Bytes für 721.680 native Zellen. Die zwei offiziell abgefragten WMS-PNGs mit und ohne expliziten Referenzlauf waren in der historischen Stichprobe bytegleich. Die offizielle WMS-Gültigkeitszeit und die WCS-Abfrage waren auf 17.11.2026 um 10:45 UTC gesetzt. [OGC-Empfehlung zu DIM_REFERENCE_TIME](https://docs.ogc.org/bp/12-111r1/12-111r1.pdf)

### Vorher und nachher

Messung mit echter DWD-WCS-Maske und dem GR-Zielpixel an den gleichen Koordinaten bei Zoom 6, 8 und 10. „OPERA möglich“ bedeutet Freigabe durch die räumliche Maske. Die tatsächliche OPERA-Deckung in VM109 ist separat zu prüfen.

| Position in °E / °N | Klassifikation | Vorher | Nachher mit Maske |
|---|---|---|---|
| 4,55 / 51,75 | DWD −999 | gesperrt | OPERA möglich |
| 5,50 / 51,90 | positiver DWD-Wert | gesperrt | DWD geschützt |
| 7,60 / 49,98 | gültiger DWD-Nullwert | gesperrt | DWD geschützt |
| 13,80 / 50,60 | DWD −999 | gesperrt | OPERA möglich |
| 14,20 / 48,70 | TIFF-NoData | gesperrt | OPERA möglich |

### Verifikation

- Neuer Rastertest kontrolliert positive DWD-Werte, gültig 0, zwei NoData-Spalten, OPERA vorhanden/fehlend, beide Ankunftsfolgen, Zoom und wiederholte Weltkopie mit zwei Bildanfragen. Ein fehlerhafter oder fremder Lauf wird verworfen.
- Die gezielten WR-Tests prüfen Cache, exakte Zeit, unveränderte Kachelpläne, Abwärtskompatibilität, OPERA-Zulassung und NASA. Der deterministische GR-Build spiegelt 192 Frontenddateien.
- Status **TEILWEISE**. Der normale Betrieb bereitet die Masken für kommende Frames derzeit nicht automatisch vor. Fehlt die exakt passende Datei, behält der Host den konservativen Schutz bei und meldet den Grund. Die historische Stichprobe ist kein aktueller freigegebener Frame.
- Die VM109-Installation, die Providerzuordnung aus einer authentifizierten Sitzung und die vollständige Vorher-/Nachher-Sichtprüfung bleiben offen. Computer Use unterstützt die URL-Policy im vorhandenen Firefox auf Windows weiterhin nicht. Der bestätigte frühere Toolabbruch wurde respektiert.
