# GR Eye-Bubble-Hub V4.11.174 – Realtestbefund und verbindliche Korrekturentscheidung

**Datum:** 10.11.2026  
**Projekt:** Gewitterradar / Eye-Bubble-Hub  
**Ausgangsstand:** GR **4.11.174 DEV**, HA **0.25.81**, Runtime `411174r1`, Modulset `E411-174A1`  
**Repository:** `TheDaimos/gewitterradar@deploy/dev`  
**Status:** **Offene Korrekturanforderung, noch NICHT implementiert oder real abgenommen**. Diese Datei ändert keine Runtime, Installationsdatei oder Referenz.

## 1. Gemeldeter Realbefund

- Auf dem Karten-Screenshot der V4.11.174 ist das Eye-Symbol nicht sichtbar, während Premium-Wind, -Temperatur, -Niederschlag und WR-Layer als Einzelicons erscheinen.
- Der Premium-Konfigurator kann über die allgemeinen Gewitterradar-Einstellungen geöffnet werden und zeigt die Live-Vorschauen sowie `Bubble-Gruppierung` links in AUS-Stellung. Der Nutzer meldet, die gewünschte Eye-/Bubble-Funktion über die reale Oberfläche nicht aktivieren oder ausprobieren zu können.
- Sichtbarer Designmangel: Oben rechts im Eye-Konfigurator wird das eckige/alte X verwendet. Für die einzelnen Slot-Zeilen ist genau dieses alte X **erwünscht und soll erhalten bleiben**.

**Quellbefund:** In `frontend/modules/weather/eye-hub.js` setzt `_eyeHubSync()` explizit `eye.hidden=!c.grouped`. In `eye-hub-view.js` verwendet der Konfiguratorheader `premiumAction('close', ...)`; Slot-Leeren nutzt `PREMIUM_CLOSE` aus `premium-ui.js`. Die Screenshotlage beweist noch nicht, ob der Gruppierungs-Toggle beim Versuch fehlerhaft speichert oder ob die bisherigen Sichtbarkeitsregeln und fehlende Eye-Entdeckbarkeit ursächlich sind; daher den tatsächlichen Toggle-Ereignis-/Persistenz-/Renderpfad gezielt realistisch reproduzieren.

## 2. Neue verbindliche Produktentscheidung: Eye auf der Karte immer sichtbar

1. **Eye als Kartenschalter immer sichtbar**, auch wenn die Bubble-Gruppierung AUS ist. Die Gruppierungsoption bestimmt ausschließlich die Organisation der Funktionsicons, nicht die Sichtbarkeit des Eye-Hubs.
2. **Gruppierung EIN:** Eye bleibt sichtbar; Kurz-Tap öffnet/schließt die konfigurierten Bubble-Icons. Keine parallelen Einzelicon-Duplikate. 600-ms-Long-Press öffnet den Eye-Konfigurator.
3. **Gruppierung AUS:** Eye bleibt sichtbar **neben** den bisherigen eigenständigen Premium-Funktionsicons, die weiterhin ihre Positionen, Sichtbarkeitsregeln und bestehenden Tap-/Long-Press-Aktionen behalten. Kurz-Tap auf das Eye soll den Eye-Konfigurator als auffindbaren Einstieg öffnen (kein leeres Bubble-Menü); 600-ms-Long-Press öffnet ebenfalls den Konfigurator. Der bereits vorhandene `Einstellungen → Kartendarstellung → Eye-Bubble-Menü`-Zugang bleibt bestehen. Kein zweiter Darstellungsdialog.
4. Eye allein schaltet **keine Wetterfunktion** ein oder aus. Die ursprüngliche WR-Layer/Darstellungs-Emblem-Schaltfläche bleibt separat und öffnet unverändert ihr bestehendes Darstellungsmenü.
5. Die **Eye-Position `eyePosition`** und sämtliche eigenständigen Karteniconpositionen bleiben unverändert gespeichert. Keine Positionsmigration, keine automatische Zurücksetzung. Die Option `Position merken` bleibt maßgeblich.
6. Bei bestehender Standardkonfiguration darf `Bubble-Gruppierung` weiterhin **AUS** sein. Nur die neue ständige Eye-Sichtbarkeit ändert sich.
7. **Aura-Regeln bleiben unverändert:** Gruppierung AUS → keine Eye-Statusringe und keine Auren auf Einzelicons, selbst wenn Aura EIN gespeichert ist. Gruppierung EIN und Aura EIN → aktive Ring-/Bubble-Auren wie spezifiziert. Globales Aura AUS unterdrückt sämtliche funktionalen Aura-Effekte. Kontrastschattierung separat.
8. Vorhandene Eye-Hi-Res-Originalmaster offen/geschlossen aus V4.11.174 bewahren, kein Ersatz oder Hochskalieren kleiner Bilder; rahmenloses Aussehen und vorhandene Größen-/Touchziel-Einstellungen erhalten.

