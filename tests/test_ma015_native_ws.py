"""MA-015: real HA WebSocket connection identity and Vault ownership smoke."""
from uuid import uuid4

from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.gewitterradar.build_info import BUILD_VERSION
from custom_components.gewitterradar.const import DOMAIN, DEFAULT_OPTIONS
from custom_components.gewitterradar.monitored_areas.config import CONF_MONITORED_AREAS_ENABLED


async def test_ma015_ws_uses_authenticated_identity_and_rejects_profile_spoofing(
    hass, hass_ws_client, hass_access_token, hass_read_only_access_token
):
    assert await async_setup_component(hass, "websocket_api", {})
    assert await async_setup_component(hass, DOMAIN, {})
    options={**DEFAULT_OPTIONS, CONF_MONITORED_AREAS_ENABLED: True}
    entry=MockConfigEntry(domain=DOMAIN,title="GewitterRadar",options=options)
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert entry.runtime_data.monitored_areas is not None
    assert entry.runtime_data.monitored_areas.api is not None
    reader=await hass_ws_client(hass,hass_read_only_access_token)
    admin=await hass_ws_client(hass,hass_access_token)

    async def settings_create(client):
        await client.send_json_auto_id({
            "type":"gewitterradar/settings/create","schema":1,
            "build":BUILD_VERSION,
            "request":{"requestId":uuid4().hex,"name":"own profile"},
        })
        reply=await client.receive_json()
        assert reply["success"],reply
        return reply["result"]["profile"]["id"]

    reader_profile=await settings_create(reader)
    admin_profile=await settings_create(admin)
    async def send(client, op, request):
        await client.send_json_auto_id({
            "type":"gewitterradar/monitored_areas/"+op,"schema":1,"request":request,
        })
        return await client.receive_json()

    created=await send(reader,"location_create",{
        "profile_id":reader_profile,"request_id":str(uuid4()),
        "payload":{"name":"Synthetic","lat":0,"lon":0},
    })
    assert created["success"],created
    location_id=created["result"]["location"]["location_id"]
    own=await send(reader,"location_get",{"profile_id":reader_profile,
                                         "payload":{"location_id":location_id}})
    assert own["success"],own
    forged=await send(admin,"location_get",{"profile_id":reader_profile,
                                          "payload":{"location_id":location_id}})
    assert not forged["success"]
    assert forged["error"]["code"]=="profile_not_found"
    separate=await send(admin,"locations_list",{"profile_id":admin_profile,"payload":{}})
    assert separate["success"] and separate["result"]["locations"]==[]
    # Client-supplied admin/actor fields are never authorization.
    spoiled=await send(reader,"locations_list",{
        "profile_id":reader_profile,"payload":{"admin":True,"actor_user_id":"spoofed"}})
    assert not spoiled["success"] and spoiled["error"]["code"]=="invalid_request"
    # Existing routes must become inert after unload, even though HA keeps WS registrations.
    assert await hass.config_entries.async_unload(entry.entry_id)
    disabled=await send(reader,"locations_list",{"profile_id":reader_profile,"payload":{}})
    assert not disabled["success"] and disabled["error"]["code"]=="feature_disabled"
