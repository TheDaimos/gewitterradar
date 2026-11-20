# Verbindlicher WR-/GR-Modul- und Provider-Regressionsschutz

**Beschluss:** 13.11.2026 · **Geltung:** WeatherRouter und GewitterRadar, alle künftigen DEV-Änderungen.

## Unverhandelbare Invariante
Eine neue oder weiterentwickelte Capability, ein Provider, ein Modul, ein Renderer oder ein gemeinsamer Dienst darf **keine bereits funktionierende und abgenommene unabhängige Funktion einschränken, deaktivieren, blockieren, verzögern oder stillschweigend verändern**. Dies gilt in **beide Richtungen**: neuer Hoch-/Tiefdruck-, Fronten- oder Isobarencode darf DWD-/OPERA-/NASA-Niederschlag, Wind, Temperatur, Menü, Eye, Touch, Cache und Kachelübergabe nicht regressieren; Änderungen an Niederschlag dürfen ebenso keine Synoptik oder anderen Module beschädigen. Gleiches gilt für künftige Provider und Produkte.

## WR – Provider- und Capability-Isolation
1. Jeder Provider besitzt isolierte Fehler-, Timeout-, Retry-, Backoff-, Caching- und Refresh-Pfade. Ein langsamer oder ausgefallener Provider darf freigegebene Ergebnisse unabhängiger Provider nicht blockieren.
2. Gemeinsame Ressourcen und Resolver dürfen nur vertraglich vereinbarte Auswirkungen haben. Keine ungewollte globale Cache-Invalidierung, keine versteckten Provider-Freigabeschranken, keine neue fixe 900-s-GR-Gültigkeit.
3. Providerwahl, Freshness, Abdeckung, Priorität und wissenschaftliche Freigabe verbleiben ausschließlich bei WR. Fehlende/unklare Coverage niemals als bestätigte Coverage ausgeben.
4. Vorhandene Consumer-V1-/V2-Verträge und funktionierende Datenwege sind rückwärtskompatibel zu halten; Änderungen am gemeinsamen Resolver bedürfen expliziter Cross-Provider-Regression.

## GR – Modul- und Renderer-Isolation
1. Neue Module dürfen bestehende Module nicht deaktivieren, DOM-/Layer-/Z-Index-/Pointer-Events übernehmen, globale Eventlistener oder Zustandsvariablen unkontrolliert überschreiben oder gemeinsames Rendering blockieren.
2. Windanimation inkl. geschützter Schlangenoptik und Einstellungen, Temperatur, Niederschlag, Eye, Menüs, Touch/Drag, Legenden und Diagnosen bleiben bei Änderungen anderer Funktionen unverändert.
3. Renderpfade übernehmen ausschließlich WR-genehmigte Quellen; nutzbare vorhandene Kacheln bleiben bis zum vollständigen, gültigen Ersatz erhalten. Kein globales Warten auf unabhängige Provider.
4. Frontend-Spiegel, Modulregister, Runtime-/Installationsrevisionen und DRA-Metadaten müssen übereinstimmen. Neues Modul darf keine ältere Runtime als scheinbar installierten Stand hinterlassen.

## Pflichtprüfung vor Änderung und DEV-Freigabe
- Betroffene und **unbetroffene** Funktionsfamilien, Schnittstellen und geteilte Ressourcen vor Implementierung identifizieren.
- Baseline-Commit/Version lesen; keinen früheren Referenzstand als aktuelle Quelle annehmen.
- Gezielte Positiv-, Negativ-, Fehler-/Timeout-, Parallelitäts-, Reconnect-, Cache- und Modul-Interaktionstests ergänzen und tatsächlich ausführen.
- Bei Änderung an shared code mindestens Niederschlag (DWD/OPERA/NASA), Wind, Temperatur und Synoptik sowie GR Eye/Menu/Touch/Modulidentität auf Regression prüfen; bei nicht betroffenen Pfaden dokumentiert begründen, weshalb kein Test nötig war.
- Testausführung nachweisen; statische Prüfung ist kein HA-/Browser-Realtest. Fehlende Umgebung ausdrücklich als offene Abnahme markieren, keine grüne Freigabe erfinden.
- Bei Verletzung eines Schutzvertrags: keine Promotion/Referenzfreigabe; Änderung korrigieren oder zurücknehmen. Kein „Fix“ durch Abschalten einer funktionierenden Funktion.
- Ausschließlich neue Versionsnummern; PROD VM101 bleibt unangetastet; Realabnahme auf DEV VM109. Öffentliche CI nur im Public-Repo, private WR-Actions bleiben deaktiviert.
- Entscheidungen und Ergebnisse mit Commits, Versionsnummern und offenen Punkten dokumentieren. Offizielle Referenz erst nach ausdrücklicher Betreiber-Abnahme; Referenzkandidat ist keine endgültige Referenz.

## Chatwechsel-Falle
Ein Bootstrap oder eine Gedächtnisnotiz ist **keine technische Durchsetzung**. Jeder neue Chat/Codex-Lauf muss dieses Dokument vor Codeänderungen lesen, die konkrete Diff-/Testsituation dagegen prüfen und fehlende Nachweise offenlegen. Tests und Release-Gates müssen später zusätzlich im Build technisch erzwungen werden; die bloße Dokumentation beweist keine solche Durchsetzung.

**Projektquellen:** `TheDaimos/weather-router-dev@deploy/dev`, `TheDaimos/gewitterradar@deploy/dev`; Originaldiagnosen ausschließlich `TheDaimos/Project-Log-And-Export@main`.
