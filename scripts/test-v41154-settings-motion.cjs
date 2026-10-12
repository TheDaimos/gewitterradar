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
            const s=window.aboutCard.shadowRoot.querySelector('select[aria-label="Geschwindigkeit des Seitenwechsels"]');
            assertSpeedControl(s,value);
            s.value=value;s.dispatchEvent(new Event('change',{bubbles:true}));
            function assertSpeedControl(node,key){if(!node)throw Error('Missing speed control '+key);}
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
                snapshotSpeed:pane.querySelector('select[aria-label="Geschwindigkeit des Seitenwechsels"]')?.value || null,
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
        await context.close();
      }
    }
    console.log('PASS: actual horizontal Settings animations on Android and desktop, both deliveries, all three speeds, both directions: snapshots and footer remain visible and aligned.');
  } finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;server.close();});
