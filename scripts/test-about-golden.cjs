// Compare the published V4.05 UI with the approved delta, masking only its three exceptions.
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
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({executablePath:process.argv[2],headless:true});const results=[];
 try{
  for(const [name,width,height,touch] of [['reference',732,879,false],['desktop',1440,1000,false],['ipad-closed',1024,768,true],['ipad-open',784,768,true],['ipad-portrait',768,1024,true],['ipad-pro',1366,1024,true],['android-portrait',412,915,true],['android-landscape',915,412,true]]){
   const samples=[];
   for(const golden of [true,false]){
    const context=await browser.newContext({viewport:{width,height},hasTouch:touch}),page=await context.newPage();
    await page.goto(`http://127.0.0.1:${server.address().port}/scripts/about-onboarding-harness.html?scenario=first${golden?'&golden=1':''}`);
    await page.waitForFunction(()=>window.aboutResult);assert.equal((await page.evaluate(()=>window.aboutResult)).status,'PASS');
    const geometry=await page.evaluate(async()=>{
     const d=window.aboutCard._aboutDialog;d.querySelector('.about-content').scrollTop=0;
     await Promise.all([...d.querySelectorAll('img')].map(img=>img.decode()));
     for(const n of [d.querySelector('.about-head'),d.querySelector('.about-dedication'),d.querySelector('.about-forest')]){const urls=[...getComputedStyle(n).backgroundImage.matchAll(/url\("([^"]+)"\)/g)];await Promise.all(urls.map(m=>{const img=new Image();img.src=m[1];return img.decode();}));}
     const selectors=['.about-head','.about-head>img','.about-head-copy','h2','.about-claim','.about-close','.about-close span','.about-dedication','.about-heart','.about-signature','.about-welcome','.about-radii','.about-network','.about-recorder','.about-copy','.about-entities','.about-footer'];
     return Object.fromEntries(selectors.map(s=>{const r=d.querySelector(s).getBoundingClientRect();return [s,[r.x,r.y,r.width,r.height]];}));
    });
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
