// Apache activation is deliberately separate from the existence of an Astro
// route: source files remain in place for review and rollback.
export const redirects = Object.freeze([
  { source: '/product/punchout/', destination: '/platform/punchout/', status: 'active' },
  { source: '/product/invoice-automation/', destination: '/platform/invoices/', status: 'active' },
  { source: '/product/multi-store-management/', destination: '/platform/multi-store/', status: 'active' },
  { source: '/product/purchase-order-automation/', destination: '/platform/purchase-orders/', status: 'active' },
  { source: '/product/reporting-monitoring/', destination: '/platform/transactions/', status: 'active' },
  { source: '/resources/what-is-punchout/', destination: '/resources/punchout-guide/', status: 'active' },
  { source: '/industries/promotional-print-uniforms/', destination: '/industries/promotional-products/', status: 'active' },
  { source: '/integrations/bigcommerce/', destination: null, status: 'pending', reason: 'The commerce connector is planned, and no equivalent destination is approved.' },
  { source: '/integrations/magento/', destination: null, status: 'pending', reason: 'The commerce connector is planned, and no equivalent destination is approved.' }
]);
