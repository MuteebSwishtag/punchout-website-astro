import { canonicalUrl, normalizePublicPath } from './site-config.mjs';

// Exact 72-URL core from the approved sitemap blueprint. Publication is an
// editorial decision; a route appearing here does not make it indexable.
// Row: URL, cluster, priority, primary intent, status.
// P = published; V = existing, needs verification/content; M = missing;
// G = unpublished until genuine proof is available; R = redirect alias.
const coreRows = [
  ['/', 'core', 'P0', 'Shopify PunchOut platform', 'P'],
  ['/platform/', 'platform', 'P1', 'PunchOut platform', 'P'],
  ['/platform/punchout/', 'platform', 'P0', 'PunchOut catalog software', 'P'],
  ['/platform/purchase-orders/', 'platform', 'P1', 'PunchOut PO automation', 'P'],
  ['/platform/invoices/', 'platform', 'P1', 'cXML invoice automation', 'P'],
  ['/platform/multi-store/', 'platform', 'P1', 'Multi-store PunchOut management', 'P'],
  ['/platform/transactions/', 'platform', 'P1', 'PunchOut transaction tracking', 'P'],
  ['/how-it-works/', 'core', 'P0', 'How PunchOut Central works', 'P'],
  ['/integrations/', 'integrations', 'P0', 'PunchOut integrations', 'P'],
  ['/integrations/shopify/', 'integrations', 'P0', 'Shopify PunchOut integration', 'P'],
  ['/integrations/procurement-systems/', 'integrations', 'P0', 'PunchOut procurement systems', 'P'],
  ['/integrations/coupa/', 'integrations', 'P0', 'Shopify Coupa PunchOut', 'P'],
  ['/integrations/sap-ariba/', 'integrations', 'P0', 'Shopify SAP Ariba PunchOut', 'P'],
  ['/integrations/jaggaer/', 'integrations', 'P0', 'Shopify JAGGAER PunchOut', 'P'],
  ['/integrations/oracle/', 'integrations', 'P0', 'Shopify Oracle Procurement PunchOut', 'P'],
  ['/integrations/workday/', 'integrations', 'P0', 'Shopify Workday PunchOut', 'P'],
  ['/integrations/ivalua/', 'integrations', 'P0', 'Shopify Ivalua PunchOut', 'V'],
  ['/integrations/gep/', 'integrations', 'P0', 'Shopify GEP SMART PunchOut', 'V'],
  ['/integrations/cxml/', 'integrations', 'P0', 'Shopify cXML PunchOut', 'P'],
  ['/integrations/oci/', 'integrations', 'P0', 'Shopify OCI PunchOut', 'P'],
  ['/solutions/', 'solutions', 'P1', 'PunchOut solutions', 'P'],
  ['/solutions/b2b-suppliers/', 'solutions', 'P1', 'PunchOut for Shopify B2B suppliers', 'P'],
  ['/solutions/enterprise-customer-onboarding/', 'solutions', 'P1', 'Enterprise buyer onboarding', 'P'],
  ['/solutions/one-store-multiple-buyers/', 'solutions', 'P0', 'One Shopify store multiple buyers', 'P'],
  ['/solutions/multi-store-commerce/', 'solutions', 'P1', 'Multi-store PunchOut commerce', 'P'],
  ['/solutions/ecommerce-agencies/', 'solutions', 'P2', 'PunchOut for Shopify agencies', 'P'],
  ['/enterprise/', 'solutions', 'P2', 'Enterprise PunchOut platform', 'P'],
  ['/industries/', 'industries', 'P2', 'PunchOut by industry', 'P'],
  ['/industries/industrial-mro/', 'industries', 'P2', 'PunchOut for MRO suppliers', 'P'],
  ['/industries/lab-scientific/', 'industries', 'P2', 'PunchOut for lab/scientific suppliers', 'P'],
  ['/industries/promotional-products/', 'industries', 'P2', 'PunchOut for promotional product suppliers', 'P'],
  ['/industries/it-hardware/', 'industries', 'P3', 'PunchOut for IT hardware suppliers', 'P'],
  ['/industries/workplace-facilities/', 'industries', 'P3', 'PunchOut for workplace/facilities suppliers', 'P'],
  ['/industries/hospitality-supplies/', 'industries', 'P3', 'PunchOut for hospitality suppliers', 'P'],
  ['/resources/', 'resources', 'P1', 'PunchOut resources', 'P'],
  ['/resources/punchout-guide/', 'resources', 'P1', 'What is a PunchOut catalog?', 'P'],
  ['/resources/shopify-punchout-guide/', 'resources', 'P1', 'Shopify PunchOut guide', 'P'],
  ['/resources/cxml-guide/', 'resources', 'P2', 'What is cXML?', 'P'],
  ['/resources/oci-guide/', 'resources', 'P2', 'What is OCI?', 'P'],
  ['/resources/cxml-vs-oci/', 'resources', 'P2', 'cXML vs OCI', 'P'],
  ['/resources/punchout-implementation-guide/', 'resources', 'P2', 'PunchOut implementation', 'P'],
  ['/resources/punchout-testing-checklist/', 'resources', 'P2', 'PunchOut testing checklist', 'P'],
  ['/resources/punchout-supplier-onboarding/', 'resources', 'P2', 'PunchOut supplier onboarding', 'P'],
  ['/resources/punchout-vs-hosted-catalog/', 'resources', 'P2', 'PunchOut vs hosted catalog', 'P'],
  ['/resources/level-1-vs-level-2-punchout/', 'resources', 'P3', 'Level 1 vs Level 2 PunchOut', 'P'],
  ['/resources/punchout-purchase-order-process/', 'resources', 'P2', 'PunchOut purchase order process', 'P'],
  ['/resources/cxml-invoice-guide/', 'resources', 'P2', 'cXML invoice', 'P'],
  ['/resources/punchout-glossary/', 'resources', 'P3', 'PunchOut glossary', 'P'],
  ['/insights/', 'insights', 'P1', 'PunchOut insights', 'P'],
  ['/insights/what-is-shopify-punchout/', 'insights', 'P1', 'What is Shopify PunchOut?', 'P'],
  ['/insights/does-shopify-support-punchout/', 'insights', 'P1', 'Does Shopify support PunchOut?', 'P'],
  ['/insights/customer-asked-for-punchout/', 'insights', 'P1', 'Customer requires PunchOut', 'P'],
  ['/insights/how-coupa-punchout-works/', 'insights', 'P2', 'How Coupa PunchOut works', 'P'],
  ['/insights/how-sap-ariba-punchout-works/', 'insights', 'P2', 'How SAP Ariba PunchOut works', 'P'],
  ['/insights/how-jaggaer-punchout-works/', 'insights', 'P2', 'How JAGGAER PunchOut works', 'P'],
  ['/insights/how-oracle-punchout-works/', 'insights', 'P3', 'How Oracle PunchOut works', 'P'],
  ['/insights/how-workday-punchout-works/', 'insights', 'P3', 'How Workday PunchOut works', 'P'],
  ['/insights/punchout-integration-cost/', 'insights', 'P2', 'PunchOut integration cost', 'P'],
  // Phase 7 evidence gate: no approved customer names, testimonials, logos,
  // outcomes or case-study source material are present in this repository.
  ['/customers/', 'proof', 'P2', 'PunchOut Central customers', 'G'],
  ['/case-studies/', 'proof', 'P2', 'PunchOut case studies', 'G'],
  ['/case-studies/one-store-multiple-buyers/', 'proof', 'P2', 'One store multiple buyers case study', 'G'],
  ['/case-studies/shopify-coupa/', 'proof', 'P2', 'Shopify Coupa case study', 'G'],
  ['/case-studies/shopify-sap-ariba/', 'proof', 'P2', 'Shopify SAP Ariba case study', 'G'],
  ['/company/', 'proof', 'P1', 'About PunchOut Central', 'V'],
  ['/security/', 'proof', 'P1', 'PunchOut security and trust', 'G'],
  ['/pricing/', 'conversion', 'P0', 'PunchOut pricing', 'P'],
  ['/faq/', 'conversion', 'P1', 'PunchOut FAQ', 'P'],
  ['/documentation/', 'conversion', 'P1', 'PunchOut Central documentation', 'P'],
  ['/contact/', 'conversion', 'P1', 'Contact PunchOut Central', 'P'],
  ['/book-demo/', 'conversion', 'P0', 'Book PunchOut demo', 'P'],
  ['/privacy/', 'legal', 'P3', 'Privacy policy', 'R'],
  ['/terms/', 'legal', 'P3', 'Terms of service', 'V']
];

