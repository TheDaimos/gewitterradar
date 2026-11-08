// Isolated visual settings. Values are CSS pixels, seconds and display factors.
export const SNAKE_DEFAULTS=Object.freeze({minLength:10,maxLength:76,lengthScale:1,headSize:1.5,bodyWidth:2.1,taper:1.3,opacity:85,density:1,speed:1,response:.65});
export const SNAKE_LIMITS=Object.freeze({minLength:[8,24,.5],maxLength:[30,120,1],lengthScale:[.25,3,.05],headSize:[1,2,.05],bodyWidth:[1,5,.1],taper:[.6,2.5,.05],opacity:[10,100,1],density:[.35,2,.05],speed:[.25,2.5,.05],response:[.15,3,.05]});
export function normalizeSnakeConfig(input={}){const result={};for(const [key,[min,max]] of Object.entries(SNAKE_LIMITS)){const value=input?.[key];result[key]=typeof value==='number'&&Number.isFinite(value)?Math.max(min,Math.min(max,value)):SNAKE_DEFAULTS[key];}return result;}
export const snakeTargetLength=(speed,c)=>Number.isFinite(speed)&&speed>0?c.minLength+(c.maxLength-c.minLength)*(-Math.expm1(-speed*c.lengthScale/20)):0;
export const snakeVelocity=(speed,factor=1)=>Number.isFinite(speed)&&speed>0?96*(-Math.expm1(-speed/18))*factor:0;
export const smoothSnakeLength=(current,target,dt,response)=>current+(target-current)*(-Math.expm1(-Math.max(0,dt)/response));
