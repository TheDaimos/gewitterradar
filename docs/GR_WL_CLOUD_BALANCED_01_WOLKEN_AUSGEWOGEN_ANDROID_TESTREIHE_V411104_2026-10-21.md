# GR-WL-CLOUD-BALANCED-01 – Wolkenprofil „Ausgewogen“ als kontrollierter Raster-Labor-Versuch

**Datum:** 21.10.2026  
**Repository/Zweig:** `TheDaimos/gewitterradar@deploy/dev`  
**Version:** **V4.11.104 DEV**  
**Build:** `V4.11.104-DEV-2026-10-21`  
**Runtime:** `411104r1`  
**Modulsatz:** `E411-104A1`  
**Native Integration:** unverändert `0.25.18`  
**Geprüfter Programmcommit:** `67313aa7704e3a1f641258e714d497de43e0d8ba`.

## 1. Quelle und fachliche Einordnung

Der Betreiber hat mit `b2ea08e0-ca3f-4747-ae66-ffbfc54cbbfb.json` einen Raster-Labor-Diagnoseexport aus **V4.11.103 DEV**, Android, Gerätefaktor 3, Bildausschnitt 400 × 774, UTC-Zeitstempel `2026-10-21T20:28:47.703Z`, bereitgestellt. Die Auswahl lautet `layer=clouds`, zuletzt Kartenzoom 18, nativer Quellzoom 9, `activeRenderer=css-filter-preview`. Darin liegen **15 ausdrücklich gemessene Wolken-Zoomversuche** vor.

| Kartenzoom | Glättung in px | Flächenverschmelzung |
| ---: | ---: | ---: |
| 2 | 0 | 100 % |
| 5 | 0 | 100 % |
| 6 | 3 | 100 % |
| 7 | 6 | 100 % |
| 8 | 10 | 100 % |
| 9 | 10 | 100 % |
| 10 | 10 | 100 % |
| 11 | 11 | 100 % |
| 12 | 19 | 100 % |
| 13 | 20 | 100 % |
| 14 | 23 | 100 % |
| 15 | 24 | 100 % |
| 16 | 23 | 100 % |
| 17 | 24 | 100 % |
| 18 | 29 | 100 % |

Kontrast, Farbsättigung, Helligkeit und Deckkraft sind sämtlich neutral bei `1`, die Flächenverschmelzung bei `100`. **Für Zoom 3 und 4 liegen keine Messungen vor**; das Testprofil erfindet dort keine eigenen Versuchseinträge. Ohne eigenen Versuch gelten die bisherigen neutralen Referenzwerte. Die abweichenden Nachbarwerte bei Zoom 11/12 und 15/16 wurden nicht harmonisiert oder interpoliert.

## 2. Umsetzung ohne zweite Rendererarchitektur

Der originale, bereits aus GR-WL-CLOUD-01 und GR-WL-CLOUD-02 vorhandene Diagnoseadapter `clouds` und die bestehende CSS-Vorschau werden wiederverwendet. Das Modul `frontend/modules/diagnostics/raster-lab.js` wurde auf **0.1.4** angehoben und um genau eine sichtbar gekennzeichnete Bedienung ergänzt:

**„Wolken · Ausgewogen als Versuch laden“**

Diese Schaltfläche wird nur für die im Raster-Labor ausgewählte Wolkenebene angezeigt. Sie lädt durch eine bewusste Benutzeraktion genau die 15 übermittelten Originalwerte als Wolken-Zoomversuche in die bereits existierende `samples`-Karte. Die Schlüssel lauten `clouds:<Kartenzoom>`, die native Quellstufe 9 bleibt nur diagnostische Metainformation. Anschließend wird die bereits vorhandene Vorschau bei aktuellem Kartenzoom aktualisiert und die Regleranzeige neu synchronisiert.

