import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const origin = process.argv[2] ?? 'http://127.0.0.1:4321';
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pagesRoot = path.join(projectRoot, 'src', 'pages');

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function routeFromPage(filePath) {
  const relative = path.relative(pagesRoot, filePath).split(path.sep).join('/');
  if (relative === 'index.astro') return '/';
  if (relative === '404.astro') return '/404.html';
  return `/${relative.replace(/\/index\.astro$/, '/').replace(/\.astro$/, '/')}`;
}

const routes = walk(pagesRoot)
  .filter((file) => file.endsWith('.astro') && !file.includes('['))
  .map(routeFromPage)
  .sort((a, b) => a.localeCompare(b));
const expectedRoutes = new Set(routes);
const failures = [];

function collectAttributes(html, attrName) {
  const matches = html.matchAll(new RegExp(`${attrName}="([^"]+)"`, 'g'));
  return [...matches].map((match) => match[1]);
}

async function checkUrl(pathname, label) {
  const response = await fetch(new URL(pathname, origin));
  const expectedNotFoundPage = pathname === '/404.html' && response.status === 404;
  if (!response.ok && !expectedNotFoundPage) failures.push(`${label} ${pathname} returned ${response.status}`);
  return response;
}

for (const route of routes) {
  const response = await checkUrl(route, 'Route');
  if (!response.ok && !(route === '/404.html' && response.status === 404)) continue;
  const html = await response.text();

  for (const asset of [...collectAttributes(html, 'src'), ...collectAttributes(html, 'href')]) {
    if (!asset.startsWith('/') || asset.startsWith('//')) continue;
    if (asset.startsWith('/assets/') || asset.startsWith('/_astro/') || asset === '/robots.txt' || asset === '/sitemap.xml') {
      await checkUrl(asset, `Asset referenced by ${route}`);
    }
  }

  for (const href of collectAttributes(html, 'href')) {
    if (!href.startsWith('/') || href.startsWith('//') || href.startsWith('/assets/') || href.startsWith('/_astro/')) continue;
    const cleanHref = href.split('#')[0].split('?')[0];
    if (!cleanHref || cleanHref === '/') continue;
    if (!expectedRoutes.has(cleanHref) && !expectedRoutes.has(`${cleanHref.replace(/\/$/, '')}/`)) {
      failures.push(`Internal link from ${route} points to missing route ${href}`);
    }
  }
}

const bookDemo = await (await fetch(new URL('/book-demo/', origin))).text();
const formChecks = [
  /<form\b(?=[^>]*\bid="demoForm")(?=[^>]*\baction="\/api\/book-demo\.php")(?=[^>]*\bmethod="post")[^>]*>/,
  /<input\b(?=[^>]*\bid="name")(?=[^>]*\bname="name")(?=[^>]*\brequired\b)[^>]*>/,
  /<input\b(?=[^>]*\bid="email")(?=[^>]*\bname="email")(?=[^>]*\btype="email")(?=[^>]*\brequired\b)[^>]*>/,
  /<input\b(?=[^>]*\bid="company")(?=[^>]*\bname="company")(?=[^>]*\brequired\b)[^>]*>/,
  /<select\b(?=[^>]*\bid="platform")(?=[^>]*\bname="platform")[^>]*>/,
  /<input\b(?=[^>]*\bid="selectedDateISO")(?=[^>]*\bname="selectedDateISO")(?=[^>]*\btype="hidden")[^>]*>/,
  /<input\b(?=[^>]*\bid="selectedTime")(?=[^>]*\bname="selectedTime")(?=[^>]*\btype="hidden")[^>]*>/,
  /<textarea\b(?=[^>]*\bid="message")(?=[^>]*\bname="message")(?=[^>]*\bplaceholder="Example: Our customer uses Coupa and asked if our Shopify store supports PunchOut\.")[^>]*>/,
  /id="dateList"/,
  /id="timeList"/
];

for (const check of formChecks) {
  if (!check.test(bookDemo)) failures.push(`Book-demo form check failed: ${check}`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Validated ${routes.length} routes, local assets, internal links, and the book-demo form.`);
