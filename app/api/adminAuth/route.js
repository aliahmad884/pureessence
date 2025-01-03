import { NextResponse } from "next/server.js"
import { AdminUser } from "../schemas.js"
import { res, sanitizer } from "../syntaxShorter.js"
import jwt from "jsonwebtoken"
import middleware from "../middleware.js"


export async function GET(req) {
    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action')
    try {
        // const response = middleware(req);
        // console.log(await response.json())
        const allUsers = await AdminUser.findAll();
        const data = allUsers.map(data => data.dataValues)
        return res(data, 200)
    }
    catch (err) {
        console.log(err);
        return res({ err: 'Internal Server Error' }, 500)
    }
}

export async function POST(req) {
    const body = await req.json()
    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action')
    try {
        if (action === 'login') {
            const user = await AdminUser.findOne({ where: { username: body.username } })
            if (user) {
                const pass = await sanitizer.decryptPass(body.password, user.dataValues.password)
                if (pass) {
                    // const token = jwt.sign({ username: body.username }, 'secretkey', { expiresIn: '30min' });
                    const response = res(user.dataValues, 200)
                    // response.cookies.set('session_token', token, {
                    //     httpOnly: true,
                    //     sameSite: 'strict',
                    //     // secure: process.env.NODE_ENV === "production",
                    //     path: '/admin',
                    //     maxAge: 60 * 30 //one min for testing
                    // })
                    return response;
                };
                return res({ res: 'Incorrect password!' }, 401)
            }
            return res({ res: 'user not found!' }, 404)
        }
        else {
            // const accessToken = req.cookies.get('session_token');
            // const token = req.cookies.get('session_token')?.value
            // console.log(accessToken)
            // const response = middleware(req);
            // console.log(await response.json())
            // if
            const checkExistMail = await AdminUser.findOne({ where: { email: body.email } })
            const checkExistName = await AdminUser.findOne({ where: { username: body.username } })
            if (checkExistMail) {
                return res({ res: 'Email already exists!' }, 400)
            } else if (checkExistName) {
                return res({ res: 'Username already exists!' }, 400)
            }
            await AdminUser.create({
                username: body.username,
                email: body.email,
                phone: body.phone,
                userRole: body.userRole,
                password: await sanitizer.encryptPass(body.newPass),
                proImg: null
            })
            // console.log(newUser.isNewRecord)
            return res({ res: 'request recieved' }, 200);
        }
    }
    catch (err) {
        console.log(err);
        return res({ err: 'Internal Server Error' }, 500)
    }
}

export async function PUT(req) {
    const body = await req.json()
    const { searchParams } = new URL(req.url)
    const user = searchParams.get('user')
    console.log(user)
    try {
        const findUser = await AdminUser.findOne({ where: { username: user } })
        if (findUser) {
            const isAuthenticate = await sanitizer.decryptPass(body.curPass, findUser.dataValues.password)
            console.log(isAuthenticate)
            if (isAuthenticate) {
                await AdminUser.update(
                    {
                        username: body.username,
                        email: body.email,
                        phone: body.phone,
                        proImg: body.proImg,
                        password: body.changePass ? await sanitizer.encryptPass(body.newPass) : findUser.dataValues.password
                    },
                    { where: { username: user } }
                )
                return res({ res: 'user details has been updated!' }, 200)
            }
            return res({ res: 'Incorrect password!' }, 401)
        }
        return res({ res: 'user not found!' }, 404)
    }
    catch (err) {
        console.log(err);
        return res({ err: 'Internal Server Error' }, 500)
    }
}