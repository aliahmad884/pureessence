import { sendMail } from './mailer';
import { orderConfirmationEmail, orderPlacedAdminEmail } from './templates';

const parse = (v) => (typeof v === 'string' ? JSON.parse(v) : v || {});

export async function sendOrderEmails(order) {
  const ship = parse(order.shippingDetails);

  if (!order.customerEmailSentAt) {
    try {
      if (!ship.email) throw new Error('No customer email on order');
      await sendMail({ to: ship.email, ...orderConfirmationEmail(order) });
      await order.update({ customerEmailSentAt: new Date() });
    } catch (err) {
      console.error(`Customer email failed for ${order.order_id}:`, err);
    }
  }

  if (!order.adminEmailSentAt) {
    try {
      await sendMail({ to: process.env.ADMIN_MAIL, ...orderPlacedAdminEmail(order) });
      await order.update({ adminEmailSentAt: new Date() });
    } catch (err) {
      console.error(`Admin email failed for ${order.order_id}:`, err);
    }
  }
}