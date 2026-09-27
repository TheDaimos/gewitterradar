#!/usr/bin/env node
'use strict';

const fs=require('fs');
const path=require('path');
const sharp=require('sharp');

const ROOT=path.resolve(__dirname,'..');
const ASSET_DIR=path.join(ROOT,'frontend','assets');
const OUT_DIR=path.join(ROOT,'artwork','acceptance','medallion-arrow-fit');
const BUILD='V4.10.02-MODULAR-DEV-R19-2026-09-27';
const CONFIG=Object.freeze({
  schema:'gewitterradar.medallion-arrow-geometry.v2',
  version:2,
  safeInsetRatio:0.04,
  rotationStepDeg:5,
  eyeAngleStepDeg:2,
  alphaThreshold:8,
  eyeSearchMinRatio:0.18,
  eyeSearchMaxRatio:0.36,
  centerFitMode:'eye-center-plus-render-origin-v1'
});
const ARROW_PROFILE=Object.freeze({
  centerXPercent:50.012238,
  centerYPercent:50.452396,
  widthPercent:59.667391,
  heightPercent:59.667391,
  transformOriginXPercent:50,
  transformOriginYPercent:50
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
  const image=await rawImage(file),minDim=Math.min(image.width,image.height);
  const centerX=image.width/2,centerY=image.height/2;
  const minR=Math.max(4,Math.floor(minDim*.18)),maxR=Math.min(Math.floor(minDim*.36),Math.floor(minDim*.49)),angleStep=2;
  const median=(values)=>{
    const sorted=values.slice().sort((a,b)=>a-b),mid=Math.floor(sorted.length/2);
    return sorted.length%2?sorted[mid]:(sorted[mid-1]+sorted[mid])/2;
  };
  const angleDiff=(a,b)=>Math.abs((((a-b)+540)%360)-180);
  const radialScore=(cx,cy,radius)=>{
    const values=[];
    for(let angle=0;angle<360;angle+=angleStep){
      const rad=angle*Math.PI/180,cos=Math.cos(rad),sin=Math.sin(rad);
      values.push(colorDistance(
        pixel(image,cx+cos*(radius-2),cy+sin*(radius-2)),
        pixel(image,cx+cos*(radius+2),cy+sin*(radius+2))
      ));
    }
    return median(values);
  };
  const radii=[];for(let r=minR;r<=maxR;r+=1)radii.push(r);
  const rawScores=radii.map(r=>radialScore(centerX,centerY,r));
  const scores=rawScores.map((value,index)=>{
    const from=Math.max(0,index-1),to=Math.min(rawScores.length,index+2);
    return rawScores.slice(from,to).reduce((sum,item)=>sum+item,0)/(to-from);
  });
  const peaks=[];
  for(let i=1;i<scores.length-1;i+=1)if(scores[i]>=scores[i-1]&&scores[i]>=scores[i+1])peaks.push({radius:radii[i],score:scores[i]});
  const globalPeak=Math.max(...(peaks.length?peaks.map(x=>x.score):scores));
  const strong=peaks.filter(x=>x.score>=globalPeak*.55);
  let baseRadius;
  if(strong.length){
    const first=Math.min(...strong.map(x=>x.radius)),cluster=strong.filter(x=>x.radius<=first+8);
    baseRadius=cluster.slice().sort((a,b)=>b.score-a.score)[0].radius;
  }else baseRadius=radii[scores.indexOf(Math.max(...scores))];

  let best=null;
  for(let dx=-4;dx<=4;dx+=1)for(let dy=-4;dy<=4;dy+=1){
    const cx=centerX+dx,cy=centerY+dy;
    for(let radius=Math.max(minR,baseRadius-3);radius<=Math.min(maxR,baseRadius+3);radius+=1){
      const score=radialScore(cx,cy,radius),prior=1-.015*Math.hypot(dx,dy)/Math.hypot(4,4),objective=score*prior;
      if(!best||objective>best.objective)best={objective,cx,cy,radius,score};
    }
  }
  const fitCenterX=best.cx,fitCenterY=best.cy;baseRadius=best.radius;
  const points=[],edgeScores=[];
  for(let angle=0;angle<360;angle+=angleStep){
    const rad=angle*Math.PI/180,cos=Math.cos(rad),sin=Math.sin(rad);let selected=null;
    for(let radius=Math.max(4,baseRadius-4);radius<=Math.min(Math.floor(minDim*.49),baseRadius+4);radius+=1){
      const score=colorDistance(
        pixel(image,fitCenterX+cos*(radius-2),fitCenterY+sin*(radius-2)),
        pixel(image,fitCenterX+cos*(radius+2),fitCenterY+sin*(radius+2))
      );
      if(!selected||score>selected.score)selected={score,radius};
    }
    points.push({angle,radius:selected.radius});edgeScores.push(selected.score);
  }
  const sectorMedian=(target,halfWidth)=>median(points.filter(p=>angleDiff(p.angle,target)<=halfWidth).map(p=>p.radius));
  const radiusX=(sectorMedian(0,10)+sectorMedian(180,10))/2;
  const radiusY=(sectorMedian(90,10)+sectorMedian(270,10))/2;
  const radiusAt=(target)=>sectorMedian(target,2);
  const edgeScoreMedian=median(edgeScores),radialMad=median(points.map(p=>Math.abs(p.radius-baseRadius)));
  const confidence=edgeScoreMedian>=12&&radialMad<=2.5?'HIGH':edgeScoreMedian>=8&&radialMad<=4?'MEDIUM':'LOW';
  return {
    id,sourceWidth:image.width,sourceHeight:image.height,
    centerX:fitCenterX,centerY:fitCenterY,radiusX,radiusY,baseRadius,
    diameters:{
      horizontal:radiusAt(0)+radiusAt(180),
      vertical:radiusAt(90)+radiusAt(270),
      diagonal45:radiusAt(45)+radiusAt(225),
      diagonal135:radiusAt(135)+radiusAt(315)
    },
    rmsNormalized:radialMad/Math.max(1,baseRadius),edgeScoreMedian,radialMad,confidence,
    method:'first-consistent-eye-ring-ellipse-v2'
  };
}
function resolveEyeReference(autoEye){
  return {...autoEye,referenceSource:'auto-ellipse-v2',autoMeasurement:{centerX:autoEye.centerX,centerY:autoEye.centerY,radiusX:autoEye.radiusX,radiusY:autoEye.radiusY,confidence:autoEye.confidence,method:autoEye.method}};
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
  const pivotX=image.width*ARROW_PROFILE.transformOriginXPercent/100;
  const pivotY=image.height*ARROW_PROFILE.transformOriginYPercent/100;
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
  const currentCenterX=eye.sourceWidth*ARROW_PROFILE.centerXPercent/100;
  const currentCenterY=eye.sourceHeight*ARROW_PROFILE.centerYPercent/100;
  const autoCenterX=eye.centerX,autoCenterY=eye.centerY;
  const currentOffsetX=currentCenterX-eye.centerX,currentOffsetY=currentCenterY-eye.centerY;
  const evaluate=(offsetX,offsetY,uniformScale=1)=>{
    let worstNorm=0,worstAngleDeg=0;
    for(let angle=0;angle<360;angle+=CONFIG.rotationStepDeg){
      const rad=angle*Math.PI/180,cos=Math.cos(rad),sin=Math.sin(rad);let angleNorm=0;
      for(const point of arrow.boundaryPoints){
        const x=(point.x-arrow.pivotX)*scaleX*uniformScale,y=(point.y-arrow.pivotY)*scaleY*uniformScale;
        const rx=offsetX+x*cos-y*sin,ry=offsetY+x*sin+y*cos;
        const norm=Math.hypot(rx/safeRadiusX,ry/safeRadiusY);
        if(norm>angleNorm)angleNorm=norm;
      }
      if(angleNorm>worstNorm){worstNorm=angleNorm;worstAngleDeg=angle;}
    }
    return {worstNorm,worstAngleDeg};
  };
  const current=evaluate(currentOffsetX,currentOffsetY,1);
  const centered=evaluate(0,0,1);
  const recommendedUniformScale=centered.worstNorm>0?1/centered.worstNorm:1;
  const recommended=evaluate(0,0,recommendedUniformScale);
  const minorSafeRadius=Math.min(safeRadiusX,safeRadiusY);
  const currentClearance=(1-current.worstNorm)*minorSafeRadius;
  const centeredClearance=(1-centered.worstNorm)*minorSafeRadius;
  return {
    medallionId:eye.id,arrowId:arrow.id,key:`${eye.id}::${arrow.id}`,
    eye:{
      centerX:eye.centerX,centerY:eye.centerY,radiusX:eye.radiusX,radiusY:eye.radiusY,
      safeRadiusX,safeRadiusY,diameters:eye.diameters,confidence:eye.confidence
    },
    arrow:{
      pivotX:arrow.pivotX,pivotY:arrow.pivotY,alphaBounds:arrow.alphaBounds,
      maxRadius:arrow.maxRadius,sourceWidth:arrow.sourceWidth,sourceHeight:arrow.sourceHeight,
      transformOriginXPercent:ARROW_PROFILE.transformOriginXPercent,transformOriginYPercent:ARROW_PROFILE.transformOriginYPercent
    },
    baseArrowLayout:{
      centerXPercent:ARROW_PROFILE.centerXPercent,centerYPercent:ARROW_PROFILE.centerYPercent,
      widthPercent:ARROW_PROFILE.widthPercent,heightPercent:ARROW_PROFILE.heightPercent,
      widthPx:baseWidth,heightPx:baseHeight
    },
    recommendedCenter:{
      x:autoCenterX,y:autoCenterY,
      xPercent:autoCenterX/eye.sourceWidth*100,yPercent:autoCenterY/eye.sourceHeight*100,
      deltaXPercent:(autoCenterX-currentCenterX)/eye.sourceWidth*100,
      deltaYPercent:(autoCenterY-currentCenterY)/eye.sourceHeight*100
    },
    currentCenterOffsetPx:{x:currentOffsetX,y:currentOffsetY,residual:Math.hypot(currentOffsetX,currentOffsetY)},
    arrowToEyeRatioCurrent:current.worstNorm,
    arrowToEyeRatioCentered:centered.worstNorm,
    eyeToArrowScaleRatio:recommendedUniformScale,
    recommendedUniformScale,
    contained360:current.worstNorm<=1+1e-6,
    centeredContained360:centered.worstNorm<=1+1e-6,
    recommendedContained360:recommended.worstNorm<=1+1e-6,
    minClearancePx:Math.max(0,currentClearance),
    maxOverflowPx:Math.max(0,-currentClearance),
    centeredMinClearancePx:Math.max(0,centeredClearance),
    centeredMaxOverflowPx:Math.max(0,-centeredClearance),
    worstAngleDeg:current.worstAngleDeg,
    centeredWorstAngleDeg:centered.worstAngleDeg,
    recommendedWorstAngleDeg:recommended.worstAngleDeg,
    rotationStepDeg:CONFIG.rotationStepDeg,safeInsetRatio:CONFIG.safeInsetRatio
  };
}
(async()=>{
  fs.mkdirSync(OUT_DIR,{recursive:true});
  const db={
    schema:CONFIG.schema,version:CONFIG.version,
    generatedAt:new Date().toISOString(),build:BUILD,
    provenance:{generator:'scripts/generate-medallion-arrow-fit-matrix.cjs',source:'frontend/assets',mode:'ci-offline-r19-center-aware-fit',manualEyeReferenceSchema:'gewitterradar.medallion-eye-calibration.v1',manualEyeReferenceCount:0,manualEyeReferenceIds:[]},
    config:{...CONFIG},medallions:{},arrows:{},fits:{}
  };
  for(let n=1;n<=28;n++){
    const id=`trend_${String(n).padStart(2,'0')}`;
    db.medallions[id]=resolveEyeReference(await measureEye(id,medallionPath(n)));
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
  const centerX=fits.map(x=>x.recommendedCenter.xPercent),centerY=fits.map(x=>x.recommendedCenter.yPercent),centerDx=fits.map(x=>x.recommendedCenter.deltaXPercent),centerDy=fits.map(x=>x.recommendedCenter.deltaYPercent);
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
    recommendedCenter:{xPercent:{min:Math.min(...centerX),max:Math.max(...centerX)},yPercent:{min:Math.min(...centerY),max:Math.max(...centerY)},deltaXPercent:{min:Math.min(...centerDx),max:Math.max(...centerDx)},deltaYPercent:{min:Math.min(...centerDy),max:Math.max(...centerDy)}},
    lowestConfidence:Object.values(db.medallions).filter(x=>x.confidence!=='HIGH').map(x=>x.id),
    mostRestrictive:fits.slice().sort((a,b)=>a.recommendedUniformScale-b.recommendedUniformScale).slice(0,20).map(x=>({key:x.key,scale:x.recommendedUniformScale,ratio:x.arrowToEyeRatioCurrent,overflow:x.maxOverflowPx,worstAngleDeg:x.worstAngleDeg})),
    mostPermissive:fits.slice().sort((a,b)=>b.recommendedUniformScale-a.recommendedUniformScale).slice(0,20).map(x=>({key:x.key,scale:x.recommendedUniformScale,ratio:x.arrowToEyeRatioCurrent,clearance:x.minClearancePx,worstAngleDeg:x.worstAngleDeg}))
  };
  fs.writeFileSync(path.join(OUT_DIR,'gewitterradar-medallion-arrow-fit-db.json'),JSON.stringify(db,null,2)+'\n');
  fs.writeFileSync(path.join(OUT_DIR,'gewitterradar-medallion-arrow-fit-summary.json'),JSON.stringify(summary,null,2)+'\n');
  const csv=['key,medallionId,arrowId,currentRatio,centeredRatio,recommendedScale,currentCenterXPercent,currentCenterYPercent,recommendedCenterXPercent,recommendedCenterYPercent,contained360,recommendedContained360,minClearancePx,maxOverflowPx,worstAngleDeg,eyeRadiusX,eyeRadiusY,eyeConfidence'];
  for(const x of fits)csv.push([x.key,x.medallionId,x.arrowId,x.arrowToEyeRatioCurrent,x.arrowToEyeRatioCentered,x.recommendedUniformScale,x.baseArrowLayout.centerXPercent,x.baseArrowLayout.centerYPercent,x.recommendedCenter.xPercent,x.recommendedCenter.yPercent,x.contained360,x.recommendedContained360,x.minClearancePx,x.maxOverflowPx,x.worstAngleDeg,x.eye.radiusX,x.eye.radiusY,x.eye.confidence].join(','));
  fs.writeFileSync(path.join(OUT_DIR,'gewitterradar-medallion-arrow-fit-matrix.csv'),csv.join('\n')+'\n');
  console.log(JSON.stringify(summary,null,2));
  if(Object.keys(db.medallions).length!==28||Object.keys(db.arrows).length!==18||fits.length!==504)process.exitCode=1;
})().catch(error=>{console.error(error);process.exit(1);});
