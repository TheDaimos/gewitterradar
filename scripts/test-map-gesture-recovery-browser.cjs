// Real card, native Chromium pan/pinch and controlled OS-like terminal events.
const assert = require('node:assert/strict');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {flowFixture} = require('./flow-curves-browser-fixture.cjs');

const TILE = 'https://tiles.gesture-fixture.invalid';
const pixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aXxQAAAAASUVORK5CYII=', 'base64');

function gestureFixture(ref) {
  return flowFixture({ref, decorate: html => html
    .replace('window.catalog=[cap(WIND),',
      "window.catalog=[cap('weather.precipitation.layer',{family:'radar',phenomena:['precipitation']}),cap(WIND),")
    .replace('requests.push(structuredClone(query));', `requests.push(structuredClone(query));
      if(query.capability==='weather.precipitation.layer')return {
        schema:'weather_router.consumer.resolution.v1',contract_version:1,capability:query.capability,status:'ready',
        intent_contract:{kind:'visual_layer',resource_type:'raster_tile',render_interchangeable:true,numeric_interchangeable:false},
        resource:{type:'raster_tile',semantics:{data_origin:'synthetic',measurement_method:'synthetic',
          observation_kind:'observation',quantity:'precipitation_rate',unit:'mm/h'},
          payload:{tile_url:'${TILE}/{z}/{x}/{y}.png',tile_size:256,min_zoom:0,max_zoom:10,default_opacity:.6,
            legend:{url:'${TILE}/legend.png'},attribution:'Synthetic precipitation'}},
        provenance:{provider_id:'synthetic',provider_name:'Synthetic precipitation',spatial_coverage:{scope:'global'}},
        routing:{},freshness:{data_time:new Date().toISOString(),stale:false}
      };`)});
}

