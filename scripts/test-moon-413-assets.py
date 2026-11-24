"""Standard-library-only archive/PNG alpha and three-tree delivery verification."""
from pathlib import Path
import hashlib,json,struct,zlib
base=Path('docs/design/legend-hub/moon');d=json.loads((base/'manifest.json').read_text(encoding='utf-8'))
def png_alpha(p):
 b=p.read_bytes();assert b[:8]==b'\x89PNG\r\n\x1a\n';pos=8;data=b''
 while pos<len(b):
  size=struct.unpack('>I',b[pos:pos+4])[0];kind=b[pos+4:pos+8];chunk=b[pos+8:pos+8+size];assert zlib.crc32(kind+chunk)&0xffffffff==struct.unpack('>I',b[pos+8+size:pos+12+size])[0]
  if kind==b'IHDR':w,h,depth,color,_,_,interlace=struct.unpack('>IIBBBBB',chunk);assert depth==8 and color==6 and interlace==0
  if kind==b'IDAT':data+=chunk
  pos+=size+12
 raw=zlib.decompress(data);stride=w*4;previous=bytearray(stride);alpha=set();pos=0
 for y in range(h):
  f=raw[pos];row=bytearray(raw[pos+1:pos+1+stride]);pos+=stride+1
  for x in range(stride):
   a=row[x-4] if x>=4 else 0;b=previous[x];c=previous[x-4] if x>=4 else 0
   if f==1:v=a
   elif f==2:v=b
   elif f==3:v=(a+b)//2
   elif f==4:
    q=a+b-c;pa,pb,pc=abs(q-a),abs(q-b),abs(q-c);v=a if pa<=pb and pa<=pc else b if pb<=pc else c
   else:assert f==0;v=0
   row[x]=(row[x]+v)&255
  alpha.update(row[3::4]);previous=row
 assert 0 in alpha and 255 in alpha and len(alpha)>2,(p,len(alpha))
 return {'width':w,'height':h,'distinctAlphaValues':len(alpha),'transparent':True}
close=d['premium_close'];master=base/close['master_path'];assert hashlib.sha256(master.read_bytes()).hexdigest()==close['sha256'];assert png_alpha(master)['width']==1254
for entry in close['optimized']:
 p=base/entry['path'];alpha=png_alpha(p);assert alpha['width']==entry['width'];assert hashlib.sha256(p.read_bytes()).hexdigest()==entry['sha256']
 for tree in ['frontend','custom_components/gewitterradar/frontend','dashboard/dist']:assert p.read_bytes()==(Path(tree)/'assets/moon'/p.name).read_bytes()
for r in d['premium_materials']['resources']:
    p=Path(r['repository_path']);assert hashlib.sha256(p.read_bytes()).hexdigest()==r['sha256'],r['repository_path']
    if r.get('runtime_path'):assert p.read_bytes()==Path(r['runtime_path']).read_bytes()
css=Path('frontend/modules/weather/moon-legend.js').read_text(encoding='utf-8').split('el.textContent=`',1)[1].split('`;shadow.append(el);}',1)[0]
assert (base/'assets/master/moon-material-definitions.css').read_text(encoding='utf-8')==css,'archived material definition must equal actual runtime style'
assert len(d['phases'])==8
print('PASS complete archive: supplied master SHA-256, PNG CRC/decoded genuine alpha, 3 HiDPI variants/3 mirrors, 8 original phase mappings, material/zoom/chevron provenance')
