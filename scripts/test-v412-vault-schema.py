"""Execute the actual presentation schema without importing Home Assistant."""
import importlib.util
from pathlib import Path

spec = importlib.util.spec_from_file_location('vault_schema', Path(__file__).resolve().parents[1] / 'custom_components/gewitterradar/vault_schema.py')
schema = importlib.util.module_from_spec(spec)
spec.loader.exec_module(schema)
key = 'gewitterradar:eye-bubble:v1'
for layout in ['fixed', 'dynamic']:
    settings = {key: {'schema': 1, 'auraLayout': layout, 'slots': [{'id': 'slot-1', 'functionId': 'wind'}]}}
    assert schema.validate_settings(settings) == settings
    assert schema.decode_value(key, schema.encode_value(key, settings[key])) == settings[key]
legacy = {key: {'grouped': True, 'slots': [{'id': 'slot-1', 'functionId': 'wind'}]}}
assert schema.validate_settings(legacy) == legacy
try:
    schema.validate_settings({key: {'auraLayout': 'unknown'}})
except schema.VaultError:
    pass
else:
    raise AssertionError('Unknown arrangement accepted')
print('PASS: actual Vault schema accepts both layouts and unchanged legacy profiles, rejects invalid values')
