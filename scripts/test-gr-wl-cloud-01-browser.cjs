// Real Chromium pixel regression: actual cloud adapter and existing Raster-Labor.
const assert=require("node:assert/strict"),fs=require("node:fs"),sharp=require("sharp"),{chromium}=require("playwright");
const out="artwork/acceptance/gr-wl-cloud-01";fs.mkdirSync(out,{recursive:true});
const clean=p=>fs.readFileSync(p,"utf8").replace(/^import [^\n]+\n/gm,"").replace(/\bexport\s+(?=(?:const|function|class)\b)/g,"").replace(/^export\s*\{[^}]*\};?\s*$/gm,"");
(async()=>{
const browser=await chromium.launch({headless:true,executablePath:process.argv[2]});
try{
const page=await browser.newPage({viewport:{width:830,height:370},deviceScaleFactor:1});
await page.setContent('<!doctype html><body style="margin:0;background:#111b29"><div id="rain" style="position:absolute;left:40px;top:65px;width:210px;height:210px"></div><div id="cloud" style="position:absolute;left:350px;top:65px;width:210px;height:210px"></div><div id="wind" style="position:absolute;left:625px;top:65px;width:180px;height:180px"></div></body>');
const tile=Buffer.alloc(210*210*4);for(let y=0;y<210;y++)for(let x=0;x<210;x++){const i=(y*210+x)*4,hit=x>30&&x<175&&y>30&&y<175;tile[i]=hit?229:0;tile[i+1]=hit?104:0;tile[i+2]=hit?50:0;tile[i+3]=hit?230:0;}
const png=(await sharp(tile,{raw:{width:210,height:210,channels:4}}).png().toBuffer()).toString("base64");
await page.evaluate(data=>{for(const id of ["rain","cloud","wind"]){const img=document.createElement("img");img.width=210;img.height=210;img.src="data:image/png;base64,"+data;document.getElementById(id).append(img);}},png);
await page.evaluate(()=>{window.defineModule=(_m,f)=>(klass)=>Object.assign(klass.prototype,f());window.APPLICATION_RELEASE={version:"4.11.101",runtimeRevision:"411101r1",displayVersion:"V4.11.101 DEV"};window.WEATHER_ROUTER_CAPABILITIES={precipitation:"weather.radar.precipitation"};window.WEATHER_ROUTER_LOGO_IMAGE="";});
for(const [name,p] of [["installDisplay","frontend/modules/weather/display-menu.js"],["installLab","frontend/modules/diagnostics/raster-lab.js"],["installLayerMenu","frontend/modules/weather/layer-menu.js"]]){
 const code=clean(p);await page.addScriptTag({content:"(()=>{"+code+"\nwindow."+name+"="+({installDisplay:"installWeatherDisplayMenu",installLab:"installRasterLab",installLayerMenu:"installWeatherLayerMenu"}[name])+";})()"});
}
await page.evaluate(()=>{
 const C=class{};window.installDisplay(C,{});window.installLab(C,{});window.installLayerMenu(C,{});
 const c=new C(),cloudId="weather.satellite.clouds",windId="weather.model.wind_10m.layer";
 const panes={"gr-weather-radar":document.getElementById("rain"),"gr-wr-clouds":document.getElementById("cloud"),"gr-wr-wind":document.getElementById("wind")};
 c._map={getPane:id=>panes[id],getZoom:()=>8};c._weatherRadarState=()=>({layer:{options:{maxNativeZoom:18}}});
 c.__weatherDisplayState={config:{styles:{precipitation:"precise"},opacities:{precipitation:null}}};
 c._weatherDisplayRefreshRenderedLayers();
 const cloud=c._weatherGenericState(cloudId);cloud.enabled=true;cloud.layer={options:{maxNativeZoom:9}};cloud.map=c._map;cloud.status="ready";
 const wind=c._weatherGenericState(windId);wind.enabled=false;
 c._weatherGenericLabAdapter(cloudId);c._weatherGenericLabAdapter(windId);
 window.__c=c;window.__cloud=cloud;window.__wind=wind;window.__cloudId=cloudId;
});
const get=async()=>{const buf=await page.screenshot();const {data,info}=await sharp(buf).removeAlpha().raw().toBuffer({resolveWithObject:true});const red=(x,y)=>data[(y*info.width+x)*info.channels];return {rain:red(81,110),cloud:red(391,110),cloudEdge:red(376,110),wind:red(666,110)}};
const baseline=await get();
const status=await page.evaluate(()=>{const c=window.__c,a=c._rasterLabAdapters();return {rain:!!a.get("precipitation").getPane(),cloud:a.get("clouds").getAvailability(),wind:a.get("wind").getAvailability(),cloudPane:a.get("clouds").getPane()===document.getElementById("cloud")};});
assert.deepEqual(status,{rain:true,cloud:"active",wind:"off",cloudPane:true});
const ui=await page.evaluate(()=>{
 const c=window.__c;
 c.shadow={getElementById:()=>null,append:node=>document.body.append(node)};
 c._diagnostics={enabled:true};
 if(c._rasterLabOpen()!==true)throw new Error("Raster-Labor could not open");
 const select=document.querySelector("[data-lab-layer]");
 const clouds=[...select.options].find(o=>o.value==="clouds");
 const wind=[...select.options].find(o=>o.value==="wind");
 const before={cloudEnabled:!clouds.disabled,windDisabled:wind.disabled};
 select.value="clouds";
 select.dispatchEvent(new Event("change",{bubbles:true}));
 const selected=c._rasterLabState().selected;
 c._rasterLabClose();
 return {...before,selected,closed:!c._rasterLabState().open};
});
assert.deepEqual(ui,{cloudEnabled:true,windDisabled:true,selected:"clouds",closed:true});

await page.evaluate(()=>{
const c=window.__c,s=c._rasterLabState();s.selected="clouds";s.open=true;s.preview=true;const info=c._rasterLabSnapshot();
s.samples.set(c._rasterLabKey(info),{layer:"clouds",zoom:8,nativeZoom:9,values:{...info.base,blur:26,blend:100,opacity:.62}});
c._rasterLabReapplyPreview();
});
const preview=await get();assert.equal(preview.rain,baseline.rain,"cloud preview changed rain");assert.notEqual(preview.cloudEdge,baseline.cloudEdge,"cloud blur did not affect rendered edge");
fs.writeFileSync(out+"/cloud-preview.png",await page.screenshot());
await page.evaluate(()=>{const c=window.__c;c._rasterLabClose();});
const restored=await get();assert.equal(restored.rain,baseline.rain);assert.equal(restored.cloudEdge,baseline.cloudEdge,"cloud restore failed");
await page.evaluate(()=>{const c=window.__c;window.__cloud.enabled=false;c._rasterLabRefreshOptions();});assert.equal(await page.evaluate(()=>window.__c._rasterLabAdapters().get("clouds").getAvailability()),"off");
await page.evaluate(()=>{window.__cloud.enabled=true;window.__cloud.status="unavailable";});assert.equal(await page.evaluate(()=>window.__c._rasterLabAdapters().get("clouds").getAvailability()),"no-data");
fs.writeFileSync(out+"/cloud-restored.png",await page.screenshot());
const evidence={browser:browser.version(),baseline,preview,restored,status,states:["active","off","no-data"]};
fs.writeFileSync(out+"/pixel-results.json",JSON.stringify(evidence,null,2)+"\n");console.log("PASS GR-WL-CLOUD-01 real browser cloud/rain independent pixel regression",JSON.stringify(evidence));
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
