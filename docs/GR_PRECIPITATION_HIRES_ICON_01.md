# GR-PRECIPITATION-HIRES-ICON-01

09.11.2026 · **GR 4.11.165 DEV / HA 0.25.72** · Runtime `411165r1` · Modulsatz `E411-165A1`.

## Ausgangsstand und Original

Tatsächlicher Ausgangscommit: `5be2d8324b58220e37021248b0a2825c6435f87e` auf `TheDaimos/gewitterradar@deploy/dev`, GR 4.11.163 / HA 0.25.70. Die bereits in der Branchhistorie verwendeten Kennungen 4.11.164 / 0.25.71 werden nicht wiederverwendet. Keine Änderung an historischen Releases oder geschützten Referenzen.

Freigegebene Quelldatei: `niederschlag_icon_original_pixelgetreu_transparent.png`, **1254 × 1254 Pixel RGBA**, 1.407.420 Byte, vorhandene transparente und deckende Pixel. Das PNG wird ohne Dekodierung/Neukodierung, Beschneidung, Farbanpassung oder Neugenerierung bytegleich kopiert.

* Master: `artwork/help-icons/hires/gr-precipitation-premium-original.png`.
* Runtime: `frontend/assets/gr-precipitation-premium-original.png`.
* SHA256 beider Dateien: `df68d55dd9defe16e6df55c7a4b97fe62df4ae4cd04fcfd5f23c62cc6f8bc274`.
* Herkunft, Dimensionen und Identitäten: `artwork/help-icons/gr-precipitation-ASSET_MANIFEST.json` und bestehende Asset-README; Original im Hi-Res-Retentionsvertrag registriert.

Das vollständige Original wird auch als Runtime-Asset in beide Installationspakete übernommen. Es gibt keine neue verlustbehaftete Grafik. Die Anzeige erfolgt mit derselben 50-px-CSS-Größe wie bei Wind/Temperatur; der Browser skaliert das Original. Der Aktivzustand wird am Schalter mit `aria-pressed` und vorhandenen CSS-Effekten dargestellt. Die Bildbytes bleiben unverändert.

## Bedienung und Menü

Der Kartenschalter verwendet direkt die bestehende Eye-Ereignisfunktion `_weatherDisplayBindEyeDrag`: Kurzklick/Touch schaltet Niederschlag, **600 ms** halten öffnet die Einstellungen, Drag verschiebt das Icon. Bewegungsgrenze, Pointer Capture, native Touch-Callout-Unterdrückung, Abbruch, Nachklickunterdrückung und Timerbereinigung werden wiederverwendet. Keine zweite Touch-Engine.

Die Positionierung verwendet die vorhandene Wind-/Temperatur-Positionierungsfunktion mit einer lokalen Niederschlags-Fassade. Die realen Wind-/Temperaturzustände werden nicht verändert. Positionen bleiben frei innerhalb der Kartenfläche und werden je Eingabe-/Geräte-/Orientierungs-/Kartenlayout normalisiert gespeichert. Größen- und Moduswechsel verwenden die bestehenden UI-Hooks. Blur, Pagehide, Visibilitychange und Teardown brechen eine laufende Niederschlags-Geste über dieselbe gemeinsame Infrastruktur ab.

Die Icon-Einstellungen befinden sich als unabhängig einklappbarer Abschnitt **Niederschlags-Kartenschalter** im bestehenden Eye-Menü unter **Wetterebene → Niederschlag**. Long Press und der zusätzliche Zugang im bestehenden WeatherRouter-Menü öffnen genau diesen Abschnitt. Darstellung, Rastertransparenz und Legende bleiben eigenständige vorhandene Einstellungen. Rahmen, Chevron/Animation, Dropdown, Buttons, Info- und Schließen-Asset werden aus dem bestehenden Premium-System verwendet.

Sichtbarkeitsoptionen entsprechen unverändert den vorhandenen Wind-/Temperaturbezeichnungen:

* Nur im Vollbild (Standard).
* In allen Kartenansichten.
* Nur Standard und Groß.
* Nirgends (ausblenden).

