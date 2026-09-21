// Gewitterradar external About/Help locales
// V4.09.23 – Help & Notes synchronized with the current DE/EN master for all 17 external language variants.
// Deutsch and English intentionally remain embedded in gewitterradar-v4.09.23.js.

export const ABOUT_EXTERNAL_LOCALES = {
  "Dansk": {
    "strings": {
      "title": "Om Gewitterradar",
      "close": "Luk",
      "understood": "Forstået",
      "subtitle": "For vejrentusiaster, der vil følge lynaktivitet klart og letforståeligt.",
      "claim": "Følg tordenvejr, opdag udviklingen.",
      "welcome": "Velkommen, vejrentusiaster!",
      "intro": "Dette projekt er for alle, der er fascineret af tordenvejr, lyn, vejrfænomener og den fascinerende dynamik i vores atmosfære. Gewitterradar hjælper dig med bedre at forstå naturen, opdage udviklinger tidligt og observere dem med respekt. Dejligt, at du er en del af dette fællesskab!",
      "quote": "Tordenvejr viser, hvor kraftfuld atmosfæren kan være.",
      "radii": "De tre radier",
      "radiiTagline": "Tre områder. Ét klart overblik.",
      "schematic": "Skematisk visning af radierne, ikke målfast",
      "observation": "Tidlig observation af fjerne tordenvejr i det større område.",
      "storm": "Nærmere tordenvejrsaktivitet, som kræver øget opmærksomhed.",
      "danger": "Umiddelbar nærzone med særlig kritisk betydning.",
      "radiusInfo": "Radierne hjælper dig med at vurdere tordenvejr tidligt og få et hurtigt og klart overblik over den aktuelle situation. Radierne bygger på hinanden: Et lyn inden for fareradiusen tæller også med i tordenvejrsradiusen og observationsradiusen.",
      "thanks": "Tak til Blitzortung.org",
      "network": "En særlig tak går til Blitzortung.org og dets verdensomspændende fællesskab af frivillige stationsoperatører. Gewitterradar bruger lyndata, som stilles til rådighed af dette fællesskabsdrevne lokaliseringsnetværk.",
      "recorder": "Vigtig bemærkning om Home Assistant Recorder",
      "recorderText": "For at begrænse væksten i databasen anbefaler vi kraftigt at udelukke disse fire kilder fra Recorder i configuration.yaml. Tilføj dem til en eksisterende recorder:-sektion – opret ikke en anden blok på topniveau. Live-tilstande forbliver tilgængelige.",
      "recorderBenefit": "Mindre data.\nEt slankere system.\nTil langvarig drift.",
      "copy": "Kopiér YAML",
      "copied": "Kopieret",
      "copyFailed": "Kopiering er ikke mulig – markér venligst koden.",
      "later": "Se igen senere",
      "merge": "Hvis der allerede findes en recorder:-sektion, skal du integrere posterne dér. Opret IKKE en anden recorder:-blok på topniveau.",
      "live": "Udelukkelse fra Recorder deaktiverer IKKE live-tilstandene for Gewitterradar. Eksisterende historiske data fjernes ikke automatisk.",
      "entities": "Anvendte entiteter og funktioner",
      "entitiesSubtitle": "En oversigt over alle anvendte entiteter og deres funktioner.",
      "native": "Native Gewitterradar-konfiguration",
      "sourceNative": "Native",
      "legacy": "Legacy-fallback / kompatibilitet",
      "legacyPurpose": "Bruges kun som kompatibilitets-fallback.",
      "locationPerson": "Giver valgbare personplaceringer.",
      "locationZone": "Giver valgbare zoner som referenceplaceringer.",
      "legacyText": "De eksisterende lightning_detection_* hjælpere bruges af hensyn til kompatibilitet. De er ikke nødvendige for en ny native installation.",
      "resolved": "Aktuelt anvendt",
      "available": "tilgængelig",
      "unavailable": "ikke tilgængelig",
      "override": "Kortkonfiguration",
      "sources": "Lyndatakilder",
      "locations": "Placeringskilder",
      "dynamic": "person.* og zone.* registreres dynamisk.",
      "dedicationTitle": "Til Alkje",
      "dedicationText": "Tak, fordi du giver mig tiden til at følge mine interesser og min begejstring for teknik, vejr og alle idéerne derimellem – og til at hellige mig projekter som Gewitterradar med så meget glæde og vedholdenhed.",
      "footer": "Kan til enhver tid åbnes igen under Indstillinger → Om Gewitterradar."
    },
    "settingLabels": {
      "language": "Sprog",
      "distance_unit": "Afstandsenhed",
      "compass_design": "Kompasdesign",
      "reference_location": "Referenceplacering",
      "observation_radius": "Observationsradius",
      "storm_radius": "Tordenvejrsradius",
      "danger_radius": "Fareradius",
      "aura_width": "Aura-bredde",
      "aura_intensity": "Aura-intensitet",
      "aura_effects": "Aura-effekter",
      "warning_animation": "Advarselsanimation",
      "storm_simulation": "Tordenvejrssimulering",
      "show_location_selector": "Placeringsvalg",
      "compass_nearest_strike": "Kompas: nærmeste lyn",
      "compass_device_orientation": "Enhedsorientering",
      "map_grouping": "Kortgruppering"
    },
    "settingPurposes": {
      "language": "Vælger kortets sprog.",
      "distance_unit": "Angiver KM eller MI.",
      "compass_design": "Vælger kompasdesign.",
      "reference_location": "Angiver referenceplaceringen.",
      "observation_radius": "Angiver det ydre observationsområde.",
      "storm_radius": "Definerer området med øget tordenvejrsaktivitet.",
      "danger_radius": "Definerer det umiddelbare fareområde.",
      "aura_width": "Styrer bredden af aura-effekten.",
      "aura_intensity": "Styrer intensiteten af aura-effekten.",
      "aura_effects": "Slår aura-effekter til eller fra.",
      "warning_animation": "Aktiverer advarselsanimationen.",
      "storm_simulation": "Aktiverer tordenvejrssimuleringen.",
      "show_location_selector": "Tillader valg af placering.",
      "compass_nearest_strike": "Retter kompasset mod det nærmeste lyn.",
      "compass_device_orientation": "Bruger enhedens orientering.",
      "map_grouping": "Grupperer nærliggende lyn på kortet."
    },
    "sourcePurposes": {
      "geo_location.lightning_strike*": "Leverer individuelle lynpositioner.",
      "sensor.*_lightning_distance": "Leverer afstanden til det seneste lyn.",
      "sensor.*_lightning_azimuth": "Leverer retningen til det seneste lyn.",
      "sensor.*_lightning_counter": "Tæller registrerede lynhændelser."
    }
  },
  "Español": {
    "strings": {
      "title": "Acerca de Gewitterradar",
      "close": "Cerrar",
      "understood": "Entendido",
      "subtitle": "Para aficionados a la meteorología que quieren seguir la actividad eléctrica de forma clara y comprensible.",
      "claim": "Observa las tormentas, descubre su evolución.",
      "welcome": "¡Bienvenidos, aficionados a la meteorología!",
      "intro": "Este proyecto es para todos los que sienten fascinación por las tormentas, los rayos, los fenómenos meteorológicos y la fascinante dinámica de nuestra atmósfera. Gewitterradar te ayuda a comprender mejor la naturaleza, reconocer los cambios con antelación y observarlos con respeto. ¡Nos alegra que formes parte de esta comunidad!",
      "quote": "Las tormentas revelan lo poderosa que puede ser la atmósfera.",
      "radii": "Los tres radios",
      "radiiTagline": "Tres zonas. Una visión clara.",
      "schematic": "Representación esquemática de los radios, no a escala",
      "observation": "Observación temprana de tormentas lejanas en un área más amplia.",
      "storm": "Actividad tormentosa más cercana que requiere mayor atención.",
      "danger": "Entorno inmediato con especial relevancia crítica.",
      "radiusInfo": "Los radios te ayudan a evaluar las tormentas con antelación y a comprender la situación actual de forma rápida y clara. Los radios son acumulativos: un rayo dentro del radio de peligro también cuenta dentro del radio de tormenta y del radio de observación.",
      "thanks": "Gracias a Blitzortung.org",
      "network": "Un agradecimiento especial a Blitzortung.org y a su comunidad mundial de operadores voluntarios de estaciones. Gewitterradar utiliza datos de rayos proporcionados por esta red de detección gestionada por la comunidad.",
      "recorder": "Nota importante sobre Home Assistant Recorder",
      "recorderText": "Para limitar el crecimiento de la base de datos, recomendamos encarecidamente excluir estas cuatro fuentes de Recorder en configuration.yaml. Añádelas a una sección recorder: existente – no crees un segundo bloque de nivel superior. Los estados en tiempo real seguirán disponibles.",
      "recorderBenefit": "Menos datos.\nUn sistema más ligero.\nPara un funcionamiento a largo plazo.",
      "copy": "Copiar YAML",
      "copied": "Copiado",
      "copyFailed": "No se puede copiar – selecciona el código.",
      "later": "Volver a ver más tarde",
      "merge": "Si ya existe una sección recorder:, integra estas entradas allí. NO crees un segundo bloque recorder: de nivel superior.",
      "live": "La exclusión de Recorder NO desactiva los estados en tiempo real de Gewitterradar. Los datos históricos existentes no se eliminan automáticamente.",
      "entities": "Entidades y funciones utilizadas",
      "entitiesSubtitle": "Una visión general de todas las entidades utilizadas y sus funciones.",
      "native": "Configuración nativa de Gewitterradar",
      "sourceNative": "Nativa",
      "legacy": "Compatibilidad / alternativa heredada",
      "legacyPurpose": "Se utiliza únicamente como alternativa de compatibilidad.",
      "locationPerson": "Proporciona ubicaciones de personas seleccionables.",
      "locationZone": "Proporciona zonas seleccionables como ubicaciones de referencia.",
      "legacyText": "Los helpers lightning_detection_* existentes se mantienen por compatibilidad. No son necesarios para una instalación nativa nueva.",
      "resolved": "Actualmente utilizado",
      "available": "disponible",
      "unavailable": "no disponible",
      "override": "Configuración de la tarjeta",
      "sources": "Fuentes de datos de rayos",
      "locations": "Fuentes de ubicación",
      "dynamic": "person.* y zone.* se detectan dinámicamente.",
      "dedicationTitle": "Para Alkje",
      "dedicationText": "Gracias por darme el tiempo para seguir mis intereses y mi entusiasmo por la tecnología, la meteorología y todas las ideas que hay entre ambos – y para dedicarme a proyectos como Gewitterradar con tanta alegría y perseverancia.",
      "footer": "Disponible en cualquier momento en Ajustes → Acerca de Gewitterradar."
    },
    "settingLabels": {
      "language": "Idioma",
      "distance_unit": "Unidad de distancia",
      "compass_design": "Diseño de la brújula",
      "reference_location": "Ubicación de referencia",
      "observation_radius": "Radio de observación",
      "storm_radius": "Radio de tormenta",
      "danger_radius": "Radio de peligro",
      "aura_width": "Anchura del aura",
      "aura_intensity": "Intensidad del aura",
      "aura_effects": "Efectos de aura",
      "warning_animation": "Animación de aviso",
      "storm_simulation": "Simulación de tormenta",
      "show_location_selector": "Selección de ubicación",
      "compass_nearest_strike": "Brújula: rayo más cercano",
      "compass_device_orientation": "Orientación del dispositivo",
      "map_grouping": "Agrupación del mapa"
    },
    "settingPurposes": {
      "language": "Selecciona el idioma de la tarjeta.",
      "distance_unit": "Establece KM o MI.",
      "compass_design": "Selecciona el diseño de la brújula.",
      "reference_location": "Establece la ubicación de referencia.",
      "observation_radius": "Establece el área exterior de observación.",
      "storm_radius": "Define el área de mayor actividad tormentosa.",
      "danger_radius": "Define el área de peligro inmediato.",
      "aura_width": "Controla la anchura del efecto de aura.",
      "aura_intensity": "Controla la intensidad del efecto de aura.",
      "aura_effects": "Activa o desactiva los efectos de aura.",
      "warning_animation": "Activa la animación de aviso.",
      "storm_simulation": "Activa la simulación de tormenta.",
      "show_location_selector": "Permite seleccionar una ubicación.",
      "compass_nearest_strike": "Orienta la brújula hacia el rayo más cercano.",
      "compass_device_orientation": "Utiliza la orientación del dispositivo.",
      "map_grouping": "Agrupa los rayos cercanos en el mapa."
    },
    "sourcePurposes": {
      "geo_location.lightning_strike*": "Proporciona posiciones individuales de rayos.",
      "sensor.*_lightning_distance": "Proporciona la distancia al último rayo.",
      "sensor.*_lightning_azimuth": "Proporciona la dirección del último rayo.",
      "sensor.*_lightning_counter": "Cuenta los eventos de rayos detectados."
    }
  },
  "Français": {
    "strings": {
      "title": "À propos de Gewitterradar",
      "close": "Fermer",
      "understood": "Compris",
      "subtitle": "Pour les passionnés de météo qui souhaitent suivre l’activité électrique de manière claire et compréhensible.",
      "claim": "Observer les orages, découvrir leur évolution.",
      "welcome": "Bienvenue aux passionnés de météo !",
      "intro": "Ce projet s’adresse à toutes celles et ceux qui sont fascinés par les orages, la foudre, les phénomènes météorologiques et la dynamique fascinante de notre atmosphère. Gewitterradar aide à mieux comprendre la nature, à reconnaître les évolutions suffisamment tôt et à les observer avec respect. Nous sommes heureux de vous compter parmi cette communauté !",
      "quote": "Les orages révèlent à quel point l’atmosphère peut être puissante.",
      "radii": "Les trois rayons",
      "radiiTagline": "Trois zones. Une vue claire.",
      "schematic": "Représentation schématique des rayons, non à l’échelle",
      "observation": "Observation précoce des orages éloignés dans une zone étendue.",
      "storm": "Activité orageuse plus proche nécessitant une attention accrue.",
      "danger": "Zone immédiate présentant un caractère particulièrement critique.",
      "radiusInfo": "Les rayons permettent d’évaluer les orages suffisamment tôt et de comprendre rapidement et clairement la situation actuelle. Ils sont cumulatifs : un impact de foudre situé dans le rayon de danger est également comptabilisé dans le rayon d’orage et le rayon d’observation.",
      "thanks": "Merci à Blitzortung.org",
      "network": "Un grand merci à Blitzortung.org et à sa communauté mondiale d’opérateurs de stations bénévoles. Gewitterradar utilise les données de foudre fournies par ce réseau de détection exploité par la communauté.",
      "recorder": "Remarque importante concernant Home Assistant Recorder",
      "recorderText": "Pour limiter la croissance de la base de données, nous recommandons vivement d’exclure ces quatre sources du Recorder dans configuration.yaml. Ajoutez-les à une section recorder: existante – ne créez pas de second bloc de premier niveau. Les états en temps réel restent disponibles.",
      "recorderBenefit": "Moins de données.\nUn système plus léger.\nPour un fonctionnement à long terme.",
      "copy": "Copier le YAML",
      "copied": "Copié",
      "copyFailed": "Copie indisponible – veuillez sélectionner le code.",
      "later": "Revoir plus tard",
      "merge": "Si une section recorder: existe déjà, intégrez-y ces entrées. Ne créez PAS de second bloc recorder: de premier niveau.",
      "live": "L’exclusion du Recorder ne désactive PAS les états en temps réel de Gewitterradar. Les données historiques existantes ne sont pas supprimées automatiquement.",
      "entities": "Entités et fonctions utilisées",
      "entitiesSubtitle": "Vue d’ensemble de toutes les entités utilisées et de leurs fonctions.",
      "native": "Configuration native de Gewitterradar",
      "sourceNative": "Native",
      "legacy": "Compatibilité / solution de repli héritée",
      "legacyPurpose": "Utilisée uniquement comme solution de repli pour la compatibilité.",
      "locationPerson": "Fournit des emplacements de personnes sélectionnables.",
      "locationZone": "Fournit des zones sélectionnables comme emplacements de référence.",
      "legacyText": "Les helpers lightning_detection_* existants sont conservés pour assurer la compatibilité. Ils ne sont pas nécessaires pour une nouvelle installation native.",
      "resolved": "Actuellement utilisé",
      "available": "disponible",
      "unavailable": "indisponible",
      "override": "Configuration de la carte",
      "sources": "Sources de données de foudre",
      "locations": "Sources de localisation",
      "dynamic": "person.* et zone.* sont détectés dynamiquement.",
      "dedicationTitle": "Pour Alkje",
      "dedicationText": "Merci de me laisser le temps de suivre mes intérêts et ma passion pour la technique, la météo et toutes les idées qui se trouvent entre les deux – et de me consacrer à des projets comme Gewitterradar avec autant de plaisir et de persévérance.",
      "footer": "Accessible à tout moment sous Paramètres → À propos de Gewitterradar."
    },
    "settingLabels": {
      "language": "Langue",
      "distance_unit": "Unité de distance",
      "compass_design": "Design de la boussole",
      "reference_location": "Emplacement de référence",
      "observation_radius": "Rayon d’observation",
      "storm_radius": "Rayon d’orage",
      "danger_radius": "Rayon de danger",
      "aura_width": "Largeur de l’aura",
      "aura_intensity": "Intensité de l’aura",
      "aura_effects": "Effets d’aura",
      "warning_animation": "Animation d’avertissement",
      "storm_simulation": "Simulation d’orage",
      "show_location_selector": "Sélection de l’emplacement",
      "compass_nearest_strike": "Boussole : impact le plus proche",
      "compass_device_orientation": "Orientation de l’appareil",
      "map_grouping": "Regroupement sur la carte"
    },
    "settingPurposes": {
      "language": "Sélectionne la langue de la carte.",
      "distance_unit": "Définit KM ou MI.",
      "compass_design": "Sélectionne le design de la boussole.",
      "reference_location": "Définit l’emplacement de référence.",
      "observation_radius": "Définit la zone d’observation extérieure.",
      "storm_radius": "Définit la zone d’activité orageuse accrue.",
      "danger_radius": "Définit la zone de danger immédiat.",
      "aura_width": "Contrôle la largeur de l’effet d’aura.",
      "aura_intensity": "Contrôle l’intensité de l’effet d’aura.",
      "aura_effects": "Active ou désactive les effets d’aura.",
      "warning_animation": "Active l’animation d’avertissement.",
      "storm_simulation": "Active la simulation d’orage.",
      "show_location_selector": "Permet la sélection d’un emplacement.",
      "compass_nearest_strike": "Oriente la boussole vers l’impact de foudre le plus proche.",
      "compass_device_orientation": "Utilise l’orientation de l’appareil.",
      "map_grouping": "Regroupe les impacts proches sur la carte."
    },
    "sourcePurposes": {
      "geo_location.lightning_strike*": "Fournit les positions individuelles des impacts de foudre.",
      "sensor.*_lightning_distance": "Fournit la distance jusqu’au dernier impact de foudre.",
      "sensor.*_lightning_azimuth": "Fournit la direction du dernier impact de foudre.",
      "sensor.*_lightning_counter": "Compte les événements de foudre détectés."
    }
  },
  "Nederlands": {
    "strings": {
      "title": "Over Gewitterradar",
      "close": "Sluiten",
      "understood": "Begrepen",
      "subtitle": "Voor weerliefhebbers die bliksemactiviteit helder en begrijpelijk willen volgen.",
      "claim": "Onweer volgen, ontwikkelingen ontdekken.",
      "welcome": "Welkom, weerliefhebbers!",
      "intro": "Dit project is voor iedereen die gefascineerd is door onweer, bliksem, weersverschijnselen en de fascinerende dynamiek van onze atmosfeer. Gewitterradar helpt je de natuur beter te begrijpen, ontwikkelingen vroeg te herkennen en ze met respect te observeren. Fijn dat je deel uitmaakt van deze gemeenschap!",
      "quote": "Onweer laat zien hoe krachtig de atmosfeer kan zijn.",
      "radii": "De drie radiussen",
      "radiiTagline": "Drie gebieden. Eén duidelijk overzicht.",
      "schematic": "Schematische weergave van de radiussen, niet op schaal",
      "observation": "Vroege observatie van onweer op grotere afstand in de ruimere omgeving.",
      "storm": "Nabijere onweersactiviteit die extra aandacht vereist.",
      "danger": "Directe omgeving met bijzonder kritieke betekenis.",
      "radiusInfo": "De radiussen helpen je om onweer vroeg in te schatten en de actuele situatie snel en duidelijk te begrijpen. De radiussen zijn cumulatief: een blikseminslag binnen de gevarenradius telt ook mee binnen de onweersradius en observatieradius.",
      "thanks": "Dank aan Blitzortung.org",
      "network": "Speciale dank gaat uit naar Blitzortung.org en zijn wereldwijde gemeenschap van vrijwillige stationbeheerders. Gewitterradar gebruikt bliksemgegevens die door dit door de gemeenschap beheerde detectienetwerk beschikbaar worden gesteld.",
      "recorder": "Belangrijke opmerking over Home Assistant Recorder",
      "recorderText": "Om groei van de database te beperken, raden we sterk aan deze vier bronnen in configuration.yaml van Recorder uit te sluiten. Voeg ze toe aan een bestaande recorder:-sectie – maak geen tweede blok op het hoogste niveau. Live-statussen blijven beschikbaar.",
      "recorderBenefit": "Minder gegevens.\nEen slanker systeem.\nVoor langdurig gebruik.",
      "copy": "YAML kopiëren",
      "copied": "Gekopieerd",
      "copyFailed": "Kopiëren niet mogelijk – selecteer de code.",
      "later": "Later opnieuw bekijken",
      "merge": "Als er al een recorder:-sectie bestaat, voeg deze items daar dan aan toe. Maak GEEN tweede recorder:-blok op het hoogste niveau.",
      "live": "Uitsluiting van Recorder schakelt de live-statussen van Gewitterradar NIET uit. Bestaande historische gegevens worden niet automatisch verwijderd.",
      "entities": "Gebruikte entiteiten en functies",
      "entitiesSubtitle": "Een overzicht van alle gebruikte entiteiten en hun functies.",
      "native": "Native Gewitterradar-configuratie",
      "sourceNative": "Native",
      "legacy": "Legacy-fallback / compatibiliteit",
      "legacyPurpose": "Wordt alleen gebruikt als compatibiliteitsfallback.",
      "locationPerson": "Biedt selecteerbare persoonslocaties.",
      "locationZone": "Biedt selecteerbare zones als referentielocaties.",
      "legacyText": "De bestaande lightning_detection_* helpers worden gebruikt voor compatibiliteit. Ze zijn niet nodig voor een nieuwe native installatie.",
      "resolved": "Momenteel bepaald",
      "available": "beschikbaar",
      "unavailable": "niet beschikbaar",
      "override": "Kaartconfiguratie",
      "sources": "Bronnen voor bliksemgegevens",
      "locations": "Locatiebronnen",
      "dynamic": "person.* en zone.* worden dynamisch gedetecteerd.",
      "dedicationTitle": "Voor Alkje",
      "dedicationText": "Dank je dat je me de tijd geeft om mijn interesses en enthousiasme voor techniek, weer en alle ideeën daartussen te volgen – en me met zoveel plezier en doorzettingsvermogen aan projecten als Gewitterradar te wijden.",
      "footer": "Op elk moment opnieuw te openen via Instellingen → Over Gewitterradar."
    },
    "settingLabels": {
      "language": "Taal",
      "distance_unit": "Afstandseenheid",
      "compass_design": "Kompasontwerp",
      "reference_location": "Referentielocatie",
      "observation_radius": "Observatieradius",
      "storm_radius": "Onweersradius",
      "danger_radius": "Gevarenradius",
      "aura_width": "Aura-breedte",
      "aura_intensity": "Aura-intensiteit",
      "aura_effects": "Aura-effecten",
      "warning_animation": "Waarschuwingsanimatie",
      "storm_simulation": "Onweerssimulatie",
      "show_location_selector": "Locatieselectie",
      "compass_nearest_strike": "Kompas: dichtstbijzijnde bliksem",
      "compass_device_orientation": "Apparaatoriëntatie",
      "map_grouping": "Kaartgroepering"
    },
    "settingPurposes": {
      "language": "Selecteert de taal van de kaart.",
      "distance_unit": "Stelt KM of MI in.",
      "compass_design": "Selecteert het kompasontwerp.",
      "reference_location": "Stelt de referentielocatie in.",
      "observation_radius": "Stelt het buitenste observatiegebied in.",
      "storm_radius": "Definieert het gebied met verhoogde onweersactiviteit.",
      "danger_radius": "Definieert het directe gevarengebied.",
      "aura_width": "Regelt de breedte van het aura-effect.",
      "aura_intensity": "Regelt de intensiteit van het aura-effect.",
      "aura_effects": "Schakelt aura-effecten in of uit.",
      "warning_animation": "Activeert de waarschuwingsanimatie.",
      "storm_simulation": "Activeert de onweerssimulatie.",
      "show_location_selector": "Maakt locatieselectie mogelijk.",
      "compass_nearest_strike": "Richt het kompas op de dichtstbijzijnde bliksem.",
      "compass_device_orientation": "Gebruikt de oriëntatie van het apparaat.",
      "map_grouping": "Groepeert nabije bliksem op de kaart."
    },
    "sourcePurposes": {
      "geo_location.lightning_strike*": "Levert afzonderlijke bliksemposities.",
      "sensor.*_lightning_distance": "Levert de afstand tot de laatste bliksem.",
      "sensor.*_lightning_azimuth": "Levert de richting naar de laatste bliksem.",
      "sensor.*_lightning_counter": "Telt gedetecteerde bliksemgebeurtenissen."
    }
  },
  "Polski": {
    "strings": {
      "title": "O Gewitterradar",
      "close": "Zamknij",
      "understood": "Rozumiem",
      "subtitle": "Dla miłośników pogody, którzy chcą śledzić aktywność wyładowań w sposób jasny i zrozumiały.",
      "claim": "Obserwuj burze, odkrywaj ich rozwój.",
      "welcome": "Witamy, miłośnicy pogody!",
      "intro": "Ten projekt jest dla wszystkich, których fascynują burze, wyładowania atmosferyczne, zjawiska pogodowe i niezwykła dynamika naszej atmosfery. Gewitterradar pomaga lepiej rozumieć naturę, wcześnie dostrzegać rozwój sytuacji i obserwować ją z szacunkiem. Cieszymy się, że jesteś częścią tej społeczności!",
      "quote": "Burze pokazują, jak potężna potrafi być atmosfera.",
      "radii": "Trzy promienie",
      "radiiTagline": "Trzy obszary. Jeden przejrzysty obraz.",
      "schematic": "Schematyczne przedstawienie promieni, nie w skali",
      "observation": "Wczesna obserwacja odległych burz na większym obszarze.",
      "storm": "Bliższa aktywność burzowa wymagająca zwiększonej uwagi.",
      "danger": "Bezpośrednie otoczenie o szczególnie krytycznym znaczeniu.",
      "radiusInfo": "Promienie pomagają wcześnie ocenić burze i szybko oraz jasno zrozumieć bieżącą sytuację. Promienie nakładają się na siebie: wyładowanie w promieniu zagrożenia jest jednocześnie liczone w promieniu burzy i promieniu obserwacji.",
      "thanks": "Podziękowania dla Blitzortung.org",
      "network": "Szczególne podziękowania kierujemy do Blitzortung.org i jego światowej społeczności wolontariuszy obsługujących stacje. Gewitterradar korzysta z danych o wyładowaniach udostępnianych przez tę społecznościową sieć detekcji.",
      "recorder": "Ważna informacja dotycząca Home Assistant Recorder",
      "recorderText": "Aby ograniczyć rozrost bazy danych, zdecydowanie zalecamy wykluczenie tych czterech źródeł z Recorder w pliku configuration.yaml. Dodaj je do istniejącej sekcji recorder: – nie twórz drugiego bloku najwyższego poziomu. Stany na żywo pozostaną dostępne.",
      "recorderBenefit": "Mniej danych.\nLżejszy system.\nDo długotrwałej pracy.",
      "copy": "Kopiuj YAML",
      "copied": "Skopiowano",
      "copyFailed": "Kopiowanie niedostępne – zaznacz kod.",
      "later": "Wyświetl ponownie później",
      "merge": "Jeśli sekcja recorder: już istnieje, dodaj te wpisy właśnie tam. NIE twórz drugiego bloku recorder: najwyższego poziomu.",
      "live": "Wykluczenie z Recorder NIE wyłącza stanów na żywo w Gewitterradar. Istniejące dane historyczne nie są usuwane automatycznie.",
      "entities": "Używane encje i funkcje",
      "entitiesSubtitle": "Przegląd wszystkich używanych encji i ich funkcji.",
      "native": "Natywna konfiguracja Gewitterradar",
      "sourceNative": "Natywna",
      "legacy": "Tryb zgodności / rozwiązanie starszego typu",
      "legacyPurpose": "Używane wyłącznie jako rozwiązanie zgodności.",
      "locationPerson": "Udostępnia wybieralne lokalizacje osób.",
      "locationZone": "Udostępnia wybieralne strefy jako lokalizacje odniesienia.",
      "legacyText": "Istniejące helpery lightning_detection_* są dostępne ze względów zgodności. Nie są potrzebne w nowej instalacji natywnej.",
      "resolved": "Aktualnie używane",
      "available": "dostępne",
      "unavailable": "niedostępne",
      "override": "Konfiguracja karty",
      "sources": "Źródła danych o wyładowaniach",
      "locations": "Źródła lokalizacji",
      "dynamic": "person.* i zone.* są wykrywane dynamicznie.",
      "dedicationTitle": "Dla Alkje",
      "dedicationText": "Dziękuję, że dajesz mi czas na rozwijanie moich zainteresowań i pasji do techniki, pogody oraz wszystkich pomysłów pomiędzy nimi – i że mogę z taką radością i wytrwałością poświęcać się projektom takim jak Gewitterradar.",
      "footer": "Dostępne w każdej chwili w Ustawienia → O Gewitterradar."
    },
    "settingLabels": {
      "language": "Język",
      "distance_unit": "Jednostka odległości",
      "compass_design": "Wygląd kompasu",
      "reference_location": "Lokalizacja odniesienia",
      "observation_radius": "Promień obserwacji",
      "storm_radius": "Promień burzy",
      "danger_radius": "Promień zagrożenia",
      "aura_width": "Szerokość aury",
      "aura_intensity": "Intensywność aury",
      "aura_effects": "Efekty aury",
      "warning_animation": "Animacja ostrzeżenia",
      "storm_simulation": "Symulacja burzy",
      "show_location_selector": "Wybór lokalizacji",
      "compass_nearest_strike": "Kompas: najbliższe wyładowanie",
      "compass_device_orientation": "Orientacja urządzenia",
      "map_grouping": "Grupowanie na mapie"
    },
    "settingPurposes": {
      "language": "Wybiera język karty.",
      "distance_unit": "Ustawia KM lub MI.",
      "compass_design": "Wybiera wygląd kompasu.",
      "reference_location": "Ustawia lokalizację odniesienia.",
      "observation_radius": "Ustawia zewnętrzny obszar obserwacji.",
      "storm_radius": "Definiuje obszar zwiększonej aktywności burzowej.",
      "danger_radius": "Definiuje bezpośredni obszar zagrożenia.",
      "aura_width": "Steruje szerokością efektu aury.",
      "aura_intensity": "Steruje intensywnością efektu aury.",
      "aura_effects": "Włącza lub wyłącza efekty aury.",
      "warning_animation": "Włącza animację ostrzeżenia.",
      "storm_simulation": "Włącza symulację burzy.",
      "show_location_selector": "Umożliwia wybór lokalizacji.",
      "compass_nearest_strike": "Kieruje kompas na najbliższe wyładowanie.",
      "compass_device_orientation": "Wykorzystuje orientację urządzenia.",
      "map_grouping": "Grupuje pobliskie wyładowania na mapie."
    },
    "sourcePurposes": {
      "geo_location.lightning_strike*": "Dostarcza pozycje pojedynczych wyładowań.",
      "sensor.*_lightning_distance": "Dostarcza odległość do ostatniego wyładowania.",
      "sensor.*_lightning_azimuth": "Dostarcza kierunek do ostatniego wyładowania.",
      "sensor.*_lightning_counter": "Zlicza wykryte zdarzenia wyładowań."
    }
  },
  "Português": {
    "strings": {
      "title": "Sobre o Gewitterradar",
      "close": "Fechar",
      "understood": "Entendido",
      "subtitle": "Para entusiastas de meteorologia que querem acompanhar a atividade de raios de forma clara e fácil de compreender.",
      "claim": "Observe trovoadas, descubra a sua evolução.",
      "welcome": "Bem-vindos, entusiastas de meteorologia!",
      "intro": "Este projeto é para todos os que se fascinam por trovoadas, raios, fenómenos meteorológicos e pela dinâmica fascinante da nossa atmosfera. O Gewitterradar ajuda a compreender melhor a natureza, a reconhecer desenvolvimentos com antecedência e a observá-los com respeito. É ótimo ter-te nesta comunidade!",
      "quote": "As trovoadas mostram como a atmosfera pode ser poderosa.",
      "radii": "Os três raios",
      "radiiTagline": "Três áreas. Uma visão clara.",
      "schematic": "Representação esquemática dos raios, não está à escala",
      "observation": "Observação antecipada de trovoadas distantes numa área mais ampla.",
      "storm": "Atividade de trovoada mais próxima que exige maior atenção.",
      "danger": "Zona imediata com relevância particularmente crítica.",
      "radiusInfo": "Os raios ajudam a avaliar trovoadas com antecedência e a compreender a situação atual de forma rápida e clara. Os raios são cumulativos: um raio dentro do raio de perigo também conta no raio de trovoada e no raio de observação.",
      "thanks": "Agradecimentos ao Blitzortung.org",
      "network": "Um agradecimento especial ao Blitzortung.org e à sua comunidade mundial de operadores voluntários de estações. O Gewitterradar utiliza dados de raios disponibilizados por esta rede de deteção mantida pela comunidade.",
      "recorder": "Nota importante sobre o Home Assistant Recorder",
      "recorderText": "Para limitar o crescimento da base de dados, recomendamos vivamente excluir estas quatro fontes do Recorder em configuration.yaml. Adiciona-as a uma secção recorder: já existente – não cries um segundo bloco de nível superior. Os estados em tempo real continuam disponíveis.",
      "recorderBenefit": "Menos dados.\nUm sistema mais leve.\nPara funcionamento a longo prazo.",
      "copy": "Copiar YAML",
      "copied": "Copiado",
      "copyFailed": "Não foi possível copiar – seleciona o código.",
      "later": "Ver novamente mais tarde",
      "merge": "Se já existir uma secção recorder:, integra estas entradas nessa secção. NÃO cries um segundo bloco recorder: de nível superior.",
      "live": "A exclusão do Recorder NÃO desativa os estados em tempo real do Gewitterradar. Os dados históricos existentes não são removidos automaticamente.",
      "entities": "Entidades e funções utilizadas",
      "entitiesSubtitle": "Uma visão geral de todas as entidades utilizadas e das respetivas funções.",
      "native": "Configuração nativa do Gewitterradar",
      "sourceNative": "Nativa",
      "legacy": "Compatibilidade / alternativa legada",
      "legacyPurpose": "Utilizada apenas como alternativa de compatibilidade.",
      "locationPerson": "Disponibiliza localizações de pessoas selecionáveis.",
      "locationZone": "Disponibiliza zonas selecionáveis como localizações de referência.",
      "legacyText": "Os helpers lightning_detection_* existentes são disponibilizados por motivos de compatibilidade. Não são necessários numa nova instalação nativa.",
      "resolved": "Atualmente utilizado",
      "available": "disponível",
      "unavailable": "indisponível",
      "override": "Configuração do cartão",
      "sources": "Fontes de dados de raios",
      "locations": "Fontes de localização",
      "dynamic": "person.* e zone.* são detetados dinamicamente.",
      "dedicationTitle": "Para Alkje",
      "dedicationText": "Obrigado por me dares o tempo para seguir os meus interesses e o meu entusiasmo pela tecnologia, pela meteorologia e por todas as ideias entre ambos – e para me dedicar a projetos como o Gewitterradar com tanta alegria e perseverança.",
      "footer": "Disponível a qualquer momento em Definições → Sobre o Gewitterradar."
    },
    "settingLabels": {
      "language": "Idioma",
      "distance_unit": "Unidade de distância",
      "compass_design": "Design da bússola",
      "reference_location": "Localização de referência",
      "observation_radius": "Raio de observação",
      "storm_radius": "Raio de trovoada",
      "danger_radius": "Raio de perigo",
      "aura_width": "Largura da aura",
      "aura_intensity": "Intensidade da aura",
      "aura_effects": "Efeitos de aura",
      "warning_animation": "Animação de aviso",
      "storm_simulation": "Simulação de trovoada",
      "show_location_selector": "Seleção de localização",
      "compass_nearest_strike": "Bússola: raio mais próximo",
      "compass_device_orientation": "Orientação do dispositivo",
      "map_grouping": "Agrupamento no mapa"
    },
    "settingPurposes": {
      "language": "Seleciona o idioma do cartão.",
      "distance_unit": "Define KM ou MI.",
      "compass_design": "Seleciona o design da bússola.",
      "reference_location": "Define a localização de referência.",
      "observation_radius": "Define a área exterior de observação.",
      "storm_radius": "Define a área de maior atividade de trovoada.",
      "danger_radius": "Define a área de perigo imediato.",
      "aura_width": "Controla a largura do efeito de aura.",
      "aura_intensity": "Controla a intensidade do efeito de aura.",
      "aura_effects": "Ativa ou desativa os efeitos de aura.",
      "warning_animation": "Ativa a animação de aviso.",
      "storm_simulation": "Ativa a simulação de trovoada.",
      "show_location_selector": "Permite selecionar uma localização.",
      "compass_nearest_strike": "Orienta a bússola para o raio mais próximo.",
      "compass_device_orientation": "Utiliza a orientação do dispositivo.",
      "map_grouping": "Agrupa raios próximos no mapa."
    },
    "sourcePurposes": {
      "geo_location.lightning_strike*": "Fornece posições individuais de raios.",
      "sensor.*_lightning_distance": "Fornece a distância até ao último raio.",
      "sensor.*_lightning_azimuth": "Fornece a direção do último raio.",
      "sensor.*_lightning_counter": "Conta eventos de raios detetados."
    }
  },
  "Svenska": {
    "strings": {
      "title": "Om Gewitterradar",
      "close": "Stäng",
      "understood": "Förstått",
      "subtitle": "För väderentusiaster som vill följa blixtaktivitet på ett tydligt och lättbegripligt sätt.",
      "claim": "Följ åskväder, upptäck utvecklingen.",
      "welcome": "Välkommen, väderentusiast!",
      "intro": "Det här projektet är för alla som fascineras av åskväder, blixtar, väderfenomen och den fascinerande dynamiken i vår atmosfär. Gewitterradar hjälper dig att förstå naturen bättre, upptäcka utvecklingen tidigt och observera den med respekt. Det är roligt att ha dig som en del av den här gemenskapen!",
      "quote": "Åskväder visar hur kraftfull atmosfären kan vara.",
      "radii": "De tre radierna",
      "radiiTagline": "Tre områden. En tydlig överblick.",
      "schematic": "Schematisk visning av radierna, inte skalenlig",
      "observation": "Tidig observation av avlägsna åskväder i ett större område.",
      "storm": "Närmare åskaktivitet som kräver ökad uppmärksamhet.",
      "danger": "Omedelbar närhet med särskilt kritisk betydelse.",
      "radiusInfo": "Radierna hjälper dig att bedöma åskväder tidigt och snabbt få en tydlig bild av den aktuella situationen. Radierna är kumulativa: en blixt inom faroradien räknas även inom åskradien och observationsradien.",
      "thanks": "Tack till Blitzortung.org",
      "network": "Ett särskilt tack till Blitzortung.org och dess världsomspännande gemenskap av frivilliga stationsoperatörer. Gewitterradar använder blixtdata som tillhandahålls av detta gemenskapsdrivna detekteringsnätverk.",
      "recorder": "Viktig information om Home Assistant Recorder",
      "recorderText": "För att begränsa databasens tillväxt rekommenderar vi starkt att dessa fyra källor undantas från Recorder i configuration.yaml. Lägg till dem i en befintlig recorder:-sektion – skapa inte ett andra block på toppnivå. Live-tillstånd förblir tillgängliga.",
      "recorderBenefit": "Mindre data.\nEtt smidigare system.\nFör långvarig drift.",
      "copy": "Kopiera YAML",
      "copied": "Kopierat",
      "copyFailed": "Kopiering är inte tillgänglig – markera koden.",
      "later": "Visa igen senare",
      "merge": "Om det redan finns en recorder:-sektion ska du lägga in dessa poster där. Skapa INTE ett andra recorder:-block på toppnivå.",
      "live": "Undantag från Recorder inaktiverar INTE live-tillstånden för Gewitterradar. Befintliga historiska data tas inte bort automatiskt.",
      "entities": "Använda entiteter och funktioner",
      "entitiesSubtitle": "En översikt över alla använda entiteter och deras funktioner.",
      "native": "Inbyggd Gewitterradar-konfiguration",
      "sourceNative": "Inbyggd",
      "legacy": "Äldre kompatibilitetsläge / reservlösning",
      "legacyPurpose": "Används endast som reservlösning för kompatibilitet.",
      "locationPerson": "Tillhandahåller valbara personplatser.",
      "locationZone": "Tillhandahåller valbara zoner som referensplatser.",
      "legacyText": "De befintliga lightning_detection_*-hjälparna finns kvar för kompatibilitet. De behövs inte för en ny inbyggd installation.",
      "resolved": "Används för närvarande",
      "available": "tillgänglig",
      "unavailable": "inte tillgänglig",
      "override": "Kortkonfiguration",
      "sources": "Källor för blixtdata",
      "locations": "Platskällor",
      "dynamic": "person.* och zone.* identifieras dynamiskt.",
      "dedicationTitle": "Till Alkje",
      "dedicationText": "Tack för att du ger mig tid att följa mina intressen och min entusiasm för teknik, väder och alla idéer däremellan – och att ägna mig åt projekt som Gewitterradar med så mycket glädje och uthållighet.",
      "footer": "Kan öppnas när som helst via Inställningar → Om Gewitterradar."
    },
    "settingLabels": {
      "language": "Språk",
      "distance_unit": "Avståndsenhet",
      "compass_design": "Kompassdesign",
      "reference_location": "Referensplats",
      "observation_radius": "Observationsradie",
      "storm_radius": "Åskradie",
      "danger_radius": "Faroradie",
      "aura_width": "Aura-bredd",
      "aura_intensity": "Aura-intensitet",
      "aura_effects": "Aura-effekter",
      "warning_animation": "Varningsanimation",
      "storm_simulation": "Åsksimulering",
      "show_location_selector": "Platsval",
      "compass_nearest_strike": "Kompass: närmaste blixt",
      "compass_device_orientation": "Enhetsorientering",
      "map_grouping": "Kartgruppering"
    },
    "settingPurposes": {
      "language": "Väljer kortets språk.",
      "distance_unit": "Ställer in KM eller MI.",
      "compass_design": "Väljer kompassdesign.",
      "reference_location": "Ställer in referensplatsen.",
      "observation_radius": "Ställer in det yttre observationsområdet.",
      "storm_radius": "Definierar området med ökad åskaktivitet.",
      "danger_radius": "Definierar det omedelbara riskområdet.",
      "aura_width": "Styr bredden på auraeffekten.",
      "aura_intensity": "Styr intensiteten på auraeffekten.",
      "aura_effects": "Slår på eller av auraeffekter.",
      "warning_animation": "Aktiverar varningsanimationen.",
      "storm_simulation": "Aktiverar åsksimuleringen.",
      "show_location_selector": "Möjliggör val av plats.",
      "compass_nearest_strike": "Riktar kompassen mot den närmaste blixten.",
      "compass_device_orientation": "Använder enhetens orientering.",
      "map_grouping": "Grupperar närliggande blixtar på kartan."
    },
    "sourcePurposes": {
      "geo_location.lightning_strike*": "Tillhandahåller positioner för enskilda blixtar.",
      "sensor.*_lightning_distance": "Tillhandahåller avståndet till den senaste blixten.",
      "sensor.*_lightning_azimuth": "Tillhandahåller riktningen till den senaste blixten.",
      "sensor.*_lightning_counter": "Räknar identifierade blixthändelser."
    }
  },
  "Italiano": {
    "strings": {
      "title": "Informazioni su Gewitterradar",
      "close": "Chiudi",
      "understood": "Capito",
      "subtitle": "Per gli appassionati di meteorologia che vogliono seguire l’attività dei fulmini in modo chiaro e comprensibile.",
      "claim": "Osserva i temporali, scopri come evolvono.",
      "welcome": "Benvenuti, appassionati di meteorologia!",
      "intro": "Questo progetto è per tutti coloro che sono affascinati dai temporali, dai fulmini, dai fenomeni meteorologici e dall’affascinante dinamica della nostra atmosfera. Gewitterradar ti aiuta a comprendere meglio la natura, riconoscere gli sviluppi in anticipo e osservarli con rispetto. È bello averti in questa comunità!",
      "quote": "I temporali mostrano quanto può essere potente l’atmosfera.",
      "radii": "I tre raggi",
      "radiiTagline": "Tre aree. Una visione chiara.",
      "schematic": "Rappresentazione schematica dei raggi, non in scala",
      "observation": "Osservazione precoce di temporali lontani in un’area più ampia.",
      "storm": "Attività temporalesca più vicina che richiede maggiore attenzione.",
      "danger": "Zona immediata con rilevanza particolarmente critica.",
      "radiusInfo": "I raggi aiutano a valutare i temporali in anticipo e a comprendere rapidamente e chiaramente la situazione attuale. I raggi sono cumulativi: un fulmine nel raggio di pericolo conta anche nel raggio temporale e nel raggio di osservazione.",
      "thanks": "Grazie a Blitzortung.org",
      "network": "Un ringraziamento speciale va a Blitzortung.org e alla sua comunità mondiale di operatori volontari delle stazioni. Gewitterradar utilizza i dati sui fulmini forniti da questa rete di rilevamento gestita dalla comunità.",
      "recorder": "Nota importante su Home Assistant Recorder",
      "recorderText": "Per limitare la crescita del database, consigliamo vivamente di escludere queste quattro fonti da Recorder in configuration.yaml. Aggiungile a una sezione recorder: esistente – non creare un secondo blocco di primo livello. Gli stati in tempo reale restano disponibili.",
      "recorderBenefit": "Meno dati.\nUn sistema più leggero.\nPer un utilizzo a lungo termine.",
      "copy": "Copia YAML",
      "copied": "Copiato",
      "copyFailed": "Copia non disponibile – seleziona il codice.",
      "later": "Visualizza di nuovo più tardi",
      "merge": "Se esiste già una sezione recorder:, integra lì queste voci. NON creare un secondo blocco recorder: di primo livello.",
      "live": "L’esclusione da Recorder NON disattiva gli stati in tempo reale di Gewitterradar. I dati storici esistenti non vengono rimossi automaticamente.",
      "entities": "Entità e funzioni utilizzate",
      "entitiesSubtitle": "Una panoramica di tutte le entità utilizzate e delle loro funzioni.",
      "native": "Configurazione nativa di Gewitterradar",
      "sourceNative": "Nativa",
      "legacy": "Compatibilità / fallback legacy",
      "legacyPurpose": "Utilizzato solo come fallback di compatibilità.",
      "locationPerson": "Fornisce posizioni di persone selezionabili.",
      "locationZone": "Fornisce zone selezionabili come posizioni di riferimento.",
      "legacyText": "Gli helper lightning_detection_* esistenti sono disponibili per compatibilità. Non sono necessari per una nuova installazione nativa.",
      "resolved": "Attualmente utilizzato",
      "available": "disponibile",
      "unavailable": "non disponibile",
      "override": "Configurazione della scheda",
      "sources": "Fonti dei dati sui fulmini",
      "locations": "Fonti delle posizioni",
      "dynamic": "person.* e zone.* vengono rilevati dinamicamente.",
      "dedicationTitle": "Per Alkje",
      "dedicationText": "Grazie per lasciarmi il tempo di seguire i miei interessi e il mio entusiasmo per la tecnologia, la meteorologia e tutte le idee che stanno nel mezzo – e di dedicarmi a progetti come Gewitterradar con tanta gioia e perseveranza.",
      "footer": "Disponibile in qualsiasi momento in Impostazioni → Informazioni su Gewitterradar."
    },
    "settingLabels": {
      "language": "Lingua",
      "distance_unit": "Unità di distanza",
      "compass_design": "Design della bussola",
      "reference_location": "Posizione di riferimento",
      "observation_radius": "Raggio di osservazione",
      "storm_radius": "Raggio temporale",
      "danger_radius": "Raggio di pericolo",
      "aura_width": "Larghezza aura",
      "aura_intensity": "Intensità aura",
      "aura_effects": "Effetti aura",
      "warning_animation": "Animazione di avviso",
      "storm_simulation": "Simulazione temporale",
      "show_location_selector": "Selezione della posizione",
      "compass_nearest_strike": "Bussola: fulmine più vicino",
      "compass_device_orientation": "Orientamento del dispositivo",
      "map_grouping": "Raggruppamento sulla mappa"
    },
    "settingPurposes": {
      "language": "Seleziona la lingua della scheda.",
      "distance_unit": "Imposta KM o MI.",
      "compass_design": "Seleziona il design della bussola.",
      "reference_location": "Imposta la posizione di riferimento.",
      "observation_radius": "Imposta l’area di osservazione esterna.",
      "storm_radius": "Definisce l’area di maggiore attività temporalesca.",
      "danger_radius": "Definisce l’area di pericolo immediato.",
      "aura_width": "Controlla la larghezza dell’effetto aura.",
      "aura_intensity": "Controlla l’intensità dell’effetto aura.",
      "aura_effects": "Attiva o disattiva gli effetti aura.",
      "warning_animation": "Attiva l’animazione di avviso.",
      "storm_simulation": "Attiva la simulazione temporalesca.",
      "show_location_selector": "Consente la selezione della posizione.",
      "compass_nearest_strike": "Orienta la bussola verso il fulmine più vicino.",
      "compass_device_orientation": "Utilizza l’orientamento del dispositivo.",
      "map_grouping": "Raggruppa i fulmini vicini sulla mappa."
    },
    "sourcePurposes": {
      "geo_location.lightning_strike*": "Fornisce le posizioni dei singoli fulmini.",
      "sensor.*_lightning_distance": "Fornisce la distanza dall’ultimo fulmine.",
      "sensor.*_lightning_azimuth": "Fornisce la direzione dell’ultimo fulmine.",
      "sensor.*_lightning_counter": "Conta gli eventi di fulmini rilevati."
    }
  },
  "Norsk bokmål": {
    "strings": {
      "title": "Om Gewitterradar",
      "close": "Lukk",
      "understood": "Forstått",
      "subtitle": "For værinteresserte som vil følge lynaktivitet på en tydelig og lett forståelig måte.",
      "claim": "Følg tordenvær, oppdag utviklingen.",
      "welcome": "Velkommen, værinteresserte!",
      "intro": "Dette prosjektet er for alle som fascineres av tordenvær, lyn, værfenomener og den fascinerende dynamikken i atmosfæren vår. Gewitterradar hjelper deg med å forstå naturen bedre, oppdage utviklingen tidlig og observere den med respekt. Hyggelig å ha deg som en del av dette fellesskapet!",
      "quote": "Tordenvær viser hvor kraftfull atmosfæren kan være.",
      "radii": "De tre radiene",
      "radiiTagline": "Tre områder. Én tydelig oversikt.",
      "schematic": "Skjematisk visning av radiene, ikke i målestokk",
      "observation": "Tidlig observasjon av fjerne tordenvær i et større område.",
      "storm": "Nærmere tordenværsaktivitet som krever økt oppmerksomhet.",
      "danger": "Umiddelbar nærhet med særlig kritisk betydning.",
      "radiusInfo": "Radiene hjelper deg med å vurdere tordenvær tidlig og raskt få en tydelig forståelse av den aktuelle situasjonen. Radiene er kumulative: Et lyn innenfor fareradiusen teller også innenfor tordenværsradiusen og observasjonsradiusen.",
      "thanks": "Takk til Blitzortung.org",
      "network": "En spesiell takk går til Blitzortung.org og det verdensomspennende fellesskapet av frivillige stasjonsoperatører. Gewitterradar bruker lyndata som leveres av dette fellesskapsdrevne deteksjonsnettverket.",
      "recorder": "Viktig merknad om Home Assistant Recorder",
      "recorderText": "For å begrense veksten i databasen anbefaler vi på det sterkeste å ekskludere disse fire kildene fra Recorder i configuration.yaml. Legg dem til i en eksisterende recorder:-seksjon – ikke opprett en ny blokk på toppnivå. Live-tilstander forblir tilgjengelige.",
      "recorderBenefit": "Mindre data.\nEt slankere system.\nFor langvarig drift.",
      "copy": "Kopier YAML",
      "copied": "Kopiert",
      "copyFailed": "Kopiering er ikke tilgjengelig – marker koden.",
      "later": "Vis igjen senere",
      "merge": "Hvis det allerede finnes en recorder:-seksjon, legger du disse oppføringene inn der. IKKE opprett en ny recorder:-blokk på toppnivå.",
      "live": "Ekskludering fra Recorder deaktiverer IKKE live-tilstandene for Gewitterradar. Eksisterende historiske data fjernes ikke automatisk.",
      "entities": "Brukte entiteter og funksjoner",
      "entitiesSubtitle": "En oversikt over alle brukte entiteter og funksjonene deres.",
      "native": "Innebygd Gewitterradar-konfigurasjon",
      "sourceNative": "Innebygd",
      "legacy": "Eldre kompatibilitetsmodus / reserve",
      "legacyPurpose": "Brukes bare som reserve for kompatibilitet.",
      "locationPerson": "Gir valgbare personplasseringer.",
      "locationZone": "Gir valgbare soner som referanseplasseringer.",
      "legacyText": "De eksisterende lightning_detection_*-hjelperne er tilgjengelige av kompatibilitetshensyn. De er ikke nødvendige for en ny innebygd installasjon.",
      "resolved": "Brukes nå",
      "available": "tilgjengelig",
      "unavailable": "utilgjengelig",
      "override": "Kortkonfigurasjon",
      "sources": "Kilder for lyndata",
      "locations": "Plasseringskilder",
      "dynamic": "person.* og zone.* oppdages dynamisk.",
      "dedicationTitle": "Til Alkje",
      "dedicationText": "Takk for at du gir meg tid til å følge interessene mine og begeistringen for teknologi, vær og alle ideene imellom – og til å vie meg til prosjekter som Gewitterradar med så mye glede og utholdenhet.",
      "footer": "Kan åpnes når som helst via Innstillinger → Om Gewitterradar."
    },
    "settingLabels": {
      "language": "Språk",
      "distance_unit": "Avstandsenhet",
      "compass_design": "Kompassdesign",
      "reference_location": "Referanseplassering",
      "observation_radius": "Observasjonsradius",
      "storm_radius": "Tordenværsradius",
      "danger_radius": "Fareradius",
      "aura_width": "Aura-bredde",
      "aura_intensity": "Aura-intensitet",
      "aura_effects": "Aura-effekter",
      "warning_animation": "Varselanimasjon",
      "storm_simulation": "Tordenværssimulering",
      "show_location_selector": "Plasseringsvalg",
      "compass_nearest_strike": "Kompass: nærmeste lyn",
      "compass_device_orientation": "Enhetsorientering",
      "map_grouping": "Kartgruppering"
    },
    "settingPurposes": {
      "language": "Velger språket på kortet.",
      "distance_unit": "Angir KM eller MI.",
      "compass_design": "Velger kompassdesign.",
      "reference_location": "Angir referanseplasseringen.",
      "observation_radius": "Angir det ytre observasjonsområdet.",
      "storm_radius": "Definerer området med økt tordenværsaktivitet.",
      "danger_radius": "Definerer det umiddelbare fareområdet.",
      "aura_width": "Styrer bredden på auraeffekten.",
      "aura_intensity": "Styrer intensiteten på auraeffekten.",
      "aura_effects": "Slår auraeffekter av eller på.",
      "warning_animation": "Aktiverer varselanimasjonen.",
      "storm_simulation": "Aktiverer tordenværssimuleringen.",
      "show_location_selector": "Tillater valg av plassering.",
      "compass_nearest_strike": "Retter kompasset mot det nærmeste lynet.",
      "compass_device_orientation": "Bruker enhetens orientering.",
      "map_grouping": "Grupperer nærliggende lyn på kartet."
    },
    "sourcePurposes": {
      "geo_location.lightning_strike*": "Gir posisjoner for enkeltlyn.",
      "sensor.*_lightning_distance": "Gir avstanden til det siste lynet.",
      "sensor.*_lightning_azimuth": "Gir retningen til det siste lynet.",
      "sensor.*_lightning_counter": "Teller registrerte lynhendelser."
    }
  },
  "Suomi": {
    "strings": {
      "title": "Tietoja Gewitterradarista",
      "close": "Sulje",
      "understood": "Ymmärretty",
      "subtitle": "Säästä kiinnostuneille, jotka haluavat seurata salamointia selkeästi ja helposti ymmärrettävästi.",
      "claim": "Seuraa ukkosia, huomaa niiden kehitys.",
      "welcome": "Tervetuloa, säästä kiinnostuneet!",
      "intro": "Tämä projekti on kaikille, joita kiehtovat ukkoset, salamat, sääilmiöt ja ilmakehämme kiehtova dynamiikka. Gewitterradar auttaa ymmärtämään luontoa paremmin, havaitsemaan kehityksen ajoissa ja tarkkailemaan sitä kunnioittavasti. Hienoa, että olet osa tätä yhteisöä!",
      "quote": "Ukkoset näyttävät, kuinka voimakas ilmakehä voi olla.",
      "radii": "Kolme sädettä",
      "radiiTagline": "Kolme aluetta. Yksi selkeä näkymä.",
      "schematic": "Säteiden kaaviomainen esitys, ei mittakaavassa",
      "observation": "Etäisten ukkosten varhainen havainnointi laajemmalla alueella.",
      "storm": "Läheisempi ukkosaktiivisuus, joka vaatii enemmän huomiota.",
      "danger": "Välitön lähialue, jolla on erityisen kriittinen merkitys.",
      "radiusInfo": "Säteet auttavat arvioimaan ukkosia ajoissa ja ymmärtämään nykytilanteen nopeasti ja selkeästi. Säteet ovat kumulatiivisia: vaarasäteen sisällä oleva salama lasketaan myös ukkossäteeseen ja havaintosäteeseen.",
      "thanks": "Kiitos Blitzortung.orgille",
      "network": "Erityiskiitos Blitzortung.orgille ja sen maailmanlaajuiselle vapaaehtoisten asemaoperaattoreiden yhteisölle. Gewitterradar käyttää tämän yhteisön ylläpitämän havaintoverkon tarjoamia salamatietoja.",
      "recorder": "Tärkeä huomautus Home Assistant Recorderista",
      "recorderText": "Tietokannan kasvun rajoittamiseksi suosittelemme vahvasti jättämään nämä neljä lähdettä Recorderin ulkopuolelle configuration.yaml-tiedostossa. Lisää ne olemassa olevaan recorder:-osioon – älä luo toista ylimmän tason lohkoa. Reaaliaikaiset tilat pysyvät käytettävissä.",
      "recorderBenefit": "Vähemmän dataa.\nKevyempi järjestelmä.\nPitkäaikaiseen käyttöön.",
      "copy": "Kopioi YAML",
      "copied": "Kopioitu",
      "copyFailed": "Kopiointi ei ole käytettävissä – valitse koodi.",
      "later": "Näytä myöhemmin uudelleen",
      "merge": "Jos recorder:-osio on jo olemassa, lisää nämä merkinnät siihen. ÄLÄ luo toista ylimmän tason recorder:-lohkoa.",
      "live": "Recorderista poissulkeminen EI poista Gewitterradarin reaaliaikaisia tiloja käytöstä. Olemassa olevia historiatietoja ei poisteta automaattisesti.",
      "entities": "Käytetyt entiteetit ja toiminnot",
      "entitiesSubtitle": "Yhteenveto kaikista käytetyistä entiteeteistä ja niiden toiminnoista.",
      "native": "Gewitterradarin natiivi määritys",
      "sourceNative": "Natiivi",
      "legacy": "Yhteensopivuuden varatila / vanha toteutus",
      "legacyPurpose": "Käytetään vain yhteensopivuuden vararatkaisuna.",
      "locationPerson": "Tarjoaa valittavat henkilöiden sijainnit.",
      "locationZone": "Tarjoaa valittavat vyöhykkeet viitesijainneiksi.",
      "legacyText": "Nykyiset lightning_detection_*-helperit ovat käytettävissä yhteensopivuuden vuoksi. Niitä ei tarvita uudessa natiivissa asennuksessa.",
      "resolved": "Tällä hetkellä käytössä",
      "available": "käytettävissä",
      "unavailable": "ei käytettävissä",
      "override": "Kortin määritys",
      "sources": "Salamatietojen lähteet",
      "locations": "Sijaintilähteet",
      "dynamic": "person.* ja zone.* tunnistetaan dynaamisesti.",
      "dedicationTitle": "Alkjelle",
      "dedicationText": "Kiitos, että annat minulle aikaa seurata kiinnostuksenkohteitani ja innostustani tekniikkaan, säähän ja kaikkiin niiden välissä oleviin ideoihin – sekä omistautua Gewitterradarin kaltaisille projekteille niin suurella ilolla ja sinnikkyydellä.",
      "footer": "Avattavissa milloin tahansa kohdasta Asetukset → Tietoja Gewitterradarista."
    },
    "settingLabels": {
      "language": "Kieli",
      "distance_unit": "Etäisyysyksikkö",
      "compass_design": "Kompassin ulkoasu",
      "reference_location": "Viitesijainti",
      "observation_radius": "Havaintosäde",
      "storm_radius": "Ukkossäde",
      "danger_radius": "Vaarasäde",
      "aura_width": "Auran leveys",
      "aura_intensity": "Auran voimakkuus",
      "aura_effects": "Auraefektit",
      "warning_animation": "Varoitusanimaatio",
      "storm_simulation": "Ukkossimulaatio",
      "show_location_selector": "Sijainnin valinta",
      "compass_nearest_strike": "Kompassi: lähin salama",
      "compass_device_orientation": "Laitteen suunta",
      "map_grouping": "Karttaryhmittely"
    },
    "settingPurposes": {
      "language": "Valitsee kortin kielen.",
      "distance_unit": "Asettaa KM tai MI.",
      "compass_design": "Valitsee kompassin ulkoasun.",
      "reference_location": "Asettaa viitesijainnin.",
      "observation_radius": "Asettaa uloimman havaintoalueen.",
      "storm_radius": "Määrittää lisääntyneen ukkosaktiivisuuden alueen.",
      "danger_radius": "Määrittää välittömän vaara-alueen.",
      "aura_width": "Säätää auraefektin leveyttä.",
      "aura_intensity": "Säätää auraefektin voimakkuutta.",
      "aura_effects": "Ottaa auraefektit käyttöön tai poistaa ne käytöstä.",
      "warning_animation": "Ottaa varoitusanimaation käyttöön.",
      "storm_simulation": "Ottaa ukkossimulaation käyttöön.",
      "show_location_selector": "Mahdollistaa sijainnin valinnan.",
      "compass_nearest_strike": "Suuntaa kompassin lähimpään salamaan.",
      "compass_device_orientation": "Käyttää laitteen suuntaa.",
      "map_grouping": "Ryhmittelee läheiset salamat kartalla."
    },
    "sourcePurposes": {
      "geo_location.lightning_strike*": "Tarjoaa yksittäisten salamoiden sijainnit.",
      "sensor.*_lightning_distance": "Tarjoaa etäisyyden viimeisimpään salamaan.",
      "sensor.*_lightning_azimuth": "Tarjoaa suunnan viimeisimpään salamaan.",
      "sensor.*_lightning_counter": "Laskee havaitut salamatapahtumat."
    }
  },
  "Čeština": {
    "strings": {
      "title": "O Gewitterradar",
      "close": "Zavřít",
      "understood": "Rozumím",
      "subtitle": "Pro nadšence do počasí, kteří chtějí sledovat bleskovou aktivitu jasně a srozumitelně.",
      "claim": "Sledujte bouřky, objevujte jejich vývoj.",
      "welcome": "Vítejte, nadšenci do počasí!",
      "intro": "Tento projekt je pro všechny, které fascinují bouřky, blesky, meteorologické jevy a podmanivá dynamika naší atmosféry. Gewitterradar vám pomáhá lépe porozumět přírodě, včas rozpoznat vývoj situace a pozorovat jej s respektem. Jsme rádi, že jste součástí této komunity!",
      "quote": "Bouřky ukazují, jak mocná může atmosféra být.",
      "radii": "Tři poloměry",
      "radiiTagline": "Tři oblasti. Jeden jasný přehled.",
      "schematic": "Schematické znázornění poloměrů, není v měřítku",
      "observation": "Včasné sledování vzdálených bouřek v širším okolí.",
      "storm": "Bližší bouřková aktivita vyžadující zvýšenou pozornost.",
      "danger": "Bezprostřední okolí se zvlášť kritickým významem.",
      "radiusInfo": "Poloměry pomáhají včas vyhodnotit bouřky a rychle a přehledně pochopit aktuální situaci. Poloměry se překrývají: blesk v poloměru nebezpečí se zároveň započítává do poloměru bouřky i poloměru pozorování.",
      "thanks": "Poděkování Blitzortung.org",
      "network": "Zvláštní poděkování patří Blitzortung.org a jeho celosvětové komunitě dobrovolných provozovatelů stanic. Gewitterradar využívá data o blescích poskytovaná touto komunitně provozovanou detekční sítí.",
      "recorder": "Důležité upozornění k Home Assistant Recorder",
      "recorderText": "Pro omezení růstu databáze důrazně doporučujeme v configuration.yaml vyloučit tyto čtyři zdroje z Recorderu. Přidejte je do existující sekce recorder: – nevytvářejte druhý blok nejvyšší úrovně. Živé stavy zůstanou dostupné.",
      "recorderBenefit": "Méně dat.\nÚspornější systém.\nPro dlouhodobý provoz.",
      "copy": "Kopírovat YAML",
      "copied": "Zkopírováno",
      "copyFailed": "Kopírování není dostupné – označte kód.",
      "later": "Zobrazit znovu později",
      "merge": "Pokud již sekce recorder: existuje, začleňte tyto položky do ní. NEVYTVÁŘEJTE druhý blok recorder: nejvyšší úrovně.",
      "live": "Vyloučení z Recorderu NEVYPÍNÁ živé stavy Gewitterradaru. Existující historická data se automaticky neodstraní.",
      "entities": "Používané entity a funkce",
      "entitiesSubtitle": "Přehled všech používaných entit a jejich funkcí.",
      "native": "Nativní konfigurace Gewitterradaru",
      "sourceNative": "Nativní",
      "legacy": "Starší kompatibilní režim / záloha",
      "legacyPurpose": "Používá se pouze jako záložní řešení kompatibility.",
      "locationPerson": "Poskytuje volitelná umístění osob.",
      "locationZone": "Poskytuje volitelné zóny jako referenční umístění.",
      "legacyText": "Stávající helpery lightning_detection_* jsou k dispozici kvůli kompatibilitě. Pro novou nativní instalaci nejsou potřeba.",
      "resolved": "Aktuálně použito",
      "available": "dostupné",
      "unavailable": "nedostupné",
      "override": "Konfigurace karty",
      "sources": "Zdroje dat o blescích",
      "locations": "Zdroje umístění",
      "dynamic": "person.* a zone.* jsou zjišťovány dynamicky.",
      "dedicationTitle": "Pro Alkje",
      "dedicationText": "Děkuji, že mi dáváš čas věnovat se mým zájmům a nadšení pro techniku, počasí a všechny nápady mezi tím – a věnovat se projektům jako Gewitterradar s takovou radostí a vytrvalostí.",
      "footer": "Kdykoli znovu dostupné v Nastavení → O Gewitterradar."
    },
    "settingLabels": {
      "language": "Jazyk",
      "distance_unit": "Jednotka vzdálenosti",
      "compass_design": "Vzhled kompasu",
      "reference_location": "Referenční umístění",
      "observation_radius": "Poloměr pozorování",
      "storm_radius": "Poloměr bouřky",
      "danger_radius": "Poloměr nebezpečí",
      "aura_width": "Šířka aury",
      "aura_intensity": "Intenzita aury",
      "aura_effects": "Efekty aury",
      "warning_animation": "Animace varování",
      "storm_simulation": "Simulace bouřky",
      "show_location_selector": "Výběr umístění",
      "compass_nearest_strike": "Kompas: nejbližší blesk",
      "compass_device_orientation": "Orientace zařízení",
      "map_grouping": "Seskupování na mapě"
    },
    "settingPurposes": {
      "language": "Volí jazyk karty.",
      "distance_unit": "Nastavuje KM nebo MI.",
      "compass_design": "Volí vzhled kompasu.",
      "reference_location": "Nastavuje referenční umístění.",
      "observation_radius": "Nastavuje vnější oblast pozorování.",
      "storm_radius": "Definuje oblast zvýšené bouřkové aktivity.",
      "danger_radius": "Definuje bezprostřední oblast nebezpečí.",
      "aura_width": "Řídí šířku efektu aury.",
      "aura_intensity": "Řídí intenzitu efektu aury.",
      "aura_effects": "Zapíná nebo vypíná efekty aury.",
      "warning_animation": "Aktivuje animaci varování.",
      "storm_simulation": "Aktivuje simulaci bouřky.",
      "show_location_selector": "Umožňuje výběr umístění.",
      "compass_nearest_strike": "Nasměruje kompas k nejbližšímu blesku.",
      "compass_device_orientation": "Používá orientaci zařízení.",
      "map_grouping": "Seskupuje blízké blesky na mapě."
    },
    "sourcePurposes": {
      "geo_location.lightning_strike*": "Poskytuje polohy jednotlivých blesků.",
      "sensor.*_lightning_distance": "Poskytuje vzdálenost k poslednímu blesku.",
      "sensor.*_lightning_azimuth": "Poskytuje směr k poslednímu blesku.",
      "sensor.*_lightning_counter": "Počítá zaznamenané bleskové události."
    }
  },
  "Ελληνικά": {
    "strings": {
      "title": "Σχετικά με το Gewitterradar",
      "close": "Κλείσιμο",
      "understood": "Κατάλαβα",
      "subtitle": "Για φίλους του καιρού που θέλουν να παρακολουθούν τη δραστηριότητα των κεραυνών με σαφή και κατανοητό τρόπο.",
      "claim": "Παρατήρησε τις καταιγίδες, ανακάλυψε την εξέλιξή τους.",
      "welcome": "Καλώς ήρθατε, φίλοι του καιρού!",
      "intro": "Αυτό το έργο απευθύνεται σε όλους όσοι γοητεύονται από τις καταιγίδες, τους κεραυνούς, τα καιρικά φαινόμενα και τη συναρπαστική δυναμική της ατμόσφαιράς μας. Το Gewitterradar σε βοηθά να κατανοείς καλύτερα τη φύση, να αναγνωρίζεις έγκαιρα τις εξελίξεις και να τις παρατηρείς με σεβασμό. Χαιρόμαστε που είσαι μέρος αυτής της κοινότητας!",
      "quote": "Οι καταιγίδες δείχνουν πόσο ισχυρή μπορεί να είναι η ατμόσφαιρα.",
      "radii": "Οι τρεις ακτίνες",
      "radiiTagline": "Τρεις περιοχές. Μία καθαρή εικόνα.",
      "schematic": "Σχηματική απεικόνιση των ακτίνων, όχι σε κλίμακα",
      "observation": "Έγκαιρη παρατήρηση απομακρυσμένων καταιγίδων σε ευρύτερη περιοχή.",
      "storm": "Πλησιέστερη καταιγιδική δραστηριότητα που απαιτεί αυξημένη προσοχή.",
      "danger": "Άμεση γειτονική περιοχή με ιδιαίτερα κρίσιμη σημασία.",
      "radiusInfo": "Οι ακτίνες βοηθούν να αξιολογείς έγκαιρα τις καταιγίδες και να κατανοείς γρήγορα και καθαρά την τρέχουσα κατάσταση. Οι ακτίνες είναι αθροιστικές: ένας κεραυνός μέσα στην ακτίνα κινδύνου μετρά επίσης στην ακτίνα καταιγίδας και στην ακτίνα παρατήρησης.",
      "thanks": "Ευχαριστούμε το Blitzortung.org",
      "network": "Ιδιαίτερες ευχαριστίες στο Blitzortung.org και στην παγκόσμια κοινότητα εθελοντών χειριστών σταθμών. Το Gewitterradar χρησιμοποιεί δεδομένα κεραυνών που παρέχονται από αυτό το κοινοτικά λειτουργούμενο δίκτυο ανίχνευσης.",
      "recorder": "Σημαντική σημείωση για το Home Assistant Recorder",
      "recorderText": "Για να περιοριστεί η αύξηση της βάσης δεδομένων, συνιστούμε έντονα να εξαιρέσετε αυτές τις τέσσερις πηγές από το Recorder στο configuration.yaml. Προσθέστε τις σε μια υπάρχουσα ενότητα recorder: – μην δημιουργήσετε δεύτερο μπλοκ ανώτατου επιπέδου. Οι ζωντανές καταστάσεις παραμένουν διαθέσιμες.",
      "recorderBenefit": "Λιγότερα δεδομένα.\nΕλαφρύτερο σύστημα.\nΓια μακροχρόνια λειτουργία.",
      "copy": "Αντιγραφή YAML",
      "copied": "Αντιγράφηκε",
      "copyFailed": "Η αντιγραφή δεν είναι διαθέσιμη – επιλέξτε τον κώδικα.",
      "later": "Προβολή ξανά αργότερα",
      "merge": "Αν υπάρχει ήδη ενότητα recorder:, ενσωματώστε εκεί αυτές τις εγγραφές. ΜΗΝ δημιουργήσετε δεύτερο μπλοκ recorder: ανώτατου επιπέδου.",
      "live": "Η εξαίρεση από το Recorder ΔΕΝ απενεργοποιεί τις ζωντανές καταστάσεις του Gewitterradar. Τα υπάρχοντα ιστορικά δεδομένα δεν διαγράφονται αυτόματα.",
      "entities": "Οντότητες και λειτουργίες που χρησιμοποιούνται",
      "entitiesSubtitle": "Επισκόπηση όλων των οντοτήτων που χρησιμοποιούνται και των λειτουργιών τους.",
      "native": "Εγγενής ρύθμιση του Gewitterradar",
      "sourceNative": "Εγγενής",
      "legacy": "Λειτουργία συμβατότητας / παλαιότερη εφεδρεία",
      "legacyPurpose": "Χρησιμοποιείται μόνο ως εφεδρεία συμβατότητας.",
      "locationPerson": "Παρέχει επιλέξιμες τοποθεσίες ατόμων.",
      "locationZone": "Παρέχει επιλέξιμες ζώνες ως τοποθεσίες αναφοράς.",
      "legacyText": "Τα υπάρχοντα helpers lightning_detection_* παρέχονται για λόγους συμβατότητας. Δεν απαιτούνται για μια νέα εγγενή εγκατάσταση.",
      "resolved": "Χρησιμοποιείται τώρα",
      "available": "διαθέσιμο",
      "unavailable": "μη διαθέσιμο",
      "override": "Ρύθμιση κάρτας",
      "sources": "Πηγές δεδομένων κεραυνών",
      "locations": "Πηγές τοποθεσίας",
      "dynamic": "Τα person.* και zone.* εντοπίζονται δυναμικά.",
      "dedicationTitle": "Για την Alkje",
      "dedicationText": "Σε ευχαριστώ που μου δίνεις τον χρόνο να ακολουθώ τα ενδιαφέροντά μου και τον ενθουσιασμό μου για την τεχνολογία, τον καιρό και όλες τις ιδέες ανάμεσά τους – και να αφοσιώνομαι σε έργα όπως το Gewitterradar με τόση χαρά και επιμονή.",
      "footer": "Διαθέσιμο ανά πάσα στιγμή στις Ρυθμίσεις → Σχετικά με το Gewitterradar."
    },
    "settingLabels": {
      "language": "Γλώσσα",
      "distance_unit": "Μονάδα απόστασης",
      "compass_design": "Σχεδίαση πυξίδας",
      "reference_location": "Τοποθεσία αναφοράς",
      "observation_radius": "Ακτίνα παρατήρησης",
      "storm_radius": "Ακτίνα καταιγίδας",
      "danger_radius": "Ακτίνα κινδύνου",
      "aura_width": "Πλάτος αύρας",
      "aura_intensity": "Ένταση αύρας",
      "aura_effects": "Εφέ αύρας",
      "warning_animation": "Κίνηση προειδοποίησης",
      "storm_simulation": "Προσομοίωση καταιγίδας",
      "show_location_selector": "Επιλογή τοποθεσίας",
      "compass_nearest_strike": "Πυξίδα: πλησιέστερος κεραυνός",
      "compass_device_orientation": "Προσανατολισμός συσκευής",
      "map_grouping": "Ομαδοποίηση χάρτη"
    },
    "settingPurposes": {
      "language": "Επιλέγει τη γλώσσα της κάρτας.",
      "distance_unit": "Ορίζει KM ή MI.",
      "compass_design": "Επιλέγει τη σχεδίαση της πυξίδας.",
      "reference_location": "Ορίζει την τοποθεσία αναφοράς.",
      "observation_radius": "Ορίζει την εξωτερική περιοχή παρατήρησης.",
      "storm_radius": "Ορίζει την περιοχή αυξημένης καταιγιδικής δραστηριότητας.",
      "danger_radius": "Ορίζει την άμεση περιοχή κινδύνου.",
      "aura_width": "Ελέγχει το πλάτος του εφέ αύρας.",
      "aura_intensity": "Ελέγχει την ένταση του εφέ αύρας.",
      "aura_effects": "Ενεργοποιεί ή απενεργοποιεί τα εφέ αύρας.",
      "warning_animation": "Ενεργοποιεί την κίνηση προειδοποίησης.",
      "storm_simulation": "Ενεργοποιεί την προσομοίωση καταιγίδας.",
      "show_location_selector": "Επιτρέπει την επιλογή τοποθεσίας.",
      "compass_nearest_strike": "Κατευθύνει την πυξίδα προς τον πλησιέστερο κεραυνό.",
      "compass_device_orientation": "Χρησιμοποιεί τον προσανατολισμό της συσκευής.",
      "map_grouping": "Ομαδοποιεί κοντινούς κεραυνούς στον χάρτη."
    },
    "sourcePurposes": {
      "geo_location.lightning_strike*": "Παρέχει θέσεις μεμονωμένων κεραυνών.",
      "sensor.*_lightning_distance": "Παρέχει την απόσταση από τον τελευταίο κεραυνό.",
      "sensor.*_lightning_azimuth": "Παρέχει την κατεύθυνση του τελευταίου κεραυνού.",
      "sensor.*_lightning_counter": "Μετρά τα ανιχνευμένα συμβάντα κεραυνών."
    }
  },
  "Magyar": {
    "strings": {
      "title": "A Gewitterradarról",
      "close": "Bezárás",
      "understood": "Értem",
      "subtitle": "Az időjárás szerelmeseinek, akik világosan és könnyen érthetően szeretnék követni a villámtevékenységet.",
      "claim": "Figyeld a zivatarokat, fedezd fel a fejlődésüket.",
      "welcome": "Üdvözlünk, időjárásrajongók!",
      "intro": "Ez a projekt mindenkinek szól, akit lenyűgöznek a zivatarok, a villámok, az időjárási jelenségek és légkörünk izgalmas dinamikája. A Gewitterradar segít jobban megérteni a természetet, időben felismerni a változásokat és tisztelettel megfigyelni azokat. Örülünk, hogy ennek a közösségnek a része vagy!",
      "quote": "A zivatarok megmutatják, milyen hatalmas erő rejlik a légkörben.",
      "radii": "A három sugár",
      "radiiTagline": "Három terület. Egyértelmű áttekintés.",
      "schematic": "A sugarak sematikus ábrázolása, nem méretarányos",
      "observation": "Távoli zivatarok korai megfigyelése tágabb környezetben.",
      "storm": "Közelebbi zivatartevékenység, amely fokozott figyelmet igényel.",
      "danger": "Közvetlen környezet különösen kritikus jelentőséggel.",
      "radiusInfo": "A sugarak segítenek időben felmérni a zivatarokat, és gyorsan, világosan megérteni az aktuális helyzetet. A sugarak egymásra épülnek: a veszélyzónán belüli villám a zivatar- és a megfigyelési sugárba is beleszámít.",
      "thanks": "Köszönet a Blitzortung.org-nak",
      "network": "Külön köszönet illeti a Blitzortung.org-ot és az önkéntes állomásüzemeltetők világszerte működő közösségét. A Gewitterradar az e közösség által működtetett érzékelőhálózat villámadatait használja.",
      "recorder": "Fontos megjegyzés a Home Assistant Recorderről",
      "recorderText": "Az adatbázis növekedésének korlátozásához erősen javasoljuk, hogy ezt a négy forrást zárd ki a Recorderből a configuration.yaml fájlban. Add hozzá őket egy meglévő recorder: szakaszhoz – ne hozz létre második felső szintű blokkot. Az élő állapotok továbbra is elérhetők maradnak.",
      "recorderBenefit": "Kevesebb adat.\nKarcsúbb rendszer.\nHosszú távú működéshez.",
      "copy": "YAML másolása",
      "copied": "Másolva",
      "copyFailed": "A másolás nem érhető el – jelöld ki a kódot.",
      "later": "Megtekintés később",
      "merge": "Ha már létezik recorder: szakasz, ezeket a bejegyzéseket oda illeszd be. NE hozz létre második felső szintű recorder: blokkot.",
      "live": "A Recorderből való kizárás NEM kapcsolja ki a Gewitterradar élő állapotait. A meglévő előzményadatok nem törlődnek automatikusan.",
      "entities": "Használt entitások és funkciók",
      "entitiesSubtitle": "Az összes használt entitás és funkcióik áttekintése.",
      "native": "Natív Gewitterradar-konfiguráció",
      "sourceNative": "Natív",
      "legacy": "Régi kompatibilitási mód / tartalék",
      "legacyPurpose": "Csak kompatibilitási tartalékként használatos.",
      "locationPerson": "Kiválasztható személyhelyeket biztosít.",
      "locationZone": "Kiválasztható zónákat biztosít referenciahelyként.",
      "legacyText": "A meglévő lightning_detection_* helperek kompatibilitási okból állnak rendelkezésre. Egy új natív telepítéshez nincs rájuk szükség.",
      "resolved": "Jelenleg használva",
      "available": "elérhető",
      "unavailable": "nem elérhető",
      "override": "Kártyakonfiguráció",
      "sources": "Villámadat-források",
      "locations": "Helyforrások",
      "dynamic": "A person.* és zone.* dinamikusan kerül felismerésre.",
      "dedicationTitle": "Alkjének",
      "dedicationText": "Köszönöm, hogy időt adsz arra, hogy kövessem az érdeklődéseimet és a technika, az időjárás, valamint a kettő közötti ötletek iránti lelkesedésemet – és hogy ilyen örömmel és kitartással foglalkozhassak olyan projektekkel, mint a Gewitterradar.",
      "footer": "Bármikor elérhető a Beállítások → A Gewitterradarról menüpontban."
    },
    "settingLabels": {
      "language": "Nyelv",
      "distance_unit": "Távolságegység",
      "compass_design": "Iránytű megjelenése",
      "reference_location": "Referenciahely",
      "observation_radius": "Megfigyelési sugár",
      "storm_radius": "Zivatarsugár",
      "danger_radius": "Veszélysugár",
      "aura_width": "Aura szélessége",
      "aura_intensity": "Aura intenzitása",
      "aura_effects": "Auraeffektek",
      "warning_animation": "Figyelmeztető animáció",
      "storm_simulation": "Zivatarszimuláció",
      "show_location_selector": "Helyválasztás",
      "compass_nearest_strike": "Iránytű: legközelebbi villám",
      "compass_device_orientation": "Eszköz tájolása",
      "map_grouping": "Térképes csoportosítás"
    },
    "settingPurposes": {
      "language": "Kiválasztja a kártya nyelvét.",
      "distance_unit": "KM vagy MI értéket állít be.",
      "compass_design": "Kiválasztja az iránytű megjelenését.",
      "reference_location": "Beállítja a referenciahelyet.",
      "observation_radius": "Beállítja a külső megfigyelési területet.",
      "storm_radius": "Meghatározza a fokozott zivatartevékenység területét.",
      "danger_radius": "Meghatározza a közvetlen veszélyterületet.",
      "aura_width": "Szabályozza az auraeffekt szélességét.",
      "aura_intensity": "Szabályozza az auraeffekt intenzitását.",
      "aura_effects": "Be- vagy kikapcsolja az auraeffekteket.",
      "warning_animation": "Bekapcsolja a figyelmeztető animációt.",
      "storm_simulation": "Bekapcsolja a zivatarszimulációt.",
      "show_location_selector": "Lehetővé teszi a hely kiválasztását.",
      "compass_nearest_strike": "Az iránytűt a legközelebbi villám felé fordítja.",
      "compass_device_orientation": "Az eszköz tájolását használja.",
      "map_grouping": "A közeli villámokat csoportosítja a térképen."
    },
    "sourcePurposes": {
      "geo_location.lightning_strike*": "Egyedi villámhelyeket biztosít.",
      "sensor.*_lightning_distance": "Megadja a legutóbbi villám távolságát.",
      "sensor.*_lightning_azimuth": "Megadja a legutóbbi villám irányát.",
      "sensor.*_lightning_counter": "Számolja az észlelt villámeseményeket."
    }
  },
  "Boarisch": {
    "strings": {
      "title": "Über Gewitterradar",
      "close": "Zua",
      "understood": "Passt",
      "subtitle": "Für Wetterbegeisterte, de d’Blitzaktivität klar und guat verständlich verfolgen woin.",
      "claim": "Gewitter beobachten, Entwicklungen entdecken.",
      "welcome": "Servus, Wetterbegeisterte!",
      "intro": "Des Projekt is für olle, de von Gewittern, Blitz, Wetterphänomenen und da faszinierenden Dynamik von unsra Atmosphäre begeistert san. Gewitterradar hilft da, d’Natur besser zum verstehn, Entwicklungen früh zum erkennen und des Ganze mit Respekt zum beobachten. Schee, dassd dabei bist!",
      "quote": "Gewitter zoagn, wia kraftvoll unsre Atmosphäre sei ko.",
      "radii": "De drei Radien",
      "radiiTagline": "Drei Bereiche. Oa klarer Überblick.",
      "schematic": "Schematische Darstellung von de Radien, ned maßstabsgetreu",
      "observation": "Frühe Beobachtung von entfernten Gewittern im weiteren Umkreis.",
      "storm": "Nähere Gewitteraktivität, bei der ma genauer hinschaun sollt.",
      "danger": "Unmittelbare Umgebung mit besonders kritischer Bedeutung.",
      "radiusInfo": "De Radien helfen da, Gewitter früh einzuschätzen und d’aktuelle Lage schnell und klar zum verstehn. De Radien bauen aufeinander auf: A Blitz im Gefahrenradius zählt aa zum Gewitter- und Beobachtungsradius.",
      "thanks": "Danke an Blitzortung.org",
      "network": "A besonderer Dank geht an Blitzortung.org und an de weltweite Gemeinschaft von freiwilligen Stationsbetreibern. Gewitterradar nutzt Blitzdaten aus dem von da Gemeinschaft betriebenen Ortungsnetz.",
      "recorder": "Wichtiger Hinweis zum Home Assistant Recorder",
      "recorderText": "Damit d’Datenbank ned unnötig wächst, empfehlen mia dringend, de vier Quellen im configuration.yaml vom Recorder auszuschließen. Füg’s in an vorhandenen recorder:-Bereich ein – koan zweiten Block auf oberster Ebene anlegen. De Live-Zustände bleiben verfügbar.",
      "recorderBenefit": "Weniger Daten.\nA schlankeres System.\nFür an dauerhaften Betrieb.",
      "copy": "YAML kopiern",
      "copied": "Kopiert",
      "copyFailed": "Kopiern geht grad ned – bitte Code markieren.",
      "later": "Später no amoi anschaun",
      "merge": "Wenn’s scho an recorder:-Bereich gibt, de Einträge dort einbauen. KOAN zweiten recorder:-Block auf oberster Ebene anlegen.",
      "live": "Da Ausschluss vom Recorder schaltet de Live-Zustände von Gewitterradar NED aus. Vorhandene Verlaufsdaten werden ned automatisch gelöscht.",
      "entities": "Verwendete Entitäten & Funktionen",
      "entitiesSubtitle": "A Übersicht über olle verwendeten Entitäten und ihre Funktionen.",
      "native": "Native Gewitterradar-Konfiguration",
      "sourceNative": "Native",
      "legacy": "Legacy-Fallback / Kompatibilität",
      "legacyPurpose": "Wird nur als Kompatibilitäts-Fallback verwendet.",
      "locationPerson": "Liefert auswählbare Personenstandorte.",
      "locationZone": "Liefert auswählbare Zonen als Referenzstandorte.",
      "legacyText": "De vorhandenen lightning_detection_*-Helper san für d’Kompatibilität da. Für a frische native Installation braucht ma’s ned.",
      "resolved": "Aktuell verwendet",
      "available": "verfügbar",
      "unavailable": "ned verfügbar",
      "override": "Kartenkonfiguration",
      "sources": "Blitzdatenquellen",
      "locations": "Standortquellen",
      "dynamic": "person.* und zone.* werden dynamisch erkannt.",
      "dedicationTitle": "Für Alkje",
      "dedicationText": "Danke, dass du mir die Zeit lässt, meinen Interessen und meiner Begeisterung für Technik, Wetter und all den Ideen dazwischen nachzugehen – und mich Projekten wie Gewitterradar mit so viel Freude und Ausdauer zu widmen.",
      "footer": "Jederzeit über Einstellungen → Über Gewitterradar wieder aufrufbar."
    },
    "settingLabels": {
      "language": "Sproch",
      "distance_unit": "Distanzeinheit",
      "compass_design": "Kompassdesign",
      "reference_location": "Referenzstandort",
      "observation_radius": "Beobachtungsradius",
      "storm_radius": "Gewitterradius",
      "danger_radius": "Gefahrenradius",
      "aura_width": "Aura-Breite",
      "aura_intensity": "Aura-Intensität",
      "aura_effects": "Aura-Effekte",
      "warning_animation": "Warnanimation",
      "storm_simulation": "Gewittersimulation",
      "show_location_selector": "Standortauswahl",
      "compass_nearest_strike": "Kompass: nächster Blitz",
      "compass_device_orientation": "Geräteorientierung",
      "map_grouping": "Kartengruppierung"
    },
    "settingPurposes": {
      "language": "Wählt d’Sproch von da Kartn.",
      "distance_unit": "Legt KM oder MI fest.",
      "compass_design": "Wählt des Kompassdesign.",
      "reference_location": "Bestimmt den Referenzstandort.",
      "observation_radius": "Legt den äußeren Beobachtungsbereich fest.",
      "storm_radius": "Definiert den Bereich erhöhter Gewitteraktivität.",
      "danger_radius": "Definiert den unmittelbaren Gefahrenbereich.",
      "aura_width": "Steuert de Breite vom Aura-Effekt.",
      "aura_intensity": "Steuert de Stärke vom Aura-Effekt.",
      "aura_effects": "Schaltet Aura-Effekte ein oder aus.",
      "warning_animation": "Aktiviert de Warnanimation.",
      "storm_simulation": "Aktiviert de Gewittersimulation.",
      "show_location_selector": "Erlaubt de Standortauswahl.",
      "compass_nearest_strike": "Richtet den Kompass auf den nächsten Blitz.",
      "compass_device_orientation": "Nutzt de Geräteausrichtung.",
      "map_grouping": "Gruppiert nahe Blitze auf da Kartn."
    },
    "sourcePurposes": {
      "geo_location.lightning_strike*": "Liefert einzelne Blitzpositionen.",
      "sensor.*_lightning_distance": "Liefert de Entfernung zum letzten Blitz.",
      "sensor.*_lightning_azimuth": "Liefert de Richtung zum letzten Blitz.",
      "sensor.*_lightning_counter": "Zählt erkannte Blitzereignisse."
    }
  },
  "Plattdüütsch": {
    "strings": {
      "title": "Över Gewitterradar",
      "close": "Tomaken",
      "understood": "Verstahn",
      "subtitle": "För Wetterlüüd, de Blitzaktivität kloor un good verstahn verfolgen wüllt.",
      "claim": "Gewitter ankieken, Entwicklungen entdecken.",
      "welcome": "Willkamen, Wetterlüüd!",
      "intro": "Dit Projekt is för all, de sik för Gewitter, Blitzen, Wederphänomene un de spannende Dynamik vun uns Atmosphär begeistern. Gewitterradar helpt di, de Natur beter to verstahn, Entwicklungen fröh to sehn un se mit Respekt to beobachten. Schöön, dat du dorbi büst!",
      "quote": "Gewitter wiest, wo kraftvull de Atmosphär sien kann.",
      "radii": "De dree Radien",
      "radiiTagline": "Dree Rebeden. Een kloor Överblick.",
      "schematic": "Scheematische Dorstellung vun de Radien, nich op Maat",
      "observation": "Fröhe Beobachtung vun wied entfernte Gewitter in en grötter Rebeet.",
      "storm": "Nähere Gewitteraktivität, de mehr Opmarksamkeit bruukt.",
      "danger": "Direkte Neegde mit besünners kritische Bedüden.",
      "radiusInfo": "De Radien helpt di, Gewitter fröh in to schatten un de aktuelle Laag gau un kloor to verstahn. De Radien baut op’nanner op: Een Blitz binnen den Gefahrenradius tellt ok för Gewitter- un Beobachtungsradius.",
      "thanks": "Dank an Blitzortung.org",
      "network": "En besünner Dank geiht an Blitzortung.org un sien weltwiede Gemeenschap vun friewillige Stationsbedriewers. Gewitterradar bruukt Blitzdaten ut dit vun de Gemeenschap bedreven Ortungsnett.",
      "recorder": "Wichtige Henwies to Home Assistant Recorder",
      "recorderText": "Dormit de Datenbank nich unnödig wassen deit, raden wi dringend, disse veer Quellen in configuration.yaml vun Recorder uttoslüten. Föög se in en vörhannen recorder:-Afsnitt in – maak keen tweeten Block op överste Ebene. Live-Tostänn blievt verföögbor.",
      "recorderBenefit": "Weniger Daten.\nEn slankeres System.\nFör’n langen Bedrief.",
      "copy": "YAML koperen",
      "copied": "Kopeert",
      "copyFailed": "Koperen geiht nich – markeer bitte den Kode.",
      "later": "Later nochmaal ankieken",
      "merge": "Wenn dat al en recorder:-Afsnitt gifft, föög disse Indrääg dor in. Maak KEEN tweeten recorder:-Block op överste Ebene.",
      "live": "Dat Utslüten vun Recorder schalt de Live-Tostänn vun Gewitterradar NICH ut. Vörhannen historische Daten warrt nich automaatsch wegmaakt.",
      "entities": "Bruukte Entitäten & Funktionen",
      "entitiesSubtitle": "En Överblick över all bruukte Entitäten un ehr Funktionen.",
      "native": "Native Gewitterradar-Konfiguration",
      "sourceNative": "Native",
      "legacy": "Legacy-Fallback / Kompatibilität",
      "legacyPurpose": "Warrt bloots as Kompatibilitäts-Fallback bruukt.",
      "locationPerson": "Levert utwählbore Personenstandöört.",
      "locationZone": "Levert utwählbore Zonen as Referenzstandöört.",
      "legacyText": "De vörhannen lightning_detection_*-Helper sünd för de Kompatibilität dor. För en niege native Installatschoon warrt se nich bruukt.",
      "resolved": "Opstunns bruukt",
      "available": "verföögbor",
      "unavailable": "nich verföögbor",
      "override": "Koortkonfiguration",
      "sources": "Blitzdatenquellen",
      "locations": "Standortquellen",
      "dynamic": "person.* un zone.* warrt dünaamsch funnen.",
      "dedicationTitle": "Für Alkje",
      "dedicationText": "Danke, dass du mir die Zeit lässt, meinen Interessen und meiner Begeisterung für Technik, Wetter und all den Ideen dazwischen nachzugehen – und mich Projekten wie Gewitterradar mit so viel Freude und Ausdauer zu widmen.",
      "footer": "Jümmers över Instellungen → Över Gewitterradar wedder oproopbor."
    },
    "settingLabels": {
      "language": "Spraak",
      "distance_unit": "Afstandseenheit",
      "compass_design": "Kompassdesign",
      "reference_location": "Referenzstandort",
      "observation_radius": "Beobachtungsradius",
      "storm_radius": "Gewitterradius",
      "danger_radius": "Gefahrenradius",
      "aura_width": "Aura-Breed",
      "aura_intensity": "Aura-Intensität",
      "aura_effects": "Aura-Effekten",
      "warning_animation": "Warnanimatschoon",
      "storm_simulation": "Gewittersimulatschoon",
      "show_location_selector": "Standortutwahl",
      "compass_nearest_strike": "Kompass: neegste Blitz",
      "compass_device_orientation": "Geräätorienteren",
      "map_grouping": "Koortgrupperen"
    },
    "settingPurposes": {
      "language": "Wählt de Spraak vun de Koort.",
      "distance_unit": "Leggt KM oder MI fast.",
      "compass_design": "Wählt dat Kompassdesign.",
      "reference_location": "Leggt den Referenzstandort fast.",
      "observation_radius": "Leggt dat butenste Beobachtungsrebeet fast.",
      "storm_radius": "Definiert dat Rebeet mit mehr Gewitteraktivität.",
      "danger_radius": "Definiert dat direkte Gefahrenrebeet.",
      "aura_width": "Stüert de Breed vun’n Aura-Effekt.",
      "aura_intensity": "Stüert de Stärk vun’n Aura-Effekt.",
      "aura_effects": "Schalt Aura-Effekten an oder ut.",
      "warning_animation": "Aktiveert de Warnanimatschoon.",
      "storm_simulation": "Aktiveert de Gewittersimulatschoon.",
      "show_location_selector": "Maakt de Standortutwahl mööglich.",
      "compass_nearest_strike": "Richt den Kompass op den neegsten Blitz.",
      "compass_device_orientation": "Bruukt de Geräätorienteren.",
      "map_grouping": "Gruppeert Blitzen, de dicht bi sünd, op de Koort."
    },
    "sourcePurposes": {
      "geo_location.lightning_strike*": "Levert einzelne Blitzpositschonen.",
      "sensor.*_lightning_distance": "Levert den Afstand to den letzten Blitz.",
      "sensor.*_lightning_azimuth": "Levert de Richtung to den letzten Blitz.",
      "sensor.*_lightning_counter": "Tellt funnen Blitzereignisse."
    }
  },
  "Sächs’sch": {
    "strings": {
      "title": "Über Gewitterradar",
      "close": "Zumachen",
      "understood": "Verstanden",
      "subtitle": "Für Wetterbegeisterde, die de Blitzaktivität klar un verständlich verfolgen wolln.",
      "claim": "Gewidder beobachtn, Entwicklungen entdecken.",
      "welcome": "Nu gudd, willkommen ihr Wetterbegeisterdn!",
      "intro": "Das Projekt is für alle, die von Gewiddern, Blitzen, Wetterphänomenen un der faszinierenden Dynamik unsrer Atmosphäre begeistert sin. Gewitterradar hilft dir, de Natur besser zu verstehn, Entwicklungen früh zu erkennen un alles mit Respekt zu beobachtn. Schön, dassde dabei bist!",
      "quote": "Gewidder zeigen, wie kraftvoll unsre Atmosphäre sein kann.",
      "radii": "De drei Radien",
      "radiiTagline": "Drei Bereiche. Een klarer Überblick.",
      "schematic": "Schematische Darstellung von de Radien, nich maßstabsgetreu",
      "observation": "Frühe Beobachtung von entfernten Gewiddern im weiteren Umkreis.",
      "storm": "Nähere Gewidderaktivität, bei der mehr Aufmerksamkeit gebraucht wird.",
      "danger": "Unmittelbare Umgebung mit besonders kritischer Bedeutung.",
      "radiusInfo": "De Radien helfen dir, Gewidder früh einzuschätzen un de aktuelle Lage schnell un klar zu verstehn. De Radien bauen aufeinander auf: Een Blitz im Gefahrenradius zählt ooch zum Gewidder- un Beobachtungsradius.",
      "thanks": "Danke an Blitzortung.org",
      "network": "En besonderer Dank geht an Blitzortung.org un an de weltweite Gemeinschaft von freiwilligen Stationsbetreibern. Gewitterradar nutzt Blitzdaten aus dem von der Gemeinschaft betriebenen Ortungsnetz.",
      "recorder": "Wichtiger Hinweis zum Home Assistant Recorder",
      "recorderText": "Damit de Datenbank nich unnötig wächst, empfehlen mir dringend, de vier Quellen in configuration.yaml vom Recorder auszuschließen. Füg se in een vorhandenen recorder:-Bereich ein – keen zweiten Block auf oberster Ebene anlegen. De Live-Zustände bleiben verfügbar.",
      "recorderBenefit": "Weniger Daten.\nEn schlankeres System.\nFür dauerhaften Betrieb.",
      "copy": "YAML kopiern",
      "copied": "Kopiert",
      "copyFailed": "Kopiern geht grade nich – bitte den Code markieren.",
      "later": "Später nochma angucken",
      "merge": "Wenn schon een recorder:-Bereich da is, de Einträge dort einbauen. KEEN zweiten recorder:-Block auf oberster Ebene anlegen.",
      "live": "Der Ausschluss vom Recorder schaltet de Live-Zustände von Gewitterradar NICH aus. Vorhandene Verlaufsdaten werden nich automatisch gelöscht.",
      "entities": "Verwendete Entitäten & Funktionen",
      "entitiesSubtitle": "En Überblick über alle verwendeten Entitäten un ihre Funktionen.",
      "native": "Native Gewitterradar-Konfiguration",
      "sourceNative": "Native",
      "legacy": "Legacy-Fallback / Kompatibilität",
      "legacyPurpose": "Wird nur als Kompatibilitäts-Fallback verwendet.",
      "locationPerson": "Liefert auswählbare Personenstandorte.",
      "locationZone": "Liefert auswählbare Zonen als Referenzstandorte.",
      "legacyText": "De vorhandenen lightning_detection_*-Helper sind für de Kompatibilität da. Für eene neue native Installation brauchste se nich.",
      "resolved": "Aktuell verwendet",
      "available": "verfügbar",
      "unavailable": "nich verfügbar",
      "override": "Kartenkonfiguration",
      "sources": "Blitzdatenquellen",
      "locations": "Standortquellen",
      "dynamic": "person.* un zone.* werden dynamisch erkannt.",
      "dedicationTitle": "Für Alkje",
      "dedicationText": "Danke, dass du mir die Zeit lässt, meinen Interessen und meiner Begeisterung für Technik, Wetter und all den Ideen dazwischen nachzugehen – und mich Projekten wie Gewitterradar mit so viel Freude und Ausdauer zu widmen.",
      "footer": "Jederzeit über Einstellungen → Über Gewitterradar wieder aufrufbar."
    },
    "settingLabels": {
      "language": "Sprache",
      "distance_unit": "Distanzeinheit",
      "compass_design": "Kompassdesign",
      "reference_location": "Referenzstandort",
      "observation_radius": "Beobachtungsradius",
      "storm_radius": "Gewidderradius",
      "danger_radius": "Gefahrenradius",
      "aura_width": "Aura-Breite",
      "aura_intensity": "Aura-Intensität",
      "aura_effects": "Aura-Effekte",
      "warning_animation": "Warnanimation",
      "storm_simulation": "Gewiddersimulation",
      "show_location_selector": "Standortauswahl",
      "compass_nearest_strike": "Kompass: nächster Blitz",
      "compass_device_orientation": "Geräteorientierung",
      "map_grouping": "Kartengruppierung"
    },
    "settingPurposes": {
      "language": "Wählt de Sprache von der Karte.",
      "distance_unit": "Legt KM oder MI fest.",
      "compass_design": "Wählt das Kompassdesign.",
      "reference_location": "Bestimmt den Referenzstandort.",
      "observation_radius": "Legt den äußeren Beobachtungsbereich fest.",
      "storm_radius": "Definiert den Bereich erhöhter Gewidderaktivität.",
      "danger_radius": "Definiert den unmittelbaren Gefahrenbereich.",
      "aura_width": "Steuert de Breite vom Aura-Effekt.",
      "aura_intensity": "Steuert de Stärke vom Aura-Effekt.",
      "aura_effects": "Schaltet Aura-Effekte ein oder aus.",
      "warning_animation": "Aktiviert de Warnanimation.",
      "storm_simulation": "Aktiviert de Gewiddersimulation.",
      "show_location_selector": "Erlaubt de Standortauswahl.",
      "compass_nearest_strike": "Richtet den Kompass auf den nächsten Blitz.",
      "compass_device_orientation": "Nutzt de Geräteausrichtung.",
      "map_grouping": "Gruppiert nahe Blitze auf der Karte."
    },
    "sourcePurposes": {
      "geo_location.lightning_strike*": "Liefert einzelne Blitzpositionen.",
      "sensor.*_lightning_distance": "Liefert de Entfernung zum letzten Blitz.",
      "sensor.*_lightning_azimuth": "Liefert de Richtung zum letzten Blitz.",
      "sensor.*_lightning_counter": "Zählt erkannte Blitzereignisse."
    }
  },
  "Schwäbisch": {
    "strings": {
      "title": "Über Gewitterradar",
      "close": "Zumacha",
      "understood": "Verstanda",
      "subtitle": "Für Wetterbegeischterte, die d’Blitzaktivität klar ond verständlich verfolge wellet.",
      "claim": "Gewitter beobachta, Entwicklungen entdecka.",
      "welcome": "Griaß eich, Wetterbegeischterte!",
      "intro": "Des Projekt isch für alle, die von Gewittern, Blitzen, Wetterphänomena ond dr faszinierende Dynamik von onsrer Atmosphäre begeischtert send. Gewitterradar hilft dr, d’Natur besser zu versteha, Entwicklungen früh zu erkenna ond des Ganze mit Respekt zu beobachta. Schee, dassd dabei bisch!",
      "quote": "Gewitter zeiget, wie kraftvoll onsre Atmosphäre sei ka.",
      "radii": "Die drei Radien",
      "radiiTagline": "Drei Bereiche. Oin klarer Überblick.",
      "schematic": "Schematische Darstellung von de Radien, net maßstabsgetreu",
      "observation": "Frühe Beobachtung von entfernte Gewitter im weitere Umkreis.",
      "storm": "Nähere Gewitteraktivität, wo mehr Aufmerksamkeit braucht.",
      "danger": "Unmittelbare Umgebung mit besonders kritischer Bedeutung.",
      "radiusInfo": "Die Radien helfet dr, Gewitter früh einzuschätza ond d’aktuelle Lage schnell ond klar zu versteha. Die Radien bauet aufeinander auf: A Blitz im Gefahrenradius zählt au zum Gewitter- ond Beobachtungsradius.",
      "thanks": "Danke an Blitzortung.org",
      "network": "A besonderer Dank goht an Blitzortung.org ond an die weltweite Gemeinschaft von freiwillige Stationsbetreiber. Gewitterradar nutzt Blitzdate aus dem von dr Gemeinschaft betriebene Ortungsnetz.",
      "recorder": "Wichtiger Hinweis zum Home Assistant Recorder",
      "recorderText": "Damit d’Datenbank net unnötig wächst, empfehlet mir dringend, die vier Quelle in configuration.yaml vom Recorder auszuschließe. Füg se in an vorhandene recorder:-Bereich ei – koin zweite Block auf oberster Ebene anlega. Die Live-Zuständ bleibet verfügbar.",
      "recorderBenefit": "Weniger Date.\nA schlankers System.\nFür dauerhafte Betrieb.",
      "copy": "YAML kopiera",
      "copied": "Kopiert",
      "copyFailed": "Kopiera goht grad net – bitte dr Code markiera.",
      "later": "Später nomol angucka",
      "merge": "Wenn’s scho an recorder:-Bereich gibt, die Einträg dort einbaue. KOIN zweite recorder:-Block auf oberster Ebene anlega.",
      "live": "Dr Ausschluss vom Recorder schaltet die Live-Zuständ von Gewitterradar NET aus. Vorhandene Verlaufsdate werdet net automatisch gelöscht.",
      "entities": "Verwendete Entitäten & Funktionen",
      "entitiesSubtitle": "A Überblick über alle verwendete Entitäten ond ihre Funktionen.",
      "native": "Native Gewitterradar-Konfiguration",
      "sourceNative": "Native",
      "legacy": "Legacy-Fallback / Kompatibilität",
      "legacyPurpose": "Wird bloß als Kompatibilitäts-Fallback verwendet.",
      "locationPerson": "Liefert auswählbare Personenstandorte.",
      "locationZone": "Liefert auswählbare Zone als Referenzstandorte.",
      "legacyText": "Die vorhandene lightning_detection_*-Helper send für d’Kompatibilität da. Für a neue native Installation braucht mer se net.",
      "resolved": "Aktuell verwendet",
      "available": "verfügbar",
      "unavailable": "net verfügbar",
      "override": "Kartenkonfiguration",
      "sources": "Blitzdatenquellen",
      "locations": "Standortquellen",
      "dynamic": "person.* ond zone.* werdet dynamisch erkannt.",
      "dedicationTitle": "Für Alkje",
      "dedicationText": "Danke, dass du mir die Zeit lässt, meinen Interessen und meiner Begeisterung für Technik, Wetter und all den Ideen dazwischen nachzugehen – und mich Projekten wie Gewitterradar mit so viel Freude und Ausdauer zu widmen.",
      "footer": "Jederzeit über Einstellungen → Über Gewitterradar wieder aufrufbar."
    },
    "settingLabels": {
      "language": "Sproch",
      "distance_unit": "Distanzeinheit",
      "compass_design": "Kompassdesign",
      "reference_location": "Referenzstandort",
      "observation_radius": "Beobachtungsradius",
      "storm_radius": "Gewitterradius",
      "danger_radius": "Gefahrenradius",
      "aura_width": "Aura-Breite",
      "aura_intensity": "Aura-Intensität",
      "aura_effects": "Aura-Effekte",
      "warning_animation": "Warnanimation",
      "storm_simulation": "Gewittersimulation",
      "show_location_selector": "Standortauswahl",
      "compass_nearest_strike": "Kompass: nächster Blitz",
      "compass_device_orientation": "Geräteorientierung",
      "map_grouping": "Kartengruppierung"
    },
    "settingPurposes": {
      "language": "Wählt d’Sproch von dr Karte.",
      "distance_unit": "Legt KM oder MI fest.",
      "compass_design": "Wählt des Kompassdesign.",
      "reference_location": "Bestimmt dr Referenzstandort.",
      "observation_radius": "Legt dr äußere Beobachtungsbereich fest.",
      "storm_radius": "Definiert dr Bereich erhöhter Gewitteraktivität.",
      "danger_radius": "Definiert dr unmittelbare Gefahrenbereich.",
      "aura_width": "Steuert d’Breite vom Aura-Effekt.",
      "aura_intensity": "Steuert d’Stärke vom Aura-Effekt.",
      "aura_effects": "Schaltet Aura-Effekte ei oder aus.",
      "warning_animation": "Aktiviert d’Warnanimation.",
      "storm_simulation": "Aktiviert d’Gewittersimulation.",
      "show_location_selector": "Erlaubt d’Standortauswahl.",
      "compass_nearest_strike": "Richtet dr Kompass auf dr nächste Blitz.",
      "compass_device_orientation": "Nutzt d’Geräteausrichtung.",
      "map_grouping": "Gruppiert nahe Blitze auf dr Karte."
    },
    "sourcePurposes": {
      "geo_location.lightning_strike*": "Liefert einzelne Blitzpositionen.",
      "sensor.*_lightning_distance": "Liefert d’Entfernung zum letzte Blitz.",
      "sensor.*_lightning_azimuth": "Liefert d’Richtung zum letzte Blitz.",
      "sensor.*_lightning_counter": "Zählt erkannte Blitzereignisse."
    }
  }
};

export const HELP_EXTERNAL_LOCALES = {
  "Dansk": {
    "menuTitle": "Hjælp & bemærkninger",
    "title": "Hjælp & bemærkninger",
    "subtitle": "En kort vejledning, så Gewitterradar fungerer pålideligt og er let at forstå.",
    "close": "Luk hjælp",
    "copy": "Kopiér YAML",
    "copied": "Kopieret",
    "copyFailed": "Kopiering er ikke mulig – markér koden.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Forudsætninger",
        "paragraphs": [
          "Gewitterradar behandler de lyndata, som Home Assistant modtager fra den konfigurerede lyndetektionskilde. Kontrollér det korrekte referencested dér, og sæt kilderadius mindst lige så stor som observationsradius i Gewitterradar. Gewitterradar kan ikke vise eller vurdere lyn, som kilden allerede har filtreret fra."
        ],
        "notes": [
          "Hvis der findes flere lyndetektorer eller observationspunkter, skal de anvendte entiteter entydigt høre til det ønskede referencepunkt."
        ]
      },
      {
        "key": "radii",
        "title": "Radierne",
        "paragraphs": [
          "Radierne er kumulative: Et lyn i fareradius tæller også i tordenvejrs- og observationsradius. Områderne er afstandsgrænser, ikke separate datakilder."
        ],
        "items": [
          "Observationsradius – ydre område til tidlig observation.",
          "Tordenvejrsradius – nærmere område, der kræver øget opmærksomhed.",
          "Fareradius – umiddelbart nærområde med særlig høj relevans."
        ],
        "notes": [
          "Fareradius er begrænset til højst 250 km."
        ]
      },
      {
        "key": "location",
        "title": "Referencested",
        "paragraphs": [
          "Referencestedet bestemmer det punkt, som afstande og retninger beregnes fra. Gewitterradar registrerer dynamisk person.*- og zone.*-entiteter. Når en persons placering ændres, beregnes afstandene igen ud fra de aktuelle Home Assistant-data."
        ],
        "notes": [
          "Et forkert referencested giver forkerte afstande, radiusvurderinger og kompasretninger."
        ]
      },
      {
        "key": "functions",
        "title": "Vigtige funktioner",
        "entries": [
          [
            "Auraeffekter",
            "visualiserer lynaktivitet, men ændrer ikke registrering eller optælling."
          ],
          [
            "Advarselsanimation",
            "fremhæver relevant tordenvejrsaktivitet visuelt."
          ],
          [
            "Kortgruppering",
            "samler nærliggende lynmarkører og holder kortet overskueligt."
          ],
          [
            "Kompas: nærmeste lyn",
            "retter visningen mod det nærmeste registrerede lyn."
          ],
          [
            "Enhedsretning",
            "kan bruge enhedens retning på understøttede mobilenheder."
          ],
          [
            "Tordenvejrssimulering",
            "er kun beregnet til test og diagnostik og bør være slået fra under normal drift."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Anbefalede grundindstillinger",
        "paragraphs": [
          "For en stabil start anbefaler vi:"
        ],
        "items": [
          "Sæt lyndetektionskildens radius mindst lige så stor som Gewitterradars observationsradius.",
          "Lad kortgruppering være slået til.",
          "Lad advarselsanimation være slået til.",
          "Tilpas auraeffekter efter smag; de påvirker ikke registreringen.",
          "Lad tordenvejrssimulering være slået fra under normal drift.",
          "Aktivér kun enhedsretning, når den er nødvendig på den anvendte mobilenhed."
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Hvis noget ikke virker",
        "entries": [
          [
            "Ingen eller for få lyn",
            "Kontrollér lyndetektionskildens status, kilderadius og de anvendte lynentiteter."
          ],
          [
            "Afstande eller retninger ser forkerte ud",
            "Kontrollér referencested og afstandsenhed."
          ],
          [
            "Sprogvalget vises igen og igen",
            "Kontrollér, at den aktuelle Gewitterradar-pakke og initialiseringshjælperen er installeret."
          ],
          [
            "Visningen er uændret efter en opdatering",
            "Genindlæs browser-/app-cachen helt, og kontrollér, at den aktuelle JavaScript-fil bruges."
          ],
          [
            "Uventet adfærd eller dobbelt kort",
            "Kun ÉN Gewitterradar-modulressource må være aktiv i Home Assistant. Den native integration og Dashboard-/HACS-ressourcen må ikke registrere det samme brugerdefinerede kort samtidigt."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Lyndata kan skabe meget mange tilstandsændringer. For en slank Recorder-konfiguration på lang sigt anbefaler vi at udelukke følgende entiteter og entitetsmønstre."
        ],
        "recorder": true,
        "notes": [
          "Hvis der allerede findes en recorder:-sektion, skal posterne flettes ind dér. Opret ikke en anden recorder:-blok på topniveau.",
          "Udelukkelserne deaktiverer IKKE de live-tilstande, Gewitterradar bruger.",
          "Eksisterende historiske data fjernes ikke automatisk.",
          "Wildcard-mønstrene understøtter flere lyndetektorer eller observationspunkter uanset entitetspræfiks."
        ]
      }
    ]
  },
  "Español": {
    "menuTitle": "Ayuda y notas",
    "title": "Ayuda y notas",
    "subtitle": "Una guía breve para que Gewitterradar funcione de forma fiable y comprensible.",
    "close": "Cerrar ayuda",
    "copy": "Copiar YAML",
    "copied": "Copiado",
    "copyFailed": "No se puede copiar; selecciona el código.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Requisitos",
        "paragraphs": [
          "Gewitterradar procesa los datos de rayos que Home Assistant recibe de la fuente de detección configurada. Comprueba allí la ubicación de referencia correcta y ajusta el radio de la fuente como mínimo al radio de observación de Gewitterradar. Gewitterradar no puede mostrar ni evaluar rayos que la fuente ya haya filtrado."
        ],
        "notes": [
          "Si hay varios dispositivos de detección u observatorios, las entidades utilizadas deben pertenecer claramente al punto de referencia deseado."
        ]
      },
      {
        "key": "radii",
        "title": "Los radios",
        "paragraphs": [
          "Los radios son acumulativos: un rayo dentro del radio de peligro también cuenta dentro de los radios de tormenta y observación. Son umbrales de distancia, no fuentes de datos separadas."
        ],
        "items": [
          "Radio de observación – zona exterior para la observación temprana.",
          "Radio de tormenta – zona más cercana que requiere mayor atención.",
          "Radio de peligro – entorno inmediato de especial relevancia."
        ],
        "notes": [
          "El radio de peligro está limitado a un máximo de 250 km."
        ]
      },
      {
        "key": "location",
        "title": "Ubicación de referencia",
        "paragraphs": [
          "La ubicación de referencia determina el punto desde el que se calculan distancias y direcciones. Gewitterradar detecta dinámicamente entidades person.* y zone.*. Cuando cambia la ubicación de una persona, las distancias se recalculan con los datos actuales de Home Assistant."
        ],
        "notes": [
          "Una ubicación de referencia incorrecta produce distancias, evaluaciones de radio y direcciones de brújula incorrectas."
        ]
      },
      {
        "key": "functions",
        "title": "Funciones importantes",
        "entries": [
          [
            "Efectos de aura",
            "visualizan la actividad de rayos, pero no cambian la detección ni el recuento."
          ],
          [
            "Animación de aviso",
            "resalta visualmente la actividad tormentosa relevante."
          ],
          [
            "Agrupación del mapa",
            "agrupa marcadores cercanos para mantener el mapa claro."
          ],
          [
            "Brújula: rayo más cercano",
            "orienta la vista hacia el rayo detectado más próximo."
          ],
          [
            "Orientación del dispositivo",
            "puede usar la orientación en dispositivos móviles compatibles."
          ],
          [
            "Simulación de tormenta",
            "sirve solo para pruebas y diagnóstico y debe permanecer desactivada durante el uso normal."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Ajustes básicos recomendados",
        "paragraphs": [
          "Para un inicio estable recomendamos:"
        ],
        "items": [
          "Configurar el radio de la fuente de rayos al menos igual que el radio de observación de Gewitterradar.",
          "Mantener activada la agrupación del mapa.",
          "Mantener activada la animación de aviso.",
          "Ajustar los efectos de aura al gusto; no afectan a la detección.",
          "Mantener desactivada la simulación de tormenta durante el uso normal.",
          "Activar la orientación del dispositivo solo cuando sea necesaria en el móvil utilizado."
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Si algo no funciona",
        "entries": [
          [
            "No hay rayos o hay muy pocos",
            "Comprueba el estado de la fuente, el radio de origen y las entidades de rayos utilizadas."
          ],
          [
            "Las distancias o direcciones parecen incorrectas",
            "Comprueba la ubicación de referencia y la unidad de distancia."
          ],
          [
            "La selección de idioma reaparece",
            "Comprueba que estén instalados el paquete actual de Gewitterradar y el ayudante de inicialización."
          ],
          [
            "La vista no cambia tras actualizar",
            "Recarga completamente la caché del navegador o la aplicación y confirma que se usa el JavaScript actual."
          ],
          [
            "Comportamiento extraño o tarjeta duplicada",
            "Solo puede estar activo UN recurso de módulo Gewitterradar en Home Assistant. La integración nativa y el recurso Dashboard/HACS no deben registrar simultáneamente la misma tarjeta personalizada."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Los datos de rayos pueden generar muchísimos cambios de estado. Para mantener Recorder ligero a largo plazo, recomendamos excluir las siguientes entidades y patrones."
        ],
        "recorder": true,
        "notes": [
          "Si ya existe una sección recorder:, incorpora allí estas entradas. No crees un segundo bloque recorder: de nivel superior.",
          "Las exclusiones NO desactivan los estados en vivo utilizados por Gewitterradar.",
          "Los datos históricos existentes no se eliminan automáticamente.",
          "Los patrones comodín admiten varios detectores u observatorios independientemente del prefijo de entidad."
        ]
      }
    ]
  },
  "Français": {
    "menuTitle": "Aide et remarques",
    "title": "Aide et remarques",
    "subtitle": "Un guide concis pour que Gewitterradar reste fiable et facile à comprendre.",
    "close": "Fermer l’aide",
    "copy": "Copier le YAML",
    "copied": "Copié",
    "copyFailed": "Copie impossible — sélectionnez le code.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Prérequis",
        "paragraphs": [
          "Gewitterradar traite les données de foudre que Home Assistant reçoit de la source de détection configurée. Vérifiez-y le bon emplacement de référence et définissez le rayon de la source au moins aussi grand que le rayon d’observation de Gewitterradar. Gewitterradar ne peut ni afficher ni évaluer les impacts déjà filtrés par la source."
        ],
        "notes": [
          "Si plusieurs détecteurs ou points d’observation existent, les entités utilisées doivent correspondre sans ambiguïté au point de référence souhaité."
        ]
      },
      {
        "key": "radii",
        "title": "Les rayons",
        "paragraphs": [
          "Les rayons sont cumulatifs : un impact dans le rayon de danger compte aussi dans les rayons d’orage et d’observation. Ce sont des seuils de distance, pas des sources de données séparées."
        ],
        "items": [
          "Rayon d’observation – zone extérieure pour l’observation précoce.",
          "Rayon d’orage – zone plus proche demandant une vigilance accrue.",
          "Rayon de danger – proximité immédiate particulièrement importante."
        ],
        "notes": [
          "Le rayon de danger est limité à 250 km au maximum."
        ]
      },
      {
        "key": "location",
        "title": "Emplacement de référence",
        "paragraphs": [
          "L’emplacement de référence détermine le point depuis lequel les distances et directions sont calculées. Gewitterradar détecte dynamiquement les entités person.* et zone.*. Quand l’emplacement d’une personne change, les distances sont recalculées à partir des données Home Assistant actuelles."
        ],
        "notes": [
          "Un emplacement de référence incorrect entraîne des distances, des évaluations de rayon et des directions de boussole incorrectes."
        ]
      },
      {
        "key": "functions",
        "title": "Fonctions importantes",
        "entries": [
          [
            "Effets d’aura",
            "visualisent l’activité de foudre sans modifier la détection ni le comptage."
          ],
          [
            "Animation d’alerte",
            "met visuellement en évidence l’activité orageuse pertinente."
          ],
          [
            "Regroupement de carte",
            "regroupe les marqueurs proches pour garder la carte lisible."
          ],
          [
            "Boussole : impact le plus proche",
            "oriente l’affichage vers l’impact détecté le plus proche."
          ],
          [
            "Orientation de l’appareil",
            "peut utiliser l’orientation des appareils mobiles compatibles."
          ],
          [
            "Simulation d’orage",
            "sert uniquement aux tests et au diagnostic et doit rester désactivée en fonctionnement normal."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Réglages de base recommandés",
        "paragraphs": [
          "Pour un démarrage stable, nous recommandons :"
        ],
        "items": [
          "Définir le rayon de la source au moins aussi grand que le rayon d’observation de Gewitterradar.",
          "Laisser le regroupement de carte activé.",
          "Laisser l’animation d’alerte activée.",
          "Régler les effets d’aura selon vos préférences ; ils n’influencent pas la détection.",
          "Laisser la simulation d’orage désactivée en fonctionnement normal.",
          "Activer l’orientation de l’appareil uniquement si elle est nécessaire sur l’appareil utilisé."
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Si quelque chose ne fonctionne pas",
        "entries": [
          [
            "Aucun impact ou trop peu",
            "Vérifiez l’état de la source, son rayon et les entités de foudre utilisées."
          ],
          [
            "Distances ou directions incorrectes",
            "Vérifiez l’emplacement de référence et l’unité de distance."
          ],
          [
            "Le choix de langue réapparaît",
            "Vérifiez que le package Gewitterradar actuel et l’assistant d’initialisation sont installés."
          ],
          [
            "Affichage inchangé après mise à jour",
            "Rechargez complètement le cache du navigateur ou de l’application et vérifiez que le JavaScript actuel est utilisé."
          ],
          [
            "Comportement étrange ou carte en double",
            "Une seule ressource de module Gewitterradar doit être active dans Home Assistant. L’intégration native et la ressource Dashboard/HACS ne doivent pas enregistrer simultanément la même carte personnalisée."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Les données de foudre peuvent produire de très nombreux changements d’état. Pour garder Recorder léger sur le long terme, nous recommandons d’exclure les entités et motifs suivants."
        ],
        "recorder": true,
        "notes": [
          "Si une section recorder: existe déjà, fusionnez-y ces entrées. Ne créez pas un second bloc recorder: de premier niveau.",
          "Ces exclusions ne désactivent PAS les états en direct utilisés par Gewitterradar.",
          "Les données historiques existantes ne sont pas supprimées automatiquement.",
          "Les motifs génériques prennent en charge plusieurs détecteurs ou points d’observation, quel que soit le préfixe des entités."
        ]
      }
    ]
  },
  "Nederlands": {
    "menuTitle": "Hulp & aanwijzingen",
    "title": "Hulp & aanwijzingen",
    "subtitle": "Een korte gids om Gewitterradar betrouwbaar en begrijpelijk te laten werken.",
    "close": "Hulp sluiten",
    "copy": "YAML kopiëren",
    "copied": "Gekopieerd",
    "copyFailed": "Kopiëren niet mogelijk — selecteer de code.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Vereisten",
        "paragraphs": [
          "Gewitterradar verwerkt de bliksemgegevens die Home Assistant van de ingestelde detectiebron ontvangt. Controleer daar de juiste referentielocatie en stel de bronradius minstens zo groot in als de observatieradius in Gewitterradar. Gewitterradar kan inslagen die al door de bron zijn weggefilterd niet tonen of beoordelen."
        ],
        "notes": [
          "Bij meerdere detectoren of observatiepunten moeten de gebruikte entiteiten eenduidig bij het gewenste referentiepunt horen."
        ]
      },
      {
        "key": "radii",
        "title": "De stralen",
        "paragraphs": [
          "De stralen zijn cumulatief: een inslag binnen de gevarenradius telt ook binnen de onweers- en observatieradius. Het zijn afstandsdrempels, geen afzonderlijke gegevensbronnen."
        ],
        "items": [
          "Observatieradius – buitenste gebied voor vroege observatie.",
          "Onweersradius – dichter gebied dat extra aandacht vraagt.",
          "Gevarenradius – directe omgeving met bijzonder hoge relevantie."
        ],
        "notes": [
          "De gevarenradius is begrensd op maximaal 250 km."
        ]
      },
      {
        "key": "location",
        "title": "Referentielocatie",
        "paragraphs": [
          "De referentielocatie bepaalt vanaf welk punt afstanden en richtingen worden berekend. Gewitterradar detecteert person.*- en zone.*-entiteiten dynamisch. Als de locatie van een persoon verandert, worden afstanden opnieuw berekend met de actuele Home Assistant-gegevens."
        ],
        "notes": [
          "Een verkeerde referentielocatie veroorzaakt verkeerde afstanden, radiusbeoordelingen en kompasrichtingen."
        ]
      },
      {
        "key": "functions",
        "title": "Belangrijke functies",
        "entries": [
          [
            "Aura-effecten",
            "visualiseren bliksemactiviteit maar veranderen detectie of telling niet."
          ],
          [
            "Waarschuwingsanimatie",
            "benadrukt relevante onweersactiviteit visueel."
          ],
          [
            "Kaartgroepering",
            "voegt nabije inslagmarkeringen samen en houdt de kaart overzichtelijk."
          ],
          [
            "Kompas: dichtstbijzijnde inslag",
            "richt de weergave op de dichtstbijzijnde gedetecteerde inslag."
          ],
          [
            "Apparaatoriëntatie",
            "kan op ondersteunde mobiele apparaten de oriëntatie gebruiken."
          ],
          [
            "Onweerssimulatie",
            "is alleen bedoeld voor tests en diagnose en moet normaal uitgeschakeld blijven."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Aanbevolen basisinstellingen",
        "paragraphs": [
          "Voor een stabiele start adviseren we:"
        ],
        "items": [
          "Stel de bronradius minstens zo groot in als de Gewitterradar-observatieradius.",
          "Laat kaartgroepering ingeschakeld.",
          "Laat de waarschuwingsanimatie ingeschakeld.",
          "Pas aura-effecten naar wens aan; ze beïnvloeden de detectie niet.",
          "Laat onweerssimulatie tijdens normaal gebruik uitgeschakeld.",
          "Schakel apparaat­oriëntatie alleen in wanneer die op het gebruikte mobiele apparaat nodig is."
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Als iets niet werkt",
        "entries": [
          [
            "Geen of te weinig inslagen",
            "Controleer de bronstatus, bronradius en gebruikte bliksementiteiten."
          ],
          [
            "Afstanden of richtingen lijken verkeerd",
            "Controleer referentielocatie en afstandseenheid."
          ],
          [
            "Taalkeuze blijft terugkomen",
            "Controleer of het actuele Gewitterradar-package en de initialisatiehelper zijn geïnstalleerd."
          ],
          [
            "Weergave na update onveranderd",
            "Laad de browser-/appcache volledig opnieuw en controleer dat het actuele JavaScript-bestand wordt gebruikt."
          ],
          [
            "Vreemd gedrag of dubbele kaart",
            "Er mag slechts ÉÉN Gewitterradar-moduleresource actief zijn in Home Assistant. De native integratie en Dashboard-/HACS-resource mogen dezelfde custom card niet tegelijk registreren."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Bliksemgegevens kunnen zeer veel statuswijzigingen veroorzaken. Voor een slanke Recorder-configuratie op lange termijn adviseren we de volgende entiteiten en patronen uit te sluiten."
        ],
        "recorder": true,
        "notes": [
          "Voeg deze regels toe aan een bestaande recorder:-sectie. Maak geen tweede recorder:-blok op het hoogste niveau.",
          "De uitsluitingen schakelen live-statussen voor Gewitterradar NIET uit.",
          "Bestaande historische gegevens worden niet automatisch verwijderd.",
          "De jokerpatronen ondersteunen meerdere detectoren of observatiepunten, ongeacht het entiteitsvoorvoegsel."
        ]
      }
    ]
  },
  "Polski": {
    "menuTitle": "Pomoc i wskazówki",
    "title": "Pomoc i wskazówki",
    "subtitle": "Krótki przewodnik, aby Gewitterradar działał niezawodnie i był łatwy do zrozumienia.",
    "close": "Zamknij pomoc",
    "copy": "Kopiuj YAML",
    "copied": "Skopiowano",
    "copyFailed": "Nie można skopiować — zaznacz kod.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Wymagania",
        "paragraphs": [
          "Gewitterradar przetwarza dane o wyładowaniach, które Home Assistant otrzymuje ze skonfigurowanego źródła detekcji. Sprawdź tam właściwą lokalizację odniesienia i ustaw promień źródła co najmniej tak duży jak promień obserwacji w Gewitterradar. Gewitterradar nie może wyświetlać ani oceniać wyładowań odfiltrowanych już przez źródło."
        ],
        "notes": [
          "Jeśli dostępnych jest kilka detektorów lub punktów obserwacyjnych, używane encje muszą jednoznacznie należeć do właściwego punktu odniesienia."
        ]
      },
      {
        "key": "radii",
        "title": "Promienie",
        "paragraphs": [
          "Promienie nakładają się: wyładowanie w promieniu zagrożenia liczy się także w promieniu burzy i obserwacji. Są to progi odległości, a nie oddzielne źródła danych."
        ],
        "items": [
          "Promień obserwacji – zewnętrzny obszar wczesnej obserwacji.",
          "Promień burzy – bliższy obszar wymagający większej uwagi.",
          "Promień zagrożenia – bezpośrednie otoczenie o szczególnym znaczeniu."
        ],
        "notes": [
          "Promień zagrożenia jest ograniczony do maksymalnie 250 km."
        ]
      },
      {
        "key": "location",
        "title": "Lokalizacja odniesienia",
        "paragraphs": [
          "Lokalizacja odniesienia określa punkt, od którego obliczane są odległości i kierunki. Gewitterradar dynamicznie wykrywa encje person.* i zone.*. Po zmianie lokalizacji osoby odległości są obliczane ponownie z bieżących danych Home Assistant."
        ],
        "notes": [
          "Błędna lokalizacja odniesienia powoduje błędne odległości, ocenę promieni i kierunki kompasu."
        ]
      },
      {
        "key": "functions",
        "title": "Ważne funkcje",
        "entries": [
          [
            "Efekty aury",
            "wizualizują aktywność wyładowań, ale nie zmieniają wykrywania ani zliczania."
          ],
          [
            "Animacja ostrzeżenia",
            "wyróżnia wizualnie istotną aktywność burzową."
          ],
          [
            "Grupowanie mapy",
            "łączy pobliskie znaczniki i utrzymuje czytelność mapy."
          ],
          [
            "Kompas: najbliższe wyładowanie",
            "kieruje widok na najbliższe wykryte wyładowanie."
          ],
          [
            "Orientacja urządzenia",
            "może uwzględniać orientację obsługiwanych urządzeń mobilnych."
          ],
          [
            "Symulacja burzy",
            "służy wyłącznie do testów i diagnostyki i powinna być wyłączona podczas normalnej pracy."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Zalecane ustawienia podstawowe",
        "paragraphs": [
          "Dla stabilnego startu zalecamy:"
        ],
        "items": [
          "Ustaw promień źródła co najmniej tak duży jak promień obserwacji Gewitterradar.",
          "Pozostaw włączone grupowanie mapy.",
          "Pozostaw włączoną animację ostrzeżenia.",
          "Dostosuj efekty aury do upodobań; nie wpływają na wykrywanie.",
          "Pozostaw symulację burzy wyłączoną podczas normalnej pracy.",
          "Włącz orientację urządzenia tylko wtedy, gdy jest potrzebna na używanym urządzeniu mobilnym."
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Gdy coś nie działa",
        "entries": [
          [
            "Brak lub za mało wyładowań",
            "Sprawdź stan źródła, promień źródła i używane encje wyładowań."
          ],
          [
            "Odległości lub kierunki są błędne",
            "Sprawdź lokalizację odniesienia i jednostkę odległości."
          ],
          [
            "Wybór języka ciągle wraca",
            "Sprawdź, czy zainstalowano aktualny pakiet Gewitterradar i helper inicjalizacji."
          ],
          [
            "Wygląd nie zmienił się po aktualizacji",
            "Całkowicie przeładuj pamięć podręczną przeglądarki/aplikacji i upewnij się, że używany jest aktualny plik JavaScript."
          ],
          [
            "Nietypowe zachowanie lub podwójna karta",
            "W Home Assistant może być aktywny tylko JEDEN zasób modułu Gewitterradar. Integracja natywna i zasób Dashboard/HACS nie mogą jednocześnie rejestrować tej samej karty niestandardowej."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Dane o wyładowaniach mogą generować bardzo wiele zmian stanu. Aby Recorder pozostał lekki w długim okresie, zalecamy wykluczenie poniższych encji i wzorców."
        ],
        "recorder": true,
        "notes": [
          "Jeśli sekcja recorder: już istnieje, dodaj do niej te wpisy. Nie twórz drugiego bloku recorder: najwyższego poziomu.",
          "Wykluczenia NIE wyłączają stanów na żywo używanych przez Gewitterradar.",
          "Istniejące dane historyczne nie są automatycznie usuwane.",
          "Wzorce wieloznaczne obsługują wiele detektorów lub punktów obserwacyjnych niezależnie od prefiksu encji."
        ]
      }
    ]
  },
  "Português": {
    "menuTitle": "Ajuda e notas",
    "title": "Ajuda e notas",
    "subtitle": "Um guia breve para manter o Gewitterradar fiável e fácil de compreender.",
    "close": "Fechar ajuda",
    "copy": "Copiar YAML",
    "copied": "Copiado",
    "copyFailed": "Não foi possível copiar — selecione o código.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Pré-requisitos",
        "paragraphs": [
          "O Gewitterradar processa os dados de relâmpagos que o Home Assistant recebe da fonte de deteção configurada. Verifique aí a localização de referência correta e defina o raio da fonte pelo menos tão grande como o raio de observação do Gewitterradar. O Gewitterradar não pode mostrar nem avaliar descargas já filtradas pela fonte."
        ],
        "notes": [
          "Se existirem vários detetores ou pontos de observação, as entidades utilizadas devem pertencer claramente ao ponto de referência pretendido."
        ]
      },
      {
        "key": "radii",
        "title": "Os raios",
        "paragraphs": [
          "Os raios são cumulativos: uma descarga dentro do raio de perigo também conta nos raios de tempestade e de observação. São limites de distância, não fontes de dados separadas."
        ],
        "items": [
          "Raio de observação – área exterior para observação antecipada.",
          "Raio de tempestade – área mais próxima que exige maior atenção.",
          "Raio de perigo – proximidade imediata com relevância especialmente elevada."
        ],
        "notes": [
          "O raio de perigo está limitado a um máximo de 250 km."
        ]
      },
      {
        "key": "location",
        "title": "Localização de referência",
        "paragraphs": [
          "A localização de referência determina o ponto a partir do qual são calculadas distâncias e direções. O Gewitterradar deteta dinamicamente entidades person.* e zone.*. Quando a localização de uma pessoa muda, as distâncias são recalculadas com os dados atuais do Home Assistant."
        ],
        "notes": [
          "Uma localização de referência incorreta origina distâncias, avaliações de raio e direções da bússola incorretas."
        ]
      },
      {
        "key": "functions",
        "title": "Funções importantes",
        "entries": [
          [
            "Efeitos de aura",
            "visualizam a atividade de relâmpagos, mas não alteram a deteção nem a contagem."
          ],
          [
            "Animação de aviso",
            "realça visualmente atividade de trovoada relevante."
          ],
          [
            "Agrupamento do mapa",
            "combina marcadores próximos e mantém o mapa legível."
          ],
          [
            "Bússola: descarga mais próxima",
            "orienta a vista para a descarga detetada mais próxima."
          ],
          [
            "Orientação do dispositivo",
            "pode utilizar a orientação em dispositivos móveis compatíveis."
          ],
          [
            "Simulação de trovoada",
            "destina-se apenas a testes e diagnóstico e deve permanecer desativada em funcionamento normal."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Definições básicas recomendadas",
        "paragraphs": [
          "Para um início estável recomendamos:"
        ],
        "items": [
          "Definir o raio da fonte pelo menos igual ao raio de observação do Gewitterradar.",
          "Manter o agrupamento do mapa ativado.",
          "Manter a animação de aviso ativada.",
          "Ajustar os efeitos de aura ao gosto pessoal; não influenciam a deteção.",
          "Manter a simulação de trovoada desativada em funcionamento normal.",
          "Ativar a orientação do dispositivo apenas quando necessária no dispositivo móvel utilizado."
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Se algo não funcionar",
        "entries": [
          [
            "Nenhuma ou poucas descargas",
            "Verifique o estado da fonte, o raio da fonte e as entidades de relâmpagos usadas."
          ],
          [
            "Distâncias ou direções parecem erradas",
            "Verifique a localização de referência e a unidade de distância."
          ],
          [
            "A seleção de idioma reaparece",
            "Verifique se o pacote Gewitterradar atual e o auxiliar de inicialização estão instalados."
          ],
          [
            "Visualização inalterada após atualização",
            "Recarregue totalmente a cache do navegador/aplicação e confirme que o JavaScript atual está a ser usado."
          ],
          [
            "Comportamento estranho ou cartão duplicado",
            "Só pode estar ativo UM recurso de módulo Gewitterradar no Home Assistant. A integração nativa e o recurso Dashboard/HACS não podem registar simultaneamente o mesmo cartão personalizado."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Os dados de relâmpagos podem gerar muitas alterações de estado. Para uma configuração Recorder leve a longo prazo, recomendamos excluir as seguintes entidades e padrões."
        ],
        "recorder": true,
        "notes": [
          "Se já existir uma secção recorder:, integre nela estas entradas. Não crie um segundo bloco recorder: de nível superior.",
          "As exclusões NÃO desativam os estados em direto usados pelo Gewitterradar.",
          "Os dados históricos existentes não são removidos automaticamente.",
          "Os padrões wildcard suportam vários detetores ou pontos de observação, independentemente do prefixo da entidade."
        ]
      }
    ]
  },
  "Svenska": {
    "menuTitle": "Hjälp och anvisningar",
    "title": "Hjälp och anvisningar",
    "subtitle": "En kort guide som gör Gewitterradar tillförlitligt och lätt att förstå.",
    "close": "Stäng hjälpen",
    "copy": "Kopiera YAML",
    "copied": "Kopierat",
    "copyFailed": "Det gick inte att kopiera – markera koden.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Förutsättningar",
        "paragraphs": [
          "Gewitterradar behandlar de blixtdata som Home Assistant tar emot från den konfigurerade detektionskällan. Kontrollera rätt referensplats där och ställ in källradien minst lika stor som observationsradien i Gewitterradar. Gewitterradar kan inte visa eller utvärdera blixtar som redan har filtrerats bort av källan."
        ],
        "notes": [
          "Om flera blixtdetektorer eller observationspunkter finns måste de använda entiteterna tydligt tillhöra önskad referenspunkt."
        ]
      },
      {
        "key": "radii",
        "title": "Radierna",
        "paragraphs": [
          "Radierna är kumulativa: en blixt inom faroradien räknas även inom åsk- och observationsradien. Områdena är avståndsgränser, inte separata datakällor."
        ],
        "items": [
          "Observationsradie – yttre område för tidig observation.",
          "Åskradie – närmare område som kräver ökad uppmärksamhet.",
          "Faroradie – omedelbart närområde med särskilt hög relevans."
        ],
        "notes": [
          "Faroradien är begränsad till högst 250 km."
        ]
      },
      {
        "key": "location",
        "title": "Referensplats",
        "paragraphs": [
          "Referensplatsen bestämmer punkten som avstånd och riktningar beräknas från. Gewitterradar identifierar person.*- och zone.*-entiteter dynamiskt. När en persons plats ändras beräknas avstånden på nytt med aktuella Home Assistant-data."
        ],
        "notes": [
          "En felaktig referensplats ger felaktiga avstånd, radiebedömningar och kompassriktningar."
        ]
      },
      {
        "key": "functions",
        "title": "Viktiga funktioner",
        "entries": [
          [
            "Auraeffekter",
            "visualiserar blixtaktivitet men ändrar inte detektering eller räkning."
          ],
          [
            "Varningsanimation",
            "framhäver relevant åskaktivitet visuellt."
          ],
          [
            "Kartgruppering",
            "samlar närliggande blixtmarkörer och håller kartan tydlig."
          ],
          [
            "Kompass: närmaste blixt",
            "riktar visningen mot den närmaste detekterade blixten."
          ],
          [
            "Enhetsorientering",
            "kan använda orienteringen på mobila enheter som stöds."
          ],
          [
            "Åsksimulering",
            "är endast avsedd för test och diagnostik och bör vara avstängd under normal drift."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Rekommenderade grundinställningar",
        "paragraphs": [
          "För en stabil start rekommenderar vi:"
        ],
        "items": [
          "Ställ in källradien minst lika stor som Gewitterradars observationsradie.",
          "Låt kartgruppering vara aktiverad.",
          "Låt varningsanimationen vara aktiverad.",
          "Anpassa auraeffekterna efter smak; de påverkar inte detekteringen.",
          "Låt åsksimulering vara avstängd under normal drift.",
          "Aktivera enhetsorientering endast när den behövs på den mobila enheten."
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Om något inte fungerar",
        "entries": [
          [
            "Inga eller för få blixtar",
            "Kontrollera källans status, källradien och de blixtentiteter som används."
          ],
          [
            "Avstånd eller riktningar verkar fel",
            "Kontrollera referensplats och avståndsenhet."
          ],
          [
            "Språkvalet visas igen",
            "Kontrollera att aktuellt Gewitterradar-paket och initialiseringshjälparen är installerade."
          ],
          [
            "Visningen är oförändrad efter uppdatering",
            "Ladda om webbläsarens/appens cache helt och säkerställ att aktuell JavaScript-fil används."
          ],
          [
            "Oväntat beteende eller dubbelt kort",
            "Endast EN Gewitterradar-modulresurs får vara aktiv i Home Assistant. Den inbyggda integrationen och Dashboard-/HACS-resursen får inte registrera samma anpassade kort samtidigt."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Blixtdata kan skapa väldigt många tillståndsändringar. För en slimmad Recorder-konfiguration över tid rekommenderar vi att följande entiteter och mönster undantas."
        ],
        "recorder": true,
        "notes": [
          "Om en recorder:-sektion redan finns ska posterna läggas till där. Skapa inte ett andra recorder:-block på toppnivå.",
          "Undantagen inaktiverar INTE de live-tillstånd som Gewitterradar använder.",
          "Befintliga historiska data tas inte bort automatiskt.",
          "Jokermönstren stöder flera blixtdetektorer eller observationspunkter oberoende av entitetsprefix."
        ]
      }
    ]
  },
  "Italiano": {
    "menuTitle": "Aiuto e note",
    "title": "Aiuto e note",
    "subtitle": "Una guida concisa per mantenere Gewitterradar affidabile e facile da comprendere.",
    "close": "Chiudi aiuto",
    "copy": "Copia YAML",
    "copied": "Copiato",
    "copyFailed": "Copia non disponibile — seleziona il codice.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Prerequisiti",
        "paragraphs": [
          "Gewitterradar elabora i dati dei fulmini che Home Assistant riceve dalla sorgente di rilevamento configurata. Verifica lì la posizione di riferimento corretta e imposta il raggio della sorgente almeno pari al raggio di osservazione di Gewitterradar. Gewitterradar non può mostrare o valutare scariche già filtrate dalla sorgente."
        ],
        "notes": [
          "Se sono presenti più rilevatori o punti di osservazione, le entità usate devono appartenere chiaramente al punto di riferimento desiderato."
        ]
      },
      {
        "key": "radii",
        "title": "I raggi",
        "paragraphs": [
          "I raggi sono cumulativi: una scarica nel raggio di pericolo conta anche nei raggi di temporale e osservazione. Sono soglie di distanza, non sorgenti dati separate."
        ],
        "items": [
          "Raggio di osservazione – area esterna per l’osservazione anticipata.",
          "Raggio di temporale – area più vicina che richiede maggiore attenzione.",
          "Raggio di pericolo – zona immediata di particolare rilevanza."
        ],
        "notes": [
          "Il raggio di pericolo è limitato a un massimo di 250 km."
        ]
      },
      {
        "key": "location",
        "title": "Posizione di riferimento",
        "paragraphs": [
          "La posizione di riferimento determina il punto da cui vengono calcolate distanze e direzioni. Gewitterradar rileva dinamicamente le entità person.* e zone.*. Quando cambia la posizione di una persona, le distanze vengono ricalcolate con i dati correnti di Home Assistant."
        ],
        "notes": [
          "Una posizione di riferimento errata produce distanze, valutazioni dei raggi e direzioni della bussola errate."
        ]
      },
      {
        "key": "functions",
        "title": "Funzioni importanti",
        "entries": [
          [
            "Effetti aura",
            "visualizzano l’attività dei fulmini ma non modificano rilevamento o conteggio."
          ],
          [
            "Animazione di avviso",
            "evidenzia visivamente l’attività temporalesca rilevante."
          ],
          [
            "Raggruppamento mappa",
            "unisce i marcatori vicini e mantiene ordinata la mappa."
          ],
          [
            "Bussola: fulmine più vicino",
            "orienta la vista verso la scarica rilevata più vicina."
          ],
          [
            "Orientamento dispositivo",
            "può utilizzare l’orientamento sui dispositivi mobili supportati."
          ],
          [
            "Simulazione temporale",
            "serve solo per test e diagnostica e deve restare disattivata durante l’uso normale."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Impostazioni di base consigliate",
        "paragraphs": [
          "Per un avvio stabile consigliamo:"
        ],
        "items": [
          "Impostare il raggio della sorgente almeno pari al raggio di osservazione di Gewitterradar.",
          "Lasciare attivo il raggruppamento della mappa.",
          "Lasciare attiva l’animazione di avviso.",
          "Regolare gli effetti aura a piacere; non influiscono sul rilevamento.",
          "Lasciare disattivata la simulazione temporale durante l’uso normale.",
          "Attivare l’orientamento dispositivo solo quando serve sul dispositivo mobile usato."
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Se qualcosa non funziona",
        "entries": [
          [
            "Nessun fulmine o troppo pochi",
            "Controlla stato della sorgente, raggio sorgente ed entità fulmine usate."
          ],
          [
            "Distanze o direzioni errate",
            "Controlla posizione di riferimento e unità di distanza."
          ],
          [
            "La selezione lingua ricompare",
            "Verifica che siano installati il package Gewitterradar corrente e l’helper di inizializzazione."
          ],
          [
            "Aspetto invariato dopo l’aggiornamento",
            "Ricarica completamente la cache del browser/app e verifica che venga usato il JavaScript corrente."
          ],
          [
            "Comportamento anomalo o scheda doppia",
            "In Home Assistant può essere attiva una sola risorsa modulo Gewitterradar. L’integrazione nativa e la risorsa Dashboard/HACS non devono registrare contemporaneamente la stessa custom card."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "I dati dei fulmini possono generare moltissimi cambiamenti di stato. Per una configurazione Recorder snella nel tempo consigliamo di escludere le seguenti entità e i relativi modelli."
        ],
        "recorder": true,
        "notes": [
          "Se esiste già una sezione recorder:, integra lì queste voci. Non creare un secondo blocco recorder: di primo livello.",
          "Le esclusioni NON disattivano gli stati live usati da Gewitterradar.",
          "I dati storici esistenti non vengono rimossi automaticamente.",
          "I modelli wildcard supportano più rilevatori o punti di osservazione indipendentemente dal prefisso delle entità."
        ]
      }
    ]
  },
  "Norsk bokmål": {
    "menuTitle": "Hjelp og merknader",
    "title": "Hjelp og merknader",
    "subtitle": "En kort veiledning som holder Gewitterradar pålitelig og lett å forstå.",
    "close": "Lukk hjelp",
    "copy": "Kopier YAML",
    "copied": "Kopiert",
    "copyFailed": "Kopiering er ikke tilgjengelig – marker koden.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Forutsetninger",
        "paragraphs": [
          "Gewitterradar behandler lyndataene som Home Assistant mottar fra den konfigurerte lyndeteksjonskilden. Kontroller riktig referansested der, og sett kilderadius minst like stor som observasjonsradiusen i Gewitterradar. Gewitterradar kan ikke vise eller vurdere lynnedslag som allerede er filtrert bort av kilden."
        ],
        "notes": [
          "Hvis flere lyndetektorer eller observasjonspunkter finnes, må entitetene som brukes tydelig tilhøre ønsket referansepunkt."
        ]
      },
      {
        "key": "radii",
        "title": "Radiene",
        "paragraphs": [
          "Radiene er kumulative: Et lynnedslag innenfor fareradiusen teller også innenfor torden- og observasjonsradiusen. Områdene er avstandsgrenser, ikke separate datakilder."
        ],
        "items": [
          "Observasjonsradius – ytre område for tidlig observasjon.",
          "Tordenradius – nærmere område som krever økt oppmerksomhet.",
          "Fareradius – umiddelbar nærhet med særlig høy relevans."
        ],
        "notes": [
          "Fareradiusen er begrenset til maksimalt 250 km."
        ]
      },
      {
        "key": "location",
        "title": "Referansested",
        "paragraphs": [
          "Referansestedet bestemmer punktet som avstander og retninger beregnes fra. Gewitterradar oppdager person.*- og zone.*-entiteter dynamisk. Når en persons plassering endres, beregnes avstandene på nytt fra gjeldende Home Assistant-data."
        ],
        "notes": [
          "Et feil referansested gir feil avstander, radiusvurderinger og kompassretninger."
        ]
      },
      {
        "key": "functions",
        "title": "Viktige funksjoner",
        "entries": [
          [
            "Auraeffekter",
            "visualiserer lynaktivitet, men endrer ikke deteksjon eller telling."
          ],
          [
            "Varselanimasjon",
            "fremhever relevant tordenværaktivitet visuelt."
          ],
          [
            "Kartgruppering",
            "samler nærliggende markører og holder kartet oversiktlig."
          ],
          [
            "Kompass: nærmeste lyn",
            "retter visningen mot nærmeste registrerte lynnedslag."
          ],
          [
            "Enhetsretning",
            "kan bruke retningen på støttede mobilenheter."
          ],
          [
            "Tordenværsimulering",
            "er bare ment for test og diagnostikk og bør være avslått under normal drift."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Anbefalte grunninnstillinger",
        "paragraphs": [
          "For en stabil start anbefaler vi:"
        ],
        "items": [
          "Sett kilderadius minst like stor som Gewitterradars observasjonsradius.",
          "La kartgruppering være aktivert.",
          "La varselanimasjonen være aktivert.",
          "Tilpass auraeffektene etter smak; de påvirker ikke deteksjonen.",
          "La tordenværsimulering være avslått under normal drift.",
          "Aktiver enhetsretning bare når den trengs på mobilenheten som brukes."
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Hvis noe ikke fungerer",
        "entries": [
          [
            "Ingen eller for få lynnedslag",
            "Kontroller kildestatus, kilderadius og lynentitetene som brukes."
          ],
          [
            "Avstander eller retninger virker feil",
            "Kontroller referansested og avstandsenhet."
          ],
          [
            "Språkvalget kommer stadig tilbake",
            "Kontroller at gjeldende Gewitterradar-pakke og initialiseringshjelper er installert."
          ],
          [
            "Visningen er uendret etter oppdatering",
            "Last nettleser-/appbufferen helt på nytt og kontroller at gjeldende JavaScript-fil brukes."
          ],
          [
            "Uventet oppførsel eller dobbelt kort",
            "Bare ÉN Gewitterradar-modulressurs kan være aktiv i Home Assistant. Den native integrasjonen og Dashboard-/HACS-ressursen må ikke registrere samme egendefinerte kort samtidig."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Lyndata kan skape svært mange tilstandsendringer. For en slank Recorder-konfigurasjon over tid anbefaler vi å utelate følgende entiteter og mønstre."
        ],
        "recorder": true,
        "notes": [
          "Hvis en recorder:-seksjon allerede finnes, legg oppføringene til der. Ikke opprett en ny recorder:-blokk på toppnivå.",
          "Unntakene deaktiverer IKKE live-tilstandene som Gewitterradar bruker.",
          "Eksisterende historiske data fjernes ikke automatisk.",
          "Jokermønstrene støtter flere lyndetektorer eller observasjonspunkter uavhengig av entitetsprefiks."
        ]
      }
    ]
  },
  "Suomi": {
    "menuTitle": "Ohje ja huomautukset",
    "title": "Ohje ja huomautukset",
    "subtitle": "Tiivis opas Gewitterradarin luotettavaan ja ymmärrettävään käyttöön.",
    "close": "Sulje ohje",
    "copy": "Kopioi YAML",
    "copied": "Kopioitu",
    "copyFailed": "Kopiointi ei onnistu – valitse koodi.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Edellytykset",
        "paragraphs": [
          "Gewitterradar käsittelee salamadataa, jonka Home Assistant saa määritetystä salamapaikannuslähteestä. Tarkista lähteessä oikea viitesijainti ja aseta lähteen säde vähintään Gewitterradarin havaintosäteen suuruiseksi. Gewitterradar ei voi näyttää tai arvioida salamoita, jotka lähde on jo suodattanut pois."
        ],
        "notes": [
          "Jos käytössä on useita paikantimia tai havaintopisteitä, käytettyjen entiteettien on kuuluttava yksiselitteisesti haluttuun viitepisteeseen."
        ]
      },
      {
        "key": "radii",
        "title": "Säteet",
        "paragraphs": [
          "Säteet ovat kumulatiivisia: vaarasäteen sisällä oleva salama lasketaan myös ukkos- ja havaintosäteeseen. Alueet ovat etäisyysrajoja, eivät erillisiä tietolähteitä."
        ],
        "items": [
          "Havaintosäde – ulompi alue varhaiseen havainnointiin.",
          "Ukkossäde – lähempi alue, joka vaatii enemmän huomiota.",
          "Vaarasäde – välitön lähialue, jolla on erityisen suuri merkitys."
        ],
        "notes": [
          "Vaarasäde on rajoitettu enintään 250 kilometriin."
        ]
      },
      {
        "key": "location",
        "title": "Viitesijainti",
        "paragraphs": [
          "Viitesijainti määrittää pisteen, josta etäisyydet ja suunnat lasketaan. Gewitterradar tunnistaa person.*- ja zone.*-entiteetit dynaamisesti. Kun henkilön sijainti muuttuu, etäisyydet lasketaan uudelleen Home Assistantin nykyisistä tiedoista."
        ],
        "notes": [
          "Virheellinen viitesijainti johtaa vääriin etäisyyksiin, sädearvioihin ja kompassisuuntiin."
        ]
      },
      {
        "key": "functions",
        "title": "Tärkeät toiminnot",
        "entries": [
          [
            "Aura-tehosteet",
            "havainnollistavat salamatoimintaa mutta eivät muuta tunnistusta tai laskentaa."
          ],
          [
            "Varoitusanimaatio",
            "korostaa olennaista ukkostoimintaa visuaalisesti."
          ],
          [
            "Karttaryhmittely",
            "yhdistää läheiset salamamerkit ja pitää kartan selkeänä."
          ],
          [
            "Kompassi: lähin salama",
            "suuntaa näytön lähimpään havaittuun salamaan."
          ],
          [
            "Laitteen suunta",
            "voi käyttää tuettujen mobiililaitteiden suuntausta."
          ],
          [
            "Ukkossimulaatio",
            "on tarkoitettu vain testaukseen ja diagnostiikkaan ja tulee pitää pois käytöstä normaalisti."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Suositellut perusasetukset",
        "paragraphs": [
          "Vakaaseen aloitukseen suosittelemme:"
        ],
        "items": [
          "Aseta salamälähteen säde vähintään Gewitterradarin havaintosäteen suuruiseksi.",
          "Pidä karttaryhmittely käytössä.",
          "Pidä varoitusanimaatio käytössä.",
          "Säädä aura-tehosteet mieltymyksen mukaan; ne eivät vaikuta tunnistukseen.",
          "Pidä ukkossimulaatio pois käytöstä normaalissa käytössä.",
          "Ota laitteen suunta käyttöön vain, jos sitä tarvitaan kyseisellä mobiililaitteella."
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Jos jokin ei toimi",
        "entries": [
          [
            "Salamoita ei näy tai niitä on liian vähän",
            "Tarkista lähteen tila, lähdesäde ja käytetyt salamaentiteetit."
          ],
          [
            "Etäisyydet tai suunnat näyttävät vääriltä",
            "Tarkista viitesijainti ja etäisyysyksikkö."
          ],
          [
            "Kielivalinta palaa jatkuvasti",
            "Tarkista, että nykyinen Gewitterradar-paketti ja alustuksen apuentiteetti on asennettu."
          ],
          [
            "Näkymä ei muutu päivityksen jälkeen",
            "Lataa selaimen tai sovelluksen välimuisti kokonaan uudelleen ja varmista nykyisen JavaScript-tiedoston käyttö."
          ],
          [
            "Outo toiminta tai kaksinkertainen kortti",
            "Home Assistantissa saa olla aktiivisena vain YKSI Gewitterradar-moduuliresurssi. Natiivi integraatio ja Dashboard-/HACS-resurssi eivät saa rekisteröidä samaa mukautettua korttia yhtä aikaa."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Salamadata voi synnyttää erittäin paljon tilamuutoksia. Pitkällä aikavälillä kevyttä Recorder-määritystä varten suosittelemme seuraavien entiteettien ja mallien poissulkemista."
        ],
        "recorder": true,
        "notes": [
          "Jos recorder:-osio on jo olemassa, yhdistä nämä rivit siihen. Älä luo toista ylätason recorder:-lohkoa.",
          "Poissulkemiset EIVÄT poista Gewitterradarin käyttämiä reaaliaikaisia tiloja käytöstä.",
          "Olemassa olevia historiatietoja ei poisteta automaattisesti.",
          "Jokerimerkkimallit tukevat useita paikantimia tai havaintopisteitä entiteetin etuliitteestä riippumatta."
        ]
      }
    ]
  },
  "Čeština": {
    "menuTitle": "Nápověda a poznámky",
    "title": "Nápověda a poznámky",
    "subtitle": "Stručný průvodce pro spolehlivý a srozumitelný provoz Gewitterradaru.",
    "close": "Zavřít nápovědu",
    "copy": "Kopírovat YAML",
    "copied": "Zkopírováno",
    "copyFailed": "Kopírování není dostupné – označte kód.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Předpoklady",
        "paragraphs": [
          "Gewitterradar zpracovává data o blescích, která Home Assistant přijímá z nastaveného zdroje detekce. Zkontrolujte v něm správnou referenční polohu a nastavte poloměr zdroje alespoň stejně velký jako pozorovací poloměr v Gewitterradaru. Gewitterradar nemůže zobrazit ani vyhodnotit výboje, které zdroj již odfiltroval."
        ],
        "notes": [
          "Pokud existuje více detektorů nebo pozorovacích bodů, musí použité entity jednoznačně patřit k požadovanému referenčnímu bodu."
        ]
      },
      {
        "key": "radii",
        "title": "Poloměry",
        "paragraphs": [
          "Poloměry se překrývají: výboj v nebezpečném poloměru se počítá také do bouřkového a pozorovacího poloměru. Jde o prahové vzdálenosti, nikoli oddělené zdroje dat."
        ],
        "items": [
          "Pozorovací poloměr – vnější oblast pro včasné pozorování.",
          "Bouřkový poloměr – bližší oblast vyžadující zvýšenou pozornost.",
          "Nebezpečný poloměr – bezprostřední okolí s mimořádnou důležitostí."
        ],
        "notes": [
          "Nebezpečný poloměr je omezen maximálně na 250 km."
        ]
      },
      {
        "key": "location",
        "title": "Referenční poloha",
        "paragraphs": [
          "Referenční poloha určuje bod, od kterého se počítají vzdálenosti a směry. Gewitterradar dynamicky rozpoznává entity person.* a zone.*. Když se poloha osoby změní, vzdálenosti se přepočítají z aktuálních dat Home Assistant."
        ],
        "notes": [
          "Nesprávná referenční poloha způsobí chybné vzdálenosti, vyhodnocení poloměrů a směry kompasu."
        ]
      },
      {
        "key": "functions",
        "title": "Důležité funkce",
        "entries": [
          [
            "Efekty aury",
            "znázorňují aktivitu blesků, ale nemění detekci ani počítání."
          ],
          [
            "Výstražná animace",
            "vizuálně zvýrazňuje významnou bouřkovou aktivitu."
          ],
          [
            "Seskupování mapy",
            "spojuje blízké značky a udržuje mapu přehlednou."
          ],
          [
            "Kompas: nejbližší blesk",
            "nasměruje zobrazení k nejbližšímu rozpoznanému výboji."
          ],
          [
            "Orientace zařízení",
            "může využívat orientaci podporovaných mobilních zařízení."
          ],
          [
            "Simulace bouřky",
            "slouží jen k testování a diagnostice a za běžného provozu má zůstat vypnutá."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Doporučená základní nastavení",
        "paragraphs": [
          "Pro stabilní začátek doporučujeme:"
        ],
        "items": [
          "Nastavte poloměr zdroje alespoň stejně velký jako pozorovací poloměr Gewitterradaru.",
          "Ponechte seskupování mapy zapnuté.",
          "Ponechte výstražnou animaci zapnutou.",
          "Nastavte efekty aury podle svých preferencí; detekci neovlivňují.",
          "Za běžného provozu ponechte simulaci bouřky vypnutou.",
          "Orientaci zařízení zapněte jen tehdy, je-li na daném mobilním zařízení potřebná."
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Když něco nefunguje",
        "entries": [
          [
            "Žádné nebo příliš málo výbojů",
            "Zkontrolujte stav zdroje, poloměr zdroje a použité entity blesků."
          ],
          [
            "Vzdálenosti nebo směry vypadají chybně",
            "Zkontrolujte referenční polohu a jednotku vzdálenosti."
          ],
          [
            "Výběr jazyka se stále vrací",
            "Ověřte instalaci aktuálního balíčku Gewitterradar a inicializačního pomocníka."
          ],
          [
            "Zobrazení se po aktualizaci nezměnilo",
            "Úplně obnovte mezipaměť prohlížeče/aplikace a ověřte použití aktuálního souboru JavaScript."
          ],
          [
            "Neobvyklé chování nebo dvojitá karta",
            "V Home Assistant smí být aktivní jen JEDEN modulový prostředek Gewitterradar. Nativní integrace a prostředek Dashboard/HACS nesmějí současně registrovat stejnou vlastní kartu."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Data o blescích mohou vytvářet velmi mnoho změn stavu. Pro dlouhodobě úspornou konfiguraci Recorder doporučujeme vyloučit následující entity a vzory."
        ],
        "recorder": true,
        "notes": [
          "Pokud již existuje sekce recorder:, začleňte položky do ní. Nevytvářejte druhý blok recorder: nejvyšší úrovně.",
          "Vyloučení NEVYPÍNAJÍ živé stavy používané Gewitterradarem.",
          "Stávající historická data se automaticky neodstraní.",
          "Zástupné vzory podporují více detektorů nebo pozorovacích bodů bez ohledu na prefix entity."
        ]
      }
    ]
  },
  "Ελληνικά": {
    "menuTitle": "Βοήθεια και σημειώσεις",
    "title": "Βοήθεια και σημειώσεις",
    "subtitle": "Ένας σύντομος οδηγός για αξιόπιστη και κατανοητή λειτουργία του Gewitterradar.",
    "close": "Κλείσιμο βοήθειας",
    "copy": "Αντιγραφή YAML",
    "copied": "Αντιγράφηκε",
    "copyFailed": "Η αντιγραφή δεν είναι διαθέσιμη — επιλέξτε τον κώδικα.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Προϋποθέσεις",
        "paragraphs": [
          "Το Gewitterradar επεξεργάζεται τα δεδομένα κεραυνών που λαμβάνει το Home Assistant από τη ρυθμισμένη πηγή ανίχνευσης. Ελέγξτε εκεί τη σωστή θέση αναφοράς και ορίστε την ακτίνα πηγής τουλάχιστον ίση με την ακτίνα παρατήρησης του Gewitterradar. Το Gewitterradar δεν μπορεί να εμφανίσει ή να αξιολογήσει κεραυνούς που έχουν ήδη φιλτραριστεί από την πηγή."
        ],
        "notes": [
          "Αν υπάρχουν πολλοί ανιχνευτές ή σημεία παρατήρησης, οι οντότητες που χρησιμοποιούνται πρέπει να αντιστοιχούν σαφώς στο επιθυμητό σημείο αναφοράς."
        ]
      },
      {
        "key": "radii",
        "title": "Οι ακτίνες",
        "paragraphs": [
          "Οι ακτίνες είναι αθροιστικές: ένας κεραυνός μέσα στην ακτίνα κινδύνου μετρά επίσης στις ακτίνες καταιγίδας και παρατήρησης. Πρόκειται για όρια απόστασης, όχι για ξεχωριστές πηγές δεδομένων."
        ],
        "items": [
          "Ακτίνα παρατήρησης – εξωτερική περιοχή για έγκαιρη παρατήρηση.",
          "Ακτίνα καταιγίδας – κοντινότερη περιοχή που απαιτεί αυξημένη προσοχή.",
          "Ακτίνα κινδύνου – άμεση γειτνίαση με ιδιαίτερα υψηλή σημασία."
        ],
        "notes": [
          "Η ακτίνα κινδύνου περιορίζεται σε μέγιστο 250 km."
        ]
      },
      {
        "key": "location",
        "title": "Θέση αναφοράς",
        "paragraphs": [
          "Η θέση αναφοράς καθορίζει το σημείο από το οποίο υπολογίζονται αποστάσεις και κατευθύνσεις. Το Gewitterradar εντοπίζει δυναμικά οντότητες person.* και zone.*. Όταν αλλάζει η θέση ενός ατόμου, οι αποστάσεις επανυπολογίζονται από τα τρέχοντα δεδομένα του Home Assistant."
        ],
        "notes": [
          "Λανθασμένη θέση αναφοράς οδηγεί σε λανθασμένες αποστάσεις, αξιολόγηση ακτίνων και κατευθύνσεις πυξίδας."
        ]
      },
      {
        "key": "functions",
        "title": "Σημαντικές λειτουργίες",
        "entries": [
          [
            "Εφέ αύρας",
            "απεικονίζουν τη δραστηριότητα κεραυνών χωρίς να αλλάζουν την ανίχνευση ή την καταμέτρηση."
          ],
          [
            "Κίνηση προειδοποίησης",
            "τονίζει οπτικά τη σημαντική δραστηριότητα καταιγίδας."
          ],
          [
            "Ομαδοποίηση χάρτη",
            "συνδυάζει κοντινούς δείκτες και διατηρεί τον χάρτη καθαρό."
          ],
          [
            "Πυξίδα: κοντινότερος κεραυνός",
            "στρέφει την προβολή προς τον κοντινότερο ανιχνευμένο κεραυνό."
          ],
          [
            "Προσανατολισμός συσκευής",
            "μπορεί να χρησιμοποιεί τον προσανατολισμό υποστηριζόμενων κινητών συσκευών."
          ],
          [
            "Προσομοίωση καταιγίδας",
            "προορίζεται μόνο για δοκιμή και διάγνωση και πρέπει να παραμένει απενεργοποιημένη στην κανονική λειτουργία."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Προτεινόμενες βασικές ρυθμίσεις",
        "paragraphs": [
          "Για σταθερή εκκίνηση προτείνουμε:"
        ],
        "items": [
          "Ορίστε την ακτίνα πηγής τουλάχιστον ίση με την ακτίνα παρατήρησης του Gewitterradar.",
          "Διατηρήστε ενεργή την ομαδοποίηση χάρτη.",
          "Διατηρήστε ενεργή την κίνηση προειδοποίησης.",
          "Ρυθμίστε τα εφέ αύρας κατά προτίμηση· δεν επηρεάζουν την ανίχνευση.",
          "Διατηρήστε απενεργοποιημένη την προσομοίωση καταιγίδας στην κανονική λειτουργία.",
          "Ενεργοποιήστε τον προσανατολισμό συσκευής μόνο όταν χρειάζεται στη συγκεκριμένη κινητή συσκευή."
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Αν κάτι δεν λειτουργεί",
        "entries": [
          [
            "Καθόλου ή πολύ λίγοι κεραυνοί",
            "Ελέγξτε την κατάσταση της πηγής, την ακτίνα πηγής και τις οντότητες κεραυνών."
          ],
          [
            "Οι αποστάσεις ή κατευθύνσεις φαίνονται λάθος",
            "Ελέγξτε τη θέση αναφοράς και τη μονάδα απόστασης."
          ],
          [
            "Η επιλογή γλώσσας επανεμφανίζεται",
            "Ελέγξτε ότι έχουν εγκατασταθεί το τρέχον πακέτο Gewitterradar και ο βοηθός αρχικοποίησης."
          ],
          [
            "Η προβολή δεν άλλαξε μετά την ενημέρωση",
            "Επαναφορτώστε πλήρως την cache του προγράμματος περιήγησης/εφαρμογής και βεβαιωθείτε ότι χρησιμοποιείται το τρέχον JavaScript."
          ],
          [
            "Παράξενη συμπεριφορά ή διπλή κάρτα",
            "Μόνο ΕΝΑΣ πόρος μονάδας Gewitterradar επιτρέπεται να είναι ενεργός στο Home Assistant. Η εγγενής ενσωμάτωση και ο πόρος Dashboard/HACS δεν πρέπει να καταχωρούν ταυτόχρονα την ίδια προσαρμοσμένη κάρτα."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Τα δεδομένα κεραυνών μπορούν να δημιουργήσουν πάρα πολλές αλλαγές κατάστασης. Για λιτή μακροχρόνια ρύθμιση του Recorder προτείνουμε να εξαιρεθούν οι ακόλουθες οντότητες και τα μοτίβα."
        ],
        "recorder": true,
        "notes": [
          "Αν υπάρχει ήδη ενότητα recorder:, ενσωματώστε εκεί αυτές τις καταχωρίσεις. Μη δημιουργήσετε δεύτερο μπλοκ recorder: ανώτατου επιπέδου.",
          "Οι εξαιρέσεις ΔΕΝ απενεργοποιούν τις ζωντανές καταστάσεις που χρησιμοποιεί το Gewitterradar.",
          "Τα υπάρχοντα ιστορικά δεδομένα δεν διαγράφονται αυτόματα.",
          "Τα μοτίβα wildcard υποστηρίζουν πολλούς ανιχνευτές ή σημεία παρατήρησης ανεξάρτητα από το πρόθεμα οντότητας."
        ]
      }
    ]
  },
  "Magyar": {
    "menuTitle": "Súgó és megjegyzések",
    "title": "Súgó és megjegyzések",
    "subtitle": "Rövid útmutató a Gewitterradar megbízható és érthető működéséhez.",
    "close": "Súgó bezárása",
    "copy": "YAML másolása",
    "copied": "Másolva",
    "copyFailed": "A másolás nem érhető el – jelölje ki a kódot.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Előfeltételek",
        "paragraphs": [
          "A Gewitterradar a Home Assistant által a beállított villámdetektáló forrásból fogadott adatokat dolgozza fel. Ellenőrizze ott a megfelelő referenciahelyet, és a forrás sugarát állítsa legalább akkorára, mint a Gewitterradar megfigyelési sugara. A Gewitterradar nem tudja megjeleníteni vagy értékelni a forrás által már kiszűrt villámokat."
        ],
        "notes": [
          "Ha több detektor vagy megfigyelési pont van, a használt entitásoknak egyértelműen a kívánt referenciaponthoz kell tartozniuk."
        ]
      },
      {
        "key": "radii",
        "title": "A sugarak",
        "paragraphs": [
          "A sugarak egymásra épülnek: a veszélyzónán belüli villám a vihar- és megfigyelési sugárba is beleszámít. Ezek távolsági küszöbök, nem külön adatforrások."
        ],
        "items": [
          "Megfigyelési sugár – külső terület a korai megfigyeléshez.",
          "Viharsugár – közelebbi terület, amely fokozott figyelmet igényel.",
          "Veszélysugár – közvetlen környezet kiemelten nagy jelentőséggel."
        ],
        "notes": [
          "A veszélysugár legfeljebb 250 km lehet."
        ]
      },
      {
        "key": "location",
        "title": "Referenciahely",
        "paragraphs": [
          "A referenciahely határozza meg azt a pontot, amelytől a távolságokat és irányokat számítjuk. A Gewitterradar dinamikusan felismeri a person.* és zone.* entitásokat. Ha egy személy helyzete megváltozik, a távolságokat a Home Assistant aktuális adataiból újraszámítja."
        ],
        "notes": [
          "A hibás referenciahely hibás távolságokat, sugárértékelést és iránytűirányokat eredményez."
        ]
      },
      {
        "key": "functions",
        "title": "Fontos funkciók",
        "entries": [
          [
            "Auraeffektek",
            "megjelenítik a villámtevékenységet, de nem módosítják az észlelést vagy a számlálást."
          ],
          [
            "Figyelmeztető animáció",
            "vizuálisan kiemeli a jelentős vihartevékenységet."
          ],
          [
            "Térképcsoportosítás",
            "összevonja a közeli villámjelölőket és áttekinthetően tartja a térképet."
          ],
          [
            "Iránytű: legközelebbi villám",
            "a kijelzőt a legközelebbi észlelt villám felé irányítja."
          ],
          [
            "Eszköz tájolása",
            "támogatott mobileszközökön felhasználhatja az eszköz tájolását."
          ],
          [
            "Viharszimuláció",
            "csak tesztelésre és diagnosztikára szolgál, normál használatkor maradjon kikapcsolva."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Ajánlott alapbeállítások",
        "paragraphs": [
          "A stabil induláshoz javasoljuk:"
        ],
        "items": [
          "A villámforrás sugarát állítsa legalább a Gewitterradar megfigyelési sugarára.",
          "Hagyja bekapcsolva a térképcsoportosítást.",
          "Hagyja bekapcsolva a figyelmeztető animációt.",
          "Az auraeffekteket ízlés szerint állítsa; az észlelést nem befolyásolják.",
          "Normál használatkor hagyja kikapcsolva a viharszimulációt.",
          "Az eszköz tájolását csak akkor kapcsolja be, ha az adott mobileszközön szükséges."
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Ha valami nem működik",
        "entries": [
          [
            "Nincs vagy túl kevés villám",
            "Ellenőrizze a forrás állapotát, a forrássugarat és a használt villámentitásokat."
          ],
          [
            "A távolságok vagy irányok hibásnak tűnnek",
            "Ellenőrizze a referenciahelyet és a távolság mértékegységét."
          ],
          [
            "A nyelvválasztás újra megjelenik",
            "Ellenőrizze az aktuális Gewitterradar-csomag és az inicializálási segéd telepítését."
          ],
          [
            "A megjelenés nem változott frissítés után",
            "Töltse újra teljesen a böngésző/app gyorsítótárát, és ellenőrizze az aktuális JavaScript használatát."
          ],
          [
            "Szokatlan működés vagy kettős kártya",
            "A Home Assistantban csak EGY Gewitterradar modul-erőforrás lehet aktív. A natív integráció és a Dashboard/HACS-erőforrás nem regisztrálhatja egyszerre ugyanazt az egyéni kártyát."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "A villámadatok nagyon sok állapotváltozást okozhatnak. A hosszú távon karcsú Recorder-konfigurációhoz javasoljuk az alábbi entitások és minták kizárását."
        ],
        "recorder": true,
        "notes": [
          "Ha már van recorder: szakasz, ezeket a bejegyzéseket oda illessze. Ne hozzon létre második felső szintű recorder: blokkot.",
          "A kizárások NEM tiltják le a Gewitterradar által használt élő állapotokat.",
          "A meglévő előzményadatok nem törlődnek automatikusan.",
          "A helyettesítő minták több detektort vagy megfigyelési pontot támogatnak az entitás előtagjától függetlenül."
        ]
      }
    ]
  },
  "Boarisch": {
    "menuTitle": "Hüf & Hinwais",
    "title": "Hüf & Hinwais",
    "subtitle": "Kurz erklärt, damit s’Gewitterradar zuverlässig und nachvollziehbar lafft.",
    "close": "Hilfe schließen",
    "copy": "YAML kopieren",
    "copied": "Kopiert",
    "copyFailed": "Kopieren nicht möglich – bitte den Code markieren.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Voraussetzungen",
        "paragraphs": [
          "Gewitterradar verarbeitet die Blitzdaten, die Home Assistant von der verwendeten Blitzortung-Datenquelle erhält. Prüfe dort den richtigen Referenzstandort und stelle den Quellradius mindestens so groß wie den Beobachtungsradius in Gewitterradar ein. Gewitterradar kann keine Blitze anzeigen oder auswerten, die von der Datenquelle bereits herausgefiltert wurden."
        ],
        "notes": [
          "Wenn mehrere Blitzortung-Geräte oder Beobachtungspunkte vorhanden sind, müssen die verwendeten Entitäten eindeutig zum gewünschten Referenzpunkt passen."
        ]
      },
      {
        "key": "radii",
        "title": "De Radien",
        "paragraphs": [
          "Die Radien bauen aufeinander auf: Ein Blitz im Gefahrenradius zählt gleichzeitig zum Gewitter- und Beobachtungsradius. Die Bereiche sind Entfernungsschwellen, keine voneinander getrennten Datenquellen."
        ],
        "items": [
          "Beobachtungsradius – äußerer Bereich für frühe Beobachtung.",
          "Gewitterradius – näherer Bereich mit erhöhter Aufmerksamkeit.",
          "Gefahrenradius – unmittelbarer Nahbereich mit besonders hoher Relevanz."
        ],
        "notes": [
          "Der Gefahrenradius ist auf maximal 250 km begrenzt."
        ]
      },
      {
        "key": "location",
        "title": "Referenzstandort",
        "paragraphs": [
          "Der Referenzstandort bestimmt, von welchem Punkt aus Entfernungen und Richtungen berechnet werden. Gewitterradar erkennt person.*- und zone.*-Entitäten dynamisch. Ändert sich der Standort einer Person, werden Entfernungen auf Basis der aktuellen Home-Assistant-Daten neu bewertet."
        ],
        "notes": [
          "Ein falscher Referenzstandort führt zu falschen Entfernungen, Radien und Kompassrichtungen."
        ]
      },
      {
        "key": "functions",
        "title": "Wichtige Funktionen",
        "entries": [
          [
            "Aura-Effekte",
            "visualisieren Blitzaktivität, verändern aber nicht die Erkennung oder Zählung."
          ],
          [
            "Warnanimation",
            "hebt relevante Gewitteraktivität optisch hervor."
          ],
          [
            "Kartengruppierung",
            "fasst nahe Blitzmarker zusammen und hält die Karte übersichtlicher."
          ],
          [
            "Kompass: nächster Blitz",
            "richtet die Anzeige auf den nächstgelegenen erkannten Blitz."
          ],
          [
            "Geräteorientierung",
            "kann auf unterstützten Mobilgeräten die Geräteausrichtung einbeziehen."
          ],
          [
            "Gewittersimulation",
            "ist ausschließlich für Test und Diagnose gedacht und sollte im normalen Betrieb ausgeschaltet bleiben."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Empfohlene Grundeinstellungen",
        "paragraphs": [
          "Für einen stabilen Start empfehlen wir:"
        ],
        "items": [
          "Quellradius der Blitzortung-Datenquelle mindestens so groß wie den Gewitterradar-Beobachtungsradius einstellen.",
          "Kartengruppierung eingeschaltet lassen.",
          "Warnanimation eingeschaltet lassen.",
          "Aura-Effekte nach persönlichem Geschmack einstellen; sie beeinflussen die Erkennung nicht.",
          "Gewittersimulation im normalen Betrieb ausgeschaltet lassen.",
          "Geräteorientierung nur aktivieren, wenn sie auf dem verwendeten Mobilgerät benötigt wird."
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Wenn wos ned stimmt",
        "entries": [
          [
            "Keine oder zu wenige Blitze",
            "Status der Blitzortung-Datenquelle, Quellradius und verwendete Blitz-Entitäten prüfen."
          ],
          [
            "Entfernungen oder Richtungen wirken falsch",
            "Referenzstandort und Distanzeinheit prüfen."
          ],
          [
            "Sprachauswahl erscheint immer wieder",
            "Prüfen, ob das aktuelle Gewitterradar-Package installiert ist und der Initialisierungshelfer vorhanden ist."
          ],
          [
            "Darstellung nach Update unverändert",
            "Browser-/App-Cache vollständig neu laden und sicherstellen, dass die aktuelle JavaScript-Datei verwendet wird."
          ],
          [
            "Merkwürdiges Verhalten oder doppelte Karte",
            "In Home Assistant darf nur EINE Gewitterradar-Modulressource aktiv sein. Native Integration und Dashboard-/HACS-Ressource dürfen nicht gleichzeitig dieselbe Custom Card registrieren."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home-Assistant-Recorder",
        "paragraphs": [
          "Blitzdaten können sehr viele Zustandsänderungen erzeugen. Für einen langfristig schlanken Recorder empfehlen wir, die folgenden Entitäten bzw. Entitätsmuster auszuschließen."
        ],
        "recorder": true,
        "notes": [
          "Falls bereits ein recorder:-Abschnitt existiert, diese Einträge dort ergänzen. Keinen zweiten Top-Level-recorder:-Block anlegen.",
          "Die Ausschlüsse deaktivieren NICHT die Live-Zustände für Gewitterradar.",
          "Bereits vorhandene historische Daten werden dadurch nicht automatisch gelöscht.",
          "Die Wildcards unterstützen mehrere Blitzortung-Geräte bzw. Beobachtungspunkte unabhängig vom Entity-Präfix."
        ]
      }
    ]
  },
  "Plattdüütsch": {
    "menuTitle": "Hülp & Henwiesen",
    "title": "Hülp & Henwiesen",
    "subtitle": "Kort verklort, dormit Gewitterradar seker un good to verstahn arbeidt.",
    "close": "Hilfe schließen",
    "copy": "YAML kopieren",
    "copied": "Kopiert",
    "copyFailed": "Kopieren nicht möglich – bitte den Code markieren.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Vörutsetten",
        "paragraphs": [
          "Gewitterradar verarbeitet die Blitzdaten, die Home Assistant von der verwendeten Blitzortung-Datenquelle erhält. Prüfe dort den richtigen Referenzstandort und stelle den Quellradius mindestens so groß wie den Beobachtungsradius in Gewitterradar ein. Gewitterradar kann keine Blitze anzeigen oder auswerten, die von der Datenquelle bereits herausgefiltert wurden."
        ],
        "notes": [
          "Wenn mehrere Blitzortung-Geräte oder Beobachtungspunkte vorhanden sind, müssen die verwendeten Entitäten eindeutig zum gewünschten Referenzpunkt passen."
        ]
      },
      {
        "key": "radii",
        "title": "De Radien",
        "paragraphs": [
          "Die Radien bauen aufeinander auf: Ein Blitz im Gefahrenradius zählt gleichzeitig zum Gewitter- und Beobachtungsradius. Die Bereiche sind Entfernungsschwellen, keine voneinander getrennten Datenquellen."
        ],
        "items": [
          "Beobachtungsradius – äußerer Bereich für frühe Beobachtung.",
          "Gewitterradius – näherer Bereich mit erhöhter Aufmerksamkeit.",
          "Gefahrenradius – unmittelbarer Nahbereich mit besonders hoher Relevanz."
        ],
        "notes": [
          "Der Gefahrenradius ist auf maximal 250 km begrenzt."
        ]
      },
      {
        "key": "location",
        "title": "Referenzsteed",
        "paragraphs": [
          "Der Referenzstandort bestimmt, von welchem Punkt aus Entfernungen und Richtungen berechnet werden. Gewitterradar erkennt person.*- und zone.*-Entitäten dynamisch. Ändert sich der Standort einer Person, werden Entfernungen auf Basis der aktuellen Home-Assistant-Daten neu bewertet."
        ],
        "notes": [
          "Ein falscher Referenzstandort führt zu falschen Entfernungen, Radien und Kompassrichtungen."
        ]
      },
      {
        "key": "functions",
        "title": "Wichtige Funktionen",
        "entries": [
          [
            "Aura-Effekte",
            "visualisieren Blitzaktivität, verändern aber nicht die Erkennung oder Zählung."
          ],
          [
            "Warnanimation",
            "hebt relevante Gewitteraktivität optisch hervor."
          ],
          [
            "Kartengruppierung",
            "fasst nahe Blitzmarker zusammen und hält die Karte übersichtlicher."
          ],
          [
            "Kompass: nächster Blitz",
            "richtet die Anzeige auf den nächstgelegenen erkannten Blitz."
          ],
          [
            "Geräteorientierung",
            "kann auf unterstützten Mobilgeräten die Geräteausrichtung einbeziehen."
          ],
          [
            "Gewittersimulation",
            "ist ausschließlich für Test und Diagnose gedacht und sollte im normalen Betrieb ausgeschaltet bleiben."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Anraadt Grundinstellen",
        "paragraphs": [
          "Für einen stabilen Start empfehlen wir:"
        ],
        "items": [
          "Quellradius der Blitzortung-Datenquelle mindestens so groß wie den Gewitterradar-Beobachtungsradius einstellen.",
          "Kartengruppierung eingeschaltet lassen.",
          "Warnanimation eingeschaltet lassen.",
          "Aura-Effekte nach persönlichem Geschmack einstellen; sie beeinflussen die Erkennung nicht.",
          "Gewittersimulation im normalen Betrieb ausgeschaltet lassen.",
          "Geräteorientierung nur aktivieren, wenn sie auf dem verwendeten Mobilgerät benötigt wird."
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Wenn wat nich stimmt",
        "entries": [
          [
            "Keine oder zu wenige Blitze",
            "Status der Blitzortung-Datenquelle, Quellradius und verwendete Blitz-Entitäten prüfen."
          ],
          [
            "Entfernungen oder Richtungen wirken falsch",
            "Referenzstandort und Distanzeinheit prüfen."
          ],
          [
            "Sprachauswahl erscheint immer wieder",
            "Prüfen, ob das aktuelle Gewitterradar-Package installiert ist und der Initialisierungshelfer vorhanden ist."
          ],
          [
            "Darstellung nach Update unverändert",
            "Browser-/App-Cache vollständig neu laden und sicherstellen, dass die aktuelle JavaScript-Datei verwendet wird."
          ],
          [
            "Merkwürdiges Verhalten oder doppelte Karte",
            "In Home Assistant darf nur EINE Gewitterradar-Modulressource aktiv sein. Native Integration und Dashboard-/HACS-Ressource dürfen nicht gleichzeitig dieselbe Custom Card registrieren."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home-Assistant-Recorder",
        "paragraphs": [
          "Blitzdaten können sehr viele Zustandsänderungen erzeugen. Für einen langfristig schlanken Recorder empfehlen wir, die folgenden Entitäten bzw. Entitätsmuster auszuschließen."
        ],
        "recorder": true,
        "notes": [
          "Falls bereits ein recorder:-Abschnitt existiert, diese Einträge dort ergänzen. Keinen zweiten Top-Level-recorder:-Block anlegen.",
          "Die Ausschlüsse deaktivieren NICHT die Live-Zustände für Gewitterradar.",
          "Bereits vorhandene historische Daten werden dadurch nicht automatisch gelöscht.",
          "Die Wildcards unterstützen mehrere Blitzortung-Geräte bzw. Beobachtungspunkte unabhängig vom Entity-Präfix."
        ]
      }
    ]
  },
  "Sächs’sch": {
    "menuTitle": "Hilche & Hinweese",
    "title": "Hilche & Hinweese",
    "subtitle": "Gorz erklärt, damidd Gewitterradar zuverlässig un nachvollziehbar looft.",
    "close": "Hilfe schließen",
    "copy": "YAML kopieren",
    "copied": "Kopiert",
    "copyFailed": "Kopieren nicht möglich – bitte den Code markieren.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Voraussetzungen",
        "paragraphs": [
          "Gewitterradar verarbeitet die Blitzdaten, die Home Assistant von der verwendeten Blitzortung-Datenquelle erhält. Prüfe dort den richtigen Referenzstandort und stelle den Quellradius mindestens so groß wie den Beobachtungsradius in Gewitterradar ein. Gewitterradar kann keine Blitze anzeigen oder auswerten, die von der Datenquelle bereits herausgefiltert wurden."
        ],
        "notes": [
          "Wenn mehrere Blitzortung-Geräte oder Beobachtungspunkte vorhanden sind, müssen die verwendeten Entitäten eindeutig zum gewünschten Referenzpunkt passen."
        ]
      },
      {
        "key": "radii",
        "title": "De Radien",
        "paragraphs": [
          "Die Radien bauen aufeinander auf: Ein Blitz im Gefahrenradius zählt gleichzeitig zum Gewitter- und Beobachtungsradius. Die Bereiche sind Entfernungsschwellen, keine voneinander getrennten Datenquellen."
        ],
        "items": [
          "Beobachtungsradius – äußerer Bereich für frühe Beobachtung.",
          "Gewitterradius – näherer Bereich mit erhöhter Aufmerksamkeit.",
          "Gefahrenradius – unmittelbarer Nahbereich mit besonders hoher Relevanz."
        ],
        "notes": [
          "Der Gefahrenradius ist auf maximal 250 km begrenzt."
        ]
      },
      {
        "key": "location",
        "title": "Referenzstandord",
        "paragraphs": [
          "Der Referenzstandort bestimmt, von welchem Punkt aus Entfernungen und Richtungen berechnet werden. Gewitterradar erkennt person.*- und zone.*-Entitäten dynamisch. Ändert sich der Standort einer Person, werden Entfernungen auf Basis der aktuellen Home-Assistant-Daten neu bewertet."
        ],
        "notes": [
          "Ein falscher Referenzstandort führt zu falschen Entfernungen, Radien und Kompassrichtungen."
        ]
      },
      {
        "key": "functions",
        "title": "Wicht’sche Funktionen",
        "entries": [
          [
            "Aura-Effekte",
            "visualisieren Blitzaktivität, verändern aber nicht die Erkennung oder Zählung."
          ],
          [
            "Warnanimation",
            "hebt relevante Gewitteraktivität optisch hervor."
          ],
          [
            "Kartengruppierung",
            "fasst nahe Blitzmarker zusammen und hält die Karte übersichtlicher."
          ],
          [
            "Kompass: nächster Blitz",
            "richtet die Anzeige auf den nächstgelegenen erkannten Blitz."
          ],
          [
            "Geräteorientierung",
            "kann auf unterstützten Mobilgeräten die Geräteausrichtung einbeziehen."
          ],
          [
            "Gewittersimulation",
            "ist ausschließlich für Test und Diagnose gedacht und sollte im normalen Betrieb ausgeschaltet bleiben."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Empfohlene Grundeinstellungen",
        "paragraphs": [
          "Für einen stabilen Start empfehlen wir:"
        ],
        "items": [
          "Quellradius der Blitzortung-Datenquelle mindestens so groß wie den Gewitterradar-Beobachtungsradius einstellen.",
          "Kartengruppierung eingeschaltet lassen.",
          "Warnanimation eingeschaltet lassen.",
          "Aura-Effekte nach persönlichem Geschmack einstellen; sie beeinflussen die Erkennung nicht.",
          "Gewittersimulation im normalen Betrieb ausgeschaltet lassen.",
          "Geräteorientierung nur aktivieren, wenn sie auf dem verwendeten Mobilgerät benötigt wird."
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Wenn was nich stimmt",
        "entries": [
          [
            "Keine oder zu wenige Blitze",
            "Status der Blitzortung-Datenquelle, Quellradius und verwendete Blitz-Entitäten prüfen."
          ],
          [
            "Entfernungen oder Richtungen wirken falsch",
            "Referenzstandort und Distanzeinheit prüfen."
          ],
          [
            "Sprachauswahl erscheint immer wieder",
            "Prüfen, ob das aktuelle Gewitterradar-Package installiert ist und der Initialisierungshelfer vorhanden ist."
          ],
          [
            "Darstellung nach Update unverändert",
            "Browser-/App-Cache vollständig neu laden und sicherstellen, dass die aktuelle JavaScript-Datei verwendet wird."
          ],
          [
            "Merkwürdiges Verhalten oder doppelte Karte",
            "In Home Assistant darf nur EINE Gewitterradar-Modulressource aktiv sein. Native Integration und Dashboard-/HACS-Ressource dürfen nicht gleichzeitig dieselbe Custom Card registrieren."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home-Assistant-Recorder",
        "paragraphs": [
          "Blitzdaten können sehr viele Zustandsänderungen erzeugen. Für einen langfristig schlanken Recorder empfehlen wir, die folgenden Entitäten bzw. Entitätsmuster auszuschließen."
        ],
        "recorder": true,
        "notes": [
          "Falls bereits ein recorder:-Abschnitt existiert, diese Einträge dort ergänzen. Keinen zweiten Top-Level-recorder:-Block anlegen.",
          "Die Ausschlüsse deaktivieren NICHT die Live-Zustände für Gewitterradar.",
          "Bereits vorhandene historische Daten werden dadurch nicht automatisch gelöscht.",
          "Die Wildcards unterstützen mehrere Blitzortung-Geräte bzw. Beobachtungspunkte unabhängig vom Entity-Präfix."
        ]
      }
    ]
  },
  "Schwäbisch": {
    "menuTitle": "Hilf & Hinweis",
    "title": "Hilf & Hinweis",
    "subtitle": "Kurz erklärt, dass s’Gewitterradar zuverlässig ond nachvollziehbar lauft.",
    "close": "Hilfe schließen",
    "copy": "YAML kopieren",
    "copied": "Kopiert",
    "copyFailed": "Kopieren nicht möglich – bitte den Code markieren.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Voraussetzungen",
        "paragraphs": [
          "Gewitterradar verarbeitet die Blitzdaten, die Home Assistant von der verwendeten Blitzortung-Datenquelle erhält. Prüfe dort den richtigen Referenzstandort und stelle den Quellradius mindestens so groß wie den Beobachtungsradius in Gewitterradar ein. Gewitterradar kann keine Blitze anzeigen oder auswerten, die von der Datenquelle bereits herausgefiltert wurden."
        ],
        "notes": [
          "Wenn mehrere Blitzortung-Geräte oder Beobachtungspunkte vorhanden sind, müssen die verwendeten Entitäten eindeutig zum gewünschten Referenzpunkt passen."
        ]
      },
      {
        "key": "radii",
        "title": "D’Radien",
        "paragraphs": [
          "Die Radien bauen aufeinander auf: Ein Blitz im Gefahrenradius zählt gleichzeitig zum Gewitter- und Beobachtungsradius. Die Bereiche sind Entfernungsschwellen, keine voneinander getrennten Datenquellen."
        ],
        "items": [
          "Beobachtungsradius – äußerer Bereich für frühe Beobachtung.",
          "Gewitterradius – näherer Bereich mit erhöhter Aufmerksamkeit.",
          "Gefahrenradius – unmittelbarer Nahbereich mit besonders hoher Relevanz."
        ],
        "notes": [
          "Der Gefahrenradius ist auf maximal 250 km begrenzt."
        ]
      },
      {
        "key": "location",
        "title": "Referenzstandort",
        "paragraphs": [
          "Der Referenzstandort bestimmt, von welchem Punkt aus Entfernungen und Richtungen berechnet werden. Gewitterradar erkennt person.*- und zone.*-Entitäten dynamisch. Ändert sich der Standort einer Person, werden Entfernungen auf Basis der aktuellen Home-Assistant-Daten neu bewertet."
        ],
        "notes": [
          "Ein falscher Referenzstandort führt zu falschen Entfernungen, Radien und Kompassrichtungen."
        ]
      },
      {
        "key": "functions",
        "title": "Wichtige Funktionen",
        "entries": [
          [
            "Aura-Effekte",
            "visualisieren Blitzaktivität, verändern aber nicht die Erkennung oder Zählung."
          ],
          [
            "Warnanimation",
            "hebt relevante Gewitteraktivität optisch hervor."
          ],
          [
            "Kartengruppierung",
            "fasst nahe Blitzmarker zusammen und hält die Karte übersichtlicher."
          ],
          [
            "Kompass: nächster Blitz",
            "richtet die Anzeige auf den nächstgelegenen erkannten Blitz."
          ],
          [
            "Geräteorientierung",
            "kann auf unterstützten Mobilgeräten die Geräteausrichtung einbeziehen."
          ],
          [
            "Gewittersimulation",
            "ist ausschließlich für Test und Diagnose gedacht und sollte im normalen Betrieb ausgeschaltet bleiben."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Empfohlene Grundeinstellungen",
        "paragraphs": [
          "Für einen stabilen Start empfehlen wir:"
        ],
        "items": [
          "Quellradius der Blitzortung-Datenquelle mindestens so groß wie den Gewitterradar-Beobachtungsradius einstellen.",
          "Kartengruppierung eingeschaltet lassen.",
          "Warnanimation eingeschaltet lassen.",
          "Aura-Effekte nach persönlichem Geschmack einstellen; sie beeinflussen die Erkennung nicht.",
          "Gewittersimulation im normalen Betrieb ausgeschaltet lassen.",
          "Geräteorientierung nur aktivieren, wenn sie auf dem verwendeten Mobilgerät benötigt wird."
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Wenn ebbes net stimmt",
        "entries": [
          [
            "Keine oder zu wenige Blitze",
            "Status der Blitzortung-Datenquelle, Quellradius und verwendete Blitz-Entitäten prüfen."
          ],
          [
            "Entfernungen oder Richtungen wirken falsch",
            "Referenzstandort und Distanzeinheit prüfen."
          ],
          [
            "Sprachauswahl erscheint immer wieder",
            "Prüfen, ob das aktuelle Gewitterradar-Package installiert ist und der Initialisierungshelfer vorhanden ist."
          ],
          [
            "Darstellung nach Update unverändert",
            "Browser-/App-Cache vollständig neu laden und sicherstellen, dass die aktuelle JavaScript-Datei verwendet wird."
          ],
          [
            "Merkwürdiges Verhalten oder doppelte Karte",
            "In Home Assistant darf nur EINE Gewitterradar-Modulressource aktiv sein. Native Integration und Dashboard-/HACS-Ressource dürfen nicht gleichzeitig dieselbe Custom Card registrieren."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home-Assistant-Recorder",
        "paragraphs": [
          "Blitzdaten können sehr viele Zustandsänderungen erzeugen. Für einen langfristig schlanken Recorder empfehlen wir, die folgenden Entitäten bzw. Entitätsmuster auszuschließen."
        ],
        "recorder": true,
        "notes": [
          "Falls bereits ein recorder:-Abschnitt existiert, diese Einträge dort ergänzen. Keinen zweiten Top-Level-recorder:-Block anlegen.",
          "Die Ausschlüsse deaktivieren NICHT die Live-Zustände für Gewitterradar.",
          "Bereits vorhandene historische Daten werden dadurch nicht automatisch gelöscht.",
          "Die Wildcards unterstützen mehrere Blitzortung-Geräte bzw. Beobachtungspunkte unabhängig vom Entity-Präfix."
        ]
      }
    ]
  }
};

export const HELP_EXTERNAL_LOCALES_V40731 = {
  "Dansk": {
    "menuTitle": "Hjælp & bemærkninger",
    "title": "Hjælp & bemærkninger",
    "subtitle": "En kort vejledning, så Gewitterradar fungerer pålideligt og er let at forstå.",
    "close": "Luk hjælp",
    "copy": "Kopiér YAML",
    "copied": "Kopieret",
    "copyFailed": "Kopiering er ikke mulig – markér koden.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Forudsætninger",
        "paragraphs": [
          "Gewitterradar behandler de lyndata, som Home Assistant modtager fra den konfigurerede lyndetektionskilde. Kontrollér det korrekte referencested dér, og sæt kilderadius mindst lige så stor som observationsradius i Gewitterradar. Gewitterradar kan ikke vise eller vurdere lyn, som kilden allerede har filtreret fra."
        ],
        "notes": [
          "Hvis der findes flere lyndetektorer eller observationspunkter, skal de anvendte entiteter entydigt høre til det ønskede referencepunkt."
        ]
      },
      {
        "key": "radii",
        "title": "Radierne",
        "paragraphs": [
          "Radierne er kumulative: Et lyn i fareradius tæller også i tordenvejrs- og observationsradius. Områderne er afstandsgrænser, ikke separate datakilder."
        ],
        "items": [
          "Observationsradius – ydre område til tidlig observation.",
          "Tordenvejrsradius – nærmere område, der kræver øget opmærksomhed.",
          "Fareradius – umiddelbart nærområde med særlig høj relevans."
        ],
        "notes": [
          "Fareradius er begrænset til højst 250 km. Se “Anbefalede grundindstillinger” for anbefalede startværdier og den nødvendige koordinering med Blitzortung-appen."
        ]
      },
      {
        "key": "location",
        "title": "Sted & gemte steder",
        "paragraphs": [
          "Det valgte sted er referencepunktet, som Gewitterradar bruger til at beregne afstande og retninger. Stedbiblioteket ligger lokalt i Home Assistant."
        ],
        "entries": [
          [
            "Sted",
            "V4.07-dashboardet bruger device_tracker.gewitterradar_dashboard til den globale stedssøgning. Blitzortung skal selv følge denne tracker som sin placering, hvis live-dataområdet også skal flytte med."
          ],
          [
            "Opsæt Blitzortung",
            "Opsæt Blitzortung via Indstillinger → Enheder og tjenester → Blitzortung → Tilføj post, vælg konfigurationstypen “Location entity” og derefter “Gewitterradar Dashboard”. En ældre post med faste koordinater kan ikke ændres til en placeringsenhed via omkonfiguration; opret en ny post, test den og deaktiver først derefter den gamle."
          ],
          [
            "Anvend sted",
            "“Anvend” overtager stedet, lukker søgningen og flytter kortet."
          ],
          [
            "Opsæt liste til gemte steder",
            "Opret til lagring en Local to-do-liste med præcis navnet “Gewitterradar Orte”."
          ],
          [
            "Gemte steder",
            "★ Gem lagrer fundne steder permanent lokalt. De vises under “Gemte steder” og kan bruges igen uden en ny søgning. × sletter ikke et sted med det samme, men markerer det til fjernelse. Under “Fjernede steder” gendanner ↶ det når som helst; koordinater og metadata bevares."
          ]
        ],
        "notes": [
          "Et kortskift alene beviser ikke, at Blitzortung allerede har skiftet live-dataregion. Den native integration bruger device_tracker.gewitterradar i stedet for dashboard-trackeren."
        ]
      },
      {
        "key": "external_services",
        "title": "Eksterne tjenester & netværksadgang",
        "paragraphs": [
          "Gewitterradar har to netværksveje: kort og stedssøgning går direkte fra browser/Companion App, mens Blitzortung-live-data hentes af Blitzortung-integrationen på Home Assistant-serveren. Firewall, VLAN, proxy, DNS-filter og TLS-inspektion skal derfor vurderes separat for begge veje.",
          "Følgende mål er det aktuelle V4.07-runtimeinventar. Den lokale stedsliste, trackeren og Home Assistant-tjenesterne kræver ingen internetadgang."
        ],
        "entries": [
          [
            "Klient · Open-Meteo geokodning",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · primær global sted-/postnummersøgning; sender søgetekst, sprog og kun ved eksplicit landefilter ISO-koden. Ved fejl bruges Nominatim."
          ],
          [
            "Klient · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · reserve til stedssøgning; sender søgetekst, sprog og evt. ISO-kode. Offentlige kald holdes mindst ét sekund fra hinanden, og lokal landeautofuldførelse laver ingen netværkskald. Hvis begge geokodningstjenester er blokeret, virker gemte steder stadig lokalt."
          ],
          [
            "Klient · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · leverer Leaflet 1.9.4 JavaScript/CSS. Uden cachet Leaflet kan kortet ikke starte, hvis værten blokeres."
          ],
          [
            "Klient · OpenStreetMap-kortfliser",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · grundkortfliser. Ved blokering kan data stadig findes, men grundkortet bliver tomt eller ufuldstændigt."
          ],
          [
            "Server · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · udgående fra Home Assistant-serveren. Blitzortung v1.7.1 bruger brokerens geohash-emner til live-lyn; blokering stopper nye live-data, men ikke stedssøgning/kort."
          ],
          [
            "Lokalt · ingen ekstern adgang",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, koordinattjenesten, dashboard-scriptet og Local to-do-listen “Gewitterradar Orte” kører lokalt og kræver ingen ekstra internetdomæne."
          ],
          [
            "Installation / opdatering",
            "GitHub/HACS bruges til installation og opdatering, ikke som runtimeafhængighed for et åbent Gewitterradar-kort."
          ],
          [
            "Hurtig diagnose",
            "Stedssøgning fejler: kontrollér Open-Meteo/Nominatim. Kort starter ikke: kontrollér unpkg.com. Tomt grundkort: kontrollér OSM-fliseværter. Manglende/gamle lyn: kontrollér blitzortung.ha.sed.pl:1883 og Blitzortung-integrationen."
          ]
        ],
        "notes": [
          "DNS skal virke på både klient og Home Assistant-server for deres respektive mål.",
          "HTTPS-proxy, TLS-inspektion, indholdsfiltre, blokkere eller browserudvidelser kan blokere frontendkald trods åben TCP 443; ved geokodning skal CORS/svarfiltre også kontrolleres.",
          "Privatliv: geokodning modtager søgetekst/parametre, OSM-fliser afslører teknisk det viste kortområde, og Blitzortung-brokeren modtager de abonnerede regions-/geohash-emner.",
          "http://www.w3.org/2000/svg er kun SVG-navnerummet og ikke et eksternt netværkskald.",
          "Runtimeinventaret er automatiseret: nye faste eksterne URL-mål skal få testen til at fejle, indtil dokumentation og adgangsliste er opdateret."
        ]
      },
      {
        "key": "functions",
        "title": "Vigtige funktioner",
        "entries": [
          [
            "Auraeffekter",
            "visualiserer lynaktivitet, men ændrer ikke registrering eller optælling."
          ],
          [
            "Advarselsanimation",
            "fremhæver relevant tordenvejrsaktivitet visuelt."
          ],
          [
            "Kortgruppering",
            "samler nærliggende lynmarkører og holder kortet overskueligt."
          ],
          [
            "Kompas: nærmeste lyn",
            "retter visningen mod det nærmeste registrerede lyn."
          ],
          [
            "Enhedsretning",
            "kan bruge enhedens retning på understøttede mobilenheder."
          ],
          [
            "Kalibrering og diagnosticering",
            "stiller værktøjer til målrettet kontrol, måling og fejlsøgning af visningen og enkelte komponenter til rådighed. Det omfatter bl.a. kalibrering af kompas og medaljon, diagnosevisninger og testfunktioner som tordenvejrssimulering. Værktøjerne er beregnet til opsætning, udvikling og fejlsøgning og bør være deaktiveret under normal drift."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Anbefalede grundindstillinger",
        "paragraphs": [
          "For en stabil start anbefaler vi:"
        ],
        "entries": [
          [
            "Testværdier · 500 km / 120 min / 200",
            "500 km registreringsradius, 120 minutters tidsvindue og 200 lyn er eksempler til test, ikke obligatoriske indstillinger. De kan tilpasses anvendelsesområde, ønsket observationsrækkevidde og personlige behov."
          ],
          [
            "Afstem sted & tracker",
            "Indstillingerne i Blitzortung skal passe til både det sted, der er konfigureret dér, og den tracker, Gewitterradar bruger. Så forbliver dataområde og visning konsistente."
          ],
          [
            "Afstem radier",
            "Sæt Blitzortungs kilderadius mindst lige så stor som Gewitterradars observationsradius."
          ],
          [
            "Lad være aktiveret",
            "Lad kortgruppering og advarselsanimation være slået til."
          ],
          [
            "Valgfrit",
            "Tilpas auraeffekter efter smag; de påvirker ikke registreringen. Aktivér kun enhedsretning, når den er nødvendig på den anvendte mobilenhed."
          ],
          [
            "Normal drift",
            "Lad værktøjerne under “Kalibrering og diagnosticering”, især tordenvejrssimulering, være deaktiveret under normal drift."
          ],
          [
            "Recorder – skal kontrolleres",
            "Kontrollér Recorder-undtagelser for ofte opdaterede lyn- og positionsdata. Uden egnede undtagelser kan Home Assistant-databasen og backups vokse meget hurtigt. Se “Home Assistant Recorder” for detaljer og YAML."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Hvis noget ikke virker",
        "entries": [
          [
            "Ingen eller for få lyn",
            "Kontrollér lyndetektionskildens status, kilderadius og de anvendte lynentiteter."
          ],
          [
            "Afstande eller retninger ser forkerte ud",
            "Kontrollér referencested og afstandsenhed."
          ],
          [
            "Backup vokser usædvanligt hurtigt",
            "Manglende Recorder-undtagelser for ofte opdaterede lyn- og positionsdata kan få Home Assistant-databasen og dermed backups til at vokse meget hurtigt. Kontrollér Recorder-indstillingerne; se “Home Assistant Recorder” for detaljer og YAML."
          ],
          [
            "Sprogvalget vises igen og igen",
            "Kontrollér, at den aktuelle Gewitterradar-pakke og initialiseringshjælperen er installeret."
          ],
          [
            "Visningen er uændret efter en opdatering",
            "Genindlæs browser-/app-cachen helt, og kontrollér, at den aktuelle JavaScript-fil bruges."
          ],
          [
            "Uventet adfærd eller dobbelt kort",
            "Kun ÉN Gewitterradar-modulressource må være aktiv i Home Assistant. Den native integration og Dashboard-/HACS-ressourcen må ikke registrere det samme brugerdefinerede kort samtidigt."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Lyndata kan skabe meget mange tilstandsændringer. For en slank Recorder-konfiguration på lang sigt anbefaler vi at udelukke følgende entiteter og entitetsmønstre."
        ],
        "recorder": true,
        "notes": [
          "Hvis der allerede findes en recorder:-sektion, skal posterne flettes ind dér. Opret ikke en anden recorder:-blok på topniveau.",
          "Udelukkelserne deaktiverer IKKE de live-tilstande, Gewitterradar bruger.",
          "Eksisterende historiske data fjernes ikke automatisk.",
          "Wildcard-mønstrene understøtter flere lyndetektorer eller observationspunkter uanset entitetspræfiks."
        ]
      }
    ]
  },
  "Español": {
    "menuTitle": "Ayuda y notas",
    "title": "Ayuda y notas",
    "subtitle": "Una guía breve para que Gewitterradar funcione de forma fiable y comprensible.",
    "close": "Cerrar ayuda",
    "copy": "Copiar YAML",
    "copied": "Copiado",
    "copyFailed": "No se puede copiar; selecciona el código.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Requisitos",
        "paragraphs": [
          "Gewitterradar procesa los datos de rayos que Home Assistant recibe de la fuente de detección configurada. Comprueba allí la ubicación de referencia correcta y ajusta el radio de la fuente como mínimo al radio de observación de Gewitterradar. Gewitterradar no puede mostrar ni evaluar rayos que la fuente ya haya filtrado."
        ],
        "notes": [
          "Si hay varios dispositivos de detección u observatorios, las entidades utilizadas deben pertenecer claramente al punto de referencia deseado."
        ]
      },
      {
        "key": "radii",
        "title": "Los radios",
        "paragraphs": [
          "Los radios son acumulativos: un rayo dentro del radio de peligro también cuenta dentro de los radios de tormenta y observación. Son umbrales de distancia, no fuentes de datos separadas."
        ],
        "items": [
          "Radio de observación – zona exterior para la observación temprana.",
          "Radio de tormenta – zona más cercana que requiere mayor atención.",
          "Radio de peligro – entorno inmediato de especial relevancia."
        ],
        "notes": [
          "El radio de peligro está limitado a un máximo de 250 km. Consulta “Ajustes básicos recomendados” para los valores iniciales aconsejados y la coordinación necesaria con la aplicación Blitzortung."
        ]
      },
      {
        "key": "location",
        "title": "Ubicación y lugares guardados",
        "paragraphs": [
          "El lugar seleccionado es el punto de referencia desde el que Gewitterradar calcula distancias y direcciones. La biblioteca de lugares permanece local en Home Assistant."
        ],
        "entries": [
          [
            "Ubicación",
            "El panel V4.07 usa device_tracker.gewitterradar_dashboard para la búsqueda mundial. Para que también cambie la región de datos en vivo, Blitzortung debe seguir este tracker como entidad de ubicación."
          ],
          [
            "Configurar Blitzortung",
            "Configura Blitzortung en Ajustes → Dispositivos y servicios → Blitzortung → Añadir entrada, elige “Location entity” y después “Gewitterradar Dashboard”. Una entrada antigua con coordenadas fijas no puede convertirse mediante reconfiguración; crea una nueva, pruébala y solo entonces desactiva la antigua."
          ],
          [
            "Aplicar ubicación",
            "“Aplicar” establece el lugar, cierra la búsqueda y centra el mapa."
          ],
          [
            "Configurar la lista de lugares guardados",
            "Para guardar, crea una lista Local to-do llamada exactamente “Gewitterradar Orte”."
          ],
          [
            "Lugares guardados",
            "★ Guardar almacena permanentemente los lugares encontrados de forma local. Aparecen en “Lugares guardados” y pueden reutilizarse sin otra búsqueda. × no elimina un lugar inmediatamente, sino que lo marca para su eliminación. En “Lugares eliminados”, ↶ lo restaura en cualquier momento conservando coordenadas y metadatos."
          ]
        ],
        "notes": [
          "Mover el mapa por sí solo no demuestra que Blitzortung ya haya cambiado su región de datos en vivo. La integración nativa usa device_tracker.gewitterradar en lugar del tracker del panel."
        ]
      },
      {
        "key": "external_services",
        "title": "Servicios externos y permisos de red",
        "paragraphs": [
          "Gewitterradar usa dos rutas de red: mapa y búsqueda salen directamente del navegador/Companion App, mientras que los datos en vivo de Blitzortung los obtiene la integración Blitzortung en el servidor Home Assistant. Firewall, VLAN, proxy, filtro DNS e inspección TLS deben revisarse por separado.",
          "Los siguientes destinos son el inventario actual de ejecución de V4.07. La biblioteca local, el tracker y los servicios de Home Assistant no necesitan Internet."
        ],
        "entries": [
          [
            "Cliente · Geocodificación Open-Meteo",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · búsqueda mundial principal; envía consulta, idioma y solo con filtro explícito el código ISO. Si falla, se usa Nominatim."
          ],
          [
            "Cliente · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · alternativa; envía consulta, idioma y posible código ISO. Las consultas públicas se separan al menos un segundo y el autocompletado local de países no hace llamadas de red. Si ambos servicios están bloqueados, los lugares guardados siguen disponibles."
          ],
          [
            "Cliente · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · carga Leaflet 1.9.4 JavaScript/CSS. Sin Leaflet en caché, bloquear este host impide inicializar el mapa."
          ],
          [
            "Cliente · teselas OpenStreetMap",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · teselas base. Si se bloquean, puede haber datos de Gewitterradar pero el mapa base queda vacío o incompleto."
          ],
          [
            "Servidor · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · salida desde el servidor Home Assistant. Blitzortung v1.7.1 usa el broker y temas geohash para rayos en vivo; bloquearlo detiene nuevos datos, sin afectar a búsqueda/mapa."
          ],
          [
            "Local · sin permiso externo",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, el servicio de coordenadas, el script del panel y la lista Local to-do “Gewitterradar Orte” funcionan localmente."
          ],
          [
            "Instalación / actualización",
            "GitHub/HACS intervienen en instalación y actualización, no son dependencias de ejecución del mapa abierto."
          ],
          [
            "Diagnóstico rápido",
            "Falla la búsqueda: comprueba Open-Meteo/Nominatim. El mapa no inicia: unpkg.com. Mapa base vacío: hosts de teselas OSM. Rayos ausentes/antiguos: blitzortung.ha.sed.pl:1883 y la integración Blitzortung."
          ]
        ],
        "notes": [
          "DNS debe resolver en el cliente y en el servidor Home Assistant para sus destinos respectivos.",
          "Proxy HTTPS, inspección TLS, filtros, bloqueadores o extensiones pueden bloquear solicitudes aunque TCP 443 esté permitido; para geocodificación revisa también CORS/filtrado de respuestas.",
          "Privacidad: la geocodificación recibe consulta/parámetros, las teselas OSM revelan técnicamente el área vista y el broker de Blitzortung recibe los temas de región/geohash suscritos.",
          "http://www.w3.org/2000/svg es solo el espacio de nombres SVG, no una llamada de red externa.",
          "El inventario de ejecución se protege automáticamente: un nuevo destino URL fijo debe romper la prueba hasta actualizar documentación y permisos."
        ]
      },
      {
        "key": "functions",
        "title": "Funciones importantes",
        "entries": [
          [
            "Efectos de aura",
            "visualizan la actividad de rayos, pero no cambian la detección ni el recuento."
          ],
          [
            "Animación de aviso",
            "resalta visualmente la actividad tormentosa relevante."
          ],
          [
            "Agrupación del mapa",
            "agrupa marcadores cercanos para mantener el mapa claro."
          ],
          [
            "Brújula: rayo más cercano",
            "orienta la vista hacia el rayo detectado más próximo."
          ],
          [
            "Orientación del dispositivo",
            "puede usar la orientación en dispositivos móviles compatibles."
          ],
          [
            "Calibración y diagnóstico",
            "ofrece herramientas para comprobar, medir y diagnosticar de forma específica la visualización y sus componentes. Incluye, entre otras, la calibración de brújula y medallón, vistas de diagnóstico y funciones de prueba como la simulación de tormenta. Estas herramientas están pensadas para configuración, desarrollo y resolución de problemas y deben permanecer desactivadas durante el funcionamiento normal."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Ajustes básicos recomendados",
        "paragraphs": [
          "Para un inicio estable recomendamos:"
        ],
        "entries": [
          [
            "Valores de prueba · 500 km / 120 min / 200",
            "Un radio de detección de 500 km, una ventana de 120 minutos y 200 rayos son valores de ejemplo para pruebas, no ajustes obligatorios. Pueden adaptarse al uso, al alcance de observación deseado y a las necesidades personales."
          ],
          [
            "Coordinar ubicación y tracker",
            "Configura en Blitzortung los ajustes correspondientes tanto para la ubicación definida allí como para el tracker usado por Gewitterradar. Así, la región de datos y la visualización permanecen coherentes."
          ],
          [
            "Coordinar radios",
            "Configura el radio de la fuente Blitzortung al menos tan grande como el radio de observación de Gewitterradar."
          ],
          [
            "Mantener activado",
            "Mantén activadas la agrupación del mapa y la animación de aviso."
          ],
          [
            "Opcional",
            "Ajusta los efectos de aura a tu gusto; no afectan a la detección. Activa la orientación del dispositivo solo si se necesita en el móvil utilizado."
          ],
          [
            "Funcionamiento normal",
            "Mantén desactivadas durante el uso normal las herramientas de “Calibración y diagnóstico”, especialmente la simulación de tormenta."
          ],
          [
            "Recorder – comprobar",
            "Revisa las exclusiones del Recorder para datos de rayos y posición que se actualizan con frecuencia. Sin exclusiones adecuadas, la base de datos de Home Assistant y las copias de seguridad pueden crecer muy rápido. Consulta “Home Assistant Recorder” para detalles y YAML."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Si algo no funciona",
        "entries": [
          [
            "No hay rayos o hay muy pocos",
            "Comprueba el estado de la fuente, el radio de origen y las entidades de rayos utilizadas."
          ],
          [
            "Las distancias o direcciones parecen incorrectas",
            "Comprueba la ubicación de referencia y la unidad de distancia."
          ],
          [
            "La copia de seguridad crece de forma inusual",
            "La falta de exclusiones del Recorder para datos de rayos y posición que cambian con frecuencia puede hacer crecer muy rápido la base de datos de Home Assistant y, por tanto, las copias de seguridad. Revisa el Recorder; consulta “Home Assistant Recorder” para detalles y YAML."
          ],
          [
            "La selección de idioma reaparece",
            "Comprueba que estén instalados el paquete actual de Gewitterradar y el ayudante de inicialización."
          ],
          [
            "La vista no cambia tras actualizar",
            "Recarga completamente la caché del navegador o la aplicación y confirma que se usa el JavaScript actual."
          ],
          [
            "Comportamiento extraño o tarjeta duplicada",
            "Solo puede estar activo UN recurso de módulo Gewitterradar en Home Assistant. La integración nativa y el recurso Dashboard/HACS no deben registrar simultáneamente la misma tarjeta personalizada."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Los datos de rayos pueden generar muchísimos cambios de estado. Para mantener Recorder ligero a largo plazo, recomendamos excluir las siguientes entidades y patrones."
        ],
        "recorder": true,
        "notes": [
          "Si ya existe una sección recorder:, incorpora allí estas entradas. No crees un segundo bloque recorder: de nivel superior.",
          "Las exclusiones NO desactivan los estados en vivo utilizados por Gewitterradar.",
          "Los datos históricos existentes no se eliminan automáticamente.",
          "Los patrones comodín admiten varios detectores u observatorios independientemente del prefijo de entidad."
        ]
      }
    ]
  },
  "Français": {
    "menuTitle": "Aide et remarques",
    "title": "Aide et remarques",
    "subtitle": "Un guide concis pour que Gewitterradar reste fiable et facile à comprendre.",
    "close": "Fermer l’aide",
    "copy": "Copier le YAML",
    "copied": "Copié",
    "copyFailed": "Copie impossible — sélectionnez le code.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Prérequis",
        "paragraphs": [
          "Gewitterradar traite les données de foudre que Home Assistant reçoit de la source de détection configurée. Vérifiez-y le bon emplacement de référence et définissez le rayon de la source au moins aussi grand que le rayon d’observation de Gewitterradar. Gewitterradar ne peut ni afficher ni évaluer les impacts déjà filtrés par la source."
        ],
        "notes": [
          "Si plusieurs détecteurs ou points d’observation existent, les entités utilisées doivent correspondre sans ambiguïté au point de référence souhaité."
        ]
      },
      {
        "key": "radii",
        "title": "Les rayons",
        "paragraphs": [
          "Les rayons sont cumulatifs : un impact dans le rayon de danger compte aussi dans les rayons d’orage et d’observation. Ce sont des seuils de distance, pas des sources de données séparées."
        ],
        "items": [
          "Rayon d’observation – zone extérieure pour l’observation précoce.",
          "Rayon d’orage – zone plus proche demandant une vigilance accrue.",
          "Rayon de danger – proximité immédiate particulièrement importante."
        ],
        "notes": [
          "Le rayon de danger est limité à 250 km maximum. Consultez « Réglages de base recommandés » pour les valeurs de départ conseillées et la coordination nécessaire avec l’application Blitzortung."
        ]
      },
      {
        "key": "location",
        "title": "Lieu & lieux enregistrés",
        "paragraphs": [
          "Le lieu sélectionné est le point de référence à partir duquel Gewitterradar calcule les distances et les directions. La bibliothèque de lieux reste locale dans Home Assistant."
        ],
        "entries": [
          [
            "Lieu",
            "Le tableau de bord V4.07 utilise device_tracker.gewitterradar_dashboard pour la recherche mondiale. Pour que la zone de données en direct suive aussi, Blitzortung doit suivre ce tracker comme entité de localisation."
          ],
          [
            "Configurer Blitzortung",
            "Configurez Blitzortung via Paramètres → Appareils et services → Blitzortung → Ajouter une entrée, choisissez « Location entity », puis « Gewitterradar Dashboard ». Une ancienne entrée à coordonnées fixes ne peut pas être convertie par reconfiguration ; créez-en une nouvelle, testez-la, puis seulement désactivez l’ancienne."
          ],
          [
            "Appliquer le lieu",
            "« Appliquer » définit le lieu, ferme la recherche et centre la carte."
          ],
          [
            "Configurer la liste des lieux enregistrés",
            "Pour enregistrer, créez une liste Local to-do nommée exactement « Gewitterradar Orte »."
          ],
          [
            "Lieux enregistrés",
            "★ Enregistrer conserve durablement les lieux trouvés en local. Ils apparaissent sous « Lieux enregistrés » et peuvent être réutilisés sans nouvelle recherche. × ne supprime pas immédiatement un lieu : il le marque pour suppression. Sous « Lieux supprimés », ↶ le restaure à tout moment en conservant coordonnées et métadonnées."
          ]
        ],
        "notes": [
          "Un déplacement de carte seul ne prouve pas que Blitzortung a déjà changé sa zone de données en direct. L’intégration native utilise device_tracker.gewitterradar au lieu du tracker du tableau de bord."
        ]
      },
      {
        "key": "external_services",
        "title": "Services externes et autorisations réseau",
        "paragraphs": [
          "Gewitterradar utilise deux chemins réseau : carte et recherche partent du navigateur/de la Companion App, tandis que les données Blitzortung sont récupérées par l’intégration Blitzortung sur le serveur Home Assistant. Pare-feu, VLAN, proxy, filtrage DNS et inspection TLS doivent donc être vérifiés séparément.",
          "Les destinations ci-dessous constituent l’inventaire d’exécution V4.07 actuel. La bibliothèque locale, le tracker et les services Home Assistant n’ont pas besoin d’Internet."
        ],
        "entries": [
          [
            "Client · Géocodage Open-Meteo",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · recherche mondiale principale ; transmet requête, langue et code ISO uniquement si un pays est explicitement choisi. En cas d’échec, Nominatim sert de repli."
          ],
          [
            "Client · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · repli de recherche ; transmet requête, langue et éventuel code ISO. Les appels publics sont espacés d’au moins une seconde et l’autocomplétion locale des pays ne fait aucun appel réseau. Si les deux services sont bloqués, les lieux enregistrés restent utilisables."
          ],
          [
            "Client · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · charge Leaflet 1.9.4 JavaScript/CSS. Sans Leaflet déjà en cache, bloquer cet hôte empêche l’initialisation de la carte."
          ],
          [
            "Client · tuiles OpenStreetMap",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · tuiles de fond. Si elles sont bloquées, les données peuvent subsister mais le fond de carte reste vide ou incomplet."
          ],
          [
            "Serveur · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · connexion sortante du serveur Home Assistant. Blitzortung v1.7.1 utilise ce broker et des sujets geohash pour les éclairs en direct ; un blocage interrompt les nouvelles données sans affecter recherche/carte."
          ],
          [
            "Local · aucune autorisation externe",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, le service de coordonnées, le script du tableau de bord et la liste Local to-do « Gewitterradar Orte » restent locaux."
          ],
          [
            "Installation / mise à jour",
            "GitHub/HACS servent à installer et mettre à jour, pas au fonctionnement courant d’une carte Gewitterradar ouverte."
          ],
          [
            "Diagnostic rapide",
            "Recherche en panne : Open-Meteo/Nominatim. Carte ne démarre pas : unpkg.com. Fond vide : hôtes de tuiles OSM. Éclairs absents/anciens : blitzortung.ha.sed.pl:1883 et intégration Blitzortung."
          ]
        ],
        "notes": [
          "La résolution DNS doit fonctionner sur le client et le serveur Home Assistant pour leurs destinations respectives.",
          "Proxy HTTPS, inspection TLS, filtres, bloqueurs ou extensions peuvent bloquer les requêtes malgré TCP 443 ouvert ; pour le géocodage vérifier aussi CORS/filtrage des réponses.",
          "Confidentialité : le géocodage reçoit requête/paramètres, les tuiles OSM révèlent techniquement la zone affichée et le broker Blitzortung reçoit les sujets région/geohash abonnés.",
          "http://www.w3.org/2000/svg est uniquement l’espace de noms SVG, pas un appel réseau externe.",
          "L’inventaire d’exécution est protégé automatiquement : toute nouvelle URL externe fixe doit faire échouer le test jusqu’à mise à jour de la documentation et des autorisations."
        ]
      },
      {
        "key": "functions",
        "title": "Fonctions importantes",
        "entries": [
          [
            "Effets d’aura",
            "visualisent l’activité de foudre sans modifier la détection ni le comptage."
          ],
          [
            "Animation d’alerte",
            "met visuellement en évidence l’activité orageuse pertinente."
          ],
          [
            "Regroupement de carte",
            "regroupe les marqueurs proches pour garder la carte lisible."
          ],
          [
            "Boussole : impact le plus proche",
            "oriente l’affichage vers l’impact détecté le plus proche."
          ],
          [
            "Orientation de l’appareil",
            "peut utiliser l’orientation des appareils mobiles compatibles."
          ],
          [
            "Étalonnage et diagnostic",
            "fournit des outils de contrôle ciblé, de mesure et de diagnostic de l’affichage et de ses composants. Cela comprend notamment l’étalonnage de la boussole et du médaillon, des vues de diagnostic et des fonctions de test telles que la simulation d’orage. Ces outils sont destinés à la configuration, au développement et au dépannage et doivent rester désactivés en fonctionnement normal."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Réglages de base recommandés",
        "paragraphs": [
          "Pour un démarrage stable, nous recommandons :"
        ],
        "entries": [
          [
            "Valeurs de test · 500 km / 120 min / 200",
            "Un rayon de détection de 500 km, une fenêtre de 120 minutes et 200 éclairs sont des valeurs d’exemple pour les tests, et non des réglages obligatoires. Elles peuvent être adaptées à l’usage, à la portée d’observation souhaitée et aux besoins personnels."
          ],
          [
            "Coordonner lieu & tracker",
            "Configurez dans Blitzortung les réglages correspondants pour le lieu défini et pour le tracker utilisé par Gewitterradar. La zone de données et l’affichage restent ainsi cohérents."
          ],
          [
            "Coordonner les rayons",
            "Réglez le rayon de la source Blitzortung au moins aussi grand que le rayon d’observation Gewitterradar."
          ],
          [
            "Laisser activé",
            "Laissez activés le regroupement de carte et l’animation d’avertissement."
          ],
          [
            "Facultatif",
            "Réglez les effets d’aura selon vos préférences ; ils n’influencent pas la détection. Activez l’orientation de l’appareil uniquement si elle est nécessaire sur l’appareil mobile utilisé."
          ],
          [
            "Fonctionnement normal",
            "Laissez désactivés en fonctionnement normal les outils de « Étalonnage et diagnostic », en particulier la simulation d’orage."
          ],
          [
            "Recorder – à vérifier",
            "Vérifiez les exclusions Recorder pour les données de foudre et de position fréquemment mises à jour. Sans exclusions adaptées, la base de données Home Assistant et les sauvegardes peuvent grossir très rapidement. Voir « Home Assistant Recorder » pour les détails et le YAML."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Si quelque chose ne fonctionne pas",
        "entries": [
          [
            "Aucun impact ou trop peu",
            "Vérifiez l’état de la source, son rayon et les entités de foudre utilisées."
          ],
          [
            "Distances ou directions incorrectes",
            "Vérifiez l’emplacement de référence et l’unité de distance."
          ],
          [
            "La sauvegarde grossit anormalement vite",
            "L’absence d’exclusions Recorder pour les données de foudre et de position fréquemment mises à jour peut faire grossir très rapidement la base de données Home Assistant et donc les sauvegardes. Vérifiez le Recorder ; voir « Home Assistant Recorder » pour les détails et le YAML."
          ],
          [
            "Le choix de langue réapparaît",
            "Vérifiez que le package Gewitterradar actuel et l’assistant d’initialisation sont installés."
          ],
          [
            "Affichage inchangé après mise à jour",
            "Rechargez complètement le cache du navigateur ou de l’application et vérifiez que le JavaScript actuel est utilisé."
          ],
          [
            "Comportement étrange ou carte en double",
            "Une seule ressource de module Gewitterradar doit être active dans Home Assistant. L’intégration native et la ressource Dashboard/HACS ne doivent pas enregistrer simultanément la même carte personnalisée."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Les données de foudre peuvent produire de très nombreux changements d’état. Pour garder Recorder léger sur le long terme, nous recommandons d’exclure les entités et motifs suivants."
        ],
        "recorder": true,
        "notes": [
          "Si une section recorder: existe déjà, fusionnez-y ces entrées. Ne créez pas un second bloc recorder: de premier niveau.",
          "Ces exclusions ne désactivent PAS les états en direct utilisés par Gewitterradar.",
          "Les données historiques existantes ne sont pas supprimées automatiquement.",
          "Les motifs génériques prennent en charge plusieurs détecteurs ou points d’observation, quel que soit le préfixe des entités."
        ]
      }
    ]
  },
  "Nederlands": {
    "menuTitle": "Hulp & aanwijzingen",
    "title": "Hulp & aanwijzingen",
    "subtitle": "Een korte gids om Gewitterradar betrouwbaar en begrijpelijk te laten werken.",
    "close": "Hulp sluiten",
    "copy": "YAML kopiëren",
    "copied": "Gekopieerd",
    "copyFailed": "Kopiëren niet mogelijk — selecteer de code.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Vereisten",
        "paragraphs": [
          "Gewitterradar verwerkt de bliksemgegevens die Home Assistant van de ingestelde detectiebron ontvangt. Controleer daar de juiste referentielocatie en stel de bronradius minstens zo groot in als de observatieradius in Gewitterradar. Gewitterradar kan inslagen die al door de bron zijn weggefilterd niet tonen of beoordelen."
        ],
        "notes": [
          "Bij meerdere detectoren of observatiepunten moeten de gebruikte entiteiten eenduidig bij het gewenste referentiepunt horen."
        ]
      },
      {
        "key": "radii",
        "title": "De stralen",
        "paragraphs": [
          "De stralen zijn cumulatief: een inslag binnen de gevarenradius telt ook binnen de onweers- en observatieradius. Het zijn afstandsdrempels, geen afzonderlijke gegevensbronnen."
        ],
        "items": [
          "Observatieradius – buitenste gebied voor vroege observatie.",
          "Onweersradius – dichter gebied dat extra aandacht vraagt.",
          "Gevarenradius – directe omgeving met bijzonder hoge relevantie."
        ],
        "notes": [
          "De gevarenradius is beperkt tot maximaal 250 km. Zie “Aanbevolen basisinstellingen” voor aanbevolen startwaarden en de vereiste afstemming met de Blitzortung-app."
        ]
      },
      {
        "key": "location",
        "title": "Locatie & opgeslagen plaatsen",
        "paragraphs": [
          "De gekozen plaats is het referentiepunt van waaruit Gewitterradar afstanden en richtingen berekent. De plaatsenbibliotheek blijft lokaal in Home Assistant."
        ],
        "entries": [
          [
            "Locatie",
            "Het V4.07-dashboard gebruikt device_tracker.gewitterradar_dashboard voor wereldwijd zoeken. Om ook het live-datagebied te laten volgen, moet Blitzortung deze tracker zelf als locatie-entiteit volgen."
          ],
          [
            "Blitzortung instellen",
            "Stel Blitzortung in via Instellingen → Apparaten & diensten → Blitzortung → Item toevoegen, kies “Location entity” en daarna “Gewitterradar Dashboard”. Een oude invoer met vaste coördinaten kan niet via herconfigureren worden omgezet; maak een nieuwe invoer, test die en schakel de oude pas daarna uit."
          ],
          [
            "Locatie overnemen",
            "“Overnemen” neemt de plaats over, sluit de zoekopdracht en centreert de kaart."
          ],
          [
            "Lijst voor opgeslagen plaatsen instellen",
            "Maak voor opslaan een Local to-do-lijst met exact de naam “Gewitterradar Orte”."
          ],
          [
            "Opgeslagen plaatsen",
            "★ Opslaan bewaart gevonden plaatsen permanent lokaal. Ze verschijnen onder “Opgeslagen plaatsen” en kunnen zonder nieuwe zoekactie opnieuw worden gebruikt. × verwijdert een plaats niet meteen, maar markeert deze voor verwijdering. Onder “Verwijderde plaatsen” herstelt ↶ de plaats op elk moment; coördinaten en metadata blijven behouden."
          ]
        ],
        "notes": [
          "Alleen de kaart verplaatsen bewijst niet dat Blitzortung zijn live-dataregio al heeft gewijzigd. De native integratie gebruikt device_tracker.gewitterradar in plaats van de dashboardtracker."
        ]
      },
      {
        "key": "external_services",
        "title": "Externe diensten & netwerktoegang",
        "paragraphs": [
          "Gewitterradar gebruikt twee netwerkpaden: kaart en zoeken gaan rechtstreeks vanaf browser/Companion App, terwijl Blitzortung-livegegevens door de Blitzortung-integratie op de Home Assistant-server worden opgehaald. Firewall, VLAN, proxy, DNS-filter en TLS-inspectie moeten daarom apart worden beoordeeld.",
          "Onderstaande doelen vormen de huidige V4.07-runtime-inventaris. Lokale plaatsen, tracker en Home Assistant-diensten hebben geen internettoegang nodig."
        ],
        "entries": [
          [
            "Client · Open-Meteo-geocodering",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · primaire wereldwijde zoekdienst; verstuurt zoekterm, taal en alleen bij expliciet landfilter de ISO-code. Bij uitval volgt Nominatim."
          ],
          [
            "Client · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · terugvaldienst; verstuurt zoekterm, taal en eventueel ISO-code. Publieke oproepen liggen minimaal één seconde uit elkaar en lokale landaanvulling maakt geen netwerkoproepen. Als beide diensten geblokkeerd zijn, blijven opgeslagen plaatsen lokaal bruikbaar."
          ],
          [
            "Client · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · levert Leaflet 1.9.4 JavaScript/CSS. Zonder gecachte Leaflet kan de kaart bij blokkade niet initialiseren."
          ],
          [
            "Client · OpenStreetMap-tegels",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · basistegels. Bij blokkade kunnen Gewitterradar-gegevens bestaan, maar de basiskaart blijft leeg of onvolledig."
          ],
          [
            "Server · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · uitgaand vanaf de Home Assistant-server. Blitzortung v1.7.1 gebruikt broker/geohash-onderwerpen voor live bliksem; blokkade stopt nieuwe livegegevens maar niet zoeken/kaart."
          ],
          [
            "Lokaal · geen externe toegang",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, coördinatendienst, dashboardscript en Local to-do-lijst “Gewitterradar Orte” werken lokaal."
          ],
          [
            "Installatie / update",
            "GitHub/HACS zijn voor installatie en updates, niet voor de runtime van een geopende Gewitterradar-kaart."
          ],
          [
            "Snelle diagnose",
            "Zoeken stuk: Open-Meteo/Nominatim. Kaart start niet: unpkg.com. Lege basiskaart: OSM-tegelhosts. Ontbrekende/oude bliksem: blitzortung.ha.sed.pl:1883 en Blitzortung-integratie."
          ]
        ],
        "notes": [
          "DNS moet op client en Home Assistant-server werken voor de respectieve doelen.",
          "HTTPS-proxy, TLS-inspectie, filters, blokkeerders of browserextensies kunnen verzoeken blokkeren ondanks open TCP 443; controleer bij geocodering ook CORS/antwoordfilters.",
          "Privacy: geocodering ontvangt zoekterm/parameters, OSM-tegels verraden technisch het bekeken kaartgebied en de Blitzortung-broker ontvangt geabonneerde regio-/geohash-onderwerpen.",
          "http://www.w3.org/2000/svg is alleen de SVG-naamruimte en geen externe netwerkaanroep.",
          "De runtime-inventaris is geautomatiseerd bewaakt: een nieuw vast extern URL-doel moet de test laten falen totdat documentatie en toestemmingen zijn bijgewerkt."
        ]
      },
      {
        "key": "functions",
        "title": "Belangrijke functies",
        "entries": [
          [
            "Aura-effecten",
            "visualiseren bliksemactiviteit maar veranderen detectie of telling niet."
          ],
          [
            "Waarschuwingsanimatie",
            "benadrukt relevante onweersactiviteit visueel."
          ],
          [
            "Kaartgroepering",
            "voegt nabije inslagmarkeringen samen en houdt de kaart overzichtelijk."
          ],
          [
            "Kompas: dichtstbijzijnde inslag",
            "richt de weergave op de dichtstbijzijnde gedetecteerde inslag."
          ],
          [
            "Apparaatoriëntatie",
            "kan op ondersteunde mobiele apparaten de oriëntatie gebruiken."
          ],
          [
            "Kalibratie en diagnose",
            "biedt hulpmiddelen voor gerichte controle, meting en probleemdiagnose van de weergave en afzonderlijke onderdelen. Dit omvat onder meer kompas- en medaillonkalibratie, diagnoseweergaven en testfuncties zoals de onweerssimulatie. Deze hulpmiddelen zijn bedoeld voor configuratie, ontwikkeling en foutopsporing en moeten tijdens normaal gebruik uitgeschakeld blijven."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Aanbevolen basisinstellingen",
        "paragraphs": [
          "Voor een stabiele start adviseren we:"
        ],
        "entries": [
          [
            "Testwaarden · 500 km / 120 min / 200",
            "Een detectieradius van 500 km, een tijdvenster van 120 minuten en 200 bliksems zijn voorbeeldwaarden voor tests, geen verplichte instellingen. Ze kunnen worden aangepast aan het gebruik, het gewenste observatiebereik en persoonlijke behoeften."
          ],
          [
            "Locatie & tracker afstemmen",
            "Stem de instellingen in Blitzortung af op zowel de daar ingestelde locatie als de tracker die Gewitterradar gebruikt. Zo blijven dataregio en weergave consistent."
          ],
          [
            "Radii afstemmen",
            "Stel de bronradius van Blitzortung minstens zo groot in als de observatieradius van Gewitterradar."
          ],
          [
            "Ingeschakeld laten",
            "Laat kaartgroepering en waarschuwingsanimatie ingeschakeld."
          ],
          [
            "Optioneel",
            "Stel aura-effecten naar wens in; ze beïnvloeden de detectie niet. Schakel apparaatoriëntatie alleen in als die op het gebruikte mobiele apparaat nodig is."
          ],
          [
            "Normaal gebruik",
            "Laat de hulpmiddelen onder “Kalibratie en diagnose”, met name de onweerssimulatie, tijdens normaal gebruik uitgeschakeld."
          ],
          [
            "Recorder – controleren",
            "Controleer Recorder-uitsluitingen voor vaak bijgewerkte bliksem- en positiegegevens. Zonder geschikte uitsluitingen kunnen de Home Assistant-database en back-ups zeer snel groeien. Zie “Home Assistant Recorder” voor details en YAML."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Als iets niet werkt",
        "entries": [
          [
            "Geen of te weinig inslagen",
            "Controleer de bronstatus, bronradius en gebruikte bliksementiteiten."
          ],
          [
            "Afstanden of richtingen lijken verkeerd",
            "Controleer referentielocatie en afstandseenheid."
          ],
          [
            "Back-up groeit ongewoon snel",
            "Ontbrekende Recorder-uitsluitingen voor vaak bijgewerkte bliksem- en positiegegevens kunnen de Home Assistant-database en daardoor ook back-ups zeer snel laten groeien. Controleer de Recorder-instellingen; zie “Home Assistant Recorder” voor details en YAML."
          ],
          [
            "Taalkeuze blijft terugkomen",
            "Controleer of het actuele Gewitterradar-package en de initialisatiehelper zijn geïnstalleerd."
          ],
          [
            "Weergave na update onveranderd",
            "Laad de browser-/appcache volledig opnieuw en controleer dat het actuele JavaScript-bestand wordt gebruikt."
          ],
          [
            "Vreemd gedrag of dubbele kaart",
            "Er mag slechts ÉÉN Gewitterradar-moduleresource actief zijn in Home Assistant. De native integratie en Dashboard-/HACS-resource mogen dezelfde custom card niet tegelijk registreren."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Bliksemgegevens kunnen zeer veel statuswijzigingen veroorzaken. Voor een slanke Recorder-configuratie op lange termijn adviseren we de volgende entiteiten en patronen uit te sluiten."
        ],
        "recorder": true,
        "notes": [
          "Voeg deze regels toe aan een bestaande recorder:-sectie. Maak geen tweede recorder:-blok op het hoogste niveau.",
          "De uitsluitingen schakelen live-statussen voor Gewitterradar NIET uit.",
          "Bestaande historische gegevens worden niet automatisch verwijderd.",
          "De jokerpatronen ondersteunen meerdere detectoren of observatiepunten, ongeacht het entiteitsvoorvoegsel."
        ]
      }
    ]
  },
  "Polski": {
    "menuTitle": "Pomoc i wskazówki",
    "title": "Pomoc i wskazówki",
    "subtitle": "Krótki przewodnik, aby Gewitterradar działał niezawodnie i był łatwy do zrozumienia.",
    "close": "Zamknij pomoc",
    "copy": "Kopiuj YAML",
    "copied": "Skopiowano",
    "copyFailed": "Nie można skopiować — zaznacz kod.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Wymagania",
        "paragraphs": [
          "Gewitterradar przetwarza dane o wyładowaniach, które Home Assistant otrzymuje ze skonfigurowanego źródła detekcji. Sprawdź tam właściwą lokalizację odniesienia i ustaw promień źródła co najmniej tak duży jak promień obserwacji w Gewitterradar. Gewitterradar nie może wyświetlać ani oceniać wyładowań odfiltrowanych już przez źródło."
        ],
        "notes": [
          "Jeśli dostępnych jest kilka detektorów lub punktów obserwacyjnych, używane encje muszą jednoznacznie należeć do właściwego punktu odniesienia."
        ]
      },
      {
        "key": "radii",
        "title": "Promienie",
        "paragraphs": [
          "Promienie nakładają się: wyładowanie w promieniu zagrożenia liczy się także w promieniu burzy i obserwacji. Są to progi odległości, a nie oddzielne źródła danych."
        ],
        "items": [
          "Promień obserwacji – zewnętrzny obszar wczesnej obserwacji.",
          "Promień burzy – bliższy obszar wymagający większej uwagi.",
          "Promień zagrożenia – bezpośrednie otoczenie o szczególnym znaczeniu."
        ],
        "notes": [
          "Promień zagrożenia jest ograniczony do maksymalnie 250 km. Zalecane wartości początkowe i wymagane uzgodnienie z aplikacją Blitzortung opisano w sekcji „Zalecane ustawienia podstawowe”."
        ]
      },
      {
        "key": "location",
        "title": "Lokalizacja i zapisane miejsca",
        "paragraphs": [
          "Wybrane miejsce jest punktem odniesienia, od którego Gewitterradar oblicza odległości i kierunki. Biblioteka miejsc pozostaje lokalnie w Home Assistant."
        ],
        "entries": [
          [
            "Lokalizacja",
            "Dashboard V4.07 używa device_tracker.gewitterradar_dashboard do wyszukiwania globalnego. Aby region danych na żywo także podążał za wyborem, Blitzortung musi śledzić ten tracker jako encję lokalizacji."
          ],
          [
            "Skonfiguruj Blitzortung",
            "Skonfiguruj Blitzortung: Ustawienia → Urządzenia i usługi → Blitzortung → Dodaj wpis, wybierz “Location entity”, a następnie “Gewitterradar Dashboard”. Starszego wpisu ze stałymi współrzędnymi nie można tak przekonfigurować; utwórz nowy, sprawdź go, a dopiero potem wyłącz stary."
          ],
          [
            "Zastosuj lokalizację",
            "“Zastosuj” ustawia miejsce, zamyka wyszukiwanie i centruje mapę."
          ],
          [
            "Skonfiguruj listę zapisanych miejsc",
            "Do zapisu utwórz listę Local to-do o dokładnej nazwie “Gewitterradar Orte”."
          ],
          [
            "Zapisane miejsca",
            "★ Zapisz trwale zapisuje znalezione miejsca lokalnie. Pojawiają się w „Zapisanych miejscach” i można ich używać ponownie bez kolejnego wyszukiwania. × nie usuwa miejsca od razu, lecz oznacza je do usunięcia. W „Usuniętych miejscach” ↶ przywraca je w dowolnym momencie, zachowując współrzędne i metadane."
          ]
        ],
        "notes": [
          "Samo przesunięcie mapy nie dowodzi, że Blitzortung już zmienił region danych na żywo. Integracja natywna używa device_tracker.gewitterradar zamiast trackera dashboardu."
        ]
      },
      {
        "key": "external_services",
        "title": "Usługi zewnętrzne i dostęp sieciowy",
        "paragraphs": [
          "Gewitterradar używa dwóch ścieżek sieciowych: mapa i wyszukiwanie wychodzą bezpośrednio z przeglądarki/Companion App, natomiast dane Blitzortung pobiera integracja na serwerze Home Assistant. Firewall, VLAN, proxy, filtr DNS i inspekcja TLS wymagają osobnej weryfikacji obu ścieżek.",
          "Poniższe cele to aktualny inwentarz runtime V4.07. Lokalna biblioteka, tracker i usługi Home Assistant nie potrzebują Internetu."
        ],
        "entries": [
          [
            "Klient · geokodowanie Open-Meteo",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · podstawowe globalne wyszukiwanie; wysyła zapytanie, język i tylko przy jawnym filtrze kod ISO. Przy awarii używany jest Nominatim."
          ],
          [
            "Klient · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · zapas; wysyła zapytanie, język i ewentualny kod ISO. Publiczne wywołania są oddalone o co najmniej sekundę, a lokalne podpowiedzi krajów nie korzystają z sieci. Przy blokadzie obu usług zapisane miejsca nadal działają lokalnie."
          ],
          [
            "Klient · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · dostarcza Leaflet 1.9.4 JavaScript/CSS. Bez wersji w pamięci podręcznej blokada uniemożliwia inicjalizację mapy."
          ],
          [
            "Klient · kafelki OpenStreetMap",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · kafelki mapy bazowej. Po blokadzie dane mogą istnieć, ale mapa bazowa będzie pusta/niepełna."
          ],
          [
            "Serwer · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · połączenie wychodzące z serwera Home Assistant. Blitzortung v1.7.1 używa brokera i tematów geohash dla danych live; blokada zatrzymuje nowe wyładowania, ale nie wyszukiwanie/mapę."
          ],
          [
            "Lokalnie · bez dostępu zewnętrznego",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, usługa współrzędnych, skrypt dashboardu i lista Local to-do “Gewitterradar Orte” działają lokalnie."
          ],
          [
            "Instalacja / aktualizacja",
            "GitHub/HACS służą do instalacji i aktualizacji, nie są zależnością runtime otwartej mapy Gewitterradar."
          ],
          [
            "Szybka diagnostyka",
            "Nie działa wyszukiwanie: Open-Meteo/Nominatim. Mapa nie startuje: unpkg.com. Puste tło: hosty kafelków OSM. Brak/stare wyładowania: blitzortung.ha.sed.pl:1883 i integracja Blitzortung."
          ]
        ],
        "notes": [
          "DNS musi działać na kliencie i serwerze Home Assistant dla ich odpowiednich celów.",
          "Proxy HTTPS, inspekcja TLS, filtry, blokery lub rozszerzenia mogą blokować żądania mimo otwartego TCP 443; przy geokodowaniu sprawdź też CORS/filtr odpowiedzi.",
          "Prywatność: geokodowanie otrzymuje zapytanie/parametry, kafelki OSM technicznie ujawniają oglądany obszar, a broker Blitzortung otrzymuje subskrybowane tematy region/geohash.",
          "http://www.w3.org/2000/svg to wyłącznie przestrzeń nazw SVG, a nie zewnętrzne wywołanie sieciowe.",
          "Inwentarz runtime jest automatycznie chroniony: nowy stały zewnętrzny URL ma przerwać test do czasu aktualizacji dokumentacji i zezwoleń."
        ]
      },
      {
        "key": "functions",
        "title": "Ważne funkcje",
        "entries": [
          [
            "Efekty aury",
            "wizualizują aktywność wyładowań, ale nie zmieniają wykrywania ani zliczania."
          ],
          [
            "Animacja ostrzeżenia",
            "wyróżnia wizualnie istotną aktywność burzową."
          ],
          [
            "Grupowanie mapy",
            "łączy pobliskie znaczniki i utrzymuje czytelność mapy."
          ],
          [
            "Kompas: najbliższe wyładowanie",
            "kieruje widok na najbliższe wykryte wyładowanie."
          ],
          [
            "Orientacja urządzenia",
            "może uwzględniać orientację obsługiwanych urządzeń mobilnych."
          ],
          [
            "Kalibracja i diagnostyka",
            "udostępnia narzędzia do ukierunkowanej kontroli, pomiarów i diagnostyki widoku oraz poszczególnych elementów. Obejmują one m.in. kalibrację kompasu i medalionu, widoki diagnostyczne oraz funkcje testowe, takie jak symulacja burzy. Narzędzia te są przeznaczone do konfiguracji, rozwoju i rozwiązywania problemów i podczas normalnej pracy powinny pozostać wyłączone."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Zalecane ustawienia podstawowe",
        "paragraphs": [
          "Dla stabilnego startu zalecamy:"
        ],
        "entries": [
          [
            "Wartości testowe · 500 km / 120 min / 200",
            "Promień wykrywania 500 km, okno czasowe 120 minut i 200 wyładowań to przykładowe wartości testowe, a nie obowiązkowe ustawienia. Można je dopasować do zastosowania, oczekiwanego zasięgu obserwacji i własnych potrzeb."
          ],
          [
            "Uzgodnij lokalizację i tracker",
            "Uzgodnij ustawienia w Blitzortung zarówno dla skonfigurowanej tam lokalizacji, jak i trackera używanego przez Gewitterradar. Dzięki temu region danych i widok pozostają spójne."
          ],
          [
            "Uzgodnij promienie",
            "Ustaw promień źródła Blitzortung co najmniej tak duży jak promień obserwacji Gewitterradar."
          ],
          [
            "Pozostaw włączone",
            "Pozostaw włączone grupowanie mapy i animację ostrzegawczą."
          ],
          [
            "Opcjonalnie",
            "Dostosuj efekty aury do własnych preferencji; nie wpływają na wykrywanie. Orientację urządzenia włączaj tylko wtedy, gdy jest potrzebna na używanym urządzeniu mobilnym."
          ],
          [
            "Normalna praca",
            "Podczas normalnej pracy pozostaw wyłączone narzędzia z sekcji „Kalibracja i diagnostyka”, szczególnie symulację burzy."
          ],
          [
            "Recorder – koniecznie sprawdź",
            "Sprawdź wykluczenia Recorder dla często aktualizowanych danych o wyładowaniach i położeniu. Bez właściwych wykluczeń baza danych Home Assistant i kopie zapasowe mogą rosnąć bardzo szybko. Szczegóły i YAML: „Home Assistant Recorder”."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Gdy coś nie działa",
        "entries": [
          [
            "Brak lub za mało wyładowań",
            "Sprawdź stan źródła, promień źródła i używane encje wyładowań."
          ],
          [
            "Odległości lub kierunki są błędne",
            "Sprawdź lokalizację odniesienia i jednostkę odległości."
          ],
          [
            "Kopia zapasowa rośnie nietypowo szybko",
            "Brak wykluczeń Recorder dla często aktualizowanych danych o wyładowaniach i położeniu może bardzo szybko powiększać bazę Home Assistant, a tym samym kopie zapasowe. Sprawdź ustawienia Recorder; szczegóły i YAML znajdziesz w „Home Assistant Recorder”."
          ],
          [
            "Wybór języka ciągle wraca",
            "Sprawdź, czy zainstalowano aktualny pakiet Gewitterradar i helper inicjalizacji."
          ],
          [
            "Wygląd nie zmienił się po aktualizacji",
            "Całkowicie przeładuj pamięć podręczną przeglądarki/aplikacji i upewnij się, że używany jest aktualny plik JavaScript."
          ],
          [
            "Nietypowe zachowanie lub podwójna karta",
            "W Home Assistant może być aktywny tylko JEDEN zasób modułu Gewitterradar. Integracja natywna i zasób Dashboard/HACS nie mogą jednocześnie rejestrować tej samej karty niestandardowej."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Dane o wyładowaniach mogą generować bardzo wiele zmian stanu. Aby Recorder pozostał lekki w długim okresie, zalecamy wykluczenie poniższych encji i wzorców."
        ],
        "recorder": true,
        "notes": [
          "Jeśli sekcja recorder: już istnieje, dodaj do niej te wpisy. Nie twórz drugiego bloku recorder: najwyższego poziomu.",
          "Wykluczenia NIE wyłączają stanów na żywo używanych przez Gewitterradar.",
          "Istniejące dane historyczne nie są automatycznie usuwane.",
          "Wzorce wieloznaczne obsługują wiele detektorów lub punktów obserwacyjnych niezależnie od prefiksu encji."
        ]
      }
    ]
  },
  "Português": {
    "menuTitle": "Ajuda e notas",
    "title": "Ajuda e notas",
    "subtitle": "Um guia breve para manter o Gewitterradar fiável e fácil de compreender.",
    "close": "Fechar ajuda",
    "copy": "Copiar YAML",
    "copied": "Copiado",
    "copyFailed": "Não foi possível copiar — selecione o código.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Pré-requisitos",
        "paragraphs": [
          "O Gewitterradar processa os dados de relâmpagos que o Home Assistant recebe da fonte de deteção configurada. Verifique aí a localização de referência correta e defina o raio da fonte pelo menos tão grande como o raio de observação do Gewitterradar. O Gewitterradar não pode mostrar nem avaliar descargas já filtradas pela fonte."
        ],
        "notes": [
          "Se existirem vários detetores ou pontos de observação, as entidades utilizadas devem pertencer claramente ao ponto de referência pretendido."
        ]
      },
      {
        "key": "radii",
        "title": "Os raios",
        "paragraphs": [
          "Os raios são cumulativos: uma descarga dentro do raio de perigo também conta nos raios de tempestade e de observação. São limites de distância, não fontes de dados separadas."
        ],
        "items": [
          "Raio de observação – área exterior para observação antecipada.",
          "Raio de tempestade – área mais próxima que exige maior atenção.",
          "Raio de perigo – proximidade imediata com relevância especialmente elevada."
        ],
        "notes": [
          "O raio de perigo está limitado a um máximo de 250 km. Consulte “Definições básicas recomendadas” para valores iniciais recomendados e para a coordenação necessária com a aplicação Blitzortung."
        ]
      },
      {
        "key": "location",
        "title": "Local & locais guardados",
        "paragraphs": [
          "O local selecionado é o ponto de referência a partir do qual o Gewitterradar calcula distâncias e direções. A biblioteca de locais permanece local no Home Assistant."
        ],
        "entries": [
          [
            "Local",
            "O dashboard V4.07 usa device_tracker.gewitterradar_dashboard na pesquisa mundial. Para que a região de dados em direto também acompanhe a escolha, o Blitzortung tem de seguir este tracker como entidade de localização."
          ],
          [
            "Configurar Blitzortung",
            "Configure o Blitzortung em Definições → Dispositivos e serviços → Blitzortung → Adicionar entrada, escolha “Location entity” e depois “Gewitterradar Dashboard”. Uma entrada antiga com coordenadas fixas não pode ser convertida por reconfiguração; crie uma nova, teste-a e só depois desative a antiga."
          ],
          [
            "Aplicar local",
            "“Aplicar” define o local, fecha a pesquisa e centra o mapa."
          ],
          [
            "Configurar lista de locais guardados",
            "Para guardar, crie uma lista Local to-do com o nome exato “Gewitterradar Orte”."
          ],
          [
            "Locais guardados",
            "★ Guardar armazena permanentemente os locais encontrados de forma local. Eles aparecem em “Locais guardados” e podem ser reutilizados sem nova pesquisa. × não elimina um local imediatamente; marca-o para remoção. Em “Locais removidos”, ↶ restaura-o a qualquer momento, mantendo coordenadas e metadados."
          ]
        ],
        "notes": [
          "Mover apenas o mapa não prova que o Blitzortung já mudou a região de dados em direto. A integração nativa usa device_tracker.gewitterradar em vez do tracker do dashboard."
        ]
      },
      {
        "key": "external_services",
        "title": "Serviços externos e permissões de rede",
        "paragraphs": [
          "O Gewitterradar usa dois caminhos de rede: mapa e pesquisa saem diretamente do browser/Companion App, enquanto os dados Blitzortung são obtidos pela integração no servidor Home Assistant. Firewall, VLAN, proxy, filtro DNS e inspeção TLS devem ser verificados separadamente.",
          "Os destinos abaixo são o inventário atual de execução V4.07. A biblioteca local, o tracker e os serviços Home Assistant não precisam de Internet."
        ],
        "entries": [
          [
            "Cliente · geocodificação Open-Meteo",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · pesquisa mundial principal; envia consulta, idioma e apenas com filtro explícito o código ISO. Em falha, usa Nominatim."
          ],
          [
            "Cliente · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · alternativa; envia consulta, idioma e possível código ISO. Chamadas públicas têm pelo menos um segundo de intervalo e o preenchimento local de países não faz chamadas de rede. Se ambos forem bloqueados, locais guardados continuam disponíveis."
          ],
          [
            "Cliente · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · carrega Leaflet 1.9.4 JavaScript/CSS. Sem Leaflet em cache, bloquear este host impede iniciar o mapa."
          ],
          [
            "Cliente · mosaicos OpenStreetMap",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · mosaicos do mapa base. Se bloqueados, pode haver dados Gewitterradar mas o mapa base fica vazio/incompleto."
          ],
          [
            "Servidor · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · saída do servidor Home Assistant. Blitzortung v1.7.1 usa o broker e tópicos geohash para dados em direto; bloqueio para novos relâmpagos, sem afetar pesquisa/mapa."
          ],
          [
            "Local · sem permissão externa",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, serviço de coordenadas, script do dashboard e lista Local to-do “Gewitterradar Orte” funcionam localmente."
          ],
          [
            "Instalação / atualização",
            "GitHub/HACS são usados para instalação/atualização, não como dependência de execução do mapa aberto."
          ],
          [
            "Diagnóstico rápido",
            "Pesquisa falha: Open-Meteo/Nominatim. Mapa não inicia: unpkg.com. Base vazia: hosts de mosaicos OSM. Relâmpagos ausentes/antigos: blitzortung.ha.sed.pl:1883 e integração Blitzortung."
          ]
        ],
        "notes": [
          "DNS deve funcionar no cliente e no servidor Home Assistant para os destinos respetivos.",
          "Proxy HTTPS, inspeção TLS, filtros, bloqueadores ou extensões podem bloquear pedidos apesar de TCP 443 aberto; na geocodificação verifique também CORS/filtros de resposta.",
          "Privacidade: geocodificação recebe consulta/parâmetros, mosaicos OSM revelam tecnicamente a área vista e o broker Blitzortung recebe os tópicos região/geohash subscritos.",
          "http://www.w3.org/2000/svg é apenas o namespace SVG, não uma chamada de rede externa.",
          "O inventário runtime é protegido automaticamente: um novo URL externo fixo deve falhar o teste até documentação e permissões serem atualizadas."
        ]
      },
      {
        "key": "functions",
        "title": "Funções importantes",
        "entries": [
          [
            "Efeitos de aura",
            "visualizam a atividade de relâmpagos, mas não alteram a deteção nem a contagem."
          ],
          [
            "Animação de aviso",
            "realça visualmente atividade de trovoada relevante."
          ],
          [
            "Agrupamento do mapa",
            "combina marcadores próximos e mantém o mapa legível."
          ],
          [
            "Bússola: descarga mais próxima",
            "orienta a vista para a descarga detetada mais próxima."
          ],
          [
            "Orientação do dispositivo",
            "pode utilizar a orientação em dispositivos móveis compatíveis."
          ],
          [
            "Calibração e diagnóstico",
            "disponibiliza ferramentas para verificação direcionada, medição e diagnóstico da apresentação e de componentes individuais. Inclui, entre outras, calibração da bússola e do medalhão, vistas de diagnóstico e funções de teste como a simulação de tempestade. Estas ferramentas destinam-se à configuração, desenvolvimento e resolução de problemas e devem permanecer desativadas durante o funcionamento normal."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Definições básicas recomendadas",
        "paragraphs": [
          "Para um início estável recomendamos:"
        ],
        "entries": [
          [
            "Valores de teste · 500 km / 120 min / 200",
            "Um raio de deteção de 500 km, uma janela de 120 minutos e 200 relâmpagos são valores de exemplo para testes, não definições obrigatórias. Podem ser ajustados ao uso, ao alcance de observação pretendido e às necessidades pessoais."
          ],
          [
            "Coordenar local & tracker",
            "Configure no Blitzortung as definições correspondentes tanto para o local configurado lá como para o tracker usado pelo Gewitterradar. Assim, a região de dados e a apresentação permanecem coerentes."
          ],
          [
            "Coordenar raios",
            "Defina o raio da fonte Blitzortung pelo menos tão grande como o raio de observação do Gewitterradar."
          ],
          [
            "Manter ativo",
            "Mantenha ativos o agrupamento do mapa e a animação de aviso."
          ],
          [
            "Opcional",
            "Ajuste os efeitos de aura ao gosto pessoal; não afetam a deteção. Ative a orientação do dispositivo apenas quando necessária no dispositivo móvel utilizado."
          ],
          [
            "Funcionamento normal",
            "Mantenha desativadas durante o funcionamento normal as ferramentas em “Calibração e diagnóstico”, especialmente a simulação de tempestade."
          ],
          [
            "Recorder – verificar",
            "Verifique as exclusões do Recorder para dados de relâmpagos e posição atualizados frequentemente. Sem exclusões adequadas, a base de dados do Home Assistant e os backups podem crescer muito rapidamente. Consulte “Home Assistant Recorder” para detalhes e YAML."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Se algo não funcionar",
        "entries": [
          [
            "Nenhuma ou poucas descargas",
            "Verifique o estado da fonte, o raio da fonte e as entidades de relâmpagos usadas."
          ],
          [
            "Distâncias ou direções parecem erradas",
            "Verifique a localização de referência e a unidade de distância."
          ],
          [
            "O backup cresce invulgarmente depressa",
            "A falta de exclusões do Recorder para dados de relâmpagos e posição atualizados frequentemente pode fazer crescer muito rapidamente a base de dados do Home Assistant e, por consequência, os backups. Verifique o Recorder; consulte “Home Assistant Recorder” para detalhes e YAML."
          ],
          [
            "A seleção de idioma reaparece",
            "Verifique se o pacote Gewitterradar atual e o auxiliar de inicialização estão instalados."
          ],
          [
            "Visualização inalterada após atualização",
            "Recarregue totalmente a cache do navegador/aplicação e confirme que o JavaScript atual está a ser usado."
          ],
          [
            "Comportamento estranho ou cartão duplicado",
            "Só pode estar ativo UM recurso de módulo Gewitterradar no Home Assistant. A integração nativa e o recurso Dashboard/HACS não podem registar simultaneamente o mesmo cartão personalizado."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Os dados de relâmpagos podem gerar muitas alterações de estado. Para uma configuração Recorder leve a longo prazo, recomendamos excluir as seguintes entidades e padrões."
        ],
        "recorder": true,
        "notes": [
          "Se já existir uma secção recorder:, integre nela estas entradas. Não crie um segundo bloco recorder: de nível superior.",
          "As exclusões NÃO desativam os estados em direto usados pelo Gewitterradar.",
          "Os dados históricos existentes não são removidos automaticamente.",
          "Os padrões wildcard suportam vários detetores ou pontos de observação, independentemente do prefixo da entidade."
        ]
      }
    ]
  },
  "Svenska": {
    "menuTitle": "Hjälp och anvisningar",
    "title": "Hjälp och anvisningar",
    "subtitle": "En kort guide som gör Gewitterradar tillförlitligt och lätt att förstå.",
    "close": "Stäng hjälpen",
    "copy": "Kopiera YAML",
    "copied": "Kopierat",
    "copyFailed": "Det gick inte att kopiera – markera koden.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Förutsättningar",
        "paragraphs": [
          "Gewitterradar behandlar de blixtdata som Home Assistant tar emot från den konfigurerade detektionskällan. Kontrollera rätt referensplats där och ställ in källradien minst lika stor som observationsradien i Gewitterradar. Gewitterradar kan inte visa eller utvärdera blixtar som redan har filtrerats bort av källan."
        ],
        "notes": [
          "Om flera blixtdetektorer eller observationspunkter finns måste de använda entiteterna tydligt tillhöra önskad referenspunkt."
        ]
      },
      {
        "key": "radii",
        "title": "Radierna",
        "paragraphs": [
          "Radierna är kumulativa: en blixt inom faroradien räknas även inom åsk- och observationsradien. Områdena är avståndsgränser, inte separata datakällor."
        ],
        "items": [
          "Observationsradie – yttre område för tidig observation.",
          "Åskradie – närmare område som kräver ökad uppmärksamhet.",
          "Faroradie – omedelbart närområde med särskilt hög relevans."
        ],
        "notes": [
          "Faroradien är begränsad till högst 250 km. Se “Rekommenderade grundinställningar” för rekommenderade startvärden och nödvändig samordning med Blitzortung-appen."
        ]
      },
      {
        "key": "location",
        "title": "Plats & sparade platser",
        "paragraphs": [
          "Den valda platsen är referenspunkten som Gewitterradar använder för att beräkna avstånd och riktningar. Platsbiblioteket ligger lokalt i Home Assistant."
        ],
        "entries": [
          [
            "Plats",
            "V4.07-dashboarden använder device_tracker.gewitterradar_dashboard för global sökning. För att även live-dataregionen ska följa måste Blitzortung själv följa denna tracker som platsentitet."
          ],
          [
            "Konfigurera Blitzortung",
            "Konfigurera Blitzortung via Inställningar → Enheter och tjänster → Blitzortung → Lägg till post, välj “Location entity” och sedan “Gewitterradar Dashboard”. En äldre post med fasta koordinater kan inte konverteras via omkonfigurering; skapa en ny, testa den och inaktivera den gamla först därefter."
          ],
          [
            "Tillämpa plats",
            "“Tillämpa” tar över platsen, stänger sökningen och centrerar kartan."
          ],
          [
            "Konfigurera lista för sparade platser",
            "Skapa för lagring en Local to-do-lista med exakt namnet “Gewitterradar Orte”."
          ],
          [
            "Sparade platser",
            "★ Spara lagrar hittade platser permanent lokalt. De visas under “Sparade platser” och kan användas igen utan ny sökning. × tar inte bort en plats omedelbart utan markerar den för borttagning. Under “Borttagna platser” återställer ↶ den när som helst; koordinater och metadata bevaras."
          ]
        ],
        "notes": [
          "En kartflytt ensam bevisar inte att Blitzortung redan har bytt live-dataregion. Den inbyggda integrationen använder device_tracker.gewitterradar i stället för dashboardtrackern."
        ]
      },
      {
        "key": "external_services",
        "title": "Externa tjänster & nätverksåtkomst",
        "paragraphs": [
          "Gewitterradar använder två nätverksvägar: karta och sökning går direkt från webbläsare/Companion App, medan Blitzortung-live-data hämtas av Blitzortung-integrationen på Home Assistant-servern. Brandvägg, VLAN, proxy, DNS-filter och TLS-inspektion måste därför kontrolleras separat.",
          "Målen nedan är det aktuella V4.07-runtimeinventariet. Lokalt platsbibliotek, tracker och Home Assistant-tjänster behöver ingen Internetåtkomst."
        ],
        "entries": [
          [
            "Klient · Open-Meteo-geokodning",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · primär global sökning; skickar söktext, språk och endast vid uttryckligt landsfilter ISO-kod. Vid fel används Nominatim."
          ],
          [
            "Klient · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · reserv; skickar söktext, språk och ev. ISO-kod. Publika anrop separeras med minst en sekund och lokal landautofyllnad gör inga nätverksanrop. Om båda blockeras fungerar sparade platser fortfarande lokalt."
          ],
          [
            "Klient · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · laddar Leaflet 1.9.4 JavaScript/CSS. Utan cachead Leaflet kan kartan inte initieras om värden blockeras."
          ],
          [
            "Klient · OpenStreetMap-kartor",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · baskartor. Vid blockering kan data finnas men baskartan blir tom/ofullständig."
          ],
          [
            "Server · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · utgående från Home Assistant-servern. Blitzortung v1.7.1 använder broker/geohash-ämnen för live-blixtar; blockering stoppar nya data men inte sökning/karta."
          ],
          [
            "Lokalt · ingen extern åtkomst",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, koordinattjänst, dashboardskript och Local to-do-listan “Gewitterradar Orte” kör lokalt."
          ],
          [
            "Installation / uppdatering",
            "GitHub/HACS används för installation/uppdatering, inte som runtimeberoende för den öppna kartan."
          ],
          [
            "Snabbdiagnos",
            "Sökning fel: Open-Meteo/Nominatim. Karta startar inte: unpkg.com. Tom baskarta: OSM-kakelvärdar. Saknade/gamla blixtar: blitzortung.ha.sed.pl:1883 och Blitzortung-integrationen."
          ]
        ],
        "notes": [
          "DNS måste fungera på klient och Home Assistant-server för respektive mål.",
          "HTTPS-proxy, TLS-inspektion, filter, blockerare eller tillägg kan stoppa anrop trots öppen TCP 443; kontrollera även CORS/svarsfilter för geokodning.",
          "Integritet: geokodning får söktext/parametrar, OSM-kartor avslöjar tekniskt visat område och Blitzortung-brokern får prenumererade region-/geohash-ämnen.",
          "http://www.w3.org/2000/svg är bara SVG-namnområdet, inte ett externt nätverksanrop.",
          "Runtimeinventariet bevakas automatiskt: ett nytt fast externt URL-mål ska bryta testet tills dokumentation och åtkomstlista uppdaterats."
        ]
      },
      {
        "key": "functions",
        "title": "Viktiga funktioner",
        "entries": [
          [
            "Auraeffekter",
            "visualiserar blixtaktivitet men ändrar inte detektering eller räkning."
          ],
          [
            "Varningsanimation",
            "framhäver relevant åskaktivitet visuellt."
          ],
          [
            "Kartgruppering",
            "samlar närliggande blixtmarkörer och håller kartan tydlig."
          ],
          [
            "Kompass: närmaste blixt",
            "riktar visningen mot den närmaste detekterade blixten."
          ],
          [
            "Enhetsorientering",
            "kan använda orienteringen på mobila enheter som stöds."
          ],
          [
            "Kalibrering och diagnostik",
            "ger verktyg för riktad kontroll, mätning och felsökning av visningen och enskilda komponenter. Det omfattar bland annat kalibrering av kompass och medaljong, diagnosvyer och testfunktioner som åsksimulering. Verktygen är avsedda för konfiguration, utveckling och felsökning och bör vara avstängda under normal drift."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Rekommenderade grundinställningar",
        "paragraphs": [
          "För en stabil start rekommenderar vi:"
        ],
        "entries": [
          [
            "Testvärden · 500 km / 120 min / 200",
            "500 km detekteringsradie, 120 minuters tidsfönster och 200 blixtar är exempelvärden för test, inte obligatoriska inställningar. De kan anpassas efter användning, önskad observationsräckvidd och personliga behov."
          ],
          [
            "Samordna plats & tracker",
            "Samordna inställningarna i Blitzortung för både den plats som är konfigurerad där och trackern som Gewitterradar använder. Då förblir dataregion och visning konsekventa."
          ],
          [
            "Samordna radier",
            "Ställ Blitzortungs källradie minst lika stor som Gewitterradars observationsradie."
          ],
          [
            "Låt vara aktiverat",
            "Låt kartgruppering och varningsanimation vara aktiverade."
          ],
          [
            "Valfritt",
            "Anpassa auraeffekter efter eget önskemål; de påverkar inte detekteringen. Aktivera enhetsorientering endast när den behövs på den mobila enhet som används."
          ],
          [
            "Normal drift",
            "Låt verktygen under “Kalibrering och diagnostik”, särskilt åsksimulering, vara avstängda under normal drift."
          ],
          [
            "Recorder – kontrollera",
            "Kontrollera Recorder-undantag för ofta uppdaterade blixt- och positionsdata. Utan lämpliga undantag kan Home Assistant-databasen och säkerhetskopior växa mycket snabbt. Se “Home Assistant Recorder” för detaljer och YAML."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Om något inte fungerar",
        "entries": [
          [
            "Inga eller för få blixtar",
            "Kontrollera källans status, källradien och de blixtentiteter som används."
          ],
          [
            "Avstånd eller riktningar verkar fel",
            "Kontrollera referensplats och avståndsenhet."
          ],
          [
            "Säkerhetskopian växer ovanligt snabbt",
            "Saknade Recorder-undantag för ofta uppdaterade blixt- och positionsdata kan få Home Assistant-databasen och därmed säkerhetskopior att växa mycket snabbt. Kontrollera Recorder-inställningarna; se “Home Assistant Recorder” för detaljer och YAML."
          ],
          [
            "Språkvalet visas igen",
            "Kontrollera att aktuellt Gewitterradar-paket och initialiseringshjälparen är installerade."
          ],
          [
            "Visningen är oförändrad efter uppdatering",
            "Ladda om webbläsarens/appens cache helt och säkerställ att aktuell JavaScript-fil används."
          ],
          [
            "Oväntat beteende eller dubbelt kort",
            "Endast EN Gewitterradar-modulresurs får vara aktiv i Home Assistant. Den inbyggda integrationen och Dashboard-/HACS-resursen får inte registrera samma anpassade kort samtidigt."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Blixtdata kan skapa väldigt många tillståndsändringar. För en slimmad Recorder-konfiguration över tid rekommenderar vi att följande entiteter och mönster undantas."
        ],
        "recorder": true,
        "notes": [
          "Om en recorder:-sektion redan finns ska posterna läggas till där. Skapa inte ett andra recorder:-block på toppnivå.",
          "Undantagen inaktiverar INTE de live-tillstånd som Gewitterradar använder.",
          "Befintliga historiska data tas inte bort automatiskt.",
          "Jokermönstren stöder flera blixtdetektorer eller observationspunkter oberoende av entitetsprefix."
        ]
      }
    ]
  },
  "Italiano": {
    "menuTitle": "Aiuto e note",
    "title": "Aiuto e note",
    "subtitle": "Una guida concisa per mantenere Gewitterradar affidabile e facile da comprendere.",
    "close": "Chiudi aiuto",
    "copy": "Copia YAML",
    "copied": "Copiato",
    "copyFailed": "Copia non disponibile — seleziona il codice.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Prerequisiti",
        "paragraphs": [
          "Gewitterradar elabora i dati dei fulmini che Home Assistant riceve dalla sorgente di rilevamento configurata. Verifica lì la posizione di riferimento corretta e imposta il raggio della sorgente almeno pari al raggio di osservazione di Gewitterradar. Gewitterradar non può mostrare o valutare scariche già filtrate dalla sorgente."
        ],
        "notes": [
          "Se sono presenti più rilevatori o punti di osservazione, le entità usate devono appartenere chiaramente al punto di riferimento desiderato."
        ]
      },
      {
        "key": "radii",
        "title": "I raggi",
        "paragraphs": [
          "I raggi sono cumulativi: una scarica nel raggio di pericolo conta anche nei raggi di temporale e osservazione. Sono soglie di distanza, non sorgenti dati separate."
        ],
        "items": [
          "Raggio di osservazione – area esterna per l’osservazione anticipata.",
          "Raggio di temporale – area più vicina che richiede maggiore attenzione.",
          "Raggio di pericolo – zona immediata di particolare rilevanza."
        ],
        "notes": [
          "Il raggio di pericolo è limitato a un massimo di 250 km. Consulta “Impostazioni di base consigliate” per i valori iniziali raccomandati e il necessario coordinamento con l’app Blitzortung."
        ]
      },
      {
        "key": "location",
        "title": "Luogo & luoghi salvati",
        "paragraphs": [
          "Il luogo selezionato è il punto di riferimento da cui Gewitterradar calcola distanze e direzioni. La libreria dei luoghi rimane locale in Home Assistant."
        ],
        "entries": [
          [
            "Luogo",
            "Il dashboard V4.07 usa device_tracker.gewitterradar_dashboard per la ricerca mondiale. Per spostare anche la regione dei dati in tempo reale, Blitzortung deve seguire questo tracker come entità di posizione."
          ],
          [
            "Configurare Blitzortung",
            "Configura Blitzortung in Impostazioni → Dispositivi e servizi → Blitzortung → Aggiungi voce, scegli “Location entity” e poi “Gewitterradar Dashboard”. Una vecchia voce con coordinate fisse non può essere convertita tramite riconfigurazione; creane una nuova, provala e solo dopo disattiva la vecchia."
          ],
          [
            "Applicare il luogo",
            "“Applica” imposta il luogo, chiude la ricerca e centra la mappa."
          ],
          [
            "Configurare l’elenco dei luoghi salvati",
            "Per salvare, crea una lista Local to-do chiamata esattamente “Gewitterradar Orte”."
          ],
          [
            "Luoghi salvati",
            "★ Salva memorizza in modo permanente e locale i luoghi trovati. Compaiono in “Luoghi salvati” e possono essere riutilizzati senza una nuova ricerca. × non elimina subito un luogo, ma lo contrassegna per la rimozione. In “Luoghi rimossi”, ↶ lo ripristina in qualsiasi momento mantenendo coordinate e metadati."
          ]
        ],
        "notes": [
          "Spostare solo la mappa non dimostra che Blitzortung abbia già cambiato la regione dei dati live. L’integrazione nativa usa device_tracker.gewitterradar invece del tracker dashboard."
        ]
      },
      {
        "key": "external_services",
        "title": "Servizi esterni e autorizzazioni di rete",
        "paragraphs": [
          "Gewitterradar usa due percorsi di rete: mappa e ricerca partono direttamente dal browser/Companion App, mentre i dati live Blitzortung vengono recuperati dall’integrazione sul server Home Assistant. Firewall, VLAN, proxy, filtro DNS e ispezione TLS vanno quindi verificati separatamente.",
          "Le destinazioni seguenti sono l’inventario runtime V4.07 attuale. Libreria locale, tracker e servizi Home Assistant non richiedono Internet."
        ],
        "entries": [
          [
            "Client · geocodifica Open-Meteo",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · ricerca globale primaria; invia query, lingua e solo con filtro paese esplicito il codice ISO. In caso di errore usa Nominatim."
          ],
          [
            "Client · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · fallback; invia query, lingua ed eventuale codice ISO. Le chiamate pubbliche sono distanziate di almeno un secondo e il completamento locale dei paesi non effettua chiamate di rete. Se entrambi sono bloccati, i luoghi salvati restano disponibili."
          ],
          [
            "Client · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · carica Leaflet 1.9.4 JavaScript/CSS. Senza Leaflet in cache, bloccare l’host impedisce l’avvio della mappa."
          ],
          [
            "Client · tile OpenStreetMap",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · tile di base. Se bloccate, i dati possono esserci ma la mappa base resta vuota/incompleta."
          ],
          [
            "Server · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · uscita dal server Home Assistant. Blitzortung v1.7.1 usa broker e topic geohash per i fulmini live; il blocco ferma nuovi dati ma non ricerca/mappa."
          ],
          [
            "Locale · nessuna autorizzazione esterna",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, servizio coordinate, script dashboard e lista Local to-do “Gewitterradar Orte” funzionano localmente."
          ],
          [
            "Installazione / aggiornamento",
            "GitHub/HACS servono per installazione/aggiornamento, non sono dipendenze runtime della mappa aperta."
          ],
          [
            "Diagnosi rapida",
            "Ricerca non funziona: Open-Meteo/Nominatim. Mappa non parte: unpkg.com. Base vuota: host tile OSM. Fulmini assenti/vecchi: blitzortung.ha.sed.pl:1883 e integrazione Blitzortung."
          ]
        ],
        "notes": [
          "Il DNS deve funzionare su client e server Home Assistant per le rispettive destinazioni.",
          "Proxy HTTPS, ispezione TLS, filtri, blocchi o estensioni possono impedire richieste nonostante TCP 443 aperta; per la geocodifica verificare anche CORS/filtri di risposta.",
          "Privacy: la geocodifica riceve query/parametri, le tile OSM rivelano tecnicamente l’area visualizzata e il broker Blitzortung riceve i topic regione/geohash sottoscritti.",
          "http://www.w3.org/2000/svg è solo lo spazio dei nomi SVG, non una chiamata di rete esterna.",
          "L’inventario runtime è protetto automaticamente: una nuova URL esterna fissa deve far fallire il test finché documentazione e permessi non vengono aggiornati."
        ]
      },
      {
        "key": "functions",
        "title": "Funzioni importanti",
        "entries": [
          [
            "Effetti aura",
            "visualizzano l’attività dei fulmini ma non modificano rilevamento o conteggio."
          ],
          [
            "Animazione di avviso",
            "evidenzia visivamente l’attività temporalesca rilevante."
          ],
          [
            "Raggruppamento mappa",
            "unisce i marcatori vicini e mantiene ordinata la mappa."
          ],
          [
            "Bussola: fulmine più vicino",
            "orienta la vista verso la scarica rilevata più vicina."
          ],
          [
            "Orientamento dispositivo",
            "può utilizzare l’orientamento sui dispositivi mobili supportati."
          ],
          [
            "Calibrazione e diagnostica",
            "fornisce strumenti per controlli mirati, misurazioni e diagnostica della visualizzazione e dei singoli componenti. Comprende, tra l’altro, calibrazione della bussola e del medaglione, viste diagnostiche e funzioni di test come la simulazione di temporale. Questi strumenti sono destinati alla configurazione, allo sviluppo e alla risoluzione dei problemi e devono restare disattivati durante il normale funzionamento."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Impostazioni di base consigliate",
        "paragraphs": [
          "Per un avvio stabile consigliamo:"
        ],
        "entries": [
          [
            "Valori di prova · 500 km / 120 min / 200",
            "Un raggio di rilevamento di 500 km, una finestra di 120 minuti e 200 fulmini sono valori di esempio per i test, non impostazioni obbligatorie. Possono essere adattati all’uso, alla portata di osservazione desiderata e alle esigenze personali."
          ],
          [
            "Coordinare luogo & tracker",
            "Configura in Blitzortung le impostazioni corrispondenti sia per il luogo configurato lì sia per il tracker usato da Gewitterradar. In questo modo regione dati e visualizzazione restano coerenti."
          ],
          [
            "Coordinare i raggi",
            "Imposta il raggio della sorgente Blitzortung almeno quanto il raggio di osservazione di Gewitterradar."
          ],
          [
            "Lasciare attivo",
            "Lascia attivi il raggruppamento della mappa e l’animazione di avviso."
          ],
          [
            "Opzionale",
            "Regola gli effetti aura secondo le preferenze; non influenzano il rilevamento. Attiva l’orientamento del dispositivo solo quando serve sul dispositivo mobile utilizzato."
          ],
          [
            "Funzionamento normale",
            "Lascia disattivati durante il normale funzionamento gli strumenti di “Calibrazione e diagnostica”, in particolare la simulazione di temporale."
          ],
          [
            "Recorder – controllare",
            "Controlla le esclusioni del Recorder per i dati di fulmini e posizione aggiornati di frequente. Senza esclusioni adeguate, il database di Home Assistant e i backup possono crescere molto rapidamente. Vedi “Home Assistant Recorder” per dettagli e YAML."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Se qualcosa non funziona",
        "entries": [
          [
            "Nessun fulmine o troppo pochi",
            "Controlla stato della sorgente, raggio sorgente ed entità fulmine usate."
          ],
          [
            "Distanze o direzioni errate",
            "Controlla posizione di riferimento e unità di distanza."
          ],
          [
            "Il backup cresce insolitamente in fretta",
            "La mancanza di esclusioni del Recorder per dati di fulmini e posizione aggiornati di frequente può far crescere molto rapidamente il database di Home Assistant e quindi anche i backup. Controlla il Recorder; vedi “Home Assistant Recorder” per dettagli e YAML."
          ],
          [
            "La selezione lingua ricompare",
            "Verifica che siano installati il package Gewitterradar corrente e l’helper di inizializzazione."
          ],
          [
            "Aspetto invariato dopo l’aggiornamento",
            "Ricarica completamente la cache del browser/app e verifica che venga usato il JavaScript corrente."
          ],
          [
            "Comportamento anomalo o scheda doppia",
            "In Home Assistant può essere attiva una sola risorsa modulo Gewitterradar. L’integrazione nativa e la risorsa Dashboard/HACS non devono registrare contemporaneamente la stessa custom card."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "I dati dei fulmini possono generare moltissimi cambiamenti di stato. Per una configurazione Recorder snella nel tempo consigliamo di escludere le seguenti entità e i relativi modelli."
        ],
        "recorder": true,
        "notes": [
          "Se esiste già una sezione recorder:, integra lì queste voci. Non creare un secondo blocco recorder: di primo livello.",
          "Le esclusioni NON disattivano gli stati live usati da Gewitterradar.",
          "I dati storici esistenti non vengono rimossi automaticamente.",
          "I modelli wildcard supportano più rilevatori o punti di osservazione indipendentemente dal prefisso delle entità."
        ]
      }
    ]
  },
  "Norsk bokmål": {
    "menuTitle": "Hjelp og merknader",
    "title": "Hjelp og merknader",
    "subtitle": "En kort veiledning som holder Gewitterradar pålitelig og lett å forstå.",
    "close": "Lukk hjelp",
    "copy": "Kopier YAML",
    "copied": "Kopiert",
    "copyFailed": "Kopiering er ikke tilgjengelig – marker koden.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Forutsetninger",
        "paragraphs": [
          "Gewitterradar behandler lyndataene som Home Assistant mottar fra den konfigurerte lyndeteksjonskilden. Kontroller riktig referansested der, og sett kilderadius minst like stor som observasjonsradiusen i Gewitterradar. Gewitterradar kan ikke vise eller vurdere lynnedslag som allerede er filtrert bort av kilden."
        ],
        "notes": [
          "Hvis flere lyndetektorer eller observasjonspunkter finnes, må entitetene som brukes tydelig tilhøre ønsket referansepunkt."
        ]
      },
      {
        "key": "radii",
        "title": "Radiene",
        "paragraphs": [
          "Radiene er kumulative: Et lynnedslag innenfor fareradiusen teller også innenfor torden- og observasjonsradiusen. Områdene er avstandsgrenser, ikke separate datakilder."
        ],
        "items": [
          "Observasjonsradius – ytre område for tidlig observasjon.",
          "Tordenradius – nærmere område som krever økt oppmerksomhet.",
          "Fareradius – umiddelbar nærhet med særlig høy relevans."
        ],
        "notes": [
          "Fareradiusen er begrenset til maksimalt 250 km. Se “Anbefalte grunninnstillinger” for anbefalte startverdier og nødvendig samordning med Blitzortung-appen."
        ]
      },
      {
        "key": "location",
        "title": "Sted & lagrede steder",
        "paragraphs": [
          "Det valgte stedet er referansepunktet som Gewitterradar bruker til å beregne avstander og retninger. Stedsbiblioteket ligger lokalt i Home Assistant."
        ],
        "entries": [
          [
            "Sted",
            "V4.07-dashboardet bruker device_tracker.gewitterradar_dashboard for globalt stedsøk. For at live-dataregionen også skal følge, må Blitzortung selv følge denne trackeren som stedsentitet."
          ],
          [
            "Konfigurer Blitzortung",
            "Konfigurer Blitzortung via Innstillinger → Enheter og tjenester → Blitzortung → Legg til oppføring, velg “Location entity” og deretter “Gewitterradar Dashboard”. En eldre oppføring med faste koordinater kan ikke konverteres via omkonfigurering; opprett en ny, test den og deaktiver den gamle først etterpå."
          ],
          [
            "Angi sted",
            "“Angi” setter stedet, lukker søket og sentrerer kartet."
          ],
          [
            "Konfigurer liste for lagrede steder",
            "For lagring oppretter du en Local to-do-liste med nøyaktig navnet “Gewitterradar Orte”."
          ],
          [
            "Lagrede steder",
            "★ Lagre lagrer funne steder permanent lokalt. De vises under “Lagrede steder” og kan brukes igjen uten et nytt søk. × sletter ikke et sted med en gang, men markerer det for fjerning. Under “Fjernede steder” gjenoppretter ↶ det når som helst; koordinater og metadata beholdes."
          ]
        ],
        "notes": [
          "Å flytte kartet alene beviser ikke at Blitzortung allerede har byttet live-dataregion. Den native integrasjonen bruker device_tracker.gewitterradar i stedet for dashboardtrackeren."
        ]
      },
      {
        "key": "external_services",
        "title": "Eksterne tjenester og nettverkstilgang",
        "paragraphs": [
          "Gewitterradar bruker to nettverksveier: kart og søk går direkte fra nettleser/Companion App, mens Blitzortung-live-data hentes av Blitzortung-integrasjonen på Home Assistant-serveren. Brannmur, VLAN, proxy, DNS-filter og TLS-inspeksjon må derfor kontrolleres separat.",
          "Målene nedenfor er dagens V4.07-runtimeinventar. Lokalt stedsbibliotek, tracker og Home Assistant-tjenester trenger ikke Internett."
        ],
        "entries": [
          [
            "Klient · Open-Meteo-geokoding",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · primært globalt søk; sender søketekst, språk og kun ved eksplisitt landfilter ISO-kode. Ved feil brukes Nominatim."
          ],
          [
            "Klient · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · reserve; sender søketekst, språk og eventuell ISO-kode. Offentlige kall har minst ett sekund mellomrom, og lokal landautofullføring gjør ingen nettverkskall. Hvis begge blokkeres, virker lagrede steder fortsatt lokalt."
          ],
          [
            "Klient · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · laster Leaflet 1.9.4 JavaScript/CSS. Uten cachet Leaflet kan kartet ikke starte hvis verten blokkeres."
          ],
          [
            "Klient · OpenStreetMap-fliser",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · grunnkartfliser. Ved blokkering kan data finnes, men grunnkartet blir tomt/ufullstendig."
          ],
          [
            "Server · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · utgående fra Home Assistant-serveren. Blitzortung v1.7.1 bruker broker/geohash-emner for live-lyn; blokkering stopper nye data men ikke søk/kart."
          ],
          [
            "Lokalt · ingen ekstern tilgang",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, koordinattjeneste, dashboardskript og Local to-do-listen “Gewitterradar Orte” kjører lokalt."
          ],
          [
            "Installasjon / oppdatering",
            "GitHub/HACS brukes til installasjon/oppdatering, ikke som runtimeavhengighet for det åpne kartet."
          ],
          [
            "Hurtigdiagnose",
            "Søk feiler: Open-Meteo/Nominatim. Kart starter ikke: unpkg.com. Tomt grunnkart: OSM-flisverter. Manglende/gamle lyn: blitzortung.ha.sed.pl:1883 og Blitzortung-integrasjonen."
          ]
        ],
        "notes": [
          "DNS må fungere på klient og Home Assistant-server for respektive mål.",
          "HTTPS-proxy, TLS-inspeksjon, filtre, blokkere eller utvidelser kan stoppe forespørsler selv med TCP 443 åpen; for geokoding må også CORS/svarfiltre sjekkes.",
          "Personvern: geokoding mottar søketekst/parametere, OSM-fliser avslører teknisk vist kartområde, og Blitzortung-brokeren mottar abonnerte region-/geohash-emner.",
          "http://www.w3.org/2000/svg er bare SVG-navnerommet, ikke et eksternt nettverkskall.",
          "Runtimeinventaret er automatisk sikret: et nytt fast eksternt URL-mål skal feile testen til dokumentasjon og tillatelser er oppdatert."
        ]
      },
      {
        "key": "functions",
        "title": "Viktige funksjoner",
        "entries": [
          [
            "Auraeffekter",
            "visualiserer lynaktivitet, men endrer ikke deteksjon eller telling."
          ],
          [
            "Varselanimasjon",
            "fremhever relevant tordenværaktivitet visuelt."
          ],
          [
            "Kartgruppering",
            "samler nærliggende markører og holder kartet oversiktlig."
          ],
          [
            "Kompass: nærmeste lyn",
            "retter visningen mot nærmeste registrerte lynnedslag."
          ],
          [
            "Enhetsretning",
            "kan bruke retningen på støttede mobilenheter."
          ],
          [
            "Kalibrering og diagnostikk",
            "gir verktøy for målrettet kontroll, måling og feilsøking av visningen og enkeltkomponenter. Dette omfatter blant annet kalibrering av kompass og medaljong, diagnosevisninger og testfunksjoner som tordenværsimulering. Verktøyene er beregnet for oppsett, utvikling og feilsøking og bør være deaktivert under normal drift."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Anbefalte grunninnstillinger",
        "paragraphs": [
          "For en stabil start anbefaler vi:"
        ],
        "entries": [
          [
            "Testverdier · 500 km / 120 min / 200",
            "500 km registreringsradius, 120 minutters tidsvindu og 200 lyn er eksempelverdier for test, ikke obligatoriske innstillinger. De kan tilpasses bruksområde, ønsket observasjonsrekkevidde og personlige behov."
          ],
          [
            "Samordne sted & tracker",
            "Samordne innstillingene i Blitzortung for både stedet som er konfigurert der og trackeren Gewitterradar bruker. Da forblir dataregion og visning konsistente."
          ],
          [
            "Samordne radier",
            "Sett Blitzortungs kilderadius minst like stor som Gewitterradars observasjonsradius."
          ],
          [
            "La være aktivert",
            "La kartgruppering og varslingsanimasjon være aktivert."
          ],
          [
            "Valgfritt",
            "Juster auraeffekter etter eget ønske; de påvirker ikke registreringen. Aktiver enhetsretning bare når det trengs på mobilenheten som brukes."
          ],
          [
            "Normal drift",
            "La verktøyene under “Kalibrering og diagnostikk”, spesielt tordenværsimulering, være deaktivert under normal drift."
          ],
          [
            "Recorder – kontroller",
            "Kontroller Recorder-unntak for ofte oppdaterte lyn- og posisjonsdata. Uten egnede unntak kan Home Assistant-databasen og sikkerhetskopier vokse svært raskt. Se “Home Assistant Recorder” for detaljer og YAML."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Hvis noe ikke fungerer",
        "entries": [
          [
            "Ingen eller for få lynnedslag",
            "Kontroller kildestatus, kilderadius og lynentitetene som brukes."
          ],
          [
            "Avstander eller retninger virker feil",
            "Kontroller referansested og avstandsenhet."
          ],
          [
            "Sikkerhetskopien vokser uvanlig raskt",
            "Manglende Recorder-unntak for ofte oppdaterte lyn- og posisjonsdata kan få Home Assistant-databasen og dermed sikkerhetskopier til å vokse svært raskt. Kontroller Recorder-innstillingene; se “Home Assistant Recorder” for detaljer og YAML."
          ],
          [
            "Språkvalget kommer stadig tilbake",
            "Kontroller at gjeldende Gewitterradar-pakke og initialiseringshjelper er installert."
          ],
          [
            "Visningen er uendret etter oppdatering",
            "Last nettleser-/appbufferen helt på nytt og kontroller at gjeldende JavaScript-fil brukes."
          ],
          [
            "Uventet oppførsel eller dobbelt kort",
            "Bare ÉN Gewitterradar-modulressurs kan være aktiv i Home Assistant. Den native integrasjonen og Dashboard-/HACS-ressursen må ikke registrere samme egendefinerte kort samtidig."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Lyndata kan skape svært mange tilstandsendringer. For en slank Recorder-konfigurasjon over tid anbefaler vi å utelate følgende entiteter og mønstre."
        ],
        "recorder": true,
        "notes": [
          "Hvis en recorder:-seksjon allerede finnes, legg oppføringene til der. Ikke opprett en ny recorder:-blokk på toppnivå.",
          "Unntakene deaktiverer IKKE live-tilstandene som Gewitterradar bruker.",
          "Eksisterende historiske data fjernes ikke automatisk.",
          "Jokermønstrene støtter flere lyndetektorer eller observasjonspunkter uavhengig av entitetsprefiks."
        ]
      }
    ]
  },
  "Suomi": {
    "menuTitle": "Ohje ja huomautukset",
    "title": "Ohje ja huomautukset",
    "subtitle": "Tiivis opas Gewitterradarin luotettavaan ja ymmärrettävään käyttöön.",
    "close": "Sulje ohje",
    "copy": "Kopioi YAML",
    "copied": "Kopioitu",
    "copyFailed": "Kopiointi ei onnistu – valitse koodi.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Edellytykset",
        "paragraphs": [
          "Gewitterradar käsittelee salamadataa, jonka Home Assistant saa määritetystä salamapaikannuslähteestä. Tarkista lähteessä oikea viitesijainti ja aseta lähteen säde vähintään Gewitterradarin havaintosäteen suuruiseksi. Gewitterradar ei voi näyttää tai arvioida salamoita, jotka lähde on jo suodattanut pois."
        ],
        "notes": [
          "Jos käytössä on useita paikantimia tai havaintopisteitä, käytettyjen entiteettien on kuuluttava yksiselitteisesti haluttuun viitepisteeseen."
        ]
      },
      {
        "key": "radii",
        "title": "Säteet",
        "paragraphs": [
          "Säteet ovat kumulatiivisia: vaarasäteen sisällä oleva salama lasketaan myös ukkos- ja havaintosäteeseen. Alueet ovat etäisyysrajoja, eivät erillisiä tietolähteitä."
        ],
        "items": [
          "Havaintosäde – ulompi alue varhaiseen havainnointiin.",
          "Ukkossäde – lähempi alue, joka vaatii enemmän huomiota.",
          "Vaarasäde – välitön lähialue, jolla on erityisen suuri merkitys."
        ],
        "notes": [
          "Vaarasäde on rajoitettu enintään 250 kilometriin. Katso “Suositellut perusasetukset” suositelluista lähtöarvoista ja tarvittavasta yhteensovituksesta Blitzortung-sovelluksen kanssa."
        ]
      },
      {
        "key": "location",
        "title": "Sijainti & tallennetut paikat",
        "paragraphs": [
          "Valittu paikka on viitepiste, josta Gewitterradar laskee etäisyydet ja suunnat. Paikkakirjasto pysyy paikallisena Home Assistantissa."
        ],
        "entries": [
          [
            "Sijainti",
            "V4.07-kojelauta käyttää maailmanlaajuisessa haussa device_tracker.gewitterradar_dashboard -trackeria. Jotta myös live-data-alue seuraa valintaa, Blitzortungin on seurattava tätä trackeria sijaintientiteettinä."
          ],
          [
            "Määritä Blitzortung",
            "Määritä Blitzortung: Asetukset → Laitteet ja palvelut → Blitzortung → Lisää merkintä, valitse “Location entity” ja sitten “Gewitterradar Dashboard”. Vanhaa kiinteillä koordinaateilla luotua merkintää ei voi muuntaa uudelleenmäärityksellä; luo uusi, testaa se ja poista vanha käytöstä vasta sen jälkeen."
          ],
          [
            "Aseta sijainti",
            "“Aseta” asettaa paikan, sulkee haun ja keskittää kartan."
          ],
          [
            "Määritä tallennettujen paikkojen luettelo",
            "Tallennusta varten luo Local to-do -luettelo nimeltä täsmälleen “Gewitterradar Orte”."
          ],
          [
            "Tallennetut paikat",
            "★ Tallenna säilyttää löydetyt paikat pysyvästi paikallisesti. Ne näkyvät kohdassa “Tallennetut paikat” ja niitä voi käyttää uudelleen ilman uutta hakua. × ei poista paikkaa heti, vaan merkitsee sen poistettavaksi. Kohdassa “Poistetut paikat” ↶ palauttaa sen milloin tahansa säilyttäen koordinaatit ja metatiedot."
          ]
        ],
        "notes": [
          "Pelkkä kartan siirto ei osoita, että Blitzortung olisi jo vaihtanut live-data-aluetta. Natiivi integraatio käyttää device_tracker.gewitterradar -trackeria kojelautatrackerin sijaan."
        ]
      },
      {
        "key": "external_services",
        "title": "Ulkoiset palvelut ja verkkoluvat",
        "paragraphs": [
          "Gewitterradar käyttää kahta verkkoreittiä: kartta ja paikkahaku lähtevät suoraan selaimesta/Companion Appista, kun taas Blitzortung-live-data haetaan Home Assistant -palvelimen Blitzortung-integraatiolla. Palomuuri, VLAN, välityspalvelin, DNS-suodatus ja TLS-tarkastus on siis tarkistettava erikseen.",
          "Alla ovat nykyisen V4.07-ajon ulkoiset kohteet. Paikallinen paikkakirjasto, tracker ja Home Assistant -palvelut eivät tarvitse Internet-yhteyttä."
        ],
        "entries": [
          [
            "Asiakas · Open-Meteo-geokoodaus",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · ensisijainen maailmanlaajuinen haku; lähettää hakutekstin, kielen ja vain erikseen valitulla maasuodattimella ISO-koodin. Virheessä käytetään Nominatimia."
          ],
          [
            "Asiakas · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · varapalvelu; lähettää hakutekstin, kielen ja mahdollisen ISO-koodin. Julkisten kutsujen väli on vähintään sekunti eikä paikallinen maiden automaattitäydennys käytä verkkoa. Jos molemmat estetään, tallennetut paikat toimivat paikallisesti."
          ],
          [
            "Asiakas · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · lataa Leaflet 1.9.4 JavaScript/CSS. Ilman välimuistissa olevaa Leafletiä kartta ei käynnisty, jos isäntä estetään."
          ],
          [
            "Asiakas · OpenStreetMap-karttatiilet",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · taustakarttatiilet. Estossa dataa voi olla, mutta taustakartta jää tyhjäksi/vajaaksi."
          ],
          [
            "Palvelin · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · ulospäin Home Assistant -palvelimelta. Blitzortung v1.7.1 käyttää brokeria/geohash-aiheita live-salamoihin; esto pysäyttää uudet tiedot mutta ei hakua/karttaa."
          ],
          [
            "Paikallinen · ei ulkoista lupaa",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, koordinaattipalvelu, kojelautaskripti ja Local to-do -lista “Gewitterradar Orte” toimivat paikallisesti."
          ],
          [
            "Asennus / päivitys",
            "GitHub/HACS ovat asennusta/päivitystä varten, eivät avoimen kartan ajonaikaisia riippuvuuksia."
          ],
          [
            "Pikadiagnoosi",
            "Haku rikki: Open-Meteo/Nominatim. Kartta ei käynnisty: unpkg.com. Tyhjä taustakartta: OSM-tiilipalvelimet. Puuttuvat/vanhat salamat: blitzortung.ha.sed.pl:1883 ja Blitzortung-integraatio."
          ]
        ],
        "notes": [
          "DNS:n on toimittava sekä asiakkaalla että Home Assistant -palvelimella niiden tarvitsemiin kohteisiin.",
          "HTTPS-välityspalvelin, TLS-tarkastus, suodattimet, estot tai selainlaajennukset voivat estää pyynnöt vaikka TCP 443 on avoin; geokoodauksessa tarkista myös CORS/vastaussuodatus.",
          "Tietosuoja: geokoodaus saa hakutekstin/parametrit, OSM-tiilet paljastavat teknisesti katsotun kartta-alueen ja Blitzortung-broker saa tilatut alue-/geohash-aiheet.",
          "http://www.w3.org/2000/svg on vain SVG-nimiavaruus, ei ulkoinen verkkokutsu.",
          "Ajonaikainen inventaario on automaattisesti suojattu: uuden kiinteän ulkoisen URL-kohteen pitää rikkoa testi, kunnes dokumentaatio ja luvat päivitetään."
        ]
      },
      {
        "key": "functions",
        "title": "Tärkeät toiminnot",
        "entries": [
          [
            "Aura-tehosteet",
            "havainnollistavat salamatoimintaa mutta eivät muuta tunnistusta tai laskentaa."
          ],
          [
            "Varoitusanimaatio",
            "korostaa olennaista ukkostoimintaa visuaalisesti."
          ],
          [
            "Karttaryhmittely",
            "yhdistää läheiset salamamerkit ja pitää kartan selkeänä."
          ],
          [
            "Kompassi: lähin salama",
            "suuntaa näytön lähimpään havaittuun salamaan."
          ],
          [
            "Laitteen suunta",
            "voi käyttää tuettujen mobiililaitteiden suuntausta."
          ],
          [
            "Kalibrointi ja diagnostiikka",
            "tarjoaa työkaluja näkymän ja yksittäisten osien kohdennettuun tarkistukseen, mittaukseen ja vianmääritykseen. Näihin kuuluvat muun muassa kompassin ja medaljongin kalibrointi, diagnostiikkanäkymät sekä testitoiminnot kuten ukkossimulointi. Työkalut on tarkoitettu käyttöönottoon, kehitykseen ja vianmääritykseen, ja niiden tulee olla pois käytöstä normaalissa käytössä."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Suositellut perusasetukset",
        "paragraphs": [
          "Vakaaseen aloitukseen suosittelemme:"
        ],
        "entries": [
          [
            "Testiarvot · 500 km / 120 min / 200",
            "500 km havaintosäde, 120 minuutin aikaikkuna ja 200 salamaa ovat esimerkkitestiarvoja, eivät pakollisia asetuksia. Niitä voi mukauttaa käyttötarkoituksen, halutun havaintoetäisyyden ja omien tarpeiden mukaan."
          ],
          [
            "Yhteensovita sijainti & tracker",
            "Yhteensovita Blitzortungin asetukset sekä siellä määritetyn sijainnin että Gewitterradarin käyttämän trackerin kanssa. Näin data-alue ja näyttö pysyvät yhdenmukaisina."
          ],
          [
            "Yhteensovita säteet",
            "Aseta Blitzortungin lähdesäde vähintään yhtä suureksi kuin Gewitterradarin havaintosäde."
          ],
          [
            "Pidä käytössä",
            "Pidä karttaryhmittely ja varoitusanimaatio käytössä."
          ],
          [
            "Valinnainen",
            "Säädä auraefektit mieltymyksen mukaan; ne eivät vaikuta havaitsemiseen. Ota laitteen suunta käyttöön vain, jos sitä tarvitaan käytetyllä mobiililaitteella."
          ],
          [
            "Normaali käyttö",
            "Pidä “Kalibrointi ja diagnostiikka” -kohdan työkalut, erityisesti ukkossimulointi, pois käytöstä normaalissa käytössä."
          ],
          [
            "Recorder – tarkista",
            "Tarkista Recorder-poissulut usein päivittyville salama- ja sijaintitiedoille. Ilman sopivia poissulkuja Home Assistant -tietokanta ja varmuuskopiot voivat kasvaa hyvin nopeasti. Katso lisätiedot ja YAML kohdasta “Home Assistant Recorder”."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Jos jokin ei toimi",
        "entries": [
          [
            "Salamoita ei näy tai niitä on liian vähän",
            "Tarkista lähteen tila, lähdesäde ja käytetyt salamaentiteetit."
          ],
          [
            "Etäisyydet tai suunnat näyttävät vääriltä",
            "Tarkista viitesijainti ja etäisyysyksikkö."
          ],
          [
            "Varmuuskopio kasvaa poikkeuksellisen nopeasti",
            "Puuttuvat Recorder-poissulut usein päivittyville salama- ja sijaintitiedoille voivat kasvattaa Home Assistant -tietokantaa ja siten varmuuskopioita hyvin nopeasti. Tarkista Recorder-asetukset; katso lisätiedot ja YAML kohdasta “Home Assistant Recorder”."
          ],
          [
            "Kielivalinta palaa jatkuvasti",
            "Tarkista, että nykyinen Gewitterradar-paketti ja alustuksen apuentiteetti on asennettu."
          ],
          [
            "Näkymä ei muutu päivityksen jälkeen",
            "Lataa selaimen tai sovelluksen välimuisti kokonaan uudelleen ja varmista nykyisen JavaScript-tiedoston käyttö."
          ],
          [
            "Outo toiminta tai kaksinkertainen kortti",
            "Home Assistantissa saa olla aktiivisena vain YKSI Gewitterradar-moduuliresurssi. Natiivi integraatio ja Dashboard-/HACS-resurssi eivät saa rekisteröidä samaa mukautettua korttia yhtä aikaa."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Salamadata voi synnyttää erittäin paljon tilamuutoksia. Pitkällä aikavälillä kevyttä Recorder-määritystä varten suosittelemme seuraavien entiteettien ja mallien poissulkemista."
        ],
        "recorder": true,
        "notes": [
          "Jos recorder:-osio on jo olemassa, yhdistä nämä rivit siihen. Älä luo toista ylätason recorder:-lohkoa.",
          "Poissulkemiset EIVÄT poista Gewitterradarin käyttämiä reaaliaikaisia tiloja käytöstä.",
          "Olemassa olevia historiatietoja ei poisteta automaattisesti.",
          "Jokerimerkkimallit tukevat useita paikantimia tai havaintopisteitä entiteetin etuliitteestä riippumatta."
        ]
      }
    ]
  },
  "Čeština": {
    "menuTitle": "Nápověda a poznámky",
    "title": "Nápověda a poznámky",
    "subtitle": "Stručný průvodce pro spolehlivý a srozumitelný provoz Gewitterradaru.",
    "close": "Zavřít nápovědu",
    "copy": "Kopírovat YAML",
    "copied": "Zkopírováno",
    "copyFailed": "Kopírování není dostupné – označte kód.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Předpoklady",
        "paragraphs": [
          "Gewitterradar zpracovává data o blescích, která Home Assistant přijímá z nastaveného zdroje detekce. Zkontrolujte v něm správnou referenční polohu a nastavte poloměr zdroje alespoň stejně velký jako pozorovací poloměr v Gewitterradaru. Gewitterradar nemůže zobrazit ani vyhodnotit výboje, které zdroj již odfiltroval."
        ],
        "notes": [
          "Pokud existuje více detektorů nebo pozorovacích bodů, musí použité entity jednoznačně patřit k požadovanému referenčnímu bodu."
        ]
      },
      {
        "key": "radii",
        "title": "Poloměry",
        "paragraphs": [
          "Poloměry se překrývají: výboj v nebezpečném poloměru se počítá také do bouřkového a pozorovacího poloměru. Jde o prahové vzdálenosti, nikoli oddělené zdroje dat."
        ],
        "items": [
          "Pozorovací poloměr – vnější oblast pro včasné pozorování.",
          "Bouřkový poloměr – bližší oblast vyžadující zvýšenou pozornost.",
          "Nebezpečný poloměr – bezprostřední okolí s mimořádnou důležitostí."
        ],
        "notes": [
          "Poloměr nebezpečí je omezen na maximálně 250 km. Doporučené výchozí hodnoty a nutné sladění s aplikací Blitzortung najdete v části „Doporučená základní nastavení“."
        ]
      },
      {
        "key": "location",
        "title": "Poloha & uložená místa",
        "paragraphs": [
          "Vybrané místo je referenční bod, od kterého Gewitterradar počítá vzdálenosti a směry. Knihovna míst zůstává lokálně v Home Assistant."
        ],
        "entries": [
          [
            "Poloha",
            "Dashboard V4.07 používá pro celosvětové hledání device_tracker.gewitterradar_dashboard. Aby se měnila i oblast živých dat, musí Blitzortung tento tracker sledovat jako entitu polohy."
          ],
          [
            "Nastavit Blitzortung",
            "Nastavte Blitzortung přes Nastavení → Zařízení a služby → Blitzortung → Přidat záznam, zvolte “Location entity” a potom “Gewitterradar Dashboard”. Starý záznam s pevnými souřadnicemi nelze převést přenastavením; vytvořte nový, otestujte jej a teprve potom starý vypněte."
          ],
          [
            "Nastavit polohu",
            "“Nastavit” nastaví místo, zavře hledání a vycentruje mapu."
          ],
          [
            "Nastavit seznam uložených míst",
            "Pro ukládání vytvořte seznam Local to-do přesně s názvem “Gewitterradar Orte”."
          ],
          [
            "Uložená místa",
            "★ Uložit trvale ukládá nalezená místa lokálně. Zobrazují se v „Uložených místech“ a lze je znovu použít bez dalšího hledání. × místo neodstraní okamžitě, ale označí ho k odstranění. V „Odebraných místech“ jej ↶ kdykoli obnoví; souřadnice a metadata zůstanou zachovány."
          ]
        ],
        "notes": [
          "Pouhé přesunutí mapy nedokazuje, že Blitzortung již změnil oblast živých dat. Nativní integrace používá device_tracker.gewitterradar místo trackeru dashboardu."
        ]
      },
      {
        "key": "external_services",
        "title": "Externí služby a síťová povolení",
        "paragraphs": [
          "Gewitterradar používá dvě síťové cesty: mapa a hledání jdou přímo z prohlížeče/Companion App, zatímco živá data Blitzortung získává integrace na serveru Home Assistant. Firewall, VLAN, proxy, DNS filtr a TLS inspekci je proto nutné ověřit odděleně.",
          "Níže jsou aktuální externí cíle běhu V4.07. Místní knihovna, tracker a služby Home Assistant nepotřebují Internet."
        ],
        "entries": [
          [
            "Klient · geokódování Open-Meteo",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · hlavní celosvětové hledání; posílá dotaz, jazyk a pouze při výslovném filtru země ISO kód. Při chybě se použije Nominatim."
          ],
          [
            "Klient · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · záloha; posílá dotaz, jazyk a případný ISO kód. Veřejná volání mají rozestup alespoň sekundu a místní doplňování zemí síť nepoužívá. Jsou-li oba blokované, uložená místa zůstávají lokálně funkční."
          ],
          [
            "Klient · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · načítá Leaflet 1.9.4 JavaScript/CSS. Bez Leafletu v mezipaměti blokace hostu zabrání startu mapy."
          ],
          [
            "Klient · dlaždice OpenStreetMap",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · podkladové dlaždice. Při blokaci mohou data existovat, ale podklad zůstane prázdný/neúplný."
          ],
          [
            "Server · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · odchozí ze serveru Home Assistant. Blitzortung v1.7.1 používá broker/geohash témata pro živé blesky; blokace zastaví nová data, nikoli hledání/mapu."
          ],
          [
            "Lokálně · bez externího povolení",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, služba souřadnic, dashboard skript a seznam Local to-do “Gewitterradar Orte” běží lokálně."
          ],
          [
            "Instalace / aktualizace",
            "GitHub/HACS slouží k instalaci/aktualizaci, nejsou runtime závislostí otevřené mapy."
          ],
          [
            "Rychlá diagnostika",
            "Hledání nefunguje: Open-Meteo/Nominatim. Mapa nestartuje: unpkg.com. Prázdný podklad: hosty OSM dlaždic. Chybějící/staré blesky: blitzortung.ha.sed.pl:1883 a integrace Blitzortung."
          ]
        ],
        "notes": [
          "DNS musí fungovat na klientu i serveru Home Assistant pro jejich cíle.",
          "HTTPS proxy, TLS inspekce, filtry, blokátory či rozšíření mohou požadavky zastavit i při otevřeném TCP 443; u geokódování ověřte také CORS/filtrování odpovědi.",
          "Soukromí: geokódování přijímá dotaz/parametry, OSM dlaždice technicky odhalují zobrazenou oblast a broker Blitzortung dostává odebíraná region/geohash témata.",
          "http://www.w3.org/2000/svg je pouze jmenný prostor SVG, nikoli externí síťové volání.",
          "Runtime inventář je automaticky hlídán: nový pevný externí URL cíl má test zneplatnit, dokud se neaktualizují dokumentace a povolení."
        ]
      },
      {
        "key": "functions",
        "title": "Důležité funkce",
        "entries": [
          [
            "Efekty aury",
            "znázorňují aktivitu blesků, ale nemění detekci ani počítání."
          ],
          [
            "Výstražná animace",
            "vizuálně zvýrazňuje významnou bouřkovou aktivitu."
          ],
          [
            "Seskupování mapy",
            "spojuje blízké značky a udržuje mapu přehlednou."
          ],
          [
            "Kompas: nejbližší blesk",
            "nasměruje zobrazení k nejbližšímu rozpoznanému výboji."
          ],
          [
            "Orientace zařízení",
            "může využívat orientaci podporovaných mobilních zařízení."
          ],
          [
            "Kalibrace a diagnostika",
            "poskytuje nástroje pro cílenou kontrolu, měření a diagnostiku zobrazení a jednotlivých součástí. Patří sem mimo jiné kalibrace kompasu a medailonu, diagnostická zobrazení a testovací funkce, například simulace bouřky. Tyto nástroje jsou určeny pro nastavení, vývoj a řešení problémů a při běžném provozu by měly zůstat vypnuté."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Doporučená základní nastavení",
        "paragraphs": [
          "Pro stabilní začátek doporučujeme:"
        ],
        "entries": [
          [
            "Testovací hodnoty · 500 km / 120 min / 200",
            "Detekční poloměr 500 km, časové okno 120 minut a 200 blesků jsou příkladové testovací hodnoty, nikoli povinná nastavení. Lze je upravit podle použití, požadovaného dosahu pozorování a osobních potřeb."
          ],
          [
            "Sladit polohu & tracker",
            "Sladťe nastavení v Blitzortung pro tam nakonfigurovanou polohu i pro tracker používaný Gewitterradarem. Oblast dat a zobrazení tak zůstanou konzistentní."
          ],
          [
            "Sladit poloměry",
            "Nastavte poloměr zdroje Blitzortung alespoň stejně velký jako pozorovací poloměr Gewitterradaru."
          ],
          [
            "Nechat zapnuté",
            "Nechte zapnuté seskupování mapy a výstražnou animaci."
          ],
          [
            "Volitelné",
            "Aura efekty nastavte podle preferencí; neovlivňují detekci. Orientaci zařízení zapněte jen tehdy, když je na používaném mobilním zařízení potřeba."
          ],
          [
            "Běžný provoz",
            "Při běžném provozu nechte nástroje v části „Kalibrace a diagnostika“, zejména simulaci bouřky, vypnuté."
          ],
          [
            "Recorder – zkontrolovat",
            "Zkontrolujte v Recorderu vyloučení často aktualizovaných dat o blescích a poloze. Bez vhodných vyloučení může databáze Home Assistant a zálohy růst velmi rychle. Podrobnosti a YAML viz „Home Assistant Recorder“."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Když něco nefunguje",
        "entries": [
          [
            "Žádné nebo příliš málo výbojů",
            "Zkontrolujte stav zdroje, poloměr zdroje a použité entity blesků."
          ],
          [
            "Vzdálenosti nebo směry vypadají chybně",
            "Zkontrolujte referenční polohu a jednotku vzdálenosti."
          ],
          [
            "Záloha roste neobvykle rychle",
            "Chybějící vyloučení Recorderu pro často aktualizovaná data o blescích a poloze mohou velmi rychle zvětšovat databázi Home Assistant a tím i zálohy. Zkontrolujte nastavení Recorderu; podrobnosti a YAML viz „Home Assistant Recorder“."
          ],
          [
            "Výběr jazyka se stále vrací",
            "Ověřte instalaci aktuálního balíčku Gewitterradar a inicializačního pomocníka."
          ],
          [
            "Zobrazení se po aktualizaci nezměnilo",
            "Úplně obnovte mezipaměť prohlížeče/aplikace a ověřte použití aktuálního souboru JavaScript."
          ],
          [
            "Neobvyklé chování nebo dvojitá karta",
            "V Home Assistant smí být aktivní jen JEDEN modulový prostředek Gewitterradar. Nativní integrace a prostředek Dashboard/HACS nesmějí současně registrovat stejnou vlastní kartu."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Data o blescích mohou vytvářet velmi mnoho změn stavu. Pro dlouhodobě úspornou konfiguraci Recorder doporučujeme vyloučit následující entity a vzory."
        ],
        "recorder": true,
        "notes": [
          "Pokud již existuje sekce recorder:, začleňte položky do ní. Nevytvářejte druhý blok recorder: nejvyšší úrovně.",
          "Vyloučení NEVYPÍNAJÍ živé stavy používané Gewitterradarem.",
          "Stávající historická data se automaticky neodstraní.",
          "Zástupné vzory podporují více detektorů nebo pozorovacích bodů bez ohledu na prefix entity."
        ]
      }
    ]
  },
  "Ελληνικά": {
    "menuTitle": "Βοήθεια και σημειώσεις",
    "title": "Βοήθεια και σημειώσεις",
    "subtitle": "Ένας σύντομος οδηγός για αξιόπιστη και κατανοητή λειτουργία του Gewitterradar.",
    "close": "Κλείσιμο βοήθειας",
    "copy": "Αντιγραφή YAML",
    "copied": "Αντιγράφηκε",
    "copyFailed": "Η αντιγραφή δεν είναι διαθέσιμη — επιλέξτε τον κώδικα.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Προϋποθέσεις",
        "paragraphs": [
          "Το Gewitterradar επεξεργάζεται τα δεδομένα κεραυνών που λαμβάνει το Home Assistant από τη ρυθμισμένη πηγή ανίχνευσης. Ελέγξτε εκεί τη σωστή θέση αναφοράς και ορίστε την ακτίνα πηγής τουλάχιστον ίση με την ακτίνα παρατήρησης του Gewitterradar. Το Gewitterradar δεν μπορεί να εμφανίσει ή να αξιολογήσει κεραυνούς που έχουν ήδη φιλτραριστεί από την πηγή."
        ],
        "notes": [
          "Αν υπάρχουν πολλοί ανιχνευτές ή σημεία παρατήρησης, οι οντότητες που χρησιμοποιούνται πρέπει να αντιστοιχούν σαφώς στο επιθυμητό σημείο αναφοράς."
        ]
      },
      {
        "key": "radii",
        "title": "Οι ακτίνες",
        "paragraphs": [
          "Οι ακτίνες είναι αθροιστικές: ένας κεραυνός μέσα στην ακτίνα κινδύνου μετρά επίσης στις ακτίνες καταιγίδας και παρατήρησης. Πρόκειται για όρια απόστασης, όχι για ξεχωριστές πηγές δεδομένων."
        ],
        "items": [
          "Ακτίνα παρατήρησης – εξωτερική περιοχή για έγκαιρη παρατήρηση.",
          "Ακτίνα καταιγίδας – κοντινότερη περιοχή που απαιτεί αυξημένη προσοχή.",
          "Ακτίνα κινδύνου – άμεση γειτνίαση με ιδιαίτερα υψηλή σημασία."
        ],
        "notes": [
          "Η ακτίνα κινδύνου περιορίζεται σε μέγιστο 250 km. Δείτε τις «Προτεινόμενες βασικές ρυθμίσεις» για προτεινόμενες αρχικές τιμές και τον απαραίτητο συντονισμό με την εφαρμογή Blitzortung."
        ]
      },
      {
        "key": "location",
        "title": "Τοποθεσία & αποθηκευμένες τοποθεσίες",
        "paragraphs": [
          "Η επιλεγμένη τοποθεσία είναι το σημείο αναφοράς από το οποίο το Gewitterradar υπολογίζει αποστάσεις και κατευθύνσεις. Η βιβλιοθήκη τοποθεσιών παραμένει τοπική στο Home Assistant."
        ],
        "entries": [
          [
            "Τοποθεσία",
            "Το dashboard V4.07 χρησιμοποιεί το device_tracker.gewitterradar_dashboard για παγκόσμια αναζήτηση. Για να ακολουθεί και η περιοχή ζωντανών δεδομένων, το Blitzortung πρέπει να παρακολουθεί αυτό το tracker ως οντότητα τοποθεσίας."
          ],
          [
            "Ρύθμιση Blitzortung",
            "Ρυθμίστε το Blitzortung από Ρυθμίσεις → Συσκευές και υπηρεσίες → Blitzortung → Προσθήκη καταχώρησης, επιλέξτε “Location entity” και μετά “Gewitterradar Dashboard”. Παλιά καταχώρηση με σταθερές συντεταγμένες δεν μετατρέπεται με επαναρύθμιση· δημιουργήστε νέα, δοκιμάστε την και μετά απενεργοποιήστε την παλιά."
          ],
          [
            "Εφαρμογή τοποθεσίας",
            "Η «Εφαρμογή» ορίζει την τοποθεσία, κλείνει την αναζήτηση και κεντράρει τον χάρτη."
          ],
          [
            "Ρύθμιση λίστας αποθηκευμένων τοποθεσιών",
            "Για αποθήκευση δημιουργήστε λίστα Local to-do με ακριβές όνομα “Gewitterradar Orte”."
          ],
          [
            "Αποθηκευμένες τοποθεσίες",
            "★ Αποθήκευση αποθηκεύει μόνιμα και τοπικά τις τοποθεσίες που βρέθηκαν. Εμφανίζονται στις «Αποθηκευμένες τοποθεσίες» και μπορούν να χρησιμοποιηθούν ξανά χωρίς νέα αναζήτηση. Το × δεν διαγράφει αμέσως μια τοποθεσία, αλλά τη σημειώνει για αφαίρεση. Στις «Αφαιρεμένες τοποθεσίες», το ↶ την επαναφέρει οποτεδήποτε, διατηρώντας συντεταγμένες και μεταδεδομένα."
          ]
        ],
        "notes": [
          "Η μετακίνηση του χάρτη μόνη της δεν αποδεικνύει ότι το Blitzortung άλλαξε ήδη περιοχή ζωντανών δεδομένων. Η εγγενής ενσωμάτωση χρησιμοποιεί device_tracker.gewitterradar αντί του tracker του dashboard."
        ]
      },
      {
        "key": "external_services",
        "title": "Εξωτερικές υπηρεσίες και άδειες δικτύου",
        "paragraphs": [
          "Το Gewitterradar χρησιμοποιεί δύο διαδρομές δικτύου: χάρτης και αναζήτηση ξεκινούν απευθείας από browser/Companion App, ενώ τα ζωντανά δεδομένα Blitzortung λαμβάνονται από την ενσωμάτωση στον server Home Assistant. Firewall, VLAN, proxy, φίλτρο DNS και TLS inspection πρέπει να ελεγχθούν χωριστά.",
          "Οι παρακάτω προορισμοί είναι το τρέχον inventory εκτέλεσης V4.07. Η τοπική βιβλιοθήκη, το tracker και οι υπηρεσίες Home Assistant δεν χρειάζονται Internet."
        ],
        "entries": [
          [
            "Πελάτης · γεωκωδικοποίηση Open-Meteo",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · κύρια παγκόσμια αναζήτηση· στέλνει όρο, γλώσσα και μόνο με ρητό φίλτρο χώρας τον ISO κωδικό. Σε αποτυχία χρησιμοποιείται Nominatim."
          ],
          [
            "Πελάτης · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · εφεδρικό· στέλνει όρο, γλώσσα και ενδεχόμενο ISO κωδικό. Οι δημόσιες κλήσεις απέχουν τουλάχιστον ένα δευτερόλεπτο και η τοπική αυτόματη συμπλήρωση χωρών δεν κάνει δικτυακές κλήσεις. Αν μπλοκαριστούν και τα δύο, οι αποθηκευμένες τοποθεσίες λειτουργούν τοπικά."
          ],
          [
            "Πελάτης · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · φορτώνει Leaflet 1.9.4 JavaScript/CSS. Χωρίς cached Leaflet, μπλοκάρισμα του host εμποδίζει την εκκίνηση του χάρτη."
          ],
          [
            "Πελάτης · πλακίδια OpenStreetMap",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · βασικά πλακίδια. Αν μπλοκαριστούν, μπορεί να υπάρχουν δεδομένα αλλά ο βασικός χάρτης μένει κενός/ελλιπής."
          ],
          [
            "Server · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · εξερχόμενο από τον server Home Assistant. Το Blitzortung v1.7.1 χρησιμοποιεί broker/geohash topics για ζωντανούς κεραυνούς· το μπλοκάρισμα σταματά νέα δεδομένα αλλά όχι αναζήτηση/χάρτη."
          ],
          [
            "Τοπικά · χωρίς εξωτερική άδεια",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, υπηρεσία συντεταγμένων, dashboard script και λίστα Local to-do “Gewitterradar Orte” λειτουργούν τοπικά."
          ],
          [
            "Εγκατάσταση / ενημέρωση",
            "GitHub/HACS χρησιμοποιούνται για εγκατάσταση/ενημέρωση, όχι ως runtime εξάρτηση του ανοικτού χάρτη."
          ],
          [
            "Γρήγορη διάγνωση",
            "Πρόβλημα αναζήτησης: Open-Meteo/Nominatim. Ο χάρτης δεν ξεκινά: unpkg.com. Κενό υπόβαθρο: OSM tile hosts. Απόντες/παλιοί κεραυνοί: blitzortung.ha.sed.pl:1883 και ενσωμάτωση Blitzortung."
          ]
        ],
        "notes": [
          "Το DNS πρέπει να λειτουργεί στον πελάτη και στον server Home Assistant για τους αντίστοιχους προορισμούς.",
          "HTTPS proxy, TLS inspection, φίλτρα, blockers ή extensions μπορεί να μπλοκάρουν αιτήματα παρά το ανοικτό TCP 443· για γεωκωδικοποίηση ελέγξτε και CORS/φίλτρα απάντησης.",
          "Απόρρητο: η γεωκωδικοποίηση λαμβάνει όρο/παραμέτρους, τα OSM tiles αποκαλύπτουν τεχνικά την περιοχή προβολής και ο broker Blitzortung λαμβάνει τα subscribed region/geohash topics.",
          "Το http://www.w3.org/2000/svg είναι μόνο SVG namespace, όχι εξωτερική δικτυακή κλήση.",
          "Το runtime inventory προστατεύεται αυτόματα: νέος σταθερός εξωτερικός URL προορισμός πρέπει να αποτυγχάνει στο test μέχρι να ενημερωθούν τεκμηρίωση και άδειες."
        ]
      },
      {
        "key": "functions",
        "title": "Σημαντικές λειτουργίες",
        "entries": [
          [
            "Εφέ αύρας",
            "απεικονίζουν τη δραστηριότητα κεραυνών χωρίς να αλλάζουν την ανίχνευση ή την καταμέτρηση."
          ],
          [
            "Κίνηση προειδοποίησης",
            "τονίζει οπτικά τη σημαντική δραστηριότητα καταιγίδας."
          ],
          [
            "Ομαδοποίηση χάρτη",
            "συνδυάζει κοντινούς δείκτες και διατηρεί τον χάρτη καθαρό."
          ],
          [
            "Πυξίδα: κοντινότερος κεραυνός",
            "στρέφει την προβολή προς τον κοντινότερο ανιχνευμένο κεραυνό."
          ],
          [
            "Προσανατολισμός συσκευής",
            "μπορεί να χρησιμοποιεί τον προσανατολισμό υποστηριζόμενων κινητών συσκευών."
          ],
          [
            "Βαθμονόμηση και διάγνωση",
            "παρέχει εργαλεία για στοχευμένο έλεγχο, μέτρηση και διάγνωση της προβολής και επιμέρους στοιχείων. Περιλαμβάνονται, μεταξύ άλλων, βαθμονόμηση πυξίδας και μεταλλίου, διαγνωστικές προβολές και λειτουργίες δοκιμής όπως η προσομοίωση καταιγίδας. Τα εργαλεία προορίζονται για ρύθμιση, ανάπτυξη και αντιμετώπιση προβλημάτων και πρέπει να παραμένουν απενεργοποιημένα στην κανονική λειτουργία."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Προτεινόμενες βασικές ρυθμίσεις",
        "paragraphs": [
          "Για σταθερή εκκίνηση προτείνουμε:"
        ],
        "entries": [
          [
            "Τιμές δοκιμής · 500 km / 120 min / 200",
            "Ακτίνα ανίχνευσης 500 km, χρονικό παράθυρο 120 λεπτών και 200 κεραυνοί είναι ενδεικτικές τιμές δοκιμής, όχι υποχρεωτικές ρυθμίσεις. Μπορούν να προσαρμοστούν στη χρήση, στην επιθυμητή εμβέλεια παρατήρησης και στις προσωπικές ανάγκες."
          ],
          [
            "Συντονισμός τοποθεσίας & tracker",
            "Συντονίστε τις αντίστοιχες ρυθμίσεις στο Blitzortung τόσο για την τοποθεσία που έχει ρυθμιστεί εκεί όσο και για το tracker που χρησιμοποιεί το Gewitterradar. Έτσι η περιοχή δεδομένων και η προβολή παραμένουν συνεπείς."
          ],
          [
            "Συντονισμός ακτίνων",
            "Ορίστε την ακτίνα πηγής Blitzortung τουλάχιστον ίση με την ακτίνα παρατήρησης του Gewitterradar."
          ],
          [
            "Να παραμένουν ενεργά",
            "Διατηρήστε ενεργά την ομαδοποίηση χάρτη και την κίνηση προειδοποίησης."
          ],
          [
            "Προαιρετικά",
            "Ρυθμίστε τα εφέ αύρας σύμφωνα με τις προτιμήσεις σας· δεν επηρεάζουν την ανίχνευση. Ενεργοποιήστε τον προσανατολισμό συσκευής μόνο όταν χρειάζεται στη χρησιμοποιούμενη κινητή συσκευή."
          ],
          [
            "Κανονική λειτουργία",
            "Διατηρήστε απενεργοποιημένα στην κανονική λειτουργία τα εργαλεία της ενότητας «Βαθμονόμηση και διάγνωση», ιδιαίτερα την προσομοίωση καταιγίδας."
          ],
          [
            "Recorder – έλεγχος",
            "Ελέγξτε τις εξαιρέσεις Recorder για δεδομένα κεραυνών και θέσης που ενημερώνονται συχνά. Χωρίς κατάλληλες εξαιρέσεις, η βάση δεδομένων Home Assistant και τα αντίγραφα ασφαλείας μπορούν να αυξηθούν πολύ γρήγορα. Δείτε «Home Assistant Recorder» για λεπτομέρειες και YAML."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Αν κάτι δεν λειτουργεί",
        "entries": [
          [
            "Καθόλου ή πολύ λίγοι κεραυνοί",
            "Ελέγξτε την κατάσταση της πηγής, την ακτίνα πηγής και τις οντότητες κεραυνών."
          ],
          [
            "Οι αποστάσεις ή κατευθύνσεις φαίνονται λάθος",
            "Ελέγξτε τη θέση αναφοράς και τη μονάδα απόστασης."
          ],
          [
            "Το αντίγραφο ασφαλείας αυξάνεται ασυνήθιστα γρήγορα",
            "Η έλλειψη εξαιρέσεων Recorder για συχνά ενημερωμένα δεδομένα κεραυνών και θέσης μπορεί να αυξήσει πολύ γρήγορα τη βάση δεδομένων Home Assistant και συνεπώς τα αντίγραφα ασφαλείας. Ελέγξτε τις ρυθμίσεις Recorder· δείτε «Home Assistant Recorder» για λεπτομέρειες και YAML."
          ],
          [
            "Η επιλογή γλώσσας επανεμφανίζεται",
            "Ελέγξτε ότι έχουν εγκατασταθεί το τρέχον πακέτο Gewitterradar και ο βοηθός αρχικοποίησης."
          ],
          [
            "Η προβολή δεν άλλαξε μετά την ενημέρωση",
            "Επαναφορτώστε πλήρως την cache του προγράμματος περιήγησης/εφαρμογής και βεβαιωθείτε ότι χρησιμοποιείται το τρέχον JavaScript."
          ],
          [
            "Παράξενη συμπεριφορά ή διπλή κάρτα",
            "Μόνο ΕΝΑΣ πόρος μονάδας Gewitterradar επιτρέπεται να είναι ενεργός στο Home Assistant. Η εγγενής ενσωμάτωση και ο πόρος Dashboard/HACS δεν πρέπει να καταχωρούν ταυτόχρονα την ίδια προσαρμοσμένη κάρτα."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Τα δεδομένα κεραυνών μπορούν να δημιουργήσουν πάρα πολλές αλλαγές κατάστασης. Για λιτή μακροχρόνια ρύθμιση του Recorder προτείνουμε να εξαιρεθούν οι ακόλουθες οντότητες και τα μοτίβα."
        ],
        "recorder": true,
        "notes": [
          "Αν υπάρχει ήδη ενότητα recorder:, ενσωματώστε εκεί αυτές τις καταχωρίσεις. Μη δημιουργήσετε δεύτερο μπλοκ recorder: ανώτατου επιπέδου.",
          "Οι εξαιρέσεις ΔΕΝ απενεργοποιούν τις ζωντανές καταστάσεις που χρησιμοποιεί το Gewitterradar.",
          "Τα υπάρχοντα ιστορικά δεδομένα δεν διαγράφονται αυτόματα.",
          "Τα μοτίβα wildcard υποστηρίζουν πολλούς ανιχνευτές ή σημεία παρατήρησης ανεξάρτητα από το πρόθεμα οντότητας."
        ]
      }
    ]
  },
  "Magyar": {
    "menuTitle": "Súgó és megjegyzések",
    "title": "Súgó és megjegyzések",
    "subtitle": "Rövid útmutató a Gewitterradar megbízható és érthető működéséhez.",
    "close": "Súgó bezárása",
    "copy": "YAML másolása",
    "copied": "Másolva",
    "copyFailed": "A másolás nem érhető el – jelölje ki a kódot.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Előfeltételek",
        "paragraphs": [
          "A Gewitterradar a Home Assistant által a beállított villámdetektáló forrásból fogadott adatokat dolgozza fel. Ellenőrizze ott a megfelelő referenciahelyet, és a forrás sugarát állítsa legalább akkorára, mint a Gewitterradar megfigyelési sugara. A Gewitterradar nem tudja megjeleníteni vagy értékelni a forrás által már kiszűrt villámokat."
        ],
        "notes": [
          "Ha több detektor vagy megfigyelési pont van, a használt entitásoknak egyértelműen a kívánt referenciaponthoz kell tartozniuk."
        ]
      },
      {
        "key": "radii",
        "title": "A sugarak",
        "paragraphs": [
          "A sugarak egymásra épülnek: a veszélyzónán belüli villám a vihar- és megfigyelési sugárba is beleszámít. Ezek távolsági küszöbök, nem külön adatforrások."
        ],
        "items": [
          "Megfigyelési sugár – külső terület a korai megfigyeléshez.",
          "Viharsugár – közelebbi terület, amely fokozott figyelmet igényel.",
          "Veszélysugár – közvetlen környezet kiemelten nagy jelentőséggel."
        ],
        "notes": [
          "A veszélysugár legfeljebb 250 km lehet. Az ajánlott kezdőértékeket és a Blitzortung alkalmazással szükséges összehangolást az „Ajánlott alapbeállítások” rész ismerteti."
        ]
      },
      {
        "key": "location",
        "title": "Hely & mentett helyek",
        "paragraphs": [
          "A kiválasztott hely az a referenciapont, amelytől a Gewitterradar a távolságokat és irányokat számítja. A helylista helyben marad a Home Assistantban."
        ],
        "entries": [
          [
            "Hely",
            "A V4.07 dashboard a device_tracker.gewitterradar_dashboard trackert használja a globális kereséshez. Ahhoz, hogy az élő adatrégió is kövesse a választást, a Blitzortungnak ezt a trackert kell helyentitásként követnie."
          ],
          [
            "Blitzortung beállítása",
            "A Blitzortung beállítása: Beállítások → Eszközök és szolgáltatások → Blitzortung → Bejegyzés hozzáadása, válassza a “Location entity” típust, majd a “Gewitterradar Dashboard” elemet. Régi, fix koordinátás bejegyzés nem alakítható át újrakonfigurálással; hozzon létre újat, tesztelje, és csak utána kapcsolja ki a régit."
          ],
          [
            "Hely alkalmazása",
            "Az „Alkalmaz” beállítja a helyet, bezárja a keresést és középre viszi a térképet."
          ],
          [
            "Mentett helyek listájának beállítása",
            "Mentéshez hozzon létre pontosan “Gewitterradar Orte” nevű Local to-do listát."
          ],
          [
            "Mentett helyek",
            "★ Mentés tartósan, helyben tárolja a megtalált helyeket. A „Mentett helyek” alatt jelennek meg, és új keresés nélkül ismét használhatók. A × nem törli azonnal a helyet, hanem eltávolításra jelöli. Az „Eltávolított helyek” alatt a ↶ bármikor visszaállítja; a koordináták és metaadatok megmaradnak."
          ]
        ],
        "notes": [
          "A térkép elmozdítása önmagában nem bizonyítja, hogy a Blitzortung már átállította az élő adatrégiót. A natív integráció a device_tracker.gewitterradar trackert használja a dashboard tracker helyett."
        ]
      },
      {
        "key": "external_services",
        "title": "Külső szolgáltatások és hálózati engedélyek",
        "paragraphs": [
          "A Gewitterradar két hálózati útvonalat használ: a térkép és keresés közvetlenül a böngészőből/Companion Appból indul, míg a Blitzortung élő adatokat a Home Assistant szerveren futó integráció kéri le. A tűzfalat, VLAN-t, proxyt, DNS-szűrőt és TLS-ellenőrzést ezért külön kell vizsgálni.",
          "Az alábbi célok a V4.07 jelenlegi futásidejű készletét alkotják. A helyi helylista, tracker és Home Assistant szolgáltatások nem igényelnek Internetet."
        ],
        "entries": [
          [
            "Kliens · Open-Meteo geokódolás",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · elsődleges globális keresés; lekérdezést, nyelvet és csak explicit ország-szűrésnél ISO-kódot küld. Hiba esetén Nominatim következik."
          ],
          [
            "Kliens · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · tartalék; lekérdezést, nyelvet és esetleges ISO-kódot küld. A nyilvános hívások között legalább egy másodperc van, a helyi ország-kiegészítés nem használ hálózatot. Ha mindkettő blokkolt, a mentett helyek helyben tovább működnek."
          ],
          [
            "Kliens · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · Leaflet 1.9.4 JavaScript/CSS. Cache nélkül a host blokkolása megakadályozza a térkép indulását."
          ],
          [
            "Kliens · OpenStreetMap csempék",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · alaptérkép-csempék. Blokkoláskor lehetnek adatok, de az alaptérkép üres/hiányos."
          ],
          [
            "Szerver · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · kimenő kapcsolat a Home Assistant szerverről. A Blitzortung v1.7.1 broker/geohash témákat használ élő villámokhoz; blokkolása megállítja az új adatokat, de nem a keresést/térképet."
          ],
          [
            "Helyi · nincs külső engedély",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, koordinátaszolgáltatás, dashboard script és “Gewitterradar Orte” Local to-do lista helyben fut."
          ],
          [
            "Telepítés / frissítés",
            "GitHub/HACS telepítéshez/frissítéshez kell, nem a megnyitott térkép futásidejű függősége."
          ],
          [
            "Gyors diagnosztika",
            "Keresési hiba: Open-Meteo/Nominatim. Térkép nem indul: unpkg.com. Üres alap: OSM csempehostok. Hiányzó/régi villámok: blitzortung.ha.sed.pl:1883 és Blitzortung integráció."
          ]
        ],
        "notes": [
          "A DNS-nek a kliensen és a Home Assistant szerveren is működnie kell a megfelelő célokhoz.",
          "HTTPS proxy, TLS-ellenőrzés, szűrők, blokkolók vagy bővítmények nyitott TCP 443 mellett is akadályozhatnak; geokódolásnál CORS/válaszszűrést is ellenőrizzen.",
          "Adatvédelem: a geokódolás megkapja a lekérdezést/paramétereket, az OSM csempék technikailag jelzik a nézett területet, a Blitzortung broker pedig a feliratkozott régió/geohash témákat.",
          "A http://www.w3.org/2000/svg csak SVG névtér, nem külső hálózati hívás.",
          "A runtime készlet automatikusan védett: új fix külső URL-célnak el kell rontania a tesztet, amíg a dokumentáció és engedélyezés nem frissül."
        ]
      },
      {
        "key": "functions",
        "title": "Fontos funkciók",
        "entries": [
          [
            "Auraeffektek",
            "megjelenítik a villámtevékenységet, de nem módosítják az észlelést vagy a számlálást."
          ],
          [
            "Figyelmeztető animáció",
            "vizuálisan kiemeli a jelentős vihartevékenységet."
          ],
          [
            "Térképcsoportosítás",
            "összevonja a közeli villámjelölőket és áttekinthetően tartja a térképet."
          ],
          [
            "Iránytű: legközelebbi villám",
            "a kijelzőt a legközelebbi észlelt villám felé irányítja."
          ],
          [
            "Eszköz tájolása",
            "támogatott mobileszközökön felhasználhatja az eszköz tájolását."
          ],
          [
            "Kalibrálás és diagnosztika",
            "eszközöket biztosít a megjelenítés és az egyes elemek célzott ellenőrzéséhez, méréséhez és hibakereséséhez. Ide tartozik többek között az iránytű és a medál kalibrálása, diagnosztikai nézetek, valamint tesztfunkciók, például a viharszimuláció. Ezek az eszközök beállításhoz, fejlesztéshez és hibakereséshez készültek, normál használatkor pedig maradjanak kikapcsolva."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Ajánlott alapbeállítások",
        "paragraphs": [
          "A stabil induláshoz javasoljuk:"
        ],
        "entries": [
          [
            "Tesztértékek · 500 km / 120 min / 200",
            "Az 500 km észlelési sugár, a 120 perces időablak és a 200 villám példa tesztértékek, nem kötelező beállítások. Az alkalmazási területhez, a kívánt megfigyelési távolsághoz és az egyéni igényekhez igazíthatók."
          ],
          [
            "Hely & tracker összehangolása",
            "Hangolja össze a Blitzortung beállításait az ott konfigurált helyhez és a Gewitterradar által használt trackerhez is. Így az adatrégió és a megjelenítés következetes marad."
          ],
          [
            "Sugarak összehangolása",
            "A Blitzortung forrássugarát állítsa legalább akkorára, mint a Gewitterradar megfigyelési sugarát."
          ],
          [
            "Maradjon bekapcsolva",
            "Hagyja bekapcsolva a térképcsoportosítást és a figyelmeztető animációt."
          ],
          [
            "Opcionális",
            "Az auraeffekteket ízlés szerint állítsa; nem befolyásolják az észlelést. Az eszköz tájolását csak akkor kapcsolja be, ha a használt mobileszközön szükséges."
          ],
          [
            "Normál használat",
            "Normál használatkor tartsa kikapcsolva a „Kalibrálás és diagnosztika” eszközeit, különösen a viharszimulációt."
          ],
          [
            "Recorder – ellenőrizendő",
            "Ellenőrizze a Recorder kizárásait a gyakran frissülő villám- és helyadatokra. Megfelelő kizárások nélkül a Home Assistant adatbázisa és a biztonsági mentések nagyon gyorsan növekedhetnek. Részletek és YAML: „Home Assistant Recorder”."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Ha valami nem működik",
        "entries": [
          [
            "Nincs vagy túl kevés villám",
            "Ellenőrizze a forrás állapotát, a forrássugarat és a használt villámentitásokat."
          ],
          [
            "A távolságok vagy irányok hibásnak tűnnek",
            "Ellenőrizze a referenciahelyet és a távolság mértékegységét."
          ],
          [
            "A biztonsági mentés szokatlanul gyorsan nő",
            "A gyakran frissülő villám- és helyadatok Recorder-kizárásainak hiánya nagyon gyorsan növelheti a Home Assistant adatbázisát, és ezzel a biztonsági mentéseket is. Ellenőrizze a Recorder beállításait; részletek és YAML: „Home Assistant Recorder”."
          ],
          [
            "A nyelvválasztás újra megjelenik",
            "Ellenőrizze az aktuális Gewitterradar-csomag és az inicializálási segéd telepítését."
          ],
          [
            "A megjelenés nem változott frissítés után",
            "Töltse újra teljesen a böngésző/app gyorsítótárát, és ellenőrizze az aktuális JavaScript használatát."
          ],
          [
            "Szokatlan működés vagy kettős kártya",
            "A Home Assistantban csak EGY Gewitterradar modul-erőforrás lehet aktív. A natív integráció és a Dashboard/HACS-erőforrás nem regisztrálhatja egyszerre ugyanazt az egyéni kártyát."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "A villámadatok nagyon sok állapotváltozást okozhatnak. A hosszú távon karcsú Recorder-konfigurációhoz javasoljuk az alábbi entitások és minták kizárását."
        ],
        "recorder": true,
        "notes": [
          "Ha már van recorder: szakasz, ezeket a bejegyzéseket oda illessze. Ne hozzon létre második felső szintű recorder: blokkot.",
          "A kizárások NEM tiltják le a Gewitterradar által használt élő állapotokat.",
          "A meglévő előzményadatok nem törlődnek automatikusan.",
          "A helyettesítő minták több detektort vagy megfigyelési pontot támogatnak az entitás előtagjától függetlenül."
        ]
      }
    ]
  },
  "Boarisch": {
    "menuTitle": "Hüf & Hinwais",
    "title": "Hüf & Hinwais",
    "subtitle": "Kurz erklärt, damit s Gewitterradar zuverlässig und nachvollziehbar lafft.",
    "close": "Hüf zumacha",
    "copy": "YAML kopiern",
    "copied": "Kopiert",
    "copyFailed": "Kopiern geht ned – bittschön den Code markiern.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Voraussetzungen",
        "paragraphs": [
          "Gewitterradar verarbeitet de Blitzdaten, de Home Assistant vo da verwendeten Blitzortung-Datenquelle erhält. Prüfe dort den richtigen Referenzstandort und stelle den Quellradius mindestens so groß wie den Beobachtungsradius in Gewitterradar a. Gewitterradar ko koane Blitz anzeigen oda auswerten, de vo da Datenquelle scho herausgefiltert wurden."
        ],
        "notes": [
          "Wenn mehrere Blitzortung-Gerät oda Beobachtungspunkte vorhanden san, müassn de verwendeten Entitäten eindeutig zum gewünschten Referenzpunkt passen."
        ]
      },
      {
        "key": "radii",
        "title": "De Radien",
        "paragraphs": [
          "De Radien bauen aufeinander auf: A Blitz im Gefahrenradius zählt gleichzeitig zum Gewitter- und Beobachtungsradius. De Bereiche san Entfernungsschwellen, koane voneinander getrennten Datenquellen."
        ],
        "items": [
          "Beobachtungsradius – da äußere Bereich fürs friahzeitige Beobachtn.",
          "Gewitterradius – da nähere Bereich, wo ma besonders Obacht gebn sollt.",
          "Gefahrenradius – da unmittelbare Nahbereich mit besonders hoher Wichtigkeit."
        ],
        "notes": [
          "Da Gefahrenradius is auf maximal 250 km begrenzt. Hinwais zu empfohlenen Ausgangswerten und zur erforderlichen Abstimmung mit da Blitzortung-App findest du unter „Empfohlene Grundeinstellungen“."
        ]
      },
      {
        "key": "location",
        "title": "Standort & gspeicherte Ort",
        "paragraphs": [
          "Da gewählte Ort is da Bezugspunkt, vo dem Gewitterradar Entfernunga und Richtunga berechnet. De Ortsbibliothek liegt lokal in Home Assistant; gspeichert werdn Name und Koordinaten des gewählten Ortes."
        ],
        "entries": [
          [
            "Standort",
            "Für de weltweite Ortssuach verwendt de Dashboard-/Package-Variante vo V4.07 device_tracker.gewitterradar_dashboard. Damit auch de Blitzdaten dem gewählten Ort folgen, muaß de Blitzortung-Integration denselben Tracker ois Standortquelle verwenden."
          ],
          [
            "Blitzortung einrichten",
            "Einstellungen → Gerät & Dienste → Blitzortung → Eintrag hinzufügen. Ois Konfigurationstyp „Location entity“ wählen und anschließend „Gewitterradar Dashboard“ ois Standort-Entität auswählen. A vorhandener Eintrag mit festen Breiten-/Längengraden lässt sich über „Neu konfigurieren“ ned auf a Standort-Entität umstellen. In diesem Fall an neuen Eintrag anlegen, prüfn und den alten Koordinaten-Eintrag erst danach deaktivieren oda löschen."
          ],
          [
            "Ort nehma",
            "„Nehma“ übernimmt an gwählten Ort sofort ois Bezugsstandort, schließt de Ortssuach automatisch und fährt de Karte direkt zum neuen Standort."
          ],
          [
            "Speicherliste einrichten",
            "Einstellungen → Gerät & Dienste → Integration hinzufügen → nach „Local to-do“ suacha und de Integration auswählen. Ois Listenname exakt „Gewitterradar Ort“ vergeben und de Einrichtung abschließen."
          ],
          [
            "Gespeicherte Ort",
            "★ Speichern legt gefundene Ort dauerhaft lokal ab. Sie erscheinen im Standortmenü unter „Gespeicherte Ort“ und kenna ohne erneute Ortssuach verwendt werdn. Mit × wird a Ort ned sofort gelöscht, sondern zur Löschung vorgemerkt. Unter „Entfernte Ort“ stellt ↶ ihn jederzeit wieder her; Koordinaten und Metadaten bleiben erhalten."
          ]
        ],
        "notes": [
          "A Kartenwechsel allein beweist ned, dass Blitzortung seine Live-Datenregion scho umgestellt hod. Bei da nativen Integration wird statt des Dashboard-Trackers device_tracker.gewitterradar verwendt."
        ]
      },
      {
        "key": "external_services",
        "title": "Externe Dienst & Netzwerkzugriff",
        "paragraphs": [
          "Gewitterradar hot zwei getrennte Netzwerkpfade: Karte und Ortssuach gehen vom Endgerät/Companion App raus, Blitzortung-Live-Daten holt dagegen de Blitzortung-Integration aufm Home-Assistant-Server. Firewall, VLAN, Proxy, DNS-Filter und TLS-Inspection müassn drum getrennt geprüft werdn.",
          "De folgenden Ziele san da gradige V4.07-Laufzeitbestand. Ortsbibliothek, Tracker und Home-Assistant-Services laufen lokal und brauchen dafür koa Internet."
        ],
        "entries": [
          [
            "Client · Open-Meteo Geocoding",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · primäre weltweite Ort-/PLZ-Suach; sendet Suchbegriff, Sprache und bloß bei explizitem Länderfilter den ISO-Code. Bei Fehler folgt Nominatim."
          ],
          [
            "Client · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · Rückfall; sendet Suchbegriff, Sprache und ggf. ISO-Code. Öffentliche Aufrufe ham mindestens a Sekunde Abstand; lokale Länder-Autovervollständigung macht koane Netzaufrufe. San beide blockiert, bleiben gespeicherte Ort lokal nutzbar."
          ],
          [
            "Client · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · lädt Leaflet 1.9.4 JavaScript/CSS. Ohne vorhandenes Leaflet verhindert a Sperre den Kartenstart."
          ],
          [
            "Client · OpenStreetMap-Kacheln",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · Grundkartenkacheln. Bei Sperre kenna Gewitterradar-Daten da sei, aber de Grundkarte bleibt leer/unvollständig."
          ],
          [
            "Server · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · ausgehend vom Home-Assistant-Server. Blitzortung v1.7.1 nutzt Broker/Geohash-Themen für Live-Blitz; Sperre stoppt neue Live-Daten, ned Ortssuach/Karte."
          ],
          [
            "Lokal · koane externe Freigabe",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, Koordinatenservice, Dashboard-Script und Local-to-do-Liste “Gewitterradar Ort” laufen lokal."
          ],
          [
            "Installation / Aktualisierung",
            "GitHub/HACS san für Installation/Aktualisierung da, ned Laufzeitabhängigkeit da geöffneten Karte."
          ],
          [
            "Schnelldiagnose",
            "Ortssuach kaputt: Open-Meteo/Nominatim prüfn. Karte startet ned: unpkg.com. Grundkarte leer: OSM-Kachelhosts. Blitz fehlen/alt: blitzortung.ha.sed.pl:1883 und Blitzortung-Integration prüfn."
          ]
        ],
        "notes": [
          "DNS muaß auf Endgerät und Home-Assistant-Server für de jeweils nötigen Ziele funktionieren.",
          "HTTPS-Proxy, TLS-Inspection, Filter, Blocker oda Browser-Erweiterungen kenna trotz TCP 443 Anfragen sperren; bei Geocoding auch CORS/Antwortfilter prüfn.",
          "Datenschutz: Geocoding erhält Suchbegriff/Parameter, OSM-Kacheln verraten technisch den betrachteten Kartenausschnitt und da Blitzortung-Broker erhält abonnierte Regions-/Geohash-Themen.",
          "http://www.w3.org/2000/svg is bloß da SVG-Namensraum und koa externer Netzwerkaufruf.",
          "Des Laufzeitinventar is automatisiert abgesichert: a neues festes externes URL-Ziel soll den Test brechen, bis Doku und Freigaben aktualisiert san."
        ]
      },
      {
        "key": "functions",
        "title": "Wichtige Funktionen",
        "entries": [
          [
            "Aura-Effekte",
            "visualisieren Blitzaktivität, verändern aber ned de Erkennung oda Zählung."
          ],
          [
            "Warnanimation",
            "hebt wichtige Gewitteraktivität optisch auße."
          ],
          [
            "Kartengruppierung",
            "fasst nahe Blitzmarker zusammen und hält de Karte übersichtlicher."
          ],
          [
            "Kompass: nächster Blitz",
            "richtet de Anzeige auf den nächstgelegenen erkannten Blitz."
          ],
          [
            "Geräteorientierung",
            "ko auf unterstützten Mobilgeräten de Geräteausrichtung einbeziehen."
          ],
          [
            "Kalibrierung & Diagnose",
            "stellt Werkzeuge zur gezielten Prüfung, Vermessung und Fehleranalyse da Darstellung und einzelner Komponenten bereit. Dazu gehören unter anderem Kompass- und Medaillon-Kalibrierung, Diagnoseansichten sowie Testfunktionen wie de Gewittersimulation. Diese Werkzeuge san für Einrichtung, Entwicklung und Fehlersuche gedacht und sollten im normalen Betrieb deaktiviert bleiben."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Empfohlene Grundeinstellungen",
        "paragraphs": [
          "Für an stabilen Start empfehlen wir:"
        ],
        "entries": [
          [
            "Testwerte · 500 km / 120 min / 200",
            "500 km Erfassungsradius, 120 Minuten Zeitfenster und 200 Blitz san Beispielwerte für den Test und koane zwingenden Vorgaben. Sie kenna abhängig vo Einsatzgebiet, gewünschter Beobachtungsreichweite und persönlicher Nutzung angepasst werdn."
          ],
          [
            "Standort & Tracker abstimmen",
            "De entsprechenden Einstellungen müassn auch in da Blitzortung-App passend hinterlegt werdn – sowohl beim dort konfigurierten Standort ois auch für den vo Gewitterradar verwendeten Tracker. Bloß so arbeiten Datenbereich und Darstellung konsistent zusammen."
          ],
          [
            "Radien abstimmen",
            "Den Quellradius da Blitzortung-Datenquelle mindestens so groß wie den Gewitterradar-Beobachtungsradius einstellen."
          ],
          [
            "Aktiv lassen",
            "Kartengruppierung und Warnanimation eigschaltet lassn."
          ],
          [
            "Optional",
            "Aura-Effekte nach persönlichem Geschmack einstellen; sie beeinflussen de Erkennung ned. Geräteorientierung bloß aktivieren, wenn sie auf dem verwendeten Mobilgerät benötigt wird."
          ],
          [
            "Normalbetrieb",
            "Werkzeuge aus „Kalibrierung & Diagnose“, insbesondere de Gewittersimulation, im normalen Betrieb deaktiviert lassen."
          ],
          [
            "Recorder – unbedingt prüfn",
            "Recorder-Ausschlüsse für häufig aktualisierte Blitz- und Positionsdaten prüfn. Fehlen geeignete Ausschlüsse, kenna Home-Assistant-Datenbank und Backups sehr schnell anwachsen. Details und YAML siehe „Home-Assistant-Recorder“."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Wenn wos ned stimmt",
        "entries": [
          [
            "Koane oda zu wenige Blitz",
            "Status da Blitzortung-Datenquelle, Quellradius und verwendete Blitz-Entitäten prüfn."
          ],
          [
            "Entfernunga oda Richtunga wirken falsch",
            "Referenzstandort und Distanzeinheit prüfn."
          ],
          [
            "Backup wachst ungewöhnlich schnell",
            "Fehlende Recorder-Ausschlüsse für häufig aktualisierte Blitz- und Positionsdaten kenna de Home-Assistant-Datenbank und dadurch auch Backups sehr schnell vergrößern. Recorder-Einstellungen prüfn; Details und YAML siehe „Home-Assistant-Recorder“."
          ],
          [
            "Sprachauswahl kummt immer wieder",
            "Prüfn, ob des gradige Gewitterradar-Package installiert is und da Initialisierungshelfer vorhanden is."
          ],
          [
            "Darstellung nachm Update unverändert",
            "Browser-/App-Cache vollständig neu laden und sicherstellen, dass de gradige JavaScript-Datei verwendt wird."
          ],
          [
            "Merkwürdiges Verhalten oda doppelte Karte",
            "In Home Assistant derf bloß EINE Gewitterradar-Modulressource aktiv sei. Native Integration und Dashboard-/HACS-Ressource dürfen ned gleichzeitig dieselbe Custom Card registrieren."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home-Assistant-Recorder",
        "paragraphs": [
          "Blitzdaten kenna sehr viele Zustandsänderungen erzeugen. Für an langfristig schlanken Recorder empfehlen wir, de folgenden Entitäten bzw. Entitätsmuster auszuschließen."
        ],
        "recorder": true,
        "notes": [
          "Falls scho a recorder:-Abschnitt existiert, diese Einträge dort ergänzen. Keinen zweiten Top-Level-recorder:-Block anlegen.",
          "De Ausschlüsse deaktivieren NICHT de Live-Zustände für Gewitterradar.",
          "Bereits vorhandene historische Daten werdn dadurch ned automatisch gelöscht.",
          "De Wildcards unterstützen mehrere Blitzortung-Gerät bzw. Beobachtungspunkte unabhängig vom Entity-Präfix."
        ]
      }
    ]
  },
  "Plattdüütsch": {
    "menuTitle": "Hülp & Henwiesen",
    "title": "Hülp & Henwiesen",
    "subtitle": "Kort verklort, dormit Gewitterradar seker un good to verstahn arbeidt.",
    "close": "Hülp tomaken",
    "copy": "YAML koperen",
    "copied": "Kopeert",
    "copyFailed": "Koperen geiht nich – markeer den Code.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Vörutsetten",
        "paragraphs": [
          "Gewitterradar verarbeitet de Blitzdaten, de Home Assistant vun de verwendeten Blitzortung-Datenquelle erhält. Prüfe dort den richtigen Referenzstandort un stelle den Quellradius mindestens so groß wie den Beobachtungsradius in Gewitterradar en. Gewitterradar kann keen Blitzen anzeigen oder auswerten, de vun de Datenquelle al herausgefiltert wurden."
        ],
        "notes": [
          "Wenn mehr Blitzortung-Geräte oder Beobachtungspunkte vorhanden sind, mööten de verwendeten Entitäten eindeutig zum gewünschten Referenzpunkt passen."
        ]
      },
      {
        "key": "radii",
        "title": "De Radien",
        "paragraphs": [
          "De Radien bauen aufeinander auf: En Blitz im Gefahrenradius zählt gleichzeitig zum Gewitter- un Beobachtungsradius. De Bereiche sind Entfernungsschwellen, keen voneinander getrennten Datenquellen."
        ],
        "items": [
          "Beobachtungsradius – äußerer Bereich för frühe Beobachtung.",
          "Gewitterradius – dat neegere Rebeet, dor muttst du beter oppassen.",
          "Gefahrenradius – dat direkte Nahrebeet mit besünners hoge Bedüden."
        ],
        "notes": [
          "De Gefahrenradius is auf maximal 250 km begrenzt. Henwiesen zu empfohlenen Ausgangswerten un zur erforderlichen Abstimmung mit de Blitzortung-App findest du unter „Empfohlene Grundeinstellungen“."
        ]
      },
      {
        "key": "location",
        "title": "Steed & spiekerte Öörd",
        "paragraphs": [
          "De gewählte Oort is de Bezugspunkt, vun dem Gewitterradar Afstänn un Richtungen berechnet. De Ortsbibliothek liegt lokal in Home Assistant; spiekert warrn Name un Koordinaten des gewählten Ortes."
        ],
        "entries": [
          [
            "Steed",
            "För de weltweite Ortssuche bruukt de Dashboard-/Package-Variante vun V4.07 device_tracker.gewitterradar_dashboard. Damit ok de Blitzdaten dem gewählten Oort folgen, mutt de Blitzortung-Integration denselben Tracker as Standortquelle bruken."
          ],
          [
            "Blitzortung einrichten",
            "Einstellungen → Geräte & Dienste → Blitzortung → Eintrag hinzufügen. As Konfigurationstyp „Location entity“ wählen un anschließend „Gewitterradar Dashboard“ as Steed-Entität auswählen. En vorhandener Eintrag mit festen Breiten-/Längengraden lässt sich über „Neu konfigurieren“ nich auf en Steed-Entität umstellen. In diesem Fall en neuen Eintrag anlegen, pröven un den alten Koordinaten-Eintrag erst danach deaktivieren oder löschen."
          ],
          [
            "Oort övernehmen",
            "„Övernehmen“ nimmt den wählten Oort glieks as Bezugsoort över, maakt de Oortsöök to un föhrt de Koort direkt na den niegen Steed."
          ],
          [
            "Speicherliste einrichten",
            "Einstellungen → Geräte & Dienste → Integration hinzufügen → nach „Local to-do“ söken un de Integration auswählen. As Listenname exakt „Gewitterradar Öörd“ vergeben un de Einrichtung abschließen."
          ],
          [
            "Gespeicherte Öörd",
            "★ Spiekern legt gefundene Öörd dauerhaft lokal ab. Sie erscheinen im Standortmenü unter „Gespeicherte Öörd“ un köönen ohne erneute Ortssuche bruukt warrn. Mit × warrt en Oort nich sofort gelöscht, sondern zur Löschung vorgemerkt. Unter „Entfernte Öörd“ stellt ↶ ihn jederzeit wieder her; Koordinaten un Metadaten bleiben erhalten."
          ]
        ],
        "notes": [
          "En Kartenwechsel allein beweist nich, dass Blitzortung seine Live-Datenregion al umgestellt hett. Bei de nativen Integration warrt statt des Dashboard-Trackers device_tracker.gewitterradar bruukt."
        ]
      },
      {
        "key": "external_services",
        "title": "Buten-Deensten & Nettwark-Togrepen",
        "paragraphs": [
          "Gewitterradar hot zwei getrennte Netzwerkpfade: Koort un Ortssuche gehen vom Endgerät/Companion App raus, Blitzortung-Live-Daten holt dagegen de Blitzortung-Integration aufm Home-Assistant-Server. Firewall, VLAN, Proxy, DNS-Filter un TLS-Inspection mööten drum getrennt geprüft warrn.",
          "De folgenden Ziele sind de aktuelle V4.07-Laufzeitbestand. Ortsbibliothek, Tracker un Home-Assistant-Services laufen lokal un brauchen dafür keen Internet."
        ],
        "entries": [
          [
            "Client · Open-Meteo Geocoding",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · primäre weltweite Oort-/PLZ-Söök; sendet Suchbegriff, Sprache un bloots bei explizitem Länderfilter den ISO-Code. Bei Fehler folgt Nominatim."
          ],
          [
            "Client · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · Rückfall; sendet Suchbegriff, Sprache un ggf. ISO-Code. Öffentliche Aufrufe hebben mindestens en Sekunde Abstand; lokale Länder-Autovervollständigung macht keen Netzaufrufe. Sind beide blockiert, bleiben gespeicherte Öörd lokal nutzbar."
          ],
          [
            "Client · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · lädt Leaflet 1.9.4 JavaScript/CSS. Ohne vorhandenes Leaflet verhindert en Sperre den Kartenstart."
          ],
          [
            "Client · OpenStreetMap-Kacheln",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · Grundkartenkacheln. Bei Sperre köönen Gewitterradar-Daten da wesen, aber de Grundkarte bleibt leer/unvollständig."
          ],
          [
            "Server · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · ausgehend vom Home-Assistant-Server. Blitzortung v1.7.1 nutzt Broker/Geohash-Themen för Live-Blitzen; Sperre stoppt neue Live-Daten, nich Ortssuche/Koort."
          ],
          [
            "Lokal · keen externe Freigabe",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, Koordinatenservice, Dashboard-Script un Local-to-do-Liste “Gewitterradar Öörd” laufen lokal."
          ],
          [
            "Installation / Aktualisierung",
            "GitHub/HACS sind för Installation/Aktualisierung da, nich Laufzeitabhängigkeit de geöffneten Koort."
          ],
          [
            "Schnelldiagnose",
            "Ortssuche kaputt: Open-Meteo/Nominatim pröven. Koort startet nich: unpkg.com. Grundkarte leer: OSM-Kachelhosts. Blitzen fehlen/alt: blitzortung.ha.sed.pl:1883 un Blitzortung-Integration pröven."
          ]
        ],
        "notes": [
          "DNS mutt auf Endgerät un Home-Assistant-Server för de jeweils nötigen Ziele funktionieren.",
          "HTTPS-Proxy, TLS-Inspection, Filter, Blocker oder Browser-Erweiterungen köönen trotz TCP 443 Anfragen sperren; bei Geocoding ok CORS/Antwortfilter pröven.",
          "Datenschutz: Geocoding erhält Suchbegriff/Parameter, OSM-Kacheln verraten technisch den betrachteten Kartenausschnitt un de Blitzortung-Broker erhält abonnierte Regions-/Geohash-Themen.",
          "http://www.w3.org/2000/svg is bloots de SVG-Namensraum un keen externer Netzwerkaufruf.",
          "Dat Laufzeitinventar is automatisiert abgesichert: en neues festes externes URL-Ziel soll den Test brechen, bis Doku un Freigaben aktualisiert sind."
        ]
      },
      {
        "key": "functions",
        "title": "Wichtige Funktionen",
        "entries": [
          [
            "Aura-Effekte",
            "visualisieren Blitzaktivität, verändern aber nich de Erkennung oder Zählung."
          ],
          [
            "Warnanimation",
            "heevt wichtige Gewitteraktivität sichtbor rut."
          ],
          [
            "Kartengruppierung",
            "fasst nahe Blitzmarker zusammen un hält de Koort übersichtlicher."
          ],
          [
            "Kompass: nächster Blitz",
            "richtet de Anzeige auf den nächstgelegenen erkannten Blitz."
          ],
          [
            "Geräteorientierung",
            "kann auf unterstützten Mobilgeräten de Geräteausrichtung einbeziehen."
          ],
          [
            "Kalibreren & Diagnose",
            "stellt Werkzeuge zur gezielten Prüfung, Vermessung un Fehleranalyse de Darstellung un einzelner Komponenten bereit. Dazu gehören unter anderem Kompass- un Medaillon-Kalibrierung, Diagnoseansichten sowie Testfunktionen wie de Gewittersimulation. Diese Werkzeuge sind för Einrichtung, Entwicklung un Fehlersuche gedacht un sollten im normalen Betrieb deaktiviert bleiben."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Anraadt Grundinstellen",
        "paragraphs": [
          "För en stabilen Start empfehlen wir:"
        ],
        "entries": [
          [
            "Testwerte · 500 km / 120 min / 200",
            "500 km Erfassungsradius, 120 Minuten Zeitfenster un 200 Blitzen sind Beispielwerte för den Test un keen zwingenden Vorgaben. Sie köönen abhängig vun Einsatzgebiet, gewünschter Beobachtungsreichweite un persönlicher Nutzung angepasst warrn."
          ],
          [
            "Steed & Tracker abstimmen",
            "De entsprechenden Einstellungen mööten ok in de Blitzortung-App passend hinterlegt warrn – sowohl beim dort konfigurierten Steed as ok för den vun Gewitterradar verwendeten Tracker. Bloots so arbeiten Datenbereich un Darstellung konsistent zusammen."
          ],
          [
            "Radien abstimmen",
            "Den Quellradius de Blitzortung-Datenquelle mindestens so groß wie den Gewitterradar-Beobachtungsradius einstellen."
          ],
          [
            "Aktiv lassen",
            "Kartengruppierung un Warnanimation eingeschaltet lassen."
          ],
          [
            "Optional",
            "Aura-Effekte nach persönlichem Geschmack einstellen; sie beeinflussen de Erkennung nich. Geräteorientierung bloots aktivieren, wenn sie auf dem verwendeten Mobilgerät benötigt warrt."
          ],
          [
            "Normalbetrieb",
            "Werkzeuge ut „Kalibrierung & Diagnose“, insbesondere de Gewittersimulation, im normalen Betrieb deaktiviert lassen."
          ],
          [
            "Recorder – unbedingt pröven",
            "Recorder-Ausschlüsse för häufig aktualisierte Blitz- un Positionsdaten pröven. Fehlen geeignete Ausschlüsse, köönen Home-Assistant-Datenbank un Backups sehr schnell anwachsen. Details un YAML siehe „Home-Assistant-Recorder“."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Wenn wat nich stimmt",
        "entries": [
          [
            "Keen oder zu wenige Blitzen",
            "Status de Blitzortung-Datenquelle, Quellradius un verwendete Blitz-Entitäten pröven."
          ],
          [
            "Afstänn oder Richtungen wirken falsch",
            "Referenzstandort un Distanzeinheit pröven."
          ],
          [
            "Backup wasst bannig gau",
            "Fehlende Recorder-Ausschlüsse för häufig aktualisierte Blitz- un Positionsdaten köönen de Home-Assistant-Datenbank un dadurch ok Backups sehr schnell vergrößern. Recorder-Einstellungen pröven; Details un YAML siehe „Home-Assistant-Recorder“."
          ],
          [
            "Sprachauswahl erscheint jümmers wieder",
            "Pröven, ob dat aktuelle Gewitterradar-Package installiert is un de Initialisierungshelfer vorhanden is."
          ],
          [
            "Dorstellen na Update nich ännert",
            "Browser-/App-Cache vollständig neu laden un sicherstellen, dass de aktuelle JavaScript-Datei bruukt warrt."
          ],
          [
            "Merkwürdiges Verhalten oder doppelte Koort",
            "In Home Assistant dörv bloots EINE Gewitterradar-Modulressource aktiv wesen. Native Integration un Dashboard-/HACS-Ressource dürfen nich gleichzeitig dieselbe Custom Card registrieren."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home-Assistant-Recorder",
        "paragraphs": [
          "Blitzdaten köönen sehr viele Zustandsänderungen erzeugen. För en langfristig schlanken Recorder empfehlen wir, de folgenden Entitäten bzw. Entitätsmuster auszuschließen."
        ],
        "recorder": true,
        "notes": [
          "Falls al en recorder:-Abschnitt existiert, diese Einträge dort ergänzen. Keinen zweiten Top-Level-recorder:-Block anlegen.",
          "De Ausschlüsse deaktivieren NICHT de Live-Zustände för Gewitterradar.",
          "Bereits vorhandene historische Daten warrn dadurch nich automatisch gelöscht.",
          "De Wildcards unterstützen mehr Blitzortung-Geräte bzw. Beobachtungspunkte unabhängig vom Entity-Präfix."
        ]
      }
    ]
  },
  "Sächs’sch": {
    "menuTitle": "Hilche & Hinweese",
    "title": "Hilche & Hinweese",
    "subtitle": "Gorz erklärt, damidd Gewitterradar zuverlässig un nachvollziehbar looft.",
    "close": "Hilche zumachn",
    "copy": "YAML kopiern",
    "copied": "Kopierd",
    "copyFailed": "Kopiern gehd nich – bidde den Code markiern.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Voraussetzungen",
        "paragraphs": [
          "Gewitterradar verarbeitet de Blitzdaten, de Home Assistant von dr verwendeten Blitzortung-Datenquelle erhält. Prüfe dort den richtigen Referenzstandort un stelle den Quellradius mindestens so groß wie den Beobachtungsradius in Gewitterradar een. Gewitterradar kann keene Blitze anzeigen odder auswerten, de von dr Datenquelle schon herausgefiltert wurden."
        ],
        "notes": [
          "Wenn mehrere Blitzortung-Geräte odder Beobachtungspunkte vorhanden sin, müssn de verwendeten Entitäten eindeutig zum gewünschten Referenzpunkt passen."
        ]
      },
      {
        "key": "radii",
        "title": "De Radien",
        "paragraphs": [
          "De Radien bauen aufeinander auf: Een Blitz im Gefahrenradius zählt gleichzeitig zum Gewitter- un Beobachtungsradius. De Bereiche sin Entfernungsschwellen, keene voneinander getrennten Datenquellen."
        ],
        "items": [
          "Beobachdungsradius – dr äußere Bereich fürs frühe Beobachdn.",
          "Gewidderradius – dr nähere Bereich, wo de besser uffbassn sollst.",
          "Gefahrenradius – dr direkte Nahbereich mit besonders hoher Wischdschkeid."
        ],
        "notes": [
          "Dr Gefahrenradius is auf maximal 250 km begrenzt. Hinweese zu empfohlenen Ausgangswerten un zur erforderlichen Abstimmung mit dr Blitzortung-App findest du unter „Empfohlene Grundeinstellungen“."
        ]
      },
      {
        "key": "location",
        "title": "Standord & gespeicherde Orde",
        "paragraphs": [
          "Dr gewählte Ord is dr Bezugspunkt, von dem Gewitterradar Entfernungn un Richtungen berechnet. De Ortsbibliothek liegt lokal in Home Assistant; gespeicherd werdn Name un Koordinaten des gewählten Ortes."
        ],
        "entries": [
          [
            "Standord",
            "Für de weltweite Ordssuche verwendet de Dashboard-/Package-Variante von V4.07 device_tracker.gewitterradar_dashboard. Damit auch de Blitzdaten dem gewählten Ord folgen, muss de Blitzortung-Integration denselben Tracker als Standortquelle verwendn."
          ],
          [
            "Blitzortung einrichten",
            "Einstellungen → Geräte & Dienste → Blitzortung → Eintrag hinzufügen. Als Konfigurationstyp „Location entity“ wählen un anschließend „Gewitterradar Dashboard“ als Standord-Entität auswählen. Een vorhandener Eintrag mit festen Breiten-/Längengraden lässt sich über „Neu konfigurieren“ nich auf eene Standord-Entität umstellen. In diesem Fall een neuen Eintrag anlegen, prüfn un den alten Koordinaten-Eintrag erst danach deaktivieren odder löschen."
          ],
          [
            "Ord übernähm",
            "„Übernähm“ setzt den gewählten Ord sofort als Bezugsord, schließt de Ordssuche und fährt de Karte direkt zum neuen Standord."
          ],
          [
            "Speicherliste einrichten",
            "Einstellungen → Geräte & Dienste → Integration hinzufügen → nach „Local to-do“ suchen un de Integration auswählen. Als Listenname exakt „Gewitterradar Orde“ vergeben un de Einrichtung abschließen."
          ],
          [
            "Gespeicherte Orde",
            "★ Speichern legt gefundene Orde dauerhaft lokal ab. Sie erscheinen im Standortmenü unter „Gespeicherte Orde“ un könn ohne erneute Ordssuche verwendet werdn. Mit × wird een Ord nich sofort gelöscht, sondern zur Löschung vorgemerkt. Unter „Entfernte Orde“ stellt ↶ ihn jederzeit wieder her; Koordinaten un Metadaten bleiben erhalten."
          ]
        ],
        "notes": [
          "Een Kartenwechsel allein beweist nich, dass Blitzortung seine Live-Datenregion schon umgestellt hat. Bei dr nativen Integration wird statt des Dashboard-Trackers device_tracker.gewitterradar verwendet."
        ]
      },
      {
        "key": "external_services",
        "title": "Exderne Diensde & Netzwerkzugriffe",
        "paragraphs": [
          "Gewitterradar hot zwei getrennte Netzwerkpfade: Karte un Ordssuche gehen vom Endgerät/Companion App raus, Blitzortung-Live-Daten holt dagegen de Blitzortung-Integration aufm Home-Assistant-Server. Firewall, VLAN, Proxy, DNS-Filter un TLS-Inspection müssn drum getrennt geprüft werdn.",
          "De folgenden Ziele sin dr grade V4.07-Laufzeitbestand. Ortsbibliothek, Tracker un Home-Assistant-Services laufen lokal un brauchen dafür keen Internet."
        ],
        "entries": [
          [
            "Client · Open-Meteo Geocoding",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · primäre weltweite Ord-/PLZ-Suche; sendet Suchbegriff, Sprache un bloß bei explizitem Länderfilter den ISO-Code. Bei Fehler folgt Nominatim."
          ],
          [
            "Client · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · Rückfall; sendet Suchbegriff, Sprache un ggf. ISO-Code. Öffentliche Aufrufe ham mindestens eene Sekunde Abstand; lokale Länder-Autovervollständigung macht keene Netzaufrufe. Sin beide blockiert, bleiben gespeicherte Orde lokal nutzbar."
          ],
          [
            "Client · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · lädt Leaflet 1.9.4 JavaScript/CSS. Ohne vorhandenes Leaflet verhindert eene Sperre den Kartenstart."
          ],
          [
            "Client · OpenStreetMap-Kacheln",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · Grundkartenkacheln. Bei Sperre könn Gewitterradar-Daten da sein, aber de Grundkarte bleibt leer/unvollständig."
          ],
          [
            "Server · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · ausgehend vom Home-Assistant-Server. Blitzortung v1.7.1 nutzt Broker/Geohash-Themen für Live-Blitze; Sperre stoppt neue Live-Daten, nich Ordssuche/Karte."
          ],
          [
            "Lokal · keene externe Freigabe",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, Koordinatenservice, Dashboard-Script un Local-to-do-Liste “Gewitterradar Orde” laufen lokal."
          ],
          [
            "Installation / Aktualisierung",
            "GitHub/HACS sin für Installation/Aktualisierung da, nich Laufzeitabhängigkeit dr geöffneten Karte."
          ],
          [
            "Schnelldiagnose",
            "Ordssuche kaputt: Open-Meteo/Nominatim prüfn. Karte startet nich: unpkg.com. Grundkarte leer: OSM-Kachelhosts. Blitze fehlen/alt: blitzortung.ha.sed.pl:1883 un Blitzortung-Integration prüfn."
          ]
        ],
        "notes": [
          "DNS muss auf Endgerät un Home-Assistant-Server für de jeweils nötigen Ziele funktionieren.",
          "HTTPS-Proxy, TLS-Inspection, Filter, Blocker odder Browser-Erweiterungen könn trotz TCP 443 Anfragen sperren; bei Geocoding auch CORS/Antwortfilter prüfn.",
          "Datenschutz: Geocoding erhält Suchbegriff/Parameter, OSM-Kacheln verraten technisch den betrachteten Kartenausschnitt un dr Blitzortung-Broker erhält abonnierte Regions-/Geohash-Themen.",
          "http://www.w3.org/2000/svg is bloß dr SVG-Namensraum un keen externer Netzwerkaufruf.",
          "S Laufzeitinventar is automatisiert abgesichert: een neues festes externes URL-Ziel soll den Test brechen, bis Doku un Freigaben aktualisiert sin."
        ]
      },
      {
        "key": "functions",
        "title": "Wicht’sche Funktionen",
        "entries": [
          [
            "Aura-Effekte",
            "visualisieren Blitzaktivität, verändern aber nich de Erkennung odder Zählung."
          ],
          [
            "Warnanimation",
            "hebt wischdsche Gewidderaktivität sichtbar raus."
          ],
          [
            "Kartengruppierung",
            "fasst nahe Blitzmarker zusammen un hält de Karte übersichtlicher."
          ],
          [
            "Kompass: nächster Blitz",
            "richtet de Anzeige auf den nächstgelegenen erkannten Blitz."
          ],
          [
            "Geräteorientierung",
            "kann auf unterstützten Mobilgeräten de Geräteausrichtung einbeziehen."
          ],
          [
            "Kalibrierung & Diagnose",
            "stellt Werkzeuge zur gezielten Prüfung, Vermessung un Fehleranalyse dr Darstellung un einzelner Komponenten bereit. Dazu gehören unter anderem Kompass- un Medaillon-Kalibrierung, Diagnoseansichten sowie Testfunktionen wie de Gewittersimulation. Diese Werkzeuge sin für Einrichtung, Entwicklung un Fehlersuche gedacht un sollten im normalen Betrieb deaktiviert bleiben."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Empfohlene Grundeinstellungen",
        "paragraphs": [
          "Für een stabilen Start empfehlen wir:"
        ],
        "entries": [
          [
            "Testwerte · 500 km / 120 min / 200",
            "500 km Erfassungsradius, 120 Minuten Zeitfenster un 200 Blitze sin Beispielwerte für den Test un keene zwingenden Vorgaben. Sie könn abhängig von Einsatzgebiet, gewünschter Beobachtungsreichweite un persönlicher Nutzung angepasst werdn."
          ],
          [
            "Standord & Tracker abstimmen",
            "De entsprechenden Einstellungen müssn auch in dr Blitzortung-App passend hinterlegt werdn – sowohl beim dort konfigurierten Standord als auch für den von Gewitterradar verwendeten Tracker. Bloß so arbeiten Datenbereich un Darstellung konsistent zusammen."
          ],
          [
            "Radien abstimmen",
            "Den Quellradius dr Blitzortung-Datenquelle mindestens so groß wie den Gewitterradar-Beobachtungsradius einstellen."
          ],
          [
            "Aktiv lassen",
            "Kartengruppierung un Warnanimation eingeschaltet lassen."
          ],
          [
            "Optional",
            "Aura-Effekte nach persönlichem Geschmack einstellen; sie beeinflussen de Erkennung nich. Geräteorientierung bloß aktivieren, wenn sie auf dem verwendeten Mobilgerät benötigt wird."
          ],
          [
            "Normalbetrieb",
            "Werkzeuge aus „Kalibrierung & Diagnose“, insbesondere de Gewittersimulation, im normalen Betrieb deaktiviert lassen."
          ],
          [
            "Recorder – unbedingt prüfn",
            "Recorder-Ausschlüsse für häufig aktualisierte Blitz- un Positionsdaten prüfn. Fehlen geeignete Ausschlüsse, könn Home-Assistant-Datenbank un Backups sehr schnell anwachsen. Details un YAML siehe „Home-Assistant-Recorder“."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Wenn was nich stimmt",
        "entries": [
          [
            "Keene odder zu wenige Blitze",
            "Status dr Blitzortung-Datenquelle, Quellradius un verwendete Blitz-Entitäten prüfn."
          ],
          [
            "Entfernungn odder Richtungen wirken falsch",
            "Referenzstandort un Distanzeinheit prüfn."
          ],
          [
            "Backup wächst ungewöhnlich schnell weider",
            "Fehlende Recorder-Ausschlüsse für häufig aktualisierte Blitz- un Positionsdaten könn de Home-Assistant-Datenbank un dadurch auch Backups sehr schnell vergrößern. Recorder-Einstellungen prüfn; Details un YAML siehe „Home-Assistant-Recorder“."
          ],
          [
            "Sprachauswahl gommd immer wieder",
            "Prüfn, ob s grade Gewitterradar-Package installiert is un dr Initialisierungshelfer vorhanden is."
          ],
          [
            "Darstellung nachm Update unveränderd",
            "Browser-/App-Cache vollständig neu laden un sicherstellen, dass de grade JavaScript-Datei verwendet wird."
          ],
          [
            "Merkwürdiges Verhalten odder doppelte Karte",
            "In Home Assistant derf bloß EINE Gewitterradar-Modulressource aktiv sein. Native Integration un Dashboard-/HACS-Ressource dürfen nich gleichzeitig dieselbe Custom Card registrieren."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home-Assistant-Recorder",
        "paragraphs": [
          "Blitzdaten könn sehr viele Zustandsänderungen erzeugen. Für een langfristig schlanken Recorder empfehlen wir, de folgenden Entitäten bzw. Entitätsmuster auszuschließen."
        ],
        "recorder": true,
        "notes": [
          "Falls schon een recorder:-Abschnitt existiert, diese Einträge dort ergänzen. Keinen zweiten Top-Level-recorder:-Block anlegen.",
          "De Ausschlüsse deaktivieren NICHT de Live-Zustände für Gewitterradar.",
          "Bereits vorhandene historische Daten werdn dadurch nich automatisch gelöscht.",
          "De Wildcards unterstützen mehrere Blitzortung-Geräte bzw. Beobachtungspunkte unabhängig vom Entity-Präfix."
        ]
      }
    ]
  },
  "Schwäbisch": {
    "menuTitle": "Hilf & Hinweis",
    "title": "Hilf & Hinweis",
    "subtitle": "Kurz erklärt, dass s Gewitterradar zuverlässig ond nachvollziehbar lauft.",
    "close": "Hilf zumacha",
    "copy": "YAML kopiera",
    "copied": "Kopiert",
    "copyFailed": "Kopiera goht net – bitte dr Code markiera.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Voraussetzungen",
        "paragraphs": [
          "Gewitterradar verarbeitet d Blitzdaten, d Home Assistant von dr verwendeten Blitzortung-Datenquelle erhält. Prüfe dort den richtigen Referenzstandort ond stelle den Quellradius mindestens so groß wie den Beobachtungsradius in Gewitterradar a. Gewitterradar kann koi Blitz anzeigen oder auswerten, d von dr Datenquelle scho herausgefiltert wurden."
        ],
        "notes": [
          "Wenn mehrere Blitzortung-Geräte oder Beobachtungspunkte vorhanden send, müsset d verwendeten Entitäten eindeutig zum gewünschten Referenzpunkt passen."
        ]
      },
      {
        "key": "radii",
        "title": "D’Radien",
        "paragraphs": [
          "D Radien bauen aufeinander auf: A Blitz im Gefahrenradius zählt gleichzeitig zum Gewitter- ond Beobachtungsradius. D Bereiche send Entfernungsschwellen, koi voneinander getrennten Datenquellen."
        ],
        "items": [
          "Beobachtungsradius – dr äußere Bereich fürs frühe Beobachta.",
          "Gewitterradius – dr nähere Bereich, do sollt mr bsunders uffpassa.",
          "Gefahrenradius – dr direkte Nahbereich mit bsunders hoher Bedeutung."
        ],
        "notes": [
          "Dr Gefahrenradius isch auf maximal 250 km begrenzt. Hinweis zu empfohlenen Ausgangswerten ond zur erforderlichen Abstimmung mit dr Blitzortung-App findest du unter „Empfohlene Grundeinstellungen“."
        ]
      },
      {
        "key": "location",
        "title": "Standort & gspeicherte Ort",
        "paragraphs": [
          "Dr gewählte Ort isch dr Bezugspunkt, von dem Gewitterradar Entfernunga ond Richtunga berechnet. D Ortsbibliothek liegt lokal in Home Assistant; gspeichert werdet Name ond Koordinaten des gewählten Ortes."
        ],
        "entries": [
          [
            "Standort",
            "Für d weltweite Ortssuche benutzt d Dashboard-/Package-Variante von V4.07 device_tracker.gewitterradar_dashboard. Damit auch d Blitzdaten dem gewählten Ort folgen, muss d Blitzortung-Integration denselben Tracker als Standortquelle verwenden."
          ],
          [
            "Blitzortung einrichten",
            "Einstellungen → Geräte & Dienste → Blitzortung → Eintrag hinzufügen. Als Konfigurationstyp „Location entity“ wählen ond anschließend „Gewitterradar Dashboard“ als Standort-Entität auswählen. A vorhandener Eintrag mit festen Breiten-/Längengraden lässt sich über „Neu konfigurieren“ net auf a Standort-Entität umstellen. In diesem Fall an neuen Eintrag anlegen, prüfa ond den alten Koordinaten-Eintrag erst danach deaktivieren oder löschen."
          ],
          [
            "Ort übernemma",
            "„Übernemma“ setzt dr gwählte Ort direkt als Bezugsort, schließt d Ortssuach ond fährt d Karte direkt zum neie Standort."
          ],
          [
            "Speicherliste einrichten",
            "Einstellungen → Geräte & Dienste → Integration hinzufügen → nach „Local to-do“ suacha ond d Integration auswählen. Als Listenname exakt „Gewitterradar Orte“ vergeben ond d Einrichtung abschließen."
          ],
          [
            "Gespeicherte Orte",
            "★ Speichra legt gefundene Orte dauerhaft lokal ab. Sie erscheinen im Standortmenü unter „Gespeicherte Orte“ ond könnet ohne erneute Ortssuche benutzt werdet. Mit × wird a Ort net sofort gelöscht, sondern zur Löschung vorgemerkt. Unter „Entfernte Orte“ stellt ↶ ihn jederzeit wieder her; Koordinaten ond Metadaten bleiben erhalten."
          ]
        ],
        "notes": [
          "A Kartenwechsel allein beweist net, dass Blitzortung seine Live-Datenregion scho umgestellt hot. Bei dr nativen Integration wird statt des Dashboard-Trackers device_tracker.gewitterradar benutzt."
        ]
      },
      {
        "key": "external_services",
        "title": "Externe Dienschd & Netzwerkzugriff",
        "paragraphs": [
          "Gewitterradar hot zwei getrennte Netzwerkpfade: Karte ond Ortssuche gehen vom Endgerät/Companion App raus, Blitzortung-Live-Daten holt dagegen d Blitzortung-Integration aufm Home-Assistant-Server. Firewall, VLAN, Proxy, DNS-Filter ond TLS-Inspection müsset drum getrennt geprüft werdet.",
          "D folgenden Ziele send dr gradige V4.07-Laufzeitbestand. Ortsbibliothek, Tracker ond Home-Assistant-Services laufen lokal ond brauchen dafür koi Internet."
        ],
        "entries": [
          [
            "Client · Open-Meteo Geocoding",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · primäre weltweite Ort-/PLZ-Suach; sendet Suchbegriff, Sprache ond bloß bei explizitem Länderfilter den ISO-Code. Bei Fehler folgt Nominatim."
          ],
          [
            "Client · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · Rückfall; sendet Suchbegriff, Sprache ond ggf. ISO-Code. Öffentliche Aufrufe hen mindestens a Sekunde Abstand; lokale Länder-Autovervollständigung macht koi Netzaufrufe. Send beide blockiert, bleiben gespeicherte Orte lokal nutzbar."
          ],
          [
            "Client · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · lädt Leaflet 1.9.4 JavaScript/CSS. Ohne vorhandenes Leaflet verhindert a Sperre den Kartenstart."
          ],
          [
            "Client · OpenStreetMap-Kacheln",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · Grundkartenkacheln. Bei Sperre könnet Gewitterradar-Daten da sei, aber d Grundkarte bleibt leer/unvollständig."
          ],
          [
            "Server · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · ausgehend vom Home-Assistant-Server. Blitzortung v1.7.1 nutzt Broker/Geohash-Themen für Live-Blitz; Sperre stoppt neue Live-Daten, net Ortssuche/Karte."
          ],
          [
            "Lokal · koi externe Freigabe",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, Koordinatenservice, Dashboard-Script ond Local-to-do-Liste “Gewitterradar Orte” laufen lokal."
          ],
          [
            "Installation / Aktualisierung",
            "GitHub/HACS send für Installation/Aktualisierung da, net Laufzeitabhängigkeit dr geöffneten Karte."
          ],
          [
            "Schnelldiagnose",
            "Ortssuche kaputt: Open-Meteo/Nominatim prüfa. Karte startet net: unpkg.com. Grundkarte leer: OSM-Kachelhosts. Blitz fehlen/alt: blitzortung.ha.sed.pl:1883 ond Blitzortung-Integration prüfa."
          ]
        ],
        "notes": [
          "DNS muss auf Endgerät ond Home-Assistant-Server für d jeweils nötigen Ziele funktionieren.",
          "HTTPS-Proxy, TLS-Inspection, Filter, Blocker oder Browser-Erweiterungen könnet trotz TCP 443 Anfragen sperren; bei Geocoding auch CORS/Antwortfilter prüfa.",
          "Datenschutz: Geocoding erhält Suchbegriff/Parameter, OSM-Kacheln verraten technisch den betrachteten Kartenausschnitt ond dr Blitzortung-Broker erhält abonnierte Regions-/Geohash-Themen.",
          "http://www.w3.org/2000/svg isch bloß dr SVG-Namensraum ond koi externer Netzwerkaufruf.",
          "S Laufzeitinventar isch automatisiert abgesichert: a neues festes externes URL-Ziel soll den Test brechen, bis Doku ond Freigaben aktualisiert send."
        ]
      },
      {
        "key": "functions",
        "title": "Wichtige Funktionen",
        "entries": [
          [
            "Aura-Effekte",
            "visualisieren Blitzaktivität, verändern aber net d Erkennung oder Zählung."
          ],
          [
            "Warnanimation",
            "hebt wichtige Gewitteraktivität sichtbar raus."
          ],
          [
            "Kartengruppierung",
            "fasst nahe Blitzmarker zusammen ond hält d Karte übersichtlicher."
          ],
          [
            "Kompass: nächster Blitz",
            "richtet d Anzeige auf den nächstgelegenen erkannten Blitz."
          ],
          [
            "Geräteorientierung",
            "kann auf unterstützten Mobilgeräten d Geräteausrichtung einbeziehen."
          ],
          [
            "Kalibrierung & Diagnose",
            "stellt Werkzeuge zur gezielten Prüfung, Vermessung ond Fehleranalyse dr Darstellung ond einzelner Komponenten bereit. Dazu gehören unter anderem Kompass- ond Medaillon-Kalibrierung, Diagnoseansichten sowie Testfunktionen wie d Gewittersimulation. Diese Werkzeuge send für Einrichtung, Entwicklung ond Fehlersuche gedacht ond sollten im normalen Betrieb deaktiviert bleiben."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Empfohlene Grundeinstellungen",
        "paragraphs": [
          "Für an stabilen Start empfehlen wir:"
        ],
        "entries": [
          [
            "Testwerte · 500 km / 120 min / 200",
            "500 km Erfassungsradius, 120 Minuten Zeitfenster ond 200 Blitz send Beispielwerte für den Test ond koi zwingenden Vorgaben. Sie könnet abhängig von Einsatzgebiet, gewünschter Beobachtungsreichweite ond persönlicher Nutzung angepasst werdet."
          ],
          [
            "Standort & Tracker abstimmen",
            "D entsprechenden Einstellungen müsset auch in dr Blitzortung-App passend hinterlegt werdet – sowohl beim dort konfigurierten Standort als auch für den von Gewitterradar verwendeten Tracker. Bloß so arbeiten Datenbereich ond Darstellung konsistent zusammen."
          ],
          [
            "Radien abstimmen",
            "Den Quellradius dr Blitzortung-Datenquelle mindestens so groß wie den Gewitterradar-Beobachtungsradius einstellen."
          ],
          [
            "Aktiv lassen",
            "Kartengruppierung ond Warnanimation eingeschaltet lassen."
          ],
          [
            "Optional",
            "Aura-Effekte nach persönlichem Geschmack einstellen; sie beeinflussen d Erkennung net. Geräteorientierung bloß aktivieren, wenn sie auf dem verwendeten Mobilgerät benötigt wird."
          ],
          [
            "Normalbetrieb",
            "Werkzeuge aus „Kalibrierung & Diagnose“, insbesondere d Gewittersimulation, im normalen Betrieb deaktiviert lassen."
          ],
          [
            "Recorder – unbedingt prüfa",
            "Recorder-Ausschlüsse für häufig aktualisierte Blitz- ond Positionsdaten prüfa. Fehlen geeignete Ausschlüsse, könnet Home-Assistant-Datenbank ond Backups sehr schnell anwachsen. Details ond YAML siehe „Home-Assistant-Recorder“."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Wenn ebbes net stimmt",
        "entries": [
          [
            "Koi oder zu wenige Blitz",
            "Status dr Blitzortung-Datenquelle, Quellradius ond verwendete Blitz-Entitäten prüfa."
          ],
          [
            "Entfernunga oder Richtunga wirken falsch",
            "Referenzstandort ond Distanzeinheit prüfa."
          ],
          [
            "Backup wächst arg schnell",
            "Fehlende Recorder-Ausschlüsse für häufig aktualisierte Blitz- ond Positionsdaten könnet d Home-Assistant-Datenbank ond dadurch auch Backups sehr schnell vergrößern. Recorder-Einstellungen prüfa; Details ond YAML siehe „Home-Assistant-Recorder“."
          ],
          [
            "Sprachauswahl kommt emmer wieder",
            "Prüfa, ob s gradige Gewitterradar-Package installiert isch ond dr Initialisierungshelfer vorhanden isch."
          ],
          [
            "Darstellung nachm Update unverändert",
            "Browser-/App-Cache vollständig neu laden ond sicherstellen, dass d gradige JavaScript-Datei benutzt wird."
          ],
          [
            "Komischs Verhalta oder doppelte Karta",
            "In Home Assistant derf bloß EINE Gewitterradar-Modulressource aktiv sei. Native Integration ond Dashboard-/HACS-Ressource dürfen net gleichzeitig dieselbe Custom Card registrieren."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home-Assistant-Recorder",
        "paragraphs": [
          "Blitzdaten könnet sehr viele Zustandsänderungen erzeugen. Für an langfristig schlanken Recorder empfehlen wir, d folgenden Entitäten bzw. Entitätsmuster auszuschließen."
        ],
        "recorder": true,
        "notes": [
          "Falls scho a recorder:-Abschnitt existiert, diese Einträge dort ergänzen. Keinen zweiten Top-Level-recorder:-Block anlegen.",
          "D Ausschlüsse deaktivieren NICHT d Live-Zustände für Gewitterradar.",
          "Bereits vorhandene historische Daten werdet dadurch net automatisch gelöscht.",
          "D Wildcards unterstützen mehrere Blitzortung-Geräte bzw. Beobachtungspunkte unabhängig vom Entity-Präfix."
        ]
      }
    ]
  }
};

export const HELP_EXTERNAL_LOCALES_V40753 = {
  "Dansk": {
    "menuTitle": "Hjælp & bemærkninger",
    "title": "Hjælp & bemærkninger",
    "subtitle": "En kort vejledning, så Gewitterradar fungerer pålideligt og er let at forstå.",
    "close": "Luk hjælp",
    "copy": "Kopiér YAML",
    "copied": "Kopieret",
    "copyFailed": "Kopiering er ikke mulig – markér koden.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Forudsætninger",
        "paragraphs": [
          "Gewitterradar behandler de lyndata, som Home Assistant modtager fra den konfigurerede lyndetektionskilde. Kontrollér det korrekte referencested dér, og sæt kilderadius mindst lige så stor som observationsradius i Gewitterradar. Gewitterradar kan ikke vise eller vurdere lyn, som kilden allerede har filtreret fra."
        ],
        "notes": [
          "Hvis der findes flere lyndetektorer eller observationspunkter, skal de anvendte entiteter entydigt høre til det ønskede referencepunkt."
        ]
      },
      {
        "key": "radii",
        "title": "Radierne",
        "paragraphs": [
          "Radierne er kumulative: Et lyn i fareradius tæller også i tordenvejrs- og observationsradius. Områderne er afstandsgrænser, ikke separate datakilder.",
          "Under „Klyngeopløsning“ vælger du, hvornår klynger opløses til enkelte lyn, når du zoomer ind. Tidlig opløser tidligere, Afbalanceret bruger den hidtidige zoneafhængige V4.08-indstilling, og Sen holder klynger samlet længere."
        ],
        "items": [
          "Observationsradius – ydre område til tidlig observation.",
          "Tordenvejrsradius – nærmere område, der kræver øget opmærksomhed.",
          "Fareradius – umiddelbart nærområde med særlig høj relevans."
        ],
        "notes": [
          "Fareradius er begrænset til højst 250 km. Se “Anbefalede grundindstillinger” for anbefalede startværdier og den nødvendige koordinering med Blitzortung-appen."
        ],
        "featureBlocks": [
          {
            "title": "Klyngenavigation · sessionstid",
            "body": "bestemmer, hvor længe en startet klyngenavigation forbliver aktiv. Nedtællingstiden kan frit indstilles mellem 5 og 3600 sekunder. {{INFINITY}} holder sessionen åben uden tidsbegrænsning. Nedtælling og {{INFINITY}} kan skiftes direkte i statusvisningen under navigationen.",
            "infinityAlt": "Ubegrænset"
          }
        ]
      },
      {
        "key": "location",
        "title": "Placering & gemte steder",
        "paragraphs": [
          "Det valgte sted er referencepunktet, som Gewitterradar bruger til at beregne afstande og retninger. Med den verdensomspændende stedssøgning eller direkte indtastning af koordinater kan dette referencepunkt fastlægges uafhængigt af Home Assistants faktiske placering. Gemte steder lagres lokalt i Home Assistant."
        ],
        "entries": [
          [
            "Placeringstracker & Blitzortung",
            "Gewitterradar bruger en virtuel placering som tracker for frit valgte steder. I Dashboard-/Package-varianten af V4.07 er det device_tracker.gewitterradar_dashboard; den native integration bruger device_tracker.gewitterradar. For at lyndataene skal følge den valgte virtuelle placering, skal Blitzortung-integrationen bruge den samme tracker som placeringskilde.\n↳ Opsæt Blitzortung:\nIndstillinger → Enheder & tjenester → Blitzortung → Tilføj post. Vælg „Location entity“ som konfigurationstype, og vælg derefter den relevante Gewitterradar-tracker som placeringsentitet. En eksisterende post med faste bredde-/længdegrader kan ikke ændres til en placeringsentitet via „Omkonfigurer“. Opret i så fald en ny post, kontrollér den, og deaktivér eller slet først derefter den gamle koordinatpost."
          ],
          [
            "Verdensomspændende stedssøgning & koordinater",
            "Med den verdensomspændende stedssøgning kan steder og postnumre søges frem og bruges som referenceplacering. Alternativt kan en placering fastlægges direkte via bredde- og længdegrad. Betjeningen er opdelt i de to følgende måder:"
          ],
          [
            "↳ Anvend sted",
            "Anvend sætter straks det sted, der er valgt i den verdensomspændende stedssøgning, som referenceplacering, lukker automatisk stedssøgningen og flytter kortet direkte til den nye placering."
          ],
          [
            "↳ Indtast koordinater direkte",
            "På en computer kan koordinater i Google Maps kopieres via højreklik på det ønskede punkt og derefter indsættes under „Lat / Lon“. Alternativt kan koordinater findes via MapTiler Coordinates: https://www.maptiler.com/tools/coordinates/ . Eksempel (Lat / Lon): 53.837691, 9.956105. Gewitterradar bruger decimalgrader; en valgfri betegnelse kan angives."
          ],
          [
            "Opsæt liste til gemte steder",
            "For at steder eller koordinater kan gemmes og senere åbnes bekvemt via Gewitterradar-menuen, skal der én gang oprettes et lagerområde via Home Assistants To-do-funktion.\n↳ Opsætning:\nIndstillinger → Enheder & tjenester → Tilføj integration → søg efter „Local To-do“, og vælg integrationen. Angiv præcis „Gewitterradar Orte“ som listenavn, og afslut opsætningen."
          ],
          [
            "Gemte steder",
            "★ Gem lagrer fundne steder permanent lokalt. De vises i placeringsmenuen under „Gemte steder“ og kan bruges uden en ny stedssøgning. × sletter ikke et sted med det samme, men markerer det til fjernelse. Under „Fjernede steder“ gendanner ↶ stedet når som helst; koordinater og metadata bevares."
          ]
        ],
        "notes": [
          "At kortet flytter sig, beviser ikke i sig selv, at Blitzortung allerede har skiftet sit live-dataområde. Den native integration bruger device_tracker.gewitterradar i stedet for Dashboard-trackeren."
        ]
      },
      {
        "key": "mapview",
        "title": "Kortvisninger & 3D-lagknap",
        "layerGraphic": true,
        "layerGraphicAlt": "3D-lagknap i guld, blå og rød",
        "layerGraphicCaption": "Med lagvælgeren kan kortvisningen når som helst skiftes mellem Standard, Stor og Fuld skærm.",
        "paragraphs": [],
        "entries": [
          [
            "Standard",
            "Bruger den normale korthøjde i Gewitterradar-kortet."
          ],
          [
            "Stor",
            "Forstørrer kortet i dashboardet og giver mere kortplads uden at åbne fuldskærmstilstand."
          ],
          [
            "Fuld skærm",
            "Åbner kortet i fuldskærmsvisning. Lokationspillen, kompasset, medaljonen, signaturforklaringen og kortbetjeningen er fortsat tilgængelige."
          ],
          [
            "Kortvisning i Indstillinger",
            "Området „Kortvisning“ styrer standardvisningen for denne enhed eller browserprofil samt det separate kortvindue."
          ],
          [
            "Standardvisning",
            "Bestemmer, om Gewitterradar starter med Standard, Stor, Fuld skærm eller den senest anvendte kortvisning. Valget gemmes kun lokalt på den aktuelle enhed eller i den anvendte browserprofil."
          ],
          [
            "Separat kortvindue",
            "Åbner tordenvejrsvisningen med det aktuelt valgte kort og det aktuelt valgte kompas i et separat vindue. Den normale dashboardvisning forbliver adskilt. Funktionen er tilgængelig via menuen Indstillinger."
          ]
        ],
        "notes": []
      },
      {
        "key": "external_services",
        "title": "Eksterne tjenester & netværksadgang",
        "paragraphs": [
          "Gewitterradar har to netværksveje: kort og stedssøgning går direkte fra browser/Companion App, mens Blitzortung-live-data hentes af Blitzortung-integrationen på Home Assistant-serveren. Firewall, VLAN, proxy, DNS-filter og TLS-inspektion skal derfor vurderes separat for begge veje.",
          "Følgende mål er det aktuelle V4.07-runtimeinventar. Den lokale stedsliste, trackeren og Home Assistant-tjenesterne kræver ingen internetadgang."
        ],
        "entries": [
          [
            "Klient · Open-Meteo geokodning",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · primær global sted-/postnummersøgning; sender søgetekst, sprog og kun ved eksplicit landefilter ISO-koden. Ved fejl bruges Nominatim."
          ],
          [
            "Klient · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · reserve til stedssøgning; sender søgetekst, sprog og evt. ISO-kode. Offentlige kald holdes mindst ét sekund fra hinanden, og lokal landeautofuldførelse laver ingen netværkskald. Hvis begge geokodningstjenester er blokeret, virker gemte steder stadig lokalt."
          ],
          [
            "Klient · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · leverer Leaflet 1.9.4 JavaScript/CSS. Uden cachet Leaflet kan kortet ikke starte, hvis værten blokeres."
          ],
          [
            "Klient · OpenStreetMap-kortfliser",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · grundkortfliser. Ved blokering kan data stadig findes, men grundkortet bliver tomt eller ufuldstændigt."
          ],
          [
            "Server · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · udgående fra Home Assistant-serveren. Blitzortung v1.7.1 bruger brokerens geohash-emner til live-lyn; blokering stopper nye live-data, men ikke stedssøgning/kort."
          ],
          [
            "Lokalt · ingen ekstern adgang",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, koordinattjenesten, dashboard-scriptet og Local to-do-listen “Gewitterradar Orte” kører lokalt og kræver ingen ekstra internetdomæne."
          ],
          [
            "Installation / opdatering",
            "GitHub/HACS bruges til installation og opdatering, ikke som runtimeafhængighed for et åbent Gewitterradar-kort."
          ],
          [
            "Hurtig diagnose",
            "Stedssøgning fejler: kontrollér Open-Meteo/Nominatim. Kort starter ikke: kontrollér unpkg.com. Tomt grundkort: kontrollér OSM-fliseværter. Manglende/gamle lyn: kontrollér blitzortung.ha.sed.pl:1883 og Blitzortung-integrationen."
          ]
        ],
        "notes": [
          "DNS skal virke på både klient og Home Assistant-server for deres respektive mål.",
          "HTTPS-proxy, TLS-inspektion, indholdsfiltre, blokkere eller browserudvidelser kan blokere frontendkald trods åben TCP 443; ved geokodning skal CORS/svarfiltre også kontrolleres.",
          "Privatliv: geokodning modtager søgetekst/parametre, OSM-fliser afslører teknisk det viste kortområde, og Blitzortung-brokeren modtager de abonnerede regions-/geohash-emner.",
          "http://www.w3.org/2000/svg er kun SVG-navnerummet og ikke et eksternt netværkskald.",
          "Runtimeinventaret er automatiseret: nye faste eksterne URL-mål skal få testen til at fejle, indtil dokumentation og adgangsliste er opdateret."
        ]
      },
      {
        "key": "functions",
        "title": "Vigtige funktioner",
        "entries": [
          [
            "Auraeffekter",
            "visualiserer lynaktivitet, men ændrer ikke registrering eller optælling."
          ],
          [
            "Advarselsanimation",
            "fremhæver relevant tordenvejrsaktivitet visuelt."
          ],
          [
            "Kortgruppering",
            "samler nærliggende lynmarkører og holder kortet overskueligt."
          ],
          [
            "Kompas: nærmeste lyn",
            "retter visningen mod det nærmeste registrerede lyn."
          ],
          [
            "Enhedsretning",
            "kan bruge enhedens retning på understøttede mobilenheder."
          ],
          [
            "Separat kortvindue",
            "Åbner tordenvejrsvisningen med det aktuelt valgte kort og det aktuelt valgte kompas i et separat vindue. Den normale dashboardvisning forbliver adskilt. Funktionen er tilgængelig via menuen Indstillinger."
          ],
          [
            "Kalibrering og diagnosticering",
            "stiller værktøjer til målrettet kontrol, måling og fejlsøgning af visningen og enkelte komponenter til rådighed. Det omfatter bl.a. kalibrering af kompas og medaljon, diagnosevisninger og testfunktioner som tordenvejrssimulering. Værktøjerne er beregnet til opsætning, udvikling og fejlsøgning og bør være deaktiveret under normal drift."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Anbefalede grundindstillinger",
        "paragraphs": [
          "For en stabil start anbefaler vi:"
        ],
        "entries": [
          [
            "Testværdier · 500 km / 120 min / 200",
            "500 km registreringsradius, 120 minutters tidsvindue og 200 lyn er eksempler til test, ikke obligatoriske indstillinger. De kan tilpasses anvendelsesområde, ønsket observationsrækkevidde og personlige behov."
          ],
          [
            "Afstem sted & tracker",
            "Indstillingerne i Blitzortung skal passe til både det sted, der er konfigureret dér, og den tracker, Gewitterradar bruger. Så forbliver dataområde og visning konsistente."
          ],
          [
            "Afstem radier",
            "Sæt Blitzortungs kilderadius mindst lige så stor som Gewitterradars observationsradius."
          ],
          [
            "Lad være aktiveret",
            "Lad kortgruppering og advarselsanimation være slået til."
          ],
          [
            "Valgfrit",
            "Tilpas auraeffekter efter smag; de påvirker ikke registreringen. Aktivér kun enhedsretning, når den er nødvendig på den anvendte mobilenhed."
          ],
          [
            "Normal drift",
            "Lad værktøjerne under “Kalibrering og diagnosticering”, især tordenvejrssimulering, være deaktiveret under normal drift."
          ],
          [
            "Recorder – skal kontrolleres",
            "Kontrollér Recorder-undtagelser for ofte opdaterede lyn- og positionsdata. Uden egnede undtagelser kan Home Assistant-databasen og backups vokse meget hurtigt. Se “Home Assistant Recorder” for detaljer og YAML."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Hvis noget ikke virker",
        "entries": [
          [
            "Ingen eller for få lyn",
            "Kontrollér lyndetektionskildens status, kilderadius og de anvendte lynentiteter."
          ],
          [
            "Afstande eller retninger ser forkerte ud",
            "Kontrollér referencested og afstandsenhed."
          ],
          [
            "Backup vokser usædvanligt hurtigt",
            "Manglende Recorder-undtagelser for ofte opdaterede lyn- og positionsdata kan få Home Assistant-databasen og dermed backups til at vokse meget hurtigt. Kontrollér Recorder-indstillingerne; se “Home Assistant Recorder” for detaljer og YAML."
          ],
          [
            "Sprogvalget vises igen og igen",
            "Kontrollér, at den aktuelle Gewitterradar-pakke og initialiseringshjælperen er installeret."
          ],
          [
            "Visningen er uændret efter en opdatering",
            "Genindlæs browser-/app-cachen helt, og kontrollér, at den aktuelle JavaScript-fil bruges."
          ],
          [
            "Uventet adfærd eller dobbelt kort",
            "Kun ÉN Gewitterradar-modulressource må være aktiv i Home Assistant. Den native integration og Dashboard-/HACS-ressourcen må ikke registrere det samme brugerdefinerede kort samtidigt."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Lyndata kan skabe meget mange tilstandsændringer. For en slank Recorder-konfiguration på lang sigt anbefaler vi at udelukke følgende entiteter og entitetsmønstre."
        ],
        "recorder": true,
        "notes": [
          "Hvis der allerede findes en recorder:-sektion, skal posterne flettes ind dér. Opret ikke en anden recorder:-blok på topniveau.",
          "Udelukkelserne deaktiverer IKKE de live-tilstande, Gewitterradar bruger.",
          "Eksisterende historiske data fjernes ikke automatisk.",
          "Wildcard-mønstrene understøtter flere lyndetektorer eller observationspunkter uanset entitetspræfiks."
        ]
      }
    ]
  },
  "Español": {
    "menuTitle": "Ayuda y notas",
    "title": "Ayuda y notas",
    "subtitle": "Una guía breve para que Gewitterradar funcione de forma fiable y comprensible.",
    "close": "Cerrar ayuda",
    "copy": "Copiar YAML",
    "copied": "Copiado",
    "copyFailed": "No se puede copiar; selecciona el código.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Requisitos",
        "paragraphs": [
          "Gewitterradar procesa los datos de rayos que Home Assistant recibe de la fuente de detección configurada. Comprueba allí la ubicación de referencia correcta y ajusta el radio de la fuente como mínimo al radio de observación de Gewitterradar. Gewitterradar no puede mostrar ni evaluar rayos que la fuente ya haya filtrado."
        ],
        "notes": [
          "Si hay varios dispositivos de detección u observatorios, las entidades utilizadas deben pertenecer claramente al punto de referencia deseado."
        ]
      },
      {
        "key": "radii",
        "title": "Los radios",
        "paragraphs": [
          "Los radios son acumulativos: un rayo dentro del radio de peligro también cuenta dentro de los radios de tormenta y observación. Son umbrales de distancia, no fuentes de datos separadas.",
          "En «Resolución de clústeres» eliges cuándo se deshacen los clústeres en rayos individuales al acercar el mapa. Temprana los deshace antes, Equilibrada utiliza el ajuste zonal de V4.08 probado hasta ahora y Tardía mantiene los clústeres agrupados durante más tiempo."
        ],
        "items": [
          "Radio de observación – zona exterior para la observación temprana.",
          "Radio de tormenta – zona más cercana que requiere mayor atención.",
          "Radio de peligro – entorno inmediato de especial relevancia."
        ],
        "notes": [
          "El radio de peligro está limitado a un máximo de 250 km. Consulta “Ajustes básicos recomendados” para los valores iniciales aconsejados y la coordinación necesaria con la aplicación Blitzortung."
        ],
        "featureBlocks": [
          {
            "title": "Navegación por clústeres · duración de la sesión",
            "body": "determina cuánto tiempo permanece activa una navegación por clústeres iniciada. El tiempo de cuenta atrás puede ajustarse libremente entre 5 y 3600 segundos. {{INFINITY}} mantiene la sesión abierta sin límite. La cuenta atrás y {{INFINITY}} pueden alternarse directamente en la indicación de estado durante la navegación.",
            "infinityAlt": "Sin límite"
          }
        ]
      },
      {
        "key": "location",
        "title": "Ubicación y lugares guardados",
        "paragraphs": [
          "El lugar seleccionado es el punto de referencia desde el que Gewitterradar calcula distancias y direcciones. Mediante la búsqueda mundial de lugares o la introducción directa de coordenadas, este punto de referencia puede fijarse independientemente de la ubicación real de Home Assistant. Los lugares guardados se almacenan localmente en Home Assistant."
        ],
        "entries": [
          [
            "Rastreador de ubicación y Blitzortung",
            "Gewitterradar utiliza una ubicación virtual como rastreador para los lugares elegidos libremente. En la variante Dashboard/Package de V4.07 se usa device_tracker.gewitterradar_dashboard; la integración nativa utiliza device_tracker.gewitterradar. Para que los datos de rayos sigan la ubicación virtual seleccionada, la integración Blitzortung debe utilizar el mismo rastreador como fuente de ubicación.\n↳ Configurar Blitzortung:\nAjustes → Dispositivos y servicios → Blitzortung → Añadir entrada. Selecciona «Location entity» como tipo de configuración y, a continuación, el rastreador de Gewitterradar correspondiente como entidad de ubicación. Una entrada existente con latitud/longitud fijas no puede convertirse en una entidad de ubicación mediante «Reconfigurar». En ese caso, crea una entrada nueva, compruébala y solo después desactiva o elimina la antigua entrada de coordenadas."
          ],
          [
            "Búsqueda mundial de lugares y coordenadas",
            "La búsqueda mundial permite buscar lugares y códigos postales y utilizarlos como ubicación de referencia. Como alternativa, una ubicación puede definirse directamente mediante latitud y longitud. El uso se divide en las dos opciones siguientes:"
          ],
          [
            "↳ Aplicar lugar",
            "Aplicar establece inmediatamente el lugar seleccionado en la búsqueda mundial como ubicación de referencia, cierra automáticamente la búsqueda y desplaza el mapa directamente a la nueva ubicación."
          ],
          [
            "↳ Introducir coordenadas directamente",
            "En Google Maps para escritorio, haz clic con el botón derecho en el punto deseado, copia las coordenadas del menú contextual y pégalas en «Lat / Lon». También puedes obtenerlas con MapTiler Coordinates: https://www.maptiler.com/tools/coordinates/ . Ejemplo (Lat / Lon): 53.837691, 9.956105. Gewitterradar utiliza grados decimales; la etiqueta libre es opcional."
          ],
          [
            "Configurar la lista de lugares guardados",
            "Para poder guardar lugares o coordenadas y abrirlos más tarde cómodamente desde el menú de Gewitterradar, debe crearse una única vez un área de almacenamiento mediante la función To-do de Home Assistant.\n↳ Configuración:\nAjustes → Dispositivos y servicios → Añadir integración → busca «Local To-do» y selecciona la integración. Usa exactamente «Gewitterradar Orte» como nombre de la lista y finaliza la configuración."
          ],
          [
            "Lugares guardados",
            "★ Guardar almacena permanentemente los lugares encontrados de forma local. Aparecen en el menú de ubicación, en «Lugares guardados», y pueden reutilizarse sin volver a buscarlos. × no elimina un lugar inmediatamente, sino que lo marca para eliminarlo. En «Lugares eliminados», ↶ lo restaura en cualquier momento; se conservan las coordenadas y los metadatos."
          ]
        ],
        "notes": [
          "Que el mapa se desplace no demuestra por sí solo que Blitzortung ya haya cambiado su región de datos en tiempo real. La integración nativa utiliza device_tracker.gewitterradar en lugar del rastreador del Dashboard."
        ]
      },
      {
        "key": "mapview",
        "title": "Vistas del mapa y botón de capas 3D",
        "layerGraphic": true,
        "layerGraphicAlt": "Botón de capas 3D en dorado, azul y rojo",
        "layerGraphicCaption": "El selector de capas permite cambiar en cualquier momento la vista del mapa entre Estándar, Grande y Pantalla completa.",
        "paragraphs": [],
        "entries": [
          [
            "Estándar",
            "Utiliza la altura normal del mapa dentro de la tarjeta de Gewitterradar."
          ],
          [
            "Grande",
            "Amplía el mapa dentro del panel y ofrece más superficie de mapa sin abrir el modo de pantalla completa."
          ],
          [
            "Pantalla completa",
            "Abre el mapa a pantalla completa. La píldora de ubicación, la brújula, el medallón, la leyenda y los controles del mapa siguen disponibles."
          ],
          [
            "Visualización del mapa en Ajustes",
            "La sección „Visualización del mapa“ controla la vista predeterminada para este dispositivo o perfil del navegador y la ventana de mapa separada."
          ],
          [
            "Vista predeterminada",
            "Define si Gewitterradar se inicia en Estándar, Grande, Pantalla completa o con la última vista de mapa utilizada. La selección se guarda únicamente de forma local en el dispositivo o perfil del navegador actual."
          ],
          [
            "Ventana de mapa separada",
            "Abre la vista de tormentas con el mapa y la brújula seleccionados actualmente en una ventana separada. La vista normal del panel permanece independiente. Esta función está disponible en el menú Ajustes."
          ]
        ],
        "notes": []
      },
      {
        "key": "external_services",
        "title": "Servicios externos y permisos de red",
        "paragraphs": [
          "Gewitterradar usa dos rutas de red: mapa y búsqueda salen directamente del navegador/Companion App, mientras que los datos en vivo de Blitzortung los obtiene la integración Blitzortung en el servidor Home Assistant. Firewall, VLAN, proxy, filtro DNS e inspección TLS deben revisarse por separado.",
          "Los siguientes destinos son el inventario actual de ejecución de V4.07. La biblioteca local, el tracker y los servicios de Home Assistant no necesitan Internet."
        ],
        "entries": [
          [
            "Cliente · Geocodificación Open-Meteo",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · búsqueda mundial principal; envía consulta, idioma y solo con filtro explícito el código ISO. Si falla, se usa Nominatim."
          ],
          [
            "Cliente · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · alternativa; envía consulta, idioma y posible código ISO. Las consultas públicas se separan al menos un segundo y el autocompletado local de países no hace llamadas de red. Si ambos servicios están bloqueados, los lugares guardados siguen disponibles."
          ],
          [
            "Cliente · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · carga Leaflet 1.9.4 JavaScript/CSS. Sin Leaflet en caché, bloquear este host impide inicializar el mapa."
          ],
          [
            "Cliente · teselas OpenStreetMap",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · teselas base. Si se bloquean, puede haber datos de Gewitterradar pero el mapa base queda vacío o incompleto."
          ],
          [
            "Servidor · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · salida desde el servidor Home Assistant. Blitzortung v1.7.1 usa el broker y temas geohash para rayos en vivo; bloquearlo detiene nuevos datos, sin afectar a búsqueda/mapa."
          ],
          [
            "Local · sin permiso externo",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, el servicio de coordenadas, el script del panel y la lista Local to-do “Gewitterradar Orte” funcionan localmente."
          ],
          [
            "Instalación / actualización",
            "GitHub/HACS intervienen en instalación y actualización, no son dependencias de ejecución del mapa abierto."
          ],
          [
            "Diagnóstico rápido",
            "Falla la búsqueda: comprueba Open-Meteo/Nominatim. El mapa no inicia: unpkg.com. Mapa base vacío: hosts de teselas OSM. Rayos ausentes/antiguos: blitzortung.ha.sed.pl:1883 y la integración Blitzortung."
          ]
        ],
        "notes": [
          "DNS debe resolver en el cliente y en el servidor Home Assistant para sus destinos respectivos.",
          "Proxy HTTPS, inspección TLS, filtros, bloqueadores o extensiones pueden bloquear solicitudes aunque TCP 443 esté permitido; para geocodificación revisa también CORS/filtrado de respuestas.",
          "Privacidad: la geocodificación recibe consulta/parámetros, las teselas OSM revelan técnicamente el área vista y el broker de Blitzortung recibe los temas de región/geohash suscritos.",
          "http://www.w3.org/2000/svg es solo el espacio de nombres SVG, no una llamada de red externa.",
          "El inventario de ejecución se protege automáticamente: un nuevo destino URL fijo debe romper la prueba hasta actualizar documentación y permisos."
        ]
      },
      {
        "key": "functions",
        "title": "Funciones importantes",
        "entries": [
          [
            "Efectos de aura",
            "visualizan la actividad de rayos, pero no cambian la detección ni el recuento."
          ],
          [
            "Animación de aviso",
            "resalta visualmente la actividad tormentosa relevante."
          ],
          [
            "Agrupación del mapa",
            "agrupa marcadores cercanos para mantener el mapa claro."
          ],
          [
            "Brújula: rayo más cercano",
            "orienta la vista hacia el rayo detectado más próximo."
          ],
          [
            "Orientación del dispositivo",
            "puede usar la orientación en dispositivos móviles compatibles."
          ],
          [
            "Ventana de mapa separada",
            "Abre la vista de tormentas con el mapa y la brújula seleccionados actualmente en una ventana separada. La vista normal del panel permanece independiente. Esta función está disponible en el menú Ajustes."
          ],
          [
            "Calibración y diagnóstico",
            "ofrece herramientas para comprobar, medir y diagnosticar de forma específica la visualización y sus componentes. Incluye, entre otras, la calibración de brújula y medallón, vistas de diagnóstico y funciones de prueba como la simulación de tormenta. Estas herramientas están pensadas para configuración, desarrollo y resolución de problemas y deben permanecer desactivadas durante el funcionamiento normal."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Ajustes básicos recomendados",
        "paragraphs": [
          "Para un inicio estable recomendamos:"
        ],
        "entries": [
          [
            "Valores de prueba · 500 km / 120 min / 200",
            "Un radio de detección de 500 km, una ventana de 120 minutos y 200 rayos son valores de ejemplo para pruebas, no ajustes obligatorios. Pueden adaptarse al uso, al alcance de observación deseado y a las necesidades personales."
          ],
          [
            "Coordinar ubicación y tracker",
            "Configura en Blitzortung los ajustes correspondientes tanto para la ubicación definida allí como para el tracker usado por Gewitterradar. Así, la región de datos y la visualización permanecen coherentes."
          ],
          [
            "Coordinar radios",
            "Configura el radio de la fuente Blitzortung al menos tan grande como el radio de observación de Gewitterradar."
          ],
          [
            "Mantener activado",
            "Mantén activadas la agrupación del mapa y la animación de aviso."
          ],
          [
            "Opcional",
            "Ajusta los efectos de aura a tu gusto; no afectan a la detección. Activa la orientación del dispositivo solo si se necesita en el móvil utilizado."
          ],
          [
            "Funcionamiento normal",
            "Mantén desactivadas durante el uso normal las herramientas de “Calibración y diagnóstico”, especialmente la simulación de tormenta."
          ],
          [
            "Recorder – comprobar",
            "Revisa las exclusiones del Recorder para datos de rayos y posición que se actualizan con frecuencia. Sin exclusiones adecuadas, la base de datos de Home Assistant y las copias de seguridad pueden crecer muy rápido. Consulta “Home Assistant Recorder” para detalles y YAML."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Si algo no funciona",
        "entries": [
          [
            "No hay rayos o hay muy pocos",
            "Comprueba el estado de la fuente, el radio de origen y las entidades de rayos utilizadas."
          ],
          [
            "Las distancias o direcciones parecen incorrectas",
            "Comprueba la ubicación de referencia y la unidad de distancia."
          ],
          [
            "La copia de seguridad crece de forma inusual",
            "La falta de exclusiones del Recorder para datos de rayos y posición que cambian con frecuencia puede hacer crecer muy rápido la base de datos de Home Assistant y, por tanto, las copias de seguridad. Revisa el Recorder; consulta “Home Assistant Recorder” para detalles y YAML."
          ],
          [
            "La selección de idioma reaparece",
            "Comprueba que estén instalados el paquete actual de Gewitterradar y el ayudante de inicialización."
          ],
          [
            "La vista no cambia tras actualizar",
            "Recarga completamente la caché del navegador o la aplicación y confirma que se usa el JavaScript actual."
          ],
          [
            "Comportamiento extraño o tarjeta duplicada",
            "Solo puede estar activo UN recurso de módulo Gewitterradar en Home Assistant. La integración nativa y el recurso Dashboard/HACS no deben registrar simultáneamente la misma tarjeta personalizada."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Los datos de rayos pueden generar muchísimos cambios de estado. Para mantener Recorder ligero a largo plazo, recomendamos excluir las siguientes entidades y patrones."
        ],
        "recorder": true,
        "notes": [
          "Si ya existe una sección recorder:, incorpora allí estas entradas. No crees un segundo bloque recorder: de nivel superior.",
          "Las exclusiones NO desactivan los estados en vivo utilizados por Gewitterradar.",
          "Los datos históricos existentes no se eliminan automáticamente.",
          "Los patrones comodín admiten varios detectores u observatorios independientemente del prefijo de entidad."
        ]
      }
    ]
  },
  "Français": {
    "menuTitle": "Aide et remarques",
    "title": "Aide et remarques",
    "subtitle": "Un guide concis pour que Gewitterradar reste fiable et facile à comprendre.",
    "close": "Fermer l’aide",
    "copy": "Copier le YAML",
    "copied": "Copié",
    "copyFailed": "Copie impossible — sélectionnez le code.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Prérequis",
        "paragraphs": [
          "Gewitterradar traite les données de foudre que Home Assistant reçoit de la source de détection configurée. Vérifiez-y le bon emplacement de référence et définissez le rayon de la source au moins aussi grand que le rayon d’observation de Gewitterradar. Gewitterradar ne peut ni afficher ni évaluer les impacts déjà filtrés par la source."
        ],
        "notes": [
          "Si plusieurs détecteurs ou points d’observation existent, les entités utilisées doivent correspondre sans ambiguïté au point de référence souhaité."
        ]
      },
      {
        "key": "radii",
        "title": "Les rayons",
        "paragraphs": [
          "Les rayons sont cumulatifs : un impact dans le rayon de danger compte aussi dans les rayons d’orage et d’observation. Ce sont des seuils de distance, pas des sources de données séparées.",
          "Sous « Résolution des clusters », vous définissez à quel moment les clusters sont dissociés en impacts individuels lors du zoom. Précoce les dissocie plus tôt, Équilibré reprend le réglage zonal V4.08 déjà éprouvé et Tardif maintient les clusters regroupés plus longtemps."
        ],
        "items": [
          "Rayon d’observation – zone extérieure pour l’observation précoce.",
          "Rayon d’orage – zone plus proche demandant une vigilance accrue.",
          "Rayon de danger – proximité immédiate particulièrement importante."
        ],
        "notes": [
          "Le rayon de danger est limité à 250 km maximum. Consultez « Réglages de base recommandés » pour les valeurs de départ conseillées et la coordination nécessaire avec l’application Blitzortung."
        ],
        "featureBlocks": [
          {
            "title": "Navigation dans les clusters · durée de session",
            "body": "détermine combien de temps une navigation dans les clusters déjà démarrée reste active. Le compte à rebours peut être réglé librement entre 5 et 3600 secondes. {{INFINITY}} maintient la session ouverte sans limite. Le compte à rebours et {{INFINITY}} peuvent être basculés directement dans l’indicateur d’état pendant la navigation.",
            "infinityAlt": "Sans limite"
          }
        ]
      },
      {
        "key": "location",
        "title": "Emplacement et lieux enregistrés",
        "paragraphs": [
          "Le lieu sélectionné est le point de référence à partir duquel Gewitterradar calcule les distances et les directions. La recherche mondiale de lieux ou la saisie directe de coordonnées permet de définir ce point de référence indépendamment de l’emplacement réel de Home Assistant. Les lieux enregistrés sont stockés localement dans Home Assistant."
        ],
        "entries": [
          [
            "Traceur d’emplacement et Blitzortung",
            "Gewitterradar utilise un emplacement virtuel comme traceur pour les lieux choisis librement. Dans la variante Dashboard/Package de V4.07, il s’agit de device_tracker.gewitterradar_dashboard ; l’intégration native utilise device_tracker.gewitterradar. Pour que les données de foudre suivent l’emplacement virtuel sélectionné, l’intégration Blitzortung doit utiliser le même traceur comme source d’emplacement.\n↳ Configurer Blitzortung :\nParamètres → Appareils et services → Blitzortung → Ajouter une entrée. Choisissez « Location entity » comme type de configuration, puis sélectionnez le traceur Gewitterradar approprié comme entité d’emplacement. Une entrée existante avec latitude/longitude fixes ne peut pas être convertie en entité d’emplacement via « Reconfigurer ». Dans ce cas, créez une nouvelle entrée, vérifiez-la, puis seulement ensuite désactivez ou supprimez l’ancienne entrée de coordonnées."
          ],
          [
            "Recherche mondiale de lieux et coordonnées",
            "La recherche mondiale permet de rechercher des lieux et des codes postaux et de les utiliser comme emplacement de référence. Il est également possible de définir directement un emplacement à l’aide de la latitude et de la longitude. L’utilisation se divise en deux possibilités :"
          ],
          [
            "↳ Appliquer le lieu",
            "Appliquer définit immédiatement le lieu sélectionné dans la recherche mondiale comme emplacement de référence, ferme automatiquement la recherche et déplace directement la carte vers le nouvel emplacement."
          ],
          [
            "↳ Saisir directement des coordonnées",
            "Dans Google Maps sur ordinateur, faites un clic droit sur le point souhaité pour copier les coordonnées depuis le menu contextuel, puis collez-les dans « Lat / Lon ». Vous pouvez aussi les obtenir avec MapTiler Coordinates : https://www.maptiler.com/tools/coordinates/ . Exemple (Lat / Lon) : 53.837691, 9.956105. Gewitterradar utilise les degrés décimaux ; un libellé libre est facultatif."
          ],
          [
            "Configurer la liste des lieux enregistrés",
            "Pour pouvoir enregistrer des lieux ou des coordonnées et les rappeler ensuite facilement depuis le menu Gewitterradar, une zone de stockage doit être créée une seule fois à l’aide de la fonction To-do de Home Assistant.\n↳ Configuration :\nParamètres → Appareils et services → Ajouter une intégration → recherchez « Local To-do » et sélectionnez l’intégration. Donnez exactement « Gewitterradar Orte » comme nom de liste et terminez la configuration."
          ],
          [
            "Lieux enregistrés",
            "★ Enregistrer stocke durablement les lieux trouvés en local. Ils apparaissent dans le menu d’emplacement sous « Lieux enregistrés » et peuvent être réutilisés sans nouvelle recherche. × ne supprime pas immédiatement un lieu, mais le marque pour suppression. Sous « Lieux supprimés », ↶ le restaure à tout moment ; les coordonnées et les métadonnées sont conservées."
          ]
        ],
        "notes": [
          "Le seul déplacement de la carte ne prouve pas que Blitzortung a déjà changé sa région de données en direct. L’intégration native utilise device_tracker.gewitterradar à la place du traceur Dashboard."
        ]
      },
      {
        "key": "mapview",
        "title": "Vues de la carte et bouton de calques 3D",
        "layerGraphic": true,
        "layerGraphicAlt": "Bouton de calques 3D en or, bleu et rouge",
        "layerGraphicCaption": "Le sélecteur de calques permet de basculer à tout moment la vue de la carte entre Standard, Grande et Plein écran.",
        "paragraphs": [],
        "entries": [
          [
            "Standard",
            "Utilise la hauteur normale de la carte dans la carte Gewitterradar."
          ],
          [
            "Grande",
            "Agrandit la carte dans le tableau de bord et offre davantage de surface cartographique sans ouvrir le mode plein écran."
          ],
          [
            "Plein écran",
            "Ouvre la carte en plein écran. La pastille de localisation, la boussole, le médaillon, la légende et les commandes de la carte restent disponibles."
          ],
          [
            "Affichage de la carte dans les paramètres",
            "La section « Affichage de la carte » définit la vue par défaut pour cet appareil ou ce profil de navigateur ainsi que la fenêtre de carte séparée."
          ],
          [
            "Vue par défaut",
            "Détermine si Gewitterradar démarre en mode Standard, Grande, Plein écran ou avec la dernière vue de carte utilisée. Le choix est enregistré uniquement en local sur l’appareil ou dans le profil de navigateur utilisé."
          ],
          [
            "Fenêtre de carte séparée",
            "Ouvre la vue des orages avec la carte et la boussole actuellement sélectionnées dans une fenêtre séparée. La vue normale du tableau de bord reste indépendante. Cette fonction est disponible dans le menu Paramètres."
          ]
        ],
        "notes": []
      },
      {
        "key": "external_services",
        "title": "Services externes et autorisations réseau",
        "paragraphs": [
          "Gewitterradar utilise deux chemins réseau : carte et recherche partent du navigateur/de la Companion App, tandis que les données Blitzortung sont récupérées par l’intégration Blitzortung sur le serveur Home Assistant. Pare-feu, VLAN, proxy, filtrage DNS et inspection TLS doivent donc être vérifiés séparément.",
          "Les destinations ci-dessous constituent l’inventaire d’exécution V4.07 actuel. La bibliothèque locale, le tracker et les services Home Assistant n’ont pas besoin d’Internet."
        ],
        "entries": [
          [
            "Client · Géocodage Open-Meteo",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · recherche mondiale principale ; transmet requête, langue et code ISO uniquement si un pays est explicitement choisi. En cas d’échec, Nominatim sert de repli."
          ],
          [
            "Client · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · repli de recherche ; transmet requête, langue et éventuel code ISO. Les appels publics sont espacés d’au moins une seconde et l’autocomplétion locale des pays ne fait aucun appel réseau. Si les deux services sont bloqués, les lieux enregistrés restent utilisables."
          ],
          [
            "Client · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · charge Leaflet 1.9.4 JavaScript/CSS. Sans Leaflet déjà en cache, bloquer cet hôte empêche l’initialisation de la carte."
          ],
          [
            "Client · tuiles OpenStreetMap",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · tuiles de fond. Si elles sont bloquées, les données peuvent subsister mais le fond de carte reste vide ou incomplet."
          ],
          [
            "Serveur · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · connexion sortante du serveur Home Assistant. Blitzortung v1.7.1 utilise ce broker et des sujets geohash pour les éclairs en direct ; un blocage interrompt les nouvelles données sans affecter recherche/carte."
          ],
          [
            "Local · aucune autorisation externe",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, le service de coordonnées, le script du tableau de bord et la liste Local to-do « Gewitterradar Orte » restent locaux."
          ],
          [
            "Installation / mise à jour",
            "GitHub/HACS servent à installer et mettre à jour, pas au fonctionnement courant d’une carte Gewitterradar ouverte."
          ],
          [
            "Diagnostic rapide",
            "Recherche en panne : Open-Meteo/Nominatim. Carte ne démarre pas : unpkg.com. Fond vide : hôtes de tuiles OSM. Éclairs absents/anciens : blitzortung.ha.sed.pl:1883 et intégration Blitzortung."
          ]
        ],
        "notes": [
          "La résolution DNS doit fonctionner sur le client et le serveur Home Assistant pour leurs destinations respectives.",
          "Proxy HTTPS, inspection TLS, filtres, bloqueurs ou extensions peuvent bloquer les requêtes malgré TCP 443 ouvert ; pour le géocodage vérifier aussi CORS/filtrage des réponses.",
          "Confidentialité : le géocodage reçoit requête/paramètres, les tuiles OSM révèlent techniquement la zone affichée et le broker Blitzortung reçoit les sujets région/geohash abonnés.",
          "http://www.w3.org/2000/svg est uniquement l’espace de noms SVG, pas un appel réseau externe.",
          "L’inventaire d’exécution est protégé automatiquement : toute nouvelle URL externe fixe doit faire échouer le test jusqu’à mise à jour de la documentation et des autorisations."
        ]
      },
      {
        "key": "functions",
        "title": "Fonctions importantes",
        "entries": [
          [
            "Effets d’aura",
            "visualisent l’activité de foudre sans modifier la détection ni le comptage."
          ],
          [
            "Animation d’alerte",
            "met visuellement en évidence l’activité orageuse pertinente."
          ],
          [
            "Regroupement de carte",
            "regroupe les marqueurs proches pour garder la carte lisible."
          ],
          [
            "Boussole : impact le plus proche",
            "oriente l’affichage vers l’impact détecté le plus proche."
          ],
          [
            "Orientation de l’appareil",
            "peut utiliser l’orientation des appareils mobiles compatibles."
          ],
          [
            "Fenêtre de carte séparée",
            "Ouvre la vue des orages avec la carte et la boussole actuellement sélectionnées dans une fenêtre séparée. La vue normale du tableau de bord reste indépendante. Cette fonction est disponible dans le menu Paramètres."
          ],
          [
            "Étalonnage et diagnostic",
            "fournit des outils de contrôle ciblé, de mesure et de diagnostic de l’affichage et de ses composants. Cela comprend notamment l’étalonnage de la boussole et du médaillon, des vues de diagnostic et des fonctions de test telles que la simulation d’orage. Ces outils sont destinés à la configuration, au développement et au dépannage et doivent rester désactivés en fonctionnement normal."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Réglages de base recommandés",
        "paragraphs": [
          "Pour un démarrage stable, nous recommandons :"
        ],
        "entries": [
          [
            "Valeurs de test · 500 km / 120 min / 200",
            "Un rayon de détection de 500 km, une fenêtre de 120 minutes et 200 éclairs sont des valeurs d’exemple pour les tests, et non des réglages obligatoires. Elles peuvent être adaptées à l’usage, à la portée d’observation souhaitée et aux besoins personnels."
          ],
          [
            "Coordonner lieu & tracker",
            "Configurez dans Blitzortung les réglages correspondants pour le lieu défini et pour le tracker utilisé par Gewitterradar. La zone de données et l’affichage restent ainsi cohérents."
          ],
          [
            "Coordonner les rayons",
            "Réglez le rayon de la source Blitzortung au moins aussi grand que le rayon d’observation Gewitterradar."
          ],
          [
            "Laisser activé",
            "Laissez activés le regroupement de carte et l’animation d’avertissement."
          ],
          [
            "Facultatif",
            "Réglez les effets d’aura selon vos préférences ; ils n’influencent pas la détection. Activez l’orientation de l’appareil uniquement si elle est nécessaire sur l’appareil mobile utilisé."
          ],
          [
            "Fonctionnement normal",
            "Laissez désactivés en fonctionnement normal les outils de « Étalonnage et diagnostic », en particulier la simulation d’orage."
          ],
          [
            "Recorder – à vérifier",
            "Vérifiez les exclusions Recorder pour les données de foudre et de position fréquemment mises à jour. Sans exclusions adaptées, la base de données Home Assistant et les sauvegardes peuvent grossir très rapidement. Voir « Home Assistant Recorder » pour les détails et le YAML."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Si quelque chose ne fonctionne pas",
        "entries": [
          [
            "Aucun impact ou trop peu",
            "Vérifiez l’état de la source, son rayon et les entités de foudre utilisées."
          ],
          [
            "Distances ou directions incorrectes",
            "Vérifiez l’emplacement de référence et l’unité de distance."
          ],
          [
            "La sauvegarde grossit anormalement vite",
            "L’absence d’exclusions Recorder pour les données de foudre et de position fréquemment mises à jour peut faire grossir très rapidement la base de données Home Assistant et donc les sauvegardes. Vérifiez le Recorder ; voir « Home Assistant Recorder » pour les détails et le YAML."
          ],
          [
            "Le choix de langue réapparaît",
            "Vérifiez que le package Gewitterradar actuel et l’assistant d’initialisation sont installés."
          ],
          [
            "Affichage inchangé après mise à jour",
            "Rechargez complètement le cache du navigateur ou de l’application et vérifiez que le JavaScript actuel est utilisé."
          ],
          [
            "Comportement étrange ou carte en double",
            "Une seule ressource de module Gewitterradar doit être active dans Home Assistant. L’intégration native et la ressource Dashboard/HACS ne doivent pas enregistrer simultanément la même carte personnalisée."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Les données de foudre peuvent produire de très nombreux changements d’état. Pour garder Recorder léger sur le long terme, nous recommandons d’exclure les entités et motifs suivants."
        ],
        "recorder": true,
        "notes": [
          "Si une section recorder: existe déjà, fusionnez-y ces entrées. Ne créez pas un second bloc recorder: de premier niveau.",
          "Ces exclusions ne désactivent PAS les états en direct utilisés par Gewitterradar.",
          "Les données historiques existantes ne sont pas supprimées automatiquement.",
          "Les motifs génériques prennent en charge plusieurs détecteurs ou points d’observation, quel que soit le préfixe des entités."
        ]
      }
    ]
  },
  "Nederlands": {
    "menuTitle": "Hulp & aanwijzingen",
    "title": "Hulp & aanwijzingen",
    "subtitle": "Een korte gids om Gewitterradar betrouwbaar en begrijpelijk te laten werken.",
    "close": "Hulp sluiten",
    "copy": "YAML kopiëren",
    "copied": "Gekopieerd",
    "copyFailed": "Kopiëren niet mogelijk — selecteer de code.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Vereisten",
        "paragraphs": [
          "Gewitterradar verwerkt de bliksemgegevens die Home Assistant van de ingestelde detectiebron ontvangt. Controleer daar de juiste referentielocatie en stel de bronradius minstens zo groot in als de observatieradius in Gewitterradar. Gewitterradar kan inslagen die al door de bron zijn weggefilterd niet tonen of beoordelen."
        ],
        "notes": [
          "Bij meerdere detectoren of observatiepunten moeten de gebruikte entiteiten eenduidig bij het gewenste referentiepunt horen."
        ]
      },
      {
        "key": "radii",
        "title": "De stralen",
        "paragraphs": [
          "De stralen zijn cumulatief: een inslag binnen de gevarenradius telt ook binnen de onweers- en observatieradius. Het zijn afstandsdrempels, geen afzonderlijke gegevensbronnen.",
          "Onder ‘Clusterresolutie’ bepaal je wanneer clusters bij het inzoomen worden opgesplitst in afzonderlijke blikseminslagen. Vroeg splitst eerder op, Evenwichtig gebruikt de tot nu toe beproefde zoneafhankelijke V4.08-afstemming en Laat houdt clusters langer bijeen."
        ],
        "items": [
          "Observatieradius – buitenste gebied voor vroege observatie.",
          "Onweersradius – dichter gebied dat extra aandacht vraagt.",
          "Gevarenradius – directe omgeving met bijzonder hoge relevantie."
        ],
        "notes": [
          "De gevarenradius is beperkt tot maximaal 250 km. Zie “Aanbevolen basisinstellingen” voor aanbevolen startwaarden en de vereiste afstemming met de Blitzortung-app."
        ],
        "featureBlocks": [
          {
            "title": "Clusternavigatie · sessieduur",
            "body": "bepaalt hoe lang een gestarte clusternavigatie actief blijft. De afteltijd kan vrij worden ingesteld tussen 5 en 3600 seconden. {{INFINITY}} houdt de sessie onbeperkt open. Aftellen en {{INFINITY}} kunnen tijdens de navigatie rechtstreeks in de statusweergave worden omgeschakeld.",
            "infinityAlt": "Onbeperkt"
          }
        ]
      },
      {
        "key": "location",
        "title": "Locatie & opgeslagen plaatsen",
        "paragraphs": [
          "De gekozen plaats is het referentiepunt van waaruit Gewitterradar afstanden en richtingen berekent. Via de wereldwijde plaatszoekfunctie of door coördinaten rechtstreeks in te voeren, kan dit referentiepunt onafhankelijk van de werkelijke Home Assistant-locatie worden ingesteld. Opgeslagen plaatsen worden lokaal in Home Assistant bewaard."
        ],
        "entries": [
          [
            "Locatietracker & Blitzortung",
            "Gewitterradar gebruikt voor vrij gekozen plaatsen een virtuele locatie als tracker. In de Dashboard-/Package-variant van V4.07 is dat device_tracker.gewitterradar_dashboard; de native integratie gebruikt device_tracker.gewitterradar. Om de bliksemgegevens de gekozen virtuele locatie te laten volgen, moet de Blitzortung-integratie dezelfde tracker als locatiebron gebruiken.\n↳ Blitzortung instellen:\nInstellingen → Apparaten & diensten → Blitzortung → Item toevoegen. Kies „Location entity“ als configuratietype en selecteer daarna de passende Gewitterradar-tracker als locatie-entiteit. Een bestaande invoer met vaste breedte-/lengtegraden kan via „Opnieuw configureren“ niet worden omgezet naar een locatie-entiteit. Maak in dat geval een nieuwe invoer, controleer die en schakel pas daarna de oude coördinateninvoer uit of verwijder hem."
          ],
          [
            "Wereldwijde plaatszoekfunctie & coördinaten",
            "Met de wereldwijde plaatszoekfunctie kunnen plaatsen en postcodes worden gezocht en als referentielocatie worden gebruikt. Een locatie kan ook rechtstreeks via breedte- en lengtegraad worden ingesteld. De bediening bestaat uit de volgende twee manieren:"
          ],
          [
            "↳ Plaats toepassen",
            "Toepassen stelt de in de wereldwijde zoekfunctie gekozen plaats direct als referentielocatie in, sluit de plaatszoekfunctie automatisch en verplaatst de kaart rechtstreeks naar de nieuwe locatie."
          ],
          [
            "↳ Coördinaten rechtstreeks invoeren",
            "In Google Maps op de desktop kun je met de rechtermuisknop op het gewenste punt klikken, de coördinaten uit het contextmenu kopiëren en ze daarna onder „Lat / Lon“ plakken. Als alternatief kunnen coördinaten worden bepaald met MapTiler Coordinates: https://www.maptiler.com/tools/coordinates/ . Voorbeeld (Lat / Lon): 53.837691, 9.956105. Gewitterradar gebruikt decimale graden; een vrije naam is optioneel."
          ],
          [
            "Lijst met opgeslagen plaatsen instellen",
            "Om plaatsen of coördinaten te kunnen opslaan en later eenvoudig via het Gewitterradar-menu te openen, moet één keer een opslaggebied via de To-do-functie van Home Assistant worden ingericht.\n↳ Instellen:\nInstellingen → Apparaten & diensten → Integratie toevoegen → zoek naar „Local To-do“ en selecteer de integratie. Gebruik exact „Gewitterradar Orte“ als lijstnaam en rond de installatie af."
          ],
          [
            "Opgeslagen plaatsen",
            "★ Opslaan bewaart gevonden plaatsen permanent lokaal. Ze verschijnen in het locatiemenu onder „Opgeslagen plaatsen“ en kunnen zonder nieuwe zoekopdracht opnieuw worden gebruikt. × verwijdert een plaats niet meteen, maar markeert hem voor verwijdering. Onder „Verwijderde plaatsen“ herstelt ↶ hem op elk moment; coördinaten en metadata blijven behouden."
          ]
        ],
        "notes": [
          "Alleen het verplaatsen van de kaart bewijst niet dat Blitzortung zijn live-gegevensregio al heeft aangepast. De native integratie gebruikt device_tracker.gewitterradar in plaats van de Dashboard-tracker."
        ]
      },
      {
        "key": "mapview",
        "title": "Kaartweergaven en 3D-laagknop",
        "layerGraphic": true,
        "layerGraphicAlt": "3D-laagknop in goud, blauw en rood",
        "layerGraphicCaption": "Met de laagkiezer kan de kaartweergave op elk moment worden gewisseld tussen Standaard, Groot en Volledig scherm.",
        "paragraphs": [],
        "entries": [
          [
            "Standaard",
            "Gebruikt de normale kaarthoogte binnen de Gewitterradar-kaart."
          ],
          [
            "Groot",
            "Vergroot de kaart binnen het dashboard en geeft meer kaartruimte zonder de volledig-schermmodus te openen."
          ],
          [
            "Volledig scherm",
            "Opent de kaart op volledig scherm. De locatiepil, het kompas, het medaillon, de legenda en de kaartbediening blijven beschikbaar."
          ],
          [
            "Kaartweergave in Instellingen",
            "In het onderdeel „Kaartweergave“ worden de standaardweergave voor dit apparaat of browserprofiel en het aparte kaartvenster ingesteld."
          ],
          [
            "Standaardweergave",
            "Bepaalt of Gewitterradar start met Standaard, Groot, Volledig scherm of de laatst gebruikte kaartweergave. De keuze wordt alleen lokaal opgeslagen op het betreffende apparaat of in het gebruikte browserprofiel."
          ],
          [
            "Apart kaartvenster",
            "Opent de onweersweergave met de momenteel geselecteerde kaart en het momenteel geselecteerde kompas in een apart venster. De normale dashboardweergave blijft daarvan gescheiden. Deze functie is beschikbaar via het menu Instellingen."
          ]
        ],
        "notes": []
      },
      {
        "key": "external_services",
        "title": "Externe diensten & netwerktoegang",
        "paragraphs": [
          "Gewitterradar gebruikt twee netwerkpaden: kaart en zoeken gaan rechtstreeks vanaf browser/Companion App, terwijl Blitzortung-livegegevens door de Blitzortung-integratie op de Home Assistant-server worden opgehaald. Firewall, VLAN, proxy, DNS-filter en TLS-inspectie moeten daarom apart worden beoordeeld.",
          "Onderstaande doelen vormen de huidige V4.07-runtime-inventaris. Lokale plaatsen, tracker en Home Assistant-diensten hebben geen internettoegang nodig."
        ],
        "entries": [
          [
            "Client · Open-Meteo-geocodering",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · primaire wereldwijde zoekdienst; verstuurt zoekterm, taal en alleen bij expliciet landfilter de ISO-code. Bij uitval volgt Nominatim."
          ],
          [
            "Client · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · terugvaldienst; verstuurt zoekterm, taal en eventueel ISO-code. Publieke oproepen liggen minimaal één seconde uit elkaar en lokale landaanvulling maakt geen netwerkoproepen. Als beide diensten geblokkeerd zijn, blijven opgeslagen plaatsen lokaal bruikbaar."
          ],
          [
            "Client · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · levert Leaflet 1.9.4 JavaScript/CSS. Zonder gecachte Leaflet kan de kaart bij blokkade niet initialiseren."
          ],
          [
            "Client · OpenStreetMap-tegels",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · basistegels. Bij blokkade kunnen Gewitterradar-gegevens bestaan, maar de basiskaart blijft leeg of onvolledig."
          ],
          [
            "Server · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · uitgaand vanaf de Home Assistant-server. Blitzortung v1.7.1 gebruikt broker/geohash-onderwerpen voor live bliksem; blokkade stopt nieuwe livegegevens maar niet zoeken/kaart."
          ],
          [
            "Lokaal · geen externe toegang",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, coördinatendienst, dashboardscript en Local to-do-lijst “Gewitterradar Orte” werken lokaal."
          ],
          [
            "Installatie / update",
            "GitHub/HACS zijn voor installatie en updates, niet voor de runtime van een geopende Gewitterradar-kaart."
          ],
          [
            "Snelle diagnose",
            "Zoeken stuk: Open-Meteo/Nominatim. Kaart start niet: unpkg.com. Lege basiskaart: OSM-tegelhosts. Ontbrekende/oude bliksem: blitzortung.ha.sed.pl:1883 en Blitzortung-integratie."
          ]
        ],
        "notes": [
          "DNS moet op client en Home Assistant-server werken voor de respectieve doelen.",
          "HTTPS-proxy, TLS-inspectie, filters, blokkeerders of browserextensies kunnen verzoeken blokkeren ondanks open TCP 443; controleer bij geocodering ook CORS/antwoordfilters.",
          "Privacy: geocodering ontvangt zoekterm/parameters, OSM-tegels verraden technisch het bekeken kaartgebied en de Blitzortung-broker ontvangt geabonneerde regio-/geohash-onderwerpen.",
          "http://www.w3.org/2000/svg is alleen de SVG-naamruimte en geen externe netwerkaanroep.",
          "De runtime-inventaris is geautomatiseerd bewaakt: een nieuw vast extern URL-doel moet de test laten falen totdat documentatie en toestemmingen zijn bijgewerkt."
        ]
      },
      {
        "key": "functions",
        "title": "Belangrijke functies",
        "entries": [
          [
            "Aura-effecten",
            "visualiseren bliksemactiviteit maar veranderen detectie of telling niet."
          ],
          [
            "Waarschuwingsanimatie",
            "benadrukt relevante onweersactiviteit visueel."
          ],
          [
            "Kaartgroepering",
            "voegt nabije inslagmarkeringen samen en houdt de kaart overzichtelijk."
          ],
          [
            "Kompas: dichtstbijzijnde inslag",
            "richt de weergave op de dichtstbijzijnde gedetecteerde inslag."
          ],
          [
            "Apparaatoriëntatie",
            "kan op ondersteunde mobiele apparaten de oriëntatie gebruiken."
          ],
          [
            "Apart kaartvenster",
            "Opent de onweersweergave met de momenteel geselecteerde kaart en het momenteel geselecteerde kompas in een apart venster. De normale dashboardweergave blijft daarvan gescheiden. Deze functie is beschikbaar via het menu Instellingen."
          ],
          [
            "Kalibratie en diagnose",
            "biedt hulpmiddelen voor gerichte controle, meting en probleemdiagnose van de weergave en afzonderlijke onderdelen. Dit omvat onder meer kompas- en medaillonkalibratie, diagnoseweergaven en testfuncties zoals de onweerssimulatie. Deze hulpmiddelen zijn bedoeld voor configuratie, ontwikkeling en foutopsporing en moeten tijdens normaal gebruik uitgeschakeld blijven."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Aanbevolen basisinstellingen",
        "paragraphs": [
          "Voor een stabiele start adviseren we:"
        ],
        "entries": [
          [
            "Testwaarden · 500 km / 120 min / 200",
            "Een detectieradius van 500 km, een tijdvenster van 120 minuten en 200 bliksems zijn voorbeeldwaarden voor tests, geen verplichte instellingen. Ze kunnen worden aangepast aan het gebruik, het gewenste observatiebereik en persoonlijke behoeften."
          ],
          [
            "Locatie & tracker afstemmen",
            "Stem de instellingen in Blitzortung af op zowel de daar ingestelde locatie als de tracker die Gewitterradar gebruikt. Zo blijven dataregio en weergave consistent."
          ],
          [
            "Radii afstemmen",
            "Stel de bronradius van Blitzortung minstens zo groot in als de observatieradius van Gewitterradar."
          ],
          [
            "Ingeschakeld laten",
            "Laat kaartgroepering en waarschuwingsanimatie ingeschakeld."
          ],
          [
            "Optioneel",
            "Stel aura-effecten naar wens in; ze beïnvloeden de detectie niet. Schakel apparaatoriëntatie alleen in als die op het gebruikte mobiele apparaat nodig is."
          ],
          [
            "Normaal gebruik",
            "Laat de hulpmiddelen onder “Kalibratie en diagnose”, met name de onweerssimulatie, tijdens normaal gebruik uitgeschakeld."
          ],
          [
            "Recorder – controleren",
            "Controleer Recorder-uitsluitingen voor vaak bijgewerkte bliksem- en positiegegevens. Zonder geschikte uitsluitingen kunnen de Home Assistant-database en back-ups zeer snel groeien. Zie “Home Assistant Recorder” voor details en YAML."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Als iets niet werkt",
        "entries": [
          [
            "Geen of te weinig inslagen",
            "Controleer de bronstatus, bronradius en gebruikte bliksementiteiten."
          ],
          [
            "Afstanden of richtingen lijken verkeerd",
            "Controleer referentielocatie en afstandseenheid."
          ],
          [
            "Back-up groeit ongewoon snel",
            "Ontbrekende Recorder-uitsluitingen voor vaak bijgewerkte bliksem- en positiegegevens kunnen de Home Assistant-database en daardoor ook back-ups zeer snel laten groeien. Controleer de Recorder-instellingen; zie “Home Assistant Recorder” voor details en YAML."
          ],
          [
            "Taalkeuze blijft terugkomen",
            "Controleer of het actuele Gewitterradar-package en de initialisatiehelper zijn geïnstalleerd."
          ],
          [
            "Weergave na update onveranderd",
            "Laad de browser-/appcache volledig opnieuw en controleer dat het actuele JavaScript-bestand wordt gebruikt."
          ],
          [
            "Vreemd gedrag of dubbele kaart",
            "Er mag slechts ÉÉN Gewitterradar-moduleresource actief zijn in Home Assistant. De native integratie en Dashboard-/HACS-resource mogen dezelfde custom card niet tegelijk registreren."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Bliksemgegevens kunnen zeer veel statuswijzigingen veroorzaken. Voor een slanke Recorder-configuratie op lange termijn adviseren we de volgende entiteiten en patronen uit te sluiten."
        ],
        "recorder": true,
        "notes": [
          "Voeg deze regels toe aan een bestaande recorder:-sectie. Maak geen tweede recorder:-blok op het hoogste niveau.",
          "De uitsluitingen schakelen live-statussen voor Gewitterradar NIET uit.",
          "Bestaande historische gegevens worden niet automatisch verwijderd.",
          "De jokerpatronen ondersteunen meerdere detectoren of observatiepunten, ongeacht het entiteitsvoorvoegsel."
        ]
      }
    ]
  },
  "Polski": {
    "menuTitle": "Pomoc i wskazówki",
    "title": "Pomoc i wskazówki",
    "subtitle": "Krótki przewodnik, aby Gewitterradar działał niezawodnie i był łatwy do zrozumienia.",
    "close": "Zamknij pomoc",
    "copy": "Kopiuj YAML",
    "copied": "Skopiowano",
    "copyFailed": "Nie można skopiować — zaznacz kod.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Wymagania",
        "paragraphs": [
          "Gewitterradar przetwarza dane o wyładowaniach, które Home Assistant otrzymuje ze skonfigurowanego źródła detekcji. Sprawdź tam właściwą lokalizację odniesienia i ustaw promień źródła co najmniej tak duży jak promień obserwacji w Gewitterradar. Gewitterradar nie może wyświetlać ani oceniać wyładowań odfiltrowanych już przez źródło."
        ],
        "notes": [
          "Jeśli dostępnych jest kilka detektorów lub punktów obserwacyjnych, używane encje muszą jednoznacznie należeć do właściwego punktu odniesienia."
        ]
      },
      {
        "key": "radii",
        "title": "Promienie",
        "paragraphs": [
          "Promienie nakładają się: wyładowanie w promieniu zagrożenia liczy się także w promieniu burzy i obserwacji. Są to progi odległości, a nie oddzielne źródła danych.",
          "W sekcji „Rozdzielanie klastrów” określasz, kiedy podczas przybliżania klastry mają zostać rozdzielone na pojedyncze wyładowania. Wcześnie rozdziela je szybciej, Zrównoważone korzysta z dotychczasowego, zależnego od stref strojenia V4.08, a Późno utrzymuje klastry razem dłużej."
        ],
        "items": [
          "Promień obserwacji – zewnętrzny obszar wczesnej obserwacji.",
          "Promień burzy – bliższy obszar wymagający większej uwagi.",
          "Promień zagrożenia – bezpośrednie otoczenie o szczególnym znaczeniu."
        ],
        "notes": [
          "Promień zagrożenia jest ograniczony do maksymalnie 250 km. Zalecane wartości początkowe i wymagane uzgodnienie z aplikacją Blitzortung opisano w sekcji „Zalecane ustawienia podstawowe”."
        ],
        "featureBlocks": [
          {
            "title": "Nawigacja po klastrach · czas sesji",
            "body": "określa, jak długo rozpoczęta nawigacja po klastrach pozostaje aktywna. Czas odliczania można dowolnie ustawić w zakresie od 5 do 3600 sekund. {{INFINITY}} utrzymuje sesję otwartą bez limitu. Odliczanie i {{INFINITY}} można przełączać bezpośrednio we wskaźniku stanu podczas nawigacji.",
            "infinityAlt": "Bez limitu"
          }
        ]
      },
      {
        "key": "location",
        "title": "Lokalizacja i zapisane miejsca",
        "paragraphs": [
          "Wybrane miejsce jest punktem odniesienia, od którego Gewitterradar oblicza odległości i kierunki. Dzięki globalnemu wyszukiwaniu miejsc lub bezpośredniemu wprowadzaniu współrzędnych punkt ten można ustawić niezależnie od rzeczywistej lokalizacji Home Assistant. Zapisane miejsca są przechowywane lokalnie w Home Assistant."
        ],
        "entries": [
          [
            "Tracker lokalizacji i Blitzortung",
            "Gewitterradar używa wirtualnej lokalizacji jako trackera dla dowolnie wybranych miejsc. W wariancie Dashboard/Package V4.07 jest to device_tracker.gewitterradar_dashboard; integracja natywna używa device_tracker.gewitterradar. Aby dane o wyładowaniach podążały za wybraną wirtualną lokalizacją, integracja Blitzortung musi używać tego samego trackera jako źródła lokalizacji.\n↳ Konfiguracja Blitzortung:\nUstawienia → Urządzenia i usługi → Blitzortung → Dodaj wpis. Wybierz „Location entity” jako typ konfiguracji, a następnie właściwy tracker Gewitterradar jako encję lokalizacji. Istniejącego wpisu ze stałą szerokością/długością geograficzną nie można przez „Konfiguruj ponownie” przekształcić w encję lokalizacji. W takim przypadku utwórz nowy wpis, sprawdź go, a dopiero potem wyłącz lub usuń stary wpis ze współrzędnymi."
          ],
          [
            "Globalne wyszukiwanie miejsc i współrzędne",
            "Globalne wyszukiwanie pozwala znajdować miejscowości i kody pocztowe oraz używać ich jako lokalizacji odniesienia. Alternatywnie lokalizację można określić bezpośrednio przez szerokość i długość geograficzną. Obsługa dzieli się na dwa poniższe sposoby:"
          ],
          [
            "↳ Zastosuj miejsce",
            "Zastosuj natychmiast ustawia miejsce wybrane w globalnym wyszukiwaniu jako lokalizację odniesienia, automatycznie zamyka wyszukiwanie i przesuwa mapę bezpośrednio do nowej lokalizacji."
          ],
          [
            "↳ Wprowadź współrzędne bezpośrednio",
            "W Google Maps na komputerze kliknij prawym przyciskiem wybrany punkt, skopiuj współrzędne z menu kontekstowego i wklej je w polu „Lat / Lon”. Współrzędne można też ustalić za pomocą MapTiler Coordinates: https://www.maptiler.com/tools/coordinates/ . Przykład (Lat / Lon): 53.837691, 9.956105. Gewitterradar używa stopni dziesiętnych; własna nazwa jest opcjonalna."
          ],
          [
            "Skonfiguruj listę zapisanych miejsc",
            "Aby miejsca lub współrzędne można było zapisywać i później wygodnie otwierać z menu Gewitterradar, trzeba jednorazowo utworzyć obszar przechowywania za pomocą funkcji To-do w Home Assistant.\n↳ Konfiguracja:\nUstawienia → Urządzenia i usługi → Dodaj integrację → wyszukaj „Local To-do” i wybierz integrację. Ustaw dokładnie nazwę listy „Gewitterradar Orte” i zakończ konfigurację."
          ],
          [
            "Zapisane miejsca",
            "★ Zapisz trwale zapisuje znalezione miejsca lokalnie. Pojawiają się w menu lokalizacji w sekcji „Zapisane miejsca” i można ich używać bez ponownego wyszukiwania. × nie usuwa miejsca od razu, lecz oznacza je do usunięcia. W „Usuniętych miejscach” ↶ można je w każdej chwili przywrócić; współrzędne i metadane zostają zachowane."
          ]
        ],
        "notes": [
          "Samo przesunięcie mapy nie dowodzi, że Blitzortung zmienił już region danych na żywo. Integracja natywna używa device_tracker.gewitterradar zamiast trackera Dashboard."
        ]
      },
      {
        "key": "mapview",
        "title": "Widoki mapy i przycisk warstw 3D",
        "layerGraphic": true,
        "layerGraphicAlt": "Przycisk warstw 3D w kolorze złotym, niebieskim i czerwonym",
        "layerGraphicCaption": "Selektor warstw pozwala w dowolnym momencie przełączać widok mapy między trybami Standard, Duży i Pełny ekran.",
        "paragraphs": [],
        "entries": [
          [
            "Standard",
            "Używa normalnej wysokości mapy w karcie Gewitterradar."
          ],
          [
            "Duży",
            "Powiększa mapę w panelu i zapewnia więcej miejsca na mapę bez otwierania trybu pełnoekranowego."
          ],
          [
            "Pełny ekran",
            "Otwiera mapę na pełnym ekranie. Pigułka lokalizacji, kompas, medalion, legenda i elementy sterowania mapą pozostają dostępne."
          ],
          [
            "Widok mapy w Ustawieniach",
            "Sekcja „Widok mapy“ określa widok domyślny dla tego urządzenia lub profilu przeglądarki oraz osobne okno mapy."
          ],
          [
            "Widok domyślny",
            "Określa, czy Gewitterradar uruchamia się w trybie Standard, Duży, Pełny ekran czy z ostatnio używanym widokiem mapy. Wybór jest zapisywany wyłącznie lokalnie na danym urządzeniu lub w używanym profilu przeglądarki."
          ],
          [
            "Osobne okno mapy",
            "Otwiera widok burzowy z aktualnie wybraną mapą i aktualnie wybranym kompasem w osobnym oknie. Zwykły widok panelu pozostaje od niego oddzielony. Funkcja jest dostępna w menu Ustawienia."
          ]
        ],
        "notes": []
      },
      {
        "key": "external_services",
        "title": "Usługi zewnętrzne i dostęp sieciowy",
        "paragraphs": [
          "Gewitterradar używa dwóch ścieżek sieciowych: mapa i wyszukiwanie wychodzą bezpośrednio z przeglądarki/Companion App, natomiast dane Blitzortung pobiera integracja na serwerze Home Assistant. Firewall, VLAN, proxy, filtr DNS i inspekcja TLS wymagają osobnej weryfikacji obu ścieżek.",
          "Poniższe cele to aktualny inwentarz runtime V4.07. Lokalna biblioteka, tracker i usługi Home Assistant nie potrzebują Internetu."
        ],
        "entries": [
          [
            "Klient · geokodowanie Open-Meteo",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · podstawowe globalne wyszukiwanie; wysyła zapytanie, język i tylko przy jawnym filtrze kod ISO. Przy awarii używany jest Nominatim."
          ],
          [
            "Klient · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · zapas; wysyła zapytanie, język i ewentualny kod ISO. Publiczne wywołania są oddalone o co najmniej sekundę, a lokalne podpowiedzi krajów nie korzystają z sieci. Przy blokadzie obu usług zapisane miejsca nadal działają lokalnie."
          ],
          [
            "Klient · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · dostarcza Leaflet 1.9.4 JavaScript/CSS. Bez wersji w pamięci podręcznej blokada uniemożliwia inicjalizację mapy."
          ],
          [
            "Klient · kafelki OpenStreetMap",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · kafelki mapy bazowej. Po blokadzie dane mogą istnieć, ale mapa bazowa będzie pusta/niepełna."
          ],
          [
            "Serwer · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · połączenie wychodzące z serwera Home Assistant. Blitzortung v1.7.1 używa brokera i tematów geohash dla danych live; blokada zatrzymuje nowe wyładowania, ale nie wyszukiwanie/mapę."
          ],
          [
            "Lokalnie · bez dostępu zewnętrznego",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, usługa współrzędnych, skrypt dashboardu i lista Local to-do “Gewitterradar Orte” działają lokalnie."
          ],
          [
            "Instalacja / aktualizacja",
            "GitHub/HACS służą do instalacji i aktualizacji, nie są zależnością runtime otwartej mapy Gewitterradar."
          ],
          [
            "Szybka diagnostyka",
            "Nie działa wyszukiwanie: Open-Meteo/Nominatim. Mapa nie startuje: unpkg.com. Puste tło: hosty kafelków OSM. Brak/stare wyładowania: blitzortung.ha.sed.pl:1883 i integracja Blitzortung."
          ]
        ],
        "notes": [
          "DNS musi działać na kliencie i serwerze Home Assistant dla ich odpowiednich celów.",
          "Proxy HTTPS, inspekcja TLS, filtry, blokery lub rozszerzenia mogą blokować żądania mimo otwartego TCP 443; przy geokodowaniu sprawdź też CORS/filtr odpowiedzi.",
          "Prywatność: geokodowanie otrzymuje zapytanie/parametry, kafelki OSM technicznie ujawniają oglądany obszar, a broker Blitzortung otrzymuje subskrybowane tematy region/geohash.",
          "http://www.w3.org/2000/svg to wyłącznie przestrzeń nazw SVG, a nie zewnętrzne wywołanie sieciowe.",
          "Inwentarz runtime jest automatycznie chroniony: nowy stały zewnętrzny URL ma przerwać test do czasu aktualizacji dokumentacji i zezwoleń."
        ]
      },
      {
        "key": "functions",
        "title": "Ważne funkcje",
        "entries": [
          [
            "Efekty aury",
            "wizualizują aktywność wyładowań, ale nie zmieniają wykrywania ani zliczania."
          ],
          [
            "Animacja ostrzeżenia",
            "wyróżnia wizualnie istotną aktywność burzową."
          ],
          [
            "Grupowanie mapy",
            "łączy pobliskie znaczniki i utrzymuje czytelność mapy."
          ],
          [
            "Kompas: najbliższe wyładowanie",
            "kieruje widok na najbliższe wykryte wyładowanie."
          ],
          [
            "Orientacja urządzenia",
            "może uwzględniać orientację obsługiwanych urządzeń mobilnych."
          ],
          [
            "Osobne okno mapy",
            "Otwiera widok burzowy z aktualnie wybraną mapą i aktualnie wybranym kompasem w osobnym oknie. Zwykły widok panelu pozostaje od niego oddzielony. Funkcja jest dostępna w menu Ustawienia."
          ],
          [
            "Kalibracja i diagnostyka",
            "udostępnia narzędzia do ukierunkowanej kontroli, pomiarów i diagnostyki widoku oraz poszczególnych elementów. Obejmują one m.in. kalibrację kompasu i medalionu, widoki diagnostyczne oraz funkcje testowe, takie jak symulacja burzy. Narzędzia te są przeznaczone do konfiguracji, rozwoju i rozwiązywania problemów i podczas normalnej pracy powinny pozostać wyłączone."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Zalecane ustawienia podstawowe",
        "paragraphs": [
          "Dla stabilnego startu zalecamy:"
        ],
        "entries": [
          [
            "Wartości testowe · 500 km / 120 min / 200",
            "Promień wykrywania 500 km, okno czasowe 120 minut i 200 wyładowań to przykładowe wartości testowe, a nie obowiązkowe ustawienia. Można je dopasować do zastosowania, oczekiwanego zasięgu obserwacji i własnych potrzeb."
          ],
          [
            "Uzgodnij lokalizację i tracker",
            "Uzgodnij ustawienia w Blitzortung zarówno dla skonfigurowanej tam lokalizacji, jak i trackera używanego przez Gewitterradar. Dzięki temu region danych i widok pozostają spójne."
          ],
          [
            "Uzgodnij promienie",
            "Ustaw promień źródła Blitzortung co najmniej tak duży jak promień obserwacji Gewitterradar."
          ],
          [
            "Pozostaw włączone",
            "Pozostaw włączone grupowanie mapy i animację ostrzegawczą."
          ],
          [
            "Opcjonalnie",
            "Dostosuj efekty aury do własnych preferencji; nie wpływają na wykrywanie. Orientację urządzenia włączaj tylko wtedy, gdy jest potrzebna na używanym urządzeniu mobilnym."
          ],
          [
            "Normalna praca",
            "Podczas normalnej pracy pozostaw wyłączone narzędzia z sekcji „Kalibracja i diagnostyka”, szczególnie symulację burzy."
          ],
          [
            "Recorder – koniecznie sprawdź",
            "Sprawdź wykluczenia Recorder dla często aktualizowanych danych o wyładowaniach i położeniu. Bez właściwych wykluczeń baza danych Home Assistant i kopie zapasowe mogą rosnąć bardzo szybko. Szczegóły i YAML: „Home Assistant Recorder”."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Gdy coś nie działa",
        "entries": [
          [
            "Brak lub za mało wyładowań",
            "Sprawdź stan źródła, promień źródła i używane encje wyładowań."
          ],
          [
            "Odległości lub kierunki są błędne",
            "Sprawdź lokalizację odniesienia i jednostkę odległości."
          ],
          [
            "Kopia zapasowa rośnie nietypowo szybko",
            "Brak wykluczeń Recorder dla często aktualizowanych danych o wyładowaniach i położeniu może bardzo szybko powiększać bazę Home Assistant, a tym samym kopie zapasowe. Sprawdź ustawienia Recorder; szczegóły i YAML znajdziesz w „Home Assistant Recorder”."
          ],
          [
            "Wybór języka ciągle wraca",
            "Sprawdź, czy zainstalowano aktualny pakiet Gewitterradar i helper inicjalizacji."
          ],
          [
            "Wygląd nie zmienił się po aktualizacji",
            "Całkowicie przeładuj pamięć podręczną przeglądarki/aplikacji i upewnij się, że używany jest aktualny plik JavaScript."
          ],
          [
            "Nietypowe zachowanie lub podwójna karta",
            "W Home Assistant może być aktywny tylko JEDEN zasób modułu Gewitterradar. Integracja natywna i zasób Dashboard/HACS nie mogą jednocześnie rejestrować tej samej karty niestandardowej."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Dane o wyładowaniach mogą generować bardzo wiele zmian stanu. Aby Recorder pozostał lekki w długim okresie, zalecamy wykluczenie poniższych encji i wzorców."
        ],
        "recorder": true,
        "notes": [
          "Jeśli sekcja recorder: już istnieje, dodaj do niej te wpisy. Nie twórz drugiego bloku recorder: najwyższego poziomu.",
          "Wykluczenia NIE wyłączają stanów na żywo używanych przez Gewitterradar.",
          "Istniejące dane historyczne nie są automatycznie usuwane.",
          "Wzorce wieloznaczne obsługują wiele detektorów lub punktów obserwacyjnych niezależnie od prefiksu encji."
        ]
      }
    ]
  },
  "Português": {
    "menuTitle": "Ajuda e notas",
    "title": "Ajuda e notas",
    "subtitle": "Um guia breve para manter o Gewitterradar fiável e fácil de compreender.",
    "close": "Fechar ajuda",
    "copy": "Copiar YAML",
    "copied": "Copiado",
    "copyFailed": "Não foi possível copiar — selecione o código.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Pré-requisitos",
        "paragraphs": [
          "O Gewitterradar processa os dados de relâmpagos que o Home Assistant recebe da fonte de deteção configurada. Verifique aí a localização de referência correta e defina o raio da fonte pelo menos tão grande como o raio de observação do Gewitterradar. O Gewitterradar não pode mostrar nem avaliar descargas já filtradas pela fonte."
        ],
        "notes": [
          "Se existirem vários detetores ou pontos de observação, as entidades utilizadas devem pertencer claramente ao ponto de referência pretendido."
        ]
      },
      {
        "key": "radii",
        "title": "Os raios",
        "paragraphs": [
          "Os raios são cumulativos: uma descarga dentro do raio de perigo também conta nos raios de tempestade e de observação. São limites de distância, não fontes de dados separadas.",
          "Em «Resolução de clusters» defines quando os clusters são desfeitos em descargas individuais ao ampliar o mapa. Cedo desfaz mais cedo, Equilibrado usa o ajuste V4.08 dependente de zonas já testado e Tarde mantém os clusters agrupados durante mais tempo."
        ],
        "items": [
          "Raio de observação – área exterior para observação antecipada.",
          "Raio de tempestade – área mais próxima que exige maior atenção.",
          "Raio de perigo – proximidade imediata com relevância especialmente elevada."
        ],
        "notes": [
          "O raio de perigo está limitado a um máximo de 250 km. Consulte “Definições básicas recomendadas” para valores iniciais recomendados e para a coordenação necessária com a aplicação Blitzortung."
        ],
        "featureBlocks": [
          {
            "title": "Navegação por clusters · duração da sessão",
            "body": "define durante quanto tempo uma navegação por clusters iniciada permanece ativa. O tempo da contagem decrescente pode ser definido livremente entre 5 e 3600 segundos. {{INFINITY}} mantém a sessão aberta sem limite. A contagem decrescente e {{INFINITY}} podem ser alternadas diretamente no indicador de estado durante a navegação.",
            "infinityAlt": "Sem limite"
          }
        ]
      },
      {
        "key": "location",
        "title": "Localização e locais guardados",
        "paragraphs": [
          "O local selecionado é o ponto de referência a partir do qual o Gewitterradar calcula distâncias e direções. Através da pesquisa mundial de locais ou da introdução direta de coordenadas, esse ponto de referência pode ser definido independentemente da localização real do Home Assistant. Os locais guardados ficam armazenados localmente no Home Assistant."
        ],
        "entries": [
          [
            "Rastreador de localização e Blitzortung",
            "O Gewitterradar utiliza uma localização virtual como rastreador para locais escolhidos livremente. Na variante Dashboard/Package da V4.07 é usado device_tracker.gewitterradar_dashboard; a integração nativa utiliza device_tracker.gewitterradar. Para que os dados de raios acompanhem a localização virtual selecionada, a integração Blitzortung deve usar o mesmo rastreador como fonte de localização.\n↳ Configurar o Blitzortung:\nDefinições → Dispositivos e serviços → Blitzortung → Adicionar entrada. Selecione «Location entity» como tipo de configuração e depois o rastreador Gewitterradar adequado como entidade de localização. Uma entrada existente com latitude/longitude fixas não pode ser convertida em entidade de localização através de «Reconfigurar». Nesse caso, crie uma nova entrada, verifique-a e só depois desative ou elimine a antiga entrada de coordenadas."
          ],
          [
            "Pesquisa mundial de locais e coordenadas",
            "A pesquisa mundial permite procurar locais e códigos postais e usá-los como localização de referência. Em alternativa, uma localização pode ser definida diretamente por latitude e longitude. A utilização divide-se nas duas opções seguintes:"
          ],
          [
            "↳ Aplicar local",
            "Aplicar define imediatamente o local selecionado na pesquisa mundial como localização de referência, fecha automaticamente a pesquisa e desloca o mapa diretamente para a nova localização."
          ],
          [
            "↳ Introduzir coordenadas diretamente",
            "No Google Maps no computador, clique com o botão direito no ponto desejado, copie as coordenadas do menu de contexto e cole-as em «Lat / Lon». Em alternativa, as coordenadas podem ser obtidas através do MapTiler Coordinates: https://www.maptiler.com/tools/coordinates/ . Exemplo (Lat / Lon): 53.837691, 9.956105. O Gewitterradar utiliza graus decimais; uma designação livre é opcional."
          ],
          [
            "Configurar a lista de locais guardados",
            "Para poder guardar locais ou coordenadas e abri-los mais tarde comodamente através do menu do Gewitterradar, é necessário criar uma única vez uma área de armazenamento através da função To-do do Home Assistant.\n↳ Configuração:\nDefinições → Dispositivos e serviços → Adicionar integração → procure «Local To-do» e selecione a integração. Use exatamente «Gewitterradar Orte» como nome da lista e conclua a configuração."
          ],
          [
            "Locais guardados",
            "★ Guardar armazena permanentemente os locais encontrados de forma local. Surgem no menu de localização em «Locais guardados» e podem ser reutilizados sem nova pesquisa. × não elimina imediatamente um local, apenas o marca para remoção. Em «Locais removidos», ↶ restaura-o a qualquer momento; as coordenadas e os metadados são preservados."
          ]
        ],
        "notes": [
          "O simples deslocamento do mapa não prova que o Blitzortung já tenha mudado a sua região de dados em tempo real. A integração nativa utiliza device_tracker.gewitterradar em vez do rastreador do Dashboard."
        ]
      },
      {
        "key": "mapview",
        "title": "Vistas do mapa e botão de camadas 3D",
        "layerGraphic": true,
        "layerGraphicAlt": "Botão de camadas 3D em dourado, azul e vermelho",
        "layerGraphicCaption": "O seletor de camadas permite alternar a qualquer momento a vista do mapa entre Padrão, Grande e Ecrã inteiro.",
        "paragraphs": [],
        "entries": [
          [
            "Padrão",
            "Utiliza a altura normal do mapa dentro do cartão Gewitterradar."
          ],
          [
            "Grande",
            "Aumenta o mapa dentro do painel e disponibiliza mais área de mapa sem abrir o modo de ecrã inteiro."
          ],
          [
            "Ecrã inteiro",
            "Abre o mapa em ecrã inteiro. A pílula de localização, a bússola, o medalhão, a legenda e os controlos do mapa continuam disponíveis."
          ],
          [
            "Apresentação do mapa nas Definições",
            "A secção „Apresentação do mapa“ controla a vista predefinida para este dispositivo ou perfil do navegador e a janela de mapa separada."
          ],
          [
            "Vista predefinida",
            "Define se o Gewitterradar inicia em Padrão, Grande, Ecrã inteiro ou na última vista de mapa utilizada. A escolha é guardada apenas localmente no respetivo dispositivo ou perfil do navegador."
          ],
          [
            "Janela de mapa separada",
            "Abre a vista de trovoadas com o mapa e a bússola atualmente selecionados numa janela separada. A vista normal do painel permanece independente. Esta função está disponível através do menu Definições."
          ]
        ],
        "notes": []
      },
      {
        "key": "external_services",
        "title": "Serviços externos e permissões de rede",
        "paragraphs": [
          "O Gewitterradar usa dois caminhos de rede: mapa e pesquisa saem diretamente do browser/Companion App, enquanto os dados Blitzortung são obtidos pela integração no servidor Home Assistant. Firewall, VLAN, proxy, filtro DNS e inspeção TLS devem ser verificados separadamente.",
          "Os destinos abaixo são o inventário atual de execução V4.07. A biblioteca local, o tracker e os serviços Home Assistant não precisam de Internet."
        ],
        "entries": [
          [
            "Cliente · geocodificação Open-Meteo",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · pesquisa mundial principal; envia consulta, idioma e apenas com filtro explícito o código ISO. Em falha, usa Nominatim."
          ],
          [
            "Cliente · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · alternativa; envia consulta, idioma e possível código ISO. Chamadas públicas têm pelo menos um segundo de intervalo e o preenchimento local de países não faz chamadas de rede. Se ambos forem bloqueados, locais guardados continuam disponíveis."
          ],
          [
            "Cliente · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · carrega Leaflet 1.9.4 JavaScript/CSS. Sem Leaflet em cache, bloquear este host impede iniciar o mapa."
          ],
          [
            "Cliente · mosaicos OpenStreetMap",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · mosaicos do mapa base. Se bloqueados, pode haver dados Gewitterradar mas o mapa base fica vazio/incompleto."
          ],
          [
            "Servidor · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · saída do servidor Home Assistant. Blitzortung v1.7.1 usa o broker e tópicos geohash para dados em direto; bloqueio para novos relâmpagos, sem afetar pesquisa/mapa."
          ],
          [
            "Local · sem permissão externa",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, serviço de coordenadas, script do dashboard e lista Local to-do “Gewitterradar Orte” funcionam localmente."
          ],
          [
            "Instalação / atualização",
            "GitHub/HACS são usados para instalação/atualização, não como dependência de execução do mapa aberto."
          ],
          [
            "Diagnóstico rápido",
            "Pesquisa falha: Open-Meteo/Nominatim. Mapa não inicia: unpkg.com. Base vazia: hosts de mosaicos OSM. Relâmpagos ausentes/antigos: blitzortung.ha.sed.pl:1883 e integração Blitzortung."
          ]
        ],
        "notes": [
          "DNS deve funcionar no cliente e no servidor Home Assistant para os destinos respetivos.",
          "Proxy HTTPS, inspeção TLS, filtros, bloqueadores ou extensões podem bloquear pedidos apesar de TCP 443 aberto; na geocodificação verifique também CORS/filtros de resposta.",
          "Privacidade: geocodificação recebe consulta/parâmetros, mosaicos OSM revelam tecnicamente a área vista e o broker Blitzortung recebe os tópicos região/geohash subscritos.",
          "http://www.w3.org/2000/svg é apenas o namespace SVG, não uma chamada de rede externa.",
          "O inventário runtime é protegido automaticamente: um novo URL externo fixo deve falhar o teste até documentação e permissões serem atualizadas."
        ]
      },
      {
        "key": "functions",
        "title": "Funções importantes",
        "entries": [
          [
            "Efeitos de aura",
            "visualizam a atividade de relâmpagos, mas não alteram a deteção nem a contagem."
          ],
          [
            "Animação de aviso",
            "realça visualmente atividade de trovoada relevante."
          ],
          [
            "Agrupamento do mapa",
            "combina marcadores próximos e mantém o mapa legível."
          ],
          [
            "Bússola: descarga mais próxima",
            "orienta a vista para a descarga detetada mais próxima."
          ],
          [
            "Orientação do dispositivo",
            "pode utilizar a orientação em dispositivos móveis compatíveis."
          ],
          [
            "Janela de mapa separada",
            "Abre a vista de trovoadas com o mapa e a bússola atualmente selecionados numa janela separada. A vista normal do painel permanece independente. Esta função está disponível através do menu Definições."
          ],
          [
            "Calibração e diagnóstico",
            "disponibiliza ferramentas para verificação direcionada, medição e diagnóstico da apresentação e de componentes individuais. Inclui, entre outras, calibração da bússola e do medalhão, vistas de diagnóstico e funções de teste como a simulação de tempestade. Estas ferramentas destinam-se à configuração, desenvolvimento e resolução de problemas e devem permanecer desativadas durante o funcionamento normal."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Definições básicas recomendadas",
        "paragraphs": [
          "Para um início estável recomendamos:"
        ],
        "entries": [
          [
            "Valores de teste · 500 km / 120 min / 200",
            "Um raio de deteção de 500 km, uma janela de 120 minutos e 200 relâmpagos são valores de exemplo para testes, não definições obrigatórias. Podem ser ajustados ao uso, ao alcance de observação pretendido e às necessidades pessoais."
          ],
          [
            "Coordenar local & tracker",
            "Configure no Blitzortung as definições correspondentes tanto para o local configurado lá como para o tracker usado pelo Gewitterradar. Assim, a região de dados e a apresentação permanecem coerentes."
          ],
          [
            "Coordenar raios",
            "Defina o raio da fonte Blitzortung pelo menos tão grande como o raio de observação do Gewitterradar."
          ],
          [
            "Manter ativo",
            "Mantenha ativos o agrupamento do mapa e a animação de aviso."
          ],
          [
            "Opcional",
            "Ajuste os efeitos de aura ao gosto pessoal; não afetam a deteção. Ative a orientação do dispositivo apenas quando necessária no dispositivo móvel utilizado."
          ],
          [
            "Funcionamento normal",
            "Mantenha desativadas durante o funcionamento normal as ferramentas em “Calibração e diagnóstico”, especialmente a simulação de tempestade."
          ],
          [
            "Recorder – verificar",
            "Verifique as exclusões do Recorder para dados de relâmpagos e posição atualizados frequentemente. Sem exclusões adequadas, a base de dados do Home Assistant e os backups podem crescer muito rapidamente. Consulte “Home Assistant Recorder” para detalhes e YAML."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Se algo não funcionar",
        "entries": [
          [
            "Nenhuma ou poucas descargas",
            "Verifique o estado da fonte, o raio da fonte e as entidades de relâmpagos usadas."
          ],
          [
            "Distâncias ou direções parecem erradas",
            "Verifique a localização de referência e a unidade de distância."
          ],
          [
            "O backup cresce invulgarmente depressa",
            "A falta de exclusões do Recorder para dados de relâmpagos e posição atualizados frequentemente pode fazer crescer muito rapidamente a base de dados do Home Assistant e, por consequência, os backups. Verifique o Recorder; consulte “Home Assistant Recorder” para detalhes e YAML."
          ],
          [
            "A seleção de idioma reaparece",
            "Verifique se o pacote Gewitterradar atual e o auxiliar de inicialização estão instalados."
          ],
          [
            "Visualização inalterada após atualização",
            "Recarregue totalmente a cache do navegador/aplicação e confirme que o JavaScript atual está a ser usado."
          ],
          [
            "Comportamento estranho ou cartão duplicado",
            "Só pode estar ativo UM recurso de módulo Gewitterradar no Home Assistant. A integração nativa e o recurso Dashboard/HACS não podem registar simultaneamente o mesmo cartão personalizado."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Os dados de relâmpagos podem gerar muitas alterações de estado. Para uma configuração Recorder leve a longo prazo, recomendamos excluir as seguintes entidades e padrões."
        ],
        "recorder": true,
        "notes": [
          "Se já existir uma secção recorder:, integre nela estas entradas. Não crie um segundo bloco recorder: de nível superior.",
          "As exclusões NÃO desativam os estados em direto usados pelo Gewitterradar.",
          "Os dados históricos existentes não são removidos automaticamente.",
          "Os padrões wildcard suportam vários detetores ou pontos de observação, independentemente do prefixo da entidade."
        ]
      }
    ]
  },
  "Svenska": {
    "menuTitle": "Hjälp och anvisningar",
    "title": "Hjälp och anvisningar",
    "subtitle": "En kort guide som gör Gewitterradar tillförlitligt och lätt att förstå.",
    "close": "Stäng hjälpen",
    "copy": "Kopiera YAML",
    "copied": "Kopierat",
    "copyFailed": "Det gick inte att kopiera – markera koden.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Förutsättningar",
        "paragraphs": [
          "Gewitterradar behandlar de blixtdata som Home Assistant tar emot från den konfigurerade detektionskällan. Kontrollera rätt referensplats där och ställ in källradien minst lika stor som observationsradien i Gewitterradar. Gewitterradar kan inte visa eller utvärdera blixtar som redan har filtrerats bort av källan."
        ],
        "notes": [
          "Om flera blixtdetektorer eller observationspunkter finns måste de använda entiteterna tydligt tillhöra önskad referenspunkt."
        ]
      },
      {
        "key": "radii",
        "title": "Radierna",
        "paragraphs": [
          "Radierna är kumulativa: en blixt inom faroradien räknas även inom åsk- och observationsradien. Områdena är avståndsgränser, inte separata datakällor.",
          "Under ”Klusterupplösning” väljer du när kluster ska lösas upp till enskilda blixtar när du zoomar in. Tidig löser upp tidigare, Balanserad använder den hittills beprövade zonberoende V4.08-inställningen och Sen håller kluster samlade längre."
        ],
        "items": [
          "Observationsradie – yttre område för tidig observation.",
          "Åskradie – närmare område som kräver ökad uppmärksamhet.",
          "Faroradie – omedelbart närområde med särskilt hög relevans."
        ],
        "notes": [
          "Faroradien är begränsad till högst 250 km. Se “Rekommenderade grundinställningar” för rekommenderade startvärden och nödvändig samordning med Blitzortung-appen."
        ],
        "featureBlocks": [
          {
            "title": "Klusternavigering · sessionstid",
            "body": "bestämmer hur länge en påbörjad klusternavigering förblir aktiv. Nedräkningstiden kan ställas in fritt mellan 5 och 3600 sekunder. {{INFINITY}} håller sessionen öppen utan tidsgräns. Nedräkning och {{INFINITY}} kan växlas direkt i statusvisningen under navigeringen.",
            "infinityAlt": "Obegränsad"
          }
        ]
      },
      {
        "key": "location",
        "title": "Plats och sparade platser",
        "paragraphs": [
          "Den valda platsen är referenspunkten som Gewitterradar använder för att beräkna avstånd och riktningar. Med den globala platssökningen eller direkt inmatning av koordinater kan denna referenspunkt anges oberoende av Home Assistants faktiska plats. Sparade platser lagras lokalt i Home Assistant."
        ],
        "entries": [
          [
            "Platsspårare och Blitzortung",
            "Gewitterradar använder en virtuell plats som spårare för fritt valda platser. I Dashboard-/Package-varianten av V4.07 är detta device_tracker.gewitterradar_dashboard; den inbyggda integrationen använder device_tracker.gewitterradar. För att blixtdata ska följa den valda virtuella platsen måste Blitzortung-integrationen använda samma spårare som platskälla.\n↳ Konfigurera Blitzortung:\nInställningar → Enheter och tjänster → Blitzortung → Lägg till post. Välj ”Location entity” som konfigurationstyp och välj därefter rätt Gewitterradar-spårare som platsentitet. En befintlig post med fasta latitud-/longitudvärden kan inte ändras till en platsentitet via ”Konfigurera om”. Skapa i så fall en ny post, kontrollera den och inaktivera eller ta bort den gamla koordinatposten först därefter."
          ],
          [
            "Global platssökning och koordinater",
            "Med den globala platssökningen kan orter och postnummer sökas fram och användas som referensplats. Alternativt kan en plats anges direkt med latitud och longitud. Användningen är uppdelad i följande två sätt:"
          ],
          [
            "↳ Använd plats",
            "Använd ställer omedelbart in platsen som valts i den globala sökningen som referensplats, stänger sökningen automatiskt och flyttar kartan direkt till den nya platsen."
          ],
          [
            "↳ Ange koordinater direkt",
            "I Google Maps på datorn kan du högerklicka på önskad punkt, kopiera koordinaterna från snabbmenyn och sedan klistra in dem under ”Lat / Lon”. Alternativt kan koordinater hämtas via MapTiler Coordinates: https://www.maptiler.com/tools/coordinates/ . Exempel (Lat / Lon): 53.837691, 9.956105. Gewitterradar använder decimalgrader; en valfri benämning kan anges."
          ],
          [
            "Konfigurera lista för sparade platser",
            "För att platser eller koordinater ska kunna sparas och senare öppnas bekvämt via Gewitterradar-menyn behöver ett lagringsutrymme skapas en gång via Home Assistants To-do-funktion.\n↳ Konfiguration:\nInställningar → Enheter och tjänster → Lägg till integration → sök efter ”Local To-do” och välj integrationen. Ange exakt ”Gewitterradar Orte” som listnamn och slutför konfigurationen."
          ],
          [
            "Sparade platser",
            "★ Spara lagrar hittade platser permanent lokalt. De visas i platsmenyn under ”Sparade platser” och kan användas utan en ny sökning. × tar inte bort en plats direkt utan markerar den för borttagning. Under ”Borttagna platser” återställer ↶ den när som helst; koordinater och metadata bevaras."
          ]
        ],
        "notes": [
          "Att kartan flyttas är i sig inget bevis på att Blitzortung redan har bytt sin live-dataregion. Den inbyggda integrationen använder device_tracker.gewitterradar i stället för Dashboard-spåraren."
        ]
      },
      {
        "key": "mapview",
        "title": "Kartvyer och 3D-lagerknapp",
        "layerGraphic": true,
        "layerGraphicAlt": "3D-lagerknapp i guld, blått och rött",
        "layerGraphicCaption": "Med lagerväljaren kan kartvyn när som helst växlas mellan Standard, Stor och Helskärm.",
        "paragraphs": [],
        "entries": [
          [
            "Standard",
            "Använder normal karthöjd i Gewitterradar-kortet."
          ],
          [
            "Stor",
            "Förstorar kartan i instrumentpanelen och ger mer kartyta utan att öppna helskärmsläget."
          ],
          [
            "Helskärm",
            "Öppnar kartan i helskärmsläge. Platsknappen, kompassen, medaljongen, teckenförklaringen och kartkontrollerna är fortfarande tillgängliga."
          ],
          [
            "Kartvisning i Inställningar",
            "Avsnittet „Kartvisning“ styr standardvyn för den här enheten eller webbläsarprofilen samt det separata kartfönstret."
          ],
          [
            "Standardvy",
            "Bestämmer om Gewitterradar startar i Standard, Stor, Helskärm eller med den senast använda kartvyn. Valet sparas endast lokalt på den aktuella enheten eller i den använda webbläsarprofilen."
          ],
          [
            "Separat kartfönster",
            "Öppnar åskvyn med den för närvarande valda kartan och kompassen i ett separat fönster. Den vanliga instrumentpanelsvyn förblir separat. Funktionen är tillgänglig via menyn Inställningar."
          ]
        ],
        "notes": []
      },
      {
        "key": "external_services",
        "title": "Externa tjänster & nätverksåtkomst",
        "paragraphs": [
          "Gewitterradar använder två nätverksvägar: karta och sökning går direkt från webbläsare/Companion App, medan Blitzortung-live-data hämtas av Blitzortung-integrationen på Home Assistant-servern. Brandvägg, VLAN, proxy, DNS-filter och TLS-inspektion måste därför kontrolleras separat.",
          "Målen nedan är det aktuella V4.07-runtimeinventariet. Lokalt platsbibliotek, tracker och Home Assistant-tjänster behöver ingen Internetåtkomst."
        ],
        "entries": [
          [
            "Klient · Open-Meteo-geokodning",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · primär global sökning; skickar söktext, språk och endast vid uttryckligt landsfilter ISO-kod. Vid fel används Nominatim."
          ],
          [
            "Klient · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · reserv; skickar söktext, språk och ev. ISO-kod. Publika anrop separeras med minst en sekund och lokal landautofyllnad gör inga nätverksanrop. Om båda blockeras fungerar sparade platser fortfarande lokalt."
          ],
          [
            "Klient · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · laddar Leaflet 1.9.4 JavaScript/CSS. Utan cachead Leaflet kan kartan inte initieras om värden blockeras."
          ],
          [
            "Klient · OpenStreetMap-kartor",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · baskartor. Vid blockering kan data finnas men baskartan blir tom/ofullständig."
          ],
          [
            "Server · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · utgående från Home Assistant-servern. Blitzortung v1.7.1 använder broker/geohash-ämnen för live-blixtar; blockering stoppar nya data men inte sökning/karta."
          ],
          [
            "Lokalt · ingen extern åtkomst",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, koordinattjänst, dashboardskript och Local to-do-listan “Gewitterradar Orte” kör lokalt."
          ],
          [
            "Installation / uppdatering",
            "GitHub/HACS används för installation/uppdatering, inte som runtimeberoende för den öppna kartan."
          ],
          [
            "Snabbdiagnos",
            "Sökning fel: Open-Meteo/Nominatim. Karta startar inte: unpkg.com. Tom baskarta: OSM-kakelvärdar. Saknade/gamla blixtar: blitzortung.ha.sed.pl:1883 och Blitzortung-integrationen."
          ]
        ],
        "notes": [
          "DNS måste fungera på klient och Home Assistant-server för respektive mål.",
          "HTTPS-proxy, TLS-inspektion, filter, blockerare eller tillägg kan stoppa anrop trots öppen TCP 443; kontrollera även CORS/svarsfilter för geokodning.",
          "Integritet: geokodning får söktext/parametrar, OSM-kartor avslöjar tekniskt visat område och Blitzortung-brokern får prenumererade region-/geohash-ämnen.",
          "http://www.w3.org/2000/svg är bara SVG-namnområdet, inte ett externt nätverksanrop.",
          "Runtimeinventariet bevakas automatiskt: ett nytt fast externt URL-mål ska bryta testet tills dokumentation och åtkomstlista uppdaterats."
        ]
      },
      {
        "key": "functions",
        "title": "Viktiga funktioner",
        "entries": [
          [
            "Auraeffekter",
            "visualiserar blixtaktivitet men ändrar inte detektering eller räkning."
          ],
          [
            "Varningsanimation",
            "framhäver relevant åskaktivitet visuellt."
          ],
          [
            "Kartgruppering",
            "samlar närliggande blixtmarkörer och håller kartan tydlig."
          ],
          [
            "Kompass: närmaste blixt",
            "riktar visningen mot den närmaste detekterade blixten."
          ],
          [
            "Enhetsorientering",
            "kan använda orienteringen på mobila enheter som stöds."
          ],
          [
            "Separat kartfönster",
            "Öppnar åskvyn med den för närvarande valda kartan och kompassen i ett separat fönster. Den vanliga instrumentpanelsvyn förblir separat. Funktionen är tillgänglig via menyn Inställningar."
          ],
          [
            "Kalibrering och diagnostik",
            "ger verktyg för riktad kontroll, mätning och felsökning av visningen och enskilda komponenter. Det omfattar bland annat kalibrering av kompass och medaljong, diagnosvyer och testfunktioner som åsksimulering. Verktygen är avsedda för konfiguration, utveckling och felsökning och bör vara avstängda under normal drift."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Rekommenderade grundinställningar",
        "paragraphs": [
          "För en stabil start rekommenderar vi:"
        ],
        "entries": [
          [
            "Testvärden · 500 km / 120 min / 200",
            "500 km detekteringsradie, 120 minuters tidsfönster och 200 blixtar är exempelvärden för test, inte obligatoriska inställningar. De kan anpassas efter användning, önskad observationsräckvidd och personliga behov."
          ],
          [
            "Samordna plats & tracker",
            "Samordna inställningarna i Blitzortung för både den plats som är konfigurerad där och trackern som Gewitterradar använder. Då förblir dataregion och visning konsekventa."
          ],
          [
            "Samordna radier",
            "Ställ Blitzortungs källradie minst lika stor som Gewitterradars observationsradie."
          ],
          [
            "Låt vara aktiverat",
            "Låt kartgruppering och varningsanimation vara aktiverade."
          ],
          [
            "Valfritt",
            "Anpassa auraeffekter efter eget önskemål; de påverkar inte detekteringen. Aktivera enhetsorientering endast när den behövs på den mobila enhet som används."
          ],
          [
            "Normal drift",
            "Låt verktygen under “Kalibrering och diagnostik”, särskilt åsksimulering, vara avstängda under normal drift."
          ],
          [
            "Recorder – kontrollera",
            "Kontrollera Recorder-undantag för ofta uppdaterade blixt- och positionsdata. Utan lämpliga undantag kan Home Assistant-databasen och säkerhetskopior växa mycket snabbt. Se “Home Assistant Recorder” för detaljer och YAML."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Om något inte fungerar",
        "entries": [
          [
            "Inga eller för få blixtar",
            "Kontrollera källans status, källradien och de blixtentiteter som används."
          ],
          [
            "Avstånd eller riktningar verkar fel",
            "Kontrollera referensplats och avståndsenhet."
          ],
          [
            "Säkerhetskopian växer ovanligt snabbt",
            "Saknade Recorder-undantag för ofta uppdaterade blixt- och positionsdata kan få Home Assistant-databasen och därmed säkerhetskopior att växa mycket snabbt. Kontrollera Recorder-inställningarna; se “Home Assistant Recorder” för detaljer och YAML."
          ],
          [
            "Språkvalet visas igen",
            "Kontrollera att aktuellt Gewitterradar-paket och initialiseringshjälparen är installerade."
          ],
          [
            "Visningen är oförändrad efter uppdatering",
            "Ladda om webbläsarens/appens cache helt och säkerställ att aktuell JavaScript-fil används."
          ],
          [
            "Oväntat beteende eller dubbelt kort",
            "Endast EN Gewitterradar-modulresurs får vara aktiv i Home Assistant. Den inbyggda integrationen och Dashboard-/HACS-resursen får inte registrera samma anpassade kort samtidigt."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Blixtdata kan skapa väldigt många tillståndsändringar. För en slimmad Recorder-konfiguration över tid rekommenderar vi att följande entiteter och mönster undantas."
        ],
        "recorder": true,
        "notes": [
          "Om en recorder:-sektion redan finns ska posterna läggas till där. Skapa inte ett andra recorder:-block på toppnivå.",
          "Undantagen inaktiverar INTE de live-tillstånd som Gewitterradar använder.",
          "Befintliga historiska data tas inte bort automatiskt.",
          "Jokermönstren stöder flera blixtdetektorer eller observationspunkter oberoende av entitetsprefix."
        ]
      }
    ]
  },
  "Italiano": {
    "menuTitle": "Aiuto e note",
    "title": "Aiuto e note",
    "subtitle": "Una guida concisa per mantenere Gewitterradar affidabile e facile da comprendere.",
    "close": "Chiudi aiuto",
    "copy": "Copia YAML",
    "copied": "Copiato",
    "copyFailed": "Copia non disponibile — seleziona il codice.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Prerequisiti",
        "paragraphs": [
          "Gewitterradar elabora i dati dei fulmini che Home Assistant riceve dalla sorgente di rilevamento configurata. Verifica lì la posizione di riferimento corretta e imposta il raggio della sorgente almeno pari al raggio di osservazione di Gewitterradar. Gewitterradar non può mostrare o valutare scariche già filtrate dalla sorgente."
        ],
        "notes": [
          "Se sono presenti più rilevatori o punti di osservazione, le entità usate devono appartenere chiaramente al punto di riferimento desiderato."
        ]
      },
      {
        "key": "radii",
        "title": "I raggi",
        "paragraphs": [
          "I raggi sono cumulativi: una scarica nel raggio di pericolo conta anche nei raggi di temporale e osservazione. Sono soglie di distanza, non sorgenti dati separate.",
          "In «Risoluzione dei cluster» scegli quando i cluster vengono separati in singole scariche durante lo zoom. Precoce li separa prima, Bilanciata usa la taratura V4.08 dipendente dalle zone già collaudata e Tardiva mantiene i cluster raggruppati più a lungo."
        ],
        "items": [
          "Raggio di osservazione – area esterna per l’osservazione anticipata.",
          "Raggio di temporale – area più vicina che richiede maggiore attenzione.",
          "Raggio di pericolo – zona immediata di particolare rilevanza."
        ],
        "notes": [
          "Il raggio di pericolo è limitato a un massimo di 250 km. Consulta “Impostazioni di base consigliate” per i valori iniziali raccomandati e il necessario coordinamento con l’app Blitzortung."
        ],
        "featureBlocks": [
          {
            "title": "Navigazione dei cluster · durata sessione",
            "body": "stabilisce per quanto tempo una navigazione dei cluster già avviata rimane attiva. Il conto alla rovescia può essere impostato liberamente tra 5 e 3600 secondi. {{INFINITY}} mantiene la sessione aperta senza limite. Il conto alla rovescia e {{INFINITY}} possono essere alternati direttamente nell’indicatore di stato durante la navigazione.",
            "infinityAlt": "Senza limite"
          }
        ]
      },
      {
        "key": "location",
        "title": "Posizione e luoghi salvati",
        "paragraphs": [
          "Il luogo selezionato è il punto di riferimento dal quale Gewitterradar calcola distanze e direzioni. Tramite la ricerca mondiale dei luoghi o l’inserimento diretto delle coordinate, questo punto di riferimento può essere impostato indipendentemente dalla posizione reale di Home Assistant. I luoghi salvati vengono memorizzati localmente in Home Assistant."
        ],
        "entries": [
          [
            "Tracker di posizione e Blitzortung",
            "Gewitterradar utilizza una posizione virtuale come tracker per i luoghi scelti liberamente. Nella variante Dashboard/Package della V4.07 viene usato device_tracker.gewitterradar_dashboard; l’integrazione nativa utilizza device_tracker.gewitterradar. Affinché i dati sui fulmini seguano la posizione virtuale selezionata, l’integrazione Blitzortung deve utilizzare lo stesso tracker come sorgente di posizione.\n↳ Configurare Blitzortung:\nImpostazioni → Dispositivi e servizi → Blitzortung → Aggiungi voce. Seleziona «Location entity» come tipo di configurazione e poi il tracker Gewitterradar appropriato come entità di posizione. Una voce esistente con latitudine/longitudine fisse non può essere convertita in un’entità di posizione tramite «Riconfigura». In questo caso crea una nuova voce, verificala e solo dopo disattiva o elimina la vecchia voce con coordinate fisse."
          ],
          [
            "Ricerca mondiale dei luoghi e coordinate",
            "La ricerca mondiale consente di cercare località e codici postali e usarli come posizione di riferimento. In alternativa, una posizione può essere definita direttamente tramite latitudine e longitudine. L’utilizzo si divide nei due metodi seguenti:"
          ],
          [
            "↳ Applica luogo",
            "Applica imposta immediatamente il luogo selezionato nella ricerca mondiale come posizione di riferimento, chiude automaticamente la ricerca e sposta la mappa direttamente sulla nuova posizione."
          ],
          [
            "↳ Inserisci direttamente le coordinate",
            "In Google Maps sul desktop fai clic con il pulsante destro sul punto desiderato, copia le coordinate dal menu contestuale e incollale in «Lat / Lon». In alternativa, puoi ricavare le coordinate con MapTiler Coordinates: https://www.maptiler.com/tools/coordinates/ . Esempio (Lat / Lon): 53.837691, 9.956105. Gewitterradar utilizza gradi decimali; una descrizione libera è facoltativa."
          ],
          [
            "Configurare l’elenco dei luoghi salvati",
            "Per poter salvare luoghi o coordinate e richiamarli in seguito comodamente dal menu di Gewitterradar, occorre creare una sola volta un’area di archiviazione tramite la funzione To-do di Home Assistant.\n↳ Configurazione:\nImpostazioni → Dispositivi e servizi → Aggiungi integrazione → cerca «Local To-do» e seleziona l’integrazione. Assegna esattamente «Gewitterradar Orte» come nome dell’elenco e completa la configurazione."
          ],
          [
            "Luoghi salvati",
            "★ Salva memorizza in modo permanente e locale i luoghi trovati. Compaiono nel menu della posizione sotto «Luoghi salvati» e possono essere riutilizzati senza una nuova ricerca. × non elimina subito un luogo, ma lo contrassegna per la rimozione. In «Luoghi rimossi», ↶ lo ripristina in qualsiasi momento; coordinate e metadati vengono conservati."
          ]
        ],
        "notes": [
          "Il solo spostamento della mappa non dimostra che Blitzortung abbia già cambiato la propria regione di dati in tempo reale. L’integrazione nativa utilizza device_tracker.gewitterradar al posto del tracker Dashboard."
        ]
      },
      {
        "key": "mapview",
        "title": "Viste mappa e pulsante livelli 3D",
        "layerGraphic": true,
        "layerGraphicAlt": "Pulsante livelli 3D in oro, blu e rosso",
        "layerGraphicCaption": "Il selettore dei livelli consente di passare in qualsiasi momento tra le viste Standard, Grande e Schermo intero.",
        "paragraphs": [],
        "entries": [
          [
            "Standard",
            "Utilizza l’altezza normale della mappa all’interno della scheda Gewitterradar."
          ],
          [
            "Grande",
            "Ingrandisce la mappa all’interno della dashboard e offre più spazio senza aprire la modalità a schermo intero."
          ],
          [
            "Schermo intero",
            "Apre la mappa a schermo intero. La pillola della posizione, la bussola, il medaglione, la legenda e i controlli della mappa restano disponibili."
          ],
          [
            "Visualizzazione mappa nelle Impostazioni",
            "La sezione „Visualizzazione mappa“ controlla la vista predefinita per questo dispositivo o profilo del browser e la finestra mappa separata."
          ],
          [
            "Vista predefinita",
            "Stabilisce se Gewitterradar si avvia in Standard, Grande, Schermo intero oppure con l’ultima vista mappa utilizzata. La scelta viene salvata solo localmente sul dispositivo o nel profilo del browser in uso."
          ],
          [
            "Finestra mappa separata",
            "Apre la vista dei temporali con la mappa e la bussola attualmente selezionate in una finestra separata. La normale vista della dashboard rimane distinta. Questa funzione è disponibile tramite il menu Impostazioni."
          ]
        ],
        "notes": []
      },
      {
        "key": "external_services",
        "title": "Servizi esterni e autorizzazioni di rete",
        "paragraphs": [
          "Gewitterradar usa due percorsi di rete: mappa e ricerca partono direttamente dal browser/Companion App, mentre i dati live Blitzortung vengono recuperati dall’integrazione sul server Home Assistant. Firewall, VLAN, proxy, filtro DNS e ispezione TLS vanno quindi verificati separatamente.",
          "Le destinazioni seguenti sono l’inventario runtime V4.07 attuale. Libreria locale, tracker e servizi Home Assistant non richiedono Internet."
        ],
        "entries": [
          [
            "Client · geocodifica Open-Meteo",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · ricerca globale primaria; invia query, lingua e solo con filtro paese esplicito il codice ISO. In caso di errore usa Nominatim."
          ],
          [
            "Client · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · fallback; invia query, lingua ed eventuale codice ISO. Le chiamate pubbliche sono distanziate di almeno un secondo e il completamento locale dei paesi non effettua chiamate di rete. Se entrambi sono bloccati, i luoghi salvati restano disponibili."
          ],
          [
            "Client · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · carica Leaflet 1.9.4 JavaScript/CSS. Senza Leaflet in cache, bloccare l’host impedisce l’avvio della mappa."
          ],
          [
            "Client · tile OpenStreetMap",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · tile di base. Se bloccate, i dati possono esserci ma la mappa base resta vuota/incompleta."
          ],
          [
            "Server · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · uscita dal server Home Assistant. Blitzortung v1.7.1 usa broker e topic geohash per i fulmini live; il blocco ferma nuovi dati ma non ricerca/mappa."
          ],
          [
            "Locale · nessuna autorizzazione esterna",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, servizio coordinate, script dashboard e lista Local to-do “Gewitterradar Orte” funzionano localmente."
          ],
          [
            "Installazione / aggiornamento",
            "GitHub/HACS servono per installazione/aggiornamento, non sono dipendenze runtime della mappa aperta."
          ],
          [
            "Diagnosi rapida",
            "Ricerca non funziona: Open-Meteo/Nominatim. Mappa non parte: unpkg.com. Base vuota: host tile OSM. Fulmini assenti/vecchi: blitzortung.ha.sed.pl:1883 e integrazione Blitzortung."
          ]
        ],
        "notes": [
          "Il DNS deve funzionare su client e server Home Assistant per le rispettive destinazioni.",
          "Proxy HTTPS, ispezione TLS, filtri, blocchi o estensioni possono impedire richieste nonostante TCP 443 aperta; per la geocodifica verificare anche CORS/filtri di risposta.",
          "Privacy: la geocodifica riceve query/parametri, le tile OSM rivelano tecnicamente l’area visualizzata e il broker Blitzortung riceve i topic regione/geohash sottoscritti.",
          "http://www.w3.org/2000/svg è solo lo spazio dei nomi SVG, non una chiamata di rete esterna.",
          "L’inventario runtime è protetto automaticamente: una nuova URL esterna fissa deve far fallire il test finché documentazione e permessi non vengono aggiornati."
        ]
      },
      {
        "key": "functions",
        "title": "Funzioni importanti",
        "entries": [
          [
            "Effetti aura",
            "visualizzano l’attività dei fulmini ma non modificano rilevamento o conteggio."
          ],
          [
            "Animazione di avviso",
            "evidenzia visivamente l’attività temporalesca rilevante."
          ],
          [
            "Raggruppamento mappa",
            "unisce i marcatori vicini e mantiene ordinata la mappa."
          ],
          [
            "Bussola: fulmine più vicino",
            "orienta la vista verso la scarica rilevata più vicina."
          ],
          [
            "Orientamento dispositivo",
            "può utilizzare l’orientamento sui dispositivi mobili supportati."
          ],
          [
            "Finestra mappa separata",
            "Apre la vista dei temporali con la mappa e la bussola attualmente selezionate in una finestra separata. La normale vista della dashboard rimane distinta. Questa funzione è disponibile tramite il menu Impostazioni."
          ],
          [
            "Calibrazione e diagnostica",
            "fornisce strumenti per controlli mirati, misurazioni e diagnostica della visualizzazione e dei singoli componenti. Comprende, tra l’altro, calibrazione della bussola e del medaglione, viste diagnostiche e funzioni di test come la simulazione di temporale. Questi strumenti sono destinati alla configurazione, allo sviluppo e alla risoluzione dei problemi e devono restare disattivati durante il normale funzionamento."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Impostazioni di base consigliate",
        "paragraphs": [
          "Per un avvio stabile consigliamo:"
        ],
        "entries": [
          [
            "Valori di prova · 500 km / 120 min / 200",
            "Un raggio di rilevamento di 500 km, una finestra di 120 minuti e 200 fulmini sono valori di esempio per i test, non impostazioni obbligatorie. Possono essere adattati all’uso, alla portata di osservazione desiderata e alle esigenze personali."
          ],
          [
            "Coordinare luogo & tracker",
            "Configura in Blitzortung le impostazioni corrispondenti sia per il luogo configurato lì sia per il tracker usato da Gewitterradar. In questo modo regione dati e visualizzazione restano coerenti."
          ],
          [
            "Coordinare i raggi",
            "Imposta il raggio della sorgente Blitzortung almeno quanto il raggio di osservazione di Gewitterradar."
          ],
          [
            "Lasciare attivo",
            "Lascia attivi il raggruppamento della mappa e l’animazione di avviso."
          ],
          [
            "Opzionale",
            "Regola gli effetti aura secondo le preferenze; non influenzano il rilevamento. Attiva l’orientamento del dispositivo solo quando serve sul dispositivo mobile utilizzato."
          ],
          [
            "Funzionamento normale",
            "Lascia disattivati durante il normale funzionamento gli strumenti di “Calibrazione e diagnostica”, in particolare la simulazione di temporale."
          ],
          [
            "Recorder – controllare",
            "Controlla le esclusioni del Recorder per i dati di fulmini e posizione aggiornati di frequente. Senza esclusioni adeguate, il database di Home Assistant e i backup possono crescere molto rapidamente. Vedi “Home Assistant Recorder” per dettagli e YAML."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Se qualcosa non funziona",
        "entries": [
          [
            "Nessun fulmine o troppo pochi",
            "Controlla stato della sorgente, raggio sorgente ed entità fulmine usate."
          ],
          [
            "Distanze o direzioni errate",
            "Controlla posizione di riferimento e unità di distanza."
          ],
          [
            "Il backup cresce insolitamente in fretta",
            "La mancanza di esclusioni del Recorder per dati di fulmini e posizione aggiornati di frequente può far crescere molto rapidamente il database di Home Assistant e quindi anche i backup. Controlla il Recorder; vedi “Home Assistant Recorder” per dettagli e YAML."
          ],
          [
            "La selezione lingua ricompare",
            "Verifica che siano installati il package Gewitterradar corrente e l’helper di inizializzazione."
          ],
          [
            "Aspetto invariato dopo l’aggiornamento",
            "Ricarica completamente la cache del browser/app e verifica che venga usato il JavaScript corrente."
          ],
          [
            "Comportamento anomalo o scheda doppia",
            "In Home Assistant può essere attiva una sola risorsa modulo Gewitterradar. L’integrazione nativa e la risorsa Dashboard/HACS non devono registrare contemporaneamente la stessa custom card."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "I dati dei fulmini possono generare moltissimi cambiamenti di stato. Per una configurazione Recorder snella nel tempo consigliamo di escludere le seguenti entità e i relativi modelli."
        ],
        "recorder": true,
        "notes": [
          "Se esiste già una sezione recorder:, integra lì queste voci. Non creare un secondo blocco recorder: di primo livello.",
          "Le esclusioni NON disattivano gli stati live usati da Gewitterradar.",
          "I dati storici esistenti non vengono rimossi automaticamente.",
          "I modelli wildcard supportano più rilevatori o punti di osservazione indipendentemente dal prefisso delle entità."
        ]
      }
    ]
  },
  "Norsk bokmål": {
    "menuTitle": "Hjelp og merknader",
    "title": "Hjelp og merknader",
    "subtitle": "En kort veiledning som holder Gewitterradar pålitelig og lett å forstå.",
    "close": "Lukk hjelp",
    "copy": "Kopier YAML",
    "copied": "Kopiert",
    "copyFailed": "Kopiering er ikke tilgjengelig – marker koden.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Forutsetninger",
        "paragraphs": [
          "Gewitterradar behandler lyndataene som Home Assistant mottar fra den konfigurerte lyndeteksjonskilden. Kontroller riktig referansested der, og sett kilderadius minst like stor som observasjonsradiusen i Gewitterradar. Gewitterradar kan ikke vise eller vurdere lynnedslag som allerede er filtrert bort av kilden."
        ],
        "notes": [
          "Hvis flere lyndetektorer eller observasjonspunkter finnes, må entitetene som brukes tydelig tilhøre ønsket referansepunkt."
        ]
      },
      {
        "key": "radii",
        "title": "Radiene",
        "paragraphs": [
          "Radiene er kumulative: Et lynnedslag innenfor fareradiusen teller også innenfor torden- og observasjonsradiusen. Områdene er avstandsgrenser, ikke separate datakilder.",
          "Under «Klyngeoppløsning» velger du når klynger skal løses opp til enkeltlyn når du zoomer inn. Tidlig løser opp tidligere, Balansert bruker den hittil utprøvde soneavhengige V4.08-innstillingen, og Sen holder klynger samlet lenger."
        ],
        "items": [
          "Observasjonsradius – ytre område for tidlig observasjon.",
          "Tordenradius – nærmere område som krever økt oppmerksomhet.",
          "Fareradius – umiddelbar nærhet med særlig høy relevans."
        ],
        "notes": [
          "Fareradiusen er begrenset til maksimalt 250 km. Se “Anbefalte grunninnstillinger” for anbefalte startverdier og nødvendig samordning med Blitzortung-appen."
        ],
        "featureBlocks": [
          {
            "title": "Klyngenavigasjon · øktvarighet",
            "body": "bestemmer hvor lenge en påbegynt klyngenavigasjon forblir aktiv. Nedtellingstiden kan stilles fritt mellom 5 og 3600 sekunder. {{INFINITY}} holder økten åpen uten tidsbegrensning. Nedtelling og {{INFINITY}} kan byttes direkte i statusvisningen under navigasjonen.",
            "infinityAlt": "Ubegrenset"
          }
        ]
      },
      {
        "key": "location",
        "title": "Plassering og lagrede steder",
        "paragraphs": [
          "Det valgte stedet er referansepunktet Gewitterradar bruker til å beregne avstander og retninger. Med det verdensomspennende stedsøket eller direkte innskriving av koordinater kan dette referansepunktet settes uavhengig av den faktiske Home Assistant-plasseringen. Lagrede steder lagres lokalt i Home Assistant."
        ],
        "entries": [
          [
            "Plasseringstracker og Blitzortung",
            "Gewitterradar bruker en virtuell plassering som tracker for fritt valgte steder. I Dashboard-/Package-varianten av V4.07 er dette device_tracker.gewitterradar_dashboard; den native integrasjonen bruker device_tracker.gewitterradar. For at lyndataene skal følge den valgte virtuelle plasseringen, må Blitzortung-integrasjonen bruke den samme trackeren som plasseringskilde.\n↳ Sett opp Blitzortung:\nInnstillinger → Enheter og tjenester → Blitzortung → Legg til oppføring. Velg «Location entity» som konfigurasjonstype, og velg deretter den aktuelle Gewitterradar-trackeren som plasseringsentitet. En eksisterende oppføring med faste bredde-/lengdegrader kan ikke konverteres til en plasseringsentitet via «Konfigurer på nytt». Opprett i så fall en ny oppføring, kontroller den, og deaktiver eller slett først deretter den gamle koordinatoppføringen."
          ],
          [
            "Verdensomspennende stedsøk og koordinater",
            "Med det verdensomspennende stedsøket kan steder og postnumre søkes opp og brukes som referanseplassering. Alternativt kan en plassering angis direkte med bredde- og lengdegrad. Bruken er delt inn i de to følgende måtene:"
          ],
          [
            "↳ Bruk sted",
            "Bruk setter umiddelbart stedet som er valgt i det verdensomspennende søket som referanseplassering, lukker stedsøket automatisk og flytter kartet direkte til den nye plasseringen."
          ],
          [
            "↳ Angi koordinater direkte",
            "I Google Maps på datamaskin kan du høyreklikke på ønsket punkt, kopiere koordinatene fra hurtigmenyen og lime dem inn under «Lat / Lon». Alternativt kan koordinater finnes via MapTiler Coordinates: https://www.maptiler.com/tools/coordinates/ . Eksempel (Lat / Lon): 53.837691, 9.956105. Gewitterradar bruker desimalgrader; en valgfri betegnelse kan angis."
          ],
          [
            "Sett opp liste for lagrede steder",
            "For at steder eller koordinater skal kunne lagres og senere åpnes enkelt fra Gewitterradar-menyen, må et lagringsområde opprettes én gang via To-do-funksjonen i Home Assistant.\n↳ Oppsett:\nInnstillinger → Enheter og tjenester → Legg til integrasjon → søk etter «Local To-do» og velg integrasjonen. Bruk nøyaktig «Gewitterradar Orte» som listenavn, og fullfør oppsettet."
          ],
          [
            "Lagrede steder",
            "★ Lagre lagrer funne steder permanent lokalt. De vises i plasseringsmenyen under «Lagrede steder» og kan brukes uten et nytt stedsøk. × sletter ikke et sted med én gang, men markerer det for fjerning. Under «Fjernede steder» gjenoppretter ↶ det når som helst; koordinater og metadata beholdes."
          ]
        ],
        "notes": [
          "At kartet flyttes, beviser ikke i seg selv at Blitzortung allerede har byttet region for live-data. Den native integrasjonen bruker device_tracker.gewitterradar i stedet for Dashboard-trackeren."
        ]
      },
      {
        "key": "mapview",
        "title": "Kartvisninger og 3D-lagknapp",
        "layerGraphic": true,
        "layerGraphicAlt": "3D-lagknapp i gull, blått og rødt",
        "layerGraphicCaption": "Med lagvelgeren kan kartvisningen når som helst byttes mellom Standard, Stor og Fullskjerm.",
        "paragraphs": [],
        "entries": [
          [
            "Standard",
            "Bruker normal karthøyde i Gewitterradar-kortet."
          ],
          [
            "Stor",
            "Forstørrer kartet i dashbordet og gir mer kartflate uten å åpne fullskjermmodus."
          ],
          [
            "Fullskjerm",
            "Åpner kartet i fullskjerm. Posisjonspillen, kompasset, medaljongen, tegnforklaringen og kartkontrollene er fortsatt tilgjengelige."
          ],
          [
            "Kartvisning i Innstillinger",
            "Området „Kartvisning“ styrer standardvisningen for denne enheten eller nettleserprofilen samt det separate kartvinduet."
          ],
          [
            "Standardvisning",
            "Bestemmer om Gewitterradar starter i Standard, Stor, Fullskjerm eller med sist brukte kartvisning. Valget lagres bare lokalt på den aktuelle enheten eller i nettleserprofilen som brukes."
          ],
          [
            "Eget kartvindu",
            "Åpner tordenværsvisningen med det valgte kartet og det valgte kompasset i et eget vindu. Den vanlige dashbordvisningen forblir separat. Funksjonen er tilgjengelig via menyen Innstillinger."
          ]
        ],
        "notes": []
      },
      {
        "key": "external_services",
        "title": "Eksterne tjenester og nettverkstilgang",
        "paragraphs": [
          "Gewitterradar bruker to nettverksveier: kart og søk går direkte fra nettleser/Companion App, mens Blitzortung-live-data hentes av Blitzortung-integrasjonen på Home Assistant-serveren. Brannmur, VLAN, proxy, DNS-filter og TLS-inspeksjon må derfor kontrolleres separat.",
          "Målene nedenfor er dagens V4.07-runtimeinventar. Lokalt stedsbibliotek, tracker og Home Assistant-tjenester trenger ikke Internett."
        ],
        "entries": [
          [
            "Klient · Open-Meteo-geokoding",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · primært globalt søk; sender søketekst, språk og kun ved eksplisitt landfilter ISO-kode. Ved feil brukes Nominatim."
          ],
          [
            "Klient · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · reserve; sender søketekst, språk og eventuell ISO-kode. Offentlige kall har minst ett sekund mellomrom, og lokal landautofullføring gjør ingen nettverkskall. Hvis begge blokkeres, virker lagrede steder fortsatt lokalt."
          ],
          [
            "Klient · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · laster Leaflet 1.9.4 JavaScript/CSS. Uten cachet Leaflet kan kartet ikke starte hvis verten blokkeres."
          ],
          [
            "Klient · OpenStreetMap-fliser",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · grunnkartfliser. Ved blokkering kan data finnes, men grunnkartet blir tomt/ufullstendig."
          ],
          [
            "Server · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · utgående fra Home Assistant-serveren. Blitzortung v1.7.1 bruker broker/geohash-emner for live-lyn; blokkering stopper nye data men ikke søk/kart."
          ],
          [
            "Lokalt · ingen ekstern tilgang",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, koordinattjeneste, dashboardskript og Local to-do-listen “Gewitterradar Orte” kjører lokalt."
          ],
          [
            "Installasjon / oppdatering",
            "GitHub/HACS brukes til installasjon/oppdatering, ikke som runtimeavhengighet for det åpne kartet."
          ],
          [
            "Hurtigdiagnose",
            "Søk feiler: Open-Meteo/Nominatim. Kart starter ikke: unpkg.com. Tomt grunnkart: OSM-flisverter. Manglende/gamle lyn: blitzortung.ha.sed.pl:1883 og Blitzortung-integrasjonen."
          ]
        ],
        "notes": [
          "DNS må fungere på klient og Home Assistant-server for respektive mål.",
          "HTTPS-proxy, TLS-inspeksjon, filtre, blokkere eller utvidelser kan stoppe forespørsler selv med TCP 443 åpen; for geokoding må også CORS/svarfiltre sjekkes.",
          "Personvern: geokoding mottar søketekst/parametere, OSM-fliser avslører teknisk vist kartområde, og Blitzortung-brokeren mottar abonnerte region-/geohash-emner.",
          "http://www.w3.org/2000/svg er bare SVG-navnerommet, ikke et eksternt nettverkskall.",
          "Runtimeinventaret er automatisk sikret: et nytt fast eksternt URL-mål skal feile testen til dokumentasjon og tillatelser er oppdatert."
        ]
      },
      {
        "key": "functions",
        "title": "Viktige funksjoner",
        "entries": [
          [
            "Auraeffekter",
            "visualiserer lynaktivitet, men endrer ikke deteksjon eller telling."
          ],
          [
            "Varselanimasjon",
            "fremhever relevant tordenværaktivitet visuelt."
          ],
          [
            "Kartgruppering",
            "samler nærliggende markører og holder kartet oversiktlig."
          ],
          [
            "Kompass: nærmeste lyn",
            "retter visningen mot nærmeste registrerte lynnedslag."
          ],
          [
            "Enhetsretning",
            "kan bruke retningen på støttede mobilenheter."
          ],
          [
            "Eget kartvindu",
            "Åpner tordenværsvisningen med det valgte kartet og det valgte kompasset i et eget vindu. Den vanlige dashbordvisningen forblir separat. Funksjonen er tilgjengelig via menyen Innstillinger."
          ],
          [
            "Kalibrering og diagnostikk",
            "gir verktøy for målrettet kontroll, måling og feilsøking av visningen og enkeltkomponenter. Dette omfatter blant annet kalibrering av kompass og medaljong, diagnosevisninger og testfunksjoner som tordenværsimulering. Verktøyene er beregnet for oppsett, utvikling og feilsøking og bør være deaktivert under normal drift."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Anbefalte grunninnstillinger",
        "paragraphs": [
          "For en stabil start anbefaler vi:"
        ],
        "entries": [
          [
            "Testverdier · 500 km / 120 min / 200",
            "500 km registreringsradius, 120 minutters tidsvindu og 200 lyn er eksempelverdier for test, ikke obligatoriske innstillinger. De kan tilpasses bruksområde, ønsket observasjonsrekkevidde og personlige behov."
          ],
          [
            "Samordne sted & tracker",
            "Samordne innstillingene i Blitzortung for både stedet som er konfigurert der og trackeren Gewitterradar bruker. Da forblir dataregion og visning konsistente."
          ],
          [
            "Samordne radier",
            "Sett Blitzortungs kilderadius minst like stor som Gewitterradars observasjonsradius."
          ],
          [
            "La være aktivert",
            "La kartgruppering og varslingsanimasjon være aktivert."
          ],
          [
            "Valgfritt",
            "Juster auraeffekter etter eget ønske; de påvirker ikke registreringen. Aktiver enhetsretning bare når det trengs på mobilenheten som brukes."
          ],
          [
            "Normal drift",
            "La verktøyene under “Kalibrering og diagnostikk”, spesielt tordenværsimulering, være deaktivert under normal drift."
          ],
          [
            "Recorder – kontroller",
            "Kontroller Recorder-unntak for ofte oppdaterte lyn- og posisjonsdata. Uten egnede unntak kan Home Assistant-databasen og sikkerhetskopier vokse svært raskt. Se “Home Assistant Recorder” for detaljer og YAML."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Hvis noe ikke fungerer",
        "entries": [
          [
            "Ingen eller for få lynnedslag",
            "Kontroller kildestatus, kilderadius og lynentitetene som brukes."
          ],
          [
            "Avstander eller retninger virker feil",
            "Kontroller referansested og avstandsenhet."
          ],
          [
            "Sikkerhetskopien vokser uvanlig raskt",
            "Manglende Recorder-unntak for ofte oppdaterte lyn- og posisjonsdata kan få Home Assistant-databasen og dermed sikkerhetskopier til å vokse svært raskt. Kontroller Recorder-innstillingene; se “Home Assistant Recorder” for detaljer og YAML."
          ],
          [
            "Språkvalget kommer stadig tilbake",
            "Kontroller at gjeldende Gewitterradar-pakke og initialiseringshjelper er installert."
          ],
          [
            "Visningen er uendret etter oppdatering",
            "Last nettleser-/appbufferen helt på nytt og kontroller at gjeldende JavaScript-fil brukes."
          ],
          [
            "Uventet oppførsel eller dobbelt kort",
            "Bare ÉN Gewitterradar-modulressurs kan være aktiv i Home Assistant. Den native integrasjonen og Dashboard-/HACS-ressursen må ikke registrere samme egendefinerte kort samtidig."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Lyndata kan skape svært mange tilstandsendringer. For en slank Recorder-konfigurasjon over tid anbefaler vi å utelate følgende entiteter og mønstre."
        ],
        "recorder": true,
        "notes": [
          "Hvis en recorder:-seksjon allerede finnes, legg oppføringene til der. Ikke opprett en ny recorder:-blokk på toppnivå.",
          "Unntakene deaktiverer IKKE live-tilstandene som Gewitterradar bruker.",
          "Eksisterende historiske data fjernes ikke automatisk.",
          "Jokermønstrene støtter flere lyndetektorer eller observasjonspunkter uavhengig av entitetsprefiks."
        ]
      }
    ]
  },
  "Suomi": {
    "menuTitle": "Ohje ja huomautukset",
    "title": "Ohje ja huomautukset",
    "subtitle": "Tiivis opas Gewitterradarin luotettavaan ja ymmärrettävään käyttöön.",
    "close": "Sulje ohje",
    "copy": "Kopioi YAML",
    "copied": "Kopioitu",
    "copyFailed": "Kopiointi ei onnistu – valitse koodi.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Edellytykset",
        "paragraphs": [
          "Gewitterradar käsittelee salamadataa, jonka Home Assistant saa määritetystä salamapaikannuslähteestä. Tarkista lähteessä oikea viitesijainti ja aseta lähteen säde vähintään Gewitterradarin havaintosäteen suuruiseksi. Gewitterradar ei voi näyttää tai arvioida salamoita, jotka lähde on jo suodattanut pois."
        ],
        "notes": [
          "Jos käytössä on useita paikantimia tai havaintopisteitä, käytettyjen entiteettien on kuuluttava yksiselitteisesti haluttuun viitepisteeseen."
        ]
      },
      {
        "key": "radii",
        "title": "Säteet",
        "paragraphs": [
          "Säteet ovat kumulatiivisia: vaarasäteen sisällä oleva salama lasketaan myös ukkos- ja havaintosäteeseen. Alueet ovat etäisyysrajoja, eivät erillisiä tietolähteitä.",
          "Kohdassa ”Klusterien purku” määrität, milloin klusterit puretaan yksittäisiksi salamoiksi lähennettäessä. Aikaisin purkaa aiemmin, Tasapainoinen käyttää tähän asti testattua aluekohtaista V4.08-säätöä ja Myöhään pitää klusterit koossa pidempään."
        ],
        "items": [
          "Havaintosäde – ulompi alue varhaiseen havainnointiin.",
          "Ukkossäde – lähempi alue, joka vaatii enemmän huomiota.",
          "Vaarasäde – välitön lähialue, jolla on erityisen suuri merkitys."
        ],
        "notes": [
          "Vaarasäde on rajoitettu enintään 250 kilometriin. Katso “Suositellut perusasetukset” suositelluista lähtöarvoista ja tarvittavasta yhteensovituksesta Blitzortung-sovelluksen kanssa."
        ],
        "featureBlocks": [
          {
            "title": "Klusterinavigointi · istunnon kesto",
            "body": "määrittää, kuinka kauan aloitettu klusterinavigointi pysyy aktiivisena. Lähtölaskennan ajan voi asettaa vapaasti 5–3600 sekunnin välille. {{INFINITY}} pitää istunnon avoinna ilman aikarajaa. Lähtölaskennan ja {{INFINITY}} välillä voi vaihtaa suoraan tilanäytöstä navigoinnin aikana.",
            "infinityAlt": "Rajoittamaton"
          }
        ]
      },
      {
        "key": "location",
        "title": "Sijainti ja tallennetut paikat",
        "paragraphs": [
          "Valittu paikka on viitepiste, josta Gewitterradar laskee etäisyydet ja suunnat. Maailmanlaajuisen paikkahaun tai koordinaattien suoran syötön avulla viitepiste voidaan määrittää riippumatta Home Assistantin todellisesta sijainnista. Tallennetut paikat säilytetään paikallisesti Home Assistantissa."
        ],
        "entries": [
          [
            "Sijaintiseurain ja Blitzortung",
            "Gewitterradar käyttää vapaasti valituille paikoille virtuaalista sijaintia seurainkohteena. V4.07:n Dashboard-/Package-versiossa se on device_tracker.gewitterradar_dashboard; natiivi integraatio käyttää kohdetta device_tracker.gewitterradar. Jotta salamatiedot seuraisivat valittua virtuaalista sijaintia, Blitzortung-integraation on käytettävä samaa seurainkohdetta sijaintilähteenä.\n↳ Määritä Blitzortung:\nAsetukset → Laitteet ja palvelut → Blitzortung → Lisää merkintä. Valitse määritystyypiksi ”Location entity” ja sen jälkeen sopiva Gewitterradar-seurain sijaintientiteetiksi. Kiinteillä leveys-/pituusasteilla luotua merkintää ei voi muuttaa sijaintientiteetiksi ”Määritä uudelleen” -toiminnolla. Luo tällöin uusi merkintä, tarkista se ja poista vanha koordinaattimerkintä käytöstä tai poista se vasta tämän jälkeen."
          ],
          [
            "Maailmanlaajuinen paikkahaku ja koordinaatit",
            "Maailmanlaajuisella paikkahaulla voidaan etsiä paikkoja ja postinumeroita ja käyttää niitä viitesijaintina. Sijainti voidaan vaihtoehtoisesti määrittää suoraan leveys- ja pituusasteella. Käyttö jakautuu kahteen seuraavaan tapaan:"
          ],
          [
            "↳ Ota paikka käyttöön",
            "Ota käyttöön asettaa maailmanlaajuisesta paikkahausta valitun paikan heti viitesijainniksi, sulkee paikkahaun automaattisesti ja siirtää kartan suoraan uuteen sijaintiin."
          ],
          [
            "↳ Syötä koordinaatit suoraan",
            "Google Mapsissa tietokoneella voit napsauttaa haluttua kohtaa hiiren oikealla painikkeella, kopioida koordinaatit pikavalikosta ja liittää ne kohtaan ”Lat / Lon”. Koordinaatit voi vaihtoehtoisesti määrittää MapTiler Coordinates -palvelulla: https://www.maptiler.com/tools/coordinates/ . Esimerkki (Lat / Lon): 53.837691, 9.956105. Gewitterradar käyttää desimaaliasteita; vapaavalintainen nimi on mahdollinen."
          ],
          [
            "Määritä tallennettujen paikkojen luettelo",
            "Jotta paikkoja tai koordinaatteja voidaan tallentaa ja myöhemmin avata helposti Gewitterradar-valikosta, Home Assistantin To-do-toiminnolla on luotava kerran tallennusalue.\n↳ Määritys:\nAsetukset → Laitteet ja palvelut → Lisää integraatio → etsi ”Local To-do” ja valitse integraatio. Anna luettelon nimeksi täsmälleen ”Gewitterradar Orte” ja viimeistele määritys."
          ],
          [
            "Tallennetut paikat",
            "★ Tallenna tallentaa löydetyt paikat pysyvästi paikallisesti. Ne näkyvät sijaintivalikon kohdassa ”Tallennetut paikat” ja niitä voi käyttää ilman uutta paikkahakua. × ei poista paikkaa heti, vaan merkitsee sen poistettavaksi. Kohdassa ”Poistetut paikat” ↶ palauttaa sen milloin tahansa; koordinaatit ja metatiedot säilyvät."
          ]
        ],
        "notes": [
          "Pelkkä kartan siirtyminen ei todista, että Blitzortung olisi jo vaihtanut live-datan aluettaan. Natiivi integraatio käyttää Dashboard-seuraimen sijasta kohdetta device_tracker.gewitterradar."
        ]
      },
      {
        "key": "mapview",
        "title": "Karttanäkymät ja 3D-tasopainike",
        "layerGraphic": true,
        "layerGraphicAlt": "3D-tasopainike kullanvärisenä, sinisenä ja punaisena",
        "layerGraphicCaption": "Tasovalitsimella karttanäkymän voi vaihtaa milloin tahansa Vakio-, Suuri- ja Koko näyttö -tilojen välillä.",
        "paragraphs": [],
        "entries": [
          [
            "Vakio",
            "Käyttää normaalia karttakorkeutta Gewitterradar-kortissa."
          ],
          [
            "Suuri",
            "Suurentaa karttaa hallintapaneelissa ja antaa enemmän karttatilaa avaamatta koko näytön tilaa."
          ],
          [
            "Koko näyttö",
            "Avaa kartan koko näytön tilassa. Sijaintipilleri, kompassi, medaljonki, selite ja kartan ohjaimet pysyvät käytettävissä."
          ],
          [
            "Karttanäkymä asetuksissa",
            "„Karttanäkymä“-osiossa määritetään tämän laitteen tai selainprofiilin oletusnäkymä sekä erillinen karttaikkuna."
          ],
          [
            "Oletusnäkymä",
            "Määrittää, käynnistyykö Gewitterradar Vakio-, Suuri- tai Koko näyttö -näkymässä vai viimeksi käytetyssä karttanäkymässä. Valinta tallennetaan vain paikallisesti kyseiselle laitteelle tai käytettyyn selainprofiiliin."
          ],
          [
            "Erillinen karttaikkuna",
            "Avaa ukkosnäkymän tällä hetkellä valitulla kartalla ja kompassilla erilliseen ikkunaan. Normaali hallintapaneelin näkymä pysyy erillään. Toiminto on käytettävissä Asetukset-valikosta."
          ]
        ],
        "notes": []
      },
      {
        "key": "external_services",
        "title": "Ulkoiset palvelut ja verkkoluvat",
        "paragraphs": [
          "Gewitterradar käyttää kahta verkkoreittiä: kartta ja paikkahaku lähtevät suoraan selaimesta/Companion Appista, kun taas Blitzortung-live-data haetaan Home Assistant -palvelimen Blitzortung-integraatiolla. Palomuuri, VLAN, välityspalvelin, DNS-suodatus ja TLS-tarkastus on siis tarkistettava erikseen.",
          "Alla ovat nykyisen V4.07-ajon ulkoiset kohteet. Paikallinen paikkakirjasto, tracker ja Home Assistant -palvelut eivät tarvitse Internet-yhteyttä."
        ],
        "entries": [
          [
            "Asiakas · Open-Meteo-geokoodaus",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · ensisijainen maailmanlaajuinen haku; lähettää hakutekstin, kielen ja vain erikseen valitulla maasuodattimella ISO-koodin. Virheessä käytetään Nominatimia."
          ],
          [
            "Asiakas · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · varapalvelu; lähettää hakutekstin, kielen ja mahdollisen ISO-koodin. Julkisten kutsujen väli on vähintään sekunti eikä paikallinen maiden automaattitäydennys käytä verkkoa. Jos molemmat estetään, tallennetut paikat toimivat paikallisesti."
          ],
          [
            "Asiakas · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · lataa Leaflet 1.9.4 JavaScript/CSS. Ilman välimuistissa olevaa Leafletiä kartta ei käynnisty, jos isäntä estetään."
          ],
          [
            "Asiakas · OpenStreetMap-karttatiilet",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · taustakarttatiilet. Estossa dataa voi olla, mutta taustakartta jää tyhjäksi/vajaaksi."
          ],
          [
            "Palvelin · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · ulospäin Home Assistant -palvelimelta. Blitzortung v1.7.1 käyttää brokeria/geohash-aiheita live-salamoihin; esto pysäyttää uudet tiedot mutta ei hakua/karttaa."
          ],
          [
            "Paikallinen · ei ulkoista lupaa",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, koordinaattipalvelu, kojelautaskripti ja Local to-do -lista “Gewitterradar Orte” toimivat paikallisesti."
          ],
          [
            "Asennus / päivitys",
            "GitHub/HACS ovat asennusta/päivitystä varten, eivät avoimen kartan ajonaikaisia riippuvuuksia."
          ],
          [
            "Pikadiagnoosi",
            "Haku rikki: Open-Meteo/Nominatim. Kartta ei käynnisty: unpkg.com. Tyhjä taustakartta: OSM-tiilipalvelimet. Puuttuvat/vanhat salamat: blitzortung.ha.sed.pl:1883 ja Blitzortung-integraatio."
          ]
        ],
        "notes": [
          "DNS:n on toimittava sekä asiakkaalla että Home Assistant -palvelimella niiden tarvitsemiin kohteisiin.",
          "HTTPS-välityspalvelin, TLS-tarkastus, suodattimet, estot tai selainlaajennukset voivat estää pyynnöt vaikka TCP 443 on avoin; geokoodauksessa tarkista myös CORS/vastaussuodatus.",
          "Tietosuoja: geokoodaus saa hakutekstin/parametrit, OSM-tiilet paljastavat teknisesti katsotun kartta-alueen ja Blitzortung-broker saa tilatut alue-/geohash-aiheet.",
          "http://www.w3.org/2000/svg on vain SVG-nimiavaruus, ei ulkoinen verkkokutsu.",
          "Ajonaikainen inventaario on automaattisesti suojattu: uuden kiinteän ulkoisen URL-kohteen pitää rikkoa testi, kunnes dokumentaatio ja luvat päivitetään."
        ]
      },
      {
        "key": "functions",
        "title": "Tärkeät toiminnot",
        "entries": [
          [
            "Aura-tehosteet",
            "havainnollistavat salamatoimintaa mutta eivät muuta tunnistusta tai laskentaa."
          ],
          [
            "Varoitusanimaatio",
            "korostaa olennaista ukkostoimintaa visuaalisesti."
          ],
          [
            "Karttaryhmittely",
            "yhdistää läheiset salamamerkit ja pitää kartan selkeänä."
          ],
          [
            "Kompassi: lähin salama",
            "suuntaa näytön lähimpään havaittuun salamaan."
          ],
          [
            "Laitteen suunta",
            "voi käyttää tuettujen mobiililaitteiden suuntausta."
          ],
          [
            "Erillinen karttaikkuna",
            "Avaa ukkosnäkymän tällä hetkellä valitulla kartalla ja kompassilla erilliseen ikkunaan. Normaali hallintapaneelin näkymä pysyy erillään. Toiminto on käytettävissä Asetukset-valikosta."
          ],
          [
            "Kalibrointi ja diagnostiikka",
            "tarjoaa työkaluja näkymän ja yksittäisten osien kohdennettuun tarkistukseen, mittaukseen ja vianmääritykseen. Näihin kuuluvat muun muassa kompassin ja medaljongin kalibrointi, diagnostiikkanäkymät sekä testitoiminnot kuten ukkossimulointi. Työkalut on tarkoitettu käyttöönottoon, kehitykseen ja vianmääritykseen, ja niiden tulee olla pois käytöstä normaalissa käytössä."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Suositellut perusasetukset",
        "paragraphs": [
          "Vakaaseen aloitukseen suosittelemme:"
        ],
        "entries": [
          [
            "Testiarvot · 500 km / 120 min / 200",
            "500 km havaintosäde, 120 minuutin aikaikkuna ja 200 salamaa ovat esimerkkitestiarvoja, eivät pakollisia asetuksia. Niitä voi mukauttaa käyttötarkoituksen, halutun havaintoetäisyyden ja omien tarpeiden mukaan."
          ],
          [
            "Yhteensovita sijainti & tracker",
            "Yhteensovita Blitzortungin asetukset sekä siellä määritetyn sijainnin että Gewitterradarin käyttämän trackerin kanssa. Näin data-alue ja näyttö pysyvät yhdenmukaisina."
          ],
          [
            "Yhteensovita säteet",
            "Aseta Blitzortungin lähdesäde vähintään yhtä suureksi kuin Gewitterradarin havaintosäde."
          ],
          [
            "Pidä käytössä",
            "Pidä karttaryhmittely ja varoitusanimaatio käytössä."
          ],
          [
            "Valinnainen",
            "Säädä auraefektit mieltymyksen mukaan; ne eivät vaikuta havaitsemiseen. Ota laitteen suunta käyttöön vain, jos sitä tarvitaan käytetyllä mobiililaitteella."
          ],
          [
            "Normaali käyttö",
            "Pidä “Kalibrointi ja diagnostiikka” -kohdan työkalut, erityisesti ukkossimulointi, pois käytöstä normaalissa käytössä."
          ],
          [
            "Recorder – tarkista",
            "Tarkista Recorder-poissulut usein päivittyville salama- ja sijaintitiedoille. Ilman sopivia poissulkuja Home Assistant -tietokanta ja varmuuskopiot voivat kasvaa hyvin nopeasti. Katso lisätiedot ja YAML kohdasta “Home Assistant Recorder”."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Jos jokin ei toimi",
        "entries": [
          [
            "Salamoita ei näy tai niitä on liian vähän",
            "Tarkista lähteen tila, lähdesäde ja käytetyt salamaentiteetit."
          ],
          [
            "Etäisyydet tai suunnat näyttävät vääriltä",
            "Tarkista viitesijainti ja etäisyysyksikkö."
          ],
          [
            "Varmuuskopio kasvaa poikkeuksellisen nopeasti",
            "Puuttuvat Recorder-poissulut usein päivittyville salama- ja sijaintitiedoille voivat kasvattaa Home Assistant -tietokantaa ja siten varmuuskopioita hyvin nopeasti. Tarkista Recorder-asetukset; katso lisätiedot ja YAML kohdasta “Home Assistant Recorder”."
          ],
          [
            "Kielivalinta palaa jatkuvasti",
            "Tarkista, että nykyinen Gewitterradar-paketti ja alustuksen apuentiteetti on asennettu."
          ],
          [
            "Näkymä ei muutu päivityksen jälkeen",
            "Lataa selaimen tai sovelluksen välimuisti kokonaan uudelleen ja varmista nykyisen JavaScript-tiedoston käyttö."
          ],
          [
            "Outo toiminta tai kaksinkertainen kortti",
            "Home Assistantissa saa olla aktiivisena vain YKSI Gewitterradar-moduuliresurssi. Natiivi integraatio ja Dashboard-/HACS-resurssi eivät saa rekisteröidä samaa mukautettua korttia yhtä aikaa."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Salamadata voi synnyttää erittäin paljon tilamuutoksia. Pitkällä aikavälillä kevyttä Recorder-määritystä varten suosittelemme seuraavien entiteettien ja mallien poissulkemista."
        ],
        "recorder": true,
        "notes": [
          "Jos recorder:-osio on jo olemassa, yhdistä nämä rivit siihen. Älä luo toista ylätason recorder:-lohkoa.",
          "Poissulkemiset EIVÄT poista Gewitterradarin käyttämiä reaaliaikaisia tiloja käytöstä.",
          "Olemassa olevia historiatietoja ei poisteta automaattisesti.",
          "Jokerimerkkimallit tukevat useita paikantimia tai havaintopisteitä entiteetin etuliitteestä riippumatta."
        ]
      }
    ]
  },
  "Čeština": {
    "menuTitle": "Nápověda a poznámky",
    "title": "Nápověda a poznámky",
    "subtitle": "Stručný průvodce pro spolehlivý a srozumitelný provoz Gewitterradaru.",
    "close": "Zavřít nápovědu",
    "copy": "Kopírovat YAML",
    "copied": "Zkopírováno",
    "copyFailed": "Kopírování není dostupné – označte kód.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Předpoklady",
        "paragraphs": [
          "Gewitterradar zpracovává data o blescích, která Home Assistant přijímá z nastaveného zdroje detekce. Zkontrolujte v něm správnou referenční polohu a nastavte poloměr zdroje alespoň stejně velký jako pozorovací poloměr v Gewitterradaru. Gewitterradar nemůže zobrazit ani vyhodnotit výboje, které zdroj již odfiltroval."
        ],
        "notes": [
          "Pokud existuje více detektorů nebo pozorovacích bodů, musí použité entity jednoznačně patřit k požadovanému referenčnímu bodu."
        ]
      },
      {
        "key": "radii",
        "title": "Poloměry",
        "paragraphs": [
          "Poloměry se překrývají: výboj v nebezpečném poloměru se počítá také do bouřkového a pozorovacího poloměru. Jde o prahové vzdálenosti, nikoli oddělené zdroje dat.",
          "V části „Rozpad shluků“ určíte, kdy se mají shluky při přibližování rozdělit na jednotlivé výboje. Brzy je rozdělí dříve, Vyváženě používá dosud osvědčené zónové nastavení V4.08 a Pozdě je ponechá seskupené déle."
        ],
        "items": [
          "Pozorovací poloměr – vnější oblast pro včasné pozorování.",
          "Bouřkový poloměr – bližší oblast vyžadující zvýšenou pozornost.",
          "Nebezpečný poloměr – bezprostřední okolí s mimořádnou důležitostí."
        ],
        "notes": [
          "Poloměr nebezpečí je omezen na maximálně 250 km. Doporučené výchozí hodnoty a nutné sladění s aplikací Blitzortung najdete v části „Doporučená základní nastavení“."
        ],
        "featureBlocks": [
          {
            "title": "Navigace mezi shluky · doba relace",
            "body": "určuje, jak dlouho zůstane zahájená navigace mezi shluky aktivní. Doba odpočtu je volně nastavitelná v rozsahu 5 až 3600 sekund. {{INFINITY}} ponechá relaci otevřenou bez časového omezení. Odpočet a {{INFINITY}} lze během navigace přepínat přímo ve stavovém zobrazení.",
            "infinityAlt": "Bez omezení"
          }
        ]
      },
      {
        "key": "location",
        "title": "Poloha a uložená místa",
        "paragraphs": [
          "Vybrané místo je referenční bod, od kterého Gewitterradar počítá vzdálenosti a směry. Pomocí celosvětového vyhledávání míst nebo přímého zadání souřadnic lze tento referenční bod nastavit nezávisle na skutečné poloze Home Assistant. Uložená místa se uchovávají lokálně v Home Assistant."
        ],
        "entries": [
          [
            "Sledování polohy a Blitzortung",
            "Gewitterradar používá pro libovolně zvolená místa virtuální polohu jako tracker. Ve variantě Dashboard/Package V4.07 je to device_tracker.gewitterradar_dashboard; nativní integrace používá device_tracker.gewitterradar. Aby data o blescích následovala zvolenou virtuální polohu, musí integrace Blitzortung používat stejný tracker jako zdroj polohy.\n↳ Nastavit Blitzortung:\nNastavení → Zařízení a služby → Blitzortung → Přidat položku. Jako typ konfigurace zvolte „Location entity“ a poté vyberte odpovídající tracker Gewitterradar jako entitu polohy. Existující položku s pevnou zeměpisnou šířkou/délkou nelze přes „Překonfigurovat“ převést na entitu polohy. V takovém případě vytvořte novou položku, ověřte ji a teprve potom starou položku se souřadnicemi deaktivujte nebo odstraňte."
          ],
          [
            "Celosvětové vyhledávání míst a souřadnice",
            "Pomocí celosvětového vyhledávání lze hledat místa a PSČ a používat je jako referenční polohu. Alternativně lze polohu zadat přímo pomocí zeměpisné šířky a délky. Ovládání se dělí na následující dva způsoby:"
          ],
          [
            "↳ Použít místo",
            "Použít okamžitě nastaví místo vybrané v celosvětovém vyhledávání jako referenční polohu, automaticky zavře vyhledávání a přesune mapu přímo na novou polohu."
          ],
          [
            "↳ Zadat souřadnice přímo",
            "V Google Maps na počítači klikněte pravým tlačítkem na požadovaný bod, z kontextové nabídky zkopírujte souřadnice a vložte je do „Lat / Lon“. Souřadnice lze alternativně zjistit pomocí MapTiler Coordinates: https://www.maptiler.com/tools/coordinates/ . Příklad (Lat / Lon): 53.837691, 9.956105. Gewitterradar používá desetinné stupně; vlastní označení je volitelné."
          ],
          [
            "Nastavit seznam uložených míst",
            "Aby bylo možné místa nebo souřadnice ukládat a později je pohodlně otevírat z nabídky Gewitterradar, je třeba jednorázově vytvořit úložiště pomocí funkce To-do v Home Assistant.\n↳ Nastavení:\nNastavení → Zařízení a služby → Přidat integraci → vyhledejte „Local To-do“ a vyberte integraci. Jako název seznamu zadejte přesně „Gewitterradar Orte“ a dokončete nastavení."
          ],
          [
            "Uložená místa",
            "★ Uložit trvale uloží nalezená místa lokálně. Zobrazí se v nabídce polohy pod „Uložená místa“ a lze je znovu použít bez dalšího vyhledávání. × místo ihned nesmaže, pouze je označí k odstranění. V části „Odstraněná místa“ jej ↶ kdykoli obnoví; souřadnice a metadata zůstanou zachována."
          ]
        ],
        "notes": [
          "Samotný přesun mapy nedokazuje, že Blitzortung již změnil oblast svých živých dat. Nativní integrace používá místo trackeru Dashboard device_tracker.gewitterradar."
        ]
      },
      {
        "key": "mapview",
        "title": "Zobrazení mapy a tlačítko 3D vrstev",
        "layerGraphic": true,
        "layerGraphicAlt": "Tlačítko 3D vrstev ve zlaté, modré a červené barvě",
        "layerGraphicCaption": "Pomocí voliče vrstev lze kdykoli přepnout zobrazení mapy mezi Standardní, Velká a Celá obrazovka.",
        "paragraphs": [],
        "entries": [
          [
            "Standardní",
            "Používá běžnou výšku mapy v kartě Gewitterradar."
          ],
          [
            "Velká",
            "Zvětší mapu v řídicím panelu a poskytne více prostoru pro mapu bez otevření režimu celé obrazovky."
          ],
          [
            "Celá obrazovka",
            "Otevře mapu na celé obrazovce. Pilulka polohy, kompas, medailon, legenda a ovládací prvky mapy zůstávají dostupné."
          ],
          [
            "Zobrazení mapy v Nastavení",
            "Sekce „Zobrazení mapy“ nastavuje výchozí zobrazení pro toto zařízení nebo profil prohlížeče a samostatné okno mapy."
          ],
          [
            "Výchozí zobrazení",
            "Určuje, zda se Gewitterradar spustí v režimu Standardní, Velká, Celá obrazovka nebo v naposledy použitém zobrazení mapy. Volba se ukládá pouze lokálně na daném zařízení nebo v použitém profilu prohlížeče."
          ],
          [
            "Samostatné okno mapy",
            "Otevře bouřkový pohled s aktuálně vybranou mapou a kompasem v samostatném okně. Běžné zobrazení řídicího panelu zůstává oddělené. Tato funkce je dostupná v nabídce Nastavení."
          ]
        ],
        "notes": []
      },
      {
        "key": "external_services",
        "title": "Externí služby a síťová povolení",
        "paragraphs": [
          "Gewitterradar používá dvě síťové cesty: mapa a hledání jdou přímo z prohlížeče/Companion App, zatímco živá data Blitzortung získává integrace na serveru Home Assistant. Firewall, VLAN, proxy, DNS filtr a TLS inspekci je proto nutné ověřit odděleně.",
          "Níže jsou aktuální externí cíle běhu V4.07. Místní knihovna, tracker a služby Home Assistant nepotřebují Internet."
        ],
        "entries": [
          [
            "Klient · geokódování Open-Meteo",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · hlavní celosvětové hledání; posílá dotaz, jazyk a pouze při výslovném filtru země ISO kód. Při chybě se použije Nominatim."
          ],
          [
            "Klient · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · záloha; posílá dotaz, jazyk a případný ISO kód. Veřejná volání mají rozestup alespoň sekundu a místní doplňování zemí síť nepoužívá. Jsou-li oba blokované, uložená místa zůstávají lokálně funkční."
          ],
          [
            "Klient · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · načítá Leaflet 1.9.4 JavaScript/CSS. Bez Leafletu v mezipaměti blokace hostu zabrání startu mapy."
          ],
          [
            "Klient · dlaždice OpenStreetMap",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · podkladové dlaždice. Při blokaci mohou data existovat, ale podklad zůstane prázdný/neúplný."
          ],
          [
            "Server · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · odchozí ze serveru Home Assistant. Blitzortung v1.7.1 používá broker/geohash témata pro živé blesky; blokace zastaví nová data, nikoli hledání/mapu."
          ],
          [
            "Lokálně · bez externího povolení",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, služba souřadnic, dashboard skript a seznam Local to-do “Gewitterradar Orte” běží lokálně."
          ],
          [
            "Instalace / aktualizace",
            "GitHub/HACS slouží k instalaci/aktualizaci, nejsou runtime závislostí otevřené mapy."
          ],
          [
            "Rychlá diagnostika",
            "Hledání nefunguje: Open-Meteo/Nominatim. Mapa nestartuje: unpkg.com. Prázdný podklad: hosty OSM dlaždic. Chybějící/staré blesky: blitzortung.ha.sed.pl:1883 a integrace Blitzortung."
          ]
        ],
        "notes": [
          "DNS musí fungovat na klientu i serveru Home Assistant pro jejich cíle.",
          "HTTPS proxy, TLS inspekce, filtry, blokátory či rozšíření mohou požadavky zastavit i při otevřeném TCP 443; u geokódování ověřte také CORS/filtrování odpovědi.",
          "Soukromí: geokódování přijímá dotaz/parametry, OSM dlaždice technicky odhalují zobrazenou oblast a broker Blitzortung dostává odebíraná region/geohash témata.",
          "http://www.w3.org/2000/svg je pouze jmenný prostor SVG, nikoli externí síťové volání.",
          "Runtime inventář je automaticky hlídán: nový pevný externí URL cíl má test zneplatnit, dokud se neaktualizují dokumentace a povolení."
        ]
      },
      {
        "key": "functions",
        "title": "Důležité funkce",
        "entries": [
          [
            "Efekty aury",
            "znázorňují aktivitu blesků, ale nemění detekci ani počítání."
          ],
          [
            "Výstražná animace",
            "vizuálně zvýrazňuje významnou bouřkovou aktivitu."
          ],
          [
            "Seskupování mapy",
            "spojuje blízké značky a udržuje mapu přehlednou."
          ],
          [
            "Kompas: nejbližší blesk",
            "nasměruje zobrazení k nejbližšímu rozpoznanému výboji."
          ],
          [
            "Orientace zařízení",
            "může využívat orientaci podporovaných mobilních zařízení."
          ],
          [
            "Samostatné okno mapy",
            "Otevře bouřkový pohled s aktuálně vybranou mapou a kompasem v samostatném okně. Běžné zobrazení řídicího panelu zůstává oddělené. Tato funkce je dostupná v nabídce Nastavení."
          ],
          [
            "Kalibrace a diagnostika",
            "poskytuje nástroje pro cílenou kontrolu, měření a diagnostiku zobrazení a jednotlivých součástí. Patří sem mimo jiné kalibrace kompasu a medailonu, diagnostická zobrazení a testovací funkce, například simulace bouřky. Tyto nástroje jsou určeny pro nastavení, vývoj a řešení problémů a při běžném provozu by měly zůstat vypnuté."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Doporučená základní nastavení",
        "paragraphs": [
          "Pro stabilní začátek doporučujeme:"
        ],
        "entries": [
          [
            "Testovací hodnoty · 500 km / 120 min / 200",
            "Detekční poloměr 500 km, časové okno 120 minut a 200 blesků jsou příkladové testovací hodnoty, nikoli povinná nastavení. Lze je upravit podle použití, požadovaného dosahu pozorování a osobních potřeb."
          ],
          [
            "Sladit polohu & tracker",
            "Sladťe nastavení v Blitzortung pro tam nakonfigurovanou polohu i pro tracker používaný Gewitterradarem. Oblast dat a zobrazení tak zůstanou konzistentní."
          ],
          [
            "Sladit poloměry",
            "Nastavte poloměr zdroje Blitzortung alespoň stejně velký jako pozorovací poloměr Gewitterradaru."
          ],
          [
            "Nechat zapnuté",
            "Nechte zapnuté seskupování mapy a výstražnou animaci."
          ],
          [
            "Volitelné",
            "Aura efekty nastavte podle preferencí; neovlivňují detekci. Orientaci zařízení zapněte jen tehdy, když je na používaném mobilním zařízení potřeba."
          ],
          [
            "Běžný provoz",
            "Při běžném provozu nechte nástroje v části „Kalibrace a diagnostika“, zejména simulaci bouřky, vypnuté."
          ],
          [
            "Recorder – zkontrolovat",
            "Zkontrolujte v Recorderu vyloučení často aktualizovaných dat o blescích a poloze. Bez vhodných vyloučení může databáze Home Assistant a zálohy růst velmi rychle. Podrobnosti a YAML viz „Home Assistant Recorder“."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Když něco nefunguje",
        "entries": [
          [
            "Žádné nebo příliš málo výbojů",
            "Zkontrolujte stav zdroje, poloměr zdroje a použité entity blesků."
          ],
          [
            "Vzdálenosti nebo směry vypadají chybně",
            "Zkontrolujte referenční polohu a jednotku vzdálenosti."
          ],
          [
            "Záloha roste neobvykle rychle",
            "Chybějící vyloučení Recorderu pro často aktualizovaná data o blescích a poloze mohou velmi rychle zvětšovat databázi Home Assistant a tím i zálohy. Zkontrolujte nastavení Recorderu; podrobnosti a YAML viz „Home Assistant Recorder“."
          ],
          [
            "Výběr jazyka se stále vrací",
            "Ověřte instalaci aktuálního balíčku Gewitterradar a inicializačního pomocníka."
          ],
          [
            "Zobrazení se po aktualizaci nezměnilo",
            "Úplně obnovte mezipaměť prohlížeče/aplikace a ověřte použití aktuálního souboru JavaScript."
          ],
          [
            "Neobvyklé chování nebo dvojitá karta",
            "V Home Assistant smí být aktivní jen JEDEN modulový prostředek Gewitterradar. Nativní integrace a prostředek Dashboard/HACS nesmějí současně registrovat stejnou vlastní kartu."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Data o blescích mohou vytvářet velmi mnoho změn stavu. Pro dlouhodobě úspornou konfiguraci Recorder doporučujeme vyloučit následující entity a vzory."
        ],
        "recorder": true,
        "notes": [
          "Pokud již existuje sekce recorder:, začleňte položky do ní. Nevytvářejte druhý blok recorder: nejvyšší úrovně.",
          "Vyloučení NEVYPÍNAJÍ živé stavy používané Gewitterradarem.",
          "Stávající historická data se automaticky neodstraní.",
          "Zástupné vzory podporují více detektorů nebo pozorovacích bodů bez ohledu na prefix entity."
        ]
      }
    ]
  },
  "Ελληνικά": {
    "menuTitle": "Βοήθεια και σημειώσεις",
    "title": "Βοήθεια και σημειώσεις",
    "subtitle": "Ένας σύντομος οδηγός για αξιόπιστη και κατανοητή λειτουργία του Gewitterradar.",
    "close": "Κλείσιμο βοήθειας",
    "copy": "Αντιγραφή YAML",
    "copied": "Αντιγράφηκε",
    "copyFailed": "Η αντιγραφή δεν είναι διαθέσιμη — επιλέξτε τον κώδικα.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Προϋποθέσεις",
        "paragraphs": [
          "Το Gewitterradar επεξεργάζεται τα δεδομένα κεραυνών που λαμβάνει το Home Assistant από τη ρυθμισμένη πηγή ανίχνευσης. Ελέγξτε εκεί τη σωστή θέση αναφοράς και ορίστε την ακτίνα πηγής τουλάχιστον ίση με την ακτίνα παρατήρησης του Gewitterradar. Το Gewitterradar δεν μπορεί να εμφανίσει ή να αξιολογήσει κεραυνούς που έχουν ήδη φιλτραριστεί από την πηγή."
        ],
        "notes": [
          "Αν υπάρχουν πολλοί ανιχνευτές ή σημεία παρατήρησης, οι οντότητες που χρησιμοποιούνται πρέπει να αντιστοιχούν σαφώς στο επιθυμητό σημείο αναφοράς."
        ]
      },
      {
        "key": "radii",
        "title": "Οι ακτίνες",
        "paragraphs": [
          "Οι ακτίνες είναι αθροιστικές: ένας κεραυνός μέσα στην ακτίνα κινδύνου μετρά επίσης στις ακτίνες καταιγίδας και παρατήρησης. Πρόκειται για όρια απόστασης, όχι για ξεχωριστές πηγές δεδομένων.",
          "Στην «Ανάλυση συστάδων» ορίζετε πότε οι συστάδες διαχωρίζονται σε μεμονωμένους κεραυνούς κατά τη μεγέθυνση. Η επιλογή Νωρίς τις διαχωρίζει νωρίτερα, η Ισορροπημένη χρησιμοποιεί την έως τώρα δοκιμασμένη ρύθμιση V4.08 ανά ζώνη και η Αργά κρατά τις συστάδες ενωμένες περισσότερο."
        ],
        "items": [
          "Ακτίνα παρατήρησης – εξωτερική περιοχή για έγκαιρη παρατήρηση.",
          "Ακτίνα καταιγίδας – κοντινότερη περιοχή που απαιτεί αυξημένη προσοχή.",
          "Ακτίνα κινδύνου – άμεση γειτνίαση με ιδιαίτερα υψηλή σημασία."
        ],
        "notes": [
          "Η ακτίνα κινδύνου περιορίζεται σε μέγιστο 250 km. Δείτε τις «Προτεινόμενες βασικές ρυθμίσεις» για προτεινόμενες αρχικές τιμές και τον απαραίτητο συντονισμό με την εφαρμογή Blitzortung."
        ],
        "featureBlocks": [
          {
            "title": "Πλοήγηση συστάδων · διάρκεια συνεδρίας",
            "body": "καθορίζει για πόσο χρόνο παραμένει ενεργή μια πλοήγηση συστάδων που έχει ξεκινήσει. Ο χρόνος αντίστροφης μέτρησης μπορεί να οριστεί ελεύθερα από 5 έως 3600 δευτερόλεπτα. {{INFINITY}} διατηρεί τη συνεδρία ανοικτή χωρίς χρονικό όριο. Η αντίστροφη μέτρηση και το {{INFINITY}} μπορούν να εναλλάσσονται απευθείας στην ένδειξη κατάστασης κατά την πλοήγηση.",
            "infinityAlt": "Χωρίς όριο"
          }
        ]
      },
      {
        "key": "location",
        "title": "Τοποθεσία και αποθηκευμένα μέρη",
        "paragraphs": [
          "Το επιλεγμένο μέρος είναι το σημείο αναφοράς από το οποίο το Gewitterradar υπολογίζει αποστάσεις και κατευθύνσεις. Με την παγκόσμια αναζήτηση τοποθεσιών ή με την απευθείας εισαγωγή συντεταγμένων, αυτό το σημείο αναφοράς μπορεί να οριστεί ανεξάρτητα από την πραγματική τοποθεσία του Home Assistant. Τα αποθηκευμένα μέρη φυλάσσονται τοπικά στο Home Assistant."
        ],
        "entries": [
          [
            "Ιχνηλάτης τοποθεσίας και Blitzortung",
            "Το Gewitterradar χρησιμοποιεί μια εικονική τοποθεσία ως ιχνηλάτη για ελεύθερα επιλεγμένα μέρη. Στην έκδοση Dashboard/Package της V4.07 χρησιμοποιείται το device_tracker.gewitterradar_dashboard· η εγγενής ενσωμάτωση χρησιμοποιεί το device_tracker.gewitterradar. Για να ακολουθούν τα δεδομένα κεραυνών την επιλεγμένη εικονική τοποθεσία, η ενσωμάτωση Blitzortung πρέπει να χρησιμοποιεί τον ίδιο ιχνηλάτη ως πηγή τοποθεσίας.\n↳ Ρύθμιση Blitzortung:\nΡυθμίσεις → Συσκευές και υπηρεσίες → Blitzortung → Προσθήκη καταχώρισης. Επιλέξτε «Location entity» ως τύπο διαμόρφωσης και στη συνέχεια τον κατάλληλο ιχνηλάτη Gewitterradar ως οντότητα τοποθεσίας. Μια υπάρχουσα καταχώριση με σταθερό γεωγραφικό πλάτος/μήκος δεν μπορεί να μετατραπεί σε οντότητα τοποθεσίας μέσω «Επαναδιαμόρφωση». Σε αυτή την περίπτωση δημιουργήστε νέα καταχώριση, ελέγξτε την και μόνο μετά απενεργοποιήστε ή διαγράψτε την παλιά καταχώριση συντεταγμένων."
          ],
          [
            "Παγκόσμια αναζήτηση τοποθεσιών και συντεταγμένες",
            "Με την παγκόσμια αναζήτηση μπορούν να βρεθούν μέρη και ταχυδρομικοί κώδικες και να χρησιμοποιηθούν ως τοποθεσία αναφοράς. Εναλλακτικά, μια τοποθεσία μπορεί να οριστεί απευθείας με γεωγραφικό πλάτος και μήκος. Η χρήση χωρίζεται στους δύο παρακάτω τρόπους:"
          ],
          [
            "↳ Εφαρμογή τοποθεσίας",
            "Η επιλογή Εφαρμογή ορίζει αμέσως το μέρος που επιλέχθηκε στην παγκόσμια αναζήτηση ως τοποθεσία αναφοράς, κλείνει αυτόματα την αναζήτηση και μετακινεί τον χάρτη απευθείας στη νέα τοποθεσία."
          ],
          [
            "↳ Απευθείας εισαγωγή συντεταγμένων",
            "Στο Google Maps σε υπολογιστή κάντε δεξί κλικ στο επιθυμητό σημείο, αντιγράψτε τις συντεταγμένες από το μενού περιβάλλοντος και επικολλήστε τις στο «Lat / Lon». Εναλλακτικά, οι συντεταγμένες μπορούν να βρεθούν μέσω MapTiler Coordinates: https://www.maptiler.com/tools/coordinates/ . Παράδειγμα (Lat / Lon): 53.837691, 9.956105. Το Gewitterradar χρησιμοποιεί δεκαδικές μοίρες· η ελεύθερη ονομασία είναι προαιρετική."
          ],
          [
            "Ρύθμιση λίστας αποθηκευμένων μερών",
            "Για να μπορούν να αποθηκεύονται μέρη ή συντεταγμένες και να ανοίγουν αργότερα εύκολα από το μενού του Gewitterradar, πρέπει να δημιουργηθεί μία φορά ένας χώρος αποθήκευσης μέσω της λειτουργίας To-do του Home Assistant.\n↳ Ρύθμιση:\nΡυθμίσεις → Συσκευές και υπηρεσίες → Προσθήκη ενσωμάτωσης → αναζητήστε «Local To-do» και επιλέξτε την ενσωμάτωση. Ορίστε ακριβώς «Gewitterradar Orte» ως όνομα λίστας και ολοκληρώστε τη ρύθμιση."
          ],
          [
            "Αποθηκευμένα μέρη",
            "★ Αποθήκευση αποθηκεύει μόνιμα και τοπικά τα μέρη που βρέθηκαν. Εμφανίζονται στο μενού τοποθεσίας στην ενότητα «Αποθηκευμένα μέρη» και μπορούν να χρησιμοποιηθούν χωρίς νέα αναζήτηση. Το × δεν διαγράφει αμέσως ένα μέρος, αλλά το επισημαίνει για αφαίρεση. Στην ενότητα «Αφαιρεμένα μέρη», το ↶ το επαναφέρει ανά πάσα στιγμή· οι συντεταγμένες και τα μεταδεδομένα διατηρούνται."
          ]
        ],
        "notes": [
          "Η μετακίνηση του χάρτη από μόνη της δεν αποδεικνύει ότι το Blitzortung έχει ήδη αλλάξει την περιοχή ζωντανών δεδομένων. Η εγγενής ενσωμάτωση χρησιμοποιεί το device_tracker.gewitterradar αντί για τον ιχνηλάτη Dashboard."
        ]
      },
      {
        "key": "mapview",
        "title": "Προβολές χάρτη και κουμπί επιπέδων 3D",
        "layerGraphic": true,
        "layerGraphicAlt": "Κουμπί επιπέδων 3D σε χρυσό, μπλε και κόκκινο",
        "layerGraphicCaption": "Με τον επιλογέα επιπέδων μπορείτε να αλλάζετε ανά πάσα στιγμή την προβολή χάρτη μεταξύ Τυπικής, Μεγάλης και Πλήρους οθόνης.",
        "paragraphs": [],
        "entries": [
          [
            "Τυπική",
            "Χρησιμοποιεί το κανονικό ύψος χάρτη μέσα στην κάρτα Gewitterradar."
          ],
          [
            "Μεγάλη",
            "Μεγεθύνει τον χάρτη μέσα στον πίνακα ελέγχου και προσφέρει περισσότερο χώρο χωρίς να ανοίγει λειτουργία πλήρους οθόνης."
          ],
          [
            "Πλήρης οθόνη",
            "Ανοίγει τον χάρτη σε πλήρη οθόνη. Η ένδειξη τοποθεσίας, η πυξίδα, το μενταγιόν, το υπόμνημα και τα χειριστήρια του χάρτη παραμένουν διαθέσιμα."
          ],
          [
            "Προβολή χάρτη στις Ρυθμίσεις",
            "Η ενότητα „Προβολή χάρτη“ ορίζει την προεπιλεγμένη προβολή για αυτή τη συσκευή ή το προφίλ προγράμματος περιήγησης και το ξεχωριστό παράθυρο χάρτη."
          ],
          [
            "Προεπιλεγμένη προβολή",
            "Ορίζει αν το Gewitterradar ξεκινά σε Τυπική, Μεγάλη, Πλήρη οθόνη ή στην τελευταία χρησιμοποιημένη προβολή χάρτη. Η επιλογή αποθηκεύεται μόνο τοπικά στη συγκεκριμένη συσκευή ή στο χρησιμοποιούμενο προφίλ προγράμματος περιήγησης."
          ],
          [
            "Ξεχωριστό παράθυρο χάρτη",
            "Ανοίγει την προβολή καταιγίδων με τον τρέχοντα επιλεγμένο χάρτη και την τρέχουσα επιλεγμένη πυξίδα σε ξεχωριστό παράθυρο. Η κανονική προβολή του πίνακα ελέγχου παραμένει ανεξάρτητη. Η λειτουργία είναι διαθέσιμη από το μενού Ρυθμίσεις."
          ]
        ],
        "notes": []
      },
      {
        "key": "external_services",
        "title": "Εξωτερικές υπηρεσίες και άδειες δικτύου",
        "paragraphs": [
          "Το Gewitterradar χρησιμοποιεί δύο διαδρομές δικτύου: χάρτης και αναζήτηση ξεκινούν απευθείας από browser/Companion App, ενώ τα ζωντανά δεδομένα Blitzortung λαμβάνονται από την ενσωμάτωση στον server Home Assistant. Firewall, VLAN, proxy, φίλτρο DNS και TLS inspection πρέπει να ελεγχθούν χωριστά.",
          "Οι παρακάτω προορισμοί είναι το τρέχον inventory εκτέλεσης V4.07. Η τοπική βιβλιοθήκη, το tracker και οι υπηρεσίες Home Assistant δεν χρειάζονται Internet."
        ],
        "entries": [
          [
            "Πελάτης · γεωκωδικοποίηση Open-Meteo",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · κύρια παγκόσμια αναζήτηση· στέλνει όρο, γλώσσα και μόνο με ρητό φίλτρο χώρας τον ISO κωδικό. Σε αποτυχία χρησιμοποιείται Nominatim."
          ],
          [
            "Πελάτης · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · εφεδρικό· στέλνει όρο, γλώσσα και ενδεχόμενο ISO κωδικό. Οι δημόσιες κλήσεις απέχουν τουλάχιστον ένα δευτερόλεπτο και η τοπική αυτόματη συμπλήρωση χωρών δεν κάνει δικτυακές κλήσεις. Αν μπλοκαριστούν και τα δύο, οι αποθηκευμένες τοποθεσίες λειτουργούν τοπικά."
          ],
          [
            "Πελάτης · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · φορτώνει Leaflet 1.9.4 JavaScript/CSS. Χωρίς cached Leaflet, μπλοκάρισμα του host εμποδίζει την εκκίνηση του χάρτη."
          ],
          [
            "Πελάτης · πλακίδια OpenStreetMap",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · βασικά πλακίδια. Αν μπλοκαριστούν, μπορεί να υπάρχουν δεδομένα αλλά ο βασικός χάρτης μένει κενός/ελλιπής."
          ],
          [
            "Server · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · εξερχόμενο από τον server Home Assistant. Το Blitzortung v1.7.1 χρησιμοποιεί broker/geohash topics για ζωντανούς κεραυνούς· το μπλοκάρισμα σταματά νέα δεδομένα αλλά όχι αναζήτηση/χάρτη."
          ],
          [
            "Τοπικά · χωρίς εξωτερική άδεια",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, υπηρεσία συντεταγμένων, dashboard script και λίστα Local to-do “Gewitterradar Orte” λειτουργούν τοπικά."
          ],
          [
            "Εγκατάσταση / ενημέρωση",
            "GitHub/HACS χρησιμοποιούνται για εγκατάσταση/ενημέρωση, όχι ως runtime εξάρτηση του ανοικτού χάρτη."
          ],
          [
            "Γρήγορη διάγνωση",
            "Πρόβλημα αναζήτησης: Open-Meteo/Nominatim. Ο χάρτης δεν ξεκινά: unpkg.com. Κενό υπόβαθρο: OSM tile hosts. Απόντες/παλιοί κεραυνοί: blitzortung.ha.sed.pl:1883 και ενσωμάτωση Blitzortung."
          ]
        ],
        "notes": [
          "Το DNS πρέπει να λειτουργεί στον πελάτη και στον server Home Assistant για τους αντίστοιχους προορισμούς.",
          "HTTPS proxy, TLS inspection, φίλτρα, blockers ή extensions μπορεί να μπλοκάρουν αιτήματα παρά το ανοικτό TCP 443· για γεωκωδικοποίηση ελέγξτε και CORS/φίλτρα απάντησης.",
          "Απόρρητο: η γεωκωδικοποίηση λαμβάνει όρο/παραμέτρους, τα OSM tiles αποκαλύπτουν τεχνικά την περιοχή προβολής και ο broker Blitzortung λαμβάνει τα subscribed region/geohash topics.",
          "Το http://www.w3.org/2000/svg είναι μόνο SVG namespace, όχι εξωτερική δικτυακή κλήση.",
          "Το runtime inventory προστατεύεται αυτόματα: νέος σταθερός εξωτερικός URL προορισμός πρέπει να αποτυγχάνει στο test μέχρι να ενημερωθούν τεκμηρίωση και άδειες."
        ]
      },
      {
        "key": "functions",
        "title": "Σημαντικές λειτουργίες",
        "entries": [
          [
            "Εφέ αύρας",
            "απεικονίζουν τη δραστηριότητα κεραυνών χωρίς να αλλάζουν την ανίχνευση ή την καταμέτρηση."
          ],
          [
            "Κίνηση προειδοποίησης",
            "τονίζει οπτικά τη σημαντική δραστηριότητα καταιγίδας."
          ],
          [
            "Ομαδοποίηση χάρτη",
            "συνδυάζει κοντινούς δείκτες και διατηρεί τον χάρτη καθαρό."
          ],
          [
            "Πυξίδα: κοντινότερος κεραυνός",
            "στρέφει την προβολή προς τον κοντινότερο ανιχνευμένο κεραυνό."
          ],
          [
            "Προσανατολισμός συσκευής",
            "μπορεί να χρησιμοποιεί τον προσανατολισμό υποστηριζόμενων κινητών συσκευών."
          ],
          [
            "Ξεχωριστό παράθυρο χάρτη",
            "Ανοίγει την προβολή καταιγίδων με τον τρέχοντα επιλεγμένο χάρτη και την τρέχουσα επιλεγμένη πυξίδα σε ξεχωριστό παράθυρο. Η κανονική προβολή του πίνακα ελέγχου παραμένει ανεξάρτητη. Η λειτουργία είναι διαθέσιμη από το μενού Ρυθμίσεις."
          ],
          [
            "Βαθμονόμηση και διάγνωση",
            "παρέχει εργαλεία για στοχευμένο έλεγχο, μέτρηση και διάγνωση της προβολής και επιμέρους στοιχείων. Περιλαμβάνονται, μεταξύ άλλων, βαθμονόμηση πυξίδας και μεταλλίου, διαγνωστικές προβολές και λειτουργίες δοκιμής όπως η προσομοίωση καταιγίδας. Τα εργαλεία προορίζονται για ρύθμιση, ανάπτυξη και αντιμετώπιση προβλημάτων και πρέπει να παραμένουν απενεργοποιημένα στην κανονική λειτουργία."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Προτεινόμενες βασικές ρυθμίσεις",
        "paragraphs": [
          "Για σταθερή εκκίνηση προτείνουμε:"
        ],
        "entries": [
          [
            "Τιμές δοκιμής · 500 km / 120 min / 200",
            "Ακτίνα ανίχνευσης 500 km, χρονικό παράθυρο 120 λεπτών και 200 κεραυνοί είναι ενδεικτικές τιμές δοκιμής, όχι υποχρεωτικές ρυθμίσεις. Μπορούν να προσαρμοστούν στη χρήση, στην επιθυμητή εμβέλεια παρατήρησης και στις προσωπικές ανάγκες."
          ],
          [
            "Συντονισμός τοποθεσίας & tracker",
            "Συντονίστε τις αντίστοιχες ρυθμίσεις στο Blitzortung τόσο για την τοποθεσία που έχει ρυθμιστεί εκεί όσο και για το tracker που χρησιμοποιεί το Gewitterradar. Έτσι η περιοχή δεδομένων και η προβολή παραμένουν συνεπείς."
          ],
          [
            "Συντονισμός ακτίνων",
            "Ορίστε την ακτίνα πηγής Blitzortung τουλάχιστον ίση με την ακτίνα παρατήρησης του Gewitterradar."
          ],
          [
            "Να παραμένουν ενεργά",
            "Διατηρήστε ενεργά την ομαδοποίηση χάρτη και την κίνηση προειδοποίησης."
          ],
          [
            "Προαιρετικά",
            "Ρυθμίστε τα εφέ αύρας σύμφωνα με τις προτιμήσεις σας· δεν επηρεάζουν την ανίχνευση. Ενεργοποιήστε τον προσανατολισμό συσκευής μόνο όταν χρειάζεται στη χρησιμοποιούμενη κινητή συσκευή."
          ],
          [
            "Κανονική λειτουργία",
            "Διατηρήστε απενεργοποιημένα στην κανονική λειτουργία τα εργαλεία της ενότητας «Βαθμονόμηση και διάγνωση», ιδιαίτερα την προσομοίωση καταιγίδας."
          ],
          [
            "Recorder – έλεγχος",
            "Ελέγξτε τις εξαιρέσεις Recorder για δεδομένα κεραυνών και θέσης που ενημερώνονται συχνά. Χωρίς κατάλληλες εξαιρέσεις, η βάση δεδομένων Home Assistant και τα αντίγραφα ασφαλείας μπορούν να αυξηθούν πολύ γρήγορα. Δείτε «Home Assistant Recorder» για λεπτομέρειες και YAML."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Αν κάτι δεν λειτουργεί",
        "entries": [
          [
            "Καθόλου ή πολύ λίγοι κεραυνοί",
            "Ελέγξτε την κατάσταση της πηγής, την ακτίνα πηγής και τις οντότητες κεραυνών."
          ],
          [
            "Οι αποστάσεις ή κατευθύνσεις φαίνονται λάθος",
            "Ελέγξτε τη θέση αναφοράς και τη μονάδα απόστασης."
          ],
          [
            "Το αντίγραφο ασφαλείας αυξάνεται ασυνήθιστα γρήγορα",
            "Η έλλειψη εξαιρέσεων Recorder για συχνά ενημερωμένα δεδομένα κεραυνών και θέσης μπορεί να αυξήσει πολύ γρήγορα τη βάση δεδομένων Home Assistant και συνεπώς τα αντίγραφα ασφαλείας. Ελέγξτε τις ρυθμίσεις Recorder· δείτε «Home Assistant Recorder» για λεπτομέρειες και YAML."
          ],
          [
            "Η επιλογή γλώσσας επανεμφανίζεται",
            "Ελέγξτε ότι έχουν εγκατασταθεί το τρέχον πακέτο Gewitterradar και ο βοηθός αρχικοποίησης."
          ],
          [
            "Η προβολή δεν άλλαξε μετά την ενημέρωση",
            "Επαναφορτώστε πλήρως την cache του προγράμματος περιήγησης/εφαρμογής και βεβαιωθείτε ότι χρησιμοποιείται το τρέχον JavaScript."
          ],
          [
            "Παράξενη συμπεριφορά ή διπλή κάρτα",
            "Μόνο ΕΝΑΣ πόρος μονάδας Gewitterradar επιτρέπεται να είναι ενεργός στο Home Assistant. Η εγγενής ενσωμάτωση και ο πόρος Dashboard/HACS δεν πρέπει να καταχωρούν ταυτόχρονα την ίδια προσαρμοσμένη κάρτα."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "Τα δεδομένα κεραυνών μπορούν να δημιουργήσουν πάρα πολλές αλλαγές κατάστασης. Για λιτή μακροχρόνια ρύθμιση του Recorder προτείνουμε να εξαιρεθούν οι ακόλουθες οντότητες και τα μοτίβα."
        ],
        "recorder": true,
        "notes": [
          "Αν υπάρχει ήδη ενότητα recorder:, ενσωματώστε εκεί αυτές τις καταχωρίσεις. Μη δημιουργήσετε δεύτερο μπλοκ recorder: ανώτατου επιπέδου.",
          "Οι εξαιρέσεις ΔΕΝ απενεργοποιούν τις ζωντανές καταστάσεις που χρησιμοποιεί το Gewitterradar.",
          "Τα υπάρχοντα ιστορικά δεδομένα δεν διαγράφονται αυτόματα.",
          "Τα μοτίβα wildcard υποστηρίζουν πολλούς ανιχνευτές ή σημεία παρατήρησης ανεξάρτητα από το πρόθεμα οντότητας."
        ]
      }
    ]
  },
  "Magyar": {
    "menuTitle": "Súgó és megjegyzések",
    "title": "Súgó és megjegyzések",
    "subtitle": "Rövid útmutató a Gewitterradar megbízható és érthető működéséhez.",
    "close": "Súgó bezárása",
    "copy": "YAML másolása",
    "copied": "Másolva",
    "copyFailed": "A másolás nem érhető el – jelölje ki a kódot.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Előfeltételek",
        "paragraphs": [
          "A Gewitterradar a Home Assistant által a beállított villámdetektáló forrásból fogadott adatokat dolgozza fel. Ellenőrizze ott a megfelelő referenciahelyet, és a forrás sugarát állítsa legalább akkorára, mint a Gewitterradar megfigyelési sugara. A Gewitterradar nem tudja megjeleníteni vagy értékelni a forrás által már kiszűrt villámokat."
        ],
        "notes": [
          "Ha több detektor vagy megfigyelési pont van, a használt entitásoknak egyértelműen a kívánt referenciaponthoz kell tartozniuk."
        ]
      },
      {
        "key": "radii",
        "title": "A sugarak",
        "paragraphs": [
          "A sugarak egymásra épülnek: a veszélyzónán belüli villám a vihar- és megfigyelési sugárba is beleszámít. Ezek távolsági küszöbök, nem külön adatforrások.",
          "A „Klaszterfelbontás” alatt adhatod meg, mikor bomoljanak a klaszterek egyedi villámokra nagyításkor. A Korai hamarabb bontja fel őket, a Kiegyensúlyozott az eddig bevált, zónafüggő V4.08-hangolást használja, a Késői pedig tovább tartja együtt a klasztereket."
        ],
        "items": [
          "Megfigyelési sugár – külső terület a korai megfigyeléshez.",
          "Viharsugár – közelebbi terület, amely fokozott figyelmet igényel.",
          "Veszélysugár – közvetlen környezet kiemelten nagy jelentőséggel."
        ],
        "notes": [
          "A veszélysugár legfeljebb 250 km lehet. Az ajánlott kezdőértékeket és a Blitzortung alkalmazással szükséges összehangolást az „Ajánlott alapbeállítások” rész ismerteti."
        ],
        "featureBlocks": [
          {
            "title": "Klaszternavigáció · munkamenet ideje",
            "body": "meghatározza, mennyi ideig marad aktív egy elindított klaszternavigáció. A visszaszámlálás ideje szabadon beállítható 5 és 3600 másodperc között. {{INFINITY}} időkorlát nélkül nyitva tartja a munkamenetet. A visszaszámlálás és a {{INFINITY}} közvetlenül az állapotkijelzésben váltható navigálás közben.",
            "infinityAlt": "Korlátlan"
          }
        ]
      },
      {
        "key": "location",
        "title": "Hely és mentett helyek",
        "paragraphs": [
          "A kiválasztott hely az a referenciapont, amelytől a Gewitterradar a távolságokat és irányokat számítja. A világméretű helykereséssel vagy a koordináták közvetlen megadásával ez a referenciapont a Home Assistant tényleges helyétől függetlenül beállítható. A mentett helyek helyben, a Home Assistantban tárolódnak."
        ],
        "entries": [
          [
            "Helykövető és Blitzortung",
            "A Gewitterradar a szabadon kiválasztott helyekhez virtuális helyet használ követőként. A V4.07 Dashboard/Package változatában ez a device_tracker.gewitterradar_dashboard; a natív integráció a device_tracker.gewitterradar entitást használja. Ahhoz, hogy a villámadatok a kiválasztott virtuális helyet kövessék, a Blitzortung integrációnak ugyanazt a követőt kell helyforrásként használnia.\n↳ Blitzortung beállítása:\nBeállítások → Eszközök és szolgáltatások → Blitzortung → Bejegyzés hozzáadása. Konfigurációtípusként válaszd a „Location entity” lehetőséget, majd helyentitásként a megfelelő Gewitterradar-követőt. Egy meglévő, rögzített szélességi/hosszúsági fokokkal létrehozott bejegyzés az „Újrakonfigurálás” segítségével nem alakítható át helyentitássá. Ilyenkor hozz létre új bejegyzést, ellenőrizd, és csak ezután kapcsold ki vagy töröld a régi koordinátabejegyzést."
          ],
          [
            "Világméretű helykeresés és koordináták",
            "A világméretű helykereséssel települések és irányítószámok kereshetők, és referenciaként használhatók. Alternatívaként egy hely közvetlenül szélességi és hosszúsági fokkal is megadható. A használat a következő két módra oszlik:"
          ],
          [
            "↳ Hely alkalmazása",
            "Az Alkalmazás azonnal referenciaként állítja be a világméretű keresésben kiválasztott helyet, automatikusan bezárja a keresést, és közvetlenül az új helyre mozgatja a térképet."
          ],
          [
            "↳ Koordináták közvetlen megadása",
            "Asztali Google Mapsben kattints jobb gombbal a kívánt pontra, másold ki a koordinátákat a helyi menüből, majd illeszd be a „Lat / Lon” mezőbe. A koordináták a MapTiler Coordinates segítségével is meghatározhatók: https://www.maptiler.com/tools/coordinates/ . Példa (Lat / Lon): 53.837691, 9.956105. A Gewitterradar tizedes fokokat használ; egy szabadon választott elnevezés opcionális."
          ],
          [
            "Mentett helyek listájának beállítása",
            "Ahhoz, hogy helyeket vagy koordinátákat lehessen menteni és később kényelmesen megnyitni a Gewitterradar menüjéből, egyszer létre kell hozni egy tárolóterületet a Home Assistant To-do funkciójával.\n↳ Beállítás:\nBeállítások → Eszközök és szolgáltatások → Integráció hozzáadása → keresd meg a „Local To-do” integrációt, majd válaszd ki. A lista neve pontosan „Gewitterradar Orte” legyen, majd fejezd be a beállítást."
          ],
          [
            "Mentett helyek",
            "★ Mentés tartósan, helyben tárolja a megtalált helyeket. A helymenü „Mentett helyek” részében jelennek meg, és újabb keresés nélkül használhatók. A × nem töröl azonnal, hanem eltávolításra jelöli a helyet. Az „Eltávolított helyek” alatt a ↶ bármikor visszaállítja; a koordináták és metaadatok megmaradnak."
          ]
        ],
        "notes": [
          "A térkép elmozdulása önmagában nem bizonyítja, hogy a Blitzortung már átállította az élő adatok régióját. A natív integráció a Dashboard-követő helyett a device_tracker.gewitterradar entitást használja."
        ]
      },
      {
        "key": "mapview",
        "title": "Térképnézetek és 3D rétegválasztó",
        "layerGraphic": true,
        "layerGraphicAlt": "3D rétegválasztó arany, kék és piros színben",
        "layerGraphicCaption": "A rétegválasztóval a térképnézet bármikor átkapcsolható Normál, Nagy és Teljes képernyős mód között.",
        "paragraphs": [],
        "entries": [
          [
            "Normál",
            "A Gewitterradar kártyán belüli normál térképmagasságot használja."
          ],
          [
            "Nagy",
            "A vezérlőpulton belül nagyobbra nyitja a térképet, így több térképfelület áll rendelkezésre teljes képernyős mód nélkül."
          ],
          [
            "Teljes képernyő",
            "Teljes képernyőn nyitja meg a térképet. A helyjelző, az iránytű, a medál, a jelmagyarázat és a térképvezérlők továbbra is elérhetők."
          ],
          [
            "Térképmegjelenítés a Beállításokban",
            "A „Térképmegjelenítés“ rész határozza meg az eszköz vagy böngészőprofil alapértelmezett nézetét és a külön térképablakot."
          ],
          [
            "Alapértelmezett nézet",
            "Meghatározza, hogy a Gewitterradar Normál, Nagy, Teljes képernyős vagy a legutóbb használt térképnézettel induljon. A választás csak helyileg, az adott eszközön vagy a használt böngészőprofilban kerül mentésre."
          ],
          [
            "Külön térképablak",
            "Külön ablakban nyitja meg a vihar nézetet az aktuálisan kiválasztott térképpel és iránytűvel. A normál vezérlőpult-nézet ettől külön marad. A funkció a Beállítások menüből érhető el."
          ]
        ],
        "notes": []
      },
      {
        "key": "external_services",
        "title": "Külső szolgáltatások és hálózati engedélyek",
        "paragraphs": [
          "A Gewitterradar két hálózati útvonalat használ: a térkép és keresés közvetlenül a böngészőből/Companion Appból indul, míg a Blitzortung élő adatokat a Home Assistant szerveren futó integráció kéri le. A tűzfalat, VLAN-t, proxyt, DNS-szűrőt és TLS-ellenőrzést ezért külön kell vizsgálni.",
          "Az alábbi célok a V4.07 jelenlegi futásidejű készletét alkotják. A helyi helylista, tracker és Home Assistant szolgáltatások nem igényelnek Internetet."
        ],
        "entries": [
          [
            "Kliens · Open-Meteo geokódolás",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · elsődleges globális keresés; lekérdezést, nyelvet és csak explicit ország-szűrésnél ISO-kódot küld. Hiba esetén Nominatim következik."
          ],
          [
            "Kliens · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · tartalék; lekérdezést, nyelvet és esetleges ISO-kódot küld. A nyilvános hívások között legalább egy másodperc van, a helyi ország-kiegészítés nem használ hálózatot. Ha mindkettő blokkolt, a mentett helyek helyben tovább működnek."
          ],
          [
            "Kliens · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · Leaflet 1.9.4 JavaScript/CSS. Cache nélkül a host blokkolása megakadályozza a térkép indulását."
          ],
          [
            "Kliens · OpenStreetMap csempék",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · alaptérkép-csempék. Blokkoláskor lehetnek adatok, de az alaptérkép üres/hiányos."
          ],
          [
            "Szerver · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · kimenő kapcsolat a Home Assistant szerverről. A Blitzortung v1.7.1 broker/geohash témákat használ élő villámokhoz; blokkolása megállítja az új adatokat, de nem a keresést/térképet."
          ],
          [
            "Helyi · nincs külső engedély",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, koordinátaszolgáltatás, dashboard script és “Gewitterradar Orte” Local to-do lista helyben fut."
          ],
          [
            "Telepítés / frissítés",
            "GitHub/HACS telepítéshez/frissítéshez kell, nem a megnyitott térkép futásidejű függősége."
          ],
          [
            "Gyors diagnosztika",
            "Keresési hiba: Open-Meteo/Nominatim. Térkép nem indul: unpkg.com. Üres alap: OSM csempehostok. Hiányzó/régi villámok: blitzortung.ha.sed.pl:1883 és Blitzortung integráció."
          ]
        ],
        "notes": [
          "A DNS-nek a kliensen és a Home Assistant szerveren is működnie kell a megfelelő célokhoz.",
          "HTTPS proxy, TLS-ellenőrzés, szűrők, blokkolók vagy bővítmények nyitott TCP 443 mellett is akadályozhatnak; geokódolásnál CORS/válaszszűrést is ellenőrizzen.",
          "Adatvédelem: a geokódolás megkapja a lekérdezést/paramétereket, az OSM csempék technikailag jelzik a nézett területet, a Blitzortung broker pedig a feliratkozott régió/geohash témákat.",
          "A http://www.w3.org/2000/svg csak SVG névtér, nem külső hálózati hívás.",
          "A runtime készlet automatikusan védett: új fix külső URL-célnak el kell rontania a tesztet, amíg a dokumentáció és engedélyezés nem frissül."
        ]
      },
      {
        "key": "functions",
        "title": "Fontos funkciók",
        "entries": [
          [
            "Auraeffektek",
            "megjelenítik a villámtevékenységet, de nem módosítják az észlelést vagy a számlálást."
          ],
          [
            "Figyelmeztető animáció",
            "vizuálisan kiemeli a jelentős vihartevékenységet."
          ],
          [
            "Térképcsoportosítás",
            "összevonja a közeli villámjelölőket és áttekinthetően tartja a térképet."
          ],
          [
            "Iránytű: legközelebbi villám",
            "a kijelzőt a legközelebbi észlelt villám felé irányítja."
          ],
          [
            "Eszköz tájolása",
            "támogatott mobileszközökön felhasználhatja az eszköz tájolását."
          ],
          [
            "Külön térképablak",
            "Külön ablakban nyitja meg a vihar nézetet az aktuálisan kiválasztott térképpel és iránytűvel. A normál vezérlőpult-nézet ettől külön marad. A funkció a Beállítások menüből érhető el."
          ],
          [
            "Kalibrálás és diagnosztika",
            "eszközöket biztosít a megjelenítés és az egyes elemek célzott ellenőrzéséhez, méréséhez és hibakereséséhez. Ide tartozik többek között az iránytű és a medál kalibrálása, diagnosztikai nézetek, valamint tesztfunkciók, például a viharszimuláció. Ezek az eszközök beállításhoz, fejlesztéshez és hibakereséshez készültek, normál használatkor pedig maradjanak kikapcsolva."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Ajánlott alapbeállítások",
        "paragraphs": [
          "A stabil induláshoz javasoljuk:"
        ],
        "entries": [
          [
            "Tesztértékek · 500 km / 120 min / 200",
            "Az 500 km észlelési sugár, a 120 perces időablak és a 200 villám példa tesztértékek, nem kötelező beállítások. Az alkalmazási területhez, a kívánt megfigyelési távolsághoz és az egyéni igényekhez igazíthatók."
          ],
          [
            "Hely & tracker összehangolása",
            "Hangolja össze a Blitzortung beállításait az ott konfigurált helyhez és a Gewitterradar által használt trackerhez is. Így az adatrégió és a megjelenítés következetes marad."
          ],
          [
            "Sugarak összehangolása",
            "A Blitzortung forrássugarát állítsa legalább akkorára, mint a Gewitterradar megfigyelési sugarát."
          ],
          [
            "Maradjon bekapcsolva",
            "Hagyja bekapcsolva a térképcsoportosítást és a figyelmeztető animációt."
          ],
          [
            "Opcionális",
            "Az auraeffekteket ízlés szerint állítsa; nem befolyásolják az észlelést. Az eszköz tájolását csak akkor kapcsolja be, ha a használt mobileszközön szükséges."
          ],
          [
            "Normál használat",
            "Normál használatkor tartsa kikapcsolva a „Kalibrálás és diagnosztika” eszközeit, különösen a viharszimulációt."
          ],
          [
            "Recorder – ellenőrizendő",
            "Ellenőrizze a Recorder kizárásait a gyakran frissülő villám- és helyadatokra. Megfelelő kizárások nélkül a Home Assistant adatbázisa és a biztonsági mentések nagyon gyorsan növekedhetnek. Részletek és YAML: „Home Assistant Recorder”."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Ha valami nem működik",
        "entries": [
          [
            "Nincs vagy túl kevés villám",
            "Ellenőrizze a forrás állapotát, a forrássugarat és a használt villámentitásokat."
          ],
          [
            "A távolságok vagy irányok hibásnak tűnnek",
            "Ellenőrizze a referenciahelyet és a távolság mértékegységét."
          ],
          [
            "A biztonsági mentés szokatlanul gyorsan nő",
            "A gyakran frissülő villám- és helyadatok Recorder-kizárásainak hiánya nagyon gyorsan növelheti a Home Assistant adatbázisát, és ezzel a biztonsági mentéseket is. Ellenőrizze a Recorder beállításait; részletek és YAML: „Home Assistant Recorder”."
          ],
          [
            "A nyelvválasztás újra megjelenik",
            "Ellenőrizze az aktuális Gewitterradar-csomag és az inicializálási segéd telepítését."
          ],
          [
            "A megjelenés nem változott frissítés után",
            "Töltse újra teljesen a böngésző/app gyorsítótárát, és ellenőrizze az aktuális JavaScript használatát."
          ],
          [
            "Szokatlan működés vagy kettős kártya",
            "A Home Assistantban csak EGY Gewitterradar modul-erőforrás lehet aktív. A natív integráció és a Dashboard/HACS-erőforrás nem regisztrálhatja egyszerre ugyanazt az egyéni kártyát."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home Assistant Recorder",
        "paragraphs": [
          "A villámadatok nagyon sok állapotváltozást okozhatnak. A hosszú távon karcsú Recorder-konfigurációhoz javasoljuk az alábbi entitások és minták kizárását."
        ],
        "recorder": true,
        "notes": [
          "Ha már van recorder: szakasz, ezeket a bejegyzéseket oda illessze. Ne hozzon létre második felső szintű recorder: blokkot.",
          "A kizárások NEM tiltják le a Gewitterradar által használt élő állapotokat.",
          "A meglévő előzményadatok nem törlődnek automatikusan.",
          "A helyettesítő minták több detektort vagy megfigyelési pontot támogatnak az entitás előtagjától függetlenül."
        ]
      }
    ]
  },
  "Boarisch": {
    "menuTitle": "Hüf & Hinwais",
    "title": "Hüf & Hinwais",
    "subtitle": "Kurz erklärt, damit s Gewitterradar zuverlässig und nachvollziehbar lafft.",
    "close": "Hüf zumacha",
    "copy": "YAML kopiern",
    "copied": "Kopiert",
    "copyFailed": "Kopiern geht ned – bittschön den Code markiern.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Voraussetzungen",
        "paragraphs": [
          "Gewitterradar verarbeitet de Blitzdaten, de Home Assistant vo da verwendeten Blitzortung-Datenquelle erhält. Prüfe dort den richtigen Referenzstandort und stelle den Quellradius mindestens so groß wie den Beobachtungsradius in Gewitterradar a. Gewitterradar ko koane Blitz anzeigen oda auswerten, de vo da Datenquelle scho herausgefiltert wurden."
        ],
        "notes": [
          "Wenn mehrere Blitzortung-Gerät oda Beobachtungspunkte vorhanden san, müassn de verwendeten Entitäten eindeutig zum gewünschten Referenzpunkt passen."
        ]
      },
      {
        "key": "radii",
        "title": "De Radien",
        "paragraphs": [
          "De Radien bauen aufeinander auf: A Blitz im Gefahrenradius zählt gleichzeitig zum Gewitter- und Beobachtungsradius. De Bereiche san Entfernungsschwellen, koane voneinander getrennten Datenquellen.",
          "Unter „Cluster-Auflösung“ stellst ei, wann de Cluster beim Einezoomen in einzelne Blitze aufglöst werdn. Friah löst friah auf, Ausglichen nimmt de bisher erprobte zonenabhängige V4.08-Abstimmung und Spat hält de Cluster länger zamm."
        ],
        "items": [
          "Beobachtungsradius – da äußere Bereich fürs friahzeitige Beobachtn.",
          "Gewitterradius – da nähere Bereich, wo ma besonders Obacht gebn sollt.",
          "Gefahrenradius – da unmittelbare Nahbereich mit besonders hoher Wichtigkeit."
        ],
        "notes": [
          "Da Gefahrenradius is auf maximal 250 km begrenzt. Hinwais zu empfohlenen Ausgangswerten und zur erforderlichen Abstimmung mit da Blitzortung-App findest du unter „Empfohlene Grundeinstellungen“."
        ],
        "featureBlocks": [
          {
            "title": "Cluster-Navigation · Sitzungszeit",
            "body": "legt fest, wia lang a begonnene Cluster-Navigation aktiv bleibt. De Countdown-Zeit kannst frei zwischen 5 und 3600 Sekunden einstellen. {{INFINITY}} hält de Sitzung ohne Zeitlimit offen. Countdown und {{INFINITY}} kannst während da Navigation direkt in da Statusanzeige umschalten.",
            "infinityAlt": "Unbegrenzt"
          }
        ]
      },
      {
        "key": "location",
        "title": "Standort & gspeicherte Ort",
        "paragraphs": [
          "Da gewählte Ort is da Bezugspunkt, vo dem Gewitterradar Entfernunga und Richtunga berechnet. Über de weltweite Ortssuach oda de direkte Eingab vo Koordinaten ko der Bezugspunkt unabhängig vom tatsächlichen Home-Assistant-Standort festglegt werdn. Gspeicherte Ort werdn lokal in Home Assistant abglegt."
        ],
        "entries": [
          [
            "Standort-Tracker & Blitzortung",
            "Gewitterradar verwendet für frei gwählte Ort an virtuellen Standort ois Tracker. In da Dashboard-/Package-Variante vo V4.07 is des device_tracker.gewitterradar_dashboard; de native Integration verwendet device_tracker.gewitterradar. Damit de Blitzdaten dem gwählten virtuellen Standort folgen, muaß de Blitzortung-Integration denselben Tracker ois Standortquelle verwenden.\n↳ Blitzortung einrichten:\nEinstellungen → Gerät & Dienste → Blitzortung → Eintrag hinzufügen. Ois Konfigurationstyp „Location entity“ wählen und danach den passenden Gewitterradar-Tracker ois Standort-Entität auswählen. A vorhandener Eintrag mit festen Breiten-/Längengraden lässt si über „Neu konfigurieren“ ned auf a Standort-Entität umstellen. In dem Fall an neuen Eintrag anlegen, prüfn und den alten Koordinaten-Eintrag erst danach deaktivieren oda löschen."
          ],
          [
            "Weltweite Ortssuach & Koordinaten",
            "Mit da weltweiten Ortssuach kenna Ort und Postleitzahlen gsucht und ois Bezugsstandort verwendt werdn. Alternativ lässt si a Standort direkt über Breiten- und Längengrad festlegen. De Bedienung teilt si in de zwoa folgenden Wege auf:"
          ],
          [
            "↳ Ort übernehmen",
            "Übernehmen setzt den in da weltweiten Ortssuach gwählten Ort sofort ois Bezugsstandort, schließt de Ortssuach automatisch und fährt de Karte direkt zum neuen Standort."
          ],
          [
            "↳ Koordinaten direkt eingeben",
            "Koordinaten kenna in Google Maps am Desktop am gewünschten Punkt per Rechtsklick ausm Kontextmenü kopiert und danach unter „Lat / Lon“ eingfügt werdn. Alternativ kenna Koordinaten über MapTiler Coordinates ermittelt werdn: https://www.maptiler.com/tools/coordinates/ . Beispiel (Lat / Lon): 53.837691, 9.956105. Gewitterradar verwendet Dezimalgrad; a freie Bezeichnung is optional."
          ],
          [
            "Speicherliste einrichten",
            "Damit Ort oda Koordinaten gspeichert und später bequem übers Gewitterradar-Menü aufgrufn werdn kenna, muaß einmalig a Speicherbereich über de To-do-Funktion vo Home Assistant eingerichtet werdn.\n↳ Einrichtung:\nEinstellungen → Gerät & Dienste → Integration hinzufügen → nach „Local To-do“ suacha und de Integration auswählen. Ois Listenname exakt „Gewitterradar Orte“ vergeben und de Einrichtung abschließen."
          ],
          [
            "Gspeicherte Ort",
            "★ Speichern legt gfundene Ort dauerhaft lokal ab. Sie erscheinen im Standortmenü unter „Gspeicherte Ort“ und kenna ohne erneute Ortssuach verwendt werdn. Mit × wird a Ort ned sofort gelöscht, sondern zur Löschung vorgemerkt. Unter „Entfernte Ort“ stellt ↶ ihn jederzeit wieder her; Koordinaten und Metadaten bleiben erhalten."
          ]
        ],
        "notes": [
          "A Kartenwechsel allein beweist ned, dass Blitzortung seine Live-Datenregion scho umgestellt hod. Bei da nativen Integration wird statt des Dashboard-Trackers device_tracker.gewitterradar verwendet."
        ]
      },
      {
        "key": "mapview",
        "title": "Kartnansichtn & 3D-Layer-Schalter",
        "layerGraphic": true,
        "layerGraphicAlt": "3D-Layer-Schalter in Gold, Blau und Rot",
        "layerGraphicCaption": "Übern Layer-Wähler kannst d Kartnansicht jederzeit zwischen Standard, Groß und Vollbild umschaltn.",
        "paragraphs": [],
        "entries": [
          [
            "Standard",
            "Normale Kartnhöhe in da Gewitterradar-Kartn."
          ],
          [
            "Groß",
            "Macht d Kartn im Dashboard größer und schafft mehr Kartnfläch, ohne Vollbild aufzumacha."
          ],
          [
            "Vollbild",
            "Macht d Kartn im Vollbild auf. Standort-Pille, Kompass, Medaillon, Legende und Kartnbedienung bleibn verfügbar."
          ],
          [
            "Kartndarstellung in de Einstellungen",
            "Im Bereich „Kartndarstellung“ legst d Standardansicht für des Gerät bzw. Browserprofil und s eigene Kartnfenster fest."
          ],
          [
            "Standardansicht",
            "Legt fest, ob Gewitterradar mit Standard, Groß, Vollbild oder da zuletzt verwendeten Kartnansicht startet. D Auswahl wird bloß lokal auf dem jeweiligen Gerät bzw. im verwendeten Browserprofil gspeichert."
          ],
          [
            "Eigens Kartnfenster",
            "Macht d Gewitteransicht mit da aktuell ausgewählten Kartn und dem aktuell ausgewählten Kompass in am separaten Fenster auf. D normale Dashboard-Ansicht bleibt davon getrennt. De Funktion is über s Einstellungsmenü verfügbar."
          ]
        ],
        "notes": []
      },
      {
        "key": "external_services",
        "title": "Externe Dienst & Netzwerkzugriff",
        "paragraphs": [
          "Gewitterradar hot zwei getrennte Netzwerkpfade: Karte und Ortssuach gehen vom Endgerät/Companion App raus, Blitzortung-Live-Daten holt dagegen de Blitzortung-Integration aufm Home-Assistant-Server. Firewall, VLAN, Proxy, DNS-Filter und TLS-Inspection müassn drum getrennt geprüft werdn.",
          "De folgenden Ziele san da gradige V4.07-Laufzeitbestand. Ortsbibliothek, Tracker und Home-Assistant-Services laufen lokal und brauchen dafür koa Internet."
        ],
        "entries": [
          [
            "Client · Open-Meteo Geocoding",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · primäre weltweite Ort-/PLZ-Suach; sendet Suchbegriff, Sprache und bloß bei explizitem Länderfilter den ISO-Code. Bei Fehler folgt Nominatim."
          ],
          [
            "Client · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · Rückfall; sendet Suchbegriff, Sprache und ggf. ISO-Code. Öffentliche Aufrufe ham mindestens a Sekunde Abstand; lokale Länder-Autovervollständigung macht koane Netzaufrufe. San beide blockiert, bleiben gespeicherte Ort lokal nutzbar."
          ],
          [
            "Client · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · lädt Leaflet 1.9.4 JavaScript/CSS. Ohne vorhandenes Leaflet verhindert a Sperre den Kartenstart."
          ],
          [
            "Client · OpenStreetMap-Kacheln",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · Grundkartenkacheln. Bei Sperre kenna Gewitterradar-Daten da sei, aber de Grundkarte bleibt leer/unvollständig."
          ],
          [
            "Server · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · ausgehend vom Home-Assistant-Server. Blitzortung v1.7.1 nutzt Broker/Geohash-Themen für Live-Blitz; Sperre stoppt neue Live-Daten, ned Ortssuach/Karte."
          ],
          [
            "Lokal · koane externe Freigabe",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, Koordinatenservice, Dashboard-Script und Local-to-do-Liste “Gewitterradar Ort” laufen lokal."
          ],
          [
            "Installation / Aktualisierung",
            "GitHub/HACS san für Installation/Aktualisierung da, ned Laufzeitabhängigkeit da geöffneten Karte."
          ],
          [
            "Schnelldiagnose",
            "Ortssuach kaputt: Open-Meteo/Nominatim prüfn. Karte startet ned: unpkg.com. Grundkarte leer: OSM-Kachelhosts. Blitz fehlen/alt: blitzortung.ha.sed.pl:1883 und Blitzortung-Integration prüfn."
          ]
        ],
        "notes": [
          "DNS muaß auf Endgerät und Home-Assistant-Server für de jeweils nötigen Ziele funktionieren.",
          "HTTPS-Proxy, TLS-Inspection, Filter, Blocker oda Browser-Erweiterungen kenna trotz TCP 443 Anfragen sperren; bei Geocoding auch CORS/Antwortfilter prüfn.",
          "Datenschutz: Geocoding erhält Suchbegriff/Parameter, OSM-Kacheln verraten technisch den betrachteten Kartenausschnitt und da Blitzortung-Broker erhält abonnierte Regions-/Geohash-Themen.",
          "http://www.w3.org/2000/svg is bloß da SVG-Namensraum und koa externer Netzwerkaufruf.",
          "Des Laufzeitinventar is automatisiert abgesichert: a neues festes externes URL-Ziel soll den Test brechen, bis Doku und Freigaben aktualisiert san."
        ]
      },
      {
        "key": "functions",
        "title": "Wichtige Funktionen",
        "entries": [
          [
            "Aura-Effekte",
            "visualisieren Blitzaktivität, verändern aber ned de Erkennung oda Zählung."
          ],
          [
            "Warnanimation",
            "hebt wichtige Gewitteraktivität optisch auße."
          ],
          [
            "Kartengruppierung",
            "fasst nahe Blitzmarker zusammen und hält de Karte übersichtlicher."
          ],
          [
            "Kompass: nächster Blitz",
            "richtet de Anzeige auf den nächstgelegenen erkannten Blitz."
          ],
          [
            "Geräteorientierung",
            "ko auf unterstützten Mobilgeräten de Geräteausrichtung einbeziehen."
          ],
          [
            "Eigens Kartnfenster",
            "Macht d Gewitteransicht mit da aktuell ausgewählten Kartn und dem aktuell ausgewählten Kompass in am separaten Fenster auf. D normale Dashboard-Ansicht bleibt davon getrennt. De Funktion is über s Einstellungsmenü verfügbar."
          ],
          [
            "Kalibrierung & Diagnose",
            "stellt Werkzeuge zur gezielten Prüfung, Vermessung und Fehleranalyse da Darstellung und einzelner Komponenten bereit. Dazu gehören unter anderem Kompass- und Medaillon-Kalibrierung, Diagnoseansichten sowie Testfunktionen wie de Gewittersimulation. Diese Werkzeuge san für Einrichtung, Entwicklung und Fehlersuche gedacht und sollten im normalen Betrieb deaktiviert bleiben."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Empfohlene Grundeinstellungen",
        "paragraphs": [
          "Für an stabilen Start empfehlen wir:"
        ],
        "entries": [
          [
            "Testwerte · 500 km / 120 min / 200",
            "500 km Erfassungsradius, 120 Minuten Zeitfenster und 200 Blitz san Beispielwerte für den Test und koane zwingenden Vorgaben. Sie kenna abhängig vo Einsatzgebiet, gewünschter Beobachtungsreichweite und persönlicher Nutzung angepasst werdn."
          ],
          [
            "Standort & Tracker abstimmen",
            "De entsprechenden Einstellungen müassn auch in da Blitzortung-App passend hinterlegt werdn – sowohl beim dort konfigurierten Standort ois auch für den vo Gewitterradar verwendeten Tracker. Bloß so arbeiten Datenbereich und Darstellung konsistent zusammen."
          ],
          [
            "Radien abstimmen",
            "Den Quellradius da Blitzortung-Datenquelle mindestens so groß wie den Gewitterradar-Beobachtungsradius einstellen."
          ],
          [
            "Aktiv lassen",
            "Kartengruppierung und Warnanimation eigschaltet lassn."
          ],
          [
            "Optional",
            "Aura-Effekte nach persönlichem Geschmack einstellen; sie beeinflussen de Erkennung ned. Geräteorientierung bloß aktivieren, wenn sie auf dem verwendeten Mobilgerät benötigt wird."
          ],
          [
            "Normalbetrieb",
            "Werkzeuge aus „Kalibrierung & Diagnose“, insbesondere de Gewittersimulation, im normalen Betrieb deaktiviert lassen."
          ],
          [
            "Recorder – unbedingt prüfn",
            "Recorder-Ausschlüsse für häufig aktualisierte Blitz- und Positionsdaten prüfn. Fehlen geeignete Ausschlüsse, kenna Home-Assistant-Datenbank und Backups sehr schnell anwachsen. Details und YAML siehe „Home-Assistant-Recorder“."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Wenn wos ned stimmt",
        "entries": [
          [
            "Koane oda zu wenige Blitz",
            "Status da Blitzortung-Datenquelle, Quellradius und verwendete Blitz-Entitäten prüfn."
          ],
          [
            "Entfernunga oda Richtunga wirken falsch",
            "Referenzstandort und Distanzeinheit prüfn."
          ],
          [
            "Backup wachst ungewöhnlich schnell",
            "Fehlende Recorder-Ausschlüsse für häufig aktualisierte Blitz- und Positionsdaten kenna de Home-Assistant-Datenbank und dadurch auch Backups sehr schnell vergrößern. Recorder-Einstellungen prüfn; Details und YAML siehe „Home-Assistant-Recorder“."
          ],
          [
            "Sprachauswahl kummt immer wieder",
            "Prüfn, ob des gradige Gewitterradar-Package installiert is und da Initialisierungshelfer vorhanden is."
          ],
          [
            "Darstellung nachm Update unverändert",
            "Browser-/App-Cache vollständig neu laden und sicherstellen, dass de gradige JavaScript-Datei verwendt wird."
          ],
          [
            "Merkwürdiges Verhalten oda doppelte Karte",
            "In Home Assistant derf bloß EINE Gewitterradar-Modulressource aktiv sei. Native Integration und Dashboard-/HACS-Ressource dürfen ned gleichzeitig dieselbe Custom Card registrieren."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home-Assistant-Recorder",
        "paragraphs": [
          "Blitzdaten kenna sehr viele Zustandsänderungen erzeugen. Für an langfristig schlanken Recorder empfehlen wir, de folgenden Entitäten bzw. Entitätsmuster auszuschließen."
        ],
        "recorder": true,
        "notes": [
          "Falls scho a recorder:-Abschnitt existiert, diese Einträge dort ergänzen. Keinen zweiten Top-Level-recorder:-Block anlegen.",
          "De Ausschlüsse deaktivieren NICHT de Live-Zustände für Gewitterradar.",
          "Bereits vorhandene historische Daten werdn dadurch ned automatisch gelöscht.",
          "De Wildcards unterstützen mehrere Blitzortung-Gerät bzw. Beobachtungspunkte unabhängig vom Entity-Präfix."
        ]
      }
    ]
  },
  "Plattdüütsch": {
    "menuTitle": "Hülp & Henwiesen",
    "title": "Hülp & Henwiesen",
    "subtitle": "Kort verklort, dormit Gewitterradar seker un good to verstahn arbeidt.",
    "close": "Hülp tomaken",
    "copy": "YAML koperen",
    "copied": "Kopeert",
    "copyFailed": "Koperen geiht nich – markeer den Code.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Vörutsetten",
        "paragraphs": [
          "Gewitterradar verarbeitet de Blitzdaten, de Home Assistant vun de verwendeten Blitzortung-Datenquelle erhält. Prüfe dort den richtigen Referenzstandort un stelle den Quellradius mindestens so groß wie den Beobachtungsradius in Gewitterradar en. Gewitterradar kann keen Blitzen anzeigen oder auswerten, de vun de Datenquelle al herausgefiltert wurden."
        ],
        "notes": [
          "Wenn mehr Blitzortung-Geräte oder Beobachtungspunkte vorhanden sind, mööten de verwendeten Entitäten eindeutig zum gewünschten Referenzpunkt passen."
        ]
      },
      {
        "key": "radii",
        "title": "De Radien",
        "paragraphs": [
          "De Radien bauen aufeinander auf: En Blitz im Gefahrenradius zählt gleichzeitig zum Gewitter- un Beobachtungsradius. De Bereiche sind Entfernungsschwellen, keen voneinander getrennten Datenquellen.",
          "Ünner „Cluster-Uplösen“ stellst du in, wann de Cluster bi’t Rinzoomen in enkelte Blitzen oplööst warrt. Fröh lööst eher op, Utbalanciert bruukt de betherto bepröövte, zonenafhängige V4.08-Afstimmung un Laat höllt de Cluster länger tosamen."
        ],
        "items": [
          "Beobachtungsradius – äußerer Bereich för frühe Beobachtung.",
          "Gewitterradius – dat neegere Rebeet, dor muttst du beter oppassen.",
          "Gefahrenradius – dat direkte Nahrebeet mit besünners hoge Bedüden."
        ],
        "notes": [
          "De Gefahrenradius is auf maximal 250 km begrenzt. Henwiesen zu empfohlenen Ausgangswerten un zur erforderlichen Abstimmung mit de Blitzortung-App findest du unter „Empfohlene Grundeinstellungen“."
        ],
        "featureBlocks": [
          {
            "title": "Cluster-Navigation · Sitzungstiet",
            "body": "leggt fast, wo lang en anfungen Cluster-Navigation aktiv blifft. De Countdown-Tiet lett sik free twischen 5 un 3600 Sekunnen instellen. {{INFINITY}} höllt de Sitzung ahn Tietgrenz apen. Countdown un {{INFINITY}} laat sik wielt de Navigation direktemang in de Statuswies wesseln.",
            "infinityAlt": "Ahn Tietgrenz"
          }
        ]
      },
      {
        "key": "location",
        "title": "Steed & spiekerte Öörd",
        "paragraphs": [
          "De utwählte Oort is de Bezugspunkt, vun den Gewitterradar Afstänn un Richtungen berekent. Över de weltwiede Ortssöök oder dat direkte Ingeven vun Koordinaten kann disse Bezugspunkt unabhängig vun de tatsächliche Home-Assistant-Steed fastleggt warrn. Spiekerte Öörd warrt lokal in Home Assistant afleggt."
        ],
        "entries": [
          [
            "Steed-Tracker & Blitzortung",
            "Gewitterradar bruukt för free wählte Öörd en virtuelle Steed as Tracker. In de Dashboard-/Package-Variante vun V4.07 is dat device_tracker.gewitterradar_dashboard; de native Integration bruukt device_tracker.gewitterradar. Dormit de Blitzdaten de wählte virtuelle Steed folgen, mutt de Blitzortung-Integration densülvigen Tracker as Steed-Quelle bruken.\n↳ Blitzortung inrichten:\nInstellen → Geräte & Dienste → Blitzortung → Indrag tofögen. As Konfigurationstyp „Location entity“ wählen un dorna den passenden Gewitterradar-Tracker as Steed-Entität auswählen. En vörhannen Indrag mit faste Breiten-/Längengraden lett sik över „Neu konfigurieren“ nich op en Steed-Entität ümstellen. In düssen Fall en niegen Indrag anleggen, pröven un den olen Koordinaten-Indrag eerst dorna deaktivieren oder löschen."
          ],
          [
            "Weltwiede Ortssöök & Koordinaten",
            "Mit de weltwiede Ortssöök köönt Öörd un Postleittahlen söcht un as Bezugsteed bruukt warrn. Alternativ lett sik en Steed direkt över Breiten- un Längengrad fastleggen. De Bedienen deelt sik in de twee folgenden Wege:"
          ],
          [
            "↳ Oort övernehmen",
            "Övernehmen sett den in de weltwiede Ortssöök wählten Oort glieks as Bezugsteed, maakt de Ortssöök automaatsch to un föhrt de Koort direkt na de niege Steed."
          ],
          [
            "↳ Koordinaten direkt ingeven",
            "Koordinaten köönt in Google Maps op’n Desktop an de gewünschte Steed per Rechtsklick ut dat Kontextmenü kopiert un dorna ünner „Lat / Lon“ inföögt warrn. Alternativ köönt Koordinaten över MapTiler Coordinates rutkriegen warrn: https://www.maptiler.com/tools/coordinates/ . Bispeel (Lat / Lon): 53.837691, 9.956105. Gewitterradar bruukt Dezimalgrad; en free Beteken is optional."
          ],
          [
            "Spiekerlist inrichten",
            "Dormit Öörd oder Koordinaten spiekert un later bequem över dat Gewitterradar-Menü opropen warrn köönt, mutt eenmal en Spiekerberiek över de To-do-Funktion vun Home Assistant inricht warrn.\n↳ Inrichten:\nInstellen → Geräte & Dienste → Integration tofögen → na „Local To-do“ söken un de Integration auswählen. As Listennaam exakt „Gewitterradar Orte“ ingeven un de Inrichten afsluten."
          ],
          [
            "Spiekerte Öörd",
            "★ Spiekern leggt funnen Öörd duerhaft lokal af. Se staht in’t Steed-Menü ünner „Spiekerte Öörd“ un köönt ahn niege Ortssöök bruukt warrn. Mit × warrt en Oort nich glieks löscht, man för’t Löschen vörmarkt. Ünner „Wegnahmen Öörd“ stellt ↶ em jeden Tied wedder her; Koordinaten un Metadaten blievt erhollen."
          ]
        ],
        "notes": [
          "En Koortwessel alleen bewies nich, dat Blitzortung sien Live-Datenregion al ümstellt hett. Bi de nativen Integration warrt statt den Dashboard-Tracker device_tracker.gewitterradar bruukt."
        ]
      },
      {
        "key": "mapview",
        "title": "Koortansichten & 3D-Lagen-Schalter",
        "layerGraphic": true,
        "layerGraphicAlt": "3D-Lagen-Schalter in Gold, Blau un Root",
        "layerGraphicCaption": "Mit den Lagen-Wähler kannst du de Koortansicht jümmers twischen Standard, Groot un Vullbild wesseln.",
        "paragraphs": [],
        "entries": [
          [
            "Standard",
            "Normale Koorthööcht binnen de Gewitterradar-Koort."
          ],
          [
            "Groot",
            "Maakt de Koort binnen dat Dashboard groter un gifft mehr Koortflach, ahn den Vullbildmodus optomaken."
          ],
          [
            "Vullbild",
            "Maakt de Koort in Vullbild op. Oort-Pill, Kompass, Medaillon, Legende un Koortbedenen blievt dor verfügbar."
          ],
          [
            "Koortdarstellen in de Instellen",
            "In den Deel „Koortdarstellen“ warrt de Standardansicht för dit Reedschap oder Browserprofil un dat enkelte Koortfinster fastleggt."
          ],
          [
            "Standardansicht",
            "Leggt fast, wat Gewitterradar mit Standard, Groot, Vullbild oder de tolest bruukte Koortansicht start. De Utwahl warrt bloots lokaal op dat jeweilige Reedschap oder in dat bruukte Browserprofil spiekert."
          ],
          [
            "Egen Koortfinster",
            "Maakt de Gewitteransicht mit de opstunns utsöchte Koort un den opstunns utsöchten Kompass in en egen Finster op. De normale Dashboard-Ansicht blifft dorvun trennt. Disse Funkschoon is över dat Instellungsmenü verfügbar."
          ]
        ],
        "notes": []
      },
      {
        "key": "external_services",
        "title": "Buten-Deensten & Nettwark-Togrepen",
        "paragraphs": [
          "Gewitterradar hot zwei getrennte Netzwerkpfade: Koort un Ortssuche gehen vom Endgerät/Companion App raus, Blitzortung-Live-Daten holt dagegen de Blitzortung-Integration aufm Home-Assistant-Server. Firewall, VLAN, Proxy, DNS-Filter un TLS-Inspection mööten drum getrennt geprüft warrn.",
          "De folgenden Ziele sind de aktuelle V4.07-Laufzeitbestand. Ortsbibliothek, Tracker un Home-Assistant-Services laufen lokal un brauchen dafür keen Internet."
        ],
        "entries": [
          [
            "Client · Open-Meteo Geocoding",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · primäre weltweite Oort-/PLZ-Söök; sendet Suchbegriff, Sprache un bloots bei explizitem Länderfilter den ISO-Code. Bei Fehler folgt Nominatim."
          ],
          [
            "Client · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · Rückfall; sendet Suchbegriff, Sprache un ggf. ISO-Code. Öffentliche Aufrufe hebben mindestens en Sekunde Abstand; lokale Länder-Autovervollständigung macht keen Netzaufrufe. Sind beide blockiert, bleiben gespeicherte Öörd lokal nutzbar."
          ],
          [
            "Client · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · lädt Leaflet 1.9.4 JavaScript/CSS. Ohne vorhandenes Leaflet verhindert en Sperre den Kartenstart."
          ],
          [
            "Client · OpenStreetMap-Kacheln",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · Grundkartenkacheln. Bei Sperre köönen Gewitterradar-Daten da wesen, aber de Grundkarte bleibt leer/unvollständig."
          ],
          [
            "Server · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · ausgehend vom Home-Assistant-Server. Blitzortung v1.7.1 nutzt Broker/Geohash-Themen för Live-Blitzen; Sperre stoppt neue Live-Daten, nich Ortssuche/Koort."
          ],
          [
            "Lokal · keen externe Freigabe",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, Koordinatenservice, Dashboard-Script un Local-to-do-Liste “Gewitterradar Öörd” laufen lokal."
          ],
          [
            "Installation / Aktualisierung",
            "GitHub/HACS sind för Installation/Aktualisierung da, nich Laufzeitabhängigkeit de geöffneten Koort."
          ],
          [
            "Schnelldiagnose",
            "Ortssuche kaputt: Open-Meteo/Nominatim pröven. Koort startet nich: unpkg.com. Grundkarte leer: OSM-Kachelhosts. Blitzen fehlen/alt: blitzortung.ha.sed.pl:1883 un Blitzortung-Integration pröven."
          ]
        ],
        "notes": [
          "DNS mutt auf Endgerät un Home-Assistant-Server för de jeweils nötigen Ziele funktionieren.",
          "HTTPS-Proxy, TLS-Inspection, Filter, Blocker oder Browser-Erweiterungen köönen trotz TCP 443 Anfragen sperren; bei Geocoding ok CORS/Antwortfilter pröven.",
          "Datenschutz: Geocoding erhält Suchbegriff/Parameter, OSM-Kacheln verraten technisch den betrachteten Kartenausschnitt un de Blitzortung-Broker erhält abonnierte Regions-/Geohash-Themen.",
          "http://www.w3.org/2000/svg is bloots de SVG-Namensraum un keen externer Netzwerkaufruf.",
          "Dat Laufzeitinventar is automatisiert abgesichert: en neues festes externes URL-Ziel soll den Test brechen, bis Doku un Freigaben aktualisiert sind."
        ]
      },
      {
        "key": "functions",
        "title": "Wichtige Funktionen",
        "entries": [
          [
            "Aura-Effekte",
            "visualisieren Blitzaktivität, verändern aber nich de Erkennung oder Zählung."
          ],
          [
            "Warnanimation",
            "heevt wichtige Gewitteraktivität sichtbor rut."
          ],
          [
            "Kartengruppierung",
            "fasst nahe Blitzmarker zusammen un hält de Koort übersichtlicher."
          ],
          [
            "Kompass: nächster Blitz",
            "richtet de Anzeige auf den nächstgelegenen erkannten Blitz."
          ],
          [
            "Geräteorientierung",
            "kann auf unterstützten Mobilgeräten de Geräteausrichtung einbeziehen."
          ],
          [
            "Egen Koortfinster",
            "Maakt de Gewitteransicht mit de opstunns utsöchte Koort un den opstunns utsöchten Kompass in en egen Finster op. De normale Dashboard-Ansicht blifft dorvun trennt. Disse Funkschoon is över dat Instellungsmenü verfügbar."
          ],
          [
            "Kalibreren & Diagnose",
            "stellt Werkzeuge zur gezielten Prüfung, Vermessung un Fehleranalyse de Darstellung un einzelner Komponenten bereit. Dazu gehören unter anderem Kompass- un Medaillon-Kalibrierung, Diagnoseansichten sowie Testfunktionen wie de Gewittersimulation. Diese Werkzeuge sind för Einrichtung, Entwicklung un Fehlersuche gedacht un sollten im normalen Betrieb deaktiviert bleiben."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Anraadt Grundinstellen",
        "paragraphs": [
          "För en stabilen Start empfehlen wir:"
        ],
        "entries": [
          [
            "Testwerte · 500 km / 120 min / 200",
            "500 km Erfassungsradius, 120 Minuten Zeitfenster un 200 Blitzen sind Beispielwerte för den Test un keen zwingenden Vorgaben. Sie köönen abhängig vun Einsatzgebiet, gewünschter Beobachtungsreichweite un persönlicher Nutzung angepasst warrn."
          ],
          [
            "Steed & Tracker abstimmen",
            "De entsprechenden Einstellungen mööten ok in de Blitzortung-App passend hinterlegt warrn – sowohl beim dort konfigurierten Steed as ok för den vun Gewitterradar verwendeten Tracker. Bloots so arbeiten Datenbereich un Darstellung konsistent zusammen."
          ],
          [
            "Radien abstimmen",
            "Den Quellradius de Blitzortung-Datenquelle mindestens so groß wie den Gewitterradar-Beobachtungsradius einstellen."
          ],
          [
            "Aktiv lassen",
            "Kartengruppierung un Warnanimation eingeschaltet lassen."
          ],
          [
            "Optional",
            "Aura-Effekte nach persönlichem Geschmack einstellen; sie beeinflussen de Erkennung nich. Geräteorientierung bloots aktivieren, wenn sie auf dem verwendeten Mobilgerät benötigt warrt."
          ],
          [
            "Normalbetrieb",
            "Werkzeuge ut „Kalibrierung & Diagnose“, insbesondere de Gewittersimulation, im normalen Betrieb deaktiviert lassen."
          ],
          [
            "Recorder – unbedingt pröven",
            "Recorder-Ausschlüsse för häufig aktualisierte Blitz- un Positionsdaten pröven. Fehlen geeignete Ausschlüsse, köönen Home-Assistant-Datenbank un Backups sehr schnell anwachsen. Details un YAML siehe „Home-Assistant-Recorder“."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Wenn wat nich stimmt",
        "entries": [
          [
            "Keen oder zu wenige Blitzen",
            "Status de Blitzortung-Datenquelle, Quellradius un verwendete Blitz-Entitäten pröven."
          ],
          [
            "Afstänn oder Richtungen wirken falsch",
            "Referenzstandort un Distanzeinheit pröven."
          ],
          [
            "Backup wasst bannig gau",
            "Fehlende Recorder-Ausschlüsse för häufig aktualisierte Blitz- un Positionsdaten köönen de Home-Assistant-Datenbank un dadurch ok Backups sehr schnell vergrößern. Recorder-Einstellungen pröven; Details un YAML siehe „Home-Assistant-Recorder“."
          ],
          [
            "Sprachauswahl erscheint jümmers wieder",
            "Pröven, ob dat aktuelle Gewitterradar-Package installiert is un de Initialisierungshelfer vorhanden is."
          ],
          [
            "Dorstellen na Update nich ännert",
            "Browser-/App-Cache vollständig neu laden un sicherstellen, dass de aktuelle JavaScript-Datei bruukt warrt."
          ],
          [
            "Merkwürdiges Verhalten oder doppelte Koort",
            "In Home Assistant dörv bloots EINE Gewitterradar-Modulressource aktiv wesen. Native Integration un Dashboard-/HACS-Ressource dürfen nich gleichzeitig dieselbe Custom Card registrieren."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home-Assistant-Recorder",
        "paragraphs": [
          "Blitzdaten köönen sehr viele Zustandsänderungen erzeugen. För en langfristig schlanken Recorder empfehlen wir, de folgenden Entitäten bzw. Entitätsmuster auszuschließen."
        ],
        "recorder": true,
        "notes": [
          "Falls al en recorder:-Abschnitt existiert, diese Einträge dort ergänzen. Keinen zweiten Top-Level-recorder:-Block anlegen.",
          "De Ausschlüsse deaktivieren NICHT de Live-Zustände för Gewitterradar.",
          "Bereits vorhandene historische Daten warrn dadurch nich automatisch gelöscht.",
          "De Wildcards unterstützen mehr Blitzortung-Geräte bzw. Beobachtungspunkte unabhängig vom Entity-Präfix."
        ]
      }
    ]
  },
  "Sächs’sch": {
    "menuTitle": "Hilche & Hinweese",
    "title": "Hilche & Hinweese",
    "subtitle": "Gorz erklärt, damidd Gewitterradar zuverlässig un nachvollziehbar looft.",
    "close": "Hilche zumachn",
    "copy": "YAML kopiern",
    "copied": "Kopierd",
    "copyFailed": "Kopiern gehd nich – bidde den Code markiern.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Voraussetzungen",
        "paragraphs": [
          "Gewitterradar verarbeitet de Blitzdaten, de Home Assistant von dr verwendeten Blitzortung-Datenquelle erhält. Prüfe dort den richtigen Referenzstandort un stelle den Quellradius mindestens so groß wie den Beobachtungsradius in Gewitterradar een. Gewitterradar kann keene Blitze anzeigen odder auswerten, de von dr Datenquelle schon herausgefiltert wurden."
        ],
        "notes": [
          "Wenn mehrere Blitzortung-Geräte odder Beobachtungspunkte vorhanden sin, müssn de verwendeten Entitäten eindeutig zum gewünschten Referenzpunkt passen."
        ]
      },
      {
        "key": "radii",
        "title": "De Radien",
        "paragraphs": [
          "De Radien bauen aufeinander auf: Een Blitz im Gefahrenradius zählt gleichzeitig zum Gewitter- un Beobachtungsradius. De Bereiche sin Entfernungsschwellen, keene voneinander getrennten Datenquellen.",
          "Unner „Cluster-Ufflösung“ legste fest, wann de Cluster beim Reinzohm in eenzelne Blitze uffgelöst werdn. Früh löst eher uff, Ausgewogn nimmt de bisher erbrobde zonenabhängische V4.08-Abstimmung un Schbäd hält de Cluster länger zusamm."
        ],
        "items": [
          "Beobachdungsradius – dr äußere Bereich fürs frühe Beobachdn.",
          "Gewidderradius – dr nähere Bereich, wo de besser uffbassn sollst.",
          "Gefahrenradius – dr direkte Nahbereich mit besonders hoher Wischdschkeid."
        ],
        "notes": [
          "Dr Gefahrenradius is auf maximal 250 km begrenzt. Hinweese zu empfohlenen Ausgangswerten un zur erforderlichen Abstimmung mit dr Blitzortung-App findest du unter „Empfohlene Grundeinstellungen“."
        ],
        "featureBlocks": [
          {
            "title": "Cluster-Navigation · Sitzungszeit",
            "body": "legt fest, wie lange eene gestartete Cluster-Navigation aktiv bleibt. De Countdown-Zeit kannste frei zwischen 5 un 3600 Sekundn einstellen. {{INFINITY}} hält de Sitzung ohne Zeitbegrenzung offen. Countdown un {{INFINITY}} kannste während dr Navigation direkt in dr Statusanzeige umschalten.",
            "infinityAlt": "Unbegrenzt"
          }
        ]
      },
      {
        "key": "location",
        "title": "Standord & gespeicherde Orde",
        "paragraphs": [
          "Dr gewählte Ord is dr Bezugspunkt, von dem Gewitterradar Entfernungn un Richtungen berechnet. Über de weltweite Ordssuche odder de direkte Eingabe von Koordinaten kann dieser Bezugspunkt unabhängig vom tatsächlichen Home-Assistant-Standord festgelegt werdn. Gespeicherde Orde werdn lokal in Home Assistant abgelegt."
        ],
        "entries": [
          [
            "Standord-Tracker & Blitzortung",
            "Gewitterradar verwendet für frei gewählte Orde eenen virtuellen Standord als Tracker. In dr Dashboard-/Package-Variante von V4.07 is das device_tracker.gewitterradar_dashboard; de native Integration verwendet device_tracker.gewitterradar. Damit de Blitzdaten dem gewählten virtuellen Standord folgen, muss de Blitzortung-Integration denselben Tracker als Standortquelle verwendn.\n↳ Blitzortung einrichten:\nEinstellungen → Geräte & Dienste → Blitzortung → Eintrag hinzufügen. Als Konfigurationstyp „Location entity“ wählen un danach den passenden Gewitterradar-Tracker als Standord-Entität auswählen. Een vorhandener Eintrag mit festen Breiten-/Längengraden lässt sich über „Neu konfigurieren“ nich auf eene Standord-Entität umstellen. In diesem Fall eenen neuen Eintrag anlegen, prüfn un den alten Koordinaten-Eintrag erst danach deaktivieren odder löschen."
          ],
          [
            "Weltweite Ordssuche & Koordinaten",
            "Mit dr weltweiten Ordssuche könn Orde un Postleitzahlen gesucht un als Bezugsstandord verwendet werdn. Alternativ lässt sich een Standord direkt über Breiten- un Längengrad festlegen. De Bedienung gliedert sich in de beeden folgenden Wege:"
          ],
          [
            "↳ Ord übernehmen",
            "Übernehmen setzt den in dr weltweiten Ordssuche gewählten Ord sofort als Bezugsstandord, schließt de Ordssuche automatisch un fährt de Karte direkt zum neuen Standord."
          ],
          [
            "↳ Koordinaten direkt eingeben",
            "Koordinaten könn in Google Maps am Desktop am gewünschten Punkt per Rechtsklick ausm Kontextmenü kopiert un danach unter „Lat / Lon“ eingefügt werdn. Alternativ könn Koordinaten über MapTiler Coordinates ermittelt werdn: https://www.maptiler.com/tools/coordinates/ . Beispiel (Lat / Lon): 53.837691, 9.956105. Gewitterradar verwendet Dezimalgrad; eene freie Bezeichnung is optional."
          ],
          [
            "Speicherliste einrichten",
            "Damit Orde odder Koordinaten gespeichert un später bequem übers Gewitterradar-Menü aufgerufen werdn könn, muss einmalig een Speicherbereich über de To-do-Funktion von Home Assistant eingerichtet werdn.\n↳ Einrichtung:\nEinstellungen → Geräte & Dienste → Integration hinzufügen → nach „Local To-do“ suchen un de Integration auswählen. Als Listenname exakt „Gewitterradar Orte“ vergeben un de Einrichtung abschließen."
          ],
          [
            "Gespeicherde Orde",
            "★ Speichern legt gefundene Orde dauerhaft lokal ab. Se erscheinen im Standordmenü unter „Gespeicherde Orde“ un könn ohne erneute Ordssuche verwendet werdn. Mit × wird een Ord nich sofort gelöscht, sondern zur Löschung vorgemerkt. Unter „Entfernde Orde“ stellt ↶ ihn jederzeit wieder her; Koordinaten un Metadaten bleiben erhalten."
          ]
        ],
        "notes": [
          "Een Kartenwechsel allein beweist nich, dass Blitzortung seine Live-Datenregion schon umgestellt hat. Bei dr nativen Integration wird statt des Dashboard-Trackers device_tracker.gewitterradar verwendet."
        ]
      },
      {
        "key": "mapview",
        "title": "Kartenansischten & 3D-Layer-Schalter",
        "layerGraphic": true,
        "layerGraphicAlt": "3D-Layer-Schalter in Gold, Blau und Rot",
        "layerGraphicCaption": "Übern Layer-Wähler kannste de Kartenansischt jederzeit zwischen Standard, Groß und Vollbild umschaltn.",
        "paragraphs": [],
        "entries": [
          [
            "Standard",
            "Normale Kartenhöhe in der Gewitterradar-Karte."
          ],
          [
            "Groß",
            "Macht de Karte im Dashboard größer und schafft mehr Kartenfläche, ohne den Vollbildmodus offzumachn."
          ],
          [
            "Vollbild",
            "Macht de Karte im Vollbild off. Standort-Pille, Kompass, Medaillon, Legende und Kartenbedienung bleibn dort verfügbar."
          ],
          [
            "Kartendarstellung in den Einstellungen",
            "Im Bereich „Kartendarstellung“ legste de Standardansischt für dieses Gerät bzw. Browserprofil und das eigene Kartenfenster fest."
          ],
          [
            "Standardansischt",
            "Legt fest, ob Gewitterradar mit Standard, Groß, Vollbild oder der zuletzt verwendeten Kartenansischt startet. De Auswahl wird nur lokal auf dem jeweiligen Gerät bzw. im verwendeten Browserprofil gespeichert."
          ],
          [
            "Eigenes Kartenfenster",
            "Macht de Gewitteransischt mit der aktuell gewählten Karte und dem aktuell gewählten Kompass in einem separaten Fenster off. De normale Dashboard-Ansischt bleibt davon getrennt. Diese Funktion is über das Einstellungsmenü verfügbar."
          ]
        ],
        "notes": []
      },
      {
        "key": "external_services",
        "title": "Exderne Diensde & Netzwerkzugriffe",
        "paragraphs": [
          "Gewitterradar hot zwei getrennte Netzwerkpfade: Karte un Ordssuche gehen vom Endgerät/Companion App raus, Blitzortung-Live-Daten holt dagegen de Blitzortung-Integration aufm Home-Assistant-Server. Firewall, VLAN, Proxy, DNS-Filter un TLS-Inspection müssn drum getrennt geprüft werdn.",
          "De folgenden Ziele sin dr grade V4.07-Laufzeitbestand. Ortsbibliothek, Tracker un Home-Assistant-Services laufen lokal un brauchen dafür keen Internet."
        ],
        "entries": [
          [
            "Client · Open-Meteo Geocoding",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · primäre weltweite Ord-/PLZ-Suche; sendet Suchbegriff, Sprache un bloß bei explizitem Länderfilter den ISO-Code. Bei Fehler folgt Nominatim."
          ],
          [
            "Client · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · Rückfall; sendet Suchbegriff, Sprache un ggf. ISO-Code. Öffentliche Aufrufe ham mindestens eene Sekunde Abstand; lokale Länder-Autovervollständigung macht keene Netzaufrufe. Sin beide blockiert, bleiben gespeicherte Orde lokal nutzbar."
          ],
          [
            "Client · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · lädt Leaflet 1.9.4 JavaScript/CSS. Ohne vorhandenes Leaflet verhindert eene Sperre den Kartenstart."
          ],
          [
            "Client · OpenStreetMap-Kacheln",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · Grundkartenkacheln. Bei Sperre könn Gewitterradar-Daten da sein, aber de Grundkarte bleibt leer/unvollständig."
          ],
          [
            "Server · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · ausgehend vom Home-Assistant-Server. Blitzortung v1.7.1 nutzt Broker/Geohash-Themen für Live-Blitze; Sperre stoppt neue Live-Daten, nich Ordssuche/Karte."
          ],
          [
            "Lokal · keene externe Freigabe",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, Koordinatenservice, Dashboard-Script un Local-to-do-Liste “Gewitterradar Orde” laufen lokal."
          ],
          [
            "Installation / Aktualisierung",
            "GitHub/HACS sin für Installation/Aktualisierung da, nich Laufzeitabhängigkeit dr geöffneten Karte."
          ],
          [
            "Schnelldiagnose",
            "Ordssuche kaputt: Open-Meteo/Nominatim prüfn. Karte startet nich: unpkg.com. Grundkarte leer: OSM-Kachelhosts. Blitze fehlen/alt: blitzortung.ha.sed.pl:1883 un Blitzortung-Integration prüfn."
          ]
        ],
        "notes": [
          "DNS muss auf Endgerät un Home-Assistant-Server für de jeweils nötigen Ziele funktionieren.",
          "HTTPS-Proxy, TLS-Inspection, Filter, Blocker odder Browser-Erweiterungen könn trotz TCP 443 Anfragen sperren; bei Geocoding auch CORS/Antwortfilter prüfn.",
          "Datenschutz: Geocoding erhält Suchbegriff/Parameter, OSM-Kacheln verraten technisch den betrachteten Kartenausschnitt un dr Blitzortung-Broker erhält abonnierte Regions-/Geohash-Themen.",
          "http://www.w3.org/2000/svg is bloß dr SVG-Namensraum un keen externer Netzwerkaufruf.",
          "S Laufzeitinventar is automatisiert abgesichert: een neues festes externes URL-Ziel soll den Test brechen, bis Doku un Freigaben aktualisiert sin."
        ]
      },
      {
        "key": "functions",
        "title": "Wicht’sche Funktionen",
        "entries": [
          [
            "Aura-Effekte",
            "visualisieren Blitzaktivität, verändern aber nich de Erkennung odder Zählung."
          ],
          [
            "Warnanimation",
            "hebt wischdsche Gewidderaktivität sichtbar raus."
          ],
          [
            "Kartengruppierung",
            "fasst nahe Blitzmarker zusammen un hält de Karte übersichtlicher."
          ],
          [
            "Kompass: nächster Blitz",
            "richtet de Anzeige auf den nächstgelegenen erkannten Blitz."
          ],
          [
            "Geräteorientierung",
            "kann auf unterstützten Mobilgeräten de Geräteausrichtung einbeziehen."
          ],
          [
            "Eigenes Kartenfenster",
            "Macht de Gewitteransischt mit der aktuell gewählten Karte und dem aktuell gewählten Kompass in einem separaten Fenster off. De normale Dashboard-Ansischt bleibt davon getrennt. Diese Funktion is über das Einstellungsmenü verfügbar."
          ],
          [
            "Kalibrierung & Diagnose",
            "stellt Werkzeuge zur gezielten Prüfung, Vermessung un Fehleranalyse dr Darstellung un einzelner Komponenten bereit. Dazu gehören unter anderem Kompass- un Medaillon-Kalibrierung, Diagnoseansichten sowie Testfunktionen wie de Gewittersimulation. Diese Werkzeuge sin für Einrichtung, Entwicklung un Fehlersuche gedacht un sollten im normalen Betrieb deaktiviert bleiben."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Empfohlene Grundeinstellungen",
        "paragraphs": [
          "Für een stabilen Start empfehlen wir:"
        ],
        "entries": [
          [
            "Testwerte · 500 km / 120 min / 200",
            "500 km Erfassungsradius, 120 Minuten Zeitfenster un 200 Blitze sin Beispielwerte für den Test un keene zwingenden Vorgaben. Sie könn abhängig von Einsatzgebiet, gewünschter Beobachtungsreichweite un persönlicher Nutzung angepasst werdn."
          ],
          [
            "Standord & Tracker abstimmen",
            "De entsprechenden Einstellungen müssn auch in dr Blitzortung-App passend hinterlegt werdn – sowohl beim dort konfigurierten Standord als auch für den von Gewitterradar verwendeten Tracker. Bloß so arbeiten Datenbereich un Darstellung konsistent zusammen."
          ],
          [
            "Radien abstimmen",
            "Den Quellradius dr Blitzortung-Datenquelle mindestens so groß wie den Gewitterradar-Beobachtungsradius einstellen."
          ],
          [
            "Aktiv lassen",
            "Kartengruppierung un Warnanimation eingeschaltet lassen."
          ],
          [
            "Optional",
            "Aura-Effekte nach persönlichem Geschmack einstellen; sie beeinflussen de Erkennung nich. Geräteorientierung bloß aktivieren, wenn sie auf dem verwendeten Mobilgerät benötigt wird."
          ],
          [
            "Normalbetrieb",
            "Werkzeuge aus „Kalibrierung & Diagnose“, insbesondere de Gewittersimulation, im normalen Betrieb deaktiviert lassen."
          ],
          [
            "Recorder – unbedingt prüfn",
            "Recorder-Ausschlüsse für häufig aktualisierte Blitz- un Positionsdaten prüfn. Fehlen geeignete Ausschlüsse, könn Home-Assistant-Datenbank un Backups sehr schnell anwachsen. Details un YAML siehe „Home-Assistant-Recorder“."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Wenn was nich stimmt",
        "entries": [
          [
            "Keene odder zu wenige Blitze",
            "Status dr Blitzortung-Datenquelle, Quellradius un verwendete Blitz-Entitäten prüfn."
          ],
          [
            "Entfernungn odder Richtungen wirken falsch",
            "Referenzstandort un Distanzeinheit prüfn."
          ],
          [
            "Backup wächst ungewöhnlich schnell weider",
            "Fehlende Recorder-Ausschlüsse für häufig aktualisierte Blitz- un Positionsdaten könn de Home-Assistant-Datenbank un dadurch auch Backups sehr schnell vergrößern. Recorder-Einstellungen prüfn; Details un YAML siehe „Home-Assistant-Recorder“."
          ],
          [
            "Sprachauswahl gommd immer wieder",
            "Prüfn, ob s grade Gewitterradar-Package installiert is un dr Initialisierungshelfer vorhanden is."
          ],
          [
            "Darstellung nachm Update unveränderd",
            "Browser-/App-Cache vollständig neu laden un sicherstellen, dass de grade JavaScript-Datei verwendet wird."
          ],
          [
            "Merkwürdiges Verhalten odder doppelte Karte",
            "In Home Assistant derf bloß EINE Gewitterradar-Modulressource aktiv sein. Native Integration un Dashboard-/HACS-Ressource dürfen nich gleichzeitig dieselbe Custom Card registrieren."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home-Assistant-Recorder",
        "paragraphs": [
          "Blitzdaten könn sehr viele Zustandsänderungen erzeugen. Für een langfristig schlanken Recorder empfehlen wir, de folgenden Entitäten bzw. Entitätsmuster auszuschließen."
        ],
        "recorder": true,
        "notes": [
          "Falls schon een recorder:-Abschnitt existiert, diese Einträge dort ergänzen. Keinen zweiten Top-Level-recorder:-Block anlegen.",
          "De Ausschlüsse deaktivieren NICHT de Live-Zustände für Gewitterradar.",
          "Bereits vorhandene historische Daten werdn dadurch nich automatisch gelöscht.",
          "De Wildcards unterstützen mehrere Blitzortung-Geräte bzw. Beobachtungspunkte unabhängig vom Entity-Präfix."
        ]
      }
    ]
  },
  "Schwäbisch": {
    "menuTitle": "Hilf & Hinweis",
    "title": "Hilf & Hinweis",
    "subtitle": "Kurz erklärt, dass s Gewitterradar zuverlässig ond nachvollziehbar lauft.",
    "close": "Hilf zumacha",
    "copy": "YAML kopiera",
    "copied": "Kopiert",
    "copyFailed": "Kopiera goht net – bitte dr Code markiera.",
    "sections": [
      {
        "key": "prerequisites",
        "title": "Voraussetzungen",
        "paragraphs": [
          "Gewitterradar verarbeitet d Blitzdaten, d Home Assistant von dr verwendeten Blitzortung-Datenquelle erhält. Prüfe dort den richtigen Referenzstandort ond stelle den Quellradius mindestens so groß wie den Beobachtungsradius in Gewitterradar a. Gewitterradar kann koi Blitz anzeigen oder auswerten, d von dr Datenquelle scho herausgefiltert wurden."
        ],
        "notes": [
          "Wenn mehrere Blitzortung-Geräte oder Beobachtungspunkte vorhanden send, müsset d verwendeten Entitäten eindeutig zum gewünschten Referenzpunkt passen."
        ]
      },
      {
        "key": "radii",
        "title": "D’Radien",
        "paragraphs": [
          "D Radien bauen aufeinander auf: A Blitz im Gefahrenradius zählt gleichzeitig zum Gewitter- ond Beobachtungsradius. D Bereiche send Entfernungsschwellen, koi voneinander getrennten Datenquellen.",
          "Unter „Cluster-Auflösung“ legsch fescht, wann d Cluster beim Reinzomma in einzelne Blitze aufglöst werdet. Früh löst früher auf, Ausglicha nimmt d bisher erprobte zonenabhängige V4.08-Abstimmung ond Spät hält d Cluster länger zamma."
        ],
        "items": [
          "Beobachtungsradius – dr äußere Bereich fürs frühe Beobachta.",
          "Gewitterradius – dr nähere Bereich, do sollt mr bsunders uffpassa.",
          "Gefahrenradius – dr direkte Nahbereich mit bsunders hoher Bedeutung."
        ],
        "notes": [
          "Dr Gefahrenradius isch auf maximal 250 km begrenzt. Hinweis zu empfohlenen Ausgangswerten ond zur erforderlichen Abstimmung mit dr Blitzortung-App findest du unter „Empfohlene Grundeinstellungen“."
        ],
        "featureBlocks": [
          {
            "title": "Cluster-Navigation · Sitzungszeit",
            "body": "legt fescht, wie lang a gestartete Cluster-Navigation aktiv bleibt. D Countdown-Zeit kannsch frei zwischa 5 ond 3600 Sekunda ei-stella. {{INFINITY}} hält d Sitzung ohne Zeitlimit offen. Countdown ond {{INFINITY}} kannsch während dr Navigation direkt in dr Statusanzeige umschalta.",
            "infinityAlt": "Unbegrenzt"
          }
        ]
      },
      {
        "key": "location",
        "title": "Standort & gspeicherte Ort",
        "paragraphs": [
          "Dr gewählte Ort isch dr Bezugspunkt, von dem Gewitterradar Entfernunga ond Richtunga berechnet. Über d weltweite Ortssuche oder d direkte Eingabe von Koordinaten kann dr Bezugspunkt unabhängig vom tatsächlichen Home-Assistant-Standort festgelegt werda. Gspeicherte Ort werdet lokal in Home Assistant abgelegt."
        ],
        "entries": [
          [
            "Standort-Tracker & Blitzortung",
            "Gewitterradar benutzt für frei gewählte Ort an virtuellen Standort als Tracker. In dr Dashboard-/Package-Variante von V4.07 isch des device_tracker.gewitterradar_dashboard; d native Integration benutzt device_tracker.gewitterradar. Damit d Blitzdaten dem gewählten virtuellen Standort folgen, muss d Blitzortung-Integration denselben Tracker als Standortquelle verwenden.\n↳ Blitzortung einrichten:\nEinstellungen → Geräte & Dienste → Blitzortung → Eintrag hinzufügen. Als Konfigurationstyp „Location entity“ wählen ond danach den passenden Gewitterradar-Tracker als Standort-Entität auswählen. A vorhandener Eintrag mit festen Breiten-/Längengraden lässt sich über „Neu konfigurieren“ net auf a Standort-Entität umstellen. In dem Fall an neuen Eintrag anlegen, prüfa ond den alten Koordinaten-Eintrag erst danach deaktivieren oder löschen."
          ],
          [
            "Weltweite Ortssuche & Koordinaten",
            "Mit dr weltweiten Ortssuche könnet Ort ond Postleitzahlen gsucht ond als Bezugsstandort verwendet werdet. Alternativ lässt sich a Standort direkt über Breiten- ond Längengrad festlegen. D Bedienung gliedert sich in d zwei folgenden Wege:"
          ],
          [
            "↳ Ort übernehmen",
            "Übernehmen setzt den in dr weltweiten Ortssuche gewählten Ort sofort als Bezugsstandort, schließt d Ortssuche automatisch ond fährt d Karte direkt zum neuen Standort."
          ],
          [
            "↳ Koordinaten direkt eingeben",
            "Koordinaten könnet in Google Maps am Desktop am gewünschten Punkt per Rechtsklick ausm Kontextmenü kopiert ond danach unter „Lat / Lon“ eingefügt werdet. Alternativ könnet Koordinaten über MapTiler Coordinates ermittelt werdet: https://www.maptiler.com/tools/coordinates/ . Beispiel (Lat / Lon): 53.837691, 9.956105. Gewitterradar benutzt Dezimalgrad; a freie Bezeichnung isch optional."
          ],
          [
            "Speicherliste einrichten",
            "Damit Ort oder Koordinaten gspeichert ond später bequem übers Gewitterradar-Menü aufgerufen werdet könnet, muss einmalig a Speicherbereich über d To-do-Funktion von Home Assistant eingerichtet werdet.\n↳ Einrichtung:\nEinstellungen → Geräte & Dienste → Integration hinzufügen → nach „Local To-do“ suchen ond d Integration auswählen. Als Listenname exakt „Gewitterradar Orte“ vergeben ond d Einrichtung abschließen."
          ],
          [
            "Gspeicherte Ort",
            "★ Speichern legt gfundene Ort dauerhaft lokal ab. Se erscheinen im Standortmenü unter „Gspeicherte Ort“ ond könnet ohne erneute Ortssuche verwendet werdet. Mit × wird a Ort net sofort gelöscht, sondern zur Löschung vorgemerkt. Unter „Entfernte Ort“ stellt ↶ ihn jederzeit wieder her; Koordinaten ond Metadaten bleiben erhalten."
          ]
        ],
        "notes": [
          "A Kartenwechsel allein beweist net, dass Blitzortung seine Live-Datenregion scho umgestellt hot. Bei dr nativen Integration wird statt des Dashboard-Trackers device_tracker.gewitterradar benutzt."
        ]
      },
      {
        "key": "mapview",
        "title": "Kartenansichte & 3D-Layer-Schalter",
        "layerGraphic": true,
        "layerGraphicAlt": "3D-Layer-Schalter in Gold, Blau ond Rot",
        "layerGraphicCaption": "Über dr Layer-Wähler kannsch d Kartenansicht jederzeit zwischen Standard, Groß ond Vollbild umschalta.",
        "paragraphs": [],
        "entries": [
          [
            "Standard",
            "Normale Kartenhöhe innerhalb dr Gewitterradar-Karte."
          ],
          [
            "Groß",
            "Macht d Karte em Dashboard größer ond schafft mehr Kartenfläche, ohne dr Vollbildmodus aufzumacha."
          ],
          [
            "Vollbild",
            "Macht d Karte em Vollbild auf. Standort-Pille, Kompass, Medaillon, Legende ond Kartenbedienung bleibet dort verfügbar."
          ],
          [
            "Kartendarstellung in de Einstellungen",
            "Em Bereich „Kartendarstellung“ wird d Standardansicht für des Gerät bzw. Browserprofil ond s eigene Kartenfenster festgelegt."
          ],
          [
            "Standardansicht",
            "Legt fest, ob Gewitterradar mit Standard, Groß, Vollbild oder dr zuletzt verwendete Kartenansicht startet. D Auswahl wird bloß lokal auf em jeweilige Gerät bzw. em verwendete Browserprofil gspeichert."
          ],
          [
            "Eigenes Kartenfenster",
            "Macht d Gewitteransicht mit dr aktuell gwählte Karte ond em aktuell gwählte Kompass in eme separaten Fenster auf. D normale Dashboard-Ansicht bleibt davon trennt. Die Funktion isch übers Einstellungsmenü verfügbar."
          ]
        ],
        "notes": []
      },
      {
        "key": "external_services",
        "title": "Externe Dienschd & Netzwerkzugriff",
        "paragraphs": [
          "Gewitterradar hot zwei getrennte Netzwerkpfade: Karte ond Ortssuche gehen vom Endgerät/Companion App raus, Blitzortung-Live-Daten holt dagegen d Blitzortung-Integration aufm Home-Assistant-Server. Firewall, VLAN, Proxy, DNS-Filter ond TLS-Inspection müsset drum getrennt geprüft werdet.",
          "D folgenden Ziele send dr gradige V4.07-Laufzeitbestand. Ortsbibliothek, Tracker ond Home-Assistant-Services laufen lokal ond brauchen dafür koi Internet."
        ],
        "entries": [
          [
            "Client · Open-Meteo Geocoding",
            "geocoding-api.open-meteo.com · HTTPS/TCP 443 · primäre weltweite Ort-/PLZ-Suach; sendet Suchbegriff, Sprache ond bloß bei explizitem Länderfilter den ISO-Code. Bei Fehler folgt Nominatim."
          ],
          [
            "Client · OpenStreetMap Nominatim",
            "nominatim.openstreetmap.org · HTTPS/TCP 443 · Rückfall; sendet Suchbegriff, Sprache ond ggf. ISO-Code. Öffentliche Aufrufe hen mindestens a Sekunde Abstand; lokale Länder-Autovervollständigung macht koi Netzaufrufe. Send beide blockiert, bleiben gespeicherte Orte lokal nutzbar."
          ],
          [
            "Client · Leaflet",
            "unpkg.com · HTTPS/TCP 443 · lädt Leaflet 1.9.4 JavaScript/CSS. Ohne vorhandenes Leaflet verhindert a Sperre den Kartenstart."
          ],
          [
            "Client · OpenStreetMap-Kacheln",
            "a.tile.openstreetmap.org, b.tile.openstreetmap.org, c.tile.openstreetmap.org · HTTPS/TCP 443 · Grundkartenkacheln. Bei Sperre könnet Gewitterradar-Daten da sei, aber d Grundkarte bleibt leer/unvollständig."
          ],
          [
            "Server · Blitzortung v1.7.1",
            "blitzortung.ha.sed.pl · MQTT/TCP 1883 · ausgehend vom Home-Assistant-Server. Blitzortung v1.7.1 nutzt Broker/Geohash-Themen für Live-Blitz; Sperre stoppt neue Live-Daten, net Ortssuche/Karte."
          ],
          [
            "Lokal · koi externe Freigabe",
            "device_tracker.gewitterradar / device_tracker.gewitterradar_dashboard, Koordinatenservice, Dashboard-Script ond Local-to-do-Liste “Gewitterradar Orte” laufen lokal."
          ],
          [
            "Installation / Aktualisierung",
            "GitHub/HACS send für Installation/Aktualisierung da, net Laufzeitabhängigkeit dr geöffneten Karte."
          ],
          [
            "Schnelldiagnose",
            "Ortssuche kaputt: Open-Meteo/Nominatim prüfa. Karte startet net: unpkg.com. Grundkarte leer: OSM-Kachelhosts. Blitz fehlen/alt: blitzortung.ha.sed.pl:1883 ond Blitzortung-Integration prüfa."
          ]
        ],
        "notes": [
          "DNS muss auf Endgerät ond Home-Assistant-Server für d jeweils nötigen Ziele funktionieren.",
          "HTTPS-Proxy, TLS-Inspection, Filter, Blocker oder Browser-Erweiterungen könnet trotz TCP 443 Anfragen sperren; bei Geocoding auch CORS/Antwortfilter prüfa.",
          "Datenschutz: Geocoding erhält Suchbegriff/Parameter, OSM-Kacheln verraten technisch den betrachteten Kartenausschnitt ond dr Blitzortung-Broker erhält abonnierte Regions-/Geohash-Themen.",
          "http://www.w3.org/2000/svg isch bloß dr SVG-Namensraum ond koi externer Netzwerkaufruf.",
          "S Laufzeitinventar isch automatisiert abgesichert: a neues festes externes URL-Ziel soll den Test brechen, bis Doku ond Freigaben aktualisiert send."
        ]
      },
      {
        "key": "functions",
        "title": "Wichtige Funktionen",
        "entries": [
          [
            "Aura-Effekte",
            "visualisieren Blitzaktivität, verändern aber net d Erkennung oder Zählung."
          ],
          [
            "Warnanimation",
            "hebt wichtige Gewitteraktivität sichtbar raus."
          ],
          [
            "Kartengruppierung",
            "fasst nahe Blitzmarker zusammen ond hält d Karte übersichtlicher."
          ],
          [
            "Kompass: nächster Blitz",
            "richtet d Anzeige auf den nächstgelegenen erkannten Blitz."
          ],
          [
            "Geräteorientierung",
            "kann auf unterstützten Mobilgeräten d Geräteausrichtung einbeziehen."
          ],
          [
            "Eigenes Kartenfenster",
            "Macht d Gewitteransicht mit dr aktuell gwählte Karte ond em aktuell gwählte Kompass in eme separaten Fenster auf. D normale Dashboard-Ansicht bleibt davon trennt. Die Funktion isch übers Einstellungsmenü verfügbar."
          ],
          [
            "Kalibrierung & Diagnose",
            "stellt Werkzeuge zur gezielten Prüfung, Vermessung ond Fehleranalyse dr Darstellung ond einzelner Komponenten bereit. Dazu gehören unter anderem Kompass- ond Medaillon-Kalibrierung, Diagnoseansichten sowie Testfunktionen wie d Gewittersimulation. Diese Werkzeuge send für Einrichtung, Entwicklung ond Fehlersuche gedacht ond sollten im normalen Betrieb deaktiviert bleiben."
          ]
        ]
      },
      {
        "key": "defaults",
        "title": "Empfohlene Grundeinstellungen",
        "paragraphs": [
          "Für an stabilen Start empfehlen wir:"
        ],
        "entries": [
          [
            "Testwerte · 500 km / 120 min / 200",
            "500 km Erfassungsradius, 120 Minuten Zeitfenster ond 200 Blitz send Beispielwerte für den Test ond koi zwingenden Vorgaben. Sie könnet abhängig von Einsatzgebiet, gewünschter Beobachtungsreichweite ond persönlicher Nutzung angepasst werdet."
          ],
          [
            "Standort & Tracker abstimmen",
            "D entsprechenden Einstellungen müsset auch in dr Blitzortung-App passend hinterlegt werdet – sowohl beim dort konfigurierten Standort als auch für den von Gewitterradar verwendeten Tracker. Bloß so arbeiten Datenbereich ond Darstellung konsistent zusammen."
          ],
          [
            "Radien abstimmen",
            "Den Quellradius dr Blitzortung-Datenquelle mindestens so groß wie den Gewitterradar-Beobachtungsradius einstellen."
          ],
          [
            "Aktiv lassen",
            "Kartengruppierung ond Warnanimation eingeschaltet lassen."
          ],
          [
            "Optional",
            "Aura-Effekte nach persönlichem Geschmack einstellen; sie beeinflussen d Erkennung net. Geräteorientierung bloß aktivieren, wenn sie auf dem verwendeten Mobilgerät benötigt wird."
          ],
          [
            "Normalbetrieb",
            "Werkzeuge aus „Kalibrierung & Diagnose“, insbesondere d Gewittersimulation, im normalen Betrieb deaktiviert lassen."
          ],
          [
            "Recorder – unbedingt prüfa",
            "Recorder-Ausschlüsse für häufig aktualisierte Blitz- ond Positionsdaten prüfa. Fehlen geeignete Ausschlüsse, könnet Home-Assistant-Datenbank ond Backups sehr schnell anwachsen. Details ond YAML siehe „Home-Assistant-Recorder“."
          ]
        ]
      },
      {
        "key": "troubleshooting",
        "title": "Wenn ebbes net stimmt",
        "entries": [
          [
            "Koi oder zu wenige Blitz",
            "Status dr Blitzortung-Datenquelle, Quellradius ond verwendete Blitz-Entitäten prüfa."
          ],
          [
            "Entfernunga oder Richtunga wirken falsch",
            "Referenzstandort ond Distanzeinheit prüfa."
          ],
          [
            "Backup wächst arg schnell",
            "Fehlende Recorder-Ausschlüsse für häufig aktualisierte Blitz- ond Positionsdaten könnet d Home-Assistant-Datenbank ond dadurch auch Backups sehr schnell vergrößern. Recorder-Einstellungen prüfa; Details ond YAML siehe „Home-Assistant-Recorder“."
          ],
          [
            "Sprachauswahl kommt emmer wieder",
            "Prüfa, ob s gradige Gewitterradar-Package installiert isch ond dr Initialisierungshelfer vorhanden isch."
          ],
          [
            "Darstellung nachm Update unverändert",
            "Browser-/App-Cache vollständig neu laden ond sicherstellen, dass d gradige JavaScript-Datei benutzt wird."
          ],
          [
            "Komischs Verhalta oder doppelte Karta",
            "In Home Assistant derf bloß EINE Gewitterradar-Modulressource aktiv sei. Native Integration ond Dashboard-/HACS-Ressource dürfen net gleichzeitig dieselbe Custom Card registrieren."
          ]
        ]
      },
      {
        "key": "recorder",
        "title": "Home-Assistant-Recorder",
        "paragraphs": [
          "Blitzdaten könnet sehr viele Zustandsänderungen erzeugen. Für an langfristig schlanken Recorder empfehlen wir, d folgenden Entitäten bzw. Entitätsmuster auszuschließen."
        ],
        "recorder": true,
        "notes": [
          "Falls scho a recorder:-Abschnitt existiert, diese Einträge dort ergänzen. Keinen zweiten Top-Level-recorder:-Block anlegen.",
          "D Ausschlüsse deaktivieren NICHT d Live-Zustände für Gewitterradar.",
          "Bereits vorhandene historische Daten werdet dadurch net automatisch gelöscht.",
          "D Wildcards unterstützen mehrere Blitzortung-Geräte bzw. Beobachtungspunkte unabhängig vom Entity-Präfix."
        ]
      }
    ]
  }
};
