const { res } = require('../syntaxShorter.js')
import nodemailer from "nodemailer"
import { cancelOrd, ordcancelConfirm } from "../mailTemplates.js"

export async function POST(req) {
  const body = await req.json()
  // console.log(body)

  let transporter = nodemailer.createTransport({
    host: 'smtp.ionos.co.uk',
    port: 465,
    secure: true,
    auth: {
      user: 'data@puressenceltd.co.uk',
      pass: 'Lqv39KGQ6NUQ!_#',
    },
  })

  try {
    const adminOptions = {
      from: 'Cancel Order <data@puressenceltd.co.uk>',
      to: process.env.ADMIN_MAIL,
      subject: `Order Cancellation Request - OrderId #${body.id}`,
      html: cancelOrd(body)
    }
    const clientOptions = {
      from: 'Admin@PurEssence <data@puressenceltd.co.uk>',
      to: body.shippingDetails.email,
      subject: `Working on Order Cancellation - OrderId #${body.id}`,
      html: ordcancelConfirm(body)
    }
    await transporter.sendMail(adminOptions)
    await transporter.sendMail(clientOptions)
    return res({ res: 'Email Sent' }, 200)
  }
  catch (err) {
    console.log(err)
    return res({ res: 'Internal Server Error!' }, 500)
  }
}