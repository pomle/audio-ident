const fs = require("fs");
const { identifyBuffer } = require("../audio");

describe("Audio Header identification", () => {
  describe("#identifyBuffer", () => {
    [
      [
        "48000_16_2.wav",
        {
          type: "WAVE",
          sampleRate: 48000,
          bitDepth: 16,
          channels: 2,
          format: 1,
        },
      ],
      [
        "44100_16_2.wav",
        {
          type: "WAVE",
          sampleRate: 44100,
          bitDepth: 16,
          channels: 2,
          format: 1,
        },
      ],
      [
        "22050_16_2.wav",
        {
          type: "WAVE",
          sampleRate: 22050,
          bitDepth: 16,
          channels: 2,
          format: 1,
        },
      ],
      [
        "11025_16_2.wav",
        {
          type: "WAVE",
          sampleRate: 11025,
          bitDepth: 16,
          channels: 2,
          format: 1,
        },
      ],
      [
        "48000_16_1.wav",
        {
          type: "WAVE",
          sampleRate: 48000,
          bitDepth: 16,
          channels: 1,
          format: 1,
        },
      ],
      [
        "44100_16_1.wav",
        {
          type: "WAVE",
          sampleRate: 44100,
          bitDepth: 16,
          channels: 1,
          format: 1,
        },
      ],
      [
        "22050_16_1.wav",
        {
          type: "WAVE",
          sampleRate: 22050,
          bitDepth: 16,
          channels: 1,
          format: 1,
        },
      ],
      [
        "11025_16_1.wav",
        {
          type: "WAVE",
          sampleRate: 11025,
          bitDepth: 16,
          channels: 1,
          format: 1,
        },
      ],

      [
        "48000_16_2.flac",
        {
          type: "FLAC",
          sampleRate: 48000,
          bitDepth: 16,
          channels: 2,
        },
      ],
      [
        "44100_16_2.flac",
        {
          type: "FLAC",
          sampleRate: 44100,
          bitDepth: 16,
          channels: 2,
        },
      ],
      [
        "22050_16_2.flac",
        {
          type: "FLAC",
          sampleRate: 22050,
          bitDepth: 16,
          channels: 2,
        },
      ],
      [
        "11025_16_2.flac",
        {
          type: "FLAC",
          sampleRate: 11025,
          bitDepth: 16,
          channels: 2,
        },
      ],
      [
        "48000_16_1.flac",
        {
          type: "FLAC",
          sampleRate: 48000,
          bitDepth: 16,
          channels: 1,
        },
      ],
      [
        "44100_16_1.flac",
        {
          type: "FLAC",
          sampleRate: 44100,
          bitDepth: 16,
          channels: 1,
        },
      ],
      [
        "22050_16_1.flac",
        {
          type: "FLAC",
          sampleRate: 22050,
          bitDepth: 16,
          channels: 1,
        },
      ],
      [
        "11025_16_1.flac",
        {
          type: "FLAC",
          sampleRate: 11025,
          bitDepth: 16,
          channels: 1,
        },
      ],
      [
        "protools.wav",
        {
          type: "WAVE",
          sampleRate: 44100,
          bitDepth: 16,
          channels: 2,
          format: 1,
        },
      ],
    ].forEach(([file, format]) => {
      describe(`when ${file} analyzed`, () => {
        const ident = Object.entries(format)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ");
        it(`extracts format ${ident}`, () => {
          const fd = fs.openSync(__dirname + "/fixtures/" + file, "r");

          const size = 4096;
          const buffer = new Uint8Array(size);
          fs.readSync(fd, buffer, 0, size, 0);
          expect(identifyBuffer(buffer)).toEqual(format);
        });
      });
    });
  });
});
