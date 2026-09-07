import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.resolve(projectRoot, '..');
const srcRoot = path.join(projectRoot, 'src');
const publicRoot = path.join(projectRoot, 'public');

const specialStandalone = new Set(['index.html', 'platform/index.html']);
const specialShared = new Set(['404.html']);

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

function cleanGenerated() {
  for (const rel of ['src', 'public']) {
    const target = path.join(projectRoot, rel);
    if (existsSync(target)) rmSync(target, { recursive: true, force: true });
  }
  ensureDir(path.join(srcRoot, 'components'));
  ensureDir(path.join(srcRoot, 'layouts'));
  ensureDir(path.join(srcRoot, 'fragments', 'pages'));
  ensureDir(path.join(srcRoot, 'fragments', 'original'));
  ensureDir(path.join(srcRoot, 'fragments', 'premain'));
  ensureDir(path.join(srcRoot, 'fragments', 'shared'));
  ensureDir(path.join(srcRoot, 'data'));
  ensureDir(path.join(srcRoot, 'pages'));
  ensureDir(publicRoot);
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'astro-website' || entry.name === '.git') return [];
      return walk(fullPath);
    }
    return [fullPath];
  });
}

function slash(filePath) {
  return filePath.split(path.sep).join('/');
}

function routeFromHtml(relativePath) {
  const normalized = slash(relativePath);
  if (normalized === 'index.html') return '';
  if (normalized === '404.html') return '404';
  return normalized.replace(/\/index\.html$/, '').replace(/\.html$/, '');
}

function extractBetween(source, start, end, fromIndex = 0) {
  const startIndex = source.indexOf(start, fromIndex);
  if (startIndex < 0) return '';
  const endIndex = source.indexOf(end, startIndex);
  if (endIndex < 0) return '';
  return source.slice(startIndex, endIndex + end.length);
}

function extractMeta(source, relativePath) {
  const title = decodeBasicEntities(source.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? 'PunchOut Central');
  const description = decodeBasicEntities(source.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] ?? '');
  const bodyAttrs = source.match(/<body([^>]*)>/i)?.[1]?.trim() ?? '';
  const bodyClass = bodyAttrs.match(/class="([^"]*)"/i)?.[1] ?? '';
  return { title, description, bodyClass, source: slash(relativePath) };
}

function decodeBasicEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function extractBodyInner(source) {
  const bodyOpen = source.match(/<body[^>]*>/i);
  if (!bodyOpen?.index && bodyOpen?.index !== 0) return '';
  const bodyStart = bodyOpen.index + bodyOpen[0].length;
  const bodyEnd = source.lastIndexOf('</body>');
  return source.slice(bodyStart, bodyEnd).trim();
}

function extractHeadInner(source) {
  const headStart = source.indexOf('<head>');
  const headEnd = source.indexOf('</head>');
  return source.slice(headStart + '<head>'.length, headEnd).trim();
}

function extractMain(source) {
  const mainStart = source.indexOf('<main>');
  const footerStart = source.indexOf('<footer', mainStart);
  return source.slice(mainStart, footerStart).trim();
}

function extractSharedPart(source, pageName) {
  const header = extractBetween(source, '<header id="hdr"', '</header>');
  const mainStart = source.indexOf('<main>');
  const afterHeader = source.indexOf('</header>') + '</header>'.length;
  const beforeMain = source.slice(afterHeader, mainStart).trim();
  const subnavStart = beforeMain.indexOf('<nav class="pc-subnav"');
  const mobile = subnavStart >= 0 ? beforeMain.slice(0, subnavStart).trim() : beforeMain;
  const preMain = subnavStart >= 0 ? beforeMain.slice(subnavStart).trim() : '';
  const footerStart = source.indexOf('<footer', mainStart);
  const scriptStart = source.indexOf('<script', footerStart);
  if (!header || !mobile || footerStart < 0 || scriptStart < 0) {
    throw new Error(`Unable to extract shared layout from ${pageName}`);
  }
  const footer = source.slice(footerStart, scriptStart).trim();
  return { header, mobile, preMain, footer };
}

