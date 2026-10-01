import { registerModule } from "../core/registry.js?v=41105r1";

export const MODULE_META=Object.freeze({
  id:"instruments.medallion-designs",
  version:"1.3.1",
  group:"Instrumente",
  function:"Medaillon-Designkatalog",
  subfunctions:["Designvarianten","Assetzuordnung","Diagnosegrundprofile","Pfeilvarianten","Pfeilauswahl","Pfeil/Auge-Geometriedatenbank","Zentrums-Kalibrierung","Augen-Referenzkreis"],
  file:"modules/instruments/medallion-designs.js"
});
registerModule(MODULE_META);

const ARROW_PROFILE=Object.freeze({centerXPercent:50.012238,centerYPercent:50.452396,widthPercent:59.667391,heightPercent:59.667391,transformOriginXPercent:50,transformOriginYPercent:50});
const MEDALLION_ARROW_GEOMETRY_DB_CONFIG=Object.freeze({
  schema:"gewitterradar.medallion-arrow-geometry.v2",
  version:2,
  storageKey:"gewitterradar:v41002:medallion-arrow-fit-db-v2",
  safeInsetRatio:0.04,
  rotationStepDeg:5,
  eyeAngleStepDeg:2,
  alphaThreshold:8,
  eyeSearchMinRatio:0.18,
  eyeSearchMaxRatio:0.36,
  eyeSeedMode:"first-consistent-eye-ring-v2",
  centerFitMode:"eye-center-plus-render-origin-v1",
  eyeSeedRadiusRatio:87/264
});

const MEDALLION_ASSETS=Object.freeze({
  trend_19:new URL('../../assets/gewitterradar-trend-medallion-19.webp?v=41002r14', import.meta.url).href,
  trend_20:new URL('../../assets/gewitterradar-trend-medallion-20.webp?v=41002r14', import.meta.url).href,
  trend_21:new URL('../../assets/gewitterradar-trend-medallion-21.webp?v=41002r14', import.meta.url).href,
  trend_22:new URL('../../assets/gewitterradar-trend-medallion-22.webp?v=41002r14', import.meta.url).href,
  trend_23:new URL('../../assets/gewitterradar-trend-medallion-23.webp?v=41002r14', import.meta.url).href,
  trend_24:new URL('../../assets/gewitterradar-trend-medallion-24.webp?v=41002r14', import.meta.url).href,
  trend_25:new URL('../../assets/gewitterradar-trend-medallion-25.webp?v=41002r14', import.meta.url).href,
  trend_26:new URL('../../assets/gewitterradar-trend-medallion-26.webp?v=41002r14', import.meta.url).href,
  trend_27:new URL('../../assets/gewitterradar-trend-medallion-27.webp?v=41002r14', import.meta.url).href,
  trend_28:new URL('../../assets/gewitterradar-trend-medallion-28.webp?v=41002r14', import.meta.url).href
});

const TREND_ARROW_ASSETS=Object.freeze({
  arrow_01:new URL('../../assets/gewitterradar-trend-arrow-01.webp?v=41002r15', import.meta.url).href,
  arrow_02:new URL('../../assets/gewitterradar-trend-arrow-02.webp?v=41002r15', import.meta.url).href,
  arrow_03:new URL('../../assets/gewitterradar-trend-arrow-03.webp?v=41002r15', import.meta.url).href,
  arrow_04:new URL('../../assets/gewitterradar-trend-arrow-04.webp?v=41002r15', import.meta.url).href,
  arrow_05:new URL('../../assets/gewitterradar-trend-arrow-05.webp?v=41002r15', import.meta.url).href,
  arrow_06:new URL('../../assets/gewitterradar-trend-arrow-06.webp?v=41002r15', import.meta.url).href,
  arrow_07:new URL('../../assets/gewitterradar-trend-arrow-07.webp?v=41002r15', import.meta.url).href,
  arrow_08:new URL('../../assets/gewitterradar-trend-arrow-08.webp?v=41002r15', import.meta.url).href,
  arrow_09:new URL('../../assets/gewitterradar-trend-arrow-09.webp?v=41002r15', import.meta.url).href,
  arrow_10:new URL('../../assets/gewitterradar-trend-arrow-10.webp?v=41002r15', import.meta.url).href,
  arrow_11:new URL('../../assets/gewitterradar-trend-arrow-11.webp?v=41002r15', import.meta.url).href,
  arrow_12:new URL('../../assets/gewitterradar-trend-arrow-12.webp?v=41002r15', import.meta.url).href,
  arrow_13:new URL('../../assets/gewitterradar-trend-arrow-13.webp?v=41002r15', import.meta.url).href,
  arrow_14:new URL('../../assets/gewitterradar-trend-arrow-14.webp?v=41002r15', import.meta.url).href,
  arrow_15:new URL('../../assets/gewitterradar-trend-arrow-15.webp?v=41002r15', import.meta.url).href,
  arrow_16:new URL('../../assets/gewitterradar-trend-arrow-16.webp?v=41002r15', import.meta.url).href,
  arrow_17:new URL('../../assets/gewitterradar-trend-arrow-17.webp?v=41002r15', import.meta.url).href
});
const TREND_ARROW_LABELS=Object.freeze(["Standard geschützt","Keltisch Silber","Silber Blau","Eisjuwelen","Technisch Silber","Keltisch Warm","Blattwerk Silber","Nordisch Runen","Saphir Silber","Cyberpunk Gold","Tron Silber","Energie Blau Kern","Energie Blau Geflecht","Energie Blau Gold","Energie Cyan","Energie Blau Violett","Energie Blau Magenta","Energie Blau Softviolett"]);

export function installMedallionDesigns(_Card,context){
  if(!context||!Array.isArray(context.MEDALLION_DESIGNS))throw new TypeError("medallion-designs requires MEDALLION_DESIGNS");
  const arrowDesigns=[{id:"arrow_00",label:TREND_ARROW_LABELS[0],asset:context.TREND_ARROW_IMAGE,protected:true,runtimeDerivative:false}];
  for(let number=1;number<=17;number++){
    const suffix=String(number).padStart(2,"0"),id="arrow_"+suffix;
    arrowDesigns.push({id,label:TREND_ARROW_LABELS[number],asset:TREND_ARROW_ASSETS[id],protected:false,runtimeDerivative:true,size:264,format:"webp-lossless"});
  }
  context.TREND_ARROW_DESIGNS=Object.freeze(arrowDesigns.map(item=>Object.freeze(item)));
  context.TREND_ARROW_GEOMETRY=ARROW_PROFILE;
  const existing=new Set(context.MEDALLION_DESIGNS.map(item=>item?.id));
  const extras=[];
  for(let number=19;number<=28;number++){
    const suffix=String(number).padStart(2,"0");
    const id="trend_"+suffix;
    if(existing.has(id))continue;
    extras.push({
      id,label:id,asset:MEDALLION_ASSETS[id],
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
  context.MEDALLION_ARROW_GEOMETRY_DB=Object.freeze({
    ...MEDALLION_ARROW_GEOMETRY_DB_CONFIG,
    medallionIds:Object.freeze(context.MEDALLION_DESIGNS.map(item=>item.id)),
    arrowIds:Object.freeze(context.TREND_ARROW_DESIGNS.map(item=>item.id))
  });
  return context.MEDALLION_DESIGNS;
}
