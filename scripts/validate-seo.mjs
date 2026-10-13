import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { corePages, getRoute } from '../src/lib/site-registry.mjs';
import { CANONICAL_ORIGIN } from '../src/lib/site-config.mjs';
import { redirects } from '../src/lib/redirects.mjs';
import { faqItems } from '../src/content/faq.mjs';
import { phase4Pages } from '../src/content/phase4-pages.mjs';
import { resourcePages } from '../src/content/resources.mjs';
import { industryPages, insightPages } from '../src/content/phase6-pages.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const failures = [];
const expectedHomeHash = '7a6cff481d55a48328aeb344f602d136b2d5edc9e6c14d44f3110ba8718d4d4b';

function builtFile(route) {
  return path.join(dist, route === '/' ? 'index.html' : route === '/404.html' ? '404.html' : `${route.slice(1)}index.html`);
}

function allHtml(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? allHtml(full) : entry.name.endsWith('.html') ? [full] : [];
  });
}

function routeFromFile(file) {
  const relative = path.relative(dist, file).split(path.sep).join('/');
  if (relative === 'index.html') return '/';
  if (relative === '404.html') return '/404.html';
  return `/${relative.slice(0, -'index.html'.length)}`;
}

function values(head, pattern) {
  return [...head.matchAll(pattern)].map((match) => match[1]);
}

function htmlText(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#39;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

const htmlFiles = allHtml(dist);
for (const file of htmlFiles) {
  const route = routeFromFile(file);
  const html = readFileSync(file, 'utf8');
  const head = html.split('</head>', 1)[0];
  const registered = getRoute(route);
  const published = registered?.publicationEligible === true;
  const titles = values(head, /<title>(.*?)<\/title>/g);
  const descriptions = values(head, /<meta name="description" content="([^"]*)"/g);
  const robots = values(head, /<meta name="robots" content="([^"]*)"/g);
  const canonicals = values(head, /<link rel="canonical" href="([^"]+)"/g);
  const ogTypes = values(head, /<meta property="og:type" content="([^"]+)"/g);
  const ogTitles = values(head, /<meta property="og:title" content="([^"]+)"/g);
  const ogDescriptions = values(head, /<meta property="og:description" content="([^"]+)"/g);
  const ogUrls = values(head, /<meta property="og:url" content="([^"]+)"/g);
  const twitterCards = values(head, /<meta name="twitter:card" content="([^"]+)"/g);
  if (titles.length !== 1 || descriptions.length > 1 || robots.length > 1 || canonicals.length > 1 || ogTypes.length > 1 || ogTitles.length > 1 || ogDescriptions.length > 1 || ogUrls.length > 1 || twitterCards.length > 1) {
    failures.push(`${route}: duplicate or missing core head metadata`);
  }
  if (published) {
    if (/\bnoindex\b/i.test(robots[0] ?? '')) failures.push(`${route}: published route is noindexed`);
    if (descriptions.length !== 1) failures.push(`${route}: published route has no description`);
    if (route === '/' && (canonicals.length !== 1 || canonicals[0] !== registered.canonicalUrl)) {
      failures.push(`${route}: homepage canonical mismatch`);
    }
    if (route !== '/' && (canonicals[0] !== registered.canonicalUrl || ogUrls[0] !== registered.canonicalUrl || ogTypes.length !== 1 || ogTitles.length !== 1 || ogDescriptions.length !== 1 || twitterCards.length !== 1)) {
      failures.push(`${route}: canonical/Open Graph/Twitter metadata mismatch`);
    }
  } else if (!/\bnoindex\b/i.test(robots[0] ?? '') || canonicals.length || ogUrls.length) {
    failures.push(`${route}: unpublished route is indexable or has a canonical/Open Graph URL`);
  }
}

const homeHash = createHash('sha256').update(readFileSync(builtFile('/'))).digest('hex');
if (homeHash !== expectedHomeHash) failures.push(`Homepage HTML changed: ${homeHash}`);

