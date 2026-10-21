# GR-WEICH-07 – V4.11.101 DEV, DRA-V1-Sichttestkandidat und technische Abnahme

**Datum:** 21.10.2026  
**Repository:** `TheDaimos/gewitterradar` (privat)  
**Zweig:** ausschließlich `deploy/dev`  
**Ziel:** kontrollierte, **ausschließlich betreiberseitige** Erprobung der historischen Niederschlagsweichzeichnung auf Home Assistant **DEV VM 109**  
**Status:** Programmversion V4.11.101 DEV committed; technische CI-/Dokumentationslage siehe Schlussprotokoll. Keine Installation, keine HA-Realabnahme.

## 1. Grundlage / Abgrenzung

Der vollständige [GR-WEICH-06-Bericht](GR_WEICH_06_VORLAEUFIGER_HA_DEV_DRA_TESTKANDIDAT_BETREIBERANLEITUNG_2026-10-21.md) und die dort dokumentierten GR-WEICH-01 bis GR-WEICH-05-Korrekturen, historischen Chromium-Pixelvergleichs- und Raster-Labor-Regressionstests sind verbindlich übernommen. Ausgangs-HEAD vor der Versionsarbeit: `0791c9adcb72884df5f5ade46cac0e4d234b76d1`. Der Betreiber bestätigt **V4.11.100** als bereits auf HA DEV installiert. Der zugehörige DRA-Ausgangscommit, die tatsächlich installierte Integrationsversion und ein konkreter HA-DEV-Sicherungspunkt wurden nicht remote ausgelesen und dürfen nicht erfunden werden.

Die historische optische Abstimmung der vier Modi wurde **nicht** geändert. GR-WEICH-04 stellte Browserpixel anhand der originalen historischen Profilfunktionen wieder her, GR-WEICH-05 testete die echten Darstellungs- und Labor-Methoden im isolierten Playwright-DOM. Die vollständigen asynchronen produktiven V1-/V2-Kachelwechsel sowie der echte vollständige Labor-Dialog sind weiterhin **offen**; diese Einschränkung verhindert **keine ausdrücklich vorläufige Betreiber-Sichtprüfung**, wohl aber eine endgültige Software-/HA-Realabnahme.

## 2. Unveränderlicher Programmstand und Versionsidentität

**Zur DRA-DEV-Versuchsvorbereitung vorgesehenes vollständiges Programmcommit:**

`f8860556529993abe09c122ee8e10855db15ac89`

**Git-Quelle:** `TheDaimos/gewitterradar`  
**Git-Ref:** `deploy/dev`; soweit DRA V1 einen unveränderlichen Commit auswählbar macht, den obigen SHA ausdrücklich setzen. Vor der wirklichen Installation muss die tatsächliche DRA-Anzeige von Repository, Ref, Zielversion und SHA mit den Angaben dieses Berichts übereinstimmen.

| Versionselement | Vorher | Jetzt |
| --- | --- | --- |
| Produktversion | `4.11.100` | **`4.11.101`** |
| Sichtbare Version | `V4.11.100 DEV` | **`V4.11.101 DEV`** |
| Build | `V4.11.100-DEV-2026-10-20` | **`V4.11.101-DEV-2026-10-21`** |
| Laufzeitrevision | `411100r1` | **`411101r1`** |
| Modulsatz | `E411-100A1` | **`E411-101A1`** |
| Native Integration | `0.25.18` | **`0.25.18`, bewusst unverändert** |

Die Identität ist aus `frontend/version.js` direkt auf `deploy/dev` nachgelesen und die Integrationsversion separat in `custom_components/gewitterradar/manifest.json` kontrolliert worden. Keine künstliche Aufwertung der nativen Komponente.

### Tatsächlich geänderte Quellen

