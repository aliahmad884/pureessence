const { res } = require('../syntaxShorter.js')
import nodemailer from "nodemailer"

export async function POST(req) {
    const body = await req.json()

    const { fullName, email, tel, msg } = body;
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
        const emailOptions = {
            from: 'Contact Form <data@puressenceltd.co.uk>',
            to: 'data@puressenceltd.co.uk',
            subject: 'From Contact Form',
            html: `
                <div>
                    <h2>Sender Name: ${fullName}</h2>
                    <h2>Sender Phone: ${tel}</h2>
                    <h2>Message</h2>
                    <div style={{ margin: '20px 30px', textAlign: 'justify' }}>
                        <p style="font-size:1.2rem;">${msg}</p>
                    </div>
                </div>`
        }
        await transporter.sendMail(emailOptions)
        return res({ res: 'Email Sent' }, 200)
    }
    catch (err) {
        console.log(err)
        return res({ res: 'Internal Server Error!' }, 500)
    }
}