const statusNames = {
  P: 'published',
  V: 'needs_verification',
  M: 'missing',
  G: 'proof_gated',
  R: 'redirect_alias'
};

export const corePages = Object.freeze(coreRows.map(([url, cluster, priority, intent, code]) => Object.freeze({
  url: normalizePublicPath(url),
  cluster,
  priority,
  primaryIntent: intent,
  implementationStatus: statusNames[code],
  publicationEligible: code === 'P',
  canonicalUrl: canonicalUrl(url),
  sitemapEligible: code === 'P'
})));

if (corePages.length !== 72 || new Set(corePages.map((page) => page.url)).size !== 72) {
  throw new Error('The approved core sitemap must contain exactly 72 unique URLs.');
}

// Existing routes outside the 72-URL core. None may enter the sitemap.
const extraRows = [
  ['/404.html', 'protected_functional_route'],
  ['/admin/', 'protected_functional_route'],
  ['/api/book-demo.php', 'protected_functional_route'],
  ['/api/admin-submissions.php', 'protected_functional_route'],
  ['/login/', 'protected_functional_route'],
  ['/thank-you/', 'protected_functional_route'],
  ['/product/punchout/', 'deprecated_redirect_candidate'],
  ['/product/invoice-automation/', 'deprecated_redirect_candidate'],
  ['/product/multi-store-management/', 'deprecated_redirect_candidate'],
  ['/product/purchase-order-automation/', 'deprecated_redirect_candidate'],
  ['/product/reporting-monitoring/', 'deprecated_redirect_candidate'],
  ['/resources/what-is-punchout/', 'deprecated_redirect_candidate'],
  ['/industries/promotional-print-uniforms/', 'deprecated_redirect_candidate'],
  ['/about/', 'redirect_alias'],
  ['/integrations/bigcommerce/', 'needs_verification'],
  ['/integrations/magento/', 'needs_verification']
];

export const extraRoutes = Object.freeze(extraRows.map(([url, implementationStatus]) => Object.freeze({
  url,
  implementationStatus,
  publicationEligible: false,
  canonicalUrl: null,
  sitemapEligible: false
})));

const routesByUrl = new Map([...corePages, ...extraRoutes].map((route) => [route.url, route]));

export function getRoute(pathname) {
  return routesByUrl.get(pathname) ?? routesByUrl.get(normalizePublicPath(pathname)) ?? null;
}

export function pageRobots(pathname) {
  const route = getRoute(pathname);
  if (route?.implementationStatus === 'published') return '';
  if (pathname === '/admin/' || pathname === '/404.html') return 'noindex,nofollow,noarchive';
  return 'noindex,follow';
}
