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
    var last = {l: 0, a: 0, b: 0};
    var lsteps = [];
    var asteps = [];
    var bsteps = [];

    for (var d = 0; d < n*n; ++d) {
      var p = d2xy(n, d),
          i = 4*(n*p.y + p.x),
          rgb = {r: imageData.data[i], g: imageData.data[i+1], b: imageData.data[i+2]},
          lab = Color.convert(rgb, 'lab');

      lsteps.push(lab.l - last.l);
      asteps.push(lab.a - last.a);
      bsteps.push(lab.b - last.b);
      last = lab;
    }

    console.log(JSON.stringify(lsteps));
    console.log(JSON.stringify(asteps));
    console.log(JSON.stringify(bsteps));

    /*var color = {l: 0, a: 0, b: 0};

    for (var d = 0; d < n*n; ++d) {
      var p = d2xy(n, d);

      color.l += steps[3*d+0];
      color.a += steps[3*d+1];
      color.b += steps[3*d+2];

      var rgb = Color.convert(color, 'rgb');

      var i = 4*(n*p.y + p.x);
      imageData[i+0] = rgb.r;
      imageData[i+1] = rgb.g;
      imageData[i+2] = rgb.b;
    }*/

    //resultCtx.putImageData(imageData, 0, 0);
  };
}

main();

