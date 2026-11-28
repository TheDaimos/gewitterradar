// MA-026: show the existing Weather Engine GeoPoint output above MA dialogs.
// All values are read from the real inspector, never synthesized here.
const node=(tag,text='')=>{const el=document.createElement(tag);el.textContent=String(text);return el;};
export function readGeoPointSnapshot(source){
 if(!source||source.hidden)return null;
 return {heading:source.querySelector('strong')?.textContent?.trim()||'GeoPoint Inspector',
 lines:[...source.querySelectorAll('p')].map(p=>p.textContent?.trim()).filter(Boolean)};
}
export function openGeoPointWindow(owner,{source,verifyContext}={}){
 if(!owner?.shadow||typeof verifyContext!=='function'||!verifyContext())return null;
 const data=readGeoPointSnapshot(source);if(!data)return null;
 owner.shadow.getElementById('gr-ma-geopoint-window')?.remove();
 const german=/Deutsch|Boarisch|Platt|Sächs|Schwäb/i.test(owner._languageValue?.()||'Deutsch');
 const backText=german?'Zurück':'Back',closeText=german?'Schließen':'Close';
 const root=node('div');root.id='gr-ma-geopoint-window';
 const style=node('style');style.textContent=`#gr-ma-geopoint-window{position:fixed;inset:0;z-index:2147483646;display:grid;place-items:center;background:#02070be6;padding:12px;box-sizing:border-box;backdrop-filter:blur(8px)}
#gr-ma-geopoint-window .panel{width:min(720px,100%);max-height:calc(100dvh - 24px);box-sizing:border-box;overflow:hidden;display:flex;flex-direction:column;border:2px solid #d5b16b;border-radius:20px;background:linear-gradient(180deg,#22313e,#081520 85%);color:#e9dfc8;font:14px/1.5 system-ui;box-shadow:0 24px 75px #000b;padding:15px}
#gr-ma-geopoint-window header{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-shrink:0;border-bottom:1px solid #987749;padding-bottom:10px}
#gr-ma-geopoint-window header strong{font:clamp(22px,3vw,29px) Georgia,serif;color:#f5dcad}
#gr-ma-geopoint-window .close-premium{min-width:44px;width:44px;min-height:44px;border:0;background:transparent;padding:0;display:grid;place-items:center;cursor:pointer}
#gr-ma-geopoint-window .close-premium img{width:34px;height:34px;object-fit:contain;pointer-events:none}
#gr-ma-geopoint-window .back{appearance:none;display:inline-flex;align-items:center;gap:14px;min-height:44px;border:0;background:transparent;color:#eed08a;font:700 14px system-ui;align-self:flex-start;padding:5px 13px;cursor:pointer}
#gr-ma-geopoint-window .chevron{display:inline-block;width:11px;height:11px;border-left:3px solid #e6b961;border-bottom:3px solid #e6b961;transform:rotate(45deg)}
#gr-ma-geopoint-window button:focus-visible{outline:2px solid #ffe4a0;outline-offset:2px}
#gr-ma-geopoint-window .contents{min-height:0;overflow-y:auto;overscroll-behavior:contain;contain:paint;scrollbar-width:thin;padding:8px 0}
#gr-ma-geopoint-window .contents p{margin:7px 0;padding:12px 14px;border:1px solid #94774780;border-radius:10px;background:linear-gradient(145deg,#172e3b,#0c1a28);overflow-wrap:anywhere;white-space:pre-wrap;font-variant-numeric:tabular-nums}`;
 const panel=node('section');panel.className='panel';panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label',data.heading);
 const close=()=>root.remove(),button=(label)=>{const b=node('button');b.type='button';b.setAttribute('aria-label',label);b.addEventListener('click',close);return b;};
 const header=node('header');header.append(node('strong',data.heading));
 const exit=button(closeText);exit.className='close-premium';const img=node('img');
 img.src=owner.shadow.getElementById('settings-close')?.querySelector('img')?.src||new URL('../../assets/gewitterradar-about-close-premium.webp',import.meta.url).href;img.alt='';img.draggable=false;exit.append(img);header.append(exit);
 const back=button(backText);back.className='back';const arrow=node('span');arrow.className='chevron';arrow.setAttribute('aria-hidden','true');back.append(arrow,node('span',backText));
 const contents=node('div');contents.className='contents';for(const line of data.lines)contents.append(node('p',line));
 panel.append(header,back,contents);root.append(style,panel);
 const fullscreen=owner.shadow.getElementById('map-fullscreen-dialog');
 (fullscreen?.open?fullscreen:owner.shadow).append(root);
 source.hidden=true; // hide only the duplicate map-card visual
 root.addEventListener('click',e=>{if(e.target===root)close();});
 root.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();}});
 back.focus({preventScroll:true});return root;
}