async function runEyeInterruptionMatrix() {
  const shadow = card.shadowRoot;
  const eye = shadow.getElementById('weather-display-eye-control');
  const map = shadow.getElementById('map');
  const wind = shadow.getElementById('weather-wind-toggle');
  const temperature = shadow.getElementById('weather-temperature-toggle');
  const state = card._weatherDisplayState();
  const traces = [], hitTests = [];
  card._mapDiagnosticLog = (type,data) => { if (type.startsWith('eye.gesture.')) traces.push({type,...data}); };
  const check = (condition,message) => { if (!condition) throw new Error(message); };
  const frame = () => new Promise(requestAnimationFrame);
  const point = (id,target=eye) => {
    const r=target.getBoundingClientRect();
    return {id,target,x:r.left+r.width/2,y:r.top+r.height/2};
  };
  const pointer = (type,p,{primary=true,target=p.target}={}) => target.dispatchEvent(new PointerEvent(type,{
    pointerType:'touch',pointerId:p.id,isPrimary:primary,button:0,clientX:p.x,clientY:p.y,
    bubbles:true,composed:true,cancelable:true,
  }));
  const touch = (type,target,active,changed) => {
    const make=p=>new Touch({identifier:p.id+1000,target:p.target,clientX:p.x,clientY:p.y});
    return target.dispatchEvent(new TouchEvent(type,{touches:active.map(make),changedTouches:changed.map(make),
      bubbles:true,composed:true,cancelable:type==='touchstart'||type==='touchmove'}));
  };
  let id=301;
  const next=target=>point(id++,target);
  const active=()=>state.eyeDrag;
  const clean=(reason,{release=false}={})=>{
    check(!active()&&!eye.classList.contains('pressing')&&!eye.classList.contains('dragging'),reason+': Eye still active');
    check(!card._weatherControlGesture,reason+': global gesture guard survived');
    if(!release)check(!card._weatherControlRelease,reason+': compatibility click guard survived');
  };
  const tap=()=>{
    const p=next(),open=eye.getAttribute('aria-expanded');
    pointer('pointerdown',p);pointer('pointerup',p);
    check(eye.getAttribute('aria-expanded')!==open,'fresh tap did not activate Eye');
  };
  const mode=async mode=>{
    card._setMapDisplayMode(mode,{persist:false,remember:false});
    await frame();await frame();
    eye.scrollIntoView({block:'nearest'});
    const p=point(0),hit=shadow.elementFromPoint(p.x,p.y),style=getComputedStyle(eye);
    hitTests.push({mode,hit:hit?.id||hit?.className,pointerEvents:style.pointerEvents,zIndex:style.zIndex});
    check(shadow.getElementById(eye.id)===eye&&eye.contains(hit),'Eye not hit-testable in '+mode);
  };
  card._eyeHubPatch({grouped:true,aura:true});
  card._weatherDisplayPatch({rememberPosition:true,eyePosition:{x:.35,y:.55}});
  await mode('standard');

  // V186 loses both tap and drag with this same-target, same-ID fresh sequence.
  // Neither a global map pointer nor an overlay hit-test is involved.
  let a=next();
  pointer('pointerdown',a);
  const orphan=active(),open=eye.getAttribute('aria-expanded');
  check(orphan&&eye.classList.contains('pressing'),'fixture did not arm the first Eye contact');
  pointer('pointerdown',a);
  const replacement=active();
  if(replacement===orphan)throw new Error('V186 trace '+JSON.stringify({mode:'standard',hit:hitTests[0],
    oldPointer:orphan.pointerId,newPointer:a.id,isPrimary:true,pointerup:false,cancel:false,
    capture:eye.hasPointerCapture(a.id),pressing:eye.classList.contains('pressing'),
    releasePending:!!state.eyeReleaseCleanup,nextAccepted:false}));
  check(orphan.listeners.signal.aborted,'orphan retained listeners');
  pointer('pointerup',a);
  check(eye.getAttribute('aria-expanded')!==open,'same-ID fresh contact could not tap');

  for (const scenario of ['three-pointers','three-touches','touchcancel','empty touchcancel','pointercancel','lostpointercapture','touchend','blur','hidden']) {
    a=next();const b=next(map),c=next(wind);
    pointer('pointerdown',a);touch('touchstart',eye,[a],[a]);
    const old=active(),count=traces.filter(t=>t.type==='eye.gesture.interrupted').length;
    if(scenario==='three-pointers'){
      pointer('pointerdown',b,{primary:false});touch('touchstart',map,[a,b],[b]);
      check(pointer('pointerdown',c,{primary:false}),'third pointer default prevented');
      touch('touchstart',wind,[a,b,c],[c]);
      pointer('pointercancel',a,{target:temperature});
      touch('touchcancel',temperature,[],[a,b,c]);
    }
    if(scenario==='three-touches'){
      touch('touchstart',map,[a,b],[b]);
      touch('touchstart',eye,[a,b,c],[c]);
    }
    if(scenario==='touchcancel')touch('touchcancel',temperature,[],[a]);
    if(scenario==='empty touchcancel')touch('touchcancel',temperature,[],[]);
    if(scenario==='pointercancel')pointer('pointercancel',a,{target:wind});
    if(scenario==='lostpointercapture')pointer('lostpointercapture',a,{target:temperature});
    if(scenario==='touchend'){touch('touchend',eye,[],[a]);await frame();await frame();}
    if(scenario==='blur')window.dispatchEvent(new Event('blur'));
    if(scenario==='hidden'){
      Object.defineProperty(document,'hidden',{configurable:true,value:true});
      Object.defineProperty(document,'visibilityState',{configurable:true,value:'hidden'});
      document.dispatchEvent(new Event('visibilitychange'));
      delete document.hidden;delete document.visibilityState;
      document.dispatchEvent(new Event('visibilitychange'));
    }
    clean(scenario);
    check(old.listeners.signal.aborted,scenario+': listener scope not aborted');
    check(traces.filter(t=>t.type==='eye.gesture.interrupted').length===count+1,scenario+': terminal was duplicated');
    tap();
  }

  // Touch-only input after an observed cancel can ignore the identified ghost.
  a=next();
  pointer('pointerdown',a);touch('touchstart',eye,[a],[a]);
  touch('touchcancel',eye,[],[a]);
  const fresh=next(),freshOpen=eye.getAttribute('aria-expanded');
  pointer('pointerdown',fresh,{primary:false});
  touch('touchstart',eye,[a,fresh],[fresh]);
  check(active()?.source==='touch','new changed touch did not bypass ghost contact');
  touch('touchend',eye,[a],[fresh]);
  check(eye.getAttribute('aria-expanded')!==freshOpen,'touch-only tap did not activate');

  // Interruption permits an immediate drag while retaining its saved position.
  a=next();
  pointer('pointerdown',a);pointer('lostpointercapture',a);
  const drag=next(),before={...state.config.eyePosition};
  pointer('pointerdown',drag);
  const moved={...drag,x:drag.x+42,y:drag.y-30};
  pointer('pointermove',moved);pointer('pointerup',moved);
  check(state.config.eyePosition.x>before.x,'fresh Eye drag did not save its position');

  // Long-press may open a dialog and lose capture before physical release.
  const hold=next();
  pointer('pointerdown',hold);
  await new Promise(resolve=>setTimeout(resolve,620));
  const view=card._eyeHubState().view;
  check(view?.dialog.open&&card._weatherControlRelease,'fresh long-press did not open the dialog');
  pointer('lostpointercapture',hold);
  clean('long-press lost capture',{release:true});
  const probe=document.createElement('button');
  view.dialog.append(probe);
  let clicks=0;
  probe.addEventListener('click',()=>clicks++);
  const click=pointerId=>probe.dispatchEvent(new PointerEvent('click',{pointerId,pointerType:'touch',detail:1,
    clientX:hold.x,clientY:hold.y,bubbles:true,composed:true,cancelable:true}));
  pointer('pointerup',hold,{target:probe});
  click(hold.id);
  check(clicks===0&&!card._weatherControlRelease,'matching release click escaped suppression');
  // A separately delivered contact at the same position must pass immediately.
  pointer('pointerdown',hold,{target:probe});
  click(hold.id);
  check(clicks===1,'independent click at the same location was blocked');
  probe.remove();
  view.close();

  for(const nextMode of ['fullscreen','standard','fullscreen','standard']){
    a=next();pointer('pointerdown',a);
    const old=active();
    await mode(nextMode);
    clean(nextMode);
    check(old.listeners.signal.aborted,nextMode+': mode left old listeners active');
    tap();
  }
  a=next();pointer('pointerdown',a);
  const old=active(),parent=card.parentNode;
  card.remove();
  clean('disconnect');
  check(old.listeners.signal.aborted,'disconnect kept listener scope');
  parent.append(card);
  await mode('standard');
  const starts=traces.filter(t=>t.type==='eye.gesture.begin').length;
  tap();
  check(traces.filter(t=>t.type==='eye.gesture.begin').length===starts+1,'remount duplicated the Eye binding');
  const interruptions=traces.filter(t=>t.type==='eye.gesture.interrupted');
  return {hitTests,interruptions};
}

