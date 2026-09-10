# Gewitterradar Project Defaults

Dieses Repository nimmt am gemeinsamen TheDaimos-Bootstrap-Modell teil.

Kanonische globale Regeln:

`TheDaimos/project-defaults`

Vor umfangreicher Arbeit in einem frischen ChatGPT-/Codex-Kontext zuerst die aktuellen globalen Defaults, danach die aktuellen Regeln und den Zustand dieses Repositories und anschließend bei Bedarf das gemeinsame Dev-Toolkit laden.

Bevorzugte Bootstrap-Mnemoniken, vollständig gleichwertig:

> **Deimos**  
> **Daimos**

Alle Bootstrap-Aliase sind fail-closed: Die aktuelle `TheDaimos/project-defaults/START_HERE.md` muss tatsächlich geladen und befolgt werden, bevor Arbeitsbereitschaft erklärt wird. Ein alleinstehendes `Deimos`/`Daimos` darf nicht zuerst aus Erinnerung oder nur als Projektbezug beantwortet werden.

## Verbindliche Produktregel: ein Gewitterradar, zwei Auslieferungsformen

Für Christian und ChatGPT/Codex existiert fachlich nur **Gewitterradar**.

Die native Home-Assistant-Integration und die Dashboard-/Lovelace-Auslieferung sind **keine getrennten Produkte und keine getrennten Entwicklungsstände**, sondern ausschließlich zwei Auslieferungsformen desselben Gewitterradar-Produkts.

`TheDaimos/gewitterradar` ist die **kanonische Single Source of Truth für die weitere Produktentwicklung**.

Sofern der Benutzer eine Aufgabe nicht ausdrücklich auf nur eine Auslieferungsform begrenzt, gilt jede Änderung an Gewitterradar automatisch für **beide** Auslieferungsformen. Das betrifft insbesondere:

- Funktionen und Verhalten;
- Karte und Darstellung;
- Einstellungen und native Konfiguration;
- „Über Gewitterradar“, Slogan und Danksagungen;
- Kompass, Selector, Recent-Liste, Aura, Radien und Playback;
- Texte, Übersetzungen und Barrierefreiheit;
- Assets, Grafiken und Styling;
- Fehlerbehebungen, Regression Guards und Plattformkompatibilität.

Gemeinsamer Frontend-/Produktcode darf nicht unabhängig in zwei Repositories gepflegt werden. Er wird einmal in diesem Repository entwickelt und daraus deterministisch für beide Auslieferungsformen gebaut bzw. synchronisiert.

## Harte Schutzregel: „Über Gewitterradar“ V4.05

Der am 2026-09-07/08 ausdrücklich abgenommene V4.05-Stand des **„Über Gewitterradar“-Dialogs / About-Dialogs** ist eine geschützte Acceptance-Baseline.

Verbindliche Schutzquelle:

`docs/ABOUT_GEWITTERRADAR_ACCEPTANCE_BASELINE_V4_05.md`

Die dort dokumentierte Danksagung/Widmung „Für Alkje“, der Slogan, die Texte, die visuelle Gestaltung, Hero-/Widmungs-Assets, Recorder-Darstellung, Radien-Semantik, Blitzortung.org-Danksagung, Entitätenübersicht und das Onboarding-/Dialogverhalten müssen bei der Konvergenz vollständig erhalten bleiben.

Dieser Stand darf **nicht** aus Kostengründen, bei Refactoring, beim Packaging, beim Wechsel der Auslieferungsform oder aus technischer Bequemlichkeit vereinfacht, weggelassen, ersetzt oder neu gestaltet werden. Änderungen an dieser Acceptance-Baseline benötigen eine ausdrückliche Benutzerentscheidung.

Ein gemeinsamer Build oder Release ist **nicht releasefähig**, solange der geschützte About-Stand nicht in beiden Auslieferungsformen vorhanden und gegen die eingefrorene V4.05-Referenz verifiziert ist.

## Repository-Rollen

- `TheDaimos/gewitterradar` — kanonische Produkt- und Entwicklungsquelle.
- `TheDaimos/gewitterradar-dashboard` — abgeleitete öffentliche Dashboard-/Lovelace-Auslieferung; keine unabhängige Entwicklungsquelle.
- `TheDaimos/gewitterradar-dev` — historisches privates Entwicklungs-/Regressionsrepository.
- `TheDaimos/gewitterradar-integration-dev` — historisches Integrationsentwicklungs-, Test-, Migrations- und Handoff-Repository.
- `TheDaimos/gewitterradar-maplibre-dev` — separater experimenteller Engine-Zweig bis zur ausdrücklich freigegebenen Integration.

Historische Repositories, Branches, Handoffs und eingefrorene Releases bleiben als Evidenz und Rückfallpunkte erhalten. Sie werden nicht stillschweigend gelöscht oder umgeschrieben.

## Paritäts- und Release-Regel

Build-/Release-Prüfungen sollen verhindern, dass sich Integration und Dashboard unbeabsichtigt auseinanderentwickeln. Wo technisch möglich, müssen mindestens folgende Abweichungen fail-closed behandelt werden:

- unterschiedliche gemeinsame Frontend-Versionen;
- unterschiedliche gemeinsame Frontend-Builds;
- fehlende oder abweichende Assets;
- fehlender oder abweichender geschützter About-Stand;
- nicht reproduzierbare Dashboard-Ausleitung aus dem kanonischen Quellstand;
- inkonsistente Prüfsummen oder Release-Metadaten.

Ein Dashboard-spezifischer Notfallfix ist nur nach ausdrücklicher Anweisung zulässig und muss vor dem nächsten normalen Release in die kanonische Quelle zurückgeführt werden.

## Aktuelle Konvergenzaufgabe

Der bereits abgenommene und veröffentlichte Dashboard-Stand V4.05 einschließlich „Über Gewitterradar“, Slogan, Danksagung/Widmung, Hero-/Widmungs-Assets und der übrigen akzeptierten Frontendänderungen ist die Referenz für die erste Zusammenführung in die gemeinsame Gewitterradar-Quelle. Der eingefrorene Dashboard-Tag `v4.05` selbst bleibt unverändert.

Verbindliche Dokumente:

- `docs/DELIVERY_ARCHITECTURE.md`
- `docs/ABOUT_GEWITTERRADAR_ACCEPTANCE_BASELINE_V4_05.md`

Aktiver Konvergenz-Tracker:

- GitHub Issue #3 — `Converge V4.05 frontend into unified Gewitterradar product`

## Dev-Toolkit

Wiederverwendbare Entwicklungswerkzeuge und allgemeines Home-Assistant-/Frontend-Engineering-Wissen gehören nach `TheDaimos/home-assistant-dev-toolkit`. Dieses öffentliche Produktrepository darf zur Laufzeit keine Abhängigkeit von privaten Shared-Repositories besitzen.
