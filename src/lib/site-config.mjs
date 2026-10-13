// Confirm the production host and configure a host redirect before treating this
// proposed canonical origin as a deployment-level routing decision.
export const CANONICAL_ORIGIN = 'https://www.punchoutcentral.com';

export function normalizePublicPath(pathname) {
  if (pathname === '/') return '/';
  const clean = `/${String(pathname).split(/[?#]/, 1)[0].replace(/^\/+|\/+$/g, '')}/`;
  if (clean.includes('//') || clean.includes('..')) throw new Error(`Invalid public path: ${pathname}`);
  return clean;
}

export function canonicalUrl(pathname) {
  return new URL(normalizePublicPath(pathname), CANONICAL_ORIGIN).href;
}
