import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {MODULE_META,RASTER_LAB_LAYER_CATALOG,installRasterLab} from "../frontend/modules/diagnostics/raster-lab.js";
assert.equal(MODULE_META.id,"diagnostics.raster-lab");
assert.equal(MODULE_META.version,"0.1.2");
assert.equal(RASTER_LAB_LAYER_CATALOG.length,16);
assert.equal(new Set(RASTER_LAB_LAYER_CATALOG.map(x=>x[0])).size,16);
assert.equal(RASTER_LAB_LAYER_CATALOG[0][0],"precipitation");
const content=await readFile(new URL("../frontend/modules/diagnostics/raster-lab.js",import.meta.url),"utf8");
for(const keyword of ["data-lab-layer","data-lab-ab","data-lab-reset","data-lab-copy",
"data-lab-export","_rasterLabRegisterAdapter","_rasterLabDownload",
"_rasterLabCopy","_rasterLabClose","_rasterLabReapplyPreview",
"AbortController","new WeakMap","map.off(\"zoomend\""])assert.ok(content.includes(keyword),keyword);
assert.match(content,/_rasterLabHost\(/);
assert.match(content,/map-fullscreen-dialog/);
assert.match(content,/hostObserver\?\.disconnect\(\)/);
assert.ok(!content.includes("setInterval("),"DEV OFF: no periodic background work");
assert.ok(!content.includes("requestAnimationFrame("),"DEV OFF: no animation loop");
const skeleton=await readFile(new URL("../frontend/modules/ui/skeleton.js",import.meta.url),"utf8");
const launchPosition=skeleton.indexOf('id="diagnostic-raster-lab"');
const compassPosition=skeleton.indexOf('id="diagnostic-compass-calibration"');
const medallionPosition=skeleton.indexOf('id="diagnostic-medallion-calibration"');
const followingSection=skeleton.indexOf('id="diagnostic-grid-title"');
assert.ok(compassPosition>=0&&medallionPosition>compassPosition);
assert.ok(launchPosition>medallionPosition&&launchPosition<followingSection,
  "Raster-Labor button must be fixed beside calibration tools at top");
assert.ok(skeleton.includes(".diagnostic-console button.diagnostic-calibration-raster { grid-column:1 / -1;"),"top launcher spans both columns");
assert.ok(!content.includes("host.append(btn)"),
  "Do not append launch after scrollable console body");
const C=class {};
installRasterLab(C,{});
const card=new C();
const launch={dataset:{},handlers:[],addEventListener(type,fn){this.handlers.push({type,fn});}};
card._diagnostics={enabled:true};card.shadow={getElementById:id=>id==="diagnostic-raster-lab"?launch:null};
card._rasterLabEnsureTrigger();card._rasterLabEnsureTrigger();
assert.equal(launch.handlers.length,1,"Attach only once per card instance");
assert.equal(launch.handlers[0].type,"click");
card._diagnostics.enabled=false;
card._rasterLabEnsureTrigger();
assert.equal(launch.handlers.length,1,"DEV OFF must not attach more handlers");
const pane={
 dataset:{},
 style:{filter:"",opacity:"0.73",removeProperty(name){if(name==="opacity")this.opacity="";}}
};
let restored=0;
card._map={getZoom:()=>12,getPane:name=>name==="gr-weather-radar"?pane:null};
card._weatherRadarState=()=>({layer:{options:{maxNativeZoom:7}}});
card._weatherDisplayRasterTuning=()=>({blur:147,contrast:.936,saturate:1.132,brightness:.995});
card._weatherDisplayRefreshRenderedLayers=()=>{restored++;pane.style.filter="blur(147px)";};
card._weatherDisplayReleaseSoftFilter=()=>{};
const state=card._rasterLabState();
const available=card._rasterLabAdapters();
assert.equal(available.size,1,"Only precipitation really implemented");
assert.equal(available.get("precipitation").getPane(),pane);
assert.equal(card._rasterLabSnapshot().nativeZoom,7);
state.open=true;state.preview=true;
const info=card._rasterLabSnapshot();
state.samples.set(card._rasterLabKey(info),{
 layer:"precipitation",zoom:12,nativeZoom:7,values:{...info.base,blur:180,opacity:.45}
});
card._rasterLabReapplyPreview();
assert.match(pane.style.filter,/blur\(180\.00px\)/);
assert.equal(pane.style.opacity,"0.45");
assert.ok(content.includes('Flächenverschmelzung'),"Blend control is required");
state.samples.get(card._rasterLabKey(info)).values.blend=50;
card._rasterLabReapplyPreview();
assert.ok(pane.style.filter.includes("blur(163.50px)"),
  "50 percent should interpolate between accepted base and experimental blur");
assert.equal(pane.dataset.rasterLabPreview,"true");
state.preview=false;card._rasterLabRestore();
assert.equal(pane.style.opacity,"0.73","preserve original CSS opacity");
assert.equal(pane.dataset.rasterLabPreview,undefined);
assert.equal(restored,1);
const old=card._rasterLabKey(info);
card._weatherRadarState=()=>({layer:{options:{maxNativeZoom:9}}});
assert.notEqual(card._rasterLabKey(card._rasterLabSnapshot()),old);
assert.equal(card._rasterLabRegisterAdapter({id:"Invalid Space",getPane:()=>pane,getTuning:()=>({}),restore:()=>{}}),false);
assert.equal(card._rasterLabRegisterAdapter({id:"future.precipitation.forecast",label:"Prognose",getPane:()=>pane,getTuning:()=>({}),restore:()=>{}}),true);
assert.equal(card._rasterLabRegisterAdapter({id:"temperature",getPane:()=>pane,getTuning:()=>({blur:0}),restore:()=>{}}),true);
state.open=false;state.preview=false;
console.log("PASS V4.11.82: numbered future layers, real preview, source zoom, restore and DEV-OFF bounds");