async function runTouchMatrix() {
  const map = card._map;
  const shadow = card.shadowRoot;
  const surface = map.getContainer();
  const traces = [];
  card._mapDiagnosticLog = (type, data) => traces.push({type, ...data});
  map.options.inertia = false;
  const check = (condition, message) => { if (!condition) throw new Error(message); };
  const frame = () => new Promise(requestAnimationFrame);
  const point = (id, x, y, target = surface) => {
    const rect = surface.getBoundingClientRect();
    return {id, x: rect.left + x, y: rect.top + y, target};
  };
  const pointer = (type, p, primary = false, target = p.target) => target.dispatchEvent(new PointerEvent(type, {
    pointerId: p.id + 100, pointerType: 'touch', isPrimary: primary,
    clientX: p.x, clientY: p.y, bubbles: true, composed: true, cancelable: true,
  }));
  const asTouch = p => new Touch({identifier: p.id, target: p.target, clientX: p.x, clientY: p.y});
  const touch = (type, active, changed, target = surface) => target.dispatchEvent(new TouchEvent(type, {
    touches: active.map(asTouch), changedTouches: changed.map(asTouch),
    targetTouches: active.filter(p => p.target === target).map(asTouch),
    bubbles: true, composed: true, cancelable: type === 'touchstart' || type === 'touchmove',
  }));
  const events = name => traces.filter(item => item.type === name).length;
  const idle = reason => {
    const state = card._mapGestureRecovery;
    check(!state.pointers.size && !state.globalPointers.size && !state.touchIds.size, reason + ': retained contact');
    check(!map.touchZoom._zooming && !map.dragging._draggable._moving && !L.Draggable._dragging, reason + ': Leaflet still active');
    check(!state.browserTouchFallback && !state.systemGesturePending && !state.quarantineTouchSequence, reason + ': GR still active');
    check(!document.body.classList.contains('leaflet-dragging'), reason + ': drag class survived');
  };
  let nextId = 1;
  const start = (p, active, primary) => {
    pointer('pointerdown', p, primary);
    touch('touchstart', active, [p], p.target);
  };
  const pinch = async () => {
    map.setView(map.getCenter(), 7, {animate: false});
    const a = point(nextId++, 120, 115), b = point(nextId++, 205, 115);
    start(a, [a], true);
    start(b, [a,b], false);
    check(map.touchZoom._zooming, 'two contacts did not start a Leaflet pinch');
    check(card._mapDiagnosticRecoverySummary().globalPointers.join() === [a.id+100,b.id+100].join(),
      'diagnostics must export the actual contact IDs');
    a.x -= 24; b.x += 24;
    pointer('pointermove', a, true);
    pointer('pointermove', b);
    touch('touchmove', [a,b], [a,b]);
    await frame();
    check(map.touchZoom._moved, 'Leaflet pinch did not move');
    return [a,b];
  };
  const third = (active, target = surface) => {
    const c = point(nextId++, 160, 175, target);
    start(c, [...active,c], false);
    return c;
  };
  const complete = ([a,b,c]) => {
    pointer('pointerup', a, true);
    pointer('pointerup', b);
    if (c) pointer('pointerup', c);
    touch('touchend', [], c ? [a,b,c] : [a,b]);
  };
  const pan = () => {
    const p = point(nextId++, 125, 145);
    start(p, [p], true);
    const center = map.getCenter(), zoom = map.getZoom();
    p.x += 39;
    pointer('pointermove', p, true);
    touch('touchmove', [p], [p]);
    pointer('pointerup', p, true);
    touch('touchend', [], [p]);
    check(!map.getCenter().equals(center) && map.getZoom() === zoom, 'new single contact did not pan');
  };

  // The same assertion fails on the installed V185 using the same real Leaflet.
  let contacts = await pinch();
  let [a,b] = contacts;
  let c = third(contacts);
  pointer('lostpointercapture', a, true);
  idle('lostpointercapture without final up');
  check(events('gesture.interrupted') === 1, 'lost capture must finish the sequence once');
  pointer('pointercancel', a, true);
  touch('touchcancel', [], [a,b,c]);
  check(events('gesture.interrupted') === 1, 'duplicate terminals interrupted twice');
  pan();

  const eye = shadow.getElementById('weather-display-eye-control');
  const wind = shadow.querySelector('.weather-wind-toggle');
  const temperature = shadow.querySelector('.weather-temperature-toggle');
  check(eye && wind && temperature, 'weather overlay controls missing from real card');
  card._weatherWindOpen();
  const panel = shadow.getElementById('weather-wind-panel');
  panel.querySelector('[data-premium-action=minimize]').click();
  check(panel.classList.contains('minimized'), 'wind panel must be minimized for the overlay test');
  const terminals = ['touchcancel', 'pointercancel', 'partial touchend', 'window blur', 'hidden', 'missing terminal'];
  for (const terminal of terminals) {
    const count = events('gesture.interrupted');
    contacts = await pinch();
    [a,b] = contacts;
    if (terminal === 'partial touchend') {
      // The third contact can arrive after the former 700 ms stale heuristic.
      await new Promise(resolve => setTimeout(resolve, 740));
      check(map.touchZoom._zooming, 'waiting alone interrupted a live pinch');
    }
    const control = terminal === 'touchcancel' ? panel.querySelector('header') : terminal === 'partial touchend' ? eye : surface;
    c = third(contacts, control);
    check(map.touchZoom._zooming, terminal + ': third down reset Leaflet before the terminal');
    switch (terminal) {
      case 'touchcancel': {
        let delivered = false;
        control.addEventListener('touchcancel', event => { delivered = true; event.stopPropagation(); }, {once: true});
        touch('touchcancel', [b,c], [a], control);
        check(delivered, 'control must still receive its terminal event');
        break;
      }
      case 'pointercancel':
        pointer('pointercancel', b, false, temperature);
        break;
      case 'partial touchend':
        touch('touchend', [a,c], [b], control);
        break;
      case 'window blur':
        window.dispatchEvent(new Event('blur'));
        window.dispatchEvent(new Event('focus'));
        break;
      case 'hidden':
        Object.defineProperty(document, 'visibilityState', {configurable: true, value: 'hidden'});
        document.dispatchEvent(new Event('visibilitychange'));
        delete document.visibilityState;
        document.dispatchEvent(new Event('visibilitychange'));
        break;
      case 'missing terminal':
        pan();
        break;
    }
    idle(terminal);
    // The next input starts before any old 220 ms settle timer could fire.
    pan();
    complete([a,b,c]);
    check(events('gesture.interrupted') === count + 1, terminal + ': cleanup was not exactly once');
  }
  panel.querySelector('[data-premium-action=minimize]').click();
  panel.querySelector('[data-wind-action=close]').click();

  // A cancellation from a control must not affect an independent map pointer.
  contacts = await pinch();
  const outside = point(nextId++, 160, 175, wind);
  pointer('pointercancel', outside);
  wind.addEventListener('touchcancel', event => event.stopPropagation(), {once: true});
  touch('touchcancel', contacts, [outside], wind);
  wind.dispatchEvent(new FocusEvent('blur', {composed: true}));
  check(map.touchZoom._zooming, 'unrelated control cancel/blur stopped the map');
  pointer('pointercancel', contacts[0], true);
  idle('map-owned cancel');

  contacts = await pinch();
  const ended = events('gesture.interrupted');
  touch('touchend', [], contacts);
  idle('touchend without pointerup or third contact');
  check(events('gesture.interrupted') === ended + 1, 'missing pointerup left a live sequence');

  map.tapHold.enable();
  let holds = 0;
  const hold = () => { holds++; };
  surface.addEventListener('contextmenu', hold);
  const held = point(nextId++, 130, 170);
  start(held, [held], true);
  pointer('lostpointercapture', held, true);
  await new Promise(resolve => setTimeout(resolve, 620));
  check(holds === 0, 'aborted map long-press fired later');
  const nextHold = point(nextId++, 130, 170);
  start(nextHold, [nextHold], true);
  await new Promise(resolve => setTimeout(resolve, 620));
  check(holds === 1, 'new map long-press did not fire');
  pointer('pointerup', nextHold, true);
  touch('touchend', [], [nextHold]);
  surface.removeEventListener('contextmenu', hold);
  map.tapHold.disable();

  // Old WebView contacts remain in touches, with no PointerEvents for the new one.
  contacts = await pinch();
  c = third(contacts);
  touch('touchcancel', [], [...contacts,c]);
  const old = contacts[0], fresh = point(nextId++, 125, 145), snap = map.options.zoomSnap;
  const center = map.getCenter();
  touch('touchstart', [old,fresh], [fresh]);
  check(card._mapGestureRecovery.browserTouchFallback?.mode === 'touch', 'confirmed touch-only phantom contact did not use fallback');
  fresh.x += 32;
  touch('touchmove', [old,fresh], [fresh]);
  await frame();
  check(!map.getCenter().equals(center), 'fallback did not pan');
  touch('touchend', [old], [fresh]);
  idle('touch-only fallback end');
  check(map.options.zoomSnap === snap, 'zoomSnap not restored');

  // A display-mode change and detach cancel in-flight input and remove old listeners.
  for (const mode of ['fullscreen', 'large', 'standard']) {
    await pinch();
    const guard = card._mapGestureRecovery;
    card._setMapDisplayMode(mode, {persist: false, remember: false});
    idle(mode);
    card._resumeMapGestureRecovery();
    check(card._mapGestureRecovery === guard, mode + ': duplicated guard');
  }
  await pinch();
  const before = card._mapGestureRecovery, parent = card.parentNode;
  card.remove();
  check(!before.handlers, 'detached guard kept its listeners');
  parent.append(card);
  const after = card._mapGestureRecovery;
  check(after !== before && after.handlers, 'remount did not install a fresh guard');
  const seen = events('input.global-pointerdown');
  pan();
  check(events('input.global-pointerdown') === seen + 1, 'global pointer listener duplicated after remount');
  idle('remount pan');
  return events('gesture.interrupted');
}

