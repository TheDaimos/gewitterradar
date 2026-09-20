# Gewitterradar – vollständige Übergabe V4.09.01 Kartenansichten

Stand: **2026-09-20**  
Zweck: **verbindliche Chat-/Git-Übergabe für die Fortsetzung in einem neuen Chat**  
Repository: `TheDaimos/gewitterradar`

## 1. Unveränderliche öffentliche Basis

Die zuletzt veröffentlichte und eingefrorene Version bleibt **V4.08 FINAL**.

- öffentlicher Release-Commit: `27da94e5043a365dbe8ea5c5e2224327165750fa`
- Tag: `v4.08`
- Freeze: `frozen/v4.08`
- native Integration: **0.20.0**
- Build: `V4.08-RELEASE-2026-09-18`
- gemeinsames Frontend SHA256: `b75390652fae4aa98c77162fb207d97ece408ab617bbf107bcb0f3b9466a691f`
- Locale SHA256: `a57493b6291671696aeb87c267595e3ce5fede987546f702d7883ef6f07bd288`

Der normale `main`-Stand vor dieser Dokumentationsaktualisierung ist:

`8f8d1a03df220588985ed2e59c0abc127dd32e4f`

V4.08 darf nicht nachträglich funktional verändert, neu getaggt oder als V4.09-Kandidat umgedeutet werden.

## 2. Aktueller V4.09.01-Testkandidat

Der gegenwärtig maßgebliche Entwicklungszweig ist:

`feature/v4.09-map-display-modes`

Aktueller Head:

`d6b2b68bb36f9e0e9f1a9b20d0526c81b47cc308`

Dieser Zweig wurde von `main`-Commit `8f8d1a03df220588985ed2e59c0abc127dd32e4f` abgezweigt und enthält darauf **14 V4.09.01-Kandidaten-Commits**. Seit der anschließenden Handoff-Dokumentation kann `main` zusätzliche reine Dokumentations-Commits enthalten; diese formale Git-Divergenz ist **keine Runtime-Abweichung** und soll vor der Geräteabnahme nicht durch einen unkontrollierten Merge aufgelöst werden.

Der zuletzt vollständig automatisiert geprüfte Runtime-/Teststand ist:

`fcfb6ddd114c96587312be35b7af4be92ed8af61`

Danach folgten nur drei Dokumentations-Commits:

1. `7608b4a…` – Roadmap/Kandidatenstatus dokumentiert
2. `19f9bc0…` – V4.09.01-Testkandidat im Changelog dokumentiert
3. `d6b2b68…` – dedizierten Kandidaten-Handoff ergänzt

Damit ist der Runtime-Code am Branch-Head gegenüber dem grün geprüften `fcfb6ddd…` unverändert.

## 3. Verbindliche Produktentscheidung des Benutzers

Die Kartensteuerung wurde bewusst auf drei direkte Zustände reduziert:

**Standard · Groß · Vollbild**

Eine zusätzliche XL-Stufe ist nicht vorgesehen.

**„In eigenem Fenster öffnen“** soll **nicht** als vierter direkter Kartenmodus erscheinen, sondern als gezielter Punkt in den **Einstellungen**.

Im Vollbild gilt:

- der **aktuell ausgewählte produktive Kompass** wird eingebettet;
- kein zweites Kompassdesign und kein unabhängiger Kompasszustand;
- der Kompass ist per Maus sowie Touch/Pointer verschiebbar;
- die Position wird normalisiert gespeichert, damit sie auf unterschiedlichen Bildschirmgrößen sinnvoll wiederhergestellt werden kann.

## 4. Implementierter Funktionsumfang des aktuellen Kandidaten

V4.09.01 ergänzt V4.08 ausschließlich um den Karten-Darstellungsblock:

- direkte Auswahl **Standard · Groß · Vollbild**;
- Standard bleibt die akzeptierte bisherige Geometrie;
- Groß vergrößert die vorhandene Karte responsiv;
- Vollbild verwendet dieselbe laufende Leaflet-Karteninstanz statt einer zweiten Karte;
- der gewählte Kompass wird in den Vollbildbereich umgesetzt und anschließend wieder an seine ursprüngliche Stelle zurückgeführt;
- Kompassverschiebung nutzt Pointer Events für Desktop und Touch/iPad;
- Standard/Groß-Präferenz wird lokal gespeichert;
- Vollbild-Kompassposition wird lokal als normalisierte X/Y-Position gespeichert;
- **In eigenem Fenster öffnen** liegt separat in den Einstellungen;
- separates Fenster startet direkt in der Vollbild-Kartenansicht;
- bei blockiertem Popup erfolgt Rückfall auf integriertes Vollbild;
- native Integration und Dashboard-Auslieferung bleiben aus derselben kanonischen Frontendquelle abgeleitet.

