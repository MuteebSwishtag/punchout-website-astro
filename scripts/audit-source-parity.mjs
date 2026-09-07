import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pages from '../src/data/pages.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.resolve(projectRoot, '..');
const failures = [];

function slash(filePath) {
  return filePath.split(path.sep).join('/');
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

function extractBetween(source, start, end, fromIndex = 0) {
  const startIndex = source.indexOf(start, fromIndex);
  if (startIndex < 0) return '';
  const endIndex = source.indexOf(end, startIndex);
  if (endIndex < 0) return '';
  return source.slice(startIndex, endIndex + end.length);
}

function extractBodyInner(source) {
  const bodyOpen = source.match(/<body[^>]*>/i);
  const bodyStart = bodyOpen.index + bodyOpen[0].length;
  return source.slice(bodyStart, source.lastIndexOf('</body>')).trim();
}

function extractHeadInner(source) {
  return source.slice(source.indexOf('<head>') + '<head>'.length, source.indexOf('</head>')).trim();
}

function extractMain(source) {
  const mainStart = source.indexOf('<main>');
  const footerStart = source.indexOf('<footer', mainStart);
  return source.slice(mainStart, footerStart).trim();
}

function extractSharedPart(source) {
  const header = extractBetween(source, '<header id="hdr"', '</header>');
  const mainStart = source.indexOf('<main>');
  const afterHeader = source.indexOf('</header>') + '</header>'.length;
  const beforeMain = source.slice(afterHeader, mainStart).trim();
  const subnavStart = beforeMain.indexOf('<nav class="pc-subnav"');
  const mobile = subnavStart >= 0 ? beforeMain.slice(0, subnavStart).trim() : beforeMain;
  const preMain = subnavStart >= 0 ? beforeMain.slice(subnavStart).trim() : '';
  const footerStart = source.indexOf('<footer', mainStart);
  const scriptStart = source.indexOf('<script', footerStart);
  const footer = source.slice(footerStart, scriptStart).trim();
  return { header, mobile, preMain, footer };
}

function hash(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex');
}

function expectEqual(label, actual, expected) {
  if (actual !== expected) failures.push(`${label} differs`);
}

function decodeBasicEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

const shared = {
  header: readFileSync(path.join(projectRoot, 'src/fragments/shared/header.html'), 'utf8'),
  mobile: readFileSync(path.join(projectRoot, 'src/fragments/shared/mobile-menu.html'), 'utf8'),
  footer: readFileSync(path.join(projectRoot, 'src/fragments/shared/footer.html'), 'utf8')
};

for (const page of pages) {
  const originalPath = path.join(sourceRoot, page.source);
  const original = readFileSync(originalPath, 'utf8');
  const generated = readFileSync(path.join(projectRoot, 'src/fragments/pages', page.contentFile), 'utf8');
  const sourceShared = extractSharedPart(original);
  const title = decodeBasicEntities(original.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '');
  const description = decodeBasicEntities(original.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] ?? '');

  expectEqual(`${page.source} title`, page.title, title);
  expectEqual(`${page.source} description`, page.description, description);
  expectEqual(`${page.source} main`, generated, extractMain(original));
  expectEqual(`${page.source} header`, shared.header, sourceShared.header);
  expectEqual(`${page.source} mobile menu`, shared.mobile, sourceShared.mobile);
  if (page.preMainFile) {
    expectEqual(
      `${page.source} pre-main`,
      readFileSync(path.join(projectRoot, 'src/fragments/premain', page.preMainFile), 'utf8'),
      sourceShared.preMain
    );
  } else if (sourceShared.preMain) {
    failures.push(`${page.source} pre-main fragment missing`);
  }
  expectEqual(`${page.source} footer`, shared.footer, sourceShared.footer);
}

for (const [source, headFile, bodyFile] of [
  ['index.html', 'home-head.html', 'home-body.html'],
  ['platform/index.html', 'platform-head.html', 'platform-body.html']
]) {
  const original = readFileSync(path.join(sourceRoot, source), 'utf8');
  expectEqual(`${source} head`, readFileSync(path.join(projectRoot, 'src/fragments/original', headFile), 'utf8'), extractHeadInner(original));
  expectEqual(`${source} body`, readFileSync(path.join(projectRoot, 'src/fragments/original', bodyFile), 'utf8'), extractBodyInner(original));
}

const original404 = readFileSync(path.join(sourceRoot, '404.html'), 'utf8');
expectEqual('404 main', readFileSync(path.join(projectRoot, 'src/fragments/pages/404.html'), 'utf8'), extractMain(original404));

for (const file of ['assets/site.css', 'assets/site.js', 'assets/punchout-central-logo.webp', 'robots.txt', 'sitemap.xml']) {
  const copied = path.join(projectRoot, 'public', file);
  if (!existsSync(copied)) failures.push(`${file} was not copied`);
  else expectEqual(`${file} hash`, hash(path.join(sourceRoot, file)), hash(copied));
}

const originalCount = walk(sourceRoot).filter((file) => file.endsWith('.html')).length;
if (originalCount !== pages.length + 3) {
  failures.push(`Expected ${originalCount} original pages to map to ${pages.length + 3} Astro pages`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Source parity audit passed for ${pages.length + 3} pages and copied assets.`);
