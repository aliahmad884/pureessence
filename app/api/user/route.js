const { res, sanitizer, getUserToken } = require("../syntaxShorter.js")
import jwt from "jsonwebtoken";
import { Cart, Order, RegisterUser } from "../schemas.js";
import { NextResponse } from "next/server"

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // secure in production
    sameSite: 'Strict',
    maxAge: 60 * 60 * 24 * 3,
    path: '/',
};

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('userEmail')
    const action = searchParams.get('action');
    try {
        if (userEmail && !action) {
            const found = await RegisterUser.findOne({ where: { email: userEmail } })
            return NextResponse({ data: found?.dataValues }, { status: 200 })
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
                secure: process.env.NODE_ENV === "production",
                path: '/',
                expires: 0
            });
            return response;
        }
        else if (action === 'signup') {
            if (body) {
                const found = await RegisterUser.findOne({ where: { email: body.email } })
                if (found) return res({ res: 'User already exists!' }, 401);
                const user = await RegisterUser.create({
                    first_name: body.firstName,
                    last_name: body.lastName,
                    email: body.email,
                    password: body.password ? await sanitizer.encryptPass(body.password) : null,
                    profile_pic: null,
                    reg_date: Date.now(),
                    last_login: Date.now(),
                    AuthMethod: authMethod
                });
                const { password, ...userInfo } = user.dataValues
                const authToken = jwt.sign(userInfo, process.env.JWT_USER_KEY, { expiresIn: '3d' })
                const response = res(userInfo, 200);
                response.cookies.set('token', authToken, cookieOptions)
                return response;
            }
            return res({ res: 'Request Body is missing!' }, 400);
        }
        else if (action === 'login') {
            const found = await RegisterUser.findOne({
                where: {
                    email: body.email
                }
            });
            if (found && authMethod === 'google') {
                const { password, ...userInfo } = found?.dataValues
                const authToken = jwt.sign(userInfo, process.env.JWT_USER_KEY, { expiresIn: '3d' })
                const response = res({ res: 'Logged in with google!' }, 200);
                response.cookies.set('token', authToken, cookieOptions)
                await RegisterUser.update({ LastLogin: Date.now() }, { where: { Id: found.dataValues.Id } })
                return response;
            }
            else if (found) {
                const { Password, ...userInfo } = found?.dataValues
                if (userInfo.AuthMethod === 'google') {
                    return res({ err: 'User already registered with Google' }, 200)
                }
                const passHash = found.dataValues.Password;
                const validate = await sanitizer.decryptPass(body.Password, passHash);
                if (validate) {
                    const authToken = jwt.sign(userInfo, process.env.JWT_USER_KEY, { expiresIn: '3d' })
                    const response = res(userInfo, 200);
                    response.cookies.set('token', authToken, cookieOptions)
                    await RegisterUser.update({ LastLogin: Date.now() }, { where: { Email: userInfo.Email } })
                    return response;
                }
            }
            return res({ res: 'Incorrect Username or Password! Please recheck and try again' }, 401);
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
    const userInfo = await getUserToken(req)
    if (!userInfo) return res({ res: "Unauthorized! no token provided" }, 401)
    try {
        const updateData = {
            first_name: body.first_name,
            last_name: body.last_name,
        };
        if (body.password?.trim()) updateData.password = await sanitizer.encryptPass(body.password);
        const update = await RegisterUser.update(
            updateData,
            { where: { email: userInfo.email } }
        )
        if (update) return NextResponse.json({ res: "User Updated Successfully!" }, { status: 201 })
        return res({ res: 'user not found with the email!' }, 404)
    }
    catch (err) {
        console.log(err);
        return res({ err: 'Internel Server Error!' }, 500);
    };
}


export async function DELETE(req) {
    const { searchParams } = new URL(req.url)
    let id = searchParams.get('userId')
    console.log(id)
    try {
        if (id) {
            const find = await RegisterUser.findByPk(id)
            if (find === null) return res({ res: `User Not found against param id: ${id}` }, 404)
            else {
                await find.destroy()
                return res({ res: 'User Deleted Successfully against id: ' + id }, 201)
            }
        }
        return res({ res: 'User Data Not Found!' }, 404)
    }
    catch (err) {
        console.log(err);
        return res({ err: 'Internel Server Error!' }, 500)
    }
}