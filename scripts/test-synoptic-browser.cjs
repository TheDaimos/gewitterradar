// The actual GR card and Leaflet, with synthetic HA and WR 0.10.322 replies.
const assert = require('node:assert/strict');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {fixture} = require('./wind-perf-browser-fixture.cjs');

const original = 'gr-synoptic-high-low-isobars-premium-original.png';
const fixtureHtml = html => html
  .replace('window.cleanSource=weatherSourceText;', `window.cleanSource=weatherSourceText;
    window.synopticRequests=[]; window.frontPending=null;
    if(!localStorage.getItem('gewitterradar:synoptic-ui:v1'))localStorage.setItem('gewitterradar:synoptic-ui:v1',JSON.stringify({fronts:true}));
  `)
  .replace('requests.push(structuredClone(query));', `requests.push(structuredClone(query));
    if(query.type==='weather_router/consumer/resolve_synoptic'){
      synopticRequests.push(structuredClone(query));
      const capability=query.capability,part=capability.split('.').at(-1);
      const answer={schema:'weather_router.consumer.synoptic.v2',contract_version:2,capability};
      if(part==='fronts'){
        if(!window.frontCompleted)await new Promise(resolve=>{window.frontPending=resolve;});
        return {...answer,status:'unavailable',frame:null,unavailable:{code:'synoptic_source_unavailable',sources:[{provider_id:'noaa_wpc'}]}};
      }
      const {west,east,south,north}=query.context.bbox, x=(west+east)/2, y=(south+north)/2;
      const centers=part==='pressure_centers', run=new Date(Date.now()-60000).toISOString();
      if(window.synopticFailure==='transport'&&centers)throw Object.assign(new Error('https://private.invalid/?token=secret'),{code:'connection_lost'});
      if(window.synopticFailure==='expiry'&&window.expiryIssued?.includes(part))return {...answer,status:'unavailable',frame:null,unavailable:{code:'synoptic_source_unavailable'}};
      if(window.synopticFailure==='expiry')(window.expiryIssued??=[]).push(part);
      const centerX=window.synopticFailure==='outside'?90:((x+180)%360+360)%360-180;
      const features=window.synopticFailure==='empty'&&!centers?[]:[{type:'Feature',
        geometry:centers?{type:'Point',coordinates:[centerX,y]}:{type:'MultiLineString',coordinates:[[[west,y],[x,y],[east,y]]]},
        properties:centers?{kind:'H',pressure_hpa:1024}:{pressure_hpa:1008}}];
      const frame={capability,unit:'hPa',coverage:{type:'bbox',crs:'EPSG:4326',bbox:query.context.bbox},
        provenance:{provider_id:centers?'eccc':'noaa_gfs',source_url:'https://private.invalid/?token=secret'},
        model_run:run,valid_at:run,valid_until:new Date(Date.now()+(window.synopticFailure==='expiry'?1800:600000)).toISOString(),
        geometry:{type:'FeatureCollection',features}};
      return {...answer,status:'ready',frame};
    }
  `)
  .replace('ready:routerReady,enabled:true','ready:routerReady,enabled:true,integration_version:"0.10.322"');

