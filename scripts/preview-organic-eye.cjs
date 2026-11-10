// Local synthetic UI preview. User reference images/videos are never served.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {flowFixture}=require('./flow-curves-browser-fixture.cjs');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const out=path.join(os.tmpdir(),'gr-eye-organic-177');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const f=flowFixture();await new Promise(r=>f.server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 try{
  const mobile=process.env.GR_MENU_VIEW==='android',name=mobile?'android':'desktop';
  const page=await browser.newPage({viewport:mobile?{width:393,height:851}:{width:1280,height:1000},deviceScaleFactor:mobile?3:1,isMobile:mobile,hasTouch:mobile});
  page.on('pageerror',e=>console.error(e.message));await f.route(page);await page.goto('http://127.0.0.1:'+f.server.address().port);await page.waitForFunction(()=>window.ready&&card._map);
  await page.evaluate(()=>{for(const [id,v] of card._eyeHubState().registry.entries)card._eyeHubState().registry.entries.set(id,{...v,status:()=>({active:true,available:true})});card._eyeHubPatch({grouped:true,aura:true,size:126,intensity:100,brightness:100});card._eyeHubOpen();});
  for(const mode of ['static','living']){
   await page.evaluate(mode=>card._eyeHubPatch({glow:mode}),mode);await page.locator('[data-preview=closed]').scrollIntoViewIfNeeded();await page.waitForTimeout(1200);
   await page.locator('[data-preview=closed]').screenshot({path:path.join(out,name+'-'+mode+'.png')});await page.screenshot({path:path.join(out,name+'-'+mode+'-dialog.png')});
   if(mode==='living'){
    await page.waitForTimeout(350);await page.locator('[data-preview=closed]').screenshot({path:path.join(out,name+'-living-next.png')});
    const clip=await page.locator('[data-preview=closed] canvas.eye-neon').evaluate(async canvas=>{
     if(!globalThis.MediaRecorder||!canvas.captureStream)return null;
     const stream=canvas.captureStream(24),chunks=[],recorder=new MediaRecorder(stream,{mimeType:'video/webm'});
     const done=new Promise(resolve=>{recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};recorder.onstop=()=>{stream.getTracks().forEach(t=>t.stop());const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.readAsDataURL(new Blob(chunks,{type:'video/webm'}));};});recorder.start();await new Promise(r=>setTimeout(r,2300));recorder.stop();return done;
    });
    if(clip)fs.writeFileSync(path.join(out,name+'-corona-only.webm'),Buffer.from(clip,'base64'));
    console.log(JSON.stringify(await page.evaluate(()=>({metrics:card._eyeHubState().neon.metrics,surfaces:card._eyeHubState().neon.surfaces.map(s=>s.stats)}))));
   }
  }
  console.log(out);
 }finally{await browser.close();f.server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
