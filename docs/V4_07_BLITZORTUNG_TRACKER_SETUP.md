# V4.07 – Gewitterradar-Tracker und Blitzortung-Einrichtung

Stand: 2026-09-12 · **Testkandidat, noch kein Release**

## Ziel

V4.07 trennt den vom Benutzer gewählten Gewitterradar-Bezugsstandort vom geografischen Bereich, aus dem Blitzortung aktuell Live-Daten empfängt. Ein Suchort darf nicht als korrekte Live-Lage dargestellt werden, wenn die Blitzdaten noch zu einem anderen Gebiet gehören.

Der bevorzugte Kopplungsweg ist ein Gewitterradar-eigener GPS-Tracker, dem Blitzortung nach einer einmaligen Einrichtung folgen kann.

## Tracker je Auslieferungsform

### Native Integration

Gewitterradar stellt einen modernen Home-Assistant-`device_tracker` bereit. Der gewünschte Standardname ist:

```text
device_tracker.gewitterradar
```

Falls Home Assistant wegen einer bestehenden Entity einen abweichenden Entity-ID-Suffix vergibt, ist die tatsächlich erzeugte Entity maßgeblich. Gewitterradar verwendet intern diese tatsächliche Entity-ID.

### Dashboard-Package

Das Package stellt bewusst einen anderen Tracker bereit:

```text
device_tracker.gewitterradar_dashboard
```

Dadurch beanspruchen native Integration und Dashboard-Auslieferungsform nicht absichtlich dieselbe Entity-ID, wenn sie auf einem Testsystem parallel vorhanden sind.

## Einmalige Blitzortung-Einrichtung

Die aktuelle Blitzortung-Integration unterstützt beim Anlegen einen `device_tracker`, `person` oder `zone` als Standortquelle. Ihr heutiger Reconfigure-Flow kann einen bestehenden Koordinaten-Eintrag jedoch nicht offiziell auf eine Entity-Quelle umstellen.

Darum gilt bis zu einer möglichen Upstream-Erweiterung:

1. Gewitterradar erzeugt seinen eigenen Tracker und initialisiert ihn mit dem bisherigen Home-Standort.
2. Gewitterradar erkennt Blitzortung und zeigt an, ob der eigene Tracker bereits als Standortquelle verwendet wird.
3. Falls nicht, führt die Oberfläche den Benutzer einmalig zur notwendigen Blitzortung-Konfiguration.
4. Der Benutzer richtet Blitzortung auf den passenden Gewitterradar-Tracker ein.
5. Danach ändern Ortswechsel nur noch die Koordinaten des Gewitterradar-Trackers; Blitzortung folgt diesen Änderungen selbstständig nach ihrer eigenen Logik.

Gewitterradar verändert **niemals** den ConfigEntry von Blitzortung, schreibt nicht in `.storage` und verwendet keine privaten Home-Assistant-APIs.

## Native Koordinaten setzen

Der V4.07-Testkandidat stellt den Service bereit:

```yaml
action: gewitterradar.set_reference_coordinates
data:
  latitude: 69.6492
  longitude: 18.9553
  name: Tromsø
```

Der Service:

- setzt nur die Gewitterradar-eigenen Tracker-Koordinaten;
- setzt den Gewitterradar-eigenen Tracker als aktuellen Bezugsstandort;
- verändert keine fremde Integration.

Der native Tracker stellt zusätzlich Diagnoseattribute bereit:

```text
installed
linked
setup_required
matching_entries
tracker_entity_id
reference_name
```

Diese Attribute sind im Testkandidaten bewusst Diagnosewerte und noch keine endgültige öffentliche Produktschnittstelle.

## Dashboard-Koordinaten setzen

Das V4.07-Package stellt bereit:

```text
script.gewitterradar_set_reference_coordinates_dashboard
```

Beispiel:

```yaml
action: script.gewitterradar_set_reference_coordinates_dashboard
data:
  latitude: 69.6492
  longitude: 18.9553
  name: Tromsø
```

Das Script aktualisiert den Dashboard-Tracker und wählt ihn als Bezugsstandort aus. Auch dieser Weg verändert Blitzortung nicht direkt.

## Wichtige Blitzortung-Eigenschaft

Blitzortung ignoriert absichtlich kleine Änderungen seiner Standort-Entity, um nicht bei jeder Bewegung MQTT-Abonnements neu aufzubauen. Die aktuelle Schwelle beträgt 25 % des konfigurierten Blitzortung-Radius.

Beispiele:

```text
Blitzortung-Radius 100 km  → Bewegungsschwelle 25 km
Blitzortung-Radius 400 km  → Bewegungsschwelle 100 km
```

Darum müssen in Gewitterradar dauerhaft zwei Zustände getrennt bleiben:

1. **Bezugsstandort** – Karte, Radien, Entfernungen, Kompass und Bewertung.
2. **Aktiver Blitzdatenbereich** – Gebiet, aus dem die aktuelle Blitzortung-Subscription tatsächlich Daten liefert.

Ein Tracker-Update allein darf nicht automatisch als Beweis für bereits synchronisierte Blitzdaten gelten.

## Abdeckungsprüfung

Für einen späteren Hinweisdialog kann Gewitterradar prüfen, ob ein gewählter Ort noch vollständig innerhalb des aktuellen Datenbereichs liegt. Als konservative geometrische Bedingung gilt:

```text
Entfernung(aktives Blitzdatenzentrum, neuer Bezugsort)
+ benötigter Gewitterradar-Auswertungsradius
<= Blitzortung-Abonnementradius
```

Nur wenn Mittelpunkt und Radius des tatsächlich aktiven Blitzdatenbereichs zuverlässig über eine unterstützte Schnittstelle bekannt sind, darf daraus ein grüner/gelber/roter Synchronisationsstatus abgeleitet werden.

## Offener Upstream-Punkt

Projekt-To-do: Entwickler von `mrk-its/homeassistant-blitzortung` kontaktieren und einen offiziellen Reconfigure-Wechsel zwischen festen Koordinaten und Standort-Entity anregen. Bis dahin bleibt die einmalige Benutzeraktion Teil der V4.07-Zielarchitektur.
