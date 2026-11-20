# Gewitterradar V4.11.93 DEV – Selbstständige Frontend-Neuladung

**18.10.2026 · deploy/dev · Integration 0.25.11 · Runtime 41193r1 · Modulsatz E411-93A1**

Der Realexport nach V4.11.92 belegte eine installierte neue Laufzeit (E411-92A1 / 41192r1) bei weiter geladenem alten Frontend (E411-91A1 / 41191r1), obwohl 34/34 Module korrekt im alten Satz geladen waren.

**Behebung:** Das native Seitenleistenmodul wird ab dieser Version mit einer revisionsgebundenen Kennung registriert (`panel.js?v=41193r1`). `panel.js` lädt `gewitterradar.js?v=41193r1` statt der unversionierten Karte. Bereits vorhandene, ältere Web-Komponenten werden als veraltet erkannt und nicht als neue Laufzeit ausgegeben. Der Aktualisierungswächter verwendet eine tatsächliche vollständige Seitennavigation mit Zielversion und wechselndem Cache-Schlüssel statt eines einfachen `location.reload()`. Er führt automatisch nur einen solchen Versuch pro installierter Version und Browsersitzung aus und nennt bei erfolglosem Versuch den Neustart und die Ressourcenprüfung.

**Technische Grenzen:** Die laufende Home-Assistant-Registrierung einer Seitenleiste und die bereits registrierte Browser-Web-Komponente lassen sich nicht allein durch das Überschreiben einer Datei austauschen. **Nach DRA-Installation Home Assistant vollständig neu starten; anschließend Browser/App vollständig neu öffnen.** Manuelle Lovelace-Ressourcen dürfen nicht doppelt vorhanden sein. Wenn eine native Gewitterradar-Karte als Dashboard-Ressource eingebunden ist, bestehende URL einmalig auf `/gewitterradar/gewitterradar.js?v=41193r1` aktualisieren.

**Akzeptanz:** Erst wenn geladen und installiert beide `E411-93A1` / `41193r1` anzeigen und keine `runtime_stale`-Abweichung verbleibt. GitHub-CI ist keine HA-Realabnahme. Der gemeinsame NASA+DWD-V2-Realtest mit WR bleibt offen.

*C.K. – Eine Idee weiter gedacht.*
