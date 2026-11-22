# GR V4.12.3 DEV – technische Aura-Referenz

## Geschützter technischer Lieferanker vor dem Legend Hub

**GR 4.12.3 DEV / HA 0.25.164**, Build `V4.12.3-DEV-2026-11-22`, Runtime `4123r1`, Modulset `E412-3A1`. [Eigenständiger DEV-Release](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.12.3-dev), vollständiger Quellanker **`b96f1e350eb054972bfffe3e9a631069c4c5d358`**. Integration und Dashboard, `deployment.json` und SHA-256-Inventar sind veröffentlicht und gegen die GitHub-Asset-Digests verifiziert.

Die Produktbäume sind byteidentisch zum Funktionscommit `380df6ddbdd81dd288ac6d695b5885a543785648` und zum vollständig geprüften Teststand `ec1d48c61f5fd58cffbbbe46451b2cfbb15df630`: Git-Tree `frontend` = `27db6c0d7a80ad585f6d142c89b865821f19494c`, Integration = `f8f59acefe13c22ee5beb102eb511b68c8014c64`. Der letzte Quell-HEAD ergänzt ausschließlich zwei Prüfberichtzeilen. Das ist ein expliziter Inhaltsnachweis, keine ungeprüfte Gleichsetzung eines neueren HEAD mit einer Freigabe.

