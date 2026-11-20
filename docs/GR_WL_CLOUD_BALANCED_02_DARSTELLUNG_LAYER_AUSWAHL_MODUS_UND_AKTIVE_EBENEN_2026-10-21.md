# GR-WL-CLOUD-BALANCED-02 – Darstellung: Ebenenauswahl, eigener Wolkenmodus und Übersicht aller aktiven Rasterebenen

**Datum:** 21.10.2026  
**Repository:** `TheDaimos/gewitterradar`, ausschließlich `deploy/dev`  
**Ausgangsversion:** V4.11.104 DEV  
**Neue Laufzeitversion:** **V4.11.105 DEV** / `411105r1` / `E411-105A1`  
**Integration:** weiterhin `0.25.18`, bewusst unverändert.  
**Programmstand für eine getrennte CI-/DRA-Prüfung:** `a0b9c72bbf1364e59c5d144b3870b05b5e47f431`.

## 1. Betreiberentscheidung und Abgrenzung

Der Betreiber hat den bisherigen Testknopf **„Wolken · Ausgewogen als Versuch laden“** im Raster-Labor ausdrücklich **nicht** als die gewünschte endgültige Bedienung akzeptiert. Der neue, aus den vom Betreiber am Android-Gerät abgestimmten Originalversuchen abgeleitete Wolkenmodus muss **direkt im normalen Darstellungsfenster** unabhängig von Niederschlag auswählbar sein.

Ergänzend wurde eine platzsparende Bedienung konkret beauftragt: ein Dropdown zur **Auswahl der Wetterebene**, darunter ein zweites Dropdown mit den **für diese Ebene tatsächlich verfügbaren Darstellungsmodi**. Zuletzt wurde ein **kreisförmiges goldenes „i“** gefordert; ein Klick muss alle aktuell aktiven Ebenen und ihre Einstellungen in einer lesbaren Übersicht zeigen.

Diese Änderungen sind im bereits bestehenden Modul `weather.display-menu` umgesetzt, ohne eine zweite Darstellungsarchitektur zu entwickeln oder die ursprünglichen Niederschlagsprofile zu verändern.

## 2. Neue Bedienung im regulären schwebenden Fenster „Darstellung“

Das schwebende Darstellungsfenster hat oben:

1. **Wetterebene** – Auswahlliste `Niederschlag` / `Wolken`;
2. direkt darunter die zu dieser Ebene gehörende **Darstellungsmodus-Auswahlliste**.

Bei **Niederschlag** sind weiterhin ausschließlich `Auto`, `Präzise`, `Ausgewogen`, `Weich` verfügbar. Die bisherige Transparenzregelung für Niederschlag bleibt im zugehörigen Kartenbereich erhalten und wird nicht mit den Wolkeneinstellungen vermischt.

Bei **Wolken** stehen die eigenständigen Optionen **`Original`** und **`Ausgewogen`** zur Verfügung. Nur die jeweils ausgewählte Ebenenkarte wird dargestellt; die andere bleibt zur platzsparenden Bedienung ausgeblendet, ihre Einstellung jedoch weiterhin getrennt in `config.styles` erhalten.

Die Wahl der Wetterebene bedeutet **keine automatische Aktivierung/Deaktivierung** von Wetterdiensten oder eine Veränderung von WeatherRouter-Routing. Das Einschalten erfolgt weiterhin im tatsächlichen Layer-Menü.

## 3. Wolken „Ausgewogen“ – produktiver Kartenmodus

Der neue Modus wird in `WEATHER_DISPLAY_STYLES.clouds` registriert und unter `styles.clouds` getrennt vom Niederschlagsmodus gespeichert. Der Standard für Wolken ist `original`. Der ausgewählte Wolkenmodus wird bei Kartenzoom und nach erfolgreichen generischen Wolken-Ladeereignissen auf **dem wirklichen Wolken-Pane `gr-wr-clouds`** wieder angewendet, nicht auf dem Niederschlags-Pane `gr-weather-radar`.

Die eingesetzten Werte wurden **ohne neue Interpolation oder Profilabstimmung** aus der von dir bereitgestellten Versuchsreihe übernommen:

| Kartenzoom | Wolken Ausgewogen – zusätzliche Unschärfe |
| ---: | ---: |
| 2 | 0 px |
| 5 | 0 px |
| 6 | 3 px |
| 7 | 6 px |
| 8–10 | 10 px |
| 11 | 11 px |
| 12 | 19 px |
| 13 | 20 px |
| 14 | 23 px |
| 15 | 24 px |
| 16 | 23 px |
| 17 | 24 px |
| 18 | 29 px |

**Zoom 3 und 4:** Für diese Zoomstufen wurden im Originalexport keine Einzelversuche geliefert; dort gibt es weiterhin **0 px zusätzliche Unschärfe**, keine erfundenen Messwerte. Das gilt ebenfalls für nicht tabellierte Kartenzoomwerte. Helligkeit, Kontrast, Farbsättigung und Deckkraft des Wolkenmodells werden nicht pauschal verändert.

