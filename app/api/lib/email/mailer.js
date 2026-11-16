import nodemailer from 'nodemailer';

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_AUTH_USER,
        pass: process.env.SMTP_AUTH_PASS,
      },
    });
  }
  return transporter;
}

export function sendMail({ to, subject, html, text, replyTo }) {
  return getTransporter().sendMail({
    from: `PurEssence LTD <${process.env.SMTP_AUTH_USER}>`,
    to,
    subject,
    html,
    text,
    replyTo: replyTo || 'info@puressenceltd.co.uk',
  });
}