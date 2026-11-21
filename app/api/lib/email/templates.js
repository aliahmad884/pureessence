const BRAND = {
  name: 'PurEssence LTD',
  url: 'https://puressenceltd.co.uk',
  logo: 'https://puressenceltd.co.uk/logos/PE-Main-Logo.png',
  email: 'info@puressenceltd.co.uk',
  whatsapp: 'https://wa.me/441254411076',
  ink: '#1f2933',
  accent: '#b08d57',
  muted: '#6b7280',
  bg: '#f4f1ec',
  card: '#ffffff',
  line: '#e8e2d9',
};
const SANS = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";

/* ---------- helpers ---------- */
const esc = (v) =>
  String(v ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );

const gbp = (pence) => `£${(Number(pence || 0) / 100).toFixed(2)}`;
const poundsToPence = (v) => Math.round(Number(v || 0) * 100);

const parse = (v) => {
  if (typeof v === 'string') {
    try { return JSON.parse(v); } catch { return {}; }
  }
  return v || {};
};

function ctx(order) {
  const o = typeof order.toJSON === 'function' ? order.toJSON() : order;
  const ship = parse(o.shippingDetails);
  const rawItems = parse(o.product);
  return {
    o,
    ship,
    items: Array.isArray(rawItems) ? rawItems : [],
    name: [ship.firstName, ship.lastName].filter(Boolean).join(' ') || 'Customer',
    // adjust these field names to match your checkout form
    address: [ship.address, ship.city, ship.postcode || ship.zip, ship.country].filter(Boolean).join(', '),
    ref: o.order_id,
    total: gbp(poundsToPence(o.totalAmount)),
    shipPence: poundsToPence(o.shipFee),
    discountPence: poundsToPence(o.discount),
    date: new Date(o.orderDate || Date.now()).toLocaleString('en-GB', {
      dateStyle: 'long', timeStyle: 'short', timeZone: 'Europe/London',
    }),
    payment:
      o.paymentMethod === 'stripe' ? 'Card (paid securely via Stripe)'
      : o.paymentMethod === 'invoice' ? 'Invoice'
      : o.paymentMethod || 'Not specified',
  };
}

/* ---------- building blocks ---------- */
const p = (html) =>
  `<p style="margin:0 0 16px;font-family:${SANS};font-size:15px;line-height:1.65;color:${BRAND.ink};">${html}</p>`;

const sectionTitle = (t) =>
  `<h2 style="margin:32px 0 12px;font-family:${SANS};font-size:12px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:${BRAND.accent};">${esc(t)}</h2>`;

const button = (label, url) => `
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 8px;">
  <tr><td style="background:${BRAND.ink};border-radius:6px;">
    <a href="${esc(url)}" style="display:inline-block;padding:14px 28px;font-family:${SANS};font-size:14px;font-weight:600;letter-spacing:.3px;color:#ffffff;text-decoration:none;">${esc(label)}</a>
  </td></tr>
</table>`;

const detailRows = (rows) => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${BRAND.line};">
  ${rows.filter(([, v]) => v).map(([k, v]) => `
  <tr>
    <td style="padding:11px 0;border-bottom:1px solid ${BRAND.line};font-family:${SANS};font-size:13px;color:${BRAND.muted};width:38%;vertical-align:top;">${esc(k)}</td>
    <td style="padding:11px 0;border-bottom:1px solid ${BRAND.line};font-family:${SANS};font-size:14px;color:${BRAND.ink};vertical-align:top;">${v}</td>
  </tr>`).join('')}
