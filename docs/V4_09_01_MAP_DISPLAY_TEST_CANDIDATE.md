# Gewitterradar – V4.09.01 Kartenansichten Testkandidat

Stand: **2026-09-20**  
Branch: `feature/v4.09-map-display-modes`  
Basis: `main` nach abgeschlossenem V4.08-Release  
Status: **automatisiert grün; reale Geräteabnahme ausstehend**

## Funktionsumfang

V4.09.01 ergänzt den eingefrorenen V4.08-Stand ausschließlich um den neuen Karten-Darstellungsblock:

- direkte Auswahl **Standard · Groß · Vollbild** unterhalb der Karte;
- **Groß** vergrößert die bestehende Karte, ohne eine zweite Karteninstanz zu erzeugen;
- **Vollbild** verschiebt dieselbe Kartenkarte in einen Vollbild-Dialog;
- der aktuell ausgewählte Kompass wird im Vollbild als Overlay weiterverwendet;
- das Kompass-Overlay ist per Pointer Events mit Maus und Touch verschiebbar;
- die normalisierte Kompassposition wird lokal gespeichert und an andere Bildschirmgrößen angepasst;
- Standard/Groß wird lokal als bevorzugte Kartenansicht gespeichert;
- **In eigenem Fenster öffnen** befindet sich separat in den Einstellungen;
- das separate Fenster verwendet `gewitterradar_window=1` und startet direkt in der Vollbild-Kartenansicht;
- wenn das Browserfenster blockiert wird, fällt die Funktion auf den normalen Vollbildmodus zurück.

## Auslieferungsparität

Die gemeinsame Frontend-Quelle bleibt:

`frontend/gewitterradar.js`

Die beiden ausgelieferten Kopien sind byte-identisch:

- `custom_components/gewitterradar/frontend/gewitterradar.js`
- `dashboard/dist/gewitterradar.js`

Damit gilt die Funktion identisch für native Integration und Dashboard-Auslieferung.

## Automatisierte Prüfung

Grüner geprüfter Runtime-/Teststand: `fcfb6ddd114c96587312be35b7af4be92ed8af61`

GitHub Actions:

- Validate shared Gewitterradar frontend – Run `35510583632` – **success**
- Validate Gewitterradar integration – Run `35510583685` – **success**
- Hi-Res asset retention – Run `35510583628` – **success**

Die gemeinsame Frontend-Suite prüft zusätzlich:

- V4.09 Map Display Contract und Lieferparität;
- JavaScript-Syntax;
- 19 Sprachvarianten / About-Locale-Vertrag;
- Recorder-Locale-Audit;
- geschützten Diagnosevertrag;
- V4.09 Browser-Test für Dashboard und Integration;
- Desktop, iPad und Android;
- Standard → Groß → Vollbild;
- Touch-/Pointer-Verschieben des Kompasses;
- gespeicherte Kompassposition;
- Wiederherstellung der normalen Ansicht;
- Einstellungen / separates Fenster;
- Language Onboarding;
- V4.07.56 Settings-/Help-Profile;
- geschützte About-Geometrie gegen die V4.07.56-Baseline mit unveränderter maximaler Toleranz von **0,02 px**;
- Dashboard-/Integration-Browserparität.

## Behobene Kandidatenfehler

Während der Kandidatenprüfung wurden zwei reale bzw. testseitige Probleme gefunden und behoben:

1. **iPad Groß-Modus**  
   Die erste `72dvh`-Definition konnte auf 768-px-Tablets minimal kleiner als die bestehende Standardkarte werden. Der große Modus wurde deshalb auf eine eindeutig größere responsive Höhe angehoben.

2. **Legacy-Tests mit neuem geschlossenem Vollbild-Dialog**  
   Onboarding-/Golden-Tests erwarteten historisch keinerlei `dialog`-Element bzw. ausschließlich V4.08-Metadaten. Die Tests wurden so angepasst, dass ein geschlossenes Vollbild-Dialogelement erlaubt ist und V4.09.01 dieselben geschützten About-Geometrieprüfungen durchlaufen kann. Golden-Geometrie, Pixelvertrag und Toleranzen wurden dabei nicht gelockert.

## Reale Geräteabnahme vor Merge

Vor einer Promotion nach `main` sollten mindestens geprüft werden:

- Desktop: Standard, Groß, Vollbild, Vollbild verlassen;
- iPad: Standard/Groß im Hoch- und Querformat;
- iPad: Kompass im Vollbild per Touch verschieben;
- Android: Standard/Groß/Vollbild und Orientierung wechseln;
- aktuell gewählten Kompass wechseln und danach Vollbild öffnen;
- Kompassposition speichern, Vollbild verlassen und erneut öffnen;
- **In eigenem Fenster öffnen** im normalen Browser;
- Verhalten in der Home-Assistant-App/WebView, insbesondere falls ein separates Fenster dort nicht unterstützt wird;
- Rückfall auf Vollbild bei blockiertem Popup;
- normale Karteninteraktion, Cluster, Radien und Zoom nach jedem Größenwechsel.

## Freigaberegel

Dieser Stand ist **kein öffentlicher Release** und wird ohne ausdrückliche Benutzerfreigabe nicht nach `main` gemergt. V4.08, `v4.08` und `frozen/v4.08` bleiben unverändert.