function copyPublicAssets() {
  const sourceAssets = path.join(sourceRoot, 'assets');
  const targetAssets = path.join(publicRoot, 'assets');
  ensureDir(targetAssets);
  for (const file of readdirSync(sourceAssets)) {
    const sourceFile = path.join(sourceAssets, file);
    if (statSync(sourceFile).isFile()) copyFileSync(sourceFile, path.join(targetAssets, file));
  }
  for (const file of ['robots.txt', 'sitemap.xml']) {
    copyFileSync(path.join(sourceRoot, file), path.join(publicRoot, file));
  }
}

function writeProjectShell() {
  writeFileSync(path.join(srcRoot, 'components', 'Header.astro'), `---
import headerHtml from '../fragments/shared/header.html?raw';
import mobileHtml from '../fragments/shared/mobile-menu.html?raw';
---
<Fragment set:html={headerHtml} />
<Fragment set:html={mobileHtml} />
`);

  writeFileSync(path.join(srcRoot, 'components', 'Footer.astro'), `---
import footerHtml from '../fragments/shared/footer.html?raw';
---
<Fragment set:html={footerHtml} />
`);

  writeFileSync(path.join(srcRoot, 'layouts', 'SiteLayout.astro'), `---
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title: string;
  description?: string;
}

const { title, description = '' } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    {description && <meta name="description" content={description}>}
    <meta name="theme-color" content="#99FEEC">
    <title>{title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://cdn.brandfetch.io" crossorigin>
    <link rel="dns-prefetch" href="//cdn.brandfetch.io">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/assets/site.css">
  </head>
  <body class="inner-page">
    <Header />
    <slot />
    <Footer />
    <script src="/assets/site.js" defer></script>
  </body>
</html>
`);

  writeFileSync(path.join(srcRoot, 'layouts', 'OriginalHtmlLayout.astro'), `---
interface Props {
  headHtml: string;
  bodyHtml: string;
  bodyClass?: string;
}

const { headHtml, bodyHtml, bodyClass = '' } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <Fragment set:html={headHtml} />
  </head>
  <body class={bodyClass || undefined}>
    <Fragment set:html={bodyHtml} />
  </body>
</html>
`);
}

function writeDynamicRoute() {
  writeFileSync(path.join(srcRoot, 'pages', '[...slug].astro'), `---
import SiteLayout from '../layouts/SiteLayout.astro';
import pages from '../data/pages.js';

const pageHtml = import.meta.glob('../fragments/pages/**/*.html', {
  query: '?raw',
  import: 'default',
  eager: true
});
const preMainHtml = import.meta.glob('../fragments/premain/**/*.html', {
  query: '?raw',
  import: 'default',
  eager: true
});

export function getStaticPaths() {
  return pages.map((page) => ({
    params: { slug: page.slug },
    props: { page }
  }));
}

const { page } = Astro.props;
const mainHtml = pageHtml[\`../fragments/pages/\${page.contentFile}\`];
if (!mainHtml) throw new Error(\`Missing HTML fragment for \${page.slug}\`);
const beforeMainHtml = page.preMainFile ? preMainHtml[\`../fragments/premain/\${page.preMainFile}\`] : '';
---
<SiteLayout title={page.title} description={page.description}>
  {beforeMainHtml && <Fragment set:html={beforeMainHtml} />}
  <Fragment set:html={mainHtml} />
</SiteLayout>
`);
}

