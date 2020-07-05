# audio-ident

Ultrafast zero-dependency JavaScript library for identifying WAVE and FLAC files in the browser.

## Usage

1. Install

```
npm install @pomle/audio-ident
```

2. Import

```js
import { identifyFile } from "@pomle/audio-ident";
```

3. Call `identifyFile` with a [File object](https://developer.mozilla.org/en-US/docs/Web/API/File) from a DragEvent for example.

```js
const handleDrop = async event => {
  event.preventDefault();
  const files = event.dataTransfer.files;
  for (const file of files) {
    const fileInfo = await identifyFile(file);
    console.log(fileInfo);
  }
}
```

`fileInfo` will contain an object like the following.
```js
{
  type: "WAVE", 
  format: 1, /* A WAVE file may use compression. Format contains 1 if PCM (Uncompressed). */
  sampleRate: 44100, 
  channels: 2, 
  bitDepth: 16
}
```
