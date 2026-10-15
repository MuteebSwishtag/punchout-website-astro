import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'scripts/assets/favicon-dark-source.jpeg');
const publicDir = path.join(root, 'public');
const size = 260;

// The original files are JPEGs. Rebuild the solid circle and use the higher
// contrast dark image only to recover the anti-aliased white PC lettering.
const { data: original, info } = await sharp(await readFile(source))
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

if (info.width !== size || info.height !== size || info.channels !== 3) {
  throw new Error('Unexpected favicon source dimensions or color channels');
}

function makeMaster(circleColor) {
  const pixels = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const offset = (y * size + x) * 4;
      const sourceOffset = (y * size + x) * 3;
      const distance = Math.hypot(x - 129.5, y - 129.5);
      const circleAlpha = Math.max(0, Math.min(1, 129.5 - distance));
      const letterAlpha = x >= 37 && x <= 225 && y >= 78 && y <= 192
        ? Math.max(0, Math.min(1, (original[sourceOffset] - 46) / 204))
        : 0;

      for (let channel = 0; channel < 3; channel++) {
        pixels[offset + channel] = Math.round(
          circleColor[channel] * (1 - letterAlpha) + 255 * letterAlpha
        );
      }
      pixels[offset + 3] = Math.round(circleAlpha * 255);
    }
  }
  return pixels;
}

const light = makeMaster([76, 207, 191]);
const dark = makeMaster([39, 39, 47]);
const raw = (pixels) => sharp(pixels, { raw: { width: size, height: size, channels: 4 } });

await Promise.all([
  raw(light).resize(32, 32).png().toFile(path.join(publicDir, 'assets/favicon-light-32.png')),
  raw(dark).resize(32, 32).png().toFile(path.join(publicDir, 'assets/favicon-dark-32.png')),
  sharp({ create: { width: 180, height: 180, channels: 4, background: '#ffffff' } })
    .composite([{ input: await raw(light).resize(160, 160).png().toBuffer(), left: 10, top: 10 }])
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'))
]);

// Write a conventional 32-bit ICO with 16, 32 and 48 px BMP entries.
const entries = [];
for (const iconSize of [16, 32, 48]) {
  const { data } = await raw(light).resize(iconSize, iconSize).raw().toBuffer({ resolveWithObject: true });
  const maskStride = Math.ceil(iconSize / 32) * 4;
  const xorBytes = iconSize * iconSize * 4;
  const maskBytes = maskStride * iconSize;
  const bitmap = Buffer.alloc(40 + xorBytes + maskBytes);
  bitmap.writeUInt32LE(40, 0);
  bitmap.writeInt32LE(iconSize, 4);
  bitmap.writeInt32LE(iconSize * 2, 8);
  bitmap.writeUInt16LE(1, 12);
  bitmap.writeUInt16LE(32, 14);
  bitmap.writeUInt32LE(xorBytes + maskBytes, 20);

  for (let y = 0; y < iconSize; y++) {
    for (let x = 0; x < iconSize; x++) {
      const sourceOffset = (y * iconSize + x) * 4;
      const targetOffset = 40 + ((iconSize - 1 - y) * iconSize + x) * 4;
      bitmap[targetOffset] = data[sourceOffset + 2];
      bitmap[targetOffset + 1] = data[sourceOffset + 1];
      bitmap[targetOffset + 2] = data[sourceOffset];
      bitmap[targetOffset + 3] = data[sourceOffset + 3];
      if (data[sourceOffset + 3] < 128) {
        const maskOffset = 40 + xorBytes + (iconSize - 1 - y) * maskStride + Math.floor(x / 8);
        bitmap[maskOffset] |= 0x80 >> (x % 8);
      }
    }
  }
  entries.push({ size: iconSize, bitmap });
}

const directory = Buffer.alloc(6 + entries.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(entries.length, 4);
let offset = directory.length;
for (const [index, entry] of entries.entries()) {
  const position = 6 + index * 16;
  directory[position] = entry.size;
  directory[position + 1] = entry.size;
  directory.writeUInt16LE(1, position + 4);
  directory.writeUInt16LE(32, position + 6);
  directory.writeUInt32LE(entry.bitmap.length, position + 8);
  directory.writeUInt32LE(offset, position + 12);
  offset += entry.bitmap.length;
}
await writeFile(path.join(publicDir, 'favicon.ico'), Buffer.concat([directory, ...entries.map(({ bitmap }) => bitmap)]));
