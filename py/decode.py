from PIL import Image
import color
import hilbert
import sys
import json

def main():
  print('Opening', sys.argv[1])
  print('Saving to', sys.argv[2])

  with open(sys.argv[1], 'rb') as f:
    metalen = ord(f.read(1))
    metastr = f.read(metalen)
    meta    = json.loads(metastr)

    scale = float(meta['s'])
    n   = meta['n']
    llo = meta['llo']
    lhi = meta['lhi']
    blo = meta['blo']
    bhi = meta['bhi']
    alo = meta['alo']
    ahi = meta['ahi']

    im = Image.new('RGB', (n, n), 'black')
    pixels = im.load()

    for d in range(n*n):
      x, y = hilbert.d2xy(n, d)
      l = float(ord(f.read(1)))*(lhi - llo)/scale + llo
      a = float(ord(f.read(1)))*(ahi - alo)/scale + alo
      b = float(ord(f.read(1)))*(bhi - blo)/scale + blo
      rgb = color.Lab(l, a, b).toRGB()

      pixels[x, y] = (int(rgb.r), int(rgb.g), int(rgb.b))

    im.save(sys.argv[2])

main()

