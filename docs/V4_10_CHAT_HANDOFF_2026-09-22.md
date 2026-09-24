# Gewitterradar V4.10.02 – Chat-Übergabe Modularisierung

**Fortgeschriebener Stand:** 2026-09-24  
**Projekt:** Gewitterradar  
**Repository:** `TheDaimos/gewitterradar`  
**Arbeitszweig:** `feature/v4.10.02-modularization`  
**Draft-PR:** #24 – `V4.10.02: modular frontend architecture`  
**Empfohlener DRA-Kanal:** `deploy/dev`

> Diese Datei ist die **kompakte Chat-Übergabe**. Sie wiederholt bewusst nicht das vollständige Arbeitsprotokoll.  
> Die verbindliche Detailhistorie, Haken und Schleifen stehen ausschließlich in  
> `docs/V4_10_MODULARISIERUNG_SCHLACHTPLAN.md`.

---

## 1. Startanweisung für einen neuen Chat

Nicht aus Chatgedächtnis fortsetzen. Zuerst den aktuellen Repository-Stand lesen.

Verbindliche Reihenfolge:

1. Repository `TheDaimos/gewitterradar` prüfen.
2. `PROJECT_DEFAULTS.md` lesen.
3. `docs/V4_10_MODULARISIERUNG_SCHLACHTPLAN.md` vollständig lesen.
4. Danach diese Übergabe lesen.
5. Aktuellen Head von `feature/v4.10.02-modularization`, `deploy/dev`, den aktuellen M12-Testzweig und PR #24 neu verifizieren.
6. CI-Status neu lesen; keine hier genannte frühere SHA als automatisch aktuell annehmen.
7. Exakt am Abschnitt **NÄCHSTER SCHRITT** des Schlachtplans fortsetzen.

Wenn der Benutzer sagt:

> „Schau in den Schlachtplan und führe ihn weiter fort.“

ist damit ohne Rückfrage  
`docs/V4_10_MODULARISIERUNG_SCHLACHTPLAN.md` gemeint.

---

## 2. Dokumentationsprinzip – keine Doppelpflege

Die Dokumentation ist bewusst getrennt:

- **Schlachtplan:** einziger Ort für M01–M13, Haken, reale Abnahmen, Testzweige und Schleifen.
- **Diese Übergabe:** nur aktueller Einstiegspunkt, Zusammenfassung und Fortsetzungsanweisung.
- **CHANGELOG / HISTORY:** nur dauerhafte Produktänderungen und Projektgeschichte; temporäre M12-Testträger werden dort nicht noch einmal beschrieben.
- **Testzweige:** enthalten ausschließlich Prüfcode und sind keine Produktfreigaben.

Beim Fortsetzen keine zweite M12-Übergabe, keine parallele Statusdatei und keine Kopie der Schleifen anlegen. Diese Datei bei Bedarf weiter fortschreiben.

---

## 3. Aktueller Produktstand

Der reale V4.10.02-DEV-Produktstand liegt auf:

`deploy/dev` → `08eec9c3f19c2680ede86336931be8f8e0029424`

Der Arbeitszweig `feature/v4.10.02-modularization` liegt darüber, enthält gegenüber `deploy/dev` aber derzeit nur fortgeschriebene Dokumentation. Produktcode für die aktuellen M12-Sonderfälle liegt ausschließlich auf den unten genannten Testzweigen.

Die Anwendung meldet im normalen DEV-Stand:

- Gewitterradar **V4.10.02**
- **22 / 22 Module geladen**
- Versionssatz konsistent

Relevante aktuelle Modulversionen:

- `fullscreen.map-display 1.0.2`
- `ui.controls 1.1.2`
- `diagnostics.module-view 1.3.0`

Die vollständige Modulliste nicht hier doppeln; sie steht im Manifest und wird von „Module & Versionen“ zur Laufzeit geprüft.

---

## 4. Seit der alten Übergabe abgeschlossene dauerhafte Korrekturen

Die folgenden Produktkorrekturen sind bereits im normalen DEV-Stand enthalten und im Schlachtplan bzw. bestehenden CHANGELOG/HISTORY dokumentiert:

- Einstellungen besitzen einen eindeutigen Scroll-Eigentümer; verschachtelte Scrollfehler auf iPad/kleinen Viewports wurden beseitigt.
- fehlende Einstellungsübersetzungen wurden für alle **19 Sprachvarianten** vervollständigt.
- „Module & Versionen“ ist vollständig in das Einstellungs-Akkordeon integriert.
- Medaillon-Diagnose wurde für iPad verbreitert.
- Einstellungs-Chevrons verwenden die gewünschte Animation.
- Tooltip-/Mouse-over-Texte wurden über die 19 Sprachvarianten vollständig nachgezogen.
- Modulzeilen bleiben beim Öffnen/Schließen stabil und werden nicht mehr durch Hintergrund-Synchronisierung sofort neu aufgebaut.
- alle **22 Modulnamen und vollständigen Funktionslisten** sind in allen **19 Sprachvarianten** lokalisiert.
- die fremdsprachige Moduldarstellung wurde real auf HA DEV bestätigt.
- der Standardansicht-Dropdown-Lifecycle wurde korrigiert und real vollständig bestätigt: Hintergrundklick und Akkordeonwechsel hinterlassen keinen verwaisten Dropdown-Layer.

Detaillierte Implementierungs- und Prüfhinweise stehen in den Schleifen 028–040 des Schlachtplans; nicht hier erneut ausführen.

---

## 5. M12 – bisher real abgenommen

Im Schlachtplan sind real bestanden:

- Deployment des kompletten Modulbaums
- Deployment nur eines geänderten Moduls
- Soll-/Ist-Metadaten
- Neustart-/Frontend-Neuladehinweis

### Realer Ein-Modul-Test

Testzweig:

`test/dra-v4.10.02-single-module`

aktueller Test-Commit:

`26b935870e5e871ece26fb724d9ef67a019668e7`

Der Zweig basiert auf `deploy/dev` und verändert gegenüber dem normalen DEV-Stand exakt:

`custom_components/gewitterradar/frontend/modules/fullscreen/map-display.js`

Reale DRA-Vorschau:

**0 neu / 1 geändert / 0 entfernt / 56 unverändert**

Sichtbarer Funktionsbeweis:

- Tippen/Klicken auf das frei bewegliche Medaillon im Vollbild öffnete das provisorische M12-Popup.
- Ziehen blieb Drag und öffnete kein Popup.
- damit wurde die tatsächlich geänderte Einzeldatei im laufenden HA-Frontend nachgewiesen.
- danach wurde über DRA wieder der normale `deploy/dev`-Stand hergestellt.

Der erste Popup-Versuch reagierte noch nicht auf Tap; deshalb wurde derselbe Testzweig innerhalb **derselben einzigen Moduldatei** um einen robusten Klickpfad mit Drag-Unterdrückung ergänzt. Erst dieser Stand wurde real erfolgreich abgenommen.

### Bewusst nicht als Produktfunktion übernehmen

Das Medaillon-Popup ist nur M12-Testträger.

Bekannter Darstellungsfehler:
- das Schließen-Symbol zeigt im Testdialog einen unerwünschten Rahmen/Fokusrahmen.

Das blockiert M12 nicht und soll nicht separat im Produkt-Changelog dupliziert werden. Nach M12 wird die echte Medaillon-Auswahl/-Bearbeitung als neues Thema aufgebaut. Dabei ist ausdrücklich zu prüfen, ob ein eigenes Modul `instruments.medallion` sinnvoll ist.

---

## 6. DRA-Erkenntnisse aus dem Ein-Modul-Test

DRA konnte den Testzweig über **Erweiterte Quellenauswahl** laden.

Wichtige reale Beobachtungen:

- der ausgewählte Branch/Commit muss nach einem neuen Commit erneut über **„Quelle übernehmen“** aktualisiert werden; sonst kann DRA noch den zuvor ausgewählten Commit anzeigen.
- bei einer reinen Frontend-Änderung zeigte DRA korrekt **„Frontend / Companion App neu laden“**.
- die Änderungsstatistik **Neu / Geändert / Entfernt / Unverändert** war korrekt, lag in der damaligen Oberfläche aber teilweise unterhalb des zunächst sichtbaren Bereichs. Diese DRA-Oberflächenverbesserung wird im separaten DRA-Projekt behandelt und ist kein Gewitterradar-M12-Blocker.
- die Warnung „Versionskennung ist gleich, aber verwaltete Dateien unterscheiden sich“ ist für diese Testfälle erwünscht.

