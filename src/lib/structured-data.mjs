import { faqItems } from '../content/faq.mjs';
import { phase4Pages } from '../content/phase4-pages.mjs';
import { resourcePages } from '../content/resources.mjs';
import { industryPages, insightPages } from '../content/phase6-pages.mjs';
import { canonicalUrl } from './site-config.mjs';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PunchOut Central',
    url: canonicalUrl('/')
  };
}

export function softwareApplicationSchema(description) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'PunchOut Central',
    applicationCategory: 'BusinessApplication',
    description,
    url: canonicalUrl('/platform/')
  };
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(({ name, path }, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: canonicalUrl(path)
    }))
  };
}

export function articleSchema(path, headline, description) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    mainEntityOfPage: canonicalUrl(path),
    author: organizationSchema(),
    publisher: organizationSchema()
  };
}

export function faqPageSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(([name, answer]) => ({
      '@type': 'Question',
      name,
      acceptedAnswer: { '@type': 'Answer', text: answer }
    }))
  };
}

export function defaultSchemaForPath(pathname, description) {
  const pageNames = {
    '/platform/': 'PunchOut platform',
    '/platform/purchase-orders/': 'Purchase orders',
    '/platform/invoices/': 'Invoice activity',
    '/platform/multi-store/': 'Multi-store management',
    '/platform/transactions/': 'Transaction tracking',
    '/solutions/': 'PunchOut solutions',
    '/solutions/b2b-suppliers/': 'B2B suppliers',
    '/solutions/enterprise-customer-onboarding/': 'Enterprise buyer onboarding',
    '/solutions/multi-store-commerce/': 'Multi-store commerce',
    '/solutions/ecommerce-agencies/': 'Ecommerce agencies',
    '/enterprise/': 'Enterprise supplier programs',
    '/industries/': 'Industries',
    '/insights/': 'PunchOut insights',
    '/faq/': 'PunchOut FAQ',
    '/documentation/': 'Documentation',
    '/contact/': 'Contact'
  };
  const name = pageNames[pathname];
  const parent = pathname.startsWith('/platform/') && pathname !== '/platform/'
    ? { name: 'Platform', path: '/platform/' }
    : pathname.startsWith('/solutions/') && pathname !== '/solutions/' || pathname === '/enterprise/'
      ? { name: 'Solutions', path: '/solutions/' }
      : pathname.startsWith('/industries/') && pathname !== '/industries/'
        ? { name: 'Industries', path: '/industries/' }
      : null;
  const breadcrumb = name ? breadcrumbSchema([
    { name: 'Home', path: '/' },
    ...(parent ? [parent] : []),
    { name, path: pathname }
  ]) : null;
  if (pathname === '/contact/') return [organizationSchema(), breadcrumb];
  if (pathname === '/platform/') return [softwareApplicationSchema(description), breadcrumb];
  if (pathname === '/resources/punchout-guide/') {
    return [articleSchema(pathname, 'What is PunchOut?', description), breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Resources', path: '/resources/' },
      { name: 'What is PunchOut?', path: pathname }
    ])];
  }
  if (pathname === '/faq/') return [faqPageSchema(faqItems), breadcrumb];
  const insightPage = insightPages[pathname];
  if (insightPage) {
    const schemas = [articleSchema(pathname, insightPage.title, description), breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Insights', path: '/insights/' },
      { name: insightPage.breadcrumb, path: pathname }
    ])];
    if (insightPage.questions?.length) schemas.push(faqPageSchema(insightPage.questions.map(({ question, answer }) => [question, answer])));
    return schemas;
  }
  const industryPage = industryPages[pathname];
  if (industryPage) {
    const schemas = [breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Industries', path: '/industries/' },
      { name: industryPage.eyebrow, path: pathname }
    ])];
    if (industryPage.questions?.length) schemas.push(faqPageSchema(industryPage.questions.map(({ question, answer }) => [question, answer])));
    return schemas;
  }
  const resourcePage = resourcePages[pathname];
  if (resourcePage) {
    return [articleSchema(pathname, resourcePage.title, description), breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Resources', path: '/resources/' },
      { name: resourcePage.breadcrumb, path: pathname }
    ])];
  }
  const detailPage = phase4Pages[pathname];
  if (detailPage?.questions?.length) {
    return [breadcrumb, faqPageSchema(detailPage.questions.map(({ question, answer }) => [question, answer]))];
  }
  return breadcrumb ? [breadcrumb] : [];
}
