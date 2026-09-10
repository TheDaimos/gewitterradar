// Run with Playwright available in NODE_PATH and an installed Chromium executable.
const {chromium}=require('playwright');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
// Windows clipboard exposes CRLF even when writeText receives LF. Preserve
// every YAML character/indent; normalize only the platform line separator.
const clipboardLF=text=>text.replace(/\r\n/g,'\n');
const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file=path.resolve(root,'.'+pathname);
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(file,(error,data)=>{if(error){res.writeHead(404).end();return;}
    res.setHeader('Content-Type',({'.js':'text/javascript','.mjs':'text/javascript','.html':'text/html','.png':'image/png','.webp':'image/webp'})[path.extname(file)]||'text/plain');res.end(data);
  });
});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({executablePath:process.argv[2],headless:true});
  const base=`http://127.0.0.1:${server.address().port}`;
  const results=[];
  const delivery=process.env.ABOUT_DELIVERY||'dashboard';
  try{
    const visualOnly=process.env.ABOUT_VISUAL_ONLY==='1';
    const profiles=[['reference',732,879,false],...(!visualOnly?[['desktop',1440,1000,false],['ipad-closed',1024,768,true],['ipad-open',784,768,true],['ipad-portrait',768,1024,true],['ipad-pro',1366,1024,true],['android-portrait',412,915,true],['android-landscape',915,412,true]]:[])];
    for(const [name,width,height,hasTouch] of profiles){
      const context=await browser.newContext({viewport:{width,height},hasTouch,permissions:['clipboard-read','clipboard-write']});
      const page=await context.newPage();
      await page.goto(`${base}/scripts/about-onboarding-harness.html?scenario=first&delivery=${delivery}`,{waitUntil:'domcontentloaded'});
      await page.waitForFunction(()=>window.aboutResult);
      const result=await page.evaluate(()=>window.aboutResult);
      if(result.status!=='PASS')throw Error(`${name}: ${JSON.stringify(result)}`);
      await page.locator('.about-head>img').evaluate(img=>img.decode());
      await page.locator('.about-close img,.about-copy img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
      const refinement=await page.evaluate(async()=>{
        const d=window.aboutCard._aboutDialog,style=(n,pseudo)=>getComputedStyle(n,pseudo);
        const subtitle=d.querySelector('[data-about-text="subtitle"]'),header=d.querySelector('header');
        const claim=d.querySelector('.about-claim'),claimBox=claim.getBoundingClientRect(),headerBox=header.getBoundingClientRect();
        const intersects=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
        const headerTextBoxes=[...d.querySelectorAll('.about-head-copy h2,.about-head-copy p')].flatMap(n=>{const range=document.createRange();range.selectNodeContents(n);return [...range.getClientRects()];});
        const claimClear=!headerTextBoxes.some(box=>intersects(claimBox,box))&&!intersects(claimBox,d.querySelector('.about-close').getBoundingClientRect());
        const hero=new Image();hero.src=style(header).backgroundImage.match(/url\(["']?([^"')]+)/)[1];await hero.decode();
        const heroSize=style(header).backgroundSize.split(',').at(-1).trim().split(/\s+/);
        // A single size implies auto height; cover/contain are separate sizing modes.
        const heroHeightSize=heroSize.length===1
          ? (heroSize[0]==='cover'||heroSize[0]==='contain'?null:'auto')
          : heroSize[1];
        const scale=header.clientWidth*parseFloat(heroSize[0])/100/hero.naturalWidth;
        const crop=(header.clientHeight-hero.naturalHeight*scale)*parseFloat(style(header).backgroundPositionY.split(',').at(-1))/100;
        // Measured church silhouette in the unchanged 1536x1024 master.
        const church={top:530*scale+crop,bottom:675*scale+crop,headerHeight:header.clientHeight};
        const numbers=[...d.querySelectorAll('.about-line-numbers span')],lines=[...d.querySelectorAll('pre code>span')];
        const lineAlignment=numbers.length===lines.length&&numbers.every((n,i)=>Math.abs(n.getBoundingClientRect().top-lines[i].getClientRects()[0].top)<2);
        const benefit=d.querySelector('[data-about-text="recorderBenefit"]');
        let offset=0;
        const benefitLines=benefit.textContent.split('\n').map(text=>{const range=document.createRange();range.setStart(benefit.firstChild,offset);range.setEnd(benefit.firstChild,offset+text.length);offset+=text.length+1;return range.getClientRects().length;});
        return {
          claimClear,claimFont:parseFloat(style(claim).fontSize),claimUnboxed:style(claim).backgroundImage==='none'&&style(claim).backgroundColor==='rgba(0, 0, 0, 0)'&&style(claim).boxShadow==='none',claimContained:claimBox.top>=headerBox.top&&claimBox.bottom<=headerBox.bottom&&claimBox.left>=headerBox.left&&claimBox.right<=headerBox.right,
          lineNumbers:numbers.map(n=>n.textContent),lineAlignment,benefitLines,
          subtitle:subtitle.textContent,quote:d.querySelector('[data-about-text="quote"]').textContent,claim:d.querySelector('[data-about-text="claim"]').textContent,
          headerSizing:style(header).backgroundSize,heroRatioPreserved:heroHeightSize==='auto',church,subtitleFits:subtitle.getBoundingClientRect().bottom<=header.getBoundingClientRect().bottom,
          ringColors:[...d.querySelectorAll('.about-radar>circle')].slice(0,3).map(n=>n.getAttribute('stroke')),
          legendColors:[...d.querySelectorAll('.about-radius')].map(n=>style(n).getPropertyValue('--radius-color').trim()),
          smallHeart:d.querySelectorAll('.about-small-heart').length,handwriting:d.querySelectorAll('.about-handwriting path').length,
          largeHeartGlow:style(d.querySelector('.about-heart')).filter,outerMetal:style(d,'::before').backgroundImage
        };
      });
      if(refinement.subtitle!=='Für Wetterbegeisterte, die Blitzaktivität klar und verständlich verfolgen möchten.'||refinement.quote!=='Gewitter machen sichtbar, wie kraftvoll Atmosphäre sein kann.'||refinement.claim!=='Gewitter beobachten, Entwicklungen entdecken.')throw Error('Refinement copy differs from approved text');
      if(!refinement.heroRatioPreserved||!refinement.subtitleFits)throw Error(`${name}: header sizing/wrapping regression`);
      if(!refinement.claimClear||!refinement.claimContained||refinement.claimFont<9)throw Error(`${name}: slogan legibility or overlap regression`);
      if(!refinement.claimUnboxed)throw Error(`${name}: slogan regained a visible tile background`);
      if(refinement.church.top<0||refinement.church.bottom>refinement.church.headerHeight)throw Error(`${name}: church silhouette cropped out`);
      if(refinement.lineNumbers.join()!=='1,2,3,4,5,6,7,8'||!refinement.lineAlignment)throw Error(`${name}: YAML line number alignment failed`);
      if(refinement.benefitLines.join()!=='1,1,1')throw Error(`${name}: warning text wraps outside its three intentional lines`);
      if(refinement.ringColors.join()!=='#d9b45e,#79b8e7,#c4483b'||refinement.legendColors.join()!=='#d9b45e,#79b8e7,#d74d43')throw Error('Radius GOLD/BLUE/RED semantic mapping regressed');
      if(refinement.smallHeart!==1||refinement.handwriting<1||!refinement.largeHeartGlow.includes('drop-shadow'))throw Error('Handwritten dedication refinement missing');
      if(!refinement.outerMetal.includes('linear-gradient'))throw Error('Reflective dialog frame missing');
      const geometry=await page.evaluate(()=>{
        const d=window.aboutCard._aboutDialog,c=d.querySelector('.about-content');c.scrollTop=0;
        const rect=n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom};};
        return {dialog:rect(d),header:rect(d.querySelector('header')),logo:rect(d.querySelector('header img')),title:rect(d.querySelector('h2')),closeTouch:rect(d.querySelector('.about-close')),closeVisual:rect(d.querySelector('.about-close span')),dedication:rect(d.querySelector('.about-dedication')),welcome:rect(d.querySelector('.about-welcome')),radii:rect(d.querySelector('.about-radii')),network:rect(d.querySelector('.about-network')),recorder:rect(d.querySelector('.about-recorder')),accordion:rect(d.querySelector('.about-entities')),footer:rect(d.querySelector('footer')),contentHeight:c.clientHeight,contentScrollHeight:c.scrollHeight,overflow:d.scrollWidth>d.clientWidth||c.scrollWidth>c.clientWidth};
      });
      if(geometry.overflow||geometry.dialog.x<0||geometry.dialog.bottom>height+.5)throw Error(`${name}: overflow ${JSON.stringify(geometry)}`);
      if(geometry.closeTouch.width<44||geometry.closeTouch.height<44||geometry.closeVisual.width>30)throw Error('Close visual/touch target mismatch');
      const controls=await page.evaluate(()=>{
        const d=window.aboutCard._aboutDialog;
        return [...d.querySelectorAll('.about-close,.about-copy')].map(button=>{
          const img=button.querySelector('img'),r=button.getBoundingClientRect(),i=img.getBoundingClientRect();
          return {label:button.getAttribute('aria-label'),hit:[r.width,r.height],visible:img.complete&&img.naturalWidth===256&&i.width>0&&i.height>0,contained:i.left>=r.left&&i.right<=r.right&&i.top>=r.top&&i.bottom<=r.bottom,ratio:i.width/i.height};
        });
      });
      if(controls.length!==2||controls.some(c=>!c.label||c.hit.some(v=>v<44)||!c.visible||!c.contained||Math.abs(c.ratio-1)>.001))throw Error(name+': premium image/hit-area regression '+JSON.stringify(controls));
      if((await page.locator('.about-dev').innerText()).includes('DEV'))throw Error('Stable label still contains DEV');
      if(!visualOnly){
        // Exercise real user inputs and return-focus instead of calling the close handler directly.
        await page.locator('.about-close').click();
        if(await page.locator('.about-dialog').count())throw Error('Close click failed');
        await page.locator('#settings-open').click();
        await page.locator('#settings-about').click();
        await page.keyboard.press('Enter');
        if(await page.locator('.about-dialog').count())throw Error('Close keyboard activation failed');
        if(!await page.evaluate(()=>window.aboutCard.shadowRoot.activeElement===window.aboutCard.shadowRoot.querySelector('#settings-about')))throw Error('Close return focus failed');
        await page.locator('#settings-close').click();
        await page.evaluate(()=>window.aboutCard._openAbout());
        if(hasTouch){await page.locator('.about-close').tap();if(await page.locator('.about-dialog').count())throw Error('Close touch failed');await page.evaluate(()=>window.aboutCard._openAbout());}
        await page.locator('.about-copy').click();
        await page.waitForFunction(()=>window.aboutCard._aboutDialog.querySelector('.about-copy-status').textContent==='Kopiert');
        const copied=await page.evaluate(()=>navigator.clipboard.readText());
        const shown=await page.locator('.about-code-wrap code').textContent();
        if(clipboardLF(copied)!==shown)throw Error(`Clipboard YAML differs from displayed YAML: ${JSON.stringify({copied,shown})}`);
        await page.evaluate(()=>{
          window.aboutCard._aboutDialog.querySelector('.about-copy-status').textContent='';
          Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:()=>Promise.reject(Error('simulated denied clipboard'))}});
        });
        await page.locator('.about-copy').click();
        await page.waitForFunction(()=>window.aboutCard._aboutDialog.querySelector('.about-copy-status').textContent==='Kopiert');
        if(await page.locator('.about-dialog textarea').count())throw Error('Clipboard fallback leaked textarea');
        await page.evaluate(()=>delete navigator.clipboard);
        if(clipboardLF(await page.evaluate(()=>navigator.clipboard.readText()))!==shown)throw Error('Fallback clipboard YAML differs from displayed YAML');
      }
      if(hasTouch)await page.locator('.about-entities summary').tap();
      else await page.locator('.about-entities summary').click();
      if(!await page.locator('.about-entities').evaluate(d=>d.open))throw Error('touch accordion failed');
      await page.keyboard.press('Escape');
      if(await page.locator('.about-dialog').count())throw Error('Escape did not clean up');
      await page.locator('#settings-open').click();
      const diagnosticSection=page.locator('#settings-diagnostic-section');
      const diagnosticSummary=diagnosticSection.locator(':scope > summary');
      if(hasTouch)await diagnosticSummary.tap();else await diagnosticSummary.click();
      if(!await diagnosticSection.evaluate(node=>node.open))throw Error(`${name}: settings accordion did not open`);
      const settingsRefinement=await page.evaluate(()=>{
        const shadow=window.aboutCard.shadowRoot,rect=node=>{const r=node.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height};};
        const textRect=node=>{const range=document.createRange();range.selectNodeContents(node);const boxes=[...range.getClientRects()];range.detach();if(!boxes.length)return rect(node);const left=Math.min(...boxes.map(box=>box.left)),top=Math.min(...boxes.map(box=>box.top)),right=Math.max(...boxes.map(box=>box.right)),bottom=Math.max(...boxes.map(box=>box.bottom));return {left,top,right,bottom,width:right-left,height:bottom-top};};
        const dialog=shadow.getElementById('settings-dialog'),body=dialog.querySelector('.settings-body'),section=shadow.getElementById('settings-diagnostic-section'),content=section.querySelector(':scope > .settings-section-content');
        const level1=textRect(shadow.getElementById('settings-diagnostic-section-title'));
        const level2=[...content.querySelectorAll(':scope > .settings-row-label')].map(node=>textRect(node));
        const rows=[...content.querySelectorAll(':scope > .settings-row')],level3=rows.map(row=>textRect(row.querySelector('.settings-row-label')));
        const toggles=rows.map(row=>row.querySelector('.settings-switch')).filter(Boolean).map(node=>rect(node));
        const testGrid=content.querySelector(':scope > .settings-test-grid'),testGridRect=rect(testGrid),testButtons=[...testGrid.querySelectorAll('button')].map(node=>rect(node));
        const about=shadow.getElementById('settings-about'),info=about.querySelector(':scope > span[aria-hidden="true"]'),infoStyle=getComputedStyle(info);
        const containers=[dialog,body,section,content,testGrid];
        return {dialog:rect(dialog),section:rect(section),content:rect(content),level1,level2,level3,toggles,testGrid:testGridRect,testButtons,about:rect(about),info:rect(info),infoFontSize:parseFloat(infoStyle.fontSize),infoBackground:infoStyle.backgroundImage,infoFilter:infoStyle.filter,horizontalOverflow:containers.some(node=>node.scrollWidth>node.clientWidth+1)};
      });
      const level2Left=Math.min(...settingsRefinement.level2.map(rect=>rect.left)),level3Left=Math.min(...settingsRefinement.level3.map(rect=>rect.left));
      const toggleRights=settingsRefinement.toggles.map(rect=>rect.right),toggleSpread=Math.max(...toggleRights)-Math.min(...toggleRights);
      if(level2Left<settingsRefinement.level1.left+4||level3Left<level2Left+4)throw Error(`${name}: diagnostic hierarchy indentation failed ${JSON.stringify({level1:settingsRefinement.level1.left,level2Left,level3Left})}`);
      if(toggleSpread>.5)throw Error(`${name}: settings toggle alignment shifted by ${toggleSpread}px`);
      if(settingsRefinement.horizontalOverflow||settingsRefinement.testButtons.some(button=>button.width<80||button.left<settingsRefinement.content.left-1||button.right>settingsRefinement.content.right+1))throw Error(`${name}: settings overflow or unusable test buttons ${JSON.stringify(settingsRefinement)}`);
      if(settingsRefinement.about.height<44||settingsRefinement.info.width<23.5||settingsRefinement.info.height<23.5||settingsRefinement.infoFontSize<20||settingsRefinement.infoBackground==='none')throw Error(`${name}: premium About icon regression ${JSON.stringify(settingsRefinement)}`);
      const aboutButton=page.locator('#settings-about'),aboutBoxBefore=await aboutButton.boundingBox();
      let hoverFilter=null,pressedFilter=null,pressedBox=null;
      if(!hasTouch){
        await aboutButton.hover();hoverFilter=await aboutButton.locator(':scope > span[aria-hidden="true"]').evaluate(node=>getComputedStyle(node).filter);
        await page.mouse.down();
        await page.waitForTimeout(180);
        pressedFilter=await aboutButton.locator(':scope > span[aria-hidden="true"]').evaluate(node=>getComputedStyle(node).filter);
        pressedBox=await aboutButton.boundingBox();
        await page.mouse.move(aboutBoxBefore.x+aboutBoxBefore.width-2,aboutBoxBefore.y+aboutBoxBefore.height+8);
        await page.mouse.up();
      }
      await page.locator('#settings-close').focus();await page.keyboard.press('Tab');
      const focusState=await aboutButton.locator(':scope > span[aria-hidden="true"]').evaluate(node=>({outline:getComputedStyle(node).outlineStyle,outlineWidth:getComputedStyle(node).outlineWidth,focusVisible:node.parentElement.matches(':focus-visible'),activeId:node.getRootNode().activeElement?.id,aboutOpen:!!node.getRootNode().querySelector('.about-dialog')}));
      const aboutBoxAfter=await aboutButton.boundingBox();
      if(!focusState.focusVisible||focusState.outline==='none'||parseFloat(focusState.outlineWidth)<2)throw Error(`${name}: About focus-visible indicator missing ${JSON.stringify(focusState)}`);
      if(['x','y','width','height'].some(key=>Math.abs(aboutBoxBefore[key]-aboutBoxAfter[key])>.01))throw Error(`${name}: About hover/focus layout shift`);
      if(!hasTouch&&hoverFilter===settingsRefinement.infoFilter)throw Error(`${name}: About hover reflection missing`);
      if(!hasTouch&&(pressedFilter===hoverFilter||['x','y','width','height'].some(key=>Math.abs(aboutBoxBefore[key]-pressedBox[key])>.01)))throw Error(`${name}: About pressed state missing or unstable`);
      settingsRefinement.level2Indent=level2Left-settingsRefinement.section.left;
      settingsRefinement.level3Indent=level3Left-settingsRefinement.section.left;
      settingsRefinement.toggleSpread=toggleSpread;
      settingsRefinement.focusState=focusState;
      settingsRefinement.hoverFilter=hoverFilter;
      settingsRefinement.pressedFilter=pressedFilter;
      if(process.argv[3]&&['desktop','ipad-portrait','android-portrait'].includes(name))await page.screenshot({path:path.join(process.argv[3],`settings-${name}-diagnostics.png`)});
      if(hasTouch)await diagnosticSummary.tap();else await diagnosticSummary.click();
      if(await diagnosticSection.evaluate(node=>node.open))throw Error(`${name}: settings accordion did not close`);
      await page.locator('#settings-close').click();
      await page.evaluate(()=>window.aboutCard._openAbout());
      await page.keyboard.press('Shift+Tab');
      const focusInside=await page.evaluate(()=>window.aboutCard._aboutDialog.contains(window.aboutCard.shadowRoot.activeElement));
      if(!focusInside)throw Error('focus escaped modal');
      await page.locator('.about-head h2').click();
      if(process.argv[3]){
        await page.screenshot({path:path.join(process.argv[3],`about-${name}.png`)});
        if(!visualOnly&&['desktop','android-portrait','android-landscape'].includes(name)){
          await page.locator('.about-recorder').evaluate(n=>n.scrollIntoView({block:'start'}));
          await page.screenshot({path:path.join(process.argv[3],`about-${name}-recorder.png`)});
          const textGap=await page.locator('.about-recorder').evaluate(n=>n.querySelector('.about-recorder-intro').getBoundingClientRect().top-n.querySelector('h3').getBoundingClientRect().bottom);
          if(textGap<0)throw Error(`${name}: Recorder heading overlaps introduction by ${-textGap}px`);
          await page.locator('.about-entities summary').click();
          await page.locator('.about-entities').evaluate(n=>n.scrollIntoView({block:'start'}));
          await page.screenshot({path:path.join(process.argv[3],`about-${name}-entities.png`)});
        }
      }
      results.push({name,delivery,controls,status:'PASS',refinement,settingsRefinement,...geometry});
      console.log(`${name}: PASS`);
      await context.close();
    }
    if(visualOnly){fs.writeFileSync(path.join(process.argv[3],'about-results.json'),JSON.stringify(results,null,2));return;}
    const context=await browser.newContext();const page=await context.newPage();
    for(const scenario of ['first','seen','older','future','preview']){
      await page.goto(`${base}/scripts/about-onboarding-harness.html?scenario=${scenario}&delivery=${delivery}`);
      await page.waitForFunction(()=>window.aboutResult);
      const result=await page.evaluate(()=>window.aboutResult);
      if(result.status!=='PASS')throw Error(JSON.stringify(result));results.push(result);
    }
    await page.goto(`${base}/scripts/frontend-layout-harness.html?delivery=${delivery}`);
    await page.waitForFunction(()=>!document.querySelector('#result').textContent.includes('running'),{},{timeout:120000});
    const regression=await page.locator('#result').textContent();
    if(process.argv[3])fs.writeFileSync(path.join(process.argv[3],'frontend-regression.json'),regression);
    if(!(await page.title()).startsWith('PASS '))throw Error(`Existing harness: ${regression.slice(0,1500)}`);
    results.push({existingFrontendHarness:'PASS'});
    console.log('PASS: all viewports, five onboarding scenarios and complete protected frontend harness.');
    if(process.argv[3])fs.writeFileSync(path.join(process.argv[3],'about-results.json'),JSON.stringify(results,null,2));
  }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
