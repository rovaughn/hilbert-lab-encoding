
def xy2d(n, x, y):
  d = 0
  s = n >> 1

  while s > 0:
    rx = int((x & s) > 0)
    ry = int((y & s) > 0)
    d += s * s * ((3 * rx) ^ ry)
    x, y = rot(s, x, y, rx, ry)
    s >>= 1

  return d

def d2xy(n, d):
  x = 0
  y = 0
  s = 1
  t = d

  while s < n:
    rx = 1 & (t >> 1)
    ry = 1 & (t ^ rx)
    x, y = rot(s, x, y, rx, ry)
    x += s * rx
    y += s * ry
    t >>= 2
    s <<= 1

  return x, y

def rot(n, x, y, rx, ry):
  if ry == 0:
    if rx == 1:
      x = n - 1 - x
      y = n - 1 - y
    
    x, y = y, x

  return x, y

