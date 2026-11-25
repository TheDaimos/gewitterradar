// MA-016: opt-in read adapter for the existing saved-location UI.
// It must not replace the Local-To-do inventory before the verified MA-020 cutover.
// No browser-supplied identity, direct DB access, or implicit reference-tracker updates.
export const PLACE_MODES=Object.freeze(["legacy","migration_pending","db_active"]);
const coordinate = (number,min,max) => {
  if (typeof number!=="number" || !Number.isFinite(number) || number<min || number>max)
    throw new TypeError("MA_INVALID_COORDINATES");
  return number;
};
export function formatCoordinates({latitude,longitude}) {
  const lat=coordinate(latitude,-90,90),lon=coordinate(longitude,-180,180);
  return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
}
export function parseCoordinates(raw) {
  if(typeof raw!=="string" || raw.length>100)throw new TypeError("MA_INVALID_COORDINATES");
  const match=raw.trim().match(/^([+-]?(?:[0-9]+(?:[.][0-9]+)?|[.][0-9]+))[ \t]*[,;][ \t]*([+-]?(?:[0-9]+(?:[.][0-9]+)?|[.][0-9]+))$/);
  if(!match)throw new TypeError("MA_INVALID_COORDINATES");
  return {latitude:coordinate(Number(match[1]),-90,90),longitude:coordinate(Number(match[2]),-180,180)};
}
const unavailable=()=>{throw new Error("MA_PLACE_MODE_NOT_READY");};
const defaultLegacy=Object.freeze({listPlaces:unavailable,saveCandidate:unavailable});
export function createLocationPort({hass, profileId, legacy=defaultLegacy, focusMap, selectReference, openDetails}={}) {
  if(typeof legacy?.listPlaces!=="function"||typeof legacy?.saveCandidate!=="function") {
    throw new TypeError("MA_LOCATION_LEGACY_PORT_REQUIRED");
  }
  let mode="legacy";
  const request = async (command, payload={}, extra={}) => {
    if(typeof hass?.callWS!=="function" || !profileId) throw new Error("MA_LOCATION_VAULT_NOT_READY");
    return hass.callWS({type:"gewitterradar/monitored_areas/"+command,
      schema:1,request:{profile_id:profileId,payload,...extra}});
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
    async saveCandidate(candidate,requestId){
      if(mode!=="db_active")return legacy.saveCandidate(candidate);
      if(typeof requestId!=="string")throw new TypeError("MA_REQUEST_ID_REQUIRED");
      const name=String(candidate?.name||candidate?.displayLabel||"").trim();
      if(!name || name.length>120)throw new TypeError("MA_INVALID_NAME");
      const lat=coordinate(candidate?.latitude,-90,90);
      const lon=coordinate(candidate?.longitude,-180,180);
      return request("location_create",{name,lat,lon},{request_id:requestId});
    },
    async renamePlace(locationId,name,expectedRevision,requestId){
      if(mode!=="db_active")throw new Error("MA_PLACE_DB_NOT_ACTIVE");
      if(typeof locationId!=="string"||typeof requestId!=="string"||
         !Number.isInteger(expectedRevision)||expectedRevision<1)throw new TypeError("MA_INVALID_REQUEST");
      const clean=String(name||"").trim();
      if(!clean||clean.length>120)throw new TypeError("MA_INVALID_NAME");
      return request("location_update",{location_id:locationId,name:clean},{
        request_id:requestId,expected_revision:expectedRevision
      });
    },
    copyCoordinates:formatCoordinates,
    parseCoordinates,
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
