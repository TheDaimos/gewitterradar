const replaceOnce=(source,from,to,label)=>{
  if(source.split(from).length!==2)throw new Error(`V4.07.20 anchor changed (${label})`);
  return source.replace(from,to);
};

export function v407Test20RegressionDelta(source){
  let result=source;
  result=replaceOnce(result,
    "  const CARD_DISPLAY_VERSION = '4.07.19';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST19-2026-09-14';",
    "  const CARD_DISPLAY_VERSION = '4.07.20';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST20-2026-09-14';",
    'version/build marker');

  // The frozen markup used a lower-case `min`, while the 19-language static
  // translation map intentionally keys the KPI heading as `Treffer · 60 Min`.
  // Restore the exact source key so the existing i18n walker translates it.
  result=replaceOnce(result,
    '<span class="kpi-label">Treffer · 60 min</span>',
    '<span class="kpi-label">Treffer · 60 Min</span>',
    'hits KPI static i18n key');

  result=replaceOnce(result,
    "          .diagnostic-panel-badge { position:fixed;z-index:10048;pointer-events:none;padding:2px 5px;border-radius:4px;background:#ff3eae;color:#16000f;font:900 10px/1.2 system-ui,sans-serif;box-shadow:0 1px 4px #000; }",
    "          .diagnostic-panel-badge { position:fixed;z-index:10048;pointer-events:none;padding:2px 5px;border-radius:4px;background:#ff3eae;color:#16000f;font:900 10px/1.2 system-ui,sans-serif;box-shadow:0 1px 4px #000; }\n          .diagnostic-main-frame { position:fixed;z-index:10046;pointer-events:none;border:2px solid rgba(77,229,255,.82);box-sizing:border-box;box-shadow:inset 0 0 0 1px rgba(0,0,0,.42); }\n          .diagnostic-main-title { position:fixed;z-index:10050;pointer-events:none;padding:2px 6px;border-radius:4px;background:#09202a;color:#73e9ff;border:1px solid rgba(77,229,255,.65);font:900 10px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em;box-shadow:0 1px 4px #000; }\n          .diagnostic-main-cell { position:fixed;z-index:10047;pointer-events:none;box-sizing:border-box;border-right:1px solid rgba(77,229,255,.34);border-bottom:1px solid rgba(77,229,255,.34);color:#aef4ff;font:800 9px/1 ui-monospace,SFMono-Regular,Menlo,monospace;text-shadow:0 1px 2px #000,0 0 4px #001820;display:flex;align-items:flex-start;justify-content:flex-start;padding:3px 4px; }\n          .diagnostic-overlay.fine .diagnostic-main-cell { background-image:linear-gradient(rgba(64,255,162,.10) 1px,transparent 1px),linear-gradient(90deg,rgba(64,255,162,.10) 1px,transparent 1px);background-size:20% 20%; }",
    'diagnostic main grid styling');

  result=replaceOnce(result,
    "          .diagnostic-visuals-hidden .diagnostic-overlay,.diagnostic-visuals-hidden .diagnostic-panel-badge,.diagnostic-visuals-hidden .diagnostic-panel-box,.diagnostic-visuals-hidden .diagnostic-line,.diagnostic-visuals-hidden .diagnostic-rect,.diagnostic-visuals-hidden .diagnostic-dot,.diagnostic-visuals-hidden .diagnostic-label { display:none!important; }",
    "          .diagnostic-visuals-hidden .diagnostic-overlay,.diagnostic-visuals-hidden .diagnostic-panel-badge,.diagnostic-visuals-hidden .diagnostic-panel-box,.diagnostic-visuals-hidden .diagnostic-main-frame,.diagnostic-visuals-hidden .diagnostic-main-title,.diagnostic-visuals-hidden .diagnostic-main-cell,.diagnostic-visuals-hidden .diagnostic-line,.diagnostic-visuals-hidden .diagnostic-rect,.diagnostic-visuals-hidden .diagnostic-dot,.diagnostic-visuals-hidden .diagnostic-label { display:none!important; }",
    'diagnostic visual-hide cleanup');

  result=replaceOnce(result,
    "    _renderDiagnosticOverlay() {\n      if(!this._diagnostics.enabled)return;",
    "    _renderDiagnosticMainGrid(overlay) {\n      if(!overlay||!this._diagnostics.enabled||!this._diagnostics.visualsVisible||this._diagnostics.grid==='off')return;\n      const main=this.shadow?.querySelector('.main-grid');if(!main)return;\n      const rect=main.getBoundingClientRect();if(rect.width<1||rect.height<1)return;\n      const columns=10,rows=10,cellWidth=rect.width/columns,cellHeight=rect.height/rows;\n      this._appendDiagnosticNode(overlay,'diagnostic-main-frame',`left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px`);\n      this._appendDiagnosticNode(overlay,'diagnostic-main-title',`left:${rect.left+3}px;top:${Math.max(2,rect.top-18)}px`,'MAIN · A1–J10');\n      for(let row=0;row<rows;row++){for(let column=0;column<columns;column++){const label=`${String.fromCharCode(65+column)}${row+1}`;const cell=this._appendDiagnosticNode(overlay,'diagnostic-main-cell',`left:${rect.left+column*cellWidth}px;top:${rect.top+row*cellHeight}px;width:${cellWidth}px;height:${cellHeight}px`,label);cell.dataset.diagnosticMainCell=label;}}\n    }\n\n    _renderDiagnosticOverlay() {\n      if(!this._diagnostics.enabled)return;",
    'diagnostic main grid renderer');

  result=replaceOnce(result,
    "        if(this._diagnostics.visualsVisible){\n          const o=this._diagnostics.overlays;",
    "        if(this._diagnostics.visualsVisible){\n          this._renderDiagnosticMainGrid(overlay);\n          const o=this._diagnostics.overlays;",
    'diagnostic main grid activation');

  return result;
}
