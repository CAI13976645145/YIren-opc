import { mkdirSync, writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i += 1) {
    c ^= buf[i];
    for (let k = 0; k < 8; k += 1) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crc]);
}

function png(size, pixels) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8; // bit depth
  header[9] = 6; // RGBA
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y += 1) {
    raw[y * (size * 4 + 1)] = 0;
    pixels.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/** 深色圆角方块 + 白色「一」，与 Web 端品牌一致 */
function drawIcon(size) {
  const buf = Buffer.alloc(size * size * 4);
  const radius = Math.round(size * 0.24);
  const barW = Math.round(size * 0.44);
  const barH = Math.max(2, Math.round(size * 0.085));
  const barX = Math.round((size - barW) / 2);
  const barY = Math.round((size - barH) / 2);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const i = (y * size + x) * 4;
      // 圆角矩形判定
      const cx = Math.min(Math.max(x, radius), size - radius - 1);
      const cy = Math.min(Math.max(y, radius), size - radius - 1);
      const dist = Math.hypot(x - cx, y - cy);
      const inside = dist <= radius;
      if (!inside) {
        buf[i + 3] = 0;
        continue;
      }
      let r = 31;
      let g = 36;
      let b = 48;
      if (x >= barX && x < barX + barW && y >= barY && y < barY + barH) {
        r = 255; g = 255; b = 255;
      }
      buf[i] = r; buf[i + 1] = g; buf[i + 2] = b; buf[i + 3] = 255;
    }
  }
  return buf;
}

function icoFromPng(pngBuf, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry[0] = size >= 256 ? 0 : size;
  entry[1] = size >= 256 ? 0 : size;
  entry[2] = 0;
  entry[3] = 0;
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(pngBuf.length, 8);
  entry.writeUInt32LE(6 + 16, 12);
  return Buffer.concat([header, entry, pngBuf]);
}

mkdirSync('assets', { recursive: true });
const icon256 = png(256, drawIcon(256));
const icon32 = png(32, drawIcon(32));
writeFileSync('assets/icon.png', icon256);
writeFileSync('assets/tray.png', icon32);
writeFileSync('assets/icon.ico', icoFromPng(icon256, 256));
console.log('icons generated', icon256.length, icon32.length);
