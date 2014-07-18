from PIL import Image
import color
import hilbert
import sys
import json

def powerOfTwo(n):
  return n != 0 and n & (n - 1) == 0

def main():
  print 'Using scale', sys.argv[1]
  print 'Opening    ', sys.argv[2]
  print 'Writing to ', sys.argv[3]

  scale = int(sys.argv[1])
  im = Image.open(sys.argv[2])
  pixels = im.load()

  width, height = im.size

  if width != height or not powerOfTwo(width):
    raise Exception('Image must be a square with sides that are powers of two')

  n = width

  colors = []

  for d in range(n*n):
    x, y = hilbert.d2xy(n, d)
    r, g, b = pixels[x, y]
    lab = color.RGB(r, g, b).toLab()

    colors.append(lab)

    if d == 0:
      llo = lhi = lab.l
      alo = ahi = lab.a
      blo = bhi = lab.b
    else:
      llo, lhi = min(llo, lab.l), max(lhi, lab.l)
      alo, ahi = min(alo, lab.a), max(ahi, lab.a)
      blo, bhi = min(blo, lab.b), max(bhi, lab.b)

  meta = {
      'llo': llo, 'lhi': lhi, 'alo': alo, 'ahi': ahi, 'blo': blo, 'bhi': bhi, 'n': n, 's': scale
  }

  metastr = json.dumps(meta)

  with open(sys.argv[3], 'wb') as f:
    f.write(chr(len(metastr)))
    f.write(metastr)

    for lab in colors:
      l = int(round((lab.l - llo)/(lhi - llo)*scale))
      a = int(round((lab.a - alo)/(ahi - alo)*scale))
      b = int(round((lab.b - blo)/(bhi - blo)*scale))

      f.write(chr(l) + chr(a) + chr(b))

main()

