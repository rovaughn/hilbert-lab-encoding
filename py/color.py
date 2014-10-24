
class RGB:
  __slots__ = ('r', 'g', 'b')

  def __init__(self, r, g, b):
    self.r, self.g, self.b = r, g, b

  def toLab(self):
    return self.toXYZ().toLab()

  def toXYZ(self):
    def f(t):
      if t > 0.04045:
        t = ((t + 0.055) / 1.055) ** 2.4
      else:
        t /= 12.92

      return 100.0*t

    r, g, b = f(self.r/255.0), f(self.g/255.0), f(self.b/255.0)

    return XYZ(
      x = r * 0.4124 + g * 0.3576 + b * 0.1805,
      y = r * 0.2126 + g * 0.7152 + b * 0.0722,
      z = r * 0.0193 + g * 0.1192 + b * 0.9505
    )

  def hex(self):
    return '#%02x%02x%02x' % (self.r, self.g, self.b)

  def __str__(self):
    return 'RGB(%s, %s, %s)' % (self.r, self.g, self.b)

  def __repr__(self):
    return str(self)

class XYZ:
  __slots__ = ('x', 'y', 'z')

  def __init__(self, x, y, z):
    self.x, self.y, self.z = x, y, z

  def toRGB(self):
    def f(t):
      if t < 0.0:
        t = 0.0

      if t > 0.0031308:
        t = 1.055 * t**(1.0/2.4) - 0.055
      else:
        t *= 12.92

      return t * 0xff

    x, y, z = self.x/100.0, self.y/100.0, self.z/100.0

    return RGB(
      r = f(x *  3.2406 + y * -1.5372 + z * -0.4986),
      g = f(x * -0.9689 + y *  1.8758 + z *  0.0415),
      b = f(x *  0.0557 + y * -0.2040 + z *  1.0570)
    )

  def toLab(self):
    def f(t, w):
      t = t / w

      if t > 0.008856:
        t = t**(1.0/3.0)
      else:
        t = 7.787*t + (16.0/116.0)
      
      return t

    x, y, z = f(self.x, white.x), f(self.y, white.y), f(self.z, white.z)

    return Lab(
      l = 116.0*y - 16.0,
      a = 500.0*(x - y),
      b = 200.0*(y - z)
    )

  def __str__(self):
    return 'XYZ(%s, %s, %s)' % (self.x, self.y, self.z)

  def __repr__(self):
    return str(self)

class Lab:
  __slots__ = ('l', 'a', 'b')

  def __init__(self, l, a, b):
    self.l, self.a, self.b = l, a, b

  def toRGB(self):
    return self.toXYZ().toRGB()

  def toXYZ(self):
    def f(t, w):
      powed = t**3.0

      if powed > 0.008856:
        t = powed
      else:
        t = (t - 16.0/116.0)/7.787

      return t * w

    y = (self.l + 16.0) / 116.0
    x = self.a / 500.0 + y
    z = y - self.b/200.0

    return XYZ(f(x, white.x), f(y, white.y), f(z, white.z))

  def __str__(self):
    return 'Lab(%s, %s, %s)' % (self.l, self.a, self.b)

  def __repr__(self):
    return str(self)

white = XYZ(95.047, 100.000, 108.883)