const xml = readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
const publicXml = readFileSync(path.join(root, 'public', 'sitemap.xml'), 'utf8');
if (xml !== publicXml) failures.push('public/ and dist/ sitemaps differ');
if (!xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')) {
  failures.push('Sitemap XML declaration or namespace is invalid');
}
const sitemapUrls = values(xml, /<url><loc>([^<]+)<\/loc><\/url>/g);
const expectedUrls = corePages.filter((page) => page.sitemapEligible).map((page) => page.canonicalUrl);
if (new Set(sitemapUrls).size !== sitemapUrls.length || sitemapUrls.join('|') !== expectedUrls.join('|')) {
  failures.push('Sitemap differs from the approved published registry');
}
for (const url of sitemapUrls) {
  if (!url.startsWith(`${CANONICAL_ORIGIN}/`)) failures.push(`Wrong sitemap host: ${url}`);
  const route = new URL(url).pathname;
  if (!existsSync(builtFile(route))) failures.push(`Sitemap URL has no built page: ${route}`);
}
const robotsTxt = readFileSync(path.join(dist, 'robots.txt'), 'utf8');
if (!robotsTxt.includes(`Sitemap: ${CANONICAL_ORIGIN}/sitemap.xml`)) failures.push('robots.txt sitemap host mismatch');
if (/Disallow:\s*\/(admin|login|thank-you)\//i.test(robotsTxt)) failures.push('robots.txt blocks a page-level noindex route');

const faqHtml = readFileSync(builtFile('/faq/'), 'utf8');
const faqBody = faqHtml.split('</head>', 2)[1] ?? '';
const faqSchemas = values(faqHtml.split('</head>', 1)[0], /<script type="application\/ld\+json">(.*?)<\/script>/gs).map((json) => JSON.parse(json));
const faqSchema = faqSchemas.find((schema) => schema['@type'] === 'FAQPage');
if (!faqSchema || faqSchema.mainEntity.length !== faqItems.length) {
  failures.push('FAQ schema is missing or incomplete');
} else {
  for (const [question, answer] of faqItems) {
    if (!faqBody.includes(question) || !faqBody.includes(answer)) failures.push(`FAQ schema differs from visible content: ${question}`);
  }
}

for (const [route, page] of Object.entries(phase4Pages)) {
  const html = readFileSync(builtFile(route), 'utf8');
  const head = html.split('</head>', 1)[0];
  const body = html.split('</head>', 2)[1] ?? '';
  const schemas = values(head, /<script type="application\/ld\+json">(.*?)<\/script>/gs).map((json) => JSON.parse(json));
  const schema = schemas.find((entry) => entry['@type'] === 'FAQPage');
  if (!schema || schema.mainEntity.length !== page.questions.length) {
    failures.push(`${route}: detail FAQ schema is missing or incomplete`);
    continue;
  }
  for (const { question, answer } of page.questions) {
    if (!body.includes(question) || !body.includes(answer)) failures.push(`${route}: detail FAQ schema differs from visible content: ${question}`);
  }
}

for (const [route, page] of Object.entries(resourcePages)) {
  const html = readFileSync(builtFile(route), 'utf8');
  const head = html.split('</head>', 1)[0];
  const body = html.split('</head>', 2)[1] ?? '';
  const schemas = values(head, /<script type="application\/ld\+json">(.*?)<\/script>/gs).map((json) => JSON.parse(json));
  if (!schemas.some((entry) => entry['@type'] === 'Article')) failures.push(`${route}: Article schema is missing`);
  if (!schemas.some((entry) => entry['@type'] === 'BreadcrumbList')) failures.push(`${route}: breadcrumb schema is missing`);
  if (!body.includes(htmlText(page.breadcrumb)) || !body.includes(htmlText(page.title))) failures.push(`${route}: visible breadcrumb or title is missing`);
}

for (const [route, page] of Object.entries(insightPages)) {
  const html = readFileSync(builtFile(route), 'utf8');
  const head = html.split('</head>', 1)[0];
  const body = html.split('</head>', 2)[1] ?? '';
  const schemas = values(head, /<script type="application\/ld\+json">(.*?)<\/script>/gs).map((json) => JSON.parse(json));
  if (!schemas.some((entry) => entry['@type'] === 'Article')) failures.push(`${route}: Article schema is missing`);
  if (!schemas.some((entry) => entry['@type'] === 'BreadcrumbList')) failures.push(`${route}: breadcrumb schema is missing`);
  if (!body.includes(htmlText(page.breadcrumb)) || !body.includes(htmlText(page.title))) failures.push(`${route}: visible breadcrumb or title is missing`);
  if (page.questions?.length) {
    const schema = schemas.find((entry) => entry['@type'] === 'FAQPage');
    if (!schema || schema.mainEntity.length !== page.questions.length) failures.push(`${route}: insight FAQ schema is missing or incomplete`);
    for (const { question, answer } of page.questions) {
      if (!body.includes(question) || (!body.includes(answer) && !body.includes(htmlText(answer)))) failures.push(`${route}: insight FAQ differs from visible content: ${question}`);
    }
  }
}

for (const [route, page] of Object.entries(industryPages)) {
  const html = readFileSync(builtFile(route), 'utf8');
  const head = html.split('</head>', 1)[0];
  const body = html.split('</head>', 2)[1] ?? '';
  const schemas = values(head, /<script type="application\/ld\+json">(.*?)<\/script>/gs).map((json) => JSON.parse(json));
  if (!schemas.some((entry) => entry['@type'] === 'BreadcrumbList')) failures.push(`${route}: industry breadcrumb schema is missing`);
  if (!body.includes(htmlText(page.eyebrow)) || !body.includes(htmlText(page.title))) failures.push(`${route}: visible industry breadcrumb or title is missing`);
  const schema = schemas.find((entry) => entry['@type'] === 'FAQPage');
  if (!schema || schema.mainEntity.length !== page.questions.length) failures.push(`${route}: industry FAQ schema is missing or incomplete`);
}

const guideHtml = readFileSync(builtFile('/resources/punchout-guide/'), 'utf8');
const guideHead = guideHtml.split('</head>', 1)[0];
const guideSchemas = values(guideHead, /<script type="application\/ld\+json">(.*?)<\/script>/gs).map((json) => JSON.parse(json));
if (!guideSchemas.some((entry) => entry['@type'] === 'Article') || !guideSchemas.some((entry) => entry['@type'] === 'BreadcrumbList')) {
  failures.push('/resources/punchout-guide/: Article or breadcrumb schema is missing');
}

const htaccess = readFileSync(path.join(dist, '.htaccess'), 'utf8');
const active = redirects.filter((redirect) => redirect.status === 'active');
if (values(htaccess, /^\s*(RedirectMatch 301 .+)$/gm).length !== active.length) failures.push('Apache redirect count differs from reviewed map');
for (const { source, destination } of active) {
  const directive = `RedirectMatch 301 ^${source.slice(0, -1)}/?$ ${destination}`;
  if (!htaccess.includes(directive)) failures.push(`Missing Apache redirect: ${source}`);
  if (!existsSync(builtFile(source))) failures.push(`Redirect source route was deleted: ${source}`);
  if (!existsSync(builtFile(destination)) || !getRoute(destination)?.publicationEligible) failures.push(`Redirect destination is not published: ${destination}`);
  if (active.some((redirect) => redirect.source === destination)) failures.push(`Redirect chain or loop at ${source}`);
  if (sitemapUrls.includes(new URL(source, CANONICAL_ORIGIN).href)) failures.push(`Redirect source in sitemap: ${source}`);
  if (/^\/(admin|api|login|thank-you|assets|_astro)\//.test(source)) failures.push(`Protected route redirected: ${source}`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`SEO checks passed: ${corePages.length} registry URLs, ${expectedUrls.length} sitemap URLs, ${htmlFiles.length} built pages, ${active.length} redirects; homepage ${homeHash}.`);
