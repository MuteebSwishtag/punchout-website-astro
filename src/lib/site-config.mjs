// The production site uses the non-www host as its canonical origin. The
// Apache host redirect keeps alternate www requests on the same URL paths.
export const CANONICAL_ORIGIN = 'https://punchoutcentral.com';

export function normalizePublicPath(pathname) {
  if (pathname === '/') return '/';
  const clean = `/${String(pathname).split(/[?#]/, 1)[0].replace(/^\/+|\/+$/g, '')}/`;
  if (clean.includes('//') || clean.includes('..')) throw new Error(`Invalid public path: ${pathname}`);
  return clean;
}

export function canonicalUrl(pathname) {
  return new URL(normalizePublicPath(pathname), CANONICAL_ORIGIN).href;
}
