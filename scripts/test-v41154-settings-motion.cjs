// Browser regression for the actual settings card, not a synthetic CSS approximation.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://127.0.0.1');
  const file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(file,(err,data)=>{
    if(err){res.writeHead(404).end();return;}
    res.setHeader('Content-Type',file.endsWith('.html')?'text/html':file.endsWith('.js')?'text/javascript':'application/octet-stream');
    res.end(data);
  });
});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({executablePath:process.argv[2],headless:true});
  try {
    for(const delivery of ['dashboard','integration']){
      for(const [name,width,height,touch] of [['android',412,915,true],['desktop',1366,940,false]]){
        const context=await browser.newContext({viewport:{width,height},hasTouch:touch});
        const page=await context.newPage();
        await page.goto('http://127.0.0.1:'+server.address().port+'/scripts/about-onboarding-harness.html?scenario=first&delivery='+delivery);
        await page.waitForFunction(()=>window.aboutResult?.status==='PASS');
        await page.evaluate(()=>{
          const c=window.aboutCard;c._closeAbout(false,false);
          c.shadowRoot.getElementById('settings-open-horizontal').click();
        });
        for(const speed of ['Langsam','Mittel','Schnell']){
          await page.evaluate(value=>{
            const root=window.aboutCard.shadowRoot;
            const button=root.getElementById('gr-menu-speed-button');
            const option=root.querySelector('#gr-menu-speed-dropdown [data-gr-menu-option="'+value+'"]');
            if(!button||!option)throw Error('Missing section 5 speed control '+value);
            button.click();option.click();
            if(root.getElementById('gr-menu-speed-value').textContent!==value)throw Error('Speed selection not applied');
          },speed);
          for(const direction of ['forward','back']){
            const started=await page.evaluate(direction=>{
              const root=window.aboutCard.shadowRoot;
              const body=root.querySelector('#settings-dialog .settings-body');
              const button=direction==='forward'?root.querySelector('.gr-horizontal-item'):root.getElementById('gr-horizontal-back');
              if(!button)throw Error('Missing navigation button for '+direction);
              button.click();
              const pane=body.querySelector('.gr-horizontal-transition');
              if(!pane)throw Error('Transition pane not mounted');
              const pages=[...pane.children];
              const first=pages[0].firstElementChild;
              const second=pages[1].firstElementChild;
              const dialog=root.getElementById('settings-dialog');
              const signature=dialog.querySelector(':scope > .settings-signature-wrap');
              const version=dialog.querySelector(':scope > .settings-footer-version');
              if(!signature||!version)throw Error('Shell footer is not independent of sliding content');
              return {
                before:dialog.getBoundingClientRect().height,
                sourceVisible:getComputedStyle(first).display!=='none' && getComputedStyle(first).visibility!=='hidden',
                incomingVisible:getComputedStyle(second).display!=='none' && getComputedStyle(second).visibility!=='hidden',
                width:pages[1].getBoundingClientRect().width,
                viewportWidth:body.clientWidth,
                snapshotSpeed:root.getElementById('gr-menu-speed-value')?.textContent || null,
                staticTreeHidden:[...body.children].some(el=>el!==pane && getComputedStyle(el).contentVisibility==='hidden'),
                signatureComposited:getComputedStyle(signature).transform!=='none',
                fixedHeight:Math.abs(parseFloat(dialog.style.height)-parseFloat(getComputedStyle(dialog).height))<1,
                noHeightAnimation:dialog.getAnimations().every(a=>a.effect.getKeyframes().every(k=>!Object.hasOwn(k,'height'))),
              };
            },direction);
            assert.equal(started.snapshotSpeed,speed,`${delivery}/${name}/${speed}/${direction} cloned speed switched back to Schnell`);
            assert.equal(started.staticTreeHidden,true,`${delivery}/${name}/${speed}/${direction} live controls were still repainted under snapshots`);
            assert.equal(started.signatureComposited,true,`${delivery}/${name}/${speed}/${direction} signature not promoted`);
            assert.equal(started.fixedHeight,true,`${delivery}/${name}/${speed}/${direction} dialog relayout still active`);
            assert.equal(started.noHeightAnimation,true,`${delivery}/${name}/${speed}/${direction} a CSS height animation remains`);
            assert.equal(started.sourceVisible,true,`${delivery}/${name}/${speed}/${direction} outgoing snapshot hidden`);
            assert.equal(started.incomingVisible,true,`${delivery}/${name}/${speed}/${direction} incoming snapshot hidden`);
            assert.ok(Math.abs(started.width-started.viewportWidth)<3,`${delivery}/${name}/${speed}/${direction} snapshot width mismatch`);
            const duration={Schnell:220,Mittel:440,Langsam:760}[speed];
            await page.waitForTimeout(Math.floor(duration*.6));
            const middle=await page.evaluate(()=>{
              const root=window.aboutCard.shadowRoot;
              const body=root.querySelector('#settings-dialog .settings-body');
              const pane=body.querySelector('.gr-horizontal-transition');
              const dialog=root.getElementById('settings-dialog');
              const signature=dialog.querySelector(':scope > .settings-signature-wrap');
              const footer=dialog.querySelector(':scope > .settings-footer-version');
              const signatureBox=signature.getBoundingClientRect(),dialogBox=dialog.getBoundingClientRect();
              return {
                snapshotPresent:!!pane,
                shown:pane?[...pane.children].every(child=>getComputedStyle(child.firstElementChild).display!=='none'):false,
                footerPresent:signatureBox.height>0&&getComputedStyle(signature).visibility==='visible',
                footerBottomDelta:dialogBox.bottom-signatureBox.bottom,
                versionBottomDelta:dialogBox.bottom-footer.getBoundingClientRect().bottom,
              };
            });
            assert.equal(middle.snapshotPresent,true,`${delivery}/${name}/${speed}/${direction} early transition disposal`);
            assert.equal(middle.shown,true,`${delivery}/${name}/${speed}/${direction} invisible snapshot in flight`);
            assert.equal(middle.footerPresent,true,`${delivery}/${name}/${speed}/${direction} shell signature flicker`);
            assert.ok(middle.versionBottomDelta>0&&middle.versionBottomDelta<40,'Version footer positioning');
            const handoff=await page.waitForFunction(()=>{
              const root=window.aboutCard.shadowRoot;
              const pane=root.querySelector('.gr-horizontal-transition');
              if(pane?.dataset.grSettling!=='1')return false;
              return {
                snapshotRetained:pane.isConnected,
                originalRevealed:!root.querySelector('#settings-dialog .settings-body').classList.contains('gr-horizontal-animating')
              };
            },{timeout:4000});
            const state=await handoff.jsonValue();
            assert.equal(state.snapshotRetained,true,`${delivery}/${name}/${speed}/${direction} missing snapshot at handoff`);
            assert.equal(state.originalRevealed,true,`${delivery}/${name}/${speed}/${direction} original remained hidden`);
            await page.waitForFunction(()=>!window.aboutCard.shadowRoot.querySelector('.gr-horizontal-transition'),{timeout:4000});
            const after=await page.evaluate(()=>{
              const root=window.aboutCard.shadowRoot;const dialog=root.getElementById('settings-dialog');
              const body=dialog.querySelector('.settings-body');
              const footer=dialog.querySelector(':scope > .settings-footer-version');
              const lockedHeight=dialog.getBoundingClientRect().height;
              const lockedCss=dialog.style.height;
              dialog.style.removeProperty('height');
              const naturalHeight=dialog.getBoundingClientRect().height;
              dialog.style.height=lockedCss;
              return {height:lockedHeight,naturalHeight,
                dialogVisible:getComputedStyle(dialog).display!=='none',
                bodyScrollable:body.scrollHeight>=body.clientHeight,
                footerBottom:dialog.getBoundingClientRect().bottom-footer.getBoundingClientRect().bottom,
                horizontalOverflow:body.scrollWidth>body.clientWidth+2};
            });
            assert.ok(after.dialogVisible);
            assert.ok(!after.horizontalOverflow,`${delivery}/${name}/${speed}/${direction} horizontal overflow`);
            assert.ok(after.footerBottom>0&&after.footerBottom<40,'Finished footer must remain anchored');
            assert.ok(after.height>140,'Dialog collapsed');
            assert.ok(Math.abs(after.height-after.naturalHeight)<4,`${delivery}/${name}/${speed}/${direction}: target height is inconsistent with natural layout: ${after.height} vs ${after.naturalHeight}`);
          }
        }
        // Both menus are under section 5 and use the existing dot-listbox style.
        const menuModes=await page.evaluate(()=>{
          const root=window.aboutCard.shadowRoot;
          const menu=root.getElementById('settings-open');
          const hiddenGear=root.getElementById('settings-open-horizontal');
          const section=root.getElementById('settings-aura-section');
          const styleButton=root.getElementById('gr-menu-style-button');
          const speedRow=root.getElementById('gr-menu-speed-row');
          const styleRow=root.getElementById('gr-menu-style-row');
          const speedButton=root.getElementById('gr-menu-speed-button');
          if(!menu||!section||!styleButton||!speedButton)throw Error('Section 5 dropdown controls missing');
          if(getComputedStyle(hiddenGear).display!=='none')throw Error('Second settings gear visible');
          if(!section.contains(styleRow)||!section.contains(speedRow))throw Error('Menu settings not under point 5');
          if(getComputedStyle(styleButton).borderStyle==='none')throw Error('Not styled as settings dropdown');
          if(!styleButton.classList.contains('settings-language-button')||!speedButton.classList.contains('settings-language-button'))throw Error('Existing listbox button styling not reused');
          const views=[];
          for(const style of ['classic','modern']){
            styleButton.click();
            const option=root.querySelector('#gr-menu-style-dropdown [data-gr-menu-option="'+style+'"]');
            if(!option)throw Error('Missing dropdown option '+style);
            option.click();
            views.push({
              selected:menu.dataset.menuStyle,
              modern:root.getElementById('settings-backdrop').classList.contains('gr-horizontal-mode'),
              speedHidden:speedRow.hidden,
              fixedSection:section.contains(styleRow)&&section.contains(speedRow),
              gold:getComputedStyle(menu.querySelector('.gear-classic')).display!=='none',
              blue:getComputedStyle(menu.querySelector('.gear-modern')).display!=='none'
            });
          }
          return {views,persisted:localStorage.getItem('gr-settings-menu-style'),
            speedPersisted:localStorage.getItem('gr-horizontal-navigation-speed')};
        });
        assert.deepEqual(menuModes.views,[
          {selected:'classic',modern:false,speedHidden:true,fixedSection:true,gold:true,blue:false},
          {selected:'modern',modern:true,speedHidden:false,fixedSection:true,gold:false,blue:true}
        ],`${delivery}/${name} Point 5 menu presentation or speed visibility mismatch`);
        assert.equal(menuModes.persisted,'modern',`${delivery}/${name} mode not persisted`);
        assert.ok(['Schnell','Mittel','Langsam'].includes(menuModes.speedPersisted),`${delivery}/${name} speed not saved`);
        await page.evaluate(()=>{
          const root=window.aboutCard.shadowRoot;
          root.getElementById('settings-close').click();
          root.getElementById('settings-open').click();
          if(!root.getElementById('settings-backdrop').classList.contains('gr-horizontal-mode'))throw Error('Saved Modern mode not reopened');
        });
        const scroller=await page.evaluate(()=>{
          const root=window.aboutCard.shadowRoot;
          const dropdown=root.getElementById('location-dropdown');
          const anchor=root.getElementById('location-main-button');
          const position=window.aboutCard._positionLocationDropdown;
          if(!dropdown||!anchor||typeof position!=='function')throw Error('Missing location selector');
          const old=dropdown.innerHTML,oldStyle=dropdown.getAttribute('style');
          try{
            dropdown.innerHTML=Array.from({length:60},(_,i)=>'<div class="location-saved-row" style="height:40px">Ort '+i+'</div>').join('');
            position(anchor);
            const style=getComputedStyle(dropdown);
            const canScroll=dropdown.scrollHeight>dropdown.clientHeight;
            dropdown.scrollTop=190;
            position(anchor);
            const retained=dropdown.scrollTop;
            dropdown.dispatchEvent(new Event('touchstart',{bubbles:true}));
            dropdown.style.top='77px';
            position(anchor);
            const top=dropdown.style.top;
            dropdown.dispatchEvent(new Event('touchend',{bubbles:true}));
            return {canScroll,retained,top,touchAction:style.touchAction,overscroll:style.overscrollBehaviorY};
          }finally{
            dropdown.innerHTML=old;
            if(oldStyle===null)dropdown.removeAttribute('style');else dropdown.setAttribute('style',oldStyle);
            dropdown.classList.remove('open');
          }
        });
        assert.equal(scroller.canScroll,true,`${delivery}/${name} location list cannot scroll`);
        assert.ok(scroller.retained>150,`${delivery}/${name} location list scroll jumps`);
        assert.equal(scroller.top,'77px',`${delivery}/${name} location list repositions during touch`);
        assert.equal(scroller.touchAction,'pan-y',`${delivery}/${name} native pan-y disabled`);
        assert.equal(scroller.overscroll,'contain',`${delivery}/${name} location scroll leaks to map`);
        // Card camera must fly once per actual location change and leave
        // manually moved map views undisturbed on later state refreshes.
        const travel=await page.evaluate(()=>{
          const card=window.aboutCard;
          if(typeof card._syncReferenceMap!=='function')throw Error('Map reference sync missing');
          const prev={map:card._map,option:card._mapReferenceOption,signature:card._mapReferenceSignature,
            marker:card._homeMarker,obs:card._radiusCircle,storm:card._stormCircle,danger:card._dangerCircle};
          const calls=[];
          let center={lat:53.8,lng:9.9};
          const map={getZoom:()=>8,getCenter:()=>center,
            flyTo:(destination,zoom,options)=>calls.push({kind:'fly',destination,zoom,options}),
            setView:(destination,zoom,options)=>calls.push({kind:'jump',destination,zoom,options})};
          const tokyo={option:'tokyo',lat:35.6762,lon:139.6503,label:'Tokyo',available:true};
          try{
            card._map=map;card._homeMarker=card._radiusCircle=card._stormCircle=card._dangerCircle=null;
            card._mapReferenceOption='kaltenkirchen';
            card._syncReferenceMap(tokyo);
            const first=[...calls];
            card._syncReferenceMap(tokyo);
            const refresh=calls.length;
            center={lat:48.85,lng:2.35};
            card._syncReferenceMap(tokyo);
            const userPan=calls.length;
            center={lat:35.6762,lng:139.6503};
            card._syncReferenceMap({...tokyo,option:'another-tokyo'});
            return {first,refresh,userPan,sameCoordinates:calls.length};
          }finally{
            card._map=prev.map;card._mapReferenceOption=prev.option;
            card._mapReferenceSignature=prev.signature;card._homeMarker=prev.marker;
            card._radiusCircle=prev.obs;card._stormCircle=prev.storm;card._dangerCircle=prev.danger;
          }
        });
        assert.equal(travel.first.length,1,`${delivery}/${name} destination needs one camera movement`);
        assert.equal(travel.first[0].kind,'fly',`${delivery}/${name} map snapped instead of flying`);
        assert.deepEqual(travel.first[0].destination,[35.6762,139.6503]);
        assert.equal(travel.first[0].zoom,8,`${delivery}/${name} original zoom must be retained`);
        assert.ok(travel.first[0].options.duration>=2.5,`${delivery}/${name} no long-haul flight`);
        assert.equal(travel.refresh,1,`${delivery}/${name} refresh restarted flight`);
        assert.equal(travel.userPan,1,`${delivery}/${name} refresh undid manual movement`);
        assert.equal(travel.sameCoordinates,1,`${delivery}/${name} unchanged coordinate repeated flight`);
        // HA may publish a new saved place before the awaited service returns.
        // No automatic camera flight must interrupt the older flyToBounds path.
        const handoffResult=await page.evaluate(()=>{
          const card=window.aboutCard;
          const previous={
            map:card._map,option:card._mapReferenceOption,signature:card._mapReferenceSignature,
            handoff:card._referenceFlightHandoff,marker:card._homeMarker,
            radius:card._radiusCircle,storm:card._stormCircle,danger:card._dangerCircle
          };
          const calls=[];
          try{
            card._map={
              getCenter:()=>({lat:53.8,lng:9.9}),getZoom:()=>8,
              flyTo:(...args)=>calls.push({method:'flyTo',args}),
              setView:(...args)=>calls.push({method:'setView',args})
            };
            card._homeMarker=card._radiusCircle=card._stormCircle=card._dangerCircle=null;
            card._mapReferenceOption='kaltenkirchen';
            card._referenceFlightHandoff={
              id:123,lat:35.6762,lon:139.6503,phase:'service',
              until:Date.now()+6000
            };
            card._syncReferenceMap({option:'tokyo',lat:35.6762,lon:139.6503,label:'Tokyo',available:true});
            const duringService={count:calls.length,option:card._mapReferenceOption};
            card._referenceFlightHandoff.phase='flying';
            card._syncReferenceMap({option:'tokyo-2',lat:35.6762,lon:139.6503,label:'Tokyo',available:true});
            const duringOriginalFlight=calls.length;
            card._referenceFlightHandoff=null;
            card._syncReferenceMap({option:'osaka',lat:34.6937,lon:135.5023,label:'Osaka',available:true});
            return {duringService,duringOriginalFlight,afterRelease:calls.map(x=>x.method)};
          }finally{
            card._map=previous.map;
            card._mapReferenceOption=previous.option;
            card._mapReferenceSignature=previous.signature;
            card._referenceFlightHandoff=previous.handoff;
            card._homeMarker=previous.marker;card._radiusCircle=previous.radius;
            card._stormCircle=previous.storm;card._dangerCircle=previous.danger;
          }
        });
        assert.deepEqual(handoffResult.duringService,{count:0,option:'tokyo'},
          `${delivery}/${name} automatic flyTo interrupted saved-place service`);
        assert.equal(handoffResult.duringOriginalFlight,0,
          `${delivery}/${name} reference sync overrode saved-place flyToBounds`);
        assert.deepEqual(handoffResult.afterRelease,['flyTo'],
          `${delivery}/${name} ordinary location flight missing after handoff`);
        await context.close();
      }
    }
    console.log('PASS: actual horizontal Settings animations on Android and desktop, both deliveries, all three speeds, both directions: snapshots and footer remain visible and aligned.');
  } finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;server.close();});
