/* One native frame request for all participating weather canvases. No polling. */
let pending=new Map(),dispatching=null,native=null,ticket=0;
function dispatch(time){native=null;dispatching=pending;pending=new Map();try{for(const [id,callback] of dispatching){dispatching.delete(id);try{callback(time);}catch(error){setTimeout(()=>{throw error;});}}}finally{dispatching=null;if(pending.size&&native===null)native=globalThis.requestAnimationFrame(dispatch);}}
export function requestWeatherFrame(callback){const id=++ticket;pending.set(id,callback);if(native===null&&dispatching===null)native=globalThis.requestAnimationFrame(dispatch);return id;}
export function cancelWeatherFrame(id){pending.delete(id);dispatching?.delete(id);if(!pending.size&&native!==null){globalThis.cancelAnimationFrame(native);native=null;}}
export const weatherFrameClockState=()=>({pending:pending.size+(dispatching?.size||0),nativeRequests:native===null?0:1});
