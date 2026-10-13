const { TextEncoder, TextDecoder } = require("util");
const { setImmediate, clearImmediate } = require("timers");
const {
  ReadableStream,
  WritableStream,
  TransformStream,
} = require("stream/web");
const { Blob, File } = require("buffer");

// jsdom lacks these globals that the Firebase client SDK expects in Node.
for (const [key, value] of Object.entries({
  TextEncoder,
  TextDecoder,
  setImmediate,
  clearImmediate,
  Uint8Array,
  ReadableStream,
  WritableStream,
  TransformStream,
  Blob,
  File,
})) {
  if (typeof global[key] === "undefined") {
    global[key] = value;
  }
}

// undici references these globals at module scope, so it must be required
// only after the globals above are in place.
if (typeof global.fetch === "undefined") {
  const { fetch, Headers, Request, Response } = require("undici");
  Object.assign(global, { fetch, Headers, Request, Response });
}
