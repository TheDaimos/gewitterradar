// V4.07.34: second review-polish pass on the executable V4.07.33 candidate.
// Keep the accepted unified dialog-close placement unchanged.
// Scope: complete quote cleanup around rendered Help tokens and quieter premium saved-place controls.

function once(source, from, to, label) {
  if (source.split(from).length !== 2) {
    throw new Error(`V4.07.34 anchor changed (${label})`);
  }
  return source.replace(from, to);
}

export function v407Test34ReviewPolishR2Delta(source) {
  let result = source;

  result = once(
    result,
    "  const CARD_DISPLAY_VERSION = '4.07.33';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST33-2026-09-15';",
    "  const CARD_DISPLAY_VERSION = '4.07.34';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST34-2026-09-15';",
    'display-and-build'
  );

  // V4.07.33 covered only a subset of quotation marks. Complete the set used by the locale payloads.
  result = once(
    result,
    "const value=String(text??'').trimStart().replace(/^[„“\"'«»‹›]+\\s*/,'');",
    "const value=String(text??'').trimStart().replace(/^[„“”‚‘’\"'«»‹›]+\\s*/,'');",
    'action-leading-quotes'
  );
  result = once(
    result,
    "action.textContent=actionMatch[0].replace(/^[„“\"'«»‹›]+|[„“\"'«»‹›]+$/g,'');",
    "action.textContent=actionMatch[0].replace(/^[„“”‚‘’\"'«»‹›]+|[„“”‚‘’\"'«»‹›]+$/g,'');",
    'action-token-quotes'
  );
  result = once(
    result,
    "const rest=value.slice(actionMatch[0].length).replace(/^[\\s„“\"'«»‹›]+/,'');",
    "const rest=value.slice(actionMatch[0].length).replace(/^[\\s„“”‚‘’\"'«»‹›]+/,'');",
    'action-rest-quotes'
  );

  const oldNetworkRenderer = `const appendHelpNetworkText=(target,text)=>{\n          const source=String(text??'');helpNetworkTokenPattern.lastIndex=0;let cursor=0,match;\n          while((match=helpNetworkTokenPattern.exec(source))){\n            if(match.index>cursor)target.append(document.createTextNode(source.slice(cursor,match.index)));\n            const token=document.createElement('span'),tokenText=match[0];if(tokenText==='★ Speichern'||tokenText==='★ Save')token.className='help-action-token help-action-save';else if(tokenText==='×')token.className='help-action-token help-action-delete';else if(tokenText==='↶')token.className='help-action-token help-action-restore';else if(tokenText==='Location entity')token.className='help-process-highlight';else token.className='help-network-highlight';token.textContent=tokenText;target.append(token);cursor=match.index+tokenText.length;\n            if(match[0].length===0)helpNetworkTokenPattern.lastIndex++;\n          }\n          if(cursor<source.length)target.append(document.createTextNode(source.slice(cursor)));\n        };`;
  const newNetworkRenderer = `const helpTokenQuotePattern=/[„“”‚‘’\"'«»‹›]/;\n        const appendHelpNetworkText=(target,text)=>{\n          const source=String(text??'');helpNetworkTokenPattern.lastIndex=0;let cursor=0,match;\n          while((match=helpNetworkTokenPattern.exec(source))){\n            let before=source.slice(cursor,match.index).replace(/[„“”‚‘’\"'«»‹›](\\s*)$/,'$1');\n            if(before)target.append(document.createTextNode(before));\n            const token=document.createElement('span'),tokenText=match[0];if(tokenText==='★ Speichern'||tokenText==='★ Save')token.className='help-action-token help-action-save';else if(tokenText==='×')token.className='help-action-token help-action-delete';else if(tokenText==='↶')token.className='help-action-token help-action-restore';else if(tokenText==='Location entity')token.className='help-process-highlight';else token.className='help-network-highlight';token.textContent=tokenText;target.append(token);cursor=match.index+tokenText.length;\n            while(cursor<source.length&&helpTokenQuotePattern.test(source[cursor]))cursor++;\n            if(match[0].length===0)helpNetworkTokenPattern.lastIndex++;\n          }\n          if(cursor<source.length)target.append(document.createTextNode(source.slice(cursor)));\n        };`;
  result = once(result, oldNetworkRenderer, newNetworkRenderer, 'generic-token-quote-cleanup');

  result = once(
    result,
    "          .location-saved-star { display:inline-grid;place-items:center;width:14px;min-width:14px;height:18px;color:#f0c85f;font-size:13px;line-height:1;font-weight:900;background:linear-gradient(180deg,#fff4bf 0%,#f5d46f 24%,#a86f1d 51%,#ffdc7c 72%,#956015 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;text-shadow:0 1px 0 rgba(0,0,0,.9);filter:drop-shadow(0 1px 1px rgba(0,0,0,.76)) drop-shadow(0 0 2px rgba(227,176,66,.34)); }",
    "          .location-saved-star { color:#f6c344;font-size:13px;line-height:1;font-weight:800;text-shadow:0 -1px 0 rgba(255,240,177,.18),0 1px 0 rgba(65,40,5,.9),0 1px 2px rgba(0,0,0,.42);filter:drop-shadow(0 0 1px rgba(229,174,52,.18)); }",
    'saved-star-subtle-premium'
  );

  result = once(
    result,
    "          .location-saved-remove { color:#d99a85;border:1px solid rgba(191,135,76,.42);background:linear-gradient(180deg,rgba(63,48,37,.82),rgba(27,22,20,.9));box-shadow:inset 0 1px rgba(255,229,194,.11),inset 0 -1px rgba(0,0,0,.5),0 1px 2px rgba(0,0,0,.46);text-shadow:0 1px 0 #000,0 0 4px rgba(222,120,91,.18); }\n          .location-saved-remove:hover,.location-saved-remove:focus-visible { outline:none;border-color:rgba(224,171,101,.62);background:linear-gradient(180deg,rgba(82,58,41,.92),rgba(37,27,23,.96));color:#f0b19b;box-shadow:inset 0 1px rgba(255,235,203,.15),inset 0 -1px rgba(0,0,0,.55),0 0 0 1px rgba(218,157,76,.08),0 2px 5px rgba(0,0,0,.5); }\n          .location-saved-remove:active { transform:scale(.94);filter:brightness(.92); }",
    "          .location-saved-remove { color:#c98f80;border:0;background:transparent;box-shadow:none;text-shadow:0 1px 0 rgba(0,0,0,.82),0 0 3px rgba(208,122,91,.14); }\n          .location-saved-remove:hover,.location-saved-remove:focus-visible { outline:none;border:0;background:rgba(214,91,91,.07);color:#efaa98;box-shadow:none; }\n          .location-saved-remove:active { transform:scale(.94);filter:brightness(.95); }",
    'saved-remove-subtle-premium'
  );

  return result;
}
