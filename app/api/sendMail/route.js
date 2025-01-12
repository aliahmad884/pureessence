const { res } = require('../syntaxShorter.js')
import nodemailer from "nodemailer"
import { cancelOrd, ordcancelConfirm } from "../mailTemplates.js"

export async function POST(req) {
  const body = await req.json()
  // console.log(body)

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_AUTH_USER,
      pass: process.env.SMTP_AUTH_PASS,
    },
  })

  try {
    const adminOptions = {
      from: `Cancel Order <${process.env.SMTP_AUTH_USER}>`,
      to: process.env.ADMIN_MAIL,
      subject: `Order Cancellation Request - OrderId #${body.id}`,
      html: cancelOrd(body)
    }
    const clientOptions = {
      from: `Admin@PurEssence <${process.env.SMTP_AUTH_USER}>`,
      to: body.shippingDetails.email,
      subject: `Working on Order Cancellation - OrderId #${body.id}`,
      html: ordcancelConfirm(body)
    }
    console.log('env process.env.SMTP_HOST: ', process.env.SMTP_HOST)
    console.log('env process.env.SMTP_AUTH_USER: ', process.env.SMTP_AUTH_USER)
    console.log('env process.env.SMTP_AUTH_PASS: ', process.env.SMTP_AUTH_PASS)
    await transporter.sendMail(adminOptions)
    await transporter.sendMail(clientOptions)
    return res({ res: 'Email Sent' }, 200)
  }
  catch (err) {
    console.log('Error in transporter', err)
    return res({ res: 'Internal Server Error!', err: err }, 500)
  }
}