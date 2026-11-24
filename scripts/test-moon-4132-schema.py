import runpy
s=runpy.run_path('custom_components/gewitterradar/vault_schema.py');key='gewitterradar:legend-hub:v1'
for frame in ['platinum','gold','goldClassic']:
    for unit in ['auto','km','m','mi','ft']:
        value={key:{'moonUi':{'frameMaterial':frame,'distanceUnit':unit}}}
        assert s['validate_settings'](value)==value
for unit in ['yards',None,True,1]:
    try:s['validate_settings']({key:{'moonUi':{'distanceUnit':unit}}})
    except s['VaultError']:pass
    else:raise AssertionError(unit)
old={key:{'slots':['wind',None,'moon'],'moonUi':{'frameMaterial':'gold'}}};assert s['validate_settings'](old)==old
print('PASS 15 frame/unit schema combinations, invalid unit types rejected and legacy profile unchanged')
