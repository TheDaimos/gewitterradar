const replaceOnce = (text, from, to) => {
  if (text.split(from).length !== 2) throw new Error(`V4.07 help anchor changed: ${from.slice(0, 120)}`);
  return text.replace(from, to);
};

const LOCATION_HELP_DE = {
  from: "        {key:'location',title:'Referenzstandort',paragraphs:['Der Referenzstandort bestimmt, von welchem Punkt aus Entfernungen und Richtungen berechnet werden. Gewitterradar erkennt person.*- und zone.*-Entitäten dynamisch. Ändert sich der Standort einer Person, werden Entfernungen auf Basis der aktuellen Home-Assistant-Daten neu bewertet.'],notes:['Ein falscher Referenzstandort führt zu falschen Entfernungen, Radien und Kompassrichtungen.']},",
  to: "        {key:'location',title:'Referenzstandort',paragraphs:['Der Referenzstandort bestimmt, von welchem Punkt aus Entfernungen und Richtungen berechnet werden. Für die weltweite Ortssuche verwendet die Dashboard-/Package-Variante von V4.07 device_tracker.gewitterradar_dashboard. Damit auch die Blitzdaten dem gewählten Ort folgen, muss Blitzortung selbst diesen Tracker als Standortquelle verfolgen. Wurde ein bestehender Blitzortung-Eintrag mit festen Breiten-/Längengraden angelegt, lässt er sich über „Neu konfigurieren“ nicht auf eine Standort-Entität umstellen: Lege einen neuen Blitzortung-Eintrag an, wähle die Standort-Entität und dort device_tracker.gewitterradar_dashboard. Prüfe den neuen Eintrag zuerst und deaktiviere oder lösche den alten Koordinaten-Eintrag erst danach. Stelle den Blitzortung-Erfassungsradius mindestens so groß wie den benötigten Gewitterradar-Beobachtungsradius, aber nicht unnötig groß ein; die Mindeststrecke für eine Standortaktualisierung durch Blitzortung hängt vom Erfassungsradius ab.'],notes:['„Nutzen“ setzt den aktuellen Gewitterradar-Bezugsstandort. „★ Speichern“ ist davon unabhängig und in der aktuellen V4.07-Teststufe noch nicht aktiv. Ein Kartenwechsel allein beweist nicht, dass Blitzortung seine Live-Datenregion bereits umgestellt hat. Bei der nativen Integration wird statt des Dashboard-Trackers device_tracker.gewitterradar verwendet.']},"
};

const LOCATION_HELP_EN = {
  from: "        {key:'location',title:'Reference location',paragraphs:[\"The reference location determines the point from which distances and directions are calculated. Gewitterradar detects person.* and zone.* entities dynamically. When a person's location changes, distances are recalculated from the current Home Assistant data.\"],notes:['An incorrect reference location leads to incorrect distances, radius evaluation and compass directions.']},",
  to: "        {key:'location',title:'Reference location',paragraphs:[\"The reference location determines the point from which distances and directions are calculated. In V4.07 the Dashboard/package delivery uses device_tracker.gewitterradar_dashboard for worldwide place search. For lightning data to follow the selected place, Blitzortung itself must track this entity as its location source. If an existing Blitzortung entry was created with fixed latitude/longitude values, Reconfigure cannot convert that entry to an entity-tracked location: create a new Blitzortung entry, choose the location entity and select device_tracker.gewitterradar_dashboard. Verify the new entry first and only then disable or remove the old fixed-coordinate entry. Set the Blitzortung detection radius at least as large as the required Gewitterradar observation radius, but avoid making it unnecessarily large; Blitzortung's minimum movement before updating a tracked location depends on that radius.\"],notes:['Use changes the current Gewitterradar reference location. ★ Save is independent of this and is not active yet in the current V4.07 test stage. A map move alone does not prove that Blitzortung has already moved its live-data region. The native integration uses device_tracker.gewitterradar instead of the Dashboard tracker.']},"
};

export function v407HelpNotesDelta(source) {
  let text = source;
  text = replaceOnce(text, LOCATION_HELP_DE.from, LOCATION_HELP_DE.to);
  text = replaceOnce(text, LOCATION_HELP_EN.from, LOCATION_HELP_EN.to);
  return text;
}