Das Gewitterradar-Manifest bleibt unverändert DRA-fähig; der empfohlene Kanal bleibt `deploy/dev`.

---

## 7. Aktueller M12-Test: Cache-/Mischstand + veraltetes Modul

Aktueller Testzweig:

`test/dra-v4.10.02-cache-mixed-state`

Commit:

`274d9304823be7a1ec8620ec6f157493813d0e47`

Basis:

`deploy/dev` `08eec9c3f19c2680ede86336931be8f8e0029424`

Auch dieser Zweig verändert gegenüber DEV exakt **eine Datei**:

`custom_components/gewitterradar/frontend/modules/fullscreen/map-display.js`

Absichtliche Teständerung:

- tatsächlich geladene `MODULE_META.version`: **1.0.1**
- im Manifest erwartete Version: **1.0.2**

Damit wird ein kontrollierter veralteter Modulstand erzeugt, ohne weitere Dateien anzufassen.

Im Schlachtplan ist bereits als realer Teilnachweis hinterlegt:

- **22 / 22 Module geladen**
- **1 Abweichung erkannt**

Der M12-Haken **veraltetes Modul erkennen** ist inzwischen real abgeschlossen:

- **22 / 22 Module geladen**
- **1 Abweichung erkannt**
- Detailzeile `fullscreen.map-display`:
  - geladen **1.0.1**
  - erwartet **1.0.2**
  - Status **abweichend**

Noch offen ist ausschließlich der separate Cache-/Mischstand-Nachweis:

### Browsercache-/Mischstand

Die saubere Ausgangsbasis ist real bestätigt:
- `deploy/dev` wiederhergestellt,
- **22 / 22 Module geladen**,
- **Versionssatz konsistent**,
- `fullscreen.map-display`: **1.0.2 geladen / 1.0.2 erwartet / korrekt**.

Jetzt den Testzweig erneut per DRA installieren, im bereits geöffneten Browser zunächst **nicht** hart neu laden und dokumentieren, dass der laufende Browser weiterhin den zuvor geladenen **1.0.2**-Stand zeigt. Erst nach `Strg+Shift+R` soll **1.0.1 / erwartet 1.0.2 / abweichend** erscheinen.

Danach wieder `deploy/dev` über DRA installieren und **1.0.2 / korrekt** bestätigen.

---

## 8. Danach noch offene M12-Punkte

Nach dem aktuellen Cache-/Mischstand-Test bleiben:

- **fehlendes Modul erkennen**
- **Rollback testen**

Der Rollback muss real über DRA auf `deploy/v4.09` erfolgen. Danach muss wieder sauber auf den aktuellen `deploy/dev`-Stand zurückgekehrt werden. Es darf kein gemischter V4.09/V4.10-Dateibaum zurückbleiben.

Die Repository-Prüfung `scripts/verify-deploy-relay-contract.py` simuliert diese Fälle bereits, ersetzt aber die reale HA-DEV-/DRA-Abnahme nicht.

---

## 9. M13 nach M12

M13 bleibt das letzte Release-Gate. Die dort noch offenen Haken nicht pauschal setzen.

Nach M12 eine **kompakte gezielte Endrunde** durchführen, weil viele Pfade bereits automatisiert und während der Entwicklung real geprüft wurden. Zu prüfen bzw. formal zu verbuchen sind insbesondere Desktop, Android/HA Companion, Kartenansichten, Vollbild, Kompass, Medaillon, Standort-Pille, Layer-Menü, Cluster, Einstellungen, Logging, HACS, DRA, Cache-/Update-Pfade, Tests, Checksummen sowie Abschluss von CHANGELOG/HISTORY.

Der alte M13-Punkt „Provider“ ist für Gewitterradar fachlich nicht anwendbar; NASA/EUMETView gehören zu WeatherRouter. Dies nicht wieder als Releaseblocker behandeln.

Keine V4.10-Veröffentlichung und kein Merge, bevor M12 und M13 vollständig abgeschlossen sind und der Benutzer die Freigabe ausdrücklich möchte.

