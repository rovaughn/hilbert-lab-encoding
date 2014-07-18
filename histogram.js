
function histogram(data, binSize) {
  var frequencies = {};

  for (var i = 0; i < data.length; ++i) {
    var x = data[i],
        j = Math.floor(x/binSize);

    frequencies[j] = (frequencies[j] || 0) + 1;
  }

  return {
    binSize: binSize,
    frequencies: frequencies
  };
}

function histogramHTML(histogram) {
  var html = '';

  var bins = Object.keys(histogram.frequencies);

  bins.sort();

  var lowest  = +bins[0],
      highest = +bins[bins.length - 1],
      longest = 0;

  for (var i = lowest; i <= highest; ++i) {
    var frequency = histogram.frequencies[i] || 0;

    if (frequency > longest) {
      longest = frequency;
    }
  }

  html += '<table>\n';
  html += '<tbody>\n';

  for (var i = lowest; i <= highest; ++i) {
    var value     = i*histogram.binSize,
        frequency = (histogram.frequencies[i] || 0)/longest*1000;

    html += '<tr><td>' + value + '</td><td><div style="background-color:black;height:10px;width:' + frequency + 'px"/></td></tr>\n';
  }

  html += '</tbody>\n';
  html += '</table>';

  return html;
}

