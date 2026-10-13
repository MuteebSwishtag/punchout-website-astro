// Educational resource content. Product-specific statements are limited to the
// supplied playbook; protocol and catalog explanations are framed as general
// implementation guidance and should be confirmed against each buyer's rules.
export const resourcePages = Object.freeze({
  '/resources/shopify-punchout-guide/': {
    eyebrow: 'Shopify PunchOut guide',
    breadcrumb: 'Shopify PunchOut guide',
    title: 'How Shopify PunchOut works for B2B suppliers.',
    lead: 'A practical guide to connecting the Shopify or Shopify Plus store you already operate to an enterprise buyer\'s procurement workflow.',
    intent: 'Shopify PunchOut guide',
    sections: [
      {
        id: 'model', title: 'The Shopify PunchOut model',
        paragraphs: [
          'Shopify PunchOut does not require a second procurement-only storefront. The supplier keeps the existing Shopify or Shopify Plus catalog and makes it available to a buyer through a supported PunchOut connection.',
          'The buyer starts in its procurement application, opens the supplier catalog, shops in the Shopify experience, and returns the cart to procurement. The buyer then follows its own approval process before the approved purchase order reaches the supplier connection.'
        ]
      },
      {
        id: 'mapping', title: 'Map the buyer to the right store and catalog',
        paragraphs: [
          'The important Shopify decision is not only which store is connected. It is also which buyer should see which storefront and which collections or catalog access. One store can serve multiple buyers, while a supplier with several stores can map different buyers to different storefronts.',
          'Treat each buyer as a separate connection with its own procurement requirements, access scope and test record. That keeps a buyer-specific requirement from being confused with the broader Shopify catalog.'
        ],
        bullets: [
          'Name the Shopify or Shopify Plus store that will serve the buyer.',
          'Confirm the collections or catalog access the buyer is allowed to use.',
          'Record whether the buyer expects cXML or OCI.',
          'Confirm how the buyer will review, approve and send the purchase order.'
        ]
      },
      {
        id: 'lifecycle', title: 'Follow the complete Shopify transaction',
        steps: [
          { title: 'PunchOut started', text: 'The buyer launches a session from its procurement environment.' },
          { title: 'Cart returned', text: 'The buyer shops in the Shopify catalog and returns the selected cart for review.' },
          { title: 'Buyer approved', text: 'The buyer completes its internal approval process.' },
          { title: 'PO received', text: 'The approved purchase order reaches the supplier connection.' },
          { title: 'Store order created', text: 'PunchOut Central creates the related Shopify order.' },
          { title: 'Invoice generated', text: 'The invoice stage remains part of the tracked transaction journey.' }
        ]
      },
      {
        id: 'scope', title: 'What to confirm before calling it live',
        paragraphs: [
          'A successful catalog launch is only the first test. Confirm the cart return, buyer approval, approved PO and Shopify order creation for the actual buyer connection. Invoice format and delivery requirements are buyer-specific and should be agreed before launch.',
          'PunchOut Central supports Shopify and Shopify Plus now. BigCommerce and Magento are planned in the current product playbook, so they should not be presented as live Shopify PunchOut alternatives.'
        ]
      }
    ],
    related: [
      ['/integrations/shopify/', 'Shopify PunchOut integration', 'Review the commercial connection path.'],
      ['/documentation/', 'Setup documentation', 'Prepare the store, buyer and test inputs.'],
      ['/solutions/one-store-multiple-buyers/', 'One store, multiple buyers', 'Compare the shared-store operating model.']
    ],
    ctaTitle: 'Have a Shopify buyer requirement?',
    ctaText: 'Bring the buyer system, store and catalog scope to a focused connection discussion.',
    secondaryLabel: 'Review setup docs', secondaryHref: '/documentation/'
  },

  '/resources/cxml-guide/': {
    eyebrow: 'cXML guide', breadcrumb: 'cXML guide',
    title: 'What is cXML? A supplier guide to PunchOut messages.',
    lead: 'Understand where cXML fits in a procurement-to-commerce flow, which message boundaries matter, and what to confirm before testing a buyer connection.',
    intent: 'What is cXML?',
    sections: [
      {
        id: 'definition', title: 'cXML in plain language',
        paragraphs: [
          'cXML, or Commerce XML, is a structured protocol used to exchange commerce and procurement information between applications. The standard includes setup and transaction documents, including the PunchOut interactions commonly used to open a supplier catalog and return a cart.',
          'A cXML connection is not a generic promise that every buyer uses the same fields. The buyer environment, identifiers, endpoint expectations and document requirements still need to be agreed for the specific connection.'
        ]
      },
      {
        id: 'messages', title: 'The messages around a PunchOut session',
        steps: [
          { title: 'Setup request', text: 'The procurement system sends the information needed to start a supplier catalog session.' },
          { title: 'Setup response', text: 'The supplier-side connection responds with the session destination or result expected by the buyer.' },
          { title: 'Cart return', text: 'The supplier site returns the selected cart to the procurement application for review.' },
          { title: 'Order request', text: 'After buyer approval, the buyer sends the purchase order document required by its process.' },
          { title: 'Later documents', text: 'Order confirmations, invoices or other documents depend on the buyer agreement and the supported transaction scope.' }
        ]
      },
      {
        id: 'inputs', title: 'cXML questions to collect from the buyer',
        bullets: [
          'Which cXML version and document types does the buyer expect?',
          'Which sender, receiver and shared-secret or credential rules apply?',
          'Which URL, return behavior and line-item fields must the cart contain?',
          'Which identifiers must be preserved from the buyer request through the PO?',
          'How will the buyer test approval, PO receipt and any invoice requirement?'
        ]
      },
      {
        id: 'boundary', title: 'cXML support is not the same as buyer compatibility',
        paragraphs: [
          'PunchOut Central supports cXML procurement workflows, but a buyer connection still needs buyer-specific configuration and testing. Do not infer compatibility from the protocol name alone. Confirm the procurement platform, workflow, required fields and test environment before promising a go-live date.',
          'Use the cXML commercial integration page for the product connection path; use this guide when you need to understand the protocol vocabulary and implementation questions.'
        ]
      }
    ],
    references: [
      ['https://www.cxml.org/', 'cXML.org overview'],
      ['https://www.cxml.org/downloads.html', 'cXML specifications and guides']
    ],
    related: [
      ['/integrations/cxml/', 'cXML PunchOut integration', 'See the product connection page.'],
      ['/resources/cxml-vs-oci/', 'cXML vs OCI', 'Compare the two supported protocol paths.'],
      ['/resources/punchout-testing-checklist/', 'Testing checklist', 'Turn protocol questions into test cases.']
    ],
    ctaTitle: 'Need to translate a cXML requirement?',
    ctaText: 'Share the buyer platform and required transaction flow so the connection can be scoped accurately.',
    secondaryLabel: 'See cXML integration', secondaryHref: '/integrations/cxml/'
  },

  '/resources/oci-guide/': {
    eyebrow: 'OCI guide', breadcrumb: 'OCI guide',
    title: 'What is OCI? A practical guide to Open Catalog Interface.',
    lead: 'Learn how OCI connects an external supplier catalog to a procurement or ERP environment, and which buyer-specific details shape a reliable test.',
    intent: 'What is OCI?',
    sections: [
      {
        id: 'definition', title: 'OCI in plain language',
        paragraphs: [
          'OCI, commonly expanded as Open Catalog Interface, is an interface for calling an external catalog and transferring selected catalog data back into a procurement or ERP application. In a PunchOut scenario, the buyer opens the supplier catalog, selects products and returns the selection to the buying application.',
          'The exact field mapping, version, authentication and return behavior are controlled by the buyer environment. Treat OCI as a protocol family and implementation contract, not as one universal configuration.'
        ]
      },
      {
        id: 'flow', title: 'The OCI catalog flow',
        steps: [
          { title: 'Buyer starts the catalog', text: 'The buyer launches the external supplier catalog from its purchasing context.' },
          { title: 'Supplier session opens', text: 'The supplier store receives the connection context needed for the shopping session.' },
          { title: 'Buyer selects items', text: 'The buyer shops in the supplier catalog and builds a cart.' },
          { title: 'Fields return to procurement', text: 'The selected products and required values are transferred back to the buyer application.' },
          { title: 'Buyer continues approval', text: 'The returned cart becomes part of the buyer-side requisition or approval process.' }
        ]
      },
      {
        id: 'requirements', title: 'OCI inputs to clarify before setup',
        bullets: [
          'The buyer system and OCI version or profile.',
          'The launch URL, return target and required form fields.',
          'The buyer and supplier identifiers that must be passed through the session.',
          'The catalog access, collections and store the buyer should see.',
          'The expected approved PO path after the cart is returned.'
        ]
      },
      {
        id: 'boundary', title: 'Keep OCI separate from the Shopify catalog itself',
        paragraphs: [
          'OCI carries the buyer-side catalog interaction; it does not replace the supplier\'s commerce operation. PunchOut Central uses the existing Shopify or Shopify Plus store, then manages the buyer connection, catalog access and transaction visibility around it.',
          'The buyer may use OCI while another buyer uses cXML. That is why a supplier should document each connection separately even when all buyers use the same store.'
        ]
      }
    ],
    references: [
      ['https://help.sap.com/docs/SAP_ERP/38b3b859b68e464c90164894f04503e9/3e2bbf53d25ab64ce10000000a174cb4.html', 'SAP OCI overview'],
      ['https://help.sap.com/doc/srm/1.0/en-US/attachments/3362936504/OCI_4.0_Documentation.pdf', 'SAP OCI documentation']
    ],
    related: [
      ['/integrations/oci/', 'OCI PunchOut integration', 'See the product connection page.'],
      ['/resources/cxml-vs-oci/', 'cXML vs OCI', 'Compare the two supported protocol paths.'],
      ['/resources/punchout-supplier-onboarding/', 'Supplier onboarding', 'Prepare the buyer and store inputs.']
    ],
    ctaTitle: 'Have an OCI buyer requirement?',
    ctaText: 'Bring the buyer environment, catalog scope and return expectations to the connection discussion.',
    secondaryLabel: 'See OCI integration', secondaryHref: '/integrations/oci/'
  },

  '/resources/cxml-vs-oci/': {
    eyebrow: 'Protocol comparison', breadcrumb: 'cXML vs OCI',
    title: 'cXML vs OCI: which PunchOut protocol should a supplier use?',
    lead: 'A practical comparison for suppliers deciding how to respond when an enterprise buyer asks for PunchOut.',
    intent: 'cXML vs OCI',
    comparisonHeaders: ['cXML', 'OCI'],
    comparison: [
      { label: 'Where it starts', cxml: 'Often launched from a procurement application or network using structured cXML setup messages.', oci: 'Often launched from an SAP or compatible procurement/ERP context using OCI catalog interface parameters.' },
      { label: 'What comes back', cxml: 'A structured response and cart return, followed by buyer-specific order documents.', oci: 'Mapped catalog and line-item fields returned to the buyer application.' },
      { label: 'What varies by buyer', cxml: 'Versions, identifiers, credentials, endpoints, fields and document requirements.', oci: 'Version, form fields, return target, mapping and buyer-side authentication.' },
      { label: 'What the supplier should test', cxml: 'Session launch, cart return, approval, PO receipt and any agreed downstream documents.', oci: 'Catalog launch, field mapping, cart return, buyer approval and the resulting PO path.' }
    ],
    sections: [
      {
        id: 'decision', title: 'The buyer usually determines the protocol',
        paragraphs: [
          'A supplier normally does not choose cXML or OCI in isolation. The enterprise customer\'s procurement platform and integration standard determine the connection contract. Ask the buyer which protocol it requires before designing a test or quoting implementation work.',
          'PunchOut Central supports both cXML and OCI workflows. That lets the supplier keep one Shopify or Shopify Plus catalog while supporting different buyer connection requirements.'
        ]
      },
      {
        id: 'shared', title: 'What both protocols have in common',
        bullets: [
          'The buyer launches a supplier catalog from procurement.',
          'The supplier catalog remains the place where the buyer shops.',
          'The selected cart returns to procurement for review and approval.',
          'The approved PO is the handoff into supplier order creation.',
          'The buyer-specific workflow must be tested before go-live.'
        ]
      },
      {
        id: 'questions', title: 'Questions that resolve the choice quickly',
        bullets: [
          'Which procurement or ERP product is the buyer using?',
          'Does the buyer provide a cXML or OCI setup document and test account?',
          'Which catalog access and store should the buyer receive?',
          'What fields, identifiers and PO references must be retained?',
          'What invoice format and delivery requirement applies after ordering?'
        ]
      }
    ],
    related: [
      ['/integrations/cxml/', 'cXML PunchOut', 'Review the cXML connection path.'],
      ['/integrations/oci/', 'OCI PunchOut', 'Review the OCI connection path.'],
      ['/resources/punchout-implementation-guide/', 'Implementation guide', 'Turn the buyer requirement into a plan.']
    ],
    ctaTitle: 'Let the buyer requirement drive the protocol.',
    ctaText: 'Share the buyer platform and required workflow before choosing a setup path.',
    secondaryLabel: 'Compare integrations', secondaryHref: '/integrations/'
  },

  '/resources/punchout-implementation-guide/': {
    eyebrow: 'Implementation guide', breadcrumb: 'PunchOut implementation guide',
    title: 'PunchOut implementation: a supplier\'s practical plan.',
    lead: 'A structured implementation sequence for connecting an existing Shopify store to an enterprise buyer without skipping the order handoff.',
    intent: 'PunchOut implementation',
    sections: [
      {
        id: 'scope', title: '1. Define the buyer connection',
        paragraphs: [
          'Start with the customer requirement, not with a generic catalog launch. Identify the procurement system, protocol, test environment, buyer identity, store, collections and expected order documents. A single supplier may need a different connection for each buyer.',
          'Record what is known and what still needs confirmation. In particular, do not infer invoice format, delivery method or credentials from another buyer program.'
        ]
      },
      {
        id: 'configure', title: '2. Connect the store and assign access',
        steps: [
          { title: 'Connect the store', text: 'Use the Shopify or Shopify Plus store that already contains the supplier catalog.' },
          { title: 'Add the buyer', text: 'Create the buyer connection with its cXML or OCI requirements.' },
          { title: 'Assign catalog access', text: 'Choose the store and relevant collections or catalog scope for that buyer.' },
          { title: 'Prepare the test', text: 'Agree on the session, cart, approval, PO and order checks before launch.' }
        ]
      },
      {
        id: 'validate', title: '3. Validate the whole transaction',
        paragraphs: [
          'A good implementation test follows the buyer request through the supplier operation: PunchOut started, cart returned, buyer approved, PO received, store order created and invoice generated. Transaction visibility is useful because a team can see the stage where a transaction stopped and why.',
          'Do not declare success when only the catalog opens. The buyer must be able to return the cart and complete the agreed purchase-order path.'
        ]
      },
      {
        id: 'launch', title: '4. Go live with an operating handoff',
        bullets: [
          'Save the buyer-specific configuration and test evidence.',
          'Confirm who owns catalog access changes and buyer questions.',
          'Confirm how a missing PO or invoice issue will be investigated.',
          'Review connection count when adding another buyer or store.',
          'Use reporting and transaction history after launch to monitor activity.'
        ]
      }
    ],
    related: [
      ['/resources/punchout-testing-checklist/', 'Testing checklist', 'Run the implementation checks in order.'],
      ['/resources/punchout-supplier-onboarding/', 'Supplier onboarding', 'Prepare roles and buyer inputs.'],
      ['/documentation/', 'Setup documentation', 'Review the product setup sequence.'],
      ['/platform/transactions/', 'Transaction tracking', 'See how the lifecycle is monitored.']
    ],
    ctaTitle: 'Plan a real buyer implementation.',
    ctaText: 'Bring the store, procurement platform and buyer requirements to an implementation conversation.',
    secondaryLabel: 'Open documentation', secondaryHref: '/documentation/'
  },

  '/resources/punchout-testing-checklist/': {
    eyebrow: 'Testing checklist', breadcrumb: 'PunchOut testing checklist',
    title: 'PunchOut testing checklist: from catalog launch to PO.',
    lead: 'Use this buyer-facing checklist to test the connection that matters: the complete procurement-to-commerce journey.',
    intent: 'PunchOut testing checklist',
    sections: [
      {
        id: 'before', title: 'Before the test',
        bullets: [
          'Confirm the buyer platform, protocol and test account.',
          'Confirm the Shopify store and buyer-specific collections or catalog access.',
          'Agree which products, prices, quantities and references should appear.',
          'Confirm the expected cart return, approval and PO behavior.',
          'Record the buyer contact and the person who can investigate failures.'
        ]
      },
      {
        id: 'session', title: 'Test the PunchOut session',
        steps: [
          { title: 'Launch', text: 'Open the supplier catalog from the buyer procurement environment.' },
          { title: 'Authenticate', text: 'Confirm the buyer reaches the intended store and catalog scope.' },
          { title: 'Shop', text: 'Add representative products, quantities and variants required by the buyer.' },
          { title: 'Return', text: 'Send the cart back and confirm it appears in the buyer review flow.' }
        ]
      },
      {
        id: 'order', title: 'Test approval and order creation',
        steps: [
          { title: 'Approve', text: 'Complete the buyer-side approval path for the test requisition.' },
          { title: 'Receive the PO', text: 'Confirm the approved purchase order reaches the supplier connection.' },
          { title: 'Create the order', text: 'Confirm the related Shopify order is created after the PO arrives.' },
          { title: 'Review invoice activity', text: 'Check the invoice stage and confirm any buyer-specific delivery requirement.' }
        ]
      },
      {
        id: 'evidence', title: 'Record evidence and failure points',
        paragraphs: [
          'Save the buyer, store, catalog scope, timestamps and transaction reference used for the test. If the flow stops, record the last completed stage and the reason shown rather than describing the problem only as "PunchOut failed."',
          'Repeat the test after correcting the configuration. A new buyer or additional store needs its own connection and validation even when it uses the same Shopify operation.'
        ]
      }
    ],
    related: [
      ['/platform/transactions/', 'Transaction tracking', 'Find the stage where a flow stopped.'],
      ['/platform/purchase-orders/', 'Purchase orders', 'Understand the PO-to-order boundary.'],
      ['/documentation/', 'Setup documentation', 'Prepare the connection inputs.']
    ],
    ctaTitle: 'Need to test a live buyer requirement?',
    ctaText: 'Share the buyer system and expected flow so the test plan matches the actual connection.',
    secondaryLabel: 'Review transaction tracking', secondaryHref: '/platform/transactions/'
  },

  '/resources/punchout-supplier-onboarding/': {
    eyebrow: 'Supplier onboarding', breadcrumb: 'PunchOut supplier onboarding',
    title: 'PunchOut supplier onboarding: what to prepare first.',
    lead: 'A practical onboarding guide for the team that owns the Shopify store, buyer relationship and procurement connection.',
    intent: 'PunchOut supplier onboarding',
    sections: [
      {
        id: 'owners', title: 'Give the project clear owners',
        paragraphs: [
          'PunchOut onboarding touches commerce, procurement and operations. The store owner knows the catalog and collections; the buyer or sales owner knows the customer requirement; the operations or finance owner understands the PO and invoice handoff; and the technical contact helps with buyer-specific connection details.',
          'One person can hold more than one role, but the responsibilities still need to be explicit before testing begins.'
        ],
        bullets: [
          'Commerce owner: store, products, collections and catalog access.',
          'Buyer owner: procurement system, protocol, contacts and approval path.',
          'Operations owner: PO receipt, Shopify order and exception handling.',
          'Support owner: transaction investigation and post-launch questions.'
        ]
      },
      {
        id: 'inputs', title: 'Collect the onboarding inputs',
        bullets: [
          'The existing Shopify or Shopify Plus store to connect.',
          'The enterprise buyer and procurement environment.',
          'The cXML or OCI workflow and any buyer documentation.',
          'The collections or catalog access the buyer should receive.',
          'The expected PO, order and invoice requirements.',
          'The test contact, target date and go-live approval owner.'
        ]
      },
      {
        id: 'sequence', title: 'Use a repeatable onboarding sequence',
        steps: [
          { title: 'Connect store', text: 'Start with the store that contains the supplier catalog.' },
          { title: 'Add buyer', text: 'Configure the procurement connection and buyer context.' },
          { title: 'Assign access', text: 'Give the buyer the intended store and collections or catalog scope.' },
          { title: 'Test and launch', text: 'Validate the full flow before the buyer goes live.' }
        ]
      },
      {
        id: 'scale', title: 'Plan for the next buyer',
        paragraphs: [
          'One store can serve multiple buyers, and multiple stores and buyers can be managed centrally. Keep each connection distinct so a buyer-specific catalog or document requirement does not get lost in a shared operating model.',
          'The published pricing model counts a new buyer or an additional store as a connection. Free onboarding assistance is included, with no setup fee or transaction fee in the supplied playbook.'
        ]
      }
    ],
    related: [
      ['/solutions/enterprise-customer-onboarding/', 'Enterprise buyer onboarding', 'See the buyer setup problem in context.'],
      ['/solutions/one-store-multiple-buyers/', 'One store, multiple buyers', 'Plan a shared-store model.'],
      ['/pricing/', 'Connection pricing', 'Review plan allowances.'],
      ['/contact/', 'Contact the team', 'Bring the onboarding requirement.']
    ],
    ctaTitle: 'Ready to onboard the first buyer?',
    ctaText: 'Bring the store, buyer system and catalog scope to the onboarding discussion.',
    secondaryLabel: 'Compare connection plans', secondaryHref: '/pricing/'
  },

  '/resources/punchout-vs-hosted-catalog/': {
    eyebrow: 'Catalog comparison', breadcrumb: 'PunchOut vs hosted catalog',
    title: 'PunchOut vs hosted catalog: choose the right buying model.',
    lead: 'Understand the difference between a supplier-hosted PunchOut experience and catalog content maintained inside the buyer procurement system.',
    intent: 'PunchOut vs hosted catalog',
    comparisonHeaders: ['PunchOut', 'Hosted catalog'],
    comparison: [
      { label: 'Where content lives', cxml: 'PunchOut: the supplier maintains the shopping experience and catalog on its site.', oci: 'Hosted catalog: the buyer or its catalog process stores and maintains item content in procurement.' },
      { label: 'Shopping experience', cxml: 'The buyer opens the supplier store, searches and builds the cart there.', oci: 'The buyer searches and selects from catalog content available inside procurement.' },
      { label: 'Best fit', cxml: 'Rich, configurable, frequently changing or buyer-specific products and pricing.', oci: 'Stable item data that the buyer wants to search and manage locally.' },
      { label: 'Supplier responsibility', cxml: 'Maintain the store, access rules, connection and returned cart behavior.', oci: 'Provide accurate catalog data in the buyer\'s required format and update it when the buyer process requires.' }
    ],
    sections: [
      {
        id: 'punchout', title: 'Why a buyer may ask for PunchOut',
        paragraphs: [
          'PunchOut lets the buyer shop on the supplier site while keeping the requisition and approval process in procurement. It is useful when the supplier has a broad, configurable or frequently changing catalog that is better maintained in the supplier\'s ecommerce operation.',
          'The supplier can keep the Shopify or Shopify Plus catalog and return the selected cart to procurement rather than building a separate static catalog for every buyer.'
        ]
      },
      {
        id: 'hosted', title: 'When a hosted catalog may be a better fit',
        paragraphs: [
          'A hosted or buyer-maintained catalog can be useful when the buyer needs local search, internal classification or tightly controlled item content. It also creates a content-maintenance responsibility inside the buyer\'s procurement process.',
          'The right answer is often buyer-specific. Ask where the buyer needs product data, pricing and search to live before choosing the catalog model.'
        ]
      },
      {
        id: 'decision', title: 'Questions for the buyer conversation',
        bullets: [
          'Does the buyer need to open the supplier store from procurement?',
          'How often do product, price, availability or configuration details change?',
          'Does the buyer need local search before opening the supplier site?',
          'Who owns catalog updates and approval of item changes?',
          'What must be returned in the requisition and purchase order?'
        ]
      }
    ],
    references: [
      ['https://docs.oracle.com/en/cloud/saas/procurement/26d/oapro/punchout-catalogs.html', 'Oracle PunchOut catalog overview']
    ],
    related: [
      ['/resources/punchout-guide/', 'What is PunchOut?', 'Start with the core workflow.'],
      ['/platform/punchout/', 'PunchOut catalog software', 'See the product capability.'],
      ['/integrations/procurement-systems/', 'Procurement systems', 'Review buyer environment questions.']
    ],
    ctaTitle: 'Not sure which catalog model the buyer means?',
    ctaText: 'Share the buyer requirement and the current Shopify catalog so the options can be compared accurately.',
    secondaryLabel: 'Explore PunchOut capability', secondaryHref: '/platform/punchout/'
  },

  '/resources/level-1-vs-level-2-punchout/': {
    eyebrow: 'Technical guide', breadcrumb: 'Level 1 vs Level 2 PunchOut',
    title: 'Level 1 vs Level 2 PunchOut: store-level and item-level access.',
    lead: 'Understand the common distinction between opening a supplier store and linking a buyer directly to a category or item, without assuming every procurement system uses the same labels.',
    intent: 'Level 1 vs Level 2 PunchOut',
    comparisonHeaders: ['Level 1 / store', 'Level 2 / item'],
    comparison: [
      { label: 'Entry point', cxml: 'Level 1: the buyer opens the supplier store or a broad catalog destination.', oci: 'Level 2: the buyer starts closer to a category, shelf or product destination.' },
      { label: 'Catalog index', cxml: 'The buyer catalog may need only enough information to identify the supplier destination.', oci: 'The buyer catalog may include indexed category or item references that point deeper into the supplier site.' },
      { label: 'Buyer experience', cxml: 'The buyer navigates the supplier catalog after the session opens.', oci: 'The buyer can arrive at a more specific supplier destination when the buyer system and catalog support it.' },
      { label: 'Supplier test', cxml: 'Test the broad store launch, access and cart return.', oci: 'Test every supported entry point, the correct product context and the cart return.' }
    ],
    sections: [
      {
        id: 'labels', title: 'Why the labels need care',
        paragraphs: [
          'Procurement products and catalog standards do not always use the same terminology. Some buyer documentation calls the choices Level 1 and Level 2; cXML catalog guidance can describe store, aisle, shelf or product-level PunchOut. Treat the buyer\'s stated level and examples as the source of truth for the connection.',
          'Do not promise item-level deep linking simply because the buyer says "PunchOut." Confirm whether the buyer catalog can pass the required destination context and whether the supplier connection supports the expected flow.'
        ]
      },
      {
        id: 'test', title: 'What to test at each level',
        bullets: [
          'The buyer can see the intended catalog entry.',
          'The session opens the correct Shopify store and catalog scope.',
          'The buyer sees the expected category or item context.',
          'The buyer can add the intended item and return the cart.',
          'The approved PO contains the expected item references.'
        ]
      },
      {
        id: 'boundary', title: 'How this relates to PunchOut Central',
        paragraphs: [
          'PunchOut Central connects the buyer workflow to the existing Shopify or Shopify Plus store and assigns buyer-specific catalog access. The exact entry level remains a buyer-specific compatibility question that should be confirmed during onboarding and testing.',
          'Use this page to clarify the buyer vocabulary; use the integration and documentation pages to plan the actual connection.'
        ]
      }
    ],
    references: [
      ['https://help.sap.com/docs/business-network-for-trading-partners/creating-and-managing-customer-catalogs/creating-and-publishing-punchout-catalogs', 'SAP PunchOut catalog levels'],
      ['https://xml.cxml.org/current/cXMLUsersGuide.pdf', 'cXML PunchOut level terminology']
    ],
    related: [
      ['/resources/punchout-testing-checklist/', 'Testing checklist', 'Validate each buyer entry point.'],
      ['/integrations/cxml/', 'cXML PunchOut', 'Review the cXML connection path.'],
      ['/documentation/', 'Setup documentation', 'Prepare the catalog and test inputs.']
    ],
    ctaTitle: 'Need to clarify a Level 1 or Level 2 request?',
    ctaText: 'Bring the buyer catalog example and target Shopify store to the compatibility discussion.',
    secondaryLabel: 'Review testing', secondaryHref: '/resources/punchout-testing-checklist/'
  },

  '/resources/punchout-purchase-order-process/': {
    eyebrow: 'Procurement workflow', breadcrumb: 'PunchOut purchase order process',
    title: 'PunchOut purchase order process: from cart to Shopify order.',
    lead: 'See the boundary between a returned procurement cart, buyer approval, the approved PO and the final Shopify order.',
    intent: 'PunchOut purchase order process',
    sections: [
      {
        id: 'distinction', title: 'A returned cart is not a purchase order',
        paragraphs: [
          'During a PunchOut session, the buyer selects products in the supplier catalog and returns the cart to procurement. At that point the buyer has a requisition or request to review, not necessarily an approved order for the supplier.',
          'The buyer may change quantities, route the request for approval or reject it. The supplier should wait for the approved purchase order defined by the buyer connection before treating the transaction as the final order handoff.'
        ]
      },
      {
        id: 'steps', title: 'The six stages to follow',
        steps: [
          { title: 'PunchOut started', text: 'A buyer session opens the supplier catalog.' },
          { title: 'Cart returned', text: 'The selected cart goes back to procurement.' },
          { title: 'Buyer approved', text: 'The buyer completes its internal review and approval.' },
          { title: 'PO received', text: 'The approved purchase order reaches the supplier connection.' },
          { title: 'Store order created', text: 'The corresponding Shopify order is created.' },
          { title: 'Invoice generated', text: 'The invoice stage remains visible in the tracked journey.' }
        ]
      },
      {
        id: 'exceptions', title: 'What to investigate when the order is missing',
        bullets: [
          'Was the PunchOut session launched for the intended buyer and store?',
          'Did the cart return successfully to the buyer requisition?',
          'Did the buyer complete its approval process?',
          'Was the approved PO sent to the configured connection?',
          'Which transaction stage shows the stop and what reason is recorded?'
        ]
      },
      {
        id: 'handoff', title: 'Keep the buyer and supplier teams aligned',
        paragraphs: [
          'The buyer owns its approval process; the supplier owns the catalog and order operation. A useful implementation conversation names the handoff clearly so support teams do not treat a returned cart as a failed Shopify order or an unapproved request as a missing PO.',
          'PunchOut Central tracks the session, cart, approval, PO, store order and invoice so the team can review the whole transaction instead of guessing from one event.'
        ]
      }
    ],
    related: [
      ['/platform/purchase-orders/', 'Purchase order automation', 'See the product handoff boundary.'],
      ['/platform/transactions/', 'Transaction tracking', 'Follow the stages and failure reason.'],
      ['/resources/cxml-invoice-guide/', 'cXML invoice guide', 'Understand the later invoice question.']
    ],
    ctaTitle: 'Have a PO handoff to validate?',
    ctaText: 'Bring the buyer approval path and expected order document to the implementation discussion.',
    secondaryLabel: 'Open PO capability', secondaryHref: '/platform/purchase-orders/'
  },

  '/resources/cxml-invoice-guide/': {
    eyebrow: 'Invoice guide', breadcrumb: 'cXML invoice guide',
    title: 'cXML invoices: what to clarify after a PunchOut order.',
    lead: 'Understand the invoice question without overpromising a universal format or delivery method: invoice requirements belong to the buyer-specific transaction agreement.',
    intent: 'cXML invoice',
    sections: [
      {
        id: 'concept', title: 'Where the invoice fits',
        paragraphs: [
          'An invoice comes after the buyer has created or approved an order, so it is downstream from the PunchOut catalog session. The supplier and buyer must agree how invoice information is represented, routed and matched to the purchase order.',
          'cXML includes invoice document support in its broader standard, but the presence of an invoice document in the standard does not prove that every buyer requires cXML invoices or that every connection uses the same fields.'
        ]
      },
      {
        id: 'questions', title: 'Invoice questions to settle with the buyer',
        bullets: [
          'Does the buyer require cXML InvoiceDetailRequest or another invoice channel?',
          'Which PO number, line references and supplier identifiers must be included?',
          'When is the invoice considered ready to send?',
          'Which tax, freight, currency and payment fields are required?',
          'Where should the invoice be delivered and how is acceptance confirmed?',
          'What happens when an invoice does not match the approved PO?'
        ]
      },
      {
        id: 'lifecycle', title: 'Use the transaction history to locate invoice issues',
        steps: [
          { title: 'Find the buyer connection', text: 'Start with the procurement relationship and store used for the transaction.' },
          { title: 'Confirm the PO', text: 'Check that the approved PO and Shopify order belong to the same journey.' },
          { title: 'Review invoice stage', text: 'See whether invoice generation was recorded for the transaction.' },
          { title: 'Compare requirements', text: 'Match the recorded activity to the buyer-specific format and delivery agreement.' }
        ]
      },
      {
        id: 'boundary', title: 'What PunchOut Central verifies',
        paragraphs: [
          'The supplied product playbook confirms invoice generation as the final tracked transaction stage. It does not confirm one universal cXML invoice exchange for every buyer. Confirm the buyer-specific invoice behavior during onboarding before publishing a technical commitment.',
          'This distinction keeps the educational explanation useful while avoiding a claim that the platform replaces an accounting or accounts-payable system.'
        ]
      }
    ],
    references: [
      ['https://www.cxml.org/', 'cXML standard overview']
    ],
    related: [
      ['/platform/invoices/', 'Invoice activity', 'See the verified product behavior.'],
      ['/platform/purchase-orders/', 'Purchase orders', 'Review the stage before invoicing.'],
      ['/platform/transactions/', 'Transaction tracking', 'Keep the invoice in context.']
    ],
    ctaTitle: 'Need to confirm an invoice requirement?',
    ctaText: 'Share the buyer specification and PO flow so invoice behavior can be discussed accurately.',
    secondaryLabel: 'Review invoice activity', secondaryHref: '/platform/invoices/'
  },

  '/resources/punchout-glossary/': {
    eyebrow: 'Glossary', breadcrumb: 'PunchOut glossary',
    title: 'PunchOut glossary: procurement and commerce terms explained.',
    lead: 'A concise reference for the terms suppliers, buyers, ecommerce teams and implementation partners use when discussing PunchOut.',
    intent: 'PunchOut glossary',
    definitions: [
      ['Approval', 'The buyer-side review that decides whether a requisition or returned cart can proceed to an approved purchase order.'],
      ['Catalog access', 'The store, collections or product scope assigned to a specific buyer connection.'],
      ['cXML', 'Commerce XML, a structured protocol used for procurement and commerce messages, including PunchOut workflows.'],
      ['Connection', 'A configured buyer or store relationship. Under the published pricing model, a new buyer or additional store counts as a connection.'],
      ['Cart return', 'The step where products selected in the supplier catalog are sent back to the buyer procurement system for review.'],
      ['Hosted catalog', 'Catalog content maintained inside or for the buyer procurement environment rather than shopped through the supplier site.'],
      ['Invoice', 'A downstream commercial document associated with the order and buyer payment process; exact format and delivery are buyer-specific.'],
      ['OCI', 'Open Catalog Interface, an interface used to connect an external catalog with a procurement or ERP environment.'],
      ['PO', 'Purchase order: the approved buyer document sent to the supplier after the buyer approval process.'],
      ['PunchOut', 'A B2B purchasing method where the buyer opens a supplier ecommerce catalog from procurement, shops there and returns the cart for approval.'],
      ['PunchOut session', 'The active buyer interaction from catalog launch through cart return.'],
      ['Shopify order', 'The supplier store order created after the approved PO reaches the PunchOut connection.'],
      ['Store-level PunchOut', 'A broad entry point that opens the supplier store or catalog. It is often called Level 1 in buyer documentation.'],
      ['Item-level PunchOut', 'A more specific entry point to a category or product context. It is often called Level 2 in buyer documentation, but labels vary.'],
      ['Transaction journey', 'The tracked sequence from PunchOut Started through Cart Returned, Buyer Approved, PO Received, Store Order Created and Invoice Generated.']
    ],
    sections: [
      {
        id: 'use', title: 'How to use this glossary',
        paragraphs: [
          'Start with the buyer\'s own documentation when a term has a platform-specific meaning. In particular, confirm the buyer\'s use of cXML or OCI, its entry-level terminology and its invoice requirements.',
          'Then map the term to the actual Shopify store, catalog access and transaction stage involved in the connection.'
        ]
      }
    ],
    related: [
      ['/resources/punchout-guide/', 'What is PunchOut?', 'Read the end-to-end explanation.'],
      ['/resources/cxml-guide/', 'cXML guide', 'Go deeper on cXML terms.'],
      ['/resources/oci-guide/', 'OCI guide', 'Go deeper on OCI terms.'],
      ['/faq/', 'PunchOut FAQ', 'Review common supplier questions.']
    ],
    ctaTitle: 'Have a buyer term that is not clear?',
    ctaText: 'Send the buyer documentation or requirement and we can map it to the supplier workflow.',
    secondaryLabel: 'Read the FAQ', secondaryHref: '/faq/'
  }
});

export const resourcePagePaths = Object.freeze(Object.keys(resourcePages));