function writeStandalonePages() {
  const notFoundMeta = extractMeta(readFileSync(path.join(sourceRoot, '404.html'), 'utf8'), '404.html');

  writeFileSync(path.join(srcRoot, 'pages', 'index.astro'), `---
import OriginalHtmlLayout from '../layouts/OriginalHtmlLayout.astro';
import headHtml from '../fragments/original/home-head.html?raw';
import bodyHtml from '../fragments/original/home-body.html?raw';
---
<OriginalHtmlLayout headHtml={headHtml} bodyHtml={bodyHtml} />
`);

  ensureDir(path.join(srcRoot, 'pages', 'platform'));
  writeFileSync(path.join(srcRoot, 'pages', 'platform', 'index.astro'), `---
import OriginalHtmlLayout from '../../layouts/OriginalHtmlLayout.astro';
import headHtml from '../../fragments/original/platform-head.html?raw';
import bodyHtml from '../../fragments/original/platform-body.html?raw';
---
<OriginalHtmlLayout headHtml={headHtml} bodyHtml={bodyHtml} />
`);

  writeFileSync(path.join(srcRoot, 'pages', '404.astro'), `---
import SiteLayout from '../layouts/SiteLayout.astro';
import mainHtml from '../fragments/pages/404.html?raw';

const page = {
  title: ${JSON.stringify(notFoundMeta.title)},
  description: ${JSON.stringify(notFoundMeta.description)}
};
---
<SiteLayout title={page.title} description={page.description}>
  <Fragment set:html={mainHtml} />
</SiteLayout>
`);
}

function convertPages() {
  const htmlFiles = walk(sourceRoot)
    .filter((file) => file.endsWith('.html'))
    .map((file) => ({ absolute: file, relative: slash(path.relative(sourceRoot, file)) }))
    .sort((a, b) => a.relative.localeCompare(b.relative));

  const sharedSource = readFileSync(path.join(sourceRoot, 'contact', 'index.html'), 'utf8');
  const shared = extractSharedPart(sharedSource, 'contact/index.html');
  writeFileSync(path.join(srcRoot, 'fragments', 'shared', 'header.html'), shared.header);
  writeFileSync(path.join(srcRoot, 'fragments', 'shared', 'mobile-menu.html'), shared.mobile);
  writeFileSync(path.join(srcRoot, 'fragments', 'shared', 'footer.html'), shared.footer);

  const pageManifest = [];

  for (const { absolute, relative } of htmlFiles) {
    const html = readFileSync(absolute, 'utf8');
    const meta = extractMeta(html, relative);

    if (specialStandalone.has(relative)) {
      const prefix = relative === 'index.html' ? 'home' : 'platform';
      writeFileSync(path.join(srcRoot, 'fragments', 'original', `${prefix}-head.html`), extractHeadInner(html));
      writeFileSync(path.join(srcRoot, 'fragments', 'original', `${prefix}-body.html`), extractBodyInner(html));
      continue;
    }

    const route = routeFromHtml(relative);
    const contentFile = route === '404' ? '404.html' : `${route}/index.html`;
    const sourceShared = extractSharedPart(html, relative);
    ensureDir(path.join(srcRoot, 'fragments', 'pages', path.dirname(contentFile)));
    writeFileSync(path.join(srcRoot, 'fragments', 'pages', contentFile), extractMain(html));

    let preMainFile = '';
    if (sourceShared.preMain) {
      preMainFile = contentFile;
      ensureDir(path.join(srcRoot, 'fragments', 'premain', path.dirname(preMainFile)));
      writeFileSync(path.join(srcRoot, 'fragments', 'premain', preMainFile), sourceShared.preMain);
    }

    if (!specialShared.has(relative)) {
      pageManifest.push({
        slug: route,
        contentFile,
        preMainFile,
        title: meta.title,
        description: meta.description,
        source: meta.source
      });
    }
  }

  writeFileSync(
    path.join(srcRoot, 'data', 'pages.js'),
    `const pages = ${JSON.stringify(pageManifest, null, 2)};\n\nexport default pages;\n`
  );
}

cleanGenerated();
copyPublicAssets();
writeProjectShell();
writeDynamicRoute();
writeStandalonePages();
convertPages();

console.log('Converted original static site into Astro source files.');
