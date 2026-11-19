/* Genera los iconos PNG sin dependencias. Uso: node tools/make-icons.js */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xEDB88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function writePng(file, size, pixel) {
  const raw = Buffer.alloc(size * (1 + size * 4));
  for (let y = 0; y < size; y++) {
    const row = y * (1 + size * 4);
    raw[row] = 0;
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = pixel(x, y, size);
      const at = row + 1 + x * 4;
      raw[at] = r; raw[at + 1] = g; raw[at + 2] = b; raw[at + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
  fs.writeFileSync(file, png);
}

const NAVY = [22, 38, 63, 255];
const RED = [196, 38, 46, 255];
const CREAM = [247, 244, 236, 255];
const CARBON = [59, 53, 107, 255];

function icon(x, y, s) {
  const u = x / s, v = y / s;
  // Fondo navy a sangre: ningún marco claro puede recortarse con una máscara circular.
  // Todo lo significativo vive dentro del círculo seguro del 80 % (radio 0,4 desde 0,5).
  const inCoupon = u >= 0.20 && u <= 0.80 && v >= 0.30 && v <= 0.70;
  if (!inCoupon) return NAVY;

  // Talón derecho: perforación carbonada y líneas impresas.
  if (u >= 0.72) {
    if (Math.abs(u - 0.72) < 0.012) return CARBON;
    if (Math.abs(v - 0.40) < 0.018 || Math.abs(v - 0.50) < 0.018 || Math.abs(v - 0.60) < 0.018) return CREAM;
    return NAVY;
  }

  // Banda roja diagonal y marca centrada en forma de esquina de billete.
  const band = v - (0.68 - 0.30 * u);
  if (Math.abs(band) < 0.045) return RED;
  if (u > 0.40 && u < 0.46 && v > 0.40 && v < 0.60) return RED;
  if (u > 0.40 && u < 0.60 && v > 0.40 && v < 0.46) return RED;

  // Dos líneas de texto carbonadas.
  if (u > 0.24 && u < 0.36 && (Math.abs(v - 0.36) < 0.016 || Math.abs(v - 0.64) < 0.016)) return CARBON;
  return CREAM;
}

const out = path.join(__dirname, '..');
writePng(path.join(out, 'icon-192.png'), 192, icon);
writePng(path.join(out, 'icon-512.png'), 512, icon);
console.log('Iconos generados: icon-192.png, icon-512.png');
