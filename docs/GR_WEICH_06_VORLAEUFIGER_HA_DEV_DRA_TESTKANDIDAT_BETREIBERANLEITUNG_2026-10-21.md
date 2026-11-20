# GR-WEICH-06 – Vorläufiger HA-DEV-Testkandidat und kontrollierte DRA-Betreibererprobung

**Datum:** 21.10.2026  
**Repository:** `TheDaimos/gewitterradar`  
**Zweig:** `deploy/dev`  
**Status:** **Vorläufiger DEV-Sichttestkandidat vorbereitet – keine Installation durchgeführt und keine endgültige Browser-/HA-Realabnahme.**

## 1. Eingang und geänderte Betreiberentscheidung

Der vollständige Vorbericht `docs/GR_WEICH_05_BROWSER_MODULE_INTEGRATION_CI_UND_DEV_TESTKANDIDAT_SPERRE_2026-10-21.md` wurde unmittelbar aus GitHub auf `deploy/dev` gelesen; seine Historie GR-WEICH-01 bis GR-WEICH-05, ursprüngliche Vier-Modi-Profilabstimmung, numerische Tests und isolierten echten Chromium-Pixelprüfungen gelten unverändert weiter.

**Verbindlich geänderter Freigabeumfang:** Der Betreiber erlaubt nun **die Vorbereitung** eines *ausdrücklich vorläufigen* Kandidaten zur eigenhändigen Sichtprüfung auf **HA DEV VM 109**, auch wenn die vollständige produktive Browserintegration noch offen ist. Dies ersetzt die frühere *Kandidaten-Vorbereitungssperre*, **nicht** die Pflicht zur weiteren Entwicklung/Prüfung und **nicht** die getrennt erforderliche Zustimmung zum konkreten Installationsvorgang.

## 2. Eindeutiger geprüfter Kandidat

| Merkmal | Wert / Nachweis |
| --- | --- |
| Projekt | Gewitterradar |
| Ziellaufzeit | **V4.11.100 DEV** |
| Anzeige | `V4.11.100 DEV` |
| Build | `V4.11.100-DEV-2026-10-20` |
| Runtime | `411100r1` |
| Modulsatz | `E411-100A1` |
| Native Integration | `0.25.18` |
| Zu installierender Zweig | `deploy/dev` (**nicht** `main`) |
| **Unveränderliche, durch alle drei Push-CI-Gates geprüfte Programmrevision** | **`29257e400a3dead1a00f3429c78362e3dc5017b2`** |
| Bei Dokumenterstellung gelesener aktueller `deploy/dev`-HEAD | `dd9cb20b514a195fdc7a2e938e160adfa098adc4` (nach dem geprüften Programmcommit nur GR-WEICH-05-Dokumentationsfortschreibungen) |
| SHA256-Inventar | `SHA256SUMS_FRONTEND.txt`, Blob `61515577d0aad3eb27be71ce766a931df8248f21` |
| In HA DEV tatsächlich installierter Ausgangscommit / Version | **Nicht aus GitHub feststellbar, vor der Installation in DRA und HA ablesen; keine Schätzung** |

Die zentrale Versionsidentität wurde direkt aus `frontend/version.js` gelesen, `integrationVersion` mit `custom_components/gewitterradar/manifest.json` abgeglichen. Ein neuer Versionssprung ist **nicht erforderlich**, weil der Zweck einer ausdrücklich vorläufigen Sichtprüfung mit der belegten und eindeutig angepinnten bestehenden V4.11.100 DEV erfüllt wird. Alle drei Frontend-Spiegel wurden im gemeinsamen Frontend-Gate einschließlich `SHA256SUMS_FRONTEND.txt` erfolgreich validiert; für GR-WEICH-06 erfolgte keine Änderung an Programmdateien, Manifesten oder Prüfsummen.

### Reale abschließende CI-Nachweise der gepinnten Revision

Alle drei Github-Actions-Pushläufe wurden erneut direkt über die GitHub-Schnittstelle gelesen; `head_sha=29257e400a3dead1a00f3429c78362e3dc5017b2`, **status=completed, conclusion=success**:

