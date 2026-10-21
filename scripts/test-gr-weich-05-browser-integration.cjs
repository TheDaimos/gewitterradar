// GR-WEICH-05: real Chromium pixels using original installed display-menu and Raster-Labor methods.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const sharp=require('sharp');
const {chromium}=require('playwright');
const output='artwork/acceptance/gr-weich-05';
fs.mkdirSync(output,{recursive:true});
const clean=(path)=>fs.readFileSync(path,'utf8').replace(/^import [^\n]+\n/gm,'').replace(/\bexport\s+(?=(?:const|function|class)\b)/g,'');
const display=clean('frontend/modules/weather/display-menu.js');
const lab=clean('frontend/modules/diagnostics/raster-lab.js');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.argv[2]});
 const results=[];
 try{
  for(const dpr of [1,2]){
   const page=await browser.newPage({viewport:{width:680,height:450},deviceScaleFactor:dpr});
   await page.setContent('<!doctype html><html><body style="margin:0;background:rgb(13,19,28)"><div id="pane" style="position:absolute;left:140px;top:85px;width:256px;height:256px;opacity:1"></div></body></html>');
   const raw=Buffer.alloc(256*256*4);
   for(let y=0;y<256;y++)for(let x=0;x<256;x++){
    const n=(y*256+x)*4,inside=x>=55&&x<202&&y>=46&&y<201,hole=x>=113&&x<=138&&y>=95&&y<=125;
    raw[n]=239;raw[n+1]=inside?95:30;raw[n+2]=inside?35:12;raw[n+3]=inside&&!hole?236:0;
   }
   const png=await sharp(raw,{raw:{width:256,height:256,channels:4}}).png().toBuffer();
   await page.locator('#pane').evaluate((pane,b64)=>{const img=document.createElement('img');img.src='data:image/png;base64,'+b64;img.width=256;img.height=256;pane.append(img)},png.toString('base64'));
   await page.locator('img').evaluate(img=>img.decode());
   await page.evaluate(()=>{window.defineModule=(_meta,factory)=>(klass)=>Object.assign(klass.prototype,factory());window.WEATHER_ROUTER_CAPABILITIES={precipitation:'weather.precipitation.layer'};window.APPLICATION_RELEASE={version:'4.11.100',runtimeRevision:'411100r1',displayVersion:'V4.11.100 DEV'};});
   await page.addScriptTag({content:display+'\nwindow.installDisplay=installWeatherDisplayMenu;'});
   await page.addScriptTag({content:lab+'\nwindow.installLab=installRasterLab;'});
   await page.evaluate(()=>{
    const Card=class {};window.installDisplay(Card,{});window.installLab(Card,{});
    const card=new Card();let zoom=8,active={options:{maxNativeZoom:18}},seq=0;
    const listeners=new Map(),pane=document.getElementById('pane');
    card._map={getZoom:()=>zoom,getPane:(name)=>name==='gr-weather-radar'?pane:null,on:(event,fn)=>listeners.set(event,fn),off:(event)=>listeners.delete(event)};
    card._weatherRadarState=()=>({layer:active});
    card.__weatherDisplayState={config:{styles:{precipitation:'auto'},opacities:{precipitation:null}},zoomMap:null,zoomHandler:null};
    card._weatherDisplaySyncLegendBadge=()=>{};
    window.__h={card,pane,listeners,setZoom:n=>{zoom=n;listeners.get('zoomend')?.()},swap:n=>{active={options:{maxNativeZoom:n}};card._weatherDisplayRefreshRenderedLayers()},getSeq:()=>seq,advance:()=>++seq};
    card._weatherDisplayEnsureZoomSync();
   });
   async function capture(label){
    const state=await page.evaluate(()=>{const {pane,card}=window.__h;return {style:pane.dataset.weatherDisplayStyle,filter:getComputedStyle(pane).filter,opacity:getComputedStyle(pane).opacity,blur:card._weatherDisplayRasterTuning('precipitation').blur,preview:pane.dataset.rasterLabPreview||false}});
    const name=label+'-dpr'+dpr+'.png',bytes=await page.screenshot();
    fs.writeFileSync(output+'/'+name,bytes);
    const {data,info}=await sharp(bytes).removeAlpha().raw().toBuffer({resolveWithObject:true});
    const pixel=(x,y)=>[0,1,2].map(c=>data[((y*dpr)*info.width+x*dpr)*info.channels+c]);
    const point={core:pixel(215,158),edge:pixel(190,158),outside:pixel(131,158),noData:pixel(267,194)};
    results.push({label,dpr,...state,...point,name});return {state,point};
   }
   for(const mode of ['auto','precise','balanced','soft']){
    await page.evaluate(m=>{const h=window.__h;h.card.__weatherDisplayState.config.styles.precipitation=m;h.card._weatherDisplayRefreshRenderedLayers()},mode);
    const a=await capture(mode+'-v2-z8');assert.equal(a.state.style,mode);assert.ok(a.point.core[0]>a.point.outside[0],mode);
    await page.evaluate(()=>window.__h.setZoom(9));const b=await capture(mode+'-zoom9');
    assert.equal(b.state.style,mode);
    await page.evaluate(()=>window.__h.swap(10));const c=await capture(mode+'-v1-z9');
    assert.equal(c.state.style,mode);
    assert.deepEqual(c.point,b.point,'URL ceiling must not change rendered raster '+mode);
    await page.evaluate(()=>window.__h.swap(18));const back=await capture(mode+'-v2-back');
    assert.deepEqual(back.point,b.point,'V1->V2 pixel restoration '+mode);
    await page.evaluate(()=>window.__h.setZoom(8));
   }
   await page.evaluate(()=>{
    const {card,pane}=window.__h;
    card.__weatherDisplayState.config.styles.precipitation='balanced';card._weatherDisplayRefreshRenderedLayers();
    const s=card._rasterLabState();s.open=true;s.preview=true;
    const info=card._rasterLabSnapshot();
    s.samples.set(card._rasterLabKey(info),{layer:'precipitation',zoom:8,nativeZoom:18,values:{...info.base,blur:25,opacity:.65,blend:100}});
    card._rasterLabReapplyPreview();
   });
   const preview=await capture('lab-preview');assert.equal(preview.state.preview,'true');
   await page.evaluate(()=>{const h=window.__h;const state=h.card._rasterLabState();state.preview=false;h.card._rasterLabRestore();state.open=false});
   const restored=await capture('lab-restored');assert.equal(restored.state.preview,false);
   await page.close();
  }
  fs.writeFileSync(output+'/pixel-results.json',JSON.stringify({source:'original active frontend modules with test-only Leaflet map/DOM holder',browser:browser.version(),tests:results},null,2));
  console.log('PASS GR-WEICH-05 real browser pixels and module lifecycle',results.length);
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
