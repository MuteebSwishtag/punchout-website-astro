import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { corePages } from '../src/lib/site-registry.mjs';
import { CANONICAL_ORIGIN } from '../src/lib/site-config.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const eligible = corePages.filter((page) => page.sitemapEligible);
const urls = [];

for (const page of eligible) {
  const builtFile = path.join(dist, page.url === '/' ? 'index.html' : `${page.url.slice(1)}index.html`);
  if (!existsSync(builtFile)) throw new Error(`Published route has no built HTML: ${page.url}`);
  const html = readFileSync(builtFile, 'utf8');
  const head = html.split('</head>', 1)[0];
  if (!head.includes('<title>') || /<meta name="robots" content="[^"]*noindex/i.test(head)) {
    throw new Error(`Published route is not indexable: ${page.url}`);
  }
  const canonicals = [...head.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map((match) => match[1]);
  if (canonicals.length !== 1 || canonicals[0] !== page.canonicalUrl) {
    throw new Error(`Built canonical does not match the registry: ${page.url}`);
  }
  urls.push(page.canonicalUrl);
}

if (new Set(urls).size !== urls.length) throw new Error('Duplicate sitemap URLs.');
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((url) => `  <url><loc>${url}</loc></url>`),
  '</urlset>',
  ''
].join('\n');

writeFileSync(path.join(dist, 'sitemap.xml'), xml);
writeFileSync(path.join(root, 'public', 'sitemap.xml'), xml);
console.log(`Generated ${urls.length} canonical sitemap URLs for ${CANONICAL_ORIGIN}.`);
