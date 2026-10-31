// Web-size exports from the approved light/dark transparent PNGs; never redraw the mark.
// Usage: node scripts/prepare-brand-assets.cjs <light-transparent.png> <dark-transparent.png>
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

async function main() {
  const [lightSource, darkSource] = process.argv.slice(2);
  if (!lightSource || !darkSource) throw new Error('Provide both approved transparent logo variants.');
  const root = path.resolve(__dirname, '..');
  const brandDir = path.join(root, 'public', 'brand');
  await fs.mkdir(brandDir, {recursive: true});
  const sources = await Promise.all([lightSource, darkSource].map(async source => {
    const metadata = await sharp(source).metadata();
    if (!metadata.hasAlpha) throw new Error('Both source logos must have transparency.');
    return sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject: true});
  }));
  if (sources[0].info.width !== sources[1].info.width || sources[0].info.height !== sources[1].info.height) {
    throw new Error('Light/dark masters must share the same canvas.');
  }
  const {width, height} = sources[0].info;
  let left = width, top = height, right = -1, bottom = -1;
  // A shared crop keeps both themes registered. A 3px guard preserves edge anti-aliasing.
  for (const {data} of sources) {
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] < 128) continue;
      left = Math.min(left, x); top = Math.min(top, y);
      right = Math.max(right, x); bottom = Math.max(bottom, y);
    }
  }
  if (right < left) throw new Error('The source logo is empty.');
  left = Math.max(0, left - 3); top = Math.max(0, top - 3);
  right = Math.min(width - 1, right + 3); bottom = Math.min(height - 1, bottom + 3);
  const crop = {left, top, width: right - left + 1, height: bottom - top + 1};
  const logos = {};
  for (const [mode, source] of [['light', lightSource], ['dark', darkSource]]) {
    const logo = await sharp(source).extract(crop).png({compressionLevel: 9, palette: false}).toBuffer();
    logos[mode] = logo;
    await fs.writeFile(path.join(brandDir, 'seekursor-mark-' + mode + '.png'), logo);
    for (const size of [40, 80, 120, 256]) {
      await sharp(logo).resize({width: size, kernel: sharp.kernel.lanczos3, withoutEnlargement: true})
        .webp({lossless: true, effort: 6}).toFile(path.join(brandDir, 'seekursor-mark-' + mode + '-' + size + '.webp'));
    }
  }
  async function icon(size) {
    const inner = Math.max(1, Math.round(size * 0.84));
    const symbol = await sharp(logos.dark).resize(inner, inner, {fit: 'inside', kernel: sharp.kernel.lanczos3}).toBuffer();
    return sharp({create: {width: size, height: size, channels: 4, background: '#182230'}})
      .composite([{input: symbol, gravity: 'centre'}])
      .png({compressionLevel: 9, palette: false}).toBuffer();
  }
  for (const size of [16, 32, 48, 64, 180, 512]) {
    await fs.writeFile(path.join(brandDir, 'seekursor-icon-' + size + '.png'), await icon(size));
  }
  const sizes = [16, 32, 48];
  const buffers = await Promise.all(sizes.map(icon));
  const header = Buffer.alloc(6 + sizes.length * 16);
  header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  buffers.forEach((buffer, i) => {
    const entry = 6 + i * 16;
    header[entry] = sizes[i]; header[entry + 1] = sizes[i];
    header.writeUInt16LE(1, entry + 4); header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(buffer.length, entry + 8); header.writeUInt32LE(offset, entry + 12);
    offset += buffer.length;
  });
  const ico = Buffer.concat([header, ...buffers]);
  await fs.writeFile(path.join(brandDir, 'seekursor-favicon.ico'), ico);
  await fs.writeFile(path.join(root, 'public', 'favicon.ico'), ico);
  await fs.writeFile(path.join(root, 'public', 'favicon.png'), await icon(64));
  console.log('Prepared matching ' + crop.width + '×' + crop.height + ' theme logos, lossless responsive copies and 16–512px icons.');
}
main().catch(error => {console.error(error.message); process.exitCode = 1;});
