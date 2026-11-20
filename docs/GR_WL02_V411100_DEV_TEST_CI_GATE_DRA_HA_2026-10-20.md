# GR WL-02 – V4.11.100 DEV-TEST: korrigiertes Browser-Prüfgate, DRA-/HA-Freigabegrenzen

**Datum:** 20.10.2026 · **Ziel:** ausschließlich GR · **Zweig:** `TheDaimos/gewitterradar@deploy/dev`

## Ergebnis

Der im Auftrag verlangte **eine DEV-TEST-Kandidat V4.11.100** war beim erneuten Lesen des Repositories **bereits** durch Commit [`42a222544d552e7e83643df7d03c89324e0cd692`](https://github.com/TheDaimos/gewitterradar/commit/42a222544d552e7e83643df7d03c89324e0cd692) eingerichtet. Die Versionsanhebung wurde daher **nicht** wiederholt. Ihr Installationsstatus wurde jedoch **nicht** voreilig freigegeben, da am späteren HEAD `fd72829e405638ffe9510fd203f8394b21fc7881` der öffentliche Frontend-Prüflauf [39381086313](https://github.com/TheDaimos/gewitterradar/actions/runs/39381086313) **fehlgeschlagen** war.

### Nachgewiesener Fehler und konkrete Korrektur

Das echte CI-Protokoll des Jobs `118490116078` zeigt im Browserlauf `scripts/test-v40756-settings-help.cjs` den Fehler `dashboard/desktop Deutsch module set fingerprint`: Tatsächliche Anzeige `· Modulsatz-ID E411-100A1`, die bislang fest eingebaute Musterprüfung `/[0-9A-F]{4}-[0-9A-F]{4}$/` akzeptierte nur einen historischen vier-plus-vier-hexadezimalen Fingerabdruck. Dies ist eine **veraltete Prüfannahme**, kein nachgewiesener Fehler am dargestellten Modulset.

Korrigiert wurde ausschließlich `scripts/test-v40756-settings-help.cjs`, sodass der vorhandene alte Fingerabdruck und das reale neue Muster `E411-100A1` unter begrenztem `E411-\d{2,3}A\d+` zulässig sind. Die Prüfung bleibt aktiv; keine Abschaltung, keine Änderung von WeatherRouter, Tile-Renderer, Niederschlagsarchitektur oder HA-Laufzeit.

**Neuer Code-/Testcommit:** [`a95463eb95f4daeaa31b9f1e66586423b5934c53`](https://github.com/TheDaimos/gewitterradar/commit/a95463eb95f4daeaa31b9f1e66586423b5934c53). Vorab wurde die tatsächlich aktuelle Datei auf `deploy/dev` gelesen und auf Basis ihrer Blob-Prüfsumme aktualisiert.

### Bereits vorhandene Versions- und Paketidentität (nicht erneut angehoben)

- Gewitterradar **V4.11.100 DEV-TEST**, Modulset **E411-100A1**.
- `custom_components/gewitterradar/build_info.py`: **4.11.100**.
- `custom_components/gewitterradar/manifest.json`: Home-Assistant-Integration **0.25.18**.
- Nachweis aus Ausgangsauftrag/älterem Bericht: zuvor **V4.11.99 DEV**, Runtime `41199r1`, Modulset `E411-99A1`, Integration `0.25.17`. Der vorherige fachliche CI-grüne Quellstand ist `169bac89850b6c5fe542d9f90897041bc3ebb199`; **nicht** ohne Prüfung als in HA installiert ausgeben.
- Der maßgebliche **zu installierende** Commit ist erst nach Abschluss aller Prüfungen und unmittelbar vor einem ausdrücklich genehmigten DRA-Lauf festzuschreiben. Der hier korrigierte Stand ist `a95463eb95f4daeaa31b9f1e66586423b5934c53`, sofern der Zweig seither nicht weiterläuft.

## Sechs unabhängige Gates

| Gate | Befund |
| --- | --- |
| CODE-PASS | **TEILWEISE:** konkrete Browserprüfregression behoben; die übrigen Paket-/Quellenverträge dürfen nur anhand zugehöriger grüner Prüfungen positiv bewertet werden |
| Öffentlicher CI-PASS | **OFFEN bis endgültiger Abschluss aller zugehörigen Läufe:** [39387873647](https://github.com/TheDaimos/gewitterradar/actions/runs/39387873647) (Identität), [39387873638](https://github.com/TheDaimos/gewitterradar/actions/runs/39387873638) (Integration), [39387873805](https://github.com/TheDaimos/gewitterradar/actions/runs/39387873805) (Frontend), jeweils zu `a95463eb95f4daeaa31b9f1e66586423b5934c53` |
| DRA-Paket-/Testinstallationskandidat | **VERSION VORBEREITET; FREIGABE NOCH NICHT ERTEILT**, bis sämtliche benötigten CI-, Paket-, SHA-, Auslieferungsspiegel- und DRA-Identitätskontrollen für exakt den festgelegten Commit erfolgreich sind |
| Tatsächliche HA-DEV-Installation | **NICHT DURCHGEFÜHRT** |
| HA-REAL-PASS | **OFFEN:** keine echten `ready/raster_tile`-Wolken- und Windpixel nachgewiesen |
| Produktionsfreigabe | **NEIN** |

**DEV-Testkandidat vorbereitet:** **JA, als vorhandene V4.11.100 DEV-TEST-Paketversion**. **Kontrollierte DRA-Installation freigegeben:** **NEIN**, solange alle grünen Gates nicht nachgewiesen sind. Dies sind unterschiedliche Aussagen.

Die älteren fünf grünen CI-Läufe für den unveränderten fachlichen WL-02-Code auf `169bac89850b6c5fe542d9f90897041bc3ebb199` bleiben gültige historische Evidenz und wurden nicht unnötig erneut implementiert. Die späteren rot gewordenen V4.11.100-Läufe dürfen ausdrücklich **nicht** als erfolgreicher Test gezählt werden.

## DRA-Ablauf – erst nach grüner Vorprüfung und ausdrücklicher Einzelfreigabe

Im DRA die **autorisierte HA-DEV-Instanz** auswählen. Vor der Ausführung die Übersicht *Installierte Version | Neue Version | vollständiger Commit | ausgewählte Ref* kontrollieren. Quelle darf nur **`TheDaimos/gewitterradar` mit Ref `deploy/dev`** sein; Zielversion **V4.11.100 DEV-TEST**, HA-Integration **0.25.18**. Ein DRA-Angebot aus `main`, ein anderes Commit, unvollständige Prüfsummen oder fehlende konkrete Versionsanzeige sind ein **Abbruchgrund**. Ohne ausdrückliche Installationszustimmung **nichts installieren**.

Vorher HA-DEV-Sicherung und tatsächlich installierte GR- und WR-Version/Refs dokumentieren. Rückfall: genau den **zuvor auf HA DEV nachweislich funktionierenden und gesicherten** GR-Stand über denselben DRA-Weg wiederherstellen; als historisch nachweislich geprüfte Codebasis steht `169bac89850b6c5fe542d9f90897041bc3ebb199` für **V4.11.99 DEV** zur Verfügung, aber ihr tatsächlicher früherer HA-Installationscommit muss separat am Gerät bestimmt werden. Nach Installation gegebenenfalls Neustart und Browser-Cache-Abgleich, danach Runtime-/Modulset-/Manifest-/SHA-Prüfung und Rollback bei Inkonsistenz.

## Ausstehender echter Realtest nach Genehmigung

Für `weather.satellite.clouds` und `weather.model.wind_10m.layer` jeweils WR Consumer V1 `discovery`, `capabilities`, `resolve` mit `time:{mode:"latest"}`, Profil und BBOX korreliert ausführen. `available` ist **nicht** `ready`; `unavailable` muss als ehrlicher Nichtbildzustand erscheinen. Nur bei echter `ready/raster_tile`-Antwort HTTPS/CORS, Pixelinhalt, Georeferenz/Datumsgrenze, Zoom, NoData, Zeit/UTC, Herkunft, Attribution und Semantik prüfen. Beide Ebenen allein und zusammen mit P7-010-Niederschlag auf Browser/Mobilgeräten sowie CPU/RAM/Netzlast testen; RF04-DWD-`coverage_timeout` gesondert offenhalten. Private Originalexporte ausschließlich im privaten `TheDaimos/Project-Log-And-Export@main`, keine Rohkoordinaten im öffentlichen GR.

**Separater UI-Folgewunsch:** `ⓘ` an der Legende zur Anzeige echter Bildzeit, Quelle, Aktualität, UTC sowie nur zur Darstellung der HA-Ortszeit; keine zusätzliche Implementierung in dieser Testbereitstellung.

**Weder WR-Wolken-/Wind-Live-Lieferfähigkeit noch HA-Realabnahme wurden in dieser Sitzung behauptet.**

C.K. – Eine Idee weiter gedacht.
