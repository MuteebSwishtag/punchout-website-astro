import { getRoute } from './site-registry.mjs';

// Intent-led links. A target appears only after its registry publication gate
// is approved, so future spokes can be added here before their pages exist.
const linksBySource = {
  '/integrations/': [
    ['/integrations/shopify/', 'Shopify PunchOut', 'Connect an existing Shopify store to procurement.'],
    ['/integrations/procurement-systems/', 'Procurement systems', 'Explore supported buyer systems.'],
    ['/integrations/coupa/', 'Coupa PunchOut', 'Understand the Coupa buying workflow.'],
    ['/integrations/sap-ariba/', 'SAP Ariba PunchOut', 'Understand the SAP Ariba buying workflow.'],
    ['/integrations/jaggaer/', 'JAGGAER PunchOut', 'Understand the JAGGAER buying workflow.'],
    ['/integrations/oracle/', 'Oracle PunchOut', 'Understand the Oracle buying workflow.'],
    ['/integrations/workday/', 'Workday PunchOut', 'Understand the Workday buying workflow.'],
    ['/integrations/ivalua/', 'Ivalua PunchOut', 'Review Ivalua buyer setup requirements.'],
    ['/integrations/gep/', 'GEP SMART PunchOut', 'Review GEP buyer setup requirements.'],
    ['/integrations/cxml/', 'cXML PunchOut', 'Explore the cXML protocol.'],
    ['/integrations/oci/', 'OCI PunchOut', 'Explore the OCI protocol.'],
    ['/how-it-works/', 'How PunchOut works', 'Follow the transaction from catalog to invoice.'],
    ['/book-demo/', 'Discuss an integration', 'Show us your buyer requirements.']
  ],
  '/resources/': [
    ['/resources/punchout-guide/', 'What is PunchOut?', 'Start with the supplier-friendly explanation.'],
    ['/resources/shopify-punchout-guide/', 'Shopify PunchOut guide', 'Map the existing store to a buyer connection.'],
    ['/resources/cxml-guide/', 'cXML guide', 'Understand the structured procurement protocol.'],
    ['/resources/oci-guide/', 'OCI guide', 'Understand the Open Catalog Interface.'],
    ['/resources/cxml-vs-oci/', 'cXML vs OCI', 'Compare the two supported protocol paths.'],
    ['/resources/punchout-implementation-guide/', 'Implementation guide', 'Plan the connection from scope to launch.'],
    ['/resources/punchout-testing-checklist/', 'Testing checklist', 'Validate the flow from catalog to PO.'],
    ['/resources/punchout-supplier-onboarding/', 'Supplier onboarding', 'Prepare roles, inputs and catalog access.'],
    ['/resources/punchout-vs-hosted-catalog/', 'PunchOut vs hosted catalog', 'Compare supplier-hosted and buyer-maintained catalogs.'],
    ['/resources/level-1-vs-level-2-punchout/', 'Level 1 vs Level 2', 'Clarify store-level and item-level entry points.'],
    ['/resources/punchout-purchase-order-process/', 'Purchase order process', 'Keep the returned cart separate from the approved PO.'],
    ['/resources/cxml-invoice-guide/', 'cXML invoice guide', 'Clarify buyer-specific invoice requirements.'],
    ['/resources/punchout-glossary/', 'PunchOut glossary', 'Look up procurement and commerce terms.']
  ],
  '/resources/punchout-guide/': [
    ['/platform/punchout/', 'PunchOut platform', 'See the product capabilities behind the workflow.'],
    ['/integrations/shopify/', 'Shopify PunchOut', 'Connect a Shopify catalog to procurement.'],
    ['/integrations/cxml/', 'cXML connections', 'Learn about cXML procurement workflows.'],
    ['/integrations/oci/', 'OCI connections', 'Learn about OCI procurement workflows.'],
    ['/resources/shopify-punchout-guide/', 'Shopify PunchOut guide', 'Apply the flow to the existing store.'],
    ['/resources/punchout-implementation-guide/', 'Implementation guide', 'Plan the buyer connection.'],
    ['/resources/punchout-testing-checklist/', 'Testing checklist', 'Validate the full transaction.'],
    ['/resources/punchout-purchase-order-process/', 'Purchase order process', 'Understand when the order is created.'],
    ['/integrations/', 'Integration overview', 'Explore procurement and commerce connections.'],
    ['/pricing/', 'Pricing', 'Compare Launch, Growth and Scale.']
  ],
  '/platform/': [
    ['/platform/punchout/', 'PunchOut catalogs', 'Open the right catalog for each enterprise buyer.'],
    ['/platform/purchase-orders/', 'Purchase orders', 'Follow approved POs into store orders.'],
    ['/platform/invoices/', 'Invoices', 'Keep invoices connected to transactions.'],
    ['/platform/multi-store/', 'Multi-store control', 'Manage stores and buyers centrally.'],
    ['/platform/transactions/', 'Transaction visibility', 'Trace the workflow and identify failures.']
  ],
  '/platform/purchase-orders/': [
    ['/how-it-works/', 'PunchOut workflow', 'See buyer approval before PO receipt.'],
    ['/platform/transactions/', 'Transaction tracking', 'Follow the PO into the Shopify order.'],
    ['/platform/invoices/', 'Invoice activity', 'Review the final transaction stage.'],
    ['/integrations/cxml/', 'cXML PunchOut', 'Review a common procurement connection protocol.']
  ],
  '/platform/invoices/': [
    ['/platform/purchase-orders/', 'Purchase orders', 'Review the PO that precedes the store order.'],
    ['/platform/transactions/', 'Transactions', 'See invoice activity in the full journey.'],
    ['/contact/', 'Confirm invoice requirements', 'Discuss buyer-specific formats and delivery.']
  ],
  '/platform/multi-store/': [
    ['/solutions/multi-store-commerce/', 'Multi-store commerce', 'See the business operating model.'],
    ['/solutions/one-store-multiple-buyers/', 'One store, multiple buyers', 'Compare the shared-store model.'],
    ['/platform/transactions/', 'Transactions', 'Follow activity across stores and buyers.'],
    ['/pricing/', 'Connection pricing', 'Count each new buyer or store.']
  ],
  '/platform/transactions/': [
    ['/how-it-works/', 'Six-stage workflow', 'Review every stage from session to invoice.'],
    ['/platform/purchase-orders/', 'Purchase orders', 'See the approval and store order boundary.'],
    ['/platform/multi-store/', 'Multi-store control', 'Manage several buyer relationships.'],
    ['/documentation/', 'Setup documentation', 'Prepare a buyer test and review its history.']
  ],
  '/solutions/': [
    ['/platform/', 'Platform overview', 'Explore the product capabilities behind each use case.'],
    ['/integrations/', 'Integrations', 'Review Shopify and procurement connections.'],
    ['/pricing/', 'Connection pricing', 'Compare plans for your buyer and store count.']
  ],
  '/solutions/b2b-suppliers/': [
    ['/platform/punchout/', 'PunchOut capability', 'Connect your existing store to enterprise buyers.'],
    ['/solutions/one-store-multiple-buyers/', 'One store, multiple buyers', 'Give each buyer a connection and catalog access from one Shopify store.'],
    ['/integrations/', 'Integrations', 'See the procurement and commerce connection paths.'],
    ['/pricing/', 'Pricing', 'Start with one buyer and add connections.']
  ],
  '/solutions/enterprise-customer-onboarding/': [
    ['/documentation/', 'Buyer setup guide', 'Prepare store, buyer and catalog inputs.'],
    ['/integrations/procurement-systems/', 'Procurement systems', 'Review buyer platform requirements.'],
    ['/platform/purchase-orders/', 'PO handoff', 'See when the approved order reaches Shopify.'],
    ['/solutions/one-store-multiple-buyers/', 'Shared storefront', 'Plan several buyer connections.']
  ],
  '/solutions/multi-store-commerce/': [
    ['/platform/multi-store/', 'Multi-store management', 'Explore the product capability.'],
    ['/solutions/one-store-multiple-buyers/', 'One store, multiple buyers', 'Compare the alternative store model.'],
    ['/platform/transactions/', 'Transaction tracking', 'Follow activity across the program.'],
    ['/pricing/', 'Connection pricing', 'Count buyers and additional stores.']
  ],
  '/solutions/ecommerce-agencies/': [
    ['/integrations/shopify/', 'Shopify PunchOut', 'Review the supplier storefront connection.'],
    ['/solutions/enterprise-customer-onboarding/', 'Buyer onboarding', 'Scope the client and buyer setup.'],
    ['/documentation/', 'Setup documentation', 'Prepare the connection test.'],
    ['/contact/', 'Discuss a client project', 'Contact the team about a buyer requirement.']
  ],
  '/enterprise/': [
    ['/solutions/', 'Supplier solutions', 'Compare buyer and store operating models.'],
    ['/platform/multi-store/', 'Multi-store management', 'Manage several Shopify stores centrally.'],
    ['/platform/transactions/', 'Transaction tracking', 'See stages and failure reasons.'],
    ['/pricing/', 'Connection pricing', 'Plan the buyer and store count.']
  ],
  '/industries/industrial-mro/': [
    ['/platform/punchout/', 'PunchOut catalogs', 'Connect the MRO catalog to procurement.'],
    ['/platform/purchase-orders/', 'Purchase orders', 'Follow the approved PO into Shopify.'],
    ['/industries/', 'All industries', 'Compare supplier-market use cases.'],
    ['/book-demo/', 'Discuss an MRO buyer', 'Bring the catalog and buyer requirement.']
  ],
  '/industries/lab-scientific/': [
    ['/platform/punchout/', 'PunchOut catalogs', 'Connect a scientific catalog to procurement.'],
    ['/platform/transactions/', 'Transaction tracking', 'Review the stages when a buyer needs help.'],
    ['/industries/', 'All industries', 'Compare supplier-market use cases.'],
    ['/book-demo/', 'Discuss a scientific buyer', 'Bring the institution and catalog scope.']
  ],
  '/industries/promotional-products/': [
    ['/solutions/enterprise-customer-onboarding/', 'Buyer onboarding', 'Turn a program request into a testable connection.'],
    ['/platform/purchase-orders/', 'Purchase orders', 'Keep cart return separate from the approved PO.'],
    ['/industries/', 'All industries', 'Compare supplier-market use cases.'],
    ['/book-demo/', 'Discuss a program buyer', 'Bring the assortment and procurement flow.']
  ],
  '/industries/it-hardware/': [
    ['/integrations/shopify/', 'Shopify PunchOut', 'Connect the existing technology catalog.'],
    ['/platform/purchase-orders/', 'Purchase orders', 'Review the PO-to-order boundary.'],
    ['/platform/transactions/', 'Transaction tracking', 'Trace access, approval and order stages.'],
    ['/book-demo/', 'Discuss an IT buyer', 'Bring the catalog and buyer setup.']
  ],
  '/industries/workplace-facilities/': [
    ['/platform/punchout/', 'PunchOut catalogs', 'Connect recurring facilities purchasing.'],
    ['/solutions/one-store-multiple-buyers/', 'One store, multiple buyers', 'Serve more than one operational buyer.'],
    ['/platform/transactions/', 'Transaction tracking', 'See where a replenishment order stopped.'],
    ['/book-demo/', 'Discuss a facilities buyer', 'Bring the recurring assortment.']
  ],
  '/industries/hospitality-supplies/': [
    ['/platform/multi-store/', 'Multi-store management', 'Map stores and operational buyers centrally.'],
    ['/platform/purchase-orders/', 'Purchase orders', 'Follow the approved hospitality order.'],
    ['/industries/', 'All industries', 'Compare supplier-market use cases.'],
    ['/book-demo/', 'Discuss an operations buyer', 'Bring the location and catalog scope.']
  ],
  '/solutions/one-store-multiple-buyers/': [
    ['/integrations/shopify/', 'Shopify storefront', 'Connect your existing Shopify catalog to procurement.'],
    ['/integrations/procurement-systems/', 'Buyer systems', 'Review each buyer’s procurement requirements.'],
    ['/platform/purchase-orders/', 'Purchase orders', 'Follow approved POs into Shopify orders.'],
    ['/platform/invoices/', 'Invoices', 'Keep invoice activity tied to the transaction.'],
    ['/pricing/', 'Connection pricing', 'Compare the Launch, Growth and Scale allowances.'],
    ['/book-demo/', 'Discuss your setup', 'Show us the buyers and store you need to connect.']
  ]
};

export function relatedPublishedLinks(source) {
  return (linksBySource[source] ?? [])
    .filter(([path]) => getRoute(path)?.publicationEligible)
    .map(([path, title, description]) => ({ path, title, description }));
}