Öffentlich PASS: [breites Linux-Frontend, strenger About-Golden-Master und Aura-Matrix](https://github.com/TheDaimos/gewitterradar/actions/runs/45025632375), [HA 2026.9.0 / Hassfest / HACS / Pakete](https://github.com/TheDaimos/gewitterradar/actions/runs/45025632498), [vollständige Synoptik-/Touch-/Cloud-/Recovery-/Help-Kette](https://github.com/TheDaimos/gewitterradar/actions/runs/45025632406), [Navigation](https://github.com/TheDaimos/gewitterradar/actions/runs/45025632505). Wiederholungen nach reinem Dokumentations- bzw. Release-Tag-Push sind getrennte Läufe auf denselben Produktbäumen und ersetzen diese Quellanker nicht.

SHA-256: Integration `1dcef061d09ae386c7870632954bad63d137d9890c445bd19d158bc1bc0e7e2a`, Dashboard `645561b6618a74cf5d931bbc4c1bb1368fddcd27bde871c07338e2e817e322d8`. 236 beziehungsweise 219 Paketdateien, 217 gemeinsame Frontenddateien bytegleich. Keine reale HA-DEV-/Android-Installation oder Betreiberabnahme behauptet; bestehende Betreiberreferenzen bleiben gültig.

Die 4.12.3-Anordnung schützt auch während Übergängen die aktuellen Hindernisse: normale Slotänderungen bleiben weich, ein bereits blockierter oder durch ein Kartenbedienelement verlaufender Trefferbereich wird sofort in die sichere Ziellage korrigiert. Reduzierte Bewegung und statischer Scheduler-Stopp sind geprüft. Diese technische Aura-Referenz ist bei Teil 2 vollständig zu erhalten.

## Historischer erster Aura-Zwischenstand 4.12.1

GR **4.12.1 DEV**, HA **0.25.162**, Runtime `4121r1`, Modulset `E412-1A1`, Build `V4.12.1-DEV-2026-11-22`. Historischer erster Kandidat, durch 4.12.3 ergänzt. Unveränderlicher Quellanker: **`66c078b72f8140656bb0ea925a1086818a484e30`**, [DEV-Release `v4.12.1-dev`](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.12.1-dev). Veröffentlichte Quellen und Pakete werden nicht überschrieben.

Die Veröffentlichung `v4.11.3` / V4.11.03 FINAL (`af70fe2bf85a88fdea402cf46e3bd6a11903189b`) bleibt die geschützte Ausgangsreferenz. WR-/GR-Betreiberreferenz vom 13.11. und die Eye-Randreferenz bleiben erhalten. Dies ist eine geschützte **technische Implementierungsreferenz**, keine erfundene neue Betreiberabnahme auf HA DEV VM109 oder Android.

## Verhalten

- Bestehende Eye-Control-Auswahl „Aura-Anordnung“: feste Positionen oder dynamisch. Bestandsprofile und Standardwerte behalten die feste Anordnung gemäß dem bisherigen 4.12-Backlog; die neue Auswahl aktiviert die dynamische Kompaktierung. Alle 19 Sprachvarianten besitzen eigene Texte.
- Sichtbare Aura-Ringe werden bei dynamischer Anordnung in der gespeicherten Slot-Reihenfolge lückenlos auf die bestehenden Ringradien projiziert. Logische Slotidentität, Funktionsfarbe und Filamentphase bleiben getrennt von der visuellen Ringnummer. Individuell ausgeschaltete Auren, leere Slots, fehlende Farben und inaktive/unverfügbare Funktionen reservieren keinen sichtbaren Ring.
- Icons bleiben unabhängig vom Aktivitätszustand ihres Wetter-Layers erreichbar. Die vorhandene kompakte Iconliste bleibt erhalten. Bei ausreichendem Raum bietet die dynamische Anordnung eine gleichmäßige Umlaufverteilung; an Rändern und Hindernissen bleiben der etablierte Platzierungssolver und die Seitennavigation zuständig. Eye-/Icongröße und Aura-Abstand fließen ein.
- Vorhandene Icon-DOM-Knoten bleiben beim Hinzufügen, Entfernen und Neuordnen erhalten. Endliche 240-ms-Übergänge verändern Position beziehungsweise Ringradius, ohne Filamentrotation neu zu starten. Statische Auren beenden den Scheduler nach dem Übergang. Reduzierte Bewegung setzt die Endposition auch bei einem Wechsel während des Übergangs unmittelbar.
- Acht UI-Slots; zwölf Slots bleiben als Datenspeicherung und Geometrie vorbereitet. Gespeicherte Eye-Anker, Drag-Bounds, Long Press, gemeinsame Touch-Recovery und Wetterentscheidungen behalten ihre bisherigen Pfade.
- Profilpersistenz verwendet denselben Eye-Vault-Schlüssel. Die serverseitige Schemaergänzung erlaubt ausschließlich `fixed` und `dynamic`; bestehende Profile benötigen keine Migration.

## Nachweise und Grenzen

Die neue Browsermatrix verwendet die tatsächliche registrierte Karte, Leaflet, DOM und Canvas mit synthetischem HA-/WR-Transport: Desktop 1280 × 900 sowie Touch 393 × 851 und 851 × 393. Geprüft: 1–8 Slots, Lücken, Reihenfolge, Aktivität/Icons, erhaltene Pointer-Ziele, alle acht Rand-/Ecklagen, sanfter Radiusübergang, Scheduler-Stopp, reduzierte Bewegung und Reload. Ergebnis: PASS; Rohresultat unter `docs/evidence/gr-v412-aura/results.json`.

Modellprüfung: 1458 Kombinationen aus Kartenformat, Eye-/Icongröße, Anzahl und Randlage einschließlich Hindernissen; zwölf zukünftige Slots, alte Profile, ungültige Werte, Aura-Sichtbarkeit und alle 19 Sprachkataloge. PASS. Die tatsächliche Python-Vault-Validierung akzeptiert beide Werte und unveränderte Altprofile und weist ungültige Werte zurück. Kein HA-Runtime-Test.

Bestehende Quellschutztests wurden auf die vom Auftrag ausdrücklich benannte öffentliche FINAL-Quellreferenz ausgerichtet. Alte pauschale Snapshots gegen 4.11.177/195 enthielten bereits vor V4.12 nicht mehr die später freigegebenen Consumer-, Niederschlags- und Menüänderungen. Vollständige FINAL-Quellvergleiche schützen diese unabhängigen Module weiterhin. Beim gezielt geänderten Neon-Orchestrierungspfad bleiben Filamentmathematik, Halo-Cache, Lifecycle und V177-Pixelvergleiche geschützt; die neue Ringprojektion wird funktional geprüft. Frühere Betreiberreferenzen werden damit nicht neu erklärt oder gelöscht.

29/29 bestehende Wetter-/Menüverträge, beide Eye-/Neon-Modelltests, deterministischer Build mit negativen Manipulationsproben, 37 registrierte Module und 196 bytegleiche Frontenddateien: PASS. Statische Python-/JSON-/YAML-Prüfung: PASS. Hi-Res-Retentionsvertrag und eingefrorener Diagnosevertrag: PASS. Der Diagnoseprüfer meldet derzeit für den modularen Einstieg keine aktuelle monolithische Quellprüfung; daraus wird keine zusätzliche Laufzeitfreigabe abgeleitet.

Bestehende Browserprüfungen: Eye-Randmatrix mit Drag, Reload, Rotation, acht Slots, Safe-Areas, Recovery und Canvas-Culling-Pixelgleichheit PASS; verzögerte Pointer-/Touch-Recovery in fünf Zyklen bei 0/1/2/3/5/10 Sekunden PASS. Authentifizierte Vault-Matrix mit Profilanlage, HA-/WS-Wechseln, Retry, Migration, dynamischer Aura-Persistenz, Geräte-/Kontentrennung und lokaler Wiederherstellung PASS. Neon/WOW-Vergleich auf Desktop, HiDPI, Touch-Hochformat, Touch-Querformat und iPad PASS: **180 pixelgleiche V177-Nullstellungsvergleiche**, Kontakte, Farbtransfer ohne Funktionsfarbenänderung, statischer Modus, Einstellungen, Persistenz und Lifecycle. Keine Android-GPU-/FPS-Verbesserung aus diesen synthetischen Messungen ableiten.

HACS-Staging: 236 bytegleiche Integrationsdateien PASS. DRA-Vertrag einschließlich Vollbaum, Einzelmodul-Delta, fehlender/veralteter Module, Cache-Vertrag und Rückfall auf den exakten V4.11.03-FINAL-Modulbaum: PASS, 99 modulare Dateien. Die historische Fixture lädt unveränderliche Git-Bäume gebündelt über `git archive`, damit Windows-Prozessstartkosten pro Asset die Navigation nicht abbrechen. Moderne Discovery-Fixtures bilden zusätzlich den bereits in FINAL geltenden PRO-Readiness-Vertrag ab; keine Produktfreigabe durch Abschwächung des Readiness-Vertrags.

Offen bleiben physisches Android einschließlich OS-Drei-Finger-Screenshot, HA-DEV-Installation/Neustart und Betreiber-Sichtabnahme. PROD VM101 bleibt unverändert. Kein FINAL-Release.