1. **Alle drei bytegleichen Auslieferungsspiegel:** `frontend/`, `dashboard/dist/`, `custom_components/gewitterradar/frontend/` – synchronisierte `version.js`, `gewitterradar.js`, `panel.js`, `module-manifest.js`, `assets/gewitterradar-runtime-manifest.json` sowie die zentrale Versionsimportrevision in `modules/diagnostics/raster-lab.js`. Damit erhalten Hauptfenster, Module, Raster-Labor, Diagnose und Browser-Zwischenspeicher die neue Kennung.
2. **Native/DRA-Metadaten:** `custom_components/gewitterradar/build_info.py`, `custom_components/gewitterradar/const.py` (Panel-Abfrageversion), `custom_components/gewitterradar/dra-deployment-provenance.json` (neue Identität und genauer GR-WEICH-07-Sichttestzweck). Integration `manifest.json` blieb auf 0.25.18.
3. **Quell- und Spiegelverträge:** `frontend/assets.json` enthält den erneuerten SHA-256-Wert des Runtime-Manifests: `155f3764819dd97eed776a6f73038267d6a4bcd8d475a708d76c45c9a81ba9c6`. `SHA256SUMS_FRONTEND.txt` wurde für die zwölf tatsächlich geänderten installierbaren Frontenddateien in beiden Spiegeln vollständig neu berechnet, danach kanonisch neu sortiert; Bestand **248 Zeilen**, Git-Blob `2c98bc6e586b5877af3a2b3c87e25ba57ee4ee7d`. Keine Prüfsummenschranke wurde abgeschaltet.
4. **Mitgezogene feste Versionsverträge:** `scripts/build-frontend.mjs`, `scripts/verify-frontend.mjs`, `scripts/test-v411-identity.mjs`, `scripts/test-v41169-data-sources.mjs`, `scripts/test-v41106-weather-engine-diagnostics.mjs`, `scripts/test-v41108-project-hub.mjs`, `scripts/test-v41193-runtime-reload.mjs`, `tests/test_settings_navigation_v41150.py`, `.github/workflows/v41150-settings-navigation.yml`. Verifizierte Zwischenfehler in früheren Pushläufen wurden gezielt auf den übernommenen alten Sollwert V4.11.100 bzw. die alte Cachekennung zurückgeführt, nicht durch Abschwächung der Tests verdeckt.

**Es wurden keine Glättungsradien verändert, keine Rasterquelle ausgewechselt und kein zweiter Renderer entwickelt.** WeatherRouter, UTC, Sicherheitsfunktionen und V1-/V2-Consumerverträge bleiben unverändert.

## 3. Git-Entwicklung und Rückfall

| Git-Commit | Änderung |
| --- | --- |
| `9abc95646020ca150c062862ec881bf54b833b5a` | Identität V4.11.101 in allen drei Haupt-Frontendspiegeln und Backend-/DRA-Metadaten |
| `2cb82bcff98af7a70adc617e766f836237fa206c` | V4.11.101 in Build-/Identitätsprüfung sowie Raster-Labor-Modulimport in drei Spiegeln |
| `9c24574a4e868ee33afc1a2390919acb6037e00a` | Einstellungen-/Versionsprüfung |
| `ee10463802fb5189f928a1fef370f96b19d44f60` | Datenquellen-Prüfvertrag |
| `f4f24ae3e89e40e0dd1b2ca9f781668e72c0ff20` | Runtime-Manifest-Hash in `frontend/assets.json` |
| `9cb576e489e787964b03ee8dff1bf595b7766bf4` | 12 Frontend-Lieferdateien und SHA256-Inventar |
| `11826823b7e004aa6a52923752e676a293c267f1` / `28fa89d348c1c43a33164c05370667892b0fc10e` | Versionsabhängige Laufzeit-Neuladung und Project-Hub-Prüfung |
| `af09cc0e8a56dedb93f5819158f0a41bac19bab8` / `67fad9d6bce07a84f1bc510ede9634a26b57cd0b` | Native Panel-Cachekennung und Weather-Engine-Diagnoseprüfung |
| `578e0dc93b97b15b5730e965c2900880fd29c7cf` | Kanonischen Frontend-Vertrag auf V4.11.101 umgestellt |
| `5118746d7f4ede5cac0ff2cd48bd8ef8a06c63d7` | SHA256-Zeilen kanonisch nach Prüfsumme sortiert |
| `daac93ec1370212610087518dd234b1cf774817b` | GitHub-Actions-Backend-/DRA-Identitätsprüfung auf 4.11.101 ausgerichtet |
| **`f8860556529993abe09c122ee8e10855db15ac89`** | Abschließende DRA-V1-Provenienz mit zutreffendem Zweck und Installationssperren |

**Wichtige Trennung:** Der feste Programmcommit ist `f886...`; eine nachfolgende reine Dokumentationsänderung auf `deploy/dev` ändert dessen SHA nicht. DRA muss **seine tatsächlich verwendete Ref/SHA** vor dem Eingriff anzeigen bzw. über die Quellenprüfung eindeutig bestimmen. Falls nur der bewegliche Branch-HEAD installiert werden kann, muss die SHA vor Start neu abgeglichen werden; nie eine Commitgleichheit behaupten, die DRA nicht belegt.

## 4. DRA V1 – tatsächlich verifizierter Installationsvertrag

Der echte Quellvertrag auf `deploy/dev` wurde aus `deploy-relay.json` zurückgelesen:

