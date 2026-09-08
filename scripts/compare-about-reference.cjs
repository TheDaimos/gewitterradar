// Comparison artifacts only: never transforms a production asset or a reference file.
const sharp=require('sharp');
const fs=require('node:fs');
const path=require('node:path');
const reference=process.argv[2], directory=process.argv[3];
const target={dialog:[7,4,718,869],header:[8,5,716,114],logo:[21,18,84,84],closeVisual:[690,15,27,27],dedication:[18,119,697,114],welcome:[18,240,697,84],radii:[18,330,697,154],network:[18,491,697,83],recorder:[18,580,697,175],accordion:[18,761,697,47],footer:[18,815,697,54]};
(async()=>{
  const actual=JSON.parse(fs.readFileSync(path.join(directory,'about-results.json'),'utf8')).find(row=>row.name==='reference');
  const rows=Object.entries(target).map(([name,expected])=>({name,target:expected,actual:['x','y','width','height'].map(key=>actual[name][key]),delta:['x','y','width','height'].map((key,index)=>+(actual[name][key]-expected[index]).toFixed(2))}));
  fs.writeFileSync(path.join(directory,'anchor-comparison.json'),JSON.stringify({referenceViewport:[732,879],rasterMeasurementTolerancePx:2,rows},null,2));
  const heading=Buffer.from('<svg width="1464" height="30"><rect width="1464" height="30" fill="#15202a"/><g fill="#f2d699" font-family="Arial" font-size="14"><text x="16" y="20">SOLL · supplied TARGET</text><text x="748" y="20">IST · real browser render</text></g></svg>');
  await sharp({create:{width:1464,height:909,channels:4,background:'#071019'}}).composite([{input:heading,left:0,top:0},{input:reference,left:0,top:30},{input:path.join(directory,'about-reference.png'),left:732,top:30}]).png().toFile(path.join(directory,'target-browser-comparison.png'));
  console.log(JSON.stringify(rows.map(row=>({anchor:row.name,delta:row.delta}))));
})().catch(error=>{console.error(error);process.exitCode=1;});
