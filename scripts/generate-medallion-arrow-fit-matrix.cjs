#!/usr/bin/env node
'use strict';

const fs=require('fs');
const path=require('path');
const sharp=require('sharp');

const ROOT=path.resolve(__dirname,'..');
const ASSET_DIR=path.join(ROOT,'frontend','assets');
const OUT_DIR=path.join(ROOT,'artwork','acceptance','medallion-arrow-fit');
const BUILD='V4.10.02-MODULAR-DEV-R16-2026-09-27';
const CONFIG=Object.freeze({
  schema:'gewitterradar.medallion-arrow-geometry.v1',
  version:1,
  safeInsetRatio:0.04,
  rotationStepDeg:5,
  eyeAngleStepDeg:2,
  alphaThreshold:8,
  eyeSearchMinRatio:0.18,
  eyeSearchMaxRatio:0.45
});
const ARROW_PROFILE=Object.freeze({
  centerXPercent:50.012238,
  centerYPercent:50.452396,
  widthPercent:59.667391,
  heightPercent:59.667391
});

function medallionPath(number){
  if(number===1)return path.join(ASSET_DIR,'gewitterradar-trend-medallion.png');
  return path.join(ASSET_DIR,`gewitterradar-trend-medallion-${String(number).padStart(2,'0')}.webp`);
}
function arrowPath(number){
  if(number===0)return path.join(ASSET_DIR,'gewitterradar-trend-arrow.png');
  return path.join(ASSET_DIR,`gewitterradar-trend-arrow-${String(number).padStart(2,'0')}.webp`);
}
async function rawImage(file){
  const {data,info}=await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  return {width:info.width,height:info.height,pixels:data};
}
function pixel(image,x,y){
  const ix=Math.max(0,Math.min(image.width-1,Math.round(x)));
  const iy=Math.max(0,Math.min(image.height-1,Math.round(y)));
  const o=(iy*image.width+ix)*4,p=image.pixels;
  return [p[o],p[o+1],p[o+2],p[o+3]];
}
function colorDistance(a,b){
  const dr=a[0]-b[0],dg=a[1]-b[1],db=a[2]-b[2],da=(a[3]-b[3])*.45;
  return Math.hypot(dr,dg,db,da);
}
async function measureEye(id,file){
  const image=await rawImage(file);
  const minDim=Math.min(image.width,image.height);
  const centerX=image.width/2,centerY=image.height/2;
  const expected=image.width*(87/264);
  const minR=Math.max(4,Math.min(expected*.62,minDim*CONFIG.eyeSearchMinRatio));
  const maxR=Math.min(minDim*.49,Math.max(expected*1.38,minDim*CONFIG.eyeSearchMaxRatio));
  const points=[],scores=[],angleStep=CONFIG.eyeAngleStepDeg;
  for(let angle=0;angle<360;angle+=angleStep){
    const rad=angle*Math.PI/180,cos=Math.cos(rad),sin=Math.sin(rad);
    let bestR=expected,bestScore=-1;
    for(let radius=Math.floor(minR);radius<=Math.ceil(maxR);radius+=1){
      const p1=pixel(image,centerX+cos*(radius-2),centerY+sin*(radius-2));
      const p2=pixel(image,centerX+cos*(radius+2),centerY+sin*(radius+2));
      const raw=colorDistance(p1,p2);
      const distancePenalty=1-.22*Math.min(1,Math.abs(radius-expected)/Math.max(1,maxR-minR));
      const score=raw*distancePenalty;
      if(score>bestScore){bestScore=score;bestR=radius;}
    }
    points.push({x:centerX+cos*bestR,y:centerY+sin*bestR,angle,radius:bestR});
    scores.push(bestScore);
  }
  let fitCenterX=0,fitCenterY=0,pairs=0,half=Math.round(180/angleStep);
  for(let i=0;i<half&&i+half<points.length;i++){
    fitCenterX+=(points[i].x+points[i+half].x)/2;
    fitCenterY+=(points[i].y+points[i+half].y)/2;
    pairs++;
  }
  fitCenterX=pairs?fitCenterX/pairs:centerX;
  fitCenterY=pairs?fitCenterY/pairs:centerY;
  let sx4=0,sy4=0,sx2y2=0,sx2=0,sy2=0;
  for(const point of points){
    const dx=point.x-fitCenterX,dy=point.y-fitCenterY,x2=dx*dx,y2=dy*dy;
    sx4+=x2*x2;sy4+=y2*y2;sx2y2+=x2*y2;sx2+=x2;sy2+=y2;
  }
  const determinant=sx4*sy4-sx2y2*sx2y2;
  let radiusX=expected,radiusY=expected;
  if(Math.abs(determinant)>1e-9){
    const a=(sx2*sy4-sy2*sx2y2)/determinant;
    const b=(sy2*sx4-sx2*sx2y2)/determinant;
    if(a>0&&b>0){radiusX=Math.sqrt(1/a);radiusY=Math.sqrt(1/b);}
  }
  const residuals=points.map(point=>Math.abs(Math.hypot((point.x-fitCenterX)/radiusX,(point.y-fitCenterY)/radiusY)-1));
  const rms=Math.sqrt(residuals.reduce((sum,value)=>sum+value*value,0)/(residuals.length||1));
  const meanScore=scores.reduce((sum,value)=>sum+value,0)/(scores.length||1);
  const confidence=rms<=.06&&meanScore>=18?'HIGH':rms<=.12&&meanScore>=10?'MEDIUM':'LOW';
  const radiusAt=(target)=>{
    let best=points[0];
    for(const p of points){
      const delta=Math.abs((((p.angle-target)+540)%360)-180);
      if(delta<Math.abs((((best.angle-target)+540)%360)-180))best=p;
    }
    return best?.radius||expected;
  };
  return {
    id,sourceWidth:image.width,sourceHeight:image.height,
    centerX:fitCenterX,centerY:fitCenterY,radiusX,radiusY,
    diameters:{
      horizontal:radiusAt(0)+radiusAt(180),
      vertical:radiusAt(90)+radiusAt(270),
      diagonal45:radiusAt(45)+radiusAt(225),
      diagonal135:radiusAt(135)+radiusAt(315)
    },
    rmsNormalized:rms,edgeScoreMean:meanScore,confidence,
    method:'radial-color-edge-ellipse-v1'
  };
}
async function measureArrow(id,file){
  const image=await rawImage(file),threshold=CONFIG.alphaThreshold,points=[];
  let left=image.width,top=image.height,right=-1,bottom=-1,alphaPixels=0;
  const alpha=(x,y)=>image.pixels[(y*image.width+x)*4+3];
  for(let y=0;y<image.height;y++)for(let x=0;x<image.width;x++){
    if(alpha(x,y)<=threshold)continue;
    alphaPixels++;left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);
    const boundary=x===0||y===0||x===image.width-1||y===image.height-1||
      alpha(Math.max(0,x-1),y)<=threshold||alpha(Math.min(image.width-1,x+1),y)<=threshold||
      alpha(x,Math.max(0,y-1))<=threshold||alpha(x,Math.min(image.height-1,y+1))<=threshold;
    if(boundary)points.push({x:x+.5,y:y+.5});
  }
  if(right<left)throw new Error(`${id}: no visible alpha pixels`);
  const maxPoints=720,stride=Math.max(1,Math.ceil(points.length/maxPoints));
  const boundaryPoints=points.filter((_,index)=>index%stride===0);
  const pivotX=image.width*ARROW_PROFILE.centerXPercent/100;
  const pivotY=image.height*ARROW_PROFILE.centerYPercent/100;
  const maxRadius=Math.max(...boundaryPoints.map(p=>Math.hypot(p.x-pivotX,p.y-pivotY)));
  return {
    id,sourceWidth:image.width,sourceHeight:image.height,pivotX,pivotY,
    alphaBounds:{left,top,right,bottom,width:right-left+1,height:bottom-top+1},
    alphaPixels,boundaryPoints,maxRadius,method:'alpha-contour-v1'
  };
}
function fit(eye,arrow){
  const safeRadiusX=eye.radiusX*(1-CONFIG.safeInsetRatio);
  const safeRadiusY=eye.radiusY*(1-CONFIG.safeInsetRatio);
  const baseWidth=Math.min(eye.sourceWidth,eye.sourceHeight)*ARROW_PROFILE.widthPercent/100;
  const baseHeight=Math.min(eye.sourceWidth,eye.sourceHeight)*ARROW_PROFILE.heightPercent/100;
  const scaleX=baseWidth/arrow.sourceWidth,scaleY=baseHeight/arrow.sourceHeight;
  let worstNorm=0,worstAngleDeg=0;
  for(let angle=0;angle<360;angle+=CONFIG.rotationStepDeg){
    const rad=angle*Math.PI/180,cos=Math.cos(rad),sin=Math.sin(rad);
    let angleNorm=0;
    for(const point of arrow.boundaryPoints){
      const x=(point.x-arrow.pivotX)*scaleX,y=(point.y-arrow.pivotY)*scaleY;
      const rx=x*cos-y*sin,ry=x*sin+y*cos;
      const norm=Math.hypot(rx/safeRadiusX,ry/safeRadiusY);
      if(norm>angleNorm)angleNorm=norm;
    }
    if(angleNorm>worstNorm){worstNorm=angleNorm;worstAngleDeg=angle;}
  }
  const recommendedUniformScale=worstNorm>0?1/worstNorm:1;
  const minorSafeRadius=Math.min(safeRadiusX,safeRadiusY);
  const clearance=(1-worstNorm)*minorSafeRadius;
  return {
    medallionId:eye.id,arrowId:arrow.id,key:`${eye.id}::${arrow.id}`,
    eye:{
      centerX:eye.centerX,centerY:eye.centerY,radiusX:eye.radiusX,radiusY:eye.radiusY,
      safeRadiusX,safeRadiusY,diameters:eye.diameters,confidence:eye.confidence
    },
    arrow:{
      pivotX:arrow.pivotX,pivotY:arrow.pivotY,alphaBounds:arrow.alphaBounds,
      maxRadius:arrow.maxRadius,sourceWidth:arrow.sourceWidth,sourceHeight:arrow.sourceHeight
    },
    baseArrowLayout:{
      widthPercent:ARROW_PROFILE.widthPercent,heightPercent:ARROW_PROFILE.heightPercent,
      widthPx:baseWidth,heightPx:baseHeight
    },
    arrowToEyeRatioCurrent:worstNorm,
    eyeToArrowScaleRatio:recommendedUniformScale,
    recommendedUniformScale,
    contained360:worstNorm<=1+1e-6,
    minClearancePx:Math.max(0,clearance),
    maxOverflowPx:Math.max(0,-clearance),
    worstAngleDeg,rotationStepDeg:CONFIG.rotationStepDeg,safeInsetRatio:CONFIG.safeInsetRatio
  };
}
(async()=>{
  fs.mkdirSync(OUT_DIR,{recursive:true});
  const db={
    schema:CONFIG.schema,version:CONFIG.version,
    generatedAt:new Date().toISOString(),build:BUILD,
    provenance:{generator:'scripts/generate-medallion-arrow-fit-matrix.cjs',source:'frontend/assets',mode:'ci-offline-r16-parity'},
    config:{...CONFIG},medallions:{},arrows:{},fits:{}
  };
  for(let n=1;n<=28;n++){
    const id=`trend_${String(n).padStart(2,'0')}`;
    db.medallions[id]=await measureEye(id,medallionPath(n));
  }
  const arrowMeasurements={};
  for(let n=0;n<=17;n++){
    const id=`arrow_${String(n).padStart(2,'0')}`;
    const measured=await measureArrow(id,arrowPath(n));
    arrowMeasurements[id]=measured;
    const {boundaryPoints,...stored}=measured;
    db.arrows[id]=stored;
  }
  for(const eye of Object.values(db.medallions)){
    for(const arrow of Object.values(arrowMeasurements)){
      const record=fit(eye,arrow);db.fits[record.key]=record;
    }
  }
  const fits=Object.values(db.fits);
  const scales=fits.map(x=>x.recommendedUniformScale);
  const ratios=fits.map(x=>x.arrowToEyeRatioCurrent);
  const contained=fits.filter(x=>x.contained360).length;
  const confidenceCounts=Object.values(db.medallions).reduce((acc,x)=>(acc[x.confidence]=(acc[x.confidence]||0)+1,acc),{});
  const summary={
    schema:'gewitterradar.medallion-arrow-fit-summary.v1',
    build:BUILD,generatedAt:db.generatedAt,
    medallions:Object.keys(db.medallions).length,
    arrows:Object.keys(db.arrows).length,
    fits:fits.length,expectedFits:28*18,
    contained360:contained,overflowing360:fits.length-contained,
    confidenceCounts,
    recommendedScale:{min:Math.min(...scales),max:Math.max(...scales),mean:scales.reduce((a,b)=>a+b,0)/scales.length},
    ratio:{min:Math.min(...ratios),max:Math.max(...ratios),mean:ratios.reduce((a,b)=>a+b,0)/ratios.length},
    lowestConfidence:Object.values(db.medallions).filter(x=>x.confidence!=='HIGH').map(x=>x.id),
    mostRestrictive:fits.slice().sort((a,b)=>a.recommendedUniformScale-b.recommendedUniformScale).slice(0,20).map(x=>({key:x.key,scale:x.recommendedUniformScale,ratio:x.arrowToEyeRatioCurrent,overflow:x.maxOverflowPx,worstAngleDeg:x.worstAngleDeg})),
    mostPermissive:fits.slice().sort((a,b)=>b.recommendedUniformScale-a.recommendedUniformScale).slice(0,20).map(x=>({key:x.key,scale:x.recommendedUniformScale,ratio:x.arrowToEyeRatioCurrent,clearance:x.minClearancePx,worstAngleDeg:x.worstAngleDeg}))
  };
  fs.writeFileSync(path.join(OUT_DIR,'gewitterradar-medallion-arrow-fit-db.json'),JSON.stringify(db,null,2)+'\n');
  fs.writeFileSync(path.join(OUT_DIR,'gewitterradar-medallion-arrow-fit-summary.json'),JSON.stringify(summary,null,2)+'\n');
  const csv=['key,medallionId,arrowId,ratio,recommendedScale,contained360,minClearancePx,maxOverflowPx,worstAngleDeg,eyeRadiusX,eyeRadiusY,eyeConfidence'];
  for(const x of fits)csv.push([x.key,x.medallionId,x.arrowId,x.arrowToEyeRatioCurrent,x.recommendedUniformScale,x.contained360,x.minClearancePx,x.maxOverflowPx,x.worstAngleDeg,x.eye.radiusX,x.eye.radiusY,x.eye.confidence].join(','));
  fs.writeFileSync(path.join(OUT_DIR,'gewitterradar-medallion-arrow-fit-matrix.csv'),csv.join('\n')+'\n');
  console.log(JSON.stringify(summary,null,2));
  if(Object.keys(db.medallions).length!==28||Object.keys(db.arrows).length!==18||fits.length!==504)process.exitCode=1;
})().catch(error=>{console.error(error);process.exit(1);});
