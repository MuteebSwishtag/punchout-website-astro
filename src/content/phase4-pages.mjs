// Product claims here follow the supplied product playbook. Buyer-facing cXML
// invoice exchange is deliberately not promised without verification.
export const phase4Pages = {
  '/platform/purchase-orders/': {
    path: '/platform/purchase-orders/', eyebrow: 'Purchase order automation',
    title: 'Turn an approved procurement PO into a Shopify order.',
    lead: 'A returned PunchOut cart is still a buyer request. PunchOut Central follows the buyer approval and received purchase order before creating the corresponding order in your Shopify store.',
    visualLabel: 'Cart to order',
    visualSteps: [
      { title: 'Cart returned', text: 'Buyer reviews in procurement' },
      { title: 'Buyer approved', text: 'Approval happens on the buyer side' },
      { title: 'PO received', text: 'Approved order reaches PunchOut Central' },
      { title: 'Store order created', text: 'Shopify receives the order' }
    ],
    detailEyebrow: 'The order boundary', detailTitle: 'Keep approval where the buyer expects it.',
    detailLead: 'The procurement system controls approval. The supplier store receives the order after that decision, with the earlier PunchOut activity still visible.',
    details: [
      { title: 'Returned cart', text: 'The buyer selects products in the Shopify catalog and sends the cart back to procurement for review.' },
      { title: 'Approved purchase order', text: 'The buyer completes its own approval process and sends an approved PO to the supplier connection.' },
      { title: 'Shopify order', text: 'PunchOut Central creates the related store order after the approved PO arrives.' },
      { title: 'Connected record', text: 'Trace the session, cart, PO, store order and later invoice in the transaction journey.' }
    ],
    workflowTitle: 'Test the handoff before the buyer goes live.',
    workflowLead: 'A PunchOut test should cover more than catalog launch: the returned cart, buyer approval, PO receipt and store order matter too.',
    workflow: [
      { title: 'Launch the catalog', text: 'Start a test session from the buyer procurement environment.' },
      { title: 'Return the cart', text: 'Confirm that the selected items reach the buyer review and approval flow.' },
      { title: 'Receive the PO', text: 'Confirm the approved PO is received for the same buyer transaction.' },
      { title: 'Review the order', text: 'Check the resulting Shopify order and its linked transaction history.' }
    ],
    operatingTitle: 'Know which event actually created the order.',
    operatingLead: 'A supplier can distinguish an active shopping session from an approved procurement order.',
    operating: [
      { title: 'Cart returned', text: 'The buyer can review the request, but the Shopify order has not yet been created.' },
      { title: 'PO received', text: 'The approved procurement document is the handoff into store order creation.' },
      { title: 'Order created', text: 'The Shopify order is linked back to the earlier transaction stages.' }
    ],
    questions: [
      { question: 'Does returning the PunchOut cart create a Shopify order?', answer: 'No. The cart returns to procurement for approval. The Shopify order is created after the approved PO is received.' },
      { question: 'Can we see the PO with the earlier session?', answer: 'Yes. The connected transaction view follows the session and cart through PO, store order and invoice.' },
      { question: 'What should we test with a buyer?', answer: 'Test session launch, catalog access, cart return, the buyer approval path, PO receipt and the resulting Shopify order.' }
    ],
    relatedHeading: 'Follow the PO through the platform',
    ctaTitle: 'Walk through a buyer purchase order requirement.',
    ctaText: 'Bring the procurement system, Shopify store and expected approval path to a demo.'
  },
  '/platform/invoices/': {
    path: '/platform/invoices/', eyebrow: 'Invoice activity',
    title: 'Keep the invoice stage tied to the buyer transaction.',
    lead: 'PunchOut Central tracks the journey through the generated invoice, so the team can view it alongside the buyer, approved PO and Shopify order. Confirm a buyer’s required invoice format during onboarding.',
    visualLabel: 'Order to invoice',
    visualSteps: [
      { title: 'Approved PO', text: 'Buyer order received' },
      { title: 'Shopify order', text: 'Store order created' },
      { title: 'Invoice generated', text: 'Invoice stage recorded' },
      { title: 'Transaction view', text: 'Stages remain connected' }
    ],
    detailEyebrow: 'Invoice context', detailTitle: 'See the invoice in the order’s full history.',
    detailLead: 'Invoice generation appears in the tracked transaction journey. Check buyer-specific invoice exchange requirements before agreeing to a format or delivery method.',
    details: [
      { title: 'Buyer context', text: 'Identify which buyer connection the transaction belongs to.' },
      { title: 'PO relationship', text: 'Follow the approved purchase order that preceded the Shopify order.' },
      { title: 'Invoice stage', text: 'See invoice generation as the final stage of the six-step transaction journey.' },
      { title: 'Support context', text: 'Use transaction activity and timestamps when discussing an invoice issue.' }
    ],
    workflowTitle: 'Start with the buyer’s invoice requirement.',
    workflowLead: 'PunchOut and PO behavior can be tested from the standard flow; invoice format and delivery expectations should be confirmed with the buyer.',
    workflow: [
      { title: 'Collect requirements', text: 'Ask the buyer which invoice format, routing and references its process requires.' },
      { title: 'Test the PO', text: 'Follow a test cart through approval, PO receipt and Shopify order creation.' },
      { title: 'Review invoice activity', text: 'Confirm the generated invoice stage is associated with the correct transaction.' },
      { title: 'Validate delivery', text: 'Agree on buyer-specific invoice exchange details before go-live.' }
    ],
    operatingTitle: 'Keep the order and invoice in context.',
    operatingLead: 'One transaction view helps locate the step that needs attention.',
    operating: [
      { title: 'Buyer', text: 'The buyer connection identifies the procurement relationship.' },
      { title: 'Order', text: 'The approved PO and Shopify order remain part of the same journey.' },
      { title: 'Invoice', text: 'The generated invoice stage can be reviewed with the earlier activity.' }
    ],
    questions: [
      { question: 'Does the product generate an invoice stage?', answer: 'Yes. Invoice Generated is stage six of the tracked transaction lifecycle.' },
      { question: 'Is cXML invoice exchange confirmed for every buyer?', answer: 'Invoice format and delivery requirements need to be confirmed for each buyer before launch.' },
      { question: 'Does this replace our accounting system?', answer: 'PunchOut Central is described as procurement-to-commerce connectivity. Ask the team how your accounting process fits the buyer’s invoice requirement.' }
    ],
    relatedHeading: 'Review the surrounding transaction',
    ctaTitle: 'Confirm the buyer’s invoice requirements.',
    ctaText: 'Share the procurement environment, PO flow and invoice specification for a focused discussion.'
  },
  '/platform/multi-store/': {
    path: '/platform/multi-store/', eyebrow: 'Multi-store management',
    title: 'Manage Shopify stores and enterprise buyers centrally.',
    lead: 'Use one PunchOut Central platform for multiple Shopify or Shopify Plus stores and their buyer connections. Assign each buyer the right store and collections or catalog access.',
    visualLabel: 'Store and buyer map',
    visualSteps: [
      { title: 'Store A', text: 'Shopify catalog' },
      { title: 'Buyer connections', text: 'Catalog access per buyer' },
      { title: 'Store B', text: 'Additional storefront' },
      { title: 'Central view', text: 'Activity across relationships' }
    ],
    detailEyebrow: 'Central control', detailTitle: 'Keep each buyer mapped to the right storefront.',
    detailLead: 'Some suppliers serve several buyers from one store; others operate several stores. Both models can be managed from one platform.',
    details: [
      { title: 'Multiple storefronts', text: 'Connect more than one Shopify or Shopify Plus store under the central operating view.' },
      { title: 'Buyer mapping', text: 'Choose the store used for each enterprise buyer connection.' },
      { title: 'Catalog access', text: 'Assign the relevant collections or catalog access for that buyer.' },
      { title: 'Transaction visibility', text: 'Review activity across stores and buyers without losing the connection context.' }
    ],
    workflowTitle: 'Add a new store or buyer through a defined setup.',
    workflowLead: 'A new buyer or an additional store counts as a connection under the published pricing model.',
    workflow: [
      { title: 'Connect the store', text: 'Start with the Shopify storefront that holds the supplier catalog.' },
      { title: 'Add the buyer', text: 'Identify the procurement system and its cXML or OCI requirements.' },
      { title: 'Set access', text: 'Assign the store and relevant collections or catalog access.' },
      { title: 'Test and launch', text: 'Run a PunchOut test before making the connection live.' }
    ],
    operatingTitle: 'One view, several selling relationships.',
    operatingLead: 'The store and buyer relationship stays visible as orders progress.',
    operating: [
      { title: 'Stores', text: 'Manage several Shopify storefronts from the same platform.' },
      { title: 'Buyers', text: 'Give each buyer a distinct procurement connection and catalog access.' },
      { title: 'Transactions', text: 'See sessions, carts, POs, orders, invoices and failures by relationship.' }
    ],
    questions: [
      { question: 'Can one store serve more than one buyer?', answer: 'Yes. One Shopify store can have multiple buyer connections with buyer-specific catalog access.' },
      { question: 'Can we use several Shopify stores?', answer: 'Yes. Multiple stores and buyers can be managed centrally.' },
      { question: 'How are extra stores priced?', answer: 'A new buyer or additional store counts as a connection. Additional connections beyond the plan allowance are $200/month each.' }
    ],
    relatedHeading: 'Compare the store operating models',
    ctaTitle: 'Map your stores and buyers together.',
    ctaText: 'Show us the Shopify stores, procurement systems and catalog access each buyer needs.'
  },
  '/platform/transactions/': {
    path: '/platform/transactions/', eyebrow: 'Transaction tracking',
    title: 'Trace PunchOut activity from session to invoice.',
    lead: 'See where a buyer transaction stands and where it stopped. PunchOut Central tracks sessions, carts, approvals, POs, store orders, invoices and the activity around them.',
    visualLabel: 'Transaction stages',
    visualSteps: [
      { title: 'PunchOut started', text: 'Buyer session begins' },
      { title: 'Cart returned', text: 'Buyer reviews the request' },
      { title: 'PO received', text: 'Approval completed' },
      { title: 'Invoice generated', text: 'Journey reaches stage six' }
    ],
    detailEyebrow: 'Operational visibility', detailTitle: 'Find the stage and reason for an issue.',
    detailLead: 'Review line items, timestamps and activity, plus the stage where a transaction failed and the reason shown.',
    details: [
      { title: 'Stage history', text: 'Follow the six stages from PunchOut Started through Invoice Generated.' },
      { title: 'Order context', text: 'See the buyer, session, cart, PO and Shopify order in the same transaction journey.' },
      { title: 'Activity detail', text: 'Review line items, timestamps and recorded activity when investigating an order.' },
      { title: 'Failure location', text: 'Identify where a transaction stopped and the reason shown by the platform.' }
    ],
    workflowTitle: 'Investigate a missing or delayed order.',
    workflowLead: 'Use the transaction record to narrow the question before asking the buyer to retrace a purchase.',
    workflow: [
      { title: 'Find the buyer', text: 'Start from the relevant buyer and store connection.' },
      { title: 'Follow the stages', text: 'Check whether the cart returned, approval completed and the PO arrived.' },
      { title: 'Read the activity', text: 'Review timestamps, line items and the failure reason displayed.' },
      { title: 'Contact support', text: 'Share the transaction context through the product’s ticket, help or chat options.' }
    ],
    operatingTitle: 'See the entire journey, including the gaps.',
    operatingLead: 'Reporting can be filtered to review PunchOut activity, funnel performance and business trends.',
    operating: [
      { title: 'Progress', text: 'Know the latest completed stage for a buyer transaction.' },
      { title: 'Diagnosis', text: 'Find where a transaction failed and why.' },
      { title: 'Reporting', text: 'Use filters and visual reporting to review activity over time.' }
    ],
    questions: [
      { question: 'Which stages are tracked?', answer: 'PunchOut Started, Cart Returned, Buyer Approved, PO Received, Store Order Created and Invoice Generated.' },
      { question: 'Can we see why a transaction stopped?', answer: 'Yes. Transaction tracking shows where it failed and why, with timestamps and activity.' },
      { question: 'Does a returned cart mean an order exists?', answer: 'No. The buyer still approves the cart in procurement. A Shopify order follows the approved PO.' }
    ],
    relatedHeading: 'Explore the stages behind the record',
    ctaTitle: 'See how your buyer flow would be tracked.',
    ctaText: 'Bring a procurement requirement and we can walk through the transaction stages.'
  },
  '/solutions/b2b-suppliers/': {
    path: '/solutions/b2b-suppliers/', tone: 'peach', eyebrow: 'For Shopify B2B suppliers',
    title: 'Support a buyer’s PunchOut requirement from your existing store.',
    lead: 'When an enterprise customer buys through procurement, keep the Shopify or Shopify Plus catalog you already operate. PunchOut Central connects that store to the buyer’s purchasing workflow.',
    visualLabel: 'Supplier opportunity',
    visualSteps: [
      { title: 'Buyer asks', text: 'PunchOut required' },
      { title: 'Store stays', text: 'Existing Shopify catalog' },
      { title: 'Connection added', text: 'cXML or OCI workflow' },
      { title: 'Orders flow', text: 'Approved PO to store order' }
    ],
    detailEyebrow: 'Supplier fit', detailTitle: 'Keep selling in Shopify while buyers shop in procurement.',
    detailLead: 'PunchOut Central adds the procurement connection around your existing commerce operation.',
    details: [
      { title: 'Existing storefront', text: 'Use Shopify or Shopify Plus as the supplier catalog instead of creating a separate PunchOut storefront.' },
      { title: 'Buyer-specific access', text: 'Give each buyer the relevant store and collections or catalog access.' },
      { title: 'Procurement cart', text: 'Return the buyer’s cart to its procurement system for approval.' },
      { title: 'Approved order', text: 'Create the corresponding Shopify order after the approved PO arrives.' }
    ],
    workflowTitle: 'Answer the buyer request with a testable path.',
    workflowLead: 'Start with the buyer’s procurement environment, then validate the actual transaction journey.',
    workflow: [
      { title: 'Identify the buyer system', text: 'Ask which procurement platform and cXML or OCI process the buyer uses.' },
      { title: 'Map the catalog', text: 'Choose the Shopify store and collections or catalog access the buyer needs.' },
      { title: 'Run a PunchOut test', text: 'Check launch, shopping, cart return and the approved PO path.' },
      { title: 'Track transactions', text: 'Follow sessions, orders and invoices as the buyer program develops.' }
    ],
    operatingTitle: 'Start with one buyer and expand deliberately.',
    operatingLead: 'The connection model can support more buyers without replacing the supplier store.',
    operating: [
      { title: 'One store', text: 'Serve multiple enterprise buyers from one Shopify catalog.' },
      { title: 'More buyers', text: 'Each new buyer counts as another connection.' },
      { title: 'Clear pricing', text: 'Launch includes one connection for $500/month, with no setup or transaction fees.' }
    ],
    questions: [
      { question: 'Do we need a second catalog for PunchOut?', answer: 'No. The current product uses the existing Shopify or Shopify Plus store.' },
      { question: 'Can different buyers use the same store?', answer: 'Yes. Each buyer can have its own connection and assigned catalog access.' },
      { question: 'Is onboarding help included?', answer: 'Yes. Onboarding assistance is free.' }
    ],
    relatedHeading: 'Plan a supplier connection',
    ctaTitle: 'Bring us the buyer’s PunchOut request.',
    ctaText: 'We can review the procurement system, Shopify store and connection count with you.'
  },
  '/solutions/enterprise-customer-onboarding/': {
    path: '/solutions/enterprise-customer-onboarding/', tone: 'peach', eyebrow: 'Enterprise buyer onboarding',
    title: 'Turn a buyer request into a configured connection.',
    lead: 'Connect the Shopify store, assign the buyer’s catalog access, run a PunchOut test and launch after the flow is validated. Repeat that process for the next supported buyer.',
    visualLabel: 'Buyer setup',
    visualSteps: [
      { title: 'Connect store', text: 'Use the supplier catalog' },
      { title: 'Add buyer', text: 'Identify procurement needs' },
      { title: 'Set access', text: 'Store and collections' },
      { title: 'Test and launch', text: 'Validate the full flow' }
    ],
    detailEyebrow: 'Setup inputs', detailTitle: 'Know what to ask the buyer before testing.',
    detailLead: 'The procurement environment and catalog scope are the key starting points. Exact credentials and document requirements depend on the buyer.',
    details: [
      { title: 'Procurement environment', text: 'Identify the buyer system and whether its PunchOut workflow uses cXML or OCI.' },
      { title: 'Store selection', text: 'Choose the Shopify or Shopify Plus storefront that will serve this buyer.' },
      { title: 'Catalog access', text: 'Assign the relevant collections or catalog access for the buyer connection.' },
      { title: 'Order expectations', text: 'Confirm how the buyer will return carts, approve purchases and send approved POs.' }
    ],
    workflowTitle: 'Test the connection before go-live.',
    workflowLead: 'A launch test should check both the buyer experience and the later order handoff.',
    workflow: [
      { title: 'Launch a session', text: 'Confirm the buyer can open the correct supplier store from procurement.' },
      { title: 'Check the catalog', text: 'Confirm the buyer sees the assigned collection or catalog access.' },
      { title: 'Return a cart', text: 'Validate the cart is sent back for buyer approval.' },
      { title: 'Follow the PO', text: 'Check the approved PO and resulting Shopify order in transaction history.' }
    ],
    operatingTitle: 'Use the same sequence for the next buyer.',
    operatingLead: 'A supported connection still needs its own buyer settings and test.',
    operating: [
      { title: 'Buyer-specific', text: 'Each buyer gets the store and catalog access relevant to its program.' },
      { title: 'Tested flow', text: 'Run a PunchOut test before the buyer goes live.' },
      { title: 'Free assistance', text: 'Onboarding assistance is included without a setup fee.' }
    ],
    questions: [
      { question: 'What information should we bring?', answer: 'Bring the buyer procurement platform, expected cXML or OCI process, Shopify store and catalog scope.' },
      { question: 'Can we onboard several buyers to one store?', answer: 'Yes. One Shopify store can serve multiple enterprise buyers with separate connections and catalog access.' },
      { question: 'When should we go live?', answer: 'After the buyer-specific PunchOut and order flow has been tested and validated.' }
    ],
    relatedHeading: 'Prepare the buyer connection',
    ctaTitle: 'Review the buyer’s onboarding requirements.',
    ctaText: 'Share the procurement environment and Shopify catalog so the first test can be planned.'
  },
  '/solutions/multi-store-commerce/': {
    path: '/solutions/multi-store-commerce/', tone: 'peach', eyebrow: 'Multi-store commerce',
    title: 'Grow buyer programs across several Shopify stores.',
    lead: 'When different business lines use separate Shopify or Shopify Plus storefronts, keep the buyer connections and transaction view in one PunchOut Central platform.',
    visualLabel: 'Commerce operating model',
    visualSteps: [
      { title: 'Store A', text: 'Its own supplier catalog' },
      { title: 'Store B', text: 'Another buyer program' },
      { title: 'Buyer mapping', text: 'Access per connection' },
      { title: 'Central activity', text: 'One platform view' }
    ],
    detailEyebrow: 'Operating model', detailTitle: 'Keep storefront choices clear as buyers multiply.',
    detailLead: 'The buyer should land in the intended store and see the right catalog. The supplier needs a way to follow all those relationships centrally.',
    details: [
      { title: 'Store per program', text: 'Use separate Shopify storefronts where product lines or selling teams already operate that way.' },
      { title: 'Buyer-to-store mapping', text: 'Assign the correct store and collections or catalog access to each buyer.' },
      { title: 'Shared platform view', text: 'Manage stores, buyer connections and transactions in one place.' },
      { title: 'Connection planning', text: 'Count each new buyer or additional store when comparing plans.' }
    ],
    workflowTitle: 'Add another store without losing buyer context.',
    workflowLead: 'Treat each store and buyer relationship as a connection to configure and test.',
    workflow: [
      { title: 'Inventory storefronts', text: 'List the Shopify stores and the buyer programs each serves.' },
      { title: 'Choose access', text: 'Map each buyer to its store and relevant catalog collections.' },
      { title: 'Validate PunchOut', text: 'Test launch and cart return for each buyer environment.' },
      { title: 'Monitor activity', text: 'Follow POs, store orders, invoices and failures from the central transaction view.' }
    ],
    operatingTitle: 'Central management with distinct storefronts.',
    operatingLead: 'The business keeps its existing stores while sharing one procurement connection layer.',
    operating: [
      { title: 'Shopify stores', text: 'Several supplier storefronts can be managed centrally.' },
      { title: 'Buyer access', text: 'Buyer-specific store and catalog settings stay separate.' },
      { title: 'Pricing', text: 'Each additional store or new buyer counts as a connection.' }
    ],
    questions: [
      { question: 'Do all buyers have to shop in one store?', answer: 'No. Buyers can be assigned to the relevant store and catalog access.' },
      { question: 'Can one store still serve several buyers?', answer: 'Yes. Multi-store support and the one-store, multiple-buyers model can both be used.' },
      { question: 'What is the price for another connection?', answer: 'Additional connections beyond a plan allowance cost $200/month each.' }
    ],
    relatedHeading: 'Compare multi-store capabilities',
    ctaTitle: 'Map a multi-store buyer program.',
    ctaText: 'Tell us which storefronts and procurement buyers need to be connected.'
  },
  '/solutions/ecommerce-agencies/': {
    path: '/solutions/ecommerce-agencies/', tone: 'peach', eyebrow: 'For Shopify agencies',
    title: 'Plan PunchOut around the Shopify store you build.',
    lead: 'If a B2B client’s buyer requires PunchOut, the client can keep its Shopify or Shopify Plus storefront while PunchOut Central handles the procurement-to-commerce connection.',
    visualLabel: 'Agency project path',
    visualSteps: [
      { title: 'Client store', text: 'Shopify commerce work' },
      { title: 'Buyer requirement', text: 'Procurement system and protocol' },
      { title: 'PunchOut setup', text: 'Store and catalog access' },
      { title: 'End-to-end test', text: 'Cart, PO and order' }
    ],
    detailEyebrow: 'Project fit', detailTitle: 'Separate storefront work from buyer connectivity.',
    detailLead: 'An agency can clarify the commerce scope while the supplier and buyer establish their procurement requirements.',
    details: [
      { title: 'Keep the storefront', text: 'PunchOut uses the client’s existing Shopify catalog rather than a second procurement-only site.' },
      { title: 'Collect buyer details', text: 'Ask which system launches the session and whether cXML or OCI is required.' },
      { title: 'Set catalog scope', text: 'Identify the store and collections or catalog access for each buyer.' },
      { title: 'Test the transaction', text: 'Validate launch, cart return, buyer approval, approved PO and Shopify order.' }
    ],
    workflowTitle: 'Give the client a concrete implementation conversation.',
    workflowLead: 'The same questions help the supplier, agency and buyer agree on a testable path.',
    workflow: [
      { title: 'Define store scope', text: 'Document the Shopify store, products and collections involved.' },
      { title: 'Identify procurement', text: 'Capture the buyer platform and PunchOut protocol requirements.' },
      { title: 'Review the flow', text: 'Walk through the six stages from session to invoice.' },
      { title: 'Plan the test', text: 'Agree on the buyer-specific launch, cart and PO checks before go-live.' }
    ],
    operatingTitle: 'Keep the project scope tied to the real buyer flow.',
    operatingLead: 'Review the storefront, procurement requirements and test plan together before setting delivery expectations.',
    operating: [
      { title: 'Commerce', text: 'The supplier keeps its existing Shopify or Shopify Plus operation.' },
      { title: 'Connectivity', text: 'PunchOut Central supports cXML and OCI buyer workflows.' },
      { title: 'Onboarding', text: 'Free assistance is included for connecting and testing a buyer.' }
    ],
    questions: [
      { question: 'Must the agency build a separate PunchOut catalog?', answer: 'No. The current product uses the supplier’s existing Shopify or Shopify Plus store.' },
      { question: 'How should the agency scope its part of the project?', answer: 'Start with the Shopify storefront and catalog access. Discuss procurement connectivity and project responsibilities with PunchOut Central for the buyer requirement.' },
      { question: 'What should the agency bring to a demo?', answer: 'Bring the client store, target buyer procurement system, catalog scope and expected cart and PO flow.' }
    ],
    relatedHeading: 'Scope the client project',
    ctaTitle: 'Bring the client’s procurement requirement.',
    ctaText: 'Review the Shopify storefront and buyer workflow before committing to an implementation path.'
  },
  '/enterprise/': {
    path: '/enterprise/', tone: 'peach', eyebrow: 'Enterprise supplier programs',
    title: 'Coordinate buyers, stores and transactions at scale.',
    lead: 'PunchOut Central gives suppliers one place to manage multiple enterprise buyer connections, Shopify stores and the transaction journey from PunchOut session to invoice.',
    visualLabel: 'Enterprise program',
    visualSteps: [
      { title: 'Buyer systems', text: 'cXML and OCI workflows' },
      { title: 'Shopify stores', text: 'One or several storefronts' },
      { title: 'Catalog access', text: 'Settings for each buyer' },
      { title: 'Transaction view', text: 'Stages and failure reasons' }
    ],
    detailEyebrow: 'Program requirements', detailTitle: 'Discuss the actual buyer and store map.',
    detailLead: 'Enterprise use cases vary by procurement environment, catalog scope and order process. Start with those facts instead of assuming a standard rollout fits every buyer.',
    details: [
      { title: 'Procurement systems', text: 'Review each buyer’s cXML or OCI requirements and onboarding process.' },
      { title: 'Store model', text: 'Serve several buyers from one Shopify store or manage multiple stores centrally.' },
      { title: 'Buyer access', text: 'Assign the appropriate store and collections or catalog access per buyer.' },
      { title: 'Order lifecycle', text: 'Follow the session, returned cart, approval, PO, Shopify order and invoice.' }
    ],
    workflowTitle: 'Validate one connection, then plan the next.',
    workflowLead: 'Free onboarding assistance covers the initial setup path; buyer-specific requirements still need to be confirmed.',
    workflow: [
      { title: 'List buyers and stores', text: 'Identify the procurement platforms and Shopify storefronts involved.' },
      { title: 'Assign catalog access', text: 'Set the store and relevant collections for each buyer connection.' },
      { title: 'Test the transaction', text: 'Validate launch, cart return, approved PO and store order creation.' },
      { title: 'Review activity', text: 'Use transaction history and reporting to follow the program.' }
    ],
    operatingTitle: 'Give teams a shared view of the program.',
    operatingLead: 'Central management, reporting and in-product support give teams a common place to follow the program.',
    operating: [
      { title: 'Operations', text: 'Track sessions, orders, invoices, line items, timestamps and activity.' },
      { title: 'Reporting', text: 'Review activity, funnel performance and trends with filters and visual reporting.' },
      { title: 'Support', text: 'Use in-product tickets, help or chat, FAQs, or phone support.' }
    ],
    questions: [
      { question: 'Can several buyers use the same Shopify store?', answer: 'Yes. Assign each buyer its own connection and relevant catalog access.' },
      { question: 'Can a program include multiple stores?', answer: 'Yes. Several Shopify stores and buyer connections can be managed centrally.' },
      { question: 'How should we review security or service requirements?', answer: 'Share the buyer’s requirements with the team and request current documentation or contract terms for review.' }
    ],
    relatedHeading: 'Plan an enterprise rollout',
    ctaTitle: 'Bring the full buyer and store map.',
    ctaText: 'We can review procurement requirements, catalog access, transaction stages and connection pricing.'
  }
};
