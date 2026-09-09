# About-Locale-Bundles

`ABOUT_LOCALES` ist die gemeinsame About-Locale-Struktur. Jedes Bundle enthält
`strings`, `settingLabels`, `settingPurposes` und `sourcePurposes`. Deutsch und
English referenzieren die bestehenden schlüsselbasierten Texttabellen, damit
deren Inhalte unverändert bleiben. Das Rendering liest ausschließlich das von
`resolveAboutLocale()` gelieferte Bundle, nicht mehr die einzelnen Tabellen.

Deutsch definiert die String-Keys. Beide Setting-Gruppen müssen exakt die Keys
von `SETTING_ENTITIES` enthalten. Die Source-Gruppe muss dem deutschen Master
entsprechen; dessen vier IDs werden zusätzlich gegen den unveränderten
Recorder-YAML geprüft. Alle Werte müssen nichtleere Strings sein. Zusätzliche,
fehlende oder ungültige Gruppen/Keys und unregistrierte Locale-Namen führen zu
einem Fehler. Deutsch und English sind verpflichtend.

Build/Verify/Test sind strikt fail-closed: Sie führen `validateAboutLocales()`
explizit in einem isolierten JavaScript-Kontext ohne Card-Instanz oder Home
Assistant aus. Ein unvollständiges Bundle darf weder gebaut noch verifiziert
werden. Bei der produktiven Modulinitialisierung läuft kein Validator-Aufruf.

Die Runtime verwendet einen defensiven vollständigen English-Fallback für
fehlende oder unvollständige optionale About-Locale-Bundles.
`isAboutLocaleComplete()` prüft den einzelnen Kandidaten anhand derselben
strikten Regeln für alle vier Gruppen und fängt Validierungsfehler ab.
Ein fehlerhaftes Zusatz-Bundle verhindert somit nicht die Registrierung der
Karte. Das vollständige English-Bundle wird durch Build/Verify garantiert.

Für eine weitere Sprache ein vollständiges Bundle unter ihrem bereits in
`LANGUAGE_DEFINITIONS` enthaltenen Namen in `ABOUT_LOCALES` ergänzen. Es sind
keine Rendering-Sonderfälle und keine zweite Sprachregistry nötig. Bis dahin
verwenden die weiteren 17 Varianten einschließlich Dialekten das komplette
englische Bundle. Einzelne fehlende About-Texte werden nicht aus der allgemeinen
App-I18N ergänzt; deren eigener Fallback bleibt unverändert.

Prüfungen: `node scripts/verify-about-locales.mjs` und
`node scripts/test-about-locales.mjs`. Mit einem Chromium-Pfad als Argument
prüft letzterer zusätzlich das echte DOM für alle 19 Registry-Sprachen in
Dashboard und Integration. Die bestehenden Golden- und Browser-Schutztests
bleiben unverändert.
