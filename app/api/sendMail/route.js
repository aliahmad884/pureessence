const { res } = require('../syntaxShorter.js')
import nodemailer from "nodemailer"

export async function POST(req) {
    const body = await req.json()
    console.log(body)
    let count = 0;
    const recipients = [
        'alilatakhun2003@gmail.com',
        'alilatakhun2003@gmail.com',
        'alilatakhun2003@gmail.com',
        'alilatakhun2003@gmail.com',
        'alilatakhun2003@gmail.com',
        'alilatakhun2003@gmail.com',
        'alilatakhun2003@gmail.com',
        'alilatakhun2003@gmail.com',
        'alilatakhun2003@gmail.com',
        'alilatakhun2003@gmail.com',
        'alilatakhun2003@gmail.com',
        'alilatakhun2003@gmail.com',
        'alilatakhun2003@gmail.com',
        'alilatakhun2003@gmail.com',
        'alilatakhun2003@gmail.com',
        'alilatakhun2003@gmail.com',
        'abuoin@gmail.com',
        'theprudent3627516@gmail.com',
        'aliahmadofficial884@gmail.com',
        'abuoin@gmail.com',
        'abuoin@gmail.com',
        'abuoin@gmail.com',
        'abuoin@gmail.com',
        'abuoin@gmail.com',
        'abuoin@gmail.com',
        'abuoin@gmail.com',
        'abuoin@gmail.com',
        'abuoin@gmail.com',
        'abuoin@gmail.com'
    ]
    // const { subject, text, html } = body;
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
        for (let i = 0; i < recipients.length; i++) {
            count = count + 1
            const emailOptions = {
                from: 'Admin@PurEssence <data@puressenceltd.co.uk>',
                to: recipients[i],
                subject: 'Spam Checking',
                text: 'Second test with SSl',
                html: `<p>Hello pa g ma spam nahi hon ${count}</p>`
            }
            let info = await transporter.sendMail(emailOptions)
            console.log(info.messageId)
        }
        return res({ res: 'Email Sent', index: count }, 200)
    }
    catch (err) {
        console.log(err)
        return res({ res: 'Internal Server Error!' }, 500)
    }
}