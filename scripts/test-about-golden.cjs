// Compare frozen V4.05 with independently scoped Recorder and About finalization adjustments.
const {chromium}=require('playwright'),sharp=require('sharp'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=path.join(root,'artwork/acceptance/premium-controls/golden');fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');let name=url.pathname;
 if(name.startsWith('/tests/fixtures/v4_05/assets/'))name=name.replace('/tests/fixtures/v4_05/assets/','/frontend/assets/');
 const file=path.resolve(root,'.'+name);if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(file,(error,data)=>{if(error){res.writeHead(404).end();return;}
  if(name.endsWith('about-onboarding-harness.html')&&url.searchParams.has('golden'))data=Buffer.from(data.toString().replace(/await import\([^;]+;/,"await import('../tests/fixtures/v4_05/gewitterradar.js');"));
  res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.webp':'image/webp','.png':'image/png'})[path.extname(file)]||'text/plain');res.end(data);
 });
});
async function captureGeometry(page){return page.evaluate(async()=>{
     const d=window.aboutCard._aboutDialog;d.querySelector('.about-content').scrollTop=0;
     await Promise.all([...d.querySelectorAll('img')].map(img=>img.decode()));
     for(const n of [d.querySelector('.about-head'),d.querySelector('.about-dedication'),d.querySelector('.about-forest')]){const urls=[...getComputedStyle(n).backgroundImage.matchAll(/url\("([^"]+)"\)/g)];await Promise.all(urls.map(m=>{const img=new Image();img.src=m[1];return img.decode();}));}
     const selectors=['.about-head','.about-head>img','.about-head-copy','h2','.about-claim','.about-close','.about-close span','.about-dedication','.about-heart','.about-signature','.about-welcome','.about-radii','.about-network','.about-recorder','.about-copy','.about-entities','.about-footer'];
     return Object.fromEntries(selectors.map(s=>{const r=d.querySelector(s).getBoundingClientRect();return [s,[r.x,r.y,r.width,r.height]];}));
    });
}
function assertReferenceScope(original,adjusted,profile){
 const recorder='.about-recorder',entities='.about-entities';
 for(const selector of Object.keys(original)){
  if(selector!==recorder&&selector!==entities)
   assert.deepEqual(adjusted[selector],original[selector],`${profile}: reference changed ${selector}`);
 }
 assert.deepEqual(adjusted[recorder].slice(0,3),original[recorder].slice(0,3),`${profile}: reference moved/resized Recorder`);
 const heightDelta=adjusted[recorder][3]-original[recorder][3];
 assert.ok(heightDelta<=0,`${profile}: reference increased Recorder height by ${heightDelta}`);
 for(const index of [0,2,3])assert.equal(adjusted[entities][index],original[entities][index],`${profile}: reference changed Entities dimension ${index}`);
 assert.equal(adjusted[entities][1]-original[entities][1],heightDelta,`${profile}: reference Entities flow mismatch`);
}
async function prepareRecorderFontReference(page){
 const state=await page.evaluate(()=>{
  const dialog=window.aboutCard._aboutDialog,targets=dialog.querySelectorAll('.about-code-wrap code');
  if(targets.length!==1)throw Error('Expected exactly one Recorder code element');
  const code=targets[0],pre=code.parentElement;
  if(pre.tagName!=='PRE')throw Error('Recorder code must be a direct PRE child');
  const snapshot=()=>({html:code.innerHTML,codeStyle:code.getAttribute('style'),fontFamily:getComputedStyle(code).fontFamily,preFontFamily:getComputedStyle(pre).fontFamily,
   protectedStyles:[pre,code,...code.children].map(node=>Object.fromEntries(['display','fontSize','lineHeight','whiteSpace','verticalAlign','padding','margin'].map(key=>[key,getComputedStyle(node)[key]])))});
  const before=snapshot();
  // The frozen source has no author font declaration on CODE. Its UA monospace
  // family may already equal PRE on some platforms; otherwise require that anchor.
  if(before.fontFamily!==before.preFontFamily&&before.fontFamily!=='monospace')throw Error('Unexpected frozen Recorder font anchor: '+before.fontFamily);
  if(code.style.fontFamily)throw Error('Frozen Recorder already has an inline font override');
  code.style.fontFamily='inherit';
  const after=snapshot();
  return {before,after};
 });
 assert.equal(state.after.fontFamily,state.after.preFontFamily,'Reference Recorder did not inherit PRE font');
 assert.equal(state.after.preFontFamily,state.before.preFontFamily,'Reference changed PRE font');
 assert.equal(state.after.html,state.before.html,'Reference changed Recorder DOM/newlines');
 assert.deepEqual(state.after.protectedStyles,state.before.protectedStyles,'Reference changed protected Recorder styles');
}
// Independent reference adjustment for the two approved About finalization changes.
async function prepareAboutFinalReference(page){
 const before=await captureGeometry(page);
 await page.evaluate(()=>{
  const d=window.aboutCard._aboutDialog,info=d.querySelector('[data-about-text="radiusInfo"]');
  const original='Die Radien helfen, Gewitter frühzeitig einzuschätzen und die aktuelle Situation schnell und übersichtlich zu beurteilen.';
  if(info.textContent!==original)throw Error('Unexpected frozen radius explanation');
  info.textContent=original+' Die Radien bauen aufeinander auf: Ein Blitz im Gefahrenradius zählt zugleich zum Gewitter- und Beobachtungsradius.';
  const css=document.createElement('style');
  css.textContent='@media(max-width:620px){.about-dedication-copy p{max-width:60%}}';
  d.append(css);
 });
 const after=await captureGeometry(page),dedicationDelta=after['.about-dedication'][3]-before['.about-dedication'][3],radiiDelta=after['.about-radii'][3]-before['.about-radii'][3];
 assert.ok(dedicationDelta>=0&&radiiDelta>=0,'Reference unexpectedly shrank a section');
 if(page.viewportSize().width>620)assert.equal(dedicationDelta,0,'Desktop/tablet dedication changed');
 const downstream=new Set(['.about-network','.about-recorder','.about-copy','.about-entities']);
 for(const selector of Object.keys(before)){
  for(const i of [0,2])assert.equal(after[selector][i],before[selector][i],'Reference horizontal drift: '+selector);
  if(selector==='.about-dedication'||selector==='.about-radii')continue;
  assert.ok(Math.abs(after[selector][3]-before[selector][3])<=0.001,'Reference height drift: '+selector);
  if(selector==='.about-heart'||selector==='.about-signature')continue;
  const shift=downstream.has(selector)?dedicationDelta+radiiDelta:['.about-welcome'].includes(selector)?dedicationDelta:0;
  assert.equal(after[selector][1],before[selector][1]+shift,'Reference flow drift: '+selector);
 }
 assert.equal(after['.about-dedication'][1],before['.about-dedication'][1]);
 assert.equal(after['.about-radii'][1],before['.about-radii'][1]+dedicationDelta);
}
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({executablePath:process.argv[2],headless:true});const results=[];
 try{
  for(const [name,width,height,touch] of [['reference',732,879,false],['desktop',1440,1000,false],['ipad-closed',1024,768,true],['ipad-open',784,768,true],['ipad-portrait',768,1024,true],['ipad-pro',1366,1024,true],['android-portrait',412,915,true],['android-landscape',915,412,true]]){
   const samples=[];
   for(const golden of [true,false]){
    const context=await browser.newContext({viewport:{width,height},hasTouch:touch}),page=await context.newPage();
    await page.goto(`http://127.0.0.1:${server.address().port}/scripts/about-onboarding-harness.html?scenario=first${golden?'&golden=1':''}`);
    await page.waitForFunction(()=>window.aboutResult);assert.equal((await page.evaluate(()=>window.aboutResult)).status,'PASS');
    const frozenOriginalGeometry=await captureGeometry(page);
    let geometry=frozenOriginalGeometry;
    if(golden){
     await prepareRecorderFontReference(page);
     geometry=await captureGeometry(page);
     assertReferenceScope(frozenOriginalGeometry,geometry,name);
     await prepareAboutFinalReference(page);
     geometry=await captureGeometry(page);
    }
    const screenshot=await page.locator('.about-dialog').screenshot({animations:'disabled',mask:[page.locator('.about-close'),page.locator('.about-copy'),page.locator('.about-dev')]});
    if(name==='reference')fs.writeFileSync(path.join(out,golden?'v4.05-masked.png':'candidate-masked.png'),screenshot);
    samples.push({geometry,screenshot});await context.close();
   }
   assert.deepEqual(samples[1].geometry,samples[0].geometry,name+': protected geometry drift');
   const a=await sharp(samples[0].screenshot).raw().toBuffer({resolveWithObject:true}),b=await sharp(samples[1].screenshot).raw().toBuffer({resolveWithObject:true});assert.deepEqual(a.info,b.info);
   let changed=0;for(let i=0;i<a.data.length;i+=a.info.channels){if([...Array(a.info.channels).keys()].some(c=>Math.abs(a.data[i+c]-b.data[i+c])>8))changed++;}
   const ratio=changed/(a.info.width*a.info.height);assert.ok(ratio<=.001,`${name}: protected pixels differ ${ratio}`);
   results.push({name,status:'PASS',geometry:samples[1].geometry,changedPixels:changed,changedRatio:ratio});console.log(name+': golden geometry/pixels PASS');
  }
  fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2)+'\n');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
