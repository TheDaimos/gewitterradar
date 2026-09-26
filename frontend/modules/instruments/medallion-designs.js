import { registerModule } from "../core/registry.js?v=41002r13";

export const MODULE_META=Object.freeze({
  id:"instruments.medallion-designs",
  version:"1.0.0",
  group:"Instrumente",
  function:"Medaillon-Designkatalog",
  subfunctions:["Designvarianten","Assetzuordnung","Diagnosegrundprofile"],
  file:"modules/instruments/medallion-designs.js"
});
registerModule(MODULE_META);

const ARROW_PROFILE=Object.freeze({centerXPercent:50.012238,centerYPercent:50.452396,widthPercent:59.667391,heightPercent:59.667391});

export function extendMedallionDesigns(context,rootModuleUrl){
  if(!context||!Array.isArray(context.MEDALLION_DESIGNS))throw new TypeError("medallion-designs requires MEDALLION_DESIGNS");
  if(!rootModuleUrl)throw new TypeError("medallion-designs requires rootModuleUrl");
  const existing=new Set(context.MEDALLION_DESIGNS.map(item=>item?.id));
  const extras=[];
  for(let number=19;number<=28;number++){
    const suffix=String(number).padStart(2,"0");
    const id="trend_"+suffix;
    if(existing.has(id))continue;
    extras.push({
      id,label:id,
      asset:new URL("./assets/gewitterradar-trend-medallion-"+suffix+".webp?v=41002r14",rootModuleUrl).href,
      type:"image",size:"132px",x:"0px",y:"0px",
      visualScale:1,fitMode:"contain",expectedAspect:1,outerContour:"alpha bounds",
      innerContour:"central blue lens",calibrationProfile:"round-medallion-"+suffix+"-runtime-v1",
      diagnosticProfile:{
        geometryVersion:"round-medallion-"+suffix+"-runtime-v1",
        method:"2x lossless runtime derivative; per-design optical calibration pending measured diagnostic export",
        sourceWidth:264,sourceHeight:264,
        aperture:{centerX:132,centerY:132,radius:87,rms:0},
        motif:{centerX:132,centerY:132,radius:87,rms:0},
        gap:{mean:0,median:0,min:0,max:0,stdDev:0},
        fitRatio:1,requiredScale:1,requiredGrowthPct:0,
        centerOffsetX:0,centerOffsetY:0,centerResidual:0,
        normalizedCenterResidual:0,normalizedMeanGap:0,normalizedMaxGap:0,
        recommended:{translateX:0,translateY:0,uniformScale:1},
        status:{innerApertureFit:true,innerCircleCenter:true,radialGap:true,arrowCoupling:true},
        composition:{outerFrame:"full alpha contour retained",innerMotif:"lossless 2x runtime derivative without crop",arrow:"shared hi-res-derived trend arrow",sharedInnerStage:false},
        arrow:{...ARROW_PROFILE}
      }
    });
  }
  context.MEDALLION_DESIGNS.push(...extras);
  return context.MEDALLION_DESIGNS;
}
