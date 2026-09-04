# Gemeinsames Entwicklungswerkzeug-Repository

Für Wartung und Weiterentwicklung dieses Projekts existiert das zentrale private Entwicklungswerkzeug- und Wissens-Repository:

`TheDaimos/home-assistant-dev-toolkit`

## Verbindlicher Hinweis für künftige Chats, Codex und Maintainer

Bevor neue allgemeine Entwicklungs-, Diagnose-, Kalibrier-, Overlay-, Protokollierungs-, Ressourcen- oder Leistungstest-Funktionen für Gewitterradar gebaut oder neu entworfen werden, muss zuerst `TheDaimos/home-assistant-dev-toolkit` geprüft werden.

Dort können bereits fertige Werkzeuge, Protokolle, Adapter, Portabilitätsmuster, Regressionswissen oder bewusst verworfene Lösungswege vorhanden sein.

## Regeln

1. Allgemeine Dev-Logik möglichst aus dem Toolkit wiederverwenden statt sie in Gewitterradar zu duplizieren.
2. Gewitterradar-spezifische Entity-IDs, DOM-Selektoren, Assets, Kartenlogik und andere Anwendungsannahmen bleiben projektlokal oder in einem dünnen Adapter.
3. Allgemein nutzbare Verbesserungen und Erkenntnisse aus Gewitterradar sollen in das Toolkit zurückgeführt und dort dokumentiert werden.
4. Das Toolkit ist ausschließlich Entwicklungs-/Wissensbasis. Die veröffentlichte Anwendung darf keine Laufzeitabhängigkeit vom Toolkit-Repository besitzen.
5. Für mitgeführte Dev-Werkzeuge gilt: **DEV OFF = keine Dev-spezifische Hintergrundarbeit.** Versteckte Timer, RAF-Schleifen, Observer, Listener, Home-Assistant-Abos, Kalibrierungen oder Hintergrundmessungen sind nicht zulässig.
6. Leistungstests sollen die Produktionsanwendung möglichst unverfälscht messen: Dev-Zustand sichern, nicht benötigte Dev-Umgebung vollständig suspendieren, mit minimalem Messharness messen und anschließend exakt den vorherigen Zustand wiederherstellen.
7. Bestehende, bewährte lokale Werkzeuge nicht vorschnell entfernen. Zentralisierung erfolgt schrittweise und regressionssicher.
8. Wenn Toolkit-Code übernommen wird, nach Möglichkeit Toolkit-Version oder Commit dokumentieren.

Dieses Dokument ist ein dauerhafter Erinnerungsanker für neue Chat-/Codex-Sitzungen. Es ändert keine eingefrorene Release-Referenz und keine ausgelieferte `dist/`-Struktur, solange es nicht ausdrücklich in einen Release-Build einbezogen wird.
