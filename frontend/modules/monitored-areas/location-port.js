// MA-016: opt-in read adapter for the existing saved-location UI.
// It must not replace the Local-To-do inventory before the verified MA-020 cutover.
// No browser-supplied identity, direct DB access, or implicit reference-tracker updates.
export const PLACE_MODES=Object.freeze(["legacy","migration_pending","db_active"]);
const unavailable=()=>{throw new Error("MA_PLACE_MODE_NOT_READY");};
const defaultLegacy=Object.freeze({listPlaces:unavailable,saveCandidate:unavailable});
export function createLocationPort({hass, profileId, legacy=defaultLegacy, focusMap, selectReference, openDetails}={}) {
  if(typeof legacy?.listPlaces!=="function"||typeof legacy?.saveCandidate!=="function") {
    throw new TypeError("MA_LOCATION_LEGACY_PORT_REQUIRED");
  }
  let mode="legacy";
  const request = async (command, payload={}) => {
    if(typeof hass?.callWS!=="function" || !profileId) throw new Error("MA_LOCATION_VAULT_NOT_READY");
    return hass.callWS({type:"gewitterradar/monitored_areas/"+command,
      schema:1,request:{profile_id:profileId,payload}});
  };
  return Object.freeze({
    get mode(){return mode;},
    // An arbitrary browser flag cannot declare the DB authoritative. The
    // backend must report db_active after a verified MA-020 finalization.
    async reconcileMode(){
      const status=await request("status");
      const serverMode=status?.capabilities?.saved_places_mode;
      mode=serverMode==="db_active"?"db_active":
           serverMode==="migration_pending"?"migration_pending":"legacy";
      return mode;
    },
    async listPlaces(query="",cursor=null){
      if(typeof query!=="string"||query.length>120)throw new TypeError("MA_PLACE_INVALID_QUERY");
      if(mode!=="db_active")return legacy.listPlaces(query,cursor);
      const result=await request("places_list",{query,cursor,limit:50});
      if(result?.mode!=="db_active")throw new Error("MA_PLACE_CUTOVER_NOT_VERIFIED");
      if(!Array.isArray(result.places))throw new Error("MA_PLACE_INVALID_RESPONSE");
      return result;
    },
    async previewDbPlaces(query="",cursor=null){
      if(mode!=="migration_pending"&&mode!=="db_active")throw new Error("MA_PLACE_MODE_NOT_READY");
      return request("places_list",{query,cursor,limit:50});
    },
    async saveCandidate(candidate){
      if(mode==="db_active")throw new Error("MA_PLACE_WRITE_PENDING_MA017");
      return legacy.saveCandidate(candidate);
    },
    selectReference(candidate){
      if(typeof selectReference!=="function")throw new Error("MA_REFERENCE_HANDLER_UNAVAILABLE");
      return selectReference(candidate);
    },
    focusMap({latitude,longitude,zoomHint}={}){
      if(typeof focusMap!=="function")throw new Error("MA_CAMERA_HANDLER_UNAVAILABLE");
      const lat=Number(latitude),lon=Number(longitude);
      if(!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180)
        throw new TypeError("MA_INVALID_COORDINATES");
      // Camera-only callback. Never invoke selectReference on this path.
      return focusMap({latitude:lat,longitude:lon,zoomHint});
    },
    openDetails(locationId){
      if(typeof openDetails!=="function")throw new Error("MA_DETAILS_HANDLER_UNAVAILABLE");
      return openDetails(locationId);
    },
  });
}
