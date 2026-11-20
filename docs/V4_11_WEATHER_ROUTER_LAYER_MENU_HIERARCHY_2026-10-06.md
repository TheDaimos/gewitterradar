# V4.11 – Hierarchisches WeatherRouter-Layer-Menü

Stand: **2026-10-06**  
Status: **DEV-Kandidat – Realabnahme ausstehend**

## Ziel

Das WeatherRouter-Menü im Gewitterradar wird für große Capability-Kataloge skalierbar. Die Navigation verwendet die öffentlichen Consumer-V1-Metadaten `domain`, `family` und `phenomena`; es gibt keine Kopplung an interne Providerdateien des WeatherRouter.

## Navigation

Die Struktur lautet:

```text
Layer-Menü
  → WeatherRouter-Hub
    → Fachbereich
      → Unterbereich
        → Kartenfähigkeiten
```

Der WeatherRouter-Hub selbst zeigt keinen Zurück-Chevron. Der linke Platz im Kopf bleibt trotzdem reserviert, damit Titel und WeatherRouter-Logo beim Wechsel der Ebene nicht springen. Ab Fachbereichsebene erscheint der Chevron an exakt derselben Position.

Kleine Fachbereiche wie Pollen, Bevölkerungsschutz, Luftfahrt und Sicherheit bleiben direkt, damit keine unnötige zusätzliche Ebene entsteht.

## Unterbereiche

Gruppierte Fachbereiche:

- Wetter: Gewitter & Blitze, Niederschlag & Radar, Wind, Satellit & Fernerkundung, Wettermodelle, Wolken & Sicht, Temperatur & Atmosphäre, Warnungen, Weitere Wetterdaten.
- Weltraum: Mond, Sonne & Sonnenaktivität, ISS & Erdorbit, Weitere Weltraumdaten.
- Naturgefahren: Hochwasser & Überschwemmungen, Tsunami, Erdbeben & Seismik, Vulkane, Tropische Wirbelstürme, Katastrophenlage, Weitere Naturgefahren.
- Biologische Gefahren: Raubtiere, Große Wildtiere, Krokodilartige, Marine Großtiere, Marine Gifttiere, Giftschlangen, Weitere Schlangen, Weitere Gifttiere, Giftige Pflanzen, Giftpilze, Krankheitsüberträger, Weitere biologische Gefahren.

## Benennung

Provider-orientierte Namen werden für die Anzeige auf menschliche Lesereihenfolge umgestellt.

Beispiel:

```text
vorher:
GBIF · Vorkommensdichte · Frühjahrs-Giftlorchel

Anzeige:
Frühjahrs-Giftlorchel
Vorkommensdichte · GBIF
```

Der vollständige semantische Anzeigename lautet damit:

```text
Frühjahrs-Giftlorchel · Vorkommensdichte · GBIF
```

Die interne Capability-ID und das WeatherRouter-Routing bleiben unverändert.

## Modulstand

- `weather.layer-menu` **1.1.0**
- `core.manifest` **1.2.73**
- Cache-Buster des Layer-Menüs: **41108r13**
- Produktstand bleibt **V4.11.08 DEV**.

## Abnahme

Zu prüfen sind insbesondere:

1. Hub ohne Chevron und ohne Standard/Groß/Vollbild.
2. Fester Kopf ohne seitliches Springen beim Ebenenwechsel.
3. Fachbereich → Unterbereich → Fähigkeiten.
4. Zurück vom Unterbereich zum Fachbereich und vom Fachbereich zum Hub.
5. Schnellzugriffe springen direkt in den passenden Unterbereich und fokussieren die Capability.
6. Biologische GBIF-Namen erscheinen mit Art zuerst und Quelle zuletzt.
7. Große biologische Kataloge werden nicht mehr als eine flache Liste dargestellt.
8. Mobile Android und iPad: Scrollen und Touch-Bedienung des Menüs bleiben stabil.