**Testgrenze:** Dies ist ausdrücklich ein **temporäres Wolken-Raster-Labor-Versuchsprofil**, keine dauerhaft aktivierte Wolken-Produkteinstellung, kein neues globales Vier-Modi-System und keine Übertragung der Niederschlagsprofile auf Wolken. Beim Schließen des Labors wird die ursprüngliche Darstellung nach bestehenden Regeln wiederhergestellt. Beim erneuten Öffnen beginnt eine neue Versuchsreihe; der Bediener kann weiterhin JSON exportieren. Die Schaltfläche überschreibt auf Wolken während derselben Laborsitzung bereits vorhandene Wolken-Zoomversuche für diese 15 Zoomstufen **bewusst**; Niederschlags- und Windversuche werden nicht verändert.

**Nicht geändert:** WeatherRouter, native Integration 0.25.18, V1-/V2-Consumer-API, UTC, Quellenauswahl, Kartenrenderer, originale Wolkenkacheln und die vier historisch abgestimmten Niederschlagsmodi.

## 3. Browser- und Regressionstest

Der bestehende echte Chromium-Test `scripts/test-gr-wl-cloud-01-browser.cjs` verwendet die produktiven, unveränderten Modulregistrierungswege für Karten- und Laborfunktionen auf einer isolierten Testkarte. Ergänzt wurde eine **echte Bedienfolge in Chromium**:

1. Wolken-Raster-Labor öffnen und die neue Schaltfläche kontrollieren.
2. Über `click()` die Benutzeraktion auslösen.
3. Die **15 exakten** Zuordnungen von Kartenzoom und Unschärfe prüfen, Flächenverschmelzung 100 % kontrollieren.
4. Sicherstellen, dass für Zoom 3 und 4 kein künstlicher Probeeintrag erzeugt wurde.
5. Sicherstellen, dass keine Niederschlagsversuche durch den Wolkenknopf angelegt oder überschrieben werden.
6. Bei Kartenzoom 8 die tatsächliche Regleranzeige (10 px) kontrollieren.
7. Per tatsächlich gerenderten Browserpixeln prüfen, dass Wolken sichtbar verändert werden und Niederschlagspixel unverändert bleiben.
8. Beim Schließen des Labors die Pixelwiederherstellung prüfen.

