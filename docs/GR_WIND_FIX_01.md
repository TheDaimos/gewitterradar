# GR-WIND-FIX-01 · tatsächliche Wind-Menüzugänge und Rasterabschluss

Stand: 07.11.2026. Entwicklung ausschließlich `TheDaimos/gewitterradar@deploy/dev`.

| Bestandteil | Neuer Stand |
|---|---|
| Gewitterradar | **4.11.150 DEV** |
| HA-Integration | **0.25.57 DEV** |
| Build / Runtime / Modulset | `V4.11.150-DEV-2026-11-07` / `411150r1` / `E411-150A1` |
| Implementierungscommit | `4b20c282618e53ece0a1983d673d115124b9f343` |
| Ausgangscommit GR149 | `4adb7a8c186a45f5b0246982a99cfac6ec28d44e` |
| Geschützte GR148-Referenz | `d975a94be5d63eb09242a54920d8c3417205b41f` |
| Unveränderter WeatherRouter | **0.10.295 / Loader 298**, Tag-Commit `0857a9920bbfeed3d512c4f7896c175a66518598` |

Der endgültige Releasecommit enthält zusätzlich diesen Bericht und steht im Release-Asset `deployment.json` sowie im Tag `v4.11.150-dev`. Die WR-Legendenreferenz wurde über GitHub erneut gelesen: Blob `c929f8dd1d1ab3f936beb5b71a694574a8a3c1b8`, unverändert. Vorhandene DEV-Tags bleiben erhalten.

## Belegte Fehler und Korrekturen

### A/B: fehlende Menüintegration

Das Premium-Menü definierte tatsächlich nur `precipitation` und `clouds`. Sein Auswahl- und Synchronisierungscode behandelte jede andere Auswahl wieder als Niederschlag. Die Windmodule waren zwar vorhanden, wurden dort aber nicht aufgerufen. Im Kartenebenenmenü wurde `_weatherWindMenuMarkup()` ausschließlich auf der WR-Hubseite eingefügt, nicht auf der anfänglichen Kartenmenüseite oder unter `Wetter → Wind`.

Neu steht **Wind** im vorhandenen Premium-Selektor. Der Windbereich nimmt dieselbe bestehende `#weather-wind-panel`-Instanz auf; die anderen Zugänge verschieben genau dieses Element wieder an seinen eigenständigen Kartenplatz. Es gibt weder ein zweites Konfigurationsobjekt noch einen zweiten Wind-Speicherkey. Niederschlag und Wolken bleiben auswählbar, ihre Darstellungs-/Deckkraftfunktionen sind unverändert.

Direkte Zugänge bestehen auf der anfänglichen Kartenmenüseite, der WR-Hubseite und unter `Wetter → Wind`. Ein fehlender Windraster-Katalogeintrag entfernt den Konfigurationszugang nicht. Dafür wird ausschließlich eine UI-Kategorie mit null Rasterressourcen angeboten; es wird keine meteorologische Capability erfunden. Die Premium-Windeinstellungen und das Auge bleiben auch bei einem nicht bereiten WR zugänglich; Rasterstilregler werden dadurch nicht als datenverfügbar ausgegeben.

Die Prüfung mit der vollständigen Karte fand zusätzlich zwei Integrationsfehler, die die frühere reduzierte Fixture nicht abdeckte:

- Das bisherige Premium-Fenster war für die lange Windkonfiguration zu schmal und hatte keinen dafür geeigneten Scrollbereich. Nur die Auswahl Wind erhält eine breitere, durch die Kartenhöhe begrenzte Darstellung mit vertikalem Scrollen. Regen-/Wolken-Geometrie bleibt erhalten.
- Das selbstständige Windfenster lag bei `z-index:720` **unter dem echten Kartenkompass (`760`) und Medaillon (`755`)**. Auf der Android-Ansicht fing der Kompass reproduzierbar Eingaben auf den Pausenschalter ab. Windfenster und Windlegende benutzen jetzt die Reihenfolge der bestehenden Premium-Bedienung (`2147483644`). Karteninstrumente, ihre Positionen und ihre Steuerung wurden nicht verändert.

Die Infoaktion öffnet die vorhandene Windlegende und schließt gegebenenfalls das Premium-Fenster, damit die Legende auf schmalen Geräten nicht dahinter verborgen bleibt. Bestehende Windlegendenpositionen und Windpräferenzen werden weiterverwendet.

### C: nicht zuverlässig abgeschlossene Raster-Ladezustände

