import { createServer } from 'node:http';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs';
import path from 'node:path';
import { execFileSync, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import pages from '../src/data/pages.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.resolve(projectRoot, '..');
const distRoot = path.join(projectRoot, 'dist');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const cdpPort = 9333;
const failures = [];
const warnings = [];

const routes = ['/', '/platform/', '/404.html', ...pages.map((page) => `/${page.slug}/`)];
const viewports = [
  { name: 'desktop', width: 1440, height: 1000, scale: 1 },
  { name: 'tablet', width: 820, height: 1000, scale: 1 },
  { name: 'mobile', width: 390, height: 844, scale: 2 }
];
const responsiveSample = ['/', '/platform/', '/book-demo/', '/integrations/coupa/', '/faq/', '/pricing/'];

function serveStatic(root) {
  const server = createServer((request, response) => {
    const url = new URL(request.url, 'http://127.0.0.1');
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith('/')) pathname += 'index.html';
    const requested = path.resolve(root, `.${pathname}`);
    if (!requested.startsWith(root)) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    let filePath = requested;
    if (!existsSync(filePath) || !statSync(filePath).isFile()) {
      filePath = path.join(root, '404.html');
      response.statusCode = 404;
    }
    const ext = path.extname(filePath);
    const types = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.webp': 'image/webp',
      '.xml': 'application/xml; charset=utf-8',
      '.txt': 'text/plain; charset=utf-8'
    };
    response.setHeader('content-type', types[ext] ?? 'application/octet-stream');
    response.end(readFileSync(filePath));
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

function serverOrigin(server) {
  const address = server.address();
  return `http://127.0.0.1:${address.port}`;
}

async function waitForJson(url, timeoutMs = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function removeWithRetry(target) {
  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      rmSync(target, { recursive: true, force: true });
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
}

class CdpSession {
  constructor(wsUrl) {
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
    this.ready = new Promise((resolve, reject) => {
      this.ws = new WebSocket(wsUrl);
      this.ws.addEventListener('open', resolve, { once: true });
      this.ws.addEventListener('error', reject, { once: true });
      this.ws.addEventListener('message', (event) => this.handleMessage(event.data));
    });
  }

  handleMessage(data) {
    const message = JSON.parse(typeof data === 'string' ? data : Buffer.from(data).toString('utf8'));
    if (message.id && this.pending.has(message.id)) {
      const { resolve, reject } = this.pending.get(message.id);
      this.pending.delete(message.id);
      message.error ? reject(new Error(message.error.message)) : resolve(message.result);
      return;
    }
    if (message.method && this.listeners.has(message.method)) {
      for (const listener of this.listeners.get(message.method)) listener(message.params ?? {});
    }
  }

  on(method, listener) {
    if (!this.listeners.has(method)) this.listeners.set(method, new Set());
    this.listeners.get(method).add(listener);
  }

  once(method) {
    return new Promise((resolve) => {
      const listener = (params) => {
        this.listeners.get(method).delete(listener);
        resolve(params);
      };
      this.on(method, listener);
    });
  }

  async send(method, params = {}) {
    await this.ready;
    const id = this.nextId++;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }

  close() {
    this.ws.close();
  }
}

async function openPage(chromeOrigin, url, viewport) {
  const created = await fetch(`${chromeOrigin}/json/new?${encodeURIComponent('about:blank')}`, { method: 'PUT' });
  const target = await created.json();
  const session = new CdpSession(target.webSocketDebuggerUrl);
  const errors = [];

  session.on('Runtime.exceptionThrown', (params) => {
    errors.push(params.exceptionDetails?.text ?? 'Runtime exception');
  });
  session.on('Runtime.consoleAPICalled', (params) => {
    if (params.type === 'error') errors.push(params.args?.map((arg) => arg.value ?? arg.description).join(' ') ?? 'console.error');
  });
  session.on('Log.entryAdded', (params) => {
    const entry = params.entry;
    if (entry?.level === 'error' && entry.url?.startsWith(url) && !entry.url.endsWith('/favicon.ico')) {
      errors.push(entry.text);
    }
  });

  await session.send('Page.enable');
  await session.send('Runtime.enable');
  await session.send('Log.enable');
  await session.send('Emulation.setDeviceMetricsOverride', {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: viewport.scale,
    mobile: viewport.name === 'mobile'
  });

  const loaded = session.once('Page.loadEventFired');
  await session.send('Page.navigate', { url });
  await Promise.race([loaded, new Promise((resolve) => setTimeout(resolve, 7000))]);
  await session.send('Runtime.evaluate', {
    expression: 'document.fonts && document.fonts.ready',
    awaitPromise: true
  }).catch(() => {});
  await new Promise((resolve) => setTimeout(resolve, 250));

  return { session, errors };
}

async function evalValue(session, expression) {
  const result = await session.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true
  });
  return result.result.value;
}

async function checkPage(chromeOrigin, origin, route, viewport) {
  const { session, errors } = await openPage(chromeOrigin, `${origin}${route}`, viewport);
  const state = await evalValue(session, `(() => {
    const localBrokenImages = [...document.images]
      .filter((img) => img.currentSrc.startsWith(location.origin))
      .filter((img) => img.complete && img.naturalWidth === 0)
      .map((img) => img.getAttribute('src'));
    return {
      title: document.title,
      hasHeader: !!document.querySelector('header#hdr'),
      hasMain: !!document.querySelector('main'),
      hasFooter: !!document.querySelector('footer'),
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      localBrokenImages
    };
  })()`);
  session.close();

  for (const error of errors) failures.push(`${route} ${viewport.name} console/runtime error: ${error}`);
  if (!state.title) failures.push(`${route} ${viewport.name} has no document title`);
  if (route !== '/404.html' && !state.hasHeader) failures.push(`${route} ${viewport.name} missing header`);
  if (route !== '/404.html' && !state.hasMain) failures.push(`${route} ${viewport.name} missing main`);
  if (route !== '/404.html' && !state.hasFooter) failures.push(`${route} ${viewport.name} missing footer`);
  if (state.localBrokenImages.length) failures.push(`${route} ${viewport.name} broken local image(s): ${state.localBrokenImages.join(', ')}`);
  if (state.scrollWidth > state.viewportWidth + 2) warnings.push(`${route} ${viewport.name} horizontal overflow: ${state.scrollWidth}px > ${state.viewportWidth}px`);
}

async function checkInteractions(chromeOrigin, origin) {
  let page = await openPage(chromeOrigin, `${origin}/contact/`, viewports[0]);
  let ok = await evalValue(page.session, `(() => {
    document.querySelector('.drop > button').click();
    const opened = document.querySelector('.drop').classList.contains('is-open');
    document.body.click();
    const closed = !document.querySelector('.drop').classList.contains('is-open');
    return opened && closed;
  })()`);
  if (!ok) failures.push('Desktop mega-menu open/close interaction failed');
  page.session.close();

  page = await openPage(chromeOrigin, `${origin}/contact/`, viewports[2]);
  ok = await evalValue(page.session, `(() => {
    document.getElementById('hamb').click();
    const opened = document.getElementById('mob').classList.contains('open') &&
      document.getElementById('hamb').getAttribute('aria-expanded') === 'true' &&
      document.body.style.overflow === 'hidden';
    document.querySelector('#mob a[href="/pricing/"]').click();
    const closed = !document.getElementById('mob').classList.contains('open') &&
      document.getElementById('hamb').getAttribute('aria-expanded') === 'false' &&
      document.body.style.overflow === '';
    return opened && closed;
  })()`);
  if (!ok) failures.push('Mobile menu open/link-close interaction failed');
  page.session.close();

  page = await openPage(chromeOrigin, `${origin}/faq/`, viewports[0]);
  ok = await evalValue(page.session, `(() => {
    const item = document.querySelector('.fi');
    item.querySelector('.fq').click();
    return item.classList.contains('open') && parseInt(item.querySelector('.fa').style.maxHeight, 10) > 0;
  })()`);
  if (!ok) failures.push('FAQ accordion interaction failed');
  page.session.close();

  page = await openPage(chromeOrigin, `${origin}/platform/`, viewports[0]);
  ok = await evalValue(page.session, `(async () => {
    window.scrollTo(0, 900);
    window.dispatchEvent(new Event('scroll'));
    await new Promise((resolve) => setTimeout(resolve, 250));
    return document.body.classList.contains('subnav-on') && !!document.querySelector('[data-scrollspy].is-active');
  })()`);
  if (!ok) failures.push('Platform scroll-spy subnav interaction failed');
  page.session.close();

  page = await openPage(chromeOrigin, `${origin}/book-demo/`, viewports[0]);
  ok = await evalValue(page.session, `(() => {
    const form = document.querySelector('form');
    return form?.getAttribute('action') === '/thank-you/' &&
      form?.getAttribute('method') === 'get' &&
      ['name','email','company','platform','message'].every((name) => !!form.elements[name]);
  })()`);
  if (!ok) failures.push('Book-demo form structure/action check failed');
  page.session.close();
}

async function main() {
  if (!existsSync(chromePath)) throw new Error(`Chrome not found at ${chromePath}`);

  const originalServer = await serveStatic(sourceRoot);
  const astroServer = await serveStatic(distRoot);
  const tmpRoot = path.join(projectRoot, '.tmp');
  mkdirSync(tmpRoot, { recursive: true });
  const chromeProfile = mkdtempSync(path.join(tmpRoot, 'astro-qa-chrome-'));
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-networking',
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${chromeProfile}`,
    'about:blank'
  ], { stdio: 'ignore' });

  try {
    const chromeOrigin = `http://127.0.0.1:${cdpPort}`;
    await waitForJson(`${chromeOrigin}/json/version`);
    const astroOrigin = serverOrigin(astroServer);

    for (const route of routes) {
      await checkPage(chromeOrigin, astroOrigin, route, viewports[0]);
    }
    for (const route of responsiveSample) {
      await checkPage(chromeOrigin, astroOrigin, route, viewports[1]);
      await checkPage(chromeOrigin, astroOrigin, route, viewports[2]);
    }
    await checkInteractions(chromeOrigin, astroOrigin);

    const originalOrigin = serverOrigin(originalServer);
    for (const route of routes) {
      const [original, astro] = await Promise.all([
        fetch(`${originalOrigin}${route}`).then((response) => response.text()),
        fetch(`${astroOrigin}${route}`).then((response) => response.text())
      ]);
      const originalTitle = original.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
      const astroTitle = astro.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
      const originalDescription = original.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] ?? '';
      const astroDescription = astro.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] ?? '';
      if (originalTitle !== astroTitle) failures.push(`${route} title differs from original`);
      if (originalDescription !== astroDescription) failures.push(`${route} description differs from original`);
    }
  } finally {
    if (chrome.pid) {
      try {
        execFileSync('taskkill', ['/pid', String(chrome.pid), '/T', '/F'], { stdio: 'ignore' });
      } catch {
        chrome.kill();
      }
    }
    originalServer.close();
    astroServer.close();
    await removeWithRetry(chromeProfile);
  }

  if (failures.length) {
    console.error(failures.join('\n'));
    if (warnings.length) console.error(`Warnings:\n${warnings.join('\n')}`);
    process.exit(1);
  }

  console.log(`Headless browser QA passed: ${routes.length} desktop routes, ${responsiveSample.length} responsive samples, core JS interactions, form structure, and metadata comparison.`);
  if (warnings.length) console.log(`Warnings:\n${warnings.join('\n')}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
