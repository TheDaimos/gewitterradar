/* The browser may keep cancelled contacts in touches after the OS takes over.
 * Track lifecycle from changedTouches. Never count the reported list as live IDs. */
const changedTouches=event=>Array.from(event.changedTouches||[]);
const reportedTouches=event=>Array.from(event.touches||[]);
const timeline=[0,1000,2000,3000,5000,10000];

export function controlTouchPoint(owner,event,locallyInterrupted){
 const [touch,...others]=changedTouches(event);
 if(!touch||others.length)return null;
 const tracker=owner.__controlTouches,reported=reportedTouches(event);
 if(reported.some(item=>item.identifier!==touch.identifier&&tracker?.active.has(item.identifier)))return null;
 const interrupted=tracker?.aborted;
 return reported.every(item=>item.identifier===touch.identifier||
  interrupted?.has(item.identifier)||locallyInterrupted?.has(item.identifier))?touch:null;
}

export function installControlTouchTracking(owner){
 if(owner.__controlTouches)return;
 const win=owner.ownerDocument.defaultView,controller=new AbortController();
 const state=owner.__controlTouches={active:new Set(),aborted:new Set(),controller,timers:[],epoch:0};
 const opts={capture:true,passive:true,signal:controller.signal};
 const within=event=>event.composedPath().includes(owner);
 const trace=(type,data)=>{if(owner.__mapDiagnosticState?.open)owner._mapDiagnosticLog?.('control.touch.'+type,data);};
 const readEye=()=>{
  const eye=owner.shadow?.getElementById('weather-display-eye-control');
  if(!eye)return {mounted:false};
  const rect=eye.getBoundingClientRect(),css=win.getComputedStyle(eye);
  const hit=owner.shadow.elementFromPoint(rect.left+rect.width/2,rect.top+rect.height/2);
  const drag=owner._weatherControlGesture?.drag;
  return {mounted:eye.isConnected,hit:hit===eye?'eye':hit?.closest?.('dialog')?'dialog':hit?'other':'none',
   pointerEvents:css.pointerEvents,touchAction:css.touchAction,zIndex:css.zIndex,
   drag:drag?.source??null,capture:!!(drag?.source==='pointer'&&drag.eye.hasPointerCapture?.(drag.pointerId)),
   pointerId:drag?.pointerId??null,touchId:drag?.touchId??null,epoch:state.epoch,
   pressing:eye.classList.contains('pressing'),dragging:eye.classList.contains('dragging'),
   longPressArmed:!!(drag?.longPressTimer&&!drag.moved&&!drag.longPressed),
   endFrameArmed:drag?.endFrame!=null,clickGuard:!!owner._weatherControlRelease};
 };
 const start=event=>{
  if(!within(event))return;
  const reported=new Set(reportedTouches(event).map(touch=>touch.identifier));
  for(const id of state.active)if(!reported.has(id))state.active.delete(id);
  const wasMulti=state.active.size>=3;
  for(const touch of changedTouches(event)){
   state.aborted.delete(touch.identifier);
   state.active.add(touch.identifier);
  }
  trace('start',{changed:changedTouches(event).map(touch=>touch.identifier),reported:reportedTouches(event).map(touch=>touch.identifier),
   active:[...state.active],aborted:[...state.aborted],target:event.composedPath()[0]?.closest?.('#weather-display-eye-control')?'eye':'other'});
  if(!wasMulti&&state.active.size>=3){
   owner._recoverWeatherControlGesture?.('three-touch-contacts');
   owner.__eyeHub?.view?.cancelDrag();
   owner.__mapDiagnosticState?.cancelPanelDrag?.();
  }
 };
 const end=event=>{
  const changed=changedTouches(event);
  if(!within(event)&&!changed.some(touch=>state.active.has(touch.identifier)))return;
  const stamp=performance.now(),cancel=event.type==='touchcancel';
  const interrupted=cancel&&state.active.size>=3;
  if(cancel){
   for(const touch of changed)state.aborted.add(touch.identifier);
   while(state.aborted.size>24)state.aborted.delete(state.aborted.values().next().value);
   if(interrupted||!changed.length){for(const id of state.active)state.aborted.add(id);state.active.clear();}
  }
  for(const touch of changed)state.active.delete(touch.identifier);
  if(!reportedTouches(event).length)state.active.clear();
  trace(event.type,{changed:changed.map(touch=>touch.identifier),active:[...state.active],aborted:[...state.aborted]});
  if(!interrupted||!owner.__mapDiagnosticState?.open)return;
  state.timers.forEach(clearTimeout);
  const epoch=++state.epoch;
  state.timers=timeline.map(delay=>setTimeout(()=>{
   if(owner.__controlTouches!==state||state.epoch!==epoch||!owner.__mapDiagnosticState?.open)return;
   trace('observation',{delay,elapsedMs:Math.round(performance.now()-stamp),...readEye()});
  },delay));
 };
 const lifecycle=event=>{
  if(event.type==='blur'&&event.target!==win||event.type==='visibilitychange'&&!owner.ownerDocument.hidden)return;
  for(const id of state.active)state.aborted.add(id);
  state.active.clear();
  owner.__eyeHub?.view?.cancelDrag();
  owner.__mapDiagnosticState?.cancelPanelDrag?.();
  if(owner.__mapDiagnosticState?.open)trace(event.type,readEye());
 };
 win.addEventListener('touchstart',start,opts);
 for(const type of ['pointerdown','pointerup','pointercancel','lostpointercapture']){
  win.addEventListener(type,event=>{
   if(!within(event)||!owner.__mapDiagnosticState?.open)return;
   trace(type,{id:event.pointerId,primary:event.isPrimary,
    target:event.composedPath()[0]?.closest?.('#weather-display-eye-control')?'eye':'other',
    ...readEye()});
  },opts);
 }
 for(const type of ['touchend','touchcancel'])win.addEventListener(type,end,opts);
 for(const type of ['blur','pagehide'])win.addEventListener(type,lifecycle,opts);
 owner.ownerDocument.addEventListener('visibilitychange',lifecycle,opts);
 trace('mounted',{epoch:state.epoch});
}

