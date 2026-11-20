# GR 4.11.216 DEV · verzögerter Eye-Ausfall und Hilfe & Hinweise

Ausgangsstand GR 4.11.215 / HA 0.25.122, Runtime 411215r1, `55ba463ee878aa27928ecb37e36c6d3ef05dc482`. WeatherRouter DEV `a3d1d4dd8c30f6673efd395c6c085a6662dd6d23`.

Der Eingriff betrifft den gemeinsamen Control-Gestenpfad sowie den Hilfe-Dialog. Karten-Pan und Pinch bleiben in der vorhandenen Leaflet-Recovery. Randgeometrie, Wetteranbieter, gespeicherte Profile und Navigation bleiben in ihren bestehenden Modulen.

## Historische Quellen

- [Dev-Tools-Commit 20094664](https://github.com/TheDaimos/home-assistant-dev-toolkit/commit/2009466441ddc5cf8d435d71d85470d4aa843c2e) und [Analyse vom 08.10.2026](https://github.com/TheDaimos/home-assistant-dev-toolkit/blob/main/docs/ANDROID_WEBVIEW_THREE_FINGER_SCREENSHOT_GESTURE_RECOVERY_2026-10-08.md).
- [V187-Auswertung und Zeitfolge](GR_THREE_FINGER_JOE_WIEDERAUFNAHME_MASTER_2026-11-11.md). Nach `22:00:56.184` lief der Karten-Reset durch. Ein Eye-Drag war bis `22:00:58.866` erfolgreich. Später trafen nur Touchstarts mit einem neuen Kontakt und zwei zusätzlichen Browser-Kontakten ein.
- V25 `790d50d8` ist ein Bootstrap-Prüfsummencommit. V39/40 `1f5f5210` / `df118237` verfolgen reale Touch-IDs für die Karte. V186 `32e489b9` schützt gegen fehlenden Pointer-Abschluss. V187 `fd7e2bdd` erweitert den Eye-Pfad um lokale Unterbrechung und Touch-only.

Die historische Android-Spur belegt fehlende Pointerevents. Die genaue Ursache im Betriebssystem und der Zeitpunkt einer aktuellen V215-Gerätespur stehen separat zur Realprüfung aus.

## A · Ursache im GR-Pfad und Zeitfolge

Der Browser-Gegenversuch führt drei Kontakte außerhalb des Eye aus, beendet die Systemgeste per Cancel und sendet zunächst normale Pointer- und Touch-Eingaben. Ab dem Zwei-Sekunden-Messpunkt erhält das freie Eye pro Aktion nur einen neuen Touch in `changedTouches`. In `touches` zählt die Simulation dabei zwei bereits abgebrochene IDs mit. V215 verarbeitet den Eingang bei 0 und 1 s. Bei 2 s kommt der Touch am Eye an. Das Eye lehnt ihn als Mehrfachkontakt ab, weil es lediglich die IDs eines lokal auf dem Eye abgebrochenen Drags kannte. Der Test unterscheidet diesen Fall vom verdeckten Hit-Target. Das Auftreten nach zwei Sekunden wird im Gegenversuch eingespeist und ist keine gemessene Android-interne Frist.

V216 speichert die bestätigten abgebrochenen Kontakt-IDs am Kartenbesitzer. Normale Pointer bleiben der primäre Pfad. Frische Kontakt-IDs können beim Touch-only-Eingang trotz bekannter Phantom-IDs verarbeitet werden. Echte zusätzliche Kontakte sperren den Ersatzpfad. Neue Kontakte mit wiederverwendeter ID erhalten einen eigenen Lebenszyklus. Bei Cancel sind nur der zugehörige Timer, Capture, Listener und die ausstehende Aktion betroffen. Späte Callback- oder Capture-Ereignisse dürfen eine neuere Geste nicht beenden. Das Replay prüft außerdem alte Long-Press-Callbacks nach einer neuen Eingabe.

Die Ereignisdiagnose speichert monotone Zeiten, Kontakt-IDs, Capture-/Timerzustand, sichtbares Hit-Target und relevante CSS-Eigenschaften. Die Abtastung bei 0, 1, 2, 3, 5 und 10 s beobachtet den Zustand. Sie löst keinen Reset aus. Die Spur enthält keine Geopositionen. [Anonymisierte Browser-Zeitspur](evidence/gr-help-411216/zeitspur.json) · [Dev-Tools-Eingabevertrag](https://github.com/TheDaimos/home-assistant-dev-toolkit/blob/4bd1bce3d948de1658059b5a14eb6fc2882985bd/docs/WEBVIEW_CONTROL_TOUCH_RECOVERY_CONTRACT_2026-11-15.md)

## B · Hilfe im installierbaren Frontend

Die Themen beginnen mit dem geöffneten Eye-Master und „Eye-Menü & Icon-Bedienung“. Die einzelnen Kapitel enthalten Anleitungen und Quellenhinweise für Wind, Wetterinformationen, Niederschlag, Temperatur, Wolken, Synoptik und Ebenendeckkraft. Die bestehende Fachhilfe bleibt erreichbar. Das Wort „Usability“ und „Icon-Gruppierung“ stehen in der sichtbaren Hilfe. Der Schalter im Eye-Dialog trägt dieselbe Beschriftung. Der Profilkey bleibt kompatibel.

Der Featurelist-Eintrag erscheint am Ende, solange die vorhandene lokale Discovery keine positive, eindeutige WR-Verbindung erkannt hat. Die originale PRO-Grafik wird dort verwendet. Ein bestätigter Consumer-Lauf blendet den Eintrag aus, auch wenn das Headerbild nicht dekodiert werden kann. Der Hilfe-Dialog startet keine Anfrage. [Standard mit Featurelist](evidence/gr-help-411216/hilfe-standard.png) · [PRO mit Eye-Einstieg](evidence/gr-help-411216/hilfe-pro.png)

## Testmatrix und Lieferung

| Prüfung | Nachweis |
| --- | --- |
| V215-Negativkontrolle | Touch-only-Tap bei 2 s reproduzierbar abgelehnt. Der Hit-Test erreicht das Eye. |
| V216 Browser-Zeitreihe | 5 Sequenzen, je Tap und Drag bei 0/1/2/3/5/10 s. Später Capture-Verlust, fehlendes Pointer-Ende und abgebrochener Long-Press geprüft. |
| Weitere Bedienflächen | Gruppierte Bubble, ungruppiertes Icon, Long-Press, abgebrochener Slot-Drag und verschiebbare Kartendiagnose mit Dialogbutton. Map-Pan/Pinch und Mode-/Remount-Recovery laufen in der bestehenden Browser-Suite. |
| Geschützte Funktionen | Eye-Randpositionierung und Canvas-Pixelgleichheit, Synoptik, Wolken und Profilpersistenz. Renderer, Winddatenpfad und WR-Partnerquellen bleiben ausgehend von der geschützten Referenz erhalten. |
| Hilfe | Browser öffnet alle acht Fachkapitel im Home-Assistant-Frontendausgabebaum. Standard/PRO, Originalgrafik, Navigation, Close, Scrollen und mobile Breite geprüft. |
| Installationsbaum | Frontend-Spiegel, Runtime, 37 Module und DRA-Vertrag geprüft. |
| HA DEV VM109 / physisches Android | Installation, reale Hilfe-Sichtung und fünf physische HyperOS-Screenshot-Zyklen mit Wartepunkten und Bedientests stehen aus. |

Die neue Version ist GR **4.11.216 DEV / HA 0.25.123**, Runtime `411216r1`, Modulset `E411-216A1`. Hauptdateien sind `control-touch.js`, `display-menu.js`, `eye-hub-view.js`, `map-diagnostics.js`, `help-topics.js`, `i18n-settings.js`, `skeleton.js` und die Eye-Übersetzungen. Der öffentliche gezielte Workflow prüft beide Aufgabenteile. Allgemeine CI-Abweichungen beim Wind-Referenztest, alten Raster-Labor-Testaufbau und der HACS-Lizenzerkennung werden separat behandelt.

[DEV-Release mit Quellcommit, Paketprüfsummen und Deployment-Metadaten](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.11.216-dev). Das Repository-Ziel ist `deploy/dev`. Der Stand wird für HA DEV VM109 bereitgestellt. DRA-Installation und reale Abnahme sind getrennte Schritte. In der privaten Projektchronik wurde kein zur neuen V215-Zeitangabe passender Exportpfad gefunden. Der V187-Befund und der V215-Browser-Replay sind getrennte Nachweise.
