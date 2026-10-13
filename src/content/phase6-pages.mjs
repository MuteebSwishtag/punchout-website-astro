// Phase 6 editorial content. Claims are limited to the supplied product
// playbook; buyer-side configuration is deliberately described as variable.
export const industryPages = {
  '/industries/industrial-mro/': {
    path: '/industries/industrial-mro/', tone: 'mint', eyebrow: 'Industrial / MRO',
    title: 'PunchOut for industrial and MRO suppliers.',
    lead: 'Support manufacturers, utilities, universities, facilities teams and other repeat buyers without replacing the Shopify catalog your team already runs.',
    visualLabel: 'MRO buying path', visualSteps: [
      { title: 'Buyer procurement', text: 'Approved purchasing rules' },
      { title: 'Shopify catalog', text: 'Tools, parts and supplies' },
      { title: 'Returned cart', text: 'Ready for approval' },
      { title: 'PO to order', text: 'Connected transaction' }
    ],
    detailEyebrow: 'Where it helps', detailTitle: 'Make repeat purchasing easier to enter and easier to operate.',
    detailLead: 'MRO buyers often need approved catalogs, repeatable purchasing and a clear PO handoff. PunchOut connects that requirement to the supplier store without creating a second catalog experience.',
    details: [
      { title: 'Approved assortments', text: 'Give each buyer the relevant store and collections or catalog access instead of exposing every supplier product.' },
      { title: 'Repeat replenishment', text: 'Let maintenance, operations and facilities teams shop the live catalog from their procurement environment.' },
      { title: 'PO-aware order flow', text: 'Keep the returned cart distinct from the approved PO that creates the Shopify order.' },
      { title: 'Issue visibility', text: 'Review the buyer, session, cart, PO, order and invoice stages when a transaction needs attention.' }
    ],
    workflowTitle: 'Map the buyer requirement to the MRO catalog.',
    workflowLead: 'The catalog and approval rules are buyer-specific, so confirm them before the test starts.',
    workflow: [
      { title: 'Identify the buying group', text: 'Confirm whether the connection serves maintenance, facilities, operations, a plant or an institutional buyer.' },
      { title: 'Choose catalog access', text: 'Select the Shopify store and collections the buyer is allowed to see.' },
      { title: 'Test the return', text: 'Launch from procurement, select representative products and return the cart for approval.' },
      { title: 'Verify the handoff', text: 'Check that the approved PO arrives and the corresponding Shopify order is created.' }
    ],
    operatingTitle: 'Keep the operational question visible.',
    operatingLead: 'A useful MRO connection answers both “what can this buyer buy?” and “where did this order stop?”',
    operating: [
      { title: 'Catalog', text: 'Buyer-specific access keeps the assortment aligned to the account.' },
      { title: 'Approval', text: 'The procurement system remains the place where the buyer approves the cart.' },
      { title: 'History', text: 'Transaction stages, line items, timestamps and activity provide order context.' }
    ],
    questions: [
      { question: 'Can one MRO catalog serve multiple enterprise buyers?', answer: 'Yes. One Shopify store can serve multiple buyers, each with its own connection and catalog access settings.' },
      { question: 'Does the returned cart immediately become a store order?', answer: 'No. The buyer reviews and approves the cart in procurement. The Shopify order follows the approved PO.' },
      { question: 'What should an MRO supplier bring to onboarding?', answer: 'Bring the buyer system, protocol expectation, Shopify store, required collections and a representative order to test.' }
    ],
    relatedHeading: 'Connect the MRO workflow',
    ctaTitle: 'Review your next enterprise MRO buyer.',
    ctaText: 'Share the buyer system, catalog scope and PO requirement so the first connection can be planned.'
  },
  '/industries/lab-scientific/': {
    path: '/industries/lab-scientific/', tone: 'peach', eyebrow: 'Lab / Scientific',
    title: 'PunchOut for lab and scientific suppliers.',
    lead: 'Help universities, hospitals, pharmaceutical companies and research organizations buy from the scientific catalog they already need while procurement keeps control of approval.',
    visualLabel: 'Scientific catalog path', visualSteps: [
      { title: 'Institutional buyer', text: 'Procurement environment' },
      { title: 'Scientific catalog', text: 'Shopify or Shopify Plus' },
      { title: 'Cart returned', text: 'Buyer review and approval' },
      { title: 'PO received', text: 'Store order created' }
    ],
    detailEyebrow: 'Scientific buying', detailTitle: 'Connect structured purchasing to a catalog that can keep changing.',
    detailLead: 'Scientific suppliers need a practical way to expose the right products and retain the normal store workflow while institutional buyers follow their own approval process.',
    details: [
      { title: 'Account-specific access', text: 'Assign the relevant store and collections or catalog access for each research, healthcare or education buyer.' },
      { title: 'Catalog continuity', text: 'Use the supplier Shopify catalog instead of maintaining a separate procurement-only storefront.' },
      { title: 'Controlled approval', text: 'Return the cart to the buyer system so institutional approval remains on the buyer side.' },
      { title: 'Connected records', text: 'Keep the session, cart, PO, Shopify order and invoice stages available for operational follow-up.' }
    ],
    workflowTitle: 'Test with real scientific order patterns.',
    workflowLead: 'Use representative products, quantities and buyer catalog access during the test rather than only testing an empty session.',
    workflow: [
      { title: 'Confirm buyer context', text: 'Identify the institution, procurement system and the people who approve the purchase.' },
      { title: 'Set the assortment', text: 'Map the buyer to the intended Shopify store and scientific collections.' },
      { title: 'Return a test cart', text: 'Launch the session, select products and verify that the cart returns to procurement.' },
      { title: 'Follow the PO', text: 'Validate the approved PO and the Shopify order created from it.' }
    ],
    operatingTitle: 'Keep catalog access and order state together.',
    operatingLead: 'The supplier team should be able to distinguish a catalog access question from a buyer approval or PO question.',
    operating: [
      { title: 'Access', text: 'Buyer-specific collections or catalog access define what the institution sees.' },
      { title: 'Lifecycle', text: 'The transaction view follows the six stages from PunchOut Started to Invoice Generated.' },
      { title: 'Support', text: 'Activity and timestamps give the team context when a buyer reports an issue.' }
    ],
    questions: [
      { question: 'Can different institutions use the same Shopify store?', answer: 'Yes. Multiple enterprise buyers can use one store through separate connections and catalog access settings.' },
      { question: 'Does PunchOut replace institutional approval?', answer: 'No. PunchOut returns the cart to the buyer procurement system, where the buyer approval process continues.' },
      { question: 'Are invoice requirements the same for every institution?', answer: 'Not necessarily. Confirm each buyer\'s invoice format, references and delivery requirements during onboarding.' }
    ],
    relatedHeading: 'Connect the scientific buying workflow',
    ctaTitle: 'Bring the institution\'s procurement requirement.',
    ctaText: 'Walk through the catalog scope, buyer system and approved PO path with the team.'
  },
  '/industries/promotional-products/': {
    path: '/industries/promotional-products/', tone: 'mint', eyebrow: 'Promotional products',
    title: 'PunchOut for promotional product suppliers.',
    lead: 'Support corporate, university, healthcare and program buyers who need branded products through procurement while keeping your existing Shopify commerce operation.',
    visualLabel: 'Program purchasing', visualSteps: [
      { title: 'Program buyer', text: 'Approved procurement path' },
      { title: 'Supplier catalog', text: 'Products and collections' },
      { title: 'Cart return', text: 'Review before approval' },
      { title: 'PO to order', text: 'Connected handoff' }
    ],
    detailEyebrow: 'Program complexity', detailTitle: 'Give each buyer a clear catalog path without fragmenting the store.',
    detailLead: 'Promotional programs can have different assortments and purchasing stakeholders. PunchOut lets the buyer enter from procurement while the supplier keeps one commerce operation.',
    details: [
      { title: 'Program-specific assortments', text: 'Assign the buyer the relevant store and collections or catalog access for its merchandise program.' },
      { title: 'Procurement-friendly buying', text: 'Let the buyer shop the supplier catalog, then return the cart for internal approval.' },
      { title: 'Order boundary', text: 'Treat the returned cart as a request and the approved PO as the event that creates the Shopify order.' },
      { title: 'Central visibility', text: 'Follow buyer connections and transaction activity as programs expand.' }
    ],
    workflowTitle: 'Set up the program before the first campaign order.',
    workflowLead: 'Confirm what is included in the buyer catalog and how the buyer expects approved orders to arrive.',
    workflow: [
      { title: 'Define the program', text: 'Document the buyer, store, product collections and procurement environment.' },
      { title: 'Configure access', text: 'Assign the buyer the correct catalog scope from the existing Shopify store.' },
      { title: 'Run a sample order', text: 'Test a realistic cart, return it to procurement and complete the approval path.' },
      { title: 'Confirm order receipt', text: 'Check the approved PO, Shopify order and transaction activity together.' }
    ],
    operatingTitle: 'Keep the commercial program and procurement record aligned.',
    operatingLead: 'A connected view reduces the risk of treating a draft cart, an approved PO and a store order as the same event.',
    operating: [
      { title: 'Buyer access', text: 'Each program can have its own connection and catalog access.' },
      { title: 'Store model', text: 'One store can serve several buyers, while additional stores can be managed centrally.' },
      { title: 'Pricing model', text: 'A new buyer or additional store counts as a connection.' }
    ],
    questions: [
      { question: 'Do promotional suppliers need a separate PunchOut storefront?', answer: 'No. The current product uses the existing Shopify or Shopify Plus store.' },
      { question: 'Can buyers have different branded-product assortments?', answer: 'Yes. Buyer-specific store and collection or catalog access can be assigned during setup.' },
      { question: 'What should be tested?', answer: 'Test catalog access, a representative cart, cart return, buyer approval, PO receipt and Shopify order creation.' }
    ],
    relatedHeading: 'Plan a buyer program connection',
    ctaTitle: 'Turn a program request into a testable connection.',
    ctaText: 'Bring the buyer, catalog scope and procurement workflow to a focused conversation.'
  },
  '/industries/it-hardware/': {
    path: '/industries/it-hardware/', tone: 'peach', eyebrow: 'IT hardware and electronics',
    title: 'PunchOut for IT hardware suppliers.',
    lead: 'Make enterprise technology purchasing easier to enter from procurement while keeping the supplier catalog, buyer access and approved order path connected.',
    visualLabel: 'Technology procurement', visualSteps: [
      { title: 'IT buyer', text: 'Procurement approval rules' },
      { title: 'Approved catalog', text: 'Hardware and accessories' },
      { title: 'Returned cart', text: 'Buyer review' },
      { title: 'PO to Shopify', text: 'Order handoff' }
    ],
    detailEyebrow: 'IT supplier use cases', detailTitle: 'Support catalog governance without rebuilding commerce.',
    detailLead: 'Technology buyers may need a defined assortment, buyer-specific access and a formal PO process. The connection should make those boundaries explicit.',
    details: [
      { title: 'Approved hardware access', text: 'Map each buyer to the store and collections or catalog access that match its purchasing program.' },
      { title: 'Procurement-led approval', text: 'Return the cart to the buyer environment instead of bypassing its internal approval workflow.' },
      { title: 'PO-aware fulfillment', text: 'Use the approved PO as the handoff into the corresponding Shopify order.' },
      { title: 'Transaction diagnosis', text: 'Review line items, timestamps and failure reasons when a technology order needs investigation.' }
    ],
    workflowTitle: 'Test the access and the order boundary.',
    workflowLead: 'Hardware catalogs can be broad, so test both the intended assortment and the complete transaction path.',
    workflow: [
      { title: 'Clarify the buyer', text: 'Identify the enterprise procurement system and the IT purchasing group involved.' },
      { title: 'Choose the catalog', text: 'Assign the buyer the correct Shopify store and product collections.' },
      { title: 'Validate cart return', text: 'Launch from procurement, select hardware and return the cart for approval.' },
      { title: 'Verify PO receipt', text: 'Confirm the approved PO creates the related Shopify order and remains traceable.' }
    ],
    operatingTitle: 'Separate catalog access from fulfillment status.',
    operatingLead: 'The right product being visible does not mean the buyer has completed approval or that an order exists.',
    operating: [
      { title: 'Catalog', text: 'Buyer-specific access defines what can be selected.' },
      { title: 'Approval', text: 'The buyer system manages internal review before the PO is sent.' },
      { title: 'Order', text: 'PunchOut Central connects the approved PO to the Shopify order lifecycle.' }
    ],
    questions: [
      { question: 'Can an IT supplier use Shopify for enterprise PunchOut?', answer: 'Yes. PunchOut Central connects a Shopify or Shopify Plus store to buyer procurement workflows.' },
      { question: 'Can multiple buyers share one catalog?', answer: 'Yes. Each buyer can have its own connection and catalog access from the same store.' },
      { question: 'Should invoice handling be assumed?', answer: 'No. Confirm the buyer\'s invoice format and delivery requirements for each connection.' }
    ],
    relatedHeading: 'Explore IT procurement connectivity',
    ctaTitle: 'Review the hardware buyer\'s required flow.',
    ctaText: 'Share the procurement platform, catalog scope and expected PO handoff before testing.'
  },
  '/industries/workplace-facilities/': {
    path: '/industries/workplace-facilities/', tone: 'mint', eyebrow: 'Workplace / facilities',
    title: 'PunchOut for workplace and facilities suppliers.',
    lead: 'Connect office, janitorial, safety and facilities catalogs to the procurement workflows used by companies, campuses and institutions.',
    visualLabel: 'Facilities replenishment', visualSteps: [
      { title: 'Facilities team', text: 'Procurement request' },
      { title: 'Supplier store', text: 'Approved assortment' },
      { title: 'Cart returned', text: 'Internal review' },
      { title: 'PO and order', text: 'Connected record' }
    ],
    detailEyebrow: 'Facilities purchasing', detailTitle: 'Make recurring operational buying fit formal procurement.',
    detailLead: 'Facilities teams buy repeatedly, but the buyer may still require catalogs, approvals and purchase orders. PunchOut connects those needs to the supplier store.',
    details: [
      { title: 'Repeatable access', text: 'Expose the collections or catalog access that a workplace or facilities buyer should use.' },
      { title: 'Existing store operation', text: 'Keep the Shopify or Shopify Plus catalog instead of building a separate procurement storefront.' },
      { title: 'Approval before order', text: 'Return the selected cart to procurement for the buyer\'s approval process.' },
      { title: 'Operational traceability', text: 'Follow sessions, carts, POs, store orders and invoices in the transaction view.' }
    ],
    workflowTitle: 'Connect the recurring order path.',
    workflowLead: 'The strongest test mirrors the buyer\'s normal replenishment pattern and approval chain.',
    workflow: [
      { title: 'List buying teams', text: 'Identify the facilities, workplace, safety or operations groups using the connection.' },
      { title: 'Map the assortment', text: 'Choose the Shopify store and relevant collections for that buyer.' },
      { title: 'Test a replenishment', text: 'Return a representative cart to procurement and complete the approval path.' },
      { title: 'Check the store order', text: 'Confirm PO receipt, Shopify order creation and transaction history.' }
    ],
    operatingTitle: 'Keep the everyday purchase understandable.',
    operatingLead: 'A supplier team can answer whether the issue is access, approval, PO receipt or store order creation.',
    operating: [
      { title: 'Access', text: 'The buyer sees the store and catalog scope assigned to its connection.' },
      { title: 'Progress', text: 'The transaction record shows the latest completed lifecycle stage.' },
      { title: 'Follow-up', text: 'Activity and failure reasons give support teams a starting point.' }
    ],
    questions: [
      { question: 'Can a facilities supplier keep one store for several buyers?', answer: 'Yes. One Shopify store can serve multiple enterprise buyers with buyer-specific connections and access.' },
      { question: 'Is PunchOut only for one-time purchases?', answer: 'No. The workflow also fits recurring and repeat purchasing where the buyer uses procurement approval.' },
      { question: 'What is the first implementation decision?', answer: 'Confirm the buyer system, protocol, store, catalog scope and how the approved PO will be sent.' }
    ],
    relatedHeading: 'Connect facilities procurement',
    ctaTitle: 'Plan the workplace buyer connection.',
    ctaText: 'Review the recurring assortment, approval process and store order requirements with the team.'
  },
  '/industries/hospitality-supplies/': {
    path: '/industries/hospitality-supplies/', tone: 'peach', eyebrow: 'Hospitality supplies',
    title: 'PunchOut for hospitality and operational suppliers.',
    lead: 'Support hotels, restaurants, venues and multi-location operators that need recurring supplies through a structured procurement process.',
    visualLabel: 'Operational buying', visualSteps: [
      { title: 'Operator', text: 'Buyer procurement system' },
      { title: 'Supply catalog', text: 'Shopify store and access' },
      { title: 'Cart approval', text: 'Buyer reviews request' },
      { title: 'PO to order', text: 'Supplier receives order' }
    ],
    detailEyebrow: 'Hospitality operations', detailTitle: 'Connect location-level buying to a supplier catalog.',
    detailLead: 'Hospitality purchasing can involve recurring operational goods, multiple locations and approval rules. A clear buyer connection keeps the catalog and PO journey understandable.',
    details: [
      { title: 'Program access', text: 'Assign the buyer the store and collections or catalog access intended for its operating program.' },
      { title: 'Location-aware requests', text: 'Let the buyer start in procurement and select the supplier products required for an approved request.' },
      { title: 'PO handoff', text: 'Keep the cart-return event separate from the approved PO that creates the Shopify order.' },
      { title: 'Central transaction view', text: 'Review buyer, store and transaction activity as the program grows.' }
    ],
    workflowTitle: 'Test one operating scenario end to end.',
    workflowLead: 'Use a representative location or operating team, then validate the same stages the broader program will use.',
    workflow: [
      { title: 'Define the buyer scope', text: 'Confirm the procurement system, operating group and store or catalog access.' },
      { title: 'Configure the catalog', text: 'Assign the relevant Shopify collections or catalog access to that connection.' },
      { title: 'Return and approve', text: 'Shop from the procurement-launched catalog, return the cart and complete buyer approval.' },
      { title: 'Trace the order', text: 'Confirm the approved PO and resulting Shopify order in the transaction history.' }
    ],
    operatingTitle: 'Keep operations moving without losing procurement control.',
    operatingLead: 'The supplier can preserve the normal ecommerce operation while the buyer keeps its approval and PO process.',
    operating: [
      { title: 'Store', text: 'Use the existing Shopify or Shopify Plus supplier catalog.' },
      { title: 'Connections', text: 'Add buyers or additional stores as the program expands.' },
      { title: 'Visibility', text: 'Follow transaction stages and failure reasons from one platform.' }
    ],
    questions: [
      { question: 'Can hospitality buyers use an existing Shopify store?', answer: 'Yes. PunchOut Central is designed to connect the existing Shopify or Shopify Plus store to procurement.' },
      { question: 'Can multiple locations be represented?', answer: 'The buyer-specific connection and catalog setup should be confirmed for each program; multiple buyers and stores can be managed centrally.' },
      { question: 'What should be confirmed before launch?', answer: 'Confirm the buyer protocol, catalog access, cart-return behavior, approval path, PO receipt and invoice requirements.' }
    ],
    relatedHeading: 'Plan operational supplier connectivity',
    ctaTitle: 'Turn the hospitality request into a clear test plan.',
    ctaText: 'Bring the buyer system, operating scope and Shopify catalog to the conversation.'
  }
};