Das Ausblenden des Icons ändert keine Wetterebene. Ausschalten des Niederschlags entfernt das Icon nicht. Position zurücksetzen betrifft ausschließlich die gespeicherten Niederschlagsicon-Positionen; Icon-Einstellungen zurücksetzen betrifft ausschließlich diese neue Unterkonfiguration. Bestehende Wind-/Temperaturschalter haben keine frei einstellbare Icongröße/-deckkraft; daher wird hierfür keine konkurrierende neue Verwaltung eingeführt.

## Ein Zustand, unveränderter Wetterdatenweg

Der Aktivzustand stammt ausschließlich aus `_weatherRadarState().enabled`. Kurzklick verwendet `_weatherLayerMenuToggle('weather.precipitation.layer')` und damit denselben vorhandenen Schaltpfad wie der Niederschlags-Schnellzugriff. Dessen vorhandener Busy-Schutz bleibt erhalten. Ein zusätzlicher UI-Aufruf in `_weatherRadarUpdateControls` synchronisiert das Icon auch bei Änderungen über bestehende Menüs.

Die bestehende Aktivierungs-/Deaktivierungsfunktion, deren Speicher-, Anfrage-, Cache-, Layer- und Freigabeentscheidungen bleiben unverändert. Es gibt keinen eigenen Niederschlagsabruf, keinen Provider-Schalter und keine neue meteorologische Gültigkeitsprüfung. Wiederaktivierung folgt dem vorhandenen Wiedereinschalt-/Transportcache-Verhalten; das Icon führt keinen zusätzlichen Vollabruf neben diesem Schaltpfad ein. Eine neue Warmhaltepolitik wird nicht eingeführt.

Der gezielte Quellvergleich belegt: `precipitation-layer.js` ist nach Entfernen des einen optionalen UI-Aufrufs und seiner Modulversionsanhebung exakt identisch zum Ausgangsstand. Wind, Schlangenrenderer mit allen elf Parametern, Studio, Temperatur, Provider-/Consumer-Verträge, Radar-Compositor/-Transport/-Masken und gemeinsame Pointer-Gesten bleiben unverändert. Keine World-Wrap-Korrektur aus dem zuvor zurückgenommenen Auftrag wird übernommen.

WeatherRouter 0.10.298 / Loader 301 wird von diesem Auftrag weder geändert noch veröffentlicht. Keine private CI, keine TEST69-Wiederholung, keine wissenschaftliche OPERA-Neuvalidierung und keine fachfremde Regression.

## Gezielte Prüfungen

`node --test tests/gr-precipitation-icon.test.mjs`: **6 Tests** zu Originalidentität/PNG/RGBA/Dimensionen in Master und Auslieferung, vier Sichtbarkeitsmodi, gültigen Layoutpositionen, Erhaltung des vorhandenen Eye-Speichers, unabhängigem Radaraktivzustand und eng begrenzten Quelländerungen.

`node scripts/test-gr-precipitation-icon-browser.cjs`: tatsächlicher vollständiger registrierter GR-Modulbaum (36 Module), Leaflet und gemeinsame Ereignisbehandlung; ausschließlich HA-/WR-Transport und Rasterdaten synthetisch. Sechs Ansichten: Desktop 1280×850, Android 320×740 und 393×851, Android quer 851×393, iPad 820×1180 und quer 1180×820; DPR 2.

Geprüft werden echte PNG-Dekodierung mit 1254×1254 Pixeln, Kurzklick/Touch, erfolgreicher vorhandener Rasterrenderer, Schnellzugriffssynchronisierung, 600-ms-Maus-/Touch-Halten ohne Umschalten, Touch-/Maus-Drag ohne Klick oder Long Press, unveränderte Kartenmitte beim Drag, vier Sichtbarkeitsmodi, Standard/Groß/Vollbild, Reload, Positionen und unabhängiges Zurücksetzen, Premium-Chevron/-Dropdown/-Buttons, vorhandener Menüzugang, Viewportgrenzen und Orientierung. Einstellungen allein erzeugen keine Niederschlagsabfrage. Auch bei synthetisch nicht verfügbarer Quelle bleibt die UI schaltbar; es wird kein Daten-Erfolg vorgetäuscht.

