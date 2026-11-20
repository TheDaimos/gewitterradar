/* Real card/module tree and shared pointer gestures; synthetic provider I/O. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {flowFixture}=require('./flow-curves-browser-fixture.cjs');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const output=path.join(os.tmpdir(),'gr-display-icon-additive-browser');fs.mkdirSync(output,{recursive:true});
const profiles=[['desktop',1280,900,false,1],['desktop-hidpi',1920,1080,false,1.5],['android',393,851,true,3],['android-landscape',851,393,true,3],['ipad',820,1180,true,2]];
(async()=>{
 const fixture=flowFixture({decorate:html=>html.replace('window.catalog=[cap(WIND),',"window.catalog=[cap('weather.precipitation.layer',{family:'radar',phenomena:['precipitation']}),cap(WIND),")});await new Promise(r=>fixture.server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})}),results=[];
 try{for(const [name,width,height,touch,dpr] of profiles){
  if(process.env.GR_MENU_VIEW&&name!==process.env.GR_MENU_VIEW)continue;
  const context=await browser.newContext({viewport:{width,height},hasTouch:touch,isMobile:touch,deviceScaleFactor:dpr});
  await context.addInitScript(()=>{const key='gewitterradar:weather-display:v1';if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify({rememberPosition:true,eyePosition:{x:0,y:.85},styles:{precipitation:'precise'}}));});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await fixture.route(page);
  await page.goto('http://127.0.0.1:'+fixture.server.address().port);
  await page.waitForFunction(()=>window.ready&&card._map&&card._weatherDisplayState().status==='ready');
  await page.evaluate(()=>card._setMapDisplayMode('fullscreen',{persist:false}));await page.waitForTimeout(800);
  const button=page.locator('#weather-display-control'),panel=page.locator('#weather-display-panel');
  await button.waitFor({state:'visible'});
  assert.deepEqual(await page.evaluate(()=>card._weatherDisplayState().config.eyePosition),{x:0,y:.85});
  const foreign=()=>page.evaluate(()=>JSON.stringify({wind:card._weatherWindState().config,temperature:card._weatherTemperatureState().config,radar:card._weatherRadarState().enabled,styles:card._weatherDisplayState().config.styles,opacities:card._weatherDisplayState().config.opacities}));
  const before=await foreign();
  const eye=page.locator('#weather-display-eye-control');await eye.waitFor({state:'visible'});
  assert.equal(await page.evaluate(()=>card._weatherDisplayState().config.displayControlPosition),null);
  const separate=await page.evaluate(()=>{const a=card.shadow.getElementById('weather-display-eye-control').getBoundingClientRect(),b=card.shadow.getElementById('weather-display-control').getBoundingClientRect();return a.right<=b.left||b.right<=a.left||a.bottom<=b.top||b.bottom<=a.top;});assert(separate,'first-use emblem must not cover Eye');
  const sizes=await page.evaluate(async()=>{
   const result=[];
   for(const id of ['weather-display-control','weather-wind-toggle','weather-temperature-toggle','weather-precipitation-toggle']){
    const element=card.shadow.getElementById(id),img=element.querySelector('img');await img.decode();
    const rect=element.getBoundingClientRect(),imageRect=img.getBoundingClientRect(),canvas=document.createElement('canvas');
    canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0);
    const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;let left=canvas.width,right=0;
    for(let i=0;i<pixels.length;i+=4)if(pixels[i]>160&&pixels[i+1]>90&&pixels[i+2]<155&&pixels[i+3]>200){const x=(i/4)%canvas.width;left=Math.min(left,x);right=Math.max(right,x);}
    result.push({id,width:rect.width,height:rect.height,imageWidth:imageRect.width,goldWidth:(right-left+1)/canvas.width*imageRect.width,source:img.currentSrc});
   }return result;
  });
  for(const item of sizes){assert.equal(item.width,50);assert.equal(item.height,50);assert(Math.abs(item.goldWidth-sizes[0].goldWidth)<1,JSON.stringify(sizes));}
  assert(sizes[0].source.includes('gr-weather-display-premium-original.png'));
  const click=locator=>touch?locator.tap():locator.click();
  assert.equal(await eye.locator('[data-weather-display-eye]').getAttribute('data-weather-display-eye'),'closed');
  await click(eye);await panel.waitFor({state:'visible'});assert.equal(await eye.locator('[data-weather-display-eye]').getAttribute('data-weather-display-eye'),'open');
  await click(eye);await panel.waitFor({state:'hidden'});assert.equal(await eye.locator('[data-weather-display-eye]').getAttribute('data-weather-display-eye'),'closed');
  const eyeSaved=await page.evaluate(()=>card._weatherDisplayState().config.eyePosition);
  await click(button);await panel.waitFor({state:'visible'});assert.equal(await panel.count(),1);assert.equal(await button.getAttribute('aria-expanded'),'true');
  assert(await panel.locator('.weather-display-panel-head .weather-display-eye-glyph').count(),'existing Eye header retained');
  await page.waitForTimeout(650);await click(button);assert(await panel.isVisible(),'a second click opens, never toggles the menu off');
  const close=async()=>{await click(panel.locator('[data-weather-display-close]'));await panel.waitFor({state:'hidden'});await page.waitForTimeout(650);};
  await close();
  const cdp=touch?await context.newCDPSession(page):null;let origin;
  const down=async(x,y)=>{origin={x,y};if(cdp)await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});else{await page.mouse.move(x,y);await page.mouse.down();}};
  const move=async(x,y)=>{if(cdp){for(let i=1;i<=8;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:origin.x+(x-origin.x)*i/8,y:origin.y+(y-origin.y)*i/8}]});}else await page.mouse.move(x,y,{steps:8});};
  const up=()=>cdp?cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]}):page.mouse.up();
  let box=await button.boundingBox();await down(box.x+25,box.y+25);await page.waitForTimeout(680);
  assert(await panel.isVisible(),'600ms hold opens before release');await up();assert(await panel.isVisible(),'release cannot close the menu');
  await close();
  const center=await page.evaluate(()=>card._map.getCenter());box=await button.boundingBox();
  await down(box.x+25,box.y+25);await move(Math.min(width-50,box.x+145),Math.max(55,box.y-100));await page.waitForTimeout(680);await up();
  await page.waitForTimeout(100);assert(await panel.isHidden(),'drag cancels hold and click');assert.deepEqual(await page.evaluate(()=>card._map.getCenter()),center);
  const saved=await page.evaluate(()=>card._weatherDisplayState().config.displayControlPosition);assert(saved);assert.deepEqual(await page.evaluate(()=>card._weatherDisplayState().config.eyePosition),eyeSaved);
  assert.deepEqual(await foreign(),before,'menu interaction leaves weather settings unchanged');
  await page.reload();await page.waitForFunction(()=>window.ready&&card._map&&card._weatherDisplayState().status==='ready');await page.evaluate(()=>card._setMapDisplayMode('fullscreen',{persist:false}));await page.waitForTimeout(800);
  await button.waitFor({state:'visible'});assert.deepEqual(await page.evaluate(()=>card._weatherDisplayState().config.displayControlPosition),saved);assert.deepEqual(await page.evaluate(()=>card._weatherDisplayState().config.eyePosition),eyeSaved);
  assert.equal(await page.evaluate(()=>card._weatherDisplayState().config.styles.precipitation),'precise');
  const inside=()=>button.evaluate(e=>{const b=e.getBoundingClientRect(),m=card.shadow.getElementById('map').getBoundingClientRect();return b.left>=m.left&&b.top>=m.top&&b.right<=m.right+1&&b.bottom<=m.bottom+1;});assert(await inside());
  await page.screenshot({path:path.join(output,name+'.png')});
  await page.setViewportSize({width:height,height:width});await page.waitForTimeout(100);assert(await inside(),'resize clamps saved normalized position');
  await page.setViewportSize({width,height});await page.waitForTimeout(100);
  box=await button.boundingBox();await down(box.x+25,box.y+25);
  await button.dispatchEvent('pointercancel',{pointerId:await button.evaluate(()=>card._weatherDisplayState().displayControlDrag.eyeDrag.pointerId)});await up();await page.waitForTimeout(700);assert(await panel.isHidden(),'cancelled hold cannot open later');
  if(!touch){await button.focus();await page.keyboard.press('Enter');assert(await panel.isVisible());await close();}
  await page.evaluate(()=>{card._weatherDisplayOpenFromLayerMenu();});assert(await panel.isVisible());assert.equal(await panel.count(),1);await close();
  const emblemPosition=await page.evaluate(()=>card._weatherDisplayState().config.displayControlPosition),eyeBefore=await eye.boundingBox();await down(eyeBefore.x+eyeBefore.width/2,eyeBefore.y+eyeBefore.height/2);await move(Math.min(width-55,eyeBefore.x+85),Math.max(55,eyeBefore.y-70));await up();await page.waitForTimeout(100);assert(await panel.isHidden());assert.deepEqual(await page.evaluate(()=>card._weatherDisplayState().config.displayControlPosition),emblemPosition,'Eye drag cannot move the emblem saved position');
  assert.deepEqual(errors,[]);results.push({name,dpr,sizes,pointerClick:true,longPress600:true,drag:true,persistence:true,resize:true,physicalAcceptance:false});
  console.log(name+': restored open/closed Eye plus separate 50px emblem; click/hold/independent drag/reload/bounds passed');await context.close();
 }fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(results,null,2));}
 finally{await browser.close();fixture.server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