</table>`;

function itemsTable(c) {
  const rows = c.items.map((i) => `
  <tr>
    <td style="padding:14px 0;border-bottom:1px solid ${BRAND.line};font-family:${SANS};font-size:14px;color:${BRAND.ink};">${esc(i.pName)}</td>
    <td align="center" style="padding:14px 8px;border-bottom:1px solid ${BRAND.line};font-family:${SANS};font-size:14px;color:${BRAND.muted};">× ${esc(i.qty)}</td>
    <td align="right" style="padding:14px 0;border-bottom:1px solid ${BRAND.line};font-family:${SANS};font-size:14px;color:${BRAND.ink};">${gbp(Number(i.price) * Number(i.qty))}</td>
  </tr>`).join('');

  const extra = (label, value) => `
  <tr>
    <td colspan="2" align="right" style="padding:8px 8px 0 0;font-family:${SANS};font-size:13px;color:${BRAND.muted};">${label}</td>
    <td align="right" style="padding:8px 0 0;font-family:${SANS};font-size:14px;color:${BRAND.ink};">${value}</td>
  </tr>`;

  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <th align="left" style="padding-bottom:8px;border-bottom:2px solid ${BRAND.ink};font-family:${SANS};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${BRAND.muted};">Item</th>
    <th style="padding-bottom:8px;border-bottom:2px solid ${BRAND.ink};font-family:${SANS};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${BRAND.muted};">Qty</th>
    <th align="right" style="padding-bottom:8px;border-bottom:2px solid ${BRAND.ink};font-family:${SANS};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${BRAND.muted};">Price</th>
  </tr>
  ${rows}
  ${c.shipPence > 0 ? extra('Shipping', gbp(c.shipPence)) : ''}
  ${c.discountPence > 0 ? extra('Discount', `−${gbp(c.discountPence)}`) : ''}
  <tr>
    <td colspan="2" align="right" style="padding:16px 8px 0 0;font-family:${SANS};font-size:14px;font-weight:700;color:${BRAND.ink};">Total</td>
    <td align="right" style="padding:16px 0 0;font-family:${SERIF};font-size:20px;font-weight:700;color:${BRAND.ink};">${c.total}</td>
  </tr>
</table>`;
}