## 3. Premium-Schließen-Icon korrigieren

- **Eye-Konfigurator, Header rechts oben:** Das derzeitige eckige/alte X **ersetzen** durch das bereits andernorts verwendete **runde, hochwertige Gold-X**, das in den allgemeinen Gewitterradar-Einstellungen sowie Wind-/Temperatur-Einstellungsmenüs Verwendung findet.
- Das reale gemeinsame freigegebene Masterasset bzw. vorhandene Premium-Schließen-Element **im Repository lokalisieren und unverändert wiederverwenden**; nicht generativ nachzeichnen, nicht neue Iconfamilie einführen.
- **Slotzeilen:** Bisheriges eckiges/kleines X zum Leeren eines Slots **ausdrücklich beibehalten**. Es hat eine andere Funktion und ist als Slot-Reset-Symbol akzeptiert.
- Gewohnte Fokus-, Touch-/Pointer-, Tastatur- und Close-Logik erhalten. Bei Bedarf CSS auf einheitliche Größe/Alignment der Headerbedienelemente anpassen, nicht ihre Semantik verändern.

## 4. Zielgerichtete Prüfung vor Freigabe

- Standardzustand AUS: Eye **sichtbar**, Einzelicons **sichtbar**, **keine** Bubble-Aura, keine Statusringe; Eye-Kurztap und Long-Press erreichen Konfigurator.
- Toggle AUS → EIN und EIN → AUS innerhalb desselben geöffneten Konfigurators: tatsächlicher Zustand wechselt **sofort**, bleibt nach Schließen und Reload gespeichert, UI und Karte stimmen überein.
- Zustand EIN: Eye-Kurztap öffnet/schließt Bubbles. Keine Doppelicons. Einzelpositionen unverändert. Schließen via Escape/Außenaktion, Touch/Longpress, Drag, Tastatur, Android/iPad/Chromium-Viewports prüfen.
- Sowohl klassisches als auch modernes GR-Einstellungsmenü müssen den Konfigurator erreichen.
- Header zeigt **rundes** Gold-X; alle Slotzeilen behalten **altes eckiges** X; Klicks lösen ausschließlich ihre vorgesehene Aktion aus.
- Falls `eye.hidden` und `display:block` CSS kollidieren, eine **konsistente** Sichtbarkeitssemantik schaffen statt durch immer weitere Override-Regeln Fehler zu verdecken.
- Keine Veränderung an WeatherRouter, Wetterquellen, Freshness, Raster, Lightning, Windanimation oder TEST69. Kein privates CI. Nur öffentliche gezielte CI auf `deploy/dev`. Keine automatische VM109-/VM101-Installation.
- Wenn Code geändert wird: **neue eindeutige GR-/HA-DEV-Version** und vollständige Synchronisierung aller Runtime-, Manifest-, Modul-, Frontendkopien-, SHA256-, DRA-/Release-Metadaten. V4.11.171 und V4.11.173 als geschützte Referenzen unangetastet lassen; V4.11.174-Release nicht überschreiben.

## 5. Status

Diese Festlegungen wurden nach Sichtung der ersten V4.11.174-Desktop-Screenshots getroffen. Der aktuelle Screenshot zeigt die AUS-Stellung und die falsche Header-X-Grafik. **Es gibt noch keinen Nachweis einer implementierten Korrektur und keine echte Android-/iPad-/VM109-Abnahme.**
