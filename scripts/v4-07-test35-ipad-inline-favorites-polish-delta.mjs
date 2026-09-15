// V4.07.35: iPad-only Help inline-action polish plus a stronger background-free saved-place remove glyph.
// Exact baseline: executable V4.07.34 candidate.
// Android inline × / ↶ is accepted and must remain unchanged.

function once(source, from, to, label) {
  if (source.split(from).length !== 2) {
    throw new Error(`V4.07.35 anchor changed (${label})`);
  }
  return source.replace(from, to);
}

export function v407Test35IpadInlineFavoritesPolishDelta(source) {
  let result = source;

  result = once(
    result,
    "  const CARD_DISPLAY_VERSION = '4.07.34';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST34-2026-09-15';",
    "  const CARD_DISPLAY_VERSION = '4.07.35';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST35-2026-09-15';",
    'display-and-build'
  );

  // Preserve the accepted Android action tokens exactly. Add a WebKit+iPad-width override only.
  const restoreAnchor='.help-action-restore:before{content:"↶";top:43%;transform:translate(-50%,-50%);font-size:1.04em;color:#e5edf2}';
  const ipadOverride='@supports(-webkit-touch-callout:none){@media(min-width:700px){.help-action-delete:before{top:50%;transform:translate(-50%,-50%);font-size:1.08em}.help-action-restore:before{content:"";top:50%;width:1.04em;height:1.04em;transform:translate(-50%,-50%);background:url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22%3E%3Cpath d=%22M9.5 5.5 5 10l4.5 4.5M5.6 10h6.9c3.9 0 6.5 2.2 6.5 5.4 0 2.9-2.2 5.1-5.3 5.1h-3.4%22 fill=%22none%22 stroke=%22%23121b21%22 stroke-width=%224.2%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/%3E%3Cpath d=%22M9.5 5.5 5 10l4.5 4.5M5.6 10h6.9c3.9 0 6.5 2.2 6.5 5.4 0 2.9-2.2 5.1-5.3 5.1h-3.4%22 fill=%22none%22 stroke=%22%23e5edf2%22 stroke-width=%222.35%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/%3E%3C/svg%3E") center/contain no-repeat}}}';
  result = once(result, restoreAnchor, restoreAnchor + ipadOverride, 'ipad-only-help-action-polish');

  // Saved-place remove control: visibly stronger metal/depth, but absolutely no background or visible button shell.
  result = once(
    result,
    "          .location-saved-remove { color:#c98f80;border:0;background:transparent;box-shadow:none;text-shadow:0 1px 0 rgba(0,0,0,.82),0 0 3px rgba(208,122,91,.14); }\n          .location-saved-remove:hover,.location-saved-remove:focus-visible { outline:none;border:0;background:rgba(214,91,91,.07);color:#efaa98;box-shadow:none; }\n          .location-saved-remove:active { transform:scale(.94);filter:brightness(.95); }",
    "          .location-saved-remove { color:#d6a08e;border:0;background:transparent;box-shadow:none;font-family:Arial,Helvetica,sans-serif;font-weight:900;line-height:1;-webkit-text-stroke:.22px rgba(255,224,209,.28);text-shadow:0 -1px 0 rgba(255,232,218,.20),0 1px 0 rgba(65,27,21,.96),0 1px 2px rgba(0,0,0,.54);filter:drop-shadow(0 0 1px rgba(204,116,89,.18)); }\n          .location-saved-remove:hover,.location-saved-remove:focus-visible { outline:none;border:0;background:transparent;color:#efb09c;box-shadow:none;-webkit-text-stroke:.22px rgba(255,231,218,.34);text-shadow:0 -1px 0 rgba(255,239,229,.25),0 1px 0 rgba(71,29,22,.96),0 1px 3px rgba(0,0,0,.56);filter:drop-shadow(0 0 2px rgba(220,132,101,.24)); }\n          .location-saved-remove:active { transform:scale(.94);filter:brightness(.95) drop-shadow(0 0 1px rgba(204,116,89,.16)); }",
    'saved-remove-background-free-metal-depth'
  );

  return result;
}
