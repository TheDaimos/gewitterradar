"""Exercise the integration-served common frontend through real HA HTTP."""
from hashlib import sha256
from pathlib import Path

from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component

ROOT = Path(__file__).resolve().parents[1]


async def test_shared_frontend_routes_serve_exact_dashboard_bytes(hass: HomeAssistant, hass_client) -> None:
    """Static serving is idempotent and does not alter the common payload."""
    assert await async_setup_component(hass, "gewitterradar", {})
    assert await async_setup_component(hass, "gewitterradar", {})
    client = await hass_client()
    for name in (
        "gewitterradar.js",
        "assets/gewitterradar-about-close-premium.webp",
        "assets/gewitterradar-about-copy-scroll.webp",
        "assets/gewitterradar-about-hero-v2.webp",
        "assets/gewitterradar-about-dedication-v4.webp",
    ):
        response = await client.get("/gewitterradar/" + name)
        assert response.status == 200
        actual = await response.read()
        expected = (ROOT / "dashboard" / "dist" / name).read_bytes()
        assert sha256(actual).digest() == sha256(expected).digest()
    assert (await client.get("/gewitterradar/not-present.js")).status == 404
