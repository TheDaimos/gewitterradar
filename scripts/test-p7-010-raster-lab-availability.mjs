import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const source=readFileSync(new URL("../frontend/modules/diagnostics/raster-lab.js",import.meta.url),"utf8");
const signature="  _rasterLabRefreshOptions(){";
const start=source.indexOf(signature),end=source.indexOf("\n  _rasterLabRenderValues(){",start);
assert.ok(start>=0&&end>start,"Raster lab dynamic source hook");
const body=source.slice(start+signature.length,end).replace(/\n  \},\s*$/,"");
const options=[];
let created=0,rendered=0;
const select={
 options,value:"",
 insertBefore(option,before){
  const i=options.indexOf(option);
  if(i>=0)options.splice(i,1);
  const at=before?options.indexOf(before):-1;
  options.splice(at>=0?at:options.length,0,option);
 }
};
const document={createElement(kind){
 assert.equal(kind,"option");
 created++;
 const opt={value:"",textContent:"",disabled:false,remove(){
  const i=options.indexOf(opt);if(i>=0)options.splice(i,1);
 }};
 return opt;
}};
const catalog=[["precipitation","Niederschlag"],["temperature","Temperatur"]];
const refresh=new Function("RASTER_LAB_LAYER_CATALOG","document",body);
let prec=false,temp=false;
const adapters=new Map([
 ["precipitation",{label:"Niederschlag",getPane:()=>prec?{}:null}],
 ["temperature",{label:"Temperatur",getPane:()=>temp?{}:null}]
]);
const state={root:{querySelector:()=>select},selected:"precipitation"};
const context={
 __rasterLabState:state,
 _rasterLabAdapters:()=>adapters,
 _rasterLabRenderValues:()=>{rendered++;}
};
refresh.call(context,catalog,document);
assert.equal(options.length,2);
assert.equal(options[0].disabled,true);
assert.equal(options[1].disabled,true);
assert.equal(select.value,"precipitation");
const initial=options[0];
prec=true;
refresh.call(context,catalog,document);
assert.equal(options[0],initial,"Option nodes remain mounted");
assert.equal(options[0].disabled,false);
assert.equal(created,2,"No unnecessary option reconstruction");

temp=true;state.selected="temperature";
refresh.call(context,catalog,document);
assert.equal(select.value,"temperature");
assert.equal(options[1].disabled,false);
prec=false;
refresh.call(context,catalog,document);
assert.equal(state.selected,"temperature","Live usable selection is preserved");
temp=false;prec=true;
refresh.call(context,catalog,document);
assert.equal(state.selected,"precipitation","Unavailable source selects an active renderer");
assert.equal(rendered,5);
assert.ok(source.includes("this._map?.hasLayer?.(layer)"),
 "A cached Leaflet pane is not proof of an active raster layer");
console.log("DIA-RL-03 renderer-driven layer availability and stable selection PASS");
