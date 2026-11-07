// Shared presentation-only temperature contract. Authoritative field values stay Kelvin.
export const TEMPERATURE_UNITS=Object.freeze(['C','F','K']);
export const temperatureUnitSymbol=unit=>unit==='K'?'K':unit==='F'?'°F':'°C';
export function temperatureDisplayValue(kelvin,unit='C'){return unit==='K'?kelvin:unit==='F'?(kelvin-273.15)*1.8+32:kelvin-273.15;}
export function temperatureKelvinValue(value,unit='C'){return unit==='K'?value:unit==='F'?(value-32)/1.8+273.15:value+273.15;}
export function temperatureInputValue(celsius,unit='C'){return Math.round(temperatureDisplayValue(celsius+273.15,unit)*100)/100;}
// Registered language names match the card's LANGUAGE_DEFINITIONS; use its _t/_locale.
export const TEMPERATURE_UNIT_TRANSLATIONS=Object.freeze({
 Deutsch:['Temperatureinheit','Celsius (°C)','Fahrenheit (°F)','Kelvin (K)','Skalenminimum','Skalenmaximum','Farbstützpunkte'],
 English:['Temperature unit','Celsius (°C)','Fahrenheit (°F)','Kelvin (K)','Scale minimum','Scale maximum','Colour stops'],
 Dansk:['Temperaturenhed','Celsius (°C)','Fahrenheit (°F)','Kelvin (K)','Skalaens minimum','Skalaens maksimum','Farvestop'],
 Español:['Unidad de temperatura','Celsius (°C)','Fahrenheit (°F)','Kelvin (K)','Mínimo de la escala','Máximo de la escala','Puntos de color'],
 Français:['Unité de température','Celsius (°C)','Fahrenheit (°F)','Kelvin (K)','Minimum de l’échelle','Maximum de l’échelle','Points de couleur'],
 Nederlands:['Temperatuureenheid','Celsius (°C)','Fahrenheit (°F)','Kelvin (K)','Minimum van de schaal','Maximum van de schaal','Kleurstops'],
 Polski:['Jednostka temperatury','Celsjusz (°C)','Fahrenheit (°F)','Kelwin (K)','Minimum skali','Maksimum skali','Punkty kolorów'],
 Português:['Unidade de temperatura','Celsius (°C)','Fahrenheit (°F)','Kelvin (K)','Mínimo da escala','Máximo da escala','Pontos de cor'],
 Svenska:['Temperaturenhet','Celsius (°C)','Fahrenheit (°F)','Kelvin (K)','Skalans minimum','Skalans maximum','Färgstopp'],
 Italiano:['Unità di temperatura','Celsius (°C)','Fahrenheit (°F)','Kelvin (K)','Minimo della scala','Massimo della scala','Punti di colore'],
 'Norsk bokmål':['Temperaturenhet','Celsius (°C)','Fahrenheit (°F)','Kelvin (K)','Skalaens minimum','Skalaens maksimum','Fargestopp'],
 Suomi:['Lämpötilayksikkö','Celsius (°C)','Fahrenheit (°F)','Kelvin (K)','Asteikon vähimmäisarvo','Asteikon enimmäisarvo','Väripisteet'],
 Čeština:['Jednotka teploty','Celsius (°C)','Fahrenheit (°F)','Kelvin (K)','Minimum stupnice','Maximum stupnice','Barevné body'],
 Ελληνικά:['Μονάδα θερμοκρασίας','Κελσίου (°C)','Φαρενάιτ (°F)','Κέλβιν (K)','Ελάχιστο κλίμακας','Μέγιστο κλίμακας','Σημεία χρώματος'],
 Magyar:['Hőmérsékleti egység','Celsius (°C)','Fahrenheit (°F)','Kelvin (K)','Skála minimuma','Skála maximuma','Színpontok'],
 Boarisch:['Temperatureinheit','Celsius (°C)','Fahrenheit (°F)','Kelvin (K)','Skalenminimum','Skalenmaximum','Farbstützpunkt'],
 Plattdüütsch:['Temperatureenheit','Celsius (°C)','Fahrenheit (°F)','Kelvin (K)','Skalenminimum','Skalenmaximum','Farfstützpunkten'],
 'Sächs’sch':['Temperatureenheed','Celsius (°C)','Fahrenheit (°F)','Kelvin (K)','Skalenminimum','Skalenmaximum','Farbstützbungde'],
 Schwäbisch:['Temperatureinheit','Celsius (°C)','Fahrenheit (°F)','Kelvin (K)','Skalenminimum','Skalenmaximum','Farbstützpunkt']
});
export function installTemperatureUnitTranslations(i18n){for(const [name,values] of Object.entries(TEMPERATURE_UNIT_TRANSLATIONS)){const table=i18n[name]||(i18n[name]={});table.strings=table.strings||{};['label','C','F','K','minimum','maximum','stops'].forEach((key,i)=>table.strings['temperature.unit.'+key]=values[i]);}}
