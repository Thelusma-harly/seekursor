// Lossless web assets and small-size icons from the approved transparent logo.
// Usage: node scripts/prepare-brand-assets.cjs <path-to-transparent-png>
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

async function main() {
  const source = process.argv[2];
  if (!source) throw new Error('Provide the approved transparent logo PNG.');
  const root = path.resolve(__dirname, '..');
  const brandDir = path.join(root, 'public', 'brand');
  await fs.mkdir(brandDir, {recursive: true});
  const metadata = await sharp(source).metadata();
  if (!metadata.hasAlpha) throw new Error('The source logo must have transparency.');
  const {data, info} = await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject: true});
  let left = info.width, top = info.height, right = -1, bottom = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * 4 + 3] === 0) continue;
      left = Math.min(left, x); top = Math.min(top, y);
      right = Math.max(right, x); bottom = Math.max(bottom, y);
    }
  }
  if (right < left) throw new Error('The source logo is empty.');
  const logo = await sharp(source)
    .extract({left, top, width: right - left + 1, height: bottom - top + 1})
    .png({compressionLevel: 9, adaptiveFiltering: true, palette: false})
    .toBuffer();
  await fs.writeFile(path.join(brandDir, 'seekursor-eye.png'), logo);
  // Lossless responsive copies for the small navbar/footer mark; retain the full PNG.
  for (const width of [76, 152, 228, right - left + 1]) {
    await sharp(logo).resize({width, kernel: sharp.kernel.lanczos3, withoutEnlargement: true})
      .webp({lossless: true, effort: 6})
      .toFile(path.join(brandDir, `seekursor-eye-${width}.webp`));
  }

  const navy = '#030615';
  async function icon(size) {
    const inner = Math.max(1, Math.round(size * 0.86));
    const symbol = await sharp(logo).resize(inner, inner, {
      fit: 'inside', kernel: sharp.kernel.lanczos3,
    }).toBuffer();
    return sharp({create: {width: size, height: size, channels: 4, background: navy}})
      .composite([{input: symbol, gravity: 'centre'}])
      .png({compressionLevel: 9, adaptiveFiltering: true, palette: false})
      .toBuffer();
  }
  for (const size of [16, 32, 48, 64, 180, 512]) {
    await fs.writeFile(path.join(brandDir, `icon-${size}.png`), await icon(size));
  }
  const sizes = [16, 32, 48];
  const buffers = await Promise.all(sizes.map(icon));
  const header = Buffer.alloc(6 + sizes.length * 16);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  buffers.forEach((buffer, i) => {
    const entry = 6 + i * 16;
    header[entry] = sizes[i]; header[entry + 1] = sizes[i];
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(buffer.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += buffer.length;
  });
  const ico = Buffer.concat([header, ...buffers]);
  await fs.writeFile(path.join(brandDir, 'favicon.ico'), ico);
  // Keep conventional root URLs current for browser fallback and existing links.
  await fs.writeFile(path.join(root, 'public', 'favicon.ico'), ico);
  await fs.writeFile(path.join(root, 'public', 'favicon.png'), await icon(64));
  console.log(`Prepared ${right - left + 1}×${bottom - top + 1} lossless logo and 16–512px icons.`);
}
main().catch(error => {console.error(error.message); process.exitCode = 1;});
