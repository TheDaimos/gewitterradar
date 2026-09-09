# Erststart-Sprachwahl

Gewitterradar fragt beim ersten regulären Start zuerst nach der Sprache. Erst nach expliziter Bestätigung und erfolgreichem Schreiben der Sprache folgt das bisherige About-Onboarding. Karten-Vorschauen im Editor verbrauchen keinen Erststart; mehrere Karten zeigen nur einen Sprachdialog.

Die Vorauswahl verwendet `hass.locale.language`, ersatzweise `hass.language` aus dem Home-Assistant-Card-Kontext. Codes werden getrimmt, kleingeschrieben, Unterstriche in Bindestriche umgewandelt und auf den Sprachanteil reduziert. Hauptsprachen werden ausschließlich aus `LANGUAGE_DEFINITIONS` zugeordnet; `no` wird auf `nb` normalisiert. Deutsch einschließlich de-DE/de-AT/de-CH ergibt immer Deutsch. Nicht unterstützte oder fehlende Angaben ergeben English. Die vier deutschen Dialekte sind nur manuell wählbar.

Die Bestätigung verwendet wie die bestehende Einstellung `_languageEntity()` und `_selectSetting()` (`select.select_option` oder `input_select.select_option`), einschließlich expliziter Card-Overrides. Die bestehende vorübergehende `_languagePreview` überbrückt HA-Zustandsupdates. Es gibt keinen zweiten persistenten Sprachwert.

`gewitterradar-language-onboarding-version = 1` speichert ausschließlich die erfolgreiche ausdrückliche Bestätigung. Ein technischer Default English gilt ohne diesen Marker nicht als bestätigt. Auch bestehende Installationen ohne Marker erhalten die einmalige Abfrage. Der bisherige Key `gewitterradar-about-onboarding-version` bleibt unabhängig: Bereits bestätigtes About wird nicht wiederholt, noch offenes About folgt der Sprachwahl.

Nach der Bestätigung wird die HA-Oberflächensprache nicht mehr zur Übernahme ausgewertet. Die produktive Gewitterradar-Sprachentität hat Vorrang; Änderungen bleiben über die normalen Einstellungen möglich. Der Marker gilt pro Browser-Origin; ein anderes Gerät/Browserprofil hat seinen eigenen Erststart. Ist Local Storage gesperrt, gilt die Bestätigung nur für die laufende Seite; nach einem Neuladen kann sie erneut erforderlich sein. Fehlende/unverfügbare Sprachentität oder Servicefehler zeigen eine wiederholbare Fehlermeldung und setzen keinen Marker.

Der native modale Dialog ist ohne X und ohne Escape-Abbruch, unterstützt Radio-Tastaturbedienung, Fokusumlauf, sichtbaren Fokus und eine scrollbare Sprachliste auf kleinen Touch-Geräten. Keine freigegebenen Assets oder About-Geometrie werden verändert.

## Übergang in Phase 1

Die bestätigte Sprache steht vor dem Öffnen von About über den bestehenden Sprachmechanismus bereit. About besitzt derzeit nur Deutsch und Englisch; die übrigen 17 Varianten verwenden weiterhin den bestehenden englischen About-Fallback, die Widmung bleibt dort vorerst Deutsch. Phase 1 fügt keine neuen About-Übersetzungen hinzu.

## Prüfungen

`node scripts/test-language-onboarding.cjs <chromium> [output-directory]` prüft beide Auslieferungen: Locale-Zuordnung, manuelle Wahl, ausdrückliches English, Bestätigung erst nach Serviceerfolg, Neustart, spätere HA-Sprachänderung, About-Reihenfolge, native/Legacy/Override-Schreibwege, Fehler und Retry, Vorschau und Mehrkartenverhalten, Tastatur, Escape und alle 19 Einträge auf einem 320px-Touch-Viewport.

Die bestehenden About-/Layout-Harnesses setzen den Sprachmarker als Vorbedingung für ihre unveränderten Prüfungen nach der Sprachbestätigung. Frozen-Fixture, Golden-Masken und Geometrietoleranzen bleiben unverändert. Die gemeinsame Quelle wird über die explizite `language-onboarding-delta.mjs`-Erweiterung der bestehenden Build-Delta-Vorgabe abgesichert und identisch in Integration und Dashboard ausgeliefert.

HA-Referenz: https://github.com/home-assistant/frontend/blob/dev/src/types.ts (`HomeAssistantInternationalization`).