- Manifest-Schema `deploy-relay.deployment.v1`, Projekt `gewitterradar`; Repository `TheDaimos/gewitterradar`, Modus `repository_contents`.
- Installationswurzel `/config`; **einzelne Gruppe** `integration`, Quelle `custom_components/gewitterradar`, Ziel `custom_components/gewitterradar`, Verzeichnisersetzung `replace_directory`.
- `lifecycle.after_install=home_assistant_restart`: **Home-Assistant-Neustart ist nach erfolgreicher Installation vorgesehen/erforderlich**; nur auf HA DEV und durch den Betreiber nach dessen Freigabe.
- Symlinks verboten; Grenzwerte 5000 Dateien und 150 MiB.
- Der echte **DRA-V1-Projektkatalog** unter `TheDaimos/deploy-relay-agent-dev@deploy/dev`, `registry/projects.json`, enthält ausdrücklich `gewitterradar` mit `repository=TheDaimos/gewitterradar`, `manifest_path=deploy-relay.json`, `channel=dev` und `status=ready`. DRA-Quell-/Katalog-Eignung ist damit **repositoryseitig** bestätigt; die tatsächlich auf VM 109 installierte DRA-V1-Version ist nicht live getestet.

**DRA V1 – bekannte Grenze:** Der bestehende V1-Vertrag bindet länger laufende Vorgänge an eine aktive WebSocket-/Clientverbindung (siehe `TheDaimos/deploy-relay-agent-dev@deploy/dev/docs/DRA_V1_KNOWN_LIMITATIONS.md`). Bei V1 während der Installation weder Companion-App schließen noch Netzwerk/WLAN wechseln oder den Browser neu laden. DRA V2 ist **keine** ungeprüfte Standardinstallation; für diesen Sichttest bleibt DRA V1 der bevorzugte Weg.

## 5. Genaues Betreiberverfahren für VM 109 (noch NICHT ausgeführt)

1. **Nur HA DEV VM 109** öffnen, im DRA prüfen, dass wirklich `Gewitterradar` und nicht WeatherRouter/DRA oder ein Sammelupdate gewählt ist; HA PROD VM 101 strikt ausschließen. Den bereits installierten Stand **V4.11.100** samt tatsächlicher Integration-/Runtime-Kennung und DRA-Installations-SHA dokumentieren.
2. **Vorher eine rückspielbare Sicherung anlegen/verifizieren**, die Home-Assistant-Konfiguration, die Gewitterradar-Integration und gegebenenfalls den vorigen DRA-Transaktions-/Rückfallstand abdeckt; Sicherungskennung, Zeit, Rückfallverfahren und Quelle kontrollieren. Die Existenz eines konkret geeigneten Snapshots wurde **nicht** remote nachgewiesen.
3. In **DRA V1** auf dem DEV-System die **Einzelinstallation Gewitterradar** vorbereiten, Repository `TheDaimos/gewitterradar` / Zweig `deploy/dev` prüfen. Falls die installierte DRA-Fassung eine Commit-Auswahl zulässt, SHA `f8860556529993abe09c122ee8e10855db15ac89` vorgeben. Vor Installationsbestätigung angezeigte alte und neue Version, Projekt, Ref, SHA, Zielpfade und Änderungsvorschau prüfen.
4. **Harter Abbruch vor jedem Schreiben**, wenn DRA auf `main`, PROD, falsche Projekt-/Ref-/SHA-Kombination oder nicht plausibel gesicherten Zielbestand zeigt. Ebenso stoppen, wenn der Branch sich seit dem Programmgate verändert hat und die Änderung nicht auf Dokumentation eingegrenzt wurde.
5. **Die Installation erst mit eigener gesonderter Betreiberentscheidung** über DRA anstoßen. Der Entwicklungsauftrag führt keinerlei HA-/DRA-Schreib-, Neustart- oder Rollbackaktion aus. DRA V1 während der Transaktion verbunden lassen.
6. Nach erfolgreicher Installationsphase den im Manifest verlangten **Home-Assistant-Neustart nur auf DEV** durchführen, sofern DRA ihn nicht bereits bestätigt ausgeführt hat. Nach Wiederanlauf zentral prüfen: `V4.11.101 DEV`, Build `V4.11.101-DEV-2026-10-21`, Runtime `411101r1`, Modulsatz `E411-101A1`, Integration `0.25.18`. Die sichtbare Version allein beweist nicht die deployte SHA: DRA-Transaktion/Dateibestand zusätzlich prüfen.
7. **Rückfall bei Abweichung:** Diagnosen und Screenshots vor einer weiteren Aktualisierung sichern; DRA-Transaktionsrückfall/den unter Schritt 2 wirklich bestätigten HA-DEV-Backupstand beziehungsweise den zuvor notierten **echten V4.11.100-Ausgangscommit** benutzen. Danach die tatsächliche Kartenfunktion und Version auf DEV erneut bestätigen. Keine Vermutung, dass ein bloßer Wechsel der Git-Ref eine vollständige Konfigurationswiederherstellung bewirkt.

