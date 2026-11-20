// Provider attribution is data, never executable HTML. Callers insert this via
// textContent/createTextNode or escape it before using existing HTML templates.
export function weatherSourceText(value){
 let text=typeof value==='string'?value:'';
 if(typeof DOMParser==='function'){
  for(let i=0;i<2;i++){
   const doc=new DOMParser().parseFromString(text,'text/html');
   doc.querySelectorAll('script,style,template,iframe,object').forEach(node=>node.remove());
   const next=doc.body.textContent||'';if(next===text)break;text=next;
  }
 }
 return text.replace(/<(script|style|template|iframe|object)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,'').replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim().replace(/^Daten\s*:/i,'Datenquelle:');
}
