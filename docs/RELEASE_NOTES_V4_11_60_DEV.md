# V4.11.60 DEV – Android-Standortliste scrollt zuverlässig

Datum: 12.10.2026; Basis: V4.11.59 DEV (`d8a4b8e42a21ccdc9d548b1ad9d308991a876b45`).

**Video/Android:** In Standard und Groß springt die Standortliste beim Wischen nach oben, sodass tiefere gespeicherte und zur Löschung vorgesehene Orte nicht erreichbar sind. Im Vollbild ist die Liste besonders gestört.

**Korrektur:** Standortliste erhält einen eigenen nativen vertikalen Wischbereich mit begrenztem Scroll-Überlauf. Touch-/Zeiger-/Mausradereignisse werden nicht an die Karte durchgereicht. Bei aktiver Fingerbewegung beziehungsweise Nachlauf wird eine neue Listenpositionierung verhindert; anschließend und nach dem asynchronen Aktualisieren gespeicherter Orte wird die bisherige Scrollposition bewahrt. Keine Veränderung von Lösch-, Wiederherstellungs-, Standort- oder Kartengesten-Logik.

**Release:** V4.11.60 DEV, `41160r1`, `E411-60A1`, `ui.controls` 1.1.20, `core.manifest` 1.2.121, native Integration 0.25.0. Drei synchronisierte Frontends, DRA-Metadaten und Prüfwerte. Sonstige Module/Animationen/Wetterdaten unverändert.

CI und Browserregression vor DRA-Freigabe; Android-Realtest für Standard/Groß/Vollbild erforderlich.
