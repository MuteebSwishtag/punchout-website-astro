// Mirrors the visible FAQ. The SEO build check rejects schema/content drift.
export const faqItems = Object.freeze([
  ['What is PunchOut Central?', 'PunchOut Central connects a supplier Shopify or Shopify Plus store to enterprise procurement. It manages buyer connections and tracks the transaction from PunchOut session to invoice.'],
  ['Do we need a separate PunchOut storefront?', 'No. The current product uses the existing Shopify or Shopify Plus supplier store.'],
  ['What happens when a buyer returns a cart?', 'The cart goes back to the buyer procurement system for review and approval. The returned cart is not yet a Shopify order.'],
  ['When is the Shopify order created?', 'The corresponding Shopify order is created after the approved purchase order reaches PunchOut Central.'],
  ['Do you support cXML and OCI?', 'Yes. PunchOut Central supports both cXML and OCI procurement workflows.'],
  ['Which commerce platforms are available now?', 'Shopify and Shopify Plus are available now. BigCommerce and Magento are planned, not current production connectors.'],
  ['Can one Shopify store serve multiple buyers?', 'Yes. Each enterprise buyer can have its own connection and relevant collections or catalog access from the same store.'],
  ['Can we manage several Shopify stores?', 'Yes. Multiple stores and buyer connections can be managed centrally.'],
  ['How do we add a buyer?', 'Connect the store, choose the buyer store and catalog access, run a PunchOut test, validate the flow and then launch.'],
  ['Can we see where a transaction failed?', 'Yes. Transaction tracking shows the stage where it stopped and why, with line items, timestamps and activity.'],
  ['What invoice behavior is confirmed?', 'Invoice generation is the final tracked transaction stage. Confirm buyer-specific invoice formats and delivery requirements during onboarding.'],
  ['What do Launch, Growth and Scale cost?', 'Launch is $500/month for 1 connection, Growth is $1,000/month for up to 4, and Scale is $1,500/month for up to 7.'],
  ['What counts as a connection?', 'A new buyer or an additional store counts as a connection. Each connection beyond a plan allowance is $200/month.'],
  ['Are there setup or transaction fees?', 'No. There is no setup fee or transaction fee, and onboarding assistance is free.'],
  ['How can we get product support?', 'Use in-product tickets, help or chat, FAQs and phone support. You can also use the support email on the contact page.']
]);
