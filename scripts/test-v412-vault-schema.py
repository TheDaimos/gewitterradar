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

hub = 'gewitterradar:legend-hub:v1'
settings = {hub: {'schema': 1, 'icon': 2, 'slots': ['wind', None, 'temperature'],
                 'position': {'x': 1, 'y': 0}, 'direction': 'vertical', 'autoClose': False,
                 'legends': {'temperature': {'presentation': 'compact', 'orientation': 'vertical',
                     'size': 'XL', 'density': 'detailed', 'style': 'thermometer', 'material': 'platinum',
                     'labels': 'inside', 'ticks': 'inside', 'foreground': 'auto',
                     'shadow': True, 'outline': True, 'mode': 'on'}}}}
assert schema.validate_settings(settings) == settings
assert schema.decode_value(hub, schema.encode_value(hub, settings[hub])) == settings[hub]
for invalid in [{'icon': 3}, {'slots': ['invented']}, {'slots': ['wind'] * 13},
                {'legends': {'wind': {'size': 'XXL'}}}, {'position': {'x': 2, 'y': 0}}]:
    try:
        schema.validate_settings({hub: invalid})
    except schema.VaultError:
        pass
    else:
        raise AssertionError(f'Invalid Legend Hub accepted: {invalid}')
print('PASS: actual Vault schema round-trips Legend Hub appearance, position, empty slots; rejects unsafe values')
