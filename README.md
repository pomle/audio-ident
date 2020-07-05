# audio-ident

Ultrafast zero-dependency JavaScript library for identifying WAVE and FLAC files in the browser.

Useful when you expect a user to upload big WAVE or FLAC files and want to ensure they comply with a 
specific format before the user have started sending data to your server.

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

## Examples

[Vanilla JS](https://codesandbox.io/s/quizzical-babbage-lebsw?fontsize=14&hidenavigation=1&theme=dark)
