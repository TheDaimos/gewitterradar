# Gewitterradar V4.11 – Chat-Übergabe: WeatherRouter Layer Hub

Stand: 03.10.2026

## 1. Technischer Ausgangspunkt

Repository: `TheDaimos/gewitterradar`

Entwicklungszweig: `feature/v4.11-development`

DRA-Zweig: `deploy/dev`

Letzter vollständig geprüfter technischer Code-Checkpoint vor dieser Übergabedokumentation:

```
0982674a7108718153d18c0de82dc571620ea729
```

An diesem Checkpoint sind `feature/v4.11-development` und `deploy/dev` identisch.

CI am Checkpoint:
- Validate shared Gewitterradar frontend: SUCCESS, Run 37122404161
- Validate Gewitterradar integration: SUCCESS, Run 37122404142
- Hi-Res asset retention: SUCCESS, Run 37122360728

Anwendungsstand:
- Gewitterradar: V4.11.08 DEV
- Runtime-Basis: 41108r1
- Modulsatz: E411-08A5
- native Integration: 0.23.9

## 2. Project Hub – bereits abgeschlossen, nicht erneut bearbeiten

Der zentrale Daimos Project Hub V0.2 RC8 ist bereits integriert.

Zentrale Quelle:
- Repository: `TheDaimos/daimos-project-hub`
- Branch: `feature/first-gewitterradar-preview`
- freigegebener RC8-HEAD: `aefaa668fb4b7398add69b6400bbf7f74c31955c`

Gewitterradar-seitig:
- `ui.project-hub`: 1.1.6
- Project-Hub-Runtime: 0.2.0-rc8
- gezielter Cache-Buster: `41108r8`

Bereits funktionierende Einstiegspunkte:
1. Signatur in den Einstellungen
2. oberer Haupttitel `Gewitterradar` in der Hauptansicht

Der Haupttitel wird über
`.topbar .brand .title > span:first-child`
angebunden. Beide Einstiegspunkte öffnen dasselbe interne Host-Popup.

Bestehende Host-Eigenschaften bleiben unangetastet:
- Project Hub vor Einstellungen und Diagnose
- bestehende z-index-Lösung
- adaptive Popup-Höhe
- darunterliegende Einstellungen bleiben beim Schließen geöffnet
- Health-Probe und Online-/Offline-Logik
- kein Remote-HTML / Remote-JavaScript im Gewitterradar-Kontext

Project-Hub-Gestaltung gehört ausschließlich in das zentrale Project-Hub-Repository.

## 3. Neue Idee – WeatherRouter direkt im Karten-/Layer-Menü

### Nutzeridee

Wenn WeatherRouter als Home-Assistant-Integration erkannt wird, soll das bestehende Kartenansichts-/Layer-Menü erweitert werden.

Das bestehende Menü enthält heute:
- Standard
- Groß
- Vollbild

Darunter soll – nur bei erkanntem WeatherRouter – ein neuer Eintrag erscheinen:

```
Kartenansicht

Standard
Groß
Vollbild

────────────
WeatherRouter  ›
```

Beim Klick auf `WeatherRouter` wird kein zweites frei schwebendes Menü geöffnet. Stattdessen soll der Inhalt des bestehenden Menüs an derselben Stelle weich in eine WeatherRouter-Ansicht wechseln bzw. das vorherige Menü überblenden.

Visuelles Ziel:
- dunkler halbtransparenter Untergrund
- rötlicher Glow
- leichte Tendenz ins Violett/Lila
- weiterhin Gewitterradar-typisch und hochwertig
- keine aggressive Neonoptik
- auf Android und iPad gut bedienbar

## 4. Kombiniertes Zielbild: Kategorien + direkter Schnellzugriff

Die beiden diskutierten Varianten sollen sinnvoll kombiniert werden.

### Ebene 1 – WeatherRouter-Hauptansicht

Oben:
- Zurück zur Kartenansicht
- WeatherRouter-Name/Status
- kleiner Statusindikator

