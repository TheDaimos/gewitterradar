"""P1 regressions for the actual Vault schema and conflict merge without HA bootstrap."""
import ast
import importlib.util
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
SCHEMA_PATH = ROOT / "custom_components/gewitterradar/vault_schema.py"
VAULT_PATH = ROOT / "custom_components/gewitterradar/settings_vault.py"

spec = importlib.util.spec_from_file_location("gr_vault_schema_p1", SCHEMA_PATH)
schema = importlib.util.module_from_spec(spec)
spec.loader.exec_module(schema)
source = ast.parse(VAULT_PATH.read_text(encoding="utf-8"))
functions = [n for n in source.body if isinstance(n, ast.FunctionDef)
             and n.name in ("field_equal", "merge_fields")]
assert {f.name for f in functions} == {"field_equal", "merge_fields"}
namespace = {"MISSING": object(), "same": schema.same, "VaultError": schema.VaultError}
exec(compile(ast.Module(body=functions, type_ignores=[]), str(VAULT_PATH), "exec"), namespace)
merge_fields = namespace["merge_fields"]

EYE_KEY = "gewitterradar:eye-bubble:v1"
SYNOPTIC_KEY = "gewitterradar:synoptic-ui:v1"


def eye_four():
    ids = ["wind", "temperature", "precipitation", "weather-display"]
    return {"schema": 1, "grouped": False, "aura": True,
            "slots": [{"id": f"slot-{i+1}", "functionId": id} for i, id in enumerate(ids)],
            "colors": {id: "#00FFF0" for id in ids}}


class SynopticVaultP1Tests(unittest.TestCase):
    def test_fifth_slot_and_color_reach_actual_server_validator(self):
        prior = eye_four()
        latest = json.loads(json.dumps(prior))
        latest["slots"].append({"id": "slot-5", "functionId": "synoptic"})
        latest["colors"]["synoptic"] = "#FFC442"
        schema.validate_value(EYE_KEY, latest)
        self.assertEqual(len(latest["slots"]), 5)
        with self.assertRaises(schema.VaultError):
            schema.validate_value(EYE_KEY, {**latest, "slots": [*latest["slots"][:-1],
                {"id": "slot-5", "functionId": "unsupported-provider"}]})

    def test_synoptic_own_settings_are_profile_keys(self):
        config = {"visible": False, "centers": True, "isobars": True,
                  "highColor": "#FFC442", "lowColor": "#B000FF",
                  "quickPositions": {"standard": {"x": .32, "y": .44}}}
        self.assertIn(SYNOPTIC_KEY, schema.SETTINGS_KEYS)
        schema.validate_value(SYNOPTIC_KEY, config)
        self.assertEqual(json.loads(json.dumps(config)), config)

    def test_stale_four_slot_update_preserves_server_fifth_slot_and_aura(self):
        initial = eye_four()
        current = json.loads(json.dumps(initial))
        current["slots"].append({"id": "slot-5", "functionId": "synoptic"})
        current["colors"]["synoptic"] = "#FFC442"
        current["aura"] = True
        stale = json.loads(json.dumps(initial))
        stale["grouped"] = True
        result = merge_fields(current, initial, stale)
        schema.validate_value(EYE_KEY, result)
        rehydrated = json.loads(json.dumps(result))
        self.assertEqual(rehydrated["slots"][-1]["functionId"], "synoptic")
        self.assertEqual(rehydrated["colors"]["synoptic"], "#FFC442")
        self.assertTrue(rehydrated["aura"])
        self.assertTrue(rehydrated["grouped"])
        self.assertEqual(rehydrated["slots"][:4], initial["slots"])

    def test_two_conflicting_slot_changes_do_not_silently_erase_fifth(self):
        before = eye_four()
        current = json.loads(json.dumps(before))
        current["slots"].append({"id": "slot-5", "functionId": "synoptic"})
        stale = json.loads(json.dumps(before))
        stale["slots"][0]["functionId"] = None
        with self.assertRaises(schema.VaultError):
            merge_fields(current, before, stale)


if __name__ == "__main__":
    unittest.main()