Kanonische Quelle:

`frontend/gewitterradar.js`

Ausgelieferte Kopien:

- `custom_components/gewitterradar/frontend/gewitterradar.js`
- `dashboard/dist/gewitterradar.js`

## 5. Automatisierte Prüfung

Dokumentierter grüner Stand `fcfb6ddd114c96587312be35b7af4be92ed8af61`:

- Validate shared Gewitterradar frontend – Run `35510583632` – **success**
- Validate Gewitterradar integration – Run `35510583685` – **success**
- Hi-Res asset retention – Run `35510583628` – **success**

Die Kandidatensuite deckt insbesondere ab:

- V4.09-Kartenmodusvertrag;
- Byte-Parität Integration/Dashboard;
- JavaScript-Syntax;
- 19 Sprachvarianten / About-Locale-Vertrag;
- Recorder-Locale-Audit;
- geschützten Diagnosevertrag;
- Desktop, iPad und Android;
- Standard → Groß → Vollbild;
- Pointer-/Touch-Verschiebung des Kompasses;
- gespeicherte Kompassposition;
- Wiederherstellung der normalen Ansicht;
- Einstellungen / separates Fenster;
- Popup-Blocker-Rückfall;
- Language Onboarding;
- V4.07.56 Settings-/Help-Profile;
- geschützte About-Geometrie mit unveränderter maximaler Toleranz von **0,02 px**;
- Dashboard-/Integration-Browserparität.

## 6. Bereits behobene Kandidatenfehler

### iPad Groß-Modus

Eine erste `72dvh`-Variante konnte auf 768-px-Tablets minimal kleiner als die Standardkarte werden. Der Kandidat wurde korrigiert, sodass **Groß** auf den geprüften Tabletprofilen tatsächlich größer ist.

### Legacy-/Golden-Tests und Vollbild-Dialog

Ältere Tests gingen davon aus, dass kein zusätzliches geschlossenes `dialog`-Element existiert bzw. nur V4.08-Metadaten auftreten. Die Tests wurden eng angepasst, ohne About-Geometrie oder die Toleranz von **0,02 px** zu lockern.

## 7. Noch ausstehend – reale Geräteabnahme

Vor jeder Promotion nach `main` mindestens real prüfen:

1. Desktop: Standard → Groß → Vollbild → zurück;
2. iPad Hochformat: Standard/Groß/Vollbild;
3. iPad Querformat: Standard/Groß/Vollbild;
4. iPad: Kompass im Vollbild per Touch verschieben;
5. Android: Standard/Groß/Vollbild sowie Orientierungswechsel;
6. aktuell gewählten Kompass wechseln und anschließend Vollbild öffnen;
7. Kompassposition speichern, Vollbild verlassen, erneut öffnen;
8. Karten-Panning/Zoom mit eingeblendetem Kompass;
9. Cluster, Radien und normale Karteninteraktion nach jedem Größenwechsel;
10. **In eigenem Fenster öffnen** im normalen Browser;
11. Verhalten in Home-Assistant-App/WebView;
12. Rückfall auf Vollbild bei blockiertem Popup;
13. Rückkehr aus Vollbild ohne Layout-/Leaflet-Versatz.

## 8. Was ausdrücklich noch NICHT erfolgt ist

- kein Merge des V4.09.01-Kandidaten nach `main`;
- kein öffentlicher V4.09-Release;
- kein Tag `v4.09` oder `v4.09.01`;
- kein `frozen/v4.09*`;
- kein neuer Golden Master für V4.09;
- keine HACS-Veröffentlichung dieses Kandidaten;
- keine reale Geräteabnahme;
- keine Freigabe, die parallelen experimentellen Kartenbranches zu löschen.

## 9. Parallele/divergierende Karten-Zweige

Diese Zweige existieren zusätzlich und sind **nicht** der aktuelle Fortsetzungspunkt:

### `feature/v4.08-map-view-modes`

Head: `9c2760498bd284a0818392ee9012f5a7dfa9b4b2`

Historischer Versuch unter falscher/überholter V4.08-Zuordnung. V4.08 ist inzwischen veröffentlicht und eingefroren. Nicht in V4.08 zurückführen.