Die zusätzliche Wolkenglättung wird über den **bestehenden Pane-CSS-Filter** angewendet. Der bestehende Labor-Diagnoseadapter kann für bewusste temporäre Versuche weiterhin unabhängig genutzt werden. Die bislang im Raster-Labor eingeführte Schaltfläche zum Laden der Werte bleibt als separater Diagnoseweg erhalten, wird aber **nicht mehr für die reguläre Aktivierung** benötigt.

## 4. Goldene Informationsschaltfläche für aktive Ebenen

Neben den bisherigen Kopfbedienelementen des Darstellungsfensters wurde eine **runde, goldene i-Schaltfläche** mit zugänglichem Namen `Aktive Wetterebenen und Darstellungen anzeigen` ergänzt.

Beim Anklicken erscheint im gleichen Fenster eine gesonderte, bei Bedarf vertikal scrollbare Übersicht. Sie stellt die Informationen nur als Text bereit; keine Änderung von Wetter-, Transparenz- oder Renderparametern erfolgt durch den Klick.

- **Niederschlag** wird aufgeführt, wenn der eigentliche Niederschlags-Layer aktuell vorhanden ist. Angezeigt werden der gewählte Modus `Auto/Präzise/Ausgewogen/Weich` und seine eingestellte Transparenz.
- **Generische aktive Rasterebenen** werden anhand der **realen**, in `__weatherGenericStates` vorhandenen und `enabled` gesetzten Layer ermittelt. Für Wolken werden `Original/Ausgewogen` und der tatsächliche Zustand (`Lädt`, `Karte aktiv`, `Teilweise`, `Keine Daten`, `Fehler`) aufgeführt. Auch aktive Wind-Rasterlayer beziehungsweise weitere generische Layer erhalten ihren tatsächlichen Status; für sie wird mangels eigenen Darstellungsprofils `Original` ausgegeben.
- Sind keine aktiven Rasterebenen identifizierbar, zeigt die Übersicht `Keine aktiven Wetter-Rasterebenen`.

**Datenschutz/Sicherheit:** Die Übersicht verwendet DOM-`textContent` und `createTextNode`, keine unbereinigten Providertexte über `innerHTML`. Es werden keine Koordinaten, Tokens oder Wetterrouter-Rohdaten ausgegeben. Die Anzeige wird bei jeder Öffnung neu aus dem aktuellen Modell erzeugt.

## 5. Geänderte Dateien, Spiegelung und Integrität

Betroffene Produktionsmodule:

- `frontend/modules/weather/display-menu.js` – Modulversion **0.4.19**, neuer Wolkenmodus, beide Dropdowns und goldenes i mit Layerübersicht;
- `frontend/modules/weather/layer-menu.js` – Wiederanwendung des Wolkenmodus nach dem vorhandenen Abschluss eines Wolken-Rasterladezyklus.

Beide Module wurden bytegleich nach `dashboard/dist/` und `custom_components/gewitterradar/frontend/` gespiegelt. Zentraler Build, Laufzeitkennung, Module-Manifest, Integrationsmetadaten und bestehende feste Versionstestkontrakte wurden passend zu V4.11.105 fortgeschrieben.

Die kanonisch sortierte Prüfsummendatei `SHA256SUMS_FRONTEND.txt` wurde für die geänderten Auslieferungsdateien erneuert, ebenso der Inhaltsdigest des Laufzeitmanifests in `frontend/assets.json`. Ein anfänglich nicht übereinstimmender Layer-Menu-Prüfsummeneintrag wurde durch Vergleich der **vom realen GitHub-Build generierten** SHA-256-Werte berichtigt; Integritätsprüfungen wurden nicht ausgeschaltet.

**Tatsächliche Entwicklungscommits:** `f578a95a4aa52a688d384d5951230a4e108d2fb8` (produktiver eigener Wolkenmodus), `5ad54ed2b8016b3eaf23ea476ec84a19df655374` (zwei Dropdowns), `2982ea1246333ad17d269be4dbde3c07c7344641` (goldene aktive Ebenenübersicht), `7e8b890634d575e21b30e5a1c5213fb370fb0833` und `701086a76cc19c2b63c6d6515e6adeab3c090794` (Versionsidentität und drei Frontendspiegel), `9158da524601526f836984e96123e7279053cee9` und `c6e99367e55b4d064e76874d0438dd1ad2f338ac` (geschützte bestehende Testverträge), `a0b9c72bbf1364e59c5d144b3870b05b5e47f431` (Prüfsummen des finalen Kandidaten).

## 6. CI und noch offene echte Abnahmen

**Gemeinsamer Codecommit für die abschließenden CI-Pushläufe:** `a0b9c72bbf1364e59c5d144b3870b05b5e47f431`.

