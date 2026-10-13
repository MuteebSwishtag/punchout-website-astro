import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const output = path.join(root, 'homepage-standalone.html');
const source = path.join(dist, 'index.html');

if (!existsSync(source)) {
  throw new Error('dist/index.html is missing. Run npm.cmd run build first.');
}

const mimeTypes = {
  '.avif': 'image/avif',
  '.css': 'text/css',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2'
};

const assetCache = new Map();

function assetPath(url) {
  const cleanUrl = decodeURIComponent(url.split(/[?#]/, 1)[0]);
  if (cleanUrl.startsWith('/')) return path.join(dist, cleanUrl.slice(1));
  if (cleanUrl.startsWith('../../../assets/')) return path.join(dist, 'assets', cleanUrl.slice('../../../assets/'.length));
  return null;
}

function assetData(url) {
  const file = assetPath(url);
  if (!file || !existsSync(file)) return null;
  if (assetCache.has(file)) return assetCache.get(file);

  const extension = path.extname(file).toLowerCase();
  const mime = mimeTypes[extension];
  if (!mime) return null;

  const data = `data:${mime};base64,${readFileSync(file).toString('base64')}`;
  assetCache.set(file, data);
  return data;
}

function inlineCss(css) {
  return css.replace(/url\((['"]?)(\/[^)'"\s]+)\1\)/g, (match, quote, url) => {
    const data = assetData(url);
    return data ? `url(${data})` : match;
  });
}

function inlineSrcset(value) {
  const firstUrl = value.trim().split(',')[0].trim().split(/\s+/)[0];
  const data = assetData(firstUrl);
  return data ?? value;
}

let html = readFileSync(source, 'utf8');

html = html.replace(/<noscript>\s*(?:<link[^>]*>\s*)+<\/noscript>/g, '');

const stylesheetHrefs = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/g)]
  .map((match) => match[1])
  .filter((href, index, list) => list.indexOf(href) === index);

for (const href of stylesheetHrefs) {
  const file = assetPath(href);
  if (!file || !existsSync(file)) continue;
  const css = inlineCss(readFileSync(file, 'utf8'));
  html = html.replaceAll(new RegExp(`<link[^>]+rel="stylesheet"[^>]+href="${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`, 'g'), `<style data-inlined-from="${href}">\n${css}\n</style>`);
}

html = html.replace(/<link[^>]+rel="stylesheet"[^>]+href="[^"]+"[^>]*>/g, '');
html = html.replace(/<link[^>]+rel="preload"[^>]+as="font"[^>]*>/g, '');
html = html.replace(/<script[^>]+src="https:\/\/www\.googletagmanager\.com\/gtag\/js[^>]*><\/script>/g, '');
html = html.replace(/<noscript>[\s\S]*?(?:googletagmanager|facebook|linkedin|pinterest)[\s\S]*?<\/noscript>/gi, '');
const headEnd = html.indexOf('</head>');
if (headEnd !== -1) {
  const head = html.slice(0, headEnd)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<!--[^>]*(?:Google tag|Meta Pixel|LinkedIn Insight|Pinterest|X Conversion)[^>]*-->/gi, '');
  html = `${head}${html.slice(headEnd)}`;
}

html = html.replace(/srcset="([^"]+)"/g, (_, value) => `srcset="${inlineSrcset(value)}"`);
html = html.replace(/((?:src|href)=")(\/[^"\s]+|\.\.\/\.\.\/\.\.\/assets\/[^"\s]+)(")/g, (match, prefix, url, suffix) => {
  const data = assetData(url);
  return data ? `${prefix}${data}${suffix}` : match;
});
const runtimeAssetUrls = [...new Set(html.match(/\/assets\/[A-Za-z0-9_%().~\/-]+/g) ?? [])];
for (const url of runtimeAssetUrls) {
  const data = assetData(url);
  if (data) html = html.replaceAll(url, data);
}

html = html.replace(/<script([^>]*?)src="\/assets\/site\.js[^>]*><\/script>/g, (_, attributes) => {
  const js = readFileSync(path.join(dist, 'assets', 'site.js'), 'utf8');
  return `<script${attributes}>\n${js}\n</script>`;
});

const mojibake = new Map([
  ['â€™', '’'], ['â€œ', '“'], ['â€', '”'], ['â€”', '—'], ['â€¦', '…'],
  ['â†’', '→'], ['â†“', '↓'], ['â†”', '↔'], ['â†—', '↗'], ['âœ“', '✓'],
  ['âŒ„', '⌄'], ['â—', '●'], ['â—Ž', '◎'], ['âˆž', '∞'], ['ï¼‹', '＋'],
  ['Â·', '·'], ['Â©', '©']
]);
for (const [bad, good] of mojibake) html = html.replaceAll(bad, good);

html = html.replace('<html lang="en">', '<html lang="en" data-standalone="true">');
html = html.replace('</head>', '<style>html{scroll-behavior:smooth} @media print{.pc-mega-panel,.mob,.pc-order-confetti{display:none!important} a{color:inherit}}</style>\n</head>');
const siteJs = readFileSync(path.join(root, 'public', 'assets', 'site.js'), 'utf8');
html = html.replace('</body>', `<script data-inlined-from="/assets/site.js">\n${siteJs}\n</script>\n</body>`);

writeFileSync(output, html, 'utf8');
console.log(`Generated ${path.relative(root, output)} (${Buffer.byteLength(html, 'utf8')} bytes).`);
