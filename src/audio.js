/*
Ported from https://blog.theroyweb.com/extracting-wav-file-header-information-using-a-python-script
then implemented for FLAC.

FLAC format overview: https://xiph.org/flac/documentation_format_overview.html.
WAVE format overview: http://soundfile.sapp.org/doc/WaveFormat/
*/
export async function identifyFile(file) {
  const headers = file.slice(0, 4096); // Read about 4 kiB.
  const buffer = new Uint8Array(await readAsArrayBuffer(headers));
  return identifyBuffer(buffer);
}

function readString(buffer) {
  return Array.from(buffer)
    .map(c => String.fromCharCode(c))
    .join("");
}

function findFormatChunk(buffer) {
  /*
  A RIFF header can contain any amount of chunks that is
  not a WAVE "fmt" chunk.

  Iterate over all chunks and return the "fmt" chunk.

  https://stackoverflow.com/questions/19991405/how-can-i-detect-whether-a-wav-file-has-a-44-or-46-byte-header
  */
  let chunk = buffer.slice(12);
  while (chunk.length) {
    const chunkId = readString(chunk.slice(0, 4));
    if (chunkId === "fmt ") {
      return chunk;
    }
    const chunkData = new DataView(chunk.buffer);
    const chunkSize = chunkData.getInt32(4, true);
    // Next chunk is at chunkSize extracted from byte 4 + 8 bytes already consumed.
    const nextChunk = chunkSize + 8;
    chunk = chunk.slice(nextChunk);
  }
  throw new Error('Could not find "fmt" chunk');
}

export function identifyBuffer(buffer) {
  const typeInfo = readString(buffer.slice(0, 4));

  if (typeInfo === "fLaC") {
    const streamInfo = new DataView(buffer.buffer, 8, 24);
    /* Extract a 32 byte integer and covert to binary (0101101101010)
       string to slice up the bits. More readable than
       using bit arithmetic to extract the data. */
    const format = streamInfo
      .getUint32(10)
      .toString(2)
      .padStart(32, 0);

    // Sample rate is stored in 20 bits.
    const sampleRate = format.slice(0, 20);

    // Channel count uses 3 bits and stored 0-based.
    const channels = format.slice(20, 23);

    // Bit depth uses 5 bits and stored 0-based.
    const bitDepth = format.slice(23, 28);

    return {
      type: "FLAC",
      sampleRate: parseInt(sampleRate, 2),
      bitDepth: parseInt(bitDepth, 2) + 1,
      channels: parseInt(channels, 2) + 1,
    };
  } else if (typeInfo === "RIFF") {
    const formatBuffer = findFormatChunk(buffer);
    const streamInfo = new DataView(formatBuffer.buffer, 0, 100);

    return {
      type: "WAVE",
      /* A WAVE file may use compression. Format contains 1 if PCM. */
      format: streamInfo.getInt8(8, true),
      sampleRate: streamInfo.getInt32(12, true),
      channels: streamInfo.getInt8(10, true),
      bitDepth: streamInfo.getInt8(22, true),
    };
  }

  throw new Error(`Format bytes is ${typeInfo}, expected RIFF or fLaC`);
}

export function readAsArrayBuffer(file) {
  return new Promise(resolve => {
    const fr = new FileReader();
    fr.addEventListener("load", () => resolve(fr.result));
    fr.readAsArrayBuffer(file);
  });
}
