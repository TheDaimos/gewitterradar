# V4.11 – Android Karten-Gesten-Selbstheilung

Stand: **2026-10-05**  
Status: **DEV-Kandidat – HA/Android-Realtest ausstehend**

## Fehlerbild

In der Home-Assistant-Companion-App unter Android kann die Leaflet-Karte nach intensiver Touch-Nutzung in einen fehlerhaften Gestenzustand geraten: Ein-Finger-Wischen verschiebt die Karte nicht mehr, sondern wird als Zoom interpretiert. Der Fehler betrifft Standard, Groß und Vollbild, während die Leaflet-Zoomschaltflächen funktionsfähig bleiben. Ein vollständiges Schließen und erneutes Öffnen der Companion-App beseitigt den Zustand.

## Technische Arbeitshypothese

Leaflet 1.9.x verwaltet Pinch-Zoom und Pointer-Verfolgung zustandsbehaftet. Geht in Android/WebView ein Pointer-/Touch-Ende oder ein Abbruch beim Fokus-/Lebenszykluswechsel verloren, kann ein alter Kontakt bzw. Pinch-Zustand erhalten bleiben. Eine spätere reale Einfinger-Geste kann dann intern wie eine Mehrfinger-Geste aussehen.

## Umsetzung

Der Kartenpfad besitzt jetzt einen eng begrenzten Gesten-Wächter:

- verfolgt Touch-/Pen-Pointer auf der Karte;
- sendet für beendete Pointer defensiv ein zusätzliches `pointercancel`, damit ein von Leaflet verpasster Abschluss trotzdem bereinigt wird;
- erkennt eine neue primäre Einfinger-Geste trotz alter eigener Pointer und verwirft den verwaisten Zustand;
- beendet einen Leaflet-Pinch-Zustand, wenn nur noch eine primäre reale Geste vorhanden ist;
- bereinigt bei `pointercancel`, `touchcancel`, `blur`, `pagehide` und `visibilitychange`;
- bereinigt vor Standard/Groß/Vollbild-Wechseln, bevor die Karten-DOM-Struktur verschoben wird;
- beendet bei Bedarf einen hängen gebliebenen Leaflet-Drag;
- bindet globale Listener beim Verbinden der Karte und entfernt sie beim Trennen wieder.

Normale Zwei-Finger-Gesten werden nicht ersetzt und bleiben Leaflet überlassen.

## Modulstand des Kandidaten

- `location.radii-map` **1.0.4**
- `fullscreen.map-display` **1.0.32**
- `core.card-lifecycle` **1.0.4**
- `core.manifest` **1.2.71**

Produktstand bleibt **V4.11.08 DEV**. Die geänderten Module erhalten eigene Cache-Buster.

## Android-Realtest

1. Einfinger-Pan in Standard.
2. Mehrfach Pinch-Zoom und Einfinger-Pan wechseln.
3. Dasselbe in Groß.
4. Dasselbe in Vollbild.
5. Schnell zwischen Standard/Groß/Vollbild wechseln.
6. Companion-App während/nach Kartenbedienung in den Hintergrund und wieder nach vorn holen.
7. Gewitterradar über die native Seitenleiste verlassen und wieder öffnen.
8. Längere normale Nutzung mit wiederholten Pinch-/Pan-Wechseln.

Abnahmebedingung: Einfinger-Pan bleibt bzw. wird nach einem abgebrochenen Gestenzyklus selbständig wieder funktionsfähig; ein Neustart der Companion-App darf nicht mehr erforderlich sein.
