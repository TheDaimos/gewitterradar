/**
 * P7-010: providerneutrale Gewitterradar-Intents.
 *
 * Bewusst ohne UI-Registrierung oder automatische Aktivierung. Der bestehende
 * Blitzortung-/Trackerpfad und der Niederschlags-Renderer bleiben unangetastet.
 * Der übergebene Consumer-Client verantwortet Discovery, Profile und Resolve.
 */
const freezeIntent = (capability, resourceType, contexts, eventHazardTypes = null) =>
  Object.freeze({
    capability, resourceType, contexts: Object.freeze([...contexts]),
    eventHazardTypes: eventHazardTypes ? Object.freeze([...eventHazardTypes]) : null
  });

const spatial = ["point", "bbox", "global"];
export const GEWITTERRADAR_ROUTING_INTENTS = Object.freeze({
  precipitation: freezeIntent("weather.precipitation.layer", "raster_tile", ["bbox"]),
  officialThunderWarnings: freezeIntent("weather.warning.official", "hazard_feed", spatial, ["severe_thunderstorm", "lightning"]),
  officialHailWarnings: freezeIntent("weather.warning.official", "hazard_feed", spatial, ["hail"]),
  officialTornadoWarnings: freezeIntent("weather.warning.official", "hazard_feed", spatial, ["tornado", "waterspout"]),
  officialWindWarnings: freezeIntent("weather.warning.official", "hazard_feed", spatial, ["downburst", "windstorm"]),
  officialHeavyRainWarnings: freezeIntent("weather.warning.official", "hazard_feed", spatial, ["heavy_rain", "flash_flood"]),
  observedLightningEvents: freezeIntent("weather.lightning.observed.events", "event_feed", spatial),
  observedLightningDensity: freezeIntent("weather.lightning.observed.density", "raster_tile", ["bbox"]),
  thunderstormCells: freezeIntent("weather.convection.thunderstorm_cells", "raster_tile", ["bbox"]),
  thunderProbability: freezeIntent("weather.point.thunder_probability", "value", ["point"])
});

const unavailable = (code, message) => ({
  status: "unavailable",
  unavailable: {code, message, retryable: false}
});

/**
 * Liefert den unveränderten, vom WeatherRouter bereits validierten Datenvertrag,
 * niemals lokale Blitzmarker und niemals selbst gewählte Provider.
 */
export async function resolveGewitterradarIntent(client, intentKey, context, {requirements} = {}) {
  if (!client || typeof client.resolve !== "function") {
    throw new TypeError("Consumer V1 resolver is required");
  }
  const spec = GEWITTERRADAR_ROUTING_INTENTS[intentKey];
  if (!spec) return unavailable("unsupported_intent", "Unbekannter fachlicher Intent");
  if (!context || !spec.contexts.includes(context.type)) {
    return unavailable("unsupported_context", "Dieser räumliche Kontext ist für den Intent nicht geeignet");
  }
  const options = {};
  if (requirements !== undefined) options.requirements = requirements;
  if (spec.eventHazardTypes) {
    options.eventFilter = {hazard_types: [...spec.eventHazardTypes]};
  }
  let answer;
  try {
    answer = await client.resolve(spec.capability, context, options);
  } catch {
    return unavailable("resolver_error", "Providerneutrale Anfrage konnte nicht abgeschlossen werden");
  }
  if (!answer || typeof answer !== "object") {
    return unavailable("invalid_response", "Keine gültige Consumer-Antwort");
  }
  if (answer.status !== "ready") return answer; // unavailable/profile_filtered unverändert
  if (answer.capability !== spec.capability || answer.resource?.type !== spec.resourceType) {
    return unavailable("resource_type_mismatch", "Antwort entspricht nicht dem angeforderten Ressourcenvertrag");
  }
  return {...answer, intentKey};
}
