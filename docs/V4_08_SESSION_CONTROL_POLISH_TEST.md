# Gewitterradar V4.08.05 – UI-Test Cluster-Sitzung

## Zweck

V4.08.05 verfeinert ausschließlich die bereits in V4.08.04 funktionierende Bedienung der Cluster-Sprung-Sitzung und zwei angrenzende UI-Punkte. Die Clusterlogik, Diagnose-Szenarien und Radien-Semantik bleiben unverändert.

## Änderungen

### Cluster-Sprung · Sitzungszeit

Die bisher getrennt wirkenden Eingabeelemente werden als gemeinsame Premium-Auswahl nach dem Muster der Ortssuche dargestellt:

- gemeinsame abgerundete Metall-/Gold-Einfassung;
- linke Hälfte für den frei definierbaren Sekundenwert 5–3600 s;
- rechte Hälfte für `∞` als Test-Platzhalter;
- das Sekundenfeld ist niedriger und kompakter;
- der jeweils aktive Modus wird analog zur Ortssuche hervorgehoben;
- bei aktivem `∞` wird die Sekundenhälfte optisch zurückgenommen;
- Fokus/Änderung des Sekundenfelds schaltet wieder auf einen endlichen Wert.

Das Unicode-`∞` ist ausdrücklich nur ein Platzhalter. Die spätere Produktdarstellung soll eine freigestellte Hi-Res-/Vektorgrafik ohne eigenen kleinen Button-Rahmen verwenden.

### Kartenanzeige

Während einer aktiven Cluster-Sprung-Sitzung gilt:

```text
Cluster 4/22 · 390s
```

Bei unbegrenzter Sitzung entfällt der Mittelpunkt:

```text
Cluster 4/22 ∞
```

Der spätere Hi-Res-Unendlichkeitsindikator ersetzt dort das Unicode-Zeichen.

### Radien-Akkordeon

Der Kopf des geöffneten Radien-Akkordeons bleibt stehen. Nur der Inhalt erhält bei zu geringer Fensterhöhe einen eigenen vertikalen Scrollbereich. Bei ausreichender Höhe erscheint keine unnötige Scrollbewegung. Die V4.08.05-Regel steht bewusst hinter älteren Querformat-Ausnahmen, die `max-height:none` gesetzt hatten.

### Ortssuche

Die goldene Ziel-/Dartscheibengrafik bei `Lat / Lon` wird ausschließlich in der Darstellung um exakt 25 % vergrößert (`scale(1.25)`). Asset, Positionierung und Funktion bleiben unverändert.

## Nicht Teil dieses Tests

- keine neue Cluster-Policy;
- keine Änderung der Radienwerte;
- keine neue PKG-Version;
- noch keine finale Hi-Res-Unendlichkeitsgrafik;
- keine Änderung der Niederschlags-/Wolkenplatzhalter.
