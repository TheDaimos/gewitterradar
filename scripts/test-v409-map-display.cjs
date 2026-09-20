const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');

const root = path.resolve(__dirname, '..');
const server = http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');
  const file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
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
        const result=await page.evaluate(async()=>{
          const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
          const card=window.aboutCard;
          card._closeAbout(false,false);
          await wait(80);
          const shadow=card.shadowRoot;
          const map=shadow.getElementById('map');
          const mapCard=shadow.getElementById('map-card');
          const anchor=shadow.getElementById('map-card-anchor');
          const dialog=shadow.getElementById('map-fullscreen-dialog');
          const overlay=shadow.getElementById('map-compass-overlay');
          const medallionOverlay=shadow.getElementById('map-medallion-overlay');
          const instrumentControls=shadow.getElementById('map-instrument-controls');
          const compassToggle=shadow.getElementById('map-compass-toggle');
          const medallionToggle=shadow.getElementById('map-medallion-toggle');
          const locationOverlay=shadow.getElementById('map-location-overlay');
          const locationRow=shadow.getElementById('location-main-row');
          const locationDropdown=shadow.getElementById('location-dropdown');
          const compass=shadow.getElementById('compass-instrument');
          const compassHome=shadow.querySelector('.compass-wrap');
          const buttons=[...shadow.querySelectorAll('[data-map-display-mode]')];
          const standardHeight=map.getBoundingClientRect().height;

          card._setMapDisplayMode('large');
          await wait(160);
          const largeHeight=map.getBoundingClientRect().height;
          const largeState={
            active:mapCard.classList.contains('map-size-large'),
            stored:localStorage.getItem('gewitterradar:v409:map-display-mode')
          };

          card._setMapDisplayMode('fullscreen');
          await wait(160);
          const before={left:overlay.offsetLeft,top:overlay.offsetTop};
          const rect=overlay.getBoundingClientRect();
          const pointerId=91;
          overlay.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerId,button:0,clientX:rect.left+20,clientY:rect.top+20,pointerType:'touch'}));
          overlay.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,cancelable:true,pointerId,button:0,clientX:rect.left+58,clientY:rect.top+46,pointerType:'touch'}));
          overlay.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,cancelable:true,pointerId,button:0,clientX:rect.left+58,clientY:rect.top+46,pointerType:'touch'}));
          await wait(40);
          const after={left:overlay.offsetLeft,top:overlay.offsetTop};
          const medBefore={left:medallionOverlay.offsetLeft,top:medallionOverlay.offsetTop};
          const medRect=medallionOverlay.getBoundingClientRect();
          const medPointerId=92;
          medallionOverlay.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerId:medPointerId,button:0,clientX:medRect.left+18,clientY:medRect.top+18,pointerType:'touch'}));
          medallionOverlay.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,cancelable:true,pointerId:medPointerId,button:0,clientX:medRect.left+52,clientY:medRect.top+42,pointerType:'touch'}));
          medallionOverlay.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,cancelable:true,pointerId:medPointerId,button:0,clientX:medRect.left+52,clientY:medRect.top+42,pointerType:'touch'}));
          await wait(40);
          const medAfter={left:medallionOverlay.offsetLeft,top:medallionOverlay.offsetTop};

          compassToggle.click();
          const compassHiddenAfterToggle=overlay.hidden;
          compassToggle.click();
          medallionToggle.click();
          const medallionHiddenAfterToggle=medallionOverlay.hidden;
          medallionToggle.click();
          await wait(40);

          const layerControl=shadow.getElementById('map-display-control');
          const layerZ=Number(getComputedStyle(layerControl).zIndex);
          const instrumentZ=Number(getComputedStyle(instrumentControls).zIndex);
          const fullscreenState={
            open:dialog.open,
            cardInDialog:mapCard.parentElement===dialog,
            compassInOverlay:compass.parentElement===overlay,
            overlayVisible:!overlay.hidden,
            compassWidth:overlay.getBoundingClientRect().width,
            storedPosition:localStorage.getItem('gewitterradar:v409:map-compass-position'),
            moved:before.left!==after.left||before.top!==after.top,
            medallionVisible:!medallionOverlay.hidden,
            medallionMoved:medBefore.left!==medAfter.left||medBefore.top!==medAfter.top,
            medallionStoredPosition:localStorage.getItem('gewitterradar:v409:map-medallion-position'),
            medallionState:[...medallionOverlay.classList].find(value=>['none','up','down','stable'].includes(value)),
            instrumentControlsVisible:!instrumentControls.hidden,
            compassHiddenAfterToggle,
            medallionHiddenAfterToggle,
            compassStoredVisible:localStorage.getItem('gewitterradar:v409:map-compass-visible'),
            medallionStoredVisible:localStorage.getItem('gewitterradar:v409:map-medallion-visible'),
            locationInOverlay:locationRow.parentElement===locationOverlay,
            dropdownInDialog:locationDropdown.parentElement===dialog,
            warningTestsFailClosed:[...shadow.querySelectorAll('[data-warning-test]')].every(node=>node.hidden),
            layerZ,
            instrumentZ,
            layerAboveInstruments:layerZ>instrumentZ
          };

          card._setMapDisplayMode('standard');
          await wait(100);
          const restored={
            dialogClosed:!dialog.open,
            cardAtHome:mapCard.previousElementSibling===anchor,
            compassAtHome:compass.parentElement===compassHome,
            medallionHidden:medallionOverlay.hidden,
            instrumentControlsHidden:instrumentControls.hidden,
            locationRestored:locationRow.parentElement?.classList?.contains('header-control-row')===true,
            standardActive:buttons.find(node=>node.dataset.mapDisplayMode==='standard')?.classList.contains('active')===true
          };

          let openArgs=null;
          const originalOpen=window.open;
          window.open=(...args)=>{openArgs=args;return {focus(){}};};
          shadow.getElementById('settings-map-window-open').click();
          window.open=originalOpen;
          const openUrl=openArgs?.[0]||'';

          const menuToggle=shadow.getElementById('map-display-menu-toggle');
          const menu=shadow.getElementById('map-display-switch');
          menuToggle.click();
          const menuOpened=!menu.hidden && menuToggle.getAttribute('aria-expanded')==='true';
          shadow.querySelector('[data-map-display-mode="large"]').click();
          const menuClosedAfterChoice=menu.hidden && menuToggle.getAttribute('aria-expanded')==='false';

          const startupSelect=shadow.getElementById('settings-map-startup-mode');
          startupSelect.value='fullscreen';
          startupSelect.dispatchEvent(new Event('change',{bubbles:true}));
          const startupStored=localStorage.getItem('gewitterradar:v409:startup-map-display');
          startupSelect.value='last';
          startupSelect.dispatchEvent(new Event('change',{bubbles:true}));

          return {
            labels:buttons.map(node=>node.textContent.trim()),
            count:buttons.length,
            standardHeight,largeHeight,largeState,fullscreenState,restored,
            settingsSection:!!shadow.getElementById('settings-map-section'),
            windowButton:!!shadow.getElementById('settings-map-window-open'),
            windowParam:new URL(openUrl,location.href).searchParams.get('gewitterradar_window'),
            windowVersion:new URL(openUrl,location.href).searchParams.get('gewitterradar_window_version'),
            windowFeatures:openArgs?.[2]||'',
            menuOpened,menuClosedAfterChoice,startupStored,
            layerToggle:!!shadow.getElementById('map-display-menu-toggle'),
            layerMenu:!!shadow.getElementById('map-display-switch'),
            layerStack:[...shadow.querySelectorAll('.map-layer-symbol-layer')].map(node=>node.className),
            startupSelect:!!shadow.getElementById('settings-map-startup-mode'),
            controlInsideMap:(()=>{
              const control=shadow.getElementById('map-display-control')?.getBoundingClientRect();
              const mapRect=map.getBoundingClientRect();
              return !!control && control.left>=mapRect.left-1 && control.right<=mapRect.right+1 &&
                     control.top>=mapRect.top-1 && control.bottom<=mapRect.bottom+1;
            })()
          };
        });

        assert.equal(result.count,3,`${delivery}/${profile} three size modes`);
        assert.deepEqual(result.labels,['Standard','Groß','Vollbild'],`${delivery}/${profile} German labels`);
        assert.equal(result.largeState.active,true,`${delivery}/${profile} large class`);
        assert.equal(result.largeState.stored,'large',`${delivery}/${profile} large persistence`);
        assert.ok(result.largeHeight>result.standardHeight+20,`${delivery}/${profile} large height ${JSON.stringify(result)}`);
        assert.deepEqual(result.fullscreenState.open,true,`${delivery}/${profile} fullscreen dialog`);
        assert.equal(result.fullscreenState.cardInDialog,true,`${delivery}/${profile} map moved to dialog`);
        assert.equal(result.fullscreenState.compassInOverlay,true,`${delivery}/${profile} selected compass reused`);
        assert.equal(result.fullscreenState.overlayVisible,true,`${delivery}/${profile} compass overlay visible`);
        assert.ok(result.fullscreenState.storedPosition,`${delivery}/${profile} compass position stored`);
        assert.equal(result.fullscreenState.moved,true,`${delivery}/${profile} pointer drag moved compass`);
        assert.ok(result.fullscreenState.compassWidth>=170,`${delivery}/${profile} compass enlarged ${JSON.stringify(result.fullscreenState)}`);
        assert.equal(result.fullscreenState.medallionVisible,true,`${delivery}/${profile} medallion visible`);
        assert.equal(result.fullscreenState.medallionMoved,true,`${delivery}/${profile} pointer drag moved medallion`);
        assert.ok(result.fullscreenState.medallionStoredPosition,`${delivery}/${profile} medallion position stored`);
        assert.ok(['none','up','down','stable'].includes(result.fullscreenState.medallionState),`${delivery}/${profile} live medallion state`);
        assert.equal(result.fullscreenState.instrumentControlsVisible,true,`${delivery}/${profile} instrument toggles visible`);
        assert.equal(result.fullscreenState.compassHiddenAfterToggle,true,`${delivery}/${profile} compass toggle hides`);
        assert.equal(result.fullscreenState.medallionHiddenAfterToggle,true,`${delivery}/${profile} medallion toggle hides`);
        assert.equal(result.fullscreenState.compassStoredVisible,'1',`${delivery}/${profile} compass visibility stored`);
        assert.equal(result.fullscreenState.medallionStoredVisible,'1',`${delivery}/${profile} medallion visibility stored`);
        assert.equal(result.fullscreenState.locationInOverlay,true,`${delivery}/${profile} fullscreen location top-right overlay`);
        assert.equal(result.fullscreenState.dropdownInDialog,true,`${delivery}/${profile} location menu promoted into fullscreen dialog`);
        assert.equal(result.fullscreenState.warningTestsFailClosed,true,`${delivery}/${profile} warning test controls fail closed`);
        assert.equal(result.fullscreenState.layerZ,2147483647,`${delivery}/${profile} layer control top z-index`);
        assert.equal(result.fullscreenState.layerAboveInstruments,true,`${delivery}/${profile} layer control above instruments`);
        assert.deepEqual(result.restored,{dialogClosed:true,cardAtHome:true,compassAtHome:true,medallionHidden:true,instrumentControlsHidden:true,locationRestored:true,standardActive:true},`${delivery}/${profile} fullscreen exit`);
        assert.equal(result.settingsSection,true,`${delivery}/${profile} map settings section`);
        assert.equal(result.windowButton,true,`${delivery}/${profile} separate window button`);
        assert.equal(result.windowParam,'1',`${delivery}/${profile} separate window URL`);
        assert.equal(result.windowVersion,'40903',`${delivery}/${profile} separate window version`);
        assert.equal(result.menuOpened,true,`${delivery}/${profile} context menu opens`);
        assert.equal(result.menuClosedAfterChoice,true,`${delivery}/${profile} context menu closes after choice`);
        assert.equal(result.startupStored,'fullscreen',`${delivery}/${profile} startup preference stored locally`);
        assert.equal(result.layerToggle,true,`${delivery}/${profile} layer toggle`);
        assert.equal(result.layerMenu,true,`${delivery}/${profile} layer menu`);
        assert.deepEqual(result.layerStack,[
          'map-layer-symbol-layer gold','map-layer-symbol-layer blue','map-layer-symbol-layer red'
        ],`${delivery}/${profile} gold/blue/red layer stack`);
        assert.equal(result.startupSelect,true,`${delivery}/${profile} per-device startup selector`);
        assert.equal(result.controlInsideMap,true,`${delivery}/${profile} layer control inside map bounds`);
        assert.match(result.windowFeatures,/width=1280/,`${delivery}/${profile} window features`);
        await context.close();
        console.log(`${delivery}/${profile}: V4.09 map display PASS`);
      }
    }

    const startupContext=await browser.newContext({viewport:{width:1280,height:800}});
    const startupPage=await startupContext.newPage();
    await startupPage.goto(`http://127.0.0.1:${server.address().port}/scripts/about-onboarding-harness.html?scenario=seen&delivery=dashboard`);
    await startupPage.waitForFunction(()=>window.aboutResult);
    await startupPage.evaluate(()=>{
      localStorage.setItem('gewitterradar:v409:startup-map-display','fullscreen');
      localStorage.setItem('gewitterradar:v409:last-map-display-mode','standard');
    });
    await startupPage.reload();
    await startupPage.waitForFunction(()=>window.aboutResult);
    const startupFullscreen=await startupPage.evaluate(async()=>{
      await new Promise(resolve=>setTimeout(resolve,150));
      const card=window.aboutCard;
      card._closeAbout(false,false);
      await new Promise(resolve=>setTimeout(resolve,60));
      const shadow=card.shadowRoot;
      return {
        mode:card._mapDisplayMode,
        dialog:shadow.getElementById('map-fullscreen-dialog').open
      };
    });
    assert.deepEqual(startupFullscreen,{mode:'fullscreen',dialog:true},'per-device startup fullscreen');
    await startupPage.evaluate(()=>{
      localStorage.setItem('gewitterradar:v409:startup-map-display','last');
      localStorage.setItem('gewitterradar:v409:last-map-display-mode','large');
    });
    await startupPage.reload();
    await startupPage.waitForFunction(()=>window.aboutResult);
    const startupLast=await startupPage.evaluate(async()=>{
      await new Promise(resolve=>setTimeout(resolve,150));
      const card=window.aboutCard;
      card._closeAbout(false,false);
      return {mode:card._mapDisplayMode,large:card.shadowRoot.getElementById('map-card').classList.contains('map-size-large')};
    });
    assert.deepEqual(startupLast,{mode:'large',large:true},'per-device startup last-used mode');
    await startupContext.close();
    console.log('dashboard/startup-preference: V4.09.03 map display PASS');

    const context=await browser.newContext({viewport:{width:1280,height:800}});
    const page=await context.newPage();
    await page.goto(`http://127.0.0.1:${server.address().port}/scripts/about-onboarding-harness.html?scenario=seen&delivery=dashboard&gewitterradar_window=1`);
    await page.waitForFunction(()=>window.aboutResult);
    const detached=await page.evaluate(async()=>{
      await new Promise(resolve=>setTimeout(resolve,120));
      const card=window.aboutCard;
      card._closeAbout(false,false);
      const shadow=card.shadowRoot;
      return {
        mode:card._mapWindowMode,
        dialog:shadow.getElementById('map-fullscreen-dialog').open,
        cardInDialog:shadow.getElementById('map-card').parentElement===shadow.getElementById('map-fullscreen-dialog'),
        compassInOverlay:shadow.getElementById('compass-instrument').parentElement===shadow.getElementById('map-compass-overlay'),
        controlDisplay:getComputedStyle(shadow.getElementById('map-display-control')).display,
        hostWindowClass:card.classList.contains('map-window-host'),
        dialogPosition:getComputedStyle(shadow.getElementById('map-fullscreen-dialog')).position
      };
    });
    assert.deepEqual(detached,{mode:true,dialog:true,cardInDialog:true,compassInOverlay:true,controlDisplay:'none',hostWindowClass:true,dialogPosition:'fixed'},'separate-window mode');
    await context.close();
    console.log('dashboard/detached-window: V4.09 map display PASS');
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