const sharedQuestions = [
  { question: 'Is this the same as a commercial integration page?', answer: 'No. This article explains the buyer question or workflow. Use the linked integration page for PunchOut Central implementation scope.' },
  { question: 'Does every buyer configure PunchOut the same way?', answer: 'No. The buyer system, credentials, document requirements and approval process vary by buyer environment and must be confirmed during onboarding.' }
];

export const insightPages = {
  '/insights/what-is-shopify-punchout/': {
    path: '/insights/what-is-shopify-punchout/', eyebrow: 'Shopify PunchOut explained', breadcrumb: 'What is Shopify PunchOut?',
    title: 'What is Shopify PunchOut?',
    lead: 'Shopify PunchOut connects a buyer\'s procurement system to a supplier\'s Shopify catalog so the buyer can shop, return a cart for approval and send an approved purchase order back to the supplier.',
    visualLabel: 'Shopify PunchOut', visualSteps: [
      { title: 'Procurement', text: 'Buyer starts the session' },
      { title: 'Shopify', text: 'Buyer shops the catalog' },
      { title: 'Approval', text: 'Cart returns for review' },
      { title: 'PO', text: 'Approved order flows back' }
    ],
    sections: [
      { id: 'definition', title: 'The short definition', paragraphs: ['Shopify PunchOut is a procurement-to-commerce connection, not a second checkout page. A buyer launches the supplier catalog from its procurement system, shops on Shopify, and returns the selected cart to procurement. The buyer then applies its internal approval process before the approved purchase order reaches the supplier.'] },
      { id: 'flow', title: 'How the flow works', steps: [
        { title: 'The buyer launches', text: 'The procurement system opens a buyer-specific supplier session.' },
        { title: 'The buyer shops', text: 'Products and quantities are selected in the supplier\'s Shopify or Shopify Plus catalog.' },
        { title: 'The cart returns', text: 'The selected cart goes back to procurement for review and approval.' },
        { title: 'The PO arrives', text: 'After approval, the purchase order is sent through the buyer\'s configured process and the supplier can create the Shopify order.' }
      ] },
      { id: 'shopify-role', title: 'What Shopify contributes', paragraphs: ['Shopify remains the supplier\'s commerce catalog and store operation. PunchOut Central adds the connection layer around that store, including buyer-specific catalog access, cXML and OCI workflows, purchase-order handoff and transaction visibility.'] },
      { id: 'boundary', title: 'What Shopify PunchOut does not mean', bullets: ['It does not mean every Shopify store has a native procurement connection without configuration.', 'It does not mean a returned cart is already an approved order.', 'It does not mean every buyer uses the same credentials, protocol details or invoice requirements.'] }
    ],
    related: [['/integrations/shopify/', 'Shopify PunchOut integration', 'Review the commercial connection path for an existing Shopify store.'], ['/resources/punchout-guide/', 'What is a PunchOut catalog?', 'Start with the broader procurement workflow.'], ['/how-it-works/', 'How the full workflow works', 'Follow the transaction from session to invoice.']],
    questions: sharedQuestions,
    ctaTitle: 'See how Shopify PunchOut fits your buyer request.', ctaText: 'Bring the buyer procurement system and catalog scope to a focused demo.'
  },
  '/insights/does-shopify-support-punchout/': {
    path: '/insights/does-shopify-support-punchout/', eyebrow: 'Shopify capability question', breadcrumb: 'Does Shopify support PunchOut?',
    title: 'Does Shopify support PunchOut?',
    lead: 'Shopify can be used as the supplier catalog in a PunchOut workflow, but the procurement connection still needs a configured integration layer and buyer-specific setup.',
    visualLabel: 'Capability boundary', visualSteps: [
      { title: 'Shopify store', text: 'Existing supplier catalog' },
      { title: 'Connection layer', text: 'cXML or OCI setup' },
      { title: 'Buyer system', text: 'Launch and approval' },
      { title: 'Shopify order', text: 'Approved PO handoff' }
    ],
    sections: [
      { id: 'answer', title: 'The practical answer', paragraphs: ['Yes, Shopify can be the commerce side of a PunchOut connection. The precise implementation is not the same as turning on a normal storefront setting: the buyer and supplier need a connection that handles session launch, catalog access, cart return and the later PO-to-order handoff.'] },
      { id: 'native-vs-connector', title: 'Native store capability versus a connection layer', paragraphs: ['Shopify provides the supplier catalog and store experience. PunchOut Central is the managed connection layer that connects Shopify or Shopify Plus to enterprise procurement workflows using cXML and OCI. This separation lets a supplier keep the existing store while supporting a buyer requirement.'] },
      { id: 'checklist', title: 'Questions to answer before saying yes', bullets: ['Which procurement system launches the buyer session?', 'Does the buyer expect cXML, OCI or another documented process?', 'Which Shopify store and collections should the buyer access?', 'When is the cart returned, and what document creates the supplier order?', 'What invoice format, references and delivery method does the buyer require?'] },
      { id: 'misconceptions', title: 'Avoid two common assumptions', paragraphs: ['A Shopify store is not automatically connected to every procurement platform. Also, a buyer asking for PunchOut is not necessarily asking for a new supplier storefront. The useful first step is to map the buyer requirement to the store and catalog that already exist.'] }
    ],
    related: [['/integrations/shopify/', 'Shopify integration', 'See the product-level Shopify PunchOut page.'], ['/integrations/cxml/', 'cXML PunchOut', 'Review the cXML connection model.'], ['/integrations/oci/', 'OCI PunchOut', 'Review the OCI connection model.']],
    questions: sharedQuestions,
    ctaTitle: 'Confirm whether your store fits the request.', ctaText: 'Share the buyer system, protocol expectation and Shopify catalog scope before implementation.'
  },
  '/insights/customer-asked-for-punchout/': {
    path: '/insights/customer-asked-for-punchout/', eyebrow: 'Problem-aware guide', breadcrumb: 'A customer asked for PunchOut',
    title: 'A customer asked for PunchOut. What should you do next?',
    lead: 'Treat the request as a procurement requirement to scope, not as a reason to rebuild your ecommerce operation. Start by collecting the buyer facts that determine the connection.',
    visualLabel: 'Buyer request checklist', visualSteps: [
      { title: 'Listen', text: 'Capture the exact requirement' },
      { title: 'Map', text: 'Store, buyer and catalog' },
      { title: 'Test', text: 'Cart, approval and PO' },
      { title: 'Launch', text: 'Go live with context' }
    ],
    sections: [
      { id: 'first-response', title: 'The first response', paragraphs: ['Ask the customer which procurement platform they use, what their PunchOut documentation says, which store or catalog they expect, and how an approved purchase order will be delivered. Those answers are more useful than promising a generic integration before the buyer\'s workflow is known.'] },
      { id: 'questions', title: 'The discovery checklist', bullets: ['Buyer system and tenant or environment name, if applicable.', 'Expected protocol and buyer-side setup instructions.', 'Supplier store, catalog collections and any account-specific access.', 'Test credentials, test products and the buyer\'s approval path.', 'PO fields, delivery expectations and invoice requirements.', 'Buyer contact who can confirm a successful end-to-end test.'] },
      { id: 'sequence', title: 'A sensible implementation sequence', steps: [
        { title: 'Define the connection', text: 'Separate the buyer requirement from broader ecommerce work and confirm who owns each setup step.' },
        { title: 'Configure access', text: 'Map the buyer to the correct Shopify store and catalog access.' },
        { title: 'Test the full path', text: 'Check launch, shopping, cart return, approval, PO receipt and Shopify order creation.' },
        { title: 'Document the handoff', text: 'Record the buyer settings, test result and invoice expectations for operations.' }
      ] },
      { id: 'what-not-to-promise', title: 'What not to promise yet', bullets: ['Do not promise a protocol, document format or invoice route the buyer has not specified.', 'Do not describe the cart return as an approved order.', 'Do not claim buyer compatibility based only on the platform name; confirm the buyer configuration.'] }
    ],
    related: [['/solutions/enterprise-customer-onboarding/', 'Enterprise buyer onboarding', 'Turn discovery into a repeatable setup process.'], ['/documentation/', 'Documentation', 'Use the store-to-buyer setup path.'], ['/book-demo/', 'Discuss the requirement', 'Bring the buyer request to the team.']],
    questions: [{ question: 'Can I start with one buyer?', answer: 'Yes. The Starter plan includes one connection, and additional buyers or stores can be added as connections.' }, ...sharedQuestions],
    ctaTitle: 'Bring the customer request to a real scoping conversation.', ctaText: 'The buyer system, store and expected PO path are enough to start a useful review.'
  }
};

