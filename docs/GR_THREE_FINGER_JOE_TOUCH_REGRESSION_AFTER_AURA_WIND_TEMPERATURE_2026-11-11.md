# CODEX-ENTWICKLUNGSAUFTRAG – „3-Finger-Joe“: Android-/HyperOS-Screenshot-Gestenregression

**Datum:** 11.11.2026  
**Projekt:** GewitterRadar Pro – powered by WeatherRouter  
**Repository / einzig zulässiger Entwicklungsbranch:** `TheDaimos/gewitterradar@deploy/dev`  
**Ausgangsstand:** GR **4.11.185 DEV** (installiert auf Android laut Betreiber-Screenshot)  
**Geschützte visuelle Referenz:** GR V4.11.181 DEV  
**Priorität:** P1 – störender reproduzierter Touch-/Leaflet-Interaktionsfehler  
**Status:** Analyse- und Implementierungsauftrag; keine Fix-Freigabe oder bestandener Realtest behauptet

## 1. Betreiberbefund – nicht umdeuten

Der Betreiber meldet den bekannten „3-Finger-Joe“ erneut auf seinem Android-/HyperOS-Gerät in der HA Companion App: Die **Android-Drei-Finger-Wischgeste zur Screenshot-Erstellung** unterbricht die Karten-Touchbedienung. Danach kann sich die Karte wie beim früheren Fehler beim normalen Verschieben oder Zwei-Finger-Zoomen fehlerhaft verhalten; es bleibt offenbar ein nicht korrekt beendeter Gestenzustand zurück. Der Nutzer bestätigt ausdrücklich: **„Es verhält sich genauso wie letztes Mal“**, ausgelöst **durch Android-Screenshot mit drei Fingern wischen**.

**Wichtige zeitliche Korrektur:** Der Fehler trat *bereits während der Eye-/Aura- oder Wind-/Temperaturdarstellungsentwicklung* wieder auf, zunächst seltener/schwächer, heute regelmäßiger/stärker. Er ist daher **nicht erst seit V4.11.185** aufgetreten und nicht ohne Beleg dem Settings Vault zuzuschreiben.

## 2. Ziel

Die Screenshot-Geste (auch wiederholt) darf Leaflet und GR nicht in einem hängenden Drag-/Pinch-/Pointer-Zustand zurücklassen. Normale Kartengesten müssen unmittelbar danach wieder funktionieren. Die übrigen Gesten (Eye-Bubble, Long-Press, Wind-/Temperatur-Schalter, Premium-Fenster-Drag, Leaflet, Android/iPad/Desktop) bleiben vollständig erhalten.

**Keine globalen Touch-Handler deaktivieren, keine System-Screenshot-Geste blockieren, kein pauschales `preventDefault` über der Karte, keine kosmetische Timer-Verzögerung als alleinigen Fix.**

## 3. Historische Quellcodeanalyse – zielgerichtet, nicht endlos

1. Finde die ursprüngliche nachweislich funktionierende Korrektur für „3-Finger-Joe“ im GR-History-/Rollback-Stand (historisch vom Betreiber mit **V4.11.39** assoziiert; tatsächliche Release-/Commit-Zuordnung verifizieren, nicht voraussetzen). Falls verfügbar, zusätzlich Dokumentation im `TheDaimos/home-assistant-dev-toolkit` auswerten.
2. Rekonstruiere, welche Event-Ketten der Fix damals abgesichert hat (`touchstart`, `touchmove`, `touchend`, `touchcancel`, `pointerdown/up/cancel`, `lostpointercapture`, `window blur`, `visibilitychange`, Kartencontainer-/Leaflet-Lifecycle).
3. Vergleiche diese Implementierung mit dem aktuellen `deploy/dev` und den Entwicklungsständen insbesondere der **Eye-/Aura-**, **Wind-** und **Temperaturmodule**. Identifiziere den ersten belastbar verdächtigen Unterschied beziehungsweise dokumentiere, wenn der genaue Ursprungscommit nicht feststellbar ist.
4. Bestehende Hooks `_recoverMapGestureState` und `_resumeMapGestureRecovery` / `_teardownMapGestureRecovery` ausdrücklich analysieren. Im aktuellen Code sind Recovery-Aufrufe beim Wechsel des Kartenmodus (`frontend/modules/fullscreen/map-display.js`) und im Karten-/Lifecycle (`frontend/modules/core/card-lifecycle.js`) erkennbar. **Das Vorhandensein eines Hooks beweist jedoch nicht, dass Androids abgebrochene Screenshot-Geste sicher verarbeitet wird.**
5. Eventweiterleitung / Capturing / Propagation bei neuen Overlays und Canvases prüfen: Eye-/Aura-Bubble, Drag-Layer, Wind-Snake-Canvas, Temperatur-Canvas, Legenden, Premium-Schalter. Insbesondere prüfen, ob nach Auflegen/Abheben des dritten Fingers ein `touchcancel` oder `pointercancel` eine unterbrochene Sequenz nicht mehr korrekt bis zum Karten- oder Leaflet-Gesture-Manager durchlaufen lässt.
6. Leaflet-interne Drag-/Pinch-States und aktive Touch-Identifier nur **gezielt und sicher** zurücksetzen. Keine fragilen undokumentierten internen Manipulationen ohne Nachweis; falls erforderlich Kompatibilitäts- und Cleanup-Tests dazu.

