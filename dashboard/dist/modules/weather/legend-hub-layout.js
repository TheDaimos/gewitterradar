const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const intersects=(a,b,gap=6)=>a.left<b.right+gap&&a.right>b.left-gap&&a.top<b.bottom+gap&&a.bottom>b.top-gap;
// Evaluate fixed directions as preferences; clamp every candidate to the map.
// The caller retains the chosen direction for the whole open interaction.
export function legendHubLayout({anchor,bounds,count,direction='dynamic',locked=null,obstacles=[]}){
 const size=48,gap=6,pad=9,horizontal=['left','right'],vertical=['up','down'];
 const choices=locked?[locked]:horizontal.includes(direction)||vertical.includes(direction)?[direction]:direction==='horizontal'?horizontal:direction==='vertical'?vertical:[...horizontal,...vertical];
 const candidates=choices.map(dir=>{const h=horizontal.includes(dir),spaceX=bounds.right-bounds.left,spaceY=bounds.bottom-bounds.top,maxCols=Math.max(1,Math.floor((spaceX-2*pad+gap)/(size+gap))),maxRows=Math.max(1,Math.floor((spaceY-2*pad+gap)/(size+gap))),cols=h?Math.min(maxCols,count):Math.min(maxCols,Math.ceil(count/maxRows)),rows=Math.ceil(count/cols),width=Math.min(spaceX,cols*(size+gap)-gap+2*pad),height=Math.min(spaceY,rows*(size+gap)-gap+2*pad);
  const idealX=dir==='left'?anchor.left-width-gap:dir==='right'?anchor.right+gap:(anchor.left+anchor.right-width)/2;
  const idealY=dir==='up'?anchor.top-height-gap:dir==='down'?anchor.bottom+gap:(anchor.top+anchor.bottom-height)/2;
  let left=clamp(idealX,bounds.left,Math.max(bounds.left,bounds.right-width)),top=clamp(idealY,bounds.top,Math.max(bounds.top,bounds.bottom-height));
  let rect={left,top,right:left+width,bottom:top+height};
  if(intersects(rect,anchor)){const shifts=h?[{left,top:anchor.bottom+gap},{left,top:anchor.top-height-gap}]:[{left:anchor.right+gap,top},{left:anchor.left-width-gap,top}];const safe=shifts.map(p=>({...p,right:p.left+width,bottom:p.top+height})).filter(p=>p.left>=bounds.left&&p.top>=bounds.top&&p.right<=bounds.right&&p.bottom<=bounds.bottom&&!intersects(p,anchor,0)).sort((a,b)=>Math.hypot(a.left-left,a.top-top)-Math.hypot(b.left-left,b.top-top))[0];if(safe){rect=safe;left=rect.left;top=rect.top;}}
  const area=r=>obstacles.reduce((n,o)=>n+(intersects(r,o)?Math.max(0,Math.min(r.right,o.right)-Math.max(r.left,o.left))*Math.max(0,Math.min(r.bottom,o.bottom)-Math.max(r.top,o.top)):0),0);
  if(intersects(rect,anchor)||area(rect)){const xs=[left,bounds.left,bounds.right-width,...[anchor,...obstacles].flatMap(o=>[o.left-width-gap,o.right+gap])],ys=[top,bounds.top,bounds.bottom-height,...[anchor,...obstacles].flatMap(o=>[o.top-height-gap,o.bottom+gap])],alternatives=[];for(const x of xs)for(const y of ys){const r={left:x,top:y,right:x+width,bottom:y+height};if(x<bounds.left||y<bounds.top||r.right>bounds.right||r.bottom>bounds.bottom||intersects(r,anchor))continue;alternatives.push({...r,score:area(r)*10+Math.hypot(x-left,y-top)});}const best=alternatives.sort((a,b)=>a.score-b.score)[0];if(best){rect=best;left=rect.left;top=rect.top;}}
  const collision=area(rect);
  return {...rect,width,height,cols,rows,direction:dir,score:collision*10+(intersects(rect,anchor)?100000:0)+Math.abs(left-idealX)+Math.abs(top-idealY)};});
 return candidates.sort((a,b)=>a.score-b.score)[0];
}