### `feature/v4.09-map-view-modes`

Head: `8fde20c5661dcfaa553eead3d76964e56ff1269e`

Alternativer, umfangreicher V4.09-Ansatz; **34 Commits vor main**. Er divergiert vom aktuellen Kandidaten und besitzt eindeutige Commits. Nicht blind mergen und nicht löschen, bevor ein bewusster Vergleich/Archiventscheid erfolgt.

### `feature/v4.09-map-viewport-modes`

Head: `a9d76e43c8d7d2def69045f860f105cde16a27a4`

Früher Ein-Commit-Prototyp. Ebenfalls divergent; bis zur bewussten Prüfung behalten.

### Aktuell verbindlicher Kandidat

`feature/v4.09-map-display-modes`  
Head: `d6b2b68bb36f9e0e9f1a9b20d0526c81b47cc308`

Nur dieser Zweig soll ohne neue Benutzerentscheidung fortgeführt werden.

## 10. HACS-/V4.09-Gesamtbacklog bleibt bestehen

Unabhängig von V4.09.01 bleiben für V4.09.xx vorgemerkt:

- Aufnahme in den offiziellen HACS-Standardkatalog / `hacs/default`;
- aktuelle HACS-/Hassfest-Anforderungen vor Einreichung erneut verifizieren;
- reale Update-Latenz Custom Repository vs. Standardkatalog messen;
- fehlendes HACS-Update-Icon gegen aktuellen HACS-/Home-Assistant-Stand prüfen;
- funktionierendes Integrationsbranding nicht als Workaround beschädigen.

Diese Punkte sind **nicht automatisch Bestandteil von V4.09.01**.

## 11. Verbindliche Schutzregeln

Weiterhin gelten insbesondere:

- V4.08-Release/Tag/Freeze unverändert lassen;
- ein Produkt, zwei Auslieferungsformen;
- gemeinsame Frontend-Änderung nur in der kanonischen Quelle;
- About-Acceptance und V4.07.56-Goldenvertrag erhalten;
- Diagnosemodus ab V4.07.56 vollständig schützen;
- Hi-Res-/Mastergrafiken niemals im Rahmen von Cleanup entfernen;
- vor wesentlicher Promotion PRE-MERGE-Snapshot;
- nach Merge und vollständig grünen Gates Golden Master des exakten neuen `main`;
- veröffentlichte Tags/Freeze-Punkte nie verschieben;
- parallele Branches mit eindeutigen Commits nicht aus optischer Bereinigung löschen.

## 12. Startanweisung für den neuen Chat

1. Mit **Daimos** oder **Deimos** bootstrappen.
2. `TheDaimos/project-defaults/START_HERE.md` und globale Regeln laden.
3. `TheDaimos/gewitterradar/PROJECT_DEFAULTS.md` laden.
4. Dieses Dokument lesen:
   `docs/HANDOFF_V4_09_01_MAP_DISPLAY_2026-09-20.md`
5. Danach lesen:
   `docs/V4_09_01_MAP_DISPLAY_TEST_CANDIDATE.md`
6. Branch `feature/v4.09-map-display-modes` prüfen und bestätigen, dass Head weiterhin `d6b2b68bb36f9e0e9f1a9b20d0526c81b47cc308` oder ein dokumentierter Nachfolger ist.
7. Nicht von einem der anderen Kartenmodus-Zweige weiterarbeiten, sofern keine neue ausdrückliche Entscheidung vorliegt.
8. Als nächsten fachlichen Schritt die **reale Geräteabnahme** durchführen und Ergebnisse unmittelbar in Git dokumentieren.
9. Bei Fehlern nur den V4.09.01-Kandidaten korrigieren; V4.08 nicht öffnen.
10. Erst nach ausdrücklicher Abnahme die kontrollierte Promotion nach `main` gemäß Release-/Golden-Master-Regeln vorbereiten.

## 13. Kurzfassung für die direkte Fortsetzung

**V4.08 ist veröffentlicht und eingefroren. V4.09.01 Kartenansichten ist auf `feature/v4.09-map-display-modes` vollständig implementiert und automatisiert grün, aber noch nicht real abgenommen. Direkte Modi: Standard · Groß · Vollbild. Eigenes Fenster nur in Einstellungen. Aktueller Kompass im Vollbild, per Pointer/Touch verschiebbar. Nächster Schritt: reale Geräteabnahme; danach erst Merge/Release.**
