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
    res.setHeader('Content-Type',path.extname(file)==='.html'?'text/html':path.extname(file)==='.js'?'text/javascript':'application/octet-stream');
    res.end(data);
  });
});

(async()=>{
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const browser=await chromium.launch({executablePath:process.argv[2],headless:true});
  try{
    const profiles=[
      ['desktop',1280,900,false],
      ['ipad',1024,768,true],
      ['android',412,915,true],
    ];
    for(const delivery of ['dashboard','integration']){
      for(const [profile,width,height,hasTouch] of profiles){
        const context=await browser.newContext({viewport:{width,height},hasTouch});
        const page=await context.newPage();
        await page.goto(`http://127.0.0.1:${server.address().port}/scripts/about-onboarding-harness.html?scenario=first&delivery=${delivery}`);
        await page.waitForFunction(()=>window.aboutResult);
        assert.equal(await page.evaluate(()=>window.aboutResult.status),'PASS');

        const metrics=await page.evaluate(async()=>{
          const card=window.aboutCard;
          card._closeAbout(false,false);
          const root=card.shadowRoot;
          const sleep=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));
          const map=root.getElementById('map');
          const compass=root.getElementById('compass-instrument');
          const standardHeight=map.getBoundingClientRect().height;

          root.getElementById('map-size-large').click();
          await sleep(40);
          const largeHeight=map.getBoundingClientRect().height;
          const largeClass=root.getElementById('card-root').classList.contains('map-size-large');
          const persistedLarge=localStorage.getItem('gewitterradar-map-view-mode');

          root.getElementById('map-size-fullscreen').click();
          await sleep(40);
          const dialog=root.getElementById('map-fullscreen-dialog');
          const host=root.getElementById('map-fullscreen-compass');
          const mapCard=dialog.querySelector('.map-card');
          const fullscreen={
            open:dialog.open,
            cardActive:mapCard?.classList.contains('map-fullscreen-active')||false,
            cardParent:mapCard?.parentElement?.id||'',
            compassParent:compass.parentElement?.id||'',
            buttonPressed:root.getElementById('map-size-fullscreen').getAttribute('aria-pressed'),
          };

          const beforeLeft=host.style.left,beforeTop=host.style.top;
          const hostRect=host.getBoundingClientRect();
          const cardRect=mapCard.getBoundingClientRect();
          const pointerId=17;
          host.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId,button:0,clientX:hostRect.left+hostRect.width/2,clientY:hostRect.top+hostRect.height/2}));
          host.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerId,buttons:1,clientX:cardRect.left+cardRect.width*.30,clientY:cardRect.top+cardRect.height*.40}));
          host.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId,button:0,clientX:cardRect.left+cardRect.width*.30,clientY:cardRect.top+cardRect.height*.40}));
          const dragged=(host.style.left!==beforeLeft)||(host.style.top!==beforeTop);
          const storedPosition=localStorage.getItem('gewitterradar-map-fullscreen-compass-position');

          root.getElementById('map-size-standard').click();
          await sleep(40);
          const restored={
            dialogOpen:dialog.open,
            mapParent:root.querySelector('.left-stack > .map-card')?.classList.contains('map-card')||false,
            compassParent:compass.parentElement?.classList.contains('compass-wrap')||false,
            standardPressed:root.getElementById('map-size-standard').getAttribute('aria-pressed'),
            persisted:localStorage.getItem('gewitterradar-map-view-mode'),
          };

          root.getElementById('settings-open').click();
          const mapSection=root.getElementById('settings-map-section');
          mapSection.open=true;
          await sleep(0);
          const settings={
            section:!!mapSection,
            button:!!root.getElementById('settings-map-window'),
            title:root.getElementById('settings-map-title')?.textContent||'',
          };

          const originalOpen=window.open;
          window.open=()=>null;
          root.getElementById('settings-map-window').click();
          await sleep(40);
          window.open=originalOpen;
          const popupFallback={
            dialogOpen:root.getElementById('map-fullscreen-dialog')?.open||false,
            fullscreenActive:card._mapFullscreenActive,
          };
          root.getElementById('map-size-standard').click();

          return {standardHeight,largeHeight,largeClass,persistedLarge,fullscreen,dragged,storedPosition,restored,settings,popupFallback};
        });

        assert.ok(metrics.standardHeight>0,`${delivery}/${profile} standard height`);
        assert.ok(metrics.largeHeight>metrics.standardHeight+20,`${delivery}/${profile} large map is larger`);
        assert.equal(metrics.largeClass,true,`${delivery}/${profile} large class`);
        assert.equal(metrics.persistedLarge,'large',`${delivery}/${profile} large persistence`);
        assert.deepEqual(metrics.fullscreen,{
          open:true,cardActive:true,cardParent:'map-fullscreen-dialog',compassParent:'map-fullscreen-compass',buttonPressed:'true'
        });
        assert.equal(metrics.dragged,true,`${delivery}/${profile} compass pointer drag`);
        assert.ok(metrics.storedPosition,`${delivery}/${profile} compass position persisted`);
        assert.deepEqual(metrics.restored,{
          dialogOpen:false,mapParent:true,compassParent:true,standardPressed:'true',persisted:'standard'
        });
        assert.equal(metrics.settings.section,true);
        assert.equal(metrics.settings.button,true);
        assert.ok(metrics.settings.title.length>0);
        assert.deepEqual(metrics.popupFallback,{dialogOpen:true,fullscreenActive:true});
        console.log(`${delivery}/${profile}: V4.08 map view modes PASS`);
        await context.close();
      }
    }
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error=>{
  console.error(error);
  server.close();
  process.exitCode=1;
});
