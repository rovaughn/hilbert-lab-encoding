
/* Takes a dictionary mapping values to probabilities and finds an optimal
 * binary encoding.
 */
function huffman(frequencies) {
  var arr = [];

  for (var value in frequencies) {
    arr.push({value: value, frequency: frequencies[value]});
  }

  while (arr.length > 1) {
    arr.sort(function(a, b) {
      return a.frequency - b.frequency;
    });

    arr.splice(0, 2, {left: arr[0], right: arr[1], frequency: arr[0].frequency + arr[1].frequency});
  }

  return buildHuffmanPrefixes(arr[0]);
}

function buildHuffmanPrefixes(node) {
  if (node.value) {
    var r = {};
    r[node.value] = '';
    return r;
  }

  var left   = buildHuffmanPrefixes(node.left),
      right  = buildHuffmanPrefixes(node.right),
      result = {};

  for (var value in left) {
    result[value] = '0' + left[value];
  }

  for (var value in right) {
    result[value] = '1' + right[value];
  }

  return result;
}

/* build({'a': '1', 'b': '01', 'c': '00'})
 * {'0': build({'b': '1', 'c': '0'}), '1': 'a'}
 */

function buildHuffmanDecoderTable(table) {
  if (typeof table === 'string') {
    return table;
  }

  var zeros = {},
      ones  = {};

  for (var value in table) {
    var prefix = table[value];

    if (prefix === '0') {
      zeros = value;
    } else if (prefix === '1') {
      ones = value;
    } else {
      var head = prefix[0],
          tail = prefix.slice(1);

      if (head === '0') {
        zeros[value] = tail;
      } else {
        ones[value] = tail;
      }
    }
  }

  return { '0': buildHuffmanDecoderTable(zeros)
         , '1': buildHuffmanDecoderTable(ones)
         };
}

function encodeHuffman(table, string) {
  var result = '';

  for (var i = 0; i < string.length; ++i) {
    result += table[string[i]];
  }

  return result;
}

function decodeHuffman(table, string) {
  var subtable = table,
      result   = '';

  for (var i = 0; i < string.length; ++i) {
    subtable = subtable[string[i]];

    if (typeof subtable === 'string') {
      result   += subtable;
      subtable  = table;
    }
  }

  return result;
}

var sigmaTable = huffman({
  '1': 0.6826895072086512,
  '2': 0.27181026301110034,
  '3': 0.042800463633737795,
  '4': 0.0026364536577274666,
  '5': 6.276918564651623e-05,
  '6': 5.713299620069279e-07,
  '7': 1.970615448598778e-09,
  '8': 2.559730205575761e-12
});

function erfcc(x) {
  var z = Math.abs(x),
      t = 1 / (1 + 0.5*z),
      r = t * Math.exp(-z*z-1.26551223+t*(1.00002368+t*(.37409196+
          t*(.09678418+t*(-.18628806+t*(.27886807+
          t*(-1.13520398+t*(1.48851587+t*(-.82215223+
          t*.17087277)))))))));
 
  return x >= 0 ? r : 2 - r;
}

function ncdf(x) {
  return 1 - 0.5*erfcc(x/Math.sqrt(2));
}

function makeNormalTable(mu, sigma, precision) {
  var frequencies = {};

  for (var i = 1; i < 8*precision; i += 1) {
    var x1 = (i - 1)*sigma/precision,
        x2 = i*sigma/precision,
        p  = ncdf(x2) - ncdf(x1);

    frequencies[i] = p;
    frequencies[-i] = p;
  }

  frequencies[0] = frequencies[1];

  return huffman(frequencies);
}

function compressNormal(table, mu, sigma, precision, x) {
  var q = Math.ceil((x - mu)*precision/sigma);

  if (q > 8*precision - 1) { q = 8*precision - 1; }

  return table[q];
}

function uncompressNormal(table, mu, sigma, precision, x) {
  return decodeHuffman(table, x)*sigma/precision + mu;
}

if (process) {
  var mu = 0, sigma = 1, precision = 10, x = 10
  var table = makeNormalTable(mu, sigma, precision);
  var untable = buildHuffmanDecoderTable(table);
  var compressed = compressNormal(table, mu, sigma, precision, x);
  var uncompressed = uncompressNormal(untable, mu, sigma, precision, compressed);
  console.log(compressed);
  console.log(uncompressed);
}