Zusätzlich: JavaScript-Syntax, deterministischer Frontend-Build einschließlich Negativproben, Frontend-/Runtime-/DRA-Identität, Hi-Res-Retention und HA-Installationsstaging. Synthetische Screenshots und Ergebnisdateien sind als öffentlicher CI-Artefakt vorgesehen; keine Realtest- oder technischen Diagnoseexporte werden im GR-Repository abgelegt.

Die Prüfung per Browseremulation ist keine Android-/iPad-Companion- oder VM109-Realabnahme. Keine automatische Installation; VM101 bleibt unberührt.

## Dateien und Auslieferung

Neu: Originalmaster/-runtime, Assetmanifest, `frontend/modules/weather/precipitation-control.js`, gezielter Unit-/Browsertest, öffentlicher Workflow und dieser Bericht. Die neue reine UI-Hilfsdatei wird vom vorhandenen Display-Menü importiert und erhält keinen separaten Wetterdaten- oder Modulregistrierungszustand.

Erweitert: Display-Menü mit Unterkonfiguration und Lifecycle-Anbindung, Layer-Menü mit Zugang, Kartenmodus-Hooks mit Positionierung/Sichtbarkeit sowie genau eine Statusbenachrichtigung im vorhandenen Niederschlagsmodul. Versions-/Cache-Kennungen, Modul-/Runtime-Manifest, HA-Manifest/Buildinfo, DRA-Provenienz, Asset-Inventar, Builder-/Verifikationsvertrag und Frontend-Prüfsummen werden synchronisiert. HA- und Dashboard-Spiegel werden ausschließlich über den bestehenden Builder erzeugt. Asset-README/Retentionsvertrag, allgemeine README/Changelog und öffentliches Versionsrouting werden ergänzt.

176 gemeinsame Frontend-Dateien sind in HA und Dashboard enthalten, einschließlich unverändertem Original-PNG. Erwartete Paketumfänge: HA 192 Dateien, Dashboard 178 Dateien. Vollständige Änderungsdateiliste und SHA256-Prüfsummen liegen dem Release bei.

[Installierbares DEV-Release 4.11.165](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.11.165-dev). Tatsächliche Commit-/CI-/Paketnachweise werden nach erfolgreicher Prüfung und Bereitstellung unten ergänzt.


## Abschließender Release-Nachweis

Implementierungscommit: `4d55fd6446593f42cbeea4ea02b9cf86737ce46a`.

* [Öffentliche frontend-CI](https://github.com/TheDaimos/gewitterradar/actions/runs/42592381775): **success**.
* [Öffentliche ha-CI](https://github.com/TheDaimos/gewitterradar/actions/runs/42592385945): **success**.

Installierbares [DEV-Release](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.11.165-dev).

* `gewitterradar-0.25.72-dev.zip` · SHA256 `6108008645bd390d940a319711cdae9122063dbab0abc2f13da27950fa2931d9` · 192 Dateien.
* `gewitterradar-dashboard-4.11.165-dev.zip` · SHA256 `eacf410734e1079f5f654487c7faf545664952c398338fd924e373b9fcf20c9b` · 178 Dateien.

176 gemeinsame Frontend-Dateien sind zwischen HA und Dashboard bytegleich. ZIP-CRC, Python-Syntax und Paket-/Versionsidentität sind geprüft. Die Pakete werden aus dem Git-Archiv erzeugt; diese Berichtsergänzung verändert ihren Inhalt nicht.

6 gezielte Funktions-/Schutztests und sechs vollstaendige Desktop-/Touch-Browseransichten erfolgreich. Originalbytes, gemeinsame Radaraktivierung, Klick, 600-ms-Long-Press, Drag, vier Sichtbarkeitsmodi, Persistenz, Reset, Orientierung und Premium-Komponenten geprueft. Wind, Temperatur und Wetterdatenwege unveraendert. Öffentliche HA-/HACS-/hassfest-/DRA-Prüfungen erfolgreich. Keine physische Android-/iPad-/HA-Abnahme durchgeführt. Installation und visuelle Realabnahme bleiben beim Betreiber.
