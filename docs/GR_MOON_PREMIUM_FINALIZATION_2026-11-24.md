# Premium Moon Legend – technische DEV-Finalisierung

Ausgangsquellen am 24.11.2026: GR `c70faed4`, WR `ad6cc45a`. Die geschützten Betreiberreferenzen bleiben eigenständig gültig. Keine PROD-Änderung und kein FINAL-Release.

## Vorab abgegrenzter Eingriffsbereich

Die vorhandene Moon Engine und der vorhandene nicht modale Legend-Hub-Verbraucher werden weitergeführt. Änderungen sind auf Mondfenster, dessen Bilder und Datenvertrag, zugehörige Tests und die reguläre neue DEV-Lieferidentität begrenzt. Die gemeinsame Persistenz wird ausschließlich mit dem vorhandenen Moon-Slot, dessen Modus und normierter Fensterposition verwendet.

Unbeabsichtigt betroffen sein könnten Legend-Hub-Lifecycle und Importpfade, Vault-Normalisierung, Karten-Pointer/Wheel-Ereignisse sowie Build-Inventare und Frontend-Spiegel. Diese Pfade werden gezielt geprüft. Geschützte Wetterprovider einschließlich NASA Moon Trek, Eye-Geometrie/Aura/Control und fachliche Wetterberechnungen werden nicht verändert. Die isolierten Moon-WebSocket-Tests verwenden HA-Transportadapter; eine physische HA-/Android-Abnahme wird daraus nicht abgeleitet.

## Ergebnis und neue DEV-Identität

**GR 4.12.16 DEV / HA 0.25.177**, Runtime `41216r1`, Modulset `E412-16A1`, 37 registrierte Module. Der reguläre Build wurde tatsächlich ausgeführt; kanonisches Frontend, HA-/Dashboard-Spiegel, Cache-Importrevisionen, Runtime- und Asset-Inventare sowie Checksummen stimmen überein. Die Moon-Legende bleibt ein ausdrücklich erfasster Hilfsbaustein des vorhandenen registrierten Legend-Overlay-Moduls; es wird kein unabhängiges 38. Modul vorgetäuscht.