Prüfläufe:

- [Gemeinsames Gewitterradar-Frontend – 39680758042](https://github.com/TheDaimos/gewitterradar/actions/runs/39680758042)
- [Version / Einstellungen / Runtime – 39680757969](https://github.com/TheDaimos/gewitterradar/actions/runs/39680757969)
- [Home-Assistant-Integration – 39680758020](https://github.com/TheDaimos/gewitterradar/actions/runs/39680758020)

Der **vollständig verifizierte Schlussstatus** dieser Läufe wird in einem abschließenden Abschnitt nach dem letzten realen GitHub-Check festgehalten. Ein laufender oder fehlerhafter Lauf ist kein erfolgreicher Gesamt-CI-Nachweis.

**Weiterhin nicht durch einen tatsächlichen HA-DEV-Realtest bestätigt:** Die Bedienung des neuen Darstellungsfensters auf Android/Desktop, der i-Übersicht bei beliebigen Layerkombinationen, optische Auswirkungen des produktiven Wolkenmodus nach echten Quellen-/Regionwechseln sowie die weitere vollständige V1-/V2-Ende-zu-Ende-Rendererintegration. Bestehende synthetische Browser-Pixelregressionen und Integrationsverträge bleiben erhalten.

## 7. Betreiberverfahren und Schutzbedingungen

Erst nach erfolgreichen relevanten CI-Prüfungen ist eine **kontrollierte Betreiberinstallation** der unterscheidbaren **V4.11.105 DEV** über DRA V1 auf **HA DEV VM 109** vorgesehen. Vorher die bisherige tatsächliche Version, die gewählte Referenz `deploy/dev`, die vollständige Commitkennung, eine rückspielbare Sicherung und den notwendigen DEV-Neustart prüfen. Keine automatische DRA-Installation. **HA PROD VM 101 bleibt vollständig ausgeschlossen.**

Nach eigenhändiger Installation zum Prüfen: „Darstellung“ über das Augenmenü öffnen, **Wetterebene → Wolken**, darunter **Ausgewogen** wählen. Zum Vergleich **Original** wählen; anschließend im goldenen **i** kontrollieren, ob alle aktivierten Ebenen mit ihren jeweiligen Einstellungen erscheinen. Niederschlag → Auto/Präzise/Ausgewogen/Weich und Transparenz unverändert testen, bei Zoomen 8–13, Kartenbewegung und vollständigem Wolken-Kachelneuladen die Wirkung prüfen.

**Keine Veränderung an WeatherRouter, UTC, V1-/V2-Verträgen, ursprünglichen vier Niederschlagsprofilen, HA DEV oder HA PROD; keine behauptete HA-Realabnahme.**

**C.K. – Eine Idee weiter gedacht.**

## 8. Endgültige GitHub-CI-Abnahme

Der unveränderliche **Programmcommit `a0b9c72bbf1364e59c5d144b3870b05b5e47f431`** wurde auf GitHub nach Abschluss aller Jobs erneut überprüft. Drei wesentliche Push-Workflows bestätigten denselben `head_sha` sowie den Status **`completed / success`**:

| Bereich | GitHub-Actions-Lauf | Ergebnis |
| --- | --- | --- |
| Gemeinsames Frontend, alle Spiegel, SHA-256 und bestehende Chromium-Regressionen | [39680758042](https://github.com/TheDaimos/gewitterradar/actions/runs/39680758042) | **SUCCESS** |
| Einstellungen und zentrale Versions-/Runtime-Identität | [39680757969](https://github.com/TheDaimos/gewitterradar/actions/runs/39680757969) | **SUCCESS** |
| Gewitterradar-Integration einschließlich aller Paket-/HACS-/Home-Assistant-Laufzeitprüfungen | [39680758020](https://github.com/TheDaimos/gewitterradar/actions/runs/39680758020) | **SUCCESS** |

Der zuerst fehlgeschlagene Prüflauf hatte noch den alten festen Sollwert für das Modul `weather.display-menu` (`0.4.18` statt `0.4.19`) sowie einen fehlenden neuen SHA-256-Wert für den geänderten generischen Layer-Hub. Die Testdaten und die kanonische Prüfsummenliste wurden korrekt an die tatsächlichen unveränderten Sicherheits- und Lieferverträge angepasst; **keine Testsperre wurde abgeschaltet**. Im endgültigen Programmcommit waren alle drei Kernprüfungen grün.

**Ergebnis:** V4.11.105 DEV ist **CI-geprüft und als vorläufiger HA-DEV-Sichttestkandidat verfügbar**, nicht auf HA DEV/PROD installiert und nicht realabgenommen. Die Übersicht über aktive Ebenen sowie die beiden Dropdowns benötigen noch die manuelle Android-/Desktop-Prüfung des Betreibers an tatsächlich geladenen Wetterkarten.