Der bestehende generische Wind-/Wolkenrasterpfad hatte keine Frist für eine ausbleibende WR-Auflösung und keinen Abschlusswächter für einen Kachelzyklus ohne abschließendes `load`. Ein verspätetes `tileload` setzte den Status außerdem bedingungslos wieder auf `loading`, selbst nach einem abgeschlossenen Zyklus. Einzelne vorzeitige Rückgaben, etwa ohne Kartenbounds, lieferten keinen sichtbaren Abschluss. Zähler konnten von einem vorherigen fehlgeschlagenen Auftrag stammen.

Der bestehende Pfad wurde gezielt abgesichert, keine zweite Downloadengine entwickelt:

- WR-Auflösung und Leaflet-Bereitstellung: maximal **20 s Transportwartezeit**, abbrechbar. Ein Timeout endet mit Fehler und konkreter Meldung. Laufende HA-WS-Anfragen lassen sich über den bestehenden Vertrag nicht physisch zurückrufen; ihre verspäteten Antworten ändern aber keinen verworfenen Zustand.
- Raster-Kachelzyklus: Abschlusswächter **30 s**; vorhandene gezeichnete Kacheln ergeben bei unvollständigem Transport `Teilweise`, sonst `Fehler`. Aktive/gewartete Bildaufträge werden beendet und die vorhandenen Budgettickets freigegeben. Der bisherige einzelne Bildtimeout von 12 s bleibt erhalten.
- `load` beendet den Wächter. Spätes `tileload` setzt einen abgeschlossenen Zyklus nicht erneut auf „Lädt“. Ein neuer echter `loading`-Zyklus wird weiterhin als solcher behandelt.
- Keine ladbaren Kacheln, fehlende Bounds, unvollständiger Vertrag und unerwarteter Stagingfehler erhalten einen expliziten Endzustand. Fehler-/Ladezähler beginnen je Auftrag neu.
- Entfernen, erneutes Aktivieren und Viewportwechsel beenden alte Auflösungen/Wächter. Generationsprüfungen verhindern die Übernahme veralteter Ergebnisse.

Die Zustände bleiben getrennt: `Karte aktiv`, `Lädt`, `Keine Daten`, `Fehler`, `Teilweise`, `Aus`. WR-`unavailable` bleibt nicht verfügbar. Der vorhandene Consumer übersetzt z. B. einen WS-Transportfehler in `temporarily_unavailable`; dies wird als solcher ausgewiesen, nicht als erfundener Provider-Erfolg.

Diese Fristen begrenzen ausschließlich Browser-/Transportwartezeiten. Es gibt keine neue meteorologische Alters-, Provider-, Prognose- oder Gültigkeitsregel. Die bestehende anonyme HTTPS-/CORS-Bildanforderung für öffentliche generische Raster, URL-Prüfung, Quellzoombegrenzung und geografische Zuschnitte bleiben erhalten. OPERA-/Niederschlags-V2-Authentifizierung wird nicht angefasst.

**Grenze der Ursachenfeststellung:** Ein passender GR149-Android-Netzwerkexport mit dem konkreten HTTP-Ergebnis lag nicht vor; im vorgesehenen Export-Repository wurde kein entsprechender GR-Windexport gefunden. Daher wird kein tatsächlicher DWD-401-, CORS- oder Provider-Ausfall behauptet. Diese Zustandslücken sind im Code belegt und gezielt reproduziert. Der geprüfte HTTP-401-Fall ist eine synthetische Browserantwort. `Image.onerror` liefert dem Renderer keinen verlässlichen HTTP-Status; die Meldung bleibt deshalb ein Bildtransportfehler und erfindet keine Authentifizierungsursache.

### D: Quellen-HTML als sichtbarer Text

Die Details maskierten HTML-Attributionsstrings lediglich mit `escapeHtml`. Dadurch erschienen die Tags selbst. Die neue kleine gemeinsame Funktion `weatherSourceText()` verarbeitet Quelleninformationen allgemein und liefert ausschließlich Text: inertes Parsen, Entfernen ausführbarer/nicht darzustellender Elemente und Ausgabe des Quellnamens. „Daten:“ wird zu „Datenquelle:“ normalisiert.

