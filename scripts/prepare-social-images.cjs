// Share cards use only the approved logo, existing palette and localized agency label.
// Usage: node scripts/prepare-social-images.cjs
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

async function main() {
  const root = path.resolve(__dirname, '..');
  const logo = await fs.readFile(path.join(root, 'public/brand/seekursor-mark-dark.png'));
  const destination = path.join(root, 'public/og');
  await fs.mkdir(destination, { recursive: true });
  for (const [locale, label] of Object.entries({
    fr: 'Agence de solutions digitales', en: 'Digital Solutions Agency', ht: 'Ajans solisyon dijital',
  })) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
      <rect width="1200" height="630" fill="#030615"/>
      <image x="484" y="90" width="232" height="232" preserveAspectRatio="xMidYMid meet" xlink:href="data:image/png;base64,${logo.toString('base64')}"/>
      <g font-family="Arial, sans-serif" text-anchor="middle">
        <text x="600" y="432" fill="#ffffff" font-size="72" font-weight="700">Seekursor</text>
        <text x="600" y="495" fill="#22e5ee" font-size="30">${label}</text>
        <text x="600" y="563" fill="#98a2b3" font-size="22">seekursor.vercel.app</text>
      </g>
    </svg>`;
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(path.join(destination, `seekursor-${locale}.png`));
  }
  console.log('Prepared three 1200×630 localized Seekursor social images.');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