## 4. Korrekturvertrag

- Eine unterbrochene Mehrfinger-Geste wird genau einmal als abgebrochen abgeschlossen; aktive Pointer/Touch-IDs, Capture und visuelle Drag-Zustände werden konsistent bereinigt.
- Relevante Abbruchereignisse dürfen nicht durch neue Overlay-Listener so gefiltert werden, dass die Karte in einem aktiven Zustand hängen bleibt.
- Nach Abbruch: Pan, Zwei-Finger-Zoom, Tap, Long-Press, Eye-Gruppierung, Eye-Drag sowie Wind-/Temperatur-Controls vollständig benutzbar.
- Wiederholte Screenshot-Gesten ohne dazwischenliegende App-Neustarts müssen funktionieren.
- Bei unmounted/re-mounted Karten, Wechsel standard/groß/Vollbild und Seitenwechsel keine duplizierten Global-Listener; `resume`/`teardown` symmetrisch und idempotent.
- Im Zweifel die **ursprünglich bewährte Recovery-Logik** erhalten bzw. angepasst reintegrieren; kein großflächiger Kartenumbau.
- Einstellungen der Geräteprofile und des Settings Vault, inklusive cachefester Wiederzuordnung, bleiben unverändert. Die durch Betreiber sichtgeprüfte V4.11.185-Profilauswahl bleibt geschützt.

## 5. Regressions- und Realtestmatrix

Automatisiere mit kontrollierter Pointer-/Touch-Sequenz zumindest:
- Einfinger-Pan, Zweifinger-Pinch, Drei-Finger-Beginn → OS-ähnlicher `touchcancel`/`pointercancel` → normale neue Zwei-/Einfinger-Geste.
- Variationen: dritter Finger landet später, teilweiser `touchend` ohne Abschluss, Abbruch ohne finales `pointerup`, `lostpointercapture`, `window.blur`, `visibilitychange`, schnelle Folge mehrerer Screenshot-Versuche.
- Unterbrechung auf Karte nahe Eye-Bubble, Wind-/Temperatur-Canvas und Premium-Controls; auch minimierte Panels.
- Remount-/Vollbild-Wechsel und wiederholte Geste ohne zusätzliche Listener.
- Keine Regression der geschützten V177/V180/V181 Eye-Frames, Snake-Windrendering, Temperatur-/Niederschlagsdarstellung.
- Versions-/Modul-/Lieferparität und bestehende Settings-Vault-Migrations-/Profil-Wiederzuordnungs-Tests.

**Physischer Android-Test bleibt Betreiberabnahme**: Screenshot mit drei Fingern erstellen, danach unmittelbar Karte ziehen, pinchen, Eye- und Wind-/Temperatur-Controls bedienen; mehrfach wiederholen. Nicht als bestanden ausgeben, solange nur Playwright/Emulation vorliegt.

## 6. Umsetzung und Veröffentlichung

**Selbstständig** bis zu einem installierbaren DEV-Release implementieren. Neue unbenutzte GR-/HA-Versionskennungen auf `deploy/dev` vergeben (keine alten Versionen wiederverwenden), kanonisches Frontend bauen, HA- und Dashboard-Pakete inklusive SHA-256 prüfen, öffentliche CI ausschließlich im öffentlichen Repo ausführen. **PROD VM101 nicht ändern**, DEV VM109 nur mit ausdrücklicher und möglicher Umgebungskontrolle. WeatherRouter/DWD/OPERA/Provider-Freshness nicht verändern.

Veröffentliche eine knappe technische Root-Cause-Dokumentation mit Vorher/Nachher-Quellvergleich, Testnachweisen, Commit, DRA-Release-Link und offenen Android-Abnahmepunkten. Keine neue geschützte Referenz ohne Betreiberfreigabe.

**Abnahme:** Nach echter Android-Drei-Finger-Screenshot-Geste darf kein „3-Finger-Joe“ und kein hängender Kartentouchzustand mehr auftreten, bei unveränderter Eye-/Wind-/Temperatur-/Vault-Bedienung.
