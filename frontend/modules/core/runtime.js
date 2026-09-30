import { registerModule } from "./registry.js?v=41002r13";
export const MODULE_META=Object.freeze({id:"core.runtime",version:"1.0.1",group:"Kern",function:"Modul-Laufzeit",subfunctions:["Selbstregistrierung","Methodeninstallation","Abhängigkeitsübergabe"],file:"modules/core/runtime.js"});registerModule(MODULE_META);
export function defineModule(meta,factory){registerModule(meta);return function(CardClass,deps){const methods=factory(deps||{});Object.defineProperties(CardClass.prototype,Object.getOwnPropertyDescriptors(methods));return CardClass;};}
