# Prüfprotokoll – Moon Legend Premium Assets

Prüfdatum: 24.11.2026. Ressourcenauftrag ohne Implementierung, Version, Release oder DRA-Bereitstellung.

## Ausgangslage und Schutzumfang

- GR `TheDaimos/gewitterradar@deploy/dev`: lokaler HEAD und nach `git fetch origin deploy/dev` bestätigter Remote-HEAD `3af4e5848fd42428452261aaf643022a93c0ec7a`.
- WR `TheDaimos/weather-router-dev@deploy/dev`: per `git ls-remote` beobachteter HEAD `728cf9ff8291fdb2e56b95e62ca1d48af7217039`. Partner-Schutzdokument per GitHub API gelesen. Diese HEADs sind keine neue Betreiberfreigabe.
- Vor Änderung gelesen: [Bootstrap](../../../PROJECT_BOOTSTRAP.md), [Modul-/Provider-Schutz](../../../MODULE_PROVIDER_ISOLATION_GUARD_2026-11-13.md), [geschütztes Referenzpaar](../../../WR_GR_PROTECTED_REFERENCE_PAIR_010320_411195_2026-11-13.md), [Aura-Referenz](../../../GR_412_AURA_REFERENCE_2026-11-22.md) und Projekt-AGENTS.md.
- Vorab abgegrenzte Auswirkungen: ausschließlich neue Ressourcen und Dokumentation im neuen Moon-Referenzbereich. Keine bestehende Datei wird verändert. Laufzeit, Module, Provider, Konfiguration, Profile und gemeinsame Build-/Release-/Update-Pfade bleiben außerhalb des Diffs.
- Vorhandene unversionierte Arbeitsdateien im Workspace gehören nicht zu diesem Auftrag und werden nicht mit eingecheckt.

## Durchgeführte Ressourcenprüfungen

| Prüfung | Ergebnis |
|---|---|
| ZIP-Inventar und CRC aller Einträge mit Python `zipfile.testzip()` | PASS: 18 Einträge, keine beschädigten Einträge oder doppelten Namen |
| Vollständige Extraktion und Bytevergleich gegen jedes ZIP-Mitglied | PASS: 16 PNG-Dateien, Original-README und Original-Manifest unverändert |
| Bytevergleich des archivierten ZIP gegen die gelieferte Datei | PASS |
| Bytevergleich der vier Bildreferenzen gegen die angegebenen Eingabedateien | PASS |
| Vollständiges Dekodieren der 20 PNG-Dateien mit Pillow | PASS: 16 Phasendateien und vier Referenzbilder |
| Phasenabdeckung und Zuordnung | PASS: acht eindeutige Phasen, acht Master und acht gelieferte 512er-Varianten; keine Phase fehlt |
| Maße und Formate | PASS: Master 1254 × 1254 RGBA-PNG, Varianten 512 × 512 RGBA-PNG; Referenzmaße und Farbmodi im Manifest |
| Tatsächliche Transparenz | PASS: alle 16 Phasendateien sowie Vollmond- und Phasenbogenreferenz besitzen vollständig und teilweise transparente Pixel; Fensterbild und beschriftete Vorschau sind RGB ohne Alpha |
| Alpha-Extrema und Histogramm | PASS: Min/Max sowie transparente, teilweise transparente und opake Pixelzahlen gegen alle Bilddatensätze geprüft |
| SHA-256 und Dateilängen | PASS: alle 23 eindeutigen Original-/Asset-Dateien gegen Manifest geprüft; wiederholte Phasenmetadaten mit dem ZIP-Inventar abgeglichen |
| Original-Vollmond gegen ZIP-Vollmond | PASS: alle dekodierten RGBA-Pixel identisch; PNG-Dateibytes unterscheiden sich, beide Originale separat erhalten |
| Lokale Dokumentationslinks und verwendeter Phasenanker | PASS: Ziele vorhanden; Verzeichnislinks und geschützte Referenzdokumente eingeschlossen |
| Git-Index und Änderungsgrenze | PASS: ausschließlich 28 neue Dateien unter `docs/design/legend-hub/moon/`; alle vorgemerkten Git-Blobs bytegleich zu den lokalen Dateien; keine Änderung bestehender versionierter Dateien |

Eine ausschließlich für `sources/zip-metadata/*` geltende lokale `.gitattributes`-Regel verhindert die automatische Zeilenendenkonvertierung der Original-Quelldokumente beim Windows-Checkout. Bestehende Repositorydateien sind von dieser Regel nicht betroffen.

Die meisten 1254er-Phasen haben einen maximalen Alpha-Wert von 254; beim gelieferten Vollmond in 512 Pixeln liegt dieser bei 253. Dies sind gemessene Eigenschaften der Lieferung, keine Importfehler. Die Alpha-Werte wurden nicht normalisiert.

Der historische Name `leuchtender_vollmond_mit_kratern_und_halo.png` aus dem ZIP-README liegt nicht als eigenständiger Lieferdateiname vor. Die separat gelieferte Vollmondreferenz ist vorhanden und ihr Pixelvergleich mit `04_vollmond.png` wurde erfolgreich ausgeführt. Siehe [Manifest](manifest.json) und [Herkunftszuordnung](README.md).

## Grenzen der Prüfung

Keine Browser-, Android- oder HA-Realtests durchgeführt: Es wurde kein ausführbarer Code, keine Runtime-Einbindung und kein gemeinsamer Produktpfad geändert. Solche Tests würden hier keine neue Funktion prüfen. Die Prüfung belegt Ressourcenintegrität und additive Ablage, keine implementierte responsive Mondlegende oder astronomische Genauigkeit.

Keine neue Produktversion, kein Release-Tag, kein Release, keine DRA-Bereitstellung und keine PROD-Änderung. Es werden keine Release-Triggerdateien oder Workflows geändert und keine Workflows manuell ausgelöst. Ein gewöhnlicher Branch-Push kann die bestehenden CI-Prüfungen ausführen; daraus folgt keine neue Betreiberabnahme.