const platformInsights = {
  '/insights/how-coupa-punchout-works/': ['Coupa', 'Coupa PunchOut', 'how Coupa PunchOut works', '/integrations/coupa/'],
  '/insights/how-sap-ariba-punchout-works/': ['SAP Ariba', 'SAP Ariba PunchOut', 'how SAP Ariba PunchOut works', '/integrations/sap-ariba/'],
  '/insights/how-jaggaer-punchout-works/': ['JAGGAER', 'JAGGAER PunchOut', 'how JAGGAER PunchOut works', '/integrations/jaggaer/'],
  '/insights/how-oracle-punchout-works/': ['Oracle Procurement', 'Oracle PunchOut', 'how Oracle PunchOut works', '/integrations/oracle/'],
  '/insights/how-workday-punchout-works/': ['Workday', 'Workday PunchOut', 'how Workday PunchOut works', '/integrations/workday/']
};

for (const [path, [system, label, breadcrumb, commercialPath]] of Object.entries(platformInsights)) {
  insightPages[path] = {
    path, eyebrow: `${system} workflow`, breadcrumb, title: `How ${label} works with a Shopify supplier catalog`,
    lead: `Understand the buyer-side sequence when ${system} opens a supplier catalog, returns a cart for approval and sends the approved purchase order back to the supplier.`,
    visualLabel: `${system} PunchOut`, visualSteps: [
      { title: system, text: 'Buyer starts in procurement' },
      { title: 'Shopify catalog', text: 'Supplier products and access' },
      { title: 'Cart return', text: 'Buyer reviews the selection' },
      { title: 'PO to order', text: 'Approved handoff' }
    ],
    sections: [
      { id: 'overview', title: `The ${system} PunchOut pattern`, paragraphs: [`The common pattern is a procurement-launched session: the buyer selects the supplier catalog in ${system}, shops on the Shopify or Shopify Plus store, returns the cart to procurement and completes the buyer's approval process. The supplier receives the approved purchase order through the configured connection and can create the related store order.`] },
      { id: 'sequence', title: 'The sequence to validate', steps: [
        { title: 'Buyer launch', text: `The buyer opens the supplier catalog from its ${system} procurement environment using the buyer-specific setup.` },
        { title: 'Supplier shopping', text: 'The buyer sees the assigned Shopify store and relevant catalog access, then selects products and quantities.' },
        { title: 'Cart return', text: 'The selection returns to the procurement system. This is a review point, not proof that the supplier order exists.' },
        { title: 'Approval and PO', text: 'The buyer applies its own approval process and sends the approved PO through the agreed connection.' },
        { title: 'Store order', text: 'PunchOut Central records the PO-to-order handoff and the Shopify order can be reviewed with the earlier activity.' }
      ] },
      { id: 'buyer-specific', title: 'What is buyer-specific', bullets: [`${system} account, tenant, credentials and catalog-launch settings.`, 'The protocol details and required fields used by the buyer connection.', 'Approval routing, PO references, shipping and billing expectations.', 'Invoice format and delivery requirements after the order is created.'] },
      { id: 'test', title: 'What the supplier should test', paragraphs: ['Use the buyer\'s test instructions and confirm the same product, quantity and account context can be followed through the full transaction. Record where the test stopped if the buyer reports that the catalog opened but the order did not arrive.'] }
    ],
    related: [[commercialPath, `${label} integration`, `Review the commercial ${system} connection page.`], ['/integrations/shopify/', 'Shopify PunchOut', 'See the supplier catalog side of the connection.'], ['/platform/purchase-orders/', 'Purchase orders', 'Understand the approval-to-order boundary.'], ['/platform/transactions/', 'Transaction tracking', 'Trace the stages when troubleshooting.']],
    questions: [{ question: `Does every ${system} buyer use the same setup?`, answer: `No. Buyer configuration, credentials, approval rules and required document details can vary. Confirm the buyer's own setup instructions.` }, { question: 'Does cart return create the Shopify order?', answer: 'No. The cart returns for buyer review and approval. The approved PO is the handoff to the Shopify order.' }, ...sharedQuestions],
    ctaTitle: `Review the ${system} buyer workflow before testing.`, ctaText: 'Bring the buyer\'s setup instructions and Shopify catalog scope to a focused integration review.'
  };
}