Danach optionaler **Schnellzugriff** auf häufige, tatsächlich verfügbare Kartenebenen, z. B.:
- Niederschlag
- Wolken
- Wind
- UV

Diese Einträge dürfen niemals statisch behaupten, verfügbar zu sein. Angezeigt werden nur passende Capabilities aus dem aktuellen WeatherRouter-Katalog.

Darunter Fachkategorien, z. B.:
- Wetter
- Weltraum
- Umwelt & Pollen
- Naturgefahren

Die endgültigen Kategorien sollen aus dem fachlichen WeatherRouter-Katalog abgeleitet werden. Keine künstliche starre Providerliste in Gewitterradar.

### Ebene 2 – Fachkategorie

Beispiel `Wetter`:

```
‹ WeatherRouter
Wetter

Niederschlag
Wolken
Wind
UV
Temperatur
...
```

Nur Capabilities anzeigen, die für die Gewitterradar-Karte bzw. eine Kartenüberlagerung sinnvoll renderbar sind.

### Warum Hybrid statt nur Kategorien oder nur Direktliste?

- wenige häufig genutzte Ebenen bleiben mit einem zusätzlichen Klick erreichbar
- das System skaliert trotzdem auf viele WeatherRouter-Capabilities
- 100+ Capabilities müssen nicht in ein einziges langes Menü gepresst werden
- WeatherRouter bleibt fachlich strukturiert
- neue Provider/Capabilities können später ohne Umbau der Hauptnavigation auftauchen

## 5. Verbindliche Erkennungslogik

Keine zweite WeatherRouter-Erkennung bauen.

Bereits vorhanden:
`frontend/modules/weather/consumer-client.js`

Der bestehende Consumer V1 Client führt Discovery über

```
weather_router/consumer/discovery
```

aus und liefert u. a.:
- `present`
- `compatible`
- `ready`
- `router`
- `domains`

WeatherRouter-Menüeintrag:
- **nicht anzeigen**, wenn Integration nicht vorhanden / nicht kompatibel
- **anzeigen**, wenn WeatherRouter vorhanden und kompatibel erkannt wird
- wenn vorhanden, aber gerade nicht `ready`: Eintrag sichtbar lassen, aber mit entsprechendem Status (z. B. amber/deaktiviert), statt ihn plötzlich verschwinden zu lassen
- bei `ready`: normal aktiv

Damit reagiert das UI auf den bestehenden Consumer-Vertrag und nicht auf selbst erfundene Entity-Namen.

## 6. Capability-Katalog statt Provider-Menü

Gewitterradar soll nicht selbst Provider auswählen.

Bestehend im Consumer Client:
`weather_router/consumer/capabilities`

WeatherRouter übernimmt weiterhin Auto-Routing und Providerauswahl.

Das Layer-Menü arbeitet mit **Capabilities**, nicht mit Providern.

Provider-/Profilwahl bleibt – soweit erforderlich – Experten-/Diagnosefunktion und gehört nicht in den normalen Layer-Schalter.

## 7. Nur kartentaugliche Ressourcen

Der Layer Hub soll nicht blind jede WeatherRouter-Capability anzeigen.

Geeignete Resource-Typen für Kartenebenen können insbesondere sein:
- `raster_tile`
- georeferenzierte `image_sequence`
- künftig geeignete `event_feed` / `hazard_feed`-Darstellungen als Marker/Vektoren

`value`-Capabilities ohne sinnvolle Kartendarstellung gehören nicht automatisch in das Layer-Menü.

Die endgültige Renderbarkeit wird aus Capability-Metadaten und vorhandenen Renderern abgeleitet.

## 8. Bestehenden Niederschlags-Layer wiederverwenden

Bereits vorhanden:
- `frontend/modules/weather/consumer-client.js`
- `frontend/modules/weather/precipitation-layer.js`

Der bereits funktionierende Niederschlags-Layer darf nicht parallel neu implementiert werden.

Er soll der erste bestehende Renderer hinter dem neuen WeatherRouter Layer Hub sein.

