import { Buffer } from "buffer";

function parseDataUri(dataUri) {
  var data = dataUri.split(",");
  var buf = Buffer.from(data[1], "base64");
  console.log(buf);
  return {
    mimeType: normalizeMimeType(parseMimeType(data[0])),
    bData: buf.toString(),
  };
}

function parseMimeType(uri) {
  return uri.substring(5, uri.indexOf(";"));
}

var prefix = /^(\w+\/)+/;
function normalizeMimeType(mime) {
  mime = mime.toLowerCase();
  var once = mime.match(prefix);
  if (!once || !(once = once[1])) {
    return mime;
  }
  return mime.replace(prefix, once);
}

export { parseDataUri };
