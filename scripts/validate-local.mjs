import pages from '../src/data/pages.js';

const origin = process.argv[2] ?? 'http://127.0.0.1:4321';
const routes = ['/', '/platform/', '/404.html', ...pages.map((page) => `/${page.slug}/`)];
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
    if (asset.startsWith('/assets/') || asset === '/robots.txt' || asset === '/sitemap.xml') {
      await checkUrl(asset, `Asset referenced by ${route}`);
    }
  }

  for (const href of collectAttributes(html, 'href')) {
    if (!href.startsWith('/') || href.startsWith('//') || href.startsWith('/assets/')) continue;
    const cleanHref = href.split('#')[0].split('?')[0];
    if (!cleanHref || cleanHref === '/') continue;
    if (!expectedRoutes.has(cleanHref) && !expectedRoutes.has(`${cleanHref.replace(/\/$/, '')}/`)) {
      failures.push(`Internal link from ${route} points to missing route ${href}`);
    }
  }
}

const bookDemo = await (await fetch(new URL('/book-demo/', origin))).text();
const formChecks = [
  /<form action="\/thank-you\/" method="get">/,
  /<input id="name" name="name" required>/,
  /<input id="email" name="email" type="email" required>/,
  /<input id="company" name="company" required>/,
  /<select id="platform" name="platform">/,
  /<textarea id="message" name="message" placeholder="Example: Our customer uses Coupa and asked if our Shopify store supports PunchOut\.">/
];

for (const check of formChecks) {
  if (!check.test(bookDemo)) failures.push(`Book-demo form check failed: ${check}`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Validated ${routes.length} routes, local assets, internal links, and the book-demo form.`);
