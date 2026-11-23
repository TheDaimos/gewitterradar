import {settingsStorage} from '../core/settings-vault.js?v=41212r1';
import {LEGEND_HUB_KEY,normalizeLegendHub} from './legend-hub-model.js?v=4129r1';
export function legendHubState(owner){if(!owner.__legendHub){let value;try{value=JSON.parse(settingsStorage(owner).getItem(LEGEND_HUB_KEY));}catch{}owner.__legendHub={config:normalizeLegendHub(value),open:false,locked:null,eyeDrag:null};}return owner.__legendHub;}
export function saveLegendHub(owner,patch){const s=legendHubState(owner);s.config=normalizeLegendHub({...s.config,...patch});settingsStorage(owner).setItem(LEGEND_HUB_KEY,JSON.stringify(s.config));owner._legendHubRefresh?.();return s.config;}
export const legendOptions=(owner,id)=>legendHubState(owner).config.legends[id];
export const legendVisible=(owner,id,inherited)=>({on:true,off:false}[legendOptions(owner,id)?.mode]??inherited);
export function patchLegend(owner,id,patch){const s=legendHubState(owner);if(id==='precipitation'&&patch.mode){owner._weatherDisplaySetLegendMode(patch.mode==='inherit'?'auto':patch.mode);patch={...patch,mode:'inherit'};}
 // Keep native checkboxes/session buttons truthful without invoking a weather
 // setter, fetch, painter or provider. The mode adds independent/off-layer scope.
 if(['on','off'].includes(patch.mode)){if(id==='temperature'||id==='advection'){owner._weatherTemperatureState().config[id+'Legend']=patch.mode==='on';owner._weatherTemperatureSave();}if(id==='wind')owner._weatherWindState().legendOpen=patch.mode==='on';}
 saveLegendHub(owner,{legends:{...s.config.legends,[id]:{...s.config.legends[id],...patch}}});}
