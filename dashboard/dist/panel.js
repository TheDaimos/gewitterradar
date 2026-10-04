const PANEL_TAG="gewitterradar-panel";
const CARD_TAG="gewitterradar-card";

async function ensureGewitterradarCard(){
  if(!customElements.get(CARD_TAG))await import("./gewitterradar.js");
  await customElements.whenDefined(CARD_TAG);
}

class GewitterradarPanel extends HTMLElement{
  constructor(){super();this.attachShadow({mode:"open"});this._hass=null;this._card=null;this._ready=ensureGewitterradarCard()}
  connectedCallback(){this._ensureShell();void this._ready.then(()=>this._ensureCard()).catch(error=>this._showError(error))}
  set hass(value){this._hass=value;if(this._card)this._card.hass=value} get hass(){return this._hass}
  set panel(value){this._panel=value} get panel(){return this._panel}
  set narrow(value){this._narrow=value} get narrow(){return this._narrow}
  set route(value){this._route=value} get route(){return this._route}
  _ensureShell(){
    if(this.shadowRoot.querySelector("main"))return;
    const style=document.createElement("style");
    style.textContent=`:host{display:block;width:100%;height:100%;min-height:100%;box-sizing:border-box;background:var(--primary-background-color,#111);overflow:auto}main{display:block;width:100%;min-height:100%;box-sizing:border-box}gewitterradar-card{display:block;width:100%}.panel-error{margin:24px;padding:16px;border:1px solid var(--error-color,#db4437);border-radius:12px;color:var(--primary-text-color,#fff);background:var(--card-background-color,#1c1c1c);font:500 14px/1.45 system-ui,sans-serif}`;
    const main=document.createElement("main");main.setAttribute("aria-label","Gewitterradar");this.shadowRoot.append(style,main);
  }
  _ensureCard(){this._ensureShell();if(this._card)return;const card=document.createElement(CARD_TAG);card.setConfig({type:"custom:gewitterradar-card"});if(this._hass)card.hass=this._hass;this.shadowRoot.querySelector("main").replaceChildren(card);this._card=card}
  _showError(error){this._ensureShell();const box=document.createElement("div");box.className="panel-error";box.textContent="Gewitterradar konnte nicht geladen werden. Bitte Home Assistant vollständig neu laden.";box.title=error instanceof Error?error.message:String(error);this.shadowRoot.querySelector("main").replaceChildren(box)}
}
if(!customElements.get(PANEL_TAG))customElements.define(PANEL_TAG,GewitterradarPanel);
