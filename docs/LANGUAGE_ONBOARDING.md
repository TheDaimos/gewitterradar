# Erststart-Sprachwahl

Gewitterradar fragt einmal global pro HA-Installation nach der Sprache. Erst nach expliziter Bestätigung und erfolgreichem Schreiben der Sprache folgt das bisherige About-Onboarding. Karten-Vorschauen im Editor verbrauchen keinen Erststart; mehrere Karten zeigen nur einen Sprachdialog.

Die Vorauswahl verwendet `hass.locale.language`, ersatzweise `hass.language` aus dem Home-Assistant-Card-Kontext. Codes werden getrimmt, kleingeschrieben, Unterstriche in Bindestriche umgewandelt und auf den Sprachanteil reduziert. Hauptsprachen werden ausschließlich aus `LANGUAGE_DEFINITIONS` zugeordnet; `no` wird auf `nb` normalisiert. Deutsch einschließlich de-DE/de-AT/de-CH ergibt immer Deutsch. Nicht unterstützte oder fehlende Angaben ergeben English. Die vier deutschen Dialekte sind nur manuell wählbar.

Die Bestätigung verwendet wie die bestehende Einstellung `_languageEntity()` und `_selectSetting()` (`select.select_option` oder `input_select.select_option`), einschließlich expliziter Card-Overrides. Die bestehende vorübergehende `_languagePreview` überbrückt HA-Zustandsupdates. Es gibt keinen zweiten persistenten Sprachwert.

Der globale boolesche Marker heißt nativ `language_initialized` in den Config-Entry-Optionen (Default `false`). Die vorhandene Switch-Plattform stellt ihn als `switch.gewitterradar_language_initialized` bereit; der Standardservice `switch.turn_on` schreibt über die bestehende Runtime. Das Legacy-Paket stellt `input_boolean.lightning_detection_language_initialized` ohne `initial` bereit, damit HA den Zustand über Neustarts wiederherstellt. Der Marker enthält keine Sprache. Er wird erst nach erfolgreichem Schreiben des eigentlichen Sprachsettings eingeschaltet. Der Dialog wartet auf den bestätigten HA-Zustand, bevor About folgt; Schreibfehler erlauben erneutes Bestätigen.

Integration und Dashboard verwenden denselben Frontend-Code. Ein vorhandener nativer Marker hat Vorrang (auch bei unbekanntem/unverfügbarem Zustand); sonst wird der Legacy-Helper verwendet. Für umbenannte Entities gibt es den Card-Override `language_initialized_entity`. Native Integration bzw. Legacy-Paket müssen zusammen mit dem Frontend aktualisiert werden. Ohne verfügbaren globalen Marker kann die Bestätigung nicht abgeschlossen werden; es gibt keinen lokalen Ersatzstatus.

Der alte Browser-Key `gewitterradar-language-onboarding-version` wird weder gelesen noch geschrieben oder migriert. Bestehende lokale Werte bleiben wirkungslos. Ohne globalen Marker wird einmal erneut gefragt, unabhängig vom aktuellen Sprachwert. Bei einer Migration zur nativen Integration kann ausschließlich ein bereits eingeschalteter globaler Legacy-Helper übernommen werden; vorhandene native Optionen haben Vorrang.

Auf weiteren Geräten wird die bereits global bestätigte Sprache unverändert verwendet, selbst bei anderer HA-Oberflächensprache. Der bisherige About-Key `gewitterradar-about-onboarding-version` bleibt ausschließlich lokal pro Browserprofil/Origin: Noch offenes About erscheint auch auf dem zweiten Gerät, bereits bestätigtes About wird dort nicht wiederholt. Spätere Sprachänderungen bleiben über die normalen Gewitterradar-Einstellungen möglich.

Der native modale Dialog ist ohne X und ohne Escape-Abbruch, unterstützt Radio-Tastaturbedienung, Fokusumlauf, sichtbaren Fokus und eine scrollbare Sprachliste auf kleinen Touch-Geräten. Keine freigegebenen Assets oder About-Geometrie werden verändert.

## Übergang in Phase 1

Die bestätigte Sprache steht vor dem Öffnen von About über den bestehenden Sprachmechanismus bereit. About besitzt derzeit nur Deutsch und Englisch; die übrigen 17 Varianten verwenden weiterhin den bestehenden englischen About-Fallback, die Widmung bleibt dort vorerst Deutsch. Phase 1 fügt keine neuen About-Übersetzungen hinzu.

## Prüfungen

`node scripts/test-language-onboarding.cjs <chromium> [output-directory]` prüft beide Auslieferungen: zwei unabhängige Browserprofile mit gemeinsamem HA-Zustand, ignorierte alte lokale Sprachmarker, lokale About-Bestätigung, Locale-Zuordnung, manuelle Wahl, ausdrückliches English, Bestätigung erst nach Serviceerfolg, Neustart, spätere HA-Sprachänderung, About-Reihenfolge, native/Legacy/Override-Schreibwege, Fehler und Retry, Vorschau und Mehrkartenverhalten, Tastatur, Escape und alle 19 Einträge auf einem 320px-Touch-Viewport.

Die bestehenden About-/Layout-Harnesses stellen einen bestätigten globalen HA-Sprachmarker als Vorbedingung für ihre unveränderten Prüfungen nach der Sprachbestätigung. Frozen-Fixture, Golden-Masken und Geometrietoleranzen bleiben unverändert. Die gemeinsame Quelle wird über die explizite `language-onboarding-delta.mjs`-Erweiterung der bestehenden Build-Delta-Vorgabe abgesichert und identisch in Integration und Dashboard ausgeliefert.

HA-Referenz: https://github.com/home-assistant/frontend/blob/dev/src/types.ts (`HomeAssistantInternationalization`).
Native Integrationstests prüfen Default false trotz vorhandenem Sprachwert, explizite Bestätigung, Reload-Persistenz, boolesche Validierung und die Migration eines global bestätigten Legacy-Helpers.
