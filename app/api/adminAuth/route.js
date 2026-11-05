import { NextResponse } from "next/server.js"
import { AdminUser } from "../schemas.js"
import { res, sanitizer } from "../syntaxShorter.js"
import jwt from "jsonwebtoken"
import middleware from "../middleware.js"


export async function GET(req) {
    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action')
    const userId = searchParams.get('userId')
    const pass = searchParams.get('userPass')
    try {
        switch (action) {
            case 'checkPass':
                const found = await AdminUser.findOne({ where: { id: userId } })
                if (found) {
                    const passHash = found.dataValues.password;
                    const isPass = await sanitizer.decryptPass(pass, passHash)
                    if (isPass) return res({ res: 'password checked!' }, 200);
                    else return res({ res: 'Incorrect Password!' }, 401)
                }
                return res({ res: 'User not found!' }, 404);
            case 'logout':
                const response = NextResponse.json({ msg: "logout" }, { status: 201 });
                response.cookies.set("adminAuth", "expire", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 0,
                    path: '/admin',
                    sameSite: "strict"
                })
                return response;
            default:
                const allUsers = await AdminUser.findAll();
                const data = allUsers.map(data => data.dataValues)
                return res(data, 200)
        }
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
        switch (action) {
            case 'login':
                const user = await AdminUser.findOne({ where: { username: body.username } })
                if (user) {
                    const pass = await sanitizer.decryptPass(body.password, user.dataValues.password)
                    if (pass) {
                        const { password, ...userInfo } = user.dataValues;
                        const token = jwt.sign(userInfo, process.env.JWT_SEC_KEY, { expiresIn: '1h' });
                        const response = NextResponse.json(userInfo, {
                            status: 200
                        })
                        response.cookies.set("adminAuth", token, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === "production",
                            maxAge: 1 * 60 * 60,
                            path: "/admin",
                            sameSite: "strict"
                        })
                        return response;
                    };
                    return res({ res: 'Incorrect password!' }, 401)
                }
                else return res({ res: 'user not found!' }, 404);
            default:
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
                return res({ res: 'request recieved' }, 200);
        };
    }
    catch (err) {
        console.log(err);
        return res({ err: 'Internal Server Error' }, 500)
    }
}

export async function DELETE(req) {
    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action')
    const userId = searchParams.get('userId')
    try {
        if (action === 'deleteUser') {
            const found = await AdminUser.findOne({ where: { id: userId } })
            if (found) {
                await found.destroy();
                return res({ res: 'User deleted successfully!' }, 200)
            }
            return res({ res: 'User not found!' }, 404)
        }
    }
    catch (err) {
        console.log(err);
        return res({ err: 'Internal Server Error' }, 500)
    }
}

export async function PUT(req) {
    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action')
    const newRole = searchParams.get('newRole')
    const userId = searchParams.get('userId')
    const user = searchParams.get('user')
    try {
        if (action === "updateRole") {
            const findUser = await AdminUser.findOne({ where: { id: userId } })
            if (findUser) {
                await findUser.update({ userRole: newRole ? newRole : findUser.dataValues.userRole })
                return res({ res: 'Role updated successfully!' }, 200)
            }
            return res({ res: 'User not found!' }, 404)
        }
        else {
            const body = await req.json()
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
                    // console.log(body)
                    const newDetails = await AdminUser.findOne({ where: { username: body.username } })
                    return res({ res: 'user details has been updated!', info: newDetails.dataValues }, 200)
                }
                return res({ res: 'Incorrect password!' }, 401)
            }
            return res({ res: 'user not found!' }, 404)
        }
    }
    catch (err) {
        console.log(err);
        return res({ err: 'Internal Server Error' }, 500)
    }
}