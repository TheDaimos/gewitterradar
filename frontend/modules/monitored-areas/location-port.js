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
const uuidV4 = value => typeof value==="string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(value);
const ownProfile = value => typeof value==="string" && /^[0-9a-f]{32}$/.test(value);
const safeLocation = (mode,locationId) => {
  if(mode!=="db_active")throw new Error("MA_PLACE_DB_NOT_ACTIVE");
  if(!uuidV4(locationId))throw new TypeError("MA_INVALID_REQUEST");
  return locationId;
};
const safeMutation = (revision,requestId) => {
  if(!Number.isInteger(revision)||revision<1||!uuidV4(requestId))
    throw new TypeError("MA_INVALID_REQUEST");
  return {expected_revision:revision,request_id:requestId};
};
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
    async listPlaces(query="",cursor=null,includeArchived=false){
      if(typeof query!=="string"||query.length>120)throw new TypeError("MA_PLACE_INVALID_QUERY");
      if(typeof includeArchived!=="boolean")throw new TypeError("MA_PLACE_INVALID_REQUEST");
      if(mode!=="db_active")return legacy.listPlaces(query,cursor);
      const result=await request("places_list",includeArchived
        ?{query,cursor,limit:50,include_archived:true}:{query,cursor,limit:50});
      if(result?.mode!=="db_active")throw new Error("MA_PLACE_CUTOVER_NOT_VERIFIED");
      if(!Array.isArray(result.places))throw new Error("MA_PLACE_INVALID_RESPONSE");
      return result;
    },
    async listBlitzortungInventory(locationId){
      // MA-025: admin/ACL-gated observational inventory. Never binds locations.
      safeLocation(mode,locationId);
      const result=await request("blitzortung_inventory",{location_id:locationId});
      if(result?.read_only!==true||!Array.isArray(result?.locations)||
         result.locations.length>100)throw new Error("MA_BLITZORTUNG_INVALID_RESPONSE");
      for(const row of result.locations){
        if(!row||typeof row.entry_id!=="string"||typeof row.title!=="string"||
           !["trackers","counters","distances","other_sensors"].every(k=>
             Array.isArray(row[k])&&row[k].length<=200&&row[k].every(id=>
               typeof id==="string"&&/^[a-z_]+\\.[a-z0-9_]+$/.test(id))))
          throw new Error("MA_BLITZORTUNG_INVALID_RESPONSE");
      }
      return result.locations;
    },
    async checkTrackerName(locationId,name){
      // Read-only MA-023 validation; no automatic tracker creation or assignment.
      safeLocation(mode,locationId);
      if(typeof name!=="string"||!name.trim()||name.length>120)
        throw new TypeError("MA_TRACKER_INVALID_NAME");
      const result=await request("tracker_name_check",{location_id:locationId,name});
      if(typeof result?.available!=="boolean")throw new Error("MA_TRACKER_INVALID_RESPONSE");
      if(result.available===true && (typeof result.entity_id!=="string"||
          !/^device_tracker\\.[a-z0-9_]+$/.test(result.entity_id)))
        throw new Error("MA_TRACKER_INVALID_RESPONSE");
      return result;
    },
    async getLocation(locationId){
      // Read-only, authenticated, profile-scoped HA command. Never use a
      // migration-pending SQLite row as authoritative location information.
      if(mode!=="db_active")throw new Error("MA_PLACE_DB_NOT_ACTIVE");
      if(typeof locationId!=="string"||! /^[0-9a-f]{8}-[0-9a-f-]{27,}$/.test(locationId))
        throw new TypeError("MA_INVALID_REQUEST");
      const response=await request("location_get",{location_id:locationId});
      if(!response?.location||response.location.location_id!==locationId)
        throw new Error("MA_PLACE_INVALID_RESPONSE");
      return response.location;
    },
    async listLinks(locationId){
      safeLocation(mode,locationId);
      const result=await request("links_list",{location_id:locationId});
      if(!uuidV4(result?.own_link_id)||!Number.isInteger(result?.shared_link_count)||
         result.shared_link_count<1)throw new Error("MA_LINK_INVALID_RESPONSE");
      return result;
    },
    async getPreferences(locationId){
      safeLocation(mode,locationId);
      const result=await request("preferences_get",{location_id:locationId});
      const p=result?.preferences;
      if(!p||!uuidV4(p.link_id)||!Number.isInteger(p.revision)||p.revision<1)
        throw new Error("MA_PREFERENCES_INVALID_RESPONSE");
      return p;
    },
    async updatePreferences(linkId,patch,revision,requestId){
      if(mode!=="db_active")throw new Error("MA_PLACE_DB_NOT_ACTIVE");
      if(!uuidV4(linkId)||!patch||typeof patch!=="object"||Array.isArray(patch))
        throw new TypeError("MA_INVALID_REQUEST");
      const allowed=new Set(["push_enabled","critical_enabled","notification_mode",
        "closure_enabled","quiet_minutes","status_push","display_settings_json"]);
      const keys=Object.keys(patch);
      if(!keys.length||keys.some(k=>!allowed.has(k)))throw new TypeError("MA_INVALID_REQUEST");
      const result=await request("preferences_update",{link_id:linkId,...patch},safeMutation(revision,requestId));
      if(!result?.preferences||result.preferences.link_id!==linkId)
        throw new Error("MA_PREFERENCES_INVALID_RESPONSE");
      return result.preferences;
    },
    async shareLocation(locationId,targetUserId,targetProfileId,revision,requestId,{transfer=false}={}){
      safeLocation(mode,locationId);
      if(typeof targetUserId!=="string"||!targetUserId.trim()||targetUserId.length>128||
         !ownProfile(targetProfileId)||typeof transfer!=="boolean")
        throw new TypeError("MA_INVALID_TARGET");
      const result=await request(transfer?"links_transfer":"links_share",{
        location_id:locationId,target_user_id:targetUserId.trim(),
        target_profile_id:targetProfileId
      },safeMutation(revision,requestId));
      if(!uuidV4(result?.link_id)||result.location_revision!==revision+1)
        throw new Error("MA_LINK_INVALID_RESPONSE");
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
    async archivePlace(locationId,expectedRevision,requestId){
      if(mode!=="db_active")throw new Error("MA_PLACE_DB_NOT_ACTIVE");
      if(typeof locationId!=="string"||typeof requestId!=="string"||
         !Number.isInteger(expectedRevision)||expectedRevision<1)
        throw new TypeError("MA_INVALID_REQUEST");
      return request("location_archive",{location_id:locationId},{
        request_id:requestId,expected_revision:expectedRevision});
    },
    async restorePlace(locationId,expectedRevision,requestId){
      if(mode!=="db_active")throw new Error("MA_PLACE_DB_NOT_ACTIVE");
      if(typeof locationId!=="string"||typeof requestId!=="string"||
         !Number.isInteger(expectedRevision)||expectedRevision<1)
        throw new TypeError("MA_INVALID_REQUEST");
      return request("location_restore",{location_id:locationId},{
        request_id:requestId,expected_revision:expectedRevision});
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
