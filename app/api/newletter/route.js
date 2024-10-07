const { res } = require('../syntaxShorter.js')
const { NewsLetter } = require("../schemas.js")

export async function POST(req) {
    const body = await req.json()
    console.log(body)
    try {
        await NewsLetter.create({
            email: body.email
        })
        return res({ res: 'Request recieved' }, 200)
    }
    catch (err) {
        console.log(err);
        return res({ res: 'Internal server error!', error: err }, 500)
    }
}