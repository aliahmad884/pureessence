// import { where } from "sequelize";
const { RegisterUser } = require("../schemas.js")
const { res, sanitizer } = require("../syntaxShorter.js")
import jwt from "jsonwebtoken";

const cookieOptions = {
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production', // secure in production
    sameSite: 'Strict',
    maxAge: 60 * 30, // 1 hour expiration
    path: '/', // Set for entire site
};

export async function POST(req) {
    const { searchParams } = new URL(req.url);
    const body = await req.json();
    const action = searchParams.get('action');
    try {
        if (action === 'logout') {
            const response = res({ message: 'Logged out successfully' }, 200);
            response.cookies.set('token', '', {
                httpOnly: true,
                secure: true, // Set to true if using HTTPS
                path: '/',
                expires: new Date(0)
            });
            return response;
        }
        if (action === 'signup') {
            if (body) {
                const found = await RegisterUser.findOne({ where: { Email: body.email } })
                if (found) return res({ res: 'User already exists!' }, 401)
                await RegisterUser.create({
                    FirstName: body.firstName,
                    LastName: body.lastName,
                    Email: body.email,
                    Password: await sanitizer.encryptPass(body.password)
                });
                return res({ res: 'User Registered Successfully!' }, 201);
            }
            return res({ res: 'Request Body is missing!' }, 400);
        }
        if (action === 'login') {
            if (body) {
                const found = await RegisterUser.findOne({
                    where: {
                        Email: body.Email
                    }
                });
                if (found) {
                    const passHash = found.dataValues.Password;
                    const validate = await sanitizer.decryptPass(body.Password, passHash);
                    if (validate) {
                        const authToken = jwt.sign({ email: found.dataValues.Email }, 'secretKey', { expiresIn: '30m' })
                        const response = res({ Name: `${found.dataValues.FirstName} ${found.dataValues.LastName}`, Email: found.dataValues.Email }, 200);
                        response.cookies.set('token', authToken, cookieOptions)
                        return response;
                    }
                    else return res({ res: 'Incorrect Password! Please recheck and try again' }, 401);
                };
                return res({ res: 'Incorrect Username and password!' }, 401);
            };
            return res({ res: 'Request Body is missing!' }, 400);
        };
        return res({ res: 'Something went wrong! please try again' }, 505);
    }
    catch (err) {
        console.log(err);
        return res({ err: 'Internel Server Error!' }, 500);
    };
};
