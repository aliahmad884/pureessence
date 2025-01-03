const { res, sanitizer } = require("../syntaxShorter.js")
import jwt from "jsonwebtoken";
import { Cart, Order, RegisterUser } from "../schemas.js";

const cookieOptions = {
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production', // secure in production
    sameSite: 'Strict',
    maxAge: 60 * 60 * 24 * 3, // 1 hour expiration
    path: '/', // Set for entire site
};

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('userEmail')
    const action = searchParams.get('action');
    const pass = searchParams.get('pass')
    try {
        if (userEmail && !action) {
            const found = await RegisterUser.findOne({ where: { Email: userEmail } })
            return res(found.dataValues, 200)
        }
        else if (action === 'checkpass' && userEmail) {
            const findUser = await RegisterUser.findOne({ where: { Email: userEmail } })
            const prevPass = findUser.dataValues.Password;
            const compare = await sanitizer.decryptPass(pass, prevPass)
            if (compare) return res({ res: 's' }, 200);
            return res({ res: "Incorrect Password" }, 401)
        }
        const allUsers = await RegisterUser.findAll()
        const data = allUsers.map(data => data.dataValues);
        return res(data, 200)
    }
    catch (err) {
        console.log(err);
        return res({ res: 'internel server error!' }, 500)
    }
}

export async function POST(req) {
    const { searchParams } = new URL(req.url);
    const body = await req.json();
    const action = searchParams.get('action');
    const authMethod = searchParams.get('authMethod')
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
        else if (action === 'signup') {
            if (body) {
                const found = await RegisterUser.findOne({ where: { Email: body.email } })
                if (found) return res({ res: 'User already exists!' }, 401);
                await RegisterUser.create({
                    FirstName: body.firstName,
                    LastName: body.lastName,
                    Email: body.email,
                    Password: body.password ? await sanitizer.encryptPass(body.password) : null,
                    RegDate: Date.now(),
                    LastLogin: Date.now(),
                    AuthMethod: authMethod
                });
                const authToken = jwt.sign({ email: body.email }, 'secretKey', { expiresIn: '3d' })
                const response = res({ Name: `${body.firstName} ${body.lastName}`, Email: body.email }, 200);
                response.cookies.set('token', authToken, cookieOptions)
                return response;
            }
            return res({ res: 'Request Body is missing!' }, 400);
        }
        else if (action === 'login') {
            if (authMethod === 'google') {
                const authToken = jwt.sign({ email: body.Email }, 'secretKey', { expiresIn: '3d' })
                const response = res({ res: 'Logged in with google!' }, 200);
                response.cookies.set('token', authToken, cookieOptions)
                await RegisterUser.update({ LastLogin: Date.now() }, { where: { Email: body.Email } })
                return response;
            }
            else {
                const found = await RegisterUser.findOne({
                    where: {
                        Email: body.Email
                    }
                });
                if (found) {
                    const passHash = found.dataValues.Password;
                    const validate = await sanitizer.decryptPass(body.Password, passHash);
                    if (validate) {
                        const authToken = jwt.sign({ email: found.dataValues.Email }, 'secretKey', { expiresIn: '3d' })
                        const response = res({ Name: `${found.dataValues.FirstName} ${found.dataValues.LastName}`, Email: found.dataValues.Email }, 200);
                        response.cookies.set('token', authToken, cookieOptions)
                        await RegisterUser.update({ LastLogin: Date.now() }, { where: { Email: found.dataValues.Email } })
                        return response;
                    }
                    else return res({ res: 'Incorrect Password! Please recheck and try again' }, 401);
                };
                return res({ res: 'Incorrect Username and password!' }, 401);
            }
        };
        return res({ res: 'Something went wrong! please try again' }, 505);
    }
    catch (err) {
        console.log(err);
        return res({ err: 'Internel Server Error!' }, 500);
    };
};

export async function PUT(req) {
    const body = await req.json();
    try {
        const findUser = await RegisterUser.findOne({ where: { Email: body.currentEmail } })
        if (findUser) {
            await RegisterUser.update(
                {
                    FirstName: body.FirstName,
                    LastName: body.LastName,
                    Email: body.Email,
                    Password: (body.Password !== '') ? await sanitizer.encryptPass(body.Password) : findUser.dataValues.Password
                },
                { where: { Email: body.currentEmail } }
            )
            await Cart.update(
                {
                    userId: body.Email
                },
                { where: { userId: body.currentEmail } }
            )
            await Order.update(
                {
                    userId: body.Email
                },
                { where: { userId: body.currentEmail } }
            )
            return res({ res: 'request recieved' }, 200)
        }
        return res({ res: 'user not found with the email!' }, 404)
    }
    catch (err) {
        console.log(err);
        return res({ err: 'Internel Server Error!' }, 500);
    };
}
