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

## Verifizierter Lieferabschluss

**Veröffentlicht:** [DEV-Prerelease v4.12.16-dev](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.12.16-dev), Prerelease=true, Draft=false. Tag und beide Installationspakete binden den tatsächlich geprüften Quellcommit [`d49915fd96bc39a5c54300e48e5492de5f89c093`](https://github.com/TheDaimos/gewitterradar/commit/d49915fd96bc39a5c54300e48e5492de5f89c093).

**Alle zwölf öffentlichen Gates dieses Quellcommits erfolgreich:** [Frontend einschließlich Linux-Moon-/Hub-/Aura-/Kartenprüfung](https://github.com/TheDaimos/gewitterradar/actions/runs/45367445714), [HA-Integration](https://github.com/TheDaimos/gewitterradar/actions/runs/45367445548), [Vault/Neon/Gesten/HACS/Pakete](https://github.com/TheDaimos/gewitterradar/actions/runs/45367445561), [Synoptik](https://github.com/TheDaimos/gewitterradar/actions/runs/45367446051). [Vollständiges CI-Inventar](evidence/gr-moon-premium/ci-results.json), [Linux-Moon-Ergebnisse](evidence/gr-moon-premium/linux-moon-results.json), [Linux-Hub-/Moon-Profile](evidence/gr-moon-premium/linux-hub-profile-results.json), [Linux-Aura](evidence/gr-moon-premium/linux-aura-results.json). Keine Übertragung fremder grüner Läufe auf eine ungeprüfte Quelle.

| Veröffentlichtes Paket | SHA-256 |
|---|---|
| `gewitterradar-0.25.177-dev.zip` | `a03a8cbe0bff355db215557adb36c7d287beb7ddcf3208222ce5c80b02d96bd2` |
| `gewitterradar-dashboard-4.12.16-dev.zip` | `b3f12cc29420409a8e5e1d630ae1afa03243862ea2d71ae6bb003baf2638e2ec` |

267 Integrations- und 250 Dashboarddateien, 248 gemeinsame Frontenddateien bytegleich. **Alle 517 ZIP-Nutzdateien direkt gegen ursprüngliche Git-Blobs mit `git cat-file --batch` geprüft**, beide CRCs korrekt. Kanonischer lokaler Neuaufbau mit deaktivierter Git-CRLF-Konvertierung ist bytegleich zum heruntergeladenen Linux-CI-Artefakt; auch die veröffentlichten GitHub-Asset-Digests stimmen. [Deploymentmanifest](evidence/gr-moon-premium/deployment.json), [Prüfsummen](evidence/gr-moon-premium/SHA256SUMS.txt), [Original-Blob-/Linux-Abgleich](evidence/gr-moon-premium/original-blob-verification.json). Der erste Windows-Archivkandidat unter `.task412-moon/release/` enthielt konvertierte Python-Zeilenenden und wurde ausdrücklich nicht veröffentlicht. Verbindlich sind `.task412-moon/release-canonical/` und die damit identischen Linux-/Release-Dateien.

Während der CI ergänzte der bestehende öffentliche Synchronisierungsworkflow den Commit `9309899e`: ausschließlich Sortierung/Bereinigung des Quell-Assetinventars. Die installierbaren Integrations-/Dashboardbäume sowie Tests und Workflows sind exakt gleich zum geprüften Quellcommit; der Vergleich steht im CI-Beleg. Nachfolgende Abschlussdokumentation ändert die Produktbäume ebenfalls nicht. Neue geschützte Referenzen werden daraus nicht abgeleitet.

**DRA-DEV bereitgestellt:** vorhandener Entwicklungsquellweg `TheDaimos/gewitterradar` / `deploy/dev`, neue Version 4.12.16 / HA 0.25.177, vollständige verifizierte Pakete als DEV-Prerelease. Die DRA-Konfiguration wurde nicht verändert und keine Installation auf VM109 oder VM101 ausgelöst. Stabiles Latest `v4.12`, FINAL `v4.11.3` und technische Aura-Referenz `v4.12.3-dev` behalten ihre zuvor geprüften IDs/Tag-SHAs. Die physische Betreiberabnahme bleibt offen.
