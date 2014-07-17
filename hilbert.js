
function xy2d(n, x, y) {
  var rx, ry, s, d = 0, res;
  for (s = n>>1; s > 0; s >>= 1) {
    rx = (x & s) > 0 ? 1 : 0;
    ry = (y & s) > 0 ? 1 : 0;
    d += s * s * ((3 * rx) ^ ry);
    res = rot(s, x, y, rx, ry);
    x = res.x;
    y = res.y;
  }
  return d;
}

function d2xy(n, d) {
  var rx, ry, s, t = d, x = 0, y = 0, res;
  for (s = 1; s < n; s *= 2) {
    rx = 1 & (t>>1);
    ry = 1 & (t ^ rx);
    res = rot(s, x, y, rx, ry);
    x = res.x;
    y = res.y;
    x += s * rx;
    y += s * ry;
    t >>= 2;
  }
  return {x: x, y: y};
}

function rot(n, x, y, rx, ry) {
  if (ry === 0) {
    if (rx === 1) {
      x = n - 1 - x;
      y = n - 1 - y;
    }

    var t = x;
    x = y;
    y = t;
  }

  return {x: x, y: y};
}

