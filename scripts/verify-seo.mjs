// Verify the real production responses, not just the metadata helper's return values.
// Start a production server, then: node scripts/verify-seo.mjs http://localhost:3000
import assert from 'node:assert/strict';

const base = new URL(process.argv[2] || 'http://localhost:3000');
const origin = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://seekursor.vercel.app').replace(/\/$/, '');
const locales = ['fr', 'en', 'ht'];
const decode = value => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key.toLowerCase(), decode(value)]));
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(match => attrs(match[0]));
const report = { base: base.origin, canonicalOrigin: origin, pages: [], redirects: [], assets: [] };
async function request(path, options = {}) {
  return fetch(new URL(path, base), { redirect: 'manual', signal: AbortSignal.timeout(30000), ...options });
}
function indexable(response, html) {
  assert.ok(!/noindex|nofollow|none/i.test(response.headers.get('x-robots-tag') || ''), 'Blocking X-Robots-Tag');
  for (const meta of tags(html, 'meta').filter(tag => /^(robots|googlebot|bingbot)$/i.test(tag.name || ''))) {
    assert.ok(!/noindex|nofollow|none/i.test(meta.content || ''), 'Blocking robots meta');
  }
}
const titles = new Set();
for (const locale of locales) {
  const response = await request(`/${locale}`);
  assert.equal(response.status, 200, locale);
  const html = await response.text();
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] || '';
  indexable(response, html);
  assert.equal(response.headers.get('link'), null, 'Duplicate host-derived hreflang headers');
  assert.equal(tags(html, 'html')[0]?.lang, locale);
  const title = decode(head.match(/<title>([^<]+)<\/title>/)?.[1] || '');
  assert.ok(title.includes('Seekursor') && title.length < 60 && !titles.has(title));
  titles.add(title);
  const metas = tags(head, 'meta');
  const named = name => metas.find(tag => tag.name === name)?.content;
  const property = name => metas.find(tag => tag.property === name)?.content;
  const description = named('description') || '';
  assert.ok(description.length >= 120 && description.length <= 160);
  assert.ok(metas.some(meta => meta.charset?.toLowerCase() === 'utf-8'));
  assert.match(named('viewport'), /width=device-width, initial-scale=1/);
  const links = tags(head, 'link');
  assert.equal(links.find(link => link.rel === 'canonical')?.href, `${origin}/${locale}`);
  for (const language of [...locales, 'x-default']) {
    assert.equal(links.find(link => link.rel === 'alternate' && link.hreflang === language)?.href, `${origin}/${language === 'x-default' ? 'fr' : language}`);
  }
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || '';
  assert.equal([...main.matchAll(/<h1\b/g)].length, 1);
  assert.ok(main.includes('Seekursor') && main.length > 10000, 'Missing initial HTML main content');
  let level = 0;
  for (const [, digit] of main.matchAll(/<h([1-6])\b/g)) {
    assert.ok(Number(digit) <= level + 1, 'Skipped heading level');
    level = Number(digit);
  }
  const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  assert.equal(schemas.length, 1, 'Duplicate or missing JSON-LD');
  assert.ok(head.includes(schemas[0][0]), 'JSON-LD must be in head');
  const graph = JSON.parse(schemas[0][1])['@graph'];
  assert.deepEqual(graph.map(node => node['@type']), ['Organization', 'WebSite']);
  assert.ok(graph.every(node => node.name === 'Seekursor' && node.url === origin));
  assert.equal(graph[0].telephone, '+50947109401');
  assert.match(graph[0].logo.url, /^https:\/\//);
  assert.ok(graph[0].logo.width >= 112 && graph[0].logo.height >= 112);
  for (const social of graph[0].sameAs || []) assert.ok(tags(html, 'a').some(link => link.href === social));
  for (const name of ['og:title', 'og:description', 'og:url', 'og:type', 'og:site_name', 'og:image']) assert.ok(property(name), name);
  assert.equal(property('og:url'), `${origin}/${locale}`);
  assert.equal(property('og:site_name'), 'Seekursor');
  assert.equal(property('og:type'), 'website');
  assert.equal(named('twitter:card'), 'summary_large_image');
  assert.equal(property('og:image:width'), '1200');
  assert.equal(property('og:image:height'), '630');
  const og = await request(new URL(property('og:image')).pathname);
  assert.equal(og.status, 200);
  const png = Buffer.from(await og.arrayBuffer());
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => decode(match[1])));
  for (const link of tags(html, 'a').filter(link => link.href?.startsWith('/'))) {
    const url = new URL(link.href, base);
    assert.ok(locales.some(code => url.pathname === `/${code}`), `Unknown internal page ${link.href}`);
    if (url.hash) assert.ok(ids.has(decodeURIComponent(url.hash.slice(1))), `Broken anchor ${link.href}`);
  }
  for (const image of tags(main, 'img')) {
    assert.ok(image.alt?.trim(), 'Missing descriptive content image alt');
    assert.ok(Number(image.width) > 0 && Number(image.height) > 0);
    assert.equal(image.loading, 'lazy', 'Below-fold photos must remain lazy');
    assert.ok(image.srcset && image.sizes && image.src.startsWith('/_next/image?'));
  }
  const brandLogos = tags(html, 'img').filter(image => /^\/brand\/seekursor-mark-(light|dark)\.png$/.test(image.src));
  assert.ok(brandLogos.some(image => image.src.includes('-light.png')) && brandLogos.some(image => image.src.includes('-dark.png')), 'Missing theme logo variant');
  for (const logo of brandLogos) {
    assert.equal(logo.alt, 'Seekursor logo');
    assert.notEqual(logo.loading, 'lazy');
    assert.ok(logo.srcset?.includes('-80.webp 80w') && logo.sizes, 'Missing responsive logo');
  }
  const footer = html.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/i)?.[1] || '';
  for (const url of ['https://www.instagram.com/seekursor/', 'https://www.tiktok.com/@seekursor']) {
    assert.ok(tags(footer, 'a').some(link => link.href === url && link.rel?.includes('noopener')), 'Missing official footer social link');
    assert.ok(graph[0].sameAs.includes(url), 'Social identity missing from schema');
  }
  assert.ok(!html.includes('instagram.com/th_harly2.0'), 'Old Instagram identity remains');
  for (const resource of [...tags(html, 'script'), ...tags(html, 'link'), ...tags(html, 'img')]) {
    assert.ok(!/^http:\/\//i.test(resource.src || resource.href || ''), 'Mixed content');
  }
  assert.ok(!html.includes('fonts.googleapis.com') && !html.includes('fonts.gstatic.com'), 'External font dependency remains');
  report.pages.push({ path: `/${locale}`, status: response.status, title, descriptionLength: description.length, canonical: `${origin}/${locale}`, h1: 1, headSchema: true, ogImage: property('og:image') });
}
const robots = await request('/robots.txt');
assert.equal(robots.status, 200);
const rules = await robots.text();
assert.match(rules, /User-Agent: \*/i);
assert.match(rules, /Allow: \//);
assert.ok(rules.includes(`Sitemap: ${origin}/sitemap.xml`));
assert.ok(!/^Disallow: \/\s*$/m.test(rules));
const sitemap = await request('/sitemap.xml');
assert.equal(sitemap.status, 200);
const xml = await sitemap.text();
assert.deepEqual([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]), locales.map(locale => `${origin}/${locale}`));
assert.equal([...xml.matchAll(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g)].length, 3);
for (const path of ['/', '/fr/', '/en/', '/ht/', '/not-a-real-seekursor-page', '/fr/not-a-real-seekursor-page']) {
  let response = await request(path);
  let hops = 0;
  while (response.status >= 300 && response.status < 400 && response.headers.has('location')) {
    assert.ok(++hops <= 1, `Redirect chain at ${path}`);
    response = await request(response.headers.get('location'));
  }
  const missing = path.includes('not-a-real');
  assert.equal(response.status, missing ? 404 : 200, path);
  if (missing) {
    const html = await response.text();
    assert.ok(tags(html, 'meta').some(meta => meta.name === 'robots' && /noindex/.test(meta.content)));
    assert.ok(tags(html, 'a').some(link => link.href === '/fr'), 'Unhelpful 404');
  }
  report.redirects.push({ path, hops, status: response.status });
}
for (const path of ['/brand/seekursor-favicon.ico', '/brand/seekursor-icon-48.png', '/brand/seekursor-icon-512.png', '/brand/seekursor-icon-180.png', ...['light', 'dark'].flatMap(mode => [40, 80, 120, 256].map(width => `/brand/seekursor-mark-${mode}-${width}.webp`))]) {
  const response = await request(path);
  assert.equal(response.status, 200, path);
  report.assets.push({ path, status: response.status });
}
report.robots = { status: robots.status, content: rules };
report.sitemap = { status: sitemap.status, urls: 3, stableLastmod: true };
console.log(JSON.stringify(report, null, 2));