async function nativeGestures(context, page) {
  const cdp = await context.newCDPSession(page);
  const bounds = await page.evaluate(() => {
    card._map.setView(card._map.getCenter(), 7, {animate: false});
    const r = card._map.getContainer().getBoundingClientRect();
    return {x: Math.round(r.left + r.width / 2), y: Math.round(r.top + Math.min(r.height / 2, 180))};
  });
  const dispatch = (type, touchPoints) => cdp.send('Input.dispatchTouchEvent', {type, touchPoints});
  const a = {x: bounds.x - 38, y: bounds.y, id: 1}, b = {x: bounds.x + 38, y: bounds.y, id: 2};
  const c = {x: bounds.x, y: bounds.y + 43, id: 3};
  await dispatch('touchStart', [a]);
  await dispatch('touchStart', [a,b]);
  await dispatch('touchMove', [{...a,x:a.x-20},{...b,x:b.x+20}]);
  await dispatch('touchStart', [a,b,c]);
  await dispatch('touchCancel', []);
  await page.waitForFunction(() => !card._map.touchZoom._zooming && !card._mapGestureRecovery.pointers.size);
  const zoom = await page.evaluate(() => card._map.getZoom());
  await dispatch('touchStart', [a]);
  await dispatch('touchStart', [a,b]);
  await dispatch('touchMove', [{...a,x:a.x-32},{...b,x:b.x+32}]);
  await page.waitForFunction(start => card._map.getZoom() > start, zoom);
  await dispatch('touchEnd', []);
  await page.waitForFunction(() => !card._map._animatingZoom && !card._map.touchZoom._zooming);
  const center = await page.evaluate(() => card._map.getCenter());
  await dispatch('touchStart', [a]);
  await dispatch('touchMove', [{...a,x:a.x+46}]);
  await dispatch('touchEnd', []);
  assert.notDeepEqual(await page.evaluate(() => card._map.getCenter()), center, 'native pan after cancellation and pinch');
  await cdp.detach();
}