insightPages['/insights/punchout-integration-cost/'] = {
  path: '/insights/punchout-integration-cost/', eyebrow: 'Commercial research', breadcrumb: 'PunchOut integration cost',
  title: 'How much does a PunchOut integration cost?',
  lead: 'The answer depends on the supplier store, buyer count, protocol and onboarding scope. PunchOut Central publishes a connection-based monthly model so suppliers can estimate the platform cost before discussing buyer-specific requirements.',
  visualLabel: 'Connection pricing', visualSteps: [
    { title: 'One buyer', text: 'Starter connection' },
    { title: 'More buyers', text: 'Add connections' },
    { title: 'More stores', text: 'Count each store' },
    { title: 'One view', text: 'Manage centrally' }
  ],
  sections: [
    { id: 'published-model', title: 'The published PunchOut Central model', paragraphs: ['PunchOut Central prices by connection rather than by order value. The current published plans are Starter at $500 per month for one connection, Growth at $1,000 per month for up to four connections, and Scale at $1,500 per month for up to seven connections. Each additional connection beyond the plan allowance is $200 per month.'] },
    { id: 'included', title: 'What the model includes', bullets: ['Shopify or Shopify Plus supplier catalog connectivity.', 'Buyer-specific connection and catalog access settings.', 'cXML and OCI PunchOut support as described in the product playbook.', 'Transaction visibility across the buyer workflow.', 'Free onboarding assistance.', 'No setup fee and no transaction fee in the published pricing model.'] },
    { id: 'counting', title: 'How to count connections', paragraphs: ['A new buyer counts as a connection. An additional store also counts as a connection. One Shopify store serving several buyers therefore needs a count based on the buyer relationships; a multi-store program needs to include the additional stores as well.'], steps: [
      { title: 'List buyers', text: 'Count the enterprise procurement relationships that need separate connections.' },
      { title: 'List stores', text: 'Add any additional Shopify or Shopify Plus stores in the program.' },
      { title: 'Compare allowances', text: 'Map the total to Starter, Growth or Scale, then add $200 per connection beyond the allowance.' }
    ] },
    { id: 'not-included', title: 'Costs that still need buyer confirmation', bullets: ['Buyer-side procurement configuration or consulting costs.', 'Custom buyer requirements not represented by the standard onboarding scope.', 'Accounting, tax, fulfillment or ERP work outside the described PunchOut connection.', 'Invoice format and delivery requirements that differ by buyer.'] },
    { id: 'questions', title: 'Questions to ask before comparing quotes', paragraphs: ['Ask whether the quote covers the actual buyer systems, how many connections are included, whether additional stores count separately, what onboarding assistance covers, and what happens after the approved PO reaches the supplier. A low headline price is not comparable if it omits the buyer workflow or the testing and support context.'] }
  ],
  related: [['/pricing/', 'PunchOut pricing', 'Compare the published plans and allowances.'], ['/solutions/one-store-multiple-buyers/', 'One store, multiple buyers', 'See how buyer count affects the operating model.'], ['/platform/multi-store/', 'Multi-store management', 'Review how additional stores fit the connection model.'], ['/book-demo/', 'Discuss your estimate', 'Bring your buyer and store count to the team.']],
  questions: [{ question: 'Is there a setup fee?', answer: 'No. The published model includes free onboarding assistance and no setup fee.' }, { question: 'Are there transaction fees?', answer: 'No. The published model does not charge transaction fees.' }, { question: 'What counts as a connection?', answer: 'A new buyer or an additional store counts as a connection.' }],
  ctaTitle: 'Estimate the right plan from your buyer map.', ctaText: 'Share the number of buyers, Shopify stores and procurement systems for a grounded discussion.'
};

