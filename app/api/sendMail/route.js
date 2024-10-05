const { res } = require('../syntaxShorter.js')
import nodemailer from "nodemailer"

export async function POST(req) {
    const body =await req.json()
    console.log(body)
    // const { subject, text, html } = body;
    let transporter = nodemailer.createTransport({
        host: 'test.puressenceltd.co.uk',  // e.g., 'mail.yourdomain.com'
        port: 587,  // Use 465 for SSL, or 587 for TLS
        secure: false, // true for port 465, false for 587
        auth: {
            user: 'info@test.puressenceltd.co.uk', // Your cPanel email account
            pass: '3Ft4g@3b4', // Your cPanel email password
        },
    })

    const emailOptions = {
        from: 'info@test.puressenceltd.co.uk',
        to: 'alilatakhun2003@gmail.com',
        subject: 'Test Mail',
        text: 'Some plain text',
        html: '<p>Html Content</p>'
    }
    try {
        let info = await transporter.sendMail(emailOptions)
        console.log(info)
        return res({ res: 'request recieved' }, 200)
    }
    catch (err) {
        console.log(err)
        return res({ res: 'Internal Server Error!' }, 500)
    }
}