async function weatherControlsAfterCancel(context, page) {
  await page.evaluate(() => {
    card._setMapDisplayMode('fullscreen', {persist: false, remember: false});
    card._eyeHubPatch({grouped: true, aura: true});
    card._weatherWindSet({mode: 'snake', snakeAnimationExplicit: true});
  });
  const eye = page.locator('#weather-display-eye-control');
  await eye.tap();
  assert.equal(await eye.getAttribute('aria-expanded'), 'true');
  await eye.tap();
  const cdp = await context.newCDPSession(page);
  const point = async () => {
    const rect = await eye.boundingBox();
    return {x: rect.x + rect.width/2, y: rect.y + rect.height/2};
  };
  const dispatch = (type, touchPoints) => cdp.send('Input.dispatchTouchEvent', {type, touchPoints});
  const eyeContact = {...await point(),id:11};
  const other = await page.evaluate(() => {
    const r=card._map.getContainer().getBoundingClientRect();
    return [{x:r.left+r.width*.62,y:r.top+r.height*.36,id:12},{x:r.left+r.width*.76,y:r.top+r.height*.42,id:13}];
  });
  await dispatch('touchStart',[eyeContact]);
  assert(await eye.evaluate(element=>{
    const drag=card._weatherDisplayState().eyeDrag;
    return drag?.source==='pointer'&&element.hasPointerCapture(drag.pointerId);
  }), 'native Eye pointer must obtain capture');
  await dispatch('touchStart',[eyeContact,other[0]]);
  await dispatch('touchStart',[eyeContact,...other]);
  await dispatch('touchCancel',[]);
  await page.waitForFunction(()=>!card._weatherDisplayState().eyeDrag&&!card._weatherControlRelease);
  await eye.tap();
  assert.equal(await eye.getAttribute('aria-expanded'),'true','native Eye tap immediately after three contacts');
  await eye.tap();
  await dispatch('touchStart', [await point()]);
  await page.locator('#eye-hub-config').waitFor({state: 'visible'});
  await dispatch('touchEnd', []);
  await page.evaluate(() => card._eyeHubState().view.close());
  await page.locator('#eye-hub-config').waitFor({state: 'hidden'});
  const before = await point();
  await dispatch('touchStart', [before]);
  await dispatch('touchMove', [{x: before.x+45, y: before.y-44}]);
  await dispatch('touchEnd', []);
  const after = await point();
  assert(Math.hypot(after.x-before.x, after.y-before.y) > 20, 'Eye drag after cancellation');
  await cdp.detach();

  for(const [kind,selector] of [['compass','#map-compass-overlay'],['medallion','#map-medallion-overlay']]){
    await page.evaluate(kind=>card._setMapInstrumentVisible(kind,true),kind);
    await page.locator(selector).tap();
    await page.waitForFunction(kind=>card[kind==='compass'?'_compassPickerDialog':'_medallionPickerDialog']?.open,kind);
    await page.evaluate(kind=>kind==='compass'?card._closeCompassPicker(false):card._closeMedallionPicker(false),kind);
  }

  await page.evaluate(() => card._eyeHubPatch({grouped: false}));
  for (const selector of ['#weather-precipitation-toggle', '#weather-wind-toggle', '#weather-temperature-toggle']) {
    const toggle = page.locator(selector);
    const before = await toggle.getAttribute('aria-pressed');
    await toggle.tap();
    assert.notEqual(await toggle.getAttribute('aria-pressed'), before, selector + ' touch after cancellation');
  }
  await page.waitForFunction(() => card._weatherWindState().snakePainter?.metrics.segments > 0 &&
    card._weatherTemperatureState().painter?.image &&
    Object.values(card._weatherRadarState().layer?._tiles || {}).some(tile => tile.loaded));
  for (const selector of ['.weather-wind-snake-canvas', '.weather-temperature-canvas']) {
    const canvases = await page.locator(selector).evaluateAll(nodes => nodes.map(node => getComputedStyle(node).pointerEvents));
    assert(canvases.length && canvases.every(value => value === 'none'), selector + ' must leave the map hit target available');
  }
  const hit=()=>eye.evaluate(element=>{
    const r=element.getBoundingClientRect();
    const target=element.getRootNode().elementFromPoint(r.left+r.width/2,r.top+r.height/2);
    return {id:target?.id,hit:element.contains(target),pointerEvents:getComputedStyle(element).pointerEvents};
  });
  const beforeWeatherCancel=await hit();
  await nativeGestures(context, page);
  assert.deepEqual(await hit(),beforeWeatherCancel,'active weather overlays changed Eye hit testing after cancel');
  console.log('PASS Eye hit test with active weather layers:',JSON.stringify(beforeWeatherCancel));
}

