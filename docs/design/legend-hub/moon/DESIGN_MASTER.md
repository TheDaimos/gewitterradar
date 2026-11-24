# Verbindlicher visueller Designmaster – Premium-Mondlegende

Stand: 24.11.2026. Geltung: Designvorbereitung für GewitterRadar 4.12+. **Keine Implementierung und keine neue technische Betreiberfreigabe.**

## Rangfolge der Referenzen

1. Das [originale vollständige Fensterbild](references/moon_legend_premium_master.png) ist der verbindliche visuelle Designmaster für Fenster, Rahmen, Glaswirkung, Informationshierarchie, Phasenleiste, aktive Phase und Zoomhinweis.
2. Der [ursprüngliche Silber-Platin-Vollmond](references/moon_full_silver_platinum_master.png) ist die verbindliche visuelle Masterreferenz für die Mondgrafik. Kraterstruktur, Helligkeit, Materialwirkung, Aura und Lichtreflexe bewahren. Das zugehörige [ZIP-Vollmondasset](assets/master/04_vollmond.png) ist nach vollständigem RGBA-Pixelvergleich bildgleich.
3. Die acht gelieferten [Phasenmaster](README.md#phasenzuordnung) definieren die zusammengehörige Mondfamilie. [Phasenbogen](references/moon_phase_family_original.png) und [beschriftete Vorschau](references/moon_phase_family_preview.png) ergänzen die Zuordnung; sie überschreiben die Master nicht.

Die Lieferdokumente unter `sources/zip-metadata/` bleiben unveränderte Quellen. Darin enthaltene Hinweise begründen keine Ausweitung dieses Auftrags auf Programmierung, Berechnungen oder Bereitstellung.

## Sichtbare Gestaltungsvorgaben

| Element | Verbindliche Gestaltung für die spätere Umsetzung |
|---|---|
| Metallrahmen | Silber-Platin-Rahmen mit mehreren fein abgestuften Konturen, inneren und äußeren Lichtkanten sowie punktuellen Reflexen. Die hochwertige Tiefe und Materialwirkung des Masters erhalten. |
| Fensterecken und Glas | Deutlich abgerundete Ecken, abgestufte Innenflächen, subtile Reflexionen und hochwertige Glasoptik. Rahmen und Inhalt bilden ein zusammengehöriges Fenster. |
| Hintergrund | Dunkelblauer, leicht transparenter Hintergrund mit ausreichendem Kontrast für Schrift und Symbole. Die im flachen Referenzbild sichtbare Transparenz ist ein visueller Eindruck; exakte Deckkraft und Filterwerte sind nicht geliefert. |
| Mond | Hochauflösend, leuchtend, silber-platinfarben, mit deutlich sichtbaren Kraterdetails, feiner Oberflächenstruktur und erhaltener Aura. Keine Neugenerierung oder Qualitätsreduktion der Mastergrafik. |
| Kopfbereich | Mondicon, Titel „Mond“, feine Unterzeile und klar abgesetzter Fensterkopf gemäß Master. Die umgebende „Legend Hub“-Darstellung im Gesamtbild dient als Kontext, nicht als Auftrag zum Umbau des bestehenden Hubs. |
| Informationen | Strukturierter Bereich mit einzelnen Datenzeilen für Koordinaten, Mondzyklus, aktuelle Mondphase, Mondaufgang, Monduntergang und nächste Mondphase. Icons, Beschriftungen und Werte bilden klare Spalten; mehrzeilige Werte bleiben lesbar. Der Zyklus ist im Master zusätzlich durch einen feinen Fortschrittsbalken dargestellt. |
| Acht Mondphasen | Vollständiger Zyklus in der dokumentierten Reihenfolge. Jede Phase besitzt ihre passende Grafik und Beschriftung. Die aktive Phase ist durch einen eigenen abgerundeten Glas-/Lichtrahmen hervorgehoben; das Beispiel zeigt Vollmond. |
| Trennlinien und Bedienelemente | Filigrane Trennlinien, präzise Konturen und hochwertige Bedienelemente, einschließlich des Informationssymbols an der Phasenübersicht. Funktionen und konkrete Interaktionen sind später separat zu spezifizieren. |
| Schließen | Rundes Close-Symbol mit feiner Kontur und klar sichtbarem X oben rechts. Die spätere Trefferfläche muss auch bei Touch gut bedienbar sein, ohne die sichtbare Form zu verlieren. |
| Zoomhinweis | Eigenständiges, im gleichen Stil gerahmtes Hinweisfenster: abgerundeter Silber-Platin-Glasrahmen, Mondmotiv mit Lupensymbol, klare Meldung zur ungeeigneten Zoomstufe und Aufforderung zum weiteren Hineinzoomen. Es handelt sich nicht um eine Datenzeile innerhalb der Mondinformationen. |

## Inhaltliche Grenzen

**Alle astronomischen Zahlen, Uhrzeiten, Prozente, Koordinaten und Datumsangaben im Referenzbild sind ausschließlich illustrative Platzhalter.** Sie sind keine fachlichen Sollwerte, Testfixtures oder Quelle für Echtzeitberechnungen. Dies betrifft auch die dargestellten 29,53 Tage und das Datum der nächsten Phase. Im Bild sichtbare Inkonsistenzen dürfen nicht in spätere Berechnungslogik übernommen werden.

Die im ursprünglichen ZIP-Manifest enthaltenen `phase_fraction`- und `illuminated_fraction`-Werte dokumentieren lediglich das gelieferte Bildmaterial. Die spätere Anwendung muss tatsächliche Phase, Auf-/Untergang, Zeitbezug, Standortbezug und nächsten Phasenwechsel unabhängig fachlich bestimmen. Die Aura und Lichtreflexe sind künstlerische Gestaltung, keine astronomische Messung. Die visuelle Hervorhebung muss später dem tatsächlichen Zustand folgen; sie ist nicht dauerhaft auf Vollmond festgelegt.

Die schwarzen bzw. umgebenden Flächen der transparenten Quelldarstellungen sind nicht als neu einzubrennender Hintergrund zu übernehmen. Tatsächliche Alpha-Eigenschaften stehen im [Manifest](manifest.json). Der Fenster-Designmaster selbst ist ein opakes RGB-Gesamtbild und kein freigestellter UI-Baustein.

## Responsive Anforderungen für die spätere Umsetzung

Desktop, Tablet und Smartphone müssen dieselbe Materialqualität, vollständige Informationen, alle acht Phasen und eindeutig erreichbare Bedienelemente erhalten. Dies ist eine Anforderung an die spätere Implementierung; die Lieferung enthält nur den einen vollständigen Fenster-Designmaster, keine gesonderten Tablet-/Smartphone-Mockups oder verbindlichen Breakpoints.

- **Desktop:** Die im Master gezeigte großzügige Anordnung mit Mond links, Informationszeilen rechts und Phasenbereich unten als visuelle Ausgangslage verwenden. Das Zoomhinweisfenster bleibt eigenständig.
- **Tablet:** Die Aufteilung an die verfügbare Breite und Ausrichtung anpassen; Text, Mond und Phasenbeschriftungen müssen ohne Überlagerung lesbar bleiben.
- **Smartphone:** Eine kompakte, gegebenenfalls vertikal angeordnete Darstellung vorsehen. Alle Datenzeilen und Phasen bleiben erreichbar; Close-Symbol und Hinweisfenster dürfen weder abgeschnitten werden noch andere notwendige Bedienelemente verdecken.

Konkrete Maße, Schriftfamilien, Farbwerte, Radien, Schatten, Breakpoints und Regeln zum Umbruch oder Scrollen sind **nicht als Design-Tokens geliefert**. Diese sind im separaten Implementierungsauftrag aus dem visuellen Master abzuleiten und auf Desktop, Tablet sowie Smartphone in Hoch- und Querformat zu prüfen. Keine beliebigen Messwerte als bereits genehmigte Vorgaben ausgeben.

Für die spätere Abnahme sind Kontrast auf hellen und dunklen Kartenhintergründen, Touchbedienbarkeit, Textvergrößerung und reduzierte Bewegung zu berücksichtigen. Dieses Dokument belegt deren Umsetzung noch nicht.

## Geschützte Produktreferenzen

### Ergänzende Materialvorgaben für 4.13

Die erste vom Betreiber gelieferte transparente [Premium-Close-Grafik](assets/master/gr-moon-close-platinum-premium-master.png) ergänzt den ursprünglichen Fenstermaster als verbindliche Referenz für runde Close-Geometrie und feine mineralische Einschlüsse im dunkelblauen Glas. Keine zusätzliche sichtbare CSS-Fassung um dieses Asset. Die Vorlage des vollständigen Fensters und alle bisherigen Mondmaster bleiben unverändert.

Silber-Platin und klassisches Nachtglas bleiben die Standardkombination. Der bereits vorhandene Goldmaterialverlauf ist eine unabhängige Rahmenwahl. Mineralglas ergänzt Nachtglas, ersetzt es nicht; seine feinen unregelmäßigen Strukturen liegen optisch unter den dunklen Glasebenen. Keine Steinplattenoptik oder regelmäßige Kachelung. Aktive Phasen behalten ihre Silber-Platin-Hervorhebung auch bei Goldrahmen. Materialdefinitionen, Textur, Symbol-/Chevronherkunft und Prüfsummen sind im [Manifest](manifest.json) archiviert. Die grafische Betreiberabnahme bleibt offen.

Der Designmaster ergänzt die Ressourcenbasis. Er erteilt keine Freigabe zum Umbau bestehender Legenden oder zur Veränderung von Eye/Aura, Drag, Slot-/Pointer-Identität, unmittelbarer Hindernisauflösung, Randpositionierung, Vault-Persistenz, Wetterprovidern oder Profilen. Das [WR-/GR-Referenzpaar](../../../WR_GR_PROTECTED_REFERENCE_PAIR_010320_411195_2026-11-13.md), die [Aura-Referenz](../../../GR_412_AURA_REFERENCE_2026-11-22.md) und der [Modul-/Provider-Schutz](../../../MODULE_PROVIDER_ISOLATION_GUARD_2026-11-13.md) bleiben eigenständig gültig.