**Browser-Gate**: [Validate shared Gewitterradar frontend – Lauf 39672198969](https://github.com/TheDaimos/gewitterradar/actions/runs/39672198969), Schritt `GR-WL-CLOUD-01 active generic raster and Raster-Labor browser pixels` samt Artefakt-Upload erfolgreich ausgeführt.

**Nachweisartefakt:** [gr-wl-cloud-01-browser-evidence, ID 12380242296](https://github.com/TheDaimos/gewitterradar/actions/runs/39672198969/artifacts/12380242296), 81.626 Bytes, mit ergänztem `cloud-balanced-preview.png` und den bisherigen synthetischen Browserbildern und Pixelwerten. Historische GR-WEICH-04/05-Pixelregressionen laufen im selben Workflow weiterhin.

Die browsergestützte Prüfung verwendet synthetische, nicht personenbezogene Rasterkacheln und **keine** tatsächlichen Home-Assistant-/WeatherRouter-Kachelabrufe. Sie ist kein HA-Real-PASS.

## 4. Version, Auslieferung und Sicherung

Das neue Modul wurde in den drei Auslieferungsbäumen `frontend/`, `dashboard/dist/`, `custom_components/gewitterradar/frontend/` bytegleich gespiegelt. Die zentrale Versions-/Laufzeitidentität wurde auf **V4.11.104 DEV / 411104r1 / E411-104A1** aktualisiert, Build- und CI-Identitätsprüfungen mitgezogen und die unabhängige native Integrationsversion unverändert gelassen.

`frontend/assets.json` enthält den neuen SHA-256-Digest `3bd020d68db885202b94475c0a0b5228457379a28a87fe9142ab68910bd17b71` des Runtime-Manifests. `SHA256SUMS_FRONTEND.txt` wurde für alle zwölf geänderten Dateien in beiden installierbaren Spiegeln mit echter SHA-256-Berechnung aktualisiert und sortiert.

Wichtige Programmcommits:

- `9f0cc7a97142d3c6b0fc3b0b12dac660e16d9d1f` – originaler Bedienknopf und exakte Wolkenprofile im Raster-Labor.
- `f4bfb98d2064b9304cd1f34def2ea4e877f02b50`, `efe16f605c6475916892c6ff6238658b345a4710` – neue Produktversion und drei Frontend-Spiegel.
- `4e94ded6db5e1cc42666c5f9e190f9b5d0ab83d4`, `b18c3f4f00706480b17e3b835ce568713ff06615` – native-/DRA-Metadaten und bestehende Identitätsverträge.
- `041f5b5a5804179d6df463be829ab665683b0d7e` – echte Chromium-Presetregression.
- `b05e8a9e38d88d86c4388d992195e4f5d2883223`, **`67313aa7704e3a1f641258e714d497de43e0d8ba`** – validierte Runtime-Manifestsumme und abschließende Frontend-Spiegelprüfsummen.

## 5. GitHub-CI und Freigabegrenzen

Die drei wesentlichen Pushprüfungen wurden am **Programmcommit `67313aa7704e3a1f641258e714d497de43e0d8ba`** ausgelöst:

| Prüfung | GitHub-Actions | Technischer Stand beim Berichtsschreiben |
| --- | --- | --- |
| Einstellungen und V4.11.104-Laufzeitidentität | [39672198911](https://github.com/TheDaimos/gewitterradar/actions/runs/39672198911) | **completed / success** |
| Gewitterradar-Integration: HACS, hassfest, Paketvertrag, HA-Runtime | [39672198875](https://github.com/TheDaimos/gewitterradar/actions/runs/39672198875) | **alle vier Jobs completed / success** |
| Gemeinsames Frontend und historische sowie neue Chromium-Prüfungen | [39672198969](https://github.com/TheDaimos/gewitterradar/actions/runs/39672198969) | neuer Wolken-Browsertest **success**, Bildartefakt-Upload **success**; die übrigen Frontendschritte laufen zum Schreibzeitpunkt noch. Erst die abschließende GitHub-Workflow-Kennung `completed/success` erlaubt die Aussage eines vollständigen CI-PASS. |

**Installationsgrenze:** Keine automatische DRA-Installation, kein HA-DEV-/HA-PROD-Eingriff, keine Änderung an VM 109/101 und keine behauptete HA-Realabnahme. Der Betreiber kann nach vollständiger CI-Abnahme selbst eine kontrollierte Installation über DRA V1 (`TheDaimos/gewitterradar`, `deploy/dev`, oben angepinnter Commit) vorbereiten, muss vorher echte Sicherung, Ausgangsstand, Ref/SHA, neu erforderlichen HA-Neustart und Rückfall verifizieren und ausdrücklich selbst die Installation freigeben.

## 6. Betreiber-Sichtprobe

Auf HA DEV nach eigenständiger Freigabe Wolken aktivieren, Raster-Labor öffnen, „Wolken“ wählen und **„Wolken · Ausgewogen als Versuch laden“** klicken. Bei Zoom 8/9/10 sollten jeweils 10 px sichtbar beziehungsweise am Regler erscheinen, bei Zoom 11 11 px, Zoom 12 19 px, Zoom 15 24 px und Zoom 18 29 px. Beim Zoomen zwischen den Profilen die Kachel-Neuaufbauphase abwarten, gespeicherte Zoomprofile und die tatsächliche Karte vergleichen; Zoom 3/4 sind ausdrücklich nicht manuell erprobt und bleiben neutral. Im Labor kann die Referenz umgeschaltet und das Ergebnis über „JSON exportieren“ gesichert werden. Zum Rückfall einfach das Raster-Labor schließen; die vorherige Originaldarstellung wird wiederhergestellt.

**Entwicklungsentscheidung:** Die Testreihe dient der qualitativen Erprobung eines möglichen Wolkenmodus „Ausgewogen“. Eine spätere dauerhaft aktivierbare Wolkendarstellung wird erst nach manueller Android-/Desktop-Realabnahme gesondert entschieden.

**C.K. – Eine Idee weiter gedacht.**
