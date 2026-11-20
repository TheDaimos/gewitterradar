# GR 4.11.232 DEV · Eye Menü und Gewitter-Schließen

**Paketquellcommit** `f547e7ef87c85ae30e1913068b6b27f1dc4bfad9` · **HA** `0.25.139` · **Runtime** `411232r1` · **Modulset** `E411-232A1`.

Ausgangsstand war GR 4.11.231 DEV (`acc0cfd3`), geprüft gegen WR `2b38696a`. Das Gewittermenü verwendet jetzt dasselbe runde X wie das Eye Menü. Jeder belegte Slot zeigt „Aktiv“ oder „Inaktiv“ für seine Aura. „Aktiv“ gibt die Aura für die verfügbare, aktive Funktion frei, wenn die globale Aura eingeschaltet ist und eine Aura-Farbe gesetzt ist. Die Auswahl und das Farbmenü verwenden denselben Profilwert.

Chromium prüfte mit Touch bei 393 × 851 CSS-Pixeln Standardansicht und Vollbild, einschließlich Menüname, Aura-Vorschau an/aus, unabhängigem Wind-/Gewitterwert, Slot-Zuweisung, rundem X nach langem Tipp und Wiederherstellung nach Reload. Paketparität, Runtime-Identität, sieben Vault-Client-Tests und der DRA-Vertrag bestanden. Der historische Snapshot-Vergleich für `consumer-client.js` meldet denselben Fehler wie in 4.11.231. Der Quellvergleich bestätigt ausschließlich Cache- und Modulversionsänderungen außerhalb der drei betroffenen Runtime-Dateien.

Die Installation und reale Geräteabnahme auf DEV VM109 stehen aus. [DRA-Quelle `deploy/dev`](https://github.com/TheDaimos/gewitterradar/tree/deploy/dev) · [DEV-Pakete und SHA-256](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.11.232-dev)