Es wird kein ungeprüftes Provider-HTML in ein `innerHTML`-Ziel geschrieben. Menüs maskieren den bereinigten Text weiterhin; auch die bestehende Leaflet-Attributionsoption erhält ausschließlich zusätzlich maskierten Text. Windpunktliste und Windlegende verwenden denselben bereinigten Quellnamen. DWD erhält keine Provider-Sonderbehandlung. Ein optionaler Quellenlink wurde bewusst nicht ergänzt; die Aufgabenstellung erlaubt die sichere reine Textdarstellung.

### E: vorhandene numerische Winddarstellung

Die bisherigen drei Modi bleiben erhalten: meteorologische Windfahnen, statische Strömungsrichtungspfeile und lokale animierte Segmente. Alle acht Farben, Tempo, Dichte, Pause, Einheit, Farbmodus und Windlegende sind über die reparierte Bedienung erreichbar. Die Datenquelle liefert weiterhin maximal neun tatsächliche, kohärente Punktvektoren. Kein flächendeckendes Windfeld und keine flächige Windfarbe werden vorgetäuscht.

Raster- und Punktwindzustände sind unabhängig. Der Browserfall prüft gleichzeitig sichtbare Punktvektoren bei einem fehlgeschlagenen oder nicht verfügbaren Raster. Fehlende Punktdaten löschen die Symbole, lassen die Konfiguration aber bedienbar. Der vorhandene WR-Diagnosetrace enthält die Antworten; die Windfehler zeigen zusätzlich den gelieferten `unavailable.code` an, soweit vorhanden. Es werden keine neuen Provider-, Zeit- oder Druckklassifikationen eingeführt.

## Auslieferung und Cachekette

Frontend, Modulmanifest, Runtime-Manifest, HA-Metadaten, DRA und Dashboard sind auf **4.11.150 / 0.25.57** synchronisiert. Betroffene Importketten verwenden `411150r1`: Premium-Menü, Layer-Menü, Windsteuerung, Winddaten, Canvas-/Windlegenden-Abhängigkeiten und Quellenhelfer. Modulversionen: Layer-Menü `1.1.10`, Darstellungsmenü `0.4.21`, Windsteuerung `0.1.1`, Manifest `1.2.170`; weiterhin 35 registrierte Module ohne Duplikate.

Die unveränderte gemeinsame Niederschlagslegende und der unveränderte Niederschlagsrenderer behalten ihre bestehenden Importidentitäten. Die reine Quellgleichheit der ausgelieferten Dateien und ihr Hashinventar werden geprüft; damit wird kein gemischter neuer Installationsstand erzeugt. Bereits laufende Browser können trotzdem erst nach einer Frontend-Neuladung den neuen Einstiegsstand verwenden. Eine physische Companion-Cacheabnahme wird hier nicht behauptet.

## Gezielte Tests

**16 erfolgreiche Tests** aus `tests/gr-wind-fix-01.test.mjs`, `tests/gr-wind-ui-03.test.mjs`, `tests/gr-legend-ui-01.test.mjs`: Transportabschluss/Abbruch/Timeout, verspätete Antwort, bestehende Windmathematik und Fiederwerte, Einheiten/Beaufort, Datenkohärenz, Speicherung, Scheduler/Lebenszyklus, Weltkopien und geschützte Niederschlagskomponenten. Die frühere pauschale Unverändertheitsprüfung des gesamten `display-menu.js` wurde durch gezielte Bytevergleiche sämtlicher berührungsfreier Rasterstil-/Deckkraft-/Legendenmethoden ergänzt; die Menüänderungen selbst sind ausdrücklich beauftragt.

`scripts/test-gr-wind-fix-01-browser.cjs` erstellt **die tatsächlich registrierte `gewitterradar-card`** mit `setConfig` und dem regulären `hass`-Setter. Es werden das echte Skeleton, Karteninstrumente, alle 35 Module, die echten Menüs und Leaflet verwendet. Nur HA-/Provider-I/O ist synthetisch. Kein reduziertes Ersatzkarten-Element und kein direkter `_weatherWindOpen()`-Aufruf als Ersatz für die Menüabnahme.

Ansichten: Desktop **1280×900**, Android **375×812 / 812×375**, iPad **768×1024 / 1024×768**. Mobile Menüzugänge und Schaltflächen benutzen emulierte Touch-Taps. Geprüft werden:

- Premium-Auge → Wetterebene Wind, anfängliches Kartenmenü, WR-Hub und Wetter → Wind; identische DOM-Konfigurationsinstanz und gespeicherte Werte nach Reload.
- Alle drei Modi mit tatsächlich gezeichneten, nicht transparenten Canvas-Pixeln; acht auswählbare Farben; sichtbare Bewegung; Pause ohne aktiven Scheduler; keine Wetterabfrage pro Animationsbild; Quelle und tatsächlicher UTC-Zeitpunkt.
- Erfolgreiche Rasterbilder, HTTP-401-Bildfehler, WR-Nichtverfügbarkeit und WS-Transportfehler; Zustandsabschluss sowie Aus-/Einschalten und Zoom über den nativen Quellzoom hinaus.
- Ausbleibende WR-Antwort, verspätetes Kachelereignis und fehlender Zyklusabschluss. Nur im Timeout-Prüffall werden die 20-/30-s-Transporttimer beschleunigt; meteorologische Zeitangaben bleiben unberührt.
- Punktdarstellung trotz Rasterfehler, verständlicher Punktdatenfehler, Konfiguration bei nicht bereitem WR und ohne verfügbaren Windraster-Katalogeintrag.
- Keine sichtbaren HTML-Tags, inert behandelte `javascript:`-/`onerror`-/Skriptangaben, keine horizontalen Überläufe und normale Bedienung trotz echter Kompass-/Medaillon-Overlays.

Zusätzlich erfolgreich: `scripts/verify-frontend.mjs`, `scripts/test-v411-identity.mjs`, `scripts/verify-hacs-integration-package.py` (**161 bytegleiche Integrationsdateien**) und `git diff --check`.

Öffentliche CI ausschließlich in `TheDaimos/gewitterradar`: `shared-frontend.yml@deploy/dev` ruft für GR150 gezielt `gr-wind-fix-01.yml` auf, mit festem Ubuntu 24.04 und isolierten Playwright-/Leaflet-Abhängigkeiten. Die allgemeine historische Wetterdatenkampagne wird übersprungen. Der genaue erfolgreiche Lauf wird im Release genannt und im `deployment.json` verknüpft. Releasefreigabe erst nach erfolgreicher öffentlicher CI des Auslieferungscommits.

## Betroffene Dateien und Schutzumfang

Funktionskorrekturen: `frontend/modules/weather/{display-menu.js,layer-menu.js,wind-display.js,wind-data.js}`; neuer gemeinsamer Texthelfer `source-text.js`. `wind-canvas.js` und `wind-legend.js` erhalten nur neue Importrevisionen ihrer abhängigen Windhelfer.

Identitäten/Auslieferung: `frontend/{gewitterradar.js,version.js,panel.js,module-manifest.js,assets.json,assets/gewitterradar-runtime-manifest.json}`, `custom_components/gewitterradar/{manifest.json,build_info.py,const.py,dra-deployment-provenance.json}`, die erzeugten entsprechenden Kopien unter `custom_components/gewitterradar/frontend/` und `dashboard/dist/`, `SHA256SUMS_FRONTEND.txt`, Build-/Verifikationsskripte, die genannten gezielten Tests/CI-Dateien und dieser Bericht. Die vollständige tatsächliche Liste liegt im Release als `changed-files.txt`.

Unverändert: WR 0.10.295 / Loader298, WR-Referenzdokument, Consumer-Client/V2-Vertrag, Niederschlagsrenderer, komplette P7-010-Mosaik-/NASA-/OPERA-Module und Masken, gemeinsame Niederschlags-/separate NASA-/Schneelegende, Rasterstilberechnungen, vorhandene Speicherkeys und Karteninstrumente. Keine wissenschaftliche Neuvalidierung, keine TEST69-Wiederholung, keine privaten Actions, keine Änderung an `main` oder PROD VM101.

## Installationspakete und verbleibende Abnahme

[DEV-Release v4.11.150-dev](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.11.150-dev):

- `gewitterradar-0.25.57-dev.zip` – HA-Integration.
- `gewitterradar-dashboard-4.11.150-dev.zip` – bestehender Dashboard-Auslieferungsweg.
- `SHA256SUMS.txt`, `deployment.json`, `changed-files.txt` – Prüfsummen, exakte Paket-/Commitidentität und Änderungsliste.

Der Bericht wird auf `deploy/dev` committed und nach Veröffentlichung über GitHub erneut gelesen und mit dem lokalen Git-Blob verglichen. Die reale HA-/Android-/iPad-Abnahme bleibt ausdrücklich offen und erfolgt erst nach manueller Installation und Benutzerprüfung auf VM109. Es findet keine automatische Installation statt. Die bereits dokumentierten Grenzen ohne numerisches räumliches Windraster und ohne autoritative Druckklassifikation bleiben bestehen.