## 6. Kompakte Android-/Desktop-Abnahmematrix

Auf **Android und Desktop**, soweit möglich derselbe Kartenausschnitt, dieselbe gültige Radarzeit und **Zoom 8–13**:

| Prüfschritt | Beobachtung / Beleg |
| --- | --- |
| Auto | zoomabhängige originale Niederschlagsweichzeichnung, keine Lücken |
| Präzise | tatsächliche scharfe Rasterkonturen, kein unerwarteter Filter |
| Ausgewogen | moderater Verlauf, anders als Präzise/Weich |
| Weich | historisch abgestimmte weiche Übergänge und Hotspots |
| Zoom 8, 9, 10, 11, 12, 13 | nach `zoomend` bleibender Modus, sichtbar wirkender Filter |
| Kartenbewegung / neue Region | neuer Ausschnitt, kein dauerndes altes Quellenbild und keine hängenden Pane-Filter |
| V1→V2→V1 und Neuanforderung | korrekte Kacheln und Modus nach beendetem Wechsel, keine verspätete Überlagerung |
| Raster-Labor öffnen | zentrale V4.11.101-Anwendungs-/Runtime-Version, Referenz/Versuch prüfen |
| Blur, Flächenverschmelzung, Deckkraft, Vorschau | sichtbare Änderungen an Niederschlagspixeln bei Vorschau |
| Vorschau aus, Labor schließen, weiterzoomen | exakt der zuvor gewählte Darstellungsmodus und seine Deckkraft wiederhergestellt |
| Aktualisierung / Neuladen | keine alte V4.11.100-Oberfläche aus dem Browsercache |
| Diagnose | Zeiten **UTC**, zusammengehörige GR-/WR-Korrelationskennung, Provider, Region, Rasterzeit und Fehlerstatus |

Bei Abweichungen Modus, Zoom, Bildschirm/Plattform und **vorher/nachher**-Screenshots festhalten, zusätzlich Gewitterradar-Weather-Engine-Export und passenden WeatherRouter-API-Monitor-Export. Private Diagnosedaten ausschließlich in `TheDaimos/Project-Log-And-Export` speichern, nicht öffentlich. Vor der Exportweitergabe Standort- und Datenschutzschutz beachten.

**Abbruchgründe:** falsche Installation, fehlender Rückfallpunkt, nicht verifizierbare Ref/SHA, Datenverlust, leere oder verschobene Raster, auffällige falsche DWD-Deckung, Browserhänger, massiv gestörte Kartenbedienung, nicht wiederhergestellte Raster-Labor-Filter oder ungültige UTC-/Quellenangaben.

## 7. Technische CI-/Abnahmegrenzen

Die ursprünglichen GR-WEICH-01 bis GR-WEICH-05-Numerik- und Chromium-Browsertests sind nicht ersetzt worden; ebenso wenig die Integrations-, HACS-/hassfest-, Modul-, Build-, Versions-, SHA256-, Sicherheits- und Consumer-Prüfungen. Nach der initialen Versionsanhebung wurden echte Zwischenfehler in statisch festgehaltenen alten Versionsassertionen sowie der unsortierten Prüfsummenliste gefunden und korrigiert; keine Quell-/Pixel-Funktionalität wurde hierfür verändert.

**Vom vollständigen Produkt noch offen:** echte produktive V1/V2-Mosaik-Kachelstapel im Chromium-Browser mit Quellen-/Regionwechsel, verspäteten/abgebrochenen Anforderungen, vollständiger Labor-Dialog mit Vorschau, Layerneuerstellung und Pixelprüfung. Diese Arbeiten werden auf einem **künftigen getrennt geprüften Programmcommit** fortgeführt und sind **nicht** nachträglich Bestandteil des fixierten V4.11.101-Sichttestkandidaten.

**Freigabeumfang:** Für den Betreiber kann V4.11.101 nach bestätigten CI-Gates als **kontrollierter, vorläufiger HA-DEV-Sichttestkandidat** gelten. Weder DRA-Installation noch HA-DEV-/HA-PROD-Veränderung, HA-REAL-PASS, PROD-Freigabe, WeatherRouter-Änderung oder Eingriff in UTC-/V1-/V2-/Sicherheitsverträge wurde in dieser Entwicklungsaufgabe durchgeführt.

**C.K. – Eine Idee weiter gedacht.**
