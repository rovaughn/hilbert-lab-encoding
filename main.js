
function popup(name, html) {
  html = '<title>' + name + '</title>' + html;
  var newWindow = window.open('data:text/html;charset=utf8;base64,' + btoa(html), name);

  newWindow.focus();
}

function main() {
  var sourceCanvas = document.getElementById('source'),
      resultCanvas = document.getElementById('result'),
      sourceCtx    = sourceCanvas.getContext('2d'),
      resultCtx    = resultCanvas.getContext('2d'),
      tiger        = new Image();

  var n = 256;

  sourceCanvas.width  = n;
  sourceCanvas.height = n;
  resultCanvas.width  = n;
  resultCanvas.height = n;

  tiger.src = 'tiger-256.jpg';

  tiger.onload = function() {
    sourceCtx.drawImage(tiger, 0, 0);

    var imageData = sourceCtx.getImageData(0, 0, n, n);
    var colors = [];

    var llo, lhi, alo, ahi, blo, bhi;

    for (var d = 0; d < n*n; ++d) {
      var p = d2xy(n, d),
          i = 4*(n*p.y + p.x),
          rgb = {r: imageData.data[i], g: imageData.data[i+1], b: imageData.data[i+2]},
          lab = Color.convert(rgb, 'lab');

      if (d === 0) {
        llo = lab.l; lhi = lab.l;
        alo = lab.a; ahi = lab.a;
        blo = lab.b; bhi = lab.b;
      } else {
        if (lab.l < llo) { llo = lab.l; }
        if (lab.l > lhi) { lhi = lab.l; }
        if (lab.a < alo) { alo = lab.a; }
        if (lab.a > ahi) { ahi = lab.a; }
        if (lab.b < blo) { blo = lab.b; }
        if (lab.b > bhi) { bhi = lab.b; }
      }

      colors.push(lab);
    }

    var scale = 8;
    var result = [];

    // (x - lo)/(hi - lo)*s = X
    // X*(hi - lo)/s + lo = x

    for (var i = 0; i < colors.length; ++i) {
      var l = Math.round((colors[i].l - llo)/(lhi - llo)*scale)|0;
      var a = Math.round((colors[i].a - alo)/(ahi - alo)*scale)|0;
      var b = Math.round((colors[i].b - blo)/(bhi - blo)*scale)|0;

      result.push(l); result.push(a); result.push(b);
    }

    var deflated = deflate(result, 9),
        inflated = inflate(deflated);

    inflated = result;

    console.log(deflated.length, 'bytes');
 
    for (var d = 0; d < n*n; ++d) {
      var p = d2xy(n, d),
          j = 3*d,
          i = 4*(n*p.y + p.x),
          lab = {l: inflated[j]*(lhi - llo)/scale + llo, a: inflated[j+1]*(ahi - alo)/scale + alo, b: inflated[j+2]*(bhi - blo)/scale + blo},
          rgb = Color.convert(lab, 'rgb');

      imageData.data[i+0] = rgb.r;
      imageData.data[i+1] = rgb.g;
      imageData.data[i+2] = rgb.b;
    }

    resultCtx.putImageData(imageData, 0, 0);
  };
}

function decode(s) {
}

main();