---

## 10. CI / PR

PR #24 ist weiterhin:

- **offen**
- **Draft**
- **mergeable**
- Head: `feature/v4.10.02-modularization`
- Base: `main`

Vor der Dokumentationskonsolidierung waren auf dem damaligen Head vier der fünf bekannten Workflows bereits erfolgreich:

- Diagnostic contract
- Hi-Res asset retention
- Source archive contract
- Validate Gewitterradar integration

„Validate shared Gewitterradar frontend“ lief zu diesem Zeitpunkt noch. Da Dokumentationscommits den Branch-Head verändern können, im neuen Chat **immer den aktuellen CI-Stand neu abfragen** statt diesen Zwischenstand als endgültig zu übernehmen.

---

## 11. Nicht verhandelbare Arbeitsregeln

- DRA bleibt harte Abnahmebedingung.
- Keine Tests als erledigt markieren, bevor der reale Nachweis vorliegt.
- Keine temporären M12-Testzweige in `deploy/dev` oder Produkt-Historie übernehmen.
- Keine Medaillon-Weiterentwicklung vor Abschluss von M12.
- Keine doppelte Dokumentation anlegen; Schlachtplan ist Detailquelle, diese Datei ist Übergabe.
- Nach jedem real abgeschlossenen Punkt: Ergebnis prüfen → Schlachtplan aktualisieren → erst dann weiter.
- Keine Veröffentlichung/kein Merge ohne ausdrückliche Benutzerfreigabe.

---

## 12. Konkreter Starttext für den nächsten Chat

```text
Bootstrap Daimos.

Wir machen mit Gewitterradar V4.10.02 und der Modularisierung weiter.

Arbeite direkt im Repository TheDaimos/gewitterradar auf dem aktuellen Zweig
feature/v4.10.02-modularization.

Lies zuerst PROJECT_DEFAULTS.md, dann vollständig
docs/V4_10_MODULARISIERUNG_SCHLACHTPLAN.md
und danach die bestehende fortgeschriebene Übergabe
docs/V4_10_CHAT_HANDOFF_2026-09-22.md.

Keine neue parallele Übergabe- oder Statusdatei anlegen.
Der Schlachtplan ist die verbindliche Detailquelle.

Aktuell läuft M12.
Der reale Ein-Modul-DRA-Test ist bestanden.
Der normale deploy/dev-Stand wurde danach wiederhergestellt.

Der aktuelle Testzweig ist:
test/dra-v4.10.02-cache-mixed-state
Commit:
274d9304823be7a1ec8620ec6f157493813d0e47

Dort meldet ausschließlich fullscreen.map-display absichtlich Version 1.0.1,
während das Manifest 1.0.2 erwartet.
Im realen Laufzeitstand wurden bereits 22/22 geladene Module und 1 Abweichung gesehen.

Führe jetzt exakt den NÄCHSTER-SCHRITT-Block des Schlachtplans fort:
1. Über DRA deploy/dev wiederherstellen und nach hartem Frontend-Neuladen fullscreen.map-display 1.0.2 / korrekt bestätigen.
2. Cache-Testzweig erneut installieren, **vor** hartem Neuladen den weiterhin geladenen 1.0.2-Stand dokumentieren.
3. Danach Strg+Shift+R und den Wechsel auf geladen 1.0.1 / erwartet 1.0.2 / abweichend bestätigen.
4. Erst dann den M12-Haken Browsercache-Fall simulieren setzen und wieder auf deploy/dev zurückstellen.
5. Danach fehlendes Modul real testen.
6. Danach realen DRA-Rollback auf deploy/v4.09 und Rückkehr auf deploy/dev testen.
7. Anschließend M13 kompakt vollständig abarbeiten.

Die provisorische Medaillon-Popup-Funktion aus dem früheren Einzelmodul-Test ist
nur M12-Testträger und darf nicht als fertige Produktfunktion übernommen werden.
Die echte Medaillon-Auswahl und eine mögliche Auslagerung nach instruments.medallion
kommen erst nach M12.

Prüfe beim Start Branch-Heads, PR #24 und CI neu und arbeite ohne Rückfrage nach
dem Schlachtplan weiter.
```
