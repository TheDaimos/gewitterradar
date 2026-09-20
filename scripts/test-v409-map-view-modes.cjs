const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');

const root = path.resolve(__dirname, '..');
const server = http.createServer((req,res)=>{
  const url = new URL(req.url,'http://localhost');
  const file = path.resolve(root,'.'+decodeURIComponent(url.pathname));
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(file,(error,data)=>{
    if(error){res.writeHead(404).end();return;}
    const ext=path.extname(file);
    res.setHeader('Content-Type',ext==='.html'?'text/html':ext==='.js'?'text/javascript':'application/octet-stream');
    res.end(data);
  });
});

(async()=>{
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({executablePath:process.argv[2],headless:true});
  try{
    const profiles=[
      ['desktop',1440,1000,false],
      ['ipad',1024,768,true],
      ['android',412,915,true]
    ];

    for(const delivery of ['dashboard','integration']){
      for(const [profile,width,height,hasTouch] of profiles){
        const context=await browser.newContext({viewport:{width,height},hasTouch});
        const page=await context.newPage();
        await page.goto(`http://127.0.0.1:${server.address().port}/scripts/about-onboarding-harness.html?scenario=seen&delivery=${delivery}`);
        await page.waitForFunction(()=>window.aboutResult);

        const result=await page.evaluate(async(hasTouch)=>{
          const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
          const card=window.aboutCard;
          card._closeAbout(false,false);
          await wait(100);

          const shadow=card.shadowRoot;
          const map=shadow.getElementById('map');
          const mapCard=shadow.querySelector('.map-card');
          const standard=shadow.getElementById('map-view-standard');
          const large=shadow.getElementById('map-view-large');
          const fullscreen=shadow.getElementById('map-view-fullscreen');
          const overlay=shadow.getElementById('fullscreen-compass-overlay');
          const drag=shadow.getElementById('fullscreen-compass-drag');
          const mount=shadow.getElementById('fullscreen-compass-mount');
          const compassWrap=shadow.querySelector('.compass-wrap');
          const home=shadow.getElementById('compass-wrap-home');

          const standardHeight=map.getBoundingClientRect().height;
          large.click();
          await wait(180);
          const largeHeight=map.getBoundingClientRect().height;
          const largeState={
            mode:card._mapViewModeState,
            largeClass:mapCard.classList.contains('map-view-large'),
            active:large.classList.contains('active'),
            pressed:large.getAttribute('aria-pressed')
          };

          fullscreen.click();
          await wait(180);
          const before={left:overlay.offsetLeft,top:overlay.offsetTop};
          const r=drag.getBoundingClientRect();
          const pointerId=77;
          drag.dispatchEvent(new PointerEvent('pointerdown',{
            bubbles:true,cancelable:true,pointerId,button:0,isPrimary:true,
            clientX:r.left+r.width/2,clientY:r.top+r.height/2,pointerType:hasTouch?'touch':'mouse'
          }));
          drag.dispatchEvent(new PointerEvent('pointermove',{
            bubbles:true,cancelable:true,pointerId,button:0,isPrimary:true,
            clientX:r.left+r.width/2+42,clientY:r.top+r.height/2+31,pointerType:hasTouch?'touch':'mouse'
          }));
          drag.dispatchEvent(new PointerEvent('pointerup',{
            bubbles:true,cancelable:true,pointerId,button:0,isPrimary:true,
            clientX:r.left+r.width/2+42,clientY:r.top+r.height/2+31,pointerType:hasTouch?'touch':'mouse'
          }));
          await wait(80);
          const after={left:overlay.offsetLeft,top:overlay.offsetTop};
          const savedPosition=localStorage.getItem('gewitterradar:v409:fullscreen-compass-position');
          const fullscreenState={
            mode:card._mapViewModeState,
            fullscreenClass:mapCard.classList.contains('map-view-fullscreen'),
            overlayVisible:!overlay.hidden,
            compassMounted:compassWrap.parentElement===mount,
            active:fullscreen.classList.contains('active'),
            moved:before.left!==after.left||before.top!==after.top,
            savedPosition
          };

          card._setMapViewMode('standard');
          await wait(100);
          const restored={
            mode:card._mapViewModeState,
            fullscreenClass:mapCard.classList.contains('map-view-fullscreen'),
            overlayHidden:overlay.hidden,
            compassRestored:compassWrap.previousElementSibling===home,
            standardActive:standard.classList.contains('active')
          };

          let openArgs=null;
          const originalOpen=window.open;
          window.open=(...args)=>{openArgs=args;return {focus(){}};};
          shadow.getElementById('settings-map-window').click();
          window.open=originalOpen;
          const openUrl=openArgs?.[0]||'';

          card._setMapViewMode('standard');
          window.open=()=>null;
          shadow.getElementById('settings-map-window').click();
          window.open=originalOpen;
          await wait(80);
          const blockedFallback=card._mapViewModeState;

          return {
            labels:[standard.textContent.trim(),large.textContent.trim(),fullscreen.textContent.trim()],
            standardHeight,largeHeight,largeState,fullscreenState,restored,
            settingsSection:!!shadow.getElementById('settings-map-display-section'),
            windowButton:!!shadow.getElementById('settings-map-window'),
            windowParam:new URL(openUrl,location.href).searchParams.get('gewitterradar_window'),
            windowFeatures:openArgs?.[2]||'',
            blockedFallback
          };
        }, hasTouch);

        assert.deepEqual(result.labels,['Standard','Groß','Vollbild'],`${delivery}/${profile} German labels`);
        assert.equal(result.largeState.mode,'large',`${delivery}/${profile} large state`);
        assert.equal(result.largeState.largeClass,true,`${delivery}/${profile} large class`);
        assert.equal(result.largeState.active,true,`${delivery}/${profile} large active`);
        assert.equal(result.largeState.pressed,'true',`${delivery}/${profile} large aria state`);
        assert.ok(result.largeHeight>result.standardHeight+20,`${delivery}/${profile} large height ${JSON.stringify(result)}`);

        assert.equal(result.fullscreenState.mode,'fullscreen',`${delivery}/${profile} fullscreen state`);
        assert.equal(result.fullscreenState.fullscreenClass,true,`${delivery}/${profile} fullscreen class`);
        assert.equal(result.fullscreenState.overlayVisible,true,`${delivery}/${profile} compass overlay visible`);
        assert.equal(result.fullscreenState.compassMounted,true,`${delivery}/${profile} selected compass reused`);
        assert.equal(result.fullscreenState.active,true,`${delivery}/${profile} fullscreen active`);
        assert.equal(result.fullscreenState.moved,true,`${delivery}/${profile} pointer drag moved compass`);
        assert.ok(result.fullscreenState.savedPosition,`${delivery}/${profile} compass position stored`);

        assert.deepEqual(result.restored,{
          mode:'standard',
          fullscreenClass:false,
          overlayHidden:true,
          compassRestored:true,
          standardActive:true
        },`${delivery}/${profile} fullscreen exit`);

        assert.equal(result.settingsSection,true,`${delivery}/${profile} settings section`);
        assert.equal(result.windowButton,true,`${delivery}/${profile} separate window button`);
        assert.equal(result.windowParam,'map',`${delivery}/${profile} separate window URL`);
        assert.match(result.windowFeatures,/width=1400/,`${delivery}/${profile} window features`);
        assert.equal(result.blockedFallback,'fullscreen',`${delivery}/${profile} popup blocker fallback`);

        await context.close();
        console.log(`${delivery}/${profile}: V4.09.01 map view browser PASS`);
      }
    }

    const context=await browser.newContext({viewport:{width:1280,height:800}});
    const page=await context.newPage();
    await page.goto(`http://127.0.0.1:${server.address().port}/scripts/about-onboarding-harness.html?scenario=seen&delivery=dashboard&gewitterradar_window=map`);
    await page.waitForFunction(()=>window.aboutResult);
    const standalone=await page.evaluate(async()=>{
      await new Promise(resolve=>setTimeout(resolve,180));
      const card=window.aboutCard;
      card._closeAbout(false,false);
      const shadow=card.shadowRoot;
      return {
        standalone:card._standaloneMapWindow,
        mode:card._mapViewModeState,
        fullscreenClass:shadow.querySelector('.map-card').classList.contains('map-view-fullscreen'),
        overlayVisible:!shadow.getElementById('fullscreen-compass-overlay').hidden,
        compassMounted:shadow.querySelector('.compass-wrap').parentElement===shadow.getElementById('fullscreen-compass-mount')
      };
    });
    assert.deepEqual(standalone,{
      standalone:true,
      mode:'fullscreen',
      fullscreenClass:true,
      overlayVisible:true,
      compassMounted:true
    },'standalone map-window mode');
    await context.close();
    console.log('dashboard/standalone-window: V4.09.01 map view browser PASS');
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