1. [39582002786 – Einstellungen und Laufzeitidentität](https://github.com/TheDaimos/gewitterradar/actions/runs/39582002786).
2. [39582002651 – Gewitterradar-Integration und bestehende Verträge](https://github.com/TheDaimos/gewitterradar/actions/runs/39582002651).
3. [39582002828 – gemeinsames Frontend mit GR-WEICH-04/05-Browser-Pixelbeweisen](https://github.com/TheDaimos/gewitterradar/actions/runs/39582002828).

Der frühere GR-WEICH-05-Bericht erklärte den dritten Lauf während dessen Ausführung noch für offen; **diese Abfrage klärt ihn jetzt als erfolgreich abgeschlossen**. Pixelbeweise: [GR-WEICH-05-Artefakt 12337346136](https://github.com/TheDaimos/gewitterradar/actions/runs/39582002828/artifacts/12337346136). Die bisherigen Browserbeweise betreffen echte Produkt-Darstellungsmethoden im isolierten Kartenhalter, **noch nicht den kompletten produktiven V1-/V2-Lebenszyklus**.

## 3. DRA- und Sicherungs-Prüfprotokoll – vor jedem Eingriff

**Vorrang:** Die folgenden Handlungen sind eine **Anleitung ausschließlich für den Betreiber**. Dieser Entwicklungsauftrag hat weder DRA benutzt noch Home Assistant installiert, neu gestartet oder verändert.

1. In **HA DEV VM 109** Gewitterradar öffnen und **installierte** Version, Runtime, Modulsatz, Integrationsversion und nach Möglichkeit SHA notieren. Installation **abbrechen**, wenn Ausgangsstand oder Zielsystem nicht eindeutig ist. **VM 101/HA PROD niemals auswählen.**
2. Vor jeglichem Update den vorhandenen, tatsächlich rückspielbaren **DRA-/HA-DEV-Sicherungsstand** verifizieren oder neuen geeigneten Sicherungsstand erstellen; Zeit, Kennung, Umfang, Rückspielmöglichkeit und derzeitige funktionierende Gewitterradar-Revision festhalten. **Ein Git-Commit ersetzt keine HA-Konfigurations-/Laufzeitsicherung.**
3. Im **Deploy Relay Agent** nur das Projekt **Gewitterradar** anwählen; die Git-Quelle `TheDaimos/gewitterradar`, Ref **`deploy/dev`**, und nach Möglichkeit als expliziten unveränderlichen Commit **`29257e400a3dead1a00f3429c78362e3dc5017b2`** wählen. **Nicht** versehentlich WeatherRouter, DRA selbst, weitere Sammelupdate-Projekte oder `main` einbeziehen.
4. Bevor eine Installationsbestätigung ausgelöst wird, die DRA-Zusammenfassung mit **Projekt, Ziel VM 109, installiertem Ausgangsstand, neuer Version, vollständiger Commit-SHA und ausgewählter Ref** vergleichen. Ist ein SHA-Pinning nicht möglich, **nicht annehmen**, dass das bei Auswahl von `deploy/dev` inzwischen bewegte HEAD exakt denselben Bytebestand hat; die tatsächliche Ref/SHA-Zuordnung separat bestätigen und bei Abweichung **abbrechen**. Anwendungs- und DRA-Version des Betreibers wurden hier nicht live abgefragt; Bildschirmbezeichnungen können abweichen.
5. Die **konkrete Ausführung** nur nach **erneuter ausdrücklicher Betreiberentscheidung** in DRA eigenhändig anstoßen. Keine automatische Freigabe aus dem Dokument ableiten. Ob ein Home-Assistant-Neustart von DRA für diese Änderung verlangt wird, **vor Ausführung** anhand dessen realer Anzeige überprüfen; nur auf **DEV** und ausschließlich, falls erforderlich und genehmigt, durchführen. Nicht unbegründet PROD oder WeatherRouter neu starten.
6. Nach manueller Installation in der **tatsächlich geladenen Anwendung** die Versionsidentität `V4.11.100 DEV`, `411100r1`, `E411-100A1` sowie die wirklich installierte Git-SHA prüfen. Die Anzeige allein beweist **keine** Commitgleichheit. Bei fehlender identifizierbarer SHA unbedingt die DRA-Installationshistorie und die ausgerollten Dateien kontrollieren.
7. Bei Problemen **sofort keine weiteren Updates**: Diagnose sichern und entweder den in Schritt 2 geprüften HA-DEV-/DRA-Rückfallstand **mit ursprünglicher Installation + Einstellungen** wiederherstellen oder den vor der Installation notierten unveränderlichen Ausgangscommit über `deploy/dev` gezielt erneut ausrollen, sofern die DRA-Version das sicher unterstützt. Rückfall fachlich durch Kartenfunktion, Version und Protokolle auf **VM 109** verifizieren. **Rückfall niemals ungeprüft/automatisch behaupten.**

**DRA-Kompatibilitätsbewertung:** Quellenformat und `deploy/dev` entsprechen der bestehenden GR-DRA-Lieferkette; die drei aktuellen GitHub-Gates sind erfolgreich. Eine **tatsächliche DRA-Installationsprobe mit der konkret installierten Agent-Version auf VM 109 wurde nicht durchgeführt**. Daher liegt eine *bedingte Installationsvorbereitung*, keine belegte DRA-Real-Kompatibilitätsabnahme vor.

## 4. Android-/Desktop-Sichtprüfung (Betreiber, erst nach separat genehmigter Installation)

Vor dem ersten Test Zeitzone/UTC der Diagnosetimestamps, Bildzeit, Kartenregion, Browserfamilie, Zoom, Quelle/API V1/V2 und gewählten Modus dokumentieren. Bevorzugt denselben Ausschnitt, dieselbe Rasterzeit und Zoom **8–13** auf **Android und Desktop** testen.

| Testschritt | Erwartung / abzuzeichnende Beobachtung |
| --- | --- |
| Auto | ursprüngliche zoomabhängige Farb-/Flächenwirkung ohne fremde Filterreste |
| Präzise | harte native Rasterkanten, keine ungewollte zusätzliche Weichzeichnung |
| Ausgewogen | frühere abgestimmte moderate Flächenglättung |
| Weich | sichtbar stärkere, weichere Übergänge entsprechend historischer Abstimmung; bei Nahzoom keine Aussetzer |
| Zoom 8, 9, 10, 11, 12, 13 | keine unerwartete Modusrücksetzung; optische Übergänge und geographische Lage dokumentieren |
| Karte bewegen und Region wechseln | keine alte Niederschlagsebene oder DWD-Quelle außerhalb Deckung; Filter und Anzeige bleiben synchron |
| V1→V2→V1 / Kachelladen | nach **vollständig** beendetem Wechsel korrekte Quelle, Zeit, sichtbarer gewählter Filter; kein Überlagern alter Daten |
| Raster-Labor öffnen; Referenz/Versuch; Blur, Verschmelzung, Deckkraft ändern | Vorschau beeinflusst nur den ausgewählten Testzustand; Dokumentation mit Screenshot vor/nach |
| Vorschau abschalten und Raster-Labor schließen | ursprünglicher Modus, Transparenz und sichtbare Kanten wiederhergestellt |
| Erneuter Zoom/Bewegung sowie erneuter Datenabruf | keine hängende Laborvorschau, keine optischen oder funktionalen Rückstände |
| Versions- und WR-/GR-Diagnose | zentrale Version stimmt; Zeitwerte werden in **UTC**, Provider/BBOX/Quellen-/Korrelationskennung zusammenpassend erfasst |

**Beweissicherung:** Bei jeder Auffälligkeit ein Paar aus Android-/Desktop-Screenshot (vor/nach, mit Zoom/Modus), Gewitterradar-Weather-Engine-Diagnose und passendem WeatherRouter-API-Monitor/Diagnoseexport aufnehmen. Interne Koordinaten/Personendaten ausschließlich in der vorgesehenen **privaten** Ablage `TheDaimos/Project-Log-And-Export` speichern; keine Standortdaten/Screenshots mit sensiblen Metadaten in öffentliche Repositories legen. Ein visueller Nutzer-PASS ersetzt **keine** programmatische Gesamtintegration.

### Abbruchkriterien

Abbrechen, wenn falsche Ziel-VM/Ref/Commit, fehlende Sicherung, nicht prüfbare Ziel-SHA, fehlende oder anhaltend veraltete Rasterkacheln, unerklärliche V2/V1-Rückfälle, DWD außerhalb Deckung, überraschender Quellenwechsel, gestörte Kartenbedienung, falsche Version oder Fehler in Authentifizierung, UTC, HA-Leistung oder DRA-Rückfall vorliegen.

## 5. Parallel fortzusetzende technische GR-WEICH-06-Arbeit

Der bereits vorhandene isolierte echte Browser-Pixeltest und seine Artefakte bleiben unverändert; keine Duplizierung und keine pauschale Änderung an den historischen Filterformeln.

**Weiterhin verbindlich offen**, unabhängig von einer manuellen DEV-Erprobung: vollständiger produktiver V1-`precipitation-layer.js`- und V2-`raster-mosaic-grid-layer.js`-Aufbau im echten Browser; asynchroner Wechsel einschließlich langsamer, fehlgeschlagener und stornierter Kacheln; `zoomend`/`moveend`, Region-/Quellenwechsel und überholte Antworten; echter Raster-Labor-Dialog einschließlich Referenz/Versuch, Vorschau, Flächenverschmelzung und Rücksetzen; tatsächlich sichtbare Pixelbelege nach vollständigem Layer-Swap. Diese Punkte dürfen erst nach entsprechend erfolgreichen Messungen als erledigt gelten.

Die Freigabe zur **vorläufigen** Sichtinstallation bleibt hiervon fachlich getrennt. Keine Änderung an WeatherRouter, UTC-/V1-/V2-Consumerverträgen, DWD/NASA-Semantik oder Schutzprüfungen; kein zusätzlicher Renderer.

## 6. Abnahmematrix

| Kennung | Stand |
| --- | --- |
| GR-WEICH-01–05, isolierte Browser- und Numerikprüfungen | **CI-PASS** der angegebenen Revision |
| Alle drei GitHub-Actions-Gates zu `29257e400a…` | **SUCCESS**, direkt kontrolliert |
| Versions-/Manifestidentität | **Bestätigt** |
| Vorläufiger DEV-Sichttestkandidat technisch dokumentiert | **JA**, mit SHA-Pinning-/Sicherungsbedingungen |
| DRA-Kompatibilität auf realer VM 109 | **Nicht realgeprüft** |
| Vollständige V1/V2-/Labor-Browser-Ende-zu-Ende-Abnahme | **OFFEN** |
| Betreiberseitige Installation | **NICHT durchgeführt; zusätzliche Zustimmung erforderlich** |
| HA-DEV-REAL-PASS | **NEIN** |
| HA-PROD | **Strikt ausgeschlossen** |

**C.K. – Eine Idee weiter gedacht.**