export function stopControlTouchTracking(owner){
 const state=owner.__controlTouches;
 if(!state)return;
 if(owner.__mapDiagnosticState?.open)owner._mapDiagnosticLog?.('control.touch.unmounted',{epoch:state.epoch});
 state.controller.abort();
 state.timers.forEach(clearTimeout);
 owner.__controlTouches=null;
}

// Drag handles that have a pointer path can share the same confirmed Touch-only plan.
export function bindTouchDragFallback(owner,node,{active,start,move,end,cancel}){
 let id=null;
 function forward(event,touch){
  return {target:event.target,timeStamp:event.timeStamp,pointerId:-touch.identifier-1,pointerType:'touch',
   clientX:touch.clientX,clientY:touch.clientY,button:0,isPrimary:true,
   preventDefault:()=>event.cancelable&&event.preventDefault(),stopPropagation:()=>event.stopPropagation()};
 }
 node.addEventListener('touchstart',event=>{
  if(active()||id!==null)return;
  const touch=controlTouchPoint(owner,event);
  if(touch&&start(forward(event,touch))!==false&&active())id=touch.identifier;
 },{passive:false});
 for(const [type,handler] of [['touchmove',move],['touchend',end],['touchcancel',cancel]]){
  node.addEventListener(type,event=>{
   if(id===null)return;
   if(!active()){id=null;return;}
   const touch=changedTouches(event).find(touch=>touch.identifier===id);
   if(touch)handler(forward(event,touch));
   else if(type==='touchcancel'&&!changedTouches(event).length)cancel();
   else return;
   if(type!=='touchmove')id=null;
  },{passive:false});
 }

}