Wenn für weitere Capabilities eine generische Renderer-Schnittstelle benötigt wird, diese klein und modular aufbauen. Kein großer Umbau des bestehenden Niederschlagsmoduls ohne Notwendigkeit.

## 9. Empfohlene Modulgrenze

Das bestehende Kartenansichtsmenü gehört zu:

`frontend/modules/fullscreen/map-display.js`

Dort existieren bereits:
- `map-display-control`
- `map-display-switcher`
- `data-map-display-mode`
- Standard / Groß / Vollbild
- Menü-Auf-/Zuklappen und Outside-Click-Handling

WeatherRouter-Fachlogik soll **nicht** in `fullscreen.map-display` hineingebaut werden.

Bevorzugte Architektur:

```
fullscreen.map-display
        │
        │ kleiner Extension-/Adapter-Hook
        ▼
weather.layer-menu   (neues Modul, Name vor Implementierung im Repo prüfen)
        │
        ├─ nutzt weather.consumer-client
        ├─ Discovery
        ├─ Capability-Katalog
        ├─ Menü-Zustände / Navigation
        └─ Renderer-Ankopplung
              └─ precipitation-layer (bereits vorhanden)
```

`fullscreen.map-display` bleibt Eigentümer des sichtbaren Kartenansichtsmenüs.
Das neue WeatherRouter-Modul erhält nur den minimal nötigen Hook/Container.

Keine neue konkurrierende Kartenmenü-Infrastruktur erzeugen.

## 10. Menü-Zustände

Empfohlenes Zustandsmodell innerhalb desselben Menücontainers:

```
VIEW
 ├─ map-display
 ├─ weather-router
 └─ weather-router-category:<id>
```

Wechsel:
- `map-display → weather-router`: WeatherRouter-Eintrag
- `weather-router → map-display`: Zurück
- `weather-router → category`: Kategorie
- `category → weather-router`: Zurück

Außenklick / Escape:
- schließt weiterhin das gesamte Menü
- bestehende Logik von `map-display` wiederverwenden

Kartenmodus Standard/Groß/Vollbild und WeatherRouter-Layer sind unterschiedliche Zustände:
- Kartenmodus = Darstellung/Größe
- WeatherRouter = Karteninhalt/Ebenen

Ein WeatherRouter-Layer darf daher nicht versehentlich den Kartenmodus ändern.

## 11. Layer-Auswahl und Status

Layerzeilen sind keine `radio`-Buttons für Kartenmodi.

Sie benötigen einen eigenen Zustand, perspektivisch mehrschichtig.

Erste Umsetzung:
- bestehender Niederschlags-Layer vollständig unterstützen
- Architektur bereits für weitere Layer offen halten
- keine künstliche Begrenzung auf genau einen WeatherRouter-Layer in das Datenmodell einbauen

Status je Capability kann kompakt dargestellt werden:
- verfügbar / bereit
- wird geladen
- für aktuellen Ausschnitt nicht verfügbar
- WeatherRouter nicht bereit
- Quelle vorübergehend nicht verfügbar

Bei `outside_coverage` nicht das gesamte WeatherRouter-Menü entfernen.

## 12. Visuelle Richtung

WeatherRouter-Unteransicht soll sich klar vom normalen Kartenansichtsmenü unterscheiden, aber Teil derselben Bedienfamilie bleiben.

Vorschlag:
- Grundfläche: dunkles transparentes Graphit
- Akzent: warmes Rot / Magenta
- sekundärer Glow: leicht violett
- aktive Ebene: subtiler rötlich-violetter Innen- und Außen-Glow
- Status grün/amber/rot nur für technischen Zustand, nicht als Hauptfarbschema
- bestehende Gold-/Blau-Identität von Gewitterradar außerhalb des WeatherRouter-Untermenüs nicht verändern

Keine vollflächig grelle rote Fläche.

## 13. Mobile / iPad

Verbindlich:
- gleicher funktionaler Aufbau auf Desktop, Android und iPad
- große Touch-Ziele
- keine Hover-Abhängigkeit
- Untermenü ersetzt/überblendet das vorherige Menü im bestehenden Bereich
- kein breites zusätzliches Seitenpanel, das die Karte unnötig verdeckt
- Menü muss innerhalb Safe Area / sichtbarem Viewport bleiben
- Back-Navigation immer eindeutig erreichbar

