const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {fixture}=require('./wind-perf-browser-fixture.cjs');

async function exercise(){
 const s=card.shadow,eye=s.getElementById('weather-display-eye-control'),map=s.getElementById('map');
 card._setMapDisplayMode('fullscreen',{persist:false});
 card._weatherDisplayPatch({rememberPosition:true,eyePosition:{x:.30,y:.45}});
 card._eyeHubPatch({grouped:true});
 card._mapDiagnosticState().open=true;
 const nextFrame=()=>new Promise(requestAnimationFrame);
 await nextFrame();await nextFrame();
 let serial=12000;
 const send=(target,type,changed,active=changed)=>{
  const contacts=points=>points.map(point=>new Touch({target,identifier:point.id,clientX:point.x,clientY:point.y}));
  return target.dispatchEvent(new TouchEvent(type,{bubbles:true,composed:true,cancelable:true,
   touches:contacts(active),targetTouches:contacts(active),changedTouches:contacts(changed)}));
 };
 const pointer=(type,target,p)=>target.dispatchEvent(new PointerEvent(type,{bubbles:true,composed:true,cancelable:true,
  pointerType:'touch',isPrimary:true,pointerId:p.id,clientX:p.x,clientY:p.y,button:0}));
 const centre=node=>{const r=node.getBoundingClientRect();return {id:++serial,x:r.x+r.width/2,y:r.y+r.height/2};};
 const check=(ok,label)=>{if(!ok)throw Error(label);};
 const delay=ms=>new Promise(resolve=>setTimeout(resolve,Math.max(0,ms)));
 const log=[];
 let ghost=[],firstGhost=null;
 for(let cycle=0;cycle<5;cycle++){
  const contacts=[centre(map),centre(map),centre(map)];
  for(let i=1;i<=contacts.length;i++)send(map,'touchstart',[contacts[i-1]],contacts.slice(0,i));
  send(map,'touchcancel',contacts,[]);
  firstGhost??=contacts[0];
  ghost=cycle===0?contacts.slice(0,2):[firstGhost,contacts[0]];
  const began=performance.now();
  for(const at of [0,1000,2000,3000,5000,10000]){
   await delay(began+at-performance.now());
   const p=centre(eye),hit=s.elementFromPoint(p.x,p.y),opened=eye.getAttribute('aria-expanded');
   check(eye.contains(hit),'Eye hit target covered at '+at+' by '+(hit?.id||hit?.tagName));
   const pending=performance.now()-began;
   if(at<2000){
    pointer('pointerdown',eye,p);send(eye,'touchstart',[p]);pointer('pointerup',eye,p);send(eye,'touchend',[p],[]);
   }else{
    send(eye,'touchstart',[p],[...ghost,p]);
    send(eye,'touchend',[p],ghost);
   }
   const tap=eye.getAttribute('aria-expanded')!==opened;
   check(tap,'Eye received targeted input but tap did not act at '+at+'ms (pointerless='+String(at>=2000)+')');
   card._eyeHubClose();
   const q=centre(eye),x0=q.x;
   const moved={...q,x:q.x+(cycle%2?1:-1)*24};
   if(at<2000){
    pointer('pointerdown',eye,q);pointer('pointermove',eye,moved);pointer('pointerup',eye,moved);
   }else{
    send(eye,'touchstart',[q],[...ghost,q]);
    send(eye,'touchmove',[moved],[...ghost,moved]);
    send(eye,'touchend',[moved],ghost);
   }
   const shift=Math.abs(centre(eye).x-x0);
   check(shift>10,'Eye drag did not persist '+at+' '+shift);
   card._weatherDisplayPatch({eyePosition:{x:.30,y:.45}});
   log.push({cycle:cycle+1,scheduledMs:at,elapsedMs:Math.round(pending),source:at<2000?'pointer':'touch',target:'eye',tap,dragCssPx:Math.round(shift)});
  }
  if(cycle===0){
   // Late capture loss with an unrelated ID and an older cancelled hold timer.
   const first=centre(eye);
   pointer('pointerdown',eye,first);pointer('lostpointercapture',eye,first);
   const second=centre(eye);
   pointer('pointerdown',eye,second);pointer('lostpointercapture',eye,first);
   check(card._weatherDisplayState().eyeDrag?.pointerId===second.id,'late capture loss cancelled new contact');
   pointer('pointerup',eye,second);card._eyeHubClose();
   await delay(650);
   check(!card._eyeHubState().view?.dialog.open,'cancelled long-press timer opened the dialog');
  }
 }
 // Real control paths reached by touch-only input after the ten-second probe.
 const press=(node,hold=false)=>{
  const p=centre(node);
  send(node,'touchstart',[p],[...ghost,p]);
  return (hold?delay(680):Promise.resolve()).then(()=>send(node,'touchend',[p],ghost));
 };
 await press(eye);
 await nextFrame();
 const bubble=s.querySelector('#eye-hub-bubbles [data-function=wind]:not([hidden])');
 check(!!bubble,'grouped wind control unavailable');
 const before=card._weatherWindState().config.visible;
 await press(bubble);
 check(card._weatherWindState().config.visible!==before,'grouped bubble rejected post-abort Touch-only');
 card._eyeHubPatch({grouped:false});
 const wind=s.getElementById('weather-wind-toggle');
 await press(wind);
 check(card._weatherWindState().config.visible===before,'standalone icon rejected post-abort Touch-only');
 await press(eye,true);
 const view=card._eyeHubState().view;
 check(view?.dialog.open,'post-abort long-press did not open the configurator');
 const slot=view.dialog.querySelector('[data-eye-palette] [data-eye-function]');
 check(!!slot,'Eye configuration palette missing');
 const slotConfig=JSON.stringify(card._eyeHubState().config.slots),job=centre(slot);
 send(slot,'touchstart',[job],[...ghost,job]);
 send(slot,'touchmove',[{...job,x:job.x+22}],[...ghost,job]);
 send(slot,'touchcancel',[job],ghost);
 check(!view.drag&&!view.ghost&&JSON.stringify(card._eyeHubState().config.slots)===slotConfig,'cancelled slot drag changed settings or left a ghost');
 view.close();
 card._setMapDisplayMode('standard',{persist:false});
 card._openMapDiagnostics();
 const panel=s.getElementById('map-diagnostic-panel'),handle=panel.querySelector('.mapdiag-title');
 const start=centre(handle),beforeTop=panel.getBoundingClientRect().top;
 const change={...start,y:start.y-30};
 send(handle,'touchstart',[start],[...ghost,start]);
 send(handle,'touchmove',[change],[...ghost,change]);
 send(handle,'touchend',[change],ghost);
 check(Math.abs(panel.getBoundingClientRect().top-beforeTop)>10,'diagnostics header did not drag after delayed interruption');
 panel.querySelector('[data-mapdiag-toggle-minimize]').click();
 check(card._mapDiagnosticState().panelLevel==='minimized','diagnostic dialog button failed after drag');
 const observations=card._mapDiagnosticState().events.filter(event=>event.type==='control.touch.observation').map(event=>event.data);
 check(observations.some(item=>item.delay===2000&&item.hit==='eye'),'missing 2 s diagnostic correlation');
 return {log,observations,controls:{groupedBubble:true,standaloneIcon:true,longPress:true,cancelledSlot:true,diagnosticDragAndButton:true}};
}

async function main(){
 const f=fixture({ref:process.env.GR_DELAY_REFERENCE||null});
 await new Promise(resolve=>f.server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
 try{
  const page=await browser.newPage({viewport:{width:393,height:851},isMobile:true,hasTouch:true});
  await f.route(page);
  await page.goto('http://127.0.0.1:'+f.server.address().port);
  await page.waitForFunction(()=>window.ready&&card._mapReady);
  const result=await page.evaluate(exercise);
  assert.equal(result.log.length,30);
  if(process.env.GR_DELAY_TRACE)fs.writeFileSync(process.env.GR_DELAY_TRACE,JSON.stringify(result,null,2)+'\n');
  console.log('PASS 5 cycles × Eye tap and drag at 0/1/2/3/5/10 s, late lost capture and cancelled timer');
 }finally{
  await browser.close();f.server.close();
 }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
