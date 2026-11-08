# GR – Geschützter Referenzstand: Schlangenförmige Animation

**Entscheidung:** 08.11.2026 · **Status:** vom Nutzer visuell auf Android als außergewöhnlich gelungen bewertet; verbindliche Schutzvorgabe für Folgeentwicklungen.  
**Repository/Branch:** TheDaimos/gewitterradar · deploy/dev.  
**Referenzidentität:** Die am 08.11.2026 per Video und Screenshots gezeigte, funktionierende Darstellung samt Einstellungsmenü. Vor Änderungen die genaue Quellversion/den Commit des tatsächlich installierten Stands feststellen; diese Dokumentation behauptet keinen nicht verifizierten Git-SHA als visuelle Realtest-Baseline.

## Unveränderlich ohne ausdrückliche neue Nutzerfreigabe

1. Eigenständiger Schlangenrenderer einschließlich Partikelgeometrie (kleiner markanter Kopf, langer weitgehend gleichmäßig breiter Körper, spät verjüngender, transparenter Schwanz).
2. Geschwindigkeitsabhängige dynamische Längenänderung **derselben** Partikel, natürliche Kurven/Wirbel entlang autoritativer WR-Windvektoren, Bewegungs- und Glättungslogik.
3. Räumliche Partikelverteilung, Dichteverhalten, Zoomdarstellung, Renderperformance und die vom Nutzer gelobte Gesamtoptik.
4. **Sämtliche bestehenden Einstellmöglichkeiten einschließlich UI-Reglern, Wertebereichen, Standardwerten, Wirkung, Synchronisation, Persistenz und bestehender Bedienung.** Keine Vereinfachung, keine Entfernung und keine Änderung der Zuordnung; zusätzlich vorhandene Modi bleiben unangetastet.
5. WeatherRouter-Verträge, Providerwahl und Gültigkeit bleiben autoritativ beim WR.

### Dokumentierter Einstellungs-Schnappschuss (Android-Screenshot, 08.11.2026)

Die unten sichtbaren Werte sind **Referenzbeobachtungen**, keine vorgeschriebenen Defaults für alle Nutzer:

| Einstellung | Sichtbarer Wert |
| --- | --- |
| Mindestlänge | 10 px |
| Maximallänge | 76 px |
| Längenskalierung | 1 |
| Kopfgröße | 1.5 |
| Körperbreite | 2.1 px |
| Schwanzverjüngung | 1.3 |
| Schwanzbeginn | 67 % |
| Deckkraft | 85 % |
| Partikeldichte | 1.95 |
| Animationsgeschwindigkeit | 1 |
| Längenanpassung | 0.65 s |

Der Screenshot zeigt außerdem unter „Animation“ synchronisierte Schnellregler für maximale Partikellänge, Geschwindigkeit und Dichte sowie eine Pause-Funktion. **Diese existierenden Einstellungen und ihre Verknüpfung müssen erhalten bleiben.**

## Ergänzungen ausschließlich additiv

Das in Arbeit befindliche **Winddesign- & Animationsstudio** darf neue Funktionen für Vorschau, Profile, JSON-/CSV-Import und -Export hinzufügen, **ohne** eine zweite Rendering-Engine, abweichende Parametermodelle oder neue Defaults einzuführen, die den aktuellen Zustand verändern.

- Bestehende elf Detailregler und allgemeine Schnellregler weiterverwenden, nicht ersetzen oder verdoppeln.
- Studio-Entwürfe von produktiver Karte trennen; Änderungen erst nach bewusster Übernahme aktivieren.
- Beim ersten Öffnen, bei Migration, Import und Profilwechsel unverändert bestehende aktive Werte bewahren.
- Bestehende Benutzerkonfiguration nicht überschreiben.
- Bei geschlossenem Studio keine zusätzliche laufende Renderlast.
- Verifikation durch Vorher-/Nachher-Vergleich mit derselben Konfiguration und demselben Windfeld; **keine Änderung der visuellen Baseline** durch Einführung des Studios.
- Falls Integration eine Änderung am bestehenden Renderer oder an vorhandenen Settings erfordern würde: **nicht eigenmächtig durchführen**; isolierte Alternative umsetzen oder die Einschränkung melden.
- Jede tatsächliche Codeänderung benötigt eine neue, noch unbenutzte DEV-Version; Dokumentationscommit allein ist keine neue installierbare Codeversion.

## Zurückgestellte Idee – NICHT beauftragt

Optionaler Regler für den **Abstand zwischen Schlangen / räumliche Verteilung**. Dieser ist aktuell **nicht zur Implementierung freigegeben**. Eine spätere Erweiterung muss den derzeitigen Standardzustand exakt erhalten und explizit abgeschaltet werden können.

## Abnahme

Die aktuelle Animation wurde vom Nutzer visuell positiv beurteilt. Das ist **keine allgemeine technische Realabnahme künftiger Releases**. Jede künftige UI-Erweiterung muss den Schutz der bestehenden Darstellung und Einstellungen gezielt nachweisen.

**Leitsatz:** „Die Animation inklusive sämtlicher derzeitiger Einstellungsmöglichkeiten ist geschützter Referenzstand. Ab jetzt ausschließlich optionale Erweiterungen, keine stillschweigenden Änderungen.“ 
