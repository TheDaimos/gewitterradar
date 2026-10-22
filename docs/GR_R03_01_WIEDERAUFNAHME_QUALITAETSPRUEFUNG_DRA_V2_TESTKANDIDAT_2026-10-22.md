# GR-R03-01 – Wiederaufnahme, Qualitätskontrolle und DRA-V2-Testkandidat

**Stand:** 22.10.2026 · **Projekt:** Gewitterradar · **Zweig:** `deploy/dev` · **Ziel:** HA DEV VM 109 · **Priorität:** P1

## 1. Ausgangsbericht und geprüfte Herkunft
Original: [GR-R03-01 – Niederschlag nach Seitenneustart](https://github.com/TheDaimos/gewitterradar/blob/deploy/dev/docs/GR_R03_01_NIEDERSCHLAG_KALTSTART_NEUSTART_WIEDERHOLUNG_V411106_2026-10-22.md). Vollständig über den verbundenen GitHub-Zugriff gelesen. Die technische Korrektur existiert bereits und wird **nicht erneut implementiert**.

- Programmstand: **V4.11.106 DEV**, Build `V4.11.106-DEV-2026-10-22`, Runtime `411106r1`, Modulsatz `E411-106A1`; native Integration `0.25.18` unverändert (Angaben des Originalberichts).
- Letzter Programm-/Prüfsummencommit: [`93d54d7809592277d6565206e7dcf6a3cb55cc0f`](https://github.com/TheDaimos/gewitterradar/commit/93d54d7809592277d6565206e7dcf6a3cb55cc0f).
- Dokumentationscommit: [`aed7ba1cadcafccdf6140baaa49aa5838b0ba1ed`](https://github.com/TheDaimos/gewitterradar/commit/aed7ba1cadcafccdf6140baaa49aa5838b0ba1ed).
- GitHub-Vergleich `93d54d7...deploy/dev`: **genau zwei nachfolgende Commits**, **nur** `docs/GR_R03_01_NIEDERSCHLAG_KALTSTART_NEUSTART_WIEDERHOLUNG_V411106_2026-10-22.md` geändert; **keine weiteren installierbaren Änderungen** im Prüfzeitpunkt. Eine weitere Versionsnummer ist nicht gerechtfertigt.

## 2. Quellcode- und Lieferintegrität
Am festgepinnnten Programmcommit unmittelbar über GitHub gelesen: `frontend/modules/weather/precipitation-layer.js`, die beiden Spiegel unter `dashboard/dist/` und `custom_components/gewitterradar/frontend/`, `scripts/test-gr-r03-01-cold-start.mjs`, `.github/workflows/validate.yml`, `frontend/assets.json` und `SHA256SUMS_FRONTEND.txt`.

- Alle drei Niederschlagsmoduldateien besitzen denselben Git-Blob-SHA: **`45d09bd5e069df2e2a046128096e6bcdc0fc3fc6`**. Im Prüfsummenverzeichnis stehen beide installierbaren Spiegel mit demselben SHA-256: **`97ff354499b5a73ddb58f9d4ae791c6f22c522a1377419c0a0e1207e6303f3fc`**. Der Bericht benennt für das Runtime-Manifest in `frontend/assets.json` SHA-256 `ea6c3513e5f553a1b78d960d39cd44cd5983c3e4b6410c5caa268c5a2fbeb669`; kein lokaler vollständiger Neu-Hash aller Dateien durchgeführt.
- Im realen Quellcode: `COLD_START_RETRY_MS=8000`, `COLD_START_MAX_RETRIES=3`, begrenzter Kaltstart nach fehlender Ebene, `cold-start-watchdog`, `_weatherRadarRecoverExpiredRequest`, Status `cold_start_retry_exhausted` und Diagnoseereignisse `missing_raster_retry_scheduled`, `cold_start_request_recovered`, `missing_raster_retry_exhausted`.
- Der neue Regressionstest ist vorhanden und wird tatsächlich in `.github/workflows/validate.yml` aufgerufen. Der Originalbericht dokumentiert Testfälle für fehlendes Bild, Begrenzung, Vorgängerbild, veraltete Antwort, hängende Erstantwort und Deaktivierung.
- Damit ist die **technische Implementierung und identische Modullieferung im Repository** nachvollziehbar. Dies ersetzt keinen visuellen Browser-/HA-Realtest.

## 3. GitHub-Actions-Prüfung
Die folgenden **realen Prüflaufkennungen** und deren Jobs wurden erneut über GitHub abgefragt:

| Lauf | Prüfung / Jobs | Ermitteltes Jobergebnis |
| --- | --- | --- |
| [39748536220](https://github.com/TheDaimos/gewitterradar/actions/runs/39748536220) | `settings-navigation` | `completed / success` |
| [39748536268](https://github.com/TheDaimos/gewitterradar/actions/runs/39748536268) | `hacs-integration`, `package-contract`, `home-assistant-runtime`, `hassfest` | alle `completed / success` |
| [39748536231](https://github.com/TheDaimos/gewitterradar/actions/runs/39748536231) | `shared-frontend` | `completed / success` |

**Commit-Zuordnung / Nachweisgrenze:** Der bestehende Originalbericht dokumentiert, dass die drei Läufe mit `head_sha=93d54d7809592277d6565206e7dcf6a3cb55cc0f` kontrolliert wurden. Die in dieser erneuten Prüfung verfügbare GitHub-Jobschnittstelle liefert Jobstatus und Ergebnis, **jedoch kein eigenständiges `head_sha`-Feld**; der alternative Commit-Lauf-Endpunkt gab für den SHA eine leere Liste zurück (er filtert nach PR-Läufen). Deshalb ist die SHA-Zuordnung hier durch den Originalbericht belegt und **nicht unabhängig erneut per API bestätigt**. Die erfolgreichen Jobs selbst sind erneut direkt geprüft. **CI-PASS (im Umfang der dokumentierten Commitbindung), kein HA-REAL-PASS.**

## 4. Technische Risiken und Originaldiagnose
Am 22.10.2026 blieb nach `Strg + Umschalt + R` in V4.11.105 die Niederschlagsebene länger als eine Minute unsichtbar. Bekannt sind `stale_or_background`, `refresh_deferred`, ca. 11.921 ms Zurückstellung, spätere V2-Mosaikaktivierungen und erreichbarer WeatherRouter. Die gesamte historische Ursache ist **nicht bewiesen**. Quelle `gewitterradar-weather-engine-2026-10-22T08-03-25-333Z.json` war in dieser Wiederaufnahme nicht als zusammenhängender Originaltrace verfügbar; der WR-Diagnoseexport ist im privaten Zentralarchiv verzeichnet, wurde hier nicht inhaltlich korreliert.

Mögliche Restfehler: Browser-Kachelzeichnung trotz schneller Consumer-API-Antwort; fehlendes/ungeeignetes Raster; Race Conditions bei Kartenwechsel, Generationsablösung und Sichtbarkeit; Anzeigeabweichungen der aktiven Ebenen; älteres NASA-GIBS-Hintergrundmaterial neben aktuellen DWD-Daten. **Keine Pixel- oder Quellenqualitätsabnahme.** Andere UI-/Android-/Glättungsprobleme bleiben eigene Aufträge.

## 5. Entscheidung zur kontrollierten DRA-V2-Testkandidatur
**Entscheidung: V4.11.106 DEV ist ein kontrolliert vorbereiteter DRA-V2-Testkandidat für ausschließlich HA DEV VM 109**, vorbehaltlich der Betreiberprüfung der Vorschau und der Sicherung. Keine Final- oder PROD-Freigabe. DRA V1 wurde zuletzt als schreibgesperrt beobachtet; eine V1-Schreibinstallation wird nicht vorausgesetzt.

Vor jedem Schreiben im DRA V2 **explizit** prüfen: Ziel **VM 109**, Einzelprojekt **Gewitterradar**, Repository `TheDaimos/gewitterradar`, Ref `deploy/dev`, gepinnter **Programmcommit `93d54d7809592277d6565206e7dcf6a3cb55cc0f`**, installiert **V4.11.105 DEV** gegen Ziel **V4.11.106 DEV**, vollständige Dateivorschau und Änderungen, identische Spiegel-/Prüfsummen, konkrete Sicherung einschließlich rückspielbarer Kennung, und die im DRA angezeigten Neustartfolgen. Nur nach ausdrücklicher Betreiberentscheidung installieren. **WeatherRouter V0.10.162 DEV / Loader 165 nicht verändern.** Keine Änderungen an HA PROD VM 101.

## 6. Kurze Betreiber-Realprüfung nach freigegebener Installation
1. Vorher Ausgangsstand und Sicherungskennung dokumentieren; Gewitterradar und WeatherRouter auf VM 109 starten und Consumer-API-Verbindung V1/V2 in Diagnose prüfen.
2. Niederschlag einschalten, UTC-Zeit notieren und **`Strg + Umschalt + R`** auslösen. Zeitpunkt bis zur **sichtbar gezeichneten** Niederschlagsebene messen (nicht nur bis zur API-Antwort).
3. Mehrfach mit unverändertem und geändertem Kartenausschnitt wiederholen. Prüfen, ob ein gültiges Vorgängerraster während Erneuerungen sichtbar bleibt und keine veralteten Kacheln eingeblendet werden.
4. Nur in einer sicher kontrollierten DEV-Testsituation eine fehlgeschlagene/hängende Erstanfrage erproben: 8-Sekunden-Wiederholungsfenster, **maximal drei** Wiederholungen, Watchdog, aussagekräftige Fehlermeldung statt Endlosschleife prüfen; keine reale Störung produktiver Provider verursachen.
5. Für jeden Fall UTC-Zeit, sichtbares Ergebnis, Version, API-Modus, Kachel-/Generationsstatus, `stale_or_background`, `refresh_deferred`, neue Retry-Ereignisse sowie korrelierte GR-/WR-Diagnosen erfassen. Private Originalexporte **ausschließlich** `TheDaimos/Project-Log-And-Export@main`; keine sensiblen Standortangaben veröffentlichen.
6. Bei Rückfall auf den ursprünglichen Fehler: **HA-REAL-FAIL / offen**, keine Finalfreigabe; Diagnosen und zugehörige Zeitpunkte sichern. Erst bei dokumentiert erfolgreichem Realtest **HA-REAL-PASS** vergeben.

## 7. Schutz- und Abschlussstatus
**Bereits erledigt:** Quellcodekorrektur, Spiegelkonsistenz des Niederschlagsmoduls, Regressionstest im Workflow, drei erfolgreich geprüfte CI-Jobfamilien, Dokumentation des Programm-SHA. **Offen:** tatsächliche DRA-V2-Installation nach Betreiberentscheidung, Neustart- und Fehlerpfadrealtests, fachliche Bild-/Pixelverifikation und Ursachenbeweis der ursprünglichen Verzögerung.

Keine neue Implementierung, keine Installation, keine Änderung an WR, Consumer API V1/V2, UTC-Verträgen, OPERA, Rasterio/GDAL/PROJ oder VM 101. **CI-PASS ist ausdrücklich nicht HA-REAL-PASS.**

**C.K. – Eine Idee weiter gedacht.**