## 14. Persistenz

Sinnvoll:
- letzter WeatherRouter-Untermenüzustand muss **nicht** zwingend nach Neustart wieder geöffnet werden
- aktive Layer dürfen dagegen – soweit bestehende Layerlogik dies unterstützt – persistent bleiben
- Kartenansichtsmodus Standard/Groß/Vollbild bleibt von WeatherRouter-Persistenz unabhängig

## 15. Wichtige Abgrenzungen

Nicht in diesem Arbeitspaket:
- Project Hub verändern
- Project-Hub-Runtime verändern
- About-Struktur verändern
- WeatherRouter-Provider manuell im normalen Layer-Menü auswählbar machen
- bestehendes Auto-Routing umgehen
- private/optionale Providerpfade hart in Gewitterradar codieren
- alle WeatherRouter-Capabilities auf einmal rendern
- bestehende Niederschlagslogik duplizieren
- Standard/Groß/Vollbild umbauen, solange ein kleiner Extension-Hook genügt

## 16. Empfohlene Implementierungsreihenfolge

1. aktuellen Repo-Stand vollständig prüfen
2. bestehendes `map-display-control` / `map-display-switcher` exakt analysieren
3. bestehenden Consumer-Discovery-/Capability-Vertrag prüfen
4. minimalen Extension-Hook entwerfen
5. WeatherRouter-Eintrag nur bei erkannter Integration einblenden
6. Untermenü mit Back-Navigation und Status bauen
7. zunächst vorhandenen Niederschlags-Layer anbinden
8. Capability-Kategorien dynamisch aus Katalog/Metadaten ableiten
9. Schnellzugriff für tatsächlich vorhandene häufige Layer ergänzen
10. weitere Renderer erst danach schrittweise ergänzen
11. Dashboard/native synchronisieren
12. gezielte Desktop/iPad/Android-Tests
13. DRA-Testkandidat
14. erst nach visueller/technischer Abnahme größere CI-Konsolidierung

## 17. Abnahmefälle für die erste Stufe

### WeatherRouter fehlt
- Menü bleibt exakt wie bisher
- Standard/Groß/Vollbild funktionieren unverändert
- keine leere WeatherRouter-Zeile

### WeatherRouter vorhanden, nicht bereit
- WeatherRouter-Eintrag sichtbar
- technischer Zustand erkennbar
- kein Fehler in Gewitterradar

### WeatherRouter bereit
- WeatherRouter-Eintrag aktiv
- Klick ersetzt das Kartenansichtsmenü durch WeatherRouter-Unteransicht
- Zurück stellt Standard/Groß/Vollbild wieder her
- Niederschlag lässt sich über vorhandenen Renderer schalten
- Kartenmodus bleibt dabei unverändert

### Responsive
- Desktop
- iPad
- Android
- keine Überlagerung wichtiger Kartenbedienung
- Outside-Click/Escape/Touch funktionieren

## 18. Kerngedanke

Der neue Layer Hub soll WeatherRouter erstmals wie einen **nativen Datenbus der Karte** wirken lassen:

```
Gewitterradar-Karte
   │
   ├─ Kartenansicht
   │    ├─ Standard
   │    ├─ Groß
   │    └─ Vollbild
   │
   └─ WeatherRouter
        ├─ Schnellzugriff
        │    ├─ Niederschlag
        │    ├─ Wolken
        │    ├─ Wind
        │    └─ UV
        │
        └─ Fachbereiche
             ├─ Wetter
             ├─ Weltraum
             ├─ Umwelt & Pollen
             └─ Naturgefahren
```

Welche Einträge tatsächlich erscheinen, bestimmt der aktuelle WeatherRouter-Capability-Katalog – nicht eine starre Gewitterradar-Liste.

---

Diese Funktion ist zum Zeitpunkt dieser Übergabe **noch nicht implementiert**.