async function pointerAdapter(browser, fixture) {
  const context = await browser.newContext({viewport: {width: 1100, height: 850}});
  await context.addInitScript(() => { delete window.TouchEvent; });
  const page = await context.newPage();
  try {
    await fixture.route(page);
    await page.goto('http://127.0.0.1:' + fixture.server.address().port);
    await page.waitForFunction(() => window.ready && card._mapGestureRecovery?.handlers);
    await page.evaluate(() => {
      const {L, map, mapEl} = card._mapGestureRecovery;
      if (!L.Browser.pointer || L.Browser.touchNative) throw new Error('Leaflet pointer adapter fixture not active');
      const r = mapEl.getBoundingClientRect();
      const send = (type, id, x, isPrimary = false) => {
        const event = new PointerEvent(type, {pointerId: id, pointerType: 'touch', isPrimary,
          clientX: r.left+x, clientY: r.top+100, bubbles: true, composed: true, cancelable: true});
        mapEl.dispatchEvent(event);
        return event;
      };
      send('pointerdown', 31, 100, true);
      send('pointerdown', 32, 165);
      if (!map.touchZoom._zooming) throw new Error('Pointer adapter did not start a pinch');
      send('lostpointercapture', 31, 100, true);
      const next = send('pointerdown', 33, 120, true);
      if (next.touches?.length !== 1 || next.touches[0].pointerId !== 33) {
        throw new Error('Leaflet document cache retained canceled Shadow DOM pointers');
      }
      send('pointerup', 33, 120, true);
    });
  } finally {
    await context.close();
  }
}