async function run() {
  const f = fixture({extendHtml:fixtureHtml});
  await new Promise(resolve=>f.server.listen(0,'127.0.0.1',resolve));
  let browser;
  try {
    browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
    const context=await browser.newContext({viewport:{width:393,height:851},hasTouch:true,isMobile:true});
    const page=await context.newPage(),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await f.route(page);
    await page.goto('http://127.0.0.1:'+f.server.address().port);
    await page.waitForFunction(()=>window.ready&&card._mapReady&&card._weatherLayerMenuState().catalog?.status==='ready');
    const snapshot=()=>page.evaluate(()=>card._mapDiagnosticSnapshot().synoptic);
    const initial=await snapshot();
    assert(initial.moduleLoaded&&initial.mapAttached&&initial.leafletReady);
    assert.equal(initial.wrVersion,'0.10.322');
    assert.equal(initial.capabilities.centers.outcome,'off');
    assert.equal(initial.capabilities.centers.requested,false);
    assert.equal(await page.evaluate(()=>synopticRequests.length),0);
    await page.evaluate(()=>{
      card._eyeHubResize(1);
      card._eyeHubAssign(4,'synoptic');
      card._eyeHubPatch({grouped:false});
      card._setMapDisplayMode('fullscreen',{persist:false});
    });
    const icon=page.locator('#weather-synoptic-toggle'),panel=page.locator('#weather-synoptic-panel');
    await icon.waitFor();
    assert((await icon.locator('img').getAttribute('src')).endsWith(original));
    await page.waitForTimeout(450);
    await icon.tap();
    await page.waitForFunction(()=>card.__weatherSynoptic.rendered.centers===1&&card.__weatherSynoptic.rendered.isobars===1&&window.frontPending);
    assert.equal(await page.locator('.gr-synoptic-center').textContent(),'H1024 hPa');
    assert.equal(await page.locator('.gr-synoptic-isobar-label').textContent(),'1008 hPa');
    assert(await page.evaluate(()=>card.__weatherSynoptic.layers.isobars.getLayers().some(layer=>layer instanceof L.Polyline&&card._map.hasLayer(layer))));
    let diag=await snapshot();
    assert.equal(diag.capabilities.fronts.outcome,'loading');
    assert.equal(diag.capabilities.centers.provider,'eccc');
    assert.equal(diag.capabilities.isobars.provider,'noaa_gfs');
    assert.equal(diag.capabilities.centers.layerCount,1);
    assert.equal(diag.capabilities.isobars.layerCount,2);
    assert.deepEqual(diag.lastGesture,{action:'short-tap',control:'standalone'});
    for(const request of await page.evaluate(()=>synopticRequests)){
      assert.equal(request.contract_version,2);
      assert.deepEqual(request.time,{mode:'latest'});
      assert.deepEqual(Object.keys(request.context),['bbox']);
      assert(request.context.bbox.west<8&&request.context.bbox.east>8);
    }
    // A pending WPC call also cannot hold back the next viewport of ECCC/GFS.
    await page.evaluate(()=>card._map.setView([51,9],7,{animate:false}));
    await page.waitForFunction(()=>synopticRequests.filter(r=>r.capability.endsWith('isobars')).length>=2);
    assert.equal((await snapshot()).capabilities.fronts.outcome,'loading');
    await page.evaluate(()=>{window.frontCompleted=true;window.frontPending();});
    await page.waitForFunction(()=>card.__weatherSynoptic.requests.fronts.completed);
    diag=await snapshot();
    assert.equal(diag.capabilities.fronts.wrCode,'synoptic_source_unavailable');
    assert.equal(diag.capabilities.fronts.layerCount,0);
    assert(diag.overlayAttached&&diag.centralControlsRegistered);
    assert(!JSON.stringify(diag).includes('private.invalid'));

    const cdp=await context.newCDPSession(page);
    const touch=(type,point)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:point?[point]:[]});
    const center=async locator=>{const b=await locator.boundingBox();return {x:b.x+b.width/2,y:b.y+b.height/2};};
    const hold=async locator=>{
      await touch('touchStart',await center(locator));
      await panel.waitFor({state:'visible',timeout:4000});
      await touch('touchEnd');
    };
    const drag=async (locator,dx,dy)=>{
      const start=await center(locator);
      await touch('touchStart',start);
      for(let i=1;i<=6;i++)await touch('touchMove',{x:start.x+dx*i/6,y:start.y+dy*i/6});
      await touch('touchEnd');
    };
    await hold(icon);
    assert.deepEqual((await snapshot()).lastGesture,{action:'long-press',control:'standalone'});
    assert.equal(await icon.getAttribute('aria-pressed'),'true');
    const opacitySection=panel.locator('details[data-section=opacity]');
    assert.equal(await opacitySection.locator('summary .release-history-future-chevron').count(),1);
    await opacitySection.locator('summary').tap();
    assert.equal(await opacitySection.locator('summary').getAttribute('aria-expanded'),'false');
    await opacitySection.locator('summary').tap();
    await panel.locator('[data-premium-action=minimize]').tap();
    assert(await panel.locator('[data-premium-content]').isHidden());
    await panel.locator('[data-premium-action=minimize]').tap();
    await drag(panel.locator('header strong'),0,50);
    assert(await panel.evaluate(p=>parseFloat(p.style.top)>25));
    await page.waitForTimeout(400); // Chromium suppresses taps immediately after a native drag.
    const count=()=>page.evaluate(()=>synopticRequests.length);
    const before=await count();
    await panel.locator('[data-synoptic-setting=opacity]').fill('0.51');
    await panel.locator('[data-premium-action=close]').tap();
    await panel.waitFor({state:'hidden',timeout:3500});
    await page.locator('#weather-display-control').tap();
    const central=page.locator('#weather-display-panel');
    await central.waitFor();
    assert.equal(await central.locator('[data-synoptic-opacity=opacity]').inputValue(),'51');
    await central.locator('[data-synoptic-opacity=opacity]').fill('0');
    assert.equal((await snapshot()).overlayVisible,false);
    assert.equal(await page.locator('.gr-synoptic-center').evaluate(n=>getComputedStyle(n).opacity),'0');
    assert.equal(await page.locator('.gr-synoptic-isobar-label').evaluate(n=>getComputedStyle(n).opacity),'0');
    await central.locator('[data-synoptic-opacity=opacity]').fill('100');
    await central.locator('[data-synoptic-opacity=centerOpacity]').fill('40');
    await central.locator('[data-synoptic-opacity=isobarOpacity]').fill('73');
    assert.deepEqual((await snapshot()).opacity,{total:1,centers:.4,isobars:.73});
    assert.equal(await page.locator('.gr-synoptic-center').evaluate(n=>getComputedStyle(n).opacity),'0.4');
    assert.equal(await page.locator('.gr-synoptic-isobar-label').evaluate(n=>getComputedStyle(n).opacity),'0.73');
    assert.equal(await page.evaluate(()=>card.__weatherSynoptic.layers.isobars.getLayers().find(l=>l instanceof L.Polyline).options.opacity),.73);
    await central.locator('[data-weather-display-close]').tap();
    await hold(icon);
    assert.equal(await panel.locator('[data-synoptic-setting=isobarOpacity]').inputValue(),'0.73');
    await panel.locator('[data-premium-action=close]').tap();
    await drag(icon,65,105);
    assert.equal(await icon.getAttribute('aria-pressed'),'true');
    assert.deepEqual((await snapshot()).lastGesture,{action:'drag',control:'standalone'});
    assert.equal(await count(),before,'local style, menu and drag issued no WR requests');

    await page.evaluate(()=>card._eyeHubPatch({grouped:true}));
    const eye=page.locator('#weather-display-eye-control'),bubble=page.locator('.eye-hub-bubble[data-function=synoptic]:visible');
    const openEye=async()=>{
      await eye.tap();
      for(let i=0;i<5&&await bubble.count()===0;i++){
        await page.locator('[data-eye-page="1"]').tap({timeout:3000});
      }
      await bubble.waitFor({timeout:3000});
    };
    await openEye();
    await hold(bubble);
    assert.deepEqual((await snapshot()).lastGesture,{action:'long-press',control:'eye'});
    assert.equal((await snapshot()).visible,true);
    await panel.locator('[data-premium-action=close]').tap();
    await openEye();
    await bubble.tap();
    assert.deepEqual((await snapshot()).lastGesture,{action:'short-tap',control:'eye'});
    assert.equal((await snapshot()).visible,false);
    assert.equal(await page.locator('.gr-synoptic-center').count(),0);

    await page.reload();
    await page.waitForFunction(()=>window.ready&&card._mapReady);
    assert.equal(await page.evaluate(()=>card._eyeHubState().config.slots[4].functionId),'synoptic');
    assert.deepEqual((await snapshot()).opacity,{total:1,centers:.4,isobars:.73});

    await page.evaluate(()=>{
      window.frontCompleted=true;
      window.synopticFailure='outside';
      card._weatherSynopticSet({visible:true,fronts:false});
    });
    await page.waitForFunction(()=>card.__weatherSynoptic.requests.centers?.reason==='outside_viewport');
    assert.equal((await snapshot()).capabilities.centers.layerCount,0);
    await page.evaluate(()=>{window.synopticFailure='empty';card._weatherSynopticQueue(true);});
    await page.waitForFunction(()=>card.__weatherSynoptic.requests.isobars?.reason==='empty_geometry');
    assert.equal((await snapshot()).capabilities.isobars.outcome,'unavailable');
    await page.evaluate(()=>{window.synopticFailure='transport';card._weatherSynopticQueue(true);});
    await page.waitForFunction(()=>card.__weatherSynoptic.requests.centers?.wrCode==='connection_lost');
    diag=await snapshot();
    assert.equal(diag.capabilities.centers.outcome,'error');
    assert.equal(diag.capabilities.isobars.outcome,'ready');
    assert(!JSON.stringify(diag).includes('private.invalid'));

    await page.evaluate(()=>{
      window.synopticFailure='expiry';
      card._map.setView([52,181],7,{animate:false});
      card._weatherSynopticQueue(true);
    });
    await page.waitForFunction(()=>card.__weatherSynoptic.rendered.centers===1&&card.__weatherSynoptic.rendered.isobars===1);
    assert(await page.evaluate(()=>card.__weatherSynoptic.layers.centers.getLayers()[0].getLatLng().lng>180));
    await page.waitForFunction(()=>!card.__weatherSynoptic.layers.centers&&!card.__weatherSynoptic.layers.isobars);
    await page.evaluate(()=>{
      window.synopticFailure=null;
      window.oldSynopticMap=card._map;
      card._weatherSynopticDetach();
      card._resumeWeatherSynoptic();
    });
    await page.waitForFunction(()=>card.__weatherSynoptic.map===window.oldSynopticMap&&card.__weatherSynoptic.rendered.isobars===1);
    assert.deepEqual(errors,[]);
    await context.close();
    console.log('PASS: cold Leaflet attach, independent WR-V2 render, redacted diagnosis, both touch gestures, premium panel, opacity and reload.');
  } finally {
    await browser?.close();
    f.server.close();
  }
}

run().catch(error=>{console.error(error);process.exitCode=1;});
