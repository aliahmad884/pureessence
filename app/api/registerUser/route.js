import { where } from "sequelize";

const { RegisterUser } = require("../schemas.js")
const { res, sanitizer } = require("../syntaxShorter.js")


export async function POST(req) {
    const { searchParams } = new URL(req.url);
    const body = await req.json();
    const action = searchParams.get('action')
    console.log(action)
    try {
        if (action === 'signup') {
            if (body) {
                await RegisterUser.create({
                    FirstName: body.FirstName,
                    LastName: body.LastName,
                    Email: body.Email,
                    Password: await sanitizer.encryptPass(body.Password)
                })
                return res({ res: 'User Registered Successfully!' }, 201)
            }
            return res({ res: 'Request Body is missing!' }, 400)
        }
        if (action === 'login') {
            if (body) {
                const found = await RegisterUser.findOne({
                    where: {
                        Email: body.Email
                    }
                })
                const passHash = found.dataValues.Password
                const validate = await sanitizer.decryptPass(body.Password, passHash)
                if (validate) return res({ Name: `${found.dataValues.FirstName} ${found.dataValues.LastName}`, Email: found.dataValues.Email }, 200);
                return res({ res: 'Incorrect Username or password!' })
            }
            return res({ res: 'Request Body is missing!' }, 400)
        }
        return res({ res: 'Something went wrong! try again' }, 505)
    }
    catch (err) {
        console.log(err);
        return res({ err: 'Internel Server Error!' }, 500)
    }
}
