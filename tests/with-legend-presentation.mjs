import assert from 'node:assert/strict';
// An explicit reversible UI allowlist. Full-source guards still compare every
// byte outside these reviewed legend-only integration points to the reference.
export function withoutLegendPresentation(source,path){
 const name=path.split('/').at(-1);let s=source.replaceAll('\r\n','\n');
 if(['wind-display.js','temperature-display.js'].includes(name)&&s.includes("from './legend-preferences.js")){
  s=s.replace(/^import \{(?:legendVisible,)?patchLegend\} from '\.\/legend-preferences\.js\?v=[^']+';\n/,'');
  if(name==='wind-display.js'){
   const adapter="s.legendOpen=!legendVisible(this,'wind',s.legendOpen&&s.config.visible);patchLegend(this,'wind',{mode:s.legendOpen?'on':'off'});";
   assert(s.includes(adapter));s=s.replace(adapter,'s.legendOpen=!s.legendOpen;');
   const update='this._weatherWindQueue();if(s.legend)updateWindLegend';assert(s.includes(update));s=s.replace(update,'this._weatherWindQueue();if(s.legend&&s.legendOpen)updateWindLegend');
  }else{
   const adapter="for(const kind of ['temperature','advection'])if(Object.hasOwn(patch,kind+'Legend'))patchLegend(this,kind,{mode:'inherit'});";assert(s.includes(adapter));s=s.replace(adapter,'');
  }
 }
 if(name==='card-lifecycle.js'&&s.includes('resumeLegendHub')){
  s=s.replace(/^import \{resumeLegendHub,teardownLegendHub\} from '[^']+';\n/m,'').replace('      resumeLegendHub(this);\n','').replace('      teardownLegendHub(this);\n','');assert(!s.includes('LegendHub'));
 }
 if(name==='synoptic-display.js')s=s.replace('  this._legendHubSyncExtra?.();\n','');
 return s;
}
