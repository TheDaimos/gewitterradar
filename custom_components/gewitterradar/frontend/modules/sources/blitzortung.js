import {defineModule} from "../core/runtime.js?v=41129r1";
export const MODULE_META=Object.freeze({
  id:"sources.blitzortung",version:"0.1.0",group:"Datenquellen & Verbindungen",
  function:"Blitzortung.org – Integration und Standorte",
  subfunctions:["Integrationsstatus","Mehrere Standorte","Tracker-Kopplung","Einstellungen (Nur Lesen)","Sensorstatus","Diagnoseexport"],
  file:"modules/sources/blitzortung.js"
});
export const installBlitzortungSource=defineModule(MODULE_META,()=>({
  _blitzortungSourceSnapshot(){
    const cached=this.__blitzortungSourceResult||null;
    const configured=typeof this._counterEntity==="function"?this._counterEntity():null;
    const counter=configured?this._hass?.states?.[configured]:null;
    const optionsId=typeof this._locationSelectEntity==="function"?this._locationSelectEntity():null;
    const chooser=optionsId?this._hass?.states?.[optionsId]:null;
    const locations=Array.isArray(chooser?.attributes?.options)?chooser.attributes.options.filter(value=>typeof value==="string").slice(0,100):[];
    return {
      source:"blitzortung",checkedAt:this.__blitzortungSourceCheckedAt||null,
      status:cached?.integrationInstalled?(cached.entries?.some(e=>e.loaded)?"available":"degraded"):(this.__blitzortungSourceError?"unknown":cached?"missing":"not_checked"),
      method:cached?"gewitterradar/data_sources (Home Assistant, admin)":"local_entity_only",
      error:this.__blitzortungSourceError||null,
      installed:cached?.integrationInstalled??null,
      entries:cached?.entries||[],
      referenceTrackers:cached?.referenceTrackers||[],
      linkedEntries:cached?.linkedEntries??null,
      geoLocationEntities:cached?.geoLocationEntities??null,
      counter:{entityId:configured,state:counter?.state??null,exists:!!counter,
        available:!!counter&&!["unknown","unavailable"].includes(counter.state)},
      savedLocations:{entityId:optionsId,selected:chooser?.state||null,options:locations},
      note:"Installations-, Kopplungs- und Sensorstatus sind getrennte Informationen. Keine Blitzereignisse sind kein Fehler."
    };
  },
  async _refreshBlitzortungSources(){
    if(this.__blitzortungSourceRequest)return this.__blitzortungSourceRequest;
    const load=async()=>{
      if(typeof this._hass?.callWS!=="function"){
        this.__blitzortungSourceError="Home Assistant WebSocket nicht verfügbar";
        return this._blitzortungSourceSnapshot();
      }
      try{
        const response=await this._hass.callWS({type:"gewitterradar/data_sources"});
        if(response?.schema!=="gewitterradar.data-sources.v1"||!Array.isArray(response.entries))throw Error("Unerwartete Datenquellen-Antwort");
        this.__blitzortungSourceResult=response;
        this.__blitzortungSourceError=null;
      }catch(error){
        this.__blitzortungSourceError=String(error?.message||error);
        // A missing native backend must never be misreported as an absent integration.
        this.__blitzortungSourceResult=null;
      }
      this.__blitzortungSourceCheckedAt=new Date().toISOString();
      return this._blitzortungSourceSnapshot();
    };
    this.__blitzortungSourceRequest=load().finally(()=>{this.__blitzortungSourceRequest=null;});
    return this.__blitzortungSourceRequest;
  }
}));