function layout({ preheader, heading, body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(heading)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.bg};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;">
        <tr><td align="center" style="padding:0 0 24px;">
          <a href="${BRAND.url}"><img src="${BRAND.logo}" alt="${esc(BRAND.name)}" width="150" style="display:block;border:0;height:auto;"></a>
        </td></tr>
        <tr><td style="background:${BRAND.card};border:1px solid ${BRAND.line};border-radius:12px;overflow:hidden;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="height:4px;background:${BRAND.accent};font-size:0;line-height:0;">&nbsp;</td></tr>
            <tr><td style="padding:40px 36px 36px;">
              <h1 style="margin:0 0 20px;font-family:${SERIF};font-size:28px;line-height:1.25;font-weight:700;color:${BRAND.ink};">${esc(heading)}</h1>
              ${body}
            </td></tr>
          </table>
        </td></tr>
        <tr><td align="center" style="padding:24px 12px 0;font-family:${SANS};font-size:12px;line-height:1.7;color:${BRAND.muted};">
          Questions? Email <a href="mailto:${BRAND.email}" style="color:${BRAND.muted};">${BRAND.email}</a>
          or message us on <a href="${BRAND.whatsapp}" style="color:${BRAND.muted};">WhatsApp</a>.<br>
          © ${new Date().getFullYear()} ${esc(BRAND.name)}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

const adminLink = (c) => `${process.env.NEXT_PUBLIC_BASE_URL}/admin/orders/${c.o.order_id}`;

/* ---------- 1. Customer: order confirmation ---------- */
export function orderConfirmationEmail(order) {
  const c = ctx(order);
  const html = layout({
    preheader: `Thank you ${c.name}, your order ${c.ref} is confirmed.`,
    heading: 'Thank you for your order',
    body: `
      ${p(`Dear ${esc(c.ship.firstName || c.name)},`)}
      ${p(`We've received your payment and your order is now being prepared. We'll email you again as soon as it ships.`)}
      ${sectionTitle('Order summary')}
      ${detailRows([
        ['Order number', `<strong>${esc(c.ref)}</strong>`],
        ['Date', esc(c.date)],
        ['Payment', esc(c.payment)],
      ])}
      <div style="height:20px;"></div>
      ${itemsTable(c)}
      ${sectionTitle('Delivery details')}
      ${detailRows([
        ['Name', esc(c.name)],
        ['Address', esc(c.address)],
        ['Phone', esc(c.ship.phone)],
        ['Email', esc(c.ship.email)],
      ])}
      <div style="height:24px;"></div>
      ${p(`If anything looks wrong, just reply to this email and quote your order number.`)}
      ${p(`Warm regards,<br><strong>${esc(BRAND.name)}</strong>`)}
    `,
  });
  const text = `Thank you for your order, ${c.name}.\nOrder ${c.ref} (${c.date})\nTotal: ${c.total}\nWe'll email you when it ships.\nQuestions: ${BRAND.email}`;
  return { subject: `Order confirmed – ${c.ref}`, html, text };
}

/* ---------- 2. Admins: new order ---------- */
export function orderPlacedAdminEmail(order) {
  const c = ctx(order);
  const html = layout({
    preheader: `New order ${c.ref} from ${c.name} – ${c.total}`,
    heading: 'New order received',
    body: `
      ${p(`A new order has been placed and paid. Details below.`)}
      ${sectionTitle('Order')}
      ${detailRows([
        ['Order number', `<strong>${esc(c.ref)}</strong>`],
        ['Date', esc(c.date)],
        ['Payment', esc(c.payment)],
        ['Total', `<strong>${c.total}</strong>`],
        ['Status', esc(c.o.orderStatus)],
      ])}
      ${c.o.reviewNote ? `
        <div style="margin:20px 0 0;padding:14px 16px;background:#fff7ed;border:1px solid #fed7aa;border-radius:6px;font-family:${SANS};font-size:14px;line-height:1.6;color:#9a3412;">
          <strong>Needs review:</strong> ${esc(c.o.reviewNote)}
        </div>` : ''}
      ${sectionTitle('Customer')}
      ${detailRows([
        ['Name', esc(c.name)],
        ['Email', `<a href="mailto:${esc(c.ship.email)}" style="color:${BRAND.ink};">${esc(c.ship.email)}</a>`],
        ['Phone', esc(c.ship.phone)],
        ['Shipping address', esc(c.address)],
      ])}
      ${sectionTitle('Items')}
      ${itemsTable(c)}
      ${button('Open order in admin', adminLink(c))}
    `,
  });
  const text = `New order ${c.ref}\n${c.name} <${c.ship.email}>\nTotal: ${c.total}\n${adminLink(c)}`;
  return { subject: `New order ${c.ref} – ${c.total}`, html, text };
}

/* ---------- 3. Admins: cancellation request ---------- */
export function cancelRequestAdminEmail(order, reason) {
  const c = ctx(order);
  const html = layout({
    preheader: `Cancellation requested for order ${c.ref}`,
    heading: 'Cancellation requested',
    body: `
      ${p(`A customer has asked to cancel their order. Please review and take the necessary steps (refund, restocking, etc.).`)}
      ${sectionTitle('Order')}
      ${detailRows([
        ['Order number', `<strong>${esc(c.ref)}</strong>`],
        ['Placed', esc(c.date)],
        ['Total', c.total],
        ['Payment', esc(c.payment)],
      ])}
      ${sectionTitle('Customer')}
      ${detailRows([
        ['Name', esc(c.name)],
        ['Email', `<a href="mailto:${esc(c.ship.email)}" style="color:${BRAND.ink};">${esc(c.ship.email)}</a>`],
        ['Phone', esc(c.ship.phone)],
      ])}
      ${sectionTitle('Reason given')}
      <div style="padding:14px 16px;background:#f9f7f3;border:1px solid ${BRAND.line};border-radius:6px;font-family:${SANS};font-size:14px;line-height:1.65;color:${BRAND.ink};white-space:pre-wrap;">${esc(reason || 'No reason provided')}</div>
      ${button('Review order', adminLink(c))}
    `,
  });
  const text = `Cancellation requested for ${c.ref}\n${c.name} <${c.ship.email}>\nReason: ${reason}\n${adminLink(c)}`;
  return { subject: `Cancellation request – ${c.ref}`, html, text };
}

/* ---------- 4. Customer: cancellation received ---------- */
export function cancelRequestCustomerEmail(order) {
  const c = ctx(order);
  const html = layout({
    preheader: `We've received your cancellation request for order ${c.ref}.`,
    heading: 'We\'ve received your request',
    body: `
      ${p(`Dear ${esc(c.ship.firstName || c.name)},`)}
      ${p(`We've received your request to cancel order <strong>${esc(c.ref)}</strong>. Our team is reviewing it and will be in touch shortly with the next steps.`)}
      ${p(`Please note this is not yet a confirmed cancellation. If your order has already been dispatched, we may not be able to cancel it.`)}
      ${p(`Thank you for your patience.`)}
      ${p(`Warm regards,<br><strong>${esc(BRAND.name)}</strong>`)}
    `,
  });
  const text = `Hi ${c.name}, we've received your request to cancel order ${c.ref}. We'll be in touch shortly. ${BRAND.email}`;
  return { subject: `Cancellation request received – ${c.ref}`, html, text };
}