(async () => {
  const fixture = gestureFixture(process.env.GR_EYE_REFERENCE || process.env.GR_GESTURE_REFERENCE || null);
  await new Promise(resolve => fixture.server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({headless: true, ...(process.env.CHROME_PATH ? {executablePath: process.env.CHROME_PATH} : {})});
  try {
    const context = await browser.newContext({viewport: {width: 393, height: 851}, isMobile: true, hasTouch: true});
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await fixture.route(page);
    await page.route(TILE + '/**', route => route.fulfill({
      contentType: 'image/png', headers: {'Access-Control-Allow-Origin': '*'}, body: pixel,
    }));
    await page.goto('http://127.0.0.1:' + fixture.server.address().port);
    await page.waitForFunction(() => window.ready && card._mapGestureRecovery?.handlers);
    if(!process.env.GR_GESTURE_REFERENCE){
      const eyeTrace=await page.evaluate(runEyeInterruptionMatrix);
      console.log('PASS Eye interruption and hit testing:',JSON.stringify(eyeTrace));
    }
    const interrupted = await page.evaluate(runTouchMatrix);
    await nativeGestures(context, page);
    await weatherControlsAfterCancel(context, page);
    await pointerAdapter(browser, fixture);
    assert.deepEqual(errors, []);
    console.log('PASS: real Leaflet cancellation matrix, ' + interrupted + ' interrupted sequences, touch-only fallback, pointer adapter, lifecycle and native Chromium weather controls');
  } finally {
    await browser.close();
    fixture.server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