Die bestehende WR-Runtime **0.10.329 DEV / Loader 332** benötigte in den ausgeführten Prüfungen keine Quellkorrektur. [WR-Prüfcommit `cfdc8c72`](https://github.com/TheDaimos/weather-router-dev/commit/cfdc8c722ff4aef9d919e7cc3e0a783314473334) ergänzt ausschließlich Tests und Bericht. Alle Wetterprovider einschließlich NASA Moon Trek bleiben unberührt; keine privaten Actions ausgelöst.

## Korrekturen am vorhandenen Verbraucher

- Nicht modales, frei verschiebbares Fenster als Karten-Overlay mit Pointer Capture, Maus- und Touchbedienung, normierter persistenter Position, sichtbaren Karten-/Viewportgrenzen und Reflow. Auf kleinen Ansichten bleibt ein bedienbarer Kartenstreifen frei. Nur Ereignisse innerhalb des Fensters werden lokal abgefangen; Leaflet-Gesten bleiben aktiviert.
- Kartenmitte und Zoom als Anfragebasis, normierter Längengrad, Aktualisierung nach Bewegung/Zoom, Entwertung schon bei Bewegungsbeginn, 250-ms-Bündelung und 60-s-Refresh. 15-s-Anfragegrenze, strikte Antwort-/Zahlen-/Ereignisvalidierung sowie Schutz vor überholten Antworten. Beim Schließen werden Timer, laufende Antwortverarbeitung, Kartenlistener und Observer freigegeben.
- Anzeige der von WR gelieferten geografischen IANA-Zeitzone; Datum/Uhrzeit werden mit dieser Zone formatiert. Fehlende Auf-/Untergangsereignisse werden ausdrücklich angezeigt. UTC wird als UTC/Fallback kenntlich gemacht. Physische Beleuchtung, Zyklusfortschritt und nächste astronomische Hauptphase werden getrennt dargestellt.
- Der gespeicherte offene Zustand wird nun auch dann wiederhergestellt, wenn die PRO-Bereitschaft erst nach dem ersten Hub-Resume eintritt. Die beiden expliziten Hub-Ergänzungen sind durch einen inversen Quellvergleich begrenzt.
- Acht vorhandene 512er-Phasen für die Leiste und acht unveränderte 1254er-Originale für die große Phasendarstellung. Der Vollmond verwendet die ursprüngliche Silber-Platin-Masterdatei. Keine Neugenerierung, keine Änderung einer Referenzgrafik.

## Tatsächlicher visueller Designvergleich

Die ursprüngliche [Fensterreferenz](design/legend-hub/moon/references/moon_legend_premium_master.png) wurde direkt mit echten Browser-Renderings der tatsächlichen Karte verglichen. Nachgebessert wurden der mehrfach konturierte Silber-Platin-Rahmen, Lichtkanten, dunkelblaue Glasoberfläche, Tiefe/Schatten, Serifenkopfzeile, Mondbadge, rundes silbernes Close, sechs strukturierte Datenzeilen mit feinen Icons, Zyklusbalken, acht Phasen und aktiver Glasrahmen. Der eigenständige Zoomhinweis verwendet dieselbe Materialgestaltung und das originale Mondmotiv. Auf schmalen Ansichten werden die Informationen gestapelt und die Phasen in zwei Reihen angeordnet; das Fenster scrollt, während Kopf und Close erreichbar bleiben.

Die Umsetzung ist eine responsive CSS-Interpretation des verbindlichen Bildmasters, **keine behauptete Pixelidentität**. Kartendarstellung und bestehende Kartenbedienelemente ersetzen bewusst die dekorative Sternen-/Wolkenkulisse des Entwurfs. Die astronomischen Beispielwerte wurden nicht aus dem Bild übernommen. Die Testaufnahmen verwenden öffentlich unkritische Beispielkoordinaten und tatsächlich von WR berechnete Ephemeriden vom 25.03.2024; sie sind keine aktuelle HA-Realaufnahme.

| Ansicht | Vorher | Finale Mondlegende | Vollständiger Phasenbereich | Zoomhinweis |
|---|---|---|---|---|
| Desktop 1448 × 1086 | [Bild](evidence/gr-moon-premium/desktop-before.png) | [Bild](evidence/gr-moon-premium/desktop-moon.png) | [Bild](evidence/gr-moon-premium/desktop-phases.png) | [Bild](evidence/gr-moon-premium/desktop-zoom.png) |
| Tablet 1024 × 768 | [Bild](evidence/gr-moon-premium/tablet-before.png) | [Bild](evidence/gr-moon-premium/tablet-moon.png) | [Bild](evidence/gr-moon-premium/tablet-phases.png) | [Bild](evidence/gr-moon-premium/tablet-zoom.png) |
| Smartphone 393 × 851 | [Bild](evidence/gr-moon-premium/smartphone-before.png) | [Bild](evidence/gr-moon-premium/smartphone-moon.png) | [Bild](evidence/gr-moon-premium/smartphone-phases.png) | [Bild](evidence/gr-moon-premium/smartphone-zoom.png) |
| Smartphone quer 851 × 393 | [Bild](evidence/gr-moon-premium/phone-landscape-before.png) | [Bild](evidence/gr-moon-premium/phone-landscape-moon.png) | [Bild](evidence/gr-moon-premium/phone-landscape-phases.png) | [Bild](evidence/gr-moon-premium/phone-landscape-zoom.png) |

## Tatsächlich ausgeführte Prüfungen

[Maschinenlesbarer lokaler Prüfbeleg](evidence/gr-moon-premium/local-verification.json), [Moon-Browsermatrix](evidence/gr-moon-premium/results.json), [aktuelle Hub-/Profilmatrix](evidence/gr-moon-premium/legend-hub-profile-results.json).

| Prüfung | Ergebnis |
|---|---|
| WR Moon Engine | PASS, 11 Tests: Phase/Alter/Zyklus/Beleuchtung, alle acht Phasen, Ortsabhängigkeit, IANA, Datumswechsel, 23-/25-Stunden-DST-Tage, Polarereignisse, Fallback und ungültige Eingaben |
| WR Moon WebSocket | PASS, 6 Tests des tatsächlichen Handlers/Voluptuous-Vertrags mit HA-Dekorator-/Executoradaptern, einschließlich realer Ephemeriden, paralleler Orte und Fehlercodes |
| Moon-Browser | PASS, vier Formate: echte Maus-/Touch-Fensterdrags, echte Kartenbewegung außerhalb des Fensters, Grenzen/Resize, alle acht Phasen, Zeitzonenwechsel, umgekehrt aufgelöste Antworten, Zoomgrenze, ungültige/ausgefallene Daten, Timeout und verspätete Antwort, virtueller 60-s-Refresh, reduzierte Bewegung, Reload, Schließen während Anfrage und keine Anfragen danach |
| Moon-Grafiken | PASS, alle acht 1254er-Originale bytegleich, RGBA, SHA-256 und drei Lieferbäume; große Darstellung aller acht Phasen im echten Desktop-Browser dekodiert |
| Aktueller Legend Hub / Vault | PASS, drei Formate mit Slotdrags/-Rückkehr, Long Press, Sloteditor, Reload und Profilwechsel; zusätzlich Moon-Slot, Zustand und Position über authentifizierte Testprofile geprüft |
| Reales Python-Vault-Schema | PASS, Bestandsprofile, Moon-Slot/Modus/Position und Ablehnung ungültiger Werte |
| Aura-/Eye-Browser | PASS, drei Auraformate, 1–8 Slots, stabile Pointer-Ziele, acht Kanten/Ecken, reduzierte Bewegung und Reload; Eye-Randmatrix mit Drag/Rotation/Safe-Areas/Canvas-Parität; verzögerte Recovery in fünf Zyklen bei 0/1/2/3/5/10 s |
| Settings-Vault-Browser | PASS, bestehende Auth-/Migrations-/Retry-/Geräte-/Kontenmatrix |
| Quellschutz | PASS, 111 vollständige andere Modulfunktionskörper unverändert bis auf zwei exakt enumerierte Moon-Wiederherstellungshooks; tatsächliches Vault-Schema und vorhandene Runtime-Grafiken gleich; geschützte Aura-/FINAL-Wetterkörper zusätzlich geprüft |
| Wetter-/Menüverträge | PASS, 30 Node-Tests; 17 weitere tatsächlich ausgeführte Node-Befehle aus dem Shared-Workflow |
| Modelle | PASS, Legend Hub 2184 Layouts, Aura 1458 Geometriefälle, Eye/WOW und Quellenmodell |
| Build / Inventare | PASS, regulärer Build, deterministischer Neuaufbau mit negativen Manipulationsproben, 37 Module, 227 Kern-Frontenddateien, drei Lieferbäume und Checksummen |
| Sonstige Prüfungen | PASS, Hi-Res-Retention sowie Python-/JSON-/YAML-Syntax und acht statische Paket-/Metadatenprüfungen |

**Historischer Test separat:** `test-v412-legend-browser.cjs` scheitert bereits auf dem unveränderten Ausgangscommit `c70faed4` an seiner Erwartung eines inzwischen entfernten Synoptik-Dichtefelds. Derselbe Fehler wurde vor und nach der Moon-Änderung tatsächlich reproduziert. Dieser Test wurde nicht als bestanden ausgegeben oder abgeschwächt. Für die neue DEV-Version wird die aktuelle Hub-/Slot-/authentifizierte Profilmatrix zusammen mit Moon-, Aura-, Rand- und Recovery-Prüfungen ausgeführt; der strenge Quellschutz schützt die anderen Funktionskörper. Die älteren versionsspezifischen CI-Pfade bleiben erhalten.

## Offene Realabnahme und Bereitstellung

Nicht durchgeführt: physische Android-Abnahme, Installation auf HA DEV VM109 und Ende-zu-Ende-Verbindung mit dessen tatsächlich authentifiziertem WebSocket. Die ausgeführten WR-Handler-/Schema- und Browser-Transporttests ersetzen diese Betreiberabnahme nicht. Keine PROD-Änderung und keine neue Referenzfreigabe.

Öffentliche CI, exakte Paketidentitäten und DEV-Veröffentlichung werden nach Quellcommit und tatsächlich erfolgter Bereitstellung ergänzt.
