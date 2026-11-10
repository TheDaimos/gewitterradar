"""Targeted UTF-8 and source parity assertions on actual DEV install ZIPs."""
from pathlib import Path
import sys, zipfile

root = Path(__file__).resolve().parents[1]
packages = sorted(Path(sys.argv[1]).glob('*.zip'))
assert len(packages) == 2, 'Expected integration and dashboard packages'
names = ['display-quick.js', 'eye-hub.js', 'eye-hub-view.js', 'eye-hub-model.js', 'eye-hub-locales.js', 'eye-neon.js', 'eye-neon-wow.js']
for package in packages:
    with zipfile.ZipFile(package) as archive:
        assert archive.testzip() is None
        for name in names:
            matches = [entry for entry in archive.namelist() if entry.endswith('/modules/weather/' + name)]
            assert len(matches) == 1, (package.name, name, matches)
            data = archive.read(matches[0])
            assert data == (root / 'frontend/modules/weather' / name).read_bytes()
            text = data.decode('utf-8')
            assert not any(bad in text for bad in ['\u00c3', '\u00c2', '\ufffd']), (package.name, name, 'menu mojibake')
            if name == 'display-quick.js':
                for label in ['Präzise', 'Strömungsdichte', 'Weiß', 'Türkis', 'Schlangenförmige']:
                    assert label in text, (package.name, label)
        print('PASS actual ZIP CRC, UTF-8 labels and canonical UI/WOW sources:', package.name)
